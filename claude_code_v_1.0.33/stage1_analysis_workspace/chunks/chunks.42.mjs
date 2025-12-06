
// @from(Start 3774374, End 3790922)
s_Q = z((YO7, a_Q) => {
  var {
    defineProperty: OdA,
    getOwnPropertyDescriptor: OJ8,
    getOwnPropertyNames: RJ8
  } = Object, TJ8 = Object.prototype.hasOwnProperty, O5 = (A, Q) => OdA(A, "name", {
    value: Q,
    configurable: !0
  }), PJ8 = (A, Q) => {
    for (var B in Q) OdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, jJ8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of RJ8(Q))
        if (!TJ8.call(A, Z) && Z !== B) OdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = OJ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, SJ8 = (A) => jJ8(OdA({}, "__esModule", {
    value: !0
  }), A), P_Q = {};
  PJ8(P_Q, {
    GetRoleCredentialsCommand: () => l_Q,
    GetRoleCredentialsRequestFilterSensitiveLog: () => y_Q,
    GetRoleCredentialsResponseFilterSensitiveLog: () => v_Q,
    InvalidRequestException: () => j_Q,
    ListAccountRolesCommand: () => HP1,
    ListAccountRolesRequestFilterSensitiveLog: () => b_Q,
    ListAccountsCommand: () => CP1,
    ListAccountsRequestFilterSensitiveLog: () => f_Q,
    LogoutCommand: () => i_Q,
    LogoutRequestFilterSensitiveLog: () => h_Q,
    ResourceNotFoundException: () => S_Q,
    RoleCredentialsFilterSensitiveLog: () => x_Q,
    SSO: () => n_Q,
    SSOClient: () => TdA,
    SSOServiceException: () => f6A,
    TooManyRequestsException: () => __Q,
    UnauthorizedException: () => k_Q,
    __Client: () => K2.Client,
    paginateListAccountRoles: () => BW8,
    paginateListAccounts: () => GW8
  });
  a_Q.exports = SJ8(P_Q);
  var N_Q = CCA(),
    _J8 = ECA(),
    kJ8 = zCA(),
    L_Q = y6A(),
    yJ8 = f8(),
    Vb = iB(),
    xJ8 = LX(),
    TCA = q5(),
    M_Q = D6(),
    O_Q = XP1(),
    vJ8 = O5((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "awsssoportal"
      })
    }, "resolveClientEndpointParameters"),
    RdA = {
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
    bJ8 = C_Q(),
    R_Q = OCA(),
    T_Q = az(),
    K2 = o6(),
    fJ8 = O5((A) => {
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
    hJ8 = O5((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    gJ8 = O5((A, Q) => {
      let B = Object.assign((0, R_Q.getAwsRegionExtensionConfiguration)(A), (0, K2.getDefaultExtensionConfiguration)(A), (0, T_Q.getHttpHandlerExtensionConfiguration)(A), fJ8(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, R_Q.resolveAwsRegionExtensionConfiguration)(B), (0, K2.resolveDefaultRuntimeConfig)(B), (0, T_Q.resolveHttpHandlerRuntimeConfig)(B), hJ8(B))
    }, "resolveRuntimeExtensions"),
    TdA = class extends K2.Client {
      static {
        O5(this, "SSOClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, bJ8.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = vJ8(Q),
          G = (0, L_Q.resolveUserAgentConfig)(B),
          Z = (0, M_Q.resolveRetryConfig)(G),
          I = (0, yJ8.resolveRegionConfig)(Z),
          Y = (0, N_Q.resolveHostHeaderConfig)(I),
          J = (0, TCA.resolveEndpointConfig)(Y),
          W = (0, O_Q.resolveHttpAuthSchemeConfig)(J),
          X = gJ8(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, L_Q.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, M_Q.getRetryPlugin)(this.config)), this.middlewareStack.use((0, xJ8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, N_Q.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, _J8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, kJ8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Vb.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: O_Q.defaultSSOHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: O5(async (V) => new Vb.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, Vb.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    PdA = GZ(),
    f6A = class A extends K2.ServiceException {
      static {
        O5(this, "SSOServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    j_Q = class A extends f6A {
      static {
        O5(this, "InvalidRequestException")
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
    S_Q = class A extends f6A {
      static {
        O5(this, "ResourceNotFoundException")
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
    __Q = class A extends f6A {
      static {
        O5(this, "TooManyRequestsException")
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
    k_Q = class A extends f6A {
      static {
        O5(this, "UnauthorizedException")
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
    y_Q = O5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: K2.SENSITIVE_STRING
      }
    }), "GetRoleCredentialsRequestFilterSensitiveLog"),
    x_Q = O5((A) => ({
      ...A,
      ...A.secretAccessKey && {
        secretAccessKey: K2.SENSITIVE_STRING
      },
      ...A.sessionToken && {
        sessionToken: K2.SENSITIVE_STRING
      }
    }), "RoleCredentialsFilterSensitiveLog"),
    v_Q = O5((A) => ({
      ...A,
      ...A.roleCredentials && {
        roleCredentials: x_Q(A.roleCredentials)
      }
    }), "GetRoleCredentialsResponseFilterSensitiveLog"),
    b_Q = O5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: K2.SENSITIVE_STRING
      }
    }), "ListAccountRolesRequestFilterSensitiveLog"),
    f_Q = O5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: K2.SENSITIVE_STRING
      }
    }), "ListAccountsRequestFilterSensitiveLog"),
    h_Q = O5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: K2.SENSITIVE_STRING
      }
    }), "LogoutRequestFilterSensitiveLog"),
    RCA = PF(),
    uJ8 = O5(async (A, Q) => {
      let B = (0, Vb.requestBuilder)(A, Q),
        G = (0, K2.map)({}, K2.isSerializableHeaderValue, {
          [_dA]: A[SdA]
        });
      B.bp("/federation/credentials");
      let Z = (0, K2.map)({
          [AW8]: [, (0, K2.expectNonNull)(A[eJ8], "roleName")],
          [u_Q]: [, (0, K2.expectNonNull)(A[g_Q], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_GetRoleCredentialsCommand"),
    mJ8 = O5(async (A, Q) => {
      let B = (0, Vb.requestBuilder)(A, Q),
        G = (0, K2.map)({}, K2.isSerializableHeaderValue, {
          [_dA]: A[SdA]
        });
      B.bp("/assignment/roles");
      let Z = (0, K2.map)({
          [p_Q]: [, A[c_Q]],
          [d_Q]: [() => A.maxResults !== void 0, () => A[m_Q].toString()],
          [u_Q]: [, (0, K2.expectNonNull)(A[g_Q], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountRolesCommand"),
    dJ8 = O5(async (A, Q) => {
      let B = (0, Vb.requestBuilder)(A, Q),
        G = (0, K2.map)({}, K2.isSerializableHeaderValue, {
          [_dA]: A[SdA]
        });
      B.bp("/assignment/accounts");
      let Z = (0, K2.map)({
          [p_Q]: [, A[c_Q]],
          [d_Q]: [() => A.maxResults !== void 0, () => A[m_Q].toString()]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountsCommand"),
    cJ8 = O5(async (A, Q) => {
      let B = (0, Vb.requestBuilder)(A, Q),
        G = (0, K2.map)({}, K2.isSerializableHeaderValue, {
          [_dA]: A[SdA]
        });
      B.bp("/logout");
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_LogoutCommand"),
    pJ8 = O5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jdA(A, Q);
      let B = (0, K2.map)({
          $metadata: nd(A)
        }),
        G = (0, K2.expectNonNull)((0, K2.expectObject)(await (0, RCA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, K2.take)(G, {
          roleCredentials: K2._json
        });
      return Object.assign(B, Z), B
    }, "de_GetRoleCredentialsCommand"),
    lJ8 = O5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jdA(A, Q);
      let B = (0, K2.map)({
          $metadata: nd(A)
        }),
        G = (0, K2.expectNonNull)((0, K2.expectObject)(await (0, RCA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, K2.take)(G, {
          nextToken: K2.expectString,
          roleList: K2._json
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountRolesCommand"),
    iJ8 = O5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jdA(A, Q);
      let B = (0, K2.map)({
          $metadata: nd(A)
        }),
        G = (0, K2.expectNonNull)((0, K2.expectObject)(await (0, RCA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, K2.take)(G, {
          accountList: K2._json,
          nextToken: K2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountsCommand"),
    nJ8 = O5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return jdA(A, Q);
      let B = (0, K2.map)({
        $metadata: nd(A)
      });
      return await (0, K2.collectBody)(A.body, Q), B
    }, "de_LogoutCommand"),
    jdA = O5(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, RCA.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, RCA.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await sJ8(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await rJ8(B, Q);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await oJ8(B, Q);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await tJ8(B, Q);
        default:
          let Z = B.body;
          return aJ8({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    aJ8 = (0, K2.withBaseException)(f6A),
    sJ8 = O5(async (A, Q) => {
      let B = (0, K2.map)({}),
        G = A.body,
        Z = (0, K2.take)(G, {
          message: K2.expectString
        });
      Object.assign(B, Z);
      let I = new j_Q({
        $metadata: nd(A),
        ...B
      });
      return (0, K2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    rJ8 = O5(async (A, Q) => {
      let B = (0, K2.map)({}),
        G = A.body,
        Z = (0, K2.take)(G, {
          message: K2.expectString
        });
      Object.assign(B, Z);
      let I = new S_Q({
        $metadata: nd(A),
        ...B
      });
      return (0, K2.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    oJ8 = O5(async (A, Q) => {
      let B = (0, K2.map)({}),
        G = A.body,
        Z = (0, K2.take)(G, {
          message: K2.expectString
        });
      Object.assign(B, Z);
      let I = new __Q({
        $metadata: nd(A),
        ...B
      });
      return (0, K2.decorateServiceException)(I, A.body)
    }, "de_TooManyRequestsExceptionRes"),
    tJ8 = O5(async (A, Q) => {
      let B = (0, K2.map)({}),
        G = A.body,
        Z = (0, K2.take)(G, {
          message: K2.expectString
        });
      Object.assign(B, Z);
      let I = new k_Q({
        $metadata: nd(A),
        ...B
      });
      return (0, K2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedExceptionRes"),
    nd = O5((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    g_Q = "accountId",
    SdA = "accessToken",
    u_Q = "account_id",
    m_Q = "maxResults",
    d_Q = "max_result",
    c_Q = "nextToken",
    p_Q = "next_token",
    eJ8 = "roleName",
    AW8 = "role_name",
    _dA = "x-amz-sso_bearer_token",
    l_Q = class extends K2.Command.classBuilder().ep(RdA).m(function(A, Q, B, G) {
      return [(0, PdA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, TCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").f(y_Q, v_Q).ser(uJ8).de(pJ8).build() {
      static {
        O5(this, "GetRoleCredentialsCommand")
      }
    },
    HP1 = class extends K2.Command.classBuilder().ep(RdA).m(function(A, Q, B, G) {
      return [(0, PdA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, TCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").f(b_Q, void 0).ser(mJ8).de(lJ8).build() {
      static {
        O5(this, "ListAccountRolesCommand")
      }
    },
    CP1 = class extends K2.Command.classBuilder().ep(RdA).m(function(A, Q, B, G) {
      return [(0, PdA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, TCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").f(f_Q, void 0).ser(dJ8).de(iJ8).build() {
      static {
        O5(this, "ListAccountsCommand")
      }
    },
    i_Q = class extends K2.Command.classBuilder().ep(RdA).m(function(A, Q, B, G) {
      return [(0, PdA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, TCA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").f(h_Q, void 0).ser(cJ8).de(nJ8).build() {
      static {
        O5(this, "LogoutCommand")
      }
    },
    QW8 = {
      GetRoleCredentialsCommand: l_Q,
      ListAccountRolesCommand: HP1,
      ListAccountsCommand: CP1,
      LogoutCommand: i_Q
    },
    n_Q = class extends TdA {
      static {
        O5(this, "SSO")
      }
    };
  (0, K2.createAggregatedClient)(QW8, n_Q);
  var BW8 = (0, Vb.createPaginator)(TdA, HP1, "nextToken", "nextToken", "maxResults"),
    GW8 = (0, Vb.createPaginator)(TdA, CP1, "nextToken", "nextToken", "maxResults")
})
// @from(Start 3790928, End 3792399)
zP1 = z((r_Q) => {
  Object.defineProperty(r_Q, "__esModule", {
    value: !0
  });
  r_Q.resolveHttpAuthSchemeConfig = r_Q.defaultSSOOIDCHttpAuthSchemeProvider = r_Q.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
  var ZW8 = PF(),
    EP1 = w7(),
    IW8 = async (A, Q, B) => {
      return {
        operation: (0, EP1.getSmithyContext)(Q).operation,
        region: await (0, EP1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  r_Q.defaultSSOOIDCHttpAuthSchemeParametersProvider = IW8;

  function YW8(A) {
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

  function JW8(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var WW8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateToken": {
        Q.push(JW8(A));
        break
      }
      default:
        Q.push(YW8(A))
    }
    return Q
  };
  r_Q.defaultSSOOIDCHttpAuthSchemeProvider = WW8;
  var XW8 = (A) => {
    let Q = (0, ZW8.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, EP1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  r_Q.resolveHttpAuthSchemeConfig = XW8
})
// @from(Start 3792405, End 3796690)
UP1 = z((HO7, KW8) => {
  KW8.exports = {
    name: "@aws-sdk/nested-clients",
    version: "3.840.0",
    description: "Nested clients for AWS SDK packages.",
    main: "./dist-cjs/index.js",
    module: "./dist-es/index.js",
    types: "./dist-types/index.d.ts",
    scripts: {
      build: "yarn lint && concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline nested-clients",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      lint: "node ../../scripts/validation/submodules-linter.js --pkg nested-clients",
      test: "yarn g:vitest run",
      "test:watch": "yarn g:vitest watch"
    },
    engines: {
      node: ">=18.0.0"
    },
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
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
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.8.3"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["./sso-oidc.d.ts", "./sso-oidc.js", "./sts.d.ts", "./sts.js", "dist-*/**"],
    browser: {
      "./dist-es/submodules/sso-oidc/runtimeConfig": "./dist-es/submodules/sso-oidc/runtimeConfig.browser",
      "./dist-es/submodules/sts/runtimeConfig": "./dist-es/submodules/sts/runtimeConfig.browser"
    },
    "react-native": {},
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/packages/nested-clients",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "packages/nested-clients"
    },
    exports: {
      "./sso-oidc": {
        types: "./dist-types/submodules/sso-oidc/index.d.ts",
        module: "./dist-es/submodules/sso-oidc/index.js",
        node: "./dist-cjs/submodules/sso-oidc/index.js",
        import: "./dist-es/submodules/sso-oidc/index.js",
        require: "./dist-cjs/submodules/sso-oidc/index.js"
      },
      "./sts": {
        types: "./dist-types/submodules/sts/index.d.ts",
        module: "./dist-es/submodules/sts/index.js",
        node: "./dist-cjs/submodules/sts/index.js",
        import: "./dist-es/submodules/sts/index.js",
        require: "./dist-cjs/submodules/sts/index.js"
      }
    }
  }
})
// @from(Start 3796696, End 3801363)
HkQ = z((KkQ) => {
  Object.defineProperty(KkQ, "__esModule", {
    value: !0
  });
  KkQ.ruleSet = void 0;
  var WkQ = "required",
    vL = "fn",
    bL = "argv",
    u6A = "ref",
    t_Q = !0,
    e_Q = "isSet",
    PCA = "booleanEquals",
    h6A = "error",
    g6A = "endpoint",
    Fb = "tree",
    $P1 = "PartitionResult",
    wP1 = "getAttr",
    AkQ = {
      [WkQ]: !1,
      type: "String"
    },
    QkQ = {
      [WkQ]: !0,
      default: !1,
      type: "Boolean"
    },
    BkQ = {
      [u6A]: "Endpoint"
    },
    XkQ = {
      [vL]: PCA,
      [bL]: [{
        [u6A]: "UseFIPS"
      }, !0]
    },
    VkQ = {
      [vL]: PCA,
      [bL]: [{
        [u6A]: "UseDualStack"
      }, !0]
    },
    xL = {},
    GkQ = {
      [vL]: wP1,
      [bL]: [{
        [u6A]: $P1
      }, "supportsFIPS"]
    },
    FkQ = {
      [u6A]: $P1
    },
    ZkQ = {
      [vL]: PCA,
      [bL]: [!0, {
        [vL]: wP1,
        [bL]: [FkQ, "supportsDualStack"]
      }]
    },
    IkQ = [XkQ],
    YkQ = [VkQ],
    JkQ = [{
      [u6A]: "Region"
    }],
    DW8 = {
      version: "1.0",
      parameters: {
        Region: AkQ,
        UseDualStack: QkQ,
        UseFIPS: QkQ,
        Endpoint: AkQ
      },
      rules: [{
        conditions: [{
          [vL]: e_Q,
          [bL]: [BkQ]
        }],
        rules: [{
          conditions: IkQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: h6A
        }, {
          conditions: YkQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: h6A
        }, {
          endpoint: {
            url: BkQ,
            properties: xL,
            headers: xL
          },
          type: g6A
        }],
        type: Fb
      }, {
        conditions: [{
          [vL]: e_Q,
          [bL]: JkQ
        }],
        rules: [{
          conditions: [{
            [vL]: "aws.partition",
            [bL]: JkQ,
            assign: $P1
          }],
          rules: [{
            conditions: [XkQ, VkQ],
            rules: [{
              conditions: [{
                [vL]: PCA,
                [bL]: [t_Q, GkQ]
              }, ZkQ],
              rules: [{
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: xL,
                  headers: xL
                },
                type: g6A
              }],
              type: Fb
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: h6A
            }],
            type: Fb
          }, {
            conditions: IkQ,
            rules: [{
              conditions: [{
                [vL]: PCA,
                [bL]: [GkQ, t_Q]
              }],
              rules: [{
                conditions: [{
                  [vL]: "stringEquals",
                  [bL]: [{
                    [vL]: wP1,
                    [bL]: [FkQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://oidc.{Region}.amazonaws.com",
                  properties: xL,
                  headers: xL
                },
                type: g6A
              }, {
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: xL,
                  headers: xL
                },
                type: g6A
              }],
              type: Fb
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: h6A
            }],
            type: Fb
          }, {
            conditions: YkQ,
            rules: [{
              conditions: [ZkQ],
              rules: [{
                endpoint: {
                  url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: xL,
                  headers: xL
                },
                type: g6A
              }],
              type: Fb
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: h6A
            }],
            type: Fb
          }, {
            endpoint: {
              url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
              properties: xL,
              headers: xL
            },
            type: g6A
          }],
          type: Fb
        }],
        type: Fb
      }, {
        error: "Invalid Configuration: Missing Region",
        type: h6A
      }]
    };
  KkQ.ruleSet = DW8
})
// @from(Start 3801369, End 3801933)
zkQ = z((CkQ) => {
  Object.defineProperty(CkQ, "__esModule", {
    value: !0
  });
  CkQ.defaultEndpointResolver = void 0;
  var HW8 = T6A(),
    qP1 = FI(),
    CW8 = HkQ(),
    EW8 = new qP1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    zW8 = (A, Q = {}) => {
      return EW8.get(A, () => (0, qP1.resolveEndpoint)(CW8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  CkQ.defaultEndpointResolver = zW8;
  qP1.customEndpointFunctions.aws = HW8.awsEndpointFunctions
})
// @from(Start 3801939, End 3803357)
NkQ = z((wkQ) => {
  Object.defineProperty(wkQ, "__esModule", {
    value: !0
  });
  wkQ.getRuntimeConfig = void 0;
  var UW8 = PF(),
    $W8 = iB(),
    wW8 = o6(),
    qW8 = NJ(),
    UkQ = ld(),
    $kQ = O2(),
    NW8 = zP1(),
    LW8 = zkQ(),
    MW8 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? UkQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? UkQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? LW8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? NW8.defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new UW8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new $W8.NoAuthSigner
        }],
        logger: A?.logger ?? new wW8.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO OIDC",
        urlParser: A?.urlParser ?? qW8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? $kQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? $kQ.toUtf8
      }
    };
  wkQ.getRuntimeConfig = MW8
})
// @from(Start 3803363, End 3805662)
jkQ = z((TkQ) => {
  Object.defineProperty(TkQ, "__esModule", {
    value: !0
  });
  TkQ.getRuntimeConfig = void 0;
  var OW8 = Co(),
    RW8 = OW8.__importDefault(UP1()),
    LkQ = PF(),
    MkQ = LCA(),
    kdA = f8(),
    TW8 = RX(),
    OkQ = D6(),
    wo = uI(),
    RkQ = IZ(),
    PW8 = TX(),
    jW8 = KW(),
    SW8 = NkQ(),
    _W8 = o6(),
    kW8 = PX(),
    yW8 = o6(),
    xW8 = (A) => {
      (0, yW8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, kW8.resolveDefaultsModeConfig)(A),
        B = () => Q().then(_W8.loadConfigsForDefaultMode),
        G = (0, SW8.getRuntimeConfig)(A);
      (0, LkQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, wo.loadConfig)(LkQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? PW8.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, MkQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: RW8.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, wo.loadConfig)(OkQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, wo.loadConfig)(kdA.NODE_REGION_CONFIG_OPTIONS, {
          ...kdA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: RkQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, wo.loadConfig)({
          ...OkQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || jW8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? TW8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? RkQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, wo.loadConfig)(kdA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, wo.loadConfig)(kdA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, wo.loadConfig)(MkQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  TkQ.getRuntimeConfig = xW8
})
// @from(Start 3805668, End 3825495)
MP1 = z(($O7, ByQ) => {
  var {
    defineProperty: ydA,
    getOwnPropertyDescriptor: vW8,
    getOwnPropertyNames: bW8
  } = Object, fW8 = Object.prototype.hasOwnProperty, P6 = (A, Q) => ydA(A, "name", {
    value: Q,
    configurable: !0
  }), hW8 = (A, Q) => {
    for (var B in Q) ydA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, gW8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of bW8(Q))
        if (!fW8.call(A, Z) && Z !== B) ydA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vW8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, uW8 = (A) => gW8(ydA({}, "__esModule", {
    value: !0
  }), A), fkQ = {};
  hW8(fkQ, {
    $Command: () => ukQ.Command,
    AccessDeniedException: () => mkQ,
    AuthorizationPendingException: () => dkQ,
    CreateTokenCommand: () => AyQ,
    CreateTokenRequestFilterSensitiveLog: () => ckQ,
    CreateTokenResponseFilterSensitiveLog: () => pkQ,
    ExpiredTokenException: () => lkQ,
    InternalServerException: () => ikQ,
    InvalidClientException: () => nkQ,
    InvalidGrantException: () => akQ,
    InvalidRequestException: () => skQ,
    InvalidScopeException: () => rkQ,
    SSOOIDC: () => QyQ,
    SSOOIDCClient: () => gkQ,
    SSOOIDCServiceException: () => Pw,
    SlowDownException: () => okQ,
    UnauthorizedClientException: () => tkQ,
    UnsupportedGrantTypeException: () => ekQ,
    __Client: () => hkQ.Client
  });
  ByQ.exports = uW8(fkQ);
  var SkQ = CCA(),
    mW8 = ECA(),
    dW8 = zCA(),
    _kQ = y6A(),
    cW8 = f8(),
    NP1 = iB(),
    pW8 = LX(),
    lW8 = q5(),
    kkQ = D6(),
    hkQ = o6(),
    ykQ = zP1(),
    iW8 = P6((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "sso-oauth"
      })
    }, "resolveClientEndpointParameters"),
    nW8 = {
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
    aW8 = jkQ(),
    xkQ = OCA(),
    vkQ = az(),
    bkQ = o6(),
    sW8 = P6((A) => {
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
    rW8 = P6((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    oW8 = P6((A, Q) => {
      let B = Object.assign((0, xkQ.getAwsRegionExtensionConfiguration)(A), (0, bkQ.getDefaultExtensionConfiguration)(A), (0, vkQ.getHttpHandlerExtensionConfiguration)(A), sW8(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, xkQ.resolveAwsRegionExtensionConfiguration)(B), (0, bkQ.resolveDefaultRuntimeConfig)(B), (0, vkQ.resolveHttpHandlerRuntimeConfig)(B), rW8(B))
    }, "resolveRuntimeExtensions"),
    gkQ = class extends hkQ.Client {
      static {
        P6(this, "SSOOIDCClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, aW8.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = iW8(Q),
          G = (0, _kQ.resolveUserAgentConfig)(B),
          Z = (0, kkQ.resolveRetryConfig)(G),
          I = (0, cW8.resolveRegionConfig)(Z),
          Y = (0, SkQ.resolveHostHeaderConfig)(I),
          J = (0, lW8.resolveEndpointConfig)(Y),
          W = (0, ykQ.resolveHttpAuthSchemeConfig)(J),
          X = oW8(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, _kQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, kkQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, pW8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, SkQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, mW8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, dW8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, NP1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: ykQ.defaultSSOOIDCHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: P6(async (V) => new NP1.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, NP1.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    tW8 = o6(),
    eW8 = q5(),
    AX8 = GZ(),
    ukQ = o6(),
    m6A = o6(),
    QX8 = o6(),
    Pw = class A extends QX8.ServiceException {
      static {
        P6(this, "SSOOIDCServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    mkQ = class A extends Pw {
      static {
        P6(this, "AccessDeniedException")
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
    dkQ = class A extends Pw {
      static {
        P6(this, "AuthorizationPendingException")
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
    ckQ = P6((A) => ({
      ...A,
      ...A.clientSecret && {
        clientSecret: m6A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: m6A.SENSITIVE_STRING
      },
      ...A.codeVerifier && {
        codeVerifier: m6A.SENSITIVE_STRING
      }
    }), "CreateTokenRequestFilterSensitiveLog"),
    pkQ = P6((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: m6A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: m6A.SENSITIVE_STRING
      },
      ...A.idToken && {
        idToken: m6A.SENSITIVE_STRING
      }
    }), "CreateTokenResponseFilterSensitiveLog"),
    lkQ = class A extends Pw {
      static {
        P6(this, "ExpiredTokenException")
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
    ikQ = class A extends Pw {
      static {
        P6(this, "InternalServerException")
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
    nkQ = class A extends Pw {
      static {
        P6(this, "InvalidClientException")
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
    akQ = class A extends Pw {
      static {
        P6(this, "InvalidGrantException")
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
    skQ = class A extends Pw {
      static {
        P6(this, "InvalidRequestException")
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
    rkQ = class A extends Pw {
      static {
        P6(this, "InvalidScopeException")
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
    okQ = class A extends Pw {
      static {
        P6(this, "SlowDownException")
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
    tkQ = class A extends Pw {
      static {
        P6(this, "UnauthorizedClientException")
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
    ekQ = class A extends Pw {
      static {
        P6(this, "UnsupportedGrantTypeException")
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
    LP1 = PF(),
    BX8 = iB(),
    I2 = o6(),
    GX8 = P6(async (A, Q) => {
      let B = (0, BX8.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/token");
      let Z;
      return Z = JSON.stringify((0, I2.take)(A, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: P6((I) => (0, I2._json)(I), "scope")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateTokenCommand"),
    ZX8 = P6(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return IX8(A, Q);
      let B = (0, I2.map)({
          $metadata: fL(A)
        }),
        G = (0, I2.expectNonNull)((0, I2.expectObject)(await (0, LP1.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, I2.take)(G, {
          accessToken: I2.expectString,
          expiresIn: I2.expectInt32,
          idToken: I2.expectString,
          refreshToken: I2.expectString,
          tokenType: I2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateTokenCommand"),
    IX8 = P6(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, LP1.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, LP1.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
          throw await JX8(B, Q);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
          throw await WX8(B, Q);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
          throw await XX8(B, Q);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
          throw await VX8(B, Q);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
          throw await FX8(B, Q);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
          throw await KX8(B, Q);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
          throw await DX8(B, Q);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
          throw await HX8(B, Q);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
          throw await CX8(B, Q);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
          throw await EX8(B, Q);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
          throw await zX8(B, Q);
        default:
          let Z = B.body;
          return YX8({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    YX8 = (0, I2.withBaseException)(Pw),
    JX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new mkQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    WX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new dkQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_AuthorizationPendingExceptionRes"),
    XX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new lkQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_ExpiredTokenExceptionRes"),
    VX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new ikQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    FX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new nkQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_InvalidClientExceptionRes"),
    KX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new akQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_InvalidGrantExceptionRes"),
    DX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new skQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    HX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new rkQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_InvalidScopeExceptionRes"),
    CX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new okQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_SlowDownExceptionRes"),
    EX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new tkQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedClientExceptionRes"),
    zX8 = P6(async (A, Q) => {
      let B = (0, I2.map)({}),
        G = A.body,
        Z = (0, I2.take)(G, {
          error: I2.expectString,
          error_description: I2.expectString
        });
      Object.assign(B, Z);
      let I = new ekQ({
        $metadata: fL(A),
        ...B
      });
      return (0, I2.decorateServiceException)(I, A.body)
    }, "de_UnsupportedGrantTypeExceptionRes"),
    fL = P6((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    AyQ = class extends ukQ.Command.classBuilder().ep(nW8).m(function(A, Q, B, G) {
      return [(0, AX8.getSerdePlugin)(B, this.serialize, this.deserialize), (0, eW8.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").f(ckQ, pkQ).ser(GX8).de(ZX8).build() {
      static {
        P6(this, "CreateTokenCommand")
      }
    },
    UX8 = {
      CreateTokenCommand: AyQ
    },
    QyQ = class extends gkQ {
      static {
        P6(this, "SSOOIDC")
      }
    };
  (0, tW8.createAggregatedClient)(UX8, QyQ)
})
// @from(Start 3825501, End 3831670)
RP1 = z((LO7, XyQ) => {
  var {
    create: $X8,
    defineProperty: SCA,
    getOwnPropertyDescriptor: wX8,
    getOwnPropertyNames: qX8,
    getPrototypeOf: NX8
  } = Object, LX8 = Object.prototype.hasOwnProperty, Kb = (A, Q) => SCA(A, "name", {
    value: Q,
    configurable: !0
  }), MX8 = (A, Q) => {
    for (var B in Q) SCA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, IyQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qX8(Q))
        if (!LX8.call(A, Z) && Z !== B) SCA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wX8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, YyQ = (A, Q, B) => (B = A != null ? $X8(NX8(A)) : {}, IyQ(Q || !A || !A.__esModule ? SCA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), OX8 = (A) => IyQ(SCA({}, "__esModule", {
    value: !0
  }), A), JyQ = {};
  MX8(JyQ, {
    fromEnvSigningName: () => PX8,
    fromSso: () => WyQ,
    fromStatic: () => vX8,
    nodeProvider: () => bX8
  });
  XyQ.exports = OX8(JyQ);
  var RX8 = aR(),
    TX8 = yT1(),
    jw = j2(),
    PX8 = Kb(({
      logger: A,
      signingName: Q
    } = {}) => async () => {
      if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !Q) throw new jw.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
        logger: A
      });
      let B = (0, TX8.getBearerTokenEnvKey)(Q);
      if (!(B in process.env)) throw new jw.TokenProviderError(`Token not present in '${B}' environment variable`, {
        logger: A
      });
      let G = {
        token: process.env[B]
      };
      return (0, RX8.setTokenFeature)(G, "BEARER_SERVICE_ENV_VARS", "3"), G
    }, "fromEnvSigningName"),
    jX8 = 300000,
    OP1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.",
    SX8 = Kb(async (A, Q = {}) => {
      let {
        SSOOIDCClient: B
      } = await Promise.resolve().then(() => YyQ(MP1()));
      return new B(Object.assign({}, Q.clientConfig ?? {}, {
        region: A ?? Q.clientConfig?.region,
        logger: Q.clientConfig?.logger ?? Q.parentClientConfig?.logger
      }))
    }, "getSsoOidcClient"),
    _X8 = Kb(async (A, Q, B = {}) => {
      let {
        CreateTokenCommand: G
      } = await Promise.resolve().then(() => YyQ(MP1()));
      return (await SX8(Q, B)).send(new G({
        clientId: A.clientId,
        clientSecret: A.clientSecret,
        refreshToken: A.refreshToken,
        grantType: "refresh_token"
      }))
    }, "getNewSsoOidcToken"),
    GyQ = Kb((A) => {
      if (A.expiration && A.expiration.getTime() < Date.now()) throw new jw.TokenProviderError(`Token is expired. ${OP1}`, !1)
    }, "validateTokenExpiry"),
    qo = Kb((A, Q, B = !1) => {
      if (typeof Q > "u") throw new jw.TokenProviderError(`Value not present for '${A}' in SSO Token${B?". Cannot refresh":""}. ${OP1}`, !1)
    }, "validateTokenKey"),
    jCA = SG(),
    kX8 = UA("fs"),
    {
      writeFile: yX8
    } = kX8.promises,
    xX8 = Kb((A, Q) => {
      let B = (0, jCA.getSSOTokenFilepath)(A),
        G = JSON.stringify(Q, null, 2);
      return yX8(B, G)
    }, "writeSSOTokenToFile"),
    ZyQ = new Date(0),
    WyQ = Kb((A = {}) => async ({
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
      let G = await (0, jCA.parseKnownFiles)(B),
        Z = (0, jCA.getProfileName)({
          profile: B.profile ?? Q?.profile
        }),
        I = G[Z];
      if (!I) throw new jw.TokenProviderError(`Profile '${Z}' could not be found in shared credentials file.`, !1);
      else if (!I.sso_session) throw new jw.TokenProviderError(`Profile '${Z}' is missing required property 'sso_session'.`);
      let Y = I.sso_session,
        W = (await (0, jCA.loadSsoSessionData)(B))[Y];
      if (!W) throw new jw.TokenProviderError(`Sso session '${Y}' could not be found in shared credentials file.`, !1);
      for (let C of ["sso_start_url", "sso_region"])
        if (!W[C]) throw new jw.TokenProviderError(`Sso session '${Y}' is missing required property '${C}'.`, !1);
      let {
        sso_start_url: X,
        sso_region: V
      } = W, F;
      try {
        F = await (0, jCA.getSSOTokenFromFile)(Y)
      } catch (C) {
        throw new jw.TokenProviderError(`The SSO session token associated with profile=${Z} was not found or is invalid. ${OP1}`, !1)
      }
      qo("accessToken", F.accessToken), qo("expiresAt", F.expiresAt);
      let {
        accessToken: K,
        expiresAt: D
      } = F, H = {
        token: K,
        expiration: new Date(D)
      };
      if (H.expiration.getTime() - Date.now() > jX8) return H;
      if (Date.now() - ZyQ.getTime() < 30000) return GyQ(H), H;
      qo("clientId", F.clientId, !0), qo("clientSecret", F.clientSecret, !0), qo("refreshToken", F.refreshToken, !0);
      try {
        ZyQ.setTime(Date.now());
        let C = await _X8(F, V, B);
        qo("accessToken", C.accessToken), qo("expiresIn", C.expiresIn);
        let E = new Date(Date.now() + C.expiresIn * 1000);
        try {
          await xX8(Y, {
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
        return GyQ(H), H
      }
    }, "fromSso"),
    vX8 = Kb(({
      token: A,
      logger: Q
    }) => async () => {
      if (Q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new jw.TokenProviderError("Please pass a valid token to fromStatic", !1);
      return A
    }, "fromStatic"),
    bX8 = Kb((A = {}) => (0, jw.memoize)((0, jw.chain)(WyQ(A), async () => {
      throw new jw.TokenProviderError("Could not load token from any providers", !1)
    }), (Q) => Q.expiration !== void 0 && Q.expiration.getTime() - Date.now() < 300000, (Q) => Q.expiration !== void 0), "nodeProvider")
})
// @from(Start 3831676, End 3838918)
PP1 = z((MO7, UyQ) => {
  var {
    defineProperty: vdA,
    getOwnPropertyDescriptor: fX8,
    getOwnPropertyNames: KyQ
  } = Object, hX8 = Object.prototype.hasOwnProperty, bdA = (A, Q) => vdA(A, "name", {
    value: Q,
    configurable: !0
  }), gX8 = (A, Q) => function() {
    return A && (Q = (0, A[KyQ(A)[0]])(A = 0)), Q
  }, DyQ = (A, Q) => {
    for (var B in Q) vdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uX8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of KyQ(Q))
        if (!hX8.call(A, Z) && Z !== B) vdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = fX8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mX8 = (A) => uX8(vdA({}, "__esModule", {
    value: !0
  }), A), HyQ = {};
  DyQ(HyQ, {
    GetRoleCredentialsCommand: () => TP1.GetRoleCredentialsCommand,
    SSOClient: () => TP1.SSOClient
  });
  var TP1, dX8 = gX8({
      "src/loadSso.ts"() {
        TP1 = s_Q()
      }
    }),
    CyQ = {};
  DyQ(CyQ, {
    fromSSO: () => pX8,
    isSsoProfile: () => EyQ,
    validateSsoProfile: () => zyQ
  });
  UyQ.exports = mX8(CyQ);
  var EyQ = bdA((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    VyQ = aR(),
    cX8 = RP1(),
    sR = j2(),
    xdA = SG(),
    _CA = !1,
    FyQ = bdA(async ({
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
        let v = await (0, cX8.fromSso)({
          profile: W
        })();
        V = {
          accessToken: v.token,
          expiresAt: new Date(v.expiration).toISOString()
        }
      } catch (v) {
        throw new sR.CredentialsProviderError(v.message, {
          tryNextLink: _CA,
          logger: X
        })
      } else try {
        V = await (0, xdA.getSSOTokenFromFile)(A)
      } catch (v) {
        throw new sR.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
          tryNextLink: _CA,
          logger: X
        })
      }
      if (new Date(V.expiresAt).getTime() - Date.now() <= 0) throw new sR.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: _CA,
        logger: X
      });
      let {
        accessToken: K
      } = V, {
        SSOClient: D,
        GetRoleCredentialsCommand: H
      } = await Promise.resolve().then(() => (dX8(), HyQ)), C = I || new D(Object.assign({}, Y ?? {}, {
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
        throw new sR.CredentialsProviderError(v, {
          tryNextLink: _CA,
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
      if (!U || !q || !w || !N) throw new sR.CredentialsProviderError("SSO returns an invalid temporary credential.", {
        tryNextLink: _CA,
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
      if (Q)(0, VyQ.setCredentialFeature)(y, "CREDENTIALS_SSO", "s");
      else(0, VyQ.setCredentialFeature)(y, "CREDENTIALS_SSO_LEGACY", "u");
      return y
    }, "resolveSSOCredentials"),
    zyQ = bdA((A, Q) => {
      let {
        sso_start_url: B,
        sso_account_id: G,
        sso_region: Z,
        sso_role_name: I
      } = A;
      if (!B || !G || !Z || !I) throw new sR.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
        tryNextLink: !1,
        logger: Q
      });
      return A
    }, "validateSsoProfile"),
    pX8 = bdA((A = {}) => async ({
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
      } = A, W = (0, xdA.getProfileName)({
        profile: A.profile ?? Q?.profile
      });
      if (!B && !G && !Z && !I && !Y) {
        let V = (await (0, xdA.parseKnownFiles)(A))[W];
        if (!V) throw new sR.CredentialsProviderError(`Profile ${W} was not found.`, {
          logger: A.logger
        });
        if (!EyQ(V)) throw new sR.CredentialsProviderError(`Profile ${W} is not configured with SSO credentials.`, {
          logger: A.logger
        });
        if (V?.sso_session) {
          let U = (await (0, xdA.loadSsoSessionData)(A))[V.sso_session],
            q = ` configurations in profile ${W} and sso-session ${V.sso_session}`;
          if (Z && Z !== U.sso_region) throw new sR.CredentialsProviderError("Conflicting SSO region" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          if (B && B !== U.sso_start_url) throw new sR.CredentialsProviderError("Conflicting SSO start_url" + q, {
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
        } = zyQ(V, A.logger);
        return FyQ({
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
      } else if (!B || !G || !Z || !I) throw new sR.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
        tryNextLink: !1,
        logger: A.logger
      });
      else return FyQ({
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
// @from(Start 3838924, End 3840581)
SP1 = z(($yQ) => {
  Object.defineProperty($yQ, "__esModule", {
    value: !0
  });
  $yQ.resolveHttpAuthSchemeConfig = $yQ.resolveStsAuthConfig = $yQ.defaultSTSHttpAuthSchemeProvider = $yQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var lX8 = PF(),
    jP1 = w7(),
    iX8 = kCA(),
    nX8 = async (A, Q, B) => {
      return {
        operation: (0, jP1.getSmithyContext)(Q).operation,
        region: await (0, jP1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  $yQ.defaultSTSHttpAuthSchemeParametersProvider = nX8;

  function aX8(A) {
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

  function sX8(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var rX8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithWebIdentity": {
        Q.push(sX8(A));
        break
      }
      default:
        Q.push(aX8(A))
    }
    return Q
  };
  $yQ.defaultSTSHttpAuthSchemeProvider = rX8;
  var oX8 = (A) => Object.assign(A, {
    stsClientCtor: iX8.STSClient
  });
  $yQ.resolveStsAuthConfig = oX8;
  var tX8 = (A) => {
    let Q = $yQ.resolveStsAuthConfig(A),
      B = (0, lX8.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, jP1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  $yQ.resolveHttpAuthSchemeConfig = tX8
})
// @from(Start 3840587, End 3841475)
yCA = z((NyQ) => {
  Object.defineProperty(NyQ, "__esModule", {
    value: !0
  });
  NyQ.commonParams = NyQ.resolveClientEndpointParameters = void 0;
  var QV8 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  NyQ.resolveClientEndpointParameters = QV8;
  NyQ.commonParams = {
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
// @from(Start 3841481, End 3849658)
nyQ = z((lyQ) => {
  Object.defineProperty(lyQ, "__esModule", {
    value: !0
  });
  lyQ.ruleSet = void 0;
  var vyQ = "required",
    d8 = "type",
    G7 = "fn",
    Z7 = "argv",
    sd = "ref",
    MyQ = !1,
    _P1 = !0,
    ad = "booleanEquals",
    FD = "stringEquals",
    byQ = "sigv4",
    fyQ = "sts",
    hyQ = "us-east-1",
    aI = "endpoint",
    OyQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    lS = "tree",
    d6A = "error",
    yP1 = "getAttr",
    RyQ = {
      [vyQ]: !1,
      [d8]: "String"
    },
    kP1 = {
      [vyQ]: !0,
      default: !1,
      [d8]: "Boolean"
    },
    gyQ = {
      [sd]: "Endpoint"
    },
    TyQ = {
      [G7]: "isSet",
      [Z7]: [{
        [sd]: "Region"
      }]
    },
    KD = {
      [sd]: "Region"
    },
    PyQ = {
      [G7]: "aws.partition",
      [Z7]: [KD],
      assign: "PartitionResult"
    },
    uyQ = {
      [sd]: "UseFIPS"
    },
    myQ = {
      [sd]: "UseDualStack"
    },
    RH = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: byQ,
          signingName: fyQ,
          signingRegion: hyQ
        }]
      },
      headers: {}
    },
    Sw = {},
    jyQ = {
      conditions: [{
        [G7]: FD,
        [Z7]: [KD, "aws-global"]
      }],
      [aI]: RH,
      [d8]: aI
    },
    dyQ = {
      [G7]: ad,
      [Z7]: [uyQ, !0]
    },
    cyQ = {
      [G7]: ad,
      [Z7]: [myQ, !0]
    },
    SyQ = {
      [G7]: yP1,
      [Z7]: [{
        [sd]: "PartitionResult"
      }, "supportsFIPS"]
    },
    pyQ = {
      [sd]: "PartitionResult"
    },
    _yQ = {
      [G7]: ad,
      [Z7]: [!0, {
        [G7]: yP1,
        [Z7]: [pyQ, "supportsDualStack"]
      }]
    },
    kyQ = [{
      [G7]: "isSet",
      [Z7]: [gyQ]
    }],
    yyQ = [dyQ],
    xyQ = [cyQ],
    GV8 = {
      version: "1.0",
      parameters: {
        Region: RyQ,
        UseDualStack: kP1,
        UseFIPS: kP1,
        Endpoint: RyQ,
        UseGlobalEndpoint: kP1
      },
      rules: [{
        conditions: [{
          [G7]: ad,
          [Z7]: [{
            [sd]: "UseGlobalEndpoint"
          }, _P1]
        }, {
          [G7]: "not",
          [Z7]: kyQ
        }, TyQ, PyQ, {
          [G7]: ad,
          [Z7]: [uyQ, MyQ]
        }, {
          [G7]: ad,
          [Z7]: [myQ, MyQ]
        }],
        rules: [{
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "ap-northeast-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "ap-south-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "ap-southeast-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "ap-southeast-2"]
          }],
          endpoint: RH,
          [d8]: aI
        }, jyQ, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "ca-central-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "eu-central-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "eu-north-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "eu-west-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "eu-west-2"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "eu-west-3"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "sa-east-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, hyQ]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "us-east-2"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "us-west-1"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          conditions: [{
            [G7]: FD,
            [Z7]: [KD, "us-west-2"]
          }],
          endpoint: RH,
          [d8]: aI
        }, {
          endpoint: {
            url: OyQ,
            properties: {
              authSchemes: [{
                name: byQ,
                signingName: fyQ,
                signingRegion: "{Region}"
              }]
            },
            headers: Sw
          },
          [d8]: aI
        }],
        [d8]: lS
      }, {
        conditions: kyQ,
        rules: [{
          conditions: yyQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [d8]: d6A
        }, {
          conditions: xyQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [d8]: d6A
        }, {
          endpoint: {
            url: gyQ,
            properties: Sw,
            headers: Sw
          },
          [d8]: aI
        }],
        [d8]: lS
      }, {
        conditions: [TyQ],
        rules: [{
          conditions: [PyQ],
          rules: [{
            conditions: [dyQ, cyQ],
            rules: [{
              conditions: [{
                [G7]: ad,
                [Z7]: [_P1, SyQ]
              }, _yQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: Sw,
                  headers: Sw
                },
                [d8]: aI
              }],
              [d8]: lS
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [d8]: d6A
            }],
            [d8]: lS
          }, {
            conditions: yyQ,
            rules: [{
              conditions: [{
                [G7]: ad,
                [Z7]: [SyQ, _P1]
              }],
              rules: [{
                conditions: [{
                  [G7]: FD,
                  [Z7]: [{
                    [G7]: yP1,
                    [Z7]: [pyQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: Sw,
                  headers: Sw
                },
                [d8]: aI
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: Sw,
                  headers: Sw
                },
                [d8]: aI
              }],
              [d8]: lS
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [d8]: d6A
            }],
            [d8]: lS
          }, {
            conditions: xyQ,
            rules: [{
              conditions: [_yQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: Sw,
                  headers: Sw
                },
                [d8]: aI
              }],
              [d8]: lS
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [d8]: d6A
            }],
            [d8]: lS
          }, jyQ, {
            endpoint: {
              url: OyQ,
              properties: Sw,
              headers: Sw
            },
            [d8]: aI
          }],
          [d8]: lS
        }],
        [d8]: lS
      }, {
        error: "Invalid Configuration: Missing Region",
        [d8]: d6A
      }]
    };
  lyQ.ruleSet = GV8
})
// @from(Start 3849664, End 3850249)
ryQ = z((ayQ) => {
  Object.defineProperty(ayQ, "__esModule", {
    value: !0
  });
  ayQ.defaultEndpointResolver = void 0;
  var ZV8 = T6A(),
    xP1 = FI(),
    IV8 = nyQ(),
    YV8 = new xP1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    JV8 = (A, Q = {}) => {
      return YV8.get(A, () => (0, xP1.resolveEndpoint)(IV8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  ayQ.defaultEndpointResolver = JV8;
  xP1.customEndpointFunctions.aws = ZV8.awsEndpointFunctions
})
// @from(Start 3850255, End 3851664)
QxQ = z((eyQ) => {
  Object.defineProperty(eyQ, "__esModule", {
    value: !0
  });
  eyQ.getRuntimeConfig = void 0;
  var WV8 = PF(),
    XV8 = iB(),
    VV8 = o6(),
    FV8 = NJ(),
    oyQ = ld(),
    tyQ = O2(),
    KV8 = SP1(),
    DV8 = ryQ(),
    HV8 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? oyQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? oyQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? DV8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? KV8.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new WV8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new XV8.NoAuthSigner
        }],
        logger: A?.logger ?? new VV8.NoOpLogger,
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? FV8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? tyQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? tyQ.toUtf8
      }
    };
  eyQ.getRuntimeConfig = HV8
})
// @from(Start 3851670, End 3854472)
JxQ = z((IxQ) => {
  Object.defineProperty(IxQ, "__esModule", {
    value: !0
  });
  IxQ.getRuntimeConfig = void 0;
  var CV8 = Co(),
    EV8 = CV8.__importDefault(UP1()),
    vP1 = PF(),
    BxQ = LCA(),
    fdA = f8(),
    zV8 = iB(),
    UV8 = RX(),
    GxQ = D6(),
    No = uI(),
    ZxQ = IZ(),
    $V8 = TX(),
    wV8 = KW(),
    qV8 = QxQ(),
    NV8 = o6(),
    LV8 = PX(),
    MV8 = o6(),
    OV8 = (A) => {
      (0, MV8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, LV8.resolveDefaultsModeConfig)(A),
        B = () => Q().then(NV8.loadConfigsForDefaultMode),
        G = (0, qV8.getRuntimeConfig)(A);
      (0, vP1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, No.loadConfig)(vP1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? $V8.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, BxQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: EV8.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4") || (async (Y) => await A.credentialDefaultProvider(Y?.__config || {})()),
          signer: new vP1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new zV8.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, No.loadConfig)(GxQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, No.loadConfig)(fdA.NODE_REGION_CONFIG_OPTIONS, {
          ...fdA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: ZxQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, No.loadConfig)({
          ...GxQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || wV8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? UV8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? ZxQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, No.loadConfig)(fdA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, No.loadConfig)(fdA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, No.loadConfig)(BxQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  IxQ.getRuntimeConfig = OV8
})
// @from(Start 3854478, End 3855497)
VxQ = z((WxQ) => {
  Object.defineProperty(WxQ, "__esModule", {
    value: !0
  });
  WxQ.resolveHttpAuthRuntimeConfig = WxQ.getHttpAuthExtensionConfiguration = void 0;
  var RV8 = (A) => {
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
  WxQ.getHttpAuthExtensionConfiguration = RV8;
  var TV8 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  WxQ.resolveHttpAuthRuntimeConfig = TV8
})
// @from(Start 3855503, End 3856228)
zxQ = z((CxQ) => {
  Object.defineProperty(CxQ, "__esModule", {
    value: !0
  });
  CxQ.resolveRuntimeExtensions = void 0;
  var FxQ = OCA(),
    KxQ = az(),
    DxQ = o6(),
    HxQ = VxQ(),
    jV8 = (A, Q) => {
      let B = Object.assign((0, FxQ.getAwsRegionExtensionConfiguration)(A), (0, DxQ.getDefaultExtensionConfiguration)(A), (0, KxQ.getHttpHandlerExtensionConfiguration)(A), (0, HxQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, FxQ.resolveAwsRegionExtensionConfiguration)(B), (0, DxQ.resolveDefaultRuntimeConfig)(B), (0, KxQ.resolveHttpHandlerRuntimeConfig)(B), (0, HxQ.resolveHttpAuthRuntimeConfig)(B))
    };
  CxQ.resolveRuntimeExtensions = jV8
})
// @from(Start 3856234, End 3858216)
kCA = z((fP1) => {
  Object.defineProperty(fP1, "__esModule", {
    value: !0
  });
  fP1.STSClient = fP1.__Client = void 0;
  var UxQ = CCA(),
    SV8 = ECA(),
    _V8 = zCA(),
    $xQ = y6A(),
    kV8 = f8(),
    bP1 = iB(),
    yV8 = LX(),
    xV8 = q5(),
    wxQ = D6(),
    NxQ = o6();
  Object.defineProperty(fP1, "__Client", {
    enumerable: !0,
    get: function() {
      return NxQ.Client
    }
  });
  var qxQ = SP1(),
    vV8 = yCA(),
    bV8 = JxQ(),
    fV8 = zxQ();
  class LxQ extends NxQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, bV8.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, vV8.resolveClientEndpointParameters)(Q),
        G = (0, $xQ.resolveUserAgentConfig)(B),
        Z = (0, wxQ.resolveRetryConfig)(G),
        I = (0, kV8.resolveRegionConfig)(Z),
        Y = (0, UxQ.resolveHostHeaderConfig)(I),
        J = (0, xV8.resolveEndpointConfig)(Y),
        W = (0, qxQ.resolveHttpAuthSchemeConfig)(J),
        X = (0, fV8.resolveRuntimeExtensions)(W, A?.extensions || []);
      this.config = X, this.middlewareStack.use((0, $xQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, wxQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, yV8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, UxQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, SV8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, _V8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, bP1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: qxQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (V) => new bP1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": V.credentials
        })
      })), this.middlewareStack.use((0, bP1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  fP1.STSClient = LxQ
})