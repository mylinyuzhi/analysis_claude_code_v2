
// @from(Ln 154335, Col 4)
zgq = p((Kgq) => {
    Object.defineProperty(Kgq, "__esModule", {
        value: !0
    });
    Kgq.ExternalAccountAuthorizedUserClient = Kgq.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
    var IA_ = oQ(),
        eFq = Eh1(),
        xA_ = hB(),
        uA_ = d6("stream"),
        mA_ = aq6();
    Kgq.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
    var BA_ = "https://sts.{universeDomain}/v1/oauthtoken";
    class KR1 extends eFq.OAuthClientAuthHandler {
        constructor(q, K, _) {
            super(_);
            this.url = q, this.transporter = K
        }
        async refreshToken(q, K) {
            let _ = new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: q
                }),
                z = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    ...K
                },
                Y = {
                    ...KR1.RETRY_CONFIG,
                    url: this.url,
                    method: "POST",
                    headers: z,
                    data: _.toString(),
                    responseType: "json"
                };
            this.applyClientAuthenticationOptions(Y);
            try {
                let A = await this.transporter.request(Y),
                    O = A.data;
                return O.res = A, O
            } catch (A) {
                if (A instanceof xA_.GaxiosError && A.response) throw (0, eFq.getErrorFromOAuthErrorResponse)(A.response.data, A);
                throw A
            }
        }
    }
    class qgq extends IA_.AuthClient {
        constructor(q, K) {
            var _;
            super({
                ...q,
                ...K
            });
            if (q.universe_domain) this.universeDomain = q.universe_domain;
            this.refreshToken = q.refresh_token;
            let z = {
                confidentialClientType: "basic",
                clientId: q.client_id,
                clientSecret: q.client_secret
            };
            if (this.externalAccountAuthorizedUserHandler = new KR1((_ = q.token_url) !== null && _ !== void 0 ? _ : BA_.replace("{universeDomain}", this.universeDomain), this.transporter, z), this.cachedAccessToken = null, this.quotaProjectId = q.quota_project_id, typeof(K === null || K === void 0 ? void 0 : K.eagerRefreshThresholdMillis) !== "number") this.eagerRefreshThresholdMillis = mA_.EXPIRATION_TIME_OFFSET;
            else this.eagerRefreshThresholdMillis = K.eagerRefreshThresholdMillis;
            this.forceRefreshOnFailure = !!(K === null || K === void 0 ? void 0 : K.forceRefreshOnFailure)
        }
        async getAccessToken() {
            if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) await this.refreshAccessTokenAsync();
            return {
                token: this.cachedAccessToken.access_token,
                res: this.cachedAccessToken.res
            }
        }
        async getRequestHeaders() {
            let K = {
                Authorization: `Bearer ${(await this.getAccessToken()).token}`
            };
            return this.addSharedMetadataHeaders(K)
        }
        request(q, K) {
            if (K) this.requestAsync(q).then((_) => K(null, _), (_) => {
                return K(_, _.response)
            });
            else return this.requestAsync(q)
        }
        async requestAsync(q, K = !1) {
            let _;
            try {
                let z = await this.getRequestHeaders();
                if (q.headers = q.headers || {}, z && z["x-goog-user-project"]) q.headers["x-goog-user-project"] = z["x-goog-user-project"];
                if (z && z.Authorization) q.headers.Authorization = z.Authorization;
                _ = await this.transporter.request(q)
            } catch (z) {
                let Y = z.response;
                if (Y) {
                    let A = Y.status,
                        O = Y.config.data instanceof uA_.Readable;
                    if (!K && (A === 401 || A === 403) && !O && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(q, !0)
                }
                throw z
            }
            return _
        }
        async refreshAccessTokenAsync() {
            let q = await this.externalAccountAuthorizedUserHandler.refreshToken(this.refreshToken);
            if (this.cachedAccessToken = {
                    access_token: q.access_token,
                    expiry_date: new Date().getTime() + q.expires_in * 1000,
                    res: q.res
                }, q.refresh_token !== void 0) this.refreshToken = q.refresh_token;
            return this.cachedAccessToken
        }
        isExpired(q) {
            let K = new Date().getTime();
            return q.expiry_date ? K >= q.expiry_date - this.eagerRefreshThresholdMillis : !1
        }
    }
    Kgq.ExternalAccountAuthorizedUserClient = qgq
})
// @from(Ln 154451, Col 4)
jgq = p((Df) => {
    var sq6 = Df && Df.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        Ygq = Df && Df.__classPrivateFieldSet || function(q, K, _, z, Y) {
            if (z === "m") throw TypeError("Private method is not writable");
            if (z === "a" && !Y) throw TypeError("Private accessor was defined without a setter");
            if (typeof K === "function" ? q !== K || !Y : !K.has(q)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return z === "a" ? Y.call(q, _) : Y ? Y.value = _ : K.set(q, _), _
        },
        tq6, jk6, Hk6, $gq;
    Object.defineProperty(Df, "__esModule", {
        value: !0
    });
    Df.GoogleAuth = Df.GoogleAuthExceptionMessages = Df.CLOUD_SDK_CLIENT_ID = void 0;
    var FA_ = d6("child_process"),
        Mo6 = d6("fs"),
        Jo6 = zo6(),
        gA_ = d6("os"),
        zR1 = d6("path"),
        UA_ = eV6(),
        QA_ = Ao6(),
        dA_ = Mh1(),
        cA_ = Ph1(),
        lA_ = Wh1(),
        wk6 = Vh1(),
        Agq = kh1(),
        $k6 = Nh1(),
        nA_ = qR1(),
        Xo6 = aq6(),
        _R1 = oQ(),
        Ogq = zgq(),
        wgq = rq6();
    Df.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
    Df.GoogleAuthExceptionMessages = {
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
    class YR1 {
        get isGCE() {
            return this.checkIsGCE
        }
        constructor(q = {}) {
            if (tq6.add(this), this.checkIsGCE = void 0, this.jsonContent = null, this.cachedCredential = null, jk6.set(this, null), this.clientOptions = {}, this._cachedProjectId = q.projectId || null, this.cachedCredential = q.authClient || null, this.keyFilename = q.keyFilename || q.keyFile, this.scopes = q.scopes, this.clientOptions = q.clientOptions || {}, this.jsonContent = q.credentials || null, this.apiKey = q.apiKey || this.clientOptions.apiKey || null, this.apiKey && (this.jsonContent || this.clientOptions.credentials)) throw RangeError(Df.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
            if (q.universeDomain) this.clientOptions.universeDomain = q.universeDomain
        }
        setGapicJWTValues(q) {
            q.defaultServicePath = this.defaultServicePath, q.useJWTAccessWithScope = this.useJWTAccessWithScope, q.defaultScopes = this.defaultScopes
        }
        getProjectId(q) {
            if (q) this.getProjectIdAsync().then((K) => q(null, K), q);
            else return this.getProjectIdAsync()
        }
        async getProjectIdOptional() {
            try {
                return await this.getProjectId()
            } catch (q) {
                if (q instanceof Error && q.message === Df.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) return null;
                else throw q
            }
        }
        async findAndCacheProjectId() {
            let q = null;
            if (q || (q = await this.getProductionProjectId()), q || (q = await this.getFileProjectId()), q || (q = await this.getDefaultServiceProjectId()), q || (q = await this.getGCEProjectId()), q || (q = await this.getExternalAccountClientProjectId()), q) return this._cachedProjectId = q, q;
            else throw Error(Df.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND)
        }
        async getProjectIdAsync() {
            if (this._cachedProjectId) return this._cachedProjectId;
            if (!this._findProjectIdPromise) this._findProjectIdPromise = this.findAndCacheProjectId();
            return this._findProjectIdPromise
        }
        async getUniverseDomainFromMetadataServer() {
            var q;
            let K;
            try {
                K = await Jo6.universe("universe-domain"), K || (K = _R1.DEFAULT_UNIVERSE)
            } catch (_) {
                if (_ && ((q = _ === null || _ === void 0 ? void 0 : _.response) === null || q === void 0 ? void 0 : q.status) === 404) K = _R1.DEFAULT_UNIVERSE;
                else throw _
            }
            return K
        }
        async getUniverseDomain() {
            let q = (0, wgq.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
            try {
                q !== null && q !== void 0 || (q = (await this.getClient()).universeDomain)
            } catch (K) {
                q !== null && q !== void 0 || (q = _R1.DEFAULT_UNIVERSE)
            }
            return q
        }
        getAnyScopes() {
            return this.scopes || this.defaultScopes
        }
        getApplicationDefault(q = {}, K) {
            let _;
            if (typeof q === "function") K = q;
            else _ = q;
            if (K) this.getApplicationDefaultAsync(_).then((z) => K(null, z.credential, z.projectId), K);
            else return this.getApplicationDefaultAsync(_)
        }
        async getApplicationDefaultAsync(q = {}) {
            if (this.cachedCredential) return await sq6(this, tq6, "m", Hk6).call(this, this.cachedCredential, null);
            let K;
            if (K = await this._tryGetApplicationCredentialsFromEnvironmentVariable(q), K) {
                if (K instanceof wk6.JWT) K.scopes = this.scopes;
                else if (K instanceof Xo6.BaseExternalAccountClient) K.scopes = this.getAnyScopes();
                return await sq6(this, tq6, "m", Hk6).call(this, K)
            }
            if (K = await this._tryGetApplicationCredentialsFromWellKnownFile(q), K) {
                if (K instanceof wk6.JWT) K.scopes = this.scopes;
                else if (K instanceof Xo6.BaseExternalAccountClient) K.scopes = this.getAnyScopes();
                return await sq6(this, tq6, "m", Hk6).call(this, K)
            }
            if (await this._checkIsGCE()) return q.scopes = this.getAnyScopes(), await sq6(this, tq6, "m", Hk6).call(this, new dA_.Compute(q));
            throw Error(Df.GoogleAuthExceptionMessages.NO_ADC_FOUND)
        }
        async _checkIsGCE() {
            if (this.checkIsGCE === void 0) this.checkIsGCE = Jo6.getGCPResidency() || await Jo6.isAvailable();
            return this.checkIsGCE
        }
        async _tryGetApplicationCredentialsFromEnvironmentVariable(q) {
            let K = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials;
            if (!K || K.length === 0) return null;
            try {
                return this._getApplicationCredentialsFromFilePath(K, q)
            } catch (_) {
                if (_ instanceof Error) _.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${_.message}`;
                throw _
            }
        }
        async _tryGetApplicationCredentialsFromWellKnownFile(q) {
            let K = null;
            if (this._isWindows()) K = process.env.APPDATA;
            else {
                let z = process.env.HOME;
                if (z) K = zR1.join(z, ".config")
            }
            if (K) {
                if (K = zR1.join(K, "gcloud", "application_default_credentials.json"), !Mo6.existsSync(K)) K = null
            }
            if (!K) return null;
            return await this._getApplicationCredentialsFromFilePath(K, q)
        }
        async _getApplicationCredentialsFromFilePath(q, K = {}) {
            if (!q || q.length === 0) throw Error("The file path is invalid.");
            try {
                if (q = Mo6.realpathSync(q), !Mo6.lstatSync(q).isFile()) throw Error()
            } catch (z) {
                if (z instanceof Error) z.message = `The file at ${q} does not exist, or it is not a file. ${z.message}`;
                throw z
            }
            let _ = Mo6.createReadStream(q);
            return this.fromStream(_, K)
        }
        fromImpersonatedJSON(q) {
            var K, _, z, Y;
            if (!q) throw Error("Must pass in a JSON object containing an  impersonated refresh token");
            if (q.type !== $k6.IMPERSONATED_ACCOUNT_TYPE) throw Error(`The incoming JSON object does not have the "${$k6.IMPERSONATED_ACCOUNT_TYPE}" type`);
            if (!q.source_credentials) throw Error("The incoming JSON object does not contain a source_credentials field");
            if (!q.service_account_impersonation_url) throw Error("The incoming JSON object does not contain a service_account_impersonation_url field");
            let A = this.fromJSON(q.source_credentials);
            if (((K = q.service_account_impersonation_url) === null || K === void 0 ? void 0 : K.length) > 256) throw RangeError(`Target principal is too long: ${q.service_account_impersonation_url}`);
            let O = (z = (_ = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(q.service_account_impersonation_url)) === null || _ === void 0 ? void 0 : _.groups) === null || z === void 0 ? void 0 : z.target;
            if (!O) throw RangeError(`Cannot extract target principal from ${q.service_account_impersonation_url}`);
            let w = (Y = this.getAnyScopes()) !== null && Y !== void 0 ? Y : [];
            return new $k6.Impersonated({
                ...q,
                sourceClient: A,
                targetPrincipal: O,
                targetScopes: Array.isArray(w) ? w : [w]
            })
        }
        fromJSON(q, K = {}) {
            let _, z = (0, wgq.originalOrCamelOptions)(K).get("universe_domain");
            if (q.type === Agq.USER_REFRESH_ACCOUNT_TYPE) _ = new Agq.UserRefreshClient(K), _.fromJSON(q);
            else if (q.type === $k6.IMPERSONATED_ACCOUNT_TYPE) _ = this.fromImpersonatedJSON(q);
            else if (q.type === Xo6.EXTERNAL_ACCOUNT_TYPE) _ = nA_.ExternalAccountClient.fromJSON(q, K), _.scopes = this.getAnyScopes();
            else if (q.type === Ogq.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) _ = new Ogq.ExternalAccountAuthorizedUserClient(q, K);
            else K.scopes = this.scopes, _ = new wk6.JWT(K), this.setGapicJWTValues(_), _.fromJSON(q);
            if (z) _.universeDomain = z;
            return _
        }
        _cacheClientFromJSON(q, K) {
            let _ = this.fromJSON(q, K);
            return this.jsonContent = q, this.cachedCredential = _, _
        }
        fromStream(q, K = {}, _) {
            let z = {};
            if (typeof K === "function") _ = K;
            else z = K;
            if (_) this.fromStreamAsync(q, z).then((Y) => _(null, Y), _);
            else return this.fromStreamAsync(q, z)
        }
        fromStreamAsync(q, K) {
            return new Promise((_, z) => {
                if (!q) throw Error("Must pass in a stream containing the Google auth settings.");
                let Y = [];
                q.setEncoding("utf8").on("error", z).on("data", (A) => Y.push(A)).on("end", () => {
                    try {
                        try {
                            let A = JSON.parse(Y.join("")),
                                O = this._cacheClientFromJSON(A, K);
                            return _(O)
                        } catch (A) {
                            if (!this.keyFilename) throw A;
                            let O = new wk6.JWT({
                                ...this.clientOptions,
                                keyFile: this.keyFilename
                            });
                            return this.cachedCredential = O, this.setGapicJWTValues(O), _(O)
                        }
                    } catch (A) {
                        return z(A)
                    }
                })
            })
        }
        fromAPIKey(q, K = {}) {
            return new wk6.JWT({
                ...K,
                apiKey: q
            })
        }
        _isWindows() {
            let q = gA_.platform();
            if (q && q.length >= 3) {
                if (q.substring(0, 3).toLowerCase() === "win") return !0
            }
            return !1
        }
        async getDefaultServiceProjectId() {
            return new Promise((q) => {
                (0, FA_.exec)("gcloud config config-helper --format json", (K, _) => {
                    if (!K && _) try {
                        let z = JSON.parse(_).configuration.properties.core.project;
                        q(z);
                        return
                    } catch (z) {}
                    q(null)
                })
            })
        }
        getProductionProjectId() {
            return process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project
        }
        async getFileProjectId() {
            if (this.cachedCredential) return this.cachedCredential.projectId;
            if (this.keyFilename) {
                let K = await this.getClient();
                if (K && K.projectId) return K.projectId
            }
            let q = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
            if (q) return q.projectId;
            else return null
        }
        async getExternalAccountClientProjectId() {
            if (!this.jsonContent || this.jsonContent.type !== Xo6.EXTERNAL_ACCOUNT_TYPE) return null;
            return await (await this.getClient()).getProjectId()
        }
        async getGCEProjectId() {
            try {
                return await Jo6.project("project-id")
            } catch (q) {
                return null
            }
        }
        getCredentials(q) {
            if (q) this.getCredentialsAsync().then((K) => q(null, K), q);
            else return this.getCredentialsAsync()
        }
        async getCredentialsAsync() {
            let q = await this.getClient();
            if (q instanceof $k6.Impersonated) return {
                client_email: q.getTargetPrincipal()
            };
            if (q instanceof Xo6.BaseExternalAccountClient) {
                let K = q.getServiceAccountEmail();
                if (K) return {
                    client_email: K,
                    universe_domain: q.universeDomain
                }
            }
            if (this.jsonContent) return {
                client_email: this.jsonContent.client_email,
                private_key: this.jsonContent.private_key,
                universe_domain: this.jsonContent.universe_domain
            };
            if (await this._checkIsGCE()) {
                let [K, _] = await Promise.all([Jo6.instance("service-accounts/default/email"), this.getUniverseDomain()]);
                return {
                    client_email: K,
                    universe_domain: _
                }
            }
            throw Error(Df.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND)
        }
        async getClient() {
            if (this.cachedCredential) return this.cachedCredential;
            Ygq(this, jk6, sq6(this, jk6, "f") || sq6(this, tq6, "m", $gq).call(this), "f");
            try {
                return await sq6(this, jk6, "f")
            } finally {
                Ygq(this, jk6, null, "f")
            }
        }
        async getIdTokenClient(q) {
            let K = await this.getClient();
            if (!("fetchIdToken" in K)) throw Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
            return new cA_.IdTokenClient({
                targetAudience: q,
                idTokenProvider: K
            })
        }
        async getAccessToken() {
            return (await (await this.getClient()).getAccessToken()).token
        }
        async getRequestHeaders(q) {
            return (await this.getClient()).getRequestHeaders(q)
        }
        async authorizeRequest(q) {
            q = q || {};
            let K = q.url || q.uri,
                z = await (await this.getClient()).getRequestHeaders(K);
            return q.headers = Object.assign(q.headers || {}, z), q
        }
        async request(q) {
            return (await this.getClient()).request(q)
        }
        getEnv() {
            return (0, lA_.getEnv)()
        }
        async sign(q, K) {
            let _ = await this.getClient(),
                z = await this.getUniverseDomain();
            if (K = K || `https://iamcredentials.${z}/v1/projects/-/serviceAccounts/`, _ instanceof $k6.Impersonated) return (await _.sign(q)).signedBlob;
            let Y = (0, UA_.createCrypto)();
            if (_ instanceof wk6.JWT && _.key) return await Y.sign(_.key, q);
            let A = await this.getCredentials();
            if (!A.client_email) throw Error("Cannot sign data without `client_email`.");
            return this.signBlob(Y, A.client_email, q, K)
        }
        async signBlob(q, K, _, z) {
            let Y = new URL(z + `${K}:signBlob`);
            return (await this.request({
                method: "POST",
                url: Y.href,
                data: {
                    payload: q.encodeBase64StringUtf8(_)
                },
                retry: !0,
                retryConfig: {
                    httpMethodsToRetry: ["POST"]
                }
            })).data.signedBlob
        }
    }
    Df.GoogleAuth = YR1;
    jk6 = new WeakMap, tq6 = new WeakSet, Hk6 = async function(K, _ = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || null) {
        let z = await this.getProjectIdOptional();
        if (_) K.quotaProjectId = _;
        return this.cachedCredential = K, {
            credential: K,
            projectId: z
        }
    }, $gq = async function() {
        if (this.jsonContent) return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
        else if (this.keyFilename) {
            let K = zR1.resolve(this.keyFilename),
                _ = Mo6.createReadStream(K);
            return await this.fromStreamAsync(_, this.clientOptions)
        } else if (this.apiKey) {
            let K = await this.fromAPIKey(this.apiKey, this.clientOptions);
            K.scopes = this.scopes;
            let {
                credential: _
            } = await sq6(this, tq6, "m", Hk6).call(this, K);
            return _
        } else {
            let {
                credential: K
            } = await this.getApplicationDefaultAsync(this.clientOptions);
            return K
        }
    };
    YR1.DefaultTransporter = QA_.DefaultTransporter
})
// @from(Ln 154849, Col 4)
Mgq = p((Jgq) => {
    Object.defineProperty(Jgq, "__esModule", {
        value: !0
    });
    Jgq.IAMAuth = void 0;
    class Hgq {
        constructor(q, K) {
            this.selector = q, this.token = K, this.selector = q, this.token = K
        }
        getRequestHeaders() {
            return {
                "x-goog-iam-authority-selector": this.selector,
                "x-goog-iam-authorization-token": this.token
            }
        }
    }
    Jgq.IAMAuth = Hgq
})
// @from(Ln 154867, Col 4)
Zgq = p((Wgq) => {
    Object.defineProperty(Wgq, "__esModule", {
        value: !0
    });
    Wgq.DownscopedClient = Wgq.EXPIRATION_TIME_OFFSET = Wgq.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
    var iA_ = d6("stream"),
        rA_ = oQ(),
        oA_ = Lh1(),
        aA_ = "urn:ietf:params:oauth:grant-type:token-exchange",
        sA_ = "urn:ietf:params:oauth:token-type:access_token",
        tA_ = "urn:ietf:params:oauth:token-type:access_token";
    Wgq.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
    Wgq.EXPIRATION_TIME_OFFSET = 300000;
    class Pgq extends rA_.AuthClient {
        constructor(q, K, _, z) {
            super({
                ..._,
                quotaProjectId: z
            });
            if (this.authClient = q, this.credentialAccessBoundary = K, K.accessBoundary.accessBoundaryRules.length === 0) throw Error("At least one access boundary rule needs to be defined.");
            else if (K.accessBoundary.accessBoundaryRules.length > Wgq.MAX_ACCESS_BOUNDARY_RULES_COUNT) throw Error(`The provided access boundary has more than ${Wgq.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
            for (let Y of K.accessBoundary.accessBoundaryRules)
                if (Y.availablePermissions.length === 0) throw Error("At least one permission should be defined in access boundary rules.");
            this.stsCredential = new oA_.StsCredentials(`https://sts.${this.universeDomain}/v1/token`), this.cachedDownscopedAccessToken = null
        }
        setCredentials(q) {
            if (!q.expiry_date) throw Error("The access token expiry_date field is missing in the provided credentials.");
            super.setCredentials(q), this.cachedDownscopedAccessToken = q
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
            let K = {
                Authorization: `Bearer ${(await this.getAccessToken()).token}`
            };
            return this.addSharedMetadataHeaders(K)
        }
        request(q, K) {
            if (K) this.requestAsync(q).then((_) => K(null, _), (_) => {
                return K(_, _.response)
            });
            else return this.requestAsync(q)
        }
        async requestAsync(q, K = !1) {
            let _;
            try {
                let z = await this.getRequestHeaders();
                if (q.headers = q.headers || {}, z && z["x-goog-user-project"]) q.headers["x-goog-user-project"] = z["x-goog-user-project"];
                if (z && z.Authorization) q.headers.Authorization = z.Authorization;
                _ = await this.transporter.request(q)
            } catch (z) {
                let Y = z.response;
                if (Y) {
                    let A = Y.status,
                        O = Y.config.data instanceof iA_.Readable;
                    if (!K && (A === 401 || A === 403) && !O && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(q, !0)
                }
                throw z
            }
            return _
        }
        async refreshAccessTokenAsync() {
            var q;
            let K = (await this.authClient.getAccessToken()).token,
                _ = {
                    grantType: aA_,
                    requestedTokenType: sA_,
                    subjectToken: K,
                    subjectTokenType: tA_
                },
                z = await this.stsCredential.exchangeToken(_, void 0, this.credentialAccessBoundary),
                Y = ((q = this.authClient.credentials) === null || q === void 0 ? void 0 : q.expiry_date) || null,
                A = z.expires_in ? new Date().getTime() + z.expires_in * 1000 : Y;
            return this.cachedDownscopedAccessToken = {
                access_token: z.access_token,
                expiry_date: A,
                res: z.res
            }, this.credentials = {}, Object.assign(this.credentials, this.cachedDownscopedAccessToken), delete this.credentials.res, this.emit("tokens", {
                refresh_token: null,
                expiry_date: this.cachedDownscopedAccessToken.expiry_date,
                access_token: this.cachedDownscopedAccessToken.access_token,
                token_type: "Bearer",
                id_token: null
            }), this.cachedDownscopedAccessToken
        }
        isExpired(q) {
            let K = new Date().getTime();
            return q.expiry_date ? K >= q.expiry_date - this.eagerRefreshThresholdMillis : !1
        }
    }
    Wgq.DownscopedClient = Pgq
})
// @from(Ln 154965, Col 4)
vgq = p((fgq) => {
    Object.defineProperty(fgq, "__esModule", {
        value: !0
    });
    fgq.PassThroughClient = void 0;
    var qO_ = oQ();
    class OR1 extends qO_.AuthClient {
        async request(q) {
            return this.transporter.request(q)
        }
        async getAccessToken() {
            return {}
        }
        async getRequestHeaders() {
            return {}
        }
    }
    fgq.PassThroughClient = OR1;
    var KO_ = new OR1;
    KO_.getAccessToken()
})
// @from(Ln 154986, Col 4)
AV8 = p((x2) => {
    Object.defineProperty(x2, "__esModule", {
        value: !0
    });
    x2.GoogleAuth = x2.auth = x2.DefaultTransporter = x2.PassThroughClient = x2.ExecutableError = x2.PluggableAuthClient = x2.DownscopedClient = x2.BaseExternalAccountClient = x2.ExternalAccountClient = x2.IdentityPoolClient = x2.AwsRequestSigner = x2.AwsClient = x2.UserRefreshClient = x2.LoginTicket = x2.ClientAuthentication = x2.OAuth2Client = x2.CodeChallengeMethod = x2.Impersonated = x2.JWT = x2.JWTAccess = x2.IdTokenClient = x2.IAMAuth = x2.GCPEnv = x2.Compute = x2.DEFAULT_UNIVERSE = x2.AuthClient = x2.gaxios = x2.gcpMetadata = void 0;
    var Tgq = jgq();
    Object.defineProperty(x2, "GoogleAuth", {
        enumerable: !0,
        get: function() {
            return Tgq.GoogleAuth
        }
    });
    x2.gcpMetadata = zo6();
    x2.gaxios = hB();
    var Vgq = oQ();
    Object.defineProperty(x2, "AuthClient", {
        enumerable: !0,
        get: function() {
            return Vgq.AuthClient
        }
    });
    Object.defineProperty(x2, "DEFAULT_UNIVERSE", {
        enumerable: !0,
        get: function() {
            return Vgq.DEFAULT_UNIVERSE
        }
    });
    var _O_ = Mh1();
    Object.defineProperty(x2, "Compute", {
        enumerable: !0,
        get: function() {
            return _O_.Compute
        }
    });
    var zO_ = Wh1();
    Object.defineProperty(x2, "GCPEnv", {
        enumerable: !0,
        get: function() {
            return zO_.GCPEnv
        }
    });
    var YO_ = Mgq();
    Object.defineProperty(x2, "IAMAuth", {
        enumerable: !0,
        get: function() {
            return YO_.IAMAuth
        }
    });
    var AO_ = Ph1();
    Object.defineProperty(x2, "IdTokenClient", {
        enumerable: !0,
        get: function() {
            return AO_.IdTokenClient
        }
    });
    var OO_ = vh1();
    Object.defineProperty(x2, "JWTAccess", {
        enumerable: !0,
        get: function() {
            return OO_.JWTAccess
        }
    });
    var wO_ = Vh1();
    Object.defineProperty(x2, "JWT", {
        enumerable: !0,
        get: function() {
            return wO_.JWT
        }
    });
    var $O_ = Nh1();
    Object.defineProperty(x2, "Impersonated", {
        enumerable: !0,
        get: function() {
            return $O_.Impersonated
        }
    });
    var wR1 = y26();
    Object.defineProperty(x2, "CodeChallengeMethod", {
        enumerable: !0,
        get: function() {
            return wR1.CodeChallengeMethod
        }
    });
    Object.defineProperty(x2, "OAuth2Client", {
        enumerable: !0,
        get: function() {
            return wR1.OAuth2Client
        }
    });
    Object.defineProperty(x2, "ClientAuthentication", {
        enumerable: !0,
        get: function() {
            return wR1.ClientAuthentication
        }
    });
    var jO_ = Hh1();
    Object.defineProperty(x2, "LoginTicket", {
        enumerable: !0,
        get: function() {
            return jO_.LoginTicket
        }
    });
    var HO_ = kh1();
    Object.defineProperty(x2, "UserRefreshClient", {
        enumerable: !0,
        get: function() {
            return HO_.UserRefreshClient
        }
    });
    var JO_ = Qh1();
    Object.defineProperty(x2, "AwsClient", {
        enumerable: !0,
        get: function() {
            return JO_.AwsClient
        }
    });
    var XO_ = Fh1();
    Object.defineProperty(x2, "AwsRequestSigner", {
        enumerable: !0,
        get: function() {
            return XO_.AwsRequestSigner
        }
    });
    var MO_ = ph1();
    Object.defineProperty(x2, "IdentityPoolClient", {
        enumerable: !0,
        get: function() {
            return MO_.IdentityPoolClient
        }
    });
    var PO_ = qR1();
    Object.defineProperty(x2, "ExternalAccountClient", {
        enumerable: !0,
        get: function() {
            return PO_.ExternalAccountClient
        }
    });
    var WO_ = aq6();
    Object.defineProperty(x2, "BaseExternalAccountClient", {
        enumerable: !0,
        get: function() {
            return WO_.BaseExternalAccountClient
        }
    });
    var DO_ = Zgq();
    Object.defineProperty(x2, "DownscopedClient", {
        enumerable: !0,
        get: function() {
            return DO_.DownscopedClient
        }
    });
    var kgq = YV8();
    Object.defineProperty(x2, "PluggableAuthClient", {
        enumerable: !0,
        get: function() {
            return kgq.PluggableAuthClient
        }
    });
    Object.defineProperty(x2, "ExecutableError", {
        enumerable: !0,
        get: function() {
            return kgq.ExecutableError
        }
    });
    var ZO_ = vgq();
    Object.defineProperty(x2, "PassThroughClient", {
        enumerable: !0,
        get: function() {
            return ZO_.PassThroughClient
        }
    });
    var fO_ = Ao6();
    Object.defineProperty(x2, "DefaultTransporter", {
        enumerable: !0,
        get: function() {
            return fO_.DefaultTransporter
        }
    });
    var GO_ = new Tgq.GoogleAuth;
    x2.auth = GO_
})
// @from(Ln 155167, Col 4)
OV8 = (q) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[q]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(q)?.trim();
    return
}
// @from(Ln 155172, Col 4)
Ngq = L(() => {
    m0()
})
// @from(Ln 155176, Col 0)
function wV8(q) {
    return q != null && typeof q === "object" && !Array.isArray(q)
}
// @from(Ln 155179, Col 4)
$R1 = (q) => ($R1 = Array.isArray, $R1(q))
// @from(Ln 155180, Col 4)
jR1
// @from(Ln 155181, Col 4)
HR1 = L(() => {
    Ngq();
    jR1 = $R1
})
// @from(Ln 155186, Col 0)
function* NO_(q) {
    if (!q) return;
    if (Egq in q) {
        let {
            values: z,
            nulls: Y
        } = q;
        yield* z.entries();
        for (let A of Y) yield [A, null];
        return
    }
    let K = !1,
        _;
    if (q instanceof Headers) _ = q.entries();
    else if (jR1(q)) _ = q;
    else K = !0, _ = Object.entries(q ?? {});
    for (let z of _) {
        let Y = z[0];
        if (typeof Y !== "string") throw TypeError("expected header name to be a string");
        let A = jR1(z[1]) ? z[1] : [z[1]],
            O = !1;
        for (let w of A) {
            if (w === void 0) continue;
            if (K && !O) O = !0, yield [Y, null];
            yield [Y, w]
        }
    }
}
// @from(Ln 155214, Col 4)
Egq
// @from(Ln 155214, Col 9)
ygq = (q) => {
    let K = new Headers,
        _ = new Set;
    for (let z of q) {
        let Y = new Set;
        for (let [A, O] of NO_(z)) {
            let w = A.toLowerCase();
            if (!Y.has(w)) K.delete(A), Y.add(w);
            if (O === null) K.delete(A), _.add(w);
            else K.append(A, O), _.delete(w)
        }
    }
    return {
        [Egq]: !0,
        values: K,
        nulls: _
    }
}
// @from(Ln 155232, Col 4)
Lgq = L(() => {
    HR1();
    Egq = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 155237, Col 0)
function LO_(q) {
    let K = new jV(q);
    return delete K.batches, K
}
// @from(Ln 155242, Col 0)
function hO_(q) {
    let K = new p0(q);
    return delete K.messages.batches, K
}
// @from(Ln 155246, Col 4)
hgq
// @from(Ln 155246, Col 9)
EO_ = "vertex-2023-10-16"
// @from(Ln 155247, Col 4)
yO_
// @from(Ln 155247, Col 9)
JR1
// @from(Ln 155248, Col 4)
XR1 = L(() => {
    yC();
    nD6();
    HR1();
    Lgq();
    yC();
    hgq = K6(AV8(), 1), yO_ = new Set(["/v1/messages", "/v1/messages?beta=true"]);
    JR1 = class JR1 extends az {
        constructor({
            baseURL: q = OV8("ANTHROPIC_VERTEX_BASE_URL"),
            region: K = OV8("CLOUD_ML_REGION") ?? null,
            projectId: _ = OV8("ANTHROPIC_VERTEX_PROJECT_ID") ?? null,
            ...z
        } = {}) {
            if (!K) throw Error("No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.");
            super({
                baseURL: q || (K === "global" ? "https://aiplatform.googleapis.com/v1" : `https://${K}-aiplatform.googleapis.com/v1`),
                ...z
            });
            if (this.messages = LO_(this), this.beta = hO_(this), this.region = K, this.projectId = _, this.accessToken = z.accessToken ?? null, z.authClient && z.googleAuth) throw Error("You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.");
            else if (z.authClient) this._authClientPromise = Promise.resolve(z.authClient);
            else this._auth = z.googleAuth ?? new hgq.GoogleAuth({
                scopes: "https://www.googleapis.com/auth/cloud-platform"
            }), this._authClientPromise = this._auth.getClient()
        }
        validateHeaders() {}
        async prepareOptions(q) {
            let K = await this._authClientPromise,
                _ = await K.getRequestHeaders(),
                z = K.projectId ?? _["x-goog-user-project"];
            if (!this.projectId && z) this.projectId = z;
            q.headers = ygq([_, q.headers])
        }
        async buildRequest(q) {
            if (wV8(q.body)) q.body = {
                ...q.body
            };
            if (wV8(q.body)) {
                if (!q.body.anthropic_version) q.body.anthropic_version = EO_
            }
            if (yO_.has(q.path) && q.method === "post") {
                if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
                if (!wV8(q.body)) throw Error("Expected request body to be an object for post /v1/messages");
                let K = q.body.model;
                q.body.model = void 0;
                let z = q.body.stream ?? !1 ? "streamRawPredict" : "rawPredict";
                q.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/${K}:${z}`
            }
            if (q.path === "/v1/messages/count_tokens" || q.path == "/v1/messages/count_tokens?beta=true" && q.method === "post") {
                if (!this.projectId) throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
                q.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/count-tokens:rawPredict`
            }
            return super.buildRequest(q)
        }
    }
})
// @from(Ln 155304, Col 4)
$V8 = {}
// @from(Ln 155310, Col 4)
jV8 = L(() => {
    XR1();
    XR1()
})
// @from(Ln 155314, Col 4)
Rgq = {}
// @from(Ln 155318, Col 0)
async function Jk6(q, K) {
    if (q.kind === "skip") return {
        getClient: () => ({
            getRequestHeaders: () => ({})
        })
    };
    let {
        GoogleAuth: _
    } = await Promise.resolve().then(() => K6(AV8(), 1));
    return new _({
        scopes: RO_,
        ...q.kind === "keyFile" && {
            keyFilename: q.path
        },
        ...K && {
            projectId: K
        }
    })
}
// @from(Ln 155337, Col 4)
RO_
// @from(Ln 155338, Col 4)
HV8 = L(() => {
    RO_ = ["https://www.googleapis.com/auth/cloud-platform"]
})
// @from(Ln 155345, Col 0)
function Xk6() {
    return {
        error: (q, ...K) => console.error("[Anthropic SDK ERROR]", q, ...K),
        warn: (q, ...K) => console.error("[Anthropic SDK WARN]", q, ...K),
        info: (q, ...K) => console.error("[Anthropic SDK INFO]", q, ...K),
        debug: (q, ...K) => console.error("[Anthropic SDK DEBUG]", q, ...K)
    }
}
// @from(Ln 155353, Col 0)
async function qR({
    apiKey: q,
    maxRetries: K,
    model: _,
    fetchOverride: z,
    source: Y
}) {
    let A = process.env.CLAUDE_CODE_CONTAINER_ID,
        O = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
        w = process.env.CLAUDE_AGENT_SDK_CLIENT_APP,
        $ = bO_(),
        H = {
            "x-app": BT6() ? "cli-bg" : "cli",
            "User-Agent": OI(),
            "X-Claude-Code-Session-Id": I8(),
            ...$,
            ...A && {
                "x-claude-remote-container-id": A
            },
            ...O && {
                "x-claude-remote-session-id": O
            },
            ...w && {
                "x-client-app": w
            }
        };
    if (E(`[API:request] Creating client, ANTHROPIC_CUSTOM_HEADERS present: ${!!process.env.ANTHROPIC_CUSTOM_HEADERS}, has Authorization header: ${!!$.Authorization}`), S6(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) H["x-anthropic-additional-protection"] = "true";
    if (E("[API:auth] OAuth token check starting"), await _Y(), E("[API:auth] OAuth token check complete"), !i7()) await CO_(H, I7());
    await f08();
    let X = uO_(z, Y),
        M = {
            defaultHeaders: H,
            maxRetries: K,
            timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
            dangerouslyAllowBrowser: !0,
            fetchOptions: b76({
                forAnthropicAPI: !0
            }),
            ...X && {
                fetch: X
            }
        },
        P = YM(_);
    if (P === "bedrock") {
        let {
            AnthropicBedrock: D
        } = await Promise.resolve().then(() => (Sn6(), Rn6)), Z = Sgq(_), G = S6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), f = MR1(M.defaultHeaders), v = process.env.AWS_BEARER_TOKEN_BEDROCK ? `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}` : G ? f.value : void 0, V = !v && !G ? await bb() : null, k = {
            ...M,
            defaultHeaders: f.rest,
            awsRegion: Z,
            apiKey: null,
            ...G && !v && {
                skipAuth: !0
            },
            ...v && {
                apiKey: v.match(/^Bearer (.+)$/i)?.[1] ?? v,
                defaultHeaders: {
                    ...f.rest,
                    Authorization: v
                }
            },
            ...SC() && {
                logger: Xk6()
            }
        };
        return V ? new D({
            ...k,
            awsAccessKey: V.accessKeyId,
            awsSecretKey: V.secretAccessKey,
            awsSessionToken: V.sessionToken
        }) : new D(k)
    }
    if (P === "foundry") {
        let {
            AnthropicFoundry: D
        } = await Promise.resolve().then(() => (Bkq(), mkq)), Z;
        if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
            if (S6(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) Z = () => Promise.resolve("");
            else {
                let {
                    DefaultAzureCredential: f,
                    getBearerTokenProvider: v
                } = await Promise.resolve().then(() => (tIq(), sIq));
                Z = v(new f, "https://cognitiveservices.azure.com/.default")
            } let G = {
            ...M,
            ...Z && {
                azureADTokenProvider: Z
            },
            ...SC() && {
                logger: Xk6()
            }
        };
        return new D(G)
    }
    if (P === "anthropicAws") {
        let {
            AnthropicAws: D
        } = await Promise.resolve().then(() => (Xxq(), Jxq)), Z = S6(process.env.CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH), G = MR1(M.defaultHeaders), f = Z ? G.value : void 0, v = {
            ...M,
            defaultHeaders: G.rest,
            ...Z && !f && {
                skipAuth: !0
            },
            ...f && {
                apiKey: f.match(/^Bearer (.+)$/i)?.[1] ?? f,
                defaultHeaders: {
                    ...G.rest,
                    Authorization: f
                }
            },
            ...SC() && {
                logger: Xk6()
            }
        };
        if (!process.env.ANTHROPIC_AWS_API_KEY && !Z) {
            let V = await bb();
            if (V) v.awsAccessKey = V.accessKeyId, v.awsSecretAccessKey = V.secretAccessKey, v.awsSessionToken = V.sessionToken
        }
        return new D(v)
    }
    if (P === "mantle") {
        let {
            AnthropicBedrockMantle: D
        } = await Promise.resolve().then(() => (Sn6(), Rn6)), Z = S6(process.env.CLAUDE_CODE_SKIP_MANTLE_AUTH), G = MR1(M.defaultHeaders), f = Z ? G.value : void 0, v = !process.env.AWS_BEARER_TOKEN_BEDROCK && !Z ? await bb() : null;
        return new D({
            ...M,
            defaultHeaders: G.rest,
            awsRegion: Sgq(_),
            ...Z && !f && {
                skipAuth: !0
            },
            ...f && {
                apiKey: f.match(/^Bearer (.+)$/i)?.[1] ?? f,
                defaultHeaders: {
                    ...G.rest,
                    Authorization: f
                }
            },
            ...v && {
                awsAccessKey: v.accessKeyId,
                awsSecretAccessKey: v.secretAccessKey,
                awsSessionToken: v.sessionToken
            },
            ...SC() && {
                logger: Xk6()
            }
        })
    }
    if (P === "vertex") {
        if (!S6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) await h26();
        let [{
            AnthropicVertex: D
        }, {
            buildVertexGoogleAuth: Z
        }] = await Promise.all([Promise.resolve().then(() => (jV8(), $V8)), Promise.resolve().then(() => (HV8(), Rgq))]), G = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project, f = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials, v = await Z(S6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH) ? {
            kind: "skip"
        } : {
            kind: "default"
        }, G || f ? void 0 : process.env.ANTHROPIC_VERTEX_PROJECT_ID), V = {
            ...M,
            region: uD6(_),
            googleAuth: v,
            ...SC() && {
                logger: Xk6()
            }
        };
        return new D(V)
    }
    let W = {
        apiKey: i7() ? null : q || FV(),
        authToken: i7() ? o7()?.accessToken : void 0,
        ...!1,
        ...M,
        ...SC() && {
            logger: Xk6()
        }
    };
    return new qh(W)
}
// @from(Ln 155533, Col 0)
async function CO_(q, K) {
    let _ = process.env.ANTHROPIC_AUTH_TOKEN || await Wk6(K);
    if (_) q.Authorization = `Bearer ${_}`
}
// @from(Ln 155538, Col 0)
function Sgq(q) {
    let K = process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION;
    if (q && K && o5(q) === o5(OM())) return K;
    return oL()
}
// @from(Ln 155544, Col 0)
function MR1(q) {
    let K = {},
        _;
    for (let [z, Y] of Object.entries(q))
        if (z.toLowerCase() === "authorization") _ = Y;
        else K[z] = Y;
    return {
        value: _,
        rest: K
    }
}
// @from(Ln 155556, Col 0)
function bO_() {
    let q = {},
        K = process.env.ANTHROPIC_CUSTOM_HEADERS;
    if (!K) return q;
    let _ = K.split(/\n|\r\n/);
    for (let z of _) {
        if (!z.trim()) continue;
        let Y = z.indexOf(":");
        if (Y === -1) continue;
        let A = z.slice(0, Y).trim(),
            O = z.slice(Y + 1).trim();
        if (A) q[A] = O
    }
    return q
}
// @from(Ln 155572, Col 0)
function IO_(q, K) {
    let _ = null,
        z = () => {
            if (_ !== null) clearTimeout(_), _ = null
        },
        Y = (A) => {
            z(), _ = setTimeout(() => {
                _ = null;
                try {
                    A.error(new JV8(K))
                } catch {}
            }, K), _.unref?.()
        };
    return q.pipeThrough(new TransformStream({
        start: Y,
        transform(A, O) {
            Y(O), O.enqueue(A)
        },
        flush: z
    }))
}
// @from(Ln 155594, Col 0)
function xO_() {
    if (c5(process.env.CLAUDE_ENABLE_BYTE_WATCHDOG)) return !1;
    if (S6(process.env.CLAUDE_ENABLE_BYTE_WATCHDOG)) return !0;
    return u8("tengu_stream_watchdog_default_on", !0)
}
// @from(Ln 155600, Col 0)
function uO_(q, K) {
    let _ = q ?? globalThis.fetch,
        z = pq(),
        Y = z === "firstParty" && Aj() || z === "anthropicAws" && !process.env.ANTHROPIC_AWS_BASE_URL;
    return async (A, O) => {
        let w = new Headers(O?.headers);
        if (Y && !w.has(Mk6)) w.set(Mk6, SO_());
        try {
            let j = A instanceof Request ? A.url : String(A),
                H = w.get(Mk6);
            E(`[API REQUEST] ${new URL(j).pathname}${H?` ${Mk6}=${H}`:""} source=${K??"unknown"}`)
        } catch {}
        let $ = await _(A, {
            ...O,
            headers: w
        });
        if (Y && $.body && $.headers.get("content-type")?.includes("text/event-stream") && xO_()) {
            let j = Math.max(parseInt(process.env.CLAUDE_STREAM_IDLE_TIMEOUT_MS || "", 10) || 90000, 300000),
                H = new Response(IO_($.body, j), $);
            return Object.defineProperty(H, "url", {
                value: $.url
            }), H
        }
        return $
    }
}
// @from(Ln 155626, Col 4)
Mk6 = "x-client-request-id"
// @from(Ln 155627, Col 4)
JV8
// @from(Ln 155628, Col 4)
Pk6 = L(() => {
    eG();
    T7();
    wf();
    Zf();
    Sq();
    x9();
    _M();
    y8();
    z3();
    K8();
    Q8();
    B1();
    JV8 = class JV8 extends Error {
        idleMs;
        constructor(q) {
            super(`stream idle: no bytes for ${q}ms`);
            this.name = "StreamIdleTimeoutError", this.idleMs = q
        }
    }
})
// @from(Ln 155660, Col 0)
function Igq() {
    return Cgq(A7(), "cache")
}
// @from(Ln 155664, Col 0)
function xgq() {
    return Cgq(Igq(), "model-capabilities.json")
}
// @from(Ln 155668, Col 0)
function ugq() {
    return !1
}
// @from(Ln 155672, Col 0)
function gO_(q) {
    return [...q].sort((K, _) => _.id.length - K.id.length || K.id.localeCompare(_.id))
}
// @from(Ln 155676, Col 0)
function mgq(q) {
    if (!ugq()) return;
    let K = PR1(xgq());
    if (!K || K.length === 0) return;
    let _ = q.toLowerCase(),
        z = K.find((Y) => Y.id.toLowerCase() === _);
    if (z) return z;
    return K.find((Y) => _.includes(Y.id.toLowerCase()))
}
// @from(Ln 155685, Col 0)
async function Bgq() {
    if (!ugq()) return;
    if (o3()) return;
    try {
        let q = await qR({
                maxRetries: 1
            }),
            K = i7() ? [eJ] : void 0,
            _ = [];
        for await (let A of q.models.list({
            betas: K
        })) {
            let O = bgq().safeParse(A);
            if (O.success) _.push(O.data)
        }
        if (_.length === 0) return;
        let z = xgq(),
            Y = gO_(_);
        if (f$(PR1(z), Y)) {
            E("[modelCapabilities] cache unchanged, skipping write");
            return
        }
        await BO_(Igq(), {
            recursive: !0
        }), await pO_(z, I6({
            models: Y,
            timestamp: Date.now()
        }), {
            encoding: "utf-8",
            mode: 384
        }), PR1.cache.delete(z), E(`[modelCapabilities] cached ${Y.length} models`)
    } catch (q) {
        E(`[modelCapabilities] fetch failed: ${q instanceof Error?q.message:"unknown"}`)
    }
}
// @from(Ln 155720, Col 4)
bgq
// @from(Ln 155720, Col 9)
FO_
// @from(Ln 155720, Col 14)
PR1
// @from(Ln 155721, Col 4)
WR1 = L(() => {
    JU();
    U4();
    p7();
    z3();
    Pk6();
    T7();
    K8();
    Q8();
    mO();
    G$();
    e8();
    x9();
    bgq = C6(() => y.object({
        id: y.string(),
        max_input_tokens: y.number().optional(),
        max_tokens: y.number().optional()
    }).strip()), FO_ = C6(() => y.object({
        models: y.array(bgq()),
        timestamp: y.number()
    }));
    PR1 = P1((q) => {
        try {
            let K = mO_(q, "utf-8"),
                _ = FO_().safeParse(k5(K, !1));
            return _.success ? _.data.models : null
        } catch {
            return null
        }
    }, (q) => q)
})
// @from(Ln 155753, Col 0)
function zq6() {
    return S6(process.env.CLAUDE_CODE_DISABLE_1M_CONTEXT)
}
// @from(Ln 155757, Col 0)
function DP(q) {
    if (zq6()) return !1;
    return /\[1m\]/i.test(q)
}
// @from(Ln 155762, Col 0)
function vo(q) {
    if (zq6()) return !1;
    let K = o5(q);
    return K.includes("claude-sonnet-4") || K.includes("opus-4-6") || K.includes("opus-4-7")
}
// @from(Ln 155768, Col 0)
function ff(q, K) {
    if (S6(process.env.DISABLE_COMPACT) && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
        let _ = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
        if (!isNaN(_) && _ > 0) return _
    }
    if (DP(q)) return 1e6;
    if (K?.includes(Zo) && vo(q)) return 1e6;
    if (XV8(q)) return 1e6;
    return DR1
}
// @from(Ln 155779, Col 0)
function XV8(q) {
    if (zq6()) return !1;
    if (DP(q)) return !1;
    if (!o5(q).includes("sonnet-4-6")) return !1;
    return H8().clientDataCache?.coral_reef_sonnet === "true"
}
// @from(Ln 155786, Col 0)
function MV8(q, K) {
    if (!q) return {
        used: null,
        remaining: null
    };
    let _ = q.input_tokens + q.cache_creation_input_tokens + q.cache_read_input_tokens,
        z = Math.round(_ / K * 100),
        Y = Math.min(100, Math.max(0, z));
    return {
        used: Y,
        remaining: 100 - Y
    }
}
// @from(Ln 155800, Col 0)
function wa(q) {
    let K, _, z = o5(q);
    if (z.includes("opus-4-7")) K = 64000, _ = 128000;
    else if (z.includes("sonnet-4-6")) K = 32000, _ = 128000;
    else if (z.includes("opus-4-6")) K = 64000, _ = 128000;
    else if (z.includes("opus-4-5") || z.includes("sonnet-4") || z.includes("haiku-4")) K = 32000, _ = 64000;
    else if (z.includes("opus-4-1") || z.includes("opus-4")) K = 32000, _ = 32000;
    else if (z.includes("claude-3-opus")) K = 4096, _ = 4096;
    else if (z.includes("claude-3-sonnet")) K = 8192, _ = 8192;
    else if (z.includes("claude-3-haiku")) K = 4096, _ = 4096;
    else if (z.includes("3-5-sonnet") || z.includes("3-5-haiku")) K = 8192, _ = 8192;
    else if (z.includes("3-7-sonnet")) K = 32000, _ = 64000;
    else K = UO_, _ = QO_;
    let Y = mgq(q);
    if (Y?.max_tokens && Y.max_tokens >= 4096) _ = Y.max_tokens, K = Math.min(K, _);
    return {
        default: K,
        upperLimit: _
    }
}
// @from(Ln 155821, Col 0)
function Fgq(q) {
    return wa(q).upperLimit - 1
}
// @from(Ln 155824, Col 4)
DR1 = 200000
// @from(Ln 155825, Col 4)
Po6 = 20000
// @from(Ln 155826, Col 4)
UO_ = 32000
// @from(Ln 155827, Col 4)
QO_ = 128000
// @from(Ln 155828, Col 4)
pgq = 8000
// @from(Ln 155829, Col 4)
AJ = L(() => {
    e76();
    h1();
    Q8();
    Sq();
    WR1()
})
// @from(Ln 155836, Col 4)
dO_
// @from(Ln 155836, Col 9)
$a
// @from(Ln 155837, Col 4)
PV8 = L(() => {
    U4();
    x9();
    dO_ = [{
        modelEnvVar: "ANTHROPIC_DEFAULT_OPUS_MODEL",
        capabilitiesEnvVar: "ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES"
    }, {
        modelEnvVar: "ANTHROPIC_DEFAULT_SONNET_MODEL",
        capabilitiesEnvVar: "ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES"
    }, {
        modelEnvVar: "ANTHROPIC_DEFAULT_HAIKU_MODEL",
        capabilitiesEnvVar: "ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES"
    }, {
        modelEnvVar: "ANTHROPIC_CUSTOM_MODEL_OPTION",
        capabilitiesEnvVar: "ANTHROPIC_CUSTOM_MODEL_OPTION_SUPPORTED_CAPABILITIES"
    }], $a = P1((q, K) => {
        if (KA()) return;
        let _ = q.toLowerCase();
        for (let z of dO_) {
            let Y = process.env[z.modelEnvVar],
                A = process.env[z.capabilitiesEnvVar];
            if (!Y || A === void 0) continue;
            if (_ !== Y.toLowerCase()) continue;
            return A.toLowerCase().split(",").map((O) => O.trim()).includes(K)
        }
        return
    }, (q, K) => `${q.toLowerCase()}:${K}`)
})
// @from(Ln 155866, Col 0)
function lO_(q) {
    let K = [],
        _ = [];
    for (let z of q)
        if (Ugq.includes(z)) K.push(z);
        else _.push(z);
    return {
        allowed: K,
        disallowed: _
    }
}
// @from(Ln 155878, Col 0)
function Qgq(q) {
    if (!q || q.length === 0) return;
    if (i7()) {
        console.warn("Warning: Custom betas are only available for API key users. Ignoring provided betas.");
        return
    }
    let {
        allowed: K,
        disallowed: _
    } = lO_(q);
    for (let z of _) console.warn(`Warning: Beta header '${z}' is not allowed. Only the following betas are supported: ${Ugq.join(", ")}`);
    return K.length > 0 ? K : void 0
}
// @from(Ln 155892, Col 0)
function ggq(q) {
    let K = $a(q, "interleaved_thinking");
    if (K !== void 0) return K;
    let _ = o5(q),
        z = YM(q);
    if (z === "foundry") return !0;
    if ($Q(z)) return !_.includes("claude-3-");
    if (_.includes("claude-haiku-4") || _.includes("claude-3-")) return !1;
    return !0
}
// @from(Ln 155903, Col 0)
function nO_(q) {
    let K = o5(q);
    return K.includes("claude-opus-4") || K.includes("claude-sonnet-4") || K.includes("claude-haiku-4")
}
// @from(Ln 155908, Col 0)
function iO_(q) {
    let K = o5(q),
        _ = YM(q);
    if (_ === "foundry") return !0;
    if ($Q(_)) return !K.includes("claude-3-");
    return K.includes("claude-opus-4") || K.includes("claude-sonnet-4") || K.includes("claude-haiku-4")
}
// @from(Ln 155916, Col 0)
function R26(q) {
    let K = o5(q);
    if (!$Q(YM(q))) return !1;
    return K.includes("claude-sonnet-4-6") || K.includes("claude-sonnet-4-5") || K.includes("claude-opus-4-1") || K.includes("claude-opus-4-5") || K.includes("claude-opus-4-6") || K.includes("claude-opus-4-7") || K.includes("claude-haiku-4-5")
}
// @from(Ln 155922, Col 0)
function WV8(q) {
    return !o5(q).includes("claude-opus-4-7")
}
// @from(Ln 155926, Col 0)
function Dk6(q) {
    {
        let K = o5(q),
            _ = u8("tengu_auto_mode_config", {}),
            z = q.toLowerCase();
        if (_?.allowModels?.some((A) => A.toLowerCase() === z || A.toLowerCase() === K)) return !0;
        let Y = pq();
        if (Y !== "firstParty" && Y !== "anthropicAws") return !1;
        if (ch()) return /^claude-opus-4-7/.test(K);
        return /^claude-(opus|sonnet)-4-6/.test(K) || /^claude-opus-4-7/.test(K)
    }
    return !1
}
// @from(Ln 155940, Col 0)
function dgq() {
    let q = pq();
    if (q === "vertex" || q === "bedrock" || q === "mantle") return vZq;
    return GZq
}
// @from(Ln 155946, Col 0)
function ja() {
    let q = pq();
    return (q === "firstParty" || q === "anthropicAws" || q === "foundry") && !S6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}
// @from(Ln 155951, Col 0)
function Zk6() {
    if (!ja()) return !1;
    if (!Aj()) return !1;
    let q = pq();
    return q === "firstParty" || q === "anthropicAws"
}
// @from(Ln 155958, Col 0)
function DV8(q, K) {
    let _ = [...KR(q)];
    if (K?.isAgenticQuery) {
        if (!_.includes(mZ8)) _.push(mZ8)
    }
    let z = eM();
    if (!z || z.length === 0) return _;
    return [..._, ...z.filter((Y) => !_.includes(Y))]
}
// @from(Ln 155968, Col 0)
function ZV8() {
    ZR1.cache?.clear?.(), KR.cache?.clear?.(), fR1.cache?.clear?.()
}
// @from(Ln 155971, Col 4)
Ugq
// @from(Ln 155971, Col 9)
ZR1
// @from(Ln 155971, Col 14)
KR
// @from(Ln 155971, Col 18)
fR1
// @from(Ln 155972, Col 4)
pv = L(() => {
    U4();
    B1();
    y8();
    e76();
    z3();
    T7();
    AJ();
    Q8();
    Sq();
    PV8();
    x9();
    a1();
    Ugq = [Zo];
    ZR1 = P1((q) => {
        let K = [],
            _ = o5(q).includes("haiku"),
            z = pq(),
            Y = ja();
        if (!_) K.push(mZ8);
        if (i7()) K.push(eJ);
        if (DP(q)) K.push(Zo);
        if (!S6(process.env.DISABLE_INTERLEAVED_THINKING) && ggq(q)) K.push(fZq);
        if (Y && ggq(q) && !I7() && v7().showThinkingSummaries !== !0) K.push(pZ8);
        TZq;
        let A = S6(process.env.USE_API_CONTEXT_MANAGEMENT) && !1,
            O = iO_(q);
        if ($Q(YM(q)) && !S6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS) && (A || O)) K.push(BZ8);
        let w = Tw("tengu_tool_pear"),
            $ = !w && u8("tengu_amber_json_tools", !1);
        if ($Q(YM(q)) && !S6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS) && R26(q) && w) K.push(t76);
        if (z === "vertex" && nO_(q)) K.push(Qv1);
        if (z === "foundry") K.push(Qv1);
        if (Y) K.push(On6);
        if (process.env.ANTHROPIC_BETAS) K.push(...process.env.ANTHROPIC_BETAS.split(",").map((j) => j.trim()).filter(Boolean));
        return K
    }), KR = P1((q) => {
        let K = ZR1(q);
        if (YM(q) === "bedrock") return K.filter((_) => !iv1.has(_));
        return K
    }), fR1 = P1((q) => {
        return ZR1(q).filter((_) => iv1.has(_))
    })
})
// @from(Ln 156016, Col 4)
lgq = p((IQO, cgq) => {
    var eq6 = d6("constants"),
        rO_ = process.cwd,
        fV8 = null,
        oO_ = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
        if (!fV8) fV8 = rO_.call(process);
        return fV8
    };
    try {
        process.cwd()
    } catch (q) {}
    if (typeof process.chdir === "function") {
        if (GV8 = process.chdir, process.chdir = function(q) {
                fV8 = null, GV8.call(process, q)
            }, Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, GV8)
    }
    var GV8;
    cgq.exports = aO_;

    function aO_(q) {
        if (eq6.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) K(q);
        if (!q.lutimes) _(q);
        if (q.chown = A(q.chown), q.fchown = A(q.fchown), q.lchown = A(q.lchown), q.chmod = z(q.chmod), q.fchmod = z(q.fchmod), q.lchmod = z(q.lchmod), q.chownSync = O(q.chownSync), q.fchownSync = O(q.fchownSync), q.lchownSync = O(q.lchownSync), q.chmodSync = Y(q.chmodSync), q.fchmodSync = Y(q.fchmodSync), q.lchmodSync = Y(q.lchmodSync), q.stat = w(q.stat), q.fstat = w(q.fstat), q.lstat = w(q.lstat), q.statSync = $(q.statSync), q.fstatSync = $(q.fstatSync), q.lstatSync = $(q.lstatSync), q.chmod && !q.lchmod) q.lchmod = function(H, J, X) {
            if (X) process.nextTick(X)
        }, q.lchmodSync = function() {};
        if (q.chown && !q.lchown) q.lchown = function(H, J, X, M) {
            if (M) process.nextTick(M)
        }, q.lchownSync = function() {};
        if (oO_ === "win32") q.rename = typeof q.rename !== "function" ? q.rename : function(H) {
            function J(X, M, P) {
                var W = Date.now(),
                    D = 0;
                H(X, M, function Z(G) {
                    if (G && (G.code === "EACCES" || G.code === "EPERM" || G.code === "EBUSY") && Date.now() - W < 60000) {
                        if (setTimeout(function() {
                                q.stat(M, function(f, v) {
                                    if (f && f.code === "ENOENT") H(X, M, Z);
                                    else P(G)
                                })
                            }, D), D < 100) D += 10;
                        return
                    }
                    if (P) P(G)
                })
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(J, H);
            return J
        }(q.rename);
        q.read = typeof q.read !== "function" ? q.read : function(H) {
            function J(X, M, P, W, D, Z) {
                var G;
                if (Z && typeof Z === "function") {
                    var f = 0;
                    G = function(v, V, k) {
                        if (v && v.code === "EAGAIN" && f < 10) return f++, H.call(q, X, M, P, W, D, G);
                        Z.apply(this, arguments)
                    }
                }
                return H.call(q, X, M, P, W, D, G)
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(J, H);
            return J
        }(q.read), q.readSync = typeof q.readSync !== "function" ? q.readSync : function(H) {
            return function(J, X, M, P, W) {
                var D = 0;
                while (!0) try {
                    return H.call(q, J, X, M, P, W)
                } catch (Z) {
                    if (Z.code === "EAGAIN" && D < 10) {
                        D++;
                        continue
                    }
                    throw Z
                }
            }
        }(q.readSync);

        function K(H) {
            H.lchmod = function(J, X, M) {
                H.open(J, eq6.O_WRONLY | eq6.O_SYMLINK, X, function(P, W) {
                    if (P) {
                        if (M) M(P);
                        return
                    }
                    H.fchmod(W, X, function(D) {
                        H.close(W, function(Z) {
                            if (M) M(D || Z)
                        })
                    })
                })
            }, H.lchmodSync = function(J, X) {
                var M = H.openSync(J, eq6.O_WRONLY | eq6.O_SYMLINK, X),
                    P = !0,
                    W;
                try {
                    W = H.fchmodSync(M, X), P = !1
                } finally {
                    if (P) try {
                        H.closeSync(M)
                    } catch (D) {} else H.closeSync(M)
                }
                return W
            }
        }

        function _(H) {
            if (eq6.hasOwnProperty("O_SYMLINK") && H.futimes) H.lutimes = function(J, X, M, P) {
                H.open(J, eq6.O_SYMLINK, function(W, D) {
                    if (W) {
                        if (P) P(W);
                        return
                    }
                    H.futimes(D, X, M, function(Z) {
                        H.close(D, function(G) {
                            if (P) P(Z || G)
                        })
                    })
                })
            }, H.lutimesSync = function(J, X, M) {
                var P = H.openSync(J, eq6.O_SYMLINK),
                    W, D = !0;
                try {
                    W = H.futimesSync(P, X, M), D = !1
                } finally {
                    if (D) try {
                        H.closeSync(P)
                    } catch (Z) {} else H.closeSync(P)
                }
                return W
            };
            else if (H.futimes) H.lutimes = function(J, X, M, P) {
                if (P) process.nextTick(P)
            }, H.lutimesSync = function() {}
        }

        function z(H) {
            if (!H) return H;
            return function(J, X, M) {
                return H.call(q, J, X, function(P) {
                    if (j(P)) P = null;
                    if (M) M.apply(this, arguments)
                })
            }
        }

        function Y(H) {
            if (!H) return H;
            return function(J, X) {
                try {
                    return H.call(q, J, X)
                } catch (M) {
                    if (!j(M)) throw M
                }
            }
        }

        function A(H) {
            if (!H) return H;
            return function(J, X, M, P) {
                return H.call(q, J, X, M, function(W) {
                    if (j(W)) W = null;
                    if (P) P.apply(this, arguments)
                })
            }
        }

        function O(H) {
            if (!H) return H;
            return function(J, X, M) {
                try {
                    return H.call(q, J, X, M)
                } catch (P) {
                    if (!j(P)) throw P
                }
            }
        }

        function w(H) {
            if (!H) return H;
            return function(J, X, M) {
                if (typeof X === "function") M = X, X = null;

                function P(W, D) {
                    if (D) {
                        if (D.uid < 0) D.uid += 4294967296;
                        if (D.gid < 0) D.gid += 4294967296
                    }
                    if (M) M.apply(this, arguments)
                }
                return X ? H.call(q, J, X, P) : H.call(q, J, P)
            }
        }

        function $(H) {
            if (!H) return H;
            return function(J, X) {
                var M = X ? H.call(q, J, X) : H.call(q, J);
                if (M) {
                    if (M.uid < 0) M.uid += 4294967296;
                    if (M.gid < 0) M.gid += 4294967296
                }
                return M
            }
        }

        function j(H) {
            if (!H) return !0;
            if (H.code === "ENOSYS") return !0;
            var J = !process.getuid || process.getuid() !== 0;
            if (J) {
                if (H.code === "EINVAL" || H.code === "EPERM") return !0
            }
            return !1
        }
    }
})
// @from(Ln 156233, Col 4)
rgq = p((xQO, igq) => {
    var ngq = d6("stream").Stream;
    igq.exports = sO_;

    function sO_(q) {
        return {
            ReadStream: K,
            WriteStream: _
        };

        function K(z, Y) {
            if (!(this instanceof K)) return new K(z, Y);
            ngq.call(this);
            var A = this;
            this.path = z, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, Y = Y || {};
            var O = Object.keys(Y);
            for (var w = 0, $ = O.length; w < $; w++) {
                var j = O[w];
                this[j] = Y[j]
            }
            if (this.encoding) this.setEncoding(this.encoding);
            if (this.start !== void 0) {
                if (typeof this.start !== "number") throw TypeError("start must be a Number");
                if (this.end === void 0) this.end = 1 / 0;
                else if (typeof this.end !== "number") throw TypeError("end must be a Number");
                if (this.start > this.end) throw Error("start must be <= end");
                this.pos = this.start
            }
            if (this.fd !== null) {
                process.nextTick(function() {
                    A._read()
                });
                return
            }
            q.open(this.path, this.flags, this.mode, function(H, J) {
                if (H) {
                    A.emit("error", H), A.readable = !1;
                    return
                }
                A.fd = J, A.emit("open", J), A._read()
            })
        }

        function _(z, Y) {
            if (!(this instanceof _)) return new _(z, Y);
            ngq.call(this), this.path = z, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, Y = Y || {};
            var A = Object.keys(Y);
            for (var O = 0, w = A.length; O < w; O++) {
                var $ = A[O];
                this[$] = Y[$]
            }
            if (this.start !== void 0) {
                if (typeof this.start !== "number") throw TypeError("start must be a Number");
                if (this.start < 0) throw Error("start must be >= zero");
                this.pos = this.start
            }
            if (this.busy = !1, this._queue = [], this.fd === null) this._open = q.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush()
        }
    }
})
// @from(Ln 156293, Col 4)
agq = p((uQO, ogq) => {
    ogq.exports = eO_;
    var tO_ = Object.getPrototypeOf || function(q) {
        return q.__proto__
    };

    function eO_(q) {
        if (q === null || typeof q !== "object") return q;
        if (q instanceof Object) var K = {
            __proto__: tO_(q)
        };
        else var K = Object.create(null);
        return Object.getOwnPropertyNames(q).forEach(function(_) {
            Object.defineProperty(K, _, Object.getOwnPropertyDescriptor(q, _))
        }), K
    }
})
// @from(Ln 156310, Col 4)
lO = p((mQO, VR1) => {
    var $J = d6("fs"),
        qw_ = lgq(),
        Kw_ = rgq(),
        _w_ = agq(),
        vV8 = d6("util"),
        Gf, VV8;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") Gf = Symbol.for("graceful-fs.queue"), VV8 = Symbol.for("graceful-fs.previous");
    else Gf = "___graceful-fs.queue", VV8 = "___graceful-fs.previous";

    function zw_() {}

    function tgq(q, K) {
        Object.defineProperty(q, Gf, {
            get: function() {
                return K
            }
        })
    }
    var S26 = zw_;
    if (vV8.debuglog) S26 = vV8.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) S26 = function() {
        var q = vV8.format.apply(vV8, arguments);
        q = "GFS4: " + q.split(/\n/).join(`
GFS4: `), console.error(q)
    };
    if (!$J[Gf]) {
        if (GR1 = global[Gf] || [], tgq($J, GR1), $J.close = function(q) {
                function K(_, z) {
                    return q.call($J, _, function(Y) {
                        if (!Y) sgq();
                        if (typeof z === "function") z.apply(this, arguments)
                    })
                }
                return Object.defineProperty(K, VV8, {
                    value: q
                }), K
            }($J.close), $J.closeSync = function(q) {
                function K(_) {
                    q.apply($J, arguments), sgq()
                }
                return Object.defineProperty(K, VV8, {
                    value: q
                }), K
            }($J.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function() {
            S26($J[Gf]), d6("assert").equal($J[Gf].length, 0)
        })
    }
    var GR1;
    if (!global[Gf]) tgq(global, $J[Gf]);
    VR1.exports = vR1(_w_($J));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !$J.__patched) VR1.exports = vR1($J), $J.__patched = !0;

    function vR1(q) {
        qw_(q), q.gracefulify = vR1, q.createReadStream = V, q.createWriteStream = k;
        var K = q.readFile;
        q.readFile = _;

        function _(h, C, x) {
            if (typeof C === "function") x = C, C = null;
            return B(h, C, x);

            function B(m, S, F, U) {
                return K(m, S, function(g) {
                    if (g && (g.code === "EMFILE" || g.code === "ENFILE")) fk6([B, [m, S, F], g, U || Date.now(), Date.now()]);
                    else if (typeof F === "function") F.apply(this, arguments)
                })
            }
        }
        var z = q.writeFile;
        q.writeFile = Y;

        function Y(h, C, x, B) {
            if (typeof x === "function") B = x, x = null;
            return m(h, C, x, B);

            function m(S, F, U, g, c) {
                return z(S, F, U, function(n) {
                    if (n && (n.code === "EMFILE" || n.code === "ENFILE")) fk6([m, [S, F, U, g], n, c || Date.now(), Date.now()]);
                    else if (typeof g === "function") g.apply(this, arguments)
                })
            }
        }
        var A = q.appendFile;
        if (A) q.appendFile = O;

        function O(h, C, x, B) {
            if (typeof x === "function") B = x, x = null;
            return m(h, C, x, B);

            function m(S, F, U, g, c) {
                return A(S, F, U, function(n) {
                    if (n && (n.code === "EMFILE" || n.code === "ENFILE")) fk6([m, [S, F, U, g], n, c || Date.now(), Date.now()]);
                    else if (typeof g === "function") g.apply(this, arguments)
                })
            }
        }
        var w = q.copyFile;
        if (w) q.copyFile = $;

        function $(h, C, x, B) {
            if (typeof x === "function") B = x, x = 0;
            return m(h, C, x, B);

            function m(S, F, U, g, c) {
                return w(S, F, U, function(n) {
                    if (n && (n.code === "EMFILE" || n.code === "ENFILE")) fk6([m, [S, F, U, g], n, c || Date.now(), Date.now()]);
                    else if (typeof g === "function") g.apply(this, arguments)
                })
            }
        }
        var j = q.readdir;
        q.readdir = J;
        var H = /^v[0-5]\./;

        function J(h, C, x) {
            if (typeof C === "function") x = C, C = null;
            var B = H.test(process.version) ? function(F, U, g, c) {
                return j(F, m(F, U, g, c))
            } : function(F, U, g, c) {
                return j(F, U, m(F, U, g, c))
            };
            return B(h, C, x);

            function m(S, F, U, g) {
                return function(c, n) {
                    if (c && (c.code === "EMFILE" || c.code === "ENFILE")) fk6([B, [S, F, U], c, g || Date.now(), Date.now()]);
                    else {
                        if (n && n.sort) n.sort();
                        if (typeof U === "function") U.call(this, c, n)
                    }
                }
            }
        }
        if (process.version.substr(0, 4) === "v0.8") {
            var X = Kw_(q);
            Z = X.ReadStream, f = X.WriteStream
        }
        var M = q.ReadStream;
        if (M) Z.prototype = Object.create(M.prototype), Z.prototype.open = G;
        var P = q.WriteStream;
        if (P) f.prototype = Object.create(P.prototype), f.prototype.open = v;
        Object.defineProperty(q, "ReadStream", {
            get: function() {
                return Z
            },
            set: function(h) {
                Z = h
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(q, "WriteStream", {
            get: function() {
                return f
            },
            set: function(h) {
                f = h
            },
            enumerable: !0,
            configurable: !0
        });
        var W = Z;
        Object.defineProperty(q, "FileReadStream", {
            get: function() {
                return W
            },
            set: function(h) {
                W = h
            },
            enumerable: !0,
            configurable: !0
        });
        var D = f;
        Object.defineProperty(q, "FileWriteStream", {
            get: function() {
                return D
            },
            set: function(h) {
                D = h
            },
            enumerable: !0,
            configurable: !0
        });

        function Z(h, C) {
            if (this instanceof Z) return M.apply(this, arguments), this;
            else return Z.apply(Object.create(Z.prototype), arguments)
        }

        function G() {
            var h = this;
            R(h.path, h.flags, h.mode, function(C, x) {
                if (C) {
                    if (h.autoClose) h.destroy();
                    h.emit("error", C)
                } else h.fd = x, h.emit("open", x), h.read()
            })
        }

        function f(h, C) {
            if (this instanceof f) return P.apply(this, arguments), this;
            else return f.apply(Object.create(f.prototype), arguments)
        }

        function v() {
            var h = this;
            R(h.path, h.flags, h.mode, function(C, x) {
                if (C) h.destroy(), h.emit("error", C);
                else h.fd = x, h.emit("open", x)
            })
        }

        function V(h, C) {
            return new q.ReadStream(h, C)
        }

        function k(h, C) {
            return new q.WriteStream(h, C)
        }
        var N = q.open;
        q.open = R;

        function R(h, C, x, B) {
            if (typeof x === "function") B = x, x = null;
            return m(h, C, x, B);

            function m(S, F, U, g, c) {
                return N(S, F, U, function(n, l) {
                    if (n && (n.code === "EMFILE" || n.code === "ENFILE")) fk6([m, [S, F, U, g], n, c || Date.now(), Date.now()]);
                    else if (typeof g === "function") g.apply(this, arguments)
                })
            }
        }
        return q
    }

    function fk6(q) {
        S26("ENQUEUE", q[0].name, q[1]), $J[Gf].push(q), TR1()
    }
    var TV8;

    function sgq() {
        var q = Date.now();
        for (var K = 0; K < $J[Gf].length; ++K)
            if ($J[Gf][K].length > 2) $J[Gf][K][3] = q, $J[Gf][K][4] = q;
        TR1()
    }

    function TR1() {
        if (clearTimeout(TV8), TV8 = void 0, $J[Gf].length === 0) return;
        var q = $J[Gf].shift(),
            K = q[0],
            _ = q[1],
            z = q[2],
            Y = q[3],
            A = q[4];
        if (Y === void 0) S26("RETRY", K.name, _), K.apply(null, _);
        else if (Date.now() - Y >= 60000) {
            S26("TIMEOUT", K.name, _);
            var O = _.pop();
            if (typeof O === "function") O.call(null, z)
        } else {
            var w = Date.now() - A,
                $ = Math.max(A - Y, 1),
                j = Math.min($ * 1.2, 100);
            if (w >= j) S26("RETRY", K.name, _), K.apply(null, _.concat([Y]));
            else $J[Gf].push(q)
        }
        if (TV8 === void 0) TV8 = setTimeout(TR1, 0)
    }
})
// @from(Ln 156581, Col 4)
qUq = p((BQO, egq) => {
    function wI(q, K) {
        if (typeof K === "boolean") K = {
            forever: K
        };
        if (this._originalTimeouts = JSON.parse(JSON.stringify(q)), this._timeouts = q, this._options = K || {}, this._maxRetryTime = K && K.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._options.forever) this._cachedTimeouts = this._timeouts.slice(0)
    }
    egq.exports = wI;
    wI.prototype.reset = function() {
        this._attempts = 1, this._timeouts = this._originalTimeouts
    };
    wI.prototype.stop = function() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeouts = [], this._cachedTimeouts = null
    };
    wI.prototype.retry = function(q) {
        if (this._timeout) clearTimeout(this._timeout);
        if (!q) return !1;
        var K = new Date().getTime();
        if (q && K - this._operationStart >= this._maxRetryTime) return this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
        this._errors.push(q);
        var _ = this._timeouts.shift();
        if (_ === void 0)
            if (this._cachedTimeouts) this._errors.splice(this._errors.length - 1, this._errors.length), this._timeouts = this._cachedTimeouts.slice(0), _ = this._timeouts.shift();
            else return !1;
        var z = this,
            Y = setTimeout(function() {
                if (z._attempts++, z._operationTimeoutCb) {
                    if (z._timeout = setTimeout(function() {
                            z._operationTimeoutCb(z._attempts)
                        }, z._operationTimeout), z._options.unref) z._timeout.unref()
                }
                z._fn(z._attempts)
            }, _);
        if (this._options.unref) Y.unref();
        return !0
    };
    wI.prototype.attempt = function(q, K) {
        if (this._fn = q, K) {
            if (K.timeout) this._operationTimeout = K.timeout;
            if (K.cb) this._operationTimeoutCb = K.cb
        }
        var _ = this;
        if (this._operationTimeoutCb) this._timeout = setTimeout(function() {
            _._operationTimeoutCb()
        }, _._operationTimeout);
        this._operationStart = new Date().getTime(), this._fn(this._attempts)
    };
    wI.prototype.try = function(q) {
        console.log("Using RetryOperation.try() is deprecated"), this.attempt(q)
    };
    wI.prototype.start = function(q) {
        console.log("Using RetryOperation.start() is deprecated"), this.attempt(q)
    };
    wI.prototype.start = wI.prototype.try;
    wI.prototype.errors = function() {
        return this._errors
    };
    wI.prototype.attempts = function() {
        return this._attempts
    };
    wI.prototype.mainError = function() {
        if (this._errors.length === 0) return null;
        var q = {},
            K = null,
            _ = 0;
        for (var z = 0; z < this._errors.length; z++) {
            var Y = this._errors[z],
                A = Y.message,
                O = (q[A] || 0) + 1;
            if (q[A] = O, O >= _) K = Y, _ = O
        }
        return K
    }
})
// @from(Ln 156656, Col 4)
_Uq = p((Aw_) => {
    var Yw_ = qUq();
    Aw_.operation = function(q) {
        var K = Aw_.timeouts(q);
        return new Yw_(K, {
            forever: q && q.forever,
            unref: q && q.unref,
            maxRetryTime: q && q.maxRetryTime
        })
    };
    Aw_.timeouts = function(q) {
        if (q instanceof Array) return [].concat(q);
        var K = {
            retries: 10,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 1 / 0,
            randomize: !1
        };
        for (var _ in q) K[_] = q[_];
        if (K.minTimeout > K.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
        var z = [];
        for (var Y = 0; Y < K.retries; Y++) z.push(this.createTimeout(Y, K));
        if (q && q.forever && !z.length) z.push(this.createTimeout(Y, K));
        return z.sort(function(A, O) {
            return A - O
        }), z
    };
    Aw_.createTimeout = function(q, K) {
        var _ = K.randomize ? Math.random() + 1 : 1,
            z = Math.round(_ * K.minTimeout * Math.pow(K.factor, q));
        return z = Math.min(z, K.maxTimeout), z
    };
    Aw_.wrap = function(q, K, _) {
        if (K instanceof Array) _ = K, K = null;
        if (!_) {
            _ = [];
            for (var z in q)
                if (typeof q[z] === "function") _.push(z)
        }
        for (var Y = 0; Y < _.length; Y++) {
            var A = _[Y],
                O = q[A];
            q[A] = function($) {
                var j = Aw_.operation(K),
                    H = Array.prototype.slice.call(arguments, 1),
                    J = H.pop();
                H.push(function(X) {
                    if (j.retry(X)) return;
                    if (X) arguments[0] = j.mainError();
                    J.apply(this, arguments)
                }), j.attempt(function() {
                    $.apply(q, H)
                })
            }.bind(q, O), q[A].options = K
        }
    }
})
// @from(Ln 156714, Col 4)
zUq = p((FQO, kV8) => {
    kV8.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
    if (process.platform !== "win32") kV8.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    if (process.platform === "linux") kV8.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED")
})
// @from(Ln 156719, Col 4)
YUq = p((gQO, vk6) => {
    var AH = global.process,
        C26 = function(q) {
            return q && typeof q === "object" && typeof q.removeListener === "function" && typeof q.emit === "function" && typeof q.reallyExit === "function" && typeof q.listeners === "function" && typeof q.kill === "function" && typeof q.pid === "number" && typeof q.on === "function"
        };
    if (!C26(AH)) vk6.exports = function() {
        return function() {}
    };
    else {
        if (kR1 = d6("assert"), b26 = zUq(), NR1 = /^win/i.test(AH.platform), Gk6 = d6("events"), typeof Gk6 !== "function") Gk6 = Gk6.EventEmitter;
        if (AH.__signal_exit_emitter__) UW = AH.__signal_exit_emitter__;
        else UW = AH.__signal_exit_emitter__ = new Gk6, UW.count = 0, UW.emitted = {};
        if (!UW.infinite) UW.setMaxListeners(1 / 0), UW.infinite = !0;
        vk6.exports = function(q, K) {
            if (!C26(global.process)) return function() {};
            if (kR1.equal(typeof q, "function", "a callback must be provided for exit handler"), I26 === !1) NV8();
            var _ = "exit";
            if (K && K.alwaysLast) _ = "afterexit";
            var z = function() {
                if (UW.removeListener(_, q), UW.listeners("exit").length === 0 && UW.listeners("afterexit").length === 0) Wo6()
            };
            return UW.on(_, q), z
        }, Wo6 = function() {
            if (!I26 || !C26(global.process)) return;
            I26 = !1, b26.forEach(function(K) {
                try {
                    AH.removeListener(K, Do6[K])
                } catch (_) {}
            }), AH.emit = Zo6, AH.reallyExit = EV8, UW.count -= 1
        }, vk6.exports.unload = Wo6, q46 = function(K, _, z) {
            if (UW.emitted[K]) return;
            UW.emitted[K] = !0, UW.emit(K, _, z)
        }, Do6 = {}, b26.forEach(function(q) {
            Do6[q] = function() {
                if (!C26(global.process)) return;
                var _ = AH.listeners(q);
                if (_.length === UW.count) {
                    if (Wo6(), q46("exit", null, q), q46("afterexit", null, q), NR1 && q === "SIGHUP") q = "SIGINT";
                    AH.kill(AH.pid, q)
                }
            }
        }), vk6.exports.signals = function() {
            return b26
        }, I26 = !1, NV8 = function() {
            if (I26 || !C26(global.process)) return;
            I26 = !0, UW.count += 1, b26 = b26.filter(function(K) {
                try {
                    return AH.on(K, Do6[K]), !0
                } catch (_) {
                    return !1
                }
            }), AH.emit = yR1, AH.reallyExit = ER1
        }, vk6.exports.load = NV8, EV8 = AH.reallyExit, ER1 = function(K) {
            if (!C26(global.process)) return;
            AH.exitCode = K || 0, q46("exit", AH.exitCode, null), q46("afterexit", AH.exitCode, null), EV8.call(AH, AH.exitCode)
        }, Zo6 = AH.emit, yR1 = function(K, _) {
            if (K === "exit" && C26(global.process)) {
                if (_ !== void 0) AH.exitCode = _;
                var z = Zo6.apply(this, arguments);
                return q46("exit", AH.exitCode, null), q46("afterexit", AH.exitCode, null), z
            } else return Zo6.apply(this, arguments)
        }
    }
    var kR1, b26, NR1, Gk6, UW, Wo6, q46, Do6, I26, NV8, EV8, ER1, Zo6, yR1
})
// @from(Ln 156784, Col 4)
OUq = p((Jw_, LR1) => {
    var AUq = Symbol();

    function jw_(q, K, _) {
        let z = K[AUq];
        if (z) return K.stat(q, (A, O) => {
            if (A) return _(A);
            _(null, O.mtime, z)
        });
        let Y = new Date(Math.ceil(Date.now() / 1000) * 1000 + 5);
        K.utimes(q, Y, Y, (A) => {
            if (A) return _(A);
            K.stat(q, (O, w) => {
                if (O) return _(O);
                let $ = w.mtime.getTime() % 1000 === 0 ? "s" : "ms";
                Object.defineProperty(K, AUq, {
                    value: $
                }), _(null, w.mtime, $)
            })
        })
    }

    function Hw_(q) {
        let K = Date.now();
        if (q === "s") K = Math.ceil(K / 1000) * 1000;
        return new Date(K)
    }
    Jw_.probe = jw_;
    Jw_.getMtime = Hw_
})
// @from(Ln 156814, Col 4)
JUq = p((vw_, Go6) => {
    var Pw_ = d6("path"),
        SR1 = lO(),
        Ww_ = _Uq(),
        Dw_ = YUq(),
        wUq = OUq(),
        Ha = {};

    function fo6(q, K) {
        return K.lockfilePath || `${q}.lock`
    }

    function CR1(q, K, _) {
        if (!K.realpath) return _(null, Pw_.resolve(q));
        K.fs.realpath(q, _)
    }

    function RR1(q, K, _) {
        let z = fo6(q, K);
        K.fs.mkdir(z, (Y) => {
            if (!Y) return wUq.probe(z, K.fs, (A, O, w) => {
                if (A) return K.fs.rmdir(z, () => {}), _(A);
                _(null, O, w)
            });
            if (Y.code !== "EEXIST") return _(Y);
            if (K.stale <= 0) return _(Object.assign(Error("Lock file is already being held"), {
                code: "ELOCKED",
                file: q
            }));
            K.fs.stat(z, (A, O) => {
                if (A) {
                    if (A.code === "ENOENT") return RR1(q, {
                        ...K,
                        stale: 0
                    }, _);
                    return _(A)
                }
                if (!$Uq(O, K)) return _(Object.assign(Error("Lock file is already being held"), {
                    code: "ELOCKED",
                    file: q
                }));
                jUq(q, K, (w) => {
                    if (w) return _(w);
                    RR1(q, {
                        ...K,
                        stale: 0
                    }, _)
                })
            })
        })
    }

    function $Uq(q, K) {
        return q.mtime.getTime() < Date.now() - K.stale
    }

    function jUq(q, K, _) {
        K.fs.rmdir(fo6(q, K), (z) => {
            if (z && z.code !== "ENOENT") return _(z);
            _()
        })
    }

    function yV8(q, K) {
        let _ = Ha[q];
        if (_.updateTimeout) return;
        if (_.updateDelay = _.updateDelay || K.update, _.updateTimeout = setTimeout(() => {
                _.updateTimeout = null, K.fs.stat(_.lockfilePath, (z, Y) => {
                    let A = _.lastUpdate + K.stale < Date.now();
                    if (z) {
                        if (z.code === "ENOENT" || A) return hR1(q, _, Object.assign(z, {
                            code: "ECOMPROMISED"
                        }));
                        return _.updateDelay = 1000, yV8(q, K)
                    }
                    if (_.mtime.getTime() !== Y.mtime.getTime()) return hR1(q, _, Object.assign(Error("Unable to update lock within the stale threshold"), {
                        code: "ECOMPROMISED"
                    }));
                    let w = wUq.getMtime(_.mtimePrecision);
                    K.fs.utimes(_.lockfilePath, w, w, ($) => {
                        let j = _.lastUpdate + K.stale < Date.now();
                        if (_.released) return;
                        if ($) {
                            if ($.code === "ENOENT" || j) return hR1(q, _, Object.assign($, {
                                code: "ECOMPROMISED"
                            }));
                            return _.updateDelay = 1000, yV8(q, K)
                        }
                        _.mtime = w, _.lastUpdate = Date.now(), _.updateDelay = null, yV8(q, K)
                    })
                })
            }, _.updateDelay), _.updateTimeout.unref) _.updateTimeout.unref()
    }

    function hR1(q, K, _) {
        if (K.released = !0, K.updateTimeout) clearTimeout(K.updateTimeout);
        if (Ha[q] === K) delete Ha[q];
        K.options.onCompromised(_)
    }

    function Zw_(q, K, _) {
        K = {
            stale: 1e4,
            update: null,
            realpath: !0,
            retries: 0,
            fs: SR1,
            onCompromised: (z) => {
                throw z
            },
            ...K
        }, K.retries = K.retries || 0, K.retries = typeof K.retries === "number" ? {
            retries: K.retries
        } : K.retries, K.stale = Math.max(K.stale || 0, 2000), K.update = K.update == null ? K.stale / 2 : K.update || 0, K.update = Math.max(Math.min(K.update, K.stale / 2), 1000), CR1(q, K, (z, Y) => {
            if (z) return _(z);
            let A = Ww_.operation(K.retries);
            A.attempt(() => {
                RR1(Y, K, (O, w, $) => {
                    if (A.retry(O)) return;
                    if (O) return _(A.mainError());
                    let j = Ha[Y] = {
                        lockfilePath: fo6(Y, K),
                        mtime: w,
                        mtimePrecision: $,
                        options: K,
                        lastUpdate: Date.now()
                    };
                    yV8(Y, K), _(null, (H) => {
                        if (j.released) return H && H(Object.assign(Error("Lock is already released"), {
                            code: "ERELEASED"
                        }));
                        HUq(Y, {
                            ...K,
                            realpath: !1
                        }, H)
                    })
                })
            })
        })
    }

    function HUq(q, K, _) {
        K = {
            fs: SR1,
            realpath: !0,
            ...K
        }, CR1(q, K, (z, Y) => {
            if (z) return _(z);
            let A = Ha[Y];
            if (!A) return _(Object.assign(Error("Lock is not acquired/owned by you"), {
                code: "ENOTACQUIRED"
            }));
            A.updateTimeout && clearTimeout(A.updateTimeout), A.released = !0, delete Ha[Y], jUq(Y, K, _)
        })
    }

    function fw_(q, K, _) {
        K = {
            stale: 1e4,
            realpath: !0,
            fs: SR1,
            ...K
        }, K.stale = Math.max(K.stale || 0, 2000), CR1(q, K, (z, Y) => {
            if (z) return _(z);
            K.fs.stat(fo6(Y, K), (A, O) => {
                if (A) return A.code === "ENOENT" ? _(null, !1) : _(A);
                return _(null, !$Uq(O, K))
            })
        })
    }

    function Gw_() {
        return Ha
    }
    Dw_(() => {
        for (let q in Ha) {
            let K = Ha[q].options;
            try {
                K.fs.rmdirSync(fo6(q, K))
            } catch (_) {}
        }
    });
    vw_.lock = Zw_;
    vw_.unlock = HUq;
    vw_.check = fw_;
    vw_.getLocks = Gw_
})