
// @from(Ln 95624, Col 4)
_rA = U((OrA) => {
  var TwA = Bf1(),
    PwA = YC(),
    cyQ = yT(),
    pyQ = Gf1(),
    Yn = WX(),
    Kf1 = Rq(),
    gC6 = vT(),
    Zu = class A extends PwA.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    lyQ = class A extends Zu {
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
    iyQ = class A extends Zu {
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
    nyQ = class A extends Zu {
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
    ayQ = class A extends Zu {
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
    oyQ = class A extends Zu {
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
    ryQ = class A extends Zu {
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
    syQ = class A extends Zu {
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
    uC6 = "Arn",
    mC6 = "AccessKeyId",
    dC6 = "AssumeRole",
    cC6 = "AssumedRoleId",
    pC6 = "AssumeRoleRequest",
    lC6 = "AssumeRoleResponse",
    Vf1 = "AssumedRoleUser",
    iC6 = "AssumeRoleWithWebIdentity",
    nC6 = "AssumeRoleWithWebIdentityRequest",
    aC6 = "AssumeRoleWithWebIdentityResponse",
    oC6 = "Audience",
    Ff1 = "Credentials",
    rC6 = "ContextAssertion",
    tyQ = "DurationSeconds",
    sC6 = "Expiration",
    tC6 = "ExternalId",
    eC6 = "ExpiredTokenException",
    AU6 = "IDPCommunicationErrorException",
    QU6 = "IDPRejectedClaimException",
    BU6 = "InvalidIdentityTokenException",
    GU6 = "Key",
    ZU6 = "MalformedPolicyDocumentException",
    eyQ = "Policy",
    AvQ = "PolicyArns",
    YU6 = "ProviderArn",
    JU6 = "ProvidedContexts",
    XU6 = "ProvidedContextsListType",
    IU6 = "ProvidedContext",
    DU6 = "PolicyDescriptorType",
    WU6 = "ProviderId",
    QvQ = "PackedPolicySize",
    KU6 = "PackedPolicyTooLargeException",
    VU6 = "Provider",
    BvQ = "RoleArn",
    FU6 = "RegionDisabledException",
    GvQ = "RoleSessionName",
    HU6 = "SecretAccessKey",
    EU6 = "SubjectFromWebIdentityToken",
    Hf1 = "SourceIdentity",
    zU6 = "SerialNumber",
    $U6 = "SessionToken",
    CU6 = "Tags",
    UU6 = "TokenCode",
    qU6 = "TransitiveTagKeys",
    NU6 = "Tag",
    wU6 = "Value",
    LU6 = "WebIdentityToken",
    OU6 = "arn",
    MU6 = "accessKeySecretType",
    w0A = "awsQueryError",
    L0A = "client",
    RU6 = "clientTokenType",
    O0A = "error",
    M0A = "httpError",
    R0A = "message",
    _U6 = "policyDescriptorListType",
    ZvQ = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
    jU6 = "tagListType",
    RG = "com.amazonaws.sts",
    TU6 = [0, RG, MU6, 8, 0],
    PU6 = [0, RG, RU6, 8, 0],
    YvQ = [3, RG, Vf1, 0, [cC6, uC6],
      [0, 0]
    ],
    SU6 = [3, RG, pC6, 0, [BvQ, GvQ, AvQ, eyQ, tyQ, CU6, qU6, tC6, zU6, UU6, Hf1, JU6],
      [0, 0, () => XvQ, 0, 1, () => nU6, 64, 0, 0, 0, 0, () => iU6]
    ],
    xU6 = [3, RG, lC6, 0, [Ff1, Vf1, QvQ, Hf1],
      [
        [() => JvQ, 0], () => YvQ, 1, 0
      ]
    ],
    yU6 = [3, RG, nC6, 0, [BvQ, GvQ, LU6, WU6, AvQ, eyQ, tyQ],
      [0, 0, [() => PU6, 0], 0, () => XvQ, 0, 1]
    ],
    vU6 = [3, RG, aC6, 0, [Ff1, EU6, Vf1, QvQ, VU6, oC6, Hf1],
      [
        [() => JvQ, 0], 0, () => YvQ, 1, 0, 0, 0
      ]
    ],
    JvQ = [3, RG, Ff1, 0, [mC6, HU6, $U6, sC6],
      [0, [() => TU6, 0], 0, 4]
    ],
    kU6 = [-3, RG, eC6, {
        [O0A]: L0A,
        [M0A]: 400,
        [w0A]: ["ExpiredTokenException", 400]
      },
      [R0A],
      [0]
    ];
  Yn.TypeRegistry.for(RG).registerError(kU6, lyQ);
  var bU6 = [-3, RG, AU6, {
      [O0A]: L0A,
      [M0A]: 400,
      [w0A]: ["IDPCommunicationError", 400]
    },
    [R0A],
    [0]
  ];
  Yn.TypeRegistry.for(RG).registerError(bU6, syQ);
  var fU6 = [-3, RG, QU6, {
      [O0A]: L0A,
      [M0A]: 403,
      [w0A]: ["IDPRejectedClaim", 403]
    },
    [R0A],
    [0]
  ];
  Yn.TypeRegistry.for(RG).registerError(fU6, oyQ);
  var hU6 = [-3, RG, BU6, {
      [O0A]: L0A,
      [M0A]: 400,
      [w0A]: ["InvalidIdentityToken", 400]
    },
    [R0A],
    [0]
  ];
  Yn.TypeRegistry.for(RG).registerError(hU6, ryQ);
  var gU6 = [-3, RG, ZU6, {
      [O0A]: L0A,
      [M0A]: 400,
      [w0A]: ["MalformedPolicyDocument", 400]
    },
    [R0A],
    [0]
  ];
  Yn.TypeRegistry.for(RG).registerError(gU6, iyQ);
  var uU6 = [-3, RG, KU6, {
      [O0A]: L0A,
      [M0A]: 400,
      [w0A]: ["PackedPolicyTooLarge", 400]
    },
    [R0A],
    [0]
  ];
  Yn.TypeRegistry.for(RG).registerError(uU6, nyQ);
  var mU6 = [3, RG, DU6, 0, [OU6],
      [0]
    ],
    dU6 = [3, RG, IU6, 0, [YU6, rC6],
      [0, 0]
    ],
    cU6 = [-3, RG, FU6, {
        [O0A]: L0A,
        [M0A]: 403,
        [w0A]: ["RegionDisabledException", 403]
      },
      [R0A],
      [0]
    ];
  Yn.TypeRegistry.for(RG).registerError(cU6, ayQ);
  var pU6 = [3, RG, NU6, 0, [GU6, wU6],
      [0, 0]
    ],
    lU6 = [-3, ZvQ, "STSServiceException", 0, [],
      []
    ];
  Yn.TypeRegistry.for(ZvQ).registerError(lU6, Zu);
  var XvQ = [1, RG, _U6, 0, () => mU6],
    iU6 = [1, RG, XU6, 0, () => dU6],
    nU6 = [1, RG, jU6, 0, () => pU6],
    aU6 = [9, RG, dC6, 0, () => SU6, () => xU6],
    oU6 = [9, RG, iC6, 0, () => yU6, () => vU6];
  class MrA extends PwA.Command.classBuilder().ep(pyQ.commonParams).m(function (A, Q, B, G) {
    return [cyQ.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(aU6).build() {}
  class RrA extends PwA.Command.classBuilder().ep(pyQ.commonParams).m(function (A, Q, B, G) {
    return [cyQ.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(oU6).build() {}
  var rU6 = {
    AssumeRoleCommand: MrA,
    AssumeRoleWithWebIdentityCommand: RrA
  };
  class Ef1 extends TwA.STSClient {}
  PwA.createAggregatedClient(rU6, Ef1);
  var IvQ = (A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    },
    DvQ = async (A, Q, B, G = {}) => {
      let Z = typeof A === "function" ? await A() : A,
        Y = typeof Q === "function" ? await Q() : Q,
        J = await gC6.stsRegionDefaultResolver(G)();
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${Z} (credential provider clientConfig)`, `${Y} (contextual client)`, `${J} (STS default: AWS_REGION, profile region, or us-east-1)`), Z ?? Y ?? J
    }, sU6 = (A, Q) => {
      let B, G;
      return async (Z, Y) => {
        if (G = Z, !B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            profile: K = A?.parentClientConfig?.profile,
            region: V,
            requestHandler: F = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: H,
            userAgentAppId: E = A?.parentClientConfig?.userAgentAppId
          } = A, z = await DvQ(V, A?.parentClientConfig?.region, H, {
            logger: W,
            profile: K
          }), $ = !WvQ(F);
          B = new Q({
            ...A,
            userAgentAppId: E,
            profile: K,
            credentialDefaultProvider: () => async () => G,
            region: z,
            requestHandler: $ ? F : void 0,
            logger: W
          })
        }
        let {
          Credentials: J,
          AssumedRoleUser: X
        } = await B.send(new MrA(Y));
        if (!J || !J.AccessKeyId || !J.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${Y.RoleArn}`);
        let I = IvQ(X),
          D = {
            accessKeyId: J.AccessKeyId,
            secretAccessKey: J.SecretAccessKey,
            sessionToken: J.SessionToken,
            expiration: J.Expiration,
            ...J.CredentialScope && {
              credentialScope: J.CredentialScope
            },
            ...I && {
              accountId: I
            }
          };
        return Kf1.setCredentialFeature(D, "CREDENTIALS_STS_ASSUME_ROLE", "i"), D
      }
    }, tU6 = (A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: I = A?.parentClientConfig?.logger,
            profile: D = A?.parentClientConfig?.profile,
            region: W,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: V,
            userAgentAppId: F = A?.parentClientConfig?.userAgentAppId
          } = A, H = await DvQ(W, A?.parentClientConfig?.region, V, {
            logger: I,
            profile: D
          }), E = !WvQ(K);
          B = new Q({
            ...A,
            userAgentAppId: F,
            profile: D,
            region: H,
            requestHandler: E ? K : void 0,
            logger: I
          })
        }
        let {
          Credentials: Z,
          AssumedRoleUser: Y
        } = await B.send(new RrA(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let J = IvQ(Y),
          X = {
            accessKeyId: Z.AccessKeyId,
            secretAccessKey: Z.SecretAccessKey,
            sessionToken: Z.SessionToken,
            expiration: Z.Expiration,
            ...Z.CredentialScope && {
              credentialScope: Z.CredentialScope
            },
            ...J && {
              accountId: J
            }
          };
        if (J) Kf1.setCredentialFeature(X, "RESOLVED_ACCOUNT_ID", "T");
        return Kf1.setCredentialFeature(X, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), X
      }
    }, WvQ = (A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, KvQ = (A, Q) => {
      if (!Q) return A;
      else return class extends A {
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, VvQ = (A = {}, Q) => sU6(A, KvQ(TwA.STSClient, Q)), FvQ = (A = {}, Q) => tU6(A, KvQ(TwA.STSClient, Q)), eU6 = (A) => (Q) => A({
      roleAssumer: VvQ(Q),
      roleAssumerWithWebIdentity: FvQ(Q),
      ...Q
    });
  Object.defineProperty(OrA, "$Command", {
    enumerable: !0,
    get: function () {
      return PwA.Command
    }
  });
  OrA.AssumeRoleCommand = MrA;
  OrA.AssumeRoleWithWebIdentityCommand = RrA;
  OrA.ExpiredTokenException = lyQ;
  OrA.IDPCommunicationErrorException = syQ;
  OrA.IDPRejectedClaimException = oyQ;
  OrA.InvalidIdentityTokenException = ryQ;
  OrA.MalformedPolicyDocumentException = iyQ;
  OrA.PackedPolicyTooLargeException = nyQ;
  OrA.RegionDisabledException = ayQ;
  OrA.STS = Ef1;
  OrA.STSServiceException = Zu;
  OrA.decorateDefaultCredentialProvider = eU6;
  OrA.getDefaultRoleAssumer = VvQ;
  OrA.getDefaultRoleAssumerWithWebIdentity = FvQ;
  Object.keys(TwA).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OrA, A)) Object.defineProperty(OrA, A, {
      enumerable: !0,
      get: function () {
        return TwA[A]
      }
    })
  })
})
// @from(Ln 96044, Col 4)
jrA = U((qq6) => {
  var $f1 = Cv(),
    zf1 = PW(),
    Hq6 = NA("child_process"),
    Eq6 = NA("util"),
    zq6 = Rq(),
    $q6 = (A, Q, B) => {
      if (Q.Version !== 1) throw Error(`Profile ${A} credential_process did not return Version 1.`);
      if (Q.AccessKeyId === void 0 || Q.SecretAccessKey === void 0) throw Error(`Profile ${A} credential_process returned invalid credentials.`);
      if (Q.Expiration) {
        let Y = new Date;
        if (new Date(Q.Expiration) < Y) throw Error(`Profile ${A} credential_process returned expired credentials.`)
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
      return zq6.setCredentialFeature(Z, "CREDENTIALS_PROCESS", "w"), Z
    },
    Cq6 = async (A, Q, B) => {
      let G = Q[A];
      if (Q[A]) {
        let Z = G.credential_process;
        if (Z !== void 0) {
          let Y = Eq6.promisify($f1.externalDataInterceptor?.getTokenRecord?.().exec ?? Hq6.exec);
          try {
            let {
              stdout: J
            } = await Y(Z), X;
            try {
              X = JSON.parse(J.trim())
            } catch {
              throw Error(`Profile ${A} credential_process returned invalid JSON.`)
            }
            return $q6(A, X, Q)
          } catch (J) {
            throw new zf1.CredentialsProviderError(J.message, {
              logger: B
            })
          }
        } else throw new zf1.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
          logger: B
        })
      } else throw new zf1.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
        logger: B
      })
    }, Uq6 = (A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      let B = await $f1.parseKnownFiles(A);
      return Cq6($f1.getProfileName({
        profile: A.profile ?? Q?.profile
      }), B, A.logger)
    };
  qq6.fromProcess = Uq6
})
// @from(Ln 96115, Col 4)
Cf1 = U((Lv) => {
  var wq6 = Lv && Lv.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Lq6 = Lv && Lv.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    Oq6 = Lv && Lv.__importStar || function () {
      var A = function (Q) {
        return A = Object.getOwnPropertyNames || function (B) {
          var G = [];
          for (var Z in B)
            if (Object.prototype.hasOwnProperty.call(B, Z)) G[G.length] = Z;
          return G
        }, A(Q)
      };
      return function (Q) {
        if (Q && Q.__esModule) return Q;
        var B = {};
        if (Q != null) {
          for (var G = A(Q), Z = 0; Z < G.length; Z++)
            if (G[Z] !== "default") wq6(B, Q, G[Z])
        }
        return Lq6(B, Q), B
      }
    }();
  Object.defineProperty(Lv, "__esModule", {
    value: !0
  });
  Lv.fromWebToken = void 0;
  var Mq6 = (A) => async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
    let {
      roleArn: B,
      roleSessionName: G,
      webIdentityToken: Z,
      providerId: Y,
      policyArns: J,
      policy: X,
      durationSeconds: I
    } = A, {
      roleAssumerWithWebIdentity: D
    } = A;
    if (!D) {
      let {
        getDefaultRoleAssumerWithWebIdentity: W
      } = await Promise.resolve().then(() => Oq6(_rA()));
      D = W({
        ...A.clientConfig,
        credentialProviderLogger: A.logger,
        parentClientConfig: {
          ...Q?.callerClientConfig,
          ...A.parentClientConfig
        }
      }, A.clientPlugins)
    }
    return D({
      RoleArn: B,
      RoleSessionName: G ?? `aws-sdk-js-session-${Date.now()}`,
      WebIdentityToken: Z,
      ProviderId: Y,
      PolicyArns: J,
      Policy: X,
      DurationSeconds: I
    })
  };
  Lv.fromWebToken = Mq6
})
// @from(Ln 96199, Col 4)
$vQ = U((EvQ) => {
  Object.defineProperty(EvQ, "__esModule", {
    value: !0
  });
  EvQ.fromTokenFile = void 0;
  var Rq6 = Rq(),
    _q6 = PW(),
    jq6 = Cv(),
    Tq6 = NA("fs"),
    Pq6 = Cf1(),
    HvQ = "AWS_WEB_IDENTITY_TOKEN_FILE",
    Sq6 = "AWS_ROLE_ARN",
    xq6 = "AWS_ROLE_SESSION_NAME",
    yq6 = (A = {}) => async (Q) => {
      A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      let B = A?.webIdentityTokenFile ?? process.env[HvQ],
        G = A?.roleArn ?? process.env[Sq6],
        Z = A?.roleSessionName ?? process.env[xq6];
      if (!B || !G) throw new _q6.CredentialsProviderError("Web identity configuration not specified", {
        logger: A.logger
      });
      let Y = await (0, Pq6.fromWebToken)({
        ...A,
        webIdentityToken: jq6.externalDataInterceptor?.getTokenRecord?.()[B] ?? (0, Tq6.readFileSync)(B, {
          encoding: "ascii"
        }),
        roleArn: G,
        roleSessionName: Z
      })(Q);
      if (B === process.env[HvQ])(0, Rq6.setCredentialFeature)(Y, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      return Y
    };
  EvQ.fromTokenFile = yq6
})
// @from(Ln 96233, Col 4)
xwA = U((SwA) => {
  var CvQ = $vQ(),
    UvQ = Cf1();
  Object.keys(CvQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(SwA, A)) Object.defineProperty(SwA, A, {
      enumerable: !0,
      get: function () {
        return CvQ[A]
      }
    })
  });
  Object.keys(UvQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(SwA, A)) Object.defineProperty(SwA, A, {
      enumerable: !0,
      get: function () {
        return UvQ[A]
      }
    })
  })
})
// @from(Ln 96253, Col 4)
Nf1 = U((oq6) => {
  var qf1 = Cv(),
    ywA = PW(),
    Yu = Rq(),
    vq6 = eb1(),
    kq6 = (A, Q, B) => {
      let G = {
        EcsContainer: async (Z) => {
          let {
            fromHttp: Y
          } = await Promise.resolve().then(() => c(goA())), {
            fromContainerMetadata: J
          } = await Promise.resolve().then(() => c(H0A()));
          return B?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => ywA.chain(Y(Z ?? {}), J(Z))().then(Uf1)
        },
        Ec2InstanceMetadata: async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
          let {
            fromInstanceMetadata: Y
          } = await Promise.resolve().then(() => c(H0A()));
          return async () => Y(Z)().then(Uf1)
        },
        Environment: async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
          let {
            fromEnv: Y
          } = await Promise.resolve().then(() => c(koA()));
          return async () => Y(Z)().then(Uf1)
        }
      };
      if (A in G) return G[A];
      else throw new ywA.CredentialsProviderError(`Unsupported credential source in profile ${Q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
        logger: B
      })
    },
    Uf1 = (A) => Yu.setCredentialFeature(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"),
    bq6 = (A, {
      profile: Q = "default",
      logger: B
    } = {}) => {
      return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (fq6(A, {
        profile: Q,
        logger: B
      }) || hq6(A, {
        profile: Q,
        logger: B
      }))
    },
    fq6 = (A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.source_profile === "string" && typeof A.credential_source > "u";
      if (G) B?.debug?.(`    ${Q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
      return G
    },
    hq6 = (A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.credential_source === "string" && typeof A.source_profile > "u";
      if (G) B?.debug?.(`    ${Q} isCredentialSourceProfile credential_source=${A.credential_source}`);
      return G
    },
    gq6 = async (A, Q, B, G = {}, Z) => {
      B.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
      let Y = Q[A],
        {
          source_profile: J,
          region: X
        } = Y;
      if (!B.roleAssumer) {
        let {
          getDefaultRoleAssumer: D
        } = await Promise.resolve().then(() => c(_rA()));
        B.roleAssumer = D({
          ...B.clientConfig,
          credentialProviderLogger: B.logger,
          parentClientConfig: {
            ...B?.parentClientConfig,
            region: X ?? B?.parentClientConfig?.region
          }
        }, B.clientPlugins)
      }
      if (J && J in G) throw new ywA.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${qf1.getProfileName(B)}. Profiles visited: ` + Object.keys(G).join(", "), {
        logger: B.logger
      });
      B.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${J?`source_profile=[${J}]`:`profile=[${A}]`}`);
      let I = J ? Z(J, Q, B, {
        ...G,
        [J]: !0
      }, qvQ(Q[J] ?? {})) : (await kq6(Y.credential_source, A, B.logger)(B))();
      if (qvQ(Y)) return I.then((D) => Yu.setCredentialFeature(D, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
      else {
        let D = {
            RoleArn: Y.role_arn,
            RoleSessionName: Y.role_session_name || `aws-sdk-js-${Date.now()}`,
            ExternalId: Y.external_id,
            DurationSeconds: parseInt(Y.duration_seconds || "3600", 10)
          },
          {
            mfa_serial: W
          } = Y;
        if (W) {
          if (!B.mfaCodeProvider) throw new ywA.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
            logger: B.logger,
            tryNextLink: !1
          });
          D.SerialNumber = W, D.TokenCode = await B.mfaCodeProvider(W)
        }
        let K = await I;
        return B.roleAssumer(K, D).then((V) => Yu.setCredentialFeature(V, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
      }
    }, qvQ = (A) => {
      return !A.role_arn && !!A.credential_source
    }, uq6 = (A) => {
      return Boolean(A && A.login_session)
    }, mq6 = async (A, Q) => {
      let B = await vq6.fromLoginCredentials({
        ...Q,
        profile: A
      })();
      return Yu.setCredentialFeature(B, "CREDENTIALS_PROFILE_LOGIN", "AC")
    }, dq6 = (A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", cq6 = async (A, Q) => Promise.resolve().then(() => c(jrA())).then(({
      fromProcess: B
    }) => B({
      ...A,
      profile: Q
    })().then((G) => Yu.setCredentialFeature(G, "CREDENTIALS_PROFILE_PROCESS", "v"))), pq6 = async (A, Q, B = {}) => {
      let {
        fromSSO: G
      } = await Promise.resolve().then(() => c(HrA()));
      return G({
        profile: A,
        logger: B.logger,
        parentClientConfig: B.parentClientConfig,
        clientConfig: B.clientConfig
      })().then((Z) => {
        if (Q.sso_session) return Yu.setCredentialFeature(Z, "CREDENTIALS_PROFILE_SSO", "r");
        else return Yu.setCredentialFeature(Z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
      })
    }, lq6 = (A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), NvQ = (A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, wvQ = async (A, Q) => {
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
      return Yu.setCredentialFeature(B, "CREDENTIALS_PROFILE", "n")
    }, iq6 = (A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, nq6 = async (A, Q) => Promise.resolve().then(() => c(xwA())).then(({
      fromTokenFile: B
    }) => B({
      webIdentityTokenFile: A.web_identity_token_file,
      roleArn: A.role_arn,
      roleSessionName: A.role_session_name,
      roleAssumerWithWebIdentity: Q.roleAssumerWithWebIdentity,
      logger: Q.logger,
      parentClientConfig: Q.parentClientConfig
    })().then((G) => Yu.setCredentialFeature(G, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), LvQ = async (A, Q, B, G = {}, Z = !1) => {
      let Y = Q[A];
      if (Object.keys(G).length > 0 && NvQ(Y)) return wvQ(Y, B);
      if (Z || bq6(Y, {
          profile: A,
          logger: B.logger
        })) return gq6(A, Q, B, G, LvQ);
      if (NvQ(Y)) return wvQ(Y, B);
      if (iq6(Y)) return nq6(Y, B);
      if (dq6(Y)) return cq6(B, A);
      if (lq6(Y)) return await pq6(A, Y, B);
      if (uq6(Y)) return mq6(A, B);
      throw new ywA.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
        logger: B.logger
      })
    }, aq6 = (A = {}) => async ({
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
      let G = await qf1.parseKnownFiles(B);
      return LvQ(qf1.getProfileName({
        profile: A.profile ?? Q?.profile
      }), G, B)
    };
  oq6.fromIni = aq6
})
// @from(Ln 96450, Col 4)
_0A = U((GN6) => {
  var wf1 = koA(),
    vwA = PW(),
    sq6 = Cv(),
    OvQ = "AWS_EC2_METADATA_DISABLED",
    tq6 = async (A) => {
      let {
        ENV_CMDS_FULL_URI: Q,
        ENV_CMDS_RELATIVE_URI: B,
        fromContainerMetadata: G,
        fromInstanceMetadata: Z
      } = await Promise.resolve().then(() => c(H0A()));
      if (process.env[B] || process.env[Q]) {
        A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        let {
          fromHttp: Y
        } = await Promise.resolve().then(() => c(goA()));
        return vwA.chain(Y(A), G(A))
      }
      if (process.env[OvQ] && process.env[OvQ] !== "false") return async () => {
        throw new vwA.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
          logger: A.logger
        })
      };
      return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Z(A)
    };

  function eq6(A, Q) {
    let B = AN6(A),
      G, Z, Y, J = async (X) => {
        if (X?.forceRefresh) return await B(X);
        if (Y?.expiration) {
          if (Y?.expiration?.getTime() < Date.now()) Y = void 0
        }
        if (G) await G;
        else if (!Y || Q?.(Y))
          if (Y) {
            if (!Z) Z = B(X).then((I) => {
              Y = I, Z = void 0
            })
          } else return G = B(X).then((I) => {
            Y = I, G = void 0
          }), J(X);
        return Y
      };
    return J
  }
  var AN6 = (A) => async (Q) => {
    let B;
    for (let G of A) try {
      return await G(Q)
    } catch (Z) {
      if (B = Z, Z?.tryNextLink) continue;
      throw Z
    }
    throw B
  }, MvQ = !1, QN6 = (A = {}) => eq6([async () => {
    if (A.profile ?? process.env[sq6.ENV_PROFILE]) {
      if (process.env[wf1.ENV_KEY] && process.env[wf1.ENV_SECRET]) {
        if (!MvQ)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn.bind(A.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), MvQ = !0
      }
      throw new vwA.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
        logger: A.logger,
        tryNextLink: !0
      })
    }
    return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), wf1.fromEnv(A)()
  }, async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
    let {
      ssoStartUrl: B,
      ssoAccountId: G,
      ssoRegion: Z,
      ssoRoleName: Y,
      ssoSession: J
    } = A;
    if (!B && !G && !Z && !Y && !J) throw new vwA.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
      logger: A.logger
    });
    let {
      fromSSO: X
    } = await Promise.resolve().then(() => c(HrA()));
    return X(A)(Q)
  }, async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
    let {
      fromIni: B
    } = await Promise.resolve().then(() => c(Nf1()));
    return B(A)(Q)
  }, async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
    let {
      fromProcess: B
    } = await Promise.resolve().then(() => c(jrA()));
    return B(A)(Q)
  }, async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
    let {
      fromTokenFile: B
    } = await Promise.resolve().then(() => c(xwA()));
    return B(A)(Q)
  }, async () => {
    return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await tq6(A))()
  }, async () => {
    throw new vwA.CredentialsProviderError("Could not load credentials from any providers", {
      tryNextLink: !1,
      logger: A.logger
    })
  }], RvQ), BN6 = (A) => A?.expiration !== void 0, RvQ = (A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000;
  GN6.credentialsTreatedAsExpired = RvQ;
  GN6.credentialsWillNeedRefresh = BN6;
  GN6.defaultProvider = QN6
})
// @from(Ln 96571, Col 4)
_vQ = U((IN6) => {
  var XN6 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  IN6.isArrayBuffer = XN6
})
// @from(Ln 96575, Col 4)
Of1 = U((FN6) => {
  var WN6 = _vQ(),
    Lf1 = NA("buffer"),
    KN6 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!WN6.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Lf1.Buffer.from(A, Q, B)
    },
    VN6 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Lf1.Buffer.from(A, Q) : Lf1.Buffer.from(A)
    };
  FN6.fromArrayBuffer = KN6;
  FN6.fromString = VN6
})
// @from(Ln 96589, Col 4)
PvQ = U((jvQ) => {
  Object.defineProperty(jvQ, "__esModule", {
    value: !0
  });
  jvQ.fromBase64 = void 0;
  var zN6 = Of1(),
    $N6 = /^[A-Za-z0-9+/]*={0,2}$/,
    CN6 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!$N6.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, zN6.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  jvQ.fromBase64 = CN6
})
// @from(Ln 96604, Col 4)
yvQ = U((SvQ) => {
  Object.defineProperty(SvQ, "__esModule", {
    value: !0
  });
  SvQ.toBase64 = void 0;
  var UN6 = Of1(),
    qN6 = oG(),
    NN6 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, qN6.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, UN6.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  SvQ.toBase64 = NN6
})
// @from(Ln 96620, Col 4)
bvQ = U((kwA) => {
  var vvQ = PvQ(),
    kvQ = yvQ();
  Object.keys(vvQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(kwA, A)) Object.defineProperty(kwA, A, {
      enumerable: !0,
      get: function () {
        return vvQ[A]
      }
    })
  });
  Object.keys(kvQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(kwA, A)) Object.defineProperty(kwA, A, {
      enumerable: !0,
      get: function () {
        return kvQ[A]
      }
    })
  })
})
// @from(Ln 96640, Col 4)
tvQ = U((rvQ) => {
  Object.defineProperty(rvQ, "__esModule", {
    value: !0
  });
  rvQ.ruleSet = void 0;
  var nvQ = "required",
    Mv = "fn",
    Rv = "argv",
    yYA = "ref",
    fvQ = !0,
    hvQ = "isSet",
    fwA = "booleanEquals",
    xYA = "error",
    bwA = "endpoint",
    XC = "tree",
    Mf1 = "PartitionResult",
    gvQ = {
      [nvQ]: !1,
      type: "string"
    },
    uvQ = {
      [nvQ]: !0,
      default: !1,
      type: "boolean"
    },
    mvQ = {
      [yYA]: "Endpoint"
    },
    avQ = {
      [Mv]: fwA,
      [Rv]: [{
        [yYA]: "UseFIPS"
      }, !0]
    },
    ovQ = {
      [Mv]: fwA,
      [Rv]: [{
        [yYA]: "UseDualStack"
      }, !0]
    },
    Ov = {},
    dvQ = {
      [Mv]: "getAttr",
      [Rv]: [{
        [yYA]: Mf1
      }, "supportsFIPS"]
    },
    cvQ = {
      [Mv]: fwA,
      [Rv]: [!0, {
        [Mv]: "getAttr",
        [Rv]: [{
          [yYA]: Mf1
        }, "supportsDualStack"]
      }]
    },
    pvQ = [avQ],
    lvQ = [ovQ],
    ivQ = [{
      [yYA]: "Region"
    }],
    wN6 = {
      version: "1.0",
      parameters: {
        Region: gvQ,
        UseDualStack: uvQ,
        UseFIPS: uvQ,
        Endpoint: gvQ
      },
      rules: [{
        conditions: [{
          [Mv]: hvQ,
          [Rv]: [mvQ]
        }],
        rules: [{
          conditions: pvQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: xYA
        }, {
          rules: [{
            conditions: lvQ,
            error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
            type: xYA
          }, {
            endpoint: {
              url: mvQ,
              properties: Ov,
              headers: Ov
            },
            type: bwA
          }],
          type: XC
        }],
        type: XC
      }, {
        rules: [{
          conditions: [{
            [Mv]: hvQ,
            [Rv]: ivQ
          }],
          rules: [{
            conditions: [{
              [Mv]: "aws.partition",
              [Rv]: ivQ,
              assign: Mf1
            }],
            rules: [{
              conditions: [avQ, ovQ],
              rules: [{
                conditions: [{
                  [Mv]: fwA,
                  [Rv]: [fvQ, dvQ]
                }, cvQ],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: Ov,
                      headers: Ov
                    },
                    type: bwA
                  }],
                  type: XC
                }],
                type: XC
              }, {
                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                type: xYA
              }],
              type: XC
            }, {
              conditions: pvQ,
              rules: [{
                conditions: [{
                  [Mv]: fwA,
                  [Rv]: [dvQ, fvQ]
                }],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-fips.{Region}.{PartitionResult#dnsSuffix}",
                      properties: Ov,
                      headers: Ov
                    },
                    type: bwA
                  }],
                  type: XC
                }],
                type: XC
              }, {
                error: "FIPS is enabled but this partition does not support FIPS",
                type: xYA
              }],
              type: XC
            }, {
              conditions: lvQ,
              rules: [{
                conditions: [cvQ],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: Ov,
                      headers: Ov
                    },
                    type: bwA
                  }],
                  type: XC
                }],
                type: XC
              }, {
                error: "DualStack is enabled but this partition does not support DualStack",
                type: xYA
              }],
              type: XC
            }, {
              rules: [{
                endpoint: {
                  url: "https://bedrock.{Region}.{PartitionResult#dnsSuffix}",
                  properties: Ov,
                  headers: Ov
                },
                type: bwA
              }],
              type: XC
            }],
            type: XC
          }],
          type: XC
        }, {
          error: "Invalid Configuration: Missing Region",
          type: xYA
        }],
        type: XC
      }]
    };
  rvQ.ruleSet = wN6
})
// @from(Ln 96838, Col 4)
QkQ = U((evQ) => {
  Object.defineProperty(evQ, "__esModule", {
    value: !0
  });
  evQ.defaultEndpointResolver = void 0;
  var LN6 = Hv(),
    Rf1 = xT(),
    ON6 = tvQ(),
    MN6 = new Rf1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    RN6 = (A, Q = {}) => {
      return MN6.get(A, () => (0, Rf1.resolveEndpoint)(ON6.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  evQ.defaultEndpointResolver = RN6;
  Rf1.customEndpointFunctions.aws = LN6.awsEndpointFunctions
})
// @from(Ln 96859, Col 4)
JkQ = U((ZkQ) => {
  Object.defineProperty(ZkQ, "__esModule", {
    value: !0
  });
  ZkQ.getRuntimeConfig = void 0;
  var _N6 = hY(),
    jN6 = eg(),
    TN6 = rG(),
    PN6 = DwA(),
    SN6 = oM(),
    BkQ = bvQ(),
    GkQ = oG(),
    xN6 = av1(),
    yN6 = QkQ(),
    vN6 = (A) => {
      return {
        apiVersion: "2023-04-20",
        base64Decoder: A?.base64Decoder ?? BkQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? BkQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? yN6.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? xN6.defaultBedrockHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new _N6.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#httpBearerAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#httpBearerAuth"),
          signer: new TN6.HttpBearerAuthSigner
        }],
        logger: A?.logger ?? new PN6.NoOpLogger,
        protocol: A?.protocol ?? new jN6.AwsRestJsonProtocol({
          defaultNamespace: "com.amazonaws.bedrock"
        }),
        serviceId: A?.serviceId ?? "Bedrock",
        urlParser: A?.urlParser ?? SN6.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? GkQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? GkQ.toUtf8
      }
    };
  ZkQ.getRuntimeConfig = vN6
})
// @from(Ln 96903, Col 4)
FkQ = U((KkQ) => {
  Object.defineProperty(KkQ, "__esModule", {
    value: !0
  });
  KkQ.getRuntimeConfig = void 0;
  var kN6 = LZ(),
    bN6 = kN6.__importDefault(nRQ()),
    _f1 = hY(),
    fN6 = _0A(),
    XkQ = ooA(),
    IkQ = og(),
    TrA = RD(),
    hN6 = rG(),
    gN6 = rg(),
    DkQ = RH(),
    j0A = _q(),
    WkQ = XL(),
    uN6 = sg(),
    mN6 = Uv(),
    dN6 = JkQ(),
    cN6 = DwA(),
    pN6 = Qu(),
    lN6 = DwA(),
    iN6 = (A) => {
      (0, lN6.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, pN6.resolveDefaultsModeConfig)(A),
        B = () => Q().then(cN6.loadConfigsForDefaultMode),
        G = (0, dN6.getRuntimeConfig)(A);
      (0, _f1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger,
        signingName: "bedrock"
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, j0A.loadConfig)(_f1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? uN6.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? fN6.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, IkQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: bN6.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Y) => Y.getIdentityProvider("aws.auth#sigv4"),
          signer: new _f1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#httpBearerAuth",
          identityProvider: (Y) => Y.getIdentityProvider("smithy.api#httpBearerAuth") || (async (J) => {
            try {
              return await (0, XkQ.fromEnvSigningName)({
                signingName: "bedrock"
              })()
            } catch (X) {
              return await (0, XkQ.nodeProvider)(J)(J)
            }
          }),
          signer: new hN6.HttpBearerAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, j0A.loadConfig)(DkQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, j0A.loadConfig)(TrA.NODE_REGION_CONFIG_OPTIONS, {
          ...TrA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: WkQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, j0A.loadConfig)({
          ...DkQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || mN6.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? gN6.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? WkQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, j0A.loadConfig)(TrA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, j0A.loadConfig)(TrA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, j0A.loadConfig)(IkQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  KkQ.getRuntimeConfig = iN6
})
// @from(Ln 96985, Col 4)
$kQ = U((tN6) => {
  var nN6 = gv1(),
    aN6 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    oN6 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class HkQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = nN6.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class EkQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
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
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class PrA {
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
      let Q = new PrA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = rN6(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return PrA.clone(this)
    }
  }

  function rN6(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class zkQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function sN6(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  tN6.Field = HkQ;
  tN6.Fields = EkQ;
  tN6.HttpRequest = PrA;
  tN6.HttpResponse = zkQ;
  tN6.getHttpHandlerExtensionConfiguration = aN6;
  tN6.isValidHostname = sN6;
  tN6.resolveHttpHandlerRuntimeConfig = oN6
})