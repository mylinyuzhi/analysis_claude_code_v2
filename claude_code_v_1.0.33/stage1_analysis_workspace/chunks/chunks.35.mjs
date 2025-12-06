
// @from(Start 3190328, End 3198505)
GCQ = z((QCQ) => {
  Object.defineProperty(QCQ, "__esModule", {
    value: !0
  });
  QCQ.ruleSet = void 0;
  var lHQ = "required",
    u8 = "type",
    e3 = "fn",
    A7 = "argv",
    kd = "ref",
    xHQ = !1,
    YM1 = !0,
    _d = "booleanEquals",
    ID = "stringEquals",
    iHQ = "sigv4",
    nHQ = "sts",
    aHQ = "us-east-1",
    pI = "endpoint",
    vHQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    yS = "tree",
    l8A = "error",
    WM1 = "getAttr",
    bHQ = {
      [lHQ]: !1,
      [u8]: "String"
    },
    JM1 = {
      [lHQ]: !0,
      default: !1,
      [u8]: "Boolean"
    },
    sHQ = {
      [kd]: "Endpoint"
    },
    fHQ = {
      [e3]: "isSet",
      [A7]: [{
        [kd]: "Region"
      }]
    },
    YD = {
      [kd]: "Region"
    },
    hHQ = {
      [e3]: "aws.partition",
      [A7]: [YD],
      assign: "PartitionResult"
    },
    rHQ = {
      [kd]: "UseFIPS"
    },
    oHQ = {
      [kd]: "UseDualStack"
    },
    qH = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: iHQ,
          signingName: nHQ,
          signingRegion: aHQ
        }]
      },
      headers: {}
    },
    ww = {},
    gHQ = {
      conditions: [{
        [e3]: ID,
        [A7]: [YD, "aws-global"]
      }],
      [pI]: qH,
      [u8]: pI
    },
    tHQ = {
      [e3]: _d,
      [A7]: [rHQ, !0]
    },
    eHQ = {
      [e3]: _d,
      [A7]: [oHQ, !0]
    },
    uHQ = {
      [e3]: WM1,
      [A7]: [{
        [kd]: "PartitionResult"
      }, "supportsFIPS"]
    },
    ACQ = {
      [kd]: "PartitionResult"
    },
    mHQ = {
      [e3]: _d,
      [A7]: [!0, {
        [e3]: WM1,
        [A7]: [ACQ, "supportsDualStack"]
      }]
    },
    dHQ = [{
      [e3]: "isSet",
      [A7]: [sHQ]
    }],
    cHQ = [tHQ],
    pHQ = [eHQ],
    Xs4 = {
      version: "1.0",
      parameters: {
        Region: bHQ,
        UseDualStack: JM1,
        UseFIPS: JM1,
        Endpoint: bHQ,
        UseGlobalEndpoint: JM1
      },
      rules: [{
        conditions: [{
          [e3]: _d,
          [A7]: [{
            [kd]: "UseGlobalEndpoint"
          }, YM1]
        }, {
          [e3]: "not",
          [A7]: dHQ
        }, fHQ, hHQ, {
          [e3]: _d,
          [A7]: [rHQ, xHQ]
        }, {
          [e3]: _d,
          [A7]: [oHQ, xHQ]
        }],
        rules: [{
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "ap-northeast-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "ap-south-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "ap-southeast-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "ap-southeast-2"]
          }],
          endpoint: qH,
          [u8]: pI
        }, gHQ, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "ca-central-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "eu-central-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "eu-north-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "eu-west-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "eu-west-2"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "eu-west-3"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "sa-east-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, aHQ]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "us-east-2"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "us-west-1"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          conditions: [{
            [e3]: ID,
            [A7]: [YD, "us-west-2"]
          }],
          endpoint: qH,
          [u8]: pI
        }, {
          endpoint: {
            url: vHQ,
            properties: {
              authSchemes: [{
                name: iHQ,
                signingName: nHQ,
                signingRegion: "{Region}"
              }]
            },
            headers: ww
          },
          [u8]: pI
        }],
        [u8]: yS
      }, {
        conditions: dHQ,
        rules: [{
          conditions: cHQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [u8]: l8A
        }, {
          conditions: pHQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [u8]: l8A
        }, {
          endpoint: {
            url: sHQ,
            properties: ww,
            headers: ww
          },
          [u8]: pI
        }],
        [u8]: yS
      }, {
        conditions: [fHQ],
        rules: [{
          conditions: [hHQ],
          rules: [{
            conditions: [tHQ, eHQ],
            rules: [{
              conditions: [{
                [e3]: _d,
                [A7]: [YM1, uHQ]
              }, mHQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: ww,
                  headers: ww
                },
                [u8]: pI
              }],
              [u8]: yS
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [u8]: l8A
            }],
            [u8]: yS
          }, {
            conditions: cHQ,
            rules: [{
              conditions: [{
                [e3]: _d,
                [A7]: [uHQ, YM1]
              }],
              rules: [{
                conditions: [{
                  [e3]: ID,
                  [A7]: [{
                    [e3]: WM1,
                    [A7]: [ACQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: ww,
                  headers: ww
                },
                [u8]: pI
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: ww,
                  headers: ww
                },
                [u8]: pI
              }],
              [u8]: yS
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [u8]: l8A
            }],
            [u8]: yS
          }, {
            conditions: pHQ,
            rules: [{
              conditions: [mHQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: ww,
                  headers: ww
                },
                [u8]: pI
              }],
              [u8]: yS
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [u8]: l8A
            }],
            [u8]: yS
          }, gHQ, {
            endpoint: {
              url: vHQ,
              properties: ww,
              headers: ww
            },
            [u8]: pI
          }],
          [u8]: yS
        }],
        [u8]: yS
      }, {
        error: "Invalid Configuration: Missing Region",
        [u8]: l8A
      }]
    };
  QCQ.ruleSet = Xs4
})
// @from(Start 3198511, End 3199096)
YCQ = z((ZCQ) => {
  Object.defineProperty(ZCQ, "__esModule", {
    value: !0
  });
  ZCQ.defaultEndpointResolver = void 0;
  var Vs4 = S8A(),
    XM1 = FI(),
    Fs4 = GCQ(),
    Ks4 = new XM1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    Ds4 = (A, Q = {}) => {
      return Ks4.get(A, () => (0, XM1.resolveEndpoint)(Fs4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  ZCQ.defaultEndpointResolver = Ds4;
  XM1.customEndpointFunctions.aws = Vs4.awsEndpointFunctions
})
// @from(Start 3199102, End 3200511)
FCQ = z((XCQ) => {
  Object.defineProperty(XCQ, "__esModule", {
    value: !0
  });
  XCQ.getRuntimeConfig = void 0;
  var Hs4 = TF(),
    Cs4 = iB(),
    Es4 = r6(),
    zs4 = NJ(),
    JCQ = Pd(),
    WCQ = O2(),
    Us4 = IM1(),
    $s4 = YCQ(),
    ws4 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? JCQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? JCQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? $s4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Us4.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Hs4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Cs4.NoAuthSigner
        }],
        logger: A?.logger ?? new Es4.NoOpLogger,
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? zs4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? WCQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? WCQ.toUtf8
      }
    };
  XCQ.getRuntimeConfig = ws4
})
// @from(Start 3200517, End 3203319)
zCQ = z((CCQ) => {
  Object.defineProperty(CCQ, "__esModule", {
    value: !0
  });
  CCQ.getRuntimeConfig = void 0;
  var qs4 = rr(),
    Ns4 = qs4.__importDefault(aL1()),
    VM1 = TF(),
    KCQ = kHA(),
    LuA = f8(),
    Ls4 = iB(),
    Ms4 = RX(),
    DCQ = D6(),
    Go = uI(),
    HCQ = IZ(),
    Os4 = TX(),
    Rs4 = KW(),
    Ts4 = FCQ(),
    Ps4 = r6(),
    js4 = PX(),
    Ss4 = r6(),
    _s4 = (A) => {
      (0, Ss4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, js4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Ps4.loadConfigsForDefaultMode),
        G = (0, Ts4.getRuntimeConfig)(A);
      (0, VM1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Go.loadConfig)(VM1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? Os4.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, KCQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Ns4.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4") || (async (Y) => await A.credentialDefaultProvider(Y?.__config || {})()),
          signer: new VM1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Ls4.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, Go.loadConfig)(DCQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Go.loadConfig)(LuA.NODE_REGION_CONFIG_OPTIONS, {
          ...LuA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: HCQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Go.loadConfig)({
          ...DCQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || Rs4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Ms4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? HCQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Go.loadConfig)(LuA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Go.loadConfig)(LuA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Go.loadConfig)(KCQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  CCQ.getRuntimeConfig = _s4
})
// @from(Start 3203325, End 3204344)
wCQ = z((UCQ) => {
  Object.defineProperty(UCQ, "__esModule", {
    value: !0
  });
  UCQ.resolveHttpAuthRuntimeConfig = UCQ.getHttpAuthExtensionConfiguration = void 0;
  var ks4 = (A) => {
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
  UCQ.getHttpAuthExtensionConfiguration = ks4;
  var ys4 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  UCQ.resolveHttpAuthRuntimeConfig = ys4
})
// @from(Start 3204350, End 3205075)
TCQ = z((OCQ) => {
  Object.defineProperty(OCQ, "__esModule", {
    value: !0
  });
  OCQ.resolveRuntimeExtensions = void 0;
  var qCQ = xHA(),
    NCQ = iz(),
    LCQ = r6(),
    MCQ = wCQ(),
    vs4 = (A, Q) => {
      let B = Object.assign((0, qCQ.getAwsRegionExtensionConfiguration)(A), (0, LCQ.getDefaultExtensionConfiguration)(A), (0, NCQ.getHttpHandlerExtensionConfiguration)(A), (0, MCQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, qCQ.resolveAwsRegionExtensionConfiguration)(B), (0, LCQ.resolveDefaultRuntimeConfig)(B), (0, NCQ.resolveHttpHandlerRuntimeConfig)(B), (0, MCQ.resolveHttpAuthRuntimeConfig)(B))
    };
  OCQ.resolveRuntimeExtensions = vs4
})
// @from(Start 3205081, End 3207063)
mHA = z((KM1) => {
  Object.defineProperty(KM1, "__esModule", {
    value: !0
  });
  KM1.STSClient = KM1.__Client = void 0;
  var PCQ = MHA(),
    bs4 = OHA(),
    fs4 = RHA(),
    jCQ = b8A(),
    hs4 = f8(),
    FM1 = iB(),
    gs4 = LX(),
    us4 = q5(),
    SCQ = D6(),
    kCQ = r6();
  Object.defineProperty(KM1, "__Client", {
    enumerable: !0,
    get: function() {
      return kCQ.Client
    }
  });
  var _CQ = IM1(),
    ms4 = dHA(),
    ds4 = zCQ(),
    cs4 = TCQ();
  class yCQ extends kCQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, ds4.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, ms4.resolveClientEndpointParameters)(Q),
        G = (0, jCQ.resolveUserAgentConfig)(B),
        Z = (0, SCQ.resolveRetryConfig)(G),
        I = (0, hs4.resolveRegionConfig)(Z),
        Y = (0, PCQ.resolveHostHeaderConfig)(I),
        J = (0, us4.resolveEndpointConfig)(Y),
        W = (0, _CQ.resolveHttpAuthSchemeConfig)(J),
        X = (0, cs4.resolveRuntimeExtensions)(W, A?.extensions || []);
      this.config = X, this.middlewareStack.use((0, jCQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, SCQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, gs4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, PCQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, bs4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, fs4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, FM1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: _CQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (V) => new FM1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": V.credentials
        })
      })), this.middlewareStack.use((0, FM1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  KM1.STSClient = yCQ
})
// @from(Start 3207069, End 3230441)
cM1 = z((ow7, dM1) => {
  var {
    defineProperty: MuA,
    getOwnPropertyDescriptor: ps4,
    getOwnPropertyNames: ls4
  } = Object, is4 = Object.prototype.hasOwnProperty, _2 = (A, Q) => MuA(A, "name", {
    value: Q,
    configurable: !0
  }), ns4 = (A, Q) => {
    for (var B in Q) MuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vM1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ls4(Q))
        if (!is4.call(A, Z) && Z !== B) MuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = ps4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, as4 = (A, Q, B) => (vM1(A, Q, "default"), B && vM1(B, Q, "default")), ss4 = (A) => vM1(MuA({}, "__esModule", {
    value: !0
  }), A), fM1 = {};
  ns4(fM1, {
    AssumeRoleCommand: () => uM1,
    AssumeRoleResponseFilterSensitiveLog: () => fCQ,
    AssumeRoleWithWebIdentityCommand: () => mM1,
    AssumeRoleWithWebIdentityRequestFilterSensitiveLog: () => pCQ,
    AssumeRoleWithWebIdentityResponseFilterSensitiveLog: () => lCQ,
    ClientInputEndpointParameters: () => mr4.ClientInputEndpointParameters,
    CredentialsFilterSensitiveLog: () => hM1,
    ExpiredTokenException: () => hCQ,
    IDPCommunicationErrorException: () => iCQ,
    IDPRejectedClaimException: () => dCQ,
    InvalidIdentityTokenException: () => cCQ,
    MalformedPolicyDocumentException: () => gCQ,
    PackedPolicyTooLargeException: () => uCQ,
    RegionDisabledException: () => mCQ,
    STS: () => GEQ,
    STSServiceException: () => ov,
    decorateDefaultCredentialProvider: () => pr4,
    getDefaultRoleAssumer: () => XEQ,
    getDefaultRoleAssumerWithWebIdentity: () => VEQ
  });
  dM1.exports = ss4(fM1);
  as4(fM1, mHA(), dM1.exports);
  var rs4 = r6(),
    os4 = q5(),
    ts4 = GZ(),
    es4 = r6(),
    Ar4 = dHA(),
    bCQ = r6(),
    Qr4 = r6(),
    ov = class A extends Qr4.ServiceException {
      static {
        _2(this, "STSServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    hM1 = _2((A) => ({
      ...A,
      ...A.SecretAccessKey && {
        SecretAccessKey: bCQ.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    fCQ = _2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: hM1(A.Credentials)
      }
    }), "AssumeRoleResponseFilterSensitiveLog"),
    hCQ = class A extends ov {
      static {
        _2(this, "ExpiredTokenException")
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
    gCQ = class A extends ov {
      static {
        _2(this, "MalformedPolicyDocumentException")
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
    uCQ = class A extends ov {
      static {
        _2(this, "PackedPolicyTooLargeException")
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
    mCQ = class A extends ov {
      static {
        _2(this, "RegionDisabledException")
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
    dCQ = class A extends ov {
      static {
        _2(this, "IDPRejectedClaimException")
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
    cCQ = class A extends ov {
      static {
        _2(this, "InvalidIdentityTokenException")
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
    pCQ = _2((A) => ({
      ...A,
      ...A.WebIdentityToken && {
        WebIdentityToken: bCQ.SENSITIVE_STRING
      }
    }), "AssumeRoleWithWebIdentityRequestFilterSensitiveLog"),
    lCQ = _2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: hM1(A.Credentials)
      }
    }), "AssumeRoleWithWebIdentityResponseFilterSensitiveLog"),
    iCQ = class A extends ov {
      static {
        _2(this, "IDPCommunicationErrorException")
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
    gM1 = TF(),
    Br4 = iz(),
    N7 = r6(),
    Gr4 = _2(async (A, Q) => {
      let B = tCQ,
        G;
      return G = BEQ({
        ...Hr4(A, Q),
        [AEQ]: kr4,
        [QEQ]: eCQ
      }), oCQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleCommand"),
    Zr4 = _2(async (A, Q) => {
      let B = tCQ,
        G;
      return G = BEQ({
        ...Cr4(A, Q),
        [AEQ]: yr4,
        [QEQ]: eCQ
      }), oCQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithWebIdentityCommand"),
    Ir4 = _2(async (A, Q) => {
      if (A.statusCode >= 300) return nCQ(A, Q);
      let B = await (0, gM1.parseXmlBody)(A.body, Q),
        G = {};
      return G = Nr4(B.AssumeRoleResult, Q), {
        $metadata: tv(A),
        ...G
      }
    }, "de_AssumeRoleCommand"),
    Yr4 = _2(async (A, Q) => {
      if (A.statusCode >= 300) return nCQ(A, Q);
      let B = await (0, gM1.parseXmlBody)(A.body, Q),
        G = {};
      return G = Lr4(B.AssumeRoleWithWebIdentityResult, Q), {
        $metadata: tv(A),
        ...G
      }
    }, "de_AssumeRoleWithWebIdentityCommand"),
    nCQ = _2(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, gM1.parseXmlErrorBody)(A.body, Q)
        },
        G = xr4(A, B.body);
      switch (G) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await Jr4(B, Q);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await Fr4(B, Q);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await Kr4(B, Q);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await Dr4(B, Q);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await Wr4(B, Q);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await Xr4(B, Q);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await Vr4(B, Q);
        default:
          let Z = B.body;
          return _r4({
            output: A,
            parsedBody: Z.Error,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Jr4 = _2(async (A, Q) => {
      let B = A.body,
        G = Mr4(B.Error, Q),
        Z = new hCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_ExpiredTokenExceptionRes"),
    Wr4 = _2(async (A, Q) => {
      let B = A.body,
        G = Or4(B.Error, Q),
        Z = new iCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_IDPCommunicationErrorExceptionRes"),
    Xr4 = _2(async (A, Q) => {
      let B = A.body,
        G = Rr4(B.Error, Q),
        Z = new dCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_IDPRejectedClaimExceptionRes"),
    Vr4 = _2(async (A, Q) => {
      let B = A.body,
        G = Tr4(B.Error, Q),
        Z = new cCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityTokenExceptionRes"),
    Fr4 = _2(async (A, Q) => {
      let B = A.body,
        G = Pr4(B.Error, Q),
        Z = new gCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_MalformedPolicyDocumentExceptionRes"),
    Kr4 = _2(async (A, Q) => {
      let B = A.body,
        G = jr4(B.Error, Q),
        Z = new uCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_PackedPolicyTooLargeExceptionRes"),
    Dr4 = _2(async (A, Q) => {
      let B = A.body,
        G = Sr4(B.Error, Q),
        Z = new mCQ({
          $metadata: tv(A),
          ...G
        });
      return (0, N7.decorateServiceException)(Z, B)
    }, "de_RegionDisabledExceptionRes"),
    Hr4 = _2((A, Q) => {
      let B = {};
      if (A[t8A] != null) B[t8A] = A[t8A];
      if (A[e8A] != null) B[e8A] = A[e8A];
      if (A[r8A] != null) {
        let G = aCQ(A[r8A], Q);
        if (A[r8A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[s8A] != null) B[s8A] = A[s8A];
      if (A[a8A] != null) B[a8A] = A[a8A];
      if (A[jM1] != null) {
        let G = qr4(A[jM1], Q);
        if (A[jM1]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      if (A[_M1] != null) {
        let G = wr4(A[_M1], Q);
        if (A[_M1]?.length === 0) B.TransitiveTagKeys = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TransitiveTagKeys.${Z}`;
          B[Y] = I
        })
      }
      if (A[$M1] != null) B[$M1] = A[$M1];
      if (A[TM1] != null) B[TM1] = A[TM1];
      if (A[SM1] != null) B[SM1] = A[SM1];
      if (A[rv] != null) B[rv] = A[rv];
      if (A[NM1] != null) {
        let G = Ur4(A[NM1], Q);
        if (A[NM1]?.length === 0) B.ProvidedContexts = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `ProvidedContexts.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_AssumeRoleRequest"),
    Cr4 = _2((A, Q) => {
      let B = {};
      if (A[t8A] != null) B[t8A] = A[t8A];
      if (A[e8A] != null) B[e8A] = A[e8A];
      if (A[yM1] != null) B[yM1] = A[yM1];
      if (A[LM1] != null) B[LM1] = A[LM1];
      if (A[r8A] != null) {
        let G = aCQ(A[r8A], Q);
        if (A[r8A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[s8A] != null) B[s8A] = A[s8A];
      if (A[a8A] != null) B[a8A] = A[a8A];
      return B
    }, "se_AssumeRoleWithWebIdentityRequest"),
    aCQ = _2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = Er4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_policyDescriptorListType"),
    Er4 = _2((A, Q) => {
      let B = {};
      if (A[xM1] != null) B[xM1] = A[xM1];
      return B
    }, "se_PolicyDescriptorType"),
    zr4 = _2((A, Q) => {
      let B = {};
      if (A[qM1] != null) B[qM1] = A[qM1];
      if (A[zM1] != null) B[zM1] = A[zM1];
      return B
    }, "se_ProvidedContext"),
    Ur4 = _2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = zr4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_ProvidedContextsListType"),
    $r4 = _2((A, Q) => {
      let B = {};
      if (A[wM1] != null) B[wM1] = A[wM1];
      if (A[kM1] != null) B[kM1] = A[kM1];
      return B
    }, "se_Tag"),
    wr4 = _2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        B[`member.${G}`] = Z, G++
      }
      return B
    }, "se_tagKeyListType"),
    qr4 = _2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = $r4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_tagListType"),
    sCQ = _2((A, Q) => {
      let B = {};
      if (A[HM1] != null) B[HM1] = (0, N7.expectString)(A[HM1]);
      if (A[CM1] != null) B[CM1] = (0, N7.expectString)(A[CM1]);
      return B
    }, "de_AssumedRoleUser"),
    Nr4 = _2((A, Q) => {
      let B = {};
      if (A[n8A] != null) B[n8A] = rCQ(A[n8A], Q);
      if (A[i8A] != null) B[i8A] = sCQ(A[i8A], Q);
      if (A[o8A] != null) B[o8A] = (0, N7.strictParseInt32)(A[o8A]);
      if (A[rv] != null) B[rv] = (0, N7.expectString)(A[rv]);
      return B
    }, "de_AssumeRoleResponse"),
    Lr4 = _2((A, Q) => {
      let B = {};
      if (A[n8A] != null) B[n8A] = rCQ(A[n8A], Q);
      if (A[RM1] != null) B[RM1] = (0, N7.expectString)(A[RM1]);
      if (A[i8A] != null) B[i8A] = sCQ(A[i8A], Q);
      if (A[o8A] != null) B[o8A] = (0, N7.strictParseInt32)(A[o8A]);
      if (A[MM1] != null) B[MM1] = (0, N7.expectString)(A[MM1]);
      if (A[EM1] != null) B[EM1] = (0, N7.expectString)(A[EM1]);
      if (A[rv] != null) B[rv] = (0, N7.expectString)(A[rv]);
      return B
    }, "de_AssumeRoleWithWebIdentityResponse"),
    rCQ = _2((A, Q) => {
      let B = {};
      if (A[DM1] != null) B[DM1] = (0, N7.expectString)(A[DM1]);
      if (A[OM1] != null) B[OM1] = (0, N7.expectString)(A[OM1]);
      if (A[PM1] != null) B[PM1] = (0, N7.expectString)(A[PM1]);
      if (A[UM1] != null) B[UM1] = (0, N7.expectNonNull)((0, N7.parseRfc3339DateTimeWithOffset)(A[UM1]));
      return B
    }, "de_Credentials"),
    Mr4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_ExpiredTokenException"),
    Or4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_IDPCommunicationErrorException"),
    Rr4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_IDPRejectedClaimException"),
    Tr4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_InvalidIdentityTokenException"),
    Pr4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_MalformedPolicyDocumentException"),
    jr4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_PackedPolicyTooLargeException"),
    Sr4 = _2((A, Q) => {
      let B = {};
      if (A[CW] != null) B[CW] = (0, N7.expectString)(A[CW]);
      return B
    }, "de_RegionDisabledException"),
    tv = _2((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    _r4 = (0, N7.withBaseException)(ov),
    oCQ = _2(async (A, Q, B, G, Z) => {
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
      return new Br4.HttpRequest(X)
    }, "buildHttpRpcRequest"),
    tCQ = {
      "content-type": "application/x-www-form-urlencoded"
    },
    eCQ = "2011-06-15",
    AEQ = "Action",
    DM1 = "AccessKeyId",
    kr4 = "AssumeRole",
    HM1 = "AssumedRoleId",
    i8A = "AssumedRoleUser",
    yr4 = "AssumeRoleWithWebIdentity",
    CM1 = "Arn",
    EM1 = "Audience",
    n8A = "Credentials",
    zM1 = "ContextAssertion",
    a8A = "DurationSeconds",
    UM1 = "Expiration",
    $M1 = "ExternalId",
    wM1 = "Key",
    s8A = "Policy",
    r8A = "PolicyArns",
    qM1 = "ProviderArn",
    NM1 = "ProvidedContexts",
    LM1 = "ProviderId",
    o8A = "PackedPolicySize",
    MM1 = "Provider",
    t8A = "RoleArn",
    e8A = "RoleSessionName",
    OM1 = "SecretAccessKey",
    RM1 = "SubjectFromWebIdentityToken",
    rv = "SourceIdentity",
    TM1 = "SerialNumber",
    PM1 = "SessionToken",
    jM1 = "Tags",
    SM1 = "TokenCode",
    _M1 = "TransitiveTagKeys",
    QEQ = "Version",
    kM1 = "Value",
    yM1 = "WebIdentityToken",
    xM1 = "arn",
    CW = "message",
    BEQ = _2((A) => Object.entries(A).map(([Q, B]) => (0, N7.extendedEncodeURIComponent)(Q) + "=" + (0, N7.extendedEncodeURIComponent)(B)).join("&"), "buildFormUrlencodedString"),
    xr4 = _2((A, Q) => {
      if (Q.Error?.Code !== void 0) return Q.Error.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadQueryErrorCode"),
    uM1 = class extends es4.Command.classBuilder().ep(Ar4.commonParams).m(function(A, Q, B, G) {
      return [(0, ts4.getSerdePlugin)(B, this.serialize, this.deserialize), (0, os4.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").f(void 0, fCQ).ser(Gr4).de(Ir4).build() {
      static {
        _2(this, "AssumeRoleCommand")
      }
    },
    vr4 = q5(),
    br4 = GZ(),
    fr4 = r6(),
    hr4 = dHA(),
    mM1 = class extends fr4.Command.classBuilder().ep(hr4.commonParams).m(function(A, Q, B, G) {
      return [(0, br4.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vr4.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").f(pCQ, lCQ).ser(Zr4).de(Yr4).build() {
      static {
        _2(this, "AssumeRoleWithWebIdentityCommand")
      }
    },
    gr4 = mHA(),
    ur4 = {
      AssumeRoleCommand: uM1,
      AssumeRoleWithWebIdentityCommand: mM1
    },
    GEQ = class extends gr4.STSClient {
      static {
        _2(this, "STS")
      }
    };
  (0, rs4.createAggregatedClient)(ur4, GEQ);
  var mr4 = dHA(),
    bM1 = lR(),
    vCQ = "us-east-1",
    ZEQ = _2((A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    }, "getAccountIdFromAssumedRoleUser"),
    IEQ = _2(async (A, Q, B) => {
      let G = typeof A === "function" ? await A() : A,
        Z = typeof Q === "function" ? await Q() : Q;
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${G} (provider)`, `${Z} (parent client)`, `${vCQ} (STS default)`), G ?? Z ?? vCQ
    }, "resolveRegion"),
    dr4 = _2((A, Q) => {
      let B, G;
      return async (Z, I) => {
        if (G = Z, !B) {
          let {
            logger: V = A?.parentClientConfig?.logger,
            region: F,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: D
          } = A, H = await IEQ(F, A?.parentClientConfig?.region, D), C = !YEQ(K);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            credentialDefaultProvider: _2(() => async () => G, "credentialDefaultProvider"),
            region: H,
            requestHandler: C ? K : void 0,
            logger: V
          })
        }
        let {
          Credentials: Y,
          AssumedRoleUser: J
        } = await B.send(new uM1(I));
        if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`);
        let W = ZEQ(J),
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
        return (0, bM1.setCredentialFeature)(X, "CREDENTIALS_STS_ASSUME_ROLE", "i"), X
      }
    }, "getDefaultRoleAssumer"),
    cr4 = _2((A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            region: X,
            requestHandler: V = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: F
          } = A, K = await IEQ(X, A?.parentClientConfig?.region, F), D = !YEQ(V);
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
        } = await B.send(new mM1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let Y = ZEQ(I),
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
        if (Y)(0, bM1.setCredentialFeature)(J, "RESOLVED_ACCOUNT_ID", "T");
        return (0, bM1.setCredentialFeature)(J, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), J
      }
    }, "getDefaultRoleAssumerWithWebIdentity"),
    YEQ = _2((A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, "isH2"),
    JEQ = mHA(),
    WEQ = _2((A, Q) => {
      if (!Q) return A;
      else return class extends A {
        static {
          _2(this, "CustomizableSTSClient")
        }
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, "getCustomizableStsClientCtor"),
    XEQ = _2((A = {}, Q) => dr4(A, WEQ(JEQ.STSClient, Q)), "getDefaultRoleAssumer"),
    VEQ = _2((A = {}, Q) => cr4(A, WEQ(JEQ.STSClient, Q)), "getDefaultRoleAssumerWithWebIdentity"),
    pr4 = _2((A) => (Q) => A({
      roleAssumer: XEQ(Q),
      roleAssumerWithWebIdentity: VEQ(Q),
      ...Q
    }), "decorateDefaultCredentialProvider")
})
// @from(Start 3230447, End 3233689)
iM1 = z((Qq7, DEQ) => {
  var {
    defineProperty: OuA,
    getOwnPropertyDescriptor: lr4,
    getOwnPropertyNames: ir4
  } = Object, nr4 = Object.prototype.hasOwnProperty, lM1 = (A, Q) => OuA(A, "name", {
    value: Q,
    configurable: !0
  }), ar4 = (A, Q) => {
    for (var B in Q) OuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, sr4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ir4(Q))
        if (!nr4.call(A, Z) && Z !== B) OuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = lr4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rr4 = (A) => sr4(OuA({}, "__esModule", {
    value: !0
  }), A), KEQ = {};
  ar4(KEQ, {
    fromProcess: () => Bo4
  });
  DEQ.exports = rr4(KEQ);
  var FEQ = SG(),
    pM1 = j2(),
    or4 = UA("child_process"),
    tr4 = UA("util"),
    er4 = lR(),
    Ao4 = lM1((A, Q, B) => {
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
      return (0, er4.setCredentialFeature)(Z, "CREDENTIALS_PROCESS", "w"), Z
    }, "getValidatedProcessCredentials"),
    Qo4 = lM1(async (A, Q, B) => {
      let G = Q[A];
      if (Q[A]) {
        let Z = G.credential_process;
        if (Z !== void 0) {
          let I = (0, tr4.promisify)(or4.exec);
          try {
            let {
              stdout: Y
            } = await I(Z), J;
            try {
              J = JSON.parse(Y.trim())
            } catch {
              throw Error(`Profile ${A} credential_process returned invalid JSON.`)
            }
            return Ao4(A, J, Q)
          } catch (Y) {
            throw new pM1.CredentialsProviderError(Y.message, {
              logger: B
            })
          }
        } else throw new pM1.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
          logger: B
        })
      } else throw new pM1.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
        logger: B
      })
    }, "resolveProcessCredentials"),
    Bo4 = lM1((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      let B = await (0, FEQ.parseKnownFiles)(A);
      return Qo4((0, FEQ.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), B, A.logger)
    }, "fromProcess")
})
// @from(Start 3233695, End 3236019)
nM1 = z((xS) => {
  var Go4 = xS && xS.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    Zo4 = xS && xS.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    Io4 = xS && xS.__importStar || function() {
      var A = function(Q) {
        return A = Object.getOwnPropertyNames || function(B) {
          var G = [];
          for (var Z in B)
            if (Object.prototype.hasOwnProperty.call(B, Z)) G[G.length] = Z;
          return G
        }, A(Q)
      };
      return function(Q) {
        if (Q && Q.__esModule) return Q;
        var B = {};
        if (Q != null) {
          for (var G = A(Q), Z = 0; Z < G.length; Z++)
            if (G[Z] !== "default") Go4(B, Q, G[Z])
        }
        return Zo4(B, Q), B
      }
    }();
  Object.defineProperty(xS, "__esModule", {
    value: !0
  });
  xS.fromWebToken = void 0;
  var Yo4 = (A) => async (Q) => {
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
      } = await Promise.resolve().then(() => Io4(cM1()));
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
  xS.fromWebToken = Yo4
})
// @from(Start 3236025, End 3237100)
zEQ = z((CEQ) => {
  Object.defineProperty(CEQ, "__esModule", {
    value: !0
  });
  CEQ.fromTokenFile = void 0;
  var Jo4 = lR(),
    Wo4 = j2(),
    Xo4 = UA("fs"),
    Vo4 = nM1(),
    HEQ = "AWS_WEB_IDENTITY_TOKEN_FILE",
    Fo4 = "AWS_ROLE_ARN",
    Ko4 = "AWS_ROLE_SESSION_NAME",
    Do4 = (A = {}) => async () => {
      A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      let Q = A?.webIdentityTokenFile ?? process.env[HEQ],
        B = A?.roleArn ?? process.env[Fo4],
        G = A?.roleSessionName ?? process.env[Ko4];
      if (!Q || !B) throw new Wo4.CredentialsProviderError("Web identity configuration not specified", {
        logger: A.logger
      });
      let Z = await (0, Vo4.fromWebToken)({
        ...A,
        webIdentityToken: (0, Xo4.readFileSync)(Q, {
          encoding: "ascii"
        }),
        roleArn: B,
        roleSessionName: G
      })();
      if (Q === process.env[HEQ])(0, Jo4.setCredentialFeature)(Z, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      return Z
    };
  CEQ.fromTokenFile = Do4
})
// @from(Start 3237106, End 3237802)
rM1 = z((Zq7, RuA) => {
  var {
    defineProperty: UEQ,
    getOwnPropertyDescriptor: Ho4,
    getOwnPropertyNames: Co4
  } = Object, Eo4 = Object.prototype.hasOwnProperty, aM1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Co4(Q))
        if (!Eo4.call(A, Z) && Z !== B) UEQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Ho4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $EQ = (A, Q, B) => (aM1(A, Q, "default"), B && aM1(B, Q, "default")), zo4 = (A) => aM1(UEQ({}, "__esModule", {
    value: !0
  }), A), sM1 = {};
  RuA.exports = zo4(sM1);
  $EQ(sM1, zEQ(), RuA.exports);
  $EQ(sM1, nM1(), RuA.exports)
})
// @from(Start 3237808, End 3247530)
TEQ = z((Iq7, REQ) => {
  var {
    create: Uo4,
    defineProperty: pHA,
    getOwnPropertyDescriptor: $o4,
    getOwnPropertyNames: wo4,
    getPrototypeOf: qo4
  } = Object, No4 = Object.prototype.hasOwnProperty, SX = (A, Q) => pHA(A, "name", {
    value: Q,
    configurable: !0
  }), Lo4 = (A, Q) => {
    for (var B in Q) pHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, LEQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of wo4(Q))
        if (!No4.call(A, Z) && Z !== B) pHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = $o4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yd = (A, Q, B) => (B = A != null ? Uo4(qo4(A)) : {}, LEQ(Q || !A || !A.__esModule ? pHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Mo4 = (A) => LEQ(pHA({}, "__esModule", {
    value: !0
  }), A), MEQ = {};
  Lo4(MEQ, {
    fromIni: () => bo4
  });
  REQ.exports = Mo4(MEQ);
  var tM1 = SG(),
    xd = lR(),
    cHA = j2(),
    Oo4 = SX((A, Q, B) => {
      let G = {
        EcsContainer: SX(async (Z) => {
          let {
            fromHttp: I
          } = await Promise.resolve().then(() => yd(fL1())), {
            fromContainerMetadata: Y
          } = await Promise.resolve().then(() => yd(OV()));
          return B?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => (0, cHA.chain)(I(Z ?? {}), Y(Z))().then(oM1)
        }, "EcsContainer"),
        Ec2InstanceMetadata: SX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
          let {
            fromInstanceMetadata: I
          } = await Promise.resolve().then(() => yd(OV()));
          return async () => I(Z)().then(oM1)
        }, "Ec2InstanceMetadata"),
        Environment: SX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
          let {
            fromEnv: I
          } = await Promise.resolve().then(() => yd(xL1()));
          return async () => I(Z)().then(oM1)
        }, "Environment")
      };
      if (A in G) return G[A];
      else throw new cHA.CredentialsProviderError(`Unsupported credential source in profile ${Q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
        logger: B
      })
    }, "resolveCredentialSource"),
    oM1 = SX((A) => (0, xd.setCredentialFeature)(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"), "setNamedProvider"),
    Ro4 = SX((A, {
      profile: Q = "default",
      logger: B
    } = {}) => {
      return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (To4(A, {
        profile: Q,
        logger: B
      }) || Po4(A, {
        profile: Q,
        logger: B
      }))
    }, "isAssumeRoleProfile"),
    To4 = SX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.source_profile === "string" && typeof A.credential_source > "u";
      if (G) B?.debug?.(`    ${Q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
      return G
    }, "isAssumeRoleWithSourceProfile"),
    Po4 = SX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.credential_source === "string" && typeof A.source_profile > "u";
      if (G) B?.debug?.(`    ${Q} isCredentialSourceProfile credential_source=${A.credential_source}`);
      return G
    }, "isCredentialSourceProfile"),
    jo4 = SX(async (A, Q, B, G = {}) => {
      B.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
      let Z = Q[A],
        {
          source_profile: I,
          region: Y
        } = Z;
      if (!B.roleAssumer) {
        let {
          getDefaultRoleAssumer: W
        } = await Promise.resolve().then(() => yd(cM1()));
        B.roleAssumer = W({
          ...B.clientConfig,
          credentialProviderLogger: B.logger,
          parentClientConfig: {
            ...B?.parentClientConfig,
            region: Y ?? B?.parentClientConfig?.region
          }
        }, B.clientPlugins)
      }
      if (I && I in G) throw new cHA.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${(0,tM1.getProfileName)(B)}. Profiles visited: ` + Object.keys(G).join(", "), {
        logger: B.logger
      });
      B.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${I?`source_profile=[${I}]`:`profile=[${A}]`}`);
      let J = I ? OEQ(I, Q, B, {
        ...G,
        [I]: !0
      }, wEQ(Q[I] ?? {})) : (await Oo4(Z.credential_source, A, B.logger)(B))();
      if (wEQ(Z)) return J.then((W) => (0, xd.setCredentialFeature)(W, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
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
          if (!B.mfaCodeProvider) throw new cHA.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
            logger: B.logger,
            tryNextLink: !1
          });
          W.SerialNumber = X, W.TokenCode = await B.mfaCodeProvider(X)
        }
        let V = await J;
        return B.roleAssumer(V, W).then((F) => (0, xd.setCredentialFeature)(F, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
      }
    }, "resolveAssumeRoleCredentials"),
    wEQ = SX((A) => {
      return !A.role_arn && !!A.credential_source
    }, "isCredentialSourceWithoutRoleArn"),
    So4 = SX((A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", "isProcessProfile"),
    _o4 = SX(async (A, Q) => Promise.resolve().then(() => yd(iM1())).then(({
      fromProcess: B
    }) => B({
      ...A,
      profile: Q
    })().then((G) => (0, xd.setCredentialFeature)(G, "CREDENTIALS_PROFILE_PROCESS", "v"))), "resolveProcessCredentials"),
    ko4 = SX(async (A, Q, B = {}) => {
      let {
        fromSSO: G
      } = await Promise.resolve().then(() => yd(GM1()));
      return G({
        profile: A,
        logger: B.logger,
        parentClientConfig: B.parentClientConfig,
        clientConfig: B.clientConfig
      })().then((Z) => {
        if (Q.sso_session) return (0, xd.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO", "r");
        else return (0, xd.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
      })
    }, "resolveSsoCredentials"),
    yo4 = SX((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    qEQ = SX((A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, "isStaticCredsProfile"),
    NEQ = SX(async (A, Q) => {
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
      return (0, xd.setCredentialFeature)(B, "CREDENTIALS_PROFILE", "n")
    }, "resolveStaticCredentials"),
    xo4 = SX((A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, "isWebIdentityProfile"),
    vo4 = SX(async (A, Q) => Promise.resolve().then(() => yd(rM1())).then(({
      fromTokenFile: B
    }) => B({
      webIdentityTokenFile: A.web_identity_token_file,
      roleArn: A.role_arn,
      roleSessionName: A.role_session_name,
      roleAssumerWithWebIdentity: Q.roleAssumerWithWebIdentity,
      logger: Q.logger,
      parentClientConfig: Q.parentClientConfig
    })().then((G) => (0, xd.setCredentialFeature)(G, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), "resolveWebIdentityCredentials"),
    OEQ = SX(async (A, Q, B, G = {}, Z = !1) => {
      let I = Q[A];
      if (Object.keys(G).length > 0 && qEQ(I)) return NEQ(I, B);
      if (Z || Ro4(I, {
          profile: A,
          logger: B.logger
        })) return jo4(A, Q, B, G);
      if (qEQ(I)) return NEQ(I, B);
      if (xo4(I)) return vo4(I, B);
      if (So4(I)) return _o4(B, A);
      if (yo4(I)) return await ko4(A, I, B);
      throw new cHA.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
        logger: B.logger
      })
    }, "resolveProfileData"),
    bo4 = SX((A = {}) => async ({
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
      let G = await (0, tM1.parseKnownFiles)(B);
      return OEQ((0, tM1.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), G, B)
    }, "fromIni")
})
// @from(Start 3247536, End 3252498)
vEQ = z((Yq7, xEQ) => {
  var {
    create: fo4,
    defineProperty: lHA,
    getOwnPropertyDescriptor: ho4,
    getOwnPropertyNames: go4,
    getPrototypeOf: uo4
  } = Object, mo4 = Object.prototype.hasOwnProperty, TuA = (A, Q) => lHA(A, "name", {
    value: Q,
    configurable: !0
  }), do4 = (A, Q) => {
    for (var B in Q) lHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, SEQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of go4(Q))
        if (!mo4.call(A, Z) && Z !== B) lHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = ho4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, A6A = (A, Q, B) => (B = A != null ? fo4(uo4(A)) : {}, SEQ(Q || !A || !A.__esModule ? lHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), co4 = (A) => SEQ(lHA({}, "__esModule", {
    value: !0
  }), A), _EQ = {};
  do4(_EQ, {
    credentialsTreatedAsExpired: () => yEQ,
    credentialsWillNeedRefresh: () => kEQ,
    defaultProvider: () => io4
  });
  xEQ.exports = co4(_EQ);
  var eM1 = xL1(),
    po4 = SG(),
    Zo = j2(),
    PEQ = "AWS_EC2_METADATA_DISABLED",
    lo4 = TuA(async (A) => {
      let {
        ENV_CMDS_FULL_URI: Q,
        ENV_CMDS_RELATIVE_URI: B,
        fromContainerMetadata: G,
        fromInstanceMetadata: Z
      } = await Promise.resolve().then(() => A6A(OV()));
      if (process.env[B] || process.env[Q]) {
        A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        let {
          fromHttp: I
        } = await Promise.resolve().then(() => A6A(fL1()));
        return (0, Zo.chain)(I(A), G(A))
      }
      if (process.env[PEQ] && process.env[PEQ] !== "false") return async () => {
        throw new Zo.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
          logger: A.logger
        })
      };
      return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Z(A)
    }, "remoteProvider"),
    jEQ = !1,
    io4 = TuA((A = {}) => (0, Zo.memoize)((0, Zo.chain)(async () => {
      if (A.profile ?? process.env[po4.ENV_PROFILE]) {
        if (process.env[eM1.ENV_KEY] && process.env[eM1.ENV_SECRET]) {
          if (!jEQ)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), jEQ = !0
        }
        throw new Zo.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
          logger: A.logger,
          tryNextLink: !0
        })
      }
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), (0, eM1.fromEnv)(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
      let {
        ssoStartUrl: Q,
        ssoAccountId: B,
        ssoRegion: G,
        ssoRoleName: Z,
        ssoSession: I
      } = A;
      if (!Q && !B && !G && !Z && !I) throw new Zo.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
        logger: A.logger
      });
      let {
        fromSSO: Y
      } = await Promise.resolve().then(() => A6A(GM1()));
      return Y(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
      let {
        fromIni: Q
      } = await Promise.resolve().then(() => A6A(TEQ()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
      let {
        fromProcess: Q
      } = await Promise.resolve().then(() => A6A(iM1()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
      let {
        fromTokenFile: Q
      } = await Promise.resolve().then(() => A6A(rM1()));
      return Q(A)()
    }, async () => {
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await lo4(A))()
    }, async () => {
      throw new Zo.CredentialsProviderError("Could not load credentials from any providers", {
        tryNextLink: !1,
        logger: A.logger
      })
    }), yEQ, kEQ), "defaultProvider"),
    kEQ = TuA((A) => A?.expiration !== void 0, "credentialsWillNeedRefresh"),
    yEQ = TuA((A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000, "credentialsTreatedAsExpired")
})
// @from(Start 3252504, End 3258679)
tEQ = z((rEQ) => {
  Object.defineProperty(rEQ, "__esModule", {
    value: !0
  });
  rEQ.ruleSet = void 0;
  var iEQ = "required",
    NH = "fn",
    LH = "argv",
    B6A = "ref",
    bEQ = !0,
    fEQ = "isSet",
    aHA = "booleanEquals",
    Q6A = "error",
    vS = "endpoint",
    ev = "tree",
    AO1 = "PartitionResult",
    QO1 = "getAttr",
    iHA = "stringEquals",
    hEQ = {
      [iEQ]: !1,
      type: "String"
    },
    gEQ = {
      [iEQ]: !0,
      default: !1,
      type: "Boolean"
    },
    uEQ = {
      [B6A]: "Endpoint"
    },
    nEQ = {
      [NH]: aHA,
      [LH]: [{
        [B6A]: "UseFIPS"
      }, !0]
    },
    aEQ = {
      [NH]: aHA,
      [LH]: [{
        [B6A]: "UseDualStack"
      }, !0]
    },
    _X = {},
    nHA = {
      [B6A]: "Region"
    },
    mEQ = {
      [NH]: QO1,
      [LH]: [{
        [B6A]: AO1
      }, "supportsFIPS"]
    },
    sEQ = {
      [B6A]: AO1
    },
    dEQ = {
      [NH]: aHA,
      [LH]: [!0, {
        [NH]: QO1,
        [LH]: [sEQ, "supportsDualStack"]
      }]
    },
    cEQ = [nEQ],
    pEQ = [aEQ],
    lEQ = [nHA],
    no4 = {
      version: "1.0",
      parameters: {
        Region: hEQ,
        UseDualStack: gEQ,
        UseFIPS: gEQ,
        Endpoint: hEQ
      },
      rules: [{
        conditions: [{
          [NH]: fEQ,
          [LH]: [uEQ]
        }],
        rules: [{
          conditions: cEQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: Q6A
        }, {
          conditions: pEQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: Q6A
        }, {
          endpoint: {
            url: uEQ,
            properties: _X,
            headers: _X
          },
          type: vS
        }],
        type: ev
      }, {
        conditions: [{
          [NH]: fEQ,
          [LH]: lEQ
        }],
        rules: [{
          conditions: [{
            [NH]: "aws.partition",
            [LH]: lEQ,
            assign: AO1
          }],
          rules: [{
            conditions: [nEQ, aEQ],
            rules: [{
              conditions: [{
                [NH]: aHA,
                [LH]: [bEQ, mEQ]
              }, dEQ],
              rules: [{
                conditions: [{
                  [NH]: iHA,
                  [LH]: [nHA, "us-east-1"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }, {
                conditions: [{
                  [NH]: iHA,
                  [LH]: [nHA, "us-east-2"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }, {
                conditions: [{
                  [NH]: iHA,
                  [LH]: [nHA, "us-west-1"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }, {
                conditions: [{
                  [NH]: iHA,
                  [LH]: [nHA, "us-west-2"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }, {
                endpoint: {
                  url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }],
              type: ev
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: Q6A
            }],
            type: ev
          }, {
            conditions: cEQ,
            rules: [{
              conditions: [{
                [NH]: aHA,
                [LH]: [mEQ, bEQ]
              }],
              rules: [{
                endpoint: {
                  url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }],
              type: ev
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: Q6A
            }],
            type: ev
          }, {
            conditions: pEQ,
            rules: [{
              conditions: [dEQ],
              rules: [{
                conditions: [{
                  [NH]: iHA,
                  [LH]: ["aws", {
                    [NH]: QO1,
                    [LH]: [sEQ, "name"]
                  }]
                }],
                endpoint: {
                  url: "https://cognito-identity.{Region}.amazonaws.com",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }, {
                endpoint: {
                  url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: _X,
                  headers: _X
                },
                type: vS
              }],
              type: ev
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: Q6A
            }],
            type: ev
          }, {
            endpoint: {
              url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
              properties: _X,
              headers: _X
            },
            type: vS
          }],
          type: ev
        }],
        type: ev
      }, {
        error: "Invalid Configuration: Missing Region",
        type: Q6A
      }]
    };
  rEQ.ruleSet = no4
})
// @from(Start 3258685, End 3259249)
QzQ = z((eEQ) => {
  Object.defineProperty(eEQ, "__esModule", {
    value: !0
  });
  eEQ.defaultEndpointResolver = void 0;
  var ao4 = S8A(),
    BO1 = FI(),
    so4 = tEQ(),
    ro4 = new BO1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    oo4 = (A, Q = {}) => {
      return ro4.get(A, () => (0, BO1.resolveEndpoint)(so4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  eEQ.defaultEndpointResolver = oo4;
  BO1.customEndpointFunctions.aws = ao4.awsEndpointFunctions
})
// @from(Start 3259255, End 3260689)
YzQ = z((ZzQ) => {
  Object.defineProperty(ZzQ, "__esModule", {
    value: !0
  });
  ZzQ.getRuntimeConfig = void 0;
  var to4 = TF(),
    eo4 = iB(),
    At4 = r6(),
    Qt4 = NJ(),
    BzQ = Pd(),
    GzQ = O2(),
    Bt4 = yL1(),
    Gt4 = QzQ(),
    Zt4 = (A) => {
      return {
        apiVersion: "2014-06-30",
        base64Decoder: A?.base64Decoder ?? BzQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? BzQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Gt4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Bt4.defaultCognitoIdentityHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new to4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new eo4.NoAuthSigner
        }],
        logger: A?.logger ?? new At4.NoOpLogger,
        serviceId: A?.serviceId ?? "Cognito Identity",
        urlParser: A?.urlParser ?? Qt4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? GzQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? GzQ.toUtf8
      }
    };
  ZzQ.getRuntimeConfig = Zt4
})
// @from(Start 3260695, End 3263099)
DzQ = z((FzQ) => {
  Object.defineProperty(FzQ, "__esModule", {
    value: !0
  });
  FzQ.getRuntimeConfig = void 0;
  var It4 = rr(),
    Yt4 = It4.__importDefault(CFQ()),
    JzQ = TF(),
    Jt4 = vEQ(),
    WzQ = kHA(),
    PuA = f8(),
    Wt4 = RX(),
    XzQ = D6(),
    Io = uI(),
    VzQ = IZ(),
    Xt4 = TX(),
    Vt4 = KW(),
    Ft4 = YzQ(),
    Kt4 = r6(),
    Dt4 = PX(),
    Ht4 = r6(),
    Ct4 = (A) => {
      (0, Ht4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, Dt4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Kt4.loadConfigsForDefaultMode),
        G = (0, Ft4.getRuntimeConfig)(A);
      (0, JzQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Io.loadConfig)(JzQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? Xt4.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? Jt4.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, WzQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Yt4.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, Io.loadConfig)(XzQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Io.loadConfig)(PuA.NODE_REGION_CONFIG_OPTIONS, {
          ...PuA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: VzQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Io.loadConfig)({
          ...XzQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || Vt4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Wt4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? VzQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Io.loadConfig)(PuA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Io.loadConfig)(PuA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Io.loadConfig)(WzQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  FzQ.getRuntimeConfig = Ct4
})