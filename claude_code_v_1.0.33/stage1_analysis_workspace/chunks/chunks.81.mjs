
// @from(Start 7692483, End 7694701)
Gk = z((smB) => {
  Object.defineProperty(smB, "__esModule", {
    value: !0
  });
  smB.AuthClient = smB.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = smB.DEFAULT_UNIVERSE = void 0;
  var Xd6 = UA("events"),
    imB = PT(),
    nmB = PwA(),
    Vd6 = lp();
  smB.DEFAULT_UNIVERSE = "googleapis.com";
  smB.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300000;
  class amB extends Xd6.EventEmitter {
    constructor(A = {}) {
      var Q, B, G, Z, I;
      super();
      this.credentials = {}, this.eagerRefreshThresholdMillis = smB.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS, this.forceRefreshOnFailure = !1, this.universeDomain = smB.DEFAULT_UNIVERSE;
      let Y = (0, Vd6.originalOrCamelOptions)(A);
      if (this.apiKey = A.apiKey, this.projectId = (Q = Y.get("project_id")) !== null && Q !== void 0 ? Q : null, this.quotaProjectId = Y.get("quota_project_id"), this.credentials = (B = Y.get("credentials")) !== null && B !== void 0 ? B : {}, this.universeDomain = (G = Y.get("universe_domain")) !== null && G !== void 0 ? G : smB.DEFAULT_UNIVERSE, this.transporter = (Z = A.transporter) !== null && Z !== void 0 ? Z : new nmB.DefaultTransporter, A.transporterOptions) this.transporter.defaults = A.transporterOptions;
      if (A.eagerRefreshThresholdMillis) this.eagerRefreshThresholdMillis = A.eagerRefreshThresholdMillis;
      this.forceRefreshOnFailure = (I = A.forceRefreshOnFailure) !== null && I !== void 0 ? I : !1
    }
    get gaxios() {
      if (this.transporter instanceof imB.Gaxios) return this.transporter;
      else if (this.transporter instanceof nmB.DefaultTransporter) return this.transporter.instance;
      else if ("instance" in this.transporter && this.transporter.instance instanceof imB.Gaxios) return this.transporter.instance;
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
  smB.AuthClient = amB
})
// @from(Start 7694707, End 7695274)
jl1 = z((emB) => {
  Object.defineProperty(emB, "__esModule", {
    value: !0
  });
  emB.LoginTicket = void 0;
  class tmB {
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
  emB.LoginTicket = tmB
})
// @from(Start 7695280, End 7713538)
$e = z((BdB) => {
  Object.defineProperty(BdB, "__esModule", {
    value: !0
  });
  BdB.OAuth2Client = BdB.ClientAuthentication = BdB.CertificateFormat = BdB.CodeChallengeMethod = void 0;
  var Fd6 = PT(),
    Sl1 = UA("querystring"),
    Kd6 = UA("stream"),
    Dd6 = weA(),
    _l1 = pGA(),
    Hd6 = Gk(),
    Cd6 = jl1(),
    QdB;
  (function(A) {
    A.Plain = "plain", A.S256 = "S256"
  })(QdB || (BdB.CodeChallengeMethod = QdB = {}));
  var Mf;
  (function(A) {
    A.PEM = "PEM", A.JWK = "JWK"
  })(Mf || (BdB.CertificateFormat = Mf = {}));
  var jwA;
  (function(A) {
    A.ClientSecretPost = "ClientSecretPost", A.ClientSecretBasic = "ClientSecretBasic", A.None = "None"
  })(jwA || (BdB.ClientAuthentication = jwA = {}));
  class KE extends Hd6.AuthClient {
    constructor(A, Q, B) {
      let G = A && typeof A === "object" ? A : {
        clientId: A,
        clientSecret: Q,
        redirectUri: B
      };
      super(G);
      this.certificateCache = {}, this.certificateExpiry = null, this.certificateCacheFormat = Mf.PEM, this.refreshTokenPromises = new Map, this._clientId = G.clientId, this._clientSecret = G.clientSecret, this.redirectUri = G.redirectUri, this.endpoints = {
        tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
        oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        oauth2TokenUrl: "https://oauth2.googleapis.com/token",
        oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
        oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
        oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
        oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
        ...G.endpoints
      }, this.clientAuthentication = G.clientAuthentication || jwA.ClientSecretPost, this.issuers = G.issuers || ["accounts.google.com", "https://accounts.google.com", this.universeDomain]
    }
    generateAuthUrl(A = {}) {
      if (A.code_challenge_method && !A.code_challenge) throw Error("If a code_challenge_method is provided, code_challenge must be included.");
      if (A.response_type = A.response_type || "code", A.client_id = A.client_id || this._clientId, A.redirect_uri = A.redirect_uri || this.redirectUri, Array.isArray(A.scope)) A.scope = A.scope.join(" ");
      return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + Sl1.stringify(A)
    }
    generateCodeVerifier() {
      throw Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.")
    }
    async generateCodeVerifierAsync() {
      let A = (0, _l1.createCrypto)(),
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
      if (this.clientAuthentication === jwA.ClientSecretBasic) {
        let Y = Buffer.from(`${this._clientId}:${this._clientSecret}`);
        B.Authorization = `Basic ${Y.toString("base64")}`
      }
      if (this.clientAuthentication === jwA.ClientSecretPost) G.client_secret = this._clientSecret;
      let Z = await this.transporter.request({
          ...KE.RETRY_CONFIG,
          method: "POST",
          url: Q,
          data: Sl1.stringify(G),
          headers: B
        }),
        I = Z.data;
      if (Z.data && Z.data.expires_in) I.expiry_date = new Date().getTime() + Z.data.expires_in * 1000, delete I.expires_in;
      return this.emit("tokens", I), {
        tokens: I,
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
          ...KE.RETRY_CONFIG,
          method: "POST",
          url: B,
          data: Sl1.stringify(G),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      } catch (Y) {
        if (Y instanceof Fd6.GaxiosError && Y.message === "invalid_grant" && ((Q = Y.response) === null || Q === void 0 ? void 0 : Q.data) && /ReAuth/i.test(Y.response.data.error_description)) Y.message = JSON.stringify(Y.response.data);
        throw Y
      }
      let I = Z.data;
      if (Z.data && Z.data.expires_in) I.expiry_date = new Date().getTime() + Z.data.expires_in * 1000, delete I.expires_in;
      return this.emit("tokens", I), {
        tokens: I,
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
        let Y = {
          Authorization: Q.token_type + " " + Q.access_token
        };
        return {
          headers: this.addSharedMetadataHeaders(Y)
        }
      }
      if (this.refreshHandler) {
        let Y = await this.processAndValidateRefreshHandler();
        if (Y === null || Y === void 0 ? void 0 : Y.access_token) {
          this.setCredentials(Y);
          let J = {
            Authorization: "Bearer " + this.credentials.access_token
          };
          return {
            headers: this.addSharedMetadataHeaders(J)
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
      } catch (Y) {
        let J = Y;
        if (J.response && (J.response.status === 403 || J.response.status === 404)) J.message = `Could not refresh access token: ${J.message}`;
        throw J
      }
      let Z = this.credentials;
      Z.token_type = Z.token_type || "Bearer", G.refresh_token = Z.refresh_token, this.credentials = G;
      let I = {
        Authorization: Z.token_type + " " + G.access_token
      };
      return {
        headers: this.addSharedMetadataHeaders(I),
        res: B.res
      }
    }
    static getRevokeTokenUrl(A) {
      return new KE().getRevokeTokenURL(A).toString()
    }
    getRevokeTokenURL(A) {
      let Q = new URL(this.endpoints.oauth2RevokeUrl);
      return Q.searchParams.append("token", A), Q
    }
    revokeToken(A, Q) {
      let B = {
        ...KE.RETRY_CONFIG,
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
          let I = Z.status,
            Y = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure),
            J = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler,
            W = Z.config.data instanceof Kd6.Readable,
            X = I === 401 || I === 403;
          if (!Q && X && !W && Y) return await this.refreshAccessTokenAsync(), this.requestAsync(A, !0);
          else if (!Q && X && !W && J) {
            let V = await this.processAndValidateRefreshHandler();
            if (V === null || V === void 0 ? void 0 : V.access_token) this.setCredentials(V);
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
        ...KE.RETRY_CONFIG,
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
        Q = (0, _l1.hasBrowserCrypto)() ? Mf.JWK : Mf.PEM;
      if (this.certificateExpiry && A < this.certificateExpiry.getTime() && this.certificateCacheFormat === Q) return {
        certs: this.certificateCache,
        format: Q
      };
      let B, G;
      switch (Q) {
        case Mf.PEM:
          G = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
          break;
        case Mf.JWK:
          G = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
          break;
        default:
          throw Error(`Unsupported certificate format ${Q}`)
      }
      try {
        B = await this.transporter.request({
          ...KE.RETRY_CONFIG,
          url: G
        })
      } catch (W) {
        if (W instanceof Error) W.message = `Failed to retrieve verification certificates: ${W.message}`;
        throw W
      }
      let Z = B ? B.headers["cache-control"] : void 0,
        I = -1;
      if (Z) {
        let X = new RegExp("max-age=([0-9]*)").exec(Z);
        if (X && X.length === 2) I = Number(X[1]) * 1000
      }
      let Y = {};
      switch (Q) {
        case Mf.PEM:
          Y = B.data;
          break;
        case Mf.JWK:
          for (let W of B.data.keys) Y[W.kid] = W;
          break;
        default:
          throw Error(`Unsupported certificate format ${Q}`)
      }
      let J = new Date;
      return this.certificateExpiry = I === -1 ? null : new Date(J.getTime() + I), this.certificateCache = Y, this.certificateCacheFormat = Q, {
        certs: Y,
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
          ...KE.RETRY_CONFIG,
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
      let I = (0, _l1.createCrypto)();
      if (!Z) Z = KE.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
      let Y = A.split(".");
      if (Y.length !== 3) throw Error("Wrong number of segments in token: " + A);
      let J = Y[0] + "." + Y[1],
        W = Y[2],
        X, V;
      try {
        X = JSON.parse(I.decodeBase64StringUtf8(Y[0]))
      } catch (q) {
        if (q instanceof Error) q.message = `Can't parse token envelope: ${Y[0]}': ${q.message}`;
        throw q
      }
      if (!X) throw Error("Can't parse token envelope: " + Y[0]);
      try {
        V = JSON.parse(I.decodeBase64StringUtf8(Y[1]))
      } catch (q) {
        if (q instanceof Error) q.message = `Can't parse token payload '${Y[0]}`;
        throw q
      }
      if (!V) throw Error("Can't parse token payload: " + Y[1]);
      if (!Object.prototype.hasOwnProperty.call(Q, X.kid)) throw Error("No pem found for envelope: " + JSON.stringify(X));
      let F = Q[X.kid];
      if (X.alg === "ES256") W = Dd6.joseToDer(W, "ES256").toString("base64");
      if (!await I.verify(F, J, W)) throw Error("Invalid token signature: " + A);
      if (!V.iat) throw Error("No issue time in token: " + JSON.stringify(V));
      if (!V.exp) throw Error("No expiration time in token: " + JSON.stringify(V));
      let D = Number(V.iat);
      if (isNaN(D)) throw Error("iat field using invalid format");
      let H = Number(V.exp);
      if (isNaN(H)) throw Error("exp field using invalid format");
      let C = new Date().getTime() / 1000;
      if (H >= C + Z) throw Error("Expiration time too far in future: " + JSON.stringify(V));
      let E = D - KE.CLOCK_SKEW_SECS_,
        U = H + KE.CLOCK_SKEW_SECS_;
      if (C < E) throw Error("Token used too early, " + C + " < " + E + ": " + JSON.stringify(V));
      if (C > U) throw Error("Token used too late, " + C + " > " + U + ": " + JSON.stringify(V));
      if (G && G.indexOf(V.iss) < 0) throw Error("Invalid issuer, expected one of [" + G + "], but got " + V.iss);
      if (typeof B < "u" && B !== null) {
        let q = V.aud,
          w = !1;
        if (B.constructor === Array) w = B.indexOf(q) > -1;
        else w = q === B;
        if (!w) throw Error("Wrong recipient, payload audience != requiredAudience")
      }
      return new Cd6.LoginTicket(X, V)
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
  BdB.OAuth2Client = KE;
  KE.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
  KE.CLOCK_SKEW_SECS_ = 300;
  KE.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400
})
// @from(Start 7713544, End 7715813)
kl1 = z((YdB) => {
  Object.defineProperty(YdB, "__esModule", {
    value: !0
  });
  YdB.Compute = void 0;
  var $d6 = PT(),
    ZdB = RwA(),
    wd6 = $e();
  class IdB extends wd6.OAuth2Client {
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
        B = await ZdB.instance(Z)
      } catch (Z) {
        if (Z instanceof $d6.GaxiosError) Z.message = `Could not refresh access token: ${Z.message}`, this.wrapError(Z);
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
        B = await ZdB.instance(G)
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
  YdB.Compute = IdB
})
// @from(Start 7715819, End 7716764)
yl1 = z((XdB) => {
  Object.defineProperty(XdB, "__esModule", {
    value: !0
  });
  XdB.IdTokenClient = void 0;
  var qd6 = $e();
  class WdB extends qd6.OAuth2Client {
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
  XdB.IdTokenClient = WdB
})
// @from(Start 7716770, End 7718092)
xl1 = z((KdB) => {
  Object.defineProperty(KdB, "__esModule", {
    value: !0
  });
  KdB.GCPEnv = void 0;
  KdB.clear = Nd6;
  KdB.getEnv = Ld6;
  var FdB = RwA(),
    Of;
  (function(A) {
    A.APP_ENGINE = "APP_ENGINE", A.KUBERNETES_ENGINE = "KUBERNETES_ENGINE", A.CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS", A.COMPUTE_ENGINE = "COMPUTE_ENGINE", A.CLOUD_RUN = "CLOUD_RUN", A.NONE = "NONE"
  })(Of || (KdB.GCPEnv = Of = {}));
  var SwA;

  function Nd6() {
    SwA = void 0
  }
  async function Ld6() {
    if (SwA) return SwA;
    return SwA = Md6(), SwA
  }
  async function Md6() {
    let A = Of.NONE;
    if (Od6()) A = Of.APP_ENGINE;
    else if (Rd6()) A = Of.CLOUD_FUNCTIONS;
    else if (await jd6())
      if (await Pd6()) A = Of.KUBERNETES_ENGINE;
      else if (Td6()) A = Of.CLOUD_RUN;
    else A = Of.COMPUTE_ENGINE;
    else A = Of.NONE;
    return A
  }

  function Od6() {
    return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME)
  }

  function Rd6() {
    return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET)
  }

  function Td6() {
    return !!process.env.K_CONFIGURATION
  }
  async function Pd6() {
    try {
      return await FdB.instance("attributes/cluster-name"), !0
    } catch (A) {
      return !1
    }
  }
  async function jd6() {
    return FdB.isAvailable()
  }
})
// @from(Start 7718098, End 7719016)
vl1 = z((p4G, HdB) => {
  var qeA = Bk().Buffer,
    kd6 = UA("stream"),
    yd6 = UA("util");

  function NeA(A) {
    if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = qeA.alloc(0), this;
    if (typeof A.pipe === "function") return this.buffer = qeA.alloc(0), A.pipe(this), this;
    if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
      this.emit("end", A), this.readable = !1, this.emit("close")
    }.bind(this)), this;
    throw TypeError("Unexpected data type (" + typeof A + ")")
  }
  yd6.inherits(NeA, kd6);
  NeA.prototype.write = function(Q) {
    this.buffer = qeA.concat([this.buffer, qeA.from(Q)]), this.emit("data", Q)
  };
  NeA.prototype.end = function(Q) {
    if (Q) this.write(Q);
    this.emit("end", Q), this.emit("close"), this.writable = !1, this.readable = !1
  };
  HdB.exports = NeA
})
// @from(Start 7719022, End 7719637)
fl1 = z((l4G, CdB) => {
  var _wA = UA("buffer").Buffer,
    bl1 = UA("buffer").SlowBuffer;
  CdB.exports = LeA;

  function LeA(A, Q) {
    if (!_wA.isBuffer(A) || !_wA.isBuffer(Q)) return !1;
    if (A.length !== Q.length) return !1;
    var B = 0;
    for (var G = 0; G < A.length; G++) B |= A[G] ^ Q[G];
    return B === 0
  }
  LeA.install = function() {
    _wA.prototype.equal = bl1.prototype.equal = function(Q) {
      return LeA(this, Q)
    }
  };
  var xd6 = _wA.prototype.equal,
    vd6 = bl1.prototype.equal;
  LeA.restore = function() {
    _wA.prototype.equal = xd6, bl1.prototype.equal = vd6
  }
})
// @from(Start 7719643, End 7724124)
ml1 = z((i4G, MdB) => {
  var aGA = Bk().Buffer,
    OM = UA("crypto"),
    zdB = weA(),
    EdB = UA("util"),
    bd6 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
    kwA = "secret must be a string or buffer",
    nGA = "key must be a string or a buffer",
    fd6 = "key must be a string, a buffer or an object",
    gl1 = typeof OM.createPublicKey === "function";
  if (gl1) nGA += " or a KeyObject", kwA += "or a KeyObject";

  function UdB(A) {
    if (aGA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (!gl1) throw _T(nGA);
    if (typeof A !== "object") throw _T(nGA);
    if (typeof A.type !== "string") throw _T(nGA);
    if (typeof A.asymmetricKeyType !== "string") throw _T(nGA);
    if (typeof A.export !== "function") throw _T(nGA)
  }

  function $dB(A) {
    if (aGA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (typeof A === "object") return;
    throw _T(fd6)
  }

  function hd6(A) {
    if (aGA.isBuffer(A)) return;
    if (typeof A === "string") return A;
    if (!gl1) throw _T(kwA);
    if (typeof A !== "object") throw _T(kwA);
    if (A.type !== "secret") throw _T(kwA);
    if (typeof A.export !== "function") throw _T(kwA)
  }

  function ul1(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function wdB(A) {
    A = A.toString();
    var Q = 4 - A.length % 4;
    if (Q !== 4)
      for (var B = 0; B < Q; ++B) A += "=";
    return A.replace(/\-/g, "+").replace(/_/g, "/")
  }

  function _T(A) {
    var Q = [].slice.call(arguments, 1),
      B = EdB.format.bind(EdB, A).apply(null, Q);
    return TypeError(B)
  }

  function gd6(A) {
    return aGA.isBuffer(A) || typeof A === "string"
  }

  function ywA(A) {
    if (!gd6(A)) A = JSON.stringify(A);
    return A
  }

  function qdB(A) {
    return function(B, G) {
      hd6(G), B = ywA(B);
      var Z = OM.createHmac("sha" + A, G),
        I = (Z.update(B), Z.digest("base64"));
      return ul1(I)
    }
  }
  var hl1, ud6 = "timingSafeEqual" in OM ? function(Q, B) {
    if (Q.byteLength !== B.byteLength) return !1;
    return OM.timingSafeEqual(Q, B)
  } : function(Q, B) {
    if (!hl1) hl1 = fl1();
    return hl1(Q, B)
  };

  function md6(A) {
    return function(B, G, Z) {
      var I = qdB(A)(B, Z);
      return ud6(aGA.from(G), aGA.from(I))
    }
  }

  function NdB(A) {
    return function(B, G) {
      $dB(G), B = ywA(B);
      var Z = OM.createSign("RSA-SHA" + A),
        I = (Z.update(B), Z.sign(G, "base64"));
      return ul1(I)
    }
  }

  function LdB(A) {
    return function(B, G, Z) {
      UdB(Z), B = ywA(B), G = wdB(G);
      var I = OM.createVerify("RSA-SHA" + A);
      return I.update(B), I.verify(Z, G, "base64")
    }
  }

  function dd6(A) {
    return function(B, G) {
      $dB(G), B = ywA(B);
      var Z = OM.createSign("RSA-SHA" + A),
        I = (Z.update(B), Z.sign({
          key: G,
          padding: OM.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: OM.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
      return ul1(I)
    }
  }

  function cd6(A) {
    return function(B, G, Z) {
      UdB(Z), B = ywA(B), G = wdB(G);
      var I = OM.createVerify("RSA-SHA" + A);
      return I.update(B), I.verify({
        key: Z,
        padding: OM.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: OM.constants.RSA_PSS_SALTLEN_DIGEST
      }, G, "base64")
    }
  }

  function pd6(A) {
    var Q = NdB(A);
    return function() {
      var G = Q.apply(null, arguments);
      return G = zdB.derToJose(G, "ES" + A), G
    }
  }

  function ld6(A) {
    var Q = LdB(A);
    return function(G, Z, I) {
      Z = zdB.joseToDer(Z, "ES" + A).toString("base64");
      var Y = Q(G, Z, I);
      return Y
    }
  }

  function id6() {
    return function() {
      return ""
    }
  }

  function nd6() {
    return function(Q, B) {
      return B === ""
    }
  }
  MdB.exports = function(Q) {
    var B = {
        hs: qdB,
        rs: NdB,
        ps: dd6,
        es: pd6,
        none: id6
      },
      G = {
        hs: md6,
        rs: LdB,
        ps: cd6,
        es: ld6,
        none: nd6
      },
      Z = Q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!Z) throw _T(bd6, Q);
    var I = (Z[1] || Z[3]).toLowerCase(),
      Y = Z[2];
    return {
      sign: B[I](Y),
      verify: G[I](Y)
    }
  }
})
// @from(Start 7724130, End 7724364)
dl1 = z((n4G, OdB) => {
  var ad6 = UA("buffer").Buffer;
  OdB.exports = function(Q) {
    if (typeof Q === "string") return Q;
    if (typeof Q === "number" || ad6.isBuffer(Q)) return Q.toString();
    return JSON.stringify(Q)
  }
})
// @from(Start 7724370, End 7725975)
_dB = z((a4G, SdB) => {
  var sd6 = Bk().Buffer,
    RdB = vl1(),
    rd6 = ml1(),
    od6 = UA("stream"),
    TdB = dl1(),
    cl1 = UA("util");

  function PdB(A, Q) {
    return sd6.from(A, Q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function td6(A, Q, B) {
    B = B || "utf8";
    var G = PdB(TdB(A), "binary"),
      Z = PdB(TdB(Q), B);
    return cl1.format("%s.%s", G, Z)
  }

  function jdB(A) {
    var {
      header: Q,
      payload: B
    } = A, G = A.secret || A.privateKey, Z = A.encoding, I = rd6(Q.alg), Y = td6(Q, B, Z), J = I.sign(Y, G);
    return cl1.format("%s.%s", Y, J)
  }

  function MeA(A) {
    var Q = A.secret || A.privateKey || A.key,
      B = new RdB(Q);
    this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = B, this.payload = new RdB(A.payload), this.secret.once("close", function() {
      if (!this.payload.writable && this.readable) this.sign()
    }.bind(this)), this.payload.once("close", function() {
      if (!this.secret.writable && this.readable) this.sign()
    }.bind(this))
  }
  cl1.inherits(MeA, od6);
  MeA.prototype.sign = function() {
    try {
      var Q = jdB({
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
  MeA.sign = jdB;
  SdB.exports = MeA
})
// @from(Start 7725981, End 7728389)
mdB = z((s4G, udB) => {
  var ydB = Bk().Buffer,
    kdB = vl1(),
    ed6 = ml1(),
    Ac6 = UA("stream"),
    xdB = dl1(),
    Qc6 = UA("util"),
    Bc6 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

  function Gc6(A) {
    return Object.prototype.toString.call(A) === "[object Object]"
  }

  function Zc6(A) {
    if (Gc6(A)) return A;
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }

  function vdB(A) {
    var Q = A.split(".", 1)[0];
    return Zc6(ydB.from(Q, "base64").toString("binary"))
  }

  function Ic6(A) {
    return A.split(".", 2).join(".")
  }

  function bdB(A) {
    return A.split(".")[2]
  }

  function Yc6(A, Q) {
    Q = Q || "utf8";
    var B = A.split(".")[1];
    return ydB.from(B, "base64").toString(Q)
  }

  function fdB(A) {
    return Bc6.test(A) && !!vdB(A)
  }

  function hdB(A, Q, B) {
    if (!Q) {
      var G = Error("Missing algorithm parameter for jws.verify");
      throw G.code = "MISSING_ALGORITHM", G
    }
    A = xdB(A);
    var Z = bdB(A),
      I = Ic6(A),
      Y = ed6(Q);
    return Y.verify(I, Z, B)
  }

  function gdB(A, Q) {
    if (Q = Q || {}, A = xdB(A), !fdB(A)) return null;
    var B = vdB(A);
    if (!B) return null;
    var G = Yc6(A);
    if (B.typ === "JWT" || Q.json) G = JSON.parse(G, Q.encoding);
    return {
      header: B,
      payload: G,
      signature: bdB(A)
    }
  }

  function sGA(A) {
    A = A || {};
    var Q = A.secret || A.publicKey || A.key,
      B = new kdB(Q);
    this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = B, this.signature = new kdB(A.signature), this.secret.once("close", function() {
      if (!this.signature.writable && this.readable) this.verify()
    }.bind(this)), this.signature.once("close", function() {
      if (!this.secret.writable && this.readable) this.verify()
    }.bind(this))
  }
  Qc6.inherits(sGA, Ac6);
  sGA.prototype.verify = function() {
    try {
      var Q = hdB(this.signature.buffer, this.algorithm, this.key.buffer),
        B = gdB(this.signature.buffer, this.encoding);
      return this.emit("done", Q, B), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (G) {
      this.readable = !1, this.emit("error", G), this.emit("close")
    }
  };
  sGA.decode = gdB;
  sGA.isValid = fdB;
  sGA.verify = hdB;
  udB.exports = sGA
})
// @from(Start 7728395, End 7728823)
pl1 = z((Wc6) => {
  var ddB = _dB(),
    OeA = mdB(),
    Jc6 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
  Wc6.ALGORITHMS = Jc6;
  Wc6.sign = ddB.sign;
  Wc6.verify = OeA.verify;
  Wc6.decode = OeA.decode;
  Wc6.isValid = OeA.isValid;
  Wc6.createSign = function(Q) {
    return new ddB(Q)
  };
  Wc6.createVerify = function(Q) {
    return new OeA(Q)
  }
})
// @from(Start 7728829, End 7735932)
odB = z((ip) => {
  var kT = ip && ip.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    cdB = ip && ip.__classPrivateFieldSet || function(A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    yT, rGA, ll1, pdB, ldB, il1, nl1, idB;
  Object.defineProperty(ip, "__esModule", {
    value: !0
  });
  ip.GoogleToken = void 0;
  var ndB = UA("fs"),
    Ec6 = PT(),
    zc6 = pl1(),
    Uc6 = UA("path"),
    $c6 = UA("util"),
    adB = ndB.readFile ? (0, $c6.promisify)(ndB.readFile) : async () => {
      throw new oGA("use key rather than keyFile.", "MISSING_CREDENTIALS")
    }, sdB = "https://www.googleapis.com/oauth2/v4/token", wc6 = "https://accounts.google.com/o/oauth2/revoke?token=";
  class oGA extends Error {
    constructor(A, Q) {
      super(A);
      this.code = Q
    }
  }
  class rdB {
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
      yT.add(this), this.transporter = {
        request: (Q) => (0, Ec6.request)(Q)
      }, rGA.set(this, void 0), kT(this, yT, "m", nl1).call(this, A)
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
        kT(this, yT, "m", ll1).call(this, Q).then((G) => B(null, G), A);
        return
      }
      return kT(this, yT, "m", ll1).call(this, Q)
    }
    async getCredentials(A) {
      switch (Uc6.extname(A)) {
        case ".json": {
          let B = await adB(A, "utf8"),
            G = JSON.parse(B),
            Z = G.private_key,
            I = G.client_email;
          if (!Z || !I) throw new oGA("private_key and client_email are required.", "MISSING_CREDENTIALS");
          return {
            privateKey: Z,
            clientEmail: I
          }
        }
        case ".der":
        case ".crt":
        case ".pem":
          return {
            privateKey: await adB(A, "utf8")
          };
        case ".p12":
        case ".pfx":
          throw new oGA("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
        default:
          throw new oGA("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE")
      }
    }
    revokeToken(A) {
      if (A) {
        kT(this, yT, "m", il1).call(this).then(() => A(), A);
        return
      }
      return kT(this, yT, "m", il1).call(this)
    }
  }
  ip.GoogleToken = rdB;
  rGA = new WeakMap, yT = new WeakSet, ll1 = async function(Q) {
    if (kT(this, rGA, "f") && !Q.forceRefresh) return kT(this, rGA, "f");
    try {
      return await cdB(this, rGA, kT(this, yT, "m", pdB).call(this, Q), "f")
    } finally {
      cdB(this, rGA, void 0, "f")
    }
  }, pdB = async function(Q) {
    if (this.isTokenExpiring() === !1 && Q.forceRefresh === !1) return Promise.resolve(this.rawToken);
    if (!this.key && !this.keyFile) throw Error("No key or keyFile set.");
    if (!this.key && this.keyFile) {
      let B = await this.getCredentials(this.keyFile);
      if (this.key = B.privateKey, this.iss = B.clientEmail || this.iss, !B.clientEmail) kT(this, yT, "m", ldB).call(this)
    }
    return kT(this, yT, "m", idB).call(this)
  }, ldB = function() {
    if (!this.iss) throw new oGA("email is required.", "MISSING_CREDENTIALS")
  }, il1 = async function() {
    if (!this.accessToken) throw Error("No token to revoke.");
    let Q = wc6 + this.accessToken;
    await this.transporter.request({
      url: Q,
      retry: !0
    }), kT(this, yT, "m", nl1).call(this, {
      email: this.iss,
      sub: this.sub,
      key: this.key,
      keyFile: this.keyFile,
      scope: this.scope,
      additionalClaims: this.additionalClaims
    })
  }, nl1 = function(Q = {}) {
    if (this.keyFile = Q.keyFile, this.key = Q.key, this.rawToken = void 0, this.iss = Q.email || Q.iss, this.sub = Q.sub, this.additionalClaims = Q.additionalClaims, typeof Q.scope === "object") this.scope = Q.scope.join(" ");
    else this.scope = Q.scope;
    if (this.eagerRefreshThresholdMillis = Q.eagerRefreshThresholdMillis, Q.transporter) this.transporter = Q.transporter
  }, idB = async function() {
    var Q, B;
    let G = Math.floor(new Date().getTime() / 1000),
      Z = this.additionalClaims || {},
      I = Object.assign({
        iss: this.iss,
        scope: this.scope,
        aud: sdB,
        exp: G + 3600,
        iat: G,
        sub: this.sub
      }, Z),
      Y = zc6.sign({
        header: {
          alg: "RS256"
        },
        payload: I,
        secret: this.key
      });
    try {
      let J = await this.transporter.request({
        method: "POST",
        url: sdB,
        data: {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: Y
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "json",
        retryConfig: {
          httpMethodsToRetry: ["POST"]
        }
      });
      return this.rawToken = J.data, this.expiresAt = J.data.expires_in === null || J.data.expires_in === void 0 ? void 0 : (G + J.data.expires_in) * 1000, this.rawToken
    } catch (J) {
      this.rawToken = void 0, this.tokenExpires = void 0;
      let W = J.response && ((Q = J.response) === null || Q === void 0 ? void 0 : Q.data) ? (B = J.response) === null || B === void 0 ? void 0 : B.data : {};
      if (W.error) {
        let X = W.error_description ? `: ${W.error_description}` : "";
        J.message = `${W.error}${X}`
      }
      throw J
    }
  }
})
// @from(Start 7735938, End 7738925)
sl1 = z((edB) => {
  Object.defineProperty(edB, "__esModule", {
    value: !0
  });
  edB.JWTAccess = void 0;
  var qc6 = pl1(),
    Nc6 = lp(),
    tdB = {
      alg: "RS256",
      typ: "JWT"
    };
  class al1 {
    constructor(A, Q, B, G) {
      this.cache = new Nc6.LRUCache({
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
        I = Date.now();
      if (Z && Z.expiration - I > this.eagerRefreshThresholdMillis) return Z.headers;
      let Y = Math.floor(Date.now() / 1000),
        J = al1.getExpirationTime(Y),
        W;
      if (Array.isArray(B)) B = B.join(" ");
      if (B) W = {
        iss: this.email,
        sub: this.email,
        scope: B,
        exp: J,
        iat: Y
      };
      else W = {
        iss: this.email,
        sub: this.email,
        aud: A,
        exp: J,
        iat: Y
      };
      if (Q) {
        for (let D in W)
          if (Q[D]) throw Error(`The '${D}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`)
      }
      let X = this.keyId ? {
          ...tdB,
          kid: this.keyId
        } : tdB,
        V = Object.assign(W, Q),
        K = {
          Authorization: `Bearer ${qc6.sign({header:X,payload:V,secret:this.key})}`
        };
      return this.cache.set(G, {
        expiration: J * 1000,
        headers: K
      }), K
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
  edB.JWTAccess = al1
})
// @from(Start 7738931, End 7744966)
ol1 = z((BcB) => {
  Object.defineProperty(BcB, "__esModule", {
    value: !0
  });
  BcB.JWT = void 0;
  var QcB = odB(),
    Lc6 = sl1(),
    Mc6 = $e(),
    ReA = Gk();
  class rl1 extends Mc6.OAuth2Client {
    constructor(A, Q, B, G, Z, I) {
      let Y = A && typeof A === "object" ? A : {
        email: A,
        keyFile: Q,
        key: B,
        keyId: I,
        scopes: G,
        subject: Z
      };
      super(Y);
      this.email = Y.email, this.keyFile = Y.keyFile, this.key = Y.key, this.keyId = Y.keyId, this.scopes = Y.scopes, this.subject = Y.subject, this.additionalClaims = Y.additionalClaims, this.credentials = {
        refresh_token: "jwt-placeholder",
        expiry_date: 1
      }
    }
    createScoped(A) {
      let Q = new rl1(this);
      return Q.scopes = A, Q
    }
    async getRequestMetadataAsync(A) {
      A = this.defaultServicePath ? `https://${this.defaultServicePath}/` : A;
      let Q = !this.hasUserScopes() && A || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== ReA.DEFAULT_UNIVERSE;
      if (this.subject && this.universeDomain !== ReA.DEFAULT_UNIVERSE) throw RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${ReA.DEFAULT_UNIVERSE}`);
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
          if (!this.access) this.access = new Lc6.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
          let B;
          if (this.hasUserScopes()) B = this.scopes;
          else if (!A) B = this.defaultScopes;
          let G = this.useJWTAccessWithScope || this.universeDomain !== ReA.DEFAULT_UNIVERSE,
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
      let Q = new QcB.GoogleToken({
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
      if (!this.gtoken) this.gtoken = new QcB.GoogleToken({
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
  BcB.JWT = rl1
})
// @from(Start 7744972, End 7747760)
tl1 = z((ZcB) => {
  Object.defineProperty(ZcB, "__esModule", {
    value: !0
  });
  ZcB.UserRefreshClient = ZcB.USER_REFRESH_ACCOUNT_TYPE = void 0;
  var Oc6 = $e(),
    Rc6 = UA("querystring");
  ZcB.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
  class TeA extends Oc6.OAuth2Client {
    constructor(A, Q, B, G, Z) {
      let I = A && typeof A === "object" ? A : {
        clientId: A,
        clientSecret: Q,
        refreshToken: B,
        eagerRefreshThresholdMillis: G,
        forceRefreshOnFailure: Z
      };
      super(I);
      this._refreshToken = I.refreshToken, this.credentials.refresh_token = I.refreshToken
    }
    async refreshTokenNoCache(A) {
      return super.refreshTokenNoCache(this._refreshToken)
    }
    async fetchIdToken(A) {
      return (await this.transporter.request({
        ...TeA.RETRY_CONFIG,
        url: this.endpoints.oauth2TokenUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: (0, Rc6.stringify)({
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
      let Q = new TeA;
      return Q.fromJSON(A), Q
    }
  }
  ZcB.UserRefreshClient = TeA
})
// @from(Start 7747766, End 7751868)
el1 = z((JcB) => {
  Object.defineProperty(JcB, "__esModule", {
    value: !0
  });
  JcB.Impersonated = JcB.IMPERSONATED_ACCOUNT_TYPE = void 0;
  var YcB = $e(),
    Pc6 = PT(),
    jc6 = lp();
  JcB.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
  class xwA extends YcB.OAuth2Client {
    constructor(A = {}) {
      var Q, B, G, Z, I, Y;
      super(A);
      if (this.credentials = {
          expiry_date: 1,
          refresh_token: "impersonated-placeholder"
        }, this.sourceClient = (Q = A.sourceClient) !== null && Q !== void 0 ? Q : new YcB.OAuth2Client, this.targetPrincipal = (B = A.targetPrincipal) !== null && B !== void 0 ? B : "", this.delegates = (G = A.delegates) !== null && G !== void 0 ? G : [], this.targetScopes = (Z = A.targetScopes) !== null && Z !== void 0 ? Z : [], this.lifetime = (I = A.lifetime) !== null && I !== void 0 ? I : 3600, !(0, jc6.originalOrCamelOptions)(A).get("universe_domain")) this.universeDomain = this.sourceClient.universeDomain;
      else if (this.sourceClient.universeDomain !== this.universeDomain) throw RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
      this.endpoint = (Y = A.endpoint) !== null && Y !== void 0 ? Y : `https://iamcredentials.${this.universeDomain}`
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
        ...xwA.RETRY_CONFIG,
        url: B,
        data: G,
        method: "POST"
      })).data
    }
    getTargetPrincipal() {
      return this.targetPrincipal
    }
    async refreshToken() {
      var A, Q, B, G, Z, I;
      try {
        await this.sourceClient.getAccessToken();
        let Y = "projects/-/serviceAccounts/" + this.targetPrincipal,
          J = `${this.endpoint}/v1/${Y}:generateAccessToken`,
          W = {
            delegates: this.delegates,
            scope: this.targetScopes,
            lifetime: this.lifetime + "s"
          },
          X = await this.sourceClient.request({
            ...xwA.RETRY_CONFIG,
            url: J,
            data: W,
            method: "POST"
          }),
          V = X.data;
        return this.credentials.access_token = V.accessToken, this.credentials.expiry_date = Date.parse(V.expireTime), {
          tokens: this.credentials,
          res: X
        }
      } catch (Y) {
        if (!(Y instanceof Error)) throw Y;
        let J = 0,
          W = "";
        if (Y instanceof Pc6.GaxiosError) J = (B = (Q = (A = Y === null || Y === void 0 ? void 0 : Y.response) === null || A === void 0 ? void 0 : A.data) === null || Q === void 0 ? void 0 : Q.error) === null || B === void 0 ? void 0 : B.status, W = (I = (Z = (G = Y === null || Y === void 0 ? void 0 : Y.response) === null || G === void 0 ? void 0 : G.data) === null || Z === void 0 ? void 0 : Z.error) === null || I === void 0 ? void 0 : I.message;
        if (J && W) throw Y.message = `${J}: unable to impersonate: ${W}`, Y;
        else throw Y.message = `unable to impersonate: ${Y}`, Y
      }
    }
    async fetchIdToken(A, Q) {
      var B, G;
      await this.sourceClient.getAccessToken();
      let Z = `projects/-/serviceAccounts/${this.targetPrincipal}`,
        I = `${this.endpoint}/v1/${Z}:generateIdToken`,
        Y = {
          delegates: this.delegates,
          audience: A,
          includeEmail: (B = Q === null || Q === void 0 ? void 0 : Q.includeEmail) !== null && B !== void 0 ? B : !0,
          useEmailAzp: (G = Q === null || Q === void 0 ? void 0 : Q.includeEmail) !== null && G !== void 0 ? G : !0
        };
      return (await this.sourceClient.request({
        ...xwA.RETRY_CONFIG,
        url: I,
        data: Y,
        method: "POST"
      })).data.token
    }
  }
  JcB.Impersonated = xwA
})
// @from(Start 7751874, End 7755070)
Ai1 = z((FcB) => {
  Object.defineProperty(FcB, "__esModule", {
    value: !0
  });
  FcB.OAuthClientAuthHandler = void 0;
  FcB.getErrorFromOAuthErrorResponse = yc6;
  var XcB = UA("querystring"),
    _c6 = pGA(),
    kc6 = ["PUT", "POST", "PATCH"];
  class VcB {
    constructor(A) {
      this.clientAuthentication = A, this.crypto = (0, _c6.createCrypto)()
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
          I = this.crypto.encodeBase64StringUtf8(`${G}:${Z}`);
        Object.assign(A.headers, {
          Authorization: `Basic ${I}`
        })
      }
    }
    injectAuthenticatedRequestBody(A) {
      var Q;
      if (((Q = this.clientAuthentication) === null || Q === void 0 ? void 0 : Q.confidentialClientType) === "request-body") {
        let B = (A.method || "GET").toUpperCase();
        if (kc6.indexOf(B) !== -1) {
          let G, Z = A.headers || {};
          for (let I in Z)
            if (I.toLowerCase() === "content-type" && Z[I]) {
              G = Z[I].toLowerCase();
              break
            } if (G === "application/x-www-form-urlencoded") {
            A.data = A.data || "";
            let I = XcB.parse(A.data);
            Object.assign(I, {
              client_id: this.clientAuthentication.clientId,
              client_secret: this.clientAuthentication.clientSecret || ""
            }), A.data = XcB.stringify(I)
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
  FcB.OAuthClientAuthHandler = VcB;

  function yc6(A, Q) {
    let {
      error: B,
      error_description: G,
      error_uri: Z
    } = A, I = `Error code ${B}`;
    if (typeof G < "u") I += `: ${G}`;
    if (typeof Z < "u") I += ` - ${Z}`;
    let Y = Error(I);
    if (Q) {
      let J = Object.keys(Q);
      if (Q.stack) J.push("stack");
      J.forEach((W) => {
        if (W !== "message") Object.defineProperty(Y, W, {
          value: Q[W],
          writable: !1,
          enumerable: !0
        })
      })
    }
    return Y
  }
})
// @from(Start 7755076, End 7756858)
Bi1 = z((HcB) => {
  Object.defineProperty(HcB, "__esModule", {
    value: !0
  });
  HcB.StsCredentials = void 0;
  var vc6 = PT(),
    bc6 = UA("querystring"),
    fc6 = PwA(),
    DcB = Ai1();
  class Qi1 extends DcB.OAuthClientAuthHandler {
    constructor(A, Q) {
      super(Q);
      this.tokenExchangeEndpoint = A, this.transporter = new fc6.DefaultTransporter
    }
    async exchangeToken(A, Q, B) {
      var G, Z, I;
      let Y = {
        grant_type: A.grantType,
        resource: A.resource,
        audience: A.audience,
        scope: (G = A.scope) === null || G === void 0 ? void 0 : G.join(" "),
        requested_token_type: A.requestedTokenType,
        subject_token: A.subjectToken,
        subject_token_type: A.subjectTokenType,
        actor_token: (Z = A.actingParty) === null || Z === void 0 ? void 0 : Z.actorToken,
        actor_token_type: (I = A.actingParty) === null || I === void 0 ? void 0 : I.actorTokenType,
        options: B && JSON.stringify(B)
      };
      Object.keys(Y).forEach((X) => {
        if (typeof Y[X] > "u") delete Y[X]
      });
      let J = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      Object.assign(J, Q || {});
      let W = {
        ...Qi1.RETRY_CONFIG,
        url: this.tokenExchangeEndpoint.toString(),
        method: "POST",
        headers: J,
        data: bc6.stringify(Y),
        responseType: "json"
      };
      this.applyClientAuthenticationOptions(W);
      try {
        let X = await this.transporter.request(W),
          V = X.data;
        return V.res = X, V
      } catch (X) {
        if (X instanceof vc6.GaxiosError && X.response) throw (0, DcB.getErrorFromOAuthErrorResponse)(X.response.data, X);
        throw X
      }
    }
  }
  HcB.StsCredentials = Qi1
})
// @from(Start 7756864, End 7766398)
np = z((uF) => {
  var Gi1 = uF && uF.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    EcB = uF && uF.__classPrivateFieldSet || function(A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    Zi1, tGA, UcB;
  Object.defineProperty(uF, "__esModule", {
    value: !0
  });
  uF.BaseExternalAccountClient = uF.DEFAULT_UNIVERSE = uF.CLOUD_RESOURCE_MANAGER = uF.EXTERNAL_ACCOUNT_TYPE = uF.EXPIRATION_TIME_OFFSET = void 0;
  var hc6 = UA("stream"),
    gc6 = Gk(),
    uc6 = Bi1(),
    zcB = lp(),
    mc6 = "urn:ietf:params:oauth:grant-type:token-exchange",
    dc6 = "urn:ietf:params:oauth:token-type:access_token",
    Ii1 = "https://www.googleapis.com/auth/cloud-platform",
    cc6 = 3600;
  uF.EXPIRATION_TIME_OFFSET = 300000;
  uF.EXTERNAL_ACCOUNT_TYPE = "external_account";
  uF.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
  var pc6 = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+",
    lc6 = "https://sts.{universeDomain}/v1/token",
    ic6 = Ll1(),
    nc6 = Gk();
  Object.defineProperty(uF, "DEFAULT_UNIVERSE", {
    enumerable: !0,
    get: function() {
      return nc6.DEFAULT_UNIVERSE
    }
  });
  class PeA extends gc6.AuthClient {
    constructor(A, Q) {
      var B;
      super({
        ...A,
        ...Q
      });
      Zi1.add(this), tGA.set(this, null);
      let G = (0, zcB.originalOrCamelOptions)(A),
        Z = G.get("type");
      if (Z && Z !== uF.EXTERNAL_ACCOUNT_TYPE) throw Error(`Expected "${uF.EXTERNAL_ACCOUNT_TYPE}" type but received "${A.type}"`);
      let I = G.get("client_id"),
        Y = G.get("client_secret"),
        J = (B = G.get("token_url")) !== null && B !== void 0 ? B : lc6.replace("{universeDomain}", this.universeDomain),
        W = G.get("subject_token_type"),
        X = G.get("workforce_pool_user_project"),
        V = G.get("service_account_impersonation_url"),
        F = G.get("service_account_impersonation"),
        K = (0, zcB.originalOrCamelOptions)(F).get("token_lifetime_seconds");
      if (this.cloudResourceManagerURL = new URL(G.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`), I) this.clientAuth = {
        confidentialClientType: "basic",
        clientId: I,
        clientSecret: Y
      };
      this.stsCredential = new uc6.StsCredentials(J, this.clientAuth), this.scopes = G.get("scopes") || [Ii1], this.cachedAccessToken = null, this.audience = G.get("audience"), this.subjectTokenType = W, this.workforcePoolUserProject = X;
      let D = new RegExp(pc6);
      if (this.workforcePoolUserProject && !this.audience.match(D)) throw Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
      if (this.serviceAccountImpersonationUrl = V, this.serviceAccountImpersonationLifetime = K, this.serviceAccountImpersonationLifetime) this.configLifetimeRequested = !0;
      else this.configLifetimeRequested = !1, this.serviceAccountImpersonationLifetime = cc6;
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
            ...PeA.RETRY_CONFIG,
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
          let I = Z.status,
            Y = Z.config.data instanceof hc6.Readable;
          if (!Q && (I === 401 || I === 403) && !Y && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
        }
        throw G
      }
      return B
    }
    async refreshAccessTokenAsync() {
      EcB(this, tGA, Gi1(this, tGA, "f") || Gi1(this, Zi1, "m", UcB).call(this), "f");
      try {
        return await Gi1(this, tGA, "f")
      } finally {
        EcB(this, tGA, null, "f")
      }
    }
    getProjectNumber(A) {
      let Q = A.match(/\/projects\/([^/]+)/);
      if (!Q) return null;
      return Q[1]
    }
    async getImpersonatedAccessToken(A) {
      let Q = {
          ...PeA.RETRY_CONFIG,
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
      return this.scopes || [Ii1]
    }
    getMetricsHeaderValue() {
      let A = process.version.replace(/^v/, ""),
        Q = this.serviceAccountImpersonationUrl !== void 0,
        B = this.credentialSourceType ? this.credentialSourceType : "unknown";
      return `gl-node/${A} auth/${ic6.version} google-byoid-sdk source/${B} sa-impersonation/${Q} config-lifetime/${this.configLifetimeRequested}`
    }
  }
  uF.BaseExternalAccountClient = PeA;
  tGA = new WeakMap, Zi1 = new WeakSet, UcB = async function() {
    let Q = await this.retrieveSubjectToken(),
      B = {
        grantType: mc6,
        audience: this.audience,
        requestedTokenType: dc6,
        subjectToken: Q,
        subjectTokenType: this.subjectTokenType,
        scope: this.serviceAccountImpersonationUrl ? [Ii1] : this.getScopesArray()
      },
      G = !this.clientAuth && this.workforcePoolUserProject ? {
        userProject: this.workforcePoolUserProject
      } : void 0,
      Z = {
        "x-goog-api-client": this.getMetricsHeaderValue()
      },
      I = await this.stsCredential.exchangeToken(B, Z, G);
    if (this.serviceAccountImpersonationUrl) this.cachedAccessToken = await this.getImpersonatedAccessToken(I.access_token);
    else if (I.expires_in) this.cachedAccessToken = {
      access_token: I.access_token,
      expiry_date: new Date().getTime() + I.expires_in * 1000,
      res: I.res
    };
    else this.cachedAccessToken = {
      access_token: I.access_token,
      res: I.res
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
// @from(Start 7766404, End 7767731)
NcB = z((wcB) => {
  var Yi1, Ji1, Wi1;
  Object.defineProperty(wcB, "__esModule", {
    value: !0
  });
  wcB.FileSubjectTokenSupplier = void 0;
  var Xi1 = UA("util"),
    Vi1 = UA("fs"),
    ac6 = (0, Xi1.promisify)((Yi1 = Vi1.readFile) !== null && Yi1 !== void 0 ? Yi1 : () => {}),
    sc6 = (0, Xi1.promisify)((Ji1 = Vi1.realpath) !== null && Ji1 !== void 0 ? Ji1 : () => {}),
    rc6 = (0, Xi1.promisify)((Wi1 = Vi1.lstat) !== null && Wi1 !== void 0 ? Wi1 : () => {});
  class $cB {
    constructor(A) {
      this.filePath = A.filePath, this.formatType = A.formatType, this.subjectTokenFieldName = A.subjectTokenFieldName
    }
    async getSubjectToken(A) {
      let Q = this.filePath;
      try {
        if (Q = await sc6(Q), !(await rc6(Q)).isFile()) throw Error()
      } catch (Z) {
        if (Z instanceof Error) Z.message = `The file at ${Q} does not exist, or it is not a file. ${Z.message}`;
        throw Z
      }
      let B, G = await ac6(Q, {
        encoding: "utf8"
      });
      if (this.formatType === "text") B = G;
      else if (this.formatType === "json" && this.subjectTokenFieldName) B = JSON.parse(G)[this.subjectTokenFieldName];
      if (!B) throw Error("Unable to parse the subject_token from the credential_source file");
      return B
    }
  }
  wcB.FileSubjectTokenSupplier = $cB
})
// @from(Start 7767737, End 7768713)
RcB = z((McB) => {
  Object.defineProperty(McB, "__esModule", {
    value: !0
  });
  McB.UrlSubjectTokenSupplier = void 0;
  class LcB {
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
  McB.UrlSubjectTokenSupplier = LcB
})
// @from(Start 7768719, End 7770857)
Di1 = z((TcB) => {
  Object.defineProperty(TcB, "__esModule", {
    value: !0
  });
  TcB.IdentityPoolClient = void 0;
  var oc6 = np(),
    Fi1 = lp(),
    tc6 = NcB(),
    ec6 = RcB();
  class Ki1 extends oc6.BaseExternalAccountClient {
    constructor(A, Q) {
      super(A, Q);
      let B = (0, Fi1.originalOrCamelOptions)(A),
        G = B.get("credential_source"),
        Z = B.get("subject_token_supplier");
      if (!G && !Z) throw Error("A credential source or subject token supplier must be specified.");
      if (G && Z) throw Error("Only one of credential source or subject token supplier can be specified.");
      if (Z) this.subjectTokenSupplier = Z, this.credentialSourceType = "programmatic";
      else {
        let I = (0, Fi1.originalOrCamelOptions)(G),
          Y = (0, Fi1.originalOrCamelOptions)(I.get("format")),
          J = Y.get("type") || "text",
          W = Y.get("subject_token_field_name");
        if (J !== "json" && J !== "text") throw Error(`Invalid credential_source format "${J}"`);
        if (J === "json" && !W) throw Error("Missing subject_token_field_name for JSON credential_source format");
        let X = I.get("file"),
          V = I.get("url"),
          F = I.get("headers");
        if (X && V) throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
        else if (X && !V) this.credentialSourceType = "file", this.subjectTokenSupplier = new tc6.FileSubjectTokenSupplier({
          filePath: X,
          formatType: J,
          subjectTokenFieldName: W
        });
        else if (!X && V) this.credentialSourceType = "url", this.subjectTokenSupplier = new ec6.UrlSubjectTokenSupplier({
          url: V,
          formatType: J,
          subjectTokenFieldName: W,
          headers: F,
          additionalGaxiosOptions: Ki1.RETRY_CONFIG
        });
        else throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.')
      }
    }
    async retrieveSubjectToken() {
      return this.subjectTokenSupplier.getSubjectToken(this.supplierContext)
    }
  }
  TcB.IdentityPoolClient = Ki1
})
// @from(Start 7770863, End 7773922)
Hi1 = z((kcB) => {
  Object.defineProperty(kcB, "__esModule", {
    value: !0
  });
  kcB.AwsRequestSigner = void 0;
  var ScB = pGA(),
    jcB = "AWS4-HMAC-SHA256",
    Ap6 = "aws4_request";
  class _cB {
    constructor(A, Q) {
      this.getCredentials = A, this.region = Q, this.crypto = (0, ScB.createCrypto)()
    }
    async getRequestOptions(A) {
      if (!A.url) throw Error('"url" is required in "amzOptions"');
      let Q = typeof A.data === "object" ? JSON.stringify(A.data) : A.data,
        B = A.url,
        G = A.method || "GET",
        Z = A.body || Q,
        I = A.headers,
        Y = await this.getCredentials(),
        J = new URL(B),
        W = await Bp6({
          crypto: this.crypto,
          host: J.host,
          canonicalUri: J.pathname,
          canonicalQuerystring: J.search.substr(1),
          method: G,
          region: this.region,
          securityCredentials: Y,
          requestPayload: Z,
          additionalAmzHeaders: I
        }),
        X = Object.assign(W.amzDate ? {
          "x-amz-date": W.amzDate
        } : {}, {
          Authorization: W.authorizationHeader,
          host: J.host
        }, I || {});
      if (Y.token) Object.assign(X, {
        "x-amz-security-token": Y.token
      });
      let V = {
        url: B,
        method: G,
        headers: X
      };
      if (typeof Z < "u") V.body = Z;
      return V
    }
  }
  kcB.AwsRequestSigner = _cB;
  async function vwA(A, Q, B) {
    return await A.signWithHmacSha256(Q, B)
  }
  async function Qp6(A, Q, B, G, Z) {
    let I = await vwA(A, `AWS4${Q}`, B),
      Y = await vwA(A, I, G),
      J = await vwA(A, Y, Z);
    return await vwA(A, J, "aws4_request")
  }
  async function Bp6(A) {
    let Q = A.additionalAmzHeaders || {},
      B = A.requestPayload || "",
      G = A.host.split(".")[0],
      Z = new Date,
      I = Z.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, ""),
      Y = Z.toISOString().replace(/[-]/g, "").replace(/T.*/, ""),
      J = {};
    if (Object.keys(Q).forEach((w) => {
        J[w.toLowerCase()] = Q[w]
      }), A.securityCredentials.token) J["x-amz-security-token"] = A.securityCredentials.token;
    let W = Object.assign({
        host: A.host
      }, J.date ? {} : {
        "x-amz-date": I
      }, J),
      X = "",
      V = Object.keys(W).sort();
    V.forEach((w) => {
      X += `${w}:${W[w]}
`
    });
    let F = V.join(";"),
      K = await A.crypto.sha256DigestHex(B),
      D = `${A.method}
${A.canonicalUri}
${A.canonicalQuerystring}
${X}
${F}
${K}`,
      H = `${Y}/${A.region}/${G}/${Ap6}`,
      C = `${jcB}
${I}
${H}
` + await A.crypto.sha256DigestHex(D),
      E = await Qp6(A.crypto, A.securityCredentials.secretAccessKey, Y, A.region, G),
      U = await vwA(A.crypto, E, C),
      q = `${jcB} Credential=${A.securityCredentials.accessKeyId}/${H}, SignedHeaders=${F}, Signature=${(0,ScB.fromArrayBufferToHex)(U)}`;
    return {
      amzDate: J.date ? void 0 : I,
      authorizationHeader: q,
      canonicalQuerystring: A.canonicalQuerystring
    }
  }
})
// @from(Start 7773928, End 7777299)
fcB = z((eGA) => {
  var Rf = eGA && eGA.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    xT, Ci1, xcB, vcB, jeA, Ei1;
  Object.defineProperty(eGA, "__esModule", {
    value: !0
  });
  eGA.DefaultAwsSecurityCredentialsSupplier = void 0;
  class bcB {
    constructor(A) {
      xT.add(this), this.regionUrl = A.regionUrl, this.securityCredentialsUrl = A.securityCredentialsUrl, this.imdsV2SessionTokenUrl = A.imdsV2SessionTokenUrl, this.additionalGaxiosOptions = A.additionalGaxiosOptions
    }
    async getAwsRegion(A) {
      if (Rf(this, xT, "a", jeA)) return Rf(this, xT, "a", jeA);
      let Q = {};
      if (!Rf(this, xT, "a", jeA) && this.imdsV2SessionTokenUrl) Q["x-aws-ec2-metadata-token"] = await Rf(this, xT, "m", Ci1).call(this, A.transporter);
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
      if (Rf(this, xT, "a", Ei1)) return Rf(this, xT, "a", Ei1);
      let Q = {};
      if (this.imdsV2SessionTokenUrl) Q["x-aws-ec2-metadata-token"] = await Rf(this, xT, "m", Ci1).call(this, A.transporter);
      let B = await Rf(this, xT, "m", xcB).call(this, Q, A.transporter),
        G = await Rf(this, xT, "m", vcB).call(this, B, Q, A.transporter);
      return {
        accessKeyId: G.AccessKeyId,
        secretAccessKey: G.SecretAccessKey,
        token: G.Token
      }
    }
  }
  eGA.DefaultAwsSecurityCredentialsSupplier = bcB;
  xT = new WeakSet, Ci1 = async function(Q) {
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
  }, xcB = async function(Q, B) {
    if (!this.securityCredentialsUrl) throw Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
    let G = {
      ...this.additionalGaxiosOptions,
      url: this.securityCredentialsUrl,
      method: "GET",
      responseType: "text",
      headers: Q
    };
    return (await B.request(G)).data
  }, vcB = async function(Q, B, G) {
    return (await G.request({
      ...this.additionalGaxiosOptions,
      url: `${this.securityCredentialsUrl}/${Q}`,
      responseType: "json",
      headers: B
    })).data
  }, jeA = function() {
    return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null
  }, Ei1 = function() {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      token: process.env.AWS_SESSION_TOKEN
    };
    return null
  }
})
// @from(Start 7777305, End 7780697)
zi1 = z((AZA) => {
  var Gp6 = AZA && AZA.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    SeA, gcB;
  Object.defineProperty(AZA, "__esModule", {
    value: !0
  });
  AZA.AwsClient = void 0;
  var Zp6 = Hi1(),
    Ip6 = np(),
    Yp6 = fcB(),
    hcB = lp();
  class bwA extends Ip6.BaseExternalAccountClient {
    constructor(A, Q) {
      super(A, Q);
      let B = (0, hcB.originalOrCamelOptions)(A),
        G = B.get("credential_source"),
        Z = B.get("aws_security_credentials_supplier");
      if (!G && !Z) throw Error("A credential source or AWS security credentials supplier must be specified.");
      if (G && Z) throw Error("Only one of credential source or AWS security credentials supplier can be specified.");
      if (Z) this.awsSecurityCredentialsSupplier = Z, this.regionalCredVerificationUrl = Gp6(SeA, SeA, "f", gcB), this.credentialSourceType = "programmatic";
      else {
        let I = (0, hcB.originalOrCamelOptions)(G);
        this.environmentId = I.get("environment_id");
        let Y = I.get("region_url"),
          J = I.get("url"),
          W = I.get("imdsv2_session_token_url");
        this.awsSecurityCredentialsSupplier = new Yp6.DefaultAwsSecurityCredentialsSupplier({
          regionUrl: Y,
          securityCredentialsUrl: J,
          imdsV2SessionTokenUrl: W
        }), this.regionalCredVerificationUrl = I.get("regional_cred_verification_url"), this.credentialSourceType = "aws", this.validateEnvironmentId()
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
      if (!this.awsRequestSigner) this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext), this.awsRequestSigner = new Zp6.AwsRequestSigner(async () => {
        return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext)
      }, this.region);
      let A = await this.awsRequestSigner.getRequestOptions({
          ...SeA.RETRY_CONFIG,
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
  AZA.AwsClient = bwA;
  SeA = bwA;
  gcB = {
    value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15"
  };
  bwA.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
  bwA.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254"
})
// @from(Start 7780703, End 7783411)
Oi1 = z((dcB) => {
  Object.defineProperty(dcB, "__esModule", {
    value: !0
  });
  dcB.InvalidSubjectTokenError = dcB.InvalidMessageFieldError = dcB.InvalidCodeFieldError = dcB.InvalidTokenTypeFieldError = dcB.InvalidExpirationTimeFieldError = dcB.InvalidSuccessFieldError = dcB.InvalidVersionFieldError = dcB.ExecutableResponseError = dcB.ExecutableResponse = void 0;
  var _eA = "urn:ietf:params:oauth:token-type:saml2",
    Ui1 = "urn:ietf:params:oauth:token-type:id_token",
    $i1 = "urn:ietf:params:oauth:token-type:jwt";
  class ucB {
    constructor(A) {
      if (!A.version) throw new wi1("Executable response must contain a 'version' field.");
      if (A.success === void 0) throw new qi1("Executable response must contain a 'success' field.");
      if (this.version = A.version, this.success = A.success, this.success) {
        if (this.expirationTime = A.expiration_time, this.tokenType = A.token_type, this.tokenType !== _eA && this.tokenType !== Ui1 && this.tokenType !== $i1) throw new Ni1(`Executable response must contain a 'token_type' field when successful and it must be one of ${Ui1}, ${$i1}, or ${_eA}.`);
        if (this.tokenType === _eA) {
          if (!A.saml_response) throw new keA(`Executable response must contain a 'saml_response' field when token_type=${_eA}.`);
          this.subjectToken = A.saml_response
        } else {
          if (!A.id_token) throw new keA(`Executable response must contain a 'id_token' field when token_type=${Ui1} or ${$i1}.`);
          this.subjectToken = A.id_token
        }
      } else {
        if (!A.code) throw new Li1("Executable response must contain a 'code' field when unsuccessful.");
        if (!A.message) throw new Mi1("Executable response must contain a 'message' field when unsuccessful.");
        this.errorCode = A.code, this.errorMessage = A.message
      }
    }
    isValid() {
      return !this.isExpired() && this.success
    }
    isExpired() {
      return this.expirationTime !== void 0 && this.expirationTime < Math.round(Date.now() / 1000)
    }
  }
  dcB.ExecutableResponse = ucB;
  class Tf extends Error {
    constructor(A) {
      super(A);
      Object.setPrototypeOf(this, new.target.prototype)
    }
  }
  dcB.ExecutableResponseError = Tf;
  class wi1 extends Tf {}
  dcB.InvalidVersionFieldError = wi1;
  class qi1 extends Tf {}
  dcB.InvalidSuccessFieldError = qi1;
  class mcB extends Tf {}
  dcB.InvalidExpirationTimeFieldError = mcB;
  class Ni1 extends Tf {}
  dcB.InvalidTokenTypeFieldError = Ni1;
  class Li1 extends Tf {}
  dcB.InvalidCodeFieldError = Li1;
  class Mi1 extends Tf {}
  dcB.InvalidMessageFieldError = Mi1;
  class keA extends Tf {}
  dcB.InvalidSubjectTokenError = keA
})
// @from(Start 7783417, End 7786097)
icB = z((pcB) => {
  Object.defineProperty(pcB, "__esModule", {
    value: !0
  });
  pcB.PluggableAuthHandler = void 0;
  var Cp6 = yeA(),
    we = Oi1(),
    Ep6 = UA("child_process"),
    Ri1 = UA("fs");
  class Ti1 {
    constructor(A) {
      if (!A.command) throw Error("No command provided.");
      if (this.commandComponents = Ti1.parseCommand(A.command), this.timeoutMillis = A.timeoutMillis, !this.timeoutMillis) throw Error("No timeoutMillis provided.");
      this.outputFile = A.outputFile
    }
    retrieveResponseFromExecutable(A) {
      return new Promise((Q, B) => {
        let G = Ep6.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
            env: {
              ...process.env,
              ...Object.fromEntries(A)
            }
          }),
          Z = "";
        G.stdout.on("data", (Y) => {
          Z += Y
        }), G.stderr.on("data", (Y) => {
          Z += Y
        });
        let I = setTimeout(() => {
          return G.removeAllListeners(), G.kill(), B(Error("The executable failed to finish within the timeout specified."))
        }, this.timeoutMillis);
        G.on("close", (Y) => {
          if (clearTimeout(I), Y === 0) try {
            let J = JSON.parse(Z),
              W = new we.ExecutableResponse(J);
            return Q(W)
          } catch (J) {
            if (J instanceof we.ExecutableResponseError) return B(J);
            return B(new we.ExecutableResponseError(`The executable returned an invalid response: ${Z}`))
          } else return B(new Cp6.ExecutableError(Z, Y.toString()))
        })
      })
    }
    async retrieveCachedResponse() {
      if (!this.outputFile || this.outputFile.length === 0) return;
      let A;
      try {
        A = await Ri1.promises.realpath(this.outputFile)
      } catch (B) {
        return
      }
      if (!(await Ri1.promises.lstat(A)).isFile()) return;
      let Q = await Ri1.promises.readFile(A, {
        encoding: "utf8"
      });
      if (Q === "") return;
      try {
        let B = JSON.parse(Q);
        if (new we.ExecutableResponse(B).isValid()) return new we.ExecutableResponse(B);
        return
      } catch (B) {
        if (B instanceof we.ExecutableResponseError) throw B;
        throw new we.ExecutableResponseError(`The output file contained an invalid response: ${Q}`)
      }
    }
    static parseCommand(A) {
      let Q = A.match(/(?:[^\s"]+|"[^"]*")+/g);
      if (!Q) throw Error(`Provided command: "${A}" could not be parsed.`);
      for (let B = 0; B < Q.length; B++)
        if (Q[B][0] === '"' && Q[B].slice(-1) === '"') Q[B] = Q[B].slice(1, -1);
      return Q
    }
  }
  pcB.PluggableAuthHandler = Ti1
})
// @from(Start 7786103, End 7789049)
yeA = z((ocB) => {
  Object.defineProperty(ocB, "__esModule", {
    value: !0
  });
  ocB.PluggableAuthClient = ocB.ExecutableError = void 0;
  var zp6 = np(),
    Up6 = Oi1(),
    $p6 = icB();
  class Pi1 extends Error {
    constructor(A, Q) {
      super(`The executable failed with exit code: ${Q} and error message: ${A}.`);
      this.code = Q, Object.setPrototypeOf(this, new.target.prototype)
    }
  }
  ocB.ExecutableError = Pi1;
  var wp6 = 30000,
    ncB = 5000,
    acB = 120000,
    qp6 = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES",
    scB = 1;
  class rcB extends zp6.BaseExternalAccountClient {
    constructor(A, Q) {
      super(A, Q);
      if (!A.credential_source.executable) throw Error('No valid Pluggable Auth "credential_source" provided.');
      if (this.command = A.credential_source.executable.command, !this.command) throw Error('No valid Pluggable Auth "credential_source" provided.');
      if (A.credential_source.executable.timeout_millis === void 0) this.timeoutMillis = wp6;
      else if (this.timeoutMillis = A.credential_source.executable.timeout_millis, this.timeoutMillis < ncB || this.timeoutMillis > acB) throw Error(`Timeout must be between ${ncB} and ${acB} milliseconds.`);
      this.outputFile = A.credential_source.executable.output_file, this.handler = new $p6.PluggableAuthHandler({
        command: this.command,
        timeoutMillis: this.timeoutMillis,
        outputFile: this.outputFile
      }), this.credentialSourceType = "executable"
    }
    async retrieveSubjectToken() {
      if (process.env[qp6] !== "1") throw Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
      let A = void 0;
      if (this.outputFile) A = await this.handler.retrieveCachedResponse();
      if (!A) {
        let Q = new Map;
        if (Q.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience), Q.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType), Q.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0"), this.outputFile) Q.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
        let B = this.getServiceAccountEmail();
        if (B) Q.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", B);
        A = await this.handler.retrieveResponseFromExecutable(Q)
      }
      if (A.version > scB) throw Error(`Version of executable is not currently supported, maximum supported version is ${scB}.`);
      if (!A.success) throw new Pi1(A.errorMessage, A.errorCode);
      if (this.outputFile) {
        if (!A.expirationTime) throw new Up6.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.")
      }
      if (A.isExpired()) throw Error("Executable response is expired.");
      return A.subjectToken
    }
  }
  ocB.PluggableAuthClient = rcB
})
// @from(Start 7789055, End 7790039)
ji1 = z((ApB) => {
  Object.defineProperty(ApB, "__esModule", {
    value: !0
  });
  ApB.ExternalAccountClient = void 0;
  var Lp6 = np(),
    Mp6 = Di1(),
    Op6 = zi1(),
    Rp6 = yeA();
  class ecB {
    constructor() {
      throw Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()")
    }
    static fromJSON(A, Q) {
      var B, G;
      if (A && A.type === Lp6.EXTERNAL_ACCOUNT_TYPE)
        if ((B = A.credential_source) === null || B === void 0 ? void 0 : B.environment_id) return new Op6.AwsClient(A, Q);
        else if ((G = A.credential_source) === null || G === void 0 ? void 0 : G.executable) return new Rp6.PluggableAuthClient(A, Q);
      else return new Mp6.IdentityPoolClient(A, Q);
      else return null
    }
  }
  ApB.ExternalAccountClient = ecB
})