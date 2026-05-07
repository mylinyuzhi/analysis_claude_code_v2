
// @from(Ln 88982, Col 4)
DP1 = p((Xx3) => {
    var $x3 = $E(),
        L76 = jP(),
        PP1 = pU(),
        jx3 = E_q(),
        w08 = d6("node:crypto"),
        XP1 = d6("node:fs"),
        Hx3 = d6("node:os"),
        MP1 = d6("node:path");
    class WP1 {
        profileData;
        init;
        callerClientConfig;
        static REFRESH_THRESHOLD = 300000;
        constructor(q, K, _) {
            this.profileData = q, this.init = K, this.callerClientConfig = _
        }
        async loadCredentials() {
            let q = await this.loadToken();
            if (!q) throw new L76.CredentialsProviderError(`Failed to load a token for session ${this.loginSession}, please re-authenticate using aws login`, {
                tryNextLink: !1,
                logger: this.logger
            });
            let K = q.accessToken,
                _ = Date.now();
            if (new Date(K.expiresAt).getTime() - _ <= WP1.REFRESH_THRESHOLD) return this.refresh(q);
            return {
                accessKeyId: K.accessKeyId,
                secretAccessKey: K.secretAccessKey,
                sessionToken: K.sessionToken,
                accountId: K.accountId,
                expiration: new Date(K.expiresAt)
            }
        }
        get logger() {
            return this.init?.logger
        }
        get loginSession() {
            return this.profileData.login_session
        }
        async refresh(q) {
            let {
                SigninClient: K,
                CreateOAuth2TokenCommand: _
            } = await Promise.resolve().then(() => K6(Ezq())), {
                logger: z,
                userAgentAppId: Y
            } = this.callerClientConfig ?? {}, O = ((H) => {
                return H?.metadata?.handlerProtocol === "h2"
            })(this.callerClientConfig?.requestHandler) ? void 0 : this.callerClientConfig?.requestHandler, w = this.profileData.region ?? await this.callerClientConfig?.region?.() ?? process.env.AWS_REGION, $ = new K({
                credentials: {
                    accessKeyId: "",
                    secretAccessKey: ""
                },
                region: w,
                requestHandler: O,
                logger: z,
                userAgentAppId: Y,
                ...this.init?.clientConfig
            });
            this.createDPoPInterceptor($.middlewareStack);
            let j = {
                tokenInput: {
                    clientId: q.clientId,
                    refreshToken: q.refreshToken,
                    grantType: "refresh_token"
                }
            };
            try {
                let H = await $.send(new _(j)),
                    {
                        accessKeyId: J,
                        secretAccessKey: X,
                        sessionToken: M
                    } = H.tokenOutput?.accessToken ?? {},
                    {
                        refreshToken: P,
                        expiresIn: W
                    } = H.tokenOutput ?? {};
                if (!J || !X || !M || !P) throw new L76.CredentialsProviderError("Token refresh response missing required fields", {
                    logger: this.logger,
                    tryNextLink: !1
                });
                let D = (W ?? 900) * 1000,
                    Z = new Date(Date.now() + D),
                    G = {
                        ...q,
                        accessToken: {
                            ...q.accessToken,
                            accessKeyId: J,
                            secretAccessKey: X,
                            sessionToken: M,
                            expiresAt: Z.toISOString()
                        },
                        refreshToken: P
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
            } catch (H) {
                if (H.name === "AccessDeniedException") {
                    let J = H.error,
                        X;
                    switch (J) {
                        case "TOKEN_EXPIRED":
                            X = "Your session has expired. Please reauthenticate.";
                            break;
                        case "USER_CREDENTIALS_CHANGED":
                            X = "Unable to refresh credentials because of a change in your password. Please reauthenticate with your new password.";
                            break;
                        case "INSUFFICIENT_PERMISSIONS":
                            X = "Unable to refresh credentials due to insufficient permissions. You may be missing permission for the 'CreateOAuth2Token' action.";
                            break;
                        default:
                            X = `Failed to refresh token: ${String(H)}. Please re-authenticate using \`aws login\``
                    }
                    throw new L76.CredentialsProviderError(X, {
                        logger: this.logger,
                        tryNextLink: !1
                    })
                }
                throw new L76.CredentialsProviderError(`Failed to refresh token: ${String(H)}. Please re-authenticate using aws login`, {
                    logger: this.logger
                })
            }
        }
        async loadToken() {
            let q = this.getTokenFilePath();
            try {
                let K;
                try {
                    K = await PP1.readFile(q, {
                        ignoreCache: this.init?.ignoreCache
                    })
                } catch {
                    K = await XP1.promises.readFile(q, "utf8")
                }
                let _ = JSON.parse(K),
                    z = ["accessToken", "clientId", "refreshToken", "dpopKey"].filter((Y) => !_[Y]);
                if (!_.accessToken?.accountId) z.push("accountId");
                if (z.length > 0) throw new L76.CredentialsProviderError(`Token validation failed, missing fields: ${z.join(", ")}`, {
                    logger: this.logger,
                    tryNextLink: !1
                });
                return _
            } catch (K) {
                throw new L76.CredentialsProviderError(`Failed to load token from ${q}: ${String(K)}`, {
                    logger: this.logger,
                    tryNextLink: !1
                })
            }
        }
        async saveToken(q) {
            let K = this.getTokenFilePath(),
                _ = MP1.dirname(K);
            try {
                await XP1.promises.mkdir(_, {
                    recursive: !0
                })
            } catch (z) {}
            await XP1.promises.writeFile(K, JSON.stringify(q, null, 2), "utf8")
        }
        getTokenFilePath() {
            let q = process.env.AWS_LOGIN_CACHE_DIRECTORY ?? MP1.join(Hx3.homedir(), ".aws", "login", "cache"),
                K = Buffer.from(this.loginSession, "utf8"),
                _ = w08.createHash("sha256").update(K).digest("hex");
            return MP1.join(q, `${_}.json`)
        }
        derToRawSignature(q) {
            let K = 2;
            if (q[K] !== 2) throw Error("Invalid DER signature");
            K++;
            let _ = q[K++],
                z = q.subarray(K, K + _);
            if (K += _, q[K] !== 2) throw Error("Invalid DER signature");
            K++;
            let Y = q[K++],
                A = q.subarray(K, K + Y);
            z = z[0] === 0 ? z.subarray(1) : z, A = A[0] === 0 ? A.subarray(1) : A;
            let O = Buffer.concat([Buffer.alloc(32 - z.length), z]),
                w = Buffer.concat([Buffer.alloc(32 - A.length), A]);
            return Buffer.concat([O, w])
        }
        createDPoPInterceptor(q) {
            q.add((K) => async (_) => {
                if (jx3.HttpRequest.isInstance(_.request)) {
                    let z = _.request,
                        Y = `${z.protocol}//${z.hostname}${z.port?`:${z.port}`:""}${z.path}`,
                        A = await this.generateDpop(z.method, Y);
                    z.headers = {
                        ...z.headers,
                        DPoP: A
                    }
                }
                return K(_)
            }, {
                step: "finalizeRequest",
                name: "dpopInterceptor",
                override: !0
            })
        }
        async generateDpop(q = "POST", K) {
            let _ = await this.loadToken();
            try {
                let z = w08.createPrivateKey({
                        key: _.dpopKey,
                        format: "pem",
                        type: "sec1"
                    }),
                    A = w08.createPublicKey(z).export({
                        format: "der",
                        type: "spki"
                    }),
                    O = -1;
                for (let Z = 0; Z < A.length; Z++)
                    if (A[Z] === 4) {
                        O = Z;
                        break
                    } let w = A.slice(O + 1, O + 33),
                    $ = A.slice(O + 33, O + 65),
                    j = {
                        alg: "ES256",
                        typ: "dpop+jwt",
                        jwk: {
                            kty: "EC",
                            crv: "P-256",
                            x: w.toString("base64url"),
                            y: $.toString("base64url")
                        }
                    },
                    H = {
                        jti: crypto.randomUUID(),
                        htm: q,
                        htu: K,
                        iat: Math.floor(Date.now() / 1000)
                    },
                    J = Buffer.from(JSON.stringify(j)).toString("base64url"),
                    X = Buffer.from(JSON.stringify(H)).toString("base64url"),
                    M = `${J}.${X}`,
                    P = w08.sign("sha256", Buffer.from(M), z),
                    D = this.derToRawSignature(P).toString("base64url");
                return `${M}.${D}`
            } catch (z) {
                throw new L76.CredentialsProviderError(`Failed to generate Dpop proof: ${z instanceof Error?z.message:String(z)}`, {
                    logger: this.logger,
                    tryNextLink: !1
                })
            }
        }
    }
    var Jx3 = (q) => async ({
        callerClientConfig: K
    } = {}) => {
        q?.logger?.debug?.("@aws-sdk/credential-providers - fromLoginCredentials");
        let _ = await PP1.parseKnownFiles(q || {}),
            z = PP1.getProfileName({
                profile: q?.profile ?? K?.profile
            }),
            Y = _[z];
        if (!Y?.login_session) throw new L76.CredentialsProviderError(`Profile ${z} does not contain login_session.`, {
            tryNextLink: !0,
            logger: q?.logger
        });
        let O = await new WP1(Y, q, K).loadCredentials();
        return $x3.setCredentialFeature(O, "CREDENTIALS_LOGIN", "AD")
    };
    Xx3.fromLoginCredentials = Jx3
})
// @from(Ln 89256, Col 4)
fP1 = p((yzq) => {
    Object.defineProperty(yzq, "__esModule", {
        value: !0
    });
    yzq.resolveHttpAuthSchemeConfig = yzq.resolveStsAuthConfig = yzq.defaultSTSHttpAuthSchemeProvider = yzq.defaultSTSHttpAuthSchemeParametersProvider = void 0;
    var Px3 = k$(),
        ZP1 = Dv(),
        Wx3 = GP1(),
        Dx3 = async (q, K, _) => {
            return {
                operation: (0, ZP1.getSmithyContext)(K).operation,
                region: await (0, ZP1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    yzq.defaultSTSHttpAuthSchemeParametersProvider = Dx3;

    function Zx3(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sts",
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

    function fx3(q) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var Gx3 = (q) => {
        let K = [];
        switch (q.operation) {
            case "AssumeRoleWithWebIdentity": {
                K.push(fx3(q));
                break
            }
            default:
                K.push(Zx3(q))
        }
        return K
    };
    yzq.defaultSTSHttpAuthSchemeProvider = Gx3;
    var vx3 = (q) => Object.assign(q, {
        stsClientCtor: Wx3.STSClient
    });
    yzq.resolveStsAuthConfig = vx3;
    var Tx3 = (q) => {
        let K = yzq.resolveStsAuthConfig(q),
            _ = (0, Px3.resolveAwsSdkSigV4Config)(K);
        return Object.assign(_, {
            authSchemePreference: (0, ZP1.normalizeProvider)(q.authSchemePreference ?? [])
        })
    };
    yzq.resolveHttpAuthSchemeConfig = Tx3
})
// @from(Ln 89321, Col 4)
vP1 = p((Rzq) => {
    Object.defineProperty(Rzq, "__esModule", {
        value: !0
    });
    Rzq.commonParams = Rzq.resolveClientEndpointParameters = void 0;
    var Nx3 = (q) => {
        return Object.assign(q, {
            useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
            useFipsEndpoint: q.useFipsEndpoint ?? !1,
            useGlobalEndpoint: q.useGlobalEndpoint ?? !1,
            defaultSigningName: "sts"
        })
    };
    Rzq.resolveClientEndpointParameters = Nx3;
    Rzq.commonParams = {
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
// @from(Ln 89358, Col 4)
qYq = p((tzq) => {
    Object.defineProperty(tzq, "__esModule", {
        value: !0
    });
    tzq.ruleSet = void 0;
    var Qzq = "required",
        f_ = "type",
        sA = "fn",
        tA = "argv",
        R76 = "ref",
        Czq = !1,
        TP1 = !0,
        h76 = "booleanEquals",
        aZ = "stringEquals",
        dzq = "sigv4",
        czq = "sts",
        lzq = "us-east-1",
        tj = "endpoint",
        bzq = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
        iU = "tree",
        lv6 = "error",
        kP1 = "getAttr",
        Izq = {
            [Qzq]: !1,
            [f_]: "string"
        },
        VP1 = {
            [Qzq]: !0,
            default: !1,
            [f_]: "boolean"
        },
        nzq = {
            [R76]: "Endpoint"
        },
        xzq = {
            [sA]: "isSet",
            [tA]: [{
                [R76]: "Region"
            }]
        },
        sZ = {
            [R76]: "Region"
        },
        uzq = {
            [sA]: "aws.partition",
            [tA]: [sZ],
            assign: "PartitionResult"
        },
        izq = {
            [R76]: "UseFIPS"
        },
        rzq = {
            [R76]: "UseDualStack"
        },
        Tv = {
            url: "https://sts.amazonaws.com",
            properties: {
                authSchemes: [{
                    name: dzq,
                    signingName: czq,
                    signingRegion: lzq
                }]
            },
            headers: {}
        },
        mh = {},
        mzq = {
            conditions: [{
                [sA]: aZ,
                [tA]: [sZ, "aws-global"]
            }],
            [tj]: Tv,
            [f_]: tj
        },
        ozq = {
            [sA]: h76,
            [tA]: [izq, !0]
        },
        azq = {
            [sA]: h76,
            [tA]: [rzq, !0]
        },
        Bzq = {
            [sA]: kP1,
            [tA]: [{
                [R76]: "PartitionResult"
            }, "supportsFIPS"]
        },
        szq = {
            [R76]: "PartitionResult"
        },
        pzq = {
            [sA]: h76,
            [tA]: [!0, {
                [sA]: kP1,
                [tA]: [szq, "supportsDualStack"]
            }]
        },
        Fzq = [{
            [sA]: "isSet",
            [tA]: [nzq]
        }],
        gzq = [ozq],
        Uzq = [azq],
        yx3 = {
            version: "1.0",
            parameters: {
                Region: Izq,
                UseDualStack: VP1,
                UseFIPS: VP1,
                Endpoint: Izq,
                UseGlobalEndpoint: VP1
            },
            rules: [{
                conditions: [{
                    [sA]: h76,
                    [tA]: [{
                        [R76]: "UseGlobalEndpoint"
                    }, TP1]
                }, {
                    [sA]: "not",
                    [tA]: Fzq
                }, xzq, uzq, {
                    [sA]: h76,
                    [tA]: [izq, Czq]
                }, {
                    [sA]: h76,
                    [tA]: [rzq, Czq]
                }],
                rules: [{
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "ap-northeast-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "ap-south-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "ap-southeast-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "ap-southeast-2"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, mzq, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "ca-central-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "eu-central-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "eu-north-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "eu-west-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "eu-west-2"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "eu-west-3"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "sa-east-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, lzq]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "us-east-2"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "us-west-1"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    conditions: [{
                        [sA]: aZ,
                        [tA]: [sZ, "us-west-2"]
                    }],
                    endpoint: Tv,
                    [f_]: tj
                }, {
                    endpoint: {
                        url: bzq,
                        properties: {
                            authSchemes: [{
                                name: dzq,
                                signingName: czq,
                                signingRegion: "{Region}"
                            }]
                        },
                        headers: mh
                    },
                    [f_]: tj
                }],
                [f_]: iU
            }, {
                conditions: Fzq,
                rules: [{
                    conditions: gzq,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    [f_]: lv6
                }, {
                    conditions: Uzq,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    [f_]: lv6
                }, {
                    endpoint: {
                        url: nzq,
                        properties: mh,
                        headers: mh
                    },
                    [f_]: tj
                }],
                [f_]: iU
            }, {
                conditions: [xzq],
                rules: [{
                    conditions: [uzq],
                    rules: [{
                        conditions: [ozq, azq],
                        rules: [{
                            conditions: [{
                                [sA]: h76,
                                [tA]: [TP1, Bzq]
                            }, pzq],
                            rules: [{
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: mh,
                                    headers: mh
                                },
                                [f_]: tj
                            }],
                            [f_]: iU
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            [f_]: lv6
                        }],
                        [f_]: iU
                    }, {
                        conditions: gzq,
                        rules: [{
                            conditions: [{
                                [sA]: h76,
                                [tA]: [Bzq, TP1]
                            }],
                            rules: [{
                                conditions: [{
                                    [sA]: aZ,
                                    [tA]: [{
                                        [sA]: kP1,
                                        [tA]: [szq, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://sts.{Region}.amazonaws.com",
                                    properties: mh,
                                    headers: mh
                                },
                                [f_]: tj
                            }, {
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: mh,
                                    headers: mh
                                },
                                [f_]: tj
                            }],
                            [f_]: iU
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            [f_]: lv6
                        }],
                        [f_]: iU
                    }, {
                        conditions: Uzq,
                        rules: [{
                            conditions: [pzq],
                            rules: [{
                                endpoint: {
                                    url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: mh,
                                    headers: mh
                                },
                                [f_]: tj
                            }],
                            [f_]: iU
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            [f_]: lv6
                        }],
                        [f_]: iU
                    }, mzq, {
                        endpoint: {
                            url: bzq,
                            properties: mh,
                            headers: mh
                        },
                        [f_]: tj
                    }],
                    [f_]: iU
                }],
                [f_]: iU
            }, {
                error: "Invalid Configuration: Missing Region",
                [f_]: lv6
            }]
        };
    tzq.ruleSet = yx3
})
// @from(Ln 89722, Col 4)
zYq = p((KYq) => {
    Object.defineProperty(KYq, "__esModule", {
        value: !0
    });
    KYq.defaultEndpointResolver = void 0;
    var Lx3 = QU(),
        NP1 = dm(),
        hx3 = qYq(),
        Rx3 = new NP1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
        }),
        Sx3 = (q, K = {}) => {
            return Rx3.get(q, () => (0, NP1.resolveEndpoint)(hx3.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    KYq.defaultEndpointResolver = Sx3;
    NP1.customEndpointFunctions.aws = Lx3.awsEndpointFunctions
})
// @from(Ln 89743, Col 4)
$Yq = p((OYq) => {
    Object.defineProperty(OYq, "__esModule", {
        value: !0
    });
    OYq.getRuntimeConfig = void 0;
    var Cx3 = k$(),
        bx3 = Ao(),
        Ix3 = FO(),
        xx3 = uV(),
        ux3 = jb(),
        YYq = SW8(),
        AYq = nw(),
        mx3 = fP1(),
        Bx3 = zYq(),
        px3 = (q) => {
            return {
                apiVersion: "2011-06-15",
                base64Decoder: q?.base64Decoder ?? YYq.fromBase64,
                base64Encoder: q?.base64Encoder ?? YYq.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? Bx3.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? mx3.defaultSTSHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new Cx3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new Ix3.NoAuthSigner
                }],
                logger: q?.logger ?? new xx3.NoOpLogger,
                protocol: q?.protocol ?? new bx3.AwsQueryProtocol({
                    defaultNamespace: "com.amazonaws.sts",
                    xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
                    version: "2011-06-15"
                }),
                serviceId: q?.serviceId ?? "STS",
                urlParser: q?.urlParser ?? ux3.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? AYq.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? AYq.toUtf8
            }
        };
    OYq.getRuntimeConfig = px3
})
// @from(Ln 89789, Col 4)
PYq = p((XYq) => {
    Object.defineProperty(XYq, "__esModule", {
        value: !0
    });
    XYq.getRuntimeConfig = void 0;
    var Fx3 = IV(),
        gx3 = Fx3.__importDefault(yW8()),
        EP1 = k$(),
        jYq = Ko(),
        $08 = KM(),
        Ux3 = FO(),
        Qx3 = _o(),
        HYq = rZ(),
        RO6 = jE(),
        JYq = wE(),
        dx3 = zo(),
        cx3 = lU(),
        lx3 = $Yq(),
        nx3 = uV(),
        ix3 = wo(),
        rx3 = uV(),
        ox3 = (q) => {
            (0, rx3.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, ix3.resolveDefaultsModeConfig)(q),
                _ = () => K().then(nx3.loadConfigsForDefaultMode),
                z = (0, lx3.getRuntimeConfig)(q);
            (0, EP1.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, RO6.loadConfig)(EP1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? dx3.calculateBodyLength,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, jYq.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: gx3.default.version
                }),
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (A) => A.getIdentityProvider("aws.auth#sigv4") || (async (O) => await q.credentialDefaultProvider(O?.__config || {})()),
                    signer: new EP1.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (A) => A.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new Ux3.NoAuthSigner
                }],
                maxAttempts: q?.maxAttempts ?? (0, RO6.loadConfig)(HYq.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, RO6.loadConfig)($08.NODE_REGION_CONFIG_OPTIONS, {
                    ...$08.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: JYq.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, RO6.loadConfig)({
                    ...HYq.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || cx3.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? Qx3.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? JYq.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, RO6.loadConfig)($08.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, RO6.loadConfig)($08.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, RO6.loadConfig)(jYq.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    XYq.getRuntimeConfig = ox3
})
// @from(Ln 89859, Col 4)
ZYq = p((WYq) => {
    Object.defineProperty(WYq, "__esModule", {
        value: !0
    });
    WYq.resolveHttpAuthRuntimeConfig = WYq.getHttpAuthExtensionConfiguration = void 0;
    var ax3 = (q) => {
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
    };
    WYq.getHttpAuthExtensionConfiguration = ax3;
    var sx3 = (q) => {
        return {
            httpAuthSchemes: q.httpAuthSchemes(),
            httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
            credentials: q.credentials()
        }
    };
    WYq.resolveHttpAuthRuntimeConfig = sx3
})
// @from(Ln 89903, Col 4)
NYq = p((VYq) => {
    Object.defineProperty(VYq, "__esModule", {
        value: !0
    });
    VYq.resolveRuntimeExtensions = void 0;
    var fYq = lm(),
        GYq = IW8(),
        vYq = uV(),
        TYq = ZYq(),
        ex3 = (q, K) => {
            let _ = Object.assign((0, fYq.getAwsRegionExtensionConfiguration)(q), (0, vYq.getDefaultExtensionConfiguration)(q), (0, GYq.getHttpHandlerExtensionConfiguration)(q), (0, TYq.getHttpAuthExtensionConfiguration)(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, (0, fYq.resolveAwsRegionExtensionConfiguration)(_), (0, vYq.resolveDefaultRuntimeConfig)(_), (0, GYq.resolveHttpHandlerRuntimeConfig)(_), (0, TYq.resolveHttpAuthRuntimeConfig)(_))
        };
    VYq.resolveRuntimeExtensions = ex3
})
// @from(Ln 89918, Col 4)
GP1 = p((LP1) => {
    Object.defineProperty(LP1, "__esModule", {
        value: !0
    });
    LP1.STSClient = LP1.__Client = void 0;
    var EYq = nr(),
        qu3 = ir(),
        Ku3 = rr(),
        yYq = cU(),
        _u3 = KM(),
        yP1 = FO(),
        zu3 = sj(),
        Yu3 = qo(),
        Au3 = cm(),
        LYq = rZ(),
        RYq = uV();
    Object.defineProperty(LP1, "__Client", {
        enumerable: !0,
        get: function() {
            return RYq.Client
        }
    });
    var hYq = fP1(),
        Ou3 = vP1(),
        wu3 = PYq(),
        $u3 = NYq();
    class SYq extends RYq.Client {
        config;
        constructor(...[q]) {
            let K = (0, wu3.getRuntimeConfig)(q || {});
            super(K);
            this.initConfig = K;
            let _ = (0, Ou3.resolveClientEndpointParameters)(K),
                z = (0, yYq.resolveUserAgentConfig)(_),
                Y = (0, LYq.resolveRetryConfig)(z),
                A = (0, _u3.resolveRegionConfig)(Y),
                O = (0, EYq.resolveHostHeaderConfig)(A),
                w = (0, Au3.resolveEndpointConfig)(O),
                $ = (0, hYq.resolveHttpAuthSchemeConfig)(w),
                j = (0, $u3.resolveRuntimeExtensions)($, q?.extensions || []);
            this.config = j, this.middlewareStack.use((0, zu3.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, yYq.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, LYq.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Yu3.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, EYq.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, qu3.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, Ku3.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, yP1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
                httpAuthSchemeParametersProvider: hYq.defaultSTSHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (H) => new yP1.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": H.credentials
                })
            })), this.middlewareStack.use((0, yP1.getHttpSigningPlugin)(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    LP1.STSClient = SYq
})
// @from(Ln 89971, Col 4)
X08 = p((j08) => {
    var tc6 = GP1(),
        ec6 = uV(),
        bYq = cm(),
        IYq = vP1(),
        S76 = sj(),
        hP1 = $E(),
        ju3 = lm(),
        Ho = class q extends ec6.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        xYq = class q extends Ho {
            name = "ExpiredTokenException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ExpiredTokenException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        uYq = class q extends Ho {
            name = "MalformedPolicyDocumentException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "MalformedPolicyDocumentException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        mYq = class q extends Ho {
            name = "PackedPolicyTooLargeException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "PackedPolicyTooLargeException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        BYq = class q extends Ho {
            name = "RegionDisabledException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "RegionDisabledException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        pYq = class q extends Ho {
            name = "IDPRejectedClaimException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "IDPRejectedClaimException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        FYq = class q extends Ho {
            name = "InvalidIdentityTokenException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "InvalidIdentityTokenException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        gYq = class q extends Ho {
            name = "IDPCommunicationErrorException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "IDPCommunicationErrorException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        Hu3 = "Arn",
        Ju3 = "AccessKeyId",
        Xu3 = "AssumeRole",
        Mu3 = "AssumedRoleId",
        Pu3 = "AssumeRoleRequest",
        Wu3 = "AssumeRoleResponse",
        RP1 = "AssumedRoleUser",
        Du3 = "AssumeRoleWithWebIdentity",
        Zu3 = "AssumeRoleWithWebIdentityRequest",
        fu3 = "AssumeRoleWithWebIdentityResponse",
        Gu3 = "Audience",
        SP1 = "Credentials",
        vu3 = "ContextAssertion",
        UYq = "DurationSeconds",
        Tu3 = "Expiration",
        Vu3 = "ExternalId",
        ku3 = "ExpiredTokenException",
        Nu3 = "IDPCommunicationErrorException",
        Eu3 = "IDPRejectedClaimException",
        yu3 = "InvalidIdentityTokenException",
        Lu3 = "Key",
        hu3 = "MalformedPolicyDocumentException",
        QYq = "Policy",
        dYq = "PolicyArns",
        Ru3 = "ProviderArn",
        Su3 = "ProvidedContexts",
        Cu3 = "ProvidedContextsListType",
        bu3 = "ProvidedContext",
        Iu3 = "PolicyDescriptorType",
        xu3 = "ProviderId",
        cYq = "PackedPolicySize",
        uu3 = "PackedPolicyTooLargeException",
        mu3 = "Provider",
        lYq = "RoleArn",
        Bu3 = "RegionDisabledException",
        nYq = "RoleSessionName",
        pu3 = "SecretAccessKey",
        Fu3 = "SubjectFromWebIdentityToken",
        CP1 = "SourceIdentity",
        gu3 = "SerialNumber",
        Uu3 = "SessionToken",
        Qu3 = "Tags",
        du3 = "TokenCode",
        cu3 = "TransitiveTagKeys",
        lu3 = "Tag",
        nu3 = "Value",
        iu3 = "WebIdentityToken",
        ru3 = "arn",
        ou3 = "accessKeySecretType",
        SO6 = "awsQueryError",
        CO6 = "client",
        au3 = "clientTokenType",
        bO6 = "error",
        IO6 = "httpError",
        xO6 = "message",
        su3 = "policyDescriptorListType",
        iYq = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
        tu3 = "tagListType",
        UO = "com.amazonaws.sts",
        eu3 = [0, UO, ou3, 8, 0],
        qm3 = [0, UO, au3, 8, 0],
        rYq = [3, UO, RP1, 0, [Mu3, Hu3],
            [0, 0]
        ],
        Km3 = [3, UO, Pu3, 0, [lYq, nYq, dYq, QYq, UYq, Qu3, cu3, Vu3, gu3, du3, CP1, Su3],
            [0, 0, () => aYq, 0, 1, () => Zm3, 64, 0, 0, 0, 0, () => Dm3]
        ],
        _m3 = [3, UO, Wu3, 0, [SP1, RP1, cYq, CP1],
            [
                [() => oYq, 0], () => rYq, 1, 0
            ]
        ],
        zm3 = [3, UO, Zu3, 0, [lYq, nYq, iu3, xu3, dYq, QYq, UYq],
            [0, 0, [() => qm3, 0], 0, () => aYq, 0, 1]
        ],
        Ym3 = [3, UO, fu3, 0, [SP1, Fu3, RP1, cYq, mu3, Gu3, CP1],
            [
                [() => oYq, 0], 0, () => rYq, 1, 0, 0, 0
            ]
        ],
        oYq = [3, UO, SP1, 0, [Ju3, pu3, Uu3, Tu3],
            [0, [() => eu3, 0], 0, 4]
        ],
        Am3 = [-3, UO, ku3, {
                [bO6]: CO6,
                [IO6]: 400,
                [SO6]: ["ExpiredTokenException", 400]
            },
            [xO6],
            [0]
        ];
    S76.TypeRegistry.for(UO).registerError(Am3, xYq);
    var Om3 = [-3, UO, Nu3, {
            [bO6]: CO6,
            [IO6]: 400,
            [SO6]: ["IDPCommunicationError", 400]
        },
        [xO6],
        [0]
    ];
    S76.TypeRegistry.for(UO).registerError(Om3, gYq);
    var wm3 = [-3, UO, Eu3, {
            [bO6]: CO6,
            [IO6]: 403,
            [SO6]: ["IDPRejectedClaim", 403]
        },
        [xO6],
        [0]
    ];
    S76.TypeRegistry.for(UO).registerError(wm3, pYq);
    var $m3 = [-3, UO, yu3, {
            [bO6]: CO6,
            [IO6]: 400,
            [SO6]: ["InvalidIdentityToken", 400]
        },
        [xO6],
        [0]
    ];
    S76.TypeRegistry.for(UO).registerError($m3, FYq);
    var jm3 = [-3, UO, hu3, {
            [bO6]: CO6,
            [IO6]: 400,
            [SO6]: ["MalformedPolicyDocument", 400]
        },
        [xO6],
        [0]
    ];
    S76.TypeRegistry.for(UO).registerError(jm3, uYq);
    var Hm3 = [-3, UO, uu3, {
            [bO6]: CO6,
            [IO6]: 400,
            [SO6]: ["PackedPolicyTooLarge", 400]
        },
        [xO6],
        [0]
    ];
    S76.TypeRegistry.for(UO).registerError(Hm3, mYq);
    var Jm3 = [3, UO, Iu3, 0, [ru3],
            [0]
        ],
        Xm3 = [3, UO, bu3, 0, [Ru3, vu3],
            [0, 0]
        ],
        Mm3 = [-3, UO, Bu3, {
                [bO6]: CO6,
                [IO6]: 403,
                [SO6]: ["RegionDisabledException", 403]
            },
            [xO6],
            [0]
        ];
    S76.TypeRegistry.for(UO).registerError(Mm3, BYq);
    var Pm3 = [3, UO, lu3, 0, [Lu3, nu3],
            [0, 0]
        ],
        Wm3 = [-3, iYq, "STSServiceException", 0, [],
            []
        ];
    S76.TypeRegistry.for(iYq).registerError(Wm3, Ho);
    var aYq = [1, UO, su3, 0, () => Jm3],
        Dm3 = [1, UO, Cu3, 0, () => Xm3],
        Zm3 = [1, UO, tu3, 0, () => Pm3],
        fm3 = [9, UO, Xu3, 0, () => Km3, () => _m3],
        Gm3 = [9, UO, Du3, 0, () => zm3, () => Ym3];
    class H08 extends ec6.Command.classBuilder().ep(IYq.commonParams).m(function(q, K, _, z) {
        return [bYq.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(fm3).build() {}
    class J08 extends ec6.Command.classBuilder().ep(IYq.commonParams).m(function(q, K, _, z) {
        return [bYq.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(Gm3).build() {}
    var vm3 = {
        AssumeRoleCommand: H08,
        AssumeRoleWithWebIdentityCommand: J08
    };
    class bP1 extends tc6.STSClient {}
    ec6.createAggregatedClient(vm3, bP1);
    var sYq = (q) => {
            if (typeof q?.Arn === "string") {
                let K = q.Arn.split(":");
                if (K.length > 4 && K[4] !== "") return K[4]
            }
            return
        },
        tYq = async (q, K, _, z = {}) => {
            let Y = typeof q === "function" ? await q() : q,
                A = typeof K === "function" ? await K() : K,
                O = await ju3.stsRegionDefaultResolver(z)();
            return _?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${Y} (credential provider clientConfig)`, `${A} (contextual client)`, `${O} (STS default: AWS_REGION, profile region, or us-east-1)`), Y ?? A ?? O
        }, Tm3 = (q, K) => {
            let _, z;
            return async (Y, A) => {
                if (z = Y, !_) {
                    let {
                        logger: H = q?.parentClientConfig?.logger,
                        profile: J = q?.parentClientConfig?.profile,
                        region: X,
                        requestHandler: M = q?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: P,
                        userAgentAppId: W = q?.parentClientConfig?.userAgentAppId
                    } = q, D = await tYq(X, q?.parentClientConfig?.region, P, {
                        logger: H,
                        profile: J
                    }), Z = !eYq(M);
                    _ = new K({
                        ...q,
                        userAgentAppId: W,
                        profile: J,
                        credentialDefaultProvider: () => async () => z,
                        region: D,
                        requestHandler: Z ? M : void 0,
                        logger: H
                    })
                }
                let {
                    Credentials: O,
                    AssumedRoleUser: w
                } = await _.send(new H08(A));
                if (!O || !O.AccessKeyId || !O.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${A.RoleArn}`);
                let $ = sYq(w),
                    j = {
                        accessKeyId: O.AccessKeyId,
                        secretAccessKey: O.SecretAccessKey,
                        sessionToken: O.SessionToken,
                        expiration: O.Expiration,
                        ...O.CredentialScope && {
                            credentialScope: O.CredentialScope
                        },
                        ...$ && {
                            accountId: $
                        }
                    };
                return hP1.setCredentialFeature(j, "CREDENTIALS_STS_ASSUME_ROLE", "i"), j
            }
        }, Vm3 = (q, K) => {
            let _;
            return async (z) => {
                if (!_) {
                    let {
                        logger: $ = q?.parentClientConfig?.logger,
                        profile: j = q?.parentClientConfig?.profile,
                        region: H,
                        requestHandler: J = q?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: X,
                        userAgentAppId: M = q?.parentClientConfig?.userAgentAppId
                    } = q, P = await tYq(H, q?.parentClientConfig?.region, X, {
                        logger: $,
                        profile: j
                    }), W = !eYq(J);
                    _ = new K({
                        ...q,
                        userAgentAppId: M,
                        profile: j,
                        region: P,
                        requestHandler: W ? J : void 0,
                        logger: $
                    })
                }
                let {
                    Credentials: Y,
                    AssumedRoleUser: A
                } = await _.send(new J08(z));
                if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${z.RoleArn}`);
                let O = sYq(A),
                    w = {
                        accessKeyId: Y.AccessKeyId,
                        secretAccessKey: Y.SecretAccessKey,
                        sessionToken: Y.SessionToken,
                        expiration: Y.Expiration,
                        ...Y.CredentialScope && {
                            credentialScope: Y.CredentialScope
                        },
                        ...O && {
                            accountId: O
                        }
                    };
                if (O) hP1.setCredentialFeature(w, "RESOLVED_ACCOUNT_ID", "T");
                return hP1.setCredentialFeature(w, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), w
            }
        }, eYq = (q) => {
            return q?.metadata?.handlerProtocol === "h2"
        }, qAq = (q, K) => {
            if (!K) return q;
            else return class extends q {
                constructor(z) {
                    super(z);
                    for (let Y of K) this.middlewareStack.use(Y)
                }
            }
        }, KAq = (q = {}, K) => Tm3(q, qAq(tc6.STSClient, K)), _Aq = (q = {}, K) => Vm3(q, qAq(tc6.STSClient, K)), km3 = (q) => (K) => q({
            roleAssumer: KAq(K),
            roleAssumerWithWebIdentity: _Aq(K),
            ...K
        });
    Object.defineProperty(j08, "$Command", {
        enumerable: !0,
        get: function() {
            return ec6.Command
        }
    });
    j08.AssumeRoleCommand = H08;
    j08.AssumeRoleWithWebIdentityCommand = J08;
    j08.ExpiredTokenException = xYq;
    j08.IDPCommunicationErrorException = gYq;
    j08.IDPRejectedClaimException = pYq;
    j08.InvalidIdentityTokenException = FYq;
    j08.MalformedPolicyDocumentException = uYq;
    j08.PackedPolicyTooLargeException = mYq;
    j08.RegionDisabledException = BYq;
    j08.STS = bP1;
    j08.STSServiceException = Ho;
    j08.decorateDefaultCredentialProvider = km3;
    j08.getDefaultRoleAssumer = KAq;
    j08.getDefaultRoleAssumerWithWebIdentity = _Aq;
    Object.keys(tc6).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(j08, q)) Object.defineProperty(j08, q, {
            enumerable: !0,
            get: function() {
                return tc6[q]
            }
        })
    })
})
// @from(Ln 90391, Col 4)
M08 = p((cm3) => {
    var xP1 = pU(),
        IP1 = jP(),
        pm3 = d6("child_process"),
        Fm3 = d6("util"),
        gm3 = $E(),
        Um3 = (q, K, _) => {
            if (K.Version !== 1) throw Error(`Profile ${q} credential_process did not return Version 1.`);
            if (K.AccessKeyId === void 0 || K.SecretAccessKey === void 0) throw Error(`Profile ${q} credential_process returned invalid credentials.`);
            if (K.Expiration) {
                let A = new Date;
                if (new Date(K.Expiration) < A) throw Error(`Profile ${q} credential_process returned expired credentials.`)
            }
            let z = K.AccountId;
            if (!z && _?.[q]?.aws_account_id) z = _[q].aws_account_id;
            let Y = {
                accessKeyId: K.AccessKeyId,
                secretAccessKey: K.SecretAccessKey,
                ...K.SessionToken && {
                    sessionToken: K.SessionToken
                },
                ...K.Expiration && {
                    expiration: new Date(K.Expiration)
                },
                ...K.CredentialScope && {
                    credentialScope: K.CredentialScope
                },
                ...z && {
                    accountId: z
                }
            };
            return gm3.setCredentialFeature(Y, "CREDENTIALS_PROCESS", "w"), Y
        },
        Qm3 = async (q, K, _) => {
            let z = K[q];
            if (K[q]) {
                let Y = z.credential_process;
                if (Y !== void 0) {
                    let A = Fm3.promisify(xP1.externalDataInterceptor?.getTokenRecord?.().exec ?? pm3.exec);
                    try {
                        let {
                            stdout: O
                        } = await A(Y), w;
                        try {
                            w = JSON.parse(O.trim())
                        } catch {
                            throw Error(`Profile ${q} credential_process returned invalid JSON.`)
                        }
                        return Um3(q, w, K)
                    } catch (O) {
                        throw new IP1.CredentialsProviderError(O.message, {
                            logger: _
                        })
                    }
                } else throw new IP1.CredentialsProviderError(`Profile ${q} did not contain credential_process.`, {
                    logger: _
                })
            } else throw new IP1.CredentialsProviderError(`Profile ${q} could not be found in shared credentials file.`, {
                logger: _
            })
        }, dm3 = (q = {}) => async ({
            callerClientConfig: K
        } = {}) => {
            q.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
            let _ = await xP1.parseKnownFiles(q);
            return Qm3(xP1.getProfileName({
                profile: q.profile ?? K?.profile
            }), _, q.logger)
        };
    cm3.fromProcess = dm3
})
// @from(Ln 90462, Col 4)
uP1 = p((rU) => {
    var nm3 = rU && rU.__createBinding || (Object.create ? function(q, K, _, z) {
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
        im3 = rU && rU.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        rm3 = rU && rU.__importStar || function() {
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
                        if (z[Y] !== "default") nm3(_, K, z[Y])
                }
                return im3(_, K), _
            }
        }();
    Object.defineProperty(rU, "__esModule", {
        value: !0
    });
    rU.fromWebToken = void 0;
    var om3 = (q) => async (K) => {
        q.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
        let {
            roleArn: _,
            roleSessionName: z,
            webIdentityToken: Y,
            providerId: A,
            policyArns: O,
            policy: w,
            durationSeconds: $
        } = q, {
            roleAssumerWithWebIdentity: j
        } = q;
        if (!j) {
            let {
                getDefaultRoleAssumerWithWebIdentity: H
            } = await Promise.resolve().then(() => rm3(X08()));
            j = H({
                ...q.clientConfig,
                credentialProviderLogger: q.logger,
                parentClientConfig: {
                    ...K?.callerClientConfig,
                    ...q.parentClientConfig
                }
            }, q.clientPlugins)
        }
        return j({
            RoleArn: _,
            RoleSessionName: z ?? `aws-sdk-js-session-${Date.now()}`,
            WebIdentityToken: Y,
            ProviderId: A,
            PolicyArns: O,
            Policy: w,
            DurationSeconds: $
        })
    };
    rU.fromWebToken = om3
})
// @from(Ln 90546, Col 4)
OAq = p((YAq) => {
    Object.defineProperty(YAq, "__esModule", {
        value: !0
    });
    YAq.fromTokenFile = void 0;
    var am3 = $E(),
        sm3 = jP(),
        tm3 = pU(),
        em3 = d6("fs"),
        qB3 = uP1(),
        zAq = "AWS_WEB_IDENTITY_TOKEN_FILE",
        KB3 = "AWS_ROLE_ARN",
        _B3 = "AWS_ROLE_SESSION_NAME",
        zB3 = (q = {}) => async (K) => {
            q.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
            let _ = q?.webIdentityTokenFile ?? process.env[zAq],
                z = q?.roleArn ?? process.env[KB3],
                Y = q?.roleSessionName ?? process.env[_B3];
            if (!_ || !z) throw new sm3.CredentialsProviderError("Web identity configuration not specified", {
                logger: q.logger
            });
            let A = await (0, qB3.fromWebToken)({
                ...q,
                webIdentityToken: tm3.externalDataInterceptor?.getTokenRecord?.()[_] ?? (0, em3.readFileSync)(_, {
                    encoding: "ascii"
                }),
                roleArn: z,
                roleSessionName: Y
            })(K);
            if (_ === process.env[zAq])(0, am3.setCredentialFeature)(A, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
            return A
        };
    YAq.fromTokenFile = zB3
})
// @from(Ln 90580, Col 4)
Kl6 = p((ql6) => {
    var wAq = OAq(),
        $Aq = uP1();
    Object.keys(wAq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ql6, q)) Object.defineProperty(ql6, q, {
            enumerable: !0,
            get: function() {
                return wAq[q]
            }
        })
    });
    Object.keys($Aq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ql6, q)) Object.defineProperty(ql6, q, {
            enumerable: !0,
            get: function() {
                return $Aq[q]
            }
        })
    })
})
// @from(Ln 90600, Col 4)
pP1 = p((GB3) => {
    var BP1 = pU(),
        _l6 = jP(),
        Jo = $E(),
        YB3 = DP1(),
        AB3 = (q, K, _) => {
            let z = {
                EcsContainer: async (Y) => {
                    let {
                        fromHttp: A
                    } = await Promise.resolve().then(() => K6(lP8())), {
                        fromContainerMetadata: O
                    } = await Promise.resolve().then(() => K6(PO6()));
                    return _?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => _l6.chain(A(Y ?? {}), O(Y))().then(mP1)
                },
                Ec2InstanceMetadata: async (Y) => {
                    _?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
                    let {
                        fromInstanceMetadata: A
                    } = await Promise.resolve().then(() => K6(PO6()));
                    return async () => A(Y)().then(mP1)
                },
                Environment: async (Y) => {
                    _?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
                    let {
                        fromEnv: A
                    } = await Promise.resolve().then(() => K6(GP8()));
                    return async () => A(Y)().then(mP1)
                }
            };
            if (q in z) return z[q];
            else throw new _l6.CredentialsProviderError(`Unsupported credential source in profile ${K}. Got ${q}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
                logger: _
            })
        },
        mP1 = (q) => Jo.setCredentialFeature(q, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"),
        OB3 = (q, {
            profile: K = "default",
            logger: _
        } = {}) => {
            return Boolean(q) && typeof q === "object" && typeof q.role_arn === "string" && ["undefined", "string"].indexOf(typeof q.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof q.external_id) > -1 && ["undefined", "string"].indexOf(typeof q.mfa_serial) > -1 && (wB3(q, {
                profile: K,
                logger: _
            }) || $B3(q, {
                profile: K,
                logger: _
            }))
        },
        wB3 = (q, {
            profile: K,
            logger: _
        }) => {
            let z = typeof q.source_profile === "string" && typeof q.credential_source > "u";
            if (z) _?.debug?.(`    ${K} isAssumeRoleWithSourceProfile source_profile=${q.source_profile}`);
            return z
        },
        $B3 = (q, {
            profile: K,
            logger: _
        }) => {
            let z = typeof q.credential_source === "string" && typeof q.source_profile > "u";
            if (z) _?.debug?.(`    ${K} isCredentialSourceProfile credential_source=${q.credential_source}`);
            return z
        },
        jB3 = async (q, K, _, z = {}, Y) => {
            _.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
            let A = K[q],
                {
                    source_profile: O,
                    region: w
                } = A;
            if (!_.roleAssumer) {
                let {
                    getDefaultRoleAssumer: j
                } = await Promise.resolve().then(() => K6(X08()));
                _.roleAssumer = j({
                    ..._.clientConfig,
                    credentialProviderLogger: _.logger,
                    parentClientConfig: {
                        ..._?.parentClientConfig,
                        region: w ?? _?.parentClientConfig?.region
                    }
                }, _.clientPlugins)
            }
            if (O && O in z) throw new _l6.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${BP1.getProfileName(_)}. Profiles visited: ` + Object.keys(z).join(", "), {
                logger: _.logger
            });
            _.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${O?`source_profile=[${O}]`:`profile=[${q}]`}`);
            let $ = O ? Y(O, K, _, {
                ...z,
                [O]: !0
            }, jAq(K[O] ?? {})) : (await AB3(A.credential_source, q, _.logger)(_))();
            if (jAq(A)) return $.then((j) => Jo.setCredentialFeature(j, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
            else {
                let j = {
                        RoleArn: A.role_arn,
                        RoleSessionName: A.role_session_name || `aws-sdk-js-${Date.now()}`,
                        ExternalId: A.external_id,
                        DurationSeconds: parseInt(A.duration_seconds || "3600", 10)
                    },
                    {
                        mfa_serial: H
                    } = A;
                if (H) {
                    if (!_.mfaCodeProvider) throw new _l6.CredentialsProviderError(`Profile ${q} requires multi-factor authentication, but no MFA code callback was provided.`, {
                        logger: _.logger,
                        tryNextLink: !1
                    });
                    j.SerialNumber = H, j.TokenCode = await _.mfaCodeProvider(H)
                }
                let J = await $;
                return _.roleAssumer(J, j).then((X) => Jo.setCredentialFeature(X, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
            }
        }, jAq = (q) => {
            return !q.role_arn && !!q.credential_source
        }, HB3 = (q) => {
            return Boolean(q && q.login_session)
        }, JB3 = async (q, K) => {
            let _ = await YB3.fromLoginCredentials({
                ...K,
                profile: q
            })();
            return Jo.setCredentialFeature(_, "CREDENTIALS_PROFILE_LOGIN", "AC")
        }, XB3 = (q) => Boolean(q) && typeof q === "object" && typeof q.credential_process === "string", MB3 = async (q, K) => Promise.resolve().then(() => K6(M08())).then(({
            fromProcess: _
        }) => _({
            ...q,
            profile: K
        })().then((z) => Jo.setCredentialFeature(z, "CREDENTIALS_PROFILE_PROCESS", "v"))), PB3 = async (q, K, _ = {}) => {
            let {
                fromSSO: z
            } = await Promise.resolve().then(() => K6(eW8()));
            return z({
                profile: q,
                logger: _.logger,
                parentClientConfig: _.parentClientConfig,
                clientConfig: _.clientConfig
            })().then((Y) => {
                if (K.sso_session) return Jo.setCredentialFeature(Y, "CREDENTIALS_PROFILE_SSO", "r");
                else return Jo.setCredentialFeature(Y, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
            })
        }, WB3 = (q) => q && (typeof q.sso_start_url === "string" || typeof q.sso_account_id === "string" || typeof q.sso_session === "string" || typeof q.sso_region === "string" || typeof q.sso_role_name === "string"), HAq = (q) => Boolean(q) && typeof q === "object" && typeof q.aws_access_key_id === "string" && typeof q.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof q.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof q.aws_account_id) > -1, JAq = async (q, K) => {
            K?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
            let _ = {
                accessKeyId: q.aws_access_key_id,
                secretAccessKey: q.aws_secret_access_key,
                sessionToken: q.aws_session_token,
                ...q.aws_credential_scope && {
                    credentialScope: q.aws_credential_scope
                },
                ...q.aws_account_id && {
                    accountId: q.aws_account_id
                }
            };
            return Jo.setCredentialFeature(_, "CREDENTIALS_PROFILE", "n")
        }, DB3 = (q) => Boolean(q) && typeof q === "object" && typeof q.web_identity_token_file === "string" && typeof q.role_arn === "string" && ["undefined", "string"].indexOf(typeof q.role_session_name) > -1, ZB3 = async (q, K) => Promise.resolve().then(() => K6(Kl6())).then(({
            fromTokenFile: _
        }) => _({
            webIdentityTokenFile: q.web_identity_token_file,
            roleArn: q.role_arn,
            roleSessionName: q.role_session_name,
            roleAssumerWithWebIdentity: K.roleAssumerWithWebIdentity,
            logger: K.logger,
            parentClientConfig: K.parentClientConfig
        })().then((z) => Jo.setCredentialFeature(z, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), XAq = async (q, K, _, z = {}, Y = !1) => {
            let A = K[q];
            if (Object.keys(z).length > 0 && HAq(A)) return JAq(A, _);
            if (Y || OB3(A, {
                    profile: q,
                    logger: _.logger
                })) return jB3(q, K, _, z, XAq);
            if (HAq(A)) return JAq(A, _);
            if (DB3(A)) return ZB3(A, _);
            if (XB3(A)) return MB3(_, q);
            if (WB3(A)) return await PB3(q, A, _);
            if (HB3(A)) return JB3(q, _);
            throw new _l6.CredentialsProviderError(`Could not resolve credentials using profile: [${q}] in configuration/credentials file(s).`, {
                logger: _.logger
            })
        }, fB3 = (q = {}) => async ({
            callerClientConfig: K
        } = {}) => {
            let _ = {
                ...q,
                parentClientConfig: {
                    ...K,
                    ...q.parentClientConfig
                }
            };
            _.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
            let z = await BP1.parseKnownFiles(_);
            return XAq(BP1.getProfileName({
                profile: q.profile ?? K?.profile
            }), z, _)
        };
    GB3.fromIni = fB3
})
// @from(Ln 90797, Col 4)
uO6 = p((LB3) => {
    var FP1 = GP8(),
        zl6 = jP(),
        TB3 = pU(),
        MAq = "AWS_EC2_METADATA_DISABLED",
        VB3 = async (q) => {
            let {
                ENV_CMDS_FULL_URI: K,
                ENV_CMDS_RELATIVE_URI: _,
                fromContainerMetadata: z,
                fromInstanceMetadata: Y
            } = await Promise.resolve().then(() => K6(PO6()));
            if (process.env[_] || process.env[K]) {
                q.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
                let {
                    fromHttp: A
                } = await Promise.resolve().then(() => K6(lP8()));
                return zl6.chain(A(q), z(q))
            }
            if (process.env[MAq] && process.env[MAq] !== "false") return async () => {
                throw new zl6.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
                    logger: q.logger
                })
            };
            return q.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Y(q)
        };

    function kB3(q, K) {
        let _ = NB3(q),
            z, Y, A, O = async (w) => {
                if (w?.forceRefresh) return await _(w);
                if (A?.expiration) {
                    if (A?.expiration?.getTime() < Date.now()) A = void 0
                }
                if (z) await z;
                else if (!A || K?.(A))
                    if (A) {
                        if (!Y) Y = _(w).then(($) => {
                            A = $, Y = void 0
                        })
                    } else return z = _(w).then(($) => {
                        A = $, z = void 0
                    }), O(w);
                return A
            };
        return O
    }
    var NB3 = (q) => async (K) => {
        let _;
        for (let z of q) try {
            return await z(K)
        } catch (Y) {
            if (_ = Y, Y?.tryNextLink) continue;
            throw Y
        }
        throw _
    }, PAq = !1, EB3 = (q = {}) => kB3([async () => {
        if (q.profile ?? process.env[TB3.ENV_PROFILE]) {
            if (process.env[FP1.ENV_KEY] && process.env[FP1.ENV_SECRET]) {
                if (!PAq)(q.logger?.warn && q.logger?.constructor?.name !== "NoOpLogger" ? q.logger.warn.bind(q.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), PAq = !0
            }
            throw new zl6.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
                logger: q.logger,
                tryNextLink: !0
            })
        }
        return q.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), FP1.fromEnv(q)()
    }, async (K) => {
        q.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
        let {
            ssoStartUrl: _,
            ssoAccountId: z,
            ssoRegion: Y,
            ssoRoleName: A,
            ssoSession: O
        } = q;
        if (!_ && !z && !Y && !A && !O) throw new zl6.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
            logger: q.logger
        });
        let {
            fromSSO: w
        } = await Promise.resolve().then(() => K6(eW8()));
        return w(q)(K)
    }, async (K) => {
        q.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
        let {
            fromIni: _
        } = await Promise.resolve().then(() => K6(pP1()));
        return _(q)(K)
    }, async (K) => {
        q.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
        let {
            fromProcess: _
        } = await Promise.resolve().then(() => K6(M08()));
        return _(q)(K)
    }, async (K) => {
        q.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
        let {
            fromTokenFile: _
        } = await Promise.resolve().then(() => K6(Kl6()));
        return _(q)(K)
    }, async () => {
        return q.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await VB3(q))()
    }, async () => {
        throw new zl6.CredentialsProviderError("Could not load credentials from any providers", {
            tryNextLink: !1,
            logger: q.logger
        })
    }], WAq), yB3 = (q) => q?.expiration !== void 0, WAq = (q) => q?.expiration !== void 0 && q.expiration.getTime() - Date.now() < 300000;
    LB3.credentialsTreatedAsExpired = WAq;
    LB3.credentialsWillNeedRefresh = yB3;
    LB3.defaultProvider = EB3
})
// @from(Ln 90918, Col 4)
Al6 = {}
// @from(Ln 90943, Col 0)
function UP1() {
    gP1 = !0
}
// @from(Ln 90947, Col 0)
function CB3() {
    gP1 = !1
}
// @from(Ln 90951, Col 0)
function ZAq(q) {
    switch (q.family) {
        case 0:
        case 4:
        case 6:
            return q.family;
        case "IPv6":
            return 6;
        case "IPv4":
        case void 0:
            return 4;
        default:
            throw Error(`Unsupported address family: ${q.family}`)
    }
}
// @from(Ln 90967, Col 0)
function ME(q = process.env) {
    return q.https_proxy || q.HTTPS_PROXY || q.http_proxy || q.HTTP_PROXY
}
// @from(Ln 90971, Col 0)
function fAq(q = process.env) {
    return q.no_proxy || q.NO_PROXY
}
// @from(Ln 90975, Col 0)
function Xo(q, K = fAq()) {
    if (!K) return !1;
    if (K === "*") return !0;
    try {
        let _ = new URL(q),
            z = _.hostname.toLowerCase(),
            Y = _.port || (_.protocol === "https:" ? "443" : "80"),
            A = `${z}:${Y}`;
        return K.split(/[,\s]+/).filter(Boolean).some((w) => {
            if (w = w.toLowerCase().trim(), w.includes(":")) return A === w;
            if (w.startsWith(".")) {
                let $ = w;
                return z === w.substring(1) || z.endsWith($)
            }
            return z === w
        })
    } catch {
        return !1
    }
}
// @from(Ln 90996, Col 0)
function D08(q, K = {}) {
    let _ = $b(),
        z = Im(),
        Y = {
            ..._ && {
                cert: _.cert,
                key: _.key,
                passphrase: _.passphrase
            },
            ...z && {
                ca: z
            }
        };
    if (S6(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS)) Y.lookup = (A, O, w) => {
        w(null, A, ZAq(O))
    };
    return new DAq.HttpsProxyAgent(q, {
        ...Y,
        ...K
    })
}
// @from(Ln 91018, Col 0)
function QP1(q = {}) {
    let K = ME(),
        _ = XP8(),
        z = Z1.create({
            proxy: !1
        });
    if (!K) {
        if (_) z.defaults.httpsAgent = _;
        return z
    }
    let Y = D08(K, q);
    return z.interceptors.request.use((A) => {
        if (A.url && Xo(A.url)) A.httpsAgent = _, A.httpAgent = _;
        else A.httpsAgent = Y, A.httpAgent = Y;
        return A
    }), z
}
// @from(Ln 91036, Col 0)
function vb(q) {
    let K = ME();
    if (!K) return;
    if (Xo(q)) return;
    return D08(K)
}
// @from(Ln 91043, Col 0)
function Tb(q) {
    let K = ME();
    if (!K) return;
    if (Xo(q)) return;
    return K
}
// @from(Ln 91050, Col 0)
function dP1(q) {
    nv6 = q
}
// @from(Ln 91054, Col 0)
function mO6() {
    if (process.env.CLAUDE_CODE_ENABLE_PROXY_AUTH_HELPER !== "1") return;
    return nv6.helper
}
// @from(Ln 91059, Col 0)
function GAq() {
    return mO6() !== void 0 && nv6.fromProjectOrLocal
}
// @from(Ln 91063, Col 0)
function IB3() {
    let q = process.env.CLAUDE_CODE_PROXY_AUTH_HELPER_TTL_MS;
    if (q) {
        let K = parseInt(q, 10);
        if (!Number.isNaN(K) && K >= 0) return K
    }
    return bB3
}
// @from(Ln 91071, Col 0)
async function f08() {
    let q = mO6();
    if (!q) return null;
    if (GAq() && !I7() && !nv6.trustAccepted()) return E("proxyAuthHelper configured in project/local settings but workspace trust not yet accepted — skipping", {
        level: "warn"
    }), null;
    let K = W08;
    if (!K && C76 && Date.now() - C76.timestamp < IB3()) return C76.value;
    W08 = void 0;
    let _ = ME(),
        z;
    try {
        z = _ ? new URL(_).hostname : void 0
    } catch {
        z = void 0
    }
    let Y = await ij(q, {
        timeout: 30000,
        reject: !1,
        env: {
            ...process.env,
            ..._ && {
                CLAUDE_CODE_PROXY_URL: _
            },
            ...z && {
                CLAUDE_CODE_PROXY_HOST: z
            },
            ...K && {
                CLAUDE_CODE_PROXY_AUTHENTICATE: K
            }
        }
    });
    if (Y.failed || !Y.stdout?.trim()) {
        let O = Y.timedOut ? "timed out" : Y.failed ? `exited ${Y.exitCode}` : "did not return a value",
            w = Y.stderr?.trim();
        return console.error(`proxyAuthHelper failed: ${w?`${O}: ${w}`:O}`), C76?.value ?? null
    }
    let A = Y.stdout.trim();
    return C76 = {
        value: A,
        timestamp: Date.now()
    }, A
}
// @from(Ln 91115, Col 0)
function vAq() {
    return C76?.value ?? null
}
// @from(Ln 91119, Col 0)
function cP1(q) {
    C76 = null, W08 = q
}
// @from(Ln 91123, Col 0)
function lP1() {
    if (!mO6()) return;
    if (GAq() && !nv6.trustAccepted()) return;
    f08()
}
// @from(Ln 91129, Col 0)
function xB3() {
    C76 = null, W08 = void 0, nv6 = {
        helper: void 0,
        fromProjectOrLocal: !1,
        trustAccepted: () => !0
    }
}
// @from(Ln 91137, Col 0)
function b76(q) {
    let K = {
        ...gP1 && {
            keepalive: !1
        },
        ...q?.forAnthropicAPI && typeof Bun < "u" && {
            timeout: !1
        }
    };
    if (q?.forAnthropicAPI) {
        let z = process.env.ANTHROPIC_UNIX_SOCKET;
        if (z && typeof Bun < "u") return {
            ...K,
            unix: z
        }
    }
    let _ = ME();
    if (_) {
        if (typeof Bun < "u") {
            let z = vAq();
            return {
                ...K,
                proxy: z ? {
                    url: _,
                    headers: {
                        "Proxy-Authorization": z
                    }
                } : _,
                ...MP8()
            }
        }
        return {
            ...K,
            dispatcher: Z08(_)
        }
    }
    return {
        ...K,
        ...MP8()
    }
}
// @from(Ln 91179, Col 0)
function Yl6() {
    let q = ME(),
        K = XP8();
    if (P08 !== void 0) Z1.interceptors.request.eject(P08), P08 = void 0;
    if (Z1.defaults.proxy = void 0, Z1.defaults.httpAgent = void 0, Z1.defaults.httpsAgent = void 0, q) {
        Z1.defaults.proxy = !1;
        let _ = D08(q);
        P08 = Z1.interceptors.request.use((z) => {
            if (z.url && Xo(z.url))
                if (K) z.httpsAgent = K, z.httpAgent = K;
                else delete z.httpsAgent, delete z.httpAgent;
            else z.httpsAgent = _, z.httpAgent = _;
            return z
        }), ld6().setGlobalDispatcher(Z08(q))
    } else if (K) {
        Z1.defaults.httpsAgent = K;
        let _ = MP8();
        if (_.dispatcher) ld6().setGlobalDispatcher(_.dispatcher)
    }
}
// @from(Ln 91199, Col 0)
async function iv6() {
    let q = ME();
    if (!q) return {};
    let [{
        NodeHttpHandler: K
    }, {
        defaultProvider: _
    }] = await Promise.all([Promise.resolve().then(() => K6(wE(), 1)), Promise.resolve().then(() => K6(uO6(), 1))]), z = D08(q), Y = new K({
        httpAgent: z,
        httpsAgent: z
    });
    return {
        requestHandler: Y,
        credentials: _({
            clientConfig: {
                requestHandler: Y
            }
        })
    }
}
// @from(Ln 91220, Col 0)
function nP1() {
    Z08.cache.clear?.(), E("Cleared proxy agent cache")
}
// @from(Ln 91223, Col 4)
DAq
// @from(Ln 91223, Col 9)
gP1 = !1
// @from(Ln 91224, Col 4)
Z08
// @from(Ln 91224, Col 9)
bB3 = 300000
// @from(Ln 91225, Col 4)
nv6
// @from(Ln 91225, Col 9)
C76 = null
// @from(Ln 91226, Col 4)
W08
// @from(Ln 91226, Col 9)
P08
// @from(Ln 91227, Col 4)
_M = L(() => {
    CK();
    U4();
    y8();
    cQ6();
    K8();
    Q8();
    Qm();
    NV();
    DAq = K6(dQ6(), 1);
    Z08 = P1((q) => {
        let K = ld6(),
            _ = $b(),
            z = Im(),
            Y = {
                httpProxy: q,
                httpsProxy: q,
                noProxy: process.env.NO_PROXY || process.env.no_proxy
            };
        if (_ || z) {
            let A = {
                ..._ && {
                    cert: _.cert,
                    key: _.key,
                    passphrase: _.passphrase
                },
                ...z && {
                    ca: z
                }
            };
            Y.connect = A, Y.requestTls = A
        }
        return new K.EnvHttpProxyAgent(Y)
    });
    nv6 = {
        helper: void 0,
        fromProjectOrLocal: !1,
        trustAccepted: () => !0
    }
})
// @from(Ln 91267, Col 4)
eP1 = p((gB3) => {
    gB3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(gB3.HttpAuthLocation || (gB3.HttpAuthLocation = {}));
    gB3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(gB3.HttpApiKeyAuthLocation || (gB3.HttpApiKeyAuthLocation = {}));
    gB3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(gB3.EndpointURLScheme || (gB3.EndpointURLScheme = {}));
    gB3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(gB3.AlgorithmId || (gB3.AlgorithmId = {}));
    var uB3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => gB3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => gB3.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        mB3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        BB3 = (q) => {
            return uB3(q)
        },
        pB3 = (q) => {
            return mB3(q)
        };
    gB3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(gB3.FieldPosition || (gB3.FieldPosition = {}));
    var FB3 = "__smithy_context";
    gB3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(gB3.IniSectionType || (gB3.IniSectionType = {}));
    gB3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(gB3.RequestHandlerProtocol || (gB3.RequestHandlerProtocol = {}));
    gB3.SMITHY_CONTEXT_KEY = FB3;
    gB3.getDefaultClientConfiguration = BB3;
    gB3.resolveDefaultRuntimeConfig = pB3
})