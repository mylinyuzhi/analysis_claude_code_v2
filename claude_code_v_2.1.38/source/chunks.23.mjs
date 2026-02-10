
// @from(Ln 66668, Col 4)
EP8 = R((bxK) => {
    var CxK = Md6(),
        SxK = (A) => {
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
        hxK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class NP8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = CxK.FieldPosition.HEADER,
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
    class TP8 {
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
    class _e1 {
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
            let q = new _e1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = IxK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return _e1.clone(this)
        }
    }

    function IxK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class vP8 {
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

    function xxK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    bxK.Field = NP8;
    bxK.Fields = TP8;
    bxK.HttpRequest = _e1;
    bxK.HttpResponse = vP8;
    bxK.getHttpHandlerExtensionConfiguration = SxK;
    bxK.isValidHostname = xxK;
    bxK.resolveHttpHandlerRuntimeConfig = hxK
})
// @from(Ln 66810, Col 4)
mP8 = R((FH1) => {
    var RP8 = wb(),
        fd6 = rf(),
        Wd6 = Md6(),
        pxK = R$(),
        kP8 = nf();
    class yP8 {
        config;
        middlewareStack = RP8.constructStack();
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
    var Pd6 = "***SensitiveInformation***";

    function Gd6(A, q) {
        if (q == null) return q;
        let K = pxK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return Pd6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return Pd6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return Pd6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = Gd6(H, Y[w]);
            return z
        }
        return q
    }
    class Vd6 {
        middlewareStack = RP8.constructStack();
        schema;
        static classBuilder() {
            return new CP8
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
                    [Wd6.SMITHY_CONTEXT_KEY]: {
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
    class CP8 {
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
            return q = class extends Vd6 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? Gd6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? Gd6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var dxK = "***SensitiveInformation***",
        cxK = (A, q) => {
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
    class mH1 extends Error {
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
            return mH1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === mH1) return mH1.isInstance(A);
            if (mH1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var SP8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        hP8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = ixK(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw SP8(H, q)
        },
        lxK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                hP8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        ixK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        nxK = (A) => {
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
        LP8 = !1,
        rxK = (A) => {
            if (A && !LP8 && parseInt(A.substring(1, A.indexOf("."))) < 16) LP8 = !0
        },
        oxK = (A) => {
            let q = [];
            for (let K in Wd6.AlgorithmId) {
                let Y = Wd6.AlgorithmId[K];
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
        axK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        sxK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        txK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        IP8 = (A) => {
            return Object.assign(oxK(A), sxK(A))
        },
        exK = IP8,
        AbK = (A) => {
            return Object.assign(axK(A), txK(A))
        },
        qbK = (A) => Array.isArray(A) ? A : [A],
        xP8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = xP8(A[K]);
            return A
        },
        KbK = (A) => {
            return A != null
        };
    class bP8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function uP8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, wbK(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            BP8(Y, null, w, H)
        }
        return Y
    }
    var YbK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        zbK = (A, q) => {
            let K = {};
            for (let Y in q) BP8(K, A, q, Y);
            return K
        },
        wbK = (A, q, K) => {
            return uP8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        BP8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = HbK, O = $bK, _ = Y] = H;
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
        HbK = (A) => A != null,
        $bK = (A) => A,
        ObK = (A) => {
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
        _bK = (A) => A.toISOString().replace(".000Z", "Z"),
        Zd6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Zd6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Zd6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(FH1, "collectBody", {
        enumerable: !0,
        get: function() {
            return fd6.collectBody
        }
    });
    Object.defineProperty(FH1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return fd6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(FH1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return fd6.resolvedPath
        }
    });
    FH1.Client = yP8;
    FH1.Command = Vd6;
    FH1.NoOpLogger = bP8;
    FH1.SENSITIVE_STRING = dxK;
    FH1.ServiceException = mH1;
    FH1._json = Zd6;
    FH1.convertMap = YbK;
    FH1.createAggregatedClient = cxK;
    FH1.decorateServiceException = SP8;
    FH1.emitWarningIfUnsupportedVersion = rxK;
    FH1.getArrayIfSingleItem = qbK;
    FH1.getDefaultClientConfiguration = exK;
    FH1.getDefaultExtensionConfiguration = IP8;
    FH1.getValueFromTextNode = xP8;
    FH1.isSerializableHeaderValue = KbK;
    FH1.loadConfigsForDefaultMode = nxK;
    FH1.map = uP8;
    FH1.resolveDefaultRuntimeConfig = AbK;
    FH1.serializeDateTime = _bK;
    FH1.serializeFloat = ObK;
    FH1.take = zbK;
    FH1.throwDefaultError = hP8;
    FH1.withBaseException = lxK;
    Object.keys(kP8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(FH1, A)) Object.defineProperty(FH1, A, {
            enumerable: !0,
            get: function() {
                return kP8[A]
            }
        })
    })
})
// @from(Ln 67280, Col 4)
QP8 = R((FP8) => {
    Object.defineProperty(FP8, "__esModule", {
        value: !0
    });
    FP8.createGetRequest = BbK;
    FP8.getCredentials = mbK;
    var Nd6 = wX(),
        xbK = EP8(),
        bbK = mP8(),
        ubK = tQ6();

    function BbK(A) {
        return new xbK.HttpRequest({
            protocol: A.protocol,
            hostname: A.hostname,
            port: Number(A.port),
            path: A.pathname,
            query: Array.from(A.searchParams.entries()).reduce((q, [K, Y]) => {
                return q[K] = Y, q
            }, {}),
            fragment: A.hash
        })
    }
    async function mbK(A, q) {
        let Y = await (0, ubK.sdkStreamMixin)(A.body).transformToString();
        if (A.statusCode === 200) {
            let z = JSON.parse(Y);
            if (typeof z.AccessKeyId !== "string" || typeof z.SecretAccessKey !== "string" || typeof z.Token !== "string" || typeof z.Expiration !== "string") throw new Nd6.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
                logger: q
            });
            return {
                accessKeyId: z.AccessKeyId,
                secretAccessKey: z.SecretAccessKey,
                sessionToken: z.Token,
                expiration: (0, bbK.parseRfc3339DateTime)(z.Expiration)
            }
        }
        if (A.statusCode >= 400 && A.statusCode < 500) {
            let z = {};
            try {
                z = JSON.parse(Y)
            } catch (w) {}
            throw Object.assign(new Nd6.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
                logger: q
            }), {
                Code: z.Code,
                Message: z.Message
            })
        }
        throw new Nd6.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
            logger: q
        })
    }
})
// @from(Ln 67334, Col 4)
pP8 = R((gP8) => {
    Object.defineProperty(gP8, "__esModule", {
        value: !0
    });
    gP8.retryWrapper = void 0;
    var gbK = (A, q, K) => {
        return async () => {
            for (let Y = 0; Y < q; ++Y) try {
                return await A()
            } catch (z) {
                await new Promise((w) => setTimeout(w, K))
            }
            return await A()
        }
    };
    gP8.retryWrapper = gbK
})
// @from(Ln 67351, Col 4)
nP8 = R((lP8) => {
    Object.defineProperty(lP8, "__esModule", {
        value: !0
    });
    lP8.fromHttp = void 0;
    var UbK = n2(),
        pbK = of(),
        dbK = cf(),
        dP8 = wX(),
        cbK = UbK.__importDefault(h1("fs/promises")),
        lbK = VP8(),
        cP8 = QP8(),
        ibK = pP8(),
        nbK = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        rbK = "http://169.254.170.2",
        obK = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
        abK = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
        sbK = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
        tbK = (A = {}) => {
            A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
            let q, K = A.awsContainerCredentialsRelativeUri ?? process.env[nbK],
                Y = A.awsContainerCredentialsFullUri ?? process.env[obK],
                z = A.awsContainerAuthorizationToken ?? process.env[sbK],
                w = A.awsContainerAuthorizationTokenFile ?? process.env[abK],
                H = A.logger?.constructor?.name === "NoOpLogger" || !A.logger?.warn ? console.warn : A.logger.warn.bind(A.logger);
            if (K && Y) H("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), H("awsContainerCredentialsFullUri will take precedence.");
            if (z && w) H("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), H("awsContainerAuthorizationToken will take precedence.");
            if (Y) q = Y;
            else if (K) q = `${rbK}${K}`;
            else throw new dP8.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
                logger: A.logger
            });
            let $ = new URL(q);
            (0, lbK.checkUrl)($, A.logger);
            let O = dbK.NodeHttpHandler.create({
                requestTimeout: A.timeout ?? 1000,
                connectionTimeout: A.timeout ?? 1000
            });
            return (0, ibK.retryWrapper)(async () => {
                let _ = (0, cP8.createGetRequest)($);
                if (z) _.headers.Authorization = z;
                else if (w) _.headers.Authorization = (await cbK.default.readFile(w)).toString();
                try {
                    let J = await O.handle(_);
                    return (0, cP8.getCredentials)(J.response).then((X) => (0, pbK.setCredentialFeature)(X, "CREDENTIALS_HTTP", "z"))
                } catch (J) {
                    throw new dP8.CredentialsProviderError(String(J), {
                        logger: A.logger
                    })
                }
            }, A.maxRetries ?? 3, A.timeout ?? 1000)
        };
    lP8.fromHttp = tbK
})
// @from(Ln 67406, Col 4)
Je1 = R((Td6) => {
    Object.defineProperty(Td6, "__esModule", {
        value: !0
    });
    Td6.fromHttp = void 0;
    var ebK = nP8();
    Object.defineProperty(Td6, "fromHttp", {
        enumerable: !0,
        get: function() {
            return ebK.fromHttp
        }
    })
})
// @from(Ln 67419, Col 4)
zW8 = R((JuK) => {
    var vd6 = xt1(),
        Fi = lz(),
        rP8 = wX(),
        quK = of(),
        oP8 = _U6(),
        aP8 = (A) => vd6.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0,
        Ed6 = (A) => new Date(Date.now() + A),
        KuK = (A, q) => Math.abs(Ed6(q).getTime() - A) >= 300000,
        sP8 = (A, q) => {
            let K = Date.parse(A);
            if (KuK(K, q)) return K - Date.now();
            return q
        },
        IE1 = (A, q) => {
            if (!q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
            return q
        },
        kd6 = async (A) => {
            let q = IE1("context", A.context),
                K = IE1("config", A.config),
                Y = q.endpointV2?.properties?.authSchemes?.[0],
                w = await IE1("signer", K.signer)(Y),
                H = A?.signingRegion,
                $ = A?.signingRegionSet,
                O = A?.signingName;
            return {
                config: K,
                signer: w,
                signingRegion: H,
                signingRegionSet: $,
                signingName: O
            }
        };
    class Xe1 {
        async sign(A, q, K) {
            if (!vd6.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let Y = await kd6(K),
                {
                    config: z,
                    signer: w
                } = Y,
                {
                    signingRegion: H,
                    signingName: $
                } = Y,
                O = K.context;
            if (O?.authSchemes?.length ?? !1) {
                let [J, X] = O.authSchemes;
                if (J?.name === "sigv4a" && X?.name === "sigv4") H = X?.signingRegion ?? H, $ = X?.signingName ?? $
            }
            return await w.sign(A, {
                signingDate: Ed6(z.systemClockOffset),
                signingRegion: H,
                signingService: $
            })
        }
        errorHandler(A) {
            return (q) => {
                let K = q.ServerTime ?? aP8(q.$response);
                if (K) {
                    let Y = IE1("config", A.config),
                        z = Y.systemClockOffset;
                    if (Y.systemClockOffset = sP8(K, Y.systemClockOffset), Y.systemClockOffset !== z && q.$metadata) q.$metadata.clockSkewCorrected = !0
                }
                throw q
            }
        }
        successHandler(A, q) {
            let K = aP8(A);
            if (K) {
                let Y = IE1("config", q.config);
                Y.systemClockOffset = sP8(K, Y.systemClockOffset)
            }
        }
    }
    var YuK = Xe1;
    class qW8 extends Xe1 {
        async sign(A, q, K) {
            if (!vd6.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let {
                config: Y,
                signer: z,
                signingRegion: w,
                signingRegionSet: H,
                signingName: $
            } = await kd6(K), _ = (await Y.sigv4aSigningRegionSet?.() ?? H ?? [w]).join(",");
            return await z.sign(A, {
                signingDate: Ed6(Y.systemClockOffset),
                signingRegion: _,
                signingService: $
            })
        }
    }
    var tP8 = (A) => typeof A === "string" && A.length > 0 ? A.split(",").map((q) => q.trim()) : [],
        KW8 = (A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`,
        eP8 = "AWS_AUTH_SCHEME_PREFERENCE",
        AW8 = "auth_scheme_preference",
        zuK = {
            environmentVariableSelector: (A, q) => {
                if (q?.signingName) {
                    if (KW8(q.signingName) in A) return ["httpBearerAuth"]
                }
                if (!(eP8 in A)) return;
                return tP8(A[eP8])
            },
            configFileSelector: (A) => {
                if (!(AW8 in A)) return;
                return tP8(A[AW8])
            },
            default: []
        },
        wuK = (A) => {
            return A.sigv4aSigningRegionSet = Fi.normalizeProvider(A.sigv4aSigningRegionSet), A
        },
        HuK = {
            environmentVariableSelector(A) {
                if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((q) => q.trim());
                throw new rP8.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
                    tryNextLink: !0
                })
            },
            configFileSelector(A) {
                if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((q) => q.trim());
                throw new rP8.ProviderError("sigv4a_signing_region_set not set in profile.", {
                    tryNextLink: !0
                })
            },
            default: void 0
        },
        YW8 = (A) => {
            let q = A.credentials,
                K = !!A.credentials,
                Y = void 0;
            Object.defineProperty(A, "credentials", {
                set(_) {
                    if (_ && _ !== q && _ !== Y) K = !0;
                    q = _;
                    let J = OuK(A, {
                            credentials: q,
                            credentialDefaultProvider: A.credentialDefaultProvider
                        }),
                        X = _uK(A, J);
                    if (K && !X.attributed) Y = async (D) => X(D).then((j) => quK.setCredentialFeature(j, "CREDENTIALS_CODE", "e")), Y.memoized = X.memoized, Y.configBound = X.configBound, Y.attributed = !0;
                    else Y = X
                },
                get() {
                    return Y
                },
                enumerable: !0,
                configurable: !0
            }), A.credentials = q;
            let {
                signingEscapePath: z = !0,
                systemClockOffset: w = A.systemClockOffset || 0,
                sha256: H
            } = A, $;
            if (A.signer) $ = Fi.normalizeProvider(A.signer);
            else if (A.regionInfoProvider) $ = () => Fi.normalizeProvider(A.region)().then(async (_) => [await A.regionInfoProvider(_, {
                useFipsEndpoint: await A.useFipsEndpoint(),
                useDualstackEndpoint: await A.useDualstackEndpoint()
            }) || {}, _]).then(([_, J]) => {
                let {
                    signingRegion: X,
                    signingService: D
                } = _;
                A.signingRegion = A.signingRegion || X || J, A.signingName = A.signingName || D || A.serviceId;
                let j = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: H,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || oP8.SignatureV4)(j)
            });
            else $ = async (_) => {
                _ = Object.assign({}, {
                    name: "sigv4",
                    signingName: A.signingName || A.defaultSigningName,
                    signingRegion: await Fi.normalizeProvider(A.region)(),
                    properties: {}
                }, _);
                let {
                    signingRegion: J,
                    signingName: X
                } = _;
                A.signingRegion = A.signingRegion || J, A.signingName = A.signingName || X || A.serviceId;
                let D = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: H,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || oP8.SignatureV4)(D)
            };
            return Object.assign(A, {
                systemClockOffset: w,
                signingEscapePath: z,
                signer: $
            })
        },
        $uK = YW8;

    function OuK(A, {
        credentials: q,
        credentialDefaultProvider: K
    }) {
        let Y;
        if (q)
            if (!q?.memoized) Y = Fi.memoizeIdentityProvider(q, Fi.isIdentityExpired, Fi.doesIdentityRequireRefresh);
            else Y = q;
        else if (K) Y = Fi.normalizeProvider(K(Object.assign({}, A, {
            parentClientConfig: A
        })));
        else Y = async () => {
            throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
        };
        return Y.memoized = !0, Y
    }

    function _uK(A, q) {
        if (q.configBound) return q;
        let K = async (Y) => q({
            ...Y,
            callerClientConfig: A
        });
        return K.memoized = q.memoized, K.configBound = !0, K
    }
    JuK.AWSSDKSigV4Signer = YuK;
    JuK.AwsSdkSigV4ASigner = qW8;
    JuK.AwsSdkSigV4Signer = Xe1;
    JuK.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = zuK;
    JuK.NODE_SIGV4A_CONFIG_OPTIONS = HuK;
    JuK.getBearerTokenEnvKey = KW8;
    JuK.resolveAWSSDKSigV4Config = $uK;
    JuK.resolveAwsSdkSigV4AConfig = wuK;
    JuK.resolveAwsSdkSigV4Config = YW8;
    JuK.validateSigningProperties = kd6
})
// @from(Ln 67662, Col 4)
Id6 = R((LuK) => {
    LuK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(LuK.HttpAuthLocation || (LuK.HttpAuthLocation = {}));
    LuK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(LuK.HttpApiKeyAuthLocation || (LuK.HttpApiKeyAuthLocation = {}));
    LuK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(LuK.EndpointURLScheme || (LuK.EndpointURLScheme = {}));
    LuK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(LuK.AlgorithmId || (LuK.AlgorithmId = {}));
    var NuK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => LuK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => LuK.AlgorithmId.MD5,
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
        TuK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        vuK = (A) => {
            return NuK(A)
        },
        EuK = (A) => {
            return TuK(A)
        };
    LuK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(LuK.FieldPosition || (LuK.FieldPosition = {}));
    var kuK = "__smithy_context";
    LuK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(LuK.IniSectionType || (LuK.IniSectionType = {}));
    LuK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(LuK.RequestHandlerProtocol || (LuK.RequestHandlerProtocol = {}));
    LuK.SMITHY_CONTEXT_KEY = kuK;
    LuK.getDefaultClientConfiguration = vuK;
    LuK.resolveDefaultRuntimeConfig = EuK
})
// @from(Ln 67727, Col 4)
uG = R((gH1) => {
    var $W8 = wb(),
        md6 = rf(),
        bd6 = Id6(),
        SuK = R$(),
        wW8 = nf();
    class OW8 {
        config;
        middlewareStack = $W8.constructStack();
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
    var xd6 = "***SensitiveInformation***";

    function ud6(A, q) {
        if (q == null) return q;
        let K = SuK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return xd6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return xd6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return xd6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = ud6(H, Y[w]);
            return z
        }
        return q
    }
    class Fd6 {
        middlewareStack = $W8.constructStack();
        schema;
        static classBuilder() {
            return new _W8
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
                    [bd6.SMITHY_CONTEXT_KEY]: {
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
    class _W8 {
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
            return q = class extends Fd6 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? ud6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? ud6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var huK = "***SensitiveInformation***",
        IuK = (A, q) => {
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
    class QH1 extends Error {
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
            return QH1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === QH1) return QH1.isInstance(A);
            if (QH1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var JW8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        XW8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = buK(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw JW8(H, q)
        },
        xuK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                XW8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        buK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        uuK = (A) => {
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
        HW8 = !1,
        BuK = (A) => {
            if (A && !HW8 && parseInt(A.substring(1, A.indexOf("."))) < 16) HW8 = !0
        },
        muK = (A) => {
            let q = [];
            for (let K in bd6.AlgorithmId) {
                let Y = bd6.AlgorithmId[K];
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
        FuK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        QuK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        guK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        DW8 = (A) => {
            return Object.assign(muK(A), QuK(A))
        },
        UuK = DW8,
        puK = (A) => {
            return Object.assign(FuK(A), guK(A))
        },
        duK = (A) => Array.isArray(A) ? A : [A],
        jW8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = jW8(A[K]);
            return A
        },
        cuK = (A) => {
            return A != null
        };
    class MW8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function PW8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, nuK(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            WW8(Y, null, w, H)
        }
        return Y
    }
    var luK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        iuK = (A, q) => {
            let K = {};
            for (let Y in q) WW8(K, A, q, Y);
            return K
        },
        nuK = (A, q, K) => {
            return PW8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        WW8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = ruK, O = ouK, _ = Y] = H;
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
        ruK = (A) => A != null,
        ouK = (A) => A,
        auK = (A) => {
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
        suK = (A) => A.toISOString().replace(".000Z", "Z"),
        Bd6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Bd6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Bd6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(gH1, "collectBody", {
        enumerable: !0,
        get: function() {
            return md6.collectBody
        }
    });
    Object.defineProperty(gH1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return md6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(gH1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return md6.resolvedPath
        }
    });
    gH1.Client = OW8;
    gH1.Command = Fd6;
    gH1.NoOpLogger = MW8;
    gH1.SENSITIVE_STRING = huK;
    gH1.ServiceException = QH1;
    gH1._json = Bd6;
    gH1.convertMap = luK;
    gH1.createAggregatedClient = IuK;
    gH1.decorateServiceException = JW8;
    gH1.emitWarningIfUnsupportedVersion = BuK;
    gH1.getArrayIfSingleItem = duK;
    gH1.getDefaultClientConfiguration = UuK;
    gH1.getDefaultExtensionConfiguration = DW8;
    gH1.getValueFromTextNode = jW8;
    gH1.isSerializableHeaderValue = cuK;
    gH1.loadConfigsForDefaultMode = uuK;
    gH1.map = PW8;
    gH1.resolveDefaultRuntimeConfig = puK;
    gH1.serializeDateTime = suK;
    gH1.serializeFloat = auK;
    gH1.take = iuK;
    gH1.throwDefaultError = XW8;
    gH1.withBaseException = xuK;
    Object.keys(wW8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(gH1, A)) Object.defineProperty(gH1, A, {
            enumerable: !0,
            get: function() {
                return wW8[A]
            }
        })
    })
})
// @from(Ln 68197, Col 4)
gd6 = R((GW8) => {
    Object.defineProperty(GW8, "__esModule", {
        value: !0
    });
    GW8.resolveHttpAuthSchemeConfig = GW8.defaultSSOOIDCHttpAuthSchemeProvider = GW8.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
    var NBK = YH(),
        Qd6 = iP(),
        TBK = async (A, q, K) => {
            return {
                operation: (0, Qd6.getSmithyContext)(q).operation,
                region: await (0, Qd6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    GW8.defaultSSOOIDCHttpAuthSchemeParametersProvider = TBK;

    function vBK(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sso-oauth",
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

    function EBK(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var kBK = (A) => {
        let q = [];
        switch (A.operation) {
            case "CreateToken": {
                q.push(EBK(A));
                break
            }
            default:
                q.push(vBK(A))
        }
        return q
    };
    GW8.defaultSSOOIDCHttpAuthSchemeProvider = kBK;
    var LBK = (A) => {
        let q = (0, NBK.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, Qd6.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    GW8.resolveHttpAuthSchemeConfig = LBK
})
// @from(Ln 68256, Col 4)
De1 = R((X62, CBK) => {
    CBK.exports = {
        name: "@aws-sdk/nested-clients",
        version: "3.936.0",
        description: "Nested clients for AWS SDK packages.",
        main: "./dist-cjs/index.js",
        module: "./dist-es/index.js",
        types: "./dist-types/index.d.ts",
        scripts: {
            build: "yarn lint && concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline nested-clients",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            lint: "node ../../scripts/validation/submodules-linter.js --pkg nested-clients",
            test: "yarn g:vitest run",
            "test:watch": "yarn g:vitest watch"
        },
        engines: {
            node: ">=18.0.0"
        },
        sideEffects: !1,
        author: {
            name: "AWS SDK for JavaScript Team",
            url: "https://aws.amazon.com/javascript/"
        },
        license: "Apache-2.0",
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
            concurrently: "7.0.0",
            "downlevel-dts": "0.10.1",
            rimraf: "3.0.2",
            typescript: "~5.8.3"
        },
        typesVersions: {
            "<4.0": {
                "dist-types/*": ["dist-types/ts3.4/*"]
            }
        },
        files: ["./signin.d.ts", "./signin.js", "./sso-oidc.d.ts", "./sso-oidc.js", "./sts.d.ts", "./sts.js", "dist-*/**"],
        browser: {
            "./dist-es/submodules/signin/runtimeConfig": "./dist-es/submodules/signin/runtimeConfig.browser",
            "./dist-es/submodules/sso-oidc/runtimeConfig": "./dist-es/submodules/sso-oidc/runtimeConfig.browser",
            "./dist-es/submodules/sts/runtimeConfig": "./dist-es/submodules/sts/runtimeConfig.browser"
        },
        "react-native": {},
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/packages/nested-clients",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "packages/nested-clients"
        },
        exports: {
            "./package.json": "./package.json",
            "./sso-oidc": {
                types: "./dist-types/submodules/sso-oidc/index.d.ts",
                module: "./dist-es/submodules/sso-oidc/index.js",
                node: "./dist-cjs/submodules/sso-oidc/index.js",
                import: "./dist-es/submodules/sso-oidc/index.js",
                require: "./dist-cjs/submodules/sso-oidc/index.js"
            },
            "./sts": {
                types: "./dist-types/submodules/sts/index.d.ts",
                module: "./dist-es/submodules/sts/index.js",
                node: "./dist-cjs/submodules/sts/index.js",
                import: "./dist-es/submodules/sts/index.js",
                require: "./dist-cjs/submodules/sts/index.js"
            },
            "./signin": {
                types: "./dist-types/submodules/signin/index.d.ts",
                module: "./dist-es/submodules/signin/index.js",
                node: "./dist-cjs/submodules/signin/index.js",
                import: "./dist-es/submodules/signin/index.js",
                require: "./dist-cjs/submodules/signin/index.js"
            }
        }
    }
})
// @from(Ln 68375, Col 4)
oQ = R((uBK) => {
    var fW8 = h1("os"),
        Ud6 = h1("process"),
        SBK = $b(),
        VW8 = {
            isCrtAvailable: !1
        },
        hBK = () => {
            if (VW8.isCrtAvailable) return ["md/crt-avail"];
            return null
        },
        NW8 = ({
            serviceId: A,
            clientVersion: q
        }) => {
            return async (K) => {
                let Y = [
                        ["aws-sdk-js", q],
                        ["ua", "2.1"],
                        [`os/${fW8.platform()}`, fW8.release()],
                        ["lang/js"],
                        ["md/nodejs", `${Ud6.versions.node}`]
                    ],
                    z = hBK();
                if (z) Y.push(z);
                if (A) Y.push([`api/${A}`, q]);
                if (Ud6.env.AWS_EXECUTION_ENV) Y.push([`exec-env/${Ud6.env.AWS_EXECUTION_ENV}`]);
                let w = await K?.userAgentAppId?.();
                return w ? [...Y, [`app/${w}`]] : [...Y]
            }
        },
        IBK = NW8,
        TW8 = "AWS_SDK_UA_APP_ID",
        vW8 = "sdk_ua_app_id",
        xBK = "sdk-ua-app-id",
        bBK = {
            environmentVariableSelector: (A) => A[TW8],
            configFileSelector: (A) => A[vW8] ?? A[xBK],
            default: SBK.DEFAULT_UA_APP_ID
        };
    uBK.NODE_APP_ID_CONFIG_OPTIONS = bBK;
    uBK.UA_APP_ID_ENV_NAME = TW8;
    uBK.UA_APP_ID_INI_NAME = vW8;
    uBK.createDefaultUserAgentProvider = NW8;
    uBK.crtAvailability = VW8;
    uBK.defaultUserAgent = IBK
})
// @from(Ln 68422, Col 4)
EW8 = R((dBK) => {
    var pBK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    dBK.isArrayBuffer = pBK
})
// @from(Ln 68426, Col 4)
kW8 = R((rBK) => {
    var lBK = EW8(),
        pd6 = h1("buffer"),
        iBK = (A, q = 0, K = A.byteLength - q) => {
            if (!lBK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return pd6.Buffer.from(A, q, K)
        },
        nBK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? pd6.Buffer.from(A, q) : pd6.Buffer.from(A)
        };
    rBK.fromArrayBuffer = iBK;
    rBK.fromString = nBK
})
// @from(Ln 68440, Col 4)
aQ = R((eBK) => {
    var dd6 = kW8(),
        sBK = Z2(),
        tBK = h1("buffer"),
        LW8 = h1("crypto");
    class yW8 {
        algorithmIdentifier;
        secret;
        hash;
        constructor(A, q) {
            this.algorithmIdentifier = A, this.secret = q, this.reset()
        }
        update(A, q) {
            this.hash.update(sBK.toUint8Array(RW8(A, q)))
        }
        digest() {
            return Promise.resolve(this.hash.digest())
        }
        reset() {
            this.hash = this.secret ? LW8.createHmac(this.algorithmIdentifier, RW8(this.secret)) : LW8.createHash(this.algorithmIdentifier)
        }
    }

    function RW8(A, q) {
        if (tBK.Buffer.isBuffer(A)) return A;
        if (typeof A === "string") return dd6.fromString(A, q);
        if (ArrayBuffer.isView(A)) return dd6.fromArrayBuffer(A.buffer, A.byteOffset, A.byteLength);
        return dd6.fromArrayBuffer(A)
    }
    eBK.Hash = yW8
})
// @from(Ln 68471, Col 4)
sQ = R((KmK) => {
    var cd6 = h1("node:fs"),
        qmK = (A) => {
            if (!A) return 0;
            if (typeof A === "string") return Buffer.byteLength(A);
            else if (typeof A.byteLength === "number") return A.byteLength;
            else if (typeof A.size === "number") return A.size;
            else if (typeof A.start === "number" && typeof A.end === "number") return A.end + 1 - A.start;
            else if (A instanceof cd6.ReadStream) {
                if (A.path != null) return cd6.lstatSync(A.path).size;
                else if (typeof A.fd === "number") return cd6.fstatSync(A.fd).size
            }
            throw Error(`Body Length computation failed for ${A}`)
        };
    KmK.calculateBodyLength = qmK
})