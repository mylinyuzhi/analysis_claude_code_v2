
// @from(Start 3540872, End 3560699)
QT1 = z((OL7, mOQ) => {
  var {
    defineProperty: ymA,
    getOwnPropertyDescriptor: I68,
    getOwnPropertyNames: Y68
  } = Object, J68 = Object.prototype.hasOwnProperty, T6 = (A, Q) => ymA(A, "name", {
    value: Q,
    configurable: !0
  }), W68 = (A, Q) => {
    for (var B in Q) ymA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, X68 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Y68(Q))
        if (!J68.call(A, Z) && Z !== B) ymA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = I68(Q, Z)) || G.enumerable
        })
    }
    return A
  }, V68 = (A) => X68(ymA({}, "__esModule", {
    value: !0
  }), A), NOQ = {};
  W68(NOQ, {
    $Command: () => OOQ.Command,
    AccessDeniedException: () => ROQ,
    AuthorizationPendingException: () => TOQ,
    CreateTokenCommand: () => gOQ,
    CreateTokenRequestFilterSensitiveLog: () => POQ,
    CreateTokenResponseFilterSensitiveLog: () => jOQ,
    ExpiredTokenException: () => SOQ,
    InternalServerException: () => _OQ,
    InvalidClientException: () => kOQ,
    InvalidGrantException: () => yOQ,
    InvalidRequestException: () => xOQ,
    InvalidScopeException: () => vOQ,
    SSOOIDC: () => uOQ,
    SSOOIDCClient: () => MOQ,
    SSOOIDCServiceException: () => Ow,
    SlowDownException: () => bOQ,
    UnauthorizedClientException: () => fOQ,
    UnsupportedGrantTypeException: () => hOQ,
    __Client: () => LOQ.Client
  });
  mOQ.exports = V68(NOQ);
  var COQ = luA(),
    F68 = nuA(),
    K68 = ruA(),
    EOQ = QCA(),
    D68 = f8(),
    eR1 = iB(),
    H68 = LX(),
    C68 = q5(),
    zOQ = D6(),
    LOQ = S3(),
    UOQ = sR1(),
    E68 = T6((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "sso-oauth"
      })
    }, "resolveClientEndpointParameters"),
    z68 = {
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
    U68 = HOQ(),
    $OQ = UmA(),
    wOQ = Lw(),
    qOQ = S3(),
    $68 = T6((A) => {
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
    w68 = T6((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    q68 = T6((A, Q) => {
      let B = Object.assign((0, $OQ.getAwsRegionExtensionConfiguration)(A), (0, qOQ.getDefaultExtensionConfiguration)(A), (0, wOQ.getHttpHandlerExtensionConfiguration)(A), $68(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, $OQ.resolveAwsRegionExtensionConfiguration)(B), (0, qOQ.resolveDefaultRuntimeConfig)(B), (0, wOQ.resolveHttpHandlerRuntimeConfig)(B), w68(B))
    }, "resolveRuntimeExtensions"),
    MOQ = class extends LOQ.Client {
      static {
        T6(this, "SSOOIDCClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, U68.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = E68(Q),
          G = (0, EOQ.resolveUserAgentConfig)(B),
          Z = (0, zOQ.resolveRetryConfig)(G),
          I = (0, D68.resolveRegionConfig)(Z),
          Y = (0, COQ.resolveHostHeaderConfig)(I),
          J = (0, C68.resolveEndpointConfig)(Y),
          W = (0, UOQ.resolveHttpAuthSchemeConfig)(J),
          X = q68(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, EOQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, zOQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, H68.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, COQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, F68.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, K68.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, eR1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: UOQ.defaultSSOOIDCHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: T6(async (V) => new eR1.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, eR1.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    N68 = S3(),
    L68 = q5(),
    M68 = GZ(),
    OOQ = S3(),
    M6A = S3(),
    O68 = S3(),
    Ow = class A extends O68.ServiceException {
      static {
        T6(this, "SSOOIDCServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ROQ = class A extends Ow {
      static {
        T6(this, "AccessDeniedException")
      }
      name = "AccessDeniedException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "AccessDeniedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    TOQ = class A extends Ow {
      static {
        T6(this, "AuthorizationPendingException")
      }
      name = "AuthorizationPendingException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "AuthorizationPendingException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    POQ = T6((A) => ({
      ...A,
      ...A.clientSecret && {
        clientSecret: M6A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: M6A.SENSITIVE_STRING
      },
      ...A.codeVerifier && {
        codeVerifier: M6A.SENSITIVE_STRING
      }
    }), "CreateTokenRequestFilterSensitiveLog"),
    jOQ = T6((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: M6A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: M6A.SENSITIVE_STRING
      },
      ...A.idToken && {
        idToken: M6A.SENSITIVE_STRING
      }
    }), "CreateTokenResponseFilterSensitiveLog"),
    SOQ = class A extends Ow {
      static {
        T6(this, "ExpiredTokenException")
      }
      name = "ExpiredTokenException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "ExpiredTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    _OQ = class A extends Ow {
      static {
        T6(this, "InternalServerException")
      }
      name = "InternalServerException";
      $fault = "server";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InternalServerException",
          $fault: "server",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    kOQ = class A extends Ow {
      static {
        T6(this, "InvalidClientException")
      }
      name = "InvalidClientException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidClientException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    yOQ = class A extends Ow {
      static {
        T6(this, "InvalidGrantException")
      }
      name = "InvalidGrantException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidGrantException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    xOQ = class A extends Ow {
      static {
        T6(this, "InvalidRequestException")
      }
      name = "InvalidRequestException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    vOQ = class A extends Ow {
      static {
        T6(this, "InvalidScopeException")
      }
      name = "InvalidScopeException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidScopeException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    bOQ = class A extends Ow {
      static {
        T6(this, "SlowDownException")
      }
      name = "SlowDownException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "SlowDownException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    fOQ = class A extends Ow {
      static {
        T6(this, "UnauthorizedClientException")
      }
      name = "UnauthorizedClientException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "UnauthorizedClientException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    hOQ = class A extends Ow {
      static {
        T6(this, "UnsupportedGrantTypeException")
      }
      name = "UnsupportedGrantTypeException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "UnsupportedGrantTypeException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    AT1 = nz(),
    R68 = iB(),
    Z2 = S3(),
    T68 = T6(async (A, Q) => {
      let B = (0, R68.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/token");
      let Z;
      return Z = JSON.stringify((0, Z2.take)(A, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: T6((I) => (0, Z2._json)(I), "scope")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateTokenCommand"),
    P68 = T6(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return j68(A, Q);
      let B = (0, Z2.map)({
          $metadata: SL(A)
        }),
        G = (0, Z2.expectNonNull)((0, Z2.expectObject)(await (0, AT1.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, Z2.take)(G, {
          accessToken: Z2.expectString,
          expiresIn: Z2.expectInt32,
          idToken: Z2.expectString,
          refreshToken: Z2.expectString,
          tokenType: Z2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateTokenCommand"),
    j68 = T6(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, AT1.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, AT1.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
          throw await _68(B, Q);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
          throw await k68(B, Q);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
          throw await y68(B, Q);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
          throw await x68(B, Q);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
          throw await v68(B, Q);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
          throw await b68(B, Q);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
          throw await f68(B, Q);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
          throw await h68(B, Q);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
          throw await g68(B, Q);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
          throw await u68(B, Q);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
          throw await m68(B, Q);
        default:
          let Z = B.body;
          return S68({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    S68 = (0, Z2.withBaseException)(Ow),
    _68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new ROQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    k68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new TOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_AuthorizationPendingExceptionRes"),
    y68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new SOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_ExpiredTokenExceptionRes"),
    x68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new _OQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    v68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new kOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_InvalidClientExceptionRes"),
    b68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new yOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_InvalidGrantExceptionRes"),
    f68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new xOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    h68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new vOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_InvalidScopeExceptionRes"),
    g68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new bOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_SlowDownExceptionRes"),
    u68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new fOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedClientExceptionRes"),
    m68 = T6(async (A, Q) => {
      let B = (0, Z2.map)({}),
        G = A.body,
        Z = (0, Z2.take)(G, {
          error: Z2.expectString,
          error_description: Z2.expectString
        });
      Object.assign(B, Z);
      let I = new hOQ({
        $metadata: SL(A),
        ...B
      });
      return (0, Z2.decorateServiceException)(I, A.body)
    }, "de_UnsupportedGrantTypeExceptionRes"),
    SL = T6((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    gOQ = class extends OOQ.Command.classBuilder().ep(z68).m(function(A, Q, B, G) {
      return [(0, M68.getSerdePlugin)(B, this.serialize, this.deserialize), (0, L68.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").f(POQ, jOQ).ser(T68).de(P68).build() {
      static {
        T6(this, "CreateTokenCommand")
      }
    },
    d68 = {
      CreateTokenCommand: gOQ
    },
    uOQ = class extends MOQ {
      static {
        T6(this, "SSOOIDC")
      }
    };
  (0, N68.createAggregatedClient)(d68, uOQ)
})
// @from(Start 3560705, End 3566874)
sOQ = z((jL7, aOQ) => {
  var {
    create: c68,
    defineProperty: XCA,
    getOwnPropertyDescriptor: p68,
    getOwnPropertyNames: l68,
    getPrototypeOf: i68
  } = Object, n68 = Object.prototype.hasOwnProperty, Jb = (A, Q) => XCA(A, "name", {
    value: Q,
    configurable: !0
  }), a68 = (A, Q) => {
    for (var B in Q) XCA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, pOQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of l68(Q))
        if (!n68.call(A, Z) && Z !== B) XCA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = p68(Q, Z)) || G.enumerable
        })
    }
    return A
  }, lOQ = (A, Q, B) => (B = A != null ? c68(i68(A)) : {}, pOQ(Q || !A || !A.__esModule ? XCA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), s68 = (A) => pOQ(XCA({}, "__esModule", {
    value: !0
  }), A), iOQ = {};
  a68(iOQ, {
    fromEnvSigningName: () => t68,
    fromSso: () => nOQ,
    fromStatic: () => I58,
    nodeProvider: () => Y58
  });
  aOQ.exports = s68(iOQ);
  var r68 = LL(),
    o68 = fO1(),
    Rw = j2(),
    t68 = Jb(({
      logger: A,
      signingName: Q
    } = {}) => async () => {
      if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !Q) throw new Rw.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
        logger: A
      });
      let B = (0, o68.getBearerTokenEnvKey)(Q);
      if (!(B in process.env)) throw new Rw.TokenProviderError(`Token not present in '${B}' environment variable`, {
        logger: A
      });
      let G = {
        token: process.env[B]
      };
      return (0, r68.setTokenFeature)(G, "BEARER_SERVICE_ENV_VARS", "3"), G
    }, "fromEnvSigningName"),
    e68 = 300000,
    BT1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.",
    A58 = Jb(async (A, Q = {}) => {
      let {
        SSOOIDCClient: B
      } = await Promise.resolve().then(() => lOQ(QT1()));
      return new B(Object.assign({}, Q.clientConfig ?? {}, {
        region: A ?? Q.clientConfig?.region,
        logger: Q.clientConfig?.logger ?? Q.parentClientConfig?.logger
      }))
    }, "getSsoOidcClient"),
    Q58 = Jb(async (A, Q, B = {}) => {
      let {
        CreateTokenCommand: G
      } = await Promise.resolve().then(() => lOQ(QT1()));
      return (await A58(Q, B)).send(new G({
        clientId: A.clientId,
        clientSecret: A.clientSecret,
        refreshToken: A.refreshToken,
        grantType: "refresh_token"
      }))
    }, "getNewSsoOidcToken"),
    dOQ = Jb((A) => {
      if (A.expiration && A.expiration.getTime() < Date.now()) throw new Rw.TokenProviderError(`Token is expired. ${BT1}`, !1)
    }, "validateTokenExpiry"),
    Do = Jb((A, Q, B = !1) => {
      if (typeof Q > "u") throw new Rw.TokenProviderError(`Value not present for '${A}' in SSO Token${B?". Cannot refresh":""}. ${BT1}`, !1)
    }, "validateTokenKey"),
    WCA = SG(),
    B58 = UA("fs"),
    {
      writeFile: G58
    } = B58.promises,
    Z58 = Jb((A, Q) => {
      let B = (0, WCA.getSSOTokenFilepath)(A),
        G = JSON.stringify(Q, null, 2);
      return G58(B, G)
    }, "writeSSOTokenToFile"),
    cOQ = new Date(0),
    nOQ = Jb((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      let B = {
        ...A,
        parentClientConfig: {
          ...Q,
          ...A.parentClientConfig
        }
      };
      B.logger?.debug("@aws-sdk/token-providers - fromSso");
      let G = await (0, WCA.parseKnownFiles)(B),
        Z = (0, WCA.getProfileName)({
          profile: B.profile ?? Q?.profile
        }),
        I = G[Z];
      if (!I) throw new Rw.TokenProviderError(`Profile '${Z}' could not be found in shared credentials file.`, !1);
      else if (!I.sso_session) throw new Rw.TokenProviderError(`Profile '${Z}' is missing required property 'sso_session'.`);
      let Y = I.sso_session,
        W = (await (0, WCA.loadSsoSessionData)(B))[Y];
      if (!W) throw new Rw.TokenProviderError(`Sso session '${Y}' could not be found in shared credentials file.`, !1);
      for (let C of ["sso_start_url", "sso_region"])
        if (!W[C]) throw new Rw.TokenProviderError(`Sso session '${Y}' is missing required property '${C}'.`, !1);
      let {
        sso_start_url: X,
        sso_region: V
      } = W, F;
      try {
        F = await (0, WCA.getSSOTokenFromFile)(Y)
      } catch (C) {
        throw new Rw.TokenProviderError(`The SSO session token associated with profile=${Z} was not found or is invalid. ${BT1}`, !1)
      }
      Do("accessToken", F.accessToken), Do("expiresAt", F.expiresAt);
      let {
        accessToken: K,
        expiresAt: D
      } = F, H = {
        token: K,
        expiration: new Date(D)
      };
      if (H.expiration.getTime() - Date.now() > e68) return H;
      if (Date.now() - cOQ.getTime() < 30000) return dOQ(H), H;
      Do("clientId", F.clientId, !0), Do("clientSecret", F.clientSecret, !0), Do("refreshToken", F.refreshToken, !0);
      try {
        cOQ.setTime(Date.now());
        let C = await Q58(F, V, B);
        Do("accessToken", C.accessToken), Do("expiresIn", C.expiresIn);
        let E = new Date(Date.now() + C.expiresIn * 1000);
        try {
          await Z58(Y, {
            ...F,
            accessToken: C.accessToken,
            expiresAt: E.toISOString(),
            refreshToken: C.refreshToken
          })
        } catch (U) {}
        return {
          token: C.accessToken,
          expiration: E
        }
      } catch (C) {
        return dOQ(H), H
      }
    }, "fromSso"),
    I58 = Jb(({
      token: A,
      logger: Q
    }) => async () => {
      if (Q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new Rw.TokenProviderError("Please pass a valid token to fromStatic", !1);
      return A
    }, "fromStatic"),
    Y58 = Jb((A = {}) => (0, Rw.memoize)((0, Rw.chain)(nOQ(A), async () => {
      throw new Rw.TokenProviderError("Could not load token from any providers", !1)
    }), (Q) => Q.expiration !== void 0 && Q.expiration.getTime() - Date.now() < 300000, (Q) => Q.expiration !== void 0), "nodeProvider")
})
// @from(Start 3566880, End 3574122)
fmA = z((SL7, ZRQ) => {
  var {
    defineProperty: vmA,
    getOwnPropertyDescriptor: J58,
    getOwnPropertyNames: tOQ
  } = Object, W58 = Object.prototype.hasOwnProperty, bmA = (A, Q) => vmA(A, "name", {
    value: Q,
    configurable: !0
  }), X58 = (A, Q) => function() {
    return A && (Q = (0, A[tOQ(A)[0]])(A = 0)), Q
  }, eOQ = (A, Q) => {
    for (var B in Q) vmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, V58 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of tOQ(Q))
        if (!W58.call(A, Z) && Z !== B) vmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = J58(Q, Z)) || G.enumerable
        })
    }
    return A
  }, F58 = (A) => V58(vmA({}, "__esModule", {
    value: !0
  }), A), ARQ = {};
  eOQ(ARQ, {
    GetRoleCredentialsCommand: () => GT1.GetRoleCredentialsCommand,
    SSOClient: () => GT1.SSOClient
  });
  var GT1, K58 = X58({
      "src/loadSso.ts"() {
        GT1 = xMQ()
      }
    }),
    QRQ = {};
  eOQ(QRQ, {
    fromSSO: () => H58,
    isSsoProfile: () => BRQ,
    validateSsoProfile: () => GRQ
  });
  ZRQ.exports = F58(QRQ);
  var BRQ = bmA((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    rOQ = LL(),
    D58 = sOQ(),
    nR = j2(),
    xmA = SG(),
    VCA = !1,
    oOQ = bmA(async ({
      ssoStartUrl: A,
      ssoSession: Q,
      ssoAccountId: B,
      ssoRegion: G,
      ssoRoleName: Z,
      ssoClient: I,
      clientConfig: Y,
      parentClientConfig: J,
      profile: W,
      logger: X
    }) => {
      let V, F = "To refresh this SSO session run aws sso login with the corresponding profile.";
      if (Q) try {
        let v = await (0, D58.fromSso)({
          profile: W
        })();
        V = {
          accessToken: v.token,
          expiresAt: new Date(v.expiration).toISOString()
        }
      } catch (v) {
        throw new nR.CredentialsProviderError(v.message, {
          tryNextLink: VCA,
          logger: X
        })
      } else try {
        V = await (0, xmA.getSSOTokenFromFile)(A)
      } catch (v) {
        throw new nR.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
          tryNextLink: VCA,
          logger: X
        })
      }
      if (new Date(V.expiresAt).getTime() - Date.now() <= 0) throw new nR.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: VCA,
        logger: X
      });
      let {
        accessToken: K
      } = V, {
        SSOClient: D,
        GetRoleCredentialsCommand: H
      } = await Promise.resolve().then(() => (K58(), ARQ)), C = I || new D(Object.assign({}, Y ?? {}, {
        logger: Y?.logger ?? J?.logger,
        region: Y?.region ?? G
      })), E;
      try {
        E = await C.send(new H({
          accountId: B,
          roleName: Z,
          accessToken: K
        }))
      } catch (v) {
        throw new nR.CredentialsProviderError(v, {
          tryNextLink: VCA,
          logger: X
        })
      }
      let {
        roleCredentials: {
          accessKeyId: U,
          secretAccessKey: q,
          sessionToken: w,
          expiration: N,
          credentialScope: R,
          accountId: T
        } = {}
      } = E;
      if (!U || !q || !w || !N) throw new nR.CredentialsProviderError("SSO returns an invalid temporary credential.", {
        tryNextLink: VCA,
        logger: X
      });
      let y = {
        accessKeyId: U,
        secretAccessKey: q,
        sessionToken: w,
        expiration: new Date(N),
        ...R && {
          credentialScope: R
        },
        ...T && {
          accountId: T
        }
      };
      if (Q)(0, rOQ.setCredentialFeature)(y, "CREDENTIALS_SSO", "s");
      else(0, rOQ.setCredentialFeature)(y, "CREDENTIALS_SSO_LEGACY", "u");
      return y
    }, "resolveSSOCredentials"),
    GRQ = bmA((A, Q) => {
      let {
        sso_start_url: B,
        sso_account_id: G,
        sso_region: Z,
        sso_role_name: I
      } = A;
      if (!B || !G || !Z || !I) throw new nR.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
        tryNextLink: !1,
        logger: Q
      });
      return A
    }, "validateSsoProfile"),
    H58 = bmA((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
      let {
        ssoStartUrl: B,
        ssoAccountId: G,
        ssoRegion: Z,
        ssoRoleName: I,
        ssoSession: Y
      } = A, {
        ssoClient: J
      } = A, W = (0, xmA.getProfileName)({
        profile: A.profile ?? Q?.profile
      });
      if (!B && !G && !Z && !I && !Y) {
        let V = (await (0, xmA.parseKnownFiles)(A))[W];
        if (!V) throw new nR.CredentialsProviderError(`Profile ${W} was not found.`, {
          logger: A.logger
        });
        if (!BRQ(V)) throw new nR.CredentialsProviderError(`Profile ${W} is not configured with SSO credentials.`, {
          logger: A.logger
        });
        if (V?.sso_session) {
          let U = (await (0, xmA.loadSsoSessionData)(A))[V.sso_session],
            q = ` configurations in profile ${W} and sso-session ${V.sso_session}`;
          if (Z && Z !== U.sso_region) throw new nR.CredentialsProviderError("Conflicting SSO region" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          if (B && B !== U.sso_start_url) throw new nR.CredentialsProviderError("Conflicting SSO start_url" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          V.sso_region = U.sso_region, V.sso_start_url = U.sso_start_url
        }
        let {
          sso_start_url: F,
          sso_account_id: K,
          sso_region: D,
          sso_role_name: H,
          sso_session: C
        } = GRQ(V, A.logger);
        return oOQ({
          ssoStartUrl: F,
          ssoSession: C,
          ssoAccountId: K,
          ssoRegion: D,
          ssoRoleName: H,
          ssoClient: J,
          clientConfig: A.clientConfig,
          parentClientConfig: A.parentClientConfig,
          profile: W
        })
      } else if (!B || !G || !Z || !I) throw new nR.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
        tryNextLink: !1,
        logger: A.logger
      });
      else return oOQ({
        ssoStartUrl: B,
        ssoSession: Y,
        ssoAccountId: G,
        ssoRegion: Z,
        ssoRoleName: I,
        ssoClient: J,
        clientConfig: A.clientConfig,
        parentClientConfig: A.parentClientConfig,
        profile: W
      })
    }, "fromSSO")
})
// @from(Start 3574128, End 3576452)
ZT1 = z((uS) => {
  var C58 = uS && uS.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    E58 = uS && uS.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    z58 = uS && uS.__importStar || function() {
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
            if (G[Z] !== "default") C58(B, Q, G[Z])
        }
        return E58(B, Q), B
      }
    }();
  Object.defineProperty(uS, "__esModule", {
    value: !0
  });
  uS.fromWebToken = void 0;
  var U58 = (A) => async (Q) => {
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
      } = await Promise.resolve().then(() => z58(wmA()));
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
  uS.fromWebToken = U58
})
// @from(Start 3576458, End 3577533)
WRQ = z((YRQ) => {
  Object.defineProperty(YRQ, "__esModule", {
    value: !0
  });
  YRQ.fromTokenFile = void 0;
  var $58 = LL(),
    w58 = j2(),
    q58 = UA("fs"),
    N58 = ZT1(),
    IRQ = "AWS_WEB_IDENTITY_TOKEN_FILE",
    L58 = "AWS_ROLE_ARN",
    M58 = "AWS_ROLE_SESSION_NAME",
    O58 = (A = {}) => async () => {
      A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      let Q = A?.webIdentityTokenFile ?? process.env[IRQ],
        B = A?.roleArn ?? process.env[L58],
        G = A?.roleSessionName ?? process.env[M58];
      if (!Q || !B) throw new w58.CredentialsProviderError("Web identity configuration not specified", {
        logger: A.logger
      });
      let Z = await (0, N58.fromWebToken)({
        ...A,
        webIdentityToken: (0, q58.readFileSync)(Q, {
          encoding: "ascii"
        }),
        roleArn: B,
        roleSessionName: G
      })();
      if (Q === process.env[IRQ])(0, $58.setCredentialFeature)(Z, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      return Z
    };
  YRQ.fromTokenFile = O58
})
// @from(Start 3577539, End 3578235)
FCA = z((yL7, hmA) => {
  var {
    defineProperty: XRQ,
    getOwnPropertyDescriptor: R58,
    getOwnPropertyNames: T58
  } = Object, P58 = Object.prototype.hasOwnProperty, IT1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of T58(Q))
        if (!P58.call(A, Z) && Z !== B) XRQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = R58(Q, Z)) || G.enumerable
        })
    }
    return A
  }, VRQ = (A, Q, B) => (IT1(A, Q, "default"), B && IT1(B, Q, "default")), j58 = (A) => IT1(XRQ({}, "__esModule", {
    value: !0
  }), A), YT1 = {};
  hmA.exports = j58(YT1);
  VRQ(YT1, WRQ(), hmA.exports);
  VRQ(YT1, ZT1(), hmA.exports)
})
// @from(Start 3578241, End 3587963)
XT1 = z((xL7, zRQ) => {
  var {
    create: S58,
    defineProperty: DCA,
    getOwnPropertyDescriptor: _58,
    getOwnPropertyNames: k58,
    getPrototypeOf: y58
  } = Object, x58 = Object.prototype.hasOwnProperty, kX = (A, Q) => DCA(A, "name", {
    value: Q,
    configurable: !0
  }), v58 = (A, Q) => {
    for (var B in Q) DCA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, HRQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of k58(Q))
        if (!x58.call(A, Z) && Z !== B) DCA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _58(Q, Z)) || G.enumerable
        })
    }
    return A
  }, md = (A, Q, B) => (B = A != null ? S58(y58(A)) : {}, HRQ(Q || !A || !A.__esModule ? DCA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), b58 = (A) => HRQ(DCA({}, "__esModule", {
    value: !0
  }), A), CRQ = {};
  v58(CRQ, {
    fromIni: () => a58
  });
  zRQ.exports = b58(CRQ);
  var WT1 = SG(),
    dd = LL(),
    KCA = j2(),
    f58 = kX((A, Q, B) => {
      let G = {
        EcsContainer: kX(async (Z) => {
          let {
            fromHttp: I
          } = await Promise.resolve().then(() => md(uuA())), {
            fromContainerMetadata: Y
          } = await Promise.resolve().then(() => md(OV()));
          return B?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => (0, KCA.chain)(I(Z ?? {}), Y(Z))().then(JT1)
        }, "EcsContainer"),
        Ec2InstanceMetadata: kX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
          let {
            fromInstanceMetadata: I
          } = await Promise.resolve().then(() => md(OV()));
          return async () => I(Z)().then(JT1)
        }, "Ec2InstanceMetadata"),
        Environment: kX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
          let {
            fromEnv: I
          } = await Promise.resolve().then(() => md(duA()));
          return async () => I(Z)().then(JT1)
        }, "Environment")
      };
      if (A in G) return G[A];
      else throw new KCA.CredentialsProviderError(`Unsupported credential source in profile ${Q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
        logger: B
      })
    }, "resolveCredentialSource"),
    JT1 = kX((A) => (0, dd.setCredentialFeature)(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"), "setNamedProvider"),
    h58 = kX((A, {
      profile: Q = "default",
      logger: B
    } = {}) => {
      return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (g58(A, {
        profile: Q,
        logger: B
      }) || u58(A, {
        profile: Q,
        logger: B
      }))
    }, "isAssumeRoleProfile"),
    g58 = kX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.source_profile === "string" && typeof A.credential_source > "u";
      if (G) B?.debug?.(`    ${Q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
      return G
    }, "isAssumeRoleWithSourceProfile"),
    u58 = kX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.credential_source === "string" && typeof A.source_profile > "u";
      if (G) B?.debug?.(`    ${Q} isCredentialSourceProfile credential_source=${A.credential_source}`);
      return G
    }, "isCredentialSourceProfile"),
    m58 = kX(async (A, Q, B, G = {}) => {
      B.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
      let Z = Q[A],
        {
          source_profile: I,
          region: Y
        } = Z;
      if (!B.roleAssumer) {
        let {
          getDefaultRoleAssumer: W
        } = await Promise.resolve().then(() => md(wmA()));
        B.roleAssumer = W({
          ...B.clientConfig,
          credentialProviderLogger: B.logger,
          parentClientConfig: {
            ...B?.parentClientConfig,
            region: Y ?? B?.parentClientConfig?.region
          }
        }, B.clientPlugins)
      }
      if (I && I in G) throw new KCA.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${(0,WT1.getProfileName)(B)}. Profiles visited: ` + Object.keys(G).join(", "), {
        logger: B.logger
      });
      B.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${I?`source_profile=[${I}]`:`profile=[${A}]`}`);
      let J = I ? ERQ(I, Q, B, {
        ...G,
        [I]: !0
      }, FRQ(Q[I] ?? {})) : (await f58(Z.credential_source, A, B.logger)(B))();
      if (FRQ(Z)) return J.then((W) => (0, dd.setCredentialFeature)(W, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
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
          if (!B.mfaCodeProvider) throw new KCA.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
            logger: B.logger,
            tryNextLink: !1
          });
          W.SerialNumber = X, W.TokenCode = await B.mfaCodeProvider(X)
        }
        let V = await J;
        return B.roleAssumer(V, W).then((F) => (0, dd.setCredentialFeature)(F, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
      }
    }, "resolveAssumeRoleCredentials"),
    FRQ = kX((A) => {
      return !A.role_arn && !!A.credential_source
    }, "isCredentialSourceWithoutRoleArn"),
    d58 = kX((A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", "isProcessProfile"),
    c58 = kX(async (A, Q) => Promise.resolve().then(() => md(NmA())).then(({
      fromProcess: B
    }) => B({
      ...A,
      profile: Q
    })().then((G) => (0, dd.setCredentialFeature)(G, "CREDENTIALS_PROFILE_PROCESS", "v"))), "resolveProcessCredentials"),
    p58 = kX(async (A, Q, B = {}) => {
      let {
        fromSSO: G
      } = await Promise.resolve().then(() => md(fmA()));
      return G({
        profile: A,
        logger: B.logger,
        parentClientConfig: B.parentClientConfig,
        clientConfig: B.clientConfig
      })().then((Z) => {
        if (Q.sso_session) return (0, dd.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO", "r");
        else return (0, dd.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
      })
    }, "resolveSsoCredentials"),
    l58 = kX((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    KRQ = kX((A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, "isStaticCredsProfile"),
    DRQ = kX(async (A, Q) => {
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
      return (0, dd.setCredentialFeature)(B, "CREDENTIALS_PROFILE", "n")
    }, "resolveStaticCredentials"),
    i58 = kX((A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, "isWebIdentityProfile"),
    n58 = kX(async (A, Q) => Promise.resolve().then(() => md(FCA())).then(({
      fromTokenFile: B
    }) => B({
      webIdentityTokenFile: A.web_identity_token_file,
      roleArn: A.role_arn,
      roleSessionName: A.role_session_name,
      roleAssumerWithWebIdentity: Q.roleAssumerWithWebIdentity,
      logger: Q.logger,
      parentClientConfig: Q.parentClientConfig
    })().then((G) => (0, dd.setCredentialFeature)(G, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), "resolveWebIdentityCredentials"),
    ERQ = kX(async (A, Q, B, G = {}, Z = !1) => {
      let I = Q[A];
      if (Object.keys(G).length > 0 && KRQ(I)) return DRQ(I, B);
      if (Z || h58(I, {
          profile: A,
          logger: B.logger
        })) return m58(A, Q, B, G);
      if (KRQ(I)) return DRQ(I, B);
      if (i58(I)) return n58(I, B);
      if (d58(I)) return c58(B, A);
      if (l58(I)) return await p58(A, I, B);
      throw new KCA.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
        logger: B.logger
      })
    }, "resolveProfileData"),
    a58 = kX((A = {}) => async ({
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
      let G = await (0, WT1.parseKnownFiles)(B);
      return ERQ((0, WT1.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), G, B)
    }, "fromIni")
})
// @from(Start 3587969, End 3588178)
wRQ = z((URQ) => {
  Object.defineProperty(URQ, "__esModule", {
    value: !0
  });
  URQ.fromIni = void 0;
  var s58 = XT1(),
    r58 = (A = {}) => (0, s58.fromIni)({
      ...A
    });
  URQ.fromIni = r58
})
// @from(Start 3588184, End 3588609)
LRQ = z((qRQ) => {
  Object.defineProperty(qRQ, "__esModule", {
    value: !0
  });
  qRQ.fromInstanceMetadata = void 0;
  var o58 = LL(),
    t58 = OV(),
    e58 = (A) => {
      return A?.logger?.debug("@smithy/credential-provider-imds", "fromInstanceMetadata"), async () => (0, t58.fromInstanceMetadata)(A)().then((Q) => (0, o58.setCredentialFeature)(Q, "CREDENTIALS_IMDS", "0"))
    };
  qRQ.fromInstanceMetadata = e58
})
// @from(Start 3588615, End 3593577)
_RQ = z((fL7, SRQ) => {
  var {
    create: A38,
    defineProperty: HCA,
    getOwnPropertyDescriptor: Q38,
    getOwnPropertyNames: B38,
    getPrototypeOf: G38
  } = Object, Z38 = Object.prototype.hasOwnProperty, gmA = (A, Q) => HCA(A, "name", {
    value: Q,
    configurable: !0
  }), I38 = (A, Q) => {
    for (var B in Q) HCA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, RRQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of B38(Q))
        if (!Z38.call(A, Z) && Z !== B) HCA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Q38(Q, Z)) || G.enumerable
        })
    }
    return A
  }, O6A = (A, Q, B) => (B = A != null ? A38(G38(A)) : {}, RRQ(Q || !A || !A.__esModule ? HCA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Y38 = (A) => RRQ(HCA({}, "__esModule", {
    value: !0
  }), A), TRQ = {};
  I38(TRQ, {
    credentialsTreatedAsExpired: () => jRQ,
    credentialsWillNeedRefresh: () => PRQ,
    defaultProvider: () => X38
  });
  SRQ.exports = Y38(TRQ);
  var VT1 = duA(),
    J38 = SG(),
    Ho = j2(),
    MRQ = "AWS_EC2_METADATA_DISABLED",
    W38 = gmA(async (A) => {
      let {
        ENV_CMDS_FULL_URI: Q,
        ENV_CMDS_RELATIVE_URI: B,
        fromContainerMetadata: G,
        fromInstanceMetadata: Z
      } = await Promise.resolve().then(() => O6A(OV()));
      if (process.env[B] || process.env[Q]) {
        A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        let {
          fromHttp: I
        } = await Promise.resolve().then(() => O6A(uuA()));
        return (0, Ho.chain)(I(A), G(A))
      }
      if (process.env[MRQ] && process.env[MRQ] !== "false") return async () => {
        throw new Ho.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
          logger: A.logger
        })
      };
      return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Z(A)
    }, "remoteProvider"),
    ORQ = !1,
    X38 = gmA((A = {}) => (0, Ho.memoize)((0, Ho.chain)(async () => {
      if (A.profile ?? process.env[J38.ENV_PROFILE]) {
        if (process.env[VT1.ENV_KEY] && process.env[VT1.ENV_SECRET]) {
          if (!ORQ)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), ORQ = !0
        }
        throw new Ho.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
          logger: A.logger,
          tryNextLink: !0
        })
      }
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), (0, VT1.fromEnv)(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
      let {
        ssoStartUrl: Q,
        ssoAccountId: B,
        ssoRegion: G,
        ssoRoleName: Z,
        ssoSession: I
      } = A;
      if (!Q && !B && !G && !Z && !I) throw new Ho.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
        logger: A.logger
      });
      let {
        fromSSO: Y
      } = await Promise.resolve().then(() => O6A(fmA()));
      return Y(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
      let {
        fromIni: Q
      } = await Promise.resolve().then(() => O6A(XT1()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
      let {
        fromProcess: Q
      } = await Promise.resolve().then(() => O6A(NmA()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
      let {
        fromTokenFile: Q
      } = await Promise.resolve().then(() => O6A(FCA()));
      return Q(A)()
    }, async () => {
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await W38(A))()
    }, async () => {
      throw new Ho.CredentialsProviderError("Could not load credentials from any providers", {
        tryNextLink: !1,
        logger: A.logger
      })
    }), jRQ, PRQ), "defaultProvider"),
    PRQ = gmA((A) => A?.expiration !== void 0, "credentialsWillNeedRefresh"),
    jRQ = gmA((A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000, "credentialsTreatedAsExpired")
})
// @from(Start 3593583, End 3593828)
FT1 = z((kRQ) => {
  Object.defineProperty(kRQ, "__esModule", {
    value: !0
  });
  kRQ.fromNodeProviderChain = void 0;
  var V38 = _RQ(),
    F38 = (A = {}) => (0, V38.defaultProvider)({
      ...A
    });
  kRQ.fromNodeProviderChain = F38
})
// @from(Start 3593834, End 3594033)
bRQ = z((xRQ) => {
  Object.defineProperty(xRQ, "__esModule", {
    value: !0
  });
  xRQ.fromProcess = void 0;
  var K38 = NmA(),
    D38 = (A) => (0, K38.fromProcess)(A);
  xRQ.fromProcess = D38
})
// @from(Start 3594039, End 3594273)
gRQ = z((fRQ) => {
  Object.defineProperty(fRQ, "__esModule", {
    value: !0
  });
  fRQ.fromSSO = void 0;
  var H38 = fmA(),
    C38 = (A = {}) => {
      return (0, H38.fromSSO)({
        ...A
      })
    };
  fRQ.fromSSO = C38
})
// @from(Start 3594279, End 3594699)
mRQ = z((umA) => {
  Object.defineProperty(umA, "__esModule", {
    value: !0
  });
  umA.STSClient = umA.AssumeRoleCommand = void 0;
  var uRQ = wmA();
  Object.defineProperty(umA, "AssumeRoleCommand", {
    enumerable: !0,
    get: function() {
      return uRQ.AssumeRoleCommand
    }
  });
  Object.defineProperty(umA, "STSClient", {
    enumerable: !0,
    get: function() {
      return uRQ.STSClient
    }
  })
})
// @from(Start 3594705, End 3599482)
pRQ = z((mS) => {
  var z38 = mS && mS.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    U38 = mS && mS.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    $38 = mS && mS.__importStar || function() {
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
            if (G[Z] !== "default") z38(B, Q, G[Z])
        }
        return U38(B, Q), B
      }
    }();
  Object.defineProperty(mS, "__esModule", {
    value: !0
  });
  mS.fromTemporaryCredentials = void 0;
  var w38 = iB(),
    dRQ = j2(),
    q38 = "us-east-1",
    N38 = (A, Q, B) => {
      let G;
      return async (Z = {}) => {
        let {
          callerClientConfig: I
        } = Z, Y = A.clientConfig?.profile ?? I?.profile, J = A.logger ?? I?.logger;
        J?.debug("@aws-sdk/credential-providers - fromTemporaryCredentials (STS)");
        let W = {
          ...A.params,
          RoleSessionName: A.params.RoleSessionName ?? "aws-sdk-js-" + Date.now()
        };
        if (W?.SerialNumber) {
          if (!A.mfaCodeProvider) throw new dRQ.CredentialsProviderError("Temporary credential requires multi-factor authentication, but no MFA code callback was provided.", {
            tryNextLink: !1,
            logger: J
          });
          W.TokenCode = await A.mfaCodeProvider(W?.SerialNumber)
        }
        let {
          AssumeRoleCommand: X,
          STSClient: V
        } = await Promise.resolve().then(() => $38(mRQ()));
        if (!G) {
          let K = typeof Q === "function" ? Q() : void 0,
            D = [A.masterCredentials, A.clientConfig?.credentials, void I?.credentials, I?.credentialDefaultProvider?.(), K],
            H = "STS client default credentials";
          if (D[0]) H = "options.masterCredentials";
          else if (D[1]) H = "options.clientConfig.credentials";
          else if (D[2]) throw H = "caller client's credentials", Error("fromTemporaryCredentials recursion in callerClientConfig.credentials");
          else if (D[3]) H = "caller client's credentialDefaultProvider";
          else if (D[4]) H = "AWS SDK default credentials";
          let C = [A.clientConfig?.region, I?.region, await B?.({
              profile: Y
            }), q38],
            E = "default partition's default region";
          if (C[0]) E = "options.clientConfig.region";
          else if (C[1]) E = "caller client's region";
          else if (C[2]) E = "file or env region";
          let U = [cRQ(A.clientConfig?.requestHandler), cRQ(I?.requestHandler)],
            q = "STS default requestHandler";
          if (U[0]) q = "options.clientConfig.requestHandler";
          else if (U[1]) q = "caller client's requestHandler";
          J?.debug?.(`@aws-sdk/credential-providers - fromTemporaryCredentials STS client init with ${E}=${await(0,w38.normalizeProvider)(mmA(C))()}, ${H}, ${q}.`), G = new V({
            ...A.clientConfig,
            credentials: mmA(D),
            logger: J,
            profile: Y,
            region: mmA(C),
            requestHandler: mmA(U)
          })
        }
        if (A.clientPlugins)
          for (let K of A.clientPlugins) G.middlewareStack.use(K);
        let {
          Credentials: F
        } = await G.send(new X(W));
        if (!F || !F.AccessKeyId || !F.SecretAccessKey) throw new dRQ.CredentialsProviderError(`Invalid response from STS.assumeRole call with role ${W.RoleArn}`, {
          logger: J
        });
        return {
          accessKeyId: F.AccessKeyId,
          secretAccessKey: F.SecretAccessKey,
          sessionToken: F.SessionToken,
          expiration: F.Expiration,
          credentialScope: F.CredentialScope
        }
      }
    };
  mS.fromTemporaryCredentials = N38;
  var cRQ = (A) => {
      return A?.metadata?.handlerProtocol === "h2" ? void 0 : A
    },
    mmA = (A) => {
      for (let Q of A)
        if (Q !== void 0) return Q
    }
})
// @from(Start 3599488, End 3600185)
nRQ = z((lRQ) => {
  Object.defineProperty(lRQ, "__esModule", {
    value: !0
  });
  lRQ.fromTemporaryCredentials = void 0;
  var L38 = f8(),
    M38 = uI(),
    O38 = FT1(),
    R38 = pRQ(),
    T38 = (A) => {
      return (0, R38.fromTemporaryCredentials)(A, O38.fromNodeProviderChain, async ({
        profile: Q = process.env.AWS_PROFILE
      }) => (0, M38.loadConfig)({
        environmentVariableSelector: (B) => B.AWS_REGION,
        configFileSelector: (B) => {
          return B.region
        },
        default: () => {
          return
        }
      }, {
        ...L38.NODE_REGION_CONFIG_FILE_OPTIONS,
        profile: Q
      })())
    };
  lRQ.fromTemporaryCredentials = T38
})
// @from(Start 3600191, End 3600418)
rRQ = z((aRQ) => {
  Object.defineProperty(aRQ, "__esModule", {
    value: !0
  });
  aRQ.fromTokenFile = void 0;
  var P38 = FCA(),
    j38 = (A = {}) => (0, P38.fromTokenFile)({
      ...A
    });
  aRQ.fromTokenFile = j38
})
// @from(Start 3600424, End 3600643)
eRQ = z((oRQ) => {
  Object.defineProperty(oRQ, "__esModule", {
    value: !0
  });
  oRQ.fromWebToken = void 0;
  var S38 = FCA(),
    _38 = (A) => (0, S38.fromWebToken)({
      ...A
    });
  oRQ.fromWebToken = _38
})
// @from(Start 3600649, End 3601304)
KT1 = z((OH) => {
  Object.defineProperty(OH, "__esModule", {
    value: !0
  });
  OH.fromHttp = void 0;
  var Tw = sr();
  Tw.__exportStar(KWQ(), OH);
  Tw.__exportStar(OUQ(), OH);
  Tw.__exportStar(PUQ(), OH);
  Tw.__exportStar(_UQ(), OH);
  var k38 = uuA();
  Object.defineProperty(OH, "fromHttp", {
    enumerable: !0,
    get: function() {
      return k38.fromHttp
    }
  });
  Tw.__exportStar(P$Q(), OH);
  Tw.__exportStar(wRQ(), OH);
  Tw.__exportStar(LRQ(), OH);
  Tw.__exportStar(FT1(), OH);
  Tw.__exportStar(bRQ(), OH);
  Tw.__exportStar(gRQ(), OH);
  Tw.__exportStar(nRQ(), OH);
  Tw.__exportStar(rRQ(), OH);
  Tw.__exportStar(eRQ(), OH)
})
// @from(Start 3601307, End 3601374)
function QTQ(A) {
  return A?.name === "CredentialsProviderError"
}
// @from(Start 3601376, End 3601760)
function BTQ(A) {
  if (!A || typeof A !== "object") return !1;
  let Q = A;
  if (!Q.Credentials || typeof Q.Credentials !== "object") return !1;
  let B = Q.Credentials;
  return typeof B.AccessKeyId === "string" && typeof B.SecretAccessKey === "string" && typeof B.SessionToken === "string" && B.AccessKeyId.length > 0 && B.SecretAccessKey.length > 0 && B.SessionToken.length > 0
}
// @from(Start 3601761, End 3602057)
async function GTQ() {
  try {
    g("Clearing AWS credential provider cache"), await ATQ.fromIni({
      ignoreCache: !0
    })(), g("AWS credential provider cache refreshed")
  } catch (A) {
    g("Failed to clear AWS credential cache (this is expected if no credentials are configured)")
  }
}
// @from(Start 3602062, End 3602065)
dmA
// @from(Start 3602067, End 3602070)
ATQ
// @from(Start 3602072, End 3602164)
DT1 = async () => {
  await new dmA.STSClient().send(new dmA.GetCallerIdentityCommand({}))
}
// @from(Start 3602170, End 3602237)
HT1 = L(() => {
  V0();
  dmA = BA(bJQ(), 1), ATQ = BA(KT1(), 1)
})
// @from(Start 3602243, End 3605026)
CT1 = z((rL7, KTQ) => {
  var {
    defineProperty: cmA,
    getOwnPropertyDescriptor: x38,
    getOwnPropertyNames: v38
  } = Object, b38 = Object.prototype.hasOwnProperty, pmA = (A, Q) => cmA(A, "name", {
    value: Q,
    configurable: !0
  }), f38 = (A, Q) => {
    for (var B in Q) cmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, h38 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of v38(Q))
        if (!b38.call(A, Z) && Z !== B) cmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = x38(Q, Z)) || G.enumerable
        })
    }
    return A
  }, g38 = (A) => h38(cmA({}, "__esModule", {
    value: !0
  }), A), ZTQ = {};
  f38(ZTQ, {
    AlgorithmId: () => WTQ,
    EndpointURLScheme: () => JTQ,
    FieldPosition: () => XTQ,
    HttpApiKeyAuthLocation: () => YTQ,
    HttpAuthLocation: () => ITQ,
    IniSectionType: () => VTQ,
    RequestHandlerProtocol: () => FTQ,
    SMITHY_CONTEXT_KEY: () => p38,
    getDefaultClientConfiguration: () => d38,
    resolveDefaultRuntimeConfig: () => c38
  });
  KTQ.exports = g38(ZTQ);
  var ITQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(ITQ || {}),
    YTQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(YTQ || {}),
    JTQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(JTQ || {}),
    WTQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(WTQ || {}),
    u38 = pmA((A) => {
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
    m38 = pmA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    d38 = pmA((A) => {
      return u38(A)
    }, "getDefaultClientConfiguration"),
    c38 = pmA((A) => {
      return m38(A)
    }, "resolveDefaultRuntimeConfig"),
    XTQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(XTQ || {}),
    p38 = "__smithy_context",
    VTQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(VTQ || {}),
    FTQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(FTQ || {})
})
// @from(Start 3605032, End 3609538)
az = z((oL7, zTQ) => {
  var {
    defineProperty: lmA,
    getOwnPropertyDescriptor: l38,
    getOwnPropertyNames: i38
  } = Object, n38 = Object.prototype.hasOwnProperty, cd = (A, Q) => lmA(A, "name", {
    value: Q,
    configurable: !0
  }), a38 = (A, Q) => {
    for (var B in Q) lmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, s38 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of i38(Q))
        if (!n38.call(A, Z) && Z !== B) lmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = l38(Q, Z)) || G.enumerable
        })
    }
    return A
  }, r38 = (A) => s38(lmA({}, "__esModule", {
    value: !0
  }), A), DTQ = {};
  a38(DTQ, {
    Field: () => e38,
    Fields: () => A78,
    HttpRequest: () => Q78,
    HttpResponse: () => B78,
    IHttpRequest: () => HTQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => o38,
    isValidHostname: () => ETQ,
    resolveHttpHandlerRuntimeConfig: () => t38
  });
  zTQ.exports = r38(DTQ);
  var o38 = cd((A) => {
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
    t38 = cd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    HTQ = CT1(),
    e38 = class {
      static {
        cd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = HTQ.FieldPosition.HEADER,
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
    A78 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        cd(this, "Fields")
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
    Q78 = class A {
      static {
        cd(this, "HttpRequest")
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
        if (B.query) B.query = CTQ(B.query);
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

  function CTQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  cd(CTQ, "cloneQuery");
  var B78 = class {
    static {
      cd(this, "HttpResponse")
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

  function ETQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  cd(ETQ, "isValidHostname")
})
// @from(Start 3609544, End 3611407)
CCA = z((QM7, NTQ) => {
  var {
    defineProperty: nmA,
    getOwnPropertyDescriptor: G78,
    getOwnPropertyNames: Z78
  } = Object, I78 = Object.prototype.hasOwnProperty, imA = (A, Q) => nmA(A, "name", {
    value: Q,
    configurable: !0
  }), Y78 = (A, Q) => {
    for (var B in Q) nmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, J78 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Z78(Q))
        if (!I78.call(A, Z) && Z !== B) nmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = G78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, W78 = (A) => J78(nmA({}, "__esModule", {
    value: !0
  }), A), UTQ = {};
  Y78(UTQ, {
    getHostHeaderPlugin: () => V78,
    hostHeaderMiddleware: () => wTQ,
    hostHeaderMiddlewareOptions: () => qTQ,
    resolveHostHeaderConfig: () => $TQ
  });
  NTQ.exports = W78(UTQ);
  var X78 = az();

  function $TQ(A) {
    return A
  }
  imA($TQ, "resolveHostHeaderConfig");
  var wTQ = imA((A) => (Q) => async (B) => {
      if (!X78.HttpRequest.isInstance(B.request)) return Q(B);
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
    qTQ = {
      name: "hostHeaderMiddleware",
      step: "build",
      priority: "low",
      tags: ["HOST"],
      override: !0
    },
    V78 = imA((A) => ({
      applyToStack: imA((Q) => {
        Q.add(wTQ(A), qTQ)
      }, "applyToStack")
    }), "getHostHeaderPlugin")
})
// @from(Start 3611413, End 3613713)
ECA = z((BM7, RTQ) => {
  var {
    defineProperty: amA,
    getOwnPropertyDescriptor: F78,
    getOwnPropertyNames: K78
  } = Object, D78 = Object.prototype.hasOwnProperty, ET1 = (A, Q) => amA(A, "name", {
    value: Q,
    configurable: !0
  }), H78 = (A, Q) => {
    for (var B in Q) amA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, C78 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of K78(Q))
        if (!D78.call(A, Z) && Z !== B) amA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = F78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, E78 = (A) => C78(amA({}, "__esModule", {
    value: !0
  }), A), LTQ = {};
  H78(LTQ, {
    getLoggerPlugin: () => z78,
    loggerMiddleware: () => MTQ,
    loggerMiddlewareOptions: () => OTQ
  });
  RTQ.exports = E78(LTQ);
  var MTQ = ET1(() => (A, Q) => async (B) => {
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
    OTQ = {
      name: "loggerMiddleware",
      tags: ["LOGGER"],
      step: "initialize",
      override: !0
    },
    z78 = ET1((A) => ({
      applyToStack: ET1((Q) => {
        Q.add(MTQ(), OTQ)
      }, "applyToStack")
    }), "getLoggerPlugin")
})
// @from(Start 3613719, End 3615651)
zCA = z((GM7, STQ) => {
  var {
    defineProperty: rmA,
    getOwnPropertyDescriptor: U78,
    getOwnPropertyNames: $78
  } = Object, w78 = Object.prototype.hasOwnProperty, smA = (A, Q) => rmA(A, "name", {
    value: Q,
    configurable: !0
  }), q78 = (A, Q) => {
    for (var B in Q) rmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, N78 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of $78(Q))
        if (!w78.call(A, Z) && Z !== B) rmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = U78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, L78 = (A) => N78(rmA({}, "__esModule", {
    value: !0
  }), A), TTQ = {};
  q78(TTQ, {
    addRecursionDetectionMiddlewareOptions: () => jTQ,
    getRecursionDetectionPlugin: () => T78,
    recursionDetectionMiddleware: () => PTQ
  });
  STQ.exports = L78(TTQ);
  var M78 = az(),
    zT1 = "X-Amzn-Trace-Id",
    O78 = "AWS_LAMBDA_FUNCTION_NAME",
    R78 = "_X_AMZN_TRACE_ID",
    PTQ = smA((A) => (Q) => async (B) => {
      let {
        request: G
      } = B;
      if (!M78.HttpRequest.isInstance(G) || A.runtime !== "node") return Q(B);
      let Z = Object.keys(G.headers ?? {}).find((W) => W.toLowerCase() === zT1.toLowerCase()) ?? zT1;
      if (G.headers.hasOwnProperty(Z)) return Q(B);
      let I = process.env[O78],
        Y = process.env[R78],
        J = smA((W) => typeof W === "string" && W.length > 0, "nonEmptyString");
      if (J(I) && J(Y)) G.headers[zT1] = Y;
      return Q({
        ...B,
        request: G
      })
    }, "recursionDetectionMiddleware"),
    jTQ = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: !0,
      priority: "low"
    },
    T78 = smA((A) => ({
      applyToStack: smA((Q) => {
        Q.add(PTQ(A), jTQ)
      }, "applyToStack")
    }), "getRecursionDetectionPlugin")
})
// @from(Start 3615657, End 3627115)
T6A = z((ZM7, uTQ) => {
  var {
    defineProperty: omA,
    getOwnPropertyDescriptor: P78,
    getOwnPropertyNames: j78
  } = Object, S78 = Object.prototype.hasOwnProperty, R6A = (A, Q) => omA(A, "name", {
    value: Q,
    configurable: !0
  }), _78 = (A, Q) => {
    for (var B in Q) omA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, k78 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of j78(Q))
        if (!S78.call(A, Z) && Z !== B) omA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = P78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, y78 = (A) => k78(omA({}, "__esModule", {
    value: !0
  }), A), kTQ = {};
  _78(kTQ, {
    ConditionObject: () => _Z.ConditionObject,
    DeprecatedObject: () => _Z.DeprecatedObject,
    EndpointError: () => _Z.EndpointError,
    EndpointObject: () => _Z.EndpointObject,
    EndpointObjectHeaders: () => _Z.EndpointObjectHeaders,
    EndpointObjectProperties: () => _Z.EndpointObjectProperties,
    EndpointParams: () => _Z.EndpointParams,
    EndpointResolverOptions: () => _Z.EndpointResolverOptions,
    EndpointRuleObject: () => _Z.EndpointRuleObject,
    ErrorRuleObject: () => _Z.ErrorRuleObject,
    EvaluateOptions: () => _Z.EvaluateOptions,
    Expression: () => _Z.Expression,
    FunctionArgv: () => _Z.FunctionArgv,
    FunctionObject: () => _Z.FunctionObject,
    FunctionReturn: () => _Z.FunctionReturn,
    ParameterObject: () => _Z.ParameterObject,
    ReferenceObject: () => _Z.ReferenceObject,
    ReferenceRecord: () => _Z.ReferenceRecord,
    RuleSetObject: () => _Z.RuleSetObject,
    RuleSetRules: () => _Z.RuleSetRules,
    TreeRuleObject: () => _Z.TreeRuleObject,
    awsEndpointFunctions: () => gTQ,
    getUserAgentPrefix: () => f78,
    isIpAddress: () => _Z.isIpAddress,
    partition: () => fTQ,
    resolveEndpoint: () => _Z.resolveEndpoint,
    setPartitionInfo: () => hTQ,
    useDefaultPartitionInfo: () => b78
  });
  uTQ.exports = y78(kTQ);
  var _Z = FI(),
    yTQ = R6A((A, Q = !1) => {
      if (Q) {
        for (let B of A.split("."))
          if (!yTQ(B)) return !1;
        return !0
      }
      if (!(0, _Z.isValidHostLabel)(A)) return !1;
      if (A.length < 3 || A.length > 63) return !1;
      if (A !== A.toLowerCase()) return !1;
      if ((0, _Z.isIpAddress)(A)) return !1;
      return !0
    }, "isVirtualHostableS3Bucket"),
    _TQ = ":",
    x78 = "/",
    v78 = R6A((A) => {
      let Q = A.split(_TQ);
      if (Q.length < 6) return null;
      let [B, G, Z, I, Y, ...J] = Q;
      if (B !== "arn" || G === "" || Z === "" || J.join(_TQ) === "") return null;
      let W = J.map((X) => X.split(x78)).flat();
      return {
        partition: G,
        service: Z,
        region: I,
        accountId: Y,
        resourceId: W
      }
    }, "parseArn"),
    xTQ = {
      partitions: [{
        id: "aws",
        outputs: {
          dnsSuffix: "amazonaws.com",
          dualStackDnsSuffix: "api.aws",
          implicitGlobalRegion: "us-east-1",
          name: "aws",
          supportsDualStack: !0,
          supportsFIPS: !0
        },
        regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
        regions: {
          "af-south-1": {
            description: "Africa (Cape Town)"
          },
          "ap-east-1": {
            description: "Asia Pacific (Hong Kong)"
          },
          "ap-east-2": {
            description: "Asia Pacific (Taipei)"
          },
          "ap-northeast-1": {
            description: "Asia Pacific (Tokyo)"
          },
          "ap-northeast-2": {
            description: "Asia Pacific (Seoul)"
          },
          "ap-northeast-3": {
            description: "Asia Pacific (Osaka)"
          },
          "ap-south-1": {
            description: "Asia Pacific (Mumbai)"
          },
          "ap-south-2": {
            description: "Asia Pacific (Hyderabad)"
          },
          "ap-southeast-1": {
            description: "Asia Pacific (Singapore)"
          },
          "ap-southeast-2": {
            description: "Asia Pacific (Sydney)"
          },
          "ap-southeast-3": {
            description: "Asia Pacific (Jakarta)"
          },
          "ap-southeast-4": {
            description: "Asia Pacific (Melbourne)"
          },
          "ap-southeast-5": {
            description: "Asia Pacific (Malaysia)"
          },
          "ap-southeast-7": {
            description: "Asia Pacific (Thailand)"
          },
          "aws-global": {
            description: "AWS Standard global region"
          },
          "ca-central-1": {
            description: "Canada (Central)"
          },
          "ca-west-1": {
            description: "Canada West (Calgary)"
          },
          "eu-central-1": {
            description: "Europe (Frankfurt)"
          },
          "eu-central-2": {
            description: "Europe (Zurich)"
          },
          "eu-north-1": {
            description: "Europe (Stockholm)"
          },
          "eu-south-1": {
            description: "Europe (Milan)"
          },
          "eu-south-2": {
            description: "Europe (Spain)"
          },
          "eu-west-1": {
            description: "Europe (Ireland)"
          },
          "eu-west-2": {
            description: "Europe (London)"
          },
          "eu-west-3": {
            description: "Europe (Paris)"
          },
          "il-central-1": {
            description: "Israel (Tel Aviv)"
          },
          "me-central-1": {
            description: "Middle East (UAE)"
          },
          "me-south-1": {
            description: "Middle East (Bahrain)"
          },
          "mx-central-1": {
            description: "Mexico (Central)"
          },
          "sa-east-1": {
            description: "South America (Sao Paulo)"
          },
          "us-east-1": {
            description: "US East (N. Virginia)"
          },
          "us-east-2": {
            description: "US East (Ohio)"
          },
          "us-west-1": {
            description: "US West (N. California)"
          },
          "us-west-2": {
            description: "US West (Oregon)"
          }
        }
      }, {
        id: "aws-cn",
        outputs: {
          dnsSuffix: "amazonaws.com.cn",
          dualStackDnsSuffix: "api.amazonwebservices.com.cn",
          implicitGlobalRegion: "cn-northwest-1",
          name: "aws-cn",
          supportsDualStack: !0,
          supportsFIPS: !0
        },
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        regions: {
          "aws-cn-global": {
            description: "AWS China global region"
          },
          "cn-north-1": {
            description: "China (Beijing)"
          },
          "cn-northwest-1": {
            description: "China (Ningxia)"
          }
        }
      }, {
        id: "aws-us-gov",
        outputs: {
          dnsSuffix: "amazonaws.com",
          dualStackDnsSuffix: "api.aws",
          implicitGlobalRegion: "us-gov-west-1",
          name: "aws-us-gov",
          supportsDualStack: !0,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        regions: {
          "aws-us-gov-global": {
            description: "AWS GovCloud (US) global region"
          },
          "us-gov-east-1": {
            description: "AWS GovCloud (US-East)"
          },
          "us-gov-west-1": {
            description: "AWS GovCloud (US-West)"
          }
        }
      }, {
        id: "aws-iso",
        outputs: {
          dnsSuffix: "c2s.ic.gov",
          dualStackDnsSuffix: "c2s.ic.gov",
          implicitGlobalRegion: "us-iso-east-1",
          name: "aws-iso",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-global": {
            description: "AWS ISO (US) global region"
          },
          "us-iso-east-1": {
            description: "US ISO East"
          },
          "us-iso-west-1": {
            description: "US ISO WEST"
          }
        }
      }, {
        id: "aws-iso-b",
        outputs: {
          dnsSuffix: "sc2s.sgov.gov",
          dualStackDnsSuffix: "sc2s.sgov.gov",
          implicitGlobalRegion: "us-isob-east-1",
          name: "aws-iso-b",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-b-global": {
            description: "AWS ISOB (US) global region"
          },
          "us-isob-east-1": {
            description: "US ISOB East (Ohio)"
          }
        }
      }, {
        id: "aws-iso-e",
        outputs: {
          dnsSuffix: "cloud.adc-e.uk",
          dualStackDnsSuffix: "cloud.adc-e.uk",
          implicitGlobalRegion: "eu-isoe-west-1",
          name: "aws-iso-e",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-e-global": {
            description: "AWS ISOE (Europe) global region"
          },
          "eu-isoe-west-1": {
            description: "EU ISOE West"
          }
        }
      }, {
        id: "aws-iso-f",
        outputs: {
          dnsSuffix: "csp.hci.ic.gov",
          dualStackDnsSuffix: "csp.hci.ic.gov",
          implicitGlobalRegion: "us-isof-south-1",
          name: "aws-iso-f",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-f-global": {
            description: "AWS ISOF global region"
          },
          "us-isof-east-1": {
            description: "US ISOF EAST"
          },
          "us-isof-south-1": {
            description: "US ISOF SOUTH"
          }
        }
      }, {
        id: "aws-eusc",
        outputs: {
          dnsSuffix: "amazonaws.eu",
          dualStackDnsSuffix: "amazonaws.eu",
          implicitGlobalRegion: "eusc-de-east-1",
          name: "aws-eusc",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
        regions: {
          "eusc-de-east-1": {
            description: "EU (Germany)"
          }
        }
      }],
      version: "1.1"
    },
    vTQ = xTQ,
    bTQ = "",
    fTQ = R6A((A) => {
      let {
        partitions: Q
      } = vTQ;
      for (let G of Q) {
        let {
          regions: Z,
          outputs: I
        } = G;
        for (let [Y, J] of Object.entries(Z))
          if (Y === A) return {
            ...I,
            ...J
          }
      }
      for (let G of Q) {
        let {
          regionRegex: Z,
          outputs: I
        } = G;
        if (new RegExp(Z).test(A)) return {
          ...I
        }
      }
      let B = Q.find((G) => G.id === "aws");
      if (!B) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
      return {
        ...B.outputs
      }
    }, "partition"),
    hTQ = R6A((A, Q = "") => {
      vTQ = A, bTQ = Q
    }, "setPartitionInfo"),
    b78 = R6A(() => {
      hTQ(xTQ, "")
    }, "useDefaultPartitionInfo"),
    f78 = R6A(() => bTQ, "getUserAgentPrefix"),
    gTQ = {
      isVirtualHostableS3Bucket: yTQ,
      parseArn: v78,
      partition: fTQ
    };
  _Z.customEndpointFunctions.aws = gTQ
})