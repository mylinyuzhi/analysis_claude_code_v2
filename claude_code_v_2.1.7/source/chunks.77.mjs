
// @from(Ln 223825, Col 4)
t60 = U((ogB) => {
  Object.defineProperty(ogB, "__esModule", {
    value: !0
  });
  ogB.InvalidSubjectTokenError = ogB.InvalidMessageFieldError = ogB.InvalidCodeFieldError = ogB.InvalidTokenTypeFieldError = ogB.InvalidExpirationTimeFieldError = ogB.InvalidSuccessFieldError = ogB.InvalidVersionFieldError = ogB.ExecutableResponseError = ogB.ExecutableResponse = void 0;
  var T61 = "urn:ietf:params:oauth:token-type:saml2",
    l60 = "urn:ietf:params:oauth:token-type:id_token",
    i60 = "urn:ietf:params:oauth:token-type:jwt";
  class ngB {
    constructor(A) {
      if (!A.version) throw new n60("Executable response must contain a 'version' field.");
      if (A.success === void 0) throw new a60("Executable response must contain a 'success' field.");
      if (this.version = A.version, this.success = A.success, this.success) {
        if (this.expirationTime = A.expiration_time, this.tokenType = A.token_type, this.tokenType !== T61 && this.tokenType !== l60 && this.tokenType !== i60) throw new o60(`Executable response must contain a 'token_type' field when successful and it must be one of ${l60}, ${i60}, or ${T61}.`);
        if (this.tokenType === T61) {
          if (!A.saml_response) throw new P61(`Executable response must contain a 'saml_response' field when token_type=${T61}.`);
          this.subjectToken = A.saml_response
        } else {
          if (!A.id_token) throw new P61(`Executable response must contain a 'id_token' field when token_type=${l60} or ${i60}.`);
          this.subjectToken = A.id_token
        }
      } else {
        if (!A.code) throw new r60("Executable response must contain a 'code' field when unsuccessful.");
        if (!A.message) throw new s60("Executable response must contain a 'message' field when unsuccessful.");
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
  ogB.ExecutableResponse = ngB;
  class _m extends Error {
    constructor(A) {
      super(A);
      Object.setPrototypeOf(this, new.target.prototype)
    }
  }
  ogB.ExecutableResponseError = _m;
  class n60 extends _m {}
  ogB.InvalidVersionFieldError = n60;
  class a60 extends _m {}
  ogB.InvalidSuccessFieldError = a60;
  class agB extends _m {}
  ogB.InvalidExpirationTimeFieldError = agB;
  class o60 extends _m {}
  ogB.InvalidTokenTypeFieldError = o60;
  class r60 extends _m {}
  ogB.InvalidCodeFieldError = r60;
  class s60 extends _m {}
  ogB.InvalidMessageFieldError = s60;
  class P61 extends _m {}
  ogB.InvalidSubjectTokenError = P61
})
// @from(Ln 223882, Col 4)
egB = U((sgB) => {
  Object.defineProperty(sgB, "__esModule", {
    value: !0
  });
  sgB.PluggableAuthHandler = void 0;
  var Bv8 = S61(),
    z2A = t60(),
    Gv8 = NA("child_process"),
    e60 = NA("fs");
  class A30 {
    constructor(A) {
      if (!A.command) throw Error("No command provided.");
      if (this.commandComponents = A30.parseCommand(A.command), this.timeoutMillis = A.timeoutMillis, !this.timeoutMillis) throw Error("No timeoutMillis provided.");
      this.outputFile = A.outputFile
    }
    retrieveResponseFromExecutable(A) {
      return new Promise((Q, B) => {
        let G = Gv8.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
            env: {
              ...process.env,
              ...Object.fromEntries(A)
            }
          }),
          Z = "";
        G.stdout.on("data", (J) => {
          Z += J
        }), G.stderr.on("data", (J) => {
          Z += J
        });
        let Y = setTimeout(() => {
          return G.removeAllListeners(), G.kill(), B(Error("The executable failed to finish within the timeout specified."))
        }, this.timeoutMillis);
        G.on("close", (J) => {
          if (clearTimeout(Y), J === 0) try {
            let X = JSON.parse(Z),
              I = new z2A.ExecutableResponse(X);
            return Q(I)
          } catch (X) {
            if (X instanceof z2A.ExecutableResponseError) return B(X);
            return B(new z2A.ExecutableResponseError(`The executable returned an invalid response: ${Z}`))
          } else return B(new Bv8.ExecutableError(Z, J.toString()))
        })
      })
    }
    async retrieveCachedResponse() {
      if (!this.outputFile || this.outputFile.length === 0) return;
      let A;
      try {
        A = await e60.promises.realpath(this.outputFile)
      } catch (B) {
        return
      }
      if (!(await e60.promises.lstat(A)).isFile()) return;
      let Q = await e60.promises.readFile(A, {
        encoding: "utf8"
      });
      if (Q === "") return;
      try {
        let B = JSON.parse(Q);
        if (new z2A.ExecutableResponse(B).isValid()) return new z2A.ExecutableResponse(B);
        return
      } catch (B) {
        if (B instanceof z2A.ExecutableResponseError) throw B;
        throw new z2A.ExecutableResponseError(`The output file contained an invalid response: ${Q}`)
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
  sgB.PluggableAuthHandler = A30
})
// @from(Ln 223958, Col 4)
S61 = U((ZuB) => {
  Object.defineProperty(ZuB, "__esModule", {
    value: !0
  });
  ZuB.PluggableAuthClient = ZuB.ExecutableError = void 0;
  var Zv8 = Fo(),
    Yv8 = t60(),
    Jv8 = egB();
  class Q30 extends Error {
    constructor(A, Q) {
      super(`The executable failed with exit code: ${Q} and error message: ${A}.`);
      this.code = Q, Object.setPrototypeOf(this, new.target.prototype)
    }
  }
  ZuB.ExecutableError = Q30;
  var Xv8 = 30000,
    AuB = 5000,
    QuB = 120000,
    Iv8 = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES",
    BuB = 1;
  class GuB extends Zv8.BaseExternalAccountClient {
    constructor(A, Q) {
      super(A, Q);
      if (!A.credential_source.executable) throw Error('No valid Pluggable Auth "credential_source" provided.');
      if (this.command = A.credential_source.executable.command, !this.command) throw Error('No valid Pluggable Auth "credential_source" provided.');
      if (A.credential_source.executable.timeout_millis === void 0) this.timeoutMillis = Xv8;
      else if (this.timeoutMillis = A.credential_source.executable.timeout_millis, this.timeoutMillis < AuB || this.timeoutMillis > QuB) throw Error(`Timeout must be between ${AuB} and ${QuB} milliseconds.`);
      this.outputFile = A.credential_source.executable.output_file, this.handler = new Jv8.PluggableAuthHandler({
        command: this.command,
        timeoutMillis: this.timeoutMillis,
        outputFile: this.outputFile
      }), this.credentialSourceType = "executable"
    }
    async retrieveSubjectToken() {
      if (process.env[Iv8] !== "1") throw Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
      let A = void 0;
      if (this.outputFile) A = await this.handler.retrieveCachedResponse();
      if (!A) {
        let Q = new Map;
        if (Q.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience), Q.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType), Q.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0"), this.outputFile) Q.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
        let B = this.getServiceAccountEmail();
        if (B) Q.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", B);
        A = await this.handler.retrieveResponseFromExecutable(Q)
      }
      if (A.version > BuB) throw Error(`Version of executable is not currently supported, maximum supported version is ${BuB}.`);
      if (!A.success) throw new Q30(A.errorMessage, A.errorCode);
      if (this.outputFile) {
        if (!A.expirationTime) throw new Yv8.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.")
      }
      if (A.isExpired()) throw Error("Executable response is expired.");
      return A.subjectToken
    }
  }
  ZuB.PluggableAuthClient = GuB
})
// @from(Ln 224013, Col 4)
B30 = U((XuB) => {
  Object.defineProperty(XuB, "__esModule", {
    value: !0
  });
  XuB.ExternalAccountClient = void 0;
  var Wv8 = Fo(),
    Kv8 = u60(),
    Vv8 = p60(),
    Fv8 = S61();
  class JuB {
    constructor() {
      throw Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()")
    }
    static fromJSON(A, Q) {
      var B, G;
      if (A && A.type === Wv8.EXTERNAL_ACCOUNT_TYPE)
        if ((B = A.credential_source) === null || B === void 0 ? void 0 : B.environment_id) return new Vv8.AwsClient(A, Q);
        else if ((G = A.credential_source) === null || G === void 0 ? void 0 : G.executable) return new Fv8.PluggableAuthClient(A, Q);
      else return new Kv8.IdentityPoolClient(A, Q);
      else return null
    }
  }
  XuB.ExternalAccountClient = JuB
})
// @from(Ln 224037, Col 4)
FuB = U((KuB) => {
  Object.defineProperty(KuB, "__esModule", {
    value: !0
  });
  KuB.ExternalAccountAuthorizedUserClient = KuB.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
  var Hv8 = ck(),
    DuB = _60(),
    Ev8 = cP(),
    zv8 = NA("stream"),
    $v8 = Fo();
  KuB.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
  var Cv8 = "https://sts.{universeDomain}/v1/oauthtoken";
  class G30 extends DuB.OAuthClientAuthHandler {
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
          ...G30.RETRY_CONFIG,
          url: this.url,
          method: "POST",
          headers: G,
          data: B.toString(),
          responseType: "json"
        };
      this.applyClientAuthenticationOptions(Z);
      try {
        let Y = await this.transporter.request(Z),
          J = Y.data;
        return J.res = Y, J
      } catch (Y) {
        if (Y instanceof Ev8.GaxiosError && Y.response) throw (0, DuB.getErrorFromOAuthErrorResponse)(Y.response.data, Y);
        throw Y
      }
    }
  }
  class WuB extends Hv8.AuthClient {
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
      if (this.externalAccountAuthorizedUserHandler = new G30((B = A.token_url) !== null && B !== void 0 ? B : Cv8.replace("{universeDomain}", this.universeDomain), this.transporter, G), this.cachedAccessToken = null, this.quotaProjectId = A.quota_project_id, typeof (Q === null || Q === void 0 ? void 0 : Q.eagerRefreshThresholdMillis) !== "number") this.eagerRefreshThresholdMillis = $v8.EXPIRATION_TIME_OFFSET;
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
          let Y = Z.status,
            J = Z.config.data instanceof zv8.Readable;
          if (!Q && (Y === 401 || Y === 403) && !J && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
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
  KuB.ExternalAccountAuthorizedUserClient = WuB
})
// @from(Ln 224153, Col 4)
UuB = U((nH) => {
  var Ho = nH && nH.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    HuB = nH && nH.__classPrivateFieldSet || function (A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    Eo, ZWA, YWA, CuB;
  Object.defineProperty(nH, "__esModule", {
    value: !0
  });
  nH.GoogleAuth = nH.GoogleAuthExceptionMessages = nH.CLOUD_SDK_CLIENT_ID = void 0;
  var qv8 = NA("child_process"),
    UTA = NA("fs"),
    $TA = JTA(),
    Nv8 = NA("os"),
    Y30 = NA("path"),
    wv8 = lDA(),
    Lv8 = ITA(),
    Ov8 = Y60(),
    Mv8 = J60(),
    Rv8 = X60(),
    BWA = O60(),
    EuB = M60(),
    GWA = R60(),
    _v8 = B30(),
    CTA = Fo(),
    Z30 = ck(),
    zuB = FuB(),
    $uB = Ko();
  nH.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
  nH.GoogleAuthExceptionMessages = {
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
  class J30 {
    get isGCE() {
      return this.checkIsGCE
    }
    constructor(A = {}) {
      if (Eo.add(this), this.checkIsGCE = void 0, this.jsonContent = null, this.cachedCredential = null, ZWA.set(this, null), this.clientOptions = {}, this._cachedProjectId = A.projectId || null, this.cachedCredential = A.authClient || null, this.keyFilename = A.keyFilename || A.keyFile, this.scopes = A.scopes, this.clientOptions = A.clientOptions || {}, this.jsonContent = A.credentials || null, this.apiKey = A.apiKey || this.clientOptions.apiKey || null, this.apiKey && (this.jsonContent || this.clientOptions.credentials)) throw RangeError(nH.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
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
        if (A instanceof Error && A.message === nH.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) return null;
        else throw A
      }
    }
    async findAndCacheProjectId() {
      let A = null;
      if (A || (A = await this.getProductionProjectId()), A || (A = await this.getFileProjectId()), A || (A = await this.getDefaultServiceProjectId()), A || (A = await this.getGCEProjectId()), A || (A = await this.getExternalAccountClientProjectId()), A) return this._cachedProjectId = A, A;
      else throw Error(nH.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND)
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
        Q = await $TA.universe("universe-domain"), Q || (Q = Z30.DEFAULT_UNIVERSE)
      } catch (B) {
        if (B && ((A = B === null || B === void 0 ? void 0 : B.response) === null || A === void 0 ? void 0 : A.status) === 404) Q = Z30.DEFAULT_UNIVERSE;
        else throw B
      }
      return Q
    }
    async getUniverseDomain() {
      let A = (0, $uB.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
      try {
        A !== null && A !== void 0 || (A = (await this.getClient()).universeDomain)
      } catch (Q) {
        A !== null && A !== void 0 || (A = Z30.DEFAULT_UNIVERSE)
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
      if (this.cachedCredential) return await Ho(this, Eo, "m", YWA).call(this, this.cachedCredential, null);
      let Q;
      if (Q = await this._tryGetApplicationCredentialsFromEnvironmentVariable(A), Q) {
        if (Q instanceof BWA.JWT) Q.scopes = this.scopes;
        else if (Q instanceof CTA.BaseExternalAccountClient) Q.scopes = this.getAnyScopes();
        return await Ho(this, Eo, "m", YWA).call(this, Q)
      }
      if (Q = await this._tryGetApplicationCredentialsFromWellKnownFile(A), Q) {
        if (Q instanceof BWA.JWT) Q.scopes = this.scopes;
        else if (Q instanceof CTA.BaseExternalAccountClient) Q.scopes = this.getAnyScopes();
        return await Ho(this, Eo, "m", YWA).call(this, Q)
      }
      if (await this._checkIsGCE()) return A.scopes = this.getAnyScopes(), await Ho(this, Eo, "m", YWA).call(this, new Ov8.Compute(A));
      throw Error(nH.GoogleAuthExceptionMessages.NO_ADC_FOUND)
    }
    async _checkIsGCE() {
      if (this.checkIsGCE === void 0) this.checkIsGCE = $TA.getGCPResidency() || await $TA.isAvailable();
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
        if (G) Q = Y30.join(G, ".config")
      }
      if (Q) {
        if (Q = Y30.join(Q, "gcloud", "application_default_credentials.json"), !UTA.existsSync(Q)) Q = null
      }
      if (!Q) return null;
      return await this._getApplicationCredentialsFromFilePath(Q, A)
    }
    async _getApplicationCredentialsFromFilePath(A, Q = {}) {
      if (!A || A.length === 0) throw Error("The file path is invalid.");
      try {
        if (A = UTA.realpathSync(A), !UTA.lstatSync(A).isFile()) throw Error()
      } catch (G) {
        if (G instanceof Error) G.message = `The file at ${A} does not exist, or it is not a file. ${G.message}`;
        throw G
      }
      let B = UTA.createReadStream(A);
      return this.fromStream(B, Q)
    }
    fromImpersonatedJSON(A) {
      var Q, B, G, Z;
      if (!A) throw Error("Must pass in a JSON object containing an  impersonated refresh token");
      if (A.type !== GWA.IMPERSONATED_ACCOUNT_TYPE) throw Error(`The incoming JSON object does not have the "${GWA.IMPERSONATED_ACCOUNT_TYPE}" type`);
      if (!A.source_credentials) throw Error("The incoming JSON object does not contain a source_credentials field");
      if (!A.service_account_impersonation_url) throw Error("The incoming JSON object does not contain a service_account_impersonation_url field");
      let Y = this.fromJSON(A.source_credentials);
      if (((Q = A.service_account_impersonation_url) === null || Q === void 0 ? void 0 : Q.length) > 256) throw RangeError(`Target principal is too long: ${A.service_account_impersonation_url}`);
      let J = (G = (B = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(A.service_account_impersonation_url)) === null || B === void 0 ? void 0 : B.groups) === null || G === void 0 ? void 0 : G.target;
      if (!J) throw RangeError(`Cannot extract target principal from ${A.service_account_impersonation_url}`);
      let X = (Z = this.getAnyScopes()) !== null && Z !== void 0 ? Z : [];
      return new GWA.Impersonated({
        ...A,
        sourceClient: Y,
        targetPrincipal: J,
        targetScopes: Array.isArray(X) ? X : [X]
      })
    }
    fromJSON(A, Q = {}) {
      let B, G = (0, $uB.originalOrCamelOptions)(Q).get("universe_domain");
      if (A.type === EuB.USER_REFRESH_ACCOUNT_TYPE) B = new EuB.UserRefreshClient(Q), B.fromJSON(A);
      else if (A.type === GWA.IMPERSONATED_ACCOUNT_TYPE) B = this.fromImpersonatedJSON(A);
      else if (A.type === CTA.EXTERNAL_ACCOUNT_TYPE) B = _v8.ExternalAccountClient.fromJSON(A, Q), B.scopes = this.getAnyScopes();
      else if (A.type === zuB.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) B = new zuB.ExternalAccountAuthorizedUserClient(A, Q);
      else Q.scopes = this.scopes, B = new BWA.JWT(Q), this.setGapicJWTValues(B), B.fromJSON(A);
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
        A.setEncoding("utf8").on("error", G).on("data", (Y) => Z.push(Y)).on("end", () => {
          try {
            try {
              let Y = JSON.parse(Z.join("")),
                J = this._cacheClientFromJSON(Y, Q);
              return B(J)
            } catch (Y) {
              if (!this.keyFilename) throw Y;
              let J = new BWA.JWT({
                ...this.clientOptions,
                keyFile: this.keyFilename
              });
              return this.cachedCredential = J, this.setGapicJWTValues(J), B(J)
            }
          } catch (Y) {
            return G(Y)
          }
        })
      })
    }
    fromAPIKey(A, Q = {}) {
      return new BWA.JWT({
        ...Q,
        apiKey: A
      })
    }
    _isWindows() {
      let A = Nv8.platform();
      if (A && A.length >= 3) {
        if (A.substring(0, 3).toLowerCase() === "win") return !0
      }
      return !1
    }
    async getDefaultServiceProjectId() {
      return new Promise((A) => {
        (0, qv8.exec)("gcloud config config-helper --format json", (Q, B) => {
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
      if (!this.jsonContent || this.jsonContent.type !== CTA.EXTERNAL_ACCOUNT_TYPE) return null;
      return await (await this.getClient()).getProjectId()
    }
    async getGCEProjectId() {
      try {
        return await $TA.project("project-id")
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
      if (A instanceof GWA.Impersonated) return {
        client_email: A.getTargetPrincipal()
      };
      if (A instanceof CTA.BaseExternalAccountClient) {
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
        let [Q, B] = await Promise.all([$TA.instance("service-accounts/default/email"), this.getUniverseDomain()]);
        return {
          client_email: Q,
          universe_domain: B
        }
      }
      throw Error(nH.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND)
    }
    async getClient() {
      if (this.cachedCredential) return this.cachedCredential;
      HuB(this, ZWA, Ho(this, ZWA, "f") || Ho(this, Eo, "m", CuB).call(this), "f");
      try {
        return await Ho(this, ZWA, "f")
      } finally {
        HuB(this, ZWA, null, "f")
      }
    }
    async getIdTokenClient(A) {
      let Q = await this.getClient();
      if (!("fetchIdToken" in Q)) throw Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
      return new Mv8.IdTokenClient({
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
      return (0, Rv8.getEnv)()
    }
    async sign(A, Q) {
      let B = await this.getClient(),
        G = await this.getUniverseDomain();
      if (Q = Q || `https://iamcredentials.${G}/v1/projects/-/serviceAccounts/`, B instanceof GWA.Impersonated) return (await B.sign(A)).signedBlob;
      let Z = (0, wv8.createCrypto)();
      if (B instanceof BWA.JWT && B.key) return await Z.sign(B.key, A);
      let Y = await this.getCredentials();
      if (!Y.client_email) throw Error("Cannot sign data without `client_email`.");
      return this.signBlob(Z, Y.client_email, A, Q)
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
  nH.GoogleAuth = J30;
  ZWA = new WeakMap, Eo = new WeakSet, YWA = async function (Q, B = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || null) {
    let G = await this.getProjectIdOptional();
    if (B) Q.quotaProjectId = B;
    return this.cachedCredential = Q, {
      credential: Q,
      projectId: G
    }
  }, CuB = async function () {
    if (this.jsonContent) return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
    else if (this.keyFilename) {
      let Q = Y30.resolve(this.keyFilename),
        B = UTA.createReadStream(Q);
      return await this.fromStreamAsync(B, this.clientOptions)
    } else if (this.apiKey) {
      let Q = await this.fromAPIKey(this.apiKey, this.clientOptions);
      Q.scopes = this.scopes;
      let {
        credential: B
      } = await Ho(this, Eo, "m", YWA).call(this, Q);
      return B
    } else {
      let {
        credential: Q
      } = await this.getApplicationDefaultAsync(this.clientOptions);
      return Q
    }
  };
  J30.DefaultTransporter = Lv8.DefaultTransporter
})
// @from(Ln 224551, Col 4)
LuB = U((NuB) => {
  Object.defineProperty(NuB, "__esModule", {
    value: !0
  });
  NuB.IAMAuth = void 0;
  class quB {
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
  NuB.IAMAuth = quB
})
// @from(Ln 224569, Col 4)
_uB = U((MuB) => {
  Object.defineProperty(MuB, "__esModule", {
    value: !0
  });
  MuB.DownscopedClient = MuB.EXPIRATION_TIME_OFFSET = MuB.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
  var jv8 = NA("stream"),
    Tv8 = ck(),
    Pv8 = T60(),
    Sv8 = "urn:ietf:params:oauth:grant-type:token-exchange",
    xv8 = "urn:ietf:params:oauth:token-type:access_token",
    yv8 = "urn:ietf:params:oauth:token-type:access_token";
  MuB.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
  MuB.EXPIRATION_TIME_OFFSET = 300000;
  class OuB extends Tv8.AuthClient {
    constructor(A, Q, B, G) {
      super({
        ...B,
        quotaProjectId: G
      });
      if (this.authClient = A, this.credentialAccessBoundary = Q, Q.accessBoundary.accessBoundaryRules.length === 0) throw Error("At least one access boundary rule needs to be defined.");
      else if (Q.accessBoundary.accessBoundaryRules.length > MuB.MAX_ACCESS_BOUNDARY_RULES_COUNT) throw Error(`The provided access boundary has more than ${MuB.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
      for (let Z of Q.accessBoundary.accessBoundaryRules)
        if (Z.availablePermissions.length === 0) throw Error("At least one permission should be defined in access boundary rules.");
      this.stsCredential = new Pv8.StsCredentials(`https://sts.${this.universeDomain}/v1/token`), this.cachedDownscopedAccessToken = null
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
          let Y = Z.status,
            J = Z.config.data instanceof jv8.Readable;
          if (!Q && (Y === 401 || Y === 403) && !J && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
        }
        throw G
      }
      return B
    }
    async refreshAccessTokenAsync() {
      var A;
      let Q = (await this.authClient.getAccessToken()).token,
        B = {
          grantType: Sv8,
          requestedTokenType: xv8,
          subjectToken: Q,
          subjectTokenType: yv8
        },
        G = await this.stsCredential.exchangeToken(B, void 0, this.credentialAccessBoundary),
        Z = ((A = this.authClient.credentials) === null || A === void 0 ? void 0 : A.expiry_date) || null,
        Y = G.expires_in ? new Date().getTime() + G.expires_in * 1000 : Z;
      return this.cachedDownscopedAccessToken = {
        access_token: G.access_token,
        expiry_date: Y,
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
  MuB.DownscopedClient = OuB
})
// @from(Ln 224667, Col 4)
PuB = U((juB) => {
  Object.defineProperty(juB, "__esModule", {
    value: !0
  });
  juB.PassThroughClient = void 0;
  var kv8 = ck();
  class I30 extends kv8.AuthClient {
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
  juB.PassThroughClient = I30;
  var bv8 = new I30;
  bv8.getAccessToken()
})
// @from(Ln 224688, Col 4)
W30 = U((ZY) => {
  Object.defineProperty(ZY, "__esModule", {
    value: !0
  });
  ZY.GoogleAuth = ZY.auth = ZY.DefaultTransporter = ZY.PassThroughClient = ZY.ExecutableError = ZY.PluggableAuthClient = ZY.DownscopedClient = ZY.BaseExternalAccountClient = ZY.ExternalAccountClient = ZY.IdentityPoolClient = ZY.AwsRequestSigner = ZY.AwsClient = ZY.UserRefreshClient = ZY.LoginTicket = ZY.ClientAuthentication = ZY.OAuth2Client = ZY.CodeChallengeMethod = ZY.Impersonated = ZY.JWT = ZY.JWTAccess = ZY.IdTokenClient = ZY.IAMAuth = ZY.GCPEnv = ZY.Compute = ZY.DEFAULT_UNIVERSE = ZY.AuthClient = ZY.gaxios = ZY.gcpMetadata = void 0;
  var SuB = UuB();
  Object.defineProperty(ZY, "GoogleAuth", {
    enumerable: !0,
    get: function () {
      return SuB.GoogleAuth
    }
  });
  ZY.gcpMetadata = JTA();
  ZY.gaxios = cP();
  var xuB = ck();
  Object.defineProperty(ZY, "AuthClient", {
    enumerable: !0,
    get: function () {
      return xuB.AuthClient
    }
  });
  Object.defineProperty(ZY, "DEFAULT_UNIVERSE", {
    enumerable: !0,
    get: function () {
      return xuB.DEFAULT_UNIVERSE
    }
  });
  var fv8 = Y60();
  Object.defineProperty(ZY, "Compute", {
    enumerable: !0,
    get: function () {
      return fv8.Compute
    }
  });
  var hv8 = X60();
  Object.defineProperty(ZY, "GCPEnv", {
    enumerable: !0,
    get: function () {
      return hv8.GCPEnv
    }
  });
  var gv8 = LuB();
  Object.defineProperty(ZY, "IAMAuth", {
    enumerable: !0,
    get: function () {
      return gv8.IAMAuth
    }
  });
  var uv8 = J60();
  Object.defineProperty(ZY, "IdTokenClient", {
    enumerable: !0,
    get: function () {
      return uv8.IdTokenClient
    }
  });
  var mv8 = w60();
  Object.defineProperty(ZY, "JWTAccess", {
    enumerable: !0,
    get: function () {
      return mv8.JWTAccess
    }
  });
  var dv8 = O60();
  Object.defineProperty(ZY, "JWT", {
    enumerable: !0,
    get: function () {
      return dv8.JWT
    }
  });
  var cv8 = R60();
  Object.defineProperty(ZY, "Impersonated", {
    enumerable: !0,
    get: function () {
      return cv8.Impersonated
    }
  });
  var D30 = E2A();
  Object.defineProperty(ZY, "CodeChallengeMethod", {
    enumerable: !0,
    get: function () {
      return D30.CodeChallengeMethod
    }
  });
  Object.defineProperty(ZY, "OAuth2Client", {
    enumerable: !0,
    get: function () {
      return D30.OAuth2Client
    }
  });
  Object.defineProperty(ZY, "ClientAuthentication", {
    enumerable: !0,
    get: function () {
      return D30.ClientAuthentication
    }
  });
  var pv8 = B60();
  Object.defineProperty(ZY, "LoginTicket", {
    enumerable: !0,
    get: function () {
      return pv8.LoginTicket
    }
  });
  var lv8 = M60();
  Object.defineProperty(ZY, "UserRefreshClient", {
    enumerable: !0,
    get: function () {
      return lv8.UserRefreshClient
    }
  });
  var iv8 = p60();
  Object.defineProperty(ZY, "AwsClient", {
    enumerable: !0,
    get: function () {
      return iv8.AwsClient
    }
  });
  var nv8 = m60();
  Object.defineProperty(ZY, "AwsRequestSigner", {
    enumerable: !0,
    get: function () {
      return nv8.AwsRequestSigner
    }
  });
  var av8 = u60();
  Object.defineProperty(ZY, "IdentityPoolClient", {
    enumerable: !0,
    get: function () {
      return av8.IdentityPoolClient
    }
  });
  var ov8 = B30();
  Object.defineProperty(ZY, "ExternalAccountClient", {
    enumerable: !0,
    get: function () {
      return ov8.ExternalAccountClient
    }
  });
  var rv8 = Fo();
  Object.defineProperty(ZY, "BaseExternalAccountClient", {
    enumerable: !0,
    get: function () {
      return rv8.BaseExternalAccountClient
    }
  });
  var sv8 = _uB();
  Object.defineProperty(ZY, "DownscopedClient", {
    enumerable: !0,
    get: function () {
      return sv8.DownscopedClient
    }
  });
  var yuB = S61();
  Object.defineProperty(ZY, "PluggableAuthClient", {
    enumerable: !0,
    get: function () {
      return yuB.PluggableAuthClient
    }
  });
  Object.defineProperty(ZY, "ExecutableError", {
    enumerable: !0,
    get: function () {
      return yuB.ExecutableError
    }
  });
  var tv8 = PuB();
  Object.defineProperty(ZY, "PassThroughClient", {
    enumerable: !0,
    get: function () {
      return tv8.PassThroughClient
    }
  });
  var ev8 = ITA();
  Object.defineProperty(ZY, "DefaultTransporter", {
    enumerable: !0,
    get: function () {
      return ev8.DefaultTransporter
    }
  });
  var Ak8 = new SuB.GoogleAuth;
  ZY.auth = Ak8
})
// @from(Ln 224869, Col 4)
x61 = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Ln 224874, Col 4)
vuB = w(() => {
  $C()
})
// @from(Ln 224878, Col 0)
function y61(A) {
  return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 224881, Col 4)
K30 = (A) => (K30 = Array.isArray, K30(A))
// @from(Ln 224882, Col 2)
V30
// @from(Ln 224883, Col 4)
F30 = w(() => {
  vuB();
  V30 = K30
})
// @from(Ln 224888, Col 0)
function* Yk8(A) {
  if (!A) return;
  if (kuB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let Y of Z) yield [Y, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (V30(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let Y = V30(G[1]) ? G[1] : [G[1]],
      J = !1;
    for (let X of Y) {
      if (X === void 0) continue;
      if (Q && !J) J = !0, yield [Z, null];
      yield [Z, X]
    }
  }
}
// @from(Ln 224916, Col 4)
kuB
// @from(Ln 224916, Col 9)
buB = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [Y, J] of Yk8(G)) {
      let X = Y.toLowerCase();
      if (!Z.has(X)) Q.delete(Y), Z.add(X);
      if (J === null) Q.delete(Y), B.add(X);
      else Q.append(Y, J), B.delete(X)
    }
  }
  return {
    [kuB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Ln 224934, Col 4)
fuB = w(() => {
  F30();
  kuB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 224939, Col 0)
function Ik8(A) {
  let Q = new rL(A);
  return delete Q.batches, Q
}
// @from(Ln 224944, Col 0)
function Dk8(A) {
  let Q = new Pz(A);
  return delete Q.messages.batches, Q
}
// @from(Ln 224948, Col 4)
huB
// @from(Ln 224948, Col 9)
Jk8 = "vertex-2023-10-16"
// @from(Ln 224949, Col 2)
Xk8
// @from(Ln 224949, Col 7)
v61
// @from(Ln 224950, Col 4)
H30 = w(() => {
  $m();
  bjA();
  F30();
  fuB();
  $m();
  huB = c(W30(), 1), Xk8 = new Set(["/v1/messages", "/v1/messages?beta=true"]);
  v61 = class v61 extends IZ {
    constructor({
      baseURL: A = x61("ANTHROPIC_VERTEX_BASE_URL"),
      region: Q = x61("CLOUD_ML_REGION") ?? null,
      projectId: B = x61("ANTHROPIC_VERTEX_PROJECT_ID") ?? null,
      ...G
    } = {}) {
      if (!Q) throw Error("No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.");
      super({
        baseURL: A || (Q === "global" ? "https://aiplatform.googleapis.com/v1" : `https://${Q}-aiplatform.googleapis.com/v1`),
        ...G
      });
      if (this.messages = Ik8(this), this.beta = Dk8(this), this.region = Q, this.projectId = B, this.accessToken = G.accessToken ?? null, G.authClient && G.googleAuth) throw Error("You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.");
      else if (G.authClient) this._authClientPromise = Promise.resolve(G.authClient);
      else this._auth = G.googleAuth ?? new huB.GoogleAuth({
        scopes: "https://www.googleapis.com/auth/cloud-platform"
      }), this._authClientPromise = this._auth.getClient()
    }
    validateHeaders() {}
    async prepareOptions(A) {
      let Q = await this._authClientPromise,
        B = await Q.getRequestHeaders(),
        G = Q.projectId ?? B["x-goog-user-project"];
      if (!this.projectId && G) this.projectId = G;
      A.headers = buB([B, A.headers])
    }
    async buildRequest(A) {
      if (y61(A.body)) A.body = {
        ...A.body
      };
      if (y61(A.body)) {
        if (!A.body.anthropic_version) A.body.anthropic_version = Jk8
      }
      if (Xk8.has(A.path) && A.method === "post") {
        if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
        if (!y61(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
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
// @from(Ln 225006, Col 4)
guB = w(() => {
  H30();
  H30()
})
// @from(Ln 225010, Col 4)
k61 = "4.10.1"
// @from(Ln 225011, Col 2)
z30 = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
// @from(Ln 225012, Col 2)
uuB = "common"
// @from(Ln 225013, Col 2)
E30
// @from(Ln 225013, Col 7)
qTA
// @from(Ln 225013, Col 12)
muB = "login.microsoftonline.com"
// @from(Ln 225014, Col 2)
duB
// @from(Ln 225014, Col 7)
cuB = "cae"
// @from(Ln 225015, Col 2)
puB = "nocae"
// @from(Ln 225016, Col 2)
luB = "msal.cache"
// @from(Ln 225017, Col 4)
JWA = w(() => {
  (function (A) {
    A.AzureChina = "https://login.chinacloudapi.cn", A.AzureGermany = "https://login.microsoftonline.de", A.AzureGovernment = "https://login.microsoftonline.us", A.AzurePublicCloud = "https://login.microsoftonline.com"
  })(E30 || (E30 = {}));
  qTA = E30.AzurePublicCloud, duB = ["*"]
})
// @from(Ln 225024, Col 0)
function Wk8(A) {
  var Q, B, G, Z, Y, J, X;
  let I = {
    cache: {},
    broker: {
      isEnabled: (B = (Q = A.brokerOptions) === null || Q === void 0 ? void 0 : Q.enabled) !== null && B !== void 0 ? B : !1,
      enableMsaPassthrough: (Z = (G = A.brokerOptions) === null || G === void 0 ? void 0 : G.legacyEnableMsaPassthrough) !== null && Z !== void 0 ? Z : !1,
      parentWindowHandle: (Y = A.brokerOptions) === null || Y === void 0 ? void 0 : Y.parentWindowHandle
    }
  };
  if ((J = A.tokenCachePersistenceOptions) === null || J === void 0 ? void 0 : J.enabled) {
    if ($30 === void 0) throw Error(["Persistent token caching was requested, but no persistence provider was configured.", "You must install the identity-cache-persistence plugin package (`npm install --save @azure/identity-cache-persistence`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(cachePersistencePlugin)` before using `tokenCachePersistenceOptions`."].join(" "));
    let D = A.tokenCachePersistenceOptions.name || luB;
    I.cache.cachePlugin = $30(Object.assign({
      name: `${D}.${puB}`
    }, A.tokenCachePersistenceOptions)), I.cache.cachePluginCae = $30(Object.assign({
      name: `${D}.${cuB}`
    }, A.tokenCachePersistenceOptions))
  }
  if ((X = A.brokerOptions) === null || X === void 0 ? void 0 : X.enabled) {
    if (iuB === void 0) throw Error(["Broker for WAM was requested to be enabled, but no native broker was configured.", "You must install the identity-broker plugin package (`npm install --save @azure/identity-broker`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(createNativeBrokerPlugin())` before using `enableBroker`."].join(" "));
    I.broker.nativeBrokerPlugin = iuB.broker
  }
  return I
}
// @from(Ln 225049, Col 4)
$30 = void 0
// @from(Ln 225050, Col 2)
iuB = void 0
// @from(Ln 225051, Col 2)
nuB
// @from(Ln 225052, Col 4)
auB = w(() => {
  JWA();
  nuB = {
    generatePluginConfiguration: Wk8
  }
})
// @from(Ln 225064, Col 0)
function ruB(A, ...Q) {
  ouB.stderr.write(`${Vk8.format(A,...Q)}${Kk8}`)
}
// @from(Ln 225067, Col 4)
suB = () => {}
// @from(Ln 225069, Col 0)
function q30(A) {
  euB = A, C30 = [], U30 = [];
  let Q = /\*/g,
    B = A.split(",").map((G) => G.trim().replace(Q, ".*?"));
  for (let G of B)
    if (G.startsWith("-")) U30.push(new RegExp(`^${G.substr(1)}$`));
    else C30.push(new RegExp(`^${G}$`));
  for (let G of b61) G.enabled = N30(G.namespace)
}
// @from(Ln 225079, Col 0)
function N30(A) {
  if (A.endsWith("*")) return !0;
  for (let Q of U30)
    if (Q.test(A)) return !1;
  for (let Q of C30)
    if (Q.test(A)) return !0;
  return !1
}
// @from(Ln 225088, Col 0)
function Fk8() {
  let A = euB || "";
  return q30(""), A
}
// @from(Ln 225093, Col 0)
function QmB(A) {
  let Q = Object.assign(B, {
    enabled: N30(A),
    destroy: Hk8,
    log: AmB.log,
    namespace: A,
    extend: Ek8
  });

  function B(...G) {
    if (!Q.enabled) return;
    if (G.length > 0) G[0] = `${A} ${G[0]}`;
    Q.log(...G)
  }
  return b61.push(Q), Q
}
// @from(Ln 225110, Col 0)
function Hk8() {
  let A = b61.indexOf(this);
  if (A >= 0) return b61.splice(A, 1), !0;
  return !1
}
// @from(Ln 225116, Col 0)
function Ek8(A) {
  let Q = QmB(`${this.namespace}:${A}`);
  return Q.log = this.log, Q
}
// @from(Ln 225120, Col 4)
tuB
// @from(Ln 225120, Col 9)
euB
// @from(Ln 225120, Col 14)
C30
// @from(Ln 225120, Col 19)
U30
// @from(Ln 225120, Col 24)
b61
// @from(Ln 225120, Col 29)
AmB
// @from(Ln 225120, Col 34)
XWA
// @from(Ln 225121, Col 4)
BmB = w(() => {
  suB();
  tuB = typeof process < "u" && process.env && process.env.DEBUG || void 0, C30 = [], U30 = [], b61 = [];
  if (tuB) q30(tuB);
  AmB = Object.assign((A) => {
    return QmB(A)
  }, {
    enable: q30,
    enabled: N30,
    disable: Fk8,
    log: ruB
  });
  XWA = AmB
})
// @from(Ln 225136, Col 0)
function ZmB(A, Q) {
  Q.log = (...B) => {
    A.log(...B)
  }
}
// @from(Ln 225142, Col 0)
function YmB(A) {
  return w30.includes(A)
}
// @from(Ln 225146, Col 0)
function f61(A) {
  let Q = new Set,
    B = typeof process < "u" && process.env && process.env[A.logLevelEnvVarName] || void 0,
    G, Z = XWA(A.namespace);
  Z.log = (...W) => {
    XWA.log(...W)
  };

  function Y(W) {
    if (W && !YmB(W)) throw Error(`Unknown log level '${W}'. Acceptable values: ${w30.join(",")}`);
    G = W;
    let K = [];
    for (let V of Q)
      if (J(V)) K.push(V.namespace);
    XWA.enable(K.join(","))
  }
  if (B)
    if (YmB(B)) Y(B);
    else console.error(`${A.logLevelEnvVarName} set to unknown log level '${B}'; logging is not enabled. Acceptable values: ${w30.join(", ")}.`);

  function J(W) {
    return Boolean(G && GmB[W.level] <= GmB[G])
  }

  function X(W, K) {
    let V = Object.assign(W.extend(K), {
      level: K
    });
    if (ZmB(W, V), J(V)) {
      let F = XWA.disable();
      XWA.enable(F + "," + V.namespace)
    }
    return Q.add(V), V
  }

  function I() {
    return G
  }

  function D(W) {
    let K = Z.extend(W);
    return ZmB(Z, K), {
      error: X(K, "error"),
      warning: X(K, "warning"),
      info: X(K, "info"),
      verbose: X(K, "verbose")
    }
  }
  return {
    setLogLevel: Y,
    getLogLevel: I,
    createClientLogger: D,
    logger: Z
  }
}
// @from(Ln 225202, Col 0)
function h61(A) {
  return JmB.createClientLogger(A)
}
// @from(Ln 225205, Col 4)
w30
// @from(Ln 225205, Col 9)
GmB
// @from(Ln 225205, Col 14)
JmB
// @from(Ln 225205, Col 19)
BiG
// @from(Ln 225206, Col 4)
g61 = w(() => {
  BmB();
  w30 = ["verbose", "info", "warning", "error"], GmB = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100
  };
  JmB = f61({
    logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
    namespace: "typeSpecRuntime"
  }), BiG = JmB.logger
})
// @from(Ln 225219, Col 4)
XmB = w(() => {
  g61()
})
// @from(Ln 225223, Col 0)
function u61() {
  return L30.getLogLevel()
}
// @from(Ln 225227, Col 0)
function zo(A) {
  return L30.createClientLogger(A)
}
// @from(Ln 225230, Col 4)
L30
// @from(Ln 225230, Col 9)
XiG
// @from(Ln 225231, Col 4)
$2A = w(() => {
  XmB();
  L30 = f61({
    logLevelEnvVarName: "AZURE_LOG_LEVEL",
    namespace: "azure"
  }), XiG = L30.logger
})
// @from(Ln 225239, Col 0)
function m61(A) {
  return A.reduce((Q, B) => {
    if (process.env[B]) Q.assigned.push(B);
    else Q.missing.push(B);
    return Q
  }, {
    missing: [],
    assigned: []
  })
}
// @from(Ln 225250, Col 0)
function HF(A) {
  return `SUCCESS. Scopes: ${Array.isArray(A)?A.join(", "):A}.`
}
// @from(Ln 225254, Col 0)
function PG(A, Q) {
  let B = "ERROR.";
  if (A === null || A === void 0 ? void 0 : A.length) B += ` Scopes: ${Array.isArray(A)?A.join(", "):A}.`;
  return `${B} Error message: ${typeof Q==="string"?Q:Q.message}.`
}
// @from(Ln 225260, Col 0)
function ImB(A, Q, B = $_) {
  let G = Q ? `${Q.fullTitle} ${A}` : A;

  function Z(I) {
    B.info(`${G} =>`, I)
  }

  function Y(I) {
    B.warning(`${G} =>`, I)
  }

  function J(I) {
    B.verbose(`${G} =>`, I)
  }

  function X(I) {
    B.error(`${G} =>`, I)
  }
  return {
    title: A,
    fullTitle: G,
    info: Z,
    warning: Y,
    verbose: J,
    error: X
  }
}
// @from(Ln 225288, Col 0)
function p7(A, Q = $_) {
  let B = ImB(A, void 0, Q);
  return Object.assign(Object.assign({}, B), {
    parent: Q,
    getToken: ImB("=> getToken()", B, Q)
  })
}
// @from(Ln 225295, Col 4)
$_
// @from(Ln 225296, Col 4)
uD = w(() => {
  $2A();
  $_ = zo("identity")
})
// @from(Ln 225301, Col 0)
function zk8(A) {
  return A && typeof A.error === "string" && typeof A.error_description === "string"
}
// @from(Ln 225305, Col 0)
function DmB(A) {
  return {
    error: A.error,
    errorDescription: A.error_description,
    correlationId: A.correlation_id,
    errorCodes: A.error_codes,
    timestamp: A.timestamp,
    traceId: A.trace_id
  }
}
// @from(Ln 225315, Col 4)
$k8 = "CredentialUnavailableError"
// @from(Ln 225316, Col 2)
U4
// @from(Ln 225316, Col 6)
O30 = "AuthenticationError"
// @from(Ln 225317, Col 2)
NTA
// @from(Ln 225317, Col 7)
Ck8 = "AggregateAuthenticationError"
// @from(Ln 225318, Col 2)
M30
// @from(Ln 225318, Col 7)
jm
// @from(Ln 225319, Col 4)
RC = w(() => {
  U4 = class U4 extends Error {
    constructor(A, Q) {
      super(A, Q);
      this.name = $k8
    }
  };
  NTA = class NTA extends Error {
    constructor(A, Q, B) {
      let G = {
        error: "unknown",
        errorDescription: "An unknown error occurred and no additional details are available."
      };
      if (zk8(Q)) G = DmB(Q);
      else if (typeof Q === "string") try {
        let Z = JSON.parse(Q);
        G = DmB(Z)
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
      this.statusCode = A, this.errorResponse = G, this.name = O30
    }
  };
  M30 = class M30 extends Error {
    constructor(A, Q) {
      let B = A.join(`
`);
      super(`${Q}
${B}`);
      this.errors = A, this.name = Ck8
    }
  };
  jm = class jm extends Error {
    constructor(A) {
      super(A.message, A.cause ? {
        cause: A.cause
      } : void 0);
      this.scopes = A.scopes, this.getTokenOptions = A.getTokenOptions, this.name = "AuthenticationRequiredError"
    }
  }
})
// @from(Ln 225378, Col 0)
function Uk8(A) {
  return `The current credential is not configured to acquire tokens for tenant ${A}. To enable acquiring tokens for this tenant add it to the AdditionallyAllowedTenants on the credential options, or add "*" to AdditionallyAllowedTenants to allow acquiring tokens for any tenant.`
}
// @from(Ln 225382, Col 0)
function _C(A, Q, B = [], G) {
  var Z;
  let Y;
  if (process.env.AZURE_IDENTITY_DISABLE_MULTITENANTAUTH) Y = A;
  else if (A === "adfs") Y = A;
  else Y = (Z = Q === null || Q === void 0 ? void 0 : Q.tenantId) !== null && Z !== void 0 ? Z : A;
  if (A && Y !== A && !B.includes("*") && !B.some((J) => J.localeCompare(Y) === 0)) {
    let J = Uk8(Y);
    throw G === null || G === void 0 || G.info(J), new U4(J)
  }
  return Y
}
// @from(Ln 225394, Col 4)
WmB = w(() => {
  RC()
})
// @from(Ln 225398, Col 0)
function IN(A, Q) {
  if (!Q.match(/^[0-9a-zA-Z-.]+$/)) {
    let B = Error("Invalid tenant id provided. You can locate your tenant id by following the instructions listed here: https://learn.microsoft.com/partner-center/find-ids-and-domain-names.");
    throw A.info(PG("", B)), B
  }
}
// @from(Ln 225405, Col 0)
function KmB(A, Q, B) {
  if (Q) return IN(A, Q), Q;
  if (!B) B = z30;
  if (B !== z30) return "common";
  return "organizations"
}
// @from(Ln 225412, Col 0)
function DN(A) {
  if (!A || A.length === 0) return [];
  if (A.includes("*")) return duB;
  return A
}
// @from(Ln 225417, Col 4)
rP = w(() => {
  JWA();
  uD();
  WmB()
})
// @from(Ln 225422, Col 4)
R30 = "$"
// @from(Ln 225423, Col 2)
d61 = "_"
// @from(Ln 225425, Col 0)
function qk8(A, Q) {
  return Q !== "Composite" && Q !== "Dictionary" && (typeof A === "string" || typeof A === "number" || typeof A === "boolean" || (Q === null || Q === void 0 ? void 0 : Q.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i)) !== null || A === void 0 || A === null)
}
// @from(Ln 225429, Col 0)
function Nk8(A) {
  let Q = Object.assign(Object.assign({}, A.headers), A.body);
  if (A.hasNullableType && Object.getOwnPropertyNames(Q).length === 0) return A.shouldWrapBody ? {
    body: null
  } : null;
  else return A.shouldWrapBody ? Object.assign(Object.assign({}, A.headers), {
    body: A.body
  }) : Q
}
// @from(Ln 225439, Col 0)
function _30(A, Q) {
  var B, G;
  let Z = A.parsedHeaders;
  if (A.request.method === "HEAD") return Object.assign(Object.assign({}, Z), {
    body: A.parsedBody
  });
  let Y = Q && Q.bodyMapper,
    J = Boolean(Y === null || Y === void 0 ? void 0 : Y.nullable),
    X = Y === null || Y === void 0 ? void 0 : Y.type.name;
  if (X === "Stream") return Object.assign(Object.assign({}, Z), {
    blobBody: A.blobBody,
    readableStreamBody: A.readableStreamBody
  });
  let I = X === "Composite" && Y.type.modelProperties || {},
    D = Object.keys(I).some((W) => I[W].serializedName === "");
  if (X === "Sequence" || D) {
    let W = (B = A.parsedBody) !== null && B !== void 0 ? B : [];
    for (let K of Object.keys(I))
      if (I[K].serializedName) W[K] = (G = A.parsedBody) === null || G === void 0 ? void 0 : G[K];
    if (Z)
      for (let K of Object.keys(Z)) W[K] = Z[K];
    return J && !A.parsedBody && !Z && Object.getOwnPropertyNames(I).length === 0 ? null : W
  }
  return Nk8({
    body: A.parsedBody,
    headers: Z,
    hasNullableType: J,
    shouldWrapBody: qk8(A.parsedBody, X)
  })
}
// @from(Ln 225469, Col 4)
VmB = () => {}
// @from(Ln 225470, Col 4)
Tm
// @from(Ln 225471, Col 4)
c61 = w(() => {
  Tm = {
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
// @from(Ln 225491, Col 4)
$o
// @from(Ln 225492, Col 4)
p61 = w(() => {
  $o = class $o extends Error {
    constructor(A) {
      super(A);
      this.name = "AbortError"
    }
  }
})
// @from(Ln 225501, Col 0)
function l61(A) {
  return A.toLowerCase()
}
// @from(Ln 225505, Col 0)
function* wk8(A) {
  for (let Q of A.values()) yield [Q.name, Q.value]
}
// @from(Ln 225509, Col 0)
function pk(A) {
  return new FmB(A)
}
// @from(Ln 225512, Col 4)
FmB
// @from(Ln 225513, Col 4)
wTA = w(() => {
  FmB = class FmB {
    constructor(A) {
      if (this._headersMap = new Map, A)
        for (let Q of Object.keys(A)) this.set(Q, A[Q])
    }
    set(A, Q) {
      this._headersMap.set(l61(A), {
        name: A,
        value: String(Q).trim()
      })
    }
    get(A) {
      var Q;
      return (Q = this._headersMap.get(l61(A))) === null || Q === void 0 ? void 0 : Q.value
    }
    has(A) {
      return this._headersMap.has(l61(A))
    }
    delete(A) {
      this._headersMap.delete(l61(A))
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
      return wk8(this._headersMap)
    }
  }
})
// @from(Ln 225552, Col 4)
HmB = () => {}
// @from(Ln 225553, Col 4)
EmB = () => {}
// @from(Ln 225558, Col 0)
function LTA() {
  return Ok8()
}
// @from(Ln 225561, Col 4)
j30
// @from(Ln 225561, Col 9)
Ok8
// @from(Ln 225562, Col 4)
T30 = w(() => {
  Ok8 = typeof ((j30 = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || j30 === void 0 ? void 0 : j30.randomUUID) === "function" ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : Lk8
})
// @from(Ln 225565, Col 0)
class zmB {
  constructor(A) {
    var Q, B, G, Z, Y, J, X;
    this.url = A.url, this.body = A.body, this.headers = (Q = A.headers) !== null && Q !== void 0 ? Q : pk(), this.method = (B = A.method) !== null && B !== void 0 ? B : "GET", this.timeout = (G = A.timeout) !== null && G !== void 0 ? G : 0, this.multipartBody = A.multipartBody, this.formData = A.formData, this.disableKeepAlive = (Z = A.disableKeepAlive) !== null && Z !== void 0 ? Z : !1, this.proxySettings = A.proxySettings, this.streamResponseStatusCodes = A.streamResponseStatusCodes, this.withCredentials = (Y = A.withCredentials) !== null && Y !== void 0 ? Y : !1, this.abortSignal = A.abortSignal, this.onUploadProgress = A.onUploadProgress, this.onDownloadProgress = A.onDownloadProgress, this.requestId = A.requestId || LTA(), this.allowInsecureConnection = (J = A.allowInsecureConnection) !== null && J !== void 0 ? J : !1, this.enableBrowserStreams = (X = A.enableBrowserStreams) !== null && X !== void 0 ? X : !1, this.requestOverrides = A.requestOverrides, this.authSchemes = A.authSchemes
  }
}
// @from(Ln 225572, Col 0)
function P30(A) {
  return new zmB(A)
}
// @from(Ln 225575, Col 4)
$mB = w(() => {
  wTA();
  T30()
})
// @from(Ln 225579, Col 0)
class i61 {
  constructor(A) {
    var Q;
    this._policies = [], this._policies = (Q = A === null || A === void 0 ? void 0 : A.slice(0)) !== null && Q !== void 0 ? Q : [], this._orderedPolicies = void 0
  }
  addPolicy(A, Q = {}) {
    if (Q.phase && Q.afterPhase) throw Error("Policies inside a phase cannot specify afterPhase.");
    if (Q.phase && !CmB.has(Q.phase)) throw Error(`Invalid phase name: ${Q.phase}`);
    if (Q.afterPhase && !CmB.has(Q.afterPhase)) throw Error(`Invalid afterPhase name: ${Q.afterPhase}`);
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
    return this.getOrderedPolicies().reduceRight((Z, Y) => {
      return (J) => {
        return Y.sendRequest(J, Z)
      }
    }, (Z) => A.sendRequest(Z))(Q)
  }
  getOrderedPolicies() {
    if (!this._orderedPolicies) this._orderedPolicies = this.orderPolicies();
    return this._orderedPolicies
  }
  clone() {
    return new i61(this._policies)
  }
  static create() {
    return new i61
  }
  orderPolicies() {
    let A = [],
      Q = new Map;

    function B(F) {
      return {
        name: F,
        policies: new Set,
        hasRun: !1,
        hasAfterPolicies: !1
      }
    }
    let G = B("Serialize"),
      Z = B("None"),
      Y = B("Deserialize"),
      J = B("Retry"),
      X = B("Sign"),
      I = [G, Z, Y, J, X];

    function D(F) {
      if (F === "Retry") return J;
      else if (F === "Serialize") return G;
      else if (F === "Deserialize") return Y;
      else if (F === "Sign") return X;
      else return Z
    }
    for (let F of this._policies) {
      let {
        policy: H,
        options: E
      } = F, z = H.name;
      if (Q.has(z)) throw Error("Duplicate policy names not allowed in pipeline");
      let $ = {
        policy: H,
        dependsOn: new Set,
        dependants: new Set
      };
      if (E.afterPhase) $.afterPhase = D(E.afterPhase), $.afterPhase.hasAfterPolicies = !0;
      Q.set(z, $), D(E.phase).policies.add($)
    }
    for (let F of this._policies) {
      let {
        policy: H,
        options: E
      } = F, z = H.name, $ = Q.get(z);
      if (!$) throw Error(`Missing node for policy ${z}`);
      if (E.afterPolicies)
        for (let O of E.afterPolicies) {
          let L = Q.get(O);
          if (L) $.dependsOn.add(L), L.dependants.add($)
        }
      if (E.beforePolicies)
        for (let O of E.beforePolicies) {
          let L = Q.get(O);
          if (L) L.dependsOn.add($), $.dependants.add(L)
        }
    }

    function W(F) {
      F.hasRun = !0;
      for (let H of F.policies) {
        if (H.afterPhase && (!H.afterPhase.hasRun || H.afterPhase.policies.size)) continue;
        if (H.dependsOn.size === 0) {
          A.push(H.policy);
          for (let E of H.dependants) E.dependsOn.delete(H);
          Q.delete(H.policy.name), F.policies.delete(H)
        }
      }
    }

    function K() {
      for (let F of I) {
        if (W(F), F.policies.size > 0 && F !== Z) {
          if (!Z.hasRun) W(Z);
          return
        }
        if (F.hasAfterPolicies) W(Z)
      }
    }
    let V = 0;
    while (Q.size > 0) {
      V++;
      let F = A.length;
      if (K(), A.length <= F && V > 1) throw Error("Cannot satisfy policy dependencies due to requirements cycle.")
    }
    return A
  }
}
// @from(Ln 225706, Col 0)
function S30() {
  return i61.create()
}
// @from(Ln 225709, Col 4)
CmB
// @from(Ln 225710, Col 4)
UmB = w(() => {
  CmB = new Set(["Deserialize", "Serialize", "Retry", "Sign"])
})
// @from(Ln 225714, Col 0)
function OTA(A) {
  return typeof A === "object" && A !== null && !Array.isArray(A) && !(A instanceof RegExp) && !(A instanceof Date)
}
// @from(Ln 225718, Col 0)
function C2A(A) {
  if (OTA(A)) {
    let Q = typeof A.name === "string",
      B = typeof A.message === "string";
    return Q && B
  }
  return !1
}
// @from(Ln 225726, Col 4)
x30 = () => {}
// @from(Ln 225730, Col 4)
qmB
// @from(Ln 225731, Col 4)
NmB = w(() => {
  qmB = Mk8.custom
})
// @from(Ln 225734, Col 0)
class lk {
  constructor({
    additionalAllowedHeaderNames: A = [],
    additionalAllowedQueryParameters: Q = []
  } = {}) {
    A = Rk8.concat(A), Q = _k8.concat(Q), this.allowedHeaderNames = new Set(A.map((B) => B.toLowerCase())), this.allowedQueryParameters = new Set(Q.map((B) => B.toLowerCase()))
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
      else if (Array.isArray(G) || OTA(G)) {
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
      if (!this.allowedQueryParameters.has(B.toLowerCase())) Q.searchParams.set(B, y30);
    return Q.toString()
  }
  sanitizeHeaders(A) {
    let Q = {};
    for (let B of Object.keys(A))
      if (this.allowedHeaderNames.has(B.toLowerCase())) Q[B] = A[B];
      else Q[B] = y30;
    return Q
  }
  sanitizeQuery(A) {
    if (typeof A !== "object" || A === null) return A;
    let Q = {};
    for (let B of Object.keys(A))
      if (this.allowedQueryParameters.has(B.toLowerCase())) Q[B] = A[B];
      else Q[B] = y30;
    return Q
  }
}
// @from(Ln 225785, Col 4)
y30 = "REDACTED"
// @from(Ln 225786, Col 2)
Rk8
// @from(Ln 225786, Col 7)
_k8
// @from(Ln 225787, Col 4)
MTA = w(() => {
  Rk8 = ["x-ms-client-request-id", "x-ms-return-client-request-id", "x-ms-useragent", "x-ms-correlation-request-id", "x-ms-request-id", "client-request-id", "ms-cv", "return-client-request-id", "traceparent", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin", "Accept", "Accept-Encoding", "Cache-Control", "Connection", "Content-Length", "Content-Type", "Date", "ETag", "Expires", "If-Match", "If-Modified-Since", "If-None-Match", "If-Unmodified-Since", "Last-Modified", "Pragma", "Request-Id", "Retry-After", "Server", "Transfer-Encoding", "User-Agent", "WWW-Authenticate"], _k8 = ["api-version"]
})
// @from(Ln 225791, Col 0)
function v30(A) {
  if (A instanceof WN) return !0;
  return C2A(A) && A.name === "RestError"
}
// @from(Ln 225795, Col 4)
jk8
// @from(Ln 225795, Col 9)
WN
// @from(Ln 225796, Col 4)
k30 = w(() => {
  x30();
  NmB();
  MTA();
  jk8 = new lk;
  WN = class WN extends Error {
    constructor(A, Q = {}) {
      super(A);
      this.name = "RestError", this.code = Q.code, this.statusCode = Q.statusCode, Object.defineProperty(this, "request", {
        value: Q.request,
        enumerable: !1
      }), Object.defineProperty(this, "response", {
        value: Q.response,
        enumerable: !1
      }), Object.defineProperty(this, qmB, {
        value: () => {
          return `RestError: ${this.message} 
 ${jk8.sanitize(Object.assign(Object.assign({},this),{request:this.request,response:this.response}))}`
        },
        enumerable: !1
      }), Object.setPrototypeOf(this, WN.prototype)
    }
  };
  WN.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
  WN.PARSE_ERROR = "PARSE_ERROR"
})
// @from(Ln 225823, Col 0)
function ik(A, Q) {
  return Buffer.from(A, Q)
}
// @from(Ln 225826, Col 4)
sP
// @from(Ln 225827, Col 4)
n61 = w(() => {
  g61();
  sP = h61("ts-http-runtime")
})
// @from(Ln 225838, Col 0)
function RTA(A) {
  return A && typeof A.pipe === "function"
}
// @from(Ln 225842, Col 0)
function wmB(A) {
  if (A.readable === !1) return Promise.resolve();
  return new Promise((Q) => {
    let B = () => {
      Q(), A.removeListener("close", B), A.removeListener("end", B), A.removeListener("error", B)
    };
    A.on("close", B), A.on("end", B), A.on("error", B)
  })
}
// @from(Ln 225852, Col 0)
function LmB(A) {
  return A && typeof A.byteLength === "number"
}
// @from(Ln 225855, Col 0)
class OmB {
  constructor() {
    this.cachedHttpsAgents = new WeakMap
  }
  async sendRequest(A) {
    var Q, B, G;
    let Z = new AbortController,
      Y;
    if (A.abortSignal) {
      if (A.abortSignal.aborted) throw new $o("The operation was aborted. Request has already been canceled.");
      Y = (K) => {
        if (K.type === "abort") Z.abort()
      }, A.abortSignal.addEventListener("abort", Y)
    }
    let J;
    if (A.timeout > 0) J = setTimeout(() => {
      let K = new lk;
      sP.info(`request to '${K.sanitizeUrl(A.url)}' timed out. canceling...`), Z.abort()
    }, A.timeout);
    let X = A.headers.get("Accept-Encoding"),
      I = (X === null || X === void 0 ? void 0 : X.includes("gzip")) || (X === null || X === void 0 ? void 0 : X.includes("deflate")),
      D = typeof A.body === "function" ? A.body() : A.body;
    if (D && !A.headers.has("Content-Length")) {
      let K = vk8(D);
      if (K !== null) A.headers.set("Content-Length", K)
    }
    let W;
    try {
      if (D && A.onUploadProgress) {
        let z = A.onUploadProgress,
          $ = new b30(z);
        if ($.on("error", (O) => {
            sP.error("Error in upload progress", O)
          }), RTA(D)) D.pipe($);
        else $.end(D);
        D = $
      }
      let K = await this.makeRequest(A, Z, D);
      if (J !== void 0) clearTimeout(J);
      let V = Sk8(K),
        H = {
          status: (Q = K.statusCode) !== null && Q !== void 0 ? Q : 0,
          headers: V,
          request: A
        };
      if (A.method === "HEAD") return K.resume(), H;
      W = I ? xk8(K, V) : K;
      let E = A.onDownloadProgress;
      if (E) {
        let z = new b30(E);
        z.on("error", ($) => {
          sP.error("Error in download progress", $)
        }), W.pipe(z), W = z
      }
      if (((B = A.streamResponseStatusCodes) === null || B === void 0 ? void 0 : B.has(Number.POSITIVE_INFINITY)) || ((G = A.streamResponseStatusCodes) === null || G === void 0 ? void 0 : G.has(H.status))) H.readableStreamBody = W;
      else H.bodyAsText = await yk8(W);
      return H
    } finally {
      if (A.abortSignal && Y) {
        let K = Promise.resolve();
        if (RTA(D)) K = wmB(D);
        let V = Promise.resolve();
        if (RTA(W)) V = wmB(W);
        Promise.all([K, V]).then(() => {
          var F;
          if (Y)(F = A.abortSignal) === null || F === void 0 || F.removeEventListener("abort", Y)
        }).catch((F) => {
          sP.warning("Error when cleaning up abortListener on httpRequest", F)
        })
      }
    }
  }
  makeRequest(A, Q, B) {
    var G;
    let Z = new URL(A.url),
      Y = Z.protocol !== "https:";
    if (Y && !A.allowInsecureConnection) throw Error(`Cannot connect to ${A.url} while allowInsecureConnection is false.`);
    let J = (G = A.agent) !== null && G !== void 0 ? G : this.getOrCreateAgent(A, Y),
      X = Object.assign({
        agent: J,
        hostname: Z.hostname,
        path: `${Z.pathname}${Z.search}`,
        port: Z.port,
        method: A.method,
        headers: A.headers.toJSON({
          preserveCase: !0
        })
      }, A.requestOverrides);
    return new Promise((I, D) => {
      let W = Y ? IWA.request(X, I) : DWA.request(X, I);
      if (W.once("error", (K) => {
          var V;
          D(new WN(K.message, {
            code: (V = K.code) !== null && V !== void 0 ? V : WN.REQUEST_SEND_ERROR,
            request: A
          }))
        }), Q.signal.addEventListener("abort", () => {
          let K = new $o("The operation was aborted. Rejecting from abort signal callback while making request.");
          W.destroy(K), D(K)
        }), B && RTA(B)) B.pipe(W);
      else if (B)
        if (typeof B === "string" || Buffer.isBuffer(B)) W.end(B);
        else if (LmB(B)) W.end(ArrayBuffer.isView(B) ? Buffer.from(B.buffer) : Buffer.from(B));
      else sP.error("Unrecognized body type", B), D(new WN("Unrecognized body type"));
      else W.end()
    })
  }
  getOrCreateAgent(A, Q) {
    var B;
    let G = A.disableKeepAlive;
    if (Q) {
      if (G) return IWA.globalAgent;
      if (!this.cachedHttpAgent) this.cachedHttpAgent = new IWA.Agent({
        keepAlive: !0
      });
      return this.cachedHttpAgent
    } else {
      if (G && !A.tlsSettings) return DWA.globalAgent;
      let Z = (B = A.tlsSettings) !== null && B !== void 0 ? B : Pk8,
        Y = this.cachedHttpsAgents.get(Z);
      if (Y && Y.options.keepAlive === !G) return Y;
      return sP.info("No cached TLS Agent exist, creating a new Agent"), Y = new DWA.Agent(Object.assign({
        keepAlive: !G
      }, Z)), this.cachedHttpsAgents.set(Z, Y), Y
    }
  }
}
// @from(Ln 225983, Col 0)
function Sk8(A) {
  let Q = pk();
  for (let B of Object.keys(A.headers)) {
    let G = A.headers[B];
    if (Array.isArray(G)) {
      if (G.length > 0) Q.set(B, G[0])
    } else if (G) Q.set(B, G)
  }
  return Q
}
// @from(Ln 225994, Col 0)
function xk8(A, Q) {
  let B = Q.get("Content-Encoding");
  if (B === "gzip") {
    let G = a61.createGunzip();
    return A.pipe(G), G
  } else if (B === "deflate") {
    let G = a61.createInflate();
    return A.pipe(G), G
  }
  return A
}
// @from(Ln 226006, Col 0)
function yk8(A) {
  return new Promise((Q, B) => {
    let G = [];
    A.on("data", (Z) => {
      if (Buffer.isBuffer(Z)) G.push(Z);
      else G.push(Buffer.from(Z))
    }), A.on("end", () => {
      Q(Buffer.concat(G).toString("utf8"))
    }), A.on("error", (Z) => {
      if (Z && (Z === null || Z === void 0 ? void 0 : Z.name) === "AbortError") B(Z);
      else B(new WN(`Error reading response as text: ${Z.message}`, {
        code: WN.PARSE_ERROR
      }))
    })
  })
}
// @from(Ln 226023, Col 0)
function vk8(A) {
  if (!A) return 0;
  else if (Buffer.isBuffer(A)) return A.length;
  else if (RTA(A)) return null;
  else if (LmB(A)) return A.byteLength;
  else if (typeof A === "string") return Buffer.from(A).length;
  else return null
}
// @from(Ln 226032, Col 0)
function MmB() {
  return new OmB
}
// @from(Ln 226035, Col 4)
Pk8
// @from(Ln 226035, Col 9)
b30
// @from(Ln 226036, Col 4)
RmB = w(() => {
  p61();
  wTA();
  k30();
  n61();
  MTA();
  Pk8 = {};
  b30 = class b30 extends Tk8 {
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
// @from(Ln 226061, Col 0)
function f30() {
  return MmB()
}
// @from(Ln 226064, Col 4)
_mB = w(() => {
  RmB()
})
// @from(Ln 226068, Col 0)
function g30(A = {}) {
  var Q;
  let B = (Q = A.logger) !== null && Q !== void 0 ? Q : sP.info,
    G = new lk({
      additionalAllowedHeaderNames: A.additionalAllowedHeaderNames,
      additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
    });
  return {
    name: h30,
    async sendRequest(Z, Y) {
      if (!B.enabled) return Y(Z);
      B(`Request: ${G.sanitize(Z)}`);
      let J = await Y(Z);
      return B(`Response status code: ${J.status}`), B(`Headers: ${G.sanitize(J.headers)}`), J
    }
  }
}
// @from(Ln 226085, Col 4)
h30 = "logPolicy"
// @from(Ln 226086, Col 4)
jmB = w(() => {
  n61();
  MTA()
})
// @from(Ln 226091, Col 0)
function u30(A = {}) {
  let {
    maxRetries: Q = 20
  } = A;
  return {
    name: "redirectPolicy",
    async sendRequest(B, G) {
      let Z = await G(B);
      return PmB(G, Z, Q)
    }
  }
}
// @from(Ln 226103, Col 0)
async function PmB(A, Q, B, G = 0) {
  let {
    request: Z,
    status: Y,
    headers: J
  } = Q, X = J.get("location");
  if (X && (Y === 300 || Y === 301 && TmB.includes(Z.method) || Y === 302 && TmB.includes(Z.method) || Y === 303 && Z.method === "POST" || Y === 307) && G < B) {
    let I = new URL(X, Z.url);
    if (Z.url = I.toString(), Y === 303) Z.method = "GET", Z.headers.delete("Content-Length"), delete Z.body;
    Z.headers.delete("Authorization");
    let D = await A(Z);
    return PmB(A, D, B, G + 1)
  }
  return Q
}
// @from(Ln 226118, Col 4)
TmB
// @from(Ln 226119, Col 4)
SmB = w(() => {
  TmB = ["GET", "HEAD"]
})
// @from(Ln 226122, Col 4)
_TA = 3
// @from(Ln 226124, Col 0)
function m30() {
  return {
    name: "decompressResponsePolicy",
    async sendRequest(A, Q) {
      if (A.method !== "HEAD") A.headers.set("Accept-Encoding", "gzip,deflate");
      return Q(A)
    }
  }
}
// @from(Ln 226134, Col 0)
function d30(A, Q) {
  return A = Math.ceil(A), Q = Math.floor(Q), Math.floor(Math.random() * (Q - A + 1)) + A
}
// @from(Ln 226138, Col 0)
function jTA(A, Q) {
  let B = Q.retryDelayInMs * Math.pow(2, A),
    G = Math.min(Q.maxRetryDelayInMs, B);
  return {
    retryAfterInMs: G / 2 + d30(0, G / 2)
  }
}
// @from(Ln 226145, Col 4)
c30 = () => {}
// @from(Ln 226147, Col 0)
function xmB(A, Q, B) {
  return new Promise((G, Z) => {
    let Y = void 0,
      J = void 0,
      X = () => {
        return Z(new $o((B === null || B === void 0 ? void 0 : B.abortErrorMsg) ? B === null || B === void 0 ? void 0 : B.abortErrorMsg : kk8))
      },
      I = () => {
        if ((B === null || B === void 0 ? void 0 : B.abortSignal) && J) B.abortSignal.removeEventListener("abort", J)
      };
    if (J = () => {
        if (Y) clearTimeout(Y);
        return I(), X()
      }, (B === null || B === void 0 ? void 0 : B.abortSignal) && B.abortSignal.aborted) return X();
    if (Y = setTimeout(() => {
        I(), G(Q)
      }, A), B === null || B === void 0 ? void 0 : B.abortSignal) B.abortSignal.addEventListener("abort", J)
  })
}
// @from(Ln 226167, Col 0)
function ymB(A, Q) {
  let B = A.headers.get(Q);
  if (!B) return;
  let G = Number(B);
  if (Number.isNaN(G)) return;
  return G
}
// @from(Ln 226174, Col 4)
kk8 = "The operation was aborted."
// @from(Ln 226175, Col 4)
p30 = w(() => {
  p61()
})
// @from(Ln 226179, Col 0)
function vmB(A) {
  if (!(A && [429, 503].includes(A.status))) return;
  try {
    for (let Z of bk8) {
      let Y = ymB(A, Z);
      if (Y === 0 || Y) return Y * (Z === l30 ? 1000 : 1)
    }
    let Q = A.headers.get(l30);
    if (!Q) return;
    let G = Date.parse(Q) - Date.now();
    return Number.isFinite(G) ? Math.max(0, G) : void 0
  } catch (Q) {
    return
  }
}
// @from(Ln 226195, Col 0)
function kmB(A) {
  return Number.isFinite(vmB(A))
}
// @from(Ln 226199, Col 0)
function bmB() {
  return {
    name: "throttlingRetryStrategy",
    retry({
      response: A
    }) {
      let Q = vmB(A);
      if (!Number.isFinite(Q)) return {
        skipStrategy: !0
      };
      return {
        retryAfterInMs: Q
      }
    }
  }
}
// @from(Ln 226215, Col 4)
l30 = "Retry-After"
// @from(Ln 226216, Col 2)
bk8
// @from(Ln 226217, Col 4)
i30 = w(() => {
  p30();
  bk8 = ["retry-after-ms", "x-ms-retry-after-ms", l30]
})
// @from(Ln 226222, Col 0)
function fmB(A = {}) {
  var Q, B;
  let G = (Q = A.retryDelayInMs) !== null && Q !== void 0 ? Q : fk8,
    Z = (B = A.maxRetryDelayInMs) !== null && B !== void 0 ? B : hk8;
  return {
    name: "exponentialRetryStrategy",
    retry({
      retryCount: Y,
      response: J,
      responseError: X
    }) {
      let I = uk8(X),
        D = I && A.ignoreSystemErrors,
        W = gk8(J),
        K = W && A.ignoreHttpStatusCodes;
      if (J && (kmB(J) || !W) || K || D) return {
        skipStrategy: !0
      };
      if (X && !I && !W) return {
        errorToThrow: X
      };
      return jTA(Y, {
        retryDelayInMs: G,
        maxRetryDelayInMs: Z
      })
    }
  }
}
// @from(Ln 226251, Col 0)
function gk8(A) {
  return Boolean(A && A.status !== void 0 && (A.status >= 500 || A.status === 408) && A.status !== 501 && A.status !== 505)
}
// @from(Ln 226255, Col 0)
function uk8(A) {
  if (!A) return !1;
  return A.code === "ETIMEDOUT" || A.code === "ESOCKETTIMEDOUT" || A.code === "ECONNREFUSED" || A.code === "ECONNRESET" || A.code === "ENOENT" || A.code === "ENOTFOUND"
}
// @from(Ln 226259, Col 4)
fk8 = 1000
// @from(Ln 226260, Col 2)
hk8 = 64000
// @from(Ln 226261, Col 4)
hmB = w(() => {
  c30();
  i30()
})
// @from(Ln 226266, Col 0)
function TTA(A, Q = {
  maxRetries: _TA
}) {
  let B = Q.logger || mk8;
  return {
    name: dk8,
    async sendRequest(G, Z) {
      var Y, J;
      let X, I, D = -1;
      A: while (!0) {
        D += 1, X = void 0, I = void 0;
        try {
          B.info(`Retry ${D}: Attempting to send request`, G.requestId), X = await Z(G), B.info(`Retry ${D}: Received a response from request`, G.requestId)
        } catch (W) {
          if (B.error(`Retry ${D}: Received an error from request`, G.requestId), I = W, !W || I.name !== "RestError") throw W;
          X = I.response
        }
        if ((Y = G.abortSignal) === null || Y === void 0 ? void 0 : Y.aborted) throw B.error(`Retry ${D}: Request aborted.`), new $o;
        if (D >= ((J = Q.maxRetries) !== null && J !== void 0 ? J : _TA))
          if (B.info(`Retry ${D}: Maximum retries reached. Returning the last received response, or throwing the last received error.`), I) throw I;
          else if (X) return X;
        else throw Error("Maximum retries reached with no response or error to throw");
        B.info(`Retry ${D}: Processing ${A.length} retry strategies.`);
        Q: for (let W of A) {
          let K = W.logger || B;
          K.info(`Retry ${D}: Processing retry strategy ${W.name}.`);
          let V = W.retry({
            retryCount: D,
            response: X,
            responseError: I
          });
          if (V.skipStrategy) {
            K.info(`Retry ${D}: Skipped.`);
            continue Q
          }
          let {
            errorToThrow: F,
            retryAfterInMs: H,
            redirectTo: E
          } = V;
          if (F) throw K.error(`Retry ${D}: Retry strategy ${W.name} throws error:`, F), F;
          if (H || H === 0) {
            K.info(`Retry ${D}: Retry strategy ${W.name} retries after ${H}`), await xmB(H, void 0, {
              abortSignal: G.abortSignal
            });
            continue A
          }
          if (E) {
            K.info(`Retry ${D}: Retry strategy ${W.name} redirects to ${E}`), G.url = E;
            continue A
          }
        }
        if (I) throw B.info("None of the retry strategies could work with the received error. Throwing it."), I;
        if (X) return B.info("None of the retry strategies could work with the received response. Returning it."), X
      }
    }
  }
}
// @from(Ln 226324, Col 4)
mk8
// @from(Ln 226324, Col 9)
dk8 = "retryPolicy"
// @from(Ln 226325, Col 4)
n30 = w(() => {
  p30();
  p61();
  g61();
  mk8 = h61("ts-http-runtime retryPolicy")
})
// @from(Ln 226332, Col 0)
function o30(A = {}) {
  var Q;
  return {
    name: a30,
    sendRequest: TTA([bmB(), fmB(A)], {
      maxRetries: (Q = A.maxRetries) !== null && Q !== void 0 ? Q : _TA
    }).sendRequest
  }
}
// @from(Ln 226341, Col 4)
a30 = "defaultRetryPolicy"
// @from(Ln 226342, Col 4)
gmB = w(() => {
  hmB();
  i30();
  n30()
})
// @from(Ln 226347, Col 4)
r30
// @from(Ln 226347, Col 9)
s30
// @from(Ln 226347, Col 14)
t30
// @from(Ln 226347, Col 19)
e30
// @from(Ln 226347, Col 24)
umB
// @from(Ln 226347, Col 29)
mmB
// @from(Ln 226347, Col 34)
dmB
// @from(Ln 226347, Col 39)
cmB
// @from(Ln 226347, Col 44)
WWA
// @from(Ln 226347, Col 49)
pmB
// @from(Ln 226348, Col 4)
A80 = w(() => {
  umB = typeof window < "u" && typeof window.document < "u", mmB = typeof self === "object" && typeof (self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((r30 = self.constructor) === null || r30 === void 0 ? void 0 : r30.name) === "DedicatedWorkerGlobalScope" || ((s30 = self.constructor) === null || s30 === void 0 ? void 0 : s30.name) === "ServiceWorkerGlobalScope" || ((t30 = self.constructor) === null || t30 === void 0 ? void 0 : t30.name) === "SharedWorkerGlobalScope"), dmB = typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u", cmB = typeof Bun < "u" && typeof Bun.version < "u", WWA = typeof globalThis.process < "u" && Boolean(globalThis.process.version) && Boolean((e30 = globalThis.process.versions) === null || e30 === void 0 ? void 0 : e30.node), pmB = typeof navigator < "u" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative"
})
// @from(Ln 226352, Col 0)
function ck8(A) {
  var Q;
  let B = {};
  for (let [G, Z] of A.entries())(Q = B[G]) !== null && Q !== void 0 || (B[G] = []), B[G].push(Z);
  return B
}
// @from(Ln 226359, Col 0)
function B80() {
  return {
    name: Q80,
    async sendRequest(A, Q) {
      if (WWA && typeof FormData < "u" && A.body instanceof FormData) A.formData = ck8(A.body), A.body = void 0;
      if (A.formData) {
        let B = A.headers.get("Content-Type");
        if (B && B.indexOf("application/x-www-form-urlencoded") !== -1) A.body = pk8(A.formData);
        else await lk8(A.formData, A);
        A.formData = void 0
      }
      return Q(A)
    }
  }
}
// @from(Ln 226375, Col 0)
function pk8(A) {
  let Q = new URLSearchParams;
  for (let [B, G] of Object.entries(A))
    if (Array.isArray(G))
      for (let Z of G) Q.append(B, Z.toString());
    else Q.append(B, G.toString());
  return Q.toString()
}
// @from(Ln 226383, Col 0)
async function lk8(A, Q) {
  let B = Q.headers.get("Content-Type");
  if (B && !B.startsWith("multipart/form-data")) return;
  Q.headers.set("Content-Type", B !== null && B !== void 0 ? B : "multipart/form-data");
  let G = [];
  for (let [Z, Y] of Object.entries(A))
    for (let J of Array.isArray(Y) ? Y : [Y])
      if (typeof J === "string") G.push({
        headers: pk({
          "Content-Disposition": `form-data; name="${Z}"`
        }),
        body: ik(J, "utf-8")
      });
      else if (J === void 0 || J === null || typeof J !== "object") throw Error(`Unexpected value for key ${Z}: ${J}. Value should be serialized to string first.`);
  else {
    let X = J.name || "blob",
      I = pk();
    I.set("Content-Disposition", `form-data; name="${Z}"; filename="${X}"`), I.set("Content-Type", J.type || "application/octet-stream"), G.push({
      headers: I,
      body: J
    })
  }
  Q.multipartBody = {
    parts: G
  }
}
// @from(Ln 226409, Col 4)
Q80 = "formDataPolicy"
// @from(Ln 226410, Col 4)
lmB = w(() => {
  A80();
  wTA()
})
// @from(Ln 226414, Col 4)
amB = U((C_) => {
  var ik8 = C_ && C_.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    nk8 = C_ && C_.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    nmB = C_ && C_.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) ik8(Q, A, B)
      }
      return nk8(Q, A), Q
    },
    ak8 = C_ && C_.__importDefault || function (A) {
      return A && A.__esModule ? A : {
        default: A
      }
    };
  Object.defineProperty(C_, "__esModule", {
    value: !0
  });
  C_.HttpProxyAgent = void 0;
  var ok8 = nmB(NA("net")),
    rk8 = nmB(NA("tls")),
    sk8 = ak8(Q1A()),
    tk8 = NA("events"),
    ek8 = am1(),
    imB = NA("url"),
    KWA = (0, sk8.default)("http-proxy-agent");
  class G80 extends ek8.Agent {
    constructor(A, Q) {
      super(Q);
      this.proxy = typeof A === "string" ? new imB.URL(A) : A, this.proxyHeaders = Q?.headers ?? {}, KWA("Creating new HttpProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ...Q ? Ab8(Q, "headers") : null,
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
      } = this, G = Q.secureEndpoint ? "https:" : "http:", Z = A.getHeader("host") || "localhost", Y = `${G}//${Z}`, J = new imB.URL(A.path, Y);
      if (Q.port !== 80) J.port = String(Q.port);
      A.path = String(J);
      let X = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
        ...this.proxyHeaders
      };
      if (B.username || B.password) {
        let I = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        X["Proxy-Authorization"] = `Basic ${Buffer.from(I).toString("base64")}`
      }
      if (!X["Proxy-Connection"]) X["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let I of Object.keys(X)) {
        let D = X[I];
        if (D) A.setHeader(I, D)
      }
    }
    async connect(A, Q) {
      if (A._header = null, !A.path.includes("://")) this.setRequestProps(A, Q);
      let B, G;
      if (KWA("Regenerating stored HTTP header string for request"), A._implicitHeader(), A.outputData && A.outputData.length > 0) KWA("Patching connection write() output buffer with updated header"), B = A.outputData[0].data, G = B.indexOf(`\r
\r
`) + 4, A.outputData[0].data = A._header + B.substring(G), KWA("Output buffer: %o", A.outputData[0].data);
      let Z;
      if (this.proxy.protocol === "https:") KWA("Creating `tls.Socket`: %o", this.connectOpts), Z = rk8.connect(this.connectOpts);
      else KWA("Creating `net.Socket`: %o", this.connectOpts), Z = ok8.connect(this.connectOpts);
      return await (0, tk8.once)(Z, "connect"), Z
    }
  }
  G80.protocols = ["http", "https"];
  C_.HttpProxyAgent = G80;

  function Ab8(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
})
// @from(Ln 226520, Col 0)
function o61(A) {
  if (process.env[A]) return process.env[A];
  else if (process.env[A.toLowerCase()]) return process.env[A.toLowerCase()];
  return
}
// @from(Ln 226526, Col 0)
function Jb8() {
  if (!process) return;
  let A = o61(Qb8),
    Q = o61(Gb8),
    B = o61(Bb8);
  return A || Q || B
}
// @from(Ln 226534, Col 0)
function Xb8(A, Q, B) {
  if (Q.length === 0) return !1;
  let G = new URL(A).hostname;
  if (B === null || B === void 0 ? void 0 : B.has(G)) return B.get(G);
  let Z = !1;
  for (let Y of Q)
    if (Y[0] === ".") {
      if (G.endsWith(Y)) Z = !0;
      else if (G.length === Y.length - 1 && G === Y.slice(1)) Z = !0
    } else if (G === Y) Z = !0;
  return B === null || B === void 0 || B.set(G, Z), Z
}
// @from(Ln 226547, Col 0)
function Ib8() {
  let A = o61(Zb8);
  if (AdB = !0, A) return A.split(",").map((Q) => Q.trim()).filter((Q) => Q.length);
  return []
}
// @from(Ln 226553, Col 0)
function Db8() {
  let A = Jb8();
  return A ? new URL(A) : void 0
}
// @from(Ln 226558, Col 0)
function rmB(A) {
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
// @from(Ln 226570, Col 0)
function smB(A, Q, B) {
  if (A.agent) return;
  let Z = new URL(A.url).protocol !== "https:";
  if (A.tlsSettings) sP.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
  let Y = A.headers.toJSON();
  if (Z) {
    if (!Q.httpProxyAgent) Q.httpProxyAgent = new emB.HttpProxyAgent(B, {
      headers: Y
    });
    A.agent = Q.httpProxyAgent
  } else {
    if (!Q.httpsProxyAgent) Q.httpsProxyAgent = new tmB.HttpsProxyAgent(B, {
      headers: Y
    });
    A.agent = Q.httpsProxyAgent
  }
}
// @from(Ln 226588, Col 0)
function Y80(A, Q) {
  if (!AdB) omB.push(...Ib8());
  let B = A ? rmB(A) : Db8(),
    G = {};
  return {
    name: Z80,
    async sendRequest(Z, Y) {
      var J;
      if (!Z.proxySettings && B && !Xb8(Z.url, (J = Q === null || Q === void 0 ? void 0 : Q.customNoProxyList) !== null && J !== void 0 ? J : omB, (Q === null || Q === void 0 ? void 0 : Q.customNoProxyList) ? void 0 : Yb8)) smB(Z, G, B);
      else if (Z.proxySettings) smB(Z, G, rmB(Z.proxySettings));
      return Y(Z)
    }
  }
}
// @from(Ln 226602, Col 4)
tmB
// @from(Ln 226602, Col 9)
emB
// @from(Ln 226602, Col 14)
Qb8 = "HTTPS_PROXY"
// @from(Ln 226603, Col 2)
Bb8 = "HTTP_PROXY"
// @from(Ln 226604, Col 2)
Gb8 = "ALL_PROXY"
// @from(Ln 226605, Col 2)
Zb8 = "NO_PROXY"
// @from(Ln 226606, Col 2)
Z80 = "proxyPolicy"
// @from(Ln 226607, Col 2)
omB
// @from(Ln 226607, Col 7)
AdB = !1
// @from(Ln 226608, Col 2)
Yb8
// @from(Ln 226609, Col 4)
QdB = w(() => {
  n61();
  tmB = c(ELA(), 1), emB = c(amB(), 1), omB = [], Yb8 = new Map
})
// @from(Ln 226614, Col 0)
function J80(A) {
  return {
    name: "agentPolicy",
    sendRequest: async (Q, B) => {
      if (!Q.agent) Q.agent = A;
      return B(Q)
    }
  }
}
// @from(Ln 226624, Col 0)
function X80(A) {
  return {
    name: "tlsPolicy",
    sendRequest: async (Q, B) => {
      if (!Q.tlsSettings) Q.tlsSettings = A;
      return B(Q)
    }
  }
}
// @from(Ln 226634, Col 0)
function r61(A) {
  return typeof A.stream === "function"
}
// @from(Ln 226637, Col 4)
BdB
// @from(Ln 226637, Col 9)
knG
// @from(Ln 226637, Col 14)
bnG
// @from(Ln 226637, Col 19)
fnG
// @from(Ln 226637, Col 24)
hnG
// @from(Ln 226637, Col 29)
gnG
// @from(Ln 226637, Col 34)
unG
// @from(Ln 226637, Col 39)
mnG
// @from(Ln 226637, Col 44)
dnG
// @from(Ln 226637, Col 49)
cnG
// @from(Ln 226637, Col 54)
pnG
// @from(Ln 226637, Col 59)
lnG
// @from(Ln 226637, Col 64)
inG
// @from(Ln 226637, Col 69)
nnG
// @from(Ln 226637, Col 74)
anG
// @from(Ln 226637, Col 79)
onG
// @from(Ln 226637, Col 84)
rnG
// @from(Ln 226637, Col 89)
snG
// @from(Ln 226637, Col 94)
tnG
// @from(Ln 226637, Col 99)
enG
// @from(Ln 226637, Col 104)
U2A
// @from(Ln 226637, Col 109)
I80
// @from(Ln 226637, Col 114)
AaG
// @from(Ln 226637, Col 119)
GdB
// @from(Ln 226637, Col 124)
QaG
// @from(Ln 226637, Col 129)
BaG
// @from(Ln 226637, Col 134)
GaG
// @from(Ln 226637, Col 139)
ZaG
// @from(Ln 226637, Col 144)
YaG
// @from(Ln 226637, Col 149)
JaG
// @from(Ln 226637, Col 154)
XaG
// @from(Ln 226637, Col 159)
IaG
// @from(Ln 226637, Col 164)
DaG
// @from(Ln 226638, Col 4)
ZdB = w(() => {
  BdB = c(LZ(), 1), {
    __extends: knG,
    __assign: bnG,
    __rest: fnG,
    __decorate: hnG,
    __param: gnG,
    __esDecorate: unG,
    __runInitializers: mnG,
    __propKey: dnG,
    __setFunctionName: cnG,
    __metadata: pnG,
    __awaiter: lnG,
    __generator: inG,
    __exportStar: nnG,
    __createBinding: anG,
    __values: onG,
    __read: rnG,
    __spread: snG,
    __spreadArrays: tnG,
    __spreadArray: enG,
    __await: U2A,
    __asyncGenerator: I80,
    __asyncDelegator: AaG,
    __asyncValues: GdB,
    __makeTemplateObject: QaG,
    __importStar: BaG,
    __importDefault: GaG,
    __classPrivateFieldGet: ZaG,
    __classPrivateFieldSet: YaG,
    __classPrivateFieldIn: JaG,
    __addDisposableResource: XaG,
    __disposeResources: IaG,
    __rewriteRelativeImportExtension: DaG
  } = BdB.default
})