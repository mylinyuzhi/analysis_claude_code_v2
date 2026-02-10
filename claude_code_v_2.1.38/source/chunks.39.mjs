
// @from(Ln 102647, Col 4)
Hd8 = R((Gt3) => {
    var UL1 = uL1();

    function Mt3(A) {
        let q = 0,
            K = 0,
            Y = null,
            z = null,
            w = ($) => {
                if (typeof $ !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + $);
                q = $, K = 4, Y = new Uint8Array($), new DataView(Y.buffer).setUint32(0, $, !1)
            },
            H = async function*() {
                let $ = A[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: O,
                        done: _
                    } = await $.next();
                    if (_) {
                        if (!q) return;
                        else if (q === K) yield Y;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let J = O.length,
                        X = 0;
                    while (X < J) {
                        if (!Y) {
                            let j = J - X;
                            if (!z) z = new Uint8Array(4);
                            let M = Math.min(4 - K, j);
                            if (z.set(O.slice(X, X + M), K), K += M, X += M, K < 4) break;
                            w(new DataView(z.buffer).getUint32(0, !1)), z = null
                        }
                        let D = Math.min(q - K, J - X);
                        if (Y.set(O.slice(X, X + D), K), K += D, X += D, q && q === K) yield Y, Y = null, q = 0, K = 0
                    }
                }
            };
        return {
            [Symbol.asyncIterator]: H
        }
    }

    function Pt3(A, q) {
        return async function(K) {
            let {
                value: Y
            } = K.headers[":message-type"];
            if (Y === "error") {
                let z = Error(K.headers[":error-message"].value || "UnknownError");
                throw z.name = K.headers[":error-code"].value, z
            } else if (Y === "exception") {
                let z = K.headers[":exception-type"].value,
                    w = {
                        [z]: K
                    },
                    H = await A(w);
                if (H.$unknown) {
                    let $ = Error(q(K.body));
                    throw $.name = z, $
                }
                throw H[z]
            } else if (Y === "event") {
                let z = {
                        [K.headers[":event-type"].value]: K
                    },
                    w = await A(z);
                if (w.$unknown) return;
                return w
            } else throw Error(`Unrecognizable event type: ${K.headers[":event-type"].value}`)
        }
    }
    class Re6 {
        eventStreamCodec;
        utfEncoder;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.eventStreamCodec = new UL1.EventStreamCodec(A, q), this.utfEncoder = A
        }
        deserialize(A, q) {
            let K = Mt3(A);
            return new UL1.SmithyMessageDecoderStream({
                messageStream: new UL1.MessageDecoderStream({
                    inputStream: K,
                    decoder: this.eventStreamCodec
                }),
                deserializer: Pt3(q, this.utfEncoder)
            })
        }
        serialize(A, q) {
            return new UL1.MessageEncoderStream({
                messageStream: new UL1.SmithyMessageEncoderStream({
                    inputStream: A,
                    serializer: q
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    }
    var Wt3 = (A) => new Re6(A);
    Gt3.EventStreamMarshaller = Re6;
    Gt3.eventStreamSerdeProvider = Wt3
})
// @from(Ln 102755, Col 4)
$d8 = R((Et3) => {
    var Vt3 = Hd8(),
        Nt3 = h1("stream");
    async function* Tt3(A) {
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
            let z = await new Promise((w) => setTimeout(() => w(Y.shift()), 0));
            if (z) yield z;
            K = q && Y.length === 0
        }
    }
    class ye6 {
        universalMarshaller;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.universalMarshaller = new Vt3.EventStreamMarshaller({
                utf8Decoder: q,
                utf8Encoder: A
            })
        }
        deserialize(A, q) {
            let K = typeof A[Symbol.asyncIterator] === "function" ? A : Tt3(A);
            return this.universalMarshaller.deserialize(K, q)
        }
        serialize(A, q) {
            return Nt3.Readable.from(this.universalMarshaller.serialize(A, q))
        }
    }
    var vt3 = (A) => new ye6(A);
    Et3.EventStreamMarshaller = ye6;
    Et3.eventStreamSerdeProvider = vt3
})
// @from(Ln 102799, Col 4)
Od8 = R((yt3) => {
    var Rt3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    yt3.isArrayBuffer = Rt3
})
// @from(Ln 102803, Col 4)
Se6 = R((xt3) => {
    var St3 = Od8(),
        Ce6 = h1("buffer"),
        ht3 = (A, q = 0, K = A.byteLength - q) => {
            if (!St3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Ce6.Buffer.from(A, q, K)
        },
        It3 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Ce6.Buffer.from(A, q) : Ce6.Buffer.from(A)
        };
    xt3.fromArrayBuffer = ht3;
    xt3.fromString = It3
})
// @from(Ln 102817, Col 4)
Xd8 = R((_d8) => {
    Object.defineProperty(_d8, "__esModule", {
        value: !0
    });
    _d8.fromBase64 = void 0;
    var Bt3 = Se6(),
        mt3 = /^[A-Za-z0-9+/]*={0,2}$/,
        Ft3 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!mt3.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, Bt3.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    _d8.fromBase64 = Ft3
})
// @from(Ln 102832, Col 4)
Md8 = R((Dd8) => {
    Object.defineProperty(Dd8, "__esModule", {
        value: !0
    });
    Dd8.toBase64 = void 0;
    var Qt3 = Se6(),
        gt3 = Z2(),
        Ut3 = (A) => {
            let q;
            if (typeof A === "string") q = (0, gt3.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, Qt3.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    Dd8.toBase64 = Ut3
})
// @from(Ln 102848, Col 4)
Gd8 = R((pL1) => {
    var Pd8 = Xd8(),
        Wd8 = Md8();
    Object.keys(Pd8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(pL1, A)) Object.defineProperty(pL1, A, {
            enumerable: !0,
            get: function() {
                return Pd8[A]
            }
        })
    });
    Object.keys(Wd8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(pL1, A)) Object.defineProperty(pL1, A, {
            enumerable: !0,
            get: function() {
                return Wd8[A]
            }
        })
    })
})
// @from(Ln 102868, Col 4)
xd8 = R((hd8) => {
    Object.defineProperty(hd8, "__esModule", {
        value: !0
    });
    hd8.ruleSet = void 0;
    var yd8 = "required",
        db = "fn",
        cb = "argv",
        VO1 = "ref",
        Zd8 = !0,
        fd8 = "isSet",
        cL1 = "booleanEquals",
        fO1 = "error",
        dL1 = "endpoint",
        UG = "tree",
        he6 = "PartitionResult",
        Vd8 = {
            [yd8]: !1,
            type: "string"
        },
        Nd8 = {
            [yd8]: !0,
            default: !1,
            type: "boolean"
        },
        Td8 = {
            [VO1]: "Endpoint"
        },
        Cd8 = {
            [db]: cL1,
            [cb]: [{
                [VO1]: "UseFIPS"
            }, !0]
        },
        Sd8 = {
            [db]: cL1,
            [cb]: [{
                [VO1]: "UseDualStack"
            }, !0]
        },
        pb = {},
        vd8 = {
            [db]: "getAttr",
            [cb]: [{
                [VO1]: he6
            }, "supportsFIPS"]
        },
        Ed8 = {
            [db]: cL1,
            [cb]: [!0, {
                [db]: "getAttr",
                [cb]: [{
                    [VO1]: he6
                }, "supportsDualStack"]
            }]
        },
        kd8 = [Cd8],
        Ld8 = [Sd8],
        Rd8 = [{
            [VO1]: "Region"
        }],
        pt3 = {
            version: "1.0",
            parameters: {
                Region: Vd8,
                UseDualStack: Nd8,
                UseFIPS: Nd8,
                Endpoint: Vd8
            },
            rules: [{
                conditions: [{
                    [db]: fd8,
                    [cb]: [Td8]
                }],
                rules: [{
                    conditions: kd8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: fO1
                }, {
                    rules: [{
                        conditions: Ld8,
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: fO1
                    }, {
                        endpoint: {
                            url: Td8,
                            properties: pb,
                            headers: pb
                        },
                        type: dL1
                    }],
                    type: UG
                }],
                type: UG
            }, {
                rules: [{
                    conditions: [{
                        [db]: fd8,
                        [cb]: Rd8
                    }],
                    rules: [{
                        conditions: [{
                            [db]: "aws.partition",
                            [cb]: Rd8,
                            assign: he6
                        }],
                        rules: [{
                            conditions: [Cd8, Sd8],
                            rules: [{
                                conditions: [{
                                    [db]: cL1,
                                    [cb]: [Zd8, vd8]
                                }, Ed8],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: pb,
                                            headers: pb
                                        },
                                        type: dL1
                                    }],
                                    type: UG
                                }],
                                type: UG
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: fO1
                            }],
                            type: UG
                        }, {
                            conditions: kd8,
                            rules: [{
                                conditions: [{
                                    [db]: cL1,
                                    [cb]: [vd8, Zd8]
                                }],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
                                            properties: pb,
                                            headers: pb
                                        },
                                        type: dL1
                                    }],
                                    type: UG
                                }],
                                type: UG
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: fO1
                            }],
                            type: UG
                        }, {
                            conditions: Ld8,
                            rules: [{
                                conditions: [Ed8],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: pb,
                                            headers: pb
                                        },
                                        type: dL1
                                    }],
                                    type: UG
                                }],
                                type: UG
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: fO1
                            }],
                            type: UG
                        }, {
                            rules: [{
                                endpoint: {
                                    url: "https://bedrock-runtime.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: pb,
                                    headers: pb
                                },
                                type: dL1
                            }],
                            type: UG
                        }],
                        type: UG
                    }],
                    type: UG
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: fO1
                }],
                type: UG
            }]
        };
    hd8.ruleSet = pt3
})
// @from(Ln 103066, Col 4)
Bd8 = R((bd8) => {
    Object.defineProperty(bd8, "__esModule", {
        value: !0
    });
    bd8.defaultEndpointResolver = void 0;
    var dt3 = zb(),
        Ie6 = GC(),
        ct3 = xd8(),
        lt3 = new Ie6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        it3 = (A, q = {}) => {
            return lt3.get(A, () => (0, Ie6.resolveEndpoint)(ct3.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    bd8.defaultEndpointResolver = it3;
    Ie6.customEndpointFunctions.aws = dt3.awsEndpointFunctions
})
// @from(Ln 103087, Col 4)
Ud8 = R((Qd8) => {
    Object.defineProperty(Qd8, "__esModule", {
        value: !0
    });
    Qd8.getRuntimeConfig = void 0;
    var nt3 = YH(),
        rt3 = eQ(),
        ot3 = lz(),
        at3 = gL1(),
        st3 = fk(),
        md8 = Gd8(),
        Fd8 = Z2(),
        tt3 = Le6(),
        et3 = Bd8(),
        Ae3 = (A) => {
            return {
                apiVersion: "2023-09-30",
                base64Decoder: A?.base64Decoder ?? md8.fromBase64,
                base64Encoder: A?.base64Encoder ?? md8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? et3.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? tt3.defaultBedrockRuntimeHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new nt3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#httpBearerAuth"),
                    signer: new ot3.HttpBearerAuthSigner
                }],
                logger: A?.logger ?? new at3.NoOpLogger,
                protocol: A?.protocol ?? new rt3.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.bedrockruntime"
                }),
                serviceId: A?.serviceId ?? "Bedrock Runtime",
                urlParser: A?.urlParser ?? st3.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? Fd8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? Fd8.toUtf8
            }
        };
    Qd8.getRuntimeConfig = Ae3
})
// @from(Ln 103131, Col 4)
rd8 = R((id8) => {
    Object.defineProperty(id8, "__esModule", {
        value: !0
    });
    id8.getRuntimeConfig = void 0;
    var qe3 = n2(),
        Ke3 = qe3.__importDefault(Kd8()),
        xe6 = YH(),
        Ye3 = xA1(),
        ze3 = wd8(),
        pd8 = Ve1(),
        dd8 = oQ(),
        D86 = YJ(),
        we3 = lz(),
        He3 = $d8(),
        $e3 = aQ(),
        cd8 = qM(),
        G81 = af(),
        ld8 = cf(),
        Oe3 = sQ(),
        _e3 = _b(),
        Je3 = Ud8(),
        Xe3 = gL1(),
        De3 = qg(),
        je3 = gL1(),
        Me3 = (A) => {
            (0, je3.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, De3.resolveDefaultsModeConfig)(A),
                K = () => q().then(Xe3.loadConfigsForDefaultMode),
                Y = (0, Je3.getRuntimeConfig)(A);
            (0, xe6.emitWarningIfUnsupportedVersion)(process.version);
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
                authSchemePreference: A?.authSchemePreference ?? (0, G81.loadConfig)(xe6.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? Oe3.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? Ye3.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, dd8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: Ke3.default.version
                }),
                eventStreamPayloadHandlerProvider: A?.eventStreamPayloadHandlerProvider ?? ze3.eventStreamPayloadHandlerProvider,
                eventStreamSerdeProvider: A?.eventStreamSerdeProvider ?? He3.eventStreamSerdeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (w) => w.getIdentityProvider("aws.auth#sigv4"),
                    signer: new xe6.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (w) => w.getIdentityProvider("smithy.api#httpBearerAuth") || (async (H) => {
                        try {
                            return await (0, pd8.fromEnvSigningName)({
                                signingName: "bedrock"
                            })()
                        } catch ($) {
                            return await (0, pd8.nodeProvider)(H)(H)
                        }
                    }),
                    signer: new we3.HttpBearerAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, G81.loadConfig)(cd8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, G81.loadConfig)(D86.NODE_REGION_CONFIG_OPTIONS, {
                    ...D86.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: ld8.NodeHttp2Handler.create(A?.requestHandler ?? (async () => ({
                    ...await K(),
                    disableConcurrentStreams: !0
                }))),
                retryMode: A?.retryMode ?? (0, G81.loadConfig)({
                    ...cd8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || _e3.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? $e3.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? ld8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, G81.loadConfig)(D86.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, G81.loadConfig)(D86.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, G81.loadConfig)(dd8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    id8.getRuntimeConfig = Me3
})
// @from(Ln 103220, Col 4)
td8 = R((Ve3) => {
    var Pe3 = Ge6(),
        We3 = (A) => {
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
        Ge3 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class od8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = Pe3.FieldPosition.HEADER,
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
    class ad8 {
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
    class j86 {
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
            let q = new j86({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = Ze3(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return j86.clone(this)
        }
    }

    function Ze3(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class sd8 {
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

    function fe3(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Ve3.Field = od8;
    Ve3.Fields = ad8;
    Ve3.HttpRequest = j86;
    Ve3.HttpResponse = sd8;
    Ve3.getHttpHandlerExtensionConfiguration = We3;
    Ve3.isValidHostname = fe3;
    Ve3.resolveHttpHandlerRuntimeConfig = Ge3
})
// @from(Ln 103362, Col 4)
p86 = R((T1A) => {
    var Dc8 = ZU8(),
        ed8 = BQ(),
        ye3 = mQ(),
        Ce3 = FQ(),
        Ac8 = $b(),
        jc8 = gp8(),
        Se3 = YJ(),
        M86 = lz(),
        DV = R$(),
        he3 = Up8(),
        Ie3 = rQ(),
        UC = ZC(),
        qc8 = qM(),
        JM = gL1(),
        Kc8 = Le6(),
        xe3 = rd8(),
        Yc8 = fC(),
        zc8 = td8(),
        be3 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "bedrock"
            })
        },
        lb = {
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
        ue3 = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y,
                token: z
            } = A;
            return {
                setHttpAuthScheme(w) {
                    let H = q.findIndex(($) => $.schemeId === w.schemeId);
                    if (H === -1) q.push(w);
                    else q.splice(H, 1, w)
                },
                httpAuthSchemes() {
                    return q
                },
                setHttpAuthSchemeProvider(w) {
                    K = w
                },
                httpAuthSchemeProvider() {
                    return K
                },
                setCredentials(w) {
                    Y = w
                },
                credentials() {
                    return Y
                },
                setToken(w) {
                    z = w
                },
                token() {
                    return z
                }
            }
        },
        Be3 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials(),
                token: A.token()
            }
        },
        me3 = (A, q) => {
            let K = Object.assign(Yc8.getAwsRegionExtensionConfiguration(A), JM.getDefaultExtensionConfiguration(A), zc8.getHttpHandlerExtensionConfiguration(A), ue3(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, Yc8.resolveAwsRegionExtensionConfiguration(K), JM.resolveDefaultRuntimeConfig(K), zc8.resolveHttpHandlerRuntimeConfig(K), Be3(K))
        };
    class W86 extends JM.Client {
        config;
        constructor(...[A]) {
            let q = xe3.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = be3(q),
                Y = Ac8.resolveUserAgentConfig(K),
                z = qc8.resolveRetryConfig(Y),
                w = Se3.resolveRegionConfig(z),
                H = ed8.resolveHostHeaderConfig(w),
                $ = UC.resolveEndpointConfig(H),
                O = he3.resolveEventStreamSerdeConfig($),
                _ = Kc8.resolveHttpAuthSchemeConfig(O),
                J = Dc8.resolveEventStreamConfig(_),
                X = jc8.resolveWebSocketConfig(J),
                D = me3(X, A?.extensions || []);
            this.config = D, this.middlewareStack.use(DV.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(Ac8.getUserAgentPlugin(this.config)), this.middlewareStack.use(qc8.getRetryPlugin(this.config)), this.middlewareStack.use(Ie3.getContentLengthPlugin(this.config)), this.middlewareStack.use(ed8.getHostHeaderPlugin(this.config)), this.middlewareStack.use(ye3.getLoggerPlugin(this.config)), this.middlewareStack.use(Ce3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(M86.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: Kc8.defaultBedrockRuntimeHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new M86.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials,
                    "smithy.api#httpBearerAuth": j.token
                })
            })), this.middlewareStack.use(M86.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var jV = class A extends JM.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Mc8 = class A extends jV {
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
        Pc8 = class A extends jV {
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
        Wc8 = class A extends jV {
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
        Gc8 = class A extends jV {
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
        Zc8 = class A extends jV {
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
        fc8 = class A extends jV {
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
        Vc8 = class A extends jV {
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
        Nc8 = class A extends jV {
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
        Tc8 = class A extends jV {
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
        vc8 = class A extends jV {
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
        Ec8 = class A extends jV {
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
        kc8 = class A extends jV {
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
        Fe3 = "Accept",
        Qe3 = "AccessDeniedException",
        ge3 = "ApplyGuardrail",
        Ue3 = "ApplyGuardrailRequest",
        pe3 = "ApplyGuardrailResponse",
        de3 = "AsyncInvokeMessage",
        ce3 = "AsyncInvokeOutputDataConfig",
        le3 = "AsyncInvokeSummary",
        ie3 = "AsyncInvokeS3OutputDataConfig",
        ne3 = "AsyncInvokeSummaries",
        re3 = "AnyToolChoice",
        oe3 = "AutoToolChoice",
        ae3 = "Body",
        se3 = "BidirectionalInputPayloadPart",
        te3 = "BidirectionalOutputPayloadPart",
        ee3 = "Citation",
        A15 = "ContentBlocks",
        q15 = "ContentBlockDelta",
        K15 = "ContentBlockDeltaEvent",
        Y15 = "ContentBlockStart",
        z15 = "ContentBlockStartEvent",
        w15 = "ContentBlockStopEvent",
        H15 = "ContentBlock",
        $15 = "CitationsConfig",
        O15 = "CitationsContentBlock",
        _15 = "CitationsDelta",
        J15 = "ConflictException",
        X15 = "CitationGeneratedContent",
        D15 = "CitationGeneratedContentList",
        j15 = "CitationLocation",
        M15 = "ConverseMetrics",
        P15 = "ConverseOutput",
        W15 = "CachePointBlock",
        G15 = "ConverseRequest",
        Z15 = "ConverseResponse",
        f15 = "ConverseStream",
        V15 = "CitationSourceContent",
        N15 = "CitationSourceContentDelta",
        T15 = "CitationSourceContentList",
        v15 = "CitationSourceContentListDelta",
        E15 = "ConverseStreamMetrics",
        k15 = "ConverseStreamMetadataEvent",
        L15 = "ConverseStreamOutput",
        R15 = "ConverseStreamRequest",
        y15 = "ConverseStreamResponse",
        C15 = "ConverseStreamTrace",
        S15 = "ConverseTrace",
        h15 = "CountTokensInput",
        I15 = "ConverseTokensRequest",
        x15 = "CountTokensRequest",
        b15 = "CountTokensResponse",
        ue6 = "Content-Type",
        u15 = "CountTokens",
        B15 = "Citations",
        m15 = "Converse",
        F15 = "DocumentBlock",
        Q15 = "DocumentContentBlocks",
        g15 = "DocumentContentBlock",
        U15 = "DocumentCharLocation",
        p15 = "DocumentChunkLocation",
        d15 = "DocumentPageLocation",
        c15 = "DocumentSource",
        l15 = "GuardrailAssessment",
        i15 = "GetAsyncInvoke",
        n15 = "GetAsyncInvokeRequest",
        r15 = "GetAsyncInvokeResponse",
        o15 = "GuardrailAssessmentList",
        a15 = "GuardrailAssessmentListMap",
        s15 = "GuardrailAssessmentMap",
        t15 = "GuardrailAutomatedReasoningDifferenceScenarioList",
        e15 = "GuardrailAutomatedReasoningFinding",
        A65 = "GuardrailAutomatedReasoningFindingList",
        q65 = "GuardrailAutomatedReasoningImpossibleFinding",
        K65 = "GuardrailAutomatedReasoningInvalidFinding",
        Y65 = "GuardrailAutomatedReasoningInputTextReference",
        z65 = "GuardrailAutomatedReasoningInputTextReferenceList",
        w65 = "GuardrailAutomatedReasoningLogicWarning",
        H65 = "GuardrailAutomatedReasoningNoTranslationsFinding",
        $65 = "GuardrailAutomatedReasoningPolicyAssessment",
        O65 = "GuardrailAutomatedReasoningRule",
        _65 = "GuardrailAutomatedReasoningRuleList",
        J65 = "GuardrailAutomatedReasoningScenario",
        X65 = "GuardrailAutomatedReasoningSatisfiableFinding",
        D65 = "GuardrailAutomatedReasoningStatementList",
        j65 = "GuardrailAutomatedReasoningStatementLogicContent",
        M65 = "GuardrailAutomatedReasoningStatementNaturalLanguageContent",
        P65 = "GuardrailAutomatedReasoningStatement",
        W65 = "GuardrailAutomatedReasoningTranslation",
        G65 = "GuardrailAutomatedReasoningTranslationAmbiguousFinding",
        Z65 = "GuardrailAutomatedReasoningTooComplexFinding",
        f65 = "GuardrailAutomatedReasoningTranslationList",
        V65 = "GuardrailAutomatedReasoningTranslationOption",
        N65 = "GuardrailAutomatedReasoningTranslationOptionList",
        T65 = "GuardrailAutomatedReasoningValidFinding",
        v65 = "GuardrailConfiguration",
        E65 = "GuardrailContentBlock",
        k65 = "GuardrailContentBlockList",
        L65 = "GuardrailConverseContentBlock",
        R65 = "GuardrailContentFilter",
        y65 = "GuardrailContentFilterList",
        C65 = "GuardrailContextualGroundingFilter",
        S65 = "GuardrailContextualGroundingFilters",
        h65 = "GuardrailContextualGroundingPolicyAssessment",
        I65 = "GuardrailConverseImageBlock",
        x65 = "GuardrailConverseImageSource",
        b65 = "GuardrailContentPolicyAssessment",
        u65 = "GuardrailConverseTextBlock",
        B65 = "GuardrailCustomWord",
        m65 = "GuardrailCustomWordList",
        F65 = "GuardrailCoverage",
        Q65 = "GuardrailImageBlock",
        g65 = "GuardrailImageCoverage",
        U65 = "GuardrailInvocationMetrics",
        p65 = "GuardrailImageSource",
        d65 = "GuardrailManagedWord",
        c65 = "GuardrailManagedWordList",
        l65 = "GuardrailOutputContent",
        i65 = "GuardrailOutputContentList",
        n65 = "GuardrailPiiEntityFilter",
        r65 = "GuardrailPiiEntityFilterList",
        o65 = "GuardrailRegexFilter",
        a65 = "GuardrailRegexFilterList",
        s65 = "GuardrailStreamConfiguration",
        t65 = "GuardrailSensitiveInformationPolicyAssessment",
        e65 = "GuardrailTopic",
        AA5 = "GuardrailTraceAssessment",
        qA5 = "GuardrailTextBlock",
        KA5 = "GuardrailTextCharactersCoverage",
        YA5 = "GuardrailTopicList",
        zA5 = "GuardrailTopicPolicyAssessment",
        wA5 = "GuardrailUsage",
        HA5 = "GuardrailWordPolicyAssessment",
        $A5 = "ImageBlock",
        OA5 = "InferenceConfiguration",
        _A5 = "InvokeModel",
        JA5 = "InvokeModelRequest",
        XA5 = "InvokeModelResponse",
        DA5 = "InvokeModelTokensRequest",
        jA5 = "InvokeModelWithBidirectionalStream",
        MA5 = "InvokeModelWithBidirectionalStreamInput",
        PA5 = "InvokeModelWithBidirectionalStreamOutput",
        WA5 = "InvokeModelWithBidirectionalStreamRequest",
        GA5 = "InvokeModelWithBidirectionalStreamResponse",
        ZA5 = "InvokeModelWithResponseStream",
        fA5 = "InvokeModelWithResponseStreamRequest",
        VA5 = "InvokeModelWithResponseStreamResponse",
        NA5 = "ImageSource",
        TA5 = "InternalServerException",
        vA5 = "ListAsyncInvokes",
        EA5 = "ListAsyncInvokesRequest",
        kA5 = "ListAsyncInvokesResponse",
        LA5 = "Message",
        RA5 = "ModelErrorException",
        yA5 = "ModelInputPayload",
        CA5 = "ModelNotReadyException",
        SA5 = "MessageStartEvent",
        hA5 = "ModelStreamErrorException",
        IA5 = "MessageStopEvent",
        xA5 = "ModelTimeoutException",
        bA5 = "Messages",
        uA5 = "PartBody",
        BA5 = "PerformanceConfiguration",
        mA5 = "PayloadPart",
        FA5 = "PromptRouterTrace",
        QA5 = "PromptVariableMap",
        gA5 = "PromptVariableValues",
        UA5 = "ReasoningContentBlock",
        pA5 = "ReasoningContentBlockDelta",
        dA5 = "RequestMetadata",
        cA5 = "ResourceNotFoundException",
        lA5 = "ResponseStream",
        iA5 = "ReasoningTextBlock",
        nA5 = "StartAsyncInvoke",
        rA5 = "StartAsyncInvokeRequest",
        oA5 = "StartAsyncInvokeResponse",
        aA5 = "SystemContentBlocks",
        sA5 = "SystemContentBlock",
        tA5 = "S3Location",
        eA5 = "ServiceQuotaExceededException",
        A85 = "SearchResultBlock",
        q85 = "SearchResultContentBlock",
        K85 = "SearchResultContentBlocks",
        Y85 = "SearchResultLocation",
        z85 = "ServiceTier",
        w85 = "SpecificToolChoice",
        H85 = "SystemTool",
        $85 = "ServiceUnavailableException",
        O85 = "Tag",
        _85 = "ToolConfiguration",
        J85 = "ToolChoice",
        X85 = "ThrottlingException",
        D85 = "ToolInputSchema",
        j85 = "TagList",
        M85 = "ToolResultBlock",
        P85 = "ToolResultBlocksDelta",
        W85 = "ToolResultBlockDelta",
        G85 = "ToolResultBlockStart",
        Z85 = "ToolResultContentBlocks",
        f85 = "ToolResultContentBlock",
        V85 = "ToolSpecification",
        N85 = "TokenUsage",
        T85 = "ToolUseBlock",
        v85 = "ToolUseBlockDelta",
        E85 = "ToolUseBlockStart",
        k85 = "Tools",
        L85 = "Tool",
        R85 = "VideoBlock",
        y85 = "ValidationException",
        C85 = "VideoSource",
        S85 = "WebLocation",
        h85 = "X-Amzn-Bedrock-Accept",
        I85 = "X-Amzn-Bedrock-Content-Type",
        Lc8 = "X-Amzn-Bedrock-GuardrailIdentifier",
        Rc8 = "X-Amzn-Bedrock-GuardrailVersion",
        G86 = "X-Amzn-Bedrock-PerformanceConfig-Latency",
        Z86 = "X-Amzn-Bedrock-Service-Tier",
        yc8 = "X-Amzn-Bedrock-Trace",
        En = "action",
        x85 = "asyncInvokeSummaries",
        Be6 = "additionalModelRequestFields",
        Cc8 = "additionalModelResponseFieldPaths",
        Sc8 = "additionalModelResponseFields",
        hc8 = "actionReason",
        b85 = "automatedReasoningPolicy",
        u85 = "automatedReasoningPolicyUnits",
        B85 = "automatedReasoningPolicies",
        Ic8 = "accept",
        m85 = "any",
        F85 = "assessments",
        Q85 = "auto",
        kn = "bytes",
        xc8 = "bucketOwner",
        f81 = "body",
        ib = "client",
        g85 = "contentBlockDelta",
        me6 = "contentBlockIndex",
        U85 = "contentBlockStart",
        p85 = "contentBlockStop",
        d85 = "citationsContent",
        c85 = "claimsFalseScenario",
        l85 = "contextualGroundingPolicy",
        i85 = "contextualGroundingPolicyUnits",
        n85 = "contentPolicy",
        r85 = "contentPolicyImageUnits",
        o85 = "contentPolicyUnits",
        Fe6 = "cachePoint",
        bc8 = "contradictingRules",
        a85 = "cacheReadInputTokens",
        Qe6 = "clientRequestToken",
        f86 = "contentType",
        uc8 = "claimsTrueScenario",
        s85 = "customWords",
        t85 = "cacheWriteInputTokens",
        ge6 = "chunk",
        Ue6 = "citations",
        e85 = "citation",
        Bc8 = "claims",
        NO1 = "content",
        A75 = "context",
        mc8 = "confidence",
        q75 = "converse",
        K75 = "delta",
        Y75 = "documentChar",
        z75 = "documentChunk",
        pe6 = "documentIndex",
        w75 = "documentPage",
        H75 = "differenceScenarios",
        V81 = "detected",
        $75 = "description",
        O75 = "domain",
        Fc8 = "document",
        ok = "error",
        Qc8 = "endTime",
        _75 = "enabled",
        V86 = "end",
        iL1 = "format",
        gc8 = "failureMessage",
        J75 = "filterStrength",
        X75 = "findings",
        Uc8 = "filters",
        pc8 = "guardrail",
        dc8 = "guardrailCoverage",
        cc8 = "guardrailConfig",
        lc8 = "guardContent",
        nL1 = "guardrailIdentifier",
        D75 = "guardrailProcessingLatency",
        rL1 = "guardrailVersion",
        ic8 = "guarded",
        nb = "http",
        ak = "httpError",
        DX = "httpHeader",
        Z81 = "httpQuery",
        de6 = "input",
        N86 = "invocationArn",
        j75 = "inputAssessment",
        nc8 = "inferenceConfig",
        M75 = "invocationMetrics",
        P75 = "invokedModelId",
        W75 = "invokeModel",
        G75 = "inputSchema",
        ce6 = "internalServerException",
        rc8 = "inputTokens",
        Z75 = "identifier",
        f75 = "images",
        T86 = "image",
        V75 = "impossible",
        N75 = "invalid",
        oc8 = "json",
        T75 = "key",
        v75 = "kmsKeyId",
        ac8 = "location",
        sc8 = "latencyMs",
        tc8 = "lastModifiedTime",
        v86 = "logicWarning",
        E75 = "latency",
        k75 = "logic",
        dT = "message",
        ec8 = "modelArn",
        N81 = "modelId",
        L75 = "modelInput",
        R75 = "modelOutput",
        wc8 = "maxResults",
        y75 = "messageStart",
        le6 = "modelStreamErrorException",
        C75 = "messageStop",
        S75 = "maxTokens",
        Al8 = "modelTimeoutException",
        h75 = "managedWordLists",
        E86 = "match",
        ie6 = "messages",
        ql8 = "metrics",
        I75 = "metadata",
        Ln = "name",
        x75 = "naturalLanguage",
        be6 = "nextToken",
        b75 = "noTranslations",
        u75 = "outputs",
        B75 = "outputAssessments",
        ne6 = "outputDataConfig",
        m75 = "originalMessage",
        F75 = "outputScope",
        Kl8 = "originalStatusCode",
        Q75 = "outputTokens",
        g75 = "options",
        U75 = "output",
        Yl8 = "premises",
        k86 = "performanceConfig",
        L86 = "performanceConfigLatency",
        p75 = "piiEntities",
        zl8 = "promptRouter",
        wl8 = "promptVariables",
        d75 = "policyVersionArn",
        Hl8 = "qualifiers",
        c75 = "regex",
        $l8 = "reasoningContent",
        Ol8 = "redactedContent",
        _l8 = "requestMetadata",
        l75 = "resourceName",
        i75 = "reasoningText",
        n75 = "regexes",
        Jl8 = "role",
        vg = "source",
        Hc8 = "sortBy",
        Xl8 = "sourceContent",
        $c8 = "statusEquals",
        r75 = "sensitiveInformationPolicy",
        o75 = "sensitiveInformationPolicyFreeUnits",
        a75 = "sensitiveInformationPolicyUnits",
        re6 = "s3Location",
        Oc8 = "sortOrder",
        s75 = "s3OutputDataConfig",
        t75 = "streamProcessingMode",
        Dl8 = "stopReason",
        e75 = "searchResultIndex",
        A45 = "searchResultLocation",
        jl8 = "searchResult",
        q45 = "supportingRules",
        K45 = "stopSequences",
        Ml8 = "submitTime",
        _c8 = "submitTimeAfter",
        Jc8 = "submitTimeBefore",
        Rn = "serviceTier",
        Y45 = "systemTool",
        z45 = "s3Uri",
        oe6 = "serviceUnavailableException",
        w45 = "satisfiable",
        H45 = "score",
        Pl8 = "server",
        Wl8 = "signature",
        Gl8 = "smithy.ts.sdk.synthetic.com.amazonaws.bedrockruntime",
        R86 = "status",
        oL1 = "start",
        $45 = "statements",
        O45 = "stream",
        y86 = "streaming",
        ae6 = "system",
        sk = "type",
        _45 = "translationAmbiguous",
        se6 = "toolConfig",
        J45 = "textCharacters",
        X45 = "toolChoice",
        D45 = "tooComplex",
        te6 = "throttlingException",
        j45 = "topicPolicy",
        M45 = "topicPolicyUnits",
        P45 = "topP",
        ee6 = "toolResult",
        W45 = "toolSpec",
        G45 = "totalTokens",
        A1A = "toolUse",
        C86 = "toolUseId",
        Z45 = "tags",
        jX = "text",
        f45 = "temperature",
        V45 = "threshold",
        q1A = "title",
        Zl8 = "total",
        N45 = "tools",
        T45 = "tool",
        v45 = "topics",
        TO1 = "trace",
        S86 = "translation",
        E45 = "translations",
        h86 = "usage",
        k45 = "untranslatedClaims",
        L45 = "untranslatedPremises",
        R45 = "uri",
        y45 = "url",
        C45 = "value",
        K1A = "validationException",
        S45 = "valid",
        fl8 = "video",
        h45 = "web",
        I45 = "wordPolicy",
        x45 = "wordPolicyUnits",
        x6 = "com.amazonaws.bedrockruntime",
        Vl8 = [0, x6, de3, 8, 0],
        I86 = [0, x6, ae3, 8, 21],
        b45 = [0, x6, j65, 8, 0],
        Nl8 = [0, x6, M65, 8, 0],
        u45 = [0, x6, yA5, 8, 15],
        Y1A = [0, x6, uA5, 8, 21],
        B45 = [-3, x6, Qe3, {
                [ok]: ib,
                [ak]: 403
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(B45, Mc8);
    var m45 = [3, x6, re3, 0, [],
            []
        ],
        F45 = [3, x6, Ue3, 0, [nL1, rL1, vg, NO1, F75],
            [
                [0, 1],
                [0, 1], 0, [() => QK5, 0], 0
            ]
        ],
        Q45 = [3, x6, pe3, 0, [h86, En, hc8, u75, F85, dc8],
            [() => Rl8, 0, 0, () => cK5, [() => ul8, 0], () => kl8]
        ],
        g45 = [3, x6, ie3, 0, [z45, v75, xc8],
            [0, 0, 0]
        ],
        U45 = [3, x6, le3, 0, [N86, ec8, Qe6, R86, gc8, Ml8, tc8, Qc8, ne6],
            [0, 0, 0, 0, [() => Vl8, 0], 5, 5, 5, () => X1A]
        ],
        p45 = [3, x6, oe3, 0, [],
            []
        ],
        d45 = [3, x6, se3, 8, [kn],
            [
                [() => Y1A, 0]
            ]
        ],
        c45 = [3, x6, te3, 8, [kn],
            [
                [() => Y1A, 0]
            ]
        ],
        z1A = [3, x6, W15, 0, [sk],
            [0]
        ],
        l45 = [3, x6, ee3, 0, [q1A, vg, Xl8, ac8],
            [0, 0, () => hK5, () => Fl8]
        ],
        Tl8 = [3, x6, $15, 0, [_75],
            [2]
        ],
        i45 = [3, x6, O15, 0, [NO1, Ue6],
            [() => CK5, () => SK5]
        ],
        n45 = [3, x6, _15, 0, [q1A, vg, Xl8, ac8],
            [0, 0, () => IK5, () => Fl8]
        ],
        r45 = [3, x6, N15, 0, [jX],
            [0]
        ],
        o45 = [-3, x6, J15, {
                [ok]: ib,
                [ak]: 400
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(o45, Zc8);
    var a45 = [3, x6, K15, 0, [K75, me6],
            [
                [() => z35, 0], 1
            ]
        ],
        s45 = [3, x6, z15, 0, [oL1, me6],
            [() => w35, 1]
        ],
        t45 = [3, x6, w15, 0, [me6],
            [1]
        ],
        e45 = [3, x6, M15, 0, [sc8],
            [1]
        ],
        Aq5 = [3, x6, G15, 0, [N81, ie6, ae6, nc8, se6, cc8, Be6, wl8, Cc8, _l8, k86, Rn],
            [
                [0, 1],
                [() => _1A, 0],
                [() => J1A, 0], () => Cl8, () => $1A, () => yq5, 15, [() => Bl8, 0], 64, [() => ml8, 0], () => B86, () => m86
            ]
        ],
        qq5 = [3, x6, Z15, 0, [U75, Dl8, h86, ql8, Sc8, TO1, k86, Rn],
            [
                [() => H35, 0], 0, () => xl8, () => e45, 15, [() => Oq5, 0], () => B86, () => m86
            ]
        ],
        Kq5 = [3, x6, k15, 0, [h86, ql8, TO1, k86, Rn],
            [() => xl8, () => Yq5, [() => Hq5, 0], () => B86, () => m86]
        ],
        Yq5 = [3, x6, E15, 0, [sc8],
            [1]
        ],
        zq5 = [3, x6, R15, 0, [N81, ie6, ae6, nc8, se6, cc8, Be6, wl8, Cc8, _l8, k86, Rn],
            [
                [0, 1],
                [() => _1A, 0],
                [() => J1A, 0], () => Cl8, () => $1A, () => cq5, 15, [() => Bl8, 0], 64, [() => ml8, 0], () => B86, () => m86
            ]
        ],
        wq5 = [3, x6, y15, 0, [O45],
            [
                [() => $35, 16]
            ]
        ],
        Hq5 = [3, x6, C15, 0, [pc8, zl8],
            [
                [() => Ll8, 0], () => hl8
            ]
        ],
        $q5 = [3, x6, I15, 0, [ie6, ae6, se6, Be6],
            [
                [() => _1A, 0],
                [() => J1A, 0], () => $1A, 15
            ]
        ],
        Oq5 = [3, x6, S15, 0, [pc8, zl8],
            [
                [() => Ll8, 0], () => hl8
            ]
        ],
        _q5 = [3, x6, x15, 0, [N81, de6],
            [
                [0, 1],
                [() => O35, 0]
            ]
        ],
        Jq5 = [3, x6, b15, 0, [rc8],
            [1]
        ],
        vl8 = [3, x6, F15, 0, [iL1, Ln, vg, A75, Ue6],
            [0, 0, () => J35, 0, () => Tl8]
        ],
        Xq5 = [3, x6, U15, 0, [pe6, oL1, V86],
            [1, 1, 1]
        ],
        Dq5 = [3, x6, p15, 0, [pe6, oL1, V86],
            [1, 1, 1]
        ],
        jq5 = [3, x6, d15, 0, [pe6, oL1, V86],
            [1, 1, 1]
        ],
        Mq5 = [3, x6, n15, 0, [N86],
            [
                [0, 1]
            ]
        ],
        Pq5 = [3, x6, r15, 0, [N86, ec8, Qe6, R86, gc8, Ml8, tc8, Qc8, ne6],
            [0, 0, 0, 0, [() => Vl8, 0], 5, 5, 5, () => X1A]
        ],
        El8 = [3, x6, l15, 0, [j45, n85, I45, r75, l85, b85, M75],
            [() => rq5, () => Sq5, () => oq5, () => dq5, () => Iq5, [() => Vq5, 0], () => Fq5]
        ],
        Wq5 = [3, x6, q65, 0, [S86, bc8, v86],
            [
                [() => aL1, 0], () => O1A, [() => x86, 0]
            ]
        ],
        Gq5 = [3, x6, Y65, 0, [jX],
            [
                [() => Nl8, 0]
            ]
        ],
        Zq5 = [3, x6, K65, 0, [S86, bc8, v86],
            [
                [() => aL1, 0], () => O1A, [() => x86, 0]
            ]
        ],
        x86 = [3, x6, w65, 0, [sk, Yl8, Bc8],
            [0, [() => lL1, 0],
                [() => lL1, 0]
            ]
        ],
        fq5 = [3, x6, H65, 0, [],
            []
        ],
        Vq5 = [3, x6, $65, 0, [X75],
            [
                [() => BK5, 0]
            ]
        ],
        Nq5 = [3, x6, O65, 0, [Z75, d75],
            [0, 0]
        ],
        Tq5 = [3, x6, X65, 0, [S86, uc8, c85, v86],
            [
                [() => aL1, 0],
                [() => P86, 0],
                [() => P86, 0],
                [() => x86, 0]
            ]
        ],
        P86 = [3, x6, J65, 0, [$45],
            [
                [() => lL1, 0]
            ]
        ],
        vq5 = [3, x6, P65, 0, [k75, x75],
            [
                [() => b45, 0],
                [() => Nl8, 0]
            ]
        ],
        Eq5 = [3, x6, Z65, 0, [],
            []
        ],
        aL1 = [3, x6, W65, 0, [Yl8, Bc8, L45, k45, mc8],
            [
                [() => lL1, 0],
                [() => lL1, 0],
                [() => Xc8, 0],
                [() => Xc8, 0], 1
            ]
        ],
        kq5 = [3, x6, G65, 0, [g75, H75],
            [
                [() => FK5, 0],
                [() => uK5, 0]
            ]
        ],
        Lq5 = [3, x6, V65, 0, [E45],
            [
                [() => mK5, 0]
            ]
        ],
        Rq5 = [3, x6, T65, 0, [S86, uc8, q45, v86],
            [
                [() => aL1, 0],
                [() => P86, 0], () => O1A, [() => x86, 0]
            ]
        ],
        yq5 = [3, x6, v65, 0, [nL1, rL1, TO1],
            [0, 0, 0]
        ],
        Cq5 = [3, x6, R65, 0, [sk, mc8, J75, En, V81],
            [0, 0, 0, 0, 2]
        ],
        Sq5 = [3, x6, b65, 0, [Uc8],
            [() => gK5]
        ],
        hq5 = [3, x6, C65, 0, [sk, V45, H45, En, V81],
            [0, 1, 1, 0, 2]
        ],
        Iq5 = [3, x6, h65, 0, [Uc8],
            [() => UK5]
        ],
        xq5 = [3, x6, I65, 8, [iL1, vg],
            [0, [() => j35, 0]]
        ],
        bq5 = [3, x6, u65, 0, [jX, Hl8],
            [0, 64]
        ],
        kl8 = [3, x6, F65, 0, [J45, f75],
            [() => iq5, () => mq5]
        ],
        uq5 = [3, x6, B65, 0, [E86, En, V81],
            [0, 0, 2]
        ],
        Bq5 = [3, x6, Q65, 8, [iL1, vg],
            [0, [() => M35, 0]]
        ],
        mq5 = [3, x6, g65, 0, [ic8, Zl8],
            [1, 1]
        ],
        Fq5 = [3, x6, U65, 0, [D75, h86, dc8],
            [1, () => Rl8, () => kl8]
        ],
        Qq5 = [3, x6, d65, 0, [E86, sk, En, V81],
            [0, 0, 0, 2]
        ],
        gq5 = [3, x6, l65, 0, [jX],
            [0]
        ],
        Uq5 = [3, x6, n65, 0, [E86, sk, En, V81],
            [0, 0, 0, 2]
        ],
        pq5 = [3, x6, o65, 0, [Ln, E86, c75, En, V81],
            [0, 0, 0, 0, 2]
        ],
        dq5 = [3, x6, t65, 0, [p75, n75],
            [() => lK5, () => iK5]
        ],
        cq5 = [3, x6, s65, 0, [nL1, rL1, TO1, t75],
            [0, 0, 0, 0]
        ],
        lq5 = [3, x6, qA5, 0, [jX, Hl8],
            [0, 64]
        ],
        iq5 = [3, x6, KA5, 0, [ic8, Zl8],
            [1, 1]
        ],
        nq5 = [3, x6, e65, 0, [Ln, sk, En, V81],
            [0, 0, 0, 2]
        ],
        rq5 = [3, x6, zA5, 0, [v45],
            [() => nK5]
        ],
        Ll8 = [3, x6, AA5, 0, [R75, j75, B75, hc8],
            [64, [() => A35, 0],
                [() => eK5, 0], 0
            ]
        ],
        Rl8 = [3, x6, wA5, 0, [M45, o85, x45, a75, o75, i85, r85, u85, B85],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        oq5 = [3, x6, HA5, 0, [s85, h75],
            [() => pK5, () => dK5]
        ],
        yl8 = [3, x6, $A5, 0, [iL1, vg],
            [0, () => P35]
        ],
        Cl8 = [3, x6, OA5, 0, [S75, f45, P45, K45],
            [1, 1, 1, 64]
        ],
        b86 = [-3, x6, TA5, {
                [ok]: Pl8,
                [ak]: 500
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(b86, Pc8);
    var aq5 = [3, x6, JA5, 0, [f81, f86, Ic8, N81, TO1, nL1, rL1, L86, Rn],
            [
                [() => I86, 16],
                [0, {
                    [DX]: ue6
                }],
                [0, {
                    [DX]: Fe3
                }],
                [0, 1],
                [0, {
                    [DX]: yc8
                }],
                [0, {
                    [DX]: Lc8
                }],
                [0, {
                    [DX]: Rc8
                }],
                [0, {
                    [DX]: G86
                }],
                [0, {
                    [DX]: Z86
                }]
            ]
        ],
        sq5 = [3, x6, XA5, 0, [f81, f86, L86, Rn],
            [
                [() => I86, 16],
                [0, {
                    [DX]: ue6
                }],
                [0, {
                    [DX]: G86
                }],
                [0, {
                    [DX]: Z86
                }]
            ]
        ],
        tq5 = [3, x6, DA5, 0, [f81],
            [
                [() => I86, 0]
            ]
        ],
        eq5 = [3, x6, WA5, 0, [N81, f81],
            [
                [0, 1],
                [() => W35, 16]
            ]
        ],
        AK5 = [3, x6, GA5, 0, [f81],
            [
                [() => G35, 16]
            ]
        ],
        qK5 = [3, x6, fA5, 0, [f81, f86, Ic8, N81, TO1, nL1, rL1, L86, Rn],
            [
                [() => I86, 16],
                [0, {
                    [DX]: ue6
                }],
                [0, {
                    [DX]: h85
                }],
                [0, 1],
                [0, {
                    [DX]: yc8
                }],
                [0, {
                    [DX]: Lc8
                }],
                [0, {
                    [DX]: Rc8
                }],
                [0, {
                    [DX]: G86
                }],
                [0, {
                    [DX]: Z86
                }]
            ]
        ],
        KK5 = [3, x6, VA5, 0, [f81, f86, L86, Rn],
            [
                [() => N35, 16],
                [0, {
                    [DX]: I85
                }],
                [0, {
                    [DX]: G86
                }],
                [0, {
                    [DX]: Z86
                }]
            ]
        ],
        YK5 = [3, x6, EA5, 0, [_c8, Jc8, $c8, wc8, be6, Hc8, Oc8],
            [
                [5, {
                    [Z81]: _c8
                }],
                [5, {
                    [Z81]: Jc8
                }],
                [0, {
                    [Z81]: $c8
                }],
                [1, {
                    [Z81]: wc8
                }],
                [0, {
                    [Z81]: be6
                }],
                [0, {
                    [Z81]: Hc8
                }],
                [0, {
                    [Z81]: Oc8
                }]
            ]
        ],
        zK5 = [3, x6, kA5, 0, [be6, x85],
            [0, [() => yK5, 0]]
        ],
        Sl8 = [3, x6, LA5, 0, [Jl8, NO1],
            [0, [() => xK5, 0]]
        ],
        wK5 = [3, x6, SA5, 0, [Jl8],
            [0]
        ],
        HK5 = [3, x6, IA5, 0, [Dl8, Sc8],
            [0, 15]
        ],
        $K5 = [-3, x6, RA5, {
                [ok]: ib,
                [ak]: 424
            },
            [dT, Kl8, l75],
            [0, 1, 0]
        ];
    DV.TypeRegistry.for(x6).registerError($K5, Tc8);
    var OK5 = [-3, x6, CA5, {
            [ok]: ib,
            [ak]: 429
        },
        [dT],
        [0]
    ];
    DV.TypeRegistry.for(x6).registerError(OK5, vc8);
    var u86 = [-3, x6, hA5, {
            [ok]: ib,
            [ak]: 424
        },
        [dT, Kl8, m75],
        [0, 1, 0]
    ];
    DV.TypeRegistry.for(x6).registerError(u86, kc8);
    var w1A = [-3, x6, xA5, {
            [ok]: ib,
            [ak]: 408
        },
        [dT],
        [0]
    ];
    DV.TypeRegistry.for(x6).registerError(w1A, Ec8);
    var _K5 = [3, x6, mA5, 8, [kn],
            [
                [() => Y1A, 0]
            ]
        ],
        B86 = [3, x6, BA5, 0, [E75],
            [0]
        ],
        hl8 = [3, x6, FA5, 0, [P75],
            [0]
        ],
        JK5 = [3, x6, iA5, 8, [jX, Wl8],
            [0, 0]
        ],
        XK5 = [-3, x6, cA5, {
                [ok]: ib,
                [ak]: 404
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(XK5, fc8);
    var H1A = [3, x6, tA5, 0, [R45, xc8],
            [0, 0]
        ],
        Il8 = [3, x6, A85, 0, [vg, q1A, NO1, Ue6],
            [0, 0, () => rK5, () => Tl8]
        ],
        DK5 = [3, x6, q85, 0, [jX],
            [0]
        ],
        jK5 = [3, x6, Y85, 0, [e75, oL1, V86],
            [1, 1, 1]
        ],
        MK5 = [-3, x6, eA5, {
                [ok]: ib,
                [ak]: 400
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(MK5, Vc8);
    var m86 = [3, x6, z85, 0, [sk],
            [0]
        ],
        F86 = [-3, x6, $85, {
                [ok]: Pl8,
                [ak]: 503
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(F86, Nc8);
    var PK5 = [3, x6, w85, 0, [Ln],
            [0]
        ],
        WK5 = [3, x6, rA5, 0, [Qe6, N81, L75, ne6, Z45],
            [
                [0, 4], 0, [() => u45, 0], () => X1A, () => oK5
            ]
        ],
        GK5 = [3, x6, oA5, 0, [N86],
            [0]
        ],
        ZK5 = [3, x6, H85, 0, [Ln],
            [0]
        ],
        fK5 = [3, x6, O85, 0, [T75, C45],
            [0, 0]
        ],
        Q86 = [-3, x6, X85, {
                [ok]: ib,
                [ak]: 429
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(Q86, Wc8);
    var xl8 = [3, x6, N85, 0, [rc8, Q75, G45, a85, t85],
            [1, 1, 1, 1, 1]
        ],
        $1A = [3, x6, _85, 0, [N45, X45],
            [() => tK5, () => E35]
        ],
        VK5 = [3, x6, M85, 0, [C86, NO1, R86, sk],
            [0, () => sK5, 0, 0]
        ],
        NK5 = [3, x6, G85, 0, [C86, sk, R86],
            [0, 0, 0]
        ],
        TK5 = [3, x6, V85, 0, [Ln, $75, G75],
            [0, 0, () => k35]
        ],
        vK5 = [3, x6, T85, 0, [C86, Ln, de6, sk],
            [0, 0, 15, 0]
        ],
        EK5 = [3, x6, v85, 0, [de6],
            [0]
        ],
        kK5 = [3, x6, E85, 0, [C86, Ln, sk],
            [0, 0, 0]
        ],
        g86 = [-3, x6, y85, {
                [ok]: ib,
                [ak]: 400
            },
            [dT],
            [0]
        ];
    DV.TypeRegistry.for(x6).registerError(g86, Gc8);
    var bl8 = [3, x6, R85, 0, [iL1, vg],
            [0, () => y35]
        ],
        LK5 = [3, x6, S85, 0, [y45, O75],
            [0, 0]
        ],
        RK5 = [-3, Gl8, "BedrockRuntimeServiceException", 0, [],
            []
        ];
    DV.TypeRegistry.for(Gl8).registerError(RK5, jV);
    var yK5 = [1, x6, ne3, 0, [() => U45, 0]],
        CK5 = [1, x6, D15, 0, () => q35],
        SK5 = [1, x6, B15, 0, () => l45],
        hK5 = [1, x6, T15, 0, () => K35],
        IK5 = [1, x6, v15, 0, () => r45],
        xK5 = [1, x6, A15, 0, [() => Y35, 0]],
        bK5 = [1, x6, Q15, 0, () => _35],
        ul8 = [1, x6, o15, 0, [() => El8, 0]],
        uK5 = [1, x6, t15, 0, [() => P86, 0]],
        BK5 = [1, x6, A65, 0, [() => X35, 0]],
        Xc8 = [1, x6, z65, 0, [() => Gq5, 0]],
        O1A = [1, x6, _65, 0, () => Nq5],
        lL1 = [1, x6, D65, 0, [() => vq5, 0]],
        mK5 = [1, x6, f65, 0, [() => aL1, 0]],
        FK5 = [1, x6, N65, 0, [() => Lq5, 0]],
        QK5 = [1, x6, k65, 0, [() => D35, 0]],
        gK5 = [1, x6, y65, 0, () => Cq5],
        UK5 = [1, x6, S65, 0, () => hq5],
        pK5 = [1, x6, m65, 0, () => uq5],
        dK5 = [1, x6, c65, 0, () => Qq5],
        cK5 = [1, x6, i65, 0, () => gq5],
        lK5 = [1, x6, r65, 0, () => Uq5],
        iK5 = [1, x6, a65, 0, () => pq5],
        nK5 = [1, x6, YA5, 0, () => nq5],
        _1A = [1, x6, bA5, 0, [() => Sl8, 0]],
        rK5 = [1, x6, K85, 0, () => DK5],
        J1A = [1, x6, aA5, 0, [() => T35, 0]],
        oK5 = [1, x6, j85, 0, () => fK5],
        aK5 = [1, x6, P85, 0, () => L35],
        sK5 = [1, x6, Z85, 0, () => R35],
        tK5 = [1, x6, k85, 0, () => v35],
        eK5 = [2, x6, a15, 0, [0, 0],
            [() => ul8, 0]
        ],
        A35 = [2, x6, s15, 0, [0, 0],
            [() => El8, 0]
        ],
        Bl8 = [2, x6, QA5, 8, 0, () => Z35],
        ml8 = [2, x6, dA5, 8, 0, 0],
        X1A = [3, x6, ce3, 0, [s75],
            [() => g45]
        ],
        q35 = [3, x6, X15, 0, [jX],
            [0]
        ],
        Fl8 = [3, x6, j15, 0, [h45, Y75, w75, z75, A45],
            [() => LK5, () => Xq5, () => jq5, () => Dq5, () => jK5]
        ],
        K35 = [3, x6, V15, 0, [jX],
            [0]
        ],
        Y35 = [3, x6, H15, 0, [jX, T86, Fc8, fl8, A1A, ee6, lc8, Fe6, $l8, d85, jl8],
            [0, () => yl8, () => vl8, () => bl8, () => vK5, () => VK5, [() => Ql8, 0], () => z1A, [() => f35, 0], () => i45, () => Il8]
        ],
        z35 = [3, x6, q15, 0, [jX, A1A, ee6, $l8, e85],
            [0, () => EK5, () => aK5, [() => V35, 0], () => n45]
        ],
        w35 = [3, x6, Y15, 0, [A1A, ee6],
            [() => kK5, () => NK5]
        ],
        H35 = [3, x6, P15, 0, [dT],
            [
                [() => Sl8, 0]
            ]
        ],
        $35 = [3, x6, L15, {
                [y86]: 1
            },
            [y75, U85, g85, p85, C75, I75, ce6, le6, K1A, te6, oe6],
            [() => wK5, () => s45, [() => a45, 0], () => t45, () => HK5, [() => Kq5, 0],
                [() => b86, 0],
                [() => u86, 0],
                [() => g86, 0],
                [() => Q86, 0],
                [() => F86, 0]
            ]
        ],
        O35 = [3, x6, h15, 0, [W75, q75],
            [
                [() => tq5, 0],
                [() => $q5, 0]
            ]
        ],
        _35 = [3, x6, g15, 0, [jX],
            [0]
        ],
        J35 = [3, x6, c15, 0, [kn, re6, jX, NO1],
            [21, () => H1A, 0, () => bK5]
        ],
        X35 = [3, x6, e15, 0, [S45, N75, w45, V75, _45, D45, b75],
            [
                [() => Rq5, 0],
                [() => Zq5, 0],
                [() => Tq5, 0],
                [() => Wq5, 0],
                [() => kq5, 0], () => Eq5, () => fq5
            ]
        ],
        D35 = [3, x6, E65, 0, [jX, T86],
            [() => lq5, [() => Bq5, 0]]
        ],
        Ql8 = [3, x6, L65, 0, [jX, T86],
            [() => bq5, [() => xq5, 0]]
        ],
        j35 = [3, x6, x65, 8, [kn],
            [21]
        ],
        M35 = [3, x6, p65, 8, [kn],
            [21]
        ],
        P35 = [3, x6, NA5, 0, [kn, re6],
            [21, () => H1A]
        ],
        W35 = [3, x6, MA5, {
                [y86]: 1
            },
            [ge6],
            [
                [() => d45, 0]
            ]
        ],
        G35 = [3, x6, PA5, {
                [y86]: 1
            },
            [ge6, ce6, le6, K1A, te6, Al8, oe6],
            [
                [() => c45, 0],
                [() => b86, 0],
                [() => u86, 0],
                [() => g86, 0],
                [() => Q86, 0],
                [() => w1A, 0],
                [() => F86, 0]
            ]
        ],
        Z35 = [3, x6, gA5, 0, [jX],
            [0]
        ],
        f35 = [3, x6, UA5, 8, [i75, Ol8],
            [
                [() => JK5, 0], 21
            ]
        ],
        V35 = [3, x6, pA5, 8, [jX, Ol8, Wl8],
            [0, 21, 0]
        ],
        N35 = [3, x6, lA5, {
                [y86]: 1
            },
            [ge6, ce6, le6, K1A, te6, Al8, oe6],
            [
                [() => _K5, 0],
                [() => b86, 0],
                [() => u86, 0],
                [() => g86, 0],
                [() => Q86, 0],
                [() => w1A, 0],
                [() => F86, 0]
            ]
        ],
        T35 = [3, x6, sA5, 0, [jX, lc8, Fe6],
            [0, [() => Ql8, 0], () => z1A]
        ],
        v35 = [3, x6, L85, 0, [W45, Y45, Fe6],
            [() => TK5, () => ZK5, () => z1A]
        ],
        E35 = [3, x6, J85, 0, [Q85, m85, T45],
            [() => p45, () => m45, () => PK5]
        ],
        k35 = [3, x6, D85, 0, [oc8],
            [15]
        ],
        L35 = [3, x6, W85, 0, [jX],
            [0]
        ],
        R35 = [3, x6, f85, 0, [oc8, jX, T86, Fc8, fl8, jl8],
            [15, 0, () => yl8, () => vl8, () => bl8, () => Il8]
        ],
        y35 = [3, x6, C85, 0, [kn, re6],
            [21, () => H1A]
        ],
        C35 = [9, x6, ge3, {
            [nb]: ["POST", "/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply", 200]
        }, () => F45, () => Q45],
        S35 = [9, x6, m15, {
            [nb]: ["POST", "/model/{modelId}/converse", 200]
        }, () => Aq5, () => qq5],
        h35 = [9, x6, f15, {
            [nb]: ["POST", "/model/{modelId}/converse-stream", 200]
        }, () => zq5, () => wq5],
        I35 = [9, x6, u15, {
            [nb]: ["POST", "/model/{modelId}/count-tokens", 200]
        }, () => _q5, () => Jq5],
        x35 = [9, x6, i15, {
            [nb]: ["GET", "/async-invoke/{invocationArn}", 200]
        }, () => Mq5, () => Pq5],
        b35 = [9, x6, _A5, {
            [nb]: ["POST", "/model/{modelId}/invoke", 200]
        }, () => aq5, () => sq5],
        u35 = [9, x6, jA5, {
            [nb]: ["POST", "/model/{modelId}/invoke-with-bidirectional-stream", 200]
        }, () => eq5, () => AK5],
        B35 = [9, x6, ZA5, {
            [nb]: ["POST", "/model/{modelId}/invoke-with-response-stream", 200]
        }, () => qK5, () => KK5],
        m35 = [9, x6, vA5, {
            [nb]: ["GET", "/async-invoke", 200]
        }, () => YK5, () => zK5],
        F35 = [9, x6, nA5, {
            [nb]: ["POST", "/async-invoke", 200]
        }, () => WK5, () => GK5];
    class D1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ApplyGuardrail", {}).n("BedrockRuntimeClient", "ApplyGuardrailCommand").sc(C35).build() {}
    class j1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "Converse", {}).n("BedrockRuntimeClient", "ConverseCommand").sc(S35).build() {}
    class M1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ConverseStream", {
        eventStream: {
            output: !0
        }
    }).n("BedrockRuntimeClient", "ConverseStreamCommand").sc(h35).build() {}
    class P1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "CountTokens", {}).n("BedrockRuntimeClient", "CountTokensCommand").sc(I35).build() {}
    class W1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "GetAsyncInvoke", {}).n("BedrockRuntimeClient", "GetAsyncInvokeCommand").sc(x35).build() {}
    class G1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModel", {}).n("BedrockRuntimeClient", "InvokeModelCommand").sc(b35).build() {}
    class Z1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions()), Dc8.getEventStreamPlugin(K), jc8.getWebSocketPlugin(K, {
            headerPrefix: "x-amz-bedrock-"
        })]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithBidirectionalStream", {
        eventStream: {
            input: !0,
            output: !0
        }
    }).n("BedrockRuntimeClient", "InvokeModelWithBidirectionalStreamCommand").sc(u35).build() {}
    class f1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithResponseStream", {
        eventStream: {
            output: !0
        }
    }).n("BedrockRuntimeClient", "InvokeModelWithResponseStreamCommand").sc(B35).build() {}
    class U86 extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ListAsyncInvokes", {}).n("BedrockRuntimeClient", "ListAsyncInvokesCommand").sc(m35).build() {}
    class V1A extends JM.Command.classBuilder().ep(lb).m(function(A, q, K, Y) {
        return [UC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "StartAsyncInvoke", {}).n("BedrockRuntimeClient", "StartAsyncInvokeCommand").sc(F35).build() {}
    var Q35 = {
        ApplyGuardrailCommand: D1A,
        ConverseCommand: j1A,
        ConverseStreamCommand: M1A,
        CountTokensCommand: P1A,
        GetAsyncInvokeCommand: W1A,
        InvokeModelCommand: G1A,
        InvokeModelWithBidirectionalStreamCommand: Z1A,
        InvokeModelWithResponseStreamCommand: f1A,
        ListAsyncInvokesCommand: U86,
        StartAsyncInvokeCommand: V1A
    };
    class N1A extends W86 {}
    JM.createAggregatedClient(Q35, N1A);
    var g35 = M86.createPaginator(W86, U86, "nextToken", "nextToken", "maxResults"),
        U35 = {
            COMPLETED: "Completed",
            FAILED: "Failed",
            IN_PROGRESS: "InProgress"
        },
        p35 = {
            SUBMISSION_TIME: "SubmissionTime"
        },
        d35 = {
            ASCENDING: "Ascending",
            DESCENDING: "Descending"
        },
        c35 = {
            JPEG: "jpeg",
            PNG: "png"
        },
        l35 = {
            GROUNDING_SOURCE: "grounding_source",
            GUARD_CONTENT: "guard_content",
            QUERY: "query"
        },
        i35 = {
            FULL: "FULL",
            INTERVENTIONS: "INTERVENTIONS"
        },
        n35 = {
            INPUT: "INPUT",
            OUTPUT: "OUTPUT"
        },
        r35 = {
            GUARDRAIL_INTERVENED: "GUARDRAIL_INTERVENED",
            NONE: "NONE"
        },
        o35 = {
            ALWAYS_FALSE: "ALWAYS_FALSE",
            ALWAYS_TRUE: "ALWAYS_TRUE"
        },
        a35 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        s35 = {
            HIGH: "HIGH",
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            NONE: "NONE"
        },
        t35 = {
            HIGH: "HIGH",
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            NONE: "NONE"
        },
        e35 = {
            HATE: "HATE",
            INSULTS: "INSULTS",
            MISCONDUCT: "MISCONDUCT",
            PROMPT_ATTACK: "PROMPT_ATTACK",
            SEXUAL: "SEXUAL",
            VIOLENCE: "VIOLENCE"
        },
        A55 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        q55 = {
            GROUNDING: "GROUNDING",
            RELEVANCE: "RELEVANCE"
        },
        K55 = {
            ANONYMIZED: "ANONYMIZED",
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        Y55 = {
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
        z55 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        w55 = {
            DENY: "DENY"
        },
        H55 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        $55 = {
            PROFANITY: "PROFANITY"
        },
        O55 = {
            DISABLED: "disabled",
            ENABLED: "enabled",
            ENABLED_FULL: "enabled_full"
        },
        _55 = {
            DEFAULT: "default"
        },
        J55 = {
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
        X55 = {
            JPEG: "jpeg",
            PNG: "png"
        },
        D55 = {
            GROUNDING_SOURCE: "grounding_source",
            GUARD_CONTENT: "guard_content",
            QUERY: "query"
        },
        j55 = {
            GIF: "gif",
            JPEG: "jpeg",
            PNG: "png",
            WEBP: "webp"
        },
        M55 = {
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
        P55 = {
            ERROR: "error",
            SUCCESS: "success"
        },
        W55 = {
            SERVER_TOOL_USE: "server_tool_use"
        },
        G55 = {
            ASSISTANT: "assistant",
            USER: "user"
        },
        Z55 = {
            OPTIMIZED: "optimized",
            STANDARD: "standard"
        },
        f55 = {
            DEFAULT: "default",
            FLEX: "flex",
            PRIORITY: "priority"
        },
        V55 = {
            CONTENT_FILTERED: "content_filtered",
            END_TURN: "end_turn",
            GUARDRAIL_INTERVENED: "guardrail_intervened",
            MAX_TOKENS: "max_tokens",
            MODEL_CONTEXT_WINDOW_EXCEEDED: "model_context_window_exceeded",
            STOP_SEQUENCE: "stop_sequence",
            TOOL_USE: "tool_use"
        },
        N55 = {
            ASYNC: "async",
            SYNC: "sync"
        },
        T55 = {
            DISABLED: "DISABLED",
            ENABLED: "ENABLED",
            ENABLED_FULL: "ENABLED_FULL"
        };
    Object.defineProperty(T1A, "$Command", {
        enumerable: !0,
        get: function() {
            return JM.Command
        }
    });
    Object.defineProperty(T1A, "__Client", {
        enumerable: !0,
        get: function() {
            return JM.Client
        }
    });
    T1A.AccessDeniedException = Mc8;
    T1A.ApplyGuardrailCommand = D1A;
    T1A.AsyncInvokeStatus = U35;
    T1A.BedrockRuntime = N1A;
    T1A.BedrockRuntimeClient = W86;
    T1A.BedrockRuntimeServiceException = jV;
    T1A.CachePointType = _55;
    T1A.ConflictException = Zc8;
    T1A.ConversationRole = G55;
    T1A.ConverseCommand = j1A;
    T1A.ConverseStreamCommand = M1A;
    T1A.CountTokensCommand = P1A;
    T1A.DocumentFormat = J55;
    T1A.GetAsyncInvokeCommand = W1A;
    T1A.GuardrailAction = r35;
    T1A.GuardrailAutomatedReasoningLogicWarningType = o35;
    T1A.GuardrailContentFilterConfidence = s35;
    T1A.GuardrailContentFilterStrength = t35;
    T1A.GuardrailContentFilterType = e35;
    T1A.GuardrailContentPolicyAction = a35;
    T1A.GuardrailContentQualifier = l35;
    T1A.GuardrailContentSource = n35;
    T1A.GuardrailContextualGroundingFilterType = q55;
    T1A.GuardrailContextualGroundingPolicyAction = A55;
    T1A.GuardrailConverseContentQualifier = D55;
    T1A.GuardrailConverseImageFormat = X55;
    T1A.GuardrailImageFormat = c35;
    T1A.GuardrailManagedWordType = $55;
    T1A.GuardrailOutputScope = i35;
    T1A.GuardrailPiiEntityType = Y55;
    T1A.GuardrailSensitiveInformationPolicyAction = K55;
    T1A.GuardrailStreamProcessingMode = N55;
    T1A.GuardrailTopicPolicyAction = z55;
    T1A.GuardrailTopicType = w55;
    T1A.GuardrailTrace = O55;
    T1A.GuardrailWordPolicyAction = H55;
    T1A.ImageFormat = j55;
    T1A.InternalServerException = Pc8;
    T1A.InvokeModelCommand = G1A;
    T1A.InvokeModelWithBidirectionalStreamCommand = Z1A;
    T1A.InvokeModelWithResponseStreamCommand = f1A;
    T1A.ListAsyncInvokesCommand = U86;
    T1A.ModelErrorException = Tc8;
    T1A.ModelNotReadyException = vc8;
    T1A.ModelStreamErrorException = kc8;
    T1A.ModelTimeoutException = Ec8;
    T1A.PerformanceConfigLatency = Z55;
    T1A.ResourceNotFoundException = fc8;
    T1A.ServiceQuotaExceededException = Vc8;
    T1A.ServiceTierType = f55;
    T1A.ServiceUnavailableException = Nc8;
    T1A.SortAsyncInvocationBy = p35;
    T1A.SortOrder = d35;
    T1A.StartAsyncInvokeCommand = V1A;
    T1A.StopReason = V55;
    T1A.ThrottlingException = Wc8;
    T1A.ToolResultStatus = P55;
    T1A.ToolUseType = W55;
    T1A.Trace = T55;
    T1A.ValidationException = Gc8;
    T1A.VideoFormat = M55;
    T1A.paginateListAsyncInvokes = g35
})
// @from(Ln 105244, Col 0)
function pC(A, q) {
    return A.find((K) => K.includes(q)) ?? null
}
// @from(Ln 105247, Col 0)
async function Ul8() {
    let {
        BedrockClient: A
    } = await Promise.resolve().then(() => o(z86(), 1)), q = j61(), K = J6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), Y = {
        region: q,
        ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
            endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
        },
        ...await uo6(),
        ...K && {
            requestHandler: new(await Promise.resolve().then(() => o(cf(), 1))).NodeHttpHandler,
            httpAuthSchemes: [{
                schemeId: "smithy.api#noAuth",
                identityProvider: () => async () => ({}),
                signer: new(await Promise.resolve().then(() => o(lz(), 1))).NoAuthSigner
            }],
            httpAuthSchemeProvider: () => [{
                schemeId: "smithy.api#noAuth"
            }]
        }
    };
    if (!K && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
        let z = await T81();
        if (z) Y.credentials = {
            accessKeyId: z.accessKeyId,
            secretAccessKey: z.secretAccessKey,
            sessionToken: z.sessionToken
        }
    }
    return new A(Y)
}
// @from(Ln 105278, Col 0)
async function pl8() {
    let {
        BedrockRuntimeClient: A
    } = await Promise.resolve().then(() => o(p86(), 1)), q = j61(), K = J6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), Y = {
        region: q,
        ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
            endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
        },
        ...await uo6(),
        ...K && {
            requestHandler: new(await Promise.resolve().then(() => o(cf(), 1))).NodeHttpHandler,
            httpAuthSchemes: [{
                schemeId: "smithy.api#noAuth",
                identityProvider: () => async () => ({}),
                signer: new(await Promise.resolve().then(() => o(lz(), 1))).NoAuthSigner
            }],
            httpAuthSchemeProvider: () => [{
                schemeId: "smithy.api#noAuth"
            }]
        }
    };
    if (!K && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
        let z = await T81();
        if (z) Y.credentials = {
            accessKeyId: z.accessKeyId,
            secretAccessKey: z.secretAccessKey,
            sessionToken: z.sessionToken
        }
    }
    return new A(Y)
}
// @from(Ln 105310, Col 0)
function v1A(A) {
    return A.startsWith("anthropic.")
}
// @from(Ln 105314, Col 0)
function E1A(A) {
    for (let q of h95)
        if (A.startsWith(`${q}.anthropic.`)) return q;
    return
}
// @from(Ln 105320, Col 0)
function dl8(A, q) {
    let K = E1A(A);
    if (K) return A.replace(`${K}.`, `${q}.`);
    if (v1A(A)) return `${q}.${A}`;
    return A
}
// @from(Ln 105326, Col 4)
gl8
// @from(Ln 105326, Col 9)
d86
// @from(Ln 105326, Col 14)
h95
// @from(Ln 105327, Col 4)
sL1 = v(() => {
    zq();
    J7();
    hA();
    y6();
    bb();
    gl8 = KA(async function() {
        let [A, {
            ListInferenceProfilesCommand: q
        }] = await Promise.all([Ul8(), Promise.resolve().then(() => o(z86(), 1))]), K = [], Y;
        try {
            do {
                let z = new q({
                        ...Y && {
                            nextToken: Y
                        },
                        typeEquals: "SYSTEM_DEFINED"
                    }),
                    w = await A.send(z);
                if (w.inferenceProfileSummaries) K.push(...w.inferenceProfileSummaries);
                Y = w.nextToken
            } while (Y);
            return K.filter((z) => z.inferenceProfileId?.includes("anthropic")).map((z) => z.inferenceProfileId).filter(Boolean)
        } catch (z) {
            throw K1(z), z
        }
    });
    d86 = KA(async function(A) {
        try {
            let [q, {
                GetInferenceProfileCommand: K
            }] = await Promise.all([Ul8(), Promise.resolve().then(() => o(z86(), 1))]), Y = new K({
                inferenceProfileIdentifier: A
            }), z = await q.send(Y);
            if (!z.models || z.models.length === 0) return null;
            let w = z.models[0];
            if (!w?.modelArn) return null;
            let H = w.modelArn.lastIndexOf("/");
            return H >= 0 ? w.modelArn.substring(H + 1) : w.modelArn
        } catch (q) {
            return K1(q), null
        }
    });
    h95 = ["us", "eu", "apac", "global"]
})
// @from(Ln 105373, Col 0)
function k1A(A) {
    if (E4() === "foundry") return;
    let q = A.toLowerCase();
    if (q.includes("claude-opus-4-6[1m]")) return "Opus 4.6 (with 1M context)";
    if (q.includes("claude-opus-4-6")) return "Opus 4.6";
    if (q.includes("claude-opus-4-5")) return "Opus 4.5";
    if (q.includes("claude-opus-4-1")) return "Opus 4.1";
    if (q.includes("claude-opus-4")) return "Opus 4";
    if (q.includes("claude-sonnet-4-5[1m]")) return "Sonnet 4.5 (with 1M context)";
    if (q.includes("claude-sonnet-4-5")) return "Sonnet 4.5";
    if (q.includes("claude-sonnet-4[1m]")) return "Sonnet 4 (with 1M context)";
    if (q.includes("claude-sonnet-4")) return "Sonnet 4";
    if (q.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
    if (q.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
    if (q.includes("claude-haiku-4-5")) return "Haiku 4.5";
    if (q.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
    return
}
// @from(Ln 105391, Col 4)
tL1
// @from(Ln 105391, Col 9)
eL1
// @from(Ln 105391, Col 14)
AR1
// @from(Ln 105391, Col 19)
qR1
// @from(Ln 105391, Col 24)
v81
// @from(Ln 105391, Col 29)
KR1
// @from(Ln 105391, Col 34)
YR1
// @from(Ln 105391, Col 39)
zR1
// @from(Ln 105391, Col 44)
wR1
// @from(Ln 105391, Col 49)
yn
// @from(Ln 105392, Col 4)
vO1 = v(() => {
    UH();
    tL1 = {
        firstParty: "claude-3-7-sonnet-20250219",
        bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        vertex: "claude-3-7-sonnet@20250219",
        foundry: "claude-3-7-sonnet"
    }, eL1 = {
        firstParty: "claude-3-5-sonnet-20241022",
        bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
        vertex: "claude-3-5-sonnet-v2@20241022",
        foundry: "claude-3-5-sonnet"
    }, AR1 = {
        firstParty: "claude-3-5-haiku-20241022",
        bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
        vertex: "claude-3-5-haiku@20241022",
        foundry: "claude-3-5-haiku"
    }, qR1 = {
        firstParty: "claude-haiku-4-5-20251001",
        bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        vertex: "claude-haiku-4-5@20251001",
        foundry: "claude-haiku-4-5"
    }, v81 = {
        firstParty: "claude-sonnet-4-20250514",
        bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
        vertex: "claude-sonnet-4@20250514",
        foundry: "claude-sonnet-4"
    }, KR1 = {
        firstParty: "claude-sonnet-4-5-20250929",
        bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
        vertex: "claude-sonnet-4-5@20250929",
        foundry: "claude-sonnet-4-5"
    }, YR1 = {
        firstParty: "claude-opus-4-20250514",
        bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
        vertex: "claude-opus-4@20250514",
        foundry: "claude-opus-4"
    }, zR1 = {
        firstParty: "claude-opus-4-1-20250805",
        bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
        vertex: "claude-opus-4-1@20250805",
        foundry: "claude-opus-4-1"
    }, wR1 = {
        firstParty: "claude-opus-4-5-20251101",
        bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
        vertex: "claude-opus-4-5@20251101",
        foundry: "claude-opus-4-5"
    }, yn = {
        firstParty: "claude-opus-4-6",
        bedrock: "us.anthropic.claude-opus-4-6-v1",
        vertex: "claude-opus-4-6",
        foundry: "claude-opus-4-6"
    }
})
// @from(Ln 105447, Col 0)
function rb(A) {
    let q = [],
        K = !1;
    async function Y() {
        if (K) return;
        if (q.length === 0) return;
        K = !0;
        while (q.length > 0) {
            let {
                args: z,
                resolve: w,
                reject: H,
                context: $
            } = q.shift();
            try {
                let O = await A.apply($, z);
                w(O)
            } catch (O) {
                H(O)
            }
        }
        if (K = !1, q.length > 0) Y()
    }
    return function(...z) {
        return new Promise((w, H) => {
            q.push({
                args: z,
                resolve: w,
                reject: H,
                context: this
            }), Y()
        })
    }
}
// @from(Ln 105482, Col 0)
function HR1(A) {
    return {
        haiku35: AR1[A],
        haiku45: qR1[A],
        sonnet35: eL1[A],
        sonnet37: tL1[A],
        sonnet40: v81[A],
        sonnet45: KR1[A],
        opus40: YR1[A],
        opus41: zR1[A],
        opus45: wR1[A],
        opus46: yn[A]
    }
}
// @from(Ln 105496, Col 0)
async function I95() {
    let A;
    try {
        A = await gl8()
    } catch (X) {
        return K1(X), HR1("bedrock")
    }
    if (!A?.length) return HR1("bedrock");
    let q = pC(A, "claude-3-5-haiku-20241022"),
        K = pC(A, "claude-haiku-4-5-20251001"),
        Y = pC(A, "claude-3-5-sonnet-20241022"),
        z = pC(A, "claude-3-7-sonnet-20250219"),
        w = pC(A, "claude-sonnet-4-20250514"),
        H = pC(A, "claude-sonnet-4-5-20250929"),
        $ = pC(A, "claude-opus-4-20250514"),
        O = pC(A, "claude-opus-4-1-20250805"),
        _ = pC(A, "claude-opus-4-5-20251101"),
        J = pC(A, "claude-opus-4-6");
    return {
        haiku35: q || AR1.bedrock,
        haiku45: K || qR1.bedrock,
        sonnet35: Y || eL1.bedrock,
        sonnet37: z || tL1.bedrock,
        sonnet40: w || v81.bedrock,
        sonnet45: H || KR1.bedrock,
        opus40: $ || YR1.bedrock,
        opus41: O || zR1.bedrock,
        opus45: _ || wR1.bedrock,
        opus46: J || yn.bedrock
    }
}
// @from(Ln 105528, Col 0)
function x95() {
    if (sz1() !== null) return;
    if (E4() !== "bedrock") {
        wN1(HR1(E4()));
        return
    }
    cl8()
}
// @from(Ln 105537, Col 0)
function HH() {
    let A = sz1();
    if (A === null) return x95(), HR1(E4());
    return A
}
// @from(Ln 105542, Col 0)
async function ll8() {
    if (sz1() !== null) return;
    if (E4() !== "bedrock") {
        wN1(HR1(E4()));
        return
    }
    await cl8()
}
// @from(Ln 105550, Col 4)
cl8
// @from(Ln 105551, Col 4)
c86 = v(() => {
    B6();
    y6();
    sL1();
    vO1();
    UH();
    cl8 = rb(async () => {
        if (sz1() !== null) return;
        try {
            let A = await I95();
            wN1(A)
        } catch (A) {
            K1(A)
        }
    })
})
// @from(Ln 105567, Col 0)
async function il8() {
    if (process.platform === "darwin") {
        let A = xQ();
        if ((await XY(`security delete-generic-password -a $USER -s "${A}"`, {
                shell: !0,
                reject: !1
            })).exitCode !== 0) throw Error("Failed to delete keychain entry")
    }
}
// @from(Ln 105577, Col 0)
function cT(A) {
    return A.slice(-20)
}
// @from(Ln 105580, Col 4)
$R1 = v(() => {
    Uv1();
    Bf()
})
// @from(Ln 105584, Col 0)
class lT {
    static instance = null;
    status = {
        isAuthenticating: !1,
        output: []
    };
    listeners = new Set;
    static getInstance() {
        if (!lT.instance) lT.instance = new lT;
        return lT.instance
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
        }, this.notifyListeners()
    }
    addOutput(A) {
        this.status.output.push(A), this.notifyListeners()
    }
    setError(A) {
        this.status.error = A, this.notifyListeners()
    }
    endAuthentication(A) {
        if (A) this.status = {
            isAuthenticating: !1,
            output: []
        };
        else this.status.isAuthenticating = !1;
        this.notifyListeners()
    }
    subscribe(A) {
        return this.listeners.add(A), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        this.listeners.forEach((A) => A(this.getStatus()))
    }
    static reset() {
        if (lT.instance) lT.instance.listeners.clear(), lT.instance = null
    }
}
// @from(Ln 105637, Col 0)
function MV() {
    let A = J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY),
        K = (C8() || {}).apiKeyHelper,
        Y = process.env.ANTHROPIC_AUTH_TOKEN || K || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
        {
            source: z
        } = yO({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
    return !(A || Y || (z === "ANTHROPIC_API_KEY" || z === "apiKeyHelper") && !J6(process.env.CLAUDE_CODE_REMOTE))
}