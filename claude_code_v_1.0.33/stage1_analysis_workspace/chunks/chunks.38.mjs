
// @from(Start 3451430, End 3453606)
CmA = z((iN7, gqQ) => {
  var {
    defineProperty: HmA,
    getOwnPropertyDescriptor: Z28,
    getOwnPropertyNames: I28
  } = Object, Y28 = Object.prototype.hasOwnProperty, DmA = (A, Q) => HmA(A, "name", {
    value: Q,
    configurable: !0
  }), J28 = (A, Q) => {
    for (var B in Q) HmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, W28 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of I28(Q))
        if (!Y28.call(A, Z) && Z !== B) HmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Z28(Q, Z)) || G.enumerable
        })
    }
    return A
  }, X28 = (A) => W28(HmA({}, "__esModule", {
    value: !0
  }), A), xqQ = {};
  J28(xqQ, {
    NODE_APP_ID_CONFIG_OPTIONS: () => H28,
    UA_APP_ID_ENV_NAME: () => fqQ,
    UA_APP_ID_INI_NAME: () => hqQ,
    createDefaultUserAgentProvider: () => bqQ,
    crtAvailability: () => vqQ,
    defaultUserAgent: () => F28
  });
  gqQ.exports = X28(xqQ);
  var yqQ = UA("os"),
    QR1 = UA("process"),
    vqQ = {
      isCrtAvailable: !1
    },
    V28 = DmA(() => {
      if (vqQ.isCrtAvailable) return ["md/crt-avail"];
      return null
    }, "isCrtAvailable"),
    bqQ = DmA(({
      serviceId: A,
      clientVersion: Q
    }) => {
      return async (B) => {
        let G = [
            ["aws-sdk-js", Q],
            ["ua", "2.1"],
            [`os/${(0,yqQ.platform)()}`, (0, yqQ.release)()],
            ["lang/js"],
            ["md/nodejs", `${QR1.versions.node}`]
          ],
          Z = V28();
        if (Z) G.push(Z);
        if (A) G.push([`api/${A}`, Q]);
        if (QR1.env.AWS_EXECUTION_ENV) G.push([`exec-env/${QR1.env.AWS_EXECUTION_ENV}`]);
        let I = await B?.userAgentAppId?.();
        return I ? [...G, [`app/${I}`]] : [...G]
      }
    }, "createDefaultUserAgentProvider"),
    F28 = bqQ,
    K28 = QCA(),
    fqQ = "AWS_SDK_UA_APP_ID",
    hqQ = "sdk_ua_app_id",
    D28 = "sdk-ua-app-id",
    H28 = {
      environmentVariableSelector: DmA((A) => A[fqQ], "environmentVariableSelector"),
      configFileSelector: DmA((A) => A[hqQ] ?? A[D28], "configFileSelector"),
      default: K28.DEFAULT_UA_APP_ID
    }
})
// @from(Start 3453612, End 3461789)
XNQ = z((JNQ) => {
  Object.defineProperty(JNQ, "__esModule", {
    value: !0
  });
  JNQ.ruleSet = void 0;
  var oqQ = "required",
    m8 = "type",
    Q7 = "fn",
    B7 = "argv",
    gd = "ref",
    uqQ = !1,
    BR1 = !0,
    hd = "booleanEquals",
    WD = "stringEquals",
    tqQ = "sigv4",
    eqQ = "sts",
    ANQ = "us-east-1",
    nI = "endpoint",
    mqQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    hS = "tree",
    W6A = "error",
    ZR1 = "getAttr",
    dqQ = {
      [oqQ]: !1,
      [m8]: "String"
    },
    GR1 = {
      [oqQ]: !0,
      default: !1,
      [m8]: "Boolean"
    },
    QNQ = {
      [gd]: "Endpoint"
    },
    cqQ = {
      [Q7]: "isSet",
      [B7]: [{
        [gd]: "Region"
      }]
    },
    XD = {
      [gd]: "Region"
    },
    pqQ = {
      [Q7]: "aws.partition",
      [B7]: [XD],
      assign: "PartitionResult"
    },
    BNQ = {
      [gd]: "UseFIPS"
    },
    GNQ = {
      [gd]: "UseDualStack"
    },
    MH = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: tqQ,
          signingName: eqQ,
          signingRegion: ANQ
        }]
      },
      headers: {}
    },
    Mw = {},
    lqQ = {
      conditions: [{
        [Q7]: WD,
        [B7]: [XD, "aws-global"]
      }],
      [nI]: MH,
      [m8]: nI
    },
    ZNQ = {
      [Q7]: hd,
      [B7]: [BNQ, !0]
    },
    INQ = {
      [Q7]: hd,
      [B7]: [GNQ, !0]
    },
    iqQ = {
      [Q7]: ZR1,
      [B7]: [{
        [gd]: "PartitionResult"
      }, "supportsFIPS"]
    },
    YNQ = {
      [gd]: "PartitionResult"
    },
    nqQ = {
      [Q7]: hd,
      [B7]: [!0, {
        [Q7]: ZR1,
        [B7]: [YNQ, "supportsDualStack"]
      }]
    },
    aqQ = [{
      [Q7]: "isSet",
      [B7]: [QNQ]
    }],
    sqQ = [ZNQ],
    rqQ = [INQ],
    C28 = {
      version: "1.0",
      parameters: {
        Region: dqQ,
        UseDualStack: GR1,
        UseFIPS: GR1,
        Endpoint: dqQ,
        UseGlobalEndpoint: GR1
      },
      rules: [{
        conditions: [{
          [Q7]: hd,
          [B7]: [{
            [gd]: "UseGlobalEndpoint"
          }, BR1]
        }, {
          [Q7]: "not",
          [B7]: aqQ
        }, cqQ, pqQ, {
          [Q7]: hd,
          [B7]: [BNQ, uqQ]
        }, {
          [Q7]: hd,
          [B7]: [GNQ, uqQ]
        }],
        rules: [{
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "ap-northeast-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "ap-south-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "ap-southeast-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "ap-southeast-2"]
          }],
          endpoint: MH,
          [m8]: nI
        }, lqQ, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "ca-central-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "eu-central-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "eu-north-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "eu-west-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "eu-west-2"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "eu-west-3"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "sa-east-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, ANQ]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "us-east-2"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "us-west-1"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          conditions: [{
            [Q7]: WD,
            [B7]: [XD, "us-west-2"]
          }],
          endpoint: MH,
          [m8]: nI
        }, {
          endpoint: {
            url: mqQ,
            properties: {
              authSchemes: [{
                name: tqQ,
                signingName: eqQ,
                signingRegion: "{Region}"
              }]
            },
            headers: Mw
          },
          [m8]: nI
        }],
        [m8]: hS
      }, {
        conditions: aqQ,
        rules: [{
          conditions: sqQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [m8]: W6A
        }, {
          conditions: rqQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [m8]: W6A
        }, {
          endpoint: {
            url: QNQ,
            properties: Mw,
            headers: Mw
          },
          [m8]: nI
        }],
        [m8]: hS
      }, {
        conditions: [cqQ],
        rules: [{
          conditions: [pqQ],
          rules: [{
            conditions: [ZNQ, INQ],
            rules: [{
              conditions: [{
                [Q7]: hd,
                [B7]: [BR1, iqQ]
              }, nqQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: Mw,
                  headers: Mw
                },
                [m8]: nI
              }],
              [m8]: hS
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [m8]: W6A
            }],
            [m8]: hS
          }, {
            conditions: sqQ,
            rules: [{
              conditions: [{
                [Q7]: hd,
                [B7]: [iqQ, BR1]
              }],
              rules: [{
                conditions: [{
                  [Q7]: WD,
                  [B7]: [{
                    [Q7]: ZR1,
                    [B7]: [YNQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: Mw,
                  headers: Mw
                },
                [m8]: nI
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: Mw,
                  headers: Mw
                },
                [m8]: nI
              }],
              [m8]: hS
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [m8]: W6A
            }],
            [m8]: hS
          }, {
            conditions: rqQ,
            rules: [{
              conditions: [nqQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: Mw,
                  headers: Mw
                },
                [m8]: nI
              }],
              [m8]: hS
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [m8]: W6A
            }],
            [m8]: hS
          }, lqQ, {
            endpoint: {
              url: mqQ,
              properties: Mw,
              headers: Mw
            },
            [m8]: nI
          }],
          [m8]: hS
        }],
        [m8]: hS
      }, {
        error: "Invalid Configuration: Missing Region",
        [m8]: W6A
      }]
    };
  JNQ.ruleSet = C28
})
// @from(Start 3461795, End 3462380)
KNQ = z((VNQ) => {
  Object.defineProperty(VNQ, "__esModule", {
    value: !0
  });
  VNQ.defaultEndpointResolver = void 0;
  var E28 = sHA(),
    IR1 = FI(),
    z28 = XNQ(),
    U28 = new IR1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    $28 = (A, Q = {}) => {
      return U28.get(A, () => (0, IR1.resolveEndpoint)(z28.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  VNQ.defaultEndpointResolver = $28;
  IR1.customEndpointFunctions.aws = E28.awsEndpointFunctions
})
// @from(Start 3462386, End 3463795)
zNQ = z((CNQ) => {
  Object.defineProperty(CNQ, "__esModule", {
    value: !0
  });
  CNQ.getRuntimeConfig = void 0;
  var w28 = nz(),
    q28 = iB(),
    N28 = S3(),
    L28 = NJ(),
    DNQ = Jo(),
    HNQ = O2(),
    M28 = eO1(),
    O28 = KNQ(),
    R28 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? DNQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? DNQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? O28.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? M28.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new w28.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new q28.NoAuthSigner
        }],
        logger: A?.logger ?? new N28.NoOpLogger,
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? L28.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? HNQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? HNQ.toUtf8
      }
    };
  CNQ.getRuntimeConfig = R28
})
// @from(Start 3463801, End 3466603)
LNQ = z((qNQ) => {
  Object.defineProperty(qNQ, "__esModule", {
    value: !0
  });
  qNQ.getRuntimeConfig = void 0;
  var T28 = sr(),
    P28 = T28.__importDefault(AR1()),
    YR1 = nz(),
    UNQ = CmA(),
    EmA = f8(),
    j28 = iB(),
    S28 = RX(),
    $NQ = D6(),
    Vo = uI(),
    wNQ = IZ(),
    _28 = TX(),
    k28 = KW(),
    y28 = zNQ(),
    x28 = S3(),
    v28 = PX(),
    b28 = S3(),
    f28 = (A) => {
      (0, b28.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, v28.resolveDefaultsModeConfig)(A),
        B = () => Q().then(x28.loadConfigsForDefaultMode),
        G = (0, y28.getRuntimeConfig)(A);
      (0, YR1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Vo.loadConfig)(YR1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? _28.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, UNQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: P28.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4") || (async (Y) => await A.credentialDefaultProvider(Y?.__config || {})()),
          signer: new YR1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new j28.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, Vo.loadConfig)($NQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Vo.loadConfig)(EmA.NODE_REGION_CONFIG_OPTIONS, {
          ...EmA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: wNQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Vo.loadConfig)({
          ...$NQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || k28.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? S28.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? wNQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Vo.loadConfig)(EmA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Vo.loadConfig)(EmA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Vo.loadConfig)(UNQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  qNQ.getRuntimeConfig = f28
})
// @from(Start 3466609, End 3469212)
UmA = z((oN7, jNQ) => {
  var {
    defineProperty: zmA,
    getOwnPropertyDescriptor: h28,
    getOwnPropertyNames: g28
  } = Object, u28 = Object.prototype.hasOwnProperty, gS = (A, Q) => zmA(A, "name", {
    value: Q,
    configurable: !0
  }), m28 = (A, Q) => {
    for (var B in Q) zmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, d28 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of g28(Q))
        if (!u28.call(A, Z) && Z !== B) zmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = h28(Q, Z)) || G.enumerable
        })
    }
    return A
  }, c28 = (A) => d28(zmA({}, "__esModule", {
    value: !0
  }), A), ONQ = {};
  m28(ONQ, {
    NODE_REGION_CONFIG_FILE_OPTIONS: () => n28,
    NODE_REGION_CONFIG_OPTIONS: () => i28,
    REGION_ENV_NAME: () => RNQ,
    REGION_INI_NAME: () => TNQ,
    getAwsRegionExtensionConfiguration: () => p28,
    resolveAwsRegionExtensionConfiguration: () => l28,
    resolveRegionConfig: () => a28
  });
  jNQ.exports = c28(ONQ);
  var p28 = gS((A) => {
      return {
        setRegion(Q) {
          A.region = Q
        },
        region() {
          return A.region
        }
      }
    }, "getAwsRegionExtensionConfiguration"),
    l28 = gS((A) => {
      return {
        region: A.region()
      }
    }, "resolveAwsRegionExtensionConfiguration"),
    RNQ = "AWS_REGION",
    TNQ = "region",
    i28 = {
      environmentVariableSelector: gS((A) => A[RNQ], "environmentVariableSelector"),
      configFileSelector: gS((A) => A[TNQ], "configFileSelector"),
      default: gS(() => {
        throw Error("Region is missing")
      }, "default")
    },
    n28 = {
      preferredFile: "credentials"
    },
    PNQ = gS((A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), "isFipsRegion"),
    MNQ = gS((A) => PNQ(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, "getRealRegion"),
    a28 = gS((A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: gS(async () => {
          if (typeof Q === "string") return MNQ(Q);
          let G = await Q();
          return MNQ(G)
        }, "region"),
        useFipsEndpoint: gS(async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (PNQ(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }, "useFipsEndpoint")
      })
    }, "resolveRegionConfig")
})
// @from(Start 3469218, End 3470237)
kNQ = z((SNQ) => {
  Object.defineProperty(SNQ, "__esModule", {
    value: !0
  });
  SNQ.resolveHttpAuthRuntimeConfig = SNQ.getHttpAuthExtensionConfiguration = void 0;
  var s28 = (A) => {
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
  SNQ.getHttpAuthExtensionConfiguration = s28;
  var r28 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  SNQ.resolveHttpAuthRuntimeConfig = r28
})
// @from(Start 3470243, End 3470968)
gNQ = z((fNQ) => {
  Object.defineProperty(fNQ, "__esModule", {
    value: !0
  });
  fNQ.resolveRuntimeExtensions = void 0;
  var yNQ = UmA(),
    xNQ = Lw(),
    vNQ = S3(),
    bNQ = kNQ(),
    t28 = (A, Q) => {
      let B = Object.assign((0, yNQ.getAwsRegionExtensionConfiguration)(A), (0, vNQ.getDefaultExtensionConfiguration)(A), (0, xNQ.getHttpHandlerExtensionConfiguration)(A), (0, bNQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, yNQ.resolveAwsRegionExtensionConfiguration)(B), (0, vNQ.resolveDefaultRuntimeConfig)(B), (0, xNQ.resolveHttpHandlerRuntimeConfig)(B), (0, bNQ.resolveHttpAuthRuntimeConfig)(B))
    };
  fNQ.resolveRuntimeExtensions = t28
})
// @from(Start 3470974, End 3472956)
BCA = z((WR1) => {
  Object.defineProperty(WR1, "__esModule", {
    value: !0
  });
  WR1.STSClient = WR1.__Client = void 0;
  var uNQ = luA(),
    e28 = nuA(),
    A98 = ruA(),
    mNQ = QCA(),
    Q98 = f8(),
    JR1 = iB(),
    B98 = LX(),
    G98 = q5(),
    dNQ = D6(),
    pNQ = S3();
  Object.defineProperty(WR1, "__Client", {
    enumerable: !0,
    get: function() {
      return pNQ.Client
    }
  });
  var cNQ = eO1(),
    Z98 = GCA(),
    I98 = LNQ(),
    Y98 = gNQ();
  class lNQ extends pNQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, I98.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, Z98.resolveClientEndpointParameters)(Q),
        G = (0, mNQ.resolveUserAgentConfig)(B),
        Z = (0, dNQ.resolveRetryConfig)(G),
        I = (0, Q98.resolveRegionConfig)(Z),
        Y = (0, uNQ.resolveHostHeaderConfig)(I),
        J = (0, G98.resolveEndpointConfig)(Y),
        W = (0, cNQ.resolveHttpAuthSchemeConfig)(J),
        X = (0, Y98.resolveRuntimeExtensions)(W, A?.extensions || []);
      this.config = X, this.middlewareStack.use((0, mNQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, dNQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, B98.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, uNQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, e28.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, A98.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, JR1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: cNQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (V) => new JR1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": V.credentials
        })
      })), this.middlewareStack.use((0, JR1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  WR1.STSClient = lNQ
})
// @from(Start 3472962, End 3496334)
wmA = z((BL7, hR1) => {
  var {
    defineProperty: $mA,
    getOwnPropertyDescriptor: J98,
    getOwnPropertyNames: W98
  } = Object, X98 = Object.prototype.hasOwnProperty, k2 = (A, Q) => $mA(A, "name", {
    value: Q,
    configurable: !0
  }), V98 = (A, Q) => {
    for (var B in Q) $mA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, _R1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of W98(Q))
        if (!X98.call(A, Z) && Z !== B) $mA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = J98(Q, Z)) || G.enumerable
        })
    }
    return A
  }, F98 = (A, Q, B) => (_R1(A, Q, "default"), B && _R1(B, Q, "default")), K98 = (A) => _R1($mA({}, "__esModule", {
    value: !0
  }), A), yR1 = {};
  V98(yR1, {
    AssumeRoleCommand: () => bR1,
    AssumeRoleResponseFilterSensitiveLog: () => sNQ,
    AssumeRoleWithWebIdentityCommand: () => fR1,
    AssumeRoleWithWebIdentityRequestFilterSensitiveLog: () => BLQ,
    AssumeRoleWithWebIdentityResponseFilterSensitiveLog: () => GLQ,
    ClientInputEndpointParameters: () => Z48.ClientInputEndpointParameters,
    CredentialsFilterSensitiveLog: () => xR1,
    ExpiredTokenException: () => rNQ,
    IDPCommunicationErrorException: () => ZLQ,
    IDPRejectedClaimException: () => ALQ,
    InvalidIdentityTokenException: () => QLQ,
    MalformedPolicyDocumentException: () => oNQ,
    PackedPolicyTooLargeException: () => tNQ,
    RegionDisabledException: () => eNQ,
    STS: () => CLQ,
    STSServiceException: () => Bb,
    decorateDefaultCredentialProvider: () => J48,
    getDefaultRoleAssumer: () => qLQ,
    getDefaultRoleAssumerWithWebIdentity: () => NLQ
  });
  hR1.exports = K98(yR1);
  F98(yR1, BCA(), hR1.exports);
  var D98 = S3(),
    H98 = q5(),
    C98 = GZ(),
    E98 = S3(),
    z98 = GCA(),
    aNQ = S3(),
    U98 = S3(),
    Bb = class A extends U98.ServiceException {
      static {
        k2(this, "STSServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    xR1 = k2((A) => ({
      ...A,
      ...A.SecretAccessKey && {
        SecretAccessKey: aNQ.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    sNQ = k2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: xR1(A.Credentials)
      }
    }), "AssumeRoleResponseFilterSensitiveLog"),
    rNQ = class A extends Bb {
      static {
        k2(this, "ExpiredTokenException")
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
    oNQ = class A extends Bb {
      static {
        k2(this, "MalformedPolicyDocumentException")
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
    tNQ = class A extends Bb {
      static {
        k2(this, "PackedPolicyTooLargeException")
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
    eNQ = class A extends Bb {
      static {
        k2(this, "RegionDisabledException")
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
    ALQ = class A extends Bb {
      static {
        k2(this, "IDPRejectedClaimException")
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
    QLQ = class A extends Bb {
      static {
        k2(this, "InvalidIdentityTokenException")
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
    BLQ = k2((A) => ({
      ...A,
      ...A.WebIdentityToken && {
        WebIdentityToken: aNQ.SENSITIVE_STRING
      }
    }), "AssumeRoleWithWebIdentityRequestFilterSensitiveLog"),
    GLQ = k2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: xR1(A.Credentials)
      }
    }), "AssumeRoleWithWebIdentityResponseFilterSensitiveLog"),
    ZLQ = class A extends Bb {
      static {
        k2(this, "IDPCommunicationErrorException")
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
    vR1 = nz(),
    $98 = Lw(),
    L7 = S3(),
    w98 = k2(async (A, Q) => {
      let B = VLQ,
        G;
      return G = HLQ({
        ..._98(A, Q),
        [KLQ]: s98,
        [DLQ]: FLQ
      }), XLQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleCommand"),
    q98 = k2(async (A, Q) => {
      let B = VLQ,
        G;
      return G = HLQ({
        ...k98(A, Q),
        [KLQ]: r98,
        [DLQ]: FLQ
      }), XLQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithWebIdentityCommand"),
    N98 = k2(async (A, Q) => {
      if (A.statusCode >= 300) return ILQ(A, Q);
      let B = await (0, vR1.parseXmlBody)(A.body, Q),
        G = {};
      return G = g98(B.AssumeRoleResult, Q), {
        $metadata: Gb(A),
        ...G
      }
    }, "de_AssumeRoleCommand"),
    L98 = k2(async (A, Q) => {
      if (A.statusCode >= 300) return ILQ(A, Q);
      let B = await (0, vR1.parseXmlBody)(A.body, Q),
        G = {};
      return G = u98(B.AssumeRoleWithWebIdentityResult, Q), {
        $metadata: Gb(A),
        ...G
      }
    }, "de_AssumeRoleWithWebIdentityCommand"),
    ILQ = k2(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, vR1.parseXmlErrorBody)(A.body, Q)
        },
        G = o98(A, B.body);
      switch (G) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await M98(B, Q);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await P98(B, Q);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await j98(B, Q);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await S98(B, Q);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await O98(B, Q);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await R98(B, Q);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await T98(B, Q);
        default:
          let Z = B.body;
          return a98({
            output: A,
            parsedBody: Z.Error,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    M98 = k2(async (A, Q) => {
      let B = A.body,
        G = m98(B.Error, Q),
        Z = new rNQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_ExpiredTokenExceptionRes"),
    O98 = k2(async (A, Q) => {
      let B = A.body,
        G = d98(B.Error, Q),
        Z = new ZLQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_IDPCommunicationErrorExceptionRes"),
    R98 = k2(async (A, Q) => {
      let B = A.body,
        G = c98(B.Error, Q),
        Z = new ALQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_IDPRejectedClaimExceptionRes"),
    T98 = k2(async (A, Q) => {
      let B = A.body,
        G = p98(B.Error, Q),
        Z = new QLQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityTokenExceptionRes"),
    P98 = k2(async (A, Q) => {
      let B = A.body,
        G = l98(B.Error, Q),
        Z = new oNQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_MalformedPolicyDocumentExceptionRes"),
    j98 = k2(async (A, Q) => {
      let B = A.body,
        G = i98(B.Error, Q),
        Z = new tNQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_PackedPolicyTooLargeExceptionRes"),
    S98 = k2(async (A, Q) => {
      let B = A.body,
        G = n98(B.Error, Q),
        Z = new eNQ({
          $metadata: Gb(A),
          ...G
        });
      return (0, L7.decorateServiceException)(Z, B)
    }, "de_RegionDisabledExceptionRes"),
    _98 = k2((A, Q) => {
      let B = {};
      if (A[C6A] != null) B[C6A] = A[C6A];
      if (A[E6A] != null) B[E6A] = A[E6A];
      if (A[D6A] != null) {
        let G = YLQ(A[D6A], Q);
        if (A[D6A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[K6A] != null) B[K6A] = A[K6A];
      if (A[F6A] != null) B[F6A] = A[F6A];
      if (A[OR1] != null) {
        let G = h98(A[OR1], Q);
        if (A[OR1]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      if (A[TR1] != null) {
        let G = f98(A[TR1], Q);
        if (A[TR1]?.length === 0) B.TransitiveTagKeys = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TransitiveTagKeys.${Z}`;
          B[Y] = I
        })
      }
      if (A[CR1] != null) B[CR1] = A[CR1];
      if (A[LR1] != null) B[LR1] = A[LR1];
      if (A[RR1] != null) B[RR1] = A[RR1];
      if (A[Qb] != null) B[Qb] = A[Qb];
      if (A[UR1] != null) {
        let G = v98(A[UR1], Q);
        if (A[UR1]?.length === 0) B.ProvidedContexts = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `ProvidedContexts.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_AssumeRoleRequest"),
    k98 = k2((A, Q) => {
      let B = {};
      if (A[C6A] != null) B[C6A] = A[C6A];
      if (A[E6A] != null) B[E6A] = A[E6A];
      if (A[jR1] != null) B[jR1] = A[jR1];
      if (A[$R1] != null) B[$R1] = A[$R1];
      if (A[D6A] != null) {
        let G = YLQ(A[D6A], Q);
        if (A[D6A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[K6A] != null) B[K6A] = A[K6A];
      if (A[F6A] != null) B[F6A] = A[F6A];
      return B
    }, "se_AssumeRoleWithWebIdentityRequest"),
    YLQ = k2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = y98(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_policyDescriptorListType"),
    y98 = k2((A, Q) => {
      let B = {};
      if (A[SR1] != null) B[SR1] = A[SR1];
      return B
    }, "se_PolicyDescriptorType"),
    x98 = k2((A, Q) => {
      let B = {};
      if (A[zR1] != null) B[zR1] = A[zR1];
      if (A[DR1] != null) B[DR1] = A[DR1];
      return B
    }, "se_ProvidedContext"),
    v98 = k2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = x98(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_ProvidedContextsListType"),
    b98 = k2((A, Q) => {
      let B = {};
      if (A[ER1] != null) B[ER1] = A[ER1];
      if (A[PR1] != null) B[PR1] = A[PR1];
      return B
    }, "se_Tag"),
    f98 = k2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        B[`member.${G}`] = Z, G++
      }
      return B
    }, "se_tagKeyListType"),
    h98 = k2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = b98(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_tagListType"),
    JLQ = k2((A, Q) => {
      let B = {};
      if (A[VR1] != null) B[VR1] = (0, L7.expectString)(A[VR1]);
      if (A[FR1] != null) B[FR1] = (0, L7.expectString)(A[FR1]);
      return B
    }, "de_AssumedRoleUser"),
    g98 = k2((A, Q) => {
      let B = {};
      if (A[V6A] != null) B[V6A] = WLQ(A[V6A], Q);
      if (A[X6A] != null) B[X6A] = JLQ(A[X6A], Q);
      if (A[H6A] != null) B[H6A] = (0, L7.strictParseInt32)(A[H6A]);
      if (A[Qb] != null) B[Qb] = (0, L7.expectString)(A[Qb]);
      return B
    }, "de_AssumeRoleResponse"),
    u98 = k2((A, Q) => {
      let B = {};
      if (A[V6A] != null) B[V6A] = WLQ(A[V6A], Q);
      if (A[NR1] != null) B[NR1] = (0, L7.expectString)(A[NR1]);
      if (A[X6A] != null) B[X6A] = JLQ(A[X6A], Q);
      if (A[H6A] != null) B[H6A] = (0, L7.strictParseInt32)(A[H6A]);
      if (A[wR1] != null) B[wR1] = (0, L7.expectString)(A[wR1]);
      if (A[KR1] != null) B[KR1] = (0, L7.expectString)(A[KR1]);
      if (A[Qb] != null) B[Qb] = (0, L7.expectString)(A[Qb]);
      return B
    }, "de_AssumeRoleWithWebIdentityResponse"),
    WLQ = k2((A, Q) => {
      let B = {};
      if (A[XR1] != null) B[XR1] = (0, L7.expectString)(A[XR1]);
      if (A[qR1] != null) B[qR1] = (0, L7.expectString)(A[qR1]);
      if (A[MR1] != null) B[MR1] = (0, L7.expectString)(A[MR1]);
      if (A[HR1] != null) B[HR1] = (0, L7.expectNonNull)((0, L7.parseRfc3339DateTimeWithOffset)(A[HR1]));
      return B
    }, "de_Credentials"),
    m98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_ExpiredTokenException"),
    d98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_IDPCommunicationErrorException"),
    c98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_IDPRejectedClaimException"),
    p98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_InvalidIdentityTokenException"),
    l98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_MalformedPolicyDocumentException"),
    i98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_PackedPolicyTooLargeException"),
    n98 = k2((A, Q) => {
      let B = {};
      if (A[UW] != null) B[UW] = (0, L7.expectString)(A[UW]);
      return B
    }, "de_RegionDisabledException"),
    Gb = k2((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    a98 = (0, L7.withBaseException)(Bb),
    XLQ = k2(async (A, Q, B, G, Z) => {
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
      return new $98.HttpRequest(X)
    }, "buildHttpRpcRequest"),
    VLQ = {
      "content-type": "application/x-www-form-urlencoded"
    },
    FLQ = "2011-06-15",
    KLQ = "Action",
    XR1 = "AccessKeyId",
    s98 = "AssumeRole",
    VR1 = "AssumedRoleId",
    X6A = "AssumedRoleUser",
    r98 = "AssumeRoleWithWebIdentity",
    FR1 = "Arn",
    KR1 = "Audience",
    V6A = "Credentials",
    DR1 = "ContextAssertion",
    F6A = "DurationSeconds",
    HR1 = "Expiration",
    CR1 = "ExternalId",
    ER1 = "Key",
    K6A = "Policy",
    D6A = "PolicyArns",
    zR1 = "ProviderArn",
    UR1 = "ProvidedContexts",
    $R1 = "ProviderId",
    H6A = "PackedPolicySize",
    wR1 = "Provider",
    C6A = "RoleArn",
    E6A = "RoleSessionName",
    qR1 = "SecretAccessKey",
    NR1 = "SubjectFromWebIdentityToken",
    Qb = "SourceIdentity",
    LR1 = "SerialNumber",
    MR1 = "SessionToken",
    OR1 = "Tags",
    RR1 = "TokenCode",
    TR1 = "TransitiveTagKeys",
    DLQ = "Version",
    PR1 = "Value",
    jR1 = "WebIdentityToken",
    SR1 = "arn",
    UW = "message",
    HLQ = k2((A) => Object.entries(A).map(([Q, B]) => (0, L7.extendedEncodeURIComponent)(Q) + "=" + (0, L7.extendedEncodeURIComponent)(B)).join("&"), "buildFormUrlencodedString"),
    o98 = k2((A, Q) => {
      if (Q.Error?.Code !== void 0) return Q.Error.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadQueryErrorCode"),
    bR1 = class extends E98.Command.classBuilder().ep(z98.commonParams).m(function(A, Q, B, G) {
      return [(0, C98.getSerdePlugin)(B, this.serialize, this.deserialize), (0, H98.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").f(void 0, sNQ).ser(w98).de(N98).build() {
      static {
        k2(this, "AssumeRoleCommand")
      }
    },
    t98 = q5(),
    e98 = GZ(),
    A48 = S3(),
    Q48 = GCA(),
    fR1 = class extends A48.Command.classBuilder().ep(Q48.commonParams).m(function(A, Q, B, G) {
      return [(0, e98.getSerdePlugin)(B, this.serialize, this.deserialize), (0, t98.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").f(BLQ, GLQ).ser(q98).de(L98).build() {
      static {
        k2(this, "AssumeRoleWithWebIdentityCommand")
      }
    },
    B48 = BCA(),
    G48 = {
      AssumeRoleCommand: bR1,
      AssumeRoleWithWebIdentityCommand: fR1
    },
    CLQ = class extends B48.STSClient {
      static {
        k2(this, "STS")
      }
    };
  (0, D98.createAggregatedClient)(G48, CLQ);
  var Z48 = GCA(),
    kR1 = LL(),
    nNQ = "us-east-1",
    ELQ = k2((A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    }, "getAccountIdFromAssumedRoleUser"),
    zLQ = k2(async (A, Q, B) => {
      let G = typeof A === "function" ? await A() : A,
        Z = typeof Q === "function" ? await Q() : Q;
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${G} (provider)`, `${Z} (parent client)`, `${nNQ} (STS default)`), G ?? Z ?? nNQ
    }, "resolveRegion"),
    I48 = k2((A, Q) => {
      let B, G;
      return async (Z, I) => {
        if (G = Z, !B) {
          let {
            logger: V = A?.parentClientConfig?.logger,
            region: F,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: D
          } = A, H = await zLQ(F, A?.parentClientConfig?.region, D), C = !ULQ(K);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            credentialDefaultProvider: k2(() => async () => G, "credentialDefaultProvider"),
            region: H,
            requestHandler: C ? K : void 0,
            logger: V
          })
        }
        let {
          Credentials: Y,
          AssumedRoleUser: J
        } = await B.send(new bR1(I));
        if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`);
        let W = ELQ(J),
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
        return (0, kR1.setCredentialFeature)(X, "CREDENTIALS_STS_ASSUME_ROLE", "i"), X
      }
    }, "getDefaultRoleAssumer"),
    Y48 = k2((A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            region: X,
            requestHandler: V = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: F
          } = A, K = await zLQ(X, A?.parentClientConfig?.region, F), D = !ULQ(V);
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
        } = await B.send(new fR1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let Y = ELQ(I),
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
        if (Y)(0, kR1.setCredentialFeature)(J, "RESOLVED_ACCOUNT_ID", "T");
        return (0, kR1.setCredentialFeature)(J, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), J
      }
    }, "getDefaultRoleAssumerWithWebIdentity"),
    ULQ = k2((A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, "isH2"),
    $LQ = BCA(),
    wLQ = k2((A, Q) => {
      if (!Q) return A;
      else return class extends A {
        static {
          k2(this, "CustomizableSTSClient")
        }
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, "getCustomizableStsClientCtor"),
    qLQ = k2((A = {}, Q) => I48(A, wLQ($LQ.STSClient, Q)), "getDefaultRoleAssumer"),
    NLQ = k2((A = {}, Q) => Y48(A, wLQ($LQ.STSClient, Q)), "getDefaultRoleAssumerWithWebIdentity"),
    J48 = k2((A) => (Q) => A({
      roleAssumer: qLQ(Q),
      roleAssumerWithWebIdentity: NLQ(Q),
      ...Q
    }), "decorateDefaultCredentialProvider")
})
// @from(Start 3496340, End 3499582)
NmA = z((YL7, OLQ) => {
  var {
    defineProperty: qmA,
    getOwnPropertyDescriptor: W48,
    getOwnPropertyNames: X48
  } = Object, V48 = Object.prototype.hasOwnProperty, uR1 = (A, Q) => qmA(A, "name", {
    value: Q,
    configurable: !0
  }), F48 = (A, Q) => {
    for (var B in Q) qmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, K48 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of X48(Q))
        if (!V48.call(A, Z) && Z !== B) qmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = W48(Q, Z)) || G.enumerable
        })
    }
    return A
  }, D48 = (A) => K48(qmA({}, "__esModule", {
    value: !0
  }), A), MLQ = {};
  F48(MLQ, {
    fromProcess: () => $48
  });
  OLQ.exports = D48(MLQ);
  var LLQ = SG(),
    gR1 = j2(),
    H48 = UA("child_process"),
    C48 = UA("util"),
    E48 = LL(),
    z48 = uR1((A, Q, B) => {
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
      return (0, E48.setCredentialFeature)(Z, "CREDENTIALS_PROCESS", "w"), Z
    }, "getValidatedProcessCredentials"),
    U48 = uR1(async (A, Q, B) => {
      let G = Q[A];
      if (Q[A]) {
        let Z = G.credential_process;
        if (Z !== void 0) {
          let I = (0, C48.promisify)(H48.exec);
          try {
            let {
              stdout: Y
            } = await I(Z), J;
            try {
              J = JSON.parse(Y.trim())
            } catch {
              throw Error(`Profile ${A} credential_process returned invalid JSON.`)
            }
            return z48(A, J, Q)
          } catch (Y) {
            throw new gR1.CredentialsProviderError(Y.message, {
              logger: B
            })
          }
        } else throw new gR1.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
          logger: B
        })
      } else throw new gR1.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
        logger: B
      })
    }, "resolveProcessCredentials"),
    $48 = uR1((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      let B = await (0, LLQ.parseKnownFiles)(A);
      return U48((0, LLQ.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), B, A.logger)
    }, "fromProcess")
})
// @from(Start 3499588, End 3501276)
dR1 = z((RLQ) => {
  Object.defineProperty(RLQ, "__esModule", {
    value: !0
  });
  RLQ.resolveHttpAuthSchemeConfig = RLQ.defaultSSOHttpAuthSchemeProvider = RLQ.defaultSSOHttpAuthSchemeParametersProvider = void 0;
  var w48 = nz(),
    mR1 = w7(),
    q48 = async (A, Q, B) => {
      return {
        operation: (0, mR1.getSmithyContext)(Q).operation,
        region: await (0, mR1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  RLQ.defaultSSOHttpAuthSchemeParametersProvider = q48;

  function N48(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "awsssoportal",
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

  function LmA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var L48 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetRoleCredentials": {
        Q.push(LmA(A));
        break
      }
      case "ListAccountRoles": {
        Q.push(LmA(A));
        break
      }
      case "ListAccounts": {
        Q.push(LmA(A));
        break
      }
      case "Logout": {
        Q.push(LmA(A));
        break
      }
      default:
        Q.push(N48(A))
    }
    return Q
  };
  RLQ.defaultSSOHttpAuthSchemeProvider = L48;
  var M48 = (A) => {
    let Q = (0, w48.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, mR1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  RLQ.resolveHttpAuthSchemeConfig = M48
})
// @from(Start 3501282, End 3504870)
PLQ = z((WL7, T48) => {
  T48.exports = {
    name: "@aws-sdk/client-sso",
    description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
    version: "3.840.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-sso",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/middleware-host-header": "3.840.0",
      "@aws-sdk/middleware-logger": "3.840.0",
      "@aws-sdk/middleware-recursion-detection": "3.840.0",
      "@aws-sdk/middleware-user-agent": "3.840.0",
      "@aws-sdk/region-config-resolver": "3.840.0",
      "@aws-sdk/types": "3.840.0",
      "@aws-sdk/util-endpoints": "3.840.0",
      "@aws-sdk/util-user-agent-browser": "3.840.0",
      "@aws-sdk/util-user-agent-node": "3.840.0",
      "@smithy/config-resolver": "^4.1.4",
      "@smithy/core": "^3.6.0",
      "@smithy/fetch-http-handler": "^5.0.4",
      "@smithy/hash-node": "^4.0.4",
      "@smithy/invalid-dependency": "^4.0.4",
      "@smithy/middleware-content-length": "^4.0.4",
      "@smithy/middleware-endpoint": "^4.1.13",
      "@smithy/middleware-retry": "^4.1.14",
      "@smithy/middleware-serde": "^4.0.8",
      "@smithy/middleware-stack": "^4.0.4",
      "@smithy/node-config-provider": "^4.1.3",
      "@smithy/node-http-handler": "^4.0.6",
      "@smithy/protocol-http": "^5.1.2",
      "@smithy/smithy-client": "^4.4.5",
      "@smithy/types": "^4.3.1",
      "@smithy/url-parser": "^4.0.4",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.21",
      "@smithy/util-defaults-mode-node": "^4.0.21",
      "@smithy/util-endpoints": "^3.0.6",
      "@smithy/util-middleware": "^4.0.4",
      "@smithy/util-retry": "^4.0.6",
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
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
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-sso"
    }
  }
})
// @from(Start 3504876, End 3509573)
lLQ = z((cLQ) => {
  Object.defineProperty(cLQ, "__esModule", {
    value: !0
  });
  cLQ.ruleSet = void 0;
  var gLQ = "required",
    OL = "fn",
    RL = "argv",
    $6A = "ref",
    jLQ = !0,
    SLQ = "isSet",
    ZCA = "booleanEquals",
    z6A = "error",
    U6A = "endpoint",
    Zb = "tree",
    cR1 = "PartitionResult",
    pR1 = "getAttr",
    _LQ = {
      [gLQ]: !1,
      type: "String"
    },
    kLQ = {
      [gLQ]: !0,
      default: !1,
      type: "Boolean"
    },
    yLQ = {
      [$6A]: "Endpoint"
    },
    uLQ = {
      [OL]: ZCA,
      [RL]: [{
        [$6A]: "UseFIPS"
      }, !0]
    },
    mLQ = {
      [OL]: ZCA,
      [RL]: [{
        [$6A]: "UseDualStack"
      }, !0]
    },
    ML = {},
    xLQ = {
      [OL]: pR1,
      [RL]: [{
        [$6A]: cR1
      }, "supportsFIPS"]
    },
    dLQ = {
      [$6A]: cR1
    },
    vLQ = {
      [OL]: ZCA,
      [RL]: [!0, {
        [OL]: pR1,
        [RL]: [dLQ, "supportsDualStack"]
      }]
    },
    bLQ = [uLQ],
    fLQ = [mLQ],
    hLQ = [{
      [$6A]: "Region"
    }],
    P48 = {
      version: "1.0",
      parameters: {
        Region: _LQ,
        UseDualStack: kLQ,
        UseFIPS: kLQ,
        Endpoint: _LQ
      },
      rules: [{
        conditions: [{
          [OL]: SLQ,
          [RL]: [yLQ]
        }],
        rules: [{
          conditions: bLQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: z6A
        }, {
          conditions: fLQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: z6A
        }, {
          endpoint: {
            url: yLQ,
            properties: ML,
            headers: ML
          },
          type: U6A
        }],
        type: Zb
      }, {
        conditions: [{
          [OL]: SLQ,
          [RL]: hLQ
        }],
        rules: [{
          conditions: [{
            [OL]: "aws.partition",
            [RL]: hLQ,
            assign: cR1
          }],
          rules: [{
            conditions: [uLQ, mLQ],
            rules: [{
              conditions: [{
                [OL]: ZCA,
                [RL]: [jLQ, xLQ]
              }, vLQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: ML,
                  headers: ML
                },
                type: U6A
              }],
              type: Zb
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: z6A
            }],
            type: Zb
          }, {
            conditions: bLQ,
            rules: [{
              conditions: [{
                [OL]: ZCA,
                [RL]: [xLQ, jLQ]
              }],
              rules: [{
                conditions: [{
                  [OL]: "stringEquals",
                  [RL]: [{
                    [OL]: pR1,
                    [RL]: [dLQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://portal.sso.{Region}.amazonaws.com",
                  properties: ML,
                  headers: ML
                },
                type: U6A
              }, {
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: ML,
                  headers: ML
                },
                type: U6A
              }],
              type: Zb
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: z6A
            }],
            type: Zb
          }, {
            conditions: fLQ,
            rules: [{
              conditions: [vLQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: ML,
                  headers: ML
                },
                type: U6A
              }],
              type: Zb
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: z6A
            }],
            type: Zb
          }, {
            endpoint: {
              url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
              properties: ML,
              headers: ML
            },
            type: U6A
          }],
          type: Zb
        }],
        type: Zb
      }, {
        error: "Invalid Configuration: Missing Region",
        type: z6A
      }]
    };
  cLQ.ruleSet = P48
})
// @from(Start 3509579, End 3510143)
aLQ = z((iLQ) => {
  Object.defineProperty(iLQ, "__esModule", {
    value: !0
  });
  iLQ.defaultEndpointResolver = void 0;
  var j48 = sHA(),
    lR1 = FI(),
    S48 = lLQ(),
    _48 = new lR1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    k48 = (A, Q = {}) => {
      return _48.get(A, () => (0, lR1.resolveEndpoint)(S48.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  iLQ.defaultEndpointResolver = k48;
  lR1.customEndpointFunctions.aws = j48.awsEndpointFunctions
})
// @from(Start 3510149, End 3511558)
eLQ = z((oLQ) => {
  Object.defineProperty(oLQ, "__esModule", {
    value: !0
  });
  oLQ.getRuntimeConfig = void 0;
  var y48 = nz(),
    x48 = iB(),
    v48 = S3(),
    b48 = NJ(),
    sLQ = Jo(),
    rLQ = O2(),
    f48 = dR1(),
    h48 = aLQ(),
    g48 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? sLQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? sLQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? h48.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? f48.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new y48.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new x48.NoAuthSigner
        }],
        logger: A?.logger ?? new v48.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO",
        urlParser: A?.urlParser ?? b48.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? rLQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? rLQ.toUtf8
      }
    };
  oLQ.getRuntimeConfig = g48
})
// @from(Start 3511564, End 3513863)
YMQ = z((ZMQ) => {
  Object.defineProperty(ZMQ, "__esModule", {
    value: !0
  });
  ZMQ.getRuntimeConfig = void 0;
  var u48 = sr(),
    m48 = u48.__importDefault(PLQ()),
    AMQ = nz(),
    QMQ = CmA(),
    MmA = f8(),
    d48 = RX(),
    BMQ = D6(),
    Fo = uI(),
    GMQ = IZ(),
    c48 = TX(),
    p48 = KW(),
    l48 = eLQ(),
    i48 = S3(),
    n48 = PX(),
    a48 = S3(),
    s48 = (A) => {
      (0, a48.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, n48.resolveDefaultsModeConfig)(A),
        B = () => Q().then(i48.loadConfigsForDefaultMode),
        G = (0, l48.getRuntimeConfig)(A);
      (0, AMQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Fo.loadConfig)(AMQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? c48.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, QMQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: m48.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, Fo.loadConfig)(BMQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Fo.loadConfig)(MmA.NODE_REGION_CONFIG_OPTIONS, {
          ...MmA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: GMQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Fo.loadConfig)({
          ...BMQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || p48.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? d48.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? GMQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Fo.loadConfig)(MmA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Fo.loadConfig)(MmA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Fo.loadConfig)(QMQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  ZMQ.getRuntimeConfig = s48
})
// @from(Start 3513869, End 3530417)
xMQ = z((DL7, yMQ) => {
  var {
    defineProperty: OmA,
    getOwnPropertyDescriptor: r48,
    getOwnPropertyNames: o48
  } = Object, t48 = Object.prototype.hasOwnProperty, M5 = (A, Q) => OmA(A, "name", {
    value: Q,
    configurable: !0
  }), e48 = (A, Q) => {
    for (var B in Q) OmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, A88 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of o48(Q))
        if (!t48.call(A, Z) && Z !== B) OmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = r48(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Q88 = (A) => A88(OmA({}, "__esModule", {
    value: !0
  }), A), DMQ = {};
  e48(DMQ, {
    GetRoleCredentialsCommand: () => SMQ,
    GetRoleCredentialsRequestFilterSensitiveLog: () => UMQ,
    GetRoleCredentialsResponseFilterSensitiveLog: () => wMQ,
    InvalidRequestException: () => HMQ,
    ListAccountRolesCommand: () => iR1,
    ListAccountRolesRequestFilterSensitiveLog: () => qMQ,
    ListAccountsCommand: () => nR1,
    ListAccountsRequestFilterSensitiveLog: () => NMQ,
    LogoutCommand: () => _MQ,
    LogoutRequestFilterSensitiveLog: () => LMQ,
    ResourceNotFoundException: () => CMQ,
    RoleCredentialsFilterSensitiveLog: () => $MQ,
    SSO: () => kMQ,
    SSOClient: () => TmA,
    SSOServiceException: () => w6A,
    TooManyRequestsException: () => EMQ,
    UnauthorizedException: () => zMQ,
    __Client: () => F2.Client,
    paginateListAccountRoles: () => T88,
    paginateListAccounts: () => P88
  });
  yMQ.exports = Q88(DMQ);
  var JMQ = luA(),
    B88 = nuA(),
    G88 = ruA(),
    WMQ = QCA(),
    Z88 = f8(),
    Ib = iB(),
    I88 = LX(),
    YCA = q5(),
    XMQ = D6(),
    VMQ = dR1(),
    Y88 = M5((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "awsssoportal"
      })
    }, "resolveClientEndpointParameters"),
    RmA = {
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
    J88 = YMQ(),
    FMQ = UmA(),
    KMQ = Lw(),
    F2 = S3(),
    W88 = M5((A) => {
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
    }, "getHttpAuthExtensionConfiguration"),
    X88 = M5((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    V88 = M5((A, Q) => {
      let B = Object.assign((0, FMQ.getAwsRegionExtensionConfiguration)(A), (0, F2.getDefaultExtensionConfiguration)(A), (0, KMQ.getHttpHandlerExtensionConfiguration)(A), W88(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, FMQ.resolveAwsRegionExtensionConfiguration)(B), (0, F2.resolveDefaultRuntimeConfig)(B), (0, KMQ.resolveHttpHandlerRuntimeConfig)(B), X88(B))
    }, "resolveRuntimeExtensions"),
    TmA = class extends F2.Client {
      static {
        M5(this, "SSOClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, J88.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = Y88(Q),
          G = (0, WMQ.resolveUserAgentConfig)(B),
          Z = (0, XMQ.resolveRetryConfig)(G),
          I = (0, Z88.resolveRegionConfig)(Z),
          Y = (0, JMQ.resolveHostHeaderConfig)(I),
          J = (0, YCA.resolveEndpointConfig)(Y),
          W = (0, VMQ.resolveHttpAuthSchemeConfig)(J),
          X = V88(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, WMQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, XMQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, I88.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, JMQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, B88.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, G88.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Ib.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: VMQ.defaultSSOHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: M5(async (V) => new Ib.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, Ib.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    PmA = GZ(),
    w6A = class A extends F2.ServiceException {
      static {
        M5(this, "SSOServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    HMQ = class A extends w6A {
      static {
        M5(this, "InvalidRequestException")
      }
      name = "InvalidRequestException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    CMQ = class A extends w6A {
      static {
        M5(this, "ResourceNotFoundException")
      }
      name = "ResourceNotFoundException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ResourceNotFoundException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    EMQ = class A extends w6A {
      static {
        M5(this, "TooManyRequestsException")
      }
      name = "TooManyRequestsException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "TooManyRequestsException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    zMQ = class A extends w6A {
      static {
        M5(this, "UnauthorizedException")
      }
      name = "UnauthorizedException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "UnauthorizedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    UMQ = M5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: F2.SENSITIVE_STRING
      }
    }), "GetRoleCredentialsRequestFilterSensitiveLog"),
    $MQ = M5((A) => ({
      ...A,
      ...A.secretAccessKey && {
        secretAccessKey: F2.SENSITIVE_STRING
      },
      ...A.sessionToken && {
        sessionToken: F2.SENSITIVE_STRING
      }
    }), "RoleCredentialsFilterSensitiveLog"),
    wMQ = M5((A) => ({
      ...A,
      ...A.roleCredentials && {
        roleCredentials: $MQ(A.roleCredentials)
      }
    }), "GetRoleCredentialsResponseFilterSensitiveLog"),
    qMQ = M5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: F2.SENSITIVE_STRING
      }
    }), "ListAccountRolesRequestFilterSensitiveLog"),
    NMQ = M5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: F2.SENSITIVE_STRING
      }
    }), "ListAccountsRequestFilterSensitiveLog"),
    LMQ = M5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: F2.SENSITIVE_STRING
      }
    }), "LogoutRequestFilterSensitiveLog"),
    ICA = nz(),
    F88 = M5(async (A, Q) => {
      let B = (0, Ib.requestBuilder)(A, Q),
        G = (0, F2.map)({}, F2.isSerializableHeaderValue, {
          [_mA]: A[SmA]
        });
      B.bp("/federation/credentials");
      let Z = (0, F2.map)({
          [O88]: [, (0, F2.expectNonNull)(A[M88], "roleName")],
          [OMQ]: [, (0, F2.expectNonNull)(A[MMQ], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_GetRoleCredentialsCommand"),
    K88 = M5(async (A, Q) => {
      let B = (0, Ib.requestBuilder)(A, Q),
        G = (0, F2.map)({}, F2.isSerializableHeaderValue, {
          [_mA]: A[SmA]
        });
      B.bp("/assignment/roles");
      let Z = (0, F2.map)({
          [jMQ]: [, A[PMQ]],
          [TMQ]: [() => A.maxResults !== void 0, () => A[RMQ].toString()],
          [OMQ]: [, (0, F2.expectNonNull)(A[MMQ], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountRolesCommand"),
    D88 = M5(async (A, Q) => {
      let B = (0, Ib.requestBuilder)(A, Q),
        G = (0, F2.map)({}, F2.isSerializableHeaderValue, {
          [_mA]: A[SmA]
        });
      B.bp("/assignment/accounts");
      let Z = (0, F2.map)({
          [jMQ]: [, A[PMQ]],
          [TMQ]: [() => A.maxResults !== void 0, () => A[RMQ].toString()]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountsCommand"),
    H88 = M5(async (A, Q) => {
      let B = (0, Ib.requestBuilder)(A, Q),
        G = (0, F2.map)({}, F2.isSerializableHeaderValue, {
          [_mA]: A[SmA]
        });
      B.bp("/logout");
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_LogoutCommand"),
    C88 = M5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jmA(A, Q);
      let B = (0, F2.map)({
          $metadata: ud(A)
        }),
        G = (0, F2.expectNonNull)((0, F2.expectObject)(await (0, ICA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F2.take)(G, {
          roleCredentials: F2._json
        });
      return Object.assign(B, Z), B
    }, "de_GetRoleCredentialsCommand"),
    E88 = M5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jmA(A, Q);
      let B = (0, F2.map)({
          $metadata: ud(A)
        }),
        G = (0, F2.expectNonNull)((0, F2.expectObject)(await (0, ICA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F2.take)(G, {
          nextToken: F2.expectString,
          roleList: F2._json
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountRolesCommand"),
    z88 = M5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jmA(A, Q);
      let B = (0, F2.map)({
          $metadata: ud(A)
        }),
        G = (0, F2.expectNonNull)((0, F2.expectObject)(await (0, ICA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F2.take)(G, {
          accountList: F2._json,
          nextToken: F2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountsCommand"),
    U88 = M5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jmA(A, Q);
      let B = (0, F2.map)({
        $metadata: ud(A)
      });
      return await (0, F2.collectBody)(A.body, Q), B
    }, "de_LogoutCommand"),
    jmA = M5(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, ICA.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, ICA.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await w88(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await q88(B, Q);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await N88(B, Q);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await L88(B, Q);
        default:
          let Z = B.body;
          return $88({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    $88 = (0, F2.withBaseException)(w6A),
    w88 = M5(async (A, Q) => {
      let B = (0, F2.map)({}),
        G = A.body,
        Z = (0, F2.take)(G, {
          message: F2.expectString
        });
      Object.assign(B, Z);
      let I = new HMQ({
        $metadata: ud(A),
        ...B
      });
      return (0, F2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    q88 = M5(async (A, Q) => {
      let B = (0, F2.map)({}),
        G = A.body,
        Z = (0, F2.take)(G, {
          message: F2.expectString
        });
      Object.assign(B, Z);
      let I = new CMQ({
        $metadata: ud(A),
        ...B
      });
      return (0, F2.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    N88 = M5(async (A, Q) => {
      let B = (0, F2.map)({}),
        G = A.body,
        Z = (0, F2.take)(G, {
          message: F2.expectString
        });
      Object.assign(B, Z);
      let I = new EMQ({
        $metadata: ud(A),
        ...B
      });
      return (0, F2.decorateServiceException)(I, A.body)
    }, "de_TooManyRequestsExceptionRes"),
    L88 = M5(async (A, Q) => {
      let B = (0, F2.map)({}),
        G = A.body,
        Z = (0, F2.take)(G, {
          message: F2.expectString
        });
      Object.assign(B, Z);
      let I = new zMQ({
        $metadata: ud(A),
        ...B
      });
      return (0, F2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedExceptionRes"),
    ud = M5((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    MMQ = "accountId",
    SmA = "accessToken",
    OMQ = "account_id",
    RMQ = "maxResults",
    TMQ = "max_result",
    PMQ = "nextToken",
    jMQ = "next_token",
    M88 = "roleName",
    O88 = "role_name",
    _mA = "x-amz-sso_bearer_token",
    SMQ = class extends F2.Command.classBuilder().ep(RmA).m(function(A, Q, B, G) {
      return [(0, PmA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, YCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").f(UMQ, wMQ).ser(F88).de(C88).build() {
      static {
        M5(this, "GetRoleCredentialsCommand")
      }
    },
    iR1 = class extends F2.Command.classBuilder().ep(RmA).m(function(A, Q, B, G) {
      return [(0, PmA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, YCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").f(qMQ, void 0).ser(K88).de(E88).build() {
      static {
        M5(this, "ListAccountRolesCommand")
      }
    },
    nR1 = class extends F2.Command.classBuilder().ep(RmA).m(function(A, Q, B, G) {
      return [(0, PmA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, YCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").f(NMQ, void 0).ser(D88).de(z88).build() {
      static {
        M5(this, "ListAccountsCommand")
      }
    },
    _MQ = class extends F2.Command.classBuilder().ep(RmA).m(function(A, Q, B, G) {
      return [(0, PmA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, YCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").f(LMQ, void 0).ser(H88).de(U88).build() {
      static {
        M5(this, "LogoutCommand")
      }
    },
    R88 = {
      GetRoleCredentialsCommand: SMQ,
      ListAccountRolesCommand: iR1,
      ListAccountsCommand: nR1,
      LogoutCommand: _MQ
    },
    kMQ = class extends TmA {
      static {
        M5(this, "SSO")
      }
    };
  (0, F2.createAggregatedClient)(R88, kMQ);
  var T88 = (0, Ib.createPaginator)(TmA, iR1, "nextToken", "nextToken", "maxResults"),
    P88 = (0, Ib.createPaginator)(TmA, nR1, "nextToken", "nextToken", "maxResults")
})
// @from(Start 3530423, End 3531894)
sR1 = z((vMQ) => {
  Object.defineProperty(vMQ, "__esModule", {
    value: !0
  });
  vMQ.resolveHttpAuthSchemeConfig = vMQ.defaultSSOOIDCHttpAuthSchemeProvider = vMQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
  var j88 = nz(),
    aR1 = w7(),
    S88 = async (A, Q, B) => {
      return {
        operation: (0, aR1.getSmithyContext)(Q).operation,
        region: await (0, aR1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  vMQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = S88;

  function _88(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "sso-oauth",
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

  function k88(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var y88 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateToken": {
        Q.push(k88(A));
        break
      }
      default:
        Q.push(_88(A))
    }
    return Q
  };
  vMQ.defaultSSOOIDCHttpAuthSchemeProvider = y88;
  var x88 = (A) => {
    let Q = (0, j88.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, aR1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  vMQ.resolveHttpAuthSchemeConfig = x88
})
// @from(Start 3531900, End 3536567)
eMQ = z((oMQ) => {
  Object.defineProperty(oMQ, "__esModule", {
    value: !0
  });
  oMQ.ruleSet = void 0;
  var nMQ = "required",
    PL = "fn",
    jL = "argv",
    L6A = "ref",
    fMQ = !0,
    hMQ = "isSet",
    JCA = "booleanEquals",
    q6A = "error",
    N6A = "endpoint",
    Yb = "tree",
    rR1 = "PartitionResult",
    oR1 = "getAttr",
    gMQ = {
      [nMQ]: !1,
      type: "String"
    },
    uMQ = {
      [nMQ]: !0,
      default: !1,
      type: "Boolean"
    },
    mMQ = {
      [L6A]: "Endpoint"
    },
    aMQ = {
      [PL]: JCA,
      [jL]: [{
        [L6A]: "UseFIPS"
      }, !0]
    },
    sMQ = {
      [PL]: JCA,
      [jL]: [{
        [L6A]: "UseDualStack"
      }, !0]
    },
    TL = {},
    dMQ = {
      [PL]: oR1,
      [jL]: [{
        [L6A]: rR1
      }, "supportsFIPS"]
    },
    rMQ = {
      [L6A]: rR1
    },
    cMQ = {
      [PL]: JCA,
      [jL]: [!0, {
        [PL]: oR1,
        [jL]: [rMQ, "supportsDualStack"]
      }]
    },
    pMQ = [aMQ],
    lMQ = [sMQ],
    iMQ = [{
      [L6A]: "Region"
    }],
    f88 = {
      version: "1.0",
      parameters: {
        Region: gMQ,
        UseDualStack: uMQ,
        UseFIPS: uMQ,
        Endpoint: gMQ
      },
      rules: [{
        conditions: [{
          [PL]: hMQ,
          [jL]: [mMQ]
        }],
        rules: [{
          conditions: pMQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: q6A
        }, {
          conditions: lMQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: q6A
        }, {
          endpoint: {
            url: mMQ,
            properties: TL,
            headers: TL
          },
          type: N6A
        }],
        type: Yb
      }, {
        conditions: [{
          [PL]: hMQ,
          [jL]: iMQ
        }],
        rules: [{
          conditions: [{
            [PL]: "aws.partition",
            [jL]: iMQ,
            assign: rR1
          }],
          rules: [{
            conditions: [aMQ, sMQ],
            rules: [{
              conditions: [{
                [PL]: JCA,
                [jL]: [fMQ, dMQ]
              }, cMQ],
              rules: [{
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: TL,
                  headers: TL
                },
                type: N6A
              }],
              type: Yb
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: q6A
            }],
            type: Yb
          }, {
            conditions: pMQ,
            rules: [{
              conditions: [{
                [PL]: JCA,
                [jL]: [dMQ, fMQ]
              }],
              rules: [{
                conditions: [{
                  [PL]: "stringEquals",
                  [jL]: [{
                    [PL]: oR1,
                    [jL]: [rMQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://oidc.{Region}.amazonaws.com",
                  properties: TL,
                  headers: TL
                },
                type: N6A
              }, {
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: TL,
                  headers: TL
                },
                type: N6A
              }],
              type: Yb
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: q6A
            }],
            type: Yb
          }, {
            conditions: lMQ,
            rules: [{
              conditions: [cMQ],
              rules: [{
                endpoint: {
                  url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: TL,
                  headers: TL
                },
                type: N6A
              }],
              type: Yb
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: q6A
            }],
            type: Yb
          }, {
            endpoint: {
              url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
              properties: TL,
              headers: TL
            },
            type: N6A
          }],
          type: Yb
        }],
        type: Yb
      }, {
        error: "Invalid Configuration: Missing Region",
        type: q6A
      }]
    };
  oMQ.ruleSet = f88
})
// @from(Start 3536573, End 3537137)
BOQ = z((AOQ) => {
  Object.defineProperty(AOQ, "__esModule", {
    value: !0
  });
  AOQ.defaultEndpointResolver = void 0;
  var h88 = sHA(),
    tR1 = FI(),
    g88 = eMQ(),
    u88 = new tR1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    m88 = (A, Q = {}) => {
      return u88.get(A, () => (0, tR1.resolveEndpoint)(g88.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  AOQ.defaultEndpointResolver = m88;
  tR1.customEndpointFunctions.aws = h88.awsEndpointFunctions
})
// @from(Start 3537143, End 3538561)
JOQ = z((IOQ) => {
  Object.defineProperty(IOQ, "__esModule", {
    value: !0
  });
  IOQ.getRuntimeConfig = void 0;
  var d88 = nz(),
    c88 = iB(),
    p88 = S3(),
    l88 = NJ(),
    GOQ = Jo(),
    ZOQ = O2(),
    i88 = sR1(),
    n88 = BOQ(),
    a88 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? GOQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? GOQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? n88.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? i88.defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new d88.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new c88.NoAuthSigner
        }],
        logger: A?.logger ?? new p88.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO OIDC",
        urlParser: A?.urlParser ?? l88.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? ZOQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? ZOQ.toUtf8
      }
    };
  IOQ.getRuntimeConfig = a88
})
// @from(Start 3538567, End 3540866)
HOQ = z((KOQ) => {
  Object.defineProperty(KOQ, "__esModule", {
    value: !0
  });
  KOQ.getRuntimeConfig = void 0;
  var s88 = sr(),
    r88 = s88.__importDefault(AR1()),
    WOQ = nz(),
    XOQ = CmA(),
    kmA = f8(),
    o88 = RX(),
    VOQ = D6(),
    Ko = uI(),
    FOQ = IZ(),
    t88 = TX(),
    e88 = KW(),
    A68 = JOQ(),
    Q68 = S3(),
    B68 = PX(),
    G68 = S3(),
    Z68 = (A) => {
      (0, G68.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, B68.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Q68.loadConfigsForDefaultMode),
        G = (0, A68.getRuntimeConfig)(A);
      (0, WOQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Ko.loadConfig)(WOQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? t88.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, XOQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: r88.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, Ko.loadConfig)(VOQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Ko.loadConfig)(kmA.NODE_REGION_CONFIG_OPTIONS, {
          ...kmA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: FOQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Ko.loadConfig)({
          ...VOQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || e88.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? o88.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? FOQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Ko.loadConfig)(kmA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Ko.loadConfig)(kmA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Ko.loadConfig)(XOQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  KOQ.getRuntimeConfig = Z68
})