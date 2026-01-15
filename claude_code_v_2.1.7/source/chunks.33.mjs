
// @from(Ln 83996, Col 4)
$v = U((W46) => {
  var t96 = rG(),
    e96 = Hv(),
    A46 = nwQ(),
    zv = hY(),
    cOQ = void 0;

  function Q46(A) {
    if (A === void 0) return !0;
    return typeof A === "string" && A.length <= 50
  }

  function B46(A) {
    let Q = t96.normalizeProvider(A.userAgentAppId ?? cOQ),
      {
        customUserAgent: B
      } = A;
    return Object.assign(A, {
      customUserAgent: typeof B === "string" ? [
        [B]
      ] : B,
      userAgentAppId: async () => {
        let G = await Q();
        if (!Q46(G)) {
          let Z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
          if (typeof G !== "string") Z?.warn("userAgentAppId must be a string or undefined.");
          else if (G.length > 50) Z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
        }
        return G
      }
    })
  }
  var G46 = /\d{12}\.ddb/;
  async function Z46(A, Q, B) {
    if (B.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") zv.setFeature(A, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof Q.retryStrategy === "function") {
      let Y = await Q.retryStrategy();
      if (typeof Y.acquireInitialRetryToken === "function")
        if (Y.constructor?.name?.includes("Adaptive")) zv.setFeature(A, "RETRY_MODE_ADAPTIVE", "F");
        else zv.setFeature(A, "RETRY_MODE_STANDARD", "E");
      else zv.setFeature(A, "RETRY_MODE_LEGACY", "D")
    }
    if (typeof Q.accountIdEndpointMode === "function") {
      let Y = A.endpointV2;
      if (String(Y?.url?.hostname).match(G46)) zv.setFeature(A, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await Q.accountIdEndpointMode?.()) {
        case "disabled":
          zv.setFeature(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          zv.setFeature(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          zv.setFeature(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break
      }
    }
    let Z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (Z?.$source) {
      let Y = Z;
      if (Y.accountId) zv.setFeature(A, "RESOLVED_ACCOUNT_ID", "T");
      for (let [J, X] of Object.entries(Y.$source ?? {})) zv.setFeature(A, J, X)
    }
  }
  var uOQ = "user-agent",
    cy1 = "x-amz-user-agent",
    mOQ = " ",
    py1 = "/",
    Y46 = /[^!$%&'*+\-.^_`|~\w]/g,
    J46 = /[^!$%&'*+\-.^_`|~\w#]/g,
    dOQ = "-",
    X46 = 1024;

  function I46(A) {
    let Q = "";
    for (let B in A) {
      let G = A[B];
      if (Q.length + G.length + 1 <= X46) {
        if (Q.length) Q += "," + G;
        else Q += G;
        continue
      }
      break
    }
    return Q
  }
  var pOQ = (A) => (Q, B) => async (G) => {
    let {
      request: Z
    } = G;
    if (!A46.HttpRequest.isInstance(Z)) return Q(G);
    let {
      headers: Y
    } = Z, J = B?.userAgent?.map(MoA) || [], X = (await A.defaultUserAgentProvider()).map(MoA);
    await Z46(B, A, G);
    let I = B;
    X.push(`m/${I46(Object.assign({},B.__smithy_context?.features,I.__aws_sdk_context?.features))}`);
    let D = A?.customUserAgent?.map(MoA) || [],
      W = await A.userAgentAppId();
    if (W) X.push(MoA(["app", `${W}`]));
    let K = e96.getUserAgentPrefix(),
      V = (K ? [K] : []).concat([...X, ...J, ...D]).join(mOQ),
      F = [...X.filter((H) => H.startsWith("aws-sdk-")), ...D].join(mOQ);
    if (A.runtime !== "browser") {
      if (F) Y[cy1] = Y[cy1] ? `${Y[uOQ]} ${F}` : F;
      Y[uOQ] = V
    } else Y[cy1] = V;
    return Q({
      ...G,
      request: Z
    })
  }, MoA = (A) => {
    let Q = A[0].split(py1).map((J) => J.replace(Y46, dOQ)).join(py1),
      B = A[1]?.replace(J46, dOQ),
      G = Q.indexOf(py1),
      Z = Q.substring(0, G),
      Y = Q.substring(G + 1);
    if (Z === "api") Y = Y.toLowerCase();
    return [Z, Y, B].filter((J) => J && J.length > 0).reduce((J, X, I) => {
      switch (I) {
        case 0:
          return X;
        case 1:
          return `${J}/${X}`;
        default:
          return `${J}#${X}`
      }
    }, "")
  }, lOQ = {
    name: "getUserAgentMiddleware",
    step: "build",
    priority: "low",
    tags: ["SET_USER_AGENT", "USER_AGENT"],
    override: !0
  }, D46 = (A) => ({
    applyToStack: (Q) => {
      Q.add(pOQ(A), lOQ)
    }
  });
  W46.DEFAULT_UA_APP_ID = cOQ;
  W46.getUserAgentMiddlewareOptions = lOQ;
  W46.getUserAgentPlugin = D46;
  W46.resolveUserAgentConfig = B46;
  W46.userAgentMiddleware = pOQ
})
// @from(Ln 84141, Col 4)
iOQ = U((C46) => {
  var z46 = (A, Q, B) => {
      if (!(Q in A)) return;
      if (A[Q] === "true") return !0;
      if (A[Q] === "false") return !1;
      throw Error(`Cannot load ${B} "${Q}". Expected "true" or "false", got ${A[Q]}.`)
    },
    $46 = (A, Q, B) => {
      if (!(Q in A)) return;
      let G = parseInt(A[Q], 10);
      if (Number.isNaN(G)) throw TypeError(`Cannot load ${B} '${Q}'. Expected number, got '${A[Q]}'.`);
      return G
    };
  C46.SelectorType = void 0;
  (function (A) {
    A.ENV = "env", A.CONFIG = "shared config entry"
  })(C46.SelectorType || (C46.SelectorType = {}));
  C46.booleanSelector = z46;
  C46.numberSelector = $46
})
// @from(Ln 84161, Col 4)
RD = U((h46) => {
  var ni = iOQ(),
    RoA = Jz(),
    N46 = xT(),
    oOQ = "AWS_USE_DUALSTACK_ENDPOINT",
    rOQ = "use_dualstack_endpoint",
    w46 = !1,
    L46 = {
      environmentVariableSelector: (A) => ni.booleanSelector(A, oOQ, ni.SelectorType.ENV),
      configFileSelector: (A) => ni.booleanSelector(A, rOQ, ni.SelectorType.CONFIG),
      default: !1
    },
    sOQ = "AWS_USE_FIPS_ENDPOINT",
    tOQ = "use_fips_endpoint",
    O46 = !1,
    M46 = {
      environmentVariableSelector: (A) => ni.booleanSelector(A, sOQ, ni.SelectorType.ENV),
      configFileSelector: (A) => ni.booleanSelector(A, tOQ, ni.SelectorType.CONFIG),
      default: !1
    },
    R46 = (A) => {
      let {
        tls: Q,
        endpoint: B,
        urlParser: G,
        useDualstackEndpoint: Z
      } = A;
      return Object.assign(A, {
        tls: Q ?? !0,
        endpoint: RoA.normalizeProvider(typeof B === "string" ? G(B) : B),
        isCustomEndpoint: !0,
        useDualstackEndpoint: RoA.normalizeProvider(Z ?? !1)
      })
    },
    _46 = async (A) => {
      let {
        tls: Q = !0
      } = A, B = await A.region();
      if (!new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/).test(B)) throw Error("Invalid region in client config");
      let Z = await A.useDualstackEndpoint(),
        Y = await A.useFipsEndpoint(),
        {
          hostname: J
        } = await A.regionInfoProvider(B, {
          useDualstackEndpoint: Z,
          useFipsEndpoint: Y
        }) ?? {};
      if (!J) throw Error("Cannot resolve hostname from client config");
      return A.urlParser(`${Q?"https:":"http:"}//${J}`)
    }, j46 = (A) => {
      let Q = RoA.normalizeProvider(A.useDualstackEndpoint ?? !1),
        {
          endpoint: B,
          useFipsEndpoint: G,
          urlParser: Z,
          tls: Y
        } = A;
      return Object.assign(A, {
        tls: Y ?? !0,
        endpoint: B ? RoA.normalizeProvider(typeof B === "string" ? Z(B) : B) : () => _46({
          ...A,
          useDualstackEndpoint: Q,
          useFipsEndpoint: G
        }),
        isCustomEndpoint: !!B,
        useDualstackEndpoint: Q
      })
    }, eOQ = "AWS_REGION", AMQ = "region", T46 = {
      environmentVariableSelector: (A) => A[eOQ],
      configFileSelector: (A) => A[AMQ],
      default: () => {
        throw Error("Region is missing")
      }
    }, P46 = {
      preferredFile: "credentials"
    }, nOQ = new Set, S46 = (A, Q = N46.isValidHostLabel) => {
      if (!nOQ.has(A) && !Q(A))
        if (A === "*") console.warn('@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.');
        else throw Error(`Region not accepted: region="${A}" is not a valid hostname component.`);
      else nOQ.add(A)
    }, QMQ = (A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), x46 = (A) => QMQ(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, y46 = (A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: async () => {
          let G = typeof Q === "function" ? await Q() : Q,
            Z = x46(G);
          return S46(Z), Z
        },
        useFipsEndpoint: async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (QMQ(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }
      })
    }, aOQ = (A = [], {
      useFipsEndpoint: Q,
      useDualstackEndpoint: B
    }) => A.find(({
      tags: G
    }) => Q === G.includes("fips") && B === G.includes("dualstack"))?.hostname, v46 = (A, {
      regionHostname: Q,
      partitionHostname: B
    }) => Q ? Q : B ? B.replace("{region}", A) : void 0, k46 = (A, {
      partitionHash: Q
    }) => Object.keys(Q || {}).find((B) => Q[B].regions.includes(A)) ?? "aws", b46 = (A, {
      signingRegion: Q,
      regionRegex: B,
      useFipsEndpoint: G
    }) => {
      if (Q) return Q;
      else if (G) {
        let Z = B.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\."),
          Y = A.match(Z);
        if (Y) return Y[0].slice(1, -1)
      }
    }, f46 = (A, {
      useFipsEndpoint: Q = !1,
      useDualstackEndpoint: B = !1,
      signingService: G,
      regionHash: Z,
      partitionHash: Y
    }) => {
      let J = k46(A, {
          partitionHash: Y
        }),
        X = A in Z ? A : Y[J]?.endpoint ?? A,
        I = {
          useFipsEndpoint: Q,
          useDualstackEndpoint: B
        },
        D = aOQ(Z[X]?.variants, I),
        W = aOQ(Y[J]?.variants, I),
        K = v46(X, {
          regionHostname: D,
          partitionHostname: W
        });
      if (K === void 0) throw Error(`Endpoint resolution failed for: ${{resolvedRegion:X,useFipsEndpoint:Q,useDualstackEndpoint:B}}`);
      let V = b46(K, {
        signingRegion: Z[X]?.signingRegion,
        regionRegex: Y[J].regionRegex,
        useFipsEndpoint: Q
      });
      return {
        partition: J,
        signingService: G,
        hostname: K,
        ...V && {
          signingRegion: V
        },
        ...Z[X]?.signingService && {
          signingService: Z[X].signingService
        }
      }
    };
  h46.CONFIG_USE_DUALSTACK_ENDPOINT = rOQ;
  h46.CONFIG_USE_FIPS_ENDPOINT = tOQ;
  h46.DEFAULT_USE_DUALSTACK_ENDPOINT = w46;
  h46.DEFAULT_USE_FIPS_ENDPOINT = O46;
  h46.ENV_USE_DUALSTACK_ENDPOINT = oOQ;
  h46.ENV_USE_FIPS_ENDPOINT = sOQ;
  h46.NODE_REGION_CONFIG_FILE_OPTIONS = P46;
  h46.NODE_REGION_CONFIG_OPTIONS = T46;
  h46.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = L46;
  h46.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = M46;
  h46.REGION_ENV_NAME = eOQ;
  h46.REGION_INI_NAME = AMQ;
  h46.getRegionInfo = f46;
  h46.resolveCustomEndpointsConfig = R46;
  h46.resolveEndpointsConfig = j46;
  h46.resolveRegionConfig = y46
})
// @from(Ln 84336, Col 4)
BMQ = U((J66) => {
  J66.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(J66.HttpAuthLocation || (J66.HttpAuthLocation = {}));
  J66.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(J66.HttpApiKeyAuthLocation || (J66.HttpApiKeyAuthLocation = {}));
  J66.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(J66.EndpointURLScheme || (J66.EndpointURLScheme = {}));
  J66.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(J66.AlgorithmId || (J66.AlgorithmId = {}));
  var Q66 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => J66.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => J66.AlgorithmId.MD5,
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
    B66 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    G66 = (A) => {
      return Q66(A)
    },
    Z66 = (A) => {
      return B66(A)
    };
  J66.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(J66.FieldPosition || (J66.FieldPosition = {}));
  var Y66 = "__smithy_context";
  J66.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(J66.IniSectionType || (J66.IniSectionType = {}));
  J66.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(J66.RequestHandlerProtocol || (J66.RequestHandlerProtocol = {}));
  J66.SMITHY_CONTEXT_KEY = Y66;
  J66.getDefaultClientConfiguration = G66;
  J66.resolveDefaultRuntimeConfig = Z66
})
// @from(Ln 84401, Col 4)
JMQ = U((E66) => {
  var W66 = BMQ(),
    K66 = (A) => {
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
    V66 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class GMQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = W66.FieldPosition.HEADER,
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
  class ZMQ {
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
  class _oA {
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
      let Q = new _oA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = F66(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return _oA.clone(this)
    }
  }

  function F66(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class YMQ {
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

  function H66(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  E66.Field = GMQ;
  E66.Fields = ZMQ;
  E66.HttpRequest = _oA;
  E66.HttpResponse = YMQ;
  E66.getHttpHandlerExtensionConfiguration = K66;
  E66.isValidHostname = H66;
  E66.resolveHttpHandlerRuntimeConfig = V66
})
// @from(Ln 84543, Col 4)
ag = U((M66) => {
  var L66 = JMQ(),
    XMQ = "content-length";

  function IMQ(A) {
    return (Q) => async (B) => {
      let G = B.request;
      if (L66.HttpRequest.isInstance(G)) {
        let {
          body: Z,
          headers: Y
        } = G;
        if (Z && Object.keys(Y).map((J) => J.toLowerCase()).indexOf(XMQ) === -1) try {
          let J = A(Z);
          G.headers = {
            ...G.headers,
            [XMQ]: String(J)
          }
        } catch (J) {}
      }
      return Q({
        ...B,
        request: G
      })
    }
  }
  var DMQ = {
      step: "build",
      tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
      name: "contentLengthMiddleware",
      override: !0
    },
    O66 = (A) => ({
      applyToStack: (Q) => {
        Q.add(IMQ(A.bodyLengthChecker), DMQ)
      }
    });
  M66.contentLengthMiddleware = IMQ;
  M66.contentLengthMiddlewareOptions = DMQ;
  M66.getContentLengthPlugin = O66
})
// @from(Ln 84584, Col 4)
ey1 = U((WMQ) => {
  Object.defineProperty(WMQ, "__esModule", {
    value: !0
  });
  WMQ.getHomeDir = void 0;
  var T66 = NA("os"),
    P66 = NA("path"),
    ty1 = {},
    S66 = () => {
      if (process && process.geteuid) return `${process.geteuid()}`;
      return "DEFAULT"
    },
    x66 = () => {
      let {
        HOME: A,
        USERPROFILE: Q,
        HOMEPATH: B,
        HOMEDRIVE: G = `C:${P66.sep}`
      } = process.env;
      if (A) return A;
      if (Q) return Q;
      if (B) return `${G}${B}`;
      let Z = S66();
      if (!ty1[Z]) ty1[Z] = (0, T66.homedir)();
      return ty1[Z]
    };
  WMQ.getHomeDir = x66
})
// @from(Ln 84612, Col 4)
Av1 = U((VMQ) => {
  Object.defineProperty(VMQ, "__esModule", {
    value: !0
  });
  VMQ.getSSOTokenFilepath = void 0;
  var y66 = NA("crypto"),
    v66 = NA("path"),
    k66 = ey1(),
    b66 = (A) => {
      let B = (0, y66.createHash)("sha1").update(A).digest("hex");
      return (0, v66.join)((0, k66.getHomeDir)(), ".aws", "sso", "cache", `${B}.json`)
    };
  VMQ.getSSOTokenFilepath = b66
})
// @from(Ln 84626, Col 4)
zMQ = U((HMQ) => {
  Object.defineProperty(HMQ, "__esModule", {
    value: !0
  });
  HMQ.getSSOTokenFromFile = HMQ.tokenIntercept = void 0;
  var f66 = NA("fs/promises"),
    h66 = Av1();
  HMQ.tokenIntercept = {};
  var g66 = async (A) => {
    if (HMQ.tokenIntercept[A]) return HMQ.tokenIntercept[A];
    let Q = (0, h66.getSSOTokenFilepath)(A),
      B = await (0, f66.readFile)(Q, "utf8");
    return JSON.parse(B)
  };
  HMQ.getSSOTokenFromFile = g66
})
// @from(Ln 84642, Col 4)
$MQ = U((l66) => {
  l66.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(l66.HttpAuthLocation || (l66.HttpAuthLocation = {}));
  l66.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(l66.HttpApiKeyAuthLocation || (l66.HttpApiKeyAuthLocation = {}));
  l66.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(l66.EndpointURLScheme || (l66.EndpointURLScheme = {}));
  l66.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(l66.AlgorithmId || (l66.AlgorithmId = {}));
  var u66 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => l66.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => l66.AlgorithmId.MD5,
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
    m66 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    d66 = (A) => {
      return u66(A)
    },
    c66 = (A) => {
      return m66(A)
    };
  l66.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(l66.FieldPosition || (l66.FieldPosition = {}));
  var p66 = "__smithy_context";
  l66.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(l66.IniSectionType || (l66.IniSectionType = {}));
  l66.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(l66.RequestHandlerProtocol || (l66.RequestHandlerProtocol = {}));
  l66.SMITHY_CONTEXT_KEY = p66;
  l66.getDefaultClientConfiguration = d66;
  l66.resolveDefaultRuntimeConfig = c66
})
// @from(Ln 84707, Col 4)
qMQ = U((CMQ) => {
  Object.defineProperty(CMQ, "__esModule", {
    value: !0
  });
  CMQ.readFile = CMQ.fileIntercept = CMQ.filePromises = void 0;
  var o66 = NA("node:fs/promises");
  CMQ.filePromises = {};
  CMQ.fileIntercept = {};
  var r66 = (A, Q) => {
    if (CMQ.fileIntercept[A] !== void 0) return CMQ.fileIntercept[A];
    if (!CMQ.filePromises[A] || Q?.ignoreCache) CMQ.filePromises[A] = (0, o66.readFile)(A, "utf8");
    return CMQ.filePromises[A]
  };
  CMQ.readFile = r66
})
// @from(Ln 84722, Col 4)
Cv = U((F0A) => {
  var ZwA = ey1(),
    NMQ = Av1(),
    Dv1 = zMQ(),
    ToA = NA("path"),
    PoA = $MQ(),
    YYA = qMQ(),
    LMQ = "AWS_PROFILE",
    OMQ = "default",
    s66 = (A) => A.profile || process.env[LMQ] || OMQ,
    V0A = ".",
    t66 = (A) => Object.entries(A).filter(([Q]) => {
      let B = Q.indexOf(V0A);
      if (B === -1) return !1;
      return Object.values(PoA.IniSectionType).includes(Q.substring(0, B))
    }).reduce((Q, [B, G]) => {
      let Z = B.indexOf(V0A),
        Y = B.substring(0, Z) === PoA.IniSectionType.PROFILE ? B.substring(Z + 1) : B;
      return Q[Y] = G, Q
    }, {
      ...A.default && {
        default: A.default
      }
    }),
    e66 = "AWS_CONFIG_FILE",
    MMQ = () => process.env[e66] || ToA.join(ZwA.getHomeDir(), ".aws", "config"),
    A36 = "AWS_SHARED_CREDENTIALS_FILE",
    Q36 = () => process.env[A36] || ToA.join(ZwA.getHomeDir(), ".aws", "credentials"),
    B36 = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/,
    G36 = ["__proto__", "profile __proto__"],
    Wv1 = (A) => {
      let Q = {},
        B, G;
      for (let Z of A.split(/\r?\n/)) {
        let Y = Z.split(/(^|\s)[;#]/)[0].trim();
        if (Y[0] === "[" && Y[Y.length - 1] === "]") {
          B = void 0, G = void 0;
          let X = Y.substring(1, Y.length - 1),
            I = B36.exec(X);
          if (I) {
            let [, D, , W] = I;
            if (Object.values(PoA.IniSectionType).includes(D)) B = [D, W].join(V0A)
          } else B = X;
          if (G36.includes(X)) throw Error(`Found invalid profile name "${X}"`)
        } else if (B) {
          let X = Y.indexOf("=");
          if (![0, -1].includes(X)) {
            let [I, D] = [Y.substring(0, X).trim(), Y.substring(X + 1).trim()];
            if (D === "") G = I;
            else {
              if (G && Z.trimStart() === Z) G = void 0;
              Q[B] = Q[B] || {};
              let W = G ? [G, I].join(V0A) : I;
              Q[B][W] = D
            }
          }
        }
      }
      return Q
    },
    wMQ = () => ({}),
    RMQ = async (A = {}) => {
      let {
        filepath: Q = Q36(),
        configFilepath: B = MMQ()
      } = A, G = ZwA.getHomeDir(), Z = "~/", Y = Q;
      if (Q.startsWith("~/")) Y = ToA.join(G, Q.slice(2));
      let J = B;
      if (B.startsWith("~/")) J = ToA.join(G, B.slice(2));
      let X = await Promise.all([YYA.readFile(J, {
        ignoreCache: A.ignoreCache
      }).then(Wv1).then(t66).catch(wMQ), YYA.readFile(Y, {
        ignoreCache: A.ignoreCache
      }).then(Wv1).catch(wMQ)]);
      return {
        configFile: X[0],
        credentialsFile: X[1]
      }
    }, Z36 = (A) => Object.entries(A).filter(([Q]) => Q.startsWith(PoA.IniSectionType.SSO_SESSION + V0A)).reduce((Q, [B, G]) => ({
      ...Q,
      [B.substring(B.indexOf(V0A) + 1)]: G
    }), {}), Y36 = () => ({}), J36 = async (A = {}) => YYA.readFile(A.configFilepath ?? MMQ()).then(Wv1).then(Z36).catch(Y36), X36 = (...A) => {
      let Q = {};
      for (let B of A)
        for (let [G, Z] of Object.entries(B))
          if (Q[G] !== void 0) Object.assign(Q[G], Z);
          else Q[G] = Z;
      return Q
    }, I36 = async (A) => {
      let Q = await RMQ(A);
      return X36(Q.configFile, Q.credentialsFile)
    }, D36 = {
      getFileRecord() {
        return YYA.fileIntercept
      },
      interceptFile(A, Q) {
        YYA.fileIntercept[A] = Promise.resolve(Q)
      },
      getTokenRecord() {
        return Dv1.tokenIntercept
      },
      interceptToken(A, Q) {
        Dv1.tokenIntercept[A] = Q
      }
    };
  Object.defineProperty(F0A, "getSSOTokenFromFile", {
    enumerable: !0,
    get: function () {
      return Dv1.getSSOTokenFromFile
    }
  });
  Object.defineProperty(F0A, "readFile", {
    enumerable: !0,
    get: function () {
      return YYA.readFile
    }
  });
  F0A.CONFIG_PREFIX_SEPARATOR = V0A;
  F0A.DEFAULT_PROFILE = OMQ;
  F0A.ENV_PROFILE = LMQ;
  F0A.externalDataInterceptor = D36;
  F0A.getProfileName = s66;
  F0A.loadSharedConfigFiles = RMQ;
  F0A.loadSsoSessionData = J36;
  F0A.parseKnownFiles = I36;
  Object.keys(ZwA).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(F0A, A)) Object.defineProperty(F0A, A, {
      enumerable: !0,
      get: function () {
        return ZwA[A]
      }
    })
  });
  Object.keys(NMQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(F0A, A)) Object.defineProperty(F0A, A, {
      enumerable: !0,
      get: function () {
        return NMQ[A]
      }
    })
  })
})
// @from(Ln 84864, Col 4)
_q = U((L36) => {
  var YwA = PW(),
    _MQ = Cv();

  function jMQ(A) {
    try {
      let Q = new Set(Array.from(A.match(/([A-Z_]){3,}/g) ?? []));
      return Q.delete("CONFIG"), Q.delete("CONFIG_PREFIX_SEPARATOR"), Q.delete("ENV"), [...Q].join(", ")
    } catch (Q) {
      return A
    }
  }
  var C36 = (A, Q) => async () => {
    try {
      let B = A(process.env, Q);
      if (B === void 0) throw Error();
      return B
    } catch (B) {
      throw new YwA.CredentialsProviderError(B.message || `Not found in ENV: ${jMQ(A.toString())}`, {
        logger: Q?.logger
      })
    }
  }, U36 = (A, {
    preferredFile: Q = "config",
    ...B
  } = {}) => async () => {
    let G = _MQ.getProfileName(B),
      {
        configFile: Z,
        credentialsFile: Y
      } = await _MQ.loadSharedConfigFiles(B),
      J = Y[G] || {},
      X = Z[G] || {},
      I = Q === "config" ? {
        ...J,
        ...X
      } : {
        ...X,
        ...J
      };
    try {
      let W = A(I, Q === "config" ? Z : Y);
      if (W === void 0) throw Error();
      return W
    } catch (D) {
      throw new YwA.CredentialsProviderError(D.message || `Not found in config files w/ profile [${G}]: ${jMQ(A.toString())}`, {
        logger: B.logger
      })
    }
  }, q36 = (A) => typeof A === "function", N36 = (A) => q36(A) ? async () => await A(): YwA.fromStatic(A), w36 = ({
    environmentVariableSelector: A,
    configFileSelector: Q,
    default: B
  }, G = {}) => {
    let {
      signingName: Z,
      logger: Y
    } = G, J = {
      signingName: Z,
      logger: Y
    };
    return YwA.memoize(YwA.chain(C36(A, J), U36(Q, G), N36(B)))
  };
  L36.loadConfig = w36
})
// @from(Ln 84929, Col 4)
vMQ = U((xMQ) => {
  Object.defineProperty(xMQ, "__esModule", {
    value: !0
  });
  xMQ.getEndpointUrlConfig = void 0;
  var TMQ = Cv(),
    PMQ = "AWS_ENDPOINT_URL",
    SMQ = "endpoint_url",
    M36 = (A) => ({
      environmentVariableSelector: (Q) => {
        let B = A.split(" ").map((Y) => Y.toUpperCase()),
          G = Q[[PMQ, ...B].join("_")];
        if (G) return G;
        let Z = Q[PMQ];
        if (Z) return Z;
        return
      },
      configFileSelector: (Q, B) => {
        if (B && Q.services) {
          let Z = B[["services", Q.services].join(TMQ.CONFIG_PREFIX_SEPARATOR)];
          if (Z) {
            let Y = A.split(" ").map((X) => X.toLowerCase()),
              J = Z[[Y.join("_"), SMQ].join(TMQ.CONFIG_PREFIX_SEPARATOR)];
            if (J) return J
          }
        }
        let G = Q[SMQ];
        if (G) return G;
        return
      },
      default: void 0
    });
  xMQ.getEndpointUrlConfig = M36
})
// @from(Ln 84963, Col 4)
fMQ = U((kMQ) => {
  Object.defineProperty(kMQ, "__esModule", {
    value: !0
  });
  kMQ.getEndpointFromConfig = void 0;
  var R36 = _q(),
    _36 = vMQ(),
    j36 = async (A) => (0, R36.loadConfig)((0, _36.getEndpointUrlConfig)(A ?? ""))();
  kMQ.getEndpointFromConfig = j36
})
// @from(Ln 84973, Col 4)
yT = U((m36) => {
  var gMQ = fMQ(),
    hMQ = oM(),
    T36 = rG(),
    SoA = Jz(),
    P36 = wS1(),
    S36 = async (A) => {
      let Q = A?.Bucket || "";
      if (typeof A.Bucket === "string") A.Bucket = Q.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
      if (b36(Q)) {
        if (A.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets")
      } else if (!k36(Q) || Q.indexOf(".") !== -1 && !String(A.Endpoint).startsWith("http:") || Q.toLowerCase() !== Q || Q.length < 3) A.ForcePathStyle = !0;
      if (A.DisableMultiRegionAccessPoints) A.disableMultiRegionAccessPoints = !0, A.DisableMRAP = !0;
      return A
    }, x36 = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/, y36 = /(\d+\.){3}\d+/, v36 = /\.\./, k36 = (A) => x36.test(A) && !y36.test(A) && !v36.test(A), b36 = (A) => {
      let [Q, B, G, , , Z] = A.split(":"), Y = Q === "arn" && A.split(":").length >= 6, J = Boolean(Y && B && G && Z);
      if (Y && !J) throw Error(`Invalid ARN: ${A} was an invalid ARN.`);
      return J
    }, f36 = (A, Q, B) => {
      let G = async () => {
        let Z = B[A] ?? B[Q];
        if (typeof Z === "function") return Z();
        return Z
      };
      if (A === "credentialScope" || Q === "CredentialScope") return async () => {
        let Z = typeof B.credentials === "function" ? await B.credentials() : B.credentials;
        return Z?.credentialScope ?? Z?.CredentialScope
      };
      if (A === "accountId" || Q === "AccountId") return async () => {
        let Z = typeof B.credentials === "function" ? await B.credentials() : B.credentials;
        return Z?.accountId ?? Z?.AccountId
      };
      if (A === "endpoint" || Q === "endpoint") return async () => {
        if (B.isCustomEndpoint === !1) return;
        let Z = await G();
        if (Z && typeof Z === "object") {
          if ("url" in Z) return Z.url.href;
          if ("hostname" in Z) {
            let {
              protocol: Y,
              hostname: J,
              port: X,
              path: I
            } = Z;
            return `${Y}//${J}${X?":"+X:""}${I}`
          }
        }
        return Z
      };
      return G
    }, Kv1 = (A) => {
      if (typeof A === "object") {
        if ("url" in A) return hMQ.parseUrl(A.url);
        return A
      }
      return hMQ.parseUrl(A)
    }, uMQ = async (A, Q, B, G) => {
      if (!B.isCustomEndpoint) {
        let J;
        if (B.serviceConfiguredEndpoint) J = await B.serviceConfiguredEndpoint();
        else J = await gMQ.getEndpointFromConfig(B.serviceId);
        if (J) B.endpoint = () => Promise.resolve(Kv1(J)), B.isCustomEndpoint = !0
      }
      let Z = await mMQ(A, Q, B);
      if (typeof B.endpointProvider !== "function") throw Error("config.endpointProvider is not set.");
      return B.endpointProvider(Z, G)
    }, mMQ = async (A, Q, B) => {
      let G = {},
        Z = Q?.getEndpointParameterInstructions?.() || {};
      for (let [Y, J] of Object.entries(Z)) switch (J.type) {
        case "staticContextParams":
          G[Y] = J.value;
          break;
        case "contextParams":
          G[Y] = A[J.name];
          break;
        case "clientContextParams":
        case "builtInParams":
          G[Y] = await f36(J.name, Y, B)();
          break;
        case "operationContextParams":
          G[Y] = J.get(A);
          break;
        default:
          throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(J))
      }
      if (Object.keys(Z).length === 0) Object.assign(G, B);
      if (String(B.serviceId).toLowerCase() === "s3") await S36(G);
      return G
    }, dMQ = ({
      config: A,
      instructions: Q
    }) => {
      return (B, G) => async (Z) => {
        if (A.isCustomEndpoint) T36.setFeature(G, "ENDPOINT_OVERRIDE", "N");
        let Y = await uMQ(Z.input, {
          getEndpointParameterInstructions() {
            return Q
          }
        }, {
          ...A
        }, G);
        G.endpointV2 = Y, G.authSchemes = Y.properties?.authSchemes;
        let J = G.authSchemes?.[0];
        if (J) {
          G.signing_region = J.signingRegion, G.signing_service = J.signingName;
          let I = SoA.getSmithyContext(G)?.selectedHttpAuthScheme?.httpAuthOption;
          if (I) I.signingProperties = Object.assign(I.signingProperties || {}, {
            signing_region: J.signingRegion,
            signingRegion: J.signingRegion,
            signing_service: J.signingName,
            signingName: J.signingName,
            signingRegionSet: J.signingRegionSet
          }, J.properties)
        }
        return B({
          ...Z
        })
      }
    }, cMQ = {
      step: "serialize",
      tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
      name: "endpointV2Middleware",
      override: !0,
      relation: "before",
      toMiddleware: P36.serializerMiddlewareOption.name
    }, h36 = (A, Q) => ({
      applyToStack: (B) => {
        B.addRelativeTo(dMQ({
          config: A,
          instructions: Q
        }), cMQ)
      }
    }), g36 = (A) => {
      let Q = A.tls ?? !0,
        {
          endpoint: B,
          useDualstackEndpoint: G,
          useFipsEndpoint: Z
        } = A,
        Y = B != null ? async () => Kv1(await SoA.normalizeProvider(B)()): void 0, X = Object.assign(A, {
          endpoint: Y,
          tls: Q,
          isCustomEndpoint: !!B,
          useDualstackEndpoint: SoA.normalizeProvider(G ?? !1),
          useFipsEndpoint: SoA.normalizeProvider(Z ?? !1)
        }), I = void 0;
      return X.serviceConfiguredEndpoint = async () => {
        if (A.serviceId && !I) I = gMQ.getEndpointFromConfig(A.serviceId);
        return I
      }, X
    }, u36 = (A) => {
      let {
        endpoint: Q
      } = A;
      if (Q === void 0) A.endpoint = async () => {
        throw Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.")
      };
      return A
    };
  m36.endpointMiddleware = dMQ;
  m36.endpointMiddlewareOptions = cMQ;
  m36.getEndpointFromInstructions = uMQ;
  m36.getEndpointPlugin = h36;
  m36.resolveEndpointConfig = g36;
  m36.resolveEndpointRequiredConfig = u36;
  m36.resolveParams = mMQ;
  m36.toEndpointV1 = Kv1
})
// @from(Ln 85142, Col 4)
Fv1 = U((Y86) => {
  var r36 = ["AuthFailure", "InvalidSignatureException", "RequestExpired", "RequestInTheFuture", "RequestTimeTooSkewed", "SignatureDoesNotMatch"],
    s36 = ["BandwidthLimitExceeded", "EC2ThrottledException", "LimitExceededException", "PriorRequestNotComplete", "ProvisionedThroughputExceededException", "RequestLimitExceeded", "RequestThrottled", "RequestThrottledException", "SlowDown", "ThrottledException", "Throttling", "ThrottlingException", "TooManyRequestsException", "TransactionInProgressException"],
    t36 = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"],
    e36 = [500, 502, 503, 504],
    A86 = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"],
    Q86 = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"],
    pMQ = (A) => A?.$retryable !== void 0,
    B86 = (A) => r36.includes(A.name),
    lMQ = (A) => A.$metadata?.clockSkewCorrected,
    iMQ = (A) => {
      let Q = new Set(["Failed to fetch", "NetworkError when attempting to fetch resource", "The Internet connection appears to be offline", "Load failed", "Network request failed"]);
      if (!(A && A instanceof TypeError)) return !1;
      return Q.has(A.message)
    },
    G86 = (A) => A.$metadata?.httpStatusCode === 429 || s36.includes(A.name) || A.$retryable?.throttling == !0,
    Vv1 = (A, Q = 0) => pMQ(A) || lMQ(A) || t36.includes(A.name) || A86.includes(A?.code || "") || Q86.includes(A?.code || "") || e36.includes(A.$metadata?.httpStatusCode || 0) || iMQ(A) || A.cause !== void 0 && Q <= 10 && Vv1(A.cause, Q + 1),
    Z86 = (A) => {
      if (A.$metadata?.httpStatusCode !== void 0) {
        let Q = A.$metadata.httpStatusCode;
        if (500 <= Q && Q <= 599 && !Vv1(A)) return !0;
        return !1
      }
      return !1
    };
  Y86.isBrowserNetworkError = iMQ;
  Y86.isClockSkewCorrectedError = lMQ;
  Y86.isClockSkewError = B86;
  Y86.isRetryableByTrait = pMQ;
  Y86.isServerError = Z86;
  Y86.isThrottlingError = G86;
  Y86.isTransientError = Vv1
})
// @from(Ln 85175, Col 4)
Uv = U((C86) => {
  var F86 = Fv1();
  C86.RETRY_MODES = void 0;
  (function (A) {
    A.STANDARD = "standard", A.ADAPTIVE = "adaptive"
  })(C86.RETRY_MODES || (C86.RETRY_MODES = {}));
  var Hv1 = 3,
    H86 = C86.RETRY_MODES.STANDARD;
  class xoA {
    static setTimeoutFn = setTimeout;
    beta;
    minCapacity;
    minFillRate;
    scaleConstant;
    smooth;
    currentCapacity = 0;
    enabled = !1;
    lastMaxRate = 0;
    measuredTxRate = 0;
    requestCount = 0;
    fillRate;
    lastThrottleTime;
    lastTimestamp = 0;
    lastTxRateBucket;
    maxCapacity;
    timeWindow = 0;
    constructor(A) {
      this.beta = A?.beta ?? 0.7, this.minCapacity = A?.minCapacity ?? 1, this.minFillRate = A?.minFillRate ?? 0.5, this.scaleConstant = A?.scaleConstant ?? 0.4, this.smooth = A?.smooth ?? 0.8;
      let Q = this.getCurrentTimeInSeconds();
      this.lastThrottleTime = Q, this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity
    }
    getCurrentTimeInSeconds() {
      return Date.now() / 1000
    }
    async getSendToken() {
      return this.acquireTokenBucket(1)
    }
    async acquireTokenBucket(A) {
      if (!this.enabled) return;
      if (this.refillTokenBucket(), A > this.currentCapacity) {
        let Q = (A - this.currentCapacity) / this.fillRate * 1000;
        await new Promise((B) => xoA.setTimeoutFn(B, Q))
      }
      this.currentCapacity = this.currentCapacity - A
    }
    refillTokenBucket() {
      let A = this.getCurrentTimeInSeconds();
      if (!this.lastTimestamp) {
        this.lastTimestamp = A;
        return
      }
      let Q = (A - this.lastTimestamp) * this.fillRate;
      this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + Q), this.lastTimestamp = A
    }
    updateClientSendingRate(A) {
      let Q;
      if (this.updateMeasuredRate(), F86.isThrottlingError(A)) {
        let G = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
        this.lastMaxRate = G, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), Q = this.cubicThrottle(G), this.enableTokenBucket()
      } else this.calculateTimeWindow(), Q = this.cubicSuccess(this.getCurrentTimeInSeconds());
      let B = Math.min(Q, 2 * this.measuredTxRate);
      this.updateTokenBucketRate(B)
    }
    calculateTimeWindow() {
      this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 0.3333333333333333))
    }
    cubicThrottle(A) {
      return this.getPrecise(A * this.beta)
    }
    cubicSuccess(A) {
      return this.getPrecise(this.scaleConstant * Math.pow(A - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate)
    }
    enableTokenBucket() {
      this.enabled = !0
    }
    updateTokenBucketRate(A) {
      this.refillTokenBucket(), this.fillRate = Math.max(A, this.minFillRate), this.maxCapacity = Math.max(A, this.minCapacity), this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity)
    }
    updateMeasuredRate() {
      let A = this.getCurrentTimeInSeconds(),
        Q = Math.floor(A * 2) / 2;
      if (this.requestCount++, Q > this.lastTxRateBucket) {
        let B = this.requestCount / (Q - this.lastTxRateBucket);
        this.measuredTxRate = this.getPrecise(B * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = Q
      }
    }
    getPrecise(A) {
      return parseFloat(A.toFixed(8))
    }
  }
  var JwA = 100,
    zv1 = 20000,
    aMQ = 500,
    Ev1 = 500,
    oMQ = 5,
    rMQ = 10,
    sMQ = 1,
    E86 = "amz-sdk-invocation-id",
    z86 = "amz-sdk-request",
    $86 = () => {
      let A = JwA;
      return {
        computeNextBackoffDelay: (G) => {
          return Math.floor(Math.min(zv1, Math.random() * 2 ** G * A))
        },
        setDelayBase: (G) => {
          A = G
        }
      }
    },
    nMQ = ({
      retryDelay: A,
      retryCount: Q,
      retryCost: B
    }) => {
      return {
        getRetryCount: () => Q,
        getRetryDelay: () => Math.min(zv1, A),
        getRetryCost: () => B
      }
    };
  class yoA {
    maxAttempts;
    mode = C86.RETRY_MODES.STANDARD;
    capacity = Ev1;
    retryBackoffStrategy = $86();
    maxAttemptsProvider;
    constructor(A) {
      this.maxAttempts = A, this.maxAttemptsProvider = typeof A === "function" ? A : async () => A
    }
    async acquireInitialRetryToken(A) {
      return nMQ({
        retryDelay: JwA,
        retryCount: 0
      })
    }
    async refreshRetryTokenForRetry(A, Q) {
      let B = await this.getMaxAttempts();
      if (this.shouldRetry(A, Q, B)) {
        let G = Q.errorType;
        this.retryBackoffStrategy.setDelayBase(G === "THROTTLING" ? aMQ : JwA);
        let Z = this.retryBackoffStrategy.computeNextBackoffDelay(A.getRetryCount()),
          Y = Q.retryAfterHint ? Math.max(Q.retryAfterHint.getTime() - Date.now() || 0, Z) : Z,
          J = this.getCapacityCost(G);
        return this.capacity -= J, nMQ({
          retryDelay: Y,
          retryCount: A.getRetryCount() + 1,
          retryCost: J
        })
      }
      throw Error("No retry token available")
    }
    recordSuccess(A) {
      this.capacity = Math.max(Ev1, this.capacity + (A.getRetryCost() ?? sMQ))
    }
    getCapacity() {
      return this.capacity
    }
    async getMaxAttempts() {
      try {
        return await this.maxAttemptsProvider()
      } catch (A) {
        return console.warn(`Max attempts provider could not resolve. Using default of ${Hv1}`), Hv1
      }
    }
    shouldRetry(A, Q, B) {
      return A.getRetryCount() + 1 < B && this.capacity >= this.getCapacityCost(Q.errorType) && this.isRetryableError(Q.errorType)
    }
    getCapacityCost(A) {
      return A === "TRANSIENT" ? rMQ : oMQ
    }
    isRetryableError(A) {
      return A === "THROTTLING" || A === "TRANSIENT"
    }
  }
  class tMQ {
    maxAttemptsProvider;
    rateLimiter;
    standardRetryStrategy;
    mode = C86.RETRY_MODES.ADAPTIVE;
    constructor(A, Q) {
      this.maxAttemptsProvider = A;
      let {
        rateLimiter: B
      } = Q ?? {};
      this.rateLimiter = B ?? new xoA, this.standardRetryStrategy = new yoA(A)
    }
    async acquireInitialRetryToken(A) {
      return await this.rateLimiter.getSendToken(), this.standardRetryStrategy.acquireInitialRetryToken(A)
    }
    async refreshRetryTokenForRetry(A, Q) {
      return this.rateLimiter.updateClientSendingRate(Q), this.standardRetryStrategy.refreshRetryTokenForRetry(A, Q)
    }
    recordSuccess(A) {
      this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(A)
    }
  }
  class eMQ extends yoA {
    computeNextBackoffDelay;
    constructor(A, Q = JwA) {
      super(typeof A === "function" ? A : async () => A);
      if (typeof Q === "number") this.computeNextBackoffDelay = () => Q;
      else this.computeNextBackoffDelay = Q
    }
    async refreshRetryTokenForRetry(A, Q) {
      let B = await super.refreshRetryTokenForRetry(A, Q);
      return B.getRetryDelay = () => this.computeNextBackoffDelay(B.getRetryCount()), B
    }
  }
  C86.AdaptiveRetryStrategy = tMQ;
  C86.ConfiguredRetryStrategy = eMQ;
  C86.DEFAULT_MAX_ATTEMPTS = Hv1;
  C86.DEFAULT_RETRY_DELAY_BASE = JwA;
  C86.DEFAULT_RETRY_MODE = H86;
  C86.DefaultRateLimiter = xoA;
  C86.INITIAL_RETRY_TOKENS = Ev1;
  C86.INVOCATION_ID_HEADER = E86;
  C86.MAXIMUM_RETRY_DELAY = zv1;
  C86.NO_RETRY_INCREMENT = sMQ;
  C86.REQUEST_HEADER = z86;
  C86.RETRY_COST = oMQ;
  C86.StandardRetryStrategy = yoA;
  C86.THROTTLING_RETRY_DELAY_BASE = aMQ;
  C86.TIMEOUT_RETRY_COST = rMQ
})
// @from(Ln 85400, Col 4)
Lv1 = U((g86) => {
  g86.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(g86.HttpAuthLocation || (g86.HttpAuthLocation = {}));
  g86.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(g86.HttpApiKeyAuthLocation || (g86.HttpApiKeyAuthLocation = {}));
  g86.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(g86.EndpointURLScheme || (g86.EndpointURLScheme = {}));
  g86.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(g86.AlgorithmId || (g86.AlgorithmId = {}));
  var v86 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => g86.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => g86.AlgorithmId.MD5,
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
    k86 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    b86 = (A) => {
      return v86(A)
    },
    f86 = (A) => {
      return k86(A)
    };
  g86.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(g86.FieldPosition || (g86.FieldPosition = {}));
  var h86 = "__smithy_context";
  g86.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(g86.IniSectionType || (g86.IniSectionType = {}));
  g86.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(g86.RequestHandlerProtocol || (g86.RequestHandlerProtocol = {}));
  g86.SMITHY_CONTEXT_KEY = h86;
  g86.getDefaultClientConfiguration = b86;
  g86.resolveDefaultRuntimeConfig = f86
})
// @from(Ln 85465, Col 4)
GRQ = U((a86) => {
  var c86 = Lv1(),
    p86 = (A) => {
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
    l86 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class ARQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = c86.FieldPosition.HEADER,
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
  class QRQ {
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
  class voA {
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
      let Q = new voA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = i86(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return voA.clone(this)
    }
  }

  function i86(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class BRQ {
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

  function n86(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  a86.Field = ARQ;
  a86.Fields = QRQ;
  a86.HttpRequest = voA;
  a86.HttpResponse = BRQ;
  a86.getHttpHandlerExtensionConfiguration = p86;
  a86.isValidHostname = n86;
  a86.resolveHttpHandlerRuntimeConfig = l86
})
// @from(Ln 85607, Col 4)
zRQ = U((IYA) => {
  var JRQ = Ev(),
    jv1 = Mq(),
    Mv1 = Lv1(),
    B56 = WX(),
    ZRQ = Oq();
  class XRQ {
    config;
    middlewareStack = JRQ.constructStack();
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
  var Ov1 = "***SensitiveInformation***";

  function Rv1(A, Q) {
    if (Q == null) return Q;
    let B = B56.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return Ov1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return Ov1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return Ov1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = Rv1(J, G[Y]);
      return Z
    }
    return Q
  }
  class Tv1 {
    middlewareStack = JRQ.constructStack();
    schema;
    static classBuilder() {
      return new IRQ
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
          [Mv1.SMITHY_CONTEXT_KEY]: {
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
  class IRQ {
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
      return Q = class extends Tv1 {
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
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? Rv1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? Rv1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var G56 = "***SensitiveInformation***",
    Z56 = (A, Q) => {
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
  class XYA extends Error {
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
      return XYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === XYA) return XYA.isInstance(A);
      if (XYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var DRQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    WRQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = J56(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw DRQ(J, Q)
    },
    Y56 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        WRQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    J56 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    X56 = (A) => {
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
    YRQ = !1,
    I56 = (A) => {
      if (A && !YRQ && parseInt(A.substring(1, A.indexOf("."))) < 16) YRQ = !0
    },
    D56 = (A) => {
      let Q = [];
      for (let B in Mv1.AlgorithmId) {
        let G = Mv1.AlgorithmId[B];
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
    W56 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    K56 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    V56 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    KRQ = (A) => {
      return Object.assign(D56(A), K56(A))
    },
    F56 = KRQ,
    H56 = (A) => {
      return Object.assign(W56(A), V56(A))
    },
    E56 = (A) => Array.isArray(A) ? A : [A],
    VRQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = VRQ(A[B]);
      return A
    },
    z56 = (A) => {
      return A != null
    };
  class FRQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function HRQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, U56(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      ERQ(G, null, Y, J)
    }
    return G
  }
  var $56 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    C56 = (A, Q) => {
      let B = {};
      for (let G in Q) ERQ(B, A, Q, G);
      return B
    },
    U56 = (A, Q, B) => {
      return HRQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    ERQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = q56, I = N56, D = G] = J;
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
    q56 = (A) => A != null,
    N56 = (A) => A,
    w56 = (A) => {
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
    L56 = (A) => A.toISOString().replace(".000Z", "Z"),
    _v1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(_v1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = _v1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(IYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return jv1.collectBody
    }
  });
  Object.defineProperty(IYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return jv1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(IYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return jv1.resolvedPath
    }
  });
  IYA.Client = XRQ;
  IYA.Command = Tv1;
  IYA.NoOpLogger = FRQ;
  IYA.SENSITIVE_STRING = G56;
  IYA.ServiceException = XYA;
  IYA._json = _v1;
  IYA.convertMap = $56;
  IYA.createAggregatedClient = Z56;
  IYA.decorateServiceException = DRQ;
  IYA.emitWarningIfUnsupportedVersion = I56;
  IYA.getArrayIfSingleItem = E56;
  IYA.getDefaultClientConfiguration = F56;
  IYA.getDefaultExtensionConfiguration = KRQ;
  IYA.getValueFromTextNode = VRQ;
  IYA.isSerializableHeaderValue = z56;
  IYA.loadConfigsForDefaultMode = X56;
  IYA.map = HRQ;
  IYA.resolveDefaultRuntimeConfig = H56;
  IYA.serializeDateTime = L56;
  IYA.serializeFloat = w56;
  IYA.take = C56;
  IYA.throwDefaultError = WRQ;
  IYA.withBaseException = Y56;
  Object.keys(ZRQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(IYA, A)) Object.defineProperty(IYA, A, {
      enumerable: !0,
      get: function () {
        return ZRQ[A]
      }
    })
  })
})
// @from(Ln 86077, Col 4)
URQ = U(($RQ) => {
  Object.defineProperty($RQ, "__esModule", {
    value: !0
  });
  $RQ.isStreamingPayload = void 0;
  var n56 = NA("stream"),
    a56 = (A) => A?.body instanceof n56.Readable || typeof ReadableStream < "u" && A?.body instanceof ReadableStream;
  $RQ.isStreamingPayload = a56
})
// @from(Ln 86086, Col 4)
RH = U((X76) => {
  var sX = Uv(),
    DYA = GRQ(),
    ai = Fv1(),
    NRQ = sS1(),
    qRQ = Jz(),
    o56 = zRQ(),
    r56 = URQ(),
    s56 = (A, Q) => {
      let B = A,
        G = sX.NO_RETRY_INCREMENT,
        Z = sX.RETRY_COST,
        Y = sX.TIMEOUT_RETRY_COST,
        J = A,
        X = (K) => K.name === "TimeoutError" ? Y : Z,
        I = (K) => X(K) <= J;
      return Object.freeze({
        hasRetryTokens: I,
        retrieveRetryTokens: (K) => {
          if (!I(K)) throw Error("No retry token available");
          let V = X(K);
          return J -= V, V
        },
        releaseRetryTokens: (K) => {
          J += K ?? G, J = Math.min(J, B)
        }
      })
    },
    wRQ = (A, Q) => Math.floor(Math.min(sX.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** Q * A)),
    LRQ = (A) => {
      if (!A) return !1;
      return ai.isRetryableByTrait(A) || ai.isClockSkewError(A) || ai.isThrottlingError(A) || ai.isTransientError(A)
    },
    ORQ = (A) => {
      if (A instanceof Error) return A;
      if (A instanceof Object) return Object.assign(Error(), A);
      if (typeof A === "string") return Error(A);
      return Error(`AWS SDK error wrapper for ${A}`)
    };
  class xv1 {
    maxAttemptsProvider;
    retryDecider;
    delayDecider;
    retryQuota;
    mode = sX.RETRY_MODES.STANDARD;
    constructor(A, Q) {
      this.maxAttemptsProvider = A, this.retryDecider = Q?.retryDecider ?? LRQ, this.delayDecider = Q?.delayDecider ?? wRQ, this.retryQuota = Q?.retryQuota ?? s56(sX.INITIAL_RETRY_TOKENS)
    }
    shouldRetry(A, Q, B) {
      return Q < B && this.retryDecider(A) && this.retryQuota.hasRetryTokens(A)
    }
    async getMaxAttempts() {
      let A;
      try {
        A = await this.maxAttemptsProvider()
      } catch (Q) {
        A = sX.DEFAULT_MAX_ATTEMPTS
      }
      return A
    }
    async retry(A, Q, B) {
      let G, Z = 0,
        Y = 0,
        J = await this.getMaxAttempts(),
        {
          request: X
        } = Q;
      if (DYA.HttpRequest.isInstance(X)) X.headers[sX.INVOCATION_ID_HEADER] = NRQ.v4();
      while (!0) try {
        if (DYA.HttpRequest.isInstance(X)) X.headers[sX.REQUEST_HEADER] = `attempt=${Z+1}; max=${J}`;
        if (B?.beforeRequest) await B.beforeRequest();
        let {
          response: I,
          output: D
        } = await A(Q);
        if (B?.afterRequest) B.afterRequest(I);
        return this.retryQuota.releaseRetryTokens(G), D.$metadata.attempts = Z + 1, D.$metadata.totalRetryDelay = Y, {
          response: I,
          output: D
        }
      } catch (I) {
        let D = ORQ(I);
        if (Z++, this.shouldRetry(D, Z, J)) {
          G = this.retryQuota.retrieveRetryTokens(D);
          let W = this.delayDecider(ai.isThrottlingError(D) ? sX.THROTTLING_RETRY_DELAY_BASE : sX.DEFAULT_RETRY_DELAY_BASE, Z),
            K = t56(D.$response),
            V = Math.max(K || 0, W);
          Y += V, await new Promise((F) => setTimeout(F, V));
          continue
        }
        if (!D.$metadata) D.$metadata = {};
        throw D.$metadata.attempts = Z, D.$metadata.totalRetryDelay = Y, D
      }
    }
  }
  var t56 = (A) => {
    if (!DYA.HttpResponse.isInstance(A)) return;
    let Q = Object.keys(A.headers).find((Y) => Y.toLowerCase() === "retry-after");
    if (!Q) return;
    let B = A.headers[Q],
      G = Number(B);
    if (!Number.isNaN(G)) return G * 1000;
    return new Date(B).getTime() - Date.now()
  };
  class MRQ extends xv1 {
    rateLimiter;
    constructor(A, Q) {
      let {
        rateLimiter: B,
        ...G
      } = Q ?? {};
      super(A, G);
      this.rateLimiter = B ?? new sX.DefaultRateLimiter, this.mode = sX.RETRY_MODES.ADAPTIVE
    }
    async retry(A, Q) {
      return super.retry(A, Q, {
        beforeRequest: async () => {
          return this.rateLimiter.getSendToken()
        },
        afterRequest: (B) => {
          this.rateLimiter.updateClientSendingRate(B)
        }
      })
    }
  }
  var Pv1 = "AWS_MAX_ATTEMPTS",
    Sv1 = "max_attempts",
    e56 = {
      environmentVariableSelector: (A) => {
        let Q = A[Pv1];
        if (!Q) return;
        let B = parseInt(Q);
        if (Number.isNaN(B)) throw Error(`Environment variable ${Pv1} mast be a number, got "${Q}"`);
        return B
      },
      configFileSelector: (A) => {
        let Q = A[Sv1];
        if (!Q) return;
        let B = parseInt(Q);
        if (Number.isNaN(B)) throw Error(`Shared config file entry ${Sv1} mast be a number, got "${Q}"`);
        return B
      },
      default: sX.DEFAULT_MAX_ATTEMPTS
    },
    A76 = (A) => {
      let {
        retryStrategy: Q,
        retryMode: B,
        maxAttempts: G
      } = A, Z = qRQ.normalizeProvider(G ?? sX.DEFAULT_MAX_ATTEMPTS);
      return Object.assign(A, {
        maxAttempts: Z,
        retryStrategy: async () => {
          if (Q) return Q;
          if (await qRQ.normalizeProvider(B)() === sX.RETRY_MODES.ADAPTIVE) return new sX.AdaptiveRetryStrategy(Z);
          return new sX.StandardRetryStrategy(Z)
        }
      })
    },
    RRQ = "AWS_RETRY_MODE",
    _RQ = "retry_mode",
    Q76 = {
      environmentVariableSelector: (A) => A[RRQ],
      configFileSelector: (A) => A[_RQ],
      default: sX.DEFAULT_RETRY_MODE
    },
    jRQ = () => (A) => async (Q) => {
      let {
        request: B
      } = Q;
      if (DYA.HttpRequest.isInstance(B)) delete B.headers[sX.INVOCATION_ID_HEADER], delete B.headers[sX.REQUEST_HEADER];
      return A(Q)
    }, TRQ = {
      name: "omitRetryHeadersMiddleware",
      tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
      relation: "before",
      toMiddleware: "awsAuthMiddleware",
      override: !0
    }, B76 = (A) => ({
      applyToStack: (Q) => {
        Q.addRelativeTo(jRQ(), TRQ)
      }
    }), PRQ = (A) => (Q, B) => async (G) => {
      let Z = await A.retryStrategy(),
        Y = await A.maxAttempts();
      if (G76(Z)) {
        Z = Z;
        let J = await Z.acquireInitialRetryToken(B.partition_id),
          X = Error(),
          I = 0,
          D = 0,
          {
            request: W
          } = G,
          K = DYA.HttpRequest.isInstance(W);
        if (K) W.headers[sX.INVOCATION_ID_HEADER] = NRQ.v4();
        while (!0) try {
          if (K) W.headers[sX.REQUEST_HEADER] = `attempt=${I+1}; max=${Y}`;
          let {
            response: V,
            output: F
          } = await Q(G);
          return Z.recordSuccess(J), F.$metadata.attempts = I + 1, F.$metadata.totalRetryDelay = D, {
            response: V,
            output: F
          }
        } catch (V) {
          let F = Z76(V);
          if (X = ORQ(V), K && r56.isStreamingPayload(W)) throw (B.logger instanceof o56.NoOpLogger ? console : B.logger)?.warn("An error was encountered in a non-retryable streaming request."), X;
          try {
            J = await Z.refreshRetryTokenForRetry(J, F)
          } catch (E) {
            if (!X.$metadata) X.$metadata = {};
            throw X.$metadata.attempts = I + 1, X.$metadata.totalRetryDelay = D, X
          }
          I = J.getRetryCount();
          let H = J.getRetryDelay();
          D += H, await new Promise((E) => setTimeout(E, H))
        }
      } else {
        if (Z = Z, Z?.mode) B.userAgent = [...B.userAgent || [],
          ["cfg/retry-mode", Z.mode]
        ];
        return Z.retry(Q, G)
      }
    }, G76 = (A) => typeof A.acquireInitialRetryToken < "u" && typeof A.refreshRetryTokenForRetry < "u" && typeof A.recordSuccess < "u", Z76 = (A) => {
      let Q = {
          error: A,
          errorType: Y76(A)
        },
        B = xRQ(A.$response);
      if (B) Q.retryAfterHint = B;
      return Q
    }, Y76 = (A) => {
      if (ai.isThrottlingError(A)) return "THROTTLING";
      if (ai.isTransientError(A)) return "TRANSIENT";
      if (ai.isServerError(A)) return "SERVER_ERROR";
      return "CLIENT_ERROR"
    }, SRQ = {
      name: "retryMiddleware",
      tags: ["RETRY"],
      step: "finalizeRequest",
      priority: "high",
      override: !0
    }, J76 = (A) => ({
      applyToStack: (Q) => {
        Q.add(PRQ(A), SRQ)
      }
    }), xRQ = (A) => {
      if (!DYA.HttpResponse.isInstance(A)) return;
      let Q = Object.keys(A.headers).find((Y) => Y.toLowerCase() === "retry-after");
      if (!Q) return;
      let B = A.headers[Q],
        G = Number(B);
      if (!Number.isNaN(G)) return new Date(G * 1000);
      return new Date(B)
    };
  X76.AdaptiveRetryStrategy = MRQ;
  X76.CONFIG_MAX_ATTEMPTS = Sv1;
  X76.CONFIG_RETRY_MODE = _RQ;
  X76.ENV_MAX_ATTEMPTS = Pv1;
  X76.ENV_RETRY_MODE = RRQ;
  X76.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = e56;
  X76.NODE_RETRY_MODE_CONFIG_OPTIONS = Q76;
  X76.StandardRetryStrategy = xv1;
  X76.defaultDelayDecider = wRQ;
  X76.defaultRetryDecider = LRQ;
  X76.getOmitRetryHeadersPlugin = B76;
  X76.getRetryAfterHint = xRQ;
  X76.getRetryPlugin = J76;
  X76.omitRetryHeadersMiddleware = jRQ;
  X76.omitRetryHeadersMiddlewareOptions = TRQ;
  X76.resolveRetryConfig = A76;
  X76.retryMiddleware = PRQ;
  X76.retryMiddlewareOptions = SRQ
})
// @from(Ln 86362, Col 4)
gv1 = U((S76) => {
  S76.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(S76.HttpAuthLocation || (S76.HttpAuthLocation = {}));
  S76.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(S76.HttpApiKeyAuthLocation || (S76.HttpApiKeyAuthLocation = {}));
  S76.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(S76.EndpointURLScheme || (S76.EndpointURLScheme = {}));
  S76.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(S76.AlgorithmId || (S76.AlgorithmId = {}));
  var R76 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => S76.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => S76.AlgorithmId.MD5,
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
    _76 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    j76 = (A) => {
      return R76(A)
    },
    T76 = (A) => {
      return _76(A)
    };
  S76.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(S76.FieldPosition || (S76.FieldPosition = {}));
  var P76 = "__smithy_context";
  S76.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(S76.IniSectionType || (S76.IniSectionType = {}));
  S76.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(S76.RequestHandlerProtocol || (S76.RequestHandlerProtocol = {}));
  S76.SMITHY_CONTEXT_KEY = P76;
  S76.getDefaultClientConfiguration = j76;
  S76.resolveDefaultRuntimeConfig = T76
})
// @from(Ln 86427, Col 4)
DwA = U((KYA) => {
  var kRQ = Ev(),
    pv1 = Mq(),
    mv1 = gv1(),
    k76 = WX(),
    yRQ = Oq();
  class bRQ {
    config;
    middlewareStack = kRQ.constructStack();
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
  var uv1 = "***SensitiveInformation***";

  function dv1(A, Q) {
    if (Q == null) return Q;
    let B = k76.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return uv1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return uv1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return uv1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = dv1(J, G[Y]);
      return Z
    }
    return Q
  }
  class lv1 {
    middlewareStack = kRQ.constructStack();
    schema;
    static classBuilder() {
      return new fRQ
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
          [mv1.SMITHY_CONTEXT_KEY]: {
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
  class fRQ {
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
      return Q = class extends lv1 {
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
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? dv1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? dv1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var b76 = "***SensitiveInformation***",
    f76 = (A, Q) => {
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
  class WYA extends Error {
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
      return WYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === WYA) return WYA.isInstance(A);
      if (WYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var hRQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    gRQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = g76(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw hRQ(J, Q)
    },
    h76 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        gRQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    g76 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    u76 = (A) => {
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
    vRQ = !1,
    m76 = (A) => {
      if (A && !vRQ && parseInt(A.substring(1, A.indexOf("."))) < 16) vRQ = !0
    },
    d76 = (A) => {
      let Q = [];
      for (let B in mv1.AlgorithmId) {
        let G = mv1.AlgorithmId[B];
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
    c76 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    p76 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    l76 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    uRQ = (A) => {
      return Object.assign(d76(A), p76(A))
    },
    i76 = uRQ,
    n76 = (A) => {
      return Object.assign(c76(A), l76(A))
    },
    a76 = (A) => Array.isArray(A) ? A : [A],
    mRQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = mRQ(A[B]);
      return A
    },
    o76 = (A) => {
      return A != null
    };
  class dRQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function cRQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, t76(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      pRQ(G, null, Y, J)
    }
    return G
  }
  var r76 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    s76 = (A, Q) => {
      let B = {};
      for (let G in Q) pRQ(B, A, Q, G);
      return B
    },
    t76 = (A, Q, B) => {
      return cRQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    pRQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = e76, I = AG6, D = G] = J;
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
    e76 = (A) => A != null,
    AG6 = (A) => A,
    QG6 = (A) => {
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
    BG6 = (A) => A.toISOString().replace(".000Z", "Z"),
    cv1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(cv1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = cv1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(KYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return pv1.collectBody
    }
  });
  Object.defineProperty(KYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return pv1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(KYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return pv1.resolvedPath
    }
  });
  KYA.Client = bRQ;
  KYA.Command = lv1;
  KYA.NoOpLogger = dRQ;
  KYA.SENSITIVE_STRING = b76;
  KYA.ServiceException = WYA;
  KYA._json = cv1;
  KYA.convertMap = r76;
  KYA.createAggregatedClient = f76;
  KYA.decorateServiceException = hRQ;
  KYA.emitWarningIfUnsupportedVersion = m76;
  KYA.getArrayIfSingleItem = a76;
  KYA.getDefaultClientConfiguration = i76;
  KYA.getDefaultExtensionConfiguration = uRQ;
  KYA.getValueFromTextNode = mRQ;
  KYA.isSerializableHeaderValue = o76;
  KYA.loadConfigsForDefaultMode = u76;
  KYA.map = cRQ;
  KYA.resolveDefaultRuntimeConfig = n76;
  KYA.serializeDateTime = BG6;
  KYA.serializeFloat = QG6;
  KYA.take = s76;
  KYA.throwDefaultError = gRQ;
  KYA.withBaseException = h76;
  Object.keys(yRQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(KYA, A)) Object.defineProperty(KYA, A, {
      enumerable: !0,
      get: function () {
        return yRQ[A]
      }
    })
  })
})
// @from(Ln 86897, Col 4)
av1 = U((lRQ) => {
  Object.defineProperty(lRQ, "__esModule", {
    value: !0
  });
  lRQ.resolveHttpAuthSchemeConfig = lRQ.defaultBedrockHttpAuthSchemeProvider = lRQ.defaultBedrockHttpAuthSchemeParametersProvider = void 0;
  var RG6 = hY(),
    iv1 = rG(),
    nv1 = Jz(),
    _G6 = async (A, Q, B) => {
      return {
        operation: (0, nv1.getSmithyContext)(Q).operation,
        region: await (0, nv1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  lRQ.defaultBedrockHttpAuthSchemeParametersProvider = _G6;

  function jG6(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "bedrock",
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

  function TG6(A) {
    return {
      schemeId: "smithy.api#httpBearerAuth",
      propertiesExtractor: ({
        profile: Q,
        filepath: B,
        configFilepath: G,
        ignoreCache: Z
      }, Y) => ({
        identityProperties: {
          profile: Q,
          filepath: B,
          configFilepath: G,
          ignoreCache: Z
        }
      })
    }
  }
  var PG6 = (A) => {
    let Q = [];
    switch (A.operation) {
      default:
        Q.push(jG6(A)), Q.push(TG6(A))
    }
    return Q
  };
  lRQ.defaultBedrockHttpAuthSchemeProvider = PG6;
  var SG6 = (A) => {
    let Q = (0, iv1.memoizeIdentityProvider)(A.token, iv1.isIdentityExpired, iv1.doesIdentityRequireRefresh),
      B = (0, RG6.resolveAwsSdkSigV4Config)(A);
    return Object.assign(B, {
      authSchemePreference: (0, nv1.normalizeProvider)(A.authSchemePreference ?? []),
      token: Q
    })
  };
  lRQ.resolveHttpAuthSchemeConfig = SG6
})
// @from(Ln 86968, Col 4)
nRQ = U((dGG, vG6) => {
  vG6.exports = {
    name: "@aws-sdk/client-bedrock",
    description: "AWS SDK for JavaScript Bedrock Client for Node.js, Browser and React Native",
    version: "3.936.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-bedrock",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo bedrock"
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
      "@aws-sdk/token-providers": "3.936.0",
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
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-bedrock",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-bedrock"
    }
  }
})
// @from(Ln 87066, Col 4)
koA = U((hG6) => {
  var kG6 = Rq(),
    bG6 = PW(),
    aRQ = "AWS_ACCESS_KEY_ID",
    oRQ = "AWS_SECRET_ACCESS_KEY",
    rRQ = "AWS_SESSION_TOKEN",
    sRQ = "AWS_CREDENTIAL_EXPIRATION",
    tRQ = "AWS_CREDENTIAL_SCOPE",
    eRQ = "AWS_ACCOUNT_ID",
    fG6 = (A) => async () => {
      A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
      let Q = process.env[aRQ],
        B = process.env[oRQ],
        G = process.env[rRQ],
        Z = process.env[sRQ],
        Y = process.env[tRQ],
        J = process.env[eRQ];
      if (Q && B) {
        let X = {
          accessKeyId: Q,
          secretAccessKey: B,
          ...G && {
            sessionToken: G
          },
          ...Z && {
            expiration: new Date(Z)
          },
          ...Y && {
            credentialScope: Y
          },
          ...J && {
            accountId: J
          }
        };
        return kG6.setCredentialFeature(X, "CREDENTIALS_ENV_VARS", "g"), X
      }
      throw new bG6.CredentialsProviderError("Unable to find environment variable credentials.", {
        logger: A?.logger
      })
    };
  hG6.ENV_ACCOUNT_ID = eRQ;
  hG6.ENV_CREDENTIAL_SCOPE = tRQ;
  hG6.ENV_EXPIRATION = sRQ;
  hG6.ENV_KEY = aRQ;
  hG6.ENV_SECRET = oRQ;
  hG6.ENV_SESSION = rRQ;
  hG6.fromEnv = fG6
})