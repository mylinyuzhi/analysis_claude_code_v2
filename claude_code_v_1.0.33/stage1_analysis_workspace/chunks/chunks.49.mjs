
// @from(Start 4498800, End 4500457)
Fk1 = z((osQ) => {
  Object.defineProperty(osQ, "__esModule", {
    value: !0
  });
  osQ.resolveHttpAuthSchemeConfig = osQ.resolveStsAuthConfig = osQ.defaultSTSHttpAuthSchemeProvider = osQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var dy8 = jF(),
    Vk1 = w7(),
    cy8 = zEA(),
    py8 = async (A, Q, B) => {
      return {
        operation: (0, Vk1.getSmithyContext)(Q).operation,
        region: await (0, Vk1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  osQ.defaultSTSHttpAuthSchemeParametersProvider = py8;

  function ly8(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "sts",
        region: A.region
      },
      propertiesExtractor: (Q, B) => ({
        signingProperties: {
          config: Q,
          context: B
        }
      })
    }
  }

  function iy8(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var ny8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithWebIdentity": {
        Q.push(iy8(A));
        break
      }
      default:
        Q.push(ly8(A))
    }
    return Q
  };
  osQ.defaultSTSHttpAuthSchemeProvider = ny8;
  var ay8 = (A) => Object.assign(A, {
    stsClientCtor: cy8.STSClient
  });
  osQ.resolveStsAuthConfig = ay8;
  var sy8 = (A) => {
    let Q = osQ.resolveStsAuthConfig(A),
      B = (0, dy8.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, Vk1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  osQ.resolveHttpAuthSchemeConfig = sy8
})
// @from(Start 4500463, End 4501351)
UEA = z((ArQ) => {
  Object.defineProperty(ArQ, "__esModule", {
    value: !0
  });
  ArQ.commonParams = ArQ.resolveClientEndpointParameters = void 0;
  var ty8 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  ArQ.resolveClientEndpointParameters = ty8;
  ArQ.commonParams = {
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
// @from(Start 4501357, End 4509534)
OrQ = z((LrQ) => {
  Object.defineProperty(LrQ, "__esModule", {
    value: !0
  });
  LrQ.ruleSet = void 0;
  var DrQ = "required",
    c8 = "type",
    I7 = "fn",
    Y7 = "argv",
    Xc = "ref",
    BrQ = !1,
    Kk1 = !0,
    Wc = "booleanEquals",
    CD = "stringEquals",
    HrQ = "sigv4",
    CrQ = "sts",
    ErQ = "us-east-1",
    oI = "endpoint",
    GrQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    G_ = "tree",
    S5A = "error",
    Hk1 = "getAttr",
    ZrQ = {
      [DrQ]: !1,
      [c8]: "String"
    },
    Dk1 = {
      [DrQ]: !0,
      default: !1,
      [c8]: "Boolean"
    },
    zrQ = {
      [Xc]: "Endpoint"
    },
    IrQ = {
      [I7]: "isSet",
      [Y7]: [{
        [Xc]: "Region"
      }]
    },
    ED = {
      [Xc]: "Region"
    },
    YrQ = {
      [I7]: "aws.partition",
      [Y7]: [ED],
      assign: "PartitionResult"
    },
    UrQ = {
      [Xc]: "UseFIPS"
    },
    $rQ = {
      [Xc]: "UseDualStack"
    },
    jH = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: HrQ,
          signingName: CrQ,
          signingRegion: ErQ
        }]
      },
      headers: {}
    },
    kw = {},
    JrQ = {
      conditions: [{
        [I7]: CD,
        [Y7]: [ED, "aws-global"]
      }],
      [oI]: jH,
      [c8]: oI
    },
    wrQ = {
      [I7]: Wc,
      [Y7]: [UrQ, !0]
    },
    qrQ = {
      [I7]: Wc,
      [Y7]: [$rQ, !0]
    },
    WrQ = {
      [I7]: Hk1,
      [Y7]: [{
        [Xc]: "PartitionResult"
      }, "supportsFIPS"]
    },
    NrQ = {
      [Xc]: "PartitionResult"
    },
    XrQ = {
      [I7]: Wc,
      [Y7]: [!0, {
        [I7]: Hk1,
        [Y7]: [NrQ, "supportsDualStack"]
      }]
    },
    VrQ = [{
      [I7]: "isSet",
      [Y7]: [zrQ]
    }],
    FrQ = [wrQ],
    KrQ = [qrQ],
    Ax8 = {
      version: "1.0",
      parameters: {
        Region: ZrQ,
        UseDualStack: Dk1,
        UseFIPS: Dk1,
        Endpoint: ZrQ,
        UseGlobalEndpoint: Dk1
      },
      rules: [{
        conditions: [{
          [I7]: Wc,
          [Y7]: [{
            [Xc]: "UseGlobalEndpoint"
          }, Kk1]
        }, {
          [I7]: "not",
          [Y7]: VrQ
        }, IrQ, YrQ, {
          [I7]: Wc,
          [Y7]: [UrQ, BrQ]
        }, {
          [I7]: Wc,
          [Y7]: [$rQ, BrQ]
        }],
        rules: [{
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "ap-northeast-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "ap-south-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "ap-southeast-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "ap-southeast-2"]
          }],
          endpoint: jH,
          [c8]: oI
        }, JrQ, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "ca-central-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "eu-central-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "eu-north-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "eu-west-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "eu-west-2"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "eu-west-3"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "sa-east-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, ErQ]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "us-east-2"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "us-west-1"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          conditions: [{
            [I7]: CD,
            [Y7]: [ED, "us-west-2"]
          }],
          endpoint: jH,
          [c8]: oI
        }, {
          endpoint: {
            url: GrQ,
            properties: {
              authSchemes: [{
                name: HrQ,
                signingName: CrQ,
                signingRegion: "{Region}"
              }]
            },
            headers: kw
          },
          [c8]: oI
        }],
        [c8]: G_
      }, {
        conditions: VrQ,
        rules: [{
          conditions: FrQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [c8]: S5A
        }, {
          conditions: KrQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [c8]: S5A
        }, {
          endpoint: {
            url: zrQ,
            properties: kw,
            headers: kw
          },
          [c8]: oI
        }],
        [c8]: G_
      }, {
        conditions: [IrQ],
        rules: [{
          conditions: [YrQ],
          rules: [{
            conditions: [wrQ, qrQ],
            rules: [{
              conditions: [{
                [I7]: Wc,
                [Y7]: [Kk1, WrQ]
              }, XrQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: kw,
                  headers: kw
                },
                [c8]: oI
              }],
              [c8]: G_
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [c8]: S5A
            }],
            [c8]: G_
          }, {
            conditions: FrQ,
            rules: [{
              conditions: [{
                [I7]: Wc,
                [Y7]: [WrQ, Kk1]
              }],
              rules: [{
                conditions: [{
                  [I7]: CD,
                  [Y7]: [{
                    [I7]: Hk1,
                    [Y7]: [NrQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: kw,
                  headers: kw
                },
                [c8]: oI
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: kw,
                  headers: kw
                },
                [c8]: oI
              }],
              [c8]: G_
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [c8]: S5A
            }],
            [c8]: G_
          }, {
            conditions: KrQ,
            rules: [{
              conditions: [XrQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: kw,
                  headers: kw
                },
                [c8]: oI
              }],
              [c8]: G_
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [c8]: S5A
            }],
            [c8]: G_
          }, JrQ, {
            endpoint: {
              url: GrQ,
              properties: kw,
              headers: kw
            },
            [c8]: oI
          }],
          [c8]: G_
        }],
        [c8]: G_
      }, {
        error: "Invalid Configuration: Missing Region",
        [c8]: S5A
      }]
    };
  LrQ.ruleSet = Ax8
})
// @from(Start 4509540, End 4510125)
PrQ = z((RrQ) => {
  Object.defineProperty(RrQ, "__esModule", {
    value: !0
  });
  RrQ.defaultEndpointResolver = void 0;
  var Qx8 = I5A(),
    Ck1 = FI(),
    Bx8 = OrQ(),
    Gx8 = new Ck1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    Zx8 = (A, Q = {}) => {
      return Gx8.get(A, () => (0, Ck1.resolveEndpoint)(Bx8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  RrQ.defaultEndpointResolver = Zx8;
  Ck1.customEndpointFunctions.aws = Qx8.awsEndpointFunctions
})
// @from(Start 4510131, End 4511541)
yrQ = z((_rQ) => {
  Object.defineProperty(_rQ, "__esModule", {
    value: !0
  });
  _rQ.getRuntimeConfig = void 0;
  var Ix8 = jF(),
    Yx8 = iB(),
    Jx8 = LJ(),
    Wx8 = NJ(),
    jrQ = Ak1(),
    SrQ = O2(),
    Xx8 = Fk1(),
    Vx8 = PrQ(),
    Fx8 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? jrQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? jrQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Vx8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Xx8.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Ix8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Yx8.NoAuthSigner
        }],
        logger: A?.logger ?? new Jx8.NoOpLogger,
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? Wx8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? SrQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? SrQ.toUtf8
      }
    };
  _rQ.getRuntimeConfig = Fx8
})
// @from(Start 4511547, End 4514210)
urQ = z((hrQ) => {
  Object.defineProperty(hrQ, "__esModule", {
    value: !0
  });
  hrQ.getRuntimeConfig = void 0;
  var Kx8 = r_1(),
    Dx8 = Kx8.__importDefault(o_1()),
    xrQ = jF(),
    vrQ = eCA(),
    ypA = f8(),
    Hx8 = iB(),
    Cx8 = RX(),
    brQ = D6(),
    _5A = uI(),
    frQ = IZ(),
    Ex8 = TX(),
    zx8 = KW(),
    Ux8 = yrQ(),
    $x8 = LJ(),
    wx8 = PX(),
    qx8 = LJ(),
    Nx8 = (A) => {
      (0, qx8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, wx8.resolveDefaultsModeConfig)(A),
        B = () => Q().then($x8.loadConfigsForDefaultMode),
        G = (0, Ux8.getRuntimeConfig)(A);
      (0, xrQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        bodyLengthChecker: A?.bodyLengthChecker ?? Ex8.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, vrQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Dx8.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4") || (async (Y) => await A.credentialDefaultProvider(Y?.__config || {})()),
          signer: new xrQ.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Hx8.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, _5A.loadConfig)(brQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, _5A.loadConfig)(ypA.NODE_REGION_CONFIG_OPTIONS, {
          ...ypA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: frQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, _5A.loadConfig)({
          ...brQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || zx8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Cx8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? frQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, _5A.loadConfig)(ypA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, _5A.loadConfig)(ypA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, _5A.loadConfig)(vrQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  hrQ.getRuntimeConfig = Nx8
})
// @from(Start 4514216, End 4515235)
crQ = z((mrQ) => {
  Object.defineProperty(mrQ, "__esModule", {
    value: !0
  });
  mrQ.resolveHttpAuthRuntimeConfig = mrQ.getHttpAuthExtensionConfiguration = void 0;
  var Lx8 = (A) => {
    let {
      httpAuthSchemes: Q,
      httpAuthSchemeProvider: B,
      credentials: G
    } = A;
    return {
      setHttpAuthScheme(Z) {
        let I = Q.findIndex((Y) => Y.schemeId === Z.schemeId);
        if (I === -1) Q.push(Z);
        else Q.splice(I, 1, Z)
      },
      httpAuthSchemes() {
        return Q
      },
      setHttpAuthSchemeProvider(Z) {
        B = Z
      },
      httpAuthSchemeProvider() {
        return B
      },
      setCredentials(Z) {
        G = Z
      },
      credentials() {
        return G
      }
    }
  };
  mrQ.getHttpAuthExtensionConfiguration = Lx8;
  var Mx8 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  mrQ.resolveHttpAuthRuntimeConfig = Mx8
})
// @from(Start 4515241, End 4515967)
rrQ = z((arQ) => {
  Object.defineProperty(arQ, "__esModule", {
    value: !0
  });
  arQ.resolveRuntimeExtensions = void 0;
  var prQ = YEA(),
    lrQ = PpA(),
    irQ = LJ(),
    nrQ = crQ(),
    Rx8 = (A, Q) => {
      let B = Object.assign((0, prQ.getAwsRegionExtensionConfiguration)(A), (0, irQ.getDefaultExtensionConfiguration)(A), (0, lrQ.getHttpHandlerExtensionConfiguration)(A), (0, nrQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, prQ.resolveAwsRegionExtensionConfiguration)(B), (0, irQ.resolveDefaultRuntimeConfig)(B), (0, lrQ.resolveHttpHandlerRuntimeConfig)(B), (0, nrQ.resolveHttpAuthRuntimeConfig)(B))
    };
  arQ.resolveRuntimeExtensions = Rx8
})
// @from(Start 4515973, End 4517955)
zEA = z((zk1) => {
  Object.defineProperty(zk1, "__esModule", {
    value: !0
  });
  zk1.STSClient = zk1.__Client = void 0;
  var orQ = cCA(),
    Tx8 = pCA(),
    Px8 = lCA(),
    trQ = F5A(),
    jx8 = f8(),
    Ek1 = iB(),
    Sx8 = LX(),
    _x8 = q5(),
    erQ = D6(),
    QoQ = LJ();
  Object.defineProperty(zk1, "__Client", {
    enumerable: !0,
    get: function() {
      return QoQ.Client
    }
  });
  var AoQ = Fk1(),
    kx8 = UEA(),
    yx8 = urQ(),
    xx8 = rrQ();
  class BoQ extends QoQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, yx8.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, kx8.resolveClientEndpointParameters)(Q),
        G = (0, trQ.resolveUserAgentConfig)(B),
        Z = (0, erQ.resolveRetryConfig)(G),
        I = (0, jx8.resolveRegionConfig)(Z),
        Y = (0, orQ.resolveHostHeaderConfig)(I),
        J = (0, _x8.resolveEndpointConfig)(Y),
        W = (0, AoQ.resolveHttpAuthSchemeConfig)(J),
        X = (0, xx8.resolveRuntimeExtensions)(W, A?.extensions || []);
      this.config = X, this.middlewareStack.use((0, trQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, erQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Sx8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, orQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, Tx8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, Px8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Ek1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: AoQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (V) => new Ek1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": V.credentials
        })
      })), this.middlewareStack.use((0, Ek1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  zk1.STSClient = BoQ
})
// @from(Start 4517961, End 4541334)
ak1 = z((_j7, nk1) => {
  var {
    defineProperty: xpA,
    getOwnPropertyDescriptor: vx8,
    getOwnPropertyNames: bx8
  } = Object, fx8 = Object.prototype.hasOwnProperty, x2 = (A, Q) => xpA(A, "name", {
    value: Q,
    configurable: !0
  }), hx8 = (A, Q) => {
    for (var B in Q) xpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uk1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of bx8(Q))
        if (!fx8.call(A, Z) && Z !== B) xpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vx8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, gx8 = (A, Q, B) => (uk1(A, Q, "default"), B && uk1(B, Q, "default")), ux8 = (A) => uk1(xpA({}, "__esModule", {
    value: !0
  }), A), dk1 = {};
  hx8(dk1, {
    AssumeRoleCommand: () => lk1,
    AssumeRoleResponseFilterSensitiveLog: () => YoQ,
    AssumeRoleWithWebIdentityCommand: () => ik1,
    AssumeRoleWithWebIdentityRequestFilterSensitiveLog: () => DoQ,
    AssumeRoleWithWebIdentityResponseFilterSensitiveLog: () => HoQ,
    ClientInputEndpointParameters: () => kv8.ClientInputEndpointParameters,
    CredentialsFilterSensitiveLog: () => ck1,
    ExpiredTokenException: () => JoQ,
    IDPCommunicationErrorException: () => CoQ,
    IDPRejectedClaimException: () => FoQ,
    InvalidIdentityTokenException: () => KoQ,
    MalformedPolicyDocumentException: () => WoQ,
    PackedPolicyTooLargeException: () => XoQ,
    RegionDisabledException: () => VoQ,
    STS: () => RoQ,
    STSServiceException: () => qb,
    decorateDefaultCredentialProvider: () => vv8,
    getDefaultRoleAssumer: () => koQ,
    getDefaultRoleAssumerWithWebIdentity: () => yoQ
  });
  nk1.exports = ux8(dk1);
  gx8(dk1, zEA(), nk1.exports);
  var mx8 = LJ(),
    dx8 = q5(),
    cx8 = GZ(),
    px8 = LJ(),
    lx8 = UEA(),
    IoQ = LJ(),
    ix8 = LJ(),
    qb = class A extends ix8.ServiceException {
      static {
        x2(this, "STSServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ck1 = x2((A) => ({
      ...A,
      ...A.SecretAccessKey && {
        SecretAccessKey: IoQ.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    YoQ = x2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ck1(A.Credentials)
      }
    }), "AssumeRoleResponseFilterSensitiveLog"),
    JoQ = class A extends qb {
      static {
        x2(this, "ExpiredTokenException")
      }
      name = "ExpiredTokenException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ExpiredTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    WoQ = class A extends qb {
      static {
        x2(this, "MalformedPolicyDocumentException")
      }
      name = "MalformedPolicyDocumentException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "MalformedPolicyDocumentException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    XoQ = class A extends qb {
      static {
        x2(this, "PackedPolicyTooLargeException")
      }
      name = "PackedPolicyTooLargeException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "PackedPolicyTooLargeException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    VoQ = class A extends qb {
      static {
        x2(this, "RegionDisabledException")
      }
      name = "RegionDisabledException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "RegionDisabledException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    FoQ = class A extends qb {
      static {
        x2(this, "IDPRejectedClaimException")
      }
      name = "IDPRejectedClaimException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "IDPRejectedClaimException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    KoQ = class A extends qb {
      static {
        x2(this, "InvalidIdentityTokenException")
      }
      name = "InvalidIdentityTokenException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidIdentityTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    DoQ = x2((A) => ({
      ...A,
      ...A.WebIdentityToken && {
        WebIdentityToken: IoQ.SENSITIVE_STRING
      }
    }), "AssumeRoleWithWebIdentityRequestFilterSensitiveLog"),
    HoQ = x2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ck1(A.Credentials)
      }
    }), "AssumeRoleWithWebIdentityResponseFilterSensitiveLog"),
    CoQ = class A extends qb {
      static {
        x2(this, "IDPCommunicationErrorException")
      }
      name = "IDPCommunicationErrorException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "IDPCommunicationErrorException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    pk1 = jF(),
    nx8 = PpA(),
    O7 = LJ(),
    ax8 = x2(async (A, Q) => {
      let B = qoQ,
        G;
      return G = OoQ({
        ...Iv8(A, Q),
        [LoQ]: Lv8,
        [MoQ]: NoQ
      }), woQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleCommand"),
    sx8 = x2(async (A, Q) => {
      let B = qoQ,
        G;
      return G = OoQ({
        ...Yv8(A, Q),
        [LoQ]: Mv8,
        [MoQ]: NoQ
      }), woQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithWebIdentityCommand"),
    rx8 = x2(async (A, Q) => {
      if (A.statusCode >= 300) return EoQ(A, Q);
      let B = await (0, pk1.parseXmlBody)(A.body, Q),
        G = {};
      return G = Dv8(B.AssumeRoleResult, Q), {
        $metadata: Nb(A),
        ...G
      }
    }, "de_AssumeRoleCommand"),
    ox8 = x2(async (A, Q) => {
      if (A.statusCode >= 300) return EoQ(A, Q);
      let B = await (0, pk1.parseXmlBody)(A.body, Q),
        G = {};
      return G = Hv8(B.AssumeRoleWithWebIdentityResult, Q), {
        $metadata: Nb(A),
        ...G
      }
    }, "de_AssumeRoleWithWebIdentityCommand"),
    EoQ = x2(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, pk1.parseXmlErrorBody)(A.body, Q)
        },
        G = Ov8(A, B.body);
      switch (G) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await tx8(B, Q);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await Bv8(B, Q);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await Gv8(B, Q);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await Zv8(B, Q);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await ex8(B, Q);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await Av8(B, Q);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await Qv8(B, Q);
        default:
          let Z = B.body;
          return Nv8({
            output: A,
            parsedBody: Z.Error,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    tx8 = x2(async (A, Q) => {
      let B = A.body,
        G = Cv8(B.Error, Q),
        Z = new JoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_ExpiredTokenExceptionRes"),
    ex8 = x2(async (A, Q) => {
      let B = A.body,
        G = Ev8(B.Error, Q),
        Z = new CoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_IDPCommunicationErrorExceptionRes"),
    Av8 = x2(async (A, Q) => {
      let B = A.body,
        G = zv8(B.Error, Q),
        Z = new FoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_IDPRejectedClaimExceptionRes"),
    Qv8 = x2(async (A, Q) => {
      let B = A.body,
        G = Uv8(B.Error, Q),
        Z = new KoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityTokenExceptionRes"),
    Bv8 = x2(async (A, Q) => {
      let B = A.body,
        G = $v8(B.Error, Q),
        Z = new WoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_MalformedPolicyDocumentExceptionRes"),
    Gv8 = x2(async (A, Q) => {
      let B = A.body,
        G = wv8(B.Error, Q),
        Z = new XoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_PackedPolicyTooLargeExceptionRes"),
    Zv8 = x2(async (A, Q) => {
      let B = A.body,
        G = qv8(B.Error, Q),
        Z = new VoQ({
          $metadata: Nb(A),
          ...G
        });
      return (0, O7.decorateServiceException)(Z, B)
    }, "de_RegionDisabledExceptionRes"),
    Iv8 = x2((A, Q) => {
      let B = {};
      if (A[h5A] != null) B[h5A] = A[h5A];
      if (A[g5A] != null) B[g5A] = A[g5A];
      if (A[b5A] != null) {
        let G = zoQ(A[b5A], Q);
        if (A[b5A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[v5A] != null) B[v5A] = A[v5A];
      if (A[x5A] != null) B[x5A] = A[x5A];
      if (A[xk1] != null) {
        let G = Kv8(A[xk1], Q);
        if (A[xk1]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      if (A[bk1] != null) {
        let G = Fv8(A[bk1], Q);
        if (A[bk1]?.length === 0) B.TransitiveTagKeys = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TransitiveTagKeys.${Z}`;
          B[Y] = I
        })
      }
      if (A[Mk1] != null) B[Mk1] = A[Mk1];
      if (A[kk1] != null) B[kk1] = A[kk1];
      if (A[vk1] != null) B[vk1] = A[vk1];
      if (A[wb] != null) B[wb] = A[wb];
      if (A[Tk1] != null) {
        let G = Xv8(A[Tk1], Q);
        if (A[Tk1]?.length === 0) B.ProvidedContexts = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `ProvidedContexts.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_AssumeRoleRequest"),
    Yv8 = x2((A, Q) => {
      let B = {};
      if (A[h5A] != null) B[h5A] = A[h5A];
      if (A[g5A] != null) B[g5A] = A[g5A];
      if (A[hk1] != null) B[hk1] = A[hk1];
      if (A[Pk1] != null) B[Pk1] = A[Pk1];
      if (A[b5A] != null) {
        let G = zoQ(A[b5A], Q);
        if (A[b5A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[v5A] != null) B[v5A] = A[v5A];
      if (A[x5A] != null) B[x5A] = A[x5A];
      return B
    }, "se_AssumeRoleWithWebIdentityRequest"),
    zoQ = x2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = Jv8(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_policyDescriptorListType"),
    Jv8 = x2((A, Q) => {
      let B = {};
      if (A[gk1] != null) B[gk1] = A[gk1];
      return B
    }, "se_PolicyDescriptorType"),
    Wv8 = x2((A, Q) => {
      let B = {};
      if (A[Rk1] != null) B[Rk1] = A[Rk1];
      if (A[Nk1] != null) B[Nk1] = A[Nk1];
      return B
    }, "se_ProvidedContext"),
    Xv8 = x2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = Wv8(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_ProvidedContextsListType"),
    Vv8 = x2((A, Q) => {
      let B = {};
      if (A[Ok1] != null) B[Ok1] = A[Ok1];
      if (A[fk1] != null) B[fk1] = A[fk1];
      return B
    }, "se_Tag"),
    Fv8 = x2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        B[`member.${G}`] = Z, G++
      }
      return B
    }, "se_tagKeyListType"),
    Kv8 = x2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = Vv8(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_tagListType"),
    UoQ = x2((A, Q) => {
      let B = {};
      if (A[$k1] != null) B[$k1] = (0, O7.expectString)(A[$k1]);
      if (A[wk1] != null) B[wk1] = (0, O7.expectString)(A[wk1]);
      return B
    }, "de_AssumedRoleUser"),
    Dv8 = x2((A, Q) => {
      let B = {};
      if (A[y5A] != null) B[y5A] = $oQ(A[y5A], Q);
      if (A[k5A] != null) B[k5A] = UoQ(A[k5A], Q);
      if (A[f5A] != null) B[f5A] = (0, O7.strictParseInt32)(A[f5A]);
      if (A[wb] != null) B[wb] = (0, O7.expectString)(A[wb]);
      return B
    }, "de_AssumeRoleResponse"),
    Hv8 = x2((A, Q) => {
      let B = {};
      if (A[y5A] != null) B[y5A] = $oQ(A[y5A], Q);
      if (A[_k1] != null) B[_k1] = (0, O7.expectString)(A[_k1]);
      if (A[k5A] != null) B[k5A] = UoQ(A[k5A], Q);
      if (A[f5A] != null) B[f5A] = (0, O7.strictParseInt32)(A[f5A]);
      if (A[jk1] != null) B[jk1] = (0, O7.expectString)(A[jk1]);
      if (A[qk1] != null) B[qk1] = (0, O7.expectString)(A[qk1]);
      if (A[wb] != null) B[wb] = (0, O7.expectString)(A[wb]);
      return B
    }, "de_AssumeRoleWithWebIdentityResponse"),
    $oQ = x2((A, Q) => {
      let B = {};
      if (A[Uk1] != null) B[Uk1] = (0, O7.expectString)(A[Uk1]);
      if (A[Sk1] != null) B[Sk1] = (0, O7.expectString)(A[Sk1]);
      if (A[yk1] != null) B[yk1] = (0, O7.expectString)(A[yk1]);
      if (A[Lk1] != null) B[Lk1] = (0, O7.expectNonNull)((0, O7.parseRfc3339DateTimeWithOffset)(A[Lk1]));
      return B
    }, "de_Credentials"),
    Cv8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_ExpiredTokenException"),
    Ev8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_IDPCommunicationErrorException"),
    zv8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_IDPRejectedClaimException"),
    Uv8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_InvalidIdentityTokenException"),
    $v8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_MalformedPolicyDocumentException"),
    wv8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_PackedPolicyTooLargeException"),
    qv8 = x2((A, Q) => {
      let B = {};
      if (A[qW] != null) B[qW] = (0, O7.expectString)(A[qW]);
      return B
    }, "de_RegionDisabledException"),
    Nb = x2((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    Nv8 = (0, O7.withBaseException)(qb),
    woQ = x2(async (A, Q, B, G, Z) => {
      let {
        hostname: I,
        protocol: Y = "https",
        port: J,
        path: W
      } = await A.endpoint(), X = {
        protocol: Y,
        hostname: I,
        port: J,
        method: "POST",
        path: W.endsWith("/") ? W.slice(0, -1) + B : W + B,
        headers: Q
      };
      if (G !== void 0) X.hostname = G;
      if (Z !== void 0) X.body = Z;
      return new nx8.HttpRequest(X)
    }, "buildHttpRpcRequest"),
    qoQ = {
      "content-type": "application/x-www-form-urlencoded"
    },
    NoQ = "2011-06-15",
    LoQ = "Action",
    Uk1 = "AccessKeyId",
    Lv8 = "AssumeRole",
    $k1 = "AssumedRoleId",
    k5A = "AssumedRoleUser",
    Mv8 = "AssumeRoleWithWebIdentity",
    wk1 = "Arn",
    qk1 = "Audience",
    y5A = "Credentials",
    Nk1 = "ContextAssertion",
    x5A = "DurationSeconds",
    Lk1 = "Expiration",
    Mk1 = "ExternalId",
    Ok1 = "Key",
    v5A = "Policy",
    b5A = "PolicyArns",
    Rk1 = "ProviderArn",
    Tk1 = "ProvidedContexts",
    Pk1 = "ProviderId",
    f5A = "PackedPolicySize",
    jk1 = "Provider",
    h5A = "RoleArn",
    g5A = "RoleSessionName",
    Sk1 = "SecretAccessKey",
    _k1 = "SubjectFromWebIdentityToken",
    wb = "SourceIdentity",
    kk1 = "SerialNumber",
    yk1 = "SessionToken",
    xk1 = "Tags",
    vk1 = "TokenCode",
    bk1 = "TransitiveTagKeys",
    MoQ = "Version",
    fk1 = "Value",
    hk1 = "WebIdentityToken",
    gk1 = "arn",
    qW = "message",
    OoQ = x2((A) => Object.entries(A).map(([Q, B]) => (0, O7.extendedEncodeURIComponent)(Q) + "=" + (0, O7.extendedEncodeURIComponent)(B)).join("&"), "buildFormUrlencodedString"),
    Ov8 = x2((A, Q) => {
      if (Q.Error?.Code !== void 0) return Q.Error.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadQueryErrorCode"),
    lk1 = class extends px8.Command.classBuilder().ep(lx8.commonParams).m(function(A, Q, B, G) {
      return [(0, cx8.getSerdePlugin)(B, this.serialize, this.deserialize), (0, dx8.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").f(void 0, YoQ).ser(ax8).de(rx8).build() {
      static {
        x2(this, "AssumeRoleCommand")
      }
    },
    Rv8 = q5(),
    Tv8 = GZ(),
    Pv8 = LJ(),
    jv8 = UEA(),
    ik1 = class extends Pv8.Command.classBuilder().ep(jv8.commonParams).m(function(A, Q, B, G) {
      return [(0, Tv8.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Rv8.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").f(DoQ, HoQ).ser(sx8).de(ox8).build() {
      static {
        x2(this, "AssumeRoleWithWebIdentityCommand")
      }
    },
    Sv8 = zEA(),
    _v8 = {
      AssumeRoleCommand: lk1,
      AssumeRoleWithWebIdentityCommand: ik1
    },
    RoQ = class extends Sv8.STSClient {
      static {
        x2(this, "STS")
      }
    };
  (0, mx8.createAggregatedClient)(_v8, RoQ);
  var kv8 = UEA(),
    mk1 = rS(),
    ZoQ = "us-east-1",
    ToQ = x2((A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    }, "getAccountIdFromAssumedRoleUser"),
    PoQ = x2(async (A, Q, B) => {
      let G = typeof A === "function" ? await A() : A,
        Z = typeof Q === "function" ? await Q() : Q;
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${G} (provider)`, `${Z} (parent client)`, `${ZoQ} (STS default)`), G ?? Z ?? ZoQ
    }, "resolveRegion"),
    yv8 = x2((A, Q) => {
      let B, G;
      return async (Z, I) => {
        if (G = Z, !B) {
          let {
            logger: V = A?.parentClientConfig?.logger,
            region: F,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: D
          } = A, H = await PoQ(F, A?.parentClientConfig?.region, D), C = !joQ(K);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            credentialDefaultProvider: x2(() => async () => G, "credentialDefaultProvider"),
            region: H,
            requestHandler: C ? K : void 0,
            logger: V
          })
        }
        let {
          Credentials: Y,
          AssumedRoleUser: J
        } = await B.send(new lk1(I));
        if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`);
        let W = ToQ(J),
          X = {
            accessKeyId: Y.AccessKeyId,
            secretAccessKey: Y.SecretAccessKey,
            sessionToken: Y.SessionToken,
            expiration: Y.Expiration,
            ...Y.CredentialScope && {
              credentialScope: Y.CredentialScope
            },
            ...W && {
              accountId: W
            }
          };
        return (0, mk1.setCredentialFeature)(X, "CREDENTIALS_STS_ASSUME_ROLE", "i"), X
      }
    }, "getDefaultRoleAssumer"),
    xv8 = x2((A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            region: X,
            requestHandler: V = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: F
          } = A, K = await PoQ(X, A?.parentClientConfig?.region, F), D = !joQ(V);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            region: K,
            requestHandler: D ? V : void 0,
            logger: W
          })
        }
        let {
          Credentials: Z,
          AssumedRoleUser: I
        } = await B.send(new ik1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let Y = ToQ(I),
          J = {
            accessKeyId: Z.AccessKeyId,
            secretAccessKey: Z.SecretAccessKey,
            sessionToken: Z.SessionToken,
            expiration: Z.Expiration,
            ...Z.CredentialScope && {
              credentialScope: Z.CredentialScope
            },
            ...Y && {
              accountId: Y
            }
          };
        if (Y)(0, mk1.setCredentialFeature)(J, "RESOLVED_ACCOUNT_ID", "T");
        return (0, mk1.setCredentialFeature)(J, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), J
      }
    }, "getDefaultRoleAssumerWithWebIdentity"),
    joQ = x2((A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, "isH2"),
    SoQ = zEA(),
    _oQ = x2((A, Q) => {
      if (!Q) return A;
      else return class extends A {
        static {
          x2(this, "CustomizableSTSClient")
        }
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, "getCustomizableStsClientCtor"),
    koQ = x2((A = {}, Q) => yv8(A, _oQ(SoQ.STSClient, Q)), "getDefaultRoleAssumer"),
    yoQ = x2((A = {}, Q) => xv8(A, _oQ(SoQ.STSClient, Q)), "getDefaultRoleAssumerWithWebIdentity"),
    vv8 = x2((A) => (Q) => A({
      roleAssumer: koQ(Q),
      roleAssumerWithWebIdentity: yoQ(Q),
      ...Q
    }), "decorateDefaultCredentialProvider")
})
// @from(Start 4541340, End 4544582)
ok1 = z((vj7, boQ) => {
  var {
    defineProperty: vpA,
    getOwnPropertyDescriptor: bv8,
    getOwnPropertyNames: fv8
  } = Object, hv8 = Object.prototype.hasOwnProperty, rk1 = (A, Q) => vpA(A, "name", {
    value: Q,
    configurable: !0
  }), gv8 = (A, Q) => {
    for (var B in Q) vpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uv8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of fv8(Q))
        if (!hv8.call(A, Z) && Z !== B) vpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = bv8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mv8 = (A) => uv8(vpA({}, "__esModule", {
    value: !0
  }), A), voQ = {};
  gv8(voQ, {
    fromProcess: () => nv8
  });
  boQ.exports = mv8(voQ);
  var xoQ = SG(),
    sk1 = j2(),
    dv8 = UA("child_process"),
    cv8 = UA("util"),
    pv8 = rS(),
    lv8 = rk1((A, Q, B) => {
      if (Q.Version !== 1) throw Error(`Profile ${A} credential_process did not return Version 1.`);
      if (Q.AccessKeyId === void 0 || Q.SecretAccessKey === void 0) throw Error(`Profile ${A} credential_process returned invalid credentials.`);
      if (Q.Expiration) {
        let I = new Date;
        if (new Date(Q.Expiration) < I) throw Error(`Profile ${A} credential_process returned expired credentials.`)
      }
      let G = Q.AccountId;
      if (!G && B?.[A]?.aws_account_id) G = B[A].aws_account_id;
      let Z = {
        accessKeyId: Q.AccessKeyId,
        secretAccessKey: Q.SecretAccessKey,
        ...Q.SessionToken && {
          sessionToken: Q.SessionToken
        },
        ...Q.Expiration && {
          expiration: new Date(Q.Expiration)
        },
        ...Q.CredentialScope && {
          credentialScope: Q.CredentialScope
        },
        ...G && {
          accountId: G
        }
      };
      return (0, pv8.setCredentialFeature)(Z, "CREDENTIALS_PROCESS", "w"), Z
    }, "getValidatedProcessCredentials"),
    iv8 = rk1(async (A, Q, B) => {
      let G = Q[A];
      if (Q[A]) {
        let Z = G.credential_process;
        if (Z !== void 0) {
          let I = (0, cv8.promisify)(dv8.exec);
          try {
            let {
              stdout: Y
            } = await I(Z), J;
            try {
              J = JSON.parse(Y.trim())
            } catch {
              throw Error(`Profile ${A} credential_process returned invalid JSON.`)
            }
            return lv8(A, J, Q)
          } catch (Y) {
            throw new sk1.CredentialsProviderError(Y.message, {
              logger: B
            })
          }
        } else throw new sk1.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
          logger: B
        })
      } else throw new sk1.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
        logger: B
      })
    }, "resolveProcessCredentials"),
    nv8 = rk1((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      let B = await (0, xoQ.parseKnownFiles)(A);
      return iv8((0, xoQ.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), B, A.logger)
    }, "fromProcess")
})
// @from(Start 4544588, End 4546613)
tk1 = z((Z_) => {
  var av8 = Z_ && Z_.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    sv8 = Z_ && Z_.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    rv8 = Z_ && Z_.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) av8(Q, A, B)
      }
      return sv8(Q, A), Q
    };
  Object.defineProperty(Z_, "__esModule", {
    value: !0
  });
  Z_.fromWebToken = void 0;
  var ov8 = (A) => async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
    let {
      roleArn: B,
      roleSessionName: G,
      webIdentityToken: Z,
      providerId: I,
      policyArns: Y,
      policy: J,
      durationSeconds: W
    } = A, {
      roleAssumerWithWebIdentity: X
    } = A;
    if (!X) {
      let {
        getDefaultRoleAssumerWithWebIdentity: V
      } = await Promise.resolve().then(() => rv8(ak1()));
      X = V({
        ...A.clientConfig,
        credentialProviderLogger: A.logger,
        parentClientConfig: {
          ...Q?.callerClientConfig,
          ...A.parentClientConfig
        }
      }, A.clientPlugins)
    }
    return X({
      RoleArn: B,
      RoleSessionName: G ?? `aws-sdk-js-session-${Date.now()}`,
      WebIdentityToken: Z,
      ProviderId: I,
      PolicyArns: Y,
      Policy: J,
      DurationSeconds: W
    })
  };
  Z_.fromWebToken = ov8
})
// @from(Start 4546619, End 4547694)
uoQ = z((hoQ) => {
  Object.defineProperty(hoQ, "__esModule", {
    value: !0
  });
  hoQ.fromTokenFile = void 0;
  var tv8 = rS(),
    ev8 = j2(),
    Ab8 = UA("fs"),
    Qb8 = tk1(),
    foQ = "AWS_WEB_IDENTITY_TOKEN_FILE",
    Bb8 = "AWS_ROLE_ARN",
    Gb8 = "AWS_ROLE_SESSION_NAME",
    Zb8 = (A = {}) => async () => {
      A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      let Q = A?.webIdentityTokenFile ?? process.env[foQ],
        B = A?.roleArn ?? process.env[Bb8],
        G = A?.roleSessionName ?? process.env[Gb8];
      if (!Q || !B) throw new ev8.CredentialsProviderError("Web identity configuration not specified", {
        logger: A.logger
      });
      let Z = await (0, Qb8.fromWebToken)({
        ...A,
        webIdentityToken: (0, Ab8.readFileSync)(Q, {
          encoding: "ascii"
        }),
        roleArn: B,
        roleSessionName: G
      })();
      if (Q === process.env[foQ])(0, tv8.setCredentialFeature)(Z, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      return Z
    };
  hoQ.fromTokenFile = Zb8
})
// @from(Start 4547700, End 4548396)
Qy1 = z((hj7, bpA) => {
  var {
    defineProperty: moQ,
    getOwnPropertyDescriptor: Ib8,
    getOwnPropertyNames: Yb8
  } = Object, Jb8 = Object.prototype.hasOwnProperty, ek1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Yb8(Q))
        if (!Jb8.call(A, Z) && Z !== B) moQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Ib8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, doQ = (A, Q, B) => (ek1(A, Q, "default"), B && ek1(B, Q, "default")), Wb8 = (A) => ek1(moQ({}, "__esModule", {
    value: !0
  }), A), Ay1 = {};
  bpA.exports = Wb8(Ay1);
  doQ(Ay1, uoQ(), bpA.exports);
  doQ(Ay1, tk1(), bpA.exports)
})
// @from(Start 4548402, End 4558124)
roQ = z((gj7, soQ) => {
  var {
    create: Xb8,
    defineProperty: wEA,
    getOwnPropertyDescriptor: Vb8,
    getOwnPropertyNames: Fb8,
    getPrototypeOf: Kb8
  } = Object, Db8 = Object.prototype.hasOwnProperty, xX = (A, Q) => wEA(A, "name", {
    value: Q,
    configurable: !0
  }), Hb8 = (A, Q) => {
    for (var B in Q) wEA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ioQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Fb8(Q))
        if (!Db8.call(A, Z) && Z !== B) wEA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Vb8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Vc = (A, Q, B) => (B = A != null ? Xb8(Kb8(A)) : {}, ioQ(Q || !A || !A.__esModule ? wEA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Cb8 = (A) => ioQ(wEA({}, "__esModule", {
    value: !0
  }), A), noQ = {};
  Hb8(noQ, {
    fromIni: () => Tb8
  });
  soQ.exports = Cb8(noQ);
  var Gy1 = SG(),
    Fc = rS(),
    $EA = j2(),
    Eb8 = xX((A, Q, B) => {
      let G = {
        EcsContainer: xX(async (Z) => {
          let {
            fromHttp: I
          } = await Promise.resolve().then(() => Vc(_S1())), {
            fromContainerMetadata: Y
          } = await Promise.resolve().then(() => Vc(OV()));
          return B?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => (0, $EA.chain)(I(Z ?? {}), Y(Z))().then(By1)
        }, "EcsContainer"),
        Ec2InstanceMetadata: xX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
          let {
            fromInstanceMetadata: I
          } = await Promise.resolve().then(() => Vc(OV()));
          return async () => I(Z)().then(By1)
        }, "Ec2InstanceMetadata"),
        Environment: xX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
          let {
            fromEnv: I
          } = await Promise.resolve().then(() => Vc(HS1()));
          return async () => I(Z)().then(By1)
        }, "Environment")
      };
      if (A in G) return G[A];
      else throw new $EA.CredentialsProviderError(`Unsupported credential source in profile ${Q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
        logger: B
      })
    }, "resolveCredentialSource"),
    By1 = xX((A) => (0, Fc.setCredentialFeature)(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"), "setNamedProvider"),
    zb8 = xX((A, {
      profile: Q = "default",
      logger: B
    } = {}) => {
      return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (Ub8(A, {
        profile: Q,
        logger: B
      }) || $b8(A, {
        profile: Q,
        logger: B
      }))
    }, "isAssumeRoleProfile"),
    Ub8 = xX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.source_profile === "string" && typeof A.credential_source > "u";
      if (G) B?.debug?.(`    ${Q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
      return G
    }, "isAssumeRoleWithSourceProfile"),
    $b8 = xX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.credential_source === "string" && typeof A.source_profile > "u";
      if (G) B?.debug?.(`    ${Q} isCredentialSourceProfile credential_source=${A.credential_source}`);
      return G
    }, "isCredentialSourceProfile"),
    wb8 = xX(async (A, Q, B, G = {}) => {
      B.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
      let Z = Q[A],
        {
          source_profile: I,
          region: Y
        } = Z;
      if (!B.roleAssumer) {
        let {
          getDefaultRoleAssumer: W
        } = await Promise.resolve().then(() => Vc(ak1()));
        B.roleAssumer = W({
          ...B.clientConfig,
          credentialProviderLogger: B.logger,
          parentClientConfig: {
            ...B?.parentClientConfig,
            region: Y ?? B?.parentClientConfig?.region
          }
        }, B.clientPlugins)
      }
      if (I && I in G) throw new $EA.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${(0,Gy1.getProfileName)(B)}. Profiles visited: ` + Object.keys(G).join(", "), {
        logger: B.logger
      });
      B.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${I?`source_profile=[${I}]`:`profile=[${A}]`}`);
      let J = I ? aoQ(I, Q, B, {
        ...G,
        [I]: !0
      }, coQ(Q[I] ?? {})) : (await Eb8(Z.credential_source, A, B.logger)(B))();
      if (coQ(Z)) return J.then((W) => (0, Fc.setCredentialFeature)(W, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
      else {
        let W = {
            RoleArn: Z.role_arn,
            RoleSessionName: Z.role_session_name || `aws-sdk-js-${Date.now()}`,
            ExternalId: Z.external_id,
            DurationSeconds: parseInt(Z.duration_seconds || "3600", 10)
          },
          {
            mfa_serial: X
          } = Z;
        if (X) {
          if (!B.mfaCodeProvider) throw new $EA.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
            logger: B.logger,
            tryNextLink: !1
          });
          W.SerialNumber = X, W.TokenCode = await B.mfaCodeProvider(X)
        }
        let V = await J;
        return B.roleAssumer(V, W).then((F) => (0, Fc.setCredentialFeature)(F, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
      }
    }, "resolveAssumeRoleCredentials"),
    coQ = xX((A) => {
      return !A.role_arn && !!A.credential_source
    }, "isCredentialSourceWithoutRoleArn"),
    qb8 = xX((A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", "isProcessProfile"),
    Nb8 = xX(async (A, Q) => Promise.resolve().then(() => Vc(ok1())).then(({
      fromProcess: B
    }) => B({
      ...A,
      profile: Q
    })().then((G) => (0, Fc.setCredentialFeature)(G, "CREDENTIALS_PROFILE_PROCESS", "v"))), "resolveProcessCredentials"),
    Lb8 = xX(async (A, Q, B = {}) => {
      let {
        fromSSO: G
      } = await Promise.resolve().then(() => Vc(Xk1()));
      return G({
        profile: A,
        logger: B.logger,
        parentClientConfig: B.parentClientConfig,
        clientConfig: B.clientConfig
      })().then((Z) => {
        if (Q.sso_session) return (0, Fc.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO", "r");
        else return (0, Fc.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
      })
    }, "resolveSsoCredentials"),
    Mb8 = xX((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    poQ = xX((A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, "isStaticCredsProfile"),
    loQ = xX(async (A, Q) => {
      Q?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
      let B = {
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
      return (0, Fc.setCredentialFeature)(B, "CREDENTIALS_PROFILE", "n")
    }, "resolveStaticCredentials"),
    Ob8 = xX((A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, "isWebIdentityProfile"),
    Rb8 = xX(async (A, Q) => Promise.resolve().then(() => Vc(Qy1())).then(({
      fromTokenFile: B
    }) => B({
      webIdentityTokenFile: A.web_identity_token_file,
      roleArn: A.role_arn,
      roleSessionName: A.role_session_name,
      roleAssumerWithWebIdentity: Q.roleAssumerWithWebIdentity,
      logger: Q.logger,
      parentClientConfig: Q.parentClientConfig
    })().then((G) => (0, Fc.setCredentialFeature)(G, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), "resolveWebIdentityCredentials"),
    aoQ = xX(async (A, Q, B, G = {}, Z = !1) => {
      let I = Q[A];
      if (Object.keys(G).length > 0 && poQ(I)) return loQ(I, B);
      if (Z || zb8(I, {
          profile: A,
          logger: B.logger
        })) return wb8(A, Q, B, G);
      if (poQ(I)) return loQ(I, B);
      if (Ob8(I)) return Rb8(I, B);
      if (qb8(I)) return Nb8(B, A);
      if (Mb8(I)) return await Lb8(A, I, B);
      throw new $EA.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
        logger: B.logger
      })
    }, "resolveProfileData"),
    Tb8 = xX((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      let B = {
        ...A,
        parentClientConfig: {
          ...Q,
          ...A.parentClientConfig
        }
      };
      B.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
      let G = await (0, Gy1.parseKnownFiles)(B);
      return aoQ((0, Gy1.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), G, B)
    }, "fromIni")
})
// @from(Start 4558130, End 4563092)
Iy1 = z((uj7, GtQ) => {
  var {
    create: Pb8,
    defineProperty: qEA,
    getOwnPropertyDescriptor: jb8,
    getOwnPropertyNames: Sb8,
    getPrototypeOf: _b8
  } = Object, kb8 = Object.prototype.hasOwnProperty, fpA = (A, Q) => qEA(A, "name", {
    value: Q,
    configurable: !0
  }), yb8 = (A, Q) => {
    for (var B in Q) qEA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, eoQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Sb8(Q))
        if (!kb8.call(A, Z) && Z !== B) qEA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = jb8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, u5A = (A, Q, B) => (B = A != null ? Pb8(_b8(A)) : {}, eoQ(Q || !A || !A.__esModule ? qEA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), xb8 = (A) => eoQ(qEA({}, "__esModule", {
    value: !0
  }), A), AtQ = {};
  yb8(AtQ, {
    credentialsTreatedAsExpired: () => BtQ,
    credentialsWillNeedRefresh: () => QtQ,
    defaultProvider: () => fb8
  });
  GtQ.exports = xb8(AtQ);
  var Zy1 = HS1(),
    vb8 = SG(),
    _o = j2(),
    ooQ = "AWS_EC2_METADATA_DISABLED",
    bb8 = fpA(async (A) => {
      let {
        ENV_CMDS_FULL_URI: Q,
        ENV_CMDS_RELATIVE_URI: B,
        fromContainerMetadata: G,
        fromInstanceMetadata: Z
      } = await Promise.resolve().then(() => u5A(OV()));
      if (process.env[B] || process.env[Q]) {
        A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        let {
          fromHttp: I
        } = await Promise.resolve().then(() => u5A(_S1()));
        return (0, _o.chain)(I(A), G(A))
      }
      if (process.env[ooQ] && process.env[ooQ] !== "false") return async () => {
        throw new _o.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
          logger: A.logger
        })
      };
      return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Z(A)
    }, "remoteProvider"),
    toQ = !1,
    fb8 = fpA((A = {}) => (0, _o.memoize)((0, _o.chain)(async () => {
      if (A.profile ?? process.env[vb8.ENV_PROFILE]) {
        if (process.env[Zy1.ENV_KEY] && process.env[Zy1.ENV_SECRET]) {
          if (!toQ)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), toQ = !0
        }
        throw new _o.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
          logger: A.logger,
          tryNextLink: !0
        })
      }
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), (0, Zy1.fromEnv)(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
      let {
        ssoStartUrl: Q,
        ssoAccountId: B,
        ssoRegion: G,
        ssoRoleName: Z,
        ssoSession: I
      } = A;
      if (!Q && !B && !G && !Z && !I) throw new _o.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
        logger: A.logger
      });
      let {
        fromSSO: Y
      } = await Promise.resolve().then(() => u5A(Xk1()));
      return Y(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
      let {
        fromIni: Q
      } = await Promise.resolve().then(() => u5A(roQ()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
      let {
        fromProcess: Q
      } = await Promise.resolve().then(() => u5A(ok1()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
      let {
        fromTokenFile: Q
      } = await Promise.resolve().then(() => u5A(Qy1()));
      return Q(A)()
    }, async () => {
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await bb8(A))()
    }, async () => {
      throw new _o.CredentialsProviderError("Could not load credentials from any providers", {
        tryNextLink: !1,
        logger: A.logger
      })
    }), BtQ, QtQ), "defaultProvider"),
    QtQ = fpA((A) => A?.expiration !== void 0, "credentialsWillNeedRefresh"),
    BtQ = fpA((A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000, "credentialsTreatedAsExpired")
})
// @from(Start 4563098, End 4564913)
YtQ = z((AU) => {
  var hb8 = AU && AU.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    gb8 = AU && AU.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    ZtQ = AU && AU.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) hb8(Q, A, B)
      }
      return gb8(Q, A), Q
    };
  Object.defineProperty(AU, "__esModule", {
    value: !0
  });
  AU.req = AU.json = AU.toBuffer = void 0;
  var ub8 = ZtQ(UA("http")),
    mb8 = ZtQ(UA("https"));
  async function ItQ(A) {
    let Q = 0,
      B = [];
    for await (let G of A) Q += G.length, B.push(G);
    return Buffer.concat(B, Q)
  }
  AU.toBuffer = ItQ;
  async function db8(A) {
    let B = (await ItQ(A)).toString("utf8");
    try {
      return JSON.parse(B)
    } catch (G) {
      let Z = G;
      throw Z.message += ` (input: ${B})`, Z
    }
  }
  AU.json = db8;

  function cb8(A, Q = {}) {
    let G = ((typeof A === "string" ? A : A.href).startsWith("https:") ? mb8 : ub8).request(A, Q),
      Z = new Promise((I, Y) => {
        G.once("response", I).once("error", Y).end()
      });
    return G.then = Z.then.bind(Z), G
  }
  AU.req = cb8
})
// @from(Start 4564919, End 4568697)
Yy1 = z((yw) => {
  var WtQ = yw && yw.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    pb8 = yw && yw.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    XtQ = yw && yw.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) WtQ(Q, A, B)
      }
      return pb8(Q, A), Q
    },
    lb8 = yw && yw.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) WtQ(Q, A, B)
    };
  Object.defineProperty(yw, "__esModule", {
    value: !0
  });
  yw.Agent = void 0;
  var ib8 = XtQ(UA("net")),
    JtQ = XtQ(UA("http")),
    nb8 = UA("https");
  lb8(YtQ(), yw);
  var I_ = Symbol("AgentBaseInternalState");
  class VtQ extends JtQ.Agent {
    constructor(A) {
      super(A);
      this[I_] = {}
    }
    isSecureEndpoint(A) {
      if (A) {
        if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
        if (typeof A.protocol === "string") return A.protocol === "https:"
      }
      let {
        stack: Q
      } = Error();
      if (typeof Q !== "string") return !1;
      return Q.split(`
`).some((B) => B.indexOf("(https.js:") !== -1 || B.indexOf("node:https:") !== -1)
    }
    incrementSockets(A) {
      if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0) return null;
      if (!this.sockets[A]) this.sockets[A] = [];
      let Q = new ib8.Socket({
        writable: !1
      });
      return this.sockets[A].push(Q), this.totalSocketCount++, Q
    }
    decrementSockets(A, Q) {
      if (!this.sockets[A] || Q === null) return;
      let B = this.sockets[A],
        G = B.indexOf(Q);
      if (G !== -1) {
        if (B.splice(G, 1), this.totalSocketCount--, B.length === 0) delete this.sockets[A]
      }
    }
    getName(A) {
      if (typeof A.secureEndpoint === "boolean" ? A.secureEndpoint : this.isSecureEndpoint(A)) return nb8.Agent.prototype.getName.call(this, A);
      return super.getName(A)
    }
    createSocket(A, Q, B) {
      let G = {
          ...Q,
          secureEndpoint: this.isSecureEndpoint(Q)
        },
        Z = this.getName(G),
        I = this.incrementSockets(Z);
      Promise.resolve().then(() => this.connect(A, G)).then((Y) => {
        if (this.decrementSockets(Z, I), Y instanceof JtQ.Agent) try {
          return Y.addRequest(A, G)
        } catch (J) {
          return B(J)
        }
        this[I_].currentSocket = Y, super.createSocket(A, Q, B)
      }, (Y) => {
        this.decrementSockets(Z, I), B(Y)
      })
    }
    createConnection() {
      let A = this[I_].currentSocket;
      if (this[I_].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
      return A
    }
    get defaultPort() {
      return this[I_].defaultPort ?? (this.protocol === "https:" ? 443 : 80)
    }
    set defaultPort(A) {
      if (this[I_]) this[I_].defaultPort = A
    }
    get protocol() {
      return this[I_].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:")
    }
    set protocol(A) {
      if (this[I_]) this[I_].protocol = A
    }
  }
  yw.Agent = VtQ
})
// @from(Start 4568703, End 4570846)
FtQ = z((m5A) => {
  var ab8 = m5A && m5A.__importDefault || function(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  };
  Object.defineProperty(m5A, "__esModule", {
    value: !0
  });
  m5A.parseProxyResponse = void 0;
  var sb8 = ab8(hs()),
    hpA = (0, sb8.default)("https-proxy-agent:parse-proxy-response");

  function rb8(A) {
    return new Promise((Q, B) => {
      let G = 0,
        Z = [];

      function I() {
        let V = A.read();
        if (V) X(V);
        else A.once("readable", I)
      }

      function Y() {
        A.removeListener("end", J), A.removeListener("error", W), A.removeListener("readable", I)
      }

      function J() {
        Y(), hpA("onend"), B(Error("Proxy connection ended before receiving CONNECT response"))
      }

      function W(V) {
        Y(), hpA("onerror %o", V), B(V)
      }

      function X(V) {
        Z.push(V), G += V.length;
        let F = Buffer.concat(Z, G),
          K = F.indexOf(`\r
\r
`);
        if (K === -1) {
          hpA("have not received end of HTTP headers yet..."), I();
          return
        }
        let D = F.slice(0, K).toString("ascii").split(`\r
`),
          H = D.shift();
        if (!H) return A.destroy(), B(Error("No header received from proxy CONNECT response"));
        let C = H.split(" "),
          E = +C[1],
          U = C.slice(2).join(" "),
          q = {};
        for (let w of D) {
          if (!w) continue;
          let N = w.indexOf(":");
          if (N === -1) return A.destroy(), B(Error(`Invalid header from proxy CONNECT response: "${w}"`));
          let R = w.slice(0, N).toLowerCase(),
            T = w.slice(N + 1).trimStart(),
            y = q[R];
          if (typeof y === "string") q[R] = [y, T];
          else if (Array.isArray(y)) y.push(T);
          else q[R] = T
        }
        hpA("got proxy server response: %o %o", H, q), Y(), Q({
          connect: {
            statusCode: E,
            statusText: U,
            headers: q
          },
          buffered: F
        })
      }
      A.on("error", W), A.on("end", J), I()
    })
  }
  m5A.parseProxyResponse = rb8
})
// @from(Start 4570852, End 4575037)
LEA = z((nL) => {
  var ob8 = nL && nL.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    tb8 = nL && nL.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    CtQ = nL && nL.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) ob8(Q, A, B)
      }
      return tb8(Q, A), Q
    },
    EtQ = nL && nL.__importDefault || function(A) {
      return A && A.__esModule ? A : {
        default: A
      }
    };
  Object.defineProperty(nL, "__esModule", {
    value: !0
  });
  nL.HttpsProxyAgent = void 0;
  var gpA = CtQ(UA("net")),
    KtQ = CtQ(UA("tls")),
    eb8 = EtQ(UA("assert")),
    Af8 = EtQ(hs()),
    Qf8 = Yy1(),
    Bf8 = UA("url"),
    Gf8 = FtQ(),
    NEA = (0, Af8.default)("https-proxy-agent"),
    DtQ = (A) => {
      if (A.servername === void 0 && A.host && !gpA.isIP(A.host)) return {
        ...A,
        servername: A.host
      };
      return A
    };
  class Jy1 extends Qf8.Agent {
    constructor(A, Q) {
      super(Q);
      this.options = {
        path: void 0
      }, this.proxy = typeof A === "string" ? new Bf8.URL(A) : A, this.proxyHeaders = Q?.headers ?? {}, NEA("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...Q ? HtQ(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    async connect(A, Q) {
      let {
        proxy: B
      } = this;
      if (!Q.host) throw TypeError('No "host" provided');
      let G;
      if (B.protocol === "https:") NEA("Creating `tls.Socket`: %o", this.connectOpts), G = KtQ.connect(DtQ(this.connectOpts));
      else NEA("Creating `net.Socket`: %o", this.connectOpts), G = gpA.connect(this.connectOpts);
      let Z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
          ...this.proxyHeaders
        },
        I = gpA.isIPv6(Q.host) ? `[${Q.host}]` : Q.host,
        Y = `CONNECT ${I}:${Q.port} HTTP/1.1\r
`;
      if (B.username || B.password) {
        let F = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        Z["Proxy-Authorization"] = `Basic ${Buffer.from(F).toString("base64")}`
      }
      if (Z.Host = `${I}:${Q.port}`, !Z["Proxy-Connection"]) Z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let F of Object.keys(Z)) Y += `${F}: ${Z[F]}\r
`;
      let J = (0, Gf8.parseProxyResponse)(G);
      G.write(`${Y}\r
`);
      let {
        connect: W,
        buffered: X
      } = await J;
      if (A.emit("proxyConnect", W), this.emit("proxyConnect", W, A), W.statusCode === 200) {
        if (A.once("socket", Zf8), Q.secureEndpoint) return NEA("Upgrading socket connection to TLS"), KtQ.connect({
          ...HtQ(DtQ(Q), "host", "path", "port"),
          socket: G
        });
        return G
      }
      G.destroy();
      let V = new gpA.Socket({
        writable: !1
      });
      return V.readable = !0, A.once("socket", (F) => {
        NEA("Replaying proxy buffer for failed request"), (0, eb8.default)(F.listenerCount("data") > 0), F.push(X), F.push(null)
      }), V
    }
  }
  Jy1.protocols = ["http", "https"];
  nL.HttpsProxyAgent = Jy1;

  function Zf8(A) {
    A.resume()
  }

  function HtQ(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
})
// @from(Start 4575043, End 4577746)
tI = z((lj7, ztQ) => {
  ztQ.exports = {
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
// @from(Start 4577752, End 4583369)
R7 = z((ij7, gtQ) => {
  class MJ extends Error {
    constructor(A) {
      super(A);
      this.name = "UndiciError", this.code = "UND_ERR"
    }
  }
  class UtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "ConnectTimeoutError", this.message = A || "Connect Timeout Error", this.code = "UND_ERR_CONNECT_TIMEOUT"
    }
  }
  class $tQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "HeadersTimeoutError", this.message = A || "Headers Timeout Error", this.code = "UND_ERR_HEADERS_TIMEOUT"
    }
  }
  class wtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "HeadersOverflowError", this.message = A || "Headers Overflow Error", this.code = "UND_ERR_HEADERS_OVERFLOW"
    }
  }
  class qtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "BodyTimeoutError", this.message = A || "Body Timeout Error", this.code = "UND_ERR_BODY_TIMEOUT"
    }
  }
  class NtQ extends MJ {
    constructor(A, Q, B, G) {
      super(A);
      this.name = "ResponseStatusCodeError", this.message = A || "Response Status Code Error", this.code = "UND_ERR_RESPONSE_STATUS_CODE", this.body = G, this.status = Q, this.statusCode = Q, this.headers = B
    }
  }
  class LtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "InvalidArgumentError", this.message = A || "Invalid Argument Error", this.code = "UND_ERR_INVALID_ARG"
    }
  }
  class MtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "InvalidReturnValueError", this.message = A || "Invalid Return Value Error", this.code = "UND_ERR_INVALID_RETURN_VALUE"
    }
  }
  class Wy1 extends MJ {
    constructor(A) {
      super(A);
      this.name = "AbortError", this.message = A || "The operation was aborted"
    }
  }
  class OtQ extends Wy1 {
    constructor(A) {
      super(A);
      this.name = "AbortError", this.message = A || "Request aborted", this.code = "UND_ERR_ABORTED"
    }
  }
  class RtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "InformationalError", this.message = A || "Request information", this.code = "UND_ERR_INFO"
    }
  }
  class TtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "RequestContentLengthMismatchError", this.message = A || "Request body length does not match content-length header", this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH"
    }
  }
  class PtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "ResponseContentLengthMismatchError", this.message = A || "Response body length does not match content-length header", this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH"
    }
  }
  class jtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "ClientDestroyedError", this.message = A || "The client is destroyed", this.code = "UND_ERR_DESTROYED"
    }
  }
  class StQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "ClientClosedError", this.message = A || "The client is closed", this.code = "UND_ERR_CLOSED"
    }
  }
  class _tQ extends MJ {
    constructor(A, Q) {
      super(A);
      this.name = "SocketError", this.message = A || "Socket error", this.code = "UND_ERR_SOCKET", this.socket = Q
    }
  }
  class ktQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "NotSupportedError", this.message = A || "Not supported error", this.code = "UND_ERR_NOT_SUPPORTED"
    }
  }
  class ytQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "MissingUpstreamError", this.message = A || "No upstream has been added to the BalancedPool", this.code = "UND_ERR_BPL_MISSING_UPSTREAM"
    }
  }
  class xtQ extends Error {
    constructor(A, Q, B) {
      super(A);
      this.name = "HTTPParserError", this.code = Q ? `HPE_${Q}` : void 0, this.data = B ? B.toString() : void 0
    }
  }
  class vtQ extends MJ {
    constructor(A) {
      super(A);
      this.name = "ResponseExceededMaxSizeError", this.message = A || "Response content exceeded max size", this.code = "UND_ERR_RES_EXCEEDED_MAX_SIZE"
    }
  }
  class btQ extends MJ {
    constructor(A, Q, {
      headers: B,
      data: G
    }) {
      super(A);
      this.name = "RequestRetryError", this.message = A || "Request retry error", this.code = "UND_ERR_REQ_RETRY", this.statusCode = Q, this.data = G, this.headers = B
    }
  }
  class ftQ extends MJ {
    constructor(A, Q, {
      headers: B,
      data: G
    }) {
      super(A);
      this.name = "ResponseError", this.message = A || "Response error", this.code = "UND_ERR_RESPONSE", this.statusCode = Q, this.data = G, this.headers = B
    }
  }
  class htQ extends MJ {
    constructor(A, Q, B) {
      super(Q, {
        cause: A,
        ...B ?? {}
      });
      this.name = "SecureProxyConnectionError", this.message = Q || "Secure Proxy Connection failed", this.code = "UND_ERR_PRX_TLS", this.cause = A
    }
  }
  gtQ.exports = {
    AbortError: Wy1,
    HTTPParserError: xtQ,
    UndiciError: MJ,
    HeadersTimeoutError: $tQ,
    HeadersOverflowError: wtQ,
    BodyTimeoutError: qtQ,
    RequestContentLengthMismatchError: TtQ,
    ConnectTimeoutError: UtQ,
    ResponseStatusCodeError: NtQ,
    InvalidArgumentError: LtQ,
    InvalidReturnValueError: MtQ,
    RequestAbortedError: OtQ,
    ClientDestroyedError: jtQ,
    ClientClosedError: StQ,
    InformationalError: RtQ,
    SocketError: _tQ,
    NotSupportedError: ktQ,
    ResponseContentLengthMismatchError: PtQ,
    BalancedPoolMissingUpstreamError: ytQ,
    ResponseExceededMaxSizeError: vtQ,
    RequestRetryError: btQ,
    ResponseError: ftQ,
    SecureProxyConnectionError: htQ
  }
})
// @from(Start 4583375, End 4585437)
mpA = z((nj7, utQ) => {
  var upA = {},
    Xy1 = ["Accept", "Accept-Encoding", "Accept-Language", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Disposition", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Downlink", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Last-Modified", "Link", "Location", "Max-Forwards", "Origin", "Permissions-Policy", "Pragma", "Proxy-Authenticate", "Proxy-Authorization", "RTT", "Range", "Referer", "Referrer-Policy", "Refresh", "Retry-After", "Sec-WebSocket-Accept", "Sec-WebSocket-Extensions", "Sec-WebSocket-Key", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version", "Server", "Server-Timing", "Service-Worker-Allowed", "Service-Worker-Navigation-Preload", "Set-Cookie", "SourceMap", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Frame-Options", "X-Permitted-Cross-Domain-Policies", "X-Powered-By", "X-Requested-With", "X-XSS-Protection"];
  for (let A = 0; A < Xy1.length; ++A) {
    let Q = Xy1[A],
      B = Q.toLowerCase();
    upA[Q] = upA[B] = B
  }
  Object.setPrototypeOf(upA, null);
  utQ.exports = {
    wellknownHeaderNames: Xy1,
    headerNameLowerCasedRecord: upA
  }
})
// @from(Start 4585443, End 4587514)
ptQ = z((aj7, ctQ) => {
  var {
    wellknownHeaderNames: mtQ,
    headerNameLowerCasedRecord: If8
  } = mpA();
  class d5A {
    value = null;
    left = null;
    middle = null;
    right = null;
    code;
    constructor(A, Q, B) {
      if (B === void 0 || B >= A.length) throw TypeError("Unreachable");
      if ((this.code = A.charCodeAt(B)) > 127) throw TypeError("key must be ascii string");
      if (A.length !== ++B) this.middle = new d5A(A, Q, B);
      else this.value = Q
    }
    add(A, Q) {
      let B = A.length;
      if (B === 0) throw TypeError("Unreachable");
      let G = 0,
        Z = this;
      while (!0) {
        let I = A.charCodeAt(G);
        if (I > 127) throw TypeError("key must be ascii string");
        if (Z.code === I)
          if (B === ++G) {
            Z.value = Q;
            break
          } else if (Z.middle !== null) Z = Z.middle;
        else {
          Z.middle = new d5A(A, Q, G);
          break
        } else if (Z.code < I)
          if (Z.left !== null) Z = Z.left;
          else {
            Z.left = new d5A(A, Q, G);
            break
          }
        else if (Z.right !== null) Z = Z.right;
        else {
          Z.right = new d5A(A, Q, G);
          break
        }
      }
    }
    search(A) {
      let Q = A.length,
        B = 0,
        G = this;
      while (G !== null && B < Q) {
        let Z = A[B];
        if (Z <= 90 && Z >= 65) Z |= 32;
        while (G !== null) {
          if (Z === G.code) {
            if (Q === ++B) return G;
            G = G.middle;
            break
          }
          G = G.code < Z ? G.left : G.right
        }
      }
      return null
    }
  }
  class Vy1 {
    node = null;
    insert(A, Q) {
      if (this.node === null) this.node = new d5A(A, Q, 0);
      else this.node.add(A, Q)
    }
    lookup(A) {
      return this.node?.search(A)?.value ?? null
    }
  }
  var dtQ = new Vy1;
  for (let A = 0; A < mtQ.length; ++A) {
    let Q = If8[mtQ[A]];
    dtQ.insert(Q, Q)
  }
  ctQ.exports = {
    TernarySearchTree: Vy1,
    tree: dtQ
  }
})