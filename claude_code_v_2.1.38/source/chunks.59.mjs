
// @from(Ln 154473, Col 0)
class j41 {
    constructor(A, q, K, Y, z) {
        this.clientId = A, this.cryptoImpl = q, this.commonLogger = K.clone(Y96, tJ1), this.staticAuthorityOptions = z, this.performanceClient = Y
    }
    getAllAccounts(A, q) {
        return this.buildTenantProfiles(this.getAccountsFilteredBy(A, q), q, A)
    }
    getAccountInfoFilteredBy(A, q) {
        if (Object.keys(A).length === 0 || Object.values(A).every((Y) => !Y)) return this.commonLogger.warning("getAccountInfoFilteredBy: Account filter is empty or invalid, returning null"), null;
        let K = this.getAllAccounts(A, q);
        if (K.length > 1) return K.sort((z) => {
            return z.idTokenClaims ? -1 : 1
        })[0];
        else if (K.length === 1) return K[0];
        else return null
    }
    getBaseAccountInfo(A, q) {
        let K = this.getAccountsFilteredBy(A, q);
        if (K.length > 0) return vX.getAccountInfo(K[0]);
        else return null
    }
    buildTenantProfiles(A, q, K) {
        return A.flatMap((Y) => {
            return this.getTenantProfilesFromAccountEntity(Y, q, K?.tenantId, K)
        })
    }
    getTenantedAccountInfoByFilter(A, q, K, Y, z) {
        let w = null,
            H;
        if (z) {
            if (!this.tenantProfileMatchesFilter(K, z)) return null
        }
        let $ = this.getIdToken(A, Y, q, K.tenantId);
        if ($) {
            if (H = MU($.secret, this.cryptoImpl.base64Decode), !this.idTokenClaimsMatchTenantProfileFilter(H, z)) return null
        }
        return w = H96(A, K, H, $?.secret), w
    }
    getTenantProfilesFromAccountEntity(A, q, K, Y) {
        let z = vX.getAccountInfo(A),
            w = z.tenantProfiles || new Map,
            H = this.getTokenKeys();
        if (K) {
            let O = w.get(K);
            if (O) w = new Map([
                [K, O]
            ]);
            else return []
        }
        let $ = [];
        return w.forEach((O) => {
            let _ = this.getTenantedAccountInfoByFilter(z, H, O, q, Y);
            if (_) $.push(_)
        }), $
    }
    tenantProfileMatchesFilter(A, q) {
        if (!!q.localAccountId && !this.matchLocalAccountIdFromTenantProfile(A, q.localAccountId)) return !1;
        if (!!q.name && A.name !== q.name) return !1;
        if (q.isHomeTenant !== void 0 && A.isHomeTenant !== q.isHomeTenant) return !1;
        return !0
    }
    idTokenClaimsMatchTenantProfileFilter(A, q) {
        if (q) {
            if (!!q.localAccountId && !this.matchLocalAccountIdFromTokenClaims(A, q.localAccountId)) return !1;
            if (!!q.loginHint && !this.matchLoginHintFromTokenClaims(A, q.loginHint)) return !1;
            if (!!q.username && !this.matchUsername(A.preferred_username, q.username)) return !1;
            if (!!q.name && !this.matchName(A, q.name)) return !1;
            if (!!q.sid && !this.matchSid(A, q.sid)) return !1
        }
        return !0
    }
    async saveCacheRecord(A, q, K, Y) {
        if (!A) throw Y8(t71);
        try {
            if (A.account) await this.setAccount(A.account, q, K);
            if (!!A.idToken && Y?.idToken !== !1) await this.setIdTokenCredential(A.idToken, q, K);
            if (!!A.accessToken && Y?.accessToken !== !1) await this.saveAccessToken(A.accessToken, q, K);
            if (!!A.refreshToken && Y?.refreshToken !== !1) await this.setRefreshTokenCredential(A.refreshToken, q, K);
            if (A.appMetadata) this.setAppMetadata(A.appMetadata, q)
        } catch (z) {
            if (this.commonLogger?.error("CacheManager.saveCacheRecord: failed"), z instanceof m3) throw z;
            else throw k$7(z)
        }
    }
    async saveAccessToken(A, q, K) {
        let Y = {
                clientId: A.clientId,
                credentialType: A.credentialType,
                environment: A.environment,
                homeAccountId: A.homeAccountId,
                realm: A.realm,
                tokenType: A.tokenType,
                requestedClaimsHash: A.requestedClaimsHash
            },
            z = this.getTokenKeys(),
            w = L_.fromString(A.target);
        z.accessToken.forEach((H) => {
            if (!this.accessTokenKeyMatchesFilter(H, Y, !1)) return;
            let $ = this.getAccessTokenCredential(H, q);
            if ($ && this.credentialMatchesFilter($, Y)) {
                if (L_.fromString($.target).intersectingScopeSets(w)) this.removeAccessToken(H, q)
            }
        }), await this.setAccessTokenCredential(A, q, K)
    }
    getAccountsFilteredBy(A, q) {
        let K = this.getAccountKeys(),
            Y = [];
        return K.forEach((z) => {
            let w = this.getAccount(z, q);
            if (!w) return;
            if (!!A.homeAccountId && !this.matchHomeAccountId(w, A.homeAccountId)) return;
            if (!!A.username && !this.matchUsername(w.username, A.username)) return;
            if (!!A.environment && !this.matchEnvironment(w, A.environment)) return;
            if (!!A.realm && !this.matchRealm(w, A.realm)) return;
            if (!!A.nativeAccountId && !this.matchNativeAccountId(w, A.nativeAccountId)) return;
            if (!!A.authorityType && !this.matchAuthorityType(w, A.authorityType)) return;
            let H = {
                    localAccountId: A?.localAccountId,
                    name: A?.name
                },
                $ = w.tenantProfiles?.filter((O) => {
                    return this.tenantProfileMatchesFilter(O, H)
                });
            if ($ && $.length === 0) return;
            Y.push(w)
        }), Y
    }
    credentialMatchesFilter(A, q) {
        if (!!q.clientId && !this.matchClientId(A, q.clientId)) return !1;
        if (!!q.userAssertionHash && !this.matchUserAssertionHash(A, q.userAssertionHash)) return !1;
        if (typeof q.homeAccountId === "string" && !this.matchHomeAccountId(A, q.homeAccountId)) return !1;
        if (!!q.environment && !this.matchEnvironment(A, q.environment)) return !1;
        if (!!q.realm && !this.matchRealm(A, q.realm)) return !1;
        if (!!q.credentialType && !this.matchCredentialType(A, q.credentialType)) return !1;
        if (!!q.familyId && !this.matchFamilyId(A, q.familyId)) return !1;
        if (!!q.target && !this.matchTarget(A, q.target)) return !1;
        if (q.requestedClaimsHash || A.requestedClaimsHash) {
            if (A.requestedClaimsHash !== q.requestedClaimsHash) return !1
        }
        if (A.credentialType === tz.ACCESS_TOKEN_WITH_AUTH_SCHEME) {
            if (!!q.tokenType && !this.matchTokenType(A, q.tokenType)) return !1;
            if (q.tokenType === b9.SSH) {
                if (q.keyId && !this.matchKeyId(A, q.keyId)) return !1
            }
        }
        return !0
    }
    getAppMetadataFilteredBy(A) {
        let q = this.getKeys(),
            K = {};
        return q.forEach((Y) => {
            if (!this.isAppMetadata(Y)) return;
            let z = this.getAppMetadata(Y);
            if (!z) return;
            if (!!A.environment && !this.matchEnvironment(z, A.environment)) return;
            if (!!A.clientId && !this.matchClientId(z, A.clientId)) return;
            K[Y] = z
        }), K
    }
    getAuthorityMetadataByAlias(A) {
        let q = this.getAuthorityMetadataKeys(),
            K = null;
        return q.forEach((Y) => {
            if (!this.isAuthorityMetadata(Y) || Y.indexOf(this.clientId) === -1) return;
            let z = this.getAuthorityMetadata(Y);
            if (!z) return;
            if (z.aliases.indexOf(A) === -1) return;
            K = z
        }), K
    }
    removeAllAccounts(A) {
        this.getAllAccounts({}, A).forEach((K) => {
            this.removeAccount(K, A)
        })
    }
    removeAccount(A, q) {
        this.removeAccountContext(A, q);
        let K = this.getAccountKeys(),
            Y = (z) => {
                return z.includes(A.homeAccountId) && z.includes(A.environment)
            };
        K.filter(Y).forEach((z) => {
            this.removeItem(z, q), this.performanceClient.incrementFields({
                accountsRemoved: 1
            }, q)
        })
    }
    removeAccountContext(A, q) {
        let K = this.getTokenKeys(),
            Y = (z) => {
                return z.includes(A.homeAccountId) && z.includes(A.environment)
            };
        K.idToken.filter(Y).forEach((z) => {
            this.removeIdToken(z, q)
        }), K.accessToken.filter(Y).forEach((z) => {
            this.removeAccessToken(z, q)
        }), K.refreshToken.filter(Y).forEach((z) => {
            this.removeRefreshToken(z, q)
        })
    }
    removeAccessToken(A, q) {
        let K = this.getAccessTokenCredential(A, q);
        if (this.removeItem(A, q), this.performanceClient.incrementFields({
                accessTokensRemoved: 1
            }, q), !K || K.credentialType.toLowerCase() !== tz.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase() || K.tokenType !== b9.POP) return;
        let Y = K.keyId;
        if (Y) this.cryptoImpl.removeTokenBindingKey(Y).catch(() => {
            this.commonLogger.error(`Failed to remove token binding key ${Y}`, q), this.performanceClient?.incrementFields({
                removeTokenBindingKeyFailure: 1
            }, q)
        })
    }
    removeAppMetadata(A) {
        return this.getKeys().forEach((K) => {
            if (this.isAppMetadata(K)) this.removeItem(K, A)
        }), !0
    }
    getIdToken(A, q, K, Y, z) {
        this.commonLogger.trace("CacheManager - getIdToken called");
        let w = {
                homeAccountId: A.homeAccountId,
                environment: A.environment,
                credentialType: tz.ID_TOKEN,
                clientId: this.clientId,
                realm: Y
            },
            H = this.getIdTokensByFilter(w, q, K),
            $ = H.size;
        if ($ < 1) return this.commonLogger.info("CacheManager:getIdToken - No token found"), null;
        else if ($ > 1) {
            let O = H;
            if (!Y) {
                let _ = new Map;
                H.forEach((X, D) => {
                    if (X.realm === A.tenantId) _.set(D, X)
                });
                let J = _.size;
                if (J < 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result"), H.values().next().value;
                else if (J === 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile"), _.values().next().value;
                else O = _
            }
            if (this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them"), O.forEach((_, J) => {
                    this.removeIdToken(J, q)
                }), z && q) z.addFields({
                multiMatchedID: H.size
            }, q);
            return null
        }
        return this.commonLogger.info("CacheManager:getIdToken - Returning ID token"), H.values().next().value
    }
    getIdTokensByFilter(A, q, K) {
        let Y = K && K.idToken || this.getTokenKeys().idToken,
            z = new Map;
        return Y.forEach((w) => {
            if (!this.idTokenKeyMatchesFilter(w, {
                    clientId: this.clientId,
                    ...A
                })) return;
            let H = this.getIdTokenCredential(w, q);
            if (H && this.credentialMatchesFilter(H, A)) z.set(w, H)
        }), z
    }
    idTokenKeyMatchesFilter(A, q) {
        let K = A.toLowerCase();
        if (q.clientId && K.indexOf(q.clientId.toLowerCase()) === -1) return !1;
        if (q.homeAccountId && K.indexOf(q.homeAccountId.toLowerCase()) === -1) return !1;
        return !0
    }
    removeIdToken(A, q) {
        this.removeItem(A, q)
    }
    removeRefreshToken(A, q) {
        this.removeItem(A, q)
    }
    getAccessToken(A, q, K, Y) {
        let z = q.correlationId;
        this.commonLogger.trace("CacheManager - getAccessToken called", z);
        let w = L_.createSearchScopes(q.scopes),
            H = q.authenticationScheme || b9.BEARER,
            $ = H && H.toLowerCase() !== b9.BEARER.toLowerCase() ? tz.ACCESS_TOKEN_WITH_AUTH_SCHEME : tz.ACCESS_TOKEN,
            O = {
                homeAccountId: A.homeAccountId,
                environment: A.environment,
                credentialType: $,
                clientId: this.clientId,
                realm: Y || A.tenantId,
                target: w,
                tokenType: H,
                keyId: q.sshKid,
                requestedClaimsHash: q.requestedClaimsHash
            },
            _ = K && K.accessToken || this.getTokenKeys().accessToken,
            J = [];
        _.forEach((D) => {
            if (this.accessTokenKeyMatchesFilter(D, O, !0)) {
                let j = this.getAccessTokenCredential(D, z);
                if (j && this.credentialMatchesFilter(j, O)) J.push(j)
            }
        });
        let X = J.length;
        if (X < 1) return this.commonLogger.info("CacheManager:getAccessToken - No token found", z), null;
        else if (X > 1) return this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them", z), J.forEach((D) => {
            this.removeAccessToken(this.generateCredentialKey(D), z)
        }), this.performanceClient.addFields({
            multiMatchedAT: J.length
        }, z), null;
        return this.commonLogger.info("CacheManager:getAccessToken - Returning access token", z), J[0]
    }
    accessTokenKeyMatchesFilter(A, q, K) {
        let Y = A.toLowerCase();
        if (q.clientId && Y.indexOf(q.clientId.toLowerCase()) === -1) return !1;
        if (q.homeAccountId && Y.indexOf(q.homeAccountId.toLowerCase()) === -1) return !1;
        if (q.realm && Y.indexOf(q.realm.toLowerCase()) === -1) return !1;
        if (q.requestedClaimsHash && Y.indexOf(q.requestedClaimsHash.toLowerCase()) === -1) return !1;
        if (q.target) {
            let z = q.target.asArray();
            for (let w = 0; w < z.length; w++)
                if (K && !Y.includes(z[w].toLowerCase())) return !1;
                else if (!K && Y.includes(z[w].toLowerCase())) return !0
        }
        return !0
    }
    getAccessTokensByFilter(A, q) {
        let K = this.getTokenKeys(),
            Y = [];
        return K.accessToken.forEach((z) => {
            if (!this.accessTokenKeyMatchesFilter(z, A, !0)) return;
            let w = this.getAccessTokenCredential(z, q);
            if (w && this.credentialMatchesFilter(w, A)) Y.push(w)
        }), Y
    }
    getRefreshToken(A, q, K, Y, z) {
        this.commonLogger.trace("CacheManager - getRefreshToken called");
        let w = q ? gr : void 0,
            H = {
                homeAccountId: A.homeAccountId,
                environment: A.environment,
                credentialType: tz.REFRESH_TOKEN,
                clientId: this.clientId,
                familyId: w
            },
            $ = Y && Y.refreshToken || this.getTokenKeys().refreshToken,
            O = [];
        $.forEach((J) => {
            if (this.refreshTokenKeyMatchesFilter(J, H)) {
                let X = this.getRefreshTokenCredential(J, K);
                if (X && this.credentialMatchesFilter(X, H)) O.push(X)
            }
        });
        let _ = O.length;
        if (_ < 1) return this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found."), null;
        if (_ > 1 && z && K) z.addFields({
            multiMatchedRT: _
        }, K);
        return this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token"), O[0]
    }
    refreshTokenKeyMatchesFilter(A, q) {
        let K = A.toLowerCase();
        if (q.familyId && K.indexOf(q.familyId.toLowerCase()) === -1) return !1;
        if (!q.familyId && q.clientId && K.indexOf(q.clientId.toLowerCase()) === -1) return !1;
        if (q.homeAccountId && K.indexOf(q.homeAccountId.toLowerCase()) === -1) return !1;
        return !0
    }
    readAppMetadataFromCache(A) {
        let q = {
                environment: A,
                clientId: this.clientId
            },
            K = this.getAppMetadataFilteredBy(q),
            Y = Object.keys(K).map((w) => K[w]),
            z = Y.length;
        if (z < 1) return null;
        else if (z > 1) throw Y8(r71);
        return Y[0]
    }
    isAppMetadataFOCI(A) {
        let q = this.readAppMetadataFromCache(A);
        return !!(q && q.familyId === gr)
    }
    matchHomeAccountId(A, q) {
        return typeof A.homeAccountId === "string" && q === A.homeAccountId
    }
    matchLocalAccountIdFromTokenClaims(A, q) {
        let K = A.oid || A.sub;
        return q === K
    }
    matchLocalAccountIdFromTenantProfile(A, q) {
        return A.localAccountId === q
    }
    matchName(A, q) {
        return q.toLowerCase() === A.name?.toLowerCase()
    }
    matchUsername(A, q) {
        return !!(A && typeof A === "string" && q?.toLowerCase() === A.toLowerCase())
    }
    matchUserAssertionHash(A, q) {
        return !!(A.userAssertionHash && q === A.userAssertionHash)
    }
    matchEnvironment(A, q) {
        if (this.staticAuthorityOptions) {
            let Y = T$7(this.staticAuthorityOptions, this.commonLogger);
            if (Y.includes(q) && Y.includes(A.environment)) return !0
        }
        let K = this.getAuthorityMetadataByAlias(q);
        if (K && K.aliases.indexOf(A.environment) > -1) return !0;
        return !1
    }
    matchCredentialType(A, q) {
        return A.credentialType && q.toLowerCase() === A.credentialType.toLowerCase()
    }
    matchClientId(A, q) {
        return !!(A.clientId && q === A.clientId)
    }
    matchFamilyId(A, q) {
        return !!(A.familyId && q === A.familyId)
    }
    matchRealm(A, q) {
        return A.realm?.toLowerCase() === q.toLowerCase()
    }
    matchNativeAccountId(A, q) {
        return !!(A.nativeAccountId && q === A.nativeAccountId)
    }
    matchLoginHintFromTokenClaims(A, q) {
        if (A.login_hint === q) return !0;
        if (A.preferred_username === q) return !0;
        if (A.upn === q) return !0;
        return !1
    }
    matchSid(A, q) {
        return A.sid === q
    }
    matchAuthorityType(A, q) {
        return !!(A.authorityType && q.toLowerCase() === A.authorityType.toLowerCase())
    }
    matchTarget(A, q) {
        if (A.credentialType !== tz.ACCESS_TOKEN && A.credentialType !== tz.ACCESS_TOKEN_WITH_AUTH_SCHEME || !A.target) return !1;
        return L_.fromString(A.target).containsScopeSet(q)
    }
    matchTokenType(A, q) {
        return !!(A.tokenType && A.tokenType === q)
    }
    matchKeyId(A, q) {
        return !!(A.keyId && A.keyId === q)
    }
    isAppMetadata(A) {
        return A.indexOf(FS1) !== -1
    }
    isAuthorityMetadata(A) {
        return A.indexOf(rJ1.CACHE_KEY) !== -1
    }
    generateAuthorityMetadataCacheKey(A) {
        return `${rJ1.CACHE_KEY}-${this.clientId}-${A}`
    }
    static toObject(A, q) {
        for (let K in q) A[K] = q[K];
        return A
    }
}
// @from(Ln 154931, Col 4)
D96
// @from(Ln 154932, Col 4)
a5A = v(() => {
    WH();
    Mh1();
    _96();
    TX();
    $96();
    YX1();
    z96();
    n5A();
    L$7();
    LL();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    D96 = class D96 extends j41 {
        async setAccount() {
            throw Y8(x5)
        }
        getAccount() {
            throw Y8(x5)
        }
        async setIdTokenCredential() {
            throw Y8(x5)
        }
        getIdTokenCredential() {
            throw Y8(x5)
        }
        async setAccessTokenCredential() {
            throw Y8(x5)
        }
        getAccessTokenCredential() {
            throw Y8(x5)
        }
        async setRefreshTokenCredential() {
            throw Y8(x5)
        }
        getRefreshTokenCredential() {
            throw Y8(x5)
        }
        setAppMetadata() {
            throw Y8(x5)
        }
        getAppMetadata() {
            throw Y8(x5)
        }
        setServerTelemetry() {
            throw Y8(x5)
        }
        getServerTelemetry() {
            throw Y8(x5)
        }
        setAuthorityMetadata() {
            throw Y8(x5)
        }
        getAuthorityMetadata() {
            throw Y8(x5)
        }
        getAuthorityMetadataKeys() {
            throw Y8(x5)
        }
        setThrottlingCache() {
            throw Y8(x5)
        }
        getThrottlingCache() {
            throw Y8(x5)
        }
        removeItem() {
            throw Y8(x5)
        }
        getKeys() {
            throw Y8(x5)
        }
        getAccountKeys() {
            throw Y8(x5)
        }
        getTokenKeys() {
            throw Y8(x5)
        }
        generateCredentialKey() {
            throw Y8(x5)
        }
        generateAccountKey() {
            throw Y8(x5)
        }
    }
})
// @from(Ln 155016, Col 4)
MA
// @from(Ln 155016, Col 8)
eC2
// @from(Ln 155016, Col 13)
R$7
// @from(Ln 155017, Col 4)
vS = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    MA = {
        AcquireTokenByCode: "acquireTokenByCode",
        AcquireTokenByRefreshToken: "acquireTokenByRefreshToken",
        AcquireTokenSilent: "acquireTokenSilent",
        AcquireTokenSilentAsync: "acquireTokenSilentAsync",
        AcquireTokenPopup: "acquireTokenPopup",
        AcquireTokenPreRedirect: "acquireTokenPreRedirect",
        AcquireTokenRedirect: "acquireTokenRedirect",
        CryptoOptsGetPublicKeyThumbprint: "cryptoOptsGetPublicKeyThumbprint",
        CryptoOptsSignJwt: "cryptoOptsSignJwt",
        SilentCacheClientAcquireToken: "silentCacheClientAcquireToken",
        SilentIframeClientAcquireToken: "silentIframeClientAcquireToken",
        AwaitConcurrentIframe: "awaitConcurrentIframe",
        SilentRefreshClientAcquireToken: "silentRefreshClientAcquireToken",
        SsoSilent: "ssoSilent",
        StandardInteractionClientGetDiscoveredAuthority: "standardInteractionClientGetDiscoveredAuthority",
        FetchAccountIdWithNativeBroker: "fetchAccountIdWithNativeBroker",
        NativeInteractionClientAcquireToken: "nativeInteractionClientAcquireToken",
        BaseClientCreateTokenRequestHeaders: "baseClientCreateTokenRequestHeaders",
        NetworkClientSendPostRequestAsync: "networkClientSendPostRequestAsync",
        RefreshTokenClientExecutePostToTokenEndpoint: "refreshTokenClientExecutePostToTokenEndpoint",
        AuthorizationCodeClientExecutePostToTokenEndpoint: "authorizationCodeClientExecutePostToTokenEndpoint",
        BrokerHandhshake: "brokerHandshake",
        AcquireTokenByRefreshTokenInBroker: "acquireTokenByRefreshTokenInBroker",
        AcquireTokenByBroker: "acquireTokenByBroker",
        RefreshTokenClientExecuteTokenRequest: "refreshTokenClientExecuteTokenRequest",
        RefreshTokenClientAcquireToken: "refreshTokenClientAcquireToken",
        RefreshTokenClientAcquireTokenWithCachedRefreshToken: "refreshTokenClientAcquireTokenWithCachedRefreshToken",
        RefreshTokenClientAcquireTokenByRefreshToken: "refreshTokenClientAcquireTokenByRefreshToken",
        RefreshTokenClientCreateTokenRequestBody: "refreshTokenClientCreateTokenRequestBody",
        AcquireTokenFromCache: "acquireTokenFromCache",
        SilentFlowClientAcquireCachedToken: "silentFlowClientAcquireCachedToken",
        SilentFlowClientGenerateResultFromCacheRecord: "silentFlowClientGenerateResultFromCacheRecord",
        AcquireTokenBySilentIframe: "acquireTokenBySilentIframe",
        InitializeBaseRequest: "initializeBaseRequest",
        InitializeSilentRequest: "initializeSilentRequest",
        InitializeClientApplication: "initializeClientApplication",
        InitializeCache: "initializeCache",
        SilentIframeClientTokenHelper: "silentIframeClientTokenHelper",
        SilentHandlerInitiateAuthRequest: "silentHandlerInitiateAuthRequest",
        SilentHandlerMonitorIframeForHash: "silentHandlerMonitorIframeForHash",
        SilentHandlerLoadFrame: "silentHandlerLoadFrame",
        SilentHandlerLoadFrameSync: "silentHandlerLoadFrameSync",
        StandardInteractionClientCreateAuthCodeClient: "standardInteractionClientCreateAuthCodeClient",
        StandardInteractionClientGetClientConfiguration: "standardInteractionClientGetClientConfiguration",
        StandardInteractionClientInitializeAuthorizationRequest: "standardInteractionClientInitializeAuthorizationRequest",
        GetAuthCodeUrl: "getAuthCodeUrl",
        GetStandardParams: "getStandardParams",
        HandleCodeResponseFromServer: "handleCodeResponseFromServer",
        HandleCodeResponse: "handleCodeResponse",
        HandleResponseEar: "handleResponseEar",
        HandleResponsePlatformBroker: "handleResponsePlatformBroker",
        HandleResponseCode: "handleResponseCode",
        UpdateTokenEndpointAuthority: "updateTokenEndpointAuthority",
        AuthClientAcquireToken: "authClientAcquireToken",
        AuthClientExecuteTokenRequest: "authClientExecuteTokenRequest",
        AuthClientCreateTokenRequestBody: "authClientCreateTokenRequestBody",
        PopTokenGenerateCnf: "popTokenGenerateCnf",
        PopTokenGenerateKid: "popTokenGenerateKid",
        HandleServerTokenResponse: "handleServerTokenResponse",
        DeserializeResponse: "deserializeResponse",
        AuthorityFactoryCreateDiscoveredInstance: "authorityFactoryCreateDiscoveredInstance",
        AuthorityResolveEndpointsAsync: "authorityResolveEndpointsAsync",
        AuthorityResolveEndpointsFromLocalSources: "authorityResolveEndpointsFromLocalSources",
        AuthorityGetCloudDiscoveryMetadataFromNetwork: "authorityGetCloudDiscoveryMetadataFromNetwork",
        AuthorityUpdateCloudDiscoveryMetadata: "authorityUpdateCloudDiscoveryMetadata",
        AuthorityGetEndpointMetadataFromNetwork: "authorityGetEndpointMetadataFromNetwork",
        AuthorityUpdateEndpointMetadata: "authorityUpdateEndpointMetadata",
        AuthorityUpdateMetadataWithRegionalInformation: "authorityUpdateMetadataWithRegionalInformation",
        RegionDiscoveryDetectRegion: "regionDiscoveryDetectRegion",
        RegionDiscoveryGetRegionFromIMDS: "regionDiscoveryGetRegionFromIMDS",
        RegionDiscoveryGetCurrentVersion: "regionDiscoveryGetCurrentVersion",
        AcquireTokenByCodeAsync: "acquireTokenByCodeAsync",
        GetEndpointMetadataFromNetwork: "getEndpointMetadataFromNetwork",
        GetCloudDiscoveryMetadataFromNetworkMeasurement: "getCloudDiscoveryMetadataFromNetworkMeasurement",
        HandleRedirectPromiseMeasurement: "handleRedirectPromise",
        HandleNativeRedirectPromiseMeasurement: "handleNativeRedirectPromise",
        UpdateCloudDiscoveryMetadataMeasurement: "updateCloudDiscoveryMetadataMeasurement",
        UsernamePasswordClientAcquireToken: "usernamePasswordClientAcquireToken",
        NativeMessageHandlerHandshake: "nativeMessageHandlerHandshake",
        NativeGenerateAuthResult: "nativeGenerateAuthResult",
        RemoveHiddenIframe: "removeHiddenIframe",
        ClearTokensAndKeysWithClaims: "clearTokensAndKeysWithClaims",
        CacheManagerGetRefreshToken: "cacheManagerGetRefreshToken",
        ImportExistingCache: "importExistingCache",
        SetUserData: "setUserData",
        LocalStorageUpdated: "localStorageUpdated",
        GeneratePkceCodes: "generatePkceCodes",
        GenerateCodeVerifier: "generateCodeVerifier",
        GenerateCodeChallengeFromVerifier: "generateCodeChallengeFromVerifier",
        Sha256Digest: "sha256Digest",
        GetRandomValues: "getRandomValues",
        GenerateHKDF: "generateHKDF",
        GenerateBaseKey: "generateBaseKey",
        Base64Decode: "base64Decode",
        UrlEncodeArr: "urlEncodeArr",
        Encrypt: "encrypt",
        Decrypt: "decrypt",
        GenerateEarKey: "generateEarKey",
        DecryptEarResponse: "decryptEarResponse"
    }, eC2 = new Map([
        [MA.AcquireTokenByCode, "ATByCode"],
        [MA.AcquireTokenByRefreshToken, "ATByRT"],
        [MA.AcquireTokenSilent, "ATS"],
        [MA.AcquireTokenSilentAsync, "ATSAsync"],
        [MA.AcquireTokenPopup, "ATPopup"],
        [MA.AcquireTokenRedirect, "ATRedirect"],
        [MA.CryptoOptsGetPublicKeyThumbprint, "CryptoGetPKThumb"],
        [MA.CryptoOptsSignJwt, "CryptoSignJwt"],
        [MA.SilentCacheClientAcquireToken, "SltCacheClientAT"],
        [MA.SilentIframeClientAcquireToken, "SltIframeClientAT"],
        [MA.SilentRefreshClientAcquireToken, "SltRClientAT"],
        [MA.SsoSilent, "SsoSlt"],
        [MA.StandardInteractionClientGetDiscoveredAuthority, "StdIntClientGetDiscAuth"],
        [MA.FetchAccountIdWithNativeBroker, "FetchAccIdWithNtvBroker"],
        [MA.NativeInteractionClientAcquireToken, "NtvIntClientAT"],
        [MA.BaseClientCreateTokenRequestHeaders, "BaseClientCreateTReqHead"],
        [MA.NetworkClientSendPostRequestAsync, "NetClientSendPost"],
        [MA.RefreshTokenClientExecutePostToTokenEndpoint, "RTClientExecPost"],
        [MA.AuthorizationCodeClientExecutePostToTokenEndpoint, "AuthCodeClientExecPost"],
        [MA.BrokerHandhshake, "BrokerHandshake"],
        [MA.AcquireTokenByRefreshTokenInBroker, "ATByRTInBroker"],
        [MA.AcquireTokenByBroker, "ATByBroker"],
        [MA.RefreshTokenClientExecuteTokenRequest, "RTClientExecTReq"],
        [MA.RefreshTokenClientAcquireToken, "RTClientAT"],
        [MA.RefreshTokenClientAcquireTokenWithCachedRefreshToken, "RTClientATWithCachedRT"],
        [MA.RefreshTokenClientAcquireTokenByRefreshToken, "RTClientATByRT"],
        [MA.RefreshTokenClientCreateTokenRequestBody, "RTClientCreateTReqBody"],
        [MA.AcquireTokenFromCache, "ATFromCache"],
        [MA.SilentFlowClientAcquireCachedToken, "SltFlowClientATCached"],
        [MA.SilentFlowClientGenerateResultFromCacheRecord, "SltFlowClientGenResFromCache"],
        [MA.AcquireTokenBySilentIframe, "ATBySltIframe"],
        [MA.InitializeBaseRequest, "InitBaseReq"],
        [MA.InitializeSilentRequest, "InitSltReq"],
        [MA.InitializeClientApplication, "InitClientApplication"],
        [MA.InitializeCache, "InitCache"],
        [MA.ImportExistingCache, "importCache"],
        [MA.SetUserData, "setUserData"],
        [MA.LocalStorageUpdated, "localStorageUpdated"],
        [MA.SilentIframeClientTokenHelper, "SIClientTHelper"],
        [MA.SilentHandlerInitiateAuthRequest, "SHandlerInitAuthReq"],
        [MA.SilentHandlerMonitorIframeForHash, "SltHandlerMonitorIframeForHash"],
        [MA.SilentHandlerLoadFrame, "SHandlerLoadFrame"],
        [MA.SilentHandlerLoadFrameSync, "SHandlerLoadFrameSync"],
        [MA.StandardInteractionClientCreateAuthCodeClient, "StdIntClientCreateAuthCodeClient"],
        [MA.StandardInteractionClientGetClientConfiguration, "StdIntClientGetClientConf"],
        [MA.StandardInteractionClientInitializeAuthorizationRequest, "StdIntClientInitAuthReq"],
        [MA.GetAuthCodeUrl, "GetAuthCodeUrl"],
        [MA.HandleCodeResponseFromServer, "HandleCodeResFromServer"],
        [MA.HandleCodeResponse, "HandleCodeResp"],
        [MA.HandleResponseEar, "HandleRespEar"],
        [MA.HandleResponseCode, "HandleRespCode"],
        [MA.HandleResponsePlatformBroker, "HandleRespPlatBroker"],
        [MA.UpdateTokenEndpointAuthority, "UpdTEndpointAuth"],
        [MA.AuthClientAcquireToken, "AuthClientAT"],
        [MA.AuthClientExecuteTokenRequest, "AuthClientExecTReq"],
        [MA.AuthClientCreateTokenRequestBody, "AuthClientCreateTReqBody"],
        [MA.PopTokenGenerateCnf, "PopTGenCnf"],
        [MA.PopTokenGenerateKid, "PopTGenKid"],
        [MA.HandleServerTokenResponse, "HandleServerTRes"],
        [MA.DeserializeResponse, "DeserializeRes"],
        [MA.AuthorityFactoryCreateDiscoveredInstance, "AuthFactCreateDiscInst"],
        [MA.AuthorityResolveEndpointsAsync, "AuthResolveEndpointsAsync"],
        [MA.AuthorityResolveEndpointsFromLocalSources, "AuthResolveEndpointsFromLocal"],
        [MA.AuthorityGetCloudDiscoveryMetadataFromNetwork, "AuthGetCDMetaFromNet"],
        [MA.AuthorityUpdateCloudDiscoveryMetadata, "AuthUpdCDMeta"],
        [MA.AuthorityGetEndpointMetadataFromNetwork, "AuthUpdCDMetaFromNet"],
        [MA.AuthorityUpdateEndpointMetadata, "AuthUpdEndpointMeta"],
        [MA.AuthorityUpdateMetadataWithRegionalInformation, "AuthUpdMetaWithRegInfo"],
        [MA.RegionDiscoveryDetectRegion, "RegDiscDetectReg"],
        [MA.RegionDiscoveryGetRegionFromIMDS, "RegDiscGetRegFromIMDS"],
        [MA.RegionDiscoveryGetCurrentVersion, "RegDiscGetCurrentVer"],
        [MA.AcquireTokenByCodeAsync, "ATByCodeAsync"],
        [MA.GetEndpointMetadataFromNetwork, "GetEndpointMetaFromNet"],
        [MA.GetCloudDiscoveryMetadataFromNetworkMeasurement, "GetCDMetaFromNet"],
        [MA.HandleRedirectPromiseMeasurement, "HandleRedirectPromise"],
        [MA.HandleNativeRedirectPromiseMeasurement, "HandleNtvRedirectPromise"],
        [MA.UpdateCloudDiscoveryMetadataMeasurement, "UpdateCDMeta"],
        [MA.UsernamePasswordClientAcquireToken, "UserPassClientAT"],
        [MA.NativeMessageHandlerHandshake, "NtvMsgHandlerHandshake"],
        [MA.NativeGenerateAuthResult, "NtvGenAuthRes"],
        [MA.RemoveHiddenIframe, "RemoveHiddenIframe"],
        [MA.ClearTokensAndKeysWithClaims, "ClearTAndKeysWithClaims"],
        [MA.CacheManagerGetRefreshToken, "CacheManagerGetRT"],
        [MA.GeneratePkceCodes, "GenPkceCodes"],
        [MA.GenerateCodeVerifier, "GenCodeVerifier"],
        [MA.GenerateCodeChallengeFromVerifier, "GenCodeChallengeFromVerifier"],
        [MA.Sha256Digest, "Sha256Digest"],
        [MA.GetRandomValues, "GetRandomValues"],
        [MA.GenerateHKDF, "genHKDF"],
        [MA.GenerateBaseKey, "genBaseKey"],
        [MA.Base64Decode, "b64Decode"],
        [MA.UrlEncodeArr, "urlEncArr"],
        [MA.Encrypt, "encrypt"],
        [MA.Decrypt, "decrypt"],
        [MA.GenerateEarKey, "genEarKey"],
        [MA.DecryptEarResponse, "decryptEarResp"]
    ]), R$7 = {
        NotStarted: 0,
        InProgress: 1,
        Completed: 2
    }
})
// @from(Ln 155222, Col 0)
class s5A {
    startMeasurement() {
        return
    }
    endMeasurement() {
        return
    }
    flushMeasurement() {
        return null
    }
}
// @from(Ln 155233, Col 0)
class zX1 {
    generateId() {
        return "callback-id"
    }
    startMeasurement(A, q) {
        return {
            end: () => null,
            discard: () => {},
            add: () => {},
            increment: () => {},
            event: {
                eventId: this.generateId(),
                status: R$7.InProgress,
                authority: "",
                libraryName: "",
                libraryVersion: "",
                clientId: "",
                name: A,
                startTimeMs: Date.now(),
                correlationId: q || ""
            },
            measurement: new s5A
        }
    }
    startPerformanceMeasurement() {
        return new s5A
    }
    calculateQueuedTime() {
        return 0
    }
    addQueueMeasurement() {
        return
    }
    setPreQueueTime() {
        return
    }
    endMeasurement() {
        return null
    }
    discardMeasurements() {
        return
    }
    removePerformanceCallback() {
        return !0
    }
    addPerformanceCallback() {
        return ""
    }
    emitEvents() {
        return
    }
    addFields() {
        return
    }
    incrementFields() {
        return
    }
    cacheEventByCorrelationId() {
        return
    }
}
// @from(Ln 155294, Col 4)
t5A = v(() => {
    vS(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 155298, Col 0)
function y$7({
    authOptions: A,
    systemOptions: q,
    loggerOptions: K,
    cacheOptions: Y,
    storageInterface: z,
    networkInterface: w,
    cryptoInterface: H,
    clientCredentials: $,
    libraryInfo: O,
    telemetry: _,
    serverTelemetryManager: J,
    persistencePlugin: X,
    serializableCache: D
}) {
    let j = {
        ...cu5,
        ...K
    };
    return {
        authOptions: su5(A),
        systemOptions: {
            ...du5,
            ...q
        },
        loggerOptions: j,
        cacheOptions: {
            ...lu5,
            ...Y
        },
        storageInterface: z || new D96(A.clientId, sJ1, new yV(j), new zX1),
        networkInterface: w || iu5,
        cryptoInterface: H || sJ1,
        clientCredentials: $ || ru5,
        libraryInfo: {
            ...nu5,
            ...O
        },
        telemetry: {
            ...au5,
            ..._
        },
        serverTelemetryManager: J || null,
        persistencePlugin: X || null,
        serializableCache: D || null
    }
}
// @from(Ln 155346, Col 0)
function su5(A) {
    return {
        clientCapabilities: [],
        azureCloudOptions: ou5,
        skipAuthorityMetadataCache: !1,
        instanceAware: !1,
        encodeExtraQueryParams: !1,
        ...A
    }
}
// @from(Ln 155357, Col 0)
function j96(A) {
    return A.authOptions.authority.options.protocolMode === fW.OIDC
}
// @from(Ln 155360, Col 4)
du5
// @from(Ln 155360, Col 9)
cu5
// @from(Ln 155360, Col 14)
lu5
// @from(Ln 155360, Col 19)
iu5
// @from(Ln 155360, Col 24)
nu5
// @from(Ln 155360, Col 29)
ru5
// @from(Ln 155360, Col 34)
ou5
// @from(Ln 155360, Col 39)
au5
// @from(Ln 155361, Col 4)
M96 = v(() => {
    F5A();
    K96();
    WH();
    z96();
    w96();
    a5A();
    Wh1();
    TX();
    t5A();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    du5 = {
        tokenRenewalOffsetSeconds: oJ1,
        preventCorsPreflight: !1
    }, cu5 = {
        loggerCallback: () => {},
        piiLoggingEnabled: !1,
        logLevel: mO.Info,
        correlationId: uA.EMPTY_STRING
    }, lu5 = {
        claimsBasedCachingEnabled: !1
    }, iu5 = {
        async sendGetRequestAsync() {
            throw Y8(x5)
        },
        async sendPostRequestAsync() {
            throw Y8(x5)
        }
    }, nu5 = {
        sku: uA.SKU,
        version: tJ1,
        cpu: uA.EMPTY_STRING,
        os: uA.EMPTY_STRING
    }, ru5 = {
        clientSecret: uA.EMPTY_STRING,
        clientAssertion: void 0
    }, ou5 = {
        azureCloudInstance: XU.None,
        tenant: `${uA.DEFAULT_COMMON_TENANT}`
    }, au5 = {
        application: {
            appName: "",
            appVersion: ""
        }
    }
})
// @from(Ln 155407, Col 4)
oG
// @from(Ln 155408, Col 4)
Vh1 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    oG = {
        HOME_ACCOUNT_ID: "home_account_id",
        UPN: "UPN"
    }
})
// @from(Ln 155415, Col 4)
M41 = {}
// @from(Ln 155476, Col 4)
bu = "client_id"
// @from(Ln 155477, Col 4)
P96 = "redirect_uri"
// @from(Ln 155478, Col 4)
e5A = "response_type"
// @from(Ln 155479, Col 4)
A9A = "response_mode"
// @from(Ln 155480, Col 4)
q9A = "grant_type"
// @from(Ln 155481, Col 4)
K9A = "claims"
// @from(Ln 155482, Col 4)
Y9A = "scope"
// @from(Ln 155483, Col 4)
tu5 = "error"
// @from(Ln 155484, Col 4)
eu5 = "error_description"
// @from(Ln 155485, Col 4)
AB5 = "access_token"
// @from(Ln 155486, Col 4)
qB5 = "id_token"
// @from(Ln 155487, Col 4)
z9A = "refresh_token"
// @from(Ln 155488, Col 4)
KB5 = "expires_in"
// @from(Ln 155489, Col 4)
YB5 = "refresh_token_expires_in"
// @from(Ln 155490, Col 4)
w9A = "state"
// @from(Ln 155491, Col 4)
H9A = "nonce"
// @from(Ln 155492, Col 4)
$9A = "prompt"
// @from(Ln 155493, Col 4)
zB5 = "session_state"
// @from(Ln 155494, Col 4)
wB5 = "client_info"
// @from(Ln 155495, Col 4)
O9A = "code"
// @from(Ln 155496, Col 4)
_9A = "code_challenge"
// @from(Ln 155497, Col 4)
J9A = "code_challenge_method"
// @from(Ln 155498, Col 4)
X9A = "code_verifier"
// @from(Ln 155499, Col 4)
D9A = "client-request-id"
// @from(Ln 155500, Col 4)
j9A = "x-client-SKU"
// @from(Ln 155501, Col 4)
M9A = "x-client-VER"
// @from(Ln 155502, Col 4)
P9A = "x-client-OS"
// @from(Ln 155503, Col 4)
W9A = "x-client-CPU"
// @from(Ln 155504, Col 4)
G9A = "x-client-current-telemetry"
// @from(Ln 155505, Col 4)
Z9A = "x-client-last-telemetry"
// @from(Ln 155506, Col 4)
f9A = "x-ms-lib-capability"
// @from(Ln 155507, Col 4)
V9A = "x-app-name"
// @from(Ln 155508, Col 4)
N9A = "x-app-ver"
// @from(Ln 155509, Col 4)
T9A = "post_logout_redirect_uri"
// @from(Ln 155510, Col 4)
v9A = "id_token_hint"
// @from(Ln 155511, Col 4)
E9A = "device_code"
// @from(Ln 155512, Col 4)
k9A = "client_secret"
// @from(Ln 155513, Col 4)
L9A = "client_assertion"
// @from(Ln 155514, Col 4)
R9A = "client_assertion_type"
// @from(Ln 155515, Col 4)
W96 = "token_type"
// @from(Ln 155516, Col 4)
G96 = "req_cnf"
// @from(Ln 155517, Col 4)
y9A = "assertion"
// @from(Ln 155518, Col 4)
C9A = "requested_token_use"
// @from(Ln 155519, Col 4)
HB5 = "on_behalf_of"
// @from(Ln 155520, Col 4)
$B5 = "foci"
// @from(Ln 155521, Col 4)
OB5 = "X-AnchorMailbox"
// @from(Ln 155522, Col 4)
Z96 = "return_spa_code"
// @from(Ln 155523, Col 4)
S9A = "nativebroker"
// @from(Ln 155524, Col 4)
h9A = "logout_hint"
// @from(Ln 155525, Col 4)
I9A = "sid"
// @from(Ln 155526, Col 4)
x9A = "login_hint"
// @from(Ln 155527, Col 4)
b9A = "domain_hint"
// @from(Ln 155528, Col 4)
_B5 = "x-client-xtra-sku"
// @from(Ln 155529, Col 4)
Nh1 = "brk_client_id"
// @from(Ln 155530, Col 4)
f96 = "brk_redirect_uri"
// @from(Ln 155531, Col 4)
wX1 = "instance_aware"
// @from(Ln 155532, Col 4)
u9A = "ear_jwk"
// @from(Ln 155533, Col 4)
B9A = "ear_jwe_crypto"
// @from(Ln 155534, Col 4)
HX1 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 155536, Col 4)
$4 = {}
// @from(Ln 155586, Col 0)
function P41(A, q, K) {
    if (!q) return;
    let Y = A.get(bu);
    if (Y && A.has(Nh1)) K?.addFields({
        embeddedClientId: Y,
        embeddedRedirectUri: A.get(P96)
    }, q)
}
// @from(Ln 155595, Col 0)
function JB5(A, q) {
    A.set(e5A, q)
}
// @from(Ln 155599, Col 0)
function m9A(A, q) {
    A.set(A9A, q ? q : Cu.QUERY)
}
// @from(Ln 155603, Col 0)
function XB5(A) {
    A.set(S9A, "1")
}
// @from(Ln 155607, Col 0)
function W41(A, q, K = !0, Y = ZW) {
    if (K && !Y.includes("openid") && !q.includes("openid")) Y.push("openid");
    let z = K ? [...q || [], ...Y] : q || [],
        w = new L_(z);
    A.set(Y9A, w.printScopes())
}
// @from(Ln 155614, Col 0)
function G41(A, q) {
    A.set(bu, q)
}
// @from(Ln 155618, Col 0)
function Z41(A, q) {
    A.set(P96, q)
}
// @from(Ln 155622, Col 0)
function F9A(A, q) {
    A.set(T9A, q)
}
// @from(Ln 155626, Col 0)
function Q9A(A, q) {
    A.set(v9A, q)
}
// @from(Ln 155630, Col 0)
function g9A(A, q) {
    A.set(b9A, q)
}
// @from(Ln 155634, Col 0)
function $X1(A, q) {
    A.set(x9A, q)
}
// @from(Ln 155638, Col 0)
function tr(A, q) {
    A.set(PH.CCS_HEADER, `UPN:${q}`)
}
// @from(Ln 155642, Col 0)
function PU(A, q) {
    A.set(PH.CCS_HEADER, `Oid:${q.uid}@${q.utid}`)
}
// @from(Ln 155646, Col 0)
function V96(A, q) {
    A.set(I9A, q)
}
// @from(Ln 155650, Col 0)
function f41(A, q, K) {
    let Y = C$7(q, K);
    try {
        JSON.parse(Y)
    } catch (z) {
        throw Aw(nr)
    }
    A.set(K9A, Y)
}
// @from(Ln 155660, Col 0)
function V41(A, q) {
    A.set(D9A, q)
}
// @from(Ln 155664, Col 0)
function Th1(A, q) {
    if (A.set(j9A, q.sku), A.set(M9A, q.version), q.os) A.set(P9A, q.os);
    if (q.cpu) A.set(W9A, q.cpu)
}
// @from(Ln 155669, Col 0)
function vh1(A, q) {
    if (q?.appName) A.set(V9A, q.appName);
    if (q?.appVersion) A.set(N9A, q.appVersion)
}
// @from(Ln 155674, Col 0)
function U9A(A, q) {
    A.set($9A, q)
}
// @from(Ln 155678, Col 0)
function Eh1(A, q) {
    if (q) A.set(w9A, q)
}
// @from(Ln 155682, Col 0)
function p9A(A, q) {
    A.set(H9A, q)
}
// @from(Ln 155686, Col 0)
function DB5(A, q, K) {
    if (q && K) A.set(_9A, q), A.set(J9A, K);
    else throw Aw(_41)
}
// @from(Ln 155691, Col 0)
function d9A(A, q) {
    A.set(O9A, q)
}
// @from(Ln 155695, Col 0)
function jB5(A, q) {
    A.set(E9A, q)
}
// @from(Ln 155699, Col 0)
function c9A(A, q) {
    A.set(z9A, q)
}
// @from(Ln 155703, Col 0)
function l9A(A, q) {
    A.set(X9A, q)
}
// @from(Ln 155707, Col 0)
function kh1(A, q) {
    A.set(k9A, q)
}
// @from(Ln 155711, Col 0)
function Lh1(A, q) {
    if (q) A.set(L9A, q)
}
// @from(Ln 155715, Col 0)
function Rh1(A, q) {
    if (q) A.set(R9A, q)
}
// @from(Ln 155719, Col 0)
function MB5(A, q) {
    A.set(y9A, q)
}
// @from(Ln 155723, Col 0)
function PB5(A, q) {
    A.set(C9A, q)
}
// @from(Ln 155727, Col 0)
function yh1(A, q) {
    A.set(q9A, q)
}
// @from(Ln 155731, Col 0)
function N41(A) {
    A.set(P$7, "1")
}
// @from(Ln 155735, Col 0)
function Ch1(A) {
    if (!A.has(wX1)) A.set(wX1, "true")
}
// @from(Ln 155739, Col 0)
function WU(A, q) {
    Object.entries(q).forEach(([K, Y]) => {
        if (!A.has(K) && Y) A.set(K, Y)
    })
}
// @from(Ln 155745, Col 0)
function C$7(A, q) {
    let K;
    if (!A) K = {};
    else try {
        K = JSON.parse(A)
    } catch (Y) {
        throw Aw(nr)
    }
    if (q && q.length > 0) {
        if (!K.hasOwnProperty(m71.ACCESS_TOKEN)) K[m71.ACCESS_TOKEN] = {};
        K[m71.ACCESS_TOKEN][m71.XMS_CC] = {
            values: q
        }
    }
    return JSON.stringify(K)
}
// @from(Ln 155762, Col 0)
function WB5(A, q) {
    A.set(gS1.username, q)
}
// @from(Ln 155766, Col 0)
function GB5(A, q) {
    A.set(gS1.password, q)
}
// @from(Ln 155770, Col 0)
function Sh1(A, q) {
    if (q) A.set(W96, b9.POP), A.set(G96, q)
}
// @from(Ln 155774, Col 0)
function hh1(A, q) {
    if (q) A.set(W96, b9.SSH), A.set(G96, q)
}
// @from(Ln 155778, Col 0)
function Ih1(A, q) {
    A.set(G9A, q.generateCurrentRequestHeaderValue()), A.set(Z9A, q.generateLastRequestHeaderValue())
}
// @from(Ln 155782, Col 0)
function xh1(A) {
    A.set(f9A, Su.X_MS_LIB_CAPABILITY_VALUE)
}
// @from(Ln 155786, Col 0)
function i9A(A, q) {
    A.set(h9A, q)
}
// @from(Ln 155790, Col 0)
function GU(A, q, K) {
    if (!A.has(Nh1)) A.set(Nh1, q);
    if (!A.has(f96)) A.set(f96, K)
}
// @from(Ln 155795, Col 0)
function ZB5(A, q) {
    A.set(u9A, encodeURIComponent(q));
    let K = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0";
    A.set(B9A, K)
}
// @from(Ln 155801, Col 0)
function fB5(A, q) {
    Object.entries(q).forEach(([K, Y]) => {
        if (Y) A.set(K, Y)
    })
}
// @from(Ln 155806, Col 4)
OX1 = v(() => {
    WH();
    HX1();
    Mh1();
    or();
    jU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 155814, Col 0)
function S$7(A) {
    return A.hasOwnProperty("authorization_endpoint") && A.hasOwnProperty("token_endpoint") && A.hasOwnProperty("issuer") && A.hasOwnProperty("jwks_uri")
}
// @from(Ln 155817, Col 4)
h$7 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 155820, Col 0)
function I$7(A) {
    return A.hasOwnProperty("tenant_discovery_endpoint") && A.hasOwnProperty("metadata")
}
// @from(Ln 155823, Col 4)
x$7 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 155826, Col 0)
function b$7(A) {
    return A.hasOwnProperty("error") && A.hasOwnProperty("error_description")
}
// @from(Ln 155829, Col 4)
u$7 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 155831, Col 4)
B$7 = (A, q, K, Y, z) => {
        return (...w) => {
            K.trace(`Executing function ${q}`);
            let H = Y?.startMeasurement(q, z);
            if (z) {
                let $ = q + "CallCount";
                Y?.incrementFields({
                    [$]: 1
                }, z)
            }
            try {
                let $ = A(...w);
                return H?.end({
                    success: !0
                }), K.trace(`Returning result from ${q}`), $
            } catch ($) {
                K.trace(`Error occurred in ${q}`);
                try {
                    K.trace(JSON.stringify($))
                } catch (O) {
                    K.trace("Unable to print error message.")
                }
                throw H?.end({
                    success: !1
                }, $), $
            }
        }
    }
