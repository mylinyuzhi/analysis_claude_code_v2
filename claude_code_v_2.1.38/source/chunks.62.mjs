
// @from(Ln 162272, Col 4)
OzA = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    jI1 = class jI1 extends VW {
        constructor(A) {
            super(A)
        }
        async acquireToken(A) {
            let q = await this.getDeviceCode(A);
            A.deviceCodeCallback(q);
            let K = oH.nowSeconds(),
                Y = await this.acquireTokenWithDeviceCode(A, q),
                z = new R_(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return z.validateTokenResponse(Y), z.handleServerTokenResponse(Y, this.authority, K, A)
        }
        async getDeviceCode(A) {
            let q = this.createExtraQueryParameters(A),
                K = A5.appendQueryString(this.authority.deviceCodeEndpoint, q),
                Y = this.createQueryString(A),
                z = this.createTokenRequestHeaders(),
                w = {
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
            return this.executePostRequestToDeviceCodeEndpoint(K, Y, z, w, A.correlationId)
        }
        createExtraQueryParameters(A) {
            let q = new Map;
            if (A.extraQueryParameters) $4.addExtraQueryParameters(q, A.extraQueryParameters);
            return NM.mapToQueryString(q)
        }
        async executePostRequestToDeviceCodeEndpoint(A, q, K, Y, z) {
            let {
                body: {
                    user_code: w,
                    device_code: H,
                    verification_uri: $,
                    expires_in: O,
                    interval: _,
                    message: J
                }
            } = await this.sendPostRequest(Y, A, {
                body: q,
                headers: K
            }, z);
            return {
                userCode: w,
                deviceCode: H,
                verificationUri: $,
                expiresIn: O,
                interval: _,
                message: J
            }
        }
        createQueryString(A) {
            let q = new Map;
            if ($4.addScopes(q, A.scopes), $4.addClientId(q, this.config.authOptions.clientId), A.extraQueryParameters) $4.addExtraQueryParameters(q, A.extraQueryParameters);
            if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) $4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            return NM.mapToQueryString(q)
        }
        continuePolling(A, q, K) {
            if (K) throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true"), Y8(e2.deviceCodePollingCancelled);
            else if (q && q < A && oH.nowSeconds() > q) throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${q}`), Y8(e2.userTimeoutReached);
            else if (oH.nowSeconds() > A) {
                if (q) this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${q}`);
                throw this.logger.error(`Device code expired. Expiration time of device code was ${A}`), Y8(e2.deviceCodeExpired)
            }
            return !0
        }
        async acquireTokenWithDeviceCode(A, q) {
            let K = this.createTokenQueryParameters(A),
                Y = A5.appendQueryString(this.authority.tokenEndpoint, K),
                z = this.createTokenRequestBody(A, q),
                w = this.createTokenRequestHeaders(),
                H = A.timeout ? oH.nowSeconds() + A.timeout : void 0,
                $ = oH.nowSeconds() + q.expiresIn,
                O = q.interval * 1000;
            while (this.continuePolling($, H, A.cancel)) {
                let _ = {
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
                    J = await this.executePostToTokenEndpoint(Y, z, w, _, A.correlationId);
                if (J.body && J.body.error)
                    if (J.body.error === uA.AUTHORIZATION_PENDING) this.logger.info("Authorization pending. Continue polling."), await oH.delay(O);
                    else throw this.logger.info("Unexpected error in polling from the server"), B5A(aJ1.postRequestFailed, J.body.error);
                else return this.logger.verbose("Authorization completed successfully. Polling stopped."), J.body
            }
            throw this.logger.error("Polling stopped for unknown reasons."), Y8(e2.deviceCodeUnknownError)
        }
        createTokenRequestBody(A, q) {
            let K = new Map;
            $4.addScopes(K, A.scopes), $4.addClientId(K, this.config.authOptions.clientId), $4.addGrantType(K, RV.DEVICE_CODE_GRANT), $4.addDeviceCode(K, q.deviceCode);
            let Y = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if ($4.addCorrelationId(K, Y), $4.addClientInfo(K), $4.addLibraryInfo(K, this.config.libraryInfo), $4.addApplicationTelemetry(K, this.config.telemetry.application), $4.addThrottling(K), this.serverTelemetryManager) $4.addServerTelemetry(K, this.serverTelemetryManager);
            if (!kw.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) $4.addClaims(K, A.claims, this.config.authOptions.clientCapabilities);
            return NM.mapToQueryString(K)
        }
    }
})
// @from(Ln 162385, Col 4)
MI1
// @from(Ln 162386, Col 4)
nD7 = v(() => {
    sH();
    ez();
    mY6();
    ih1();
    iD7();
    OzA();
    VX1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    MI1 = class MI1 extends C41 {
        constructor(A) {
            super(A);
            if (this.config.broker.nativeBrokerPlugin)
                if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable) this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
                else this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.");
            this.skus = Ko.makeExtraSkuString({
                libraryName: eG.MSAL_SKU,
                libraryVersion: yS
            })
        }
        async acquireTokenByDeviceCode(A) {
            this.logger.info("acquireTokenByDeviceCode called", A.correlationId);
            let q = Object.assign(A, await this.initializeBaseRequest(A)),
                K = this.initializeServerTelemetryManager(VU.acquireTokenByDeviceCode, q.correlationId);
            try {
                let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                    z = await this.buildOauthClientConfiguration(Y, q.correlationId, "", K),
                    w = new jI1(z);
                return this.logger.verbose("Device code client created", q.correlationId), await w.acquireToken(q)
            } catch (Y) {
                if (Y instanceof m3) Y.setCorrelationId(q.correlationId);
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
                windowHandle: w,
                loopbackClient: H,
                ...$
            } = A;
            if (this.nativeBrokerPlugin) {
                let j = {
                    ...$,
                    clientId: this.config.auth.clientId,
                    scopes: A.scopes || ZW,
                    redirectUri: A.redirectUri || "",
                    authority: A.authority || this.config.auth.authority,
                    correlationId: q,
                    extraParameters: {
                        ...$.extraQueryParameters,
                        ...$.tokenQueryParameters,
                        [M41.X_CLIENT_EXTRA_SKU]: this.skus
                    },
                    accountId: $.account?.nativeAccountId
                };
                return this.nativeBrokerPlugin.acquireTokenInteractive(j, w)
            }
            if (A.redirectUri) {
                if (!this.config.broker.nativeBrokerPlugin) throw Q$.createRedirectUriNotSupportedError();
                A.redirectUri = ""
            }
            let {
                verifier: O,
                challenge: _
            } = await this.cryptoProvider.generatePkceCodes(), J = H || new $zA, X = {}, D = null;
            try {
                let j = J.listenForAuthCode(Y, z).then((Z) => {
                        X = Z
                    }).catch((Z) => {
                        D = Z
                    }),
                    M = await this.waitForRedirectUri(J),
                    P = {
                        ...$,
                        correlationId: q,
                        scopes: A.scopes || ZW,
                        redirectUri: M,
                        responseMode: Cu.QUERY,
                        codeChallenge: _,
                        codeChallengeMethod: e56.S256
                    },
                    W = await this.getAuthCodeUrl(P);
                if (await K(W), await j, D) throw D;
                if (X.error) throw new sG(X.error, X.error_description, X.suberror);
                else if (!X.code) throw Q$.createNoAuthCodeInResponseError();
                let G = X.client_info,
                    f = {
                        code: X.code,
                        codeVerifier: O,
                        clientInfo: G || uA.EMPTY_STRING,
                        ...P
                    };
                return await this.acquireTokenByCode(f)
            } finally {
                J.closeServer()
            }
        }
        async acquireTokenSilent(A) {
            let q = A.correlationId || this.cryptoProvider.createNewGuid();
            if (this.logger.trace("acquireTokenSilent called", q), this.nativeBrokerPlugin) {
                let K = {
                    ...A,
                    clientId: this.config.auth.clientId,
                    scopes: A.scopes || ZW,
                    redirectUri: A.redirectUri || "",
                    authority: A.authority || this.config.auth.authority,
                    correlationId: q,
                    extraParameters: {
                        ...A.tokenQueryParameters,
                        [M41.X_CLIENT_EXTRA_SKU]: this.skus
                    },
                    accountId: A.account.nativeAccountId,
                    forceRefresh: A.forceRefresh || !1
                };
                return this.nativeBrokerPlugin.acquireTokenSilent(K)
            }
            if (A.redirectUri) {
                if (!this.config.broker.nativeBrokerPlugin) throw Q$.createRedirectUriNotSupportedError();
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
                        if (c96.TIMEOUT_MS / c96.INTERVAL_MS < Y) {
                            clearInterval(z), K(Q$.createLoopbackServerTimeoutError());
                            return
                        }
                        try {
                            let w = A.getRedirectUri();
                            clearInterval(z), q(w);
                            return
                        } catch (w) {
                            if (w instanceof m3 && w.errorCode === kX.noLoopbackServerExists.code) {
                                Y++;
                                return
                            }
                            clearInterval(z), K(w);
                            return
                        }
                    }, c96.INTERVAL_MS)
            })
        }
    }
})
// @from(Ln 162555, Col 4)
S41
// @from(Ln 162556, Col 4)
FY6 = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    S41 = class S41 extends VW {
        constructor(A, q) {
            super(A);
            this.appTokenProvider = q
        }
        async acquireToken(A) {
            if (A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority);
            let [q, K] = await this.getCachedAuthenticationResult(A, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
            if (q) {
                if (K === Ew.PROACTIVELY_REFRESHED) {
                    this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                    let Y = !0;
                    await this.executeTokenRequest(A, this.authority, Y)
                }
                return q
            } else return this.executeTokenRequest(A, this.authority)
        }
        async getCachedAuthenticationResult(A, q, K, Y, z, w) {
            let H = q,
                $ = q,
                O = Ew.NOT_APPLICABLE,
                _;
            if (H.serializableCache && H.persistencePlugin) _ = new yL(H.serializableCache, !1), await H.persistencePlugin.beforeCacheAccess(_);
            let J = this.readAccessTokenFromCache(Y, $.managedIdentityId?.id || H.authOptions.clientId, new L_(A.scopes || []), z, A.correlationId);
            if (H.serializableCache && H.persistencePlugin && _) await H.persistencePlugin.afterCacheAccess(_);
            if (!J) return w?.setCacheOutcome(Ew.NO_CACHED_ACCESS_TOKEN), [null, Ew.NO_CACHED_ACCESS_TOKEN];
            if (oH.isTokenExpired(J.expiresOn, H.systemOptions?.tokenRenewalOffsetSeconds || oJ1)) return w?.setCacheOutcome(Ew.CACHED_ACCESS_TOKEN_EXPIRED), [null, Ew.CACHED_ACCESS_TOKEN_EXPIRED];
            if (J.refreshOn && oH.isTokenExpired(J.refreshOn.toString(), 0)) O = Ew.PROACTIVELY_REFRESHED, w?.setCacheOutcome(Ew.PROACTIVELY_REFRESHED);
            return [await R_.generateAuthenticationResult(K, Y, {
                account: null,
                idToken: null,
                accessToken: J,
                refreshToken: null,
                appMetadata: null
            }, !0, A), O]
        }
        readAccessTokenFromCache(A, q, K, Y, z) {
            let w = {
                    homeAccountId: uA.EMPTY_STRING,
                    environment: A.canonicalAuthorityUrlComponents.HostNameAndPort,
                    credentialType: tz.ACCESS_TOKEN,
                    clientId: q,
                    realm: A.tenant,
                    target: L_.createSearchScopes(K.asArray())
                },
                H = Y.getAccessTokensByFilter(w, z);
            if (H.length < 1) return null;
            else if (H.length > 1) throw Y8(e2.multipleMatchingTokens);
            return H[0]
        }
        async executeTokenRequest(A, q, K) {
            let Y, z;
            if (this.appTokenProvider) {
                this.logger.info("Using appTokenProvider extensibility.");
                let $ = {
                    correlationId: A.correlationId,
                    tenantId: this.config.authOptions.authority.tenant,
                    scopes: A.scopes,
                    claims: A.claims
                };
                z = oH.nowSeconds();
                let O = await this.appTokenProvider($);
                Y = {
                    access_token: O.accessToken,
                    expires_in: O.expiresInSeconds,
                    refresh_in: O.refreshInSeconds,
                    token_type: b9.BEARER
                }
            } else {
                let $ = this.createTokenQueryParameters(A),
                    O = A5.appendQueryString(q.tokenEndpoint, $),
                    _ = await this.createTokenRequestBody(A),
                    J = this.createTokenRequestHeaders(),
                    X = {
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
                this.logger.info("Sending token request to endpoint: " + q.tokenEndpoint), z = oH.nowSeconds();
                let D = await this.executePostToTokenEndpoint(O, _, J, X, A.correlationId);
                Y = D.body, Y.status = D.status
            }
            let w = new R_(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return w.validateTokenResponse(Y, K), await w.handleServerTokenResponse(Y, this.authority, z, A)
        }
        async createTokenRequestBody(A) {
            let q = new Map;
            if ($4.addClientId(q, this.config.authOptions.clientId), $4.addScopes(q, A.scopes, !1), $4.addGrantType(q, RV.CLIENT_CREDENTIALS_GRANT), $4.addLibraryInfo(q, this.config.libraryInfo), $4.addApplicationTelemetry(q, this.config.telemetry.application), $4.addThrottling(q), this.serverTelemetryManager) $4.addServerTelemetry(q, this.serverTelemetryManager);
            let K = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if ($4.addCorrelationId(q, K), this.config.clientCredentials.clientSecret) $4.addClientSecret(q, this.config.clientCredentials.clientSecret);
            let Y = A.clientAssertion || this.config.clientCredentials.clientAssertion;
            if (Y) $4.addClientAssertion(q, await tG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), $4.addClientAssertionType(q, Y.assertionType);
            if (!kw.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) $4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            return NM.mapToQueryString(q)
        }
    }
})
// @from(Ln 162661, Col 4)
PI1
// @from(Ln 162662, Col 4)
_zA = v(() => {
    ez();
    ah1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    PI1 = class PI1 extends VW {
        constructor(A) {
            super(A)
        }
        async acquireToken(A) {
            if (this.scopeSet = new L_(A.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(A.oboAssertion), A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority, this.userAssertionHash);
            try {
                return await this.getCachedAuthenticationResult(A)
            } catch (q) {
                return await this.executeTokenRequest(A, this.authority, this.userAssertionHash)
            }
        }
        async getCachedAuthenticationResult(A) {
            let q = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, A);
            if (!q) throw this.serverTelemetryManager?.setCacheOutcome(Ew.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties."), Y8(e2.tokenRefreshRequired);
            else if (oH.isTokenExpired(q.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.serverTelemetryManager?.setCacheOutcome(Ew.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`), Y8(e2.tokenRefreshRequired);
            let K = this.readIdTokenFromCacheForOBO(q.homeAccountId, A.correlationId),
                Y, z = null;
            if (K) {
                Y = J96.extractTokenClaims(K.secret, SV.base64Decode);
                let w = Y.oid || Y.sub,
                    H = {
                        homeAccountId: K.homeAccountId,
                        environment: K.environment,
                        tenantId: K.realm,
                        username: uA.EMPTY_STRING,
                        localAccountId: w || uA.EMPTY_STRING
                    };
                z = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(H), A.correlationId)
            }
            if (this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
            return R_.generateAuthenticationResult(this.cryptoUtils, this.authority, {
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
                    credentialType: tz.ID_TOKEN,
                    clientId: this.config.authOptions.clientId,
                    realm: this.authority.tenant
                },
                Y = this.cacheManager.getIdTokensByFilter(K, q);
            if (Object.values(Y).length < 1) return null;
            return Object.values(Y)[0]
        }
        readAccessTokenFromCacheForOBO(A, q) {
            let K = q.authenticationScheme || b9.BEARER,
                z = {
                    credentialType: K && K.toLowerCase() !== b9.BEARER.toLowerCase() ? tz.ACCESS_TOKEN_WITH_AUTH_SCHEME : tz.ACCESS_TOKEN,
                    clientId: A,
                    target: L_.createSearchScopes(this.scopeSet.asArray()),
                    tokenType: K,
                    keyId: q.sshKid,
                    requestedClaimsHash: q.requestedClaimsHash,
                    userAssertionHash: this.userAssertionHash
                },
                w = this.cacheManager.getAccessTokensByFilter(z, q.correlationId),
                H = w.length;
            if (H < 1) return null;
            else if (H > 1) throw Y8(e2.multipleMatchingTokens);
            return w[0]
        }
        async executeTokenRequest(A, q, K) {
            let Y = this.createTokenQueryParameters(A),
                z = A5.appendQueryString(q.tokenEndpoint, Y),
                w = await this.createTokenRequestBody(A),
                H = this.createTokenRequestHeaders(),
                $ = {
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
                O = oH.nowSeconds(),
                _ = await this.executePostToTokenEndpoint(z, w, H, $, A.correlationId),
                J = new R_(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return J.validateTokenResponse(_.body), await J.handleServerTokenResponse(_.body, this.authority, O, A, void 0, K)
        }
        async createTokenRequestBody(A) {
            let q = new Map;
            if ($4.addClientId(q, this.config.authOptions.clientId), $4.addScopes(q, A.scopes), $4.addGrantType(q, RV.JWT_BEARER), $4.addClientInfo(q), $4.addLibraryInfo(q, this.config.libraryInfo), $4.addApplicationTelemetry(q, this.config.telemetry.application), $4.addThrottling(q), this.serverTelemetryManager) $4.addServerTelemetry(q, this.serverTelemetryManager);
            let K = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if ($4.addCorrelationId(q, K), $4.addRequestTokenUse(q, M41.ON_BEHALF_OF), $4.addOboAssertion(q, A.oboAssertion), this.config.clientCredentials.clientSecret) $4.addClientSecret(q, this.config.clientCredentials.clientSecret);
            let Y = this.config.clientCredentials.clientAssertion;
            if (Y) $4.addClientAssertion(q, await tG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), $4.addClientAssertionType(q, Y.assertionType);
            if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) $4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            return NM.mapToQueryString(q)
        }
    }
})
// @from(Ln 162766, Col 4)
WI1
// @from(Ln 162767, Col 4)
rD7 = v(() => {
    mY6();
    uY6();
    sH();
    ez();
    FY6();
    _zA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    WI1 = class WI1 extends C41 {
        constructor(A) {
            super(A);
            let q = !!this.config.auth.clientSecret,
                K = !!this.config.auth.clientAssertion,
                Y = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
            if (this.appTokenProvider) return;
            if (q && K || K && Y || q && Y) throw Y8(e2.invalidClientCredential);
            if (this.config.auth.clientSecret) {
                this.clientSecret = this.config.auth.clientSecret;
                return
            }
            if (this.config.auth.clientAssertion) {
                this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
                return
            }
            if (!Y) throw Y8(e2.invalidClientCredential);
            else this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? RS.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : RS.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
            this.appTokenProvider = void 0
        }
        SetAppTokenProvider(A) {
            this.appTokenProvider = A
        }
        async acquireTokenByClientCredential(A) {
            this.logger.info("acquireTokenByClientCredential called", A.correlationId);
            let q;
            if (A.clientAssertion) q = {
                assertion: await tG(A.clientAssertion, this.config.auth.clientId),
                assertionType: eG.JWT_BEARER_ASSERTION_TYPE
            };
            let K = await this.initializeBaseRequest(A),
                Y = {
                    ...K,
                    scopes: K.scopes.filter((X) => !ZW.includes(X))
                },
                z = {
                    ...A,
                    ...Y,
                    clientAssertion: q
                },
                H = new A5(z.authority).getUrlComponents().PathSegments[0];
            if (Object.values(LV).includes(H)) throw Y8(e2.missingTenantIdError);
            let $ = process.env[qO7],
                O;
            if (z.azureRegion !== "DisableMsalForceRegion")
                if (!z.azureRegion && $) O = $;
                else O = z.azureRegion;
            let _ = {
                    azureRegion: O,
                    environmentRegion: process.env[AO7]
                },
                J = this.initializeServerTelemetryManager(VU.acquireTokenByClientCredential, z.correlationId, z.skipCache);
            try {
                let X = await this.createAuthority(z.authority, z.correlationId, _, A.azureCloudOptions),
                    D = await this.buildOauthClientConfiguration(X, z.correlationId, "", J),
                    j = new S41(D, this.appTokenProvider);
                return this.logger.verbose("Client credential client created", z.correlationId), await j.acquireToken(z)
            } catch (X) {
                if (X instanceof m3) X.setCorrelationId(z.correlationId);
                throw J.cacheFailedRequest(X), X
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
                    z = new PI1(Y);
                return this.logger.verbose("On behalf of client created", q.correlationId), await z.acquireToken(q)
            } catch (K) {
                if (K instanceof m3) K.setCorrelationId(q.correlationId);
                throw K
            }
        }
    }
})
// @from(Ln 162855, Col 0)
function oD7(A) {
    if (typeof A !== "string") return !1;
    let q = new Date(A);
    return !isNaN(q.getTime()) && q.toISOString() === A
}
// @from(Ln 162860, Col 4)
aD7 = v(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 162862, Col 0)
class JzA {
    constructor(A, q, K) {
        this.httpClientNoRetries = A, this.retryPolicy = q, this.logger = K
    }
    async sendNetworkRequestAsyncHelper(A, q, K) {
        if (A === aH.GET) return this.httpClientNoRetries.sendGetRequestAsync(q, K);
        else return this.httpClientNoRetries.sendPostRequestAsync(q, K)
    }
    async sendNetworkRequestAsync(A, q, K) {
        let Y = await this.sendNetworkRequestAsyncHelper(A, q, K);
        if ("isNewRequest" in this.retryPolicy) this.retryPolicy.isNewRequest = !0;
        let z = 0;
        while (await this.retryPolicy.pauseForRetry(Y.status, z, this.logger, Y.headers[PH.RETRY_AFTER])) Y = await this.sendNetworkRequestAsyncHelper(A, q, K), z++;
        return Y
    }
    async sendGetRequestAsync(A, q) {
        return this.sendNetworkRequestAsync(aH.GET, A, q)
    }
    async sendPostRequestAsync(A, q) {
        return this.sendNetworkRequestAsync(aH.POST, A, q)
    }
}
// @from(Ln 162884, Col 4)
sD7 = v(() => {
    ez();
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 162888, Col 0)
class IV {
    constructor(A, q, K, Y, z) {
        this.logger = A, this.nodeStorage = q, this.networkClient = K, this.cryptoProvider = Y, this.disableInternalRetries = z
    }
    async getServerTokenResponseAsync(A, q, K, Y) {
        return this.getServerTokenResponse(A)
    }
    getServerTokenResponse(A) {
        let q, K;
        if (A.body.expires_on) {
            if (oD7(A.body.expires_on)) A.body.expires_on = new Date(A.body.expires_on).getTime() / 1000;
            if (K = A.body.expires_on - oH.nowSeconds(), K > 7200) q = K / 2
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
        if (A.revokedTokenSha256Hash) this.logger.info(`[Managed Identity] The following claims are present in the request: ${A.claims}`), z.queryParameters[EX.SHA256_TOKEN_TO_REFRESH] = A.revokedTokenSha256Hash;
        if (A.clientCapabilities?.length) {
            let D = A.clientCapabilities.toString();
            this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${D}`), z.queryParameters[EX.XMS_CC] = D
        }
        let w = z.headers;
        w[PH.CONTENT_TYPE] = uA.URL_FORM_CONTENT_TYPE;
        let H = {
            headers: w
        };
        if (Object.keys(z.bodyParameters).length) H.body = z.computeParametersBodyString();
        let $ = this.disableInternalRetries ? this.networkClient : new JzA(this.networkClient, z.retryPolicy, this.logger),
            O = oH.nowSeconds(),
            _;
        try {
            if (z.httpMethod === aH.POST) _ = await $.sendPostRequestAsync(z.computeUri(), H);
            else _ = await $.sendGetRequestAsync(z.computeUri(), H)
        } catch (D) {
            if (D instanceof m3) throw D;
            else throw Y8(e2.networkError)
        }
        let J = new R_(q.id, this.nodeStorage, this.cryptoProvider, this.logger, null, null),
            X = await this.getServerTokenResponseAsync(_, $, z, H);
        return J.validateTokenResponse(X, Y), J.handleServerTokenResponse(X, K, O, A)
    }
    getManagedIdentityUserAssignedIdQueryParameterKey(A, q, K) {
        switch (A) {
            case FO.USER_ASSIGNED_CLIENT_ID:
                return this.logger.info(`[Managed Identity] [API version ${K?"2017+":"2019+"}] Adding user assigned client id to the request.`), K ? h41.MANAGED_IDENTITY_CLIENT_ID_2017 : h41.MANAGED_IDENTITY_CLIENT_ID;
            case FO.USER_ASSIGNED_RESOURCE_ID:
                return this.logger.info("[Managed Identity] Adding user assigned resource id to the request."), q ? h41.MANAGED_IDENTITY_RESOURCE_ID_IMDS : h41.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
            case FO.USER_ASSIGNED_OBJECT_ID:
                return this.logger.info("[Managed Identity] Adding user assigned object id to the request."), h41.MANAGED_IDENTITY_OBJECT_ID;
            default:
                throw DJ(zo)
        }
    }
}
// @from(Ln 162956, Col 4)
h41
// @from(Ln 162957, Col 4)
I41 = v(() => {
    ez();
    sH();
    MX1();
    aD7();
    sD7();
    E41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    h41 = {
        MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
        MANAGED_IDENTITY_CLIENT_ID: "client_id",
        MANAGED_IDENTITY_OBJECT_ID: "object_id",
        MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
        MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
    };
    IV.getValidatedEnvVariableUrlString = (A, q, K, Y) => {
        try {
            return new A5(q).urlString
        } catch (z) {
            throw Y.info(`[Managed Identity] ${K} managed identity is unavailable because the '${A}' environment variable is malformed.`), DJ(v41[A])
        }
    }
})
// @from(Ln 162979, Col 0)
class XzA {
    calculateDelay(A, q) {
        if (!A) return q;
        let K = Math.round(parseFloat(A) * 1000);
        if (isNaN(K)) K = new Date(A).valueOf() - new Date().valueOf();
        return Math.max(q, K)
    }
}
// @from(Ln 162987, Col 4)
tD7 = v(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 162989, Col 0)
class QY6 {
    constructor() {
        this.linearRetryStrategy = new XzA
    }
    static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
        return Pc5
    }
    async pauseForRetry(A, q, K, Y) {
        if (Wc5.includes(A) && q < Mc5) {
            let z = this.linearRetryStrategy.calculateDelay(Y, QY6.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
            return K.verbose(`Retrying request in ${z}ms (retry attempt: ${q+1})`), await new Promise((w) => {
                return setTimeout(w, z)
            }), !0
        }
        return !1
    }
}
// @from(Ln 163006, Col 4)
Mc5 = 3
// @from(Ln 163007, Col 4)
Pc5 = 1000
// @from(Ln 163008, Col 4)
Wc5
// @from(Ln 163009, Col 4)
eD7 = v(() => {
    YY6();
    tD7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Wc5 = [B3.NOT_FOUND, B3.REQUEST_TIMEOUT, B3.TOO_MANY_REQUESTS, B3.SERVER_ERROR, B3.SERVICE_UNAVAILABLE, B3.GATEWAY_TIMEOUT]
})
// @from(Ln 163014, Col 0)
class Jv {
    constructor(A, q, K) {
        this.httpMethod = A, this._baseEndpoint = q, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = K || new QY6
    }
    computeUri() {
        let A = new Map;
        if (this.queryParameters) $4.addExtraQueryParameters(A, this.queryParameters);
        let q = NM.mapToQueryString(A);
        return A5.appendQueryString(this._baseEndpoint, q)
    }
    computeParametersBodyString() {
        let A = new Map;
        if (this.bodyParameters) $4.addExtraQueryParameters(A, this.bodyParameters);
        return NM.mapToQueryString(A)
    }
}
// @from(Ln 163030, Col 4)
x41 = v(() => {
    ez();
    eD7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 163034, Col 4)
Gc5 = "2019-08-01"
// @from(Ln 163035, Col 4)
b41
// @from(Ln 163036, Col 4)
A07 = v(() => {
    I41();
    sH();
    x41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    b41 = class b41 extends IV {
        constructor(A, q, K, Y, z, w, H) {
            super(A, q, K, Y, z);
            this.identityEndpoint = w, this.identityHeader = H
        }
        static getEnvironmentVariables() {
            let A = process.env[lK.IDENTITY_ENDPOINT],
                q = process.env[lK.IDENTITY_HEADER];
            return [A, q]
        }
        static tryCreate(A, q, K, Y, z) {
            let [w, H] = b41.getEnvironmentVariables();
            if (!w || !H) return A.info(`[Managed Identity] ${P3.APP_SERVICE} managed identity is unavailable because one or both of the '${lK.IDENTITY_HEADER}' and '${lK.IDENTITY_ENDPOINT}' environment variables are not defined.`), null;
            let $ = b41.getValidatedEnvVariableUrlString(lK.IDENTITY_ENDPOINT, w, P3.APP_SERVICE, A);
            return A.info(`[Managed Identity] Environment variables validation passed for ${P3.APP_SERVICE} managed identity. Endpoint URI: ${$}. Creating ${P3.APP_SERVICE} managed identity.`), new b41(A, q, K, Y, z, w, H)
        }
        createRequest(A, q) {
            let K = new Jv(aH.GET, this.identityEndpoint);
            if (K.headers[CV.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, K.queryParameters[EX.API_VERSION] = Gc5, K.queryParameters[EX.RESOURCE] = A, q.idType !== FO.SYSTEM_ASSIGNED) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType)] = q.id;
            return K
        }
    }
})
// @from(Ln 163070, Col 4)
Tc5 = "2019-11-01"
// @from(Ln 163071, Col 4)
K07 = "http://127.0.0.1:40342/metadata/identity/oauth2/token"
// @from(Ln 163072, Col 4)
Y07 = "N/A: himds executable exists"
// @from(Ln 163073, Col 4)
z07
// @from(Ln 163073, Col 9)
vc5
// @from(Ln 163073, Col 14)
Ho
// @from(Ln 163074, Col 4)
w07 = v(() => {
    ez();
    x41();
    I41();
    MX1();
    sH();
    E41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    z07 = {
        win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
        linux: "/var/opt/azcmagent/tokens/"
    }, vc5 = {
        win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
        linux: "/opt/azcmagent/bin/himds"
    };
    Ho = class Ho extends IV {
        constructor(A, q, K, Y, z, w) {
            super(A, q, K, Y, z);
            this.identityEndpoint = w
        }
        static getEnvironmentVariables() {
            let A = process.env[lK.IDENTITY_ENDPOINT],
                q = process.env[lK.IMDS_ENDPOINT];
            if (!A || !q) {
                let K = vc5[process.platform];
                try {
                    Zc5(K, q07.F_OK | q07.R_OK), A = K07, q = Y07
                } catch (Y) {}
            }
            return [A, q]
        }
        static tryCreate(A, q, K, Y, z, w) {
            let [H, $] = Ho.getEnvironmentVariables();
            if (!H || !$) return A.info(`[Managed Identity] ${P3.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${lK.IDENTITY_ENDPOINT}' and '${lK.IMDS_ENDPOINT}' are not defined. ${P3.AZURE_ARC} managed identity is also unavailable through file detection.`), null;
            if ($ === Y07) A.info(`[Managed Identity] ${P3.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${P3.AZURE_ARC} endpoint: ${K07}. Creating ${P3.AZURE_ARC} managed identity.`);
            else {
                let O = Ho.getValidatedEnvVariableUrlString(lK.IDENTITY_ENDPOINT, H, P3.AZURE_ARC, A);
                O.endsWith("/") && O.slice(0, -1), Ho.getValidatedEnvVariableUrlString(lK.IMDS_ENDPOINT, $, P3.AZURE_ARC, A), A.info(`[Managed Identity] Environment variables validation passed for ${P3.AZURE_ARC} managed identity. Endpoint URI: ${O}. Creating ${P3.AZURE_ARC} managed identity.`)
            }
            if (w.idType !== FO.SYSTEM_ASSIGNED) throw DJ(o96);
            return new Ho(A, q, K, Y, z, H)
        }
        createRequest(A) {
            let q = new Jv(aH.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
            return q.headers[CV.METADATA_HEADER_NAME] = "true", q.queryParameters[EX.API_VERSION] = Tc5, q.queryParameters[EX.RESOURCE] = A, q
        }
        async getServerTokenResponseAsync(A, q, K, Y) {
            let z;
            if (A.status === B3.UNAUTHORIZED) {
                let w = A.headers["www-authenticate"];
                if (!w) throw DJ(t96);
                if (!w.includes("Basic realm=")) throw DJ(e96);
                let H = w.split("Basic realm=")[1];
                if (!z07.hasOwnProperty(process.platform)) throw DJ(r96);
                let $ = z07[process.platform],
                    O = Nc5.basename(H);
                if (!O.endsWith(".key")) throw DJ(l96);
                if ($ + O !== H) throw DJ(i96);
                let _;
                try {
                    _ = await fc5(H).size
                } catch (D) {
                    throw DJ(lh1)
                }
                if (_ > zO7) throw DJ(n96);
                let J;
                try {
                    J = Vc5(H, VM.UTF8)
                } catch (D) {
                    throw DJ(lh1)
                }
                let X = `Basic ${J}`;
                this.logger.info("[Managed Identity] Adding authorization header to the request."), K.headers[CV.AUTHORIZATION_HEADER_NAME] = X;
                try {
                    z = await q.sendGetRequestAsync(K.computeUri(), Y)
                } catch (D) {
                    if (D instanceof m3) throw D;
                    else throw Y8(e2.networkError)
                }
            }
            return this.getServerTokenResponse(z || A)
        }
    }
})
// @from(Ln 163157, Col 4)
u41
// @from(Ln 163158, Col 4)
H07 = v(() => {
    x41();
    I41();
    sH();
    MX1();
    E41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    u41 = class u41 extends IV {
        constructor(A, q, K, Y, z, w) {
            super(A, q, K, Y, z);
            this.msiEndpoint = w
        }
        static getEnvironmentVariables() {
            return [process.env[lK.MSI_ENDPOINT]]
        }
        static tryCreate(A, q, K, Y, z, w) {
            let [H] = u41.getEnvironmentVariables();
            if (!H) return A.info(`[Managed Identity] ${P3.CLOUD_SHELL} managed identity is unavailable because the '${lK.MSI_ENDPOINT} environment variable is not defined.`), null;
            let $ = u41.getValidatedEnvVariableUrlString(lK.MSI_ENDPOINT, H, P3.CLOUD_SHELL, A);
            if (A.info(`[Managed Identity] Environment variable validation passed for ${P3.CLOUD_SHELL} managed identity. Endpoint URI: ${$}. Creating ${P3.CLOUD_SHELL} managed identity.`), w.idType !== FO.SYSTEM_ASSIGNED) throw DJ(a96);
            return new u41(A, q, K, Y, z, H)
        }
        createRequest(A) {
            let q = new Jv(aH.POST, this.msiEndpoint);
            return q.headers[CV.METADATA_HEADER_NAME] = "true", q.bodyParameters[EX.RESOURCE] = A, q
        }
    }
})
// @from(Ln 163185, Col 0)
class DzA {
    constructor(A, q, K) {
        this.minExponentialBackoff = A, this.maxExponentialBackoff = q, this.exponentialDeltaBackoff = K
    }
    calculateDelay(A) {
        if (A === 0) return this.minExponentialBackoff;
        return Math.min(Math.pow(2, A - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff)
    }
}
// @from(Ln 163194, Col 4)
$07 = v(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 163196, Col 0)
class B41 {
    constructor() {
        this.exponentialRetryStrategy = new DzA(B41.MIN_EXPONENTIAL_BACKOFF_MS, B41.MAX_EXPONENTIAL_BACKOFF_MS, B41.EXPONENTIAL_DELTA_BACKOFF_MS)
    }
    static get MIN_EXPONENTIAL_BACKOFF_MS() {
        return Rc5
    }
    static get MAX_EXPONENTIAL_BACKOFF_MS() {
        return yc5
    }
    static get EXPONENTIAL_DELTA_BACKOFF_MS() {
        return Cc5
    }
    static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
        return Sc5
    }
    set isNewRequest(A) {
        this._isNewRequest = A
    }
    async pauseForRetry(A, q, K) {
        if (this._isNewRequest) this._isNewRequest = !1, this.maxRetries = A === B3.GONE ? Lc5 : kc5;
        if ((Ec5.includes(A) || A >= B3.SERVER_ERROR_RANGE_START && A <= B3.SERVER_ERROR_RANGE_END && q < this.maxRetries) && q < this.maxRetries) {
            let Y = A === B3.GONE ? B41.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(q);
            return K.verbose(`Retrying request in ${Y}ms (retry attempt: ${q+1})`), await new Promise((z) => {
                return setTimeout(z, Y)
            }), !0
        }
        return !1
    }
}
// @from(Ln 163226, Col 4)
Ec5
// @from(Ln 163226, Col 9)
kc5 = 3
// @from(Ln 163227, Col 4)
Lc5 = 7
// @from(Ln 163228, Col 4)
Rc5 = 1000
// @from(Ln 163229, Col 4)
yc5 = 4000
// @from(Ln 163230, Col 4)
Cc5 = 2000
// @from(Ln 163231, Col 4)
Sc5 = 1e4
// @from(Ln 163232, Col 4)
O07 = v(() => {
    YY6();
    $07(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Ec5 = [B3.NOT_FOUND, B3.REQUEST_TIMEOUT, B3.GONE, B3.TOO_MANY_REQUESTS]
})
// @from(Ln 163237, Col 4)
_07 = "/metadata/identity/oauth2/token"
// @from(Ln 163238, Col 4)
hc5
// @from(Ln 163238, Col 9)
Ic5 = "2018-02-01"
// @from(Ln 163239, Col 4)
GI1
// @from(Ln 163240, Col 4)
J07 = v(() => {
    x41();
    I41();
    sH();
    O07(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    hc5 = `http://169.254.169.254${_07}`;
    GI1 = class GI1 extends IV {
        constructor(A, q, K, Y, z, w) {
            super(A, q, K, Y, z);
            this.identityEndpoint = w
        }
        static tryCreate(A, q, K, Y, z) {
            let w;
            if (process.env[lK.AZURE_POD_IDENTITY_AUTHORITY_HOST]) A.info(`[Managed Identity] Environment variable ${lK.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${P3.IMDS} returned endpoint: ${process.env[lK.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`), w = GI1.getValidatedEnvVariableUrlString(lK.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[lK.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${_07}`, P3.IMDS, A);
            else A.info(`[Managed Identity] Unable to find ${lK.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${P3.IMDS}, using the default endpoint.`), w = hc5;
            return new GI1(A, q, K, Y, z, w)
        }
        createRequest(A, q) {
            let K = new Jv(aH.GET, this.identityEndpoint);
            if (K.headers[CV.METADATA_HEADER_NAME] = "true", K.queryParameters[EX.API_VERSION] = Ic5, K.queryParameters[EX.RESOURCE] = A, q.idType !== FO.SYSTEM_ASSIGNED) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType, !0)] = q.id;
            return K.retryPolicy = new B41, K
        }
    }
})
// @from(Ln 163264, Col 4)
xc5 = "2019-07-01-preview"
// @from(Ln 163265, Col 4)
m41
// @from(Ln 163266, Col 4)
X07 = v(() => {
    x41();
    I41();
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    m41 = class m41 extends IV {
        constructor(A, q, K, Y, z, w, H) {
            super(A, q, K, Y, z);
            this.identityEndpoint = w, this.identityHeader = H
        }
        static getEnvironmentVariables() {
            let A = process.env[lK.IDENTITY_ENDPOINT],
                q = process.env[lK.IDENTITY_HEADER],
                K = process.env[lK.IDENTITY_SERVER_THUMBPRINT];
            return [A, q, K]
        }
        static tryCreate(A, q, K, Y, z, w) {
            let [H, $, O] = m41.getEnvironmentVariables();
            if (!H || !$ || !O) return A.info(`[Managed Identity] ${P3.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${lK.IDENTITY_HEADER}', '${lK.IDENTITY_ENDPOINT}' or '${lK.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`), null;
            let _ = m41.getValidatedEnvVariableUrlString(lK.IDENTITY_ENDPOINT, H, P3.SERVICE_FABRIC, A);
            if (A.info(`[Managed Identity] Environment variables validation passed for ${P3.SERVICE_FABRIC} managed identity. Endpoint URI: ${_}. Creating ${P3.SERVICE_FABRIC} managed identity.`), w.idType !== FO.SYSTEM_ASSIGNED) A.warning(`[Managed Identity] ${P3.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`);
            return new m41(A, q, K, Y, z, H, $)
        }
        createRequest(A, q) {
            let K = new Jv(aH.GET, this.identityEndpoint);
            if (K.headers[CV.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, K.queryParameters[EX.API_VERSION] = xc5, K.queryParameters[EX.RESOURCE] = A, q.idType !== FO.SYSTEM_ASSIGNED) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType)] = q.id;
            return K
        }
    }
})
// @from(Ln 163295, Col 4)
bc5 = "2017-09-01"
// @from(Ln 163296, Col 4)
uc5
// @from(Ln 163296, Col 9)
F41
// @from(Ln 163297, Col 4)
D07 = v(() => {
    I41();
    sH();
    x41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    uc5 = `Only client id is supported for user-assigned managed identity in ${P3.MACHINE_LEARNING}.`;
    F41 = class F41 extends IV {
        constructor(A, q, K, Y, z, w, H) {
            super(A, q, K, Y, z);
            this.msiEndpoint = w, this.secret = H
        }
        static getEnvironmentVariables() {
            let A = process.env[lK.MSI_ENDPOINT],
                q = process.env[lK.MSI_SECRET];
            return [A, q]
        }
        static tryCreate(A, q, K, Y, z) {
            let [w, H] = F41.getEnvironmentVariables();
            if (!w || !H) return A.info(`[Managed Identity] ${P3.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${lK.MSI_ENDPOINT}' and '${lK.MSI_SECRET}' environment variables are not defined.`), null;
            let $ = F41.getValidatedEnvVariableUrlString(lK.MSI_ENDPOINT, w, P3.MACHINE_LEARNING, A);
            return A.info(`[Managed Identity] Environment variables validation passed for ${P3.MACHINE_LEARNING} managed identity. Endpoint URI: ${$}. Creating ${P3.MACHINE_LEARNING} managed identity.`), new F41(A, q, K, Y, z, w, H)
        }
        createRequest(A, q) {
            let K = new Jv(aH.GET, this.msiEndpoint);
            if (K.headers[CV.METADATA_HEADER_NAME] = "true", K.headers[CV.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, K.queryParameters[EX.API_VERSION] = bc5, K.queryParameters[EX.RESOURCE] = A, q.idType === FO.SYSTEM_ASSIGNED) K.queryParameters[h41.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[lK.DEFAULT_IDENTITY_CLIENT_ID];
            else if (q.idType === FO.USER_ASSIGNED_CLIENT_ID) K.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(q.idType, !1, !0)] = q.id;
            else throw Error(uc5);
            return K
        }
    }
})
// @from(Ln 163327, Col 0)
class vU {
    constructor(A, q, K, Y, z) {
        this.logger = A, this.nodeStorage = q, this.networkClient = K, this.cryptoProvider = Y, this.disableInternalRetries = z
    }
    async sendManagedIdentityTokenRequest(A, q, K, Y) {
        if (!vU.identitySource) vU.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, q);
        return vU.identitySource.acquireTokenWithManagedIdentity(A, q, K, Y)
    }
    allEnvironmentVariablesAreDefined(A) {
        return Object.values(A).every((q) => {
            return q !== void 0
        })
    }
    getManagedIdentitySource() {
        return vU.sourceName = this.allEnvironmentVariablesAreDefined(m41.getEnvironmentVariables()) ? P3.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(b41.getEnvironmentVariables()) ? P3.APP_SERVICE : this.allEnvironmentVariablesAreDefined(F41.getEnvironmentVariables()) ? P3.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(u41.getEnvironmentVariables()) ? P3.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(Ho.getEnvironmentVariables()) ? P3.AZURE_ARC : P3.DEFAULT_TO_IMDS, vU.sourceName
    }
    selectManagedIdentitySource(A, q, K, Y, z, w) {
        let H = m41.tryCreate(A, q, K, Y, z, w) || b41.tryCreate(A, q, K, Y, z) || F41.tryCreate(A, q, K, Y, z) || u41.tryCreate(A, q, K, Y, z, w) || Ho.tryCreate(A, q, K, Y, z, w) || GI1.tryCreate(A, q, K, Y, z);
        if (!H) throw DJ(s96);
        return H
    }
}
// @from(Ln 163349, Col 4)
j07 = v(() => {
    A07();
    w07();
    H07();
    J07();
    X07();
    MX1();
    sH();
    D07();
    E41(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 163360, Col 0)
class Qu {
    constructor(A) {
        this.config = WO7(A || {}), this.logger = new yV(this.config.system.loggerOptions, BY6, yS);
        let q = {
            canonicalAuthority: uA.DEFAULT_AUTHORITY
        };
        if (!Qu.nodeStorage) Qu.nodeStorage = new L41(this.logger, this.config.managedIdentityId.id, sJ1, q);
        this.networkClient = this.config.system.networkClient, this.cryptoProvider = new TU;
        let K = {
            protocolMode: fW.AAD,
            knownAuthorities: [HYA],
            cloudDiscoveryMetadata: "",
            authorityMetadata: ""
        };
        this.fakeAuthority = new mD(HYA, this.networkClient, Qu.nodeStorage, K, this.logger, this.cryptoProvider.createNewGuid(), void 0, !0), this.fakeClientCredentialClient = new S41({
            authOptions: {
                clientId: this.config.managedIdentityId.id,
                authority: this.fakeAuthority
            }
        }), this.managedIdentityClient = new vU(this.logger, Qu.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new k41
    }
    async acquireToken(A) {
        if (!A.resource) throw Aw(eJ1.urlEmptyError);
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
        let [K, Y] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(q, this.config, this.cryptoProvider, this.fakeAuthority, Qu.nodeStorage);
        if (q.claims) {
            let z = this.managedIdentityClient.getManagedIdentitySource();
            if (K && Bc5.includes(z)) {
                let w = this.hashUtils.sha256(K.accessToken).toString(VM.HEX);
                q.revokedTokenSha256Hash = w
            }
            return this.acquireTokenFromManagedIdentity(q, this.config.managedIdentityId, this.fakeAuthority)
        }
        if (K) {
            if (Y === Ew.PROACTIVELY_REFRESHED) {
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
        return vU.sourceName || this.managedIdentityClient.getManagedIdentitySource()
    }
}
// @from(Ln 163418, Col 4)
Bc5
// @from(Ln 163419, Col 4)
M07 = v(() => {
    ez();
    DYA();
    VX1();
    sh1();
    FY6();
    j07();
    zY6();
    sH();
    KY6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Bc5 = [P3.SERVICE_FABRIC]
})
// @from(Ln 163431, Col 0)
class jzA {
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
                K = Object.values(q).filter((z) => vX.isAccountEntity(z)),
                Y;
            if (K.length > 0) {
                let z = K[0];
                Y = await this.partitionManager.extractKey(z)
            } else Y = await this.partitionManager.getKey();
            await this.client.set(Y, A.tokenCache.serialize())
        }
    }
}
// @from(Ln 163453, Col 4)
P07 = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 163456, Col 4)
Xv = {}
// @from(Ln 163494, Col 4)
gY6 = v(() => {
    t$7();
    nD7();
    rD7();
    mY6();
    FY6();
    OzA();
    _zA();
    M07();
    HzA();
    uY6();
    NYA();
    P07();
    sH();
    sh1();
    ez();
    VX1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 163512, Col 4)
W07 = v(() => {
    gY6()
})
// @from(Ln 163516, Col 0)
function NX1(A, q, K) {
    let Y = (z) => {
        return ZI1.getToken.info(z), new fS({
            scopes: Array.isArray(A) ? A : [A],
            getTokenOptions: K,
            message: z
        })
    };
    if (!q) throw Y("No response");
    if (!q.expiresOn) throw Y('Response had no "expiresOn" property.');
    if (!q.accessToken) throw Y('Response had no "accessToken" property.')
}
// @from(Ln 163529, Col 0)
function MzA(A) {
    let q = A === null || A === void 0 ? void 0 : A.authorityHost;
    if (!q && yS1) q = process.env.AZURE_AUTHORITY_HOST;
    return q !== null && q !== void 0 ? q : WS1
}
// @from(Ln 163535, Col 0)
function PzA(A, q) {
    if (!q) q = WS1;
    if (new RegExp(`${A}/?$`).test(q)) return q;
    if (q.endsWith("/")) return q + A;
    else return `${q}/${A}`
}
// @from(Ln 163542, Col 0)
function Z07(A, q, K) {
    if (A === "adfs" && q || K) return [q];
    return []
}
// @from(Ln 163547, Col 0)
function pY6(A) {
    switch (A) {
        case "error":
            return Xv.LogLevel.Error;
        case "info":
            return Xv.LogLevel.Info;
        case "verbose":
            return Xv.LogLevel.Verbose;
        case "warning":
            return Xv.LogLevel.Warning;
        default:
            return Xv.LogLevel.Info
    }
}
// @from(Ln 163562, Col 0)
function Q41(A, q, K) {
    if (q.name === "AuthError" || q.name === "ClientAuthError" || q.name === "BrowserAuthError") {
        let Y = q;
        switch (Y.errorCode) {
            case "endpoints_resolution_error":
                return ZI1.info(e9(A, q.message)), new f4(q.message);
            case "device_code_polling_cancelled":
                return new dJ1("The authentication has been aborted by the caller.");
            case "consent_required":
            case "interaction_required":
            case "login_required":
                ZI1.info(e9(A, `Authentication returned errorCode ${Y.errorCode}`));
                break;
            default:
                ZI1.info(e9(A, `Failed to acquire token: ${q.message}`));
                break
        }
    }
    if (q.name === "ClientConfigurationError" || q.name === "BrowserConfigurationAuthError" || q.name === "AbortError" || q.name === "AuthenticationError") return q;
    if (q.name === "NativeAuthError") return ZI1.info(e9(A, `Error from the native broker: ${q.message} with status code: ${q.statusCode}`)), q;
    return new fS({
        scopes: A,
        getTokenOptions: K,
        message: q.message
    })
}
// @from(Ln 163589, Col 0)
function f07(A) {
    return {
        localAccountId: A.homeAccountId,
        environment: A.authority,
        username: A.username,
        homeAccountId: A.homeAccountId,
        tenantId: A.tenantId
    }
}
// @from(Ln 163599, Col 0)
function V07(A, q) {
    var K;
    return {
        authority: (K = q.environment) !== null && K !== void 0 ? K : J27,
        homeAccountId: q.homeAccountId,
        tenantId: q.tenantId || _27,
        username: q.username,
        clientId: A,
        version: G07
    }
}
// @from(Ln 163611, Col 0)
function N07(A) {
    return JSON.stringify(A)
}
// @from(Ln 163615, Col 0)
function T07(A) {
    let q = JSON.parse(A);
    if (q.version && q.version !== G07) throw Error("Unsupported AuthenticationRecord version");
    return q
}
// @from(Ln 163620, Col 4)
ZI1
// @from(Ln 163620, Col 9)
G07 = "1.0"
// @from(Ln 163621, Col 4)
UY6 = (A, q = l56 ? "Node" : "Browser") => (K, Y, z) => {
        if (z) return;
        switch (K) {
            case Xv.LogLevel.Error:
                A.info(`MSAL ${q} V2 error: ${Y}`);
                return;
            case Xv.LogLevel.Info:
                A.info(`MSAL ${q} V2 info message: ${Y}`);
                return;
            case Xv.LogLevel.Verbose:
                A.info(`MSAL ${q} V2 verbose message: ${Y}`);
                return;
            case Xv.LogLevel.Warning:
                A.info(`MSAL ${q} V2 warning: ${Y}`);
                return
        }
    }
// @from(Ln 163638, Col 4)
dY6 = v(() => {
    bD();
    t2();
    Tu();
    mr();
    f5A();
    W07();
    ZI1 = n3("IdentityUtils")
})
// @from(Ln 163648, Col 0)
function v07(A) {
    return R5A([{
        name: "imdsRetryPolicy",
        retry: ({
            retryCount: q,
            response: K
        }) => {
            if ((K === null || K === void 0 ? void 0 : K.status) !== 404) return {
                skipStrategy: !0
            };
            return ow7(q, {
                retryDelayInMs: A.startDelayInMs,
                maxRetryDelayInMs: mc5
            })
        }
    }], {
        maxRetries: A.maxRetries
    })
}
// @from(Ln 163667, Col 4)
mc5 = 64000
// @from(Ln 163668, Col 4)
E07 = v(() => {
    Lu();
    mr()
})
// @from(Ln 163673, Col 0)
function gc5(A) {
    var q;
    if (!uS1(A)) throw Error(`${EU}: Multiple scopes are not supported.`);
    let Y = new URL(Qc5, (q = process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) !== null && q !== void 0 ? q : Fc5),
        z = {
            Accept: "application/json"
        };
    return {
        url: `${Y}`,
        method: "GET",
        headers: zU(z)
    }
}
// @from(Ln 163686, Col 4)
EU = "ManagedIdentityCredential - IMDS"
// @from(Ln 163687, Col 4)
g41
// @from(Ln 163687, Col 9)
Fc5 = "http://169.254.169.254"
// @from(Ln 163688, Col 4)
Qc5 = "/metadata/identity/oauth2/token"
// @from(Ln 163689, Col 4)
WzA
// @from(Ln 163690, Col 4)
k07 = v(() => {
    Lu();
    mr();
    t2();
    fM();
    g41 = n3(EU);
    WzA = {
        name: "imdsMsi",
        async isAvailable(A) {
            let {
                scopes: q,
                identityClient: K,
                getTokenOptions: Y
            } = A, z = uS1(q);
            if (!z) return g41.info(`${EU}: Unavailable. Multiple scopes are not supported.`), !1;
            if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) return !0;
            if (!K) throw Error("Missing IdentityClient");
            let w = gc5(z);
            return RY.withSpan("ManagedIdentityCredential-pingImdsEndpoint", Y !== null && Y !== void 0 ? Y : {}, async (H) => {
                var $, O;
                w.tracingOptions = H.tracingOptions;
                let _ = $v(w);
                _.timeout = (($ = H.requestOptions) === null || $ === void 0 ? void 0 : $.timeout) || 1000, _.allowInsecureConnection = !0;
                let J;
                try {
                    g41.info(`${EU}: Pinging the Azure IMDS endpoint`), J = await K.sendRequest(_)
                } catch (X) {
                    if (c56(X)) g41.verbose(`${EU}: Caught error ${X.name}: ${X.message}`);
                    return g41.info(`${EU}: The Azure IMDS endpoint is unavailable`), !1
                }
                if (J.status === 403) {
                    if ((O = J.bodyAsText) === null || O === void 0 ? void 0 : O.includes("unreachable")) return g41.info(`${EU}: The Azure IMDS endpoint is unavailable`), g41.info(`${EU}: ${J.bodyAsText}`), !1
                }
                return g41.info(`${EU}: The Azure IMDS endpoint is available`), !0
            })
        }
    }
})
// @from(Ln 163729, Col 0)
function cY6(A) {
    var q, K;
    let Y = A;
    if (Y === void 0 && ((K = (q = globalThis.process) === null || q === void 0 ? void 0 : q.env) === null || K === void 0 ? void 0 : K.AZURE_REGIONAL_AUTHORITY_NAME) !== void 0) Y = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
    if (Y === GzA.AutoDiscoverRegion) return "AUTO_DISCOVER";
    return Y
}
// @from(Ln 163736, Col 4)
GzA
// @from(Ln 163737, Col 4)
L07 = v(() => {
    (function(A) {
        A.AutoDiscoverRegion = "AutoDiscoverRegion", A.USWest = "westus", A.USWest2 = "westus2", A.USCentral = "centralus", A.USEast = "eastus", A.USEast2 = "eastus2", A.USNorthCentral = "northcentralus", A.USSouthCentral = "southcentralus", A.USWestCentral = "westcentralus", A.CanadaCentral = "canadacentral", A.CanadaEast = "canadaeast", A.BrazilSouth = "brazilsouth", A.EuropeNorth = "northeurope", A.EuropeWest = "westeurope", A.UKSouth = "uksouth", A.UKWest = "ukwest", A.FranceCentral = "francecentral", A.FranceSouth = "francesouth", A.SwitzerlandNorth = "switzerlandnorth", A.SwitzerlandWest = "switzerlandwest", A.GermanyNorth = "germanynorth", A.GermanyWestCentral = "germanywestcentral", A.NorwayWest = "norwaywest", A.NorwayEast = "norwayeast", A.AsiaEast = "eastasia", A.AsiaSouthEast = "southeastasia", A.JapanEast = "japaneast", A.JapanWest = "japanwest", A.AustraliaEast = "australiaeast", A.AustraliaSouthEast = "australiasoutheast", A.AustraliaCentral = "australiacentral", A.AustraliaCentral2 = "australiacentral2", A.IndiaCentral = "centralindia", A.IndiaSouth = "southindia", A.IndiaWest = "westindia", A.KoreaSouth = "koreasouth", A.KoreaCentral = "koreacentral", A.UAECentral = "uaecentral", A.UAENorth = "uaenorth", A.SouthAfricaNorth = "southafricanorth", A.SouthAfricaWest = "southafricawest", A.ChinaNorth = "chinanorth", A.ChinaEast = "chinaeast", A.ChinaNorth2 = "chinanorth2", A.ChinaEast2 = "chinaeast2", A.GermanyCentral = "germanycentral", A.GermanyNorthEast = "germanynortheast", A.GovernmentUSVirginia = "usgovvirginia", A.GovernmentUSIowa = "usgoviowa", A.GovernmentUSArizona = "usgovarizona", A.GovernmentUSTexas = "usgovtexas", A.GovernmentUSDodEast = "usdodeast", A.GovernmentUSDodCentral = "usdodcentral"
    })(GzA || (GzA = {}))
})
// @from(Ln 163744, Col 0)
function Uc5() {
    try {
        return R07.statSync("/.dockerenv"), !0
    } catch {
        return !1
    }
}
// @from(Ln 163752, Col 0)
function pc5() {
    try {
        return R07.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
    } catch {
        return !1
    }
}
// @from(Ln 163760, Col 0)
function fzA() {
    if (ZzA === void 0) ZzA = Uc5() || pc5();
    return ZzA
}
// @from(Ln 163764, Col 4)
ZzA
// @from(Ln 163765, Col 4)
y07 = () => {}
// @from(Ln 163768, Col 0)
function TX1() {
    if (VzA === void 0) VzA = cc5() || fzA();
    return VzA
}
// @from(Ln 163772, Col 4)
VzA
// @from(Ln 163772, Col 9)
cc5 = () => {
    try {
        return dc5.statSync("/run/.containerenv"), !0
    } catch {
        return !1
    }
}
// @from(Ln 163779, Col 4)
NzA = v(() => {
    y07()
})
// @from(Ln 163785, Col 4)
C07 = () => {
        if (S07.platform !== "linux") return !1;
        if (lc5.release().toLowerCase().includes("microsoft")) {
            if (TX1()) return !1;
            return !0
        }
        try {
            return ic5.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !TX1() : !1
        } catch {
            return !1
        }
    }
// @from(Ln 163797, Col 4)
$o
// @from(Ln 163798, Col 4)
TzA = v(() => {
    NzA();
    $o = S07.env.__IS_WSL_TEST__ ? C07 : C07()
})
// @from(Ln 163806, Col 4)
rc5
// @from(Ln 163806, Col 9)
oc5 = async () => {
    return `${await rc5()}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
}
// @from(Ln 163808, Col 3)
vzA = async () => {
    if ($o) return oc5();
    return `${h07.env.SYSTEMROOT||h07.env.windir||String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}
// @from(Ln 163812, Col 4)
x07 = v(() => {
    TzA();
    TzA();
    rc5 = (() => {
        let q;
        return async function() {
            if (q) return q;
            let K = "/etc/wsl.conf",
                Y = !1;
            try {
                await I07.access(K, nc5.F_OK), Y = !0
            } catch {}
            if (!Y) return "/mnt/";
            let z = await I07.readFile(K, {
                    encoding: "utf8"
                }),
                w = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(z);
            if (!w) return "/mnt/";
            return q = w.groups.mountPoint.trim(), q = q.endsWith("/") ? q : `${q}/`, q
        }
    })()
})
// @from(Ln 163835, Col 0)
function Oo(A, q, K) {
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
// @from(Ln 163860, Col 0)
async function EzA() {
    if (sc5.platform !== "darwin") throw Error("macOS only");
    let {
        stdout: A
    } = await ec5("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
    return /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(A)?.groups.id ?? "com.apple.Safari"
}
// @from(Ln 163867, Col 4)
ec5
// @from(Ln 163868, Col 4)
b07 = v(() => {
    ec5 = ac5(tc5)
})
// @from(Ln 163879, Col 0)
async function u07(A, {
    humanReadableOutput: q = !0,
    signal: K
} = {}) {
    if (Al5.platform !== "darwin") throw Error("macOS only");
    let Y = q ? [] : ["-ss"],
        z = {};
    if (K) z.signal = K;
    let {
        stdout: w
    } = await Yl5("osascript", ["-e", A, Y], z);
    return w.trim()
}
// @from(Ln 163892, Col 4)
Yl5
// @from(Ln 163893, Col 4)
B07 = v(() => {
    Yl5 = ql5(Kl5)
})
// @from(Ln 163896, Col 0)
async function kzA(A) {
    return u07(`tell application "Finder" to set app_path to application file id "${A}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)
}
// @from(Ln 163900, Col 4)
m07 = v(() => {
    B07()
})
// @from(Ln 163909, Col 0)
async function RzA(A = Hl5) {
    let {
        stdout: q
    } = await A("reg", ["QUERY", " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice", "/v", "ProgId"]), K = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(q);
    if (!K) throw new LzA(`Cannot find Windows browser in stdout: ${JSON.stringify(q)}`);
    let {
        id: Y
    } = K.groups, z = $l5[Y];
    if (!z) throw new LzA(`Unknown browser ID: ${Y}`);
    return z
}
// @from(Ln 163920, Col 4)
Hl5
// @from(Ln 163920, Col 9)
$l5
// @from(Ln 163920, Col 14)
LzA
// @from(Ln 163921, Col 4)
F07 = v(() => {
    Hl5 = zl5(wl5), $l5 = {
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
    LzA = class LzA extends Error {}
})
// @from(Ln 163969, Col 0)
async function CzA() {
    if (yzA.platform === "darwin") {
        let A = await EzA();
        return {
            name: await kzA(A),
            id: A
        }
    }
    if (yzA.platform === "linux") {
        let {
            stdout: A
        } = await Jl5("xdg-mime", ["query", "default", "x-scheme-handler/http"]), q = A.trim();
        return {
            name: Xl5(q.replace(/.desktop$/, "").replace("-", " ")),
            id: q
        }
    }
    if (yzA.platform === "win32") return RzA();
    throw Error("Only macOS, Linux, and Windows are supported")
}
// @from(Ln 163989, Col 4)
Jl5
// @from(Ln 163989, Col 9)
Xl5 = (A) => A.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (q) => q.toUpperCase())
// @from(Ln 163990, Col 4)
Q07 = v(() => {
    b07();
    m07();
    F07();
    Jl5 = Ol5(_l5)
})
// @from(Ln 163996, Col 4)
n07 = {}
// @from(Ln 164017, Col 0)
async function Gl5() {
    let A = await vzA(),
        q = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`,
        K = c07.from(q, "utf16le").toString("base64"),
        {
            stdout: Y
        } = await Wl5(A, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", K], {
            encoding: "utf8"
        }),
        z = Y.trim(),
        w = {
            ChromeHTML: "com.google.chrome",
            BraveHTML: "com.brave.Browser",
            MSEdgeHTM: "com.microsoft.edge",
            FirefoxURL: "org.mozilla.firefox"
        };
    return w[z] ? {
        id: w[z]
    } : {}
}
// @from(Ln 164038, Col 0)
function d07(A) {
    if (typeof A === "string" || Array.isArray(A)) return A;
    let {
        [U07]: q
    } = A;
    if (!q) throw Error(`${U07} is not supported`);
    return q
}
// @from(Ln 164047, Col 0)
function lY6({
    [vX1]: A
}, {
    wsl: q
}) {
    if (q && $o) return d07(q);
    if (!A) throw Error(`${vX1} is not supported`);
    return d07(A)
}
// @from(Ln 164056, Col 4)
Wl5
// @from(Ln 164056, Col 9)
hzA
// @from(Ln 164056, Col 14)
g07
// @from(Ln 164056, Col 19)
vX1
// @from(Ln 164056, Col 24)
U07
// @from(Ln 164056, Col 29)
p07 = async (A, q) => {
    let K;
    for (let Y of A) try {
        return await q(Y)
    } catch (z) {
        K = z
    }
    throw K
}
// @from(Ln 164064, Col 3)
fI1 = async (A) => {
    if (A = {
            wait: !1,
            background: !1,
            newInstance: !1,
            allowNonzeroExitCode: !1,
            ...A
        }, Array.isArray(A.app)) return p07(A.app, ($) => fI1({
        ...A,
        app: $
    }));
    let {
        name: q,
        arguments: K = []
    } = A.app ?? {};
    if (K = [...K], Array.isArray(q)) return p07(q, ($) => fI1({
        ...A,
        app: {
            name: $,
            arguments: K
        }
    }));
    if (q === "browser" || q === "browserPrivate") {
        let $ = {
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
            O = {
                chrome: "--incognito",
                brave: "--incognito",
                firefox: "--private-window",
                edge: "--inPrivate"
            },
            _ = $o ? await Gl5() : await CzA();
        if (_.id in $) {
            let J = $[_.id];
            if (q === "browserPrivate") K.push(O[J]);
            return fI1({
                ...A,
                app: {
                    name: _o[J],
                    arguments: K
                }
            })
        }
        throw Error(`${_.name} is not supported as a default browser`)
    }
    let Y, z = [],
        w = {};
    if (vX1 === "darwin") {
        if (Y = "open", A.wait) z.push("--wait-apps");
        if (A.background) z.push("--background");
        if (A.newInstance) z.push("--new");
        if (q) z.push("-a", q)
    } else if (vX1 === "win32" || $o && !TX1() && !q) {
        if (Y = await vzA(), z.push("-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand"), !$o) w.windowsVerbatimArguments = !0;
        let $ = ["Start"];
        if (A.wait) $.push("-Wait");
        if (q) {
            if ($.push(`"\`"${q}\`""`), A.target) K.push(A.target)
        } else if (A.target) $.push(`"${A.target}"`);
        if (K.length > 0) K = K.map((O) => `"\`"${O}\`""`), $.push("-ArgumentList", K.join(","));
        A.target = c07.from($.join(" "), "utf16le").toString("base64")
    } else {
        if (q) Y = q;
        else {
            let $ = !hzA || hzA === "/",
                O = !1;
            try {
                await Ml5.access(g07, Pl5.X_OK), O = !0
            } catch {}
            Y = SzA.versions.electron ?? (vX1 === "android" || $ || !O) ? "xdg-open" : g07
        }
        if (K.length > 0) z.push(...K);
        if (!A.wait) w.stdio = "ignore", w.detached = !0
    }
    if (vX1 === "darwin" && K.length > 0) z.push("--args", ...K);
    if (A.target) z.push(A.target);
    let H = i07.spawn(Y, z, w);
    if (A.wait) return new Promise(($, O) => {
        H.once("error", O), H.once("close", (_) => {
            if (!A.allowNonzeroExitCode && _ > 0) {
                O(Error(`Exited with code ${_}`));
                return
            }
            $(H)
        })
    });
    return H.unref(), H
}
// @from(Ln 164160, Col 3)
Zl5 = (A, q) => {
    if (typeof A !== "string") throw TypeError("Expected a `target`");
    return fI1({
        ...q,
        target: A
    })
}
// @from(Ln 164166, Col 3)
fl5 = (A, q) => {
    if (typeof A !== "string" && !Array.isArray(A)) throw TypeError("Expected a valid `name`");
    let {
        arguments: K = []
    } = q ?? {};
    if (K !== void 0 && K !== null && !Array.isArray(K)) throw TypeError("Expected `appArguments` as Array type");
    return fI1({
        ...q,
        app: {
            name: A,
            arguments: K
        }
    })
}
// @from(Ln 164179, Col 3)
_o
// @from(Ln 164179, Col 7)
Vl5
// @from(Ln 164180, Col 4)
r07 = v(() => {
    x07();
    Q07();
    NzA();
    Wl5 = jl5(i07.execFile), hzA = l07.dirname(Dl5(import.meta.url)), g07 = l07.join(hzA, "xdg-open"), {
        platform: vX1,
        arch: U07
    } = SzA;
    _o = {};
    Oo(_o, "chrome", () => lY6({
        darwin: "google chrome",
        win32: "chrome",
        linux: ["google-chrome", "google-chrome-stable", "chromium"]
    }, {
        wsl: {
            ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
        }
    }));
    Oo(_o, "brave", () => lY6({
        darwin: "brave browser",
        win32: "brave",
        linux: ["brave-browser", "brave"]
    }, {
        wsl: {
            ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
            x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
        }
    }));
    Oo(_o, "firefox", () => lY6({
        darwin: "firefox",
        win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
        linux: "firefox"
    }, {
        wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
    }));
    Oo(_o, "edge", () => lY6({
        darwin: "microsoft edge",
        win32: "msedge",
        linux: ["microsoft-edge", "microsoft-edge-dev"]
    }, {
        wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
    }));
    Oo(_o, "browser", () => "browser");
    Oo(_o, "browserPrivate", () => "browserPrivate");
    Vl5 = Zl5
})
// @from(Ln 164228, Col 0)
function Nl5(A, q, K = {}) {
    var Y, z, w;
    let H = BJ1((Y = K.logger) !== null && Y !== void 0 ? Y : xV, q, A),
        $ = PzA(H, MzA(K)),
        O = new yu(Object.assign(Object.assign({}, K.tokenCredentialOptions), {
            authorityHost: $,
            loggingOptions: K.loggingOptions
        }));
    return {
        auth: {
            clientId: A,
            authority: $,
            knownAuthorities: Z07(H, $, K.disableInstanceDiscovery)
        },
        system: {
            networkClient: O,
            loggerOptions: {
                loggerCallback: UY6((z = K.logger) !== null && z !== void 0 ? z : xV),
                logLevel: pY6(R56()),
                piiLoggingEnabled: (w = K.loggingOptions) === null || w === void 0 ? void 0 : w.enableUnsafeSupportLogging
            }
        }
    }
}
// @from(Ln 164253, Col 0)
function TW(A, q, K = {}) {
    var Y;
    let z = {
            msalConfig: Nl5(A, q, K),
            cachedAccount: K.authenticationRecord ? f07(K.authenticationRecord) : null,
            pluginConfiguration: G27.generatePluginConfiguration(K),
            logger: (Y = K.logger) !== null && Y !== void 0 ? Y : xV
        },
        w = new Map;
    async function H(T = {}) {
        let k = T.enableCae ? "CAE" : "default",
            y = w.get(k);
        if (y) return z.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), y;
        z.logger.getToken.info(`Creating new PublicClientApplication with CAE ${T.enableCae?"enabled":"disabled"}.`);
        let B = T.enableCae ? z.pluginConfiguration.cache.cachePluginCae : z.pluginConfiguration.cache.cachePlugin;
        return z.msalConfig.auth.clientCapabilities = T.enableCae ? ["cp1"] : void 0, y = new MI1(Object.assign(Object.assign({}, z.msalConfig), {
            broker: {
                nativeBrokerPlugin: z.pluginConfiguration.broker.nativeBrokerPlugin
            },
            cache: {
                cachePlugin: await B
            }
        })), w.set(k, y), y
    }
    let $ = new Map;
    async function O(T = {}) {
        let k = T.enableCae ? "CAE" : "default",
            y = $.get(k);
        if (y) return z.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), y;
        z.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${T.enableCae?"enabled":"disabled"}.`);
        let B = T.enableCae ? z.pluginConfiguration.cache.cachePluginCae : z.pluginConfiguration.cache.cachePlugin;
        return z.msalConfig.auth.clientCapabilities = T.enableCae ? ["cp1"] : void 0, y = new WI1(Object.assign(Object.assign({}, z.msalConfig), {
            broker: {
                nativeBrokerPlugin: z.pluginConfiguration.broker.nativeBrokerPlugin
            },
            cache: {
                cachePlugin: await B
            }
        })), $.set(k, y), y
    }
    async function _(T, k, y = {}) {
        if (z.cachedAccount === null) throw z.logger.getToken.info("No cached account found in local state."), new fS({
            scopes: k
        });
        if (y.claims) z.cachedClaims = y.claims;
        let B = {
            account: z.cachedAccount,
            scopes: k,
            claims: z.cachedClaims
        };
        if (z.pluginConfiguration.broker.isEnabled) {
            if (B.tokenQueryParameters || (B.tokenQueryParameters = {}), z.pluginConfiguration.broker.enableMsaPassthrough) B.tokenQueryParameters.msal_request_type = "consumer_passthrough"
        }
        if (y.proofOfPossessionOptions) B.shrNonce = y.proofOfPossessionOptions.nonce, B.authenticationScheme = "pop", B.resourceRequestMethod = y.proofOfPossessionOptions.resourceRequestMethod, B.resourceRequestUri = y.proofOfPossessionOptions.resourceRequestUrl;
        z.logger.getToken.info("Attempting to acquire token silently");
        try {
            return await T.acquireTokenSilent(B)
        } catch (S) {
            throw Q41(k, S, y)
        }
    }

    function J(T) {
        if (T === null || T === void 0 ? void 0 : T.tenantId) return PzA(T.tenantId, MzA(K));
        return z.msalConfig.auth.authority
    }
    async function X(T, k, y, B) {
        var S, m;
        let b = null;
        try {
            b = await _(T, k, y)
        } catch (g) {
            if (g.name !== "AuthenticationRequiredError") throw g;
            if (y.disableAutomaticAuthentication) throw new fS({
                scopes: k,
                getTokenOptions: y,
                message: "Automatic authentication has been disabled. You may call the authentication() method."
            })
        }
        if (b === null) try {
            b = await B()
        } catch (g) {
            throw Q41(k, g, y)
        }
        return NX1(k, b, y), z.cachedAccount = (S = b === null || b === void 0 ? void 0 : b.account) !== null && S !== void 0 ? S : null, z.logger.getToken.info(VX(k)), {
            token: b.accessToken,
            expiresOnTimestamp: b.expiresOn.getTime(),
            refreshAfterTimestamp: (m = b.refreshOn) === null || m === void 0 ? void 0 : m.getTime(),
            tokenType: b.tokenType
        }
    }
    async function D(T, k, y = {}) {
        var B;
        z.logger.getToken.info("Attempting to acquire token using client secret"), z.msalConfig.auth.clientSecret = k;
        let S = await O(y);
        try {
            let m = await S.acquireTokenByClientCredential({
                scopes: T,
                authority: J(y),
                azureRegion: cY6(),
                claims: y === null || y === void 0 ? void 0 : y.claims
            });
            return NX1(T, m, y), z.logger.getToken.info(VX(T)), {
                token: m.accessToken,
                expiresOnTimestamp: m.expiresOn.getTime(),
                refreshAfterTimestamp: (B = m.refreshOn) === null || B === void 0 ? void 0 : B.getTime(),
                tokenType: m.tokenType
            }
        } catch (m) {
            throw Q41(T, m, y)
        }
    }
    async function j(T, k, y = {}) {
        var B;
        z.logger.getToken.info("Attempting to acquire token using client assertion"), z.msalConfig.auth.clientAssertion = k;
        let S = await O(y);
        try {
            let m = await S.acquireTokenByClientCredential({
                scopes: T,
                authority: J(y),
                azureRegion: cY6(),
                claims: y === null || y === void 0 ? void 0 : y.claims,
                clientAssertion: k
            });
            return NX1(T, m, y), z.logger.getToken.info(VX(T)), {
                token: m.accessToken,
                expiresOnTimestamp: m.expiresOn.getTime(),
                refreshAfterTimestamp: (B = m.refreshOn) === null || B === void 0 ? void 0 : B.getTime(),
                tokenType: m.tokenType
            }
        } catch (m) {
            throw Q41(T, m, y)
        }
    }
    async function M(T, k, y = {}) {
        var B;
        z.logger.getToken.info("Attempting to acquire token using client certificate"), z.msalConfig.auth.clientCertificate = k;
        let S = await O(y);
        try {
            let m = await S.acquireTokenByClientCredential({
                scopes: T,
                authority: J(y),
                azureRegion: cY6(),
                claims: y === null || y === void 0 ? void 0 : y.claims
            });
            return NX1(T, m, y), z.logger.getToken.info(VX(T)), {
                token: m.accessToken,
                expiresOnTimestamp: m.expiresOn.getTime(),
                refreshAfterTimestamp: (B = m.refreshOn) === null || B === void 0 ? void 0 : B.getTime(),
                tokenType: m.tokenType
            }
        } catch (m) {
            throw Q41(T, m, y)
        }
    }
    async function P(T, k, y = {}) {
        z.logger.getToken.info("Attempting to acquire token using device code");
        let B = await H(y);
        return X(B, T, y, () => {
            var S, m;
            let b = {
                    scopes: T,
                    cancel: (m = (S = y === null || y === void 0 ? void 0 : y.abortSignal) === null || S === void 0 ? void 0 : S.aborted) !== null && m !== void 0 ? m : !1,
                    deviceCodeCallback: k,
                    authority: J(y),
                    claims: y === null || y === void 0 ? void 0 : y.claims
                },
                g = B.acquireTokenByDeviceCode(b);
            if (y.abortSignal) y.abortSignal.addEventListener("abort", () => {
                b.cancel = !0
            });
            return g
        })
    }
    async function W(T, k, y, B = {}) {
        z.logger.getToken.info("Attempting to acquire token using username and password");
        let S = await H(B);
        return X(S, T, B, () => {
            let m = {
                scopes: T,
                username: k,
                password: y,
                authority: J(B),
                claims: B === null || B === void 0 ? void 0 : B.claims
            };
            return S.acquireTokenByUsernamePassword(m)
        })
    }

    function G() {
        if (!z.cachedAccount) return;
        return V07(A, z.cachedAccount)
    }
    async function f(T, k, y, B, S = {}) {
        z.logger.getToken.info("Attempting to acquire token using authorization code");
        let m;
        if (B) z.msalConfig.auth.clientSecret = B, m = await O(S);
        else m = await H(S);
        return X(m, T, S, () => {
            return m.acquireTokenByCode({
                scopes: T,
                redirectUri: k,
                code: y,
                authority: J(S),
                claims: S === null || S === void 0 ? void 0 : S.claims
            })
        })
    }
    async function Z(T, k, y, B = {}) {
        var S;
        if (xV.getToken.info("Attempting to acquire token on behalf of another user"), typeof y === "string") xV.getToken.info("Using client secret for on behalf of flow"), z.msalConfig.auth.clientSecret = y;
        else if (typeof y === "function") xV.getToken.info("Using client assertion callback for on behalf of flow"), z.msalConfig.auth.clientAssertion = y;
        else xV.getToken.info("Using client certificate for on behalf of flow"), z.msalConfig.auth.clientCertificate = y;
        let m = await O(B);
        try {
            let b = await m.acquireTokenOnBehalfOf({
                scopes: T,
                authority: J(B),
                claims: B.claims,
                oboAssertion: k
            });
            return NX1(T, b, B), xV.getToken.info(VX(T)), {
                token: b.accessToken,
                expiresOnTimestamp: b.expiresOn.getTime(),
                refreshAfterTimestamp: (S = b.refreshOn) === null || S === void 0 ? void 0 : S.getTime(),
                tokenType: b.tokenType
            }
        } catch (b) {
            throw Q41(T, b, B)
        }
    }
    async function N(T, k = {}) {
        xV.getToken.info("Attempting to acquire token interactively");
        let y = await H(k);
        async function B(m) {
            var b;
            xV.verbose("Authentication will resume through the broker");
            let g = S();
            if (z.pluginConfiguration.broker.parentWindowHandle) g.windowHandle = Buffer.from(z.pluginConfiguration.broker.parentWindowHandle);
            else xV.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
            if (z.pluginConfiguration.broker.enableMsaPassthrough)((b = g.tokenQueryParameters) !== null && b !== void 0 ? b : g.tokenQueryParameters = {}).msal_request_type = "consumer_passthrough";
            if (m) g.prompt = "none", xV.verbose("Attempting broker authentication using the default broker account");
            else xV.verbose("Attempting broker authentication without the default broker account");
            if (k.proofOfPossessionOptions) g.shrNonce = k.proofOfPossessionOptions.nonce, g.authenticationScheme = "pop", g.resourceRequestMethod = k.proofOfPossessionOptions.resourceRequestMethod, g.resourceRequestUri = k.proofOfPossessionOptions.resourceRequestUrl;
            try {
                return await y.acquireTokenInteractive(g)
            } catch (U) {
                if (xV.verbose(`Failed to authenticate through the broker: ${U.message}`), m) return B(!1);
                else throw U
            }
        }

        function S() {
            var m, b;
            return {
                openBrowser: async (g) => {
                    await (await Promise.resolve().then(() => (r07(), n07))).default(g, {
                        wait: !0,
                        newInstance: !0
                    })
                },
                scopes: T,
                authority: J(k),
                claims: k === null || k === void 0 ? void 0 : k.claims,
                loginHint: k === null || k === void 0 ? void 0 : k.loginHint,
                errorTemplate: (m = k === null || k === void 0 ? void 0 : k.browserCustomizationOptions) === null || m === void 0 ? void 0 : m.errorMessage,
                successTemplate: (b = k === null || k === void 0 ? void 0 : k.browserCustomizationOptions) === null || b === void 0 ? void 0 : b.successMessage,
                prompt: (k === null || k === void 0 ? void 0 : k.loginHint) ? "login" : "select_account"
            }
        }
        return X(y, T, k, async () => {
            var m;
            let b = S();
            if (z.pluginConfiguration.broker.isEnabled) return B((m = z.pluginConfiguration.broker.useDefaultBrokerAccount) !== null && m !== void 0 ? m : !1);
            if (k.proofOfPossessionOptions) b.shrNonce = k.proofOfPossessionOptions.nonce, b.authenticationScheme = "pop", b.resourceRequestMethod = k.proofOfPossessionOptions.resourceRequestMethod, b.resourceRequestUri = k.proofOfPossessionOptions.resourceRequestUrl;
            return y.acquireTokenInteractive(b)
        })
    }
    return {
        getActiveAccount: G,
        getTokenByClientSecret: D,
        getTokenByClientAssertion: j,
        getTokenByClientCertificate: M,
        getTokenByDeviceCode: P,
        getTokenByUsernamePassword: W,
        getTokenByAuthorizationCode: f,
        getTokenOnBehalfOf: Z,
        getTokenByInteractiveRequest: N
    }
}
// @from(Ln 164543, Col 4)
xV
// @from(Ln 164544, Col 4)
kU = v(() => {
    gY6();
    t2();
    v3A();
    dY6();
    bD();
    mS1();
    L07();
    I71();
    uD();
    xV = n3("MsalClient")
})
// @from(Ln 164556, Col 0)
class U41 {
    constructor(A, q, K, Y = {}) {
        if (!A) throw new f4("ClientAssertionCredential: tenantId is a required parameter.");
        if (!q) throw new f4("ClientAssertionCredential: clientId is a required parameter.");
        if (!K) throw new f4("ClientAssertionCredential: clientAssertion is a required parameter.");
        this.tenantId = A, this.additionallyAllowedTenantIds = m$(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.options = Y, this.getAssertion = K, this.msalClient = TW(q, A, Object.assign(Object.assign({}, Y), {
            logger: o07,
            tokenCredentialOptions: this.options
        }))
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, o07);
            let Y = Array.isArray(A) ? A : [A];
            return this.msalClient.getTokenByClientAssertion(Y, this.getAssertion, K)
        })
    }
}
// @from(Ln 164574, Col 4)
o07
// @from(Ln 164575, Col 4)
iY6 = v(() => {
    kU();
    uD();
    bD();
    t2();
    fM();
    o07 = n3("ClientAssertionCredential")
})