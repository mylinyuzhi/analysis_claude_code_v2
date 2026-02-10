
// @from(Ln 188097, Col 4)
ewA = R((Tf7) => {
    Object.defineProperty(Tf7, "__esModule", {
        value: !0
    });
    Tf7.InvalidSubjectTokenError = Tf7.InvalidMessageFieldError = Tf7.InvalidCodeFieldError = Tf7.InvalidTokenTypeFieldError = Tf7.InvalidExpirationTimeFieldError = Tf7.InvalidSuccessFieldError = Tf7.InvalidVersionFieldError = Tf7.ExecutableResponseError = Tf7.ExecutableResponse = void 0;
    var Iz6 = "urn:ietf:params:oauth:token-type:saml2",
        iwA = "urn:ietf:params:oauth:token-type:id_token",
        nwA = "urn:ietf:params:oauth:token-type:jwt";
    class Vf7 {
        constructor(A) {
            if (!A.version) throw new rwA("Executable response must contain a 'version' field.");
            if (A.success === void 0) throw new owA("Executable response must contain a 'success' field.");
            if (this.version = A.version, this.success = A.success, this.success) {
                if (this.expirationTime = A.expiration_time, this.tokenType = A.token_type, this.tokenType !== Iz6 && this.tokenType !== iwA && this.tokenType !== nwA) throw new awA(`Executable response must contain a 'token_type' field when successful and it must be one of ${iwA}, ${nwA}, or ${Iz6}.`);
                if (this.tokenType === Iz6) {
                    if (!A.saml_response) throw new xz6(`Executable response must contain a 'saml_response' field when token_type=${Iz6}.`);
                    this.subjectToken = A.saml_response
                } else {
                    if (!A.id_token) throw new xz6(`Executable response must contain a 'id_token' field when token_type=${iwA} or ${nwA}.`);
                    this.subjectToken = A.id_token
                }
            } else {
                if (!A.code) throw new swA("Executable response must contain a 'code' field when unsuccessful.");
                if (!A.message) throw new twA("Executable response must contain a 'message' field when unsuccessful.");
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
    Tf7.ExecutableResponse = Vf7;
    class FU extends Error {
        constructor(A) {
            super(A);
            Object.setPrototypeOf(this, new.target.prototype)
        }
    }
    Tf7.ExecutableResponseError = FU;
    class rwA extends FU {}
    Tf7.InvalidVersionFieldError = rwA;
    class owA extends FU {}
    Tf7.InvalidSuccessFieldError = owA;
    class Nf7 extends FU {}
    Tf7.InvalidExpirationTimeFieldError = Nf7;
    class awA extends FU {}
    Tf7.InvalidTokenTypeFieldError = awA;
    class swA extends FU {}
    Tf7.InvalidCodeFieldError = swA;
    class twA extends FU {}
    Tf7.InvalidMessageFieldError = twA;
    class xz6 extends FU {}
    Tf7.InvalidSubjectTokenError = xz6
})
// @from(Ln 188154, Col 4)
Lf7 = R((Ef7) => {
    Object.defineProperty(Ef7, "__esModule", {
        value: !0
    });
    Ef7.PluggableAuthHandler = void 0;
    var B19 = bz6(),
        r41 = ewA(),
        m19 = h1("child_process"),
        AHA = h1("fs");
    class qHA {
        constructor(A) {
            if (!A.command) throw Error("No command provided.");
            if (this.commandComponents = qHA.parseCommand(A.command), this.timeoutMillis = A.timeoutMillis, !this.timeoutMillis) throw Error("No timeoutMillis provided.");
            this.outputFile = A.outputFile
        }
        retrieveResponseFromExecutable(A) {
            return new Promise((q, K) => {
                let Y = m19.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
                        env: {
                            ...process.env,
                            ...Object.fromEntries(A)
                        }
                    }),
                    z = "";
                Y.stdout.on("data", (H) => {
                    z += H
                }), Y.stderr.on("data", (H) => {
                    z += H
                });
                let w = setTimeout(() => {
                    return Y.removeAllListeners(), Y.kill(), K(Error("The executable failed to finish within the timeout specified."))
                }, this.timeoutMillis);
                Y.on("close", (H) => {
                    if (clearTimeout(w), H === 0) try {
                        let $ = JSON.parse(z),
                            O = new r41.ExecutableResponse($);
                        return q(O)
                    } catch ($) {
                        if ($ instanceof r41.ExecutableResponseError) return K($);
                        return K(new r41.ExecutableResponseError(`The executable returned an invalid response: ${z}`))
                    } else return K(new B19.ExecutableError(z, H.toString()))
                })
            })
        }
        async retrieveCachedResponse() {
            if (!this.outputFile || this.outputFile.length === 0) return;
            let A;
            try {
                A = await AHA.promises.realpath(this.outputFile)
            } catch (K) {
                return
            }
            if (!(await AHA.promises.lstat(A)).isFile()) return;
            let q = await AHA.promises.readFile(A, {
                encoding: "utf8"
            });
            if (q === "") return;
            try {
                let K = JSON.parse(q);
                if (new r41.ExecutableResponse(K).isValid()) return new r41.ExecutableResponse(K);
                return
            } catch (K) {
                if (K instanceof r41.ExecutableResponseError) throw K;
                throw new r41.ExecutableResponseError(`The output file contained an invalid response: ${q}`)
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
    Ef7.PluggableAuthHandler = qHA
})
// @from(Ln 188230, Col 4)
bz6 = R((hf7) => {
    Object.defineProperty(hf7, "__esModule", {
        value: !0
    });
    hf7.PluggableAuthClient = hf7.ExecutableError = void 0;
    var F19 = No(),
        Q19 = ewA(),
        g19 = Lf7();
    class KHA extends Error {
        constructor(A, q) {
            super(`The executable failed with exit code: ${q} and error message: ${A}.`);
            this.code = q, Object.setPrototypeOf(this, new.target.prototype)
        }
    }
    hf7.ExecutableError = KHA;
    var U19 = 30000,
        Rf7 = 5000,
        yf7 = 120000,
        p19 = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES",
        Cf7 = 1;
    class Sf7 extends F19.BaseExternalAccountClient {
        constructor(A, q) {
            super(A, q);
            if (!A.credential_source.executable) throw Error('No valid Pluggable Auth "credential_source" provided.');
            if (this.command = A.credential_source.executable.command, !this.command) throw Error('No valid Pluggable Auth "credential_source" provided.');
            if (A.credential_source.executable.timeout_millis === void 0) this.timeoutMillis = U19;
            else if (this.timeoutMillis = A.credential_source.executable.timeout_millis, this.timeoutMillis < Rf7 || this.timeoutMillis > yf7) throw Error(`Timeout must be between ${Rf7} and ${yf7} milliseconds.`);
            this.outputFile = A.credential_source.executable.output_file, this.handler = new g19.PluggableAuthHandler({
                command: this.command,
                timeoutMillis: this.timeoutMillis,
                outputFile: this.outputFile
            }), this.credentialSourceType = "executable"
        }
        async retrieveSubjectToken() {
            if (process.env[p19] !== "1") throw Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
            let A = void 0;
            if (this.outputFile) A = await this.handler.retrieveCachedResponse();
            if (!A) {
                let q = new Map;
                if (q.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience), q.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType), q.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0"), this.outputFile) q.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
                let K = this.getServiceAccountEmail();
                if (K) q.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", K);
                A = await this.handler.retrieveResponseFromExecutable(q)
            }
            if (A.version > Cf7) throw Error(`Version of executable is not currently supported, maximum supported version is ${Cf7}.`);
            if (!A.success) throw new KHA(A.errorMessage, A.errorCode);
            if (this.outputFile) {
                if (!A.expirationTime) throw new Q19.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.")
            }
            if (A.isExpired()) throw Error("Executable response is expired.");
            return A.subjectToken
        }
    }
    hf7.PluggableAuthClient = Sf7
})
// @from(Ln 188285, Col 4)
YHA = R((bf7) => {
    Object.defineProperty(bf7, "__esModule", {
        value: !0
    });
    bf7.ExternalAccountClient = void 0;
    var c19 = No(),
        l19 = UwA(),
        i19 = lwA(),
        n19 = bz6();
    class xf7 {
        constructor() {
            throw Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()")
        }
        static fromJSON(A, q) {
            var K, Y;
            if (A && A.type === c19.EXTERNAL_ACCOUNT_TYPE)
                if ((K = A.credential_source) === null || K === void 0 ? void 0 : K.environment_id) return new i19.AwsClient(A, q);
                else if ((Y = A.credential_source) === null || Y === void 0 ? void 0 : Y.executable) return new n19.PluggableAuthClient(A, q);
            else return new l19.IdentityPoolClient(A, q);
            else return null
        }
    }
    bf7.ExternalAccountClient = xf7
})
// @from(Ln 188309, Col 4)
gf7 = R((Ff7) => {
    Object.defineProperty(Ff7, "__esModule", {
        value: !0
    });
    Ff7.ExternalAccountAuthorizedUserClient = Ff7.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
    var r19 = lu(),
        Bf7 = ywA(),
        o19 = bS(),
        a19 = h1("stream"),
        s19 = No();
    Ff7.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
    var t19 = "https://sts.{universeDomain}/v1/oauthtoken";
    class zHA extends Bf7.OAuthClientAuthHandler {
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
                    ...zHA.RETRY_CONFIG,
                    url: this.url,
                    method: "POST",
                    headers: Y,
                    data: K.toString(),
                    responseType: "json"
                };
            this.applyClientAuthenticationOptions(z);
            try {
                let w = await this.transporter.request(z),
                    H = w.data;
                return H.res = w, H
            } catch (w) {
                if (w instanceof o19.GaxiosError && w.response) throw (0, Bf7.getErrorFromOAuthErrorResponse)(w.response.data, w);
                throw w
            }
        }
    }
    class mf7 extends r19.AuthClient {
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
            if (this.externalAccountAuthorizedUserHandler = new zHA((K = A.token_url) !== null && K !== void 0 ? K : t19.replace("{universeDomain}", this.universeDomain), this.transporter, Y), this.cachedAccessToken = null, this.quotaProjectId = A.quota_project_id, typeof(q === null || q === void 0 ? void 0 : q.eagerRefreshThresholdMillis) !== "number") this.eagerRefreshThresholdMillis = s19.EXPIRATION_TIME_OFFSET;
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
                    let w = z.status,
                        H = z.config.data instanceof a19.Readable;
                    if (!q && (w === 401 || w === 403) && !H && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
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
    Ff7.ExternalAccountAuthorizedUserClient = mf7
})
// @from(Ln 188425, Col 4)
if7 = R((RM) => {
    var To = RM && RM.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        Uf7 = RM && RM.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        vo, sX1, tX1, lf7;
    Object.defineProperty(RM, "__esModule", {
        value: !0
    });
    RM.GoogleAuth = RM.GoogleAuthExceptionMessages = RM.CLOUD_SDK_CLIENT_ID = void 0;
    var A69 = h1("child_process"),
        eI1 = h1("fs"),
        sI1 = UI1(),
        q69 = h1("os"),
        HHA = h1("path"),
        K69 = FX1(),
        Y69 = dI1(),
        z69 = OwA(),
        w69 = _wA(),
        H69 = JwA(),
        oX1 = kwA(),
        pf7 = LwA(),
        aX1 = RwA(),
        $69 = YHA(),
        tI1 = No(),
        wHA = lu(),
        df7 = gf7(),
        cf7 = fo();
    RM.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
    RM.GoogleAuthExceptionMessages = {
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
    class $HA {
        get isGCE() {
            return this.checkIsGCE
        }
        constructor(A = {}) {
            if (vo.add(this), this.checkIsGCE = void 0, this.jsonContent = null, this.cachedCredential = null, sX1.set(this, null), this.clientOptions = {}, this._cachedProjectId = A.projectId || null, this.cachedCredential = A.authClient || null, this.keyFilename = A.keyFilename || A.keyFile, this.scopes = A.scopes, this.clientOptions = A.clientOptions || {}, this.jsonContent = A.credentials || null, this.apiKey = A.apiKey || this.clientOptions.apiKey || null, this.apiKey && (this.jsonContent || this.clientOptions.credentials)) throw RangeError(RM.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
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
                if (A instanceof Error && A.message === RM.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) return null;
                else throw A
            }
        }
        async findAndCacheProjectId() {
            let A = null;
            if (A || (A = await this.getProductionProjectId()), A || (A = await this.getFileProjectId()), A || (A = await this.getDefaultServiceProjectId()), A || (A = await this.getGCEProjectId()), A || (A = await this.getExternalAccountClientProjectId()), A) return this._cachedProjectId = A, A;
            else throw Error(RM.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND)
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
                q = await sI1.universe("universe-domain"), q || (q = wHA.DEFAULT_UNIVERSE)
            } catch (K) {
                if (K && ((A = K === null || K === void 0 ? void 0 : K.response) === null || A === void 0 ? void 0 : A.status) === 404) q = wHA.DEFAULT_UNIVERSE;
                else throw K
            }
            return q
        }
        async getUniverseDomain() {
            let A = (0, cf7.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
            try {
                A !== null && A !== void 0 || (A = (await this.getClient()).universeDomain)
            } catch (q) {
                A !== null && A !== void 0 || (A = wHA.DEFAULT_UNIVERSE)
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
            if (this.cachedCredential) return await To(this, vo, "m", tX1).call(this, this.cachedCredential, null);
            let q;
            if (q = await this._tryGetApplicationCredentialsFromEnvironmentVariable(A), q) {
                if (q instanceof oX1.JWT) q.scopes = this.scopes;
                else if (q instanceof tI1.BaseExternalAccountClient) q.scopes = this.getAnyScopes();
                return await To(this, vo, "m", tX1).call(this, q)
            }
            if (q = await this._tryGetApplicationCredentialsFromWellKnownFile(A), q) {
                if (q instanceof oX1.JWT) q.scopes = this.scopes;
                else if (q instanceof tI1.BaseExternalAccountClient) q.scopes = this.getAnyScopes();
                return await To(this, vo, "m", tX1).call(this, q)
            }
            if (await this._checkIsGCE()) return A.scopes = this.getAnyScopes(), await To(this, vo, "m", tX1).call(this, new z69.Compute(A));
            throw Error(RM.GoogleAuthExceptionMessages.NO_ADC_FOUND)
        }
        async _checkIsGCE() {
            if (this.checkIsGCE === void 0) this.checkIsGCE = sI1.getGCPResidency() || await sI1.isAvailable();
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
                if (Y) q = HHA.join(Y, ".config")
            }
            if (q) {
                if (q = HHA.join(q, "gcloud", "application_default_credentials.json"), !eI1.existsSync(q)) q = null
            }
            if (!q) return null;
            return await this._getApplicationCredentialsFromFilePath(q, A)
        }
        async _getApplicationCredentialsFromFilePath(A, q = {}) {
            if (!A || A.length === 0) throw Error("The file path is invalid.");
            try {
                if (A = eI1.realpathSync(A), !eI1.lstatSync(A).isFile()) throw Error()
            } catch (Y) {
                if (Y instanceof Error) Y.message = `The file at ${A} does not exist, or it is not a file. ${Y.message}`;
                throw Y
            }
            let K = eI1.createReadStream(A);
            return this.fromStream(K, q)
        }
        fromImpersonatedJSON(A) {
            var q, K, Y, z;
            if (!A) throw Error("Must pass in a JSON object containing an  impersonated refresh token");
            if (A.type !== aX1.IMPERSONATED_ACCOUNT_TYPE) throw Error(`The incoming JSON object does not have the "${aX1.IMPERSONATED_ACCOUNT_TYPE}" type`);
            if (!A.source_credentials) throw Error("The incoming JSON object does not contain a source_credentials field");
            if (!A.service_account_impersonation_url) throw Error("The incoming JSON object does not contain a service_account_impersonation_url field");
            let w = this.fromJSON(A.source_credentials);
            if (((q = A.service_account_impersonation_url) === null || q === void 0 ? void 0 : q.length) > 256) throw RangeError(`Target principal is too long: ${A.service_account_impersonation_url}`);
            let H = (Y = (K = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(A.service_account_impersonation_url)) === null || K === void 0 ? void 0 : K.groups) === null || Y === void 0 ? void 0 : Y.target;
            if (!H) throw RangeError(`Cannot extract target principal from ${A.service_account_impersonation_url}`);
            let $ = (z = this.getAnyScopes()) !== null && z !== void 0 ? z : [];
            return new aX1.Impersonated({
                ...A,
                sourceClient: w,
                targetPrincipal: H,
                targetScopes: Array.isArray($) ? $ : [$]
            })
        }
        fromJSON(A, q = {}) {
            let K, Y = (0, cf7.originalOrCamelOptions)(q).get("universe_domain");
            if (A.type === pf7.USER_REFRESH_ACCOUNT_TYPE) K = new pf7.UserRefreshClient(q), K.fromJSON(A);
            else if (A.type === aX1.IMPERSONATED_ACCOUNT_TYPE) K = this.fromImpersonatedJSON(A);
            else if (A.type === tI1.EXTERNAL_ACCOUNT_TYPE) K = $69.ExternalAccountClient.fromJSON(A, q), K.scopes = this.getAnyScopes();
            else if (A.type === df7.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) K = new df7.ExternalAccountAuthorizedUserClient(A, q);
            else q.scopes = this.scopes, K = new oX1.JWT(q), this.setGapicJWTValues(K), K.fromJSON(A);
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
                A.setEncoding("utf8").on("error", Y).on("data", (w) => z.push(w)).on("end", () => {
                    try {
                        try {
                            let w = JSON.parse(z.join("")),
                                H = this._cacheClientFromJSON(w, q);
                            return K(H)
                        } catch (w) {
                            if (!this.keyFilename) throw w;
                            let H = new oX1.JWT({
                                ...this.clientOptions,
                                keyFile: this.keyFilename
                            });
                            return this.cachedCredential = H, this.setGapicJWTValues(H), K(H)
                        }
                    } catch (w) {
                        return Y(w)
                    }
                })
            })
        }
        fromAPIKey(A, q = {}) {
            return new oX1.JWT({
                ...q,
                apiKey: A
            })
        }
        _isWindows() {
            let A = q69.platform();
            if (A && A.length >= 3) {
                if (A.substring(0, 3).toLowerCase() === "win") return !0
            }
            return !1
        }
        async getDefaultServiceProjectId() {
            return new Promise((A) => {
                (0, A69.exec)("gcloud config config-helper --format json", (q, K) => {
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
            if (!this.jsonContent || this.jsonContent.type !== tI1.EXTERNAL_ACCOUNT_TYPE) return null;
            return await (await this.getClient()).getProjectId()
        }
        async getGCEProjectId() {
            try {
                return await sI1.project("project-id")
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
            if (A instanceof aX1.Impersonated) return {
                client_email: A.getTargetPrincipal()
            };
            if (A instanceof tI1.BaseExternalAccountClient) {
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
                let [q, K] = await Promise.all([sI1.instance("service-accounts/default/email"), this.getUniverseDomain()]);
                return {
                    client_email: q,
                    universe_domain: K
                }
            }
            throw Error(RM.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND)
        }
        async getClient() {
            if (this.cachedCredential) return this.cachedCredential;
            Uf7(this, sX1, To(this, sX1, "f") || To(this, vo, "m", lf7).call(this), "f");
            try {
                return await To(this, sX1, "f")
            } finally {
                Uf7(this, sX1, null, "f")
            }
        }
        async getIdTokenClient(A) {
            let q = await this.getClient();
            if (!("fetchIdToken" in q)) throw Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
            return new w69.IdTokenClient({
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
            return (0, H69.getEnv)()
        }
        async sign(A, q) {
            let K = await this.getClient(),
                Y = await this.getUniverseDomain();
            if (q = q || `https://iamcredentials.${Y}/v1/projects/-/serviceAccounts/`, K instanceof aX1.Impersonated) return (await K.sign(A)).signedBlob;
            let z = (0, K69.createCrypto)();
            if (K instanceof oX1.JWT && K.key) return await z.sign(K.key, A);
            let w = await this.getCredentials();
            if (!w.client_email) throw Error("Cannot sign data without `client_email`.");
            return this.signBlob(z, w.client_email, A, q)
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
    RM.GoogleAuth = $HA;
    sX1 = new WeakMap, vo = new WeakSet, tX1 = async function(q, K = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || null) {
        let Y = await this.getProjectIdOptional();
        if (K) q.quotaProjectId = K;
        return this.cachedCredential = q, {
            credential: q,
            projectId: Y
        }
    }, lf7 = async function() {
        if (this.jsonContent) return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
        else if (this.keyFilename) {
            let q = HHA.resolve(this.keyFilename),
                K = eI1.createReadStream(q);
            return await this.fromStreamAsync(K, this.clientOptions)
        } else if (this.apiKey) {
            let q = await this.fromAPIKey(this.apiKey, this.clientOptions);
            q.scopes = this.scopes;
            let {
                credential: K
            } = await To(this, vo, "m", tX1).call(this, q);
            return K
        } else {
            let {
                credential: q
            } = await this.getApplicationDefaultAsync(this.clientOptions);
            return q
        }
    };
    $HA.DefaultTransporter = Y69.DefaultTransporter
})
// @from(Ln 188823, Col 4)
af7 = R((rf7) => {
    Object.defineProperty(rf7, "__esModule", {
        value: !0
    });
    rf7.IAMAuth = void 0;
    class nf7 {
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
    rf7.IAMAuth = nf7
})
// @from(Ln 188841, Col 4)
AV7 = R((tf7) => {
    Object.defineProperty(tf7, "__esModule", {
        value: !0
    });
    tf7.DownscopedClient = tf7.EXPIRATION_TIME_OFFSET = tf7.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
    var O69 = h1("stream"),
        _69 = lu(),
        J69 = SwA(),
        X69 = "urn:ietf:params:oauth:grant-type:token-exchange",
        D69 = "urn:ietf:params:oauth:token-type:access_token",
        j69 = "urn:ietf:params:oauth:token-type:access_token";
    tf7.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
    tf7.EXPIRATION_TIME_OFFSET = 300000;
    class sf7 extends _69.AuthClient {
        constructor(A, q, K, Y) {
            super({
                ...K,
                quotaProjectId: Y
            });
            if (this.authClient = A, this.credentialAccessBoundary = q, q.accessBoundary.accessBoundaryRules.length === 0) throw Error("At least one access boundary rule needs to be defined.");
            else if (q.accessBoundary.accessBoundaryRules.length > tf7.MAX_ACCESS_BOUNDARY_RULES_COUNT) throw Error(`The provided access boundary has more than ${tf7.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
            for (let z of q.accessBoundary.accessBoundaryRules)
                if (z.availablePermissions.length === 0) throw Error("At least one permission should be defined in access boundary rules.");
            this.stsCredential = new J69.StsCredentials(`https://sts.${this.universeDomain}/v1/token`), this.cachedDownscopedAccessToken = null
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
                    let w = z.status,
                        H = z.config.data instanceof O69.Readable;
                    if (!q && (w === 401 || w === 403) && !H && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
                }
                throw Y
            }
            return K
        }
        async refreshAccessTokenAsync() {
            var A;
            let q = (await this.authClient.getAccessToken()).token,
                K = {
                    grantType: X69,
                    requestedTokenType: D69,
                    subjectToken: q,
                    subjectTokenType: j69
                },
                Y = await this.stsCredential.exchangeToken(K, void 0, this.credentialAccessBoundary),
                z = ((A = this.authClient.credentials) === null || A === void 0 ? void 0 : A.expiry_date) || null,
                w = Y.expires_in ? new Date().getTime() + Y.expires_in * 1000 : z;
            return this.cachedDownscopedAccessToken = {
                access_token: Y.access_token,
                expiry_date: w,
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
    tf7.DownscopedClient = sf7
})
// @from(Ln 188939, Col 4)
YV7 = R((qV7) => {
    Object.defineProperty(qV7, "__esModule", {
        value: !0
    });
    qV7.PassThroughClient = void 0;
    var P69 = lu();
    class _HA extends P69.AuthClient {
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
    qV7.PassThroughClient = _HA;
    var W69 = new _HA;
    W69.getAccessToken()
})
// @from(Ln 188960, Col 4)
XHA = R((Rw) => {
    Object.defineProperty(Rw, "__esModule", {
        value: !0
    });
    Rw.GoogleAuth = Rw.auth = Rw.DefaultTransporter = Rw.PassThroughClient = Rw.ExecutableError = Rw.PluggableAuthClient = Rw.DownscopedClient = Rw.BaseExternalAccountClient = Rw.ExternalAccountClient = Rw.IdentityPoolClient = Rw.AwsRequestSigner = Rw.AwsClient = Rw.UserRefreshClient = Rw.LoginTicket = Rw.ClientAuthentication = Rw.OAuth2Client = Rw.CodeChallengeMethod = Rw.Impersonated = Rw.JWT = Rw.JWTAccess = Rw.IdTokenClient = Rw.IAMAuth = Rw.GCPEnv = Rw.Compute = Rw.DEFAULT_UNIVERSE = Rw.AuthClient = Rw.gaxios = Rw.gcpMetadata = void 0;
    var zV7 = if7();
    Object.defineProperty(Rw, "GoogleAuth", {
        enumerable: !0,
        get: function() {
            return zV7.GoogleAuth
        }
    });
    Rw.gcpMetadata = UI1();
    Rw.gaxios = bS();
    var wV7 = lu();
    Object.defineProperty(Rw, "AuthClient", {
        enumerable: !0,
        get: function() {
            return wV7.AuthClient
        }
    });
    Object.defineProperty(Rw, "DEFAULT_UNIVERSE", {
        enumerable: !0,
        get: function() {
            return wV7.DEFAULT_UNIVERSE
        }
    });
    var G69 = OwA();
    Object.defineProperty(Rw, "Compute", {
        enumerable: !0,
        get: function() {
            return G69.Compute
        }
    });
    var Z69 = JwA();
    Object.defineProperty(Rw, "GCPEnv", {
        enumerable: !0,
        get: function() {
            return Z69.GCPEnv
        }
    });
    var f69 = af7();
    Object.defineProperty(Rw, "IAMAuth", {
        enumerable: !0,
        get: function() {
            return f69.IAMAuth
        }
    });
    var V69 = _wA();
    Object.defineProperty(Rw, "IdTokenClient", {
        enumerable: !0,
        get: function() {
            return V69.IdTokenClient
        }
    });
    var N69 = vwA();
    Object.defineProperty(Rw, "JWTAccess", {
        enumerable: !0,
        get: function() {
            return N69.JWTAccess
        }
    });
    var T69 = kwA();
    Object.defineProperty(Rw, "JWT", {
        enumerable: !0,
        get: function() {
            return T69.JWT
        }
    });
    var v69 = RwA();
    Object.defineProperty(Rw, "Impersonated", {
        enumerable: !0,
        get: function() {
            return v69.Impersonated
        }
    });
    var JHA = n41();
    Object.defineProperty(Rw, "CodeChallengeMethod", {
        enumerable: !0,
        get: function() {
            return JHA.CodeChallengeMethod
        }
    });
    Object.defineProperty(Rw, "OAuth2Client", {
        enumerable: !0,
        get: function() {
            return JHA.OAuth2Client
        }
    });
    Object.defineProperty(Rw, "ClientAuthentication", {
        enumerable: !0,
        get: function() {
            return JHA.ClientAuthentication
        }
    });
    var E69 = wwA();
    Object.defineProperty(Rw, "LoginTicket", {
        enumerable: !0,
        get: function() {
            return E69.LoginTicket
        }
    });
    var k69 = LwA();
    Object.defineProperty(Rw, "UserRefreshClient", {
        enumerable: !0,
        get: function() {
            return k69.UserRefreshClient
        }
    });
    var L69 = lwA();
    Object.defineProperty(Rw, "AwsClient", {
        enumerable: !0,
        get: function() {
            return L69.AwsClient
        }
    });
    var R69 = pwA();
    Object.defineProperty(Rw, "AwsRequestSigner", {
        enumerable: !0,
        get: function() {
            return R69.AwsRequestSigner
        }
    });
    var y69 = UwA();
    Object.defineProperty(Rw, "IdentityPoolClient", {
        enumerable: !0,
        get: function() {
            return y69.IdentityPoolClient
        }
    });
    var C69 = YHA();
    Object.defineProperty(Rw, "ExternalAccountClient", {
        enumerable: !0,
        get: function() {
            return C69.ExternalAccountClient
        }
    });
    var S69 = No();
    Object.defineProperty(Rw, "BaseExternalAccountClient", {
        enumerable: !0,
        get: function() {
            return S69.BaseExternalAccountClient
        }
    });
    var h69 = AV7();
    Object.defineProperty(Rw, "DownscopedClient", {
        enumerable: !0,
        get: function() {
            return h69.DownscopedClient
        }
    });
    var HV7 = bz6();
    Object.defineProperty(Rw, "PluggableAuthClient", {
        enumerable: !0,
        get: function() {
            return HV7.PluggableAuthClient
        }
    });
    Object.defineProperty(Rw, "ExecutableError", {
        enumerable: !0,
        get: function() {
            return HV7.ExecutableError
        }
    });
    var I69 = YV7();
    Object.defineProperty(Rw, "PassThroughClient", {
        enumerable: !0,
        get: function() {
            return I69.PassThroughClient
        }
    });
    var x69 = dI1();
    Object.defineProperty(Rw, "DefaultTransporter", {
        enumerable: !0,
        get: function() {
            return x69.DefaultTransporter
        }
    });
    var b69 = new zV7.GoogleAuth;
    Rw.auth = b69
})
// @from(Ln 189141, Col 4)
uz6 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 189146, Col 4)
$V7 = v(() => {
    _W()
})
// @from(Ln 189150, Col 0)
function Bz6(A) {
    return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 189153, Col 4)
DHA = (A) => (DHA = Array.isArray, DHA(A))
// @from(Ln 189154, Col 4)
jHA
// @from(Ln 189155, Col 4)
MHA = v(() => {
    $V7();
    jHA = DHA
})
// @from(Ln 189160, Col 0)
function* Q69(A) {
    if (!A) return;
    if (OV7 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let w of z) yield [w, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (jHA(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let w = jHA(Y[1]) ? Y[1] : [Y[1]],
            H = !1;
        for (let $ of w) {
            if ($ === void 0) continue;
            if (q && !H) H = !0, yield [z, null];
            yield [z, $]
        }
    }
}
// @from(Ln 189188, Col 4)
OV7
// @from(Ln 189188, Col 9)
_V7 = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [w, H] of Q69(Y)) {
            let $ = w.toLowerCase();
            if (!z.has($)) q.delete(w), z.add($);
            if (H === null) q.delete(w), K.add($);
            else q.append(w, H), K.delete($)
        }
    }
    return {
        [OV7]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 189206, Col 4)
JV7 = v(() => {
    MHA();
    OV7 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 189211, Col 0)
function p69(A) {
    let q = new aT(A);
    return delete q.batches, q
}
// @from(Ln 189216, Col 0)
function d69(A) {
    let q = new JW(A);
    return delete q.messages.batches, q
}
// @from(Ln 189220, Col 4)
XV7
// @from(Ln 189220, Col 9)
g69 = "vertex-2023-10-16"
// @from(Ln 189221, Col 4)
U69
// @from(Ln 189221, Col 9)
PHA
// @from(Ln 189222, Col 4)
WHA = v(() => {
    xg();
    yy1();
    MHA();
    JV7();
    xg();
    XV7 = o(XHA(), 1), U69 = new Set(["/v1/messages", "/v1/messages?beta=true"]);
    PHA = class PHA extends _z {
        constructor({
            baseURL: A = uz6("ANTHROPIC_VERTEX_BASE_URL"),
            region: q = uz6("CLOUD_ML_REGION") ?? null,
            projectId: K = uz6("ANTHROPIC_VERTEX_PROJECT_ID") ?? null,
            ...Y
        } = {}) {
            if (!q) throw Error("No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.");
            super({
                baseURL: A || (q === "global" ? "https://aiplatform.googleapis.com/v1" : `https://${q}-aiplatform.googleapis.com/v1`),
                ...Y
            });
            if (this.messages = p69(this), this.beta = d69(this), this.region = q, this.projectId = K, this.accessToken = Y.accessToken ?? null, Y.authClient && Y.googleAuth) throw Error("You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.");
            else if (Y.authClient) this._authClientPromise = Promise.resolve(Y.authClient);
            else this._auth = Y.googleAuth ?? new XV7.GoogleAuth({
                scopes: "https://www.googleapis.com/auth/cloud-platform"
            }), this._authClientPromise = this._auth.getClient()
        }
        validateHeaders() {}
        async prepareOptions(A) {
            let q = await this._authClientPromise,
                K = await q.getRequestHeaders(),
                Y = q.projectId ?? K["x-goog-user-project"];
            if (!this.projectId && Y) this.projectId = Y;
            A.headers = _V7([K, A.headers])
        }
        async buildRequest(A) {
            if (Bz6(A.body)) A.body = {
                ...A.body
            };
            if (Bz6(A.body)) {
                if (!A.body.anthropic_version) A.body.anthropic_version = g69
            }
            if (U69.has(A.path) && A.method === "post") {
                if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
                if (!Bz6(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
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
// @from(Ln 189278, Col 4)
DV7 = {}
// @from(Ln 189284, Col 4)
jV7 = v(() => {
    WHA();
    WHA()
})
// @from(Ln 189289, Col 0)
function mz6() {
    return {
        error: (A, ...q) => console.error("[Anthropic SDK ERROR]", A, ...q),
        warn: (A, ...q) => console.error("[Anthropic SDK WARN]", A, ...q),
        info: (A, ...q) => console.error("[Anthropic SDK INFO]", A, ...q),
        debug: (A, ...q) => console.error("[Anthropic SDK DEBUG]", A, ...q)
    }
}
// @from(Ln 189297, Col 0)
async function US({
    apiKey: A,
    maxRetries: q,
    model: K,
    fetchOverride: Y
}) {
    let z = process.env.CLAUDE_CODE_CONTAINER_ID,
        w = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
        H = l69(),
        $ = {
            "x-app": "cli",
            "User-Agent": Jr(),
            ...H,
            ...z ? {
                "x-claude-remote-container-id": z
            } : {},
            ...w ? {
                "x-claude-remote-session-id": w
            } : {}
        };
    if (h(`[API:request] Creating client, ANTHROPIC_CUSTOM_HEADERS present: ${!!process.env.ANTHROPIC_CUSTOM_HEADERS}, has Authorization header: ${!!H.Authorization}`), J6(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) $["x-anthropic-additional-protection"] = "true";
    if (h("[API:auth] OAuth token check starting"), await XM(), h("[API:auth] OAuth token check complete"), !i8()) c69($, w4());
    let _ = {
        defaultHeaders: $,
        maxRetries: q,
        timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
        dangerouslyAllowBrowser: !0,
        fetchOptions: $81(),
        ...Y && {
            fetch: Y
        }
    };
    if (J6(process.env.CLAUDE_CODE_USE_BEDROCK)) {
        let {
            AnthropicBedrock: X
        } = await Promise.resolve().then(() => (q27(), A27)), D = K === _J() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : j61(), j = {
            ..._,
            awsRegion: D,
            ...J6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && {
                skipAuth: !0
            },
            ...yx() && {
                logger: mz6()
            }
        };
        if (process.env.AWS_BEARER_TOKEN_BEDROCK) j.skipAuth = !0, j.defaultHeaders = {
            ...j.defaultHeaders,
            Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
        };
        else if (!J6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
            let M = await T81();
            if (M) j.awsAccessKey = M.accessKeyId, j.awsSecretKey = M.secretAccessKey, j.awsSessionToken = M.sessionToken
        }
        return new X(j)
    }
    if (J6(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
        let {
            AnthropicFoundry: X
        } = await Promise.resolve().then(() => (O27(), $27)), D;
        if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
            if (J6(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) D = () => Promise.resolve("");
            else {
                let {
                    DefaultAzureCredential: M,
                    getBearerTokenProvider: P
                } = await Promise.resolve().then(() => (Tj7(), Nj7));
                D = P(new M, "https://cognitiveservices.azure.com/.default")
            } let j = {
            ..._,
            ...D && {
                azureADTokenProvider: D
            },
            ...yx() && {
                logger: mz6()
            }
        };
        return new X(j)
    }
    if (J6(process.env.CLAUDE_CODE_USE_VERTEX)) {
        let [{
            AnthropicVertex: X
        }, {
            GoogleAuth: D
        }] = await Promise.all([Promise.resolve().then(() => (jV7(), DV7)), Promise.resolve().then(() => o(XHA(), 1))]), j = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project, M = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials, P = J6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH) ? {
            getClient: () => ({
                getRequestHeaders: () => ({})
            })
        } : new D({
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
            ...j || M ? {} : {
                projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID
            }
        }), W = {
            ..._,
            region: un1(K),
            googleAuth: P,
            ...yx() && {
                logger: mz6()
            }
        };
        return new X(W)
    }
    let J = {
        apiKey: i8() ? null : A || Mk(),
        authToken: i8() ? a4()?.accessToken : void 0,
        ...{},
        ..._,
        ...yx() && {
            logger: mz6()
        }
    };
    return new oC(J)
}
// @from(Ln 189411, Col 0)
function c69(A, q) {
    let K = process.env.ANTHROPIC_AUTH_TOKEN || JR1(q);
    if (K) A.Authorization = `Bearer ${K}`
}
// @from(Ln 189416, Col 0)
function l69() {
    let A = {},
        q = process.env.ANTHROPIC_CUSTOM_HEADERS;
    if (!q) return A;
    let K = q.split(/\n|\r\n/);
    for (let Y of K) {
        if (!Y.trim()) continue;
        let z = Y.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
        if (z) {
            let [, w, H] = z;
            if (w && H !== void 0) A[w] = H
        }
    }
    return A
}
// @from(Ln 189431, Col 4)
Ax1 = v(() => {
    GV();
    J7();
    B6();
    B0();
    hA();
    bb();
    Uz();
    Z6();
    e7()
})
// @from(Ln 189443, Col 0)
function GHA(A) {
    if (jH1()) return V$8(A);
    return A
}
// @from(Ln 189448, Col 0)
function eX1(A) {
    return A || jH1()
}
// @from(Ln 189452, Col 0)
function MV7(A) {
    return jH1() && A.status === 429
}
// @from(Ln 189455, Col 4)
qx1 = v(() => {
    gF6();
    GV();
    e7()
})
// @from(Ln 189461, Col 0)
function PV7(A) {
    return i69.some((q) => A.startsWith(q))
}
// @from(Ln 189465, Col 0)
function WV7(A, q) {
    if (A.isUsingOverage) {
        if (A.overageStatus === "allowed_warning") return {
            message: "You're close to your extra usage spending limit",
            severity: "warning"
        };
        return null
    }
    if (A.status === "rejected") return {
        message: n69(A, q),
        severity: "error"
    };
    if (A.status === "allowed_warning") {
        if (A.utilization !== void 0 && A.utilization < 0.7) return null;
        let Y = dK(),
            z = Y === "team" || Y === "enterprise",
            w = u3()?.hasExtraUsageEnabled === !0;
        if (z && w && !iu()) return null;
        let H = r69(A);
        if (H) return {
            message: H,
            severity: "warning"
        }
    }
    return null
}
// @from(Ln 189492, Col 0)
function ZHA(A, q) {
    let K = WV7(A, q);
    if (K && K.severity === "error") return K.message;
    return null
}
// @from(Ln 189498, Col 0)
function fHA(A, q) {
    let K = WV7(A, q);
    if (K && K.severity === "warning") return K.message;
    return null
}
// @from(Ln 189504, Col 0)
function n69(A, q) {
    let K = A.resetsAt,
        Y = K ? m_1(K, !0) : void 0,
        z = A.overageResetsAt ? m_1(A.overageResetsAt, !0) : void 0,
        w = Y ? ` · resets ${Y}` : "";
    if (A.overageStatus === "rejected") {
        let H = "";
        if (K && A.overageResetsAt)
            if (K < A.overageResetsAt) H = ` · resets ${Y}`;
            else H = ` · resets ${z}`;
        else if (Y) H = ` · resets ${Y}`;
        else if (z) H = ` · resets ${z}`;
        if (A.overageDisabledReason === "out_of_credits") return `You're out of extra usage${H}`;
        return AD1("limit", H, q)
    }
    if (A.rateLimitType === "seven_day_sonnet") {
        let H = dK();
        return AD1(H === "pro" || H === "enterprise" ? "weekly limit" : "Sonnet limit", w, q)
    }
    if (A.rateLimitType === "seven_day_opus") return AD1("Opus limit", w, q);
    if (A.rateLimitType === "seven_day") return AD1("weekly limit", w, q);
    if (A.rateLimitType === "five_hour") return AD1("session limit", w, q);
    return AD1("usage limit", w, q)
}
// @from(Ln 189529, Col 0)
function r69(A) {
    let q = null;
    switch (A.rateLimitType) {
        case "seven_day":
            q = "weekly limit";
            break;
        case "five_hour":
            q = "session limit";
            break;
        case "seven_day_opus":
            q = "Opus limit";
            break;
        case "seven_day_sonnet":
            q = "Sonnet limit";
            break;
        case "overage":
            q = "extra usage";
            break;
        case void 0:
            return null
    }
    let K = A.utilization ? Math.floor(A.utilization * 100) : void 0,
        Y = A.resetsAt ? m_1(A.resetsAt, !0) : void 0,
        z = o69(A.rateLimitType);
    if (K && Y) {
        let H = `You've used ${K}% of your ${q} · resets ${Y}`;
        return z ? `${H} · ${z}` : H
    }
    if (K) {
        let H = `You've used ${K}% of your ${q}`;
        return z ? `${H} · ${z}` : H
    }
    if (A.rateLimitType === "overage") q += " limit";
    if (Y) {
        let H = `Approaching ${q} · resets ${Y}`;
        return z ? `${H} · ${z}` : H
    }
    let w = `Approaching ${q}`;
    return z ? `${w} · ${z}` : w
}
// @from(Ln 189570, Col 0)
function o69(A) {
    let q = dK(),
        K = u3()?.hasExtraUsageEnabled === !0;
    if (A === "five_hour") {
        if (q === "team" || q === "enterprise") {
            if (!K && dC()) return "/extra-usage to request more";
            return null
        }
        if (q === "pro" || q === "max") return "/upgrade to keep using Claude Code"
    }
    if (A === "overage") {
        if (q === "team" || q === "enterprise") {
            if (!K && dC()) return "/extra-usage to request more"
        }
    }
    return null
}
// @from(Ln 189588, Col 0)
function VHA(A) {
    let q = A.resetsAt ? m_1(A.resetsAt, !0) : "",
        K = "";
    if (A.rateLimitType === "five_hour") K = "session limit";
    else if (A.rateLimitType === "seven_day") K = "weekly limit";
    else if (A.rateLimitType === "seven_day_opus") K = "Opus limit";
    else if (A.rateLimitType === "seven_day_sonnet") {
        let z = dK();
        K = z === "pro" || z === "enterprise" ? "weekly limit" : "Sonnet limit"
    }
    if (!K) return "Now using extra usage";
    return `You're now using extra usage${q?` · Your ${K} resets ${q}`:""}`
}
// @from(Ln 189602, Col 0)
function AD1(A, q, K) {
    return `You've hit your ${A}${q}`
}
// @from(Ln 189605, Col 4)
i69
// @from(Ln 189606, Col 4)
NHA = v(() => {
    vq();
    J7();
    cA();
    i69 = ["You've hit your", "You've used", "You're now using extra usage", "You're close to", "You're out of extra usage"]
})
// @from(Ln 189613, Col 0)
function t69(A, q) {
    let K = Date.now() / 1000,
        Y = A - q,
        z = K - Y;
    return Math.max(0, Math.min(1, z / q))
}
// @from(Ln 189620, Col 0)
function vHA(A) {
    Pv = A, THA.forEach((K) => K(A));
    let q = Math.round((A.resetsAt ? A.resetsAt - Date.now() / 1000 : 0) / 3600);
    c("tengu_claudeai_limits_status_changed", {
        status: A.status,
        unifiedRateLimitFallbackAvailable: A.unifiedRateLimitFallbackAvailable,
        hoursTillReset: q
    })
}
// @from(Ln 189629, Col 0)
async function e69() {
    let A = _J(),
        q = await US({
            maxRetries: 0,
            model: A
        }),
        K = [{
            role: "user",
            content: "quota"
        }],
        Y = vT(A);
    return q.beta.messages.create({
        model: A,
        max_tokens: 1,
        messages: K,
        metadata: ko(),
        ...Y.length > 0 ? {
            betas: Y
        } : {}
    }).asResponse()
}
// @from(Ln 189650, Col 0)
async function GV7() {
    if (!eX1(i8())) return;
    try {
        let A = await e69();
        EHA(A.headers)
    } catch (A) {
        if (A instanceof k4) Qz6(A)
    }
}
// @from(Ln 189660, Col 0)
function Eo() {
    let [A, q] = Fz6.useState({
        ...Pv
    });
    return Fz6.useEffect(() => {
        let K = (Y) => {
            q({
                ...Y
            })
        };
        return THA.add(K), () => {
            THA.delete(K)
        }
    }, []), A
}
// @from(Ln 189676, Col 0)
function AA9(A, q) {
    for (let [K, Y] of Object.entries(s69)) {
        let z = A.get(`anthropic-ratelimit-unified-${K}-surpassed-threshold`);
        if (z !== null) {
            let w = A.get(`anthropic-ratelimit-unified-${K}-utilization`),
                H = A.get(`anthropic-ratelimit-unified-${K}-reset`),
                $ = w ? Number(w) : void 0;
            return {
                status: "allowed_warning",
                resetsAt: H ? Number(H) : void 0,
                rateLimitType: Y,
                utilization: $,
                unifiedRateLimitFallbackAvailable: q,
                isUsingOverage: !1,
                surpassedThreshold: Number(z)
            }
        }
    }
    return null
}
// @from(Ln 189697, Col 0)
function qA9(A, q, K) {
    let {
        rateLimitType: Y,
        claimAbbrev: z,
        windowSeconds: w,
        thresholds: H
    } = q, $ = A.get(`anthropic-ratelimit-unified-${z}-utilization`), O = A.get(`anthropic-ratelimit-unified-${z}-reset`);
    if ($ === null || O === null) return null;
    let _ = Number($),
        J = Number(O),
        X = t69(J, w);
    if (!H.some((j) => _ >= j.utilization && X <= j.timePct)) return null;
    return {
        status: "allowed_warning",
        resetsAt: J,
        rateLimitType: Y,
        utilization: _,
        unifiedRateLimitFallbackAvailable: K,
        isUsingOverage: !1
    }
}
// @from(Ln 189719, Col 0)
function KA9(A, q) {
    let K = AA9(A, q);
    if (K) return K;
    for (let Y of a69) {
        let z = qA9(A, Y, q);
        if (z) return z
    }
    return null
}
// @from(Ln 189729, Col 0)
function ZV7(A) {
    let q = A.get("anthropic-ratelimit-unified-status") || "allowed",
        K = A.get("anthropic-ratelimit-unified-reset"),
        Y = K ? Number(K) : void 0,
        z = A.get("anthropic-ratelimit-unified-fallback") === "available",
        w = A.get("anthropic-ratelimit-unified-representative-claim"),
        H = A.get("anthropic-ratelimit-unified-overage-status"),
        $ = A.get("anthropic-ratelimit-unified-overage-reset"),
        O = $ ? Number($) : void 0,
        _ = A.get("anthropic-ratelimit-unified-overage-disabled-reason"),
        J = q === "rejected" && (H === "allowed" || H === "allowed_warning"),
        X = q;
    if (q === "allowed" || q === "allowed_warning") {
        let D = KA9(A, z);
        if (D) return D;
        X = "allowed"
    }
    return {
        status: X,
        resetsAt: Y,
        unifiedRateLimitFallbackAvailable: z,
        ...w && {
            rateLimitType: w
        },
        ...H && {
            overageStatus: H
        },
        ...O && {
            overageResetsAt: O
        },
        ..._ && {
            overageDisabledReason: _
        },
        isUsingOverage: J
    }
}
// @from(Ln 189766, Col 0)
function EHA(A) {
    let q = i8();
    if (!eX1(q)) {
        if (Pv.status !== "allowed" || Pv.resetsAt) vHA({
            status: "allowed",
            unifiedRateLimitFallbackAvailable: !1,
            isUsingOverage: !1
        });
        return
    }
    let K = GHA(A),
        Y = ZV7(K);
    if (!W61(Pv, Y)) vHA(Y)
}
// @from(Ln 189781, Col 0)
function Qz6(A) {
    if (!eX1(i8()) || A.status !== 429) return;
    try {
        let q = {
            ...Pv
        };
        if (A.headers) {
            let K = GHA(A.headers);
            q = ZV7(K)
        }
        if (q.status = "rejected", !W61(Pv, q)) vHA(q)
    } catch (q) {
        K1(q)
    }
}
// @from(Ln 189796, Col 4)
Fz6
// @from(Ln 189796, Col 9)
a69
// @from(Ln 189796, Col 14)
s69
// @from(Ln 189796, Col 19)
Pv
// @from(Ln 189796, Col 23)
THA
// @from(Ln 189797, Col 4)
nu = v(() => {
    Ax1();
    y6();
    e7();
    u6();
    J7();
    Wk();
    GV();
    yw();
    pR6();
    qx1();
    NHA();
    Fz6 = o(X1(), 1), a69 = [{
        rateLimitType: "five_hour",
        claimAbbrev: "5h",
        windowSeconds: 18000,
        thresholds: [{
            utilization: 0.9,
            timePct: 0.72
        }]
    }, {
        rateLimitType: "seven_day",
        claimAbbrev: "7d",
        windowSeconds: 604800,
        thresholds: [{
            utilization: 0.75,
            timePct: 0.6
        }, {
            utilization: 0.5,
            timePct: 0.35
        }, {
            utilization: 0.25,
            timePct: 0.15
        }]
    }], s69 = {
        "5h": "five_hour",
        "7d": "seven_day",
        overage: "overage"
    };
    Pv = {
        status: "allowed",
        unifiedRateLimitFallbackAvailable: !1,
        isUsingOverage: !1
    }, THA = new Set
})
// @from(Ln 189842, Col 4)
qD1 = 5242880
// @from(Ln 189843, Col 4)
pS = 3932160
// @from(Ln 189844, Col 4)
KD1 = 2000
// @from(Ln 189845, Col 4)
YD1 = 2000
// @from(Ln 189846, Col 4)
zD1 = 20971520
// @from(Ln 189847, Col 4)
fV7 = 100
// @from(Ln 189848, Col 4)
VV7 = 3145728
// @from(Ln 189849, Col 4)
kHA = 104857600
// @from(Ln 189850, Col 4)
wD1 = 20
// @from(Ln 189851, Col 4)
gz6 = 10
// @from(Ln 189852, Col 4)
o41 = () => {}
// @from(Ln 189854, Col 0)
function Kx1(A) {
    if (!A || typeof A !== "object") return null;
    let q = A,
        K = 5,
        Y = 0;
    while (q && Y < K) {
        if (q instanceof Error && "code" in q && typeof q.code === "string") {
            let z = q.code,
                w = YA9.has(z);
            return {
                code: z,
                message: q.message,
                isSSLError: w
            }
        }
        if (q instanceof Error && "cause" in q && q.cause !== q) q = q.cause, Y++;
        else break
    }
    return null
}
// @from(Ln 189875, Col 0)
function zA9(A) {
    let q = A.message;
    if (!q) return "";
    if (q.includes("<!DOCTYPE html") || q.includes("<html")) {
        let K = q.match(/<title>([^<]+)<\/title>/);
        if (K && K[1]) return K[1].trim();
        return ""
    }
    return A.message
}
// @from(Ln 189886, Col 0)
function Uz6(A) {
    let q = Kx1(A);
    if (q) {
        let {
            code: Y,
            isSSLError: z
        } = q;
        if (Y === "ETIMEDOUT") return "Request timed out. Check your internet connection and proxy settings";
        if (z) switch (Y) {
            case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
            case "UNABLE_TO_GET_ISSUER_CERT":
            case "UNABLE_TO_GET_ISSUER_CERT_LOCALLY":
                return "Unable to connect to API: SSL certificate verification failed. Check your proxy or corporate SSL certificates";
            case "CERT_HAS_EXPIRED":
                return "Unable to connect to API: SSL certificate has expired";
            case "CERT_REVOKED":
                return "Unable to connect to API: SSL certificate has been revoked";
            case "DEPTH_ZERO_SELF_SIGNED_CERT":
            case "SELF_SIGNED_CERT_IN_CHAIN":
                return "Unable to connect to API: Self-signed certificate detected. Check your proxy or corporate SSL certificates";
            case "ERR_TLS_CERT_ALTNAME_INVALID":
            case "HOSTNAME_MISMATCH":
                return "Unable to connect to API: SSL certificate hostname mismatch";
            case "CERT_NOT_YET_VALID":
                return "Unable to connect to API: SSL certificate is not yet valid";
            default:
                return `Unable to connect to API: SSL error (${Y})`
        }
    }
    if (A.message === "Connection error.") {
        if (q?.code) return `Unable to connect to API (${q.code})`;
        return "Unable to connect to API. Check your internet connection"
    }
    let K = zA9(A);
    return K !== A.message && K.length > 0 ? K : A.message
}
// @from(Ln 189922, Col 0)
async function dS(A, q) {
    await new Promise((K, Y) => {
        let z = setTimeout(K, A);
        if (q) {
            let w = () => {
                clearTimeout(z), Y(new Oz)
            };
            if (q.aborted) {
                w();
                return
            }
            q.addEventListener("abort", w, {
                once: !0
            }), setTimeout(() => {
                q?.removeEventListener("abort", w)
            }, A)
        }
    })
}
// @from(Ln 189941, Col 4)
YA9
// @from(Ln 189942, Col 4)
QU = v(() => {
    GV();
    YA9 = new Set(["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "CERT_SIGNATURE_FAILURE", "CERT_NOT_YET_VALID", "CERT_HAS_EXPIRED", "CERT_REVOKED", "CERT_REJECTED", "CERT_UNTRUSTED", "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN", "CERT_CHAIN_TOO_LONG", "PATH_LENGTH_EXCEEDED", "ERR_TLS_CERT_ALTNAME_INVALID", "HOSTNAME_MISMATCH", "ERR_TLS_HANDSHAKE_TIMEOUT", "ERR_SSL_WRONG_VERSION_NUMBER", "ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC"])
})
// @from(Ln 189946, Col 4)
TV7 = {}
// @from(Ln 189952, Col 0)
function NV7(A) {
    let q = null,
        K = [],
        Y = 0;
    async function z() {
        if (!q) q = (async () => {
            if (!pz6) throw Error("Native image processor module not available");
            let {
                processImage: $
            } = pz6;
            return $(A)
        })();
        return q
    }

    function w($) {
        for (let O = Y; O < K.length; O++) {
            let _ = K[O];
            if (_) _($)
        }
        Y = K.length
    }
    let H = {
        async metadata() {
            return (await z()).metadata()
        },
        resize($, O, _) {
            return K.push((J) => {
                J.resize($, O, _)
            }), H
        },
        jpeg($) {
            return K.push((O) => {
                O.jpeg($?.quality)
            }), H
        },
        png($) {
            return K.push((O) => {
                O.png($)
            }), H
        },
        webp($) {
            return K.push((O) => {
                O.webp($?.quality)
            }), H
        },
        async toBuffer() {
            let $ = await z();
            return w($), $.toBuffer()
        }
    };
    return H
}
// @from(Ln 190005, Col 4)
pz6
// @from(Ln 190005, Col 9)
wA9
// @from(Ln 190006, Col 4)
vV7 = v(() => {
    try {
        pz6 = (() => {
            throw new Error("Cannot require module " + "../../image-processor.node");
        })()
    } catch (A) {
        pz6 = null
    }
    wA9 = NV7
})
// @from(Ln 190016, Col 4)
ru = R((zn2, kV7) => {
    var EV7 = function(A) {
            return typeof A < "u" && A !== null
        },
        HA9 = function(A) {
            return typeof A === "object"
        },
        $A9 = function(A) {
            return Object.prototype.toString.call(A) === "[object Object]"
        },
        OA9 = function(A) {
            return typeof A === "function"
        },
        _A9 = function(A) {
            return typeof A === "boolean"
        },
        JA9 = function(A) {
            return A instanceof Buffer
        },
        XA9 = function(A) {
            if (EV7(A)) switch (A.constructor) {
                case Uint8Array:
                case Uint8ClampedArray:
                case Int8Array:
                case Uint16Array:
                case Int16Array:
                case Uint32Array:
                case Int32Array:
                case Float32Array:
                case Float64Array:
                    return !0
            }
            return !1
        },
        DA9 = function(A) {
            return A instanceof ArrayBuffer
        },
        jA9 = function(A) {
            return typeof A === "string" && A.length > 0
        },
        MA9 = function(A) {
            return typeof A === "number" && !Number.isNaN(A)
        },
        PA9 = function(A) {
            return Number.isInteger(A)
        },
        WA9 = function(A, q, K) {
            return A >= q && A <= K
        },
        GA9 = function(A, q) {
            return q.includes(A)
        },
        ZA9 = function(A, q, K) {
            return Error(`Expected ${q} for ${A} but received ${K} of type ${typeof K}`)
        },
        fA9 = function(A, q) {
            return q.message = A.message, q
        };
    kV7.exports = {
        defined: EV7,
        object: HA9,
        plainObject: $A9,
        fn: OA9,
        bool: _A9,
        buffer: JA9,
        typedArray: XA9,
        arrayBuffer: DA9,
        string: jA9,
        number: MA9,
        integer: PA9,
        inRange: WA9,
        inArray: GA9,
        invalidParameterError: ZA9,
        nativeError: fA9
    }
})
// @from(Ln 190092, Col 4)
yV7 = R((wn2, RV7) => {
    var LV7 = () => process.platform === "linux",
        dz6 = null,
        VA9 = () => {
            if (!dz6)
                if (LV7() && process.report) {
                    let A = process.report.excludeNetwork;
                    process.report.excludeNetwork = !0, dz6 = process.report.getReport(), process.report.excludeNetwork = A
                } else dz6 = {};
            return dz6
        };
    RV7.exports = {
        isLinux: LV7,
        getReport: VA9
    }
})
// @from(Ln 190108, Col 4)
hV7 = R((Hn2, SV7) => {
    var CV7 = h1("fs"),
        NA9 = (A) => CV7.readFileSync(A, "utf-8"),
        TA9 = (A) => new Promise((q, K) => {
            CV7.readFile(A, "utf-8", (Y, z) => {
                if (Y) K(Y);
                else q(z)
            })
        });
    SV7.exports = {
        LDD_PATH: "/usr/bin/ldd",
        readFileSync: NA9,
        readFile: TA9
    }
})
// @from(Ln 190123, Col 4)
lz6 = R(($n2, nV7) => {
    var xV7 = h1("child_process"),
        {
            isLinux: $D1,
            getReport: bV7
        } = yV7(),
        {
            LDD_PATH: cz6,
            readFile: uV7,
            readFileSync: BV7
        } = hV7(),
        ou, au, Lo = "",
        mV7 = () => {
            if (!Lo) return new Promise((A) => {
                xV7.exec("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", (q, K) => {
                    Lo = q ? " " : K, A(Lo)
                })
            });
            return Lo
        },
        FV7 = () => {
            if (!Lo) try {
                Lo = xV7.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", {
                    encoding: "utf8"
                })
            } catch (A) {
                Lo = " "
            }
            return Lo
        },
        Ro = "glibc",
        QV7 = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,
        HD1 = "musl",
        vA9 = (A) => A.includes("libc.musl-") || A.includes("ld-musl-"),
        gV7 = () => {
            let A = bV7();
            if (A.header && A.header.glibcVersionRuntime) return Ro;
            if (Array.isArray(A.sharedObjects)) {
                if (A.sharedObjects.some(vA9)) return HD1
            }
            return null
        },
        UV7 = (A) => {
            let [q, K] = A.split(/[\r\n]+/);
            if (q && q.includes(Ro)) return Ro;
            if (K && K.includes(HD1)) return HD1;
            return null
        },
        pV7 = (A) => {
            if (A.includes("musl")) return HD1;
            if (A.includes("GNU C Library")) return Ro;
            return null
        },
        EA9 = async () => {
            if (ou !== void 0) return ou;
            ou = null;
            try {
                let A = await uV7(cz6);
                ou = pV7(A)
            } catch (A) {}
            return ou
        }, kA9 = () => {
            if (ou !== void 0) return ou;
            ou = null;
            try {
                let A = BV7(cz6);
                ou = pV7(A)
            } catch (A) {}
            return ou
        }, dV7 = async () => {
            let A = null;
            if ($D1()) {
                if (A = await EA9(), !A) A = gV7();
                if (!A) {
                    let q = await mV7();
                    A = UV7(q)
                }
            }
            return A
        }, cV7 = () => {
            let A = null;
            if ($D1()) {
                if (A = kA9(), !A) A = gV7();
                if (!A) {
                    let q = FV7();
                    A = UV7(q)
                }
            }
            return A
        }, LA9 = async () => $D1() && await dV7() !== Ro, RA9 = () => $D1() && cV7() !== Ro, yA9 = async () => {
            if (au !== void 0) return au;
            au = null;
            try {
                let q = (await uV7(cz6)).match(QV7);
                if (q) au = q[1]
            } catch (A) {}
            return au
        }, CA9 = () => {
            if (au !== void 0) return au;
            au = null;
            try {
                let q = BV7(cz6).match(QV7);
                if (q) au = q[1]
            } catch (A) {}
            return au
        }, lV7 = () => {
            let A = bV7();
            if (A.header && A.header.glibcVersionRuntime) return A.header.glibcVersionRuntime;
            return null
        }, IV7 = (A) => A.trim().split(/\s+/)[1], iV7 = (A) => {
            let [q, K, Y] = A.split(/[\r\n]+/);
            if (q && q.includes(Ro)) return IV7(q);
            if (K && Y && K.includes(HD1)) return IV7(Y);
            return null
        }, SA9 = async () => {
            let A = null;
            if ($D1()) {
                if (A = await yA9(), !A) A = lV7();
                if (!A) {
                    let q = await mV7();
                    A = iV7(q)
                }
            }
            return A
        }, hA9 = () => {
            let A = null;
            if ($D1()) {
                if (A = CA9(), !A) A = lV7();
                if (!A) {
                    let q = FV7();
                    A = iV7(q)
                }
            }
            return A
        };
    nV7.exports = {
        GLIBC: Ro,
        MUSL: HD1,
        family: dV7,
        familySync: cV7,
        isNonGlibcLinux: LA9,
        isNonGlibcLinuxSync: RA9,
        version: SA9,
        versionSync: hA9
    }
})
// @from(Ln 190269, Col 4)
Yx1 = R((On2, rV7) => {
    var IA9 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
    rV7.exports = IA9
})
// @from(Ln 190273, Col 4)
iz6 = R((_n2, oV7) => {
    var xA9 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        bA9 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    oV7.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: xA9,
        RELEASE_TYPES: bA9,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 190287, Col 4)
zx1 = R((su, aV7) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: LHA,
        MAX_SAFE_BUILD_LENGTH: uA9,
        MAX_LENGTH: BA9
    } = iz6(), mA9 = Yx1();
    su = aV7.exports = {};
    var FA9 = su.re = [],
        QA9 = su.safeRe = [],
        B4 = su.src = [],
        gA9 = su.safeSrc = [],
        m4 = su.t = {},
        UA9 = 0,
        RHA = "[a-zA-Z0-9-]",
        pA9 = [
            ["\\s", 1],
            ["\\d", BA9],
            [RHA, uA9]
        ],
        dA9 = (A) => {
            for (let [q, K] of pA9) A = A.split(`${q}*`).join(`${q}{0,${K}}`).split(`${q}+`).join(`${q}{1,${K}}`);
            return A
        },
        Y5 = (A, q, K) => {
            let Y = dA9(q),
                z = UA9++;
            mA9(A, z, q), m4[A] = z, B4[z] = q, gA9[z] = Y, FA9[z] = new RegExp(q, K ? "g" : void 0), QA9[z] = new RegExp(Y, K ? "g" : void 0)
        };
    Y5("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    Y5("NUMERICIDENTIFIERLOOSE", "\\d+");
    Y5("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${RHA}*`);
    Y5("MAINVERSION", `(${B4[m4.NUMERICIDENTIFIER]})\\.(${B4[m4.NUMERICIDENTIFIER]})\\.(${B4[m4.NUMERICIDENTIFIER]})`);
    Y5("MAINVERSIONLOOSE", `(${B4[m4.NUMERICIDENTIFIERLOOSE]})\\.(${B4[m4.NUMERICIDENTIFIERLOOSE]})\\.(${B4[m4.NUMERICIDENTIFIERLOOSE]})`);
    Y5("PRERELEASEIDENTIFIER", `(?:${B4[m4.NUMERICIDENTIFIER]}|${B4[m4.NONNUMERICIDENTIFIER]})`);
    Y5("PRERELEASEIDENTIFIERLOOSE", `(?:${B4[m4.NUMERICIDENTIFIERLOOSE]}|${B4[m4.NONNUMERICIDENTIFIER]})`);
    Y5("PRERELEASE", `(?:-(${B4[m4.PRERELEASEIDENTIFIER]}(?:\\.${B4[m4.PRERELEASEIDENTIFIER]})*))`);
    Y5("PRERELEASELOOSE", `(?:-?(${B4[m4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${B4[m4.PRERELEASEIDENTIFIERLOOSE]})*))`);
    Y5("BUILDIDENTIFIER", `${RHA}+`);
    Y5("BUILD", `(?:\\+(${B4[m4.BUILDIDENTIFIER]}(?:\\.${B4[m4.BUILDIDENTIFIER]})*))`);
    Y5("FULLPLAIN", `v?${B4[m4.MAINVERSION]}${B4[m4.PRERELEASE]}?${B4[m4.BUILD]}?`);
    Y5("FULL", `^${B4[m4.FULLPLAIN]}$`);
    Y5("LOOSEPLAIN", `[v=\\s]*${B4[m4.MAINVERSIONLOOSE]}${B4[m4.PRERELEASELOOSE]}?${B4[m4.BUILD]}?`);
    Y5("LOOSE", `^${B4[m4.LOOSEPLAIN]}$`);
    Y5("GTLT", "((?:<|>)?=?)");
    Y5("XRANGEIDENTIFIERLOOSE", `${B4[m4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    Y5("XRANGEIDENTIFIER", `${B4[m4.NUMERICIDENTIFIER]}|x|X|\\*`);
    Y5("XRANGEPLAIN", `[v=\\s]*(${B4[m4.XRANGEIDENTIFIER]})(?:\\.(${B4[m4.XRANGEIDENTIFIER]})(?:\\.(${B4[m4.XRANGEIDENTIFIER]})(?:${B4[m4.PRERELEASE]})?${B4[m4.BUILD]}?)?)?`);
    Y5("XRANGEPLAINLOOSE", `[v=\\s]*(${B4[m4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${B4[m4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${B4[m4.XRANGEIDENTIFIERLOOSE]})(?:${B4[m4.PRERELEASELOOSE]})?${B4[m4.BUILD]}?)?)?`);
    Y5("XRANGE", `^${B4[m4.GTLT]}\\s*${B4[m4.XRANGEPLAIN]}$`);
    Y5("XRANGELOOSE", `^${B4[m4.GTLT]}\\s*${B4[m4.XRANGEPLAINLOOSE]}$`);
    Y5("COERCEPLAIN", `(^|[^\\d])(\\d{1,${LHA}})(?:\\.(\\d{1,${LHA}}))?(?:\\.(\\d{1,${LHA}}))?`);
    Y5("COERCE", `${B4[m4.COERCEPLAIN]}(?:$|[^\\d])`);
    Y5("COERCEFULL", B4[m4.COERCEPLAIN] + `(?:${B4[m4.PRERELEASE]})?(?:${B4[m4.BUILD]})?(?:$|[^\\d])`);
    Y5("COERCERTL", B4[m4.COERCE], !0);
    Y5("COERCERTLFULL", B4[m4.COERCEFULL], !0);
    Y5("LONETILDE", "(?:~>?)");
    Y5("TILDETRIM", `(\\s*)${B4[m4.LONETILDE]}\\s+`, !0);
    su.tildeTrimReplace = "$1~";
    Y5("TILDE", `^${B4[m4.LONETILDE]}${B4[m4.XRANGEPLAIN]}$`);
    Y5("TILDELOOSE", `^${B4[m4.LONETILDE]}${B4[m4.XRANGEPLAINLOOSE]}$`);
    Y5("LONECARET", "(?:\\^)");
    Y5("CARETTRIM", `(\\s*)${B4[m4.LONECARET]}\\s+`, !0);
    su.caretTrimReplace = "$1^";
    Y5("CARET", `^${B4[m4.LONECARET]}${B4[m4.XRANGEPLAIN]}$`);
    Y5("CARETLOOSE", `^${B4[m4.LONECARET]}${B4[m4.XRANGEPLAINLOOSE]}$`);
    Y5("COMPARATORLOOSE", `^${B4[m4.GTLT]}\\s*(${B4[m4.LOOSEPLAIN]})$|^$`);
    Y5("COMPARATOR", `^${B4[m4.GTLT]}\\s*(${B4[m4.FULLPLAIN]})$|^$`);
    Y5("COMPARATORTRIM", `(\\s*)${B4[m4.GTLT]}\\s*(${B4[m4.LOOSEPLAIN]}|${B4[m4.XRANGEPLAIN]})`, !0);
    su.comparatorTrimReplace = "$1$2$3";
    Y5("HYPHENRANGE", `^\\s*(${B4[m4.XRANGEPLAIN]})\\s+-\\s+(${B4[m4.XRANGEPLAIN]})\\s*$`);
    Y5("HYPHENRANGELOOSE", `^\\s*(${B4[m4.XRANGEPLAINLOOSE]})\\s+-\\s+(${B4[m4.XRANGEPLAINLOOSE]})\\s*$`);
    Y5("STAR", "(<|>)?=?\\s*\\*");
    Y5("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    Y5("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 190362, Col 4)
nz6 = R((Jn2, sV7) => {
    var cA9 = Object.freeze({
            loose: !0
        }),
        lA9 = Object.freeze({}),
        iA9 = (A) => {
            if (!A) return lA9;
            if (typeof A !== "object") return cA9;
            return A
        };
    sV7.exports = iA9
})
// @from(Ln 190374, Col 4)
qN7 = R((Xn2, AN7) => {
    var tV7 = /^[0-9]+$/,
        eV7 = (A, q) => {
            let K = tV7.test(A),
                Y = tV7.test(q);
            if (K && Y) A = +A, q = +q;
            return A === q ? 0 : K && !Y ? -1 : Y && !K ? 1 : A < q ? -1 : 1
        },
        nA9 = (A, q) => eV7(q, A);
    AN7.exports = {
        compareIdentifiers: eV7,
        rcompareIdentifiers: nA9
    }
})
// @from(Ln 190388, Col 4)
_D1 = R((Dn2, wN7) => {
    var rz6 = Yx1(),
        {
            MAX_LENGTH: KN7,
            MAX_SAFE_INTEGER: oz6
        } = iz6(),
        {
            safeRe: YN7,
            safeSrc: zN7,
            t: az6
        } = zx1(),
        rA9 = nz6(),
        {
            compareIdentifiers: OD1
        } = qN7();
    class cS {
        constructor(A, q) {
            if (q = rA9(q), A instanceof cS)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else A = A.version;
            else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
            if (A.length > KN7) throw TypeError(`version is longer than ${KN7} characters`);
            rz6("SemVer", A, q), this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease;
            let K = A.trim().match(q.loose ? YN7[az6.LOOSE] : YN7[az6.FULL]);
            if (!K) throw TypeError(`Invalid Version: ${A}`);
            if (this.raw = A, this.major = +K[1], this.minor = +K[2], this.patch = +K[3], this.major > oz6 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > oz6 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > oz6 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!K[4]) this.prerelease = [];
            else this.prerelease = K[4].split(".").map((Y) => {
                if (/^[0-9]+$/.test(Y)) {
                    let z = +Y;
                    if (z >= 0 && z < oz6) return z
                }
                return Y
            });
            this.build = K[5] ? K[5].split(".") : [], this.format()
        }
        format() {
            if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
            return this.version
        }
        toString() {
            return this.version
        }
        compare(A) {
            if (rz6("SemVer.compare", this.version, this.options, A), !(A instanceof cS)) {
                if (typeof A === "string" && A === this.version) return 0;
                A = new cS(A, this.options)
            }
            if (A.version === this.version) return 0;
            return this.compareMain(A) || this.comparePre(A)
        }
        compareMain(A) {
            if (!(A instanceof cS)) A = new cS(A, this.options);
            return OD1(this.major, A.major) || OD1(this.minor, A.minor) || OD1(this.patch, A.patch)
        }
        comparePre(A) {
            if (!(A instanceof cS)) A = new cS(A, this.options);
            if (this.prerelease.length && !A.prerelease.length) return -1;
            else if (!this.prerelease.length && A.prerelease.length) return 1;
            else if (!this.prerelease.length && !A.prerelease.length) return 0;
            let q = 0;
            do {
                let K = this.prerelease[q],
                    Y = A.prerelease[q];
                if (rz6("prerelease compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return OD1(K, Y)
            } while (++q)
        }
        compareBuild(A) {
            if (!(A instanceof cS)) A = new cS(A, this.options);
            let q = 0;
            do {
                let K = this.build[q],
                    Y = A.build[q];
                if (rz6("build compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return OD1(K, Y)
            } while (++q)
        }
        inc(A, q, K) {
            if (A.startsWith("pre")) {
                if (!q && K === !1) throw Error("invalid increment argument: identifier is empty");
                if (q) {
                    let Y = new RegExp(`^${this.options.loose?zN7[az6.PRERELEASELOOSE]:zN7[az6.PRERELEASE]}$`),
                        z = `-${q}`.match(Y);
                    if (!z || z[1] !== q) throw Error(`invalid identifier: ${q}`)
                }
            }
            switch (A) {
                case "premajor":
                    this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", q, K);
                    break;
                case "preminor":
                    this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", q, K);
                    break;
                case "prepatch":
                    this.prerelease.length = 0, this.inc("patch", q, K), this.inc("pre", q, K);
                    break;
                case "prerelease":
                    if (this.prerelease.length === 0) this.inc("patch", q, K);
                    this.inc("pre", q, K);
                    break;
                case "release":
                    if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
                    this.prerelease.length = 0;
                    break;
                case "major":
                    if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
                    this.minor = 0, this.patch = 0, this.prerelease = [];
                    break;
                case "minor":
                    if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
                    this.patch = 0, this.prerelease = [];
                    break;
                case "patch":
                    if (this.prerelease.length === 0) this.patch++;
                    this.prerelease = [];
                    break;
                case "pre": {
                    let Y = Number(K) ? 1 : 0;
                    if (this.prerelease.length === 0) this.prerelease = [Y];
                    else {
                        let z = this.prerelease.length;
                        while (--z >= 0)
                            if (typeof this.prerelease[z] === "number") this.prerelease[z]++, z = -2;
                        if (z === -1) {
                            if (q === this.prerelease.join(".") && K === !1) throw Error("invalid increment argument: identifier already exists");
                            this.prerelease.push(Y)
                        }
                    }
                    if (q) {
                        let z = [q, Y];
                        if (K === !1) z = [q];
                        if (OD1(this.prerelease[0], q) === 0) {
                            if (isNaN(this.prerelease[1])) this.prerelease = z
                        } else this.prerelease = z
                    }
                    break
                }
                default:
                    throw Error(`invalid increment argument: ${A}`)
            }
            if (this.raw = this.format(), this.build.length) this.raw += `+${this.build.join(".")}`;
            return this
        }
    }
    wN7.exports = cS
})
// @from(Ln 190543, Col 4)
ON7 = R((jn2, $N7) => {
    var HN7 = _D1(),
        oA9 = (A, q, K = !1) => {
            if (A instanceof HN7) return A;
            try {
                return new HN7(A, q)
            } catch (Y) {
                if (!K) return null;
                throw Y
            }
        };
    $N7.exports = oA9
})
// @from(Ln 190556, Col 4)
JN7 = R((Mn2, _N7) => {
    var aA9 = _D1(),
        sA9 = ON7(),
        {
            safeRe: sz6,
            t: tz6
        } = zx1(),
        tA9 = (A, q) => {
            if (A instanceof aA9) return A;
            if (typeof A === "number") A = String(A);
            if (typeof A !== "string") return null;
            q = q || {};
            let K = null;
            if (!q.rtl) K = A.match(q.includePrerelease ? sz6[tz6.COERCEFULL] : sz6[tz6.COERCE]);
            else {
                let O = q.includePrerelease ? sz6[tz6.COERCERTLFULL] : sz6[tz6.COERCERTL],
                    _;
                while ((_ = O.exec(A)) && (!K || K.index + K[0].length !== A.length)) {
                    if (!K || _.index + _[0].length !== K.index + K[0].length) K = _;
                    O.lastIndex = _.index + _[1].length + _[2].length
                }
                O.lastIndex = -1
            }
            if (K === null) return null;
            let Y = K[2],
                z = K[3] || "0",
                w = K[4] || "0",
                H = q.includePrerelease && K[5] ? `-${K[5]}` : "",
                $ = q.includePrerelease && K[6] ? `+${K[6]}` : "";
            return sA9(`${Y}.${z}.${w}${H}${$}`, q)
        };
    _N7.exports = tA9
})
// @from(Ln 190589, Col 4)
a41 = R((Pn2, DN7) => {
    var XN7 = _D1(),
        eA9 = (A, q, K) => new XN7(A, K).compare(new XN7(q, K));
    DN7.exports = eA9
})
// @from(Ln 190594, Col 4)
yHA = R((Wn2, jN7) => {
    var A89 = a41(),
        q89 = (A, q, K) => A89(A, q, K) >= 0;
    jN7.exports = q89
})
// @from(Ln 190599, Col 4)
WN7 = R((Gn2, PN7) => {
    class MN7 {
        constructor() {
            this.max = 1000, this.map = new Map
        }
        get(A) {
            let q = this.map.get(A);
            if (q === void 0) return;
            else return this.map.delete(A), this.map.set(A, q), q
        }
        delete(A) {
            return this.map.delete(A)
        }
        set(A, q) {
            if (!this.delete(A) && q !== void 0) {
                if (this.map.size >= this.max) {
                    let Y = this.map.keys().next().value;
                    this.delete(Y)
                }
                this.map.set(A, q)
            }
            return this
        }
    }
    PN7.exports = MN7
})
// @from(Ln 190625, Col 4)
ZN7 = R((Zn2, GN7) => {
    var K89 = a41(),
        Y89 = (A, q, K) => K89(A, q, K) === 0;
    GN7.exports = Y89
})
// @from(Ln 190630, Col 4)
VN7 = R((fn2, fN7) => {
    var z89 = a41(),
        w89 = (A, q, K) => z89(A, q, K) !== 0;
    fN7.exports = w89
})
// @from(Ln 190635, Col 4)
TN7 = R((Vn2, NN7) => {
    var H89 = a41(),
        $89 = (A, q, K) => H89(A, q, K) > 0;
    NN7.exports = $89
})
// @from(Ln 190640, Col 4)
EN7 = R((Nn2, vN7) => {
    var O89 = a41(),
        _89 = (A, q, K) => O89(A, q, K) < 0;
    vN7.exports = _89
})
// @from(Ln 190645, Col 4)
LN7 = R((Tn2, kN7) => {
    var J89 = a41(),
        X89 = (A, q, K) => J89(A, q, K) <= 0;
    kN7.exports = X89
})
// @from(Ln 190650, Col 4)
yN7 = R((vn2, RN7) => {
    var D89 = ZN7(),
        j89 = VN7(),
        M89 = TN7(),
        P89 = yHA(),
        W89 = EN7(),
        G89 = LN7(),
        Z89 = (A, q, K, Y) => {
            switch (q) {
                case "===":
                    if (typeof A === "object") A = A.version;
                    if (typeof K === "object") K = K.version;
                    return A === K;
                case "!==":
                    if (typeof A === "object") A = A.version;
                    if (typeof K === "object") K = K.version;
                    return A !== K;
                case "":
                case "=":
                case "==":
                    return D89(A, K, Y);
                case "!=":
                    return j89(A, K, Y);
                case ">":
                    return M89(A, K, Y);
                case ">=":
                    return P89(A, K, Y);
                case "<":
                    return W89(A, K, Y);
                case "<=":
                    return G89(A, K, Y);
                default:
                    throw TypeError(`Invalid operator: ${q}`)
            }
        };
    RN7.exports = Z89
})