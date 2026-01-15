
// @from(Ln 92446, Col 4)
zPQ = U((SZG, FF6) => {
  FF6.exports = {
    name: "@aws-sdk/client-sso",
    description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
    version: "3.936.0",
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
      "@aws-sdk/core": "3.936.0",
      "@aws-sdk/middleware-host-header": "3.936.0",
      "@aws-sdk/middleware-logger": "3.936.0",
      "@aws-sdk/middleware-recursion-detection": "3.936.0",
      "@aws-sdk/middleware-user-agent": "3.936.0",
      "@aws-sdk/region-config-resolver": "3.936.0",
      "@aws-sdk/types": "3.936.0",
      "@aws-sdk/util-endpoints": "3.936.0",
      "@aws-sdk/util-user-agent-browser": "3.936.0",
      "@aws-sdk/util-user-agent-node": "3.936.0",
      "@smithy/config-resolver": "^4.4.3",
      "@smithy/core": "^3.18.5",
      "@smithy/fetch-http-handler": "^5.3.6",
      "@smithy/hash-node": "^4.2.5",
      "@smithy/invalid-dependency": "^4.2.5",
      "@smithy/middleware-content-length": "^4.2.5",
      "@smithy/middleware-endpoint": "^4.3.12",
      "@smithy/middleware-retry": "^4.4.12",
      "@smithy/middleware-serde": "^4.2.6",
      "@smithy/middleware-stack": "^4.2.5",
      "@smithy/node-config-provider": "^4.3.5",
      "@smithy/node-http-handler": "^4.4.5",
      "@smithy/protocol-http": "^5.3.5",
      "@smithy/smithy-client": "^4.9.8",
      "@smithy/types": "^4.9.0",
      "@smithy/url-parser": "^4.2.5",
      "@smithy/util-base64": "^4.3.0",
      "@smithy/util-body-length-browser": "^4.2.0",
      "@smithy/util-body-length-node": "^4.2.1",
      "@smithy/util-defaults-mode-browser": "^4.3.11",
      "@smithy/util-defaults-mode-node": "^4.2.14",
      "@smithy/util-endpoints": "^3.2.5",
      "@smithy/util-middleware": "^4.2.5",
      "@smithy/util-retry": "^4.2.5",
      "@smithy/util-utf8": "^4.2.0",
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
// @from(Ln 92542, Col 4)
$PQ = U((EF6) => {
  var HF6 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  EF6.isArrayBuffer = HF6
})
// @from(Ln 92546, Col 4)
qb1 = U((qF6) => {
  var $F6 = $PQ(),
    Ub1 = NA("buffer"),
    CF6 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!$F6.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Ub1.Buffer.from(A, Q, B)
    },
    UF6 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Ub1.Buffer.from(A, Q) : Ub1.Buffer.from(A)
    };
  qF6.fromArrayBuffer = CF6;
  qF6.fromString = UF6
})
// @from(Ln 92560, Col 4)
qPQ = U((CPQ) => {
  Object.defineProperty(CPQ, "__esModule", {
    value: !0
  });
  CPQ.fromBase64 = void 0;
  var LF6 = qb1(),
    OF6 = /^[A-Za-z0-9+/]*={0,2}$/,
    MF6 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!OF6.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, LF6.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  CPQ.fromBase64 = MF6
})
// @from(Ln 92575, Col 4)
LPQ = U((NPQ) => {
  Object.defineProperty(NPQ, "__esModule", {
    value: !0
  });
  NPQ.toBase64 = void 0;
  var RF6 = qb1(),
    _F6 = oG(),
    jF6 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, _F6.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, RF6.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  NPQ.toBase64 = jF6
})
// @from(Ln 92591, Col 4)
RPQ = U((wwA) => {
  var OPQ = qPQ(),
    MPQ = LPQ();
  Object.keys(OPQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(wwA, A)) Object.defineProperty(wwA, A, {
      enumerable: !0,
      get: function () {
        return OPQ[A]
      }
    })
  });
  Object.keys(MPQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(wwA, A)) Object.defineProperty(wwA, A, {
      enumerable: !0,
      get: function () {
        return MPQ[A]
      }
    })
  })
})
// @from(Ln 92611, Col 4)
cPQ = U((mPQ) => {
  Object.defineProperty(mPQ, "__esModule", {
    value: !0
  });
  mPQ.ruleSet = void 0;
  var fPQ = "required",
    BR = "fn",
    GR = "argv",
    MYA = "ref",
    _PQ = !0,
    jPQ = "isSet",
    LwA = "booleanEquals",
    LYA = "error",
    OYA = "endpoint",
    Bu = "tree",
    Nb1 = "PartitionResult",
    wb1 = "getAttr",
    TPQ = {
      [fPQ]: !1,
      type: "string"
    },
    PPQ = {
      [fPQ]: !0,
      default: !1,
      type: "boolean"
    },
    SPQ = {
      [MYA]: "Endpoint"
    },
    hPQ = {
      [BR]: LwA,
      [GR]: [{
        [MYA]: "UseFIPS"
      }, !0]
    },
    gPQ = {
      [BR]: LwA,
      [GR]: [{
        [MYA]: "UseDualStack"
      }, !0]
    },
    QR = {},
    xPQ = {
      [BR]: wb1,
      [GR]: [{
        [MYA]: Nb1
      }, "supportsFIPS"]
    },
    uPQ = {
      [MYA]: Nb1
    },
    yPQ = {
      [BR]: LwA,
      [GR]: [!0, {
        [BR]: wb1,
        [GR]: [uPQ, "supportsDualStack"]
      }]
    },
    vPQ = [hPQ],
    kPQ = [gPQ],
    bPQ = [{
      [MYA]: "Region"
    }],
    TF6 = {
      version: "1.0",
      parameters: {
        Region: TPQ,
        UseDualStack: PPQ,
        UseFIPS: PPQ,
        Endpoint: TPQ
      },
      rules: [{
        conditions: [{
          [BR]: jPQ,
          [GR]: [SPQ]
        }],
        rules: [{
          conditions: vPQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: LYA
        }, {
          conditions: kPQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: LYA
        }, {
          endpoint: {
            url: SPQ,
            properties: QR,
            headers: QR
          },
          type: OYA
        }],
        type: Bu
      }, {
        conditions: [{
          [BR]: jPQ,
          [GR]: bPQ
        }],
        rules: [{
          conditions: [{
            [BR]: "aws.partition",
            [GR]: bPQ,
            assign: Nb1
          }],
          rules: [{
            conditions: [hPQ, gPQ],
            rules: [{
              conditions: [{
                [BR]: LwA,
                [GR]: [_PQ, xPQ]
              }, yPQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: QR,
                  headers: QR
                },
                type: OYA
              }],
              type: Bu
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: LYA
            }],
            type: Bu
          }, {
            conditions: vPQ,
            rules: [{
              conditions: [{
                [BR]: LwA,
                [GR]: [xPQ, _PQ]
              }],
              rules: [{
                conditions: [{
                  [BR]: "stringEquals",
                  [GR]: [{
                    [BR]: wb1,
                    [GR]: [uPQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://portal.sso.{Region}.amazonaws.com",
                  properties: QR,
                  headers: QR
                },
                type: OYA
              }, {
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: QR,
                  headers: QR
                },
                type: OYA
              }],
              type: Bu
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: LYA
            }],
            type: Bu
          }, {
            conditions: kPQ,
            rules: [{
              conditions: [yPQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: QR,
                  headers: QR
                },
                type: OYA
              }],
              type: Bu
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: LYA
            }],
            type: Bu
          }, {
            endpoint: {
              url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
              properties: QR,
              headers: QR
            },
            type: OYA
          }],
          type: Bu
        }],
        type: Bu
      }, {
        error: "Invalid Configuration: Missing Region",
        type: LYA
      }]
    };
  mPQ.ruleSet = TF6
})
// @from(Ln 92807, Col 4)
iPQ = U((pPQ) => {
  Object.defineProperty(pPQ, "__esModule", {
    value: !0
  });
  pPQ.defaultEndpointResolver = void 0;
  var PF6 = Hv(),
    Lb1 = xT(),
    SF6 = cPQ(),
    xF6 = new Lb1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    yF6 = (A, Q = {}) => {
      return xF6.get(A, () => (0, Lb1.resolveEndpoint)(SF6.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  pPQ.defaultEndpointResolver = yF6;
  Lb1.customEndpointFunctions.aws = PF6.awsEndpointFunctions
})
// @from(Ln 92828, Col 4)
sPQ = U((oPQ) => {
  Object.defineProperty(oPQ, "__esModule", {
    value: !0
  });
  oPQ.getRuntimeConfig = void 0;
  var vF6 = hY(),
    kF6 = eg(),
    bF6 = rG(),
    fF6 = NwA(),
    hF6 = oM(),
    nPQ = RPQ(),
    aPQ = oG(),
    gF6 = Cb1(),
    uF6 = iPQ(),
    mF6 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? nPQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? nPQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? uF6.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? gF6.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new vF6.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new bF6.NoAuthSigner
        }],
        logger: A?.logger ?? new fF6.NoOpLogger,
        protocol: A?.protocol ?? new kF6.AwsRestJsonProtocol({
          defaultNamespace: "com.amazonaws.sso"
        }),
        serviceId: A?.serviceId ?? "SSO",
        urlParser: A?.urlParser ?? hF6.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? aPQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? aPQ.toUtf8
      }
    };
  oPQ.getRuntimeConfig = mF6
})
// @from(Ln 92872, Col 4)
ZSQ = U((BSQ) => {
  Object.defineProperty(BSQ, "__esModule", {
    value: !0
  });
  BSQ.getRuntimeConfig = void 0;
  var dF6 = LZ(),
    cF6 = dF6.__importDefault(zPQ()),
    tPQ = hY(),
    ePQ = og(),
    soA = RD(),
    pF6 = rg(),
    ASQ = RH(),
    $0A = _q(),
    QSQ = XL(),
    lF6 = sg(),
    iF6 = Uv(),
    nF6 = sPQ(),
    aF6 = NwA(),
    oF6 = Qu(),
    rF6 = NwA(),
    sF6 = (A) => {
      (0, rF6.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, oF6.resolveDefaultsModeConfig)(A),
        B = () => Q().then(aF6.loadConfigsForDefaultMode),
        G = (0, nF6.getRuntimeConfig)(A);
      (0, tPQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, $0A.loadConfig)(tPQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? lF6.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, ePQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: cF6.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, $0A.loadConfig)(ASQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, $0A.loadConfig)(soA.NODE_REGION_CONFIG_OPTIONS, {
          ...soA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: QSQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, $0A.loadConfig)({
          ...ASQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || iF6.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? pF6.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? QSQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, $0A.loadConfig)(soA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, $0A.loadConfig)(soA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, $0A.loadConfig)(ePQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  BSQ.getRuntimeConfig = sF6
})
// @from(Ln 92932, Col 4)
ISQ = U((GH6) => {
  var tF6 = Wb1(),
    eF6 = (A) => {
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
    AH6 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class YSQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = tF6.FieldPosition.HEADER,
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
  class JSQ {
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
  class toA {
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
      let Q = new toA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = QH6(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return toA.clone(this)
    }
  }

  function QH6(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class XSQ {
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

  function BH6(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  GH6.Field = YSQ;
  GH6.Fields = JSQ;
  GH6.HttpRequest = toA;
  GH6.HttpResponse = XSQ;
  GH6.getHttpHandlerExtensionConfiguration = eF6;
  GH6.isValidHostname = BH6;
  GH6.resolveHttpHandlerRuntimeConfig = AH6
})
// @from(Ln 93074, Col 4)
MSQ = U((_b1) => {
  var DSQ = bg(),
    KH6 = fg(),
    VH6 = hg(),
    WSQ = $v(),
    FH6 = RD(),
    OwA = rG(),
    RYA = WX(),
    HH6 = ag(),
    MwA = yT(),
    KSQ = RH(),
    fT = NwA(),
    VSQ = Cb1(),
    EH6 = ZSQ(),
    FSQ = vT(),
    HSQ = ISQ(),
    zH6 = (A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "awsssoportal"
      })
    },
    eoA = {
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
    $H6 = (A) => {
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
    CH6 = (A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    },
    UH6 = (A, Q) => {
      let B = Object.assign(FSQ.getAwsRegionExtensionConfiguration(A), fT.getDefaultExtensionConfiguration(A), HSQ.getHttpHandlerExtensionConfiguration(A), $H6(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, FSQ.resolveAwsRegionExtensionConfiguration(B), fT.resolveDefaultRuntimeConfig(B), HSQ.resolveHttpHandlerRuntimeConfig(B), CH6(B))
    };
  class RwA extends fT.Client {
    config;
    constructor(...[A]) {
      let Q = EH6.getRuntimeConfig(A || {});
      super(Q);
      this.initConfig = Q;
      let B = zH6(Q),
        G = WSQ.resolveUserAgentConfig(B),
        Z = KSQ.resolveRetryConfig(G),
        Y = FH6.resolveRegionConfig(Z),
        J = DSQ.resolveHostHeaderConfig(Y),
        X = MwA.resolveEndpointConfig(J),
        I = VSQ.resolveHttpAuthSchemeConfig(X),
        D = UH6(I, A?.extensions || []);
      this.config = D, this.middlewareStack.use(RYA.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(WSQ.getUserAgentPlugin(this.config)), this.middlewareStack.use(KSQ.getRetryPlugin(this.config)), this.middlewareStack.use(HH6.getContentLengthPlugin(this.config)), this.middlewareStack.use(DSQ.getHostHeaderPlugin(this.config)), this.middlewareStack.use(KH6.getLoggerPlugin(this.config)), this.middlewareStack.use(VH6.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(OwA.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: VSQ.defaultSSOHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (W) => new OwA.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": W.credentials
        })
      })), this.middlewareStack.use(OwA.getHttpSigningPlugin(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  var _YA = class A extends fT.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ESQ = class A extends _YA {
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
    zSQ = class A extends _YA {
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
    $SQ = class A extends _YA {
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
    CSQ = class A extends _YA {
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
    qH6 = "AccountInfo",
    NH6 = "AccountListType",
    wH6 = "AccessTokenType",
    LH6 = "GetRoleCredentials",
    OH6 = "GetRoleCredentialsRequest",
    MH6 = "GetRoleCredentialsResponse",
    RH6 = "InvalidRequestException",
    _H6 = "Logout",
    jH6 = "ListAccounts",
    TH6 = "ListAccountsRequest",
    PH6 = "ListAccountRolesRequest",
    SH6 = "ListAccountRolesResponse",
    xH6 = "ListAccountsResponse",
    yH6 = "ListAccountRoles",
    vH6 = "LogoutRequest",
    kH6 = "RoleCredentials",
    bH6 = "RoleInfo",
    fH6 = "RoleListType",
    hH6 = "ResourceNotFoundException",
    gH6 = "SecretAccessKeyType",
    uH6 = "SessionTokenType",
    mH6 = "TooManyRequestsException",
    dH6 = "UnauthorizedException",
    ArA = "accountId",
    cH6 = "accessKeyId",
    pH6 = "accountList",
    lH6 = "accountName",
    QrA = "accessToken",
    USQ = "account_id",
    BrA = "client",
    GrA = "error",
    iH6 = "emailAddress",
    nH6 = "expiration",
    ZrA = "http",
    YrA = "httpError",
    JrA = "httpHeader",
    C0A = "httpQuery",
    XrA = "message",
    qSQ = "maxResults",
    NSQ = "max_result",
    IrA = "nextToken",
    wSQ = "next_token",
    aH6 = "roleCredentials",
    oH6 = "roleList",
    LSQ = "roleName",
    rH6 = "role_name",
    OSQ = "smithy.ts.sdk.synthetic.com.amazonaws.sso",
    sH6 = "secretAccessKey",
    tH6 = "sessionToken",
    DrA = "x-amz-sso_bearer_token",
    sZ = "com.amazonaws.sso",
    WrA = [0, sZ, wH6, 8, 0],
    eH6 = [0, sZ, gH6, 8, 0],
    AE6 = [0, sZ, uH6, 8, 0],
    QE6 = [3, sZ, qH6, 0, [ArA, lH6, iH6],
      [0, 0, 0]
    ],
    BE6 = [3, sZ, OH6, 0, [LSQ, ArA, QrA],
      [
        [0, {
          [C0A]: rH6
        }],
        [0, {
          [C0A]: USQ
        }],
        [() => WrA, {
          [JrA]: DrA
        }]
      ]
    ],
    GE6 = [3, sZ, MH6, 0, [aH6],
      [
        [() => KE6, 0]
      ]
    ],
    ZE6 = [-3, sZ, RH6, {
        [GrA]: BrA,
        [YrA]: 400
      },
      [XrA],
      [0]
    ];
  RYA.TypeRegistry.for(sZ).registerError(ZE6, ESQ);
  var YE6 = [3, sZ, PH6, 0, [IrA, qSQ, QrA, ArA],
      [
        [0, {
          [C0A]: wSQ
        }],
        [1, {
          [C0A]: NSQ
        }],
        [() => WrA, {
          [JrA]: DrA
        }],
        [0, {
          [C0A]: USQ
        }]
      ]
    ],
    JE6 = [3, sZ, SH6, 0, [IrA, oH6],
      [0, () => CE6]
    ],
    XE6 = [3, sZ, TH6, 0, [IrA, qSQ, QrA],
      [
        [0, {
          [C0A]: wSQ
        }],
        [1, {
          [C0A]: NSQ
        }],
        [() => WrA, {
          [JrA]: DrA
        }]
      ]
    ],
    IE6 = [3, sZ, xH6, 0, [IrA, pH6],
      [0, () => $E6]
    ],
    DE6 = [3, sZ, vH6, 0, [QrA],
      [
        [() => WrA, {
          [JrA]: DrA
        }]
      ]
    ],
    WE6 = [-3, sZ, hH6, {
        [GrA]: BrA,
        [YrA]: 404
      },
      [XrA],
      [0]
    ];
  RYA.TypeRegistry.for(sZ).registerError(WE6, zSQ);
  var KE6 = [3, sZ, kH6, 0, [cH6, sH6, tH6, nH6],
      [0, [() => eH6, 0],
        [() => AE6, 0], 1
      ]
    ],
    VE6 = [3, sZ, bH6, 0, [LSQ, ArA],
      [0, 0]
    ],
    FE6 = [-3, sZ, mH6, {
        [GrA]: BrA,
        [YrA]: 429
      },
      [XrA],
      [0]
    ];
  RYA.TypeRegistry.for(sZ).registerError(FE6, $SQ);
  var HE6 = [-3, sZ, dH6, {
      [GrA]: BrA,
      [YrA]: 401
    },
    [XrA],
    [0]
  ];
  RYA.TypeRegistry.for(sZ).registerError(HE6, CSQ);
  var EE6 = "unit",
    zE6 = [-3, OSQ, "SSOServiceException", 0, [],
      []
    ];
  RYA.TypeRegistry.for(OSQ).registerError(zE6, _YA);
  var $E6 = [1, sZ, NH6, 0, () => QE6],
    CE6 = [1, sZ, fH6, 0, () => VE6],
    UE6 = [9, sZ, LH6, {
      [ZrA]: ["GET", "/federation/credentials", 200]
    }, () => BE6, () => GE6],
    qE6 = [9, sZ, yH6, {
      [ZrA]: ["GET", "/assignment/roles", 200]
    }, () => YE6, () => JE6],
    NE6 = [9, sZ, jH6, {
      [ZrA]: ["GET", "/assignment/accounts", 200]
    }, () => XE6, () => IE6],
    wE6 = [9, sZ, _H6, {
      [ZrA]: ["POST", "/logout", 200]
    }, () => DE6, () => EE6];
  class Ob1 extends fT.Command.classBuilder().ep(eoA).m(function (A, Q, B, G) {
    return [MwA.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").sc(UE6).build() {}
  class KrA extends fT.Command.classBuilder().ep(eoA).m(function (A, Q, B, G) {
    return [MwA.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").sc(qE6).build() {}
  class VrA extends fT.Command.classBuilder().ep(eoA).m(function (A, Q, B, G) {
    return [MwA.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").sc(NE6).build() {}
  class Mb1 extends fT.Command.classBuilder().ep(eoA).m(function (A, Q, B, G) {
    return [MwA.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").sc(wE6).build() {}
  var LE6 = {
    GetRoleCredentialsCommand: Ob1,
    ListAccountRolesCommand: KrA,
    ListAccountsCommand: VrA,
    LogoutCommand: Mb1
  };
  class Rb1 extends RwA {}
  fT.createAggregatedClient(LE6, Rb1);
  var OE6 = OwA.createPaginator(RwA, KrA, "nextToken", "nextToken", "maxResults"),
    ME6 = OwA.createPaginator(RwA, VrA, "nextToken", "nextToken", "maxResults");
  Object.defineProperty(_b1, "$Command", {
    enumerable: !0,
    get: function () {
      return fT.Command
    }
  });
  Object.defineProperty(_b1, "__Client", {
    enumerable: !0,
    get: function () {
      return fT.Client
    }
  });
  _b1.GetRoleCredentialsCommand = Ob1;
  _b1.InvalidRequestException = ESQ;
  _b1.ListAccountRolesCommand = KrA;
  _b1.ListAccountsCommand = VrA;
  _b1.LogoutCommand = Mb1;
  _b1.ResourceNotFoundException = zSQ;
  _b1.SSO = Rb1;
  _b1.SSOClient = RwA;
  _b1.SSOServiceException = _YA;
  _b1.TooManyRequestsException = $SQ;
  _b1.UnauthorizedException = CSQ;
  _b1.paginateListAccountRoles = OE6;
  _b1.paginateListAccounts = ME6
})
// @from(Ln 93458, Col 4)
_SQ = U((jb1) => {
  var RSQ = MSQ();
  Object.defineProperty(jb1, "GetRoleCredentialsCommand", {
    enumerable: !0,
    get: function () {
      return RSQ.GetRoleCredentialsCommand
    }
  });
  Object.defineProperty(jb1, "SSOClient", {
    enumerable: !0,
    get: function () {
      return RSQ.SSOClient
    }
  })
})
// @from(Ln 93473, Col 4)
HrA = U((mE6) => {
  var hT = PW(),
    FrA = Cv(),
    jSQ = Rq(),
    gE6 = ooA(),
    PSQ = (A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"),
    _wA = !1,
    TSQ = async ({
      ssoStartUrl: A,
      ssoSession: Q,
      ssoAccountId: B,
      ssoRegion: G,
      ssoRoleName: Z,
      ssoClient: Y,
      clientConfig: J,
      parentClientConfig: X,
      profile: I,
      filepath: D,
      configFilepath: W,
      ignoreCache: K,
      logger: V
    }) => {
      let F, H = "To refresh this SSO session run aws sso login with the corresponding profile.";
      if (Q) try {
        let f = await gE6.fromSso({
          profile: I,
          filepath: D,
          configFilepath: W,
          ignoreCache: K
        })();
        F = {
          accessToken: f.token,
          expiresAt: new Date(f.expiration).toISOString()
        }
      } catch (f) {
        throw new hT.CredentialsProviderError(f.message, {
          tryNextLink: _wA,
          logger: V
        })
      } else try {
        F = await FrA.getSSOTokenFromFile(A)
      } catch (f) {
        throw new hT.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
          tryNextLink: _wA,
          logger: V
        })
      }
      if (new Date(F.expiresAt).getTime() - Date.now() <= 0) throw new hT.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: _wA,
        logger: V
      });
      let {
        accessToken: E
      } = F, {
        SSOClient: z,
        GetRoleCredentialsCommand: $
      } = await Promise.resolve().then(function () {
        return _SQ()
      }), O = Y || new z(Object.assign({}, J ?? {}, {
        logger: J?.logger ?? X?.logger,
        region: J?.region ?? G,
        userAgentAppId: J?.userAgentAppId ?? X?.userAgentAppId
      })), L;
      try {
        L = await O.send(new $({
          accountId: B,
          roleName: Z,
          accessToken: E
        }))
      } catch (f) {
        throw new hT.CredentialsProviderError(f, {
          tryNextLink: _wA,
          logger: V
        })
      }
      let {
        roleCredentials: {
          accessKeyId: M,
          secretAccessKey: _,
          sessionToken: j,
          expiration: x,
          credentialScope: b,
          accountId: S
        } = {}
      } = L;
      if (!M || !_ || !j || !x) throw new hT.CredentialsProviderError("SSO returns an invalid temporary credential.", {
        tryNextLink: _wA,
        logger: V
      });
      let u = {
        accessKeyId: M,
        secretAccessKey: _,
        sessionToken: j,
        expiration: new Date(x),
        ...b && {
          credentialScope: b
        },
        ...S && {
          accountId: S
        }
      };
      if (Q) jSQ.setCredentialFeature(u, "CREDENTIALS_SSO", "s");
      else jSQ.setCredentialFeature(u, "CREDENTIALS_SSO_LEGACY", "u");
      return u
    }, SSQ = (A, Q) => {
      let {
        sso_start_url: B,
        sso_account_id: G,
        sso_region: Z,
        sso_role_name: Y
      } = A;
      if (!B || !G || !Z || !Y) throw new hT.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
        tryNextLink: !1,
        logger: Q
      });
      return A
    }, uE6 = (A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
      let {
        ssoStartUrl: B,
        ssoAccountId: G,
        ssoRegion: Z,
        ssoRoleName: Y,
        ssoSession: J
      } = A, {
        ssoClient: X
      } = A, I = FrA.getProfileName({
        profile: A.profile ?? Q?.profile
      });
      if (!B && !G && !Z && !Y && !J) {
        let W = (await FrA.parseKnownFiles(A))[I];
        if (!W) throw new hT.CredentialsProviderError(`Profile ${I} was not found.`, {
          logger: A.logger
        });
        if (!PSQ(W)) throw new hT.CredentialsProviderError(`Profile ${I} is not configured with SSO credentials.`, {
          logger: A.logger
        });
        if (W?.sso_session) {
          let $ = (await FrA.loadSsoSessionData(A))[W.sso_session],
            O = ` configurations in profile ${I} and sso-session ${W.sso_session}`;
          if (Z && Z !== $.sso_region) throw new hT.CredentialsProviderError("Conflicting SSO region" + O, {
            tryNextLink: !1,
            logger: A.logger
          });
          if (B && B !== $.sso_start_url) throw new hT.CredentialsProviderError("Conflicting SSO start_url" + O, {
            tryNextLink: !1,
            logger: A.logger
          });
          W.sso_region = $.sso_region, W.sso_start_url = $.sso_start_url
        }
        let {
          sso_start_url: K,
          sso_account_id: V,
          sso_region: F,
          sso_role_name: H,
          sso_session: E
        } = SSQ(W, A.logger);
        return TSQ({
          ssoStartUrl: K,
          ssoSession: E,
          ssoAccountId: V,
          ssoRegion: F,
          ssoRoleName: H,
          ssoClient: X,
          clientConfig: A.clientConfig,
          parentClientConfig: A.parentClientConfig,
          profile: I,
          filepath: A.filepath,
          configFilepath: A.configFilepath,
          ignoreCache: A.ignoreCache,
          logger: A.logger
        })
      } else if (!B || !G || !Z || !Y) throw new hT.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
        tryNextLink: !1,
        logger: A.logger
      });
      else return TSQ({
        ssoStartUrl: B,
        ssoSession: J,
        ssoAccountId: G,
        ssoRegion: Z,
        ssoRoleName: Y,
        ssoClient: X,
        clientConfig: A.clientConfig,
        parentClientConfig: A.parentClientConfig,
        profile: I,
        filepath: A.filepath,
        configFilepath: A.configFilepath,
        ignoreCache: A.ignoreCache,
        logger: A.logger
      })
    };
  mE6.fromSSO = uE6;
  mE6.isSsoProfile = PSQ;
  mE6.validateSsoProfile = SSQ
})
// @from(Ln 93672, Col 4)
xSQ = U((rE6) => {
  rE6.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(rE6.HttpAuthLocation || (rE6.HttpAuthLocation = {}));
  rE6.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(rE6.HttpApiKeyAuthLocation || (rE6.HttpApiKeyAuthLocation = {}));
  rE6.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(rE6.EndpointURLScheme || (rE6.EndpointURLScheme = {}));
  rE6.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(rE6.AlgorithmId || (rE6.AlgorithmId = {}));
  var lE6 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => rE6.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => rE6.AlgorithmId.MD5,
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
    },
    iE6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    nE6 = (A) => {
      return lE6(A)
    },
    aE6 = (A) => {
      return iE6(A)
    };
  rE6.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(rE6.FieldPosition || (rE6.FieldPosition = {}));
  var oE6 = "__smithy_context";
  rE6.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(rE6.IniSectionType || (rE6.IniSectionType = {}));
  rE6.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(rE6.RequestHandlerProtocol || (rE6.RequestHandlerProtocol = {}));
  rE6.SMITHY_CONTEXT_KEY = oE6;
  rE6.getDefaultClientConfiguration = nE6;
  rE6.resolveDefaultRuntimeConfig = aE6
})
// @from(Ln 93737, Col 4)
bSQ = U((Yz6) => {
  var Az6 = xSQ(),
    Qz6 = (A) => {
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
    Bz6 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class ySQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = Az6.FieldPosition.HEADER,
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
  class vSQ {
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
  class ErA {
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
      let Q = new ErA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = Gz6(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return ErA.clone(this)
    }
  }

  function Gz6(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class kSQ {
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

  function Zz6(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Yz6.Field = ySQ;
  Yz6.Fields = vSQ;
  Yz6.HttpRequest = ErA;
  Yz6.HttpResponse = kSQ;
  Yz6.getHttpHandlerExtensionConfiguration = Qz6;
  Yz6.isValidHostname = Zz6;
  Yz6.resolveHttpHandlerRuntimeConfig = Bz6
})
// @from(Ln 93879, Col 4)
bb1 = U((fSQ) => {
  Object.defineProperty(fSQ, "__esModule", {
    value: !0
  });
  fSQ.resolveHttpAuthSchemeConfig = fSQ.defaultSigninHttpAuthSchemeProvider = fSQ.defaultSigninHttpAuthSchemeParametersProvider = void 0;
  var Fz6 = hY(),
    kb1 = Jz(),
    Hz6 = async (A, Q, B) => {
      return {
        operation: (0, kb1.getSmithyContext)(Q).operation,
        region: await (0, kb1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  fSQ.defaultSigninHttpAuthSchemeParametersProvider = Hz6;

  function Ez6(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "signin",
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

  function zz6(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var $z6 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateOAuth2Token": {
        Q.push(zz6(A));
        break
      }
      default:
        Q.push(Ez6(A))
    }
    return Q
  };
  fSQ.defaultSigninHttpAuthSchemeProvider = $z6;
  var Cz6 = (A) => {
    let Q = (0, Fz6.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, kb1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  fSQ.resolveHttpAuthSchemeConfig = Cz6
})
// @from(Ln 93938, Col 4)
rSQ = U((aSQ) => {
  Object.defineProperty(aSQ, "__esModule", {
    value: !0
  });
  aSQ.ruleSet = void 0;
  var nSQ = "required",
    Dz = "fn",
    Wz = "argv",
    Gu = "ref",
    gSQ = !0,
    uSQ = "isSet",
    U0A = "booleanEquals",
    jYA = "error",
    ei = "endpoint",
    gT = "tree",
    CrA = "PartitionResult",
    fb1 = "stringEquals",
    mSQ = {
      [nSQ]: !0,
      default: !1,
      type: "boolean"
    },
    dSQ = {
      [nSQ]: !1,
      type: "string"
    },
    cSQ = {
      [Gu]: "Endpoint"
    },
    hb1 = {
      [Dz]: U0A,
      [Wz]: [{
        [Gu]: "UseFIPS"
      }, !0]
    },
    gb1 = {
      [Dz]: U0A,
      [Wz]: [{
        [Gu]: "UseDualStack"
      }, !0]
    },
    Iz = {},
    ub1 = {
      [Dz]: "getAttr",
      [Wz]: [{
        [Gu]: CrA
      }, "name"]
    },
    zrA = {
      [Dz]: U0A,
      [Wz]: [{
        [Gu]: "UseFIPS"
      }, !1]
    },
    $rA = {
      [Dz]: U0A,
      [Wz]: [{
        [Gu]: "UseDualStack"
      }, !1]
    },
    pSQ = {
      [Dz]: "getAttr",
      [Wz]: [{
        [Gu]: CrA
      }, "supportsFIPS"]
    },
    lSQ = {
      [Dz]: U0A,
      [Wz]: [!0, {
        [Dz]: "getAttr",
        [Wz]: [{
          [Gu]: CrA
        }, "supportsDualStack"]
      }]
    },
    iSQ = [{
      [Gu]: "Region"
    }],
    Nz6 = {
      version: "1.0",
      parameters: {
        UseDualStack: mSQ,
        UseFIPS: mSQ,
        Endpoint: dSQ,
        Region: dSQ
      },
      rules: [{
        conditions: [{
          [Dz]: uSQ,
          [Wz]: [cSQ]
        }],
        rules: [{
          conditions: [hb1],
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: jYA
        }, {
          rules: [{
            conditions: [gb1],
            error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
            type: jYA
          }, {
            endpoint: {
              url: cSQ,
              properties: Iz,
              headers: Iz
            },
            type: ei
          }],
          type: gT
        }],
        type: gT
      }, {
        rules: [{
          conditions: [{
            [Dz]: uSQ,
            [Wz]: iSQ
          }],
          rules: [{
            conditions: [{
              [Dz]: "aws.partition",
              [Wz]: iSQ,
              assign: CrA
            }],
            rules: [{
              conditions: [{
                [Dz]: fb1,
                [Wz]: [ub1, "aws"]
              }, zrA, $rA],
              endpoint: {
                url: "https://{Region}.signin.aws.amazon.com",
                properties: Iz,
                headers: Iz
              },
              type: ei
            }, {
              conditions: [{
                [Dz]: fb1,
                [Wz]: [ub1, "aws-cn"]
              }, zrA, $rA],
              endpoint: {
                url: "https://{Region}.signin.amazonaws.cn",
                properties: Iz,
                headers: Iz
              },
              type: ei
            }, {
              conditions: [{
                [Dz]: fb1,
                [Wz]: [ub1, "aws-us-gov"]
              }, zrA, $rA],
              endpoint: {
                url: "https://{Region}.signin.amazonaws-us-gov.com",
                properties: Iz,
                headers: Iz
              },
              type: ei
            }, {
              conditions: [hb1, gb1],
              rules: [{
                conditions: [{
                  [Dz]: U0A,
                  [Wz]: [gSQ, pSQ]
                }, lSQ],
                rules: [{
                  endpoint: {
                    url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: Iz,
                    headers: Iz
                  },
                  type: ei
                }],
                type: gT
              }, {
                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                type: jYA
              }],
              type: gT
            }, {
              conditions: [hb1, $rA],
              rules: [{
                conditions: [{
                  [Dz]: U0A,
                  [Wz]: [pSQ, gSQ]
                }],
                rules: [{
                  endpoint: {
                    url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
                    properties: Iz,
                    headers: Iz
                  },
                  type: ei
                }],
                type: gT
              }, {
                error: "FIPS is enabled but this partition does not support FIPS",
                type: jYA
              }],
              type: gT
            }, {
              conditions: [zrA, gb1],
              rules: [{
                conditions: [lSQ],
                rules: [{
                  endpoint: {
                    url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: Iz,
                    headers: Iz
                  },
                  type: ei
                }],
                type: gT
              }, {
                error: "DualStack is enabled but this partition does not support DualStack",
                type: jYA
              }],
              type: gT
            }, {
              endpoint: {
                url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
                properties: Iz,
                headers: Iz
              },
              type: ei
            }],
            type: gT
          }],
          type: gT
        }, {
          error: "Invalid Configuration: Missing Region",
          type: jYA
        }],
        type: gT
      }]
    };
  aSQ.ruleSet = Nz6
})
// @from(Ln 94174, Col 4)
eSQ = U((sSQ) => {
  Object.defineProperty(sSQ, "__esModule", {
    value: !0
  });
  sSQ.defaultEndpointResolver = void 0;
  var wz6 = Hv(),
    mb1 = xT(),
    Lz6 = rSQ(),
    Oz6 = new mb1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    Mz6 = (A, Q = {}) => {
      return Oz6.get(A, () => (0, mb1.resolveEndpoint)(Lz6.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  sSQ.defaultEndpointResolver = Mz6;
  mb1.customEndpointFunctions.aws = wz6.awsEndpointFunctions
})
// @from(Ln 94195, Col 4)
ZxQ = U((BxQ) => {
  Object.defineProperty(BxQ, "__esModule", {
    value: !0
  });
  BxQ.getRuntimeConfig = void 0;
  var Rz6 = hY(),
    _z6 = eg(),
    jz6 = rG(),
    Tz6 = YC(),
    Pz6 = oM(),
    AxQ = loA(),
    QxQ = oG(),
    Sz6 = bb1(),
    xz6 = eSQ(),
    yz6 = (A) => {
      return {
        apiVersion: "2023-01-01",
        base64Decoder: A?.base64Decoder ?? AxQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? AxQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? xz6.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Sz6.defaultSigninHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Rz6.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new jz6.NoAuthSigner
        }],
        logger: A?.logger ?? new Tz6.NoOpLogger,
        protocol: A?.protocol ?? new _z6.AwsRestJsonProtocol({
          defaultNamespace: "com.amazonaws.signin"
        }),
        serviceId: A?.serviceId ?? "Signin",
        urlParser: A?.urlParser ?? Pz6.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? QxQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? QxQ.toUtf8
      }
    };
  BxQ.getRuntimeConfig = yz6
})
// @from(Ln 94239, Col 4)
KxQ = U((DxQ) => {
  Object.defineProperty(DxQ, "__esModule", {
    value: !0
  });
  DxQ.getRuntimeConfig = void 0;
  var vz6 = LZ(),
    kz6 = vz6.__importDefault(moA()),
    YxQ = hY(),
    JxQ = og(),
    UrA = RD(),
    bz6 = rg(),
    XxQ = RH(),
    q0A = _q(),
    IxQ = XL(),
    fz6 = sg(),
    hz6 = Uv(),
    gz6 = ZxQ(),
    uz6 = YC(),
    mz6 = Qu(),
    dz6 = YC(),
    cz6 = (A) => {
      (0, dz6.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, mz6.resolveDefaultsModeConfig)(A),
        B = () => Q().then(uz6.loadConfigsForDefaultMode),
        G = (0, gz6.getRuntimeConfig)(A);
      (0, YxQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, q0A.loadConfig)(YxQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? fz6.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, JxQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: kz6.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, q0A.loadConfig)(XxQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, q0A.loadConfig)(UrA.NODE_REGION_CONFIG_OPTIONS, {
          ...UrA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: IxQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, q0A.loadConfig)({
          ...XxQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || hz6.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? bz6.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? IxQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, q0A.loadConfig)(UrA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, q0A.loadConfig)(UrA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, q0A.loadConfig)(JxQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  DxQ.getRuntimeConfig = cz6
})
// @from(Ln 94299, Col 4)
bxQ = U((ab1) => {
  var VxQ = bg(),
    pz6 = fg(),
    lz6 = hg(),
    FxQ = $v(),
    iz6 = RD(),
    db1 = rG(),
    TYA = WX(),
    nz6 = ag(),
    TxQ = yT(),
    HxQ = RH(),
    An = YC(),
    ExQ = bb1(),
    az6 = KxQ(),
    zxQ = vT(),
    $xQ = aoA(),
    oz6 = (A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "signin"
      })
    },
    rz6 = {
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
    sz6 = (A) => {
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
    tz6 = (A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    },
    ez6 = (A, Q) => {
      let B = Object.assign(zxQ.getAwsRegionExtensionConfiguration(A), An.getDefaultExtensionConfiguration(A), $xQ.getHttpHandlerExtensionConfiguration(A), sz6(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, zxQ.resolveAwsRegionExtensionConfiguration(B), An.resolveDefaultRuntimeConfig(B), $xQ.resolveHttpHandlerRuntimeConfig(B), tz6(B))
    };
  class cb1 extends An.Client {
    config;
    constructor(...[A]) {
      let Q = az6.getRuntimeConfig(A || {});
      super(Q);
      this.initConfig = Q;
      let B = oz6(Q),
        G = FxQ.resolveUserAgentConfig(B),
        Z = HxQ.resolveRetryConfig(G),
        Y = iz6.resolveRegionConfig(Z),
        J = VxQ.resolveHostHeaderConfig(Y),
        X = TxQ.resolveEndpointConfig(J),
        I = ExQ.resolveHttpAuthSchemeConfig(X),
        D = ez6(I, A?.extensions || []);
      this.config = D, this.middlewareStack.use(TYA.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(FxQ.getUserAgentPlugin(this.config)), this.middlewareStack.use(HxQ.getRetryPlugin(this.config)), this.middlewareStack.use(nz6.getContentLengthPlugin(this.config)), this.middlewareStack.use(VxQ.getHostHeaderPlugin(this.config)), this.middlewareStack.use(pz6.getLoggerPlugin(this.config)), this.middlewareStack.use(lz6.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(db1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: ExQ.defaultSigninHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (W) => new db1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": W.credentials
        })
      })), this.middlewareStack.use(db1.getHttpSigningPlugin(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  var PYA = class A extends An.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    PxQ = class A extends PYA {
      name = "AccessDeniedException";
      $fault = "client";
      error;
      constructor(Q) {
        super({
          name: "AccessDeniedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error
      }
    },
    SxQ = class A extends PYA {
      name = "InternalServerException";
      $fault = "server";
      error;
      constructor(Q) {
        super({
          name: "InternalServerException",
          $fault: "server",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error
      }
    },
    xxQ = class A extends PYA {
      name = "TooManyRequestsError";
      $fault = "client";
      error;
      constructor(Q) {
        super({
          name: "TooManyRequestsError",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error
      }
    },
    yxQ = class A extends PYA {
      name = "ValidationException";
      $fault = "client";
      error;
      constructor(Q) {
        super({
          name: "ValidationException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error
      }
    },
    A$6 = "AccessDeniedException",
    Q$6 = "AccessToken",
    B$6 = "CreateOAuth2Token",
    G$6 = "CreateOAuth2TokenRequest",
    Z$6 = "CreateOAuth2TokenRequestBody",
    Y$6 = "CreateOAuth2TokenResponseBody",
    J$6 = "CreateOAuth2TokenResponse",
    X$6 = "InternalServerException",
    I$6 = "RefreshToken",
    D$6 = "TooManyRequestsError",
    W$6 = "ValidationException",
    CxQ = "accessKeyId",
    UxQ = "accessToken",
    pb1 = "client",
    qxQ = "clientId",
    NxQ = "codeVerifier",
    K$6 = "code",
    Qn = "error",
    wxQ = "expiresIn",
    LxQ = "grantType",
    V$6 = "http",
    lb1 = "httpError",
    OxQ = "idToken",
    KL = "jsonName",
    NrA = "message",
    qrA = "refreshToken",
    MxQ = "redirectUri",
    F$6 = "server",
    RxQ = "secretAccessKey",
    _xQ = "sessionToken",
    vxQ = "smithy.ts.sdk.synthetic.com.amazonaws.signin",
    H$6 = "tokenInput",
    E$6 = "tokenOutput",
    jxQ = "tokenType",
    JC = "com.amazonaws.signin",
    kxQ = [0, JC, I$6, 8, 0],
    z$6 = [-3, JC, A$6, {
        [Qn]: pb1
      },
      [Qn, NrA],
      [0, 0]
    ];
  TYA.TypeRegistry.for(JC).registerError(z$6, PxQ);
  var $$6 = [3, JC, Q$6, 8, [CxQ, RxQ, _xQ],
      [
        [0, {
          [KL]: CxQ
        }],
        [0, {
          [KL]: RxQ
        }],
        [0, {
          [KL]: _xQ
        }]
      ]
    ],
    C$6 = [3, JC, G$6, 0, [H$6],
      [
        [() => U$6, 16]
      ]
    ],
    U$6 = [3, JC, Z$6, 0, [qxQ, LxQ, K$6, MxQ, NxQ, qrA],
      [
        [0, {
          [KL]: qxQ
        }],
        [0, {
          [KL]: LxQ
        }], 0, [0, {
          [KL]: MxQ
        }],
        [0, {
          [KL]: NxQ
        }],
        [() => kxQ, {
          [KL]: qrA
        }]
      ]
    ],
    q$6 = [3, JC, J$6, 0, [E$6],
      [
        [() => N$6, 16]
      ]
    ],
    N$6 = [3, JC, Y$6, 0, [UxQ, jxQ, wxQ, qrA, OxQ],
      [
        [() => $$6, {
          [KL]: UxQ
        }],
        [0, {
          [KL]: jxQ
        }],
        [1, {
          [KL]: wxQ
        }],
        [() => kxQ, {
          [KL]: qrA
        }],
        [0, {
          [KL]: OxQ
        }]
      ]
    ],
    w$6 = [-3, JC, X$6, {
        [Qn]: F$6,
        [lb1]: 500
      },
      [Qn, NrA],
      [0, 0]
    ];
  TYA.TypeRegistry.for(JC).registerError(w$6, SxQ);
  var L$6 = [-3, JC, D$6, {
      [Qn]: pb1,
      [lb1]: 429
    },
    [Qn, NrA],
    [0, 0]
  ];
  TYA.TypeRegistry.for(JC).registerError(L$6, xxQ);
  var O$6 = [-3, JC, W$6, {
      [Qn]: pb1,
      [lb1]: 400
    },
    [Qn, NrA],
    [0, 0]
  ];
  TYA.TypeRegistry.for(JC).registerError(O$6, yxQ);
  var M$6 = [-3, vxQ, "SigninServiceException", 0, [],
    []
  ];
  TYA.TypeRegistry.for(vxQ).registerError(M$6, PYA);
  var R$6 = [9, JC, B$6, {
    [V$6]: ["POST", "/v1/token", 200]
  }, () => C$6, () => q$6];
  class ib1 extends An.Command.classBuilder().ep(rz6).m(function (A, Q, B, G) {
    return [TxQ.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(R$6).build() {}
  var _$6 = {
    CreateOAuth2TokenCommand: ib1
  };
  class nb1 extends cb1 {}
  An.createAggregatedClient(_$6, nb1);
  var j$6 = {
    AUTHCODE_EXPIRED: "AUTHCODE_EXPIRED",
    INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
    INVALID_REQUEST: "INVALID_REQUEST",
    SERVER_ERROR: "server_error",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    USER_CREDENTIALS_CHANGED: "USER_CREDENTIALS_CHANGED"
  };
  Object.defineProperty(ab1, "$Command", {
    enumerable: !0,
    get: function () {
      return An.Command
    }
  });
  Object.defineProperty(ab1, "__Client", {
    enumerable: !0,
    get: function () {
      return An.Client
    }
  });
  ab1.AccessDeniedException = PxQ;
  ab1.CreateOAuth2TokenCommand = ib1;
  ab1.InternalServerException = SxQ;
  ab1.OAuth2ErrorCode = j$6;
  ab1.Signin = nb1;
  ab1.SigninClient = cb1;
  ab1.SigninServiceException = PYA;
  ab1.TooManyRequestsError = xxQ;
  ab1.ValidationException = yxQ
})
// @from(Ln 94635, Col 4)
eb1 = U((d$6) => {
  var h$6 = Rq(),
    Bn = PW(),
    sb1 = Cv(),
    g$6 = bSQ(),
    wrA = NA("node:crypto"),
    ob1 = NA("node:fs"),
    u$6 = NA("node:os"),
    rb1 = NA("node:path");
  class tb1 {
    profileData;
    init;
    callerClientConfig;
    static REFRESH_THRESHOLD = 300000;
    constructor(A, Q, B) {
      this.profileData = A, this.init = Q, this.callerClientConfig = B
    }
    async loadCredentials() {
      let A = await this.loadToken();
      if (!A) throw new Bn.CredentialsProviderError(`Failed to load a token for session ${this.loginSession}, please re-authenticate using aws login`, {
        tryNextLink: !1,
        logger: this.logger
      });
      let Q = A.accessToken,
        B = Date.now();
      if (new Date(Q.expiresAt).getTime() - B <= tb1.REFRESH_THRESHOLD) return this.refresh(A);
      return {
        accessKeyId: Q.accessKeyId,
        secretAccessKey: Q.secretAccessKey,
        sessionToken: Q.sessionToken,
        accountId: Q.accountId,
        expiration: new Date(Q.expiresAt)
      }
    }
    get logger() {
      return this.init?.logger
    }
    get loginSession() {
      return this.profileData.login_session
    }
    async refresh(A) {
      let {
        SigninClient: Q,
        CreateOAuth2TokenCommand: B
      } = await Promise.resolve().then(() => c(bxQ())), {
        logger: G,
        userAgentAppId: Z
      } = this.callerClientConfig ?? {}, J = ((W) => {
        return W?.metadata?.handlerProtocol === "h2"
      })(this.callerClientConfig?.requestHandler) ? void 0 : this.callerClientConfig?.requestHandler, X = this.profileData.region ?? await this.callerClientConfig?.region?.() ?? process.env.AWS_REGION, I = new Q({
        credentials: {
          accessKeyId: "",
          secretAccessKey: ""
        },
        region: X,
        requestHandler: J,
        logger: G,
        userAgentAppId: Z,
        ...this.init?.clientConfig
      });
      this.createDPoPInterceptor(I.middlewareStack);
      let D = {
        tokenInput: {
          clientId: A.clientId,
          refreshToken: A.refreshToken,
          grantType: "refresh_token"
        }
      };
      try {
        let W = await I.send(new B(D)),
          {
            accessKeyId: K,
            secretAccessKey: V,
            sessionToken: F
          } = W.tokenOutput?.accessToken ?? {},
          {
            refreshToken: H,
            expiresIn: E
          } = W.tokenOutput ?? {};
        if (!K || !V || !F || !H) throw new Bn.CredentialsProviderError("Token refresh response missing required fields", {
          logger: this.logger,
          tryNextLink: !1
        });
        let z = (E ?? 900) * 1000,
          $ = new Date(Date.now() + z),
          O = {
            ...A,
            accessToken: {
              ...A.accessToken,
              accessKeyId: K,
              secretAccessKey: V,
              sessionToken: F,
              expiresAt: $.toISOString()
            },
            refreshToken: H
          };
        await this.saveToken(O);
        let L = O.accessToken;
        return {
          accessKeyId: L.accessKeyId,
          secretAccessKey: L.secretAccessKey,
          sessionToken: L.sessionToken,
          accountId: L.accountId,
          expiration: $
        }
      } catch (W) {
        if (W.name === "AccessDeniedException") {
          let K = W.error,
            V;
          switch (K) {
            case "TOKEN_EXPIRED":
              V = "Your session has expired. Please reauthenticate.";
              break;
            case "USER_CREDENTIALS_CHANGED":
              V = "Unable to refresh credentials because of a change in your password. Please reauthenticate with your new password.";
              break;
            case "INSUFFICIENT_PERMISSIONS":
              V = "Unable to refresh credentials due to insufficient permissions. You may be missing permission for the 'CreateOAuth2Token' action.";
              break;
            default:
              V = `Failed to refresh token: ${String(W)}. Please re-authenticate using \`aws login\``
          }
          throw new Bn.CredentialsProviderError(V, {
            logger: this.logger,
            tryNextLink: !1
          })
        }
        throw new Bn.CredentialsProviderError(`Failed to refresh token: ${String(W)}. Please re-authenticate using aws login`, {
          logger: this.logger
        })
      }
    }
    async loadToken() {
      let A = this.getTokenFilePath();
      try {
        let Q;
        try {
          Q = await sb1.readFile(A, {
            ignoreCache: this.init?.ignoreCache
          })
        } catch {
          Q = await ob1.promises.readFile(A, "utf8")
        }
        let B = JSON.parse(Q),
          G = ["accessToken", "clientId", "refreshToken", "dpopKey"].filter((Z) => !B[Z]);
        if (!B.accessToken?.accountId) G.push("accountId");
        if (G.length > 0) throw new Bn.CredentialsProviderError(`Token validation failed, missing fields: ${G.join(", ")}`, {
          logger: this.logger,
          tryNextLink: !1
        });
        return B
      } catch (Q) {
        throw new Bn.CredentialsProviderError(`Failed to load token from ${A}: ${String(Q)}`, {
          logger: this.logger,
          tryNextLink: !1
        })
      }
    }
    async saveToken(A) {
      let Q = this.getTokenFilePath(),
        B = rb1.dirname(Q);
      try {
        await ob1.promises.mkdir(B, {
          recursive: !0
        })
      } catch (G) {}
      await ob1.promises.writeFile(Q, JSON.stringify(A, null, 2), "utf8")
    }
    getTokenFilePath() {
      let A = process.env.AWS_LOGIN_CACHE_DIRECTORY ?? rb1.join(u$6.homedir(), ".aws", "login", "cache"),
        Q = Buffer.from(this.loginSession, "utf8"),
        B = wrA.createHash("sha256").update(Q).digest("hex");
      return rb1.join(A, `${B}.json`)
    }
    derToRawSignature(A) {
      let Q = 2;
      if (A[Q] !== 2) throw Error("Invalid DER signature");
      Q++;
      let B = A[Q++],
        G = A.subarray(Q, Q + B);
      if (Q += B, A[Q] !== 2) throw Error("Invalid DER signature");
      Q++;
      let Z = A[Q++],
        Y = A.subarray(Q, Q + Z);
      G = G[0] === 0 ? G.subarray(1) : G, Y = Y[0] === 0 ? Y.subarray(1) : Y;
      let J = Buffer.concat([Buffer.alloc(32 - G.length), G]),
        X = Buffer.concat([Buffer.alloc(32 - Y.length), Y]);
      return Buffer.concat([J, X])
    }
    createDPoPInterceptor(A) {
      A.add((Q) => async (B) => {
        if (g$6.HttpRequest.isInstance(B.request)) {
          let G = B.request,
            Z = `${G.protocol}//${G.hostname}${G.port?`:${G.port}`:""}${G.path}`,
            Y = await this.generateDpop(G.method, Z);
          G.headers = {
            ...G.headers,
            DPoP: Y
          }
        }
        return Q(B)
      }, {
        step: "finalizeRequest",
        name: "dpopInterceptor",
        override: !0
      })
    }
    async generateDpop(A = "POST", Q) {
      let B = await this.loadToken();
      try {
        let G = wrA.createPrivateKey({
            key: B.dpopKey,
            format: "pem",
            type: "sec1"
          }),
          Y = wrA.createPublicKey(G).export({
            format: "der",
            type: "spki"
          }),
          J = -1;
        for (let $ = 0; $ < Y.length; $++)
          if (Y[$] === 4) {
            J = $;
            break
          } let X = Y.slice(J + 1, J + 33),
          I = Y.slice(J + 33, J + 65),
          D = {
            alg: "ES256",
            typ: "dpop+jwt",
            jwk: {
              kty: "EC",
              crv: "P-256",
              x: X.toString("base64url"),
              y: I.toString("base64url")
            }
          },
          W = {
            jti: crypto.randomUUID(),
            htm: A,
            htu: Q,
            iat: Math.floor(Date.now() / 1000)
          },
          K = Buffer.from(JSON.stringify(D)).toString("base64url"),
          V = Buffer.from(JSON.stringify(W)).toString("base64url"),
          F = `${K}.${V}`,
          H = wrA.sign("sha256", Buffer.from(F), G),
          z = this.derToRawSignature(H).toString("base64url");
        return `${F}.${z}`
      } catch (G) {
        throw new Bn.CredentialsProviderError(`Failed to generate Dpop proof: ${G instanceof Error?G.message:String(G)}`, {
          logger: this.logger,
          tryNextLink: !1
        })
      }
    }
  }
  var m$6 = (A) => async ({
    callerClientConfig: Q
  } = {}) => {
    A?.logger?.debug?.("@aws-sdk/credential-providers - fromLoginCredentials");
    let B = await sb1.parseKnownFiles(A || {}),
      G = sb1.getProfileName({
        profile: A?.profile ?? Q?.profile
      }),
      Z = B[G];
    if (!Z?.login_session) throw new Bn.CredentialsProviderError(`Profile ${G} does not contain login_session.`, {
      tryNextLink: !0,
      logger: A?.logger
    });
    let J = await new tb1(Z, A, Q).loadCredentials();
    return h$6.setCredentialFeature(J, "CREDENTIALS_LOGIN", "AD")
  };
  d$6.fromLoginCredentials = m$6
})
// @from(Ln 94909, Col 4)
Qf1 = U((fxQ) => {
  Object.defineProperty(fxQ, "__esModule", {
    value: !0
  });
  fxQ.resolveHttpAuthSchemeConfig = fxQ.resolveStsAuthConfig = fxQ.defaultSTSHttpAuthSchemeProvider = fxQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var p$6 = hY(),
    Af1 = Jz(),
    l$6 = Bf1(),
    i$6 = async (A, Q, B) => {
      return {
        operation: (0, Af1.getSmithyContext)(Q).operation,
        region: await (0, Af1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  fxQ.defaultSTSHttpAuthSchemeParametersProvider = i$6;

  function n$6(A) {
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

  function a$6(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var o$6 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithWebIdentity": {
        Q.push(a$6(A));
        break
      }
      default:
        Q.push(n$6(A))
    }
    return Q
  };
  fxQ.defaultSTSHttpAuthSchemeProvider = o$6;
  var r$6 = (A) => Object.assign(A, {
    stsClientCtor: l$6.STSClient
  });
  fxQ.resolveStsAuthConfig = r$6;
  var s$6 = (A) => {
    let Q = fxQ.resolveStsAuthConfig(A),
      B = (0, p$6.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, Af1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  fxQ.resolveHttpAuthSchemeConfig = s$6
})
// @from(Ln 94974, Col 4)
Gf1 = U((uxQ) => {
  Object.defineProperty(uxQ, "__esModule", {
    value: !0
  });
  uxQ.commonParams = uxQ.resolveClientEndpointParameters = void 0;
  var AC6 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  uxQ.resolveClientEndpointParameters = AC6;
  uxQ.commonParams = {
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
// @from(Ln 95011, Col 4)
KyQ = U((DyQ) => {
  Object.defineProperty(DyQ, "__esModule", {
    value: !0
  });
  DyQ.ruleSet = void 0;
  var exQ = "required",
    l3 = "type",
    g7 = "fn",
    u7 = "argv",
    Zn = "ref",
    dxQ = !1,
    Zf1 = !0,
    Gn = "booleanEquals",
    jH = "stringEquals",
    AyQ = "sigv4",
    QyQ = "sts",
    ByQ = "us-east-1",
    KX = "endpoint",
    cxQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    wv = "tree",
    SYA = "error",
    Jf1 = "getAttr",
    pxQ = {
      [exQ]: !1,
      [l3]: "string"
    },
    Yf1 = {
      [exQ]: !0,
      default: !1,
      [l3]: "boolean"
    },
    GyQ = {
      [Zn]: "Endpoint"
    },
    lxQ = {
      [g7]: "isSet",
      [u7]: [{
        [Zn]: "Region"
      }]
    },
    TH = {
      [Zn]: "Region"
    },
    ixQ = {
      [g7]: "aws.partition",
      [u7]: [TH],
      assign: "PartitionResult"
    },
    ZyQ = {
      [Zn]: "UseFIPS"
    },
    YyQ = {
      [Zn]: "UseDualStack"
    },
    Kz = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: AyQ,
          signingName: QyQ,
          signingRegion: ByQ
        }]
      },
      headers: {}
    },
    VL = {},
    nxQ = {
      conditions: [{
        [g7]: jH,
        [u7]: [TH, "aws-global"]
      }],
      [KX]: Kz,
      [l3]: KX
    },
    JyQ = {
      [g7]: Gn,
      [u7]: [ZyQ, !0]
    },
    XyQ = {
      [g7]: Gn,
      [u7]: [YyQ, !0]
    },
    axQ = {
      [g7]: Jf1,
      [u7]: [{
        [Zn]: "PartitionResult"
      }, "supportsFIPS"]
    },
    IyQ = {
      [Zn]: "PartitionResult"
    },
    oxQ = {
      [g7]: Gn,
      [u7]: [!0, {
        [g7]: Jf1,
        [u7]: [IyQ, "supportsDualStack"]
      }]
    },
    rxQ = [{
      [g7]: "isSet",
      [u7]: [GyQ]
    }],
    sxQ = [JyQ],
    txQ = [XyQ],
    BC6 = {
      version: "1.0",
      parameters: {
        Region: pxQ,
        UseDualStack: Yf1,
        UseFIPS: Yf1,
        Endpoint: pxQ,
        UseGlobalEndpoint: Yf1
      },
      rules: [{
        conditions: [{
          [g7]: Gn,
          [u7]: [{
            [Zn]: "UseGlobalEndpoint"
          }, Zf1]
        }, {
          [g7]: "not",
          [u7]: rxQ
        }, lxQ, ixQ, {
          [g7]: Gn,
          [u7]: [ZyQ, dxQ]
        }, {
          [g7]: Gn,
          [u7]: [YyQ, dxQ]
        }],
        rules: [{
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "ap-northeast-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "ap-south-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "ap-southeast-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "ap-southeast-2"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, nxQ, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "ca-central-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "eu-central-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "eu-north-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "eu-west-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "eu-west-2"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "eu-west-3"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "sa-east-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, ByQ]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "us-east-2"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "us-west-1"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          conditions: [{
            [g7]: jH,
            [u7]: [TH, "us-west-2"]
          }],
          endpoint: Kz,
          [l3]: KX
        }, {
          endpoint: {
            url: cxQ,
            properties: {
              authSchemes: [{
                name: AyQ,
                signingName: QyQ,
                signingRegion: "{Region}"
              }]
            },
            headers: VL
          },
          [l3]: KX
        }],
        [l3]: wv
      }, {
        conditions: rxQ,
        rules: [{
          conditions: sxQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [l3]: SYA
        }, {
          conditions: txQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [l3]: SYA
        }, {
          endpoint: {
            url: GyQ,
            properties: VL,
            headers: VL
          },
          [l3]: KX
        }],
        [l3]: wv
      }, {
        conditions: [lxQ],
        rules: [{
          conditions: [ixQ],
          rules: [{
            conditions: [JyQ, XyQ],
            rules: [{
              conditions: [{
                [g7]: Gn,
                [u7]: [Zf1, axQ]
              }, oxQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: VL,
                  headers: VL
                },
                [l3]: KX
              }],
              [l3]: wv
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [l3]: SYA
            }],
            [l3]: wv
          }, {
            conditions: sxQ,
            rules: [{
              conditions: [{
                [g7]: Gn,
                [u7]: [axQ, Zf1]
              }],
              rules: [{
                conditions: [{
                  [g7]: jH,
                  [u7]: [{
                    [g7]: Jf1,
                    [u7]: [IyQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: VL,
                  headers: VL
                },
                [l3]: KX
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: VL,
                  headers: VL
                },
                [l3]: KX
              }],
              [l3]: wv
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [l3]: SYA
            }],
            [l3]: wv
          }, {
            conditions: txQ,
            rules: [{
              conditions: [oxQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: VL,
                  headers: VL
                },
                [l3]: KX
              }],
              [l3]: wv
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [l3]: SYA
            }],
            [l3]: wv
          }, nxQ, {
            endpoint: {
              url: cxQ,
              properties: VL,
              headers: VL
            },
            [l3]: KX
          }],
          [l3]: wv
        }],
        [l3]: wv
      }, {
        error: "Invalid Configuration: Missing Region",
        [l3]: SYA
      }]
    };
  DyQ.ruleSet = BC6
})
// @from(Ln 95375, Col 4)
HyQ = U((VyQ) => {
  Object.defineProperty(VyQ, "__esModule", {
    value: !0
  });
  VyQ.defaultEndpointResolver = void 0;
  var GC6 = Hv(),
    Xf1 = xT(),
    ZC6 = KyQ(),
    YC6 = new Xf1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    JC6 = (A, Q = {}) => {
      return YC6.get(A, () => (0, Xf1.resolveEndpoint)(ZC6.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  VyQ.defaultEndpointResolver = JC6;
  Xf1.customEndpointFunctions.aws = GC6.awsEndpointFunctions
})
// @from(Ln 95396, Col 4)
UyQ = U(($yQ) => {
  Object.defineProperty($yQ, "__esModule", {
    value: !0
  });
  $yQ.getRuntimeConfig = void 0;
  var XC6 = hY(),
    IC6 = eg(),
    DC6 = rG(),
    WC6 = YC(),
    KC6 = oM(),
    EyQ = loA(),
    zyQ = oG(),
    VC6 = Qf1(),
    FC6 = HyQ(),
    HC6 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? EyQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? EyQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? FC6.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? VC6.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new XC6.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new DC6.NoAuthSigner
        }],
        logger: A?.logger ?? new WC6.NoOpLogger,
        protocol: A?.protocol ?? new IC6.AwsQueryProtocol({
          defaultNamespace: "com.amazonaws.sts",
          xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
          version: "2011-06-15"
        }),
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? KC6.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? zyQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? zyQ.toUtf8
      }
    };
  $yQ.getRuntimeConfig = HC6
})
// @from(Ln 95442, Col 4)
MyQ = U((LyQ) => {
  Object.defineProperty(LyQ, "__esModule", {
    value: !0
  });
  LyQ.getRuntimeConfig = void 0;
  var EC6 = LZ(),
    zC6 = EC6.__importDefault(moA()),
    If1 = hY(),
    qyQ = og(),
    LrA = RD(),
    $C6 = rG(),
    CC6 = rg(),
    NyQ = RH(),
    N0A = _q(),
    wyQ = XL(),
    UC6 = sg(),
    qC6 = Uv(),
    NC6 = UyQ(),
    wC6 = YC(),
    LC6 = Qu(),
    OC6 = YC(),
    MC6 = (A) => {
      (0, OC6.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, LC6.resolveDefaultsModeConfig)(A),
        B = () => Q().then(wC6.loadConfigsForDefaultMode),
        G = (0, NC6.getRuntimeConfig)(A);
      (0, If1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, N0A.loadConfig)(If1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? UC6.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, qyQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: zC6.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Y) => Y.getIdentityProvider("aws.auth#sigv4") || (async (J) => await A.credentialDefaultProvider(J?.__config || {})()),
          signer: new If1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Y) => Y.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new $C6.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, N0A.loadConfig)(NyQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, N0A.loadConfig)(LrA.NODE_REGION_CONFIG_OPTIONS, {
          ...LrA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: wyQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, N0A.loadConfig)({
          ...NyQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || qC6.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? CC6.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? wyQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, N0A.loadConfig)(LrA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, N0A.loadConfig)(LrA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, N0A.loadConfig)(qyQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  LyQ.getRuntimeConfig = MC6
})
// @from(Ln 95512, Col 4)
jyQ = U((RyQ) => {
  Object.defineProperty(RyQ, "__esModule", {
    value: !0
  });
  RyQ.resolveHttpAuthRuntimeConfig = RyQ.getHttpAuthExtensionConfiguration = void 0;
  var RC6 = (A) => {
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
  };
  RyQ.getHttpAuthExtensionConfiguration = RC6;
  var _C6 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  RyQ.resolveHttpAuthRuntimeConfig = _C6
})
// @from(Ln 95556, Col 4)
kyQ = U((yyQ) => {
  Object.defineProperty(yyQ, "__esModule", {
    value: !0
  });
  yyQ.resolveRuntimeExtensions = void 0;
  var TyQ = vT(),
    PyQ = aoA(),
    SyQ = YC(),
    xyQ = jyQ(),
    TC6 = (A, Q) => {
      let B = Object.assign((0, TyQ.getAwsRegionExtensionConfiguration)(A), (0, SyQ.getDefaultExtensionConfiguration)(A), (0, PyQ.getHttpHandlerExtensionConfiguration)(A), (0, xyQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, TyQ.resolveAwsRegionExtensionConfiguration)(B), (0, SyQ.resolveDefaultRuntimeConfig)(B), (0, PyQ.resolveHttpHandlerRuntimeConfig)(B), (0, xyQ.resolveHttpAuthRuntimeConfig)(B))
    };
  yyQ.resolveRuntimeExtensions = TC6
})
// @from(Ln 95571, Col 4)
Bf1 = U((Wf1) => {
  Object.defineProperty(Wf1, "__esModule", {
    value: !0
  });
  Wf1.STSClient = Wf1.__Client = void 0;
  var byQ = bg(),
    PC6 = fg(),
    SC6 = hg(),
    fyQ = $v(),
    xC6 = RD(),
    Df1 = rG(),
    yC6 = WX(),
    vC6 = ag(),
    kC6 = yT(),
    hyQ = RH(),
    uyQ = YC();
  Object.defineProperty(Wf1, "__Client", {
    enumerable: !0,
    get: function () {
      return uyQ.Client
    }
  });
  var gyQ = Qf1(),
    bC6 = Gf1(),
    fC6 = MyQ(),
    hC6 = kyQ();
  class myQ extends uyQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, fC6.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, bC6.resolveClientEndpointParameters)(Q),
        G = (0, fyQ.resolveUserAgentConfig)(B),
        Z = (0, hyQ.resolveRetryConfig)(G),
        Y = (0, xC6.resolveRegionConfig)(Z),
        J = (0, byQ.resolveHostHeaderConfig)(Y),
        X = (0, kC6.resolveEndpointConfig)(J),
        I = (0, gyQ.resolveHttpAuthSchemeConfig)(X),
        D = (0, hC6.resolveRuntimeExtensions)(I, A?.extensions || []);
      this.config = D, this.middlewareStack.use((0, yC6.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, fyQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, hyQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, vC6.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, byQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, PC6.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, SC6.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Df1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: gyQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (W) => new Df1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": W.credentials
        })
      })), this.middlewareStack.use((0, Df1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  Wf1.STSClient = myQ
})