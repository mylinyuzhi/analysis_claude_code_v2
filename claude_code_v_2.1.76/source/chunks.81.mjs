
// @from(Ln 210958, Col 4)
A36 = x((qt7) => {
    Object.defineProperty(qt7, "__esModule", {
        value: !0
    });
    qt7.OAuth2Client = qt7.ClientAuthentication = qt7.CertificateFormat = qt7.CodeChallengeMethod = void 0;
    var dW9 = _I(),
        _G8 = x6("querystring"),
        cW9 = x6("stream"),
        lW9 = BJ1(),
        wG8 = w06(),
        iW9 = wB(),
        nW9 = zG8(),
        At7;
    (function(A) {
        A.Plain = "plain", A.S256 = "S256"
    })(At7 || (qt7.CodeChallengeMethod = At7 = {}));
    var vd;
    (function(A) {
        A.PEM = "PEM", A.JWK = "JWK"
    })(vd || (qt7.CertificateFormat = vd = {}));
    var pg6;
    (function(A) {
        A.ClientSecretPost = "ClientSecretPost", A.ClientSecretBasic = "ClientSecretBasic", A.None = "None"
    })(pg6 || (qt7.ClientAuthentication = pg6 = {}));
    class wf extends iW9.AuthClient {
        constructor(A, q, K) {
            let Y = A && typeof A === "object" ? A : {
                clientId: A,
                clientSecret: q,
                redirectUri: K
            };
            super(Y);
            this.certificateCache = {}, this.certificateExpiry = null, this.certificateCacheFormat = vd.PEM, this.refreshTokenPromises = new Map, this._clientId = Y.clientId, this._clientSecret = Y.clientSecret, this.redirectUri = Y.redirectUri, this.endpoints = {
                tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
                oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
                oauth2TokenUrl: "https://oauth2.googleapis.com/token",
                oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
                oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
                oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
                oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
                ...Y.endpoints
            }, this.clientAuthentication = Y.clientAuthentication || pg6.ClientSecretPost, this.issuers = Y.issuers || ["accounts.google.com", "https://accounts.google.com", this.universeDomain]
        }
        generateAuthUrl(A = {}) {
            if (A.code_challenge_method && !A.code_challenge) throw Error("If a code_challenge_method is provided, code_challenge must be included.");
            if (A.response_type = A.response_type || "code", A.client_id = A.client_id || this._clientId, A.redirect_uri = A.redirect_uri || this.redirectUri, Array.isArray(A.scope)) A.scope = A.scope.join(" ");
            return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + _G8.stringify(A)
        }
        generateCodeVerifier() {
            throw Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.")
        }
        async generateCodeVerifierAsync() {
            let A = (0, wG8.createCrypto)(),
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
            if (this.clientAuthentication === pg6.ClientSecretBasic) {
                let w = Buffer.from(`${this._clientId}:${this._clientSecret}`);
                K.Authorization = `Basic ${w.toString("base64")}`
            }
            if (this.clientAuthentication === pg6.ClientSecretPost) Y.client_secret = this._clientSecret;
            let z = await this.transporter.request({
                    ...wf.RETRY_CONFIG,
                    method: "POST",
                    url: q,
                    data: _G8.stringify(Y),
                    headers: K
                }),
                _ = z.data;
            if (z.data && z.data.expires_in) _.expiry_date = new Date().getTime() + z.data.expires_in * 1000, delete _.expires_in;
            return this.emit("tokens", _), {
                tokens: _,
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
                    ...wf.RETRY_CONFIG,
                    method: "POST",
                    url: K,
                    data: _G8.stringify(Y),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            } catch (w) {
                if (w instanceof dW9.GaxiosError && w.message === "invalid_grant" && ((q = w.response) === null || q === void 0 ? void 0 : q.data) && /ReAuth/i.test(w.response.data.error_description)) w.message = JSON.stringify(w.response.data);
                throw w
            }
            let _ = z.data;
            if (z.data && z.data.expires_in) _.expiry_date = new Date().getTime() + z.data.expires_in * 1000, delete _.expires_in;
            return this.emit("tokens", _), {
                tokens: _,
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
                let w = {
                    Authorization: q.token_type + " " + q.access_token
                };
                return {
                    headers: this.addSharedMetadataHeaders(w)
                }
            }
            if (this.refreshHandler) {
                let w = await this.processAndValidateRefreshHandler();
                if (w === null || w === void 0 ? void 0 : w.access_token) {
                    this.setCredentials(w);
                    let O = {
                        Authorization: "Bearer " + this.credentials.access_token
                    };
                    return {
                        headers: this.addSharedMetadataHeaders(O)
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
            } catch (w) {
                let O = w;
                if (O.response && (O.response.status === 403 || O.response.status === 404)) O.message = `Could not refresh access token: ${O.message}`;
                throw O
            }
            let z = this.credentials;
            z.token_type = z.token_type || "Bearer", Y.refresh_token = z.refresh_token, this.credentials = Y;
            let _ = {
                Authorization: z.token_type + " " + Y.access_token
            };
            return {
                headers: this.addSharedMetadataHeaders(_),
                res: K.res
            }
        }
        static getRevokeTokenUrl(A) {
            return new wf().getRevokeTokenURL(A).toString()
        }
        getRevokeTokenURL(A) {
            let q = new URL(this.endpoints.oauth2RevokeUrl);
            return q.searchParams.append("token", A), q
        }
        revokeToken(A, q) {
            let K = {
                ...wf.RETRY_CONFIG,
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
                    let _ = z.status,
                        w = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure),
                        O = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler,
                        $ = z.config.data instanceof cW9.Readable,
                        H = _ === 401 || _ === 403;
                    if (!q && H && !$ && w) return await this.refreshAccessTokenAsync(), this.requestAsync(A, !0);
                    else if (!q && H && !$ && O) {
                        let j = await this.processAndValidateRefreshHandler();
                        if (j === null || j === void 0 ? void 0 : j.access_token) this.setCredentials(j);
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
                ...wf.RETRY_CONFIG,
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
                q = (0, wG8.hasBrowserCrypto)() ? vd.JWK : vd.PEM;
            if (this.certificateExpiry && A < this.certificateExpiry.getTime() && this.certificateCacheFormat === q) return {
                certs: this.certificateCache,
                format: q
            };
            let K, Y;
            switch (q) {
                case vd.PEM:
                    Y = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
                    break;
                case vd.JWK:
                    Y = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
                    break;
                default:
                    throw Error(`Unsupported certificate format ${q}`)
            }
            try {
                K = await this.transporter.request({
                    ...wf.RETRY_CONFIG,
                    url: Y
                })
            } catch ($) {
                if ($ instanceof Error) $.message = `Failed to retrieve verification certificates: ${$.message}`;
                throw $
            }
            let z = K ? K.headers["cache-control"] : void 0,
                _ = -1;
            if (z) {
                let H = new RegExp("max-age=([0-9]*)").exec(z);
                if (H && H.length === 2) _ = Number(H[1]) * 1000
            }
            let w = {};
            switch (q) {
                case vd.PEM:
                    w = K.data;
                    break;
                case vd.JWK:
                    for (let $ of K.data.keys) w[$.kid] = $;
                    break;
                default:
                    throw Error(`Unsupported certificate format ${q}`)
            }
            let O = new Date;
            return this.certificateExpiry = _ === -1 ? null : new Date(O.getTime() + _), this.certificateCache = w, this.certificateCacheFormat = q, {
                certs: w,
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
                    ...wf.RETRY_CONFIG,
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
            let _ = (0, wG8.createCrypto)();
            if (!z) z = wf.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
            let w = A.split(".");
            if (w.length !== 3) throw Error("Wrong number of segments in token: " + A);
            let O = w[0] + "." + w[1],
                $ = w[2],
                H, j;
            try {
                H = JSON.parse(_.decodeBase64StringUtf8(w[0]))
            } catch (G) {
                if (G instanceof Error) G.message = `Can't parse token envelope: ${w[0]}': ${G.message}`;
                throw G
            }
            if (!H) throw Error("Can't parse token envelope: " + w[0]);
            try {
                j = JSON.parse(_.decodeBase64StringUtf8(w[1]))
            } catch (G) {
                if (G instanceof Error) G.message = `Can't parse token payload '${w[0]}`;
                throw G
            }
            if (!j) throw Error("Can't parse token payload: " + w[1]);
            if (!Object.prototype.hasOwnProperty.call(q, H.kid)) throw Error("No pem found for envelope: " + JSON.stringify(H));
            let J = q[H.kid];
            if (H.alg === "ES256") $ = lW9.joseToDer($, "ES256").toString("base64");
            if (!await _.verify(J, O, $)) throw Error("Invalid token signature: " + A);
            if (!j.iat) throw Error("No issue time in token: " + JSON.stringify(j));
            if (!j.exp) throw Error("No expiration time in token: " + JSON.stringify(j));
            let D = Number(j.iat);
            if (isNaN(D)) throw Error("iat field using invalid format");
            let X = Number(j.exp);
            if (isNaN(X)) throw Error("exp field using invalid format");
            let P = new Date().getTime() / 1000;
            if (X >= P + z) throw Error("Expiration time too far in future: " + JSON.stringify(j));
            let W = D - wf.CLOCK_SKEW_SECS_,
                Z = X + wf.CLOCK_SKEW_SECS_;
            if (P < W) throw Error("Token used too early, " + P + " < " + W + ": " + JSON.stringify(j));
            if (P > Z) throw Error("Token used too late, " + P + " > " + Z + ": " + JSON.stringify(j));
            if (Y && Y.indexOf(j.iss) < 0) throw Error("Invalid issuer, expected one of [" + Y + "], but got " + j.iss);
            if (typeof K < "u" && K !== null) {
                let G = j.aud,
                    f = !1;
                if (K.constructor === Array) f = K.indexOf(G) > -1;
                else f = G === K;
                if (!f) throw Error("Wrong recipient, payload audience != requiredAudience")
            }
            return new nW9.LoginTicket(H, j)
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
    qt7.OAuth2Client = wf;
    wf.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
    wf.CLOCK_SKEW_SECS_ = 300;
    wf.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400
})
// @from(Ln 211413, Col 4)
OG8 = x((_t7) => {
    Object.defineProperty(_t7, "__esModule", {
        value: !0
    });
    _t7.Compute = void 0;
    var sW9 = _I(),
        Yt7 = Bg6(),
        tW9 = A36();
    class zt7 extends tW9.OAuth2Client {
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
                K = await Yt7.instance(z)
            } catch (z) {
                if (z instanceof sW9.GaxiosError) z.message = `Could not refresh access token: ${z.message}`, this.wrapError(z);
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
                K = await Yt7.instance(Y)
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
    _t7.Compute = zt7
})
// @from(Ln 211475, Col 4)
$G8 = x(($t7) => {
    Object.defineProperty($t7, "__esModule", {
        value: !0
    });
    $t7.IdTokenClient = void 0;
    var eW9 = A36();
    class Ot7 extends eW9.OAuth2Client {
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
    $t7.IdTokenClient = Ot7
})
// @from(Ln 211507, Col 4)
HG8 = x((Jt7) => {
    Object.defineProperty(Jt7, "__esModule", {
        value: !0
    });
    Jt7.GCPEnv = void 0;
    Jt7.clear = AZ9;
    Jt7.getEnv = qZ9;
    var jt7 = Bg6(),
        Nd;
    (function(A) {
        A.APP_ENGINE = "APP_ENGINE", A.KUBERNETES_ENGINE = "KUBERNETES_ENGINE", A.CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS", A.COMPUTE_ENGINE = "COMPUTE_ENGINE", A.CLOUD_RUN = "CLOUD_RUN", A.NONE = "NONE"
    })(Nd || (Jt7.GCPEnv = Nd = {}));
    var Qg6;

    function AZ9() {
        Qg6 = void 0
    }
    async function qZ9() {
        if (Qg6) return Qg6;
        return Qg6 = KZ9(), Qg6
    }
    async function KZ9() {
        let A = Nd.NONE;
        if (YZ9()) A = Nd.APP_ENGINE;
        else if (zZ9()) A = Nd.CLOUD_FUNCTIONS;
        else if (await OZ9())
            if (await wZ9()) A = Nd.KUBERNETES_ENGINE;
            else if (_Z9()) A = Nd.CLOUD_RUN;
        else A = Nd.COMPUTE_ENGINE;
        else A = Nd.NONE;
        return A
    }

    function YZ9() {
        return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME)
    }

    function zZ9() {
        return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET)
    }

    function _Z9() {
        return !!process.env.K_CONFIGURATION
    }
    async function wZ9() {
        try {
            return await jt7.instance("attributes/cluster-name"), !0
        } catch (A) {
            return !1
        }
    }
    async function OZ9() {
        return jt7.isAvailable()
    }
})
// @from(Ln 211562, Col 4)
jG8 = x((KC2, Dt7) => {
    var oM1 = tm().Buffer,
        jZ9 = x6("stream"),
        JZ9 = x6("util");

    function aM1(A) {
        if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = oM1.alloc(0), this;
        if (typeof A.pipe === "function") return this.buffer = oM1.alloc(0), A.pipe(this), this;
        if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
            this.emit("end", A), this.readable = !1, this.emit("close")
        }.bind(this)), this;
        throw TypeError("Unexpected data type (" + typeof A + ")")
    }
    JZ9.inherits(aM1, jZ9);
    aM1.prototype.write = function(q) {
        this.buffer = oM1.concat([this.buffer, oM1.from(q)]), this.emit("data", q)
    };
    aM1.prototype.end = function(q) {
        if (q) this.write(q);
        this.emit("end", q), this.emit("close"), this.writable = !1, this.readable = !1
    };
    Dt7.exports = aM1
})
// @from(Ln 211585, Col 4)
XG8 = x((YC2, Nt7) => {
    var j06 = tm().Buffer,
        YR = x6("crypto"),
        Pt7 = BJ1(),
        Xt7 = x6("util"),
        MZ9 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
        Ug6 = "secret must be a string or buffer",
        H06 = "key must be a string or a buffer",
        DZ9 = "key must be a string, a buffer or an object",
        MG8 = typeof YR.createPublicKey === "function";
    if (MG8) H06 += " or a KeyObject", Ug6 += "or a KeyObject";

    function Wt7(A) {
        if (j06.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (!MG8) throw $I(H06);
        if (typeof A !== "object") throw $I(H06);
        if (typeof A.type !== "string") throw $I(H06);
        if (typeof A.asymmetricKeyType !== "string") throw $I(H06);
        if (typeof A.export !== "function") throw $I(H06)
    }

    function Zt7(A) {
        if (j06.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (typeof A === "object") return;
        throw $I(DZ9)
    }

    function XZ9(A) {
        if (j06.isBuffer(A)) return;
        if (typeof A === "string") return A;
        if (!MG8) throw $I(Ug6);
        if (typeof A !== "object") throw $I(Ug6);
        if (A.type !== "secret") throw $I(Ug6);
        if (typeof A.export !== "function") throw $I(Ug6)
    }

    function DG8(A) {
        return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function Gt7(A) {
        A = A.toString();
        var q = 4 - A.length % 4;
        if (q !== 4)
            for (var K = 0; K < q; ++K) A += "=";
        return A.replace(/\-/g, "+").replace(/_/g, "/")
    }

    function $I(A) {
        var q = [].slice.call(arguments, 1),
            K = Xt7.format.bind(Xt7, A).apply(null, q);
        return TypeError(K)
    }

    function PZ9(A) {
        return j06.isBuffer(A) || typeof A === "string"
    }

    function dg6(A) {
        if (!PZ9(A)) A = JSON.stringify(A);
        return A
    }

    function ft7(A) {
        return function(K, Y) {
            XZ9(Y), K = dg6(K);
            var z = YR.createHmac("sha" + A, Y),
                _ = (z.update(K), z.digest("base64"));
            return DG8(_)
        }
    }
    var JG8, WZ9 = "timingSafeEqual" in YR ? function(q, K) {
        if (q.byteLength !== K.byteLength) return !1;
        return YR.timingSafeEqual(q, K)
    } : function(q, K) {
        if (!JG8) JG8 = E08();
        return JG8(q, K)
    };

    function ZZ9(A) {
        return function(K, Y, z) {
            var _ = ft7(A)(K, z);
            return WZ9(j06.from(Y), j06.from(_))
        }
    }

    function Tt7(A) {
        return function(K, Y) {
            Zt7(Y), K = dg6(K);
            var z = YR.createSign("RSA-SHA" + A),
                _ = (z.update(K), z.sign(Y, "base64"));
            return DG8(_)
        }
    }

    function vt7(A) {
        return function(K, Y, z) {
            Wt7(z), K = dg6(K), Y = Gt7(Y);
            var _ = YR.createVerify("RSA-SHA" + A);
            return _.update(K), _.verify(z, Y, "base64")
        }
    }

    function GZ9(A) {
        return function(K, Y) {
            Zt7(Y), K = dg6(K);
            var z = YR.createSign("RSA-SHA" + A),
                _ = (z.update(K), z.sign({
                    key: Y,
                    padding: YR.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: YR.constants.RSA_PSS_SALTLEN_DIGEST
                }, "base64"));
            return DG8(_)
        }
    }

    function fZ9(A) {
        return function(K, Y, z) {
            Wt7(z), K = dg6(K), Y = Gt7(Y);
            var _ = YR.createVerify("RSA-SHA" + A);
            return _.update(K), _.verify({
                key: z,
                padding: YR.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: YR.constants.RSA_PSS_SALTLEN_DIGEST
            }, Y, "base64")
        }
    }

    function TZ9(A) {
        var q = Tt7(A);
        return function() {
            var Y = q.apply(null, arguments);
            return Y = Pt7.derToJose(Y, "ES" + A), Y
        }
    }

    function vZ9(A) {
        var q = vt7(A);
        return function(Y, z, _) {
            z = Pt7.joseToDer(z, "ES" + A).toString("base64");
            var w = q(Y, z, _);
            return w
        }
    }

    function NZ9() {
        return function() {
            return ""
        }
    }

    function VZ9() {
        return function(q, K) {
            return K === ""
        }
    }
    Nt7.exports = function(q) {
        var K = {
                hs: ft7,
                rs: Tt7,
                ps: GZ9,
                es: TZ9,
                none: NZ9
            },
            Y = {
                hs: ZZ9,
                rs: vt7,
                ps: fZ9,
                es: vZ9,
                none: VZ9
            },
            z = q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
        if (!z) throw $I(MZ9, q);
        var _ = (z[1] || z[3]).toLowerCase(),
            w = z[2];
        return {
            sign: K[_](w),
            verify: Y[_](w)
        }
    }
})
// @from(Ln 211770, Col 4)
PG8 = x((zC2, Vt7) => {
    var kZ9 = x6("buffer").Buffer;
    Vt7.exports = function(q) {
        if (typeof q === "string") return q;
        if (typeof q === "number" || kZ9.isBuffer(q)) return q.toString();
        return JSON.stringify(q)
    }
})
// @from(Ln 211778, Col 4)
ht7 = x((_C2, Rt7) => {
    var EZ9 = tm().Buffer,
        kt7 = jG8(),
        yZ9 = XG8(),
        LZ9 = x6("stream"),
        Et7 = PG8(),
        WG8 = x6("util");

    function yt7(A, q) {
        return EZ9.from(A, q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function RZ9(A, q, K) {
        K = K || "utf8";
        var Y = yt7(Et7(A), "binary"),
            z = yt7(Et7(q), K);
        return WG8.format("%s.%s", Y, z)
    }

    function Lt7(A) {
        var {
            header: q,
            payload: K
        } = A, Y = A.secret || A.privateKey, z = A.encoding, _ = yZ9(q.alg), w = RZ9(q, K, z), O = _.sign(w, Y);
        return WG8.format("%s.%s", w, O)
    }

    function sM1(A) {
        var q = A.secret || A.privateKey || A.key,
            K = new kt7(q);
        this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = K, this.payload = new kt7(A.payload), this.secret.once("close", function() {
            if (!this.payload.writable && this.readable) this.sign()
        }.bind(this)), this.payload.once("close", function() {
            if (!this.secret.writable && this.readable) this.sign()
        }.bind(this))
    }
    WG8.inherits(sM1, LZ9);
    sM1.prototype.sign = function() {
        try {
            var q = Lt7({
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
    sM1.sign = Lt7;
    Rt7.exports = sM1
})
// @from(Ln 211831, Col 4)
Ft7 = x((wC2, gt7) => {
    var Ct7 = tm().Buffer,
        St7 = jG8(),
        hZ9 = XG8(),
        SZ9 = x6("stream"),
        It7 = PG8(),
        CZ9 = x6("util"),
        IZ9 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

    function bZ9(A) {
        return Object.prototype.toString.call(A) === "[object Object]"
    }

    function xZ9(A) {
        if (bZ9(A)) return A;
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }

    function bt7(A) {
        var q = A.split(".", 1)[0];
        return xZ9(Ct7.from(q, "base64").toString("binary"))
    }

    function uZ9(A) {
        return A.split(".", 2).join(".")
    }

    function xt7(A) {
        return A.split(".")[2]
    }

    function mZ9(A, q) {
        q = q || "utf8";
        var K = A.split(".")[1];
        return Ct7.from(K, "base64").toString(q)
    }

    function ut7(A) {
        return IZ9.test(A) && !!bt7(A)
    }

    function mt7(A, q, K) {
        if (!q) {
            var Y = Error("Missing algorithm parameter for jws.verify");
            throw Y.code = "MISSING_ALGORITHM", Y
        }
        A = It7(A);
        var z = xt7(A),
            _ = uZ9(A),
            w = hZ9(q);
        return w.verify(_, z, K)
    }

    function Bt7(A, q) {
        if (q = q || {}, A = It7(A), !ut7(A)) return null;
        var K = bt7(A);
        if (!K) return null;
        var Y = mZ9(A);
        if (K.typ === "JWT" || q.json) Y = JSON.parse(Y, q.encoding);
        return {
            header: K,
            payload: Y,
            signature: xt7(A)
        }
    }

    function J06(A) {
        A = A || {};
        var q = A.secret || A.publicKey || A.key,
            K = new St7(q);
        this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = K, this.signature = new St7(A.signature), this.secret.once("close", function() {
            if (!this.signature.writable && this.readable) this.verify()
        }.bind(this)), this.signature.once("close", function() {
            if (!this.secret.writable && this.readable) this.verify()
        }.bind(this))
    }
    CZ9.inherits(J06, SZ9);
    J06.prototype.verify = function() {
        try {
            var q = mt7(this.signature.buffer, this.algorithm, this.key.buffer),
                K = Bt7(this.signature.buffer, this.encoding);
            return this.emit("done", q, K), this.emit("data", q), this.emit("end"), this.readable = !1, q
        } catch (Y) {
            this.readable = !1, this.emit("error", Y), this.emit("close")
        }
    };
    J06.decode = Bt7;
    J06.isValid = ut7;
    J06.verify = mt7;
    gt7.exports = J06
})
// @from(Ln 211926, Col 4)
ZG8 = x((gZ9) => {
    var pt7 = ht7(),
        tM1 = Ft7(),
        BZ9 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
    gZ9.ALGORITHMS = BZ9;
    gZ9.sign = pt7.sign;
    gZ9.verify = tM1.verify;
    gZ9.decode = tM1.decode;
    gZ9.isValid = tM1.isValid;
    gZ9.createSign = function(q) {
        return new pt7(q)
    };
    gZ9.createVerify = function(q) {
        return new tM1(q)
    }
})
// @from(Ln 211942, Col 4)
ot7 = x(($t) => {
    var HI = $t && $t.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        Qt7 = $t && $t.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        jI, M06, GG8, Ut7, dt7, fG8, TG8, ct7;
    Object.defineProperty($t, "__esModule", {
        value: !0
    });
    $t.GoogleToken = void 0;
    var lt7 = x6("fs"),
        iZ9 = _I(),
        nZ9 = ZG8(),
        rZ9 = x6("path"),
        oZ9 = x6("util"),
        it7 = lt7.readFile ? (0, oZ9.promisify)(lt7.readFile) : async () => {
            throw new D06("use key rather than keyFile.", "MISSING_CREDENTIALS")
        }, nt7 = "https://www.googleapis.com/oauth2/v4/token", aZ9 = "https://accounts.google.com/o/oauth2/revoke?token=";
    class D06 extends Error {
        constructor(A, q) {
            super(A);
            this.code = q
        }
    }
    class rt7 {
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
            jI.add(this), this.transporter = {
                request: (q) => (0, iZ9.request)(q)
            }, M06.set(this, void 0), HI(this, jI, "m", TG8).call(this, A)
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
                HI(this, jI, "m", GG8).call(this, q).then((Y) => K(null, Y), A);
                return
            }
            return HI(this, jI, "m", GG8).call(this, q)
        }
        async getCredentials(A) {
            switch (rZ9.extname(A)) {
                case ".json": {
                    let K = await it7(A, "utf8"),
                        Y = JSON.parse(K),
                        z = Y.private_key,
                        _ = Y.client_email;
                    if (!z || !_) throw new D06("private_key and client_email are required.", "MISSING_CREDENTIALS");
                    return {
                        privateKey: z,
                        clientEmail: _
                    }
                }
                case ".der":
                case ".crt":
                case ".pem":
                    return {
                        privateKey: await it7(A, "utf8")
                    };
                case ".p12":
                case ".pfx":
                    throw new D06("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
                default:
                    throw new D06("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE")
            }
        }
        revokeToken(A) {
            if (A) {
                HI(this, jI, "m", fG8).call(this).then(() => A(), A);
                return
            }
            return HI(this, jI, "m", fG8).call(this)
        }
    }
    $t.GoogleToken = rt7;
    M06 = new WeakMap, jI = new WeakSet, GG8 = async function(q) {
        if (HI(this, M06, "f") && !q.forceRefresh) return HI(this, M06, "f");
        try {
            return await Qt7(this, M06, HI(this, jI, "m", Ut7).call(this, q), "f")
        } finally {
            Qt7(this, M06, void 0, "f")
        }
    }, Ut7 = async function(q) {
        if (this.isTokenExpiring() === !1 && q.forceRefresh === !1) return Promise.resolve(this.rawToken);
        if (!this.key && !this.keyFile) throw Error("No key or keyFile set.");
        if (!this.key && this.keyFile) {
            let K = await this.getCredentials(this.keyFile);
            if (this.key = K.privateKey, this.iss = K.clientEmail || this.iss, !K.clientEmail) HI(this, jI, "m", dt7).call(this)
        }
        return HI(this, jI, "m", ct7).call(this)
    }, dt7 = function() {
        if (!this.iss) throw new D06("email is required.", "MISSING_CREDENTIALS")
    }, fG8 = async function() {
        if (!this.accessToken) throw Error("No token to revoke.");
        let q = aZ9 + this.accessToken;
        await this.transporter.request({
            url: q,
            retry: !0
        }), HI(this, jI, "m", TG8).call(this, {
            email: this.iss,
            sub: this.sub,
            key: this.key,
            keyFile: this.keyFile,
            scope: this.scope,
            additionalClaims: this.additionalClaims
        })
    }, TG8 = function(q = {}) {
        if (this.keyFile = q.keyFile, this.key = q.key, this.rawToken = void 0, this.iss = q.email || q.iss, this.sub = q.sub, this.additionalClaims = q.additionalClaims, typeof q.scope === "object") this.scope = q.scope.join(" ");
        else this.scope = q.scope;
        if (this.eagerRefreshThresholdMillis = q.eagerRefreshThresholdMillis, q.transporter) this.transporter = q.transporter
    }, ct7 = async function() {
        var q, K;
        let Y = Math.floor(new Date().getTime() / 1000),
            z = this.additionalClaims || {},
            _ = Object.assign({
                iss: this.iss,
                scope: this.scope,
                aud: nt7,
                exp: Y + 3600,
                iat: Y,
                sub: this.sub
            }, z),
            w = nZ9.sign({
                header: {
                    alg: "RS256"
                },
                payload: _,
                secret: this.key
            });
        try {
            let O = await this.transporter.request({
                method: "POST",
                url: nt7,
                data: {
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: w
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                responseType: "json",
                retryConfig: {
                    httpMethodsToRetry: ["POST"]
                }
            });
            return this.rawToken = O.data, this.expiresAt = O.data.expires_in === null || O.data.expires_in === void 0 ? void 0 : (Y + O.data.expires_in) * 1000, this.rawToken
        } catch (O) {
            this.rawToken = void 0, this.tokenExpires = void 0;
            let $ = O.response && ((q = O.response) === null || q === void 0 ? void 0 : q.data) ? (K = O.response) === null || K === void 0 ? void 0 : K.data : {};
            if ($.error) {
                let H = $.error_description ? `: ${$.error_description}` : "";
                O.message = `${$.error}${H}`
            }
            throw O
        }
    }
})
// @from(Ln 212131, Col 4)
NG8 = x((st7) => {
    Object.defineProperty(st7, "__esModule", {
        value: !0
    });
    st7.JWTAccess = void 0;
    var sZ9 = ZG8(),
        tZ9 = Ot(),
        at7 = {
            alg: "RS256",
            typ: "JWT"
        };
    class vG8 {
        constructor(A, q, K, Y) {
            this.cache = new tZ9.LRUCache({
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
                _ = Date.now();
            if (z && z.expiration - _ > this.eagerRefreshThresholdMillis) return z.headers;
            let w = Math.floor(Date.now() / 1000),
                O = vG8.getExpirationTime(w),
                $;
            if (Array.isArray(K)) K = K.join(" ");
            if (K) $ = {
                iss: this.email,
                sub: this.email,
                scope: K,
                exp: O,
                iat: w
            };
            else $ = {
                iss: this.email,
                sub: this.email,
                aud: A,
                exp: O,
                iat: w
            };
            if (q) {
                for (let D in $)
                    if (q[D]) throw Error(`The '${D}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`)
            }
            let H = this.keyId ? {
                    ...at7,
                    kid: this.keyId
                } : at7,
                j = Object.assign($, q),
                M = {
                    Authorization: `Bearer ${sZ9.sign({header:H,payload:j,secret:this.key})}`
                };
            return this.cache.set(Y, {
                expiration: O * 1000,
                headers: M
            }), M
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
    st7.JWTAccess = vG8
})
// @from(Ln 212226, Col 4)
kG8 = x((Ae7) => {
    Object.defineProperty(Ae7, "__esModule", {
        value: !0
    });
    Ae7.JWT = void 0;
    var et7 = ot7(),
        eZ9 = NG8(),
        AG9 = A36(),
        eM1 = wB();
    class VG8 extends AG9.OAuth2Client {
        constructor(A, q, K, Y, z, _) {
            let w = A && typeof A === "object" ? A : {
                email: A,
                keyFile: q,
                key: K,
                keyId: _,
                scopes: Y,
                subject: z
            };
            super(w);
            this.email = w.email, this.keyFile = w.keyFile, this.key = w.key, this.keyId = w.keyId, this.scopes = w.scopes, this.subject = w.subject, this.additionalClaims = w.additionalClaims, this.credentials = {
                refresh_token: "jwt-placeholder",
                expiry_date: 1
            }
        }
        createScoped(A) {
            let q = new VG8(this);
            return q.scopes = A, q
        }
        async getRequestMetadataAsync(A) {
            A = this.defaultServicePath ? `https://${this.defaultServicePath}/` : A;
            let q = !this.hasUserScopes() && A || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== eM1.DEFAULT_UNIVERSE;
            if (this.subject && this.universeDomain !== eM1.DEFAULT_UNIVERSE) throw RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${eM1.DEFAULT_UNIVERSE}`);
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
                    if (!this.access) this.access = new eZ9.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
                    let K;
                    if (this.hasUserScopes()) K = this.scopes;
                    else if (!A) K = this.defaultScopes;
                    let Y = this.useJWTAccessWithScope || this.universeDomain !== eM1.DEFAULT_UNIVERSE,
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
            let q = new et7.GoogleToken({
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
            if (!this.gtoken) this.gtoken = new et7.GoogleToken({
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
    Ae7.JWT = VG8
})
// @from(Ln 212392, Col 4)
EG8 = x((Ke7) => {
    Object.defineProperty(Ke7, "__esModule", {
        value: !0
    });
    Ke7.UserRefreshClient = Ke7.USER_REFRESH_ACCOUNT_TYPE = void 0;
    var qG9 = A36(),
        KG9 = x6("querystring");
    Ke7.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
    class AD1 extends qG9.OAuth2Client {
        constructor(A, q, K, Y, z) {
            let _ = A && typeof A === "object" ? A : {
                clientId: A,
                clientSecret: q,
                refreshToken: K,
                eagerRefreshThresholdMillis: Y,
                forceRefreshOnFailure: z
            };
            super(_);
            this._refreshToken = _.refreshToken, this.credentials.refresh_token = _.refreshToken
        }
        async refreshTokenNoCache(A) {
            return super.refreshTokenNoCache(this._refreshToken)
        }
        async fetchIdToken(A) {
            return (await this.transporter.request({
                ...AD1.RETRY_CONFIG,
                url: this.endpoints.oauth2TokenUrl,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: (0, KG9.stringify)({
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
            let q = new AD1;
            return q.fromJSON(A), q
        }
    }
    Ke7.UserRefreshClient = AD1
})
// @from(Ln 212465, Col 4)
yG8 = x((_e7) => {
    Object.defineProperty(_e7, "__esModule", {
        value: !0
    });
    _e7.Impersonated = _e7.IMPERSONATED_ACCOUNT_TYPE = void 0;
    var ze7 = A36(),
        zG9 = _I(),
        _G9 = Ot();
    _e7.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
    class cg6 extends ze7.OAuth2Client {
        constructor(A = {}) {
            var q, K, Y, z, _, w;
            super(A);
            if (this.credentials = {
                    expiry_date: 1,
                    refresh_token: "impersonated-placeholder"
                }, this.sourceClient = (q = A.sourceClient) !== null && q !== void 0 ? q : new ze7.OAuth2Client, this.targetPrincipal = (K = A.targetPrincipal) !== null && K !== void 0 ? K : "", this.delegates = (Y = A.delegates) !== null && Y !== void 0 ? Y : [], this.targetScopes = (z = A.targetScopes) !== null && z !== void 0 ? z : [], this.lifetime = (_ = A.lifetime) !== null && _ !== void 0 ? _ : 3600, !(0, _G9.originalOrCamelOptions)(A).get("universe_domain")) this.universeDomain = this.sourceClient.universeDomain;
            else if (this.sourceClient.universeDomain !== this.universeDomain) throw RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
            this.endpoint = (w = A.endpoint) !== null && w !== void 0 ? w : `https://iamcredentials.${this.universeDomain}`
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
                ...cg6.RETRY_CONFIG,
                url: K,
                data: Y,
                method: "POST"
            })).data
        }
        getTargetPrincipal() {
            return this.targetPrincipal
        }
        async refreshToken() {
            var A, q, K, Y, z, _;
            try {
                await this.sourceClient.getAccessToken();
                let w = "projects/-/serviceAccounts/" + this.targetPrincipal,
                    O = `${this.endpoint}/v1/${w}:generateAccessToken`,
                    $ = {
                        delegates: this.delegates,
                        scope: this.targetScopes,
                        lifetime: this.lifetime + "s"
                    },
                    H = await this.sourceClient.request({
                        ...cg6.RETRY_CONFIG,
                        url: O,
                        data: $,
                        method: "POST"
                    }),
                    j = H.data;
                return this.credentials.access_token = j.accessToken, this.credentials.expiry_date = Date.parse(j.expireTime), {
                    tokens: this.credentials,
                    res: H
                }
            } catch (w) {
                if (!(w instanceof Error)) throw w;
                let O = 0,
                    $ = "";
                if (w instanceof zG9.GaxiosError) O = (K = (q = (A = w === null || w === void 0 ? void 0 : w.response) === null || A === void 0 ? void 0 : A.data) === null || q === void 0 ? void 0 : q.error) === null || K === void 0 ? void 0 : K.status, $ = (_ = (z = (Y = w === null || w === void 0 ? void 0 : w.response) === null || Y === void 0 ? void 0 : Y.data) === null || z === void 0 ? void 0 : z.error) === null || _ === void 0 ? void 0 : _.message;
                if (O && $) throw w.message = `${O}: unable to impersonate: ${$}`, w;
                else throw w.message = `unable to impersonate: ${w}`, w
            }
        }
        async fetchIdToken(A, q) {
            var K, Y;
            await this.sourceClient.getAccessToken();
            let z = `projects/-/serviceAccounts/${this.targetPrincipal}`,
                _ = `${this.endpoint}/v1/${z}:generateIdToken`,
                w = {
                    delegates: this.delegates,
                    audience: A,
                    includeEmail: (K = q === null || q === void 0 ? void 0 : q.includeEmail) !== null && K !== void 0 ? K : !0,
                    useEmailAzp: (Y = q === null || q === void 0 ? void 0 : q.includeEmail) !== null && Y !== void 0 ? Y : !0
                };
            return (await this.sourceClient.request({
                ...cg6.RETRY_CONFIG,
                url: _,
                data: w,
                method: "POST"
            })).data.token
        }
    }
    _e7.Impersonated = cg6
})
// @from(Ln 212555, Col 4)
LG8 = x((He7) => {
    Object.defineProperty(He7, "__esModule", {
        value: !0
    });
    He7.OAuthClientAuthHandler = void 0;
    He7.getErrorFromOAuthErrorResponse = HG9;
    var Oe7 = x6("querystring"),
        OG9 = w06(),
        $G9 = ["PUT", "POST", "PATCH"];
    class $e7 {
        constructor(A) {
            this.clientAuthentication = A, this.crypto = (0, OG9.createCrypto)()
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
                    _ = this.crypto.encodeBase64StringUtf8(`${Y}:${z}`);
                Object.assign(A.headers, {
                    Authorization: `Basic ${_}`
                })
            }
        }
        injectAuthenticatedRequestBody(A) {
            var q;
            if (((q = this.clientAuthentication) === null || q === void 0 ? void 0 : q.confidentialClientType) === "request-body") {
                let K = (A.method || "GET").toUpperCase();
                if ($G9.indexOf(K) !== -1) {
                    let Y, z = A.headers || {};
                    for (let _ in z)
                        if (_.toLowerCase() === "content-type" && z[_]) {
                            Y = z[_].toLowerCase();
                            break
                        } if (Y === "application/x-www-form-urlencoded") {
                        A.data = A.data || "";
                        let _ = Oe7.parse(A.data);
                        Object.assign(_, {
                            client_id: this.clientAuthentication.clientId,
                            client_secret: this.clientAuthentication.clientSecret || ""
                        }), A.data = Oe7.stringify(_)
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
    He7.OAuthClientAuthHandler = $e7;

    function HG9(A, q) {
        let {
            error: K,
            error_description: Y,
            error_uri: z
        } = A, _ = `Error code ${K}`;
        if (typeof Y < "u") _ += `: ${Y}`;
        if (typeof z < "u") _ += ` - ${z}`;
        let w = Error(_);
        if (q) {
            let O = Object.keys(q);
            if (q.stack) O.push("stack");
            O.forEach(($) => {
                if ($ !== "message") Object.defineProperty(w, $, {
                    value: q[$],
                    writable: !1,
                    enumerable: !0
                })
            })
        }
        return w
    }
})
// @from(Ln 212645, Col 4)
hG8 = x((Me7) => {
    Object.defineProperty(Me7, "__esModule", {
        value: !0
    });
    Me7.StsCredentials = void 0;
    var JG9 = _I(),
        MG9 = x6("querystring"),
        DG9 = Fg6(),
        Je7 = LG8();
    class RG8 extends Je7.OAuthClientAuthHandler {
        constructor(A, q) {
            super(q);
            this.tokenExchangeEndpoint = A, this.transporter = new DG9.DefaultTransporter
        }
        async exchangeToken(A, q, K) {
            var Y, z, _;
            let w = {
                grant_type: A.grantType,
                resource: A.resource,
                audience: A.audience,
                scope: (Y = A.scope) === null || Y === void 0 ? void 0 : Y.join(" "),
                requested_token_type: A.requestedTokenType,
                subject_token: A.subjectToken,
                subject_token_type: A.subjectTokenType,
                actor_token: (z = A.actingParty) === null || z === void 0 ? void 0 : z.actorToken,
                actor_token_type: (_ = A.actingParty) === null || _ === void 0 ? void 0 : _.actorTokenType,
                options: K && JSON.stringify(K)
            };
            Object.keys(w).forEach((H) => {
                if (typeof w[H] > "u") delete w[H]
            });
            let O = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            Object.assign(O, q || {});
            let $ = {
                ...RG8.RETRY_CONFIG,
                url: this.tokenExchangeEndpoint.toString(),
                method: "POST",
                headers: O,
                data: MG9.stringify(w),
                responseType: "json"
            };
            this.applyClientAuthenticationOptions($);
            try {
                let H = await this.transporter.request($),
                    j = H.data;
                return j.res = H, j
            } catch (H) {
                if (H instanceof JG9.GaxiosError && H.response) throw (0, Je7.getErrorFromOAuthErrorResponse)(H.response.data, H);
                throw H
            }
        }
    }
    Me7.StsCredentials = RG8
})
// @from(Ln 212701, Col 4)
Ht = x((JX) => {
    var SG8 = JX && JX.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        Xe7 = JX && JX.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        CG8, X06, We7;
    Object.defineProperty(JX, "__esModule", {
        value: !0
    });
    JX.BaseExternalAccountClient = JX.DEFAULT_UNIVERSE = JX.CLOUD_RESOURCE_MANAGER = JX.EXTERNAL_ACCOUNT_TYPE = JX.EXPIRATION_TIME_OFFSET = void 0;
    var XG9 = x6("stream"),
        PG9 = wB(),
        WG9 = hG8(),
        Pe7 = Ot(),
        ZG9 = "urn:ietf:params:oauth:grant-type:token-exchange",
        GG9 = "urn:ietf:params:oauth:token-type:access_token",
        IG8 = "https://www.googleapis.com/auth/cloud-platform",
        fG9 = 3600;
    JX.EXPIRATION_TIME_OFFSET = 300000;
    JX.EXTERNAL_ACCOUNT_TYPE = "external_account";
    JX.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
    var TG9 = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+",
        vG9 = "https://sts.{universeDomain}/v1/token",
        NG9 = AG8(),
        VG9 = wB();
    Object.defineProperty(JX, "DEFAULT_UNIVERSE", {
        enumerable: !0,
        get: function() {
            return VG9.DEFAULT_UNIVERSE
        }
    });
    class qD1 extends PG9.AuthClient {
        constructor(A, q) {
            var K;
            super({
                ...A,
                ...q
            });
            CG8.add(this), X06.set(this, null);
            let Y = (0, Pe7.originalOrCamelOptions)(A),
                z = Y.get("type");
            if (z && z !== JX.EXTERNAL_ACCOUNT_TYPE) throw Error(`Expected "${JX.EXTERNAL_ACCOUNT_TYPE}" type but received "${A.type}"`);
            let _ = Y.get("client_id"),
                w = Y.get("client_secret"),
                O = (K = Y.get("token_url")) !== null && K !== void 0 ? K : vG9.replace("{universeDomain}", this.universeDomain),
                $ = Y.get("subject_token_type"),
                H = Y.get("workforce_pool_user_project"),
                j = Y.get("service_account_impersonation_url"),
                J = Y.get("service_account_impersonation"),
                M = (0, Pe7.originalOrCamelOptions)(J).get("token_lifetime_seconds");
            if (this.cloudResourceManagerURL = new URL(Y.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`), _) this.clientAuth = {
                confidentialClientType: "basic",
                clientId: _,
                clientSecret: w
            };
            this.stsCredential = new WG9.StsCredentials(O, this.clientAuth), this.scopes = Y.get("scopes") || [IG8], this.cachedAccessToken = null, this.audience = Y.get("audience"), this.subjectTokenType = $, this.workforcePoolUserProject = H;
            let D = new RegExp(TG9);
            if (this.workforcePoolUserProject && !this.audience.match(D)) throw Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
            if (this.serviceAccountImpersonationUrl = j, this.serviceAccountImpersonationLifetime = M, this.serviceAccountImpersonationLifetime) this.configLifetimeRequested = !0;
            else this.configLifetimeRequested = !1, this.serviceAccountImpersonationLifetime = fG9;
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
                        ...qD1.RETRY_CONFIG,
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
                    let _ = z.status,
                        w = z.config.data instanceof XG9.Readable;
                    if (!q && (_ === 401 || _ === 403) && !w && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(A, !0)
                }
                throw Y
            }
            return K
        }
        async refreshAccessTokenAsync() {
            Xe7(this, X06, SG8(this, X06, "f") || SG8(this, CG8, "m", We7).call(this), "f");
            try {
                return await SG8(this, X06, "f")
            } finally {
                Xe7(this, X06, null, "f")
            }
        }
        getProjectNumber(A) {
            let q = A.match(/\/projects\/([^/]+)/);
            if (!q) return null;
            return q[1]
        }
        async getImpersonatedAccessToken(A) {
            let q = {
                    ...qD1.RETRY_CONFIG,
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
            return this.scopes || [IG8]
        }
        getMetricsHeaderValue() {
            let A = process.version.replace(/^v/, ""),
                q = this.serviceAccountImpersonationUrl !== void 0,
                K = this.credentialSourceType ? this.credentialSourceType : "unknown";
            return `gl-node/${A} auth/${NG9.version} google-byoid-sdk source/${K} sa-impersonation/${q} config-lifetime/${this.configLifetimeRequested}`
        }
    }
    JX.BaseExternalAccountClient = qD1;
    X06 = new WeakMap, CG8 = new WeakSet, We7 = async function() {
        let q = await this.retrieveSubjectToken(),
            K = {
                grantType: ZG9,
                audience: this.audience,
                requestedTokenType: GG9,
                subjectToken: q,
                subjectTokenType: this.subjectTokenType,
                scope: this.serviceAccountImpersonationUrl ? [IG8] : this.getScopesArray()
            },
            Y = !this.clientAuth && this.workforcePoolUserProject ? {
                userProject: this.workforcePoolUserProject
            } : void 0,
            z = {
                "x-goog-api-client": this.getMetricsHeaderValue()
            },
            _ = await this.stsCredential.exchangeToken(K, z, Y);
        if (this.serviceAccountImpersonationUrl) this.cachedAccessToken = await this.getImpersonatedAccessToken(_.access_token);
        else if (_.expires_in) this.cachedAccessToken = {
            access_token: _.access_token,
            expiry_date: new Date().getTime() + _.expires_in * 1000,
            res: _.res
        };
        else this.cachedAccessToken = {
            access_token: _.access_token,
            res: _.res
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
// @from(Ln 212926, Col 4)
Te7 = x((Ge7) => {
    var bG8, xG8, uG8;
    Object.defineProperty(Ge7, "__esModule", {
        value: !0
    });
    Ge7.FileSubjectTokenSupplier = void 0;
    var mG8 = x6("util"),
        BG8 = x6("fs"),
        kG9 = (0, mG8.promisify)((bG8 = BG8.readFile) !== null && bG8 !== void 0 ? bG8 : () => {}),
        EG9 = (0, mG8.promisify)((xG8 = BG8.realpath) !== null && xG8 !== void 0 ? xG8 : () => {}),
        yG9 = (0, mG8.promisify)((uG8 = BG8.lstat) !== null && uG8 !== void 0 ? uG8 : () => {});
    class Ze7 {
        constructor(A) {
            this.filePath = A.filePath, this.formatType = A.formatType, this.subjectTokenFieldName = A.subjectTokenFieldName
        }
        async getSubjectToken(A) {
            let q = this.filePath;
            try {
                if (q = await EG9(q), !(await yG9(q)).isFile()) throw Error()
            } catch (z) {
                if (z instanceof Error) z.message = `The file at ${q} does not exist, or it is not a file. ${z.message}`;
                throw z
            }
            let K, Y = await kG9(q, {
                encoding: "utf8"
            });
            if (this.formatType === "text") K = Y;
            else if (this.formatType === "json" && this.subjectTokenFieldName) K = JSON.parse(Y)[this.subjectTokenFieldName];
            if (!K) throw Error("Unable to parse the subject_token from the credential_source file");
            return K
        }
    }
    Ge7.FileSubjectTokenSupplier = Ze7
})
// @from(Ln 212960, Col 4)
ke7 = x((Ne7) => {
    Object.defineProperty(Ne7, "__esModule", {
        value: !0
    });
    Ne7.UrlSubjectTokenSupplier = void 0;
    class ve7 {
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
    Ne7.UrlSubjectTokenSupplier = ve7
})
// @from(Ln 212986, Col 4)
pG8 = x((Ee7) => {
    Object.defineProperty(Ee7, "__esModule", {
        value: !0
    });
    Ee7.IdentityPoolClient = void 0;
    var LG9 = Ht(),
        gG8 = Ot(),
        RG9 = Te7(),
        hG9 = ke7();
    class FG8 extends LG9.BaseExternalAccountClient {
        constructor(A, q) {
            super(A, q);
            let K = (0, gG8.originalOrCamelOptions)(A),
                Y = K.get("credential_source"),
                z = K.get("subject_token_supplier");
            if (!Y && !z) throw Error("A credential source or subject token supplier must be specified.");
            if (Y && z) throw Error("Only one of credential source or subject token supplier can be specified.");
            if (z) this.subjectTokenSupplier = z, this.credentialSourceType = "programmatic";
            else {
                let _ = (0, gG8.originalOrCamelOptions)(Y),
                    w = (0, gG8.originalOrCamelOptions)(_.get("format")),
                    O = w.get("type") || "text",
                    $ = w.get("subject_token_field_name");
                if (O !== "json" && O !== "text") throw Error(`Invalid credential_source format "${O}"`);
                if (O === "json" && !$) throw Error("Missing subject_token_field_name for JSON credential_source format");
                let H = _.get("file"),
                    j = _.get("url"),
                    J = _.get("headers");
                if (H && j) throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
                else if (H && !j) this.credentialSourceType = "file", this.subjectTokenSupplier = new RG9.FileSubjectTokenSupplier({
                    filePath: H,
                    formatType: O,
                    subjectTokenFieldName: $
                });
                else if (!H && j) this.credentialSourceType = "url", this.subjectTokenSupplier = new hG9.UrlSubjectTokenSupplier({
                    url: j,
                    formatType: O,
                    subjectTokenFieldName: $,
                    headers: J,
                    additionalGaxiosOptions: FG8.RETRY_CONFIG
                });
                else throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.')
            }
        }
        async retrieveSubjectToken() {
            return this.subjectTokenSupplier.getSubjectToken(this.supplierContext)
        }
    }
    Ee7.IdentityPoolClient = FG8
})
// @from(Ln 213036, Col 4)
QG8 = x((Se7) => {
    Object.defineProperty(Se7, "__esModule", {
        value: !0
    });
    Se7.AwsRequestSigner = void 0;
    var Re7 = w06(),
        Le7 = "AWS4-HMAC-SHA256",
        SG9 = "aws4_request";
    class he7 {
        constructor(A, q) {
            this.getCredentials = A, this.region = q, this.crypto = (0, Re7.createCrypto)()
        }
        async getRequestOptions(A) {
            if (!A.url) throw Error('"url" is required in "amzOptions"');
            let q = typeof A.data === "object" ? JSON.stringify(A.data) : A.data,
                K = A.url,
                Y = A.method || "GET",
                z = A.body || q,
                _ = A.headers,
                w = await this.getCredentials(),
                O = new URL(K),
                $ = await IG9({
                    crypto: this.crypto,
                    host: O.host,
                    canonicalUri: O.pathname,
                    canonicalQuerystring: O.search.substr(1),
                    method: Y,
                    region: this.region,
                    securityCredentials: w,
                    requestPayload: z,
                    additionalAmzHeaders: _
                }),
                H = Object.assign($.amzDate ? {
                    "x-amz-date": $.amzDate
                } : {}, {
                    Authorization: $.authorizationHeader,
                    host: O.host
                }, _ || {});
            if (w.token) Object.assign(H, {
                "x-amz-security-token": w.token
            });
            let j = {
                url: K,
                method: Y,
                headers: H
            };
            if (typeof z < "u") j.body = z;
            return j
        }
    }
    Se7.AwsRequestSigner = he7;
    async function lg6(A, q, K) {
        return await A.signWithHmacSha256(q, K)
    }
    async function CG9(A, q, K, Y, z) {
        let _ = await lg6(A, `AWS4${q}`, K),
            w = await lg6(A, _, Y),
            O = await lg6(A, w, z);
        return await lg6(A, O, "aws4_request")
    }
    async function IG9(A) {
        let q = A.additionalAmzHeaders || {},
            K = A.requestPayload || "",
            Y = A.host.split(".")[0],
            z = new Date,
            _ = z.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, ""),
            w = z.toISOString().replace(/[-]/g, "").replace(/T.*/, ""),
            O = {};
        if (Object.keys(q).forEach((f) => {
                O[f.toLowerCase()] = q[f]
            }), A.securityCredentials.token) O["x-amz-security-token"] = A.securityCredentials.token;
        let $ = Object.assign({
                host: A.host
            }, O.date ? {} : {
                "x-amz-date": _
            }, O),
            H = "",
            j = Object.keys($).sort();
        j.forEach((f) => {
            H += `${f}:${$[f]}
`
        });
        let J = j.join(";"),
            M = await A.crypto.sha256DigestHex(K),
            D = `${A.method}
${A.canonicalUri}
${A.canonicalQuerystring}
${H}
${J}
${M}`,
            X = `${w}/${A.region}/${Y}/${SG9}`,
            P = `${Le7}
${_}
${X}
` + await A.crypto.sha256DigestHex(D),
            W = await CG9(A.crypto, A.securityCredentials.secretAccessKey, w, A.region, Y),
            Z = await lg6(A.crypto, W, P),
            G = `${Le7} Credential=${A.securityCredentials.accessKeyId}/${X}, SignedHeaders=${J}, Signature=${(0,Re7.fromArrayBufferToHex)(Z)}`;
        return {
            amzDate: O.date ? void 0 : _,
            authorizationHeader: G,
            canonicalQuerystring: A.canonicalQuerystring
        }
    }
})
// @from(Ln 213141, Col 4)
ue7 = x((P06) => {
    var Vd = P06 && P06.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        JI, UG8, Ie7, be7, KD1, dG8;
    Object.defineProperty(P06, "__esModule", {
        value: !0
    });
    P06.DefaultAwsSecurityCredentialsSupplier = void 0;
    class xe7 {
        constructor(A) {
            JI.add(this), this.regionUrl = A.regionUrl, this.securityCredentialsUrl = A.securityCredentialsUrl, this.imdsV2SessionTokenUrl = A.imdsV2SessionTokenUrl, this.additionalGaxiosOptions = A.additionalGaxiosOptions
        }
        async getAwsRegion(A) {
            if (Vd(this, JI, "a", KD1)) return Vd(this, JI, "a", KD1);
            let q = {};
            if (!Vd(this, JI, "a", KD1) && this.imdsV2SessionTokenUrl) q["x-aws-ec2-metadata-token"] = await Vd(this, JI, "m", UG8).call(this, A.transporter);
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
            if (Vd(this, JI, "a", dG8)) return Vd(this, JI, "a", dG8);
            let q = {};
            if (this.imdsV2SessionTokenUrl) q["x-aws-ec2-metadata-token"] = await Vd(this, JI, "m", UG8).call(this, A.transporter);
            let K = await Vd(this, JI, "m", Ie7).call(this, q, A.transporter),
                Y = await Vd(this, JI, "m", be7).call(this, K, q, A.transporter);
            return {
                accessKeyId: Y.AccessKeyId,
                secretAccessKey: Y.SecretAccessKey,
                token: Y.Token
            }
        }
    }
    P06.DefaultAwsSecurityCredentialsSupplier = xe7;
    JI = new WeakSet, UG8 = async function(q) {
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
    }, Ie7 = async function(q, K) {
        if (!this.securityCredentialsUrl) throw Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
        let Y = {
            ...this.additionalGaxiosOptions,
            url: this.securityCredentialsUrl,
            method: "GET",
            responseType: "text",
            headers: q
        };
        return (await K.request(Y)).data
    }, be7 = async function(q, K, Y) {
        return (await Y.request({
            ...this.additionalGaxiosOptions,
            url: `${this.securityCredentialsUrl}/${q}`,
            responseType: "json",
            headers: K
        })).data
    }, KD1 = function() {
        return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null
    }, dG8 = function() {
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            token: process.env.AWS_SESSION_TOKEN
        };
        return null
    }
})
// @from(Ln 213224, Col 4)
cG8 = x((W06) => {
    var bG9 = W06 && W06.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        YD1, Be7;
    Object.defineProperty(W06, "__esModule", {
        value: !0
    });
    W06.AwsClient = void 0;
    var xG9 = QG8(),
        uG9 = Ht(),
        mG9 = ue7(),
        me7 = Ot();
    class ig6 extends uG9.BaseExternalAccountClient {
        constructor(A, q) {
            super(A, q);
            let K = (0, me7.originalOrCamelOptions)(A),
                Y = K.get("credential_source"),
                z = K.get("aws_security_credentials_supplier");
            if (!Y && !z) throw Error("A credential source or AWS security credentials supplier must be specified.");
            if (Y && z) throw Error("Only one of credential source or AWS security credentials supplier can be specified.");
            if (z) this.awsSecurityCredentialsSupplier = z, this.regionalCredVerificationUrl = bG9(YD1, YD1, "f", Be7), this.credentialSourceType = "programmatic";
            else {
                let _ = (0, me7.originalOrCamelOptions)(Y);
                this.environmentId = _.get("environment_id");
                let w = _.get("region_url"),
                    O = _.get("url"),
                    $ = _.get("imdsv2_session_token_url");
                this.awsSecurityCredentialsSupplier = new mG9.DefaultAwsSecurityCredentialsSupplier({
                    regionUrl: w,
                    securityCredentialsUrl: O,
                    imdsV2SessionTokenUrl: $
                }), this.regionalCredVerificationUrl = _.get("regional_cred_verification_url"), this.credentialSourceType = "aws", this.validateEnvironmentId()
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
            if (!this.awsRequestSigner) this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext), this.awsRequestSigner = new xG9.AwsRequestSigner(async () => {
                return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext)
            }, this.region);
            let A = await this.awsRequestSigner.getRequestOptions({
                    ...YD1.RETRY_CONFIG,
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
    W06.AwsClient = ig6;
    YD1 = ig6;
    Be7 = {
        value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15"
    };
    ig6.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
    ig6.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254"
})