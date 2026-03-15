
// @from(Ln 169049, Col 4)
kI7 = x((ks3) => {
    var fs3 = IJ8(),
        Ts3 = (A) => {
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
        vs3 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class vI7 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = fs3.FieldPosition.HEADER,
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
    class NI7 {
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
    class _H1 {
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
            let q = new _H1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = Ns3(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return _H1.clone(this)
        }
    }

    function Ns3(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class VI7 {
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

    function Vs3(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    ks3.Field = vI7;
    ks3.Fields = NI7;
    ks3.HttpRequest = _H1;
    ks3.HttpResponse = VI7;
    ks3.getHttpHandlerExtensionConfiguration = Ts3;
    ks3.isValidHostname = Vs3;
    ks3.resolveHttpHandlerRuntimeConfig = vs3
})
// @from(Ln 169191, Col 4)
wb7 = x((fM8) => {
    var EI7 = PQ(),
        Is3 = WQ(),
        bs3 = ZQ(),
        yI7 = fu(),
        xs3 = Nj(),
        wH1 = w_(),
        Zk = dO(),
        us3 = VQ(),
        z$ = rS(),
        LI7 = kP(),
        M_ = au6(),
        RI7 = pJ8(),
        ms3 = TI7(),
        hI7 = oS(),
        SI7 = kI7(),
        Bs3 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "cognito-identity"
            })
        },
        c$ = {
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
        gs3 = (A) => {
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
        Fs3 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        ps3 = (A, q) => {
            let K = Object.assign(hI7.getAwsRegionExtensionConfiguration(A), M_.getDefaultExtensionConfiguration(A), SI7.getHttpHandlerExtensionConfiguration(A), gs3(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, hI7.resolveAwsRegionExtensionConfiguration(K), M_.resolveDefaultRuntimeConfig(K), SI7.resolveHttpHandlerRuntimeConfig(K), Fs3(K))
        };
    class $H1 extends M_.Client {
        config;
        constructor(...[A]) {
            let q = ms3.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = Bs3(q),
                Y = yI7.resolveUserAgentConfig(K),
                z = LI7.resolveRetryConfig(Y),
                _ = xs3.resolveRegionConfig(z),
                w = EI7.resolveHostHeaderConfig(_),
                O = z$.resolveEndpointConfig(w),
                $ = RI7.resolveHttpAuthSchemeConfig(O),
                H = ps3($, A?.extensions || []);
            this.config = H, this.middlewareStack.use(Zk.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(yI7.getUserAgentPlugin(this.config)), this.middlewareStack.use(LI7.getRetryPlugin(this.config)), this.middlewareStack.use(us3.getContentLengthPlugin(this.config)), this.middlewareStack.use(EI7.getHostHeaderPlugin(this.config)), this.middlewareStack.use(Is3.getLoggerPlugin(this.config)), this.middlewareStack.use(bs3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(wH1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: RI7.defaultCognitoIdentityHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new wH1.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials
                })
            })), this.middlewareStack.use(wH1.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var Gk = class A extends M_.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        CI7 = class A extends Gk {
            name = "InternalErrorException";
            $fault = "server";
            constructor(q) {
                super({
                    name: "InternalErrorException",
                    $fault: "server",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        II7 = class A extends Gk {
            name = "InvalidParameterException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidParameterException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        bI7 = class A extends Gk {
            name = "LimitExceededException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "LimitExceededException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        xI7 = class A extends Gk {
            name = "NotAuthorizedException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "NotAuthorizedException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        uI7 = class A extends Gk {
            name = "ResourceConflictException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ResourceConflictException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        mI7 = class A extends Gk {
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
        BI7 = class A extends Gk {
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
        gI7 = class A extends Gk {
            name = "ExternalServiceException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ExternalServiceException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        FI7 = class A extends Gk {
            name = "InvalidIdentityPoolConfigurationException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidIdentityPoolConfigurationException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        pI7 = class A extends Gk {
            name = "DeveloperUserAlreadyRegisteredException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "DeveloperUserAlreadyRegisteredException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        QI7 = class A extends Gk {
            name = "ConcurrentModificationException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ConcurrentModificationException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        UI7 = "AllowClassicFlow",
        Qs3 = "AccountId",
        Us3 = "AccessKeyId",
        ds3 = "AmbiguousRoleResolution",
        dI7 = "AllowUnauthenticatedIdentities",
        cI7 = "Credentials",
        cs3 = "CreationDate",
        ls3 = "ClientId",
        is3 = "CognitoIdentityProvider",
        ns3 = "CreateIdentityPoolInput",
        rs3 = "CognitoIdentityProviderList",
        lI7 = "CognitoIdentityProviders",
        os3 = "CreateIdentityPool",
        as3 = "ConcurrentModificationException",
        ss3 = "CustomRoleArn",
        ts3 = "Claim",
        es3 = "DeleteIdentities",
        At3 = "DeleteIdentitiesInput",
        qt3 = "DescribeIdentityInput",
        Kt3 = "DeleteIdentityPool",
        Yt3 = "DeleteIdentityPoolInput",
        zt3 = "DescribeIdentityPoolInput",
        _t3 = "DescribeIdentityPool",
        wt3 = "DeleteIdentitiesResponse",
        Ot3 = "DescribeIdentity",
        HH1 = "DeveloperProviderName",
        $t3 = "DeveloperUserAlreadyRegisteredException",
        iI7 = "DeveloperUserIdentifier",
        Ht3 = "DeveloperUserIdentifierList",
        jt3 = "DestinationUserIdentifier",
        Jt3 = "Expiration",
        Mt3 = "ErrorCode",
        Dt3 = "ExternalServiceException",
        Xt3 = "GetCredentialsForIdentity",
        Pt3 = "GetCredentialsForIdentityInput",
        Wt3 = "GetCredentialsForIdentityResponse",
        Zt3 = "GetId",
        Gt3 = "GetIdInput",
        ft3 = "GetIdentityPoolRoles",
        Tt3 = "GetIdentityPoolRolesInput",
        vt3 = "GetIdentityPoolRolesResponse",
        Nt3 = "GetIdResponse",
        Vt3 = "GetOpenIdToken",
        kt3 = "GetOpenIdTokenForDeveloperIdentity",
        Et3 = "GetOpenIdTokenForDeveloperIdentityInput",
        yt3 = "GetOpenIdTokenForDeveloperIdentityResponse",
        Lt3 = "GetOpenIdTokenInput",
        Rt3 = "GetOpenIdTokenResponse",
        ht3 = "GetPrincipalTagAttributeMap",
        St3 = "GetPrincipalTagAttributeMapInput",
        Ct3 = "GetPrincipalTagAttributeMapResponse",
        It3 = "HideDisabled",
        bt3 = "Identities",
        xt3 = "IdentityDescription",
        ut3 = "InternalErrorException",
        nG = "IdentityId",
        mt3 = "InvalidIdentityPoolConfigurationException",
        Bt3 = "IdentityIdsToDelete",
        gt3 = "IdentitiesList",
        Ft3 = "IdentityPool",
        pt3 = "InvalidParameterException",
        $X = "IdentityPoolId",
        Qt3 = "IdentityPoolsList",
        iJ8 = "IdentityPoolName",
        jH1 = "IdentityProviderName",
        Ut3 = "IdentityPoolShortDescription",
        dt3 = "IdentityProviderToken",
        nI7 = "IdentityPoolTags",
        ct3 = "IdentityPools",
        oX6 = "Logins",
        lt3 = "LookupDeveloperIdentity",
        it3 = "LookupDeveloperIdentityInput",
        nt3 = "LookupDeveloperIdentityResponse",
        rt3 = "LimitExceededException",
        ot3 = "ListIdentities",
        at3 = "ListIdentitiesInput",
        st3 = "ListIdentityPools",
        tt3 = "ListIdentityPoolsInput",
        et3 = "ListIdentityPoolsResponse",
        Ae3 = "ListIdentitiesResponse",
        qe3 = "LoginsMap",
        Ke3 = "LastModifiedDate",
        Ye3 = "ListTagsForResource",
        ze3 = "ListTagsForResourceInput",
        _e3 = "ListTagsForResourceResponse",
        we3 = "LoginsToRemove",
        Oe3 = "MergeDeveloperIdentities",
        $e3 = "MergeDeveloperIdentitiesInput",
        He3 = "MergeDeveloperIdentitiesResponse",
        nJ8 = "MaxResults",
        je3 = "MappingRulesList",
        Je3 = "MappingRule",
        Me3 = "MatchType",
        De3 = "NotAuthorizedException",
        aX6 = "NextToken",
        rI7 = "OpenIdConnectProviderARNs",
        Xe3 = "OIDCToken",
        Pe3 = "ProviderName",
        JH1 = "PrincipalTags",
        oI7 = "Roles",
        rJ8 = "ResourceArn",
        We3 = "RoleARN",
        Ze3 = "RulesConfiguration",
        Ge3 = "ResourceConflictException",
        fe3 = "RulesConfigurationType",
        aI7 = "RoleMappings",
        Te3 = "RoleMappingMap",
        ve3 = "RoleMapping",
        Ne3 = "ResourceNotFoundException",
        Ve3 = "Rules",
        ke3 = "SetIdentityPoolRoles",
        Ee3 = "SetIdentityPoolRolesInput",
        ye3 = "SecretKey",
        Le3 = "SecretKeyString",
        sI7 = "SupportedLoginProviders",
        tI7 = "SamlProviderARNs",
        Re3 = "SetPrincipalTagAttributeMap",
        he3 = "SetPrincipalTagAttributeMapInput",
        Se3 = "SetPrincipalTagAttributeMapResponse",
        Ce3 = "ServerSideTokenCheck",
        Ie3 = "SessionToken",
        be3 = "SourceUserIdentifier",
        eI7 = "Token",
        xe3 = "TokenDuration",
        ue3 = "TagKeys",
        me3 = "TooManyRequestsException",
        Be3 = "TagResource",
        ge3 = "TagResourceInput",
        Fe3 = "TagResourceResponse",
        Ab7 = "Tags",
        pe3 = "Type",
        oJ8 = "UseDefaults",
        Qe3 = "UnlinkDeveloperIdentity",
        Ue3 = "UnlinkDeveloperIdentityInput",
        de3 = "UnlinkIdentity",
        ce3 = "UnprocessedIdentityIds",
        le3 = "UnprocessedIdentityIdList",
        ie3 = "UnlinkIdentityInput",
        ne3 = "UnprocessedIdentityId",
        re3 = "UpdateIdentityPool",
        oe3 = "UntagResource",
        ae3 = "UntagResourceInput",
        se3 = "UntagResourceResponse",
        te3 = "Value",
        Im = "client",
        QC = "error",
        bm = "httpError",
        UC = "message",
        ee3 = "server",
        qb7 = "smithy.ts.sdk.synthetic.com.amazonaws.cognitoidentity",
        bA = "com.amazonaws.cognitoidentity",
        A69 = [0, bA, dt3, 8, 0],
        Kb7 = [0, bA, Xe3, 8, 0],
        q69 = [0, bA, Le3, 8, 0],
        K69 = [3, bA, is3, 0, [Pe3, ls3, Ce3],
            [0, 0, 2]
        ],
        Y69 = [-3, bA, as3, {
                [QC]: Im,
                [bm]: 400
            },
            [UC],
            [0]
        ];
    Zk.TypeRegistry.for(bA).registerError(Y69, QI7);
    var z69 = [3, bA, ns3, 0, [iJ8, dI7, UI7, sI7, HH1, rI7, lI7, tI7, nI7],
            [0, 2, 2, 128, 0, 64, () => zb7, 64, 128]
        ],
        _69 = [3, bA, cI7, 0, [Us3, ye3, Ie3, Jt3],
            [0, [() => q69, 0], 0, 4]
        ],
        w69 = [3, bA, At3, 0, [Bt3],
            [64]
        ],
        O69 = [3, bA, wt3, 0, [ce3],
            [() => O19]
        ],
        $69 = [3, bA, Yt3, 0, [$X],
            [0]
        ],
        H69 = [3, bA, qt3, 0, [nG],
            [0]
        ],
        j69 = [3, bA, zt3, 0, [$X],
            [0]
        ],
        J69 = [-3, bA, $t3, {
                [QC]: Im,
                [bm]: 400
            },
            [UC],
            [0]
        ];
    Zk.TypeRegistry.for(bA).registerError(J69, pI7);
    var M69 = [-3, bA, Dt3, {
            [QC]: Im,
            [bm]: 400
        },
        [UC],
        [0]
    ];
    Zk.TypeRegistry.for(bA).registerError(M69, gI7);
    var D69 = [3, bA, Pt3, 0, [nG, oX6, ss3],
            [0, [() => qm6, 0], 0]
        ],
        X69 = [3, bA, Wt3, 0, [nG, cI7],
            [0, [() => _69, 0]]
        ],
        P69 = [3, bA, Tt3, 0, [$X],
            [0]
        ],
        W69 = [3, bA, vt3, 0, [$X, oI7, aI7],
            [0, 128, () => _b7]
        ],
        Z69 = [3, bA, Gt3, 0, [Qs3, $X, oX6],
            [0, 0, [() => qm6, 0]]
        ],
        G69 = [3, bA, Nt3, 0, [nG],
            [0]
        ],
        f69 = [3, bA, Et3, 0, [$X, nG, oX6, JH1, xe3],
            [0, 0, [() => qm6, 0], 128, 1]
        ],
        T69 = [3, bA, yt3, 0, [nG, eI7],
            [0, [() => Kb7, 0]]
        ],
        v69 = [3, bA, Lt3, 0, [nG, oX6],
            [0, [() => qm6, 0]]
        ],
        N69 = [3, bA, Rt3, 0, [nG, eI7],
            [0, [() => Kb7, 0]]
        ],
        V69 = [3, bA, St3, 0, [$X, jH1],
            [0, 0]
        ],
        k69 = [3, bA, Ct3, 0, [$X, jH1, oJ8, JH1],
            [0, 0, 2, 128]
        ],
        Yb7 = [3, bA, xt3, 0, [nG, oX6, cs3, Ke3],
            [0, 64, 4, 4]
        ],
        OH1 = [3, bA, Ft3, 0, [$X, iJ8, dI7, UI7, sI7, HH1, rI7, lI7, tI7, nI7],
            [0, 0, 2, 2, 128, 0, 64, () => zb7, 64, 128]
        ],
        E69 = [3, bA, Ut3, 0, [$X, iJ8],
            [0, 0]
        ],
        y69 = [-3, bA, ut3, {
                [QC]: ee3
            },
            [UC],
            [0]
        ];
    Zk.TypeRegistry.for(bA).registerError(y69, CI7);
    var L69 = [-3, bA, mt3, {
            [QC]: Im,
            [bm]: 400
        },
        [UC],
        [0]
    ];
    Zk.TypeRegistry.for(bA).registerError(L69, FI7);
    var R69 = [-3, bA, pt3, {
            [QC]: Im,
            [bm]: 400
        },
        [UC],
        [0]
    ];
    Zk.TypeRegistry.for(bA).registerError(R69, II7);
    var h69 = [-3, bA, rt3, {
            [QC]: Im,
            [bm]: 400
        },
        [UC],
        [0]
    ];
    Zk.TypeRegistry.for(bA).registerError(h69, bI7);
    var S69 = [3, bA, at3, 0, [$X, nJ8, aX6, It3],
            [0, 1, 0, 2]
        ],
        C69 = [3, bA, Ae3, 0, [$X, bt3, aX6],
            [0, () => z19, 0]
        ],
        I69 = [3, bA, tt3, 0, [nJ8, aX6],
            [1, 0]
        ],
        b69 = [3, bA, et3, 0, [ct3, aX6],
            [() => _19, 0]
        ],
        x69 = [3, bA, ze3, 0, [rJ8],
            [0]
        ],
        u69 = [3, bA, _e3, 0, [Ab7],
            [128]
        ],
        m69 = [3, bA, it3, 0, [$X, nG, iI7, nJ8, aX6],
            [0, 0, 0, 1, 0]
        ],
        B69 = [3, bA, nt3, 0, [nG, Ht3, aX6],
            [0, 64, 0]
        ],
        g69 = [3, bA, Je3, 0, [ts3, Me3, te3, We3],
            [0, 0, 0, 0]
        ],
        F69 = [3, bA, $e3, 0, [be3, jt3, HH1, $X],
            [0, 0, 0, 0]
        ],
        p69 = [3, bA, He3, 0, [nG],
            [0]
        ],
        Q69 = [-3, bA, De3, {
                [QC]: Im,
                [bm]: 403
            },
            [UC],
            [0]
        ];
    Zk.TypeRegistry.for(bA).registerError(Q69, xI7);
    var U69 = [-3, bA, Ge3, {
            [QC]: Im,
            [bm]: 409
        },
        [UC],
        [0]
    ];
    Zk.TypeRegistry.for(bA).registerError(U69, uI7);
    var d69 = [-3, bA, Ne3, {
            [QC]: Im,
            [bm]: 404
        },
        [UC],
        [0]
    ];
    Zk.TypeRegistry.for(bA).registerError(d69, BI7);
    var c69 = [3, bA, ve3, 0, [pe3, ds3, Ze3],
            [0, 0, () => l69]
        ],
        l69 = [3, bA, fe3, 0, [Ve3],
            [() => w19]
        ],
        i69 = [3, bA, Ee3, 0, [$X, oI7, aI7],
            [0, 128, () => _b7]
        ],
        n69 = [3, bA, he3, 0, [$X, jH1, oJ8, JH1],
            [0, 0, 2, 128]
        ],
        r69 = [3, bA, Se3, 0, [$X, jH1, oJ8, JH1],
            [0, 0, 2, 128]
        ],
        o69 = [3, bA, ge3, 0, [rJ8, Ab7],
            [0, 128]
        ],
        a69 = [3, bA, Fe3, 0, [],
            []
        ],
        s69 = [-3, bA, me3, {
                [QC]: Im,
                [bm]: 429
            },
            [UC],
            [0]
        ];
    Zk.TypeRegistry.for(bA).registerError(s69, mI7);
    var t69 = [3, bA, Ue3, 0, [nG, $X, HH1, iI7],
            [0, 0, 0, 0]
        ],
        e69 = [3, bA, ie3, 0, [nG, oX6, we3],
            [0, [() => qm6, 0], 64]
        ],
        A19 = [3, bA, ne3, 0, [nG, Mt3],
            [0, 0]
        ],
        q19 = [3, bA, ae3, 0, [rJ8, ue3],
            [0, 64]
        ],
        K19 = [3, bA, se3, 0, [],
            []
        ],
        MH1 = "unit",
        Y19 = [-3, qb7, "CognitoIdentityServiceException", 0, [],
            []
        ];
    Zk.TypeRegistry.for(qb7).registerError(Y19, Gk);
    var zb7 = [1, bA, rs3, 0, () => K69],
        z19 = [1, bA, gt3, 0, () => Yb7],
        _19 = [1, bA, Qt3, 0, () => E69],
        w19 = [1, bA, je3, 0, () => g69],
        O19 = [1, bA, le3, 0, () => A19],
        qm6 = [2, bA, qe3, 0, [0, 0],
            [() => A69, 0]
        ],
        _b7 = [2, bA, Te3, 0, 0, () => c69],
        $19 = [9, bA, os3, 0, () => z69, () => OH1],
        H19 = [9, bA, es3, 0, () => w69, () => O69],
        j19 = [9, bA, Kt3, 0, () => $69, () => MH1],
        J19 = [9, bA, Ot3, 0, () => H69, () => Yb7],
        M19 = [9, bA, _t3, 0, () => j69, () => OH1],
        D19 = [9, bA, Xt3, 0, () => D69, () => X69],
        X19 = [9, bA, Zt3, 0, () => Z69, () => G69],
        P19 = [9, bA, ft3, 0, () => P69, () => W69],
        W19 = [9, bA, Vt3, 0, () => v69, () => N69],
        Z19 = [9, bA, kt3, 0, () => f69, () => T69],
        G19 = [9, bA, ht3, 0, () => V69, () => k69],
        f19 = [9, bA, ot3, 0, () => S69, () => C69],
        T19 = [9, bA, st3, 0, () => I69, () => b69],
        v19 = [9, bA, Ye3, 0, () => x69, () => u69],
        N19 = [9, bA, lt3, 0, () => m69, () => B69],
        V19 = [9, bA, Oe3, 0, () => F69, () => p69],
        k19 = [9, bA, ke3, 0, () => i69, () => MH1],
        E19 = [9, bA, Re3, 0, () => n69, () => r69],
        y19 = [9, bA, Be3, 0, () => o69, () => a69],
        L19 = [9, bA, Qe3, 0, () => t69, () => MH1],
        R19 = [9, bA, de3, 0, () => e69, () => MH1],
        h19 = [9, bA, oe3, 0, () => q19, () => K19],
        S19 = [9, bA, re3, 0, () => OH1, () => OH1];
    class aJ8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "CreateIdentityPool", {}).n("CognitoIdentityClient", "CreateIdentityPoolCommand").sc($19).build() {}
    class sJ8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentities", {}).n("CognitoIdentityClient", "DeleteIdentitiesCommand").sc(H19).build() {}
    class tJ8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentityPool", {}).n("CognitoIdentityClient", "DeleteIdentityPoolCommand").sc(j19).build() {}
    class eJ8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentity", {}).n("CognitoIdentityClient", "DescribeIdentityCommand").sc(J19).build() {}
    class AM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentityPool", {}).n("CognitoIdentityClient", "DescribeIdentityPoolCommand").sc(M19).build() {}
    class qM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").sc(D19).build() {}
    class KM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").sc(X19).build() {}
    class YM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetIdentityPoolRoles", {}).n("CognitoIdentityClient", "GetIdentityPoolRolesCommand").sc(P19).build() {}
    class zM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdToken", {}).n("CognitoIdentityClient", "GetOpenIdTokenCommand").sc(W19).build() {}
    class _M8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdTokenForDeveloperIdentity", {}).n("CognitoIdentityClient", "GetOpenIdTokenForDeveloperIdentityCommand").sc(Z19).build() {}
    class wM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "GetPrincipalTagAttributeMapCommand").sc(G19).build() {}
    class OM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentities", {}).n("CognitoIdentityClient", "ListIdentitiesCommand").sc(f19).build() {}
    class DH1 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentityPools", {}).n("CognitoIdentityClient", "ListIdentityPoolsCommand").sc(T19).build() {}
    class $M8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListTagsForResource", {}).n("CognitoIdentityClient", "ListTagsForResourceCommand").sc(v19).build() {}
    class HM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "LookupDeveloperIdentity", {}).n("CognitoIdentityClient", "LookupDeveloperIdentityCommand").sc(N19).build() {}
    class jM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "MergeDeveloperIdentities", {}).n("CognitoIdentityClient", "MergeDeveloperIdentitiesCommand").sc(V19).build() {}
    class JM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetIdentityPoolRoles", {}).n("CognitoIdentityClient", "SetIdentityPoolRolesCommand").sc(k19).build() {}
    class MM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "SetPrincipalTagAttributeMapCommand").sc(E19).build() {}
    class DM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "TagResource", {}).n("CognitoIdentityClient", "TagResourceCommand").sc(y19).build() {}
    class XM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkDeveloperIdentity", {}).n("CognitoIdentityClient", "UnlinkDeveloperIdentityCommand").sc(L19).build() {}
    class PM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkIdentity", {}).n("CognitoIdentityClient", "UnlinkIdentityCommand").sc(R19).build() {}
    class WM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UntagResource", {}).n("CognitoIdentityClient", "UntagResourceCommand").sc(h19).build() {}
    class ZM8 extends M_.Command.classBuilder().ep(c$).m(function(A, q, K, Y) {
        return [z$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UpdateIdentityPool", {}).n("CognitoIdentityClient", "UpdateIdentityPoolCommand").sc(S19).build() {}
    var C19 = {
        CreateIdentityPoolCommand: aJ8,
        DeleteIdentitiesCommand: sJ8,
        DeleteIdentityPoolCommand: tJ8,
        DescribeIdentityCommand: eJ8,
        DescribeIdentityPoolCommand: AM8,
        GetCredentialsForIdentityCommand: qM8,
        GetIdCommand: KM8,
        GetIdentityPoolRolesCommand: YM8,
        GetOpenIdTokenCommand: zM8,
        GetOpenIdTokenForDeveloperIdentityCommand: _M8,
        GetPrincipalTagAttributeMapCommand: wM8,
        ListIdentitiesCommand: OM8,
        ListIdentityPoolsCommand: DH1,
        ListTagsForResourceCommand: $M8,
        LookupDeveloperIdentityCommand: HM8,
        MergeDeveloperIdentitiesCommand: jM8,
        SetIdentityPoolRolesCommand: JM8,
        SetPrincipalTagAttributeMapCommand: MM8,
        TagResourceCommand: DM8,
        UnlinkDeveloperIdentityCommand: XM8,
        UnlinkIdentityCommand: PM8,
        UntagResourceCommand: WM8,
        UpdateIdentityPoolCommand: ZM8
    };
    class GM8 extends $H1 {}
    M_.createAggregatedClient(C19, GM8);
    var I19 = wH1.createPaginator($H1, DH1, "NextToken", "NextToken", "MaxResults"),
        b19 = {
            AUTHENTICATED_ROLE: "AuthenticatedRole",
            DENY: "Deny"
        },
        x19 = {
            ACCESS_DENIED: "AccessDenied",
            INTERNAL_SERVER_ERROR: "InternalServerError"
        },
        u19 = {
            CONTAINS: "Contains",
            EQUALS: "Equals",
            NOT_EQUAL: "NotEqual",
            STARTS_WITH: "StartsWith"
        },
        m19 = {
            RULES: "Rules",
            TOKEN: "Token"
        };
    Object.defineProperty(fM8, "$Command", {
        enumerable: !0,
        get: function() {
            return M_.Command
        }
    });
    Object.defineProperty(fM8, "__Client", {
        enumerable: !0,
        get: function() {
            return M_.Client
        }
    });
    fM8.AmbiguousRoleResolutionType = b19;
    fM8.CognitoIdentity = GM8;
    fM8.CognitoIdentityClient = $H1;
    fM8.CognitoIdentityServiceException = Gk;
    fM8.ConcurrentModificationException = QI7;
    fM8.CreateIdentityPoolCommand = aJ8;
    fM8.DeleteIdentitiesCommand = sJ8;
    fM8.DeleteIdentityPoolCommand = tJ8;
    fM8.DescribeIdentityCommand = eJ8;
    fM8.DescribeIdentityPoolCommand = AM8;
    fM8.DeveloperUserAlreadyRegisteredException = pI7;
    fM8.ErrorCode = x19;
    fM8.ExternalServiceException = gI7;
    fM8.GetCredentialsForIdentityCommand = qM8;
    fM8.GetIdCommand = KM8;
    fM8.GetIdentityPoolRolesCommand = YM8;
    fM8.GetOpenIdTokenCommand = zM8;
    fM8.GetOpenIdTokenForDeveloperIdentityCommand = _M8;
    fM8.GetPrincipalTagAttributeMapCommand = wM8;
    fM8.InternalErrorException = CI7;
    fM8.InvalidIdentityPoolConfigurationException = FI7;
    fM8.InvalidParameterException = II7;
    fM8.LimitExceededException = bI7;
    fM8.ListIdentitiesCommand = OM8;
    fM8.ListIdentityPoolsCommand = DH1;
    fM8.ListTagsForResourceCommand = $M8;
    fM8.LookupDeveloperIdentityCommand = HM8;
    fM8.MappingRuleMatchType = u19;
    fM8.MergeDeveloperIdentitiesCommand = jM8;
    fM8.NotAuthorizedException = xI7;
    fM8.ResourceConflictException = uI7;
    fM8.ResourceNotFoundException = BI7;
    fM8.RoleMappingType = m19;
    fM8.SetIdentityPoolRolesCommand = JM8;
    fM8.SetPrincipalTagAttributeMapCommand = MM8;
    fM8.TagResourceCommand = DM8;
    fM8.TooManyRequestsException = mI7;
    fM8.UnlinkDeveloperIdentityCommand = XM8;
    fM8.UnlinkIdentityCommand = PM8;
    fM8.UntagResourceCommand = WM8;
    fM8.UpdateIdentityPoolCommand = ZM8;
    fM8.paginateListIdentityPools = I19
})
// @from(Ln 170021, Col 4)
vM8 = x((XH1) => {
    var TM8 = wb7();
    Object.defineProperty(XH1, "CognitoIdentityClient", {
        enumerable: !0,
        get: function() {
            return TM8.CognitoIdentityClient
        }
    });
    Object.defineProperty(XH1, "GetCredentialsForIdentityCommand", {
        enumerable: !0,
        get: function() {
            return TM8.GetCredentialsForIdentityCommand
        }
    });
    Object.defineProperty(XH1, "GetIdCommand", {
        enumerable: !0,
        get: function() {
            return TM8.GetIdCommand
        }
    })
})
// @from(Ln 170042, Col 4)
VM8 = x((I89) => {
    var PH1 = vJ();

    function Ob7(A) {
        return Promise.all(Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            if (typeof Y === "string") q.push([K, Y]);
            else q.push(Y().then((z) => [K, z]));
            return q
        }, [])).then((q) => q.reduce((K, [Y, z]) => {
            return K[Y] = z, K
        }, {}))
    }

    function $b7(A) {
        return async (q) => {
            A.logger?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
            let {
                GetCredentialsForIdentityCommand: K,
                CognitoIdentityClient: Y
            } = await Promise.resolve().then(function() {
                return vM8()
            }), z = (H) => A.clientConfig?.[H] ?? A.parentClientConfig?.[H] ?? q?.callerClientConfig?.[H], {
                Credentials: {
                    AccessKeyId: _ = E89(A.logger),
                    Expiration: w,
                    SecretKey: O = L89(A.logger),
                    SessionToken: $
                } = y89(A.logger)
            } = await (A.client ?? new Y(Object.assign({}, A.clientConfig ?? {}, {
                region: z("region"),
                profile: z("profile"),
                userAgentAppId: z("userAgentAppId")
            }))).send(new K({
                CustomRoleArn: A.customRoleArn,
                IdentityId: A.identityId,
                Logins: A.logins ? await Ob7(A.logins) : void 0
            }));
            return {
                identityId: A.identityId,
                accessKeyId: _,
                secretAccessKey: O,
                sessionToken: $,
                expiration: w
            }
        }
    }

    function E89(A) {
        throw new PH1.CredentialsProviderError("Response from Amazon Cognito contained no access key ID", {
            logger: A
        })
    }

    function y89(A) {
        throw new PH1.CredentialsProviderError("Response from Amazon Cognito contained no credentials", {
            logger: A
        })
    }

    function L89(A) {
        throw new PH1.CredentialsProviderError("Response from Amazon Cognito contained no secret key", {
            logger: A
        })
    }
    var NM8 = "IdentityIds";
    class Hb7 {
        dbName;
        constructor(A = "aws:cognito-identity-ids") {
            this.dbName = A
        }
        getItem(A) {
            return this.withObjectStore("readonly", (q) => {
                let K = q.get(A);
                return new Promise((Y) => {
                    K.onerror = () => Y(null), K.onsuccess = () => Y(K.result ? K.result.value : null)
                })
            }).catch(() => null)
        }
        removeItem(A) {
            return this.withObjectStore("readwrite", (q) => {
                let K = q.delete(A);
                return new Promise((Y, z) => {
                    K.onerror = () => z(K.error), K.onsuccess = () => Y()
                })
            })
        }
        setItem(A, q) {
            return this.withObjectStore("readwrite", (K) => {
                let Y = K.put({
                    id: A,
                    value: q
                });
                return new Promise((z, _) => {
                    Y.onerror = () => _(Y.error), Y.onsuccess = () => z()
                })
            })
        }
        getDb() {
            let A = self.indexedDB.open(this.dbName, 1);
            return new Promise((q, K) => {
                A.onsuccess = () => {
                    q(A.result)
                }, A.onerror = () => {
                    K(A.error)
                }, A.onblocked = () => {
                    K(Error("Unable to access DB"))
                }, A.onupgradeneeded = () => {
                    let Y = A.result;
                    Y.onerror = () => {
                        K(Error("Failed to create object store"))
                    }, Y.createObjectStore(NM8, {
                        keyPath: "id"
                    })
                }
            })
        }
        withObjectStore(A, q) {
            return this.getDb().then((K) => {
                let Y = K.transaction(NM8, A);
                return Y.oncomplete = () => K.close(), new Promise((z, _) => {
                    Y.onerror = () => _(Y.error), z(q(Y.objectStore(NM8)))
                }).catch((z) => {
                    throw K.close(), z
                })
            })
        }
    }
    class jb7 {
        store;
        constructor(A = {}) {
            this.store = A
        }
        getItem(A) {
            if (A in this.store) return this.store[A];
            return null
        }
        removeItem(A) {
            delete this.store[A]
        }
        setItem(A, q) {
            this.store[A] = q
        }
    }
    var R89 = new jb7;

    function h89() {
        if (typeof self === "object" && self.indexedDB) return new Hb7;
        if (typeof window === "object" && window.localStorage) return window.localStorage;
        return R89
    }

    function S89({
        accountId: A,
        cache: q = h89(),
        client: K,
        clientConfig: Y,
        customRoleArn: z,
        identityPoolId: _,
        logins: w,
        userIdentifier: O = !w || Object.keys(w).length === 0 ? "ANONYMOUS" : void 0,
        logger: $,
        parentClientConfig: H
    }) {
        $?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
        let j = O ? `aws:cognito-identity-credentials:${_}:${O}` : void 0,
            J = async (M) => {
                let {
                    GetIdCommand: D,
                    CognitoIdentityClient: X
                } = await Promise.resolve().then(function() {
                    return vM8()
                }), P = (G) => Y?.[G] ?? H?.[G] ?? M?.callerClientConfig?.[G], W = K ?? new X(Object.assign({}, Y ?? {}, {
                    region: P("region"),
                    profile: P("profile"),
                    userAgentAppId: P("userAgentAppId")
                })), Z = j && await q.getItem(j);
                if (!Z) {
                    let {
                        IdentityId: G = C89($)
                    } = await W.send(new D({
                        AccountId: A,
                        IdentityPoolId: _,
                        Logins: w ? await Ob7(w) : void 0
                    }));
                    if (Z = G, j) Promise.resolve(q.setItem(j, Z)).catch(() => {})
                }
                return J = $b7({
                    client: W,
                    customRoleArn: z,
                    logins: w,
                    identityId: Z
                }), J(M)
            };
        return (M) => J(M).catch(async (D) => {
            if (j) Promise.resolve(q.removeItem(j)).catch(() => {});
            throw D
        })
    }

    function C89(A) {
        throw new PH1.CredentialsProviderError("Response from Amazon Cognito contained no identity ID", {
            logger: A
        })
    }
    I89.fromCognitoIdentity = $b7;
    I89.fromCognitoIdentityPool = S89
})
// @from(Ln 170250, Col 4)
Db7 = x((Jb7) => {
    Object.defineProperty(Jb7, "__esModule", {
        value: !0
    });
    Jb7.fromCognitoIdentity = void 0;
    var u89 = VM8(),
        m89 = (A) => (0, u89.fromCognitoIdentity)({
            ...A
        });
    Jb7.fromCognitoIdentity = m89
})
// @from(Ln 170261, Col 4)
Wb7 = x((Xb7) => {
    Object.defineProperty(Xb7, "__esModule", {
        value: !0
    });
    Xb7.fromCognitoIdentityPool = void 0;
    var B89 = VM8(),
        g89 = (A) => (0, B89.fromCognitoIdentityPool)({
            ...A
        });
    Xb7.fromCognitoIdentityPool = g89
})
// @from(Ln 170272, Col 4)
fb7 = x((Zb7) => {
    Object.defineProperty(Zb7, "__esModule", {
        value: !0
    });
    Zb7.fromContainerMetadata = void 0;
    var F89 = o76(),
        p89 = (A) => {
            return A?.logger?.debug("@smithy/credential-provider-imds", "fromContainerMetadata"), (0, F89.fromContainerMetadata)(A)
        };
    Zb7.fromContainerMetadata = p89
})
// @from(Ln 170283, Col 4)
Nb7 = x((Tb7) => {
    Object.defineProperty(Tb7, "__esModule", {
        value: !0
    });
    Tb7.fromEnv = void 0;
    var Q89 = p41(),
        U89 = (A) => (0, Q89.fromEnv)(A);
    Tb7.fromEnv = U89
})
// @from(Ln 170292, Col 4)
Eb7 = x((Vb7) => {
    Object.defineProperty(Vb7, "__esModule", {
        value: !0
    });
    Vb7.fromIni = void 0;
    var d89 = o88(),
        c89 = (A = {}) => (0, d89.fromIni)({
            ...A
        });
    Vb7.fromIni = c89
})
// @from(Ln 170303, Col 4)
Rb7 = x((yb7) => {
    Object.defineProperty(yb7, "__esModule", {
        value: !0
    });
    yb7.fromInstanceMetadata = void 0;
    var l89 = mT(),
        i89 = o76(),
        n89 = (A) => {
            return A?.logger?.debug("@smithy/credential-provider-imds", "fromInstanceMetadata"), async () => (0, i89.fromInstanceMetadata)(A)().then((q) => (0, l89.setCredentialFeature)(q, "CREDENTIALS_IMDS", "0"))
        };
    yb7.fromInstanceMetadata = n89
})
// @from(Ln 170315, Col 4)
Cb7 = x((hb7) => {
    Object.defineProperty(hb7, "__esModule", {
        value: !0
    });
    hb7.fromLoginCredentials = void 0;
    var r89 = L88(),
        o89 = (A) => (0, r89.fromLoginCredentials)({
            ...A
        });
    hb7.fromLoginCredentials = o89
})
// @from(Ln 170326, Col 4)
kM8 = x((Ib7) => {
    Object.defineProperty(Ib7, "__esModule", {
        value: !0
    });
    Ib7.fromNodeProviderChain = void 0;
    var a89 = P46(),
        s89 = (A = {}) => (0, a89.defaultProvider)({
            ...A
        });
    Ib7.fromNodeProviderChain = s89
})
// @from(Ln 170337, Col 4)
mb7 = x((xb7) => {
    Object.defineProperty(xb7, "__esModule", {
        value: !0
    });
    xb7.fromProcess = void 0;
    var t89 = xK1(),
        e89 = (A) => (0, t89.fromProcess)(A);
    xb7.fromProcess = e89
})
// @from(Ln 170346, Col 4)
Fb7 = x((Bb7) => {
    Object.defineProperty(Bb7, "__esModule", {
        value: !0
    });
    Bb7.fromSSO = void 0;
    var AA9 = TK1(),
        qA9 = (A = {}) => {
            return (0, AA9.fromSSO)({
                ...A
            })
        };
    Bb7.fromSSO = qA9
})
// @from(Ln 170359, Col 4)
Qb7 = x((WH1) => {
    Object.defineProperty(WH1, "__esModule", {
        value: !0
    });
    WH1.STSClient = WH1.AssumeRoleCommand = void 0;
    var pb7 = bK1();
    Object.defineProperty(WH1, "AssumeRoleCommand", {
        enumerable: !0,
        get: function() {
            return pb7.AssumeRoleCommand
        }
    });
    Object.defineProperty(WH1, "STSClient", {
        enumerable: !0,
        get: function() {
            return pb7.STSClient
        }
    })
})
// @from(Ln 170378, Col 4)
cb7 = x((xm) => {
    var YA9 = xm && xm.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        zA9 = xm && xm.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        _A9 = xm && xm.__importStar || function() {
            var A = function(q) {
                return A = Object.getOwnPropertyNames || function(K) {
                    var Y = [];
                    for (var z in K)
                        if (Object.prototype.hasOwnProperty.call(K, z)) Y[Y.length] = z;
                    return Y
                }, A(q)
            };
            return function(q) {
                if (q && q.__esModule) return q;
                var K = {};
                if (q != null) {
                    for (var Y = A(q), z = 0; z < Y.length; z++)
                        if (Y[z] !== "default") YA9(K, q, Y[z])
                }
                return zA9(K, q), K
            }
        }();
    Object.defineProperty(xm, "__esModule", {
        value: !0
    });
    xm.fromTemporaryCredentials = void 0;
    var wA9 = w_(),
        Ub7 = vJ(),
        OA9 = "us-east-1",
        $A9 = (A, q, K) => {
            let Y;
            return async (z = {}) => {
                let {
                    callerClientConfig: _
                } = z, w = A.clientConfig?.profile ?? _?.profile, O = A.logger ?? _?.logger;
                O?.debug("@aws-sdk/credential-providers - fromTemporaryCredentials (STS)");
                let $ = {
                    ...A.params,
                    RoleSessionName: A.params.RoleSessionName ?? "aws-sdk-js-" + Date.now()
                };
                if ($?.SerialNumber) {
                    if (!A.mfaCodeProvider) throw new Ub7.CredentialsProviderError("Temporary credential requires multi-factor authentication, but no MFA code callback was provided.", {
                        tryNextLink: !1,
                        logger: O
                    });
                    $.TokenCode = await A.mfaCodeProvider($?.SerialNumber)
                }
                let {
                    AssumeRoleCommand: H,
                    STSClient: j
                } = await Promise.resolve().then(() => _A9(Qb7()));
                if (!Y) {
                    let M = typeof q === "function" ? q() : void 0,
                        D = [A.masterCredentials, A.clientConfig?.credentials, void _?.credentials, _?.credentialDefaultProvider?.(), M],
                        X = "STS client default credentials";
                    if (D[0]) X = "options.masterCredentials";
                    else if (D[1]) X = "options.clientConfig.credentials";
                    else if (D[2]) throw X = "caller client's credentials", Error("fromTemporaryCredentials recursion in callerClientConfig.credentials");
                    else if (D[3]) X = "caller client's credentialDefaultProvider";
                    else if (D[4]) X = "AWS SDK default credentials";
                    let P = [A.clientConfig?.region, _?.region, await K?.({
                            profile: w
                        }), OA9],
                        W = "default partition's default region";
                    if (P[0]) W = "options.clientConfig.region";
                    else if (P[1]) W = "caller client's region";
                    else if (P[2]) W = "file or env region";
                    let Z = [db7(A.clientConfig?.requestHandler), db7(_?.requestHandler)],
                        G = "STS default requestHandler";
                    if (Z[0]) G = "options.clientConfig.requestHandler";
                    else if (Z[1]) G = "caller client's requestHandler";
                    O?.debug?.(`@aws-sdk/credential-providers - fromTemporaryCredentials STS client init with ${W}=${await(0,wA9.normalizeProvider)(ZH1(P))()}, ${X}, ${G}.`), Y = new j({
                        userAgentAppId: _?.userAgentAppId,
                        ...A.clientConfig,
                        credentials: ZH1(D),
                        logger: O,
                        profile: w,
                        region: ZH1(P),
                        requestHandler: ZH1(Z)
                    })
                }
                if (A.clientPlugins)
                    for (let M of A.clientPlugins) Y.middlewareStack.use(M);
                let {
                    Credentials: J
                } = await Y.send(new H($));
                if (!J || !J.AccessKeyId || !J.SecretAccessKey) throw new Ub7.CredentialsProviderError(`Invalid response from STS.assumeRole call with role ${$.RoleArn}`, {
                    logger: O
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
    xm.fromTemporaryCredentials = $A9;
    var db7 = (A) => {
            return A?.metadata?.handlerProtocol === "h2" ? void 0 : A
        },
        ZH1 = (A) => {
            for (let q of A)
                if (q !== void 0) return q
        }
})
// @from(Ln 170505, Col 4)
nb7 = x((lb7) => {
    Object.defineProperty(lb7, "__esModule", {
        value: !0
    });
    lb7.fromTemporaryCredentials = void 0;
    var HA9 = Nj(),
        jA9 = BT(),
        JA9 = kM8(),
        MA9 = cb7(),
        DA9 = (A) => {
            return (0, MA9.fromTemporaryCredentials)(A, JA9.fromNodeProviderChain, async ({
                profile: q = process.env.AWS_PROFILE
            }) => (0, jA9.loadConfig)({
                environmentVariableSelector: (K) => K.AWS_REGION,
                configFileSelector: (K) => {
                    return K.region
                },
                default: () => {
                    return
                }
            }, {
                ...HA9.NODE_REGION_CONFIG_FILE_OPTIONS,
                profile: q
            })())
        };
    lb7.fromTemporaryCredentials = DA9
})
// @from(Ln 170532, Col 4)
ab7 = x((rb7) => {
    Object.defineProperty(rb7, "__esModule", {
        value: !0
    });
    rb7.fromTokenFile = void 0;
    var XA9 = BS6(),
        PA9 = (A = {}) => (0, XA9.fromTokenFile)({
            ...A
        });
    rb7.fromTokenFile = PA9
})
// @from(Ln 170543, Col 4)
eb7 = x((sb7) => {
    Object.defineProperty(sb7, "__esModule", {
        value: !0
    });
    sb7.fromWebToken = void 0;
    var WA9 = BS6(),
        ZA9 = (A) => (0, WA9.fromWebToken)({
            ...A
        });
    sb7.fromWebToken = ZA9
})
// @from(Ln 170554, Col 4)
EM8 = x((UP) => {
    Object.defineProperty(UP, "__esModule", {
        value: !0
    });
    UP.fromHttp = void 0;
    var fv = _2();
    fv.__exportStar(ZC7(), UP);
    fv.__exportStar(Db7(), UP);
    fv.__exportStar(Wb7(), UP);
    fv.__exportStar(fb7(), UP);
    fv.__exportStar(Nb7(), UP);
    var GA9 = Mq1();
    Object.defineProperty(UP, "fromHttp", {
        enumerable: !0,
        get: function() {
            return GA9.fromHttp
        }
    });
    fv.__exportStar(Eb7(), UP);
    fv.__exportStar(Rb7(), UP);
    fv.__exportStar(Cb7(), UP);
    fv.__exportStar(kM8(), UP);
    fv.__exportStar(mb7(), UP);
    fv.__exportStar(Fb7(), UP);
    fv.__exportStar(nb7(), UP);
    fv.__exportStar(ab7(), UP);
    fv.__exportStar(eb7(), UP)
})
// @from(Ln 170583, Col 4)
Ax7
// @from(Ln 170583, Col 9)
qx7
// @from(Ln 170583, Col 14)
Kx7
// @from(Ln 170583, Col 19)
Yx7
// @from(Ln 170583, Col 24)
vA9 = () => Promise.resolve().then(() => t(EM8(), 1)).then(({
        fromNodeProviderChain: A
    }) => A({
        clientConfig: {
            requestHandler: new qx7.FetchHttpHandler({
                requestInit: (q) => {
                    return {
                        ...q
                    }
                }
            })
        }
    })).catch((A) => {
        throw Error(`Failed to import '@aws-sdk/credential-providers'.You can provide a custom \`providerChainResolver\` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': \`new AnthropicBedrock({ providerChainResolver })\` Original error: ${A.message}`)
    })
// @from(Ln 170598, Col 4)
zx7 = async (A, q) => {
        TA9(A.method, "Expected request method property to be set");
        let K = await (q.providerChainResolver ? q.providerChainResolver() : vA9()),
            Y = await NA9(() => {
                if (q.awsAccessKey) process.env.AWS_ACCESS_KEY_ID = q.awsAccessKey;
                if (q.awsSecretKey) process.env.AWS_SECRET_ACCESS_KEY = q.awsSecretKey;
                if (q.awsSessionToken) process.env.AWS_SESSION_TOKEN = q.awsSessionToken
            }, () => K()),
            z = new Yx7.SignatureV4({
                service: "bedrock",
                region: q.regionName,
                credentials: Y,
                sha256: Ax7.Sha256
            }),
            _ = new URL(q.url),
            w = !A.headers ? {} : (Symbol.iterator in A.headers) ? Object.fromEntries(Array.from(A.headers).map((H) => [...H])) : {
                ...A.headers
            };
        delete w.connection, w.host = _.hostname;
        let O = new Kx7.HttpRequest({
            method: A.method.toUpperCase(),
            protocol: _.protocol,
            path: _.pathname,
            headers: w,
            body: A.body
        });
        return (await z.sign(O)).headers
    }
// @from(Ln 170625, Col 7)
NA9 = async (A, q) => {
        let K = {
            ...process.env
        };
        try {
            return A(), await q()
        } finally {
            process.env = K
        }
    }
// @from(Ln 170635, Col 4)
_x7 = E(() => {
    Ax7 = t(Hh7(), 1), qx7 = t(JJ8(), 1), Kx7 = t(DJ8(), 1), Yx7 = t(PC7(), 1)
})
// @from(Ln 170638, Col 4)
LM8 = x((cY2, fH1) => {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var wx7, Ox7, $x7, Hx7, jx7, Jx7, Mx7, Dx7, Xx7, GH1, yM8, Px7, Wx7, sX6, Zx7, Gx7, fx7, Tx7, vx7, Nx7, Vx7, kx7, Ex7;
    (function(A) {
        var q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(Y) {
            A(K(q, K(Y)))
        });
        else if (typeof fH1 === "object" && typeof cY2 === "object") A(K(q, K(cY2)));
        else A(K(q));

        function K(Y, z) {
            if (Y !== q)
                if (typeof Object.create === "function") Object.defineProperty(Y, "__esModule", {
                    value: !0
                });
                else Y.__esModule = !0;
            return function(_, w) {
                return Y[_] = z ? z(_, w) : w
            }
        }
    })(function(A) {
        var q = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(K, Y) {
            K.__proto__ = Y
        } || function(K, Y) {
            for (var z in Y)
                if (Y.hasOwnProperty(z)) K[z] = Y[z]
        };
        wx7 = function(K, Y) {
            q(K, Y);

            function z() {
                this.constructor = K
            }
            K.prototype = Y === null ? Object.create(Y) : (z.prototype = Y.prototype, new z)
        }, Ox7 = Object.assign || function(K) {
            for (var Y, z = 1, _ = arguments.length; z < _; z++) {
                Y = arguments[z];
                for (var w in Y)
                    if (Object.prototype.hasOwnProperty.call(Y, w)) K[w] = Y[w]
            }
            return K
        }, $x7 = function(K, Y) {
            var z = {};
            for (var _ in K)
                if (Object.prototype.hasOwnProperty.call(K, _) && Y.indexOf(_) < 0) z[_] = K[_];
            if (K != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var w = 0, _ = Object.getOwnPropertySymbols(K); w < _.length; w++)
                    if (Y.indexOf(_[w]) < 0 && Object.prototype.propertyIsEnumerable.call(K, _[w])) z[_[w]] = K[_[w]]
            }
            return z
        }, Hx7 = function(K, Y, z, _) {
            var w = arguments.length,
                O = w < 3 ? Y : _ === null ? _ = Object.getOwnPropertyDescriptor(Y, z) : _,
                $;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") O = Reflect.decorate(K, Y, z, _);
            else
                for (var H = K.length - 1; H >= 0; H--)
                    if ($ = K[H]) O = (w < 3 ? $(O) : w > 3 ? $(Y, z, O) : $(Y, z)) || O;
            return w > 3 && O && Object.defineProperty(Y, z, O), O
        }, jx7 = function(K, Y) {
            return function(z, _) {
                Y(z, _, K)
            }
        }, Jx7 = function(K, Y) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(K, Y)
        }, Mx7 = function(K, Y, z, _) {
            function w(O) {
                return O instanceof z ? O : new z(function($) {
                    $(O)
                })
            }
            return new(z || (z = Promise))(function(O, $) {
                function H(M) {
                    try {
                        J(_.next(M))
                    } catch (D) {
                        $(D)
                    }
                }

                function j(M) {
                    try {
                        J(_.throw(M))
                    } catch (D) {
                        $(D)
                    }
                }

                function J(M) {
                    M.done ? O(M.value) : w(M.value).then(H, j)
                }
                J((_ = _.apply(K, Y || [])).next())
            })
        }, Dx7 = function(K, Y) {
            var z = {
                    label: 0,
                    sent: function() {
                        if (O[0] & 1) throw O[1];
                        return O[1]
                    },
                    trys: [],
                    ops: []
                },
                _, w, O, $;
            return $ = {
                next: H(0),
                throw: H(1),
                return: H(2)
            }, typeof Symbol === "function" && ($[Symbol.iterator] = function() {
                return this
            }), $;

            function H(J) {
                return function(M) {
                    return j([J, M])
                }
            }

            function j(J) {
                if (_) throw TypeError("Generator is already executing.");
                while (z) try {
                    if (_ = 1, w && (O = J[0] & 2 ? w.return : J[0] ? w.throw || ((O = w.return) && O.call(w), 0) : w.next) && !(O = O.call(w, J[1])).done) return O;
                    if (w = 0, O) J = [J[0] & 2, O.value];
                    switch (J[0]) {
                        case 0:
                        case 1:
                            O = J;
                            break;
                        case 4:
                            return z.label++, {
                                value: J[1],
                                done: !1
                            };
                        case 5:
                            z.label++, w = J[1], J = [0];
                            continue;
                        case 7:
                            J = z.ops.pop(), z.trys.pop();
                            continue;
                        default:
                            if ((O = z.trys, !(O = O.length > 0 && O[O.length - 1])) && (J[0] === 6 || J[0] === 2)) {
                                z = 0;
                                continue
                            }
                            if (J[0] === 3 && (!O || J[1] > O[0] && J[1] < O[3])) {
                                z.label = J[1];
                                break
                            }
                            if (J[0] === 6 && z.label < O[1]) {
                                z.label = O[1], O = J;
                                break
                            }
                            if (O && z.label < O[2]) {
                                z.label = O[2], z.ops.push(J);
                                break
                            }
                            if (O[2]) z.ops.pop();
                            z.trys.pop();
                            continue
                    }
                    J = Y.call(K, z)
                } catch (M) {
                    J = [6, M], w = 0
                } finally {
                    _ = O = 0
                }
                if (J[0] & 5) throw J[1];
                return {
                    value: J[0] ? J[1] : void 0,
                    done: !0
                }
            }
        }, Ex7 = function(K, Y, z, _) {
            if (_ === void 0) _ = z;
            K[_] = Y[z]
        }, Xx7 = function(K, Y) {
            for (var z in K)
                if (z !== "default" && !Y.hasOwnProperty(z)) Y[z] = K[z]
        }, GH1 = function(K) {
            var Y = typeof Symbol === "function" && Symbol.iterator,
                z = Y && K[Y],
                _ = 0;
            if (z) return z.call(K);
            if (K && typeof K.length === "number") return {
                next: function() {
                    if (K && _ >= K.length) K = void 0;
                    return {
                        value: K && K[_++],
                        done: !K
                    }
                }
            };
            throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, yM8 = function(K, Y) {
            var z = typeof Symbol === "function" && K[Symbol.iterator];
            if (!z) return K;
            var _ = z.call(K),
                w, O = [],
                $;
            try {
                while ((Y === void 0 || Y-- > 0) && !(w = _.next()).done) O.push(w.value)
            } catch (H) {
                $ = {
                    error: H
                }
            } finally {
                try {
                    if (w && !w.done && (z = _.return)) z.call(_)
                } finally {
                    if ($) throw $.error
                }
            }
            return O
        }, Px7 = function() {
            for (var K = [], Y = 0; Y < arguments.length; Y++) K = K.concat(yM8(arguments[Y]));
            return K
        }, Wx7 = function() {
            for (var K = 0, Y = 0, z = arguments.length; Y < z; Y++) K += arguments[Y].length;
            for (var _ = Array(K), w = 0, Y = 0; Y < z; Y++)
                for (var O = arguments[Y], $ = 0, H = O.length; $ < H; $++, w++) _[w] = O[$];
            return _
        }, sX6 = function(K) {
            return this instanceof sX6 ? (this.v = K, this) : new sX6(K)
        }, Zx7 = function(K, Y, z) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var _ = z.apply(K, Y || []),
                w, O = [];
            return w = {}, $("next"), $("throw"), $("return"), w[Symbol.asyncIterator] = function() {
                return this
            }, w;

            function $(X) {
                if (_[X]) w[X] = function(P) {
                    return new Promise(function(W, Z) {
                        O.push([X, P, W, Z]) > 1 || H(X, P)
                    })
                }
            }

            function H(X, P) {
                try {
                    j(_[X](P))
                } catch (W) {
                    D(O[0][3], W)
                }
            }

            function j(X) {
                X.value instanceof sX6 ? Promise.resolve(X.value.v).then(J, M) : D(O[0][2], X)
            }

            function J(X) {
                H("next", X)
            }

            function M(X) {
                H("throw", X)
            }

            function D(X, P) {
                if (X(P), O.shift(), O.length) H(O[0][0], O[0][1])
            }
        }, Gx7 = function(K) {
            var Y, z;
            return Y = {}, _("next"), _("throw", function(w) {
                throw w
            }), _("return"), Y[Symbol.iterator] = function() {
                return this
            }, Y;

            function _(w, O) {
                Y[w] = K[w] ? function($) {
                    return (z = !z) ? {
                        value: sX6(K[w]($)),
                        done: w === "return"
                    } : O ? O($) : $
                } : O
            }
        }, fx7 = function(K) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var Y = K[Symbol.asyncIterator],
                z;
            return Y ? Y.call(K) : (K = typeof GH1 === "function" ? GH1(K) : K[Symbol.iterator](), z = {}, _("next"), _("throw"), _("return"), z[Symbol.asyncIterator] = function() {
                return this
            }, z);

            function _(O) {
                z[O] = K[O] && function($) {
                    return new Promise(function(H, j) {
                        $ = K[O]($), w(H, j, $.done, $.value)
                    })
                }
            }

            function w(O, $, H, j) {
                Promise.resolve(j).then(function(J) {
                    O({
                        value: J,
                        done: H
                    })
                }, $)
            }
        }, Tx7 = function(K, Y) {
            if (Object.defineProperty) Object.defineProperty(K, "raw", {
                value: Y
            });
            else K.raw = Y;
            return K
        }, vx7 = function(K) {
            if (K && K.__esModule) return K;
            var Y = {};
            if (K != null) {
                for (var z in K)
                    if (Object.hasOwnProperty.call(K, z)) Y[z] = K[z]
            }
            return Y.default = K, Y
        }, Nx7 = function(K) {
            return K && K.__esModule ? K : {
                default: K
            }
        }, Vx7 = function(K, Y) {
            if (!Y.has(K)) throw TypeError("attempted to get private field on non-instance");
            return Y.get(K)
        }, kx7 = function(K, Y, z) {
            if (!Y.has(K)) throw TypeError("attempted to set private field on non-instance");
            return Y.set(K, z), z
        }, A("__extends", wx7), A("__assign", Ox7), A("__rest", $x7), A("__decorate", Hx7), A("__param", jx7), A("__metadata", Jx7), A("__awaiter", Mx7), A("__generator", Dx7), A("__exportStar", Xx7), A("__createBinding", Ex7), A("__values", GH1), A("__read", yM8), A("__spread", Px7), A("__spreadArrays", Wx7), A("__await", sX6), A("__asyncGenerator", Zx7), A("__asyncDelegator", Gx7), A("__asyncValues", fx7), A("__makeTemplateObject", Tx7), A("__importStar", vx7), A("__importDefault", Nx7), A("__classPrivateFieldGet", Vx7), A("__classPrivateFieldSet", kx7)
    })
})
// @from(Ln 170984, Col 4)
Rx7 = x((yx7) => {
    Object.defineProperty(yx7, "__esModule", {
        value: !0
    });
    yx7.convertToBuffer = void 0;
    var VA9 = qJ8(),
        kA9 = typeof Buffer < "u" && Buffer.from ? function(A) {
            return Buffer.from(A, "utf8")
        } : VA9.fromUtf8;

    function EA9(A) {
        if (A instanceof Uint8Array) return A;
        if (typeof A === "string") return kA9(A);
        if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(A)
    }
    yx7.convertToBuffer = EA9
})
// @from(Ln 171002, Col 4)
Cx7 = x((hx7) => {
    Object.defineProperty(hx7, "__esModule", {
        value: !0
    });
    hx7.isEmptyData = void 0;

    function yA9(A) {
        if (typeof A === "string") return A.length === 0;
        return A.byteLength === 0
    }
    hx7.isEmptyData = yA9
})
// @from(Ln 171014, Col 4)
xx7 = x((Ix7) => {
    Object.defineProperty(Ix7, "__esModule", {
        value: !0
    });
    Ix7.numToUint8 = void 0;

    function LA9(A) {
        return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
    }
    Ix7.numToUint8 = LA9
})
// @from(Ln 171025, Col 4)
Bx7 = x((ux7) => {
    Object.defineProperty(ux7, "__esModule", {
        value: !0
    });
    ux7.uint32ArrayFrom = void 0;

    function RA9(A) {
        if (!Uint32Array.from) {
            var q = new Uint32Array(A.length),
                K = 0;
            while (K < A.length) q[K] = A[K], K += 1;
            return q
        }
        return Uint32Array.from(A)
    }
    ux7.uint32ArrayFrom = RA9
})
// @from(Ln 171042, Col 4)
RM8 = x((tX6) => {
    Object.defineProperty(tX6, "__esModule", {
        value: !0
    });
    tX6.uint32ArrayFrom = tX6.numToUint8 = tX6.isEmptyData = tX6.convertToBuffer = void 0;
    var hA9 = Rx7();
    Object.defineProperty(tX6, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return hA9.convertToBuffer
        }
    });
    var SA9 = Cx7();
    Object.defineProperty(tX6, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return SA9.isEmptyData
        }
    });
    var CA9 = xx7();
    Object.defineProperty(tX6, "numToUint8", {
        enumerable: !0,
        get: function() {
            return CA9.numToUint8
        }
    });
    var IA9 = Bx7();
    Object.defineProperty(tX6, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return IA9.uint32ArrayFrom
        }
    })
})
// @from(Ln 171076, Col 4)
Ux7 = x((px7) => {
    Object.defineProperty(px7, "__esModule", {
        value: !0
    });
    px7.AwsCrc32 = void 0;
    var gx7 = LM8(),
        hM8 = RM8(),
        Fx7 = TH1(),
        xA9 = function() {
            function A() {
                this.crc32 = new Fx7.Crc32
            }
            return A.prototype.update = function(q) {
                if ((0, hM8.isEmptyData)(q)) return;
                this.crc32.update((0, hM8.convertToBuffer)(q))
            }, A.prototype.digest = function() {
                return gx7.__awaiter(this, void 0, void 0, function() {
                    return gx7.__generator(this, function(q) {
                        return [2, (0, hM8.numToUint8)(this.crc32.digest())]
                    })
                })
            }, A.prototype.reset = function() {
                this.crc32 = new Fx7.Crc32
            }, A
        }();
    px7.AwsCrc32 = xA9
})
// @from(Ln 171103, Col 4)
TH1 = x((SM8) => {
    Object.defineProperty(SM8, "__esModule", {
        value: !0
    });
    SM8.AwsCrc32 = SM8.Crc32 = SM8.crc32 = void 0;
    var uA9 = LM8(),
        mA9 = RM8();

    function BA9(A) {
        return new dx7().update(A).digest()
    }
    SM8.crc32 = BA9;
    var dx7 = function() {
        function A() {
            this.checksum = 4294967295
        }
        return A.prototype.update = function(q) {
            var K, Y;
            try {
                for (var z = uA9.__values(q), _ = z.next(); !_.done; _ = z.next()) {
                    var w = _.value;
                    this.checksum = this.checksum >>> 8 ^ FA9[(this.checksum ^ w) & 255]
                }
            } catch (O) {
                K = {
                    error: O
                }
            } finally {
                try {
                    if (_ && !_.done && (Y = z.return)) Y.call(z)
                } finally {
                    if (K) throw K.error
                }
            }
            return this
        }, A.prototype.digest = function() {
            return (this.checksum ^ 4294967295) >>> 0
        }, A
    }();
    SM8.Crc32 = dx7;
    var gA9 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
        FA9 = (0, mA9.uint32ArrayFrom)(gA9),
        pA9 = Ux7();
    Object.defineProperty(SM8, "AwsCrc32", {
        enumerable: !0,
        get: function() {
            return pA9.AwsCrc32
        }
    })
})
// @from(Ln 171153, Col 4)
ax7 = x((qz2, ox7) => {
    var {
        defineProperty: vH1,
        getOwnPropertyDescriptor: cA9,
        getOwnPropertyNames: lA9
    } = Object, iA9 = Object.prototype.hasOwnProperty, cx7 = (A, q) => vH1(A, "name", {
        value: q,
        configurable: !0
    }), nA9 = (A, q) => {
        for (var K in q) vH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, rA9 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of lA9(q))
                if (!iA9.call(A, z) && z !== K) vH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = cA9(q, z)) || Y.enumerable
                })
        }
        return A
    }, oA9 = (A) => rA9(vH1({}, "__esModule", {
        value: !0
    }), A), lx7 = {};
    nA9(lx7, {
        fromHex: () => nx7,
        toHex: () => rx7
    });
    ox7.exports = oA9(lx7);
    var ix7 = {},
        CM8 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        ix7[A] = q, CM8[q] = A
    }

    function nx7(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in CM8) q[K / 2] = CM8[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }
    cx7(nx7, "fromHex");

    function rx7(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += ix7[A[K]];
        return q
    }
    cx7(rx7, "toHex")
})
// @from(Ln 171210, Col 4)
ju7 = x((Kz2, Hu7) => {
    var {
        defineProperty: VH1,
        getOwnPropertyDescriptor: aA9,
        getOwnPropertyNames: sA9
    } = Object, tA9 = Object.prototype.hasOwnProperty, QU = (A, q) => VH1(A, "name", {
        value: q,
        configurable: !0
    }), eA9 = (A, q) => {
        for (var K in q) VH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, A79 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of sA9(q))
                if (!tA9.call(A, z) && z !== K) VH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = aA9(q, z)) || Y.enumerable
                })
        }
        return A
    }, q79 = (A) => A79(VH1({}, "__esModule", {
        value: !0
    }), A), tx7 = {};
    eA9(tx7, {
        EventStreamCodec: () => X79,
        HeaderMarshaller: () => qu7,
        Int64: () => NH1,
        MessageDecoderStream: () => P79,
        MessageEncoderStream: () => W79,
        SmithyMessageDecoderStream: () => Z79,
        SmithyMessageEncoderStream: () => G79
    });
    Hu7.exports = q79(tx7);
    var K79 = TH1(),
        uK6 = ax7(),
        ex7 = class A {
            constructor(q) {
                if (this.bytes = q, q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
            }
            static fromNumber(q) {
                if (q > 9223372036854776000 || q < -9223372036854776000) throw Error(`${q} is too large (or, if negative, too small) to represent as an Int64`);
                let K = new Uint8Array(8);
                for (let Y = 7, z = Math.abs(Math.round(q)); Y > -1 && z > 0; Y--, z /= 256) K[Y] = z;
                if (q < 0) IM8(K);
                return new A(K)
            }
            valueOf() {
                let q = this.bytes.slice(0),
                    K = q[0] & 128;
                if (K) IM8(q);
                return parseInt((0, uK6.toHex)(q), 16) * (K ? -1 : 1)
            }
            toString() {
                return String(this.valueOf())
            }
        };
    QU(ex7, "Int64");
    var NH1 = ex7;

    function IM8(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    QU(IM8, "negate");
    var Au7 = class {
        constructor(q, K) {
            this.toUtf8 = q, this.fromUtf8 = K
        }
        format(q) {
            let K = [];
            for (let _ of Object.keys(q)) {
                let w = this.fromUtf8(_);
                K.push(Uint8Array.from([w.byteLength]), w, this.formatHeaderValue(q[_]))
            }
            let Y = new Uint8Array(K.reduce((_, w) => _ + w.byteLength, 0)),
                z = 0;
            for (let _ of K) Y.set(_, z), z += _.byteLength;
            return Y
        }
        formatHeaderValue(q) {
            switch (q.type) {
                case "boolean":
                    return Uint8Array.from([q.value ? 0 : 1]);
                case "byte":
                    return Uint8Array.from([2, q.value]);
                case "short":
                    let K = new DataView(new ArrayBuffer(3));
                    return K.setUint8(0, 3), K.setInt16(1, q.value, !1), new Uint8Array(K.buffer);
                case "integer":
                    let Y = new DataView(new ArrayBuffer(5));
                    return Y.setUint8(0, 4), Y.setInt32(1, q.value, !1), new Uint8Array(Y.buffer);
                case "long":
                    let z = new Uint8Array(9);
                    return z[0] = 5, z.set(q.value.bytes, 1), z;
                case "binary":
                    let _ = new DataView(new ArrayBuffer(3 + q.value.byteLength));
                    _.setUint8(0, 6), _.setUint16(1, q.value.byteLength, !1);
                    let w = new Uint8Array(_.buffer);
                    return w.set(q.value, 3), w;
                case "string":
                    let O = this.fromUtf8(q.value),
                        $ = new DataView(new ArrayBuffer(3 + O.byteLength));
                    $.setUint8(0, 7), $.setUint16(1, O.byteLength, !1);
                    let H = new Uint8Array($.buffer);
                    return H.set(O, 3), H;
                case "timestamp":
                    let j = new Uint8Array(9);
                    return j[0] = 8, j.set(NH1.fromNumber(q.value.valueOf()).bytes, 1), j;
                case "uuid":
                    if (!J79.test(q.value)) throw Error(`Invalid UUID received: ${q.value}`);
                    let J = new Uint8Array(17);
                    return J[0] = 9, J.set((0, uK6.fromHex)(q.value.replace(/\-/g, "")), 1), J
            }
        }
        parse(q) {
            let K = {},
                Y = 0;
            while (Y < q.byteLength) {
                let z = q.getUint8(Y++),
                    _ = this.toUtf8(new Uint8Array(q.buffer, q.byteOffset + Y, z));
                switch (Y += z, q.getUint8(Y++)) {
                    case 0:
                        K[_] = {
                            type: sx7,
                            value: !0
                        };
                        break;
                    case 1:
                        K[_] = {
                            type: sx7,
                            value: !1
                        };
                        break;
                    case 2:
                        K[_] = {
                            type: Y79,
                            value: q.getInt8(Y++)
                        };
                        break;
                    case 3:
                        K[_] = {
                            type: z79,
                            value: q.getInt16(Y, !1)
                        }, Y += 2;
                        break;
                    case 4:
                        K[_] = {
                            type: _79,
                            value: q.getInt32(Y, !1)
                        }, Y += 4;
                        break;
                    case 5:
                        K[_] = {
                            type: w79,
                            value: new NH1(new Uint8Array(q.buffer, q.byteOffset + Y, 8))
                        }, Y += 8;
                        break;
                    case 6:
                        let w = q.getUint16(Y, !1);
                        Y += 2, K[_] = {
                            type: O79,
                            value: new Uint8Array(q.buffer, q.byteOffset + Y, w)
                        }, Y += w;
                        break;
                    case 7:
                        let O = q.getUint16(Y, !1);
                        Y += 2, K[_] = {
                            type: $79,
                            value: this.toUtf8(new Uint8Array(q.buffer, q.byteOffset + Y, O))
                        }, Y += O;
                        break;
                    case 8:
                        K[_] = {
                            type: H79,
                            value: new Date(new NH1(new Uint8Array(q.buffer, q.byteOffset + Y, 8)).valueOf())
                        }, Y += 8;
                        break;
                    case 9:
                        let $ = new Uint8Array(q.buffer, q.byteOffset + Y, 16);
                        Y += 16, K[_] = {
                            type: j79,
                            value: `${(0,uK6.toHex)($.subarray(0,4))}-${(0,uK6.toHex)($.subarray(4,6))}-${(0,uK6.toHex)($.subarray(6,8))}-${(0,uK6.toHex)($.subarray(8,10))}-${(0,uK6.toHex)($.subarray(10))}`
                        };
                        break;
                    default:
                        throw Error("Unrecognized header type tag")
                }
            }
            return K
        }
    };
    QU(Au7, "HeaderMarshaller");
    var qu7 = Au7,
        sx7 = "boolean",
        Y79 = "byte",
        z79 = "short",
        _79 = "integer",
        w79 = "long",
        O79 = "binary",
        $79 = "string",
        H79 = "timestamp",
        j79 = "uuid",
        J79 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        M79 = TH1(),
        Ku7 = 4,
        Ts = Ku7 * 2,
        mK6 = 4,
        D79 = Ts + mK6 * 2;

    function Yu7({
        byteLength: A,
        byteOffset: q,
        buffer: K
    }) {
        if (A < D79) throw Error("Provided message too short to accommodate event stream message overhead");
        let Y = new DataView(K, q, A),
            z = Y.getUint32(0, !1);
        if (A !== z) throw Error("Reported message length does not match received message length");
        let _ = Y.getUint32(Ku7, !1),
            w = Y.getUint32(Ts, !1),
            O = Y.getUint32(A - mK6, !1),
            $ = new M79.Crc32().update(new Uint8Array(K, q, Ts));
        if (w !== $.digest()) throw Error(`The prelude checksum specified in the message (${w}) does not match the calculated CRC32 checksum (${$.digest()})`);
        if ($.update(new Uint8Array(K, q + Ts, A - (Ts + mK6))), O !== $.digest()) throw Error(`The message checksum (${$.digest()}) did not match the expected value of ${O}`);
        return {
            headers: new DataView(K, q + Ts + mK6, _),
            body: new Uint8Array(K, q + Ts + mK6 + _, z - _ - (Ts + mK6 + mK6))
        }
    }
    QU(Yu7, "splitMessage");
    var zu7 = class {
        constructor(q, K) {
            this.headerMarshaller = new qu7(q, K), this.messageBuffer = [], this.isEndOfStream = !1
        }
        feed(q) {
            this.messageBuffer.push(this.decode(q))
        }
        endOfStream() {
            this.isEndOfStream = !0
        }
        getMessage() {
            let q = this.messageBuffer.pop(),
                K = this.isEndOfStream;
            return {
                getMessage() {
                    return q
                },
                isEndOfStream() {
                    return K
                }
            }
        }
        getAvailableMessages() {
            let q = this.messageBuffer;
            this.messageBuffer = [];
            let K = this.isEndOfStream;
            return {
                getMessages() {
                    return q
                },
                isEndOfStream() {
                    return K
                }
            }
        }
        encode({
            headers: q,
            body: K
        }) {
            let Y = this.headerMarshaller.format(q),
                z = Y.byteLength + K.byteLength + 16,
                _ = new Uint8Array(z),
                w = new DataView(_.buffer, _.byteOffset, _.byteLength),
                O = new K79.Crc32;
            return w.setUint32(0, z, !1), w.setUint32(4, Y.byteLength, !1), w.setUint32(8, O.update(_.subarray(0, 8)).digest(), !1), _.set(Y, 12), _.set(K, Y.byteLength + 12), w.setUint32(z - 4, O.update(_.subarray(8, z - 4)).digest(), !1), _
        }
        decode(q) {
            let {
                headers: K,
                body: Y
            } = Yu7(q);
            return {
                headers: this.headerMarshaller.parse(K),
                body: Y
            }
        }
        formatHeaders(q) {
            return this.headerMarshaller.format(q)
        }
    };
    QU(zu7, "EventStreamCodec");
    var X79 = zu7,
        _u7 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.inputStream) yield this.options.decoder.decode(q)
            }
        };
    QU(_u7, "MessageDecoderStream");
    var P79 = _u7,
        wu7 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.messageStream) yield this.options.encoder.encode(q);
                if (this.options.includeEndFrame) yield new Uint8Array(0)
            }
        };
    QU(wu7, "MessageEncoderStream");
    var W79 = wu7,
        Ou7 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.messageStream) {
                    let K = await this.options.deserializer(q);
                    if (K === void 0) continue;
                    yield K
                }
            }
        };
    QU(Ou7, "SmithyMessageDecoderStream");
    var Z79 = Ou7,
        $u7 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.inputStream) yield this.options.serializer(q)
            }
        };
    QU($u7, "SmithyMessageEncoderStream");
    var G79 = $u7
})
// @from(Ln 171559, Col 4)
Zu7 = x((Yz2, Wu7) => {
    var {
        defineProperty: kH1,
        getOwnPropertyDescriptor: f79,
        getOwnPropertyNames: T79
    } = Object, v79 = Object.prototype.hasOwnProperty, eX6 = (A, q) => kH1(A, "name", {
        value: q,
        configurable: !0
    }), N79 = (A, q) => {
        for (var K in q) kH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, V79 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of T79(q))
                if (!v79.call(A, z) && z !== K) kH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = f79(q, z)) || Y.enumerable
                })
        }
        return A
    }, k79 = (A) => V79(kH1({}, "__esModule", {
        value: !0
    }), A), Ju7 = {};
    N79(Ju7, {
        EventStreamMarshaller: () => Pu7,
        eventStreamSerdeProvider: () => E79
    });
    Wu7.exports = k79(Ju7);
    var Km6 = ju7();

    function Mu7(A) {
        let q = 0,
            K = 0,
            Y = null,
            z = null,
            _ = eX6((O) => {
                if (typeof O !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + O);
                q = O, K = 4, Y = new Uint8Array(O), new DataView(Y.buffer).setUint32(0, O, !1)
            }, "allocateMessage"),
            w = eX6(async function*() {
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
            }, "iterator");
        return {
            [Symbol.asyncIterator]: w
        }
    }
    eX6(Mu7, "getChunkedStream");

    function Du7(A, q) {
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
    eX6(Du7, "getMessageUnmarshaller");
    var Xu7 = class {
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.eventStreamCodec = new Km6.EventStreamCodec(q, K), this.utfEncoder = q
        }
        deserialize(q, K) {
            let Y = Mu7(q);
            return new Km6.SmithyMessageDecoderStream({
                messageStream: new Km6.MessageDecoderStream({
                    inputStream: Y,
                    decoder: this.eventStreamCodec
                }),
                deserializer: Du7(K, this.utfEncoder)
            })
        }
        serialize(q, K) {
            return new Km6.MessageEncoderStream({
                messageStream: new Km6.SmithyMessageEncoderStream({
                    inputStream: q,
                    serializer: K
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    };
    eX6(Xu7, "EventStreamMarshaller");
    var Pu7 = Xu7,
        E79 = eX6((A) => new Pu7(A), "eventStreamSerdeProvider")
})