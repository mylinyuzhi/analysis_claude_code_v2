
// @from(Ln 76432, Col 4)
mv8 = R((uv8) => {
    Object.defineProperty(uv8, "__esModule", {
        value: !0
    });
    uv8.resolveHttpAuthRuntimeConfig = uv8.getHttpAuthExtensionConfiguration = void 0;
    var daK = (A) => {
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
    };
    uv8.getHttpAuthExtensionConfiguration = daK;
    var caK = (A) => {
        return {
            httpAuthSchemes: A.httpAuthSchemes(),
            httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
            credentials: A.credentials()
        }
    };
    uv8.resolveHttpAuthRuntimeConfig = caK
})
// @from(Ln 76476, Col 4)
cv8 = R((pv8) => {
    Object.defineProperty(pv8, "__esModule", {
        value: !0
    });
    pv8.resolveRuntimeExtensions = void 0;
    var Fv8 = fC(),
        Qv8 = bv8(),
        gv8 = fA1(),
        Uv8 = mv8(),
        iaK = (A, q) => {
            let K = Object.assign((0, Fv8.getAwsRegionExtensionConfiguration)(A), (0, gv8.getDefaultExtensionConfiguration)(A), (0, Qv8.getHttpHandlerExtensionConfiguration)(A), (0, Uv8.getHttpAuthExtensionConfiguration)(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, (0, Fv8.resolveAwsRegionExtensionConfiguration)(K), (0, gv8.resolveDefaultRuntimeConfig)(K), (0, Qv8.resolveHttpHandlerRuntimeConfig)(K), (0, Uv8.resolveHttpAuthRuntimeConfig)(K))
        };
    pv8.resolveRuntimeExtensions = iaK
})
// @from(Ln 76491, Col 4)
Ad6 = R((Fl6) => {
    Object.defineProperty(Fl6, "__esModule", {
        value: !0
    });
    Fl6.STSClient = Fl6.__Client = void 0;
    var lv8 = BQ(),
        naK = mQ(),
        raK = FQ(),
        iv8 = $b(),
        oaK = YJ(),
        ml6 = lz(),
        aaK = R$(),
        saK = rQ(),
        taK = ZC(),
        nv8 = qM(),
        ov8 = fA1();
    Object.defineProperty(Fl6, "__Client", {
        enumerable: !0,
        get: function() {
            return ov8.Client
        }
    });
    var rv8 = ep6(),
        eaK = qd6(),
        AsK = Sv8(),
        qsK = cv8();
    class av8 extends ov8.Client {
        config;
        constructor(...[A]) {
            let q = (0, AsK.getRuntimeConfig)(A || {});
            super(q);
            this.initConfig = q;
            let K = (0, eaK.resolveClientEndpointParameters)(q),
                Y = (0, iv8.resolveUserAgentConfig)(K),
                z = (0, nv8.resolveRetryConfig)(Y),
                w = (0, oaK.resolveRegionConfig)(z),
                H = (0, lv8.resolveHostHeaderConfig)(w),
                $ = (0, taK.resolveEndpointConfig)(H),
                O = (0, rv8.resolveHttpAuthSchemeConfig)($),
                _ = (0, qsK.resolveRuntimeExtensions)(O, A?.extensions || []);
            this.config = _, this.middlewareStack.use((0, aaK.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, iv8.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, nv8.getRetryPlugin)(this.config)), this.middlewareStack.use((0, saK.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, lv8.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, naK.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, raK.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, ml6.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
                httpAuthSchemeParametersProvider: rv8.defaultSTSHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (J) => new ml6.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": J.credentials
                })
            })), this.middlewareStack.use((0, ml6.getHttpSigningPlugin)(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    Fl6.STSClient = av8
})
// @from(Ln 76544, Col 4)
LE8 = R((K16) => {
    var qk1 = Ad6(),
        sf = fA1(),
        kC = ZC(),
        LC = qd6(),
        ST = R$(),
        Ql6 = of(),
        KsK = fC(),
        tf = class A extends sf.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        tv8 = class A extends tf {
            name = "ExpiredTokenException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ExpiredTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        ev8 = class A extends tf {
            name = "MalformedPolicyDocumentException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "MalformedPolicyDocumentException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        AE8 = class A extends tf {
            name = "PackedPolicyTooLargeException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "PackedPolicyTooLargeException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        qE8 = class A extends tf {
            name = "RegionDisabledException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "RegionDisabledException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        KE8 = class A extends tf {
            name = "IDPRejectedClaimException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "IDPRejectedClaimException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        YE8 = class A extends tf {
            name = "InvalidIdentityTokenException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidIdentityTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        zE8 = class A extends tf {
            name = "IDPCommunicationErrorException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "IDPCommunicationErrorException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        wE8 = class A extends tf {
            name = "InvalidAuthorizationMessageException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidAuthorizationMessageException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        HE8 = class A extends tf {
            name = "ExpiredTradeInTokenException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ExpiredTradeInTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        $E8 = class A extends tf {
            name = "JWTPayloadSizeExceededException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "JWTPayloadSizeExceededException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        OE8 = class A extends tf {
            name = "OutboundWebIdentityFederationDisabledException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "OutboundWebIdentityFederationDisabledException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        _E8 = class A extends tf {
            name = "SessionDurationEscalationException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "SessionDurationEscalationException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        gl6 = "Arn",
        JE8 = "AccessKeyId",
        YsK = "AssumedPrincipal",
        zsK = "AssumeRole",
        wsK = "AssumedRoleId",
        HsK = "AssumeRoleRequest",
        $sK = "AssumeRoleResponse",
        OsK = "AssumeRootRequest",
        _sK = "AssumeRootResponse",
        Y16 = "AssumedRoleUser",
        JsK = "AssumeRoleWithSAML",
        XsK = "AssumeRoleWithSAMLRequest",
        DsK = "AssumeRoleWithSAMLResponse",
        jsK = "AssumeRoleWithWebIdentity",
        MsK = "AssumeRoleWithWebIdentityRequest",
        PsK = "AssumeRoleWithWebIdentityResponse",
        WsK = "AssumeRoot",
        XE8 = "Account",
        Ul6 = "Audience",
        si = "Credentials",
        GsK = "ContextAssertion",
        ZsK = "DecodeAuthorizationMessage",
        fsK = "DecodeAuthorizationMessageRequest",
        VsK = "DecodeAuthorizationMessageResponse",
        NsK = "DecodedMessage",
        uA1 = "DurationSeconds",
        DE8 = "Expiration",
        TsK = "ExternalId",
        vsK = "EncodedMessage",
        EsK = "ExpiredTokenException",
        ksK = "ExpiredTradeInTokenException",
        jE8 = "FederatedUser",
        LsK = "FederatedUserId",
        RsK = "GetAccessKeyInfo",
        ysK = "GetAccessKeyInfoRequest",
        CsK = "GetAccessKeyInfoResponse",
        SsK = "GetCallerIdentity",
        hsK = "GetCallerIdentityRequest",
        IsK = "GetCallerIdentityResponse",
        xsK = "GetDelegatedAccessToken",
        bsK = "GetDelegatedAccessTokenRequest",
        usK = "GetDelegatedAccessTokenResponse",
        BsK = "GetFederationToken",
        msK = "GetFederationTokenRequest",
        FsK = "GetFederationTokenResponse",
        QsK = "GetSessionToken",
        gsK = "GetSessionTokenRequest",
        UsK = "GetSessionTokenResponse",
        psK = "GetWebIdentityToken",
        dsK = "GetWebIdentityTokenRequest",
        csK = "GetWebIdentityTokenResponse",
        lsK = "Issuer",
        isK = "InvalidAuthorizationMessageException",
        nsK = "IDPCommunicationErrorException",
        rsK = "IDPRejectedClaimException",
        osK = "InvalidIdentityTokenException",
        asK = "JWTPayloadSizeExceededException",
        ssK = "Key",
        tsK = "MalformedPolicyDocumentException",
        esK = "Name",
        AtK = "NameQualifier",
        qtK = "OutboundWebIdentityFederationDisabledException",
        z16 = "Policy",
        w16 = "PolicyArns",
        KtK = "PrincipalArn",
        YtK = "ProviderArn",
        ztK = "ProvidedContexts",
        wtK = "ProvidedContextsListType",
        HtK = "ProvidedContext",
        $tK = "PolicyDescriptorType",
        OtK = "ProviderId",
        Kk1 = "PackedPolicySize",
        _tK = "PackedPolicyTooLargeException",
        JtK = "Provider",
        pl6 = "RoleArn",
        XtK = "RegionDisabledException",
        ME8 = "RoleSessionName",
        DtK = "Subject",
        jtK = "SigningAlgorithm",
        MtK = "SecretAccessKey",
        PtK = "SAMLAssertion",
        WtK = "SAMLAssertionType",
        GtK = "SessionDurationEscalationException",
        ZtK = "SubjectFromWebIdentityToken",
        Yk1 = "SourceIdentity",
        PE8 = "SerialNumber",
        ftK = "SubjectType",
        VtK = "SessionToken",
        dl6 = "Tags",
        WE8 = "TokenCode",
        NtK = "TradeInToken",
        TtK = "TargetPrincipal",
        vtK = "TaskPolicyArn",
        EtK = "TransitiveTagKeys",
        ktK = "Tag",
        LtK = "UserId",
        RtK = "Value",
        GE8 = "WebIdentityToken",
        ytK = "arn",
        CtK = "accessKeySecretType",
        yk = "awsQueryError",
        Ck = "client",
        StK = "clientTokenType",
        Sk = "error",
        hk = "httpError",
        Ik = "message",
        htK = "policyDescriptorListType",
        ZE8 = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
        ItK = "tradeInTokenType",
        xtK = "tagListType",
        btK = "webIdentityTokenType",
        Z4 = "com.amazonaws.sts",
        utK = [0, Z4, CtK, 8, 0],
        BtK = [0, Z4, StK, 8, 0],
        mtK = [0, Z4, WtK, 8, 0],
        FtK = [0, Z4, ItK, 8, 0],
        QtK = [0, Z4, btK, 8, 0],
        cl6 = [3, Z4, Y16, 0, [wsK, gl6],
            [0, 0]
        ],
        gtK = [3, Z4, HsK, 0, [pl6, ME8, w16, z16, uA1, dl6, EtK, TsK, PE8, WE8, Yk1, ztK],
            [0, 0, () => H16, 0, 1, () => ll6, 64, 0, 0, 0, 0, () => EeK]
        ],
        UtK = [3, Z4, $sK, 0, [si, Y16, Kk1, Yk1],
            [
                [() => BA1, 0], () => cl6, 1, 0
            ]
        ],
        ptK = [3, Z4, XsK, 0, [pl6, KtK, PtK, w16, z16, uA1],
            [0, 0, [() => mtK, 0], () => H16, 0, 1]
        ],
        dtK = [3, Z4, DsK, 0, [si, Y16, Kk1, DtK, ftK, lsK, Ul6, AtK, Yk1],
            [
                [() => BA1, 0], () => cl6, 1, 0, 0, 0, 0, 0, 0
            ]
        ],
        ctK = [3, Z4, MsK, 0, [pl6, ME8, GE8, OtK, w16, z16, uA1],
            [0, 0, [() => BtK, 0], 0, () => H16, 0, 1]
        ],
        ltK = [3, Z4, PsK, 0, [si, ZtK, Y16, Kk1, JtK, Ul6, Yk1],
            [
                [() => BA1, 0], 0, () => cl6, 1, 0, 0, 0
            ]
        ],
        itK = [3, Z4, OsK, 0, [TtK, vtK, uA1],
            [0, () => fE8, 1]
        ],
        ntK = [3, Z4, _sK, 0, [si, Yk1],
            [
                [() => BA1, 0], 0
            ]
        ],
        BA1 = [3, Z4, si, 0, [JE8, MtK, VtK, DE8],
            [0, [() => utK, 0], 0, 4]
        ],
        rtK = [3, Z4, fsK, 0, [vsK],
            [0]
        ],
        otK = [3, Z4, VsK, 0, [NsK],
            [0]
        ],
        atK = [-3, Z4, EsK, {
                [Sk]: Ck,
                [hk]: 400,
                [yk]: ["ExpiredTokenException", 400]
            },
            [Ik],
            [0]
        ];
    ST.TypeRegistry.for(Z4).registerError(atK, tv8);
    var stK = [-3, Z4, ksK, {
            [Sk]: Ck,
            [hk]: 400,
            [yk]: ["ExpiredTradeInTokenException", 400]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(stK, HE8);
    var ttK = [3, Z4, jE8, 0, [LsK, gl6],
            [0, 0]
        ],
        etK = [3, Z4, ysK, 0, [JE8],
            [0]
        ],
        AeK = [3, Z4, CsK, 0, [XE8],
            [0]
        ],
        qeK = [3, Z4, hsK, 0, [],
            []
        ],
        KeK = [3, Z4, IsK, 0, [LtK, XE8, gl6],
            [0, 0, 0]
        ],
        YeK = [3, Z4, bsK, 0, [NtK],
            [
                [() => FtK, 0]
            ]
        ],
        zeK = [3, Z4, usK, 0, [si, Kk1, YsK],
            [
                [() => BA1, 0], 1, 0
            ]
        ],
        weK = [3, Z4, msK, 0, [esK, z16, w16, uA1, dl6],
            [0, 0, () => H16, 1, () => ll6]
        ],
        HeK = [3, Z4, FsK, 0, [si, jE8, Kk1],
            [
                [() => BA1, 0], () => ttK, 1
            ]
        ],
        $eK = [3, Z4, gsK, 0, [uA1, PE8, WE8],
            [1, 0, 0]
        ],
        OeK = [3, Z4, UsK, 0, [si],
            [
                [() => BA1, 0]
            ]
        ],
        _eK = [3, Z4, dsK, 0, [Ul6, uA1, jtK, dl6],
            [64, 1, 0, () => ll6]
        ],
        JeK = [3, Z4, csK, 0, [GE8, DE8],
            [
                [() => QtK, 0], 4
            ]
        ],
        XeK = [-3, Z4, nsK, {
                [Sk]: Ck,
                [hk]: 400,
                [yk]: ["IDPCommunicationError", 400]
            },
            [Ik],
            [0]
        ];
    ST.TypeRegistry.for(Z4).registerError(XeK, zE8);
    var DeK = [-3, Z4, rsK, {
            [Sk]: Ck,
            [hk]: 403,
            [yk]: ["IDPRejectedClaim", 403]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(DeK, KE8);
    var jeK = [-3, Z4, isK, {
            [Sk]: Ck,
            [hk]: 400,
            [yk]: ["InvalidAuthorizationMessageException", 400]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(jeK, wE8);
    var MeK = [-3, Z4, osK, {
            [Sk]: Ck,
            [hk]: 400,
            [yk]: ["InvalidIdentityToken", 400]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(MeK, YE8);
    var PeK = [-3, Z4, asK, {
            [Sk]: Ck,
            [hk]: 400,
            [yk]: ["JWTPayloadSizeExceededException", 400]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(PeK, $E8);
    var WeK = [-3, Z4, tsK, {
            [Sk]: Ck,
            [hk]: 400,
            [yk]: ["MalformedPolicyDocument", 400]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(WeK, ev8);
    var GeK = [-3, Z4, qtK, {
            [Sk]: Ck,
            [hk]: 403,
            [yk]: ["OutboundWebIdentityFederationDisabledException", 403]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(GeK, OE8);
    var ZeK = [-3, Z4, _tK, {
            [Sk]: Ck,
            [hk]: 400,
            [yk]: ["PackedPolicyTooLarge", 400]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(ZeK, AE8);
    var fE8 = [3, Z4, $tK, 0, [ytK],
            [0]
        ],
        feK = [3, Z4, HtK, 0, [YtK, GsK],
            [0, 0]
        ],
        VeK = [-3, Z4, XtK, {
                [Sk]: Ck,
                [hk]: 403,
                [yk]: ["RegionDisabledException", 403]
            },
            [Ik],
            [0]
        ];
    ST.TypeRegistry.for(Z4).registerError(VeK, qE8);
    var NeK = [-3, Z4, GtK, {
            [Sk]: Ck,
            [hk]: 403,
            [yk]: ["SessionDurationEscalationException", 403]
        },
        [Ik],
        [0]
    ];
    ST.TypeRegistry.for(Z4).registerError(NeK, _E8);
    var TeK = [3, Z4, ktK, 0, [ssK, RtK],
            [0, 0]
        ],
        veK = [-3, ZE8, "STSServiceException", 0, [],
            []
        ];
    ST.TypeRegistry.for(ZE8).registerError(veK, tf);
    var H16 = [1, Z4, htK, 0, () => fE8],
        EeK = [1, Z4, wtK, 0, () => feK],
        ll6 = [1, Z4, xtK, 0, () => TeK],
        keK = [9, Z4, zsK, 0, () => gtK, () => UtK],
        LeK = [9, Z4, JsK, 0, () => ptK, () => dtK],
        ReK = [9, Z4, jsK, 0, () => ctK, () => ltK],
        yeK = [9, Z4, WsK, 0, () => itK, () => ntK],
        CeK = [9, Z4, ZsK, 0, () => rtK, () => otK],
        SeK = [9, Z4, RsK, 0, () => etK, () => AeK],
        heK = [9, Z4, SsK, 0, () => qeK, () => KeK],
        IeK = [9, Z4, xsK, 0, () => YeK, () => zeK],
        xeK = [9, Z4, BsK, 0, () => weK, () => HeK],
        beK = [9, Z4, QsK, 0, () => $eK, () => OeK],
        ueK = [9, Z4, psK, 0, () => _eK, () => JeK];
    class $16 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(keK).build() {}
    class il6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithSAML", {}).n("STSClient", "AssumeRoleWithSAMLCommand").sc(LeK).build() {}
    class O16 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(ReK).build() {}
    class nl6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoot", {}).n("STSClient", "AssumeRootCommand").sc(yeK).build() {}
    class rl6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "DecodeAuthorizationMessage", {}).n("STSClient", "DecodeAuthorizationMessageCommand").sc(CeK).build() {}
    class ol6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetAccessKeyInfo", {}).n("STSClient", "GetAccessKeyInfoCommand").sc(SeK).build() {}
    class al6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetCallerIdentity", {}).n("STSClient", "GetCallerIdentityCommand").sc(heK).build() {}
    class sl6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetDelegatedAccessToken", {}).n("STSClient", "GetDelegatedAccessTokenCommand").sc(IeK).build() {}
    class tl6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetFederationToken", {}).n("STSClient", "GetFederationTokenCommand").sc(xeK).build() {}
    class el6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetSessionToken", {}).n("STSClient", "GetSessionTokenCommand").sc(beK).build() {}
    class Ai6 extends sf.Command.classBuilder().ep(LC.commonParams).m(function(A, q, K, Y) {
        return [kC.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetWebIdentityToken", {}).n("STSClient", "GetWebIdentityTokenCommand").sc(ueK).build() {}
    var BeK = {
        AssumeRoleCommand: $16,
        AssumeRoleWithSAMLCommand: il6,
        AssumeRoleWithWebIdentityCommand: O16,
        AssumeRootCommand: nl6,
        DecodeAuthorizationMessageCommand: rl6,
        GetAccessKeyInfoCommand: ol6,
        GetCallerIdentityCommand: al6,
        GetDelegatedAccessTokenCommand: sl6,
        GetFederationTokenCommand: tl6,
        GetSessionTokenCommand: el6,
        GetWebIdentityTokenCommand: Ai6
    };
    class qi6 extends qk1.STSClient {}
    sf.createAggregatedClient(BeK, qi6);
    var VE8 = (A) => {
            if (typeof A?.Arn === "string") {
                let q = A.Arn.split(":");
                if (q.length > 4 && q[4] !== "") return q[4]
            }
            return
        },
        NE8 = async (A, q, K, Y = {}) => {
            let z = typeof A === "function" ? await A() : A,
                w = typeof q === "function" ? await q() : q,
                H = await KsK.stsRegionDefaultResolver(Y)();
            return K?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${z} (credential provider clientConfig)`, `${w} (contextual client)`, `${H} (STS default: AWS_REGION, profile region, or us-east-1)`), z ?? w ?? H
        }, meK = (A, q) => {
            let K, Y;
            return async (z, w) => {
                if (Y = z, !K) {
                    let {
                        logger: J = A?.parentClientConfig?.logger,
                        profile: X = A?.parentClientConfig?.profile,
                        region: D,
                        requestHandler: j = A?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: M,
                        userAgentAppId: P = A?.parentClientConfig?.userAgentAppId
                    } = A, W = await NE8(D, A?.parentClientConfig?.region, M, {
                        logger: J,
                        profile: X
                    }), G = !TE8(j);
                    K = new q({
                        ...A,
                        userAgentAppId: P,
                        profile: X,
                        credentialDefaultProvider: () => async () => Y,
                        region: W,
                        requestHandler: G ? j : void 0,
                        logger: J
                    })
                }
                let {
                    Credentials: H,
                    AssumedRoleUser: $
                } = await K.send(new $16(w));
                if (!H || !H.AccessKeyId || !H.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${w.RoleArn}`);
                let O = VE8($),
                    _ = {
                        accessKeyId: H.AccessKeyId,
                        secretAccessKey: H.SecretAccessKey,
                        sessionToken: H.SessionToken,
                        expiration: H.Expiration,
                        ...H.CredentialScope && {
                            credentialScope: H.CredentialScope
                        },
                        ...O && {
                            accountId: O
                        }
                    };
                return Ql6.setCredentialFeature(_, "CREDENTIALS_STS_ASSUME_ROLE", "i"), _
            }
        }, FeK = (A, q) => {
            let K;
            return async (Y) => {
                if (!K) {
                    let {
                        logger: O = A?.parentClientConfig?.logger,
                        profile: _ = A?.parentClientConfig?.profile,
                        region: J,
                        requestHandler: X = A?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: D,
                        userAgentAppId: j = A?.parentClientConfig?.userAgentAppId
                    } = A, M = await NE8(J, A?.parentClientConfig?.region, D, {
                        logger: O,
                        profile: _
                    }), P = !TE8(X);
                    K = new q({
                        ...A,
                        userAgentAppId: j,
                        profile: _,
                        region: M,
                        requestHandler: P ? X : void 0,
                        logger: O
                    })
                }
                let {
                    Credentials: z,
                    AssumedRoleUser: w
                } = await K.send(new O16(Y));
                if (!z || !z.AccessKeyId || !z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${Y.RoleArn}`);
                let H = VE8(w),
                    $ = {
                        accessKeyId: z.AccessKeyId,
                        secretAccessKey: z.SecretAccessKey,
                        sessionToken: z.SessionToken,
                        expiration: z.Expiration,
                        ...z.CredentialScope && {
                            credentialScope: z.CredentialScope
                        },
                        ...H && {
                            accountId: H
                        }
                    };
                if (H) Ql6.setCredentialFeature($, "RESOLVED_ACCOUNT_ID", "T");
                return Ql6.setCredentialFeature($, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), $
            }
        }, TE8 = (A) => {
            return A?.metadata?.handlerProtocol === "h2"
        }, vE8 = (A, q) => {
            if (!q) return A;
            else return class extends A {
                constructor(Y) {
                    super(Y);
                    for (let z of q) this.middlewareStack.use(z)
                }
            }
        }, EE8 = (A = {}, q) => meK(A, vE8(qk1.STSClient, q)), kE8 = (A = {}, q) => FeK(A, vE8(qk1.STSClient, q)), QeK = (A) => (q) => A({
            roleAssumer: EE8(q),
            roleAssumerWithWebIdentity: kE8(q),
            ...q
        });
    Object.defineProperty(K16, "$Command", {
        enumerable: !0,
        get: function() {
            return sf.Command
        }
    });
    K16.AssumeRoleCommand = $16;
    K16.AssumeRoleWithSAMLCommand = il6;
    K16.AssumeRoleWithWebIdentityCommand = O16;
    K16.AssumeRootCommand = nl6;
    K16.DecodeAuthorizationMessageCommand = rl6;
    K16.ExpiredTokenException = tv8;
    K16.ExpiredTradeInTokenException = HE8;
    K16.GetAccessKeyInfoCommand = ol6;
    K16.GetCallerIdentityCommand = al6;
    K16.GetDelegatedAccessTokenCommand = sl6;
    K16.GetFederationTokenCommand = tl6;
    K16.GetSessionTokenCommand = el6;
    K16.GetWebIdentityTokenCommand = Ai6;
    K16.IDPCommunicationErrorException = zE8;
    K16.IDPRejectedClaimException = KE8;
    K16.InvalidAuthorizationMessageException = wE8;
    K16.InvalidIdentityTokenException = YE8;
    K16.JWTPayloadSizeExceededException = $E8;
    K16.MalformedPolicyDocumentException = ev8;
    K16.OutboundWebIdentityFederationDisabledException = OE8;
    K16.PackedPolicyTooLargeException = AE8;
    K16.RegionDisabledException = qE8;
    K16.STS = qi6;
    K16.STSServiceException = tf;
    K16.SessionDurationEscalationException = _E8;
    K16.decorateDefaultCredentialProvider = QeK;
    K16.getDefaultRoleAssumer = EE8;
    K16.getDefaultRoleAssumerWithWebIdentity = kE8;
    Object.keys(qk1).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(K16, A)) Object.defineProperty(K16, A, {
            enumerable: !0,
            get: function() {
                return qk1[A]
            }
        })
    })
})
// @from(Ln 77255, Col 4)
yE8 = R((RE8) => {
    Object.defineProperty(RE8, "__esModule", {
        value: !0
    });
    RE8.propertyProviderChain = RE8.createCredentialChain = void 0;
    var M13 = wX(),
        P13 = (...A) => {
            let q = -1,
                Y = Object.assign(async (z) => {
                    let w = await RE8.propertyProviderChain(...A)(z);
                    if (!w.expiration && q !== -1) w.expiration = new Date(Date.now() + q);
                    return w
                }, {
                    expireAfter(z) {
                        if (z < 300000) throw Error("@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.");
                        return q = z, Y
                    }
                });
            return Y
        };
    RE8.createCredentialChain = P13;
    var W13 = (...A) => async (q) => {
        if (A.length === 0) throw new M13.ProviderError("No providers in chain", {
            tryNextLink: !1
        });
        let K;
        for (let Y of A) try {
            return await Y(q)
        } catch (z) {
            if (K = z, z?.tryNextLink) continue;
            throw z
        }
        throw K
    };
    RE8.propertyProviderChain = W13
})
// @from(Ln 77291, Col 4)
_i6 = R((v13) => {
    v13.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(v13.HttpAuthLocation || (v13.HttpAuthLocation = {}));
    v13.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(v13.HttpApiKeyAuthLocation || (v13.HttpApiKeyAuthLocation = {}));
    v13.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(v13.EndpointURLScheme || (v13.EndpointURLScheme = {}));
    v13.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(v13.AlgorithmId || (v13.AlgorithmId = {}));
    var Z13 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => v13.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => v13.AlgorithmId.MD5,
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
        f13 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        V13 = (A) => {
            return Z13(A)
        },
        N13 = (A) => {
            return f13(A)
        };
    v13.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(v13.FieldPosition || (v13.FieldPosition = {}));
    var T13 = "__smithy_context";
    v13.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(v13.IniSectionType || (v13.IniSectionType = {}));
    v13.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(v13.RequestHandlerProtocol || (v13.RequestHandlerProtocol = {}));
    v13.SMITHY_CONTEXT_KEY = T13;
    v13.getDefaultClientConfiguration = V13;
    v13.resolveDefaultRuntimeConfig = N13
})
// @from(Ln 77356, Col 4)
wk1 = R((z$1) => {
    var hE8 = wb(),
        Mi6 = rf(),
        Xi6 = _i6(),
        R13 = R$(),
        CE8 = nf();
    class IE8 {
        config;
        middlewareStack = hE8.constructStack();
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
    var Ji6 = "***SensitiveInformation***";

    function Di6(A, q) {
        if (q == null) return q;
        let K = R13.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return Ji6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return Ji6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return Ji6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = Di6(H, Y[w]);
            return z
        }
        return q
    }
    class Pi6 {
        middlewareStack = hE8.constructStack();
        schema;
        static classBuilder() {
            return new xE8
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
                    [Xi6.SMITHY_CONTEXT_KEY]: {
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
    class xE8 {
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
            return q = class extends Pi6 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? Di6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? Di6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var y13 = "***SensitiveInformation***",
        C13 = (A, q) => {
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
    class Y$1 extends Error {
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
            return Y$1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === Y$1) return Y$1.isInstance(A);
            if (Y$1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var bE8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        uE8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = h13(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw bE8(H, q)
        },
        S13 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                uE8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        h13 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        I13 = (A) => {
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
        SE8 = !1,
        x13 = (A) => {
            if (A && !SE8 && parseInt(A.substring(1, A.indexOf("."))) < 16) SE8 = !0
        },
        b13 = (A) => {
            let q = [];
            for (let K in Xi6.AlgorithmId) {
                let Y = Xi6.AlgorithmId[K];
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
        u13 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        B13 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        m13 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        BE8 = (A) => {
            return Object.assign(b13(A), B13(A))
        },
        F13 = BE8,
        Q13 = (A) => {
            return Object.assign(u13(A), m13(A))
        },
        g13 = (A) => Array.isArray(A) ? A : [A],
        mE8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = mE8(A[K]);
            return A
        },
        U13 = (A) => {
            return A != null
        };
    class FE8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function QE8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, c13(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            gE8(Y, null, w, H)
        }
        return Y
    }
    var p13 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        d13 = (A, q) => {
            let K = {};
            for (let Y in q) gE8(K, A, q, Y);
            return K
        },
        c13 = (A, q, K) => {
            return QE8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        gE8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = l13, O = i13, _ = Y] = H;
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
        l13 = (A) => A != null,
        i13 = (A) => A,
        n13 = (A) => {
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
        r13 = (A) => A.toISOString().replace(".000Z", "Z"),
        ji6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(ji6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = ji6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(z$1, "collectBody", {
        enumerable: !0,
        get: function() {
            return Mi6.collectBody
        }
    });
    Object.defineProperty(z$1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return Mi6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(z$1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return Mi6.resolvedPath
        }
    });
    z$1.Client = IE8;
    z$1.Command = Pi6;
    z$1.NoOpLogger = FE8;
    z$1.SENSITIVE_STRING = y13;
    z$1.ServiceException = Y$1;
    z$1._json = ji6;
    z$1.convertMap = p13;
    z$1.createAggregatedClient = C13;
    z$1.decorateServiceException = bE8;
    z$1.emitWarningIfUnsupportedVersion = x13;
    z$1.getArrayIfSingleItem = g13;
    z$1.getDefaultClientConfiguration = F13;
    z$1.getDefaultExtensionConfiguration = BE8;
    z$1.getValueFromTextNode = mE8;
    z$1.isSerializableHeaderValue = U13;
    z$1.loadConfigsForDefaultMode = I13;
    z$1.map = QE8;
    z$1.resolveDefaultRuntimeConfig = Q13;
    z$1.serializeDateTime = r13;
    z$1.serializeFloat = n13;
    z$1.take = d13;
    z$1.throwDefaultError = uE8;
    z$1.withBaseException = S13;
    Object.keys(CE8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(z$1, A)) Object.defineProperty(z$1, A, {
            enumerable: !0,
            get: function() {
                return CE8[A]
            }
        })
    })
})
// @from(Ln 77826, Col 4)
Gi6 = R((UE8) => {
    Object.defineProperty(UE8, "__esModule", {
        value: !0
    });
    UE8.resolveHttpAuthSchemeConfig = UE8.defaultCognitoIdentityHttpAuthSchemeProvider = UE8.defaultCognitoIdentityHttpAuthSchemeParametersProvider = void 0;
    var Z63 = YH(),
        Wi6 = iP(),
        f63 = async (A, q, K) => {
            return {
                operation: (0, Wi6.getSmithyContext)(q).operation,
                region: await (0, Wi6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    UE8.defaultCognitoIdentityHttpAuthSchemeParametersProvider = f63;

    function V63(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "cognito-identity",
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

    function _16(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var N63 = (A) => {
        let q = [];
        switch (A.operation) {
            case "GetCredentialsForIdentity": {
                q.push(_16(A));
                break
            }
            case "GetId": {
                q.push(_16(A));
                break
            }
            case "GetOpenIdToken": {
                q.push(_16(A));
                break
            }
            case "UnlinkIdentity": {
                q.push(_16(A));
                break
            }
            default:
                q.push(V63(A))
        }
        return q
    };
    UE8.defaultCognitoIdentityHttpAuthSchemeProvider = N63;
    var T63 = (A) => {
        let q = (0, Z63.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, Wi6.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    UE8.resolveHttpAuthSchemeConfig = T63
})
// @from(Ln 77897, Col 4)
dE8 = R((dA2, k63) => {
    k63.exports = {
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
// @from(Ln 77998, Col 4)
cE8 = R((R63) => {
    var L63 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    R63.isArrayBuffer = L63
})
// @from(Ln 78002, Col 4)
fi6 = R((I63) => {
    var C63 = cE8(),
        Zi6 = h1("buffer"),
        S63 = (A, q = 0, K = A.byteLength - q) => {
            if (!C63.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Zi6.Buffer.from(A, q, K)
        },
        h63 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Zi6.Buffer.from(A, q) : Zi6.Buffer.from(A)
        };
    I63.fromArrayBuffer = S63;
    I63.fromString = h63
})
// @from(Ln 78016, Col 4)
nE8 = R((lE8) => {
    Object.defineProperty(lE8, "__esModule", {
        value: !0
    });
    lE8.fromBase64 = void 0;
    var u63 = fi6(),
        B63 = /^[A-Za-z0-9+/]*={0,2}$/,
        m63 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!B63.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, u63.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    lE8.fromBase64 = m63
})
// @from(Ln 78031, Col 4)
aE8 = R((rE8) => {
    Object.defineProperty(rE8, "__esModule", {
        value: !0
    });
    rE8.toBase64 = void 0;
    var F63 = fi6(),
        Q63 = Z2(),
        g63 = (A) => {
            let q;
            if (typeof A === "string") q = (0, Q63.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, F63.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    rE8.toBase64 = g63
})
// @from(Ln 78047, Col 4)
eE8 = R((Hk1) => {
    var sE8 = nE8(),
        tE8 = aE8();
    Object.keys(sE8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Hk1, A)) Object.defineProperty(Hk1, A, {
            enumerable: !0,
            get: function() {
                return sE8[A]
            }
        })
    });
    Object.keys(tE8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Hk1, A)) Object.defineProperty(Hk1, A, {
            enumerable: !0,
            get: function() {
                return tE8[A]
            }
        })
    })
})
// @from(Ln 78067, Col 4)
Wk8 = R((Mk8) => {
    Object.defineProperty(Mk8, "__esModule", {
        value: !0
    });
    Mk8.ruleSet = void 0;
    var Jk8 = "required",
        eP = "fn",
        AW = "argv",
        H$1 = "ref",
        Ak8 = !0,
        qk8 = "isSet",
        _k1 = "booleanEquals",
        w$1 = "error",
        Pb = "endpoint",
        Hg = "tree",
        Vi6 = "PartitionResult",
        Ni6 = "getAttr",
        $k1 = "stringEquals",
        Kk8 = {
            [Jk8]: !1,
            type: "string"
        },
        Yk8 = {
            [Jk8]: !0,
            default: !1,
            type: "boolean"
        },
        zk8 = {
            [H$1]: "Endpoint"
        },
        Xk8 = {
            [eP]: _k1,
            [AW]: [{
                [H$1]: "UseFIPS"
            }, !0]
        },
        Dk8 = {
            [eP]: _k1,
            [AW]: [{
                [H$1]: "UseDualStack"
            }, !0]
        },
        HX = {},
        Ok1 = {
            [H$1]: "Region"
        },
        wk8 = {
            [eP]: Ni6,
            [AW]: [{
                [H$1]: Vi6
            }, "supportsFIPS"]
        },
        jk8 = {
            [H$1]: Vi6
        },
        Hk8 = {
            [eP]: _k1,
            [AW]: [!0, {
                [eP]: Ni6,
                [AW]: [jk8, "supportsDualStack"]
            }]
        },
        $k8 = [Xk8],
        Ok8 = [Dk8],
        _k8 = [Ok1],
        U63 = {
            version: "1.0",
            parameters: {
                Region: Kk8,
                UseDualStack: Yk8,
                UseFIPS: Yk8,
                Endpoint: Kk8
            },
            rules: [{
                conditions: [{
                    [eP]: qk8,
                    [AW]: [zk8]
                }],
                rules: [{
                    conditions: $k8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: w$1
                }, {
                    conditions: Ok8,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: w$1
                }, {
                    endpoint: {
                        url: zk8,
                        properties: HX,
                        headers: HX
                    },
                    type: Pb
                }],
                type: Hg
            }, {
                conditions: [{
                    [eP]: qk8,
                    [AW]: _k8
                }],
                rules: [{
                    conditions: [{
                        [eP]: "aws.partition",
                        [AW]: _k8,
                        assign: Vi6
                    }],
                    rules: [{
                        conditions: [Xk8, Dk8],
                        rules: [{
                            conditions: [{
                                [eP]: _k1,
                                [AW]: [Ak8, wk8]
                            }, Hk8],
                            rules: [{
                                conditions: [{
                                    [eP]: $k1,
                                    [AW]: [Ok1, "us-east-1"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }, {
                                conditions: [{
                                    [eP]: $k1,
                                    [AW]: [Ok1, "us-east-2"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }, {
                                conditions: [{
                                    [eP]: $k1,
                                    [AW]: [Ok1, "us-west-1"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }, {
                                conditions: [{
                                    [eP]: $k1,
                                    [AW]: [Ok1, "us-west-2"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }, {
                                endpoint: {
                                    url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }],
                            type: Hg
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: w$1
                        }],
                        type: Hg
                    }, {
                        conditions: $k8,
                        rules: [{
                            conditions: [{
                                [eP]: _k1,
                                [AW]: [wk8, Ak8]
                            }],
                            rules: [{
                                endpoint: {
                                    url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }],
                            type: Hg
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: w$1
                        }],
                        type: Hg
                    }, {
                        conditions: Ok8,
                        rules: [{
                            conditions: [Hk8],
                            rules: [{
                                conditions: [{
                                    [eP]: $k1,
                                    [AW]: ["aws", {
                                        [eP]: Ni6,
                                        [AW]: [jk8, "name"]
                                    }]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity.{Region}.amazonaws.com",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }, {
                                endpoint: {
                                    url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: HX,
                                    headers: HX
                                },
                                type: Pb
                            }],
                            type: Hg
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: w$1
                        }],
                        type: Hg
                    }, {
                        endpoint: {
                            url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
                            properties: HX,
                            headers: HX
                        },
                        type: Pb
                    }],
                    type: Hg
                }],
                type: Hg
            }, {
                error: "Invalid Configuration: Missing Region",
                type: w$1
            }]
        };
    Mk8.ruleSet = U63
})
// @from(Ln 78309, Col 4)
fk8 = R((Gk8) => {
    Object.defineProperty(Gk8, "__esModule", {
        value: !0
    });
    Gk8.defaultEndpointResolver = void 0;
    var p63 = zb(),
        Ti6 = GC(),
        d63 = Wk8(),
        c63 = new Ti6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        l63 = (A, q = {}) => {
            return c63.get(A, () => (0, Ti6.resolveEndpoint)(d63.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    Gk8.defaultEndpointResolver = l63;
    Ti6.customEndpointFunctions.aws = p63.awsEndpointFunctions
})
// @from(Ln 78330, Col 4)
Ek8 = R((Tk8) => {
    Object.defineProperty(Tk8, "__esModule", {
        value: !0
    });
    Tk8.getRuntimeConfig = void 0;
    var i63 = YH(),
        n63 = eQ(),
        r63 = lz(),
        o63 = wk1(),
        a63 = fk(),
        Vk8 = eE8(),
        Nk8 = Z2(),
        s63 = Gi6(),
        t63 = fk8(),
        e63 = (A) => {
            return {
                apiVersion: "2014-06-30",
                base64Decoder: A?.base64Decoder ?? Vk8.fromBase64,
                base64Encoder: A?.base64Encoder ?? Vk8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? t63.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? s63.defaultCognitoIdentityHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new i63.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new r63.NoAuthSigner
                }],
                logger: A?.logger ?? new o63.NoOpLogger,
                protocol: A?.protocol ?? new n63.AwsJson1_1Protocol({
                    defaultNamespace: "com.amazonaws.cognitoidentity",
                    serviceTarget: "AWSCognitoIdentityService",
                    awsQueryCompatible: !1
                }),
                serviceId: A?.serviceId ?? "Cognito Identity",
                urlParser: A?.urlParser ?? a63.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? Nk8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? Nk8.toUtf8
            }
        };
    Tk8.getRuntimeConfig = e63
})
// @from(Ln 78376, Col 4)
hk8 = R((Ck8) => {
    Object.defineProperty(Ck8, "__esModule", {
        value: !0
    });
    Ck8.getRuntimeConfig = void 0;
    var AA3 = n2(),
        qA3 = AA3.__importDefault(dE8()),
        kk8 = YH(),
        KA3 = xA1(),
        Lk8 = oQ(),
        J16 = YJ(),
        YA3 = aQ(),
        Rk8 = qM(),
        mA1 = af(),
        yk8 = cf(),
        zA3 = sQ(),
        wA3 = _b(),
        HA3 = Ek8(),
        $A3 = wk1(),
        OA3 = qg(),
        _A3 = wk1(),
        JA3 = (A) => {
            (0, _A3.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, OA3.resolveDefaultsModeConfig)(A),
                K = () => q().then($A3.loadConfigsForDefaultMode),
                Y = (0, HA3.getRuntimeConfig)(A);
            (0, kk8.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, mA1.loadConfig)(kk8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? zA3.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? KA3.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, Lk8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: qA3.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, mA1.loadConfig)(Rk8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, mA1.loadConfig)(J16.NODE_REGION_CONFIG_OPTIONS, {
                    ...J16.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: yk8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, mA1.loadConfig)({
                    ...Rk8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || wA3.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? YA3.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? yk8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, mA1.loadConfig)(J16.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, mA1.loadConfig)(J16.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, mA1.loadConfig)(Lk8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    Ck8.getRuntimeConfig = JA3
})
// @from(Ln 78438, Col 4)
uk8 = R((WA3) => {
    var XA3 = _i6(),
        DA3 = (A) => {
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
        jA3 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class Ik8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = XA3.FieldPosition.HEADER,
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
    class xk8 {
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
    class X16 {
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
            let q = new X16({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = MA3(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return X16.clone(this)
        }
    }

    function MA3(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class bk8 {
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

    function PA3(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    WA3.Field = Ik8;
    WA3.Fields = xk8;
    WA3.HttpRequest = X16;
    WA3.HttpResponse = bk8;
    WA3.getHttpHandlerExtensionConfiguration = DA3;
    WA3.isValidHostname = PA3;
    WA3.resolveHttpHandlerRuntimeConfig = jA3
})