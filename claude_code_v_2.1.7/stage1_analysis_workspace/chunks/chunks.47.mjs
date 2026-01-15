
// @from(Ln 122915, Col 4)
CQA = U((eJA) => {
  var _eQ = Ev(),
    Gl1 = Mq(),
    Al1 = tp1(),
    KL3 = WX(),
    MeQ = Oq();
  class jeQ {
    config;
    middlewareStack = _eQ.constructStack();
    initConfig;
    handlers;
    constructor(A) {
      this.config = A
    }
    send(A, Q, B) {
      let G = typeof Q !== "function" ? Q : void 0,
        Z = typeof Q === "function" ? Q : B,
        Y = G === void 0 && this.config.cacheMiddleware === !0,
        J;
      if (Y) {
        if (!this.handlers) this.handlers = new WeakMap;
        let X = this.handlers;
        if (X.has(A.constructor)) J = X.get(A.constructor);
        else J = A.resolveMiddleware(this.middlewareStack, this.config, G), X.set(A.constructor, J)
      } else delete this.handlers, J = A.resolveMiddleware(this.middlewareStack, this.config, G);
      if (Z) J(A).then((X) => Z(null, X.output), (X) => Z(X)).catch(() => {});
      else return J(A).then((X) => X.output)
    }
    destroy() {
      this.config?.requestHandler?.destroy?.(), delete this.handlers
    }
  }
  var ep1 = "***SensitiveInformation***";

  function Ql1(A, Q) {
    if (Q == null) return Q;
    let B = KL3.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return ep1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return ep1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return ep1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = Ql1(J, G[Y]);
      return Z
    }
    return Q
  }
  class Zl1 {
    middlewareStack = _eQ.constructStack();
    schema;
    static classBuilder() {
      return new TeQ
    }
    resolveMiddlewareWithContext(A, Q, B, {
      middlewareFn: G,
      clientName: Z,
      commandName: Y,
      inputFilterSensitiveLog: J,
      outputFilterSensitiveLog: X,
      smithyContext: I,
      additionalContext: D,
      CommandCtor: W
    }) {
      for (let E of G.bind(this)(W, A, Q, B)) this.middlewareStack.use(E);
      let K = A.concat(this.middlewareStack),
        {
          logger: V
        } = Q,
        F = {
          logger: V,
          clientName: Z,
          commandName: Y,
          inputFilterSensitiveLog: J,
          outputFilterSensitiveLog: X,
          [Al1.SMITHY_CONTEXT_KEY]: {
            commandInstance: this,
            ...I
          },
          ...D
        },
        {
          requestHandler: H
        } = Q;
      return K.resolve((E) => H.handle(E.request, B || {}), F)
    }
  }
  class TeQ {
    _init = () => {};
    _ep = {};
    _middlewareFn = () => [];
    _commandName = "";
    _clientName = "";
    _additionalContext = {};
    _smithyContext = {};
    _inputFilterSensitiveLog = void 0;
    _outputFilterSensitiveLog = void 0;
    _serializer = null;
    _deserializer = null;
    _operationSchema;
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
      return Q = class extends Zl1 {
        input;
        static getEndpointParameterInstructions() {
          return A._ep
        }
        constructor(...[B]) {
          super();
          this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
        }
        resolveMiddleware(B, G, Z) {
          let Y = A._operationSchema,
            J = Y?.[4] ?? Y?.input,
            X = Y?.[5] ?? Y?.output;
          return this.resolveMiddlewareWithContext(B, G, Z, {
            CommandCtor: Q,
            middlewareFn: A._middlewareFn,
            clientName: A._clientName,
            commandName: A._commandName,
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? Ql1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? Ql1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var VL3 = "***SensitiveInformation***",
    FL3 = (A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = async function (J, X, I) {
            let D = new G(J);
            if (typeof X === "function") this.send(D, X);
            else if (typeof I === "function") {
              if (typeof X !== "object") throw Error(`Expected http options but got ${typeof X}`);
              this.send(D, X || {}, I)
            } else return this.send(D, X)
          }, Y = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[Y] = Z
      }
    };
  class tJA extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(A) {
      super(A.message);
      Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return tJA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === tJA) return tJA.isInstance(A);
      if (tJA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var PeQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    SeQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = EL3(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw PeQ(J, Q)
    },
    HL3 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        SeQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    EL3 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    zL3 = (A) => {
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
    },
    ReQ = !1,
    $L3 = (A) => {
      if (A && !ReQ && parseInt(A.substring(1, A.indexOf("."))) < 16) ReQ = !0
    },
    CL3 = (A) => {
      let Q = [];
      for (let B in Al1.AlgorithmId) {
        let G = Al1.AlgorithmId[B];
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
    },
    UL3 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    qL3 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    NL3 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    xeQ = (A) => {
      return Object.assign(CL3(A), qL3(A))
    },
    wL3 = xeQ,
    LL3 = (A) => {
      return Object.assign(UL3(A), NL3(A))
    },
    OL3 = (A) => Array.isArray(A) ? A : [A],
    yeQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = yeQ(A[B]);
      return A
    },
    ML3 = (A) => {
      return A != null
    };
  class veQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function keQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, jL3(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      beQ(G, null, Y, J)
    }
    return G
  }
  var RL3 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    _L3 = (A, Q) => {
      let B = {};
      for (let G in Q) beQ(B, A, Q, G);
      return B
    },
    jL3 = (A, Q, B) => {
      return keQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    beQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = TL3, I = PL3, D = G] = J;
        if (typeof X === "function" && X(Q[D]) || typeof X !== "function" && !!X) A[G] = I(Q[D]);
        return
      }
      let [Z, Y] = B[G];
      if (typeof Y === "function") {
        let J, X = Z === void 0 && (J = Y()) != null,
          I = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (X) A[G] = J;
        else if (I) A[G] = Y()
      } else {
        let J = Z === void 0 && Y != null,
          X = typeof Z === "function" && !!Z(Y) || typeof Z !== "function" && !!Z;
        if (J || X) A[G] = Y
      }
    },
    TL3 = (A) => A != null,
    PL3 = (A) => A,
    SL3 = (A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    },
    xL3 = (A) => A.toISOString().replace(".000Z", "Z"),
    Bl1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(Bl1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = Bl1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(eJA, "collectBody", {
    enumerable: !0,
    get: function () {
      return Gl1.collectBody
    }
  });
  Object.defineProperty(eJA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return Gl1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(eJA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return Gl1.resolvedPath
    }
  });
  eJA.Client = jeQ;
  eJA.Command = Zl1;
  eJA.NoOpLogger = veQ;
  eJA.SENSITIVE_STRING = VL3;
  eJA.ServiceException = tJA;
  eJA._json = Bl1;
  eJA.convertMap = RL3;
  eJA.createAggregatedClient = FL3;
  eJA.decorateServiceException = PeQ;
  eJA.emitWarningIfUnsupportedVersion = $L3;
  eJA.getArrayIfSingleItem = OL3;
  eJA.getDefaultClientConfiguration = wL3;
  eJA.getDefaultExtensionConfiguration = xeQ;
  eJA.getValueFromTextNode = yeQ;
  eJA.isSerializableHeaderValue = ML3;
  eJA.loadConfigsForDefaultMode = zL3;
  eJA.map = keQ;
  eJA.resolveDefaultRuntimeConfig = LL3;
  eJA.serializeDateTime = xL3;
  eJA.serializeFloat = SL3;
  eJA.take = _L3;
  eJA.throwDefaultError = SeQ;
  eJA.withBaseException = HL3;
  Object.keys(MeQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(eJA, A)) Object.defineProperty(eJA, A, {
      enumerable: !0,
      get: function () {
        return MeQ[A]
      }
    })
  })
})
// @from(Ln 123385, Col 4)
Jl1 = U((heQ) => {
  Object.defineProperty(heQ, "__esModule", {
    value: !0
  });
  heQ.resolveHttpAuthSchemeConfig = heQ.resolveStsAuthConfig = heQ.defaultSTSHttpAuthSchemeProvider = heQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var BO3 = hY(),
    Yl1 = Jz(),
    GO3 = Xl1(),
    ZO3 = async (A, Q, B) => {
      return {
        operation: (0, Yl1.getSmithyContext)(Q).operation,
        region: await (0, Yl1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  heQ.defaultSTSHttpAuthSchemeParametersProvider = ZO3;

  function YO3(A) {
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

  function feQ(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var JO3 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithSAML": {
        Q.push(feQ(A));
        break
      }
      case "AssumeRoleWithWebIdentity": {
        Q.push(feQ(A));
        break
      }
      default:
        Q.push(YO3(A))
    }
    return Q
  };
  heQ.defaultSTSHttpAuthSchemeProvider = JO3;
  var XO3 = (A) => Object.assign(A, {
    stsClientCtor: GO3.STSClient
  });
  heQ.resolveStsAuthConfig = XO3;
  var IO3 = (A) => {
    let Q = heQ.resolveStsAuthConfig(A),
      B = (0, BO3.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, Yl1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  heQ.resolveHttpAuthSchemeConfig = IO3
})
// @from(Ln 123454, Col 4)
Il1 = U((meQ) => {
  Object.defineProperty(meQ, "__esModule", {
    value: !0
  });
  meQ.commonParams = meQ.resolveClientEndpointParameters = void 0;
  var KO3 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  meQ.resolveClientEndpointParameters = KO3;
  meQ.commonParams = {
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
// @from(Ln 123491, Col 4)
ceQ = U((JKG, FO3) => {
  FO3.exports = {
    name: "@aws-sdk/client-sts",
    description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
    version: "3.936.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-sts",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "rimraf ./dist-types tsconfig.types.tsbuildinfo && tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
      test: "yarn g:vitest run",
      "test:watch": "yarn g:vitest watch"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.936.0",
      "@aws-sdk/credential-provider-node": "3.936.0",
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
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-sts"
    }
  }
})
// @from(Ln 123590, Col 4)
peQ = U((EO3) => {
  var HO3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  EO3.isArrayBuffer = HO3
})
// @from(Ln 123594, Col 4)
Wl1 = U((qO3) => {
  var $O3 = peQ(),
    Dl1 = NA("buffer"),
    CO3 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!$O3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Dl1.Buffer.from(A, Q, B)
    },
    UO3 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Dl1.Buffer.from(A, Q) : Dl1.Buffer.from(A)
    };
  qO3.fromArrayBuffer = CO3;
  qO3.fromString = UO3
})
// @from(Ln 123608, Col 4)
neQ = U((leQ) => {
  Object.defineProperty(leQ, "__esModule", {
    value: !0
  });
  leQ.fromBase64 = void 0;
  var LO3 = Wl1(),
    OO3 = /^[A-Za-z0-9+/]*={0,2}$/,
    MO3 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!OO3.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, LO3.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  leQ.fromBase64 = MO3
})
// @from(Ln 123623, Col 4)
reQ = U((aeQ) => {
  Object.defineProperty(aeQ, "__esModule", {
    value: !0
  });
  aeQ.toBase64 = void 0;
  var RO3 = Wl1(),
    _O3 = oG(),
    jO3 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, _O3.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, RO3.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  aeQ.toBase64 = jO3
})
// @from(Ln 123639, Col 4)
eeQ = U((jOA) => {
  var seQ = neQ(),
    teQ = reQ();
  Object.keys(seQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(jOA, A)) Object.defineProperty(jOA, A, {
      enumerable: !0,
      get: function () {
        return seQ[A]
      }
    })
  });
  Object.keys(teQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(jOA, A)) Object.defineProperty(jOA, A, {
      enumerable: !0,
      get: function () {
        return teQ[A]
      }
    })
  })
})
// @from(Ln 123659, Col 4)
LAB = U((NAB) => {
  Object.defineProperty(NAB, "__esModule", {
    value: !0
  });
  NAB.ruleSet = void 0;
  var KAB = "required",
    a3 = "type",
    m7 = "fn",
    d7 = "argv",
    ln = "ref",
    AAB = !1,
    Kl1 = !0,
    pn = "booleanEquals",
    yH = "stringEquals",
    VAB = "sigv4",
    FAB = "sts",
    HAB = "us-east-1",
    EX = "endpoint",
    QAB = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    Ak = "tree",
    AXA = "error",
    Fl1 = "getAttr",
    BAB = {
      [KAB]: !1,
      [a3]: "string"
    },
    Vl1 = {
      [KAB]: !0,
      default: !1,
      [a3]: "boolean"
    },
    EAB = {
      [ln]: "Endpoint"
    },
    GAB = {
      [m7]: "isSet",
      [d7]: [{
        [ln]: "Region"
      }]
    },
    vH = {
      [ln]: "Region"
    },
    ZAB = {
      [m7]: "aws.partition",
      [d7]: [vH],
      assign: "PartitionResult"
    },
    zAB = {
      [ln]: "UseFIPS"
    },
    $AB = {
      [ln]: "UseDualStack"
    },
    Nz = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: VAB,
          signingName: FAB,
          signingRegion: HAB
        }]
      },
      headers: {}
    },
    ML = {},
    YAB = {
      conditions: [{
        [m7]: yH,
        [d7]: [vH, "aws-global"]
      }],
      [EX]: Nz,
      [a3]: EX
    },
    CAB = {
      [m7]: pn,
      [d7]: [zAB, !0]
    },
    UAB = {
      [m7]: pn,
      [d7]: [$AB, !0]
    },
    JAB = {
      [m7]: Fl1,
      [d7]: [{
        [ln]: "PartitionResult"
      }, "supportsFIPS"]
    },
    qAB = {
      [ln]: "PartitionResult"
    },
    XAB = {
      [m7]: pn,
      [d7]: [!0, {
        [m7]: Fl1,
        [d7]: [qAB, "supportsDualStack"]
      }]
    },
    IAB = [{
      [m7]: "isSet",
      [d7]: [EAB]
    }],
    DAB = [CAB],
    WAB = [UAB],
    TO3 = {
      version: "1.0",
      parameters: {
        Region: BAB,
        UseDualStack: Vl1,
        UseFIPS: Vl1,
        Endpoint: BAB,
        UseGlobalEndpoint: Vl1
      },
      rules: [{
        conditions: [{
          [m7]: pn,
          [d7]: [{
            [ln]: "UseGlobalEndpoint"
          }, Kl1]
        }, {
          [m7]: "not",
          [d7]: IAB
        }, GAB, ZAB, {
          [m7]: pn,
          [d7]: [zAB, AAB]
        }, {
          [m7]: pn,
          [d7]: [$AB, AAB]
        }],
        rules: [{
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "ap-northeast-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "ap-south-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "ap-southeast-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "ap-southeast-2"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, YAB, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "ca-central-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "eu-central-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "eu-north-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "eu-west-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "eu-west-2"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "eu-west-3"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "sa-east-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, HAB]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "us-east-2"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "us-west-1"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          conditions: [{
            [m7]: yH,
            [d7]: [vH, "us-west-2"]
          }],
          endpoint: Nz,
          [a3]: EX
        }, {
          endpoint: {
            url: QAB,
            properties: {
              authSchemes: [{
                name: VAB,
                signingName: FAB,
                signingRegion: "{Region}"
              }]
            },
            headers: ML
          },
          [a3]: EX
        }],
        [a3]: Ak
      }, {
        conditions: IAB,
        rules: [{
          conditions: DAB,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [a3]: AXA
        }, {
          conditions: WAB,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [a3]: AXA
        }, {
          endpoint: {
            url: EAB,
            properties: ML,
            headers: ML
          },
          [a3]: EX
        }],
        [a3]: Ak
      }, {
        conditions: [GAB],
        rules: [{
          conditions: [ZAB],
          rules: [{
            conditions: [CAB, UAB],
            rules: [{
              conditions: [{
                [m7]: pn,
                [d7]: [Kl1, JAB]
              }, XAB],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: ML,
                  headers: ML
                },
                [a3]: EX
              }],
              [a3]: Ak
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [a3]: AXA
            }],
            [a3]: Ak
          }, {
            conditions: DAB,
            rules: [{
              conditions: [{
                [m7]: pn,
                [d7]: [JAB, Kl1]
              }],
              rules: [{
                conditions: [{
                  [m7]: yH,
                  [d7]: [{
                    [m7]: Fl1,
                    [d7]: [qAB, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: ML,
                  headers: ML
                },
                [a3]: EX
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: ML,
                  headers: ML
                },
                [a3]: EX
              }],
              [a3]: Ak
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [a3]: AXA
            }],
            [a3]: Ak
          }, {
            conditions: WAB,
            rules: [{
              conditions: [XAB],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: ML,
                  headers: ML
                },
                [a3]: EX
              }],
              [a3]: Ak
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [a3]: AXA
            }],
            [a3]: Ak
          }, YAB, {
            endpoint: {
              url: QAB,
              properties: ML,
              headers: ML
            },
            [a3]: EX
          }],
          [a3]: Ak
        }],
        [a3]: Ak
      }, {
        error: "Invalid Configuration: Missing Region",
        [a3]: AXA
      }]
    };
  NAB.ruleSet = TO3
})
// @from(Ln 124023, Col 4)
RAB = U((OAB) => {
  Object.defineProperty(OAB, "__esModule", {
    value: !0
  });
  OAB.defaultEndpointResolver = void 0;
  var PO3 = Hv(),
    Hl1 = xT(),
    SO3 = LAB(),
    xO3 = new Hl1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    yO3 = (A, Q = {}) => {
      return xO3.get(A, () => (0, Hl1.resolveEndpoint)(SO3.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  OAB.defaultEndpointResolver = yO3;
  Hl1.customEndpointFunctions.aws = PO3.awsEndpointFunctions
})
// @from(Ln 124044, Col 4)
SAB = U((TAB) => {
  Object.defineProperty(TAB, "__esModule", {
    value: !0
  });
  TAB.getRuntimeConfig = void 0;
  var vO3 = hY(),
    kO3 = eg(),
    bO3 = rG(),
    fO3 = CQA(),
    hO3 = oM(),
    _AB = eeQ(),
    jAB = oG(),
    gO3 = Jl1(),
    uO3 = RAB(),
    mO3 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? _AB.fromBase64,
        base64Encoder: A?.base64Encoder ?? _AB.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? uO3.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? gO3.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new vO3.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new bO3.NoAuthSigner
        }],
        logger: A?.logger ?? new fO3.NoOpLogger,
        protocol: A?.protocol ?? new kO3.AwsQueryProtocol({
          defaultNamespace: "com.amazonaws.sts",
          xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
          version: "2011-06-15"
        }),
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? hO3.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? jAB.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? jAB.toUtf8
      }
    };
  TAB.getRuntimeConfig = mO3
})
// @from(Ln 124090, Col 4)
hAB = U((bAB) => {
  Object.defineProperty(bAB, "__esModule", {
    value: !0
  });
  bAB.getRuntimeConfig = void 0;
  var dO3 = LZ(),
    cO3 = dO3.__importDefault(ceQ()),
    El1 = hY(),
    xAB = _0A(),
    yAB = og(),
    FA1 = RD(),
    pO3 = rG(),
    lO3 = rg(),
    vAB = RH(),
    UQA = _q(),
    kAB = XL(),
    iO3 = sg(),
    nO3 = Uv(),
    aO3 = SAB(),
    oO3 = CQA(),
    rO3 = Qu(),
    sO3 = CQA(),
    tO3 = (A) => {
      (0, sO3.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, rO3.resolveDefaultsModeConfig)(A),
        B = () => Q().then(oO3.loadConfigsForDefaultMode),
        G = (0, aO3.getRuntimeConfig)(A);
      (0, El1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, UQA.loadConfig)(El1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? iO3.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? xAB.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, yAB.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: cO3.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Y) => Y.getIdentityProvider("aws.auth#sigv4") || (async (J) => await (0, xAB.defaultProvider)(J?.__config || {})()),
          signer: new El1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Y) => Y.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new pO3.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, UQA.loadConfig)(vAB.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, UQA.loadConfig)(FA1.NODE_REGION_CONFIG_OPTIONS, {
          ...FA1.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: kAB.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, UQA.loadConfig)({
          ...vAB.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || nO3.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? lO3.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? kAB.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, UQA.loadConfig)(FA1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, UQA.loadConfig)(FA1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, UQA.loadConfig)(yAB.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  bAB.getRuntimeConfig = tO3
})
// @from(Ln 124162, Col 4)
dAB = U((ZM3) => {
  var eO3 = tp1(),
    AM3 = (A) => {
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
    QM3 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class gAB {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = eO3.FieldPosition.HEADER,
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
  class uAB {
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
  class HA1 {
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
      let Q = new HA1({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = BM3(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return HA1.clone(this)
    }
  }

  function BM3(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class mAB {
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

  function GM3(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  ZM3.Field = gAB;
  ZM3.Fields = uAB;
  ZM3.HttpRequest = HA1;
  ZM3.HttpResponse = mAB;
  ZM3.getHttpHandlerExtensionConfiguration = AM3;
  ZM3.isValidHostname = GM3;
  ZM3.resolveHttpHandlerRuntimeConfig = QM3
})
// @from(Ln 124304, Col 4)
lAB = U((cAB) => {
  Object.defineProperty(cAB, "__esModule", {
    value: !0
  });
  cAB.resolveHttpAuthRuntimeConfig = cAB.getHttpAuthExtensionConfiguration = void 0;
  var VM3 = (A) => {
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
  cAB.getHttpAuthExtensionConfiguration = VM3;
  var FM3 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  cAB.resolveHttpAuthRuntimeConfig = FM3
})
// @from(Ln 124348, Col 4)
tAB = U((rAB) => {
  Object.defineProperty(rAB, "__esModule", {
    value: !0
  });
  rAB.resolveRuntimeExtensions = void 0;
  var iAB = vT(),
    nAB = dAB(),
    aAB = CQA(),
    oAB = lAB(),
    EM3 = (A, Q) => {
      let B = Object.assign((0, iAB.getAwsRegionExtensionConfiguration)(A), (0, aAB.getDefaultExtensionConfiguration)(A), (0, nAB.getHttpHandlerExtensionConfiguration)(A), (0, oAB.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, iAB.resolveAwsRegionExtensionConfiguration)(B), (0, aAB.resolveDefaultRuntimeConfig)(B), (0, nAB.resolveHttpHandlerRuntimeConfig)(B), (0, oAB.resolveHttpAuthRuntimeConfig)(B))
    };
  rAB.resolveRuntimeExtensions = EM3
})
// @from(Ln 124363, Col 4)
Xl1 = U(($l1) => {
  Object.defineProperty($l1, "__esModule", {
    value: !0
  });
  $l1.STSClient = $l1.__Client = void 0;
  var eAB = bg(),
    zM3 = fg(),
    $M3 = hg(),
    A1B = $v(),
    CM3 = RD(),
    zl1 = rG(),
    UM3 = WX(),
    qM3 = ag(),
    NM3 = yT(),
    Q1B = RH(),
    G1B = CQA();
  Object.defineProperty($l1, "__Client", {
    enumerable: !0,
    get: function () {
      return G1B.Client
    }
  });
  var B1B = Jl1(),
    wM3 = Il1(),
    LM3 = hAB(),
    OM3 = tAB();
  class Z1B extends G1B.Client {
    config;
    constructor(...[A]) {
      let Q = (0, LM3.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, wM3.resolveClientEndpointParameters)(Q),
        G = (0, A1B.resolveUserAgentConfig)(B),
        Z = (0, Q1B.resolveRetryConfig)(G),
        Y = (0, CM3.resolveRegionConfig)(Z),
        J = (0, eAB.resolveHostHeaderConfig)(Y),
        X = (0, NM3.resolveEndpointConfig)(J),
        I = (0, B1B.resolveHttpAuthSchemeConfig)(X),
        D = (0, OM3.resolveRuntimeExtensions)(I, A?.extensions || []);
      this.config = D, this.middlewareStack.use((0, UM3.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, A1B.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, Q1B.getRetryPlugin)(this.config)), this.middlewareStack.use((0, qM3.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, eAB.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, zM3.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, $M3.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, zl1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: B1B.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (W) => new zl1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": W.credentials
        })
      })), this.middlewareStack.use((0, zl1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  $l1.STSClient = Z1B
})
// @from(Ln 124416, Col 4)
v1B = U((EA1) => {
  var TOA = Xl1(),
    dq = CQA(),
    AP = yT(),
    QP = Il1(),
    RL = WX(),
    Cl1 = Rq(),
    MM3 = vT(),
    cq = class A extends dq.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    J1B = class A extends cq {
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
    X1B = class A extends cq {
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
    I1B = class A extends cq {
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
    D1B = class A extends cq {
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
    W1B = class A extends cq {
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
    K1B = class A extends cq {
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
    V1B = class A extends cq {
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
    F1B = class A extends cq {
      name = "InvalidAuthorizationMessageException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidAuthorizationMessageException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    H1B = class A extends cq {
      name = "ExpiredTradeInTokenException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ExpiredTradeInTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    E1B = class A extends cq {
      name = "JWTPayloadSizeExceededException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "JWTPayloadSizeExceededException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    z1B = class A extends cq {
      name = "OutboundWebIdentityFederationDisabledException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "OutboundWebIdentityFederationDisabledException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    $1B = class A extends cq {
      name = "SessionDurationEscalationException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "SessionDurationEscalationException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    Ul1 = "Arn",
    C1B = "AccessKeyId",
    RM3 = "AssumedPrincipal",
    _M3 = "AssumeRole",
    jM3 = "AssumedRoleId",
    TM3 = "AssumeRoleRequest",
    PM3 = "AssumeRoleResponse",
    SM3 = "AssumeRootRequest",
    xM3 = "AssumeRootResponse",
    zA1 = "AssumedRoleUser",
    yM3 = "AssumeRoleWithSAML",
    vM3 = "AssumeRoleWithSAMLRequest",
    kM3 = "AssumeRoleWithSAMLResponse",
    bM3 = "AssumeRoleWithWebIdentity",
    fM3 = "AssumeRoleWithWebIdentityRequest",
    hM3 = "AssumeRoleWithWebIdentityResponse",
    gM3 = "AssumeRoot",
    U1B = "Account",
    ql1 = "Audience",
    nn = "Credentials",
    uM3 = "ContextAssertion",
    mM3 = "DecodeAuthorizationMessage",
    dM3 = "DecodeAuthorizationMessageRequest",
    cM3 = "DecodeAuthorizationMessageResponse",
    pM3 = "DecodedMessage",
    qQA = "DurationSeconds",
    q1B = "Expiration",
    lM3 = "ExternalId",
    iM3 = "EncodedMessage",
    nM3 = "ExpiredTokenException",
    aM3 = "ExpiredTradeInTokenException",
    N1B = "FederatedUser",
    oM3 = "FederatedUserId",
    rM3 = "GetAccessKeyInfo",
    sM3 = "GetAccessKeyInfoRequest",
    tM3 = "GetAccessKeyInfoResponse",
    eM3 = "GetCallerIdentity",
    AR3 = "GetCallerIdentityRequest",
    QR3 = "GetCallerIdentityResponse",
    BR3 = "GetDelegatedAccessToken",
    GR3 = "GetDelegatedAccessTokenRequest",
    ZR3 = "GetDelegatedAccessTokenResponse",
    YR3 = "GetFederationToken",
    JR3 = "GetFederationTokenRequest",
    XR3 = "GetFederationTokenResponse",
    IR3 = "GetSessionToken",
    DR3 = "GetSessionTokenRequest",
    WR3 = "GetSessionTokenResponse",
    KR3 = "GetWebIdentityToken",
    VR3 = "GetWebIdentityTokenRequest",
    FR3 = "GetWebIdentityTokenResponse",
    HR3 = "Issuer",
    ER3 = "InvalidAuthorizationMessageException",
    zR3 = "IDPCommunicationErrorException",
    $R3 = "IDPRejectedClaimException",
    CR3 = "InvalidIdentityTokenException",
    UR3 = "JWTPayloadSizeExceededException",
    qR3 = "Key",
    NR3 = "MalformedPolicyDocumentException",
    wR3 = "Name",
    LR3 = "NameQualifier",
    OR3 = "OutboundWebIdentityFederationDisabledException",
    $A1 = "Policy",
    CA1 = "PolicyArns",
    MR3 = "PrincipalArn",
    RR3 = "ProviderArn",
    _R3 = "ProvidedContexts",
    jR3 = "ProvidedContextsListType",
    TR3 = "ProvidedContext",
    PR3 = "PolicyDescriptorType",
    SR3 = "ProviderId",
    POA = "PackedPolicySize",
    xR3 = "PackedPolicyTooLargeException",
    yR3 = "Provider",
    Nl1 = "RoleArn",
    vR3 = "RegionDisabledException",
    w1B = "RoleSessionName",
    kR3 = "Subject",
    bR3 = "SigningAlgorithm",
    fR3 = "SecretAccessKey",
    hR3 = "SAMLAssertion",
    gR3 = "SAMLAssertionType",
    uR3 = "SessionDurationEscalationException",
    mR3 = "SubjectFromWebIdentityToken",
    SOA = "SourceIdentity",
    L1B = "SerialNumber",
    dR3 = "SubjectType",
    cR3 = "SessionToken",
    wl1 = "Tags",
    O1B = "TokenCode",
    pR3 = "TradeInToken",
    lR3 = "TargetPrincipal",
    iR3 = "TaskPolicyArn",
    nR3 = "TransitiveTagKeys",
    aR3 = "Tag",
    oR3 = "UserId",
    rR3 = "Value",
    M1B = "WebIdentityToken",
    sR3 = "arn",
    tR3 = "accessKeySecretType",
    _R = "awsQueryError",
    jR = "client",
    eR3 = "clientTokenType",
    TR = "error",
    PR = "httpError",
    SR = "message",
    A_3 = "policyDescriptorListType",
    R1B = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
    Q_3 = "tradeInTokenType",
    B_3 = "tagListType",
    G_3 = "webIdentityTokenType",
    _2 = "com.amazonaws.sts",
    Z_3 = [0, _2, tR3, 8, 0],
    Y_3 = [0, _2, eR3, 8, 0],
    J_3 = [0, _2, gR3, 8, 0],
    X_3 = [0, _2, Q_3, 8, 0],
    I_3 = [0, _2, G_3, 8, 0],
    Ll1 = [3, _2, zA1, 0, [jM3, Ul1],
      [0, 0]
    ],
    D_3 = [3, _2, TM3, 0, [Nl1, w1B, CA1, $A1, qQA, wl1, nR3, lM3, L1B, O1B, SOA, _R3],
      [0, 0, () => UA1, 0, 1, () => Ol1, 64, 0, 0, 0, 0, () => n_3]
    ],
    W_3 = [3, _2, PM3, 0, [nn, zA1, POA, SOA],
      [
        [() => NQA, 0], () => Ll1, 1, 0
      ]
    ],
    K_3 = [3, _2, vM3, 0, [Nl1, MR3, hR3, CA1, $A1, qQA],
      [0, 0, [() => J_3, 0], () => UA1, 0, 1]
    ],
    V_3 = [3, _2, kM3, 0, [nn, zA1, POA, kR3, dR3, HR3, ql1, LR3, SOA],
      [
        [() => NQA, 0], () => Ll1, 1, 0, 0, 0, 0, 0, 0
      ]
    ],
    F_3 = [3, _2, fM3, 0, [Nl1, w1B, M1B, SR3, CA1, $A1, qQA],
      [0, 0, [() => Y_3, 0], 0, () => UA1, 0, 1]
    ],
    H_3 = [3, _2, hM3, 0, [nn, mR3, zA1, POA, yR3, ql1, SOA],
      [
        [() => NQA, 0], 0, () => Ll1, 1, 0, 0, 0
      ]
    ],
    E_3 = [3, _2, SM3, 0, [lR3, iR3, qQA],
      [0, () => _1B, 1]
    ],
    z_3 = [3, _2, xM3, 0, [nn, SOA],
      [
        [() => NQA, 0], 0
      ]
    ],
    NQA = [3, _2, nn, 0, [C1B, fR3, cR3, q1B],
      [0, [() => Z_3, 0], 0, 4]
    ],
    $_3 = [3, _2, dM3, 0, [iM3],
      [0]
    ],
    C_3 = [3, _2, cM3, 0, [pM3],
      [0]
    ],
    U_3 = [-3, _2, nM3, {
        [TR]: jR,
        [PR]: 400,
        [_R]: ["ExpiredTokenException", 400]
      },
      [SR],
      [0]
    ];
  RL.TypeRegistry.for(_2).registerError(U_3, J1B);
  var q_3 = [-3, _2, aM3, {
      [TR]: jR,
      [PR]: 400,
      [_R]: ["ExpiredTradeInTokenException", 400]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(q_3, H1B);
  var N_3 = [3, _2, N1B, 0, [oM3, Ul1],
      [0, 0]
    ],
    w_3 = [3, _2, sM3, 0, [C1B],
      [0]
    ],
    L_3 = [3, _2, tM3, 0, [U1B],
      [0]
    ],
    O_3 = [3, _2, AR3, 0, [],
      []
    ],
    M_3 = [3, _2, QR3, 0, [oR3, U1B, Ul1],
      [0, 0, 0]
    ],
    R_3 = [3, _2, GR3, 0, [pR3],
      [
        [() => X_3, 0]
      ]
    ],
    __3 = [3, _2, ZR3, 0, [nn, POA, RM3],
      [
        [() => NQA, 0], 1, 0
      ]
    ],
    j_3 = [3, _2, JR3, 0, [wR3, $A1, CA1, qQA, wl1],
      [0, 0, () => UA1, 1, () => Ol1]
    ],
    T_3 = [3, _2, XR3, 0, [nn, N1B, POA],
      [
        [() => NQA, 0], () => N_3, 1
      ]
    ],
    P_3 = [3, _2, DR3, 0, [qQA, L1B, O1B],
      [1, 0, 0]
    ],
    S_3 = [3, _2, WR3, 0, [nn],
      [
        [() => NQA, 0]
      ]
    ],
    x_3 = [3, _2, VR3, 0, [ql1, qQA, bR3, wl1],
      [64, 1, 0, () => Ol1]
    ],
    y_3 = [3, _2, FR3, 0, [M1B, q1B],
      [
        [() => I_3, 0], 4
      ]
    ],
    v_3 = [-3, _2, zR3, {
        [TR]: jR,
        [PR]: 400,
        [_R]: ["IDPCommunicationError", 400]
      },
      [SR],
      [0]
    ];
  RL.TypeRegistry.for(_2).registerError(v_3, V1B);
  var k_3 = [-3, _2, $R3, {
      [TR]: jR,
      [PR]: 403,
      [_R]: ["IDPRejectedClaim", 403]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(k_3, W1B);
  var b_3 = [-3, _2, ER3, {
      [TR]: jR,
      [PR]: 400,
      [_R]: ["InvalidAuthorizationMessageException", 400]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(b_3, F1B);
  var f_3 = [-3, _2, CR3, {
      [TR]: jR,
      [PR]: 400,
      [_R]: ["InvalidIdentityToken", 400]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(f_3, K1B);
  var h_3 = [-3, _2, UR3, {
      [TR]: jR,
      [PR]: 400,
      [_R]: ["JWTPayloadSizeExceededException", 400]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(h_3, E1B);
  var g_3 = [-3, _2, NR3, {
      [TR]: jR,
      [PR]: 400,
      [_R]: ["MalformedPolicyDocument", 400]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(g_3, X1B);
  var u_3 = [-3, _2, OR3, {
      [TR]: jR,
      [PR]: 403,
      [_R]: ["OutboundWebIdentityFederationDisabledException", 403]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(u_3, z1B);
  var m_3 = [-3, _2, xR3, {
      [TR]: jR,
      [PR]: 400,
      [_R]: ["PackedPolicyTooLarge", 400]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(m_3, I1B);
  var _1B = [3, _2, PR3, 0, [sR3],
      [0]
    ],
    d_3 = [3, _2, TR3, 0, [RR3, uM3],
      [0, 0]
    ],
    c_3 = [-3, _2, vR3, {
        [TR]: jR,
        [PR]: 403,
        [_R]: ["RegionDisabledException", 403]
      },
      [SR],
      [0]
    ];
  RL.TypeRegistry.for(_2).registerError(c_3, D1B);
  var p_3 = [-3, _2, uR3, {
      [TR]: jR,
      [PR]: 403,
      [_R]: ["SessionDurationEscalationException", 403]
    },
    [SR],
    [0]
  ];
  RL.TypeRegistry.for(_2).registerError(p_3, $1B);
  var l_3 = [3, _2, aR3, 0, [qR3, rR3],
      [0, 0]
    ],
    i_3 = [-3, R1B, "STSServiceException", 0, [],
      []
    ];
  RL.TypeRegistry.for(R1B).registerError(i_3, cq);
  var UA1 = [1, _2, A_3, 0, () => _1B],
    n_3 = [1, _2, jR3, 0, () => d_3],
    Ol1 = [1, _2, B_3, 0, () => l_3],
    a_3 = [9, _2, _M3, 0, () => D_3, () => W_3],
    o_3 = [9, _2, yM3, 0, () => K_3, () => V_3],
    r_3 = [9, _2, bM3, 0, () => F_3, () => H_3],
    s_3 = [9, _2, gM3, 0, () => E_3, () => z_3],
    t_3 = [9, _2, mM3, 0, () => $_3, () => C_3],
    e_3 = [9, _2, rM3, 0, () => w_3, () => L_3],
    Aj3 = [9, _2, eM3, 0, () => O_3, () => M_3],
    Qj3 = [9, _2, BR3, 0, () => R_3, () => __3],
    Bj3 = [9, _2, YR3, 0, () => j_3, () => T_3],
    Gj3 = [9, _2, IR3, 0, () => P_3, () => S_3],
    Zj3 = [9, _2, KR3, 0, () => x_3, () => y_3];
  class qA1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(a_3).build() {}
  class Ml1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithSAML", {}).n("STSClient", "AssumeRoleWithSAMLCommand").sc(o_3).build() {}
  class NA1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(r_3).build() {}
  class Rl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoot", {}).n("STSClient", "AssumeRootCommand").sc(s_3).build() {}
  class _l1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "DecodeAuthorizationMessage", {}).n("STSClient", "DecodeAuthorizationMessageCommand").sc(t_3).build() {}
  class jl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "GetAccessKeyInfo", {}).n("STSClient", "GetAccessKeyInfoCommand").sc(e_3).build() {}
  class Tl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "GetCallerIdentity", {}).n("STSClient", "GetCallerIdentityCommand").sc(Aj3).build() {}
  class Pl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "GetDelegatedAccessToken", {}).n("STSClient", "GetDelegatedAccessTokenCommand").sc(Qj3).build() {}
  class Sl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "GetFederationToken", {}).n("STSClient", "GetFederationTokenCommand").sc(Bj3).build() {}
  class xl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "GetSessionToken", {}).n("STSClient", "GetSessionTokenCommand").sc(Gj3).build() {}
  class yl1 extends dq.Command.classBuilder().ep(QP.commonParams).m(function (A, Q, B, G) {
    return [AP.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSecurityTokenServiceV20110615", "GetWebIdentityToken", {}).n("STSClient", "GetWebIdentityTokenCommand").sc(Zj3).build() {}
  var Yj3 = {
    AssumeRoleCommand: qA1,
    AssumeRoleWithSAMLCommand: Ml1,
    AssumeRoleWithWebIdentityCommand: NA1,
    AssumeRootCommand: Rl1,
    DecodeAuthorizationMessageCommand: _l1,
    GetAccessKeyInfoCommand: jl1,
    GetCallerIdentityCommand: Tl1,
    GetDelegatedAccessTokenCommand: Pl1,
    GetFederationTokenCommand: Sl1,
    GetSessionTokenCommand: xl1,
    GetWebIdentityTokenCommand: yl1
  };
  class vl1 extends TOA.STSClient {}
  dq.createAggregatedClient(Yj3, vl1);
  var j1B = (A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    },
    T1B = async (A, Q, B, G = {}) => {
      let Z = typeof A === "function" ? await A() : A,
        Y = typeof Q === "function" ? await Q() : Q,
        J = await MM3.stsRegionDefaultResolver(G)();
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${Z} (credential provider clientConfig)`, `${Y} (contextual client)`, `${J} (STS default: AWS_REGION, profile region, or us-east-1)`), Z ?? Y ?? J
    }, Jj3 = (A, Q) => {
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
          } = A, z = await T1B(V, A?.parentClientConfig?.region, H, {
            logger: W,
            profile: K
          }), $ = !P1B(F);
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
        } = await B.send(new qA1(Y));
        if (!J || !J.AccessKeyId || !J.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${Y.RoleArn}`);
        let I = j1B(X),
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
        return Cl1.setCredentialFeature(D, "CREDENTIALS_STS_ASSUME_ROLE", "i"), D
      }
    }, Xj3 = (A, Q) => {
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
          } = A, H = await T1B(W, A?.parentClientConfig?.region, V, {
            logger: I,
            profile: D
          }), E = !P1B(K);
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
        } = await B.send(new NA1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let J = j1B(Y),
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
        if (J) Cl1.setCredentialFeature(X, "RESOLVED_ACCOUNT_ID", "T");
        return Cl1.setCredentialFeature(X, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), X
      }
    }, P1B = (A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, S1B = (A, Q) => {
      if (!Q) return A;
      else return class extends A {
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, x1B = (A = {}, Q) => Jj3(A, S1B(TOA.STSClient, Q)), y1B = (A = {}, Q) => Xj3(A, S1B(TOA.STSClient, Q)), Ij3 = (A) => (Q) => A({
      roleAssumer: x1B(Q),
      roleAssumerWithWebIdentity: y1B(Q),
      ...Q
    });
  Object.defineProperty(EA1, "$Command", {
    enumerable: !0,
    get: function () {
      return dq.Command
    }
  });
  EA1.AssumeRoleCommand = qA1;
  EA1.AssumeRoleWithSAMLCommand = Ml1;
  EA1.AssumeRoleWithWebIdentityCommand = NA1;
  EA1.AssumeRootCommand = Rl1;
  EA1.DecodeAuthorizationMessageCommand = _l1;
  EA1.ExpiredTokenException = J1B;
  EA1.ExpiredTradeInTokenException = H1B;
  EA1.GetAccessKeyInfoCommand = jl1;
  EA1.GetCallerIdentityCommand = Tl1;
  EA1.GetDelegatedAccessTokenCommand = Pl1;
  EA1.GetFederationTokenCommand = Sl1;
  EA1.GetSessionTokenCommand = xl1;
  EA1.GetWebIdentityTokenCommand = yl1;
  EA1.IDPCommunicationErrorException = V1B;
  EA1.IDPRejectedClaimException = W1B;
  EA1.InvalidAuthorizationMessageException = F1B;
  EA1.InvalidIdentityTokenException = K1B;
  EA1.JWTPayloadSizeExceededException = E1B;
  EA1.MalformedPolicyDocumentException = X1B;
  EA1.OutboundWebIdentityFederationDisabledException = z1B;
  EA1.PackedPolicyTooLargeException = I1B;
  EA1.RegionDisabledException = D1B;
  EA1.STS = vl1;
  EA1.STSServiceException = cq;
  EA1.SessionDurationEscalationException = $1B;
  EA1.decorateDefaultCredentialProvider = Ij3;
  EA1.getDefaultRoleAssumer = x1B;
  EA1.getDefaultRoleAssumerWithWebIdentity = y1B;
  Object.keys(TOA).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(EA1, A)) Object.defineProperty(EA1, A, {
      enumerable: !0,
      get: function () {
        return TOA[A]
      }
    })
  })
})
// @from(Ln 125127, Col 4)
b1B = U((k1B) => {
  Object.defineProperty(k1B, "__esModule", {
    value: !0
  });
  k1B.propertyProviderChain = k1B.createCredentialChain = void 0;
  var fj3 = PW(),
    hj3 = (...A) => {
      let Q = -1,
        G = Object.assign(async (Z) => {
          let Y = await k1B.propertyProviderChain(...A)(Z);
          if (!Y.expiration && Q !== -1) Y.expiration = new Date(Date.now() + Q);
          return Y
        }, {
          expireAfter(Z) {
            if (Z < 300000) throw Error("@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.");
            return Q = Z, G
          }
        });
      return G
    };
  k1B.createCredentialChain = hj3;
  var gj3 = (...A) => async (Q) => {
    if (A.length === 0) throw new fj3.ProviderError("No providers in chain", {
      tryNextLink: !1
    });
    let B;
    for (let G of A) try {
      return await G(Q)
    } catch (Z) {
      if (B = Z, Z?.tryNextLink) continue;
      throw Z
    }
    throw B
  };
  k1B.propertyProviderChain = gj3
})
// @from(Ln 125163, Col 4)
dl1 = U((ij3) => {
  ij3.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(ij3.HttpAuthLocation || (ij3.HttpAuthLocation = {}));
  ij3.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(ij3.HttpApiKeyAuthLocation || (ij3.HttpApiKeyAuthLocation = {}));
  ij3.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(ij3.EndpointURLScheme || (ij3.EndpointURLScheme = {}));
  ij3.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(ij3.AlgorithmId || (ij3.AlgorithmId = {}));
  var mj3 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => ij3.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => ij3.AlgorithmId.MD5,
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
    dj3 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    cj3 = (A) => {
      return mj3(A)
    },
    pj3 = (A) => {
      return dj3(A)
    };
  ij3.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(ij3.FieldPosition || (ij3.FieldPosition = {}));
  var lj3 = "__smithy_context";
  ij3.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(ij3.IniSectionType || (ij3.IniSectionType = {}));
  ij3.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(ij3.RequestHandlerProtocol || (ij3.RequestHandlerProtocol = {}));
  ij3.SMITHY_CONTEXT_KEY = lj3;
  ij3.getDefaultClientConfiguration = cj3;
  ij3.resolveDefaultRuntimeConfig = pj3
})
// @from(Ln 125228, Col 4)
yOA = U((BXA) => {
  var g1B = Ev(),
    nl1 = Mq(),
    pl1 = dl1(),
    rj3 = WX(),
    f1B = Oq();
  class u1B {
    config;
    middlewareStack = g1B.constructStack();
    initConfig;
    handlers;
    constructor(A) {
      this.config = A
    }
    send(A, Q, B) {
      let G = typeof Q !== "function" ? Q : void 0,
        Z = typeof Q === "function" ? Q : B,
        Y = G === void 0 && this.config.cacheMiddleware === !0,
        J;
      if (Y) {
        if (!this.handlers) this.handlers = new WeakMap;
        let X = this.handlers;
        if (X.has(A.constructor)) J = X.get(A.constructor);
        else J = A.resolveMiddleware(this.middlewareStack, this.config, G), X.set(A.constructor, J)
      } else delete this.handlers, J = A.resolveMiddleware(this.middlewareStack, this.config, G);
      if (Z) J(A).then((X) => Z(null, X.output), (X) => Z(X)).catch(() => {});
      else return J(A).then((X) => X.output)
    }
    destroy() {
      this.config?.requestHandler?.destroy?.(), delete this.handlers
    }
  }
  var cl1 = "***SensitiveInformation***";

  function ll1(A, Q) {
    if (Q == null) return Q;
    let B = rj3.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return cl1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return cl1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return cl1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = ll1(J, G[Y]);
      return Z
    }
    return Q
  }
  class al1 {
    middlewareStack = g1B.constructStack();
    schema;
    static classBuilder() {
      return new m1B
    }
    resolveMiddlewareWithContext(A, Q, B, {
      middlewareFn: G,
      clientName: Z,
      commandName: Y,
      inputFilterSensitiveLog: J,
      outputFilterSensitiveLog: X,
      smithyContext: I,
      additionalContext: D,
      CommandCtor: W
    }) {
      for (let E of G.bind(this)(W, A, Q, B)) this.middlewareStack.use(E);
      let K = A.concat(this.middlewareStack),
        {
          logger: V
        } = Q,
        F = {
          logger: V,
          clientName: Z,
          commandName: Y,
          inputFilterSensitiveLog: J,
          outputFilterSensitiveLog: X,
          [pl1.SMITHY_CONTEXT_KEY]: {
            commandInstance: this,
            ...I
          },
          ...D
        },
        {
          requestHandler: H
        } = Q;
      return K.resolve((E) => H.handle(E.request, B || {}), F)
    }
  }
  class m1B {
    _init = () => {};
    _ep = {};
    _middlewareFn = () => [];
    _commandName = "";
    _clientName = "";
    _additionalContext = {};
    _smithyContext = {};
    _inputFilterSensitiveLog = void 0;
    _outputFilterSensitiveLog = void 0;
    _serializer = null;
    _deserializer = null;
    _operationSchema;
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
      return Q = class extends al1 {
        input;
        static getEndpointParameterInstructions() {
          return A._ep
        }
        constructor(...[B]) {
          super();
          this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
        }
        resolveMiddleware(B, G, Z) {
          let Y = A._operationSchema,
            J = Y?.[4] ?? Y?.input,
            X = Y?.[5] ?? Y?.output;
          return this.resolveMiddlewareWithContext(B, G, Z, {
            CommandCtor: Q,
            middlewareFn: A._middlewareFn,
            clientName: A._clientName,
            commandName: A._commandName,
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? ll1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? ll1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var sj3 = "***SensitiveInformation***",
    tj3 = (A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = async function (J, X, I) {
            let D = new G(J);
            if (typeof X === "function") this.send(D, X);
            else if (typeof I === "function") {
              if (typeof X !== "object") throw Error(`Expected http options but got ${typeof X}`);
              this.send(D, X || {}, I)
            } else return this.send(D, X)
          }, Y = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[Y] = Z
      }
    };
  class QXA extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(A) {
      super(A.message);
      Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return QXA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === QXA) return QXA.isInstance(A);
      if (QXA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var d1B = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    c1B = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = AT3(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw d1B(J, Q)
    },
    ej3 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        c1B({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    AT3 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    QT3 = (A) => {
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
    },
    h1B = !1,
    BT3 = (A) => {
      if (A && !h1B && parseInt(A.substring(1, A.indexOf("."))) < 16) h1B = !0
    },
    GT3 = (A) => {
      let Q = [];
      for (let B in pl1.AlgorithmId) {
        let G = pl1.AlgorithmId[B];
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
    },
    ZT3 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    YT3 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    JT3 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    p1B = (A) => {
      return Object.assign(GT3(A), YT3(A))
    },
    XT3 = p1B,
    IT3 = (A) => {
      return Object.assign(ZT3(A), JT3(A))
    },
    DT3 = (A) => Array.isArray(A) ? A : [A],
    l1B = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = l1B(A[B]);
      return A
    },
    WT3 = (A) => {
      return A != null
    };
  class i1B {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function n1B(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, FT3(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      a1B(G, null, Y, J)
    }
    return G
  }
  var KT3 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    VT3 = (A, Q) => {
      let B = {};
      for (let G in Q) a1B(B, A, Q, G);
      return B
    },
    FT3 = (A, Q, B) => {
      return n1B(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    a1B = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = HT3, I = ET3, D = G] = J;
        if (typeof X === "function" && X(Q[D]) || typeof X !== "function" && !!X) A[G] = I(Q[D]);
        return
      }
      let [Z, Y] = B[G];
      if (typeof Y === "function") {
        let J, X = Z === void 0 && (J = Y()) != null,
          I = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (X) A[G] = J;
        else if (I) A[G] = Y()
      } else {
        let J = Z === void 0 && Y != null,
          X = typeof Z === "function" && !!Z(Y) || typeof Z !== "function" && !!Z;
        if (J || X) A[G] = Y
      }
    },
    HT3 = (A) => A != null,
    ET3 = (A) => A,
    zT3 = (A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    },
    $T3 = (A) => A.toISOString().replace(".000Z", "Z"),
    il1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(il1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = il1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(BXA, "collectBody", {
    enumerable: !0,
    get: function () {
      return nl1.collectBody
    }
  });
  Object.defineProperty(BXA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return nl1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(BXA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return nl1.resolvedPath
    }
  });
  BXA.Client = u1B;
  BXA.Command = al1;
  BXA.NoOpLogger = i1B;
  BXA.SENSITIVE_STRING = sj3;
  BXA.ServiceException = QXA;
  BXA._json = il1;
  BXA.convertMap = KT3;
  BXA.createAggregatedClient = tj3;
  BXA.decorateServiceException = d1B;
  BXA.emitWarningIfUnsupportedVersion = BT3;
  BXA.getArrayIfSingleItem = DT3;
  BXA.getDefaultClientConfiguration = XT3;
  BXA.getDefaultExtensionConfiguration = p1B;
  BXA.getValueFromTextNode = l1B;
  BXA.isSerializableHeaderValue = WT3;
  BXA.loadConfigsForDefaultMode = QT3;
  BXA.map = n1B;
  BXA.resolveDefaultRuntimeConfig = IT3;
  BXA.serializeDateTime = $T3;
  BXA.serializeFloat = zT3;
  BXA.take = VT3;
  BXA.throwDefaultError = c1B;
  BXA.withBaseException = ej3;
  Object.keys(f1B).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(BXA, A)) Object.defineProperty(BXA, A, {
      enumerable: !0,
      get: function () {
        return f1B[A]
      }
    })
  })
})
// @from(Ln 125698, Col 4)
rl1 = U((o1B) => {
  Object.defineProperty(o1B, "__esModule", {
    value: !0
  });
  o1B.resolveHttpAuthSchemeConfig = o1B.defaultCognitoIdentityHttpAuthSchemeProvider = o1B.defaultCognitoIdentityHttpAuthSchemeParametersProvider = void 0;
  var mT3 = hY(),
    ol1 = Jz(),
    dT3 = async (A, Q, B) => {
      return {
        operation: (0, ol1.getSmithyContext)(Q).operation,
        region: await (0, ol1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  o1B.defaultCognitoIdentityHttpAuthSchemeParametersProvider = dT3;

  function cT3(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "cognito-identity",
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

  function wA1(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var pT3 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetCredentialsForIdentity": {
        Q.push(wA1(A));
        break
      }
      case "GetId": {
        Q.push(wA1(A));
        break
      }
      case "GetOpenIdToken": {
        Q.push(wA1(A));
        break
      }
      case "UnlinkIdentity": {
        Q.push(wA1(A));
        break
      }
      default:
        Q.push(cT3(A))
    }
    return Q
  };
  o1B.defaultCognitoIdentityHttpAuthSchemeProvider = pT3;
  var lT3 = (A) => {
    let Q = (0, mT3.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, ol1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  o1B.resolveHttpAuthSchemeConfig = lT3
})
// @from(Ln 125769, Col 4)
s1B = U((_KG, aT3) => {
  aT3.exports = {
    name: "@aws-sdk/client-cognito-identity",
    description: "AWS SDK for JavaScript Cognito Identity Client for Node.js, Browser and React Native",
    version: "3.936.0",
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
      "test:e2e": "yarn g:vitest run -c vitest.config.e2e.mts --mode development",
      "test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.mts"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.936.0",
      "@aws-sdk/credential-provider-node": "3.936.0",
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
      "@aws-sdk/client-iam": "3.936.0",
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
// @from(Ln 125870, Col 4)
t1B = U((rT3) => {
  var oT3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  rT3.isArrayBuffer = oT3
})
// @from(Ln 125874, Col 4)
tl1 = U((QP3) => {
  var tT3 = t1B(),
    sl1 = NA("buffer"),
    eT3 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!tT3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return sl1.Buffer.from(A, Q, B)
    },
    AP3 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? sl1.Buffer.from(A, Q) : sl1.Buffer.from(A)
    };
  QP3.fromArrayBuffer = eT3;
  QP3.fromString = AP3
})
// @from(Ln 125888, Col 4)
Q0B = U((e1B) => {
  Object.defineProperty(e1B, "__esModule", {
    value: !0
  });
  e1B.fromBase64 = void 0;
  var ZP3 = tl1(),
    YP3 = /^[A-Za-z0-9+/]*={0,2}$/,
    JP3 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!YP3.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, ZP3.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  e1B.fromBase64 = JP3
})
// @from(Ln 125903, Col 4)
Z0B = U((B0B) => {
  Object.defineProperty(B0B, "__esModule", {
    value: !0
  });
  B0B.toBase64 = void 0;
  var XP3 = tl1(),
    IP3 = oG(),
    DP3 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, IP3.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, XP3.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  B0B.toBase64 = DP3
})
// @from(Ln 125919, Col 4)
X0B = U((vOA) => {
  var Y0B = Q0B(),
    J0B = Z0B();
  Object.keys(Y0B).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(vOA, A)) Object.defineProperty(vOA, A, {
      enumerable: !0,
      get: function () {
        return Y0B[A]
      }
    })
  });
  Object.keys(J0B).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(vOA, A)) Object.defineProperty(vOA, A, {
      enumerable: !0,
      get: function () {
        return J0B[A]
      }
    })
  })
})
// @from(Ln 125939, Col 4)
O0B = U((w0B) => {
  Object.defineProperty(w0B, "__esModule", {
    value: !0
  });
  w0B.ruleSet = void 0;
  var C0B = "required",
    wz = "fn",
    Lz = "argv",
    ZXA = "ref",
    I0B = !0,
    D0B = "isSet",
    fOA = "booleanEquals",
    GXA = "error",
    Qk = "endpoint",
    _u = "tree",
    el1 = "PartitionResult",
    Ai1 = "getAttr",
    kOA = "stringEquals",
    W0B = {
      [C0B]: !1,
      type: "string"
    },
    K0B = {
      [C0B]: !0,
      default: !1,
      type: "boolean"
    },
    V0B = {
      [ZXA]: "Endpoint"
    },
    U0B = {
      [wz]: fOA,
      [Lz]: [{
        [ZXA]: "UseFIPS"
      }, !0]
    },
    q0B = {
      [wz]: fOA,
      [Lz]: [{
        [ZXA]: "UseDualStack"
      }, !0]
    },
    uW = {},
    bOA = {
      [ZXA]: "Region"
    },
    F0B = {
      [wz]: Ai1,
      [Lz]: [{
        [ZXA]: el1
      }, "supportsFIPS"]
    },
    N0B = {
      [ZXA]: el1
    },
    H0B = {
      [wz]: fOA,
      [Lz]: [!0, {
        [wz]: Ai1,
        [Lz]: [N0B, "supportsDualStack"]
      }]
    },
    E0B = [U0B],
    z0B = [q0B],
    $0B = [bOA],
    WP3 = {
      version: "1.0",
      parameters: {
        Region: W0B,
        UseDualStack: K0B,
        UseFIPS: K0B,
        Endpoint: W0B
      },
      rules: [{
        conditions: [{
          [wz]: D0B,
          [Lz]: [V0B]
        }],
        rules: [{
          conditions: E0B,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: GXA
        }, {
          conditions: z0B,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: GXA
        }, {
          endpoint: {
            url: V0B,
            properties: uW,
            headers: uW
          },
          type: Qk
        }],
        type: _u
      }, {
        conditions: [{
          [wz]: D0B,
          [Lz]: $0B
        }],
        rules: [{
          conditions: [{
            [wz]: "aws.partition",
            [Lz]: $0B,
            assign: el1
          }],
          rules: [{
            conditions: [U0B, q0B],
            rules: [{
              conditions: [{
                [wz]: fOA,
                [Lz]: [I0B, F0B]
              }, H0B],
              rules: [{
                conditions: [{
                  [wz]: kOA,
                  [Lz]: [bOA, "us-east-1"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }, {
                conditions: [{
                  [wz]: kOA,
                  [Lz]: [bOA, "us-east-2"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }, {
                conditions: [{
                  [wz]: kOA,
                  [Lz]: [bOA, "us-west-1"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }, {
                conditions: [{
                  [wz]: kOA,
                  [Lz]: [bOA, "us-west-2"]
                }],
                endpoint: {
                  url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }, {
                endpoint: {
                  url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }],
              type: _u
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: GXA
            }],
            type: _u
          }, {
            conditions: E0B,
            rules: [{
              conditions: [{
                [wz]: fOA,
                [Lz]: [F0B, I0B]
              }],
              rules: [{
                endpoint: {
                  url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }],
              type: _u
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: GXA
            }],
            type: _u
          }, {
            conditions: z0B,
            rules: [{
              conditions: [H0B],
              rules: [{
                conditions: [{
                  [wz]: kOA,
                  [Lz]: ["aws", {
                    [wz]: Ai1,
                    [Lz]: [N0B, "name"]
                  }]
                }],
                endpoint: {
                  url: "https://cognito-identity.{Region}.amazonaws.com",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }, {
                endpoint: {
                  url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: uW,
                  headers: uW
                },
                type: Qk
              }],
              type: _u
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: GXA
            }],
            type: _u
          }, {
            endpoint: {
              url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
              properties: uW,
              headers: uW
            },
            type: Qk
          }],
          type: _u
        }],
        type: _u
      }, {
        error: "Invalid Configuration: Missing Region",
        type: GXA
      }]
    };
  w0B.ruleSet = WP3
})
// @from(Ln 126181, Col 4)
_0B = U((M0B) => {
  Object.defineProperty(M0B, "__esModule", {
    value: !0
  });
  M0B.defaultEndpointResolver = void 0;
  var KP3 = Hv(),
    Qi1 = xT(),
    VP3 = O0B(),
    FP3 = new Qi1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    HP3 = (A, Q = {}) => {
      return FP3.get(A, () => (0, Qi1.resolveEndpoint)(VP3.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  M0B.defaultEndpointResolver = HP3;
  Qi1.customEndpointFunctions.aws = KP3.awsEndpointFunctions
})
// @from(Ln 126202, Col 4)
x0B = U((P0B) => {
  Object.defineProperty(P0B, "__esModule", {
    value: !0
  });
  P0B.getRuntimeConfig = void 0;
  var EP3 = hY(),
    zP3 = eg(),
    $P3 = rG(),
    CP3 = yOA(),
    UP3 = oM(),
    j0B = X0B(),
    T0B = oG(),
    qP3 = rl1(),
    NP3 = _0B(),
    wP3 = (A) => {
      return {
        apiVersion: "2014-06-30",
        base64Decoder: A?.base64Decoder ?? j0B.fromBase64,
        base64Encoder: A?.base64Encoder ?? j0B.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? NP3.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? qP3.defaultCognitoIdentityHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new EP3.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new $P3.NoAuthSigner
        }],
        logger: A?.logger ?? new CP3.NoOpLogger,
        protocol: A?.protocol ?? new zP3.AwsJson1_1Protocol({
          defaultNamespace: "com.amazonaws.cognitoidentity",
          serviceTarget: "AWSCognitoIdentityService",
          awsQueryCompatible: !1
        }),
        serviceId: A?.serviceId ?? "Cognito Identity",
        urlParser: A?.urlParser ?? UP3.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? T0B.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? T0B.toUtf8
      }
    };
  P0B.getRuntimeConfig = wP3
})