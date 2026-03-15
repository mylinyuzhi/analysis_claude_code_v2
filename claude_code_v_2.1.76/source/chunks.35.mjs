
// @from(Ln 84887, Col 4)
L88 = x((HD5) => {
    var _D5 = mT(),
        Yo = vJ(),
        E88 = Du(),
        wD5 = xoA(),
        RK1 = x6("node:crypto"),
        V88 = x6("node:fs"),
        OD5 = x6("node:os"),
        k88 = x6("node:path");
    class y88 {
        profileData;
        init;
        callerClientConfig;
        static REFRESH_THRESHOLD = 300000;
        constructor(A, q, K) {
            this.profileData = A, this.init = q, this.callerClientConfig = K
        }
        async loadCredentials() {
            let A = await this.loadToken();
            if (!A) throw new Yo.CredentialsProviderError(`Failed to load a token for session ${this.loginSession}, please re-authenticate using aws login`, {
                tryNextLink: !1,
                logger: this.logger
            });
            let q = A.accessToken,
                K = Date.now();
            if (new Date(q.expiresAt).getTime() - K <= y88.REFRESH_THRESHOLD) return this.refresh(A);
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
            } = await Promise.resolve().then(() => t(xaA())), {
                logger: Y,
                userAgentAppId: z
            } = this.callerClientConfig ?? {}, w = ((j) => {
                return j?.metadata?.handlerProtocol === "h2"
            })(this.callerClientConfig?.requestHandler) ? void 0 : this.callerClientConfig?.requestHandler, O = this.profileData.region ?? await this.callerClientConfig?.region?.() ?? process.env.AWS_REGION, $ = new q({
                credentials: {
                    accessKeyId: "",
                    secretAccessKey: ""
                },
                region: O,
                requestHandler: w,
                logger: Y,
                userAgentAppId: z,
                ...this.init?.clientConfig
            });
            this.createDPoPInterceptor($.middlewareStack);
            let H = {
                tokenInput: {
                    clientId: A.clientId,
                    refreshToken: A.refreshToken,
                    grantType: "refresh_token"
                }
            };
            try {
                let j = await $.send(new K(H)),
                    {
                        accessKeyId: J,
                        secretAccessKey: M,
                        sessionToken: D
                    } = j.tokenOutput?.accessToken ?? {},
                    {
                        refreshToken: X,
                        expiresIn: P
                    } = j.tokenOutput ?? {};
                if (!J || !M || !D || !X) throw new Yo.CredentialsProviderError("Token refresh response missing required fields", {
                    logger: this.logger,
                    tryNextLink: !1
                });
                let W = (P ?? 900) * 1000,
                    Z = new Date(Date.now() + W),
                    G = {
                        ...A,
                        accessToken: {
                            ...A.accessToken,
                            accessKeyId: J,
                            secretAccessKey: M,
                            sessionToken: D,
                            expiresAt: Z.toISOString()
                        },
                        refreshToken: X
                    };
                await this.saveToken(G);
                let f = G.accessToken;
                return {
                    accessKeyId: f.accessKeyId,
                    secretAccessKey: f.secretAccessKey,
                    sessionToken: f.sessionToken,
                    accountId: f.accountId,
                    expiration: Z
                }
            } catch (j) {
                if (j.name === "AccessDeniedException") {
                    let J = j.error,
                        M;
                    switch (J) {
                        case "TOKEN_EXPIRED":
                            M = "Your session has expired. Please reauthenticate.";
                            break;
                        case "USER_CREDENTIALS_CHANGED":
                            M = "Unable to refresh credentials because of a change in your password. Please reauthenticate with your new password.";
                            break;
                        case "INSUFFICIENT_PERMISSIONS":
                            M = "Unable to refresh credentials due to insufficient permissions. You may be missing permission for the 'CreateOAuth2Token' action.";
                            break;
                        default:
                            M = `Failed to refresh token: ${String(j)}. Please re-authenticate using \`aws login\``
                    }
                    throw new Yo.CredentialsProviderError(M, {
                        logger: this.logger,
                        tryNextLink: !1
                    })
                }
                throw new Yo.CredentialsProviderError(`Failed to refresh token: ${String(j)}. Please re-authenticate using aws login`, {
                    logger: this.logger
                })
            }
        }
        async loadToken() {
            let A = this.getTokenFilePath();
            try {
                let q;
                try {
                    q = await E88.readFile(A, {
                        ignoreCache: this.init?.ignoreCache
                    })
                } catch {
                    q = await V88.promises.readFile(A, "utf8")
                }
                let K = JSON.parse(q),
                    Y = ["accessToken", "clientId", "refreshToken", "dpopKey"].filter((z) => !K[z]);
                if (!K.accessToken?.accountId) Y.push("accountId");
                if (Y.length > 0) throw new Yo.CredentialsProviderError(`Token validation failed, missing fields: ${Y.join(", ")}`, {
                    logger: this.logger,
                    tryNextLink: !1
                });
                return K
            } catch (q) {
                throw new Yo.CredentialsProviderError(`Failed to load token from ${A}: ${String(q)}`, {
                    logger: this.logger,
                    tryNextLink: !1
                })
            }
        }
        async saveToken(A) {
            let q = this.getTokenFilePath(),
                K = k88.dirname(q);
            try {
                await V88.promises.mkdir(K, {
                    recursive: !0
                })
            } catch (Y) {}
            await V88.promises.writeFile(q, JSON.stringify(A, null, 2), "utf8")
        }
        getTokenFilePath() {
            let A = process.env.AWS_LOGIN_CACHE_DIRECTORY ?? k88.join(OD5.homedir(), ".aws", "login", "cache"),
                q = Buffer.from(this.loginSession, "utf8"),
                K = RK1.createHash("sha256").update(q).digest("hex");
            return k88.join(A, `${K}.json`)
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
                _ = A.subarray(q, q + z);
            Y = Y[0] === 0 ? Y.subarray(1) : Y, _ = _[0] === 0 ? _.subarray(1) : _;
            let w = Buffer.concat([Buffer.alloc(32 - Y.length), Y]),
                O = Buffer.concat([Buffer.alloc(32 - _.length), _]);
            return Buffer.concat([w, O])
        }
        createDPoPInterceptor(A) {
            A.add((q) => async (K) => {
                if (wD5.HttpRequest.isInstance(K.request)) {
                    let Y = K.request,
                        z = `${Y.protocol}//${Y.hostname}${Y.port?`:${Y.port}`:""}${Y.path}`,
                        _ = await this.generateDpop(Y.method, z);
                    Y.headers = {
                        ...Y.headers,
                        DPoP: _
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
                let Y = RK1.createPrivateKey({
                        key: K.dpopKey,
                        format: "pem",
                        type: "sec1"
                    }),
                    _ = RK1.createPublicKey(Y).export({
                        format: "der",
                        type: "spki"
                    }),
                    w = -1;
                for (let Z = 0; Z < _.length; Z++)
                    if (_[Z] === 4) {
                        w = Z;
                        break
                    } let O = _.slice(w + 1, w + 33),
                    $ = _.slice(w + 33, w + 65),
                    H = {
                        alg: "ES256",
                        typ: "dpop+jwt",
                        jwk: {
                            kty: "EC",
                            crv: "P-256",
                            x: O.toString("base64url"),
                            y: $.toString("base64url")
                        }
                    },
                    j = {
                        jti: crypto.randomUUID(),
                        htm: A,
                        htu: q,
                        iat: Math.floor(Date.now() / 1000)
                    },
                    J = Buffer.from(JSON.stringify(H)).toString("base64url"),
                    M = Buffer.from(JSON.stringify(j)).toString("base64url"),
                    D = `${J}.${M}`,
                    X = RK1.sign("sha256", Buffer.from(D), Y),
                    W = this.derToRawSignature(X).toString("base64url");
                return `${D}.${W}`
            } catch (Y) {
                throw new Yo.CredentialsProviderError(`Failed to generate Dpop proof: ${Y instanceof Error?Y.message:String(Y)}`, {
                    logger: this.logger,
                    tryNextLink: !1
                })
            }
        }
    }
    var $D5 = (A) => async ({
        callerClientConfig: q
    } = {}) => {
        A?.logger?.debug?.("@aws-sdk/credential-providers - fromLoginCredentials");
        let K = await E88.parseKnownFiles(A || {}),
            Y = E88.getProfileName({
                profile: A?.profile ?? q?.profile
            }),
            z = K[Y];
        if (!z?.login_session) throw new Yo.CredentialsProviderError(`Profile ${Y} does not contain login_session.`, {
            tryNextLink: !0,
            logger: A?.logger
        });
        let w = await new y88(z, A, q).loadCredentials();
        return _D5.setCredentialFeature(w, "CREDENTIALS_LOGIN", "AD")
    };
    HD5.fromLoginCredentials = $D5
})
// @from(Ln 85161, Col 4)
h88 = x((uaA) => {
    Object.defineProperty(uaA, "__esModule", {
        value: !0
    });
    uaA.resolveHttpAuthSchemeConfig = uaA.resolveStsAuthConfig = uaA.defaultSTSHttpAuthSchemeProvider = uaA.defaultSTSHttpAuthSchemeParametersProvider = void 0;
    var JD5 = Nw(),
        R88 = VW(),
        MD5 = S88(),
        DD5 = async (A, q, K) => {
            return {
                operation: (0, R88.getSmithyContext)(q).operation,
                region: await (0, R88.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    uaA.defaultSTSHttpAuthSchemeParametersProvider = DD5;

    function XD5(A) {
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

    function PD5(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var WD5 = (A) => {
        let q = [];
        switch (A.operation) {
            case "AssumeRoleWithWebIdentity": {
                q.push(PD5(A));
                break
            }
            default:
                q.push(XD5(A))
        }
        return q
    };
    uaA.defaultSTSHttpAuthSchemeProvider = WD5;
    var ZD5 = (A) => Object.assign(A, {
        stsClientCtor: MD5.STSClient
    });
    uaA.resolveStsAuthConfig = ZD5;
    var GD5 = (A) => {
        let q = uaA.resolveStsAuthConfig(A),
            K = (0, JD5.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, R88.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    uaA.resolveHttpAuthSchemeConfig = GD5
})
// @from(Ln 85226, Col 4)
C88 = x((gaA) => {
    Object.defineProperty(gaA, "__esModule", {
        value: !0
    });
    gaA.commonParams = gaA.resolveClientEndpointParameters = void 0;
    var vD5 = (A) => {
        return Object.assign(A, {
            useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
            useFipsEndpoint: A.useFipsEndpoint ?? !1,
            useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
            defaultSigningName: "sts"
        })
    };
    gaA.resolveClientEndpointParameters = vD5;
    gaA.commonParams = {
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
// @from(Ln 85263, Col 4)
HsA = x((OsA) => {
    Object.defineProperty(OsA, "__esModule", {
        value: !0
    });
    OsA.ruleSet = void 0;
    var saA = "required",
        D3 = "type",
        Vz = "fn",
        kz = "argv",
        _o = "ref",
        paA = !1,
        I88 = !0,
        zo = "booleanEquals",
        yP = "stringEquals",
        taA = "sigv4",
        eaA = "sts",
        AsA = "us-east-1",
        cO = "endpoint",
        QaA = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
        Nu = "tree",
        pj6 = "error",
        x88 = "getAttr",
        UaA = {
            [saA]: !1,
            [D3]: "string"
        },
        b88 = {
            [saA]: !0,
            default: !1,
            [D3]: "boolean"
        },
        qsA = {
            [_o]: "Endpoint"
        },
        daA = {
            [Vz]: "isSet",
            [kz]: [{
                [_o]: "Region"
            }]
        },
        LP = {
            [_o]: "Region"
        },
        caA = {
            [Vz]: "aws.partition",
            [kz]: [LP],
            assign: "PartitionResult"
        },
        KsA = {
            [_o]: "UseFIPS"
        },
        YsA = {
            [_o]: "UseDualStack"
        },
        RW = {
            url: "https://sts.amazonaws.com",
            properties: {
                authSchemes: [{
                    name: taA,
                    signingName: eaA,
                    signingRegion: AsA
                }]
            },
            headers: {}
        },
        UV = {},
        laA = {
            conditions: [{
                [Vz]: yP,
                [kz]: [LP, "aws-global"]
            }],
            [cO]: RW,
            [D3]: cO
        },
        zsA = {
            [Vz]: zo,
            [kz]: [KsA, !0]
        },
        _sA = {
            [Vz]: zo,
            [kz]: [YsA, !0]
        },
        iaA = {
            [Vz]: x88,
            [kz]: [{
                [_o]: "PartitionResult"
            }, "supportsFIPS"]
        },
        wsA = {
            [_o]: "PartitionResult"
        },
        naA = {
            [Vz]: zo,
            [kz]: [!0, {
                [Vz]: x88,
                [kz]: [wsA, "supportsDualStack"]
            }]
        },
        raA = [{
            [Vz]: "isSet",
            [kz]: [qsA]
        }],
        oaA = [zsA],
        aaA = [_sA],
        VD5 = {
            version: "1.0",
            parameters: {
                Region: UaA,
                UseDualStack: b88,
                UseFIPS: b88,
                Endpoint: UaA,
                UseGlobalEndpoint: b88
            },
            rules: [{
                conditions: [{
                    [Vz]: zo,
                    [kz]: [{
                        [_o]: "UseGlobalEndpoint"
                    }, I88]
                }, {
                    [Vz]: "not",
                    [kz]: raA
                }, daA, caA, {
                    [Vz]: zo,
                    [kz]: [KsA, paA]
                }, {
                    [Vz]: zo,
                    [kz]: [YsA, paA]
                }],
                rules: [{
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "ap-northeast-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "ap-south-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "ap-southeast-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "ap-southeast-2"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, laA, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "ca-central-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "eu-central-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "eu-north-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "eu-west-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "eu-west-2"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "eu-west-3"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "sa-east-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, AsA]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "us-east-2"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "us-west-1"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    conditions: [{
                        [Vz]: yP,
                        [kz]: [LP, "us-west-2"]
                    }],
                    endpoint: RW,
                    [D3]: cO
                }, {
                    endpoint: {
                        url: QaA,
                        properties: {
                            authSchemes: [{
                                name: taA,
                                signingName: eaA,
                                signingRegion: "{Region}"
                            }]
                        },
                        headers: UV
                    },
                    [D3]: cO
                }],
                [D3]: Nu
            }, {
                conditions: raA,
                rules: [{
                    conditions: oaA,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    [D3]: pj6
                }, {
                    conditions: aaA,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    [D3]: pj6
                }, {
                    endpoint: {
                        url: qsA,
                        properties: UV,
                        headers: UV
                    },
                    [D3]: cO
                }],
                [D3]: Nu
            }, {
                conditions: [daA],
                rules: [{
                    conditions: [caA],
                    rules: [{
                        conditions: [zsA, _sA],
                        rules: [{
                            conditions: [{
                                [Vz]: zo,
                                [kz]: [I88, iaA]
                            }, naA],
                            rules: [{
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: UV,
                                    headers: UV
                                },
                                [D3]: cO
                            }],
                            [D3]: Nu
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            [D3]: pj6
                        }],
                        [D3]: Nu
                    }, {
                        conditions: oaA,
                        rules: [{
                            conditions: [{
                                [Vz]: zo,
                                [kz]: [iaA, I88]
                            }],
                            rules: [{
                                conditions: [{
                                    [Vz]: yP,
                                    [kz]: [{
                                        [Vz]: x88,
                                        [kz]: [wsA, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://sts.{Region}.amazonaws.com",
                                    properties: UV,
                                    headers: UV
                                },
                                [D3]: cO
                            }, {
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: UV,
                                    headers: UV
                                },
                                [D3]: cO
                            }],
                            [D3]: Nu
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            [D3]: pj6
                        }],
                        [D3]: Nu
                    }, {
                        conditions: aaA,
                        rules: [{
                            conditions: [naA],
                            rules: [{
                                endpoint: {
                                    url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: UV,
                                    headers: UV
                                },
                                [D3]: cO
                            }],
                            [D3]: Nu
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            [D3]: pj6
                        }],
                        [D3]: Nu
                    }, laA, {
                        endpoint: {
                            url: QaA,
                            properties: UV,
                            headers: UV
                        },
                        [D3]: cO
                    }],
                    [D3]: Nu
                }],
                [D3]: Nu
            }, {
                error: "Invalid Configuration: Missing Region",
                [D3]: pj6
            }]
        };
    OsA.ruleSet = VD5
})
// @from(Ln 85627, Col 4)
MsA = x((jsA) => {
    Object.defineProperty(jsA, "__esModule", {
        value: !0
    });
    jsA.defaultEndpointResolver = void 0;
    var kD5 = Zu(),
        u88 = nS(),
        ED5 = HsA(),
        yD5 = new u88.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
        }),
        LD5 = (A, q = {}) => {
            return yD5.get(A, () => (0, u88.resolveEndpoint)(ED5.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    jsA.defaultEndpointResolver = LD5;
    u88.customEndpointFunctions.aws = kD5.awsEndpointFunctions
})
// @from(Ln 85648, Col 4)
ZsA = x((PsA) => {
    Object.defineProperty(PsA, "__esModule", {
        value: !0
    });
    PsA.getRuntimeConfig = void 0;
    var RD5 = Nw(),
        hD5 = RQ(),
        SD5 = w_(),
        CD5 = fG(),
        ID5 = hy(),
        DsA = sq1(),
        XsA = C_(),
        bD5 = h88(),
        xD5 = MsA(),
        uD5 = (A) => {
            return {
                apiVersion: "2011-06-15",
                base64Decoder: A?.base64Decoder ?? DsA.fromBase64,
                base64Encoder: A?.base64Encoder ?? DsA.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? xD5.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? bD5.defaultSTSHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new RD5.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new SD5.NoAuthSigner
                }],
                logger: A?.logger ?? new CD5.NoOpLogger,
                protocol: A?.protocol ?? new hD5.AwsQueryProtocol({
                    defaultNamespace: "com.amazonaws.sts",
                    xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
                    version: "2011-06-15"
                }),
                serviceId: A?.serviceId ?? "STS",
                urlParser: A?.urlParser ?? ID5.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? XsA.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? XsA.toUtf8
            }
        };
    PsA.getRuntimeConfig = uD5
})
// @from(Ln 85694, Col 4)
VsA = x((vsA) => {
    Object.defineProperty(vsA, "__esModule", {
        value: !0
    });
    vsA.getRuntimeConfig = void 0;
    var mD5 = _2(),
        BD5 = mD5.__importDefault(nq1()),
        m88 = Nw(),
        GsA = kQ(),
        hK1 = Nj(),
        gD5 = w_(),
        FD5 = EQ(),
        fsA = kP(),
        H46 = BT(),
        TsA = uT(),
        pD5 = yQ(),
        QD5 = Tu(),
        UD5 = ZsA(),
        dD5 = fG(),
        cD5 = SQ(),
        lD5 = fG(),
        iD5 = (A) => {
            (0, lD5.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, cD5.resolveDefaultsModeConfig)(A),
                K = () => q().then(dD5.loadConfigsForDefaultMode),
                Y = (0, UD5.getRuntimeConfig)(A);
            (0, m88.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, H46.loadConfig)(m88.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? pD5.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, GsA.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: BD5.default.version
                }),
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (_) => _.getIdentityProvider("aws.auth#sigv4") || (async (w) => await A.credentialDefaultProvider(w?.__config || {})()),
                    signer: new m88.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (_) => _.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new gD5.NoAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, H46.loadConfig)(fsA.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, H46.loadConfig)(hK1.NODE_REGION_CONFIG_OPTIONS, {
                    ...hK1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: TsA.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, H46.loadConfig)({
                    ...fsA.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || QD5.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? FD5.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? TsA.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, H46.loadConfig)(hK1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, H46.loadConfig)(hK1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, H46.loadConfig)(GsA.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    vsA.getRuntimeConfig = iD5
})
// @from(Ln 85764, Col 4)
ysA = x((ksA) => {
    Object.defineProperty(ksA, "__esModule", {
        value: !0
    });
    ksA.resolveHttpAuthRuntimeConfig = ksA.getHttpAuthExtensionConfiguration = void 0;
    var nD5 = (A) => {
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
    };
    ksA.getHttpAuthExtensionConfiguration = nD5;
    var rD5 = (A) => {
        return {
            httpAuthSchemes: A.httpAuthSchemes(),
            httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
            credentials: A.credentials()
        }
    };
    ksA.resolveHttpAuthRuntimeConfig = rD5
})
// @from(Ln 85808, Col 4)
bsA = x((CsA) => {
    Object.defineProperty(CsA, "__esModule", {
        value: !0
    });
    CsA.resolveRuntimeExtensions = void 0;
    var LsA = oS(),
        RsA = AK1(),
        hsA = fG(),
        SsA = ysA(),
        aD5 = (A, q) => {
            let K = Object.assign((0, LsA.getAwsRegionExtensionConfiguration)(A), (0, hsA.getDefaultExtensionConfiguration)(A), (0, RsA.getHttpHandlerExtensionConfiguration)(A), (0, SsA.getHttpAuthExtensionConfiguration)(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, (0, LsA.resolveAwsRegionExtensionConfiguration)(K), (0, hsA.resolveDefaultRuntimeConfig)(K), (0, RsA.resolveHttpHandlerRuntimeConfig)(K), (0, SsA.resolveHttpAuthRuntimeConfig)(K))
        };
    CsA.resolveRuntimeExtensions = aD5
})
// @from(Ln 85823, Col 4)
S88 = x((g88) => {
    Object.defineProperty(g88, "__esModule", {
        value: !0
    });
    g88.STSClient = g88.__Client = void 0;
    var xsA = PQ(),
        sD5 = WQ(),
        tD5 = ZQ(),
        usA = fu(),
        eD5 = Nj(),
        B88 = w_(),
        AX5 = dO(),
        qX5 = VQ(),
        KX5 = rS(),
        msA = kP(),
        gsA = fG();
    Object.defineProperty(g88, "__Client", {
        enumerable: !0,
        get: function() {
            return gsA.Client
        }
    });
    var BsA = h88(),
        YX5 = C88(),
        zX5 = VsA(),
        _X5 = bsA();
    class FsA extends gsA.Client {
        config;
        constructor(...[A]) {
            let q = (0, zX5.getRuntimeConfig)(A || {});
            super(q);
            this.initConfig = q;
            let K = (0, YX5.resolveClientEndpointParameters)(q),
                Y = (0, usA.resolveUserAgentConfig)(K),
                z = (0, msA.resolveRetryConfig)(Y),
                _ = (0, eD5.resolveRegionConfig)(z),
                w = (0, xsA.resolveHostHeaderConfig)(_),
                O = (0, KX5.resolveEndpointConfig)(w),
                $ = (0, BsA.resolveHttpAuthSchemeConfig)(O),
                H = (0, _X5.resolveRuntimeExtensions)($, A?.extensions || []);
            this.config = H, this.middlewareStack.use((0, AX5.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, usA.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, msA.getRetryPlugin)(this.config)), this.middlewareStack.use((0, qX5.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, xsA.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, sD5.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, tD5.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, B88.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
                httpAuthSchemeParametersProvider: BsA.defaultSTSHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new B88.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials
                })
            })), this.middlewareStack.use((0, B88.getHttpSigningPlugin)(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    g88.STSClient = FsA
})
// @from(Ln 85876, Col 4)
bK1 = x((SK1) => {
    var xS6 = S88(),
        uS6 = fG(),
        QsA = rS(),
        UsA = C88(),
        wo = dO(),
        F88 = mT(),
        wX5 = oS(),
        bQ = class A extends uS6.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        dsA = class A extends bQ {
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
        csA = class A extends bQ {
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
        lsA = class A extends bQ {
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
        isA = class A extends bQ {
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
        nsA = class A extends bQ {
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
        rsA = class A extends bQ {
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
        osA = class A extends bQ {
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
        OX5 = "Arn",
        $X5 = "AccessKeyId",
        HX5 = "AssumeRole",
        jX5 = "AssumedRoleId",
        JX5 = "AssumeRoleRequest",
        MX5 = "AssumeRoleResponse",
        p88 = "AssumedRoleUser",
        DX5 = "AssumeRoleWithWebIdentity",
        XX5 = "AssumeRoleWithWebIdentityRequest",
        PX5 = "AssumeRoleWithWebIdentityResponse",
        WX5 = "Audience",
        Q88 = "Credentials",
        ZX5 = "ContextAssertion",
        asA = "DurationSeconds",
        GX5 = "Expiration",
        fX5 = "ExternalId",
        TX5 = "ExpiredTokenException",
        vX5 = "IDPCommunicationErrorException",
        NX5 = "IDPRejectedClaimException",
        VX5 = "InvalidIdentityTokenException",
        kX5 = "Key",
        EX5 = "MalformedPolicyDocumentException",
        ssA = "Policy",
        tsA = "PolicyArns",
        yX5 = "ProviderArn",
        LX5 = "ProvidedContexts",
        RX5 = "ProvidedContextsListType",
        hX5 = "ProvidedContext",
        SX5 = "PolicyDescriptorType",
        CX5 = "ProviderId",
        esA = "PackedPolicySize",
        IX5 = "PackedPolicyTooLargeException",
        bX5 = "Provider",
        AtA = "RoleArn",
        xX5 = "RegionDisabledException",
        qtA = "RoleSessionName",
        uX5 = "SecretAccessKey",
        mX5 = "SubjectFromWebIdentityToken",
        U88 = "SourceIdentity",
        BX5 = "SerialNumber",
        gX5 = "SessionToken",
        FX5 = "Tags",
        pX5 = "TokenCode",
        QX5 = "TransitiveTagKeys",
        UX5 = "Tag",
        dX5 = "Value",
        cX5 = "WebIdentityToken",
        lX5 = "arn",
        iX5 = "accessKeySecretType",
        j46 = "awsQueryError",
        J46 = "client",
        nX5 = "clientTokenType",
        M46 = "error",
        D46 = "httpError",
        X46 = "message",
        rX5 = "policyDescriptorListType",
        KtA = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
        oX5 = "tagListType",
        $_ = "com.amazonaws.sts",
        aX5 = [0, $_, iX5, 8, 0],
        sX5 = [0, $_, nX5, 8, 0],
        YtA = [3, $_, p88, 0, [jX5, OX5],
            [0, 0]
        ],
        tX5 = [3, $_, JX5, 0, [AtA, qtA, tsA, ssA, asA, FX5, QX5, fX5, BX5, pX5, U88, LX5],
            [0, 0, () => _tA, 0, 1, () => XP5, 64, 0, 0, 0, 0, () => DP5]
        ],
        eX5 = [3, $_, MX5, 0, [Q88, p88, esA, U88],
            [
                [() => ztA, 0], () => YtA, 1, 0
            ]
        ],
        AP5 = [3, $_, XX5, 0, [AtA, qtA, cX5, CX5, tsA, ssA, asA],
            [0, 0, [() => sX5, 0], 0, () => _tA, 0, 1]
        ],
        qP5 = [3, $_, PX5, 0, [Q88, mX5, p88, esA, bX5, WX5, U88],
            [
                [() => ztA, 0], 0, () => YtA, 1, 0, 0, 0
            ]
        ],
        ztA = [3, $_, Q88, 0, [$X5, uX5, gX5, GX5],
            [0, [() => aX5, 0], 0, 4]
        ],
        KP5 = [-3, $_, TX5, {
                [M46]: J46,
                [D46]: 400,
                [j46]: ["ExpiredTokenException", 400]
            },
            [X46],
            [0]
        ];
    wo.TypeRegistry.for($_).registerError(KP5, dsA);
    var YP5 = [-3, $_, vX5, {
            [M46]: J46,
            [D46]: 400,
            [j46]: ["IDPCommunicationError", 400]
        },
        [X46],
        [0]
    ];
    wo.TypeRegistry.for($_).registerError(YP5, osA);
    var zP5 = [-3, $_, NX5, {
            [M46]: J46,
            [D46]: 403,
            [j46]: ["IDPRejectedClaim", 403]
        },
        [X46],
        [0]
    ];
    wo.TypeRegistry.for($_).registerError(zP5, nsA);
    var _P5 = [-3, $_, VX5, {
            [M46]: J46,
            [D46]: 400,
            [j46]: ["InvalidIdentityToken", 400]
        },
        [X46],
        [0]
    ];
    wo.TypeRegistry.for($_).registerError(_P5, rsA);
    var wP5 = [-3, $_, EX5, {
            [M46]: J46,
            [D46]: 400,
            [j46]: ["MalformedPolicyDocument", 400]
        },
        [X46],
        [0]
    ];
    wo.TypeRegistry.for($_).registerError(wP5, csA);
    var OP5 = [-3, $_, IX5, {
            [M46]: J46,
            [D46]: 400,
            [j46]: ["PackedPolicyTooLarge", 400]
        },
        [X46],
        [0]
    ];
    wo.TypeRegistry.for($_).registerError(OP5, lsA);
    var $P5 = [3, $_, SX5, 0, [lX5],
            [0]
        ],
        HP5 = [3, $_, hX5, 0, [yX5, ZX5],
            [0, 0]
        ],
        jP5 = [-3, $_, xX5, {
                [M46]: J46,
                [D46]: 403,
                [j46]: ["RegionDisabledException", 403]
            },
            [X46],
            [0]
        ];
    wo.TypeRegistry.for($_).registerError(jP5, isA);
    var JP5 = [3, $_, UX5, 0, [kX5, dX5],
            [0, 0]
        ],
        MP5 = [-3, KtA, "STSServiceException", 0, [],
            []
        ];
    wo.TypeRegistry.for(KtA).registerError(MP5, bQ);
    var _tA = [1, $_, rX5, 0, () => $P5],
        DP5 = [1, $_, RX5, 0, () => HP5],
        XP5 = [1, $_, oX5, 0, () => JP5],
        PP5 = [9, $_, HX5, 0, () => tX5, () => eX5],
        WP5 = [9, $_, DX5, 0, () => AP5, () => qP5];
    class CK1 extends uS6.Command.classBuilder().ep(UsA.commonParams).m(function(A, q, K, Y) {
        return [QsA.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(PP5).build() {}
    class IK1 extends uS6.Command.classBuilder().ep(UsA.commonParams).m(function(A, q, K, Y) {
        return [QsA.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(WP5).build() {}
    var ZP5 = {
        AssumeRoleCommand: CK1,
        AssumeRoleWithWebIdentityCommand: IK1
    };
    class d88 extends xS6.STSClient {}
    uS6.createAggregatedClient(ZP5, d88);
    var wtA = (A) => {
            if (typeof A?.Arn === "string") {
                let q = A.Arn.split(":");
                if (q.length > 4 && q[4] !== "") return q[4]
            }
            return
        },
        OtA = async (A, q, K, Y = {}) => {
            let z = typeof A === "function" ? await A() : A,
                _ = typeof q === "function" ? await q() : q,
                w = await wX5.stsRegionDefaultResolver(Y)();
            return K?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${z} (credential provider clientConfig)`, `${_} (contextual client)`, `${w} (STS default: AWS_REGION, profile region, or us-east-1)`), z ?? _ ?? w
        }, GP5 = (A, q) => {
            let K, Y;
            return async (z, _) => {
                if (Y = z, !K) {
                    let {
                        logger: j = A?.parentClientConfig?.logger,
                        profile: J = A?.parentClientConfig?.profile,
                        region: M,
                        requestHandler: D = A?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: X,
                        userAgentAppId: P = A?.parentClientConfig?.userAgentAppId
                    } = A, W = await OtA(M, A?.parentClientConfig?.region, X, {
                        logger: j,
                        profile: J
                    }), Z = !$tA(D);
                    K = new q({
                        ...A,
                        userAgentAppId: P,
                        profile: J,
                        credentialDefaultProvider: () => async () => Y,
                        region: W,
                        requestHandler: Z ? D : void 0,
                        logger: j
                    })
                }
                let {
                    Credentials: w,
                    AssumedRoleUser: O
                } = await K.send(new CK1(_));
                if (!w || !w.AccessKeyId || !w.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${_.RoleArn}`);
                let $ = wtA(O),
                    H = {
                        accessKeyId: w.AccessKeyId,
                        secretAccessKey: w.SecretAccessKey,
                        sessionToken: w.SessionToken,
                        expiration: w.Expiration,
                        ...w.CredentialScope && {
                            credentialScope: w.CredentialScope
                        },
                        ...$ && {
                            accountId: $
                        }
                    };
                return F88.setCredentialFeature(H, "CREDENTIALS_STS_ASSUME_ROLE", "i"), H
            }
        }, fP5 = (A, q) => {
            let K;
            return async (Y) => {
                if (!K) {
                    let {
                        logger: $ = A?.parentClientConfig?.logger,
                        profile: H = A?.parentClientConfig?.profile,
                        region: j,
                        requestHandler: J = A?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: M,
                        userAgentAppId: D = A?.parentClientConfig?.userAgentAppId
                    } = A, X = await OtA(j, A?.parentClientConfig?.region, M, {
                        logger: $,
                        profile: H
                    }), P = !$tA(J);
                    K = new q({
                        ...A,
                        userAgentAppId: D,
                        profile: H,
                        region: X,
                        requestHandler: P ? J : void 0,
                        logger: $
                    })
                }
                let {
                    Credentials: z,
                    AssumedRoleUser: _
                } = await K.send(new IK1(Y));
                if (!z || !z.AccessKeyId || !z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${Y.RoleArn}`);
                let w = wtA(_),
                    O = {
                        accessKeyId: z.AccessKeyId,
                        secretAccessKey: z.SecretAccessKey,
                        sessionToken: z.SessionToken,
                        expiration: z.Expiration,
                        ...z.CredentialScope && {
                            credentialScope: z.CredentialScope
                        },
                        ...w && {
                            accountId: w
                        }
                    };
                if (w) F88.setCredentialFeature(O, "RESOLVED_ACCOUNT_ID", "T");
                return F88.setCredentialFeature(O, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), O
            }
        }, $tA = (A) => {
            return A?.metadata?.handlerProtocol === "h2"
        }, HtA = (A, q) => {
            if (!q) return A;
            else return class extends A {
                constructor(Y) {
                    super(Y);
                    for (let z of q) this.middlewareStack.use(z)
                }
            }
        }, jtA = (A = {}, q) => GP5(A, HtA(xS6.STSClient, q)), JtA = (A = {}, q) => fP5(A, HtA(xS6.STSClient, q)), TP5 = (A) => (q) => A({
            roleAssumer: jtA(q),
            roleAssumerWithWebIdentity: JtA(q),
            ...q
        });
    Object.defineProperty(SK1, "$Command", {
        enumerable: !0,
        get: function() {
            return uS6.Command
        }
    });
    SK1.AssumeRoleCommand = CK1;
    SK1.AssumeRoleWithWebIdentityCommand = IK1;
    SK1.ExpiredTokenException = dsA;
    SK1.IDPCommunicationErrorException = osA;
    SK1.IDPRejectedClaimException = nsA;
    SK1.InvalidIdentityTokenException = rsA;
    SK1.MalformedPolicyDocumentException = csA;
    SK1.PackedPolicyTooLargeException = lsA;
    SK1.RegionDisabledException = isA;
    SK1.STS = d88;
    SK1.STSServiceException = bQ;
    SK1.decorateDefaultCredentialProvider = TP5;
    SK1.getDefaultRoleAssumer = jtA;
    SK1.getDefaultRoleAssumerWithWebIdentity = JtA;
    Object.keys(xS6).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(SK1, A)) Object.defineProperty(SK1, A, {
            enumerable: !0,
            get: function() {
                return xS6[A]
            }
        })
    })
})
// @from(Ln 86296, Col 4)
xK1 = x((QP5) => {
    var l88 = Du(),
        c88 = vJ(),
        uP5 = x6("child_process"),
        mP5 = x6("util"),
        BP5 = mT(),
        gP5 = (A, q, K) => {
            if (q.Version !== 1) throw Error(`Profile ${A} credential_process did not return Version 1.`);
            if (q.AccessKeyId === void 0 || q.SecretAccessKey === void 0) throw Error(`Profile ${A} credential_process returned invalid credentials.`);
            if (q.Expiration) {
                let _ = new Date;
                if (new Date(q.Expiration) < _) throw Error(`Profile ${A} credential_process returned expired credentials.`)
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
            return BP5.setCredentialFeature(z, "CREDENTIALS_PROCESS", "w"), z
        },
        FP5 = async (A, q, K) => {
            let Y = q[A];
            if (q[A]) {
                let z = Y.credential_process;
                if (z !== void 0) {
                    let _ = mP5.promisify(l88.externalDataInterceptor?.getTokenRecord?.().exec ?? uP5.exec);
                    try {
                        let {
                            stdout: w
                        } = await _(z), O;
                        try {
                            O = JSON.parse(w.trim())
                        } catch {
                            throw Error(`Profile ${A} credential_process returned invalid JSON.`)
                        }
                        return gP5(A, O, q)
                    } catch (w) {
                        throw new c88.CredentialsProviderError(w.message, {
                            logger: K
                        })
                    }
                } else throw new c88.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
                    logger: K
                })
            } else throw new c88.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
                logger: K
            })
        }, pP5 = (A = {}) => async ({
            callerClientConfig: q
        } = {}) => {
            A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
            let K = await l88.parseKnownFiles(A);
            return FP5(l88.getProfileName({
                profile: A.profile ?? q?.profile
            }), K, A.logger)
        };
    QP5.fromProcess = pP5
})
// @from(Ln 86367, Col 4)
i88 = x((Vu) => {
    var dP5 = Vu && Vu.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        cP5 = Vu && Vu.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        lP5 = Vu && Vu.__importStar || function() {
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
                        if (Y[z] !== "default") dP5(K, q, Y[z])
                }
                return cP5(K, q), K
            }
        }();
    Object.defineProperty(Vu, "__esModule", {
        value: !0
    });
    Vu.fromWebToken = void 0;
    var iP5 = (A) => async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
        let {
            roleArn: K,
            roleSessionName: Y,
            webIdentityToken: z,
            providerId: _,
            policyArns: w,
            policy: O,
            durationSeconds: $
        } = A, {
            roleAssumerWithWebIdentity: H
        } = A;
        if (!H) {
            let {
                getDefaultRoleAssumerWithWebIdentity: j
            } = await Promise.resolve().then(() => lP5(bK1()));
            H = j({
                ...A.clientConfig,
                credentialProviderLogger: A.logger,
                parentClientConfig: {
                    ...q?.callerClientConfig,
                    ...A.parentClientConfig
                }
            }, A.clientPlugins)
        }
        return H({
            RoleArn: K,
            RoleSessionName: Y ?? `aws-sdk-js-session-${Date.now()}`,
            WebIdentityToken: z,
            ProviderId: _,
            PolicyArns: w,
            Policy: O,
            DurationSeconds: $
        })
    };
    Vu.fromWebToken = iP5
})
// @from(Ln 86451, Col 4)
PtA = x((DtA) => {
    Object.defineProperty(DtA, "__esModule", {
        value: !0
    });
    DtA.fromTokenFile = void 0;
    var nP5 = mT(),
        rP5 = vJ(),
        oP5 = Du(),
        aP5 = x6("fs"),
        sP5 = i88(),
        MtA = "AWS_WEB_IDENTITY_TOKEN_FILE",
        tP5 = "AWS_ROLE_ARN",
        eP5 = "AWS_ROLE_SESSION_NAME",
        A05 = (A = {}) => async (q) => {
            A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
            let K = A?.webIdentityTokenFile ?? process.env[MtA],
                Y = A?.roleArn ?? process.env[tP5],
                z = A?.roleSessionName ?? process.env[eP5];
            if (!K || !Y) throw new rP5.CredentialsProviderError("Web identity configuration not specified", {
                logger: A.logger
            });
            let _ = await (0, sP5.fromWebToken)({
                ...A,
                webIdentityToken: oP5.externalDataInterceptor?.getTokenRecord?.()[K] ?? (0, aP5.readFileSync)(K, {
                    encoding: "ascii"
                }),
                roleArn: Y,
                roleSessionName: z
            })(q);
            if (K === process.env[MtA])(0, nP5.setCredentialFeature)(_, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
            return _
        };
    DtA.fromTokenFile = A05
})
// @from(Ln 86485, Col 4)
BS6 = x((mS6) => {
    var WtA = PtA(),
        ZtA = i88();
    Object.keys(WtA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(mS6, A)) Object.defineProperty(mS6, A, {
            enumerable: !0,
            get: function() {
                return WtA[A]
            }
        })
    });
    Object.keys(ZtA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(mS6, A)) Object.defineProperty(mS6, A, {
            enumerable: !0,
            get: function() {
                return ZtA[A]
            }
        })
    })
})
// @from(Ln 86505, Col 4)
o88 = x((W05) => {
    var r88 = Du(),
        gS6 = vJ(),
        xQ = mT(),
        q05 = L88(),
        K05 = (A, q, K) => {
            let Y = {
                EcsContainer: async (z) => {
                    let {
                        fromHttp: _
                    } = await Promise.resolve().then(() => t(Mq1())), {
                        fromContainerMetadata: w
                    } = await Promise.resolve().then(() => t(o76()));
                    return K?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => gS6.chain(_(z ?? {}), w(z))().then(n88)
                },
                Ec2InstanceMetadata: async (z) => {
                    K?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
                    let {
                        fromInstanceMetadata: _
                    } = await Promise.resolve().then(() => t(o76()));
                    return async () => _(z)().then(n88)
                },
                Environment: async (z) => {
                    K?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
                    let {
                        fromEnv: _
                    } = await Promise.resolve().then(() => t(p41()));
                    return async () => _(z)().then(n88)
                }
            };
            if (A in Y) return Y[A];
            else throw new gS6.CredentialsProviderError(`Unsupported credential source in profile ${q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
                logger: K
            })
        },
        n88 = (A) => xQ.setCredentialFeature(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"),
        Y05 = (A, {
            profile: q = "default",
            logger: K
        } = {}) => {
            return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (z05(A, {
                profile: q,
                logger: K
            }) || _05(A, {
                profile: q,
                logger: K
            }))
        },
        z05 = (A, {
            profile: q,
            logger: K
        }) => {
            let Y = typeof A.source_profile === "string" && typeof A.credential_source > "u";
            if (Y) K?.debug?.(`    ${q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
            return Y
        },
        _05 = (A, {
            profile: q,
            logger: K
        }) => {
            let Y = typeof A.credential_source === "string" && typeof A.source_profile > "u";
            if (Y) K?.debug?.(`    ${q} isCredentialSourceProfile credential_source=${A.credential_source}`);
            return Y
        },
        w05 = async (A, q, K, Y = {}, z) => {
            K.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
            let _ = q[A],
                {
                    source_profile: w,
                    region: O
                } = _;
            if (!K.roleAssumer) {
                let {
                    getDefaultRoleAssumer: H
                } = await Promise.resolve().then(() => t(bK1()));
                K.roleAssumer = H({
                    ...K.clientConfig,
                    credentialProviderLogger: K.logger,
                    parentClientConfig: {
                        ...K?.parentClientConfig,
                        region: O ?? K?.parentClientConfig?.region
                    }
                }, K.clientPlugins)
            }
            if (w && w in Y) throw new gS6.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${r88.getProfileName(K)}. Profiles visited: ` + Object.keys(Y).join(", "), {
                logger: K.logger
            });
            K.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${w?`source_profile=[${w}]`:`profile=[${A}]`}`);
            let $ = w ? z(w, q, K, {
                ...Y,
                [w]: !0
            }, GtA(q[w] ?? {})) : (await K05(_.credential_source, A, K.logger)(K))();
            if (GtA(_)) return $.then((H) => xQ.setCredentialFeature(H, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
            else {
                let H = {
                        RoleArn: _.role_arn,
                        RoleSessionName: _.role_session_name || `aws-sdk-js-${Date.now()}`,
                        ExternalId: _.external_id,
                        DurationSeconds: parseInt(_.duration_seconds || "3600", 10)
                    },
                    {
                        mfa_serial: j
                    } = _;
                if (j) {
                    if (!K.mfaCodeProvider) throw new gS6.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
                        logger: K.logger,
                        tryNextLink: !1
                    });
                    H.SerialNumber = j, H.TokenCode = await K.mfaCodeProvider(j)
                }
                let J = await $;
                return K.roleAssumer(J, H).then((M) => xQ.setCredentialFeature(M, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
            }
        }, GtA = (A) => {
            return !A.role_arn && !!A.credential_source
        }, O05 = (A) => {
            return Boolean(A && A.login_session)
        }, $05 = async (A, q) => {
            let K = await q05.fromLoginCredentials({
                ...q,
                profile: A
            })();
            return xQ.setCredentialFeature(K, "CREDENTIALS_PROFILE_LOGIN", "AC")
        }, H05 = (A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", j05 = async (A, q) => Promise.resolve().then(() => t(xK1())).then(({
            fromProcess: K
        }) => K({
            ...A,
            profile: q
        })().then((Y) => xQ.setCredentialFeature(Y, "CREDENTIALS_PROFILE_PROCESS", "v"))), J05 = async (A, q, K = {}) => {
            let {
                fromSSO: Y
            } = await Promise.resolve().then(() => t(TK1()));
            return Y({
                profile: A,
                logger: K.logger,
                parentClientConfig: K.parentClientConfig,
                clientConfig: K.clientConfig
            })().then((z) => {
                if (q.sso_session) return xQ.setCredentialFeature(z, "CREDENTIALS_PROFILE_SSO", "r");
                else return xQ.setCredentialFeature(z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
            })
        }, M05 = (A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), ftA = (A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, TtA = async (A, q) => {
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
            return xQ.setCredentialFeature(K, "CREDENTIALS_PROFILE", "n")
        }, D05 = (A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, X05 = async (A, q) => Promise.resolve().then(() => t(BS6())).then(({
            fromTokenFile: K
        }) => K({
            webIdentityTokenFile: A.web_identity_token_file,
            roleArn: A.role_arn,
            roleSessionName: A.role_session_name,
            roleAssumerWithWebIdentity: q.roleAssumerWithWebIdentity,
            logger: q.logger,
            parentClientConfig: q.parentClientConfig
        })().then((Y) => xQ.setCredentialFeature(Y, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), vtA = async (A, q, K, Y = {}, z = !1) => {
            let _ = q[A];
            if (Object.keys(Y).length > 0 && ftA(_)) return TtA(_, K);
            if (z || Y05(_, {
                    profile: A,
                    logger: K.logger
                })) return w05(A, q, K, Y, vtA);
            if (ftA(_)) return TtA(_, K);
            if (D05(_)) return X05(_, K);
            if (H05(_)) return j05(K, A);
            if (M05(_)) return await J05(A, _, K);
            if (O05(_)) return $05(A, K);
            throw new gS6.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
                logger: K.logger
            })
        }, P05 = (A = {}) => async ({
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
            let Y = await r88.parseKnownFiles(K);
            return vtA(r88.getProfileName({
                profile: A.profile ?? q?.profile
            }), Y, K)
        };
    W05.fromIni = P05
})
// @from(Ln 86702, Col 4)
P46 = x((k05) => {
    var a88 = p41(),
        FS6 = vJ(),
        G05 = Du(),
        NtA = "AWS_EC2_METADATA_DISABLED",
        f05 = async (A) => {
            let {
                ENV_CMDS_FULL_URI: q,
                ENV_CMDS_RELATIVE_URI: K,
                fromContainerMetadata: Y,
                fromInstanceMetadata: z
            } = await Promise.resolve().then(() => t(o76()));
            if (process.env[K] || process.env[q]) {
                A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
                let {
                    fromHttp: _
                } = await Promise.resolve().then(() => t(Mq1()));
                return FS6.chain(_(A), Y(A))
            }
            if (process.env[NtA] && process.env[NtA] !== "false") return async () => {
                throw new FS6.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
                    logger: A.logger
                })
            };
            return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), z(A)
        };

    function T05(A, q) {
        let K = v05(A),
            Y, z, _, w = async (O) => {
                if (O?.forceRefresh) return await K(O);
                if (_?.expiration) {
                    if (_?.expiration?.getTime() < Date.now()) _ = void 0
                }
                if (Y) await Y;
                else if (!_ || q?.(_))
                    if (_) {
                        if (!z) z = K(O).then(($) => {
                            _ = $, z = void 0
                        })
                    } else return Y = K(O).then(($) => {
                        _ = $, Y = void 0
                    }), w(O);
                return _
            };
        return w
    }
    var v05 = (A) => async (q) => {
        let K;
        for (let Y of A) try {
            return await Y(q)
        } catch (z) {
            if (K = z, z?.tryNextLink) continue;
            throw z
        }
        throw K
    }, VtA = !1, N05 = (A = {}) => T05([async () => {
        if (A.profile ?? process.env[G05.ENV_PROFILE]) {
            if (process.env[a88.ENV_KEY] && process.env[a88.ENV_SECRET]) {
                if (!VtA)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn.bind(A.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), VtA = !0
            }
            throw new FS6.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
                logger: A.logger,
                tryNextLink: !0
            })
        }
        return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), a88.fromEnv(A)()
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
        let {
            ssoStartUrl: K,
            ssoAccountId: Y,
            ssoRegion: z,
            ssoRoleName: _,
            ssoSession: w
        } = A;
        if (!K && !Y && !z && !_ && !w) throw new FS6.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
            logger: A.logger
        });
        let {
            fromSSO: O
        } = await Promise.resolve().then(() => t(TK1()));
        return O(A)(q)
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
        let {
            fromIni: K
        } = await Promise.resolve().then(() => t(o88()));
        return K(A)(q)
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
        let {
            fromProcess: K
        } = await Promise.resolve().then(() => t(xK1()));
        return K(A)(q)
    }, async (q) => {
        A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
        let {
            fromTokenFile: K
        } = await Promise.resolve().then(() => t(BS6()));
        return K(A)(q)
    }, async () => {
        return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await f05(A))()
    }, async () => {
        throw new FS6.CredentialsProviderError("Could not load credentials from any providers", {
            tryNextLink: !1,
            logger: A.logger
        })
    }], ktA), V05 = (A) => A?.expiration !== void 0, ktA = (A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000;
    k05.credentialsTreatedAsExpired = ktA;
    k05.credentialsWillNeedRefresh = V05;
    k05.defaultProvider = N05
})
// @from(Ln 86824, Col 0)
function R05(A) {
    switch (A.family) {
        case 0:
        case 4:
        case 6:
            return A.family;
        case "IPv6":
            return 6;
        case "IPv4":
        case void 0:
            return 4;
        default:
            throw Error(`Unsupported address family: ${A.family}`)
    }
}
// @from(Ln 86840, Col 0)
function py(A = process.env) {
    return A.https_proxy || A.HTTPS_PROXY || A.http_proxy || A.HTTP_PROXY
}
// @from(Ln 86844, Col 0)
function h05(A = process.env) {
    return A.no_proxy || A.NO_PROXY
}
// @from(Ln 86848, Col 0)
function Oo(A, q = h05()) {
    if (!q) return !1;
    if (q === "*") return !0;
    try {
        let K = new URL(A),
            Y = K.hostname.toLowerCase(),
            z = K.port || (K.protocol === "https:" ? "443" : "80"),
            _ = `${Y}:${z}`;
        return q.split(/[,\s]+/).filter(Boolean).some((O) => {
            if (O = O.toLowerCase().trim(), O.includes(":")) return _ === O;
            if (O.startsWith(".")) {
                let $ = O;
                return Y === O.substring(1) || Y.endsWith($)
            }
            return Y === O
        })
    } catch {
        return !1
    }
}
// @from(Ln 86869, Col 0)
function mK1(A, q = {}) {
    let K = Ry(),
        Y = lS(),
        z = {
            ...K && {
                cert: K.cert,
                key: K.key,
                passphrase: K.passphrase
            },
            ...Y && {
                ca: Y
            }
        };
    if (t6(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS)) z.lookup = (_, w, O) => {
        O(null, _, R05(w))
    };
    return new EtA.HttpsProxyAgent(A, {
        ...z,
        ...q
    })
}
// @from(Ln 86891, Col 0)
function ytA(A = {}) {
    let q = py(),
        K = x41(),
        Y = X8.create({
            proxy: !1
        });
    if (!q) {
        if (K) Y.defaults.httpsAgent = K;
        return Y
    }
    let z = mK1(q, A);
    return Y.interceptors.request.use((_) => {
        if (_.url && Oo(_.url)) _.httpsAgent = K, _.httpAgent = K;
        else _.httpsAgent = z, _.httpAgent = z;
        return _
    }), Y
}
// @from(Ln 86909, Col 0)
function uQ(A) {
    let q = py();
    if (!q) return;
    if (Oo(A)) return;
    return mK1(q)
}
// @from(Ln 86916, Col 0)
function mQ(A) {
    let q = py();
    if (!q) return;
    if (Oo(A)) return;
    return q
}
// @from(Ln 86923, Col 0)
function W46(A) {
    if (A?.forAnthropicAPI) {
        let K = process.env.ANTHROPIC_UNIX_SOCKET;
        if (K && typeof Bun < "u") return {
            unix: K
        }
    }
    let q = py();
    if (q) {
        if (typeof Bun < "u") return {
            proxy: q,
            ...u41()
        };
        return {
            dispatcher: s88(q)
        }
    }
    return u41()
}
// @from(Ln 86943, Col 0)
function BK1() {
    let A = py(),
        q = x41();
    if (uK1 !== void 0) X8.interceptors.request.eject(uK1), uK1 = void 0;
    if (X8.defaults.proxy = void 0, X8.defaults.httpAgent = void 0, X8.defaults.httpsAgent = void 0, A) {
        X8.defaults.proxy = !1;
        let K = mK1(A);
        uK1 = X8.interceptors.request.use((Y) => {
            if (Y.url && Oo(Y.url))
                if (q) Y.httpsAgent = q, Y.httpAgent = q;
                else delete Y.httpsAgent, delete Y.httpAgent;
            else Y.httpsAgent = K, Y.httpAgent = K;
            return Y
        }), b41(s88(A))
    } else if (q) {
        X8.defaults.httpsAgent = q;
        let K = u41();
        if (K.dispatcher) b41(K.dispatcher)
    }
}
// @from(Ln 86963, Col 0)
async function t88() {
    let A = py();
    if (!A) return {};
    let [{
        NodeHttpHandler: q
    }, {
        defaultProvider: K
    }] = await Promise.all([Promise.resolve().then(() => t(uT(), 1)), Promise.resolve().then(() => t(P46(), 1))]), Y = mK1(A), z = new q({
        httpAgent: Y,
        httpsAgent: Y
    });
    return {
        requestHandler: z,
        credentials: K({
            clientConfig: {
                requestHandler: z
            }
        })
    }
}
// @from(Ln 86984, Col 0)
function LtA() {
    s88.cache.clear?.(), k("Cleared proxy agent cache")
}
// @from(Ln 86987, Col 4)
EtA
// @from(Ln 86987, Col 9)
s88
// @from(Ln 86987, Col 14)
uK1
// @from(Ln 86988, Col 4)
dV = E(() => {
    kK();
    U4();
    La1();
    Mu();
    hh6();
    A8();
    H1();
    EtA = t(yR6(), 1);
    s88 = e1((A) => {
        let q = Ry(),
            K = lS(),
            Y = {
                httpProxy: A,
                httpsProxy: A,
                noProxy: process.env.NO_PROXY || process.env.no_proxy
            };
        if (q || K) {
            let z = {
                ...q && {
                    cert: q.cert,
                    key: q.key,
                    passphrase: q.passphrase
                },
                ...K && {
                    ca: K
                }
            };
            Y.connect = z, Y.requestTls = z
        }
        return new ya1(Y)
    })
})
// @from(Ln 87021, Col 4)
_A8 = x((u05) => {
    u05.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(u05.HttpAuthLocation || (u05.HttpAuthLocation = {}));
    u05.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(u05.HttpApiKeyAuthLocation || (u05.HttpApiKeyAuthLocation = {}));
    u05.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(u05.EndpointURLScheme || (u05.EndpointURLScheme = {}));
    u05.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(u05.AlgorithmId || (u05.AlgorithmId = {}));
    var S05 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => u05.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => u05.AlgorithmId.MD5,
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
        C05 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        I05 = (A) => {
            return S05(A)
        },
        b05 = (A) => {
            return C05(A)
        };
    u05.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(u05.FieldPosition || (u05.FieldPosition = {}));
    var x05 = "__smithy_context";
    u05.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(u05.IniSectionType || (u05.IniSectionType = {}));
    u05.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(u05.RequestHandlerProtocol || (u05.RequestHandlerProtocol = {}));
    u05.SMITHY_CONTEXT_KEY = x05;
    u05.getDefaultClientConfiguration = I05;
    u05.resolveDefaultRuntimeConfig = b05
})
// @from(Ln 87086, Col 4)
QS6 = x((Uj6) => {
    var StA = Pu(),
        jA8 = pT(),
        OA8 = _A8(),
        F05 = dO(),
        RtA = FT();
    class CtA {
        config;
        middlewareStack = StA.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                _ = Y === void 0 && this.config.cacheMiddleware === !0,
                w;
            if (_) {
                if (!this.handlers) this.handlers = new WeakMap;
                let O = this.handlers;
                if (O.has(A.constructor)) w = O.get(A.constructor);
                else w = A.resolveMiddleware(this.middlewareStack, this.config, Y), O.set(A.constructor, w)
            } else delete this.handlers, w = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) w(A).then((O) => z(null, O.output), (O) => z(O)).catch(() => {});
            else return w(A).then((O) => O.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var wA8 = "***SensitiveInformation***";

    function $A8(A, q) {
        if (q == null) return q;
        let K = F05.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return wA8;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return wA8
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return wA8
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = $A8(w, Y[_]);
            return z
        }
        return q
    }
    class JA8 {
        middlewareStack = StA.constructStack();
        schema;
        static classBuilder() {
            return new ItA
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: _,
            inputFilterSensitiveLog: w,
            outputFilterSensitiveLog: O,
            smithyContext: $,
            additionalContext: H,
            CommandCtor: j
        }) {
            for (let P of Y.bind(this)(j, A, q, K)) this.middlewareStack.use(P);
            let J = A.concat(this.middlewareStack),
                {
                    logger: M
                } = q,
                D = {
                    logger: M,
                    clientName: z,
                    commandName: _,
                    inputFilterSensitiveLog: w,
                    outputFilterSensitiveLog: O,
                    [OA8.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...H
                },
                {
                    requestHandler: X
                } = q;
            return J.resolve((P) => X.handle(P.request, K || {}), D)
        }
    }
    class ItA {
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
            return q = class extends JA8 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let _ = A._operationSchema,
                        w = _?.[4] ?? _?.input,
                        O = _?.[5] ?? _?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? $A8.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? $A8.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var p05 = "***SensitiveInformation***",
        Q05 = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        };
    class Qj6 extends Error {
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
            return Qj6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === Qj6) return Qj6.isInstance(A);
            if (Qj6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var btA = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        xtA = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = d05(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw btA(w, q)
        },
        U05 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                xtA({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        d05 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        c05 = (A) => {
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
        htA = !1,
        l05 = (A) => {
            if (A && !htA && parseInt(A.substring(1, A.indexOf("."))) < 16) htA = !0
        },
        i05 = (A) => {
            let q = [];
            for (let K in OA8.AlgorithmId) {
                let Y = OA8.AlgorithmId[K];
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
        n05 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        r05 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        o05 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        utA = (A) => {
            return Object.assign(i05(A), r05(A))
        },
        a05 = utA,
        s05 = (A) => {
            return Object.assign(n05(A), o05(A))
        },
        t05 = (A) => Array.isArray(A) ? A : [A],
        mtA = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = mtA(A[K]);
            return A
        },
        e05 = (A) => {
            return A != null
        };
    class BtA {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function gtA(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, KW5(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            FtA(Y, null, _, w)
        }
        return Y
    }
    var AW5 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        qW5 = (A, q) => {
            let K = {};
            for (let Y in q) FtA(K, A, q, Y);
            return K
        },
        KW5 = (A, q, K) => {
            return gtA(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        FtA = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = YW5, $ = zW5, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        },
        YW5 = (A) => A != null,
        zW5 = (A) => A,
        _W5 = (A) => {
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
        wW5 = (A) => A.toISOString().replace(".000Z", "Z"),
        HA8 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(HA8);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = HA8(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(Uj6, "collectBody", {
        enumerable: !0,
        get: function() {
            return jA8.collectBody
        }
    });
    Object.defineProperty(Uj6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return jA8.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Uj6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return jA8.resolvedPath
        }
    });
    Uj6.Client = CtA;
    Uj6.Command = JA8;
    Uj6.NoOpLogger = BtA;
    Uj6.SENSITIVE_STRING = p05;
    Uj6.ServiceException = Qj6;
    Uj6._json = HA8;
    Uj6.convertMap = AW5;
    Uj6.createAggregatedClient = Q05;
    Uj6.decorateServiceException = btA;
    Uj6.emitWarningIfUnsupportedVersion = l05;
    Uj6.getArrayIfSingleItem = t05;
    Uj6.getDefaultClientConfiguration = a05;
    Uj6.getDefaultExtensionConfiguration = utA;
    Uj6.getValueFromTextNode = mtA;
    Uj6.isSerializableHeaderValue = e05;
    Uj6.loadConfigsForDefaultMode = c05;
    Uj6.map = gtA;
    Uj6.resolveDefaultRuntimeConfig = s05;
    Uj6.serializeDateTime = wW5;
    Uj6.serializeFloat = _W5;
    Uj6.take = qW5;
    Uj6.throwDefaultError = xtA;
    Uj6.withBaseException = U05;
    Object.keys(RtA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Uj6, A)) Object.defineProperty(Uj6, A, {
            enumerable: !0,
            get: function() {
                return RtA[A]
            }
        })
    })
})