
// @from(Ln 179676, Col 0)
class T56 {
    constructor(A, q, K, Y, z) {
        this.clientId = A, this.cryptoImpl = q, this.commonLogger = K.clone(hj1, TP6), this.staticAuthorityOptions = z, this.performanceClient = Y
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
        if (K.length > 0) return lJ.getAccountInfo(K[0]);
        else return null
    }
    buildTenantProfiles(A, q, K) {
        return A.flatMap((Y) => {
            return this.getTenantProfilesFromAccountEntity(Y, q, K?.tenantId, K)
        })
    }
    getTenantedAccountInfoByFilter(A, q, K, Y, z) {
        let _ = null,
            w;
        if (z) {
            if (!this.tenantProfileMatchesFilter(K, z)) return null
        }
        let O = this.getIdToken(A, Y, q, K.tenantId);
        if (O) {
            if (w = Ad(O.secret, this.cryptoImpl.base64Decode), !this.idTokenClaimsMatchTenantProfileFilter(w, z)) return null
        }
        return _ = Ij1(A, K, w, O?.secret), _
    }
    getTenantProfilesFromAccountEntity(A, q, K, Y) {
        let z = lJ.getAccountInfo(A),
            _ = z.tenantProfiles || new Map,
            w = this.getTokenKeys();
        if (K) {
            let $ = _.get(K);
            if ($) _ = new Map([
                [K, $]
            ]);
            else return []
        }
        let O = [];
        return _.forEach(($) => {
            let H = this.getTenantedAccountInfoByFilter(z, w, $, q, Y);
            if (H) O.push(H)
        }), O
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
        if (!A) throw t8(_56);
        try {
            if (A.account) await this.setAccount(A.account, q, K);
            if (!!A.idToken && Y?.idToken !== !1) await this.setIdTokenCredential(A.idToken, q, K);
            if (!!A.accessToken && Y?.accessToken !== !1) await this.saveAccessToken(A.accessToken, q, K);
            if (!!A.refreshToken && Y?.refreshToken !== !1) await this.setRefreshTokenCredential(A.refreshToken, q, K);
            if (A.appMetadata) this.setAppMetadata(A.appMetadata, q)
        } catch (z) {
            if (this.commonLogger?.error("CacheManager.saveCacheRecord: failed"), z instanceof T5) throw z;
            else throw dp7(z)
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
            _ = UH.fromString(A.target);
        z.accessToken.forEach((w) => {
            if (!this.accessTokenKeyMatchesFilter(w, Y, !1)) return;
            let O = this.getAccessTokenCredential(w, q);
            if (O && this.credentialMatchesFilter(O, Y)) {
                if (UH.fromString(O.target).intersectingScopeSets(_)) this.removeAccessToken(w, q)
            }
        }), await this.setAccessTokenCredential(A, q, K)
    }
    getAccountsFilteredBy(A, q) {
        let K = this.getAccountKeys(),
            Y = [];
        return K.forEach((z) => {
            let _ = this.getAccount(z, q);
            if (!_) return;
            if (!!A.homeAccountId && !this.matchHomeAccountId(_, A.homeAccountId)) return;
            if (!!A.username && !this.matchUsername(_.username, A.username)) return;
            if (!!A.environment && !this.matchEnvironment(_, A.environment)) return;
            if (!!A.realm && !this.matchRealm(_, A.realm)) return;
            if (!!A.nativeAccountId && !this.matchNativeAccountId(_, A.nativeAccountId)) return;
            if (!!A.authorityType && !this.matchAuthorityType(_, A.authorityType)) return;
            let w = {
                    localAccountId: A?.localAccountId,
                    name: A?.name
                },
                O = _.tenantProfiles?.filter(($) => {
                    return this.tenantProfileMatchesFilter($, w)
                });
            if (O && O.length === 0) return;
            Y.push(_)
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
        if (A.credentialType === D_.ACCESS_TOKEN_WITH_AUTH_SCHEME) {
            if (!!q.tokenType && !this.matchTokenType(A, q.tokenType)) return !1;
            if (q.tokenType === k9.SSH) {
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
            }, q), !K || K.credentialType.toLowerCase() !== D_.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase() || K.tokenType !== k9.POP) return;
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
        let _ = {
                homeAccountId: A.homeAccountId,
                environment: A.environment,
                credentialType: D_.ID_TOKEN,
                clientId: this.clientId,
                realm: Y
            },
            w = this.getIdTokensByFilter(_, q, K),
            O = w.size;
        if (O < 1) return this.commonLogger.info("CacheManager:getIdToken - No token found"), null;
        else if (O > 1) {
            let $ = w;
            if (!Y) {
                let H = new Map;
                w.forEach((J, M) => {
                    if (J.realm === A.tenantId) H.set(M, J)
                });
                let j = H.size;
                if (j < 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result"), w.values().next().value;
                else if (j === 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile"), H.values().next().value;
                else $ = H
            }
            if (this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them"), $.forEach((H, j) => {
                    this.removeIdToken(j, q)
                }), z && q) z.addFields({
                multiMatchedID: w.size
            }, q);
            return null
        }
        return this.commonLogger.info("CacheManager:getIdToken - Returning ID token"), w.values().next().value
    }
    getIdTokensByFilter(A, q, K) {
        let Y = K && K.idToken || this.getTokenKeys().idToken,
            z = new Map;
        return Y.forEach((_) => {
            if (!this.idTokenKeyMatchesFilter(_, {
                    clientId: this.clientId,
                    ...A
                })) return;
            let w = this.getIdTokenCredential(_, q);
            if (w && this.credentialMatchesFilter(w, A)) z.set(_, w)
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
        let _ = UH.createSearchScopes(q.scopes),
            w = q.authenticationScheme || k9.BEARER,
            O = w && w.toLowerCase() !== k9.BEARER.toLowerCase() ? D_.ACCESS_TOKEN_WITH_AUTH_SCHEME : D_.ACCESS_TOKEN,
            $ = {
                homeAccountId: A.homeAccountId,
                environment: A.environment,
                credentialType: O,
                clientId: this.clientId,
                realm: Y || A.tenantId,
                target: _,
                tokenType: w,
                keyId: q.sshKid,
                requestedClaimsHash: q.requestedClaimsHash
            },
            H = K && K.accessToken || this.getTokenKeys().accessToken,
            j = [];
        H.forEach((M) => {
            if (this.accessTokenKeyMatchesFilter(M, $, !0)) {
                let D = this.getAccessTokenCredential(M, z);
                if (D && this.credentialMatchesFilter(D, $)) j.push(D)
            }
        });
        let J = j.length;
        if (J < 1) return this.commonLogger.info("CacheManager:getAccessToken - No token found", z), null;
        else if (J > 1) return this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them", z), j.forEach((M) => {
            this.removeAccessToken(this.generateCredentialKey(M), z)
        }), this.performanceClient.addFields({
            multiMatchedAT: j.length
        }, z), null;
        return this.commonLogger.info("CacheManager:getAccessToken - Returning access token", z), j[0]
    }
    accessTokenKeyMatchesFilter(A, q, K) {
        let Y = A.toLowerCase();
        if (q.clientId && Y.indexOf(q.clientId.toLowerCase()) === -1) return !1;
        if (q.homeAccountId && Y.indexOf(q.homeAccountId.toLowerCase()) === -1) return !1;
        if (q.realm && Y.indexOf(q.realm.toLowerCase()) === -1) return !1;
        if (q.requestedClaimsHash && Y.indexOf(q.requestedClaimsHash.toLowerCase()) === -1) return !1;
        if (q.target) {
            let z = q.target.asArray();
            for (let _ = 0; _ < z.length; _++)
                if (K && !Y.includes(z[_].toLowerCase())) return !1;
                else if (!K && Y.includes(z[_].toLowerCase())) return !0
        }
        return !0
    }
    getAccessTokensByFilter(A, q) {
        let K = this.getTokenKeys(),
            Y = [];
        return K.accessToken.forEach((z) => {
            if (!this.accessTokenKeyMatchesFilter(z, A, !0)) return;
            let _ = this.getAccessTokenCredential(z, q);
            if (_ && this.credentialMatchesFilter(_, A)) Y.push(_)
        }), Y
    }
    getRefreshToken(A, q, K, Y, z) {
        this.commonLogger.trace("CacheManager - getRefreshToken called");
        let _ = q ? Rs : void 0,
            w = {
                homeAccountId: A.homeAccountId,
                environment: A.environment,
                credentialType: D_.REFRESH_TOKEN,
                clientId: this.clientId,
                familyId: _
            },
            O = Y && Y.refreshToken || this.getTokenKeys().refreshToken,
            $ = [];
        O.forEach((j) => {
            if (this.refreshTokenKeyMatchesFilter(j, w)) {
                let J = this.getRefreshTokenCredential(j, K);
                if (J && this.credentialMatchesFilter(J, w)) $.push(J)
            }
        });
        let H = $.length;
        if (H < 1) return this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found."), null;
        if (H > 1 && z && K) z.addFields({
            multiMatchedRT: H
        }, K);
        return this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token"), $[0]
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
            Y = Object.keys(K).map((_) => K[_]),
            z = Y.length;
        if (z < 1) return null;
        else if (z > 1) throw t8(q56);
        return Y[0]
    }
    isAppMetadataFOCI(A) {
        let q = this.readAppMetadataFromCache(A);
        return !!(q && q.familyId === Rs)
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
            let Y = pp7(this.staticAuthorityOptions, this.commonLogger);
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
        if (A.credentialType !== D_.ACCESS_TOKEN && A.credentialType !== D_.ACCESS_TOKEN_WITH_AUTH_SCHEME || !A.target) return !1;
        return UH.fromString(A.target).containsScopeSet(q)
    }
    matchTokenType(A, q) {
        return !!(A.tokenType && A.tokenType === q)
    }
    matchKeyId(A, q) {
        return !!(A.keyId && A.keyId === q)
    }
    isAppMetadata(A) {
        return A.indexOf(xm6) !== -1
    }
    isAuthorityMetadata(A) {
        return A.indexOf(WP6.CACHE_KEY) !== -1
    }
    generateAuthorityMetadataCacheKey(A) {
        return `${WP6.CACHE_KEY}-${this.clientId}-${A}`
    }
    static toObject(A, q) {
        for (let K in q) A[K] = q[K];
        return A
    }
}
// @from(Ln 180134, Col 4)
gj1
// @from(Ln 180135, Col 4)
oX8 = E(() => {
    bw();
    jB6();
    uj1();
    cJ();
    bj1();
    EP6();
    Sj1();
    iX8();
    cp7();
    UL();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    gj1 = class gj1 extends T56 {
        async setAccount() {
            throw t8(G3)
        }
        getAccount() {
            throw t8(G3)
        }
        async setIdTokenCredential() {
            throw t8(G3)
        }
        getIdTokenCredential() {
            throw t8(G3)
        }
        async setAccessTokenCredential() {
            throw t8(G3)
        }
        getAccessTokenCredential() {
            throw t8(G3)
        }
        async setRefreshTokenCredential() {
            throw t8(G3)
        }
        getRefreshTokenCredential() {
            throw t8(G3)
        }
        setAppMetadata() {
            throw t8(G3)
        }
        getAppMetadata() {
            throw t8(G3)
        }
        setServerTelemetry() {
            throw t8(G3)
        }
        getServerTelemetry() {
            throw t8(G3)
        }
        setAuthorityMetadata() {
            throw t8(G3)
        }
        getAuthorityMetadata() {
            throw t8(G3)
        }
        getAuthorityMetadataKeys() {
            throw t8(G3)
        }
        setThrottlingCache() {
            throw t8(G3)
        }
        getThrottlingCache() {
            throw t8(G3)
        }
        removeItem() {
            throw t8(G3)
        }
        getKeys() {
            throw t8(G3)
        }
        getAccountKeys() {
            throw t8(G3)
        }
        getTokenKeys() {
            throw t8(G3)
        }
        generateCredentialKey() {
            throw t8(G3)
        }
        generateAccountKey() {
            throw t8(G3)
        }
    }
})
// @from(Ln 180219, Col 4)
W8
// @from(Ln 180219, Col 8)
qX2
// @from(Ln 180219, Col 13)
lp7
// @from(Ln 180220, Col 4)
rC = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    W8 = {
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
    }, qX2 = new Map([
        [W8.AcquireTokenByCode, "ATByCode"],
        [W8.AcquireTokenByRefreshToken, "ATByRT"],
        [W8.AcquireTokenSilent, "ATS"],
        [W8.AcquireTokenSilentAsync, "ATSAsync"],
        [W8.AcquireTokenPopup, "ATPopup"],
        [W8.AcquireTokenRedirect, "ATRedirect"],
        [W8.CryptoOptsGetPublicKeyThumbprint, "CryptoGetPKThumb"],
        [W8.CryptoOptsSignJwt, "CryptoSignJwt"],
        [W8.SilentCacheClientAcquireToken, "SltCacheClientAT"],
        [W8.SilentIframeClientAcquireToken, "SltIframeClientAT"],
        [W8.SilentRefreshClientAcquireToken, "SltRClientAT"],
        [W8.SsoSilent, "SsoSlt"],
        [W8.StandardInteractionClientGetDiscoveredAuthority, "StdIntClientGetDiscAuth"],
        [W8.FetchAccountIdWithNativeBroker, "FetchAccIdWithNtvBroker"],
        [W8.NativeInteractionClientAcquireToken, "NtvIntClientAT"],
        [W8.BaseClientCreateTokenRequestHeaders, "BaseClientCreateTReqHead"],
        [W8.NetworkClientSendPostRequestAsync, "NetClientSendPost"],
        [W8.RefreshTokenClientExecutePostToTokenEndpoint, "RTClientExecPost"],
        [W8.AuthorizationCodeClientExecutePostToTokenEndpoint, "AuthCodeClientExecPost"],
        [W8.BrokerHandhshake, "BrokerHandshake"],
        [W8.AcquireTokenByRefreshTokenInBroker, "ATByRTInBroker"],
        [W8.AcquireTokenByBroker, "ATByBroker"],
        [W8.RefreshTokenClientExecuteTokenRequest, "RTClientExecTReq"],
        [W8.RefreshTokenClientAcquireToken, "RTClientAT"],
        [W8.RefreshTokenClientAcquireTokenWithCachedRefreshToken, "RTClientATWithCachedRT"],
        [W8.RefreshTokenClientAcquireTokenByRefreshToken, "RTClientATByRT"],
        [W8.RefreshTokenClientCreateTokenRequestBody, "RTClientCreateTReqBody"],
        [W8.AcquireTokenFromCache, "ATFromCache"],
        [W8.SilentFlowClientAcquireCachedToken, "SltFlowClientATCached"],
        [W8.SilentFlowClientGenerateResultFromCacheRecord, "SltFlowClientGenResFromCache"],
        [W8.AcquireTokenBySilentIframe, "ATBySltIframe"],
        [W8.InitializeBaseRequest, "InitBaseReq"],
        [W8.InitializeSilentRequest, "InitSltReq"],
        [W8.InitializeClientApplication, "InitClientApplication"],
        [W8.InitializeCache, "InitCache"],
        [W8.ImportExistingCache, "importCache"],
        [W8.SetUserData, "setUserData"],
        [W8.LocalStorageUpdated, "localStorageUpdated"],
        [W8.SilentIframeClientTokenHelper, "SIClientTHelper"],
        [W8.SilentHandlerInitiateAuthRequest, "SHandlerInitAuthReq"],
        [W8.SilentHandlerMonitorIframeForHash, "SltHandlerMonitorIframeForHash"],
        [W8.SilentHandlerLoadFrame, "SHandlerLoadFrame"],
        [W8.SilentHandlerLoadFrameSync, "SHandlerLoadFrameSync"],
        [W8.StandardInteractionClientCreateAuthCodeClient, "StdIntClientCreateAuthCodeClient"],
        [W8.StandardInteractionClientGetClientConfiguration, "StdIntClientGetClientConf"],
        [W8.StandardInteractionClientInitializeAuthorizationRequest, "StdIntClientInitAuthReq"],
        [W8.GetAuthCodeUrl, "GetAuthCodeUrl"],
        [W8.HandleCodeResponseFromServer, "HandleCodeResFromServer"],
        [W8.HandleCodeResponse, "HandleCodeResp"],
        [W8.HandleResponseEar, "HandleRespEar"],
        [W8.HandleResponseCode, "HandleRespCode"],
        [W8.HandleResponsePlatformBroker, "HandleRespPlatBroker"],
        [W8.UpdateTokenEndpointAuthority, "UpdTEndpointAuth"],
        [W8.AuthClientAcquireToken, "AuthClientAT"],
        [W8.AuthClientExecuteTokenRequest, "AuthClientExecTReq"],
        [W8.AuthClientCreateTokenRequestBody, "AuthClientCreateTReqBody"],
        [W8.PopTokenGenerateCnf, "PopTGenCnf"],
        [W8.PopTokenGenerateKid, "PopTGenKid"],
        [W8.HandleServerTokenResponse, "HandleServerTRes"],
        [W8.DeserializeResponse, "DeserializeRes"],
        [W8.AuthorityFactoryCreateDiscoveredInstance, "AuthFactCreateDiscInst"],
        [W8.AuthorityResolveEndpointsAsync, "AuthResolveEndpointsAsync"],
        [W8.AuthorityResolveEndpointsFromLocalSources, "AuthResolveEndpointsFromLocal"],
        [W8.AuthorityGetCloudDiscoveryMetadataFromNetwork, "AuthGetCDMetaFromNet"],
        [W8.AuthorityUpdateCloudDiscoveryMetadata, "AuthUpdCDMeta"],
        [W8.AuthorityGetEndpointMetadataFromNetwork, "AuthUpdCDMetaFromNet"],
        [W8.AuthorityUpdateEndpointMetadata, "AuthUpdEndpointMeta"],
        [W8.AuthorityUpdateMetadataWithRegionalInformation, "AuthUpdMetaWithRegInfo"],
        [W8.RegionDiscoveryDetectRegion, "RegDiscDetectReg"],
        [W8.RegionDiscoveryGetRegionFromIMDS, "RegDiscGetRegFromIMDS"],
        [W8.RegionDiscoveryGetCurrentVersion, "RegDiscGetCurrentVer"],
        [W8.AcquireTokenByCodeAsync, "ATByCodeAsync"],
        [W8.GetEndpointMetadataFromNetwork, "GetEndpointMetaFromNet"],
        [W8.GetCloudDiscoveryMetadataFromNetworkMeasurement, "GetCDMetaFromNet"],
        [W8.HandleRedirectPromiseMeasurement, "HandleRedirectPromise"],
        [W8.HandleNativeRedirectPromiseMeasurement, "HandleNtvRedirectPromise"],
        [W8.UpdateCloudDiscoveryMetadataMeasurement, "UpdateCDMeta"],
        [W8.UsernamePasswordClientAcquireToken, "UserPassClientAT"],
        [W8.NativeMessageHandlerHandshake, "NtvMsgHandlerHandshake"],
        [W8.NativeGenerateAuthResult, "NtvGenAuthRes"],
        [W8.RemoveHiddenIframe, "RemoveHiddenIframe"],
        [W8.ClearTokensAndKeysWithClaims, "ClearTAndKeysWithClaims"],
        [W8.CacheManagerGetRefreshToken, "CacheManagerGetRT"],
        [W8.GeneratePkceCodes, "GenPkceCodes"],
        [W8.GenerateCodeVerifier, "GenCodeVerifier"],
        [W8.GenerateCodeChallengeFromVerifier, "GenCodeChallengeFromVerifier"],
        [W8.Sha256Digest, "Sha256Digest"],
        [W8.GetRandomValues, "GetRandomValues"],
        [W8.GenerateHKDF, "genHKDF"],
        [W8.GenerateBaseKey, "genBaseKey"],
        [W8.Base64Decode, "b64Decode"],
        [W8.UrlEncodeArr, "urlEncArr"],
        [W8.Encrypt, "encrypt"],
        [W8.Decrypt, "decrypt"],
        [W8.GenerateEarKey, "genEarKey"],
        [W8.DecryptEarResponse, "decryptEarResp"]
    ]), lp7 = {
        NotStarted: 0,
        InProgress: 1,
        Completed: 2
    }
})
// @from(Ln 180425, Col 0)
class aX8 {
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
// @from(Ln 180436, Col 0)
class yP6 {
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
                status: lp7.InProgress,
                authority: "",
                libraryName: "",
                libraryVersion: "",
                clientId: "",
                name: A,
                startTimeMs: Date.now(),
                correlationId: q || ""
            },
            measurement: new aX8
        }
    }
    startPerformanceMeasurement() {
        return new aX8
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
// @from(Ln 180497, Col 4)
sX8 = E(() => {
    rC(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 180501, Col 0)
function ip7({
    authOptions: A,
    systemOptions: q,
    loggerOptions: K,
    cacheOptions: Y,
    storageInterface: z,
    networkInterface: _,
    cryptoInterface: w,
    clientCredentials: O,
    libraryInfo: $,
    telemetry: H,
    serverTelemetryManager: j,
    persistencePlugin: J,
    serializableCache: M
}) {
    let D = {
        ...e39,
        ...K
    };
    return {
        authOptions: w99(A),
        systemOptions: {
            ...t39,
            ...q
        },
        loggerOptions: D,
        cacheOptions: {
            ...A99,
            ...Y
        },
        storageInterface: z || new gj1(A.clientId, fP6, new kv(D), new yP6),
        networkInterface: _ || q99,
        cryptoInterface: w || fP6,
        clientCredentials: O || Y99,
        libraryInfo: {
            ...K99,
            ...$
        },
        telemetry: {
            ..._99,
            ...H
        },
        serverTelemetryManager: j || null,
        persistencePlugin: J || null,
        serializableCache: M || null
    }
}
// @from(Ln 180549, Col 0)
function w99(A) {
    return {
        clientCapabilities: [],
        azureCloudOptions: z99,
        skipAuthorityMetadataCache: !1,
        instanceAware: !1,
        encodeExtraQueryParams: !1,
        ...A
    }
}
// @from(Ln 180560, Col 0)
function Fj1(A) {
    return A.authOptions.authority.options.protocolMode === iW.OIDC
}
// @from(Ln 180563, Col 4)
t39
// @from(Ln 180563, Col 9)
e39
// @from(Ln 180563, Col 14)
A99
// @from(Ln 180563, Col 19)
q99
// @from(Ln 180563, Col 24)
K99
// @from(Ln 180563, Col 29)
Y99
// @from(Ln 180563, Col 34)
z99
// @from(Ln 180563, Col 39)
_99
// @from(Ln 180564, Col 4)
pj1 = E(() => {
    BX8();
    Rj1();
    bw();
    Sj1();
    Cj1();
    oX8();
    MB6();
    cJ();
    sX8();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    t39 = {
        tokenRenewalOffsetSeconds: ZP6,
        preventCorsPreflight: !1
    }, e39 = {
        loggerCallback: () => {},
        piiLoggingEnabled: !1,
        logLevel: l$.Info,
        correlationId: S8.EMPTY_STRING
    }, A99 = {
        claimsBasedCachingEnabled: !1
    }, q99 = {
        async sendGetRequestAsync() {
            throw t8(G3)
        },
        async sendPostRequestAsync() {
            throw t8(G3)
        }
    }, K99 = {
        sku: S8.SKU,
        version: TP6,
        cpu: S8.EMPTY_STRING,
        os: S8.EMPTY_STRING
    }, Y99 = {
        clientSecret: S8.EMPTY_STRING,
        clientAssertion: void 0
    }, z99 = {
        azureCloudInstance: sU.None,
        tenant: `${S8.DEFAULT_COMMON_TENANT}`
    }, _99 = {
        application: {
            appName: "",
            appVersion: ""
        }
    }
})
// @from(Ln 180610, Col 4)
aG
// @from(Ln 180611, Col 4)
WB6 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    aG = {
        HOME_ACCOUNT_ID: "home_account_id",
        UPN: "UPN"
    }
})
// @from(Ln 180618, Col 4)
v56 = {}
// @from(Ln 180679, Col 4)
om = "client_id"
// @from(Ln 180680, Col 4)
Qj1 = "redirect_uri"
// @from(Ln 180681, Col 4)
tX8 = "response_type"
// @from(Ln 180682, Col 4)
eX8 = "response_mode"
// @from(Ln 180683, Col 4)
AP8 = "grant_type"
// @from(Ln 180684, Col 4)
qP8 = "claims"
// @from(Ln 180685, Col 4)
KP8 = "scope"
// @from(Ln 180686, Col 4)
O99 = "error"
// @from(Ln 180687, Col 4)
$99 = "error_description"
// @from(Ln 180688, Col 4)
H99 = "access_token"
// @from(Ln 180689, Col 4)
j99 = "id_token"
// @from(Ln 180690, Col 4)
YP8 = "refresh_token"
// @from(Ln 180691, Col 4)
J99 = "expires_in"
// @from(Ln 180692, Col 4)
M99 = "refresh_token_expires_in"
// @from(Ln 180693, Col 4)
zP8 = "state"
// @from(Ln 180694, Col 4)
_P8 = "nonce"
// @from(Ln 180695, Col 4)
wP8 = "prompt"
// @from(Ln 180696, Col 4)
D99 = "session_state"
// @from(Ln 180697, Col 4)
X99 = "client_info"
// @from(Ln 180698, Col 4)
OP8 = "code"
// @from(Ln 180699, Col 4)
$P8 = "code_challenge"
// @from(Ln 180700, Col 4)
HP8 = "code_challenge_method"
// @from(Ln 180701, Col 4)
jP8 = "code_verifier"
// @from(Ln 180702, Col 4)
JP8 = "client-request-id"
// @from(Ln 180703, Col 4)
MP8 = "x-client-SKU"
// @from(Ln 180704, Col 4)
DP8 = "x-client-VER"
// @from(Ln 180705, Col 4)
XP8 = "x-client-OS"
// @from(Ln 180706, Col 4)
PP8 = "x-client-CPU"
// @from(Ln 180707, Col 4)
WP8 = "x-client-current-telemetry"
// @from(Ln 180708, Col 4)
ZP8 = "x-client-last-telemetry"
// @from(Ln 180709, Col 4)
GP8 = "x-ms-lib-capability"
// @from(Ln 180710, Col 4)
fP8 = "x-app-name"
// @from(Ln 180711, Col 4)
TP8 = "x-app-ver"
// @from(Ln 180712, Col 4)
vP8 = "post_logout_redirect_uri"
// @from(Ln 180713, Col 4)
NP8 = "id_token_hint"
// @from(Ln 180714, Col 4)
VP8 = "device_code"
// @from(Ln 180715, Col 4)
kP8 = "client_secret"
// @from(Ln 180716, Col 4)
EP8 = "client_assertion"
// @from(Ln 180717, Col 4)
yP8 = "client_assertion_type"
// @from(Ln 180718, Col 4)
Uj1 = "token_type"
// @from(Ln 180719, Col 4)
dj1 = "req_cnf"
// @from(Ln 180720, Col 4)
LP8 = "assertion"
// @from(Ln 180721, Col 4)
RP8 = "requested_token_use"
// @from(Ln 180722, Col 4)
P99 = "on_behalf_of"
// @from(Ln 180723, Col 4)
W99 = "foci"
// @from(Ln 180724, Col 4)
Z99 = "X-AnchorMailbox"
// @from(Ln 180725, Col 4)
cj1 = "return_spa_code"
// @from(Ln 180726, Col 4)
hP8 = "nativebroker"
// @from(Ln 180727, Col 4)
SP8 = "logout_hint"
// @from(Ln 180728, Col 4)
CP8 = "sid"
// @from(Ln 180729, Col 4)
IP8 = "login_hint"
// @from(Ln 180730, Col 4)
bP8 = "domain_hint"
// @from(Ln 180731, Col 4)
G99 = "x-client-xtra-sku"
// @from(Ln 180732, Col 4)
ZB6 = "brk_client_id"
// @from(Ln 180733, Col 4)
lj1 = "brk_redirect_uri"
// @from(Ln 180734, Col 4)
LP6 = "instance_aware"
// @from(Ln 180735, Col 4)
xP8 = "ear_jwk"
// @from(Ln 180736, Col 4)
uP8 = "ear_jwe_crypto"
// @from(Ln 180737, Col 4)
RP6 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 180739, Col 4)
q4 = {}
// @from(Ln 180789, Col 0)
function N56(A, q, K) {
    if (!q) return;
    let Y = A.get(om);
    if (Y && A.has(ZB6)) K?.addFields({
        embeddedClientId: Y,
        embeddedRedirectUri: A.get(Qj1)
    }, q)
}
// @from(Ln 180798, Col 0)
function f99(A, q) {
    A.set(tX8, q)
}
// @from(Ln 180802, Col 0)
function mP8(A, q) {
    A.set(eX8, q ? q : cm.QUERY)
}
// @from(Ln 180806, Col 0)
function T99(A) {
    A.set(hP8, "1")
}
// @from(Ln 180810, Col 0)
function V56(A, q, K = !0, Y = lW) {
    if (K && !Y.includes("openid") && !q.includes("openid")) Y.push("openid");
    let z = K ? [...q || [], ...Y] : q || [],
        _ = new UH(z);
    A.set(KP8, _.printScopes())
}
// @from(Ln 180817, Col 0)
function k56(A, q) {
    A.set(om, q)
}
// @from(Ln 180821, Col 0)
function E56(A, q) {
    A.set(Qj1, q)
}
// @from(Ln 180825, Col 0)
function BP8(A, q) {
    A.set(vP8, q)
}
// @from(Ln 180829, Col 0)
function gP8(A, q) {
    A.set(NP8, q)
}
// @from(Ln 180833, Col 0)
function FP8(A, q) {
    A.set(bP8, q)
}
// @from(Ln 180837, Col 0)
function hP6(A, q) {
    A.set(IP8, q)
}
// @from(Ln 180841, Col 0)
function ps(A, q) {
    A.set(Iw.CCS_HEADER, `UPN:${q}`)
}
// @from(Ln 180845, Col 0)
function qd(A, q) {
    A.set(Iw.CCS_HEADER, `Oid:${q.uid}@${q.utid}`)
}
// @from(Ln 180849, Col 0)
function ij1(A, q) {
    A.set(CP8, q)
}
// @from(Ln 180853, Col 0)
function y56(A, q, K) {
    let Y = np7(q, K);
    try {
        JSON.parse(Y)
    } catch (z) {
        throw J2(us)
    }
    A.set(qP8, Y)
}
// @from(Ln 180863, Col 0)
function L56(A, q) {
    A.set(JP8, q)
}
// @from(Ln 180867, Col 0)
function GB6(A, q) {
    if (A.set(MP8, q.sku), A.set(DP8, q.version), q.os) A.set(XP8, q.os);
    if (q.cpu) A.set(PP8, q.cpu)
}
// @from(Ln 180872, Col 0)
function fB6(A, q) {
    if (q?.appName) A.set(fP8, q.appName);
    if (q?.appVersion) A.set(TP8, q.appVersion)
}
// @from(Ln 180877, Col 0)
function pP8(A, q) {
    A.set(wP8, q)
}
// @from(Ln 180881, Col 0)
function TB6(A, q) {
    if (q) A.set(zP8, q)
}
// @from(Ln 180885, Col 0)
function QP8(A, q) {
    A.set(_P8, q)
}
// @from(Ln 180889, Col 0)
function v99(A, q, K) {
    if (q && K) A.set($P8, q), A.set(HP8, K);
    else throw J2(W56)
}
// @from(Ln 180894, Col 0)
function UP8(A, q) {
    A.set(OP8, q)
}
// @from(Ln 180898, Col 0)
function N99(A, q) {
    A.set(VP8, q)
}
// @from(Ln 180902, Col 0)
function dP8(A, q) {
    A.set(YP8, q)
}
// @from(Ln 180906, Col 0)
function cP8(A, q) {
    A.set(jP8, q)
}
// @from(Ln 180910, Col 0)
function vB6(A, q) {
    A.set(kP8, q)
}
// @from(Ln 180914, Col 0)
function NB6(A, q) {
    if (q) A.set(EP8, q)
}
// @from(Ln 180918, Col 0)
function VB6(A, q) {
    if (q) A.set(yP8, q)
}
// @from(Ln 180922, Col 0)
function V99(A, q) {
    A.set(LP8, q)
}
// @from(Ln 180926, Col 0)
function k99(A, q) {
    A.set(RP8, q)
}
// @from(Ln 180930, Col 0)
function kB6(A, q) {
    A.set(AP8, q)
}
// @from(Ln 180934, Col 0)
function R56(A) {
    A.set(bp7, "1")
}
// @from(Ln 180938, Col 0)
function EB6(A) {
    if (!A.has(LP6)) A.set(LP6, "true")
}
// @from(Ln 180942, Col 0)
function Kd(A, q) {
    Object.entries(q).forEach(([K, Y]) => {
        if (!A.has(K) && Y) A.set(K, Y)
    })
}
// @from(Ln 180948, Col 0)
function np7(A, q) {
    let K;
    if (!A) K = {};
    else try {
        K = JSON.parse(A)
    } catch (Y) {
        throw J2(us)
    }
    if (q && q.length > 0) {
        if (!K.hasOwnProperty(cK6.ACCESS_TOKEN)) K[cK6.ACCESS_TOKEN] = {};
        K[cK6.ACCESS_TOKEN][cK6.XMS_CC] = {
            values: q
        }
    }
    return JSON.stringify(K)
}
// @from(Ln 180965, Col 0)
function E99(A, q) {
    A.set(mm6.username, q)
}
// @from(Ln 180969, Col 0)
function y99(A, q) {
    A.set(mm6.password, q)
}
// @from(Ln 180973, Col 0)
function yB6(A, q) {
    if (q) A.set(Uj1, k9.POP), A.set(dj1, q)
}
// @from(Ln 180977, Col 0)
function LB6(A, q) {
    if (q) A.set(Uj1, k9.SSH), A.set(dj1, q)
}
// @from(Ln 180981, Col 0)
function RB6(A, q) {
    A.set(WP8, q.generateCurrentRequestHeaderValue()), A.set(ZP8, q.generateLastRequestHeaderValue())
}
// @from(Ln 180985, Col 0)
function hB6(A) {
    A.set(GP8, lm.X_MS_LIB_CAPABILITY_VALUE)
}
// @from(Ln 180989, Col 0)
function lP8(A, q) {
    A.set(SP8, q)
}
// @from(Ln 180993, Col 0)
function Yd(A, q, K) {
    if (!A.has(ZB6)) A.set(ZB6, q);
    if (!A.has(lj1)) A.set(lj1, K)
}
// @from(Ln 180998, Col 0)
function L99(A, q) {
    A.set(xP8, encodeURIComponent(q));
    let K = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0";
    A.set(uP8, K)
}
// @from(Ln 181004, Col 0)
function R99(A, q) {
    Object.entries(q).forEach(([K, Y]) => {
        if (Y) A.set(K, Y)
    })
}
// @from(Ln 181009, Col 4)
SP6 = E(() => {
    bw();
    RP6();
    jB6();
    Bs();
    eU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 181017, Col 0)
function rp7(A) {
    return A.hasOwnProperty("authorization_endpoint") && A.hasOwnProperty("token_endpoint") && A.hasOwnProperty("issuer") && A.hasOwnProperty("jwks_uri")
}
// @from(Ln 181020, Col 4)
op7 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181023, Col 0)
function ap7(A) {
    return A.hasOwnProperty("tenant_discovery_endpoint") && A.hasOwnProperty("metadata")
}
// @from(Ln 181026, Col 4)
sp7 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181029, Col 0)
function tp7(A) {
    return A.hasOwnProperty("error") && A.hasOwnProperty("error_description")
}
// @from(Ln 181032, Col 4)
ep7 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181034, Col 4)
AQ7 = (A, q, K, Y, z) => {
        return (..._) => {
            K.trace(`Executing function ${q}`);
            let w = Y?.startMeasurement(q, z);
            if (z) {
                let O = q + "CallCount";
                Y?.incrementFields({
                    [O]: 1
                }, z)
            }
            try {
                let O = A(..._);
                return w?.end({
                    success: !0
                }), K.trace(`Returning result from ${q}`), O
            } catch (O) {
                K.trace(`Error occurred in ${q}`);
                try {
                    K.trace(JSON.stringify(O))
                } catch ($) {
                    K.trace("Unable to print error message.")
                }
                throw w?.end({
                    success: !1
                }, O), O
            }
        }
    }
