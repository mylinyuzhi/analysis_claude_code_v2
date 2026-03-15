
// @from(Ln 213300, Col 4)
tG8 = x((pe7) => {
    Object.defineProperty(pe7, "__esModule", {
        value: !0
    });
    pe7.InvalidSubjectTokenError = pe7.InvalidMessageFieldError = pe7.InvalidCodeFieldError = pe7.InvalidTokenTypeFieldError = pe7.InvalidExpirationTimeFieldError = pe7.InvalidSuccessFieldError = pe7.InvalidVersionFieldError = pe7.ExecutableResponseError = pe7.ExecutableResponse = void 0;
    var zD1 = "urn:ietf:params:oauth:token-type:saml2",
        lG8 = "urn:ietf:params:oauth:token-type:id_token",
        iG8 = "urn:ietf:params:oauth:token-type:jwt";
    class ge7 {
        constructor(A) {
            if (!A.version) throw new nG8("Executable response must contain a 'version' field.");
            if (A.success === void 0) throw new rG8("Executable response must contain a 'success' field.");
            if (this.version = A.version, this.success = A.success, this.success) {
                if (this.expirationTime = A.expiration_time, this.tokenType = A.token_type, this.tokenType !== zD1 && this.tokenType !== lG8 && this.tokenType !== iG8) throw new oG8(`Executable response must contain a 'token_type' field when successful and it must be one of ${lG8}, ${iG8}, or ${zD1}.`);
                if (this.tokenType === zD1) {
                    if (!A.saml_response) throw new _D1(`Executable response must contain a 'saml_response' field when token_type=${zD1}.`);
                    this.subjectToken = A.saml_response
                } else {
                    if (!A.id_token) throw new _D1(`Executable response must contain a 'id_token' field when token_type=${lG8} or ${iG8}.`);
                    this.subjectToken = A.id_token
                }
            } else {
                if (!A.code) throw new aG8("Executable response must contain a 'code' field when unsuccessful.");
                if (!A.message) throw new sG8("Executable response must contain a 'message' field when unsuccessful.");
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
    pe7.ExecutableResponse = ge7;
    class kd extends Error {
        constructor(A) {
            super(A);
            Object.setPrototypeOf(this, new.target.prototype)
        }
    }
    pe7.ExecutableResponseError = kd;
    class nG8 extends kd {}
    pe7.InvalidVersionFieldError = nG8;
    class rG8 extends kd {}
    pe7.InvalidSuccessFieldError = rG8;
    class Fe7 extends kd {}
    pe7.InvalidExpirationTimeFieldError = Fe7;
    class oG8 extends kd {}
    pe7.InvalidTokenTypeFieldError = oG8;
    class aG8 extends kd {}
    pe7.InvalidCodeFieldError = aG8;
    class sG8 extends kd {}
    pe7.InvalidMessageFieldError = sG8;
    class _D1 extends kd {}
    pe7.InvalidSubjectTokenError = _D1
})
// @from(Ln 213357, Col 4)
ce7 = x((Ue7) => {
    Object.defineProperty(Ue7, "__esModule", {
        value: !0
    });
    Ue7.PluggableAuthHandler = void 0;
    var lG9 = wD1(),
        q36 = tG8(),
        iG9 = x6("child_process"),
        eG8 = x6("fs");
    class Af8 {
        constructor(A) {
            if (!A.command) throw Error("No command provided.");
            if (this.commandComponents = Af8.parseCommand(A.command), this.timeoutMillis = A.timeoutMillis, !this.timeoutMillis) throw Error("No timeoutMillis provided.");
            this.outputFile = A.outputFile
        }
        retrieveResponseFromExecutable(A) {
            return new Promise((q, K) => {
                let Y = iG9.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
                        env: {
                            ...process.env,
                            ...Object.fromEntries(A)
                        }
                    }),
                    z = "";
                Y.stdout.on("data", (w) => {
                    z += w
                }), Y.stderr.on("data", (w) => {
                    z += w
                });
                let _ = setTimeout(() => {
                    return Y.removeAllListeners(), Y.kill(), K(Error("The executable failed to finish within the timeout specified."))
                }, this.timeoutMillis);
                Y.on("close", (w) => {
                    if (clearTimeout(_), w === 0) try {
                        let O = JSON.parse(z),
                            $ = new q36.ExecutableResponse(O);
                        return q($)
                    } catch (O) {
                        if (O instanceof q36.ExecutableResponseError) return K(O);
                        return K(new q36.ExecutableResponseError(`The executable returned an invalid response: ${z}`))
                    } else return K(new lG9.ExecutableError(z, w.toString()))
                })
            })
        }
        async retrieveCachedResponse() {
            if (!this.outputFile || this.outputFile.length === 0) return;
            let A;
            try {
                A = await eG8.promises.realpath(this.outputFile)
            } catch (K) {
                return
            }
            if (!(await eG8.promises.lstat(A)).isFile()) return;
            let q = await eG8.promises.readFile(A, {
                encoding: "utf8"
            });
            if (q === "") return;
            try {
                let K = JSON.parse(q);
                if (new q36.ExecutableResponse(K).isValid()) return new q36.ExecutableResponse(K);
                return
            } catch (K) {
                if (K instanceof q36.ExecutableResponseError) throw K;
                throw new q36.ExecutableResponseError(`The output file contained an invalid response: ${q}`)
            }
        }
        static parseCommand(A) {
            let q = A.match(/(?:[^\s"]+|"[^"]*")+/g);
            if (!q) throw Error(`Provided command: "${A}" could not be parsed.`);
            for (let K = 0; K < q.length; K++)
                if (q[K][0] === '"' && q[K].slice(-1) === '"') q[K] = q[K].slice(1, -1);
            return q
        }
    }
    Ue7.PluggableAuthHandler = Af8
})
// @from(Ln 213433, Col 4)
wD1 = x((oe7) => {
    Object.defineProperty(oe7, "__esModule", {
        value: !0
    });
    oe7.PluggableAuthClient = oe7.ExecutableError = void 0;
    var nG9 = Ht(),
        rG9 = tG8(),
        oG9 = ce7();
    class qf8 extends Error {
        constructor(A, q) {
            super(`The executable failed with exit code: ${q} and error message: ${A}.`);
            this.code = q, Object.setPrototypeOf(this, new.target.prototype)
        }
    }
    oe7.ExecutableError = qf8;
    var aG9 = 30000,
        le7 = 5000,
        ie7 = 120000,
        sG9 = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES",
        ne7 = 1;
    class re7 extends nG9.BaseExternalAccountClient {
        constructor(A, q) {
            super(A, q);
            if (!A.credential_source.executable) throw Error('No valid Pluggable Auth "credential_source" provided.');
            if (this.command = A.credential_source.executable.command, !this.command) throw Error('No valid Pluggable Auth "credential_source" provided.');
            if (A.credential_source.executable.timeout_millis === void 0) this.timeoutMillis = aG9;
            else if (this.timeoutMillis = A.credential_source.executable.timeout_millis, this.timeoutMillis < le7 || this.timeoutMillis > ie7) throw Error(`Timeout must be between ${le7} and ${ie7} milliseconds.`);
            this.outputFile = A.credential_source.executable.output_file, this.handler = new oG9.PluggableAuthHandler({
                command: this.command,
                timeoutMillis: this.timeoutMillis,
                outputFile: this.outputFile
            }), this.credentialSourceType = "executable"
        }
        async retrieveSubjectToken() {
            if (process.env[sG9] !== "1") throw Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
            let A = void 0;
            if (this.outputFile) A = await this.handler.retrieveCachedResponse();
            if (!A) {
                let q = new Map;
                if (q.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience), q.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType), q.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0"), this.outputFile) q.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
                let K = this.getServiceAccountEmail();
                if (K) q.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", K);
                A = await this.handler.retrieveResponseFromExecutable(q)
            }
            if (A.version > ne7) throw Error(`Version of executable is not currently supported, maximum supported version is ${ne7}.`);
            if (!A.success) throw new qf8(A.errorMessage, A.errorCode);
            if (this.outputFile) {
                if (!A.expirationTime) throw new rG9.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.")
            }
            if (A.isExpired()) throw Error("Executable response is expired.");
            return A.subjectToken
        }
    }
    oe7.PluggableAuthClient = re7
})
// @from(Ln 213488, Col 4)
Kf8 = x((te7) => {
    Object.defineProperty(te7, "__esModule", {
        value: !0
    });
    te7.ExternalAccountClient = void 0;
    var eG9 = Ht(),
        Af9 = pG8(),
        qf9 = cG8(),
        Kf9 = wD1();
    class se7 {
        constructor() {
            throw Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()")
        }
        static fromJSON(A, q) {
            var K, Y;
            if (A && A.type === eG9.EXTERNAL_ACCOUNT_TYPE)
                if ((K = A.credential_source) === null || K === void 0 ? void 0 : K.environment_id) return new qf9.AwsClient(A, q);
                else if ((Y = A.credential_source) === null || Y === void 0 ? void 0 : Y.executable) return new Kf9.PluggableAuthClient(A, q);
            else return new Af9.IdentityPoolClient(A, q);
            else return null
        }
    }
    te7.ExternalAccountClient = se7
})
// @from(Ln 213512, Col 4)
z64 = x((K64) => {
    Object.defineProperty(K64, "__esModule", {
        value: !0
    });
    K64.ExternalAccountAuthorizedUserClient = K64.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
    var Yf9 = wB(),
        A64 = LG8(),
        zf9 = _I(),
        _f9 = x6("stream"),
        wf9 = Ht();
    K64.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
    var Of9 = "https://sts.{universeDomain}/v1/oauthtoken";
    class Yf8 extends A64.OAuthClientAuthHandler {
        constructor(A, q, K) {
            super(K);
            this.url = A, this.transporter = q
        }
        async refreshToken(A, q) {
            let K = new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: A
                }),
                Y = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    ...q
                },
                z = {
                    ...Yf8.RETRY_CONFIG,
                    url: this.url,
                    method: "POST",
                    headers: Y,
                    data: K.toString(),
                    responseType: "json"
                };
            this.applyClientAuthenticationOptions(z);
            try {
                let _ = await this.transporter.request(z),
                    w = _.data;
                return w.res = _, w
            } catch (_) {
                if (_ instanceof zf9.GaxiosError && _.response) throw (0, A64.getErrorFromOAuthErrorResponse)(_.response.data, _);
                throw _
            }
        }
    }
    class q64 extends Yf9.AuthClient {
        constructor(A, q) {
            var K;
            super({
                ...A,
                ...q
            });
            if (A.universe_domain) this.universeDomain = A.universe_domain;
            this.refreshToken = A.refresh_token;
            let Y = {
                confidentialClientType: "basic",
                clientId: A.client_id,
                clientSecret: A.client_secret
            };
            if (this.externalAccountAuthorizedUserHandler = new Yf8((K = A.token_url) !== null && K !== void 0 ? K : Of9.replace("{universeDomain}", this.universeDomain), this.transporter, Y), this.cachedAccessToken = null, this.quotaProjectId = A.quota_project_id, typeof(q === null || q === void 0 ? void 0 : q.eagerRefreshThresholdMillis) !== "number") this.eagerRefreshThresholdMillis = wf9.EXPIRATION_TIME_OFFSET;
            else this.eagerRefreshThresholdMillis = q.eagerRefreshThresholdMillis;
            this.forceRefreshOnFailure = !!(q === null || q === void 0 ? void 0 : q.forceRefreshOnFailure)
        }
        async getAccessToken() {
            if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) await this.refreshAccessTokenAsync();
            return {
                token: this.cachedAccessToken.access_token,
                res: this.cachedAccessToken.res
            }
        }
        async getRequestHeaders() {
            let q = {
                Authorization: `Bearer ${(await this.getAccessToken()).token}`
            };
            return this.addSharedMetadataHeaders(q)
        }
        request(A, q) {
            if (q) this.requestAsync(A).then((K) => q(null, K), (K) => {
                return q(K, K.response)
            });
            else return this.requestAsync(A)
        }
        async requestAsync(A, q = !1) {
            let K;
            try {
                let Y = await this.getRequestHeaders();
                if (A.headers = A.headers || {}, Y && Y["x-goog-user-project"]) A.headers["x-goog-user-project"] = Y["x-goog-user-project"];
                if (Y && Y.Authorization) A.headers.Authorization = Y.Authorization;
                K = await this.transporter.request(A)
            } catch (Y) {
                let z = Y.response;
                if (z) {
                    let _ = z.status,
                        w = z.config.data instanceof _f9.Readable;
                    if (!q && (_ === 401 || _ === 403) && !w && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
                }
                throw Y
            }
            return K
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
            let q = new Date().getTime();
            return A.expiry_date ? q >= A.expiry_date - this.eagerRefreshThresholdMillis : !1
        }
    }
    K64.ExternalAccountAuthorizedUserClient = q64
})
// @from(Ln 213628, Col 4)
j64 = x((sP) => {
    var jt = sP && sP.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        _64 = sP && sP.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        Jt, f06, T06, H64;
    Object.defineProperty(sP, "__esModule", {
        value: !0
    });
    sP.GoogleAuth = sP.GoogleAuthExceptionMessages = sP.CLOUD_SDK_CLIENT_ID = void 0;
    var Hf9 = x6("child_process"),
        og6 = x6("fs"),
        ng6 = Bg6(),
        jf9 = x6("os"),
        _f8 = x6("path"),
        Jf9 = w06(),
        Mf9 = Fg6(),
        Df9 = OG8(),
        Xf9 = $G8(),
        Pf9 = HG8(),
        Z06 = kG8(),
        w64 = EG8(),
        G06 = yG8(),
        Wf9 = Kf8(),
        rg6 = Ht(),
        zf8 = wB(),
        O64 = z64(),
        $64 = Ot();
    sP.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
    sP.GoogleAuthExceptionMessages = {
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
    class wf8 {
        get isGCE() {
            return this.checkIsGCE
        }
        constructor(A = {}) {
            if (Jt.add(this), this.checkIsGCE = void 0, this.jsonContent = null, this.cachedCredential = null, f06.set(this, null), this.clientOptions = {}, this._cachedProjectId = A.projectId || null, this.cachedCredential = A.authClient || null, this.keyFilename = A.keyFilename || A.keyFile, this.scopes = A.scopes, this.clientOptions = A.clientOptions || {}, this.jsonContent = A.credentials || null, this.apiKey = A.apiKey || this.clientOptions.apiKey || null, this.apiKey && (this.jsonContent || this.clientOptions.credentials)) throw RangeError(sP.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
            if (A.universeDomain) this.clientOptions.universeDomain = A.universeDomain
        }
        setGapicJWTValues(A) {
            A.defaultServicePath = this.defaultServicePath, A.useJWTAccessWithScope = this.useJWTAccessWithScope, A.defaultScopes = this.defaultScopes
        }
        getProjectId(A) {
            if (A) this.getProjectIdAsync().then((q) => A(null, q), A);
            else return this.getProjectIdAsync()
        }
        async getProjectIdOptional() {
            try {
                return await this.getProjectId()
            } catch (A) {
                if (A instanceof Error && A.message === sP.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) return null;
                else throw A
            }
        }
        async findAndCacheProjectId() {
            let A = null;
            if (A || (A = await this.getProductionProjectId()), A || (A = await this.getFileProjectId()), A || (A = await this.getDefaultServiceProjectId()), A || (A = await this.getGCEProjectId()), A || (A = await this.getExternalAccountClientProjectId()), A) return this._cachedProjectId = A, A;
            else throw Error(sP.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND)
        }
        async getProjectIdAsync() {
            if (this._cachedProjectId) return this._cachedProjectId;
            if (!this._findProjectIdPromise) this._findProjectIdPromise = this.findAndCacheProjectId();
            return this._findProjectIdPromise
        }
        async getUniverseDomainFromMetadataServer() {
            var A;
            let q;
            try {
                q = await ng6.universe("universe-domain"), q || (q = zf8.DEFAULT_UNIVERSE)
            } catch (K) {
                if (K && ((A = K === null || K === void 0 ? void 0 : K.response) === null || A === void 0 ? void 0 : A.status) === 404) q = zf8.DEFAULT_UNIVERSE;
                else throw K
            }
            return q
        }
        async getUniverseDomain() {
            let A = (0, $64.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
            try {
                A !== null && A !== void 0 || (A = (await this.getClient()).universeDomain)
            } catch (q) {
                A !== null && A !== void 0 || (A = zf8.DEFAULT_UNIVERSE)
            }
            return A
        }
        getAnyScopes() {
            return this.scopes || this.defaultScopes
        }
        getApplicationDefault(A = {}, q) {
            let K;
            if (typeof A === "function") q = A;
            else K = A;
            if (q) this.getApplicationDefaultAsync(K).then((Y) => q(null, Y.credential, Y.projectId), q);
            else return this.getApplicationDefaultAsync(K)
        }
        async getApplicationDefaultAsync(A = {}) {
            if (this.cachedCredential) return await jt(this, Jt, "m", T06).call(this, this.cachedCredential, null);
            let q;
            if (q = await this._tryGetApplicationCredentialsFromEnvironmentVariable(A), q) {
                if (q instanceof Z06.JWT) q.scopes = this.scopes;
                else if (q instanceof rg6.BaseExternalAccountClient) q.scopes = this.getAnyScopes();
                return await jt(this, Jt, "m", T06).call(this, q)
            }
            if (q = await this._tryGetApplicationCredentialsFromWellKnownFile(A), q) {
                if (q instanceof Z06.JWT) q.scopes = this.scopes;
                else if (q instanceof rg6.BaseExternalAccountClient) q.scopes = this.getAnyScopes();
                return await jt(this, Jt, "m", T06).call(this, q)
            }
            if (await this._checkIsGCE()) return A.scopes = this.getAnyScopes(), await jt(this, Jt, "m", T06).call(this, new Df9.Compute(A));
            throw Error(sP.GoogleAuthExceptionMessages.NO_ADC_FOUND)
        }
        async _checkIsGCE() {
            if (this.checkIsGCE === void 0) this.checkIsGCE = ng6.getGCPResidency() || await ng6.isAvailable();
            return this.checkIsGCE
        }
        async _tryGetApplicationCredentialsFromEnvironmentVariable(A) {
            let q = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials;
            if (!q || q.length === 0) return null;
            try {
                return this._getApplicationCredentialsFromFilePath(q, A)
            } catch (K) {
                if (K instanceof Error) K.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${K.message}`;
                throw K
            }
        }
        async _tryGetApplicationCredentialsFromWellKnownFile(A) {
            let q = null;
            if (this._isWindows()) q = process.env.APPDATA;
            else {
                let Y = process.env.HOME;
                if (Y) q = _f8.join(Y, ".config")
            }
            if (q) {
                if (q = _f8.join(q, "gcloud", "application_default_credentials.json"), !og6.existsSync(q)) q = null
            }
            if (!q) return null;
            return await this._getApplicationCredentialsFromFilePath(q, A)
        }
        async _getApplicationCredentialsFromFilePath(A, q = {}) {
            if (!A || A.length === 0) throw Error("The file path is invalid.");
            try {
                if (A = og6.realpathSync(A), !og6.lstatSync(A).isFile()) throw Error()
            } catch (Y) {
                if (Y instanceof Error) Y.message = `The file at ${A} does not exist, or it is not a file. ${Y.message}`;
                throw Y
            }
            let K = og6.createReadStream(A);
            return this.fromStream(K, q)
        }
        fromImpersonatedJSON(A) {
            var q, K, Y, z;
            if (!A) throw Error("Must pass in a JSON object containing an  impersonated refresh token");
            if (A.type !== G06.IMPERSONATED_ACCOUNT_TYPE) throw Error(`The incoming JSON object does not have the "${G06.IMPERSONATED_ACCOUNT_TYPE}" type`);
            if (!A.source_credentials) throw Error("The incoming JSON object does not contain a source_credentials field");
            if (!A.service_account_impersonation_url) throw Error("The incoming JSON object does not contain a service_account_impersonation_url field");
            let _ = this.fromJSON(A.source_credentials);
            if (((q = A.service_account_impersonation_url) === null || q === void 0 ? void 0 : q.length) > 256) throw RangeError(`Target principal is too long: ${A.service_account_impersonation_url}`);
            let w = (Y = (K = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(A.service_account_impersonation_url)) === null || K === void 0 ? void 0 : K.groups) === null || Y === void 0 ? void 0 : Y.target;
            if (!w) throw RangeError(`Cannot extract target principal from ${A.service_account_impersonation_url}`);
            let O = (z = this.getAnyScopes()) !== null && z !== void 0 ? z : [];
            return new G06.Impersonated({
                ...A,
                sourceClient: _,
                targetPrincipal: w,
                targetScopes: Array.isArray(O) ? O : [O]
            })
        }
        fromJSON(A, q = {}) {
            let K, Y = (0, $64.originalOrCamelOptions)(q).get("universe_domain");
            if (A.type === w64.USER_REFRESH_ACCOUNT_TYPE) K = new w64.UserRefreshClient(q), K.fromJSON(A);
            else if (A.type === G06.IMPERSONATED_ACCOUNT_TYPE) K = this.fromImpersonatedJSON(A);
            else if (A.type === rg6.EXTERNAL_ACCOUNT_TYPE) K = Wf9.ExternalAccountClient.fromJSON(A, q), K.scopes = this.getAnyScopes();
            else if (A.type === O64.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) K = new O64.ExternalAccountAuthorizedUserClient(A, q);
            else q.scopes = this.scopes, K = new Z06.JWT(q), this.setGapicJWTValues(K), K.fromJSON(A);
            if (Y) K.universeDomain = Y;
            return K
        }
        _cacheClientFromJSON(A, q) {
            let K = this.fromJSON(A, q);
            return this.jsonContent = A, this.cachedCredential = K, K
        }
        fromStream(A, q = {}, K) {
            let Y = {};
            if (typeof q === "function") K = q;
            else Y = q;
            if (K) this.fromStreamAsync(A, Y).then((z) => K(null, z), K);
            else return this.fromStreamAsync(A, Y)
        }
        fromStreamAsync(A, q) {
            return new Promise((K, Y) => {
                if (!A) throw Error("Must pass in a stream containing the Google auth settings.");
                let z = [];
                A.setEncoding("utf8").on("error", Y).on("data", (_) => z.push(_)).on("end", () => {
                    try {
                        try {
                            let _ = JSON.parse(z.join("")),
                                w = this._cacheClientFromJSON(_, q);
                            return K(w)
                        } catch (_) {
                            if (!this.keyFilename) throw _;
                            let w = new Z06.JWT({
                                ...this.clientOptions,
                                keyFile: this.keyFilename
                            });
                            return this.cachedCredential = w, this.setGapicJWTValues(w), K(w)
                        }
                    } catch (_) {
                        return Y(_)
                    }
                })
            })
        }
        fromAPIKey(A, q = {}) {
            return new Z06.JWT({
                ...q,
                apiKey: A
            })
        }
        _isWindows() {
            let A = jf9.platform();
            if (A && A.length >= 3) {
                if (A.substring(0, 3).toLowerCase() === "win") return !0
            }
            return !1
        }
        async getDefaultServiceProjectId() {
            return new Promise((A) => {
                (0, Hf9.exec)("gcloud config config-helper --format json", (q, K) => {
                    if (!q && K) try {
                        let Y = JSON.parse(K).configuration.properties.core.project;
                        A(Y);
                        return
                    } catch (Y) {}
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
                let q = await this.getClient();
                if (q && q.projectId) return q.projectId
            }
            let A = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
            if (A) return A.projectId;
            else return null
        }
        async getExternalAccountClientProjectId() {
            if (!this.jsonContent || this.jsonContent.type !== rg6.EXTERNAL_ACCOUNT_TYPE) return null;
            return await (await this.getClient()).getProjectId()
        }
        async getGCEProjectId() {
            try {
                return await ng6.project("project-id")
            } catch (A) {
                return null
            }
        }
        getCredentials(A) {
            if (A) this.getCredentialsAsync().then((q) => A(null, q), A);
            else return this.getCredentialsAsync()
        }
        async getCredentialsAsync() {
            let A = await this.getClient();
            if (A instanceof G06.Impersonated) return {
                client_email: A.getTargetPrincipal()
            };
            if (A instanceof rg6.BaseExternalAccountClient) {
                let q = A.getServiceAccountEmail();
                if (q) return {
                    client_email: q,
                    universe_domain: A.universeDomain
                }
            }
            if (this.jsonContent) return {
                client_email: this.jsonContent.client_email,
                private_key: this.jsonContent.private_key,
                universe_domain: this.jsonContent.universe_domain
            };
            if (await this._checkIsGCE()) {
                let [q, K] = await Promise.all([ng6.instance("service-accounts/default/email"), this.getUniverseDomain()]);
                return {
                    client_email: q,
                    universe_domain: K
                }
            }
            throw Error(sP.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND)
        }
        async getClient() {
            if (this.cachedCredential) return this.cachedCredential;
            _64(this, f06, jt(this, f06, "f") || jt(this, Jt, "m", H64).call(this), "f");
            try {
                return await jt(this, f06, "f")
            } finally {
                _64(this, f06, null, "f")
            }
        }
        async getIdTokenClient(A) {
            let q = await this.getClient();
            if (!("fetchIdToken" in q)) throw Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
            return new Xf9.IdTokenClient({
                targetAudience: A,
                idTokenProvider: q
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
            let q = A.url || A.uri,
                Y = await (await this.getClient()).getRequestHeaders(q);
            return A.headers = Object.assign(A.headers || {}, Y), A
        }
        async request(A) {
            return (await this.getClient()).request(A)
        }
        getEnv() {
            return (0, Pf9.getEnv)()
        }
        async sign(A, q) {
            let K = await this.getClient(),
                Y = await this.getUniverseDomain();
            if (q = q || `https://iamcredentials.${Y}/v1/projects/-/serviceAccounts/`, K instanceof G06.Impersonated) return (await K.sign(A)).signedBlob;
            let z = (0, Jf9.createCrypto)();
            if (K instanceof Z06.JWT && K.key) return await z.sign(K.key, A);
            let _ = await this.getCredentials();
            if (!_.client_email) throw Error("Cannot sign data without `client_email`.");
            return this.signBlob(z, _.client_email, A, q)
        }
        async signBlob(A, q, K, Y) {
            let z = new URL(Y + `${q}:signBlob`);
            return (await this.request({
                method: "POST",
                url: z.href,
                data: {
                    payload: A.encodeBase64StringUtf8(K)
                },
                retry: !0,
                retryConfig: {
                    httpMethodsToRetry: ["POST"]
                }
            })).data.signedBlob
        }
    }
    sP.GoogleAuth = wf8;
    f06 = new WeakMap, Jt = new WeakSet, T06 = async function(q, K = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || null) {
        let Y = await this.getProjectIdOptional();
        if (K) q.quotaProjectId = K;
        return this.cachedCredential = q, {
            credential: q,
            projectId: Y
        }
    }, H64 = async function() {
        if (this.jsonContent) return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
        else if (this.keyFilename) {
            let q = _f8.resolve(this.keyFilename),
                K = og6.createReadStream(q);
            return await this.fromStreamAsync(K, this.clientOptions)
        } else if (this.apiKey) {
            let q = await this.fromAPIKey(this.apiKey, this.clientOptions);
            q.scopes = this.scopes;
            let {
                credential: K
            } = await jt(this, Jt, "m", T06).call(this, q);
            return K
        } else {
            let {
                credential: q
            } = await this.getApplicationDefaultAsync(this.clientOptions);
            return q
        }
    };
    wf8.DefaultTransporter = Mf9.DefaultTransporter
})
// @from(Ln 214026, Col 4)
X64 = x((M64) => {
    Object.defineProperty(M64, "__esModule", {
        value: !0
    });
    M64.IAMAuth = void 0;
    class J64 {
        constructor(A, q) {
            this.selector = A, this.token = q, this.selector = A, this.token = q
        }
        getRequestHeaders() {
            return {
                "x-goog-iam-authority-selector": this.selector,
                "x-goog-iam-authorization-token": this.token
            }
        }
    }
    M64.IAMAuth = J64
})
// @from(Ln 214044, Col 4)
G64 = x((W64) => {
    Object.defineProperty(W64, "__esModule", {
        value: !0
    });
    W64.DownscopedClient = W64.EXPIRATION_TIME_OFFSET = W64.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
    var Zf9 = x6("stream"),
        Gf9 = wB(),
        ff9 = hG8(),
        Tf9 = "urn:ietf:params:oauth:grant-type:token-exchange",
        vf9 = "urn:ietf:params:oauth:token-type:access_token",
        Nf9 = "urn:ietf:params:oauth:token-type:access_token";
    W64.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
    W64.EXPIRATION_TIME_OFFSET = 300000;
    class P64 extends Gf9.AuthClient {
        constructor(A, q, K, Y) {
            super({
                ...K,
                quotaProjectId: Y
            });
            if (this.authClient = A, this.credentialAccessBoundary = q, q.accessBoundary.accessBoundaryRules.length === 0) throw Error("At least one access boundary rule needs to be defined.");
            else if (q.accessBoundary.accessBoundaryRules.length > W64.MAX_ACCESS_BOUNDARY_RULES_COUNT) throw Error(`The provided access boundary has more than ${W64.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
            for (let z of q.accessBoundary.accessBoundaryRules)
                if (z.availablePermissions.length === 0) throw Error("At least one permission should be defined in access boundary rules.");
            this.stsCredential = new ff9.StsCredentials(`https://sts.${this.universeDomain}/v1/token`), this.cachedDownscopedAccessToken = null
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
            let q = {
                Authorization: `Bearer ${(await this.getAccessToken()).token}`
            };
            return this.addSharedMetadataHeaders(q)
        }
        request(A, q) {
            if (q) this.requestAsync(A).then((K) => q(null, K), (K) => {
                return q(K, K.response)
            });
            else return this.requestAsync(A)
        }
        async requestAsync(A, q = !1) {
            let K;
            try {
                let Y = await this.getRequestHeaders();
                if (A.headers = A.headers || {}, Y && Y["x-goog-user-project"]) A.headers["x-goog-user-project"] = Y["x-goog-user-project"];
                if (Y && Y.Authorization) A.headers.Authorization = Y.Authorization;
                K = await this.transporter.request(A)
            } catch (Y) {
                let z = Y.response;
                if (z) {
                    let _ = z.status,
                        w = z.config.data instanceof Zf9.Readable;
                    if (!q && (_ === 401 || _ === 403) && !w && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
                }
                throw Y
            }
            return K
        }
        async refreshAccessTokenAsync() {
            var A;
            let q = (await this.authClient.getAccessToken()).token,
                K = {
                    grantType: Tf9,
                    requestedTokenType: vf9,
                    subjectToken: q,
                    subjectTokenType: Nf9
                },
                Y = await this.stsCredential.exchangeToken(K, void 0, this.credentialAccessBoundary),
                z = ((A = this.authClient.credentials) === null || A === void 0 ? void 0 : A.expiry_date) || null,
                _ = Y.expires_in ? new Date().getTime() + Y.expires_in * 1000 : z;
            return this.cachedDownscopedAccessToken = {
                access_token: Y.access_token,
                expiry_date: _,
                res: Y.res
            }, this.credentials = {}, Object.assign(this.credentials, this.cachedDownscopedAccessToken), delete this.credentials.res, this.emit("tokens", {
                refresh_token: null,
                expiry_date: this.cachedDownscopedAccessToken.expiry_date,
                access_token: this.cachedDownscopedAccessToken.access_token,
                token_type: "Bearer",
                id_token: null
            }), this.cachedDownscopedAccessToken
        }
        isExpired(A) {
            let q = new Date().getTime();
            return A.expiry_date ? q >= A.expiry_date - this.eagerRefreshThresholdMillis : !1
        }
    }
    W64.DownscopedClient = P64
})
// @from(Ln 214142, Col 4)
v64 = x((f64) => {
    Object.defineProperty(f64, "__esModule", {
        value: !0
    });
    f64.PassThroughClient = void 0;
    var kf9 = wB();
    class $f8 extends kf9.AuthClient {
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
    f64.PassThroughClient = $f8;
    var Ef9 = new $f8;
    Ef9.getAccessToken()
})
// @from(Ln 214163, Col 4)
OD1 = x((r2) => {
    Object.defineProperty(r2, "__esModule", {
        value: !0
    });
    r2.GoogleAuth = r2.auth = r2.DefaultTransporter = r2.PassThroughClient = r2.ExecutableError = r2.PluggableAuthClient = r2.DownscopedClient = r2.BaseExternalAccountClient = r2.ExternalAccountClient = r2.IdentityPoolClient = r2.AwsRequestSigner = r2.AwsClient = r2.UserRefreshClient = r2.LoginTicket = r2.ClientAuthentication = r2.OAuth2Client = r2.CodeChallengeMethod = r2.Impersonated = r2.JWT = r2.JWTAccess = r2.IdTokenClient = r2.IAMAuth = r2.GCPEnv = r2.Compute = r2.DEFAULT_UNIVERSE = r2.AuthClient = r2.gaxios = r2.gcpMetadata = void 0;
    var N64 = j64();
    Object.defineProperty(r2, "GoogleAuth", {
        enumerable: !0,
        get: function() {
            return N64.GoogleAuth
        }
    });
    r2.gcpMetadata = Bg6();
    r2.gaxios = _I();
    var V64 = wB();
    Object.defineProperty(r2, "AuthClient", {
        enumerable: !0,
        get: function() {
            return V64.AuthClient
        }
    });
    Object.defineProperty(r2, "DEFAULT_UNIVERSE", {
        enumerable: !0,
        get: function() {
            return V64.DEFAULT_UNIVERSE
        }
    });
    var yf9 = OG8();
    Object.defineProperty(r2, "Compute", {
        enumerable: !0,
        get: function() {
            return yf9.Compute
        }
    });
    var Lf9 = HG8();
    Object.defineProperty(r2, "GCPEnv", {
        enumerable: !0,
        get: function() {
            return Lf9.GCPEnv
        }
    });
    var Rf9 = X64();
    Object.defineProperty(r2, "IAMAuth", {
        enumerable: !0,
        get: function() {
            return Rf9.IAMAuth
        }
    });
    var hf9 = $G8();
    Object.defineProperty(r2, "IdTokenClient", {
        enumerable: !0,
        get: function() {
            return hf9.IdTokenClient
        }
    });
    var Sf9 = NG8();
    Object.defineProperty(r2, "JWTAccess", {
        enumerable: !0,
        get: function() {
            return Sf9.JWTAccess
        }
    });
    var Cf9 = kG8();
    Object.defineProperty(r2, "JWT", {
        enumerable: !0,
        get: function() {
            return Cf9.JWT
        }
    });
    var If9 = yG8();
    Object.defineProperty(r2, "Impersonated", {
        enumerable: !0,
        get: function() {
            return If9.Impersonated
        }
    });
    var Hf8 = A36();
    Object.defineProperty(r2, "CodeChallengeMethod", {
        enumerable: !0,
        get: function() {
            return Hf8.CodeChallengeMethod
        }
    });
    Object.defineProperty(r2, "OAuth2Client", {
        enumerable: !0,
        get: function() {
            return Hf8.OAuth2Client
        }
    });
    Object.defineProperty(r2, "ClientAuthentication", {
        enumerable: !0,
        get: function() {
            return Hf8.ClientAuthentication
        }
    });
    var bf9 = zG8();
    Object.defineProperty(r2, "LoginTicket", {
        enumerable: !0,
        get: function() {
            return bf9.LoginTicket
        }
    });
    var xf9 = EG8();
    Object.defineProperty(r2, "UserRefreshClient", {
        enumerable: !0,
        get: function() {
            return xf9.UserRefreshClient
        }
    });
    var uf9 = cG8();
    Object.defineProperty(r2, "AwsClient", {
        enumerable: !0,
        get: function() {
            return uf9.AwsClient
        }
    });
    var mf9 = QG8();
    Object.defineProperty(r2, "AwsRequestSigner", {
        enumerable: !0,
        get: function() {
            return mf9.AwsRequestSigner
        }
    });
    var Bf9 = pG8();
    Object.defineProperty(r2, "IdentityPoolClient", {
        enumerable: !0,
        get: function() {
            return Bf9.IdentityPoolClient
        }
    });
    var gf9 = Kf8();
    Object.defineProperty(r2, "ExternalAccountClient", {
        enumerable: !0,
        get: function() {
            return gf9.ExternalAccountClient
        }
    });
    var Ff9 = Ht();
    Object.defineProperty(r2, "BaseExternalAccountClient", {
        enumerable: !0,
        get: function() {
            return Ff9.BaseExternalAccountClient
        }
    });
    var pf9 = G64();
    Object.defineProperty(r2, "DownscopedClient", {
        enumerable: !0,
        get: function() {
            return pf9.DownscopedClient
        }
    });
    var k64 = wD1();
    Object.defineProperty(r2, "PluggableAuthClient", {
        enumerable: !0,
        get: function() {
            return k64.PluggableAuthClient
        }
    });
    Object.defineProperty(r2, "ExecutableError", {
        enumerable: !0,
        get: function() {
            return k64.ExecutableError
        }
    });
    var Qf9 = v64();
    Object.defineProperty(r2, "PassThroughClient", {
        enumerable: !0,
        get: function() {
            return Qf9.PassThroughClient
        }
    });
    var Uf9 = Fg6();
    Object.defineProperty(r2, "DefaultTransporter", {
        enumerable: !0,
        get: function() {
            return Uf9.DefaultTransporter
        }
    });
    var df9 = new N64.GoogleAuth;
    r2.auth = df9
})
// @from(Ln 214344, Col 4)
$D1 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 214349, Col 4)
E64 = E(() => {
    BW()
})
// @from(Ln 214353, Col 0)
function HD1(A) {
    return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 214356, Col 4)
jf8 = (A) => (jf8 = Array.isArray, jf8(A))
// @from(Ln 214357, Col 4)
Jf8
// @from(Ln 214358, Col 4)
Mf8 = E(() => {
    E64();
    Jf8 = jf8
})
// @from(Ln 214363, Col 0)
function* rf9(A) {
    if (!A) return;
    if (y64 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let _ of z) yield [_, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (Jf8(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let _ = Jf8(Y[1]) ? Y[1] : [Y[1]],
            w = !1;
        for (let O of _) {
            if (O === void 0) continue;
            if (q && !w) w = !0, yield [z, null];
            yield [z, O]
        }
    }
}
// @from(Ln 214391, Col 4)
y64
// @from(Ln 214391, Col 9)
L64 = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [_, w] of rf9(Y)) {
            let O = _.toLowerCase();
            if (!z.has(O)) q.delete(_), z.add(O);
            if (w === null) q.delete(_), K.add(O);
            else q.append(_, w), K.delete(O)
        }
    }
    return {
        [y64]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 214409, Col 4)
R64 = E(() => {
    Mf8();
    y64 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 214414, Col 0)
function sf9(A) {
    let q = new Yk(A);
    return delete q.batches, q
}
// @from(Ln 214419, Col 0)
function tf9(A) {
    let q = new gW(A);
    return delete q.messages.batches, q
}
// @from(Ln 214423, Col 4)
h64
// @from(Ln 214423, Col 9)
of9 = "vertex-2023-10-16"
// @from(Ln 214424, Col 4)
af9
// @from(Ln 214424, Col 9)
Df8
// @from(Ln 214425, Col 4)
Xf8 = E(() => {
    jU();
    Jx6();
    Mf8();
    R64();
    jU();
    h64 = t(OD1(), 1), af9 = new Set(["/v1/messages", "/v1/messages?beta=true"]);
    Df8 = class Df8 extends yz {
        constructor({
            baseURL: A = $D1("ANTHROPIC_VERTEX_BASE_URL"),
            region: q = $D1("CLOUD_ML_REGION") ?? null,
            projectId: K = $D1("ANTHROPIC_VERTEX_PROJECT_ID") ?? null,
            ...Y
        } = {}) {
            if (!q) throw Error("No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.");
            super({
                baseURL: A || (q === "global" ? "https://aiplatform.googleapis.com/v1" : `https://${q}-aiplatform.googleapis.com/v1`),
                ...Y
            });
            if (this.messages = sf9(this), this.beta = tf9(this), this.region = q, this.projectId = K, this.accessToken = Y.accessToken ?? null, Y.authClient && Y.googleAuth) throw Error("You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.");
            else if (Y.authClient) this._authClientPromise = Promise.resolve(Y.authClient);
            else this._auth = Y.googleAuth ?? new h64.GoogleAuth({
                scopes: "https://www.googleapis.com/auth/cloud-platform"
            }), this._authClientPromise = this._auth.getClient()
        }
        validateHeaders() {}
        async prepareOptions(A) {
            let q = await this._authClientPromise,
                K = await q.getRequestHeaders(),
                Y = q.projectId ?? K["x-goog-user-project"];
            if (!this.projectId && Y) this.projectId = Y;
            A.headers = L64([K, A.headers])
        }
        async buildRequest(A) {
            if (HD1(A.body)) A.body = {
                ...A.body
            };
            if (HD1(A.body)) {
                if (!A.body.anthropic_version) A.body.anthropic_version = of9
            }
            if (af9.has(A.path) && A.method === "post") {
                if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
                if (!HD1(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
                let q = A.body.model;
                A.body.model = void 0;
                let Y = A.body.stream ?? !1 ? "streamRawPredict" : "rawPredict";
                A.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/${q}:${Y}`
            }
            if (A.path === "/v1/messages/count_tokens" || A.path == "/v1/messages/count_tokens?beta=true" && A.method === "post") {
                if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
                A.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/count-tokens:rawPredict`
            }
            return super.buildRequest(A)
        }
    }
})
// @from(Ln 214481, Col 4)
S64 = {}
// @from(Ln 214487, Col 4)
C64 = E(() => {
    Xf8();
    Xf8()
})
// @from(Ln 214492, Col 0)
function jD1() {
    return {
        error: (A, ...q) => console.error("[Anthropic SDK ERROR]", A, ...q),
        warn: (A, ...q) => console.error("[Anthropic SDK WARN]", A, ...q),
        info: (A, ...q) => console.error("[Anthropic SDK INFO]", A, ...q),
        debug: (A, ...q) => console.error("[Anthropic SDK DEBUG]", A, ...q)
    }
}
// @from(Ln 214500, Col 0)
async function MI({
    apiKey: A,
    maxRetries: q,
    model: K,
    fetchOverride: Y,
    source: z
}) {
    let _ = process.env.CLAUDE_CODE_CONTAINER_ID,
        w = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
        O = process.env.CLAUDE_AGENT_SDK_CLIENT_APP,
        $ = AT9(),
        H = {
            "x-app": "cli",
            "User-Agent": Gy(),
            ...$,
            ..._ ? {
                "x-claude-remote-container-id": _
            } : {},
            ...w ? {
                "x-claude-remote-session-id": w
            } : {},
            ...O ? {
                "x-client-app": O
            } : {}
        };
    if (k(`[API:request] Creating client, ANTHROPIC_CUSTOM_HEADERS present: ${!!process.env.ANTHROPIC_CUSTOM_HEADERS}, has Authorization header: ${!!$.Authorization}`), t6(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) H["x-anthropic-additional-protection"] = "true";
    if (k("[API:auth] OAuth token check starting"), await dz(), k("[API:auth] OAuth token check complete"), !iA()) ef9(H, q7());
    let J = qT9(Y, z),
        M = {
            defaultHeaders: H,
            maxRetries: q,
            timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
            dangerouslyAllowBrowser: !0,
            fetchOptions: W46({
                forAnthropicAPI: !0
            }),
            ...J && {
                fetch: J
            }
        };
    if (t6(process.env.CLAUDE_CODE_USE_BEDROCK)) {
        let {
            AnthropicBedrock: X
        } = await Promise.resolve().then(() => (fB7(), GB7)), P = K === lH() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : OA6(), W = {
            ...M,
            awsRegion: P,
            ...t6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && {
                skipAuth: !0
            },
            ...Sx() && {
                logger: jD1()
            }
        };
        if (process.env.AWS_BEARER_TOKEN_BEDROCK) W.skipAuth = !0, W.defaultHeaders = {
            ...W.defaultHeaders,
            Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
        };
        else if (!t6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
            let Z = await To();
            if (Z) W.awsAccessKey = Z.accessKeyId, W.awsSecretKey = Z.secretAccessKey, W.awsSessionToken = Z.sessionToken
        }
        return new X(W)
    }
    if (t6(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
        let {
            AnthropicFoundry: X
        } = await Promise.resolve().then(() => (yB7(), EB7)), P;
        if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
            if (t6(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) P = () => Promise.resolve("");
            else {
                let {
                    DefaultAzureCredential: Z,
                    getBearerTokenProvider: G
                } = await Promise.resolve().then(() => (pn7(), Fn7));
                P = G(new Z, "https://cognitiveservices.azure.com/.default")
            } let W = {
            ...M,
            ...P && {
                azureADTokenProvider: P
            },
            ...Sx() && {
                logger: jD1()
            }
        };
        return new X(W)
    }
    if (t6(process.env.CLAUDE_CODE_USE_VERTEX)) {
        if (!t6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) await sg6();
        let [{
            AnthropicVertex: X
        }, {
            GoogleAuth: P
        }] = await Promise.all([Promise.resolve().then(() => (C64(), S64)), Promise.resolve().then(() => t(OD1(), 1))]), W = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project, Z = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials, G = t6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH) ? {
            getClient: () => ({
                getRequestHeaders: () => ({})
            })
        } : new P({
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
            ...W || Z ? {} : {
                projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID
            }
        }), f = {
            ...M,
            region: lt6(K),
            googleAuth: G,
            ...Sx() && {
                logger: jD1()
            }
        };
        return new X(f)
    }
    let D = {
        apiKey: iA() ? null : A || RV(),
        authToken: iA() ? sA()?.accessToken : void 0,
        ...{},
        ...M,
        ...Sx() && {
            logger: jD1()
        }
    };
    return new kC(D)
}
// @from(Ln 214623, Col 0)
function ef9(A, q) {
    let K = process.env.ANTHROPIC_AUTH_TOKEN || v06(q);
    if (K) A.Authorization = `Bearer ${K}`
}
// @from(Ln 214628, Col 0)
function AT9() {
    let A = {},
        q = process.env.ANTHROPIC_CUSTOM_HEADERS;
    if (!q) return A;
    let K = q.split(/\n|\r\n/);
    for (let Y of K) {
        if (!Y.trim()) continue;
        let z = Y.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
        if (z) {
            let [, _, w] = z;
            if (_ && w !== void 0) A[_] = w
        }
    }
    return A
}
// @from(Ln 214644, Col 0)
function qT9(A, q) {
    return A
}
// @from(Ln 214647, Col 4)
ag6 = E(() => {
    wv();
    fA();
    T1();
    RM();
    A8();
    dV();
    F5();
    H1();
    z4()
})
// @from(Ln 214659, Col 0)
function KT9(A, q) {
    return A && v31(A, q, aE)
}
// @from(Ln 214662, Col 4)
JD1
// @from(Ln 214663, Col 4)
Pf8 = E(() => {
    tK8();
    d86();
    JD1 = KT9
})
// @from(Ln 214669, Col 0)
function YT9(A, q) {
    var K = {};
    return q = Ex(q, 3), JD1(A, function(Y, z, _) {
        En(K, z, q(Y, z, _))
    }), K
}
// @from(Ln 214675, Col 4)
K36
// @from(Ln 214676, Col 4)
MD1 = E(() => {
    ek6();
    Pf8();
    Sw6();
    K36 = YT9
})
// @from(Ln 214683, Col 0)
function N06(A) {
    if (Dq() && A) return zT9;
    return DD1
}
// @from(Ln 214688, Col 0)
function wT9(A, q) {
    return q.input_tokens / 1e6 * A.inputTokens + q.output_tokens / 1e6 * A.outputTokens + (q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens + (q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens + (q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}
// @from(Ln 214692, Col 0)
function OT9(A, q) {
    let K = IY(A);
    if (K === Of(wJ6.firstParty)) {
        let z = q.speed === "fast";
        return N06(z)
    }
    let Y = XD1[K];
    if (!Y) return $T9(A, K), XD1[IY(Mv())] ?? _T9;
    return Y
}
// @from(Ln 214703, Col 0)
function $T9(A, q) {
    d("tengu_unknown_model_cost", {
        model: A,
        shortName: q
    }), Gt6()
}
// @from(Ln 214710, Col 0)
function tg6(A, q) {
    let K = OT9(A, q);
    return wT9(K, q)
}
// @from(Ln 214715, Col 0)
function PD1(A, q) {
    let K = {
        input_tokens: q.inputTokens,
        output_tokens: q.outputTokens,
        cache_read_input_tokens: q.cacheReadInputTokens,
        cache_creation_input_tokens: q.cacheCreationInputTokens
    };
    return tg6(A, K)
}
// @from(Ln 214725, Col 0)
function b64(A) {
    if (Number.isInteger(A)) return `$${A}`;
    return `$${A.toFixed(2)}`
}
// @from(Ln 214730, Col 0)
function zR(A) {
    return `${b64(A.inputTokens)}/${b64(A.outputTokens)} per Mtok`
}
// @from(Ln 214733, Col 4)
OB
// @from(Ln 214733, Col 8)
I64
// @from(Ln 214733, Col 13)
DD1
// @from(Ln 214733, Col 18)
zT9
// @from(Ln 214733, Col 23)
Wf8
// @from(Ln 214733, Col 28)
Zf8
// @from(Ln 214733, Col 33)
_T9
// @from(Ln 214733, Col 38)
XD1
// @from(Ln 214734, Col 4)
Mt = E(() => {
    $k();
    V1();
    FW();
    T31();
    z4();
    OB = {
        inputTokens: 3,
        outputTokens: 15,
        promptCacheWriteTokens: 3.75,
        promptCacheReadTokens: 0.3,
        webSearchRequests: 0.01
    }, I64 = {
        inputTokens: 15,
        outputTokens: 75,
        promptCacheWriteTokens: 18.75,
        promptCacheReadTokens: 1.5,
        webSearchRequests: 0.01
    }, DD1 = {
        inputTokens: 5,
        outputTokens: 25,
        promptCacheWriteTokens: 6.25,
        promptCacheReadTokens: 0.5,
        webSearchRequests: 0.01
    }, zT9 = {
        inputTokens: 30,
        outputTokens: 150,
        promptCacheWriteTokens: 37.5,
        promptCacheReadTokens: 3,
        webSearchRequests: 0.01
    }, Wf8 = {
        inputTokens: 0.8,
        outputTokens: 4,
        promptCacheWriteTokens: 1,
        promptCacheReadTokens: 0.08,
        webSearchRequests: 0.01
    }, Zf8 = {
        inputTokens: 1,
        outputTokens: 5,
        promptCacheWriteTokens: 1.25,
        promptCacheReadTokens: 0.1,
        webSearchRequests: 0.01
    }, _T9 = DD1;
    XD1 = {
        [Of(dK8.firstParty)]: Wf8,
        [Of(cK8.firstParty)]: Zf8,
        [Of(UK8.firstParty)]: OB,
        [Of(QK8.firstParty)]: OB,
        [Of(lK8.firstParty)]: OB,
        [Of(iK8.firstParty)]: OB,
        [Of(aK8.firstParty)]: OB,
        [Of(nK8.firstParty)]: I64,
        [Of(rK8.firstParty)]: I64,
        [Of(oK8.firstParty)]: DD1,
        [Of(wJ6.firstParty)]: DD1
    }
})
// @from(Ln 214805, Col 0)
function Gf8() {
    return !1
}
// @from(Ln 214808, Col 0)
async function jT9(A, q, K) {
    if (!Gf8()) return await K();
    let Y = m64("sha1").update(B6(A)).digest("hex").slice(0, 12),
        z = g64(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? G1(), `fixtures/${q}-${Y}.json`);
    try {
        return i1(await p64(z, {
            encoding: "utf8"
        }))
    } catch (w) {
        if (w.code !== "ENOENT") throw w
    }
    if ((Q8.isCI || !1) && !t6(process.env.VCR_RECORD)) throw Error(`Fixture missing: ${z}. Re-run tests with VCR_RECORD=1, then commit the result.`);
    let _ = await K();
    return await Q64(B64(z), {
        recursive: !0
    }), await F64(z, B6(_, null, 2), {
        encoding: "utf8"
    }), _
}
// @from(Ln 214827, Col 0)
async function ZD1(A, q) {
    if (!Gf8()) return await q();
    let K = cM(A.filter((w) => {
            if (w.type !== "user") return !0;
            if (w.isMeta) return !1;
            return !0
        })),
        Y = MT9(K.map((w) => w.message.content), u64),
        z = g64(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? G1(), `fixtures/${Y.map((w)=>m64("sha1").update(B6(w)).digest("hex").slice(0,6)).join("-")}.json`);
    try {
        let w = i1(await p64(z, {
            encoding: "utf8"
        }));
        return w.output.forEach(JT9), w.output.map((O, $) => x64(O, XT9, $, HT9()))
    } catch (w) {
        if (w.code !== "ENOENT") throw w
    }
    if (Q8.isCI && !t6(process.env.VCR_RECORD)) throw Error(`Anthropic API fixture missing: ${z}. Re-run tests with VCR_RECORD=1, then commit the result. Input messages:
${B6(Y,null,2)}`);
    let _ = await q();
    if (Q8.isCI && !t6(process.env.VCR_RECORD)) return _;
    return await Q64(B64(z), {
        recursive: !0
    }), await F64(z, B6({
        input: Y,
        output: _.map((w, O) => x64(w, u64, O))
    }, null, 2), {
        encoding: "utf8"
    }), _
}
// @from(Ln 214858, Col 0)
function JT9(A) {
    if (A.type === "stream_event") return;
    let q = A.message.model,
        K = A.message.usage,
        Y = tg6(q, K);
    s21(Y, K, q)
}
// @from(Ln 214866, Col 0)
function MT9(A, q) {
    return A.map((K) => {
        if (typeof K === "string") return q(K);
        return K.map((Y) => {
            switch (Y.type) {
                case "tool_result":
                    if (typeof Y.content === "string") return {
                        ...Y,
                        content: q(Y.content)
                    };
                    if (Array.isArray(Y.content)) return {
                        ...Y,
                        content: Y.content.map((z) => {
                            switch (z.type) {
                                case "text":
                                    return {
                                        ...z, text: q(z.text)
                                    };
                                case "image":
                                    return z;
                                default:
                                    return
                            }
                        })
                    };
                    return Y;
                case "text":
                    return {
                        ...Y, text: q(Y.text)
                    };
                case "tool_use":
                    return {
                        ...Y, input: WD1(Y.input, q)
                    };
                case "image":
                    return Y;
                default:
                    return
            }
        })
    })
}
// @from(Ln 214909, Col 0)
function WD1(A, q) {
    return K36(A, (K, Y) => {
        if (Array.isArray(K)) return K.map((z) => WD1(z, q));
        if ($J6(K)) return WD1(K, q);
        return q(K, Y, A)
    })
}
// @from(Ln 214917, Col 0)
function DT9(A, q, K, Y) {
    return {
        uuid: Y ?? `UUID-${K}`,
        requestId: "REQUEST_ID",
        timestamp: A.timestamp,
        message: {
            ...A.message,
            content: A.message.content.map((z) => {
                switch (z.type) {
                    case "text":
                        return {
                            ...z, text: q(z.text), citations: z.citations || []
                        };
                    case "tool_use":
                        return {
                            ...z, input: WD1(z.input, q)
                        };
                    default:
                        return z
                }
            }).filter(Boolean)
        },
        type: "assistant"
    }
}
// @from(Ln 214943, Col 0)
function x64(A, q, K, Y) {
    if (A.type === "assistant") return DT9(A, q, K, Y);
    else return A
}
// @from(Ln 214948, Col 0)
function u64(A) {
    if (typeof A !== "string") return A;
    let q = G1(),
        K = c8(),
        Y = A.replace(/num_files="\d+"/g, 'num_files="[NUM]"').replace(/duration_ms="\d+"/g, 'duration_ms="[DURATION]"').replace(/cost_usd="\d+"/g, 'cost_usd="[COST]"').replaceAll(K, "[CONFIG_HOME]").replaceAll(q, "[CWD]").replace(/Available commands:.+/, "Available commands: [COMMANDS]");
    if (process.platform === "win32") {
        let z = q.replaceAll("\\", "/"),
            _ = K.replaceAll("\\", "/"),
            w = B6(q).slice(1, -1),
            O = B6(K).slice(1, -1);
        Y = Y.replaceAll(w, "[CWD]").replaceAll(O, "[CONFIG_HOME]").replaceAll(z, "[CWD]").replaceAll(_, "[CONFIG_HOME]")
    }
    if (Y = Y.replace(/\[CWD\][^\s"'<>]*/g, (z) => z.replaceAll("\\\\", "/").replaceAll("\\", "/")).replace(/\[CONFIG_HOME\][^\s"'<>]*/g, (z) => z.replaceAll("\\\\", "/").replaceAll("\\", "/")), Y.includes("Files modified by user:")) return "Files modified by user: [FILES]";
    return Y
}
// @from(Ln 214964, Col 0)
function XT9(A) {
    if (typeof A !== "string") return A;
    return A.replaceAll("[NUM]", "1").replaceAll("[DURATION]", "100").replaceAll("[CONFIG_HOME]", c8()).replaceAll("[CWD]", G1())
}
// @from(Ln 214968, Col 0)
async function* ff8(A, q) {
    if (!Gf8()) return yield* q();
    let K = [],
        Y = await ZD1(A, async () => {
            for await (let z of q()) K.push(z);
            return K
        });
    if (Y.length > 0) {
        yield* Y;
        return
    }
    yield* K
}
// @from(Ln 214981, Col 0)
async function U64(A, q, K) {
    return (await jT9({
        messages: A,
        tools: q
    }, "token-count", async () => ({
        tokenCount: await K()
    }))).tokenCount
}
// @from(Ln 214989, Col 4)
Tf8 = E(() => {
    d3();
    lA();
    A8();
    N31();
    MD1();
    JA();
    Mt();
    $k();
    g1()
})
// @from(Ln 215000, Col 4)
eg6 = x((Ab2, c64) => {
    var d64 = {
            DOT_LITERAL: "\\.",
            PLUS_LITERAL: "\\+",
            QMARK_LITERAL: "\\?",
            SLASH_LITERAL: "\\/",
            ONE_CHAR: "(?=.)",
            QMARK: "[^/]",
            END_ANCHOR: "(?:\\/|$)",
            DOTS_SLASH: "\\.{1,2}(?:\\/|$)",
            NO_DOT: "(?!\\.)",
            NO_DOTS: "(?!(?:^|\\/)\\.{1,2}(?:\\/|$))",
            NO_DOT_SLASH: "(?!\\.{0,1}(?:\\/|$))",
            NO_DOTS_SLASH: "(?!\\.{1,2}(?:\\/|$))",
            QMARK_NO_DOT: "[^.\\/]",
            STAR: "[^/]*?",
            START_ANCHOR: "(?:^|\\/)",
            SEP: "/"
        },
        PT9 = {
            ...d64,
            SLASH_LITERAL: "[\\\\/]",
            QMARK: "[^\\\\/]",
            STAR: "[^\\\\/]*?",
            DOTS_SLASH: "\\.{1,2}(?:[\\\\/]|$)",
            NO_DOT: "(?!\\.)",
            NO_DOTS: "(?!(?:^|[\\\\/])\\.{1,2}(?:[\\\\/]|$))",
            NO_DOT_SLASH: "(?!\\.{0,1}(?:[\\\\/]|$))",
            NO_DOTS_SLASH: "(?!\\.{1,2}(?:[\\\\/]|$))",
            QMARK_NO_DOT: "[^.\\\\/]",
            START_ANCHOR: "(?:^|[\\\\/])",
            END_ANCHOR: "(?:[\\\\/]|$)",
            SEP: "\\"
        },
        WT9 = {
            alnum: "a-zA-Z0-9",
            alpha: "a-zA-Z",
            ascii: "\\x00-\\x7F",
            blank: " \\t",
            cntrl: "\\x00-\\x1F\\x7F",
            digit: "0-9",
            graph: "\\x21-\\x7E",
            lower: "a-z",
            print: "\\x20-\\x7E ",
            punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
            space: " \\t\\r\\n\\v\\f",
            upper: "A-Z",
            word: "A-Za-z0-9_",
            xdigit: "A-Fa-f0-9"
        };
    c64.exports = {
        MAX_LENGTH: 65536,
        POSIX_REGEX_SOURCE: WT9,
        REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
        REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
        REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
        REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
        REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
        REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
        REPLACEMENTS: {
            __proto__: null,
            "***": "*",
            "**/**": "**",
            "**/**/**": "**"
        },
        CHAR_0: 48,
        CHAR_9: 57,
        CHAR_UPPERCASE_A: 65,
        CHAR_LOWERCASE_A: 97,
        CHAR_UPPERCASE_Z: 90,
        CHAR_LOWERCASE_Z: 122,
        CHAR_LEFT_PARENTHESES: 40,
        CHAR_RIGHT_PARENTHESES: 41,
        CHAR_ASTERISK: 42,
        CHAR_AMPERSAND: 38,
        CHAR_AT: 64,
        CHAR_BACKWARD_SLASH: 92,
        CHAR_CARRIAGE_RETURN: 13,
        CHAR_CIRCUMFLEX_ACCENT: 94,
        CHAR_COLON: 58,
        CHAR_COMMA: 44,
        CHAR_DOT: 46,
        CHAR_DOUBLE_QUOTE: 34,
        CHAR_EQUAL: 61,
        CHAR_EXCLAMATION_MARK: 33,
        CHAR_FORM_FEED: 12,
        CHAR_FORWARD_SLASH: 47,
        CHAR_GRAVE_ACCENT: 96,
        CHAR_HASH: 35,
        CHAR_HYPHEN_MINUS: 45,
        CHAR_LEFT_ANGLE_BRACKET: 60,
        CHAR_LEFT_CURLY_BRACE: 123,
        CHAR_LEFT_SQUARE_BRACKET: 91,
        CHAR_LINE_FEED: 10,
        CHAR_NO_BREAK_SPACE: 160,
        CHAR_PERCENT: 37,
        CHAR_PLUS: 43,
        CHAR_QUESTION_MARK: 63,
        CHAR_RIGHT_ANGLE_BRACKET: 62,
        CHAR_RIGHT_CURLY_BRACE: 125,
        CHAR_RIGHT_SQUARE_BRACKET: 93,
        CHAR_SEMICOLON: 59,
        CHAR_SINGLE_QUOTE: 39,
        CHAR_SPACE: 32,
        CHAR_TAB: 9,
        CHAR_UNDERSCORE: 95,
        CHAR_VERTICAL_LINE: 124,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
        extglobChars(A) {
            return {
                "!": {
                    type: "negate",
                    open: "(?:(?!(?:",
                    close: `))${A.STAR})`
                },
                "?": {
                    type: "qmark",
                    open: "(?:",
                    close: ")?"
                },
                "+": {
                    type: "plus",
                    open: "(?:",
                    close: ")+"
                },
                "*": {
                    type: "star",
                    open: "(?:",
                    close: ")*"
                },
                "@": {
                    type: "at",
                    open: "(?:",
                    close: ")"
                }
            }
        },
        globChars(A) {
            return A === !0 ? PT9 : d64
        }
    }
})
// @from(Ln 215142, Col 4)
AF6 = x((vT9) => {
    var {
        REGEX_BACKSLASH: ZT9,
        REGEX_REMOVE_BACKSLASH: GT9,
        REGEX_SPECIAL_CHARS: fT9,
        REGEX_SPECIAL_CHARS_GLOBAL: TT9
    } = eg6();
    vT9.isObject = (A) => A !== null && typeof A === "object" && !Array.isArray(A);
    vT9.hasRegexChars = (A) => fT9.test(A);
    vT9.isRegexChar = (A) => A.length === 1 && vT9.hasRegexChars(A);
    vT9.escapeRegex = (A) => A.replace(TT9, "\\$1");
    vT9.toPosixSlashes = (A) => A.replace(ZT9, "/");
    vT9.isWindows = () => {
        if (typeof navigator < "u" && navigator.platform) {
            let A = navigator.platform.toLowerCase();
            return A === "win32" || A === "windows"
        }
        if (typeof process < "u" && process.platform) return process.platform === "win32";
        return !1
    };
    vT9.removeBackslashes = (A) => {
        return A.replace(GT9, (q) => {
            return q === "\\" ? "" : q
        })
    };
    vT9.escapeLast = (A, q, K) => {
        let Y = A.lastIndexOf(q, K);
        if (Y === -1) return A;
        if (A[Y - 1] === "\\") return vT9.escapeLast(A, q, Y - 1);
        return `${A.slice(0,Y)}\\${A.slice(Y)}`
    };
    vT9.removePrefix = (A, q = {}) => {
        let K = A;
        if (K.startsWith("./")) K = K.slice(2), q.prefix = "./";
        return K
    };
    vT9.wrapOutput = (A, q = {}, K = {}) => {
        let Y = K.contains ? "" : "^",
            z = K.contains ? "" : "$",
            _ = `${Y}(?:${A})${z}`;
        if (q.negated === !0) _ = `(?:^(?!${_}).*$)`;
        return _
    };
    vT9.basename = (A, {
        windows: q
    } = {}) => {
        let K = A.split(q ? /[\\/]/ : "/"),
            Y = K[K.length - 1];
        if (Y === "") return K[K.length - 2];
        return Y
    }
})
// @from(Ln 215194, Col 4)
A14 = x((Kb2, e64) => {
    var n64 = AF6(),
        {
            CHAR_ASTERISK: vf8,
            CHAR_AT: CT9,
            CHAR_BACKWARD_SLASH: qF6,
            CHAR_COMMA: IT9,
            CHAR_DOT: Nf8,
            CHAR_EXCLAMATION_MARK: Vf8,
            CHAR_FORWARD_SLASH: t64,
            CHAR_LEFT_CURLY_BRACE: kf8,
            CHAR_LEFT_PARENTHESES: Ef8,
            CHAR_LEFT_SQUARE_BRACKET: bT9,
            CHAR_PLUS: xT9,
            CHAR_QUESTION_MARK: r64,
            CHAR_RIGHT_CURLY_BRACE: uT9,
            CHAR_RIGHT_PARENTHESES: o64,
            CHAR_RIGHT_SQUARE_BRACKET: mT9
        } = eg6(),
        a64 = (A) => {
            return A === t64 || A === qF6
        },
        s64 = (A) => {
            if (A.isPrefix !== !0) A.depth = A.isGlobstar ? 1 / 0 : 1
        },
        BT9 = (A, q) => {
            let K = q || {},
                Y = A.length - 1,
                z = K.parts === !0 || K.scanToEnd === !0,
                _ = [],
                w = [],
                O = [],
                $ = A,
                H = -1,
                j = 0,
                J = 0,
                M = !1,
                D = !1,
                X = !1,
                P = !1,
                W = !1,
                Z = !1,
                G = !1,
                f = !1,
                v = !1,
                N = !1,
                V = 0,
                L, h, R = {
                    value: "",
                    depth: 0,
                    isGlob: !1
                },
                u = () => H >= Y,
                I = () => $.charCodeAt(H + 1),
                g = () => {
                    return L = h, $.charCodeAt(++H)
                };
            while (H < Y) {
                h = g();
                let U;
                if (h === qF6) {
                    if (G = R.backslashes = !0, h = g(), h === kf8) Z = !0;
                    continue
                }
                if (Z === !0 || h === kf8) {
                    V++;
                    while (u() !== !0 && (h = g())) {
                        if (h === qF6) {
                            G = R.backslashes = !0, g();
                            continue
                        }
                        if (h === kf8) {
                            V++;
                            continue
                        }
                        if (Z !== !0 && h === Nf8 && (h = g()) === Nf8) {
                            if (M = R.isBrace = !0, X = R.isGlob = !0, N = !0, z === !0) continue;
                            break
                        }
                        if (Z !== !0 && h === IT9) {
                            if (M = R.isBrace = !0, X = R.isGlob = !0, N = !0, z === !0) continue;
                            break
                        }
                        if (h === uT9) {
                            if (V--, V === 0) {
                                Z = !1, M = R.isBrace = !0, N = !0;
                                break
                            }
                        }
                    }
                    if (z === !0) continue;
                    break
                }
                if (h === t64) {
                    if (_.push(H), w.push(R), R = {
                            value: "",
                            depth: 0,
                            isGlob: !1
                        }, N === !0) continue;
                    if (L === Nf8 && H === j + 1) {
                        j += 2;
                        continue
                    }
                    J = H + 1;
                    continue
                }
                if (K.noext !== !0) {
                    if ((h === xT9 || h === CT9 || h === vf8 || h === r64 || h === Vf8) === !0 && I() === Ef8) {
                        if (X = R.isGlob = !0, P = R.isExtglob = !0, N = !0, h === Vf8 && H === j) v = !0;
                        if (z === !0) {
                            while (u() !== !0 && (h = g())) {
                                if (h === qF6) {
                                    G = R.backslashes = !0, h = g();
                                    continue
                                }
                                if (h === o64) {
                                    X = R.isGlob = !0, N = !0;
                                    break
                                }
                            }
                            continue
                        }
                        break
                    }
                }
                if (h === vf8) {
                    if (L === vf8) W = R.isGlobstar = !0;
                    if (X = R.isGlob = !0, N = !0, z === !0) continue;
                    break
                }
                if (h === r64) {
                    if (X = R.isGlob = !0, N = !0, z === !0) continue;
                    break
                }
                if (h === bT9) {
                    while (u() !== !0 && (U = g())) {
                        if (U === qF6) {
                            G = R.backslashes = !0, g();
                            continue
                        }
                        if (U === mT9) {
                            D = R.isBracket = !0, X = R.isGlob = !0, N = !0;
                            break
                        }
                    }
                    if (z === !0) continue;
                    break
                }
                if (K.nonegate !== !0 && h === Vf8 && H === j) {
                    f = R.negated = !0, j++;
                    continue
                }
                if (K.noparen !== !0 && h === Ef8) {
                    if (X = R.isGlob = !0, z === !0) {
                        while (u() !== !0 && (h = g())) {
                            if (h === Ef8) {
                                G = R.backslashes = !0, h = g();
                                continue
                            }
                            if (h === o64) {
                                N = !0;
                                break
                            }
                        }
                        continue
                    }
                    break
                }
                if (X === !0) {
                    if (N = !0, z === !0) continue;
                    break
                }
            }
            if (K.noext === !0) P = !1, X = !1;
            let B = $,
                b = "",
                p = "";
            if (j > 0) b = $.slice(0, j), $ = $.slice(j), J -= j;
            if (B && X === !0 && J > 0) B = $.slice(0, J), p = $.slice(J);
            else if (X === !0) B = "", p = $;
            else B = $;
            if (B && B !== "" && B !== "/" && B !== $) {
                if (a64(B.charCodeAt(B.length - 1))) B = B.slice(0, -1)
            }
            if (K.unescape === !0) {
                if (p) p = n64.removeBackslashes(p);
                if (B && G === !0) B = n64.removeBackslashes(B)
            }
            let Q = {
                prefix: b,
                input: A,
                start: j,
                base: B,
                glob: p,
                isBrace: M,
                isBracket: D,
                isGlob: X,
                isExtglob: P,
                isGlobstar: W,
                negated: f,
                negatedExtglob: v
            };
            if (K.tokens === !0) {
                if (Q.maxDepth = 0, !a64(h)) w.push(R);
                Q.tokens = w
            }
            if (K.parts === !0 || K.tokens === !0) {
                let U;
                for (let r = 0; r < _.length; r++) {
                    let e = U ? U + 1 : j,
                        Y6 = _[r],
                        H6 = A.slice(e, Y6);
                    if (K.tokens) {
                        if (r === 0 && j !== 0) w[r].isPrefix = !0, w[r].value = b;
                        else w[r].value = H6;
                        s64(w[r]), Q.maxDepth += w[r].depth
                    }
                    if (r !== 0 || H6 !== "") O.push(H6);
                    U = Y6
                }
                if (U && U + 1 < A.length) {
                    let r = A.slice(U + 1);
                    if (O.push(r), K.tokens) w[w.length - 1].value = r, s64(w[w.length - 1]), Q.maxDepth += w[w.length - 1].depth
                }
                Q.slashes = _, Q.parts = O
            }
            return Q
        };
    e64.exports = BT9
})