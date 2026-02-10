
// @from(Ln 157090, Col 4)
F96 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 157092, Col 4)
Q96
// @from(Ln 157093, Col 4)
c$7 = v(() => {
    mh1();
    OX1();
    D41();
    WH();
    HX1();
    M96();
    Uh1();
    ar();
    TX();
    sr();
    m96();
    er();
    KX1();
    Vh1();
    or();
    vS();
    ZU();
    F96();
    y96();
    XJ();
    jU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Q96 = class Q96 extends VW {
        constructor(A, q) {
            super(A, q);
            this.includeRedirectUri = !0, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes
        }
        async acquireToken(A, q) {
            if (this.performanceClient?.addQueueMeasurement(MA.AuthClientAcquireToken, A.correlationId), !A.code) throw Y8(o71);
            let K = Ov(),
                Y = await AY(this.executeTokenRequest.bind(this), MA.AuthClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(this.authority, A),
                z = Y.headers?.[PH.X_MS_REQUEST_ID],
                w = new R_(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin, this.performanceClient);
            return w.validateTokenResponse(Y.body), AY(w.handleServerTokenResponse.bind(w), MA.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(Y.body, this.authority, K, A, q, void 0, void 0, void 0, z)
        }
        getLogoutUri(A) {
            if (!A) throw Aw(O41);
            let q = this.createLogoutUrlQueryString(A);
            return A5.appendQueryString(this.authority.endSessionEndpoint, q)
        }
        async executeTokenRequest(A, q) {
            this.performanceClient?.addQueueMeasurement(MA.AuthClientExecuteTokenRequest, q.correlationId);
            let K = this.createTokenQueryParameters(q),
                Y = A5.appendQueryString(A.tokenEndpoint, K),
                z = await AY(this.createTokenRequestBody.bind(this), MA.AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, q.correlationId)(q),
                w = void 0;
            if (q.clientInfo) try {
                let O = qX1(q.clientInfo, this.cryptoUtils.base64Decode);
                w = {
                    credential: `${O.uid}${HU.CLIENT_INFO_SEPARATOR}${O.utid}`,
                    type: oG.HOME_ACCOUNT_ID
                }
            } catch (O) {
                this.logger.verbose("Could not parse client info for CCS Header: " + O)
            }
            let H = this.createTokenRequestHeaders(w || q.ccsCredential),
                $ = DX1(this.config.authOptions.clientId, q);
            return AY(this.executePostToTokenEndpoint.bind(this), MA.AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, q.correlationId)(Y, z, H, $, q.correlationId, MA.AuthorizationCodeClientExecutePostToTokenEndpoint)
        }
        async createTokenRequestBody(A) {
            this.performanceClient?.addQueueMeasurement(MA.AuthClientCreateTokenRequestBody, A.correlationId);
            let q = new Map;
            if (G41(q, A.embeddedClientId || A.tokenBodyParameters?.[bu] || this.config.authOptions.clientId), !this.includeRedirectUri) {
                if (!A.redirectUri) throw Aw(Y41)
            } else Z41(q, A.redirectUri);
            if (W41(q, A.scopes, !0, this.oidcDefaultScopes), d9A(q, A.code), Th1(q, this.config.libraryInfo), vh1(q, this.config.telemetry.application), xh1(q), this.serverTelemetryManager && !j96(this.config)) Ih1(q, this.serverTelemetryManager);
            if (A.codeVerifier) l9A(q, A.codeVerifier);
            if (this.config.clientCredentials.clientSecret) kh1(q, this.config.clientCredentials.clientSecret);
            if (this.config.clientCredentials.clientAssertion) {
                let Y = this.config.clientCredentials.clientAssertion;
                Lh1(q, await tG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), Rh1(q, Y.assertionType)
            }
            if (yh1(q, RV.AUTHORIZATION_CODE_GRANT), N41(q), A.authenticationScheme === b9.POP) {
                let Y = new T41(this.cryptoUtils, this.performanceClient),
                    z;
                if (!A.popKid) z = (await AY(Y.generateCnf.bind(Y), MA.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
                else z = this.cryptoUtils.encodeKid(A.popKid);
                Sh1(q, z)
            } else if (A.authenticationScheme === b9.SSH)
                if (A.sshJwk) hh1(q, A.sshJwk);
                else throw Aw(DU);
            if (!kw.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) f41(q, A.claims, this.config.authOptions.clientCapabilities);
            let K = void 0;
            if (A.clientInfo) try {
                let Y = qX1(A.clientInfo, this.cryptoUtils.base64Decode);
                K = {
                    credential: `${Y.uid}${HU.CLIENT_INFO_SEPARATOR}${Y.utid}`,
                    type: oG.HOME_ACCOUNT_ID
                }
            } catch (Y) {
                this.logger.verbose("Could not parse client info for CCS Header: " + Y)
            } else K = A.ccsCredential;
            if (this.config.systemOptions.preventCorsPreflight && K) switch (K.type) {
                case oG.HOME_ACCOUNT_ID:
                    try {
                        let Y = Iu(K.credential);
                        PU(q, Y)
                    } catch (Y) {
                        this.logger.verbose("Could not parse home account ID for CCS Header: " + Y)
                    }
                    break;
                case oG.UPN:
                    tr(q, K.credential);
                    break
            }
            if (A.embeddedClientId) GU(q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
            if (A.tokenBodyParameters) WU(q, A.tokenBodyParameters);
            if (A.enableSpaAuthorizationCode && (!A.tokenBodyParameters || !A.tokenBodyParameters[Z96])) WU(q, {
                [Z96]: "1"
            });
            return P41(q, A.correlationId, this.performanceClient), xu(q)
        }
        createLogoutUrlQueryString(A) {
            let q = new Map;
            if (A.postLogoutRedirectUri) F9A(q, A.postLogoutRedirectUri);
            if (A.correlationId) V41(q, A.correlationId);
            if (A.idTokenHint) Q9A(q, A.idTokenHint);
            if (A.state) Eh1(q, A.state);
            if (A.logoutHint) i9A(q, A.logoutHint);
            if (A.extraQueryParameters) WU(q, A.extraQueryParameters);
            if (this.config.authOptions.instanceAware) Ch1(q);
            return xu(q, this.config.authOptions.encodeExtraQueryParams, A.extraQueryParameters)
        }
    }
})
// @from(Ln 157218, Col 4)
xB5 = 300
// @from(Ln 157219, Col 4)
jX1
// @from(Ln 157220, Col 4)
l$7 = v(() => {
    M96();
    mh1();
    OX1();
    D41();
    WH();
    HX1();
    Uh1();
    m96();
    ar();
    or();
    TX();
    XX1();
    er();
    sr();
    Vh1();
    KX1();
    gh1();
    vS();
    ZU();
    F96();
    y96();
    I96();
    jU();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    jX1 = class jX1 extends VW {
        constructor(A, q) {
            super(A, q)
        }
        async acquireToken(A) {
            this.performanceClient?.addQueueMeasurement(MA.RefreshTokenClientAcquireToken, A.correlationId);
            let q = Ov(),
                K = await AY(this.executeTokenRequest.bind(this), MA.RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(A, this.authority),
                Y = K.headers?.[PH.X_MS_REQUEST_ID],
                z = new R_(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return z.validateTokenResponse(K.body), AY(z.handleServerTokenResponse.bind(z), MA.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(K.body, this.authority, q, A, void 0, void 0, !0, A.forceCache, Y)
        }
        async acquireTokenByRefreshToken(A) {
            if (!A) throw Aw($41);
            if (this.performanceClient?.addQueueMeasurement(MA.RefreshTokenClientAcquireTokenByRefreshToken, A.correlationId), !A.account) throw Y8(OU);
            if (this.cacheManager.isAppMetadataFOCI(A.account.environment)) try {
                return await AY(this.acquireTokenWithCachedRefreshToken.bind(this), MA.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !0)
            } catch (K) {
                let Y = K instanceof _v && K.errorCode === Ao,
                    z = K instanceof sG && K.errorCode === QS1.INVALID_GRANT_ERROR && K.subError === QS1.CLIENT_MISMATCH_ERROR;
                if (Y || z) return AY(this.acquireTokenWithCachedRefreshToken.bind(this), MA.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1);
                else throw K
            }
            return AY(this.acquireTokenWithCachedRefreshToken.bind(this), MA.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1)
        }
        async acquireTokenWithCachedRefreshToken(A, q) {
            this.performanceClient?.addQueueMeasurement(MA.RefreshTokenClientAcquireTokenWithCachedRefreshToken, A.correlationId);
            let K = B$7(this.cacheManager.getRefreshToken.bind(this.cacheManager), MA.CacheManagerGetRefreshToken, this.logger, this.performanceClient, A.correlationId)(A.account, q, A.correlationId, void 0, this.performanceClient);
            if (!K) throw u96(Ao);
            if (K.expiresOn && _X1(K.expiresOn, A.refreshTokenExpirationOffsetSeconds || xB5)) throw this.performanceClient?.addFields({
                rtExpiresOnMs: Number(K.expiresOn)
            }, A.correlationId), u96(Qh1);
            let Y = {
                ...A,
                refreshToken: K.secret,
                authenticationScheme: A.authenticationScheme || b9.BEARER,
                ccsCredential: {
                    credential: A.account.homeAccountId,
                    type: oG.HOME_ACCOUNT_ID
                }
            };
            try {
                return await AY(this.acquireToken.bind(this), MA.RefreshTokenClientAcquireToken, this.logger, this.performanceClient, A.correlationId)(Y)
            } catch (z) {
                if (z instanceof _v) {
                    if (this.performanceClient?.addFields({
                            rtExpiresOnMs: Number(K.expiresOn)
                        }, A.correlationId), z.subError === qo) {
                        this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");
                        let w = this.cacheManager.generateCredentialKey(K);
                        this.cacheManager.removeRefreshToken(w, A.correlationId)
                    }
                }
                throw z
            }
        }
        async executeTokenRequest(A, q) {
            this.performanceClient?.addQueueMeasurement(MA.RefreshTokenClientExecuteTokenRequest, A.correlationId);
            let K = this.createTokenQueryParameters(A),
                Y = A5.appendQueryString(q.tokenEndpoint, K),
                z = await AY(this.createTokenRequestBody.bind(this), MA.RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, A.correlationId)(A),
                w = this.createTokenRequestHeaders(A.ccsCredential),
                H = DX1(this.config.authOptions.clientId, A);
            return AY(this.executePostToTokenEndpoint.bind(this), MA.RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, A.correlationId)(Y, z, w, H, A.correlationId, MA.RefreshTokenClientExecutePostToTokenEndpoint)
        }
        async createTokenRequestBody(A) {
            this.performanceClient?.addQueueMeasurement(MA.RefreshTokenClientCreateTokenRequestBody, A.correlationId);
            let q = new Map;
            if (G41(q, A.embeddedClientId || A.tokenBodyParameters?.[bu] || this.config.authOptions.clientId), A.redirectUri) Z41(q, A.redirectUri);
            if (W41(q, A.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), yh1(q, RV.REFRESH_TOKEN_GRANT), N41(q), Th1(q, this.config.libraryInfo), vh1(q, this.config.telemetry.application), xh1(q), this.serverTelemetryManager && !j96(this.config)) Ih1(q, this.serverTelemetryManager);
            if (c9A(q, A.refreshToken), this.config.clientCredentials.clientSecret) kh1(q, this.config.clientCredentials.clientSecret);
            if (this.config.clientCredentials.clientAssertion) {
                let K = this.config.clientCredentials.clientAssertion;
                Lh1(q, await tG(K.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), Rh1(q, K.assertionType)
            }
            if (A.authenticationScheme === b9.POP) {
                let K = new T41(this.cryptoUtils, this.performanceClient),
                    Y;
                if (!A.popKid) Y = (await AY(K.generateCnf.bind(K), MA.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
                else Y = this.cryptoUtils.encodeKid(A.popKid);
                Sh1(q, Y)
            } else if (A.authenticationScheme === b9.SSH)
                if (A.sshJwk) hh1(q, A.sshJwk);
                else throw Aw(DU);
            if (!kw.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) f41(q, A.claims, this.config.authOptions.clientCapabilities);
            if (this.config.systemOptions.preventCorsPreflight && A.ccsCredential) switch (A.ccsCredential.type) {
                case oG.HOME_ACCOUNT_ID:
                    try {
                        let K = Iu(A.ccsCredential.credential);
                        PU(q, K)
                    } catch (K) {
                        this.logger.verbose("Could not parse home account ID for CCS Header: " + K)
                    }
                    break;
                case oG.UPN:
                    tr(q, A.ccsCredential.credential);
                    break
            }
            if (A.embeddedClientId) GU(q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
            if (A.tokenBodyParameters) WU(q, A.tokenBodyParameters);
            return P41(q, A.correlationId, this.performanceClient), xu(q)
        }
    }
})
// @from(Ln 157349, Col 4)
g96
// @from(Ln 157350, Col 4)
i$7 = v(() => {
    mh1();
    er();
    TX();
    Uh1();
    WH();
    ar();
    YX1();
    vS();
    ZU();
    L96();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    g96 = class g96 extends VW {
        constructor(A, q) {
            super(A, q)
        }
        async acquireCachedToken(A) {
            this.performanceClient?.addQueueMeasurement(MA.SilentFlowClientAcquireCachedToken, A.correlationId);
            let q = Ew.NOT_APPLICABLE;
            if (A.forceRefresh || !this.config.cacheOptions.claimsBasedCachingEnabled && !kw.isEmptyObj(A.claims)) throw this.setCacheOutcome(Ew.FORCE_REFRESH_OR_CLAIMS, A.correlationId), Y8(JU);
            if (!A.account) throw Y8(OU);
            let K = A.account.tenantId || F$7(A.authority),
                Y = this.cacheManager.getTokenKeys(),
                z = this.cacheManager.getAccessToken(A.account, A, Y, K);
            if (!z) throw this.setCacheOutcome(Ew.NO_CACHED_ACCESS_TOKEN, A.correlationId), Y8(JU);
            else if (n9A(z.cachedAt) || _X1(z.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.setCacheOutcome(Ew.CACHED_ACCESS_TOKEN_EXPIRED, A.correlationId), Y8(JU);
            else if (z.refreshOn && _X1(z.refreshOn, 0)) q = Ew.PROACTIVELY_REFRESHED;
            let w = A.authority || this.authority.getPreferredCache(),
                H = {
                    account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(A.account), A.correlationId),
                    accessToken: z,
                    idToken: this.cacheManager.getIdToken(A.account, A.correlationId, Y, K, this.performanceClient),
                    refreshToken: null,
                    appMetadata: this.cacheManager.readAppMetadataFromCache(w)
                };
            if (this.setCacheOutcome(q, A.correlationId), this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
            return [await AY(this.generateResultFromCacheRecord.bind(this), MA.SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, A.correlationId)(H, A), q]
        }
        setCacheOutcome(A, q) {
            if (this.serverTelemetryManager?.setCacheOutcome(A), this.performanceClient?.addFields({
                    cacheOutcome: A
                }, q), A !== Ew.NOT_APPLICABLE) this.logger.info(`Token refresh is required due to cache outcome: ${A}`)
        }
        async generateResultFromCacheRecord(A, q) {
            this.performanceClient?.addQueueMeasurement(MA.SilentFlowClientGenerateResultFromCacheRecord, q.correlationId);
            let K;
            if (A.idToken) K = MU(A.idToken.secret, this.config.cryptoInterface.base64Decode);
            if (q.maxAge || q.maxAge === 0) {
                let Y = K?.auth_time;
                if (!Y) throw Y8($U);
                Gh1(Y, q.maxAge)
            }
            return R_.generateAuthenticationResult(this.cryptoUtils, this.authority, A, !0, q, K)
        }
    }
})
// @from(Ln 157406, Col 4)
ph1 = {}
// @from(Ln 157414, Col 0)
function bB5(A, q, K, Y) {
    let z = q.correlationId,
        w = new Map;
    G41(w, q.embeddedClientId || q.extraQueryParameters?.[bu] || A.clientId);
    let H = [...q.scopes || [], ...q.extraScopesToConsent || []];
    if (W41(w, H, !0, A.authority.options.OIDCOptions?.defaultScopes), Z41(w, q.redirectUri), V41(w, z), m9A(w, q.responseMode), N41(w), q.prompt) U9A(w, q.prompt), Y?.addFields({
        prompt: q.prompt
    }, z);
    if (q.domainHint) g9A(w, q.domainHint), Y?.addFields({
        domainHintFromRequest: !0
    }, z);
    if (q.prompt !== Qr.SELECT_ACCOUNT) {
        if (q.sid && q.prompt === Qr.NONE) K.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"), V96(w, q.sid), Y?.addFields({
            sidFromRequest: !0
        }, z);
        else if (q.account) {
            let $ = FB5(q.account),
                O = QB5(q.account);
            if (O && q.domainHint) K.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'), O = null;
            if (O) {
                K.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"), $X1(w, O), Y?.addFields({
                    loginHintFromClaim: !0
                }, z);
                try {
                    let _ = Iu(q.account.homeAccountId);
                    PU(w, _)
                } catch (_) {
                    K.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            } else if ($ && q.prompt === Qr.NONE) {
                K.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"), V96(w, $), Y?.addFields({
                    sidFromClaim: !0
                }, z);
                try {
                    let _ = Iu(q.account.homeAccountId);
                    PU(w, _)
                } catch (_) {
                    K.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            } else if (q.loginHint) K.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"), $X1(w, q.loginHint), tr(w, q.loginHint), Y?.addFields({
                loginHintFromRequest: !0
            }, z);
            else if (q.account.username) {
                K.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"), $X1(w, q.account.username), Y?.addFields({
                    loginHintFromUpn: !0
                }, z);
                try {
                    let _ = Iu(q.account.homeAccountId);
                    PU(w, _)
                } catch (_) {
                    K.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            }
        } else if (q.loginHint) K.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"), $X1(w, q.loginHint), tr(w, q.loginHint), Y?.addFields({
            loginHintFromRequest: !0
        }, z)
    } else K.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");
    if (q.nonce) p9A(w, q.nonce);
    if (q.state) Eh1(w, q.state);
    if (q.claims || A.clientCapabilities && A.clientCapabilities.length > 0) f41(w, q.claims, A.clientCapabilities);
    if (q.embeddedClientId) GU(w, A.clientId, A.redirectUri);
    if (A.instanceAware && (!q.extraQueryParameters || !Object.keys(q.extraQueryParameters).includes(wX1))) Ch1(w);
    return w
}
// @from(Ln 157479, Col 0)
function uB5(A, q, K, Y) {
    let z = xu(q, K, Y);
    return A5.appendQueryString(A.authorizationEndpoint, z)
}
// @from(Ln 157484, Col 0)
function BB5(A, q) {
    if (n$7(A, q), !A.code) throw Y8(A41);
    return A
}
// @from(Ln 157489, Col 0)
function n$7(A, q) {
    if (!A.state || !q) throw A.state ? Y8(dr, "Cached State") : Y8(dr, "Server State");
    let K, Y;
    try {
        K = decodeURIComponent(A.state)
    } catch (z) {
        throw Y8(TS, A.state)
    }
    try {
        Y = decodeURIComponent(q)
    } catch (z) {
        throw Y8(TS, A.state)
    }
    if (K !== Y) throw Y8(l71);
    if (A.error || A.error_description || A.suberror) {
        let z = mB5(A);
        if (b96(A.error, A.error_description, A.suberror)) throw new _v(A.error || "", A.error_description, A.suberror, A.timestamp || "", A.trace_id || "", A.correlation_id || "", A.claims || "", z);
        throw new sG(A.error || "", A.error_description, A.suberror, z)
    }
}
// @from(Ln 157510, Col 0)
function mB5(A) {
    let K = A.error_uri?.lastIndexOf("code=");
    return K && K >= 0 ? A.error_uri?.substring(K + 5) : void 0
}
// @from(Ln 157515, Col 0)
function FB5(A) {
    return A.idTokenClaims?.sid || null
}
// @from(Ln 157519, Col 0)
function QB5(A) {
    return A.loginHint || A.idTokenClaims?.login_hint || null
}
// @from(Ln 157522, Col 4)
r$7 = v(() => {
    OX1();
    HX1();
    WH();
    KX1();
    D41();
    sr();
    TX();
    gh1();
    XX1();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 157535, Col 0)
function gB5(A) {
    let {
        skus: q,
        libraryName: K,
        libraryVersion: Y,
        extensionName: z,
        extensionVersion: w
    } = A, H = new Map([
        [0, [K, Y]],
        [2, [z, w]]
    ]), $ = [];
    if (q?.length) {
        if ($ = q.split(o$7), $.length < 4) return q
    } else $ = Array.from({
        length: 4
    }, () => a$7);
    return H.forEach((O, _) => {
        if (O.length === 2 && O[0]?.length && O[1]?.length) UB5({
            skuArr: $,
            index: _,
            skuName: O[0],
            skuVersion: O[1]
        })
    }), $.join(o$7)
}
// @from(Ln 157561, Col 0)
function UB5(A) {
    let {
        skuArr: q,
        index: K,
        skuName: Y,
        skuVersion: z
    } = A;
    if (K >= q.length) return;
    q[K] = [Y, z].join(a$7)
}
// @from(Ln 157571, Col 0)
class Ko {
    constructor(A, q) {
        this.cacheOutcome = Ew.NOT_APPLICABLE, this.cacheManager = q, this.apiId = A.apiId, this.correlationId = A.correlationId, this.wrapperSKU = A.wrapperSKU || uA.EMPTY_STRING, this.wrapperVer = A.wrapperVer || uA.EMPTY_STRING, this.telemetryCacheKey = BD.CACHE_KEY + HU.CACHE_KEY_SEPARATOR + A.clientId
    }
    generateCurrentRequestHeaderValue() {
        let A = `${this.apiId}${BD.VALUE_SEPARATOR}${this.cacheOutcome}`,
            q = [this.wrapperSKU, this.wrapperVer],
            K = this.getNativeBrokerErrorCode();
        if (K?.length) q.push(`broker_error=${K}`);
        let Y = q.join(BD.VALUE_SEPARATOR),
            z = this.getRegionDiscoveryFields(),
            w = [A, z].join(BD.VALUE_SEPARATOR);
        return [BD.SCHEMA_VERSION, w, Y].join(BD.CATEGORY_SEPARATOR)
    }
    generateLastRequestHeaderValue() {
        let A = this.getLastRequests(),
            q = Ko.maxErrorsToSend(A),
            K = A.failedRequests.slice(0, 2 * q).join(BD.VALUE_SEPARATOR),
            Y = A.errors.slice(0, q).join(BD.VALUE_SEPARATOR),
            z = A.errors.length,
            w = q < z ? BD.OVERFLOW_TRUE : BD.OVERFLOW_FALSE,
            H = [z, w].join(BD.VALUE_SEPARATOR);
        return [BD.SCHEMA_VERSION, A.cacheHits, K, Y, H].join(BD.CATEGORY_SEPARATOR)
    }
    cacheFailedRequest(A) {
        let q = this.getLastRequests();
        if (q.errors.length >= BD.MAX_CACHED_ERRORS) q.failedRequests.shift(), q.failedRequests.shift(), q.errors.shift();
        if (q.failedRequests.push(this.apiId, this.correlationId), A instanceof Error && !!A && A.toString())
            if (A instanceof m3)
                if (A.subError) q.errors.push(A.subError);
                else if (A.errorCode) q.errors.push(A.errorCode);
        else q.errors.push(A.toString());
        else q.errors.push(A.toString());
        else q.errors.push(BD.UNKNOWN_ERROR);
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
            q = Ko.maxErrorsToSend(A),
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
            let w = A.failedRequests[2 * q] || uA.EMPTY_STRING,
                H = A.failedRequests[2 * q + 1] || uA.EMPTY_STRING,
                $ = A.errors[q] || uA.EMPTY_STRING;
            if (Y += w.toString().length + H.toString().length + $.length + 3, Y < BD.MAX_LAST_HEADER_BYTES) K += 1;
            else break
        }
        return K
    }
    getRegionDiscoveryFields() {
        let A = [];
        return A.push(this.regionUsed || uA.EMPTY_STRING), A.push(this.regionSource || uA.EMPTY_STRING), A.push(this.regionOutcome || uA.EMPTY_STRING), A.join(",")
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
        return gB5(A)
    }
}
// @from(Ln 157672, Col 4)
o$7 = ","
// @from(Ln 157673, Col 4)
a$7 = "|"
// @from(Ln 157674, Col 4)
s$7 = v(() => {
    WH();
    LL(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 157678, Col 4)
ez = v(() => {
    c$7();
    l$7();
    i$7();
    mh1();
    Vh1();
    L96();
    w96();
    Wh1();
    a5A();
    _96();
    sr();
    F5A();
    r$7();
    OX1();
    Uh1();
    Mh1();
    K96();
    gh1();
    I96();
    LL();
    b5A();
    XX1();
    TX();
    XJ();
    or();
    jU();
    WH();
    ar();
    s$7();
    YX1();
    e9A();
    E96();
    er();
    D41();
    HX1();
    zYA();
    F96(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 157717, Col 0)
class Yo {
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
                    tenantProfiles: Y.tenantProfiles?.map((H) => {
                        return JSON.parse(H)
                    }),
                    lastUpdatedAt: Date.now().toString()
                },
                w = new vX;
            j41.toObject(w, z), q[K] = w
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
// @from(Ln 157831, Col 4)
U96 = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 157834, Col 4)
wYA = {}
// @from(Ln 157839, Col 4)
t$7 = v(() => {
    t56();
    U96(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 157843, Col 4)
e$7 = "system_assigned_managed_identity"
// @from(Ln 157844, Col 4)
rB5 = "managed_identity"
// @from(Ln 157845, Col 4)
HYA
// @from(Ln 157845, Col 9)
CV
// @from(Ln 157845, Col 13)
EX
// @from(Ln 157845, Col 17)
lK
// @from(Ln 157845, Col 21)
P3
// @from(Ln 157845, Col 25)
FO
// @from(Ln 157845, Col 29)
aH
// @from(Ln 157845, Col 33)
p96
// @from(Ln 157845, Col 38)
AO7 = "REGION_NAME"
// @from(Ln 157846, Col 4)
qO7 = "MSAL_FORCE_REGION"
// @from(Ln 157847, Col 4)
KO7 = 32
// @from(Ln 157848, Col 4)
YO7
// @from(Ln 157848, Col 9)
d96
// @from(Ln 157848, Col 14)
$YA
// @from(Ln 157848, Col 19)
eG
// @from(Ln 157848, Col 23)
VU
// @from(Ln 157848, Col 27)
CL
// @from(Ln 157848, Col 31)
c96
// @from(Ln 157848, Col 36)
zO7 = 4096
// @from(Ln 157849, Col 4)
sH = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    HYA = `https://login.microsoftonline.com/${rB5}/`, CV = {
        AUTHORIZATION_HEADER_NAME: "Authorization",
        METADATA_HEADER_NAME: "Metadata",
        APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
        ML_AND_SF_SECRET_HEADER_NAME: "secret"
    }, EX = {
        API_VERSION: "api-version",
        RESOURCE: "resource",
        SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
        XMS_CC: "xms_cc"
    }, lK = {
        AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
        DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
        IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
        IDENTITY_HEADER: "IDENTITY_HEADER",
        IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
        IMDS_ENDPOINT: "IMDS_ENDPOINT",
        MSI_ENDPOINT: "MSI_ENDPOINT",
        MSI_SECRET: "MSI_SECRET"
    }, P3 = {
        APP_SERVICE: "AppService",
        AZURE_ARC: "AzureArc",
        CLOUD_SHELL: "CloudShell",
        DEFAULT_TO_IMDS: "DefaultToImds",
        IMDS: "Imds",
        MACHINE_LEARNING: "MachineLearning",
        SERVICE_FABRIC: "ServiceFabric"
    }, FO = {
        SYSTEM_ASSIGNED: "system-assigned",
        USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
        USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
        USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
    }, aH = {
        GET: "get",
        POST: "post"
    }, p96 = {
        SUCCESS_RANGE_START: B3.SUCCESS_RANGE_START,
        SUCCESS_RANGE_END: B3.SUCCESS_RANGE_END,
        SERVER_ERROR: B3.SERVER_ERROR
    }, YO7 = {
        SHA256: "sha256"
    }, d96 = {
        CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    }, $YA = {
        KEY_SEPARATOR: "-"
    }, eG = {
        MSAL_SKU: "msal.js.node",
        JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        AUTHORIZATION_PENDING: "authorization_pending",
        HTTP_PROTOCOL: "http://",
        LOCALHOST: "localhost"
    }, VU = {
        acquireTokenSilent: 62,
        acquireTokenByUsernamePassword: 371,
        acquireTokenByDeviceCode: 671,
        acquireTokenByClientCredential: 771,
        acquireTokenByCode: 871,
        acquireTokenByRefreshToken: 872
    }, CL = {
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
    }, c96 = {
        INTERVAL_MS: 100,
        TIMEOUT_MS: 5000
    }
})
// @from(Ln 157926, Col 0)
class dh1 {
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
// @from(Ln 157949, Col 4)
wO7 = v(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 157953, Col 0)
class ch1 {
    constructor(A, q) {
        this.proxyUrl = A || "", this.customAgentOptions = q || {}
    }
    async sendGetRequestAsync(A, q, K) {
        if (this.proxyUrl) return $O7(A, this.proxyUrl, aH.GET, q, this.customAgentOptions, K);
        else return OO7(A, aH.GET, q, this.customAgentOptions, K)
    }
    async sendPostRequestAsync(A, q) {
        if (this.proxyUrl) return $O7(A, this.proxyUrl, aH.POST, q, this.customAgentOptions);
        else return OO7(A, aH.POST, q, this.customAgentOptions)
    }
}
// @from(Ln 157966, Col 4)
$O7 = (A, q, K, Y, z, w) => {
        let H = new URL(A),
            $ = new URL(q),
            O = Y?.headers || {},
            _ = {
                host: $.hostname,
                port: $.port,
                method: "CONNECT",
                path: H.hostname,
                headers: O
            };
        if (z && Object.keys(z).length) _.agent = new OYA.Agent(z);
        let J = "";
        if (K === aH.POST) {
            let D = Y?.body || "";
            J = `Content-Type: application/x-www-form-urlencoded\r
Content-Length: ${D.length}\r
\r
${D}`
        } else if (w) _.timeout = w;
        let X = `${K.toUpperCase()} ${H.href} HTTP/1.1\r
Host: ${H.host}\r
Connection: close\r
` + J + `\r
`;
        return new Promise((D, j) => {
            let M = OYA.request(_);
            if (w) M.on("timeout", () => {
                M.destroy(), j(Error("Request time out"))
            });
            M.end(), M.on("connect", (P, W) => {
                let G = P?.statusCode || p96.SERVER_ERROR;
                if (G < p96.SUCCESS_RANGE_START || G > p96.SUCCESS_RANGE_END) M.destroy(), W.destroy(), j(Error(`Error connecting to proxy. Http status code: ${P.statusCode}. Http status message: ${P?.statusMessage||"Unknown"}`));
                W.write(X);
                let f = [];
                W.on("data", (Z) => {
                    f.push(Z)
                }), W.on("end", () => {
                    let N = Buffer.concat([...f]).toString().split(`\r
`),
                        T = parseInt(N[0].split(" ")[1]),
                        k = N[0].split(" ").slice(2).join(" "),
                        y = N[N.length - 1],
                        B = N.slice(1, N.length - 2),
                        S = new Map;
                    B.forEach((U) => {
                        let x = U.split(new RegExp(/:\s(.*)/s)),
                            p = x[0],
                            l = x[1];
                        try {
                            let r = JSON.parse(l);
                            if (r && typeof r === "object") l = r
                        } catch (r) {}
                        S.set(p, l)
                    });
                    let b = Object.fromEntries(S),
                        g = dh1.getNetworkResponse(b, _O7(T, k, b, y), T);
                    if ((T < B3.SUCCESS_RANGE_START || T > B3.SUCCESS_RANGE_END) && g.body.error !== eG.AUTHORIZATION_PENDING) M.destroy();
                    D(g)
                }), W.on("error", (Z) => {
                    M.destroy(), W.destroy(), j(Error(Z.toString()))
                })
            }), M.on("error", (P) => {
                M.destroy(), j(Error(P.toString()))
            })
        })
    }
// @from(Ln 158033, Col 4)
OO7 = (A, q, K, Y, z) => {
        let w = q === aH.POST,
            H = K?.body || "",
            $ = new URL(A),
            O = K?.headers || {},
            _ = {
                method: q,
                headers: O,
                ...dh1.urlToHttpOptions($)
            };
        if (Y && Object.keys(Y).length) _.agent = new HO7.Agent(Y);
        if (w) _.headers = {
            ..._.headers,
            "Content-Length": H.length
        };
        else if (z) _.timeout = z;
        return new Promise((J, X) => {
            let D;
            if (_.protocol === "http:") D = OYA.request(_);
            else D = HO7.request(_);
            if (w) D.write(H);
            if (z) D.on("timeout", () => {
                D.destroy(), X(Error("Request time out"))
            });
            D.end(), D.on("response", (j) => {
                let {
                    headers: M,
                    statusCode: P,
                    statusMessage: W
                } = j, G = [];
                j.on("data", (f) => {
                    G.push(f)
                }), j.on("end", () => {
                    let f = Buffer.concat([...G]).toString(),
                        Z = M,
                        N = dh1.getNetworkResponse(Z, _O7(P, W, Z, f), P);
                    if ((P < B3.SUCCESS_RANGE_START || P > B3.SUCCESS_RANGE_END) && N.body.error !== eG.AUTHORIZATION_PENDING) D.destroy();
                    J(N)
                })
            }), D.on("error", (j) => {
                D.destroy(), X(Error(j.toString()))
            })
        })
    }
// @from(Ln 158077, Col 4)
_O7 = (A, q, K, Y) => {
        let z;
        try {
            z = JSON.parse(Y)
        } catch (w) {
            let H, $;
            if (A >= B3.CLIENT_ERROR_RANGE_START && A <= B3.CLIENT_ERROR_RANGE_END) H = "client_error", $ = "A client";
            else if (A >= B3.SERVER_ERROR_RANGE_START && A <= B3.SERVER_ERROR_RANGE_END) H = "server_error", $ = "A server";
            else H = "unknown_error", $ = "An unknown";
            z = {
                error: H,
                error_description: `${$} error occured.
Http status code: ${A}
Http status message: ${q||"Unknown"}
Headers: ${JSON.stringify(K)}`
            }
        }
        return z
    }
// @from(Ln 158096, Col 4)
JO7 = v(() => {
    ez();
    sH();
    wO7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158101, Col 4)
l96 = "invalid_file_extension"
// @from(Ln 158102, Col 4)
i96 = "invalid_file_path"
// @from(Ln 158103, Col 4)
zo = "invalid_managed_identity_id_type"
// @from(Ln 158104, Col 4)
n96 = "invalid_secret"
// @from(Ln 158105, Col 4)
XO7 = "missing_client_id"
// @from(Ln 158106, Col 4)
DO7 = "network_unavailable"
// @from(Ln 158107, Col 4)
r96 = "platform_not_supported"
// @from(Ln 158108, Col 4)
o96 = "unable_to_create_azure_arc"
// @from(Ln 158109, Col 4)
a96 = "unable_to_create_cloud_shell"
// @from(Ln 158110, Col 4)
s96 = "unable_to_create_source"
// @from(Ln 158111, Col 4)
lh1 = "unable_to_read_secret_file"
// @from(Ln 158112, Col 4)
jO7 = "user_assigned_not_available_at_runtime"
// @from(Ln 158113, Col 4)
t96 = "www_authenticate_header_missing"
// @from(Ln 158114, Col 4)
e96 = "www_authenticate_header_unsupported_format"
// @from(Ln 158115, Col 4)
v41
// @from(Ln 158116, Col 4)
E41 = v(() => {
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    v41 = {
        [lK.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
        [lK.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
        [lK.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
        [lK.MSI_ENDPOINT]: "msi_endpoint_url_malformed"
    }
})
// @from(Ln 158126, Col 0)
function DJ(A) {
    return new _YA(A)
}
// @from(Ln 158129, Col 4)
oB5
// @from(Ln 158129, Col 9)
_YA
// @from(Ln 158130, Col 4)
MX1 = v(() => {
    ez();
    E41();
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    oB5 = {
        [l96]: "The file path in the WWW-Authenticate header does not contain a .key file.",
        [i96]: "The file path in the WWW-Authenticate header is not in a valid Windows or Linux Format.",
        [zo]: "More than one ManagedIdentityIdType was provided.",
        [n96]: "The secret in the file on the file path in the WWW-Authenticate header is greater than 4096 bytes.",
        [r96]: "The platform is not supported by Azure Arc. Azure Arc only supports Windows and Linux.",
        [XO7]: "A ManagedIdentityId id was not provided.",
        [v41.AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${lK.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
        [v41.IDENTITY_ENDPOINT]: `The Managed Identity's '${lK.IDENTITY_ENDPOINT}' environment variable is malformed.`,
        [v41.IMDS_ENDPOINT]: `The Managed Identity's '${lK.IMDS_ENDPOINT}' environment variable is malformed.`,
        [v41.MSI_ENDPOINT]: `The Managed Identity's '${lK.MSI_ENDPOINT}' environment variable is malformed.`,
        [DO7]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
        [o96]: "Azure Arc Managed Identities can only be system assigned.",
        [a96]: "Cloud Shell Managed Identities can only be system assigned.",
        [s96]: "Unable to create a Managed Identity source based on environment variables.",
        [lh1]: "Unable to read the secret file.",
        [jO7]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
        [t96]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
        [e96]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format."
    };
    _YA = class _YA extends m3 {
        constructor(A) {
            super(A, oB5[A]);
            this.name = "ManagedIdentityError", Object.setPrototypeOf(this, _YA.prototype)
        }
    }
})
// @from(Ln 158161, Col 0)
class JYA {
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
            if (K || Y) throw DJ(zo);
            this.id = q, this.idType = FO.USER_ASSIGNED_CLIENT_ID
        } else if (K) {
            if (q || Y) throw DJ(zo);
            this.id = K, this.idType = FO.USER_ASSIGNED_RESOURCE_ID
        } else if (Y) {
            if (q || K) throw DJ(zo);
            this.id = Y, this.idType = FO.USER_ASSIGNED_OBJECT_ID
        } else this.id = e$7, this.idType = FO.SYSTEM_ASSIGNED
    }
}
// @from(Ln 158190, Col 4)
MO7 = v(() => {
    MX1();
    sH();
    E41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158195, Col 4)
kX
// @from(Ln 158195, Col 8)
Q$
// @from(Ln 158196, Col 4)
ih1 = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    kX = {
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
    Q$ = class Q$ extends m3 {
        constructor(A, q) {
            super(A, q);
            this.name = "NodeAuthError"
        }
        static createInvalidLoopbackAddressTypeError() {
            return new Q$(kX.invalidLoopbackAddressType.code, `${kX.invalidLoopbackAddressType.desc}`)
        }
        static createUnableToLoadRedirectUrlError() {
            return new Q$(kX.unableToLoadRedirectUri.code, `${kX.unableToLoadRedirectUri.desc}`)
        }
        static createNoAuthCodeInResponseError() {
            return new Q$(kX.noAuthCodeInResponse.code, `${kX.noAuthCodeInResponse.desc}`)
        }
        static createNoLoopbackServerExistsError() {
            return new Q$(kX.noLoopbackServerExists.code, `${kX.noLoopbackServerExists.desc}`)
        }
        static createLoopbackServerAlreadyExistsError() {
            return new Q$(kX.loopbackServerAlreadyExists.code, `${kX.loopbackServerAlreadyExists.desc}`)
        }
        static createLoopbackServerTimeoutError() {
            return new Q$(kX.loopbackServerTimeout.code, `${kX.loopbackServerTimeout.desc}`)
        }
        static createStateNotFoundError() {
            return new Q$(kX.stateNotFoundError.code, kX.stateNotFoundError.desc)
        }
        static createThumbprintMissingError() {
            return new Q$(kX.thumbprintMissing.code, kX.thumbprintMissing.desc)
        }
        static createRedirectUriNotSupportedError() {
            return new Q$(kX.redirectUriNotSupported.code, kX.redirectUriNotSupported.desc)
        }
    }
})
// @from(Ln 158271, Col 0)
function PO7({
    auth: A,
    broker: q,
    cache: K,
    system: Y,
    telemetry: z
}) {
    let w = {
        ...tB5,
        networkClient: new ch1(Y?.proxyUrl, Y?.customAgentOptions),
        loggerOptions: Y?.loggerOptions || XYA,
        disableInternalRetries: Y?.disableInternalRetries || !1
    };
    if (!!A.clientCertificate && !A.clientCertificate.thumbprint && !A.clientCertificate.thumbprintSha256) throw Q$.createStateNotFoundError();
    return {
        auth: {
            ...aB5,
            ...A
        },
        broker: {
            ...q
        },
        cache: {
            ...sB5,
            ...K
        },
        system: {
            ...w,
            ...Y
        },
        telemetry: {
            ...eB5,
            ...z
        }
    }
}
// @from(Ln 158308, Col 0)
function WO7({
    clientCapabilities: A,
    managedIdentityIdParams: q,
    system: K
}) {
    let Y = new JYA(q),
        z = K?.loggerOptions || XYA,
        w;
    if (K?.networkClient) w = K.networkClient;
    else w = new ch1(K?.proxyUrl, K?.customAgentOptions);
    return {
        clientCapabilities: A || [],
        managedIdentityId: Y,
        system: {
            loggerOptions: z,
            networkClient: w
        },
        disableInternalRetries: K?.disableInternalRetries || !1
    }
}
// @from(Ln 158328, Col 4)
aB5
// @from(Ln 158328, Col 9)
sB5
// @from(Ln 158328, Col 14)
XYA
// @from(Ln 158328, Col 19)
tB5
// @from(Ln 158328, Col 24)
eB5
// @from(Ln 158329, Col 4)
DYA = v(() => {
    ez();
    JO7();
    MO7();
    ih1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    aB5 = {
        clientId: uA.EMPTY_STRING,
        authority: uA.DEFAULT_AUTHORITY,
        clientSecret: uA.EMPTY_STRING,
        clientAssertion: uA.EMPTY_STRING,
        clientCertificate: {
            thumbprint: uA.EMPTY_STRING,
            thumbprintSha256: uA.EMPTY_STRING,
            privateKey: uA.EMPTY_STRING,
            x5c: uA.EMPTY_STRING
        },
        knownAuthorities: [],
        cloudDiscoveryMetadata: uA.EMPTY_STRING,
        authorityMetadata: uA.EMPTY_STRING,
        clientCapabilities: [],
        protocolMode: fW.AAD,
        azureCloudOptions: {
            azureCloudInstance: XU.None,
            tenant: uA.EMPTY_STRING
        },
        skipAuthorityMetadataCache: !1,
        encodeExtraQueryParams: !1
    }, sB5 = {
        claimsBasedCachingEnabled: !1
    }, XYA = {
        loggerCallback: () => {},
        piiLoggingEnabled: !1,
        logLevel: mO.Info
    }, tB5 = {
        loggerOptions: XYA,
        networkClient: new ch1,
        proxyUrl: uA.EMPTY_STRING,
        customAgentOptions: {},
        disableInternalRetries: !1
    }, eB5 = {
        application: {
            appName: uA.EMPTY_STRING,
            appVersion: uA.EMPTY_STRING
        }
    }
})
// @from(Ln 158375, Col 4)
jYA = R((GO7) => {
    Object.defineProperty(GO7, "__esModule", {
        value: !0
    });
    GO7.default = Km5;
    var Am5 = qm5(h1("crypto"));

    function qm5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var qY6 = new Uint8Array(256),
        AY6 = qY6.length;

    function Km5() {
        if (AY6 > qY6.length - 16) Am5.default.randomFillSync(qY6), AY6 = 0;
        return qY6.slice(AY6, AY6 += 16)
    }
})
// @from(Ln 158395, Col 4)
VO7 = R((ZO7) => {
    Object.defineProperty(ZO7, "__esModule", {
        value: !0
    });
    ZO7.default = void 0;
    var zm5 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    ZO7.default = zm5
})
// @from(Ln 158403, Col 4)
nh1 = R((NO7) => {
    Object.defineProperty(NO7, "__esModule", {
        value: !0
    });
    NO7.default = void 0;
    var wm5 = Hm5(VO7());

    function Hm5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function $m5(A) {
        return typeof A === "string" && wm5.default.test(A)
    }
    var Om5 = $m5;
    NO7.default = Om5
})
// @from(Ln 158422, Col 4)
rh1 = R((vO7) => {
    Object.defineProperty(vO7, "__esModule", {
        value: !0
    });
    vO7.default = void 0;
    var _m5 = Jm5(nh1());

    function Jm5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var TM = [];
    for (let A = 0; A < 256; ++A) TM.push((A + 256).toString(16).substr(1));

    function Xm5(A, q = 0) {
        let K = (TM[A[q + 0]] + TM[A[q + 1]] + TM[A[q + 2]] + TM[A[q + 3]] + "-" + TM[A[q + 4]] + TM[A[q + 5]] + "-" + TM[A[q + 6]] + TM[A[q + 7]] + "-" + TM[A[q + 8]] + TM[A[q + 9]] + "-" + TM[A[q + 10]] + TM[A[q + 11]] + TM[A[q + 12]] + TM[A[q + 13]] + TM[A[q + 14]] + TM[A[q + 15]]).toLowerCase();
        if (!(0, _m5.default)(K)) throw TypeError("Stringified UUID is invalid");
        return K
    }
    var Dm5 = Xm5;
    vO7.default = Dm5
})
// @from(Ln 158445, Col 4)
CO7 = R((RO7) => {
    Object.defineProperty(RO7, "__esModule", {
        value: !0
    });
    RO7.default = void 0;
    var jm5 = LO7(jYA()),
        Mm5 = LO7(rh1());

    function LO7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var kO7, MYA, PYA = 0,
        WYA = 0;

    function Pm5(A, q, K) {
        let Y = q && K || 0,
            z = q || Array(16);
        A = A || {};
        let w = A.node || kO7,
            H = A.clockseq !== void 0 ? A.clockseq : MYA;
        if (w == null || H == null) {
            let D = A.random || (A.rng || jm5.default)();
            if (w == null) w = kO7 = [D[0] | 1, D[1], D[2], D[3], D[4], D[5]];
            if (H == null) H = MYA = (D[6] << 8 | D[7]) & 16383
        }
        let $ = A.msecs !== void 0 ? A.msecs : Date.now(),
            O = A.nsecs !== void 0 ? A.nsecs : WYA + 1,
            _ = $ - PYA + (O - WYA) / 1e4;
        if (_ < 0 && A.clockseq === void 0) H = H + 1 & 16383;
        if ((_ < 0 || $ > PYA) && A.nsecs === void 0) O = 0;
        if (O >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        PYA = $, WYA = O, MYA = H, $ += 12219292800000;
        let J = (($ & 268435455) * 1e4 + O) % 4294967296;
        z[Y++] = J >>> 24 & 255, z[Y++] = J >>> 16 & 255, z[Y++] = J >>> 8 & 255, z[Y++] = J & 255;
        let X = $ / 4294967296 * 1e4 & 268435455;
        z[Y++] = X >>> 8 & 255, z[Y++] = X & 255, z[Y++] = X >>> 24 & 15 | 16, z[Y++] = X >>> 16 & 255, z[Y++] = H >>> 8 | 128, z[Y++] = H & 255;
        for (let D = 0; D < 6; ++D) z[Y + D] = w[D];
        return q || (0, Mm5.default)(z)
    }
    var Wm5 = Pm5;
    RO7.default = Wm5
})
// @from(Ln 158489, Col 4)
GYA = R((SO7) => {
    Object.defineProperty(SO7, "__esModule", {
        value: !0
    });
    SO7.default = void 0;
    var Gm5 = Zm5(nh1());

    function Zm5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function fm5(A) {
        if (!(0, Gm5.default)(A)) throw TypeError("Invalid UUID");
        let q, K = new Uint8Array(16);
        return K[0] = (q = parseInt(A.slice(0, 8), 16)) >>> 24, K[1] = q >>> 16 & 255, K[2] = q >>> 8 & 255, K[3] = q & 255, K[4] = (q = parseInt(A.slice(9, 13), 16)) >>> 8, K[5] = q & 255, K[6] = (q = parseInt(A.slice(14, 18), 16)) >>> 8, K[7] = q & 255, K[8] = (q = parseInt(A.slice(19, 23), 16)) >>> 8, K[9] = q & 255, K[10] = (q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, K[11] = q / 4294967296 & 255, K[12] = q >>> 24 & 255, K[13] = q >>> 16 & 255, K[14] = q >>> 8 & 255, K[15] = q & 255, K
    }
    var Vm5 = fm5;
    SO7.default = Vm5
})
// @from(Ln 158510, Col 4)
ZYA = R((uO7) => {
    Object.defineProperty(uO7, "__esModule", {
        value: !0
    });
    uO7.default = Em5;
    uO7.URL = uO7.DNS = void 0;
    var Nm5 = IO7(rh1()),
        Tm5 = IO7(GYA());

    function IO7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function vm5(A) {
        A = unescape(encodeURIComponent(A));
        let q = [];
        for (let K = 0; K < A.length; ++K) q.push(A.charCodeAt(K));
        return q
    }
    var xO7 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    uO7.DNS = xO7;
    var bO7 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    uO7.URL = bO7;

    function Em5(A, q, K) {
        function Y(z, w, H, $) {
            if (typeof z === "string") z = vm5(z);
            if (typeof w === "string") w = (0, Tm5.default)(w);
            if (w.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let O = new Uint8Array(16 + z.length);
            if (O.set(w), O.set(z, w.length), O = K(O), O[6] = O[6] & 15 | q, O[8] = O[8] & 63 | 128, H) {
                $ = $ || 0;
                for (let _ = 0; _ < 16; ++_) H[$ + _] = O[_];
                return H
            }
            return (0, Nm5.default)(O)
        }
        try {
            Y.name = A
        } catch (z) {}
        return Y.DNS = xO7, Y.URL = bO7, Y
    }
})
// @from(Ln 158555, Col 4)
QO7 = R((mO7) => {
    Object.defineProperty(mO7, "__esModule", {
        value: !0
    });
    mO7.default = void 0;
    var Rm5 = ym5(h1("crypto"));

    function ym5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function Cm5(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return Rm5.default.createHash("md5").update(A).digest()
    }
    var Sm5 = Cm5;
    mO7.default = Sm5
})
// @from(Ln 158576, Col 4)
dO7 = R((UO7) => {
    Object.defineProperty(UO7, "__esModule", {
        value: !0
    });
    UO7.default = void 0;
    var hm5 = gO7(ZYA()),
        Im5 = gO7(QO7());

    function gO7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var xm5 = (0, hm5.default)("v3", 48, Im5.default),
        bm5 = xm5;
    UO7.default = bm5
})
// @from(Ln 158593, Col 4)
nO7 = R((lO7) => {
    Object.defineProperty(lO7, "__esModule", {
        value: !0
    });
    lO7.default = void 0;
    var um5 = cO7(jYA()),
        Bm5 = cO7(rh1());

    function cO7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function mm5(A, q, K) {
        A = A || {};
        let Y = A.random || (A.rng || um5.default)();
        if (Y[6] = Y[6] & 15 | 64, Y[8] = Y[8] & 63 | 128, q) {
            K = K || 0;
            for (let z = 0; z < 16; ++z) q[K + z] = Y[z];
            return q
        }
        return (0, Bm5.default)(Y)
    }
    var Fm5 = mm5;
    lO7.default = Fm5
})
// @from(Ln 158620, Col 4)
aO7 = R((rO7) => {
    Object.defineProperty(rO7, "__esModule", {
        value: !0
    });
    rO7.default = void 0;
    var Qm5 = gm5(h1("crypto"));

    function gm5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function Um5(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return Qm5.default.createHash("sha1").update(A).digest()
    }
    var pm5 = Um5;
    rO7.default = pm5
})
// @from(Ln 158641, Col 4)
A_7 = R((tO7) => {
    Object.defineProperty(tO7, "__esModule", {
        value: !0
    });
    tO7.default = void 0;
    var dm5 = sO7(ZYA()),
        cm5 = sO7(aO7());

    function sO7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var lm5 = (0, dm5.default)("v5", 80, cm5.default),
        im5 = lm5;
    tO7.default = im5
})
// @from(Ln 158658, Col 4)
Y_7 = R((q_7) => {
    Object.defineProperty(q_7, "__esModule", {
        value: !0
    });
    q_7.default = void 0;
    var nm5 = "00000000-0000-0000-0000-000000000000";
    q_7.default = nm5
})
// @from(Ln 158666, Col 4)
H_7 = R((z_7) => {
    Object.defineProperty(z_7, "__esModule", {
        value: !0
    });
    z_7.default = void 0;
    var rm5 = om5(nh1());

    function om5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function am5(A) {
        if (!(0, rm5.default)(A)) throw TypeError("Invalid UUID");
        return parseInt(A.substr(14, 1), 16)
    }
    var sm5 = am5;
    z_7.default = sm5
})
// @from(Ln 158686, Col 4)
$_7 = R((ES) => {
    Object.defineProperty(ES, "__esModule", {
        value: !0
    });
    Object.defineProperty(ES, "v1", {
        enumerable: !0,
        get: function() {
            return tm5.default
        }
    });
    Object.defineProperty(ES, "v3", {
        enumerable: !0,
        get: function() {
            return em5.default
        }
    });
    Object.defineProperty(ES, "v4", {
        enumerable: !0,
        get: function() {
            return AF5.default
        }
    });
    Object.defineProperty(ES, "v5", {
        enumerable: !0,
        get: function() {
            return qF5.default
        }
    });
    Object.defineProperty(ES, "NIL", {
        enumerable: !0,
        get: function() {
            return KF5.default
        }
    });
    Object.defineProperty(ES, "version", {
        enumerable: !0,
        get: function() {
            return YF5.default
        }
    });
    Object.defineProperty(ES, "validate", {
        enumerable: !0,
        get: function() {
            return zF5.default
        }
    });
    Object.defineProperty(ES, "stringify", {
        enumerable: !0,
        get: function() {
            return wF5.default
        }
    });
    Object.defineProperty(ES, "parse", {
        enumerable: !0,
        get: function() {
            return HF5.default
        }
    });
    var tm5 = NU(CO7()),
        em5 = NU(dO7()),
        AF5 = NU(nO7()),
        qF5 = NU(A_7()),
        KF5 = NU(Y_7()),
        YF5 = NU(H_7()),
        zF5 = NU(nh1()),
        wF5 = NU(rh1()),
        HF5 = NU(GYA());

    function NU(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
})
// @from(Ln 158760, Col 4)
uu
// @from(Ln 158760, Col 8)
pb2
// @from(Ln 158760, Col 13)
db2
// @from(Ln 158760, Col 18)
O_7
// @from(Ln 158760, Col 23)
cb2
// @from(Ln 158760, Col 28)
lb2
// @from(Ln 158760, Col 33)
ib2
// @from(Ln 158760, Col 38)
nb2
// @from(Ln 158760, Col 43)
rb2
// @from(Ln 158760, Col 48)
ob2
// @from(Ln 158761, Col 4)
__7 = v(() => {
    uu = o($_7(), 1), pb2 = uu.default.v1, db2 = uu.default.v3, O_7 = uu.default.v4, cb2 = uu.default.v5, lb2 = uu.default.NIL, ib2 = uu.default.version, nb2 = uu.default.validate, rb2 = uu.default.stringify, ob2 = uu.default.parse
})
// @from(Ln 158764, Col 0)
class oh1 {
    generateGuid() {
        return O_7()
    }
    isGuid(A) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(A)
    }
}
// @from(Ln 158772, Col 4)
fYA = v(() => {
    __7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158775, Col 0)
class SV {
    static base64Encode(A, q) {
        return Buffer.from(A, q).toString(VM.BASE64)
    }
    static base64EncodeUrl(A, q) {
        return SV.base64Encode(A, q).replace(/=/g, uA.EMPTY_STRING).replace(/\+/g, "-").replace(/\//g, "_")
    }
    static base64Decode(A) {
        return Buffer.from(A, VM.BASE64).toString("utf8")
    }
    static base64DecodeUrl(A) {
        let q = A.replace(/-/g, "+").replace(/_/g, "/");
        while (q.length % 4) q += "=";
        return SV.base64Decode(q)
    }
}
// @from(Ln 158791, Col 4)
ah1 = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158795, Col 0)
class k41 {
    sha256(A) {
        return $F5.createHash(YO7.SHA256).update(A).digest()
    }
}
// @from(Ln 158800, Col 4)
KY6 = v(() => {
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158804, Col 0)
class VYA {
    constructor() {
        this.hashUtils = new k41
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
            q = 256 - 256 % d96.CV_CHARSET.length;
        while (A.length <= KO7) {
            let Y = OF5.randomBytes(1)[0];
            if (Y >= q) continue;
            let z = Y % d96.CV_CHARSET.length;
            A.push(d96.CV_CHARSET[z])
        }
        let K = A.join(uA.EMPTY_STRING);
        return SV.base64EncodeUrl(K)
    }
    generateCodeChallengeFromVerifier(A) {
        return SV.base64EncodeUrl(this.hashUtils.sha256(A).toString(VM.BASE64), VM.BASE64)
    }
}
// @from(Ln 158832, Col 4)
J_7 = v(() => {
    ez();
    sH();
    ah1();
    KY6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158838, Col 0)
class TU {
    constructor() {
        this.pkceGenerator = new VYA, this.guidGenerator = new oh1, this.hashUtils = new k41
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
        return SV.base64Encode(A)
    }
    base64Decode(A) {
        return SV.base64Decode(A)
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
        return SV.base64EncodeUrl(this.hashUtils.sha256(A).toString(VM.BASE64), VM.BASE64)
    }
}
// @from(Ln 158876, Col 4)
sh1 = v(() => {
    ez();
    fYA();
    ah1();
    J_7();
    KY6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158883, Col 4)
YY6 = v(() => {
    WH();
    t5A(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 158888, Col 0)
function X_7(A) {
    let q = A.credentialType === tz.REFRESH_TOKEN && A.familyId || A.clientId,
        K = A.tokenType && A.tokenType.toLowerCase() !== b9.BEARER.toLowerCase() ? A.tokenType.toLowerCase() : "";
    return [A.homeAccountId, A.environment, A.credentialType, q, A.realm || "", A.target || "", A.requestedClaimsHash || "", K].join($YA.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 158894, Col 0)
function D_7(A) {
    let q = A.homeAccountId.split(".")[1];
    return [A.homeAccountId, A.environment, q || A.tenantId || ""].join($YA.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 158898, Col 4)
j_7 = v(() => {
    ez();
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 158902, Col 4)
L41
// @from(Ln 158903, Col 4)
zY6 = v(() => {
    ez();
    U96();
    t56();
    YY6();
    j_7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    L41 = class L41 extends j41 {
        constructor(A, q, K, Y) {
            super(q, K, A, new zX1, Y);
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
                if (Y instanceof vX) q.accounts[K] = Y;
                else if (aG.isIdTokenEntity(Y)) q.idTokens[K] = Y;
                else if (aG.isAccessTokenEntity(Y)) q.accessTokens[K] = Y;
                else if (aG.isRefreshTokenEntity(Y)) q.refreshTokens[K] = Y;
                else if (aG.isAppMetadataEntity(K, Y)) q.appMetadata[K] = Y;
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
            return X_7(A)
        }
        generateAccountKey(A) {
            return D_7(A)
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
            return this.getItem(A) ? Object.assign(new vX, this.getItem(A)) : null
        }
        async setAccount(A) {
            let q = this.generateAccountKey(vX.getAccountInfo(A));
            this.setItem(q, A)
        }
        getIdTokenCredential(A) {
            let q = this.getItem(A);
            if (aG.isIdTokenEntity(q)) return q;
            return null
        }
        async setIdTokenCredential(A) {
            let q = this.generateCredentialKey(A);
            this.setItem(q, A)
        }
        getAccessTokenCredential(A) {
            let q = this.getItem(A);
            if (aG.isAccessTokenEntity(q)) return q;
            return null
        }
        async setAccessTokenCredential(A) {
            let q = this.generateCredentialKey(A);
            this.setItem(q, A)
        }
        getRefreshTokenCredential(A) {
            let q = this.getItem(A);
            if (aG.isRefreshTokenEntity(q)) return q;
            return null
        }
        async setRefreshTokenCredential(A) {
            let q = this.generateCredentialKey(A);
            this.setItem(q, A)
        }
        getAppMetadata(A) {
            let q = this.getItem(A);
            if (aG.isAppMetadataEntity(A, q)) return q;
            return null
        }
        setAppMetadata(A) {
            let q = aG.generateAppMetadataKey(A);
            this.setItem(q, A)
        }
        getServerTelemetry(A) {
            let q = this.getItem(A);
            if (q && aG.isServerTelemetryEntity(A, q)) return q;
            return null
        }
        setServerTelemetry(A, q) {
            this.setItem(A, q)
        }
        getAuthorityMetadata(A) {
            let q = this.getItem(A);
            if (q && aG.isAuthorityMetadataEntity(A, q)) return q;
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
            if (q && aG.isThrottlingEntity(A, q)) return q;
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
            return Yo.deserializeAllCache(Yo.deserializeJSONBlob(A))
        }
        static generateJsonCache(A) {
            return B71.serializeAllCache(A)
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
// @from(Ln 159104, Col 0)
class eh1 {
    constructor(A, q, K) {
        if (this.cacheHasChanged = !1, this.storage = A, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), K) this.persistence = K;
        this.logger = q
    }
    hasChanged() {
        return this.cacheHasChanged
    }
    serialize() {
        this.logger.trace("Serializing in-memory cache");
        let A = B71.serializeAllCache(this.storage.getInMemoryCache());
        if (this.cacheSnapshot) this.logger.trace("Reading cache snapshot from disk"), A = this.mergeState(JSON.parse(this.cacheSnapshot), A);
        else this.logger.trace("No cache snapshot to merge");
        return this.cacheHasChanged = !1, JSON.stringify(A)
    }
    deserialize(A) {
        if (this.logger.trace("Deserializing JSON to in-memory cache"), this.cacheSnapshot = A, this.cacheSnapshot) {
            this.logger.trace("Reading cache snapshot from disk");
            let q = Yo.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
            this.storage.setInMemoryCache(q)
        } else this.logger.trace("No cache snapshot to deserialize")
    }
    getKVStore() {
        return this.storage.getCache()
    }
    getCacheSnapshot() {
        let A = L41.generateInMemoryCache(this.cacheSnapshot);
        return this.storage.inMemoryCacheToCache(A)
    }
    async getAllAccounts(A = new TU().createNewGuid()) {
        this.logger.trace("getAllAccounts called");
        let q;
        try {
            if (this.persistence) q = new yL(this, !1), await this.persistence.beforeCacheAccess(q);
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
            if (this.persistence) K = new yL(this, !0), await this.persistence.beforeCacheAccess(K);
            this.storage.removeAccount(A, q || new oh1().generateGuid())
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
        let A = new yL(this, !1);
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
                    w = typeof Y === "object",
                    H = !Array.isArray(Y),
                    $ = typeof A[K] < "u" && A[K] !== null;
                if (z && w && H && $) this.mergeUpdates(A[K], Y);
                else A[K] = Y
            }
        }), A
    }
    mergeRemovals(A, q) {
        this.logger.trace("Remove updated entries in cache");
        let K = A.Account ? this.mergeRemovalsDict(A.Account, q.Account) : A.Account,
            Y = A.AccessToken ? this.mergeRemovalsDict(A.AccessToken, q.AccessToken) : A.AccessToken,
            z = A.RefreshToken ? this.mergeRemovalsDict(A.RefreshToken, q.RefreshToken) : A.RefreshToken,
            w = A.IdToken ? this.mergeRemovalsDict(A.IdToken, q.IdToken) : A.IdToken,
            H = A.AppMetadata ? this.mergeRemovalsDict(A.AppMetadata, q.AppMetadata) : A.AppMetadata;
        return {
            ...A,
            Account: K,
            AccessToken: Y,
            RefreshToken: z,
            IdToken: w,
            AppMetadata: H
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
                ...th1.Account,
                ...A.Account
            },
            IdToken: {
                ...th1.IdToken,
                ...A.IdToken
            },
            AccessToken: {
                ...th1.AccessToken,
                ...A.AccessToken
            },
            RefreshToken: {
                ...th1.RefreshToken,
                ...A.RefreshToken
            },
            AppMetadata: {
                ...th1.AppMetadata,
                ...A.AppMetadata
            }
        }
    }
}
// @from(Ln 159246, Col 4)
th1
// @from(Ln 159247, Col 4)
NYA = v(() => {
    zY6();
    ez();
    U96();
    t56();
    sh1();
    fYA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    th1 = {
        Account: {},
        IdToken: {},
        AccessToken: {},
        RefreshToken: {},
        AppMetadata: {}
    }
})
// @from(Ln 159262, Col 4)
mu = R((TYA, P_7) => {
    /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
    var wY6 = h1("buffer"),
        Bu = wY6.Buffer;

    function M_7(A, q) {
        for (var K in A) q[K] = A[K]
    }
    if (Bu.from && Bu.alloc && Bu.allocUnsafe && Bu.allocUnsafeSlow) P_7.exports = wY6;
    else M_7(wY6, TYA), TYA.Buffer = R41;

    function R41(A, q, K) {
        return Bu(A, q, K)
    }
    R41.prototype = Object.create(Bu.prototype);
    M_7(Bu, R41);
    R41.from = function(A, q, K) {
        if (typeof A === "number") throw TypeError("Argument must not be a number");
        return Bu(A, q, K)
    };
    R41.alloc = function(A, q, K) {
        if (typeof A !== "number") throw TypeError("Argument must be a number");
        var Y = Bu(A);
        if (q !== void 0)
            if (typeof K === "string") Y.fill(q, K);
            else Y.fill(q);
        else Y.fill(0);
        return Y
    };
    R41.allocUnsafe = function(A) {
        if (typeof A !== "number") throw TypeError("Argument must be a number");
        return Bu(A)
    };
    R41.allocUnsafeSlow = function(A) {
        if (typeof A !== "number") throw TypeError("Argument must be a number");
        return wY6.SlowBuffer(A)
    }
})
// @from(Ln 159300, Col 4)
vYA = R((uu2, W_7) => {
    var HY6 = mu().Buffer,
        _F5 = h1("stream"),
        JF5 = h1("util");

    function $Y6(A) {
        if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = HY6.alloc(0), this;
        if (typeof A.pipe === "function") return this.buffer = HY6.alloc(0), A.pipe(this), this;
        if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
            this.emit("end", A), this.readable = !1, this.emit("close")
        }.bind(this)), this;
        throw TypeError("Unexpected data type (" + typeof A + ")")
    }
    JF5.inherits($Y6, _F5);
    $Y6.prototype.write = function(q) {
        this.buffer = HY6.concat([this.buffer, HY6.from(q)]), this.emit("data", q)
    };
    $Y6.prototype.end = function(q) {
        if (q) this.write(q);
        this.emit("end", q), this.emit("close"), this.writable = !1, this.readable = !1
    };
    W_7.exports = $Y6
})
// @from(Ln 159323, Col 4)
Z_7 = R((Bu2, G_7) => {
    function EYA(A) {
        var q = (A / 8 | 0) + (A % 8 === 0 ? 0 : 1);
        return q
    }
    var XF5 = {
        ES256: EYA(256),
        ES384: EYA(384),
        ES512: EYA(521)
    };

    function DF5(A) {
        var q = XF5[A];
        if (q) return q;
        throw Error('Unknown algorithm "' + A + '"')
    }
    G_7.exports = DF5
})
// @from(Ln 159341, Col 4)
XY6 = R((mu2, E_7) => {
    var OY6 = mu().Buffer,
        V_7 = Z_7(),
        _Y6 = 128,
        N_7 = 0,
        jF5 = 32,
        MF5 = 16,
        PF5 = 2,
        T_7 = MF5 | jF5 | N_7 << 6,
        JY6 = PF5 | N_7 << 6;

    function WF5(A) {
        return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function v_7(A) {
        if (OY6.isBuffer(A)) return A;
        else if (typeof A === "string") return OY6.from(A, "base64");
        throw TypeError("ECDSA signature must be a Base64 string or a Buffer")
    }

    function GF5(A, q) {
        A = v_7(A);
        var K = V_7(q),
            Y = K + 1,
            z = A.length,
            w = 0;
        if (A[w++] !== T_7) throw Error('Could not find expected "seq"');
        var H = A[w++];
        if (H === (_Y6 | 1)) H = A[w++];
        if (z - w < H) throw Error('"seq" specified length of "' + H + '", only "' + (z - w) + '" remaining');
        if (A[w++] !== JY6) throw Error('Could not find expected "int" for "r"');
        var $ = A[w++];
        if (z - w - 2 < $) throw Error('"r" specified length of "' + $ + '", only "' + (z - w - 2) + '" available');
        if (Y < $) throw Error('"r" specified length of "' + $ + '", max of "' + Y + '" is acceptable');
        var O = w;
        if (w += $, A[w++] !== JY6) throw Error('Could not find expected "int" for "s"');
        var _ = A[w++];
        if (z - w !== _) throw Error('"s" specified length of "' + _ + '", expected "' + (z - w) + '"');
        if (Y < _) throw Error('"s" specified length of "' + _ + '", max of "' + Y + '" is acceptable');
        var J = w;
        if (w += _, w !== z) throw Error('Expected to consume entire buffer, but "' + (z - w) + '" bytes remain');
        var X = K - $,
            D = K - _,
            j = OY6.allocUnsafe(X + $ + D + _);
        for (w = 0; w < X; ++w) j[w] = 0;
        A.copy(j, w, O + Math.max(-X, 0), O + $), w = K;
        for (var M = w; w < M + D; ++w) j[w] = 0;
        return A.copy(j, w, J + Math.max(-D, 0), J + _), j = j.toString("base64"), j = WF5(j), j
    }

    function f_7(A, q, K) {
        var Y = 0;
        while (q + Y < K && A[q + Y] === 0) ++Y;
        var z = A[q + Y] >= _Y6;
        if (z) --Y;
        return Y
    }

    function ZF5(A, q) {
        A = v_7(A);
        var K = V_7(q),
            Y = A.length;
        if (Y !== K * 2) throw TypeError('"' + q + '" signatures must be "' + K * 2 + '" bytes, saw "' + Y + '"');
        var z = f_7(A, 0, K),
            w = f_7(A, K, A.length),
            H = K - z,
            $ = K - w,
            O = 2 + H + 1 + 1 + $,
            _ = O < _Y6,
            J = OY6.allocUnsafe((_ ? 2 : 3) + O),
            X = 0;
        if (J[X++] = T_7, _) J[X++] = O;
        else J[X++] = _Y6 | 1, J[X++] = O & 255;
        if (J[X++] = JY6, J[X++] = H, z < 0) J[X++] = 0, X += A.copy(J, X, 0, K);
        else X += A.copy(J, X, z, K);
        if (J[X++] = JY6, J[X++] = $, w < 0) J[X++] = 0, A.copy(J, X, K);
        else A.copy(J, X, K + w);
        return J
    }
    E_7.exports = {
        derToJose: GF5,
        joseToDer: ZF5
    }
})
// @from(Ln 159426, Col 4)
LYA = R((Fu2, k_7) => {
    var AI1 = h1("buffer").Buffer,
        kYA = h1("buffer").SlowBuffer;
    k_7.exports = DY6;

    function DY6(A, q) {
        if (!AI1.isBuffer(A) || !AI1.isBuffer(q)) return !1;
        if (A.length !== q.length) return !1;
        var K = 0;
        for (var Y = 0; Y < A.length; Y++) K |= A[Y] ^ q[Y];
        return K === 0
    }
    DY6.install = function() {
        AI1.prototype.equal = kYA.prototype.equal = function(q) {
            return DY6(this, q)
        }
    };
    var fF5 = AI1.prototype.equal,
        VF5 = kYA.prototype.equal;
    DY6.restore = function() {
        AI1.prototype.equal = fF5, kYA.prototype.equal = VF5
    }
})
// @from(Ln 159449, Col 4)
SYA = R((Qu2, b_7) => {
    var WX1 = mu().Buffer,
        SL = h1("crypto"),
        R_7 = XY6(),
        L_7 = h1("util"),
        NF5 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
        qI1 = "secret must be a string or buffer",
        PX1 = "key must be a string or a buffer",
        TF5 = "key must be a string, a buffer or an object",
        yYA = typeof SL.createPublicKey === "function";
    if (yYA) PX1 += " or a KeyObject", qI1 += "or a KeyObject";

    function y_7(A) {
        if (WX1.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (!yYA) throw kS(PX1);
        if (typeof A !== "object") throw kS(PX1);
        if (typeof A.type !== "string") throw kS(PX1);
        if (typeof A.asymmetricKeyType !== "string") throw kS(PX1);
        if (typeof A.export !== "function") throw kS(PX1)
    }

    function C_7(A) {
        if (WX1.isBuffer(A)) return;
        if (typeof A === "string") return;
        if (typeof A === "object") return;
        throw kS(TF5)
    }

    function vF5(A) {
        if (WX1.isBuffer(A)) return;
        if (typeof A === "string") return A;
        if (!yYA) throw kS(qI1);
        if (typeof A !== "object") throw kS(qI1);
        if (A.type !== "secret") throw kS(qI1);
        if (typeof A.export !== "function") throw kS(qI1)
    }

    function CYA(A) {
        return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function S_7(A) {
        A = A.toString();
        var q = 4 - A.length % 4;
        if (q !== 4)
            for (var K = 0; K < q; ++K) A += "=";
        return A.replace(/\-/g, "+").replace(/_/g, "/")
    }

    function kS(A) {
        var q = [].slice.call(arguments, 1),
            K = L_7.format.bind(L_7, A).apply(null, q);
        return TypeError(K)
    }

    function EF5(A) {
        return WX1.isBuffer(A) || typeof A === "string"
    }

    function KI1(A) {
        if (!EF5(A)) A = JSON.stringify(A);
        return A
    }

    function h_7(A) {
        return function(K, Y) {
            vF5(Y), K = KI1(K);
            var z = SL.createHmac("sha" + A, Y),
                w = (z.update(K), z.digest("base64"));
            return CYA(w)
        }
    }
    var RYA, kF5 = "timingSafeEqual" in SL ? function(q, K) {
        if (q.byteLength !== K.byteLength) return !1;
        return SL.timingSafeEqual(q, K)
    } : function(q, K) {
        if (!RYA) RYA = LYA();
        return RYA(q, K)
    };

    function LF5(A) {
        return function(K, Y, z) {
            var w = h_7(A)(K, z);
            return kF5(WX1.from(Y), WX1.from(w))
        }
    }

    function I_7(A) {
        return function(K, Y) {
            C_7(Y), K = KI1(K);
            var z = SL.createSign("RSA-SHA" + A),
                w = (z.update(K), z.sign(Y, "base64"));
            return CYA(w)
        }
    }

    function x_7(A) {
        return function(K, Y, z) {
            y_7(z), K = KI1(K), Y = S_7(Y);
            var w = SL.createVerify("RSA-SHA" + A);
            return w.update(K), w.verify(z, Y, "base64")
        }
    }

    function RF5(A) {
        return function(K, Y) {
            C_7(Y), K = KI1(K);
            var z = SL.createSign("RSA-SHA" + A),
                w = (z.update(K), z.sign({
                    key: Y,
                    padding: SL.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: SL.constants.RSA_PSS_SALTLEN_DIGEST
                }, "base64"));
            return CYA(w)
        }
    }

    function yF5(A) {
        return function(K, Y, z) {
            y_7(z), K = KI1(K), Y = S_7(Y);
            var w = SL.createVerify("RSA-SHA" + A);
            return w.update(K), w.verify({
                key: z,
                padding: SL.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: SL.constants.RSA_PSS_SALTLEN_DIGEST
            }, Y, "base64")
        }
    }

    function CF5(A) {
        var q = I_7(A);
        return function() {
            var Y = q.apply(null, arguments);
            return Y = R_7.derToJose(Y, "ES" + A), Y
        }
    }

    function SF5(A) {
        var q = x_7(A);
        return function(Y, z, w) {
            z = R_7.joseToDer(z, "ES" + A).toString("base64");
            var H = q(Y, z, w);
            return H
        }
    }

    function hF5() {
        return function() {
            return ""
        }
    }

    function IF5() {
        return function(q, K) {
            return K === ""
        }
    }
    b_7.exports = function(q) {
        var K = {
                hs: h_7,
                rs: I_7,
                ps: RF5,
                es: CF5,
                none: hF5
            },
            Y = {
                hs: LF5,
                rs: x_7,
                ps: yF5,
                es: SF5,
                none: IF5
            },
            z = q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
        if (!z) throw kS(NF5, q);
        var w = (z[1] || z[3]).toLowerCase(),
            H = z[2];
        return {
            sign: K[w](H),
            verify: Y[w](H)
        }
    }
})
// @from(Ln 159634, Col 4)
hYA = R((gu2, u_7) => {
    var xF5 = h1("buffer").Buffer;
    u_7.exports = function(q) {
        if (typeof q === "string") return q;
        if (typeof q === "number" || xF5.isBuffer(q)) return q.toString();
        return JSON.stringify(q)
    }
})
// @from(Ln 159642, Col 4)
U_7 = R((Uu2, g_7) => {
    var bF5 = mu().Buffer,
        B_7 = vYA(),
        uF5 = SYA(),
        BF5 = h1("stream"),
        m_7 = hYA(),
        IYA = h1("util");

    function F_7(A, q) {
        return bF5.from(A, q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function mF5(A, q, K) {
        K = K || "utf8";
        var Y = F_7(m_7(A), "binary"),
            z = F_7(m_7(q), K);
        return IYA.format("%s.%s", Y, z)
    }

    function Q_7(A) {
        var {
            header: q,
            payload: K
        } = A, Y = A.secret || A.privateKey, z = A.encoding, w = uF5(q.alg), H = mF5(q, K, z), $ = w.sign(H, Y);
        return IYA.format("%s.%s", H, $)
    }

    function jY6(A) {
        var q = A.secret || A.privateKey || A.key,
            K = new B_7(q);
        this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = K, this.payload = new B_7(A.payload), this.secret.once("close", function() {
            if (!this.payload.writable && this.readable) this.sign()
        }.bind(this)), this.payload.once("close", function() {
            if (!this.secret.writable && this.readable) this.sign()
        }.bind(this))
    }
    IYA.inherits(jY6, BF5);
    jY6.prototype.sign = function() {
        try {
            var q = Q_7({
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
    jY6.sign = Q_7;
    g_7.exports = jY6
})
// @from(Ln 159695, Col 4)
s_7 = R((pu2, a_7) => {
    var d_7 = mu().Buffer,
        p_7 = vYA(),
        FF5 = SYA(),
        QF5 = h1("stream"),
        c_7 = hYA(),
        gF5 = h1("util"),
        UF5 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

    function pF5(A) {
        return Object.prototype.toString.call(A) === "[object Object]"
    }

    function dF5(A) {
        if (pF5(A)) return A;
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }

    function l_7(A) {
        var q = A.split(".", 1)[0];
        return dF5(d_7.from(q, "base64").toString("binary"))
    }

    function cF5(A) {
        return A.split(".", 2).join(".")
    }

    function i_7(A) {
        return A.split(".")[2]
    }

    function lF5(A, q) {
        q = q || "utf8";
        var K = A.split(".")[1];
        return d_7.from(K, "base64").toString(q)
    }

    function n_7(A) {
        return UF5.test(A) && !!l_7(A)
    }

    function r_7(A, q, K) {
        if (!q) {
            var Y = Error("Missing algorithm parameter for jws.verify");
            throw Y.code = "MISSING_ALGORITHM", Y
        }
        A = c_7(A);
        var z = i_7(A),
            w = cF5(A),
            H = FF5(q);
        return H.verify(w, z, K)
    }

    function o_7(A, q) {
        if (q = q || {}, A = c_7(A), !n_7(A)) return null;
        var K = l_7(A);
        if (!K) return null;
        var Y = lF5(A);
        if (K.typ === "JWT" || q.json) Y = JSON.parse(Y, q.encoding);
        return {
            header: K,
            payload: Y,
            signature: i_7(A)
        }
    }

    function GX1(A) {
        A = A || {};
        var q = A.secret || A.publicKey || A.key,
            K = new p_7(q);
        this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = K, this.signature = new p_7(A.signature), this.secret.once("close", function() {
            if (!this.signature.writable && this.readable) this.verify()
        }.bind(this)), this.signature.once("close", function() {
            if (!this.secret.writable && this.readable) this.verify()
        }.bind(this))
    }
    gF5.inherits(GX1, QF5);
    GX1.prototype.verify = function() {
        try {
            var q = r_7(this.signature.buffer, this.algorithm, this.key.buffer),
                K = o_7(this.signature.buffer, this.encoding);
            return this.emit("done", q, K), this.emit("data", q), this.emit("end"), this.readable = !1, q
        } catch (Y) {
            this.readable = !1, this.emit("error", Y), this.emit("close")
        }
    };
    GX1.decode = o_7;
    GX1.isValid = n_7;
    GX1.verify = r_7;
    a_7.exports = GX1
})
// @from(Ln 159790, Col 4)
PY6 = R((nF5) => {
    var t_7 = U_7(),
        MY6 = s_7(),
        iF5 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
    nF5.ALGORITHMS = iF5;
    nF5.sign = t_7.sign;
    nF5.verify = MY6.verify;
    nF5.decode = MY6.decode;
    nF5.isValid = MY6.isValid;
    nF5.createSign = function(q) {
        return new t_7(q)
    };
    nF5.createVerify = function(q) {
        return new MY6(q)
    }
})