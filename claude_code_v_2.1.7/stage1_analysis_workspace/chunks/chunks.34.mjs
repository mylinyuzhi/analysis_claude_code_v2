
// @from(Ln 87114, Col 4)
H0A = U((qZ6) => {
  var qv = PW(),
    iG6 = NA("url"),
    nG6 = NA("buffer"),
    aG6 = NA("http"),
    tv1 = _q(),
    oG6 = oM();

  function KwA(A) {
    return new Promise((Q, B) => {
      let G = aG6.request({
        method: "GET",
        ...A,
        hostname: A.hostname?.replace(/^\[(.+)\]$/, "$1")
      });
      G.on("error", (Z) => {
        B(Object.assign(new qv.ProviderError("Unable to connect to instance metadata service"), Z)), G.destroy()
      }), G.on("timeout", () => {
        B(new qv.ProviderError("TimeoutError from instance metadata service")), G.destroy()
      }), G.on("response", (Z) => {
        let {
          statusCode: Y = 400
        } = Z;
        if (Y < 200 || 300 <= Y) B(Object.assign(new qv.ProviderError("Error response received from instance metadata service"), {
          statusCode: Y
        })), G.destroy();
        let J = [];
        Z.on("data", (X) => {
          J.push(X)
        }), Z.on("end", () => {
          Q(nG6.Buffer.concat(J)), G.destroy()
        })
      }), G.end()
    })
  }
  var G_Q = (A) => Boolean(A) && typeof A === "object" && typeof A.AccessKeyId === "string" && typeof A.SecretAccessKey === "string" && typeof A.Token === "string" && typeof A.Expiration === "string",
    Z_Q = (A) => ({
      accessKeyId: A.AccessKeyId,
      secretAccessKey: A.SecretAccessKey,
      sessionToken: A.Token,
      expiration: new Date(A.Expiration),
      ...A.AccountId && {
        accountId: A.AccountId
      }
    }),
    Y_Q = 1000,
    J_Q = 0,
    ev1 = ({
      maxRetries: A = J_Q,
      timeout: Q = Y_Q
    }) => ({
      maxRetries: A,
      timeout: Q
    }),
    rv1 = (A, Q) => {
      let B = A();
      for (let G = 0; G < Q; G++) B = B.catch(A);
      return B
    },
    boA = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    foA = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    sv1 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    rG6 = (A = {}) => {
      let {
        timeout: Q,
        maxRetries: B
      } = ev1(A);
      return () => rv1(async () => {
        let G = await QZ6({
            logger: A.logger
          }),
          Z = JSON.parse(await sG6(Q, G));
        if (!G_Q(Z)) throw new qv.CredentialsProviderError("Invalid response received from instance metadata service.", {
          logger: A.logger
        });
        return Z_Q(Z)
      }, B)
    },
    sG6 = async (A, Q) => {
      if (process.env[sv1]) Q.headers = {
        ...Q.headers,
        Authorization: process.env[sv1]
      };
      return (await KwA({
        ...Q,
        timeout: A
      })).toString()
    }, tG6 = "169.254.170.2", eG6 = {
      localhost: !0,
      "127.0.0.1": !0
    }, AZ6 = {
      "http:": !0,
      "https:": !0
    }, QZ6 = async ({
      logger: A
    }) => {
      if (process.env[foA]) return {
        hostname: tG6,
        path: process.env[foA]
      };
      if (process.env[boA]) {
        let Q = iG6.parse(process.env[boA]);
        if (!Q.hostname || !(Q.hostname in eG6)) throw new qv.CredentialsProviderError(`${Q.hostname} is not a valid container metadata service hostname`, {
          tryNextLink: !1,
          logger: A
        });
        if (!Q.protocol || !(Q.protocol in AZ6)) throw new qv.CredentialsProviderError(`${Q.protocol} is not a valid container metadata service protocol`, {
          tryNextLink: !1,
          logger: A
        });
        return {
          ...Q,
          port: Q.port ? parseInt(Q.port, 10) : void 0
        }
      }
      throw new qv.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${foA} or ${boA} environment variable is set`, {
        tryNextLink: !1,
        logger: A
      })
    };
  class Ak1 extends qv.CredentialsProviderError {
    tryNextLink;
    name = "InstanceMetadataV1FallbackError";
    constructor(A, Q = !0) {
      super(A, Q);
      this.tryNextLink = Q, Object.setPrototypeOf(this, Ak1.prototype)
    }
  }
  qZ6.Endpoint = void 0;
  (function (A) {
    A.IPv4 = "http://169.254.169.254", A.IPv6 = "http://[fd00:ec2::254]"
  })(qZ6.Endpoint || (qZ6.Endpoint = {}));
  var BZ6 = "AWS_EC2_METADATA_SERVICE_ENDPOINT",
    GZ6 = "ec2_metadata_service_endpoint",
    ZZ6 = {
      environmentVariableSelector: (A) => A[BZ6],
      configFileSelector: (A) => A[GZ6],
      default: void 0
    },
    VYA;
  (function (A) {
    A.IPv4 = "IPv4", A.IPv6 = "IPv6"
  })(VYA || (VYA = {}));
  var YZ6 = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE",
    JZ6 = "ec2_metadata_service_endpoint_mode",
    XZ6 = {
      environmentVariableSelector: (A) => A[YZ6],
      configFileSelector: (A) => A[JZ6],
      default: VYA.IPv4
    },
    X_Q = async () => oG6.parseUrl(await IZ6() || await DZ6()), IZ6 = async () => tv1.loadConfig(ZZ6)(), DZ6 = async () => {
      let A = await tv1.loadConfig(XZ6)();
      switch (A) {
        case VYA.IPv4:
          return qZ6.Endpoint.IPv4;
        case VYA.IPv6:
          return qZ6.Endpoint.IPv6;
        default:
          throw Error(`Unsupported endpoint mode: ${A}. Select from ${Object.values(VYA)}`)
      }
    }, WZ6 = 300, KZ6 = 300, VZ6 = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html", A_Q = (A, Q) => {
      let B = WZ6 + Math.floor(Math.random() * KZ6),
        G = new Date(Date.now() + B * 1000);
      Q.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(G)}.
For more information, please visit: ` + VZ6);
      let Z = A.originalExpiration ?? A.expiration;
      return {
        ...A,
        ...Z ? {
          originalExpiration: Z
        } : {},
        expiration: G
      }
    }, FZ6 = (A, Q = {}) => {
      let B = Q?.logger || console,
        G;
      return async () => {
        let Z;
        try {
          if (Z = await A(), Z.expiration && Z.expiration.getTime() < Date.now()) Z = A_Q(Z, B)
        } catch (Y) {
          if (G) B.warn("Credential renew failed: ", Y), Z = A_Q(G, B);
          else throw Y
        }
        return G = Z, Z
      }
    }, I_Q = "/latest/meta-data/iam/security-credentials/", HZ6 = "/latest/api/token", ov1 = "AWS_EC2_METADATA_V1_DISABLED", Q_Q = "ec2_metadata_v1_disabled", B_Q = "x-aws-ec2-metadata-token", EZ6 = (A = {}) => FZ6(zZ6(A), {
      logger: A.logger
    }), zZ6 = (A = {}) => {
      let Q = !1,
        {
          logger: B,
          profile: G
        } = A,
        {
          timeout: Z,
          maxRetries: Y
        } = ev1(A),
        J = async (X, I) => {
          if (Q || I.headers?.[B_Q] == null) {
            let K = !1,
              V = !1,
              F = await tv1.loadConfig({
                environmentVariableSelector: (H) => {
                  let E = H[ov1];
                  if (V = !!E && E !== "false", E === void 0) throw new qv.CredentialsProviderError(`${ov1} not set in env, checking config file next.`, {
                    logger: A.logger
                  });
                  return V
                },
                configFileSelector: (H) => {
                  let E = H[Q_Q];
                  return K = !!E && E !== "false", K
                },
                default: !1
              }, {
                profile: G
              })();
            if (A.ec2MetadataV1Disabled || F) {
              let H = [];
              if (A.ec2MetadataV1Disabled) H.push("credential provider initialization (runtime option ec2MetadataV1Disabled)");
              if (K) H.push(`config file profile (${Q_Q})`);
              if (V) H.push(`process environment variable (${ov1})`);
              throw new Ak1(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${H.join(", ")}].`)
            }
          }
          let W = (await rv1(async () => {
            let K;
            try {
              K = await CZ6(I)
            } catch (V) {
              if (V.statusCode === 401) Q = !1;
              throw V
            }
            return K
          }, X)).trim();
          return rv1(async () => {
            let K;
            try {
              K = await UZ6(W, I, A)
            } catch (V) {
              if (V.statusCode === 401) Q = !1;
              throw V
            }
            return K
          }, X)
        };
      return async () => {
        let X = await X_Q();
        if (Q) return B?.debug("AWS SDK Instance Metadata", "using v1 fallback (no token fetch)"), J(Y, {
          ...X,
          timeout: Z
        });
        else {
          let I;
          try {
            I = (await $Z6({
              ...X,
              timeout: Z
            })).toString()
          } catch (D) {
            if (D?.statusCode === 400) throw Object.assign(D, {
              message: "EC2 Metadata token request returned error"
            });
            else if (D.message === "TimeoutError" || [403, 404, 405].includes(D.statusCode)) Q = !0;
            return B?.debug("AWS SDK Instance Metadata", "using v1 fallback (initial)"), J(Y, {
              ...X,
              timeout: Z
            })
          }
          return J(Y, {
            ...X,
            headers: {
              [B_Q]: I
            },
            timeout: Z
          })
        }
      }
    }, $Z6 = async (A) => KwA({
      ...A,
      path: HZ6,
      method: "PUT",
      headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "21600"
      }
    }), CZ6 = async (A) => (await KwA({
      ...A,
      path: I_Q
    })).toString(), UZ6 = async (A, Q, B) => {
      let G = JSON.parse((await KwA({
        ...Q,
        path: I_Q + A
      })).toString());
      if (!G_Q(G)) throw new qv.CredentialsProviderError("Invalid response received from instance metadata service.", {
        logger: B.logger
      });
      return Z_Q(G)
    };
  qZ6.DEFAULT_MAX_RETRIES = J_Q;
  qZ6.DEFAULT_TIMEOUT = Y_Q;
  qZ6.ENV_CMDS_AUTH_TOKEN = sv1;
  qZ6.ENV_CMDS_FULL_URI = boA;
  qZ6.ENV_CMDS_RELATIVE_URI = foA;
  qZ6.fromContainerMetadata = rG6;
  qZ6.fromInstanceMetadata = EZ6;
  qZ6.getInstanceMetadataEndpoint = X_Q;
  qZ6.httpRequest = KwA;
  qZ6.providerConfigFromInit = ev1
})
// @from(Ln 87424, Col 4)
K_Q = U((D_Q) => {
  Object.defineProperty(D_Q, "__esModule", {
    value: !0
  });
  D_Q.checkUrl = void 0;
  var SZ6 = PW(),
    xZ6 = "169.254.170.2",
    yZ6 = "169.254.170.23",
    vZ6 = "[fd00:ec2::23]",
    kZ6 = (A, Q) => {
      if (A.protocol === "https:") return;
      if (A.hostname === xZ6 || A.hostname === yZ6 || A.hostname === vZ6) return;
      if (A.hostname.includes("[")) {
        if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
      } else {
        if (A.hostname === "localhost") return;
        let B = A.hostname.split("."),
          G = (Z) => {
            let Y = parseInt(Z, 10);
            return 0 <= Y && Y <= 255
          };
        if (B[0] === "127" && G(B[1]) && G(B[2]) && G(B[3]) && B.length === 4) return
      }
      throw new SZ6.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
        logger: Q
      })
    };
  D_Q.checkUrl = kZ6
})
// @from(Ln 87456, Col 4)
Xk1 = U((mZ6) => {
  mZ6.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(mZ6.HttpAuthLocation || (mZ6.HttpAuthLocation = {}));
  mZ6.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(mZ6.HttpApiKeyAuthLocation || (mZ6.HttpApiKeyAuthLocation = {}));
  mZ6.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(mZ6.EndpointURLScheme || (mZ6.EndpointURLScheme = {}));
  mZ6.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(mZ6.AlgorithmId || (mZ6.AlgorithmId = {}));
  var bZ6 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => mZ6.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => mZ6.AlgorithmId.MD5,
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
    fZ6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    hZ6 = (A) => {
      return bZ6(A)
    },
    gZ6 = (A) => {
      return fZ6(A)
    };
  mZ6.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(mZ6.FieldPosition || (mZ6.FieldPosition = {}));
  var uZ6 = "__smithy_context";
  mZ6.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(mZ6.IniSectionType || (mZ6.IniSectionType = {}));
  mZ6.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(mZ6.RequestHandlerProtocol || (mZ6.RequestHandlerProtocol = {}));
  mZ6.SMITHY_CONTEXT_KEY = uZ6;
  mZ6.getDefaultClientConfiguration = hZ6;
  mZ6.resolveDefaultRuntimeConfig = gZ6
})
// @from(Ln 87521, Col 4)
E_Q = U((rZ6) => {
  var lZ6 = Xk1(),
    iZ6 = (A) => {
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
    nZ6 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class V_Q {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = lZ6.FieldPosition.HEADER,
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
  class F_Q {
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
  class hoA {
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
      let Q = new hoA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = aZ6(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return hoA.clone(this)
    }
  }

  function aZ6(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class H_Q {
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

  function oZ6(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  rZ6.Field = V_Q;
  rZ6.Fields = F_Q;
  rZ6.HttpRequest = hoA;
  rZ6.HttpResponse = H_Q;
  rZ6.getHttpHandlerExtensionConfiguration = iZ6;
  rZ6.isValidHostname = oZ6;
  rZ6.resolveHttpHandlerRuntimeConfig = nZ6
})
// @from(Ln 87663, Col 4)
j_Q = U((HYA) => {
  var C_Q = Ev(),
    Vk1 = Mq(),
    Dk1 = Xk1(),
    ZY6 = WX(),
    z_Q = Oq();
  class U_Q {
    config;
    middlewareStack = C_Q.constructStack();
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
  var Ik1 = "***SensitiveInformation***";

  function Wk1(A, Q) {
    if (Q == null) return Q;
    let B = ZY6.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return Ik1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return Ik1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return Ik1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = Wk1(J, G[Y]);
      return Z
    }
    return Q
  }
  class Fk1 {
    middlewareStack = C_Q.constructStack();
    schema;
    static classBuilder() {
      return new q_Q
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
          [Dk1.SMITHY_CONTEXT_KEY]: {
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
  class q_Q {
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
      return Q = class extends Fk1 {
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
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? Wk1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? Wk1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var YY6 = "***SensitiveInformation***",
    JY6 = (A, Q) => {
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
  class FYA extends Error {
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
      return FYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === FYA) return FYA.isInstance(A);
      if (FYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var N_Q = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    w_Q = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = IY6(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw N_Q(J, Q)
    },
    XY6 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        w_Q({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    IY6 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    DY6 = (A) => {
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
    $_Q = !1,
    WY6 = (A) => {
      if (A && !$_Q && parseInt(A.substring(1, A.indexOf("."))) < 16) $_Q = !0
    },
    KY6 = (A) => {
      let Q = [];
      for (let B in Dk1.AlgorithmId) {
        let G = Dk1.AlgorithmId[B];
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
    VY6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    FY6 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    HY6 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    L_Q = (A) => {
      return Object.assign(KY6(A), FY6(A))
    },
    EY6 = L_Q,
    zY6 = (A) => {
      return Object.assign(VY6(A), HY6(A))
    },
    $Y6 = (A) => Array.isArray(A) ? A : [A],
    O_Q = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = O_Q(A[B]);
      return A
    },
    CY6 = (A) => {
      return A != null
    };
  class M_Q {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function R_Q(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, NY6(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      __Q(G, null, Y, J)
    }
    return G
  }
  var UY6 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    qY6 = (A, Q) => {
      let B = {};
      for (let G in Q) __Q(B, A, Q, G);
      return B
    },
    NY6 = (A, Q, B) => {
      return R_Q(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    __Q = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = wY6, I = LY6, D = G] = J;
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
    wY6 = (A) => A != null,
    LY6 = (A) => A,
    OY6 = (A) => {
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
    MY6 = (A) => A.toISOString().replace(".000Z", "Z"),
    Kk1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(Kk1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = Kk1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(HYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return Vk1.collectBody
    }
  });
  Object.defineProperty(HYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return Vk1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(HYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return Vk1.resolvedPath
    }
  });
  HYA.Client = U_Q;
  HYA.Command = Fk1;
  HYA.NoOpLogger = M_Q;
  HYA.SENSITIVE_STRING = YY6;
  HYA.ServiceException = FYA;
  HYA._json = Kk1;
  HYA.convertMap = UY6;
  HYA.createAggregatedClient = JY6;
  HYA.decorateServiceException = N_Q;
  HYA.emitWarningIfUnsupportedVersion = WY6;
  HYA.getArrayIfSingleItem = $Y6;
  HYA.getDefaultClientConfiguration = EY6;
  HYA.getDefaultExtensionConfiguration = L_Q;
  HYA.getValueFromTextNode = O_Q;
  HYA.isSerializableHeaderValue = CY6;
  HYA.loadConfigsForDefaultMode = DY6;
  HYA.map = R_Q;
  HYA.resolveDefaultRuntimeConfig = zY6;
  HYA.serializeDateTime = MY6;
  HYA.serializeFloat = OY6;
  HYA.take = qY6;
  HYA.throwDefaultError = w_Q;
  HYA.withBaseException = XY6;
  Object.keys(z_Q).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(HYA, A)) Object.defineProperty(HYA, A, {
      enumerable: !0,
      get: function () {
        return z_Q[A]
      }
    })
  })
})
// @from(Ln 88133, Col 4)
P_Q = U((T_Q) => {
  Object.defineProperty(T_Q, "__esModule", {
    value: !0
  });
  T_Q.createGetRequest = tY6;
  T_Q.getCredentials = eY6;
  var Hk1 = PW(),
    oY6 = E_Q(),
    rY6 = j_Q(),
    sY6 = iS1();

  function tY6(A) {
    return new oY6.HttpRequest({
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
  async function eY6(A, Q) {
    let G = await (0, sY6.sdkStreamMixin)(A.body).transformToString();
    if (A.statusCode === 200) {
      let Z = JSON.parse(G);
      if (typeof Z.AccessKeyId !== "string" || typeof Z.SecretAccessKey !== "string" || typeof Z.Token !== "string" || typeof Z.Expiration !== "string") throw new Hk1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
        logger: Q
      });
      return {
        accessKeyId: Z.AccessKeyId,
        secretAccessKey: Z.SecretAccessKey,
        sessionToken: Z.Token,
        expiration: (0, rY6.parseRfc3339DateTime)(Z.Expiration)
      }
    }
    if (A.statusCode >= 400 && A.statusCode < 500) {
      let Z = {};
      try {
        Z = JSON.parse(G)
      } catch (Y) {}
      throw Object.assign(new Hk1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
        logger: Q
      }), {
        Code: Z.Code,
        Message: Z.Message
      })
    }
    throw new Hk1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
      logger: Q
    })
  }
})
// @from(Ln 88187, Col 4)
y_Q = U((S_Q) => {
  Object.defineProperty(S_Q, "__esModule", {
    value: !0
  });
  S_Q.retryWrapper = void 0;
  var BJ6 = (A, Q, B) => {
    return async () => {
      for (let G = 0; G < Q; ++G) try {
        return await A()
      } catch (Z) {
        await new Promise((Y) => setTimeout(Y, B))
      }
      return await A()
    }
  };
  S_Q.retryWrapper = BJ6
})
// @from(Ln 88204, Col 4)
h_Q = U((b_Q) => {
  Object.defineProperty(b_Q, "__esModule", {
    value: !0
  });
  b_Q.fromHttp = void 0;
  var GJ6 = LZ(),
    ZJ6 = Rq(),
    YJ6 = XL(),
    v_Q = PW(),
    JJ6 = GJ6.__importDefault(NA("fs/promises")),
    XJ6 = K_Q(),
    k_Q = P_Q(),
    IJ6 = y_Q(),
    DJ6 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    WJ6 = "http://169.254.170.2",
    KJ6 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    VJ6 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
    FJ6 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    HJ6 = (A = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
      let Q, B = A.awsContainerCredentialsRelativeUri ?? process.env[DJ6],
        G = A.awsContainerCredentialsFullUri ?? process.env[KJ6],
        Z = A.awsContainerAuthorizationToken ?? process.env[FJ6],
        Y = A.awsContainerAuthorizationTokenFile ?? process.env[VJ6],
        J = A.logger?.constructor?.name === "NoOpLogger" || !A.logger?.warn ? console.warn : A.logger.warn.bind(A.logger);
      if (B && G) J("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), J("awsContainerCredentialsFullUri will take precedence.");
      if (Z && Y) J("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), J("awsContainerAuthorizationToken will take precedence.");
      if (G) Q = G;
      else if (B) Q = `${WJ6}${B}`;
      else throw new v_Q.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
        logger: A.logger
      });
      let X = new URL(Q);
      (0, XJ6.checkUrl)(X, A.logger);
      let I = YJ6.NodeHttpHandler.create({
        requestTimeout: A.timeout ?? 1000,
        connectionTimeout: A.timeout ?? 1000
      });
      return (0, IJ6.retryWrapper)(async () => {
        let D = (0, k_Q.createGetRequest)(X);
        if (Z) D.headers.Authorization = Z;
        else if (Y) D.headers.Authorization = (await JJ6.default.readFile(Y)).toString();
        try {
          let W = await I.handle(D);
          return (0, k_Q.getCredentials)(W.response).then((K) => (0, ZJ6.setCredentialFeature)(K, "CREDENTIALS_HTTP", "z"))
        } catch (W) {
          throw new v_Q.CredentialsProviderError(String(W), {
            logger: A.logger
          })
        }
      }, A.maxRetries ?? 3, A.timeout ?? 1000)
    };
  b_Q.fromHttp = HJ6
})
// @from(Ln 88259, Col 4)
goA = U((Ek1) => {
  Object.defineProperty(Ek1, "__esModule", {
    value: !0
  });
  Ek1.fromHttp = void 0;
  var EJ6 = h_Q();
  Object.defineProperty(Ek1, "fromHttp", {
    enumerable: !0,
    get: function () {
      return EJ6.fromHttp
    }
  })
})
// @from(Ln 88272, Col 4)
o_Q = U((RJ6) => {
  var zk1 = IoA(),
    oi = rG(),
    g_Q = PW(),
    $J6 = Rq(),
    u_Q = Gy1(),
    m_Q = (A) => zk1.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0,
    $k1 = (A) => new Date(Date.now() + A),
    CJ6 = (A, Q) => Math.abs($k1(Q).getTime() - A) >= 300000,
    d_Q = (A, Q) => {
      let B = Date.parse(A);
      if (CJ6(B, Q)) return B - Date.now();
      return Q
    },
    FwA = (A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    },
    Ck1 = async (A) => {
      let Q = FwA("context", A.context),
        B = FwA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        Y = await FwA("signer", B.signer)(G),
        J = A?.signingRegion,
        X = A?.signingRegionSet,
        I = A?.signingName;
      return {
        config: B,
        signer: Y,
        signingRegion: J,
        signingRegionSet: X,
        signingName: I
      }
    };
  class uoA {
    async sign(A, Q, B) {
      if (!zk1.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
      let G = await Ck1(B),
        {
          config: Z,
          signer: Y
        } = G,
        {
          signingRegion: J,
          signingName: X
        } = G,
        I = B.context;
      if (I?.authSchemes?.length ?? !1) {
        let [W, K] = I.authSchemes;
        if (W?.name === "sigv4a" && K?.name === "sigv4") J = K?.signingRegion ?? J, X = K?.signingName ?? X
      }
      return await Y.sign(A, {
        signingDate: $k1(Z.systemClockOffset),
        signingRegion: J,
        signingService: X
      })
    }
    errorHandler(A) {
      return (Q) => {
        let B = Q.ServerTime ?? m_Q(Q.$response);
        if (B) {
          let G = FwA("config", A.config),
            Z = G.systemClockOffset;
          if (G.systemClockOffset = d_Q(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
        }
        throw Q
      }
    }
    successHandler(A, Q) {
      let B = m_Q(A);
      if (B) {
        let G = FwA("config", Q.config);
        G.systemClockOffset = d_Q(B, G.systemClockOffset)
      }
    }
  }
  var UJ6 = uoA;
  class i_Q extends uoA {
    async sign(A, Q, B) {
      if (!zk1.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
      let {
        config: G,
        signer: Z,
        signingRegion: Y,
        signingRegionSet: J,
        signingName: X
      } = await Ck1(B), D = (await G.sigv4aSigningRegionSet?.() ?? J ?? [Y]).join(",");
      return await Z.sign(A, {
        signingDate: $k1(G.systemClockOffset),
        signingRegion: D,
        signingService: X
      })
    }
  }
  var c_Q = (A) => typeof A === "string" && A.length > 0 ? A.split(",").map((Q) => Q.trim()) : [],
    n_Q = (A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`,
    p_Q = "AWS_AUTH_SCHEME_PREFERENCE",
    l_Q = "auth_scheme_preference",
    qJ6 = {
      environmentVariableSelector: (A, Q) => {
        if (Q?.signingName) {
          if (n_Q(Q.signingName) in A) return ["httpBearerAuth"]
        }
        if (!(p_Q in A)) return;
        return c_Q(A[p_Q])
      },
      configFileSelector: (A) => {
        if (!(l_Q in A)) return;
        return c_Q(A[l_Q])
      },
      default: []
    },
    NJ6 = (A) => {
      return A.sigv4aSigningRegionSet = oi.normalizeProvider(A.sigv4aSigningRegionSet), A
    },
    wJ6 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new g_Q.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new g_Q.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    a_Q = (A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(D) {
          if (D && D !== Q && D !== G) B = !0;
          Q = D;
          let W = OJ6(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            K = MJ6(A, W);
          if (B && !K.attributed) G = async (V) => K(V).then((F) => $J6.setCredentialFeature(F, "CREDENTIALS_CODE", "e")), G.memoized = K.memoized, G.configBound = K.configBound, G.attributed = !0;
          else G = K
        },
        get() {
          return G
        },
        enumerable: !0,
        configurable: !0
      }), A.credentials = Q;
      let {
        signingEscapePath: Z = !0,
        systemClockOffset: Y = A.systemClockOffset || 0,
        sha256: J
      } = A, X;
      if (A.signer) X = oi.normalizeProvider(A.signer);
      else if (A.regionInfoProvider) X = () => oi.normalizeProvider(A.region)().then(async (D) => [await A.regionInfoProvider(D, {
        useFipsEndpoint: await A.useFipsEndpoint(),
        useDualstackEndpoint: await A.useDualstackEndpoint()
      }) || {}, D]).then(([D, W]) => {
        let {
          signingRegion: K,
          signingService: V
        } = D;
        A.signingRegion = A.signingRegion || K || W, A.signingName = A.signingName || V || A.serviceId;
        let F = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: J,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || u_Q.SignatureV4)(F)
      });
      else X = async (D) => {
        D = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await oi.normalizeProvider(A.region)(),
          properties: {}
        }, D);
        let {
          signingRegion: W,
          signingName: K
        } = D;
        A.signingRegion = A.signingRegion || W, A.signingName = A.signingName || K || A.serviceId;
        let V = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: J,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || u_Q.SignatureV4)(V)
      };
      return Object.assign(A, {
        systemClockOffset: Y,
        signingEscapePath: Z,
        signer: X
      })
    },
    LJ6 = a_Q;

  function OJ6(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = oi.memoizeIdentityProvider(Q, oi.isIdentityExpired, oi.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = oi.normalizeProvider(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    };
    return G.memoized = !0, G
  }

  function MJ6(A, Q) {
    if (Q.configBound) return Q;
    let B = async (G) => Q({
      ...G,
      callerClientConfig: A
    });
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  RJ6.AWSSDKSigV4Signer = UJ6;
  RJ6.AwsSdkSigV4ASigner = i_Q;
  RJ6.AwsSdkSigV4Signer = uoA;
  RJ6.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = qJ6;
  RJ6.NODE_SIGV4A_CONFIG_OPTIONS = wJ6;
  RJ6.getBearerTokenEnvKey = n_Q;
  RJ6.resolveAWSSDKSigV4Config = LJ6;
  RJ6.resolveAwsSdkSigV4AConfig = NJ6;
  RJ6.resolveAwsSdkSigV4Config = a_Q;
  RJ6.validateSigningProperties = Ck1
})
// @from(Ln 88515, Col 4)
Mk1 = U((dJ6) => {
  dJ6.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(dJ6.HttpAuthLocation || (dJ6.HttpAuthLocation = {}));
  dJ6.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(dJ6.HttpApiKeyAuthLocation || (dJ6.HttpApiKeyAuthLocation = {}));
  dJ6.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(dJ6.EndpointURLScheme || (dJ6.EndpointURLScheme = {}));
  dJ6.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(dJ6.AlgorithmId || (dJ6.AlgorithmId = {}));
  var fJ6 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => dJ6.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => dJ6.AlgorithmId.MD5,
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
    hJ6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    gJ6 = (A) => {
      return fJ6(A)
    },
    uJ6 = (A) => {
      return hJ6(A)
    };
  dJ6.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(dJ6.FieldPosition || (dJ6.FieldPosition = {}));
  var mJ6 = "__smithy_context";
  dJ6.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(dJ6.IniSectionType || (dJ6.IniSectionType = {}));
  dJ6.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(dJ6.RequestHandlerProtocol || (dJ6.RequestHandlerProtocol = {}));
  dJ6.SMITHY_CONTEXT_KEY = mJ6;
  dJ6.getDefaultClientConfiguration = gJ6;
  dJ6.resolveDefaultRuntimeConfig = uJ6
})
// @from(Ln 88580, Col 4)
YC = U((zYA) => {
  var t_Q = Ev(),
    Pk1 = Mq(),
    _k1 = Mk1(),
    iJ6 = WX(),
    r_Q = Oq();
  class e_Q {
    config;
    middlewareStack = t_Q.constructStack();
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
  var Rk1 = "***SensitiveInformation***";

  function jk1(A, Q) {
    if (Q == null) return Q;
    let B = iJ6.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return Rk1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return Rk1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return Rk1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = jk1(J, G[Y]);
      return Z
    }
    return Q
  }
  class Sk1 {
    middlewareStack = t_Q.constructStack();
    schema;
    static classBuilder() {
      return new AjQ
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
          [_k1.SMITHY_CONTEXT_KEY]: {
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
  class AjQ {
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
      return Q = class extends Sk1 {
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
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? jk1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? jk1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var nJ6 = "***SensitiveInformation***",
    aJ6 = (A, Q) => {
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
  class EYA extends Error {
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
      return EYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === EYA) return EYA.isInstance(A);
      if (EYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var QjQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    BjQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = rJ6(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw QjQ(J, Q)
    },
    oJ6 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        BjQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    rJ6 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    sJ6 = (A) => {
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
    s_Q = !1,
    tJ6 = (A) => {
      if (A && !s_Q && parseInt(A.substring(1, A.indexOf("."))) < 16) s_Q = !0
    },
    eJ6 = (A) => {
      let Q = [];
      for (let B in _k1.AlgorithmId) {
        let G = _k1.AlgorithmId[B];
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
    AX6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    QX6 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    BX6 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    GjQ = (A) => {
      return Object.assign(eJ6(A), QX6(A))
    },
    GX6 = GjQ,
    ZX6 = (A) => {
      return Object.assign(AX6(A), BX6(A))
    },
    YX6 = (A) => Array.isArray(A) ? A : [A],
    ZjQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = ZjQ(A[B]);
      return A
    },
    JX6 = (A) => {
      return A != null
    };
  class YjQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function JjQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, DX6(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      XjQ(G, null, Y, J)
    }
    return G
  }
  var XX6 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    IX6 = (A, Q) => {
      let B = {};
      for (let G in Q) XjQ(B, A, Q, G);
      return B
    },
    DX6 = (A, Q, B) => {
      return JjQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    XjQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = WX6, I = KX6, D = G] = J;
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
    WX6 = (A) => A != null,
    KX6 = (A) => A,
    VX6 = (A) => {
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
    FX6 = (A) => A.toISOString().replace(".000Z", "Z"),
    Tk1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(Tk1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = Tk1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(zYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return Pk1.collectBody
    }
  });
  Object.defineProperty(zYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return Pk1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(zYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return Pk1.resolvedPath
    }
  });
  zYA.Client = e_Q;
  zYA.Command = Sk1;
  zYA.NoOpLogger = YjQ;
  zYA.SENSITIVE_STRING = nJ6;
  zYA.ServiceException = EYA;
  zYA._json = Tk1;
  zYA.convertMap = XX6;
  zYA.createAggregatedClient = aJ6;
  zYA.decorateServiceException = QjQ;
  zYA.emitWarningIfUnsupportedVersion = tJ6;
  zYA.getArrayIfSingleItem = YX6;
  zYA.getDefaultClientConfiguration = GX6;
  zYA.getDefaultExtensionConfiguration = GjQ;
  zYA.getValueFromTextNode = ZjQ;
  zYA.isSerializableHeaderValue = JX6;
  zYA.loadConfigsForDefaultMode = sJ6;
  zYA.map = JjQ;
  zYA.resolveDefaultRuntimeConfig = ZX6;
  zYA.serializeDateTime = FX6;
  zYA.serializeFloat = VX6;
  zYA.take = IX6;
  zYA.throwDefaultError = BjQ;
  zYA.withBaseException = oJ6;
  Object.keys(r_Q).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(zYA, A)) Object.defineProperty(zYA, A, {
      enumerable: !0,
      get: function () {
        return r_Q[A]
      }
    })
  })
})
// @from(Ln 89050, Col 4)
yk1 = U((IjQ) => {
  Object.defineProperty(IjQ, "__esModule", {
    value: !0
  });
  IjQ.resolveHttpAuthSchemeConfig = IjQ.defaultSSOOIDCHttpAuthSchemeProvider = IjQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
  var fX6 = hY(),
    xk1 = Jz(),
    hX6 = async (A, Q, B) => {
      return {
        operation: (0, xk1.getSmithyContext)(Q).operation,
        region: await (0, xk1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  IjQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = hX6;

  function gX6(A) {
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

  function uX6(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var mX6 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateToken": {
        Q.push(uX6(A));
        break
      }
      default:
        Q.push(gX6(A))
    }
    return Q
  };
  IjQ.defaultSSOOIDCHttpAuthSchemeProvider = mX6;
  var dX6 = (A) => {
    let Q = (0, fX6.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, xk1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  IjQ.resolveHttpAuthSchemeConfig = dX6
})
// @from(Ln 89109, Col 4)
moA = U((YZG, lX6) => {
  lX6.exports = {
    name: "@aws-sdk/nested-clients",
    version: "3.936.0",
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
    sideEffects: !1,
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
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
    files: ["./signin.d.ts", "./signin.js", "./sso-oidc.d.ts", "./sso-oidc.js", "./sts.d.ts", "./sts.js", "dist-*/**"],
    browser: {
      "./dist-es/submodules/signin/runtimeConfig": "./dist-es/submodules/signin/runtimeConfig.browser",
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
      "./package.json": "./package.json",
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
      },
      "./signin": {
        types: "./dist-types/submodules/signin/index.d.ts",
        module: "./dist-es/submodules/signin/index.js",
        node: "./dist-cjs/submodules/signin/index.js",
        import: "./dist-es/submodules/signin/index.js",
        require: "./dist-cjs/submodules/signin/index.js"
      }
    }
  }
})
// @from(Ln 89228, Col 4)
og = U((sX6) => {
  var WjQ = NA("os"),
    vk1 = NA("process"),
    iX6 = $v(),
    KjQ = {
      isCrtAvailable: !1
    },
    nX6 = () => {
      if (KjQ.isCrtAvailable) return ["md/crt-avail"];
      return null
    },
    VjQ = ({
      serviceId: A,
      clientVersion: Q
    }) => {
      return async (B) => {
        let G = [
            ["aws-sdk-js", Q],
            ["ua", "2.1"],
            [`os/${WjQ.platform()}`, WjQ.release()],
            ["lang/js"],
            ["md/nodejs", `${vk1.versions.node}`]
          ],
          Z = nX6();
        if (Z) G.push(Z);
        if (A) G.push([`api/${A}`, Q]);
        if (vk1.env.AWS_EXECUTION_ENV) G.push([`exec-env/${vk1.env.AWS_EXECUTION_ENV}`]);
        let Y = await B?.userAgentAppId?.();
        return Y ? [...G, [`app/${Y}`]] : [...G]
      }
    },
    aX6 = VjQ,
    FjQ = "AWS_SDK_UA_APP_ID",
    HjQ = "sdk_ua_app_id",
    oX6 = "sdk-ua-app-id",
    rX6 = {
      environmentVariableSelector: (A) => A[FjQ],
      configFileSelector: (A) => A[HjQ] ?? A[oX6],
      default: iX6.DEFAULT_UA_APP_ID
    };
  sX6.NODE_APP_ID_CONFIG_OPTIONS = rX6;
  sX6.UA_APP_ID_ENV_NAME = FjQ;
  sX6.UA_APP_ID_INI_NAME = HjQ;
  sX6.createDefaultUserAgentProvider = VjQ;
  sX6.crtAvailability = KjQ;
  sX6.defaultUserAgent = aX6
})
// @from(Ln 89275, Col 4)
EjQ = U((YI6) => {
  var ZI6 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  YI6.isArrayBuffer = ZI6
})
// @from(Ln 89279, Col 4)
zjQ = U((WI6) => {
  var XI6 = EjQ(),
    kk1 = NA("buffer"),
    II6 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!XI6.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return kk1.Buffer.from(A, Q, B)
    },
    DI6 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? kk1.Buffer.from(A, Q) : kk1.Buffer.from(A)
    };
  WI6.fromArrayBuffer = II6;
  WI6.fromString = DI6
})
// @from(Ln 89293, Col 4)
rg = U((EI6) => {
  var bk1 = zjQ(),
    FI6 = oG(),
    HI6 = NA("buffer"),
    $jQ = NA("crypto");
  class UjQ {
    algorithmIdentifier;
    secret;
    hash;
    constructor(A, Q) {
      this.algorithmIdentifier = A, this.secret = Q, this.reset()
    }
    update(A, Q) {
      this.hash.update(FI6.toUint8Array(CjQ(A, Q)))
    }
    digest() {
      return Promise.resolve(this.hash.digest())
    }
    reset() {
      this.hash = this.secret ? $jQ.createHmac(this.algorithmIdentifier, CjQ(this.secret)) : $jQ.createHash(this.algorithmIdentifier)
    }
  }

  function CjQ(A, Q) {
    if (HI6.Buffer.isBuffer(A)) return A;
    if (typeof A === "string") return bk1.fromString(A, Q);
    if (ArrayBuffer.isView(A)) return bk1.fromArrayBuffer(A.buffer, A.byteOffset, A.byteLength);
    return bk1.fromArrayBuffer(A)
  }
  EI6.Hash = UjQ
})
// @from(Ln 89324, Col 4)
sg = U((CI6) => {
  var fk1 = NA("node:fs"),
    $I6 = (A) => {
      if (!A) return 0;
      if (typeof A === "string") return Buffer.byteLength(A);
      else if (typeof A.byteLength === "number") return A.byteLength;
      else if (typeof A.size === "number") return A.size;
      else if (typeof A.start === "number" && typeof A.end === "number") return A.end + 1 - A.start;
      else if (A instanceof fk1.ReadStream) {
        if (A.path != null) return fk1.lstatSync(A.path).size;
        else if (typeof A.fd === "number") return fk1.fstatSync(A.fd).size
      }
      throw Error(`Body Length computation failed for ${A}`)
    };
  CI6.calculateBodyLength = $I6
})