
// @from(Ln 78580, Col 4)
GL8 = R((ai6) => {
    var Bk8 = BQ(),
        EA3 = mQ(),
        kA3 = FQ(),
        mk8 = $b(),
        LA3 = YJ(),
        D16 = lz(),
        hT = R$(),
        RA3 = rQ(),
        S$ = ZC(),
        Fk8 = qM(),
        rz = wk1(),
        Qk8 = Gi6(),
        yA3 = hk8(),
        gk8 = fC(),
        Uk8 = uk8(),
        CA3 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "cognito-identity"
            })
        },
        kO = {
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
        SA3 = (A) => {
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
        hA3 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        IA3 = (A, q) => {
            let K = Object.assign(gk8.getAwsRegionExtensionConfiguration(A), rz.getDefaultExtensionConfiguration(A), Uk8.getHttpHandlerExtensionConfiguration(A), SA3(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, gk8.resolveAwsRegionExtensionConfiguration(K), rz.resolveDefaultRuntimeConfig(K), Uk8.resolveHttpHandlerRuntimeConfig(K), hA3(K))
        };
    class M16 extends rz.Client {
        config;
        constructor(...[A]) {
            let q = yA3.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = CA3(q),
                Y = mk8.resolveUserAgentConfig(K),
                z = Fk8.resolveRetryConfig(Y),
                w = LA3.resolveRegionConfig(z),
                H = Bk8.resolveHostHeaderConfig(w),
                $ = S$.resolveEndpointConfig(H),
                O = Qk8.resolveHttpAuthSchemeConfig($),
                _ = IA3(O, A?.extensions || []);
            this.config = _, this.middlewareStack.use(hT.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(mk8.getUserAgentPlugin(this.config)), this.middlewareStack.use(Fk8.getRetryPlugin(this.config)), this.middlewareStack.use(RA3.getContentLengthPlugin(this.config)), this.middlewareStack.use(Bk8.getHostHeaderPlugin(this.config)), this.middlewareStack.use(EA3.getLoggerPlugin(this.config)), this.middlewareStack.use(kA3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(D16.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: Qk8.defaultCognitoIdentityHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (J) => new D16.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": J.credentials
                })
            })), this.middlewareStack.use(D16.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var IT = class A extends rz.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        pk8 = class A extends IT {
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
        dk8 = class A extends IT {
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
        ck8 = class A extends IT {
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
        lk8 = class A extends IT {
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
        ik8 = class A extends IT {
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
        nk8 = class A extends IT {
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
        rk8 = class A extends IT {
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
        ok8 = class A extends IT {
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
        ak8 = class A extends IT {
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
        sk8 = class A extends IT {
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
        tk8 = class A extends IT {
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
        ek8 = "AllowClassicFlow",
        xA3 = "AccountId",
        bA3 = "AccessKeyId",
        uA3 = "AmbiguousRoleResolution",
        AL8 = "AllowUnauthenticatedIdentities",
        qL8 = "Credentials",
        BA3 = "CreationDate",
        mA3 = "ClientId",
        FA3 = "CognitoIdentityProvider",
        QA3 = "CreateIdentityPoolInput",
        gA3 = "CognitoIdentityProviderList",
        KL8 = "CognitoIdentityProviders",
        UA3 = "CreateIdentityPool",
        pA3 = "ConcurrentModificationException",
        dA3 = "CustomRoleArn",
        cA3 = "Claim",
        lA3 = "DeleteIdentities",
        iA3 = "DeleteIdentitiesInput",
        nA3 = "DescribeIdentityInput",
        rA3 = "DeleteIdentityPool",
        oA3 = "DeleteIdentityPoolInput",
        aA3 = "DescribeIdentityPoolInput",
        sA3 = "DescribeIdentityPool",
        tA3 = "DeleteIdentitiesResponse",
        eA3 = "DescribeIdentity",
        P16 = "DeveloperProviderName",
        A83 = "DeveloperUserAlreadyRegisteredException",
        YL8 = "DeveloperUserIdentifier",
        q83 = "DeveloperUserIdentifierList",
        K83 = "DestinationUserIdentifier",
        Y83 = "Expiration",
        z83 = "ErrorCode",
        w83 = "ExternalServiceException",
        H83 = "GetCredentialsForIdentity",
        $83 = "GetCredentialsForIdentityInput",
        O83 = "GetCredentialsForIdentityResponse",
        _83 = "GetId",
        J83 = "GetIdInput",
        X83 = "GetIdentityPoolRoles",
        D83 = "GetIdentityPoolRolesInput",
        j83 = "GetIdentityPoolRolesResponse",
        M83 = "GetIdResponse",
        P83 = "GetOpenIdToken",
        W83 = "GetOpenIdTokenForDeveloperIdentity",
        G83 = "GetOpenIdTokenForDeveloperIdentityInput",
        Z83 = "GetOpenIdTokenForDeveloperIdentityResponse",
        f83 = "GetOpenIdTokenInput",
        V83 = "GetOpenIdTokenResponse",
        N83 = "GetPrincipalTagAttributeMap",
        T83 = "GetPrincipalTagAttributeMapInput",
        v83 = "GetPrincipalTagAttributeMapResponse",
        E83 = "HideDisabled",
        k83 = "Identities",
        L83 = "IdentityDescription",
        R83 = "InternalErrorException",
        mG = "IdentityId",
        y83 = "InvalidIdentityPoolConfigurationException",
        C83 = "IdentityIdsToDelete",
        S83 = "IdentitiesList",
        h83 = "IdentityPool",
        I83 = "InvalidParameterException",
        k0 = "IdentityPoolId",
        x83 = "IdentityPoolsList",
        vi6 = "IdentityPoolName",
        W16 = "IdentityProviderName",
        b83 = "IdentityPoolShortDescription",
        u83 = "IdentityProviderToken",
        zL8 = "IdentityPoolTags",
        B83 = "IdentityPools",
        $$1 = "Logins",
        m83 = "LookupDeveloperIdentity",
        F83 = "LookupDeveloperIdentityInput",
        Q83 = "LookupDeveloperIdentityResponse",
        g83 = "LimitExceededException",
        U83 = "ListIdentities",
        p83 = "ListIdentitiesInput",
        d83 = "ListIdentityPools",
        c83 = "ListIdentityPoolsInput",
        l83 = "ListIdentityPoolsResponse",
        i83 = "ListIdentitiesResponse",
        n83 = "LoginsMap",
        r83 = "LastModifiedDate",
        o83 = "ListTagsForResource",
        a83 = "ListTagsForResourceInput",
        s83 = "ListTagsForResourceResponse",
        t83 = "LoginsToRemove",
        e83 = "MergeDeveloperIdentities",
        A73 = "MergeDeveloperIdentitiesInput",
        q73 = "MergeDeveloperIdentitiesResponse",
        Ei6 = "MaxResults",
        K73 = "MappingRulesList",
        Y73 = "MappingRule",
        z73 = "MatchType",
        w73 = "NotAuthorizedException",
        O$1 = "NextToken",
        wL8 = "OpenIdConnectProviderARNs",
        H73 = "OIDCToken",
        $73 = "ProviderName",
        G16 = "PrincipalTags",
        HL8 = "Roles",
        ki6 = "ResourceArn",
        O73 = "RoleARN",
        _73 = "RulesConfiguration",
        J73 = "ResourceConflictException",
        X73 = "RulesConfigurationType",
        $L8 = "RoleMappings",
        D73 = "RoleMappingMap",
        j73 = "RoleMapping",
        M73 = "ResourceNotFoundException",
        P73 = "Rules",
        W73 = "SetIdentityPoolRoles",
        G73 = "SetIdentityPoolRolesInput",
        Z73 = "SecretKey",
        f73 = "SecretKeyString",
        OL8 = "SupportedLoginProviders",
        _L8 = "SamlProviderARNs",
        V73 = "SetPrincipalTagAttributeMap",
        N73 = "SetPrincipalTagAttributeMapInput",
        T73 = "SetPrincipalTagAttributeMapResponse",
        v73 = "ServerSideTokenCheck",
        E73 = "SessionToken",
        k73 = "SourceUserIdentifier",
        JL8 = "Token",
        L73 = "TokenDuration",
        R73 = "TagKeys",
        y73 = "TooManyRequestsException",
        C73 = "TagResource",
        S73 = "TagResourceInput",
        h73 = "TagResourceResponse",
        XL8 = "Tags",
        I73 = "Type",
        Li6 = "UseDefaults",
        x73 = "UnlinkDeveloperIdentity",
        b73 = "UnlinkDeveloperIdentityInput",
        u73 = "UnlinkIdentity",
        B73 = "UnprocessedIdentityIds",
        m73 = "UnprocessedIdentityIdList",
        F73 = "UnlinkIdentityInput",
        Q73 = "UnprocessedIdentityId",
        g73 = "UpdateIdentityPool",
        U73 = "UntagResource",
        p73 = "UntagResourceInput",
        d73 = "UntagResourceResponse",
        c73 = "Value",
        Wb = "client",
        RC = "error",
        Gb = "httpError",
        yC = "message",
        l73 = "server",
        DL8 = "smithy.ts.sdk.synthetic.com.amazonaws.cognitoidentity",
        F8 = "com.amazonaws.cognitoidentity",
        i73 = [0, F8, u83, 8, 0],
        jL8 = [0, F8, H73, 8, 0],
        n73 = [0, F8, f73, 8, 0],
        r73 = [3, F8, FA3, 0, [$73, mA3, v73],
            [0, 0, 2]
        ],
        o73 = [-3, F8, pA3, {
                [RC]: Wb,
                [Gb]: 400
            },
            [yC],
            [0]
        ];
    hT.TypeRegistry.for(F8).registerError(o73, tk8);
    var a73 = [3, F8, QA3, 0, [vi6, AL8, ek8, OL8, P16, wL8, KL8, _L8, zL8],
            [0, 2, 2, 128, 0, 64, () => PL8, 64, 128]
        ],
        s73 = [3, F8, qL8, 0, [bA3, Z73, E73, Y83],
            [0, [() => n73, 0], 0, 4]
        ],
        t73 = [3, F8, iA3, 0, [C83],
            [64]
        ],
        e73 = [3, F8, tA3, 0, [B73],
            [() => e43]
        ],
        A43 = [3, F8, oA3, 0, [k0],
            [0]
        ],
        q43 = [3, F8, nA3, 0, [mG],
            [0]
        ],
        K43 = [3, F8, aA3, 0, [k0],
            [0]
        ],
        Y43 = [-3, F8, A83, {
                [RC]: Wb,
                [Gb]: 400
            },
            [yC],
            [0]
        ];
    hT.TypeRegistry.for(F8).registerError(Y43, sk8);
    var z43 = [-3, F8, w83, {
            [RC]: Wb,
            [Gb]: 400
        },
        [yC],
        [0]
    ];
    hT.TypeRegistry.for(F8).registerError(z43, ok8);
    var w43 = [3, F8, $83, 0, [mG, $$1, dA3],
            [0, [() => Jk1, 0], 0]
        ],
        H43 = [3, F8, O83, 0, [mG, qL8],
            [0, [() => s73, 0]]
        ],
        $43 = [3, F8, D83, 0, [k0],
            [0]
        ],
        O43 = [3, F8, j83, 0, [k0, HL8, $L8],
            [0, 128, () => WL8]
        ],
        _43 = [3, F8, J83, 0, [xA3, k0, $$1],
            [0, 0, [() => Jk1, 0]]
        ],
        J43 = [3, F8, M83, 0, [mG],
            [0]
        ],
        X43 = [3, F8, G83, 0, [k0, mG, $$1, G16, L73],
            [0, 0, [() => Jk1, 0], 128, 1]
        ],
        D43 = [3, F8, Z83, 0, [mG, JL8],
            [0, [() => jL8, 0]]
        ],
        j43 = [3, F8, f83, 0, [mG, $$1],
            [0, [() => Jk1, 0]]
        ],
        M43 = [3, F8, V83, 0, [mG, JL8],
            [0, [() => jL8, 0]]
        ],
        P43 = [3, F8, T83, 0, [k0, W16],
            [0, 0]
        ],
        W43 = [3, F8, v83, 0, [k0, W16, Li6, G16],
            [0, 0, 2, 128]
        ],
        ML8 = [3, F8, L83, 0, [mG, $$1, BA3, r83],
            [0, 64, 4, 4]
        ],
        j16 = [3, F8, h83, 0, [k0, vi6, AL8, ek8, OL8, P16, wL8, KL8, _L8, zL8],
            [0, 0, 2, 2, 128, 0, 64, () => PL8, 64, 128]
        ],
        G43 = [3, F8, b83, 0, [k0, vi6],
            [0, 0]
        ],
        Z43 = [-3, F8, R83, {
                [RC]: l73
            },
            [yC],
            [0]
        ];
    hT.TypeRegistry.for(F8).registerError(Z43, pk8);
    var f43 = [-3, F8, y83, {
            [RC]: Wb,
            [Gb]: 400
        },
        [yC],
        [0]
    ];
    hT.TypeRegistry.for(F8).registerError(f43, ak8);
    var V43 = [-3, F8, I83, {
            [RC]: Wb,
            [Gb]: 400
        },
        [yC],
        [0]
    ];
    hT.TypeRegistry.for(F8).registerError(V43, dk8);
    var N43 = [-3, F8, g83, {
            [RC]: Wb,
            [Gb]: 400
        },
        [yC],
        [0]
    ];
    hT.TypeRegistry.for(F8).registerError(N43, ck8);
    var T43 = [3, F8, p83, 0, [k0, Ei6, O$1, E83],
            [0, 1, 0, 2]
        ],
        v43 = [3, F8, i83, 0, [k0, k83, O$1],
            [0, () => a43, 0]
        ],
        E43 = [3, F8, c83, 0, [Ei6, O$1],
            [1, 0]
        ],
        k43 = [3, F8, l83, 0, [B83, O$1],
            [() => s43, 0]
        ],
        L43 = [3, F8, a83, 0, [ki6],
            [0]
        ],
        R43 = [3, F8, s83, 0, [XL8],
            [128]
        ],
        y43 = [3, F8, F83, 0, [k0, mG, YL8, Ei6, O$1],
            [0, 0, 0, 1, 0]
        ],
        C43 = [3, F8, Q83, 0, [mG, q83, O$1],
            [0, 64, 0]
        ],
        S43 = [3, F8, Y73, 0, [cA3, z73, c73, O73],
            [0, 0, 0, 0]
        ],
        h43 = [3, F8, A73, 0, [k73, K83, P16, k0],
            [0, 0, 0, 0]
        ],
        I43 = [3, F8, q73, 0, [mG],
            [0]
        ],
        x43 = [-3, F8, w73, {
                [RC]: Wb,
                [Gb]: 403
            },
            [yC],
            [0]
        ];
    hT.TypeRegistry.for(F8).registerError(x43, lk8);
    var b43 = [-3, F8, J73, {
            [RC]: Wb,
            [Gb]: 409
        },
        [yC],
        [0]
    ];
    hT.TypeRegistry.for(F8).registerError(b43, ik8);
    var u43 = [-3, F8, M73, {
            [RC]: Wb,
            [Gb]: 404
        },
        [yC],
        [0]
    ];
    hT.TypeRegistry.for(F8).registerError(u43, rk8);
    var B43 = [3, F8, j73, 0, [I73, uA3, _73],
            [0, 0, () => m43]
        ],
        m43 = [3, F8, X73, 0, [P73],
            [() => t43]
        ],
        F43 = [3, F8, G73, 0, [k0, HL8, $L8],
            [0, 128, () => WL8]
        ],
        Q43 = [3, F8, N73, 0, [k0, W16, Li6, G16],
            [0, 0, 2, 128]
        ],
        g43 = [3, F8, T73, 0, [k0, W16, Li6, G16],
            [0, 0, 2, 128]
        ],
        U43 = [3, F8, S73, 0, [ki6, XL8],
            [0, 128]
        ],
        p43 = [3, F8, h73, 0, [],
            []
        ],
        d43 = [-3, F8, y73, {
                [RC]: Wb,
                [Gb]: 429
            },
            [yC],
            [0]
        ];
    hT.TypeRegistry.for(F8).registerError(d43, nk8);
    var c43 = [3, F8, b73, 0, [mG, k0, P16, YL8],
            [0, 0, 0, 0]
        ],
        l43 = [3, F8, F73, 0, [mG, $$1, t83],
            [0, [() => Jk1, 0], 64]
        ],
        i43 = [3, F8, Q73, 0, [mG, z83],
            [0, 0]
        ],
        n43 = [3, F8, p73, 0, [ki6, R73],
            [0, 64]
        ],
        r43 = [3, F8, d73, 0, [],
            []
        ],
        Z16 = "unit",
        o43 = [-3, DL8, "CognitoIdentityServiceException", 0, [],
            []
        ];
    hT.TypeRegistry.for(DL8).registerError(o43, IT);
    var PL8 = [1, F8, gA3, 0, () => r73],
        a43 = [1, F8, S83, 0, () => ML8],
        s43 = [1, F8, x83, 0, () => G43],
        t43 = [1, F8, K73, 0, () => S43],
        e43 = [1, F8, m73, 0, () => i43],
        Jk1 = [2, F8, n83, 0, [0, 0],
            [() => i73, 0]
        ],
        WL8 = [2, F8, D73, 0, 0, () => B43],
        Aq3 = [9, F8, UA3, 0, () => a73, () => j16],
        qq3 = [9, F8, lA3, 0, () => t73, () => e73],
        Kq3 = [9, F8, rA3, 0, () => A43, () => Z16],
        Yq3 = [9, F8, eA3, 0, () => q43, () => ML8],
        zq3 = [9, F8, sA3, 0, () => K43, () => j16],
        wq3 = [9, F8, H83, 0, () => w43, () => H43],
        Hq3 = [9, F8, _83, 0, () => _43, () => J43],
        $q3 = [9, F8, X83, 0, () => $43, () => O43],
        Oq3 = [9, F8, P83, 0, () => j43, () => M43],
        _q3 = [9, F8, W83, 0, () => X43, () => D43],
        Jq3 = [9, F8, N83, 0, () => P43, () => W43],
        Xq3 = [9, F8, U83, 0, () => T43, () => v43],
        Dq3 = [9, F8, d83, 0, () => E43, () => k43],
        jq3 = [9, F8, o83, 0, () => L43, () => R43],
        Mq3 = [9, F8, m83, 0, () => y43, () => C43],
        Pq3 = [9, F8, e83, 0, () => h43, () => I43],
        Wq3 = [9, F8, W73, 0, () => F43, () => Z16],
        Gq3 = [9, F8, V73, 0, () => Q43, () => g43],
        Zq3 = [9, F8, C73, 0, () => U43, () => p43],
        fq3 = [9, F8, x73, 0, () => c43, () => Z16],
        Vq3 = [9, F8, u73, 0, () => l43, () => Z16],
        Nq3 = [9, F8, U73, 0, () => n43, () => r43],
        Tq3 = [9, F8, g73, 0, () => j16, () => j16];
    class Ri6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "CreateIdentityPool", {}).n("CognitoIdentityClient", "CreateIdentityPoolCommand").sc(Aq3).build() {}
    class yi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentities", {}).n("CognitoIdentityClient", "DeleteIdentitiesCommand").sc(qq3).build() {}
    class Ci6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentityPool", {}).n("CognitoIdentityClient", "DeleteIdentityPoolCommand").sc(Kq3).build() {}
    class Si6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentity", {}).n("CognitoIdentityClient", "DescribeIdentityCommand").sc(Yq3).build() {}
    class hi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentityPool", {}).n("CognitoIdentityClient", "DescribeIdentityPoolCommand").sc(zq3).build() {}
    class Ii6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").sc(wq3).build() {}
    class xi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").sc(Hq3).build() {}
    class bi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetIdentityPoolRoles", {}).n("CognitoIdentityClient", "GetIdentityPoolRolesCommand").sc($q3).build() {}
    class ui6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdToken", {}).n("CognitoIdentityClient", "GetOpenIdTokenCommand").sc(Oq3).build() {}
    class Bi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdTokenForDeveloperIdentity", {}).n("CognitoIdentityClient", "GetOpenIdTokenForDeveloperIdentityCommand").sc(_q3).build() {}
    class mi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "GetPrincipalTagAttributeMapCommand").sc(Jq3).build() {}
    class Fi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentities", {}).n("CognitoIdentityClient", "ListIdentitiesCommand").sc(Xq3).build() {}
    class f16 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentityPools", {}).n("CognitoIdentityClient", "ListIdentityPoolsCommand").sc(Dq3).build() {}
    class Qi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListTagsForResource", {}).n("CognitoIdentityClient", "ListTagsForResourceCommand").sc(jq3).build() {}
    class gi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "LookupDeveloperIdentity", {}).n("CognitoIdentityClient", "LookupDeveloperIdentityCommand").sc(Mq3).build() {}
    class Ui6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "MergeDeveloperIdentities", {}).n("CognitoIdentityClient", "MergeDeveloperIdentitiesCommand").sc(Pq3).build() {}
    class pi6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetIdentityPoolRoles", {}).n("CognitoIdentityClient", "SetIdentityPoolRolesCommand").sc(Wq3).build() {}
    class di6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "SetPrincipalTagAttributeMapCommand").sc(Gq3).build() {}
    class ci6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "TagResource", {}).n("CognitoIdentityClient", "TagResourceCommand").sc(Zq3).build() {}
    class li6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkDeveloperIdentity", {}).n("CognitoIdentityClient", "UnlinkDeveloperIdentityCommand").sc(fq3).build() {}
    class ii6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkIdentity", {}).n("CognitoIdentityClient", "UnlinkIdentityCommand").sc(Vq3).build() {}
    class ni6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UntagResource", {}).n("CognitoIdentityClient", "UntagResourceCommand").sc(Nq3).build() {}
    class ri6 extends rz.Command.classBuilder().ep(kO).m(function(A, q, K, Y) {
        return [S$.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UpdateIdentityPool", {}).n("CognitoIdentityClient", "UpdateIdentityPoolCommand").sc(Tq3).build() {}
    var vq3 = {
        CreateIdentityPoolCommand: Ri6,
        DeleteIdentitiesCommand: yi6,
        DeleteIdentityPoolCommand: Ci6,
        DescribeIdentityCommand: Si6,
        DescribeIdentityPoolCommand: hi6,
        GetCredentialsForIdentityCommand: Ii6,
        GetIdCommand: xi6,
        GetIdentityPoolRolesCommand: bi6,
        GetOpenIdTokenCommand: ui6,
        GetOpenIdTokenForDeveloperIdentityCommand: Bi6,
        GetPrincipalTagAttributeMapCommand: mi6,
        ListIdentitiesCommand: Fi6,
        ListIdentityPoolsCommand: f16,
        ListTagsForResourceCommand: Qi6,
        LookupDeveloperIdentityCommand: gi6,
        MergeDeveloperIdentitiesCommand: Ui6,
        SetIdentityPoolRolesCommand: pi6,
        SetPrincipalTagAttributeMapCommand: di6,
        TagResourceCommand: ci6,
        UnlinkDeveloperIdentityCommand: li6,
        UnlinkIdentityCommand: ii6,
        UntagResourceCommand: ni6,
        UpdateIdentityPoolCommand: ri6
    };
    class oi6 extends M16 {}
    rz.createAggregatedClient(vq3, oi6);
    var Eq3 = D16.createPaginator(M16, f16, "NextToken", "NextToken", "MaxResults"),
        kq3 = {
            AUTHENTICATED_ROLE: "AuthenticatedRole",
            DENY: "Deny"
        },
        Lq3 = {
            ACCESS_DENIED: "AccessDenied",
            INTERNAL_SERVER_ERROR: "InternalServerError"
        },
        Rq3 = {
            CONTAINS: "Contains",
            EQUALS: "Equals",
            NOT_EQUAL: "NotEqual",
            STARTS_WITH: "StartsWith"
        },
        yq3 = {
            RULES: "Rules",
            TOKEN: "Token"
        };
    Object.defineProperty(ai6, "$Command", {
        enumerable: !0,
        get: function() {
            return rz.Command
        }
    });
    Object.defineProperty(ai6, "__Client", {
        enumerable: !0,
        get: function() {
            return rz.Client
        }
    });
    ai6.AmbiguousRoleResolutionType = kq3;
    ai6.CognitoIdentity = oi6;
    ai6.CognitoIdentityClient = M16;
    ai6.CognitoIdentityServiceException = IT;
    ai6.ConcurrentModificationException = tk8;
    ai6.CreateIdentityPoolCommand = Ri6;
    ai6.DeleteIdentitiesCommand = yi6;
    ai6.DeleteIdentityPoolCommand = Ci6;
    ai6.DescribeIdentityCommand = Si6;
    ai6.DescribeIdentityPoolCommand = hi6;
    ai6.DeveloperUserAlreadyRegisteredException = sk8;
    ai6.ErrorCode = Lq3;
    ai6.ExternalServiceException = ok8;
    ai6.GetCredentialsForIdentityCommand = Ii6;
    ai6.GetIdCommand = xi6;
    ai6.GetIdentityPoolRolesCommand = bi6;
    ai6.GetOpenIdTokenCommand = ui6;
    ai6.GetOpenIdTokenForDeveloperIdentityCommand = Bi6;
    ai6.GetPrincipalTagAttributeMapCommand = mi6;
    ai6.InternalErrorException = pk8;
    ai6.InvalidIdentityPoolConfigurationException = ak8;
    ai6.InvalidParameterException = dk8;
    ai6.LimitExceededException = ck8;
    ai6.ListIdentitiesCommand = Fi6;
    ai6.ListIdentityPoolsCommand = f16;
    ai6.ListTagsForResourceCommand = Qi6;
    ai6.LookupDeveloperIdentityCommand = gi6;
    ai6.MappingRuleMatchType = Rq3;
    ai6.MergeDeveloperIdentitiesCommand = Ui6;
    ai6.NotAuthorizedException = lk8;
    ai6.ResourceConflictException = ik8;
    ai6.ResourceNotFoundException = rk8;
    ai6.RoleMappingType = yq3;
    ai6.SetIdentityPoolRolesCommand = pi6;
    ai6.SetPrincipalTagAttributeMapCommand = di6;
    ai6.TagResourceCommand = ci6;
    ai6.TooManyRequestsException = nk8;
    ai6.UnlinkDeveloperIdentityCommand = li6;
    ai6.UnlinkIdentityCommand = ii6;
    ai6.UntagResourceCommand = ni6;
    ai6.UpdateIdentityPoolCommand = ri6;
    ai6.paginateListIdentityPools = Eq3
})
// @from(Ln 79410, Col 4)
ti6 = R((V16) => {
    var si6 = GL8();
    Object.defineProperty(V16, "CognitoIdentityClient", {
        enumerable: !0,
        get: function() {
            return si6.CognitoIdentityClient
        }
    });
    Object.defineProperty(V16, "GetCredentialsForIdentityCommand", {
        enumerable: !0,
        get: function() {
            return si6.GetCredentialsForIdentityCommand
        }
    });
    Object.defineProperty(V16, "GetIdCommand", {
        enumerable: !0,
        get: function() {
            return si6.GetIdCommand
        }
    })
})
// @from(Ln 79431, Col 4)
An6 = R((EK3) => {
    var N16 = wX();

    function ZL8(A) {
        return Promise.all(Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            if (typeof Y === "string") q.push([K, Y]);
            else q.push(Y().then((z) => [K, z]));
            return q
        }, [])).then((q) => q.reduce((K, [Y, z]) => {
            return K[Y] = z, K
        }, {}))
    }

    function fL8(A) {
        return async (q) => {
            A.logger?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
            let {
                GetCredentialsForIdentityCommand: K,
                CognitoIdentityClient: Y
            } = await Promise.resolve().then(function() {
                return ti6()
            }), z = (_) => A.clientConfig?.[_] ?? A.parentClientConfig?.[_] ?? q?.callerClientConfig?.[_], {
                Credentials: {
                    AccessKeyId: w = GK3(A.logger),
                    Expiration: H,
                    SecretKey: $ = fK3(A.logger),
                    SessionToken: O
                } = ZK3(A.logger)
            } = await (A.client ?? new Y(Object.assign({}, A.clientConfig ?? {}, {
                region: z("region"),
                profile: z("profile"),
                userAgentAppId: z("userAgentAppId")
            }))).send(new K({
                CustomRoleArn: A.customRoleArn,
                IdentityId: A.identityId,
                Logins: A.logins ? await ZL8(A.logins) : void 0
            }));
            return {
                identityId: A.identityId,
                accessKeyId: w,
                secretAccessKey: $,
                sessionToken: O,
                expiration: H
            }
        }
    }

    function GK3(A) {
        throw new N16.CredentialsProviderError("Response from Amazon Cognito contained no access key ID", {
            logger: A
        })
    }

    function ZK3(A) {
        throw new N16.CredentialsProviderError("Response from Amazon Cognito contained no credentials", {
            logger: A
        })
    }

    function fK3(A) {
        throw new N16.CredentialsProviderError("Response from Amazon Cognito contained no secret key", {
            logger: A
        })
    }
    var ei6 = "IdentityIds";
    class VL8 {
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
                return new Promise((z, w) => {
                    Y.onerror = () => w(Y.error), Y.onsuccess = () => z()
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
                    }, Y.createObjectStore(ei6, {
                        keyPath: "id"
                    })
                }
            })
        }
        withObjectStore(A, q) {
            return this.getDb().then((K) => {
                let Y = K.transaction(ei6, A);
                return Y.oncomplete = () => K.close(), new Promise((z, w) => {
                    Y.onerror = () => w(Y.error), z(q(Y.objectStore(ei6)))
                }).catch((z) => {
                    throw K.close(), z
                })
            })
        }
    }
    class NL8 {
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
    var VK3 = new NL8;

    function NK3() {
        if (typeof self === "object" && self.indexedDB) return new VL8;
        if (typeof window === "object" && window.localStorage) return window.localStorage;
        return VK3
    }

    function TK3({
        accountId: A,
        cache: q = NK3(),
        client: K,
        clientConfig: Y,
        customRoleArn: z,
        identityPoolId: w,
        logins: H,
        userIdentifier: $ = !H || Object.keys(H).length === 0 ? "ANONYMOUS" : void 0,
        logger: O,
        parentClientConfig: _
    }) {
        O?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
        let J = $ ? `aws:cognito-identity-credentials:${w}:${$}` : void 0,
            X = async (D) => {
                let {
                    GetIdCommand: j,
                    CognitoIdentityClient: M
                } = await Promise.resolve().then(function() {
                    return ti6()
                }), P = (f) => Y?.[f] ?? _?.[f] ?? D?.callerClientConfig?.[f], W = K ?? new M(Object.assign({}, Y ?? {}, {
                    region: P("region"),
                    profile: P("profile"),
                    userAgentAppId: P("userAgentAppId")
                })), G = J && await q.getItem(J);
                if (!G) {
                    let {
                        IdentityId: f = vK3(O)
                    } = await W.send(new j({
                        AccountId: A,
                        IdentityPoolId: w,
                        Logins: H ? await ZL8(H) : void 0
                    }));
                    if (G = f, J) Promise.resolve(q.setItem(J, G)).catch(() => {})
                }
                return X = fL8({
                    client: W,
                    customRoleArn: z,
                    logins: H,
                    identityId: G
                }), X(D)
            };
        return (D) => X(D).catch(async (j) => {
            if (J) Promise.resolve(q.removeItem(J)).catch(() => {});
            throw j
        })
    }

    function vK3(A) {
        throw new N16.CredentialsProviderError("Response from Amazon Cognito contained no identity ID", {
            logger: A
        })
    }
    EK3.fromCognitoIdentity = fL8;
    EK3.fromCognitoIdentityPool = TK3
})
// @from(Ln 79639, Col 4)
EL8 = R((TL8) => {
    Object.defineProperty(TL8, "__esModule", {
        value: !0
    });
    TL8.fromCognitoIdentity = void 0;
    var RK3 = An6(),
        yK3 = (A) => (0, RK3.fromCognitoIdentity)({
            ...A
        });
    TL8.fromCognitoIdentity = yK3
})
// @from(Ln 79650, Col 4)
RL8 = R((kL8) => {
    Object.defineProperty(kL8, "__esModule", {
        value: !0
    });
    kL8.fromCognitoIdentityPool = void 0;
    var CK3 = An6(),
        SK3 = (A) => (0, CK3.fromCognitoIdentityPool)({
            ...A
        });
    kL8.fromCognitoIdentityPool = SK3
})
// @from(Ln 79661, Col 4)
SL8 = R((yL8) => {
    Object.defineProperty(yL8, "__esModule", {
        value: !0
    });
    yL8.fromContainerMetadata = void 0;
    var hK3 = VA1(),
        IK3 = (A) => {
            return A?.logger?.debug("@smithy/credential-provider-imds", "fromContainerMetadata"), (0, hK3.fromContainerMetadata)(A)
        };
    yL8.fromContainerMetadata = IK3
})
// @from(Ln 79672, Col 4)
xL8 = R((hL8) => {
    Object.defineProperty(hL8, "__esModule", {
        value: !0
    });
    hL8.fromEnv = void 0;
    var xK3 = He1(),
        bK3 = (A) => (0, xK3.fromEnv)(A);
    hL8.fromEnv = bK3
})
// @from(Ln 79681, Col 4)
BL8 = R((bL8) => {
    Object.defineProperty(bL8, "__esModule", {
        value: !0
    });
    bL8.fromIni = void 0;
    var uK3 = yl6(),
        BK3 = (A = {}) => (0, uK3.fromIni)({
            ...A
        });
    bL8.fromIni = BK3
})
// @from(Ln 79692, Col 4)
QL8 = R((mL8) => {
    Object.defineProperty(mL8, "__esModule", {
        value: !0
    });
    mL8.fromInstanceMetadata = void 0;
    var mK3 = of(),
        FK3 = VA1(),
        QK3 = (A) => {
            return A?.logger?.debug("@smithy/credential-provider-imds", "fromInstanceMetadata"), async () => (0, FK3.fromInstanceMetadata)(A)().then((q) => (0, mK3.setCredentialFeature)(q, "CREDENTIALS_IMDS", "0"))
        };
    mL8.fromInstanceMetadata = QK3
})
// @from(Ln 79704, Col 4)
pL8 = R((gL8) => {
    Object.defineProperty(gL8, "__esModule", {
        value: !0
    });
    gL8.fromLoginCredentials = void 0;
    var gK3 = Hl6(),
        UK3 = (A) => (0, gK3.fromLoginCredentials)({
            ...A
        });
    gL8.fromLoginCredentials = UK3
})
// @from(Ln 79715, Col 4)
qn6 = R((dL8) => {
    Object.defineProperty(dL8, "__esModule", {
        value: !0
    });
    dL8.fromNodeProviderChain = void 0;
    var pK3 = xA1(),
        dK3 = (A = {}) => (0, pK3.defaultProvider)({
            ...A
        });
    dL8.fromNodeProviderChain = dK3
})
// @from(Ln 79726, Col 4)
nL8 = R((lL8) => {
    Object.defineProperty(lL8, "__esModule", {
        value: !0
    });
    lL8.fromProcess = void 0;
    var cK3 = ee1(),
        lK3 = (A) => (0, cK3.fromProcess)(A);
    lL8.fromProcess = lK3
})
// @from(Ln 79735, Col 4)
aL8 = R((rL8) => {
    Object.defineProperty(rL8, "__esModule", {
        value: !0
    });
    rL8.fromSSO = void 0;
    var iK3 = Qe1(),
        nK3 = (A = {}) => {
            return (0, iK3.fromSSO)({
                ...A
            })
        };
    rL8.fromSSO = nK3
})
// @from(Ln 79748, Col 4)
tL8 = R((T16) => {
    Object.defineProperty(T16, "__esModule", {
        value: !0
    });
    T16.STSClient = T16.AssumeRoleCommand = void 0;
    var sL8 = te1();
    Object.defineProperty(T16, "AssumeRoleCommand", {
        enumerable: !0,
        get: function() {
            return sL8.AssumeRoleCommand
        }
    });
    Object.defineProperty(T16, "STSClient", {
        enumerable: !0,
        get: function() {
            return sL8.STSClient
        }
    })
})
// @from(Ln 79767, Col 4)
qR8 = R((Zb) => {
    var oK3 = Zb && Zb.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        aK3 = Zb && Zb.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        sK3 = Zb && Zb.__importStar || function() {
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
                        if (Y[z] !== "default") oK3(K, q, Y[z])
                }
                return aK3(K, q), K
            }
        }();
    Object.defineProperty(Zb, "__esModule", {
        value: !0
    });
    Zb.fromTemporaryCredentials = void 0;
    var tK3 = lz(),
        eL8 = wX(),
        eK3 = "us-east-1",
        A33 = (A, q, K) => {
            let Y;
            return async (z = {}) => {
                let {
                    callerClientConfig: w
                } = z, H = A.clientConfig?.profile ?? w?.profile, $ = A.logger ?? w?.logger;
                $?.debug("@aws-sdk/credential-providers - fromTemporaryCredentials (STS)");
                let O = {
                    ...A.params,
                    RoleSessionName: A.params.RoleSessionName ?? "aws-sdk-js-" + Date.now()
                };
                if (O?.SerialNumber) {
                    if (!A.mfaCodeProvider) throw new eL8.CredentialsProviderError("Temporary credential requires multi-factor authentication, but no MFA code callback was provided.", {
                        tryNextLink: !1,
                        logger: $
                    });
                    O.TokenCode = await A.mfaCodeProvider(O?.SerialNumber)
                }
                let {
                    AssumeRoleCommand: _,
                    STSClient: J
                } = await Promise.resolve().then(() => sK3(tL8()));
                if (!Y) {
                    let D = typeof q === "function" ? q() : void 0,
                        j = [A.masterCredentials, A.clientConfig?.credentials, void w?.credentials, w?.credentialDefaultProvider?.(), D],
                        M = "STS client default credentials";
                    if (j[0]) M = "options.masterCredentials";
                    else if (j[1]) M = "options.clientConfig.credentials";
                    else if (j[2]) throw M = "caller client's credentials", Error("fromTemporaryCredentials recursion in callerClientConfig.credentials");
                    else if (j[3]) M = "caller client's credentialDefaultProvider";
                    else if (j[4]) M = "AWS SDK default credentials";
                    let P = [A.clientConfig?.region, w?.region, await K?.({
                            profile: H
                        }), eK3],
                        W = "default partition's default region";
                    if (P[0]) W = "options.clientConfig.region";
                    else if (P[1]) W = "caller client's region";
                    else if (P[2]) W = "file or env region";
                    let G = [AR8(A.clientConfig?.requestHandler), AR8(w?.requestHandler)],
                        f = "STS default requestHandler";
                    if (G[0]) f = "options.clientConfig.requestHandler";
                    else if (G[1]) f = "caller client's requestHandler";
                    $?.debug?.(`@aws-sdk/credential-providers - fromTemporaryCredentials STS client init with ${W}=${await(0,tK3.normalizeProvider)(v16(P))()}, ${M}, ${f}.`), Y = new J({
                        userAgentAppId: w?.userAgentAppId,
                        ...A.clientConfig,
                        credentials: v16(j),
                        logger: $,
                        profile: H,
                        region: v16(P),
                        requestHandler: v16(G)
                    })
                }
                if (A.clientPlugins)
                    for (let D of A.clientPlugins) Y.middlewareStack.use(D);
                let {
                    Credentials: X
                } = await Y.send(new _(O));
                if (!X || !X.AccessKeyId || !X.SecretAccessKey) throw new eL8.CredentialsProviderError(`Invalid response from STS.assumeRole call with role ${O.RoleArn}`, {
                    logger: $
                });
                return {
                    accessKeyId: X.AccessKeyId,
                    secretAccessKey: X.SecretAccessKey,
                    sessionToken: X.SessionToken,
                    expiration: X.Expiration,
                    credentialScope: X.CredentialScope
                }
            }
        };
    Zb.fromTemporaryCredentials = A33;
    var AR8 = (A) => {
            return A?.metadata?.handlerProtocol === "h2" ? void 0 : A
        },
        v16 = (A) => {
            for (let q of A)
                if (q !== void 0) return q
        }
})
// @from(Ln 79894, Col 4)
zR8 = R((KR8) => {
    Object.defineProperty(KR8, "__esModule", {
        value: !0
    });
    KR8.fromTemporaryCredentials = void 0;
    var q33 = YJ(),
        K33 = af(),
        Y33 = qn6(),
        z33 = qR8(),
        w33 = (A) => {
            return (0, z33.fromTemporaryCredentials)(A, Y33.fromNodeProviderChain, async ({
                profile: q = process.env.AWS_PROFILE
            }) => (0, K33.loadConfig)({
                environmentVariableSelector: (K) => K.AWS_REGION,
                configFileSelector: (K) => {
                    return K.region
                },
                default: () => {
                    return
                }
            }, {
                ...q33.NODE_REGION_CONFIG_FILE_OPTIONS,
                profile: q
            })())
        };
    KR8.fromTemporaryCredentials = w33
})
// @from(Ln 79921, Col 4)
$R8 = R((wR8) => {
    Object.defineProperty(wR8, "__esModule", {
        value: !0
    });
    wR8.fromTokenFile = void 0;
    var H33 = sE1(),
        $33 = (A = {}) => (0, H33.fromTokenFile)({
            ...A
        });
    wR8.fromTokenFile = $33
})
// @from(Ln 79932, Col 4)
JR8 = R((OR8) => {
    Object.defineProperty(OR8, "__esModule", {
        value: !0
    });
    OR8.fromWebToken = void 0;
    var O33 = sE1(),
        _33 = (A) => (0, O33.fromWebToken)({
            ...A
        });
    OR8.fromWebToken = _33
})
// @from(Ln 79943, Col 4)
Kn6 = R(($M) => {
    Object.defineProperty($M, "__esModule", {
        value: !0
    });
    $M.fromHttp = void 0;
    var ef = n2();
    ef.__exportStar(yE8(), $M);
    ef.__exportStar(EL8(), $M);
    ef.__exportStar(RL8(), $M);
    ef.__exportStar(SL8(), $M);
    ef.__exportStar(xL8(), $M);
    var J33 = Je1();
    Object.defineProperty($M, "fromHttp", {
        enumerable: !0,
        get: function() {
            return J33.fromHttp
        }
    });
    ef.__exportStar(BL8(), $M);
    ef.__exportStar(QL8(), $M);
    ef.__exportStar(pL8(), $M);
    ef.__exportStar(qn6(), $M);
    ef.__exportStar(nL8(), $M);
    ef.__exportStar(aL8(), $M);
    ef.__exportStar(zR8(), $M);
    ef.__exportStar($R8(), $M);
    ef.__exportStar(JR8(), $M)
})
// @from(Ln 79972, Col 0)
function XR8(A) {
    return A?.name === "CredentialsProviderError"
}
// @from(Ln 79976, Col 0)
function DR8(A) {
    if (!A || typeof A !== "object") return !1;
    let q = A;
    if (!q.Credentials || typeof q.Credentials !== "object") return !1;
    let K = q.Credentials;
    return typeof K.AccessKeyId === "string" && typeof K.SecretAccessKey === "string" && typeof K.SessionToken === "string" && K.AccessKeyId.length > 0 && K.SecretAccessKey.length > 0 && K.SessionToken.length > 0
}
// @from(Ln 79983, Col 0)
async function jR8() {
    try {
        h("Clearing AWS credential provider cache");
        let {
            fromIni: A
        } = await Promise.resolve().then(() => o(Kn6(), 1));
        await A({
            ignoreCache: !0
        })(), h("AWS credential provider cache refreshed")
    } catch (A) {
        h("Failed to clear AWS credential cache (this is expected if no credentials are configured)")
    }
}
// @from(Ln 79996, Col 4)
Yn6 = async () => {
    let {
        STSClient: A,
        GetCallerIdentityCommand: q
    } = await Promise.resolve().then(() => o(LE8(), 1));
    await new A().send(new q({}))
}
// @from(Ln 80003, Col 4)
zn6 = v(() => {
    Z6()
})
// @from(Ln 80006, Col 4)
WR8 = R((AV) => {
    var D33 = AV && AV.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        j33 = AV && AV.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        MR8 = AV && AV.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) D33(q, A, K)
            }
            return j33(q, A), q
        };
    Object.defineProperty(AV, "__esModule", {
        value: !0
    });
    AV.req = AV.json = AV.toBuffer = void 0;
    var M33 = MR8(h1("http")),
        P33 = MR8(h1("https"));
    async function PR8(A) {
        let q = 0,
            K = [];
        for await (let Y of A) q += Y.length, K.push(Y);
        return Buffer.concat(K, q)
    }
    AV.toBuffer = PR8;
    async function W33(A) {
        let K = (await PR8(A)).toString("utf8");
        try {
            return JSON.parse(K)
        } catch (Y) {
            let z = Y;
            throw z.message += ` (input: ${K})`, z
        }
    }
    AV.json = W33;

    function G33(A, q = {}) {
        let Y = ((typeof A === "string" ? A : A.href).startsWith("https:") ? P33 : M33).request(A, q),
            z = new Promise((w, H) => {
                Y.once("response", w).once("error", H).end()
            });
        return Y.then = z.then.bind(z), Y
    }
    AV.req = G33
})
// @from(Ln 80071, Col 4)
wn6 = R((xT) => {
    var ZR8 = xT && xT.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        Z33 = xT && xT.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        fR8 = xT && xT.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) ZR8(q, A, K)
            }
            return Z33(q, A), q
        },
        f33 = xT && xT.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) ZR8(q, A, K)
        };
    Object.defineProperty(xT, "__esModule", {
        value: !0
    });
    xT.Agent = void 0;
    var V33 = fR8(h1("net")),
        GR8 = fR8(h1("http")),
        N33 = h1("https");
    f33(WR8(), xT);
    var fb = Symbol("AgentBaseInternalState");
    class VR8 extends GR8.Agent {
        constructor(A) {
            super(A);
            this[fb] = {}
        }
        isSecureEndpoint(A) {
            if (A) {
                if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
                if (typeof A.protocol === "string") return A.protocol === "https:"
            }
            let {
                stack: q
            } = Error();
            if (typeof q !== "string") return !1;
            return q.split(`
`).some((K) => K.indexOf("(https.js:") !== -1 || K.indexOf("node:https:") !== -1)
        }
        incrementSockets(A) {
            if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0) return null;
            if (!this.sockets[A]) this.sockets[A] = [];
            let q = new V33.Socket({
                writable: !1
            });
            return this.sockets[A].push(q), this.totalSocketCount++, q
        }
        decrementSockets(A, q) {
            if (!this.sockets[A] || q === null) return;
            let K = this.sockets[A],
                Y = K.indexOf(q);
            if (Y !== -1) {
                if (K.splice(Y, 1), this.totalSocketCount--, K.length === 0) delete this.sockets[A]
            }
        }
        getName(A) {
            if (typeof A.secureEndpoint === "boolean" ? A.secureEndpoint : this.isSecureEndpoint(A)) return N33.Agent.prototype.getName.call(this, A);
            return super.getName(A)
        }
        createSocket(A, q, K) {
            let Y = {
                    ...q,
                    secureEndpoint: this.isSecureEndpoint(q)
                },
                z = this.getName(Y),
                w = this.incrementSockets(z);
            Promise.resolve().then(() => this.connect(A, Y)).then((H) => {
                if (this.decrementSockets(z, w), H instanceof GR8.Agent) try {
                    return H.addRequest(A, Y)
                } catch ($) {
                    return K($)
                }
                this[fb].currentSocket = H, super.createSocket(A, q, K)
            }, (H) => {
                this.decrementSockets(z, w), K(H)
            })
        }
        createConnection() {
            let A = this[fb].currentSocket;
            if (this[fb].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
            return A
        }
        get defaultPort() {
            return this[fb].defaultPort ?? (this.protocol === "https:" ? 443 : 80)
        }
        set defaultPort(A) {
            if (this[fb]) this[fb].defaultPort = A
        }
        get protocol() {
            return this[fb].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:")
        }
        set protocol(A) {
            if (this[fb]) this[fb].protocol = A
        }
    }
    xT.Agent = VR8
})
// @from(Ln 80191, Col 4)
NR8 = R((_$1) => {
    var T33 = _$1 && _$1.__importDefault || function(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    };
    Object.defineProperty(_$1, "__esModule", {
        value: !0
    });
    _$1.parseProxyResponse = void 0;
    var v33 = T33(L61()),
        E16 = (0, v33.default)("https-proxy-agent:parse-proxy-response");

    function E33(A) {
        return new Promise((q, K) => {
            let Y = 0,
                z = [];

            function w() {
                let J = A.read();
                if (J) _(J);
                else A.once("readable", w)
            }

            function H() {
                A.removeListener("end", $), A.removeListener("error", O), A.removeListener("readable", w)
            }

            function $() {
                H(), E16("onend"), K(Error("Proxy connection ended before receiving CONNECT response"))
            }

            function O(J) {
                H(), E16("onerror %o", J), K(J)
            }

            function _(J) {
                z.push(J), Y += J.length;
                let X = Buffer.concat(z, Y),
                    D = X.indexOf(`\r
\r
`);
                if (D === -1) {
                    E16("have not received end of HTTP headers yet..."), w();
                    return
                }
                let j = X.slice(0, D).toString("ascii").split(`\r
`),
                    M = j.shift();
                if (!M) return A.destroy(), K(Error("No header received from proxy CONNECT response"));
                let P = M.split(" "),
                    W = +P[1],
                    G = P.slice(2).join(" "),
                    f = {};
                for (let Z of j) {
                    if (!Z) continue;
                    let N = Z.indexOf(":");
                    if (N === -1) return A.destroy(), K(Error(`Invalid header from proxy CONNECT response: "${Z}"`));
                    let T = Z.slice(0, N).toLowerCase(),
                        k = Z.slice(N + 1).trimStart(),
                        y = f[T];
                    if (typeof y === "string") f[T] = [y, k];
                    else if (Array.isArray(y)) y.push(k);
                    else f[T] = k
                }
                E16("got proxy server response: %o %o", M, f), H(), q({
                    connect: {
                        statusCode: W,
                        statusText: G,
                        headers: f
                    },
                    buffered: X
                })
            }
            A.on("error", O), A.on("end", $), w()
        })
    }
    _$1.parseProxyResponse = E33
})
// @from(Ln 80270, Col 4)
Dk1 = R((xk) => {
    var k33 = xk && xk.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        L33 = xk && xk.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        kR8 = xk && xk.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) k33(q, A, K)
            }
            return L33(q, A), q
        },
        LR8 = xk && xk.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        };
    Object.defineProperty(xk, "__esModule", {
        value: !0
    });
    xk.HttpsProxyAgent = void 0;
    var k16 = kR8(h1("net")),
        TR8 = kR8(h1("tls")),
        R33 = LR8(h1("assert")),
        y33 = LR8(L61()),
        C33 = wn6(),
        S33 = h1("url"),
        h33 = NR8(),
        Xk1 = (0, y33.default)("https-proxy-agent"),
        vR8 = (A) => {
            if (A.servername === void 0 && A.host && !k16.isIP(A.host)) return {
                ...A,
                servername: A.host
            };
            return A
        };
    class Hn6 extends C33.Agent {
        constructor(A, q) {
            super(q);
            this.options = {
                path: void 0
            }, this.proxy = typeof A === "string" ? new S33.URL(A) : A, this.proxyHeaders = q?.headers ?? {}, Xk1("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
            let K = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
                Y = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
            this.connectOpts = {
                ALPNProtocols: ["http/1.1"],
                ...q ? ER8(q, "headers") : null,
                host: K,
                port: Y
            }
        }
        async connect(A, q) {
            let {
                proxy: K
            } = this;
            if (!q.host) throw TypeError('No "host" provided');
            let Y;
            if (K.protocol === "https:") Xk1("Creating `tls.Socket`: %o", this.connectOpts), Y = TR8.connect(vR8(this.connectOpts));
            else Xk1("Creating `net.Socket`: %o", this.connectOpts), Y = k16.connect(this.connectOpts);
            let z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
                    ...this.proxyHeaders
                },
                w = k16.isIPv6(q.host) ? `[${q.host}]` : q.host,
                H = `CONNECT ${w}:${q.port} HTTP/1.1\r
`;
            if (K.username || K.password) {
                let X = `${decodeURIComponent(K.username)}:${decodeURIComponent(K.password)}`;
                z["Proxy-Authorization"] = `Basic ${Buffer.from(X).toString("base64")}`
            }
            if (z.Host = `${w}:${q.port}`, !z["Proxy-Connection"]) z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
            for (let X of Object.keys(z)) H += `${X}: ${z[X]}\r
`;
            let $ = (0, h33.parseProxyResponse)(Y);
            Y.write(`${H}\r
`);
            let {
                connect: O,
                buffered: _
            } = await $;
            if (A.emit("proxyConnect", O), this.emit("proxyConnect", O, A), O.statusCode === 200) {
                if (A.once("socket", I33), q.secureEndpoint) return Xk1("Upgrading socket connection to TLS"), TR8.connect({
                    ...ER8(vR8(q), "host", "path", "port"),
                    socket: Y
                });
                return Y
            }
            Y.destroy();
            let J = new k16.Socket({
                writable: !1
            });
            return J.readable = !0, A.once("socket", (X) => {
                Xk1("Replaying proxy buffer for failed request"), (0, R33.default)(X.listenerCount("data") > 0), X.push(_), X.push(null)
            }), J
        }
    }
    Hn6.protocols = ["http", "https"];
    xk.HttpsProxyAgent = Hn6;

    function I33(A) {
        A.resume()
    }

    function ER8(A, ...q) {
        let K = {},
            Y;
        for (Y in A)
            if (!q.includes(Y)) K[Y] = A[Y];
        return K
    }
})
// @from(Ln 80400, Col 4)
h$ = R((L82, RR8) => {
    RR8.exports = {
        kClose: Symbol("close"),
        kDestroy: Symbol("destroy"),
        kDispatch: Symbol("dispatch"),
        kUrl: Symbol("url"),
        kWriting: Symbol("writing"),
        kResuming: Symbol("resuming"),
        kQueue: Symbol("queue"),
        kConnect: Symbol("connect"),
        kConnecting: Symbol("connecting"),
        kKeepAliveDefaultTimeout: Symbol("default keep alive timeout"),
        kKeepAliveMaxTimeout: Symbol("max keep alive timeout"),
        kKeepAliveTimeoutThreshold: Symbol("keep alive timeout threshold"),
        kKeepAliveTimeoutValue: Symbol("keep alive timeout"),
        kKeepAlive: Symbol("keep alive"),
        kHeadersTimeout: Symbol("headers timeout"),
        kBodyTimeout: Symbol("body timeout"),
        kServerName: Symbol("server name"),
        kLocalAddress: Symbol("local address"),
        kHost: Symbol("host"),
        kNoRef: Symbol("no ref"),
        kBodyUsed: Symbol("used"),
        kBody: Symbol("abstracted request body"),
        kRunning: Symbol("running"),
        kBlocking: Symbol("blocking"),
        kPending: Symbol("pending"),
        kSize: Symbol("size"),
        kBusy: Symbol("busy"),
        kQueued: Symbol("queued"),
        kFree: Symbol("free"),
        kConnected: Symbol("connected"),
        kClosed: Symbol("closed"),
        kNeedDrain: Symbol("need drain"),
        kReset: Symbol("reset"),
        kDestroyed: Symbol.for("nodejs.stream.destroyed"),
        kResume: Symbol("resume"),
        kOnError: Symbol("on error"),
        kMaxHeadersSize: Symbol("max headers size"),
        kRunningIdx: Symbol("running index"),
        kPendingIdx: Symbol("pending index"),
        kError: Symbol("error"),
        kClients: Symbol("clients"),
        kClient: Symbol("client"),
        kParser: Symbol("parser"),
        kOnDestroyed: Symbol("destroy callbacks"),
        kPipelining: Symbol("pipelining"),
        kSocket: Symbol("socket"),
        kHostHeader: Symbol("host header"),
        kConnector: Symbol("connector"),
        kStrictContentLength: Symbol("strict content length"),
        kMaxRedirections: Symbol("maxRedirections"),
        kMaxRequests: Symbol("maxRequestsPerClient"),
        kProxy: Symbol("proxy agent options"),
        kCounter: Symbol("socket request counter"),
        kInterceptors: Symbol("dispatch interceptors"),
        kMaxResponseSize: Symbol("max response size"),
        kHTTP2Session: Symbol("http2Session"),
        kHTTP2SessionState: Symbol("http2Session state"),
        kRetryHandlerDefaultRetry: Symbol("retry agent default retry"),
        kConstruct: Symbol("constructable"),
        kListeners: Symbol("listeners"),
        kHTTPContext: Symbol("http context"),
        kMaxConcurrentStreams: Symbol("max concurrent streams"),
        kNoProxyAgent: Symbol("no proxy agent"),
        kHttpProxyAgent: Symbol("http proxy agent"),
        kHttpsProxyAgent: Symbol("https proxy agent")
    }
})
// @from(Ln 80469, Col 4)
Lz = R((R82, oR8) => {
    class Z_ extends Error {
        constructor(A) {
            super(A);
            this.name = "UndiciError", this.code = "UND_ERR"
        }
    }
    class yR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "ConnectTimeoutError", this.message = A || "Connect Timeout Error", this.code = "UND_ERR_CONNECT_TIMEOUT"
        }
    }
    class CR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "HeadersTimeoutError", this.message = A || "Headers Timeout Error", this.code = "UND_ERR_HEADERS_TIMEOUT"
        }
    }
    class SR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "HeadersOverflowError", this.message = A || "Headers Overflow Error", this.code = "UND_ERR_HEADERS_OVERFLOW"
        }
    }
    class hR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "BodyTimeoutError", this.message = A || "Body Timeout Error", this.code = "UND_ERR_BODY_TIMEOUT"
        }
    }
    class IR8 extends Z_ {
        constructor(A, q, K, Y) {
            super(A);
            this.name = "ResponseStatusCodeError", this.message = A || "Response Status Code Error", this.code = "UND_ERR_RESPONSE_STATUS_CODE", this.body = Y, this.status = q, this.statusCode = q, this.headers = K
        }
    }
    class xR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "InvalidArgumentError", this.message = A || "Invalid Argument Error", this.code = "UND_ERR_INVALID_ARG"
        }
    }
    class bR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "InvalidReturnValueError", this.message = A || "Invalid Return Value Error", this.code = "UND_ERR_INVALID_RETURN_VALUE"
        }
    }
    class $n6 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "AbortError", this.message = A || "The operation was aborted"
        }
    }
    class uR8 extends $n6 {
        constructor(A) {
            super(A);
            this.name = "AbortError", this.message = A || "Request aborted", this.code = "UND_ERR_ABORTED"
        }
    }
    class BR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "InformationalError", this.message = A || "Request information", this.code = "UND_ERR_INFO"
        }
    }
    class mR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "RequestContentLengthMismatchError", this.message = A || "Request body length does not match content-length header", this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH"
        }
    }
    class FR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "ResponseContentLengthMismatchError", this.message = A || "Response body length does not match content-length header", this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH"
        }
    }
    class QR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "ClientDestroyedError", this.message = A || "The client is destroyed", this.code = "UND_ERR_DESTROYED"
        }
    }
    class gR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "ClientClosedError", this.message = A || "The client is closed", this.code = "UND_ERR_CLOSED"
        }
    }
    class UR8 extends Z_ {
        constructor(A, q) {
            super(A);
            this.name = "SocketError", this.message = A || "Socket error", this.code = "UND_ERR_SOCKET", this.socket = q
        }
    }
    class pR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "NotSupportedError", this.message = A || "Not supported error", this.code = "UND_ERR_NOT_SUPPORTED"
        }
    }
    class dR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "MissingUpstreamError", this.message = A || "No upstream has been added to the BalancedPool", this.code = "UND_ERR_BPL_MISSING_UPSTREAM"
        }
    }
    class cR8 extends Error {
        constructor(A, q, K) {
            super(A);
            this.name = "HTTPParserError", this.code = q ? `HPE_${q}` : void 0, this.data = K ? K.toString() : void 0
        }
    }
    class lR8 extends Z_ {
        constructor(A) {
            super(A);
            this.name = "ResponseExceededMaxSizeError", this.message = A || "Response content exceeded max size", this.code = "UND_ERR_RES_EXCEEDED_MAX_SIZE"
        }
    }
    class iR8 extends Z_ {
        constructor(A, q, {
            headers: K,
            data: Y
        }) {
            super(A);
            this.name = "RequestRetryError", this.message = A || "Request retry error", this.code = "UND_ERR_REQ_RETRY", this.statusCode = q, this.data = Y, this.headers = K
        }
    }
    class nR8 extends Z_ {
        constructor(A, q, {
            headers: K,
            data: Y
        }) {
            super(A);
            this.name = "ResponseError", this.message = A || "Response error", this.code = "UND_ERR_RESPONSE", this.statusCode = q, this.data = Y, this.headers = K
        }
    }
    class rR8 extends Z_ {
        constructor(A, q, K) {
            super(q, {
                cause: A,
                ...K ?? {}
            });
            this.name = "SecureProxyConnectionError", this.message = q || "Secure Proxy Connection failed", this.code = "UND_ERR_PRX_TLS", this.cause = A
        }
    }
    oR8.exports = {
        AbortError: $n6,
        HTTPParserError: cR8,
        UndiciError: Z_,
        HeadersTimeoutError: CR8,
        HeadersOverflowError: SR8,
        BodyTimeoutError: hR8,
        RequestContentLengthMismatchError: mR8,
        ConnectTimeoutError: yR8,
        ResponseStatusCodeError: IR8,
        InvalidArgumentError: xR8,
        InvalidReturnValueError: bR8,
        RequestAbortedError: uR8,
        ClientDestroyedError: QR8,
        ClientClosedError: gR8,
        InformationalError: BR8,
        SocketError: UR8,
        NotSupportedError: pR8,
        ResponseContentLengthMismatchError: FR8,
        BalancedPoolMissingUpstreamError: dR8,
        ResponseExceededMaxSizeError: lR8,
        RequestRetryError: iR8,
        ResponseError: nR8,
        SecureProxyConnectionError: rR8
    }
})
// @from(Ln 80643, Col 4)
R16 = R((y82, aR8) => {
    var L16 = {},
        On6 = ["Accept", "Accept-Encoding", "Accept-Language", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Disposition", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Downlink", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Last-Modified", "Link", "Location", "Max-Forwards", "Origin", "Permissions-Policy", "Pragma", "Proxy-Authenticate", "Proxy-Authorization", "RTT", "Range", "Referer", "Referrer-Policy", "Refresh", "Retry-After", "Sec-WebSocket-Accept", "Sec-WebSocket-Extensions", "Sec-WebSocket-Key", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version", "Server", "Server-Timing", "Service-Worker-Allowed", "Service-Worker-Navigation-Preload", "Set-Cookie", "SourceMap", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Frame-Options", "X-Permitted-Cross-Domain-Policies", "X-Powered-By", "X-Requested-With", "X-XSS-Protection"];
    for (let A = 0; A < On6.length; ++A) {
        let q = On6[A],
            K = q.toLowerCase();
        L16[q] = L16[K] = K
    }
    Object.setPrototypeOf(L16, null);
    aR8.exports = {
        wellknownHeaderNames: On6,
        headerNameLowerCasedRecord: L16
    }
})
// @from(Ln 80657, Col 4)
Ay8 = R((C82, eR8) => {
    var {
        wellknownHeaderNames: sR8,
        headerNameLowerCasedRecord: x33
    } = R16();
    class J$1 {
        value = null;
        left = null;
        middle = null;
        right = null;
        code;
        constructor(A, q, K) {
            if (K === void 0 || K >= A.length) throw TypeError("Unreachable");
            if ((this.code = A.charCodeAt(K)) > 127) throw TypeError("key must be ascii string");
            if (A.length !== ++K) this.middle = new J$1(A, q, K);
            else this.value = q
        }
        add(A, q) {
            let K = A.length;
            if (K === 0) throw TypeError("Unreachable");
            let Y = 0,
                z = this;
            while (!0) {
                let w = A.charCodeAt(Y);
                if (w > 127) throw TypeError("key must be ascii string");
                if (z.code === w)
                    if (K === ++Y) {
                        z.value = q;
                        break
                    } else if (z.middle !== null) z = z.middle;
                else {
                    z.middle = new J$1(A, q, Y);
                    break
                } else if (z.code < w)
                    if (z.left !== null) z = z.left;
                    else {
                        z.left = new J$1(A, q, Y);
                        break
                    }
                else if (z.right !== null) z = z.right;
                else {
                    z.right = new J$1(A, q, Y);
                    break
                }
            }
        }
        search(A) {
            let q = A.length,
                K = 0,
                Y = this;
            while (Y !== null && K < q) {
                let z = A[K];
                if (z <= 90 && z >= 65) z |= 32;
                while (Y !== null) {
                    if (z === Y.code) {
                        if (q === ++K) return Y;
                        Y = Y.middle;
                        break
                    }
                    Y = Y.code < z ? Y.left : Y.right
                }
            }
            return null
        }
    }
    class _n6 {
        node = null;
        insert(A, q) {
            if (this.node === null) this.node = new J$1(A, q, 0);
            else this.node.add(A, q)
        }
        lookup(A) {
            return this.node?.search(A)?.value ?? null
        }
    }
    var tR8 = new _n6;
    for (let A = 0; A < sR8.length; ++A) {
        let q = x33[sR8[A]];
        tR8.insert(q, q)
    }
    eR8.exports = {
        TernarySearchTree: _n6,
        tree: tR8
    }
})
// @from(Ln 80742, Col 4)
W9 = R((S82, Wy8) => {
    var jk1 = h1("node:assert"),
        {
            kDestroyed: Ky8,
            kBodyUsed: X$1,
            kListeners: Jn6,
            kBody: qy8
        } = h$(),
        {
            IncomingMessage: b33
        } = h1("node:http"),
        C16 = h1("node:stream"),
        u33 = h1("node:net"),
        {
            Blob: B33
        } = h1("node:buffer"),
        m33 = h1("node:util"),
        {
            stringify: F33
        } = h1("node:querystring"),
        {
            EventEmitter: Q33
        } = h1("node:events"),
        {
            InvalidArgumentError: L0
        } = Lz(),
        {
            headerNameLowerCasedRecord: g33
        } = R16(),
        {
            tree: Yy8
        } = Ay8(),
        [U33, p33] = process.versions.node.split(".").map((A) => Number(A));
    class Xn6 {
        constructor(A) {
            this[qy8] = A, this[X$1] = !1
        }
        async * [Symbol.asyncIterator]() {
            jk1(!this[X$1], "disturbed"), this[X$1] = !0, yield* this[qy8]
        }
    }

    function d33(A) {
        if (S16(A)) {
            if (Oy8(A) === 0) A.on("data", function() {
                jk1(!1)
            });
            if (typeof A.readableDidRead !== "boolean") A[X$1] = !1, Q33.prototype.on.call(A, "data", function() {
                this[X$1] = !0
            });
            return A
        } else if (A && typeof A.pipeTo === "function") return new Xn6(A);
        else if (A && typeof A !== "string" && !ArrayBuffer.isView(A) && $y8(A)) return new Xn6(A);
        else return A
    }

    function c33() {}

    function S16(A) {
        return A && typeof A === "object" && typeof A.pipe === "function" && typeof A.on === "function"
    }

    function zy8(A) {
        if (A === null) return !1;
        else if (A instanceof B33) return !0;
        else if (typeof A !== "object") return !1;
        else {
            let q = A[Symbol.toStringTag];
            return (q === "Blob" || q === "File") && (("stream" in A) && typeof A.stream === "function" || ("arrayBuffer" in A) && typeof A.arrayBuffer === "function")
        }
    }

    function l33(A, q) {
        if (A.includes("?") || A.includes("#")) throw Error('Query params cannot be passed when url already contains "?" or "#".');
        let K = F33(q);
        if (K) A += "?" + K;
        return A
    }

    function wy8(A) {
        let q = parseInt(A, 10);
        return q === Number(A) && q >= 0 && q <= 65535
    }

    function y16(A) {
        return A != null && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && (A[4] === ":" || A[4] === "s" && A[5] === ":")
    }

    function Hy8(A) {
        if (typeof A === "string") {
            if (A = new URL(A), !y16(A.origin || A.protocol)) throw new L0("Invalid URL protocol: the URL must start with `http:` or `https:`.");
            return A
        }
        if (!A || typeof A !== "object") throw new L0("Invalid URL: The URL argument must be a non-null object.");
        if (!(A instanceof URL)) {
            if (A.port != null && A.port !== "" && wy8(A.port) === !1) throw new L0("Invalid URL: port must be a valid integer or a string representation of an integer.");
            if (A.path != null && typeof A.path !== "string") throw new L0("Invalid URL path: the path must be a string or null/undefined.");
            if (A.pathname != null && typeof A.pathname !== "string") throw new L0("Invalid URL pathname: the pathname must be a string or null/undefined.");
            if (A.hostname != null && typeof A.hostname !== "string") throw new L0("Invalid URL hostname: the hostname must be a string or null/undefined.");
            if (A.origin != null && typeof A.origin !== "string") throw new L0("Invalid URL origin: the origin must be a string or null/undefined.");
            if (!y16(A.origin || A.protocol)) throw new L0("Invalid URL protocol: the URL must start with `http:` or `https:`.");
            let q = A.port != null ? A.port : A.protocol === "https:" ? 443 : 80,
                K = A.origin != null ? A.origin : `${A.protocol||""}//${A.hostname||""}:${q}`,
                Y = A.path != null ? A.path : `${A.pathname||""}${A.search||""}`;
            if (K[K.length - 1] === "/") K = K.slice(0, K.length - 1);
            if (Y && Y[0] !== "/") Y = `/${Y}`;
            return new URL(`${K}${Y}`)
        }
        if (!y16(A.origin || A.protocol)) throw new L0("Invalid URL protocol: the URL must start with `http:` or `https:`.");
        return A
    }

    function i33(A) {
        if (A = Hy8(A), A.pathname !== "/" || A.search || A.hash) throw new L0("invalid url");
        return A
    }

    function n33(A) {
        if (A[0] === "[") {
            let K = A.indexOf("]");
            return jk1(K !== -1), A.substring(1, K)
        }
        let q = A.indexOf(":");
        if (q === -1) return A;
        return A.substring(0, q)
    }

    function r33(A) {
        if (!A) return null;
        jk1(typeof A === "string");
        let q = n33(A);
        if (u33.isIP(q)) return "";
        return q
    }

    function o33(A) {
        return JSON.parse(JSON.stringify(A))
    }

    function a33(A) {
        return A != null && typeof A[Symbol.asyncIterator] === "function"
    }

    function $y8(A) {
        return A != null && (typeof A[Symbol.iterator] === "function" || typeof A[Symbol.asyncIterator] === "function")
    }

    function Oy8(A) {
        if (A == null) return 0;
        else if (S16(A)) {
            let q = A._readableState;
            return q && q.objectMode === !1 && q.ended === !0 && Number.isFinite(q.length) ? q.length : null
        } else if (zy8(A)) return A.size != null ? A.size : null;
        else if (Xy8(A)) return A.byteLength;
        return null
    }

    function _y8(A) {
        return A && !!(A.destroyed || A[Ky8] || C16.isDestroyed?.(A))
    }

    function s33(A, q) {
        if (A == null || !S16(A) || _y8(A)) return;
        if (typeof A.destroy === "function") {
            if (Object.getPrototypeOf(A).constructor === b33) A.socket = null;
            A.destroy(q)
        } else if (q) queueMicrotask(() => {
            A.emit("error", q)
        });
        if (A.destroyed !== !0) A[Ky8] = !0
    }
    var t33 = /timeout=(\d+)/;

    function e33(A) {
        let q = A.toString().match(t33);
        return q ? parseInt(q[1], 10) * 1000 : null
    }

    function Jy8(A) {
        return typeof A === "string" ? g33[A] ?? A.toLowerCase() : Yy8.lookup(A) ?? A.toString("latin1").toLowerCase()
    }

    function A53(A) {
        return Yy8.lookup(A) ?? A.toString("latin1").toLowerCase()
    }

    function q53(A, q) {
        if (q === void 0) q = {};
        for (let K = 0; K < A.length; K += 2) {
            let Y = Jy8(A[K]),
                z = q[Y];
            if (z) {
                if (typeof z === "string") z = [z], q[Y] = z;
                z.push(A[K + 1].toString("utf8"))
            } else {
                let w = A[K + 1];
                if (typeof w === "string") q[Y] = w;
                else q[Y] = Array.isArray(w) ? w.map((H) => H.toString("utf8")) : w.toString("utf8")
            }
        }
        if ("content-length" in q && "content-disposition" in q) q["content-disposition"] = Buffer.from(q["content-disposition"]).toString("latin1");
        return q
    }

    function K53(A) {
        let q = A.length,
            K = Array(q),
            Y = !1,
            z = -1,
            w, H, $ = 0;
        for (let O = 0; O < A.length; O += 2) {
            if (w = A[O], H = A[O + 1], typeof w !== "string" && (w = w.toString()), typeof H !== "string" && (H = H.toString("utf8")), $ = w.length, $ === 14 && w[7] === "-" && (w === "content-length" || w.toLowerCase() === "content-length")) Y = !0;
            else if ($ === 19 && w[7] === "-" && (w === "content-disposition" || w.toLowerCase() === "content-disposition")) z = O + 1;
            K[O] = w, K[O + 1] = H
        }
        if (Y && z !== -1) K[z] = Buffer.from(K[z]).toString("latin1");
        return K
    }

    function Xy8(A) {
        return A instanceof Uint8Array || Buffer.isBuffer(A)
    }

    function Y53(A, q, K) {
        if (!A || typeof A !== "object") throw new L0("handler must be an object");
        if (typeof A.onConnect !== "function") throw new L0("invalid onConnect method");
        if (typeof A.onError !== "function") throw new L0("invalid onError method");
        if (typeof A.onBodySent !== "function" && A.onBodySent !== void 0) throw new L0("invalid onBodySent method");
        if (K || q === "CONNECT") {
            if (typeof A.onUpgrade !== "function") throw new L0("invalid onUpgrade method")
        } else {
            if (typeof A.onHeaders !== "function") throw new L0("invalid onHeaders method");
            if (typeof A.onData !== "function") throw new L0("invalid onData method");
            if (typeof A.onComplete !== "function") throw new L0("invalid onComplete method")
        }
    }

    function z53(A) {
        return !!(A && (C16.isDisturbed(A) || A[X$1]))
    }

    function w53(A) {
        return !!(A && C16.isErrored(A))
    }

    function H53(A) {
        return !!(A && C16.isReadable(A))
    }

    function $53(A) {
        return {
            localAddress: A.localAddress,
            localPort: A.localPort,
            remoteAddress: A.remoteAddress,
            remotePort: A.remotePort,
            remoteFamily: A.remoteFamily,
            timeout: A.timeout,
            bytesWritten: A.bytesWritten,
            bytesRead: A.bytesRead
        }
    }

    function O53(A) {
        let q;
        return new ReadableStream({
            async start() {
                q = A[Symbol.asyncIterator]()
            },
            async pull(K) {
                let {
                    done: Y,
                    value: z
                } = await q.next();
                if (Y) queueMicrotask(() => {
                    K.close(), K.byobRequest?.respond(0)
                });
                else {
                    let w = Buffer.isBuffer(z) ? z : Buffer.from(z);
                    if (w.byteLength) K.enqueue(new Uint8Array(w))
                }
                return K.desiredSize > 0
            },
            async cancel(K) {
                await q.return()
            },
            type: "bytes"
        })
    }

    function _53(A) {
        return A && typeof A === "object" && typeof A.append === "function" && typeof A.delete === "function" && typeof A.get === "function" && typeof A.getAll === "function" && typeof A.has === "function" && typeof A.set === "function" && A[Symbol.toStringTag] === "FormData"
    }

    function J53(A, q) {
        if ("addEventListener" in A) return A.addEventListener("abort", q, {
            once: !0
        }), () => A.removeEventListener("abort", q);
        return A.addListener("abort", q), () => A.removeListener("abort", q)
    }
    var X53 = typeof String.prototype.toWellFormed === "function",
        D53 = typeof String.prototype.isWellFormed === "function";

    function Dy8(A) {
        return X53 ? `${A}`.toWellFormed() : m33.toUSVString(A)
    }

    function j53(A) {
        return D53 ? `${A}`.isWellFormed() : Dy8(A) === `${A}`
    }

    function jy8(A) {
        switch (A) {
            case 34:
            case 40:
            case 41:
            case 44:
            case 47:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 64:
            case 91:
            case 92:
            case 93:
            case 123:
            case 125:
                return !1;
            default:
                return A >= 33 && A <= 126
        }
    }

    function M53(A) {
        if (A.length === 0) return !1;
        for (let q = 0; q < A.length; ++q)
            if (!jy8(A.charCodeAt(q))) return !1;
        return !0
    }
    var P53 = /[^\t\x20-\x7e\x80-\xff]/;

    function W53(A) {
        return !P53.test(A)
    }

    function G53(A) {
        if (A == null || A === "") return {
            start: 0,
            end: null,
            size: null
        };
        let q = A ? A.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null;
        return q ? {
            start: parseInt(q[1]),
            end: q[2] ? parseInt(q[2]) : null,
            size: q[3] ? parseInt(q[3]) : null
        } : null
    }

    function Z53(A, q, K) {
        return (A[Jn6] ??= []).push([q, K]), A.on(q, K), A
    }

    function f53(A) {
        for (let [q, K] of A[Jn6] ?? []) A.removeListener(q, K);
        A[Jn6] = null
    }

    function V53(A, q, K) {
        try {
            q.onError(K), jk1(q.aborted)
        } catch (Y) {
            A.emit("error", Y)
        }
    }
    var My8 = Object.create(null);
    My8.enumerable = !0;
    var Dn6 = {
            delete: "DELETE",
            DELETE: "DELETE",
            get: "GET",
            GET: "GET",
            head: "HEAD",
            HEAD: "HEAD",
            options: "OPTIONS",
            OPTIONS: "OPTIONS",
            post: "POST",
            POST: "POST",
            put: "PUT",
            PUT: "PUT"
        },
        Py8 = {
            ...Dn6,
            patch: "patch",
            PATCH: "PATCH"
        };
    Object.setPrototypeOf(Dn6, null);
    Object.setPrototypeOf(Py8, null);
    Wy8.exports = {
        kEnumerableProperty: My8,
        nop: c33,
        isDisturbed: z53,
        isErrored: w53,
        isReadable: H53,
        toUSVString: Dy8,
        isUSVString: j53,
        isBlobLike: zy8,
        parseOrigin: i33,
        parseURL: Hy8,
        getServerName: r33,
        isStream: S16,
        isIterable: $y8,
        isAsyncIterable: a33,
        isDestroyed: _y8,
        headerNameToString: Jy8,
        bufferToLowerCasedHeaderName: A53,
        addListener: Z53,
        removeAllListeners: f53,
        errorRequest: V53,
        parseRawHeaders: K53,
        parseHeaders: q53,
        parseKeepAliveTimeout: e33,
        destroy: s33,
        bodyLength: Oy8,
        deepClone: o33,
        ReadableStreamFrom: O53,
        isBuffer: Xy8,
        validateHandler: Y53,
        getSocketInfo: $53,
        isFormDataLike: _53,
        buildURL: l33,
        addAbortListener: J53,
        isValidHTTPToken: M53,
        isValidHeaderValue: W53,
        isTokenCharCode: jy8,
        parseRangeHeader: G53,
        normalizedMethodRecordsBase: Dn6,
        normalizedMethodRecords: Py8,
        isValidPort: wy8,
        isHttpOrHttpsPrefixed: y16,
        nodeMajor: U33,
        nodeMinor: p33,
        safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
        wrapRequestBody: d33
    }
})