// @from(Ln 181062, Col 4)
c9 = (A, q, K, Y, z) => {
        return (..._) => {
            K.trace(`Executing function ${q}`);
            let w = Y?.startMeasurement(q, z);
            if (z) {
                let O = q + "CallCount";
                Y?.incrementFields({
                    [O]: 1
                }, z)
            }
            return Y?.setPreQueueTime(q, z), A(..._).then((O) => {
                return K.trace(`Returning result from ${q}`), w?.end({
                    success: !0
                }), O
            }).catch((O) => {
                K.trace(`Error occurred in ${q}`);
                try {
                    K.trace(JSON.stringify(O))
                } catch ($) {
                    K.trace("Unable to print error message.")
                }
                throw w?.end({
                    success: !1
                }, O), O
            })
        }
    }
// @from(Ln 181089, Col 4)
zd = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181091, Col 0)
class SB6 {
    constructor(A, q, K, Y) {
        this.networkInterface = A, this.logger = q, this.performanceClient = K, this.correlationId = Y
    }
    async detectRegion(A, q) {
        this.performanceClient?.addQueueMeasurement(W8.RegionDiscoveryDetectRegion, this.correlationId);
        let K = A;
        if (!K) {
            let Y = SB6.IMDS_OPTIONS;
            try {
                let z = await c9(this.getRegionFromIMDS.bind(this), W8.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(S8.IMDS_VERSION, Y);
                if (z.status === f5.SUCCESS) K = z.body, q.region_source = iK6.IMDS;
                if (z.status === f5.BAD_REQUEST) {
                    let _ = await c9(this.getCurrentVersion.bind(this), W8.RegionDiscoveryGetCurrentVersion, this.logger, this.performanceClient, this.correlationId)(Y);
                    if (!_) return q.region_source = iK6.FAILED_AUTO_DETECTION, null;
                    let w = await c9(this.getRegionFromIMDS.bind(this), W8.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(_, Y);
                    if (w.status === f5.SUCCESS) K = w.body, q.region_source = iK6.IMDS
                }
            } catch (z) {
                return q.region_source = iK6.FAILED_AUTO_DETECTION, null
            }
        } else q.region_source = iK6.ENVIRONMENT_VARIABLE;
        if (!K) q.region_source = iK6.FAILED_AUTO_DETECTION;
        return K || null
    }
    async getRegionFromIMDS(A, q) {
        return this.performanceClient?.addQueueMeasurement(W8.RegionDiscoveryGetRegionFromIMDS, this.correlationId), this.networkInterface.sendGetRequestAsync(`${S8.IMDS_ENDPOINT}?api-version=${A}&format=text`, q, S8.IMDS_TIMEOUT)
    }
    async getCurrentVersion(A) {
        this.performanceClient?.addQueueMeasurement(W8.RegionDiscoveryGetCurrentVersion, this.correlationId);
        try {
            let q = await this.networkInterface.sendGetRequestAsync(`${S8.IMDS_ENDPOINT}?format=json`, A);
            if (q.status === f5.BAD_REQUEST && q.body && q.body["newest-versions"] && q.body["newest-versions"].length > 0) return q.body["newest-versions"][0];
            return null
        } catch (q) {
            return null
        }
    }
}
// @from(Ln 181130, Col 4)
qQ7 = E(() => {
    bw();
    rC();
    zd(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    SB6.IMDS_OPTIONS = {
        headers: {
            Metadata: "true"
        }
    }
})
// @from(Ln 181140, Col 4)
ZO = {}
// @from(Ln 181151, Col 0)
function Tk() {
    return Math.round(new Date().getTime() / 1000)
}
// @from(Ln 181155, Col 0)
function h99(A) {
    return A.getTime() / 1000
}
// @from(Ln 181159, Col 0)
function CB6(A) {
    if (A) return new Date(Number(A) * 1000);
    return new Date
}
// @from(Ln 181164, Col 0)
function CP6(A, q) {
    let K = Number(A) || 0;
    return Tk() + q > K
}
// @from(Ln 181169, Col 0)
function S99(A, q) {
    let K = Number(A) + q * 24 * 60 * 60 * 1000;
    return Date.now() > K
}
// @from(Ln 181174, Col 0)
function iP8(A) {
    return Number(A) > Tk()
}
// @from(Ln 181178, Col 0)
function C99(A, q) {
    return new Promise((K) => setTimeout(() => K(q), A))
}
// @from(Ln 181181, Col 4)
Qs = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181183, Col 4)
sG = {}
// @from(Ln 181203, Col 0)
function nP8(A, q, K, Y, z) {
    return {
        credentialType: D_.ID_TOKEN,
        homeAccountId: A,
        environment: q,
        clientId: Y,
        secret: K,
        realm: z,
        lastUpdatedAt: Date.now().toString()
    }
}
// @from(Ln 181215, Col 0)
function rP8(A, q, K, Y, z, _, w, O, $, H, j, J, M, D, X) {
    let P = {
        homeAccountId: A,
        credentialType: D_.ACCESS_TOKEN,
        secret: K,
        cachedAt: Tk().toString(),
        expiresOn: w.toString(),
        extendedExpiresOn: O.toString(),
        environment: q,
        clientId: Y,
        realm: z,
        target: _,
        tokenType: j || k9.BEARER,
        lastUpdatedAt: Date.now().toString()
    };
    if (J) P.userAssertionHash = J;
    if (H) P.refreshOn = H.toString();
    if (D) P.requestedClaims = D, P.requestedClaimsHash = X;
    if (P.tokenType?.toLowerCase() !== k9.BEARER.toLowerCase()) switch (P.credentialType = D_.ACCESS_TOKEN_WITH_AUTH_SCHEME, P.tokenType) {
        case k9.POP:
            let W = Ad(K, $);
            if (!W?.cnf?.kid) throw t8(w56);
            P.keyId = W.cnf.kid;
            break;
        case k9.SSH:
            P.keyId = M
    }
    return P
}
// @from(Ln 181245, Col 0)
function oP8(A, q, K, Y, z, _, w) {
    let O = {
        credentialType: D_.REFRESH_TOKEN,
        homeAccountId: A,
        environment: q,
        clientId: Y,
        secret: K,
        lastUpdatedAt: Date.now().toString()
    };
    if (_) O.userAssertionHash = _;
    if (z) O.familyId = z;
    if (w) O.expiresOn = w.toString();
    return O
}
// @from(Ln 181260, Col 0)
function nj1(A) {
    return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("credentialType") && A.hasOwnProperty("clientId") && A.hasOwnProperty("secret")
}
// @from(Ln 181264, Col 0)
function I99(A) {
    if (!A) return !1;
    return nj1(A) && A.hasOwnProperty("realm") && A.hasOwnProperty("target") && (A.credentialType === D_.ACCESS_TOKEN || A.credentialType === D_.ACCESS_TOKEN_WITH_AUTH_SCHEME)
}
// @from(Ln 181269, Col 0)
function b99(A) {
    if (!A) return !1;
    return nj1(A) && A.hasOwnProperty("realm") && A.credentialType === D_.ID_TOKEN
}
// @from(Ln 181274, Col 0)
function x99(A) {
    if (!A) return !1;
    return nj1(A) && A.credentialType === D_.REFRESH_TOKEN
}
// @from(Ln 181279, Col 0)
function u99(A, q) {
    let K = A.indexOf(UM.CACHE_KEY) === 0,
        Y = !0;
    if (q) Y = q.hasOwnProperty("failedRequests") && q.hasOwnProperty("errors") && q.hasOwnProperty("cacheHits");
    return K && Y
}
// @from(Ln 181286, Col 0)
function m99(A, q) {
    let K = !1;
    if (A) K = A.indexOf(lm.THROTTLING_PREFIX) === 0;
    let Y = !0;
    if (q) Y = q.hasOwnProperty("throttleTime");
    return K && Y
}
// @from(Ln 181294, Col 0)
function B99({
    environment: A,
    clientId: q
}) {
    return [xm6, A, q].join(iU.CACHE_KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 181301, Col 0)
function g99(A, q) {
    if (!q) return !1;
    return A.indexOf(xm6) === 0 && q.hasOwnProperty("clientId") && q.hasOwnProperty("environment")
}
// @from(Ln 181306, Col 0)
function F99(A, q) {
    if (!q) return !1;
    return A.indexOf(WP6.CACHE_KEY) === 0 && q.hasOwnProperty("aliases") && q.hasOwnProperty("preferred_cache") && q.hasOwnProperty("preferred_network") && q.hasOwnProperty("canonical_authority") && q.hasOwnProperty("authorization_endpoint") && q.hasOwnProperty("token_endpoint") && q.hasOwnProperty("issuer") && q.hasOwnProperty("aliasesFromNetwork") && q.hasOwnProperty("endpointsFromNetwork") && q.hasOwnProperty("expiresAt") && q.hasOwnProperty("jwks_uri")
}
// @from(Ln 181311, Col 0)
function rj1() {
    return Tk() + WP6.REFRESH_TIME_SECONDS
}
// @from(Ln 181315, Col 0)
function IP6(A, q, K) {
    A.authorization_endpoint = q.authorization_endpoint, A.token_endpoint = q.token_endpoint, A.end_session_endpoint = q.end_session_endpoint, A.issuer = q.issuer, A.endpointsFromNetwork = K, A.jwks_uri = q.jwks_uri
}
// @from(Ln 181319, Col 0)
function IB6(A, q, K) {
    A.aliases = q.aliases, A.preferred_cache = q.preferred_cache, A.preferred_network = q.preferred_network, A.aliasesFromNetwork = K
}
// @from(Ln 181323, Col 0)
function oj1(A) {
    return A.expiresAt <= Tk()
}
// @from(Ln 181326, Col 4)
aj1 = E(() => {
    EP6();
    cJ();
    bw();
    Qs();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 181333, Col 0)
class dM {
    constructor(A, q, K, Y, z, _, w, O) {
        this.canonicalAuthority = A, this._canonicalAuthority.validateAsUri(), this.networkInterface = q, this.cacheManager = K, this.authorityOptions = Y, this.regionDiscoveryMetadata = {
            region_used: void 0,
            region_source: void 0,
            region_outcome: void 0
        }, this.logger = z, this.performanceClient = w, this.correlationId = _, this.managedIdentity = O || !1, this.regionDiscovery = new SB6(q, this.logger, this.performanceClient, this.correlationId)
    }
    getAuthorityType(A) {
        if (A.HostNameAndPort.endsWith(S8.CIAM_AUTH_URL)) return dL.Ciam;
        let q = A.PathSegments;
        if (q.length) switch (q[0].toLowerCase()) {
            case S8.ADFS:
                return dL.Adfs;
            case S8.DSTS:
                return dL.Dsts
        }
        return dL.Default
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
        this._canonicalAuthority = new U5(A), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null
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
        else throw t8(oG)
    }
    get tokenEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint);
        else throw t8(oG)
    }
    get deviceCodeEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
        else throw t8(oG)
    }
    get endSessionEndpoint() {
        if (this.discoveryComplete()) {
            if (!this.metadata.end_session_endpoint) throw t8($56);
            return this.replacePath(this.metadata.end_session_endpoint)
        } else throw t8(oG)
    }
    get selfSignedJwtAudience() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.issuer);
        else throw t8(oG)
    }
    get jwksUri() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.jwks_uri);
        else throw t8(oG)
    }
    canReplaceTenant(A) {
        return A.PathSegments.length === 1 && !dM.reservedTenantDomains.has(A.PathSegments[0]) && this.getAuthorityType(A) === dL.Default && this.protocolMode !== iW.OIDC
    }
    replaceTenant(A) {
        return A.replace(/{tenant}|{tenantid}/g, this.tenant)
    }
    replacePath(A) {
        let q = A,
            Y = new U5(this.metadata.canonical_authority).getUrlComponents(),
            z = Y.PathSegments;
        return this.canonicalAuthorityUrlComponents.PathSegments.forEach((w, O) => {
            let $ = z[O];
            if (O === 0 && this.canReplaceTenant(Y)) {
                let H = new U5(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
                if ($ !== H) this.logger.verbose(`Replacing tenant domain name ${$} with id ${H}`), $ = H
            }
            if (w !== $) q = q.replace(`/${$}/`, `/${w}/`)
        }), this.replaceTenant(q)
    }
    get defaultOpenIdConfigurationEndpoint() {
        let A = this.hostnameAndPort;
        if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === dL.Adfs || this.protocolMode === iW.OIDC && !this.isAliasOfKnownMicrosoftAuthority(A)) return `${this.canonicalAuthority}.well-known/openid-configuration`;
        return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`
    }
    discoveryComplete() {
        return !!this.metadata
    }
    async resolveEndpointsAsync() {
        this.performanceClient?.addQueueMeasurement(W8.AuthorityResolveEndpointsAsync, this.correlationId);
        let A = this.getCurrentMetadataEntity(),
            q = await c9(this.updateCloudDiscoveryMetadata.bind(this), W8.AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(A);
        this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, A.preferred_network);
        let K = await c9(this.updateEndpointMetadata.bind(this), W8.AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(A);
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
            expiresAt: rj1(),
            jwks_uri: ""
        };
        return A
    }
    updateCachedMetadata(A, q, K) {
        if (q !== rG.CACHE && K?.source !== rG.CACHE) A.expiresAt = rj1(), A.canonical_authority = this.canonicalAuthority;
        let Y = this.cacheManager.generateAuthorityMetadataCacheKey(A.preferred_cache);
        this.cacheManager.setAuthorityMetadata(Y, A), this.metadata = A
    }
    async updateEndpointMetadata(A) {
        this.performanceClient?.addQueueMeasurement(W8.AuthorityUpdateEndpointMetadata, this.correlationId);
        let q = this.updateEndpointMetadataFromLocalSources(A);
        if (q) {
            if (q.source === rG.HARDCODED_VALUES) {
                if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
                    if (q.metadata) {
                        let Y = await c9(this.updateMetadataWithRegionalInformation.bind(this), W8.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(q.metadata);
                        IP6(A, Y, !1), A.canonical_authority = this.canonicalAuthority
                    }
                }
            }
            return q.source
        }
        let K = await c9(this.getEndpointMetadataFromNetwork.bind(this), W8.AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
        if (K) {
            if (this.authorityOptions.azureRegionConfiguration?.azureRegion) K = await c9(this.updateMetadataWithRegionalInformation.bind(this), W8.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(K);
            return IP6(A, K, !0), rG.NETWORK
        } else throw t8(aK6, this.defaultOpenIdConfigurationEndpoint)
    }
    updateEndpointMetadataFromLocalSources(A) {
        this.logger.verbose("Attempting to get endpoint metadata from authority configuration");
        let q = this.getEndpointMetadataFromConfig();
        if (q) return this.logger.verbose("Found endpoint metadata in authority configuration"), IP6(A, q, !1), {
            source: rG.CONFIG
        };
        if (this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."), this.authorityOptions.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");
        else {
            let Y = this.getEndpointMetadataFromHardcodedValues();
            if (Y) return IP6(A, Y, !1), {
                source: rG.HARDCODED_VALUES,
                metadata: Y
            };
            else this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")
        }
        let K = oj1(A);
        if (this.isAuthoritySameType(A) && A.endpointsFromNetwork && !K) return this.logger.verbose("Found endpoint metadata in the cache."), {
            source: rG.CACHE
        };
        else if (K) this.logger.verbose("The metadata entity is expired.");
        return null
    }
    isAuthoritySameType(A) {
        return new U5(A.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length
    }
    getEndpointMetadataFromConfig() {
        if (this.authorityOptions.authorityMetadata) try {
            return JSON.parse(this.authorityOptions.authorityMetadata)
        } catch (A) {
            throw J2(Z56)
        }
        return null
    }
    async getEndpointMetadataFromNetwork() {
        this.performanceClient?.addQueueMeasurement(W8.AuthorityGetEndpointMetadataFromNetwork, this.correlationId);
        let A = {},
            q = this.defaultOpenIdConfigurationEndpoint;
        this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${q}`);
        try {
            let K = await this.networkInterface.sendGetRequestAsync(q, A);
            if (rp7(K.body)) return K.body;
            else return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"), null
        } catch (K) {
            return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${K}`), null
        }
    }
    getEndpointMetadataFromHardcodedValues() {
        if (this.hostnameAndPort in dX8) return dX8[this.hostnameAndPort];
        return null
    }
    async updateMetadataWithRegionalInformation(A) {
        this.performanceClient?.addQueueMeasurement(W8.AuthorityUpdateMetadataWithRegionalInformation, this.correlationId);
        let q = this.authorityOptions.azureRegionConfiguration?.azureRegion;
        if (q) {
            if (q !== S8.AZURE_REGION_AUTO_DISCOVER_FLAG) return this.regionDiscoveryMetadata.region_outcome = yj1.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = q, dM.replaceWithRegionalInformation(A, q);
            let K = await c9(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), W8.RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
            if (K) return this.regionDiscoveryMetadata.region_outcome = yj1.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = K, dM.replaceWithRegionalInformation(A, K);
            this.regionDiscoveryMetadata.region_outcome = yj1.AUTO_DETECTION_REQUESTED_FAILED
        }
        return A
    }
    async updateCloudDiscoveryMetadata(A) {
        this.performanceClient?.addQueueMeasurement(W8.AuthorityUpdateCloudDiscoveryMetadata, this.correlationId);
        let q = this.updateCloudDiscoveryMetadataFromLocalSources(A);
        if (q) return q;
        let K = await c9(this.getCloudDiscoveryMetadataFromNetwork.bind(this), W8.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
        if (K) return IB6(A, K, !0), rG.NETWORK;
        throw J2(G56)
    }
    updateCloudDiscoveryMetadataFromLocalSources(A) {
        this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"), this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||S8.NOT_APPLICABLE}`), this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||S8.NOT_APPLICABLE}`), this.logger.verbosePii(`Canonical Authority: ${A.canonical_authority||S8.NOT_APPLICABLE}`);
        let q = this.getCloudDiscoveryMetadataFromConfig();
        if (q) return this.logger.verbose("Found cloud discovery metadata in authority configuration"), IB6(A, q, !1), rG.CONFIG;
        if (this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."), this.options.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");
        else {
            let Y = Qp7(this.hostnameAndPort);
            if (Y) return this.logger.verbose("Found cloud discovery metadata from hardcoded values."), IB6(A, Y, !1), rG.HARDCODED_VALUES;
            this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")
        }
        let K = oj1(A);
        if (this.isAuthoritySameType(A) && A.aliasesFromNetwork && !K) return this.logger.verbose("Found cloud discovery metadata in the cache."), rG.CACHE;
        else if (K) this.logger.verbose("The metadata entity is expired.");
        return null
    }
    getCloudDiscoveryMetadataFromConfig() {
        if (this.authorityType === dL.Ciam) return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."), dM.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        if (this.authorityOptions.cloudDiscoveryMetadata) {
            this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");
            try {
                this.logger.verbose("Attempting to parse the cloud discovery metadata.");
                let A = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),
                    q = XB6(A.metadata, this.hostnameAndPort);
                if (this.logger.verbose("Parsed the cloud discovery metadata."), q) return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."), q;
                else this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")
            } catch (A) {
                throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."), J2(ms)
            }
        }
        if (this.isInKnownAuthorities()) return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."), dM.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        return null
    }
    async getCloudDiscoveryMetadataFromNetwork() {
        this.performanceClient?.addQueueMeasurement(W8.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.correlationId);
        let A = `${S8.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,
            q = {},
            K = null;
        try {
            let Y = await this.networkInterface.sendGetRequestAsync(A, q),
                z, _;
            if (ap7(Y.body)) z = Y.body, _ = z.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: ${z.tenant_discovery_endpoint}`);
            else if (tp7(Y.body)) {
                if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${Y.status}`), z = Y.body, z.error === S8.INVALID_INSTANCE) return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."), null;
                this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${z.error}`), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${z.error_description}`), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"), _ = []
            } else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"), null;
            this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."), K = XB6(_, this.hostnameAndPort)
        } catch (Y) {
            if (Y instanceof T5) this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
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
        if (!K) this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."), this.logger.verbose("Creating custom Authority for custom domain scenario."), K = dM.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        return K
    }
    isInKnownAuthorities() {
        return this.authorityOptions.knownAuthorities.filter((q) => {
            return q && U5.getDomainFromUrl(q).toLowerCase() === this.hostnameAndPort
        }).length > 0
    }
    static generateAuthority(A, q) {
        let K;
        if (q && q.azureCloudInstance !== sU.None) {
            let Y = q.tenant ? q.tenant : S8.DEFAULT_COMMON_TENANT;
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
        if (this.managedIdentity) return S8.DEFAULT_AUTHORITY_HOST;
        else if (this.discoveryComplete()) return this.metadata.preferred_cache;
        else throw t8(oG)
    }
    isAlias(A) {
        return this.metadata.aliases.indexOf(A) > -1
    }
    isAliasOfKnownMicrosoftAuthority(A) {
        return lX8.has(A)
    }
    static isPublicCloudAuthority(A) {
        return S8.KNOWN_PUBLIC_CLOUDS.indexOf(A) >= 0
    }
    static buildRegionalAuthorityString(A, q, K) {
        let Y = new U5(A);
        Y.validateAsUri();
        let z = Y.getUrlComponents(),
            _ = `${q}.${z.HostNameAndPort}`;
        if (this.isPublicCloudAuthority(z.HostNameAndPort)) _ = `${q}.${S8.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
        let w = U5.constructAuthorityUriFromObject({
            ...Y.getUrlComponents(),
            HostNameAndPort: _
        }).urlString;
        if (K) return `${w}?${K}`;
        return w
    }
    static replaceWithRegionalInformation(A, q) {
        let K = {
            ...A
        };
        if (K.authorization_endpoint = dM.buildRegionalAuthorityString(K.authorization_endpoint, q), K.token_endpoint = dM.buildRegionalAuthorityString(K.token_endpoint, q), K.end_session_endpoint) K.end_session_endpoint = dM.buildRegionalAuthorityString(K.end_session_endpoint, q);
        return K
    }
    static transformCIAMAuthority(A) {
        let q = A,
            Y = new U5(A).getUrlComponents();
        if (Y.PathSegments.length === 0 && Y.HostNameAndPort.endsWith(S8.CIAM_AUTH_URL)) {
            let z = Y.HostNameAndPort.split(".")[0];
            q = `${q}${z}${S8.AAD_TENANT_DOMAIN_SUFFIX}`
        }
        return q
    }
}
// @from(Ln 181681, Col 0)
function KQ7(A) {
    let Y = new U5(A).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
    switch (Y) {
        case Nv.COMMON:
        case Nv.ORGANIZATIONS:
        case Nv.CONSUMERS:
            return;
        default:
            return Y
    }
}
// @from(Ln 181693, Col 0)
function sj1(A) {
    return A.endsWith(S8.FORWARD_SLASH) ? A : `${A}${S8.FORWARD_SLASH}`
}
// @from(Ln 181697, Col 0)
function aP8(A) {
    let q = A.cloudDiscoveryMetadata,
        K = void 0;
    if (q) try {
        K = JSON.parse(q)
    } catch (Y) {
        throw J2(ms)
    }
    return {
        canonicalAuthority: A.authority ? sj1(A.authority) : void 0,
        knownAuthorities: A.knownAuthorities,
        cloudDiscoveryMetadata: K
    }
}
// @from(Ln 181711, Col 4)
tj1 = E(() => {
    FX8();
    op7();
    Fs();
    cJ();
    bw();
    iX8();
    Bs();
    MB6();
    Cj1();
    sp7();
    ep7();
    qQ7();
    UL();
    rC();
    zd();
    aj1();
    Sj();
    eU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    dM.reservedTenantDomains = new Set(["{tenant}", "{tenantid}", Nv.COMMON, Nv.CONSUMERS, Nv.ORGANIZATIONS])
})
// @from(Ln 181732, Col 4)
ej1 = {}
// @from(Ln 181736, Col 0)
async function sP8(A, q, K, Y, z, _, w) {
    w?.addQueueMeasurement(W8.AuthorityFactoryCreateDiscoveredInstance, _);
    let O = dM.transformCIAMAuthority(sj1(A)),
        $ = new dM(O, q, K, Y, z, _, w);
    try {
        return await c9($.resolveEndpointsAsync.bind($), W8.AuthorityResolveEndpointsAsync, z, w, _)(), $
    } catch (H) {
        throw t8(oG)
    }
}
// @from(Ln 181746, Col 4)
tP8 = E(() => {
    tj1();
    cJ();
    rC();
    zd();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 181753, Col 4)
tG
// @from(Ln 181754, Col 4)
bP6 = E(() => {
    UL(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    tG = class tG extends T5 {
        constructor(A, q, K, Y, z) {
            super(A, q, K);
            this.name = "ServerError", this.errorNo = Y, this.status = z, Object.setPrototypeOf(this, tG.prototype)
        }
    }
})
// @from(Ln 181764, Col 0)
function xP6(A, q, K) {
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
// @from(Ln 181779, Col 4)
AJ1 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181781, Col 0)
class _d {
    static generateThrottlingStorageKey(A) {
        return `${lm.THROTTLING_PREFIX}.${JSON.stringify(A)}`
    }
    static preProcess(A, q, K) {
        let Y = _d.generateThrottlingStorageKey(q),
            z = A.getThrottlingCache(Y);
        if (z) {
            if (z.throttleTime < Date.now()) {
                A.removeItem(Y, K);
                return
            }
            throw new tG(z.errorCodes?.join(" ") || S8.EMPTY_STRING, z.errorMessage, z.subError)
        }
    }
    static postProcess(A, q, K, Y) {
        if (_d.checkResponseStatus(K) || _d.checkResponseForRetryAfter(K)) {
            let z = {
                throttleTime: _d.calculateThrottleTime(parseInt(K.headers[Iw.RETRY_AFTER])),
                error: K.body.error,
                errorCodes: K.body.error_codes,
                errorMessage: K.body.error_description,
                subError: K.body.suberror
            };
            A.setThrottlingCache(_d.generateThrottlingStorageKey(q), z, Y)
        }
    }
    static checkResponseStatus(A) {
        return A.status === 429 || A.status >= 500 && A.status < 600
    }
    static checkResponseForRetryAfter(A) {
        if (A.headers) return A.headers.hasOwnProperty(Iw.RETRY_AFTER) && (A.status < 200 || A.status >= 300);
        return !1
    }
    static calculateThrottleTime(A) {
        let q = A <= 0 ? 0 : A,
            K = Date.now() / 1000;
        return Math.floor(Math.min(K + (q || lm.DEFAULT_THROTTLE_TIME_SECONDS), K + lm.DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000)
    }
    static removeThrottle(A, q, K, Y) {
        let z = xP6(q, K, Y),
            _ = this.generateThrottlingStorageKey(z);
        A.removeItem(_, K.correlationId)
    }
}
// @from(Ln 181826, Col 4)
YQ7 = E(() => {
    bw();
    bP6();
    AJ1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 181831, Col 4)
qJ1
// @from(Ln 181832, Col 4)
zQ7 = E(() => {
    UL(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    qJ1 = class qJ1 extends T5 {
        constructor(A, q, K) {
            super(A.errorCode, A.errorMessage, A.subError);
            Object.setPrototypeOf(this, qJ1.prototype), this.name = "NetworkError", this.error = A, this.httpStatus = q, this.responseHeaders = K
        }
    }
})
// @from(Ln 181841, Col 0)
class nW {
    constructor(A, q) {
        this.config = ip7(A), this.logger = new kv(this.config.loggerOptions, hj1, TP6), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = q
    }
    createTokenRequestHeaders(A) {
        let q = {};
        if (q[Iw.CONTENT_TYPE] = S8.URL_FORM_CONTENT_TYPE, !this.config.systemOptions.preventCorsPreflight && A) switch (A.type) {
            case aG.HOME_ACCOUNT_ID:
                try {
                    let K = nm(A.credential);
                    q[Iw.CCS_HEADER] = `Oid:${K.uid}@${K.utid}`
                } catch (K) {
                    this.logger.verbose("Could not parse home account ID for CCS Header: " + K)
                }
                break;
            case aG.UPN:
                q[Iw.CCS_HEADER] = `UPN: ${A.credential}`;
                break
        }
        return q
    }
    async executePostToTokenEndpoint(A, q, K, Y, z, _) {
        if (_) this.performanceClient?.addQueueMeasurement(_, z);
        let w = await this.sendPostRequest(Y, A, {
            body: q,
            headers: K
        }, z);
        if (this.config.serverTelemetryManager && w.status < 500 && w.status !== 429) this.config.serverTelemetryManager.clearTelemetryCache();
        return w
    }
    async sendPostRequest(A, q, K, Y) {
        _d.preProcess(this.cacheManager, A, Y);
        let z;
        try {
            z = await c9(this.networkClient.sendPostRequestAsync.bind(this.networkClient), W8.NetworkClientSendPostRequestAsync, this.logger, this.performanceClient, Y)(q, K);
            let _ = z.headers || {};
            this.performanceClient?.addFields({
                refreshTokenSize: z.body.refresh_token?.length || 0,
                httpVerToken: _[Iw.X_MS_HTTP_VERSION] || "",
                requestId: _[Iw.X_MS_REQUEST_ID] || ""
            }, Y)
        } catch (_) {
            if (_ instanceof qJ1) {
                let w = _.responseHeaders;
                if (w) this.performanceClient?.addFields({
                    httpVerToken: w[Iw.X_MS_HTTP_VERSION] || "",
                    requestId: w[Iw.X_MS_REQUEST_ID] || "",
                    contentTypeHeader: w[Iw.CONTENT_TYPE] || void 0,
                    contentLengthHeader: w[Iw.CONTENT_LENGTH] || void 0,
                    httpStatus: _.httpStatus
                }, Y);
                throw _.error
            }
            if (_ instanceof T5) throw _;
            else throw t8(oK6)
        }
        return _d.postProcess(this.cacheManager, A, z, Y), z
    }
    async updateAuthority(A, q) {
        this.performanceClient?.addQueueMeasurement(W8.UpdateTokenEndpointAuthority, q);
        let K = `https://${A}/${this.authority.tenant}/`,
            Y = await sP8(K, this.networkClient, this.cacheManager, this.authority.options, this.logger, q, this.performanceClient);
        this.authority = Y
    }
    createTokenQueryParameters(A) {
        let q = new Map;
        if (A.embeddedClientId) Yd(q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
        if (A.tokenQueryParameters) Kd(q, A.tokenQueryParameters);
        return L56(q, A.correlationId), N56(q, A.correlationId, this.performanceClient), rm(q)
    }
}
// @from(Ln 181912, Col 4)
bB6 = E(() => {
    pj1();
    Rj1();
    bw();
    Sj1();
    WB6();
    kP6();
    SP6();
    f56();
    tP8();
    rC();
    YQ7();
    UL();
    cJ();
    zQ7();
    zd();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 181930, Col 4)
YJ1 = {}
// @from(Ln 181941, Col 4)
Us = "no_tokens_found"
// @from(Ln 181942, Col 4)
xB6 = "native_account_unavailable"
// @from(Ln 181943, Col 4)
uB6 = "refresh_token_expired"
// @from(Ln 181944, Col 4)
KJ1 = "ux_not_allowed"
// @from(Ln 181945, Col 4)
eP8 = "interaction_required"
// @from(Ln 181946, Col 4)
A08 = "consent_required"
// @from(Ln 181947, Col 4)
q08 = "login_required"
// @from(Ln 181948, Col 4)
ds = "bad_token"
// @from(Ln 181949, Col 4)
zJ1 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 181952, Col 0)
function wJ1(A, q, K) {
    let Y = !!A && _Q7.indexOf(A) > -1,
        z = !!K && p99.indexOf(K) > -1,
        _ = !!q && _Q7.some((w) => {
            return q.indexOf(w) > -1
        });
    return Y || _ || z
}
// @from(Ln 181961, Col 0)
function OJ1(A) {
    return new vk(A, _J1[A])
}
// @from(Ln 181964, Col 4)
_Q7
// @from(Ln 181964, Col 9)
p99
// @from(Ln 181964, Col 14)
_J1
// @from(Ln 181964, Col 19)
K08
// @from(Ln 181964, Col 24)
vk
// @from(Ln 181965, Col 4)
mB6 = E(() => {
    bw();
    UL();
    zJ1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    _Q7 = [eP8, A08, q08, ds, KJ1], p99 = ["message_only", "additional_action", "basic_action", "user_password_expired", "consent_required", "bad_token"], _J1 = {
        [Us]: "No refresh token found in the cache. Please sign-in.",
        [xB6]: "The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",
        [uB6]: "Refresh token has expired.",
        [ds]: "Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve.",
        [KJ1]: "`canShowUI` flag in Edge was set to false. User interaction required on web page. Please invoke an interactive API to resolve."
    }, K08 = {
        noTokensFoundError: {
            code: Us,
            desc: _J1[Us]
        },
        native_account_unavailable: {
            code: xB6,
            desc: _J1[xB6]
        },
        bad_token: {
            code: ds,
            desc: _J1[ds]
        }
    };
    vk = class vk extends T5 {
        constructor(A, q, K, Y, z, _, w, O) {
            super(A, q, K);
            Object.setPrototypeOf(this, vk.prototype), this.timestamp = Y || S8.EMPTY_STRING, this.traceId = z || S8.EMPTY_STRING, this.correlationId = _ || S8.EMPTY_STRING, this.claims = w || S8.EMPTY_STRING, this.name = "InteractionRequiredAuthError", this.errorNo = O
        }
    }
})
// @from(Ln 181996, Col 0)
class $J1 {
    static setRequestState(A, q, K) {
        let Y = $J1.generateLibraryState(A, K);
        return q ? `${Y}${S8.RESOURCE_DELIM}${q}` : Y
    }
    static generateLibraryState(A, q) {
        if (!A) throw t8(bs);
        let K = {
            id: A.createNewGuid()
        };
        if (q) K.meta = q;
        let Y = JSON.stringify(K);
        return A.base64Encode(Y)
    }
    static parseRequestState(A, q) {
        if (!A) throw t8(bs);
        if (!q) throw t8(nC);
        try {
            let K = q.split(S8.RESOURCE_DELIM),
                Y = K[0],
                z = K.length > 1 ? K.slice(1).join(S8.RESOURCE_DELIM) : S8.EMPTY_STRING,
                _ = A.base64Decode(Y),
                w = JSON.parse(_);
            return {
                userRequestState: z || S8.EMPTY_STRING,
                libraryState: w
            }
        } catch (K) {
            throw t8(nC)
        }
    }
}
// @from(Ln 182028, Col 4)
wQ7 = E(() => {
    bw();
    cJ();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 182033, Col 0)
class h56 {
    constructor(A, q) {
        this.cryptoUtils = A, this.performanceClient = q
    }
    async generateCnf(A, q) {
        this.performanceClient?.addQueueMeasurement(W8.PopTokenGenerateCnf, A.correlationId);
        let K = await c9(this.generateKid.bind(this), W8.PopTokenGenerateCnf, q, this.performanceClient, A.correlationId)(A),
            Y = this.cryptoUtils.base64UrlEncode(JSON.stringify(K));
        return {
            kid: K.kid,
            reqCnfString: Y
        }
    }
    async generateKid(A) {
        return this.performanceClient?.addQueueMeasurement(W8.PopTokenGenerateKid, A.correlationId), {
            kid: await this.cryptoUtils.getPublicKeyThumbprint(A),
            xms_ksl: Q99.SW
        }
    }
    async signPopToken(A, q, K) {
        return this.signPayload(A, q, K)
    }
    async signPayload(A, q, K, Y) {
        let {
            resourceRequestMethod: z,
            resourceRequestUri: _,
            shrClaims: w,
            shrNonce: O,
            shrOptions: $
        } = K, j = (_ ? new U5(_) : void 0)?.getUrlComponents();
        return this.cryptoUtils.signJwt({
            at: A,
            ts: Tk(),
            m: z?.toUpperCase(),
            u: j?.HostNameAndPort,
            nonce: O || this.cryptoUtils.createNewGuid(),
            p: j?.AbsolutePath,
            q: j?.QueryString ? [
                [], j.QueryString
            ] : void 0,
            client_claims: w || void 0,
            ...Y
        }, q, $, K.correlationId)
    }
}
// @from(Ln 182078, Col 4)
Q99
// @from(Ln 182079, Col 4)
HJ1 = E(() => {
    Qs();
    Fs();
    rC();
    zd(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Q99 = {
        SW: "sw"
    }
})
// @from(Ln 182088, Col 0)
class cL {
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
// @from(Ln 182099, Col 4)
Y08 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 182101, Col 0)
class dH {
    constructor(A, q, K, Y, z, _, w) {
        this.clientId = A, this.cacheStorage = q, this.cryptoObj = K, this.logger = Y, this.serializableCache = z, this.persistencePlugin = _, this.performanceClient = w
    }
    validateTokenResponse(A, q) {
        if (A.error || A.error_description || A.suberror) {
            let K = `Error(s): ${A.error_codes||S8.NOT_AVAILABLE} - Timestamp: ${A.timestamp||S8.NOT_AVAILABLE} - Description: ${A.error_description||S8.NOT_AVAILABLE} - Correlation ID: ${A.correlation_id||S8.NOT_AVAILABLE} - Trace ID: ${A.trace_id||S8.NOT_AVAILABLE}`,
                Y = A.error_codes?.length ? A.error_codes[0] : void 0,
                z = new tG(A.error, K, A.suberror, Y, A.status);
            if (q && A.status && A.status >= f5.SERVER_ERROR_RANGE_START && A.status <= f5.SERVER_ERROR_RANGE_END) {
                this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${z}`);
                return
            } else if (q && A.status && A.status >= f5.CLIENT_ERROR_RANGE_START && A.status <= f5.CLIENT_ERROR_RANGE_END) {
                this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${z}`);
                return
            }
            if (wJ1(A.error, A.error_description, A.suberror)) throw new vk(A.error, A.error_description, A.suberror, A.timestamp || S8.EMPTY_STRING, A.trace_id || S8.EMPTY_STRING, A.correlation_id || S8.EMPTY_STRING, A.claims || S8.EMPTY_STRING, Y);
            throw z
        }
    }
    async handleServerTokenResponse(A, q, K, Y, z, _, w, O, $) {
        this.performanceClient?.addQueueMeasurement(W8.HandleServerTokenResponse, A.correlation_id);
        let H;
        if (A.id_token) {
            if (H = Ad(A.id_token || S8.EMPTY_STRING, this.cryptoObj.base64Decode), z && z.nonce) {
                if (H.nonce !== z.nonce) throw t8(eK6)
            }
            if (Y.maxAge || Y.maxAge === 0) {
                let D = H.auth_time;
                if (!D) throw t8(nU);
                DB6(D, Y.maxAge)
            }
        }
        this.homeAccountIdentifier = lJ.generateHomeAccountId(A.client_info || S8.EMPTY_STRING, q.authorityType, this.logger, this.cryptoObj, H);
        let j;
        if (!!z && !!z.state) j = $J1.parseRequestState(this.cryptoObj, z.state);
        A.key_id = A.key_id || Y.sshKid || void 0;
        let J = this.generateCacheRecord(A, q, K, Y, H, _, z),
            M;
        try {
            if (this.persistencePlugin && this.serializableCache) this.logger.verbose("Persistence enabled, calling beforeCacheAccess"), M = new cL(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(M);
            if (w && !O && J.account) {
                let D = this.cacheStorage.generateAccountKey(lJ.getAccountInfo(J.account));
                if (!this.cacheStorage.getAccount(D, Y.correlationId)) return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"), await dH.generateAuthenticationResult(this.cryptoObj, q, J, !1, Y, H, j, void 0, $)
            }
            await this.cacheStorage.saveCacheRecord(J, Y.correlationId, QX8(H || {}), Y.storeInCache)
        } finally {
            if (this.persistencePlugin && this.serializableCache && M) this.logger.verbose("Persistence enabled, calling afterCacheAccess"), await this.persistencePlugin.afterCacheAccess(M)
        }
        return dH.generateAuthenticationResult(this.cryptoObj, q, J, !1, Y, H, j, A, $)
    }
    generateCacheRecord(A, q, K, Y, z, _, w) {
        let O = q.getPreferredCache();
        if (!O) throw t8(oU);
        let $ = xj1(z),
            H, j;
        if (A.id_token && !!z) H = nP8(this.homeAccountIdentifier, O, A.id_token, this.clientId, $ || ""), j = OQ7(this.cacheStorage, q, this.homeAccountIdentifier, this.cryptoObj.base64Decode, Y.correlationId, z, A.client_info, O, $, w, void 0, this.logger);
        let J = null;
        if (A.access_token) {
            let X = A.scope ? UH.fromString(A.scope) : new UH(Y.scopes || []),
                P = (typeof A.expires_in === "string" ? parseInt(A.expires_in, 10) : A.expires_in) || 0,
                W = (typeof A.ext_expires_in === "string" ? parseInt(A.ext_expires_in, 10) : A.ext_expires_in) || 0,
                Z = (typeof A.refresh_in === "string" ? parseInt(A.refresh_in, 10) : A.refresh_in) || void 0,
                G = K + P,
                f = G + W,
                v = Z && Z > 0 ? K + Z : void 0;
            J = rP8(this.homeAccountIdentifier, O, A.access_token, this.clientId, $ || q.tenant || "", X.printScopes(), G, f, this.cryptoObj.base64Decode, v, A.token_type, _, A.key_id, Y.claims, Y.requestedClaimsHash)
        }
        let M = null;
        if (A.refresh_token) {
            let X;
            if (A.refresh_token_expires_in) {
                let P = typeof A.refresh_token_expires_in === "string" ? parseInt(A.refresh_token_expires_in, 10) : A.refresh_token_expires_in;
                X = K + P
            }
            M = oP8(this.homeAccountIdentifier, O, A.refresh_token, this.clientId, A.foci, _, X)
        }
        let D = null;
        if (A.foci) D = {
            clientId: this.clientId,
            environment: O,
            familyId: A.foci
        };
        return {
            account: j,
            idToken: H,
            accessToken: J,
            refreshToken: M,
            appMetadata: D
        }
    }
    static async generateAuthenticationResult(A, q, K, Y, z, _, w, O, $) {
        let H = S8.EMPTY_STRING,
            j = [],
            J = null,
            M, D, X = S8.EMPTY_STRING;
        if (K.accessToken) {
            if (K.accessToken.tokenType === k9.POP && !z.popKid) {
                let G = new h56(A),
                    {
                        secret: f,
                        keyId: v
                    } = K.accessToken;
                if (!v) throw t8(H56);
                H = await G.signPopToken(f, v, z)
            } else H = K.accessToken.secret;
            if (j = UH.fromString(K.accessToken.target).asArray(), J = CB6(K.accessToken.expiresOn), M = CB6(K.accessToken.extendedExpiresOn), K.accessToken.refreshOn) D = CB6(K.accessToken.refreshOn)
        }
        if (K.appMetadata) X = K.appMetadata.familyId === Rs ? Rs : "";
        let P = _?.oid || _?.sub || "",
            W = _?.tid || "";
        if (O?.spa_accountid && !!K.account) K.account.nativeAccountId = O?.spa_accountid;
        let Z = K.account ? Ij1(lJ.getAccountInfo(K.account), void 0, _, K.idToken?.secret) : null;
        return {
            authority: q.canonicalAuthority,
            uniqueId: P,
            tenantId: W,
            scopes: j,
            account: Z,
            idToken: K?.idToken?.secret || "",
            idTokenClaims: _ || {},
            accessToken: H,
            fromCache: Y,
            expiresOn: J,
            extExpiresOn: M,
            refreshOn: D,
            correlationId: z.correlationId,
            requestId: $ || S8.EMPTY_STRING,
            familyId: X,
            tokenType: K.accessToken?.tokenType || S8.EMPTY_STRING,
            state: w ? w.userRequestState : S8.EMPTY_STRING,
            cloudGraphHostName: K.account?.cloudGraphHostName || S8.EMPTY_STRING,
            msGraphHost: K.account?.msGraphHost || S8.EMPTY_STRING,
            code: O?.spa_code,
            fromNativeBroker: !1
        }
    }
}
// @from(Ln 182242, Col 0)
function OQ7(A, q, K, Y, z, _, w, O, $, H, j, J) {
    J?.verbose("setCachedAccount called");
    let D = A.getAccountKeys().find((G) => {
            return G.startsWith(K)
        }),
        X = null;
    if (D) X = A.getAccount(D, z);
    let P = X || lJ.createAccount({
            homeAccountId: K,
            idTokenClaims: _,
            clientInfo: w,
            environment: O,
            cloudGraphHostName: H?.cloud_graph_host_name,
            msGraphHost: H?.msgraph_host,
            nativeAccountId: j
        }, q, Y),
        W = P.tenantProfiles || [],
        Z = $ || P.realm;
    if (Z && !W.find((G) => {
            return G.tenantId === Z
        })) {
        let G = JB6(K, P.localAccountId, Z, _);
        W.push(G)
    }
    return P.tenantProfiles = W, P
}
// @from(Ln 182268, Col 4)
BB6 = E(() => {
    cJ();
    bP6();
    jB6();
    uj1();
    mB6();
    wQ7();
    bw();
    HJ1();
    Y08();
    rC();
    EP6();
    pX8();
    bj1();
    aj1();
    Qs();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 182286, Col 0)
async function eG(A, q, K) {
    if (typeof A === "string") return A;
    else return A({
        clientId: q,
        tokenEndpoint: K
    })
}