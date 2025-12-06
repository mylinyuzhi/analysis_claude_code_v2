
// @from(Start 3092116, End 3096061)
CFQ = z((Jw7, sp4) => {
  sp4.exports = {
    name: "@aws-sdk/client-cognito-identity",
    description: "AWS SDK for JavaScript Cognito Identity Client for Node.js, Browser and React Native",
    version: "3.840.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-cognito-identity",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo cognito-identity",
      "test:e2e": "yarn g:vitest run -c vitest.config.e2e.ts --mode development",
      "test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.ts"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/credential-provider-node": "3.840.0",
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
      "@aws-sdk/client-iam": "3.840.0",
      "@tsconfig/node18": "18.2.4",
      "@types/chai": "^4.2.11",
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
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-cognito-identity",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-cognito-identity"
    }
  }
})
// @from(Start 3096067, End 3098140)
xL1 = z((Ww7, LFQ) => {
  var {
    defineProperty: IuA,
    getOwnPropertyDescriptor: rp4,
    getOwnPropertyNames: op4
  } = Object, tp4 = Object.prototype.hasOwnProperty, ep4 = (A, Q) => IuA(A, "name", {
    value: Q,
    configurable: !0
  }), Al4 = (A, Q) => {
    for (var B in Q) IuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Ql4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of op4(Q))
        if (!tp4.call(A, Z) && Z !== B) IuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = rp4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Bl4 = (A) => Ql4(IuA({}, "__esModule", {
    value: !0
  }), A), EFQ = {};
  Al4(EFQ, {
    ENV_ACCOUNT_ID: () => NFQ,
    ENV_CREDENTIAL_SCOPE: () => qFQ,
    ENV_EXPIRATION: () => wFQ,
    ENV_KEY: () => zFQ,
    ENV_SECRET: () => UFQ,
    ENV_SESSION: () => $FQ,
    fromEnv: () => Il4
  });
  LFQ.exports = Bl4(EFQ);
  var Gl4 = lR(),
    Zl4 = j2(),
    zFQ = "AWS_ACCESS_KEY_ID",
    UFQ = "AWS_SECRET_ACCESS_KEY",
    $FQ = "AWS_SESSION_TOKEN",
    wFQ = "AWS_CREDENTIAL_EXPIRATION",
    qFQ = "AWS_CREDENTIAL_SCOPE",
    NFQ = "AWS_ACCOUNT_ID",
    Il4 = ep4((A) => async () => {
      A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
      let Q = process.env[zFQ],
        B = process.env[UFQ],
        G = process.env[$FQ],
        Z = process.env[wFQ],
        I = process.env[qFQ],
        Y = process.env[NFQ];
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
        return (0, Gl4.setCredentialFeature)(J, "CREDENTIALS_ENV_VARS", "g"), J
      }
      throw new Zl4.CredentialsProviderError("Unable to find environment variable credentials.", {
        logger: A?.logger
      })
    }, "fromEnv")
})
// @from(Start 3098146, End 3099269)
RFQ = z((MFQ) => {
  Object.defineProperty(MFQ, "__esModule", {
    value: !0
  });
  MFQ.checkUrl = void 0;
  var Yl4 = j2(),
    Jl4 = "169.254.170.2",
    Wl4 = "169.254.170.23",
    Xl4 = "[fd00:ec2::23]",
    Vl4 = (A, Q) => {
      if (A.protocol === "https:") return;
      if (A.hostname === Jl4 || A.hostname === Wl4 || A.hostname === Xl4) return;
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
      throw new Yl4.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
        logger: Q
      })
    };
  MFQ.checkUrl = Vl4
})
// @from(Start 3099275, End 3101016)
PFQ = z((TFQ) => {
  Object.defineProperty(TFQ, "__esModule", {
    value: !0
  });
  TFQ.createGetRequest = Hl4;
  TFQ.getCredentials = Cl4;
  var vL1 = j2(),
    Fl4 = iz(),
    Kl4 = r6(),
    Dl4 = Xd();

  function Hl4(A) {
    return new Fl4.HttpRequest({
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
  async function Cl4(A, Q) {
    let G = await (0, Dl4.sdkStreamMixin)(A.body).transformToString();
    if (A.statusCode === 200) {
      let Z = JSON.parse(G);
      if (typeof Z.AccessKeyId !== "string" || typeof Z.SecretAccessKey !== "string" || typeof Z.Token !== "string" || typeof Z.Expiration !== "string") throw new vL1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
        logger: Q
      });
      return {
        accessKeyId: Z.AccessKeyId,
        secretAccessKey: Z.SecretAccessKey,
        sessionToken: Z.Token,
        expiration: (0, Kl4.parseRfc3339DateTime)(Z.Expiration)
      }
    }
    if (A.statusCode >= 400 && A.statusCode < 500) {
      let Z = {};
      try {
        Z = JSON.parse(G)
      } catch (I) {}
      throw Object.assign(new vL1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
        logger: Q
      }), {
        Code: Z.Code,
        Message: Z.Message
      })
    }
    throw new vL1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
      logger: Q
    })
  }
})
// @from(Start 3101022, End 3101392)
_FQ = z((jFQ) => {
  Object.defineProperty(jFQ, "__esModule", {
    value: !0
  });
  jFQ.retryWrapper = void 0;
  var Ul4 = (A, Q, B) => {
    return async () => {
      for (let G = 0; G < Q; ++G) try {
        return await A()
      } catch (Z) {
        await new Promise((I) => setTimeout(I, B))
      }
      return await A()
    }
  };
  jFQ.retryWrapper = Ul4
})
// @from(Start 3101398, End 3103885)
bFQ = z((xFQ) => {
  Object.defineProperty(xFQ, "__esModule", {
    value: !0
  });
  xFQ.fromHttp = void 0;
  var $l4 = rr(),
    wl4 = lR(),
    ql4 = IZ(),
    kFQ = j2(),
    Nl4 = $l4.__importDefault(UA("fs/promises")),
    Ll4 = RFQ(),
    yFQ = PFQ(),
    Ml4 = _FQ(),
    Ol4 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    Rl4 = "http://169.254.170.2",
    Tl4 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    Pl4 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
    jl4 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    Sl4 = (A = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
      let Q, B = A.awsContainerCredentialsRelativeUri ?? process.env[Ol4],
        G = A.awsContainerCredentialsFullUri ?? process.env[Tl4],
        Z = A.awsContainerAuthorizationToken ?? process.env[jl4],
        I = A.awsContainerAuthorizationTokenFile ?? process.env[Pl4],
        Y = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console.warn : A.logger.warn;
      if (B && G) Y("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), Y("awsContainerCredentialsFullUri will take precedence.");
      if (Z && I) Y("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), Y("awsContainerAuthorizationToken will take precedence.");
      if (G) Q = G;
      else if (B) Q = `${Rl4}${B}`;
      else throw new kFQ.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
        logger: A.logger
      });
      let J = new URL(Q);
      (0, Ll4.checkUrl)(J, A.logger);
      let W = new ql4.NodeHttpHandler({
        requestTimeout: A.timeout ?? 1000,
        connectionTimeout: A.timeout ?? 1000
      });
      return (0, Ml4.retryWrapper)(async () => {
        let X = (0, yFQ.createGetRequest)(J);
        if (Z) X.headers.Authorization = Z;
        else if (I) X.headers.Authorization = (await Nl4.default.readFile(I)).toString();
        try {
          let V = await W.handle(X);
          return (0, yFQ.getCredentials)(V.response).then((F) => (0, wl4.setCredentialFeature)(F, "CREDENTIALS_HTTP", "z"))
        } catch (V) {
          throw new kFQ.CredentialsProviderError(String(V), {
            logger: A.logger
          })
        }
      }, A.maxRetries ?? 3, A.timeout ?? 1000)
    };
  xFQ.fromHttp = Sl4
})
// @from(Start 3103891, End 3104143)
fL1 = z((bL1) => {
  Object.defineProperty(bL1, "__esModule", {
    value: !0
  });
  bL1.fromHttp = void 0;
  var _l4 = bFQ();
  Object.defineProperty(bL1, "fromHttp", {
    enumerable: !0,
    get: function() {
      return _l4.fromHttp
    }
  })
})
// @from(Start 3104149, End 3105837)
gL1 = z((fFQ) => {
  Object.defineProperty(fFQ, "__esModule", {
    value: !0
  });
  fFQ.resolveHttpAuthSchemeConfig = fFQ.defaultSSOHttpAuthSchemeProvider = fFQ.defaultSSOHttpAuthSchemeParametersProvider = void 0;
  var yl4 = TF(),
    hL1 = w7(),
    xl4 = async (A, Q, B) => {
      return {
        operation: (0, hL1.getSmithyContext)(Q).operation,
        region: await (0, hL1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  fFQ.defaultSSOHttpAuthSchemeParametersProvider = xl4;

  function vl4(A) {
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

  function YuA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var bl4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetRoleCredentials": {
        Q.push(YuA(A));
        break
      }
      case "ListAccountRoles": {
        Q.push(YuA(A));
        break
      }
      case "ListAccounts": {
        Q.push(YuA(A));
        break
      }
      case "Logout": {
        Q.push(YuA(A));
        break
      }
      default:
        Q.push(vl4(A))
    }
    return Q
  };
  fFQ.defaultSSOHttpAuthSchemeProvider = bl4;
  var fl4 = (A) => {
    let Q = (0, yl4.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, hL1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  fFQ.resolveHttpAuthSchemeConfig = fl4
})
// @from(Start 3105843, End 3109431)
gFQ = z((Cw7, ul4) => {
  ul4.exports = {
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
// @from(Start 3109437, End 3111613)
kHA = z((Ew7, iFQ) => {
  var {
    defineProperty: WuA,
    getOwnPropertyDescriptor: ml4,
    getOwnPropertyNames: dl4
  } = Object, cl4 = Object.prototype.hasOwnProperty, JuA = (A, Q) => WuA(A, "name", {
    value: Q,
    configurable: !0
  }), pl4 = (A, Q) => {
    for (var B in Q) WuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ll4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of dl4(Q))
        if (!cl4.call(A, Z) && Z !== B) WuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = ml4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, il4 = (A) => ll4(WuA({}, "__esModule", {
    value: !0
  }), A), mFQ = {};
  pl4(mFQ, {
    NODE_APP_ID_CONFIG_OPTIONS: () => ol4,
    UA_APP_ID_ENV_NAME: () => pFQ,
    UA_APP_ID_INI_NAME: () => lFQ,
    createDefaultUserAgentProvider: () => cFQ,
    crtAvailability: () => dFQ,
    defaultUserAgent: () => al4
  });
  iFQ.exports = il4(mFQ);
  var uFQ = UA("os"),
    uL1 = UA("process"),
    dFQ = {
      isCrtAvailable: !1
    },
    nl4 = JuA(() => {
      if (dFQ.isCrtAvailable) return ["md/crt-avail"];
      return null
    }, "isCrtAvailable"),
    cFQ = JuA(({
      serviceId: A,
      clientVersion: Q
    }) => {
      return async (B) => {
        let G = [
            ["aws-sdk-js", Q],
            ["ua", "2.1"],
            [`os/${(0,uFQ.platform)()}`, (0, uFQ.release)()],
            ["lang/js"],
            ["md/nodejs", `${uL1.versions.node}`]
          ],
          Z = nl4();
        if (Z) G.push(Z);
        if (A) G.push([`api/${A}`, Q]);
        if (uL1.env.AWS_EXECUTION_ENV) G.push([`exec-env/${uL1.env.AWS_EXECUTION_ENV}`]);
        let I = await B?.userAgentAppId?.();
        return I ? [...G, [`app/${I}`]] : [...G]
      }
    }, "createDefaultUserAgentProvider"),
    al4 = cFQ,
    sl4 = b8A(),
    pFQ = "AWS_SDK_UA_APP_ID",
    lFQ = "sdk_ua_app_id",
    rl4 = "sdk-ua-app-id",
    ol4 = {
      environmentVariableSelector: JuA((A) => A[pFQ], "environmentVariableSelector"),
      configFileSelector: JuA((A) => A[lFQ] ?? A[rl4], "configFileSelector"),
      default: sl4.DEFAULT_UA_APP_ID
    }
})
// @from(Start 3111619, End 3116316)
XKQ = z((JKQ) => {
  Object.defineProperty(JKQ, "__esModule", {
    value: !0
  });
  JKQ.ruleSet = void 0;
  var GKQ = "required",
    zL = "fn",
    UL = "argv",
    g8A = "ref",
    nFQ = !0,
    aFQ = "isSet",
    yHA = "booleanEquals",
    f8A = "error",
    h8A = "endpoint",
    lv = "tree",
    mL1 = "PartitionResult",
    dL1 = "getAttr",
    sFQ = {
      [GKQ]: !1,
      type: "String"
    },
    rFQ = {
      [GKQ]: !0,
      default: !1,
      type: "Boolean"
    },
    oFQ = {
      [g8A]: "Endpoint"
    },
    ZKQ = {
      [zL]: yHA,
      [UL]: [{
        [g8A]: "UseFIPS"
      }, !0]
    },
    IKQ = {
      [zL]: yHA,
      [UL]: [{
        [g8A]: "UseDualStack"
      }, !0]
    },
    EL = {},
    tFQ = {
      [zL]: dL1,
      [UL]: [{
        [g8A]: mL1
      }, "supportsFIPS"]
    },
    YKQ = {
      [g8A]: mL1
    },
    eFQ = {
      [zL]: yHA,
      [UL]: [!0, {
        [zL]: dL1,
        [UL]: [YKQ, "supportsDualStack"]
      }]
    },
    AKQ = [ZKQ],
    QKQ = [IKQ],
    BKQ = [{
      [g8A]: "Region"
    }],
    tl4 = {
      version: "1.0",
      parameters: {
        Region: sFQ,
        UseDualStack: rFQ,
        UseFIPS: rFQ,
        Endpoint: sFQ
      },
      rules: [{
        conditions: [{
          [zL]: aFQ,
          [UL]: [oFQ]
        }],
        rules: [{
          conditions: AKQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: f8A
        }, {
          conditions: QKQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: f8A
        }, {
          endpoint: {
            url: oFQ,
            properties: EL,
            headers: EL
          },
          type: h8A
        }],
        type: lv
      }, {
        conditions: [{
          [zL]: aFQ,
          [UL]: BKQ
        }],
        rules: [{
          conditions: [{
            [zL]: "aws.partition",
            [UL]: BKQ,
            assign: mL1
          }],
          rules: [{
            conditions: [ZKQ, IKQ],
            rules: [{
              conditions: [{
                [zL]: yHA,
                [UL]: [nFQ, tFQ]
              }, eFQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: EL,
                  headers: EL
                },
                type: h8A
              }],
              type: lv
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: f8A
            }],
            type: lv
          }, {
            conditions: AKQ,
            rules: [{
              conditions: [{
                [zL]: yHA,
                [UL]: [tFQ, nFQ]
              }],
              rules: [{
                conditions: [{
                  [zL]: "stringEquals",
                  [UL]: [{
                    [zL]: dL1,
                    [UL]: [YKQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://portal.sso.{Region}.amazonaws.com",
                  properties: EL,
                  headers: EL
                },
                type: h8A
              }, {
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: EL,
                  headers: EL
                },
                type: h8A
              }],
              type: lv
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: f8A
            }],
            type: lv
          }, {
            conditions: QKQ,
            rules: [{
              conditions: [eFQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: EL,
                  headers: EL
                },
                type: h8A
              }],
              type: lv
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: f8A
            }],
            type: lv
          }, {
            endpoint: {
              url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
              properties: EL,
              headers: EL
            },
            type: h8A
          }],
          type: lv
        }],
        type: lv
      }, {
        error: "Invalid Configuration: Missing Region",
        type: f8A
      }]
    };
  JKQ.ruleSet = tl4
})
// @from(Start 3116322, End 3116886)
KKQ = z((VKQ) => {
  Object.defineProperty(VKQ, "__esModule", {
    value: !0
  });
  VKQ.defaultEndpointResolver = void 0;
  var el4 = S8A(),
    cL1 = FI(),
    Ai4 = XKQ(),
    Qi4 = new cL1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    Bi4 = (A, Q = {}) => {
      return Qi4.get(A, () => (0, cL1.resolveEndpoint)(Ai4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  VKQ.defaultEndpointResolver = Bi4;
  cL1.customEndpointFunctions.aws = el4.awsEndpointFunctions
})
// @from(Start 3116892, End 3118301)
zKQ = z((CKQ) => {
  Object.defineProperty(CKQ, "__esModule", {
    value: !0
  });
  CKQ.getRuntimeConfig = void 0;
  var Gi4 = TF(),
    Zi4 = iB(),
    Ii4 = r6(),
    Yi4 = NJ(),
    DKQ = Pd(),
    HKQ = O2(),
    Ji4 = gL1(),
    Wi4 = KKQ(),
    Xi4 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? DKQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? DKQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Wi4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Ji4.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Gi4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Zi4.NoAuthSigner
        }],
        logger: A?.logger ?? new Ii4.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO",
        urlParser: A?.urlParser ?? Yi4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? HKQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? HKQ.toUtf8
      }
    };
  CKQ.getRuntimeConfig = Xi4
})
// @from(Start 3118307, End 3120606)
MKQ = z((NKQ) => {
  Object.defineProperty(NKQ, "__esModule", {
    value: !0
  });
  NKQ.getRuntimeConfig = void 0;
  var Vi4 = rr(),
    Fi4 = Vi4.__importDefault(gFQ()),
    UKQ = TF(),
    $KQ = kHA(),
    XuA = f8(),
    Ki4 = RX(),
    wKQ = D6(),
    Ao = uI(),
    qKQ = IZ(),
    Di4 = TX(),
    Hi4 = KW(),
    Ci4 = zKQ(),
    Ei4 = r6(),
    zi4 = PX(),
    Ui4 = r6(),
    $i4 = (A) => {
      (0, Ui4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, zi4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Ei4.loadConfigsForDefaultMode),
        G = (0, Ci4.getRuntimeConfig)(A);
      (0, UKQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Ao.loadConfig)(UKQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? Di4.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, $KQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Fi4.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, Ao.loadConfig)(wKQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Ao.loadConfig)(XuA.NODE_REGION_CONFIG_OPTIONS, {
          ...XuA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: qKQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Ao.loadConfig)({
          ...wKQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || Hi4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Ki4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? qKQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Ao.loadConfig)(XuA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Ao.loadConfig)(XuA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Ao.loadConfig)($KQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  NKQ.getRuntimeConfig = $i4
})
// @from(Start 3120612, End 3123215)
xHA = z((qw7, SKQ) => {
  var {
    defineProperty: VuA,
    getOwnPropertyDescriptor: wi4,
    getOwnPropertyNames: qi4
  } = Object, Ni4 = Object.prototype.hasOwnProperty, kS = (A, Q) => VuA(A, "name", {
    value: Q,
    configurable: !0
  }), Li4 = (A, Q) => {
    for (var B in Q) VuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Mi4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qi4(Q))
        if (!Ni4.call(A, Z) && Z !== B) VuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wi4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Oi4 = (A) => Mi4(VuA({}, "__esModule", {
    value: !0
  }), A), RKQ = {};
  Li4(RKQ, {
    NODE_REGION_CONFIG_FILE_OPTIONS: () => ji4,
    NODE_REGION_CONFIG_OPTIONS: () => Pi4,
    REGION_ENV_NAME: () => TKQ,
    REGION_INI_NAME: () => PKQ,
    getAwsRegionExtensionConfiguration: () => Ri4,
    resolveAwsRegionExtensionConfiguration: () => Ti4,
    resolveRegionConfig: () => Si4
  });
  SKQ.exports = Oi4(RKQ);
  var Ri4 = kS((A) => {
      return {
        setRegion(Q) {
          A.region = Q
        },
        region() {
          return A.region
        }
      }
    }, "getAwsRegionExtensionConfiguration"),
    Ti4 = kS((A) => {
      return {
        region: A.region()
      }
    }, "resolveAwsRegionExtensionConfiguration"),
    TKQ = "AWS_REGION",
    PKQ = "region",
    Pi4 = {
      environmentVariableSelector: kS((A) => A[TKQ], "environmentVariableSelector"),
      configFileSelector: kS((A) => A[PKQ], "configFileSelector"),
      default: kS(() => {
        throw Error("Region is missing")
      }, "default")
    },
    ji4 = {
      preferredFile: "credentials"
    },
    jKQ = kS((A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), "isFipsRegion"),
    OKQ = kS((A) => jKQ(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, "getRealRegion"),
    Si4 = kS((A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: kS(async () => {
          if (typeof Q === "string") return OKQ(Q);
          let G = await Q();
          return OKQ(G)
        }, "region"),
        useFipsEndpoint: kS(async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (jKQ(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }, "useFipsEndpoint")
      })
    }, "resolveRegionConfig")
})
// @from(Start 3123221, End 3139769)
ZDQ = z((Nw7, GDQ) => {
  var {
    defineProperty: FuA,
    getOwnPropertyDescriptor: _i4,
    getOwnPropertyNames: ki4
  } = Object, yi4 = Object.prototype.hasOwnProperty, L5 = (A, Q) => FuA(A, "name", {
    value: Q,
    configurable: !0
  }), xi4 = (A, Q) => {
    for (var B in Q) FuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vi4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ki4(Q))
        if (!yi4.call(A, Z) && Z !== B) FuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _i4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bi4 = (A) => vi4(FuA({}, "__esModule", {
    value: !0
  }), A), fKQ = {};
  xi4(fKQ, {
    GetRoleCredentialsCommand: () => ADQ,
    GetRoleCredentialsRequestFilterSensitiveLog: () => dKQ,
    GetRoleCredentialsResponseFilterSensitiveLog: () => pKQ,
    InvalidRequestException: () => hKQ,
    ListAccountRolesCommand: () => pL1,
    ListAccountRolesRequestFilterSensitiveLog: () => lKQ,
    ListAccountsCommand: () => lL1,
    ListAccountsRequestFilterSensitiveLog: () => iKQ,
    LogoutCommand: () => QDQ,
    LogoutRequestFilterSensitiveLog: () => nKQ,
    ResourceNotFoundException: () => gKQ,
    RoleCredentialsFilterSensitiveLog: () => cKQ,
    SSO: () => BDQ,
    SSOClient: () => DuA,
    SSOServiceException: () => u8A,
    TooManyRequestsException: () => uKQ,
    UnauthorizedException: () => mKQ,
    __Client: () => V2.Client,
    paginateListAccountRoles: () => Wn4,
    paginateListAccounts: () => Xn4
  });
  GDQ.exports = bi4(fKQ);
  var _KQ = MHA(),
    fi4 = OHA(),
    hi4 = RHA(),
    kKQ = b8A(),
    gi4 = f8(),
    iv = iB(),
    ui4 = LX(),
    bHA = q5(),
    yKQ = D6(),
    xKQ = gL1(),
    mi4 = L5((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "awsssoportal"
      })
    }, "resolveClientEndpointParameters"),
    KuA = {
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
    di4 = MKQ(),
    vKQ = xHA(),
    bKQ = iz(),
    V2 = r6(),
    ci4 = L5((A) => {
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
    pi4 = L5((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    li4 = L5((A, Q) => {
      let B = Object.assign((0, vKQ.getAwsRegionExtensionConfiguration)(A), (0, V2.getDefaultExtensionConfiguration)(A), (0, bKQ.getHttpHandlerExtensionConfiguration)(A), ci4(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, vKQ.resolveAwsRegionExtensionConfiguration)(B), (0, V2.resolveDefaultRuntimeConfig)(B), (0, bKQ.resolveHttpHandlerRuntimeConfig)(B), pi4(B))
    }, "resolveRuntimeExtensions"),
    DuA = class extends V2.Client {
      static {
        L5(this, "SSOClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, di4.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = mi4(Q),
          G = (0, kKQ.resolveUserAgentConfig)(B),
          Z = (0, yKQ.resolveRetryConfig)(G),
          I = (0, gi4.resolveRegionConfig)(Z),
          Y = (0, _KQ.resolveHostHeaderConfig)(I),
          J = (0, bHA.resolveEndpointConfig)(Y),
          W = (0, xKQ.resolveHttpAuthSchemeConfig)(J),
          X = li4(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, kKQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, yKQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, ui4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, _KQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, fi4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, hi4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, iv.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: xKQ.defaultSSOHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: L5(async (V) => new iv.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, iv.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    HuA = GZ(),
    u8A = class A extends V2.ServiceException {
      static {
        L5(this, "SSOServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    hKQ = class A extends u8A {
      static {
        L5(this, "InvalidRequestException")
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
    gKQ = class A extends u8A {
      static {
        L5(this, "ResourceNotFoundException")
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
    uKQ = class A extends u8A {
      static {
        L5(this, "TooManyRequestsException")
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
    mKQ = class A extends u8A {
      static {
        L5(this, "UnauthorizedException")
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
    dKQ = L5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: V2.SENSITIVE_STRING
      }
    }), "GetRoleCredentialsRequestFilterSensitiveLog"),
    cKQ = L5((A) => ({
      ...A,
      ...A.secretAccessKey && {
        secretAccessKey: V2.SENSITIVE_STRING
      },
      ...A.sessionToken && {
        sessionToken: V2.SENSITIVE_STRING
      }
    }), "RoleCredentialsFilterSensitiveLog"),
    pKQ = L5((A) => ({
      ...A,
      ...A.roleCredentials && {
        roleCredentials: cKQ(A.roleCredentials)
      }
    }), "GetRoleCredentialsResponseFilterSensitiveLog"),
    lKQ = L5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: V2.SENSITIVE_STRING
      }
    }), "ListAccountRolesRequestFilterSensitiveLog"),
    iKQ = L5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: V2.SENSITIVE_STRING
      }
    }), "ListAccountsRequestFilterSensitiveLog"),
    nKQ = L5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: V2.SENSITIVE_STRING
      }
    }), "LogoutRequestFilterSensitiveLog"),
    vHA = TF(),
    ii4 = L5(async (A, Q) => {
      let B = (0, iv.requestBuilder)(A, Q),
        G = (0, V2.map)({}, V2.isSerializableHeaderValue, {
          [zuA]: A[EuA]
        });
      B.bp("/federation/credentials");
      let Z = (0, V2.map)({
          [Yn4]: [, (0, V2.expectNonNull)(A[In4], "roleName")],
          [sKQ]: [, (0, V2.expectNonNull)(A[aKQ], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_GetRoleCredentialsCommand"),
    ni4 = L5(async (A, Q) => {
      let B = (0, iv.requestBuilder)(A, Q),
        G = (0, V2.map)({}, V2.isSerializableHeaderValue, {
          [zuA]: A[EuA]
        });
      B.bp("/assignment/roles");
      let Z = (0, V2.map)({
          [eKQ]: [, A[tKQ]],
          [oKQ]: [() => A.maxResults !== void 0, () => A[rKQ].toString()],
          [sKQ]: [, (0, V2.expectNonNull)(A[aKQ], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountRolesCommand"),
    ai4 = L5(async (A, Q) => {
      let B = (0, iv.requestBuilder)(A, Q),
        G = (0, V2.map)({}, V2.isSerializableHeaderValue, {
          [zuA]: A[EuA]
        });
      B.bp("/assignment/accounts");
      let Z = (0, V2.map)({
          [eKQ]: [, A[tKQ]],
          [oKQ]: [() => A.maxResults !== void 0, () => A[rKQ].toString()]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountsCommand"),
    si4 = L5(async (A, Q) => {
      let B = (0, iv.requestBuilder)(A, Q),
        G = (0, V2.map)({}, V2.isSerializableHeaderValue, {
          [zuA]: A[EuA]
        });
      B.bp("/logout");
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_LogoutCommand"),
    ri4 = L5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return CuA(A, Q);
      let B = (0, V2.map)({
          $metadata: Sd(A)
        }),
        G = (0, V2.expectNonNull)((0, V2.expectObject)(await (0, vHA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, V2.take)(G, {
          roleCredentials: V2._json
        });
      return Object.assign(B, Z), B
    }, "de_GetRoleCredentialsCommand"),
    oi4 = L5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return CuA(A, Q);
      let B = (0, V2.map)({
          $metadata: Sd(A)
        }),
        G = (0, V2.expectNonNull)((0, V2.expectObject)(await (0, vHA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, V2.take)(G, {
          nextToken: V2.expectString,
          roleList: V2._json
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountRolesCommand"),
    ti4 = L5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return CuA(A, Q);
      let B = (0, V2.map)({
          $metadata: Sd(A)
        }),
        G = (0, V2.expectNonNull)((0, V2.expectObject)(await (0, vHA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, V2.take)(G, {
          accountList: V2._json,
          nextToken: V2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountsCommand"),
    ei4 = L5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return CuA(A, Q);
      let B = (0, V2.map)({
        $metadata: Sd(A)
      });
      return await (0, V2.collectBody)(A.body, Q), B
    }, "de_LogoutCommand"),
    CuA = L5(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, vHA.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, vHA.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await Qn4(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await Bn4(B, Q);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await Gn4(B, Q);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await Zn4(B, Q);
        default:
          let Z = B.body;
          return An4({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    An4 = (0, V2.withBaseException)(u8A),
    Qn4 = L5(async (A, Q) => {
      let B = (0, V2.map)({}),
        G = A.body,
        Z = (0, V2.take)(G, {
          message: V2.expectString
        });
      Object.assign(B, Z);
      let I = new hKQ({
        $metadata: Sd(A),
        ...B
      });
      return (0, V2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    Bn4 = L5(async (A, Q) => {
      let B = (0, V2.map)({}),
        G = A.body,
        Z = (0, V2.take)(G, {
          message: V2.expectString
        });
      Object.assign(B, Z);
      let I = new gKQ({
        $metadata: Sd(A),
        ...B
      });
      return (0, V2.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    Gn4 = L5(async (A, Q) => {
      let B = (0, V2.map)({}),
        G = A.body,
        Z = (0, V2.take)(G, {
          message: V2.expectString
        });
      Object.assign(B, Z);
      let I = new uKQ({
        $metadata: Sd(A),
        ...B
      });
      return (0, V2.decorateServiceException)(I, A.body)
    }, "de_TooManyRequestsExceptionRes"),
    Zn4 = L5(async (A, Q) => {
      let B = (0, V2.map)({}),
        G = A.body,
        Z = (0, V2.take)(G, {
          message: V2.expectString
        });
      Object.assign(B, Z);
      let I = new mKQ({
        $metadata: Sd(A),
        ...B
      });
      return (0, V2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedExceptionRes"),
    Sd = L5((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    aKQ = "accountId",
    EuA = "accessToken",
    sKQ = "account_id",
    rKQ = "maxResults",
    oKQ = "max_result",
    tKQ = "nextToken",
    eKQ = "next_token",
    In4 = "roleName",
    Yn4 = "role_name",
    zuA = "x-amz-sso_bearer_token",
    ADQ = class extends V2.Command.classBuilder().ep(KuA).m(function(A, Q, B, G) {
      return [(0, HuA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, bHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").f(dKQ, pKQ).ser(ii4).de(ri4).build() {
      static {
        L5(this, "GetRoleCredentialsCommand")
      }
    },
    pL1 = class extends V2.Command.classBuilder().ep(KuA).m(function(A, Q, B, G) {
      return [(0, HuA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, bHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").f(lKQ, void 0).ser(ni4).de(oi4).build() {
      static {
        L5(this, "ListAccountRolesCommand")
      }
    },
    lL1 = class extends V2.Command.classBuilder().ep(KuA).m(function(A, Q, B, G) {
      return [(0, HuA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, bHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").f(iKQ, void 0).ser(ai4).de(ti4).build() {
      static {
        L5(this, "ListAccountsCommand")
      }
    },
    QDQ = class extends V2.Command.classBuilder().ep(KuA).m(function(A, Q, B, G) {
      return [(0, HuA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, bHA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").f(nKQ, void 0).ser(si4).de(ei4).build() {
      static {
        L5(this, "LogoutCommand")
      }
    },
    Jn4 = {
      GetRoleCredentialsCommand: ADQ,
      ListAccountRolesCommand: pL1,
      ListAccountsCommand: lL1,
      LogoutCommand: QDQ
    },
    BDQ = class extends DuA {
      static {
        L5(this, "SSO")
      }
    };
  (0, V2.createAggregatedClient)(Jn4, BDQ);
  var Wn4 = (0, iv.createPaginator)(DuA, pL1, "nextToken", "nextToken", "maxResults"),
    Xn4 = (0, iv.createPaginator)(DuA, lL1, "nextToken", "nextToken", "maxResults")
})
// @from(Start 3139775, End 3141246)
nL1 = z((IDQ) => {
  Object.defineProperty(IDQ, "__esModule", {
    value: !0
  });
  IDQ.resolveHttpAuthSchemeConfig = IDQ.defaultSSOOIDCHttpAuthSchemeProvider = IDQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
  var Vn4 = TF(),
    iL1 = w7(),
    Fn4 = async (A, Q, B) => {
      return {
        operation: (0, iL1.getSmithyContext)(Q).operation,
        region: await (0, iL1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  IDQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = Fn4;

  function Kn4(A) {
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

  function Dn4(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var Hn4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateToken": {
        Q.push(Dn4(A));
        break
      }
      default:
        Q.push(Kn4(A))
    }
    return Q
  };
  IDQ.defaultSSOOIDCHttpAuthSchemeProvider = Hn4;
  var Cn4 = (A) => {
    let Q = (0, Vn4.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, iL1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  IDQ.resolveHttpAuthSchemeConfig = Cn4
})
// @from(Start 3141252, End 3145537)
aL1 = z((Sw7, Un4) => {
  Un4.exports = {
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
// @from(Start 3145543, End 3150210)
LDQ = z((qDQ) => {
  Object.defineProperty(qDQ, "__esModule", {
    value: !0
  });
  qDQ.ruleSet = void 0;
  var zDQ = "required",
    wL = "fn",
    qL = "argv",
    c8A = "ref",
    JDQ = !0,
    WDQ = "isSet",
    fHA = "booleanEquals",
    m8A = "error",
    d8A = "endpoint",
    av = "tree",
    sL1 = "PartitionResult",
    rL1 = "getAttr",
    XDQ = {
      [zDQ]: !1,
      type: "String"
    },
    VDQ = {
      [zDQ]: !0,
      default: !1,
      type: "Boolean"
    },
    FDQ = {
      [c8A]: "Endpoint"
    },
    UDQ = {
      [wL]: fHA,
      [qL]: [{
        [c8A]: "UseFIPS"
      }, !0]
    },
    $DQ = {
      [wL]: fHA,
      [qL]: [{
        [c8A]: "UseDualStack"
      }, !0]
    },
    $L = {},
    KDQ = {
      [wL]: rL1,
      [qL]: [{
        [c8A]: sL1
      }, "supportsFIPS"]
    },
    wDQ = {
      [c8A]: sL1
    },
    DDQ = {
      [wL]: fHA,
      [qL]: [!0, {
        [wL]: rL1,
        [qL]: [wDQ, "supportsDualStack"]
      }]
    },
    HDQ = [UDQ],
    CDQ = [$DQ],
    EDQ = [{
      [c8A]: "Region"
    }],
    $n4 = {
      version: "1.0",
      parameters: {
        Region: XDQ,
        UseDualStack: VDQ,
        UseFIPS: VDQ,
        Endpoint: XDQ
      },
      rules: [{
        conditions: [{
          [wL]: WDQ,
          [qL]: [FDQ]
        }],
        rules: [{
          conditions: HDQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: m8A
        }, {
          conditions: CDQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: m8A
        }, {
          endpoint: {
            url: FDQ,
            properties: $L,
            headers: $L
          },
          type: d8A
        }],
        type: av
      }, {
        conditions: [{
          [wL]: WDQ,
          [qL]: EDQ
        }],
        rules: [{
          conditions: [{
            [wL]: "aws.partition",
            [qL]: EDQ,
            assign: sL1
          }],
          rules: [{
            conditions: [UDQ, $DQ],
            rules: [{
              conditions: [{
                [wL]: fHA,
                [qL]: [JDQ, KDQ]
              }, DDQ],
              rules: [{
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: $L,
                  headers: $L
                },
                type: d8A
              }],
              type: av
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: m8A
            }],
            type: av
          }, {
            conditions: HDQ,
            rules: [{
              conditions: [{
                [wL]: fHA,
                [qL]: [KDQ, JDQ]
              }],
              rules: [{
                conditions: [{
                  [wL]: "stringEquals",
                  [qL]: [{
                    [wL]: rL1,
                    [qL]: [wDQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://oidc.{Region}.amazonaws.com",
                  properties: $L,
                  headers: $L
                },
                type: d8A
              }, {
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: $L,
                  headers: $L
                },
                type: d8A
              }],
              type: av
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: m8A
            }],
            type: av
          }, {
            conditions: CDQ,
            rules: [{
              conditions: [DDQ],
              rules: [{
                endpoint: {
                  url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: $L,
                  headers: $L
                },
                type: d8A
              }],
              type: av
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: m8A
            }],
            type: av
          }, {
            endpoint: {
              url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
              properties: $L,
              headers: $L
            },
            type: d8A
          }],
          type: av
        }],
        type: av
      }, {
        error: "Invalid Configuration: Missing Region",
        type: m8A
      }]
    };
  qDQ.ruleSet = $n4
})
// @from(Start 3150216, End 3150780)
RDQ = z((MDQ) => {
  Object.defineProperty(MDQ, "__esModule", {
    value: !0
  });
  MDQ.defaultEndpointResolver = void 0;
  var wn4 = S8A(),
    oL1 = FI(),
    qn4 = LDQ(),
    Nn4 = new oL1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    Ln4 = (A, Q = {}) => {
      return Nn4.get(A, () => (0, oL1.resolveEndpoint)(qn4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  MDQ.defaultEndpointResolver = Ln4;
  oL1.customEndpointFunctions.aws = wn4.awsEndpointFunctions
})
// @from(Start 3150786, End 3152204)
_DQ = z((jDQ) => {
  Object.defineProperty(jDQ, "__esModule", {
    value: !0
  });
  jDQ.getRuntimeConfig = void 0;
  var Mn4 = TF(),
    On4 = iB(),
    Rn4 = r6(),
    Tn4 = NJ(),
    TDQ = Pd(),
    PDQ = O2(),
    Pn4 = nL1(),
    jn4 = RDQ(),
    Sn4 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? TDQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? TDQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? jn4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Pn4.defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Mn4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new On4.NoAuthSigner
        }],
        logger: A?.logger ?? new Rn4.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO OIDC",
        urlParser: A?.urlParser ?? Tn4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? PDQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? PDQ.toUtf8
      }
    };
  jDQ.getRuntimeConfig = Sn4
})
// @from(Start 3152210, End 3154509)
hDQ = z((bDQ) => {
  Object.defineProperty(bDQ, "__esModule", {
    value: !0
  });
  bDQ.getRuntimeConfig = void 0;
  var _n4 = rr(),
    kn4 = _n4.__importDefault(aL1()),
    kDQ = TF(),
    yDQ = kHA(),
    UuA = f8(),
    yn4 = RX(),
    xDQ = D6(),
    Qo = uI(),
    vDQ = IZ(),
    xn4 = TX(),
    vn4 = KW(),
    bn4 = _DQ(),
    fn4 = r6(),
    hn4 = PX(),
    gn4 = r6(),
    un4 = (A) => {
      (0, gn4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, hn4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(fn4.loadConfigsForDefaultMode),
        G = (0, bn4.getRuntimeConfig)(A);
      (0, kDQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, Qo.loadConfig)(kDQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? xn4.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, yDQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: kn4.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, Qo.loadConfig)(xDQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Qo.loadConfig)(UuA.NODE_REGION_CONFIG_OPTIONS, {
          ...UuA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: vDQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Qo.loadConfig)({
          ...xDQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || vn4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? yn4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? vDQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Qo.loadConfig)(UuA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Qo.loadConfig)(UuA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Qo.loadConfig)(yDQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  bDQ.getRuntimeConfig = un4
})
// @from(Start 3154515, End 3174342)
AM1 = z((vw7, FHQ) => {
  var {
    defineProperty: $uA,
    getOwnPropertyDescriptor: mn4,
    getOwnPropertyNames: dn4
  } = Object, cn4 = Object.prototype.hasOwnProperty, R6 = (A, Q) => $uA(A, "name", {
    value: Q,
    configurable: !0
  }), pn4 = (A, Q) => {
    for (var B in Q) $uA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ln4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of dn4(Q))
        if (!cn4.call(A, Z) && Z !== B) $uA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = mn4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, in4 = (A) => ln4($uA({}, "__esModule", {
    value: !0
  }), A), iDQ = {};
  pn4(iDQ, {
    $Command: () => sDQ.Command,
    AccessDeniedException: () => rDQ,
    AuthorizationPendingException: () => oDQ,
    CreateTokenCommand: () => XHQ,
    CreateTokenRequestFilterSensitiveLog: () => tDQ,
    CreateTokenResponseFilterSensitiveLog: () => eDQ,
    ExpiredTokenException: () => AHQ,
    InternalServerException: () => QHQ,
    InvalidClientException: () => BHQ,
    InvalidGrantException: () => GHQ,
    InvalidRequestException: () => ZHQ,
    InvalidScopeException: () => IHQ,
    SSOOIDC: () => VHQ,
    SSOOIDCClient: () => aDQ,
    SSOOIDCServiceException: () => Uw,
    SlowDownException: () => YHQ,
    UnauthorizedClientException: () => JHQ,
    UnsupportedGrantTypeException: () => WHQ,
    __Client: () => nDQ.Client
  });
  FHQ.exports = in4(iDQ);
  var gDQ = MHA(),
    nn4 = OHA(),
    an4 = RHA(),
    uDQ = b8A(),
    sn4 = f8(),
    tL1 = iB(),
    rn4 = LX(),
    on4 = q5(),
    mDQ = D6(),
    nDQ = r6(),
    dDQ = nL1(),
    tn4 = R6((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "sso-oauth"
      })
    }, "resolveClientEndpointParameters"),
    en4 = {
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
    Aa4 = hDQ(),
    cDQ = xHA(),
    pDQ = iz(),
    lDQ = r6(),
    Qa4 = R6((A) => {
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
    Ba4 = R6((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    Ga4 = R6((A, Q) => {
      let B = Object.assign((0, cDQ.getAwsRegionExtensionConfiguration)(A), (0, lDQ.getDefaultExtensionConfiguration)(A), (0, pDQ.getHttpHandlerExtensionConfiguration)(A), Qa4(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, cDQ.resolveAwsRegionExtensionConfiguration)(B), (0, lDQ.resolveDefaultRuntimeConfig)(B), (0, pDQ.resolveHttpHandlerRuntimeConfig)(B), Ba4(B))
    }, "resolveRuntimeExtensions"),
    aDQ = class extends nDQ.Client {
      static {
        R6(this, "SSOOIDCClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, Aa4.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = tn4(Q),
          G = (0, uDQ.resolveUserAgentConfig)(B),
          Z = (0, mDQ.resolveRetryConfig)(G),
          I = (0, sn4.resolveRegionConfig)(Z),
          Y = (0, gDQ.resolveHostHeaderConfig)(I),
          J = (0, on4.resolveEndpointConfig)(Y),
          W = (0, dDQ.resolveHttpAuthSchemeConfig)(J),
          X = Ga4(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, uDQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, mDQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, rn4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, gDQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, nn4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, an4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, tL1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: dDQ.defaultSSOOIDCHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: R6(async (V) => new tL1.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, tL1.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    Za4 = r6(),
    Ia4 = q5(),
    Ya4 = GZ(),
    sDQ = r6(),
    p8A = r6(),
    Ja4 = r6(),
    Uw = class A extends Ja4.ServiceException {
      static {
        R6(this, "SSOOIDCServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    rDQ = class A extends Uw {
      static {
        R6(this, "AccessDeniedException")
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
    oDQ = class A extends Uw {
      static {
        R6(this, "AuthorizationPendingException")
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
    tDQ = R6((A) => ({
      ...A,
      ...A.clientSecret && {
        clientSecret: p8A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: p8A.SENSITIVE_STRING
      },
      ...A.codeVerifier && {
        codeVerifier: p8A.SENSITIVE_STRING
      }
    }), "CreateTokenRequestFilterSensitiveLog"),
    eDQ = R6((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: p8A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: p8A.SENSITIVE_STRING
      },
      ...A.idToken && {
        idToken: p8A.SENSITIVE_STRING
      }
    }), "CreateTokenResponseFilterSensitiveLog"),
    AHQ = class A extends Uw {
      static {
        R6(this, "ExpiredTokenException")
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
    QHQ = class A extends Uw {
      static {
        R6(this, "InternalServerException")
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
    BHQ = class A extends Uw {
      static {
        R6(this, "InvalidClientException")
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
    GHQ = class A extends Uw {
      static {
        R6(this, "InvalidGrantException")
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
    ZHQ = class A extends Uw {
      static {
        R6(this, "InvalidRequestException")
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
    IHQ = class A extends Uw {
      static {
        R6(this, "InvalidScopeException")
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
    YHQ = class A extends Uw {
      static {
        R6(this, "SlowDownException")
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
    JHQ = class A extends Uw {
      static {
        R6(this, "UnauthorizedClientException")
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
    WHQ = class A extends Uw {
      static {
        R6(this, "UnsupportedGrantTypeException")
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
    eL1 = TF(),
    Wa4 = iB(),
    G2 = r6(),
    Xa4 = R6(async (A, Q) => {
      let B = (0, Wa4.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/token");
      let Z;
      return Z = JSON.stringify((0, G2.take)(A, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: R6((I) => (0, G2._json)(I), "scope")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateTokenCommand"),
    Va4 = R6(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return Fa4(A, Q);
      let B = (0, G2.map)({
          $metadata: NL(A)
        }),
        G = (0, G2.expectNonNull)((0, G2.expectObject)(await (0, eL1.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, G2.take)(G, {
          accessToken: G2.expectString,
          expiresIn: G2.expectInt32,
          idToken: G2.expectString,
          refreshToken: G2.expectString,
          tokenType: G2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateTokenCommand"),
    Fa4 = R6(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, eL1.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, eL1.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
          throw await Da4(B, Q);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
          throw await Ha4(B, Q);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
          throw await Ca4(B, Q);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
          throw await Ea4(B, Q);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
          throw await za4(B, Q);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
          throw await Ua4(B, Q);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
          throw await $a4(B, Q);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
          throw await wa4(B, Q);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
          throw await qa4(B, Q);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
          throw await Na4(B, Q);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
          throw await La4(B, Q);
        default:
          let Z = B.body;
          return Ka4({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Ka4 = (0, G2.withBaseException)(Uw),
    Da4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new rDQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    Ha4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new oDQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_AuthorizationPendingExceptionRes"),
    Ca4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new AHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_ExpiredTokenExceptionRes"),
    Ea4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new QHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    za4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new BHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_InvalidClientExceptionRes"),
    Ua4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new GHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_InvalidGrantExceptionRes"),
    $a4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new ZHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    wa4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new IHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_InvalidScopeExceptionRes"),
    qa4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new YHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_SlowDownExceptionRes"),
    Na4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new JHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedClientExceptionRes"),
    La4 = R6(async (A, Q) => {
      let B = (0, G2.map)({}),
        G = A.body,
        Z = (0, G2.take)(G, {
          error: G2.expectString,
          error_description: G2.expectString
        });
      Object.assign(B, Z);
      let I = new WHQ({
        $metadata: NL(A),
        ...B
      });
      return (0, G2.decorateServiceException)(I, A.body)
    }, "de_UnsupportedGrantTypeExceptionRes"),
    NL = R6((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    XHQ = class extends sDQ.Command.classBuilder().ep(en4).m(function(A, Q, B, G) {
      return [(0, Ya4.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Ia4.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").f(tDQ, eDQ).ser(Xa4).de(Va4).build() {
      static {
        R6(this, "CreateTokenCommand")
      }
    },
    Ma4 = {
      CreateTokenCommand: XHQ
    },
    VHQ = class extends aDQ {
      static {
        R6(this, "SSOOIDC")
      }
    };
  (0, Za4.createAggregatedClient)(Ma4, VHQ)
})
// @from(Start 3174348, End 3180517)
$HQ = z((gw7, UHQ) => {
  var {
    create: Oa4,
    defineProperty: gHA,
    getOwnPropertyDescriptor: Ra4,
    getOwnPropertyNames: Ta4,
    getPrototypeOf: Pa4
  } = Object, ja4 = Object.prototype.hasOwnProperty, sv = (A, Q) => gHA(A, "name", {
    value: Q,
    configurable: !0
  }), Sa4 = (A, Q) => {
    for (var B in Q) gHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, HHQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Ta4(Q))
        if (!ja4.call(A, Z) && Z !== B) gHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Ra4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, CHQ = (A, Q, B) => (B = A != null ? Oa4(Pa4(A)) : {}, HHQ(Q || !A || !A.__esModule ? gHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), _a4 = (A) => HHQ(gHA({}, "__esModule", {
    value: !0
  }), A), EHQ = {};
  Sa4(EHQ, {
    fromEnvSigningName: () => xa4,
    fromSso: () => zHQ,
    fromStatic: () => ma4,
    nodeProvider: () => da4
  });
  UHQ.exports = _a4(EHQ);
  var ka4 = lR(),
    ya4 = VL1(),
    $w = j2(),
    xa4 = sv(({
      logger: A,
      signingName: Q
    } = {}) => async () => {
      if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !Q) throw new $w.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
        logger: A
      });
      let B = (0, ya4.getBearerTokenEnvKey)(Q);
      if (!(B in process.env)) throw new $w.TokenProviderError(`Token not present in '${B}' environment variable`, {
        logger: A
      });
      let G = {
        token: process.env[B]
      };
      return (0, ka4.setTokenFeature)(G, "BEARER_SERVICE_ENV_VARS", "3"), G
    }, "fromEnvSigningName"),
    va4 = 300000,
    QM1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.",
    ba4 = sv(async (A, Q = {}) => {
      let {
        SSOOIDCClient: B
      } = await Promise.resolve().then(() => CHQ(AM1()));
      return new B(Object.assign({}, Q.clientConfig ?? {}, {
        region: A ?? Q.clientConfig?.region,
        logger: Q.clientConfig?.logger ?? Q.parentClientConfig?.logger
      }))
    }, "getSsoOidcClient"),
    fa4 = sv(async (A, Q, B = {}) => {
      let {
        CreateTokenCommand: G
      } = await Promise.resolve().then(() => CHQ(AM1()));
      return (await ba4(Q, B)).send(new G({
        clientId: A.clientId,
        clientSecret: A.clientSecret,
        refreshToken: A.refreshToken,
        grantType: "refresh_token"
      }))
    }, "getNewSsoOidcToken"),
    KHQ = sv((A) => {
      if (A.expiration && A.expiration.getTime() < Date.now()) throw new $w.TokenProviderError(`Token is expired. ${QM1}`, !1)
    }, "validateTokenExpiry"),
    Bo = sv((A, Q, B = !1) => {
      if (typeof Q > "u") throw new $w.TokenProviderError(`Value not present for '${A}' in SSO Token${B?". Cannot refresh":""}. ${QM1}`, !1)
    }, "validateTokenKey"),
    hHA = SG(),
    ha4 = UA("fs"),
    {
      writeFile: ga4
    } = ha4.promises,
    ua4 = sv((A, Q) => {
      let B = (0, hHA.getSSOTokenFilepath)(A),
        G = JSON.stringify(Q, null, 2);
      return ga4(B, G)
    }, "writeSSOTokenToFile"),
    DHQ = new Date(0),
    zHQ = sv((A = {}) => async ({
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
      let G = await (0, hHA.parseKnownFiles)(B),
        Z = (0, hHA.getProfileName)({
          profile: B.profile ?? Q?.profile
        }),
        I = G[Z];
      if (!I) throw new $w.TokenProviderError(`Profile '${Z}' could not be found in shared credentials file.`, !1);
      else if (!I.sso_session) throw new $w.TokenProviderError(`Profile '${Z}' is missing required property 'sso_session'.`);
      let Y = I.sso_session,
        W = (await (0, hHA.loadSsoSessionData)(B))[Y];
      if (!W) throw new $w.TokenProviderError(`Sso session '${Y}' could not be found in shared credentials file.`, !1);
      for (let C of ["sso_start_url", "sso_region"])
        if (!W[C]) throw new $w.TokenProviderError(`Sso session '${Y}' is missing required property '${C}'.`, !1);
      let {
        sso_start_url: X,
        sso_region: V
      } = W, F;
      try {
        F = await (0, hHA.getSSOTokenFromFile)(Y)
      } catch (C) {
        throw new $w.TokenProviderError(`The SSO session token associated with profile=${Z} was not found or is invalid. ${QM1}`, !1)
      }
      Bo("accessToken", F.accessToken), Bo("expiresAt", F.expiresAt);
      let {
        accessToken: K,
        expiresAt: D
      } = F, H = {
        token: K,
        expiration: new Date(D)
      };
      if (H.expiration.getTime() - Date.now() > va4) return H;
      if (Date.now() - DHQ.getTime() < 30000) return KHQ(H), H;
      Bo("clientId", F.clientId, !0), Bo("clientSecret", F.clientSecret, !0), Bo("refreshToken", F.refreshToken, !0);
      try {
        DHQ.setTime(Date.now());
        let C = await fa4(F, V, B);
        Bo("accessToken", C.accessToken), Bo("expiresIn", C.expiresIn);
        let E = new Date(Date.now() + C.expiresIn * 1000);
        try {
          await ua4(Y, {
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
        return KHQ(H), H
      }
    }, "fromSso"),
    ma4 = sv(({
      token: A,
      logger: Q
    }) => async () => {
      if (Q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new $w.TokenProviderError("Please pass a valid token to fromStatic", !1);
      return A
    }, "fromStatic"),
    da4 = sv((A = {}) => (0, $w.memoize)((0, $w.chain)(zHQ(A), async () => {
      throw new $w.TokenProviderError("Could not load token from any providers", !1)
    }), (Q) => Q.expiration !== void 0 && Q.expiration.getTime() - Date.now() < 300000, (Q) => Q.expiration !== void 0), "nodeProvider")
})
// @from(Start 3180523, End 3187765)
GM1 = z((uw7, PHQ) => {
  var {
    defineProperty: quA,
    getOwnPropertyDescriptor: ca4,
    getOwnPropertyNames: NHQ
  } = Object, pa4 = Object.prototype.hasOwnProperty, NuA = (A, Q) => quA(A, "name", {
    value: Q,
    configurable: !0
  }), la4 = (A, Q) => function() {
    return A && (Q = (0, A[NHQ(A)[0]])(A = 0)), Q
  }, LHQ = (A, Q) => {
    for (var B in Q) quA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ia4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NHQ(Q))
        if (!pa4.call(A, Z) && Z !== B) quA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = ca4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, na4 = (A) => ia4(quA({}, "__esModule", {
    value: !0
  }), A), MHQ = {};
  LHQ(MHQ, {
    GetRoleCredentialsCommand: () => BM1.GetRoleCredentialsCommand,
    SSOClient: () => BM1.SSOClient
  });
  var BM1, aa4 = la4({
      "src/loadSso.ts"() {
        BM1 = ZDQ()
      }
    }),
    OHQ = {};
  LHQ(OHQ, {
    fromSSO: () => ra4,
    isSsoProfile: () => RHQ,
    validateSsoProfile: () => THQ
  });
  PHQ.exports = na4(OHQ);
  var RHQ = NuA((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    wHQ = lR(),
    sa4 = $HQ(),
    iR = j2(),
    wuA = SG(),
    uHA = !1,
    qHQ = NuA(async ({
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
        let v = await (0, sa4.fromSso)({
          profile: W
        })();
        V = {
          accessToken: v.token,
          expiresAt: new Date(v.expiration).toISOString()
        }
      } catch (v) {
        throw new iR.CredentialsProviderError(v.message, {
          tryNextLink: uHA,
          logger: X
        })
      } else try {
        V = await (0, wuA.getSSOTokenFromFile)(A)
      } catch (v) {
        throw new iR.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
          tryNextLink: uHA,
          logger: X
        })
      }
      if (new Date(V.expiresAt).getTime() - Date.now() <= 0) throw new iR.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: uHA,
        logger: X
      });
      let {
        accessToken: K
      } = V, {
        SSOClient: D,
        GetRoleCredentialsCommand: H
      } = await Promise.resolve().then(() => (aa4(), MHQ)), C = I || new D(Object.assign({}, Y ?? {}, {
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
        throw new iR.CredentialsProviderError(v, {
          tryNextLink: uHA,
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
      if (!U || !q || !w || !N) throw new iR.CredentialsProviderError("SSO returns an invalid temporary credential.", {
        tryNextLink: uHA,
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
      if (Q)(0, wHQ.setCredentialFeature)(y, "CREDENTIALS_SSO", "s");
      else(0, wHQ.setCredentialFeature)(y, "CREDENTIALS_SSO_LEGACY", "u");
      return y
    }, "resolveSSOCredentials"),
    THQ = NuA((A, Q) => {
      let {
        sso_start_url: B,
        sso_account_id: G,
        sso_region: Z,
        sso_role_name: I
      } = A;
      if (!B || !G || !Z || !I) throw new iR.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
        tryNextLink: !1,
        logger: Q
      });
      return A
    }, "validateSsoProfile"),
    ra4 = NuA((A = {}) => async ({
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
      } = A, W = (0, wuA.getProfileName)({
        profile: A.profile ?? Q?.profile
      });
      if (!B && !G && !Z && !I && !Y) {
        let V = (await (0, wuA.parseKnownFiles)(A))[W];
        if (!V) throw new iR.CredentialsProviderError(`Profile ${W} was not found.`, {
          logger: A.logger
        });
        if (!RHQ(V)) throw new iR.CredentialsProviderError(`Profile ${W} is not configured with SSO credentials.`, {
          logger: A.logger
        });
        if (V?.sso_session) {
          let U = (await (0, wuA.loadSsoSessionData)(A))[V.sso_session],
            q = ` configurations in profile ${W} and sso-session ${V.sso_session}`;
          if (Z && Z !== U.sso_region) throw new iR.CredentialsProviderError("Conflicting SSO region" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          if (B && B !== U.sso_start_url) throw new iR.CredentialsProviderError("Conflicting SSO start_url" + q, {
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
        } = THQ(V, A.logger);
        return qHQ({
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
      } else if (!B || !G || !Z || !I) throw new iR.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
        tryNextLink: !1,
        logger: A.logger
      });
      else return qHQ({
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
// @from(Start 3187771, End 3189428)
IM1 = z((jHQ) => {
  Object.defineProperty(jHQ, "__esModule", {
    value: !0
  });
  jHQ.resolveHttpAuthSchemeConfig = jHQ.resolveStsAuthConfig = jHQ.defaultSTSHttpAuthSchemeProvider = jHQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var oa4 = TF(),
    ZM1 = w7(),
    ta4 = mHA(),
    ea4 = async (A, Q, B) => {
      return {
        operation: (0, ZM1.getSmithyContext)(Q).operation,
        region: await (0, ZM1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  jHQ.defaultSTSHttpAuthSchemeParametersProvider = ea4;

  function As4(A) {
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

  function Qs4(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var Bs4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithWebIdentity": {
        Q.push(Qs4(A));
        break
      }
      default:
        Q.push(As4(A))
    }
    return Q
  };
  jHQ.defaultSTSHttpAuthSchemeProvider = Bs4;
  var Gs4 = (A) => Object.assign(A, {
    stsClientCtor: ta4.STSClient
  });
  jHQ.resolveStsAuthConfig = Gs4;
  var Zs4 = (A) => {
    let Q = jHQ.resolveStsAuthConfig(A),
      B = (0, oa4.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, ZM1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  jHQ.resolveHttpAuthSchemeConfig = Zs4
})
// @from(Start 3189434, End 3190322)
dHA = z((kHQ) => {
  Object.defineProperty(kHQ, "__esModule", {
    value: !0
  });
  kHQ.commonParams = kHQ.resolveClientEndpointParameters = void 0;
  var Js4 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  kHQ.resolveClientEndpointParameters = Js4;
  kHQ.commonParams = {
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