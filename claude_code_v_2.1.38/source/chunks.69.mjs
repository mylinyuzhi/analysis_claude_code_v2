
// @from(Ln 185755, Col 4)
n41 = R((mG7) => {
    Object.defineProperty(mG7, "__esModule", {
        value: !0
    });
    mG7.OAuth2Client = mG7.ClientAuthentication = mG7.CertificateFormat = mG7.CodeChallengeMethod = void 0;
    var bt5 = bS(),
        HwA = h1("querystring"),
        ut5 = h1("stream"),
        Bt5 = XY6(),
        $wA = FX1(),
        mt5 = lu(),
        Ft5 = wwA(),
        BG7;
    (function(A) {
        A.Plain = "plain", A.S256 = "S256"
    })(BG7 || (mG7.CodeChallengeMethod = BG7 = {}));
    var uU;
    (function(A) {
        A.PEM = "PEM", A.JWK = "JWK"
    })(uU || (mG7.CertificateFormat = uU = {}));
    var cI1;
    (function(A) {
        A.ClientSecretPost = "ClientSecretPost", A.ClientSecretBasic = "ClientSecretBasic", A.None = "None"
    })(cI1 || (mG7.ClientAuthentication = cI1 = {}));
    class wZ extends mt5.AuthClient {
        constructor(A, q, K) {
            let Y = A && typeof A === "object" ? A : {
                clientId: A,
                clientSecret: q,
                redirectUri: K
            };
            super(Y);
            this.certificateCache = {}, this.certificateExpiry = null, this.certificateCacheFormat = uU.PEM, this.refreshTokenPromises = new Map, this._clientId = Y.clientId, this._clientSecret = Y.clientSecret, this.redirectUri = Y.redirectUri, this.endpoints = {
                tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
                oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
                oauth2TokenUrl: "https://oauth2.googleapis.com/token",
                oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
                oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
                oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
                oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
                ...Y.endpoints
            }, this.clientAuthentication = Y.clientAuthentication || cI1.ClientSecretPost, this.issuers = Y.issuers || ["accounts.google.com", "https://accounts.google.com", this.universeDomain]
        }
        generateAuthUrl(A = {}) {
            if (A.code_challenge_method && !A.code_challenge) throw Error("If a code_challenge_method is provided, code_challenge must be included.");
            if (A.response_type = A.response_type || "code", A.client_id = A.client_id || this._clientId, A.redirect_uri = A.redirect_uri || this.redirectUri, Array.isArray(A.scope)) A.scope = A.scope.join(" ");
            return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + HwA.stringify(A)
        }
        generateCodeVerifier() {
            throw Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.")
        }
        async generateCodeVerifierAsync() {
            let A = (0, $wA.createCrypto)(),
                K = A.randomBytesBase64(96).replace(/\+/g, "~").replace(/=/g, "_").replace(/\//g, "-"),
                z = (await A.sha256DigestBase64(K)).split("=")[0].replace(/\+/g, "-").replace(/\//g, "_");
            return {
                codeVerifier: K,
                codeChallenge: z
            }
        }
        getToken(A, q) {
            let K = typeof A === "string" ? {
                code: A
            } : A;
            if (q) this.getTokenAsync(K).then((Y) => q(null, Y.tokens, Y.res), (Y) => q(Y, null, Y.response));
            else return this.getTokenAsync(K)
        }
        async getTokenAsync(A) {
            let q = this.endpoints.oauth2TokenUrl.toString(),
                K = {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                Y = {
                    client_id: A.client_id || this._clientId,
                    code_verifier: A.codeVerifier,
                    code: A.code,
                    grant_type: "authorization_code",
                    redirect_uri: A.redirect_uri || this.redirectUri
                };
            if (this.clientAuthentication === cI1.ClientSecretBasic) {
                let H = Buffer.from(`${this._clientId}:${this._clientSecret}`);
                K.Authorization = `Basic ${H.toString("base64")}`
            }
            if (this.clientAuthentication === cI1.ClientSecretPost) Y.client_secret = this._clientSecret;
            let z = await this.transporter.request({
                    ...wZ.RETRY_CONFIG,
                    method: "POST",
                    url: q,
                    data: HwA.stringify(Y),
                    headers: K
                }),
                w = z.data;
            if (z.data && z.data.expires_in) w.expiry_date = new Date().getTime() + z.data.expires_in * 1000, delete w.expires_in;
            return this.emit("tokens", w), {
                tokens: w,
                res: z
            }
        }
        async refreshToken(A) {
            if (!A) return this.refreshTokenNoCache(A);
            if (this.refreshTokenPromises.has(A)) return this.refreshTokenPromises.get(A);
            let q = this.refreshTokenNoCache(A).then((K) => {
                return this.refreshTokenPromises.delete(A), K
            }, (K) => {
                throw this.refreshTokenPromises.delete(A), K
            });
            return this.refreshTokenPromises.set(A, q), q
        }
        async refreshTokenNoCache(A) {
            var q;
            if (!A) throw Error("No refresh token is set.");
            let K = this.endpoints.oauth2TokenUrl.toString(),
                Y = {
                    refresh_token: A,
                    client_id: this._clientId,
                    client_secret: this._clientSecret,
                    grant_type: "refresh_token"
                },
                z;
            try {
                z = await this.transporter.request({
                    ...wZ.RETRY_CONFIG,
                    method: "POST",
                    url: K,
                    data: HwA.stringify(Y),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            } catch (H) {
                if (H instanceof bt5.GaxiosError && H.message === "invalid_grant" && ((q = H.response) === null || q === void 0 ? void 0 : q.data) && /ReAuth/i.test(H.response.data.error_description)) H.message = JSON.stringify(H.response.data);
                throw H
            }
            let w = z.data;
            if (z.data && z.data.expires_in) w.expiry_date = new Date().getTime() + z.data.expires_in * 1000, delete w.expires_in;
            return this.emit("tokens", w), {
                tokens: w,
                res: z
            }
        }
        refreshAccessToken(A) {
            if (A) this.refreshAccessTokenAsync().then((q) => A(null, q.credentials, q.res), A);
            else return this.refreshAccessTokenAsync()
        }
        async refreshAccessTokenAsync() {
            let A = await this.refreshToken(this.credentials.refresh_token),
                q = A.tokens;
            return q.refresh_token = this.credentials.refresh_token, this.credentials = q, {
                credentials: this.credentials,
                res: A.res
            }
        }
        getAccessToken(A) {
            if (A) this.getAccessTokenAsync().then((q) => A(null, q.token, q.res), A);
            else return this.getAccessTokenAsync()
        }
        async getAccessTokenAsync() {
            if (!this.credentials.access_token || this.isTokenExpiring()) {
                if (!this.credentials.refresh_token)
                    if (this.refreshHandler) {
                        let K = await this.processAndValidateRefreshHandler();
                        if (K === null || K === void 0 ? void 0 : K.access_token) return this.setCredentials(K), {
                            token: this.credentials.access_token
                        }
                    } else throw Error("No refresh token or refresh handler callback is set.");
                let q = await this.refreshAccessTokenAsync();
                if (!q.credentials || q.credentials && !q.credentials.access_token) throw Error("Could not refresh access token.");
                return {
                    token: q.credentials.access_token,
                    res: q.res
                }
            } else return {
                token: this.credentials.access_token
            }
        }
        async getRequestHeaders(A) {
            return (await this.getRequestMetadataAsync(A)).headers
        }
        async getRequestMetadataAsync(A) {
            let q = this.credentials;
            if (!q.access_token && !q.refresh_token && !this.apiKey && !this.refreshHandler) throw Error("No access, refresh token, API key or refresh handler callback is set.");
            if (q.access_token && !this.isTokenExpiring()) {
                q.token_type = q.token_type || "Bearer";
                let H = {
                    Authorization: q.token_type + " " + q.access_token
                };
                return {
                    headers: this.addSharedMetadataHeaders(H)
                }
            }
            if (this.refreshHandler) {
                let H = await this.processAndValidateRefreshHandler();
                if (H === null || H === void 0 ? void 0 : H.access_token) {
                    this.setCredentials(H);
                    let $ = {
                        Authorization: "Bearer " + this.credentials.access_token
                    };
                    return {
                        headers: this.addSharedMetadataHeaders($)
                    }
                }
            }
            if (this.apiKey) return {
                headers: {
                    "X-Goog-Api-Key": this.apiKey
                }
            };
            let K = null,
                Y = null;
            try {
                K = await this.refreshToken(q.refresh_token), Y = K.tokens
            } catch (H) {
                let $ = H;
                if ($.response && ($.response.status === 403 || $.response.status === 404)) $.message = `Could not refresh access token: ${$.message}`;
                throw $
            }
            let z = this.credentials;
            z.token_type = z.token_type || "Bearer", Y.refresh_token = z.refresh_token, this.credentials = Y;
            let w = {
                Authorization: z.token_type + " " + Y.access_token
            };
            return {
                headers: this.addSharedMetadataHeaders(w),
                res: K.res
            }
        }
        static getRevokeTokenUrl(A) {
            return new wZ().getRevokeTokenURL(A).toString()
        }
        getRevokeTokenURL(A) {
            let q = new URL(this.endpoints.oauth2RevokeUrl);
            return q.searchParams.append("token", A), q
        }
        revokeToken(A, q) {
            let K = {
                ...wZ.RETRY_CONFIG,
                url: this.getRevokeTokenURL(A).toString(),
                method: "POST"
            };
            if (q) this.transporter.request(K).then((Y) => q(null, Y), q);
            else return this.transporter.request(K)
        }
        revokeCredentials(A) {
            if (A) this.revokeCredentialsAsync().then((q) => A(null, q), A);
            else return this.revokeCredentialsAsync()
        }
        async revokeCredentialsAsync() {
            let A = this.credentials.access_token;
            if (this.credentials = {}, A) return this.revokeToken(A);
            else throw Error("No access token to revoke.")
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
                let Y = await this.getRequestMetadataAsync(A.url);
                if (A.headers = A.headers || {}, Y.headers && Y.headers["x-goog-user-project"]) A.headers["x-goog-user-project"] = Y.headers["x-goog-user-project"];
                if (Y.headers && Y.headers.Authorization) A.headers.Authorization = Y.headers.Authorization;
                if (this.apiKey) A.headers["X-Goog-Api-Key"] = this.apiKey;
                K = await this.transporter.request(A)
            } catch (Y) {
                let z = Y.response;
                if (z) {
                    let w = z.status,
                        H = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure),
                        $ = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler,
                        O = z.config.data instanceof ut5.Readable,
                        _ = w === 401 || w === 403;
                    if (!q && _ && !O && H) return await this.refreshAccessTokenAsync(), this.requestAsync(A, !0);
                    else if (!q && _ && !O && $) {
                        let J = await this.processAndValidateRefreshHandler();
                        if (J === null || J === void 0 ? void 0 : J.access_token) this.setCredentials(J);
                        return this.requestAsync(A, !0)
                    }
                }
                throw Y
            }
            return K
        }
        verifyIdToken(A, q) {
            if (q && typeof q !== "function") throw Error("This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.");
            if (q) this.verifyIdTokenAsync(A).then((K) => q(null, K), q);
            else return this.verifyIdTokenAsync(A)
        }
        async verifyIdTokenAsync(A) {
            if (!A.idToken) throw Error("The verifyIdToken method requires an ID Token");
            let q = await this.getFederatedSignonCertsAsync();
            return await this.verifySignedJwtWithCertsAsync(A.idToken, q.certs, A.audience, this.issuers, A.maxExpiry)
        }
        async getTokenInfo(A) {
            let {
                data: q
            } = await this.transporter.request({
                ...wZ.RETRY_CONFIG,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${A}`
                },
                url: this.endpoints.tokenInfoUrl.toString()
            }), K = Object.assign({
                expiry_date: new Date().getTime() + q.expires_in * 1000,
                scopes: q.scope.split(" ")
            }, q);
            return delete K.expires_in, delete K.scope, K
        }
        getFederatedSignonCerts(A) {
            if (A) this.getFederatedSignonCertsAsync().then((q) => A(null, q.certs, q.res), A);
            else return this.getFederatedSignonCertsAsync()
        }
        async getFederatedSignonCertsAsync() {
            let A = new Date().getTime(),
                q = (0, $wA.hasBrowserCrypto)() ? uU.JWK : uU.PEM;
            if (this.certificateExpiry && A < this.certificateExpiry.getTime() && this.certificateCacheFormat === q) return {
                certs: this.certificateCache,
                format: q
            };
            let K, Y;
            switch (q) {
                case uU.PEM:
                    Y = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
                    break;
                case uU.JWK:
                    Y = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
                    break;
                default:
                    throw Error(`Unsupported certificate format ${q}`)
            }
            try {
                K = await this.transporter.request({
                    ...wZ.RETRY_CONFIG,
                    url: Y
                })
            } catch (O) {
                if (O instanceof Error) O.message = `Failed to retrieve verification certificates: ${O.message}`;
                throw O
            }
            let z = K ? K.headers["cache-control"] : void 0,
                w = -1;
            if (z) {
                let _ = new RegExp("max-age=([0-9]*)").exec(z);
                if (_ && _.length === 2) w = Number(_[1]) * 1000
            }
            let H = {};
            switch (q) {
                case uU.PEM:
                    H = K.data;
                    break;
                case uU.JWK:
                    for (let O of K.data.keys) H[O.kid] = O;
                    break;
                default:
                    throw Error(`Unsupported certificate format ${q}`)
            }
            let $ = new Date;
            return this.certificateExpiry = w === -1 ? null : new Date($.getTime() + w), this.certificateCache = H, this.certificateCacheFormat = q, {
                certs: H,
                format: q,
                res: K
            }
        }
        getIapPublicKeys(A) {
            if (A) this.getIapPublicKeysAsync().then((q) => A(null, q.pubkeys, q.res), A);
            else return this.getIapPublicKeysAsync()
        }
        async getIapPublicKeysAsync() {
            let A, q = this.endpoints.oauth2IapPublicKeyUrl.toString();
            try {
                A = await this.transporter.request({
                    ...wZ.RETRY_CONFIG,
                    url: q
                })
            } catch (K) {
                if (K instanceof Error) K.message = `Failed to retrieve verification certificates: ${K.message}`;
                throw K
            }
            return {
                pubkeys: A.data,
                res: A
            }
        }
        verifySignedJwtWithCerts() {
            throw Error("verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.")
        }
        async verifySignedJwtWithCertsAsync(A, q, K, Y, z) {
            let w = (0, $wA.createCrypto)();
            if (!z) z = wZ.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
            let H = A.split(".");
            if (H.length !== 3) throw Error("Wrong number of segments in token: " + A);
            let $ = H[0] + "." + H[1],
                O = H[2],
                _, J;
            try {
                _ = JSON.parse(w.decodeBase64StringUtf8(H[0]))
            } catch (f) {
                if (f instanceof Error) f.message = `Can't parse token envelope: ${H[0]}': ${f.message}`;
                throw f
            }
            if (!_) throw Error("Can't parse token envelope: " + H[0]);
            try {
                J = JSON.parse(w.decodeBase64StringUtf8(H[1]))
            } catch (f) {
                if (f instanceof Error) f.message = `Can't parse token payload '${H[0]}`;
                throw f
            }
            if (!J) throw Error("Can't parse token payload: " + H[1]);
            if (!Object.prototype.hasOwnProperty.call(q, _.kid)) throw Error("No pem found for envelope: " + JSON.stringify(_));
            let X = q[_.kid];
            if (_.alg === "ES256") O = Bt5.joseToDer(O, "ES256").toString("base64");
            if (!await w.verify(X, $, O)) throw Error("Invalid token signature: " + A);
            if (!J.iat) throw Error("No issue time in token: " + JSON.stringify(J));
            if (!J.exp) throw Error("No expiration time in token: " + JSON.stringify(J));
            let j = Number(J.iat);
            if (isNaN(j)) throw Error("iat field using invalid format");
            let M = Number(J.exp);
            if (isNaN(M)) throw Error("exp field using invalid format");
            let P = new Date().getTime() / 1000;
            if (M >= P + z) throw Error("Expiration time too far in future: " + JSON.stringify(J));
            let W = j - wZ.CLOCK_SKEW_SECS_,
                G = M + wZ.CLOCK_SKEW_SECS_;
            if (P < W) throw Error("Token used too early, " + P + " < " + W + ": " + JSON.stringify(J));
            if (P > G) throw Error("Token used too late, " + P + " > " + G + ": " + JSON.stringify(J));
            if (Y && Y.indexOf(J.iss) < 0) throw Error("Invalid issuer, expected one of [" + Y + "], but got " + J.iss);
            if (typeof K < "u" && K !== null) {
                let f = J.aud,
                    Z = !1;
                if (K.constructor === Array) Z = K.indexOf(f) > -1;
                else Z = f === K;
                if (!Z) throw Error("Wrong recipient, payload audience != requiredAudience")
            }
            return new Ft5.LoginTicket(_, J)
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
    mG7.OAuth2Client = wZ;
    wZ.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
    wZ.CLOCK_SKEW_SECS_ = 300;
    wZ.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400
})
// @from(Ln 186210, Col 4)
OwA = R((UG7) => {
    Object.defineProperty(UG7, "__esModule", {
        value: !0
    });
    UG7.Compute = void 0;
    var pt5 = bS(),
        QG7 = UI1(),
        dt5 = n41();
    class gG7 extends dt5.OAuth2Client {
        constructor(A = {}) {
            super(A);
            this.credentials = {
                expiry_date: 1,
                refresh_token: "compute-placeholder"
            }, this.serviceAccountEmail = A.serviceAccountEmail || "default", this.scopes = Array.isArray(A.scopes) ? A.scopes : A.scopes ? [A.scopes] : []
        }
        async refreshTokenNoCache(A) {
            let q = `service-accounts/${this.serviceAccountEmail}/token`,
                K;
            try {
                let z = {
                    property: q
                };
                if (this.scopes.length > 0) z.params = {
                    scopes: this.scopes.join(",")
                };
                K = await QG7.instance(z)
            } catch (z) {
                if (z instanceof pt5.GaxiosError) z.message = `Could not refresh access token: ${z.message}`, this.wrapError(z);
                throw z
            }
            let Y = K;
            if (K && K.expires_in) Y.expiry_date = new Date().getTime() + K.expires_in * 1000, delete Y.expires_in;
            return this.emit("tokens", Y), {
                tokens: Y,
                res: null
            }
        }
        async fetchIdToken(A) {
            let q = `service-accounts/${this.serviceAccountEmail}/identity?format=full&audience=${A}`,
                K;
            try {
                let Y = {
                    property: q
                };
                K = await QG7.instance(Y)
            } catch (Y) {
                if (Y instanceof Error) Y.message = `Could not fetch ID token: ${Y.message}`;
                throw Y
            }
            return K
        }
        wrapError(A) {
            let q = A.response;
            if (q && q.status) {
                if (A.status = q.status, q.status === 403) A.message = "A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified: " + A.message;
                else if (q.status === 404) A.message = "A Not Found error was returned while attempting to retrieve an accesstoken for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have any permission scopes specified: " + A.message
            }
        }
    }
    UG7.Compute = gG7
})
// @from(Ln 186272, Col 4)
_wA = R((cG7) => {
    Object.defineProperty(cG7, "__esModule", {
        value: !0
    });
    cG7.IdTokenClient = void 0;
    var ct5 = n41();
    class dG7 extends ct5.OAuth2Client {
        constructor(A) {
            super(A);
            this.targetAudience = A.targetAudience, this.idTokenProvider = A.idTokenProvider
        }
        async getRequestMetadataAsync(A) {
            if (!this.credentials.id_token || !this.credentials.expiry_date || this.isTokenExpiring()) {
                let K = await this.idTokenProvider.fetchIdToken(this.targetAudience);
                this.credentials = {
                    id_token: K,
                    expiry_date: this.getIdTokenExpiryDate(K)
                }
            }
            return {
                headers: {
                    Authorization: "Bearer " + this.credentials.id_token
                }
            }
        }
        getIdTokenExpiryDate(A) {
            let q = A.split(".")[1];
            if (q) return JSON.parse(Buffer.from(q, "base64").toString("ascii")).exp * 1000
        }
    }
    cG7.IdTokenClient = dG7
})
// @from(Ln 186304, Col 4)
JwA = R((nG7) => {
    Object.defineProperty(nG7, "__esModule", {
        value: !0
    });
    nG7.GCPEnv = void 0;
    nG7.clear = lt5;
    nG7.getEnv = it5;
    var iG7 = UI1(),
        BU;
    (function(A) {
        A.APP_ENGINE = "APP_ENGINE", A.KUBERNETES_ENGINE = "KUBERNETES_ENGINE", A.CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS", A.COMPUTE_ENGINE = "COMPUTE_ENGINE", A.CLOUD_RUN = "CLOUD_RUN", A.NONE = "NONE"
    })(BU || (nG7.GCPEnv = BU = {}));
    var lI1;

    function lt5() {
        lI1 = void 0
    }
    async function it5() {
        if (lI1) return lI1;
        return lI1 = nt5(), lI1
    }
    async function nt5() {
        let A = BU.NONE;
        if (rt5()) A = BU.APP_ENGINE;
        else if (ot5()) A = BU.CLOUD_FUNCTIONS;
        else if (await tt5())
            if (await st5()) A = BU.KUBERNETES_ENGINE;
            else if (at5()) A = BU.CLOUD_RUN;
        else A = BU.COMPUTE_ENGINE;
        else A = BU.NONE;
        return A
    }

    function rt5() {
        return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME)
    }

    function ot5() {
        return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET)
    }

    function at5() {
        return !!process.env.K_CONFIGURATION
    }
    async function st5() {
        try {
            return await iG7.instance("attributes/cluster-name"), !0
        } catch (A) {
            return !1
        }
    }
    async function tt5() {
        return iG7.isAvailable()
    }
})
// @from(Ln 186359, Col 4)
XwA = R(($l2, oG7) => {
    var vz6 = mu().Buffer,
        qe5 = h1("stream"),
        Ke5 = h1("util");

    function Ez6(A) {
        if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = vz6.alloc(0), this;
        if (typeof A.pipe === "function") return this.buffer = vz6.alloc(0), A.pipe(this), this;
        if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
            this.emit("end", A), this.readable = !1, this.emit("close")
        }.bind(this)), this;
        throw TypeError("Unexpected data type (" + typeof A + ")")
    }
    Ke5.inherits(Ez6, qe5);
    Ez6.prototype.write = function(q) {
        this.buffer = vz6.concat([this.buffer, vz6.from(q)]), this.emit("data", q)
    };
    Ez6.prototype.end = function(q) {
        if (q) this.write(q);
        this.emit("end", q), this.emit("close"), this.writable = !1, this.readable = !1
    };
    oG7.exports = Ez6
})
// @from(Ln 186382, Col 4)
PwA = R((Ol2, zZ7) => {
    var pX1 = mu().Buffer,
        UL = h1("crypto"),
        sG7 = XY6(),
        aG7 = h1("util"),
        Ye5 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
        iI1 = "secret must be a string or buffer",
        UX1 = "key must be a string or a buffer",
        ze5 = "key must be a string, a buffer or an object",
        jwA = typeof UL.createPublicKey === "function";
    if (jwA) UX1 += " or a KeyObject", iI1 += "or a KeyObject";

    function tG7(A) {
        if (pX1.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (!jwA) throw mS(UX1);
        if (typeof A !== "object") throw mS(UX1);
        if (typeof A.type !== "string") throw mS(UX1);
        if (typeof A.asymmetricKeyType !== "string") throw mS(UX1);
        if (typeof A.export !== "function") throw mS(UX1)
    }

    function eG7(A) {
        if (pX1.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (typeof A === "object") return;
        throw mS(ze5)
    }

    function we5(A) {
        if (pX1.isBuffer(A)) return;
        if (typeof A === "string") return A;
        if (!jwA) throw mS(iI1);
        if (typeof A !== "object") throw mS(iI1);
        if (A.type !== "secret") throw mS(iI1);
        if (typeof A.export !== "function") throw mS(iI1)
    }

    function MwA(A) {
        return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function AZ7(A) {
        A = A.toString();
        var q = 4 - A.length % 4;
        if (q !== 4)
            for (var K = 0; K < q; ++K) A += "=";
        return A.replace(/\-/g, "+").replace(/_/g, "/")
    }

    function mS(A) {
        var q = [].slice.call(arguments, 1),
            K = aG7.format.bind(aG7, A).apply(null, q);
        return TypeError(K)
    }

    function He5(A) {
        return pX1.isBuffer(A) || typeof A === "string"
    }

    function nI1(A) {
        if (!He5(A)) A = JSON.stringify(A);
        return A
    }

    function qZ7(A) {
        return function(K, Y) {
            we5(Y), K = nI1(K);
            var z = UL.createHmac("sha" + A, Y),
                w = (z.update(K), z.digest("base64"));
            return MwA(w)
        }
    }
    var DwA, $e5 = "timingSafeEqual" in UL ? function(q, K) {
        if (q.byteLength !== K.byteLength) return !1;
        return UL.timingSafeEqual(q, K)
    } : function(q, K) {
        if (!DwA) DwA = LYA();
        return DwA(q, K)
    };

    function Oe5(A) {
        return function(K, Y, z) {
            var w = qZ7(A)(K, z);
            return $e5(pX1.from(Y), pX1.from(w))
        }
    }

    function KZ7(A) {
        return function(K, Y) {
            eG7(Y), K = nI1(K);
            var z = UL.createSign("RSA-SHA" + A),
                w = (z.update(K), z.sign(Y, "base64"));
            return MwA(w)
        }
    }

    function YZ7(A) {
        return function(K, Y, z) {
            tG7(z), K = nI1(K), Y = AZ7(Y);
            var w = UL.createVerify("RSA-SHA" + A);
            return w.update(K), w.verify(z, Y, "base64")
        }
    }

    function _e5(A) {
        return function(K, Y) {
            eG7(Y), K = nI1(K);
            var z = UL.createSign("RSA-SHA" + A),
                w = (z.update(K), z.sign({
                    key: Y,
                    padding: UL.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: UL.constants.RSA_PSS_SALTLEN_DIGEST
                }, "base64"));
            return MwA(w)
        }
    }

    function Je5(A) {
        return function(K, Y, z) {
            tG7(z), K = nI1(K), Y = AZ7(Y);
            var w = UL.createVerify("RSA-SHA" + A);
            return w.update(K), w.verify({
                key: z,
                padding: UL.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: UL.constants.RSA_PSS_SALTLEN_DIGEST
            }, Y, "base64")
        }
    }

    function Xe5(A) {
        var q = KZ7(A);
        return function() {
            var Y = q.apply(null, arguments);
            return Y = sG7.derToJose(Y, "ES" + A), Y
        }
    }

    function De5(A) {
        var q = YZ7(A);
        return function(Y, z, w) {
            z = sG7.joseToDer(z, "ES" + A).toString("base64");
            var H = q(Y, z, w);
            return H
        }
    }

    function je5() {
        return function() {
            return ""
        }
    }

    function Me5() {
        return function(q, K) {
            return K === ""
        }
    }
    zZ7.exports = function(q) {
        var K = {
                hs: qZ7,
                rs: KZ7,
                ps: _e5,
                es: Xe5,
                none: je5
            },
            Y = {
                hs: Oe5,
                rs: YZ7,
                ps: Je5,
                es: De5,
                none: Me5
            },
            z = q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
        if (!z) throw mS(Ye5, q);
        var w = (z[1] || z[3]).toLowerCase(),
            H = z[2];
        return {
            sign: K[w](H),
            verify: Y[w](H)
        }
    }
})
// @from(Ln 186567, Col 4)
WwA = R((_l2, wZ7) => {
    var Pe5 = h1("buffer").Buffer;
    wZ7.exports = function(q) {
        if (typeof q === "string") return q;
        if (typeof q === "number" || Pe5.isBuffer(q)) return q.toString();
        return JSON.stringify(q)
    }
})
// @from(Ln 186575, Col 4)
XZ7 = R((Jl2, JZ7) => {
    var We5 = mu().Buffer,
        HZ7 = XwA(),
        Ge5 = PwA(),
        Ze5 = h1("stream"),
        $Z7 = WwA(),
        GwA = h1("util");

    function OZ7(A, q) {
        return We5.from(A, q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function fe5(A, q, K) {
        K = K || "utf8";
        var Y = OZ7($Z7(A), "binary"),
            z = OZ7($Z7(q), K);
        return GwA.format("%s.%s", Y, z)
    }

    function _Z7(A) {
        var {
            header: q,
            payload: K
        } = A, Y = A.secret || A.privateKey, z = A.encoding, w = Ge5(q.alg), H = fe5(q, K, z), $ = w.sign(H, Y);
        return GwA.format("%s.%s", H, $)
    }

    function kz6(A) {
        var q = A.secret || A.privateKey || A.key,
            K = new HZ7(q);
        this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = K, this.payload = new HZ7(A.payload), this.secret.once("close", function() {
            if (!this.payload.writable && this.readable) this.sign()
        }.bind(this)), this.payload.once("close", function() {
            if (!this.secret.writable && this.readable) this.sign()
        }.bind(this))
    }
    GwA.inherits(kz6, Ze5);
    kz6.prototype.sign = function() {
        try {
            var q = _Z7({
                header: this.header,
                payload: this.payload.buffer,
                secret: this.secret.buffer,
                encoding: this.encoding
            });
            return this.emit("done", q), this.emit("data", q), this.emit("end"), this.readable = !1, q
        } catch (K) {
            this.readable = !1, this.emit("error", K), this.emit("close")
        }
    };
    kz6.sign = _Z7;
    JZ7.exports = kz6
})
// @from(Ln 186628, Col 4)
NZ7 = R((Xl2, VZ7) => {
    var jZ7 = mu().Buffer,
        DZ7 = XwA(),
        Ve5 = PwA(),
        Ne5 = h1("stream"),
        MZ7 = WwA(),
        Te5 = h1("util"),
        ve5 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

    function Ee5(A) {
        return Object.prototype.toString.call(A) === "[object Object]"
    }

    function ke5(A) {
        if (Ee5(A)) return A;
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }

    function PZ7(A) {
        var q = A.split(".", 1)[0];
        return ke5(jZ7.from(q, "base64").toString("binary"))
    }

    function Le5(A) {
        return A.split(".", 2).join(".")
    }

    function WZ7(A) {
        return A.split(".")[2]
    }

    function Re5(A, q) {
        q = q || "utf8";
        var K = A.split(".")[1];
        return jZ7.from(K, "base64").toString(q)
    }

    function GZ7(A) {
        return ve5.test(A) && !!PZ7(A)
    }

    function ZZ7(A, q, K) {
        if (!q) {
            var Y = Error("Missing algorithm parameter for jws.verify");
            throw Y.code = "MISSING_ALGORITHM", Y
        }
        A = MZ7(A);
        var z = WZ7(A),
            w = Le5(A),
            H = Ve5(q);
        return H.verify(w, z, K)
    }

    function fZ7(A, q) {
        if (q = q || {}, A = MZ7(A), !GZ7(A)) return null;
        var K = PZ7(A);
        if (!K) return null;
        var Y = Re5(A);
        if (K.typ === "JWT" || q.json) Y = JSON.parse(Y, q.encoding);
        return {
            header: K,
            payload: Y,
            signature: WZ7(A)
        }
    }

    function dX1(A) {
        A = A || {};
        var q = A.secret || A.publicKey || A.key,
            K = new DZ7(q);
        this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = K, this.signature = new DZ7(A.signature), this.secret.once("close", function() {
            if (!this.signature.writable && this.readable) this.verify()
        }.bind(this)), this.signature.once("close", function() {
            if (!this.secret.writable && this.readable) this.verify()
        }.bind(this))
    }
    Te5.inherits(dX1, Ne5);
    dX1.prototype.verify = function() {
        try {
            var q = ZZ7(this.signature.buffer, this.algorithm, this.key.buffer),
                K = fZ7(this.signature.buffer, this.encoding);
            return this.emit("done", q, K), this.emit("data", q), this.emit("end"), this.readable = !1, q
        } catch (Y) {
            this.readable = !1, this.emit("error", Y), this.emit("close")
        }
    };
    dX1.decode = fZ7;
    dX1.isValid = GZ7;
    dX1.verify = ZZ7;
    VZ7.exports = dX1
})
// @from(Ln 186723, Col 4)
ZwA = R((Ce5) => {
    var TZ7 = XZ7(),
        Lz6 = NZ7(),
        ye5 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
    Ce5.ALGORITHMS = ye5;
    Ce5.sign = TZ7.sign;
    Ce5.verify = Lz6.verify;
    Ce5.decode = Lz6.decode;
    Ce5.isValid = Lz6.isValid;
    Ce5.createSign = function(q) {
        return new TZ7(q)
    };
    Ce5.createVerify = function(q) {
        return new Lz6(q)
    }
})
// @from(Ln 186739, Col 4)
hZ7 = R((Vo) => {
    var FS = Vo && Vo.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        vZ7 = Vo && Vo.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        QS, cX1, fwA, EZ7, kZ7, VwA, NwA, LZ7;
    Object.defineProperty(Vo, "__esModule", {
        value: !0
    });
    Vo.GoogleToken = void 0;
    var RZ7 = h1("fs"),
        me5 = bS(),
        Fe5 = ZwA(),
        Qe5 = h1("path"),
        ge5 = h1("util"),
        yZ7 = RZ7.readFile ? (0, ge5.promisify)(RZ7.readFile) : async () => {
            throw new lX1("use key rather than keyFile.", "MISSING_CREDENTIALS")
        }, CZ7 = "https://www.googleapis.com/oauth2/v4/token", Ue5 = "https://accounts.google.com/o/oauth2/revoke?token=";
    class lX1 extends Error {
        constructor(A, q) {
            super(A);
            this.code = q
        }
    }
    class SZ7 {
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
            QS.add(this), this.transporter = {
                request: (q) => (0, me5.request)(q)
            }, cX1.set(this, void 0), FS(this, QS, "m", NwA).call(this, A)
        }
        hasExpired() {
            let A = new Date().getTime();
            if (this.rawToken && this.expiresAt) return A >= this.expiresAt;
            else return !0
        }
        isTokenExpiring() {
            var A;
            let q = new Date().getTime(),
                K = (A = this.eagerRefreshThresholdMillis) !== null && A !== void 0 ? A : 0;
            if (this.rawToken && this.expiresAt) return this.expiresAt <= q + K;
            else return !0
        }
        getToken(A, q = {}) {
            if (typeof A === "object") q = A, A = void 0;
            if (q = Object.assign({
                    forceRefresh: !1
                }, q), A) {
                let K = A;
                FS(this, QS, "m", fwA).call(this, q).then((Y) => K(null, Y), A);
                return
            }
            return FS(this, QS, "m", fwA).call(this, q)
        }
        async getCredentials(A) {
            switch (Qe5.extname(A)) {
                case ".json": {
                    let K = await yZ7(A, "utf8"),
                        Y = JSON.parse(K),
                        z = Y.private_key,
                        w = Y.client_email;
                    if (!z || !w) throw new lX1("private_key and client_email are required.", "MISSING_CREDENTIALS");
                    return {
                        privateKey: z,
                        clientEmail: w
                    }
                }
                case ".der":
                case ".crt":
                case ".pem":
                    return {
                        privateKey: await yZ7(A, "utf8")
                    };
                case ".p12":
                case ".pfx":
                    throw new lX1("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
                default:
                    throw new lX1("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE")
            }
        }
        revokeToken(A) {
            if (A) {
                FS(this, QS, "m", VwA).call(this).then(() => A(), A);
                return
            }
            return FS(this, QS, "m", VwA).call(this)
        }
    }
    Vo.GoogleToken = SZ7;
    cX1 = new WeakMap, QS = new WeakSet, fwA = async function(q) {
        if (FS(this, cX1, "f") && !q.forceRefresh) return FS(this, cX1, "f");
        try {
            return await vZ7(this, cX1, FS(this, QS, "m", EZ7).call(this, q), "f")
        } finally {
            vZ7(this, cX1, void 0, "f")
        }
    }, EZ7 = async function(q) {
        if (this.isTokenExpiring() === !1 && q.forceRefresh === !1) return Promise.resolve(this.rawToken);
        if (!this.key && !this.keyFile) throw Error("No key or keyFile set.");
        if (!this.key && this.keyFile) {
            let K = await this.getCredentials(this.keyFile);
            if (this.key = K.privateKey, this.iss = K.clientEmail || this.iss, !K.clientEmail) FS(this, QS, "m", kZ7).call(this)
        }
        return FS(this, QS, "m", LZ7).call(this)
    }, kZ7 = function() {
        if (!this.iss) throw new lX1("email is required.", "MISSING_CREDENTIALS")
    }, VwA = async function() {
        if (!this.accessToken) throw Error("No token to revoke.");
        let q = Ue5 + this.accessToken;
        await this.transporter.request({
            url: q,
            retry: !0
        }), FS(this, QS, "m", NwA).call(this, {
            email: this.iss,
            sub: this.sub,
            key: this.key,
            keyFile: this.keyFile,
            scope: this.scope,
            additionalClaims: this.additionalClaims
        })
    }, NwA = function(q = {}) {
        if (this.keyFile = q.keyFile, this.key = q.key, this.rawToken = void 0, this.iss = q.email || q.iss, this.sub = q.sub, this.additionalClaims = q.additionalClaims, typeof q.scope === "object") this.scope = q.scope.join(" ");
        else this.scope = q.scope;
        if (this.eagerRefreshThresholdMillis = q.eagerRefreshThresholdMillis, q.transporter) this.transporter = q.transporter
    }, LZ7 = async function() {
        var q, K;
        let Y = Math.floor(new Date().getTime() / 1000),
            z = this.additionalClaims || {},
            w = Object.assign({
                iss: this.iss,
                scope: this.scope,
                aud: CZ7,
                exp: Y + 3600,
                iat: Y,
                sub: this.sub
            }, z),
            H = Fe5.sign({
                header: {
                    alg: "RS256"
                },
                payload: w,
                secret: this.key
            });
        try {
            let $ = await this.transporter.request({
                method: "POST",
                url: CZ7,
                data: {
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: H
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                responseType: "json",
                retryConfig: {
                    httpMethodsToRetry: ["POST"]
                }
            });
            return this.rawToken = $.data, this.expiresAt = $.data.expires_in === null || $.data.expires_in === void 0 ? void 0 : (Y + $.data.expires_in) * 1000, this.rawToken
        } catch ($) {
            this.rawToken = void 0, this.tokenExpires = void 0;
            let O = $.response && ((q = $.response) === null || q === void 0 ? void 0 : q.data) ? (K = $.response) === null || K === void 0 ? void 0 : K.data : {};
            if (O.error) {
                let _ = O.error_description ? `: ${O.error_description}` : "";
                $.message = `${O.error}${_}`
            }
            throw $
        }
    }
})
// @from(Ln 186928, Col 4)
vwA = R((xZ7) => {
    Object.defineProperty(xZ7, "__esModule", {
        value: !0
    });
    xZ7.JWTAccess = void 0;
    var pe5 = ZwA(),
        de5 = fo(),
        IZ7 = {
            alg: "RS256",
            typ: "JWT"
        };
    class TwA {
        constructor(A, q, K, Y) {
            this.cache = new de5.LRUCache({
                capacity: 500,
                maxAge: 3600000
            }), this.email = A, this.key = q, this.keyId = K, this.eagerRefreshThresholdMillis = Y !== null && Y !== void 0 ? Y : 300000
        }
        getCachedKey(A, q) {
            let K = A;
            if (q && Array.isArray(q) && q.length) K = A ? `${A}_${q.join("_")}` : `${q.join("_")}`;
            else if (typeof q === "string") K = A ? `${A}_${q}` : q;
            if (!K) throw Error("Scopes or url must be provided");
            return K
        }
        getRequestHeaders(A, q, K) {
            let Y = this.getCachedKey(A, K),
                z = this.cache.get(Y),
                w = Date.now();
            if (z && z.expiration - w > this.eagerRefreshThresholdMillis) return z.headers;
            let H = Math.floor(Date.now() / 1000),
                $ = TwA.getExpirationTime(H),
                O;
            if (Array.isArray(K)) K = K.join(" ");
            if (K) O = {
                iss: this.email,
                sub: this.email,
                scope: K,
                exp: $,
                iat: H
            };
            else O = {
                iss: this.email,
                sub: this.email,
                aud: A,
                exp: $,
                iat: H
            };
            if (q) {
                for (let j in O)
                    if (q[j]) throw Error(`The '${j}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`)
            }
            let _ = this.keyId ? {
                    ...IZ7,
                    kid: this.keyId
                } : IZ7,
                J = Object.assign(O, q),
                D = {
                    Authorization: `Bearer ${pe5.sign({header:_,payload:J,secret:this.key})}`
                };
            return this.cache.set(Y, {
                expiration: $ * 1000,
                headers: D
            }), D
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
        fromStream(A, q) {
            if (q) this.fromStreamAsync(A).then(() => q(), q);
            else return this.fromStreamAsync(A)
        }
        fromStreamAsync(A) {
            return new Promise((q, K) => {
                if (!A) K(Error("Must pass in a stream containing the service account auth settings."));
                let Y = "";
                A.setEncoding("utf8").on("data", (z) => Y += z).on("error", K).on("end", () => {
                    try {
                        let z = JSON.parse(Y);
                        this.fromJSON(z), q()
                    } catch (z) {
                        K(z)
                    }
                })
            })
        }
    }
    xZ7.JWTAccess = TwA
})
// @from(Ln 187023, Col 4)
kwA = R((BZ7) => {
    Object.defineProperty(BZ7, "__esModule", {
        value: !0
    });
    BZ7.JWT = void 0;
    var uZ7 = hZ7(),
        ce5 = vwA(),
        le5 = n41(),
        Rz6 = lu();
    class EwA extends le5.OAuth2Client {
        constructor(A, q, K, Y, z, w) {
            let H = A && typeof A === "object" ? A : {
                email: A,
                keyFile: q,
                key: K,
                keyId: w,
                scopes: Y,
                subject: z
            };
            super(H);
            this.email = H.email, this.keyFile = H.keyFile, this.key = H.key, this.keyId = H.keyId, this.scopes = H.scopes, this.subject = H.subject, this.additionalClaims = H.additionalClaims, this.credentials = {
                refresh_token: "jwt-placeholder",
                expiry_date: 1
            }
        }
        createScoped(A) {
            let q = new EwA(this);
            return q.scopes = A, q
        }
        async getRequestMetadataAsync(A) {
            A = this.defaultServicePath ? `https://${this.defaultServicePath}/` : A;
            let q = !this.hasUserScopes() && A || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== Rz6.DEFAULT_UNIVERSE;
            if (this.subject && this.universeDomain !== Rz6.DEFAULT_UNIVERSE) throw RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${Rz6.DEFAULT_UNIVERSE}`);
            if (!this.apiKey && q)
                if (this.additionalClaims && this.additionalClaims.target_audience) {
                    let {
                        tokens: K
                    } = await this.refreshToken();
                    return {
                        headers: this.addSharedMetadataHeaders({
                            Authorization: `Bearer ${K.id_token}`
                        })
                    }
                } else {
                    if (!this.access) this.access = new ce5.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
                    let K;
                    if (this.hasUserScopes()) K = this.scopes;
                    else if (!A) K = this.defaultScopes;
                    let Y = this.useJWTAccessWithScope || this.universeDomain !== Rz6.DEFAULT_UNIVERSE,
                        z = await this.access.getRequestHeaders(A !== null && A !== void 0 ? A : void 0, this.additionalClaims, Y ? K : void 0);
                    return {
                        headers: this.addSharedMetadataHeaders(z)
                    }
                }
            else if (this.hasAnyScopes() || this.apiKey) return super.getRequestMetadataAsync(A);
            else return {
                headers: {}
            }
        }
        async fetchIdToken(A) {
            let q = new uZ7.GoogleToken({
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
            if (await q.getToken({
                    forceRefresh: !0
                }), !q.idToken) throw Error("Unknown error: Failed to fetch ID token");
            return q.idToken
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
            if (A) this.authorizeAsync().then((q) => A(null, q), A);
            else return this.authorizeAsync()
        }
        async authorizeAsync() {
            let A = await this.refreshToken();
            if (!A) throw Error("No result returned");
            return this.credentials = A.tokens, this.credentials.refresh_token = "jwt-placeholder", this.key = this.gtoken.key, this.email = this.gtoken.iss, A.tokens
        }
        async refreshTokenNoCache(A) {
            let q = this.createGToken(),
                Y = {
                    access_token: (await q.getToken({
                        forceRefresh: this.isTokenExpiring()
                    })).access_token,
                    token_type: "Bearer",
                    expiry_date: q.expiresAt,
                    id_token: q.idToken
                };
            return this.emit("tokens", Y), {
                res: null,
                tokens: Y
            }
        }
        createGToken() {
            if (!this.gtoken) this.gtoken = new uZ7.GoogleToken({
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
        fromStream(A, q) {
            if (q) this.fromStreamAsync(A).then(() => q(), q);
            else return this.fromStreamAsync(A)
        }
        fromStreamAsync(A) {
            return new Promise((q, K) => {
                if (!A) throw Error("Must pass in a stream containing the service account auth settings.");
                let Y = "";
                A.setEncoding("utf8").on("error", K).on("data", (z) => Y += z).on("end", () => {
                    try {
                        let z = JSON.parse(Y);
                        this.fromJSON(z), q()
                    } catch (z) {
                        K(z)
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
                let q = await this.createGToken().getCredentials(this.keyFile);
                return {
                    private_key: q.privateKey,
                    client_email: q.clientEmail
                }
            }
            throw Error("A key or a keyFile must be provided to getCredentials.")
        }
    }
    BZ7.JWT = EwA
})
// @from(Ln 187189, Col 4)
LwA = R((FZ7) => {
    Object.defineProperty(FZ7, "__esModule", {
        value: !0
    });
    FZ7.UserRefreshClient = FZ7.USER_REFRESH_ACCOUNT_TYPE = void 0;
    var ie5 = n41(),
        ne5 = h1("querystring");
    FZ7.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
    class yz6 extends ie5.OAuth2Client {
        constructor(A, q, K, Y, z) {
            let w = A && typeof A === "object" ? A : {
                clientId: A,
                clientSecret: q,
                refreshToken: K,
                eagerRefreshThresholdMillis: Y,
                forceRefreshOnFailure: z
            };
            super(w);
            this._refreshToken = w.refreshToken, this.credentials.refresh_token = w.refreshToken
        }
        async refreshTokenNoCache(A) {
            return super.refreshTokenNoCache(this._refreshToken)
        }
        async fetchIdToken(A) {
            return (await this.transporter.request({
                ...yz6.RETRY_CONFIG,
                url: this.endpoints.oauth2TokenUrl,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: (0, ne5.stringify)({
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
        fromStream(A, q) {
            if (q) this.fromStreamAsync(A).then(() => q(), q);
            else return this.fromStreamAsync(A)
        }
        async fromStreamAsync(A) {
            return new Promise((q, K) => {
                if (!A) return K(Error("Must pass in a stream containing the user refresh token."));
                let Y = "";
                A.setEncoding("utf8").on("error", K).on("data", (z) => Y += z).on("end", () => {
                    try {
                        let z = JSON.parse(Y);
                        return this.fromJSON(z), q()
                    } catch (z) {
                        return K(z)
                    }
                })
            })
        }
        static fromJSON(A) {
            let q = new yz6;
            return q.fromJSON(A), q
        }
    }
    FZ7.UserRefreshClient = yz6
})
// @from(Ln 187262, Col 4)
RwA = R((UZ7) => {
    Object.defineProperty(UZ7, "__esModule", {
        value: !0
    });
    UZ7.Impersonated = UZ7.IMPERSONATED_ACCOUNT_TYPE = void 0;
    var gZ7 = n41(),
        oe5 = bS(),
        ae5 = fo();
    UZ7.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
    class rI1 extends gZ7.OAuth2Client {
        constructor(A = {}) {
            var q, K, Y, z, w, H;
            super(A);
            if (this.credentials = {
                    expiry_date: 1,
                    refresh_token: "impersonated-placeholder"
                }, this.sourceClient = (q = A.sourceClient) !== null && q !== void 0 ? q : new gZ7.OAuth2Client, this.targetPrincipal = (K = A.targetPrincipal) !== null && K !== void 0 ? K : "", this.delegates = (Y = A.delegates) !== null && Y !== void 0 ? Y : [], this.targetScopes = (z = A.targetScopes) !== null && z !== void 0 ? z : [], this.lifetime = (w = A.lifetime) !== null && w !== void 0 ? w : 3600, !(0, ae5.originalOrCamelOptions)(A).get("universe_domain")) this.universeDomain = this.sourceClient.universeDomain;
            else if (this.sourceClient.universeDomain !== this.universeDomain) throw RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
            this.endpoint = (H = A.endpoint) !== null && H !== void 0 ? H : `https://iamcredentials.${this.universeDomain}`
        }
        async sign(A) {
            await this.sourceClient.getAccessToken();
            let q = `projects/-/serviceAccounts/${this.targetPrincipal}`,
                K = `${this.endpoint}/v1/${q}:signBlob`,
                Y = {
                    delegates: this.delegates,
                    payload: Buffer.from(A).toString("base64")
                };
            return (await this.sourceClient.request({
                ...rI1.RETRY_CONFIG,
                url: K,
                data: Y,
                method: "POST"
            })).data
        }
        getTargetPrincipal() {
            return this.targetPrincipal
        }
        async refreshToken() {
            var A, q, K, Y, z, w;
            try {
                await this.sourceClient.getAccessToken();
                let H = "projects/-/serviceAccounts/" + this.targetPrincipal,
                    $ = `${this.endpoint}/v1/${H}:generateAccessToken`,
                    O = {
                        delegates: this.delegates,
                        scope: this.targetScopes,
                        lifetime: this.lifetime + "s"
                    },
                    _ = await this.sourceClient.request({
                        ...rI1.RETRY_CONFIG,
                        url: $,
                        data: O,
                        method: "POST"
                    }),
                    J = _.data;
                return this.credentials.access_token = J.accessToken, this.credentials.expiry_date = Date.parse(J.expireTime), {
                    tokens: this.credentials,
                    res: _
                }
            } catch (H) {
                if (!(H instanceof Error)) throw H;
                let $ = 0,
                    O = "";
                if (H instanceof oe5.GaxiosError) $ = (K = (q = (A = H === null || H === void 0 ? void 0 : H.response) === null || A === void 0 ? void 0 : A.data) === null || q === void 0 ? void 0 : q.error) === null || K === void 0 ? void 0 : K.status, O = (w = (z = (Y = H === null || H === void 0 ? void 0 : H.response) === null || Y === void 0 ? void 0 : Y.data) === null || z === void 0 ? void 0 : z.error) === null || w === void 0 ? void 0 : w.message;
                if ($ && O) throw H.message = `${$}: unable to impersonate: ${O}`, H;
                else throw H.message = `unable to impersonate: ${H}`, H
            }
        }
        async fetchIdToken(A, q) {
            var K, Y;
            await this.sourceClient.getAccessToken();
            let z = `projects/-/serviceAccounts/${this.targetPrincipal}`,
                w = `${this.endpoint}/v1/${z}:generateIdToken`,
                H = {
                    delegates: this.delegates,
                    audience: A,
                    includeEmail: (K = q === null || q === void 0 ? void 0 : q.includeEmail) !== null && K !== void 0 ? K : !0,
                    useEmailAzp: (Y = q === null || q === void 0 ? void 0 : q.includeEmail) !== null && Y !== void 0 ? Y : !0
                };
            return (await this.sourceClient.request({
                ...rI1.RETRY_CONFIG,
                url: w,
                data: H,
                method: "POST"
            })).data.token
        }
    }
    UZ7.Impersonated = rI1
})
// @from(Ln 187352, Col 4)
ywA = R((lZ7) => {
    Object.defineProperty(lZ7, "__esModule", {
        value: !0
    });
    lZ7.OAuthClientAuthHandler = void 0;
    lZ7.getErrorFromOAuthErrorResponse = A19;
    var dZ7 = h1("querystring"),
        te5 = FX1(),
        ee5 = ["PUT", "POST", "PATCH"];
    class cZ7 {
        constructor(A) {
            this.clientAuthentication = A, this.crypto = (0, te5.createCrypto)()
        }
        applyClientAuthenticationOptions(A, q) {
            if (this.injectAuthenticatedHeaders(A, q), !q) this.injectAuthenticatedRequestBody(A)
        }
        injectAuthenticatedHeaders(A, q) {
            var K;
            if (q) A.headers = A.headers || {}, Object.assign(A.headers, {
                Authorization: `Bearer ${q}}`
            });
            else if (((K = this.clientAuthentication) === null || K === void 0 ? void 0 : K.confidentialClientType) === "basic") {
                A.headers = A.headers || {};
                let Y = this.clientAuthentication.clientId,
                    z = this.clientAuthentication.clientSecret || "",
                    w = this.crypto.encodeBase64StringUtf8(`${Y}:${z}`);
                Object.assign(A.headers, {
                    Authorization: `Basic ${w}`
                })
            }
        }
        injectAuthenticatedRequestBody(A) {
            var q;
            if (((q = this.clientAuthentication) === null || q === void 0 ? void 0 : q.confidentialClientType) === "request-body") {
                let K = (A.method || "GET").toUpperCase();
                if (ee5.indexOf(K) !== -1) {
                    let Y, z = A.headers || {};
                    for (let w in z)
                        if (w.toLowerCase() === "content-type" && z[w]) {
                            Y = z[w].toLowerCase();
                            break
                        } if (Y === "application/x-www-form-urlencoded") {
                        A.data = A.data || "";
                        let w = dZ7.parse(A.data);
                        Object.assign(w, {
                            client_id: this.clientAuthentication.clientId,
                            client_secret: this.clientAuthentication.clientSecret || ""
                        }), A.data = dZ7.stringify(w)
                    } else if (Y === "application/json") A.data = A.data || {}, Object.assign(A.data, {
                        client_id: this.clientAuthentication.clientId,
                        client_secret: this.clientAuthentication.clientSecret || ""
                    });
                    else throw Error(`${Y} content-types are not supported with ${this.clientAuthentication.confidentialClientType} client authentication`)
                } else throw Error(`${K} HTTP method does not support ${this.clientAuthentication.confidentialClientType} client authentication`)
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
    lZ7.OAuthClientAuthHandler = cZ7;

    function A19(A, q) {
        let {
            error: K,
            error_description: Y,
            error_uri: z
        } = A, w = `Error code ${K}`;
        if (typeof Y < "u") w += `: ${Y}`;
        if (typeof z < "u") w += ` - ${z}`;
        let H = Error(w);
        if (q) {
            let $ = Object.keys(q);
            if (q.stack) $.push("stack");
            $.forEach((O) => {
                if (O !== "message") Object.defineProperty(H, O, {
                    value: q[O],
                    writable: !1,
                    enumerable: !0
                })
            })
        }
        return H
    }
})
// @from(Ln 187442, Col 4)
SwA = R((rZ7) => {
    Object.defineProperty(rZ7, "__esModule", {
        value: !0
    });
    rZ7.StsCredentials = void 0;
    var K19 = bS(),
        Y19 = h1("querystring"),
        z19 = dI1(),
        nZ7 = ywA();
    class CwA extends nZ7.OAuthClientAuthHandler {
        constructor(A, q) {
            super(q);
            this.tokenExchangeEndpoint = A, this.transporter = new z19.DefaultTransporter
        }
        async exchangeToken(A, q, K) {
            var Y, z, w;
            let H = {
                grant_type: A.grantType,
                resource: A.resource,
                audience: A.audience,
                scope: (Y = A.scope) === null || Y === void 0 ? void 0 : Y.join(" "),
                requested_token_type: A.requestedTokenType,
                subject_token: A.subjectToken,
                subject_token_type: A.subjectTokenType,
                actor_token: (z = A.actingParty) === null || z === void 0 ? void 0 : z.actorToken,
                actor_token_type: (w = A.actingParty) === null || w === void 0 ? void 0 : w.actorTokenType,
                options: K && JSON.stringify(K)
            };
            Object.keys(H).forEach((_) => {
                if (typeof H[_] > "u") delete H[_]
            });
            let $ = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            Object.assign($, q || {});
            let O = {
                ...CwA.RETRY_CONFIG,
                url: this.tokenExchangeEndpoint.toString(),
                method: "POST",
                headers: $,
                data: Y19.stringify(H),
                responseType: "json"
            };
            this.applyClientAuthenticationOptions(O);
            try {
                let _ = await this.transporter.request(O),
                    J = _.data;
                return J.res = _, J
            } catch (_) {
                if (_ instanceof K19.GaxiosError && _.response) throw (0, nZ7.getErrorFromOAuthErrorResponse)(_.response.data, _);
                throw _
            }
        }
    }
    rZ7.StsCredentials = CwA
})
// @from(Ln 187498, Col 4)
No = R((g0) => {
    var hwA = g0 && g0.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        aZ7 = g0 && g0.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        IwA, iX1, tZ7;
    Object.defineProperty(g0, "__esModule", {
        value: !0
    });
    g0.BaseExternalAccountClient = g0.DEFAULT_UNIVERSE = g0.CLOUD_RESOURCE_MANAGER = g0.EXTERNAL_ACCOUNT_TYPE = g0.EXPIRATION_TIME_OFFSET = void 0;
    var w19 = h1("stream"),
        H19 = lu(),
        $19 = SwA(),
        sZ7 = fo(),
        O19 = "urn:ietf:params:oauth:grant-type:token-exchange",
        _19 = "urn:ietf:params:oauth:token-type:access_token",
        xwA = "https://www.googleapis.com/auth/cloud-platform",
        J19 = 3600;
    g0.EXPIRATION_TIME_OFFSET = 300000;
    g0.EXTERNAL_ACCOUNT_TYPE = "external_account";
    g0.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
    var X19 = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+",
        D19 = "https://sts.{universeDomain}/v1/token",
        j19 = qwA(),
        M19 = lu();
    Object.defineProperty(g0, "DEFAULT_UNIVERSE", {
        enumerable: !0,
        get: function() {
            return M19.DEFAULT_UNIVERSE
        }
    });
    class Cz6 extends H19.AuthClient {
        constructor(A, q) {
            var K;
            super({
                ...A,
                ...q
            });
            IwA.add(this), iX1.set(this, null);
            let Y = (0, sZ7.originalOrCamelOptions)(A),
                z = Y.get("type");
            if (z && z !== g0.EXTERNAL_ACCOUNT_TYPE) throw Error(`Expected "${g0.EXTERNAL_ACCOUNT_TYPE}" type but received "${A.type}"`);
            let w = Y.get("client_id"),
                H = Y.get("client_secret"),
                $ = (K = Y.get("token_url")) !== null && K !== void 0 ? K : D19.replace("{universeDomain}", this.universeDomain),
                O = Y.get("subject_token_type"),
                _ = Y.get("workforce_pool_user_project"),
                J = Y.get("service_account_impersonation_url"),
                X = Y.get("service_account_impersonation"),
                D = (0, sZ7.originalOrCamelOptions)(X).get("token_lifetime_seconds");
            if (this.cloudResourceManagerURL = new URL(Y.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`), w) this.clientAuth = {
                confidentialClientType: "basic",
                clientId: w,
                clientSecret: H
            };
            this.stsCredential = new $19.StsCredentials($, this.clientAuth), this.scopes = Y.get("scopes") || [xwA], this.cachedAccessToken = null, this.audience = Y.get("audience"), this.subjectTokenType = O, this.workforcePoolUserProject = _;
            let j = new RegExp(X19);
            if (this.workforcePoolUserProject && !this.audience.match(j)) throw Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
            if (this.serviceAccountImpersonationUrl = J, this.serviceAccountImpersonationLifetime = D, this.serviceAccountImpersonationLifetime) this.configLifetimeRequested = !0;
            else this.configLifetimeRequested = !1, this.serviceAccountImpersonationLifetime = J19;
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
                let K = /serviceAccounts\/(?<email>[^:]+):generateAccessToken$/.exec(this.serviceAccountImpersonationUrl);
                return ((A = K === null || K === void 0 ? void 0 : K.groups) === null || A === void 0 ? void 0 : A.email) || null
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
        async getProjectId() {
            let A = this.projectNumber || this.workforcePoolUserProject;
            if (this.projectId) return this.projectId;
            else if (A) {
                let q = await this.getRequestHeaders(),
                    K = await this.transporter.request({
                        ...Cz6.RETRY_CONFIG,
                        headers: q,
                        url: `${this.cloudResourceManagerURL.toString()}${A}`,
                        responseType: "json"
                    });
                return this.projectId = K.data.projectId, this.projectId
            }
            return null
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
                        H = z.config.data instanceof w19.Readable;
                    if (!q && (w === 401 || w === 403) && !H && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
                }
                throw Y
            }
            return K
        }
        async refreshAccessTokenAsync() {
            aZ7(this, iX1, hwA(this, iX1, "f") || hwA(this, IwA, "m", tZ7).call(this), "f");
            try {
                return await hwA(this, iX1, "f")
            } finally {
                aZ7(this, iX1, null, "f")
            }
        }
        getProjectNumber(A) {
            let q = A.match(/\/projects\/([^/]+)/);
            if (!q) return null;
            return q[1]
        }
        async getImpersonatedAccessToken(A) {
            let q = {
                    ...Cz6.RETRY_CONFIG,
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
                K = await this.transporter.request(q),
                Y = K.data;
            return {
                access_token: Y.accessToken,
                expiry_date: new Date(Y.expireTime).getTime(),
                res: K
            }
        }
        isExpired(A) {
            let q = new Date().getTime();
            return A.expiry_date ? q >= A.expiry_date - this.eagerRefreshThresholdMillis : !1
        }
        getScopesArray() {
            if (typeof this.scopes === "string") return [this.scopes];
            return this.scopes || [xwA]
        }
        getMetricsHeaderValue() {
            let A = process.version.replace(/^v/, ""),
                q = this.serviceAccountImpersonationUrl !== void 0,
                K = this.credentialSourceType ? this.credentialSourceType : "unknown";
            return `gl-node/${A} auth/${j19.version} google-byoid-sdk source/${K} sa-impersonation/${q} config-lifetime/${this.configLifetimeRequested}`
        }
    }
    g0.BaseExternalAccountClient = Cz6;
    iX1 = new WeakMap, IwA = new WeakSet, tZ7 = async function() {
        let q = await this.retrieveSubjectToken(),
            K = {
                grantType: O19,
                audience: this.audience,
                requestedTokenType: _19,
                subjectToken: q,
                subjectTokenType: this.subjectTokenType,
                scope: this.serviceAccountImpersonationUrl ? [xwA] : this.getScopesArray()
            },
            Y = !this.clientAuth && this.workforcePoolUserProject ? {
                userProject: this.workforcePoolUserProject
            } : void 0,
            z = {
                "x-goog-api-client": this.getMetricsHeaderValue()
            },
            w = await this.stsCredential.exchangeToken(K, z, Y);
        if (this.serviceAccountImpersonationUrl) this.cachedAccessToken = await this.getImpersonatedAccessToken(w.access_token);
        else if (w.expires_in) this.cachedAccessToken = {
            access_token: w.access_token,
            expiry_date: new Date().getTime() + w.expires_in * 1000,
            res: w.res
        };
        else this.cachedAccessToken = {
            access_token: w.access_token,
            res: w.res
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
// @from(Ln 187723, Col 4)
Kf7 = R((Af7) => {
    var bwA, uwA, BwA;
    Object.defineProperty(Af7, "__esModule", {
        value: !0
    });
    Af7.FileSubjectTokenSupplier = void 0;
    var mwA = h1("util"),
        FwA = h1("fs"),
        P19 = (0, mwA.promisify)((bwA = FwA.readFile) !== null && bwA !== void 0 ? bwA : () => {}),
        W19 = (0, mwA.promisify)((uwA = FwA.realpath) !== null && uwA !== void 0 ? uwA : () => {}),
        G19 = (0, mwA.promisify)((BwA = FwA.lstat) !== null && BwA !== void 0 ? BwA : () => {});
    class eZ7 {
        constructor(A) {
            this.filePath = A.filePath, this.formatType = A.formatType, this.subjectTokenFieldName = A.subjectTokenFieldName
        }
        async getSubjectToken(A) {
            let q = this.filePath;
            try {
                if (q = await W19(q), !(await G19(q)).isFile()) throw Error()
            } catch (z) {
                if (z instanceof Error) z.message = `The file at ${q} does not exist, or it is not a file. ${z.message}`;
                throw z
            }
            let K, Y = await P19(q, {
                encoding: "utf8"
            });
            if (this.formatType === "text") K = Y;
            else if (this.formatType === "json" && this.subjectTokenFieldName) K = JSON.parse(Y)[this.subjectTokenFieldName];
            if (!K) throw Error("Unable to parse the subject_token from the credential_source file");
            return K
        }
    }
    Af7.FileSubjectTokenSupplier = eZ7
})
// @from(Ln 187757, Col 4)
Hf7 = R((zf7) => {
    Object.defineProperty(zf7, "__esModule", {
        value: !0
    });
    zf7.UrlSubjectTokenSupplier = void 0;
    class Yf7 {
        constructor(A) {
            this.url = A.url, this.formatType = A.formatType, this.subjectTokenFieldName = A.subjectTokenFieldName, this.headers = A.headers, this.additionalGaxiosOptions = A.additionalGaxiosOptions
        }
        async getSubjectToken(A) {
            let q = {
                    ...this.additionalGaxiosOptions,
                    url: this.url,
                    method: "GET",
                    headers: this.headers,
                    responseType: this.formatType
                },
                K;
            if (this.formatType === "text") K = (await A.transporter.request(q)).data;
            else if (this.formatType === "json" && this.subjectTokenFieldName) K = (await A.transporter.request(q)).data[this.subjectTokenFieldName];
            if (!K) throw Error("Unable to parse the subject_token from the credential_source URL");
            return K
        }
    }
    zf7.UrlSubjectTokenSupplier = Yf7
})
// @from(Ln 187783, Col 4)
UwA = R(($f7) => {
    Object.defineProperty($f7, "__esModule", {
        value: !0
    });
    $f7.IdentityPoolClient = void 0;
    var Z19 = No(),
        QwA = fo(),
        f19 = Kf7(),
        V19 = Hf7();
    class gwA extends Z19.BaseExternalAccountClient {
        constructor(A, q) {
            super(A, q);
            let K = (0, QwA.originalOrCamelOptions)(A),
                Y = K.get("credential_source"),
                z = K.get("subject_token_supplier");
            if (!Y && !z) throw Error("A credential source or subject token supplier must be specified.");
            if (Y && z) throw Error("Only one of credential source or subject token supplier can be specified.");
            if (z) this.subjectTokenSupplier = z, this.credentialSourceType = "programmatic";
            else {
                let w = (0, QwA.originalOrCamelOptions)(Y),
                    H = (0, QwA.originalOrCamelOptions)(w.get("format")),
                    $ = H.get("type") || "text",
                    O = H.get("subject_token_field_name");
                if ($ !== "json" && $ !== "text") throw Error(`Invalid credential_source format "${$}"`);
                if ($ === "json" && !O) throw Error("Missing subject_token_field_name for JSON credential_source format");
                let _ = w.get("file"),
                    J = w.get("url"),
                    X = w.get("headers");
                if (_ && J) throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
                else if (_ && !J) this.credentialSourceType = "file", this.subjectTokenSupplier = new f19.FileSubjectTokenSupplier({
                    filePath: _,
                    formatType: $,
                    subjectTokenFieldName: O
                });
                else if (!_ && J) this.credentialSourceType = "url", this.subjectTokenSupplier = new V19.UrlSubjectTokenSupplier({
                    url: J,
                    formatType: $,
                    subjectTokenFieldName: O,
                    headers: X,
                    additionalGaxiosOptions: gwA.RETRY_CONFIG
                });
                else throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.')
            }
        }
        async retrieveSubjectToken() {
            return this.subjectTokenSupplier.getSubjectToken(this.supplierContext)
        }
    }
    $f7.IdentityPoolClient = gwA
})
// @from(Ln 187833, Col 4)
pwA = R((Df7) => {
    Object.defineProperty(Df7, "__esModule", {
        value: !0
    });
    Df7.AwsRequestSigner = void 0;
    var Jf7 = FX1(),
        _f7 = "AWS4-HMAC-SHA256",
        N19 = "aws4_request";
    class Xf7 {
        constructor(A, q) {
            this.getCredentials = A, this.region = q, this.crypto = (0, Jf7.createCrypto)()
        }
        async getRequestOptions(A) {
            if (!A.url) throw Error('"url" is required in "amzOptions"');
            let q = typeof A.data === "object" ? JSON.stringify(A.data) : A.data,
                K = A.url,
                Y = A.method || "GET",
                z = A.body || q,
                w = A.headers,
                H = await this.getCredentials(),
                $ = new URL(K),
                O = await v19({
                    crypto: this.crypto,
                    host: $.host,
                    canonicalUri: $.pathname,
                    canonicalQuerystring: $.search.substr(1),
                    method: Y,
                    region: this.region,
                    securityCredentials: H,
                    requestPayload: z,
                    additionalAmzHeaders: w
                }),
                _ = Object.assign(O.amzDate ? {
                    "x-amz-date": O.amzDate
                } : {}, {
                    Authorization: O.authorizationHeader,
                    host: $.host
                }, w || {});
            if (H.token) Object.assign(_, {
                "x-amz-security-token": H.token
            });
            let J = {
                url: K,
                method: Y,
                headers: _
            };
            if (typeof z < "u") J.body = z;
            return J
        }
    }
    Df7.AwsRequestSigner = Xf7;
    async function oI1(A, q, K) {
        return await A.signWithHmacSha256(q, K)
    }
    async function T19(A, q, K, Y, z) {
        let w = await oI1(A, `AWS4${q}`, K),
            H = await oI1(A, w, Y),
            $ = await oI1(A, H, z);
        return await oI1(A, $, "aws4_request")
    }
    async function v19(A) {
        let q = A.additionalAmzHeaders || {},
            K = A.requestPayload || "",
            Y = A.host.split(".")[0],
            z = new Date,
            w = z.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, ""),
            H = z.toISOString().replace(/[-]/g, "").replace(/T.*/, ""),
            $ = {};
        if (Object.keys(q).forEach((Z) => {
                $[Z.toLowerCase()] = q[Z]
            }), A.securityCredentials.token) $["x-amz-security-token"] = A.securityCredentials.token;
        let O = Object.assign({
                host: A.host
            }, $.date ? {} : {
                "x-amz-date": w
            }, $),
            _ = "",
            J = Object.keys(O).sort();
        J.forEach((Z) => {
            _ += `${Z}:${O[Z]}
`
        });
        let X = J.join(";"),
            D = await A.crypto.sha256DigestHex(K),
            j = `${A.method}
${A.canonicalUri}
${A.canonicalQuerystring}
${_}
${X}
${D}`,
            M = `${H}/${A.region}/${Y}/${N19}`,
            P = `${_f7}
${w}
${M}
` + await A.crypto.sha256DigestHex(j),
            W = await T19(A.crypto, A.securityCredentials.secretAccessKey, H, A.region, Y),
            G = await oI1(A.crypto, W, P),
            f = `${_f7} Credential=${A.securityCredentials.accessKeyId}/${M}, SignedHeaders=${X}, Signature=${(0,Jf7.fromArrayBufferToHex)(G)}`;
        return {
            amzDate: $.date ? void 0 : w,
            authorizationHeader: f,
            canonicalQuerystring: A.canonicalQuerystring
        }
    }
})
// @from(Ln 187938, Col 4)
Gf7 = R((nX1) => {
    var mU = nX1 && nX1.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        gS, dwA, Mf7, Pf7, Sz6, cwA;
    Object.defineProperty(nX1, "__esModule", {
        value: !0
    });
    nX1.DefaultAwsSecurityCredentialsSupplier = void 0;
    class Wf7 {
        constructor(A) {
            gS.add(this), this.regionUrl = A.regionUrl, this.securityCredentialsUrl = A.securityCredentialsUrl, this.imdsV2SessionTokenUrl = A.imdsV2SessionTokenUrl, this.additionalGaxiosOptions = A.additionalGaxiosOptions
        }
        async getAwsRegion(A) {
            if (mU(this, gS, "a", Sz6)) return mU(this, gS, "a", Sz6);
            let q = {};
            if (!mU(this, gS, "a", Sz6) && this.imdsV2SessionTokenUrl) q["x-aws-ec2-metadata-token"] = await mU(this, gS, "m", dwA).call(this, A.transporter);
            if (!this.regionUrl) throw Error('Unable to determine AWS region due to missing "options.credential_source.region_url"');
            let K = {
                    ...this.additionalGaxiosOptions,
                    url: this.regionUrl,
                    method: "GET",
                    responseType: "text",
                    headers: q
                },
                Y = await A.transporter.request(K);
            return Y.data.substr(0, Y.data.length - 1)
        }
        async getAwsSecurityCredentials(A) {
            if (mU(this, gS, "a", cwA)) return mU(this, gS, "a", cwA);
            let q = {};
            if (this.imdsV2SessionTokenUrl) q["x-aws-ec2-metadata-token"] = await mU(this, gS, "m", dwA).call(this, A.transporter);
            let K = await mU(this, gS, "m", Mf7).call(this, q, A.transporter),
                Y = await mU(this, gS, "m", Pf7).call(this, K, q, A.transporter);
            return {
                accessKeyId: Y.AccessKeyId,
                secretAccessKey: Y.SecretAccessKey,
                token: Y.Token
            }
        }
    }
    nX1.DefaultAwsSecurityCredentialsSupplier = Wf7;
    gS = new WeakSet, dwA = async function(q) {
        let K = {
            ...this.additionalGaxiosOptions,
            url: this.imdsV2SessionTokenUrl,
            method: "PUT",
            responseType: "text",
            headers: {
                "x-aws-ec2-metadata-token-ttl-seconds": "300"
            }
        };
        return (await q.request(K)).data
    }, Mf7 = async function(q, K) {
        if (!this.securityCredentialsUrl) throw Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
        let Y = {
            ...this.additionalGaxiosOptions,
            url: this.securityCredentialsUrl,
            method: "GET",
            responseType: "text",
            headers: q
        };
        return (await K.request(Y)).data
    }, Pf7 = async function(q, K, Y) {
        return (await Y.request({
            ...this.additionalGaxiosOptions,
            url: `${this.securityCredentialsUrl}/${q}`,
            responseType: "json",
            headers: K
        })).data
    }, Sz6 = function() {
        return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null
    }, cwA = function() {
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            token: process.env.AWS_SESSION_TOKEN
        };
        return null
    }
})
// @from(Ln 188021, Col 4)
lwA = R((rX1) => {
    var E19 = rX1 && rX1.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        hz6, ff7;
    Object.defineProperty(rX1, "__esModule", {
        value: !0
    });
    rX1.AwsClient = void 0;
    var k19 = pwA(),
        L19 = No(),
        R19 = Gf7(),
        Zf7 = fo();
    class aI1 extends L19.BaseExternalAccountClient {
        constructor(A, q) {
            super(A, q);
            let K = (0, Zf7.originalOrCamelOptions)(A),
                Y = K.get("credential_source"),
                z = K.get("aws_security_credentials_supplier");
            if (!Y && !z) throw Error("A credential source or AWS security credentials supplier must be specified.");
            if (Y && z) throw Error("Only one of credential source or AWS security credentials supplier can be specified.");
            if (z) this.awsSecurityCredentialsSupplier = z, this.regionalCredVerificationUrl = E19(hz6, hz6, "f", ff7), this.credentialSourceType = "programmatic";
            else {
                let w = (0, Zf7.originalOrCamelOptions)(Y);
                this.environmentId = w.get("environment_id");
                let H = w.get("region_url"),
                    $ = w.get("url"),
                    O = w.get("imdsv2_session_token_url");
                this.awsSecurityCredentialsSupplier = new R19.DefaultAwsSecurityCredentialsSupplier({
                    regionUrl: H,
                    securityCredentialsUrl: $,
                    imdsV2SessionTokenUrl: O
                }), this.regionalCredVerificationUrl = w.get("regional_cred_verification_url"), this.credentialSourceType = "aws", this.validateEnvironmentId()
            }
            this.awsRequestSigner = null, this.region = ""
        }
        validateEnvironmentId() {
            var A;
            let q = (A = this.environmentId) === null || A === void 0 ? void 0 : A.match(/^(aws)(\d+)$/);
            if (!q || !this.regionalCredVerificationUrl) throw Error('No valid AWS "credential_source" provided');
            else if (parseInt(q[2], 10) !== 1) throw Error(`aws version "${q[2]}" is not supported in the current build.`)
        }
        async retrieveSubjectToken() {
            if (!this.awsRequestSigner) this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext), this.awsRequestSigner = new k19.AwsRequestSigner(async () => {
                return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext)
            }, this.region);
            let A = await this.awsRequestSigner.getRequestOptions({
                    ...hz6.RETRY_CONFIG,
                    url: this.regionalCredVerificationUrl.replace("{region}", this.region),
                    method: "POST"
                }),
                q = [],
                K = Object.assign({
                    "x-goog-cloud-target-resource": this.audience
                }, A.headers);
            for (let Y in K) q.push({
                key: Y,
                value: K[Y]
            });
            return encodeURIComponent(JSON.stringify({
                url: A.url,
                method: A.method,
                headers: q
            }))
        }
    }
    rX1.AwsClient = aI1;
    hz6 = aI1;
    ff7 = {
        value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15"
    };
    aI1.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
    aI1.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254"
})