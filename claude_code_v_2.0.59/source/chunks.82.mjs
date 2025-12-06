
// @from(Start 7790045, End 7794305)
YpB = z((ZpB) => {
  Object.defineProperty(ZpB, "__esModule", {
    value: !0
  });
  ZpB.ExternalAccountAuthorizedUserClient = ZpB.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
  var Tp6 = Gk(),
    BpB = Ai1(),
    Pp6 = PT(),
    jp6 = UA("stream"),
    Sp6 = np();
  ZpB.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
  var _p6 = "https://sts.{universeDomain}/v1/oauthtoken";
  class Si1 extends BpB.OAuthClientAuthHandler {
    constructor(A, Q, B) {
      super(B);
      this.url = A, this.transporter = Q
    }
    async refreshToken(A, Q) {
      let B = new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: A
        }),
        G = {
          "Content-Type": "application/x-www-form-urlencoded",
          ...Q
        },
        Z = {
          ...Si1.RETRY_CONFIG,
          url: this.url,
          method: "POST",
          headers: G,
          data: B.toString(),
          responseType: "json"
        };
      this.applyClientAuthenticationOptions(Z);
      try {
        let I = await this.transporter.request(Z),
          Y = I.data;
        return Y.res = I, Y
      } catch (I) {
        if (I instanceof Pp6.GaxiosError && I.response) throw (0, BpB.getErrorFromOAuthErrorResponse)(I.response.data, I);
        throw I
      }
    }
  }
  class GpB extends Tp6.AuthClient {
    constructor(A, Q) {
      var B;
      super({
        ...A,
        ...Q
      });
      if (A.universe_domain) this.universeDomain = A.universe_domain;
      this.refreshToken = A.refresh_token;
      let G = {
        confidentialClientType: "basic",
        clientId: A.client_id,
        clientSecret: A.client_secret
      };
      if (this.externalAccountAuthorizedUserHandler = new Si1((B = A.token_url) !== null && B !== void 0 ? B : _p6.replace("{universeDomain}", this.universeDomain), this.transporter, G), this.cachedAccessToken = null, this.quotaProjectId = A.quota_project_id, typeof(Q === null || Q === void 0 ? void 0 : Q.eagerRefreshThresholdMillis) !== "number") this.eagerRefreshThresholdMillis = Sp6.EXPIRATION_TIME_OFFSET;
      else this.eagerRefreshThresholdMillis = Q.eagerRefreshThresholdMillis;
      this.forceRefreshOnFailure = !!(Q === null || Q === void 0 ? void 0 : Q.forceRefreshOnFailure)
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
            Y = Z.config.data instanceof jp6.Readable;
          if (!Q && (I === 401 || I === 403) && !Y && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
        }
        throw G
      }
      return B
    }
    async refreshAccessTokenAsync() {
      let A = await this.externalAccountAuthorizedUserHandler.refreshToken(this.refreshToken);
      if (this.cachedAccessToken = {
          access_token: A.access_token,
          expiry_date: new Date().getTime() + A.expires_in * 1000,
          res: A.res
        }, A.refresh_token !== void 0) this.refreshToken = A.refresh_token;
      return this.cachedAccessToken
    }
    isExpired(A) {
      let Q = new Date().getTime();
      return A.expiry_date ? Q >= A.expiry_date - this.eagerRefreshThresholdMillis : !1
    }
  }
  ZpB.ExternalAccountAuthorizedUserClient = GpB
})
// @from(Start 7794311, End 7811486)
KpB = z((LD) => {
  var ap = LD && LD.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    JpB = LD && LD.__classPrivateFieldSet || function(A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    sp, GZA, ZZA, FpB;
  Object.defineProperty(LD, "__esModule", {
    value: !0
  });
  LD.GoogleAuth = LD.GoogleAuthExceptionMessages = LD.CLOUD_SDK_CLIENT_ID = void 0;
  var yp6 = UA("child_process"),
    gwA = UA("fs"),
    fwA = RwA(),
    xp6 = UA("os"),
    ki1 = UA("path"),
    vp6 = pGA(),
    bp6 = PwA(),
    fp6 = kl1(),
    hp6 = yl1(),
    gp6 = xl1(),
    QZA = ol1(),
    WpB = tl1(),
    BZA = el1(),
    up6 = ji1(),
    hwA = np(),
    _i1 = Gk(),
    XpB = YpB(),
    VpB = lp();
  LD.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
  LD.GoogleAuthExceptionMessages = {
    API_KEY_WITH_CREDENTIALS: "API Keys and Credentials are mutually exclusive authentication methods and cannot be used together.",
    NO_PROJECT_ID_FOUND: `Unable to detect a Project Id in the current environment. 
To learn more about authentication and Google APIs, visit: 
https://cloud.google.com/docs/authentication/getting-started`,
    NO_CREDENTIALS_FOUND: `Unable to find credentials in current environment. 
To learn more about authentication and Google APIs, visit: 
https://cloud.google.com/docs/authentication/getting-started`,
    NO_ADC_FOUND: "Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.",
    NO_UNIVERSE_DOMAIN_FOUND: `Unable to detect a Universe Domain in the current environment.
To learn more about Universe Domain retrieval, visit: 
https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys`
  };
  class yi1 {
    get isGCE() {
      return this.checkIsGCE
    }
    constructor(A = {}) {
      if (sp.add(this), this.checkIsGCE = void 0, this.jsonContent = null, this.cachedCredential = null, GZA.set(this, null), this.clientOptions = {}, this._cachedProjectId = A.projectId || null, this.cachedCredential = A.authClient || null, this.keyFilename = A.keyFilename || A.keyFile, this.scopes = A.scopes, this.clientOptions = A.clientOptions || {}, this.jsonContent = A.credentials || null, this.apiKey = A.apiKey || this.clientOptions.apiKey || null, this.apiKey && (this.jsonContent || this.clientOptions.credentials)) throw RangeError(LD.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
      if (A.universeDomain) this.clientOptions.universeDomain = A.universeDomain
    }
    setGapicJWTValues(A) {
      A.defaultServicePath = this.defaultServicePath, A.useJWTAccessWithScope = this.useJWTAccessWithScope, A.defaultScopes = this.defaultScopes
    }
    getProjectId(A) {
      if (A) this.getProjectIdAsync().then((Q) => A(null, Q), A);
      else return this.getProjectIdAsync()
    }
    async getProjectIdOptional() {
      try {
        return await this.getProjectId()
      } catch (A) {
        if (A instanceof Error && A.message === LD.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) return null;
        else throw A
      }
    }
    async findAndCacheProjectId() {
      let A = null;
      if (A || (A = await this.getProductionProjectId()), A || (A = await this.getFileProjectId()), A || (A = await this.getDefaultServiceProjectId()), A || (A = await this.getGCEProjectId()), A || (A = await this.getExternalAccountClientProjectId()), A) return this._cachedProjectId = A, A;
      else throw Error(LD.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND)
    }
    async getProjectIdAsync() {
      if (this._cachedProjectId) return this._cachedProjectId;
      if (!this._findProjectIdPromise) this._findProjectIdPromise = this.findAndCacheProjectId();
      return this._findProjectIdPromise
    }
    async getUniverseDomainFromMetadataServer() {
      var A;
      let Q;
      try {
        Q = await fwA.universe("universe-domain"), Q || (Q = _i1.DEFAULT_UNIVERSE)
      } catch (B) {
        if (B && ((A = B === null || B === void 0 ? void 0 : B.response) === null || A === void 0 ? void 0 : A.status) === 404) Q = _i1.DEFAULT_UNIVERSE;
        else throw B
      }
      return Q
    }
    async getUniverseDomain() {
      let A = (0, VpB.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
      try {
        A !== null && A !== void 0 || (A = (await this.getClient()).universeDomain)
      } catch (Q) {
        A !== null && A !== void 0 || (A = _i1.DEFAULT_UNIVERSE)
      }
      return A
    }
    getAnyScopes() {
      return this.scopes || this.defaultScopes
    }
    getApplicationDefault(A = {}, Q) {
      let B;
      if (typeof A === "function") Q = A;
      else B = A;
      if (Q) this.getApplicationDefaultAsync(B).then((G) => Q(null, G.credential, G.projectId), Q);
      else return this.getApplicationDefaultAsync(B)
    }
    async getApplicationDefaultAsync(A = {}) {
      if (this.cachedCredential) return await ap(this, sp, "m", ZZA).call(this, this.cachedCredential, null);
      let Q;
      if (Q = await this._tryGetApplicationCredentialsFromEnvironmentVariable(A), Q) {
        if (Q instanceof QZA.JWT) Q.scopes = this.scopes;
        else if (Q instanceof hwA.BaseExternalAccountClient) Q.scopes = this.getAnyScopes();
        return await ap(this, sp, "m", ZZA).call(this, Q)
      }
      if (Q = await this._tryGetApplicationCredentialsFromWellKnownFile(A), Q) {
        if (Q instanceof QZA.JWT) Q.scopes = this.scopes;
        else if (Q instanceof hwA.BaseExternalAccountClient) Q.scopes = this.getAnyScopes();
        return await ap(this, sp, "m", ZZA).call(this, Q)
      }
      if (await this._checkIsGCE()) return A.scopes = this.getAnyScopes(), await ap(this, sp, "m", ZZA).call(this, new fp6.Compute(A));
      throw Error(LD.GoogleAuthExceptionMessages.NO_ADC_FOUND)
    }
    async _checkIsGCE() {
      if (this.checkIsGCE === void 0) this.checkIsGCE = fwA.getGCPResidency() || await fwA.isAvailable();
      return this.checkIsGCE
    }
    async _tryGetApplicationCredentialsFromEnvironmentVariable(A) {
      let Q = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials;
      if (!Q || Q.length === 0) return null;
      try {
        return this._getApplicationCredentialsFromFilePath(Q, A)
      } catch (B) {
        if (B instanceof Error) B.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${B.message}`;
        throw B
      }
    }
    async _tryGetApplicationCredentialsFromWellKnownFile(A) {
      let Q = null;
      if (this._isWindows()) Q = process.env.APPDATA;
      else {
        let G = process.env.HOME;
        if (G) Q = ki1.join(G, ".config")
      }
      if (Q) {
        if (Q = ki1.join(Q, "gcloud", "application_default_credentials.json"), !gwA.existsSync(Q)) Q = null
      }
      if (!Q) return null;
      return await this._getApplicationCredentialsFromFilePath(Q, A)
    }
    async _getApplicationCredentialsFromFilePath(A, Q = {}) {
      if (!A || A.length === 0) throw Error("The file path is invalid.");
      try {
        if (A = gwA.realpathSync(A), !gwA.lstatSync(A).isFile()) throw Error()
      } catch (G) {
        if (G instanceof Error) G.message = `The file at ${A} does not exist, or it is not a file. ${G.message}`;
        throw G
      }
      let B = gwA.createReadStream(A);
      return this.fromStream(B, Q)
    }
    fromImpersonatedJSON(A) {
      var Q, B, G, Z;
      if (!A) throw Error("Must pass in a JSON object containing an  impersonated refresh token");
      if (A.type !== BZA.IMPERSONATED_ACCOUNT_TYPE) throw Error(`The incoming JSON object does not have the "${BZA.IMPERSONATED_ACCOUNT_TYPE}" type`);
      if (!A.source_credentials) throw Error("The incoming JSON object does not contain a source_credentials field");
      if (!A.service_account_impersonation_url) throw Error("The incoming JSON object does not contain a service_account_impersonation_url field");
      let I = this.fromJSON(A.source_credentials);
      if (((Q = A.service_account_impersonation_url) === null || Q === void 0 ? void 0 : Q.length) > 256) throw RangeError(`Target principal is too long: ${A.service_account_impersonation_url}`);
      let Y = (G = (B = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(A.service_account_impersonation_url)) === null || B === void 0 ? void 0 : B.groups) === null || G === void 0 ? void 0 : G.target;
      if (!Y) throw RangeError(`Cannot extract target principal from ${A.service_account_impersonation_url}`);
      let J = (Z = this.getAnyScopes()) !== null && Z !== void 0 ? Z : [];
      return new BZA.Impersonated({
        ...A,
        sourceClient: I,
        targetPrincipal: Y,
        targetScopes: Array.isArray(J) ? J : [J]
      })
    }
    fromJSON(A, Q = {}) {
      let B, G = (0, VpB.originalOrCamelOptions)(Q).get("universe_domain");
      if (A.type === WpB.USER_REFRESH_ACCOUNT_TYPE) B = new WpB.UserRefreshClient(Q), B.fromJSON(A);
      else if (A.type === BZA.IMPERSONATED_ACCOUNT_TYPE) B = this.fromImpersonatedJSON(A);
      else if (A.type === hwA.EXTERNAL_ACCOUNT_TYPE) B = up6.ExternalAccountClient.fromJSON(A, Q), B.scopes = this.getAnyScopes();
      else if (A.type === XpB.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) B = new XpB.ExternalAccountAuthorizedUserClient(A, Q);
      else Q.scopes = this.scopes, B = new QZA.JWT(Q), this.setGapicJWTValues(B), B.fromJSON(A);
      if (G) B.universeDomain = G;
      return B
    }
    _cacheClientFromJSON(A, Q) {
      let B = this.fromJSON(A, Q);
      return this.jsonContent = A, this.cachedCredential = B, B
    }
    fromStream(A, Q = {}, B) {
      let G = {};
      if (typeof Q === "function") B = Q;
      else G = Q;
      if (B) this.fromStreamAsync(A, G).then((Z) => B(null, Z), B);
      else return this.fromStreamAsync(A, G)
    }
    fromStreamAsync(A, Q) {
      return new Promise((B, G) => {
        if (!A) throw Error("Must pass in a stream containing the Google auth settings.");
        let Z = [];
        A.setEncoding("utf8").on("error", G).on("data", (I) => Z.push(I)).on("end", () => {
          try {
            try {
              let I = JSON.parse(Z.join("")),
                Y = this._cacheClientFromJSON(I, Q);
              return B(Y)
            } catch (I) {
              if (!this.keyFilename) throw I;
              let Y = new QZA.JWT({
                ...this.clientOptions,
                keyFile: this.keyFilename
              });
              return this.cachedCredential = Y, this.setGapicJWTValues(Y), B(Y)
            }
          } catch (I) {
            return G(I)
          }
        })
      })
    }
    fromAPIKey(A, Q = {}) {
      return new QZA.JWT({
        ...Q,
        apiKey: A
      })
    }
    _isWindows() {
      let A = xp6.platform();
      if (A && A.length >= 3) {
        if (A.substring(0, 3).toLowerCase() === "win") return !0
      }
      return !1
    }
    async getDefaultServiceProjectId() {
      return new Promise((A) => {
        (0, yp6.exec)("gcloud config config-helper --format json", (Q, B) => {
          if (!Q && B) try {
            let G = JSON.parse(B).configuration.properties.core.project;
            A(G);
            return
          } catch (G) {}
          A(null)
        })
      })
    }
    getProductionProjectId() {
      return process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project
    }
    async getFileProjectId() {
      if (this.cachedCredential) return this.cachedCredential.projectId;
      if (this.keyFilename) {
        let Q = await this.getClient();
        if (Q && Q.projectId) return Q.projectId
      }
      let A = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
      if (A) return A.projectId;
      else return null
    }
    async getExternalAccountClientProjectId() {
      if (!this.jsonContent || this.jsonContent.type !== hwA.EXTERNAL_ACCOUNT_TYPE) return null;
      return await (await this.getClient()).getProjectId()
    }
    async getGCEProjectId() {
      try {
        return await fwA.project("project-id")
      } catch (A) {
        return null
      }
    }
    getCredentials(A) {
      if (A) this.getCredentialsAsync().then((Q) => A(null, Q), A);
      else return this.getCredentialsAsync()
    }
    async getCredentialsAsync() {
      let A = await this.getClient();
      if (A instanceof BZA.Impersonated) return {
        client_email: A.getTargetPrincipal()
      };
      if (A instanceof hwA.BaseExternalAccountClient) {
        let Q = A.getServiceAccountEmail();
        if (Q) return {
          client_email: Q,
          universe_domain: A.universeDomain
        }
      }
      if (this.jsonContent) return {
        client_email: this.jsonContent.client_email,
        private_key: this.jsonContent.private_key,
        universe_domain: this.jsonContent.universe_domain
      };
      if (await this._checkIsGCE()) {
        let [Q, B] = await Promise.all([fwA.instance("service-accounts/default/email"), this.getUniverseDomain()]);
        return {
          client_email: Q,
          universe_domain: B
        }
      }
      throw Error(LD.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND)
    }
    async getClient() {
      if (this.cachedCredential) return this.cachedCredential;
      JpB(this, GZA, ap(this, GZA, "f") || ap(this, sp, "m", FpB).call(this), "f");
      try {
        return await ap(this, GZA, "f")
      } finally {
        JpB(this, GZA, null, "f")
      }
    }
    async getIdTokenClient(A) {
      let Q = await this.getClient();
      if (!("fetchIdToken" in Q)) throw Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
      return new hp6.IdTokenClient({
        targetAudience: A,
        idTokenProvider: Q
      })
    }
    async getAccessToken() {
      return (await (await this.getClient()).getAccessToken()).token
    }
    async getRequestHeaders(A) {
      return (await this.getClient()).getRequestHeaders(A)
    }
    async authorizeRequest(A) {
      A = A || {};
      let Q = A.url || A.uri,
        G = await (await this.getClient()).getRequestHeaders(Q);
      return A.headers = Object.assign(A.headers || {}, G), A
    }
    async request(A) {
      return (await this.getClient()).request(A)
    }
    getEnv() {
      return (0, gp6.getEnv)()
    }
    async sign(A, Q) {
      let B = await this.getClient(),
        G = await this.getUniverseDomain();
      if (Q = Q || `https://iamcredentials.${G}/v1/projects/-/serviceAccounts/`, B instanceof BZA.Impersonated) return (await B.sign(A)).signedBlob;
      let Z = (0, vp6.createCrypto)();
      if (B instanceof QZA.JWT && B.key) return await Z.sign(B.key, A);
      let I = await this.getCredentials();
      if (!I.client_email) throw Error("Cannot sign data without `client_email`.");
      return this.signBlob(Z, I.client_email, A, Q)
    }
    async signBlob(A, Q, B, G) {
      let Z = new URL(G + `${Q}:signBlob`);
      return (await this.request({
        method: "POST",
        url: Z.href,
        data: {
          payload: A.encodeBase64StringUtf8(B)
        },
        retry: !0,
        retryConfig: {
          httpMethodsToRetry: ["POST"]
        }
      })).data.signedBlob
    }
  }
  LD.GoogleAuth = yi1;
  GZA = new WeakMap, sp = new WeakSet, ZZA = async function(Q, B = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || null) {
    let G = await this.getProjectIdOptional();
    if (B) Q.quotaProjectId = B;
    return this.cachedCredential = Q, {
      credential: Q,
      projectId: G
    }
  }, FpB = async function() {
    if (this.jsonContent) return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
    else if (this.keyFilename) {
      let Q = ki1.resolve(this.keyFilename),
        B = gwA.createReadStream(Q);
      return await this.fromStreamAsync(B, this.clientOptions)
    } else if (this.apiKey) {
      let Q = await this.fromAPIKey(this.apiKey, this.clientOptions);
      Q.scopes = this.scopes;
      let {
        credential: B
      } = await ap(this, sp, "m", ZZA).call(this, Q);
      return B
    } else {
      let {
        credential: Q
      } = await this.getApplicationDefaultAsync(this.clientOptions);
      return Q
    }
  };
  yi1.DefaultTransporter = bp6.DefaultTransporter
})
// @from(Start 7811492, End 7811909)
EpB = z((HpB) => {
  Object.defineProperty(HpB, "__esModule", {
    value: !0
  });
  HpB.IAMAuth = void 0;
  class DpB {
    constructor(A, Q) {
      this.selector = A, this.token = Q, this.selector = A, this.token = Q
    }
    getRequestHeaders() {
      return {
        "x-goog-iam-authority-selector": this.selector,
        "x-goog-iam-authorization-token": this.token
      }
    }
  }
  HpB.IAMAuth = DpB
})
// @from(Start 7811915, End 7816229)
wpB = z((UpB) => {
  Object.defineProperty(UpB, "__esModule", {
    value: !0
  });
  UpB.DownscopedClient = UpB.EXPIRATION_TIME_OFFSET = UpB.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
  var mp6 = UA("stream"),
    dp6 = Gk(),
    cp6 = Bi1(),
    pp6 = "urn:ietf:params:oauth:grant-type:token-exchange",
    lp6 = "urn:ietf:params:oauth:token-type:access_token",
    ip6 = "urn:ietf:params:oauth:token-type:access_token";
  UpB.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
  UpB.EXPIRATION_TIME_OFFSET = 300000;
  class zpB extends dp6.AuthClient {
    constructor(A, Q, B, G) {
      super({
        ...B,
        quotaProjectId: G
      });
      if (this.authClient = A, this.credentialAccessBoundary = Q, Q.accessBoundary.accessBoundaryRules.length === 0) throw Error("At least one access boundary rule needs to be defined.");
      else if (Q.accessBoundary.accessBoundaryRules.length > UpB.MAX_ACCESS_BOUNDARY_RULES_COUNT) throw Error(`The provided access boundary has more than ${UpB.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
      for (let Z of Q.accessBoundary.accessBoundaryRules)
        if (Z.availablePermissions.length === 0) throw Error("At least one permission should be defined in access boundary rules.");
      this.stsCredential = new cp6.StsCredentials(`https://sts.${this.universeDomain}/v1/token`), this.cachedDownscopedAccessToken = null
    }
    setCredentials(A) {
      if (!A.expiry_date) throw Error("The access token expiry_date field is missing in the provided credentials.");
      super.setCredentials(A), this.cachedDownscopedAccessToken = A
    }
    async getAccessToken() {
      if (!this.cachedDownscopedAccessToken || this.isExpired(this.cachedDownscopedAccessToken)) await this.refreshAccessTokenAsync();
      return {
        token: this.cachedDownscopedAccessToken.access_token,
        expirationTime: this.cachedDownscopedAccessToken.expiry_date,
        res: this.cachedDownscopedAccessToken.res
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
            Y = Z.config.data instanceof mp6.Readable;
          if (!Q && (I === 401 || I === 403) && !Y && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
        }
        throw G
      }
      return B
    }
    async refreshAccessTokenAsync() {
      var A;
      let Q = (await this.authClient.getAccessToken()).token,
        B = {
          grantType: pp6,
          requestedTokenType: lp6,
          subjectToken: Q,
          subjectTokenType: ip6
        },
        G = await this.stsCredential.exchangeToken(B, void 0, this.credentialAccessBoundary),
        Z = ((A = this.authClient.credentials) === null || A === void 0 ? void 0 : A.expiry_date) || null,
        I = G.expires_in ? new Date().getTime() + G.expires_in * 1000 : Z;
      return this.cachedDownscopedAccessToken = {
        access_token: G.access_token,
        expiry_date: I,
        res: G.res
      }, this.credentials = {}, Object.assign(this.credentials, this.cachedDownscopedAccessToken), delete this.credentials.res, this.emit("tokens", {
        refresh_token: null,
        expiry_date: this.cachedDownscopedAccessToken.expiry_date,
        access_token: this.cachedDownscopedAccessToken.access_token,
        token_type: "Bearer",
        id_token: null
      }), this.cachedDownscopedAccessToken
    }
    isExpired(A) {
      let Q = new Date().getTime();
      return A.expiry_date ? Q >= A.expiry_date - this.eagerRefreshThresholdMillis : !1
    }
  }
  UpB.DownscopedClient = zpB
})
// @from(Start 7816235, End 7816664)
LpB = z((qpB) => {
  Object.defineProperty(qpB, "__esModule", {
    value: !0
  });
  qpB.PassThroughClient = void 0;
  var ap6 = Gk();
  class vi1 extends ap6.AuthClient {
    async request(A) {
      return this.transporter.request(A)
    }
    async getAccessToken() {
      return {}
    }
    async getRequestHeaders() {
      return {}
    }
  }
  qpB.PassThroughClient = vi1;
  var sp6 = new vi1;
  sp6.getAccessToken()
})
// @from(Start 7816670, End 7821131)
fi1 = z((VZ) => {
  Object.defineProperty(VZ, "__esModule", {
    value: !0
  });
  VZ.GoogleAuth = VZ.auth = VZ.DefaultTransporter = VZ.PassThroughClient = VZ.ExecutableError = VZ.PluggableAuthClient = VZ.DownscopedClient = VZ.BaseExternalAccountClient = VZ.ExternalAccountClient = VZ.IdentityPoolClient = VZ.AwsRequestSigner = VZ.AwsClient = VZ.UserRefreshClient = VZ.LoginTicket = VZ.ClientAuthentication = VZ.OAuth2Client = VZ.CodeChallengeMethod = VZ.Impersonated = VZ.JWT = VZ.JWTAccess = VZ.IdTokenClient = VZ.IAMAuth = VZ.GCPEnv = VZ.Compute = VZ.DEFAULT_UNIVERSE = VZ.AuthClient = VZ.gaxios = VZ.gcpMetadata = void 0;
  var MpB = KpB();
  Object.defineProperty(VZ, "GoogleAuth", {
    enumerable: !0,
    get: function() {
      return MpB.GoogleAuth
    }
  });
  VZ.gcpMetadata = RwA();
  VZ.gaxios = PT();
  var OpB = Gk();
  Object.defineProperty(VZ, "AuthClient", {
    enumerable: !0,
    get: function() {
      return OpB.AuthClient
    }
  });
  Object.defineProperty(VZ, "DEFAULT_UNIVERSE", {
    enumerable: !0,
    get: function() {
      return OpB.DEFAULT_UNIVERSE
    }
  });
  var rp6 = kl1();
  Object.defineProperty(VZ, "Compute", {
    enumerable: !0,
    get: function() {
      return rp6.Compute
    }
  });
  var op6 = xl1();
  Object.defineProperty(VZ, "GCPEnv", {
    enumerable: !0,
    get: function() {
      return op6.GCPEnv
    }
  });
  var tp6 = EpB();
  Object.defineProperty(VZ, "IAMAuth", {
    enumerable: !0,
    get: function() {
      return tp6.IAMAuth
    }
  });
  var ep6 = yl1();
  Object.defineProperty(VZ, "IdTokenClient", {
    enumerable: !0,
    get: function() {
      return ep6.IdTokenClient
    }
  });
  var Al6 = sl1();
  Object.defineProperty(VZ, "JWTAccess", {
    enumerable: !0,
    get: function() {
      return Al6.JWTAccess
    }
  });
  var Ql6 = ol1();
  Object.defineProperty(VZ, "JWT", {
    enumerable: !0,
    get: function() {
      return Ql6.JWT
    }
  });
  var Bl6 = el1();
  Object.defineProperty(VZ, "Impersonated", {
    enumerable: !0,
    get: function() {
      return Bl6.Impersonated
    }
  });
  var bi1 = $e();
  Object.defineProperty(VZ, "CodeChallengeMethod", {
    enumerable: !0,
    get: function() {
      return bi1.CodeChallengeMethod
    }
  });
  Object.defineProperty(VZ, "OAuth2Client", {
    enumerable: !0,
    get: function() {
      return bi1.OAuth2Client
    }
  });
  Object.defineProperty(VZ, "ClientAuthentication", {
    enumerable: !0,
    get: function() {
      return bi1.ClientAuthentication
    }
  });
  var Gl6 = jl1();
  Object.defineProperty(VZ, "LoginTicket", {
    enumerable: !0,
    get: function() {
      return Gl6.LoginTicket
    }
  });
  var Zl6 = tl1();
  Object.defineProperty(VZ, "UserRefreshClient", {
    enumerable: !0,
    get: function() {
      return Zl6.UserRefreshClient
    }
  });
  var Il6 = zi1();
  Object.defineProperty(VZ, "AwsClient", {
    enumerable: !0,
    get: function() {
      return Il6.AwsClient
    }
  });
  var Yl6 = Hi1();
  Object.defineProperty(VZ, "AwsRequestSigner", {
    enumerable: !0,
    get: function() {
      return Yl6.AwsRequestSigner
    }
  });
  var Jl6 = Di1();
  Object.defineProperty(VZ, "IdentityPoolClient", {
    enumerable: !0,
    get: function() {
      return Jl6.IdentityPoolClient
    }
  });
  var Wl6 = ji1();
  Object.defineProperty(VZ, "ExternalAccountClient", {
    enumerable: !0,
    get: function() {
      return Wl6.ExternalAccountClient
    }
  });
  var Xl6 = np();
  Object.defineProperty(VZ, "BaseExternalAccountClient", {
    enumerable: !0,
    get: function() {
      return Xl6.BaseExternalAccountClient
    }
  });
  var Vl6 = wpB();
  Object.defineProperty(VZ, "DownscopedClient", {
    enumerable: !0,
    get: function() {
      return Vl6.DownscopedClient
    }
  });
  var RpB = yeA();
  Object.defineProperty(VZ, "PluggableAuthClient", {
    enumerable: !0,
    get: function() {
      return RpB.PluggableAuthClient
    }
  });
  Object.defineProperty(VZ, "ExecutableError", {
    enumerable: !0,
    get: function() {
      return RpB.ExecutableError
    }
  });
  var Fl6 = LpB();
  Object.defineProperty(VZ, "PassThroughClient", {
    enumerable: !0,
    get: function() {
      return Fl6.PassThroughClient
    }
  });
  var Kl6 = PwA();
  Object.defineProperty(VZ, "DefaultTransporter", {
    enumerable: !0,
    get: function() {
      return Kl6.DefaultTransporter
    }
  });
  var Dl6 = new MpB.GoogleAuth;
  VZ.auth = Dl6
})
// @from(Start 7821137, End 7821337)
xeA = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Start 7821343, End 7821368)
TpB = L(() => {
  pC()
})
// @from(Start 7821371, End 7821455)
function veA(A) {
  return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Start 7821460, End 7821502)
hi1 = (A) => (hi1 = Array.isArray, hi1(A))
// @from(Start 7821506, End 7821509)
gi1
// @from(Start 7821515, End 7821554)
ui1 = L(() => {
  TpB();
  gi1 = hi1
})
// @from(Start 7821557, End 7822188)
function* Ul6(A) {
  if (!A) return;
  if (PpB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let I of Z) yield [I, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (gi1(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let I = gi1(G[1]) ? G[1] : [G[1]],
      Y = !1;
    for (let J of I) {
      if (J === void 0) continue;
      if (Q && !Y) Y = !0, yield [Z, null];
      yield [Z, J]
    }
  }
}
// @from(Start 7822193, End 7822196)
PpB
// @from(Start 7822198, End 7822556)
jpB = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [I, Y] of Ul6(G)) {
      let J = I.toLowerCase();
      if (!Z.has(J)) Q.delete(I), Z.add(J);
      if (Y === null) Q.delete(I), B.add(J);
      else Q.append(I, Y), B.delete(J)
    }
  }
  return {
    [PpB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Start 7822562, End 7822640)
SpB = L(() => {
  ui1();
  PpB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Start 7822643, End 7822712)
function ql6(A) {
  let Q = new Gq(A);
  return delete Q.batches, Q
}
// @from(Start 7822714, End 7822792)
function Nl6(A) {
  let Q = new pH(A);
  return delete Q.messages.batches, Q
}
// @from(Start 7822797, End 7822800)
_pB
// @from(Start 7822802, End 7822827)
$l6 = "vertex-2023-10-16"
// @from(Start 7822831, End 7822834)
wl6
// @from(Start 7822836, End 7822839)
beA
// @from(Start 7822845, End 7825805)
mi1 = L(() => {
  Hf();
  a$A();
  ui1();
  SpB();
  Hf();
  _pB = BA(fi1(), 1), wl6 = new Set(["/v1/messages", "/v1/messages?beta=true"]);
  beA = class beA extends FG {
    constructor({
      baseURL: A = xeA("ANTHROPIC_VERTEX_BASE_URL"),
      region: Q = xeA("CLOUD_ML_REGION") ?? null,
      projectId: B = xeA("ANTHROPIC_VERTEX_PROJECT_ID") ?? null,
      ...G
    } = {}) {
      if (!Q) throw Error("No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.");
      super({
        baseURL: A || (Q === "global" ? "https://aiplatform.googleapis.com/v1" : `https://${Q}-aiplatform.googleapis.com/v1`),
        ...G
      });
      if (this.messages = ql6(this), this.beta = Nl6(this), this.region = Q, this.projectId = B, this.accessToken = G.accessToken ?? null, G.authClient && G.googleAuth) throw Error("You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.");
      else if (G.authClient) this._authClientPromise = Promise.resolve(G.authClient);
      else this._auth = G.googleAuth ?? new _pB.GoogleAuth({
        scopes: "https://www.googleapis.com/auth/cloud-platform"
      }), this._authClientPromise = this._auth.getClient()
    }
    validateHeaders() {}
    async prepareOptions(A) {
      let Q = await this._authClientPromise,
        B = await Q.getRequestHeaders(),
        G = Q.projectId ?? B["x-goog-user-project"];
      if (!this.projectId && G) this.projectId = G;
      A.headers = jpB([B, A.headers])
    }
    async buildRequest(A) {
      if (veA(A.body)) A.body = {
        ...A.body
      };
      if (veA(A.body)) {
        if (!A.body.anthropic_version) A.body.anthropic_version = $l6
      }
      if (wl6.has(A.path) && A.method === "post") {
        if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
        if (!veA(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
        let Q = A.body.model;
        A.body.model = void 0;
        let G = A.body.stream ?? !1 ? "streamRawPredict" : "rawPredict";
        A.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/${Q}:${G}`
      }
      if (A.path === "/v1/messages/count_tokens" || A.path == "/v1/messages/count_tokens?beta=true" && A.method === "post") {
        if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
        A.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/count-tokens:rawPredict`
      }
      return super.buildRequest(A)
    }
  }
})
// @from(Start 7825811, End 7825846)
kpB = L(() => {
  mi1();
  mi1()
})
// @from(Start 7825852, End 7825866)
feA = "4.10.1"
// @from(Start 7825870, End 7825914)
ci1 = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
// @from(Start 7825918, End 7825932)
ypB = "common"
// @from(Start 7825936, End 7825939)
di1
// @from(Start 7825941, End 7825944)
uwA
// @from(Start 7825946, End 7825979)
xpB = "login.microsoftonline.com"
// @from(Start 7825983, End 7825986)
vpB
// @from(Start 7825988, End 7825999)
bpB = "cae"
// @from(Start 7826003, End 7826016)
fpB = "nocae"
// @from(Start 7826020, End 7826038)
hpB = "msal.cache"
// @from(Start 7826044, End 7826365)
IZA = L(() => {
  (function(A) {
    A.AzureChina = "https://login.chinacloudapi.cn", A.AzureGermany = "https://login.microsoftonline.de", A.AzureGovernment = "https://login.microsoftonline.us", A.AzurePublicCloud = "https://login.microsoftonline.com"
  })(di1 || (di1 = {}));
  uwA = di1.AzurePublicCloud, vpB = ["*"]
})
// @from(Start 7826368, End 7828201)
function Ll6(A) {
  var Q, B, G, Z, I, Y, J;
  let W = {
    cache: {},
    broker: {
      isEnabled: (B = (Q = A.brokerOptions) === null || Q === void 0 ? void 0 : Q.enabled) !== null && B !== void 0 ? B : !1,
      enableMsaPassthrough: (Z = (G = A.brokerOptions) === null || G === void 0 ? void 0 : G.legacyEnableMsaPassthrough) !== null && Z !== void 0 ? Z : !1,
      parentWindowHandle: (I = A.brokerOptions) === null || I === void 0 ? void 0 : I.parentWindowHandle
    }
  };
  if ((Y = A.tokenCachePersistenceOptions) === null || Y === void 0 ? void 0 : Y.enabled) {
    if (pi1 === void 0) throw Error(["Persistent token caching was requested, but no persistence provider was configured.", "You must install the identity-cache-persistence plugin package (`npm install --save @azure/identity-cache-persistence`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(cachePersistencePlugin)` before using `tokenCachePersistenceOptions`."].join(" "));
    let X = A.tokenCachePersistenceOptions.name || hpB;
    W.cache.cachePlugin = pi1(Object.assign({
      name: `${X}.${fpB}`
    }, A.tokenCachePersistenceOptions)), W.cache.cachePluginCae = pi1(Object.assign({
      name: `${X}.${bpB}`
    }, A.tokenCachePersistenceOptions))
  }
  if ((J = A.brokerOptions) === null || J === void 0 ? void 0 : J.enabled) {
    if (gpB === void 0) throw Error(["Broker for WAM was requested to be enabled, but no native broker was configured.", "You must install the identity-broker plugin package (`npm install --save @azure/identity-broker`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(createNativeBrokerPlugin())` before using `enableBroker`."].join(" "));
    W.broker.nativeBrokerPlugin = gpB.broker
  }
  return W
}
// @from(Start 7828206, End 7828218)
pi1 = void 0
// @from(Start 7828222, End 7828234)
gpB = void 0
// @from(Start 7828238, End 7828241)
upB
// @from(Start 7828247, End 7828325)
mpB = L(() => {
  IZA();
  upB = {
    generatePluginConfiguration: Ll6
  }
})
// @from(Start 7828434, End 7828509)
function cpB(A, ...Q) {
  dpB.stderr.write(`${Ol6.format(A,...Q)}${Ml6}`)
}
// @from(Start 7828514, End 7828528)
ppB = () => {}
// @from(Start 7828531, End 7828838)
function ni1(A) {
  ipB = A, li1 = [], ii1 = [];
  let Q = /\*/g,
    B = A.split(",").map((G) => G.trim().replace(Q, ".*?"));
  for (let G of B)
    if (G.startsWith("-")) ii1.push(new RegExp(`^${G.substr(1)}$`));
    else li1.push(new RegExp(`^${G}$`));
  for (let G of heA) G.enabled = ai1(G.namespace)
}
// @from(Start 7828840, End 7829007)
function ai1(A) {
  if (A.endsWith("*")) return !0;
  for (let Q of ii1)
    if (Q.test(A)) return !1;
  for (let Q of li1)
    if (Q.test(A)) return !0;
  return !1
}
// @from(Start 7829009, End 7829068)
function Rl6() {
  let A = ipB || "";
  return ni1(""), A
}
// @from(Start 7829070, End 7829354)
function apB(A) {
  let Q = Object.assign(B, {
    enabled: ai1(A),
    destroy: Tl6,
    log: npB.log,
    namespace: A,
    extend: Pl6
  });

  function B(...G) {
    if (!Q.enabled) return;
    if (G.length > 0) G[0] = `${A} ${G[0]}`;
    Q.log(...G)
  }
  return heA.push(Q), Q
}
// @from(Start 7829356, End 7829458)
function Tl6() {
  let A = heA.indexOf(this);
  if (A >= 0) return heA.splice(A, 1), !0;
  return !1
}
// @from(Start 7829460, End 7829549)
function Pl6(A) {
  let Q = apB(`${this.namespace}:${A}`);
  return Q.log = this.log, Q
}
// @from(Start 7829554, End 7829557)
lpB
// @from(Start 7829559, End 7829562)
ipB
// @from(Start 7829564, End 7829567)
li1
// @from(Start 7829569, End 7829572)
ii1
// @from(Start 7829574, End 7829577)
heA
// @from(Start 7829579, End 7829582)
npB
// @from(Start 7829584, End 7829587)
YZA
// @from(Start 7829593, End 7829887)
spB = L(() => {
  ppB();
  lpB = typeof process < "u" && process.env && process.env.DEBUG || void 0, li1 = [], ii1 = [], heA = [];
  if (lpB) ni1(lpB);
  npB = Object.assign((A) => {
    return apB(A)
  }, {
    enable: ni1,
    enabled: ai1,
    disable: Rl6,
    log: cpB
  });
  YZA = npB
})
// @from(Start 7829890, End 7829954)
function opB(A, Q) {
  Q.log = (...B) => {
    A.log(...B)
  }
}
// @from(Start 7829956, End 7830000)
function tpB(A) {
  return si1.includes(A)
}
// @from(Start 7830002, End 7831231)
function geA(A) {
  let Q = new Set,
    B = typeof process < "u" && process.env && process.env[A.logLevelEnvVarName] || void 0,
    G, Z = YZA(A.namespace);
  Z.log = (...V) => {
    YZA.log(...V)
  };

  function I(V) {
    if (V && !tpB(V)) throw Error(`Unknown log level '${V}'. Acceptable values: ${si1.join(",")}`);
    G = V;
    let F = [];
    for (let K of Q)
      if (Y(K)) F.push(K.namespace);
    YZA.enable(F.join(","))
  }
  if (B)
    if (tpB(B)) I(B);
    else console.error(`${A.logLevelEnvVarName} set to unknown log level '${B}'; logging is not enabled. Acceptable values: ${si1.join(", ")}.`);

  function Y(V) {
    return Boolean(G && rpB[V.level] <= rpB[G])
  }

  function J(V, F) {
    let K = Object.assign(V.extend(F), {
      level: F
    });
    if (opB(V, K), Y(K)) {
      let D = YZA.disable();
      YZA.enable(D + "," + K.namespace)
    }
    return Q.add(K), K
  }

  function W() {
    return G
  }

  function X(V) {
    let F = Z.extend(V);
    return opB(Z, F), {
      error: J(F, "error"),
      warning: J(F, "warning"),
      info: J(F, "info"),
      verbose: J(F, "verbose")
    }
  }
  return {
    setLogLevel: I,
    getLogLevel: W,
    createClientLogger: X,
    logger: Z
  }
}
// @from(Start 7831233, End 7831287)
function ueA(A) {
  return epB.createClientLogger(A)
}
// @from(Start 7831292, End 7831295)
si1
// @from(Start 7831297, End 7831300)
rpB
// @from(Start 7831302, End 7831305)
epB
// @from(Start 7831307, End 7831310)
E6G
// @from(Start 7831316, End 7831595)
meA = L(() => {
  spB();
  si1 = ["verbose", "info", "warning", "error"], rpB = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100
  };
  epB = geA({
    logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
    namespace: "typeSpecRuntime"
  }), E6G = epB.logger
})
// @from(Start 7831601, End 7831627)
AlB = L(() => {
  meA()
})
// @from(Start 7831630, End 7831675)
function deA() {
  return ri1.getLogLevel()
}
// @from(Start 7831677, End 7831730)
function rp(A) {
  return ri1.createClientLogger(A)
}
// @from(Start 7831735, End 7831738)
ri1
// @from(Start 7831740, End 7831743)
q6G
// @from(Start 7831749, End 7831878)
qe = L(() => {
  AlB();
  ri1 = geA({
    logLevelEnvVarName: "AZURE_LOG_LEVEL",
    namespace: "azure"
  }), q6G = ri1.logger
})
// @from(Start 7831881, End 7832061)
function ceA(A) {
  return A.reduce((Q, B) => {
    if (process.env[B]) Q.assigned.push(B);
    else Q.missing.push(B);
    return Q
  }, {
    missing: [],
    assigned: []
  })
}
// @from(Start 7832063, End 7832145)
function mF(A) {
  return `SUCCESS. Scopes: ${Array.isArray(A)?A.join(", "):A}.`
}
// @from(Start 7832147, End 7832362)
function d7(A, Q) {
  let B = "ERROR.";
  if (A === null || A === void 0 ? void 0 : A.length) B += ` Scopes: ${Array.isArray(A)?A.join(", "):A}.`;
  return `${B} Error message: ${typeof Q==="string"?Q:Q.message}.`
}
// @from(Start 7832364, End 7832739)
function QlB(A, Q, B = RM) {
  let G = Q ? `${Q.fullTitle} ${A}` : A;

  function Z(W) {
    B.info(`${G} =>`, W)
  }

  function I(W) {
    B.warning(`${G} =>`, W)
  }

  function Y(W) {
    B.verbose(`${G} =>`, W)
  }

  function J(W) {
    B.error(`${G} =>`, W)
  }
  return {
    title: A,
    fullTitle: G,
    info: Z,
    warning: I,
    verbose: Y,
    error: J
  }
}
// @from(Start 7832741, End 7832904)
function W7(A, Q = RM) {
  let B = QlB(A, void 0, Q);
  return Object.assign(Object.assign({}, B), {
    parent: Q,
    getToken: QlB("=> getToken()", B, Q)
  })
}
// @from(Start 7832909, End 7832911)
RM
// @from(Start 7832917, End 7832964)
jW = L(() => {
  qe();
  RM = rp("identity")
})
// @from(Start 7832967, End 7833071)
function jl6(A) {
  return A && typeof A.error === "string" && typeof A.error_description === "string"
}
// @from(Start 7833073, End 7833290)
function BlB(A) {
  return {
    error: A.error,
    errorDescription: A.error_description,
    correlationId: A.correlation_id,
    errorCodes: A.error_codes,
    timestamp: A.timestamp,
    traceId: A.trace_id
  }
}
// @from(Start 7833295, End 7833329)
Sl6 = "CredentialUnavailableError"
// @from(Start 7833333, End 7833335)
p9
// @from(Start 7833337, End 7833364)
oi1 = "AuthenticationError"
// @from(Start 7833368, End 7833371)
mwA
// @from(Start 7833373, End 7833409)
_l6 = "AggregateAuthenticationError"
// @from(Start 7833413, End 7833416)
ti1
// @from(Start 7833418, End 7833420)
Pf
// @from(Start 7833426, End 7834944)
DE = L(() => {
  p9 = class p9 extends Error {
    constructor(A, Q) {
      super(A, Q);
      this.name = Sl6
    }
  };
  mwA = class mwA extends Error {
    constructor(A, Q, B) {
      let G = {
        error: "unknown",
        errorDescription: "An unknown error occurred and no additional details are available."
      };
      if (jl6(Q)) G = BlB(Q);
      else if (typeof Q === "string") try {
        let Z = JSON.parse(Q);
        G = BlB(Z)
      } catch (Z) {
        if (A === 400) G = {
          error: "invalid_request",
          errorDescription: `The service indicated that the request was invalid.

${Q}`
        };
        else G = {
          error: "unknown_error",
          errorDescription: `An unknown error has occurred. Response body:

${Q}`
        }
      } else G = {
        error: "unknown_error",
        errorDescription: "An unknown error occurred and no additional details are available."
      };
      super(`${G.error} Status code: ${A}
More details:
${G.errorDescription},`, B);
      this.statusCode = A, this.errorResponse = G, this.name = oi1
    }
  };
  ti1 = class ti1 extends Error {
    constructor(A, Q) {
      let B = A.join(`
`);
      super(`${Q}
${B}`);
      this.errors = A, this.name = _l6
    }
  };
  Pf = class Pf extends Error {
    constructor(A) {
      super(A.message, A.cause ? {
        cause: A.cause
      } : void 0);
      this.scopes = A.scopes, this.getTokenOptions = A.getTokenOptions, this.name = "AuthenticationRequiredError"
    }
  }
})
// @from(Start 7834947, End 7835247)
function kl6(A) {
  return `The current credential is not configured to acquire tokens for tenant ${A}. To enable acquiring tokens for this tenant add it to the AdditionallyAllowedTenants on the credential options, or add "*" to AdditionallyAllowedTenants to allow acquiring tokens for any tenant.`
}
// @from(Start 7835249, End 7835678)
function HE(A, Q, B = [], G) {
  var Z;
  let I;
  if (process.env.AZURE_IDENTITY_DISABLE_MULTITENANTAUTH) I = A;
  else if (A === "adfs") I = A;
  else I = (Z = Q === null || Q === void 0 ? void 0 : Q.tenantId) !== null && Z !== void 0 ? Z : A;
  if (A && I !== A && !B.includes("*") && !B.some((Y) => Y.localeCompare(I) === 0)) {
    let Y = kl6(I);
    throw G === null || G === void 0 || G.info(Y), new p9(Y)
  }
  return I
}
// @from(Start 7835683, End 7835708)
GlB = L(() => {
  DE()
})
// @from(Start 7835711, End 7835998)
function qU(A, Q) {
  if (!Q.match(/^[0-9a-zA-Z-.]+$/)) {
    let B = Error("Invalid tenant id provided. You can locate your tenant id by following the instructions listed here: https://learn.microsoft.com/partner-center/find-ids-and-domain-names.");
    throw A.info(d7("", B)), B
  }
}
// @from(Start 7836000, End 7836132)
function ZlB(A, Q, B) {
  if (Q) return qU(A, Q), Q;
  if (!B) B = ci1;
  if (B !== ci1) return "common";
  return "organizations"
}
// @from(Start 7836134, End 7836237)
function NU(A) {
  if (!A || A.length === 0) return [];
  if (A.includes("*")) return vpB;
  return A
}
// @from(Start 7836242, End 7836284)
vT = L(() => {
  IZA();
  jW();
  GlB()
})
// @from(Start 7836290, End 7836299)
ei1 = "$"
// @from(Start 7836303, End 7836312)
peA = "_"
// @from(Start 7836315, End 7836621)
function yl6(A, Q) {
  return Q !== "Composite" && Q !== "Dictionary" && (typeof A === "string" || typeof A === "number" || typeof A === "boolean" || (Q === null || Q === void 0 ? void 0 : Q.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i)) !== null || A === void 0 || A === null)
}
// @from(Start 7836623, End 7836936)
function xl6(A) {
  let Q = Object.assign(Object.assign({}, A.headers), A.body);
  if (A.hasNullableType && Object.getOwnPropertyNames(Q).length === 0) return A.shouldWrapBody ? {
    body: null
  } : null;
  else return A.shouldWrapBody ? Object.assign(Object.assign({}, A.headers), {
    body: A.body
  }) : Q
}
// @from(Start 7836938, End 7838044)
function An1(A, Q) {
  var B, G;
  let Z = A.parsedHeaders;
  if (A.request.method === "HEAD") return Object.assign(Object.assign({}, Z), {
    body: A.parsedBody
  });
  let I = Q && Q.bodyMapper,
    Y = Boolean(I === null || I === void 0 ? void 0 : I.nullable),
    J = I === null || I === void 0 ? void 0 : I.type.name;
  if (J === "Stream") return Object.assign(Object.assign({}, Z), {
    blobBody: A.blobBody,
    readableStreamBody: A.readableStreamBody
  });
  let W = J === "Composite" && I.type.modelProperties || {},
    X = Object.keys(W).some((V) => W[V].serializedName === "");
  if (J === "Sequence" || X) {
    let V = (B = A.parsedBody) !== null && B !== void 0 ? B : [];
    for (let F of Object.keys(W))
      if (W[F].serializedName) V[F] = (G = A.parsedBody) === null || G === void 0 ? void 0 : G[F];
    if (Z)
      for (let F of Object.keys(Z)) V[F] = Z[F];
    return Y && !A.parsedBody && !Z && Object.getOwnPropertyNames(W).length === 0 ? null : V
  }
  return xl6({
    body: A.parsedBody,
    headers: Z,
    hasNullableType: Y,
    shouldWrapBody: yl6(A.parsedBody, J)
  })
}
// @from(Start 7838049, End 7838063)
IlB = () => {}
// @from(Start 7838069, End 7838071)
jf
// @from(Start 7838077, End 7838513)
leA = L(() => {
  jf = {
    Base64Url: "Base64Url",
    Boolean: "Boolean",
    ByteArray: "ByteArray",
    Composite: "Composite",
    Date: "Date",
    DateTime: "DateTime",
    DateTimeRfc1123: "DateTimeRfc1123",
    Dictionary: "Dictionary",
    Enum: "Enum",
    Number: "Number",
    Object: "Object",
    Sequence: "Sequence",
    String: "String",
    Stream: "Stream",
    TimeSpan: "TimeSpan",
    UnixTime: "UnixTime"
  }
})
// @from(Start 7838519, End 7838521)
op
// @from(Start 7838527, End 7838655)
ieA = L(() => {
  op = class op extends Error {
    constructor(A) {
      super(A);
      this.name = "AbortError"
    }
  }
})
// @from(Start 7838658, End 7838702)
function neA(A) {
  return A.toLowerCase()
}
// @from(Start 7838704, End 7838776)
function* vl6(A) {
  for (let Q of A.values()) yield [Q.name, Q.value]
}
// @from(Start 7838778, End 7838816)
function Zk(A) {
  return new YlB(A)
}
// @from(Start 7838821, End 7838824)
YlB
// @from(Start 7838830, End 7839749)
dwA = L(() => {
  YlB = class YlB {
    constructor(A) {
      if (this._headersMap = new Map, A)
        for (let Q of Object.keys(A)) this.set(Q, A[Q])
    }
    set(A, Q) {
      this._headersMap.set(neA(A), {
        name: A,
        value: String(Q).trim()
      })
    }
    get(A) {
      var Q;
      return (Q = this._headersMap.get(neA(A))) === null || Q === void 0 ? void 0 : Q.value
    }
    has(A) {
      return this._headersMap.has(neA(A))
    }
    delete(A) {
      this._headersMap.delete(neA(A))
    }
    toJSON(A = {}) {
      let Q = {};
      if (A.preserveCase)
        for (let B of this._headersMap.values()) Q[B.name] = B.value;
      else
        for (let [B, G] of this._headersMap) Q[B] = G.value;
      return Q
    }
    toString() {
      return JSON.stringify(this.toJSON({
        preserveCase: !0
      }))
    } [Symbol.iterator]() {
      return vl6(this._headersMap)
    }
  }
})
// @from(Start 7839755, End 7839769)
JlB = () => {}
// @from(Start 7839775, End 7839789)
WlB = () => {}
// @from(Start 7839843, End 7839876)
function cwA() {
  return fl6()
}
// @from(Start 7839881, End 7839884)
Qn1
// @from(Start 7839886, End 7839889)
fl6
// @from(Start 7839895, End 7840140)
Bn1 = L(() => {
  fl6 = typeof((Qn1 = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || Qn1 === void 0 ? void 0 : Qn1.randomUUID) === "function" ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : bl6
})
// @from(Start 7840142, End 7841213)
class XlB {
  constructor(A) {
    var Q, B, G, Z, I, Y, J;
    this.url = A.url, this.body = A.body, this.headers = (Q = A.headers) !== null && Q !== void 0 ? Q : Zk(), this.method = (B = A.method) !== null && B !== void 0 ? B : "GET", this.timeout = (G = A.timeout) !== null && G !== void 0 ? G : 0, this.multipartBody = A.multipartBody, this.formData = A.formData, this.disableKeepAlive = (Z = A.disableKeepAlive) !== null && Z !== void 0 ? Z : !1, this.proxySettings = A.proxySettings, this.streamResponseStatusCodes = A.streamResponseStatusCodes, this.withCredentials = (I = A.withCredentials) !== null && I !== void 0 ? I : !1, this.abortSignal = A.abortSignal, this.onUploadProgress = A.onUploadProgress, this.onDownloadProgress = A.onDownloadProgress, this.requestId = A.requestId || cwA(), this.allowInsecureConnection = (Y = A.allowInsecureConnection) !== null && Y !== void 0 ? Y : !1, this.enableBrowserStreams = (J = A.enableBrowserStreams) !== null && J !== void 0 ? J : !1, this.requestOverrides = A.requestOverrides, this.authSchemes = A.authSchemes
  }
}
// @from(Start 7841215, End 7841254)
function Gn1(A) {
  return new XlB(A)
}
// @from(Start 7841259, End 7841294)
VlB = L(() => {
  dwA();
  Bn1()
})
// @from(Start 7841296, End 7844931)
class aeA {
  constructor(A) {
    var Q;
    this._policies = [], this._policies = (Q = A === null || A === void 0 ? void 0 : A.slice(0)) !== null && Q !== void 0 ? Q : [], this._orderedPolicies = void 0
  }
  addPolicy(A, Q = {}) {
    if (Q.phase && Q.afterPhase) throw Error("Policies inside a phase cannot specify afterPhase.");
    if (Q.phase && !FlB.has(Q.phase)) throw Error(`Invalid phase name: ${Q.phase}`);
    if (Q.afterPhase && !FlB.has(Q.afterPhase)) throw Error(`Invalid afterPhase name: ${Q.afterPhase}`);
    this._policies.push({
      policy: A,
      options: Q
    }), this._orderedPolicies = void 0
  }
  removePolicy(A) {
    let Q = [];
    return this._policies = this._policies.filter((B) => {
      if (A.name && B.policy.name === A.name || A.phase && B.options.phase === A.phase) return Q.push(B.policy), !1;
      else return !0
    }), this._orderedPolicies = void 0, Q
  }
  sendRequest(A, Q) {
    return this.getOrderedPolicies().reduceRight((Z, I) => {
      return (Y) => {
        return I.sendRequest(Y, Z)
      }
    }, (Z) => A.sendRequest(Z))(Q)
  }
  getOrderedPolicies() {
    if (!this._orderedPolicies) this._orderedPolicies = this.orderPolicies();
    return this._orderedPolicies
  }
  clone() {
    return new aeA(this._policies)
  }
  static create() {
    return new aeA
  }
  orderPolicies() {
    let A = [],
      Q = new Map;

    function B(D) {
      return {
        name: D,
        policies: new Set,
        hasRun: !1,
        hasAfterPolicies: !1
      }
    }
    let G = B("Serialize"),
      Z = B("None"),
      I = B("Deserialize"),
      Y = B("Retry"),
      J = B("Sign"),
      W = [G, Z, I, Y, J];

    function X(D) {
      if (D === "Retry") return Y;
      else if (D === "Serialize") return G;
      else if (D === "Deserialize") return I;
      else if (D === "Sign") return J;
      else return Z
    }
    for (let D of this._policies) {
      let {
        policy: H,
        options: C
      } = D, E = H.name;
      if (Q.has(E)) throw Error("Duplicate policy names not allowed in pipeline");
      let U = {
        policy: H,
        dependsOn: new Set,
        dependants: new Set
      };
      if (C.afterPhase) U.afterPhase = X(C.afterPhase), U.afterPhase.hasAfterPolicies = !0;
      Q.set(E, U), X(C.phase).policies.add(U)
    }
    for (let D of this._policies) {
      let {
        policy: H,
        options: C
      } = D, E = H.name, U = Q.get(E);
      if (!U) throw Error(`Missing node for policy ${E}`);
      if (C.afterPolicies)
        for (let q of C.afterPolicies) {
          let w = Q.get(q);
          if (w) U.dependsOn.add(w), w.dependants.add(U)
        }
      if (C.beforePolicies)
        for (let q of C.beforePolicies) {
          let w = Q.get(q);
          if (w) w.dependsOn.add(U), U.dependants.add(w)
        }
    }

    function V(D) {
      D.hasRun = !0;
      for (let H of D.policies) {
        if (H.afterPhase && (!H.afterPhase.hasRun || H.afterPhase.policies.size)) continue;
        if (H.dependsOn.size === 0) {
          A.push(H.policy);
          for (let C of H.dependants) C.dependsOn.delete(H);
          Q.delete(H.policy.name), D.policies.delete(H)
        }
      }
    }

    function F() {
      for (let D of W) {
        if (V(D), D.policies.size > 0 && D !== Z) {
          if (!Z.hasRun) V(Z);
          return
        }
        if (D.hasAfterPolicies) V(Z)
      }
    }
    let K = 0;
    while (Q.size > 0) {
      K++;
      let D = A.length;
      if (F(), A.length <= D && K > 1) throw Error("Cannot satisfy policy dependencies due to requirements cycle.")
    }
    return A
  }
}
// @from(Start 7844933, End 7844973)
function Zn1() {
  return aeA.create()
}
// @from(Start 7844978, End 7844981)
FlB
// @from(Start 7844987, End 7845068)
KlB = L(() => {
  FlB = new Set(["Deserialize", "Serialize", "Retry", "Sign"])
})
// @from(Start 7845071, End 7845206)
function pwA(A) {
  return typeof A === "object" && A !== null && !Array.isArray(A) && !(A instanceof RegExp) && !(A instanceof Date)
}
// @from(Start 7845208, End 7845357)
function Ne(A) {
  if (pwA(A)) {
    let Q = typeof A.name === "string",
      B = typeof A.message === "string";
    return Q && B
  }
  return !1
}
// @from(Start 7845362, End 7845376)
In1 = () => {}
// @from(Start 7845428, End 7845431)
DlB
// @from(Start 7845437, End 7845474)
HlB = L(() => {
  DlB = hl6.custom
})
// @from(Start 7845476, End 7847150)
class Ik {
  constructor({
    additionalAllowedHeaderNames: A = [],
    additionalAllowedQueryParameters: Q = []
  } = {}) {
    A = gl6.concat(A), Q = ul6.concat(Q), this.allowedHeaderNames = new Set(A.map((B) => B.toLowerCase())), this.allowedQueryParameters = new Set(Q.map((B) => B.toLowerCase()))
  }
  sanitize(A) {
    let Q = new Set;
    return JSON.stringify(A, (B, G) => {
      if (G instanceof Error) return Object.assign(Object.assign({}, G), {
        name: G.name,
        message: G.message
      });
      if (B === "headers") return this.sanitizeHeaders(G);
      else if (B === "url") return this.sanitizeUrl(G);
      else if (B === "query") return this.sanitizeQuery(G);
      else if (B === "body") return;
      else if (B === "response") return;
      else if (B === "operationSpec") return;
      else if (Array.isArray(G) || pwA(G)) {
        if (Q.has(G)) return "[Circular]";
        Q.add(G)
      }
      return G
    }, 2)
  }
  sanitizeUrl(A) {
    if (typeof A !== "string" || A === null || A === "") return A;
    let Q = new URL(A);
    if (!Q.search) return A;
    for (let [B] of Q.searchParams)
      if (!this.allowedQueryParameters.has(B.toLowerCase())) Q.searchParams.set(B, Yn1);
    return Q.toString()
  }
  sanitizeHeaders(A) {
    let Q = {};
    for (let B of Object.keys(A))
      if (this.allowedHeaderNames.has(B.toLowerCase())) Q[B] = A[B];
      else Q[B] = Yn1;
    return Q
  }
  sanitizeQuery(A) {
    if (typeof A !== "object" || A === null) return A;
    let Q = {};
    for (let B of Object.keys(A))
      if (this.allowedQueryParameters.has(B.toLowerCase())) Q[B] = A[B];
      else Q[B] = Yn1;
    return Q
  }
}
// @from(Start 7847155, End 7847171)
Yn1 = "REDACTED"
// @from(Start 7847175, End 7847178)
gl6
// @from(Start 7847180, End 7847183)
ul6
// @from(Start 7847189, End 7848021)
lwA = L(() => {
  gl6 = ["x-ms-client-request-id", "x-ms-return-client-request-id", "x-ms-useragent", "x-ms-correlation-request-id", "x-ms-request-id", "client-request-id", "ms-cv", "return-client-request-id", "traceparent", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin", "Accept", "Accept-Encoding", "Cache-Control", "Connection", "Content-Length", "Content-Type", "Date", "ETag", "Expires", "If-Match", "If-Modified-Since", "If-None-Match", "If-Unmodified-Since", "Last-Modified", "Pragma", "Request-Id", "Retry-After", "Server", "Transfer-Encoding", "User-Agent", "WWW-Authenticate"], ul6 = ["api-version"]
})
// @from(Start 7848024, End 7848118)
function Jn1(A) {
  if (A instanceof LU) return !0;
  return Ne(A) && A.name === "RestError"
}
// @from(Start 7848123, End 7848126)
ml6
// @from(Start 7848128, End 7848130)
LU
// @from(Start 7848136, End 7848944)
Wn1 = L(() => {
  In1();
  HlB();
  lwA();
  ml6 = new Ik;
  LU = class LU extends Error {
    constructor(A, Q = {}) {
      super(A);
      this.name = "RestError", this.code = Q.code, this.statusCode = Q.statusCode, Object.defineProperty(this, "request", {
        value: Q.request,
        enumerable: !1
      }), Object.defineProperty(this, "response", {
        value: Q.response,
        enumerable: !1
      }), Object.defineProperty(this, DlB, {
        value: () => {
          return `RestError: ${this.message} 
 ${ml6.sanitize(Object.assign(Object.assign({},this),{request:this.request,response:this.response}))}`
        },
        enumerable: !1
      }), Object.setPrototypeOf(this, LU.prototype)
    }
  };
  LU.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
  LU.PARSE_ERROR = "PARSE_ERROR"
})
// @from(Start 7848947, End 7848995)
function Yk(A, Q) {
  return Buffer.from(A, Q)
}
// @from(Start 7849000, End 7849002)
bT
// @from(Start 7849008, End 7849065)
seA = L(() => {
  meA();
  bT = ueA("ts-http-runtime")
})
// @from(Start 7849221, End 7849283)
function iwA(A) {
  return A && typeof A.pipe === "function"
}
// @from(Start 7849285, End 7849570)
function ClB(A) {
  if (A.readable === !1) return Promise.resolve();
  return new Promise((Q) => {
    let B = () => {
      Q(), A.removeListener("close", B), A.removeListener("end", B), A.removeListener("error", B)
    };
    A.on("close", B), A.on("end", B), A.on("error", B)
  })
}
// @from(Start 7849572, End 7849638)
function ElB(A) {
  return A && typeof A.byteLength === "number"
}
// @from(Start 7849639, End 7854280)
class zlB {
  constructor() {
    this.cachedHttpsAgents = new WeakMap
  }
  async sendRequest(A) {
    var Q, B, G;
    let Z = new AbortController,
      I;
    if (A.abortSignal) {
      if (A.abortSignal.aborted) throw new op("The operation was aborted. Request has already been canceled.");
      I = (F) => {
        if (F.type === "abort") Z.abort()
      }, A.abortSignal.addEventListener("abort", I)
    }
    let Y;
    if (A.timeout > 0) Y = setTimeout(() => {
      let F = new Ik;
      bT.info(`request to '${F.sanitizeUrl(A.url)}' timed out. canceling...`), Z.abort()
    }, A.timeout);
    let J = A.headers.get("Accept-Encoding"),
      W = (J === null || J === void 0 ? void 0 : J.includes("gzip")) || (J === null || J === void 0 ? void 0 : J.includes("deflate")),
      X = typeof A.body === "function" ? A.body() : A.body;
    if (X && !A.headers.has("Content-Length")) {
      let F = nl6(X);
      if (F !== null) A.headers.set("Content-Length", F)
    }
    let V;
    try {
      if (X && A.onUploadProgress) {
        let E = A.onUploadProgress,
          U = new Xn1(E);
        if (U.on("error", (q) => {
            bT.error("Error in upload progress", q)
          }), iwA(X)) X.pipe(U);
        else U.end(X);
        X = U
      }
      let F = await this.makeRequest(A, Z, X);
      if (Y !== void 0) clearTimeout(Y);
      let K = pl6(F),
        H = {
          status: (Q = F.statusCode) !== null && Q !== void 0 ? Q : 0,
          headers: K,
          request: A
        };
      if (A.method === "HEAD") return F.resume(), H;
      V = W ? ll6(F, K) : F;
      let C = A.onDownloadProgress;
      if (C) {
        let E = new Xn1(C);
        E.on("error", (U) => {
          bT.error("Error in download progress", U)
        }), V.pipe(E), V = E
      }
      if (((B = A.streamResponseStatusCodes) === null || B === void 0 ? void 0 : B.has(Number.POSITIVE_INFINITY)) || ((G = A.streamResponseStatusCodes) === null || G === void 0 ? void 0 : G.has(H.status))) H.readableStreamBody = V;
      else H.bodyAsText = await il6(V);
      return H
    } finally {
      if (A.abortSignal && I) {
        let F = Promise.resolve();
        if (iwA(X)) F = ClB(X);
        let K = Promise.resolve();
        if (iwA(V)) K = ClB(V);
        Promise.all([F, K]).then(() => {
          var D;
          if (I)(D = A.abortSignal) === null || D === void 0 || D.removeEventListener("abort", I)
        }).catch((D) => {
          bT.warning("Error when cleaning up abortListener on httpRequest", D)
        })
      }
    }
  }
  makeRequest(A, Q, B) {
    var G;
    let Z = new URL(A.url),
      I = Z.protocol !== "https:";
    if (I && !A.allowInsecureConnection) throw Error(`Cannot connect to ${A.url} while allowInsecureConnection is false.`);
    let Y = (G = A.agent) !== null && G !== void 0 ? G : this.getOrCreateAgent(A, I),
      J = Object.assign({
        agent: Y,
        hostname: Z.hostname,
        path: `${Z.pathname}${Z.search}`,
        port: Z.port,
        method: A.method,
        headers: A.headers.toJSON({
          preserveCase: !0
        })
      }, A.requestOverrides);
    return new Promise((W, X) => {
      let V = I ? JZA.request(J, W) : WZA.request(J, W);
      if (V.once("error", (F) => {
          var K;
          X(new LU(F.message, {
            code: (K = F.code) !== null && K !== void 0 ? K : LU.REQUEST_SEND_ERROR,
            request: A
          }))
        }), Q.signal.addEventListener("abort", () => {
          let F = new op("The operation was aborted. Rejecting from abort signal callback while making request.");
          V.destroy(F), X(F)
        }), B && iwA(B)) B.pipe(V);
      else if (B)
        if (typeof B === "string" || Buffer.isBuffer(B)) V.end(B);
        else if (ElB(B)) V.end(ArrayBuffer.isView(B) ? Buffer.from(B.buffer) : Buffer.from(B));
      else bT.error("Unrecognized body type", B), X(new LU("Unrecognized body type"));
      else V.end()
    })
  }
  getOrCreateAgent(A, Q) {
    var B;
    let G = A.disableKeepAlive;
    if (Q) {
      if (G) return JZA.globalAgent;
      if (!this.cachedHttpAgent) this.cachedHttpAgent = new JZA.Agent({
        keepAlive: !0
      });
      return this.cachedHttpAgent
    } else {
      if (G && !A.tlsSettings) return WZA.globalAgent;
      let Z = (B = A.tlsSettings) !== null && B !== void 0 ? B : cl6,
        I = this.cachedHttpsAgents.get(Z);
      if (I && I.options.keepAlive === !G) return I;
      return bT.info("No cached TLS Agent exist, creating a new Agent"), I = new WZA.Agent(Object.assign({
        keepAlive: !G
      }, Z)), this.cachedHttpsAgents.set(Z, I), I
    }
  }
}
// @from(Start 7854282, End 7854497)
function pl6(A) {
  let Q = Zk();
  for (let B of Object.keys(A.headers)) {
    let G = A.headers[B];
    if (Array.isArray(G)) {
      if (G.length > 0) Q.set(B, G[0])
    } else if (G) Q.set(B, G)
  }
  return Q
}
// @from(Start 7854499, End 7854740)
function ll6(A, Q) {
  let B = Q.get("Content-Encoding");
  if (B === "gzip") {
    let G = reA.createGunzip();
    return A.pipe(G), G
  } else if (B === "deflate") {
    let G = reA.createInflate();
    return A.pipe(G), G
  }
  return A
}
// @from(Start 7854742, End 7855220)
function il6(A) {
  return new Promise((Q, B) => {
    let G = [];
    A.on("data", (Z) => {
      if (Buffer.isBuffer(Z)) G.push(Z);
      else G.push(Buffer.from(Z))
    }), A.on("end", () => {
      Q(Buffer.concat(G).toString("utf8"))
    }), A.on("error", (Z) => {
      if (Z && (Z === null || Z === void 0 ? void 0 : Z.name) === "AbortError") B(Z);
      else B(new LU(`Error reading response as text: ${Z.message}`, {
        code: LU.PARSE_ERROR
      }))
    })
  })
}
// @from(Start 7855222, End 7855464)
function nl6(A) {
  if (!A) return 0;
  else if (Buffer.isBuffer(A)) return A.length;
  else if (iwA(A)) return null;
  else if (ElB(A)) return A.byteLength;
  else if (typeof A === "string") return Buffer.from(A).length;
  else return null
}
// @from(Start 7855466, End 7855501)
function UlB() {
  return new zlB
}
// @from(Start 7855506, End 7855509)
cl6
// @from(Start 7855511, End 7855514)
Xn1
// @from(Start 7855520, End 7855950)
$lB = L(() => {
  ieA();
  dwA();
  Wn1();
  seA();
  lwA();
  cl6 = {};
  Xn1 = class Xn1 extends dl6 {
    _transform(A, Q, B) {
      this.push(A), this.loadedBytes += A.length;
      try {
        this.progressCallback({
          loadedBytes: this.loadedBytes
        }), B()
      } catch (G) {
        B(G)
      }
    }
    constructor(A) {
      super();
      this.loadedBytes = 0, this.progressCallback = A
    }
  }
})
// @from(Start 7855953, End 7855986)
function Vn1() {
  return UlB()
}
// @from(Start 7855991, End 7856017)
wlB = L(() => {
  $lB()
})
// @from(Start 7856020, End 7856546)
function Kn1(A = {}) {
  var Q;
  let B = (Q = A.logger) !== null && Q !== void 0 ? Q : bT.info,
    G = new Ik({
      additionalAllowedHeaderNames: A.additionalAllowedHeaderNames,
      additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
    });
  return {
    name: Fn1,
    async sendRequest(Z, I) {
      if (!B.enabled) return I(Z);
      B(`Request: ${G.sanitize(Z)}`);
      let Y = await I(Z);
      return B(`Response status code: ${Y.status}`), B(`Headers: ${G.sanitize(Y.headers)}`), Y
    }
  }
}
// @from(Start 7856551, End 7856568)
Fn1 = "logPolicy"
// @from(Start 7856574, End 7856609)
qlB = L(() => {
  seA();
  lwA()
})
// @from(Start 7856612, End 7856807)
function Dn1(A = {}) {
  let {
    maxRetries: Q = 20
  } = A;
  return {
    name: "redirectPolicy",
    async sendRequest(B, G) {
      let Z = await G(B);
      return LlB(G, Z, Q)
    }
  }
}
// @from(Start 7856808, End 7857344)
async function LlB(A, Q, B, G = 0) {
  let {
    request: Z,
    status: I,
    headers: Y
  } = Q, J = Y.get("location");
  if (J && (I === 300 || I === 301 && NlB.includes(Z.method) || I === 302 && NlB.includes(Z.method) || I === 303 && Z.method === "POST" || I === 307) && G < B) {
    let W = new URL(J, Z.url);
    if (Z.url = W.toString(), I === 303) Z.method = "GET", Z.headers.delete("Content-Length"), delete Z.body;
    Z.headers.delete("Authorization");
    let X = await A(Z);
    return LlB(A, X, B, G + 1)
  }
  return Q
}
// @from(Start 7857349, End 7857352)
NlB
// @from(Start 7857358, End 7857400)
MlB = L(() => {
  NlB = ["GET", "HEAD"]
})
// @from(Start 7857406, End 7857413)
nwA = 3
// @from(Start 7857416, End 7857622)
function Hn1() {
  return {
    name: "decompressResponsePolicy",
    async sendRequest(A, Q) {
      if (A.method !== "HEAD") A.headers.set("Accept-Encoding", "gzip,deflate");
      return Q(A)
    }
  }
}
// @from(Start 7857624, End 7857736)
function Cn1(A, Q) {
  return A = Math.ceil(A), Q = Math.floor(Q), Math.floor(Math.random() * (Q - A + 1)) + A
}
// @from(Start 7857738, End 7857904)
function awA(A, Q) {
  let B = Q.retryDelayInMs * Math.pow(2, A),
    G = Math.min(Q.maxRetryDelayInMs, B);
  return {
    retryAfterInMs: G / 2 + Cn1(0, G / 2)
  }
}
// @from(Start 7857909, End 7857923)
En1 = () => {}
// @from(Start 7857926, End 7858678)
function OlB(A, Q, B) {
  return new Promise((G, Z) => {
    let I = void 0,
      Y = void 0,
      J = () => {
        return Z(new op((B === null || B === void 0 ? void 0 : B.abortErrorMsg) ? B === null || B === void 0 ? void 0 : B.abortErrorMsg : al6))
      },
      W = () => {
        if ((B === null || B === void 0 ? void 0 : B.abortSignal) && Y) B.abortSignal.removeEventListener("abort", Y)
      };
    if (Y = () => {
        if (I) clearTimeout(I);
        return W(), J()
      }, (B === null || B === void 0 ? void 0 : B.abortSignal) && B.abortSignal.aborted) return J();
    if (I = setTimeout(() => {
        W(), G(Q)
      }, A), B === null || B === void 0 ? void 0 : B.abortSignal) B.abortSignal.addEventListener("abort", Y)
  })
}
// @from(Start 7858680, End 7858811)
function RlB(A, Q) {
  let B = A.headers.get(Q);
  if (!B) return;
  let G = Number(B);
  if (Number.isNaN(G)) return;
  return G
}
// @from(Start 7858816, End 7858850)
al6 = "The operation was aborted."
// @from(Start 7858856, End 7858882)
zn1 = L(() => {
  ieA()
})
// @from(Start 7858885, End 7859258)
function TlB(A) {
  if (!(A && [429, 503].includes(A.status))) return;
  try {
    for (let Z of sl6) {
      let I = RlB(A, Z);
      if (I === 0 || I) return I * (Z === Un1 ? 1000 : 1)
    }
    let Q = A.headers.get(Un1);
    if (!Q) return;
    let G = Date.parse(Q) - Date.now();
    return Number.isFinite(G) ? Math.max(0, G) : void 0
  } catch (Q) {
    return
  }
}
// @from(Start 7859260, End 7859312)
function PlB(A) {
  return Number.isFinite(TlB(A))
}
// @from(Start 7859314, End 7859574)
function jlB() {
  return {
    name: "throttlingRetryStrategy",
    retry({
      response: A
    }) {
      let Q = TlB(A);
      if (!Number.isFinite(Q)) return {
        skipStrategy: !0
      };
      return {
        retryAfterInMs: Q
      }
    }
  }
}
// @from(Start 7859579, End 7859598)
Un1 = "Retry-After"
// @from(Start 7859602, End 7859605)
sl6
// @from(Start 7859611, End 7859693)
$n1 = L(() => {
  zn1();
  sl6 = ["retry-after-ms", "x-ms-retry-after-ms", Un1]
})
// @from(Start 7859696, End 7860375)
function SlB(A = {}) {
  var Q, B;
  let G = (Q = A.retryDelayInMs) !== null && Q !== void 0 ? Q : rl6,
    Z = (B = A.maxRetryDelayInMs) !== null && B !== void 0 ? B : ol6;
  return {
    name: "exponentialRetryStrategy",
    retry({
      retryCount: I,
      response: Y,
      responseError: J
    }) {
      let W = el6(J),
        X = W && A.ignoreSystemErrors,
        V = tl6(Y),
        F = V && A.ignoreHttpStatusCodes;
      if (Y && (PlB(Y) || !V) || F || X) return {
        skipStrategy: !0
      };
      if (J && !W && !V) return {
        errorToThrow: J
      };
      return awA(I, {
        retryDelayInMs: G,
        maxRetryDelayInMs: Z
      })
    }
  }
}
// @from(Start 7860377, End 7860520)
function tl6(A) {
  return Boolean(A && A.status !== void 0 && (A.status >= 500 || A.status === 408) && A.status !== 501 && A.status !== 505)
}
// @from(Start 7860522, End 7860731)
function el6(A) {
  if (!A) return !1;
  return A.code === "ETIMEDOUT" || A.code === "ESOCKETTIMEDOUT" || A.code === "ECONNREFUSED" || A.code === "ECONNRESET" || A.code === "ENOENT" || A.code === "ENOTFOUND"
}
// @from(Start 7860736, End 7860746)
rl6 = 1000
// @from(Start 7860750, End 7860761)
ol6 = 64000
// @from(Start 7860767, End 7860802)
_lB = L(() => {
  En1();
  $n1()
})
// @from(Start 7860805, End 7863144)
function swA(A, Q = {
  maxRetries: nwA
}) {
  let B = Q.logger || Ai6;
  return {
    name: Qi6,
    async sendRequest(G, Z) {
      var I, Y;
      let J, W, X = -1;
      A: while (!0) {
        X += 1, J = void 0, W = void 0;
        try {
          B.info(`Retry ${X}: Attempting to send request`, G.requestId), J = await Z(G), B.info(`Retry ${X}: Received a response from request`, G.requestId)
        } catch (V) {
          if (B.error(`Retry ${X}: Received an error from request`, G.requestId), W = V, !V || W.name !== "RestError") throw V;
          J = W.response
        }
        if ((I = G.abortSignal) === null || I === void 0 ? void 0 : I.aborted) throw B.error(`Retry ${X}: Request aborted.`), new op;
        if (X >= ((Y = Q.maxRetries) !== null && Y !== void 0 ? Y : nwA))
          if (B.info(`Retry ${X}: Maximum retries reached. Returning the last received response, or throwing the last received error.`), W) throw W;
          else if (J) return J;
        else throw Error("Maximum retries reached with no response or error to throw");
        B.info(`Retry ${X}: Processing ${A.length} retry strategies.`);
        Q: for (let V of A) {
          let F = V.logger || B;
          F.info(`Retry ${X}: Processing retry strategy ${V.name}.`);
          let K = V.retry({
            retryCount: X,
            response: J,
            responseError: W
          });
          if (K.skipStrategy) {
            F.info(`Retry ${X}: Skipped.`);
            continue Q
          }
          let {
            errorToThrow: D,
            retryAfterInMs: H,
            redirectTo: C
          } = K;
          if (D) throw F.error(`Retry ${X}: Retry strategy ${V.name} throws error:`, D), D;
          if (H || H === 0) {
            F.info(`Retry ${X}: Retry strategy ${V.name} retries after ${H}`), await OlB(H, void 0, {
              abortSignal: G.abortSignal
            });
            continue A
          }
          if (C) {
            F.info(`Retry ${X}: Retry strategy ${V.name} redirects to ${C}`), G.url = C;
            continue A
          }
        }
        if (W) throw B.info("None of the retry strategies could work with the received error. Throwing it."), W;
        if (J) return B.info("None of the retry strategies could work with the received response. Returning it."), J
      }
    }
  }
}
// @from(Start 7863149, End 7863152)
Ai6
// @from(Start 7863154, End 7863173)
Qi6 = "retryPolicy"
// @from(Start 7863179, End 7863267)
wn1 = L(() => {
  zn1();
  ieA();
  meA();
  Ai6 = ueA("ts-http-runtime retryPolicy")
})
// @from(Start 7863270, End 7863464)
function Nn1(A = {}) {
  var Q;
  return {
    name: qn1,
    sendRequest: swA([jlB(), SlB(A)], {
      maxRetries: (Q = A.maxRetries) !== null && Q !== void 0 ? Q : nwA
    }).sendRequest
  }
}
// @from(Start 7863469, End 7863495)
qn1 = "defaultRetryPolicy"
// @from(Start 7863501, End 7863545)
klB = L(() => {
  _lB();
  $n1();
  wn1()
})
// @from(Start 7863551, End 7863554)
Ln1
// @from(Start 7863556, End 7863559)
Mn1
// @from(Start 7863561, End 7863564)
On1
// @from(Start 7863566, End 7863569)
Rn1
// @from(Start 7863571, End 7863574)
ylB
// @from(Start 7863576, End 7863579)
xlB
// @from(Start 7863581, End 7863584)
vlB
// @from(Start 7863586, End 7863589)
blB
// @from(Start 7863591, End 7863594)
XZA
// @from(Start 7863596, End 7863599)
flB
// @from(Start 7863605, End 7864569)
Tn1 = L(() => {
  ylB = typeof window < "u" && typeof window.document < "u", xlB = typeof self === "object" && typeof(self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((Ln1 = self.constructor) === null || Ln1 === void 0 ? void 0 : Ln1.name) === "DedicatedWorkerGlobalScope" || ((Mn1 = self.constructor) === null || Mn1 === void 0 ? void 0 : Mn1.name) === "ServiceWorkerGlobalScope" || ((On1 = self.constructor) === null || On1 === void 0 ? void 0 : On1.name) === "SharedWorkerGlobalScope"), vlB = typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u", blB = typeof Bun < "u" && typeof Bun.version < "u", XZA = typeof globalThis.process < "u" && Boolean(globalThis.process.version) && Boolean((Rn1 = globalThis.process.versions) === null || Rn1 === void 0 ? void 0 : Rn1.node), flB = typeof navigator < "u" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative"
})
// @from(Start 7864572, End 7864724)
function Bi6(A) {
  var Q;
  let B = {};
  for (let [G, Z] of A.entries())(Q = B[G]) !== null && Q !== void 0 || (B[G] = []), B[G].push(Z);
  return B
}
// @from(Start 7864726, End 7865185)
function jn1() {
  return {
    name: Pn1,
    async sendRequest(A, Q) {
      if (XZA && typeof FormData < "u" && A.body instanceof FormData) A.formData = Bi6(A.body), A.body = void 0;
      if (A.formData) {
        let B = A.headers.get("Content-Type");
        if (B && B.indexOf("application/x-www-form-urlencoded") !== -1) A.body = Gi6(A.formData);
        else await Zi6(A.formData, A);
        A.formData = void 0
      }
      return Q(A)
    }
  }
}
// @from(Start 7865187, End 7865411)
function Gi6(A) {
  let Q = new URLSearchParams;
  for (let [B, G] of Object.entries(A))
    if (Array.isArray(G))
      for (let Z of G) Q.append(B, Z.toString());
    else Q.append(B, G.toString());
  return Q.toString()
}
// @from(Start 7865412, End 7866349)
async function Zi6(A, Q) {
  let B = Q.headers.get("Content-Type");
  if (B && !B.startsWith("multipart/form-data")) return;
  Q.headers.set("Content-Type", B !== null && B !== void 0 ? B : "multipart/form-data");
  let G = [];
  for (let [Z, I] of Object.entries(A))
    for (let Y of Array.isArray(I) ? I : [I])
      if (typeof Y === "string") G.push({
        headers: Zk({
          "Content-Disposition": `form-data; name="${Z}"`
        }),
        body: Yk(Y, "utf-8")
      });
      else if (Y === void 0 || Y === null || typeof Y !== "object") throw Error(`Unexpected value for key ${Z}: ${Y}. Value should be serialized to string first.`);
  else {
    let J = Y.name || "blob",
      W = Zk();
    W.set("Content-Disposition", `form-data; name="${Z}"; filename="${J}"`), W.set("Content-Type", Y.type || "application/octet-stream"), G.push({
      headers: W,
      body: Y
    })
  }
  Q.multipartBody = {
    parts: G
  }
}
// @from(Start 7866354, End 7866376)
Pn1 = "formDataPolicy"
// @from(Start 7866382, End 7866417)
hlB = L(() => {
  Tn1();
  dwA()
})
// @from(Start 7866423, End 7870246)
mlB = z((TM) => {
  var Ii6 = TM && TM.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    Yi6 = TM && TM.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    ulB = TM && TM.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) Ii6(Q, A, B)
      }
      return Yi6(Q, A), Q
    },
    Ji6 = TM && TM.__importDefault || function(A) {
      return A && A.__esModule ? A : {
        default: A
      }
    };
  Object.defineProperty(TM, "__esModule", {
    value: !0
  });
  TM.HttpProxyAgent = void 0;
  var Wi6 = ulB(UA("net")),
    Xi6 = ulB(UA("tls")),
    Vi6 = Ji6(hs()),
    Fi6 = UA("events"),
    Ki6 = Yy1(),
    glB = UA("url"),
    VZA = (0, Vi6.default)("http-proxy-agent");
  class Sn1 extends Ki6.Agent {
    constructor(A, Q) {
      super(Q);
      this.proxy = typeof A === "string" ? new glB.URL(A) : A, this.proxyHeaders = Q?.headers ?? {}, VZA("Creating new HttpProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ...Q ? Di6(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    addRequest(A, Q) {
      A._header = null, this.setRequestProps(A, Q), super.addRequest(A, Q)
    }
    setRequestProps(A, Q) {
      let {
        proxy: B
      } = this, G = Q.secureEndpoint ? "https:" : "http:", Z = A.getHeader("host") || "localhost", I = `${G}//${Z}`, Y = new glB.URL(A.path, I);
      if (Q.port !== 80) Y.port = String(Q.port);
      A.path = String(Y);
      let J = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
        ...this.proxyHeaders
      };
      if (B.username || B.password) {
        let W = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        J["Proxy-Authorization"] = `Basic ${Buffer.from(W).toString("base64")}`
      }
      if (!J["Proxy-Connection"]) J["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let W of Object.keys(J)) {
        let X = J[W];
        if (X) A.setHeader(W, X)
      }
    }
    async connect(A, Q) {
      if (A._header = null, !A.path.includes("://")) this.setRequestProps(A, Q);
      let B, G;
      if (VZA("Regenerating stored HTTP header string for request"), A._implicitHeader(), A.outputData && A.outputData.length > 0) VZA("Patching connection write() output buffer with updated header"), B = A.outputData[0].data, G = B.indexOf(`\r
\r
`) + 4, A.outputData[0].data = A._header + B.substring(G), VZA("Output buffer: %o", A.outputData[0].data);
      let Z;
      if (this.proxy.protocol === "https:") VZA("Creating `tls.Socket`: %o", this.connectOpts), Z = Xi6.connect(this.connectOpts);
      else VZA("Creating `net.Socket`: %o", this.connectOpts), Z = Wi6.connect(this.connectOpts);
      return await (0, Fi6.once)(Z, "connect"), Z
    }
  }
  Sn1.protocols = ["http", "https"];
  TM.HttpProxyAgent = Sn1;

  function Di6(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
})
// @from(Start 7870249, End 7870400)
function oeA(A) {
  if (process.env[A]) return process.env[A];
  else if (process.env[A.toLowerCase()]) return process.env[A.toLowerCase()];
  return
}
// @from(Start 7870402, End 7870521)
function $i6() {
  if (!process) return;
  let A = oeA(Hi6),
    Q = oeA(Ei6),
    B = oeA(Ci6);
  return A || Q || B
}
// @from(Start 7870523, End 7870928)
function wi6(A, Q, B) {
  if (Q.length === 0) return !1;
  let G = new URL(A).hostname;
  if (B === null || B === void 0 ? void 0 : B.has(G)) return B.get(G);
  let Z = !1;
  for (let I of Q)
    if (I[0] === ".") {
      if (G.endsWith(I)) Z = !0;
      else if (G.length === I.length - 1 && G === I.slice(1)) Z = !0
    } else if (G === I) Z = !0;
  return B === null || B === void 0 || B.set(G, Z), Z
}
// @from(Start 7870930, End 7871065)
function qi6() {
  let A = oeA(zi6);
  if (nlB = !0, A) return A.split(",").map((Q) => Q.trim()).filter((Q) => Q.length);
  return []
}
// @from(Start 7871067, End 7871135)
function Ni6() {
  let A = $i6();
  return A ? new URL(A) : void 0
}
// @from(Start 7871137, End 7871430)
function clB(A) {
  let Q;
  try {
    Q = new URL(A.host)
  } catch (B) {
    throw Error(`Expecting a valid host string in proxy settings, but found "${A.host}".`)
  }
  if (Q.port = String(A.port), A.username) Q.username = A.username;
  if (A.password) Q.password = A.password;
  return Q
}
// @from(Start 7871432, End 7872002)
function plB(A, Q, B) {
  if (A.agent) return;
  let Z = new URL(A.url).protocol !== "https:";
  if (A.tlsSettings) bT.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
  let I = A.headers.toJSON();
  if (Z) {
    if (!Q.httpProxyAgent) Q.httpProxyAgent = new ilB.HttpProxyAgent(B, {
      headers: I
    });
    A.agent = Q.httpProxyAgent
  } else {
    if (!Q.httpsProxyAgent) Q.httpsProxyAgent = new llB.HttpsProxyAgent(B, {
      headers: I
    });
    A.agent = Q.httpsProxyAgent
  }
}
// @from(Start 7872004, End 7872500)
function kn1(A, Q) {
  if (!nlB) dlB.push(...qi6());
  let B = A ? clB(A) : Ni6(),
    G = {};
  return {
    name: _n1,
    async sendRequest(Z, I) {
      var Y;
      if (!Z.proxySettings && B && !wi6(Z.url, (Y = Q === null || Q === void 0 ? void 0 : Q.customNoProxyList) !== null && Y !== void 0 ? Y : dlB, (Q === null || Q === void 0 ? void 0 : Q.customNoProxyList) ? void 0 : Ui6)) plB(Z, G, B);
      else if (Z.proxySettings) plB(Z, G, clB(Z.proxySettings));
      return I(Z)
    }
  }
}
// @from(Start 7872505, End 7872508)
llB
// @from(Start 7872510, End 7872513)
ilB
// @from(Start 7872515, End 7872534)
Hi6 = "HTTPS_PROXY"
// @from(Start 7872538, End 7872556)
Ci6 = "HTTP_PROXY"
// @from(Start 7872560, End 7872577)
Ei6 = "ALL_PROXY"
// @from(Start 7872581, End 7872597)
zi6 = "NO_PROXY"
// @from(Start 7872601, End 7872620)
_n1 = "proxyPolicy"
// @from(Start 7872624, End 7872627)
dlB
// @from(Start 7872629, End 7872637)
nlB = !1
// @from(Start 7872641, End 7872644)
Ui6
// @from(Start 7872650, End 7872743)
alB = L(() => {
  seA();
  llB = BA(LEA(), 1), ilB = BA(mlB(), 1), dlB = [], Ui6 = new Map
})
// @from(Start 7872746, End 7872897)
function yn1(A) {
  return {
    name: "agentPolicy",
    sendRequest: async (Q, B) => {
      if (!Q.agent) Q.agent = A;
      return B(Q)
    }
  }
}
// @from(Start 7872899, End 7873060)
function xn1(A) {
  return {
    name: "tlsPolicy",
    sendRequest: async (Q, B) => {
      if (!Q.tlsSettings) Q.tlsSettings = A;
      return B(Q)
    }
  }
}
// @from(Start 7873062, End 7873121)
function teA(A) {
  return typeof A.stream === "function"
}