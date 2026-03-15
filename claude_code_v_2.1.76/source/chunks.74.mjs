
// @from(Ln 187475, Col 4)
OW8 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Hg6 = class Hg6 extends nW {
        constructor(A) {
            super(A)
        }
        async acquireToken(A) {
            let q = await this.getDeviceCode(A);
            A.deviceCodeCallback(q);
            let K = ZO.nowSeconds(),
                Y = await this.acquireTokenWithDeviceCode(A, q),
                z = new dH(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return z.validateTokenResponse(Y), z.handleServerTokenResponse(Y, this.authority, K, A)
        }
        async getDeviceCode(A) {
            let q = this.createExtraQueryParameters(A),
                K = U5.appendQueryString(this.authority.deviceCodeEndpoint, q),
                Y = this.createQueryString(A),
                z = this.createTokenRequestHeaders(),
                _ = {
                    clientId: this.config.authOptions.clientId,
                    authority: A.authority,
                    scopes: A.scopes,
                    claims: A.claims,
                    authenticationScheme: A.authenticationScheme,
                    resourceRequestMethod: A.resourceRequestMethod,
                    resourceRequestUri: A.resourceRequestUri,
                    shrClaims: A.shrClaims,
                    sshKid: A.sshKid
                };
            return this.executePostRequestToDeviceCodeEndpoint(K, Y, z, _, A.correlationId)
        }
        createExtraQueryParameters(A) {
            let q = new Map;
            if (A.extraQueryParameters) q4.addExtraQueryParameters(q, A.extraQueryParameters);
            return lP.mapToQueryString(q)
        }
        async executePostRequestToDeviceCodeEndpoint(A, q, K, Y, z) {
            let {
                body: {
                    user_code: _,
                    device_code: w,
                    verification_uri: O,
                    expires_in: $,
                    interval: H,
                    message: j
                }
            } = await this.sendPostRequest(Y, A, {
                body: q,
                headers: K
            }, z);
            return {
                userCode: _,
                deviceCode: w,
                verificationUri: O,
                expiresIn: $,
                interval: H,
                message: j
            }
        }
        createQueryString(A) {
            let q = new Map;
            if (q4.addScopes(q, A.scopes), q4.addClientId(q, this.config.authOptions.clientId), A.extraQueryParameters) q4.addExtraQueryParameters(q, A.extraQueryParameters);
            if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) q4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            return lP.mapToQueryString(q)
        }
        continuePolling(A, q, K) {
            if (K) throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true"), t8(j2.deviceCodePollingCancelled);
            else if (q && q < A && ZO.nowSeconds() > q) throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${q}`), t8(j2.userTimeoutReached);
            else if (ZO.nowSeconds() > A) {
                if (q) this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${q}`);
                throw this.logger.error(`Device code expired. Expiration time of device code was ${A}`), t8(j2.deviceCodeExpired)
            }
            return !0
        }
        async acquireTokenWithDeviceCode(A, q) {
            let K = this.createTokenQueryParameters(A),
                Y = U5.appendQueryString(this.authority.tokenEndpoint, K),
                z = this.createTokenRequestBody(A, q),
                _ = this.createTokenRequestHeaders(),
                w = A.timeout ? ZO.nowSeconds() + A.timeout : void 0,
                O = ZO.nowSeconds() + q.expiresIn,
                $ = q.interval * 1000;
            while (this.continuePolling(O, w, A.cancel)) {
                let H = {
                        clientId: this.config.authOptions.clientId,
                        authority: A.authority,
                        scopes: A.scopes,
                        claims: A.claims,
                        authenticationScheme: A.authenticationScheme,
                        resourceRequestMethod: A.resourceRequestMethod,
                        resourceRequestUri: A.resourceRequestUri,
                        shrClaims: A.shrClaims,
                        sshKid: A.sshKid
                    },
                    j = await this.executePostToTokenEndpoint(Y, z, _, H, A.correlationId);
                if (j.body && j.body.error)
                    if (j.body.error === S8.AUTHORIZATION_PENDING) this.logger.info("Authorization pending. Continue polling."), await ZO.delay($);
                    else throw this.logger.info("Unexpected error in polling from the server"), uX8(GP6.postRequestFailed, j.body.error);
                else return this.logger.verbose("Authorization completed successfully. Polling stopped."), j.body
            }
            throw this.logger.error("Polling stopped for unknown reasons."), t8(j2.deviceCodeUnknownError)
        }
        createTokenRequestBody(A, q) {
            let K = new Map;
            q4.addScopes(K, A.scopes), q4.addClientId(K, this.config.authOptions.clientId), q4.addGrantType(K, Vv.DEVICE_CODE_GRANT), q4.addDeviceCode(K, q.deviceCode);
            let Y = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if (q4.addCorrelationId(K, Y), q4.addClientInfo(K), q4.addLibraryInfo(K, this.config.libraryInfo), q4.addApplicationTelemetry(K, this.config.telemetry.application), q4.addThrottling(K), this.serverTelemetryManager) q4.addServerTelemetry(K, this.serverTelemetryManager);
            if (!i2.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) q4.addClaims(K, A.claims, this.config.authOptions.clientCapabilities);
            return lP.mapToQueryString(K)
        }
    }
})
// @from(Ln 187588, Col 4)
jg6
// @from(Ln 187589, Col 4)
Ji7 = E(() => {
    fO();
    X_();
    HM1();
    UB6();
    ji7();
    OW8();
    UP6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    jg6 = class jg6 extends m56 {
        constructor(A) {
            super(A);
            if (this.config.broker.nativeBrokerPlugin)
                if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable) this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
                else this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.");
            this.skus = cs.makeExtraSkuString({
                libraryName: Af.MSAL_SKU,
                libraryVersion: eC
            })
        }
        async acquireTokenByDeviceCode(A) {
            this.logger.info("acquireTokenByDeviceCode called", A.correlationId);
            let q = Object.assign(A, await this.initializeBaseRequest(A)),
                K = this.initializeServerTelemetryManager(wd.acquireTokenByDeviceCode, q.correlationId);
            try {
                let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                    z = await this.buildOauthClientConfiguration(Y, q.correlationId, "", K),
                    _ = new Hg6(z);
                return this.logger.verbose("Device code client created", q.correlationId), await _.acquireToken(q)
            } catch (Y) {
                if (Y instanceof T5) Y.setCorrelationId(q.correlationId);
                throw K.cacheFailedRequest(Y), Y
            }
        }
        async acquireTokenInteractive(A) {
            let q = A.correlationId || this.cryptoProvider.createNewGuid();
            this.logger.trace("acquireTokenInteractive called", q);
            let {
                openBrowser: K,
                successTemplate: Y,
                errorTemplate: z,
                windowHandle: _,
                loopbackClient: w,
                ...O
            } = A;
            if (this.nativeBrokerPlugin) {
                let D = {
                    ...O,
                    clientId: this.config.auth.clientId,
                    scopes: A.scopes || lW,
                    redirectUri: A.redirectUri || "",
                    authority: A.authority || this.config.auth.authority,
                    correlationId: q,
                    extraParameters: {
                        ...O.extraQueryParameters,
                        ...O.tokenQueryParameters,
                        [v56.X_CLIENT_EXTRA_SKU]: this.skus
                    },
                    accountId: O.account?.nativeAccountId
                };
                return this.nativeBrokerPlugin.acquireTokenInteractive(D, _)
            }
            if (A.redirectUri) {
                if (!this.config.broker.nativeBrokerPlugin) throw O$.createRedirectUriNotSupportedError();
                A.redirectUri = ""
            }
            let {
                verifier: $,
                challenge: H
            } = await this.cryptoProvider.generatePkceCodes(), j = w || new wW8, J = {}, M = null;
            try {
                let D = j.listenForAuthCode(Y, z).then((f) => {
                        J = f
                    }).catch((f) => {
                        M = f
                    }),
                    X = await this.waitForRedirectUri(j),
                    P = {
                        ...O,
                        correlationId: q,
                        scopes: A.scopes || lW,
                        redirectUri: X,
                        responseMode: cm.QUERY,
                        codeChallenge: H,
                        codeChallengeMethod: Ej1.S256
                    },
                    W = await this.getAuthCodeUrl(P);
                if (await K(W), await D, M) throw M;
                if (J.error) throw new tG(J.error, J.error_description, J.suberror);
                else if (!J.code) throw O$.createNoAuthCodeInResponseError();
                let Z = J.client_info,
                    G = {
                        code: J.code,
                        codeVerifier: $,
                        clientInfo: Z || S8.EMPTY_STRING,
                        ...P
                    };
                return await this.acquireTokenByCode(G)
            } finally {
                j.closeServer()
            }
        }
        async acquireTokenSilent(A) {
            let q = A.correlationId || this.cryptoProvider.createNewGuid();
            if (this.logger.trace("acquireTokenSilent called", q), this.nativeBrokerPlugin) {
                let K = {
                    ...A,
                    clientId: this.config.auth.clientId,
                    scopes: A.scopes || lW,
                    redirectUri: A.redirectUri || "",
                    authority: A.authority || this.config.auth.authority,
                    correlationId: q,
                    extraParameters: {
                        ...A.tokenQueryParameters,
                        [v56.X_CLIENT_EXTRA_SKU]: this.skus
                    },
                    accountId: A.account.nativeAccountId,
                    forceRefresh: A.forceRefresh || !1
                };
                return this.nativeBrokerPlugin.acquireTokenSilent(K)
            }
            if (A.redirectUri) {
                if (!this.config.broker.nativeBrokerPlugin) throw O$.createRedirectUriNotSupportedError();
                A.redirectUri = ""
            }
            return super.acquireTokenSilent(A)
        }
        async signOut(A) {
            if (this.nativeBrokerPlugin && A.account.nativeAccountId) {
                let q = {
                    clientId: this.config.auth.clientId,
                    accountId: A.account.nativeAccountId,
                    correlationId: A.correlationId || this.cryptoProvider.createNewGuid()
                };
                await this.nativeBrokerPlugin.signOut(q)
            }
            await this.getTokenCache().removeAccount(A.account, A.correlationId)
        }
        async getAllAccounts() {
            if (this.nativeBrokerPlugin) {
                let A = this.cryptoProvider.createNewGuid();
                return this.nativeBrokerPlugin.getAllAccounts(this.config.auth.clientId, A)
            }
            return this.getTokenCache().getAllAccounts()
        }
        async waitForRedirectUri(A) {
            return new Promise((q, K) => {
                let Y = 0,
                    z = setInterval(() => {
                        if (WJ1.TIMEOUT_MS / WJ1.INTERVAL_MS < Y) {
                            clearInterval(z), K(O$.createLoopbackServerTimeoutError());
                            return
                        }
                        try {
                            let _ = A.getRedirectUri();
                            clearInterval(z), q(_);
                            return
                        } catch (_) {
                            if (_ instanceof T5 && _.errorCode === nJ.noLoopbackServerExists.code) {
                                Y++;
                                return
                            }
                            clearInterval(z), K(_);
                            return
                        }
                    }, WJ1.INTERVAL_MS)
            })
        }
    }
})
// @from(Ln 187758, Col 4)
B56
// @from(Ln 187759, Col 4)
jM1 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    B56 = class B56 extends nW {
        constructor(A, q) {
            super(A);
            this.appTokenProvider = q
        }
        async acquireToken(A) {
            if (A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority);
            let [q, K] = await this.getCachedAuthenticationResult(A, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
            if (q) {
                if (K === l2.PROACTIVELY_REFRESHED) {
                    this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                    let Y = !0;
                    await this.executeTokenRequest(A, this.authority, Y)
                }
                return q
            } else return this.executeTokenRequest(A, this.authority)
        }
        async getCachedAuthenticationResult(A, q, K, Y, z, _) {
            let w = q,
                O = q,
                $ = l2.NOT_APPLICABLE,
                H;
            if (w.serializableCache && w.persistencePlugin) H = new cL(w.serializableCache, !1), await w.persistencePlugin.beforeCacheAccess(H);
            let j = this.readAccessTokenFromCache(Y, O.managedIdentityId?.id || w.authOptions.clientId, new UH(A.scopes || []), z, A.correlationId);
            if (w.serializableCache && w.persistencePlugin && H) await w.persistencePlugin.afterCacheAccess(H);
            if (!j) return _?.setCacheOutcome(l2.NO_CACHED_ACCESS_TOKEN), [null, l2.NO_CACHED_ACCESS_TOKEN];
            if (ZO.isTokenExpired(j.expiresOn, w.systemOptions?.tokenRenewalOffsetSeconds || ZP6)) return _?.setCacheOutcome(l2.CACHED_ACCESS_TOKEN_EXPIRED), [null, l2.CACHED_ACCESS_TOKEN_EXPIRED];
            if (j.refreshOn && ZO.isTokenExpired(j.refreshOn.toString(), 0)) $ = l2.PROACTIVELY_REFRESHED, _?.setCacheOutcome(l2.PROACTIVELY_REFRESHED);
            return [await dH.generateAuthenticationResult(K, Y, {
                account: null,
                idToken: null,
                accessToken: j,
                refreshToken: null,
                appMetadata: null
            }, !0, A), $]
        }
        readAccessTokenFromCache(A, q, K, Y, z) {
            let _ = {
                    homeAccountId: S8.EMPTY_STRING,
                    environment: A.canonicalAuthorityUrlComponents.HostNameAndPort,
                    credentialType: D_.ACCESS_TOKEN,
                    clientId: q,
                    realm: A.tenant,
                    target: UH.createSearchScopes(K.asArray())
                },
                w = Y.getAccessTokensByFilter(_, z);
            if (w.length < 1) return null;
            else if (w.length > 1) throw t8(j2.multipleMatchingTokens);
            return w[0]
        }
        async executeTokenRequest(A, q, K) {
            let Y, z;
            if (this.appTokenProvider) {
                this.logger.info("Using appTokenProvider extensibility.");
                let O = {
                    correlationId: A.correlationId,
                    tenantId: this.config.authOptions.authority.tenant,
                    scopes: A.scopes,
                    claims: A.claims
                };
                z = ZO.nowSeconds();
                let $ = await this.appTokenProvider(O);
                Y = {
                    access_token: $.accessToken,
                    expires_in: $.expiresInSeconds,
                    refresh_in: $.refreshInSeconds,
                    token_type: k9.BEARER
                }
            } else {
                let O = this.createTokenQueryParameters(A),
                    $ = U5.appendQueryString(q.tokenEndpoint, O),
                    H = await this.createTokenRequestBody(A),
                    j = this.createTokenRequestHeaders(),
                    J = {
                        clientId: this.config.authOptions.clientId,
                        authority: A.authority,
                        scopes: A.scopes,
                        claims: A.claims,
                        authenticationScheme: A.authenticationScheme,
                        resourceRequestMethod: A.resourceRequestMethod,
                        resourceRequestUri: A.resourceRequestUri,
                        shrClaims: A.shrClaims,
                        sshKid: A.sshKid
                    };
                this.logger.info("Sending token request to endpoint: " + q.tokenEndpoint), z = ZO.nowSeconds();
                let M = await this.executePostToTokenEndpoint($, H, j, J, A.correlationId);
                Y = M.body, Y.status = M.status
            }
            let _ = new dH(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return _.validateTokenResponse(Y, K), await _.handleServerTokenResponse(Y, this.authority, z, A)
        }
        async createTokenRequestBody(A) {
            let q = new Map;
            if (q4.addClientId(q, this.config.authOptions.clientId), q4.addScopes(q, A.scopes, !1), q4.addGrantType(q, Vv.CLIENT_CREDENTIALS_GRANT), q4.addLibraryInfo(q, this.config.libraryInfo), q4.addApplicationTelemetry(q, this.config.telemetry.application), q4.addThrottling(q), this.serverTelemetryManager) q4.addServerTelemetry(q, this.serverTelemetryManager);
            let K = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if (q4.addCorrelationId(q, K), this.config.clientCredentials.clientSecret) q4.addClientSecret(q, this.config.clientCredentials.clientSecret);
            let Y = A.clientAssertion || this.config.clientCredentials.clientAssertion;
            if (Y) q4.addClientAssertion(q, await eG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), q4.addClientAssertionType(q, Y.assertionType);
            if (!i2.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) q4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            return lP.mapToQueryString(q)
        }
    }
})
// @from(Ln 187864, Col 4)
Jg6
// @from(Ln 187865, Col 4)
$W8 = E(() => {
    X_();
    iB6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Jg6 = class Jg6 extends nW {
        constructor(A) {
            super(A)
        }
        async acquireToken(A) {
            if (this.scopeSet = new UH(A.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(A.oboAssertion), A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority, this.userAssertionHash);
            try {
                return await this.getCachedAuthenticationResult(A)
            } catch (q) {
                return await this.executeTokenRequest(A, this.authority, this.userAssertionHash)
            }
        }
        async getCachedAuthenticationResult(A) {
            let q = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, A);
            if (!q) throw this.serverTelemetryManager?.setCacheOutcome(l2.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties."), t8(j2.tokenRefreshRequired);
            else if (ZO.isTokenExpired(q.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.serverTelemetryManager?.setCacheOutcome(l2.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`), t8(j2.tokenRefreshRequired);
            let K = this.readIdTokenFromCacheForOBO(q.homeAccountId, A.correlationId),
                Y, z = null;
            if (K) {
                Y = mj1.extractTokenClaims(K.secret, yv.base64Decode);
                let _ = Y.oid || Y.sub,
                    w = {
                        homeAccountId: K.homeAccountId,
                        environment: K.environment,
                        tenantId: K.realm,
                        username: S8.EMPTY_STRING,
                        localAccountId: _ || S8.EMPTY_STRING
                    };
                z = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(w), A.correlationId)
            }
            if (this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
            return dH.generateAuthenticationResult(this.cryptoUtils, this.authority, {
                account: z,
                accessToken: q,
                idToken: K,
                refreshToken: null,
                appMetadata: null
            }, !0, A, Y)
        }
        readIdTokenFromCacheForOBO(A, q) {
            let K = {
                    homeAccountId: A,
                    environment: this.authority.canonicalAuthorityUrlComponents.HostNameAndPort,
                    credentialType: D_.ID_TOKEN,
                    clientId: this.config.authOptions.clientId,
                    realm: this.authority.tenant
                },
                Y = this.cacheManager.getIdTokensByFilter(K, q);
            if (Object.values(Y).length < 1) return null;
            return Object.values(Y)[0]
        }
        readAccessTokenFromCacheForOBO(A, q) {
            let K = q.authenticationScheme || k9.BEARER,
                z = {
                    credentialType: K && K.toLowerCase() !== k9.BEARER.toLowerCase() ? D_.ACCESS_TOKEN_WITH_AUTH_SCHEME : D_.ACCESS_TOKEN,
                    clientId: A,
                    target: UH.createSearchScopes(this.scopeSet.asArray()),
                    tokenType: K,
                    keyId: q.sshKid,
                    requestedClaimsHash: q.requestedClaimsHash,
                    userAssertionHash: this.userAssertionHash
                },
                _ = this.cacheManager.getAccessTokensByFilter(z, q.correlationId),
                w = _.length;
            if (w < 1) return null;
            else if (w > 1) throw t8(j2.multipleMatchingTokens);
            return _[0]
        }
        async executeTokenRequest(A, q, K) {
            let Y = this.createTokenQueryParameters(A),
                z = U5.appendQueryString(q.tokenEndpoint, Y),
                _ = await this.createTokenRequestBody(A),
                w = this.createTokenRequestHeaders(),
                O = {
                    clientId: this.config.authOptions.clientId,
                    authority: A.authority,
                    scopes: A.scopes,
                    claims: A.claims,
                    authenticationScheme: A.authenticationScheme,
                    resourceRequestMethod: A.resourceRequestMethod,
                    resourceRequestUri: A.resourceRequestUri,
                    shrClaims: A.shrClaims,
                    sshKid: A.sshKid
                },
                $ = ZO.nowSeconds(),
                H = await this.executePostToTokenEndpoint(z, _, w, O, A.correlationId),
                j = new dH(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return j.validateTokenResponse(H.body), await j.handleServerTokenResponse(H.body, this.authority, $, A, void 0, K)
        }
        async createTokenRequestBody(A) {
            let q = new Map;
            if (q4.addClientId(q, this.config.authOptions.clientId), q4.addScopes(q, A.scopes), q4.addGrantType(q, Vv.JWT_BEARER), q4.addClientInfo(q), q4.addLibraryInfo(q, this.config.libraryInfo), q4.addApplicationTelemetry(q, this.config.telemetry.application), q4.addThrottling(q), this.serverTelemetryManager) q4.addServerTelemetry(q, this.serverTelemetryManager);
            let K = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if (q4.addCorrelationId(q, K), q4.addRequestTokenUse(q, v56.ON_BEHALF_OF), q4.addOboAssertion(q, A.oboAssertion), this.config.clientCredentials.clientSecret) q4.addClientSecret(q, this.config.clientCredentials.clientSecret);
            let Y = this.config.clientCredentials.clientAssertion;
            if (Y) q4.addClientAssertion(q, await eG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), q4.addClientAssertionType(q, Y.assertionType);
            if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) q4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            return lP.mapToQueryString(q)
        }
    }
})
// @from(Ln 187969, Col 4)
Mg6
// @from(Ln 187970, Col 4)
Mi7 = E(() => {
    HM1();
    OM1();
    fO();
    X_();
    jM1();
    $W8(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Mg6 = class Mg6 extends m56 {
        constructor(A) {
            super(A);
            let q = !!this.config.auth.clientSecret,
                K = !!this.config.auth.clientAssertion,
                Y = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
            if (this.appTokenProvider) return;
            if (q && K || K && Y || q && Y) throw t8(j2.invalidClientCredential);
            if (this.config.auth.clientSecret) {
                this.clientSecret = this.config.auth.clientSecret;
                return
            }
            if (this.config.auth.clientAssertion) {
                this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
                return
            }
            if (!Y) throw t8(j2.invalidClientCredential);
            else this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? tC.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : tC.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
            this.appTokenProvider = void 0
        }
        SetAppTokenProvider(A) {
            this.appTokenProvider = A
        }
        async acquireTokenByClientCredential(A) {
            this.logger.info("acquireTokenByClientCredential called", A.correlationId);
            let q;
            if (A.clientAssertion) q = {
                assertion: await eG(A.clientAssertion, this.config.auth.clientId),
                assertionType: Af.JWT_BEARER_ASSERTION_TYPE
            };
            let K = await this.initializeBaseRequest(A),
                Y = {
                    ...K,
                    scopes: K.scopes.filter((J) => !lW.includes(J))
                },
                z = {
                    ...A,
                    ...Y,
                    clientAssertion: q
                },
                w = new U5(z.authority).getUrlComponents().PathSegments[0];
            if (Object.values(Nv).includes(w)) throw t8(j2.missingTenantIdError);
            let O = process.env[fQ7],
                $;
            if (z.azureRegion !== "DisableMsalForceRegion")
                if (!z.azureRegion && O) $ = O;
                else $ = z.azureRegion;
            let H = {
                    azureRegion: $,
                    environmentRegion: process.env[GQ7]
                },
                j = this.initializeServerTelemetryManager(wd.acquireTokenByClientCredential, z.correlationId, z.skipCache);
            try {
                let J = await this.createAuthority(z.authority, z.correlationId, H, A.azureCloudOptions),
                    M = await this.buildOauthClientConfiguration(J, z.correlationId, "", j),
                    D = new B56(M, this.appTokenProvider);
                return this.logger.verbose("Client credential client created", z.correlationId), await D.acquireToken(z)
            } catch (J) {
                if (J instanceof T5) J.setCorrelationId(z.correlationId);
                throw j.cacheFailedRequest(J), J
            }
        }
        async acquireTokenOnBehalfOf(A) {
            this.logger.info("acquireTokenOnBehalfOf called", A.correlationId);
            let q = {
                ...A,
                ...await this.initializeBaseRequest(A)
            };
            try {
                let K = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                    Y = await this.buildOauthClientConfiguration(K, q.correlationId, "", void 0),
                    z = new Jg6(Y);
                return this.logger.verbose("On behalf of client created", q.correlationId), await z.acquireToken(q)
            } catch (K) {
                if (K instanceof T5) K.setCorrelationId(q.correlationId);
                throw K
            }
        }
    }
})
// @from(Ln 188058, Col 0)
function Di7(A) {
    if (typeof A !== "string") return !1;
    let q = new Date(A);
    return !isNaN(q.getTime()) && q.toISOString() === A
}
// @from(Ln 188063, Col 4)
Xi7 = E(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 188065, Col 0)
class HW8 {
    constructor(A, q, K) {
        this.httpClientNoRetries = A, this.retryPolicy = q, this.logger = K
    }
    async sendNetworkRequestAsyncHelper(A, q, K) {
        if (A === GO.GET) return this.httpClientNoRetries.sendGetRequestAsync(q, K);
        else return this.httpClientNoRetries.sendPostRequestAsync(q, K)
    }
    async sendNetworkRequestAsync(A, q, K) {
        let Y = await this.sendNetworkRequestAsyncHelper(A, q, K);
        if ("isNewRequest" in this.retryPolicy) this.retryPolicy.isNewRequest = !0;
        let z = 0;
        while (await this.retryPolicy.pauseForRetry(Y.status, z, this.logger, Y.headers[Iw.RETRY_AFTER])) Y = await this.sendNetworkRequestAsyncHelper(A, q, K), z++;
        return Y
    }
    async sendGetRequestAsync(A, q) {
        return this.sendNetworkRequestAsync(GO.GET, A, q)
    }
    async sendPostRequestAsync(A, q) {
        return this.sendNetworkRequestAsync(GO.POST, A, q)
    }
}
// @from(Ln 188087, Col 4)
Pi7 = E(() => {
    X_();
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 188091, Col 0)
class Rv {
    constructor(A, q, K, Y, z) {
        this.logger = A, this.nodeStorage = q, this.networkClient = K, this.cryptoProvider = Y, this.disableInternalRetries = z
    }
    async getServerTokenResponseAsync(A, q, K, Y) {
        return this.getServerTokenResponse(A)
    }
    getServerTokenResponse(A) {
        let q, K;
        if (A.body.expires_on) {
            if (Di7(A.body.expires_on)) A.body.expires_on = new Date(A.body.expires_on).getTime() / 1000;
            if (K = A.body.expires_on - ZO.nowSeconds(), K > 7200) q = K / 2
        }
        return {
            status: A.status,
            access_token: A.body.access_token,
            expires_in: K,
            scope: A.body.resource,
            token_type: A.body.token_type,
            refresh_in: q,
            correlation_id: A.body.correlation_id || A.body.correlationId,
            error: typeof A.body.error === "string" ? A.body.error : A.body.error?.code,
            error_description: A.body.message || (typeof A.body.error === "string" ? A.body.error_description : A.body.error?.message),
            error_codes: A.body.error_codes,
            timestamp: A.body.timestamp,
            trace_id: A.body.trace_id
        }
    }
    async acquireTokenWithManagedIdentity(A, q, K, Y) {
        let z = this.createRequest(A.resource, q);
        if (A.revokedTokenSha256Hash) this.logger.info(`[Managed Identity] The following claims are present in the request: ${A.claims}`), z.queryParameters[iJ.SHA256_TOKEN_TO_REFRESH] = A.revokedTokenSha256Hash;
        if (A.clientCapabilities?.length) {
            let M = A.clientCapabilities.toString();
            this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${M}`), z.queryParameters[iJ.XMS_CC] = M
        }
        let _ = z.headers;
        _[Iw.CONTENT_TYPE] = S8.URL_FORM_CONTENT_TYPE;
        let w = {
            headers: _
        };
        if (Object.keys(z.bodyParameters).length) w.body = z.computeParametersBodyString();
        let O = this.disableInternalRetries ? this.networkClient : new HW8(this.networkClient, z.retryPolicy, this.logger),
            $ = ZO.nowSeconds(),
            H;
        try {
            if (z.httpMethod === GO.POST) H = await O.sendPostRequestAsync(z.computeUri(), w);
            else H = await O.sendGetRequestAsync(z.computeUri(), w)
        } catch (M) {
            if (M instanceof T5) throw M;
            else throw t8(j2.networkError)
        }
        let j = new dH(q.id, this.nodeStorage, this.cryptoProvider, this.logger, null, null),
            J = await this.getServerTokenResponseAsync(H, O, z, w);
        return j.validateTokenResponse(J, Y), j.handleServerTokenResponse(J, K, $, A)
    }
    getManagedIdentityUserAssignedIdQueryParameterKey(A, q, K) {
        switch (A) {
            case i$.USER_ASSIGNED_CLIENT_ID:
                return this.logger.info(`[Managed Identity] [API version ${K?"2017+":"2019+"}] Adding user assigned client id to the request.`), K ? g56.MANAGED_IDENTITY_CLIENT_ID_2017 : g56.MANAGED_IDENTITY_CLIENT_ID;
            case i$.USER_ASSIGNED_RESOURCE_ID:
                return this.logger.info("[Managed Identity] Adding user assigned resource id to the request."), q ? g56.MANAGED_IDENTITY_RESOURCE_ID_IMDS : g56.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
            case i$.USER_ASSIGNED_OBJECT_ID:
                return this.logger.info("[Managed Identity] Adding user assigned object id to the request."), g56.MANAGED_IDENTITY_OBJECT_ID;
            default:
                throw Cj(is)
        }
    }
}
// @from(Ln 188159, Col 4)
g56
// @from(Ln 188160, Col 4)
F56 = E(() => {
    X_();
    fO();
    mP6();
    Xi7();
    Pi7();
    C56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    g56 = {
        MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
        MANAGED_IDENTITY_CLIENT_ID: "client_id",
        MANAGED_IDENTITY_OBJECT_ID: "object_id",
        MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
        MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
    };
    Rv.getValidatedEnvVariableUrlString = (A, q, K, Y) => {
        try {
            return new U5(q).urlString
        } catch (z) {
            throw Y.info(`[Managed Identity] ${K} managed identity is unavailable because the '${A}' environment variable is malformed.`), Cj(S56[A])
        }
    }
})
// @from(Ln 188182, Col 0)
class jW8 {
    calculateDelay(A, q) {
        if (!A) return q;
        let K = Math.round(parseFloat(A) * 1000);
        if (isNaN(K)) K = new Date(A).valueOf() - new Date().valueOf();
        return Math.max(q, K)
    }
}
// @from(Ln 188190, Col 4)
Wi7 = E(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 188192, Col 0)
class JM1 {
    constructor() {
        this.linearRetryStrategy = new jW8
    }
    static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
        return kH9
    }
    async pauseForRetry(A, q, K, Y) {
        if (EH9.includes(A) && q < VH9) {
            let z = this.linearRetryStrategy.calculateDelay(Y, JM1.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
            return K.verbose(`Retrying request in ${z}ms (retry attempt: ${q+1})`), await new Promise((_) => {
                return setTimeout(_, z)
            }), !0
        }
        return !1
    }
}
// @from(Ln 188209, Col 4)
VH9 = 3
// @from(Ln 188210, Col 4)
kH9 = 1000
// @from(Ln 188211, Col 4)
EH9
// @from(Ln 188212, Col 4)
Zi7 = E(() => {
    hJ1();
    Wi7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    EH9 = [f5.NOT_FOUND, f5.REQUEST_TIMEOUT, f5.TOO_MANY_REQUESTS, f5.SERVER_ERROR, f5.SERVICE_UNAVAILABLE, f5.GATEWAY_TIMEOUT]
})
// @from(Ln 188217, Col 0)
class Nk {
    constructor(A, q, K) {
        this.httpMethod = A, this._baseEndpoint = q, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = K || new JM1
    }
    computeUri() {
        let A = new Map;
        if (this.queryParameters) q4.addExtraQueryParameters(A, this.queryParameters);
        let q = lP.mapToQueryString(A);
        return U5.appendQueryString(this._baseEndpoint, q)
    }
    computeParametersBodyString() {
        let A = new Map;
        if (this.bodyParameters) q4.addExtraQueryParameters(A, this.bodyParameters);
        return lP.mapToQueryString(A)
    }
}
// @from(Ln 188233, Col 4)
p56 = E(() => {
    X_();
    Zi7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 188237, Col 4)
yH9 = "2019-08-01"
// @from(Ln 188238, Col 4)
Q56
// @from(Ln 188239, Col 4)
Gi7 = E(() => {
    F56();
    fO();
    p56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Q56 = class Q56 extends Rv {
        constructor(A, q, K, Y, z, _, w) {
            super(A, q, K, Y, z);
            this.identityEndpoint = _, this.identityHeader = w
        }
        static getEnvironmentVariables() {
            let A = process.env[bK.IDENTITY_ENDPOINT],
                q = process.env[bK.IDENTITY_HEADER];
            return [A, q]
        }
        static tryCreate(A, q, K, Y, z) {
            let [_, w] = Q56.getEnvironmentVariables();
            if (!_ || !w) return A.info(`[Managed Identity] ${tK.APP_SERVICE} managed identity is unavailable because one or both of the '${bK.IDENTITY_HEADER}' and '${bK.IDENTITY_ENDPOINT}' environment variables are not defined.`), null;
            let O = Q56.getValidatedEnvVariableUrlString(bK.IDENTITY_ENDPOINT, _, tK.APP_SERVICE, A);
            return A.info(`[Managed Identity] Environment variables validation passed for ${tK.APP_SERVICE} managed identity. Endpoint URI: ${O}. Creating ${tK.APP_SERVICE} managed identity.`), new Q56(A, q, K, Y, z, _, w)
        }
        createRequest(A, q) {
            let K = new Nk(GO.GET, this.identityEndpoint);
            if (K.headers[Ev.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, K.queryParameters[iJ.API_VERSION] = yH9, K.queryParameters[iJ.RESOURCE] = A, q.idType !== i$.SYSTEM_ASSIGNED) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType)] = q.id;
            return K
        }
    }
})
// @from(Ln 188273, Col 4)
CH9 = "2019-11-01"
// @from(Ln 188274, Col 4)
Ti7 = "http://127.0.0.1:40342/metadata/identity/oauth2/token"
// @from(Ln 188275, Col 4)
vi7 = "N/A: himds executable exists"
// @from(Ln 188276, Col 4)
Ni7
// @from(Ln 188276, Col 9)
IH9
// @from(Ln 188276, Col 14)
rs
// @from(Ln 188277, Col 4)
Vi7 = E(() => {
    X_();
    p56();
    F56();
    mP6();
    fO();
    C56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Ni7 = {
        win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
        linux: "/var/opt/azcmagent/tokens/"
    }, IH9 = {
        win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
        linux: "/opt/azcmagent/bin/himds"
    };
    rs = class rs extends Rv {
        constructor(A, q, K, Y, z, _) {
            super(A, q, K, Y, z);
            this.identityEndpoint = _
        }
        static getEnvironmentVariables() {
            let A = process.env[bK.IDENTITY_ENDPOINT],
                q = process.env[bK.IMDS_ENDPOINT];
            if (!A || !q) {
                let K = IH9[process.platform];
                try {
                    LH9(K, fi7.F_OK | fi7.R_OK), A = Ti7, q = vi7
                } catch (Y) {}
            }
            return [A, q]
        }
        static tryCreate(A, q, K, Y, z, _) {
            let [w, O] = rs.getEnvironmentVariables();
            if (!w || !O) return A.info(`[Managed Identity] ${tK.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${bK.IDENTITY_ENDPOINT}' and '${bK.IMDS_ENDPOINT}' are not defined. ${tK.AZURE_ARC} managed identity is also unavailable through file detection.`), null;
            if (O === vi7) A.info(`[Managed Identity] ${tK.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${tK.AZURE_ARC} endpoint: ${Ti7}. Creating ${tK.AZURE_ARC} managed identity.`);
            else {
                let $ = rs.getValidatedEnvVariableUrlString(bK.IDENTITY_ENDPOINT, w, tK.AZURE_ARC, A);
                $.endsWith("/") && $.slice(0, -1), rs.getValidatedEnvVariableUrlString(bK.IMDS_ENDPOINT, O, tK.AZURE_ARC, A), A.info(`[Managed Identity] Environment variables validation passed for ${tK.AZURE_ARC} managed identity. Endpoint URI: ${$}. Creating ${tK.AZURE_ARC} managed identity.`)
            }
            if (_.idType !== i$.SYSTEM_ASSIGNED) throw Cj(vJ1);
            return new rs(A, q, K, Y, z, w)
        }
        createRequest(A) {
            let q = new Nk(GO.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
            return q.headers[Ev.METADATA_HEADER_NAME] = "true", q.queryParameters[iJ.API_VERSION] = CH9, q.queryParameters[iJ.RESOURCE] = A, q
        }
        async getServerTokenResponseAsync(A, q, K, Y) {
            let z;
            if (A.status === f5.UNAUTHORIZED) {
                let _ = A.headers["www-authenticate"];
                if (!_) throw Cj(kJ1);
                if (!_.includes("Basic realm=")) throw Cj(EJ1);
                let w = _.split("Basic realm=")[1];
                if (!Ni7.hasOwnProperty(process.platform)) throw Cj(TJ1);
                let O = Ni7[process.platform],
                    $ = SH9.basename(w);
                if (!$.endsWith(".key")) throw Cj(ZJ1);
                if (O + $ !== w) throw Cj(GJ1);
                let H;
                try {
                    H = await RH9(w).size
                } catch (M) {
                    throw Cj(QB6)
                }
                if (H > NQ7) throw Cj(fJ1);
                let j;
                try {
                    j = hH9(w, cP.UTF8)
                } catch (M) {
                    throw Cj(QB6)
                }
                let J = `Basic ${j}`;
                this.logger.info("[Managed Identity] Adding authorization header to the request."), K.headers[Ev.AUTHORIZATION_HEADER_NAME] = J;
                try {
                    z = await q.sendGetRequestAsync(K.computeUri(), Y)
                } catch (M) {
                    if (M instanceof T5) throw M;
                    else throw t8(j2.networkError)
                }
            }
            return this.getServerTokenResponse(z || A)
        }
    }
})
// @from(Ln 188360, Col 4)
U56
// @from(Ln 188361, Col 4)
ki7 = E(() => {
    p56();
    F56();
    fO();
    mP6();
    C56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    U56 = class U56 extends Rv {
        constructor(A, q, K, Y, z, _) {
            super(A, q, K, Y, z);
            this.msiEndpoint = _
        }
        static getEnvironmentVariables() {
            return [process.env[bK.MSI_ENDPOINT]]
        }
        static tryCreate(A, q, K, Y, z, _) {
            let [w] = U56.getEnvironmentVariables();
            if (!w) return A.info(`[Managed Identity] ${tK.CLOUD_SHELL} managed identity is unavailable because the '${bK.MSI_ENDPOINT} environment variable is not defined.`), null;
            let O = U56.getValidatedEnvVariableUrlString(bK.MSI_ENDPOINT, w, tK.CLOUD_SHELL, A);
            if (A.info(`[Managed Identity] Environment variable validation passed for ${tK.CLOUD_SHELL} managed identity. Endpoint URI: ${O}. Creating ${tK.CLOUD_SHELL} managed identity.`), _.idType !== i$.SYSTEM_ASSIGNED) throw Cj(NJ1);
            return new U56(A, q, K, Y, z, w)
        }
        createRequest(A) {
            let q = new Nk(GO.POST, this.msiEndpoint);
            return q.headers[Ev.METADATA_HEADER_NAME] = "true", q.bodyParameters[iJ.RESOURCE] = A, q
        }
    }
})
// @from(Ln 188388, Col 0)
class JW8 {
    constructor(A, q, K) {
        this.minExponentialBackoff = A, this.maxExponentialBackoff = q, this.exponentialDeltaBackoff = K
    }
    calculateDelay(A) {
        if (A === 0) return this.minExponentialBackoff;
        return Math.min(Math.pow(2, A - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff)
    }
}
// @from(Ln 188397, Col 4)
Ei7 = E(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 188399, Col 0)
class d56 {
    constructor() {
        this.exponentialRetryStrategy = new JW8(d56.MIN_EXPONENTIAL_BACKOFF_MS, d56.MAX_EXPONENTIAL_BACKOFF_MS, d56.EXPONENTIAL_DELTA_BACKOFF_MS)
    }
    static get MIN_EXPONENTIAL_BACKOFF_MS() {
        return mH9
    }
    static get MAX_EXPONENTIAL_BACKOFF_MS() {
        return BH9
    }
    static get EXPONENTIAL_DELTA_BACKOFF_MS() {
        return gH9
    }
    static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
        return FH9
    }
    set isNewRequest(A) {
        this._isNewRequest = A
    }
    async pauseForRetry(A, q, K) {
        if (this._isNewRequest) this._isNewRequest = !1, this.maxRetries = A === f5.GONE ? uH9 : xH9;
        if ((bH9.includes(A) || A >= f5.SERVER_ERROR_RANGE_START && A <= f5.SERVER_ERROR_RANGE_END && q < this.maxRetries) && q < this.maxRetries) {
            let Y = A === f5.GONE ? d56.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(q);
            return K.verbose(`Retrying request in ${Y}ms (retry attempt: ${q+1})`), await new Promise((z) => {
                return setTimeout(z, Y)
            }), !0
        }
        return !1
    }
}
// @from(Ln 188429, Col 4)
bH9
// @from(Ln 188429, Col 9)
xH9 = 3
// @from(Ln 188430, Col 4)
uH9 = 7
// @from(Ln 188431, Col 4)
mH9 = 1000
// @from(Ln 188432, Col 4)
BH9 = 4000
// @from(Ln 188433, Col 4)
gH9 = 2000
// @from(Ln 188434, Col 4)
FH9 = 1e4
// @from(Ln 188435, Col 4)
yi7 = E(() => {
    hJ1();
    Ei7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    bH9 = [f5.NOT_FOUND, f5.REQUEST_TIMEOUT, f5.GONE, f5.TOO_MANY_REQUESTS]
})
// @from(Ln 188440, Col 4)
Li7 = "/metadata/identity/oauth2/token"
// @from(Ln 188441, Col 4)
pH9
// @from(Ln 188441, Col 9)
QH9 = "2018-02-01"
// @from(Ln 188442, Col 4)
Dg6
// @from(Ln 188443, Col 4)
Ri7 = E(() => {
    p56();
    F56();
    fO();
    yi7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    pH9 = `http://169.254.169.254${Li7}`;
    Dg6 = class Dg6 extends Rv {
        constructor(A, q, K, Y, z, _) {
            super(A, q, K, Y, z);
            this.identityEndpoint = _
        }
        static tryCreate(A, q, K, Y, z) {
            let _;
            if (process.env[bK.AZURE_POD_IDENTITY_AUTHORITY_HOST]) A.info(`[Managed Identity] Environment variable ${bK.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${tK.IMDS} returned endpoint: ${process.env[bK.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`), _ = Dg6.getValidatedEnvVariableUrlString(bK.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[bK.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${Li7}`, tK.IMDS, A);
            else A.info(`[Managed Identity] Unable to find ${bK.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${tK.IMDS}, using the default endpoint.`), _ = pH9;
            return new Dg6(A, q, K, Y, z, _)
        }
        createRequest(A, q) {
            let K = new Nk(GO.GET, this.identityEndpoint);
            if (K.headers[Ev.METADATA_HEADER_NAME] = "true", K.queryParameters[iJ.API_VERSION] = QH9, K.queryParameters[iJ.RESOURCE] = A, q.idType !== i$.SYSTEM_ASSIGNED) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType, !0)] = q.id;
            return K.retryPolicy = new d56, K
        }
    }
})
// @from(Ln 188467, Col 4)
UH9 = "2019-07-01-preview"
// @from(Ln 188468, Col 4)
c56
// @from(Ln 188469, Col 4)
hi7 = E(() => {
    p56();
    F56();
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    c56 = class c56 extends Rv {
        constructor(A, q, K, Y, z, _, w) {
            super(A, q, K, Y, z);
            this.identityEndpoint = _, this.identityHeader = w
        }
        static getEnvironmentVariables() {
            let A = process.env[bK.IDENTITY_ENDPOINT],
                q = process.env[bK.IDENTITY_HEADER],
                K = process.env[bK.IDENTITY_SERVER_THUMBPRINT];
            return [A, q, K]
        }
        static tryCreate(A, q, K, Y, z, _) {
            let [w, O, $] = c56.getEnvironmentVariables();
            if (!w || !O || !$) return A.info(`[Managed Identity] ${tK.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${bK.IDENTITY_HEADER}', '${bK.IDENTITY_ENDPOINT}' or '${bK.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`), null;
            let H = c56.getValidatedEnvVariableUrlString(bK.IDENTITY_ENDPOINT, w, tK.SERVICE_FABRIC, A);
            if (A.info(`[Managed Identity] Environment variables validation passed for ${tK.SERVICE_FABRIC} managed identity. Endpoint URI: ${H}. Creating ${tK.SERVICE_FABRIC} managed identity.`), _.idType !== i$.SYSTEM_ASSIGNED) A.warning(`[Managed Identity] ${tK.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`);
            return new c56(A, q, K, Y, z, w, O)
        }
        createRequest(A, q) {
            let K = new Nk(GO.GET, this.identityEndpoint);
            if (K.headers[Ev.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, K.queryParameters[iJ.API_VERSION] = UH9, K.queryParameters[iJ.RESOURCE] = A, q.idType !== i$.SYSTEM_ASSIGNED) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType)] = q.id;
            return K
        }
    }
})
// @from(Ln 188498, Col 4)
dH9 = "2017-09-01"
// @from(Ln 188499, Col 4)
cH9
// @from(Ln 188499, Col 9)
l56
// @from(Ln 188500, Col 4)
Si7 = E(() => {
    F56();
    fO();
    p56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    cH9 = `Only client id is supported for user-assigned managed identity in ${tK.MACHINE_LEARNING}.`;
    l56 = class l56 extends Rv {
        constructor(A, q, K, Y, z, _, w) {
            super(A, q, K, Y, z);
            this.msiEndpoint = _, this.secret = w
        }
        static getEnvironmentVariables() {
            let A = process.env[bK.MSI_ENDPOINT],
                q = process.env[bK.MSI_SECRET];
            return [A, q]
        }
        static tryCreate(A, q, K, Y, z) {
            let [_, w] = l56.getEnvironmentVariables();
            if (!_ || !w) return A.info(`[Managed Identity] ${tK.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${bK.MSI_ENDPOINT}' and '${bK.MSI_SECRET}' environment variables are not defined.`), null;
            let O = l56.getValidatedEnvVariableUrlString(bK.MSI_ENDPOINT, _, tK.MACHINE_LEARNING, A);
            return A.info(`[Managed Identity] Environment variables validation passed for ${tK.MACHINE_LEARNING} managed identity. Endpoint URI: ${O}. Creating ${tK.MACHINE_LEARNING} managed identity.`), new l56(A, q, K, Y, z, _, w)
        }
        createRequest(A, q) {
            let K = new Nk(GO.GET, this.msiEndpoint);
            if (K.headers[Ev.METADATA_HEADER_NAME] = "true", K.headers[Ev.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, K.queryParameters[iJ.API_VERSION] = dH9, K.queryParameters[iJ.RESOURCE] = A, q.idType === i$.SYSTEM_ASSIGNED) K.queryParameters[g56.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[bK.DEFAULT_IDENTITY_CLIENT_ID];
            else if (q.idType === i$.USER_ASSIGNED_CLIENT_ID) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType, !1, !0)] = q.id;
            else throw Error(cH9);
            return K
        }
    }
})
// @from(Ln 188530, Col 0)
class Hd {
    constructor(A, q, K, Y, z) {
        this.logger = A, this.nodeStorage = q, this.networkClient = K, this.cryptoProvider = Y, this.disableInternalRetries = z
    }
    async sendManagedIdentityTokenRequest(A, q, K, Y) {
        if (!Hd.identitySource) Hd.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, q);
        return Hd.identitySource.acquireTokenWithManagedIdentity(A, q, K, Y)
    }
    allEnvironmentVariablesAreDefined(A) {
        return Object.values(A).every((q) => {
            return q !== void 0
        })
    }
    getManagedIdentitySource() {
        return Hd.sourceName = this.allEnvironmentVariablesAreDefined(c56.getEnvironmentVariables()) ? tK.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(Q56.getEnvironmentVariables()) ? tK.APP_SERVICE : this.allEnvironmentVariablesAreDefined(l56.getEnvironmentVariables()) ? tK.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(U56.getEnvironmentVariables()) ? tK.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(rs.getEnvironmentVariables()) ? tK.AZURE_ARC : tK.DEFAULT_TO_IMDS, Hd.sourceName
    }
    selectManagedIdentitySource(A, q, K, Y, z, _) {
        let w = c56.tryCreate(A, q, K, Y, z, _) || Q56.tryCreate(A, q, K, Y, z) || l56.tryCreate(A, q, K, Y, z) || U56.tryCreate(A, q, K, Y, z, _) || rs.tryCreate(A, q, K, Y, z, _) || Dg6.tryCreate(A, q, K, Y, z);
        if (!w) throw Cj(VJ1);
        return w
    }
}
// @from(Ln 188552, Col 4)
Ci7 = E(() => {
    Gi7();
    Vi7();
    ki7();
    Ri7();
    hi7();
    mP6();
    fO();
    Si7();
    C56(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 188563, Col 0)
class AB {
    constructor(A) {
        this.config = xQ7(A || {}), this.logger = new kv(this.config.system.loggerOptions, $M1, eC);
        let q = {
            canonicalAuthority: S8.DEFAULT_AUTHORITY
        };
        if (!AB.nodeStorage) AB.nodeStorage = new b56(this.logger, this.config.managedIdentityId.id, fP6, q);
        this.networkClient = this.config.system.networkClient, this.cryptoProvider = new $d;
        let K = {
            protocolMode: iW.AAD,
            knownAuthorities: [_08],
            cloudDiscoveryMetadata: "",
            authorityMetadata: ""
        };
        this.fakeAuthority = new dM(_08, this.networkClient, AB.nodeStorage, K, this.logger, this.cryptoProvider.createNewGuid(), void 0, !0), this.fakeClientCredentialClient = new B56({
            authOptions: {
                clientId: this.config.managedIdentityId.id,
                authority: this.fakeAuthority
            }
        }), this.managedIdentityClient = new Hd(this.logger, AB.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new I56
    }
    async acquireToken(A) {
        if (!A.resource) throw J2(vP6.urlEmptyError);
        let q = {
            forceRefresh: A.forceRefresh,
            resource: A.resource.replace("/.default", ""),
            scopes: [A.resource.replace("/.default", "")],
            authority: this.fakeAuthority.canonicalAuthority,
            correlationId: this.cryptoProvider.createNewGuid(),
            claims: A.claims,
            clientCapabilities: this.config.clientCapabilities
        };
        if (q.forceRefresh) return this.acquireTokenFromManagedIdentity(q, this.config.managedIdentityId, this.fakeAuthority);
        let [K, Y] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(q, this.config, this.cryptoProvider, this.fakeAuthority, AB.nodeStorage);
        if (q.claims) {
            let z = this.managedIdentityClient.getManagedIdentitySource();
            if (K && lH9.includes(z)) {
                let _ = this.hashUtils.sha256(K.accessToken).toString(cP.HEX);
                q.revokedTokenSha256Hash = _
            }
            return this.acquireTokenFromManagedIdentity(q, this.config.managedIdentityId, this.fakeAuthority)
        }
        if (K) {
            if (Y === l2.PROACTIVELY_REFRESHED) {
                this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                let z = !0;
                await this.acquireTokenFromManagedIdentity(q, this.config.managedIdentityId, this.fakeAuthority, z)
            }
            return K
        } else return this.acquireTokenFromManagedIdentity(q, this.config.managedIdentityId, this.fakeAuthority)
    }
    async acquireTokenFromManagedIdentity(A, q, K, Y) {
        return this.managedIdentityClient.sendManagedIdentityTokenRequest(A, q, K, Y)
    }
    getManagedIdentitySource() {
        return Hd.sourceName || this.managedIdentityClient.getManagedIdentitySource()
    }
}
// @from(Ln 188621, Col 4)
lH9
// @from(Ln 188622, Col 4)
Ii7 = E(() => {
    X_();
    J08();
    UP6();
    nB6();
    jM1();
    Ci7();
    SJ1();
    fO();
    RJ1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    lH9 = [tK.SERVICE_FABRIC]
})
// @from(Ln 188634, Col 0)
class MW8 {
    constructor(A, q) {
        this.client = A, this.partitionManager = q
    }
    async beforeCacheAccess(A) {
        let q = await this.partitionManager.getKey(),
            K = await this.client.get(q);
        A.tokenCache.deserialize(K)
    }
    async afterCacheAccess(A) {
        if (A.cacheHasChanged) {
            let q = A.tokenCache.getKVStore(),
                K = Object.values(q).filter((z) => lJ.isAccountEntity(z)),
                Y;
            if (K.length > 0) {
                let z = K[0];
                Y = await this.partitionManager.extractKey(z)
            } else Y = await this.partitionManager.getKey();
            await this.client.set(Y, A.tokenCache.serialize())
        }
    }
}
// @from(Ln 188656, Col 4)
bi7 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 188659, Col 4)
Vk = {}
// @from(Ln 188697, Col 4)
MM1 = E(() => {
    WQ7();
    Ji7();
    Mi7();
    HM1();
    jM1();
    OW8();
    $W8();
    Ii7();
    _W8();
    OM1();
    T08();
    bi7();
    fO();
    nB6();
    X_();
    UP6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 188715, Col 4)
xi7 = E(() => {
    MM1()
})
// @from(Ln 188719, Col 0)
function dP6(A, q, K) {
    let Y = (z) => {
        return Xg6.getToken.info(z), new cC({
            scopes: Array.isArray(A) ? A : [A],
            getTokenOptions: K,
            message: z
        })
    };
    if (!q) throw Y("No response");
    if (!q.expiresOn) throw Y('Response had no "expiresOn" property.');
    if (!q.accessToken) throw Y('Response had no "accessToken" property.')
}
// @from(Ln 188732, Col 0)
function DW8(A) {
    let q = A === null || A === void 0 ? void 0 : A.authorityHost;
    if (!q && km6) q = process.env.AZURE_AUTHORITY_HOST;
    return q !== null && q !== void 0 ? q : Mm6
}
// @from(Ln 188738, Col 0)
function XW8(A, q) {
    if (!q) q = Mm6;
    if (new RegExp(`${A}/?$`).test(q)) return q;
    if (q.endsWith("/")) return q + A;
    else return `${q}/${A}`
}
// @from(Ln 188745, Col 0)
function mi7(A, q, K) {
    if (A === "adfs" && q || K) return [q];
    return []
}
// @from(Ln 188750, Col 0)
function XM1(A) {
    switch (A) {
        case "error":
            return Vk.LogLevel.Error;
        case "info":
            return Vk.LogLevel.Info;
        case "verbose":
            return Vk.LogLevel.Verbose;
        case "warning":
            return Vk.LogLevel.Warning;
        default:
            return Vk.LogLevel.Info
    }
}
// @from(Ln 188765, Col 0)
function i56(A, q, K) {
    if (q.name === "AuthError" || q.name === "ClientAuthError" || q.name === "BrowserAuthError") {
        let Y = q;
        switch (Y.errorCode) {
            case "endpoints_resolution_error":
                return Xg6.info(d9(A, q.message)), new D4(q.message);
            case "device_code_polling_cancelled":
                return new JP6("The authentication has been aborted by the caller.");
            case "consent_required":
            case "interaction_required":
            case "login_required":
                Xg6.info(d9(A, `Authentication returned errorCode ${Y.errorCode}`));
                break;
            default:
                Xg6.info(d9(A, `Failed to acquire token: ${q.message}`));
                break
        }
    }
    if (q.name === "ClientConfigurationError" || q.name === "BrowserConfigurationAuthError" || q.name === "AbortError" || q.name === "AuthenticationError") return q;
    if (q.name === "NativeAuthError") return Xg6.info(d9(A, `Error from the native broker: ${q.message} with status code: ${q.statusCode}`)), q;
    return new cC({
        scopes: A,
        getTokenOptions: K,
        message: q.message
    })
}
// @from(Ln 188792, Col 0)
function Bi7(A) {
    return {
        localAccountId: A.homeAccountId,
        environment: A.authority,
        username: A.username,
        homeAccountId: A.homeAccountId,
        tenantId: A.tenantId
    }
}
// @from(Ln 188802, Col 0)
function gi7(A, q) {
    var K;
    return {
        authority: (K = q.environment) !== null && K !== void 0 ? K : RB7,
        homeAccountId: q.homeAccountId,
        tenantId: q.tenantId || LB7,
        username: q.username,
        clientId: A,
        version: ui7
    }
}
// @from(Ln 188814, Col 0)
function Fi7(A) {
    return JSON.stringify(A)
}
// @from(Ln 188818, Col 0)
function pi7(A) {
    let q = JSON.parse(A);
    if (q.version && q.version !== ui7) throw Error("Unsupported AuthenticationRecord version");
    return q
}
// @from(Ln 188823, Col 4)
Xg6
// @from(Ln 188823, Col 9)
ui7 = "1.0"
// @from(Ln 188824, Col 4)
DM1 = (A, q = Pj1 ? "Node" : "Browser") => (K, Y, z) => {
        if (z) return;
        switch (K) {
            case Vk.LogLevel.Error:
                A.info(`MSAL ${q} V2 error: ${Y}`);
                return;
            case Vk.LogLevel.Info:
                A.info(`MSAL ${q} V2 info message: ${Y}`);
                return;
            case Vk.LogLevel.Verbose:
                A.info(`MSAL ${q} V2 verbose message: ${Y}`);
                return;
            case Vk.LogLevel.Warning:
                A.info(`MSAL ${q} V2 warning: ${Y}`);
                return
        }
    }
// @from(Ln 188841, Col 4)
PM1 = E(() => {
    pM();
    H2();
    Bm();
    Es();
    WX8();
    xi7();
    Xg6 = h5("IdentityUtils")
})
// @from(Ln 188851, Col 0)
function Qi7(A) {
    return kX8([{
        name: "imdsRetryPolicy",
        retry: ({
            retryCount: q,
            response: K
        }) => {
            if ((K === null || K === void 0 ? void 0 : K.status) !== 404) return {
                skipStrategy: !0
            };
            return MF7(q, {
                retryDelayInMs: A.startDelayInMs,
                maxRetryDelayInMs: iH9
            })
        }
    }], {
        maxRetries: A.maxRetries
    })
}
// @from(Ln 188870, Col 4)
iH9 = 64000
// @from(Ln 188871, Col 4)
Ui7 = E(() => {
    Qm();
    Es()
})
// @from(Ln 188876, Col 0)
function oH9(A) {
    var q;
    if (!Cm6(A)) throw Error(`${jd}: Multiple scopes are not supported.`);
    let Y = new URL(rH9, (q = process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) !== null && q !== void 0 ? q : nH9),
        z = {
            Accept: "application/json"
        };
    return {
        url: `${Y}`,
        method: "GET",
        headers: dU(z)
    }
}
// @from(Ln 188889, Col 4)
jd = "ManagedIdentityCredential - IMDS"
// @from(Ln 188890, Col 4)
n56
// @from(Ln 188890, Col 9)
nH9 = "http://169.254.169.254"
// @from(Ln 188891, Col 4)
rH9 = "/metadata/identity/oauth2/token"
// @from(Ln 188892, Col 4)
PW8
// @from(Ln 188893, Col 4)
di7 = E(() => {
    Qm();
    Es();
    H2();
    dP();
    n56 = h5(jd);
    PW8 = {
        name: "imdsMsi",
        async isAvailable(A) {
            let {
                scopes: q,
                identityClient: K,
                getTokenOptions: Y
            } = A, z = Cm6(q);
            if (!z) return n56.info(`${jd}: Unavailable. Multiple scopes are not supported.`), !1;
            if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) return !0;
            if (!K) throw Error("Missing IdentityClient");
            let _ = oH9(z);
            return bY.withSpan("ManagedIdentityCredential-pingImdsEndpoint", Y !== null && Y !== void 0 ? Y : {}, async (w) => {
                var O, $;
                _.tracingOptions = w.tracingOptions;
                let H = fk(_);
                H.timeout = ((O = w.requestOptions) === null || O === void 0 ? void 0 : O.timeout) || 1000, H.allowInsecureConnection = !0;
                let j;
                try {
                    n56.info(`${jd}: Pinging the Azure IMDS endpoint`), j = await K.sendRequest(H)
                } catch (J) {
                    if (Xj1(J)) n56.verbose(`${jd}: Caught error ${J.name}: ${J.message}`);
                    return n56.info(`${jd}: The Azure IMDS endpoint is unavailable`), !1
                }
                if (j.status === 403) {
                    if (($ = j.bodyAsText) === null || $ === void 0 ? void 0 : $.includes("unreachable")) return n56.info(`${jd}: The Azure IMDS endpoint is unavailable`), n56.info(`${jd}: ${j.bodyAsText}`), !1
                }
                return n56.info(`${jd}: The Azure IMDS endpoint is available`), !0
            })
        }
    }
})
// @from(Ln 188932, Col 0)
function WM1(A) {
    var q, K;
    let Y = A;
    if (Y === void 0 && ((K = (q = globalThis.process) === null || q === void 0 ? void 0 : q.env) === null || K === void 0 ? void 0 : K.AZURE_REGIONAL_AUTHORITY_NAME) !== void 0) Y = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
    if (Y === WW8.AutoDiscoverRegion) return "AUTO_DISCOVER";
    return Y
}
// @from(Ln 188939, Col 4)
WW8
// @from(Ln 188940, Col 4)
ci7 = E(() => {
    (function(A) {
        A.AutoDiscoverRegion = "AutoDiscoverRegion", A.USWest = "westus", A.USWest2 = "westus2", A.USCentral = "centralus", A.USEast = "eastus", A.USEast2 = "eastus2", A.USNorthCentral = "northcentralus", A.USSouthCentral = "southcentralus", A.USWestCentral = "westcentralus", A.CanadaCentral = "canadacentral", A.CanadaEast = "canadaeast", A.BrazilSouth = "brazilsouth", A.EuropeNorth = "northeurope", A.EuropeWest = "westeurope", A.UKSouth = "uksouth", A.UKWest = "ukwest", A.FranceCentral = "francecentral", A.FranceSouth = "francesouth", A.SwitzerlandNorth = "switzerlandnorth", A.SwitzerlandWest = "switzerlandwest", A.GermanyNorth = "germanynorth", A.GermanyWestCentral = "germanywestcentral", A.NorwayWest = "norwaywest", A.NorwayEast = "norwayeast", A.AsiaEast = "eastasia", A.AsiaSouthEast = "southeastasia", A.JapanEast = "japaneast", A.JapanWest = "japanwest", A.AustraliaEast = "australiaeast", A.AustraliaSouthEast = "australiasoutheast", A.AustraliaCentral = "australiacentral", A.AustraliaCentral2 = "australiacentral2", A.IndiaCentral = "centralindia", A.IndiaSouth = "southindia", A.IndiaWest = "westindia", A.KoreaSouth = "koreasouth", A.KoreaCentral = "koreacentral", A.UAECentral = "uaecentral", A.UAENorth = "uaenorth", A.SouthAfricaNorth = "southafricanorth", A.SouthAfricaWest = "southafricawest", A.ChinaNorth = "chinanorth", A.ChinaEast = "chinaeast", A.ChinaNorth2 = "chinanorth2", A.ChinaEast2 = "chinaeast2", A.GermanyCentral = "germanycentral", A.GermanyNorthEast = "germanynortheast", A.GovernmentUSVirginia = "usgovvirginia", A.GovernmentUSIowa = "usgoviowa", A.GovernmentUSArizona = "usgovarizona", A.GovernmentUSTexas = "usgovtexas", A.GovernmentUSDodEast = "usdodeast", A.GovernmentUSDodCentral = "usdodcentral"
    })(WW8 || (WW8 = {}))
})
// @from(Ln 188947, Col 0)
function aH9() {
    try {
        return li7.statSync("/.dockerenv"), !0
    } catch {
        return !1
    }
}
// @from(Ln 188955, Col 0)
function sH9() {
    try {
        return li7.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
    } catch {
        return !1
    }
}
// @from(Ln 188963, Col 0)
function GW8() {
    if (ZW8 === void 0) ZW8 = aH9() || sH9();
    return ZW8
}
// @from(Ln 188967, Col 4)
ZW8
// @from(Ln 188968, Col 4)
ii7 = () => {}
// @from(Ln 188971, Col 0)
function cP6() {
    if (fW8 === void 0) fW8 = eH9() || GW8();
    return fW8
}
// @from(Ln 188975, Col 4)
fW8
// @from(Ln 188975, Col 9)
eH9 = () => {
    try {
        return tH9.statSync("/run/.containerenv"), !0
    } catch {
        return !1
    }
}
// @from(Ln 188982, Col 4)
TW8 = E(() => {
    ii7()
})
// @from(Ln 188988, Col 4)
ni7 = () => {
        if (ri7.platform !== "linux") return !1;
        if (Aj9.release().toLowerCase().includes("microsoft")) {
            if (cP6()) return !1;
            return !0
        }
        try {
            return qj9.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !cP6() : !1
        } catch {
            return !1
        }
    }
// @from(Ln 189000, Col 4)
os
// @from(Ln 189001, Col 4)
vW8 = E(() => {
    TW8();
    os = ri7.env.__IS_WSL_TEST__ ? ni7 : ni7()
})
// @from(Ln 189009, Col 4)
Yj9
// @from(Ln 189009, Col 9)
zj9 = async () => {
    return `${await Yj9()}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
}
// @from(Ln 189011, Col 3)
NW8 = async () => {
    if (os) return zj9();
    return `${oi7.env.SYSTEMROOT||oi7.env.windir||String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}
// @from(Ln 189015, Col 4)
si7 = E(() => {
    vW8();
    vW8();
    Yj9 = (() => {
        let q;
        return async function() {
            if (q) return q;
            let K = "/etc/wsl.conf",
                Y = !1;
            try {
                await ai7.access(K, Kj9.F_OK), Y = !0
            } catch {}
            if (!Y) return "/mnt/";
            let z = await ai7.readFile(K, {
                    encoding: "utf8"
                }),
                _ = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(z);
            if (!_) return "/mnt/";
            return q = _.groups.mountPoint.trim(), q = q.endsWith("/") ? q : `${q}/`, q
        }
    })()
})
// @from(Ln 189038, Col 0)
function as(A, q, K) {
    let Y = (z) => Object.defineProperty(A, q, {
        value: z,
        enumerable: !0,
        writable: !0
    });
    return Object.defineProperty(A, q, {
        configurable: !0,
        enumerable: !0,
        get() {
            let z = K();
            return Y(z), z
        },
        set(z) {
            Y(z)
        }
    }), A
}
// @from(Ln 189063, Col 0)
async function VW8() {
    if (wj9.platform !== "darwin") throw Error("macOS only");
    let {
        stdout: A
    } = await $j9("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
    return /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(A)?.groups.id ?? "com.apple.Safari"
}
// @from(Ln 189070, Col 4)
$j9
// @from(Ln 189071, Col 4)
ti7 = E(() => {
    $j9 = _j9(Oj9)
})
// @from(Ln 189082, Col 0)
async function ei7(A, {
    humanReadableOutput: q = !0,
    signal: K
} = {}) {
    if (Hj9.platform !== "darwin") throw Error("macOS only");
    let Y = q ? [] : ["-ss"],
        z = {};
    if (K) z.signal = K;
    let {
        stdout: _
    } = await Mj9("osascript", ["-e", A, Y], z);
    return _.trim()
}
// @from(Ln 189095, Col 4)
Mj9
// @from(Ln 189096, Col 4)
An7 = E(() => {
    Mj9 = jj9(Jj9)
})
// @from(Ln 189099, Col 0)
async function kW8(A) {
    return ei7(`tell application "Finder" to set app_path to application file id "${A}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)
}
// @from(Ln 189103, Col 4)
qn7 = E(() => {
    An7()
})
// @from(Ln 189112, Col 0)
async function yW8(A = Pj9) {
    let {
        stdout: q
    } = await A("reg", ["QUERY", " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice", "/v", "ProgId"]), K = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(q);
    if (!K) throw new EW8(`Cannot find Windows browser in stdout: ${JSON.stringify(q)}`);
    let {
        id: Y
    } = K.groups, z = Wj9[Y];
    if (!z) throw new EW8(`Unknown browser ID: ${Y}`);
    return z
}
// @from(Ln 189123, Col 4)
Pj9
// @from(Ln 189123, Col 9)
Wj9
// @from(Ln 189123, Col 14)
EW8
// @from(Ln 189124, Col 4)
Kn7 = E(() => {
    Pj9 = Dj9(Xj9), Wj9 = {
        AppXq0fevzme2pys62n3e0fbqa7peapykr8v: {
            name: "Edge",
            id: "com.microsoft.edge.old"
        },
        MSEdgeDHTML: {
            name: "Edge",
            id: "com.microsoft.edge"
        },
        MSEdgeHTM: {
            name: "Edge",
            id: "com.microsoft.edge"
        },
        "IE.HTTP": {
            name: "Internet Explorer",
            id: "com.microsoft.ie"
        },
        FirefoxURL: {
            name: "Firefox",
            id: "org.mozilla.firefox"
        },
        ChromeHTML: {
            name: "Chrome",
            id: "com.google.chrome"
        },
        BraveHTML: {
            name: "Brave",
            id: "com.brave.Browser"
        },
        BraveBHTML: {
            name: "Brave Beta",
            id: "com.brave.Browser.beta"
        },
        BraveSSHTM: {
            name: "Brave Nightly",
            id: "com.brave.Browser.nightly"
        }
    };
    EW8 = class EW8 extends Error {}
})
// @from(Ln 189172, Col 0)
async function RW8() {
    if (LW8.platform === "darwin") {
        let A = await VW8();
        return {
            name: await kW8(A),
            id: A
        }
    }
    if (LW8.platform === "linux") {
        let {
            stdout: A
        } = await fj9("xdg-mime", ["query", "default", "x-scheme-handler/http"]), q = A.trim();
        return {
            name: Tj9(q.replace(/.desktop$/, "").replace("-", " ")),
            id: q
        }
    }
    if (LW8.platform === "win32") return yW8();
    throw Error("Only macOS, Linux, and Windows are supported")
}
// @from(Ln 189192, Col 4)
fj9
// @from(Ln 189192, Col 9)
Tj9 = (A) => A.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (q) => q.toUpperCase())
// @from(Ln 189193, Col 4)
Yn7 = E(() => {
    ti7();
    qn7();
    Kn7();
    fj9 = Zj9(Gj9)
})
// @from(Ln 189199, Col 4)
Jn7 = {}
// @from(Ln 189220, Col 0)
async function yj9() {
    let A = await NW8(),
        q = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`,
        K = $n7.from(q, "utf16le").toString("base64"),
        {
            stdout: Y
        } = await Ej9(A, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", K], {
            encoding: "utf8"
        }),
        z = Y.trim(),
        _ = {
            ChromeHTML: "com.google.chrome",
            BraveHTML: "com.brave.Browser",
            MSEdgeHTM: "com.microsoft.edge",
            FirefoxURL: "org.mozilla.firefox"
        };
    return _[z] ? {
        id: _[z]
    } : {}
}
// @from(Ln 189241, Col 0)
function On7(A) {
    if (typeof A === "string" || Array.isArray(A)) return A;
    let {
        [_n7]: q
    } = A;
    if (!q) throw Error(`${_n7} is not supported`);
    return q
}
// @from(Ln 189250, Col 0)
function ZM1({
    [lP6]: A
}, {
    wsl: q
}) {
    if (q && os) return On7(q);
    if (!A) throw Error(`${lP6} is not supported`);
    return On7(A)
}
// @from(Ln 189259, Col 4)
Ej9
// @from(Ln 189259, Col 9)
SW8
// @from(Ln 189259, Col 14)
zn7
// @from(Ln 189259, Col 19)
lP6
// @from(Ln 189259, Col 24)
_n7
// @from(Ln 189259, Col 29)
wn7 = async (A, q) => {
    let K;
    for (let Y of A) try {
        return await q(Y)
    } catch (z) {
        K = z
    }
    throw K
}
// @from(Ln 189267, Col 3)
Pg6 = async (A) => {
    if (A = {
            wait: !1,
            background: !1,
            newInstance: !1,
            allowNonzeroExitCode: !1,
            ...A
        }, Array.isArray(A.app)) return wn7(A.app, (O) => Pg6({
        ...A,
        app: O
    }));
    let {
        name: q,
        arguments: K = []
    } = A.app ?? {};
    if (K = [...K], Array.isArray(q)) return wn7(q, (O) => Pg6({
        ...A,
        app: {
            name: O,
            arguments: K
        }
    }));
    if (q === "browser" || q === "browserPrivate") {
        let O = {
                "com.google.chrome": "chrome",
                "google-chrome.desktop": "chrome",
                "com.brave.Browser": "brave",
                "org.mozilla.firefox": "firefox",
                "firefox.desktop": "firefox",
                "com.microsoft.msedge": "edge",
                "com.microsoft.edge": "edge",
                "com.microsoft.edgemac": "edge",
                "microsoft-edge.desktop": "edge"
            },
            $ = {
                chrome: "--incognito",
                brave: "--incognito",
                firefox: "--private-window",
                edge: "--inPrivate"
            },
            H = os ? await yj9() : await RW8();
        if (H.id in O) {
            let j = O[H.id];
            if (q === "browserPrivate") K.push($[j]);
            return Pg6({
                ...A,
                app: {
                    name: ss[j],
                    arguments: K
                }
            })
        }
        throw Error(`${H.name} is not supported as a default browser`)
    }
    let Y, z = [],
        _ = {};
    if (lP6 === "darwin") {
        if (Y = "open", A.wait) z.push("--wait-apps");
        if (A.background) z.push("--background");
        if (A.newInstance) z.push("--new");
        if (q) z.push("-a", q)
    } else if (lP6 === "win32" || os && !cP6() && !q) {
        if (Y = await NW8(), z.push("-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand"), !os) _.windowsVerbatimArguments = !0;
        let O = ["Start"];
        if (A.wait) O.push("-Wait");
        if (q) {
            if (O.push(`"\`"${q}\`""`), A.target) K.push(A.target)
        } else if (A.target) O.push(`"${A.target}"`);
        if (K.length > 0) K = K.map(($) => `"\`"${$}\`""`), O.push("-ArgumentList", K.join(","));
        A.target = $n7.from(O.join(" "), "utf16le").toString("base64")
    } else {
        if (q) Y = q;
        else {
            let O = !SW8 || SW8 === "/",
                $ = !1;
            try {
                await Vj9.access(zn7, kj9.X_OK), $ = !0
            } catch {}
            Y = hW8.versions.electron ?? (lP6 === "android" || O || !$) ? "xdg-open" : zn7
        }
        if (K.length > 0) z.push(...K);
        if (!A.wait) _.stdio = "ignore", _.detached = !0
    }
    if (lP6 === "darwin" && K.length > 0) z.push("--args", ...K);
    if (A.target) z.push(A.target);
    let w = jn7.spawn(Y, z, _);
    if (A.wait) return new Promise((O, $) => {
        w.once("error", $), w.once("close", (H) => {
            if (!A.allowNonzeroExitCode && H > 0) {
                $(Error(`Exited with code ${H}`));
                return
            }
            O(w)
        })
    });
    return w.unref(), w
}
// @from(Ln 189363, Col 3)
Lj9 = (A, q) => {
    if (typeof A !== "string") throw TypeError("Expected a `target`");
    return Pg6({
        ...q,
        target: A
    })
}
// @from(Ln 189369, Col 3)
Rj9 = (A, q) => {
    if (typeof A !== "string" && !Array.isArray(A)) throw TypeError("Expected a valid `name`");
    let {
        arguments: K = []
    } = q ?? {};
    if (K !== void 0 && K !== null && !Array.isArray(K)) throw TypeError("Expected `appArguments` as Array type");
    return Pg6({
        ...q,
        app: {
            name: A,
            arguments: K
        }
    })
}
// @from(Ln 189382, Col 3)
ss
// @from(Ln 189382, Col 7)
hj9
// @from(Ln 189383, Col 4)
Mn7 = E(() => {
    si7();
    Yn7();
    TW8();
    Ej9 = Nj9(jn7.execFile), SW8 = Hn7.dirname(vj9(import.meta.url)), zn7 = Hn7.join(SW8, "xdg-open"), {
        platform: lP6,
        arch: _n7
    } = hW8;
    ss = {};
    as(ss, "chrome", () => ZM1({
        darwin: "google chrome",
        win32: "chrome",
        linux: ["google-chrome", "google-chrome-stable", "chromium"]
    }, {
        wsl: {
            ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
        }
    }));
    as(ss, "brave", () => ZM1({
        darwin: "brave browser",
        win32: "brave",
        linux: ["brave-browser", "brave"]
    }, {
        wsl: {
            ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
            x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
        }
    }));
    as(ss, "firefox", () => ZM1({
        darwin: "firefox",
        win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
        linux: "firefox"
    }, {
        wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
    }));
    as(ss, "edge", () => ZM1({
        darwin: "microsoft edge",
        win32: "msedge",
        linux: ["microsoft-edge", "microsoft-edge-dev"]
    }, {
        wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
    }));
    as(ss, "browser", () => "browser");
    as(ss, "browserPrivate", () => "browserPrivate");
    hj9 = Lj9
})
// @from(Ln 189431, Col 0)
function Sj9(A, q, K = {}) {
    var Y, z, _;
    let w = zP6((Y = K.logger) !== null && Y !== void 0 ? Y : hv, q, A),
        O = XW8(w, DW8(K)),
        $ = new dm(Object.assign(Object.assign({}, K.tokenCredentialOptions), {
            authorityHost: O,
            loggingOptions: K.loggingOptions
        }));
    return {
        auth: {
            clientId: A,
            authority: O,
            knownAuthorities: mi7(w, O, K.disableInstanceDiscovery)
        },
        system: {
            networkClient: $,
            loggerOptions: {
                loggerCallback: DM1((z = K.logger) !== null && z !== void 0 ? z : hv),
                logLevel: XM1(eH1()),
                piiLoggingEnabled: (_ = K.loggingOptions) === null || _ === void 0 ? void 0 : _.enableUnsafeSupportLogging
            }
        }
    }
}
// @from(Ln 189456, Col 0)
function oW(A, q, K = {}) {
    var Y;
    let z = {
            msalConfig: Sj9(A, q, K),
            cachedAccount: K.authenticationRecord ? Bi7(K.authenticationRecord) : null,
            pluginConfiguration: uB7.generatePluginConfiguration(K),
            logger: (Y = K.logger) !== null && Y !== void 0 ? Y : hv
        },
        _ = new Map;
    async function w(N = {}) {
        let V = N.enableCae ? "CAE" : "default",
            L = _.get(V);
        if (L) return z.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), L;
        z.logger.getToken.info(`Creating new PublicClientApplication with CAE ${N.enableCae?"enabled":"disabled"}.`);
        let h = N.enableCae ? z.pluginConfiguration.cache.cachePluginCae : z.pluginConfiguration.cache.cachePlugin;
        return z.msalConfig.auth.clientCapabilities = N.enableCae ? ["cp1"] : void 0, L = new jg6(Object.assign(Object.assign({}, z.msalConfig), {
            broker: {
                nativeBrokerPlugin: z.pluginConfiguration.broker.nativeBrokerPlugin
            },
            cache: {
                cachePlugin: await h
            }
        })), _.set(V, L), L
    }
    let O = new Map;
    async function $(N = {}) {
        let V = N.enableCae ? "CAE" : "default",
            L = O.get(V);
        if (L) return z.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), L;
        z.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${N.enableCae?"enabled":"disabled"}.`);
        let h = N.enableCae ? z.pluginConfiguration.cache.cachePluginCae : z.pluginConfiguration.cache.cachePlugin;
        return z.msalConfig.auth.clientCapabilities = N.enableCae ? ["cp1"] : void 0, L = new Mg6(Object.assign(Object.assign({}, z.msalConfig), {
            broker: {
                nativeBrokerPlugin: z.pluginConfiguration.broker.nativeBrokerPlugin
            },
            cache: {
                cachePlugin: await h
            }
        })), O.set(V, L), L
    }
    async function H(N, V, L = {}) {
        if (z.cachedAccount === null) throw z.logger.getToken.info("No cached account found in local state."), new cC({
            scopes: V
        });
        if (L.claims) z.cachedClaims = L.claims;
        let h = {
            account: z.cachedAccount,
            scopes: V,
            claims: z.cachedClaims
        };
        if (z.pluginConfiguration.broker.isEnabled) {
            if (h.tokenQueryParameters || (h.tokenQueryParameters = {}), z.pluginConfiguration.broker.enableMsaPassthrough) h.tokenQueryParameters.msal_request_type = "consumer_passthrough"
        }
        if (L.proofOfPossessionOptions) h.shrNonce = L.proofOfPossessionOptions.nonce, h.authenticationScheme = "pop", h.resourceRequestMethod = L.proofOfPossessionOptions.resourceRequestMethod, h.resourceRequestUri = L.proofOfPossessionOptions.resourceRequestUrl;
        z.logger.getToken.info("Attempting to acquire token silently");
        try {
            return await N.acquireTokenSilent(h)
        } catch (R) {
            throw i56(V, R, L)
        }
    }

    function j(N) {
        if (N === null || N === void 0 ? void 0 : N.tenantId) return XW8(N.tenantId, DW8(K));
        return z.msalConfig.auth.authority
    }
    async function J(N, V, L, h) {
        var R, u;
        let I = null;
        try {
            I = await H(N, V, L)
        } catch (g) {
            if (g.name !== "AuthenticationRequiredError") throw g;
            if (L.disableAutomaticAuthentication) throw new cC({
                scopes: V,
                getTokenOptions: L,
                message: "Automatic authentication has been disabled. You may call the authentication() method."
            })
        }
        if (I === null) try {
            I = await h()
        } catch (g) {
            throw i56(V, g, L)
        }
        return dP6(V, I, L), z.cachedAccount = (R = I === null || I === void 0 ? void 0 : I.account) !== null && R !== void 0 ? R : null, z.logger.getToken.info(UJ(V)), {
            token: I.accessToken,
            expiresOnTimestamp: I.expiresOn.getTime(),
            refreshAfterTimestamp: (u = I.refreshOn) === null || u === void 0 ? void 0 : u.getTime(),
            tokenType: I.tokenType
        }
    }
    async function M(N, V, L = {}) {
        var h;
        z.logger.getToken.info("Attempting to acquire token using client secret"), z.msalConfig.auth.clientSecret = V;
        let R = await $(L);
        try {
            let u = await R.acquireTokenByClientCredential({
                scopes: N,
                authority: j(L),
                azureRegion: WM1(),
                claims: L === null || L === void 0 ? void 0 : L.claims
            });
            return dP6(N, u, L), z.logger.getToken.info(UJ(N)), {
                token: u.accessToken,
                expiresOnTimestamp: u.expiresOn.getTime(),
                refreshAfterTimestamp: (h = u.refreshOn) === null || h === void 0 ? void 0 : h.getTime(),
                tokenType: u.tokenType
            }
        } catch (u) {
            throw i56(N, u, L)
        }
    }
    async function D(N, V, L = {}) {
        var h;
        z.logger.getToken.info("Attempting to acquire token using client assertion"), z.msalConfig.auth.clientAssertion = V;
        let R = await $(L);
        try {
            let u = await R.acquireTokenByClientCredential({
                scopes: N,
                authority: j(L),
                azureRegion: WM1(),
                claims: L === null || L === void 0 ? void 0 : L.claims,
                clientAssertion: V
            });
            return dP6(N, u, L), z.logger.getToken.info(UJ(N)), {
                token: u.accessToken,
                expiresOnTimestamp: u.expiresOn.getTime(),
                refreshAfterTimestamp: (h = u.refreshOn) === null || h === void 0 ? void 0 : h.getTime(),
                tokenType: u.tokenType
            }
        } catch (u) {
            throw i56(N, u, L)
        }
    }
    async function X(N, V, L = {}) {
        var h;
        z.logger.getToken.info("Attempting to acquire token using client certificate"), z.msalConfig.auth.clientCertificate = V;
        let R = await $(L);
        try {
            let u = await R.acquireTokenByClientCredential({
                scopes: N,
                authority: j(L),
                azureRegion: WM1(),
                claims: L === null || L === void 0 ? void 0 : L.claims
            });
            return dP6(N, u, L), z.logger.getToken.info(UJ(N)), {
                token: u.accessToken,
                expiresOnTimestamp: u.expiresOn.getTime(),
                refreshAfterTimestamp: (h = u.refreshOn) === null || h === void 0 ? void 0 : h.getTime(),
                tokenType: u.tokenType
            }
        } catch (u) {
            throw i56(N, u, L)
        }
    }
    async function P(N, V, L = {}) {
        z.logger.getToken.info("Attempting to acquire token using device code");
        let h = await w(L);
        return J(h, N, L, () => {
            var R, u;
            let I = {
                    scopes: N,
                    cancel: (u = (R = L === null || L === void 0 ? void 0 : L.abortSignal) === null || R === void 0 ? void 0 : R.aborted) !== null && u !== void 0 ? u : !1,
                    deviceCodeCallback: V,
                    authority: j(L),
                    claims: L === null || L === void 0 ? void 0 : L.claims
                },
                g = h.acquireTokenByDeviceCode(I);
            if (L.abortSignal) L.abortSignal.addEventListener("abort", () => {
                I.cancel = !0
            });
            return g
        })
    }
    async function W(N, V, L, h = {}) {
        z.logger.getToken.info("Attempting to acquire token using username and password");
        let R = await w(h);
        return J(R, N, h, () => {
            let u = {
                scopes: N,
                username: V,
                password: L,
                authority: j(h),
                claims: h === null || h === void 0 ? void 0 : h.claims
            };
            return R.acquireTokenByUsernamePassword(u)
        })
    }

    function Z() {
        if (!z.cachedAccount) return;
        return gi7(A, z.cachedAccount)
    }
    async function G(N, V, L, h, R = {}) {
        z.logger.getToken.info("Attempting to acquire token using authorization code");
        let u;
        if (h) z.msalConfig.auth.clientSecret = h, u = await $(R);
        else u = await w(R);
        return J(u, N, R, () => {
            return u.acquireTokenByCode({
                scopes: N,
                redirectUri: V,
                code: L,
                authority: j(R),
                claims: R === null || R === void 0 ? void 0 : R.claims
            })
        })
    }
    async function f(N, V, L, h = {}) {
        var R;
        if (hv.getToken.info("Attempting to acquire token on behalf of another user"), typeof L === "string") hv.getToken.info("Using client secret for on behalf of flow"), z.msalConfig.auth.clientSecret = L;
        else if (typeof L === "function") hv.getToken.info("Using client assertion callback for on behalf of flow"), z.msalConfig.auth.clientAssertion = L;
        else hv.getToken.info("Using client certificate for on behalf of flow"), z.msalConfig.auth.clientCertificate = L;
        let u = await $(h);
        try {
            let I = await u.acquireTokenOnBehalfOf({
                scopes: N,
                authority: j(h),
                claims: h.claims,
                oboAssertion: V
            });
            return dP6(N, I, h), hv.getToken.info(UJ(N)), {
                token: I.accessToken,
                expiresOnTimestamp: I.expiresOn.getTime(),
                refreshAfterTimestamp: (R = I.refreshOn) === null || R === void 0 ? void 0 : R.getTime(),
                tokenType: I.tokenType
            }
        } catch (I) {
            throw i56(N, I, h)
        }
    }
    async function v(N, V = {}) {
        hv.getToken.info("Attempting to acquire token interactively");
        let L = await w(V);
        async function h(u) {
            var I;
            hv.verbose("Authentication will resume through the broker");
            let g = R();
            if (z.pluginConfiguration.broker.parentWindowHandle) g.windowHandle = Buffer.from(z.pluginConfiguration.broker.parentWindowHandle);
            else hv.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
            if (z.pluginConfiguration.broker.enableMsaPassthrough)((I = g.tokenQueryParameters) !== null && I !== void 0 ? I : g.tokenQueryParameters = {}).msal_request_type = "consumer_passthrough";
            if (u) g.prompt = "none", hv.verbose("Attempting broker authentication using the default broker account");
            else hv.verbose("Attempting broker authentication without the default broker account");
            if (V.proofOfPossessionOptions) g.shrNonce = V.proofOfPossessionOptions.nonce, g.authenticationScheme = "pop", g.resourceRequestMethod = V.proofOfPossessionOptions.resourceRequestMethod, g.resourceRequestUri = V.proofOfPossessionOptions.resourceRequestUrl;
            try {
                return await L.acquireTokenInteractive(g)
            } catch (B) {
                if (hv.verbose(`Failed to authenticate through the broker: ${B.message}`), u) return h(!1);
                else throw B
            }
        }

        function R() {
            var u, I;
            return {
                openBrowser: async (g) => {
                    await (await Promise.resolve().then(() => (Mn7(), Jn7))).default(g, {
                        wait: !0,
                        newInstance: !0
                    })
                },
                scopes: N,
                authority: j(V),
                claims: V === null || V === void 0 ? void 0 : V.claims,
                loginHint: V === null || V === void 0 ? void 0 : V.loginHint,
                errorTemplate: (u = V === null || V === void 0 ? void 0 : V.browserCustomizationOptions) === null || u === void 0 ? void 0 : u.errorMessage,
                successTemplate: (I = V === null || V === void 0 ? void 0 : V.browserCustomizationOptions) === null || I === void 0 ? void 0 : I.successMessage,
                prompt: (V === null || V === void 0 ? void 0 : V.loginHint) ? "login" : "select_account"
            }
        }
        return J(L, N, V, async () => {
            var u;
            let I = R();
            if (z.pluginConfiguration.broker.isEnabled) return h((u = z.pluginConfiguration.broker.useDefaultBrokerAccount) !== null && u !== void 0 ? u : !1);
            if (V.proofOfPossessionOptions) I.shrNonce = V.proofOfPossessionOptions.nonce, I.authenticationScheme = "pop", I.resourceRequestMethod = V.proofOfPossessionOptions.resourceRequestMethod, I.resourceRequestUri = V.proofOfPossessionOptions.resourceRequestUrl;
            return L.acquireTokenInteractive(I)
        })
    }
    return {
        getActiveAccount: Z,
        getTokenByClientSecret: M,
        getTokenByClientAssertion: D,
        getTokenByClientCertificate: X,
        getTokenByDeviceCode: P,
        getTokenByUsernamePassword: W,
        getTokenByAuthorizationCode: G,
        getTokenOnBehalfOf: f,
        getTokenByInteractiveRequest: v
    }
}
// @from(Ln 189746, Col 4)
hv
// @from(Ln 189747, Col 4)
Jd = E(() => {
    MM1();
    H2();
    ND8();
    PM1();
    pM();
    bm6();
    ci7();
    FK6();
    QM();
    hv = h5("MsalClient")
})
// @from(Ln 189759, Col 0)
class r56 {
    constructor(A, q, K, Y = {}) {
        if (!A) throw new D4("ClientAssertionCredential: tenantId is a required parameter.");
        if (!q) throw new D4("ClientAssertionCredential: clientId is a required parameter.");
        if (!K) throw new D4("ClientAssertionCredential: clientAssertion is a required parameter.");
        this.tenantId = A, this.additionallyAllowedTenantIds = _$(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.options = Y, this.getAssertion = K, this.msalClient = oW(q, A, Object.assign(Object.assign({}, Y), {
            logger: Dn7,
            tokenCredentialOptions: this.options
        }))
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, Dn7);
            let Y = Array.isArray(A) ? A : [A];
            return this.msalClient.getTokenByClientAssertion(Y, this.getAssertion, K)
        })
    }
}
// @from(Ln 189777, Col 4)
Dn7
// @from(Ln 189778, Col 4)
GM1 = E(() => {
    Jd();
    QM();
    pM();
    H2();
    dP();
    Dn7 = h5("ClientAssertionCredential")
})