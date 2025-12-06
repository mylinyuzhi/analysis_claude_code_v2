
// @from(Start 2748913, End 2765461)
q7Q = z((YU7, w7Q) => {
  var {
    defineProperty: IgA,
    getOwnPropertyDescriptor: Zy4,
    getOwnPropertyNames: Iy4
  } = Object, Yy4 = Object.prototype.hasOwnProperty, N5 = (A, Q) => IgA(A, "name", {
    value: Q,
    configurable: !0
  }), Jy4 = (A, Q) => {
    for (var B in Q) IgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Wy4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Iy4(Q))
        if (!Yy4.call(A, Z) && Z !== B) IgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Zy4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Xy4 = (A) => Wy4(IgA({}, "__esModule", {
    value: !0
  }), A), A7Q = {};
  Jy4(A7Q, {
    GetRoleCredentialsCommand: () => z7Q,
    GetRoleCredentialsRequestFilterSensitiveLog: () => I7Q,
    GetRoleCredentialsResponseFilterSensitiveLog: () => J7Q,
    InvalidRequestException: () => Q7Q,
    ListAccountRolesCommand: () => lw1,
    ListAccountRolesRequestFilterSensitiveLog: () => W7Q,
    ListAccountsCommand: () => iw1,
    ListAccountsRequestFilterSensitiveLog: () => X7Q,
    LogoutCommand: () => U7Q,
    LogoutRequestFilterSensitiveLog: () => V7Q,
    ResourceNotFoundException: () => B7Q,
    RoleCredentialsFilterSensitiveLog: () => Y7Q,
    SSO: () => $7Q,
    SSOClient: () => JgA,
    SSOServiceException: () => Z8A,
    TooManyRequestsException: () => G7Q,
    UnauthorizedException: () => Z7Q,
    __Client: () => X2.Client,
    paginateListAccountRoles: () => vy4,
    paginateListAccounts: () => by4
  });
  w7Q.exports = Xy4(A7Q);
  var a3Q = yDA(),
    Vy4 = xDA(),
    Fy4 = vDA(),
    s3Q = r4A(),
    Ky4 = f8(),
    Rv = iB(),
    Dy4 = LX(),
    HHA = q5(),
    r3Q = D6(),
    o3Q = fw1(),
    Hy4 = N5((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "awsssoportal"
      })
    }, "resolveClientEndpointParameters"),
    YgA = {
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
    Cy4 = m3Q(),
    t3Q = KHA(),
    e3Q = nC(),
    X2 = K6(),
    Ey4 = N5((A) => {
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
    zy4 = N5((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    Uy4 = N5((A, Q) => {
      let B = Object.assign((0, t3Q.getAwsRegionExtensionConfiguration)(A), (0, X2.getDefaultExtensionConfiguration)(A), (0, e3Q.getHttpHandlerExtensionConfiguration)(A), Ey4(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, t3Q.resolveAwsRegionExtensionConfiguration)(B), (0, X2.resolveDefaultRuntimeConfig)(B), (0, e3Q.resolveHttpHandlerRuntimeConfig)(B), zy4(B))
    }, "resolveRuntimeExtensions"),
    JgA = class extends X2.Client {
      static {
        N5(this, "SSOClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, Cy4.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = Hy4(Q),
          G = (0, s3Q.resolveUserAgentConfig)(B),
          Z = (0, r3Q.resolveRetryConfig)(G),
          I = (0, Ky4.resolveRegionConfig)(Z),
          Y = (0, a3Q.resolveHostHeaderConfig)(I),
          J = (0, HHA.resolveEndpointConfig)(Y),
          W = (0, o3Q.resolveHttpAuthSchemeConfig)(J),
          X = Uy4(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, s3Q.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, r3Q.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Dy4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, a3Q.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, Vy4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, Fy4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Rv.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: o3Q.defaultSSOHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: N5(async (V) => new Rv.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, Rv.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    WgA = GZ(),
    Z8A = class A extends X2.ServiceException {
      static {
        N5(this, "SSOServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    Q7Q = class A extends Z8A {
      static {
        N5(this, "InvalidRequestException")
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
    B7Q = class A extends Z8A {
      static {
        N5(this, "ResourceNotFoundException")
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
    G7Q = class A extends Z8A {
      static {
        N5(this, "TooManyRequestsException")
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
    Z7Q = class A extends Z8A {
      static {
        N5(this, "UnauthorizedException")
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
    I7Q = N5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: X2.SENSITIVE_STRING
      }
    }), "GetRoleCredentialsRequestFilterSensitiveLog"),
    Y7Q = N5((A) => ({
      ...A,
      ...A.secretAccessKey && {
        secretAccessKey: X2.SENSITIVE_STRING
      },
      ...A.sessionToken && {
        sessionToken: X2.SENSITIVE_STRING
      }
    }), "RoleCredentialsFilterSensitiveLog"),
    J7Q = N5((A) => ({
      ...A,
      ...A.roleCredentials && {
        roleCredentials: Y7Q(A.roleCredentials)
      }
    }), "GetRoleCredentialsResponseFilterSensitiveLog"),
    W7Q = N5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: X2.SENSITIVE_STRING
      }
    }), "ListAccountRolesRequestFilterSensitiveLog"),
    X7Q = N5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: X2.SENSITIVE_STRING
      }
    }), "ListAccountsRequestFilterSensitiveLog"),
    V7Q = N5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: X2.SENSITIVE_STRING
      }
    }), "LogoutRequestFilterSensitiveLog"),
    DHA = MF(),
    $y4 = N5(async (A, Q) => {
      let B = (0, Rv.requestBuilder)(A, Q),
        G = (0, X2.map)({}, X2.isSerializableHeaderValue, {
          [FgA]: A[VgA]
        });
      B.bp("/federation/credentials");
      let Z = (0, X2.map)({
          [yy4]: [, (0, X2.expectNonNull)(A[ky4], "roleName")],
          [K7Q]: [, (0, X2.expectNonNull)(A[F7Q], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_GetRoleCredentialsCommand"),
    wy4 = N5(async (A, Q) => {
      let B = (0, Rv.requestBuilder)(A, Q),
        G = (0, X2.map)({}, X2.isSerializableHeaderValue, {
          [FgA]: A[VgA]
        });
      B.bp("/assignment/roles");
      let Z = (0, X2.map)({
          [E7Q]: [, A[C7Q]],
          [H7Q]: [() => A.maxResults !== void 0, () => A[D7Q].toString()],
          [K7Q]: [, (0, X2.expectNonNull)(A[F7Q], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountRolesCommand"),
    qy4 = N5(async (A, Q) => {
      let B = (0, Rv.requestBuilder)(A, Q),
        G = (0, X2.map)({}, X2.isSerializableHeaderValue, {
          [FgA]: A[VgA]
        });
      B.bp("/assignment/accounts");
      let Z = (0, X2.map)({
          [E7Q]: [, A[C7Q]],
          [H7Q]: [() => A.maxResults !== void 0, () => A[D7Q].toString()]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountsCommand"),
    Ny4 = N5(async (A, Q) => {
      let B = (0, Rv.requestBuilder)(A, Q),
        G = (0, X2.map)({}, X2.isSerializableHeaderValue, {
          [FgA]: A[VgA]
        });
      B.bp("/logout");
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_LogoutCommand"),
    Ly4 = N5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return XgA(A, Q);
      let B = (0, X2.map)({
          $metadata: $d(A)
        }),
        G = (0, X2.expectNonNull)((0, X2.expectObject)(await (0, DHA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, X2.take)(G, {
          roleCredentials: X2._json
        });
      return Object.assign(B, Z), B
    }, "de_GetRoleCredentialsCommand"),
    My4 = N5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return XgA(A, Q);
      let B = (0, X2.map)({
          $metadata: $d(A)
        }),
        G = (0, X2.expectNonNull)((0, X2.expectObject)(await (0, DHA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, X2.take)(G, {
          nextToken: X2.expectString,
          roleList: X2._json
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountRolesCommand"),
    Oy4 = N5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return XgA(A, Q);
      let B = (0, X2.map)({
          $metadata: $d(A)
        }),
        G = (0, X2.expectNonNull)((0, X2.expectObject)(await (0, DHA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, X2.take)(G, {
          accountList: X2._json,
          nextToken: X2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountsCommand"),
    Ry4 = N5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return XgA(A, Q);
      let B = (0, X2.map)({
        $metadata: $d(A)
      });
      return await (0, X2.collectBody)(A.body, Q), B
    }, "de_LogoutCommand"),
    XgA = N5(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, DHA.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, DHA.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await Py4(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await jy4(B, Q);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await Sy4(B, Q);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await _y4(B, Q);
        default:
          let Z = B.body;
          return Ty4({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Ty4 = (0, X2.withBaseException)(Z8A),
    Py4 = N5(async (A, Q) => {
      let B = (0, X2.map)({}),
        G = A.body,
        Z = (0, X2.take)(G, {
          message: X2.expectString
        });
      Object.assign(B, Z);
      let I = new Q7Q({
        $metadata: $d(A),
        ...B
      });
      return (0, X2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    jy4 = N5(async (A, Q) => {
      let B = (0, X2.map)({}),
        G = A.body,
        Z = (0, X2.take)(G, {
          message: X2.expectString
        });
      Object.assign(B, Z);
      let I = new B7Q({
        $metadata: $d(A),
        ...B
      });
      return (0, X2.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    Sy4 = N5(async (A, Q) => {
      let B = (0, X2.map)({}),
        G = A.body,
        Z = (0, X2.take)(G, {
          message: X2.expectString
        });
      Object.assign(B, Z);
      let I = new G7Q({
        $metadata: $d(A),
        ...B
      });
      return (0, X2.decorateServiceException)(I, A.body)
    }, "de_TooManyRequestsExceptionRes"),
    _y4 = N5(async (A, Q) => {
      let B = (0, X2.map)({}),
        G = A.body,
        Z = (0, X2.take)(G, {
          message: X2.expectString
        });
      Object.assign(B, Z);
      let I = new Z7Q({
        $metadata: $d(A),
        ...B
      });
      return (0, X2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedExceptionRes"),
    $d = N5((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    F7Q = "accountId",
    VgA = "accessToken",
    K7Q = "account_id",
    D7Q = "maxResults",
    H7Q = "max_result",
    C7Q = "nextToken",
    E7Q = "next_token",
    ky4 = "roleName",
    yy4 = "role_name",
    FgA = "x-amz-sso_bearer_token",
    z7Q = class extends X2.Command.classBuilder().ep(YgA).m(function(A, Q, B, G) {
      return [(0, WgA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, HHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").f(I7Q, J7Q).ser($y4).de(Ly4).build() {
      static {
        N5(this, "GetRoleCredentialsCommand")
      }
    },
    lw1 = class extends X2.Command.classBuilder().ep(YgA).m(function(A, Q, B, G) {
      return [(0, WgA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, HHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").f(W7Q, void 0).ser(wy4).de(My4).build() {
      static {
        N5(this, "ListAccountRolesCommand")
      }
    },
    iw1 = class extends X2.Command.classBuilder().ep(YgA).m(function(A, Q, B, G) {
      return [(0, WgA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, HHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").f(X7Q, void 0).ser(qy4).de(Oy4).build() {
      static {
        N5(this, "ListAccountsCommand")
      }
    },
    U7Q = class extends X2.Command.classBuilder().ep(YgA).m(function(A, Q, B, G) {
      return [(0, WgA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, HHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").f(V7Q, void 0).ser(Ny4).de(Ry4).build() {
      static {
        N5(this, "LogoutCommand")
      }
    },
    xy4 = {
      GetRoleCredentialsCommand: z7Q,
      ListAccountRolesCommand: lw1,
      ListAccountsCommand: iw1,
      LogoutCommand: U7Q
    },
    $7Q = class extends JgA {
      static {
        N5(this, "SSO")
      }
    };
  (0, X2.createAggregatedClient)(xy4, $7Q);
  var vy4 = (0, Rv.createPaginator)(JgA, lw1, "nextToken", "nextToken", "maxResults"),
    by4 = (0, Rv.createPaginator)(JgA, iw1, "nextToken", "nextToken", "maxResults")
})
// @from(Start 2765467, End 2766938)
aw1 = z((N7Q) => {
  Object.defineProperty(N7Q, "__esModule", {
    value: !0
  });
  N7Q.resolveHttpAuthSchemeConfig = N7Q.defaultSSOOIDCHttpAuthSchemeProvider = N7Q.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
  var fy4 = MF(),
    nw1 = w7(),
    hy4 = async (A, Q, B) => {
      return {
        operation: (0, nw1.getSmithyContext)(Q).operation,
        region: await (0, nw1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  N7Q.defaultSSOOIDCHttpAuthSchemeParametersProvider = hy4;

  function gy4(A) {
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

  function uy4(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var my4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateToken": {
        Q.push(uy4(A));
        break
      }
      default:
        Q.push(gy4(A))
    }
    return Q
  };
  N7Q.defaultSSOOIDCHttpAuthSchemeProvider = my4;
  var dy4 = (A) => {
    let Q = (0, fy4.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, nw1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  N7Q.resolveHttpAuthSchemeConfig = dy4
})
// @from(Start 2766944, End 2771229)
sw1 = z((HU7, ly4) => {
  ly4.exports = {
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
// @from(Start 2771235, End 2775902)
u7Q = z((h7Q) => {
  Object.defineProperty(h7Q, "__esModule", {
    value: !0
  });
  h7Q.ruleSet = void 0;
  var x7Q = "required",
    VL = "fn",
    FL = "argv",
    J8A = "ref",
    M7Q = !0,
    O7Q = "isSet",
    CHA = "booleanEquals",
    I8A = "error",
    Y8A = "endpoint",
    Tv = "tree",
    rw1 = "PartitionResult",
    ow1 = "getAttr",
    R7Q = {
      [x7Q]: !1,
      type: "String"
    },
    T7Q = {
      [x7Q]: !0,
      default: !1,
      type: "Boolean"
    },
    P7Q = {
      [J8A]: "Endpoint"
    },
    v7Q = {
      [VL]: CHA,
      [FL]: [{
        [J8A]: "UseFIPS"
      }, !0]
    },
    b7Q = {
      [VL]: CHA,
      [FL]: [{
        [J8A]: "UseDualStack"
      }, !0]
    },
    XL = {},
    j7Q = {
      [VL]: ow1,
      [FL]: [{
        [J8A]: rw1
      }, "supportsFIPS"]
    },
    f7Q = {
      [J8A]: rw1
    },
    S7Q = {
      [VL]: CHA,
      [FL]: [!0, {
        [VL]: ow1,
        [FL]: [f7Q, "supportsDualStack"]
      }]
    },
    _7Q = [v7Q],
    k7Q = [b7Q],
    y7Q = [{
      [J8A]: "Region"
    }],
    iy4 = {
      version: "1.0",
      parameters: {
        Region: R7Q,
        UseDualStack: T7Q,
        UseFIPS: T7Q,
        Endpoint: R7Q
      },
      rules: [{
        conditions: [{
          [VL]: O7Q,
          [FL]: [P7Q]
        }],
        rules: [{
          conditions: _7Q,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: I8A
        }, {
          conditions: k7Q,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: I8A
        }, {
          endpoint: {
            url: P7Q,
            properties: XL,
            headers: XL
          },
          type: Y8A
        }],
        type: Tv
      }, {
        conditions: [{
          [VL]: O7Q,
          [FL]: y7Q
        }],
        rules: [{
          conditions: [{
            [VL]: "aws.partition",
            [FL]: y7Q,
            assign: rw1
          }],
          rules: [{
            conditions: [v7Q, b7Q],
            rules: [{
              conditions: [{
                [VL]: CHA,
                [FL]: [M7Q, j7Q]
              }, S7Q],
              rules: [{
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: XL,
                  headers: XL
                },
                type: Y8A
              }],
              type: Tv
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: I8A
            }],
            type: Tv
          }, {
            conditions: _7Q,
            rules: [{
              conditions: [{
                [VL]: CHA,
                [FL]: [j7Q, M7Q]
              }],
              rules: [{
                conditions: [{
                  [VL]: "stringEquals",
                  [FL]: [{
                    [VL]: ow1,
                    [FL]: [f7Q, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://oidc.{Region}.amazonaws.com",
                  properties: XL,
                  headers: XL
                },
                type: Y8A
              }, {
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: XL,
                  headers: XL
                },
                type: Y8A
              }],
              type: Tv
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: I8A
            }],
            type: Tv
          }, {
            conditions: k7Q,
            rules: [{
              conditions: [S7Q],
              rules: [{
                endpoint: {
                  url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: XL,
                  headers: XL
                },
                type: Y8A
              }],
              type: Tv
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: I8A
            }],
            type: Tv
          }, {
            endpoint: {
              url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
              properties: XL,
              headers: XL
            },
            type: Y8A
          }],
          type: Tv
        }],
        type: Tv
      }, {
        error: "Invalid Configuration: Missing Region",
        type: I8A
      }]
    };
  h7Q.ruleSet = iy4
})
// @from(Start 2775908, End 2776472)
c7Q = z((m7Q) => {
  Object.defineProperty(m7Q, "__esModule", {
    value: !0
  });
  m7Q.defaultEndpointResolver = void 0;
  var ny4 = p4A(),
    tw1 = FI(),
    ay4 = u7Q(),
    sy4 = new tw1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    ry4 = (A, Q = {}) => {
      return sy4.get(A, () => (0, tw1.resolveEndpoint)(ay4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  m7Q.defaultEndpointResolver = ry4;
  tw1.customEndpointFunctions.aws = ny4.awsEndpointFunctions
})
// @from(Start 2776478, End 2777896)
a7Q = z((i7Q) => {
  Object.defineProperty(i7Q, "__esModule", {
    value: !0
  });
  i7Q.getRuntimeConfig = void 0;
  var oy4 = MF(),
    ty4 = iB(),
    ey4 = K6(),
    Ax4 = NJ(),
    p7Q = Fd(),
    l7Q = O2(),
    Qx4 = aw1(),
    Bx4 = c7Q(),
    Gx4 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? p7Q.fromBase64,
        base64Encoder: A?.base64Encoder ?? p7Q.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Bx4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Qx4.defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new oy4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new ty4.NoAuthSigner
        }],
        logger: A?.logger ?? new ey4.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO OIDC",
        urlParser: A?.urlParser ?? Ax4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? l7Q.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? l7Q.toUtf8
      }
    };
  i7Q.getRuntimeConfig = Gx4
})
// @from(Start 2777902, End 2780201)
QGQ = z((e7Q) => {
  Object.defineProperty(e7Q, "__esModule", {
    value: !0
  });
  e7Q.getRuntimeConfig = void 0;
  var Zx4 = yr(),
    Ix4 = Zx4.__importDefault(sw1()),
    s7Q = MF(),
    r7Q = XHA(),
    KgA = f8(),
    Yx4 = RX(),
    o7Q = D6(),
    cr = uI(),
    t7Q = IZ(),
    Jx4 = TX(),
    Wx4 = KW(),
    Xx4 = a7Q(),
    Vx4 = K6(),
    Fx4 = PX(),
    Kx4 = K6(),
    Dx4 = (A) => {
      (0, Kx4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, Fx4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Vx4.loadConfigsForDefaultMode),
        G = (0, Xx4.getRuntimeConfig)(A);
      (0, s7Q.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, cr.loadConfig)(s7Q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? Jx4.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, r7Q.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Ix4.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, cr.loadConfig)(o7Q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, cr.loadConfig)(KgA.NODE_REGION_CONFIG_OPTIONS, {
          ...KgA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: t7Q.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, cr.loadConfig)({
          ...o7Q.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || Wx4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Yx4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? t7Q.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, cr.loadConfig)(KgA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, cr.loadConfig)(KgA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, cr.loadConfig)(r7Q.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  e7Q.getRuntimeConfig = Dx4
})
// @from(Start 2780207, End 2800034)
Qq1 = z(($U7, PGQ) => {
  var {
    defineProperty: DgA,
    getOwnPropertyDescriptor: Hx4,
    getOwnPropertyNames: Cx4
  } = Object, Ex4 = Object.prototype.hasOwnProperty, O6 = (A, Q) => DgA(A, "name", {
    value: Q,
    configurable: !0
  }), zx4 = (A, Q) => {
    for (var B in Q) DgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Ux4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Cx4(Q))
        if (!Ex4.call(A, Z) && Z !== B) DgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Hx4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $x4 = (A) => Ux4(DgA({}, "__esModule", {
    value: !0
  }), A), XGQ = {};
  zx4(XGQ, {
    $Command: () => KGQ.Command,
    AccessDeniedException: () => DGQ,
    AuthorizationPendingException: () => HGQ,
    CreateTokenCommand: () => RGQ,
    CreateTokenRequestFilterSensitiveLog: () => CGQ,
    CreateTokenResponseFilterSensitiveLog: () => EGQ,
    ExpiredTokenException: () => zGQ,
    InternalServerException: () => UGQ,
    InvalidClientException: () => $GQ,
    InvalidGrantException: () => wGQ,
    InvalidRequestException: () => qGQ,
    InvalidScopeException: () => NGQ,
    SSOOIDC: () => TGQ,
    SSOOIDCClient: () => FGQ,
    SSOOIDCServiceException: () => Hw,
    SlowDownException: () => LGQ,
    UnauthorizedClientException: () => MGQ,
    UnsupportedGrantTypeException: () => OGQ,
    __Client: () => VGQ.Client
  });
  PGQ.exports = $x4(XGQ);
  var BGQ = yDA(),
    wx4 = xDA(),
    qx4 = vDA(),
    GGQ = r4A(),
    Nx4 = f8(),
    ew1 = iB(),
    Lx4 = LX(),
    Mx4 = q5(),
    ZGQ = D6(),
    VGQ = K6(),
    IGQ = aw1(),
    Ox4 = O6((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "sso-oauth"
      })
    }, "resolveClientEndpointParameters"),
    Rx4 = {
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
    Tx4 = QGQ(),
    YGQ = KHA(),
    JGQ = nC(),
    WGQ = K6(),
    Px4 = O6((A) => {
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
    jx4 = O6((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    Sx4 = O6((A, Q) => {
      let B = Object.assign((0, YGQ.getAwsRegionExtensionConfiguration)(A), (0, WGQ.getDefaultExtensionConfiguration)(A), (0, JGQ.getHttpHandlerExtensionConfiguration)(A), Px4(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, YGQ.resolveAwsRegionExtensionConfiguration)(B), (0, WGQ.resolveDefaultRuntimeConfig)(B), (0, JGQ.resolveHttpHandlerRuntimeConfig)(B), jx4(B))
    }, "resolveRuntimeExtensions"),
    FGQ = class extends VGQ.Client {
      static {
        O6(this, "SSOOIDCClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, Tx4.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = Ox4(Q),
          G = (0, GGQ.resolveUserAgentConfig)(B),
          Z = (0, ZGQ.resolveRetryConfig)(G),
          I = (0, Nx4.resolveRegionConfig)(Z),
          Y = (0, BGQ.resolveHostHeaderConfig)(I),
          J = (0, Mx4.resolveEndpointConfig)(Y),
          W = (0, IGQ.resolveHttpAuthSchemeConfig)(J),
          X = Sx4(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, GGQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, ZGQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Lx4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, BGQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, wx4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, qx4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, ew1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: IGQ.defaultSSOOIDCHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: O6(async (V) => new ew1.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, ew1.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    _x4 = K6(),
    kx4 = q5(),
    yx4 = GZ(),
    KGQ = K6(),
    W8A = K6(),
    xx4 = K6(),
    Hw = class A extends xx4.ServiceException {
      static {
        O6(this, "SSOOIDCServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    DGQ = class A extends Hw {
      static {
        O6(this, "AccessDeniedException")
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
    HGQ = class A extends Hw {
      static {
        O6(this, "AuthorizationPendingException")
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
    CGQ = O6((A) => ({
      ...A,
      ...A.clientSecret && {
        clientSecret: W8A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: W8A.SENSITIVE_STRING
      },
      ...A.codeVerifier && {
        codeVerifier: W8A.SENSITIVE_STRING
      }
    }), "CreateTokenRequestFilterSensitiveLog"),
    EGQ = O6((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: W8A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: W8A.SENSITIVE_STRING
      },
      ...A.idToken && {
        idToken: W8A.SENSITIVE_STRING
      }
    }), "CreateTokenResponseFilterSensitiveLog"),
    zGQ = class A extends Hw {
      static {
        O6(this, "ExpiredTokenException")
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
    UGQ = class A extends Hw {
      static {
        O6(this, "InternalServerException")
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
    $GQ = class A extends Hw {
      static {
        O6(this, "InvalidClientException")
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
    wGQ = class A extends Hw {
      static {
        O6(this, "InvalidGrantException")
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
    qGQ = class A extends Hw {
      static {
        O6(this, "InvalidRequestException")
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
    NGQ = class A extends Hw {
      static {
        O6(this, "InvalidScopeException")
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
    LGQ = class A extends Hw {
      static {
        O6(this, "SlowDownException")
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
    MGQ = class A extends Hw {
      static {
        O6(this, "UnauthorizedClientException")
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
    OGQ = class A extends Hw {
      static {
        O6(this, "UnsupportedGrantTypeException")
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
    Aq1 = MF(),
    vx4 = iB(),
    B2 = K6(),
    bx4 = O6(async (A, Q) => {
      let B = (0, vx4.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/token");
      let Z;
      return Z = JSON.stringify((0, B2.take)(A, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: O6((I) => (0, B2._json)(I), "scope")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateTokenCommand"),
    fx4 = O6(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return hx4(A, Q);
      let B = (0, B2.map)({
          $metadata: KL(A)
        }),
        G = (0, B2.expectNonNull)((0, B2.expectObject)(await (0, Aq1.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, B2.take)(G, {
          accessToken: B2.expectString,
          expiresIn: B2.expectInt32,
          idToken: B2.expectString,
          refreshToken: B2.expectString,
          tokenType: B2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateTokenCommand"),
    hx4 = O6(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, Aq1.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, Aq1.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
          throw await ux4(B, Q);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
          throw await mx4(B, Q);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
          throw await dx4(B, Q);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
          throw await cx4(B, Q);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
          throw await px4(B, Q);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
          throw await lx4(B, Q);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
          throw await ix4(B, Q);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
          throw await nx4(B, Q);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
          throw await ax4(B, Q);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
          throw await sx4(B, Q);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
          throw await rx4(B, Q);
        default:
          let Z = B.body;
          return gx4({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    gx4 = (0, B2.withBaseException)(Hw),
    ux4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new DGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    mx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new HGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_AuthorizationPendingExceptionRes"),
    dx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new zGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_ExpiredTokenExceptionRes"),
    cx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new UGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    px4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new $GQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_InvalidClientExceptionRes"),
    lx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new wGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_InvalidGrantExceptionRes"),
    ix4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new qGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    nx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new NGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_InvalidScopeExceptionRes"),
    ax4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new LGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_SlowDownExceptionRes"),
    sx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new MGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedClientExceptionRes"),
    rx4 = O6(async (A, Q) => {
      let B = (0, B2.map)({}),
        G = A.body,
        Z = (0, B2.take)(G, {
          error: B2.expectString,
          error_description: B2.expectString
        });
      Object.assign(B, Z);
      let I = new OGQ({
        $metadata: KL(A),
        ...B
      });
      return (0, B2.decorateServiceException)(I, A.body)
    }, "de_UnsupportedGrantTypeExceptionRes"),
    KL = O6((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    RGQ = class extends KGQ.Command.classBuilder().ep(Rx4).m(function(A, Q, B, G) {
      return [(0, yx4.getSerdePlugin)(B, this.serialize, this.deserialize), (0, kx4.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").f(CGQ, EGQ).ser(bx4).de(fx4).build() {
      static {
        O6(this, "CreateTokenCommand")
      }
    },
    ox4 = {
      CreateTokenCommand: RGQ
    },
    TGQ = class extends FGQ {
      static {
        O6(this, "SSOOIDC")
      }
    };
  (0, _x4.createAggregatedClient)(ox4, TGQ)
})
// @from(Start 2800040, End 2806209)
bGQ = z((LU7, vGQ) => {
  var {
    create: tx4,
    defineProperty: zHA,
    getOwnPropertyDescriptor: ex4,
    getOwnPropertyNames: Av4,
    getPrototypeOf: Qv4
  } = Object, Bv4 = Object.prototype.hasOwnProperty, Pv = (A, Q) => zHA(A, "name", {
    value: Q,
    configurable: !0
  }), Gv4 = (A, Q) => {
    for (var B in Q) zHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, _GQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Av4(Q))
        if (!Bv4.call(A, Z) && Z !== B) zHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = ex4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, kGQ = (A, Q, B) => (B = A != null ? tx4(Qv4(A)) : {}, _GQ(Q || !A || !A.__esModule ? zHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Zv4 = (A) => _GQ(zHA({}, "__esModule", {
    value: !0
  }), A), yGQ = {};
  Gv4(yGQ, {
    fromEnvSigningName: () => Jv4,
    fromSso: () => xGQ,
    fromStatic: () => Hv4,
    nodeProvider: () => Cv4
  });
  vGQ.exports = Zv4(yGQ);
  var Iv4 = QL(),
    Yv4 = $$1(),
    Cw = j2(),
    Jv4 = Pv(({
      logger: A,
      signingName: Q
    } = {}) => async () => {
      if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !Q) throw new Cw.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
        logger: A
      });
      let B = (0, Yv4.getBearerTokenEnvKey)(Q);
      if (!(B in process.env)) throw new Cw.TokenProviderError(`Token not present in '${B}' environment variable`, {
        logger: A
      });
      let G = {
        token: process.env[B]
      };
      return (0, Iv4.setTokenFeature)(G, "BEARER_SERVICE_ENV_VARS", "3"), G
    }, "fromEnvSigningName"),
    Wv4 = 300000,
    Bq1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.",
    Xv4 = Pv(async (A, Q = {}) => {
      let {
        SSOOIDCClient: B
      } = await Promise.resolve().then(() => kGQ(Qq1()));
      return new B(Object.assign({}, Q.clientConfig ?? {}, {
        region: A ?? Q.clientConfig?.region,
        logger: Q.clientConfig?.logger ?? Q.parentClientConfig?.logger
      }))
    }, "getSsoOidcClient"),
    Vv4 = Pv(async (A, Q, B = {}) => {
      let {
        CreateTokenCommand: G
      } = await Promise.resolve().then(() => kGQ(Qq1()));
      return (await Xv4(Q, B)).send(new G({
        clientId: A.clientId,
        clientSecret: A.clientSecret,
        refreshToken: A.refreshToken,
        grantType: "refresh_token"
      }))
    }, "getNewSsoOidcToken"),
    jGQ = Pv((A) => {
      if (A.expiration && A.expiration.getTime() < Date.now()) throw new Cw.TokenProviderError(`Token is expired. ${Bq1}`, !1)
    }, "validateTokenExpiry"),
    pr = Pv((A, Q, B = !1) => {
      if (typeof Q > "u") throw new Cw.TokenProviderError(`Value not present for '${A}' in SSO Token${B?". Cannot refresh":""}. ${Bq1}`, !1)
    }, "validateTokenKey"),
    EHA = SG(),
    Fv4 = UA("fs"),
    {
      writeFile: Kv4
    } = Fv4.promises,
    Dv4 = Pv((A, Q) => {
      let B = (0, EHA.getSSOTokenFilepath)(A),
        G = JSON.stringify(Q, null, 2);
      return Kv4(B, G)
    }, "writeSSOTokenToFile"),
    SGQ = new Date(0),
    xGQ = Pv((A = {}) => async ({
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
      let G = await (0, EHA.parseKnownFiles)(B),
        Z = (0, EHA.getProfileName)({
          profile: B.profile ?? Q?.profile
        }),
        I = G[Z];
      if (!I) throw new Cw.TokenProviderError(`Profile '${Z}' could not be found in shared credentials file.`, !1);
      else if (!I.sso_session) throw new Cw.TokenProviderError(`Profile '${Z}' is missing required property 'sso_session'.`);
      let Y = I.sso_session,
        W = (await (0, EHA.loadSsoSessionData)(B))[Y];
      if (!W) throw new Cw.TokenProviderError(`Sso session '${Y}' could not be found in shared credentials file.`, !1);
      for (let C of ["sso_start_url", "sso_region"])
        if (!W[C]) throw new Cw.TokenProviderError(`Sso session '${Y}' is missing required property '${C}'.`, !1);
      let {
        sso_start_url: X,
        sso_region: V
      } = W, F;
      try {
        F = await (0, EHA.getSSOTokenFromFile)(Y)
      } catch (C) {
        throw new Cw.TokenProviderError(`The SSO session token associated with profile=${Z} was not found or is invalid. ${Bq1}`, !1)
      }
      pr("accessToken", F.accessToken), pr("expiresAt", F.expiresAt);
      let {
        accessToken: K,
        expiresAt: D
      } = F, H = {
        token: K,
        expiration: new Date(D)
      };
      if (H.expiration.getTime() - Date.now() > Wv4) return H;
      if (Date.now() - SGQ.getTime() < 30000) return jGQ(H), H;
      pr("clientId", F.clientId, !0), pr("clientSecret", F.clientSecret, !0), pr("refreshToken", F.refreshToken, !0);
      try {
        SGQ.setTime(Date.now());
        let C = await Vv4(F, V, B);
        pr("accessToken", C.accessToken), pr("expiresIn", C.expiresIn);
        let E = new Date(Date.now() + C.expiresIn * 1000);
        try {
          await Dv4(Y, {
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
        return jGQ(H), H
      }
    }, "fromSso"),
    Hv4 = Pv(({
      token: A,
      logger: Q
    }) => async () => {
      if (Q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new Cw.TokenProviderError("Please pass a valid token to fromStatic", !1);
      return A
    }, "fromStatic"),
    Cv4 = Pv((A = {}) => (0, Cw.memoize)((0, Cw.chain)(xGQ(A), async () => {
      throw new Cw.TokenProviderError("Could not load token from any providers", !1)
    }), (Q) => Q.expiration !== void 0 && Q.expiration.getTime() - Date.now() < 300000, (Q) => Q.expiration !== void 0), "nodeProvider")
})
// @from(Start 2806215, End 2813457)
Zq1 = z((MU7, lGQ) => {
  var {
    defineProperty: CgA,
    getOwnPropertyDescriptor: Ev4,
    getOwnPropertyNames: gGQ
  } = Object, zv4 = Object.prototype.hasOwnProperty, EgA = (A, Q) => CgA(A, "name", {
    value: Q,
    configurable: !0
  }), Uv4 = (A, Q) => function() {
    return A && (Q = (0, A[gGQ(A)[0]])(A = 0)), Q
  }, uGQ = (A, Q) => {
    for (var B in Q) CgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, $v4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gGQ(Q))
        if (!zv4.call(A, Z) && Z !== B) CgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Ev4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, wv4 = (A) => $v4(CgA({}, "__esModule", {
    value: !0
  }), A), mGQ = {};
  uGQ(mGQ, {
    GetRoleCredentialsCommand: () => Gq1.GetRoleCredentialsCommand,
    SSOClient: () => Gq1.SSOClient
  });
  var Gq1, qv4 = Uv4({
      "src/loadSso.ts"() {
        Gq1 = q7Q()
      }
    }),
    dGQ = {};
  uGQ(dGQ, {
    fromSSO: () => Lv4,
    isSsoProfile: () => cGQ,
    validateSsoProfile: () => pGQ
  });
  lGQ.exports = wv4(dGQ);
  var cGQ = EgA((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    fGQ = QL(),
    Nv4 = bGQ(),
    pR = j2(),
    HgA = SG(),
    UHA = !1,
    hGQ = EgA(async ({
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
        let v = await (0, Nv4.fromSso)({
          profile: W
        })();
        V = {
          accessToken: v.token,
          expiresAt: new Date(v.expiration).toISOString()
        }
      } catch (v) {
        throw new pR.CredentialsProviderError(v.message, {
          tryNextLink: UHA,
          logger: X
        })
      } else try {
        V = await (0, HgA.getSSOTokenFromFile)(A)
      } catch (v) {
        throw new pR.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
          tryNextLink: UHA,
          logger: X
        })
      }
      if (new Date(V.expiresAt).getTime() - Date.now() <= 0) throw new pR.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: UHA,
        logger: X
      });
      let {
        accessToken: K
      } = V, {
        SSOClient: D,
        GetRoleCredentialsCommand: H
      } = await Promise.resolve().then(() => (qv4(), mGQ)), C = I || new D(Object.assign({}, Y ?? {}, {
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
        throw new pR.CredentialsProviderError(v, {
          tryNextLink: UHA,
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
      if (!U || !q || !w || !N) throw new pR.CredentialsProviderError("SSO returns an invalid temporary credential.", {
        tryNextLink: UHA,
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
      if (Q)(0, fGQ.setCredentialFeature)(y, "CREDENTIALS_SSO", "s");
      else(0, fGQ.setCredentialFeature)(y, "CREDENTIALS_SSO_LEGACY", "u");
      return y
    }, "resolveSSOCredentials"),
    pGQ = EgA((A, Q) => {
      let {
        sso_start_url: B,
        sso_account_id: G,
        sso_region: Z,
        sso_role_name: I
      } = A;
      if (!B || !G || !Z || !I) throw new pR.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
        tryNextLink: !1,
        logger: Q
      });
      return A
    }, "validateSsoProfile"),
    Lv4 = EgA((A = {}) => async ({
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
      } = A, W = (0, HgA.getProfileName)({
        profile: A.profile ?? Q?.profile
      });
      if (!B && !G && !Z && !I && !Y) {
        let V = (await (0, HgA.parseKnownFiles)(A))[W];
        if (!V) throw new pR.CredentialsProviderError(`Profile ${W} was not found.`, {
          logger: A.logger
        });
        if (!cGQ(V)) throw new pR.CredentialsProviderError(`Profile ${W} is not configured with SSO credentials.`, {
          logger: A.logger
        });
        if (V?.sso_session) {
          let U = (await (0, HgA.loadSsoSessionData)(A))[V.sso_session],
            q = ` configurations in profile ${W} and sso-session ${V.sso_session}`;
          if (Z && Z !== U.sso_region) throw new pR.CredentialsProviderError("Conflicting SSO region" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          if (B && B !== U.sso_start_url) throw new pR.CredentialsProviderError("Conflicting SSO start_url" + q, {
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
        } = pGQ(V, A.logger);
        return hGQ({
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
      } else if (!B || !G || !Z || !I) throw new pR.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
        tryNextLink: !1,
        logger: A.logger
      });
      else return hGQ({
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
// @from(Start 2813463, End 2815120)
Yq1 = z((iGQ) => {
  Object.defineProperty(iGQ, "__esModule", {
    value: !0
  });
  iGQ.resolveHttpAuthSchemeConfig = iGQ.resolveStsAuthConfig = iGQ.defaultSTSHttpAuthSchemeProvider = iGQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var Mv4 = MF(),
    Iq1 = w7(),
    Ov4 = $HA(),
    Rv4 = async (A, Q, B) => {
      return {
        operation: (0, Iq1.getSmithyContext)(Q).operation,
        region: await (0, Iq1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  iGQ.defaultSTSHttpAuthSchemeParametersProvider = Rv4;

  function Tv4(A) {
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

  function Pv4(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var jv4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithWebIdentity": {
        Q.push(Pv4(A));
        break
      }
      default:
        Q.push(Tv4(A))
    }
    return Q
  };
  iGQ.defaultSTSHttpAuthSchemeProvider = jv4;
  var Sv4 = (A) => Object.assign(A, {
    stsClientCtor: Ov4.STSClient
  });
  iGQ.resolveStsAuthConfig = Sv4;
  var _v4 = (A) => {
    let Q = iGQ.resolveStsAuthConfig(A),
      B = (0, Mv4.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, Iq1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  iGQ.resolveHttpAuthSchemeConfig = _v4
})
// @from(Start 2815126, End 2816014)
wHA = z((sGQ) => {
  Object.defineProperty(sGQ, "__esModule", {
    value: !0
  });
  sGQ.commonParams = sGQ.resolveClientEndpointParameters = void 0;
  var xv4 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  sGQ.resolveClientEndpointParameters = xv4;
  sGQ.commonParams = {
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
// @from(Start 2816020, End 2824197)
wZQ = z((UZQ) => {
  Object.defineProperty(UZQ, "__esModule", {
    value: !0
  });
  UZQ.ruleSet = void 0;
  var WZQ = "required",
    h8 = "type",
    s3 = "fn",
    r3 = "argv",
    qd = "ref",
    oGQ = !1,
    Jq1 = !0,
    wd = "booleanEquals",
    eK = "stringEquals",
    XZQ = "sigv4",
    VZQ = "sts",
    FZQ = "us-east-1",
    mI = "endpoint",
    tGQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    OS = "tree",
    X8A = "error",
    Xq1 = "getAttr",
    eGQ = {
      [WZQ]: !1,
      [h8]: "String"
    },
    Wq1 = {
      [WZQ]: !0,
      default: !1,
      [h8]: "Boolean"
    },
    KZQ = {
      [qd]: "Endpoint"
    },
    AZQ = {
      [s3]: "isSet",
      [r3]: [{
        [qd]: "Region"
      }]
    },
    AD = {
      [qd]: "Region"
    },
    QZQ = {
      [s3]: "aws.partition",
      [r3]: [AD],
      assign: "PartitionResult"
    },
    DZQ = {
      [qd]: "UseFIPS"
    },
    HZQ = {
      [qd]: "UseDualStack"
    },
    $H = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: XZQ,
          signingName: VZQ,
          signingRegion: FZQ
        }]
      },
      headers: {}
    },
    Ew = {},
    BZQ = {
      conditions: [{
        [s3]: eK,
        [r3]: [AD, "aws-global"]
      }],
      [mI]: $H,
      [h8]: mI
    },
    CZQ = {
      [s3]: wd,
      [r3]: [DZQ, !0]
    },
    EZQ = {
      [s3]: wd,
      [r3]: [HZQ, !0]
    },
    GZQ = {
      [s3]: Xq1,
      [r3]: [{
        [qd]: "PartitionResult"
      }, "supportsFIPS"]
    },
    zZQ = {
      [qd]: "PartitionResult"
    },
    ZZQ = {
      [s3]: wd,
      [r3]: [!0, {
        [s3]: Xq1,
        [r3]: [zZQ, "supportsDualStack"]
      }]
    },
    IZQ = [{
      [s3]: "isSet",
      [r3]: [KZQ]
    }],
    YZQ = [CZQ],
    JZQ = [EZQ],
    bv4 = {
      version: "1.0",
      parameters: {
        Region: eGQ,
        UseDualStack: Wq1,
        UseFIPS: Wq1,
        Endpoint: eGQ,
        UseGlobalEndpoint: Wq1
      },
      rules: [{
        conditions: [{
          [s3]: wd,
          [r3]: [{
            [qd]: "UseGlobalEndpoint"
          }, Jq1]
        }, {
          [s3]: "not",
          [r3]: IZQ
        }, AZQ, QZQ, {
          [s3]: wd,
          [r3]: [DZQ, oGQ]
        }, {
          [s3]: wd,
          [r3]: [HZQ, oGQ]
        }],
        rules: [{
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "ap-northeast-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "ap-south-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "ap-southeast-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "ap-southeast-2"]
          }],
          endpoint: $H,
          [h8]: mI
        }, BZQ, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "ca-central-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "eu-central-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "eu-north-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "eu-west-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "eu-west-2"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "eu-west-3"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "sa-east-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, FZQ]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "us-east-2"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "us-west-1"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          conditions: [{
            [s3]: eK,
            [r3]: [AD, "us-west-2"]
          }],
          endpoint: $H,
          [h8]: mI
        }, {
          endpoint: {
            url: tGQ,
            properties: {
              authSchemes: [{
                name: XZQ,
                signingName: VZQ,
                signingRegion: "{Region}"
              }]
            },
            headers: Ew
          },
          [h8]: mI
        }],
        [h8]: OS
      }, {
        conditions: IZQ,
        rules: [{
          conditions: YZQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [h8]: X8A
        }, {
          conditions: JZQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [h8]: X8A
        }, {
          endpoint: {
            url: KZQ,
            properties: Ew,
            headers: Ew
          },
          [h8]: mI
        }],
        [h8]: OS
      }, {
        conditions: [AZQ],
        rules: [{
          conditions: [QZQ],
          rules: [{
            conditions: [CZQ, EZQ],
            rules: [{
              conditions: [{
                [s3]: wd,
                [r3]: [Jq1, GZQ]
              }, ZZQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: Ew,
                  headers: Ew
                },
                [h8]: mI
              }],
              [h8]: OS
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [h8]: X8A
            }],
            [h8]: OS
          }, {
            conditions: YZQ,
            rules: [{
              conditions: [{
                [s3]: wd,
                [r3]: [GZQ, Jq1]
              }],
              rules: [{
                conditions: [{
                  [s3]: eK,
                  [r3]: [{
                    [s3]: Xq1,
                    [r3]: [zZQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: Ew,
                  headers: Ew
                },
                [h8]: mI
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: Ew,
                  headers: Ew
                },
                [h8]: mI
              }],
              [h8]: OS
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [h8]: X8A
            }],
            [h8]: OS
          }, {
            conditions: JZQ,
            rules: [{
              conditions: [ZZQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: Ew,
                  headers: Ew
                },
                [h8]: mI
              }],
              [h8]: OS
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [h8]: X8A
            }],
            [h8]: OS
          }, BZQ, {
            endpoint: {
              url: tGQ,
              properties: Ew,
              headers: Ew
            },
            [h8]: mI
          }],
          [h8]: OS
        }],
        [h8]: OS
      }, {
        error: "Invalid Configuration: Missing Region",
        [h8]: X8A
      }]
    };
  UZQ.ruleSet = bv4
})
// @from(Start 2824203, End 2824788)
LZQ = z((qZQ) => {
  Object.defineProperty(qZQ, "__esModule", {
    value: !0
  });
  qZQ.defaultEndpointResolver = void 0;
  var fv4 = p4A(),
    Vq1 = FI(),
    hv4 = wZQ(),
    gv4 = new Vq1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    uv4 = (A, Q = {}) => {
      return gv4.get(A, () => (0, Vq1.resolveEndpoint)(hv4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  qZQ.defaultEndpointResolver = uv4;
  Vq1.customEndpointFunctions.aws = fv4.awsEndpointFunctions
})
// @from(Start 2824794, End 2826203)
PZQ = z((RZQ) => {
  Object.defineProperty(RZQ, "__esModule", {
    value: !0
  });
  RZQ.getRuntimeConfig = void 0;
  var mv4 = MF(),
    dv4 = iB(),
    cv4 = K6(),
    pv4 = NJ(),
    MZQ = Fd(),
    OZQ = O2(),
    lv4 = Yq1(),
    iv4 = LZQ(),
    nv4 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? MZQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? MZQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? iv4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? lv4.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new mv4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new dv4.NoAuthSigner
        }],
        logger: A?.logger ?? new cv4.NoOpLogger,
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? pv4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? OZQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? OZQ.toUtf8
      }
    };
  RZQ.getRuntimeConfig = nv4
})
// @from(Start 2826209, End 2829011)
xZQ = z((kZQ) => {
  Object.defineProperty(kZQ, "__esModule", {
    value: !0
  });
  kZQ.getRuntimeConfig = void 0;
  var av4 = yr(),
    sv4 = av4.__importDefault(sw1()),
    Fq1 = MF(),
    jZQ = XHA(),
    zgA = f8(),
    rv4 = iB(),
    ov4 = RX(),
    SZQ = D6(),
    lr = uI(),
    _ZQ = IZ(),
    tv4 = TX(),
    ev4 = KW(),
    Ab4 = PZQ(),
    Qb4 = K6(),
    Bb4 = PX(),
    Gb4 = K6(),
    Zb4 = (A) => {
      (0, Gb4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, Bb4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Qb4.loadConfigsForDefaultMode),
        G = (0, Ab4.getRuntimeConfig)(A);
      (0, Fq1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, lr.loadConfig)(Fq1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? tv4.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, jZQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: sv4.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4") || (async (Y) => await A.credentialDefaultProvider(Y?.__config || {})()),
          signer: new Fq1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new rv4.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, lr.loadConfig)(SZQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, lr.loadConfig)(zgA.NODE_REGION_CONFIG_OPTIONS, {
          ...zgA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: _ZQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, lr.loadConfig)({
          ...SZQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || ev4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? ov4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? _ZQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, lr.loadConfig)(zgA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, lr.loadConfig)(zgA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, lr.loadConfig)(jZQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  kZQ.getRuntimeConfig = Zb4
})
// @from(Start 2829017, End 2830036)
fZQ = z((vZQ) => {
  Object.defineProperty(vZQ, "__esModule", {
    value: !0
  });
  vZQ.resolveHttpAuthRuntimeConfig = vZQ.getHttpAuthExtensionConfiguration = void 0;
  var Ib4 = (A) => {
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
  vZQ.getHttpAuthExtensionConfiguration = Ib4;
  var Yb4 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  vZQ.resolveHttpAuthRuntimeConfig = Yb4
})
// @from(Start 2830042, End 2830767)
pZQ = z((dZQ) => {
  Object.defineProperty(dZQ, "__esModule", {
    value: !0
  });
  dZQ.resolveRuntimeExtensions = void 0;
  var hZQ = KHA(),
    gZQ = nC(),
    uZQ = K6(),
    mZQ = fZQ(),
    Wb4 = (A, Q) => {
      let B = Object.assign((0, hZQ.getAwsRegionExtensionConfiguration)(A), (0, uZQ.getDefaultExtensionConfiguration)(A), (0, gZQ.getHttpHandlerExtensionConfiguration)(A), (0, mZQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, hZQ.resolveAwsRegionExtensionConfiguration)(B), (0, uZQ.resolveDefaultRuntimeConfig)(B), (0, gZQ.resolveHttpHandlerRuntimeConfig)(B), (0, mZQ.resolveHttpAuthRuntimeConfig)(B))
    };
  dZQ.resolveRuntimeExtensions = Wb4
})
// @from(Start 2830773, End 2832755)
$HA = z((Dq1) => {
  Object.defineProperty(Dq1, "__esModule", {
    value: !0
  });
  Dq1.STSClient = Dq1.__Client = void 0;
  var lZQ = yDA(),
    Xb4 = xDA(),
    Vb4 = vDA(),
    iZQ = r4A(),
    Fb4 = f8(),
    Kq1 = iB(),
    Kb4 = LX(),
    Db4 = q5(),
    nZQ = D6(),
    sZQ = K6();
  Object.defineProperty(Dq1, "__Client", {
    enumerable: !0,
    get: function() {
      return sZQ.Client
    }
  });
  var aZQ = Yq1(),
    Hb4 = wHA(),
    Cb4 = xZQ(),
    Eb4 = pZQ();
  class rZQ extends sZQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, Cb4.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, Hb4.resolveClientEndpointParameters)(Q),
        G = (0, iZQ.resolveUserAgentConfig)(B),
        Z = (0, nZQ.resolveRetryConfig)(G),
        I = (0, Fb4.resolveRegionConfig)(Z),
        Y = (0, lZQ.resolveHostHeaderConfig)(I),
        J = (0, Db4.resolveEndpointConfig)(Y),
        W = (0, aZQ.resolveHttpAuthSchemeConfig)(J),
        X = (0, Eb4.resolveRuntimeExtensions)(W, A?.extensions || []);
      this.config = X, this.middlewareStack.use((0, iZQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, nZQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Kb4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, lZQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, Xb4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, Vb4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Kq1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: aZQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (V) => new Kq1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": V.credentials
        })
      })), this.middlewareStack.use((0, Kq1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  Dq1.STSClient = rZQ
})