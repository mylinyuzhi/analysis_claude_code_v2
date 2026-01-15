
// @from(Ln 126248, Col 4)
g0B = U((f0B) => {
  Object.defineProperty(f0B, "__esModule", {
    value: !0
  });
  f0B.getRuntimeConfig = void 0;
  var LP3 = LZ(),
    OP3 = LP3.__importDefault(s1B()),
    y0B = hY(),
    MP3 = _0A(),
    v0B = og(),
    LA1 = RD(),
    RP3 = rg(),
    k0B = RH(),
    wQA = _q(),
    b0B = XL(),
    _P3 = sg(),
    jP3 = Uv(),
    TP3 = x0B(),
    PP3 = yOA(),
    SP3 = Qu(),
    xP3 = yOA(),
    yP3 = (A) => {
      (0, xP3.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, SP3.resolveDefaultsModeConfig)(A),
        B = () => Q().then(PP3.loadConfigsForDefaultMode),
        G = (0, TP3.getRuntimeConfig)(A);
      (0, y0B.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, wQA.loadConfig)(y0B.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? _P3.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? MP3.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, v0B.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: OP3.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, wQA.loadConfig)(k0B.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, wQA.loadConfig)(LA1.NODE_REGION_CONFIG_OPTIONS, {
          ...LA1.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: b0B.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, wQA.loadConfig)({
          ...k0B.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || jP3.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? RP3.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? b0B.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, wQA.loadConfig)(LA1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, wQA.loadConfig)(LA1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, wQA.loadConfig)(v0B.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  f0B.getRuntimeConfig = yP3
})
// @from(Ln 126310, Col 4)
c0B = U((gP3) => {
  var vP3 = dl1(),
    kP3 = (A) => {
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
    bP3 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class u0B {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = vP3.FieldPosition.HEADER,
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
  class m0B {
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
  class OA1 {
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
      let Q = new OA1({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = fP3(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return OA1.clone(this)
    }
  }

  function fP3(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class d0B {
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

  function hP3(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  gP3.Field = u0B;
  gP3.Fields = m0B;
  gP3.HttpRequest = OA1;
  gP3.HttpResponse = d0B;
  gP3.getHttpHandlerExtensionConfiguration = kP3;
  gP3.isValidHostname = hP3;
  gP3.resolveHttpHandlerRuntimeConfig = bP3
})
// @from(Ln 126452, Col 4)
MQB = U((Ti1) => {
  var p0B = bg(),
    nP3 = fg(),
    aP3 = hg(),
    l0B = $v(),
    oP3 = RD(),
    MA1 = rG(),
    _L = WX(),
    rP3 = ag(),
    zX = yT(),
    i0B = RH(),
    TG = yOA(),
    n0B = rl1(),
    sP3 = g0B(),
    a0B = vT(),
    o0B = c0B(),
    tP3 = (A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "cognito-identity"
      })
    },
    GI = {
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
    eP3 = (A) => {
      let {
        httpAuthSchemes: Q,
        httpAuthSchemeProvider: B,
        credentials: G
      } = A;
      return {
        setHttpAuthScheme(Z) {
          let Y = Q.findIndex((J) => J.schemeId === Z.schemeId);
          if (Y === -1) Q.push(Z);
          else Q.splice(Y, 1, Z)
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
    },
    AS3 = (A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    },
    QS3 = (A, Q) => {
      let B = Object.assign(a0B.getAwsRegionExtensionConfiguration(A), TG.getDefaultExtensionConfiguration(A), o0B.getHttpHandlerExtensionConfiguration(A), eP3(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, a0B.resolveAwsRegionExtensionConfiguration(B), TG.resolveDefaultRuntimeConfig(B), o0B.resolveHttpHandlerRuntimeConfig(B), AS3(B))
    };
  class _A1 extends TG.Client {
    config;
    constructor(...[A]) {
      let Q = sP3.getRuntimeConfig(A || {});
      super(Q);
      this.initConfig = Q;
      let B = tP3(Q),
        G = l0B.resolveUserAgentConfig(B),
        Z = i0B.resolveRetryConfig(G),
        Y = oP3.resolveRegionConfig(Z),
        J = p0B.resolveHostHeaderConfig(Y),
        X = zX.resolveEndpointConfig(J),
        I = n0B.resolveHttpAuthSchemeConfig(X),
        D = QS3(I, A?.extensions || []);
      this.config = D, this.middlewareStack.use(_L.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(l0B.getUserAgentPlugin(this.config)), this.middlewareStack.use(i0B.getRetryPlugin(this.config)), this.middlewareStack.use(rP3.getContentLengthPlugin(this.config)), this.middlewareStack.use(p0B.getHostHeaderPlugin(this.config)), this.middlewareStack.use(nP3.getLoggerPlugin(this.config)), this.middlewareStack.use(aP3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(MA1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: n0B.defaultCognitoIdentityHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (W) => new MA1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": W.credentials
        })
      })), this.middlewareStack.use(MA1.getHttpSigningPlugin(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  var jL = class A extends TG.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    r0B = class A extends jL {
      name = "InternalErrorException";
      $fault = "server";
      constructor(Q) {
        super({
          name: "InternalErrorException",
          $fault: "server",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    s0B = class A extends jL {
      name = "InvalidParameterException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidParameterException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    t0B = class A extends jL {
      name = "LimitExceededException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "LimitExceededException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    e0B = class A extends jL {
      name = "NotAuthorizedException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "NotAuthorizedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    AQB = class A extends jL {
      name = "ResourceConflictException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ResourceConflictException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    QQB = class A extends jL {
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
    BQB = class A extends jL {
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
    GQB = class A extends jL {
      name = "ExternalServiceException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ExternalServiceException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ZQB = class A extends jL {
      name = "InvalidIdentityPoolConfigurationException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidIdentityPoolConfigurationException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    YQB = class A extends jL {
      name = "DeveloperUserAlreadyRegisteredException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "DeveloperUserAlreadyRegisteredException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    JQB = class A extends jL {
      name = "ConcurrentModificationException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ConcurrentModificationException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    XQB = "AllowClassicFlow",
    BS3 = "AccountId",
    GS3 = "AccessKeyId",
    ZS3 = "AmbiguousRoleResolution",
    IQB = "AllowUnauthenticatedIdentities",
    DQB = "Credentials",
    YS3 = "CreationDate",
    JS3 = "ClientId",
    XS3 = "CognitoIdentityProvider",
    IS3 = "CreateIdentityPoolInput",
    DS3 = "CognitoIdentityProviderList",
    WQB = "CognitoIdentityProviders",
    WS3 = "CreateIdentityPool",
    KS3 = "ConcurrentModificationException",
    VS3 = "CustomRoleArn",
    FS3 = "Claim",
    HS3 = "DeleteIdentities",
    ES3 = "DeleteIdentitiesInput",
    zS3 = "DescribeIdentityInput",
    $S3 = "DeleteIdentityPool",
    CS3 = "DeleteIdentityPoolInput",
    US3 = "DescribeIdentityPoolInput",
    qS3 = "DescribeIdentityPool",
    NS3 = "DeleteIdentitiesResponse",
    wS3 = "DescribeIdentity",
    jA1 = "DeveloperProviderName",
    LS3 = "DeveloperUserAlreadyRegisteredException",
    KQB = "DeveloperUserIdentifier",
    OS3 = "DeveloperUserIdentifierList",
    MS3 = "DestinationUserIdentifier",
    RS3 = "Expiration",
    _S3 = "ErrorCode",
    jS3 = "ExternalServiceException",
    TS3 = "GetCredentialsForIdentity",
    PS3 = "GetCredentialsForIdentityInput",
    SS3 = "GetCredentialsForIdentityResponse",
    xS3 = "GetId",
    yS3 = "GetIdInput",
    vS3 = "GetIdentityPoolRoles",
    kS3 = "GetIdentityPoolRolesInput",
    bS3 = "GetIdentityPoolRolesResponse",
    fS3 = "GetIdResponse",
    hS3 = "GetOpenIdToken",
    gS3 = "GetOpenIdTokenForDeveloperIdentity",
    uS3 = "GetOpenIdTokenForDeveloperIdentityInput",
    mS3 = "GetOpenIdTokenForDeveloperIdentityResponse",
    dS3 = "GetOpenIdTokenInput",
    cS3 = "GetOpenIdTokenResponse",
    pS3 = "GetPrincipalTagAttributeMap",
    lS3 = "GetPrincipalTagAttributeMapInput",
    iS3 = "GetPrincipalTagAttributeMapResponse",
    nS3 = "HideDisabled",
    aS3 = "Identities",
    oS3 = "IdentityDescription",
    rS3 = "InternalErrorException",
    VC = "IdentityId",
    sS3 = "InvalidIdentityPoolConfigurationException",
    tS3 = "IdentityIdsToDelete",
    eS3 = "IdentitiesList",
    Ax3 = "IdentityPool",
    Qx3 = "InvalidParameterException",
    GF = "IdentityPoolId",
    Bx3 = "IdentityPoolsList",
    Bi1 = "IdentityPoolName",
    TA1 = "IdentityProviderName",
    Gx3 = "IdentityPoolShortDescription",
    Zx3 = "IdentityProviderToken",
    VQB = "IdentityPoolTags",
    Yx3 = "IdentityPools",
    YXA = "Logins",
    Jx3 = "LookupDeveloperIdentity",
    Xx3 = "LookupDeveloperIdentityInput",
    Ix3 = "LookupDeveloperIdentityResponse",
    Dx3 = "LimitExceededException",
    Wx3 = "ListIdentities",
    Kx3 = "ListIdentitiesInput",
    Vx3 = "ListIdentityPools",
    Fx3 = "ListIdentityPoolsInput",
    Hx3 = "ListIdentityPoolsResponse",
    Ex3 = "ListIdentitiesResponse",
    zx3 = "LoginsMap",
    $x3 = "LastModifiedDate",
    Cx3 = "ListTagsForResource",
    Ux3 = "ListTagsForResourceInput",
    qx3 = "ListTagsForResourceResponse",
    Nx3 = "LoginsToRemove",
    wx3 = "MergeDeveloperIdentities",
    Lx3 = "MergeDeveloperIdentitiesInput",
    Ox3 = "MergeDeveloperIdentitiesResponse",
    Gi1 = "MaxResults",
    Mx3 = "MappingRulesList",
    Rx3 = "MappingRule",
    _x3 = "MatchType",
    jx3 = "NotAuthorizedException",
    JXA = "NextToken",
    FQB = "OpenIdConnectProviderARNs",
    Tx3 = "OIDCToken",
    Px3 = "ProviderName",
    PA1 = "PrincipalTags",
    HQB = "Roles",
    Zi1 = "ResourceArn",
    Sx3 = "RoleARN",
    xx3 = "RulesConfiguration",
    yx3 = "ResourceConflictException",
    vx3 = "RulesConfigurationType",
    EQB = "RoleMappings",
    kx3 = "RoleMappingMap",
    bx3 = "RoleMapping",
    fx3 = "ResourceNotFoundException",
    hx3 = "Rules",
    gx3 = "SetIdentityPoolRoles",
    ux3 = "SetIdentityPoolRolesInput",
    mx3 = "SecretKey",
    dx3 = "SecretKeyString",
    zQB = "SupportedLoginProviders",
    $QB = "SamlProviderARNs",
    cx3 = "SetPrincipalTagAttributeMap",
    px3 = "SetPrincipalTagAttributeMapInput",
    lx3 = "SetPrincipalTagAttributeMapResponse",
    ix3 = "ServerSideTokenCheck",
    nx3 = "SessionToken",
    ax3 = "SourceUserIdentifier",
    CQB = "Token",
    ox3 = "TokenDuration",
    rx3 = "TagKeys",
    sx3 = "TooManyRequestsException",
    tx3 = "TagResource",
    ex3 = "TagResourceInput",
    Ay3 = "TagResourceResponse",
    UQB = "Tags",
    Qy3 = "Type",
    Yi1 = "UseDefaults",
    By3 = "UnlinkDeveloperIdentity",
    Gy3 = "UnlinkDeveloperIdentityInput",
    Zy3 = "UnlinkIdentity",
    Yy3 = "UnprocessedIdentityIds",
    Jy3 = "UnprocessedIdentityIdList",
    Xy3 = "UnlinkIdentityInput",
    Iy3 = "UnprocessedIdentityId",
    Dy3 = "UpdateIdentityPool",
    Wy3 = "UntagResource",
    Ky3 = "UntagResourceInput",
    Vy3 = "UntagResourceResponse",
    Fy3 = "Value",
    Bk = "client",
    BP = "error",
    Gk = "httpError",
    GP = "message",
    Hy3 = "server",
    qQB = "smithy.ts.sdk.synthetic.com.amazonaws.cognitoidentity",
    aQ = "com.amazonaws.cognitoidentity",
    Ey3 = [0, aQ, Zx3, 8, 0],
    NQB = [0, aQ, Tx3, 8, 0],
    zy3 = [0, aQ, dx3, 8, 0],
    $y3 = [3, aQ, XS3, 0, [Px3, JS3, ix3],
      [0, 0, 2]
    ],
    Cy3 = [-3, aQ, KS3, {
        [BP]: Bk,
        [Gk]: 400
      },
      [GP],
      [0]
    ];
  _L.TypeRegistry.for(aQ).registerError(Cy3, JQB);
  var Uy3 = [3, aQ, IS3, 0, [Bi1, IQB, XQB, zQB, jA1, FQB, WQB, $QB, VQB],
      [0, 2, 2, 128, 0, 64, () => LQB, 64, 128]
    ],
    qy3 = [3, aQ, DQB, 0, [GS3, mx3, nx3, RS3],
      [0, [() => zy3, 0], 0, 4]
    ],
    Ny3 = [3, aQ, ES3, 0, [tS3],
      [64]
    ],
    wy3 = [3, aQ, NS3, 0, [Yy3],
      [() => wv3]
    ],
    Ly3 = [3, aQ, CS3, 0, [GF],
      [0]
    ],
    Oy3 = [3, aQ, zS3, 0, [VC],
      [0]
    ],
    My3 = [3, aQ, US3, 0, [GF],
      [0]
    ],
    Ry3 = [-3, aQ, LS3, {
        [BP]: Bk,
        [Gk]: 400
      },
      [GP],
      [0]
    ];
  _L.TypeRegistry.for(aQ).registerError(Ry3, YQB);
  var _y3 = [-3, aQ, jS3, {
      [BP]: Bk,
      [Gk]: 400
    },
    [GP],
    [0]
  ];
  _L.TypeRegistry.for(aQ).registerError(_y3, GQB);
  var jy3 = [3, aQ, PS3, 0, [VC, YXA, VS3],
      [0, [() => hOA, 0], 0]
    ],
    Ty3 = [3, aQ, SS3, 0, [VC, DQB],
      [0, [() => qy3, 0]]
    ],
    Py3 = [3, aQ, kS3, 0, [GF],
      [0]
    ],
    Sy3 = [3, aQ, bS3, 0, [GF, HQB, EQB],
      [0, 128, () => OQB]
    ],
    xy3 = [3, aQ, yS3, 0, [BS3, GF, YXA],
      [0, 0, [() => hOA, 0]]
    ],
    yy3 = [3, aQ, fS3, 0, [VC],
      [0]
    ],
    vy3 = [3, aQ, uS3, 0, [GF, VC, YXA, PA1, ox3],
      [0, 0, [() => hOA, 0], 128, 1]
    ],
    ky3 = [3, aQ, mS3, 0, [VC, CQB],
      [0, [() => NQB, 0]]
    ],
    by3 = [3, aQ, dS3, 0, [VC, YXA],
      [0, [() => hOA, 0]]
    ],
    fy3 = [3, aQ, cS3, 0, [VC, CQB],
      [0, [() => NQB, 0]]
    ],
    hy3 = [3, aQ, lS3, 0, [GF, TA1],
      [0, 0]
    ],
    gy3 = [3, aQ, iS3, 0, [GF, TA1, Yi1, PA1],
      [0, 0, 2, 128]
    ],
    wQB = [3, aQ, oS3, 0, [VC, YXA, YS3, $x3],
      [0, 64, 4, 4]
    ],
    RA1 = [3, aQ, Ax3, 0, [GF, Bi1, IQB, XQB, zQB, jA1, FQB, WQB, $QB, VQB],
      [0, 0, 2, 2, 128, 0, 64, () => LQB, 64, 128]
    ],
    uy3 = [3, aQ, Gx3, 0, [GF, Bi1],
      [0, 0]
    ],
    my3 = [-3, aQ, rS3, {
        [BP]: Hy3
      },
      [GP],
      [0]
    ];
  _L.TypeRegistry.for(aQ).registerError(my3, r0B);
  var dy3 = [-3, aQ, sS3, {
      [BP]: Bk,
      [Gk]: 400
    },
    [GP],
    [0]
  ];
  _L.TypeRegistry.for(aQ).registerError(dy3, ZQB);
  var cy3 = [-3, aQ, Qx3, {
      [BP]: Bk,
      [Gk]: 400
    },
    [GP],
    [0]
  ];
  _L.TypeRegistry.for(aQ).registerError(cy3, s0B);
  var py3 = [-3, aQ, Dx3, {
      [BP]: Bk,
      [Gk]: 400
    },
    [GP],
    [0]
  ];
  _L.TypeRegistry.for(aQ).registerError(py3, t0B);
  var ly3 = [3, aQ, Kx3, 0, [GF, Gi1, JXA, nS3],
      [0, 1, 0, 2]
    ],
    iy3 = [3, aQ, Ex3, 0, [GF, aS3, JXA],
      [0, () => Uv3, 0]
    ],
    ny3 = [3, aQ, Fx3, 0, [Gi1, JXA],
      [1, 0]
    ],
    ay3 = [3, aQ, Hx3, 0, [Yx3, JXA],
      [() => qv3, 0]
    ],
    oy3 = [3, aQ, Ux3, 0, [Zi1],
      [0]
    ],
    ry3 = [3, aQ, qx3, 0, [UQB],
      [128]
    ],
    sy3 = [3, aQ, Xx3, 0, [GF, VC, KQB, Gi1, JXA],
      [0, 0, 0, 1, 0]
    ],
    ty3 = [3, aQ, Ix3, 0, [VC, OS3, JXA],
      [0, 64, 0]
    ],
    ey3 = [3, aQ, Rx3, 0, [FS3, _x3, Fy3, Sx3],
      [0, 0, 0, 0]
    ],
    Av3 = [3, aQ, Lx3, 0, [ax3, MS3, jA1, GF],
      [0, 0, 0, 0]
    ],
    Qv3 = [3, aQ, Ox3, 0, [VC],
      [0]
    ],
    Bv3 = [-3, aQ, jx3, {
        [BP]: Bk,
        [Gk]: 403
      },
      [GP],
      [0]
    ];
  _L.TypeRegistry.for(aQ).registerError(Bv3, e0B);
  var Gv3 = [-3, aQ, yx3, {
      [BP]: Bk,
      [Gk]: 409
    },
    [GP],
    [0]
  ];
  _L.TypeRegistry.for(aQ).registerError(Gv3, AQB);
  var Zv3 = [-3, aQ, fx3, {
      [BP]: Bk,
      [Gk]: 404
    },
    [GP],
    [0]
  ];
  _L.TypeRegistry.for(aQ).registerError(Zv3, BQB);
  var Yv3 = [3, aQ, bx3, 0, [Qy3, ZS3, xx3],
      [0, 0, () => Jv3]
    ],
    Jv3 = [3, aQ, vx3, 0, [hx3],
      [() => Nv3]
    ],
    Xv3 = [3, aQ, ux3, 0, [GF, HQB, EQB],
      [0, 128, () => OQB]
    ],
    Iv3 = [3, aQ, px3, 0, [GF, TA1, Yi1, PA1],
      [0, 0, 2, 128]
    ],
    Dv3 = [3, aQ, lx3, 0, [GF, TA1, Yi1, PA1],
      [0, 0, 2, 128]
    ],
    Wv3 = [3, aQ, ex3, 0, [Zi1, UQB],
      [0, 128]
    ],
    Kv3 = [3, aQ, Ay3, 0, [],
      []
    ],
    Vv3 = [-3, aQ, sx3, {
        [BP]: Bk,
        [Gk]: 429
      },
      [GP],
      [0]
    ];
  _L.TypeRegistry.for(aQ).registerError(Vv3, QQB);
  var Fv3 = [3, aQ, Gy3, 0, [VC, GF, jA1, KQB],
      [0, 0, 0, 0]
    ],
    Hv3 = [3, aQ, Xy3, 0, [VC, YXA, Nx3],
      [0, [() => hOA, 0], 64]
    ],
    Ev3 = [3, aQ, Iy3, 0, [VC, _S3],
      [0, 0]
    ],
    zv3 = [3, aQ, Ky3, 0, [Zi1, rx3],
      [0, 64]
    ],
    $v3 = [3, aQ, Vy3, 0, [],
      []
    ],
    SA1 = "unit",
    Cv3 = [-3, qQB, "CognitoIdentityServiceException", 0, [],
      []
    ];
  _L.TypeRegistry.for(qQB).registerError(Cv3, jL);
  var LQB = [1, aQ, DS3, 0, () => $y3],
    Uv3 = [1, aQ, eS3, 0, () => wQB],
    qv3 = [1, aQ, Bx3, 0, () => uy3],
    Nv3 = [1, aQ, Mx3, 0, () => ey3],
    wv3 = [1, aQ, Jy3, 0, () => Ev3],
    hOA = [2, aQ, zx3, 0, [0, 0],
      [() => Ey3, 0]
    ],
    OQB = [2, aQ, kx3, 0, 0, () => Yv3],
    Lv3 = [9, aQ, WS3, 0, () => Uy3, () => RA1],
    Ov3 = [9, aQ, HS3, 0, () => Ny3, () => wy3],
    Mv3 = [9, aQ, $S3, 0, () => Ly3, () => SA1],
    Rv3 = [9, aQ, wS3, 0, () => Oy3, () => wQB],
    _v3 = [9, aQ, qS3, 0, () => My3, () => RA1],
    jv3 = [9, aQ, TS3, 0, () => jy3, () => Ty3],
    Tv3 = [9, aQ, xS3, 0, () => xy3, () => yy3],
    Pv3 = [9, aQ, vS3, 0, () => Py3, () => Sy3],
    Sv3 = [9, aQ, hS3, 0, () => by3, () => fy3],
    xv3 = [9, aQ, gS3, 0, () => vy3, () => ky3],
    yv3 = [9, aQ, pS3, 0, () => hy3, () => gy3],
    vv3 = [9, aQ, Wx3, 0, () => ly3, () => iy3],
    kv3 = [9, aQ, Vx3, 0, () => ny3, () => ay3],
    bv3 = [9, aQ, Cx3, 0, () => oy3, () => ry3],
    fv3 = [9, aQ, Jx3, 0, () => sy3, () => ty3],
    hv3 = [9, aQ, wx3, 0, () => Av3, () => Qv3],
    gv3 = [9, aQ, gx3, 0, () => Xv3, () => SA1],
    uv3 = [9, aQ, cx3, 0, () => Iv3, () => Dv3],
    mv3 = [9, aQ, tx3, 0, () => Wv3, () => Kv3],
    dv3 = [9, aQ, By3, 0, () => Fv3, () => SA1],
    cv3 = [9, aQ, Zy3, 0, () => Hv3, () => SA1],
    pv3 = [9, aQ, Wy3, 0, () => zv3, () => $v3],
    lv3 = [9, aQ, Dy3, 0, () => RA1, () => RA1];
  class Ji1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "CreateIdentityPool", {}).n("CognitoIdentityClient", "CreateIdentityPoolCommand").sc(Lv3).build() {}
  class Xi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "DeleteIdentities", {}).n("CognitoIdentityClient", "DeleteIdentitiesCommand").sc(Ov3).build() {}
  class Ii1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "DeleteIdentityPool", {}).n("CognitoIdentityClient", "DeleteIdentityPoolCommand").sc(Mv3).build() {}
  class Di1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "DescribeIdentity", {}).n("CognitoIdentityClient", "DescribeIdentityCommand").sc(Rv3).build() {}
  class Wi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "DescribeIdentityPool", {}).n("CognitoIdentityClient", "DescribeIdentityPoolCommand").sc(_v3).build() {}
  class Ki1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").sc(jv3).build() {}
  class Vi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").sc(Tv3).build() {}
  class Fi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "GetIdentityPoolRoles", {}).n("CognitoIdentityClient", "GetIdentityPoolRolesCommand").sc(Pv3).build() {}
  class Hi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "GetOpenIdToken", {}).n("CognitoIdentityClient", "GetOpenIdTokenCommand").sc(Sv3).build() {}
  class Ei1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "GetOpenIdTokenForDeveloperIdentity", {}).n("CognitoIdentityClient", "GetOpenIdTokenForDeveloperIdentityCommand").sc(xv3).build() {}
  class zi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "GetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "GetPrincipalTagAttributeMapCommand").sc(yv3).build() {}
  class $i1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "ListIdentities", {}).n("CognitoIdentityClient", "ListIdentitiesCommand").sc(vv3).build() {}
  class xA1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "ListIdentityPools", {}).n("CognitoIdentityClient", "ListIdentityPoolsCommand").sc(kv3).build() {}
  class Ci1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "ListTagsForResource", {}).n("CognitoIdentityClient", "ListTagsForResourceCommand").sc(bv3).build() {}
  class Ui1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "LookupDeveloperIdentity", {}).n("CognitoIdentityClient", "LookupDeveloperIdentityCommand").sc(fv3).build() {}
  class qi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "MergeDeveloperIdentities", {}).n("CognitoIdentityClient", "MergeDeveloperIdentitiesCommand").sc(hv3).build() {}
  class Ni1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "SetIdentityPoolRoles", {}).n("CognitoIdentityClient", "SetIdentityPoolRolesCommand").sc(gv3).build() {}
  class wi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "SetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "SetPrincipalTagAttributeMapCommand").sc(uv3).build() {}
  class Li1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "TagResource", {}).n("CognitoIdentityClient", "TagResourceCommand").sc(mv3).build() {}
  class Oi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "UnlinkDeveloperIdentity", {}).n("CognitoIdentityClient", "UnlinkDeveloperIdentityCommand").sc(dv3).build() {}
  class Mi1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "UnlinkIdentity", {}).n("CognitoIdentityClient", "UnlinkIdentityCommand").sc(cv3).build() {}
  class Ri1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "UntagResource", {}).n("CognitoIdentityClient", "UntagResourceCommand").sc(pv3).build() {}
  class _i1 extends TG.Command.classBuilder().ep(GI).m(function (A, Q, B, G) {
    return [zX.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSCognitoIdentityService", "UpdateIdentityPool", {}).n("CognitoIdentityClient", "UpdateIdentityPoolCommand").sc(lv3).build() {}
  var iv3 = {
    CreateIdentityPoolCommand: Ji1,
    DeleteIdentitiesCommand: Xi1,
    DeleteIdentityPoolCommand: Ii1,
    DescribeIdentityCommand: Di1,
    DescribeIdentityPoolCommand: Wi1,
    GetCredentialsForIdentityCommand: Ki1,
    GetIdCommand: Vi1,
    GetIdentityPoolRolesCommand: Fi1,
    GetOpenIdTokenCommand: Hi1,
    GetOpenIdTokenForDeveloperIdentityCommand: Ei1,
    GetPrincipalTagAttributeMapCommand: zi1,
    ListIdentitiesCommand: $i1,
    ListIdentityPoolsCommand: xA1,
    ListTagsForResourceCommand: Ci1,
    LookupDeveloperIdentityCommand: Ui1,
    MergeDeveloperIdentitiesCommand: qi1,
    SetIdentityPoolRolesCommand: Ni1,
    SetPrincipalTagAttributeMapCommand: wi1,
    TagResourceCommand: Li1,
    UnlinkDeveloperIdentityCommand: Oi1,
    UnlinkIdentityCommand: Mi1,
    UntagResourceCommand: Ri1,
    UpdateIdentityPoolCommand: _i1
  };
  class ji1 extends _A1 {}
  TG.createAggregatedClient(iv3, ji1);
  var nv3 = MA1.createPaginator(_A1, xA1, "NextToken", "NextToken", "MaxResults"),
    av3 = {
      AUTHENTICATED_ROLE: "AuthenticatedRole",
      DENY: "Deny"
    },
    ov3 = {
      ACCESS_DENIED: "AccessDenied",
      INTERNAL_SERVER_ERROR: "InternalServerError"
    },
    rv3 = {
      CONTAINS: "Contains",
      EQUALS: "Equals",
      NOT_EQUAL: "NotEqual",
      STARTS_WITH: "StartsWith"
    },
    sv3 = {
      RULES: "Rules",
      TOKEN: "Token"
    };
  Object.defineProperty(Ti1, "$Command", {
    enumerable: !0,
    get: function () {
      return TG.Command
    }
  });
  Object.defineProperty(Ti1, "__Client", {
    enumerable: !0,
    get: function () {
      return TG.Client
    }
  });
  Ti1.AmbiguousRoleResolutionType = av3;
  Ti1.CognitoIdentity = ji1;
  Ti1.CognitoIdentityClient = _A1;
  Ti1.CognitoIdentityServiceException = jL;
  Ti1.ConcurrentModificationException = JQB;
  Ti1.CreateIdentityPoolCommand = Ji1;
  Ti1.DeleteIdentitiesCommand = Xi1;
  Ti1.DeleteIdentityPoolCommand = Ii1;
  Ti1.DescribeIdentityCommand = Di1;
  Ti1.DescribeIdentityPoolCommand = Wi1;
  Ti1.DeveloperUserAlreadyRegisteredException = YQB;
  Ti1.ErrorCode = ov3;
  Ti1.ExternalServiceException = GQB;
  Ti1.GetCredentialsForIdentityCommand = Ki1;
  Ti1.GetIdCommand = Vi1;
  Ti1.GetIdentityPoolRolesCommand = Fi1;
  Ti1.GetOpenIdTokenCommand = Hi1;
  Ti1.GetOpenIdTokenForDeveloperIdentityCommand = Ei1;
  Ti1.GetPrincipalTagAttributeMapCommand = zi1;
  Ti1.InternalErrorException = r0B;
  Ti1.InvalidIdentityPoolConfigurationException = ZQB;
  Ti1.InvalidParameterException = s0B;
  Ti1.LimitExceededException = t0B;
  Ti1.ListIdentitiesCommand = $i1;
  Ti1.ListIdentityPoolsCommand = xA1;
  Ti1.ListTagsForResourceCommand = Ci1;
  Ti1.LookupDeveloperIdentityCommand = Ui1;
  Ti1.MappingRuleMatchType = rv3;
  Ti1.MergeDeveloperIdentitiesCommand = qi1;
  Ti1.NotAuthorizedException = e0B;
  Ti1.ResourceConflictException = AQB;
  Ti1.ResourceNotFoundException = BQB;
  Ti1.RoleMappingType = sv3;
  Ti1.SetIdentityPoolRolesCommand = Ni1;
  Ti1.SetPrincipalTagAttributeMapCommand = wi1;
  Ti1.TagResourceCommand = Li1;
  Ti1.TooManyRequestsException = QQB;
  Ti1.UnlinkDeveloperIdentityCommand = Oi1;
  Ti1.UnlinkIdentityCommand = Mi1;
  Ti1.UntagResourceCommand = Ri1;
  Ti1.UpdateIdentityPoolCommand = _i1;
  Ti1.paginateListIdentityPools = nv3
})
// @from(Ln 127282, Col 4)
Si1 = U((yA1) => {
  var Pi1 = MQB();
  Object.defineProperty(yA1, "CognitoIdentityClient", {
    enumerable: !0,
    get: function () {
      return Pi1.CognitoIdentityClient
    }
  });
  Object.defineProperty(yA1, "GetCredentialsForIdentityCommand", {
    enumerable: !0,
    get: function () {
      return Pi1.GetCredentialsForIdentityCommand
    }
  });
  Object.defineProperty(yA1, "GetIdCommand", {
    enumerable: !0,
    get: function () {
      return Pi1.GetIdCommand
    }
  })
})
// @from(Ln 127303, Col 4)
yi1 = U((nk3) => {
  var vA1 = PW();

  function RQB(A) {
    return Promise.all(Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      if (typeof G === "string") Q.push([B, G]);
      else Q.push(G().then((Z) => [B, Z]));
      return Q
    }, [])).then((Q) => Q.reduce((B, [G, Z]) => {
      return B[G] = Z, B
    }, {}))
  }

  function _QB(A) {
    return async (Q) => {
      A.logger?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
      let {
        GetCredentialsForIdentityCommand: B,
        CognitoIdentityClient: G
      } = await Promise.resolve().then(function () {
        return Si1()
      }), Z = (D) => A.clientConfig?.[D] ?? A.parentClientConfig?.[D] ?? Q?.callerClientConfig?.[D], {
        Credentials: {
          AccessKeyId: Y = uk3(A.logger),
          Expiration: J,
          SecretKey: X = dk3(A.logger),
          SessionToken: I
        } = mk3(A.logger)
      } = await (A.client ?? new G(Object.assign({}, A.clientConfig ?? {}, {
        region: Z("region"),
        profile: Z("profile"),
        userAgentAppId: Z("userAgentAppId")
      }))).send(new B({
        CustomRoleArn: A.customRoleArn,
        IdentityId: A.identityId,
        Logins: A.logins ? await RQB(A.logins) : void 0
      }));
      return {
        identityId: A.identityId,
        accessKeyId: Y,
        secretAccessKey: X,
        sessionToken: I,
        expiration: J
      }
    }
  }

  function uk3(A) {
    throw new vA1.CredentialsProviderError("Response from Amazon Cognito contained no access key ID", {
      logger: A
    })
  }

  function mk3(A) {
    throw new vA1.CredentialsProviderError("Response from Amazon Cognito contained no credentials", {
      logger: A
    })
  }

  function dk3(A) {
    throw new vA1.CredentialsProviderError("Response from Amazon Cognito contained no secret key", {
      logger: A
    })
  }
  var xi1 = "IdentityIds";
  class jQB {
    dbName;
    constructor(A = "aws:cognito-identity-ids") {
      this.dbName = A
    }
    getItem(A) {
      return this.withObjectStore("readonly", (Q) => {
        let B = Q.get(A);
        return new Promise((G) => {
          B.onerror = () => G(null), B.onsuccess = () => G(B.result ? B.result.value : null)
        })
      }).catch(() => null)
    }
    removeItem(A) {
      return this.withObjectStore("readwrite", (Q) => {
        let B = Q.delete(A);
        return new Promise((G, Z) => {
          B.onerror = () => Z(B.error), B.onsuccess = () => G()
        })
      })
    }
    setItem(A, Q) {
      return this.withObjectStore("readwrite", (B) => {
        let G = B.put({
          id: A,
          value: Q
        });
        return new Promise((Z, Y) => {
          G.onerror = () => Y(G.error), G.onsuccess = () => Z()
        })
      })
    }
    getDb() {
      let A = self.indexedDB.open(this.dbName, 1);
      return new Promise((Q, B) => {
        A.onsuccess = () => {
          Q(A.result)
        }, A.onerror = () => {
          B(A.error)
        }, A.onblocked = () => {
          B(Error("Unable to access DB"))
        }, A.onupgradeneeded = () => {
          let G = A.result;
          G.onerror = () => {
            B(Error("Failed to create object store"))
          }, G.createObjectStore(xi1, {
            keyPath: "id"
          })
        }
      })
    }
    withObjectStore(A, Q) {
      return this.getDb().then((B) => {
        let G = B.transaction(xi1, A);
        return G.oncomplete = () => B.close(), new Promise((Z, Y) => {
          G.onerror = () => Y(G.error), Z(Q(G.objectStore(xi1)))
        }).catch((Z) => {
          throw B.close(), Z
        })
      })
    }
  }
  class TQB {
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
    setItem(A, Q) {
      this.store[A] = Q
    }
  }
  var ck3 = new TQB;

  function pk3() {
    if (typeof self === "object" && self.indexedDB) return new jQB;
    if (typeof window === "object" && window.localStorage) return window.localStorage;
    return ck3
  }

  function lk3({
    accountId: A,
    cache: Q = pk3(),
    client: B,
    clientConfig: G,
    customRoleArn: Z,
    identityPoolId: Y,
    logins: J,
    userIdentifier: X = !J || Object.keys(J).length === 0 ? "ANONYMOUS" : void 0,
    logger: I,
    parentClientConfig: D
  }) {
    I?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
    let W = X ? `aws:cognito-identity-credentials:${Y}:${X}` : void 0,
      K = async (V) => {
        let {
          GetIdCommand: F,
          CognitoIdentityClient: H
        } = await Promise.resolve().then(function () {
          return Si1()
        }), E = (O) => G?.[O] ?? D?.[O] ?? V?.callerClientConfig?.[O], z = B ?? new H(Object.assign({}, G ?? {}, {
          region: E("region"),
          profile: E("profile"),
          userAgentAppId: E("userAgentAppId")
        })), $ = W && await Q.getItem(W);
        if (!$) {
          let {
            IdentityId: O = ik3(I)
          } = await z.send(new F({
            AccountId: A,
            IdentityPoolId: Y,
            Logins: J ? await RQB(J) : void 0
          }));
          if ($ = O, W) Promise.resolve(Q.setItem(W, $)).catch(() => {})
        }
        return K = _QB({
          client: z,
          customRoleArn: Z,
          logins: J,
          identityId: $
        }), K(V)
      };
    return (V) => K(V).catch(async (F) => {
      if (W) Promise.resolve(Q.removeItem(W)).catch(() => {});
      throw F
    })
  }

  function ik3(A) {
    throw new vA1.CredentialsProviderError("Response from Amazon Cognito contained no identity ID", {
      logger: A
    })
  }
  nk3.fromCognitoIdentity = _QB;
  nk3.fromCognitoIdentityPool = lk3
})
// @from(Ln 127511, Col 4)
xQB = U((PQB) => {
  Object.defineProperty(PQB, "__esModule", {
    value: !0
  });
  PQB.fromCognitoIdentity = void 0;
  var rk3 = yi1(),
    sk3 = (A) => (0, rk3.fromCognitoIdentity)({
      ...A
    });
  PQB.fromCognitoIdentity = sk3
})
// @from(Ln 127522, Col 4)
kQB = U((yQB) => {
  Object.defineProperty(yQB, "__esModule", {
    value: !0
  });
  yQB.fromCognitoIdentityPool = void 0;
  var tk3 = yi1(),
    ek3 = (A) => (0, tk3.fromCognitoIdentityPool)({
      ...A
    });
  yQB.fromCognitoIdentityPool = ek3
})
// @from(Ln 127533, Col 4)
hQB = U((bQB) => {
  Object.defineProperty(bQB, "__esModule", {
    value: !0
  });
  bQB.fromContainerMetadata = void 0;
  var Ab3 = H0A(),
    Qb3 = (A) => {
      return A?.logger?.debug("@smithy/credential-provider-imds", "fromContainerMetadata"), (0, Ab3.fromContainerMetadata)(A)
    };
  bQB.fromContainerMetadata = Qb3
})
// @from(Ln 127544, Col 4)
mQB = U((gQB) => {
  Object.defineProperty(gQB, "__esModule", {
    value: !0
  });
  gQB.fromEnv = void 0;
  var Bb3 = koA(),
    Gb3 = (A) => (0, Bb3.fromEnv)(A);
  gQB.fromEnv = Gb3
})
// @from(Ln 127553, Col 4)
pQB = U((dQB) => {
  Object.defineProperty(dQB, "__esModule", {
    value: !0
  });
  dQB.fromIni = void 0;
  var Zb3 = Nf1(),
    Yb3 = (A = {}) => (0, Zb3.fromIni)({
      ...A
    });
  dQB.fromIni = Yb3
})
// @from(Ln 127564, Col 4)
nQB = U((lQB) => {
  Object.defineProperty(lQB, "__esModule", {
    value: !0
  });
  lQB.fromInstanceMetadata = void 0;
  var Jb3 = Rq(),
    Xb3 = H0A(),
    Ib3 = (A) => {
      return A?.logger?.debug("@smithy/credential-provider-imds", "fromInstanceMetadata"), async () => (0, Xb3.fromInstanceMetadata)(A)().then((Q) => (0, Jb3.setCredentialFeature)(Q, "CREDENTIALS_IMDS", "0"))
    };
  lQB.fromInstanceMetadata = Ib3
})
// @from(Ln 127576, Col 4)
rQB = U((aQB) => {
  Object.defineProperty(aQB, "__esModule", {
    value: !0
  });
  aQB.fromLoginCredentials = void 0;
  var Db3 = eb1(),
    Wb3 = (A) => (0, Db3.fromLoginCredentials)({
      ...A
    });
  aQB.fromLoginCredentials = Wb3
})
// @from(Ln 127587, Col 4)
vi1 = U((sQB) => {
  Object.defineProperty(sQB, "__esModule", {
    value: !0
  });
  sQB.fromNodeProviderChain = void 0;
  var Kb3 = _0A(),
    Vb3 = (A = {}) => (0, Kb3.defaultProvider)({
      ...A
    });
  sQB.fromNodeProviderChain = Vb3
})
// @from(Ln 127598, Col 4)
QBB = U((eQB) => {
  Object.defineProperty(eQB, "__esModule", {
    value: !0
  });
  eQB.fromProcess = void 0;
  var Fb3 = jrA(),
    Hb3 = (A) => (0, Fb3.fromProcess)(A);
  eQB.fromProcess = Hb3
})
// @from(Ln 127607, Col 4)
ZBB = U((BBB) => {
  Object.defineProperty(BBB, "__esModule", {
    value: !0
  });
  BBB.fromSSO = void 0;
  var Eb3 = HrA(),
    zb3 = (A = {}) => {
      return (0, Eb3.fromSSO)({
        ...A
      })
    };
  BBB.fromSSO = zb3
})
// @from(Ln 127620, Col 4)
JBB = U((kA1) => {
  Object.defineProperty(kA1, "__esModule", {
    value: !0
  });
  kA1.STSClient = kA1.AssumeRoleCommand = void 0;
  var YBB = _rA();
  Object.defineProperty(kA1, "AssumeRoleCommand", {
    enumerable: !0,
    get: function () {
      return YBB.AssumeRoleCommand
    }
  });
  Object.defineProperty(kA1, "STSClient", {
    enumerable: !0,
    get: function () {
      return YBB.STSClient
    }
  })
})
// @from(Ln 127639, Col 4)
DBB = U((Zk) => {
  var Cb3 = Zk && Zk.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    Ub3 = Zk && Zk.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    qb3 = Zk && Zk.__importStar || function () {
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
            if (G[Z] !== "default") Cb3(B, Q, G[Z])
        }
        return Ub3(B, Q), B
      }
    }();
  Object.defineProperty(Zk, "__esModule", {
    value: !0
  });
  Zk.fromTemporaryCredentials = void 0;
  var Nb3 = rG(),
    XBB = PW(),
    wb3 = "us-east-1",
    Lb3 = (A, Q, B) => {
      let G;
      return async (Z = {}) => {
        let {
          callerClientConfig: Y
        } = Z, J = A.clientConfig?.profile ?? Y?.profile, X = A.logger ?? Y?.logger;
        X?.debug("@aws-sdk/credential-providers - fromTemporaryCredentials (STS)");
        let I = {
          ...A.params,
          RoleSessionName: A.params.RoleSessionName ?? "aws-sdk-js-" + Date.now()
        };
        if (I?.SerialNumber) {
          if (!A.mfaCodeProvider) throw new XBB.CredentialsProviderError("Temporary credential requires multi-factor authentication, but no MFA code callback was provided.", {
            tryNextLink: !1,
            logger: X
          });
          I.TokenCode = await A.mfaCodeProvider(I?.SerialNumber)
        }
        let {
          AssumeRoleCommand: D,
          STSClient: W
        } = await Promise.resolve().then(() => qb3(JBB()));
        if (!G) {
          let V = typeof Q === "function" ? Q() : void 0,
            F = [A.masterCredentials, A.clientConfig?.credentials, void Y?.credentials, Y?.credentialDefaultProvider?.(), V],
            H = "STS client default credentials";
          if (F[0]) H = "options.masterCredentials";
          else if (F[1]) H = "options.clientConfig.credentials";
          else if (F[2]) throw H = "caller client's credentials", Error("fromTemporaryCredentials recursion in callerClientConfig.credentials");
          else if (F[3]) H = "caller client's credentialDefaultProvider";
          else if (F[4]) H = "AWS SDK default credentials";
          let E = [A.clientConfig?.region, Y?.region, await B?.({
              profile: J
            }), wb3],
            z = "default partition's default region";
          if (E[0]) z = "options.clientConfig.region";
          else if (E[1]) z = "caller client's region";
          else if (E[2]) z = "file or env region";
          let $ = [IBB(A.clientConfig?.requestHandler), IBB(Y?.requestHandler)],
            O = "STS default requestHandler";
          if ($[0]) O = "options.clientConfig.requestHandler";
          else if ($[1]) O = "caller client's requestHandler";
          X?.debug?.(`@aws-sdk/credential-providers - fromTemporaryCredentials STS client init with ${z}=${await(0,Nb3.normalizeProvider)(bA1(E))()}, ${H}, ${O}.`), G = new W({
            userAgentAppId: Y?.userAgentAppId,
            ...A.clientConfig,
            credentials: bA1(F),
            logger: X,
            profile: J,
            region: bA1(E),
            requestHandler: bA1($)
          })
        }
        if (A.clientPlugins)
          for (let V of A.clientPlugins) G.middlewareStack.use(V);
        let {
          Credentials: K
        } = await G.send(new D(I));
        if (!K || !K.AccessKeyId || !K.SecretAccessKey) throw new XBB.CredentialsProviderError(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`, {
          logger: X
        });
        return {
          accessKeyId: K.AccessKeyId,
          secretAccessKey: K.SecretAccessKey,
          sessionToken: K.SessionToken,
          expiration: K.Expiration,
          credentialScope: K.CredentialScope
        }
      }
    };
  Zk.fromTemporaryCredentials = Lb3;
  var IBB = (A) => {
      return A?.metadata?.handlerProtocol === "h2" ? void 0 : A
    },
    bA1 = (A) => {
      for (let Q of A)
        if (Q !== void 0) return Q
    }
})
// @from(Ln 127766, Col 4)
VBB = U((WBB) => {
  Object.defineProperty(WBB, "__esModule", {
    value: !0
  });
  WBB.fromTemporaryCredentials = void 0;
  var Ob3 = RD(),
    Mb3 = _q(),
    Rb3 = vi1(),
    _b3 = DBB(),
    jb3 = (A) => {
      return (0, _b3.fromTemporaryCredentials)(A, Rb3.fromNodeProviderChain, async ({
        profile: Q = process.env.AWS_PROFILE
      }) => (0, Mb3.loadConfig)({
        environmentVariableSelector: (B) => B.AWS_REGION,
        configFileSelector: (B) => {
          return B.region
        },
        default: () => {
          return
        }
      }, {
        ...Ob3.NODE_REGION_CONFIG_FILE_OPTIONS,
        profile: Q
      })())
    };
  WBB.fromTemporaryCredentials = jb3
})
// @from(Ln 127793, Col 4)
EBB = U((FBB) => {
  Object.defineProperty(FBB, "__esModule", {
    value: !0
  });
  FBB.fromTokenFile = void 0;
  var Tb3 = xwA(),
    Pb3 = (A = {}) => (0, Tb3.fromTokenFile)({
      ...A
    });
  FBB.fromTokenFile = Pb3
})
// @from(Ln 127804, Col 4)
CBB = U((zBB) => {
  Object.defineProperty(zBB, "__esModule", {
    value: !0
  });
  zBB.fromWebToken = void 0;
  var Sb3 = xwA(),
    xb3 = (A) => (0, Sb3.fromWebToken)({
      ...A
    });
  zBB.fromWebToken = xb3
})
// @from(Ln 127815, Col 4)
ki1 = U((kH) => {
  Object.defineProperty(kH, "__esModule", {
    value: !0
  });
  kH.fromHttp = void 0;
  var pq = LZ();
  pq.__exportStar(b1B(), kH);
  pq.__exportStar(xQB(), kH);
  pq.__exportStar(kQB(), kH);
  pq.__exportStar(hQB(), kH);
  pq.__exportStar(mQB(), kH);
  var yb3 = goA();
  Object.defineProperty(kH, "fromHttp", {
    enumerable: !0,
    get: function () {
      return yb3.fromHttp
    }
  });
  pq.__exportStar(pQB(), kH);
  pq.__exportStar(nQB(), kH);
  pq.__exportStar(rQB(), kH);
  pq.__exportStar(vi1(), kH);
  pq.__exportStar(QBB(), kH);
  pq.__exportStar(ZBB(), kH);
  pq.__exportStar(VBB(), kH);
  pq.__exportStar(EBB(), kH);
  pq.__exportStar(CBB(), kH)
})
// @from(Ln 127844, Col 0)
function qBB(A) {
  return A?.name === "CredentialsProviderError"
}
// @from(Ln 127848, Col 0)
function NBB(A) {
  if (!A || typeof A !== "object") return !1;
  let Q = A;
  if (!Q.Credentials || typeof Q.Credentials !== "object") return !1;
  let B = Q.Credentials;
  return typeof B.AccessKeyId === "string" && typeof B.SecretAccessKey === "string" && typeof B.SessionToken === "string" && B.AccessKeyId.length > 0 && B.SecretAccessKey.length > 0 && B.SessionToken.length > 0
}
// @from(Ln 127855, Col 0)
async function wBB() {
  try {
    k("Clearing AWS credential provider cache"), await UBB.fromIni({
      ignoreCache: !0
    })(), k("AWS credential provider cache refreshed")
  } catch (A) {
    k("Failed to clear AWS credential cache (this is expected if no credentials are configured)")
  }
}
// @from(Ln 127864, Col 4)
fA1
// @from(Ln 127864, Col 9)
UBB
// @from(Ln 127864, Col 14)
bi1 = async () => {
  await new fA1.STSClient().send(new fA1.GetCallerIdentityCommand({}))
}
// @from(Ln 127867, Col 4)
fi1 = w(() => {
  T1();
  fA1 = c(v1B(), 1), UBB = c(ki1(), 1)
})
// @from(Ln 127871, Col 0)
async function LBB() {
  if (process.platform === "darwin") {
    let A = yi();
    if ((await e5(`security delete-generic-password -a $USER -s "${A}"`, {
        shell: !0,
        reject: !1
      })).exitCode !== 0) throw Error("Failed to delete keychain entry")
  }
}
// @from(Ln 127881, Col 0)
function TL(A) {
  return A.slice(-20)
}
// @from(Ln 127884, Col 4)
gOA = w(() => {
  GNA();
  Vq()
})
// @from(Ln 127888, Col 0)
class lq {
  static instance = null;
  status = {
    isAuthenticating: !1,
    output: []
  };
  listeners = new Set;
  static getInstance() {
    if (!lq.instance) lq.instance = new lq;
    return lq.instance
  }
  getStatus() {
    return {
      ...this.status,
      output: [...this.status.output]
    }
  }
  startAuthentication() {
    this.status = {
      isAuthenticating: !0,
      output: []
    }, this.notifyListeners()
  }
  addOutput(A) {
    this.status.output.push(A), this.notifyListeners()
  }
  setError(A) {
    this.status.error = A, this.notifyListeners()
  }
  endAuthentication(A) {
    if (A) this.status = {
      isAuthenticating: !1,
      output: []
    };
    else this.status.isAuthenticating = !1;
    this.notifyListeners()
  }
  subscribe(A) {
    return this.listeners.add(A), () => {
      this.listeners.delete(A)
    }
  }
  notifyListeners() {
    this.listeners.forEach((A) => A(this.getStatus()))
  }
  static reset() {
    if (lq.instance) lq.instance.listeners.clear(), lq.instance = null
  }
}
// @from(Ln 127941, Col 0)
function iq() {
  let A = a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY),
    B = (jQ() || {}).apiKeyHelper,
    G = process.env.ANTHROPIC_AUTH_TOKEN || B || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
    {
      source: Z
    } = Oz({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
  return !(A || G || (Z === "ANTHROPIC_API_KEY" || Z === "apiKeyHelper") && !a1(process.env.CLAUDE_CODE_REMOTE))
}
// @from(Ln 127953, Col 0)
function an() {
  if (process.env.ANTHROPIC_AUTH_TOKEN) return {
    source: "ANTHROPIC_AUTH_TOKEN",
    hasToken: !0
  };
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
    source: "CLAUDE_CODE_OAUTH_TOKEN",
    hasToken: !0
  };
  if (nT1()) return {
    source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
    hasToken: !0
  };
  if (uOA()) return {
    source: "apiKeyHelper",
    hasToken: !0
  };
  let B = g4();
  if (xg(B?.scopes) && B?.accessToken) return {
    source: "claude.ai",
    hasToken: !0
  };
  return {
    source: "none",
    hasToken: !1
  }
}
// @from(Ln 127981, Col 0)
function YL() {
  let {
    key: A
  } = Oz();
  return A
}
// @from(Ln 127988, Col 0)
function _BB() {
  let {
    key: A,
    source: Q
  } = Oz({
    skipRetrievingKeyFromApiKeyHelper: !0
  });
  return A !== null && Q !== "none"
}
// @from(Ln 127998, Col 0)
function Oz(A = {}) {
  if (eb0() && process.env.ANTHROPIC_API_KEY) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  if (a1(!1)) {
    let G = aT1();
    if (G) return {
      key: G,
      source: "ANTHROPIC_API_KEY"
    };
    if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    if (process.env.ANTHROPIC_API_KEY) return {
      key: process.env.ANTHROPIC_API_KEY,
      source: "ANTHROPIC_API_KEY"
    };
    return {
      key: null,
      source: "none"
    }
  }
  if (process.env.ANTHROPIC_API_KEY && L1().customApiKeyResponses?.approved?.includes(TL(process.env.ANTHROPIC_API_KEY))) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  let Q = aT1();
  if (Q) return {
    key: Q,
    source: "ANTHROPIC_API_KEY"
  };
  if (A.skipRetrievingKeyFromApiKeyHelper) {
    if (uOA()) return {
      key: null,
      source: "apiKeyHelper"
    }
  } else {
    let G = mOA(p2());
    if (G) return {
      key: G,
      source: "apiKeyHelper"
    }
  }
  let B = dOA();
  if (B) return B;
  return {
    key: null,
    source: "none"
  }
}
// @from(Ln 128048, Col 0)
function uOA() {
  return (jQ() || {}).apiKeyHelper
}
// @from(Ln 128052, Col 0)
function jBB() {
  let A = uOA();
  if (!A) return !1;
  let Q = dB("projectSettings"),
    B = dB("localSettings");
  return Q?.apiKeyHelper === A || B?.apiKeyHelper === A
}
// @from(Ln 128060, Col 0)
function hi1() {
  return (jQ() || {}).awsAuthRefresh
}
// @from(Ln 128064, Col 0)
function TBB() {
  let A = hi1();
  if (!A) return !1;
  let Q = dB("projectSettings"),
    B = dB("localSettings");
  return Q?.awsAuthRefresh === A || B?.awsAuthRefresh === A
}
// @from(Ln 128072, Col 0)
function gi1() {
  return (jQ() || {}).awsCredentialExport
}
// @from(Ln 128076, Col 0)
function PBB() {
  let A = gi1();
  if (!A) return !1;
  let Q = dB("projectSettings"),
    B = dB("localSettings");
  return Q?.awsCredentialExport === A || B?.awsCredentialExport === A
}
// @from(Ln 128084, Col 0)
function fb3() {
  let A = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!Number.isNaN(Q) && Q >= 0) return Q;
    k(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${A}`, {
      level: "error"
    })
  }
  return bb3
}
// @from(Ln 128096, Col 0)
function gA1() {
  mOA.cache.clear()
}
// @from(Ln 128100, Col 0)
function SBB(A) {
  if (uOA()) {
    if (jBB()) {
      if (!eZ(!0)) return
    }
  }
  mOA(A)
}
// @from(Ln 128108, Col 0)
async function gb3() {
  let A = hi1();
  if (!A) return !1;
  if (TBB()) {
    if (!eZ(!0) && !p2()) {
      let B = Error(`Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.FEEDBACK_CHANNEL}.`);
      return xM("awsAuthRefresh invoked before trust check", B), l("tengu_awsAuthRefresh_missing_trust", {}), !1
    }
  }
  try {
    return k("Fetching AWS caller identity for AWS auth refresh command"), await bi1(), k("Fetched AWS caller identity, skipping AWS auth refresh command"), !1
  } catch {
    return ui1(A)
  }
}
// @from(Ln 128124, Col 0)
function ui1(A) {
  k("Running AWS auth refresh command");
  let Q = lq.getInstance();
  return Q.startAuthentication(), new Promise((B) => {
    let G = kb3(A);
    G.stdout.on("data", (Z) => {
      let Y = Z.toString().trim();
      if (Y) Q.addOutput(Y), k(Y, {
        level: "debug"
      })
    }), G.stderr.on("data", (Z) => {
      let Y = Z.toString().trim();
      if (Y) Q.setError(Y), k(Y, {
        level: "error"
      })
    }), G.on("close", (Z) => {
      if (Z === 0) k("AWS auth refresh completed successfully"), Q.endAuthentication(!0), B(!0);
      else {
        let Y = I1.red("Error running awsAuthRefresh (in settings or ~/.claude.json):");
        console.error(Y), Q.endAuthentication(!1), B(!1)
      }
    })
  })
}
// @from(Ln 128148, Col 0)
async function ub3() {
  let A = gi1();
  if (!A) return null;
  if (PBB()) {
    if (!eZ(!0) && !p2()) {
      let B = Error(`Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.FEEDBACK_CHANNEL}.`);
      return xM("awsCredentialExport invoked before trust check", B), l("tengu_awsCredentialExport_missing_trust", {}), null
    }
  }
  try {
    return k("Fetching AWS caller identity for credential export command"), await bi1(), k("Fetched AWS caller identity, skipping AWS credential export command"), null
  } catch {
    try {
      k("Running AWS credential export command");
      let Q = await e5(A, {
        shell: !0,
        reject: !1
      });
      if (Q.exitCode !== 0 || !Q.stdout) throw Error("awsCredentialExport did not return a valid value");
      let B = AQ(Q.stdout.trim());
      if (!NBB(B)) throw Error("awsCredentialExport did not return valid AWS STS output structure");
      return k("AWS credentials retrieved from awsCredentialExport"), {
        accessKeyId: B.Credentials.AccessKeyId,
        secretAccessKey: B.Credentials.SecretAccessKey,
        sessionToken: B.Credentials.SessionToken
      }
    } catch (Q) {
      let B = I1.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
      if (Q instanceof Error) console.error(B, Q.message);
      else console.error(B, Q);
      return null
    }
  }
}
// @from(Ln 128183, Col 0)
function uA1() {
  DQA.cache.clear()
}
// @from(Ln 128187, Col 0)
function xBB() {
  let A = hi1(),
    Q = gi1();
  if (!A && !Q) return;
  if (TBB() || PBB()) {
    if (!eZ(!0) && !p2()) return
  }
  DQA(), AI()
}
// @from(Ln 128197, Col 0)
function mb3(A) {
  return /^[a-zA-Z0-9-_]+$/.test(A)
}
// @from(Ln 128200, Col 0)
async function TEQ(A) {
  if (!mb3(A)) throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
  await vBB();
  let Q = !1;
  if (process.platform === "darwin") try {
    let G = yi(),
      Z = BNA(),
      Y = Buffer.from(A, "utf-8").toString("hex"),
      J = `add-generic-password -U -a "${Z}" -s "${G}" -X "${Y}"
`;
    await e5("security", ["-i"], {
      input: J,
      reject: !1
    }), l("tengu_api_key_saved_to_keychain", {}), Q = !0
  } catch (G) {
    e(G), l("tengu_api_key_keychain_error", {
      error: G.message
    }), l("tengu_api_key_saved_to_config", {})
  } else l("tengu_api_key_saved_to_config", {});
  let B = TL(A);
  S0((G) => {
    let Z = G.customApiKeyResponses?.approved ?? [];
    return {
      ...G,
      primaryApiKey: Q ? G.primaryApiKey : A,
      customApiKeyResponses: {
        ...G.customApiKeyResponses,
        approved: Z.includes(B) ? Z : [...Z, B],
        rejected: G.customApiKeyResponses?.rejected ?? []
      }
    }
  }), dOA.cache.clear?.()
}
// @from(Ln 128233, Col 0)
async function yBB() {
  await vBB(), S0((A) => ({
    ...A,
    primaryApiKey: void 0
  })), dOA.cache.clear?.()
}
// @from(Ln 128239, Col 0)
async function vBB() {
  try {
    await LBB()
  } catch (A) {
    e(A)
  }
}
// @from(Ln 128247, Col 0)
function XXA(A) {
  if (!xg(A.scopes)) return l("tengu_oauth_tokens_not_claude_ai", {}), {
    success: !0
  };
  if (!A.refreshToken || !A.expiresAt) return l("tengu_oauth_tokens_inference_only", {}), {
    success: !0
  };
  let Q = ZL(),
    B = Q.name;
  try {
    let G = Q.read() || {};
    G.claudeAiOauth = {
      accessToken: A.accessToken,
      refreshToken: A.refreshToken,
      expiresAt: A.expiresAt,
      scopes: A.scopes,
      subscriptionType: A.subscriptionType,
      rateLimitTier: A.rateLimitTier
    };
    let Z = Q.update(G);
    if (Z.success) l("tengu_oauth_tokens_saved", {
      storageBackend: B
    });
    else l("tengu_oauth_tokens_save_failed", {
      storageBackend: B
    });
    return g4.cache?.clear?.(), VA1(), Z
  } catch (G) {
    return e(G), l("tengu_oauth_tokens_save_exception", {
      storageBackend: B,
      error: G.message
    }), {
      success: !1,
      warning: "Failed to save OAuth tokens"
    }
  }
}
// @from(Ln 128285, Col 0)
function db3() {
  g4.cache?.clear?.(), vi()
}
// @from(Ln 128288, Col 0)
async function mA1(A) {
  db3();
  let Q = g4();
  if (!Q?.refreshToken) return !1;
  if (Q.accessToken !== A) return l("tengu_oauth_401_recovered_from_keychain", {}), !0;
  return xR(0, !0)
}
// @from(Ln 128295, Col 0)
async function xR(A = 0, Q = !1) {
  let G = g4();
  if (!Q) {
    if (!G?.refreshToken || !yg(G.expiresAt)) return !1
  }
  if (!G?.refreshToken) return !1;
  if (!xg(G.scopes)) return !1;
  if (g4.cache?.clear?.(), vi(), G = g4(), !G?.refreshToken || !yg(G.expiresAt)) return !1;
  let Z = zQ();
  vA().mkdirSync(Z);
  let J;
  try {
    l("tengu_oauth_token_refresh_lock_acquiring", {}), J = await RBB.lock(Z), l("tengu_oauth_token_refresh_lock_acquired", {})
  } catch (X) {
    if (X.code === "ELOCKED") {
      if (A < 5) return l("tengu_oauth_token_refresh_lock_retry", {
        retryCount: A + 1
      }), await new Promise((I) => setTimeout(I, 1000 + Math.random() * 1000)), xR(A + 1, Q);
      return l("tengu_oauth_token_refresh_lock_retry_limit_reached", {
        maxRetries: 5
      }), !1
    }
    return e(X), l("tengu_oauth_token_refresh_lock_error", {
      error: X.message
    }), !1
  }
  try {
    if (g4.cache?.clear?.(), vi(), G = g4(), !G?.refreshToken || !yg(G.expiresAt)) return l("tengu_oauth_token_refresh_race_resolved", {}), !1;
    l("tengu_oauth_token_refresh_starting", {});
    let X = await rT1(G.refreshToken);
    return XXA(X), g4.cache?.clear?.(), vi(), !0
  } catch (X) {
    e(X instanceof Error ? X : Error(String(X))), g4.cache?.clear?.(), vi();
    let I = g4();
    if (I && !yg(I.expiresAt)) return l("tengu_oauth_token_refresh_race_recovered", {}), !0;
    return !1
  } finally {
    l("tengu_oauth_token_refresh_lock_releasing", {}), await J(), l("tengu_oauth_token_refresh_lock_released", {})
  }
}
// @from(Ln 128336, Col 0)
function qB() {
  if (!iq()) return !1;
  return xg(g4()?.scopes)
}
// @from(Ln 128341, Col 0)
function kBB() {
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !1;
  if (qB()) return !1;
  return !0
}
// @from(Ln 128347, Col 0)
function v3() {
  return iq() ? L1().oauthAccount : void 0
}
// @from(Ln 128351, Col 0)
function ju() {
  let Q = v3()?.billingType;
  if (!qB() || !Q) return !1;
  if (Q !== "stripe_subscription" && Q !== "stripe_subscription_contracted" && Q !== "apple_subscription" && Q !== "google_play_subscription") return !1;
  return !0
}
// @from(Ln 128358, Col 0)
function MR() {
  let A = N6();
  return A === "max" || A === "enterprise" || A === "team" || A === "pro" || A === null
}
// @from(Ln 128363, Col 0)
function N6() {
  if (vEQ()) return yEQ();
  if (!iq()) return null;
  let A = g4();
  if (!A) return null;
  return A.subscriptionType ?? null
}
// @from(Ln 128371, Col 0)
function IXA() {
  if (!iq()) return null;
  let A = g4();
  if (!A) return null;
  return A.rateLimitTier ?? null
}
// @from(Ln 128378, Col 0)
function mi1() {
  switch (N6()) {
    case "enterprise":
      return "Claude Enterprise";
    case "team":
      return "Claude Team";
    case "max":
      return "Claude Max";
    case "pro":
      return "Claude Pro";
    default:
      return "Claude API"
  }
}
// @from(Ln 128393, Col 0)
function Yk() {
  return !!(a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY))
}
// @from(Ln 128397, Col 0)
function bBB() {
  return (jQ() || {}).otelHeadersHelper
}
// @from(Ln 128401, Col 0)
function cb3() {
  let A = bBB();
  if (!A) return !1;
  let Q = dB("projectSettings"),
    B = dB("localSettings");
  return Q?.otelHeadersHelper === A || B?.otelHeadersHelper === A
}
// @from(Ln 128409, Col 0)
function fBB() {
  let A = bBB();
  if (!A) return {};
  let Q = parseInt(process.env.CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS || pb3.toString());
  if (hA1 && Date.now() - OBB < Q) return hA1;
  if (cb3()) {
    if (!eZ(!0)) return {}
  }
  try {
    let B = NH(A, {
      timeout: 30000
    })?.toString().trim();
    if (!B) throw Error("otelHeadersHelper did not return a valid value");
    let G = AQ(B);
    if (typeof G !== "object" || G === null || Array.isArray(G)) throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
    for (let [Z, Y] of Object.entries(G))
      if (typeof Y !== "string") throw Error(`otelHeadersHelper returned non-string value for key "${Z}": ${typeof Y}`);
    return hA1 = G, OBB = Date.now(), hA1
  } catch (B) {
    throw e(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${B instanceof Error?B.message:String(B)}`)), B
  }
}
// @from(Ln 128432, Col 0)
function lb3(A) {
  return A === "max" || A === "pro"
}
// @from(Ln 128436, Col 0)
function dA1() {
  let A = N6();
  return qB() && A !== null && lb3(A)
}
// @from(Ln 128441, Col 0)
function cA1() {
  if (R4() !== "firstParty") return;
  let {
    source: Q
  } = an(), B = {};
  if (qB()) B.subscription = mi1();
  else B.tokenSource = Q;
  let {
    key: G,
    source: Z
  } = Oz();
  if (G) B.apiKeySource = Z;
  if (Q === "claude.ai" || Z === "/login managed key") {
    let J = v3()?.organizationName;
    if (J) B.organization = J
  }
  let Y = v3()?.emailAddress;
  if ((Q === "claude.ai" || Z === "/login managed key") && Y) B.email = Y;
  return B
}
// @from(Ln 128461, Col 4)
MBB
// @from(Ln 128461, Col 9)
RBB
// @from(Ln 128461, Col 14)
bb3 = 300000
// @from(Ln 128462, Col 2)
mOA
// @from(Ln 128462, Col 7)
hb3 = 3600000
// @from(Ln 128463, Col 2)
DQA
// @from(Ln 128463, Col 7)
dOA
// @from(Ln 128463, Col 12)
g4
// @from(Ln 128463, Col 16)
hA1 = null
// @from(Ln 128464, Col 2)
OBB = 0
// @from(Ln 128465, Col 2)
pb3 = 1740000
// @from(Ln 128466, Col 4)
Q2 = w(() => {
  GQ();
  GB();
  t4();
  Vq();
  Y9();
  dnA();
  v1();
  T1();
  Z3();
  lnA();
  OEQ();
  JL();
  onA();
  RR();
  DQ();
  fQ();
  GNA();
  C0();
  fi1();
  Z0();
  MD();
  Tp1();
  gOA();
  A0();
  MBB = c(Sg(), 1), RBB = c(qi(), 1);
  mOA = gT1((A) => {
    let Q = uOA();
    if (!Q) return null;
    if (jBB()) {
      if (!eZ(!0) && !A) {
        let G = Error(`Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.FEEDBACK_CHANNEL}.`);
        xM("apiKeyHelper invoked before trust check", G), MBB.captureException(G), l("tengu_apiKeyHelper_missing_trust11", {})
      }
    }
    try {
      let B = NH(Q)?.toString().trim();
      if (!B) throw Error("apiKeyHelper did not return a valid value");
      return B
    } catch (B) {
      let G = I1.red("Error getting API key from apiKeyHelper (in settings or ~/.claude.json):");
      if (B instanceof Error && "stderr" in B) console.error(G, String(B.stderr));
      else if (B instanceof Error) console.error(G, B.message);
      else console.error(G, B);
      return " "
    }
  }, fb3());
  DQA = gT1(async () => {
    let A = await gb3(),
      Q = await ub3();
    if (A || Q) await wBB();
    return Q
  }, hb3);
  dOA = W0(() => {
    if (process.platform === "darwin") {
      let Q = yi();
      try {
        let B = NH(`security find-generic-password -a $USER -w -s "${Q}"`);
        if (B) return {
          key: B,
          source: "/login managed key"
        }
      } catch (B) {
        e(B)
      }
    }
    let A = L1();
    if (!A.primaryApiKey) return null;
    return {
      key: A.primaryApiKey,
      source: "/login managed key"
    }
  });
  g4 = W0(() => {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
      accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
      refreshToken: null,
      expiresAt: null,
      scopes: ["user:inference"],
      subscriptionType: null,
      rateLimitTier: null
    };
    let A = nT1();
    if (A) return {
      accessToken: A,
      refreshToken: null,
      expiresAt: null,
      scopes: ["user:inference"],
      subscriptionType: null,
      rateLimitTier: null
    };
    try {
      let G = ZL().read()?.claudeAiOauth;
      if (!G?.accessToken) return null;
      return G
    } catch (Q) {
      return e(Q), null
    }
  })
})
// @from(Ln 128570, Col 0)
function OB(A, Q, B = {}) {
  let G = ib3();
  if (!G) return;
  let Z = {
      timestamp: new Date().toISOString(),
      level: A,
      event: Q,
      data: B
    },
    Y = vA();
  if (!Y.existsSync(hBB(G))) Y.mkdirSync(hBB(G));
  Y.appendFileSync(G, eA(Z) + `
`)
}
// @from(Ln 128585, Col 0)
function ib3() {
  return process.env.CLAUDE_CODE_DIAGNOSTICS_FILE
}
// @from(Ln 128588, Col 4)
PL = w(() => {
  DQ();
  A0()
})
// @from(Ln 128605, Col 0)
async function dBB(A) {
  let {
    stdout: Q,
    code: B
  } = await J2("git", ["rev-parse", "--git-dir"], {
    cwd: A,
    preserveOutputOnError: !1
  });
  return B === 0 ? Q.trim() : null
}
// @from(Ln 128615, Col 0)
async function di1(A) {
  return cOA(A)
}
// @from(Ln 128619, Col 0)
function sb3(A) {
  let Q = A.trim();
  if (!Q) return null;
  let B = Q.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (B && B[1] && B[2]) return `${B[1]}/${B[2]}`.toLowerCase();
  let G = Q.match(/^(?:https?|ssh):\/\/(?:[^@]+@)?([^/]+)\/(.+?)(?:\.git)?$/);
  if (G && G[1] && G[2]) return `${G[1]}/${G[2]}`.toLowerCase();
  return null
}
// @from(Ln 128628, Col 0)
async function pBB() {
  let A = await pA1();
  if (!A) return null;
  let Q = sb3(A);
  if (!Q) return null;
  return nb3("sha256").update(Q).digest("hex").substring(0, 16)
}
// @from(Ln 128635, Col 0)
async function tb3() {
  let A = await ci1(),
    {
      stdout: Q,
      code: B
    } = await TQ("git", ["rev-list", "--count", `${A}..HEAD`]);
  if (B !== 0) return null;
  return parseInt(Q.trim(), 10) || 0
}
// @from(Ln 128644, Col 0)
async function Jk(A) {
  let Q = Date.now(),
    {
      stdout: B,
      code: G
    } = await J2("git", ["worktree", "list", "--porcelain"], {
      cwd: A,
      preserveOutputOnError: !1
    }),
    Z = Date.now() - Q;
  if (G !== 0) return l("tengu_worktree_detection", {
    duration_ms: Z,
    worktree_count: 0,
    success: !1
  }), [];
  let Y = B.split(`
`).filter((J) => J.startsWith("worktree ")).map((J) => J.slice(9));
  return l("tengu_worktree_detection", {
    duration_ms: Z,
    worktree_count: Y.length,
    success: !0
  }), Y
}
// @from(Ln 128667, Col 0)
async function li1() {
  try {
    let [A, Q, B, G, Z, Y] = await Promise.all([rb3(), Tu(), pA1(), lBB(), LQA(), pOA()]);
    return {
      commitHash: A,
      branchName: Q,
      remoteUrl: B,
      isHeadOnRemote: G,
      isClean: Z,
      worktreeCount: Y
    }
  } catch (A) {
    return null
  }
}
// @from(Ln 128682, Col 4)
cOA
// @from(Ln 128682, Col 9)
nq
// @from(Ln 128682, Col 13)
cBB = async (A) => {
  let {
    code: Q
  } = await J2("git", ["rev-parse", "--is-inside-work-tree"], {
    preserveOutputOnError: !1,
    cwd: A
  });
  return Q === 0
}
// @from(Ln 128690, Col 3)
rb3 = async () => {
  let {
    stdout: A
  } = await TQ("git", ["rev-parse", "HEAD"]);
  return A.trim()
}
// @from(Ln 128695, Col 3)
Tu = async () => {
  let {
    stdout: A
  } = await TQ("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    preserveOutputOnError: !1
  });
  return A.trim()
}
// @from(Ln 128702, Col 3)
ci1 = async () => {
  let {
    stdout: A,
    code: Q
  } = await TQ("git", ["symbolic-ref", "refs/remotes/origin/HEAD"], {
    preserveOutputOnError: !1
  });
  if (Q === 0) {
    let Z = A.trim().match(/refs\/remotes\/origin\/(.+)/);
    if (Z && Z[1]) return Z[1]
  }
  let {
    stdout: B,
    code: G
  } = await TQ("git", ["branch", "-r"], {
    preserveOutputOnError: !1
  });
  if (G === 0) {
    let Z = B.trim().split(`
`).map((Y) => Y.trim());
    for (let Y of ["main", "master"])
      if (Z.some((J) => J.includes(`origin/${Y}`))) return Y
  }
  return "main"
}
// @from(Ln 128726, Col 3)
pA1 = async () => {
  let {
    stdout: A,
    code: Q
  } = await TQ("git", ["remote", "get-url", "origin"], {
    preserveOutputOnError: !1
  });
  return Q === 0 ? A.trim() : null
}
// @from(Ln 128734, Col 3)
lBB = async () => {
  let {
    code: A
  } = await TQ("git", ["rev-parse", "@{u}"], {
    preserveOutputOnError: !1
  });
  return A === 0
}
// @from(Ln 128741, Col 3)
LQA = async () => {
  let {
    stdout: A
  } = await TQ("git", ["status", "--porcelain"], {
    preserveOutputOnError: !1
  });
  return A.trim().length === 0
}
// @from(Ln 128748, Col 3)
iBB = async () => {
  let A = await lBB(),
    Q = await tb3();
  if (!A) return {
    hasUpstream: !1,
    needsPush: !0,
    commitsAhead: 0,
    commitsAheadOfDefaultBranch: Q
  };
  let {
    stdout: B,
    code: G
  } = await TQ("git", ["rev-list", "--count", "@{u}..HEAD"], {
    preserveOutputOnError: !1
  });
  if (G !== 0) return {
    hasUpstream: !0,
    needsPush: !1,
    commitsAhead: 0,
    commitsAheadOfDefaultBranch: Q
  };
  let Z = parseInt(B.trim(), 10) || 0;
  return {
    hasUpstream: !0,
    needsPush: Z > 0,
    commitsAhead: Z,
    commitsAheadOfDefaultBranch: Q
  }
}
// @from(Ln 128776, Col 3)
nBB = async () => {
  let [A, Q] = await Promise.all([LQA(), iBB()]);
  return {
    hasUncommitted: !A,
    hasUnpushed: Q.needsPush,
    commitsAheadOfDefaultBranch: Q.commitsAheadOfDefaultBranch
  }
}
// @from(Ln 128783, Col 3)
aBB = async (A, Q) => {
  if (!await LQA()) {
    Q?.("committing");
    let {
      code: I,
      stderr: D
    } = await TQ("git", ["add", "-A"], {
      preserveOutputOnError: !0
    });
    if (I !== 0) return {
      success: !1,
      error: `Failed to stage changes: ${D}`
    };
    let {
      code: W,
      stderr: K
    } = await TQ("git", ["commit", "-m", A], {
      preserveOutputOnError: !0
    });
    if (W !== 0) return {
      success: !1,
      error: `Failed to commit: ${K}`
    }
  }
  Q?.("pushing");
  let G = await iBB(),
    Z = await Tu(),
    Y = G.hasUpstream ? ["push"] : ["push", "-u", "origin", Z],
    {
      code: J,
      stderr: X
    } = await TQ("git", Y, {
      preserveOutputOnError: !0
    });
  if (J !== 0) return {
    success: !1,
    error: `Failed to push: ${X}`
  };
  return {
    success: !0
  }
}
// @from(Ln 128824, Col 3)
pi1 = async () => {
  let {
    stdout: A
  } = await TQ("git", ["status", "--porcelain"], {
    preserveOutputOnError: !1
  }), Q = [], B = [];
  return A.trim().split(`
`).filter((G) => G.length > 0).forEach((G) => {
    let Z = G.substring(0, 2),
      Y = G.substring(2).trim();
    if (Z === "??") B.push(Y);
    else if (Y) Q.push(Y)
  }), {
    tracked: Q,
    untracked: B
  }
}
// @from(Ln 128840, Col 3)
pOA = async () => {
  try {
    let {
      stdout: A,
      code: Q
    } = await TQ("git", ["worktree", "list"], {
      preserveOutputOnError: !1
    });
    if (Q !== 0) return 0;
    return A.trim().split(`
`).length
  } catch (A) {
    return 0
  }
}
// @from(Ln 128854, Col 3)
oBB = async (A) => {
  try {
    let Q = A || `Claude Code auto-stash - ${new Date().toISOString()}`,
      {
        untracked: B
      } = await pi1();
    if (B.length > 0) {
      let {
        code: Z
      } = await TQ("git", ["add", ...B], {
        preserveOutputOnError: !1
      });
      if (Z !== 0) return !1
    }
    let {
      code: G
    } = await TQ("git", ["stash", "push", "--message", Q], {
      preserveOutputOnError: !1
    });
    return G === 0
  } catch (Q) {
    return !1
  }
}
// @from(Ln 128878, Col 4)
ZI = w(() => {
  Y9();
  t4();
  T1();
  V2();
  Z0();
  PL();
  cOA = W0((A) => {
    let Q = Date.now();
    OB("info", "find_git_root_started");
    let B = ab3(A),
      G = B.substring(0, B.indexOf(mBB) + 1) || mBB,
      Z = 0;
    while (B !== G) {
      try {
        let J = uBB(B, ".git");
        Z++;
        let X = gBB(J);
        if (X.isDirectory() || X.isFile()) return OB("info", "find_git_root_completed", {
          duration_ms: Date.now() - Q,
          stat_count: Z,
          found: !0
        }), B
      } catch {}
      let Y = ob3(B);
      if (Y === B) break;
      B = Y
    }
    try {
      let Y = uBB(G, ".git");
      Z++;
      let J = gBB(Y);
      if (J.isDirectory() || J.isFile()) return OB("info", "find_git_root_completed", {
        duration_ms: Date.now() - Q,
        stat_count: Z,
        found: !0
      }), G
    } catch {}
    return OB("info", "find_git_root_completed", {
      duration_ms: Date.now() - Q,
      stat_count: Z,
      found: !1
    }), null
  }), nq = W0(async () => {
    let A = Date.now();
    OB("info", "is_git_check_started");
    let {
      code: Q
    } = await TQ("git", ["rev-parse", "--is-inside-work-tree"]);
    return OB("info", "is_git_check_completed", {
      duration_ms: Date.now() - A,
      is_git: Q === 0
    }), Q === 0
  })
})
// @from(Ln 128933, Col 4)
ii1
// @from(Ln 128933, Col 9)
ni1
// @from(Ln 128934, Col 4)
ai1 = w(() => {
  ii1 = ["auto", "iterm2", "iterm2_with_bell", "terminal_bell", "kitty", "notifications_disabled"], ni1 = ["normal", "vim"]
})
// @from(Ln 128948, Col 0)
function eZ(A) {
  let Q = rn(wH(), SL);
  if (Q.bypassPermissionsModeAccepted && Gf0()) return !0;
  if (Yf0()) return !0;
  let B = ti1();
  if (Q.projects?.[B]?.hasTrustDialogAccepted) return !0;
  let Z = oUA(o1());
  if (A) return Q.projects?.[Z]?.hasTrustDialogAccepted === !0;
  while (!0) {
    if (Q.projects?.[Z]?.hasTrustDialogAccepted) return !0;
    let J = oUA(tBB(Z, ".."));
    if (J === Z) break;
    Z = J
  }
  return !1
}
// @from(Ln 128965, Col 0)
function S0(A) {
  try {
    Q2B(wH(), SL, (Q) => {
      let B = A(Q);
      if (B === Q) return Q;
      return {
        ...B,
        projects: rBB(Q.projects)
      }
    }), Pu.config = null, Pu.mtime = 0
  } catch (Q) {
    k(`Failed to save config with lock: ${Q}`, {
      level: "error"
    });
    let B = rn(wH(), SL),
      G = A(B);
    if (G === B) return;
    A2B(wH(), {
      ...G,
      projects: rBB(B.projects)
    }, SL), Pu.config = null, Pu.mtime = 0
  }
}
// @from(Ln 128989, Col 0)
function Bf3() {
  let A = lOA + lA1;
  if (A > 0) l("tengu_config_cache_stats", {
    cache_hits: lOA,
    cache_misses: lA1,
    hit_rate: lOA / A
  });
  lOA = 0, lA1 = 0
}
// @from(Ln 128999, Col 0)
function oi1(A) {
  if (A.installMethod !== void 0) return A;
  let Q = "unknown",
    B = A.autoUpdates ?? !0;
  switch (A.autoUpdaterStatus) {
    case "migrated":
      Q = "local";
      break;
    case "installed":
      Q = "native";
      break;
    case "disabled":
      B = !1;
      break;
    case "enabled":
    case "no_permissions":
    case "not_configured":
      Q = "global";
      break;
    case void 0:
      break
  }
  return {
    ...A,
    installMethod: Q,
    autoUpdates: B
  }
}
// @from(Ln 129028, Col 0)
function rBB(A) {
  if (!A) return A;
  let Q = {},
    B = !1;
  for (let [G, Z] of Object.entries(A))
    if (Z.history !== void 0) {
      B = !0;
      let {
        history: Y,
        ...J
      } = Z;
      Q[G] = J
    } else Q[G] = Z;
  return B ? Q : A
}
// @from(Ln 129044, Col 0)
function L1() {
  try {
    let A = null;
    try {
      A = vA().statSync(wH())
    } catch {}
    if (Pu.config && A) {
      if (A.mtimeMs <= Pu.mtime) return lOA++, Pu.config
    }
    lA1++;
    let Q = oi1(rn(wH(), SL));
    if (A) Pu = {
      config: Q,
      mtime: A.mtimeMs
    }, OQA = {
      mtime: A.mtimeMs,
      size: A.size
    };
    else Pu = {
      config: Q,
      mtime: Date.now()
    }, OQA = null;
    return oi1(Q)
  } catch {
    return oi1(rn(wH(), SL))
  }
}
// @from(Ln 129072, Col 0)
function iA1(A) {
  let Q = L1();
  if (Q.customApiKeyResponses?.approved?.includes(A)) return "approved";
  if (Q.customApiKeyResponses?.rejected?.includes(A)) return "rejected";
  return "new"
}
// @from(Ln 129079, Col 0)
function A2B(A, Q, B) {
  let G = si1(A),
    Z = vA();
  if (!Z.existsSync(G)) Z.mkdirSync(G);
  let Y = Object.fromEntries(Object.entries(Q).filter(([J, X]) => eA(X) !== eA(B[J])));
  yR(A, eA(Y, null, 2), {
    encoding: "utf-8",
    mode: !Z.existsSync(A) ? 384 : void 0
  })
}
// @from(Ln 129090, Col 0)
function Q2B(A, Q, B) {
  let G = si1(A),
    Z = vA();
  if (!Z.existsSync(G)) Z.mkdirSync(G);
  let Y;
  try {
    let J = `${A}.lock`,
      X = Date.now();
    Y = eBB.lockSync(A, {
      lockfilePath: J
    });
    let I = Date.now() - X;
    if (I > 100) k("Lock acquisition took longer than expected - another Claude instance may be running"), l("tengu_config_lock_contention", {
      lock_time_ms: I
    });
    if (OQA && A === wH() && Z.existsSync(A)) {
      let V = Z.statSync(A);
      if (V.mtimeMs !== OQA.mtime || V.size !== OQA.size) l("tengu_config_stale_write", {
        read_mtime: OQA.mtime,
        write_mtime: V.mtimeMs,
        read_size: OQA.size,
        write_size: V.size
      })
    }
    let D = rn(A, Q),
      W = B(D);
    if (W === D) return;
    let K = Object.fromEntries(Object.entries(W).filter(([V, F]) => eA(F) !== eA(Q[V])));
    if (Z.existsSync(A)) try {
      let V = `${A}.backup`;
      Z.copyFileSync(A, V)
    } catch (V) {
      k(`Failed to backup config: ${V}`, {
        level: "error"
      })
    }
    yR(A, eA(K, null, 2), {
      encoding: "utf-8",
      mode: !Z.existsSync(A) ? 384 : void 0
    })
  } finally {
    if (Y) Y()
  }
}
// @from(Ln 129135, Col 0)
function nOA() {
  if (ri1) return;
  let A = Date.now();
  OB("info", "enable_configs_started"), ri1 = !0, rn(wH(), SL, !0), OB("info", "enable_configs_completed", {
    duration_ms: Date.now() - A
  })
}
// @from(Ln 129143, Col 0)
function rn(A, Q, B) {
  if (!ri1) throw Error("Config accessed before allowed.");
  let G = vA();
  if (!G.existsSync(A)) {
    let Z = `${A}.backup`;
    if (G.existsSync(Z)) process.stdout.write(`
Claude configuration file not found at: ${A}
A backup file exists at: ${Z}
You can manually restore it by running: cp "${Z}" "${A}"

`);
    return nAA(Q)
  }
  try {
    let Z = G.readFileSync(A, {
      encoding: "utf-8"
    });
    try {
      let Y = AQ(vGA(Z));
      return {
        ...nAA(Q),
        ...Y
      }
    } catch (Y) {
      let J = Y instanceof Error ? Y.message : String(Y);
      throw new Hq(J, A, Q)
    }
  } catch (Z) {
    if (Z instanceof Hq && B) throw Z;
    if (Z instanceof Hq) {
      k(`Config file corrupted, resetting to defaults: ${Z.message}`, {
        level: "error"
      }), e(Z), l("tengu_config_parse_error", {
        has_backup: G.existsSync(`${A}.backup`)
      }), process.stdout.write(`
Claude configuration file at ${A} is corrupted: ${Z.message}
`);
      let Y = si1(A),
        J = eb3(A),
        X = G.readdirStringSync(Y).filter((V) => V.startsWith(`${J}.corrupted.`)),
        I, D = !1,
        W = G.readFileSync(A, {
          encoding: "utf-8"
        });
      for (let V of X) try {
        let F = G.readFileSync(on(Y, V), {
          encoding: "utf-8"
        });
        if (W === F) {
          D = !0;
          break
        }
      } catch {}
      if (!D) {
        I = `${A}.corrupted.${Date.now()}`;
        try {
          G.copyFileSync(A, I), k(`Corrupted config backed up to: ${I}`, {
            level: "error"
          })
        } catch {}
      }
      let K = `${A}.backup`;
      if (I) process.stdout.write(`The corrupted file has been backed up to: ${I}
`);
      else if (D) process.stdout.write(`The corrupted file has already been backed up.
`);
      if (G.existsSync(K)) process.stdout.write(`A backup file exists at: ${K}
You can manually restore it by running: cp "${K}" "${A}"

`);
      else process.stdout.write(`
`)
    }
    return nAA(Q)
  }
}
// @from(Ln 129220, Col 0)
function JG() {
  let A = ti1(),
    Q = rn(wH(), SL);
  if (!Q.projects) return iOA;
  let B = Q.projects[A] ?? iOA;
  if (typeof B.allowedTools === "string") B.allowedTools = c5(B.allowedTools) ?? [];
  return B
}
// @from(Ln 129229, Col 0)
function BZ(A) {
  let Q = ti1();
  try {
    Q2B(wH(), SL, (B) => {
      let G = B.projects?.[Q] ?? iOA,
        Z = A(G);
      if (Z === G) return B;
      return {
        ...B,
        projects: {
          ...B.projects,
          [Q]: Z
        }
      }
    })
  } catch (B) {
    k(`Failed to save config with lock: ${B}`, {
      level: "error"
    });
    let G = rn(wH(), SL),
      Z = G.projects?.[Q] ?? iOA,
      Y = A(Z);
    if (Y === Z) return;
    A2B(wH(), {
      ...G,
      projects: {
        ...G.projects,
        [Q]: Y
      }
    }, SL)
  }
}
// @from(Ln 129262, Col 0)
function Su() {
  return DXA() !== null
}
// @from(Ln 129266, Col 0)
function aOA() {
  return Su() && !a1(process.env.FORCE_AUTOUPDATE_PLUGINS)
}
// @from(Ln 129270, Col 0)
function DXA() {
  if (a1(process.env.DISABLE_AUTOUPDATER)) return "DISABLE_AUTOUPDATER set";
  if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC set";
  let A = L1();
  if (A.autoUpdates === !1 && (A.installMethod !== "native" || A.autoUpdatesProtectedForNative !== !0)) return "config";
  return null
}
// @from(Ln 129278, Col 0)
function reA() {
  if (a1(process.env.DISABLE_COST_WARNINGS)) return !1;
  if (qB()) return !1;
  let Q = an(),
    B = YL() !== null;
  if (!Q.hasToken && !B) return !1;
  let G = L1(),
    Z = G.oauthAccount?.organizationRole,
    Y = G.oauthAccount?.workspaceRole;
  if (!Z || !Y) return !1;
  return ["admin", "billing"].includes(Z) || ["workspace_admin", "workspace_billing"].includes(Y)
}
// @from(Ln 129291, Col 0)
function Xk() {
  if (sBB !== null) return sBB;
  if (!qB()) return !1;
  let A = N6();
  if (A === "max" || A === "pro") return !0;
  let B = L1().oauthAccount?.organizationRole;
  return !!B && ["admin", "billing", "owner", "primary_owner"].includes(B)
}
// @from(Ln 129300, Col 0)
function ZP() {
  if (!f8("tengu_c4w_usage_limit_notifications_enabled")) return !1;
  if (N6() === "team") return HX("tengu_teams_usage_limit_notifications", "enabled", !1);
  return !0
}
// @from(Ln 129306, Col 0)
function xu() {
  let A = L1();
  if (A.userID) return A.userID;
  let Q = Af3(32).toString("hex");
  return S0((B) => ({
    ...B,
    userID: Q
  })), Q
}
// @from(Ln 129316, Col 0)
function ei1() {
  let A = L1();
  if (A.anonymousId) return A.anonymousId;
  let Q = `claudecode.v1.${Qf3()}`;
  return S0((B) => ({
    ...B,
    anonymousId: Q
  })), Q
}
// @from(Ln 129326, Col 0)
function B2B() {
  if (!L1().firstStartTime) {
    let Q = new Date().toISOString();
    S0((B) => ({
      ...B,
      firstStartTime: B.firstStartTime ?? Q
    }))
  }
}
// @from(Ln 129336, Col 0)
function MQA(A) {
  let Q = EQ();
  if (A === "ExperimentalUltraClaudeMd") return MQA("User");
  switch (A) {
    case "User":
      return on(zQ(), "CLAUDE.md");
    case "Local":
      return on(Q, "CLAUDE.local.md");
    case "Project":
      return on(Q, "CLAUDE.md");
    case "Managed":
      return on(xL(), "CLAUDE.md");
    case "ExperimentalUltraClaudeMd":
      return on(zQ(), "ULTRACLAUDE.md")
  }
}
// @from(Ln 129353, Col 0)
function An1() {
  return on(xL(), ".claude", "rules")
}
// @from(Ln 129357, Col 0)
function Qn1() {
  return on(zQ(), "rules")
}
// @from(Ln 129360, Col 4)
eBB
// @from(Ln 129360, Col 9)
iOA
// @from(Ln 129360, Col 14)
SL
// @from(Ln 129360, Col 18)
LFG
// @from(Ln 129360, Col 23)
OFG
// @from(Ln 129360, Col 28)
Pu
// @from(Ln 129360, Col 32)
OQA = null
// @from(Ln 129361, Col 2)
lOA = 0
// @from(Ln 129362, Col 2)
lA1 = 0
// @from(Ln 129363, Col 2)
ri1 = !1
// @from(Ln 129364, Col 2)
ti1
// @from(Ln 129364, Col 7)
sBB = null
// @from(Ln 129365, Col 4)
GQ = w(() => {
  A0();
  Y9();
  p3();
  fQ();
  V2();
  vI();
  oZ();
  XX();
  C0();
  DQ();
  y9();
  Q2();
  T1();
  PL();
  v1();
  ZI();
  Z0();
  nX();
  GB();
  BI();
  w6();
  A0();
  ai1();
  eBB = c(qi(), 1), iOA = {
    allowedTools: [],
    mcpContextUris: [],
    mcpServers: {},
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    hasTrustDialogAccepted: !1,
    projectOnboardingSeenCount: 0,
    hasClaudeMdExternalIncludesApproved: !1,
    hasClaudeMdExternalIncludesWarningShown: !1
  }, SL = {
    numStartups: 0,
    installMethod: void 0,
    autoUpdates: void 0,
    theme: "dark",
    preferredNotifChannel: "auto",
    verbose: !1,
    editorMode: "normal",
    autoCompactEnabled: !0,
    showTurnDuration: !0,
    hasSeenTasksHint: !1,
    hasUsedStash: !1,
    queuedCommandUpHintCount: 0,
    diffTool: "auto",
    customApiKeyResponses: {
      approved: [],
      rejected: []
    },
    env: {},
    tipsHistory: {},
    memoryUsageCount: 0,
    promptQueueUseCount: 0,
    todoFeatureEnabled: !0,
    showExpandedTodos: !1,
    messageIdleNotifThresholdMs: 60000,
    autoConnectIde: !1,
    autoInstallIdeExtension: !0,
    checkpointingShadowRepos: [],
    fileCheckpointingEnabled: !0,
    terminalProgressBarEnabled: !0,
    cachedStatsigGates: {},
    cachedDynamicConfigs: {},
    cachedGrowthBookFeatures: {},
    respectGitignore: !0
  };
  LFG = {
    ...SL,
    autoUpdates: !1
  }, OFG = {
    ...iOA
  };
  Pu = {
    config: null,
    mtime: 0
  };
  C6(async () => {
    Bf3()
  });
  ti1 = W0(() => {
    let A = EQ(),
      Q = cOA(A);
    if (Q) return oUA(Q);
    return oUA(tBB(A))
  })
})
// @from(Ln 129454, Col 0)
async function G2B() {
  if (aA1 === null && !nA1) nA1 = Zf3(), aA1 = await nA1, nA1 = null, RQA.cache.clear?.()
}
// @from(Ln 129458, Col 0)
function cn(A) {
  let Q = RQA(A);
  return {
    customIDs: {
      sessionId: Q.sessionId,
      organizationUUID: Q.organizationUuid,
      accountUUID: Q.accountUuid
    },
    userID: Q.deviceId,
    appVersion: Q.appVersion,
    email: Q.email,
    custom: {
      userType: Q.userType,
      organizationUuid: Q.organizationUuid,
      accountUuid: Q.accountUuid,
      subscriptionType: Q.subscriptionType ?? "",
      firstTokenTime: Q.firstTokenTime ?? 0,
      ...Q.githubActionsMetadata && {
        githubActor: Q.githubActionsMetadata.actor,
        githubActorId: Q.githubActionsMetadata.actorId,
        githubRepository: Q.githubActionsMetadata.repository,
        githubRepositoryId: Q.githubActionsMetadata.repositoryId,
        githubRepositoryOwner: Q.githubActionsMetadata.repositoryOwner,
        githubRepositoryOwnerId: Q.githubActionsMetadata.repositoryOwnerId
      }
    }
  }
}
// @from(Ln 129487, Col 0)
function Z2B() {
  return RQA(!0)
}
// @from(Ln 129491, Col 0)
function Gf3() {
  if (aA1 !== null) return aA1;
  return
}
// @from(Ln 129495, Col 0)
async function Zf3() {
  return
}
// @from(Ln 129498, Col 4)
aA1 = null
// @from(Ln 129499, Col 2)
nA1 = null
// @from(Ln 129500, Col 2)
RQA
// @from(Ln 129501, Col 4)
Ou = w(() => {
  GQ();
  Y9();
  C0();
  Q2();
  Vq();
  RQA = W0((A) => {
    let Q = xu(),
      B = L1(),
      G, Z;
    if (A) {
      if (G = N6() ?? void 0, G && B.claudeCodeFirstTokenDate) {
        let I = new Date(B.claudeCodeFirstTokenDate).getTime();
        if (!isNaN(I)) Z = I
      }
    }
    let Y = v3(),
      J = Y?.organizationUuid,
      X = Y?.accountUuid;
    return {
      deviceId: Q,
      sessionId: q0(),
      email: Gf3(),
      appVersion: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION,
      organizationUuid: J,
      accountUuid: X,
      userType: "external",
      subscriptionType: G,
      firstTokenTime: Z,
      ...process.env.GITHUB_ACTIONS === "true" && {
        githubActionsMetadata: {
          actor: process.env.GITHUB_ACTOR,
          actorId: process.env.GITHUB_ACTOR_ID,
          repository: process.env.GITHUB_REPOSITORY,
          repositoryId: process.env.GITHUB_REPOSITORY_ID,
          repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
          repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
        }
      }
    }
  })
})
// @from(Ln 129550, Col 4)
X2B = U((Y2B) => {
  Object.defineProperty(Y2B, "__esModule", {
    value: !0
  });
  Y2B._globalThis = void 0;
  Y2B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 129557, Col 4)
I2B = U((_QA) => {
  var Yf3 = _QA && _QA.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      })
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Jf3 = _QA && _QA.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Yf3(Q, A, B)
    };
  Object.defineProperty(_QA, "__esModule", {
    value: !0
  });
  Jf3(X2B(), _QA)
})
// @from(Ln 129579, Col 4)
D2B = U((jQA) => {
  var Xf3 = jQA && jQA.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      })
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    If3 = jQA && jQA.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Xf3(Q, A, B)
    };
  Object.defineProperty(jQA, "__esModule", {
    value: !0
  });
  If3(I2B(), jQA)
})
// @from(Ln 129601, Col 4)
Bn1 = U((W2B) => {
  Object.defineProperty(W2B, "__esModule", {
    value: !0
  });
  W2B.VERSION = void 0;
  W2B.VERSION = "1.9.0"
})
// @from(Ln 129608, Col 4)
z2B = U((H2B) => {
  Object.defineProperty(H2B, "__esModule", {
    value: !0
  });
  H2B.isCompatible = H2B._makeCompatibilityCheck = void 0;
  var Df3 = Bn1(),
    V2B = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;

  function F2B(A) {
    let Q = new Set([A]),
      B = new Set,
      G = A.match(V2B);
    if (!G) return () => !1;
    let Z = {
      major: +G[1],
      minor: +G[2],
      patch: +G[3],
      prerelease: G[4]
    };
    if (Z.prerelease != null) return function (I) {
      return I === A
    };

    function Y(X) {
      return B.add(X), !1
    }

    function J(X) {
      return Q.add(X), !0
    }
    return function (I) {
      if (Q.has(I)) return !0;
      if (B.has(I)) return !1;
      let D = I.match(V2B);
      if (!D) return Y(I);
      let W = {
        major: +D[1],
        minor: +D[2],
        patch: +D[3],
        prerelease: D[4]
      };
      if (W.prerelease != null) return Y(I);
      if (Z.major !== W.major) return Y(I);
      if (Z.major === 0) {
        if (Z.minor === W.minor && Z.patch <= W.patch) return J(I);
        return Y(I)
      }
      if (Z.minor <= W.minor) return J(I);
      return Y(I)
    }
  }
  H2B._makeCompatibilityCheck = F2B;
  H2B.isCompatible = F2B(Df3.VERSION)
})