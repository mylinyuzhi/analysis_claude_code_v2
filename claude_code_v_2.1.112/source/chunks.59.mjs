
// @from(Ln 152161, Col 4)
y26 = p((hpq) => {
    Object.defineProperty(hpq, "__esModule", {
        value: !0
    });
    hpq.OAuth2Client = hpq.ClientAuthentication = hpq.CertificateFormat = hpq.CodeChallengeMethod = void 0;
    var KY_ = hB(),
        Jh1 = d6("querystring"),
        _Y_ = d6("stream"),
        zY_ = yE1(),
        Xh1 = eV6(),
        YY_ = oQ(),
        AY_ = Hh1(),
        Lpq;
    (function(q) {
        q.Plain = "plain", q.S256 = "S256"
    })(Lpq || (hpq.CodeChallengeMethod = Lpq = {}));
    var za;
    (function(q) {
        q.PEM = "PEM", q.JWK = "JWK"
    })(za || (hpq.CertificateFormat = za = {}));
    var Oo6;
    (function(q) {
        q.ClientSecretPost = "ClientSecretPost", q.ClientSecretBasic = "ClientSecretBasic", q.None = "None"
    })(Oo6 || (hpq.ClientAuthentication = Oo6 = {}));
    class eV extends YY_.AuthClient {
        constructor(q, K, _) {
            let z = q && typeof q === "object" ? q : {
                clientId: q,
                clientSecret: K,
                redirectUri: _
            };
            super(z);
            this.certificateCache = {}, this.certificateExpiry = null, this.certificateCacheFormat = za.PEM, this.refreshTokenPromises = new Map, this._clientId = z.clientId, this._clientSecret = z.clientSecret, this.redirectUri = z.redirectUri, this.endpoints = {
                tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
                oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
                oauth2TokenUrl: "https://oauth2.googleapis.com/token",
                oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
                oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
                oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
                oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
                ...z.endpoints
            }, this.clientAuthentication = z.clientAuthentication || Oo6.ClientSecretPost, this.issuers = z.issuers || ["accounts.google.com", "https://accounts.google.com", this.universeDomain]
        }
        generateAuthUrl(q = {}) {
            if (q.code_challenge_method && !q.code_challenge) throw Error("If a code_challenge_method is provided, code_challenge must be included.");
            if (q.response_type = q.response_type || "code", q.client_id = q.client_id || this._clientId, q.redirect_uri = q.redirect_uri || this.redirectUri, Array.isArray(q.scope)) q.scope = q.scope.join(" ");
            return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + Jh1.stringify(q)
        }
        generateCodeVerifier() {
            throw Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.")
        }
        async generateCodeVerifierAsync() {
            let q = (0, Xh1.createCrypto)(),
                _ = q.randomBytesBase64(96).replace(/\+/g, "~").replace(/=/g, "_").replace(/\//g, "-"),
                Y = (await q.sha256DigestBase64(_)).split("=")[0].replace(/\+/g, "-").replace(/\//g, "_");
            return {
                codeVerifier: _,
                codeChallenge: Y
            }
        }
        getToken(q, K) {
            let _ = typeof q === "string" ? {
                code: q
            } : q;
            if (K) this.getTokenAsync(_).then((z) => K(null, z.tokens, z.res), (z) => K(z, null, z.response));
            else return this.getTokenAsync(_)
        }
        async getTokenAsync(q) {
            let K = this.endpoints.oauth2TokenUrl.toString(),
                _ = {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                z = {
                    client_id: q.client_id || this._clientId,
                    code_verifier: q.codeVerifier,
                    code: q.code,
                    grant_type: "authorization_code",
                    redirect_uri: q.redirect_uri || this.redirectUri
                };
            if (this.clientAuthentication === Oo6.ClientSecretBasic) {
                let O = Buffer.from(`${this._clientId}:${this._clientSecret}`);
                _.Authorization = `Basic ${O.toString("base64")}`
            }
            if (this.clientAuthentication === Oo6.ClientSecretPost) z.client_secret = this._clientSecret;
            let Y = await this.transporter.request({
                    ...eV.RETRY_CONFIG,
                    method: "POST",
                    url: K,
                    data: Jh1.stringify(z),
                    headers: _
                }),
                A = Y.data;
            if (Y.data && Y.data.expires_in) A.expiry_date = new Date().getTime() + Y.data.expires_in * 1000, delete A.expires_in;
            return this.emit("tokens", A), {
                tokens: A,
                res: Y
            }
        }
        async refreshToken(q) {
            if (!q) return this.refreshTokenNoCache(q);
            if (this.refreshTokenPromises.has(q)) return this.refreshTokenPromises.get(q);
            let K = this.refreshTokenNoCache(q).then((_) => {
                return this.refreshTokenPromises.delete(q), _
            }, (_) => {
                throw this.refreshTokenPromises.delete(q), _
            });
            return this.refreshTokenPromises.set(q, K), K
        }
        async refreshTokenNoCache(q) {
            var K;
            if (!q) throw Error("No refresh token is set.");
            let _ = this.endpoints.oauth2TokenUrl.toString(),
                z = {
                    refresh_token: q,
                    client_id: this._clientId,
                    client_secret: this._clientSecret,
                    grant_type: "refresh_token"
                },
                Y;
            try {
                Y = await this.transporter.request({
                    ...eV.RETRY_CONFIG,
                    method: "POST",
                    url: _,
                    data: Jh1.stringify(z),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            } catch (O) {
                if (O instanceof KY_.GaxiosError && O.message === "invalid_grant" && ((K = O.response) === null || K === void 0 ? void 0 : K.data) && /ReAuth/i.test(O.response.data.error_description)) O.message = JSON.stringify(O.response.data);
                throw O
            }
            let A = Y.data;
            if (Y.data && Y.data.expires_in) A.expiry_date = new Date().getTime() + Y.data.expires_in * 1000, delete A.expires_in;
            return this.emit("tokens", A), {
                tokens: A,
                res: Y
            }
        }
        refreshAccessToken(q) {
            if (q) this.refreshAccessTokenAsync().then((K) => q(null, K.credentials, K.res), q);
            else return this.refreshAccessTokenAsync()
        }
        async refreshAccessTokenAsync() {
            let q = await this.refreshToken(this.credentials.refresh_token),
                K = q.tokens;
            return K.refresh_token = this.credentials.refresh_token, this.credentials = K, {
                credentials: this.credentials,
                res: q.res
            }
        }
        getAccessToken(q) {
            if (q) this.getAccessTokenAsync().then((K) => q(null, K.token, K.res), q);
            else return this.getAccessTokenAsync()
        }
        async getAccessTokenAsync() {
            if (!this.credentials.access_token || this.isTokenExpiring()) {
                if (!this.credentials.refresh_token)
                    if (this.refreshHandler) {
                        let _ = await this.processAndValidateRefreshHandler();
                        if (_ === null || _ === void 0 ? void 0 : _.access_token) return this.setCredentials(_), {
                            token: this.credentials.access_token
                        }
                    } else throw Error("No refresh token or refresh handler callback is set.");
                let K = await this.refreshAccessTokenAsync();
                if (!K.credentials || K.credentials && !K.credentials.access_token) throw Error("Could not refresh access token.");
                return {
                    token: K.credentials.access_token,
                    res: K.res
                }
            } else return {
                token: this.credentials.access_token
            }
        }
        async getRequestHeaders(q) {
            return (await this.getRequestMetadataAsync(q)).headers
        }
        async getRequestMetadataAsync(q) {
            let K = this.credentials;
            if (!K.access_token && !K.refresh_token && !this.apiKey && !this.refreshHandler) throw Error("No access, refresh token, API key or refresh handler callback is set.");
            if (K.access_token && !this.isTokenExpiring()) {
                K.token_type = K.token_type || "Bearer";
                let O = {
                    Authorization: K.token_type + " " + K.access_token
                };
                return {
                    headers: this.addSharedMetadataHeaders(O)
                }
            }
            if (this.refreshHandler) {
                let O = await this.processAndValidateRefreshHandler();
                if (O === null || O === void 0 ? void 0 : O.access_token) {
                    this.setCredentials(O);
                    let w = {
                        Authorization: "Bearer " + this.credentials.access_token
                    };
                    return {
                        headers: this.addSharedMetadataHeaders(w)
                    }
                }
            }
            if (this.apiKey) return {
                headers: {
                    "X-Goog-Api-Key": this.apiKey
                }
            };
            let _ = null,
                z = null;
            try {
                _ = await this.refreshToken(K.refresh_token), z = _.tokens
            } catch (O) {
                let w = O;
                if (w.response && (w.response.status === 403 || w.response.status === 404)) w.message = `Could not refresh access token: ${w.message}`;
                throw w
            }
            let Y = this.credentials;
            Y.token_type = Y.token_type || "Bearer", z.refresh_token = Y.refresh_token, this.credentials = z;
            let A = {
                Authorization: Y.token_type + " " + z.access_token
            };
            return {
                headers: this.addSharedMetadataHeaders(A),
                res: _.res
            }
        }
        static getRevokeTokenUrl(q) {
            return new eV().getRevokeTokenURL(q).toString()
        }
        getRevokeTokenURL(q) {
            let K = new URL(this.endpoints.oauth2RevokeUrl);
            return K.searchParams.append("token", q), K
        }
        revokeToken(q, K) {
            let _ = {
                ...eV.RETRY_CONFIG,
                url: this.getRevokeTokenURL(q).toString(),
                method: "POST"
            };
            if (K) this.transporter.request(_).then((z) => K(null, z), K);
            else return this.transporter.request(_)
        }
        revokeCredentials(q) {
            if (q) this.revokeCredentialsAsync().then((K) => q(null, K), q);
            else return this.revokeCredentialsAsync()
        }
        async revokeCredentialsAsync() {
            let q = this.credentials.access_token;
            if (this.credentials = {}, q) return this.revokeToken(q);
            else throw Error("No access token to revoke.")
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
                let z = await this.getRequestMetadataAsync(q.url);
                if (q.headers = q.headers || {}, z.headers && z.headers["x-goog-user-project"]) q.headers["x-goog-user-project"] = z.headers["x-goog-user-project"];
                if (z.headers && z.headers.Authorization) q.headers.Authorization = z.headers.Authorization;
                if (this.apiKey) q.headers["X-Goog-Api-Key"] = this.apiKey;
                _ = await this.transporter.request(q)
            } catch (z) {
                let Y = z.response;
                if (Y) {
                    let A = Y.status,
                        O = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure),
                        w = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler,
                        $ = Y.config.data instanceof _Y_.Readable,
                        j = A === 401 || A === 403;
                    if (!K && j && !$ && O) return await this.refreshAccessTokenAsync(), this.requestAsync(q, !0);
                    else if (!K && j && !$ && w) {
                        let H = await this.processAndValidateRefreshHandler();
                        if (H === null || H === void 0 ? void 0 : H.access_token) this.setCredentials(H);
                        return this.requestAsync(q, !0)
                    }
                }
                throw z
            }
            return _
        }
        verifyIdToken(q, K) {
            if (K && typeof K !== "function") throw Error("This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.");
            if (K) this.verifyIdTokenAsync(q).then((_) => K(null, _), K);
            else return this.verifyIdTokenAsync(q)
        }
        async verifyIdTokenAsync(q) {
            if (!q.idToken) throw Error("The verifyIdToken method requires an ID Token");
            let K = await this.getFederatedSignonCertsAsync();
            return await this.verifySignedJwtWithCertsAsync(q.idToken, K.certs, q.audience, this.issuers, q.maxExpiry)
        }
        async getTokenInfo(q) {
            let {
                data: K
            } = await this.transporter.request({
                ...eV.RETRY_CONFIG,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${q}`
                },
                url: this.endpoints.tokenInfoUrl.toString()
            }), _ = Object.assign({
                expiry_date: new Date().getTime() + K.expires_in * 1000,
                scopes: K.scope.split(" ")
            }, K);
            return delete _.expires_in, delete _.scope, _
        }
        getFederatedSignonCerts(q) {
            if (q) this.getFederatedSignonCertsAsync().then((K) => q(null, K.certs, K.res), q);
            else return this.getFederatedSignonCertsAsync()
        }
        async getFederatedSignonCertsAsync() {
            let q = new Date().getTime(),
                K = (0, Xh1.hasBrowserCrypto)() ? za.JWK : za.PEM;
            if (this.certificateExpiry && q < this.certificateExpiry.getTime() && this.certificateCacheFormat === K) return {
                certs: this.certificateCache,
                format: K
            };
            let _, z;
            switch (K) {
                case za.PEM:
                    z = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
                    break;
                case za.JWK:
                    z = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
                    break;
                default:
                    throw Error(`Unsupported certificate format ${K}`)
            }
            try {
                _ = await this.transporter.request({
                    ...eV.RETRY_CONFIG,
                    url: z
                })
            } catch ($) {
                if ($ instanceof Error) $.message = `Failed to retrieve verification certificates: ${$.message}`;
                throw $
            }
            let Y = _ ? _.headers["cache-control"] : void 0,
                A = -1;
            if (Y) {
                let j = new RegExp("max-age=([0-9]*)").exec(Y);
                if (j && j.length === 2) A = Number(j[1]) * 1000
            }
            let O = {};
            switch (K) {
                case za.PEM:
                    O = _.data;
                    break;
                case za.JWK:
                    for (let $ of _.data.keys) O[$.kid] = $;
                    break;
                default:
                    throw Error(`Unsupported certificate format ${K}`)
            }
            let w = new Date;
            return this.certificateExpiry = A === -1 ? null : new Date(w.getTime() + A), this.certificateCache = O, this.certificateCacheFormat = K, {
                certs: O,
                format: K,
                res: _
            }
        }
        getIapPublicKeys(q) {
            if (q) this.getIapPublicKeysAsync().then((K) => q(null, K.pubkeys, K.res), q);
            else return this.getIapPublicKeysAsync()
        }
        async getIapPublicKeysAsync() {
            let q, K = this.endpoints.oauth2IapPublicKeyUrl.toString();
            try {
                q = await this.transporter.request({
                    ...eV.RETRY_CONFIG,
                    url: K
                })
            } catch (_) {
                if (_ instanceof Error) _.message = `Failed to retrieve verification certificates: ${_.message}`;
                throw _
            }
            return {
                pubkeys: q.data,
                res: q
            }
        }
        verifySignedJwtWithCerts() {
            throw Error("verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.")
        }
        async verifySignedJwtWithCertsAsync(q, K, _, z, Y) {
            let A = (0, Xh1.createCrypto)();
            if (!Y) Y = eV.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
            let O = q.split(".");
            if (O.length !== 3) throw Error("Wrong number of segments in token: " + q);
            let w = O[0] + "." + O[1],
                $ = O[2],
                j, H;
            try {
                j = JSON.parse(A.decodeBase64StringUtf8(O[0]))
            } catch (G) {
                if (G instanceof Error) G.message = `Can't parse token envelope: ${O[0]}': ${G.message}`;
                throw G
            }
            if (!j) throw Error("Can't parse token envelope: " + O[0]);
            try {
                H = JSON.parse(A.decodeBase64StringUtf8(O[1]))
            } catch (G) {
                if (G instanceof Error) G.message = `Can't parse token payload '${O[0]}`;
                throw G
            }
            if (!H) throw Error("Can't parse token payload: " + O[1]);
            if (!Object.prototype.hasOwnProperty.call(K, j.kid)) throw Error("No pem found for envelope: " + JSON.stringify(j));
            let J = K[j.kid];
            if (j.alg === "ES256") $ = zY_.joseToDer($, "ES256").toString("base64");
            if (!await A.verify(J, w, $)) throw Error("Invalid token signature: " + q);
            if (!H.iat) throw Error("No issue time in token: " + JSON.stringify(H));
            if (!H.exp) throw Error("No expiration time in token: " + JSON.stringify(H));
            let M = Number(H.iat);
            if (isNaN(M)) throw Error("iat field using invalid format");
            let P = Number(H.exp);
            if (isNaN(P)) throw Error("exp field using invalid format");
            let W = new Date().getTime() / 1000;
            if (P >= W + Y) throw Error("Expiration time too far in future: " + JSON.stringify(H));
            let D = M - eV.CLOCK_SKEW_SECS_,
                Z = P + eV.CLOCK_SKEW_SECS_;
            if (W < D) throw Error("Token used too early, " + W + " < " + D + ": " + JSON.stringify(H));
            if (W > Z) throw Error("Token used too late, " + W + " > " + Z + ": " + JSON.stringify(H));
            if (z && z.indexOf(H.iss) < 0) throw Error("Invalid issuer, expected one of [" + z + "], but got " + H.iss);
            if (typeof _ < "u" && _ !== null) {
                let G = H.aud,
                    f = !1;
                if (_.constructor === Array) f = _.indexOf(G) > -1;
                else f = G === _;
                if (!f) throw Error("Wrong recipient, payload audience != requiredAudience")
            }
            return new AY_.LoginTicket(j, H)
        }
        async processAndValidateRefreshHandler() {
            if (this.refreshHandler) {
                let q = await this.refreshHandler();
                if (!q.access_token) throw Error("No access token is returned by the refreshHandler callback.");
                return q
            }
            return
        }
        isTokenExpiring() {
            let q = this.credentials.expiry_date;
            return q ? q <= new Date().getTime() + this.eagerRefreshThresholdMillis : !1
        }
    }
    hpq.OAuth2Client = eV;
    eV.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
    eV.CLOCK_SKEW_SECS_ = 300;
    eV.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400
})
// @from(Ln 152616, Col 4)
Mh1 = p((bpq) => {
    Object.defineProperty(bpq, "__esModule", {
        value: !0
    });
    bpq.Compute = void 0;
    var jY_ = hB(),
        Spq = zo6(),
        HY_ = y26();
    class Cpq extends HY_.OAuth2Client {
        constructor(q = {}) {
            super(q);
            this.credentials = {
                expiry_date: 1,
                refresh_token: "compute-placeholder"
            }, this.serviceAccountEmail = q.serviceAccountEmail || "default", this.scopes = Array.isArray(q.scopes) ? q.scopes : q.scopes ? [q.scopes] : []
        }
        async refreshTokenNoCache(q) {
            let K = `service-accounts/${this.serviceAccountEmail}/token`,
                _;
            try {
                let Y = {
                    property: K
                };
                if (this.scopes.length > 0) Y.params = {
                    scopes: this.scopes.join(",")
                };
                _ = await Spq.instance(Y)
            } catch (Y) {
                if (Y instanceof jY_.GaxiosError) Y.message = `Could not refresh access token: ${Y.message}`, this.wrapError(Y);
                throw Y
            }
            let z = _;
            if (_ && _.expires_in) z.expiry_date = new Date().getTime() + _.expires_in * 1000, delete z.expires_in;
            return this.emit("tokens", z), {
                tokens: z,
                res: null
            }
        }
        async fetchIdToken(q) {
            let K = `service-accounts/${this.serviceAccountEmail}/identity?format=full&audience=${q}`,
                _;
            try {
                let z = {
                    property: K
                };
                _ = await Spq.instance(z)
            } catch (z) {
                if (z instanceof Error) z.message = `Could not fetch ID token: ${z.message}`;
                throw z
            }
            return _
        }
        wrapError(q) {
            let K = q.response;
            if (K && K.status) {
                if (q.status = K.status, K.status === 403) q.message = "A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified: " + q.message;
                else if (K.status === 404) q.message = "A Not Found error was returned while attempting to retrieve an accesstoken for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have any permission scopes specified: " + q.message
            }
        }
    }
    bpq.Compute = Cpq
})
// @from(Ln 152678, Col 4)
Ph1 = p((upq) => {
    Object.defineProperty(upq, "__esModule", {
        value: !0
    });
    upq.IdTokenClient = void 0;
    var JY_ = y26();
    class xpq extends JY_.OAuth2Client {
        constructor(q) {
            super(q);
            this.targetAudience = q.targetAudience, this.idTokenProvider = q.idTokenProvider
        }
        async getRequestMetadataAsync(q) {
            if (!this.credentials.id_token || !this.credentials.expiry_date || this.isTokenExpiring()) {
                let _ = await this.idTokenProvider.fetchIdToken(this.targetAudience);
                this.credentials = {
                    id_token: _,
                    expiry_date: this.getIdTokenExpiryDate(_)
                }
            }
            return {
                headers: {
                    Authorization: "Bearer " + this.credentials.id_token
                }
            }
        }
        getIdTokenExpiryDate(q) {
            let K = q.split(".")[1];
            if (K) return JSON.parse(Buffer.from(K, "base64").toString("ascii")).exp * 1000
        }
    }
    upq.IdTokenClient = xpq
})
// @from(Ln 152710, Col 4)
Wh1 = p((ppq) => {
    Object.defineProperty(ppq, "__esModule", {
        value: !0
    });
    ppq.GCPEnv = void 0;
    ppq.clear = XY_;
    ppq.getEnv = MY_;
    var Bpq = zo6(),
        Ya;
    (function(q) {
        q.APP_ENGINE = "APP_ENGINE", q.KUBERNETES_ENGINE = "KUBERNETES_ENGINE", q.CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS", q.COMPUTE_ENGINE = "COMPUTE_ENGINE", q.CLOUD_RUN = "CLOUD_RUN", q.NONE = "NONE"
    })(Ya || (ppq.GCPEnv = Ya = {}));
    var wo6;

    function XY_() {
        wo6 = void 0
    }
    async function MY_() {
        if (wo6) return wo6;
        return wo6 = PY_(), wo6
    }
    async function PY_() {
        let q = Ya.NONE;
        if (WY_()) q = Ya.APP_ENGINE;
        else if (DY_()) q = Ya.CLOUD_FUNCTIONS;
        else if (await GY_())
            if (await fY_()) q = Ya.KUBERNETES_ENGINE;
            else if (ZY_()) q = Ya.CLOUD_RUN;
        else q = Ya.COMPUTE_ENGINE;
        else q = Ya.NONE;
        return q
    }

    function WY_() {
        return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME)
    }

    function DY_() {
        return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET)
    }

    function ZY_() {
        return !!process.env.K_CONFIGURATION
    }
    async function fY_() {
        try {
            return await Bpq.instance("attributes/cluster-name"), !0
        } catch (q) {
            return !1
        }
    }
    async function GY_() {
        return Bpq.isAvailable()
    }
})
// @from(Ln 152765, Col 4)
rpq = p((oq6) => {
    var CB = oq6 && oq6.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        gpq = oq6 && oq6.__classPrivateFieldSet || function(q, K, _, z, Y) {
            if (z === "m") throw TypeError("Private method is not writable");
            if (z === "a" && !Y) throw TypeError("Private accessor was defined without a setter");
            if (typeof K === "function" ? q !== K || !Y : !K.has(q)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return z === "a" ? Y.call(q, _) : Y ? Y.value = _ : K.set(q, _), _
        },
        bB, _k6, Dh1, Upq, Qpq, Zh1, fh1, dpq;
    Object.defineProperty(oq6, "__esModule", {
        value: !0
    });
    oq6.GoogleToken = void 0;
    var cpq = d6("fs"),
        VY_ = hB(),
        kY_ = CV6(),
        NY_ = d6("path"),
        EY_ = d6("util"),
        lpq = cpq.readFile ? (0, EY_.promisify)(cpq.readFile) : async () => {
            throw new zk6("use key rather than keyFile.", "MISSING_CREDENTIALS")
        }, npq = "https://www.googleapis.com/oauth2/v4/token", yY_ = "https://accounts.google.com/o/oauth2/revoke?token=";
    class zk6 extends Error {
        constructor(q, K) {
            super(q);
            this.code = K
        }
    }
    class ipq {
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
        constructor(q) {
            bB.add(this), this.transporter = {
                request: (K) => (0, VY_.request)(K)
            }, _k6.set(this, void 0), CB(this, bB, "m", fh1).call(this, q)
        }
        hasExpired() {
            let q = new Date().getTime();
            if (this.rawToken && this.expiresAt) return q >= this.expiresAt;
            else return !0
        }
        isTokenExpiring() {
            var q;
            let K = new Date().getTime(),
                _ = (q = this.eagerRefreshThresholdMillis) !== null && q !== void 0 ? q : 0;
            if (this.rawToken && this.expiresAt) return this.expiresAt <= K + _;
            else return !0
        }
        getToken(q, K = {}) {
            if (typeof q === "object") K = q, q = void 0;
            if (K = Object.assign({
                    forceRefresh: !1
                }, K), q) {
                let _ = q;
                CB(this, bB, "m", Dh1).call(this, K).then((z) => _(null, z), q);
                return
            }
            return CB(this, bB, "m", Dh1).call(this, K)
        }
        async getCredentials(q) {
            switch (NY_.extname(q)) {
                case ".json": {
                    let _ = await lpq(q, "utf8"),
                        z = JSON.parse(_),
                        Y = z.private_key,
                        A = z.client_email;
                    if (!Y || !A) throw new zk6("private_key and client_email are required.", "MISSING_CREDENTIALS");
                    return {
                        privateKey: Y,
                        clientEmail: A
                    }
                }
                case ".der":
                case ".crt":
                case ".pem":
                    return {
                        privateKey: await lpq(q, "utf8")
                    };
                case ".p12":
                case ".pfx":
                    throw new zk6("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
                default:
                    throw new zk6("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE")
            }
        }
        revokeToken(q) {
            if (q) {
                CB(this, bB, "m", Zh1).call(this).then(() => q(), q);
                return
            }
            return CB(this, bB, "m", Zh1).call(this)
        }
    }
    oq6.GoogleToken = ipq;
    _k6 = new WeakMap, bB = new WeakSet, Dh1 = async function(K) {
        if (CB(this, _k6, "f") && !K.forceRefresh) return CB(this, _k6, "f");
        try {
            return await gpq(this, _k6, CB(this, bB, "m", Upq).call(this, K), "f")
        } finally {
            gpq(this, _k6, void 0, "f")
        }
    }, Upq = async function(K) {
        if (this.isTokenExpiring() === !1 && K.forceRefresh === !1) return Promise.resolve(this.rawToken);
        if (!this.key && !this.keyFile) throw Error("No key or keyFile set.");
        if (!this.key && this.keyFile) {
            let _ = await this.getCredentials(this.keyFile);
            if (this.key = _.privateKey, this.iss = _.clientEmail || this.iss, !_.clientEmail) CB(this, bB, "m", Qpq).call(this)
        }
        return CB(this, bB, "m", dpq).call(this)
    }, Qpq = function() {
        if (!this.iss) throw new zk6("email is required.", "MISSING_CREDENTIALS")
    }, Zh1 = async function() {
        if (!this.accessToken) throw Error("No token to revoke.");
        let K = yY_ + this.accessToken;
        await this.transporter.request({
            url: K,
            retry: !0
        }), CB(this, bB, "m", fh1).call(this, {
            email: this.iss,
            sub: this.sub,
            key: this.key,
            keyFile: this.keyFile,
            scope: this.scope,
            additionalClaims: this.additionalClaims
        })
    }, fh1 = function(K = {}) {
        if (this.keyFile = K.keyFile, this.key = K.key, this.rawToken = void 0, this.iss = K.email || K.iss, this.sub = K.sub, this.additionalClaims = K.additionalClaims, typeof K.scope === "object") this.scope = K.scope.join(" ");
        else this.scope = K.scope;
        if (this.eagerRefreshThresholdMillis = K.eagerRefreshThresholdMillis, K.transporter) this.transporter = K.transporter
    }, dpq = async function() {
        var K, _;
        let z = Math.floor(new Date().getTime() / 1000),
            Y = this.additionalClaims || {},
            A = Object.assign({
                iss: this.iss,
                scope: this.scope,
                aud: npq,
                exp: z + 3600,
                iat: z,
                sub: this.sub
            }, Y),
            O = kY_.sign({
                header: {
                    alg: "RS256"
                },
                payload: A,
                secret: this.key
            });
        try {
            let w = await this.transporter.request({
                method: "POST",
                url: npq,
                data: {
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: O
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                responseType: "json",
                retryConfig: {
                    httpMethodsToRetry: ["POST"]
                }
            });
            return this.rawToken = w.data, this.expiresAt = w.data.expires_in === null || w.data.expires_in === void 0 ? void 0 : (z + w.data.expires_in) * 1000, this.rawToken
        } catch (w) {
            this.rawToken = void 0, this.tokenExpires = void 0;
            let $ = w.response && ((K = w.response) === null || K === void 0 ? void 0 : K.data) ? (_ = w.response) === null || _ === void 0 ? void 0 : _.data : {};
            if ($.error) {
                let j = $.error_description ? `: ${$.error_description}` : "";
                w.message = `${$.error}${j}`
            }
            throw w
        }
    }
})
// @from(Ln 152954, Col 4)
vh1 = p((apq) => {
    Object.defineProperty(apq, "__esModule", {
        value: !0
    });
    apq.JWTAccess = void 0;
    var LY_ = CV6(),
        hY_ = rq6(),
        opq = {
            alg: "RS256",
            typ: "JWT"
        };
    class Gh1 {
        constructor(q, K, _, z) {
            this.cache = new hY_.LRUCache({
                capacity: 500,
                maxAge: 3600000
            }), this.email = q, this.key = K, this.keyId = _, this.eagerRefreshThresholdMillis = z !== null && z !== void 0 ? z : 300000
        }
        getCachedKey(q, K) {
            let _ = q;
            if (K && Array.isArray(K) && K.length) _ = q ? `${q}_${K.join("_")}` : `${K.join("_")}`;
            else if (typeof K === "string") _ = q ? `${q}_${K}` : K;
            if (!_) throw Error("Scopes or url must be provided");
            return _
        }
        getRequestHeaders(q, K, _) {
            let z = this.getCachedKey(q, _),
                Y = this.cache.get(z),
                A = Date.now();
            if (Y && Y.expiration - A > this.eagerRefreshThresholdMillis) return Y.headers;
            let O = Math.floor(Date.now() / 1000),
                w = Gh1.getExpirationTime(O),
                $;
            if (Array.isArray(_)) _ = _.join(" ");
            if (_) $ = {
                iss: this.email,
                sub: this.email,
                scope: _,
                exp: w,
                iat: O
            };
            else $ = {
                iss: this.email,
                sub: this.email,
                aud: q,
                exp: w,
                iat: O
            };
            if (K) {
                for (let M in $)
                    if (K[M]) throw Error(`The '${M}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`)
            }
            let j = this.keyId ? {
                    ...opq,
                    kid: this.keyId
                } : opq,
                H = Object.assign($, K),
                X = {
                    Authorization: `Bearer ${LY_.sign({header:j,payload:H,secret:this.key})}`
                };
            return this.cache.set(z, {
                expiration: w * 1000,
                headers: X
            }), X
        }
        static getExpirationTime(q) {
            return q + 3600
        }
        fromJSON(q) {
            if (!q) throw Error("Must pass in a JSON object containing the service account auth settings.");
            if (!q.client_email) throw Error("The incoming JSON object does not contain a client_email field");
            if (!q.private_key) throw Error("The incoming JSON object does not contain a private_key field");
            this.email = q.client_email, this.key = q.private_key, this.keyId = q.private_key_id, this.projectId = q.project_id
        }
        fromStream(q, K) {
            if (K) this.fromStreamAsync(q).then(() => K(), K);
            else return this.fromStreamAsync(q)
        }
        fromStreamAsync(q) {
            return new Promise((K, _) => {
                if (!q) _(Error("Must pass in a stream containing the service account auth settings."));
                let z = "";
                q.setEncoding("utf8").on("data", (Y) => z += Y).on("error", _).on("end", () => {
                    try {
                        let Y = JSON.parse(z);
                        this.fromJSON(Y), K()
                    } catch (Y) {
                        _(Y)
                    }
                })
            })
        }
    }
    apq.JWTAccess = Gh1
})
// @from(Ln 153049, Col 4)
Vh1 = p((epq) => {
    Object.defineProperty(epq, "__esModule", {
        value: !0
    });
    epq.JWT = void 0;
    var tpq = rpq(),
        RY_ = vh1(),
        SY_ = y26(),
        sT8 = oQ();
    class Th1 extends SY_.OAuth2Client {
        constructor(q, K, _, z, Y, A) {
            let O = q && typeof q === "object" ? q : {
                email: q,
                keyFile: K,
                key: _,
                keyId: A,
                scopes: z,
                subject: Y
            };
            super(O);
            this.email = O.email, this.keyFile = O.keyFile, this.key = O.key, this.keyId = O.keyId, this.scopes = O.scopes, this.subject = O.subject, this.additionalClaims = O.additionalClaims, this.credentials = {
                refresh_token: "jwt-placeholder",
                expiry_date: 1
            }
        }
        createScoped(q) {
            let K = new Th1(this);
            return K.scopes = q, K
        }
        async getRequestMetadataAsync(q) {
            q = this.defaultServicePath ? `https://${this.defaultServicePath}/` : q;
            let K = !this.hasUserScopes() && q || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== sT8.DEFAULT_UNIVERSE;
            if (this.subject && this.universeDomain !== sT8.DEFAULT_UNIVERSE) throw RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${sT8.DEFAULT_UNIVERSE}`);
            if (!this.apiKey && K)
                if (this.additionalClaims && this.additionalClaims.target_audience) {
                    let {
                        tokens: _
                    } = await this.refreshToken();
                    return {
                        headers: this.addSharedMetadataHeaders({
                            Authorization: `Bearer ${_.id_token}`
                        })
                    }
                } else {
                    if (!this.access) this.access = new RY_.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
                    let _;
                    if (this.hasUserScopes()) _ = this.scopes;
                    else if (!q) _ = this.defaultScopes;
                    let z = this.useJWTAccessWithScope || this.universeDomain !== sT8.DEFAULT_UNIVERSE,
                        Y = await this.access.getRequestHeaders(q !== null && q !== void 0 ? q : void 0, this.additionalClaims, z ? _ : void 0);
                    return {
                        headers: this.addSharedMetadataHeaders(Y)
                    }
                }
            else if (this.hasAnyScopes() || this.apiKey) return super.getRequestMetadataAsync(q);
            else return {
                headers: {}
            }
        }
        async fetchIdToken(q) {
            let K = new tpq.GoogleToken({
                iss: this.email,
                sub: this.subject,
                scope: this.scopes || this.defaultScopes,
                keyFile: this.keyFile,
                key: this.key,
                additionalClaims: {
                    target_audience: q
                },
                transporter: this.transporter
            });
            if (await K.getToken({
                    forceRefresh: !0
                }), !K.idToken) throw Error("Unknown error: Failed to fetch ID token");
            return K.idToken
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
        authorize(q) {
            if (q) this.authorizeAsync().then((K) => q(null, K), q);
            else return this.authorizeAsync()
        }
        async authorizeAsync() {
            let q = await this.refreshToken();
            if (!q) throw Error("No result returned");
            return this.credentials = q.tokens, this.credentials.refresh_token = "jwt-placeholder", this.key = this.gtoken.key, this.email = this.gtoken.iss, q.tokens
        }
        async refreshTokenNoCache(q) {
            let K = this.createGToken(),
                z = {
                    access_token: (await K.getToken({
                        forceRefresh: this.isTokenExpiring()
                    })).access_token,
                    token_type: "Bearer",
                    expiry_date: K.expiresAt,
                    id_token: K.idToken
                };
            return this.emit("tokens", z), {
                res: null,
                tokens: z
            }
        }
        createGToken() {
            if (!this.gtoken) this.gtoken = new tpq.GoogleToken({
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
        fromJSON(q) {
            if (!q) throw Error("Must pass in a JSON object containing the service account auth settings.");
            if (!q.client_email) throw Error("The incoming JSON object does not contain a client_email field");
            if (!q.private_key) throw Error("The incoming JSON object does not contain a private_key field");
            this.email = q.client_email, this.key = q.private_key, this.keyId = q.private_key_id, this.projectId = q.project_id, this.quotaProjectId = q.quota_project_id, this.universeDomain = q.universe_domain || this.universeDomain
        }
        fromStream(q, K) {
            if (K) this.fromStreamAsync(q).then(() => K(), K);
            else return this.fromStreamAsync(q)
        }
        fromStreamAsync(q) {
            return new Promise((K, _) => {
                if (!q) throw Error("Must pass in a stream containing the service account auth settings.");
                let z = "";
                q.setEncoding("utf8").on("error", _).on("data", (Y) => z += Y).on("end", () => {
                    try {
                        let Y = JSON.parse(z);
                        this.fromJSON(Y), K()
                    } catch (Y) {
                        _(Y)
                    }
                })
            })
        }
        fromAPIKey(q) {
            if (typeof q !== "string") throw Error("Must provide an API Key string.");
            this.apiKey = q
        }
        async getCredentials() {
            if (this.key) return {
                private_key: this.key,
                client_email: this.email
            };
            else if (this.keyFile) {
                let K = await this.createGToken().getCredentials(this.keyFile);
                return {
                    private_key: K.privateKey,
                    client_email: K.clientEmail
                }
            }
            throw Error("A key or a keyFile must be provided to getCredentials.")
        }
    }
    epq.JWT = Th1
})
// @from(Ln 153215, Col 4)
kh1 = p((KFq) => {
    Object.defineProperty(KFq, "__esModule", {
        value: !0
    });
    KFq.UserRefreshClient = KFq.USER_REFRESH_ACCOUNT_TYPE = void 0;
    var CY_ = y26(),
        bY_ = d6("querystring");
    KFq.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
    class tT8 extends CY_.OAuth2Client {
        constructor(q, K, _, z, Y) {
            let A = q && typeof q === "object" ? q : {
                clientId: q,
                clientSecret: K,
                refreshToken: _,
                eagerRefreshThresholdMillis: z,
                forceRefreshOnFailure: Y
            };
            super(A);
            this._refreshToken = A.refreshToken, this.credentials.refresh_token = A.refreshToken
        }
        async refreshTokenNoCache(q) {
            return super.refreshTokenNoCache(this._refreshToken)
        }
        async fetchIdToken(q) {
            return (await this.transporter.request({
                ...tT8.RETRY_CONFIG,
                url: this.endpoints.oauth2TokenUrl,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: (0, bY_.stringify)({
                    client_id: this._clientId,
                    client_secret: this._clientSecret,
                    grant_type: "refresh_token",
                    refresh_token: this._refreshToken,
                    target_audience: q
                })
            })).data.id_token
        }
        fromJSON(q) {
            if (!q) throw Error("Must pass in a JSON object containing the user refresh token");
            if (q.type !== "authorized_user") throw Error('The incoming JSON object does not have the "authorized_user" type');
            if (!q.client_id) throw Error("The incoming JSON object does not contain a client_id field");
            if (!q.client_secret) throw Error("The incoming JSON object does not contain a client_secret field");
            if (!q.refresh_token) throw Error("The incoming JSON object does not contain a refresh_token field");
            this._clientId = q.client_id, this._clientSecret = q.client_secret, this._refreshToken = q.refresh_token, this.credentials.refresh_token = q.refresh_token, this.quotaProjectId = q.quota_project_id, this.universeDomain = q.universe_domain || this.universeDomain
        }
        fromStream(q, K) {
            if (K) this.fromStreamAsync(q).then(() => K(), K);
            else return this.fromStreamAsync(q)
        }
        async fromStreamAsync(q) {
            return new Promise((K, _) => {
                if (!q) return _(Error("Must pass in a stream containing the user refresh token."));
                let z = "";
                q.setEncoding("utf8").on("error", _).on("data", (Y) => z += Y).on("end", () => {
                    try {
                        let Y = JSON.parse(z);
                        return this.fromJSON(Y), K()
                    } catch (Y) {
                        return _(Y)
                    }
                })
            })
        }
        static fromJSON(q) {
            let K = new tT8;
            return K.fromJSON(q), K
        }
    }
    KFq.UserRefreshClient = tT8
})
// @from(Ln 153288, Col 4)
Nh1 = p((YFq) => {
    Object.defineProperty(YFq, "__esModule", {
        value: !0
    });
    YFq.Impersonated = YFq.IMPERSONATED_ACCOUNT_TYPE = void 0;
    var zFq = y26(),
        xY_ = hB(),
        uY_ = rq6();
    YFq.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
    class $o6 extends zFq.OAuth2Client {
        constructor(q = {}) {
            var K, _, z, Y, A, O;
            super(q);
            if (this.credentials = {
                    expiry_date: 1,
                    refresh_token: "impersonated-placeholder"
                }, this.sourceClient = (K = q.sourceClient) !== null && K !== void 0 ? K : new zFq.OAuth2Client, this.targetPrincipal = (_ = q.targetPrincipal) !== null && _ !== void 0 ? _ : "", this.delegates = (z = q.delegates) !== null && z !== void 0 ? z : [], this.targetScopes = (Y = q.targetScopes) !== null && Y !== void 0 ? Y : [], this.lifetime = (A = q.lifetime) !== null && A !== void 0 ? A : 3600, !(0, uY_.originalOrCamelOptions)(q).get("universe_domain")) this.universeDomain = this.sourceClient.universeDomain;
            else if (this.sourceClient.universeDomain !== this.universeDomain) throw RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
            this.endpoint = (O = q.endpoint) !== null && O !== void 0 ? O : `https://iamcredentials.${this.universeDomain}`
        }
        async sign(q) {
            await this.sourceClient.getAccessToken();
            let K = `projects/-/serviceAccounts/${this.targetPrincipal}`,
                _ = `${this.endpoint}/v1/${K}:signBlob`,
                z = {
                    delegates: this.delegates,
                    payload: Buffer.from(q).toString("base64")
                };
            return (await this.sourceClient.request({
                ...$o6.RETRY_CONFIG,
                url: _,
                data: z,
                method: "POST"
            })).data
        }
        getTargetPrincipal() {
            return this.targetPrincipal
        }
        async refreshToken() {
            var q, K, _, z, Y, A;
            try {
                await this.sourceClient.getAccessToken();
                let O = "projects/-/serviceAccounts/" + this.targetPrincipal,
                    w = `${this.endpoint}/v1/${O}:generateAccessToken`,
                    $ = {
                        delegates: this.delegates,
                        scope: this.targetScopes,
                        lifetime: this.lifetime + "s"
                    },
                    j = await this.sourceClient.request({
                        ...$o6.RETRY_CONFIG,
                        url: w,
                        data: $,
                        method: "POST"
                    }),
                    H = j.data;
                return this.credentials.access_token = H.accessToken, this.credentials.expiry_date = Date.parse(H.expireTime), {
                    tokens: this.credentials,
                    res: j
                }
            } catch (O) {
                if (!(O instanceof Error)) throw O;
                let w = 0,
                    $ = "";
                if (O instanceof xY_.GaxiosError) w = (_ = (K = (q = O === null || O === void 0 ? void 0 : O.response) === null || q === void 0 ? void 0 : q.data) === null || K === void 0 ? void 0 : K.error) === null || _ === void 0 ? void 0 : _.status, $ = (A = (Y = (z = O === null || O === void 0 ? void 0 : O.response) === null || z === void 0 ? void 0 : z.data) === null || Y === void 0 ? void 0 : Y.error) === null || A === void 0 ? void 0 : A.message;
                if (w && $) throw O.message = `${w}: unable to impersonate: ${$}`, O;
                else throw O.message = `unable to impersonate: ${O}`, O
            }
        }
        async fetchIdToken(q, K) {
            var _, z;
            await this.sourceClient.getAccessToken();
            let Y = `projects/-/serviceAccounts/${this.targetPrincipal}`,
                A = `${this.endpoint}/v1/${Y}:generateIdToken`,
                O = {
                    delegates: this.delegates,
                    audience: q,
                    includeEmail: (_ = K === null || K === void 0 ? void 0 : K.includeEmail) !== null && _ !== void 0 ? _ : !0,
                    useEmailAzp: (z = K === null || K === void 0 ? void 0 : K.includeEmail) !== null && z !== void 0 ? z : !0
                };
            return (await this.sourceClient.request({
                ...$o6.RETRY_CONFIG,
                url: A,
                data: O,
                method: "POST"
            })).data.token
        }
    }
    YFq.Impersonated = $o6
})
// @from(Ln 153378, Col 4)
Eh1 = p(($Fq) => {
    Object.defineProperty($Fq, "__esModule", {
        value: !0
    });
    $Fq.OAuthClientAuthHandler = void 0;
    $Fq.getErrorFromOAuthErrorResponse = FY_;
    var OFq = d6("querystring"),
        BY_ = eV6(),
        pY_ = ["PUT", "POST", "PATCH"];
    class wFq {
        constructor(q) {
            this.clientAuthentication = q, this.crypto = (0, BY_.createCrypto)()
        }
        applyClientAuthenticationOptions(q, K) {
            if (this.injectAuthenticatedHeaders(q, K), !K) this.injectAuthenticatedRequestBody(q)
        }
        injectAuthenticatedHeaders(q, K) {
            var _;
            if (K) q.headers = q.headers || {}, Object.assign(q.headers, {
                Authorization: `Bearer ${K}}`
            });
            else if (((_ = this.clientAuthentication) === null || _ === void 0 ? void 0 : _.confidentialClientType) === "basic") {
                q.headers = q.headers || {};
                let z = this.clientAuthentication.clientId,
                    Y = this.clientAuthentication.clientSecret || "",
                    A = this.crypto.encodeBase64StringUtf8(`${z}:${Y}`);
                Object.assign(q.headers, {
                    Authorization: `Basic ${A}`
                })
            }
        }
        injectAuthenticatedRequestBody(q) {
            var K;
            if (((K = this.clientAuthentication) === null || K === void 0 ? void 0 : K.confidentialClientType) === "request-body") {
                let _ = (q.method || "GET").toUpperCase();
                if (pY_.indexOf(_) !== -1) {
                    let z, Y = q.headers || {};
                    for (let A in Y)
                        if (A.toLowerCase() === "content-type" && Y[A]) {
                            z = Y[A].toLowerCase();
                            break
                        } if (z === "application/x-www-form-urlencoded") {
                        q.data = q.data || "";
                        let A = OFq.parse(q.data);
                        Object.assign(A, {
                            client_id: this.clientAuthentication.clientId,
                            client_secret: this.clientAuthentication.clientSecret || ""
                        }), q.data = OFq.stringify(A)
                    } else if (z === "application/json") q.data = q.data || {}, Object.assign(q.data, {
                        client_id: this.clientAuthentication.clientId,
                        client_secret: this.clientAuthentication.clientSecret || ""
                    });
                    else throw Error(`${z} content-types are not supported with ${this.clientAuthentication.confidentialClientType} client authentication`)
                } else throw Error(`${_} HTTP method does not support ${this.clientAuthentication.confidentialClientType} client authentication`)
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
    $Fq.OAuthClientAuthHandler = wFq;

    function FY_(q, K) {
        let {
            error: _,
            error_description: z,
            error_uri: Y
        } = q, A = `Error code ${_}`;
        if (typeof z < "u") A += `: ${z}`;
        if (typeof Y < "u") A += ` - ${Y}`;
        let O = Error(A);
        if (K) {
            let w = Object.keys(K);
            if (K.stack) w.push("stack");
            w.forEach(($) => {
                if ($ !== "message") Object.defineProperty(O, $, {
                    value: K[$],
                    writable: !1,
                    enumerable: !0
                })
            })
        }
        return O
    }
})
// @from(Ln 153468, Col 4)
Lh1 = p((JFq) => {
    Object.defineProperty(JFq, "__esModule", {
        value: !0
    });
    JFq.StsCredentials = void 0;
    var UY_ = hB(),
        QY_ = d6("querystring"),
        dY_ = Ao6(),
        HFq = Eh1();
    class yh1 extends HFq.OAuthClientAuthHandler {
        constructor(q, K) {
            super(K);
            this.tokenExchangeEndpoint = q, this.transporter = new dY_.DefaultTransporter
        }
        async exchangeToken(q, K, _) {
            var z, Y, A;
            let O = {
                grant_type: q.grantType,
                resource: q.resource,
                audience: q.audience,
                scope: (z = q.scope) === null || z === void 0 ? void 0 : z.join(" "),
                requested_token_type: q.requestedTokenType,
                subject_token: q.subjectToken,
                subject_token_type: q.subjectTokenType,
                actor_token: (Y = q.actingParty) === null || Y === void 0 ? void 0 : Y.actorToken,
                actor_token_type: (A = q.actingParty) === null || A === void 0 ? void 0 : A.actorTokenType,
                options: _ && JSON.stringify(_)
            };
            Object.keys(O).forEach((j) => {
                if (typeof O[j] > "u") delete O[j]
            });
            let w = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            Object.assign(w, K || {});
            let $ = {
                ...yh1.RETRY_CONFIG,
                url: this.tokenExchangeEndpoint.toString(),
                method: "POST",
                headers: w,
                data: QY_.stringify(O),
                responseType: "json"
            };
            this.applyClientAuthenticationOptions($);
            try {
                let j = await this.transporter.request($),
                    H = j.data;
                return H.res = j, H
            } catch (j) {
                if (j instanceof UY_.GaxiosError && j.response) throw (0, HFq.getErrorFromOAuthErrorResponse)(j.response.data, j);
                throw j
            }
        }
    }
    JFq.StsCredentials = yh1
})
// @from(Ln 153524, Col 4)
aq6 = p((JD) => {
    var hh1 = JD && JD.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        MFq = JD && JD.__classPrivateFieldSet || function(q, K, _, z, Y) {
            if (z === "m") throw TypeError("Private method is not writable");
            if (z === "a" && !Y) throw TypeError("Private accessor was defined without a setter");
            if (typeof K === "function" ? q !== K || !Y : !K.has(q)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return z === "a" ? Y.call(q, _) : Y ? Y.value = _ : K.set(q, _), _
        },
        Rh1, Yk6, WFq;
    Object.defineProperty(JD, "__esModule", {
        value: !0
    });
    JD.BaseExternalAccountClient = JD.DEFAULT_UNIVERSE = JD.CLOUD_RESOURCE_MANAGER = JD.EXTERNAL_ACCOUNT_TYPE = JD.EXPIRATION_TIME_OFFSET = void 0;
    var cY_ = d6("stream"),
        lY_ = oQ(),
        nY_ = Lh1(),
        PFq = rq6(),
        iY_ = "urn:ietf:params:oauth:grant-type:token-exchange",
        rY_ = "urn:ietf:params:oauth:token-type:access_token",
        Sh1 = "https://www.googleapis.com/auth/cloud-platform",
        oY_ = 3600;
    JD.EXPIRATION_TIME_OFFSET = 300000;
    JD.EXTERNAL_ACCOUNT_TYPE = "external_account";
    JD.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
    var aY_ = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+",
        sY_ = "https://sts.{universeDomain}/v1/token",
        tY_ = Oh1(),
        eY_ = oQ();
    Object.defineProperty(JD, "DEFAULT_UNIVERSE", {
        enumerable: !0,
        get: function() {
            return eY_.DEFAULT_UNIVERSE
        }
    });
    class eT8 extends lY_.AuthClient {
        constructor(q, K) {
            var _;
            super({
                ...q,
                ...K
            });
            Rh1.add(this), Yk6.set(this, null);
            let z = (0, PFq.originalOrCamelOptions)(q),
                Y = z.get("type");
            if (Y && Y !== JD.EXTERNAL_ACCOUNT_TYPE) throw Error(`Expected "${JD.EXTERNAL_ACCOUNT_TYPE}" type but received "${q.type}"`);
            let A = z.get("client_id"),
                O = z.get("client_secret"),
                w = (_ = z.get("token_url")) !== null && _ !== void 0 ? _ : sY_.replace("{universeDomain}", this.universeDomain),
                $ = z.get("subject_token_type"),
                j = z.get("workforce_pool_user_project"),
                H = z.get("service_account_impersonation_url"),
                J = z.get("service_account_impersonation"),
                X = (0, PFq.originalOrCamelOptions)(J).get("token_lifetime_seconds");
            if (this.cloudResourceManagerURL = new URL(z.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`), A) this.clientAuth = {
                confidentialClientType: "basic",
                clientId: A,
                clientSecret: O
            };
            this.stsCredential = new nY_.StsCredentials(w, this.clientAuth), this.scopes = z.get("scopes") || [Sh1], this.cachedAccessToken = null, this.audience = z.get("audience"), this.subjectTokenType = $, this.workforcePoolUserProject = j;
            let M = new RegExp(aY_);
            if (this.workforcePoolUserProject && !this.audience.match(M)) throw Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
            if (this.serviceAccountImpersonationUrl = H, this.serviceAccountImpersonationLifetime = X, this.serviceAccountImpersonationLifetime) this.configLifetimeRequested = !0;
            else this.configLifetimeRequested = !1, this.serviceAccountImpersonationLifetime = oY_;
            this.projectNumber = this.getProjectNumber(this.audience), this.supplierContext = {
                audience: this.audience,
                subjectTokenType: this.subjectTokenType,
                transporter: this.transporter
            }
        }
        getServiceAccountEmail() {
            var q;
            if (this.serviceAccountImpersonationUrl) {
                if (this.serviceAccountImpersonationUrl.length > 256) throw RangeError(`URL is too long: ${this.serviceAccountImpersonationUrl}`);
                let _ = /serviceAccounts\/(?<email>[^:]+):generateAccessToken$/.exec(this.serviceAccountImpersonationUrl);
                return ((q = _ === null || _ === void 0 ? void 0 : _.groups) === null || q === void 0 ? void 0 : q.email) || null
            }
            return null
        }
        setCredentials(q) {
            super.setCredentials(q), this.cachedAccessToken = q
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
        async getProjectId() {
            let q = this.projectNumber || this.workforcePoolUserProject;
            if (this.projectId) return this.projectId;
            else if (q) {
                let K = await this.getRequestHeaders(),
                    _ = await this.transporter.request({
                        ...eT8.RETRY_CONFIG,
                        headers: K,
                        url: `${this.cloudResourceManagerURL.toString()}${q}`,
                        responseType: "json"
                    });
                return this.projectId = _.data.projectId, this.projectId
            }
            return null
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
                        O = Y.config.data instanceof cY_.Readable;
                    if (!K && (A === 401 || A === 403) && !O && this.forceRefreshOnFailure) return await this.refreshAccessTokenAsync(), await this.requestAsync(q, !0)
                }
                throw z
            }
            return _
        }
        async refreshAccessTokenAsync() {
            MFq(this, Yk6, hh1(this, Yk6, "f") || hh1(this, Rh1, "m", WFq).call(this), "f");
            try {
                return await hh1(this, Yk6, "f")
            } finally {
                MFq(this, Yk6, null, "f")
            }
        }
        getProjectNumber(q) {
            let K = q.match(/\/projects\/([^/]+)/);
            if (!K) return null;
            return K[1]
        }
        async getImpersonatedAccessToken(q) {
            let K = {
                    ...eT8.RETRY_CONFIG,
                    url: this.serviceAccountImpersonationUrl,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${q}`
                    },
                    data: {
                        scope: this.getScopesArray(),
                        lifetime: this.serviceAccountImpersonationLifetime + "s"
                    },
                    responseType: "json"
                },
                _ = await this.transporter.request(K),
                z = _.data;
            return {
                access_token: z.accessToken,
                expiry_date: new Date(z.expireTime).getTime(),
                res: _
            }
        }
        isExpired(q) {
            let K = new Date().getTime();
            return q.expiry_date ? K >= q.expiry_date - this.eagerRefreshThresholdMillis : !1
        }
        getScopesArray() {
            if (typeof this.scopes === "string") return [this.scopes];
            return this.scopes || [Sh1]
        }
        getMetricsHeaderValue() {
            let q = process.version.replace(/^v/, ""),
                K = this.serviceAccountImpersonationUrl !== void 0,
                _ = this.credentialSourceType ? this.credentialSourceType : "unknown";
            return `gl-node/${q} auth/${tY_.version} google-byoid-sdk source/${_} sa-impersonation/${K} config-lifetime/${this.configLifetimeRequested}`
        }
    }
    JD.BaseExternalAccountClient = eT8;
    Yk6 = new WeakMap, Rh1 = new WeakSet, WFq = async function() {
        let K = await this.retrieveSubjectToken(),
            _ = {
                grantType: iY_,
                audience: this.audience,
                requestedTokenType: rY_,
                subjectToken: K,
                subjectTokenType: this.subjectTokenType,
                scope: this.serviceAccountImpersonationUrl ? [Sh1] : this.getScopesArray()
            },
            z = !this.clientAuth && this.workforcePoolUserProject ? {
                userProject: this.workforcePoolUserProject
            } : void 0,
            Y = {
                "x-goog-api-client": this.getMetricsHeaderValue()
            },
            A = await this.stsCredential.exchangeToken(_, Y, z);
        if (this.serviceAccountImpersonationUrl) this.cachedAccessToken = await this.getImpersonatedAccessToken(A.access_token);
        else if (A.expires_in) this.cachedAccessToken = {
            access_token: A.access_token,
            expiry_date: new Date().getTime() + A.expires_in * 1000,
            res: A.res
        };
        else this.cachedAccessToken = {
            access_token: A.access_token,
            res: A.res
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
// @from(Ln 153749, Col 4)
GFq = p((ZFq) => {
    var Ch1, bh1, Ih1;
    Object.defineProperty(ZFq, "__esModule", {
        value: !0
    });
    ZFq.FileSubjectTokenSupplier = void 0;
    var xh1 = d6("util"),
        uh1 = d6("fs"),
        qA_ = (0, xh1.promisify)((Ch1 = uh1.readFile) !== null && Ch1 !== void 0 ? Ch1 : () => {}),
        KA_ = (0, xh1.promisify)((bh1 = uh1.realpath) !== null && bh1 !== void 0 ? bh1 : () => {}),
        _A_ = (0, xh1.promisify)((Ih1 = uh1.lstat) !== null && Ih1 !== void 0 ? Ih1 : () => {});
    class DFq {
        constructor(q) {
            this.filePath = q.filePath, this.formatType = q.formatType, this.subjectTokenFieldName = q.subjectTokenFieldName
        }
        async getSubjectToken(q) {
            let K = this.filePath;
            try {
                if (K = await KA_(K), !(await _A_(K)).isFile()) throw Error()
            } catch (Y) {
                if (Y instanceof Error) Y.message = `The file at ${K} does not exist, or it is not a file. ${Y.message}`;
                throw Y
            }
            let _, z = await qA_(K, {
                encoding: "utf8"
            });
            if (this.formatType === "text") _ = z;
            else if (this.formatType === "json" && this.subjectTokenFieldName) _ = JSON.parse(z)[this.subjectTokenFieldName];
            if (!_) throw Error("Unable to parse the subject_token from the credential_source file");
            return _
        }
    }
    ZFq.FileSubjectTokenSupplier = DFq
})
// @from(Ln 153783, Col 4)
kFq = p((TFq) => {
    Object.defineProperty(TFq, "__esModule", {
        value: !0
    });
    TFq.UrlSubjectTokenSupplier = void 0;
    class vFq {
        constructor(q) {
            this.url = q.url, this.formatType = q.formatType, this.subjectTokenFieldName = q.subjectTokenFieldName, this.headers = q.headers, this.additionalGaxiosOptions = q.additionalGaxiosOptions
        }
        async getSubjectToken(q) {
            let K = {
                    ...this.additionalGaxiosOptions,
                    url: this.url,
                    method: "GET",
                    headers: this.headers,
                    responseType: this.formatType
                },
                _;
            if (this.formatType === "text") _ = (await q.transporter.request(K)).data;
            else if (this.formatType === "json" && this.subjectTokenFieldName) _ = (await q.transporter.request(K)).data[this.subjectTokenFieldName];
            if (!_) throw Error("Unable to parse the subject_token from the credential_source URL");
            return _
        }
    }
    TFq.UrlSubjectTokenSupplier = vFq
})
// @from(Ln 153809, Col 4)
ph1 = p((NFq) => {
    Object.defineProperty(NFq, "__esModule", {
        value: !0
    });
    NFq.IdentityPoolClient = void 0;
    var zA_ = aq6(),
        mh1 = rq6(),
        YA_ = GFq(),
        AA_ = kFq();
    class Bh1 extends zA_.BaseExternalAccountClient {
        constructor(q, K) {
            super(q, K);
            let _ = (0, mh1.originalOrCamelOptions)(q),
                z = _.get("credential_source"),
                Y = _.get("subject_token_supplier");
            if (!z && !Y) throw Error("A credential source or subject token supplier must be specified.");
            if (z && Y) throw Error("Only one of credential source or subject token supplier can be specified.");
            if (Y) this.subjectTokenSupplier = Y, this.credentialSourceType = "programmatic";
            else {
                let A = (0, mh1.originalOrCamelOptions)(z),
                    O = (0, mh1.originalOrCamelOptions)(A.get("format")),
                    w = O.get("type") || "text",
                    $ = O.get("subject_token_field_name");
                if (w !== "json" && w !== "text") throw Error(`Invalid credential_source format "${w}"`);
                if (w === "json" && !$) throw Error("Missing subject_token_field_name for JSON credential_source format");
                let j = A.get("file"),
                    H = A.get("url"),
                    J = A.get("headers");
                if (j && H) throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
                else if (j && !H) this.credentialSourceType = "file", this.subjectTokenSupplier = new YA_.FileSubjectTokenSupplier({
                    filePath: j,
                    formatType: w,
                    subjectTokenFieldName: $
                });
                else if (!j && H) this.credentialSourceType = "url", this.subjectTokenSupplier = new AA_.UrlSubjectTokenSupplier({
                    url: H,
                    formatType: w,
                    subjectTokenFieldName: $,
                    headers: J,
                    additionalGaxiosOptions: Bh1.RETRY_CONFIG
                });
                else throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.')
            }
        }
        async retrieveSubjectToken() {
            return this.subjectTokenSupplier.getSubjectToken(this.supplierContext)
        }
    }
    NFq.IdentityPoolClient = Bh1
})
// @from(Ln 153859, Col 4)
Fh1 = p((RFq) => {
    Object.defineProperty(RFq, "__esModule", {
        value: !0
    });
    RFq.AwsRequestSigner = void 0;
    var LFq = eV6(),
        yFq = "AWS4-HMAC-SHA256",
        OA_ = "aws4_request";
    class hFq {
        constructor(q, K) {
            this.getCredentials = q, this.region = K, this.crypto = (0, LFq.createCrypto)()
        }
        async getRequestOptions(q) {
            if (!q.url) throw Error('"url" is required in "amzOptions"');
            let K = typeof q.data === "object" ? JSON.stringify(q.data) : q.data,
                _ = q.url,
                z = q.method || "GET",
                Y = q.body || K,
                A = q.headers,
                O = await this.getCredentials(),
                w = new URL(_),
                $ = await $A_({
                    crypto: this.crypto,
                    host: w.host,
                    canonicalUri: w.pathname,
                    canonicalQuerystring: w.search.substr(1),
                    method: z,
                    region: this.region,
                    securityCredentials: O,
                    requestPayload: Y,
                    additionalAmzHeaders: A
                }),
                j = Object.assign($.amzDate ? {
                    "x-amz-date": $.amzDate
                } : {}, {
                    Authorization: $.authorizationHeader,
                    host: w.host
                }, A || {});
            if (O.token) Object.assign(j, {
                "x-amz-security-token": O.token
            });
            let H = {
                url: _,
                method: z,
                headers: j
            };
            if (typeof Y < "u") H.body = Y;
            return H
        }
    }
    RFq.AwsRequestSigner = hFq;
    async function jo6(q, K, _) {
        return await q.signWithHmacSha256(K, _)
    }
    async function wA_(q, K, _, z, Y) {
        let A = await jo6(q, `AWS4${K}`, _),
            O = await jo6(q, A, z),
            w = await jo6(q, O, Y);
        return await jo6(q, w, "aws4_request")
    }
    async function $A_(q) {
        let K = q.additionalAmzHeaders || {},
            _ = q.requestPayload || "",
            z = q.host.split(".")[0],
            Y = new Date,
            A = Y.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, ""),
            O = Y.toISOString().replace(/[-]/g, "").replace(/T.*/, ""),
            w = {};
        if (Object.keys(K).forEach((f) => {
                w[f.toLowerCase()] = K[f]
            }), q.securityCredentials.token) w["x-amz-security-token"] = q.securityCredentials.token;
        let $ = Object.assign({
                host: q.host
            }, w.date ? {} : {
                "x-amz-date": A
            }, w),
            j = "",
            H = Object.keys($).sort();
        H.forEach((f) => {
            j += `${f}:${$[f]}
`
        });
        let J = H.join(";"),
            X = await q.crypto.sha256DigestHex(_),
            M = `${q.method}
${q.canonicalUri}
${q.canonicalQuerystring}
${j}
${J}
${X}`,
            P = `${O}/${q.region}/${z}/${OA_}`,
            W = `${yFq}
${A}
${P}
` + await q.crypto.sha256DigestHex(M),
            D = await wA_(q.crypto, q.securityCredentials.secretAccessKey, O, q.region, z),
            Z = await jo6(q.crypto, D, W),
            G = `${yFq} Credential=${q.securityCredentials.accessKeyId}/${P}, SignedHeaders=${J}, Signature=${(0,LFq.fromArrayBufferToHex)(Z)}`;
        return {
            amzDate: w.date ? void 0 : A,
            authorizationHeader: G,
            canonicalQuerystring: q.canonicalQuerystring
        }
    }
})
// @from(Ln 153964, Col 4)
xFq = p((Ak6) => {
    var Aa = Ak6 && Ak6.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        IB, gh1, CFq, bFq, qV8, Uh1;
    Object.defineProperty(Ak6, "__esModule", {
        value: !0
    });
    Ak6.DefaultAwsSecurityCredentialsSupplier = void 0;
    class IFq {
        constructor(q) {
            IB.add(this), this.regionUrl = q.regionUrl, this.securityCredentialsUrl = q.securityCredentialsUrl, this.imdsV2SessionTokenUrl = q.imdsV2SessionTokenUrl, this.additionalGaxiosOptions = q.additionalGaxiosOptions
        }
        async getAwsRegion(q) {
            if (Aa(this, IB, "a", qV8)) return Aa(this, IB, "a", qV8);
            let K = {};
            if (!Aa(this, IB, "a", qV8) && this.imdsV2SessionTokenUrl) K["x-aws-ec2-metadata-token"] = await Aa(this, IB, "m", gh1).call(this, q.transporter);
            if (!this.regionUrl) throw Error('Unable to determine AWS region due to missing "options.credential_source.region_url"');
            let _ = {
                    ...this.additionalGaxiosOptions,
                    url: this.regionUrl,
                    method: "GET",
                    responseType: "text",
                    headers: K
                },
                z = await q.transporter.request(_);
            return z.data.substr(0, z.data.length - 1)
        }
        async getAwsSecurityCredentials(q) {
            if (Aa(this, IB, "a", Uh1)) return Aa(this, IB, "a", Uh1);
            let K = {};
            if (this.imdsV2SessionTokenUrl) K["x-aws-ec2-metadata-token"] = await Aa(this, IB, "m", gh1).call(this, q.transporter);
            let _ = await Aa(this, IB, "m", CFq).call(this, K, q.transporter),
                z = await Aa(this, IB, "m", bFq).call(this, _, K, q.transporter);
            return {
                accessKeyId: z.AccessKeyId,
                secretAccessKey: z.SecretAccessKey,
                token: z.Token
            }
        }
    }
    Ak6.DefaultAwsSecurityCredentialsSupplier = IFq;
    IB = new WeakSet, gh1 = async function(K) {
        let _ = {
            ...this.additionalGaxiosOptions,
            url: this.imdsV2SessionTokenUrl,
            method: "PUT",
            responseType: "text",
            headers: {
                "x-aws-ec2-metadata-token-ttl-seconds": "300"
            }
        };
        return (await K.request(_)).data
    }, CFq = async function(K, _) {
        if (!this.securityCredentialsUrl) throw Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
        let z = {
            ...this.additionalGaxiosOptions,
            url: this.securityCredentialsUrl,
            method: "GET",
            responseType: "text",
            headers: K
        };
        return (await _.request(z)).data
    }, bFq = async function(K, _, z) {
        return (await z.request({
            ...this.additionalGaxiosOptions,
            url: `${this.securityCredentialsUrl}/${K}`,
            responseType: "json",
            headers: _
        })).data
    }, qV8 = function() {
        return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null
    }, Uh1 = function() {
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            token: process.env.AWS_SESSION_TOKEN
        };
        return null
    }
})
// @from(Ln 154047, Col 4)
Qh1 = p((Ok6) => {
    var jA_ = Ok6 && Ok6.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        KV8, mFq;
    Object.defineProperty(Ok6, "__esModule", {
        value: !0
    });
    Ok6.AwsClient = void 0;
    var HA_ = Fh1(),
        JA_ = aq6(),
        XA_ = xFq(),
        uFq = rq6();
    class Ho6 extends JA_.BaseExternalAccountClient {
        constructor(q, K) {
            super(q, K);
            let _ = (0, uFq.originalOrCamelOptions)(q),
                z = _.get("credential_source"),
                Y = _.get("aws_security_credentials_supplier");
            if (!z && !Y) throw Error("A credential source or AWS security credentials supplier must be specified.");
            if (z && Y) throw Error("Only one of credential source or AWS security credentials supplier can be specified.");
            if (Y) this.awsSecurityCredentialsSupplier = Y, this.regionalCredVerificationUrl = jA_(KV8, KV8, "f", mFq), this.credentialSourceType = "programmatic";
            else {
                let A = (0, uFq.originalOrCamelOptions)(z);
                this.environmentId = A.get("environment_id");
                let O = A.get("region_url"),
                    w = A.get("url"),
                    $ = A.get("imdsv2_session_token_url");
                this.awsSecurityCredentialsSupplier = new XA_.DefaultAwsSecurityCredentialsSupplier({
                    regionUrl: O,
                    securityCredentialsUrl: w,
                    imdsV2SessionTokenUrl: $
                }), this.regionalCredVerificationUrl = A.get("regional_cred_verification_url"), this.credentialSourceType = "aws", this.validateEnvironmentId()
            }
            this.awsRequestSigner = null, this.region = ""
        }
        validateEnvironmentId() {
            var q;
            let K = (q = this.environmentId) === null || q === void 0 ? void 0 : q.match(/^(aws)(\d+)$/);
            if (!K || !this.regionalCredVerificationUrl) throw Error('No valid AWS "credential_source" provided');
            else if (parseInt(K[2], 10) !== 1) throw Error(`aws version "${K[2]}" is not supported in the current build.`)
        }
        async retrieveSubjectToken() {
            if (!this.awsRequestSigner) this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext), this.awsRequestSigner = new HA_.AwsRequestSigner(async () => {
                return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext)
            }, this.region);
            let q = await this.awsRequestSigner.getRequestOptions({
                    ...KV8.RETRY_CONFIG,
                    url: this.regionalCredVerificationUrl.replace("{region}", this.region),
                    method: "POST"
                }),
                K = [],
                _ = Object.assign({
                    "x-goog-cloud-target-resource": this.audience
                }, q.headers);
            for (let z in _) K.push({
                key: z,
                value: _[z]
            });
            return encodeURIComponent(JSON.stringify({
                url: q.url,
                method: q.method,
                headers: K
            }))
        }
    }
    Ok6.AwsClient = Ho6;
    KV8 = Ho6;
    mFq = {
        value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15"
    };
    Ho6.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
    Ho6.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254"
})
// @from(Ln 154123, Col 4)
ah1 = p((FFq) => {
    Object.defineProperty(FFq, "__esModule", {
        value: !0
    });
    FFq.InvalidSubjectTokenError = FFq.InvalidMessageFieldError = FFq.InvalidCodeFieldError = FFq.InvalidTokenTypeFieldError = FFq.InvalidExpirationTimeFieldError = FFq.InvalidSuccessFieldError = FFq.InvalidVersionFieldError = FFq.ExecutableResponseError = FFq.ExecutableResponse = void 0;
    var _V8 = "urn:ietf:params:oauth:token-type:saml2",
        dh1 = "urn:ietf:params:oauth:token-type:id_token",
        ch1 = "urn:ietf:params:oauth:token-type:jwt";
    class BFq {
        constructor(q) {
            if (!q.version) throw new lh1("Executable response must contain a 'version' field.");
            if (q.success === void 0) throw new nh1("Executable response must contain a 'success' field.");
            if (this.version = q.version, this.success = q.success, this.success) {
                if (this.expirationTime = q.expiration_time, this.tokenType = q.token_type, this.tokenType !== _V8 && this.tokenType !== dh1 && this.tokenType !== ch1) throw new ih1(`Executable response must contain a 'token_type' field when successful and it must be one of ${dh1}, ${ch1}, or ${_V8}.`);
                if (this.tokenType === _V8) {
                    if (!q.saml_response) throw new zV8(`Executable response must contain a 'saml_response' field when token_type=${_V8}.`);
                    this.subjectToken = q.saml_response
                } else {
                    if (!q.id_token) throw new zV8(`Executable response must contain a 'id_token' field when token_type=${dh1} or ${ch1}.`);
                    this.subjectToken = q.id_token
                }
            } else {
                if (!q.code) throw new rh1("Executable response must contain a 'code' field when unsuccessful.");
                if (!q.message) throw new oh1("Executable response must contain a 'message' field when unsuccessful.");
                this.errorCode = q.code, this.errorMessage = q.message
            }
        }
        isValid() {
            return !this.isExpired() && this.success
        }
        isExpired() {
            return this.expirationTime !== void 0 && this.expirationTime < Math.round(Date.now() / 1000)
        }
    }
    FFq.ExecutableResponse = BFq;
    class Oa extends Error {
        constructor(q) {
            super(q);
            Object.setPrototypeOf(this, new.target.prototype)
        }
    }
    FFq.ExecutableResponseError = Oa;
    class lh1 extends Oa {}
    FFq.InvalidVersionFieldError = lh1;
    class nh1 extends Oa {}
    FFq.InvalidSuccessFieldError = nh1;
    class pFq extends Oa {}
    FFq.InvalidExpirationTimeFieldError = pFq;
    class ih1 extends Oa {}
    FFq.InvalidTokenTypeFieldError = ih1;
    class rh1 extends Oa {}
    FFq.InvalidCodeFieldError = rh1;
    class oh1 extends Oa {}
    FFq.InvalidMessageFieldError = oh1;
    class zV8 extends Oa {}
    FFq.InvalidSubjectTokenError = zV8
})
// @from(Ln 154180, Col 4)
dFq = p((UFq) => {
    Object.defineProperty(UFq, "__esModule", {
        value: !0
    });
    UFq.PluggableAuthHandler = void 0;
    var TA_ = YV8(),
        L26 = ah1(),
        VA_ = d6("child_process"),
        sh1 = d6("fs");
    class th1 {
        constructor(q) {
            if (!q.command) throw Error("No command provided.");
            if (this.commandComponents = th1.parseCommand(q.command), this.timeoutMillis = q.timeoutMillis, !this.timeoutMillis) throw Error("No timeoutMillis provided.");
            this.outputFile = q.outputFile
        }
        retrieveResponseFromExecutable(q) {
            return new Promise((K, _) => {
                let z = VA_.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
                        env: {
                            ...process.env,
                            ...Object.fromEntries(q)
                        }
                    }),
                    Y = "";
                z.stdout.on("data", (O) => {
                    Y += O
                }), z.stderr.on("data", (O) => {
                    Y += O
                });
                let A = setTimeout(() => {
                    return z.removeAllListeners(), z.kill(), _(Error("The executable failed to finish within the timeout specified."))
                }, this.timeoutMillis);
                z.on("close", (O) => {
                    if (clearTimeout(A), O === 0) try {
                        let w = JSON.parse(Y),
                            $ = new L26.ExecutableResponse(w);
                        return K($)
                    } catch (w) {
                        if (w instanceof L26.ExecutableResponseError) return _(w);
                        return _(new L26.ExecutableResponseError(`The executable returned an invalid response: ${Y}`))
                    } else return _(new TA_.ExecutableError(Y, O.toString()))
                })
            })
        }
        async retrieveCachedResponse() {
            if (!this.outputFile || this.outputFile.length === 0) return;
            let q;
            try {
                q = await sh1.promises.realpath(this.outputFile)
            } catch (_) {
                return
            }
            if (!(await sh1.promises.lstat(q)).isFile()) return;
            let K = await sh1.promises.readFile(q, {
                encoding: "utf8"
            });
            if (K === "") return;
            try {
                let _ = JSON.parse(K);
                if (new L26.ExecutableResponse(_).isValid()) return new L26.ExecutableResponse(_);
                return
            } catch (_) {
                if (_ instanceof L26.ExecutableResponseError) throw _;
                throw new L26.ExecutableResponseError(`The output file contained an invalid response: ${K}`)
            }
        }
        static parseCommand(q) {
            let K = q.match(/(?:[^\s"]+|"[^"]*")+/g);
            if (!K) throw Error(`Provided command: "${q}" could not be parsed.`);
            for (let _ = 0; _ < K.length; _++)
                if (K[_][0] === '"' && K[_].slice(-1) === '"') K[_] = K[_].slice(1, -1);
            return K
        }
    }
    UFq.PluggableAuthHandler = th1
})
// @from(Ln 154256, Col 4)
YV8 = p((rFq) => {
    Object.defineProperty(rFq, "__esModule", {
        value: !0
    });
    rFq.PluggableAuthClient = rFq.ExecutableError = void 0;
    var kA_ = aq6(),
        NA_ = ah1(),
        EA_ = dFq();
    class eh1 extends Error {
        constructor(q, K) {
            super(`The executable failed with exit code: ${K} and error message: ${q}.`);
            this.code = K, Object.setPrototypeOf(this, new.target.prototype)
        }
    }
    rFq.ExecutableError = eh1;
    var yA_ = 30000,
        cFq = 5000,
        lFq = 120000,
        LA_ = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES",
        nFq = 1;
    class iFq extends kA_.BaseExternalAccountClient {
        constructor(q, K) {
            super(q, K);
            if (!q.credential_source.executable) throw Error('No valid Pluggable Auth "credential_source" provided.');
            if (this.command = q.credential_source.executable.command, !this.command) throw Error('No valid Pluggable Auth "credential_source" provided.');
            if (q.credential_source.executable.timeout_millis === void 0) this.timeoutMillis = yA_;
            else if (this.timeoutMillis = q.credential_source.executable.timeout_millis, this.timeoutMillis < cFq || this.timeoutMillis > lFq) throw Error(`Timeout must be between ${cFq} and ${lFq} milliseconds.`);
            this.outputFile = q.credential_source.executable.output_file, this.handler = new EA_.PluggableAuthHandler({
                command: this.command,
                timeoutMillis: this.timeoutMillis,
                outputFile: this.outputFile
            }), this.credentialSourceType = "executable"
        }
        async retrieveSubjectToken() {
            if (process.env[LA_] !== "1") throw Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
            let q = void 0;
            if (this.outputFile) q = await this.handler.retrieveCachedResponse();
            if (!q) {
                let K = new Map;
                if (K.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience), K.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType), K.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0"), this.outputFile) K.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
                let _ = this.getServiceAccountEmail();
                if (_) K.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", _);
                q = await this.handler.retrieveResponseFromExecutable(K)
            }
            if (q.version > nFq) throw Error(`Version of executable is not currently supported, maximum supported version is ${nFq}.`);
            if (!q.success) throw new eh1(q.errorMessage, q.errorCode);
            if (this.outputFile) {
                if (!q.expirationTime) throw new NA_.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.")
            }
            if (q.isExpired()) throw Error("Executable response is expired.");
            return q.subjectToken
        }
    }
    rFq.PluggableAuthClient = iFq
})
// @from(Ln 154311, Col 4)
qR1 = p((sFq) => {
    Object.defineProperty(sFq, "__esModule", {
        value: !0
    });
    sFq.ExternalAccountClient = void 0;
    var RA_ = aq6(),
        SA_ = ph1(),
        CA_ = Qh1(),
        bA_ = YV8();
    class aFq {
        constructor() {
            throw Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()")
        }
        static fromJSON(q, K) {
            var _, z;
            if (q && q.type === RA_.EXTERNAL_ACCOUNT_TYPE)
                if ((_ = q.credential_source) === null || _ === void 0 ? void 0 : _.environment_id) return new CA_.AwsClient(q, K);
                else if ((z = q.credential_source) === null || z === void 0 ? void 0 : z.executable) return new bA_.PluggableAuthClient(q, K);
            else return new SA_.IdentityPoolClient(q, K);
            else return null
        }
    }
    sFq.ExternalAccountClient = aFq
})