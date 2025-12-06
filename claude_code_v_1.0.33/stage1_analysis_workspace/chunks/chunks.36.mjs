
// @from(Start 3263105, End 3305945)
FUQ = z((Fq7, VUQ) => {
  var {
    defineProperty: SuA,
    getOwnPropertyDescriptor: Et4,
    getOwnPropertyNames: zt4
  } = Object, Ut4 = Object.prototype.hasOwnProperty, m0 = (A, Q) => SuA(A, "name", {
    value: Q,
    configurable: !0
  }), $t4 = (A, Q) => {
    for (var B in Q) SuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, wt4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of zt4(Q))
        if (!Ut4.call(A, Z) && Z !== B) SuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Et4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, qt4 = (A) => wt4(SuA({}, "__esModule", {
    value: !0
  }), A), $zQ = {};
  $t4($zQ, {
    AmbiguousRoleResolutionType: () => _t4,
    CognitoIdentity: () => XUQ,
    CognitoIdentityClient: () => ZO1,
    CognitoIdentityServiceException: () => qw,
    ConcurrentModificationException: () => SzQ,
    CreateIdentityPoolCommand: () => mzQ,
    CredentialsFilterSensitiveLog: () => kzQ,
    DeleteIdentitiesCommand: () => dzQ,
    DeleteIdentityPoolCommand: () => czQ,
    DescribeIdentityCommand: () => pzQ,
    DescribeIdentityPoolCommand: () => lzQ,
    DeveloperUserAlreadyRegisteredException: () => jzQ,
    ErrorCode: () => kt4,
    ExternalServiceException: () => TzQ,
    GetCredentialsForIdentityCommand: () => izQ,
    GetCredentialsForIdentityInputFilterSensitiveLog: () => _zQ,
    GetCredentialsForIdentityResponseFilterSensitiveLog: () => yzQ,
    GetIdCommand: () => nzQ,
    GetIdInputFilterSensitiveLog: () => xzQ,
    GetIdentityPoolRolesCommand: () => azQ,
    GetOpenIdTokenCommand: () => szQ,
    GetOpenIdTokenForDeveloperIdentityCommand: () => rzQ,
    GetOpenIdTokenForDeveloperIdentityInputFilterSensitiveLog: () => fzQ,
    GetOpenIdTokenForDeveloperIdentityResponseFilterSensitiveLog: () => hzQ,
    GetOpenIdTokenInputFilterSensitiveLog: () => vzQ,
    GetOpenIdTokenResponseFilterSensitiveLog: () => bzQ,
    GetPrincipalTagAttributeMapCommand: () => ozQ,
    InternalErrorException: () => wzQ,
    InvalidIdentityPoolConfigurationException: () => PzQ,
    InvalidParameterException: () => qzQ,
    LimitExceededException: () => NzQ,
    ListIdentitiesCommand: () => tzQ,
    ListIdentityPoolsCommand: () => IO1,
    ListTagsForResourceCommand: () => ezQ,
    LookupDeveloperIdentityCommand: () => AUQ,
    MappingRuleMatchType: () => yt4,
    MergeDeveloperIdentitiesCommand: () => QUQ,
    NotAuthorizedException: () => LzQ,
    ResourceConflictException: () => MzQ,
    ResourceNotFoundException: () => RzQ,
    RoleMappingType: () => xt4,
    SetIdentityPoolRolesCommand: () => BUQ,
    SetPrincipalTagAttributeMapCommand: () => GUQ,
    TagResourceCommand: () => ZUQ,
    TooManyRequestsException: () => OzQ,
    UnlinkDeveloperIdentityCommand: () => IUQ,
    UnlinkIdentityCommand: () => YUQ,
    UnlinkIdentityInputFilterSensitiveLog: () => gzQ,
    UntagResourceCommand: () => JUQ,
    UpdateIdentityPoolCommand: () => WUQ,
    __Client: () => h0.Client,
    paginateListIdentityPools: () => pe4
  });
  VUQ.exports = qt4($zQ);
  var HzQ = MHA(),
    Nt4 = OHA(),
    Lt4 = RHA(),
    CzQ = b8A(),
    Mt4 = f8(),
    juA = iB(),
    Ot4 = LX(),
    lI = q5(),
    EzQ = D6(),
    zzQ = yL1(),
    Rt4 = m0((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "cognito-identity"
      })
    }, "resolveClientEndpointParameters"),
    hY = {
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
    Tt4 = DzQ(),
    UzQ = xHA(),
    GO1 = iz(),
    h0 = r6(),
    Pt4 = m0((A) => {
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
    jt4 = m0((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    St4 = m0((A, Q) => {
      let B = Object.assign((0, UzQ.getAwsRegionExtensionConfiguration)(A), (0, h0.getDefaultExtensionConfiguration)(A), (0, GO1.getHttpHandlerExtensionConfiguration)(A), Pt4(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, UzQ.resolveAwsRegionExtensionConfiguration)(B), (0, h0.resolveDefaultRuntimeConfig)(B), (0, GO1.resolveHttpHandlerRuntimeConfig)(B), jt4(B))
    }, "resolveRuntimeExtensions"),
    ZO1 = class extends h0.Client {
      static {
        m0(this, "CognitoIdentityClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, Tt4.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = Rt4(Q),
          G = (0, CzQ.resolveUserAgentConfig)(B),
          Z = (0, EzQ.resolveRetryConfig)(G),
          I = (0, Mt4.resolveRegionConfig)(Z),
          Y = (0, HzQ.resolveHostHeaderConfig)(I),
          J = (0, lI.resolveEndpointConfig)(Y),
          W = (0, zzQ.resolveHttpAuthSchemeConfig)(J),
          X = St4(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, CzQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, EzQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Ot4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, HzQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, Nt4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, Lt4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, juA.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: zzQ.defaultCognitoIdentityHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: m0(async (V) => new juA.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, juA.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    gY = GZ(),
    EW = TF(),
    qw = class A extends h0.ServiceException {
      static {
        m0(this, "CognitoIdentityServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    _t4 = {
      AUTHENTICATED_ROLE: "AuthenticatedRole",
      DENY: "Deny"
    },
    wzQ = class A extends qw {
      static {
        m0(this, "InternalErrorException")
      }
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
    qzQ = class A extends qw {
      static {
        m0(this, "InvalidParameterException")
      }
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
    NzQ = class A extends qw {
      static {
        m0(this, "LimitExceededException")
      }
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
    LzQ = class A extends qw {
      static {
        m0(this, "NotAuthorizedException")
      }
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
    MzQ = class A extends qw {
      static {
        m0(this, "ResourceConflictException")
      }
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
    OzQ = class A extends qw {
      static {
        m0(this, "TooManyRequestsException")
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
    kt4 = {
      ACCESS_DENIED: "AccessDenied",
      INTERNAL_SERVER_ERROR: "InternalServerError"
    },
    RzQ = class A extends qw {
      static {
        m0(this, "ResourceNotFoundException")
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
    TzQ = class A extends qw {
      static {
        m0(this, "ExternalServiceException")
      }
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
    PzQ = class A extends qw {
      static {
        m0(this, "InvalidIdentityPoolConfigurationException")
      }
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
    yt4 = {
      CONTAINS: "Contains",
      EQUALS: "Equals",
      NOT_EQUAL: "NotEqual",
      STARTS_WITH: "StartsWith"
    },
    xt4 = {
      RULES: "Rules",
      TOKEN: "Token"
    },
    jzQ = class A extends qw {
      static {
        m0(this, "DeveloperUserAlreadyRegisteredException")
      }
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
    SzQ = class A extends qw {
      static {
        m0(this, "ConcurrentModificationException")
      }
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
    _zQ = m0((A) => ({
      ...A,
      ...A.Logins && {
        Logins: h0.SENSITIVE_STRING
      }
    }), "GetCredentialsForIdentityInputFilterSensitiveLog"),
    kzQ = m0((A) => ({
      ...A,
      ...A.SecretKey && {
        SecretKey: h0.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    yzQ = m0((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: kzQ(A.Credentials)
      }
    }), "GetCredentialsForIdentityResponseFilterSensitiveLog"),
    xzQ = m0((A) => ({
      ...A,
      ...A.Logins && {
        Logins: h0.SENSITIVE_STRING
      }
    }), "GetIdInputFilterSensitiveLog"),
    vzQ = m0((A) => ({
      ...A,
      ...A.Logins && {
        Logins: h0.SENSITIVE_STRING
      }
    }), "GetOpenIdTokenInputFilterSensitiveLog"),
    bzQ = m0((A) => ({
      ...A,
      ...A.Token && {
        Token: h0.SENSITIVE_STRING
      }
    }), "GetOpenIdTokenResponseFilterSensitiveLog"),
    fzQ = m0((A) => ({
      ...A,
      ...A.Logins && {
        Logins: h0.SENSITIVE_STRING
      }
    }), "GetOpenIdTokenForDeveloperIdentityInputFilterSensitiveLog"),
    hzQ = m0((A) => ({
      ...A,
      ...A.Token && {
        Token: h0.SENSITIVE_STRING
      }
    }), "GetOpenIdTokenForDeveloperIdentityResponseFilterSensitiveLog"),
    gzQ = m0((A) => ({
      ...A,
      ...A.Logins && {
        Logins: h0.SENSITIVE_STRING
      }
    }), "UnlinkIdentityInputFilterSensitiveLog"),
    vt4 = m0(async (A, Q) => {
      let B = iI("CreateIdentityPool"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_CreateIdentityPoolCommand"),
    bt4 = m0(async (A, Q) => {
      let B = iI("DeleteIdentities"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_DeleteIdentitiesCommand"),
    ft4 = m0(async (A, Q) => {
      let B = iI("DeleteIdentityPool"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_DeleteIdentityPoolCommand"),
    ht4 = m0(async (A, Q) => {
      let B = iI("DescribeIdentity"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_DescribeIdentityCommand"),
    gt4 = m0(async (A, Q) => {
      let B = iI("DescribeIdentityPool"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_DescribeIdentityPoolCommand"),
    ut4 = m0(async (A, Q) => {
      let B = iI("GetCredentialsForIdentity"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_GetCredentialsForIdentityCommand"),
    mt4 = m0(async (A, Q) => {
      let B = iI("GetId"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_GetIdCommand"),
    dt4 = m0(async (A, Q) => {
      let B = iI("GetIdentityPoolRoles"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_GetIdentityPoolRolesCommand"),
    ct4 = m0(async (A, Q) => {
      let B = iI("GetOpenIdToken"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_GetOpenIdTokenCommand"),
    pt4 = m0(async (A, Q) => {
      let B = iI("GetOpenIdTokenForDeveloperIdentity"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_GetOpenIdTokenForDeveloperIdentityCommand"),
    lt4 = m0(async (A, Q) => {
      let B = iI("GetPrincipalTagAttributeMap"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_GetPrincipalTagAttributeMapCommand"),
    it4 = m0(async (A, Q) => {
      let B = iI("ListIdentities"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_ListIdentitiesCommand"),
    nt4 = m0(async (A, Q) => {
      let B = iI("ListIdentityPools"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_ListIdentityPoolsCommand"),
    at4 = m0(async (A, Q) => {
      let B = iI("ListTagsForResource"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_ListTagsForResourceCommand"),
    st4 = m0(async (A, Q) => {
      let B = iI("LookupDeveloperIdentity"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_LookupDeveloperIdentityCommand"),
    rt4 = m0(async (A, Q) => {
      let B = iI("MergeDeveloperIdentities"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_MergeDeveloperIdentitiesCommand"),
    ot4 = m0(async (A, Q) => {
      let B = iI("SetIdentityPoolRoles"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_SetIdentityPoolRolesCommand"),
    tt4 = m0(async (A, Q) => {
      let B = iI("SetPrincipalTagAttributeMap"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_SetPrincipalTagAttributeMapCommand"),
    et4 = m0(async (A, Q) => {
      let B = iI("TagResource"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_TagResourceCommand"),
    Ae4 = m0(async (A, Q) => {
      let B = iI("UnlinkDeveloperIdentity"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_UnlinkDeveloperIdentityCommand"),
    Qe4 = m0(async (A, Q) => {
      let B = iI("UnlinkIdentity"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_UnlinkIdentityCommand"),
    Be4 = m0(async (A, Q) => {
      let B = iI("UntagResource"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_UntagResourceCommand"),
    Ge4 = m0(async (A, Q) => {
      let B = iI("UpdateIdentityPool"),
        G;
      return G = JSON.stringify((0, h0._json)(A)), mY(Q, B, "/", void 0, G)
    }, "se_UpdateIdentityPoolCommand"),
    Ze4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_CreateIdentityPoolCommand"),
    Ie4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_DeleteIdentitiesCommand"),
    Ye4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      return await (0, h0.collectBody)(A.body, Q), {
        $metadata: Y3(A)
      }
    }, "de_DeleteIdentityPoolCommand"),
    Je4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = uzQ(B, Q), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_DescribeIdentityCommand"),
    We4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_DescribeIdentityPoolCommand"),
    Xe4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = ge4(B, Q), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_GetCredentialsForIdentityCommand"),
    Ve4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_GetIdCommand"),
    Fe4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_GetIdentityPoolRolesCommand"),
    Ke4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_GetOpenIdTokenCommand"),
    De4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_GetOpenIdTokenForDeveloperIdentityCommand"),
    He4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_GetPrincipalTagAttributeMapCommand"),
    Ce4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = me4(B, Q), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_ListIdentitiesCommand"),
    Ee4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_ListIdentityPoolsCommand"),
    ze4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_ListTagsForResourceCommand"),
    Ue4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_LookupDeveloperIdentityCommand"),
    $e4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_MergeDeveloperIdentitiesCommand"),
    we4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      return await (0, h0.collectBody)(A.body, Q), {
        $metadata: Y3(A)
      }
    }, "de_SetIdentityPoolRolesCommand"),
    qe4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_SetPrincipalTagAttributeMapCommand"),
    Ne4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_TagResourceCommand"),
    Le4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      return await (0, h0.collectBody)(A.body, Q), {
        $metadata: Y3(A)
      }
    }, "de_UnlinkDeveloperIdentityCommand"),
    Me4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      return await (0, h0.collectBody)(A.body, Q), {
        $metadata: Y3(A)
      }
    }, "de_UnlinkIdentityCommand"),
    Oe4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_UntagResourceCommand"),
    Re4 = m0(async (A, Q) => {
      if (A.statusCode >= 300) return uY(A, Q);
      let B = await (0, EW.parseJsonBody)(A.body, Q),
        G = {};
      return G = (0, h0._json)(B), {
        $metadata: Y3(A),
        ...G
      }
    }, "de_UpdateIdentityPoolCommand"),
    uY = m0(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, EW.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, EW.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "InternalErrorException":
        case "com.amazonaws.cognitoidentity#InternalErrorException":
          throw await Se4(B, Q);
        case "InvalidParameterException":
        case "com.amazonaws.cognitoidentity#InvalidParameterException":
          throw await ke4(B, Q);
        case "LimitExceededException":
        case "com.amazonaws.cognitoidentity#LimitExceededException":
          throw await ye4(B, Q);
        case "NotAuthorizedException":
        case "com.amazonaws.cognitoidentity#NotAuthorizedException":
          throw await xe4(B, Q);
        case "ResourceConflictException":
        case "com.amazonaws.cognitoidentity#ResourceConflictException":
          throw await ve4(B, Q);
        case "TooManyRequestsException":
        case "com.amazonaws.cognitoidentity#TooManyRequestsException":
          throw await fe4(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.cognitoidentity#ResourceNotFoundException":
          throw await be4(B, Q);
        case "ExternalServiceException":
        case "com.amazonaws.cognitoidentity#ExternalServiceException":
          throw await je4(B, Q);
        case "InvalidIdentityPoolConfigurationException":
        case "com.amazonaws.cognitoidentity#InvalidIdentityPoolConfigurationException":
          throw await _e4(B, Q);
        case "DeveloperUserAlreadyRegisteredException":
        case "com.amazonaws.cognitoidentity#DeveloperUserAlreadyRegisteredException":
          throw await Pe4(B, Q);
        case "ConcurrentModificationException":
        case "com.amazonaws.cognitoidentity#ConcurrentModificationException":
          throw await Te4(B, Q);
        default:
          let Z = B.body;
          return de4({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Te4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new SzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_ConcurrentModificationExceptionRes"),
    Pe4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new jzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_DeveloperUserAlreadyRegisteredExceptionRes"),
    je4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new TzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_ExternalServiceExceptionRes"),
    Se4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new wzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_InternalErrorExceptionRes"),
    _e4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new PzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityPoolConfigurationExceptionRes"),
    ke4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new qzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_InvalidParameterExceptionRes"),
    ye4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new NzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_LimitExceededExceptionRes"),
    xe4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new LzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_NotAuthorizedExceptionRes"),
    ve4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new MzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_ResourceConflictExceptionRes"),
    be4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new RzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_ResourceNotFoundExceptionRes"),
    fe4 = m0(async (A, Q) => {
      let B = A.body,
        G = (0, h0._json)(B),
        Z = new OzQ({
          $metadata: Y3(A),
          ...G
        });
      return (0, h0.decorateServiceException)(Z, B)
    }, "de_TooManyRequestsExceptionRes"),
    he4 = m0((A, Q) => {
      return (0, h0.take)(A, {
        AccessKeyId: h0.expectString,
        Expiration: m0((B) => (0, h0.expectNonNull)((0, h0.parseEpochTimestamp)((0, h0.expectNumber)(B))), "Expiration"),
        SecretKey: h0.expectString,
        SessionToken: h0.expectString
      })
    }, "de_Credentials"),
    ge4 = m0((A, Q) => {
      return (0, h0.take)(A, {
        Credentials: m0((B) => he4(B, Q), "Credentials"),
        IdentityId: h0.expectString
      })
    }, "de_GetCredentialsForIdentityResponse"),
    ue4 = m0((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return uzQ(G, Q)
      })
    }, "de_IdentitiesList"),
    uzQ = m0((A, Q) => {
      return (0, h0.take)(A, {
        CreationDate: m0((B) => (0, h0.expectNonNull)((0, h0.parseEpochTimestamp)((0, h0.expectNumber)(B))), "CreationDate"),
        IdentityId: h0.expectString,
        LastModifiedDate: m0((B) => (0, h0.expectNonNull)((0, h0.parseEpochTimestamp)((0, h0.expectNumber)(B))), "LastModifiedDate"),
        Logins: h0._json
      })
    }, "de_IdentityDescription"),
    me4 = m0((A, Q) => {
      return (0, h0.take)(A, {
        Identities: m0((B) => ue4(B, Q), "Identities"),
        IdentityPoolId: h0.expectString,
        NextToken: h0.expectString
      })
    }, "de_ListIdentitiesResponse"),
    Y3 = m0((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    de4 = (0, h0.withBaseException)(qw),
    mY = m0(async (A, Q, B, G, Z) => {
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
      return new GO1.HttpRequest(X)
    }, "buildHttpRpcRequest");

  function iI(A) {
    return {
      "content-type": "application/x-amz-json-1.1",
      "x-amz-target": `AWSCognitoIdentityService.${A}`
    }
  }
  m0(iI, "sharedHeaders");
  var mzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "CreateIdentityPool", {}).n("CognitoIdentityClient", "CreateIdentityPoolCommand").f(void 0, void 0).ser(vt4).de(Ze4).build() {
      static {
        m0(this, "CreateIdentityPoolCommand")
      }
    },
    dzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentities", {}).n("CognitoIdentityClient", "DeleteIdentitiesCommand").f(void 0, void 0).ser(bt4).de(Ie4).build() {
      static {
        m0(this, "DeleteIdentitiesCommand")
      }
    },
    czQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentityPool", {}).n("CognitoIdentityClient", "DeleteIdentityPoolCommand").f(void 0, void 0).ser(ft4).de(Ye4).build() {
      static {
        m0(this, "DeleteIdentityPoolCommand")
      }
    },
    pzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentity", {}).n("CognitoIdentityClient", "DescribeIdentityCommand").f(void 0, void 0).ser(ht4).de(Je4).build() {
      static {
        m0(this, "DescribeIdentityCommand")
      }
    },
    lzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentityPool", {}).n("CognitoIdentityClient", "DescribeIdentityPoolCommand").f(void 0, void 0).ser(gt4).de(We4).build() {
      static {
        m0(this, "DescribeIdentityPoolCommand")
      }
    },
    izQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").f(_zQ, yzQ).ser(ut4).de(Xe4).build() {
      static {
        m0(this, "GetCredentialsForIdentityCommand")
      }
    },
    nzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").f(xzQ, void 0).ser(mt4).de(Ve4).build() {
      static {
        m0(this, "GetIdCommand")
      }
    },
    azQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetIdentityPoolRoles", {}).n("CognitoIdentityClient", "GetIdentityPoolRolesCommand").f(void 0, void 0).ser(dt4).de(Fe4).build() {
      static {
        m0(this, "GetIdentityPoolRolesCommand")
      }
    },
    szQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdToken", {}).n("CognitoIdentityClient", "GetOpenIdTokenCommand").f(vzQ, bzQ).ser(ct4).de(Ke4).build() {
      static {
        m0(this, "GetOpenIdTokenCommand")
      }
    },
    rzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdTokenForDeveloperIdentity", {}).n("CognitoIdentityClient", "GetOpenIdTokenForDeveloperIdentityCommand").f(fzQ, hzQ).ser(pt4).de(De4).build() {
      static {
        m0(this, "GetOpenIdTokenForDeveloperIdentityCommand")
      }
    },
    ozQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "GetPrincipalTagAttributeMapCommand").f(void 0, void 0).ser(lt4).de(He4).build() {
      static {
        m0(this, "GetPrincipalTagAttributeMapCommand")
      }
    },
    tzQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentities", {}).n("CognitoIdentityClient", "ListIdentitiesCommand").f(void 0, void 0).ser(it4).de(Ce4).build() {
      static {
        m0(this, "ListIdentitiesCommand")
      }
    },
    IO1 = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentityPools", {}).n("CognitoIdentityClient", "ListIdentityPoolsCommand").f(void 0, void 0).ser(nt4).de(Ee4).build() {
      static {
        m0(this, "ListIdentityPoolsCommand")
      }
    },
    ezQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListTagsForResource", {}).n("CognitoIdentityClient", "ListTagsForResourceCommand").f(void 0, void 0).ser(at4).de(ze4).build() {
      static {
        m0(this, "ListTagsForResourceCommand")
      }
    },
    AUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "LookupDeveloperIdentity", {}).n("CognitoIdentityClient", "LookupDeveloperIdentityCommand").f(void 0, void 0).ser(st4).de(Ue4).build() {
      static {
        m0(this, "LookupDeveloperIdentityCommand")
      }
    },
    QUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "MergeDeveloperIdentities", {}).n("CognitoIdentityClient", "MergeDeveloperIdentitiesCommand").f(void 0, void 0).ser(rt4).de($e4).build() {
      static {
        m0(this, "MergeDeveloperIdentitiesCommand")
      }
    },
    BUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetIdentityPoolRoles", {}).n("CognitoIdentityClient", "SetIdentityPoolRolesCommand").f(void 0, void 0).ser(ot4).de(we4).build() {
      static {
        m0(this, "SetIdentityPoolRolesCommand")
      }
    },
    GUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "SetPrincipalTagAttributeMapCommand").f(void 0, void 0).ser(tt4).de(qe4).build() {
      static {
        m0(this, "SetPrincipalTagAttributeMapCommand")
      }
    },
    ZUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "TagResource", {}).n("CognitoIdentityClient", "TagResourceCommand").f(void 0, void 0).ser(et4).de(Ne4).build() {
      static {
        m0(this, "TagResourceCommand")
      }
    },
    IUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkDeveloperIdentity", {}).n("CognitoIdentityClient", "UnlinkDeveloperIdentityCommand").f(void 0, void 0).ser(Ae4).de(Le4).build() {
      static {
        m0(this, "UnlinkDeveloperIdentityCommand")
      }
    },
    YUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkIdentity", {}).n("CognitoIdentityClient", "UnlinkIdentityCommand").f(gzQ, void 0).ser(Qe4).de(Me4).build() {
      static {
        m0(this, "UnlinkIdentityCommand")
      }
    },
    JUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UntagResource", {}).n("CognitoIdentityClient", "UntagResourceCommand").f(void 0, void 0).ser(Be4).de(Oe4).build() {
      static {
        m0(this, "UntagResourceCommand")
      }
    },
    WUQ = class extends h0.Command.classBuilder().ep(hY).m(function(A, Q, B, G) {
      return [(0, gY.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lI.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UpdateIdentityPool", {}).n("CognitoIdentityClient", "UpdateIdentityPoolCommand").f(void 0, void 0).ser(Ge4).de(Re4).build() {
      static {
        m0(this, "UpdateIdentityPoolCommand")
      }
    },
    ce4 = {
      CreateIdentityPoolCommand: mzQ,
      DeleteIdentitiesCommand: dzQ,
      DeleteIdentityPoolCommand: czQ,
      DescribeIdentityCommand: pzQ,
      DescribeIdentityPoolCommand: lzQ,
      GetCredentialsForIdentityCommand: izQ,
      GetIdCommand: nzQ,
      GetIdentityPoolRolesCommand: azQ,
      GetOpenIdTokenCommand: szQ,
      GetOpenIdTokenForDeveloperIdentityCommand: rzQ,
      GetPrincipalTagAttributeMapCommand: ozQ,
      ListIdentitiesCommand: tzQ,
      ListIdentityPoolsCommand: IO1,
      ListTagsForResourceCommand: ezQ,
      LookupDeveloperIdentityCommand: AUQ,
      MergeDeveloperIdentitiesCommand: QUQ,
      SetIdentityPoolRolesCommand: BUQ,
      SetPrincipalTagAttributeMapCommand: GUQ,
      TagResourceCommand: ZUQ,
      UnlinkDeveloperIdentityCommand: IUQ,
      UnlinkIdentityCommand: YUQ,
      UntagResourceCommand: JUQ,
      UpdateIdentityPoolCommand: WUQ
    },
    XUQ = class extends ZO1 {
      static {
        m0(this, "CognitoIdentity")
      }
    };
  (0, h0.createAggregatedClient)(ce4, XUQ);
  var pe4 = (0, juA.createPaginator)(ZO1, IO1, "NextToken", "NextToken", "MaxResults")
})
// @from(Start 3305951, End 3313370)
VO1 = z((fq7, NUQ) => {
  var {
    defineProperty: kuA,
    getOwnPropertyDescriptor: le4,
    getOwnPropertyNames: KUQ
  } = Object, ie4 = Object.prototype.hasOwnProperty, Nw = (A, Q) => kuA(A, "name", {
    value: Q,
    configurable: !0
  }), ne4 = (A, Q) => function() {
    return A && (Q = (0, A[KUQ(A)[0]])(A = 0)), Q
  }, DUQ = (A, Q) => {
    for (var B in Q) kuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ae4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of KUQ(Q))
        if (!ie4.call(A, Z) && Z !== B) kuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = le4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, se4 = (A) => ae4(kuA({}, "__esModule", {
    value: !0
  }), A), JO1 = {};
  DUQ(JO1, {
    CognitoIdentityClient: () => _uA.CognitoIdentityClient,
    GetCredentialsForIdentityCommand: () => _uA.GetCredentialsForIdentityCommand,
    GetIdCommand: () => _uA.GetIdCommand
  });
  var _uA, HUQ = ne4({
      "src/loadCognitoIdentity.ts"() {
        _uA = FUQ()
      }
    }),
    CUQ = {};
  DUQ(CUQ, {
    fromCognitoIdentity: () => XO1,
    fromCognitoIdentityPool: () => wUQ
  });
  NUQ.exports = se4(CUQ);
  var yuA = j2();

  function WO1(A) {
    return Promise.all(Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      if (typeof G === "string") Q.push([B, G]);
      else Q.push(G().then((Z) => [B, Z]));
      return Q
    }, [])).then((Q) => Q.reduce((B, [G, Z]) => {
      return B[G] = Z, B
    }, {}))
  }
  Nw(WO1, "resolveLogins");

  function XO1(A) {
    return async (Q) => {
      A.logger?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
      let {
        GetCredentialsForIdentityCommand: B,
        CognitoIdentityClient: G
      } = await Promise.resolve().then(() => (HUQ(), JO1)), Z = Nw((X) => A.clientConfig?.[X] ?? A.parentClientConfig?.[X] ?? Q?.callerClientConfig?.[X], "fromConfigs"), {
        Credentials: {
          AccessKeyId: I = EUQ(A.logger),
          Expiration: Y,
          SecretKey: J = UUQ(A.logger),
          SessionToken: W
        } = zUQ(A.logger)
      } = await (A.client ?? new G(Object.assign({}, A.clientConfig ?? {}, {
        region: Z("region"),
        profile: Z("profile")
      }))).send(new B({
        CustomRoleArn: A.customRoleArn,
        IdentityId: A.identityId,
        Logins: A.logins ? await WO1(A.logins) : void 0
      }));
      return {
        identityId: A.identityId,
        accessKeyId: I,
        secretAccessKey: J,
        sessionToken: W,
        expiration: Y
      }
    }
  }
  Nw(XO1, "fromCognitoIdentity");

  function EUQ(A) {
    throw new yuA.CredentialsProviderError("Response from Amazon Cognito contained no access key ID", {
      logger: A
    })
  }
  Nw(EUQ, "throwOnMissingAccessKeyId");

  function zUQ(A) {
    throw new yuA.CredentialsProviderError("Response from Amazon Cognito contained no credentials", {
      logger: A
    })
  }
  Nw(zUQ, "throwOnMissingCredentials");

  function UUQ(A) {
    throw new yuA.CredentialsProviderError("Response from Amazon Cognito contained no secret key", {
      logger: A
    })
  }
  Nw(UUQ, "throwOnMissingSecretKey");
  var YO1 = "IdentityIds",
    re4 = class {
      constructor(A = "aws:cognito-identity-ids") {
        this.dbName = A
      }
      static {
        Nw(this, "IndexedDbStorage")
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
          return new Promise((Z, I) => {
            G.onerror = () => I(G.error), G.onsuccess = () => Z()
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
            }, G.createObjectStore(YO1, {
              keyPath: "id"
            })
          }
        })
      }
      withObjectStore(A, Q) {
        return this.getDb().then((B) => {
          let G = B.transaction(YO1, A);
          return G.oncomplete = () => B.close(), new Promise((Z, I) => {
            G.onerror = () => I(G.error), Z(Q(G.objectStore(YO1)))
          }).catch((Z) => {
            throw B.close(), Z
          })
        })
      }
    },
    oe4 = class {
      constructor(A = {}) {
        this.store = A
      }
      static {
        Nw(this, "InMemoryStorage")
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
    },
    te4 = new oe4;

  function $UQ() {
    if (typeof self === "object" && self.indexedDB) return new re4;
    if (typeof window === "object" && window.localStorage) return window.localStorage;
    return te4
  }
  Nw($UQ, "localStorage");

  function wUQ({
    accountId: A,
    cache: Q = $UQ(),
    client: B,
    clientConfig: G,
    customRoleArn: Z,
    identityPoolId: I,
    logins: Y,
    userIdentifier: J = !Y || Object.keys(Y).length === 0 ? "ANONYMOUS" : void 0,
    logger: W,
    parentClientConfig: X
  }) {
    W?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
    let V = J ? `aws:cognito-identity-credentials:${I}:${J}` : void 0,
      F = Nw(async (K) => {
        let {
          GetIdCommand: D,
          CognitoIdentityClient: H
        } = await Promise.resolve().then(() => (HUQ(), JO1)), C = Nw((q) => G?.[q] ?? X?.[q] ?? K?.callerClientConfig?.[q], "fromConfigs"), E = B ?? new H(Object.assign({}, G ?? {}, {
          region: C("region"),
          profile: C("profile")
        })), U = V && await Q.getItem(V);
        if (!U) {
          let {
            IdentityId: q = qUQ(W)
          } = await E.send(new D({
            AccountId: A,
            IdentityPoolId: I,
            Logins: Y ? await WO1(Y) : void 0
          }));
          if (U = q, V) Promise.resolve(Q.setItem(V, U)).catch(() => {})
        }
        return F = XO1({
          client: E,
          customRoleArn: Z,
          logins: Y,
          identityId: U
        }), F(K)
      }, "provider");
    return (K) => F(K).catch(async (D) => {
      if (V) Promise.resolve(Q.removeItem(V)).catch(() => {});
      throw D
    })
  }
  Nw(wUQ, "fromCognitoIdentityPool");

  function qUQ(A) {
    throw new yuA.CredentialsProviderError("Response from Amazon Cognito contained no identity ID", {
      logger: A
    })
  }
  Nw(qUQ, "throwOnMissingId")
})
// @from(Start 3313376, End 3313616)
OUQ = z((LUQ) => {
  Object.defineProperty(LUQ, "__esModule", {
    value: !0
  });
  LUQ.fromCognitoIdentity = void 0;
  var ee4 = VO1(),
    AA8 = (A) => (0, ee4.fromCognitoIdentity)({
      ...A
    });
  LUQ.fromCognitoIdentity = AA8
})
// @from(Start 3313622, End 3313874)
PUQ = z((RUQ) => {
  Object.defineProperty(RUQ, "__esModule", {
    value: !0
  });
  RUQ.fromCognitoIdentityPool = void 0;
  var QA8 = VO1(),
    BA8 = (A) => (0, QA8.fromCognitoIdentityPool)({
      ...A
    });
  RUQ.fromCognitoIdentityPool = BA8
})
// @from(Start 3313880, End 3314208)
_UQ = z((jUQ) => {
  Object.defineProperty(jUQ, "__esModule", {
    value: !0
  });
  jUQ.fromContainerMetadata = void 0;
  var GA8 = OV(),
    ZA8 = (A) => {
      return A?.logger?.debug("@smithy/credential-provider-imds", "fromContainerMetadata"), (0, GA8.fromContainerMetadata)(A)
    };
  jUQ.fromContainerMetadata = ZA8
})
// @from(Start 3314214, End 3316197)
LL = z((cq7, bUQ) => {
  var {
    defineProperty: xuA,
    getOwnPropertyDescriptor: IA8,
    getOwnPropertyNames: YA8
  } = Object, JA8 = Object.prototype.hasOwnProperty, vuA = (A, Q) => xuA(A, "name", {
    value: Q,
    configurable: !0
  }), WA8 = (A, Q) => {
    for (var B in Q) xuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, XA8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of YA8(Q))
        if (!JA8.call(A, Z) && Z !== B) xuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = IA8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, VA8 = (A) => XA8(xuA({}, "__esModule", {
    value: !0
  }), A), kUQ = {};
  WA8(kUQ, {
    emitWarningIfUnsupportedVersion: () => FA8,
    setCredentialFeature: () => yUQ,
    setFeature: () => xUQ,
    setTokenFeature: () => vUQ,
    state: () => FO1
  });
  bUQ.exports = VA8(kUQ);
  var FO1 = {
      warningEmitted: !1
    },
    FA8 = vuA((A) => {
      if (A && !FO1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) FO1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    }, "emitWarningIfUnsupportedVersion");

  function yUQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  vuA(yUQ, "setCredentialFeature");

  function xUQ(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }
  vuA(xUQ, "setFeature");

  function vUQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  vuA(vUQ, "setTokenFeature")
})
// @from(Start 3316203, End 3317326)
gUQ = z((fUQ) => {
  Object.defineProperty(fUQ, "__esModule", {
    value: !0
  });
  fUQ.checkUrl = void 0;
  var KA8 = j2(),
    DA8 = "169.254.170.2",
    HA8 = "169.254.170.23",
    CA8 = "[fd00:ec2::23]",
    EA8 = (A, Q) => {
      if (A.protocol === "https:") return;
      if (A.hostname === DA8 || A.hostname === HA8 || A.hostname === CA8) return;
      if (A.hostname.includes("[")) {
        if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
      } else {
        if (A.hostname === "localhost") return;
        let B = A.hostname.split("."),
          G = (Z) => {
            let I = parseInt(Z, 10);
            return 0 <= I && I <= 255
          };
        if (B[0] === "127" && G(B[1]) && G(B[2]) && G(B[3]) && B.length === 4) return
      }
      throw new KA8.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
        logger: Q
      })
    };
  fUQ.checkUrl = EA8
})
// @from(Start 3317332, End 3320115)
KO1 = z((lq7, aUQ) => {
  var {
    defineProperty: buA,
    getOwnPropertyDescriptor: zA8,
    getOwnPropertyNames: UA8
  } = Object, $A8 = Object.prototype.hasOwnProperty, fuA = (A, Q) => buA(A, "name", {
    value: Q,
    configurable: !0
  }), wA8 = (A, Q) => {
    for (var B in Q) buA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, qA8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of UA8(Q))
        if (!$A8.call(A, Z) && Z !== B) buA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = zA8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, NA8 = (A) => qA8(buA({}, "__esModule", {
    value: !0
  }), A), uUQ = {};
  wA8(uUQ, {
    AlgorithmId: () => pUQ,
    EndpointURLScheme: () => cUQ,
    FieldPosition: () => lUQ,
    HttpApiKeyAuthLocation: () => dUQ,
    HttpAuthLocation: () => mUQ,
    IniSectionType: () => iUQ,
    RequestHandlerProtocol: () => nUQ,
    SMITHY_CONTEXT_KEY: () => TA8,
    getDefaultClientConfiguration: () => OA8,
    resolveDefaultRuntimeConfig: () => RA8
  });
  aUQ.exports = NA8(uUQ);
  var mUQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(mUQ || {}),
    dUQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(dUQ || {}),
    cUQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(cUQ || {}),
    pUQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(pUQ || {}),
    LA8 = fuA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    MA8 = fuA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    OA8 = fuA((A) => {
      return LA8(A)
    }, "getDefaultClientConfiguration"),
    RA8 = fuA((A) => {
      return MA8(A)
    }, "resolveDefaultRuntimeConfig"),
    lUQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(lUQ || {}),
    TA8 = "__smithy_context",
    iUQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(iUQ || {}),
    nUQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(nUQ || {})
})
// @from(Start 3320121, End 3324627)
Lw = z((iq7, eUQ) => {
  var {
    defineProperty: huA,
    getOwnPropertyDescriptor: PA8,
    getOwnPropertyNames: jA8
  } = Object, SA8 = Object.prototype.hasOwnProperty, vd = (A, Q) => huA(A, "name", {
    value: Q,
    configurable: !0
  }), _A8 = (A, Q) => {
    for (var B in Q) huA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, kA8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jA8(Q))
        if (!SA8.call(A, Z) && Z !== B) huA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = PA8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yA8 = (A) => kA8(huA({}, "__esModule", {
    value: !0
  }), A), sUQ = {};
  _A8(sUQ, {
    Field: () => bA8,
    Fields: () => fA8,
    HttpRequest: () => hA8,
    HttpResponse: () => gA8,
    IHttpRequest: () => rUQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => xA8,
    isValidHostname: () => tUQ,
    resolveHttpHandlerRuntimeConfig: () => vA8
  });
  eUQ.exports = yA8(sUQ);
  var xA8 = vd((A) => {
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
    }, "getHttpHandlerExtensionConfiguration"),
    vA8 = vd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    rUQ = KO1(),
    bA8 = class {
      static {
        vd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = rUQ.FieldPosition.HEADER,
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
    },
    fA8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        vd(this, "Fields")
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
    },
    hA8 = class A {
      static {
        vd(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = oUQ(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function oUQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  vd(oUQ, "cloneQuery");
  var gA8 = class {
    static {
      vd(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function tUQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  vd(tUQ, "isValidHostname")
})
// @from(Start 3324633, End 3338657)
S3 = z((rq7, $O1) => {
  var {
    defineProperty: guA,
    getOwnPropertyDescriptor: uA8,
    getOwnPropertyNames: mA8
  } = Object, dA8 = Object.prototype.hasOwnProperty, j3 = (A, Q) => guA(A, "name", {
    value: Q,
    configurable: !0
  }), cA8 = (A, Q) => {
    for (var B in Q) guA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, HO1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of mA8(Q))
        if (!dA8.call(A, Z) && Z !== B) guA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = uA8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, pA8 = (A, Q, B) => (HO1(A, Q, "default"), B && HO1(B, Q, "default")), lA8 = (A) => HO1(guA({}, "__esModule", {
    value: !0
  }), A), zO1 = {};
  cA8(zO1, {
    Client: () => iA8,
    Command: () => B$Q,
    NoOpLogger: () => X18,
    SENSITIVE_STRING: () => aA8,
    ServiceException: () => rA8,
    _json: () => EO1,
    collectBody: () => DO1.collectBody,
    convertMap: () => V18,
    createAggregatedClient: () => sA8,
    decorateServiceException: () => G$Q,
    emitWarningIfUnsupportedVersion: () => A18,
    extendedEncodeURIComponent: () => DO1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => J18,
    getDefaultClientConfiguration: () => I18,
    getDefaultExtensionConfiguration: () => I$Q,
    getValueFromTextNode: () => Y$Q,
    isSerializableHeaderValue: () => W18,
    loadConfigsForDefaultMode: () => eA8,
    map: () => UO1,
    resolveDefaultRuntimeConfig: () => Y18,
    resolvedPath: () => DO1.resolvedPath,
    serializeDateTime: () => E18,
    serializeFloat: () => C18,
    take: () => F18,
    throwDefaultError: () => Z$Q,
    withBaseException: () => oA8
  });
  $O1.exports = lA8(zO1);
  var Q$Q = uR(),
    iA8 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, Q$Q.constructStack)()
      }
      static {
        j3(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    DO1 = w5(),
    CO1 = KO1(),
    B$Q = class {
      constructor() {
        this.middlewareStack = (0, Q$Q.constructStack)()
      }
      static {
        j3(this, "Command")
      }
      static classBuilder() {
        return new nA8
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [CO1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    nA8 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        j3(this, "ClassBuilder")
      }
      init(A) {
        this._init = A
      }
      ep(A) {
        return this._ep = A, this
      }
      m(A) {
        return this._middlewareFn = A, this
      }
      s(A, Q, B = {}) {
        return this._smithyContext = {
          service: A,
          operation: Q,
          ...B
        }, this
      }
      c(A = {}) {
        return this._additionalContext = A, this
      }
      n(A, Q) {
        return this._clientName = A, this._commandName = Q, this
      }
      f(A = (B) => B, Q = (B) => B) {
        return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
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
          Q;
        return Q = class extends B$Q {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
          }
          static {
            j3(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    aA8 = "***SensitiveInformation***",
    sA8 = j3((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = j3(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    rA8 = class A extends Error {
      static {
        j3(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    G$Q = j3((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    Z$Q = j3(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = tA8(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw G$Q(Y, Q)
    }, "throwDefaultError"),
    oA8 = j3((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        Z$Q({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    tA8 = j3((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    eA8 = j3((A) => {
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
    }, "loadConfigsForDefaultMode"),
    A$Q = !1,
    A18 = j3((A) => {
      if (A && !A$Q && parseInt(A.substring(1, A.indexOf("."))) < 16) A$Q = !0
    }, "emitWarningIfUnsupportedVersion"),
    Q18 = j3((A) => {
      let Q = [];
      for (let B in CO1.AlgorithmId) {
        let G = CO1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    B18 = j3((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    G18 = j3((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    Z18 = j3((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    I$Q = j3((A) => {
      return Object.assign(Q18(A), G18(A))
    }, "getDefaultExtensionConfiguration"),
    I18 = I$Q,
    Y18 = j3((A) => {
      return Object.assign(B18(A), Z18(A))
    }, "resolveDefaultRuntimeConfig"),
    J18 = j3((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    Y$Q = j3((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = Y$Q(A[B]);
      return A
    }, "getValueFromTextNode"),
    W18 = j3((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    X18 = class {
      static {
        j3(this, "NoOpLogger")
      }
      trace() {}
      debug() {}
      info() {}
      warn() {}
      error() {}
    };

  function UO1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, K18(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      J$Q(G, null, I, Y)
    }
    return G
  }
  j3(UO1, "map");
  var V18 = j3((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    F18 = j3((A, Q) => {
      let B = {};
      for (let G in Q) J$Q(B, A, Q, G);
      return B
    }, "take"),
    K18 = j3((A, Q, B) => {
      return UO1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    J$Q = j3((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = D18, W = H18, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    D18 = j3((A) => A != null, "nonNullish"),
    H18 = j3((A) => A, "pass"),
    C18 = j3((A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    }, "serializeFloat"),
    E18 = j3((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    EO1 = j3((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(EO1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = EO1(A[B])
        }
        return Q
      }
      return A
    }, "_json");
  pA8(zO1, s6(), $O1.exports)
})
// @from(Start 3338663, End 3340404)
X$Q = z((W$Q) => {
  Object.defineProperty(W$Q, "__esModule", {
    value: !0
  });
  W$Q.createGetRequest = w18;
  W$Q.getCredentials = q18;
  var wO1 = j2(),
    z18 = Lw(),
    U18 = S3(),
    $18 = Xd();

  function w18(A) {
    return new z18.HttpRequest({
      protocol: A.protocol,
      hostname: A.hostname,
      port: Number(A.port),
      path: A.pathname,
      query: Array.from(A.searchParams.entries()).reduce((Q, [B, G]) => {
        return Q[B] = G, Q
      }, {}),
      fragment: A.hash
    })
  }
  async function q18(A, Q) {
    let G = await (0, $18.sdkStreamMixin)(A.body).transformToString();
    if (A.statusCode === 200) {
      let Z = JSON.parse(G);
      if (typeof Z.AccessKeyId !== "string" || typeof Z.SecretAccessKey !== "string" || typeof Z.Token !== "string" || typeof Z.Expiration !== "string") throw new wO1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
        logger: Q
      });
      return {
        accessKeyId: Z.AccessKeyId,
        secretAccessKey: Z.SecretAccessKey,
        sessionToken: Z.Token,
        expiration: (0, U18.parseRfc3339DateTime)(Z.Expiration)
      }
    }
    if (A.statusCode >= 400 && A.statusCode < 500) {
      let Z = {};
      try {
        Z = JSON.parse(G)
      } catch (I) {}
      throw Object.assign(new wO1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
        logger: Q
      }), {
        Code: Z.Code,
        Message: Z.Message
      })
    }
    throw new wO1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
      logger: Q
    })
  }
})
// @from(Start 3340410, End 3340780)
K$Q = z((V$Q) => {
  Object.defineProperty(V$Q, "__esModule", {
    value: !0
  });
  V$Q.retryWrapper = void 0;
  var M18 = (A, Q, B) => {
    return async () => {
      for (let G = 0; G < Q; ++G) try {
        return await A()
      } catch (Z) {
        await new Promise((I) => setTimeout(I, B))
      }
      return await A()
    }
  };
  V$Q.retryWrapper = M18
})
// @from(Start 3340786, End 3343273)
z$Q = z((C$Q) => {
  Object.defineProperty(C$Q, "__esModule", {
    value: !0
  });
  C$Q.fromHttp = void 0;
  var O18 = sr(),
    R18 = LL(),
    T18 = IZ(),
    D$Q = j2(),
    P18 = O18.__importDefault(UA("fs/promises")),
    j18 = gUQ(),
    H$Q = X$Q(),
    S18 = K$Q(),
    _18 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    k18 = "http://169.254.170.2",
    y18 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    x18 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
    v18 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    b18 = (A = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
      let Q, B = A.awsContainerCredentialsRelativeUri ?? process.env[_18],
        G = A.awsContainerCredentialsFullUri ?? process.env[y18],
        Z = A.awsContainerAuthorizationToken ?? process.env[v18],
        I = A.awsContainerAuthorizationTokenFile ?? process.env[x18],
        Y = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console.warn : A.logger.warn;
      if (B && G) Y("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), Y("awsContainerCredentialsFullUri will take precedence.");
      if (Z && I) Y("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), Y("awsContainerAuthorizationToken will take precedence.");
      if (G) Q = G;
      else if (B) Q = `${k18}${B}`;
      else throw new D$Q.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
        logger: A.logger
      });
      let J = new URL(Q);
      (0, j18.checkUrl)(J, A.logger);
      let W = new T18.NodeHttpHandler({
        requestTimeout: A.timeout ?? 1000,
        connectionTimeout: A.timeout ?? 1000
      });
      return (0, S18.retryWrapper)(async () => {
        let X = (0, H$Q.createGetRequest)(J);
        if (Z) X.headers.Authorization = Z;
        else if (I) X.headers.Authorization = (await P18.default.readFile(I)).toString();
        try {
          let V = await W.handle(X);
          return (0, H$Q.getCredentials)(V.response).then((F) => (0, R18.setCredentialFeature)(F, "CREDENTIALS_HTTP", "z"))
        } catch (V) {
          throw new D$Q.CredentialsProviderError(String(V), {
            logger: A.logger
          })
        }
      }, A.maxRetries ?? 3, A.timeout ?? 1000)
    };
  C$Q.fromHttp = b18
})
// @from(Start 3343279, End 3343531)
uuA = z((qO1) => {
  Object.defineProperty(qO1, "__esModule", {
    value: !0
  });
  qO1.fromHttp = void 0;
  var f18 = z$Q();
  Object.defineProperty(qO1, "fromHttp", {
    enumerable: !0,
    get: function() {
      return f18.fromHttp
    }
  })
})
// @from(Start 3343537, End 3345610)
duA = z((YN7, O$Q) => {
  var {
    defineProperty: muA,
    getOwnPropertyDescriptor: g18,
    getOwnPropertyNames: u18
  } = Object, m18 = Object.prototype.hasOwnProperty, d18 = (A, Q) => muA(A, "name", {
    value: Q,
    configurable: !0
  }), c18 = (A, Q) => {
    for (var B in Q) muA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, p18 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of u18(Q))
        if (!m18.call(A, Z) && Z !== B) muA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = g18(Q, Z)) || G.enumerable
        })
    }
    return A
  }, l18 = (A) => p18(muA({}, "__esModule", {
    value: !0
  }), A), U$Q = {};
  c18(U$Q, {
    ENV_ACCOUNT_ID: () => M$Q,
    ENV_CREDENTIAL_SCOPE: () => L$Q,
    ENV_EXPIRATION: () => N$Q,
    ENV_KEY: () => $$Q,
    ENV_SECRET: () => w$Q,
    ENV_SESSION: () => q$Q,
    fromEnv: () => a18
  });
  O$Q.exports = l18(U$Q);
  var i18 = LL(),
    n18 = j2(),
    $$Q = "AWS_ACCESS_KEY_ID",
    w$Q = "AWS_SECRET_ACCESS_KEY",
    q$Q = "AWS_SESSION_TOKEN",
    N$Q = "AWS_CREDENTIAL_EXPIRATION",
    L$Q = "AWS_CREDENTIAL_SCOPE",
    M$Q = "AWS_ACCOUNT_ID",
    a18 = d18((A) => async () => {
      A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
      let Q = process.env[$$Q],
        B = process.env[w$Q],
        G = process.env[q$Q],
        Z = process.env[N$Q],
        I = process.env[L$Q],
        Y = process.env[M$Q];
      if (Q && B) {
        let J = {
          accessKeyId: Q,
          secretAccessKey: B,
          ...G && {
            sessionToken: G
          },
          ...Z && {
            expiration: new Date(Z)
          },
          ...I && {
            credentialScope: I
          },
          ...Y && {
            accountId: Y
          }
        };
        return (0, i18.setCredentialFeature)(J, "CREDENTIALS_ENV_VARS", "g"), J
      }
      throw new n18.CredentialsProviderError("Unable to find environment variable credentials.", {
        logger: A?.logger
      })
    }, "fromEnv")
})
// @from(Start 3345616, End 3345803)
P$Q = z((R$Q) => {
  Object.defineProperty(R$Q, "__esModule", {
    value: !0
  });
  R$Q.fromEnv = void 0;
  var s18 = duA(),
    r18 = (A) => (0, s18.fromEnv)(A);
  R$Q.fromEnv = r18
})
// @from(Start 3345809, End 3347672)
luA = z((WN7, y$Q) => {
  var {
    defineProperty: puA,
    getOwnPropertyDescriptor: o18,
    getOwnPropertyNames: t18
  } = Object, e18 = Object.prototype.hasOwnProperty, cuA = (A, Q) => puA(A, "name", {
    value: Q,
    configurable: !0
  }), A08 = (A, Q) => {
    for (var B in Q) puA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Q08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of t18(Q))
        if (!e18.call(A, Z) && Z !== B) puA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = o18(Q, Z)) || G.enumerable
        })
    }
    return A
  }, B08 = (A) => Q08(puA({}, "__esModule", {
    value: !0
  }), A), j$Q = {};
  A08(j$Q, {
    getHostHeaderPlugin: () => Z08,
    hostHeaderMiddleware: () => _$Q,
    hostHeaderMiddlewareOptions: () => k$Q,
    resolveHostHeaderConfig: () => S$Q
  });
  y$Q.exports = B08(j$Q);
  var G08 = Lw();

  function S$Q(A) {
    return A
  }
  cuA(S$Q, "resolveHostHeaderConfig");
  var _$Q = cuA((A) => (Q) => async (B) => {
      if (!G08.HttpRequest.isInstance(B.request)) return Q(B);
      let {
        request: G
      } = B, {
        handlerProtocol: Z = ""
      } = A.requestHandler.metadata || {};
      if (Z.indexOf("h2") >= 0 && !G.headers[":authority"]) delete G.headers.host, G.headers[":authority"] = G.hostname + (G.port ? ":" + G.port : "");
      else if (!G.headers.host) {
        let I = G.hostname;
        if (G.port != null) I += `:${G.port}`;
        G.headers.host = I
      }
      return Q(B)
    }, "hostHeaderMiddleware"),
    k$Q = {
      name: "hostHeaderMiddleware",
      step: "build",
      priority: "low",
      tags: ["HOST"],
      override: !0
    },
    Z08 = cuA((A) => ({
      applyToStack: cuA((Q) => {
        Q.add(_$Q(A), k$Q)
      }, "applyToStack")
    }), "getHostHeaderPlugin")
})
// @from(Start 3347678, End 3349978)
nuA = z((XN7, f$Q) => {
  var {
    defineProperty: iuA,
    getOwnPropertyDescriptor: I08,
    getOwnPropertyNames: Y08
  } = Object, J08 = Object.prototype.hasOwnProperty, NO1 = (A, Q) => iuA(A, "name", {
    value: Q,
    configurable: !0
  }), W08 = (A, Q) => {
    for (var B in Q) iuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, X08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Y08(Q))
        if (!J08.call(A, Z) && Z !== B) iuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = I08(Q, Z)) || G.enumerable
        })
    }
    return A
  }, V08 = (A) => X08(iuA({}, "__esModule", {
    value: !0
  }), A), x$Q = {};
  W08(x$Q, {
    getLoggerPlugin: () => F08,
    loggerMiddleware: () => v$Q,
    loggerMiddlewareOptions: () => b$Q
  });
  f$Q.exports = V08(x$Q);
  var v$Q = NO1(() => (A, Q) => async (B) => {
      try {
        let G = await A(B),
          {
            clientName: Z,
            commandName: I,
            logger: Y,
            dynamoDbDocumentClientOptions: J = {}
          } = Q,
          {
            overrideInputFilterSensitiveLog: W,
            overrideOutputFilterSensitiveLog: X
          } = J,
          V = W ?? Q.inputFilterSensitiveLog,
          F = X ?? Q.outputFilterSensitiveLog,
          {
            $metadata: K,
            ...D
          } = G.output;
        return Y?.info?.({
          clientName: Z,
          commandName: I,
          input: V(B.input),
          output: F(D),
          metadata: K
        }), G
      } catch (G) {
        let {
          clientName: Z,
          commandName: I,
          logger: Y,
          dynamoDbDocumentClientOptions: J = {}
        } = Q, {
          overrideInputFilterSensitiveLog: W
        } = J, X = W ?? Q.inputFilterSensitiveLog;
        throw Y?.error?.({
          clientName: Z,
          commandName: I,
          input: X(B.input),
          error: G,
          metadata: G.$metadata
        }), G
      }
    }, "loggerMiddleware"),
    b$Q = {
      name: "loggerMiddleware",
      tags: ["LOGGER"],
      step: "initialize",
      override: !0
    },
    F08 = NO1((A) => ({
      applyToStack: NO1((Q) => {
        Q.add(v$Q(), b$Q)
      }, "applyToStack")
    }), "getLoggerPlugin")
})
// @from(Start 3349984, End 3351916)
ruA = z((VN7, m$Q) => {
  var {
    defineProperty: suA,
    getOwnPropertyDescriptor: K08,
    getOwnPropertyNames: D08
  } = Object, H08 = Object.prototype.hasOwnProperty, auA = (A, Q) => suA(A, "name", {
    value: Q,
    configurable: !0
  }), C08 = (A, Q) => {
    for (var B in Q) suA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, E08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of D08(Q))
        if (!H08.call(A, Z) && Z !== B) suA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = K08(Q, Z)) || G.enumerable
        })
    }
    return A
  }, z08 = (A) => E08(suA({}, "__esModule", {
    value: !0
  }), A), h$Q = {};
  C08(h$Q, {
    addRecursionDetectionMiddlewareOptions: () => u$Q,
    getRecursionDetectionPlugin: () => q08,
    recursionDetectionMiddleware: () => g$Q
  });
  m$Q.exports = z08(h$Q);
  var U08 = Lw(),
    LO1 = "X-Amzn-Trace-Id",
    $08 = "AWS_LAMBDA_FUNCTION_NAME",
    w08 = "_X_AMZN_TRACE_ID",
    g$Q = auA((A) => (Q) => async (B) => {
      let {
        request: G
      } = B;
      if (!U08.HttpRequest.isInstance(G) || A.runtime !== "node") return Q(B);
      let Z = Object.keys(G.headers ?? {}).find((W) => W.toLowerCase() === LO1.toLowerCase()) ?? LO1;
      if (G.headers.hasOwnProperty(Z)) return Q(B);
      let I = process.env[$08],
        Y = process.env[w08],
        J = auA((W) => typeof W === "string" && W.length > 0, "nonEmptyString");
      if (J(I) && J(Y)) G.headers[LO1] = Y;
      return Q({
        ...B,
        request: G
      })
    }, "recursionDetectionMiddleware"),
    u$Q = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: !0,
      priority: "low"
    },
    q08 = auA((A) => ({
      applyToStack: auA((Q) => {
        Q.add(g$Q(A), u$Q)
      }, "applyToStack")
    }), "getRecursionDetectionPlugin")
})