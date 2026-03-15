
// @from(Ln 95933, Col 4)
o77 = x((n13) => {
    var JC6 = _C6();

    function c13(A) {
        let q = 0,
            K = 0,
            Y = null,
            z = null,
            _ = (O) => {
                if (typeof O !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + O);
                q = O, K = 4, Y = new Uint8Array(O), new DataView(Y.buffer).setUint32(0, O, !1)
            },
            w = async function*() {
                let O = A[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: $,
                        done: H
                    } = await O.next();
                    if (H) {
                        if (!q) return;
                        else if (q === K) yield Y;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let j = $.length,
                        J = 0;
                    while (J < j) {
                        if (!Y) {
                            let D = j - J;
                            if (!z) z = new Uint8Array(4);
                            let X = Math.min(4 - K, D);
                            if (z.set($.slice(J, J + X), K), K += X, J += X, K < 4) break;
                            _(new DataView(z.buffer).getUint32(0, !1)), z = null
                        }
                        let M = Math.min(q - K, j - J);
                        if (Y.set($.slice(J, J + M), K), K += M, J += M, q && q === K) yield Y, Y = null, q = 0, K = 0
                    }
                }
            };
        return {
            [Symbol.asyncIterator]: w
        }
    }

    function l13(A, q) {
        return async function(K) {
            let {
                value: Y
            } = K.headers[":message-type"];
            if (Y === "error") {
                let z = Error(K.headers[":error-message"].value || "UnknownError");
                throw z.name = K.headers[":error-code"].value, z
            } else if (Y === "exception") {
                let z = K.headers[":exception-type"].value,
                    _ = {
                        [z]: K
                    },
                    w = await A(_);
                if (w.$unknown) {
                    let O = Error(q(K.body));
                    throw O.name = z, O
                }
                throw w[z]
            } else if (Y === "event") {
                let z = {
                        [K.headers[":event-type"].value]: K
                    },
                    _ = await A(z);
                if (_.$unknown) return;
                return _
            } else throw Error(`Unrecognizable event type: ${K.headers[":event-type"].value}`)
        }
    }
    class cq8 {
        eventStreamCodec;
        utfEncoder;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.eventStreamCodec = new JC6.EventStreamCodec(A, q), this.utfEncoder = A
        }
        deserialize(A, q) {
            let K = c13(A);
            return new JC6.SmithyMessageDecoderStream({
                messageStream: new JC6.MessageDecoderStream({
                    inputStream: K,
                    decoder: this.eventStreamCodec
                }),
                deserializer: l13(q, this.utfEncoder)
            })
        }
        serialize(A, q) {
            return new JC6.MessageEncoderStream({
                messageStream: new JC6.SmithyMessageEncoderStream({
                    inputStream: A,
                    serializer: q
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    }
    var i13 = (A) => new cq8(A);
    n13.EventStreamMarshaller = cq8;
    n13.eventStreamSerdeProvider = i13
})
// @from(Ln 96041, Col 4)
a77 = x((A83) => {
    var a13 = o77(),
        s13 = x6("stream");
    async function* t13(A) {
        let q = !1,
            K = !1,
            Y = [];
        A.on("error", (z) => {
            if (!q) q = !0;
            if (z) throw z
        }), A.on("data", (z) => {
            Y.push(z)
        }), A.on("end", () => {
            q = !0
        });
        while (!K) {
            let z = await new Promise((_) => setTimeout(() => _(Y.shift()), 0));
            if (z) yield z;
            K = q && Y.length === 0
        }
    }
    class lq8 {
        universalMarshaller;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.universalMarshaller = new a13.EventStreamMarshaller({
                utf8Decoder: q,
                utf8Encoder: A
            })
        }
        deserialize(A, q) {
            let K = typeof A[Symbol.asyncIterator] === "function" ? A : t13(A);
            return this.universalMarshaller.deserialize(K, q)
        }
        serialize(A, q) {
            return s13.Readable.from(this.universalMarshaller.serialize(A, q))
        }
    }
    var e13 = (A) => new lq8(A);
    A83.EventStreamMarshaller = lq8;
    A83.eventStreamSerdeProvider = e13
})
// @from(Ln 96085, Col 4)
s77 = x((z83) => {
    var Y83 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    z83.isArrayBuffer = Y83
})
// @from(Ln 96089, Col 4)
nq8 = x((H83) => {
    var w83 = s77(),
        iq8 = x6("buffer"),
        O83 = (A, q = 0, K = A.byteLength - q) => {
            if (!w83.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return iq8.Buffer.from(A, q, K)
        },
        $83 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? iq8.Buffer.from(A, q) : iq8.Buffer.from(A)
        };
    H83.fromArrayBuffer = O83;
    H83.fromString = $83
})
// @from(Ln 96103, Col 4)
A47 = x((t77) => {
    Object.defineProperty(t77, "__esModule", {
        value: !0
    });
    t77.fromBase64 = void 0;
    var M83 = nq8(),
        D83 = /^[A-Za-z0-9+/]*={0,2}$/,
        X83 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!D83.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, M83.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    t77.fromBase64 = X83
})
// @from(Ln 96118, Col 4)
Y47 = x((q47) => {
    Object.defineProperty(q47, "__esModule", {
        value: !0
    });
    q47.toBase64 = void 0;
    var P83 = nq8(),
        W83 = C_(),
        Z83 = (A) => {
            let q;
            if (typeof A === "string") q = (0, W83.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, P83.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    q47.toBase64 = Z83
})
// @from(Ln 96134, Col 4)
w47 = x((MC6) => {
    var z47 = A47(),
        _47 = Y47();
    Object.keys(z47).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(MC6, A)) Object.defineProperty(MC6, A, {
            enumerable: !0,
            get: function() {
                return z47[A]
            }
        })
    });
    Object.keys(_47).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(MC6, A)) Object.defineProperty(MC6, A, {
            enumerable: !0,
            get: function() {
                return _47[A]
            }
        })
    })
})
// @from(Ln 96154, Col 4)
N47 = x((T47) => {
    Object.defineProperty(T47, "__esModule", {
        value: !0
    });
    T47.ruleSet = void 0;
    var Z47 = "required",
        Iu = "fn",
        bu = "argv",
        YJ6 = "ref",
        O47 = !0,
        $47 = "isSet",
        XC6 = "booleanEquals",
        KJ6 = "error",
        DC6 = "endpoint",
        NG = "tree",
        rq8 = "PartitionResult",
        H47 = {
            [Z47]: !1,
            type: "string"
        },
        j47 = {
            [Z47]: !0,
            default: !1,
            type: "boolean"
        },
        J47 = {
            [YJ6]: "Endpoint"
        },
        G47 = {
            [Iu]: XC6,
            [bu]: [{
                [YJ6]: "UseFIPS"
            }, !0]
        },
        f47 = {
            [Iu]: XC6,
            [bu]: [{
                [YJ6]: "UseDualStack"
            }, !0]
        },
        Cu = {},
        M47 = {
            [Iu]: "getAttr",
            [bu]: [{
                [YJ6]: rq8
            }, "supportsFIPS"]
        },
        D47 = {
            [Iu]: XC6,
            [bu]: [!0, {
                [Iu]: "getAttr",
                [bu]: [{
                    [YJ6]: rq8
                }, "supportsDualStack"]
            }]
        },
        X47 = [G47],
        P47 = [f47],
        W47 = [{
            [YJ6]: "Region"
        }],
        G83 = {
            version: "1.0",
            parameters: {
                Region: H47,
                UseDualStack: j47,
                UseFIPS: j47,
                Endpoint: H47
            },
            rules: [{
                conditions: [{
                    [Iu]: $47,
                    [bu]: [J47]
                }],
                rules: [{
                    conditions: X47,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: KJ6
                }, {
                    rules: [{
                        conditions: P47,
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: KJ6
                    }, {
                        endpoint: {
                            url: J47,
                            properties: Cu,
                            headers: Cu
                        },
                        type: DC6
                    }],
                    type: NG
                }],
                type: NG
            }, {
                rules: [{
                    conditions: [{
                        [Iu]: $47,
                        [bu]: W47
                    }],
                    rules: [{
                        conditions: [{
                            [Iu]: "aws.partition",
                            [bu]: W47,
                            assign: rq8
                        }],
                        rules: [{
                            conditions: [G47, f47],
                            rules: [{
                                conditions: [{
                                    [Iu]: XC6,
                                    [bu]: [O47, M47]
                                }, D47],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: Cu,
                                            headers: Cu
                                        },
                                        type: DC6
                                    }],
                                    type: NG
                                }],
                                type: NG
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: KJ6
                            }],
                            type: NG
                        }, {
                            conditions: X47,
                            rules: [{
                                conditions: [{
                                    [Iu]: XC6,
                                    [bu]: [M47, O47]
                                }],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
                                            properties: Cu,
                                            headers: Cu
                                        },
                                        type: DC6
                                    }],
                                    type: NG
                                }],
                                type: NG
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: KJ6
                            }],
                            type: NG
                        }, {
                            conditions: P47,
                            rules: [{
                                conditions: [D47],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: Cu,
                                            headers: Cu
                                        },
                                        type: DC6
                                    }],
                                    type: NG
                                }],
                                type: NG
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: KJ6
                            }],
                            type: NG
                        }, {
                            rules: [{
                                endpoint: {
                                    url: "https://bedrock-runtime.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: Cu,
                                    headers: Cu
                                },
                                type: DC6
                            }],
                            type: NG
                        }],
                        type: NG
                    }],
                    type: NG
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: KJ6
                }],
                type: NG
            }]
        };
    T47.ruleSet = G83
})
// @from(Ln 96352, Col 4)
E47 = x((V47) => {
    Object.defineProperty(V47, "__esModule", {
        value: !0
    });
    V47.defaultEndpointResolver = void 0;
    var f83 = Zu(),
        oq8 = nS(),
        T83 = N47(),
        v83 = new oq8.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        N83 = (A, q = {}) => {
            return v83.get(A, () => (0, oq8.resolveEndpoint)(T83.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    V47.defaultEndpointResolver = N83;
    oq8.customEndpointFunctions.aws = f83.awsEndpointFunctions
})
// @from(Ln 96373, Col 4)
S47 = x((R47) => {
    Object.defineProperty(R47, "__esModule", {
        value: !0
    });
    R47.getRuntimeConfig = void 0;
    var V83 = Nw(),
        k83 = RQ(),
        E83 = w_(),
        y83 = jC6(),
        L83 = hy(),
        y47 = w47(),
        L47 = C_(),
        R83 = dq8(),
        h83 = E47(),
        S83 = (A) => {
            return {
                apiVersion: "2023-09-30",
                base64Decoder: A?.base64Decoder ?? y47.fromBase64,
                base64Encoder: A?.base64Encoder ?? y47.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? h83.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? R83.defaultBedrockRuntimeHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new V83.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#httpBearerAuth"),
                    signer: new E83.HttpBearerAuthSigner
                }],
                logger: A?.logger ?? new y83.NoOpLogger,
                protocol: A?.protocol ?? new k83.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.bedrockruntime"
                }),
                serviceId: A?.serviceId ?? "Bedrock Runtime",
                urlParser: A?.urlParser ?? L83.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? L47.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? L47.toUtf8
            }
        };
    R47.getRuntimeConfig = S83
})
// @from(Ln 96417, Col 4)
B47 = x((u47) => {
    Object.defineProperty(u47, "__esModule", {
        value: !0
    });
    u47.getRuntimeConfig = void 0;
    var C83 = _2(),
        I83 = C83.__importDefault(l77()),
        aq8 = Nw(),
        b83 = P46(),
        x83 = r77(),
        C47 = qK1(),
        I47 = kQ(),
        Q51 = Nj(),
        u83 = w_(),
        m83 = a77(),
        B83 = EQ(),
        b47 = kP(),
        y46 = BT(),
        x47 = uT(),
        g83 = yQ(),
        F83 = Tu(),
        p83 = S47(),
        Q83 = jC6(),
        U83 = SQ(),
        d83 = jC6(),
        c83 = (A) => {
            (0, d83.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, U83.resolveDefaultsModeConfig)(A),
                K = () => q().then(Q83.loadConfigsForDefaultMode),
                Y = (0, p83.getRuntimeConfig)(A);
            (0, aq8.emitWarningIfUnsupportedVersion)(process.version);
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
                authSchemePreference: A?.authSchemePreference ?? (0, y46.loadConfig)(aq8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? g83.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? b83.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, I47.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: I83.default.version
                }),
                eventStreamPayloadHandlerProvider: A?.eventStreamPayloadHandlerProvider ?? x83.eventStreamPayloadHandlerProvider,
                eventStreamSerdeProvider: A?.eventStreamSerdeProvider ?? m83.eventStreamSerdeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (_) => _.getIdentityProvider("aws.auth#sigv4"),
                    signer: new aq8.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (_) => _.getIdentityProvider("smithy.api#httpBearerAuth") || (async (w) => {
                        try {
                            return await (0, C47.fromEnvSigningName)({
                                signingName: "bedrock"
                            })()
                        } catch (O) {
                            return await (0, C47.nodeProvider)(w)(w)
                        }
                    }),
                    signer: new u83.HttpBearerAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, y46.loadConfig)(b47.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, y46.loadConfig)(Q51.NODE_REGION_CONFIG_OPTIONS, {
                    ...Q51.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: x47.NodeHttp2Handler.create(A?.requestHandler ?? (async () => ({
                    ...await K(),
                    disableConcurrentStreams: !0
                }))),
                retryMode: A?.retryMode ?? (0, y46.loadConfig)({
                    ...b47.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || F83.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? B83.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? x47.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, y46.loadConfig)(Q51.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, y46.loadConfig)(Q51.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, y46.loadConfig)(I47.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    u47.getRuntimeConfig = c83
})
// @from(Ln 96506, Col 4)
Q47 = x((a83) => {
    var l83 = xq8(),
        i83 = (A) => {
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
        n83 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class g47 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = l83.FieldPosition.HEADER,
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
    class F47 {
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
    class U51 {
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
            let q = new U51({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = r83(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return U51.clone(this)
        }
    }

    function r83(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class p47 {
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

    function o83(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    a83.Field = g47;
    a83.Fields = F47;
    a83.HttpRequest = U51;
    a83.HttpResponse = p47;
    a83.getHttpHandlerExtensionConfiguration = i83;
    a83.isValidHostname = o83;
    a83.resolveHttpHandlerRuntimeConfig = n83
})
// @from(Ln 96648, Col 4)
Z31 = x((FK8) => {
    var qq7 = OA7(),
        U47 = PQ(),
        zA3 = WQ(),
        _A3 = ZQ(),
        d47 = fu(),
        Kq7 = h77(),
        wA3 = Nj(),
        d51 = w_(),
        iT = dO(),
        OA3 = S77(),
        $A3 = VQ(),
        zC = rS(),
        c47 = kP(),
        hP = jC6(),
        l47 = dq8(),
        HA3 = B47(),
        i47 = oS(),
        n47 = Q47(),
        jA3 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "bedrock"
            })
        },
        xu = {
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
        JA3 = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y,
                token: z
            } = A;
            return {
                setHttpAuthScheme(_) {
                    let w = q.findIndex((O) => O.schemeId === _.schemeId);
                    if (w === -1) q.push(_);
                    else q.splice(w, 1, _)
                },
                httpAuthSchemes() {
                    return q
                },
                setHttpAuthSchemeProvider(_) {
                    K = _
                },
                httpAuthSchemeProvider() {
                    return K
                },
                setCredentials(_) {
                    Y = _
                },
                credentials() {
                    return Y
                },
                setToken(_) {
                    z = _
                },
                token() {
                    return z
                }
            }
        },
        MA3 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials(),
                token: A.token()
            }
        },
        DA3 = (A, q) => {
            let K = Object.assign(i47.getAwsRegionExtensionConfiguration(A), hP.getDefaultExtensionConfiguration(A), n47.getHttpHandlerExtensionConfiguration(A), JA3(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, i47.resolveAwsRegionExtensionConfiguration(K), hP.resolveDefaultRuntimeConfig(K), n47.resolveHttpHandlerRuntimeConfig(K), MA3(K))
        };
    class l51 extends hP.Client {
        config;
        constructor(...[A]) {
            let q = HA3.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = jA3(q),
                Y = d47.resolveUserAgentConfig(K),
                z = c47.resolveRetryConfig(Y),
                _ = wA3.resolveRegionConfig(z),
                w = U47.resolveHostHeaderConfig(_),
                O = zC.resolveEndpointConfig(w),
                $ = OA3.resolveEventStreamSerdeConfig(O),
                H = l47.resolveHttpAuthSchemeConfig($),
                j = qq7.resolveEventStreamConfig(H),
                J = Kq7.resolveWebSocketConfig(j),
                M = DA3(J, A?.extensions || []);
            this.config = M, this.middlewareStack.use(iT.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(d47.getUserAgentPlugin(this.config)), this.middlewareStack.use(c47.getRetryPlugin(this.config)), this.middlewareStack.use($A3.getContentLengthPlugin(this.config)), this.middlewareStack.use(U47.getHostHeaderPlugin(this.config)), this.middlewareStack.use(zA3.getLoggerPlugin(this.config)), this.middlewareStack.use(_A3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(d51.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: l47.defaultBedrockRuntimeHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (D) => new d51.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": D.credentials,
                    "smithy.api#httpBearerAuth": D.token
                })
            })), this.middlewareStack.use(d51.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var nT = class A extends hP.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Yq7 = class A extends nT {
            name = "AccessDeniedException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "AccessDeniedException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        zq7 = class A extends nT {
            name = "InternalServerException";
            $fault = "server";
            constructor(q) {
                super({
                    name: "InternalServerException",
                    $fault: "server",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        _q7 = class A extends nT {
            name = "ThrottlingException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ThrottlingException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        wq7 = class A extends nT {
            name = "ValidationException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ValidationException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Oq7 = class A extends nT {
            name = "ConflictException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ConflictException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        $q7 = class A extends nT {
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
        Hq7 = class A extends nT {
            name = "ServiceQuotaExceededException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ServiceQuotaExceededException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        jq7 = class A extends nT {
            name = "ServiceUnavailableException";
            $fault = "server";
            constructor(q) {
                super({
                    name: "ServiceUnavailableException",
                    $fault: "server",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Jq7 = class A extends nT {
            name = "ModelErrorException";
            $fault = "client";
            originalStatusCode;
            resourceName;
            constructor(q) {
                super({
                    name: "ModelErrorException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.originalStatusCode = q.originalStatusCode, this.resourceName = q.resourceName
            }
        },
        Mq7 = class A extends nT {
            name = "ModelNotReadyException";
            $fault = "client";
            $retryable = {};
            constructor(q) {
                super({
                    name: "ModelNotReadyException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Dq7 = class A extends nT {
            name = "ModelTimeoutException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ModelTimeoutException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Xq7 = class A extends nT {
            name = "ModelStreamErrorException";
            $fault = "client";
            originalStatusCode;
            originalMessage;
            constructor(q) {
                super({
                    name: "ModelStreamErrorException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.originalStatusCode = q.originalStatusCode, this.originalMessage = q.originalMessage
            }
        },
        XA3 = "Accept",
        PA3 = "AccessDeniedException",
        WA3 = "ApplyGuardrail",
        ZA3 = "ApplyGuardrailRequest",
        GA3 = "ApplyGuardrailResponse",
        fA3 = "AsyncInvokeMessage",
        TA3 = "AsyncInvokeOutputDataConfig",
        vA3 = "AsyncInvokeSummary",
        NA3 = "AsyncInvokeS3OutputDataConfig",
        VA3 = "AsyncInvokeSummaries",
        kA3 = "AnyToolChoice",
        EA3 = "AutoToolChoice",
        yA3 = "Body",
        LA3 = "BidirectionalInputPayloadPart",
        RA3 = "BidirectionalOutputPayloadPart",
        hA3 = "Citation",
        SA3 = "ContentBlocks",
        CA3 = "ContentBlockDelta",
        IA3 = "ContentBlockDeltaEvent",
        bA3 = "ContentBlockStart",
        xA3 = "ContentBlockStartEvent",
        uA3 = "ContentBlockStopEvent",
        mA3 = "ContentBlock",
        BA3 = "CitationsConfig",
        gA3 = "CitationsContentBlock",
        FA3 = "CitationsDelta",
        pA3 = "ConflictException",
        QA3 = "CitationGeneratedContent",
        UA3 = "CitationGeneratedContentList",
        dA3 = "CitationLocation",
        cA3 = "ConverseMetrics",
        lA3 = "ConverseOutput",
        iA3 = "CachePointBlock",
        nA3 = "ConverseRequest",
        rA3 = "ConverseResponse",
        oA3 = "ConverseStream",
        aA3 = "CitationSourceContent",
        sA3 = "CitationSourceContentDelta",
        tA3 = "CitationSourceContentList",
        eA3 = "CitationSourceContentListDelta",
        A73 = "ConverseStreamMetrics",
        q73 = "ConverseStreamMetadataEvent",
        K73 = "ConverseStreamOutput",
        Y73 = "ConverseStreamRequest",
        z73 = "ConverseStreamResponse",
        _73 = "ConverseStreamTrace",
        w73 = "ConverseTrace",
        O73 = "CountTokensInput",
        $73 = "ConverseTokensRequest",
        H73 = "CountTokensRequest",
        j73 = "CountTokensResponse",
        tq8 = "Content-Type",
        J73 = "CountTokens",
        M73 = "Citations",
        D73 = "Converse",
        X73 = "DocumentBlock",
        P73 = "DocumentContentBlocks",
        W73 = "DocumentContentBlock",
        Z73 = "DocumentCharLocation",
        G73 = "DocumentChunkLocation",
        f73 = "DocumentPageLocation",
        T73 = "DocumentSource",
        v73 = "GuardrailAssessment",
        N73 = "GetAsyncInvoke",
        V73 = "GetAsyncInvokeRequest",
        k73 = "GetAsyncInvokeResponse",
        E73 = "GuardrailAssessmentList",
        y73 = "GuardrailAssessmentListMap",
        L73 = "GuardrailAssessmentMap",
        R73 = "GuardrailAutomatedReasoningDifferenceScenarioList",
        h73 = "GuardrailAutomatedReasoningFinding",
        S73 = "GuardrailAutomatedReasoningFindingList",
        C73 = "GuardrailAutomatedReasoningImpossibleFinding",
        I73 = "GuardrailAutomatedReasoningInvalidFinding",
        b73 = "GuardrailAutomatedReasoningInputTextReference",
        x73 = "GuardrailAutomatedReasoningInputTextReferenceList",
        u73 = "GuardrailAutomatedReasoningLogicWarning",
        m73 = "GuardrailAutomatedReasoningNoTranslationsFinding",
        B73 = "GuardrailAutomatedReasoningPolicyAssessment",
        g73 = "GuardrailAutomatedReasoningRule",
        F73 = "GuardrailAutomatedReasoningRuleList",
        p73 = "GuardrailAutomatedReasoningScenario",
        Q73 = "GuardrailAutomatedReasoningSatisfiableFinding",
        U73 = "GuardrailAutomatedReasoningStatementList",
        d73 = "GuardrailAutomatedReasoningStatementLogicContent",
        c73 = "GuardrailAutomatedReasoningStatementNaturalLanguageContent",
        l73 = "GuardrailAutomatedReasoningStatement",
        i73 = "GuardrailAutomatedReasoningTranslation",
        n73 = "GuardrailAutomatedReasoningTranslationAmbiguousFinding",
        r73 = "GuardrailAutomatedReasoningTooComplexFinding",
        o73 = "GuardrailAutomatedReasoningTranslationList",
        a73 = "GuardrailAutomatedReasoningTranslationOption",
        s73 = "GuardrailAutomatedReasoningTranslationOptionList",
        t73 = "GuardrailAutomatedReasoningValidFinding",
        e73 = "GuardrailConfiguration",
        A43 = "GuardrailContentBlock",
        q43 = "GuardrailContentBlockList",
        K43 = "GuardrailConverseContentBlock",
        Y43 = "GuardrailContentFilter",
        z43 = "GuardrailContentFilterList",
        _43 = "GuardrailContextualGroundingFilter",
        w43 = "GuardrailContextualGroundingFilters",
        O43 = "GuardrailContextualGroundingPolicyAssessment",
        $43 = "GuardrailConverseImageBlock",
        H43 = "GuardrailConverseImageSource",
        j43 = "GuardrailContentPolicyAssessment",
        J43 = "GuardrailConverseTextBlock",
        M43 = "GuardrailCustomWord",
        D43 = "GuardrailCustomWordList",
        X43 = "GuardrailCoverage",
        P43 = "GuardrailImageBlock",
        W43 = "GuardrailImageCoverage",
        Z43 = "GuardrailInvocationMetrics",
        G43 = "GuardrailImageSource",
        f43 = "GuardrailManagedWord",
        T43 = "GuardrailManagedWordList",
        v43 = "GuardrailOutputContent",
        N43 = "GuardrailOutputContentList",
        V43 = "GuardrailPiiEntityFilter",
        k43 = "GuardrailPiiEntityFilterList",
        E43 = "GuardrailRegexFilter",
        y43 = "GuardrailRegexFilterList",
        L43 = "GuardrailStreamConfiguration",
        R43 = "GuardrailSensitiveInformationPolicyAssessment",
        h43 = "GuardrailTopic",
        S43 = "GuardrailTraceAssessment",
        C43 = "GuardrailTextBlock",
        I43 = "GuardrailTextCharactersCoverage",
        b43 = "GuardrailTopicList",
        x43 = "GuardrailTopicPolicyAssessment",
        u43 = "GuardrailUsage",
        m43 = "GuardrailWordPolicyAssessment",
        B43 = "ImageBlock",
        g43 = "InferenceConfiguration",
        F43 = "InvokeModel",
        p43 = "InvokeModelRequest",
        Q43 = "InvokeModelResponse",
        U43 = "InvokeModelTokensRequest",
        d43 = "InvokeModelWithBidirectionalStream",
        c43 = "InvokeModelWithBidirectionalStreamInput",
        l43 = "InvokeModelWithBidirectionalStreamOutput",
        i43 = "InvokeModelWithBidirectionalStreamRequest",
        n43 = "InvokeModelWithBidirectionalStreamResponse",
        r43 = "InvokeModelWithResponseStream",
        o43 = "InvokeModelWithResponseStreamRequest",
        a43 = "InvokeModelWithResponseStreamResponse",
        s43 = "ImageSource",
        t43 = "InternalServerException",
        e43 = "ListAsyncInvokes",
        Aq3 = "ListAsyncInvokesRequest",
        qq3 = "ListAsyncInvokesResponse",
        Kq3 = "Message",
        Yq3 = "ModelErrorException",
        zq3 = "ModelInputPayload",
        _q3 = "ModelNotReadyException",
        wq3 = "MessageStartEvent",
        Oq3 = "ModelStreamErrorException",
        $q3 = "MessageStopEvent",
        Hq3 = "ModelTimeoutException",
        jq3 = "Messages",
        Jq3 = "PartBody",
        Mq3 = "PerformanceConfiguration",
        Dq3 = "PayloadPart",
        Xq3 = "PromptRouterTrace",
        Pq3 = "PromptVariableMap",
        Wq3 = "PromptVariableValues",
        Zq3 = "ReasoningContentBlock",
        Gq3 = "ReasoningContentBlockDelta",
        fq3 = "RequestMetadata",
        Tq3 = "ResourceNotFoundException",
        vq3 = "ResponseStream",
        Nq3 = "ReasoningTextBlock",
        Vq3 = "StartAsyncInvoke",
        kq3 = "StartAsyncInvokeRequest",
        Eq3 = "StartAsyncInvokeResponse",
        yq3 = "SystemContentBlocks",
        Lq3 = "SystemContentBlock",
        Rq3 = "S3Location",
        hq3 = "ServiceQuotaExceededException",
        Sq3 = "SearchResultBlock",
        Cq3 = "SearchResultContentBlock",
        Iq3 = "SearchResultContentBlocks",
        bq3 = "SearchResultLocation",
        xq3 = "ServiceTier",
        uq3 = "SpecificToolChoice",
        mq3 = "SystemTool",
        Bq3 = "ServiceUnavailableException",
        gq3 = "Tag",
        Fq3 = "ToolConfiguration",
        pq3 = "ToolChoice",
        Qq3 = "ThrottlingException",
        Uq3 = "ToolInputSchema",
        dq3 = "TagList",
        cq3 = "ToolResultBlock",
        lq3 = "ToolResultBlocksDelta",
        iq3 = "ToolResultBlockDelta",
        nq3 = "ToolResultBlockStart",
        rq3 = "ToolResultContentBlocks",
        oq3 = "ToolResultContentBlock",
        aq3 = "ToolSpecification",
        sq3 = "TokenUsage",
        tq3 = "ToolUseBlock",
        eq3 = "ToolUseBlockDelta",
        AK3 = "ToolUseBlockStart",
        qK3 = "Tools",
        KK3 = "Tool",
        YK3 = "VideoBlock",
        zK3 = "ValidationException",
        _K3 = "VideoSource",
        wK3 = "WebLocation",
        OK3 = "X-Amzn-Bedrock-Accept",
        $K3 = "X-Amzn-Bedrock-Content-Type",
        Pq7 = "X-Amzn-Bedrock-GuardrailIdentifier",
        Wq7 = "X-Amzn-Bedrock-GuardrailVersion",
        i51 = "X-Amzn-Bedrock-PerformanceConfig-Latency",
        n51 = "X-Amzn-Bedrock-Service-Tier",
        Zq7 = "X-Amzn-Bedrock-Trace",
        Wo = "action",
        HK3 = "asyncInvokeSummaries",
        eq8 = "additionalModelRequestFields",
        Gq7 = "additionalModelResponseFieldPaths",
        fq7 = "additionalModelResponseFields",
        Tq7 = "actionReason",
        jK3 = "automatedReasoningPolicy",
        JK3 = "automatedReasoningPolicyUnits",
        MK3 = "automatedReasoningPolicies",
        vq7 = "accept",
        DK3 = "any",
        XK3 = "assessments",
        PK3 = "auto",
        Zo = "bytes",
        Nq7 = "bucketOwner",
        R46 = "body",
        uu = "client",
        WK3 = "contentBlockDelta",
        AK8 = "contentBlockIndex",
        ZK3 = "contentBlockStart",
        GK3 = "contentBlockStop",
        fK3 = "citationsContent",
        TK3 = "claimsFalseScenario",
        vK3 = "contextualGroundingPolicy",
        NK3 = "contextualGroundingPolicyUnits",
        VK3 = "contentPolicy",
        kK3 = "contentPolicyImageUnits",
        EK3 = "contentPolicyUnits",
        qK8 = "cachePoint",
        Vq7 = "contradictingRules",
        yK3 = "cacheReadInputTokens",
        KK8 = "clientRequestToken",
        r51 = "contentType",
        kq7 = "claimsTrueScenario",
        LK3 = "customWords",
        RK3 = "cacheWriteInputTokens",
        YK8 = "chunk",
        zK8 = "citations",
        hK3 = "citation",
        Eq7 = "claims",
        zJ6 = "content",
        SK3 = "context",
        yq7 = "confidence",
        CK3 = "converse",
        IK3 = "delta",
        bK3 = "documentChar",
        xK3 = "documentChunk",
        _K8 = "documentIndex",
        uK3 = "documentPage",
        mK3 = "differenceScenarios",
        h46 = "detected",
        BK3 = "description",
        gK3 = "domain",
        Lq7 = "document",
        ry = "error",
        Rq7 = "endTime",
        FK3 = "enabled",
        o51 = "end",
        WC6 = "format",
        hq7 = "failureMessage",
        pK3 = "filterStrength",
        QK3 = "findings",
        Sq7 = "filters",
        Cq7 = "guardrail",
        Iq7 = "guardrailCoverage",
        bq7 = "guardrailConfig",
        xq7 = "guardContent",
        ZC6 = "guardrailIdentifier",
        UK3 = "guardrailProcessingLatency",
        GC6 = "guardrailVersion",
        uq7 = "guarded",
        mu = "http",
        oy = "httpError",
        EJ = "httpHeader",
        L46 = "httpQuery",
        wK8 = "input",
        a51 = "invocationArn",
        dK3 = "inputAssessment",
        mq7 = "inferenceConfig",
        cK3 = "invocationMetrics",
        lK3 = "invokedModelId",
        iK3 = "invokeModel",
        nK3 = "inputSchema",
        OK8 = "internalServerException",
        Bq7 = "inputTokens",
        rK3 = "identifier",
        oK3 = "images",
        s51 = "image",
        aK3 = "impossible",
        sK3 = "invalid",
        gq7 = "json",
        tK3 = "key",
        eK3 = "kmsKeyId",
        Fq7 = "location",
        pq7 = "latencyMs",
        Qq7 = "lastModifiedTime",
        t51 = "logicWarning",
        A53 = "latency",
        q53 = "logic",
        lV = "message",
        Uq7 = "modelArn",
        S46 = "modelId",
        K53 = "modelInput",
        Y53 = "modelOutput",
        r47 = "maxResults",
        z53 = "messageStart",
        $K8 = "modelStreamErrorException",
        _53 = "messageStop",
        w53 = "maxTokens",
        dq7 = "modelTimeoutException",
        O53 = "managedWordLists",
        e51 = "match",
        HK8 = "messages",
        cq7 = "metrics",
        $53 = "metadata",
        Go = "name",
        H53 = "naturalLanguage",
        sq8 = "nextToken",
        j53 = "noTranslations",
        J53 = "outputs",
        M53 = "outputAssessments",
        jK8 = "outputDataConfig",
        D53 = "originalMessage",
        X53 = "outputScope",
        lq7 = "originalStatusCode",
        P53 = "outputTokens",
        W53 = "options",
        Z53 = "output",
        iq7 = "premises",
        A31 = "performanceConfig",
        q31 = "performanceConfigLatency",
        G53 = "piiEntities",
        nq7 = "promptRouter",
        rq7 = "promptVariables",
        f53 = "policyVersionArn",
        oq7 = "qualifiers",
        T53 = "regex",
        aq7 = "reasoningContent",
        sq7 = "redactedContent",
        tq7 = "requestMetadata",
        v53 = "resourceName",
        N53 = "reasoningText",
        V53 = "regexes",
        eq7 = "role",
        FQ = "source",
        o47 = "sortBy",
        AK7 = "sourceContent",
        a47 = "statusEquals",
        k53 = "sensitiveInformationPolicy",
        E53 = "sensitiveInformationPolicyFreeUnits",
        y53 = "sensitiveInformationPolicyUnits",
        JK8 = "s3Location",
        s47 = "sortOrder",
        L53 = "s3OutputDataConfig",
        R53 = "streamProcessingMode",
        qK7 = "stopReason",
        h53 = "searchResultIndex",
        S53 = "searchResultLocation",
        KK7 = "searchResult",
        C53 = "supportingRules",
        I53 = "stopSequences",
        YK7 = "submitTime",
        t47 = "submitTimeAfter",
        e47 = "submitTimeBefore",
        fo = "serviceTier",
        b53 = "systemTool",
        x53 = "s3Uri",
        MK8 = "serviceUnavailableException",
        u53 = "satisfiable",
        m53 = "score",
        zK7 = "server",
        _K7 = "signature",
        wK7 = "smithy.ts.sdk.synthetic.com.amazonaws.bedrockruntime",
        K31 = "status",
        fC6 = "start",
        B53 = "statements",
        g53 = "stream",
        Y31 = "streaming",
        DK8 = "system",
        ay = "type",
        F53 = "translationAmbiguous",
        XK8 = "toolConfig",
        p53 = "textCharacters",
        Q53 = "toolChoice",
        U53 = "tooComplex",
        PK8 = "throttlingException",
        d53 = "topicPolicy",
        c53 = "topicPolicyUnits",
        l53 = "topP",
        WK8 = "toolResult",
        i53 = "toolSpec",
        n53 = "totalTokens",
        ZK8 = "toolUse",
        z31 = "toolUseId",
        r53 = "tags",
        yJ = "text",
        o53 = "temperature",
        a53 = "threshold",
        GK8 = "title",
        OK7 = "total",
        s53 = "tools",
        t53 = "tool",
        e53 = "topics",
        _J6 = "trace",
        _31 = "translation",
        A33 = "translations",
        w31 = "usage",
        q33 = "untranslatedClaims",
        K33 = "untranslatedPremises",
        Y33 = "uri",
        z33 = "url",
        _33 = "value",
        fK8 = "validationException",
        w33 = "valid",
        $K7 = "video",
        O33 = "web",
        $33 = "wordPolicy",
        H33 = "wordPolicyUnits",
        C1 = "com.amazonaws.bedrockruntime",
        HK7 = [0, C1, fA3, 8, 0],
        O31 = [0, C1, yA3, 8, 21],
        j33 = [0, C1, d73, 8, 0],
        jK7 = [0, C1, c73, 8, 0],
        J33 = [0, C1, zq3, 8, 15],
        TK8 = [0, C1, Jq3, 8, 21],
        M33 = [-3, C1, PA3, {
                [ry]: uu,
                [oy]: 403
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(M33, Yq7);
    var D33 = [3, C1, kA3, 0, [],
            []
        ],
        X33 = [3, C1, ZA3, 0, [ZC6, GC6, FQ, zJ6, X53],
            [
                [0, 1],
                [0, 1], 0, [() => PY3, 0], 0
            ]
        ],
        P33 = [3, C1, GA3, 0, [w31, Wo, Tq7, J53, XK3, Iq7],
            [() => WK7, 0, 0, () => TY3, [() => kK7, 0], () => XK7]
        ],
        W33 = [3, C1, NA3, 0, [x53, eK3, Nq7],
            [0, 0, 0]
        ],
        Z33 = [3, C1, vA3, 0, [a51, Uq7, KK8, K31, hq7, YK7, Qq7, Rq7, jK8],
            [0, 0, 0, 0, [() => HK7, 0], 5, 5, 5, () => RK8]
        ],
        G33 = [3, C1, EA3, 0, [],
            []
        ],
        f33 = [3, C1, LA3, 8, [Zo],
            [
                [() => TK8, 0]
            ]
        ],
        T33 = [3, C1, RA3, 8, [Zo],
            [
                [() => TK8, 0]
            ]
        ],
        vK8 = [3, C1, iA3, 0, [ay],
            [0]
        ],
        v33 = [3, C1, hA3, 0, [GK8, FQ, AK7, Fq7],
            [0, 0, () => OY3, () => LK7]
        ],
        JK7 = [3, C1, BA3, 0, [FK3],
            [2]
        ],
        N33 = [3, C1, gA3, 0, [zJ6, zK8],
            [() => _Y3, () => wY3]
        ],
        V33 = [3, C1, FA3, 0, [GK8, FQ, AK7, Fq7],
            [0, 0, () => $Y3, () => LK7]
        ],
        k33 = [3, C1, sA3, 0, [yJ],
            [0]
        ],
        E33 = [-3, C1, pA3, {
                [ry]: uu,
                [oy]: 400
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(E33, Oq7);
    var y33 = [3, C1, IA3, 0, [IK3, AK8],
            [
                [() => xY3, 0], 1
            ]
        ],
        L33 = [3, C1, xA3, 0, [fC6, AK8],
            [() => uY3, 1]
        ],
        R33 = [3, C1, uA3, 0, [AK8],
            [1]
        ],
        h33 = [3, C1, cA3, 0, [pq7],
            [1]
        ],
        S33 = [3, C1, nA3, 0, [S46, HK8, DK8, mq7, XK8, bq7, eq8, rq7, Gq7, tq7, A31, fo],
            [
                [0, 1],
                [() => yK8, 0],
                [() => LK8, 0], () => GK7, () => kK8, () => z93, 15, [() => EK7, 0], 64, [() => yK7, 0], () => J31, () => M31
            ]
        ],
        C33 = [3, C1, rA3, 0, [Z53, qK7, w31, cq7, fq7, _J6, A31, fo],
            [
                [() => mY3, 0], 0, () => NK7, () => h33, 15, [() => g33, 0], () => J31, () => M31
            ]
        ],
        I33 = [3, C1, q73, 0, [w31, cq7, _J6, A31, fo],
            [() => NK7, () => b33, [() => m33, 0], () => J31, () => M31]
        ],
        b33 = [3, C1, A73, 0, [pq7],
            [1]
        ],
        x33 = [3, C1, Y73, 0, [S46, HK8, DK8, mq7, XK8, bq7, eq8, rq7, Gq7, tq7, A31, fo],
            [
                [0, 1],
                [() => yK8, 0],
                [() => LK8, 0], () => GK7, () => kK8, () => T93, 15, [() => EK7, 0], 64, [() => yK7, 0], () => J31, () => M31
            ]
        ],
        u33 = [3, C1, z73, 0, [g53],
            [
                [() => BY3, 16]
            ]
        ],
        m33 = [3, C1, _73, 0, [Cq7, nq7],
            [
                [() => PK7, 0], () => TK7
            ]
        ],
        B33 = [3, C1, $73, 0, [HK8, DK8, XK8, eq8],
            [
                [() => yK8, 0],
                [() => LK8, 0], () => kK8, 15
            ]
        ],
        g33 = [3, C1, w73, 0, [Cq7, nq7],
            [
                [() => PK7, 0], () => TK7
            ]
        ],
        F33 = [3, C1, H73, 0, [S46, wK8],
            [
                [0, 1],
                [() => gY3, 0]
            ]
        ],
        p33 = [3, C1, j73, 0, [Bq7],
            [1]
        ],
        MK7 = [3, C1, X73, 0, [WC6, Go, FQ, SK3, zK8],
            [0, 0, () => pY3, 0, () => JK7]
        ],
        Q33 = [3, C1, Z73, 0, [_K8, fC6, o51],
            [1, 1, 1]
        ],
        U33 = [3, C1, G73, 0, [_K8, fC6, o51],
            [1, 1, 1]
        ],
        d33 = [3, C1, f73, 0, [_K8, fC6, o51],
            [1, 1, 1]
        ],
        c33 = [3, C1, V73, 0, [a51],
            [
                [0, 1]
            ]
        ],
        l33 = [3, C1, k73, 0, [a51, Uq7, KK8, K31, hq7, YK7, Qq7, Rq7, jK8],
            [0, 0, 0, 0, [() => HK7, 0], 5, 5, 5, () => RK8]
        ],
        DK7 = [3, C1, v73, 0, [d53, VK3, $33, k53, vK3, jK3, cK3],
            [() => k93, () => w93, () => E93, () => f93, () => $93, [() => a33, 0], () => X93]
        ],
        i33 = [3, C1, C73, 0, [_31, Vq7, t51],
            [
                [() => TC6, 0], () => EK8, [() => $31, 0]
            ]
        ],
        n33 = [3, C1, b73, 0, [yJ],
            [
                [() => jK7, 0]
            ]
        ],
        r33 = [3, C1, I73, 0, [_31, Vq7, t51],
            [
                [() => TC6, 0], () => EK8, [() => $31, 0]
            ]
        ],
        $31 = [3, C1, u73, 0, [ay, iq7, Eq7],
            [0, [() => PC6, 0],
                [() => PC6, 0]
            ]
        ],
        o33 = [3, C1, m73, 0, [],
            []
        ],
        a33 = [3, C1, B73, 0, [QK3],
            [
                [() => MY3, 0]
            ]
        ],
        s33 = [3, C1, g73, 0, [rK3, f53],
            [0, 0]
        ],
        t33 = [3, C1, Q73, 0, [_31, kq7, TK3, t51],
            [
                [() => TC6, 0],
                [() => c51, 0],
                [() => c51, 0],
                [() => $31, 0]
            ]
        ],
        c51 = [3, C1, p73, 0, [B53],
            [
                [() => PC6, 0]
            ]
        ],
        e33 = [3, C1, l73, 0, [q53, H53],
            [
                [() => j33, 0],
                [() => jK7, 0]
            ]
        ],
        A93 = [3, C1, r73, 0, [],
            []
        ],
        TC6 = [3, C1, i73, 0, [iq7, Eq7, K33, q33, yq7],
            [
                [() => PC6, 0],
                [() => PC6, 0],
                [() => Aq7, 0],
                [() => Aq7, 0], 1
            ]
        ],
        q93 = [3, C1, n73, 0, [W53, mK3],
            [
                [() => XY3, 0],
                [() => JY3, 0]
            ]
        ],
        K93 = [3, C1, a73, 0, [A33],
            [
                [() => DY3, 0]
            ]
        ],
        Y93 = [3, C1, t73, 0, [_31, kq7, C53, t51],
            [
                [() => TC6, 0],
                [() => c51, 0], () => EK8, [() => $31, 0]
            ]
        ],
        z93 = [3, C1, e73, 0, [ZC6, GC6, _J6],
            [0, 0, 0]
        ],
        _93 = [3, C1, Y43, 0, [ay, yq7, pK3, Wo, h46],
            [0, 0, 0, 0, 2]
        ],
        w93 = [3, C1, j43, 0, [Sq7],
            [() => WY3]
        ],
        O93 = [3, C1, _43, 0, [ay, a53, m53, Wo, h46],
            [0, 1, 1, 0, 2]
        ],
        $93 = [3, C1, O43, 0, [Sq7],
            [() => ZY3]
        ],
        H93 = [3, C1, $43, 8, [WC6, FQ],
            [0, [() => dY3, 0]]
        ],
        j93 = [3, C1, J43, 0, [yJ, oq7],
            [0, 64]
        ],
        XK7 = [3, C1, X43, 0, [p53, oK3],
            [() => N93, () => D93]
        ],
        J93 = [3, C1, M43, 0, [e51, Wo, h46],
            [0, 0, 2]
        ],
        M93 = [3, C1, P43, 8, [WC6, FQ],
            [0, [() => cY3, 0]]
        ],
        D93 = [3, C1, W43, 0, [uq7, OK7],
            [1, 1]
        ],
        X93 = [3, C1, Z43, 0, [UK3, w31, Iq7],
            [1, () => WK7, () => XK7]
        ],
        P93 = [3, C1, f43, 0, [e51, ay, Wo, h46],
            [0, 0, 0, 2]
        ],
        W93 = [3, C1, v43, 0, [yJ],
            [0]
        ],
        Z93 = [3, C1, V43, 0, [e51, ay, Wo, h46],
            [0, 0, 0, 2]
        ],
        G93 = [3, C1, E43, 0, [Go, e51, T53, Wo, h46],
            [0, 0, 0, 0, 2]
        ],
        f93 = [3, C1, R43, 0, [G53, V53],
            [() => vY3, () => NY3]
        ],
        T93 = [3, C1, L43, 0, [ZC6, GC6, _J6, R53],
            [0, 0, 0, 0]
        ],
        v93 = [3, C1, C43, 0, [yJ, oq7],
            [0, 64]
        ],
        N93 = [3, C1, I43, 0, [uq7, OK7],
            [1, 1]
        ],
        V93 = [3, C1, h43, 0, [Go, ay, Wo, h46],
            [0, 0, 0, 2]
        ],
        k93 = [3, C1, x43, 0, [e53],
            [() => VY3]
        ],
        PK7 = [3, C1, S43, 0, [Y53, dK3, M53, Tq7],
            [64, [() => SY3, 0],
                [() => hY3, 0], 0
            ]
        ],
        WK7 = [3, C1, u43, 0, [c53, EK3, H33, y53, E53, NK3, kK3, JK3, MK3],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        E93 = [3, C1, m43, 0, [LK3, O53],
            [() => GY3, () => fY3]
        ],
        ZK7 = [3, C1, B43, 0, [WC6, FQ],
            [0, () => lY3]
        ],
        GK7 = [3, C1, g43, 0, [w53, o53, l53, I53],
            [1, 1, 1, 64]
        ],
        H31 = [-3, C1, t43, {
                [ry]: zK7,
                [oy]: 500
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(H31, zq7);
    var y93 = [3, C1, p43, 0, [R46, r51, vq7, S46, _J6, ZC6, GC6, q31, fo],
            [
                [() => O31, 16],
                [0, {
                    [EJ]: tq8
                }],
                [0, {
                    [EJ]: XA3
                }],
                [0, 1],
                [0, {
                    [EJ]: Zq7
                }],
                [0, {
                    [EJ]: Pq7
                }],
                [0, {
                    [EJ]: Wq7
                }],
                [0, {
                    [EJ]: i51
                }],
                [0, {
                    [EJ]: n51
                }]
            ]
        ],
        L93 = [3, C1, Q43, 0, [R46, r51, q31, fo],
            [
                [() => O31, 16],
                [0, {
                    [EJ]: tq8
                }],
                [0, {
                    [EJ]: i51
                }],
                [0, {
                    [EJ]: n51
                }]
            ]
        ],
        R93 = [3, C1, U43, 0, [R46],
            [
                [() => O31, 0]
            ]
        ],
        h93 = [3, C1, i43, 0, [S46, R46],
            [
                [0, 1],
                [() => iY3, 16]
            ]
        ],
        S93 = [3, C1, n43, 0, [R46],
            [
                [() => nY3, 16]
            ]
        ],
        C93 = [3, C1, o43, 0, [R46, r51, vq7, S46, _J6, ZC6, GC6, q31, fo],
            [
                [() => O31, 16],
                [0, {
                    [EJ]: tq8
                }],
                [0, {
                    [EJ]: OK3
                }],
                [0, 1],
                [0, {
                    [EJ]: Zq7
                }],
                [0, {
                    [EJ]: Pq7
                }],
                [0, {
                    [EJ]: Wq7
                }],
                [0, {
                    [EJ]: i51
                }],
                [0, {
                    [EJ]: n51
                }]
            ]
        ],
        I93 = [3, C1, a43, 0, [R46, r51, q31, fo],
            [
                [() => sY3, 16],
                [0, {
                    [EJ]: $K3
                }],
                [0, {
                    [EJ]: i51
                }],
                [0, {
                    [EJ]: n51
                }]
            ]
        ],
        b93 = [3, C1, Aq3, 0, [t47, e47, a47, r47, sq8, o47, s47],
            [
                [5, {
                    [L46]: t47
                }],
                [5, {
                    [L46]: e47
                }],
                [0, {
                    [L46]: a47
                }],
                [1, {
                    [L46]: r47
                }],
                [0, {
                    [L46]: sq8
                }],
                [0, {
                    [L46]: o47
                }],
                [0, {
                    [L46]: s47
                }]
            ]
        ],
        x93 = [3, C1, qq3, 0, [sq8, HK3],
            [0, [() => zY3, 0]]
        ],
        fK7 = [3, C1, Kq3, 0, [eq7, zJ6],
            [0, [() => HY3, 0]]
        ],
        u93 = [3, C1, wq3, 0, [eq7],
            [0]
        ],
        m93 = [3, C1, $q3, 0, [qK7, fq7],
            [0, 15]
        ],
        B93 = [-3, C1, Yq3, {
                [ry]: uu,
                [oy]: 424
            },
            [lV, lq7, v53],
            [0, 1, 0]
        ];
    iT.TypeRegistry.for(C1).registerError(B93, Jq7);
    var g93 = [-3, C1, _q3, {
            [ry]: uu,
            [oy]: 429
        },
        [lV],
        [0]
    ];
    iT.TypeRegistry.for(C1).registerError(g93, Mq7);
    var j31 = [-3, C1, Oq3, {
            [ry]: uu,
            [oy]: 424
        },
        [lV, lq7, D53],
        [0, 1, 0]
    ];
    iT.TypeRegistry.for(C1).registerError(j31, Xq7);
    var NK8 = [-3, C1, Hq3, {
            [ry]: uu,
            [oy]: 408
        },
        [lV],
        [0]
    ];
    iT.TypeRegistry.for(C1).registerError(NK8, Dq7);
    var F93 = [3, C1, Dq3, 8, [Zo],
            [
                [() => TK8, 0]
            ]
        ],
        J31 = [3, C1, Mq3, 0, [A53],
            [0]
        ],
        TK7 = [3, C1, Xq3, 0, [lK3],
            [0]
        ],
        p93 = [3, C1, Nq3, 8, [yJ, _K7],
            [0, 0]
        ],
        Q93 = [-3, C1, Tq3, {
                [ry]: uu,
                [oy]: 404
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(Q93, $q7);
    var VK8 = [3, C1, Rq3, 0, [Y33, Nq7],
            [0, 0]
        ],
        vK7 = [3, C1, Sq3, 0, [FQ, GK8, zJ6, zK8],
            [0, 0, () => kY3, () => JK7]
        ],
        U93 = [3, C1, Cq3, 0, [yJ],
            [0]
        ],
        d93 = [3, C1, bq3, 0, [h53, fC6, o51],
            [1, 1, 1]
        ],
        c93 = [-3, C1, hq3, {
                [ry]: uu,
                [oy]: 400
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(c93, Hq7);
    var M31 = [3, C1, xq3, 0, [ay],
            [0]
        ],
        D31 = [-3, C1, Bq3, {
                [ry]: zK7,
                [oy]: 503
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(D31, jq7);
    var l93 = [3, C1, uq3, 0, [Go],
            [0]
        ],
        i93 = [3, C1, kq3, 0, [KK8, S46, K53, jK8, r53],
            [
                [0, 4], 0, [() => J33, 0], () => RK8, () => EY3
            ]
        ],
        n93 = [3, C1, Eq3, 0, [a51],
            [0]
        ],
        r93 = [3, C1, mq3, 0, [Go],
            [0]
        ],
        o93 = [3, C1, gq3, 0, [tK3, _33],
            [0, 0]
        ],
        X31 = [-3, C1, Qq3, {
                [ry]: uu,
                [oy]: 429
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(X31, _q7);
    var NK7 = [3, C1, sq3, 0, [Bq7, P53, n53, yK3, RK3],
            [1, 1, 1, 1, 1]
        ],
        kK8 = [3, C1, Fq3, 0, [s53, Q53],
            [() => RY3, () => Az3]
        ],
        a93 = [3, C1, cq3, 0, [z31, zJ6, K31, ay],
            [0, () => LY3, 0, 0]
        ],
        s93 = [3, C1, nq3, 0, [z31, ay, K31],
            [0, 0, 0]
        ],
        t93 = [3, C1, aq3, 0, [Go, BK3, nK3],
            [0, 0, () => qz3]
        ],
        e93 = [3, C1, tq3, 0, [z31, Go, wK8, ay],
            [0, 0, 15, 0]
        ],
        AY3 = [3, C1, eq3, 0, [wK8],
            [0]
        ],
        qY3 = [3, C1, AK3, 0, [z31, Go, ay],
            [0, 0, 0]
        ],
        P31 = [-3, C1, zK3, {
                [ry]: uu,
                [oy]: 400
            },
            [lV],
            [0]
        ];
    iT.TypeRegistry.for(C1).registerError(P31, wq7);
    var VK7 = [3, C1, YK3, 0, [WC6, FQ],
            [0, () => zz3]
        ],
        KY3 = [3, C1, wK3, 0, [z33, gK3],
            [0, 0]
        ],
        YY3 = [-3, wK7, "BedrockRuntimeServiceException", 0, [],
            []
        ];
    iT.TypeRegistry.for(wK7).registerError(YY3, nT);
    var zY3 = [1, C1, VA3, 0, [() => Z33, 0]],
        _Y3 = [1, C1, UA3, 0, () => CY3],
        wY3 = [1, C1, M73, 0, () => v33],
        OY3 = [1, C1, tA3, 0, () => IY3],
        $Y3 = [1, C1, eA3, 0, () => k33],
        HY3 = [1, C1, SA3, 0, [() => bY3, 0]],
        jY3 = [1, C1, P73, 0, () => FY3],
        kK7 = [1, C1, E73, 0, [() => DK7, 0]],
        JY3 = [1, C1, R73, 0, [() => c51, 0]],
        MY3 = [1, C1, S73, 0, [() => QY3, 0]],
        Aq7 = [1, C1, x73, 0, [() => n33, 0]],
        EK8 = [1, C1, F73, 0, () => s33],
        PC6 = [1, C1, U73, 0, [() => e33, 0]],
        DY3 = [1, C1, o73, 0, [() => TC6, 0]],
        XY3 = [1, C1, s73, 0, [() => K93, 0]],
        PY3 = [1, C1, q43, 0, [() => UY3, 0]],
        WY3 = [1, C1, z43, 0, () => _93],
        ZY3 = [1, C1, w43, 0, () => O93],
        GY3 = [1, C1, D43, 0, () => J93],
        fY3 = [1, C1, T43, 0, () => P93],
        TY3 = [1, C1, N43, 0, () => W93],
        vY3 = [1, C1, k43, 0, () => Z93],
        NY3 = [1, C1, y43, 0, () => G93],
        VY3 = [1, C1, b43, 0, () => V93],
        yK8 = [1, C1, jq3, 0, [() => fK7, 0]],
        kY3 = [1, C1, Iq3, 0, () => U93],
        LK8 = [1, C1, yq3, 0, [() => tY3, 0]],
        EY3 = [1, C1, dq3, 0, () => o93],
        yY3 = [1, C1, lq3, 0, () => Kz3],
        LY3 = [1, C1, rq3, 0, () => Yz3],
        RY3 = [1, C1, qK3, 0, () => eY3],
        hY3 = [2, C1, y73, 0, [0, 0],
            [() => kK7, 0]
        ],
        SY3 = [2, C1, L73, 0, [0, 0],
            [() => DK7, 0]
        ],
        EK7 = [2, C1, Pq3, 8, 0, () => rY3],
        yK7 = [2, C1, fq3, 8, 0, 0],
        RK8 = [3, C1, TA3, 0, [L53],
            [() => W33]
        ],
        CY3 = [3, C1, QA3, 0, [yJ],
            [0]
        ],
        LK7 = [3, C1, dA3, 0, [O33, bK3, uK3, xK3, S53],
            [() => KY3, () => Q33, () => d33, () => U33, () => d93]
        ],
        IY3 = [3, C1, aA3, 0, [yJ],
            [0]
        ],
        bY3 = [3, C1, mA3, 0, [yJ, s51, Lq7, $K7, ZK8, WK8, xq7, qK8, aq7, fK3, KK7],
            [0, () => ZK7, () => MK7, () => VK7, () => e93, () => a93, [() => RK7, 0], () => vK8, [() => oY3, 0], () => N33, () => vK7]
        ],
        xY3 = [3, C1, CA3, 0, [yJ, ZK8, WK8, aq7, hK3],
            [0, () => AY3, () => yY3, [() => aY3, 0], () => V33]
        ],
        uY3 = [3, C1, bA3, 0, [ZK8, WK8],
            [() => qY3, () => s93]
        ],
        mY3 = [3, C1, lA3, 0, [lV],
            [
                [() => fK7, 0]
            ]
        ],
        BY3 = [3, C1, K73, {
                [Y31]: 1
            },
            [z53, ZK3, WK3, GK3, _53, $53, OK8, $K8, fK8, PK8, MK8],
            [() => u93, () => L33, [() => y33, 0], () => R33, () => m93, [() => I33, 0],
                [() => H31, 0],
                [() => j31, 0],
                [() => P31, 0],
                [() => X31, 0],
                [() => D31, 0]
            ]
        ],
        gY3 = [3, C1, O73, 0, [iK3, CK3],
            [
                [() => R93, 0],
                [() => B33, 0]
            ]
        ],
        FY3 = [3, C1, W73, 0, [yJ],
            [0]
        ],
        pY3 = [3, C1, T73, 0, [Zo, JK8, yJ, zJ6],
            [21, () => VK8, 0, () => jY3]
        ],
        QY3 = [3, C1, h73, 0, [w33, sK3, u53, aK3, F53, U53, j53],
            [
                [() => Y93, 0],
                [() => r33, 0],
                [() => t33, 0],
                [() => i33, 0],
                [() => q93, 0], () => A93, () => o33
            ]
        ],
        UY3 = [3, C1, A43, 0, [yJ, s51],
            [() => v93, [() => M93, 0]]
        ],
        RK7 = [3, C1, K43, 0, [yJ, s51],
            [() => j93, [() => H93, 0]]
        ],
        dY3 = [3, C1, H43, 8, [Zo],
            [21]
        ],
        cY3 = [3, C1, G43, 8, [Zo],
            [21]
        ],
        lY3 = [3, C1, s43, 0, [Zo, JK8],
            [21, () => VK8]
        ],
        iY3 = [3, C1, c43, {
                [Y31]: 1
            },
            [YK8],
            [
                [() => f33, 0]
            ]
        ],
        nY3 = [3, C1, l43, {
                [Y31]: 1
            },
            [YK8, OK8, $K8, fK8, PK8, dq7, MK8],
            [
                [() => T33, 0],
                [() => H31, 0],
                [() => j31, 0],
                [() => P31, 0],
                [() => X31, 0],
                [() => NK8, 0],
                [() => D31, 0]
            ]
        ],
        rY3 = [3, C1, Wq3, 0, [yJ],
            [0]
        ],
        oY3 = [3, C1, Zq3, 8, [N53, sq7],
            [
                [() => p93, 0], 21
            ]
        ],
        aY3 = [3, C1, Gq3, 8, [yJ, sq7, _K7],
            [0, 21, 0]
        ],
        sY3 = [3, C1, vq3, {
                [Y31]: 1
            },
            [YK8, OK8, $K8, fK8, PK8, dq7, MK8],
            [
                [() => F93, 0],
                [() => H31, 0],
                [() => j31, 0],
                [() => P31, 0],
                [() => X31, 0],
                [() => NK8, 0],
                [() => D31, 0]
            ]
        ],
        tY3 = [3, C1, Lq3, 0, [yJ, xq7, qK8],
            [0, [() => RK7, 0], () => vK8]
        ],
        eY3 = [3, C1, KK3, 0, [i53, b53, qK8],
            [() => t93, () => r93, () => vK8]
        ],
        Az3 = [3, C1, pq3, 0, [PK3, DK3, t53],
            [() => G33, () => D33, () => l93]
        ],
        qz3 = [3, C1, Uq3, 0, [gq7],
            [15]
        ],
        Kz3 = [3, C1, iq3, 0, [yJ],
            [0]
        ],
        Yz3 = [3, C1, oq3, 0, [gq7, yJ, s51, Lq7, $K7, KK7],
            [15, 0, () => ZK7, () => MK7, () => VK7, () => vK7]
        ],
        zz3 = [3, C1, _K3, 0, [Zo, JK8],
            [21, () => VK8]
        ],
        _z3 = [9, C1, WA3, {
            [mu]: ["POST", "/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply", 200]
        }, () => X33, () => P33],
        wz3 = [9, C1, D73, {
            [mu]: ["POST", "/model/{modelId}/converse", 200]
        }, () => S33, () => C33],
        Oz3 = [9, C1, oA3, {
            [mu]: ["POST", "/model/{modelId}/converse-stream", 200]
        }, () => x33, () => u33],
        $z3 = [9, C1, J73, {
            [mu]: ["POST", "/model/{modelId}/count-tokens", 200]
        }, () => F33, () => p33],
        Hz3 = [9, C1, N73, {
            [mu]: ["GET", "/async-invoke/{invocationArn}", 200]
        }, () => c33, () => l33],
        jz3 = [9, C1, F43, {
            [mu]: ["POST", "/model/{modelId}/invoke", 200]
        }, () => y93, () => L93],
        Jz3 = [9, C1, d43, {
            [mu]: ["POST", "/model/{modelId}/invoke-with-bidirectional-stream", 200]
        }, () => h93, () => S93],
        Mz3 = [9, C1, r43, {
            [mu]: ["POST", "/model/{modelId}/invoke-with-response-stream", 200]
        }, () => C93, () => I93],
        Dz3 = [9, C1, e43, {
            [mu]: ["GET", "/async-invoke", 200]
        }, () => b93, () => x93],
        Xz3 = [9, C1, Vq3, {
            [mu]: ["POST", "/async-invoke", 200]
        }, () => i93, () => n93];
    class hK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ApplyGuardrail", {}).n("BedrockRuntimeClient", "ApplyGuardrailCommand").sc(_z3).build() {}
    class SK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "Converse", {}).n("BedrockRuntimeClient", "ConverseCommand").sc(wz3).build() {}
    class CK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ConverseStream", {
        eventStream: {
            output: !0
        }
    }).n("BedrockRuntimeClient", "ConverseStreamCommand").sc(Oz3).build() {}
    class IK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "CountTokens", {}).n("BedrockRuntimeClient", "CountTokensCommand").sc($z3).build() {}
    class bK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "GetAsyncInvoke", {}).n("BedrockRuntimeClient", "GetAsyncInvokeCommand").sc(Hz3).build() {}
    class xK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModel", {}).n("BedrockRuntimeClient", "InvokeModelCommand").sc(jz3).build() {}
    class uK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions()), qq7.getEventStreamPlugin(K), Kq7.getWebSocketPlugin(K, {
            headerPrefix: "x-amz-bedrock-"
        })]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithBidirectionalStream", {
        eventStream: {
            input: !0,
            output: !0
        }
    }).n("BedrockRuntimeClient", "InvokeModelWithBidirectionalStreamCommand").sc(Jz3).build() {}
    class mK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithResponseStream", {
        eventStream: {
            output: !0
        }
    }).n("BedrockRuntimeClient", "InvokeModelWithResponseStreamCommand").sc(Mz3).build() {}
    class W31 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ListAsyncInvokes", {}).n("BedrockRuntimeClient", "ListAsyncInvokesCommand").sc(Dz3).build() {}
    class BK8 extends hP.Command.classBuilder().ep(xu).m(function(A, q, K, Y) {
        return [zC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "StartAsyncInvoke", {}).n("BedrockRuntimeClient", "StartAsyncInvokeCommand").sc(Xz3).build() {}
    var Pz3 = {
        ApplyGuardrailCommand: hK8,
        ConverseCommand: SK8,
        ConverseStreamCommand: CK8,
        CountTokensCommand: IK8,
        GetAsyncInvokeCommand: bK8,
        InvokeModelCommand: xK8,
        InvokeModelWithBidirectionalStreamCommand: uK8,
        InvokeModelWithResponseStreamCommand: mK8,
        ListAsyncInvokesCommand: W31,
        StartAsyncInvokeCommand: BK8
    };
    class gK8 extends l51 {}
    hP.createAggregatedClient(Pz3, gK8);
    var Wz3 = d51.createPaginator(l51, W31, "nextToken", "nextToken", "maxResults"),
        Zz3 = {
            COMPLETED: "Completed",
            FAILED: "Failed",
            IN_PROGRESS: "InProgress"
        },
        Gz3 = {
            SUBMISSION_TIME: "SubmissionTime"
        },
        fz3 = {
            ASCENDING: "Ascending",
            DESCENDING: "Descending"
        },
        Tz3 = {
            JPEG: "jpeg",
            PNG: "png"
        },
        vz3 = {
            GROUNDING_SOURCE: "grounding_source",
            GUARD_CONTENT: "guard_content",
            QUERY: "query"
        },
        Nz3 = {
            FULL: "FULL",
            INTERVENTIONS: "INTERVENTIONS"
        },
        Vz3 = {
            INPUT: "INPUT",
            OUTPUT: "OUTPUT"
        },
        kz3 = {
            GUARDRAIL_INTERVENED: "GUARDRAIL_INTERVENED",
            NONE: "NONE"
        },
        Ez3 = {
            ALWAYS_FALSE: "ALWAYS_FALSE",
            ALWAYS_TRUE: "ALWAYS_TRUE"
        },
        yz3 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        Lz3 = {
            HIGH: "HIGH",
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            NONE: "NONE"
        },
        Rz3 = {
            HIGH: "HIGH",
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            NONE: "NONE"
        },
        hz3 = {
            HATE: "HATE",
            INSULTS: "INSULTS",
            MISCONDUCT: "MISCONDUCT",
            PROMPT_ATTACK: "PROMPT_ATTACK",
            SEXUAL: "SEXUAL",
            VIOLENCE: "VIOLENCE"
        },
        Sz3 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        Cz3 = {
            GROUNDING: "GROUNDING",
            RELEVANCE: "RELEVANCE"
        },
        Iz3 = {
            ANONYMIZED: "ANONYMIZED",
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        bz3 = {
            ADDRESS: "ADDRESS",
            AGE: "AGE",
            AWS_ACCESS_KEY: "AWS_ACCESS_KEY",
            AWS_SECRET_KEY: "AWS_SECRET_KEY",
            CA_HEALTH_NUMBER: "CA_HEALTH_NUMBER",
            CA_SOCIAL_INSURANCE_NUMBER: "CA_SOCIAL_INSURANCE_NUMBER",
            CREDIT_DEBIT_CARD_CVV: "CREDIT_DEBIT_CARD_CVV",
            CREDIT_DEBIT_CARD_EXPIRY: "CREDIT_DEBIT_CARD_EXPIRY",
            CREDIT_DEBIT_CARD_NUMBER: "CREDIT_DEBIT_CARD_NUMBER",
            DRIVER_ID: "DRIVER_ID",
            EMAIL: "EMAIL",
            INTERNATIONAL_BANK_ACCOUNT_NUMBER: "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
            IP_ADDRESS: "IP_ADDRESS",
            LICENSE_PLATE: "LICENSE_PLATE",
            MAC_ADDRESS: "MAC_ADDRESS",
            NAME: "NAME",
            PASSWORD: "PASSWORD",
            PHONE: "PHONE",
            PIN: "PIN",
            SWIFT_CODE: "SWIFT_CODE",
            UK_NATIONAL_HEALTH_SERVICE_NUMBER: "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
            UK_NATIONAL_INSURANCE_NUMBER: "UK_NATIONAL_INSURANCE_NUMBER",
            UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER: "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
            URL: "URL",
            USERNAME: "USERNAME",
            US_BANK_ACCOUNT_NUMBER: "US_BANK_ACCOUNT_NUMBER",
            US_BANK_ROUTING_NUMBER: "US_BANK_ROUTING_NUMBER",
            US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER: "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
            US_PASSPORT_NUMBER: "US_PASSPORT_NUMBER",
            US_SOCIAL_SECURITY_NUMBER: "US_SOCIAL_SECURITY_NUMBER",
            VEHICLE_IDENTIFICATION_NUMBER: "VEHICLE_IDENTIFICATION_NUMBER"
        },
        xz3 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        uz3 = {
            DENY: "DENY"
        },
        mz3 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        Bz3 = {
            PROFANITY: "PROFANITY"
        },
        gz3 = {
            DISABLED: "disabled",
            ENABLED: "enabled",
            ENABLED_FULL: "enabled_full"
        },
        Fz3 = {
            DEFAULT: "default"
        },
        pz3 = {
            CSV: "csv",
            DOC: "doc",
            DOCX: "docx",
            HTML: "html",
            MD: "md",
            PDF: "pdf",
            TXT: "txt",
            XLS: "xls",
            XLSX: "xlsx"
        },
        Qz3 = {
            JPEG: "jpeg",
            PNG: "png"
        },
        Uz3 = {
            GROUNDING_SOURCE: "grounding_source",
            GUARD_CONTENT: "guard_content",
            QUERY: "query"
        },
        dz3 = {
            GIF: "gif",
            JPEG: "jpeg",
            PNG: "png",
            WEBP: "webp"
        },
        cz3 = {
            FLV: "flv",
            MKV: "mkv",
            MOV: "mov",
            MP4: "mp4",
            MPEG: "mpeg",
            MPG: "mpg",
            THREE_GP: "three_gp",
            WEBM: "webm",
            WMV: "wmv"
        },
        lz3 = {
            ERROR: "error",
            SUCCESS: "success"
        },
        iz3 = {
            SERVER_TOOL_USE: "server_tool_use"
        },
        nz3 = {
            ASSISTANT: "assistant",
            USER: "user"
        },
        rz3 = {
            OPTIMIZED: "optimized",
            STANDARD: "standard"
        },
        oz3 = {
            DEFAULT: "default",
            FLEX: "flex",
            PRIORITY: "priority"
        },
        az3 = {
            CONTENT_FILTERED: "content_filtered",
            END_TURN: "end_turn",
            GUARDRAIL_INTERVENED: "guardrail_intervened",
            MAX_TOKENS: "max_tokens",
            MODEL_CONTEXT_WINDOW_EXCEEDED: "model_context_window_exceeded",
            STOP_SEQUENCE: "stop_sequence",
            TOOL_USE: "tool_use"
        },
        sz3 = {
            ASYNC: "async",
            SYNC: "sync"
        },
        tz3 = {
            DISABLED: "DISABLED",
            ENABLED: "ENABLED",
            ENABLED_FULL: "ENABLED_FULL"
        };
    Object.defineProperty(FK8, "$Command", {
        enumerable: !0,
        get: function() {
            return hP.Command
        }
    });
    Object.defineProperty(FK8, "__Client", {
        enumerable: !0,
        get: function() {
            return hP.Client
        }
    });
    FK8.AccessDeniedException = Yq7;
    FK8.ApplyGuardrailCommand = hK8;
    FK8.AsyncInvokeStatus = Zz3;
    FK8.BedrockRuntime = gK8;
    FK8.BedrockRuntimeClient = l51;
    FK8.BedrockRuntimeServiceException = nT;
    FK8.CachePointType = Fz3;
    FK8.ConflictException = Oq7;
    FK8.ConversationRole = nz3;
    FK8.ConverseCommand = SK8;
    FK8.ConverseStreamCommand = CK8;
    FK8.CountTokensCommand = IK8;
    FK8.DocumentFormat = pz3;
    FK8.GetAsyncInvokeCommand = bK8;
    FK8.GuardrailAction = kz3;
    FK8.GuardrailAutomatedReasoningLogicWarningType = Ez3;
    FK8.GuardrailContentFilterConfidence = Lz3;
    FK8.GuardrailContentFilterStrength = Rz3;
    FK8.GuardrailContentFilterType = hz3;
    FK8.GuardrailContentPolicyAction = yz3;
    FK8.GuardrailContentQualifier = vz3;
    FK8.GuardrailContentSource = Vz3;
    FK8.GuardrailContextualGroundingFilterType = Cz3;
    FK8.GuardrailContextualGroundingPolicyAction = Sz3;
    FK8.GuardrailConverseContentQualifier = Uz3;
    FK8.GuardrailConverseImageFormat = Qz3;
    FK8.GuardrailImageFormat = Tz3;
    FK8.GuardrailManagedWordType = Bz3;
    FK8.GuardrailOutputScope = Nz3;
    FK8.GuardrailPiiEntityType = bz3;
    FK8.GuardrailSensitiveInformationPolicyAction = Iz3;
    FK8.GuardrailStreamProcessingMode = sz3;
    FK8.GuardrailTopicPolicyAction = xz3;
    FK8.GuardrailTopicType = uz3;
    FK8.GuardrailTrace = gz3;
    FK8.GuardrailWordPolicyAction = mz3;
    FK8.ImageFormat = dz3;
    FK8.InternalServerException = zq7;
    FK8.InvokeModelCommand = xK8;
    FK8.InvokeModelWithBidirectionalStreamCommand = uK8;
    FK8.InvokeModelWithResponseStreamCommand = mK8;
    FK8.ListAsyncInvokesCommand = W31;
    FK8.ModelErrorException = Jq7;
    FK8.ModelNotReadyException = Mq7;
    FK8.ModelStreamErrorException = Xq7;
    FK8.ModelTimeoutException = Dq7;
    FK8.PerformanceConfigLatency = rz3;
    FK8.ResourceNotFoundException = $q7;
    FK8.ServiceQuotaExceededException = Hq7;
    FK8.ServiceTierType = oz3;
    FK8.ServiceUnavailableException = jq7;
    FK8.SortAsyncInvocationBy = Gz3;
    FK8.SortOrder = fz3;
    FK8.StartAsyncInvokeCommand = BK8;
    FK8.StopReason = az3;
    FK8.ThrottlingException = _q7;
    FK8.ToolResultStatus = lz3;
    FK8.ToolUseType = iz3;
    FK8.Trace = tz3;
    FK8.ValidationException = wq7;
    FK8.VideoFormat = cz3;
    FK8.paginateListAsyncInvokes = Wz3
})
// @from(Ln 98530, Col 0)
function SK7(A, q) {
    return A.find((K) => K.includes(q)) ?? null
}
// @from(Ln 98533, Col 0)
async function CK7() {
    let {
        BedrockClient: A
    } = await Promise.resolve().then(() => t(b51(), 1)), q = OA6(), K = t6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), Y = {
        region: q,
        ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
            endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
        },
        ...await t88(),
        ...K && {
            requestHandler: new(await Promise.resolve().then(() => t(uT(), 1))).NodeHttpHandler,
            httpAuthSchemes: [{
                schemeId: "smithy.api#noAuth",
                identityProvider: () => async () => ({}),
                signer: new(await Promise.resolve().then(() => t(w_(), 1))).NoAuthSigner
            }],
            httpAuthSchemeProvider: () => [{
                schemeId: "smithy.api#noAuth"
            }]
        }
    };
    if (!K && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
        let z = await To();
        if (z) Y.credentials = {
            accessKeyId: z.accessKeyId,
            secretAccessKey: z.secretAccessKey,
            sessionToken: z.sessionToken
        }
    }
    return new A(Y)
}
// @from(Ln 98564, Col 0)
async function IK7() {
    let {
        BedrockRuntimeClient: A
    } = await Promise.resolve().then(() => t(Z31(), 1)), q = OA6(), K = t6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), Y = {
        region: q,
        ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
            endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
        },
        ...await t88(),
        ...K && {
            requestHandler: new(await Promise.resolve().then(() => t(uT(), 1))).NodeHttpHandler,
            httpAuthSchemes: [{
                schemeId: "smithy.api#noAuth",
                identityProvider: () => async () => ({}),
                signer: new(await Promise.resolve().then(() => t(w_(), 1))).NoAuthSigner
            }],
            httpAuthSchemeProvider: () => [{
                schemeId: "smithy.api#noAuth"
            }]
        }
    };
    if (!K && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
        let z = await To();
        if (z) Y.credentials = {
            accessKeyId: z.accessKeyId,
            secretAccessKey: z.secretAccessKey,
            sessionToken: z.sessionToken
        }
    }
    return new A(Y)
}
// @from(Ln 98596, Col 0)
function pK8(A) {
    return A.startsWith("anthropic.")
}
// @from(Ln 98600, Col 0)
function $23(A) {
    if (!A.startsWith("arn:")) return A;
    let q = A.lastIndexOf("/");
    if (q === -1) return A;
    return A.substring(q + 1)
}
// @from(Ln 98607, Col 0)
function f31(A) {
    let q = $23(A);
    for (let K of O23)
        if (q.startsWith(`${K}.anthropic.`)) return K;
    return
}
// @from(Ln 98614, Col 0)
function bK7(A, q) {
    let K = f31(A);
    if (K) return A.replace(`${K}.`, `${q}.`);
    if (pK8(A)) return `${q}.${A}`;
    return A
}
// @from(Ln 98620, Col 4)
hK7
// @from(Ln 98620, Col 9)
G31
// @from(Ln 98620, Col 14)
O23
// @from(Ln 98621, Col 4)
vC6 = E(() => {
    U4();
    fA();
    A8();
    k1();
    dV();
    hK7 = e1(async function() {
        let [A, {
            ListInferenceProfilesCommand: q
        }] = await Promise.all([CK7(), Promise.resolve().then(() => t(b51(), 1))]), K = [], Y;
        try {
            do {
                let z = new q({
                        ...Y && {
                            nextToken: Y
                        },
                        typeEquals: "SYSTEM_DEFINED"
                    }),
                    _ = await A.send(z);
                if (_.inferenceProfileSummaries) K.push(..._.inferenceProfileSummaries);
                Y = _.nextToken
            } while (Y);
            return K.filter((z) => z.inferenceProfileId?.includes("anthropic")).map((z) => z.inferenceProfileId).filter(Boolean)
        } catch (z) {
            throw _6(z), z
        }
    });
    G31 = e1(async function(A) {
        try {
            let [q, {
                GetInferenceProfileCommand: K
            }] = await Promise.all([CK7(), Promise.resolve().then(() => t(b51(), 1))]), Y = new K({
                inferenceProfileIdentifier: A
            }), z = await q.send(Y);
            if (!z.models || z.models.length === 0) return null;
            let _ = z.models[0];
            if (!_?.modelArn) return null;
            let w = _.modelArn.lastIndexOf("/");
            return w >= 0 ? _.modelArn.substring(w + 1) : _.modelArn
        } catch (q) {
            return _6(q), null
        }
    });
    O23 = ["us", "eu", "apac", "global"]
})
// @from(Ln 98666, Col 4)
QK8
// @from(Ln 98666, Col 9)
UK8
// @from(Ln 98666, Col 14)
dK8
// @from(Ln 98666, Col 19)
cK8
// @from(Ln 98666, Col 24)
lK8
// @from(Ln 98666, Col 29)
iK8
// @from(Ln 98666, Col 34)
nK8
// @from(Ln 98666, Col 39)
rK8
// @from(Ln 98666, Col 44)
oK8
// @from(Ln 98666, Col 49)
wJ6
// @from(Ln 98666, Col 54)
aK8
// @from(Ln 98666, Col 59)
OJ6
// @from(Ln 98666, Col 64)
iD_
// @from(Ln 98666, Col 69)
xK7
// @from(Ln 98667, Col 4)
T31 = E(() => {
    QK8 = {
        firstParty: "claude-3-7-sonnet-20250219",
        bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        vertex: "claude-3-7-sonnet@20250219",
        foundry: "claude-3-7-sonnet"
    }, UK8 = {
        firstParty: "claude-3-5-sonnet-20241022",
        bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
        vertex: "claude-3-5-sonnet-v2@20241022",
        foundry: "claude-3-5-sonnet"
    }, dK8 = {
        firstParty: "claude-3-5-haiku-20241022",
        bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
        vertex: "claude-3-5-haiku@20241022",
        foundry: "claude-3-5-haiku"
    }, cK8 = {
        firstParty: "claude-haiku-4-5-20251001",
        bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        vertex: "claude-haiku-4-5@20251001",
        foundry: "claude-haiku-4-5"
    }, lK8 = {
        firstParty: "claude-sonnet-4-20250514",
        bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
        vertex: "claude-sonnet-4@20250514",
        foundry: "claude-sonnet-4"
    }, iK8 = {
        firstParty: "claude-sonnet-4-5-20250929",
        bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
        vertex: "claude-sonnet-4-5@20250929",
        foundry: "claude-sonnet-4-5"
    }, nK8 = {
        firstParty: "claude-opus-4-20250514",
        bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
        vertex: "claude-opus-4@20250514",
        foundry: "claude-opus-4"
    }, rK8 = {
        firstParty: "claude-opus-4-1-20250805",
        bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
        vertex: "claude-opus-4-1@20250805",
        foundry: "claude-opus-4-1"
    }, oK8 = {
        firstParty: "claude-opus-4-5-20251101",
        bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
        vertex: "claude-opus-4-5@20251101",
        foundry: "claude-opus-4-5"
    }, wJ6 = {
        firstParty: "claude-opus-4-6",
        bedrock: "us.anthropic.claude-opus-4-6-v1",
        vertex: "claude-opus-4-6",
        foundry: "claude-opus-4-6"
    }, aK8 = {
        firstParty: "claude-sonnet-4-6",
        bedrock: "us.anthropic.claude-sonnet-4-6",
        vertex: "claude-sonnet-4-6",
        foundry: "claude-sonnet-4-6"
    }, OJ6 = {
        haiku35: dK8,
        haiku45: cK8,
        sonnet35: UK8,
        sonnet37: QK8,
        sonnet40: lK8,
        sonnet45: iK8,
        sonnet46: aK8,
        opus40: nK8,
        opus41: rK8,
        opus45: oK8,
        opus46: wJ6
    }, iD_ = Object.values(OJ6).map((A) => A.firstParty), xK7 = Object.fromEntries(Object.entries(OJ6).map(([A, q]) => [q.firstParty, A]))
})
// @from(Ln 98738, Col 0)
function Bu(A) {
    let q = [],
        K = !1;
    async function Y() {
        if (K) return;
        if (q.length === 0) return;
        K = !0;
        while (q.length > 0) {
            let {
                args: z,
                resolve: _,
                reject: w,
                context: O
            } = q.shift();
            try {
                let $ = await A.apply(O, z);
                _($)
            } catch ($) {
                w($)
            }
        }
        if (K = !1, q.length > 0) Y()
    }
    return function(...z) {
        return new Promise((_, w) => {
            q.push({
                args: z,
                resolve: _,
                reject: w,
                context: this
            }), Y()
        })
    }
}
// @from(Ln 98773, Col 0)
function H23(A, q, K) {
    if (K !== void 0 && !Gx(A[q], K) || K === void 0 && !(q in A)) En(A, q, K)
}
// @from(Ln 98776, Col 4)
NC6
// @from(Ln 98777, Col 4)
sK8 = E(() => {
    ek6();
    jw6();
    NC6 = H23
})
// @from(Ln 98783, Col 0)
function j23(A) {
    return function(q, K, Y) {
        var z = -1,
            _ = Object(q),
            w = Y(q),
            O = w.length;
        while (O--) {
            var $ = w[A ? O : ++z];
            if (K(_[$], $, _) === !1) break
        }
        return q
    }
}
// @from(Ln 98796, Col 4)
uK7
// @from(Ln 98797, Col 4)
mK7 = E(() => {
    uK7 = j23
})
// @from(Ln 98800, Col 4)
J23
// @from(Ln 98800, Col 9)
v31
// @from(Ln 98801, Col 4)
tK8 = E(() => {
    mK7();
    J23 = uK7(), v31 = J23
})
// @from(Ln 98806, Col 0)
function M23(A) {
    return VM(A) && Vx(A)
}
// @from(Ln 98809, Col 4)
BK7
// @from(Ln 98810, Col 4)
gK7 = E(() => {
    Nw6();
    Tx();
    BK7 = M23
})
// @from(Ln 98816, Col 0)
function G23(A) {
    if (!VM(A) || wV(A) != D23) return !1;
    var q = iw6(A);
    if (q === null) return !0;
    var K = W23.call(q, "constructor") && q.constructor;
    return typeof K == "function" && K instanceof K && FK7.call(K) == Z23
}
// @from(Ln 98823, Col 4)
D23 = "[object Object]"
// @from(Ln 98824, Col 4)
X23
// @from(Ln 98824, Col 9)
P23
// @from(Ln 98824, Col 14)
FK7
// @from(Ln 98824, Col 19)
W23
// @from(Ln 98824, Col 24)
Z23
// @from(Ln 98824, Col 29)
$J6
// @from(Ln 98825, Col 4)
N31 = E(() => {
    Q86();
    xt6();
    Tx();
    X23 = Function.prototype, P23 = Object.prototype, FK7 = X23.toString, W23 = P23.hasOwnProperty, Z23 = FK7.call(Object);
    $J6 = G23
})
// @from(Ln 98833, Col 0)
function f23(A, q) {
    if (q === "constructor" && typeof A[q] === "function") return;
    if (q == "__proto__") return;
    return A[q]
}
// @from(Ln 98838, Col 4)
VC6
// @from(Ln 98839, Col 4)
eK8 = E(() => {
    VC6 = f23
})
// @from(Ln 98843, Col 0)
function T23(A) {
    return tE(A, Rx(A))
}
// @from(Ln 98846, Col 4)
pK7
// @from(Ln 98847, Col 4)
QK7 = E(() => {
    wA6();
    lw6();
    pK7 = T23
})
// @from(Ln 98853, Col 0)
function v23(A, q, K, Y, z, _, w) {
    var O = VC6(A, K),
        $ = VC6(q, K),
        H = w.get($);
    if (H) {
        NC6(A, K, H);
        return
    }
    var j = _ ? _(O, $, K + "", A, q, w) : void 0,
        J = j === void 0;
    if (J) {
        var M = q_($),
            D = !M && vx($),
            X = !M && !D && Tw6($);
        if (j = $, M || D || X)
            if (q_(O)) j = O;
            else if (BK7(O)) j = bt6(O);
        else if (D) J = !1, j = qE6($, !0);
        else if (X) J = !1, j = gt6($, !0);
        else j = [];
        else if ($J6($) || Hp($)) {
            if (j = O, Hp(O)) j = pK7(O);
            else if (!A_(O) || $w6(O)) j = Ft6($)
        } else J = !1
    }
    if (J) w.set($, j), z(j, $, Y, _, w), w.delete($);
    NC6(A, K, j)
}
// @from(Ln 98881, Col 4)
UK7
// @from(Ln 98882, Col 4)
dK7 = E(() => {
    sK8();
    Ym1();
    Om1();
    zm1();
    $m1();
    kk6();
    qG();
    gK7();
    Ek6();
    Ss6();
    AG();
    N31();
    ss6();
    eK8();
    QK7();
    UK7 = v23
})
// @from(Ln 98901, Col 0)
function cK7(A, q, K, Y, z) {
    if (A === q) return;
    v31(q, function(_, w) {
        if (z || (z = new fx), A_(_)) UK7(A, q, w, K, cK7, Y, z);
        else {
            var O = Y ? Y(VC6(A, w), _, w + "", A, q, z) : void 0;
            if (O === void 0) O = _;
            NC6(A, w, O)
        }
    }, Rx)
}
// @from(Ln 98912, Col 4)
lK7
// @from(Ln 98913, Col 4)
iK7 = E(() => {
    Vk6();
    sK8();
    tK8();
    dK7();
    AG();
    lw6();
    eK8();
    lK7 = cK7
})
// @from(Ln 98924, Col 0)
function N23(A, q, K) {
    switch (K.length) {
        case 0:
            return A.call(q);
        case 1:
            return A.call(q, K[0]);
        case 2:
            return A.call(q, K[0], K[1]);
        case 3:
            return A.call(q, K[0], K[1], K[2])
    }
    return A.apply(q, K)
}
// @from(Ln 98937, Col 4)
nK7
// @from(Ln 98938, Col 4)
rK7 = E(() => {
    nK7 = N23
})
// @from(Ln 98942, Col 0)
function V23(A, q, K) {
    return q = oK7(q === void 0 ? A.length - 1 : q, 0),
        function() {
            var Y = arguments,
                z = -1,
                _ = oK7(Y.length - q, 0),
                w = Array(_);
            while (++z < _) w[z] = Y[q + z];
            z = -1;
            var O = Array(q + 1);
            while (++z < q) O[z] = Y[z];
            return O[q] = K(w), nK7(A, this, O)
        }
}
// @from(Ln 98956, Col 4)
oK7
// @from(Ln 98956, Col 9)
V31
// @from(Ln 98957, Col 4)
A58 = E(() => {
    rK7();
    oK7 = Math.max;
    V31 = V23
})