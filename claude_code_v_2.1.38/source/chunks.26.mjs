
// @from(Ln 73782, Col 4)
Hl6 = R((LiK) => {
    var TiK = of(),
        li = wX(),
        zl6 = Ob(),
        viK = lf8(),
        ne1 = h1("node:crypto"),
        Kl6 = h1("node:fs"),
        EiK = h1("node:os"),
        Yl6 = h1("node:path");
    class wl6 {
        profileData;
        init;
        callerClientConfig;
        static REFRESH_THRESHOLD = 300000;
        constructor(A, q, K) {
            this.profileData = A, this.init = q, this.callerClientConfig = K
        }
        async loadCredentials() {
            let A = await this.loadToken();
            if (!A) throw new li.CredentialsProviderError(`Failed to load a token for session ${this.loginSession}, please re-authenticate using aws login`, {
                tryNextLink: !1,
                logger: this.logger
            });
            let q = A.accessToken,
                K = Date.now();
            if (new Date(q.expiresAt).getTime() - K <= wl6.REFRESH_THRESHOLD) return this.refresh(A);
            return {
                accessKeyId: q.accessKeyId,
                secretAccessKey: q.secretAccessKey,
                sessionToken: q.sessionToken,
                accountId: q.accountId,
                expiration: new Date(q.expiresAt)
            }
        }
        get logger() {
            return this.init?.logger
        }
        get loginSession() {
            return this.profileData.login_session
        }
        async refresh(A) {
            let {
                SigninClient: q,
                CreateOAuth2TokenCommand: K
            } = await Promise.resolve().then(() => o(lV8())), {
                logger: Y,
                userAgentAppId: z
            } = this.callerClientConfig ?? {}, H = ((J) => {
                return J?.metadata?.handlerProtocol === "h2"
            })(this.callerClientConfig?.requestHandler) ? void 0 : this.callerClientConfig?.requestHandler, $ = this.profileData.region ?? await this.callerClientConfig?.region?.() ?? process.env.AWS_REGION, O = new q({
                credentials: {
                    accessKeyId: "",
                    secretAccessKey: ""
                },
                region: $,
                requestHandler: H,
                logger: Y,
                userAgentAppId: z,
                ...this.init?.clientConfig
            });
            this.createDPoPInterceptor(O.middlewareStack);
            let _ = {
                tokenInput: {
                    clientId: A.clientId,
                    refreshToken: A.refreshToken,
                    grantType: "refresh_token"
                }
            };
            try {
                let J = await O.send(new K(_)),
                    {
                        accessKeyId: X,
                        secretAccessKey: D,
                        sessionToken: j
                    } = J.tokenOutput?.accessToken ?? {},
                    {
                        refreshToken: M,
                        expiresIn: P
                    } = J.tokenOutput ?? {};
                if (!X || !D || !j || !M) throw new li.CredentialsProviderError("Token refresh response missing required fields", {
                    logger: this.logger,
                    tryNextLink: !1
                });
                let W = (P ?? 900) * 1000,
                    G = new Date(Date.now() + W),
                    f = {
                        ...A,
                        accessToken: {
                            ...A.accessToken,
                            accessKeyId: X,
                            secretAccessKey: D,
                            sessionToken: j,
                            expiresAt: G.toISOString()
                        },
                        refreshToken: M
                    };
                await this.saveToken(f);
                let Z = f.accessToken;
                return {
                    accessKeyId: Z.accessKeyId,
                    secretAccessKey: Z.secretAccessKey,
                    sessionToken: Z.sessionToken,
                    accountId: Z.accountId,
                    expiration: G
                }
            } catch (J) {
                if (J.name === "AccessDeniedException") {
                    let X = J.error,
                        D;
                    switch (X) {
                        case "TOKEN_EXPIRED":
                            D = "Your session has expired. Please reauthenticate.";
                            break;
                        case "USER_CREDENTIALS_CHANGED":
                            D = "Unable to refresh credentials because of a change in your password. Please reauthenticate with your new password.";
                            break;
                        case "INSUFFICIENT_PERMISSIONS":
                            D = "Unable to refresh credentials due to insufficient permissions. You may be missing permission for the 'CreateOAuth2Token' action.";
                            break;
                        default:
                            D = `Failed to refresh token: ${String(J)}. Please re-authenticate using \`aws login\``
                    }
                    throw new li.CredentialsProviderError(D, {
                        logger: this.logger,
                        tryNextLink: !1
                    })
                }
                throw new li.CredentialsProviderError(`Failed to refresh token: ${String(J)}. Please re-authenticate using aws login`, {
                    logger: this.logger
                })
            }
        }
        async loadToken() {
            let A = this.getTokenFilePath();
            try {
                let q;
                try {
                    q = await zl6.readFile(A, {
                        ignoreCache: this.init?.ignoreCache
                    })
                } catch {
                    q = await Kl6.promises.readFile(A, "utf8")
                }
                let K = JSON.parse(q),
                    Y = ["accessToken", "clientId", "refreshToken", "dpopKey"].filter((z) => !K[z]);
                if (!K.accessToken?.accountId) Y.push("accountId");
                if (Y.length > 0) throw new li.CredentialsProviderError(`Token validation failed, missing fields: ${Y.join(", ")}`, {
                    logger: this.logger,
                    tryNextLink: !1
                });
                return K
            } catch (q) {
                throw new li.CredentialsProviderError(`Failed to load token from ${A}: ${String(q)}`, {
                    logger: this.logger,
                    tryNextLink: !1
                })
            }
        }
        async saveToken(A) {
            let q = this.getTokenFilePath(),
                K = Yl6.dirname(q);
            try {
                await Kl6.promises.mkdir(K, {
                    recursive: !0
                })
            } catch (Y) {}
            await Kl6.promises.writeFile(q, JSON.stringify(A, null, 2), "utf8")
        }
        getTokenFilePath() {
            let A = process.env.AWS_LOGIN_CACHE_DIRECTORY ?? Yl6.join(EiK.homedir(), ".aws", "login", "cache"),
                q = Buffer.from(this.loginSession, "utf8"),
                K = ne1.createHash("sha256").update(q).digest("hex");
            return Yl6.join(A, `${K}.json`)
        }
        derToRawSignature(A) {
            let q = 2;
            if (A[q] !== 2) throw Error("Invalid DER signature");
            q++;
            let K = A[q++],
                Y = A.subarray(q, q + K);
            if (q += K, A[q] !== 2) throw Error("Invalid DER signature");
            q++;
            let z = A[q++],
                w = A.subarray(q, q + z);
            Y = Y[0] === 0 ? Y.subarray(1) : Y, w = w[0] === 0 ? w.subarray(1) : w;
            let H = Buffer.concat([Buffer.alloc(32 - Y.length), Y]),
                $ = Buffer.concat([Buffer.alloc(32 - w.length), w]);
            return Buffer.concat([H, $])
        }
        createDPoPInterceptor(A) {
            A.add((q) => async (K) => {
                if (viK.HttpRequest.isInstance(K.request)) {
                    let Y = K.request,
                        z = `${Y.protocol}//${Y.hostname}${Y.port?`:${Y.port}`:""}${Y.path}`,
                        w = await this.generateDpop(Y.method, z);
                    Y.headers = {
                        ...Y.headers,
                        DPoP: w
                    }
                }
                return q(K)
            }, {
                step: "finalizeRequest",
                name: "dpopInterceptor",
                override: !0
            })
        }
        async generateDpop(A = "POST", q) {
            let K = await this.loadToken();
            try {
                let Y = ne1.createPrivateKey({
                        key: K.dpopKey,
                        format: "pem",
                        type: "sec1"
                    }),
                    w = ne1.createPublicKey(Y).export({
                        format: "der",
                        type: "spki"
                    }),
                    H = -1;
                for (let G = 0; G < w.length; G++)
                    if (w[G] === 4) {
                        H = G;
                        break
                    } let $ = w.slice(H + 1, H + 33),
                    O = w.slice(H + 33, H + 65),
                    _ = {
                        alg: "ES256",
                        typ: "dpop+jwt",
                        jwk: {
                            kty: "EC",
                            crv: "P-256",
                            x: $.toString("base64url"),
                            y: O.toString("base64url")
                        }
                    },
                    J = {
                        jti: crypto.randomUUID(),
                        htm: A,
                        htu: q,
                        iat: Math.floor(Date.now() / 1000)
                    },
                    X = Buffer.from(JSON.stringify(_)).toString("base64url"),
                    D = Buffer.from(JSON.stringify(J)).toString("base64url"),
                    j = `${X}.${D}`,
                    M = ne1.sign("sha256", Buffer.from(j), Y),
                    W = this.derToRawSignature(M).toString("base64url");
                return `${j}.${W}`
            } catch (Y) {
                throw new li.CredentialsProviderError(`Failed to generate Dpop proof: ${Y instanceof Error?Y.message:String(Y)}`, {
                    logger: this.logger,
                    tryNextLink: !1
                })
            }
        }
    }
    var kiK = (A) => async ({
        callerClientConfig: q
    } = {}) => {
        A?.logger?.debug?.("@aws-sdk/credential-providers - fromLoginCredentials");
        let K = await zl6.parseKnownFiles(A || {}),
            Y = zl6.getProfileName({
                profile: A?.profile ?? q?.profile
            }),
            z = K[Y];
        if (!z?.login_session) throw new li.CredentialsProviderError(`Profile ${Y} does not contain login_session.`, {
            tryNextLink: !0,
            logger: A?.logger
        });
        let H = await new wl6(z, A, q).loadCredentials();
        return TiK.setCredentialFeature(H, "CREDENTIALS_LOGIN", "AD")
    };
    LiK.fromLoginCredentials = kiK
})
// @from(Ln 74056, Col 4)
Ol6 = R((iV8) => {
    Object.defineProperty(iV8, "__esModule", {
        value: !0
    });
    iV8.resolveHttpAuthSchemeConfig = iV8.resolveStsAuthConfig = iV8.defaultSTSHttpAuthSchemeProvider = iV8.defaultSTSHttpAuthSchemeParametersProvider = void 0;
    var yiK = YH(),
        $l6 = iP(),
        CiK = _l6(),
        SiK = async (A, q, K) => {
            return {
                operation: (0, $l6.getSmithyContext)(q).operation,
                region: await (0, $l6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    iV8.defaultSTSHttpAuthSchemeParametersProvider = SiK;

    function hiK(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sts",
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

    function IiK(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var xiK = (A) => {
        let q = [];
        switch (A.operation) {
            case "AssumeRoleWithWebIdentity": {
                q.push(IiK(A));
                break
            }
            default:
                q.push(hiK(A))
        }
        return q
    };
    iV8.defaultSTSHttpAuthSchemeProvider = xiK;
    var biK = (A) => Object.assign(A, {
        stsClientCtor: CiK.STSClient
    });
    iV8.resolveStsAuthConfig = biK;
    var uiK = (A) => {
        let q = iV8.resolveStsAuthConfig(A),
            K = (0, yiK.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, $l6.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    iV8.resolveHttpAuthSchemeConfig = uiK
})
// @from(Ln 74121, Col 4)
Jl6 = R((oV8) => {
    Object.defineProperty(oV8, "__esModule", {
        value: !0
    });
    oV8.commonParams = oV8.resolveClientEndpointParameters = void 0;
    var FiK = (A) => {
        return Object.assign(A, {
            useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
            useFipsEndpoint: A.useFipsEndpoint ?? !1,
            useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
            defaultSigningName: "sts"
        })
    };
    oV8.resolveClientEndpointParameters = FiK;
    oV8.commonParams = {
        UseGlobalEndpoint: {
            type: "builtInParams",
            name: "useGlobalEndpoint"
        },
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
    }
})
// @from(Ln 74158, Col 4)
VN8 = R((ZN8) => {
    Object.defineProperty(ZN8, "__esModule", {
        value: !0
    });
    ZN8.ruleSet = void 0;
    var ON8 = "required",
        C5 = "type",
        zz = "fn",
        wz = "argv",
        ni = "ref",
        sV8 = !1,
        Xl6 = !0,
        ii = "booleanEquals",
        YM = "stringEquals",
        _N8 = "sigv4",
        JN8 = "sts",
        XN8 = "us-east-1",
        y$ = "endpoint",
        tV8 = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
        Db = "tree",
        q$1 = "error",
        jl6 = "getAttr",
        eV8 = {
            [ON8]: !1,
            [C5]: "string"
        },
        Dl6 = {
            [ON8]: !0,
            default: !1,
            [C5]: "boolean"
        },
        DN8 = {
            [ni]: "Endpoint"
        },
        AN8 = {
            [zz]: "isSet",
            [wz]: [{
                [ni]: "Region"
            }]
        },
        zM = {
            [ni]: "Region"
        },
        qN8 = {
            [zz]: "aws.partition",
            [wz]: [zM],
            assign: "PartitionResult"
        },
        jN8 = {
            [ni]: "UseFIPS"
        },
        MN8 = {
            [ni]: "UseDualStack"
        },
        sP = {
            url: "https://sts.amazonaws.com",
            properties: {
                authSchemes: [{
                    name: _N8,
                    signingName: JN8,
                    signingRegion: XN8
                }]
            },
            headers: {}
        },
        yT = {},
        KN8 = {
            conditions: [{
                [zz]: YM,
                [wz]: [zM, "aws-global"]
            }],
            [y$]: sP,
            [C5]: y$
        },
        PN8 = {
            [zz]: ii,
            [wz]: [jN8, !0]
        },
        WN8 = {
            [zz]: ii,
            [wz]: [MN8, !0]
        },
        YN8 = {
            [zz]: jl6,
            [wz]: [{
                [ni]: "PartitionResult"
            }, "supportsFIPS"]
        },
        GN8 = {
            [ni]: "PartitionResult"
        },
        zN8 = {
            [zz]: ii,
            [wz]: [!0, {
                [zz]: jl6,
                [wz]: [GN8, "supportsDualStack"]
            }]
        },
        wN8 = [{
            [zz]: "isSet",
            [wz]: [DN8]
        }],
        HN8 = [PN8],
        $N8 = [WN8],
        giK = {
            version: "1.0",
            parameters: {
                Region: eV8,
                UseDualStack: Dl6,
                UseFIPS: Dl6,
                Endpoint: eV8,
                UseGlobalEndpoint: Dl6
            },
            rules: [{
                conditions: [{
                    [zz]: ii,
                    [wz]: [{
                        [ni]: "UseGlobalEndpoint"
                    }, Xl6]
                }, {
                    [zz]: "not",
                    [wz]: wN8
                }, AN8, qN8, {
                    [zz]: ii,
                    [wz]: [jN8, sV8]
                }, {
                    [zz]: ii,
                    [wz]: [MN8, sV8]
                }],
                rules: [{
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "ap-northeast-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "ap-south-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "ap-southeast-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "ap-southeast-2"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, KN8, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "ca-central-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "eu-central-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "eu-north-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "eu-west-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "eu-west-2"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "eu-west-3"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "sa-east-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, XN8]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "us-east-2"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "us-west-1"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    conditions: [{
                        [zz]: YM,
                        [wz]: [zM, "us-west-2"]
                    }],
                    endpoint: sP,
                    [C5]: y$
                }, {
                    endpoint: {
                        url: tV8,
                        properties: {
                            authSchemes: [{
                                name: _N8,
                                signingName: JN8,
                                signingRegion: "{Region}"
                            }]
                        },
                        headers: yT
                    },
                    [C5]: y$
                }],
                [C5]: Db
            }, {
                conditions: wN8,
                rules: [{
                    conditions: HN8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    [C5]: q$1
                }, {
                    conditions: $N8,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    [C5]: q$1
                }, {
                    endpoint: {
                        url: DN8,
                        properties: yT,
                        headers: yT
                    },
                    [C5]: y$
                }],
                [C5]: Db
            }, {
                conditions: [AN8],
                rules: [{
                    conditions: [qN8],
                    rules: [{
                        conditions: [PN8, WN8],
                        rules: [{
                            conditions: [{
                                [zz]: ii,
                                [wz]: [Xl6, YN8]
                            }, zN8],
                            rules: [{
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: yT,
                                    headers: yT
                                },
                                [C5]: y$
                            }],
                            [C5]: Db
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            [C5]: q$1
                        }],
                        [C5]: Db
                    }, {
                        conditions: HN8,
                        rules: [{
                            conditions: [{
                                [zz]: ii,
                                [wz]: [YN8, Xl6]
                            }],
                            rules: [{
                                conditions: [{
                                    [zz]: YM,
                                    [wz]: [{
                                        [zz]: jl6,
                                        [wz]: [GN8, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://sts.{Region}.amazonaws.com",
                                    properties: yT,
                                    headers: yT
                                },
                                [C5]: y$
                            }, {
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: yT,
                                    headers: yT
                                },
                                [C5]: y$
                            }],
                            [C5]: Db
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            [C5]: q$1
                        }],
                        [C5]: Db
                    }, {
                        conditions: $N8,
                        rules: [{
                            conditions: [zN8],
                            rules: [{
                                endpoint: {
                                    url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: yT,
                                    headers: yT
                                },
                                [C5]: y$
                            }],
                            [C5]: Db
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            [C5]: q$1
                        }],
                        [C5]: Db
                    }, KN8, {
                        endpoint: {
                            url: tV8,
                            properties: yT,
                            headers: yT
                        },
                        [C5]: y$
                    }],
                    [C5]: Db
                }],
                [C5]: Db
            }, {
                error: "Invalid Configuration: Missing Region",
                [C5]: q$1
            }]
        };
    ZN8.ruleSet = giK
})
// @from(Ln 74522, Col 4)
vN8 = R((NN8) => {
    Object.defineProperty(NN8, "__esModule", {
        value: !0
    });
    NN8.defaultEndpointResolver = void 0;
    var UiK = zb(),
        Ml6 = GC(),
        piK = VN8(),
        diK = new Ml6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
        }),
        ciK = (A, q = {}) => {
            return diK.get(A, () => (0, Ml6.resolveEndpoint)(piK.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    NN8.defaultEndpointResolver = ciK;
    Ml6.customEndpointFunctions.aws = UiK.awsEndpointFunctions
})
// @from(Ln 74543, Col 4)
yN8 = R((LN8) => {
    Object.defineProperty(LN8, "__esModule", {
        value: !0
    });
    LN8.getRuntimeConfig = void 0;
    var liK = YH(),
        iiK = eQ(),
        niK = lz(),
        riK = uG(),
        oiK = fk(),
        EN8 = We1(),
        kN8 = Z2(),
        aiK = Ol6(),
        siK = vN8(),
        tiK = (A) => {
            return {
                apiVersion: "2011-06-15",
                base64Decoder: A?.base64Decoder ?? EN8.fromBase64,
                base64Encoder: A?.base64Encoder ?? EN8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? siK.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? aiK.defaultSTSHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new liK.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new niK.NoAuthSigner
                }],
                logger: A?.logger ?? new riK.NoOpLogger,
                protocol: A?.protocol ?? new iiK.AwsQueryProtocol({
                    defaultNamespace: "com.amazonaws.sts",
                    xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
                    version: "2011-06-15"
                }),
                serviceId: A?.serviceId ?? "STS",
                urlParser: A?.urlParser ?? oiK.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? kN8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? kN8.toUtf8
            }
        };
    LN8.getRuntimeConfig = tiK
})
// @from(Ln 74589, Col 4)
bN8 = R((IN8) => {
    Object.defineProperty(IN8, "__esModule", {
        value: !0
    });
    IN8.getRuntimeConfig = void 0;
    var eiK = n2(),
        AnK = eiK.__importDefault(De1()),
        Pl6 = YH(),
        CN8 = oQ(),
        re1 = YJ(),
        qnK = lz(),
        KnK = aQ(),
        SN8 = qM(),
        RA1 = af(),
        hN8 = cf(),
        YnK = sQ(),
        znK = _b(),
        wnK = yN8(),
        HnK = uG(),
        $nK = qg(),
        OnK = uG(),
        _nK = (A) => {
            (0, OnK.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, $nK.resolveDefaultsModeConfig)(A),
                K = () => q().then(HnK.loadConfigsForDefaultMode),
                Y = (0, wnK.getRuntimeConfig)(A);
            (0, Pl6.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, RA1.loadConfig)(Pl6.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? YnK.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, CN8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: AnK.default.version
                }),
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (w) => w.getIdentityProvider("aws.auth#sigv4") || (async (H) => await A.credentialDefaultProvider(H?.__config || {})()),
                    signer: new Pl6.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (w) => w.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new qnK.NoAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, RA1.loadConfig)(SN8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, RA1.loadConfig)(re1.NODE_REGION_CONFIG_OPTIONS, {
                    ...re1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: hN8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, RA1.loadConfig)({
                    ...SN8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || znK.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? KnK.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? hN8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, RA1.loadConfig)(re1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, RA1.loadConfig)(re1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, RA1.loadConfig)(CN8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    IN8.getRuntimeConfig = _nK
})
// @from(Ln 74659, Col 4)
mN8 = R((uN8) => {
    Object.defineProperty(uN8, "__esModule", {
        value: !0
    });
    uN8.resolveHttpAuthRuntimeConfig = uN8.getHttpAuthExtensionConfiguration = void 0;
    var JnK = (A) => {
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
    uN8.getHttpAuthExtensionConfiguration = JnK;
    var XnK = (A) => {
        return {
            httpAuthSchemes: A.httpAuthSchemes(),
            httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
            credentials: A.credentials()
        }
    };
    uN8.resolveHttpAuthRuntimeConfig = XnK
})
// @from(Ln 74703, Col 4)
cN8 = R((pN8) => {
    Object.defineProperty(pN8, "__esModule", {
        value: !0
    });
    pN8.resolveRuntimeExtensions = void 0;
    var FN8 = fC(),
        QN8 = fe1(),
        gN8 = uG(),
        UN8 = mN8(),
        jnK = (A, q) => {
            let K = Object.assign((0, FN8.getAwsRegionExtensionConfiguration)(A), (0, gN8.getDefaultExtensionConfiguration)(A), (0, QN8.getHttpHandlerExtensionConfiguration)(A), (0, UN8.getHttpAuthExtensionConfiguration)(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, (0, FN8.resolveAwsRegionExtensionConfiguration)(K), (0, gN8.resolveDefaultRuntimeConfig)(K), (0, QN8.resolveHttpHandlerRuntimeConfig)(K), (0, UN8.resolveHttpAuthRuntimeConfig)(K))
        };
    pN8.resolveRuntimeExtensions = jnK
})
// @from(Ln 74718, Col 4)
_l6 = R((Gl6) => {
    Object.defineProperty(Gl6, "__esModule", {
        value: !0
    });
    Gl6.STSClient = Gl6.__Client = void 0;
    var lN8 = BQ(),
        MnK = mQ(),
        PnK = FQ(),
        iN8 = $b(),
        WnK = YJ(),
        Wl6 = lz(),
        GnK = R$(),
        ZnK = rQ(),
        fnK = ZC(),
        nN8 = qM(),
        oN8 = uG();
    Object.defineProperty(Gl6, "__Client", {
        enumerable: !0,
        get: function() {
            return oN8.Client
        }
    });
    var rN8 = Ol6(),
        VnK = Jl6(),
        NnK = bN8(),
        TnK = cN8();
    class aN8 extends oN8.Client {
        config;
        constructor(...[A]) {
            let q = (0, NnK.getRuntimeConfig)(A || {});
            super(q);
            this.initConfig = q;
            let K = (0, VnK.resolveClientEndpointParameters)(q),
                Y = (0, iN8.resolveUserAgentConfig)(K),
                z = (0, nN8.resolveRetryConfig)(Y),
                w = (0, WnK.resolveRegionConfig)(z),
                H = (0, lN8.resolveHostHeaderConfig)(w),
                $ = (0, fnK.resolveEndpointConfig)(H),
                O = (0, rN8.resolveHttpAuthSchemeConfig)($),
                _ = (0, TnK.resolveRuntimeExtensions)(O, A?.extensions || []);
            this.config = _, this.middlewareStack.use((0, GnK.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, iN8.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, nN8.getRetryPlugin)(this.config)), this.middlewareStack.use((0, ZnK.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, lN8.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, MnK.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, PnK.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Wl6.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
                httpAuthSchemeParametersProvider: rN8.defaultSTSHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (J) => new Wl6.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": J.credentials
                })
            })), this.middlewareStack.use((0, Wl6.getHttpSigningPlugin)(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    Gl6.STSClient = aN8
})
// @from(Ln 74771, Col 4)
te1 = R((oe1) => {
    var rE1 = _l6(),
        oE1 = uG(),
        tN8 = ZC(),
        eN8 = Jl6(),
        ri = R$(),
        Zl6 = of(),
        vnK = fC(),
        zg = class A extends oE1.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        AT8 = class A extends zg {
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
        qT8 = class A extends zg {
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
        KT8 = class A extends zg {
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
        YT8 = class A extends zg {
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
        zT8 = class A extends zg {
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
        wT8 = class A extends zg {
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
        HT8 = class A extends zg {
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
        EnK = "Arn",
        knK = "AccessKeyId",
        LnK = "AssumeRole",
        RnK = "AssumedRoleId",
        ynK = "AssumeRoleRequest",
        CnK = "AssumeRoleResponse",
        fl6 = "AssumedRoleUser",
        SnK = "AssumeRoleWithWebIdentity",
        hnK = "AssumeRoleWithWebIdentityRequest",
        InK = "AssumeRoleWithWebIdentityResponse",
        xnK = "Audience",
        Vl6 = "Credentials",
        bnK = "ContextAssertion",
        $T8 = "DurationSeconds",
        unK = "Expiration",
        BnK = "ExternalId",
        mnK = "ExpiredTokenException",
        FnK = "IDPCommunicationErrorException",
        QnK = "IDPRejectedClaimException",
        gnK = "InvalidIdentityTokenException",
        UnK = "Key",
        pnK = "MalformedPolicyDocumentException",
        OT8 = "Policy",
        _T8 = "PolicyArns",
        dnK = "ProviderArn",
        cnK = "ProvidedContexts",
        lnK = "ProvidedContextsListType",
        inK = "ProvidedContext",
        nnK = "PolicyDescriptorType",
        rnK = "ProviderId",
        JT8 = "PackedPolicySize",
        onK = "PackedPolicyTooLargeException",
        anK = "Provider",
        XT8 = "RoleArn",
        snK = "RegionDisabledException",
        DT8 = "RoleSessionName",
        tnK = "SecretAccessKey",
        enK = "SubjectFromWebIdentityToken",
        Nl6 = "SourceIdentity",
        ArK = "SerialNumber",
        qrK = "SessionToken",
        KrK = "Tags",
        YrK = "TokenCode",
        zrK = "TransitiveTagKeys",
        wrK = "Tag",
        HrK = "Value",
        $rK = "WebIdentityToken",
        OrK = "arn",
        _rK = "accessKeySecretType",
        yA1 = "awsQueryError",
        CA1 = "client",
        JrK = "clientTokenType",
        SA1 = "error",
        hA1 = "httpError",
        IA1 = "message",
        XrK = "policyDescriptorListType",
        jT8 = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
        DrK = "tagListType",
        nz = "com.amazonaws.sts",
        jrK = [0, nz, _rK, 8, 0],
        MrK = [0, nz, JrK, 8, 0],
        MT8 = [3, nz, fl6, 0, [RnK, EnK],
            [0, 0]
        ],
        PrK = [3, nz, ynK, 0, [XT8, DT8, _T8, OT8, $T8, KrK, zrK, BnK, ArK, YrK, Nl6, cnK],
            [0, 0, () => WT8, 0, 1, () => hrK, 64, 0, 0, 0, 0, () => SrK]
        ],
        WrK = [3, nz, CnK, 0, [Vl6, fl6, JT8, Nl6],
            [
                [() => PT8, 0], () => MT8, 1, 0
            ]
        ],
        GrK = [3, nz, hnK, 0, [XT8, DT8, $rK, rnK, _T8, OT8, $T8],
            [0, 0, [() => MrK, 0], 0, () => WT8, 0, 1]
        ],
        ZrK = [3, nz, InK, 0, [Vl6, enK, fl6, JT8, anK, xnK, Nl6],
            [
                [() => PT8, 0], 0, () => MT8, 1, 0, 0, 0
            ]
        ],
        PT8 = [3, nz, Vl6, 0, [knK, tnK, qrK, unK],
            [0, [() => jrK, 0], 0, 4]
        ],
        frK = [-3, nz, mnK, {
                [SA1]: CA1,
                [hA1]: 400,
                [yA1]: ["ExpiredTokenException", 400]
            },
            [IA1],
            [0]
        ];
    ri.TypeRegistry.for(nz).registerError(frK, AT8);
    var VrK = [-3, nz, FnK, {
            [SA1]: CA1,
            [hA1]: 400,
            [yA1]: ["IDPCommunicationError", 400]
        },
        [IA1],
        [0]
    ];
    ri.TypeRegistry.for(nz).registerError(VrK, HT8);
    var NrK = [-3, nz, QnK, {
            [SA1]: CA1,
            [hA1]: 403,
            [yA1]: ["IDPRejectedClaim", 403]
        },
        [IA1],
        [0]
    ];
    ri.TypeRegistry.for(nz).registerError(NrK, zT8);
    var TrK = [-3, nz, gnK, {
            [SA1]: CA1,
            [hA1]: 400,
            [yA1]: ["InvalidIdentityToken", 400]
        },
        [IA1],
        [0]
    ];
    ri.TypeRegistry.for(nz).registerError(TrK, wT8);
    var vrK = [-3, nz, pnK, {
            [SA1]: CA1,
            [hA1]: 400,
            [yA1]: ["MalformedPolicyDocument", 400]
        },
        [IA1],
        [0]
    ];
    ri.TypeRegistry.for(nz).registerError(vrK, qT8);
    var ErK = [-3, nz, onK, {
            [SA1]: CA1,
            [hA1]: 400,
            [yA1]: ["PackedPolicyTooLarge", 400]
        },
        [IA1],
        [0]
    ];
    ri.TypeRegistry.for(nz).registerError(ErK, KT8);
    var krK = [3, nz, nnK, 0, [OrK],
            [0]
        ],
        LrK = [3, nz, inK, 0, [dnK, bnK],
            [0, 0]
        ],
        RrK = [-3, nz, snK, {
                [SA1]: CA1,
                [hA1]: 403,
                [yA1]: ["RegionDisabledException", 403]
            },
            [IA1],
            [0]
        ];
    ri.TypeRegistry.for(nz).registerError(RrK, YT8);
    var yrK = [3, nz, wrK, 0, [UnK, HrK],
            [0, 0]
        ],
        CrK = [-3, jT8, "STSServiceException", 0, [],
            []
        ];
    ri.TypeRegistry.for(jT8).registerError(CrK, zg);
    var WT8 = [1, nz, XrK, 0, () => krK],
        SrK = [1, nz, lnK, 0, () => LrK],
        hrK = [1, nz, DrK, 0, () => yrK],
        IrK = [9, nz, LnK, 0, () => PrK, () => WrK],
        xrK = [9, nz, SnK, 0, () => GrK, () => ZrK];
    class ae1 extends oE1.Command.classBuilder().ep(eN8.commonParams).m(function(A, q, K, Y) {
        return [tN8.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(IrK).build() {}
    class se1 extends oE1.Command.classBuilder().ep(eN8.commonParams).m(function(A, q, K, Y) {
        return [tN8.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(xrK).build() {}
    var brK = {
        AssumeRoleCommand: ae1,
        AssumeRoleWithWebIdentityCommand: se1
    };
    class Tl6 extends rE1.STSClient {}
    oE1.createAggregatedClient(brK, Tl6);
    var GT8 = (A) => {
            if (typeof A?.Arn === "string") {
                let q = A.Arn.split(":");
                if (q.length > 4 && q[4] !== "") return q[4]
            }
            return
        },
        ZT8 = async (A, q, K, Y = {}) => {
            let z = typeof A === "function" ? await A() : A,
                w = typeof q === "function" ? await q() : q,
                H = await vnK.stsRegionDefaultResolver(Y)();
            return K?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${z} (credential provider clientConfig)`, `${w} (contextual client)`, `${H} (STS default: AWS_REGION, profile region, or us-east-1)`), z ?? w ?? H
        }, urK = (A, q) => {
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
                    } = A, W = await ZT8(D, A?.parentClientConfig?.region, M, {
                        logger: J,
                        profile: X
                    }), G = !fT8(j);
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
                } = await K.send(new ae1(w));
                if (!H || !H.AccessKeyId || !H.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${w.RoleArn}`);
                let O = GT8($),
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
                return Zl6.setCredentialFeature(_, "CREDENTIALS_STS_ASSUME_ROLE", "i"), _
            }
        }, BrK = (A, q) => {
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
                    } = A, M = await ZT8(J, A?.parentClientConfig?.region, D, {
                        logger: O,
                        profile: _
                    }), P = !fT8(X);
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
                } = await K.send(new se1(Y));
                if (!z || !z.AccessKeyId || !z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${Y.RoleArn}`);
                let H = GT8(w),
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
                if (H) Zl6.setCredentialFeature($, "RESOLVED_ACCOUNT_ID", "T");
                return Zl6.setCredentialFeature($, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), $
            }
        }, fT8 = (A) => {
            return A?.metadata?.handlerProtocol === "h2"
        }, VT8 = (A, q) => {
            if (!q) return A;
            else return class extends A {
                constructor(Y) {
                    super(Y);
                    for (let z of q) this.middlewareStack.use(z)
                }
            }
        }, NT8 = (A = {}, q) => urK(A, VT8(rE1.STSClient, q)), TT8 = (A = {}, q) => BrK(A, VT8(rE1.STSClient, q)), mrK = (A) => (q) => A({
            roleAssumer: NT8(q),
            roleAssumerWithWebIdentity: TT8(q),
            ...q
        });
    Object.defineProperty(oe1, "$Command", {
        enumerable: !0,
        get: function() {
            return oE1.Command
        }
    });
    oe1.AssumeRoleCommand = ae1;
    oe1.AssumeRoleWithWebIdentityCommand = se1;
    oe1.ExpiredTokenException = AT8;
    oe1.IDPCommunicationErrorException = HT8;
    oe1.IDPRejectedClaimException = zT8;
    oe1.InvalidIdentityTokenException = wT8;
    oe1.MalformedPolicyDocumentException = qT8;
    oe1.PackedPolicyTooLargeException = KT8;
    oe1.RegionDisabledException = YT8;
    oe1.STS = Tl6;
    oe1.STSServiceException = zg;
    oe1.decorateDefaultCredentialProvider = mrK;
    oe1.getDefaultRoleAssumer = NT8;
    oe1.getDefaultRoleAssumerWithWebIdentity = TT8;
    Object.keys(rE1).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(oe1, A)) Object.defineProperty(oe1, A, {
            enumerable: !0,
            get: function() {
                return rE1[A]
            }
        })
    })
})
// @from(Ln 75191, Col 4)
ee1 = R((zoK) => {
    var El6 = Ob(),
        vl6 = wX(),
        trK = h1("child_process"),
        erK = h1("util"),
        AoK = of(),
        qoK = (A, q, K) => {
            if (q.Version !== 1) throw Error(`Profile ${A} credential_process did not return Version 1.`);
            if (q.AccessKeyId === void 0 || q.SecretAccessKey === void 0) throw Error(`Profile ${A} credential_process returned invalid credentials.`);
            if (q.Expiration) {
                let w = new Date;
                if (new Date(q.Expiration) < w) throw Error(`Profile ${A} credential_process returned expired credentials.`)
            }
            let Y = q.AccountId;
            if (!Y && K?.[A]?.aws_account_id) Y = K[A].aws_account_id;
            let z = {
                accessKeyId: q.AccessKeyId,
                secretAccessKey: q.SecretAccessKey,
                ...q.SessionToken && {
                    sessionToken: q.SessionToken
                },
                ...q.Expiration && {
                    expiration: new Date(q.Expiration)
                },
                ...q.CredentialScope && {
                    credentialScope: q.CredentialScope
                },
                ...Y && {
                    accountId: Y
                }
            };
            return AoK.setCredentialFeature(z, "CREDENTIALS_PROCESS", "w"), z
        },
        KoK = async (A, q, K) => {
            let Y = q[A];
            if (q[A]) {
                let z = Y.credential_process;
                if (z !== void 0) {
                    let w = erK.promisify(El6.externalDataInterceptor?.getTokenRecord?.().exec ?? trK.exec);
                    try {
                        let {
                            stdout: H
                        } = await w(z), $;
                        try {
                            $ = JSON.parse(H.trim())
                        } catch {
                            throw Error(`Profile ${A} credential_process returned invalid JSON.`)
                        }
                        return qoK(A, $, q)
                    } catch (H) {
                        throw new vl6.CredentialsProviderError(H.message, {
                            logger: K
                        })
                    }
                } else throw new vl6.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
                    logger: K
                })
            } else throw new vl6.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
                logger: K
            })
        }, YoK = (A = {}) => async ({
            callerClientConfig: q
        } = {}) => {
            A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
            let K = await El6.parseKnownFiles(A);
            return KoK(El6.getProfileName({
                profile: A.profile ?? q?.profile
            }), K, A.logger)
        };
    zoK.fromProcess = YoK
})
// @from(Ln 75262, Col 4)
kl6 = R((jb) => {
    var HoK = jb && jb.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        $oK = jb && jb.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        OoK = jb && jb.__importStar || function() {
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
                        if (Y[z] !== "default") HoK(K, q, Y[z])
                }
                return $oK(K, q), K
            }
        }();
    Object.defineProperty(jb, "__esModule", {
        value: !0
    });
    jb.fromWebToken = void 0;
    var _oK = (A) => async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
        let {
            roleArn: K,
            roleSessionName: Y,
            webIdentityToken: z,
            providerId: w,
            policyArns: H,
            policy: $,
            durationSeconds: O
        } = A, {
            roleAssumerWithWebIdentity: _
        } = A;
        if (!_) {
            let {
                getDefaultRoleAssumerWithWebIdentity: J
            } = await Promise.resolve().then(() => OoK(te1()));
            _ = J({
                ...A.clientConfig,
                credentialProviderLogger: A.logger,
                parentClientConfig: {
                    ...q?.callerClientConfig,
                    ...A.parentClientConfig
                }
            }, A.clientPlugins)
        }
        return _({
            RoleArn: K,
            RoleSessionName: Y ?? `aws-sdk-js-session-${Date.now()}`,
            WebIdentityToken: z,
            ProviderId: w,
            PolicyArns: H,
            Policy: $,
            DurationSeconds: O
        })
    };
    jb.fromWebToken = _oK
})
// @from(Ln 75346, Col 4)
LT8 = R((ET8) => {
    Object.defineProperty(ET8, "__esModule", {
        value: !0
    });
    ET8.fromTokenFile = void 0;
    var JoK = of(),
        XoK = wX(),
        DoK = Ob(),
        joK = h1("fs"),
        MoK = kl6(),
        vT8 = "AWS_WEB_IDENTITY_TOKEN_FILE",
        PoK = "AWS_ROLE_ARN",
        WoK = "AWS_ROLE_SESSION_NAME",
        GoK = (A = {}) => async (q) => {
            A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
            let K = A?.webIdentityTokenFile ?? process.env[vT8],
                Y = A?.roleArn ?? process.env[PoK],
                z = A?.roleSessionName ?? process.env[WoK];
            if (!K || !Y) throw new XoK.CredentialsProviderError("Web identity configuration not specified", {
                logger: A.logger
            });
            let w = await (0, MoK.fromWebToken)({
                ...A,
                webIdentityToken: DoK.externalDataInterceptor?.getTokenRecord?.()[K] ?? (0, joK.readFileSync)(K, {
                    encoding: "ascii"
                }),
                roleArn: Y,
                roleSessionName: z
            })(q);
            if (K === process.env[vT8])(0, JoK.setCredentialFeature)(w, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
            return w
        };
    ET8.fromTokenFile = GoK
})
// @from(Ln 75380, Col 4)
sE1 = R((aE1) => {
    var RT8 = LT8(),
        yT8 = kl6();
    Object.keys(RT8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(aE1, A)) Object.defineProperty(aE1, A, {
            enumerable: !0,
            get: function() {
                return RT8[A]
            }
        })
    });
    Object.keys(yT8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(aE1, A)) Object.defineProperty(aE1, A, {
            enumerable: !0,
            get: function() {
                return yT8[A]
            }
        })
    })
})
// @from(Ln 75400, Col 4)
yl6 = R((xoK) => {
    var Rl6 = Ob(),
        tE1 = wX(),
        wg = of(),
        ZoK = Hl6(),
        foK = (A, q, K) => {
            let Y = {
                EcsContainer: async (z) => {
                    let {
                        fromHttp: w
                    } = await Promise.resolve().then(() => o(Je1())), {
                        fromContainerMetadata: H
                    } = await Promise.resolve().then(() => o(VA1()));
                    return K?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => tE1.chain(w(z ?? {}), H(z))().then(Ll6)
                },
                Ec2InstanceMetadata: async (z) => {
                    K?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
                    let {
                        fromInstanceMetadata: w
                    } = await Promise.resolve().then(() => o(VA1()));
                    return async () => w(z)().then(Ll6)
                },
                Environment: async (z) => {
                    K?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
                    let {
                        fromEnv: w
                    } = await Promise.resolve().then(() => o(He1()));
                    return async () => w(z)().then(Ll6)
                }
            };
            if (A in Y) return Y[A];
            else throw new tE1.CredentialsProviderError(`Unsupported credential source in profile ${q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
                logger: K
            })
        },
        Ll6 = (A) => wg.setCredentialFeature(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"),
        VoK = (A, {
            profile: q = "default",
            logger: K
        } = {}) => {
            return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (NoK(A, {
                profile: q,
                logger: K
            }) || ToK(A, {
                profile: q,
                logger: K
            }))
        },
        NoK = (A, {
            profile: q,
            logger: K
        }) => {
            let Y = typeof A.source_profile === "string" && typeof A.credential_source > "u";
            if (Y) K?.debug?.(`    ${q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
            return Y
        },
        ToK = (A, {
            profile: q,
            logger: K
        }) => {
            let Y = typeof A.credential_source === "string" && typeof A.source_profile > "u";
            if (Y) K?.debug?.(`    ${q} isCredentialSourceProfile credential_source=${A.credential_source}`);
            return Y
        },
        voK = async (A, q, K, Y = {}, z) => {
            K.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
            let w = q[A],
                {
                    source_profile: H,
                    region: $
                } = w;
            if (!K.roleAssumer) {
                let {
                    getDefaultRoleAssumer: _
                } = await Promise.resolve().then(() => o(te1()));
                K.roleAssumer = _({
                    ...K.clientConfig,
                    credentialProviderLogger: K.logger,
                    parentClientConfig: {
                        ...K?.parentClientConfig,
                        region: $ ?? K?.parentClientConfig?.region
                    }
                }, K.clientPlugins)
            }
            if (H && H in Y) throw new tE1.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${Rl6.getProfileName(K)}. Profiles visited: ` + Object.keys(Y).join(", "), {
                logger: K.logger
            });
            K.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${H?`source_profile=[${H}]`:`profile=[${A}]`}`);
            let O = H ? z(H, q, K, {
                ...Y,
                [H]: !0
            }, CT8(q[H] ?? {})) : (await foK(w.credential_source, A, K.logger)(K))();
            if (CT8(w)) return O.then((_) => wg.setCredentialFeature(_, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
            else {
                let _ = {
                        RoleArn: w.role_arn,
                        RoleSessionName: w.role_session_name || `aws-sdk-js-${Date.now()}`,
                        ExternalId: w.external_id,
                        DurationSeconds: parseInt(w.duration_seconds || "3600", 10)
                    },
                    {
                        mfa_serial: J
                    } = w;
                if (J) {
                    if (!K.mfaCodeProvider) throw new tE1.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
                        logger: K.logger,
                        tryNextLink: !1
                    });
                    _.SerialNumber = J, _.TokenCode = await K.mfaCodeProvider(J)
                }
                let X = await O;
                return K.roleAssumer(X, _).then((D) => wg.setCredentialFeature(D, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
            }
        }, CT8 = (A) => {
            return !A.role_arn && !!A.credential_source
        }, EoK = (A) => {
            return Boolean(A && A.login_session)
        }, koK = async (A, q) => {
            let K = await ZoK.fromLoginCredentials({
                ...q,
                profile: A
            })();
            return wg.setCredentialFeature(K, "CREDENTIALS_PROFILE_LOGIN", "AC")
        }, LoK = (A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", RoK = async (A, q) => Promise.resolve().then(() => o(ee1())).then(({
            fromProcess: K
        }) => K({
            ...A,
            profile: q
        })().then((Y) => wg.setCredentialFeature(Y, "CREDENTIALS_PROFILE_PROCESS", "v"))), yoK = async (A, q, K = {}) => {
            let {
                fromSSO: Y
            } = await Promise.resolve().then(() => o(Qe1()));
            return Y({
                profile: A,
                logger: K.logger,
                parentClientConfig: K.parentClientConfig,
                clientConfig: K.clientConfig
            })().then((z) => {
                if (q.sso_session) return wg.setCredentialFeature(z, "CREDENTIALS_PROFILE_SSO", "r");
                else return wg.setCredentialFeature(z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
            })
        }, CoK = (A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), ST8 = (A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, hT8 = async (A, q) => {
            q?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
            let K = {
                accessKeyId: A.aws_access_key_id,
                secretAccessKey: A.aws_secret_access_key,
                sessionToken: A.aws_session_token,
                ...A.aws_credential_scope && {
                    credentialScope: A.aws_credential_scope
                },
                ...A.aws_account_id && {
                    accountId: A.aws_account_id
                }
            };
            return wg.setCredentialFeature(K, "CREDENTIALS_PROFILE", "n")
        }, SoK = (A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, hoK = async (A, q) => Promise.resolve().then(() => o(sE1())).then(({
            fromTokenFile: K
        }) => K({
            webIdentityTokenFile: A.web_identity_token_file,
            roleArn: A.role_arn,
            roleSessionName: A.role_session_name,
            roleAssumerWithWebIdentity: q.roleAssumerWithWebIdentity,
            logger: q.logger,
            parentClientConfig: q.parentClientConfig
        })().then((Y) => wg.setCredentialFeature(Y, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), IT8 = async (A, q, K, Y = {}, z = !1) => {
            let w = q[A];
            if (Object.keys(Y).length > 0 && ST8(w)) return hT8(w, K);
            if (z || VoK(w, {
                    profile: A,
                    logger: K.logger
                })) return voK(A, q, K, Y, IT8);
            if (ST8(w)) return hT8(w, K);
            if (SoK(w)) return hoK(w, K);
            if (LoK(w)) return RoK(K, A);
            if (CoK(w)) return await yoK(A, w, K);
            if (EoK(w)) return koK(A, K);
            throw new tE1.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
                logger: K.logger
            })
        }, IoK = (A = {}) => async ({
            callerClientConfig: q
        } = {}) => {
            let K = {
                ...A,
                parentClientConfig: {
                    ...q,
                    ...A.parentClientConfig
                }
            };
            K.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
            let Y = await Rl6.parseKnownFiles(K);
            return IT8(Rl6.getProfileName({
                profile: A.profile ?? q?.profile
            }), Y, K)
        };
    xoK.fromIni = IoK
})
// @from(Ln 75597, Col 4)
xA1 = R((UoK) => {
    var Cl6 = He1(),
        eE1 = wX(),
        uoK = Ob(),
        xT8 = "AWS_EC2_METADATA_DISABLED",
        BoK = async (A) => {
            let {
                ENV_CMDS_FULL_URI: q,
                ENV_CMDS_RELATIVE_URI: K,
                fromContainerMetadata: Y,
                fromInstanceMetadata: z
            } = await Promise.resolve().then(() => o(VA1()));
            if (process.env[K] || process.env[q]) {
                A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
                let {
                    fromHttp: w
                } = await Promise.resolve().then(() => o(Je1()));
                return eE1.chain(w(A), Y(A))
            }
            if (process.env[xT8] && process.env[xT8] !== "false") return async () => {
                throw new eE1.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
                    logger: A.logger
                })
            };
            return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), z(A)
        };

    function moK(A, q) {
        let K = FoK(A),
            Y, z, w, H = async ($) => {
                if ($?.forceRefresh) return await K($);
                if (w?.expiration) {
                    if (w?.expiration?.getTime() < Date.now()) w = void 0
                }
                if (Y) await Y;
                else if (!w || q?.(w))
                    if (w) {
                        if (!z) z = K($).then((O) => {
                            w = O, z = void 0
                        })
                    } else return Y = K($).then((O) => {
                        w = O, Y = void 0
                    }), H($);
                return w
            };
        return H
    }
    var FoK = (A) => async (q) => {
        let K;
        for (let Y of A) try {
            return await Y(q)
        } catch (z) {
            if (K = z, z?.tryNextLink) continue;
            throw z
        }
        throw K
    }, bT8 = !1, QoK = (A = {}) => moK([async () => {
        if (A.profile ?? process.env[uoK.ENV_PROFILE]) {
            if (process.env[Cl6.ENV_KEY] && process.env[Cl6.ENV_SECRET]) {
                if (!bT8)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn.bind(A.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), bT8 = !0
            }
            throw new eE1.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
                logger: A.logger,
                tryNextLink: !0
            })
        }
        return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), Cl6.fromEnv(A)()
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
        let {
            ssoStartUrl: K,
            ssoAccountId: Y,
            ssoRegion: z,
            ssoRoleName: w,
            ssoSession: H
        } = A;
        if (!K && !Y && !z && !w && !H) throw new eE1.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
            logger: A.logger
        });
        let {
            fromSSO: $
        } = await Promise.resolve().then(() => o(Qe1()));
        return $(A)(q)
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
        let {
            fromIni: K
        } = await Promise.resolve().then(() => o(yl6()));
        return K(A)(q)
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
        let {
            fromProcess: K
        } = await Promise.resolve().then(() => o(ee1()));
        return K(A)(q)
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
        let {
            fromTokenFile: K
        } = await Promise.resolve().then(() => o(sE1()));
        return K(A)(q)
    }, async () => {
        return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await BoK(A))()
    }, async () => {
        throw new eE1.CredentialsProviderError("Could not load credentials from any providers", {
            tryNextLink: !1,
            logger: A.logger
        })
    }], uT8), goK = (A) => A?.expiration !== void 0, uT8 = (A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000;
    UoK.credentialsTreatedAsExpired = uT8;
    UoK.credentialsWillNeedRefresh = goK;
    UoK.defaultProvider = QoK
})
// @from(Ln 75718, Col 4)
BT8 = R((ioK) => {
    var loK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    ioK.isArrayBuffer = loK
})
// @from(Ln 75722, Col 4)
hl6 = R((soK) => {
    var roK = BT8(),
        Sl6 = h1("buffer"),
        ooK = (A, q = 0, K = A.byteLength - q) => {
            if (!roK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Sl6.Buffer.from(A, q, K)
        },
        aoK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Sl6.Buffer.from(A, q) : Sl6.Buffer.from(A)
        };
    soK.fromArrayBuffer = ooK;
    soK.fromString = aoK
})
// @from(Ln 75736, Col 4)
QT8 = R((mT8) => {
    Object.defineProperty(mT8, "__esModule", {
        value: !0
    });
    mT8.fromBase64 = void 0;
    var AaK = hl6(),
        qaK = /^[A-Za-z0-9+/]*={0,2}$/,
        KaK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!qaK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, AaK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    mT8.fromBase64 = KaK
})
// @from(Ln 75751, Col 4)
pT8 = R((gT8) => {
    Object.defineProperty(gT8, "__esModule", {
        value: !0
    });
    gT8.toBase64 = void 0;
    var YaK = hl6(),
        zaK = Z2(),
        waK = (A) => {
            let q;
            if (typeof A === "string") q = (0, zaK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, YaK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    gT8.toBase64 = waK
})
// @from(Ln 75767, Col 4)
lT8 = R((Ak1) => {
    var dT8 = QT8(),
        cT8 = pT8();
    Object.keys(dT8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Ak1, A)) Object.defineProperty(Ak1, A, {
            enumerable: !0,
            get: function() {
                return dT8[A]
            }
        })
    });
    Object.keys(cT8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Ak1, A)) Object.defineProperty(Ak1, A, {
            enumerable: !0,
            get: function() {
                return cT8[A]
            }
        })
    })
})
// @from(Ln 75787, Col 4)
Pv8 = R((jv8) => {
    Object.defineProperty(jv8, "__esModule", {
        value: !0
    });
    jv8.ruleSet = void 0;
    var Yv8 = "required",
        S5 = "type",
        Hz = "fn",
        $z = "argv",
        ai = "ref",
        iT8 = !1,
        Il6 = !0,
        oi = "booleanEquals",
        wM = "stringEquals",
        zv8 = "sigv4",
        wv8 = "sts",
        Hv8 = "us-east-1",
        C$ = "endpoint",
        nT8 = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
        Mb = "tree",
        K$1 = "error",
        bl6 = "getAttr",
        rT8 = {
            [Yv8]: !1,
            [S5]: "string"
        },
        xl6 = {
            [Yv8]: !0,
            default: !1,
            [S5]: "boolean"
        },
        $v8 = {
            [ai]: "Endpoint"
        },
        oT8 = {
            [Hz]: "isSet",
            [$z]: [{
                [ai]: "Region"
            }]
        },
        HM = {
            [ai]: "Region"
        },
        aT8 = {
            [Hz]: "aws.partition",
            [$z]: [HM],
            assign: "PartitionResult"
        },
        Ov8 = {
            [ai]: "UseFIPS"
        },
        _v8 = {
            [ai]: "UseDualStack"
        },
        tP = {
            url: "https://sts.amazonaws.com",
            properties: {
                authSchemes: [{
                    name: zv8,
                    signingName: wv8,
                    signingRegion: Hv8
                }]
            },
            headers: {}
        },
        CT = {},
        sT8 = {
            conditions: [{
                [Hz]: wM,
                [$z]: [HM, "aws-global"]
            }],
            [C$]: tP,
            [S5]: C$
        },
        Jv8 = {
            [Hz]: oi,
            [$z]: [Ov8, !0]
        },
        Xv8 = {
            [Hz]: oi,
            [$z]: [_v8, !0]
        },
        tT8 = {
            [Hz]: bl6,
            [$z]: [{
                [ai]: "PartitionResult"
            }, "supportsFIPS"]
        },
        Dv8 = {
            [ai]: "PartitionResult"
        },
        eT8 = {
            [Hz]: oi,
            [$z]: [!0, {
                [Hz]: bl6,
                [$z]: [Dv8, "supportsDualStack"]
            }]
        },
        Av8 = [{
            [Hz]: "isSet",
            [$z]: [$v8]
        }],
        qv8 = [Jv8],
        Kv8 = [Xv8],
        HaK = {
            version: "1.0",
            parameters: {
                Region: rT8,
                UseDualStack: xl6,
                UseFIPS: xl6,
                Endpoint: rT8,
                UseGlobalEndpoint: xl6
            },
            rules: [{
                conditions: [{
                    [Hz]: oi,
                    [$z]: [{
                        [ai]: "UseGlobalEndpoint"
                    }, Il6]
                }, {
                    [Hz]: "not",
                    [$z]: Av8
                }, oT8, aT8, {
                    [Hz]: oi,
                    [$z]: [Ov8, iT8]
                }, {
                    [Hz]: oi,
                    [$z]: [_v8, iT8]
                }],
                rules: [{
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "ap-northeast-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "ap-south-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "ap-southeast-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "ap-southeast-2"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, sT8, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "ca-central-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "eu-central-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "eu-north-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "eu-west-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "eu-west-2"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "eu-west-3"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "sa-east-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, Hv8]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "us-east-2"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "us-west-1"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    conditions: [{
                        [Hz]: wM,
                        [$z]: [HM, "us-west-2"]
                    }],
                    endpoint: tP,
                    [S5]: C$
                }, {
                    endpoint: {
                        url: nT8,
                        properties: {
                            authSchemes: [{
                                name: zv8,
                                signingName: wv8,
                                signingRegion: "{Region}"
                            }]
                        },
                        headers: CT
                    },
                    [S5]: C$
                }],
                [S5]: Mb
            }, {
                conditions: Av8,
                rules: [{
                    conditions: qv8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    [S5]: K$1
                }, {
                    conditions: Kv8,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    [S5]: K$1
                }, {
                    endpoint: {
                        url: $v8,
                        properties: CT,
                        headers: CT
                    },
                    [S5]: C$
                }],
                [S5]: Mb
            }, {
                conditions: [oT8],
                rules: [{
                    conditions: [aT8],
                    rules: [{
                        conditions: [Jv8, Xv8],
                        rules: [{
                            conditions: [{
                                [Hz]: oi,
                                [$z]: [Il6, tT8]
                            }, eT8],
                            rules: [{
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: CT,
                                    headers: CT
                                },
                                [S5]: C$
                            }],
                            [S5]: Mb
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            [S5]: K$1
                        }],
                        [S5]: Mb
                    }, {
                        conditions: qv8,
                        rules: [{
                            conditions: [{
                                [Hz]: oi,
                                [$z]: [tT8, Il6]
                            }],
                            rules: [{
                                conditions: [{
                                    [Hz]: wM,
                                    [$z]: [{
                                        [Hz]: bl6,
                                        [$z]: [Dv8, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://sts.{Region}.amazonaws.com",
                                    properties: CT,
                                    headers: CT
                                },
                                [S5]: C$
                            }, {
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: CT,
                                    headers: CT
                                },
                                [S5]: C$
                            }],
                            [S5]: Mb
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            [S5]: K$1
                        }],
                        [S5]: Mb
                    }, {
                        conditions: Kv8,
                        rules: [{
                            conditions: [eT8],
                            rules: [{
                                endpoint: {
                                    url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: CT,
                                    headers: CT
                                },
                                [S5]: C$
                            }],
                            [S5]: Mb
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            [S5]: K$1
                        }],
                        [S5]: Mb
                    }, sT8, {
                        endpoint: {
                            url: nT8,
                            properties: CT,
                            headers: CT
                        },
                        [S5]: C$
                    }],
                    [S5]: Mb
                }],
                [S5]: Mb
            }, {
                error: "Invalid Configuration: Missing Region",
                [S5]: K$1
            }]
        };
    jv8.ruleSet = HaK
})
// @from(Ln 76151, Col 4)
Zv8 = R((Wv8) => {
    Object.defineProperty(Wv8, "__esModule", {
        value: !0
    });
    Wv8.defaultEndpointResolver = void 0;
    var $aK = zb(),
        ul6 = GC(),
        OaK = Pv8(),
        _aK = new ul6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
        }),
        JaK = (A, q = {}) => {
            return _aK.get(A, () => (0, ul6.resolveEndpoint)(OaK.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    Wv8.defaultEndpointResolver = JaK;
    ul6.customEndpointFunctions.aws = $aK.awsEndpointFunctions
})
// @from(Ln 76172, Col 4)
vv8 = R((Nv8) => {
    Object.defineProperty(Nv8, "__esModule", {
        value: !0
    });
    Nv8.getRuntimeConfig = void 0;
    var XaK = YH(),
        DaK = eQ(),
        jaK = lz(),
        MaK = fA1(),
        PaK = fk(),
        fv8 = lT8(),
        Vv8 = Z2(),
        WaK = ep6(),
        GaK = Zv8(),
        ZaK = (A) => {
            return {
                apiVersion: "2011-06-15",
                base64Decoder: A?.base64Decoder ?? fv8.fromBase64,
                base64Encoder: A?.base64Encoder ?? fv8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? GaK.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? WaK.defaultSTSHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new XaK.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new jaK.NoAuthSigner
                }],
                logger: A?.logger ?? new MaK.NoOpLogger,
                protocol: A?.protocol ?? new DaK.AwsQueryProtocol({
                    defaultNamespace: "com.amazonaws.sts",
                    xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
                    version: "2011-06-15"
                }),
                serviceId: A?.serviceId ?? "STS",
                urlParser: A?.urlParser ?? PaK.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? Vv8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? Vv8.toUtf8
            }
        };
    Nv8.getRuntimeConfig = ZaK
})
// @from(Ln 76218, Col 4)
Sv8 = R((yv8) => {
    Object.defineProperty(yv8, "__esModule", {
        value: !0
    });
    yv8.getRuntimeConfig = void 0;
    var faK = n2(),
        VaK = faK.__importDefault(KP8()),
        Bl6 = YH(),
        Ev8 = xA1(),
        kv8 = oQ(),
        A16 = YJ(),
        NaK = lz(),
        TaK = aQ(),
        Lv8 = qM(),
        bA1 = af(),
        Rv8 = cf(),
        vaK = sQ(),
        EaK = _b(),
        kaK = vv8(),
        LaK = fA1(),
        RaK = qg(),
        yaK = fA1(),
        CaK = (A) => {
            (0, yaK.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, RaK.resolveDefaultsModeConfig)(A),
                K = () => q().then(LaK.loadConfigsForDefaultMode),
                Y = (0, kaK.getRuntimeConfig)(A);
            (0, Bl6.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, bA1.loadConfig)(Bl6.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? vaK.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? Ev8.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, kv8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: VaK.default.version
                }),
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (w) => w.getIdentityProvider("aws.auth#sigv4") || (async (H) => await (0, Ev8.defaultProvider)(H?.__config || {})()),
                    signer: new Bl6.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (w) => w.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new NaK.NoAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, bA1.loadConfig)(Lv8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, bA1.loadConfig)(A16.NODE_REGION_CONFIG_OPTIONS, {
                    ...A16.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: Rv8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, bA1.loadConfig)({
                    ...Lv8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || EaK.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? TaK.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? Rv8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, bA1.loadConfig)(A16.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, bA1.loadConfig)(A16.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, bA1.loadConfig)(kv8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    yv8.getRuntimeConfig = CaK
})
// @from(Ln 76290, Col 4)
bv8 = R((uaK) => {
    var SaK = lp6(),
        haK = (A) => {
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
        IaK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class hv8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = SaK.FieldPosition.HEADER,
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
    class Iv8 {
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
    class q16 {
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
            let q = new q16({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = xaK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return q16.clone(this)
        }
    }

    function xaK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class xv8 {
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

    function baK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    uaK.Field = hv8;
    uaK.Fields = Iv8;
    uaK.HttpRequest = q16;
    uaK.HttpResponse = xv8;
    uaK.getHttpHandlerExtensionConfiguration = haK;
    uaK.isValidHostname = baK;
    uaK.resolveHttpHandlerRuntimeConfig = IaK
})