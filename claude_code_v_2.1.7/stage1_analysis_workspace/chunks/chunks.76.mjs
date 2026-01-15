
// @from(Ln 221053, Col 4)
r40 = U((UpG, fS8) => {
  fS8.exports = {
    name: "google-auth-library",
    version: "9.15.1",
    author: "Google Inc.",
    description: "Google APIs Authentication Client Library for Node.js",
    engines: {
      node: ">=14"
    },
    main: "./build/src/index.js",
    types: "./build/src/index.d.ts",
    repository: "googleapis/google-auth-library-nodejs.git",
    keywords: ["google", "api", "google apis", "client", "client library"],
    dependencies: {
      "base64-js": "^1.3.0",
      "ecdsa-sig-formatter": "^1.0.11",
      gaxios: "^6.1.1",
      "gcp-metadata": "^6.1.0",
      gtoken: "^7.0.0",
      jws: "^4.0.0"
    },
    devDependencies: {
      "@types/base64-js": "^1.2.5",
      "@types/chai": "^4.1.7",
      "@types/jws": "^3.1.0",
      "@types/mocha": "^9.0.0",
      "@types/mv": "^2.1.0",
      "@types/ncp": "^2.0.1",
      "@types/node": "^20.4.2",
      "@types/sinon": "^17.0.0",
      "assert-rejects": "^1.0.0",
      c8: "^8.0.0",
      chai: "^4.2.0",
      cheerio: "1.0.0-rc.12",
      codecov: "^3.0.2",
      "engine.io": "6.6.2",
      gts: "^5.0.0",
      "is-docker": "^2.0.0",
      jsdoc: "^4.0.0",
      "jsdoc-fresh": "^3.0.0",
      "jsdoc-region-tag": "^3.0.0",
      karma: "^6.0.0",
      "karma-chrome-launcher": "^3.0.0",
      "karma-coverage": "^2.0.0",
      "karma-firefox-launcher": "^2.0.0",
      "karma-mocha": "^2.0.0",
      "karma-sourcemap-loader": "^0.4.0",
      "karma-webpack": "5.0.0",
      keypair: "^1.0.4",
      linkinator: "^4.0.0",
      mocha: "^9.2.2",
      mv: "^2.1.1",
      ncp: "^2.0.0",
      nock: "^13.0.0",
      "null-loader": "^4.0.0",
      pdfmake: "0.2.12",
      puppeteer: "^21.0.0",
      sinon: "^18.0.0",
      "ts-loader": "^8.0.0",
      typescript: "^5.1.6",
      webpack: "^5.21.2",
      "webpack-cli": "^4.0.0"
    },
    files: ["build/src", "!build/src/**/*.map"],
    scripts: {
      test: "c8 mocha build/test",
      clean: "gts clean",
      prepare: "npm run compile",
      lint: "gts check",
      compile: "tsc -p .",
      fix: "gts fix",
      pretest: "npm run compile -- --sourceMap",
      docs: "jsdoc -c .jsdoc.json",
      "samples-setup": "cd samples/ && npm link ../ && npm run setup && cd ../",
      "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
      "system-test": "mocha build/system-test --timeout 60000",
      "presystem-test": "npm run compile -- --sourceMap",
      webpack: "webpack",
      "browser-test": "karma start",
      "docs-test": "linkinator docs",
      "predocs-test": "npm run docs",
      prelint: "cd samples; npm link ../; npm install",
      precompile: "gts clean"
    },
    license: "Apache-2.0"
  }
})
// @from(Ln 221140, Col 4)
ITA = U((gfB) => {
  Object.defineProperty(gfB, "__esModule", {
    value: !0
  });
  gfB.DefaultTransporter = void 0;
  var hS8 = cP(),
    gS8 = ffB(),
    uS8 = r40(),
    hfB = "google-api-nodejs-client";
  class XTA {
    constructor() {
      this.instance = new hS8.Gaxios
    }
    configure(A = {}) {
      if (A.headers = A.headers || {}, typeof window > "u") {
        let Q = A.headers["User-Agent"];
        if (!Q) A.headers["User-Agent"] = XTA.USER_AGENT;
        else if (!Q.includes(`${hfB}/`)) A.headers["User-Agent"] = `${Q} ${XTA.USER_AGENT}`;
        if (!A.headers["x-goog-api-client"]) {
          let B = process.version.replace(/^v/, "");
          A.headers["x-goog-api-client"] = `gl-node/${B}`
        }
      }
      return A
    }
    request(A) {
      return A = this.configure(A), (0, gS8.validate)(A), this.instance.request(A).catch((Q) => {
        throw this.processError(Q)
      })
    }
    get defaults() {
      return this.instance.defaults
    }
    set defaults(A) {
      this.instance.defaults = A
    }
    processError(A) {
      let Q = A.response,
        B = A,
        G = Q ? Q.data : null;
      if (Q && G && G.error && Q.status !== 200)
        if (typeof G.error === "string") B.message = G.error, B.status = Q.status;
        else if (Array.isArray(G.error.errors)) B.message = G.error.errors.map((Z) => Z.message).join(`
`), B.code = G.error.code, B.errors = G.error.errors;
      else B.message = G.error.message, B.code = G.error.code;
      else if (Q && Q.status >= 400) B.message = G, B.status = Q.status;
      return B
    }
  }
  gfB.DefaultTransporter = XTA;
  XTA.USER_AGENT = `${hfB}/${uS8.version}`
})
// @from(Ln 221192, Col 4)
dk = U((s40, dfB) => {
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var H61 = NA("buffer"),
    mk = H61.Buffer;

  function mfB(A, Q) {
    for (var B in A) Q[B] = A[B]
  }
  if (mk.from && mk.alloc && mk.allocUnsafe && mk.allocUnsafeSlow) dfB.exports = H61;
  else mfB(H61, s40), s40.Buffer = H2A;

  function H2A(A, Q, B) {
    return mk(A, Q, B)
  }
  H2A.prototype = Object.create(mk.prototype);
  mfB(mk, H2A);
  H2A.from = function (A, Q, B) {
    if (typeof A === "number") throw TypeError("Argument must not be a number");
    return mk(A, Q, B)
  };
  H2A.alloc = function (A, Q, B) {
    if (typeof A !== "number") throw TypeError("Argument must be a number");
    var G = mk(A);
    if (Q !== void 0)
      if (typeof B === "string") G.fill(Q, B);
      else G.fill(Q);
    else G.fill(0);
    return G
  };
  H2A.allocUnsafe = function (A) {
    if (typeof A !== "number") throw TypeError("Argument must be a number");
    return mk(A)
  };
  H2A.allocUnsafeSlow = function (A) {
    if (typeof A !== "number") throw TypeError("Argument must be a number");
    return H61.SlowBuffer(A)
  }
})
// @from(Ln 221230, Col 4)
pfB = U((NpG, cfB) => {
  function t40(A) {
    var Q = (A / 8 | 0) + (A % 8 === 0 ? 0 : 1);
    return Q
  }
  var mS8 = {
    ES256: t40(256),
    ES384: t40(384),
    ES512: t40(521)
  };

  function dS8(A) {
    var Q = mS8[A];
    if (Q) return Q;
    throw Error('Unknown algorithm "' + A + '"')
  }
  cfB.exports = dS8
})
// @from(Ln 221248, Col 4)
C61 = U((wpG, rfB) => {
  var E61 = dk().Buffer,
    ifB = pfB(),
    z61 = 128,
    nfB = 0,
    cS8 = 32,
    pS8 = 16,
    lS8 = 2,
    afB = pS8 | cS8 | nfB << 6,
    $61 = lS8 | nfB << 6;

  function iS8(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function ofB(A) {
    if (E61.isBuffer(A)) return A;
    else if (typeof A === "string") return E61.from(A, "base64");
    throw TypeError("ECDSA signature must be a Base64 string or a Buffer")
  }

  function nS8(A, Q) {
    A = ofB(A);
    var B = ifB(Q),
      G = B + 1,
      Z = A.length,
      Y = 0;
    if (A[Y++] !== afB) throw Error('Could not find expected "seq"');
    var J = A[Y++];
    if (J === (z61 | 1)) J = A[Y++];
    if (Z - Y < J) throw Error('"seq" specified length of "' + J + '", only "' + (Z - Y) + '" remaining');
    if (A[Y++] !== $61) throw Error('Could not find expected "int" for "r"');
    var X = A[Y++];
    if (Z - Y - 2 < X) throw Error('"r" specified length of "' + X + '", only "' + (Z - Y - 2) + '" available');
    if (G < X) throw Error('"r" specified length of "' + X + '", max of "' + G + '" is acceptable');
    var I = Y;
    if (Y += X, A[Y++] !== $61) throw Error('Could not find expected "int" for "s"');
    var D = A[Y++];
    if (Z - Y !== D) throw Error('"s" specified length of "' + D + '", expected "' + (Z - Y) + '"');
    if (G < D) throw Error('"s" specified length of "' + D + '", max of "' + G + '" is acceptable');
    var W = Y;
    if (Y += D, Y !== Z) throw Error('Expected to consume entire buffer, but "' + (Z - Y) + '" bytes remain');
    var K = B - X,
      V = B - D,
      F = E61.allocUnsafe(K + X + V + D);
    for (Y = 0; Y < K; ++Y) F[Y] = 0;
    A.copy(F, Y, I + Math.max(-K, 0), I + X), Y = B;
    for (var H = Y; Y < H + V; ++Y) F[Y] = 0;
    return A.copy(F, Y, W + Math.max(-V, 0), W + D), F = F.toString("base64"), F = iS8(F), F
  }

  function lfB(A, Q, B) {
    var G = 0;
    while (Q + G < B && A[Q + G] === 0) ++G;
    var Z = A[Q + G] >= z61;
    if (Z) --G;
    return G
  }

  function aS8(A, Q) {
    A = ofB(A);
    var B = ifB(Q),
      G = A.length;
    if (G !== B * 2) throw TypeError('"' + Q + '" signatures must be "' + B * 2 + '" bytes, saw "' + G + '"');
    var Z = lfB(A, 0, B),
      Y = lfB(A, B, A.length),
      J = B - Z,
      X = B - Y,
      I = 2 + J + 1 + 1 + X,
      D = I < z61,
      W = E61.allocUnsafe((D ? 2 : 3) + I),
      K = 0;
    if (W[K++] = afB, D) W[K++] = I;
    else W[K++] = z61 | 1, W[K++] = I & 255;
    if (W[K++] = $61, W[K++] = J, Z < 0) W[K++] = 0, K += A.copy(W, K, 0, B);
    else K += A.copy(W, K, Z, B);
    if (W[K++] = $61, W[K++] = X, Y < 0) W[K++] = 0, A.copy(W, K, B);
    else A.copy(W, K, B + Y);
    return W
  }
  rfB.exports = {
    derToJose: nS8,
    joseToDer: aS8
  }
})
// @from(Ln 221333, Col 4)
Ko = U((Wo) => {
  var lP = Wo && Wo.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    nDA, Lm, e40, A60;
  Object.defineProperty(Wo, "__esModule", {
    value: !0
  });
  Wo.LRUCache = void 0;
  Wo.snakeToCamel = sfB;
  Wo.originalOrCamelOptions = oS8;

  function sfB(A) {
    return A.replace(/([_][^_])/g, (Q) => Q.slice(1).toUpperCase())
  }

  function oS8(A) {
    function Q(B) {
      var G;
      let Z = A || {};
      return (G = Z[B]) !== null && G !== void 0 ? G : Z[sfB(B)]
    }
    return {
      get: Q
    }
  }
  class tfB {
    constructor(A) {
      nDA.add(this), Lm.set(this, new Map), this.capacity = A.capacity, this.maxAge = A.maxAge
    }
    set(A, Q) {
      lP(this, nDA, "m", e40).call(this, A, Q), lP(this, nDA, "m", A60).call(this)
    }
    get(A) {
      let Q = lP(this, Lm, "f").get(A);
      if (!Q) return;
      return lP(this, nDA, "m", e40).call(this, A, Q.value), lP(this, nDA, "m", A60).call(this), Q.value
    }
  }
  Wo.LRUCache = tfB;
  Lm = new WeakMap, nDA = new WeakSet, e40 = function (Q, B) {
    lP(this, Lm, "f").delete(Q), lP(this, Lm, "f").set(Q, {
      value: B,
      lastAccessed: Date.now()
    })
  }, A60 = function () {
    let Q = this.maxAge ? Date.now() - this.maxAge : 0,
      B = lP(this, Lm, "f").entries().next();
    while (!B.done && (lP(this, Lm, "f").size > this.capacity || B.value[1].lastAccessed < Q)) lP(this, Lm, "f").delete(B.value[0]), B = lP(this, Lm, "f").entries().next()
  }
})
// @from(Ln 221386, Col 4)
ck = U((BhB) => {
  Object.defineProperty(BhB, "__esModule", {
    value: !0
  });
  BhB.AuthClient = BhB.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = BhB.DEFAULT_UNIVERSE = void 0;
  var rS8 = NA("events"),
    efB = cP(),
    AhB = ITA(),
    sS8 = Ko();
  BhB.DEFAULT_UNIVERSE = "googleapis.com";
  BhB.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300000;
  class QhB extends rS8.EventEmitter {
    constructor(A = {}) {
      var Q, B, G, Z, Y;
      super();
      this.credentials = {}, this.eagerRefreshThresholdMillis = BhB.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS, this.forceRefreshOnFailure = !1, this.universeDomain = BhB.DEFAULT_UNIVERSE;
      let J = (0, sS8.originalOrCamelOptions)(A);
      if (this.apiKey = A.apiKey, this.projectId = (Q = J.get("project_id")) !== null && Q !== void 0 ? Q : null, this.quotaProjectId = J.get("quota_project_id"), this.credentials = (B = J.get("credentials")) !== null && B !== void 0 ? B : {}, this.universeDomain = (G = J.get("universe_domain")) !== null && G !== void 0 ? G : BhB.DEFAULT_UNIVERSE, this.transporter = (Z = A.transporter) !== null && Z !== void 0 ? Z : new AhB.DefaultTransporter, A.transporterOptions) this.transporter.defaults = A.transporterOptions;
      if (A.eagerRefreshThresholdMillis) this.eagerRefreshThresholdMillis = A.eagerRefreshThresholdMillis;
      this.forceRefreshOnFailure = (Y = A.forceRefreshOnFailure) !== null && Y !== void 0 ? Y : !1
    }
    get gaxios() {
      if (this.transporter instanceof efB.Gaxios) return this.transporter;
      else if (this.transporter instanceof AhB.DefaultTransporter) return this.transporter.instance;
      else if ("instance" in this.transporter && this.transporter.instance instanceof efB.Gaxios) return this.transporter.instance;
      return null
    }
    setCredentials(A) {
      this.credentials = A
    }
    addSharedMetadataHeaders(A) {
      if (!A["x-goog-user-project"] && this.quotaProjectId) A["x-goog-user-project"] = this.quotaProjectId;
      return A
    }
    static get RETRY_CONFIG() {
      return {
        retry: !0,
        retryConfig: {
          httpMethodsToRetry: ["GET", "PUT", "POST", "HEAD", "OPTIONS", "DELETE"]
        }
      }
    }
  }
  BhB.AuthClient = QhB
})
// @from(Ln 221431, Col 4)
B60 = U((JhB) => {
  Object.defineProperty(JhB, "__esModule", {
    value: !0
  });
  JhB.LoginTicket = void 0;
  class YhB {
    constructor(A, Q) {
      this.envelope = A, this.payload = Q
    }
    getEnvelope() {
      return this.envelope
    }
    getPayload() {
      return this.payload
    }
    getUserId() {
      let A = this.getPayload();
      if (A && A.sub) return A.sub;
      return null
    }
    getAttributes() {
      return {
        envelope: this.getEnvelope(),
        payload: this.getPayload()
      }
    }
  }
  JhB.LoginTicket = YhB
})
// @from(Ln 221460, Col 4)
E2A = U((DhB) => {
  Object.defineProperty(DhB, "__esModule", {
    value: !0
  });
  DhB.OAuth2Client = DhB.ClientAuthentication = DhB.CertificateFormat = DhB.CodeChallengeMethod = void 0;
  var tS8 = cP(),
    G60 = NA("querystring"),
    eS8 = NA("stream"),
    Ax8 = C61(),
    Z60 = lDA(),
    Qx8 = ck(),
    Bx8 = B60(),
    IhB;
  (function (A) {
    A.Plain = "plain", A.S256 = "S256"
  })(IhB || (DhB.CodeChallengeMethod = IhB = {}));
  var Om;
  (function (A) {
    A.PEM = "PEM", A.JWK = "JWK"
  })(Om || (DhB.CertificateFormat = Om = {}));
  var DTA;
  (function (A) {
    A.ClientSecretPost = "ClientSecretPost", A.ClientSecretBasic = "ClientSecretBasic", A.None = "None"
  })(DTA || (DhB.ClientAuthentication = DTA = {}));
  class MC extends Qx8.AuthClient {
    constructor(A, Q, B) {
      let G = A && typeof A === "object" ? A : {
        clientId: A,
        clientSecret: Q,
        redirectUri: B
      };
      super(G);
      this.certificateCache = {}, this.certificateExpiry = null, this.certificateCacheFormat = Om.PEM, this.refreshTokenPromises = new Map, this._clientId = G.clientId, this._clientSecret = G.clientSecret, this.redirectUri = G.redirectUri, this.endpoints = {
        tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
        oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        oauth2TokenUrl: "https://oauth2.googleapis.com/token",
        oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
        oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
        oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
        oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
        ...G.endpoints
      }, this.clientAuthentication = G.clientAuthentication || DTA.ClientSecretPost, this.issuers = G.issuers || ["accounts.google.com", "https://accounts.google.com", this.universeDomain]
    }
    generateAuthUrl(A = {}) {
      if (A.code_challenge_method && !A.code_challenge) throw Error("If a code_challenge_method is provided, code_challenge must be included.");
      if (A.response_type = A.response_type || "code", A.client_id = A.client_id || this._clientId, A.redirect_uri = A.redirect_uri || this.redirectUri, Array.isArray(A.scope)) A.scope = A.scope.join(" ");
      return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + G60.stringify(A)
    }
    generateCodeVerifier() {
      throw Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.")
    }
    async generateCodeVerifierAsync() {
      let A = (0, Z60.createCrypto)(),
        B = A.randomBytesBase64(96).replace(/\+/g, "~").replace(/=/g, "_").replace(/\//g, "-"),
        Z = (await A.sha256DigestBase64(B)).split("=")[0].replace(/\+/g, "-").replace(/\//g, "_");
      return {
        codeVerifier: B,
        codeChallenge: Z
      }
    }
    getToken(A, Q) {
      let B = typeof A === "string" ? {
        code: A
      } : A;
      if (Q) this.getTokenAsync(B).then((G) => Q(null, G.tokens, G.res), (G) => Q(G, null, G.response));
      else return this.getTokenAsync(B)
    }
    async getTokenAsync(A) {
      let Q = this.endpoints.oauth2TokenUrl.toString(),
        B = {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        G = {
          client_id: A.client_id || this._clientId,
          code_verifier: A.codeVerifier,
          code: A.code,
          grant_type: "authorization_code",
          redirect_uri: A.redirect_uri || this.redirectUri
        };
      if (this.clientAuthentication === DTA.ClientSecretBasic) {
        let J = Buffer.from(`${this._clientId}:${this._clientSecret}`);
        B.Authorization = `Basic ${J.toString("base64")}`
      }
      if (this.clientAuthentication === DTA.ClientSecretPost) G.client_secret = this._clientSecret;
      let Z = await this.transporter.request({
          ...MC.RETRY_CONFIG,
          method: "POST",
          url: Q,
          data: G60.stringify(G),
          headers: B
        }),
        Y = Z.data;
      if (Z.data && Z.data.expires_in) Y.expiry_date = new Date().getTime() + Z.data.expires_in * 1000, delete Y.expires_in;
      return this.emit("tokens", Y), {
        tokens: Y,
        res: Z
      }
    }
    async refreshToken(A) {
      if (!A) return this.refreshTokenNoCache(A);
      if (this.refreshTokenPromises.has(A)) return this.refreshTokenPromises.get(A);
      let Q = this.refreshTokenNoCache(A).then((B) => {
        return this.refreshTokenPromises.delete(A), B
      }, (B) => {
        throw this.refreshTokenPromises.delete(A), B
      });
      return this.refreshTokenPromises.set(A, Q), Q
    }
    async refreshTokenNoCache(A) {
      var Q;
      if (!A) throw Error("No refresh token is set.");
      let B = this.endpoints.oauth2TokenUrl.toString(),
        G = {
          refresh_token: A,
          client_id: this._clientId,
          client_secret: this._clientSecret,
          grant_type: "refresh_token"
        },
        Z;
      try {
        Z = await this.transporter.request({
          ...MC.RETRY_CONFIG,
          method: "POST",
          url: B,
          data: G60.stringify(G),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      } catch (J) {
        if (J instanceof tS8.GaxiosError && J.message === "invalid_grant" && ((Q = J.response) === null || Q === void 0 ? void 0 : Q.data) && /ReAuth/i.test(J.response.data.error_description)) J.message = JSON.stringify(J.response.data);
        throw J
      }
      let Y = Z.data;
      if (Z.data && Z.data.expires_in) Y.expiry_date = new Date().getTime() + Z.data.expires_in * 1000, delete Y.expires_in;
      return this.emit("tokens", Y), {
        tokens: Y,
        res: Z
      }
    }
    refreshAccessToken(A) {
      if (A) this.refreshAccessTokenAsync().then((Q) => A(null, Q.credentials, Q.res), A);
      else return this.refreshAccessTokenAsync()
    }
    async refreshAccessTokenAsync() {
      let A = await this.refreshToken(this.credentials.refresh_token),
        Q = A.tokens;
      return Q.refresh_token = this.credentials.refresh_token, this.credentials = Q, {
        credentials: this.credentials,
        res: A.res
      }
    }
    getAccessToken(A) {
      if (A) this.getAccessTokenAsync().then((Q) => A(null, Q.token, Q.res), A);
      else return this.getAccessTokenAsync()
    }
    async getAccessTokenAsync() {
      if (!this.credentials.access_token || this.isTokenExpiring()) {
        if (!this.credentials.refresh_token)
          if (this.refreshHandler) {
            let B = await this.processAndValidateRefreshHandler();
            if (B === null || B === void 0 ? void 0 : B.access_token) return this.setCredentials(B), {
              token: this.credentials.access_token
            }
          } else throw Error("No refresh token or refresh handler callback is set.");
        let Q = await this.refreshAccessTokenAsync();
        if (!Q.credentials || Q.credentials && !Q.credentials.access_token) throw Error("Could not refresh access token.");
        return {
          token: Q.credentials.access_token,
          res: Q.res
        }
      } else return {
        token: this.credentials.access_token
      }
    }
    async getRequestHeaders(A) {
      return (await this.getRequestMetadataAsync(A)).headers
    }
    async getRequestMetadataAsync(A) {
      let Q = this.credentials;
      if (!Q.access_token && !Q.refresh_token && !this.apiKey && !this.refreshHandler) throw Error("No access, refresh token, API key or refresh handler callback is set.");
      if (Q.access_token && !this.isTokenExpiring()) {
        Q.token_type = Q.token_type || "Bearer";
        let J = {
          Authorization: Q.token_type + " " + Q.access_token
        };
        return {
          headers: this.addSharedMetadataHeaders(J)
        }
      }
      if (this.refreshHandler) {
        let J = await this.processAndValidateRefreshHandler();
        if (J === null || J === void 0 ? void 0 : J.access_token) {
          this.setCredentials(J);
          let X = {
            Authorization: "Bearer " + this.credentials.access_token
          };
          return {
            headers: this.addSharedMetadataHeaders(X)
          }
        }
      }
      if (this.apiKey) return {
        headers: {
          "X-Goog-Api-Key": this.apiKey
        }
      };
      let B = null,
        G = null;
      try {
        B = await this.refreshToken(Q.refresh_token), G = B.tokens
      } catch (J) {
        let X = J;
        if (X.response && (X.response.status === 403 || X.response.status === 404)) X.message = `Could not refresh access token: ${X.message}`;
        throw X
      }
      let Z = this.credentials;
      Z.token_type = Z.token_type || "Bearer", G.refresh_token = Z.refresh_token, this.credentials = G;
      let Y = {
        Authorization: Z.token_type + " " + G.access_token
      };
      return {
        headers: this.addSharedMetadataHeaders(Y),
        res: B.res
      }
    }
    static getRevokeTokenUrl(A) {
      return new MC().getRevokeTokenURL(A).toString()
    }
    getRevokeTokenURL(A) {
      let Q = new URL(this.endpoints.oauth2RevokeUrl);
      return Q.searchParams.append("token", A), Q
    }
    revokeToken(A, Q) {
      let B = {
        ...MC.RETRY_CONFIG,
        url: this.getRevokeTokenURL(A).toString(),
        method: "POST"
      };
      if (Q) this.transporter.request(B).then((G) => Q(null, G), Q);
      else return this.transporter.request(B)
    }
    revokeCredentials(A) {
      if (A) this.revokeCredentialsAsync().then((Q) => A(null, Q), A);
      else return this.revokeCredentialsAsync()
    }
    async revokeCredentialsAsync() {
      let A = this.credentials.access_token;
      if (this.credentials = {}, A) return this.revokeToken(A);
      else throw Error("No access token to revoke.")
    }
    request(A, Q) {
      if (Q) this.requestAsync(A).then((B) => Q(null, B), (B) => {
        return Q(B, B.response)
      });
      else return this.requestAsync(A)
    }
    async requestAsync(A, Q = !1) {
      let B;
      try {
        let G = await this.getRequestMetadataAsync(A.url);
        if (A.headers = A.headers || {}, G.headers && G.headers["x-goog-user-project"]) A.headers["x-goog-user-project"] = G.headers["x-goog-user-project"];
        if (G.headers && G.headers.Authorization) A.headers.Authorization = G.headers.Authorization;
        if (this.apiKey) A.headers["X-Goog-Api-Key"] = this.apiKey;
        B = await this.transporter.request(A)
      } catch (G) {
        let Z = G.response;
        if (Z) {
          let Y = Z.status,
            J = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure),
            X = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler,
            I = Z.config.data instanceof eS8.Readable,
            D = Y === 401 || Y === 403;
          if (!Q && D && !I && J) return await this.refreshAccessTokenAsync(), this.requestAsync(A, !0);
          else if (!Q && D && !I && X) {
            let W = await this.processAndValidateRefreshHandler();
            if (W === null || W === void 0 ? void 0 : W.access_token) this.setCredentials(W);
            return this.requestAsync(A, !0)
          }
        }
        throw G
      }
      return B
    }
    verifyIdToken(A, Q) {
      if (Q && typeof Q !== "function") throw Error("This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.");
      if (Q) this.verifyIdTokenAsync(A).then((B) => Q(null, B), Q);
      else return this.verifyIdTokenAsync(A)
    }
    async verifyIdTokenAsync(A) {
      if (!A.idToken) throw Error("The verifyIdToken method requires an ID Token");
      let Q = await this.getFederatedSignonCertsAsync();
      return await this.verifySignedJwtWithCertsAsync(A.idToken, Q.certs, A.audience, this.issuers, A.maxExpiry)
    }
    async getTokenInfo(A) {
      let {
        data: Q
      } = await this.transporter.request({
        ...MC.RETRY_CONFIG,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${A}`
        },
        url: this.endpoints.tokenInfoUrl.toString()
      }), B = Object.assign({
        expiry_date: new Date().getTime() + Q.expires_in * 1000,
        scopes: Q.scope.split(" ")
      }, Q);
      return delete B.expires_in, delete B.scope, B
    }
    getFederatedSignonCerts(A) {
      if (A) this.getFederatedSignonCertsAsync().then((Q) => A(null, Q.certs, Q.res), A);
      else return this.getFederatedSignonCertsAsync()
    }
    async getFederatedSignonCertsAsync() {
      let A = new Date().getTime(),
        Q = (0, Z60.hasBrowserCrypto)() ? Om.JWK : Om.PEM;
      if (this.certificateExpiry && A < this.certificateExpiry.getTime() && this.certificateCacheFormat === Q) return {
        certs: this.certificateCache,
        format: Q
      };
      let B, G;
      switch (Q) {
        case Om.PEM:
          G = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
          break;
        case Om.JWK:
          G = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
          break;
        default:
          throw Error(`Unsupported certificate format ${Q}`)
      }
      try {
        B = await this.transporter.request({
          ...MC.RETRY_CONFIG,
          url: G
        })
      } catch (I) {
        if (I instanceof Error) I.message = `Failed to retrieve verification certificates: ${I.message}`;
        throw I
      }
      let Z = B ? B.headers["cache-control"] : void 0,
        Y = -1;
      if (Z) {
        let D = new RegExp("max-age=([0-9]*)").exec(Z);
        if (D && D.length === 2) Y = Number(D[1]) * 1000
      }
      let J = {};
      switch (Q) {
        case Om.PEM:
          J = B.data;
          break;
        case Om.JWK:
          for (let I of B.data.keys) J[I.kid] = I;
          break;
        default:
          throw Error(`Unsupported certificate format ${Q}`)
      }
      let X = new Date;
      return this.certificateExpiry = Y === -1 ? null : new Date(X.getTime() + Y), this.certificateCache = J, this.certificateCacheFormat = Q, {
        certs: J,
        format: Q,
        res: B
      }
    }
    getIapPublicKeys(A) {
      if (A) this.getIapPublicKeysAsync().then((Q) => A(null, Q.pubkeys, Q.res), A);
      else return this.getIapPublicKeysAsync()
    }
    async getIapPublicKeysAsync() {
      let A, Q = this.endpoints.oauth2IapPublicKeyUrl.toString();
      try {
        A = await this.transporter.request({
          ...MC.RETRY_CONFIG,
          url: Q
        })
      } catch (B) {
        if (B instanceof Error) B.message = `Failed to retrieve verification certificates: ${B.message}`;
        throw B
      }
      return {
        pubkeys: A.data,
        res: A
      }
    }
    verifySignedJwtWithCerts() {
      throw Error("verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.")
    }
    async verifySignedJwtWithCertsAsync(A, Q, B, G, Z) {
      let Y = (0, Z60.createCrypto)();
      if (!Z) Z = MC.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
      let J = A.split(".");
      if (J.length !== 3) throw Error("Wrong number of segments in token: " + A);
      let X = J[0] + "." + J[1],
        I = J[2],
        D, W;
      try {
        D = JSON.parse(Y.decodeBase64StringUtf8(J[0]))
      } catch (O) {
        if (O instanceof Error) O.message = `Can't parse token envelope: ${J[0]}': ${O.message}`;
        throw O
      }
      if (!D) throw Error("Can't parse token envelope: " + J[0]);
      try {
        W = JSON.parse(Y.decodeBase64StringUtf8(J[1]))
      } catch (O) {
        if (O instanceof Error) O.message = `Can't parse token payload '${J[0]}`;
        throw O
      }
      if (!W) throw Error("Can't parse token payload: " + J[1]);
      if (!Object.prototype.hasOwnProperty.call(Q, D.kid)) throw Error("No pem found for envelope: " + JSON.stringify(D));
      let K = Q[D.kid];
      if (D.alg === "ES256") I = Ax8.joseToDer(I, "ES256").toString("base64");
      if (!await Y.verify(K, X, I)) throw Error("Invalid token signature: " + A);
      if (!W.iat) throw Error("No issue time in token: " + JSON.stringify(W));
      if (!W.exp) throw Error("No expiration time in token: " + JSON.stringify(W));
      let F = Number(W.iat);
      if (isNaN(F)) throw Error("iat field using invalid format");
      let H = Number(W.exp);
      if (isNaN(H)) throw Error("exp field using invalid format");
      let E = new Date().getTime() / 1000;
      if (H >= E + Z) throw Error("Expiration time too far in future: " + JSON.stringify(W));
      let z = F - MC.CLOCK_SKEW_SECS_,
        $ = H + MC.CLOCK_SKEW_SECS_;
      if (E < z) throw Error("Token used too early, " + E + " < " + z + ": " + JSON.stringify(W));
      if (E > $) throw Error("Token used too late, " + E + " > " + $ + ": " + JSON.stringify(W));
      if (G && G.indexOf(W.iss) < 0) throw Error("Invalid issuer, expected one of [" + G + "], but got " + W.iss);
      if (typeof B < "u" && B !== null) {
        let O = W.aud,
          L = !1;
        if (B.constructor === Array) L = B.indexOf(O) > -1;
        else L = O === B;
        if (!L) throw Error("Wrong recipient, payload audience != requiredAudience")
      }
      return new Bx8.LoginTicket(D, W)
    }
    async processAndValidateRefreshHandler() {
      if (this.refreshHandler) {
        let A = await this.refreshHandler();
        if (!A.access_token) throw Error("No access token is returned by the refreshHandler callback.");
        return A
      }
      return
    }
    isTokenExpiring() {
      let A = this.credentials.expiry_date;
      return A ? A <= new Date().getTime() + this.eagerRefreshThresholdMillis : !1
    }
  }
  DhB.OAuth2Client = MC;
  MC.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
  MC.CLOCK_SKEW_SECS_ = 300;
  MC.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400
})
// @from(Ln 221915, Col 4)
Y60 = U((FhB) => {
  Object.defineProperty(FhB, "__esModule", {
    value: !0
  });
  FhB.Compute = void 0;
  var Jx8 = cP(),
    KhB = JTA(),
    Xx8 = E2A();
  class VhB extends Xx8.OAuth2Client {
    constructor(A = {}) {
      super(A);
      this.credentials = {
        expiry_date: 1,
        refresh_token: "compute-placeholder"
      }, this.serviceAccountEmail = A.serviceAccountEmail || "default", this.scopes = Array.isArray(A.scopes) ? A.scopes : A.scopes ? [A.scopes] : []
    }
    async refreshTokenNoCache(A) {
      let Q = `service-accounts/${this.serviceAccountEmail}/token`,
        B;
      try {
        let Z = {
          property: Q
        };
        if (this.scopes.length > 0) Z.params = {
          scopes: this.scopes.join(",")
        };
        B = await KhB.instance(Z)
      } catch (Z) {
        if (Z instanceof Jx8.GaxiosError) Z.message = `Could not refresh access token: ${Z.message}`, this.wrapError(Z);
        throw Z
      }
      let G = B;
      if (B && B.expires_in) G.expiry_date = new Date().getTime() + B.expires_in * 1000, delete G.expires_in;
      return this.emit("tokens", G), {
        tokens: G,
        res: null
      }
    }
    async fetchIdToken(A) {
      let Q = `service-accounts/${this.serviceAccountEmail}/identity?format=full&audience=${A}`,
        B;
      try {
        let G = {
          property: Q
        };
        B = await KhB.instance(G)
      } catch (G) {
        if (G instanceof Error) G.message = `Could not fetch ID token: ${G.message}`;
        throw G
      }
      return B
    }
    wrapError(A) {
      let Q = A.response;
      if (Q && Q.status) {
        if (A.status = Q.status, Q.status === 403) A.message = "A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified: " + A.message;
        else if (Q.status === 404) A.message = "A Not Found error was returned while attempting to retrieve an accesstoken for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have any permission scopes specified: " + A.message
      }
    }
  }
  FhB.Compute = VhB
})
// @from(Ln 221977, Col 4)
J60 = U((zhB) => {
  Object.defineProperty(zhB, "__esModule", {
    value: !0
  });
  zhB.IdTokenClient = void 0;
  var Ix8 = E2A();
  class EhB extends Ix8.OAuth2Client {
    constructor(A) {
      super(A);
      this.targetAudience = A.targetAudience, this.idTokenProvider = A.idTokenProvider
    }
    async getRequestMetadataAsync(A) {
      if (!this.credentials.id_token || !this.credentials.expiry_date || this.isTokenExpiring()) {
        let B = await this.idTokenProvider.fetchIdToken(this.targetAudience);
        this.credentials = {
          id_token: B,
          expiry_date: this.getIdTokenExpiryDate(B)
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + this.credentials.id_token
        }
      }
    }
    getIdTokenExpiryDate(A) {
      let Q = A.split(".")[1];
      if (Q) return JSON.parse(Buffer.from(Q, "base64").toString("ascii")).exp * 1000
    }
  }
  zhB.IdTokenClient = EhB
})
// @from(Ln 222009, Col 4)
X60 = U((UhB) => {
  Object.defineProperty(UhB, "__esModule", {
    value: !0
  });
  UhB.GCPEnv = void 0;
  UhB.clear = Dx8;
  UhB.getEnv = Wx8;
  var ChB = JTA(),
    Mm;
  (function (A) {
    A.APP_ENGINE = "APP_ENGINE", A.KUBERNETES_ENGINE = "KUBERNETES_ENGINE", A.CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS", A.COMPUTE_ENGINE = "COMPUTE_ENGINE", A.CLOUD_RUN = "CLOUD_RUN", A.NONE = "NONE"
  })(Mm || (UhB.GCPEnv = Mm = {}));
  var WTA;

  function Dx8() {
    WTA = void 0
  }
  async function Wx8() {
    if (WTA) return WTA;
    return WTA = Kx8(), WTA
  }
  async function Kx8() {
    let A = Mm.NONE;
    if (Vx8()) A = Mm.APP_ENGINE;
    else if (Fx8()) A = Mm.CLOUD_FUNCTIONS;
    else if (await zx8())
      if (await Ex8()) A = Mm.KUBERNETES_ENGINE;
      else if (Hx8()) A = Mm.CLOUD_RUN;
    else A = Mm.COMPUTE_ENGINE;
    else A = Mm.NONE;
    return A
  }

  function Vx8() {
    return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME)
  }

  function Fx8() {
    return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET)
  }

  function Hx8() {
    return !!process.env.K_CONFIGURATION
  }
  async function Ex8() {
    try {
      return await ChB.instance("attributes/cluster-name"), !0
    } catch (A) {
      return !1
    }
  }
  async function zx8() {
    return ChB.isAvailable()
  }
})
// @from(Ln 222064, Col 4)
I60 = U((PpG, NhB) => {
  var U61 = dk().Buffer,
    Ux8 = NA("stream"),
    qx8 = NA("util");

  function q61(A) {
    if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = U61.alloc(0), this;
    if (typeof A.pipe === "function") return this.buffer = U61.alloc(0), A.pipe(this), this;
    if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function () {
      this.emit("end", A), this.readable = !1, this.emit("close")
    }.bind(this)), this;
    throw TypeError("Unexpected data type (" + typeof A + ")")
  }
  qx8.inherits(q61, Ux8);
  q61.prototype.write = function (Q) {
    this.buffer = U61.concat([this.buffer, U61.from(Q)]), this.emit("data", Q)
  };
  q61.prototype.end = function (Q) {
    if (Q) this.write(Q);
    this.emit("end", Q), this.emit("close"), this.writable = !1, this.readable = !1
  };
  NhB.exports = q61
})
// @from(Ln 222087, Col 4)
W60 = U((SpG, whB) => {
  var KTA = NA("buffer").Buffer,
    D60 = NA("buffer").SlowBuffer;
  whB.exports = N61;

  function N61(A, Q) {
    if (!KTA.isBuffer(A) || !KTA.isBuffer(Q)) return !1;
    if (A.length !== Q.length) return !1;
    var B = 0;
    for (var G = 0; G < A.length; G++) B |= A[G] ^ Q[G];
    return B === 0
  }
  N61.install = function () {
    KTA.prototype.equal = D60.prototype.equal = function (Q) {
      return N61(this, Q)
    }
  };
  var Nx8 = KTA.prototype.equal,
    wx8 = D60.prototype.equal;
  N61.restore = function () {
    KTA.prototype.equal = Nx8, D60.prototype.equal = wx8
  }
})
// @from(Ln 222110, Col 4)
H60 = U((xpG, ShB) => {
  var oDA = dk().Buffer,
    z_ = NA("crypto"),
    OhB = C61(),
    LhB = NA("util"),
    Lx8 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
    VTA = "secret must be a string or buffer",
    aDA = "key must be a string or a buffer",
    Ox8 = "key must be a string, a buffer or an object",
    V60 = typeof z_.createPublicKey === "function";
  if (V60) aDA += " or a KeyObject", VTA += "or a KeyObject";

  function MhB(A) {
    if (oDA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (!V60) throw iP(aDA);
    if (typeof A !== "object") throw iP(aDA);
    if (typeof A.type !== "string") throw iP(aDA);
    if (typeof A.asymmetricKeyType !== "string") throw iP(aDA);
    if (typeof A.export !== "function") throw iP(aDA)
  }

  function RhB(A) {
    if (oDA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (typeof A === "object") return;
    throw iP(Ox8)
  }

  function Mx8(A) {
    if (oDA.isBuffer(A)) return;
    if (typeof A === "string") return A;
    if (!V60) throw iP(VTA);
    if (typeof A !== "object") throw iP(VTA);
    if (A.type !== "secret") throw iP(VTA);
    if (typeof A.export !== "function") throw iP(VTA)
  }

  function F60(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function _hB(A) {
    A = A.toString();
    var Q = 4 - A.length % 4;
    if (Q !== 4)
      for (var B = 0; B < Q; ++B) A += "=";
    return A.replace(/\-/g, "+").replace(/_/g, "/")
  }

  function iP(A) {
    var Q = [].slice.call(arguments, 1),
      B = LhB.format.bind(LhB, A).apply(null, Q);
    return TypeError(B)
  }

  function Rx8(A) {
    return oDA.isBuffer(A) || typeof A === "string"
  }

  function FTA(A) {
    if (!Rx8(A)) A = JSON.stringify(A);
    return A
  }

  function jhB(A) {
    return function (B, G) {
      Mx8(G), B = FTA(B);
      var Z = z_.createHmac("sha" + A, G),
        Y = (Z.update(B), Z.digest("base64"));
      return F60(Y)
    }
  }
  var K60, _x8 = "timingSafeEqual" in z_ ? function (Q, B) {
    if (Q.byteLength !== B.byteLength) return !1;
    return z_.timingSafeEqual(Q, B)
  } : function (Q, B) {
    if (!K60) K60 = W60();
    return K60(Q, B)
  };

  function jx8(A) {
    return function (B, G, Z) {
      var Y = jhB(A)(B, Z);
      return _x8(oDA.from(G), oDA.from(Y))
    }
  }

  function ThB(A) {
    return function (B, G) {
      RhB(G), B = FTA(B);
      var Z = z_.createSign("RSA-SHA" + A),
        Y = (Z.update(B), Z.sign(G, "base64"));
      return F60(Y)
    }
  }

  function PhB(A) {
    return function (B, G, Z) {
      MhB(Z), B = FTA(B), G = _hB(G);
      var Y = z_.createVerify("RSA-SHA" + A);
      return Y.update(B), Y.verify(Z, G, "base64")
    }
  }

  function Tx8(A) {
    return function (B, G) {
      RhB(G), B = FTA(B);
      var Z = z_.createSign("RSA-SHA" + A),
        Y = (Z.update(B), Z.sign({
          key: G,
          padding: z_.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: z_.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
      return F60(Y)
    }
  }

  function Px8(A) {
    return function (B, G, Z) {
      MhB(Z), B = FTA(B), G = _hB(G);
      var Y = z_.createVerify("RSA-SHA" + A);
      return Y.update(B), Y.verify({
        key: Z,
        padding: z_.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: z_.constants.RSA_PSS_SALTLEN_DIGEST
      }, G, "base64")
    }
  }

  function Sx8(A) {
    var Q = ThB(A);
    return function () {
      var G = Q.apply(null, arguments);
      return G = OhB.derToJose(G, "ES" + A), G
    }
  }

  function xx8(A) {
    var Q = PhB(A);
    return function (G, Z, Y) {
      Z = OhB.joseToDer(Z, "ES" + A).toString("base64");
      var J = Q(G, Z, Y);
      return J
    }
  }

  function yx8() {
    return function () {
      return ""
    }
  }

  function vx8() {
    return function (Q, B) {
      return B === ""
    }
  }
  ShB.exports = function (Q) {
    var B = {
        hs: jhB,
        rs: ThB,
        ps: Tx8,
        es: Sx8,
        none: yx8
      },
      G = {
        hs: jx8,
        rs: PhB,
        ps: Px8,
        es: xx8,
        none: vx8
      },
      Z = Q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!Z) throw iP(Lx8, Q);
    var Y = (Z[1] || Z[3]).toLowerCase(),
      J = Z[2];
    return {
      sign: B[Y](J),
      verify: G[Y](J)
    }
  }
})
// @from(Ln 222295, Col 4)
E60 = U((ypG, xhB) => {
  var kx8 = NA("buffer").Buffer;
  xhB.exports = function (Q) {
    if (typeof Q === "string") return Q;
    if (typeof Q === "number" || kx8.isBuffer(Q)) return Q.toString();
    return JSON.stringify(Q)
  }
})
// @from(Ln 222303, Col 4)
hhB = U((vpG, fhB) => {
  var bx8 = dk().Buffer,
    yhB = I60(),
    fx8 = H60(),
    hx8 = NA("stream"),
    vhB = E60(),
    z60 = NA("util");

  function khB(A, Q) {
    return bx8.from(A, Q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function gx8(A, Q, B) {
    B = B || "utf8";
    var G = khB(vhB(A), "binary"),
      Z = khB(vhB(Q), B);
    return z60.format("%s.%s", G, Z)
  }

  function bhB(A) {
    var {
      header: Q,
      payload: B
    } = A, G = A.secret || A.privateKey, Z = A.encoding, Y = fx8(Q.alg), J = gx8(Q, B, Z), X = Y.sign(J, G);
    return z60.format("%s.%s", J, X)
  }

  function w61(A) {
    var Q = A.secret || A.privateKey || A.key,
      B = new yhB(Q);
    this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = B, this.payload = new yhB(A.payload), this.secret.once("close", function () {
      if (!this.payload.writable && this.readable) this.sign()
    }.bind(this)), this.payload.once("close", function () {
      if (!this.secret.writable && this.readable) this.sign()
    }.bind(this))
  }
  z60.inherits(w61, hx8);
  w61.prototype.sign = function () {
    try {
      var Q = bhB({
        header: this.header,
        payload: this.payload.buffer,
        secret: this.secret.buffer,
        encoding: this.encoding
      });
      return this.emit("done", Q), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (B) {
      this.readable = !1, this.emit("error", B), this.emit("close")
    }
  };
  w61.sign = bhB;
  fhB.exports = w61
})
// @from(Ln 222356, Col 4)
ahB = U((kpG, nhB) => {
  var uhB = dk().Buffer,
    ghB = I60(),
    ux8 = H60(),
    mx8 = NA("stream"),
    mhB = E60(),
    dx8 = NA("util"),
    cx8 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

  function px8(A) {
    return Object.prototype.toString.call(A) === "[object Object]"
  }

  function lx8(A) {
    if (px8(A)) return A;
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }

  function dhB(A) {
    var Q = A.split(".", 1)[0];
    return lx8(uhB.from(Q, "base64").toString("binary"))
  }

  function ix8(A) {
    return A.split(".", 2).join(".")
  }

  function chB(A) {
    return A.split(".")[2]
  }

  function nx8(A, Q) {
    Q = Q || "utf8";
    var B = A.split(".")[1];
    return uhB.from(B, "base64").toString(Q)
  }

  function phB(A) {
    return cx8.test(A) && !!dhB(A)
  }

  function lhB(A, Q, B) {
    if (!Q) {
      var G = Error("Missing algorithm parameter for jws.verify");
      throw G.code = "MISSING_ALGORITHM", G
    }
    A = mhB(A);
    var Z = chB(A),
      Y = ix8(A),
      J = ux8(Q);
    return J.verify(Y, Z, B)
  }

  function ihB(A, Q) {
    if (Q = Q || {}, A = mhB(A), !phB(A)) return null;
    var B = dhB(A);
    if (!B) return null;
    var G = nx8(A);
    if (B.typ === "JWT" || Q.json) G = JSON.parse(G, Q.encoding);
    return {
      header: B,
      payload: G,
      signature: chB(A)
    }
  }

  function rDA(A) {
    A = A || {};
    var Q = A.secret || A.publicKey || A.key,
      B = new ghB(Q);
    this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = B, this.signature = new ghB(A.signature), this.secret.once("close", function () {
      if (!this.signature.writable && this.readable) this.verify()
    }.bind(this)), this.signature.once("close", function () {
      if (!this.secret.writable && this.readable) this.verify()
    }.bind(this))
  }
  dx8.inherits(rDA, mx8);
  rDA.prototype.verify = function () {
    try {
      var Q = lhB(this.signature.buffer, this.algorithm, this.key.buffer),
        B = ihB(this.signature.buffer, this.encoding);
      return this.emit("done", Q, B), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (G) {
      this.readable = !1, this.emit("error", G), this.emit("close")
    }
  };
  rDA.decode = ihB;
  rDA.isValid = phB;
  rDA.verify = lhB;
  nhB.exports = rDA
})
// @from(Ln 222451, Col 4)
$60 = U((ox8) => {
  var ohB = hhB(),
    L61 = ahB(),
    ax8 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
  ox8.ALGORITHMS = ax8;
  ox8.sign = ohB.sign;
  ox8.verify = L61.verify;
  ox8.decode = L61.decode;
  ox8.isValid = L61.isValid;
  ox8.createSign = function (Q) {
    return new ohB(Q)
  };
  ox8.createVerify = function (Q) {
    return new L61(Q)
  }
})
// @from(Ln 222467, Col 4)
ZgB = U((Vo) => {
  var nP = Vo && Vo.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    rhB = Vo && Vo.__classPrivateFieldSet || function (A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    aP, sDA, C60, shB, thB, U60, q60, ehB;
  Object.defineProperty(Vo, "__esModule", {
    value: !0
  });
  Vo.GoogleToken = void 0;
  var AgB = NA("fs"),
    Gy8 = cP(),
    Zy8 = $60(),
    Yy8 = NA("path"),
    Jy8 = NA("util"),
    QgB = AgB.readFile ? (0, Jy8.promisify)(AgB.readFile) : async () => {
      throw new tDA("use key rather than keyFile.", "MISSING_CREDENTIALS")
    }, BgB = "https://www.googleapis.com/oauth2/v4/token", Xy8 = "https://accounts.google.com/o/oauth2/revoke?token=";
  class tDA extends Error {
    constructor(A, Q) {
      super(A);
      this.code = Q
    }
  }
  class GgB {
    get accessToken() {
      return this.rawToken ? this.rawToken.access_token : void 0
    }
    get idToken() {
      return this.rawToken ? this.rawToken.id_token : void 0
    }
    get tokenType() {
      return this.rawToken ? this.rawToken.token_type : void 0
    }
    get refreshToken() {
      return this.rawToken ? this.rawToken.refresh_token : void 0
    }
    constructor(A) {
      aP.add(this), this.transporter = {
        request: (Q) => (0, Gy8.request)(Q)
      }, sDA.set(this, void 0), nP(this, aP, "m", q60).call(this, A)
    }
    hasExpired() {
      let A = new Date().getTime();
      if (this.rawToken && this.expiresAt) return A >= this.expiresAt;
      else return !0
    }
    isTokenExpiring() {
      var A;
      let Q = new Date().getTime(),
        B = (A = this.eagerRefreshThresholdMillis) !== null && A !== void 0 ? A : 0;
      if (this.rawToken && this.expiresAt) return this.expiresAt <= Q + B;
      else return !0
    }
    getToken(A, Q = {}) {
      if (typeof A === "object") Q = A, A = void 0;
      if (Q = Object.assign({
          forceRefresh: !1
        }, Q), A) {
        let B = A;
        nP(this, aP, "m", C60).call(this, Q).then((G) => B(null, G), A);
        return
      }
      return nP(this, aP, "m", C60).call(this, Q)
    }
    async getCredentials(A) {
      switch (Yy8.extname(A)) {
        case ".json": {
          let B = await QgB(A, "utf8"),
            G = JSON.parse(B),
            Z = G.private_key,
            Y = G.client_email;
          if (!Z || !Y) throw new tDA("private_key and client_email are required.", "MISSING_CREDENTIALS");
          return {
            privateKey: Z,
            clientEmail: Y
          }
        }
        case ".der":
        case ".crt":
        case ".pem":
          return {
            privateKey: await QgB(A, "utf8")
          };
        case ".p12":
        case ".pfx":
          throw new tDA("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
        default:
          throw new tDA("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE")
      }
    }
    revokeToken(A) {
      if (A) {
        nP(this, aP, "m", U60).call(this).then(() => A(), A);
        return
      }
      return nP(this, aP, "m", U60).call(this)
    }
  }
  Vo.GoogleToken = GgB;
  sDA = new WeakMap, aP = new WeakSet, C60 = async function (Q) {
    if (nP(this, sDA, "f") && !Q.forceRefresh) return nP(this, sDA, "f");
    try {
      return await rhB(this, sDA, nP(this, aP, "m", shB).call(this, Q), "f")
    } finally {
      rhB(this, sDA, void 0, "f")
    }
  }, shB = async function (Q) {
    if (this.isTokenExpiring() === !1 && Q.forceRefresh === !1) return Promise.resolve(this.rawToken);
    if (!this.key && !this.keyFile) throw Error("No key or keyFile set.");
    if (!this.key && this.keyFile) {
      let B = await this.getCredentials(this.keyFile);
      if (this.key = B.privateKey, this.iss = B.clientEmail || this.iss, !B.clientEmail) nP(this, aP, "m", thB).call(this)
    }
    return nP(this, aP, "m", ehB).call(this)
  }, thB = function () {
    if (!this.iss) throw new tDA("email is required.", "MISSING_CREDENTIALS")
  }, U60 = async function () {
    if (!this.accessToken) throw Error("No token to revoke.");
    let Q = Xy8 + this.accessToken;
    await this.transporter.request({
      url: Q,
      retry: !0
    }), nP(this, aP, "m", q60).call(this, {
      email: this.iss,
      sub: this.sub,
      key: this.key,
      keyFile: this.keyFile,
      scope: this.scope,
      additionalClaims: this.additionalClaims
    })
  }, q60 = function (Q = {}) {
    if (this.keyFile = Q.keyFile, this.key = Q.key, this.rawToken = void 0, this.iss = Q.email || Q.iss, this.sub = Q.sub, this.additionalClaims = Q.additionalClaims, typeof Q.scope === "object") this.scope = Q.scope.join(" ");
    else this.scope = Q.scope;
    if (this.eagerRefreshThresholdMillis = Q.eagerRefreshThresholdMillis, Q.transporter) this.transporter = Q.transporter
  }, ehB = async function () {
    var Q, B;
    let G = Math.floor(new Date().getTime() / 1000),
      Z = this.additionalClaims || {},
      Y = Object.assign({
        iss: this.iss,
        scope: this.scope,
        aud: BgB,
        exp: G + 3600,
        iat: G,
        sub: this.sub
      }, Z),
      J = Zy8.sign({
        header: {
          alg: "RS256"
        },
        payload: Y,
        secret: this.key
      });
    try {
      let X = await this.transporter.request({
        method: "POST",
        url: BgB,
        data: {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: J
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "json",
        retryConfig: {
          httpMethodsToRetry: ["POST"]
        }
      });
      return this.rawToken = X.data, this.expiresAt = X.data.expires_in === null || X.data.expires_in === void 0 ? void 0 : (G + X.data.expires_in) * 1000, this.rawToken
    } catch (X) {
      this.rawToken = void 0, this.tokenExpires = void 0;
      let I = X.response && ((Q = X.response) === null || Q === void 0 ? void 0 : Q.data) ? (B = X.response) === null || B === void 0 ? void 0 : B.data : {};
      if (I.error) {
        let D = I.error_description ? `: ${I.error_description}` : "";
        X.message = `${I.error}${D}`
      }
      throw X
    }
  }
})
// @from(Ln 222656, Col 4)
w60 = U((JgB) => {
  Object.defineProperty(JgB, "__esModule", {
    value: !0
  });
  JgB.JWTAccess = void 0;
  var Iy8 = $60(),
    Dy8 = Ko(),
    YgB = {
      alg: "RS256",
      typ: "JWT"
    };
  class N60 {
    constructor(A, Q, B, G) {
      this.cache = new Dy8.LRUCache({
        capacity: 500,
        maxAge: 3600000
      }), this.email = A, this.key = Q, this.keyId = B, this.eagerRefreshThresholdMillis = G !== null && G !== void 0 ? G : 300000
    }
    getCachedKey(A, Q) {
      let B = A;
      if (Q && Array.isArray(Q) && Q.length) B = A ? `${A}_${Q.join("_")}` : `${Q.join("_")}`;
      else if (typeof Q === "string") B = A ? `${A}_${Q}` : Q;
      if (!B) throw Error("Scopes or url must be provided");
      return B
    }
    getRequestHeaders(A, Q, B) {
      let G = this.getCachedKey(A, B),
        Z = this.cache.get(G),
        Y = Date.now();
      if (Z && Z.expiration - Y > this.eagerRefreshThresholdMillis) return Z.headers;
      let J = Math.floor(Date.now() / 1000),
        X = N60.getExpirationTime(J),
        I;
      if (Array.isArray(B)) B = B.join(" ");
      if (B) I = {
        iss: this.email,
        sub: this.email,
        scope: B,
        exp: X,
        iat: J
      };
      else I = {
        iss: this.email,
        sub: this.email,
        aud: A,
        exp: X,
        iat: J
      };
      if (Q) {
        for (let F in I)
          if (Q[F]) throw Error(`The '${F}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`)
      }
      let D = this.keyId ? {
          ...YgB,
          kid: this.keyId
        } : YgB,
        W = Object.assign(I, Q),
        V = {
          Authorization: `Bearer ${Iy8.sign({header:D,payload:W,secret:this.key})}`
        };
      return this.cache.set(G, {
        expiration: X * 1000,
        headers: V
      }), V
    }
    static getExpirationTime(A) {
      return A + 3600
    }
    fromJSON(A) {
      if (!A) throw Error("Must pass in a JSON object containing the service account auth settings.");
      if (!A.client_email) throw Error("The incoming JSON object does not contain a client_email field");
      if (!A.private_key) throw Error("The incoming JSON object does not contain a private_key field");
      this.email = A.client_email, this.key = A.private_key, this.keyId = A.private_key_id, this.projectId = A.project_id
    }
    fromStream(A, Q) {
      if (Q) this.fromStreamAsync(A).then(() => Q(), Q);
      else return this.fromStreamAsync(A)
    }
    fromStreamAsync(A) {
      return new Promise((Q, B) => {
        if (!A) B(Error("Must pass in a stream containing the service account auth settings."));
        let G = "";
        A.setEncoding("utf8").on("data", (Z) => G += Z).on("error", B).on("end", () => {
          try {
            let Z = JSON.parse(G);
            this.fromJSON(Z), Q()
          } catch (Z) {
            B(Z)
          }
        })
      })
    }
  }
  JgB.JWTAccess = N60
})
// @from(Ln 222751, Col 4)
O60 = U((DgB) => {
  Object.defineProperty(DgB, "__esModule", {
    value: !0
  });
  DgB.JWT = void 0;
  var IgB = ZgB(),
    Wy8 = w60(),
    Ky8 = E2A(),
    O61 = ck();
  class L60 extends Ky8.OAuth2Client {
    constructor(A, Q, B, G, Z, Y) {
      let J = A && typeof A === "object" ? A : {
        email: A,
        keyFile: Q,
        key: B,
        keyId: Y,
        scopes: G,
        subject: Z
      };
      super(J);
      this.email = J.email, this.keyFile = J.keyFile, this.key = J.key, this.keyId = J.keyId, this.scopes = J.scopes, this.subject = J.subject, this.additionalClaims = J.additionalClaims, this.credentials = {
        refresh_token: "jwt-placeholder",
        expiry_date: 1
      }
    }
    createScoped(A) {
      let Q = new L60(this);
      return Q.scopes = A, Q
    }
    async getRequestMetadataAsync(A) {
      A = this.defaultServicePath ? `https://${this.defaultServicePath}/` : A;
      let Q = !this.hasUserScopes() && A || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== O61.DEFAULT_UNIVERSE;
      if (this.subject && this.universeDomain !== O61.DEFAULT_UNIVERSE) throw RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${O61.DEFAULT_UNIVERSE}`);
      if (!this.apiKey && Q)
        if (this.additionalClaims && this.additionalClaims.target_audience) {
          let {
            tokens: B
          } = await this.refreshToken();
          return {
            headers: this.addSharedMetadataHeaders({
              Authorization: `Bearer ${B.id_token}`
            })
          }
        } else {
          if (!this.access) this.access = new Wy8.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
          let B;
          if (this.hasUserScopes()) B = this.scopes;
          else if (!A) B = this.defaultScopes;
          let G = this.useJWTAccessWithScope || this.universeDomain !== O61.DEFAULT_UNIVERSE,
            Z = await this.access.getRequestHeaders(A !== null && A !== void 0 ? A : void 0, this.additionalClaims, G ? B : void 0);
          return {
            headers: this.addSharedMetadataHeaders(Z)
          }
        }
      else if (this.hasAnyScopes() || this.apiKey) return super.getRequestMetadataAsync(A);
      else return {
        headers: {}
      }
    }
    async fetchIdToken(A) {
      let Q = new IgB.GoogleToken({
        iss: this.email,
        sub: this.subject,
        scope: this.scopes || this.defaultScopes,
        keyFile: this.keyFile,
        key: this.key,
        additionalClaims: {
          target_audience: A
        },
        transporter: this.transporter
      });
      if (await Q.getToken({
          forceRefresh: !0
        }), !Q.idToken) throw Error("Unknown error: Failed to fetch ID token");
      return Q.idToken
    }
    hasUserScopes() {
      if (!this.scopes) return !1;
      return this.scopes.length > 0
    }
    hasAnyScopes() {
      if (this.scopes && this.scopes.length > 0) return !0;
      if (this.defaultScopes && this.defaultScopes.length > 0) return !0;
      return !1
    }
    authorize(A) {
      if (A) this.authorizeAsync().then((Q) => A(null, Q), A);
      else return this.authorizeAsync()
    }
    async authorizeAsync() {
      let A = await this.refreshToken();
      if (!A) throw Error("No result returned");
      return this.credentials = A.tokens, this.credentials.refresh_token = "jwt-placeholder", this.key = this.gtoken.key, this.email = this.gtoken.iss, A.tokens
    }
    async refreshTokenNoCache(A) {
      let Q = this.createGToken(),
        G = {
          access_token: (await Q.getToken({
            forceRefresh: this.isTokenExpiring()
          })).access_token,
          token_type: "Bearer",
          expiry_date: Q.expiresAt,
          id_token: Q.idToken
        };
      return this.emit("tokens", G), {
        res: null,
        tokens: G
      }
    }
    createGToken() {
      if (!this.gtoken) this.gtoken = new IgB.GoogleToken({
        iss: this.email,
        sub: this.subject,
        scope: this.scopes || this.defaultScopes,
        keyFile: this.keyFile,
        key: this.key,
        additionalClaims: this.additionalClaims,
        transporter: this.transporter
      });
      return this.gtoken
    }
    fromJSON(A) {
      if (!A) throw Error("Must pass in a JSON object containing the service account auth settings.");
      if (!A.client_email) throw Error("The incoming JSON object does not contain a client_email field");
      if (!A.private_key) throw Error("The incoming JSON object does not contain a private_key field");
      this.email = A.client_email, this.key = A.private_key, this.keyId = A.private_key_id, this.projectId = A.project_id, this.quotaProjectId = A.quota_project_id, this.universeDomain = A.universe_domain || this.universeDomain
    }
    fromStream(A, Q) {
      if (Q) this.fromStreamAsync(A).then(() => Q(), Q);
      else return this.fromStreamAsync(A)
    }
    fromStreamAsync(A) {
      return new Promise((Q, B) => {
        if (!A) throw Error("Must pass in a stream containing the service account auth settings.");
        let G = "";
        A.setEncoding("utf8").on("error", B).on("data", (Z) => G += Z).on("end", () => {
          try {
            let Z = JSON.parse(G);
            this.fromJSON(Z), Q()
          } catch (Z) {
            B(Z)
          }
        })
      })
    }
    fromAPIKey(A) {
      if (typeof A !== "string") throw Error("Must provide an API Key string.");
      this.apiKey = A
    }
    async getCredentials() {
      if (this.key) return {
        private_key: this.key,
        client_email: this.email
      };
      else if (this.keyFile) {
        let Q = await this.createGToken().getCredentials(this.keyFile);
        return {
          private_key: Q.privateKey,
          client_email: Q.clientEmail
        }
      }
      throw Error("A key or a keyFile must be provided to getCredentials.")
    }
  }
  DgB.JWT = L60
})
// @from(Ln 222917, Col 4)
M60 = U((KgB) => {
  Object.defineProperty(KgB, "__esModule", {
    value: !0
  });
  KgB.UserRefreshClient = KgB.USER_REFRESH_ACCOUNT_TYPE = void 0;
  var Vy8 = E2A(),
    Fy8 = NA("querystring");
  KgB.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
  class M61 extends Vy8.OAuth2Client {
    constructor(A, Q, B, G, Z) {
      let Y = A && typeof A === "object" ? A : {
        clientId: A,
        clientSecret: Q,
        refreshToken: B,
        eagerRefreshThresholdMillis: G,
        forceRefreshOnFailure: Z
      };
      super(Y);
      this._refreshToken = Y.refreshToken, this.credentials.refresh_token = Y.refreshToken
    }
    async refreshTokenNoCache(A) {
      return super.refreshTokenNoCache(this._refreshToken)
    }
    async fetchIdToken(A) {
      return (await this.transporter.request({
        ...M61.RETRY_CONFIG,
        url: this.endpoints.oauth2TokenUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: (0, Fy8.stringify)({
          client_id: this._clientId,
          client_secret: this._clientSecret,
          grant_type: "refresh_token",
          refresh_token: this._refreshToken,
          target_audience: A
        })
      })).data.id_token
    }
    fromJSON(A) {
      if (!A) throw Error("Must pass in a JSON object containing the user refresh token");
      if (A.type !== "authorized_user") throw Error('The incoming JSON object does not have the "authorized_user" type');
      if (!A.client_id) throw Error("The incoming JSON object does not contain a client_id field");
      if (!A.client_secret) throw Error("The incoming JSON object does not contain a client_secret field");
      if (!A.refresh_token) throw Error("The incoming JSON object does not contain a refresh_token field");
      this._clientId = A.client_id, this._clientSecret = A.client_secret, this._refreshToken = A.refresh_token, this.credentials.refresh_token = A.refresh_token, this.quotaProjectId = A.quota_project_id, this.universeDomain = A.universe_domain || this.universeDomain
    }
    fromStream(A, Q) {
      if (Q) this.fromStreamAsync(A).then(() => Q(), Q);
      else return this.fromStreamAsync(A)
    }
    async fromStreamAsync(A) {
      return new Promise((Q, B) => {
        if (!A) return B(Error("Must pass in a stream containing the user refresh token."));
        let G = "";
        A.setEncoding("utf8").on("error", B).on("data", (Z) => G += Z).on("end", () => {
          try {
            let Z = JSON.parse(G);
            return this.fromJSON(Z), Q()
          } catch (Z) {
            return B(Z)
          }
        })
      })
    }
    static fromJSON(A) {
      let Q = new M61;
      return Q.fromJSON(A), Q
    }
  }
  KgB.UserRefreshClient = M61
})
// @from(Ln 222990, Col 4)
R60 = U((HgB) => {
  Object.defineProperty(HgB, "__esModule", {
    value: !0
  });
  HgB.Impersonated = HgB.IMPERSONATED_ACCOUNT_TYPE = void 0;
  var FgB = E2A(),
    Ey8 = cP(),
    zy8 = Ko();
  HgB.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
  class HTA extends FgB.OAuth2Client {
    constructor(A = {}) {
      var Q, B, G, Z, Y, J;
      super(A);
      if (this.credentials = {
          expiry_date: 1,
          refresh_token: "impersonated-placeholder"
        }, this.sourceClient = (Q = A.sourceClient) !== null && Q !== void 0 ? Q : new FgB.OAuth2Client, this.targetPrincipal = (B = A.targetPrincipal) !== null && B !== void 0 ? B : "", this.delegates = (G = A.delegates) !== null && G !== void 0 ? G : [], this.targetScopes = (Z = A.targetScopes) !== null && Z !== void 0 ? Z : [], this.lifetime = (Y = A.lifetime) !== null && Y !== void 0 ? Y : 3600, !(0, zy8.originalOrCamelOptions)(A).get("universe_domain")) this.universeDomain = this.sourceClient.universeDomain;
      else if (this.sourceClient.universeDomain !== this.universeDomain) throw RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
      this.endpoint = (J = A.endpoint) !== null && J !== void 0 ? J : `https://iamcredentials.${this.universeDomain}`
    }
    async sign(A) {
      await this.sourceClient.getAccessToken();
      let Q = `projects/-/serviceAccounts/${this.targetPrincipal}`,
        B = `${this.endpoint}/v1/${Q}:signBlob`,
        G = {
          delegates: this.delegates,
          payload: Buffer.from(A).toString("base64")
        };
      return (await this.sourceClient.request({
        ...HTA.RETRY_CONFIG,
        url: B,
        data: G,
        method: "POST"
      })).data
    }
    getTargetPrincipal() {
      return this.targetPrincipal
    }
    async refreshToken() {
      var A, Q, B, G, Z, Y;
      try {
        await this.sourceClient.getAccessToken();
        let J = "projects/-/serviceAccounts/" + this.targetPrincipal,
          X = `${this.endpoint}/v1/${J}:generateAccessToken`,
          I = {
            delegates: this.delegates,
            scope: this.targetScopes,
            lifetime: this.lifetime + "s"
          },
          D = await this.sourceClient.request({
            ...HTA.RETRY_CONFIG,
            url: X,
            data: I,
            method: "POST"
          }),
          W = D.data;
        return this.credentials.access_token = W.accessToken, this.credentials.expiry_date = Date.parse(W.expireTime), {
          tokens: this.credentials,
          res: D
        }
      } catch (J) {
        if (!(J instanceof Error)) throw J;
        let X = 0,
          I = "";
        if (J instanceof Ey8.GaxiosError) X = (B = (Q = (A = J === null || J === void 0 ? void 0 : J.response) === null || A === void 0 ? void 0 : A.data) === null || Q === void 0 ? void 0 : Q.error) === null || B === void 0 ? void 0 : B.status, I = (Y = (Z = (G = J === null || J === void 0 ? void 0 : J.response) === null || G === void 0 ? void 0 : G.data) === null || Z === void 0 ? void 0 : Z.error) === null || Y === void 0 ? void 0 : Y.message;
        if (X && I) throw J.message = `${X}: unable to impersonate: ${I}`, J;
        else throw J.message = `unable to impersonate: ${J}`, J
      }
    }
    async fetchIdToken(A, Q) {
      var B, G;
      await this.sourceClient.getAccessToken();
      let Z = `projects/-/serviceAccounts/${this.targetPrincipal}`,
        Y = `${this.endpoint}/v1/${Z}:generateIdToken`,
        J = {
          delegates: this.delegates,
          audience: A,
          includeEmail: (B = Q === null || Q === void 0 ? void 0 : Q.includeEmail) !== null && B !== void 0 ? B : !0,
          useEmailAzp: (G = Q === null || Q === void 0 ? void 0 : Q.includeEmail) !== null && G !== void 0 ? G : !0
        };
      return (await this.sourceClient.request({
        ...HTA.RETRY_CONFIG,
        url: Y,
        data: J,
        method: "POST"
      })).data.token
    }
  }
  HgB.Impersonated = HTA
})
// @from(Ln 223080, Col 4)
_60 = U((CgB) => {
  Object.defineProperty(CgB, "__esModule", {
    value: !0
  });
  CgB.OAuthClientAuthHandler = void 0;
  CgB.getErrorFromOAuthErrorResponse = qy8;
  var zgB = NA("querystring"),
    Cy8 = lDA(),
    Uy8 = ["PUT", "POST", "PATCH"];
  class $gB {
    constructor(A) {
      this.clientAuthentication = A, this.crypto = (0, Cy8.createCrypto)()
    }
    applyClientAuthenticationOptions(A, Q) {
      if (this.injectAuthenticatedHeaders(A, Q), !Q) this.injectAuthenticatedRequestBody(A)
    }
    injectAuthenticatedHeaders(A, Q) {
      var B;
      if (Q) A.headers = A.headers || {}, Object.assign(A.headers, {
        Authorization: `Bearer ${Q}}`
      });
      else if (((B = this.clientAuthentication) === null || B === void 0 ? void 0 : B.confidentialClientType) === "basic") {
        A.headers = A.headers || {};
        let G = this.clientAuthentication.clientId,
          Z = this.clientAuthentication.clientSecret || "",
          Y = this.crypto.encodeBase64StringUtf8(`${G}:${Z}`);
        Object.assign(A.headers, {
          Authorization: `Basic ${Y}`
        })
      }
    }
    injectAuthenticatedRequestBody(A) {
      var Q;
      if (((Q = this.clientAuthentication) === null || Q === void 0 ? void 0 : Q.confidentialClientType) === "request-body") {
        let B = (A.method || "GET").toUpperCase();
        if (Uy8.indexOf(B) !== -1) {
          let G, Z = A.headers || {};
          for (let Y in Z)
            if (Y.toLowerCase() === "content-type" && Z[Y]) {
              G = Z[Y].toLowerCase();
              break
            } if (G === "application/x-www-form-urlencoded") {
            A.data = A.data || "";
            let Y = zgB.parse(A.data);
            Object.assign(Y, {
              client_id: this.clientAuthentication.clientId,
              client_secret: this.clientAuthentication.clientSecret || ""
            }), A.data = zgB.stringify(Y)
          } else if (G === "application/json") A.data = A.data || {}, Object.assign(A.data, {
            client_id: this.clientAuthentication.clientId,
            client_secret: this.clientAuthentication.clientSecret || ""
          });
          else throw Error(`${G} content-types are not supported with ${this.clientAuthentication.confidentialClientType} client authentication`)
        } else throw Error(`${B} HTTP method does not support ${this.clientAuthentication.confidentialClientType} client authentication`)
      }
    }
    static get RETRY_CONFIG() {
      return {
        retry: !0,
        retryConfig: {
          httpMethodsToRetry: ["GET", "PUT", "POST", "HEAD", "OPTIONS", "DELETE"]
        }
      }
    }
  }
  CgB.OAuthClientAuthHandler = $gB;

  function qy8(A, Q) {
    let {
      error: B,
      error_description: G,
      error_uri: Z
    } = A, Y = `Error code ${B}`;
    if (typeof G < "u") Y += `: ${G}`;
    if (typeof Z < "u") Y += ` - ${Z}`;
    let J = Error(Y);
    if (Q) {
      let X = Object.keys(Q);
      if (Q.stack) X.push("stack");
      X.forEach((I) => {
        if (I !== "message") Object.defineProperty(J, I, {
          value: Q[I],
          writable: !1,
          enumerable: !0
        })
      })
    }
    return J
  }
})
// @from(Ln 223170, Col 4)
T60 = U((NgB) => {
  Object.defineProperty(NgB, "__esModule", {
    value: !0
  });
  NgB.StsCredentials = void 0;
  var wy8 = cP(),
    Ly8 = NA("querystring"),
    Oy8 = ITA(),
    qgB = _60();
  class j60 extends qgB.OAuthClientAuthHandler {
    constructor(A, Q) {
      super(Q);
      this.tokenExchangeEndpoint = A, this.transporter = new Oy8.DefaultTransporter
    }
    async exchangeToken(A, Q, B) {
      var G, Z, Y;
      let J = {
        grant_type: A.grantType,
        resource: A.resource,
        audience: A.audience,
        scope: (G = A.scope) === null || G === void 0 ? void 0 : G.join(" "),
        requested_token_type: A.requestedTokenType,
        subject_token: A.subjectToken,
        subject_token_type: A.subjectTokenType,
        actor_token: (Z = A.actingParty) === null || Z === void 0 ? void 0 : Z.actorToken,
        actor_token_type: (Y = A.actingParty) === null || Y === void 0 ? void 0 : Y.actorTokenType,
        options: B && JSON.stringify(B)
      };
      Object.keys(J).forEach((D) => {
        if (typeof J[D] > "u") delete J[D]
      });
      let X = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      Object.assign(X, Q || {});
      let I = {
        ...j60.RETRY_CONFIG,
        url: this.tokenExchangeEndpoint.toString(),
        method: "POST",
        headers: X,
        data: Ly8.stringify(J),
        responseType: "json"
      };
      this.applyClientAuthenticationOptions(I);
      try {
        let D = await this.transporter.request(I),
          W = D.data;
        return W.res = D, W
      } catch (D) {
        if (D instanceof wy8.GaxiosError && D.response) throw (0, qgB.getErrorFromOAuthErrorResponse)(D.response.data, D);
        throw D
      }
    }
  }
  NgB.StsCredentials = j60
})
// @from(Ln 223226, Col 4)
Fo = U((FF) => {
  var P60 = FF && FF.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    LgB = FF && FF.__classPrivateFieldSet || function (A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    S60, eDA, MgB;
  Object.defineProperty(FF, "__esModule", {
    value: !0
  });
  FF.BaseExternalAccountClient = FF.DEFAULT_UNIVERSE = FF.CLOUD_RESOURCE_MANAGER = FF.EXTERNAL_ACCOUNT_TYPE = FF.EXPIRATION_TIME_OFFSET = void 0;
  var My8 = NA("stream"),
    Ry8 = ck(),
    _y8 = T60(),
    OgB = Ko(),
    jy8 = "urn:ietf:params:oauth:grant-type:token-exchange",
    Ty8 = "urn:ietf:params:oauth:token-type:access_token",
    x60 = "https://www.googleapis.com/auth/cloud-platform",
    Py8 = 3600;
  FF.EXPIRATION_TIME_OFFSET = 300000;
  FF.EXTERNAL_ACCOUNT_TYPE = "external_account";
  FF.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
  var Sy8 = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+",
    xy8 = "https://sts.{universeDomain}/v1/token",
    yy8 = r40(),
    vy8 = ck();
  Object.defineProperty(FF, "DEFAULT_UNIVERSE", {
    enumerable: !0,
    get: function () {
      return vy8.DEFAULT_UNIVERSE
    }
  });
  class R61 extends Ry8.AuthClient {
    constructor(A, Q) {
      var B;
      super({
        ...A,
        ...Q
      });
      S60.add(this), eDA.set(this, null);
      let G = (0, OgB.originalOrCamelOptions)(A),
        Z = G.get("type");
      if (Z && Z !== FF.EXTERNAL_ACCOUNT_TYPE) throw Error(`Expected "${FF.EXTERNAL_ACCOUNT_TYPE}" type but received "${A.type}"`);
      let Y = G.get("client_id"),
        J = G.get("client_secret"),
        X = (B = G.get("token_url")) !== null && B !== void 0 ? B : xy8.replace("{universeDomain}", this.universeDomain),
        I = G.get("subject_token_type"),
        D = G.get("workforce_pool_user_project"),
        W = G.get("service_account_impersonation_url"),
        K = G.get("service_account_impersonation"),
        V = (0, OgB.originalOrCamelOptions)(K).get("token_lifetime_seconds");
      if (this.cloudResourceManagerURL = new URL(G.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`), Y) this.clientAuth = {
        confidentialClientType: "basic",
        clientId: Y,
        clientSecret: J
      };
      this.stsCredential = new _y8.StsCredentials(X, this.clientAuth), this.scopes = G.get("scopes") || [x60], this.cachedAccessToken = null, this.audience = G.get("audience"), this.subjectTokenType = I, this.workforcePoolUserProject = D;
      let F = new RegExp(Sy8);
      if (this.workforcePoolUserProject && !this.audience.match(F)) throw Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
      if (this.serviceAccountImpersonationUrl = W, this.serviceAccountImpersonationLifetime = V, this.serviceAccountImpersonationLifetime) this.configLifetimeRequested = !0;
      else this.configLifetimeRequested = !1, this.serviceAccountImpersonationLifetime = Py8;
      this.projectNumber = this.getProjectNumber(this.audience), this.supplierContext = {
        audience: this.audience,
        subjectTokenType: this.subjectTokenType,
        transporter: this.transporter
      }
    }
    getServiceAccountEmail() {
      var A;
      if (this.serviceAccountImpersonationUrl) {
        if (this.serviceAccountImpersonationUrl.length > 256) throw RangeError(`URL is too long: ${this.serviceAccountImpersonationUrl}`);
        let B = /serviceAccounts\/(?<email>[^:]+):generateAccessToken$/.exec(this.serviceAccountImpersonationUrl);
        return ((A = B === null || B === void 0 ? void 0 : B.groups) === null || A === void 0 ? void 0 : A.email) || null
      }
      return null
    }
    setCredentials(A) {
      super.setCredentials(A), this.cachedAccessToken = A
    }
    async getAccessToken() {
      if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) await this.refreshAccessTokenAsync();
      return {
        token: this.cachedAccessToken.access_token,
        res: this.cachedAccessToken.res
      }
    }
    async getRequestHeaders() {
      let Q = {
        Authorization: `Bearer ${(await this.getAccessToken()).token}`
      };
      return this.addSharedMetadataHeaders(Q)
    }
    request(A, Q) {
      if (Q) this.requestAsync(A).then((B) => Q(null, B), (B) => {
        return Q(B, B.response)
      });
      else return this.requestAsync(A)
    }
    async getProjectId() {
      let A = this.projectNumber || this.workforcePoolUserProject;
      if (this.projectId) return this.projectId;
      else if (A) {
        let Q = await this.getRequestHeaders(),
          B = await this.transporter.request({
            ...R61.RETRY_CONFIG,
            headers: Q,
            url: `${this.cloudResourceManagerURL.toString()}${A}`,
            responseType: "json"
          });
        return this.projectId = B.data.projectId, this.projectId
      }
      return null
    }
    async requestAsync(A, Q = !1) {
      let B;
      try {
        let G = await this.getRequestHeaders();
        if (A.headers = A.headers || {}, G && G["x-goog-user-project"]) A.headers["x-goog-user-project"] = G["x-goog-user-project"];
        if (G && G.Authorization) A.headers.Authorization = G.Authorization;
        B = await this.transporter.request(A)
      } catch (G) {
        let Z = G.response;
        if (Z) {
          let Y = Z.status,
            J = Z.config.data instanceof My8.Readable;
          if (!Q && (Y === 401 || Y === 403) && !J && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
        }
        throw G
      }
      return B
    }
    async refreshAccessTokenAsync() {
      LgB(this, eDA, P60(this, eDA, "f") || P60(this, S60, "m", MgB).call(this), "f");
      try {
        return await P60(this, eDA, "f")
      } finally {
        LgB(this, eDA, null, "f")
      }
    }
    getProjectNumber(A) {
      let Q = A.match(/\/projects\/([^/]+)/);
      if (!Q) return null;
      return Q[1]
    }
    async getImpersonatedAccessToken(A) {
      let Q = {
          ...R61.RETRY_CONFIG,
          url: this.serviceAccountImpersonationUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${A}`
          },
          data: {
            scope: this.getScopesArray(),
            lifetime: this.serviceAccountImpersonationLifetime + "s"
          },
          responseType: "json"
        },
        B = await this.transporter.request(Q),
        G = B.data;
      return {
        access_token: G.accessToken,
        expiry_date: new Date(G.expireTime).getTime(),
        res: B
      }
    }
    isExpired(A) {
      let Q = new Date().getTime();
      return A.expiry_date ? Q >= A.expiry_date - this.eagerRefreshThresholdMillis : !1
    }
    getScopesArray() {
      if (typeof this.scopes === "string") return [this.scopes];
      return this.scopes || [x60]
    }
    getMetricsHeaderValue() {
      let A = process.version.replace(/^v/, ""),
        Q = this.serviceAccountImpersonationUrl !== void 0,
        B = this.credentialSourceType ? this.credentialSourceType : "unknown";
      return `gl-node/${A} auth/${yy8.version} google-byoid-sdk source/${B} sa-impersonation/${Q} config-lifetime/${this.configLifetimeRequested}`
    }
  }
  FF.BaseExternalAccountClient = R61;
  eDA = new WeakMap, S60 = new WeakSet, MgB = async function () {
    let Q = await this.retrieveSubjectToken(),
      B = {
        grantType: jy8,
        audience: this.audience,
        requestedTokenType: Ty8,
        subjectToken: Q,
        subjectTokenType: this.subjectTokenType,
        scope: this.serviceAccountImpersonationUrl ? [x60] : this.getScopesArray()
      },
      G = !this.clientAuth && this.workforcePoolUserProject ? {
        userProject: this.workforcePoolUserProject
      } : void 0,
      Z = {
        "x-goog-api-client": this.getMetricsHeaderValue()
      },
      Y = await this.stsCredential.exchangeToken(B, Z, G);
    if (this.serviceAccountImpersonationUrl) this.cachedAccessToken = await this.getImpersonatedAccessToken(Y.access_token);
    else if (Y.expires_in) this.cachedAccessToken = {
      access_token: Y.access_token,
      expiry_date: new Date().getTime() + Y.expires_in * 1000,
      res: Y.res
    };
    else this.cachedAccessToken = {
      access_token: Y.access_token,
      res: Y.res
    };
    return this.credentials = {}, Object.assign(this.credentials, this.cachedAccessToken), delete this.credentials.res, this.emit("tokens", {
      refresh_token: null,
      expiry_date: this.cachedAccessToken.expiry_date,
      access_token: this.cachedAccessToken.access_token,
      token_type: "Bearer",
      id_token: null
    }), this.cachedAccessToken
  }
})
// @from(Ln 223451, Col 4)
TgB = U((_gB) => {
  var y60, v60, k60;
  Object.defineProperty(_gB, "__esModule", {
    value: !0
  });
  _gB.FileSubjectTokenSupplier = void 0;
  var b60 = NA("util"),
    f60 = NA("fs"),
    ky8 = (0, b60.promisify)((y60 = f60.readFile) !== null && y60 !== void 0 ? y60 : () => {}),
    by8 = (0, b60.promisify)((v60 = f60.realpath) !== null && v60 !== void 0 ? v60 : () => {}),
    fy8 = (0, b60.promisify)((k60 = f60.lstat) !== null && k60 !== void 0 ? k60 : () => {});
  class RgB {
    constructor(A) {
      this.filePath = A.filePath, this.formatType = A.formatType, this.subjectTokenFieldName = A.subjectTokenFieldName
    }
    async getSubjectToken(A) {
      let Q = this.filePath;
      try {
        if (Q = await by8(Q), !(await fy8(Q)).isFile()) throw Error()
      } catch (Z) {
        if (Z instanceof Error) Z.message = `The file at ${Q} does not exist, or it is not a file. ${Z.message}`;
        throw Z
      }
      let B, G = await ky8(Q, {
        encoding: "utf8"
      });
      if (this.formatType === "text") B = G;
      else if (this.formatType === "json" && this.subjectTokenFieldName) B = JSON.parse(G)[this.subjectTokenFieldName];
      if (!B) throw Error("Unable to parse the subject_token from the credential_source file");
      return B
    }
  }
  _gB.FileSubjectTokenSupplier = RgB
})
// @from(Ln 223485, Col 4)
ygB = U((SgB) => {
  Object.defineProperty(SgB, "__esModule", {
    value: !0
  });
  SgB.UrlSubjectTokenSupplier = void 0;
  class PgB {
    constructor(A) {
      this.url = A.url, this.formatType = A.formatType, this.subjectTokenFieldName = A.subjectTokenFieldName, this.headers = A.headers, this.additionalGaxiosOptions = A.additionalGaxiosOptions
    }
    async getSubjectToken(A) {
      let Q = {
          ...this.additionalGaxiosOptions,
          url: this.url,
          method: "GET",
          headers: this.headers,
          responseType: this.formatType
        },
        B;
      if (this.formatType === "text") B = (await A.transporter.request(Q)).data;
      else if (this.formatType === "json" && this.subjectTokenFieldName) B = (await A.transporter.request(Q)).data[this.subjectTokenFieldName];
      if (!B) throw Error("Unable to parse the subject_token from the credential_source URL");
      return B
    }
  }
  SgB.UrlSubjectTokenSupplier = PgB
})
// @from(Ln 223511, Col 4)
u60 = U((vgB) => {
  Object.defineProperty(vgB, "__esModule", {
    value: !0
  });
  vgB.IdentityPoolClient = void 0;
  var hy8 = Fo(),
    h60 = Ko(),
    gy8 = TgB(),
    uy8 = ygB();
  class g60 extends hy8.BaseExternalAccountClient {
    constructor(A, Q) {
      super(A, Q);
      let B = (0, h60.originalOrCamelOptions)(A),
        G = B.get("credential_source"),
        Z = B.get("subject_token_supplier");
      if (!G && !Z) throw Error("A credential source or subject token supplier must be specified.");
      if (G && Z) throw Error("Only one of credential source or subject token supplier can be specified.");
      if (Z) this.subjectTokenSupplier = Z, this.credentialSourceType = "programmatic";
      else {
        let Y = (0, h60.originalOrCamelOptions)(G),
          J = (0, h60.originalOrCamelOptions)(Y.get("format")),
          X = J.get("type") || "text",
          I = J.get("subject_token_field_name");
        if (X !== "json" && X !== "text") throw Error(`Invalid credential_source format "${X}"`);
        if (X === "json" && !I) throw Error("Missing subject_token_field_name for JSON credential_source format");
        let D = Y.get("file"),
          W = Y.get("url"),
          K = Y.get("headers");
        if (D && W) throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
        else if (D && !W) this.credentialSourceType = "file", this.subjectTokenSupplier = new gy8.FileSubjectTokenSupplier({
          filePath: D,
          formatType: X,
          subjectTokenFieldName: I
        });
        else if (!D && W) this.credentialSourceType = "url", this.subjectTokenSupplier = new uy8.UrlSubjectTokenSupplier({
          url: W,
          formatType: X,
          subjectTokenFieldName: I,
          headers: K,
          additionalGaxiosOptions: g60.RETRY_CONFIG
        });
        else throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.')
      }
    }
    async retrieveSubjectToken() {
      return this.subjectTokenSupplier.getSubjectToken(this.supplierContext)
    }
  }
  vgB.IdentityPoolClient = g60
})
// @from(Ln 223561, Col 4)
m60 = U((ggB) => {
  Object.defineProperty(ggB, "__esModule", {
    value: !0
  });
  ggB.AwsRequestSigner = void 0;
  var fgB = lDA(),
    bgB = "AWS4-HMAC-SHA256",
    my8 = "aws4_request";
  class hgB {
    constructor(A, Q) {
      this.getCredentials = A, this.region = Q, this.crypto = (0, fgB.createCrypto)()
    }
    async getRequestOptions(A) {
      if (!A.url) throw Error('"url" is required in "amzOptions"');
      let Q = typeof A.data === "object" ? JSON.stringify(A.data) : A.data,
        B = A.url,
        G = A.method || "GET",
        Z = A.body || Q,
        Y = A.headers,
        J = await this.getCredentials(),
        X = new URL(B),
        I = await cy8({
          crypto: this.crypto,
          host: X.host,
          canonicalUri: X.pathname,
          canonicalQuerystring: X.search.substr(1),
          method: G,
          region: this.region,
          securityCredentials: J,
          requestPayload: Z,
          additionalAmzHeaders: Y
        }),
        D = Object.assign(I.amzDate ? {
          "x-amz-date": I.amzDate
        } : {}, {
          Authorization: I.authorizationHeader,
          host: X.host
        }, Y || {});
      if (J.token) Object.assign(D, {
        "x-amz-security-token": J.token
      });
      let W = {
        url: B,
        method: G,
        headers: D
      };
      if (typeof Z < "u") W.body = Z;
      return W
    }
  }
  ggB.AwsRequestSigner = hgB;
  async function ETA(A, Q, B) {
    return await A.signWithHmacSha256(Q, B)
  }
  async function dy8(A, Q, B, G, Z) {
    let Y = await ETA(A, `AWS4${Q}`, B),
      J = await ETA(A, Y, G),
      X = await ETA(A, J, Z);
    return await ETA(A, X, "aws4_request")
  }
  async function cy8(A) {
    let Q = A.additionalAmzHeaders || {},
      B = A.requestPayload || "",
      G = A.host.split(".")[0],
      Z = new Date,
      Y = Z.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, ""),
      J = Z.toISOString().replace(/[-]/g, "").replace(/T.*/, ""),
      X = {};
    if (Object.keys(Q).forEach((L) => {
        X[L.toLowerCase()] = Q[L]
      }), A.securityCredentials.token) X["x-amz-security-token"] = A.securityCredentials.token;
    let I = Object.assign({
        host: A.host
      }, X.date ? {} : {
        "x-amz-date": Y
      }, X),
      D = "",
      W = Object.keys(I).sort();
    W.forEach((L) => {
      D += `${L}:${I[L]}
`
    });
    let K = W.join(";"),
      V = await A.crypto.sha256DigestHex(B),
      F = `${A.method}
${A.canonicalUri}
${A.canonicalQuerystring}
${D}
${K}
${V}`,
      H = `${J}/${A.region}/${G}/${my8}`,
      E = `${bgB}
${Y}
${H}
` + await A.crypto.sha256DigestHex(F),
      z = await dy8(A.crypto, A.securityCredentials.secretAccessKey, J, A.region, G),
      $ = await ETA(A.crypto, z, E),
      O = `${bgB} Credential=${A.securityCredentials.accessKeyId}/${H}, SignedHeaders=${K}, Signature=${(0,fgB.fromArrayBufferToHex)($)}`;
    return {
      amzDate: X.date ? void 0 : Y,
      authorizationHeader: O,
      canonicalQuerystring: A.canonicalQuerystring
    }
  }
})
// @from(Ln 223666, Col 4)
pgB = U((AWA) => {
  var Rm = AWA && AWA.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    oP, d60, mgB, dgB, _61, c60;
  Object.defineProperty(AWA, "__esModule", {
    value: !0
  });
  AWA.DefaultAwsSecurityCredentialsSupplier = void 0;
  class cgB {
    constructor(A) {
      oP.add(this), this.regionUrl = A.regionUrl, this.securityCredentialsUrl = A.securityCredentialsUrl, this.imdsV2SessionTokenUrl = A.imdsV2SessionTokenUrl, this.additionalGaxiosOptions = A.additionalGaxiosOptions
    }
    async getAwsRegion(A) {
      if (Rm(this, oP, "a", _61)) return Rm(this, oP, "a", _61);
      let Q = {};
      if (!Rm(this, oP, "a", _61) && this.imdsV2SessionTokenUrl) Q["x-aws-ec2-metadata-token"] = await Rm(this, oP, "m", d60).call(this, A.transporter);
      if (!this.regionUrl) throw Error('Unable to determine AWS region due to missing "options.credential_source.region_url"');
      let B = {
          ...this.additionalGaxiosOptions,
          url: this.regionUrl,
          method: "GET",
          responseType: "text",
          headers: Q
        },
        G = await A.transporter.request(B);
      return G.data.substr(0, G.data.length - 1)
    }
    async getAwsSecurityCredentials(A) {
      if (Rm(this, oP, "a", c60)) return Rm(this, oP, "a", c60);
      let Q = {};
      if (this.imdsV2SessionTokenUrl) Q["x-aws-ec2-metadata-token"] = await Rm(this, oP, "m", d60).call(this, A.transporter);
      let B = await Rm(this, oP, "m", mgB).call(this, Q, A.transporter),
        G = await Rm(this, oP, "m", dgB).call(this, B, Q, A.transporter);
      return {
        accessKeyId: G.AccessKeyId,
        secretAccessKey: G.SecretAccessKey,
        token: G.Token
      }
    }
  }
  AWA.DefaultAwsSecurityCredentialsSupplier = cgB;
  oP = new WeakSet, d60 = async function (Q) {
    let B = {
      ...this.additionalGaxiosOptions,
      url: this.imdsV2SessionTokenUrl,
      method: "PUT",
      responseType: "text",
      headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "300"
      }
    };
    return (await Q.request(B)).data
  }, mgB = async function (Q, B) {
    if (!this.securityCredentialsUrl) throw Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
    let G = {
      ...this.additionalGaxiosOptions,
      url: this.securityCredentialsUrl,
      method: "GET",
      responseType: "text",
      headers: Q
    };
    return (await B.request(G)).data
  }, dgB = async function (Q, B, G) {
    return (await G.request({
      ...this.additionalGaxiosOptions,
      url: `${this.securityCredentialsUrl}/${Q}`,
      responseType: "json",
      headers: B
    })).data
  }, _61 = function () {
    return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null
  }, c60 = function () {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      token: process.env.AWS_SESSION_TOKEN
    };
    return null
  }
})
// @from(Ln 223749, Col 4)
p60 = U((QWA) => {
  var py8 = QWA && QWA.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    j61, igB;
  Object.defineProperty(QWA, "__esModule", {
    value: !0
  });
  QWA.AwsClient = void 0;
  var ly8 = m60(),
    iy8 = Fo(),
    ny8 = pgB(),
    lgB = Ko();
  class zTA extends iy8.BaseExternalAccountClient {
    constructor(A, Q) {
      super(A, Q);
      let B = (0, lgB.originalOrCamelOptions)(A),
        G = B.get("credential_source"),
        Z = B.get("aws_security_credentials_supplier");
      if (!G && !Z) throw Error("A credential source or AWS security credentials supplier must be specified.");
      if (G && Z) throw Error("Only one of credential source or AWS security credentials supplier can be specified.");
      if (Z) this.awsSecurityCredentialsSupplier = Z, this.regionalCredVerificationUrl = py8(j61, j61, "f", igB), this.credentialSourceType = "programmatic";
      else {
        let Y = (0, lgB.originalOrCamelOptions)(G);
        this.environmentId = Y.get("environment_id");
        let J = Y.get("region_url"),
          X = Y.get("url"),
          I = Y.get("imdsv2_session_token_url");
        this.awsSecurityCredentialsSupplier = new ny8.DefaultAwsSecurityCredentialsSupplier({
          regionUrl: J,
          securityCredentialsUrl: X,
          imdsV2SessionTokenUrl: I
        }), this.regionalCredVerificationUrl = Y.get("regional_cred_verification_url"), this.credentialSourceType = "aws", this.validateEnvironmentId()
      }
      this.awsRequestSigner = null, this.region = ""
    }
    validateEnvironmentId() {
      var A;
      let Q = (A = this.environmentId) === null || A === void 0 ? void 0 : A.match(/^(aws)(\d+)$/);
      if (!Q || !this.regionalCredVerificationUrl) throw Error('No valid AWS "credential_source" provided');
      else if (parseInt(Q[2], 10) !== 1) throw Error(`aws version "${Q[2]}" is not supported in the current build.`)
    }
    async retrieveSubjectToken() {
      if (!this.awsRequestSigner) this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext), this.awsRequestSigner = new ly8.AwsRequestSigner(async () => {
        return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext)
      }, this.region);
      let A = await this.awsRequestSigner.getRequestOptions({
          ...j61.RETRY_CONFIG,
          url: this.regionalCredVerificationUrl.replace("{region}", this.region),
          method: "POST"
        }),
        Q = [],
        B = Object.assign({
          "x-goog-cloud-target-resource": this.audience
        }, A.headers);
      for (let G in B) Q.push({
        key: G,
        value: B[G]
      });
      return encodeURIComponent(JSON.stringify({
        url: A.url,
        method: A.method,
        headers: Q
      }))
    }
  }
  QWA.AwsClient = zTA;
  j61 = zTA;
  igB = {
    value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15"
  };
  zTA.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
  zTA.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254"
})