// @from(Ln 155859, Col 4)
AY = (A, q, K, Y, z) => {
        return (...w) => {
            K.trace(`Executing function ${q}`);
            let H = Y?.startMeasurement(q, z);
            if (z) {
                let $ = q + "CallCount";
                Y?.incrementFields({
                    [$]: 1
                }, z)
            }
            return Y?.setPreQueueTime(q, z), A(...w).then(($) => {
                return K.trace(`Returning result from ${q}`), H?.end({
                    success: !0
                }), $
            }).catch(($) => {
                K.trace(`Error occurred in ${q}`);
                try {
                    K.trace(JSON.stringify($))
                } catch (O) {
                    K.trace("Unable to print error message.")
                }
                throw H?.end({
                    success: !1
                }, $), $
            })
        }
    }
// @from(Ln 155886, Col 4)
ZU = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 155888, Col 0)
class bh1 {
    constructor(A, q, K, Y) {
        this.networkInterface = A, this.logger = q, this.performanceClient = K, this.correlationId = Y
    }
    async detectRegion(A, q) {
        this.performanceClient?.addQueueMeasurement(MA.RegionDiscoveryDetectRegion, this.correlationId);
        let K = A;
        if (!K) {
            let Y = bh1.IMDS_OPTIONS;
            try {
                let z = await AY(this.getRegionFromIMDS.bind(this), MA.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(uA.IMDS_VERSION, Y);
                if (z.status === B3.SUCCESS) K = z.body, q.region_source = Q71.IMDS;
                if (z.status === B3.BAD_REQUEST) {
                    let w = await AY(this.getCurrentVersion.bind(this), MA.RegionDiscoveryGetCurrentVersion, this.logger, this.performanceClient, this.correlationId)(Y);
                    if (!w) return q.region_source = Q71.FAILED_AUTO_DETECTION, null;
                    let H = await AY(this.getRegionFromIMDS.bind(this), MA.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(w, Y);
                    if (H.status === B3.SUCCESS) K = H.body, q.region_source = Q71.IMDS
                }
            } catch (z) {
                return q.region_source = Q71.FAILED_AUTO_DETECTION, null
            }
        } else q.region_source = Q71.ENVIRONMENT_VARIABLE;
        if (!K) q.region_source = Q71.FAILED_AUTO_DETECTION;
        return K || null
    }
    async getRegionFromIMDS(A, q) {
        return this.performanceClient?.addQueueMeasurement(MA.RegionDiscoveryGetRegionFromIMDS, this.correlationId), this.networkInterface.sendGetRequestAsync(`${uA.IMDS_ENDPOINT}?api-version=${A}&format=text`, q, uA.IMDS_TIMEOUT)
    }
    async getCurrentVersion(A) {
        this.performanceClient?.addQueueMeasurement(MA.RegionDiscoveryGetCurrentVersion, this.correlationId);
        try {
            let q = await this.networkInterface.sendGetRequestAsync(`${uA.IMDS_ENDPOINT}?format=json`, A);
            if (q.status === B3.BAD_REQUEST && q.body && q.body["newest-versions"] && q.body["newest-versions"].length > 0) return q.body["newest-versions"][0];
            return null
        } catch (q) {
            return null
        }
    }
}
// @from(Ln 155927, Col 4)
m$7 = v(() => {
    WH();
    vS();
    ZU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    bh1.IMDS_OPTIONS = {
        headers: {
            Metadata: "true"
        }
    }
})
// @from(Ln 155937, Col 4)
oH = {}
// @from(Ln 155948, Col 0)
function Ov() {
    return Math.round(new Date().getTime() / 1000)
}
// @from(Ln 155952, Col 0)
function VB5(A) {
    return A.getTime() / 1000
}
// @from(Ln 155956, Col 0)
function uh1(A) {
    if (A) return new Date(Number(A) * 1000);
    return new Date
}
// @from(Ln 155961, Col 0)
function _X1(A, q) {
    let K = Number(A) || 0;
    return Ov() + q > K
}
// @from(Ln 155966, Col 0)
function NB5(A, q) {
    let K = Number(A) + q * 24 * 60 * 60 * 1000;
    return Date.now() > K
}
// @from(Ln 155971, Col 0)
function n9A(A) {
    return Number(A) > Ov()
}
// @from(Ln 155975, Col 0)
function TB5(A, q) {
    return new Promise((K) => setTimeout(() => K(q), A))
}
// @from(Ln 155978, Col 4)
er = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 155980, Col 4)
aG = {}
// @from(Ln 156000, Col 0)
function r9A(A, q, K, Y, z) {
    return {
        credentialType: tz.ID_TOKEN,
        homeAccountId: A,
        environment: q,
        clientId: Y,
        secret: K,
        realm: z,
        lastUpdatedAt: Date.now().toString()
    }
}
// @from(Ln 156012, Col 0)
function o9A(A, q, K, Y, z, w, H, $, O, _, J, X, D, j, M) {
    let P = {
        homeAccountId: A,
        credentialType: tz.ACCESS_TOKEN,
        secret: K,
        cachedAt: Ov().toString(),
        expiresOn: H.toString(),
        extendedExpiresOn: $.toString(),
        environment: q,
        clientId: Y,
        realm: z,
        target: w,
        tokenType: J || b9.BEARER,
        lastUpdatedAt: Date.now().toString()
    };
    if (X) P.userAssertionHash = X;
    if (_) P.refreshOn = _.toString();
    if (j) P.requestedClaims = j, P.requestedClaimsHash = M;
    if (P.tokenType?.toLowerCase() !== b9.BEARER.toLowerCase()) switch (P.credentialType = tz.ACCESS_TOKEN_WITH_AUTH_SCHEME, P.tokenType) {
        case b9.POP:
            let W = MU(K, O);
            if (!W?.cnf?.kid) throw Y8(e71);
            P.keyId = W.cnf.kid;
            break;
        case b9.SSH:
            P.keyId = D
    }
    return P
}
// @from(Ln 156042, Col 0)
function a9A(A, q, K, Y, z, w, H) {
    let $ = {
        credentialType: tz.REFRESH_TOKEN,
        homeAccountId: A,
        environment: q,
        clientId: Y,
        secret: K,
        lastUpdatedAt: Date.now().toString()
    };
    if (w) $.userAssertionHash = w;
    if (z) $.familyId = z;
    if (H) $.expiresOn = H.toString();
    return $
}
// @from(Ln 156057, Col 0)
function N96(A) {
    return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("credentialType") && A.hasOwnProperty("clientId") && A.hasOwnProperty("secret")
}
// @from(Ln 156061, Col 0)
function vB5(A) {
    if (!A) return !1;
    return N96(A) && A.hasOwnProperty("realm") && A.hasOwnProperty("target") && (A.credentialType === tz.ACCESS_TOKEN || A.credentialType === tz.ACCESS_TOKEN_WITH_AUTH_SCHEME)
}
// @from(Ln 156066, Col 0)
function EB5(A) {
    if (!A) return !1;
    return N96(A) && A.hasOwnProperty("realm") && A.credentialType === tz.ID_TOKEN
}
// @from(Ln 156071, Col 0)
function kB5(A) {
    if (!A) return !1;
    return N96(A) && A.credentialType === tz.REFRESH_TOKEN
}
// @from(Ln 156076, Col 0)
function LB5(A, q) {
    let K = A.indexOf(BD.CACHE_KEY) === 0,
        Y = !0;
    if (q) Y = q.hasOwnProperty("failedRequests") && q.hasOwnProperty("errors") && q.hasOwnProperty("cacheHits");
    return K && Y
}
// @from(Ln 156083, Col 0)
function RB5(A, q) {
    let K = !1;
    if (A) K = A.indexOf(Su.THROTTLING_PREFIX) === 0;
    let Y = !0;
    if (q) Y = q.hasOwnProperty("throttleTime");
    return K && Y
}
// @from(Ln 156091, Col 0)
function yB5({
    environment: A,
    clientId: q
}) {
    return [FS1, A, q].join(HU.CACHE_KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 156098, Col 0)
function CB5(A, q) {
    if (!q) return !1;
    return A.indexOf(FS1) === 0 && q.hasOwnProperty("clientId") && q.hasOwnProperty("environment")
}
// @from(Ln 156103, Col 0)
function SB5(A, q) {
    if (!q) return !1;
    return A.indexOf(rJ1.CACHE_KEY) === 0 && q.hasOwnProperty("aliases") && q.hasOwnProperty("preferred_cache") && q.hasOwnProperty("preferred_network") && q.hasOwnProperty("canonical_authority") && q.hasOwnProperty("authorization_endpoint") && q.hasOwnProperty("token_endpoint") && q.hasOwnProperty("issuer") && q.hasOwnProperty("aliasesFromNetwork") && q.hasOwnProperty("endpointsFromNetwork") && q.hasOwnProperty("expiresAt") && q.hasOwnProperty("jwks_uri")
}
// @from(Ln 156108, Col 0)
function T96() {
    return Ov() + rJ1.REFRESH_TIME_SECONDS
}
// @from(Ln 156112, Col 0)
function JX1(A, q, K) {
    A.authorization_endpoint = q.authorization_endpoint, A.token_endpoint = q.token_endpoint, A.end_session_endpoint = q.end_session_endpoint, A.issuer = q.issuer, A.endpointsFromNetwork = K, A.jwks_uri = q.jwks_uri
}
// @from(Ln 156116, Col 0)
function Bh1(A, q, K) {
    A.aliases = q.aliases, A.preferred_cache = q.preferred_cache, A.preferred_network = q.preferred_network, A.aliasesFromNetwork = K
}
// @from(Ln 156120, Col 0)
function v96(A) {
    return A.expiresAt <= Ov()
}
// @from(Ln 156123, Col 4)
E96 = v(() => {
    YX1();
    TX();
    WH();
    er();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 156130, Col 0)
class mD {
    constructor(A, q, K, Y, z, w, H, $) {
        this.canonicalAuthority = A, this._canonicalAuthority.validateAsUri(), this.networkInterface = q, this.cacheManager = K, this.authorityOptions = Y, this.regionDiscoveryMetadata = {
            region_used: void 0,
            region_source: void 0,
            region_outcome: void 0
        }, this.logger = z, this.performanceClient = H, this.correlationId = w, this.managedIdentity = $ || !1, this.regionDiscovery = new bh1(q, this.logger, this.performanceClient, this.correlationId)
    }
    getAuthorityType(A) {
        if (A.HostNameAndPort.endsWith(uA.CIAM_AUTH_URL)) return RL.Ciam;
        let q = A.PathSegments;
        if (q.length) switch (q[0].toLowerCase()) {
            case uA.ADFS:
                return RL.Adfs;
            case uA.DSTS:
                return RL.Dsts
        }
        return RL.Default
    }
    get authorityType() {
        return this.getAuthorityType(this.canonicalAuthorityUrlComponents)
    }
    get protocolMode() {
        return this.authorityOptions.protocolMode
    }
    get options() {
        return this.authorityOptions
    }
    get canonicalAuthority() {
        return this._canonicalAuthority.urlString
    }
    set canonicalAuthority(A) {
        this._canonicalAuthority = new A5(A), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null
    }
    get canonicalAuthorityUrlComponents() {
        if (!this._canonicalAuthorityUrlComponents) this._canonicalAuthorityUrlComponents = this._canonicalAuthority.getUrlComponents();
        return this._canonicalAuthorityUrlComponents
    }
    get hostnameAndPort() {
        return this.canonicalAuthorityUrlComponents.HostNameAndPort.toLowerCase()
    }
    get tenant() {
        return this.canonicalAuthorityUrlComponents.PathSegments[0]
    }
    get authorizationEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.authorization_endpoint);
        else throw Y8(rG)
    }
    get tokenEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint);
        else throw Y8(rG)
    }
    get deviceCodeEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
        else throw Y8(rG)
    }
    get endSessionEndpoint() {
        if (this.discoveryComplete()) {
            if (!this.metadata.end_session_endpoint) throw Y8(q41);
            return this.replacePath(this.metadata.end_session_endpoint)
        } else throw Y8(rG)
    }
    get selfSignedJwtAudience() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.issuer);
        else throw Y8(rG)
    }
    get jwksUri() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.jwks_uri);
        else throw Y8(rG)
    }
    canReplaceTenant(A) {
        return A.PathSegments.length === 1 && !mD.reservedTenantDomains.has(A.PathSegments[0]) && this.getAuthorityType(A) === RL.Default && this.protocolMode !== fW.OIDC
    }
    replaceTenant(A) {
        return A.replace(/{tenant}|{tenantid}/g, this.tenant)
    }
    replacePath(A) {
        let q = A,
            Y = new A5(this.metadata.canonical_authority).getUrlComponents(),
            z = Y.PathSegments;
        return this.canonicalAuthorityUrlComponents.PathSegments.forEach((H, $) => {
            let O = z[$];
            if ($ === 0 && this.canReplaceTenant(Y)) {
                let _ = new A5(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
                if (O !== _) this.logger.verbose(`Replacing tenant domain name ${O} with id ${_}`), O = _
            }
            if (H !== O) q = q.replace(`/${O}/`, `/${H}/`)
        }), this.replaceTenant(q)
    }
    get defaultOpenIdConfigurationEndpoint() {
        let A = this.hostnameAndPort;
        if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === RL.Adfs || this.protocolMode === fW.OIDC && !this.isAliasOfKnownMicrosoftAuthority(A)) return `${this.canonicalAuthority}.well-known/openid-configuration`;
        return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`
    }
    discoveryComplete() {
        return !!this.metadata
    }
    async resolveEndpointsAsync() {
        this.performanceClient?.addQueueMeasurement(MA.AuthorityResolveEndpointsAsync, this.correlationId);
        let A = this.getCurrentMetadataEntity(),
            q = await AY(this.updateCloudDiscoveryMetadata.bind(this), MA.AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(A);
        this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, A.preferred_network);
        let K = await AY(this.updateEndpointMetadata.bind(this), MA.AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(A);
        this.updateCachedMetadata(A, q, {
            source: K
        }), this.performanceClient?.addFields({
            cloudDiscoverySource: q,
            authorityEndpointSource: K
        }, this.correlationId)
    }
    getCurrentMetadataEntity() {
        let A = this.cacheManager.getAuthorityMetadataByAlias(this.hostnameAndPort);
        if (!A) A = {
            aliases: [],
            preferred_cache: this.hostnameAndPort,
            preferred_network: this.hostnameAndPort,
            canonical_authority: this.canonicalAuthority,
            authorization_endpoint: "",
            token_endpoint: "",
            end_session_endpoint: "",
            issuer: "",
            aliasesFromNetwork: !1,
            endpointsFromNetwork: !1,
            expiresAt: T96(),
            jwks_uri: ""
        };
        return A
    }
    updateCachedMetadata(A, q, K) {
        if (q !== nG.CACHE && K?.source !== nG.CACHE) A.expiresAt = T96(), A.canonical_authority = this.canonicalAuthority;
        let Y = this.cacheManager.generateAuthorityMetadataCacheKey(A.preferred_cache);
        this.cacheManager.setAuthorityMetadata(Y, A), this.metadata = A
    }
    async updateEndpointMetadata(A) {
        this.performanceClient?.addQueueMeasurement(MA.AuthorityUpdateEndpointMetadata, this.correlationId);
        let q = this.updateEndpointMetadataFromLocalSources(A);
        if (q) {
            if (q.source === nG.HARDCODED_VALUES) {
                if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
                    if (q.metadata) {
                        let Y = await AY(this.updateMetadataWithRegionalInformation.bind(this), MA.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(q.metadata);
                        JX1(A, Y, !1), A.canonical_authority = this.canonicalAuthority
                    }
                }
            }
            return q.source
        }
        let K = await AY(this.getEndpointMetadataFromNetwork.bind(this), MA.AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
        if (K) {
            if (this.authorityOptions.azureRegionConfiguration?.azureRegion) K = await AY(this.updateMetadataWithRegionalInformation.bind(this), MA.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(K);
            return JX1(A, K, !0), nG.NETWORK
        } else throw Y8(d71, this.defaultOpenIdConfigurationEndpoint)
    }
    updateEndpointMetadataFromLocalSources(A) {
        this.logger.verbose("Attempting to get endpoint metadata from authority configuration");
        let q = this.getEndpointMetadataFromConfig();
        if (q) return this.logger.verbose("Found endpoint metadata in authority configuration"), JX1(A, q, !1), {
            source: nG.CONFIG
        };
        if (this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."), this.authorityOptions.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");
        else {
            let Y = this.getEndpointMetadataFromHardcodedValues();
            if (Y) return JX1(A, Y, !1), {
                source: nG.HARDCODED_VALUES,
                metadata: Y
            };
            else this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")
        }
        let K = v96(A);
        if (this.isAuthoritySameType(A) && A.endpointsFromNetwork && !K) return this.logger.verbose("Found endpoint metadata in the cache."), {
            source: nG.CACHE
        };
        else if (K) this.logger.verbose("The metadata entity is expired.");
        return null
    }
    isAuthoritySameType(A) {
        return new A5(A.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length
    }
    getEndpointMetadataFromConfig() {
        if (this.authorityOptions.authorityMetadata) try {
            return JSON.parse(this.authorityOptions.authorityMetadata)
        } catch (A) {
            throw Aw(J41)
        }
        return null
    }
    async getEndpointMetadataFromNetwork() {
        this.performanceClient?.addQueueMeasurement(MA.AuthorityGetEndpointMetadataFromNetwork, this.correlationId);
        let A = {},
            q = this.defaultOpenIdConfigurationEndpoint;
        this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${q}`);
        try {
            let K = await this.networkInterface.sendGetRequestAsync(q, A);
            if (S$7(K.body)) return K.body;
            else return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"), null
        } catch (K) {
            return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${K}`), null
        }
    }
    getEndpointMetadataFromHardcodedValues() {
        if (this.hostnameAndPort in c5A) return c5A[this.hostnameAndPort];
        return null
    }
    async updateMetadataWithRegionalInformation(A) {
        this.performanceClient?.addQueueMeasurement(MA.AuthorityUpdateMetadataWithRegionalInformation, this.correlationId);
        let q = this.authorityOptions.azureRegionConfiguration?.azureRegion;
        if (q) {
            if (q !== uA.AZURE_REGION_AUTO_DISCOVER_FLAG) return this.regionDiscoveryMetadata.region_outcome = A96.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = q, mD.replaceWithRegionalInformation(A, q);
            let K = await AY(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), MA.RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
            if (K) return this.regionDiscoveryMetadata.region_outcome = A96.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = K, mD.replaceWithRegionalInformation(A, K);
            this.regionDiscoveryMetadata.region_outcome = A96.AUTO_DETECTION_REQUESTED_FAILED
        }
        return A
    }
    async updateCloudDiscoveryMetadata(A) {
        this.performanceClient?.addQueueMeasurement(MA.AuthorityUpdateCloudDiscoveryMetadata, this.correlationId);
        let q = this.updateCloudDiscoveryMetadataFromLocalSources(A);
        if (q) return q;
        let K = await AY(this.getCloudDiscoveryMetadataFromNetwork.bind(this), MA.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
        if (K) return Bh1(A, K, !0), nG.NETWORK;
        throw Aw(X41)
    }
    updateCloudDiscoveryMetadataFromLocalSources(A) {
        this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"), this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||uA.NOT_APPLICABLE}`), this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||uA.NOT_APPLICABLE}`), this.logger.verbosePii(`Canonical Authority: ${A.canonical_authority||uA.NOT_APPLICABLE}`);
        let q = this.getCloudDiscoveryMetadataFromConfig();
        if (q) return this.logger.verbose("Found cloud discovery metadata in authority configuration"), Bh1(A, q, !1), nG.CONFIG;
        if (this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."), this.options.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");
        else {
            let Y = v$7(this.hostnameAndPort);
            if (Y) return this.logger.verbose("Found cloud discovery metadata from hardcoded values."), Bh1(A, Y, !1), nG.HARDCODED_VALUES;
            this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")
        }
        let K = v96(A);
        if (this.isAuthoritySameType(A) && A.aliasesFromNetwork && !K) return this.logger.verbose("Found cloud discovery metadata in the cache."), nG.CACHE;
        else if (K) this.logger.verbose("The metadata entity is expired.");
        return null
    }
    getCloudDiscoveryMetadataFromConfig() {
        if (this.authorityType === RL.Ciam) return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."), mD.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        if (this.authorityOptions.cloudDiscoveryMetadata) {
            this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");
            try {
                this.logger.verbose("Attempting to parse the cloud discovery metadata.");
                let A = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),
                    q = Zh1(A.metadata, this.hostnameAndPort);
                if (this.logger.verbose("Parsed the cloud discovery metadata."), q) return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."), q;
                else this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")
            } catch (A) {
                throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."), Aw(rr)
            }
        }
        if (this.isInKnownAuthorities()) return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."), mD.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        return null
    }
    async getCloudDiscoveryMetadataFromNetwork() {
        this.performanceClient?.addQueueMeasurement(MA.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.correlationId);
        let A = `${uA.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,
            q = {},
            K = null;
        try {
            let Y = await this.networkInterface.sendGetRequestAsync(A, q),
                z, w;
            if (I$7(Y.body)) z = Y.body, w = z.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: ${z.tenant_discovery_endpoint}`);
            else if (b$7(Y.body)) {
                if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${Y.status}`), z = Y.body, z.error === uA.INVALID_INSTANCE) return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."), null;
                this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${z.error}`), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${z.error_description}`), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"), w = []
            } else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"), null;
            this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."), K = Zh1(w, this.hostnameAndPort)
        } catch (Y) {
            if (Y instanceof m3) this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
Error: ${Y.errorCode}
Error Description: ${Y.errorMessage}`);
            else {
                let z = Y;
                this.logger.error(`A non-MSALJS error was thrown while attempting to get the cloud instance discovery metadata.
Error: ${z.name}
Error Description: ${z.message}`)
            }
            return null
        }
        if (!K) this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."), this.logger.verbose("Creating custom Authority for custom domain scenario."), K = mD.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        return K
    }
    isInKnownAuthorities() {
        return this.authorityOptions.knownAuthorities.filter((q) => {
            return q && A5.getDomainFromUrl(q).toLowerCase() === this.hostnameAndPort
        }).length > 0
    }
    static generateAuthority(A, q) {
        let K;
        if (q && q.azureCloudInstance !== XU.None) {
            let Y = q.tenant ? q.tenant : uA.DEFAULT_COMMON_TENANT;
            K = `${q.azureCloudInstance}/${Y}/`
        }
        return K ? K : A
    }
    static createCloudDiscoveryMetadataFromHost(A) {
        return {
            preferred_network: A,
            preferred_cache: A,
            aliases: [A]
        }
    }
    getPreferredCache() {
        if (this.managedIdentity) return uA.DEFAULT_AUTHORITY_HOST;
        else if (this.discoveryComplete()) return this.metadata.preferred_cache;
        else throw Y8(rG)
    }
    isAlias(A) {
        return this.metadata.aliases.indexOf(A) > -1
    }
    isAliasOfKnownMicrosoftAuthority(A) {
        return i5A.has(A)
    }
    static isPublicCloudAuthority(A) {
        return uA.KNOWN_PUBLIC_CLOUDS.indexOf(A) >= 0
    }
    static buildRegionalAuthorityString(A, q, K) {
        let Y = new A5(A);
        Y.validateAsUri();
        let z = Y.getUrlComponents(),
            w = `${q}.${z.HostNameAndPort}`;
        if (this.isPublicCloudAuthority(z.HostNameAndPort)) w = `${q}.${uA.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
        let H = A5.constructAuthorityUriFromObject({
            ...Y.getUrlComponents(),
            HostNameAndPort: w
        }).urlString;
        if (K) return `${H}?${K}`;
        return H
    }
    static replaceWithRegionalInformation(A, q) {
        let K = {
            ...A
        };
        if (K.authorization_endpoint = mD.buildRegionalAuthorityString(K.authorization_endpoint, q), K.token_endpoint = mD.buildRegionalAuthorityString(K.token_endpoint, q), K.end_session_endpoint) K.end_session_endpoint = mD.buildRegionalAuthorityString(K.end_session_endpoint, q);
        return K
    }
    static transformCIAMAuthority(A) {
        let q = A,
            Y = new A5(A).getUrlComponents();
        if (Y.PathSegments.length === 0 && Y.HostNameAndPort.endsWith(uA.CIAM_AUTH_URL)) {
            let z = Y.HostNameAndPort.split(".")[0];
            q = `${q}${z}${uA.AAD_TENANT_DOMAIN_SUFFIX}`
        }
        return q
    }
}
// @from(Ln 156478, Col 0)
function F$7(A) {
    let Y = new A5(A).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
    switch (Y) {
        case LV.COMMON:
        case LV.ORGANIZATIONS:
        case LV.CONSUMERS:
            return;
        default:
            return Y
    }
}
// @from(Ln 156490, Col 0)
function k96(A) {
    return A.endsWith(uA.FORWARD_SLASH) ? A : `${A}${uA.FORWARD_SLASH}`
}
// @from(Ln 156494, Col 0)
function s9A(A) {
    let q = A.cloudDiscoveryMetadata,
        K = void 0;
    if (q) try {
        K = JSON.parse(q)
    } catch (Y) {
        throw Aw(rr)
    }
    return {
        canonicalAuthority: A.authority ? k96(A.authority) : void 0,
        knownAuthorities: A.knownAuthorities,
        cloudDiscoveryMetadata: K
    }
}
// @from(Ln 156508, Col 4)
L96 = v(() => {
    g5A();
    h$7();
    sr();
    TX();
    WH();
    n5A();
    or();
    Wh1();
    w96();
    x$7();
    u$7();
    m$7();
    LL();
    vS();
    ZU();
    E96();
    XJ();
    jU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    mD.reservedTenantDomains = new Set(["{tenant}", "{tenantid}", LV.COMMON, LV.CONSUMERS, LV.ORGANIZATIONS])
})
// @from(Ln 156529, Col 4)
R96 = {}
// @from(Ln 156533, Col 0)
async function t9A(A, q, K, Y, z, w, H) {
    H?.addQueueMeasurement(MA.AuthorityFactoryCreateDiscoveredInstance, w);
    let $ = mD.transformCIAMAuthority(k96(A)),
        O = new mD($, q, K, Y, z, w, H);
    try {
        return await AY(O.resolveEndpointsAsync.bind(O), MA.AuthorityResolveEndpointsAsync, z, H, w)(), O
    } catch (_) {
        throw Y8(rG)
    }
}
// @from(Ln 156543, Col 4)
e9A = v(() => {
    L96();
    TX();
    vS();
    ZU();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 156550, Col 4)
sG
// @from(Ln 156551, Col 4)
XX1 = v(() => {
    LL(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    sG = class sG extends m3 {
        constructor(A, q, K, Y, z) {
            super(A, q, K);
            this.name = "ServerError", this.errorNo = Y, this.status = z, Object.setPrototypeOf(this, sG.prototype)
        }
    }
})
// @from(Ln 156561, Col 0)
function DX1(A, q, K) {
    return {
        clientId: A,
        authority: q.authority,
        scopes: q.scopes,
        homeAccountIdentifier: K,
        claims: q.claims,
        authenticationScheme: q.authenticationScheme,
        resourceRequestMethod: q.resourceRequestMethod,
        resourceRequestUri: q.resourceRequestUri,
        shrClaims: q.shrClaims,
        sshKid: q.sshKid,
        embeddedClientId: q.embeddedClientId || q.tokenBodyParameters?.clientId
    }
}
// @from(Ln 156576, Col 4)
y96 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 156578, Col 0)
class fU {
    static generateThrottlingStorageKey(A) {
        return `${Su.THROTTLING_PREFIX}.${JSON.stringify(A)}`
    }
    static preProcess(A, q, K) {
        let Y = fU.generateThrottlingStorageKey(q),
            z = A.getThrottlingCache(Y);
        if (z) {
            if (z.throttleTime < Date.now()) {
                A.removeItem(Y, K);
                return
            }
            throw new sG(z.errorCodes?.join(" ") || uA.EMPTY_STRING, z.errorMessage, z.subError)
        }
    }
    static postProcess(A, q, K, Y) {
        if (fU.checkResponseStatus(K) || fU.checkResponseForRetryAfter(K)) {
            let z = {
                throttleTime: fU.calculateThrottleTime(parseInt(K.headers[PH.RETRY_AFTER])),
                error: K.body.error,
                errorCodes: K.body.error_codes,
                errorMessage: K.body.error_description,
                subError: K.body.suberror
            };
            A.setThrottlingCache(fU.generateThrottlingStorageKey(q), z, Y)
        }
    }
    static checkResponseStatus(A) {
        return A.status === 429 || A.status >= 500 && A.status < 600
    }
    static checkResponseForRetryAfter(A) {
        if (A.headers) return A.headers.hasOwnProperty(PH.RETRY_AFTER) && (A.status < 200 || A.status >= 300);
        return !1
    }
    static calculateThrottleTime(A) {
        let q = A <= 0 ? 0 : A,
            K = Date.now() / 1000;
        return Math.floor(Math.min(K + (q || Su.DEFAULT_THROTTLE_TIME_SECONDS), K + Su.DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000)
    }
    static removeThrottle(A, q, K, Y) {
        let z = DX1(q, K, Y),
            w = this.generateThrottlingStorageKey(z);
        A.removeItem(w, K.correlationId)
    }
}
// @from(Ln 156623, Col 4)
Q$7 = v(() => {
    WH();
    XX1();
    y96(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 156628, Col 4)
C96
// @from(Ln 156629, Col 4)
g$7 = v(() => {
    LL(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    C96 = class C96 extends m3 {
        constructor(A, q, K) {
            super(A.errorCode, A.errorMessage, A.subError);
            Object.setPrototypeOf(this, C96.prototype), this.name = "NetworkError", this.error = A, this.httpStatus = q, this.responseHeaders = K
        }
    }
})
// @from(Ln 156638, Col 0)
class VW {
    constructor(A, q) {
        this.config = y$7(A), this.logger = new yV(this.config.loggerOptions, Y96, tJ1), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = q
    }
    createTokenRequestHeaders(A) {
        let q = {};
        if (q[PH.CONTENT_TYPE] = uA.URL_FORM_CONTENT_TYPE, !this.config.systemOptions.preventCorsPreflight && A) switch (A.type) {
            case oG.HOME_ACCOUNT_ID:
                try {
                    let K = Iu(A.credential);
                    q[PH.CCS_HEADER] = `Oid:${K.uid}@${K.utid}`
                } catch (K) {
                    this.logger.verbose("Could not parse home account ID for CCS Header: " + K)
                }
                break;
            case oG.UPN:
                q[PH.CCS_HEADER] = `UPN: ${A.credential}`;
                break
        }
        return q
    }
    async executePostToTokenEndpoint(A, q, K, Y, z, w) {
        if (w) this.performanceClient?.addQueueMeasurement(w, z);
        let H = await this.sendPostRequest(Y, A, {
            body: q,
            headers: K
        }, z);
        if (this.config.serverTelemetryManager && H.status < 500 && H.status !== 429) this.config.serverTelemetryManager.clearTelemetryCache();
        return H
    }
    async sendPostRequest(A, q, K, Y) {
        fU.preProcess(this.cacheManager, A, Y);
        let z;
        try {
            z = await AY(this.networkClient.sendPostRequestAsync.bind(this.networkClient), MA.NetworkClientSendPostRequestAsync, this.logger, this.performanceClient, Y)(q, K);
            let w = z.headers || {};
            this.performanceClient?.addFields({
                refreshTokenSize: z.body.refresh_token?.length || 0,
                httpVerToken: w[PH.X_MS_HTTP_VERSION] || "",
                requestId: w[PH.X_MS_REQUEST_ID] || ""
            }, Y)
        } catch (w) {
            if (w instanceof C96) {
                let H = w.responseHeaders;
                if (H) this.performanceClient?.addFields({
                    httpVerToken: H[PH.X_MS_HTTP_VERSION] || "",
                    requestId: H[PH.X_MS_REQUEST_ID] || "",
                    contentTypeHeader: H[PH.CONTENT_TYPE] || void 0,
                    contentLengthHeader: H[PH.CONTENT_LENGTH] || void 0,
                    httpStatus: w.httpStatus
                }, Y);
                throw w.error
            }
            if (w instanceof m3) throw w;
            else throw Y8(p71)
        }
        return fU.postProcess(this.cacheManager, A, z, Y), z
    }
    async updateAuthority(A, q) {
        this.performanceClient?.addQueueMeasurement(MA.UpdateTokenEndpointAuthority, q);
        let K = `https://${A}/${this.authority.tenant}/`,
            Y = await t9A(K, this.networkClient, this.cacheManager, this.authority.options, this.logger, q, this.performanceClient);
        this.authority = Y
    }
    createTokenQueryParameters(A) {
        let q = new Map;
        if (A.embeddedClientId) GU(q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
        if (A.tokenQueryParameters) WU(q, A.tokenQueryParameters);
        return V41(q, A.correlationId), P41(q, A.correlationId, this.performanceClient), xu(q)
    }
}
// @from(Ln 156709, Col 4)
mh1 = v(() => {
    M96();
    K96();
    WH();
    z96();
    Vh1();
    KX1();
    OX1();
    D41();
    e9A();
    vS();
    Q$7();
    LL();
    TX();
    g$7();
    ZU();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 156727, Col 4)
h96 = {}
// @from(Ln 156738, Col 4)
Ao = "no_tokens_found"
// @from(Ln 156739, Col 4)
Fh1 = "native_account_unavailable"
// @from(Ln 156740, Col 4)
Qh1 = "refresh_token_expired"
// @from(Ln 156741, Col 4)
S96 = "ux_not_allowed"
// @from(Ln 156742, Col 4)
AYA = "interaction_required"
// @from(Ln 156743, Col 4)
qYA = "consent_required"
// @from(Ln 156744, Col 4)
KYA = "login_required"
// @from(Ln 156745, Col 4)
qo = "bad_token"
// @from(Ln 156746, Col 4)
I96 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 156749, Col 0)
function b96(A, q, K) {
    let Y = !!A && U$7.indexOf(A) > -1,
        z = !!K && hB5.indexOf(K) > -1,
        w = !!q && U$7.some((H) => {
            return q.indexOf(H) > -1
        });
    return Y || w || z
}
// @from(Ln 156758, Col 0)
function u96(A) {
    return new _v(A, x96[A])
}
// @from(Ln 156761, Col 4)
U$7
// @from(Ln 156761, Col 9)
hB5
// @from(Ln 156761, Col 14)
x96
// @from(Ln 156761, Col 19)
YYA
// @from(Ln 156761, Col 24)
_v
// @from(Ln 156762, Col 4)
gh1 = v(() => {
    WH();
    LL();
    I96(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    U$7 = [AYA, qYA, KYA, qo, S96], hB5 = ["message_only", "additional_action", "basic_action", "user_password_expired", "consent_required", "bad_token"], x96 = {
        [Ao]: "No refresh token found in the cache. Please sign-in.",
        [Fh1]: "The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",
        [Qh1]: "Refresh token has expired.",
        [qo]: "Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve.",
        [S96]: "`canShowUI` flag in Edge was set to false. User interaction required on web page. Please invoke an interactive API to resolve."
    }, YYA = {
        noTokensFoundError: {
            code: Ao,
            desc: x96[Ao]
        },
        native_account_unavailable: {
            code: Fh1,
            desc: x96[Fh1]
        },
        bad_token: {
            code: qo,
            desc: x96[qo]
        }
    };
    _v = class _v extends m3 {
        constructor(A, q, K, Y, z, w, H, $) {
            super(A, q, K);
            Object.setPrototypeOf(this, _v.prototype), this.timestamp = Y || uA.EMPTY_STRING, this.traceId = z || uA.EMPTY_STRING, this.correlationId = w || uA.EMPTY_STRING, this.claims = H || uA.EMPTY_STRING, this.name = "InteractionRequiredAuthError", this.errorNo = $
        }
    }
})
// @from(Ln 156793, Col 0)
class B96 {
    static setRequestState(A, q, K) {
        let Y = B96.generateLibraryState(A, K);
        return q ? `${Y}${uA.RESOURCE_DELIM}${q}` : Y
    }
    static generateLibraryState(A, q) {
        if (!A) throw Y8(lr);
        let K = {
            id: A.createNewGuid()
        };
        if (q) K.meta = q;
        let Y = JSON.stringify(K);
        return A.base64Encode(Y)
    }
    static parseRequestState(A, q) {
        if (!A) throw Y8(lr);
        if (!q) throw Y8(TS);
        try {
            let K = q.split(uA.RESOURCE_DELIM),
                Y = K[0],
                z = K.length > 1 ? K.slice(1).join(uA.RESOURCE_DELIM) : uA.EMPTY_STRING,
                w = A.base64Decode(Y),
                H = JSON.parse(w);
            return {
                userRequestState: z || uA.EMPTY_STRING,
                libraryState: H
            }
        } catch (K) {
            throw Y8(TS)
        }
    }
}
// @from(Ln 156825, Col 4)
p$7 = v(() => {
    WH();
    TX();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 156830, Col 0)
class T41 {
    constructor(A, q) {
        this.cryptoUtils = A, this.performanceClient = q
    }
    async generateCnf(A, q) {
        this.performanceClient?.addQueueMeasurement(MA.PopTokenGenerateCnf, A.correlationId);
        let K = await AY(this.generateKid.bind(this), MA.PopTokenGenerateCnf, q, this.performanceClient, A.correlationId)(A),
            Y = this.cryptoUtils.base64UrlEncode(JSON.stringify(K));
        return {
            kid: K.kid,
            reqCnfString: Y
        }
    }
    async generateKid(A) {
        return this.performanceClient?.addQueueMeasurement(MA.PopTokenGenerateKid, A.correlationId), {
            kid: await this.cryptoUtils.getPublicKeyThumbprint(A),
            xms_ksl: IB5.SW
        }
    }
    async signPopToken(A, q, K) {
        return this.signPayload(A, q, K)
    }
    async signPayload(A, q, K, Y) {
        let {
            resourceRequestMethod: z,
            resourceRequestUri: w,
            shrClaims: H,
            shrNonce: $,
            shrOptions: O
        } = K, J = (w ? new A5(w) : void 0)?.getUrlComponents();
        return this.cryptoUtils.signJwt({
            at: A,
            ts: Ov(),
            m: z?.toUpperCase(),
            u: J?.HostNameAndPort,
            nonce: $ || this.cryptoUtils.createNewGuid(),
            p: J?.AbsolutePath,
            q: J?.QueryString ? [
                [], J.QueryString
            ] : void 0,
            client_claims: H || void 0,
            ...Y
        }, q, O, K.correlationId)
    }
}
// @from(Ln 156875, Col 4)
IB5
// @from(Ln 156876, Col 4)
m96 = v(() => {
    er();
    sr();
    vS();
    ZU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    IB5 = {
        SW: "sw"
    }
})
// @from(Ln 156885, Col 0)
class yL {
    constructor(A, q) {
        this.cache = A, this.hasChanged = q
    }
    get cacheHasChanged() {
        return this.hasChanged
    }
    get tokenCache() {
        return this.cache
    }
}
// @from(Ln 156896, Col 4)
zYA = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 156898, Col 0)
class R_ {
    constructor(A, q, K, Y, z, w, H) {
        this.clientId = A, this.cacheStorage = q, this.cryptoObj = K, this.logger = Y, this.serializableCache = z, this.persistencePlugin = w, this.performanceClient = H
    }
    validateTokenResponse(A, q) {
        if (A.error || A.error_description || A.suberror) {
            let K = `Error(s): ${A.error_codes||uA.NOT_AVAILABLE} - Timestamp: ${A.timestamp||uA.NOT_AVAILABLE} - Description: ${A.error_description||uA.NOT_AVAILABLE} - Correlation ID: ${A.correlation_id||uA.NOT_AVAILABLE} - Trace ID: ${A.trace_id||uA.NOT_AVAILABLE}`,
                Y = A.error_codes?.length ? A.error_codes[0] : void 0,
                z = new sG(A.error, K, A.suberror, Y, A.status);
            if (q && A.status && A.status >= B3.SERVER_ERROR_RANGE_START && A.status <= B3.SERVER_ERROR_RANGE_END) {
                this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${z}`);
                return
            } else if (q && A.status && A.status >= B3.CLIENT_ERROR_RANGE_START && A.status <= B3.CLIENT_ERROR_RANGE_END) {
                this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${z}`);
                return
            }
            if (b96(A.error, A.error_description, A.suberror)) throw new _v(A.error, A.error_description, A.suberror, A.timestamp || uA.EMPTY_STRING, A.trace_id || uA.EMPTY_STRING, A.correlation_id || uA.EMPTY_STRING, A.claims || uA.EMPTY_STRING, Y);
            throw z
        }
    }
    async handleServerTokenResponse(A, q, K, Y, z, w, H, $, O) {
        this.performanceClient?.addQueueMeasurement(MA.HandleServerTokenResponse, A.correlation_id);
        let _;
        if (A.id_token) {
            if (_ = MU(A.id_token || uA.EMPTY_STRING, this.cryptoObj.base64Decode), z && z.nonce) {
                if (_.nonce !== z.nonce) throw Y8(i71)
            }
            if (Y.maxAge || Y.maxAge === 0) {
                let j = _.auth_time;
                if (!j) throw Y8($U);
                Gh1(j, Y.maxAge)
            }
        }
        this.homeAccountIdentifier = vX.generateHomeAccountId(A.client_info || uA.EMPTY_STRING, q.authorityType, this.logger, this.cryptoObj, _);
        let J;
        if (!!z && !!z.state) J = B96.parseRequestState(this.cryptoObj, z.state);
        A.key_id = A.key_id || Y.sshKid || void 0;
        let X = this.generateCacheRecord(A, q, K, Y, _, w, z),
            D;
        try {
            if (this.persistencePlugin && this.serializableCache) this.logger.verbose("Persistence enabled, calling beforeCacheAccess"), D = new yL(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(D);
            if (H && !$ && X.account) {
                let j = this.cacheStorage.generateAccountKey(vX.getAccountInfo(X.account));
                if (!this.cacheStorage.getAccount(j, Y.correlationId)) return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"), await R_.generateAuthenticationResult(this.cryptoObj, q, X, !1, Y, _, J, void 0, O)
            }
            await this.cacheStorage.saveCacheRecord(X, Y.correlationId, p5A(_ || {}), Y.storeInCache)
        } finally {
            if (this.persistencePlugin && this.serializableCache && D) this.logger.verbose("Persistence enabled, calling afterCacheAccess"), await this.persistencePlugin.afterCacheAccess(D)
        }
        return R_.generateAuthenticationResult(this.cryptoObj, q, X, !1, Y, _, J, A, O)
    }
    generateCacheRecord(A, q, K, Y, z, w, H) {
        let $ = q.getPreferredCache();
        if (!$) throw Y8(_U);
        let O = O96(z),
            _, J;
        if (A.id_token && !!z) _ = r9A(this.homeAccountIdentifier, $, A.id_token, this.clientId, O || ""), J = d$7(this.cacheStorage, q, this.homeAccountIdentifier, this.cryptoObj.base64Decode, Y.correlationId, z, A.client_info, $, O, H, void 0, this.logger);
        let X = null;
        if (A.access_token) {
            let M = A.scope ? L_.fromString(A.scope) : new L_(Y.scopes || []),
                P = (typeof A.expires_in === "string" ? parseInt(A.expires_in, 10) : A.expires_in) || 0,
                W = (typeof A.ext_expires_in === "string" ? parseInt(A.ext_expires_in, 10) : A.ext_expires_in) || 0,
                G = (typeof A.refresh_in === "string" ? parseInt(A.refresh_in, 10) : A.refresh_in) || void 0,
                f = K + P,
                Z = f + W,
                N = G && G > 0 ? K + G : void 0;
            X = o9A(this.homeAccountIdentifier, $, A.access_token, this.clientId, O || q.tenant || "", M.printScopes(), f, Z, this.cryptoObj.base64Decode, N, A.token_type, w, A.key_id, Y.claims, Y.requestedClaimsHash)
        }
        let D = null;
        if (A.refresh_token) {
            let M;
            if (A.refresh_token_expires_in) {
                let P = typeof A.refresh_token_expires_in === "string" ? parseInt(A.refresh_token_expires_in, 10) : A.refresh_token_expires_in;
                M = K + P
            }
            D = a9A(this.homeAccountIdentifier, $, A.refresh_token, this.clientId, A.foci, w, M)
        }
        let j = null;
        if (A.foci) j = {
            clientId: this.clientId,
            environment: $,
            familyId: A.foci
        };
        return {
            account: J,
            idToken: _,
            accessToken: X,
            refreshToken: D,
            appMetadata: j
        }
    }
    static async generateAuthenticationResult(A, q, K, Y, z, w, H, $, O) {
        let _ = uA.EMPTY_STRING,
            J = [],
            X = null,
            D, j, M = uA.EMPTY_STRING;
        if (K.accessToken) {
            if (K.accessToken.tokenType === b9.POP && !z.popKid) {
                let f = new T41(A),
                    {
                        secret: Z,
                        keyId: N
                    } = K.accessToken;
                if (!N) throw Y8(K41);
                _ = await f.signPopToken(Z, N, z)
            } else _ = K.accessToken.secret;
            if (J = L_.fromString(K.accessToken.target).asArray(), X = uh1(K.accessToken.expiresOn), D = uh1(K.accessToken.extendedExpiresOn), K.accessToken.refreshOn) j = uh1(K.accessToken.refreshOn)
        }
        if (K.appMetadata) M = K.appMetadata.familyId === gr ? gr : "";
        let P = w?.oid || w?.sub || "",
            W = w?.tid || "";
        if ($?.spa_accountid && !!K.account) K.account.nativeAccountId = $?.spa_accountid;
        let G = K.account ? H96(vX.getAccountInfo(K.account), void 0, w, K.idToken?.secret) : null;
        return {
            authority: q.canonicalAuthority,
            uniqueId: P,
            tenantId: W,
            scopes: J,
            account: G,
            idToken: K?.idToken?.secret || "",
            idTokenClaims: w || {},
            accessToken: _,
            fromCache: Y,
            expiresOn: X,
            extExpiresOn: D,
            refreshOn: j,
            correlationId: z.correlationId,
            requestId: O || uA.EMPTY_STRING,
            familyId: M,
            tokenType: K.accessToken?.tokenType || uA.EMPTY_STRING,
            state: H ? H.userRequestState : uA.EMPTY_STRING,
            cloudGraphHostName: K.account?.cloudGraphHostName || uA.EMPTY_STRING,
            msGraphHost: K.account?.msGraphHost || uA.EMPTY_STRING,
            code: $?.spa_code,
            fromNativeBroker: !1
        }
    }
}
// @from(Ln 157039, Col 0)
function d$7(A, q, K, Y, z, w, H, $, O, _, J, X) {
    X?.verbose("setCachedAccount called");
    let j = A.getAccountKeys().find((f) => {
            return f.startsWith(K)
        }),
        M = null;
    if (j) M = A.getAccount(j, z);
    let P = M || vX.createAccount({
            homeAccountId: K,
            idTokenClaims: w,
            clientInfo: H,
            environment: $,
            cloudGraphHostName: _?.cloud_graph_host_name,
            msGraphHost: _?.msgraph_host,
            nativeAccountId: J
        }, q, Y),
        W = P.tenantProfiles || [],
        G = O || P.realm;
    if (G && !W.find((f) => {
            return f.tenantId === G
        })) {
        let f = Ph1(K, P.localAccountId, G, w);
        W.push(f)
    }
    return P.tenantProfiles = W, P
}
// @from(Ln 157065, Col 4)
Uh1 = v(() => {
    TX();
    XX1();
    Mh1();
    _96();
    gh1();
    p$7();
    WH();
    m96();
    zYA();
    vS();
    YX1();
    U5A();
    $96();
    E96();
    er();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 157083, Col 0)
async function tG(A, q, K) {
    if (typeof A === "string") return A;
    else return A({
        clientId: q,
        tokenEndpoint: K
    })
}