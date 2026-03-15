
// @from(Ln 182293, Col 4)
jJ1 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 182295, Col 4)
JJ1
// @from(Ln 182296, Col 4)
$Q7 = E(() => {
    bB6();
    SP6();
    f56();
    bw();
    RP6();
    pj1();
    BB6();
    gs();
    cJ();
    Fs();
    HJ1();
    Qs();
    kP6();
    WB6();
    Bs();
    rC();
    zd();
    jJ1();
    AJ1();
    Sj();
    eU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    JJ1 = class JJ1 extends nW {
        constructor(A, q) {
            super(A, q);
            this.includeRedirectUri = !0, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes
        }
        async acquireToken(A, q) {
            if (this.performanceClient?.addQueueMeasurement(W8.AuthClientAcquireToken, A.correlationId), !A.code) throw t8(K56);
            let K = Tk(),
                Y = await c9(this.executeTokenRequest.bind(this), W8.AuthClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(this.authority, A),
                z = Y.headers?.[Iw.X_MS_REQUEST_ID],
                _ = new dH(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin, this.performanceClient);
            return _.validateTokenResponse(Y.body), c9(_.handleServerTokenResponse.bind(_), W8.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(Y.body, this.authority, K, A, q, void 0, void 0, void 0, z)
        }
        getLogoutUri(A) {
            if (!A) throw J2(P56);
            let q = this.createLogoutUrlQueryString(A);
            return U5.appendQueryString(this.authority.endSessionEndpoint, q)
        }
        async executeTokenRequest(A, q) {
            this.performanceClient?.addQueueMeasurement(W8.AuthClientExecuteTokenRequest, q.correlationId);
            let K = this.createTokenQueryParameters(q),
                Y = U5.appendQueryString(A.tokenEndpoint, K),
                z = await c9(this.createTokenRequestBody.bind(this), W8.AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, q.correlationId)(q),
                _ = void 0;
            if (q.clientInfo) try {
                let $ = VP6(q.clientInfo, this.cryptoUtils.base64Decode);
                _ = {
                    credential: `${$.uid}${iU.CLIENT_INFO_SEPARATOR}${$.utid}`,
                    type: aG.HOME_ACCOUNT_ID
                }
            } catch ($) {
                this.logger.verbose("Could not parse client info for CCS Header: " + $)
            }
            let w = this.createTokenRequestHeaders(_ || q.ccsCredential),
                O = xP6(this.config.authOptions.clientId, q);
            return c9(this.executePostToTokenEndpoint.bind(this), W8.AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, q.correlationId)(Y, z, w, O, q.correlationId, W8.AuthorizationCodeClientExecutePostToTokenEndpoint)
        }
        async createTokenRequestBody(A) {
            this.performanceClient?.addQueueMeasurement(W8.AuthClientCreateTokenRequestBody, A.correlationId);
            let q = new Map;
            if (k56(q, A.embeddedClientId || A.tokenBodyParameters?.[om] || this.config.authOptions.clientId), !this.includeRedirectUri) {
                if (!A.redirectUri) throw J2(j56)
            } else E56(q, A.redirectUri);
            if (V56(q, A.scopes, !0, this.oidcDefaultScopes), UP8(q, A.code), GB6(q, this.config.libraryInfo), fB6(q, this.config.telemetry.application), hB6(q), this.serverTelemetryManager && !Fj1(this.config)) RB6(q, this.serverTelemetryManager);
            if (A.codeVerifier) cP8(q, A.codeVerifier);
            if (this.config.clientCredentials.clientSecret) vB6(q, this.config.clientCredentials.clientSecret);
            if (this.config.clientCredentials.clientAssertion) {
                let Y = this.config.clientCredentials.clientAssertion;
                NB6(q, await eG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), VB6(q, Y.assertionType)
            }
            if (kB6(q, Vv.AUTHORIZATION_CODE_GRANT), R56(q), A.authenticationScheme === k9.POP) {
                let Y = new h56(this.cryptoUtils, this.performanceClient),
                    z;
                if (!A.popKid) z = (await c9(Y.generateCnf.bind(Y), W8.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
                else z = this.cryptoUtils.encodeKid(A.popKid);
                yB6(q, z)
            } else if (A.authenticationScheme === k9.SSH)
                if (A.sshJwk) LB6(q, A.sshJwk);
                else throw J2(tU);
            if (!i2.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) y56(q, A.claims, this.config.authOptions.clientCapabilities);
            let K = void 0;
            if (A.clientInfo) try {
                let Y = VP6(A.clientInfo, this.cryptoUtils.base64Decode);
                K = {
                    credential: `${Y.uid}${iU.CLIENT_INFO_SEPARATOR}${Y.utid}`,
                    type: aG.HOME_ACCOUNT_ID
                }
            } catch (Y) {
                this.logger.verbose("Could not parse client info for CCS Header: " + Y)
            } else K = A.ccsCredential;
            if (this.config.systemOptions.preventCorsPreflight && K) switch (K.type) {
                case aG.HOME_ACCOUNT_ID:
                    try {
                        let Y = nm(K.credential);
                        qd(q, Y)
                    } catch (Y) {
                        this.logger.verbose("Could not parse home account ID for CCS Header: " + Y)
                    }
                    break;
                case aG.UPN:
                    ps(q, K.credential);
                    break
            }
            if (A.embeddedClientId) Yd(q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
            if (A.tokenBodyParameters) Kd(q, A.tokenBodyParameters);
            if (A.enableSpaAuthorizationCode && (!A.tokenBodyParameters || !A.tokenBodyParameters[cj1])) Kd(q, {
                [cj1]: "1"
            });
            return N56(q, A.correlationId, this.performanceClient), rm(q)
        }
        createLogoutUrlQueryString(A) {
            let q = new Map;
            if (A.postLogoutRedirectUri) BP8(q, A.postLogoutRedirectUri);
            if (A.correlationId) L56(q, A.correlationId);
            if (A.idTokenHint) gP8(q, A.idTokenHint);
            if (A.state) TB6(q, A.state);
            if (A.logoutHint) lP8(q, A.logoutHint);
            if (A.extraQueryParameters) Kd(q, A.extraQueryParameters);
            if (this.config.authOptions.instanceAware) EB6(q);
            return rm(q, this.config.authOptions.encodeExtraQueryParams, A.extraQueryParameters)
        }
    }
})
// @from(Ln 182421, Col 4)
U99 = 300
// @from(Ln 182422, Col 4)
uP6
// @from(Ln 182423, Col 4)
HQ7 = E(() => {
    pj1();
    bB6();
    SP6();
    f56();
    bw();
    RP6();
    BB6();
    HJ1();
    gs();
    Bs();
    cJ();
    bP6();
    Qs();
    Fs();
    WB6();
    kP6();
    mB6();
    rC();
    zd();
    jJ1();
    AJ1();
    zJ1();
    eU();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    uP6 = class uP6 extends nW {
        constructor(A, q) {
            super(A, q)
        }
        async acquireToken(A) {
            this.performanceClient?.addQueueMeasurement(W8.RefreshTokenClientAcquireToken, A.correlationId);
            let q = Tk(),
                K = await c9(this.executeTokenRequest.bind(this), W8.RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(A, this.authority),
                Y = K.headers?.[Iw.X_MS_REQUEST_ID],
                z = new dH(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return z.validateTokenResponse(K.body), c9(z.handleServerTokenResponse.bind(z), W8.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(K.body, this.authority, q, A, void 0, void 0, !0, A.forceCache, Y)
        }
        async acquireTokenByRefreshToken(A) {
            if (!A) throw J2(X56);
            if (this.performanceClient?.addQueueMeasurement(W8.RefreshTokenClientAcquireTokenByRefreshToken, A.correlationId), !A.account) throw t8(rU);
            if (this.cacheManager.isAppMetadataFOCI(A.account.environment)) try {
                return await c9(this.acquireTokenWithCachedRefreshToken.bind(this), W8.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !0)
            } catch (K) {
                let Y = K instanceof vk && K.errorCode === Us,
                    z = K instanceof tG && K.errorCode === um6.INVALID_GRANT_ERROR && K.subError === um6.CLIENT_MISMATCH_ERROR;
                if (Y || z) return c9(this.acquireTokenWithCachedRefreshToken.bind(this), W8.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1);
                else throw K
            }
            return c9(this.acquireTokenWithCachedRefreshToken.bind(this), W8.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1)
        }
        async acquireTokenWithCachedRefreshToken(A, q) {
            this.performanceClient?.addQueueMeasurement(W8.RefreshTokenClientAcquireTokenWithCachedRefreshToken, A.correlationId);
            let K = AQ7(this.cacheManager.getRefreshToken.bind(this.cacheManager), W8.CacheManagerGetRefreshToken, this.logger, this.performanceClient, A.correlationId)(A.account, q, A.correlationId, void 0, this.performanceClient);
            if (!K) throw OJ1(Us);
            if (K.expiresOn && CP6(K.expiresOn, A.refreshTokenExpirationOffsetSeconds || U99)) throw this.performanceClient?.addFields({
                rtExpiresOnMs: Number(K.expiresOn)
            }, A.correlationId), OJ1(uB6);
            let Y = {
                ...A,
                refreshToken: K.secret,
                authenticationScheme: A.authenticationScheme || k9.BEARER,
                ccsCredential: {
                    credential: A.account.homeAccountId,
                    type: aG.HOME_ACCOUNT_ID
                }
            };
            try {
                return await c9(this.acquireToken.bind(this), W8.RefreshTokenClientAcquireToken, this.logger, this.performanceClient, A.correlationId)(Y)
            } catch (z) {
                if (z instanceof vk) {
                    if (this.performanceClient?.addFields({
                            rtExpiresOnMs: Number(K.expiresOn)
                        }, A.correlationId), z.subError === ds) {
                        this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");
                        let _ = this.cacheManager.generateCredentialKey(K);
                        this.cacheManager.removeRefreshToken(_, A.correlationId)
                    }
                }
                throw z
            }
        }
        async executeTokenRequest(A, q) {
            this.performanceClient?.addQueueMeasurement(W8.RefreshTokenClientExecuteTokenRequest, A.correlationId);
            let K = this.createTokenQueryParameters(A),
                Y = U5.appendQueryString(q.tokenEndpoint, K),
                z = await c9(this.createTokenRequestBody.bind(this), W8.RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, A.correlationId)(A),
                _ = this.createTokenRequestHeaders(A.ccsCredential),
                w = xP6(this.config.authOptions.clientId, A);
            return c9(this.executePostToTokenEndpoint.bind(this), W8.RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, A.correlationId)(Y, z, _, w, A.correlationId, W8.RefreshTokenClientExecutePostToTokenEndpoint)
        }
        async createTokenRequestBody(A) {
            this.performanceClient?.addQueueMeasurement(W8.RefreshTokenClientCreateTokenRequestBody, A.correlationId);
            let q = new Map;
            if (k56(q, A.embeddedClientId || A.tokenBodyParameters?.[om] || this.config.authOptions.clientId), A.redirectUri) E56(q, A.redirectUri);
            if (V56(q, A.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), kB6(q, Vv.REFRESH_TOKEN_GRANT), R56(q), GB6(q, this.config.libraryInfo), fB6(q, this.config.telemetry.application), hB6(q), this.serverTelemetryManager && !Fj1(this.config)) RB6(q, this.serverTelemetryManager);
            if (dP8(q, A.refreshToken), this.config.clientCredentials.clientSecret) vB6(q, this.config.clientCredentials.clientSecret);
            if (this.config.clientCredentials.clientAssertion) {
                let K = this.config.clientCredentials.clientAssertion;
                NB6(q, await eG(K.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), VB6(q, K.assertionType)
            }
            if (A.authenticationScheme === k9.POP) {
                let K = new h56(this.cryptoUtils, this.performanceClient),
                    Y;
                if (!A.popKid) Y = (await c9(K.generateCnf.bind(K), W8.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
                else Y = this.cryptoUtils.encodeKid(A.popKid);
                yB6(q, Y)
            } else if (A.authenticationScheme === k9.SSH)
                if (A.sshJwk) LB6(q, A.sshJwk);
                else throw J2(tU);
            if (!i2.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) y56(q, A.claims, this.config.authOptions.clientCapabilities);
            if (this.config.systemOptions.preventCorsPreflight && A.ccsCredential) switch (A.ccsCredential.type) {
                case aG.HOME_ACCOUNT_ID:
                    try {
                        let K = nm(A.ccsCredential.credential);
                        qd(q, K)
                    } catch (K) {
                        this.logger.verbose("Could not parse home account ID for CCS Header: " + K)
                    }
                    break;
                case aG.UPN:
                    ps(q, A.ccsCredential.credential);
                    break
            }
            if (A.embeddedClientId) Yd(q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
            if (A.tokenBodyParameters) Kd(q, A.tokenBodyParameters);
            return N56(q, A.correlationId, this.performanceClient), rm(q)
        }
    }
})
// @from(Ln 182552, Col 4)
MJ1
// @from(Ln 182553, Col 4)
jQ7 = E(() => {
    bB6();
    Qs();
    cJ();
    BB6();
    bw();
    gs();
    EP6();
    rC();
    zd();
    tj1();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    MJ1 = class MJ1 extends nW {
        constructor(A, q) {
            super(A, q)
        }
        async acquireCachedToken(A) {
            this.performanceClient?.addQueueMeasurement(W8.SilentFlowClientAcquireCachedToken, A.correlationId);
            let q = l2.NOT_APPLICABLE;
            if (A.forceRefresh || !this.config.cacheOptions.claimsBasedCachingEnabled && !i2.isEmptyObj(A.claims)) throw this.setCacheOutcome(l2.FORCE_REFRESH_OR_CLAIMS, A.correlationId), t8(aU);
            if (!A.account) throw t8(rU);
            let K = A.account.tenantId || KQ7(A.authority),
                Y = this.cacheManager.getTokenKeys(),
                z = this.cacheManager.getAccessToken(A.account, A, Y, K);
            if (!z) throw this.setCacheOutcome(l2.NO_CACHED_ACCESS_TOKEN, A.correlationId), t8(aU);
            else if (iP8(z.cachedAt) || CP6(z.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.setCacheOutcome(l2.CACHED_ACCESS_TOKEN_EXPIRED, A.correlationId), t8(aU);
            else if (z.refreshOn && CP6(z.refreshOn, 0)) q = l2.PROACTIVELY_REFRESHED;
            let _ = A.authority || this.authority.getPreferredCache(),
                w = {
                    account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(A.account), A.correlationId),
                    accessToken: z,
                    idToken: this.cacheManager.getIdToken(A.account, A.correlationId, Y, K, this.performanceClient),
                    refreshToken: null,
                    appMetadata: this.cacheManager.readAppMetadataFromCache(_)
                };
            if (this.setCacheOutcome(q, A.correlationId), this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
            return [await c9(this.generateResultFromCacheRecord.bind(this), W8.SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, A.correlationId)(w, A), q]
        }
        setCacheOutcome(A, q) {
            if (this.serverTelemetryManager?.setCacheOutcome(A), this.performanceClient?.addFields({
                    cacheOutcome: A
                }, q), A !== l2.NOT_APPLICABLE) this.logger.info(`Token refresh is required due to cache outcome: ${A}`)
        }
        async generateResultFromCacheRecord(A, q) {
            this.performanceClient?.addQueueMeasurement(W8.SilentFlowClientGenerateResultFromCacheRecord, q.correlationId);
            let K;
            if (A.idToken) K = Ad(A.idToken.secret, this.config.cryptoInterface.base64Decode);
            if (q.maxAge || q.maxAge === 0) {
                let Y = K?.auth_time;
                if (!Y) throw t8(nU);
                DB6(Y, q.maxAge)
            }
            return dH.generateAuthenticationResult(this.cryptoUtils, this.authority, A, !0, q, K)
        }
    }
})
// @from(Ln 182609, Col 4)
gB6 = {}
// @from(Ln 182617, Col 0)
function d99(A, q, K, Y) {
    let z = q.correlationId,
        _ = new Map;
    k56(_, q.embeddedClientId || q.extraQueryParameters?.[om] || A.clientId);
    let w = [...q.scopes || [], ...q.extraScopesToConsent || []];
    if (V56(_, w, !0, A.authority.options.OIDCOptions?.defaultScopes), E56(_, q.redirectUri), L56(_, z), mP8(_, q.responseMode), R56(_), q.prompt) pP8(_, q.prompt), Y?.addFields({
        prompt: q.prompt
    }, z);
    if (q.domainHint) FP8(_, q.domainHint), Y?.addFields({
        domainHintFromRequest: !0
    }, z);
    if (q.prompt !== Ls.SELECT_ACCOUNT) {
        if (q.sid && q.prompt === Ls.NONE) K.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"), ij1(_, q.sid), Y?.addFields({
            sidFromRequest: !0
        }, z);
        else if (q.account) {
            let O = n99(q.account),
                $ = r99(q.account);
            if ($ && q.domainHint) K.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'), $ = null;
            if ($) {
                K.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"), hP6(_, $), Y?.addFields({
                    loginHintFromClaim: !0
                }, z);
                try {
                    let H = nm(q.account.homeAccountId);
                    qd(_, H)
                } catch (H) {
                    K.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            } else if (O && q.prompt === Ls.NONE) {
                K.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"), ij1(_, O), Y?.addFields({
                    sidFromClaim: !0
                }, z);
                try {
                    let H = nm(q.account.homeAccountId);
                    qd(_, H)
                } catch (H) {
                    K.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            } else if (q.loginHint) K.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"), hP6(_, q.loginHint), ps(_, q.loginHint), Y?.addFields({
                loginHintFromRequest: !0
            }, z);
            else if (q.account.username) {
                K.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"), hP6(_, q.account.username), Y?.addFields({
                    loginHintFromUpn: !0
                }, z);
                try {
                    let H = nm(q.account.homeAccountId);
                    qd(_, H)
                } catch (H) {
                    K.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            }
        } else if (q.loginHint) K.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"), hP6(_, q.loginHint), ps(_, q.loginHint), Y?.addFields({
            loginHintFromRequest: !0
        }, z)
    } else K.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");
    if (q.nonce) QP8(_, q.nonce);
    if (q.state) TB6(_, q.state);
    if (q.claims || A.clientCapabilities && A.clientCapabilities.length > 0) y56(_, q.claims, A.clientCapabilities);
    if (q.embeddedClientId) Yd(_, A.clientId, A.redirectUri);
    if (A.instanceAware && (!q.extraQueryParameters || !Object.keys(q.extraQueryParameters).includes(LP6))) EB6(_);
    return _
}
// @from(Ln 182682, Col 0)
function c99(A, q, K, Y) {
    let z = rm(q, K, Y);
    return U5.appendQueryString(A.authorizationEndpoint, z)
}
// @from(Ln 182687, Col 0)
function l99(A, q) {
    if (JQ7(A, q), !A.code) throw t8(O56);
    return A
}
// @from(Ln 182692, Col 0)
function JQ7(A, q) {
    if (!A.state || !q) throw A.state ? t8(Cs, "Cached State") : t8(Cs, "Server State");
    let K, Y;
    try {
        K = decodeURIComponent(A.state)
    } catch (z) {
        throw t8(nC, A.state)
    }
    try {
        Y = decodeURIComponent(q)
    } catch (z) {
        throw t8(nC, A.state)
    }
    if (K !== Y) throw t8(tK6);
    if (A.error || A.error_description || A.suberror) {
        let z = i99(A);
        if (wJ1(A.error, A.error_description, A.suberror)) throw new vk(A.error || "", A.error_description, A.suberror, A.timestamp || "", A.trace_id || "", A.correlation_id || "", A.claims || "", z);
        throw new tG(A.error || "", A.error_description, A.suberror, z)
    }
}
// @from(Ln 182713, Col 0)
function i99(A) {
    let K = A.error_uri?.lastIndexOf("code=");
    return K && K >= 0 ? A.error_uri?.substring(K + 5) : void 0
}
// @from(Ln 182718, Col 0)
function n99(A) {
    return A.idTokenClaims?.sid || null
}
// @from(Ln 182722, Col 0)
function r99(A) {
    return A.loginHint || A.idTokenClaims?.login_hint || null
}
// @from(Ln 182725, Col 4)
MQ7 = E(() => {
    SP6();
    RP6();
    bw();
    kP6();
    f56();
    Fs();
    cJ();
    mB6();
    bP6();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 182738, Col 0)
function o99(A) {
    let {
        skus: q,
        libraryName: K,
        libraryVersion: Y,
        extensionName: z,
        extensionVersion: _
    } = A, w = new Map([
        [0, [K, Y]],
        [2, [z, _]]
    ]), O = [];
    if (q?.length) {
        if (O = q.split(DQ7), O.length < 4) return q
    } else O = Array.from({
        length: 4
    }, () => XQ7);
    return w.forEach(($, H) => {
        if ($.length === 2 && $[0]?.length && $[1]?.length) a99({
            skuArr: O,
            index: H,
            skuName: $[0],
            skuVersion: $[1]
        })
    }), O.join(DQ7)
}
// @from(Ln 182764, Col 0)
function a99(A) {
    let {
        skuArr: q,
        index: K,
        skuName: Y,
        skuVersion: z
    } = A;
    if (K >= q.length) return;
    q[K] = [Y, z].join(XQ7)
}
// @from(Ln 182774, Col 0)
class cs {
    constructor(A, q) {
        this.cacheOutcome = l2.NOT_APPLICABLE, this.cacheManager = q, this.apiId = A.apiId, this.correlationId = A.correlationId, this.wrapperSKU = A.wrapperSKU || S8.EMPTY_STRING, this.wrapperVer = A.wrapperVer || S8.EMPTY_STRING, this.telemetryCacheKey = UM.CACHE_KEY + iU.CACHE_KEY_SEPARATOR + A.clientId
    }
    generateCurrentRequestHeaderValue() {
        let A = `${this.apiId}${UM.VALUE_SEPARATOR}${this.cacheOutcome}`,
            q = [this.wrapperSKU, this.wrapperVer],
            K = this.getNativeBrokerErrorCode();
        if (K?.length) q.push(`broker_error=${K}`);
        let Y = q.join(UM.VALUE_SEPARATOR),
            z = this.getRegionDiscoveryFields(),
            _ = [A, z].join(UM.VALUE_SEPARATOR);
        return [UM.SCHEMA_VERSION, _, Y].join(UM.CATEGORY_SEPARATOR)
    }
    generateLastRequestHeaderValue() {
        let A = this.getLastRequests(),
            q = cs.maxErrorsToSend(A),
            K = A.failedRequests.slice(0, 2 * q).join(UM.VALUE_SEPARATOR),
            Y = A.errors.slice(0, q).join(UM.VALUE_SEPARATOR),
            z = A.errors.length,
            _ = q < z ? UM.OVERFLOW_TRUE : UM.OVERFLOW_FALSE,
            w = [z, _].join(UM.VALUE_SEPARATOR);
        return [UM.SCHEMA_VERSION, A.cacheHits, K, Y, w].join(UM.CATEGORY_SEPARATOR)
    }
    cacheFailedRequest(A) {
        let q = this.getLastRequests();
        if (q.errors.length >= UM.MAX_CACHED_ERRORS) q.failedRequests.shift(), q.failedRequests.shift(), q.errors.shift();
        if (q.failedRequests.push(this.apiId, this.correlationId), A instanceof Error && !!A && A.toString())
            if (A instanceof T5)
                if (A.subError) q.errors.push(A.subError);
                else if (A.errorCode) q.errors.push(A.errorCode);
        else q.errors.push(A.toString());
        else q.errors.push(A.toString());
        else q.errors.push(UM.UNKNOWN_ERROR);
        this.cacheManager.setServerTelemetry(this.telemetryCacheKey, q, this.correlationId);
        return
    }
    incrementCacheHits() {
        let A = this.getLastRequests();
        return A.cacheHits += 1, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, A, this.correlationId), A.cacheHits
    }
    getLastRequests() {
        let A = {
            failedRequests: [],
            errors: [],
            cacheHits: 0
        };
        return this.cacheManager.getServerTelemetry(this.telemetryCacheKey) || A
    }
    clearTelemetryCache() {
        let A = this.getLastRequests(),
            q = cs.maxErrorsToSend(A),
            K = A.errors.length;
        if (q === K) this.cacheManager.removeItem(this.telemetryCacheKey, this.correlationId);
        else {
            let Y = {
                failedRequests: A.failedRequests.slice(q * 2),
                errors: A.errors.slice(q),
                cacheHits: 0
            };
            this.cacheManager.setServerTelemetry(this.telemetryCacheKey, Y, this.correlationId)
        }
    }
    static maxErrorsToSend(A) {
        let q, K = 0,
            Y = 0,
            z = A.errors.length;
        for (q = 0; q < z; q++) {
            let _ = A.failedRequests[2 * q] || S8.EMPTY_STRING,
                w = A.failedRequests[2 * q + 1] || S8.EMPTY_STRING,
                O = A.errors[q] || S8.EMPTY_STRING;
            if (Y += _.toString().length + w.toString().length + O.length + 3, Y < UM.MAX_LAST_HEADER_BYTES) K += 1;
            else break
        }
        return K
    }
    getRegionDiscoveryFields() {
        let A = [];
        return A.push(this.regionUsed || S8.EMPTY_STRING), A.push(this.regionSource || S8.EMPTY_STRING), A.push(this.regionOutcome || S8.EMPTY_STRING), A.join(",")
    }
    updateRegionDiscoveryMetadata(A) {
        this.regionUsed = A.region_used, this.regionSource = A.region_source, this.regionOutcome = A.region_outcome
    }
    setCacheOutcome(A) {
        this.cacheOutcome = A
    }
    setNativeBrokerErrorCode(A) {
        let q = this.getLastRequests();
        q.nativeBrokerErrorCode = A, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, q, this.correlationId)
    }
    getNativeBrokerErrorCode() {
        return this.getLastRequests().nativeBrokerErrorCode
    }
    clearNativeBrokerErrorCode() {
        let A = this.getLastRequests();
        delete A.nativeBrokerErrorCode, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, A, this.correlationId)
    }
    static makeExtraSkuString(A) {
        return o99(A)
    }
}
// @from(Ln 182875, Col 4)
DQ7 = ","
// @from(Ln 182876, Col 4)
XQ7 = "|"
// @from(Ln 182877, Col 4)
PQ7 = E(() => {
    bw();
    UL(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 182881, Col 4)
X_ = E(() => {
    $Q7();
    HQ7();
    jQ7();
    bB6();
    WB6();
    tj1();
    Cj1();
    MB6();
    oX8();
    uj1();
    Fs();
    BX8();
    MQ7();
    SP6();
    BB6();
    jB6();
    Rj1();
    mB6();
    zJ1();
    UL();
    bX8();
    bP6();
    cJ();
    Sj();
    Bs();
    eU();
    bw();
    gs();
    PQ7();
    EP6();
    tP8();
    aj1();
    Qs();
    f56();
    RP6();
    Y08();
    jJ1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 182920, Col 0)
class ls {
    static deserializeJSONBlob(A) {
        return !A ? {} : JSON.parse(A)
    }
    static deserializeAccounts(A) {
        let q = {};
        if (A) Object.keys(A).map(function(K) {
            let Y = A[K],
                z = {
                    homeAccountId: Y.home_account_id,
                    environment: Y.environment,
                    realm: Y.realm,
                    localAccountId: Y.local_account_id,
                    username: Y.username,
                    authorityType: Y.authority_type,
                    name: Y.name,
                    clientInfo: Y.client_info,
                    lastModificationTime: Y.last_modification_time,
                    lastModificationApp: Y.last_modification_app,
                    tenantProfiles: Y.tenantProfiles?.map((w) => {
                        return JSON.parse(w)
                    }),
                    lastUpdatedAt: Date.now().toString()
                },
                _ = new lJ;
            T56.toObject(_, z), q[K] = _
        });
        return q
    }
    static deserializeIdTokens(A) {
        let q = {};
        if (A) Object.keys(A).map(function(K) {
            let Y = A[K],
                z = {
                    homeAccountId: Y.home_account_id,
                    environment: Y.environment,
                    credentialType: Y.credential_type,
                    clientId: Y.client_id,
                    secret: Y.secret,
                    realm: Y.realm,
                    lastUpdatedAt: Date.now().toString()
                };
            q[K] = z
        });
        return q
    }
    static deserializeAccessTokens(A) {
        let q = {};
        if (A) Object.keys(A).map(function(K) {
            let Y = A[K],
                z = {
                    homeAccountId: Y.home_account_id,
                    environment: Y.environment,
                    credentialType: Y.credential_type,
                    clientId: Y.client_id,
                    secret: Y.secret,
                    realm: Y.realm,
                    target: Y.target,
                    cachedAt: Y.cached_at,
                    expiresOn: Y.expires_on,
                    extendedExpiresOn: Y.extended_expires_on,
                    refreshOn: Y.refresh_on,
                    keyId: Y.key_id,
                    tokenType: Y.token_type,
                    requestedClaims: Y.requestedClaims,
                    requestedClaimsHash: Y.requestedClaimsHash,
                    userAssertionHash: Y.userAssertionHash,
                    lastUpdatedAt: Date.now().toString()
                };
            q[K] = z
        });
        return q
    }
    static deserializeRefreshTokens(A) {
        let q = {};
        if (A) Object.keys(A).map(function(K) {
            let Y = A[K],
                z = {
                    homeAccountId: Y.home_account_id,
                    environment: Y.environment,
                    credentialType: Y.credential_type,
                    clientId: Y.client_id,
                    secret: Y.secret,
                    familyId: Y.family_id,
                    target: Y.target,
                    realm: Y.realm,
                    lastUpdatedAt: Date.now().toString()
                };
            q[K] = z
        });
        return q
    }
    static deserializeAppMetadata(A) {
        let q = {};
        if (A) Object.keys(A).map(function(K) {
            let Y = A[K];
            q[K] = {
                clientId: Y.client_id,
                environment: Y.environment,
                familyId: Y.family_id
            }
        });
        return q
    }
    static deserializeAllCache(A) {
        return {
            accounts: A.Account ? this.deserializeAccounts(A.Account) : {},
            idTokens: A.IdToken ? this.deserializeIdTokens(A.IdToken) : {},
            accessTokens: A.AccessToken ? this.deserializeAccessTokens(A.AccessToken) : {},
            refreshTokens: A.RefreshToken ? this.deserializeRefreshTokens(A.RefreshToken) : {},
            appMetadata: A.AppMetadata ? this.deserializeAppMetadata(A.AppMetadata) : {}
        }
    }
}
// @from(Ln 183034, Col 4)
DJ1 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 183037, Col 4)
z08 = {}
// @from(Ln 183042, Col 4)
WQ7 = E(() => {
    kj1();
    DJ1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 183046, Col 4)
ZQ7 = "system_assigned_managed_identity"
// @from(Ln 183047, Col 4)
YY9 = "managed_identity"
// @from(Ln 183048, Col 4)
_08
// @from(Ln 183048, Col 9)
Ev
// @from(Ln 183048, Col 13)
iJ
// @from(Ln 183048, Col 17)
bK
// @from(Ln 183048, Col 21)
tK
// @from(Ln 183048, Col 25)
i$
// @from(Ln 183048, Col 29)
GO
// @from(Ln 183048, Col 33)
XJ1
// @from(Ln 183048, Col 38)
GQ7 = "REGION_NAME"
// @from(Ln 183049, Col 4)
fQ7 = "MSAL_FORCE_REGION"
// @from(Ln 183050, Col 4)
TQ7 = 32
// @from(Ln 183051, Col 4)
vQ7
// @from(Ln 183051, Col 9)
PJ1
// @from(Ln 183051, Col 14)
w08
// @from(Ln 183051, Col 19)
Af
// @from(Ln 183051, Col 23)
wd
// @from(Ln 183051, Col 27)
lL
// @from(Ln 183051, Col 31)
WJ1
// @from(Ln 183051, Col 36)
NQ7 = 4096
// @from(Ln 183052, Col 4)
fO = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    _08 = `https://login.microsoftonline.com/${YY9}/`, Ev = {
        AUTHORIZATION_HEADER_NAME: "Authorization",
        METADATA_HEADER_NAME: "Metadata",
        APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
        ML_AND_SF_SECRET_HEADER_NAME: "secret"
    }, iJ = {
        API_VERSION: "api-version",
        RESOURCE: "resource",
        SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
        XMS_CC: "xms_cc"
    }, bK = {
        AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
        DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
        IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
        IDENTITY_HEADER: "IDENTITY_HEADER",
        IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
        IMDS_ENDPOINT: "IMDS_ENDPOINT",
        MSI_ENDPOINT: "MSI_ENDPOINT",
        MSI_SECRET: "MSI_SECRET"
    }, tK = {
        APP_SERVICE: "AppService",
        AZURE_ARC: "AzureArc",
        CLOUD_SHELL: "CloudShell",
        DEFAULT_TO_IMDS: "DefaultToImds",
        IMDS: "Imds",
        MACHINE_LEARNING: "MachineLearning",
        SERVICE_FABRIC: "ServiceFabric"
    }, i$ = {
        SYSTEM_ASSIGNED: "system-assigned",
        USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
        USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
        USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
    }, GO = {
        GET: "get",
        POST: "post"
    }, XJ1 = {
        SUCCESS_RANGE_START: f5.SUCCESS_RANGE_START,
        SUCCESS_RANGE_END: f5.SUCCESS_RANGE_END,
        SERVER_ERROR: f5.SERVER_ERROR
    }, vQ7 = {
        SHA256: "sha256"
    }, PJ1 = {
        CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    }, w08 = {
        KEY_SEPARATOR: "-"
    }, Af = {
        MSAL_SKU: "msal.js.node",
        JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        AUTHORIZATION_PENDING: "authorization_pending",
        HTTP_PROTOCOL: "http://",
        LOCALHOST: "localhost"
    }, wd = {
        acquireTokenSilent: 62,
        acquireTokenByUsernamePassword: 371,
        acquireTokenByDeviceCode: 671,
        acquireTokenByClientCredential: 771,
        acquireTokenByCode: 871,
        acquireTokenByRefreshToken: 872
    }, lL = {
        RSA_256: "RS256",
        PSS_256: "PS256",
        X5T_256: "x5t#S256",
        X5T: "x5t",
        X5C: "x5c",
        AUDIENCE: "aud",
        EXPIRATION_TIME: "exp",
        ISSUER: "iss",
        SUBJECT: "sub",
        NOT_BEFORE: "nbf",
        JWT_ID: "jti"
    }, WJ1 = {
        INTERVAL_MS: 100,
        TIMEOUT_MS: 5000
    }
})
// @from(Ln 183129, Col 0)
class FB6 {
    static getNetworkResponse(A, q, K) {
        return {
            headers: A,
            body: q,
            status: K
        }
    }
    static urlToHttpOptions(A) {
        let q = {
            protocol: A.protocol,
            hostname: A.hostname && A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname,
            hash: A.hash,
            search: A.search,
            pathname: A.pathname,
            path: `${A.pathname||""}${A.search||""}`,
            href: A.href
        };
        if (A.port !== "") q.port = Number(A.port);
        if (A.username || A.password) q.auth = `${decodeURIComponent(A.username)}:${decodeURIComponent(A.password)}`;
        return q
    }
}
// @from(Ln 183152, Col 4)
VQ7 = E(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 183156, Col 0)
class pB6 {
    constructor(A, q) {
        this.proxyUrl = A || "", this.customAgentOptions = q || {}
    }
    async sendGetRequestAsync(A, q, K) {
        if (this.proxyUrl) return EQ7(A, this.proxyUrl, GO.GET, q, this.customAgentOptions, K);
        else return yQ7(A, GO.GET, q, this.customAgentOptions, K)
    }
    async sendPostRequestAsync(A, q) {
        if (this.proxyUrl) return EQ7(A, this.proxyUrl, GO.POST, q, this.customAgentOptions);
        else return yQ7(A, GO.POST, q, this.customAgentOptions)
    }
}
// @from(Ln 183169, Col 4)
EQ7 = (A, q, K, Y, z, _) => {
        let w = new URL(A),
            O = new URL(q),
            $ = Y?.headers || {},
            H = {
                host: O.hostname,
                port: O.port,
                method: "CONNECT",
                path: w.hostname,
                headers: $
            };
        if (z && Object.keys(z).length) H.agent = new O08.Agent(z);
        let j = "";
        if (K === GO.POST) {
            let M = Y?.body || "";
            j = `Content-Type: application/x-www-form-urlencoded\r
Content-Length: ${M.length}\r
\r
${M}`
        } else if (_) H.timeout = _;
        let J = `${K.toUpperCase()} ${w.href} HTTP/1.1\r
Host: ${w.host}\r
Connection: close\r
` + j + `\r
`;
        return new Promise((M, D) => {
            let X = O08.request(H);
            if (_) X.on("timeout", () => {
                X.destroy(), D(Error("Request time out"))
            });
            X.end(), X.on("connect", (P, W) => {
                let Z = P?.statusCode || XJ1.SERVER_ERROR;
                if (Z < XJ1.SUCCESS_RANGE_START || Z > XJ1.SUCCESS_RANGE_END) X.destroy(), W.destroy(), D(Error(`Error connecting to proxy. Http status code: ${P.statusCode}. Http status message: ${P?.statusMessage||"Unknown"}`));
                W.write(J);
                let G = [];
                W.on("data", (f) => {
                    G.push(f)
                }), W.on("end", () => {
                    let v = Buffer.concat([...G]).toString().split(`\r
`),
                        N = parseInt(v[0].split(" ")[1]),
                        V = v[0].split(" ").slice(2).join(" "),
                        L = v[v.length - 1],
                        h = v.slice(1, v.length - 2),
                        R = new Map;
                    h.forEach((B) => {
                        let b = B.split(new RegExp(/:\s(.*)/s)),
                            p = b[0],
                            Q = b[1];
                        try {
                            let U = JSON.parse(Q);
                            if (U && typeof U === "object") Q = U
                        } catch (U) {}
                        R.set(p, Q)
                    });
                    let I = Object.fromEntries(R),
                        g = FB6.getNetworkResponse(I, LQ7(N, V, I, L), N);
                    if ((N < f5.SUCCESS_RANGE_START || N > f5.SUCCESS_RANGE_END) && g.body.error !== Af.AUTHORIZATION_PENDING) X.destroy();
                    M(g)
                }), W.on("error", (f) => {
                    X.destroy(), W.destroy(), D(Error(f.toString()))
                })
            }), X.on("error", (P) => {
                X.destroy(), D(Error(P.toString()))
            })
        })
    }
// @from(Ln 183236, Col 4)
yQ7 = (A, q, K, Y, z) => {
        let _ = q === GO.POST,
            w = K?.body || "",
            O = new URL(A),
            $ = K?.headers || {},
            H = {
                method: q,
                headers: $,
                ...FB6.urlToHttpOptions(O)
            };
        if (Y && Object.keys(Y).length) H.agent = new kQ7.Agent(Y);
        if (_) H.headers = {
            ...H.headers,
            "Content-Length": w.length
        };
        else if (z) H.timeout = z;
        return new Promise((j, J) => {
            let M;
            if (H.protocol === "http:") M = O08.request(H);
            else M = kQ7.request(H);
            if (_) M.write(w);
            if (z) M.on("timeout", () => {
                M.destroy(), J(Error("Request time out"))
            });
            M.end(), M.on("response", (D) => {
                let {
                    headers: X,
                    statusCode: P,
                    statusMessage: W
                } = D, Z = [];
                D.on("data", (G) => {
                    Z.push(G)
                }), D.on("end", () => {
                    let G = Buffer.concat([...Z]).toString(),
                        f = X,
                        v = FB6.getNetworkResponse(f, LQ7(P, W, f, G), P);
                    if ((P < f5.SUCCESS_RANGE_START || P > f5.SUCCESS_RANGE_END) && v.body.error !== Af.AUTHORIZATION_PENDING) M.destroy();
                    j(v)
                })
            }), M.on("error", (D) => {
                M.destroy(), J(Error(D.toString()))
            })
        })
    }
// @from(Ln 183280, Col 4)
LQ7 = (A, q, K, Y) => {
        let z;
        try {
            z = JSON.parse(Y)
        } catch (_) {
            let w, O;
            if (A >= f5.CLIENT_ERROR_RANGE_START && A <= f5.CLIENT_ERROR_RANGE_END) w = "client_error", O = "A client";
            else if (A >= f5.SERVER_ERROR_RANGE_START && A <= f5.SERVER_ERROR_RANGE_END) w = "server_error", O = "A server";
            else w = "unknown_error", O = "An unknown";
            z = {
                error: w,
                error_description: `${O} error occured.
Http status code: ${A}
Http status message: ${q||"Unknown"}
Headers: ${JSON.stringify(K)}`
            }
        }
        return z
    }
// @from(Ln 183299, Col 4)
RQ7 = E(() => {
    X_();
    fO();
    VQ7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 183304, Col 4)
ZJ1 = "invalid_file_extension"
// @from(Ln 183305, Col 4)
GJ1 = "invalid_file_path"
// @from(Ln 183306, Col 4)
is = "invalid_managed_identity_id_type"
// @from(Ln 183307, Col 4)
fJ1 = "invalid_secret"
// @from(Ln 183308, Col 4)
hQ7 = "missing_client_id"
// @from(Ln 183309, Col 4)
SQ7 = "network_unavailable"
// @from(Ln 183310, Col 4)
TJ1 = "platform_not_supported"
// @from(Ln 183311, Col 4)
vJ1 = "unable_to_create_azure_arc"
// @from(Ln 183312, Col 4)
NJ1 = "unable_to_create_cloud_shell"
// @from(Ln 183313, Col 4)
VJ1 = "unable_to_create_source"
// @from(Ln 183314, Col 4)
QB6 = "unable_to_read_secret_file"
// @from(Ln 183315, Col 4)
CQ7 = "user_assigned_not_available_at_runtime"
// @from(Ln 183316, Col 4)
kJ1 = "www_authenticate_header_missing"
// @from(Ln 183317, Col 4)
EJ1 = "www_authenticate_header_unsupported_format"
// @from(Ln 183318, Col 4)
S56
// @from(Ln 183319, Col 4)
C56 = E(() => {
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    S56 = {
        [bK.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
        [bK.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
        [bK.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
        [bK.MSI_ENDPOINT]: "msi_endpoint_url_malformed"
    }
})
// @from(Ln 183329, Col 0)
function Cj(A) {
    return new $08(A)
}
// @from(Ln 183332, Col 4)
zY9
// @from(Ln 183332, Col 9)
$08
// @from(Ln 183333, Col 4)
mP6 = E(() => {
    X_();
    C56();
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    zY9 = {
        [ZJ1]: "The file path in the WWW-Authenticate header does not contain a .key file.",
        [GJ1]: "The file path in the WWW-Authenticate header is not in a valid Windows or Linux Format.",
        [is]: "More than one ManagedIdentityIdType was provided.",
        [fJ1]: "The secret in the file on the file path in the WWW-Authenticate header is greater than 4096 bytes.",
        [TJ1]: "The platform is not supported by Azure Arc. Azure Arc only supports Windows and Linux.",
        [hQ7]: "A ManagedIdentityId id was not provided.",
        [S56.AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${bK.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
        [S56.IDENTITY_ENDPOINT]: `The Managed Identity's '${bK.IDENTITY_ENDPOINT}' environment variable is malformed.`,
        [S56.IMDS_ENDPOINT]: `The Managed Identity's '${bK.IMDS_ENDPOINT}' environment variable is malformed.`,
        [S56.MSI_ENDPOINT]: `The Managed Identity's '${bK.MSI_ENDPOINT}' environment variable is malformed.`,
        [SQ7]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
        [vJ1]: "Azure Arc Managed Identities can only be system assigned.",
        [NJ1]: "Cloud Shell Managed Identities can only be system assigned.",
        [VJ1]: "Unable to create a Managed Identity source based on environment variables.",
        [QB6]: "Unable to read the secret file.",
        [CQ7]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
        [kJ1]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
        [EJ1]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format."
    };
    $08 = class $08 extends T5 {
        constructor(A) {
            super(A, zY9[A]);
            this.name = "ManagedIdentityError", Object.setPrototypeOf(this, $08.prototype)
        }
    }
})
// @from(Ln 183364, Col 0)
class H08 {
    get id() {
        return this._id
    }
    set id(A) {
        this._id = A
    }
    get idType() {
        return this._idType
    }
    set idType(A) {
        this._idType = A
    }
    constructor(A) {
        let q = A?.userAssignedClientId,
            K = A?.userAssignedResourceId,
            Y = A?.userAssignedObjectId;
        if (q) {
            if (K || Y) throw Cj(is);
            this.id = q, this.idType = i$.USER_ASSIGNED_CLIENT_ID
        } else if (K) {
            if (q || Y) throw Cj(is);
            this.id = K, this.idType = i$.USER_ASSIGNED_RESOURCE_ID
        } else if (Y) {
            if (q || K) throw Cj(is);
            this.id = Y, this.idType = i$.USER_ASSIGNED_OBJECT_ID
        } else this.id = ZQ7, this.idType = i$.SYSTEM_ASSIGNED
    }
}
// @from(Ln 183393, Col 4)
IQ7 = E(() => {
    mP6();
    fO();
    C56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 183398, Col 4)
nJ
// @from(Ln 183398, Col 8)
O$
// @from(Ln 183399, Col 4)
UB6 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    nJ = {
        invalidLoopbackAddressType: {
            code: "invalid_loopback_server_address_type",
            desc: "Loopback server address is not type string. This is unexpected."
        },
        unableToLoadRedirectUri: {
            code: "unable_to_load_redirectUrl",
            desc: "Loopback server callback was invoked without a url. This is unexpected."
        },
        noAuthCodeInResponse: {
            code: "no_auth_code_in_response",
            desc: "No auth code found in the server response. Please check your network trace to determine what happened."
        },
        noLoopbackServerExists: {
            code: "no_loopback_server_exists",
            desc: "No loopback server exists yet."
        },
        loopbackServerAlreadyExists: {
            code: "loopback_server_already_exists",
            desc: "Loopback server already exists. Cannot create another."
        },
        loopbackServerTimeout: {
            code: "loopback_server_timeout",
            desc: "Timed out waiting for auth code listener to be registered."
        },
        stateNotFoundError: {
            code: "state_not_found",
            desc: "State not found. Please verify that the request originated from msal."
        },
        thumbprintMissing: {
            code: "thumbprint_missing_from_client_certificate",
            desc: "Client certificate does not contain a SHA-1 or SHA-256 thumbprint."
        },
        redirectUriNotSupported: {
            code: "redirect_uri_not_supported",
            desc: "RedirectUri is not supported in this scenario. Please remove redirectUri from the request."
        }
    };
    O$ = class O$ extends T5 {
        constructor(A, q) {
            super(A, q);
            this.name = "NodeAuthError"
        }
        static createInvalidLoopbackAddressTypeError() {
            return new O$(nJ.invalidLoopbackAddressType.code, `${nJ.invalidLoopbackAddressType.desc}`)
        }
        static createUnableToLoadRedirectUrlError() {
            return new O$(nJ.unableToLoadRedirectUri.code, `${nJ.unableToLoadRedirectUri.desc}`)
        }
        static createNoAuthCodeInResponseError() {
            return new O$(nJ.noAuthCodeInResponse.code, `${nJ.noAuthCodeInResponse.desc}`)
        }
        static createNoLoopbackServerExistsError() {
            return new O$(nJ.noLoopbackServerExists.code, `${nJ.noLoopbackServerExists.desc}`)
        }
        static createLoopbackServerAlreadyExistsError() {
            return new O$(nJ.loopbackServerAlreadyExists.code, `${nJ.loopbackServerAlreadyExists.desc}`)
        }
        static createLoopbackServerTimeoutError() {
            return new O$(nJ.loopbackServerTimeout.code, `${nJ.loopbackServerTimeout.desc}`)
        }
        static createStateNotFoundError() {
            return new O$(nJ.stateNotFoundError.code, nJ.stateNotFoundError.desc)
        }
        static createThumbprintMissingError() {
            return new O$(nJ.thumbprintMissing.code, nJ.thumbprintMissing.desc)
        }
        static createRedirectUriNotSupportedError() {
            return new O$(nJ.redirectUriNotSupported.code, nJ.redirectUriNotSupported.desc)
        }
    }
})
// @from(Ln 183474, Col 0)
function bQ7({
    auth: A,
    broker: q,
    cache: K,
    system: Y,
    telemetry: z
}) {
    let _ = {
        ...OY9,
        networkClient: new pB6(Y?.proxyUrl, Y?.customAgentOptions),
        loggerOptions: Y?.loggerOptions || j08,
        disableInternalRetries: Y?.disableInternalRetries || !1
    };
    if (!!A.clientCertificate && !A.clientCertificate.thumbprint && !A.clientCertificate.thumbprintSha256) throw O$.createStateNotFoundError();
    return {
        auth: {
            ..._Y9,
            ...A
        },
        broker: {
            ...q
        },
        cache: {
            ...wY9,
            ...K
        },
        system: {
            ..._,
            ...Y
        },
        telemetry: {
            ...$Y9,
            ...z
        }
    }
}
// @from(Ln 183511, Col 0)
function xQ7({
    clientCapabilities: A,
    managedIdentityIdParams: q,
    system: K
}) {
    let Y = new H08(q),
        z = K?.loggerOptions || j08,
        _;
    if (K?.networkClient) _ = K.networkClient;
    else _ = new pB6(K?.proxyUrl, K?.customAgentOptions);
    return {
        clientCapabilities: A || [],
        managedIdentityId: Y,
        system: {
            loggerOptions: z,
            networkClient: _
        },
        disableInternalRetries: K?.disableInternalRetries || !1
    }
}
// @from(Ln 183531, Col 4)
_Y9
// @from(Ln 183531, Col 9)
wY9
// @from(Ln 183531, Col 14)
j08
// @from(Ln 183531, Col 19)
OY9
// @from(Ln 183531, Col 24)
$Y9
// @from(Ln 183532, Col 4)
J08 = E(() => {
    X_();
    RQ7();
    IQ7();
    UB6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    _Y9 = {
        clientId: S8.EMPTY_STRING,
        authority: S8.DEFAULT_AUTHORITY,
        clientSecret: S8.EMPTY_STRING,
        clientAssertion: S8.EMPTY_STRING,
        clientCertificate: {
            thumbprint: S8.EMPTY_STRING,
            thumbprintSha256: S8.EMPTY_STRING,
            privateKey: S8.EMPTY_STRING,
            x5c: S8.EMPTY_STRING
        },
        knownAuthorities: [],
        cloudDiscoveryMetadata: S8.EMPTY_STRING,
        authorityMetadata: S8.EMPTY_STRING,
        clientCapabilities: [],
        protocolMode: iW.AAD,
        azureCloudOptions: {
            azureCloudInstance: sU.None,
            tenant: S8.EMPTY_STRING
        },
        skipAuthorityMetadataCache: !1,
        encodeExtraQueryParams: !1
    }, wY9 = {
        claimsBasedCachingEnabled: !1
    }, j08 = {
        loggerCallback: () => {},
        piiLoggingEnabled: !1,
        logLevel: l$.Info
    }, OY9 = {
        loggerOptions: j08,
        networkClient: new pB6,
        proxyUrl: S8.EMPTY_STRING,
        customAgentOptions: {},
        disableInternalRetries: !1
    }, $Y9 = {
        application: {
            appName: S8.EMPTY_STRING,
            appVersion: S8.EMPTY_STRING
        }
    }
})
// @from(Ln 183578, Col 4)
M08 = x((uQ7) => {
    Object.defineProperty(uQ7, "__esModule", {
        value: !0
    });
    uQ7.default = JY9;
    var HY9 = jY9(x6("crypto"));

    function jY9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var LJ1 = new Uint8Array(256),
        yJ1 = LJ1.length;

    function JY9() {
        if (yJ1 > LJ1.length - 16) HY9.default.randomFillSync(LJ1), yJ1 = 0;
        return LJ1.slice(yJ1, yJ1 += 16)
    }
})
// @from(Ln 183598, Col 4)
gQ7 = x((mQ7) => {
    Object.defineProperty(mQ7, "__esModule", {
        value: !0
    });
    mQ7.default = void 0;
    var DY9 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    mQ7.default = DY9
})
// @from(Ln 183606, Col 4)
dB6 = x((FQ7) => {
    Object.defineProperty(FQ7, "__esModule", {
        value: !0
    });
    FQ7.default = void 0;
    var XY9 = PY9(gQ7());

    function PY9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function WY9(A) {
        return typeof A === "string" && XY9.default.test(A)
    }
    var ZY9 = WY9;
    FQ7.default = ZY9
})
// @from(Ln 183625, Col 4)
cB6 = x((QQ7) => {
    Object.defineProperty(QQ7, "__esModule", {
        value: !0
    });
    QQ7.default = void 0;
    var GY9 = fY9(dB6());

    function fY9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var iP = [];
    for (let A = 0; A < 256; ++A) iP.push((A + 256).toString(16).substr(1));

    function TY9(A, q = 0) {
        let K = (iP[A[q + 0]] + iP[A[q + 1]] + iP[A[q + 2]] + iP[A[q + 3]] + "-" + iP[A[q + 4]] + iP[A[q + 5]] + "-" + iP[A[q + 6]] + iP[A[q + 7]] + "-" + iP[A[q + 8]] + iP[A[q + 9]] + "-" + iP[A[q + 10]] + iP[A[q + 11]] + iP[A[q + 12]] + iP[A[q + 13]] + iP[A[q + 14]] + iP[A[q + 15]]).toLowerCase();
        if (!(0, GY9.default)(K)) throw TypeError("Stringified UUID is invalid");
        return K
    }
    var vY9 = TY9;
    QQ7.default = vY9
})
// @from(Ln 183648, Col 4)
nQ7 = x((lQ7) => {
    Object.defineProperty(lQ7, "__esModule", {
        value: !0
    });
    lQ7.default = void 0;
    var NY9 = cQ7(M08()),
        VY9 = cQ7(cB6());

    function cQ7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var dQ7, D08, X08 = 0,
        P08 = 0;

    function kY9(A, q, K) {
        let Y = q && K || 0,
            z = q || Array(16);
        A = A || {};
        let _ = A.node || dQ7,
            w = A.clockseq !== void 0 ? A.clockseq : D08;
        if (_ == null || w == null) {
            let M = A.random || (A.rng || NY9.default)();
            if (_ == null) _ = dQ7 = [M[0] | 1, M[1], M[2], M[3], M[4], M[5]];
            if (w == null) w = D08 = (M[6] << 8 | M[7]) & 16383
        }
        let O = A.msecs !== void 0 ? A.msecs : Date.now(),
            $ = A.nsecs !== void 0 ? A.nsecs : P08 + 1,
            H = O - X08 + ($ - P08) / 1e4;
        if (H < 0 && A.clockseq === void 0) w = w + 1 & 16383;
        if ((H < 0 || O > X08) && A.nsecs === void 0) $ = 0;
        if ($ >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        X08 = O, P08 = $, D08 = w, O += 12219292800000;
        let j = ((O & 268435455) * 1e4 + $) % 4294967296;
        z[Y++] = j >>> 24 & 255, z[Y++] = j >>> 16 & 255, z[Y++] = j >>> 8 & 255, z[Y++] = j & 255;
        let J = O / 4294967296 * 1e4 & 268435455;
        z[Y++] = J >>> 8 & 255, z[Y++] = J & 255, z[Y++] = J >>> 24 & 15 | 16, z[Y++] = J >>> 16 & 255, z[Y++] = w >>> 8 | 128, z[Y++] = w & 255;
        for (let M = 0; M < 6; ++M) z[Y + M] = _[M];
        return q || (0, VY9.default)(z)
    }
    var EY9 = kY9;
    lQ7.default = EY9
})
// @from(Ln 183692, Col 4)
W08 = x((rQ7) => {
    Object.defineProperty(rQ7, "__esModule", {
        value: !0
    });
    rQ7.default = void 0;
    var yY9 = LY9(dB6());

    function LY9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function RY9(A) {
        if (!(0, yY9.default)(A)) throw TypeError("Invalid UUID");
        let q, K = new Uint8Array(16);
        return K[0] = (q = parseInt(A.slice(0, 8), 16)) >>> 24, K[1] = q >>> 16 & 255, K[2] = q >>> 8 & 255, K[3] = q & 255, K[4] = (q = parseInt(A.slice(9, 13), 16)) >>> 8, K[5] = q & 255, K[6] = (q = parseInt(A.slice(14, 18), 16)) >>> 8, K[7] = q & 255, K[8] = (q = parseInt(A.slice(19, 23), 16)) >>> 8, K[9] = q & 255, K[10] = (q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, K[11] = q / 4294967296 & 255, K[12] = q >>> 24 & 255, K[13] = q >>> 16 & 255, K[14] = q >>> 8 & 255, K[15] = q & 255, K
    }
    var hY9 = RY9;
    rQ7.default = hY9
})
// @from(Ln 183713, Col 4)
Z08 = x((eQ7) => {
    Object.defineProperty(eQ7, "__esModule", {
        value: !0
    });
    eQ7.default = bY9;
    eQ7.URL = eQ7.DNS = void 0;
    var SY9 = aQ7(cB6()),
        CY9 = aQ7(W08());

    function aQ7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function IY9(A) {
        A = unescape(encodeURIComponent(A));
        let q = [];
        for (let K = 0; K < A.length; ++K) q.push(A.charCodeAt(K));
        return q
    }
    var sQ7 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    eQ7.DNS = sQ7;
    var tQ7 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    eQ7.URL = tQ7;

    function bY9(A, q, K) {
        function Y(z, _, w, O) {
            if (typeof z === "string") z = IY9(z);
            if (typeof _ === "string") _ = (0, CY9.default)(_);
            if (_.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let $ = new Uint8Array(16 + z.length);
            if ($.set(_), $.set(z, _.length), $ = K($), $[6] = $[6] & 15 | q, $[8] = $[8] & 63 | 128, w) {
                O = O || 0;
                for (let H = 0; H < 16; ++H) w[O + H] = $[H];
                return w
            }
            return (0, SY9.default)($)
        }
        try {
            Y.name = A
        } catch (z) {}
        return Y.DNS = sQ7, Y.URL = tQ7, Y
    }
})
// @from(Ln 183758, Col 4)
YU7 = x((qU7) => {
    Object.defineProperty(qU7, "__esModule", {
        value: !0
    });
    qU7.default = void 0;
    var mY9 = BY9(x6("crypto"));

    function BY9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function gY9(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return mY9.default.createHash("md5").update(A).digest()
    }
    var FY9 = gY9;
    qU7.default = FY9
})
// @from(Ln 183779, Col 4)
OU7 = x((_U7) => {
    Object.defineProperty(_U7, "__esModule", {
        value: !0
    });
    _U7.default = void 0;
    var pY9 = zU7(Z08()),
        QY9 = zU7(YU7());

    function zU7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var UY9 = (0, pY9.default)("v3", 48, QY9.default),
        dY9 = UY9;
    _U7.default = dY9
})
// @from(Ln 183796, Col 4)
JU7 = x((HU7) => {
    Object.defineProperty(HU7, "__esModule", {
        value: !0
    });
    HU7.default = void 0;
    var cY9 = $U7(M08()),
        lY9 = $U7(cB6());

    function $U7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function iY9(A, q, K) {
        A = A || {};
        let Y = A.random || (A.rng || cY9.default)();
        if (Y[6] = Y[6] & 15 | 64, Y[8] = Y[8] & 63 | 128, q) {
            K = K || 0;
            for (let z = 0; z < 16; ++z) q[K + z] = Y[z];
            return q
        }
        return (0, lY9.default)(Y)
    }
    var nY9 = iY9;
    HU7.default = nY9
})
// @from(Ln 183823, Col 4)
XU7 = x((MU7) => {
    Object.defineProperty(MU7, "__esModule", {
        value: !0
    });
    MU7.default = void 0;
    var rY9 = oY9(x6("crypto"));

    function oY9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function aY9(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return rY9.default.createHash("sha1").update(A).digest()
    }
    var sY9 = aY9;
    MU7.default = sY9
})
// @from(Ln 183844, Col 4)
GU7 = x((WU7) => {
    Object.defineProperty(WU7, "__esModule", {
        value: !0
    });
    WU7.default = void 0;
    var tY9 = PU7(Z08()),
        eY9 = PU7(XU7());

    function PU7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var Az9 = (0, tY9.default)("v5", 80, eY9.default),
        qz9 = Az9;
    WU7.default = qz9
})
// @from(Ln 183861, Col 4)
vU7 = x((fU7) => {
    Object.defineProperty(fU7, "__esModule", {
        value: !0
    });
    fU7.default = void 0;
    var Kz9 = "00000000-0000-0000-0000-000000000000";
    fU7.default = Kz9
})
// @from(Ln 183869, Col 4)
kU7 = x((NU7) => {
    Object.defineProperty(NU7, "__esModule", {
        value: !0
    });
    NU7.default = void 0;
    var Yz9 = zz9(dB6());

    function zz9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function _z9(A) {
        if (!(0, Yz9.default)(A)) throw TypeError("Invalid UUID");
        return parseInt(A.substr(14, 1), 16)
    }
    var wz9 = _z9;
    NU7.default = wz9
})
// @from(Ln 183889, Col 4)
EU7 = x((oC) => {
    Object.defineProperty(oC, "__esModule", {
        value: !0
    });
    Object.defineProperty(oC, "v1", {
        enumerable: !0,
        get: function() {
            return Oz9.default
        }
    });
    Object.defineProperty(oC, "v3", {
        enumerable: !0,
        get: function() {
            return $z9.default
        }
    });
    Object.defineProperty(oC, "v4", {
        enumerable: !0,
        get: function() {
            return Hz9.default
        }
    });
    Object.defineProperty(oC, "v5", {
        enumerable: !0,
        get: function() {
            return jz9.default
        }
    });
    Object.defineProperty(oC, "NIL", {
        enumerable: !0,
        get: function() {
            return Jz9.default
        }
    });
    Object.defineProperty(oC, "version", {
        enumerable: !0,
        get: function() {
            return Mz9.default
        }
    });
    Object.defineProperty(oC, "validate", {
        enumerable: !0,
        get: function() {
            return Dz9.default
        }
    });
    Object.defineProperty(oC, "stringify", {
        enumerable: !0,
        get: function() {
            return Xz9.default
        }
    });
    Object.defineProperty(oC, "parse", {
        enumerable: !0,
        get: function() {
            return Pz9.default
        }
    });
    var Oz9 = Od(nQ7()),
        $z9 = Od(OU7()),
        Hz9 = Od(JU7()),
        jz9 = Od(GU7()),
        Jz9 = Od(vU7()),
        Mz9 = Od(kU7()),
        Dz9 = Od(dB6()),
        Xz9 = Od(cB6()),
        Pz9 = Od(W08());

    function Od(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
})
// @from(Ln 183963, Col 4)
am
// @from(Ln 183963, Col 8)
yG2
// @from(Ln 183963, Col 13)
LG2
// @from(Ln 183963, Col 18)
yU7
// @from(Ln 183963, Col 23)
RG2
// @from(Ln 183963, Col 28)
hG2
// @from(Ln 183963, Col 33)
SG2
// @from(Ln 183963, Col 38)
CG2
// @from(Ln 183963, Col 43)
IG2
// @from(Ln 183963, Col 48)
bG2
// @from(Ln 183964, Col 4)
LU7 = E(() => {
    am = t(EU7(), 1), yG2 = am.default.v1, LG2 = am.default.v3, yU7 = am.default.v4, RG2 = am.default.v5, hG2 = am.default.NIL, SG2 = am.default.version, CG2 = am.default.validate, IG2 = am.default.stringify, bG2 = am.default.parse
})
// @from(Ln 183967, Col 0)
class lB6 {
    generateGuid() {
        return yU7()
    }
    isGuid(A) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(A)
    }
}
// @from(Ln 183975, Col 4)
G08 = E(() => {
    LU7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 183978, Col 0)
class yv {
    static base64Encode(A, q) {
        return Buffer.from(A, q).toString(cP.BASE64)
    }
    static base64EncodeUrl(A, q) {
        return yv.base64Encode(A, q).replace(/=/g, S8.EMPTY_STRING).replace(/\+/g, "-").replace(/\//g, "_")
    }
    static base64Decode(A) {
        return Buffer.from(A, cP.BASE64).toString("utf8")
    }
    static base64DecodeUrl(A) {
        let q = A.replace(/-/g, "+").replace(/_/g, "/");
        while (q.length % 4) q += "=";
        return yv.base64Decode(q)
    }
}
// @from(Ln 183994, Col 4)
iB6 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 183998, Col 0)
class I56 {
    sha256(A) {
        return Wz9.createHash(vQ7.SHA256).update(A).digest()
    }
}
// @from(Ln 184003, Col 4)
RJ1 = E(() => {
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 184007, Col 0)
class f08 {
    constructor() {
        this.hashUtils = new I56
    }
    async generatePkceCodes() {
        let A = this.generateCodeVerifier(),
            q = this.generateCodeChallengeFromVerifier(A);
        return {
            verifier: A,
            challenge: q
        }
    }
    generateCodeVerifier() {
        let A = [],
            q = 256 - 256 % PJ1.CV_CHARSET.length;
        while (A.length <= TQ7) {
            let Y = Zz9.randomBytes(1)[0];
            if (Y >= q) continue;
            let z = Y % PJ1.CV_CHARSET.length;
            A.push(PJ1.CV_CHARSET[z])
        }
        let K = A.join(S8.EMPTY_STRING);
        return yv.base64EncodeUrl(K)
    }
    generateCodeChallengeFromVerifier(A) {
        return yv.base64EncodeUrl(this.hashUtils.sha256(A).toString(cP.BASE64), cP.BASE64)
    }
}
// @from(Ln 184035, Col 4)
RU7 = E(() => {
    X_();
    fO();
    iB6();
    RJ1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 184041, Col 0)
class $d {
    constructor() {
        this.pkceGenerator = new f08, this.guidGenerator = new lB6, this.hashUtils = new I56
    }
    base64UrlEncode() {
        throw Error("Method not implemented.")
    }
    encodeKid() {
        throw Error("Method not implemented.")
    }
    createNewGuid() {
        return this.guidGenerator.generateGuid()
    }
    base64Encode(A) {
        return yv.base64Encode(A)
    }
    base64Decode(A) {
        return yv.base64Decode(A)
    }
    generatePkceCodes() {
        return this.pkceGenerator.generatePkceCodes()
    }
    getPublicKeyThumbprint() {
        throw Error("Method not implemented.")
    }
    removeTokenBindingKey() {
        throw Error("Method not implemented.")
    }
    clearKeystore() {
        throw Error("Method not implemented.")
    }
    signJwt() {
        throw Error("Method not implemented.")
    }
    async hashString(A) {
        return yv.base64EncodeUrl(this.hashUtils.sha256(A).toString(cP.BASE64), cP.BASE64)
    }
}
// @from(Ln 184079, Col 4)
nB6 = E(() => {
    X_();
    G08();
    iB6();
    RU7();
    RJ1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 184086, Col 4)
hJ1 = E(() => {
    bw();
    sX8(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 184091, Col 0)
function hU7(A) {
    let q = A.credentialType === D_.REFRESH_TOKEN && A.familyId || A.clientId,
        K = A.tokenType && A.tokenType.toLowerCase() !== k9.BEARER.toLowerCase() ? A.tokenType.toLowerCase() : "";
    return [A.homeAccountId, A.environment, A.credentialType, q, A.realm || "", A.target || "", A.requestedClaimsHash || "", K].join(w08.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 184097, Col 0)
function SU7(A) {
    let q = A.homeAccountId.split(".")[1];
    return [A.homeAccountId, A.environment, q || A.tenantId || ""].join(w08.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 184101, Col 4)
CU7 = E(() => {
    X_();
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 184105, Col 4)
b56
// @from(Ln 184106, Col 4)
SJ1 = E(() => {
    X_();
    DJ1();
    kj1();
    hJ1();
    CU7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    b56 = class b56 extends T56 {
        constructor(A, q, K, Y) {
            super(q, K, A, new yP6, Y);
            this.cache = {}, this.changeEmitters = [], this.logger = A
        }
        registerChangeEmitter(A) {
            this.changeEmitters.push(A)
        }
        emitChange() {
            this.changeEmitters.forEach((A) => A.call(null))
        }
        cacheToInMemoryCache(A) {
            let q = {
                accounts: {},
                idTokens: {},
                accessTokens: {},
                refreshTokens: {},
                appMetadata: {}
            };
            for (let K in A) {
                let Y = A[K];
                if (typeof Y !== "object") continue;
                if (Y instanceof lJ) q.accounts[K] = Y;
                else if (sG.isIdTokenEntity(Y)) q.idTokens[K] = Y;
                else if (sG.isAccessTokenEntity(Y)) q.accessTokens[K] = Y;
                else if (sG.isRefreshTokenEntity(Y)) q.refreshTokens[K] = Y;
                else if (sG.isAppMetadataEntity(K, Y)) q.appMetadata[K] = Y;
                else continue
            }
            return q
        }
        inMemoryCacheToCache(A) {
            let q = this.getCache();
            return q = {
                ...q,
                ...A.accounts,
                ...A.idTokens,
                ...A.accessTokens,
                ...A.refreshTokens,
                ...A.appMetadata
            }, q
        }
        getInMemoryCache() {
            return this.logger.trace("Getting in-memory cache"), this.cacheToInMemoryCache(this.getCache())
        }
        setInMemoryCache(A) {
            this.logger.trace("Setting in-memory cache");
            let q = this.inMemoryCacheToCache(A);
            this.setCache(q), this.emitChange()
        }
        getCache() {
            return this.logger.trace("Getting cache key-value store"), this.cache
        }
        setCache(A) {
            this.logger.trace("Setting cache key value store"), this.cache = A, this.emitChange()
        }
        getItem(A) {
            return this.logger.tracePii(`Item key: ${A}`), this.getCache()[A]
        }
        setItem(A, q) {
            this.logger.tracePii(`Item key: ${A}`);
            let K = this.getCache();
            K[A] = q, this.setCache(K)
        }
        generateCredentialKey(A) {
            return hU7(A)
        }
        generateAccountKey(A) {
            return SU7(A)
        }
        getAccountKeys() {
            let A = this.getInMemoryCache();
            return Object.keys(A.accounts)
        }
        getTokenKeys() {
            let A = this.getInMemoryCache();
            return {
                idToken: Object.keys(A.idTokens),
                accessToken: Object.keys(A.accessTokens),
                refreshToken: Object.keys(A.refreshTokens)
            }
        }
        getAccount(A) {
            return this.getItem(A) ? Object.assign(new lJ, this.getItem(A)) : null
        }
        async setAccount(A) {
            let q = this.generateAccountKey(lJ.getAccountInfo(A));
            this.setItem(q, A)
        }
        getIdTokenCredential(A) {
            let q = this.getItem(A);
            if (sG.isIdTokenEntity(q)) return q;
            return null
        }
        async setIdTokenCredential(A) {
            let q = this.generateCredentialKey(A);
            this.setItem(q, A)
        }
        getAccessTokenCredential(A) {
            let q = this.getItem(A);
            if (sG.isAccessTokenEntity(q)) return q;
            return null
        }
        async setAccessTokenCredential(A) {
            let q = this.generateCredentialKey(A);
            this.setItem(q, A)
        }
        getRefreshTokenCredential(A) {
            let q = this.getItem(A);
            if (sG.isRefreshTokenEntity(q)) return q;
            return null
        }
        async setRefreshTokenCredential(A) {
            let q = this.generateCredentialKey(A);
            this.setItem(q, A)
        }
        getAppMetadata(A) {
            let q = this.getItem(A);
            if (sG.isAppMetadataEntity(A, q)) return q;
            return null
        }
        setAppMetadata(A) {
            let q = sG.generateAppMetadataKey(A);
            this.setItem(q, A)
        }
        getServerTelemetry(A) {
            let q = this.getItem(A);
            if (q && sG.isServerTelemetryEntity(A, q)) return q;
            return null
        }
        setServerTelemetry(A, q) {
            this.setItem(A, q)
        }
        getAuthorityMetadata(A) {
            let q = this.getItem(A);
            if (q && sG.isAuthorityMetadataEntity(A, q)) return q;
            return null
        }
        getAuthorityMetadataKeys() {
            return this.getKeys().filter((A) => {
                return this.isAuthorityMetadata(A)
            })
        }
        setAuthorityMetadata(A, q) {
            this.setItem(A, q)
        }
        getThrottlingCache(A) {
            let q = this.getItem(A);
            if (q && sG.isThrottlingEntity(A, q)) return q;
            return null
        }
        setThrottlingCache(A, q) {
            this.setItem(A, q)
        }
        removeItem(A) {
            this.logger.tracePii(`Item key: ${A}`);
            let q = !1,
                K = this.getCache();
            if (K[A]) delete K[A], q = !0;
            if (q) this.setCache(K), this.emitChange();
            return q
        }
        removeOutdatedAccount(A) {
            this.removeItem(A)
        }
        containsKey(A) {
            return this.getKeys().includes(A)
        }
        getKeys() {
            this.logger.trace("Retrieving all cache keys");
            let A = this.getCache();
            return [...Object.keys(A)]
        }
        clear() {
            this.logger.trace("Clearing cache entries created by MSAL"), this.getKeys().forEach((q) => {
                this.removeItem(q)
            }), this.emitChange()
        }
        static generateInMemoryCache(A) {
            return ls.deserializeAllCache(ls.deserializeJSONBlob(A))
        }
        static generateJsonCache(A) {
            return dK6.serializeAllCache(A)
        }
        updateCredentialCacheKey(A, q) {
            let K = this.generateCredentialKey(q);
            if (A !== K) {
                let Y = this.getItem(A);
                if (Y) return this.removeItem(A), this.setItem(K, Y), this.logger.verbose(`Updated an outdated ${q.credentialType} cache key`), K;
                else this.logger.error(`Attempted to update an outdated ${q.credentialType} cache key but no item matching the outdated key was found in storage`)
            }
            return A
        }
    }
})
// @from(Ln 184307, Col 0)
class oB6 {
    constructor(A, q, K) {
        if (this.cacheHasChanged = !1, this.storage = A, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), K) this.persistence = K;
        this.logger = q
    }
    hasChanged() {
        return this.cacheHasChanged
    }
    serialize() {
        this.logger.trace("Serializing in-memory cache");
        let A = dK6.serializeAllCache(this.storage.getInMemoryCache());
        if (this.cacheSnapshot) this.logger.trace("Reading cache snapshot from disk"), A = this.mergeState(JSON.parse(this.cacheSnapshot), A);
        else this.logger.trace("No cache snapshot to merge");
        return this.cacheHasChanged = !1, JSON.stringify(A)
    }
    deserialize(A) {
        if (this.logger.trace("Deserializing JSON to in-memory cache"), this.cacheSnapshot = A, this.cacheSnapshot) {
            this.logger.trace("Reading cache snapshot from disk");
            let q = ls.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
            this.storage.setInMemoryCache(q)
        } else this.logger.trace("No cache snapshot to deserialize")
    }
    getKVStore() {
        return this.storage.getCache()
    }
    getCacheSnapshot() {
        let A = b56.generateInMemoryCache(this.cacheSnapshot);
        return this.storage.inMemoryCacheToCache(A)
    }
    async getAllAccounts(A = new $d().createNewGuid()) {
        this.logger.trace("getAllAccounts called");
        let q;
        try {
            if (this.persistence) q = new cL(this, !1), await this.persistence.beforeCacheAccess(q);
            return this.storage.getAllAccounts({}, A)
        } finally {
            if (this.persistence && q) await this.persistence.afterCacheAccess(q)
        }
    }
    async getAccountByHomeId(A) {
        let q = await this.getAllAccounts();
        if (A && q && q.length) return q.filter((K) => K.homeAccountId === A)[0] || null;
        else return null
    }
    async getAccountByLocalId(A) {
        let q = await this.getAllAccounts();
        if (A && q && q.length) return q.filter((K) => K.localAccountId === A)[0] || null;
        else return null
    }
    async removeAccount(A, q) {
        this.logger.trace("removeAccount called");
        let K;
        try {
            if (this.persistence) K = new cL(this, !0), await this.persistence.beforeCacheAccess(K);
            this.storage.removeAccount(A, q || new lB6().generateGuid())
        } finally {
            if (this.persistence && K) await this.persistence.afterCacheAccess(K)
        }
    }
    async overwriteCache() {
        if (!this.persistence) {
            this.logger.info("No persistence layer specified, cache cannot be overwritten");
            return
        }
        this.logger.info("Overwriting in-memory cache with persistent cache"), this.storage.clear();
        let A = new cL(this, !1);
        await this.persistence.beforeCacheAccess(A);
        let q = this.getCacheSnapshot();
        this.storage.setCache(q), await this.persistence.afterCacheAccess(A)
    }
    handleChangeEvent() {
        this.cacheHasChanged = !0
    }
    mergeState(A, q) {
        this.logger.trace("Merging in-memory cache with cache snapshot");
        let K = this.mergeRemovals(A, q);
        return this.mergeUpdates(K, q)
    }
    mergeUpdates(A, q) {
        return Object.keys(q).forEach((K) => {
            let Y = q[K];
            if (!A.hasOwnProperty(K)) {
                if (Y !== null) A[K] = Y
            } else {
                let z = Y !== null,
                    _ = typeof Y === "object",
                    w = !Array.isArray(Y),
                    O = typeof A[K] < "u" && A[K] !== null;
                if (z && _ && w && O) this.mergeUpdates(A[K], Y);
                else A[K] = Y
            }
        }), A
    }
    mergeRemovals(A, q) {
        this.logger.trace("Remove updated entries in cache");
        let K = A.Account ? this.mergeRemovalsDict(A.Account, q.Account) : A.Account,
            Y = A.AccessToken ? this.mergeRemovalsDict(A.AccessToken, q.AccessToken) : A.AccessToken,
            z = A.RefreshToken ? this.mergeRemovalsDict(A.RefreshToken, q.RefreshToken) : A.RefreshToken,
            _ = A.IdToken ? this.mergeRemovalsDict(A.IdToken, q.IdToken) : A.IdToken,
            w = A.AppMetadata ? this.mergeRemovalsDict(A.AppMetadata, q.AppMetadata) : A.AppMetadata;
        return {
            ...A,
            Account: K,
            AccessToken: Y,
            RefreshToken: z,
            IdToken: _,
            AppMetadata: w
        }
    }
    mergeRemovalsDict(A, q) {
        let K = {
            ...A
        };
        return Object.keys(A).forEach((Y) => {
            if (!q || !q.hasOwnProperty(Y)) delete K[Y]
        }), K
    }
    overlayDefaults(A) {
        return this.logger.trace("Overlaying input cache with the default cache"), {
            Account: {
                ...rB6.Account,
                ...A.Account
            },
            IdToken: {
                ...rB6.IdToken,
                ...A.IdToken
            },
            AccessToken: {
                ...rB6.AccessToken,
                ...A.AccessToken
            },
            RefreshToken: {
                ...rB6.RefreshToken,
                ...A.RefreshToken
            },
            AppMetadata: {
                ...rB6.AppMetadata,
                ...A.AppMetadata
            }
        }
    }
}
// @from(Ln 184449, Col 4)
rB6
// @from(Ln 184450, Col 4)
T08 = E(() => {
    SJ1();
    X_();
    DJ1();
    kj1();
    nB6();
    G08(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    rB6 = {
        Account: {},
        IdToken: {},
        AccessToken: {},
        RefreshToken: {},
        AppMetadata: {}
    }
})
// @from(Ln 184465, Col 4)
tm = x((v08, bU7) => {
    /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
    var CJ1 = x6("buffer"),
        sm = CJ1.Buffer;

    function IU7(A, q) {
        for (var K in A) q[K] = A[K]
    }
    if (sm.from && sm.alloc && sm.allocUnsafe && sm.allocUnsafeSlow) bU7.exports = CJ1;
    else IU7(CJ1, v08), v08.Buffer = x56;

    function x56(A, q, K) {
        return sm(A, q, K)
    }
    x56.prototype = Object.create(sm.prototype);
    IU7(sm, x56);
    x56.from = function(A, q, K) {
        if (typeof A === "number") throw TypeError("Argument must not be a number");
        return sm(A, q, K)
    };
    x56.alloc = function(A, q, K) {
        if (typeof A !== "number") throw TypeError("Argument must be a number");
        var Y = sm(A);
        if (q !== void 0)
            if (typeof K === "string") Y.fill(q, K);
            else Y.fill(q);
        else Y.fill(0);
        return Y
    };
    x56.allocUnsafe = function(A) {
        if (typeof A !== "number") throw TypeError("Argument must be a number");
        return sm(A)
    };
    x56.allocUnsafeSlow = function(A) {
        if (typeof A !== "number") throw TypeError("Argument must be a number");
        return CJ1.SlowBuffer(A)
    }
})
// @from(Ln 184503, Col 4)
N08 = x((Sv2, xU7) => {
    var IJ1 = tm().Buffer,
        Gz9 = x6("stream"),
        fz9 = x6("util");

    function bJ1(A) {
        if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = IJ1.alloc(0), this;
        if (typeof A.pipe === "function") return this.buffer = IJ1.alloc(0), A.pipe(this), this;
        if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
            this.emit("end", A), this.readable = !1, this.emit("close")
        }.bind(this)), this;
        throw TypeError("Unexpected data type (" + typeof A + ")")
    }
    fz9.inherits(bJ1, Gz9);
    bJ1.prototype.write = function(q) {
        this.buffer = IJ1.concat([this.buffer, IJ1.from(q)]), this.emit("data", q)
    };
    bJ1.prototype.end = function(q) {
        if (q) this.write(q);
        this.emit("end", q), this.emit("close"), this.writable = !1, this.readable = !1
    };
    xU7.exports = bJ1
})
// @from(Ln 184526, Col 4)
mU7 = x((Cv2, uU7) => {
    function V08(A) {
        var q = (A / 8 | 0) + (A % 8 === 0 ? 0 : 1);
        return q
    }
    var Tz9 = {
        ES256: V08(256),
        ES384: V08(384),
        ES512: V08(521)
    };

    function vz9(A) {
        var q = Tz9[A];
        if (q) return q;
        throw Error('Unknown algorithm "' + A + '"')
    }
    uU7.exports = vz9
})
// @from(Ln 184544, Col 4)
BJ1 = x((Iv2, UU7) => {
    var xJ1 = tm().Buffer,
        gU7 = mU7(),
        uJ1 = 128,
        FU7 = 0,
        Nz9 = 32,
        Vz9 = 16,
        kz9 = 2,
        pU7 = Vz9 | Nz9 | FU7 << 6,
        mJ1 = kz9 | FU7 << 6;

    function Ez9(A) {
        return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function QU7(A) {
        if (xJ1.isBuffer(A)) return A;
        else if (typeof A === "string") return xJ1.from(A, "base64");
        throw TypeError("ECDSA signature must be a Base64 string or a Buffer")
    }

    function yz9(A, q) {
        A = QU7(A);
        var K = gU7(q),
            Y = K + 1,
            z = A.length,
            _ = 0;
        if (A[_++] !== pU7) throw Error('Could not find expected "seq"');
        var w = A[_++];
        if (w === (uJ1 | 1)) w = A[_++];
        if (z - _ < w) throw Error('"seq" specified length of "' + w + '", only "' + (z - _) + '" remaining');
        if (A[_++] !== mJ1) throw Error('Could not find expected "int" for "r"');
        var O = A[_++];
        if (z - _ - 2 < O) throw Error('"r" specified length of "' + O + '", only "' + (z - _ - 2) + '" available');
        if (Y < O) throw Error('"r" specified length of "' + O + '", max of "' + Y + '" is acceptable');
        var $ = _;
        if (_ += O, A[_++] !== mJ1) throw Error('Could not find expected "int" for "s"');
        var H = A[_++];
        if (z - _ !== H) throw Error('"s" specified length of "' + H + '", expected "' + (z - _) + '"');
        if (Y < H) throw Error('"s" specified length of "' + H + '", max of "' + Y + '" is acceptable');
        var j = _;
        if (_ += H, _ !== z) throw Error('Expected to consume entire buffer, but "' + (z - _) + '" bytes remain');
        var J = K - O,
            M = K - H,
            D = xJ1.allocUnsafe(J + O + M + H);
        for (_ = 0; _ < J; ++_) D[_] = 0;
        A.copy(D, _, $ + Math.max(-J, 0), $ + O), _ = K;
        for (var X = _; _ < X + M; ++_) D[_] = 0;
        return A.copy(D, _, j + Math.max(-M, 0), j + H), D = D.toString("base64"), D = Ez9(D), D
    }

    function BU7(A, q, K) {
        var Y = 0;
        while (q + Y < K && A[q + Y] === 0) ++Y;
        var z = A[q + Y] >= uJ1;
        if (z) --Y;
        return Y
    }

    function Lz9(A, q) {
        A = QU7(A);
        var K = gU7(q),
            Y = A.length;
        if (Y !== K * 2) throw TypeError('"' + q + '" signatures must be "' + K * 2 + '" bytes, saw "' + Y + '"');
        var z = BU7(A, 0, K),
            _ = BU7(A, K, A.length),
            w = K - z,
            O = K - _,
            $ = 2 + w + 1 + 1 + O,
            H = $ < uJ1,
            j = xJ1.allocUnsafe((H ? 2 : 3) + $),
            J = 0;
        if (j[J++] = pU7, H) j[J++] = $;
        else j[J++] = uJ1 | 1, j[J++] = $ & 255;
        if (j[J++] = mJ1, j[J++] = w, z < 0) j[J++] = 0, J += A.copy(j, J, 0, K);
        else J += A.copy(j, J, z, K);
        if (j[J++] = mJ1, j[J++] = O, _ < 0) j[J++] = 0, A.copy(j, J, K);
        else A.copy(j, J, K + _);
        return j
    }
    UU7.exports = {
        derToJose: yz9,
        joseToDer: Lz9
    }
})
// @from(Ln 184629, Col 4)
E08 = x((bv2, dU7) => {
    var aB6 = x6("buffer").Buffer,
        k08 = x6("buffer").SlowBuffer;
    dU7.exports = gJ1;

    function gJ1(A, q) {
        if (!aB6.isBuffer(A) || !aB6.isBuffer(q)) return !1;
        if (A.length !== q.length) return !1;
        var K = 0;
        for (var Y = 0; Y < A.length; Y++) K |= A[Y] ^ q[Y];
        return K === 0
    }
    gJ1.install = function() {
        aB6.prototype.equal = k08.prototype.equal = function(q) {
            return gJ1(this, q)
        }
    };
    var Rz9 = aB6.prototype.equal,
        hz9 = k08.prototype.equal;
    gJ1.restore = function() {
        aB6.prototype.equal = Rz9, k08.prototype.equal = hz9
    }
})
// @from(Ln 184652, Col 4)
h08 = x((xv2, tU7) => {
    var gP6 = tm().Buffer,
        iL = x6("crypto"),
        lU7 = BJ1(),
        cU7 = x6("util"),
        Sz9 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
        sB6 = "secret must be a string or buffer",
        BP6 = "key must be a string or a buffer",
        Cz9 = "key must be a string, a buffer or an object",
        L08 = typeof iL.createPublicKey === "function";
    if (L08) BP6 += " or a KeyObject", sB6 += "or a KeyObject";

    function iU7(A) {
        if (gP6.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (!L08) throw aC(BP6);
        if (typeof A !== "object") throw aC(BP6);
        if (typeof A.type !== "string") throw aC(BP6);
        if (typeof A.asymmetricKeyType !== "string") throw aC(BP6);
        if (typeof A.export !== "function") throw aC(BP6)
    }

    function nU7(A) {
        if (gP6.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (typeof A === "object") return;
        throw aC(Cz9)
    }

    function Iz9(A) {
        if (gP6.isBuffer(A)) return;
        if (typeof A === "string") return A;
        if (!L08) throw aC(sB6);
        if (typeof A !== "object") throw aC(sB6);
        if (A.type !== "secret") throw aC(sB6);
        if (typeof A.export !== "function") throw aC(sB6)
    }

    function R08(A) {
        return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function rU7(A) {
        A = A.toString();
        var q = 4 - A.length % 4;
        if (q !== 4)
            for (var K = 0; K < q; ++K) A += "=";
        return A.replace(/\-/g, "+").replace(/_/g, "/")
    }

    function aC(A) {
        var q = [].slice.call(arguments, 1),
            K = cU7.format.bind(cU7, A).apply(null, q);
        return TypeError(K)
    }

    function bz9(A) {
        return gP6.isBuffer(A) || typeof A === "string"
    }

    function tB6(A) {
        if (!bz9(A)) A = JSON.stringify(A);
        return A
    }

    function oU7(A) {
        return function(K, Y) {
            Iz9(Y), K = tB6(K);
            var z = iL.createHmac("sha" + A, Y),
                _ = (z.update(K), z.digest("base64"));
            return R08(_)
        }
    }
    var y08, xz9 = "timingSafeEqual" in iL ? function(q, K) {
        if (q.byteLength !== K.byteLength) return !1;
        return iL.timingSafeEqual(q, K)
    } : function(q, K) {
        if (!y08) y08 = E08();
        return y08(q, K)
    };

    function uz9(A) {
        return function(K, Y, z) {
            var _ = oU7(A)(K, z);
            return xz9(gP6.from(Y), gP6.from(_))
        }
    }

    function aU7(A) {
        return function(K, Y) {
            nU7(Y), K = tB6(K);
            var z = iL.createSign("RSA-SHA" + A),
                _ = (z.update(K), z.sign(Y, "base64"));
            return R08(_)
        }
    }

    function sU7(A) {
        return function(K, Y, z) {
            iU7(z), K = tB6(K), Y = rU7(Y);
            var _ = iL.createVerify("RSA-SHA" + A);
            return _.update(K), _.verify(z, Y, "base64")
        }
    }

    function mz9(A) {
        return function(K, Y) {
            nU7(Y), K = tB6(K);
            var z = iL.createSign("RSA-SHA" + A),
                _ = (z.update(K), z.sign({
                    key: Y,
                    padding: iL.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: iL.constants.RSA_PSS_SALTLEN_DIGEST
                }, "base64"));
            return R08(_)
        }
    }

    function Bz9(A) {
        return function(K, Y, z) {
            iU7(z), K = tB6(K), Y = rU7(Y);
            var _ = iL.createVerify("RSA-SHA" + A);
            return _.update(K), _.verify({
                key: z,
                padding: iL.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: iL.constants.RSA_PSS_SALTLEN_DIGEST
            }, Y, "base64")
        }
    }

    function gz9(A) {
        var q = aU7(A);
        return function() {
            var Y = q.apply(null, arguments);
            return Y = lU7.derToJose(Y, "ES" + A), Y
        }
    }

    function Fz9(A) {
        var q = sU7(A);
        return function(Y, z, _) {
            z = lU7.joseToDer(z, "ES" + A).toString("base64");
            var w = q(Y, z, _);
            return w
        }
    }

    function pz9() {
        return function() {
            return ""
        }
    }

    function Qz9() {
        return function(q, K) {
            return K === ""
        }
    }
    tU7.exports = function(q) {
        var K = {
                hs: oU7,
                rs: aU7,
                ps: mz9,
                es: gz9,
                none: pz9
            },
            Y = {
                hs: uz9,
                rs: sU7,
                ps: Bz9,
                es: Fz9,
                none: Qz9
            },
            z = q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
        if (!z) throw aC(Sz9, q);
        var _ = (z[1] || z[3]).toLowerCase(),
            w = z[2];
        return {
            sign: K[_](w),
            verify: Y[_](w)
        }
    }
})
// @from(Ln 184837, Col 4)
S08 = x((uv2, eU7) => {
    var Uz9 = x6("buffer").Buffer;
    eU7.exports = function(q) {
        if (typeof q === "string") return q;
        if (typeof q === "number" || Uz9.isBuffer(q)) return q.toString();
        return JSON.stringify(q)
    }
})
// @from(Ln 184845, Col 4)
_d7 = x((mv2, zd7) => {
    var dz9 = tm().Buffer,
        Ad7 = N08(),
        cz9 = h08(),
        lz9 = x6("stream"),
        qd7 = S08(),
        C08 = x6("util");

    function Kd7(A, q) {
        return dz9.from(A, q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function iz9(A, q, K) {
        K = K || "utf8";
        var Y = Kd7(qd7(A), "binary"),
            z = Kd7(qd7(q), K);
        return C08.format("%s.%s", Y, z)
    }

    function Yd7(A) {
        var {
            header: q,
            payload: K
        } = A, Y = A.secret || A.privateKey, z = A.encoding, _ = cz9(q.alg), w = iz9(q, K, z), O = _.sign(w, Y);
        return C08.format("%s.%s", w, O)
    }

    function FJ1(A) {
        var q = A.secret || A.privateKey || A.key,
            K = new Ad7(q);
        this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = K, this.payload = new Ad7(A.payload), this.secret.once("close", function() {
            if (!this.payload.writable && this.readable) this.sign()
        }.bind(this)), this.payload.once("close", function() {
            if (!this.secret.writable && this.readable) this.sign()
        }.bind(this))
    }
    C08.inherits(FJ1, lz9);
    FJ1.prototype.sign = function() {
        try {
            var q = Yd7({
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
    FJ1.sign = Yd7;
    zd7.exports = FJ1
})
// @from(Ln 184898, Col 4)
Pd7 = x((Bv2, Xd7) => {
    var Od7 = tm().Buffer,
        wd7 = N08(),
        nz9 = h08(),
        rz9 = x6("stream"),
        $d7 = S08(),
        oz9 = x6("util"),
        az9 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

    function sz9(A) {
        return Object.prototype.toString.call(A) === "[object Object]"
    }

    function tz9(A) {
        if (sz9(A)) return A;
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }

    function Hd7(A) {
        var q = A.split(".", 1)[0];
        return tz9(Od7.from(q, "base64").toString("binary"))
    }

    function ez9(A) {
        return A.split(".", 2).join(".")
    }

    function jd7(A) {
        return A.split(".")[2]
    }

    function A_9(A, q) {
        q = q || "utf8";
        var K = A.split(".")[1];
        return Od7.from(K, "base64").toString(q)
    }

    function Jd7(A) {
        return az9.test(A) && !!Hd7(A)
    }

    function Md7(A, q, K) {
        if (!q) {
            var Y = Error("Missing algorithm parameter for jws.verify");
            throw Y.code = "MISSING_ALGORITHM", Y
        }
        A = $d7(A);
        var z = jd7(A),
            _ = ez9(A),
            w = nz9(q);
        return w.verify(_, z, K)
    }

    function Dd7(A, q) {
        if (q = q || {}, A = $d7(A), !Jd7(A)) return null;
        var K = Hd7(A);
        if (!K) return null;
        var Y = A_9(A);
        if (K.typ === "JWT" || q.json) Y = JSON.parse(Y, q.encoding);
        return {
            header: K,
            payload: Y,
            signature: jd7(A)
        }
    }

    function FP6(A) {
        A = A || {};
        var q = A.secret || A.publicKey || A.key,
            K = new wd7(q);
        this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = K, this.signature = new wd7(A.signature), this.secret.once("close", function() {
            if (!this.signature.writable && this.readable) this.verify()
        }.bind(this)), this.signature.once("close", function() {
            if (!this.secret.writable && this.readable) this.verify()
        }.bind(this))
    }
    oz9.inherits(FP6, rz9);
    FP6.prototype.verify = function() {
        try {
            var q = Md7(this.signature.buffer, this.algorithm, this.key.buffer),
                K = Dd7(this.signature.buffer, this.encoding);
            return this.emit("done", q, K), this.emit("data", q), this.emit("end"), this.readable = !1, q
        } catch (Y) {
            this.readable = !1, this.emit("error", Y), this.emit("close")
        }
    };
    FP6.decode = Dd7;
    FP6.isValid = Jd7;
    FP6.verify = Md7;
    Xd7.exports = FP6
})
// @from(Ln 184993, Col 4)
QJ1 = x((K_9) => {
    var Wd7 = _d7(),
        pJ1 = Pd7(),
        q_9 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
    K_9.ALGORITHMS = q_9;
    K_9.sign = Wd7.sign;
    K_9.verify = pJ1.verify;
    K_9.decode = pJ1.decode;
    K_9.isValid = pJ1.isValid;
    K_9.createSign = function(q) {
        return new Wd7(q)
    };
    K_9.createVerify = function(q) {
        return new pJ1(q)
    }
})