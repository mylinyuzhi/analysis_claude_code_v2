
// @from(Ln 232842, Col 4)
UpB = w(() => {
  gPA();
  vWA();
  s2A();
  lY();
  xWA();
  _31();
  cPA();
  So();
  aW();
  xo();
  r31();
  vo();
  jWA();
  wPA();
  Po();
  QS();
  lm();
  s31();
  m31();
  mD();
  um(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  t31 = class t31 extends kz {
    constructor(A, Q) {
      super(A, Q);
      this.includeRedirectUri = !0, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes
    }
    async acquireToken(A, Q) {
      if (this.performanceClient?.addQueueMeasurement(N0.AuthClientAcquireToken, A.correlationId), !A.code) throw YQ(v2A);
      let B = eL(),
        G = await y5(this.executeTokenRequest.bind(this), N0.AuthClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(this.authority, A),
        Z = G.headers?.[pY.X_MS_REQUEST_ID],
        Y = new oI(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin, this.performanceClient);
      return Y.validateTokenResponse(G.body), y5(Y.handleServerTokenResponse.bind(Y), N0.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(G.body, this.authority, B, A, Q, void 0, void 0, void 0, Z)
    }
    getLogoutUri(A) {
      if (!A) throw yZ(n2A);
      let Q = this.createLogoutUrlQueryString(A);
      return U3.appendQueryString(this.authority.endSessionEndpoint, Q)
    }
    async executeTokenRequest(A, Q) {
      this.performanceClient?.addQueueMeasurement(N0.AuthClientExecuteTokenRequest, Q.correlationId);
      let B = this.createTokenQueryParameters(Q),
        G = U3.appendQueryString(A.tokenEndpoint, B),
        Z = await y5(this.createTokenRequestBody.bind(this), N0.AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, Q.correlationId)(Q),
        Y = void 0;
      if (Q.clientInfo) try {
        let I = _WA(Q.clientInfo, this.cryptoUtils.base64Decode);
        Y = {
          credential: `${I.uid}${ym.CLIENT_INFO_SEPARATOR}${I.utid}`,
          type: PC.HOME_ACCOUNT_ID
        }
      } catch (I) {
        this.logger.verbose("Could not parse client info for CCS Header: " + I)
      }
      let J = this.createTokenRequestHeaders(Y || Q.ccsCredential),
        X = hWA(this.config.authOptions.clientId, Q);
      return y5(this.executePostToTokenEndpoint.bind(this), N0.AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, Q.correlationId)(G, Z, J, X, Q.correlationId, N0.AuthorizationCodeClientExecutePostToTokenEndpoint)
    }
    async createTokenRequestBody(A) {
      this.performanceClient?.addQueueMeasurement(N0.AuthClientCreateTokenRequestBody, A.correlationId);
      let Q = new Map;
      if (B9A(Q, A.embeddedClientId || A.tokenBodyParameters?.[ek] || this.config.authOptions.clientId), !this.includeRedirectUri) {
        if (!A.redirectUri) throw yZ(d2A)
      } else G9A(Q, A.redirectUri);
      if (Q9A(Q, A.scopes, !0, this.oidcDefaultScopes), k50(Q, A.code), OPA(Q, this.config.libraryInfo), MPA(Q, this.config.telemetry.application), kPA(Q), this.serverTelemetryManager && !R31(this.config)) vPA(Q, this.serverTelemetryManager);
      if (A.codeVerifier) f50(Q, A.codeVerifier);
      if (this.config.clientCredentials.clientSecret) _PA(Q, this.config.clientCredentials.clientSecret);
      if (this.config.clientCredentials.clientAssertion) {
        let G = this.config.clientCredentials.clientAssertion;
        jPA(Q, await yC(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), TPA(Q, G.assertionType)
      }
      if (PPA(Q, VN.AUTHORIZATION_CODE_GRANT), J9A(Q), A.authenticationScheme === J5.POP) {
        let G = new X9A(this.cryptoUtils, this.performanceClient),
          Z;
        if (!A.popKid) Z = (await y5(G.generateCnf.bind(G), N0.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
        else Z = this.cryptoUtils.encodeKid(A.popKid);
        xPA(Q, Z)
      } else if (A.authenticationScheme === J5.SSH)
        if (A.sshJwk) yPA(Q, A.sshJwk);
        else throw yZ(gm);
      if (!JY.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) Z9A(Q, A.claims, this.config.authOptions.clientCapabilities);
      let B = void 0;
      if (A.clientInfo) try {
        let G = _WA(A.clientInfo, this.cryptoUtils.base64Decode);
        B = {
          credential: `${G.uid}${ym.CLIENT_INFO_SEPARATOR}${G.utid}`,
          type: PC.HOME_ACCOUNT_ID
        }
      } catch (G) {
        this.logger.verbose("Could not parse client info for CCS Header: " + G)
      } else B = A.ccsCredential;
      if (this.config.systemOptions.preventCorsPreflight && B) switch (B.type) {
        case PC.HOME_ACCOUNT_ID:
          try {
            let G = sk(B.credential);
            dm(Q, G)
          } catch (G) {
            this.logger.verbose("Could not parse home account ID for CCS Header: " + G)
          }
          break;
        case PC.UPN:
          yo(Q, B.credential);
          break
      }
      if (A.embeddedClientId) pm(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
      if (A.tokenBodyParameters) cm(Q, A.tokenBodyParameters);
      if (A.enableSpaAuthorizationCode && (!A.tokenBodyParameters || !A.tokenBodyParameters[S31])) cm(Q, {
        [S31]: "1"
      });
      return A9A(Q, A.correlationId, this.performanceClient), tk(Q)
    }
    createLogoutUrlQueryString(A) {
      let Q = new Map;
      if (A.postLogoutRedirectUri) P50(Q, A.postLogoutRedirectUri);
      if (A.correlationId) Y9A(Q, A.correlationId);
      if (A.idTokenHint) S50(Q, A.idTokenHint);
      if (A.state) RPA(Q, A.state);
      if (A.logoutHint) h50(Q, A.logoutHint);
      if (A.extraQueryParameters) cm(Q, A.extraQueryParameters);
      if (this.config.authOptions.instanceAware) SPA(Q);
      return tk(Q, this.config.authOptions.encodeExtraQueryParams, A.extraQueryParameters)
    }
  }
})
// @from(Ln 232967, Col 4)
Yh8 = 300
// @from(Ln 232968, Col 2)
gWA
// @from(Ln 232969, Col 4)
qpB = w(() => {
  _31();
  gPA();
  vWA();
  s2A();
  lY();
  xWA();
  cPA();
  r31();
  So();
  Po();
  aW();
  fWA();
  vo();
  xo();
  wPA();
  jWA();
  dPA();
  QS();
  lm();
  s31();
  m31();
  l31();
  um();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  gWA = class gWA extends kz {
    constructor(A, Q) {
      super(A, Q)
    }
    async acquireToken(A) {
      this.performanceClient?.addQueueMeasurement(N0.RefreshTokenClientAcquireToken, A.correlationId);
      let Q = eL(),
        B = await y5(this.executeTokenRequest.bind(this), N0.RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(A, this.authority),
        G = B.headers?.[pY.X_MS_REQUEST_ID],
        Z = new oI(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Z.validateTokenResponse(B.body), y5(Z.handleServerTokenResponse.bind(Z), N0.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(B.body, this.authority, Q, A, void 0, void 0, !0, A.forceCache, G)
    }
    async acquireTokenByRefreshToken(A) {
      if (!A) throw yZ(i2A);
      if (this.performanceClient?.addQueueMeasurement(N0.RefreshTokenClientAcquireTokenByRefreshToken, A.correlationId), !A.account) throw YQ(km);
      if (this.cacheManager.isAppMetadataFOCI(A.account.environment)) try {
        return await y5(this.acquireTokenWithCachedRefreshToken.bind(this), N0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !0)
      } catch (B) {
        let G = B instanceof AO && B.errorCode === ko,
          Z = B instanceof xC && B.errorCode === mTA.INVALID_GRANT_ERROR && B.subError === mTA.CLIENT_MISMATCH_ERROR;
        if (G || Z) return y5(this.acquireTokenWithCachedRefreshToken.bind(this), N0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1);
        else throw B
      }
      return y5(this.acquireTokenWithCachedRefreshToken.bind(this), N0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1)
    }
    async acquireTokenWithCachedRefreshToken(A, Q) {
      this.performanceClient?.addQueueMeasurement(N0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, A.correlationId);
      let B = KpB(this.cacheManager.getRefreshToken.bind(this.cacheManager), N0.CacheManagerGetRefreshToken, this.logger, this.performanceClient, A.correlationId)(A.account, Q, A.correlationId, void 0, this.performanceClient);
      if (!B) throw a31(ko);
      if (B.expiresOn && kWA(B.expiresOn, A.refreshTokenExpirationOffsetSeconds || Yh8)) throw this.performanceClient?.addFields({
        rtExpiresOnMs: Number(B.expiresOn)
      }, A.correlationId), a31(mPA);
      let G = {
        ...A,
        refreshToken: B.secret,
        authenticationScheme: A.authenticationScheme || J5.BEARER,
        ccsCredential: {
          credential: A.account.homeAccountId,
          type: PC.HOME_ACCOUNT_ID
        }
      };
      try {
        return await y5(this.acquireToken.bind(this), N0.RefreshTokenClientAcquireToken, this.logger, this.performanceClient, A.correlationId)(G)
      } catch (Z) {
        if (Z instanceof AO) {
          if (this.performanceClient?.addFields({
              rtExpiresOnMs: Number(B.expiresOn)
            }, A.correlationId), Z.subError === bo) {
            this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");
            let Y = this.cacheManager.generateCredentialKey(B);
            this.cacheManager.removeRefreshToken(Y, A.correlationId)
          }
        }
        throw Z
      }
    }
    async executeTokenRequest(A, Q) {
      this.performanceClient?.addQueueMeasurement(N0.RefreshTokenClientExecuteTokenRequest, A.correlationId);
      let B = this.createTokenQueryParameters(A),
        G = U3.appendQueryString(Q.tokenEndpoint, B),
        Z = await y5(this.createTokenRequestBody.bind(this), N0.RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, A.correlationId)(A),
        Y = this.createTokenRequestHeaders(A.ccsCredential),
        J = hWA(this.config.authOptions.clientId, A);
      return y5(this.executePostToTokenEndpoint.bind(this), N0.RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, A.correlationId)(G, Z, Y, J, A.correlationId, N0.RefreshTokenClientExecutePostToTokenEndpoint)
    }
    async createTokenRequestBody(A) {
      this.performanceClient?.addQueueMeasurement(N0.RefreshTokenClientCreateTokenRequestBody, A.correlationId);
      let Q = new Map;
      if (B9A(Q, A.embeddedClientId || A.tokenBodyParameters?.[ek] || this.config.authOptions.clientId), A.redirectUri) G9A(Q, A.redirectUri);
      if (Q9A(Q, A.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), PPA(Q, VN.REFRESH_TOKEN_GRANT), J9A(Q), OPA(Q, this.config.libraryInfo), MPA(Q, this.config.telemetry.application), kPA(Q), this.serverTelemetryManager && !R31(this.config)) vPA(Q, this.serverTelemetryManager);
      if (b50(Q, A.refreshToken), this.config.clientCredentials.clientSecret) _PA(Q, this.config.clientCredentials.clientSecret);
      if (this.config.clientCredentials.clientAssertion) {
        let B = this.config.clientCredentials.clientAssertion;
        jPA(Q, await yC(B.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), TPA(Q, B.assertionType)
      }
      if (A.authenticationScheme === J5.POP) {
        let B = new X9A(this.cryptoUtils, this.performanceClient),
          G;
        if (!A.popKid) G = (await y5(B.generateCnf.bind(B), N0.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
        else G = this.cryptoUtils.encodeKid(A.popKid);
        xPA(Q, G)
      } else if (A.authenticationScheme === J5.SSH)
        if (A.sshJwk) yPA(Q, A.sshJwk);
        else throw yZ(gm);
      if (!JY.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) Z9A(Q, A.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && A.ccsCredential) switch (A.ccsCredential.type) {
        case PC.HOME_ACCOUNT_ID:
          try {
            let B = sk(A.ccsCredential.credential);
            dm(Q, B)
          } catch (B) {
            this.logger.verbose("Could not parse home account ID for CCS Header: " + B)
          }
          break;
        case PC.UPN:
          yo(Q, A.ccsCredential.credential);
          break
      }
      if (A.embeddedClientId) pm(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
      if (A.tokenBodyParameters) cm(Q, A.tokenBodyParameters);
      return A9A(Q, A.correlationId, this.performanceClient), tk(Q)
    }
  }
})
// @from(Ln 233098, Col 4)
e31
// @from(Ln 233099, Col 4)
NpB = w(() => {
  gPA();
  vo();
  aW();
  cPA();
  lY();
  So();
  TWA();
  QS();
  lm();
  g31();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  e31 = class e31 extends kz {
    constructor(A, Q) {
      super(A, Q)
    }
    async acquireCachedToken(A) {
      this.performanceClient?.addQueueMeasurement(N0.SilentFlowClientAcquireCachedToken, A.correlationId);
      let Q = YY.NOT_APPLICABLE;
      if (A.forceRefresh || !this.config.cacheOptions.claimsBasedCachingEnabled && !JY.isEmptyObj(A.claims)) throw this.setCacheOutcome(YY.FORCE_REFRESH_OR_CLAIMS, A.correlationId), YQ(fm);
      if (!A.account) throw YQ(km);
      let B = A.account.tenantId || FpB(A.authority),
        G = this.cacheManager.getTokenKeys(),
        Z = this.cacheManager.getAccessToken(A.account, A, G, B);
      if (!Z) throw this.setCacheOutcome(YY.NO_CACHED_ACCESS_TOKEN, A.correlationId), YQ(fm);
      else if (g50(Z.cachedAt) || kWA(Z.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.setCacheOutcome(YY.CACHED_ACCESS_TOKEN_EXPIRED, A.correlationId), YQ(fm);
      else if (Z.refreshOn && kWA(Z.refreshOn, 0)) Q = YY.PROACTIVELY_REFRESHED;
      let Y = A.authority || this.authority.getPreferredCache(),
        J = {
          account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(A.account), A.correlationId),
          accessToken: Z,
          idToken: this.cacheManager.getIdToken(A.account, A.correlationId, G, B, this.performanceClient),
          refreshToken: null,
          appMetadata: this.cacheManager.readAppMetadataFromCache(Y)
        };
      if (this.setCacheOutcome(Q, A.correlationId), this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
      return [await y5(this.generateResultFromCacheRecord.bind(this), N0.SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, A.correlationId)(J, A), Q]
    }
    setCacheOutcome(A, Q) {
      if (this.serverTelemetryManager?.setCacheOutcome(A), this.performanceClient?.addFields({
          cacheOutcome: A
        }, Q), A !== YY.NOT_APPLICABLE) this.logger.info(`Token refresh is required due to cache outcome: ${A}`)
    }
    async generateResultFromCacheRecord(A, Q) {
      this.performanceClient?.addQueueMeasurement(N0.SilentFlowClientGenerateResultFromCacheRecord, Q.correlationId);
      let B;
      if (A.idToken) B = mm(A.idToken.secret, this.config.cryptoInterface.base64Decode);
      if (Q.maxAge || Q.maxAge === 0) {
        let G = B?.auth_time;
        if (!G) throw YQ(vm);
        UPA(G, Q.maxAge)
      }
      return oI.generateAuthenticationResult(this.cryptoUtils, this.authority, A, !0, Q, B)
    }
  }
})
// @from(Ln 233155, Col 4)
pPA = {}
// @from(Ln 233163, Col 0)
function Jh8(A, Q, B, G) {
  let Z = Q.correlationId,
    Y = new Map;
  B9A(Y, Q.embeddedClientId || Q.extraQueryParameters?.[ek] || A.clientId);
  let J = [...Q.scopes || [], ...Q.extraScopesToConsent || []];
  if (Q9A(Y, J, !0, A.authority.options.OIDCOptions?.defaultScopes), G9A(Y, Q.redirectUri), Y9A(Y, Z), T50(Y, Q.responseMode), J9A(Y), Q.prompt) y50(Y, Q.prompt), G?.addFields({
    prompt: Q.prompt
  }, Z);
  if (Q.domainHint) x50(Y, Q.domainHint), G?.addFields({
    domainHintFromRequest: !0
  }, Z);
  if (Q.prompt !== qo.SELECT_ACCOUNT) {
    if (Q.sid && Q.prompt === qo.NONE) B.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"), y31(Y, Q.sid), G?.addFields({
      sidFromRequest: !0
    }, Z);
    else if (Q.account) {
      let X = Wh8(Q.account),
        I = Kh8(Q.account);
      if (I && Q.domainHint) B.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'), I = null;
      if (I) {
        B.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"), yWA(Y, I), G?.addFields({
          loginHintFromClaim: !0
        }, Z);
        try {
          let D = sk(Q.account.homeAccountId);
          dm(Y, D)
        } catch (D) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      } else if (X && Q.prompt === qo.NONE) {
        B.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"), y31(Y, X), G?.addFields({
          sidFromClaim: !0
        }, Z);
        try {
          let D = sk(Q.account.homeAccountId);
          dm(Y, D)
        } catch (D) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      } else if (Q.loginHint) B.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"), yWA(Y, Q.loginHint), yo(Y, Q.loginHint), G?.addFields({
        loginHintFromRequest: !0
      }, Z);
      else if (Q.account.username) {
        B.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"), yWA(Y, Q.account.username), G?.addFields({
          loginHintFromUpn: !0
        }, Z);
        try {
          let D = sk(Q.account.homeAccountId);
          dm(Y, D)
        } catch (D) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      }
    } else if (Q.loginHint) B.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"), yWA(Y, Q.loginHint), yo(Y, Q.loginHint), G?.addFields({
      loginHintFromRequest: !0
    }, Z)
  } else B.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");
  if (Q.nonce) v50(Y, Q.nonce);
  if (Q.state) RPA(Y, Q.state);
  if (Q.claims || A.clientCapabilities && A.clientCapabilities.length > 0) Z9A(Y, Q.claims, A.clientCapabilities);
  if (Q.embeddedClientId) pm(Y, A.clientId, A.redirectUri);
  if (A.instanceAware && (!Q.extraQueryParameters || !Object.keys(Q.extraQueryParameters).includes(SWA))) SPA(Y);
  return Y
}
// @from(Ln 233228, Col 0)
function Xh8(A, Q, B, G) {
  let Z = tk(Q, B, G);
  return U3.appendQueryString(A.authorizationEndpoint, Z)
}
// @from(Ln 233233, Col 0)
function Ih8(A, Q) {
  if (wpB(A, Q), !A.code) throw YQ(g2A);
  return A
}
// @from(Ln 233238, Col 0)
function wpB(A, Q) {
  if (!A.state || !Q) throw A.state ? YQ(Oo, "Cached State") : YQ(Oo, "Server State");
  let B, G;
  try {
    B = decodeURIComponent(A.state)
  } catch (Z) {
    throw YQ(AS, A.state)
  }
  try {
    G = decodeURIComponent(Q)
  } catch (Z) {
    throw YQ(AS, A.state)
  }
  if (B !== G) throw YQ(P2A);
  if (A.error || A.error_description || A.suberror) {
    let Z = Dh8(A);
    if (n31(A.error, A.error_description, A.suberror)) throw new AO(A.error || "", A.error_description, A.suberror, A.timestamp || "", A.trace_id || "", A.correlation_id || "", A.claims || "", Z);
    throw new xC(A.error || "", A.error_description, A.suberror, Z)
  }
}
// @from(Ln 233259, Col 0)
function Dh8(A) {
  let B = A.error_uri?.lastIndexOf("code=");
  return B && B >= 0 ? A.error_uri?.substring(B + 5) : void 0
}
// @from(Ln 233264, Col 0)
function Wh8(A) {
  return A.idTokenClaims?.sid || null
}
// @from(Ln 233268, Col 0)
function Kh8(A) {
  return A.loginHint || A.idTokenClaims?.login_hint || null
}
// @from(Ln 233271, Col 4)
LpB = w(() => {
  vWA();
  xWA();
  lY();
  jWA();
  s2A();
  xo();
  aW();
  dPA();
  fWA();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 233284, Col 0)
function Vh8(A) {
  let {
    skus: Q,
    libraryName: B,
    libraryVersion: G,
    extensionName: Z,
    extensionVersion: Y
  } = A, J = new Map([
    [0, [B, G]],
    [2, [Z, Y]]
  ]), X = [];
  if (Q?.length) {
    if (X = Q.split(OpB), X.length < 4) return Q
  } else X = Array.from({
    length: 4
  }, () => MpB);
  return J.forEach((I, D) => {
    if (I.length === 2 && I[0]?.length && I[1]?.length) Fh8({
      skuArr: X,
      index: D,
      skuName: I[0],
      skuVersion: I[1]
    })
  }), X.join(OpB)
}
// @from(Ln 233310, Col 0)
function Fh8(A) {
  let {
    skuArr: Q,
    index: B,
    skuName: G,
    skuVersion: Z
  } = A;
  if (B >= Q.length) return;
  Q[B] = [G, Z].join(MpB)
}
// @from(Ln 233320, Col 0)
class fo {
  constructor(A, Q) {
    this.cacheOutcome = YY.NOT_APPLICABLE, this.cacheManager = Q, this.apiId = A.apiId, this.correlationId = A.correlationId, this.wrapperSKU = A.wrapperSKU || m0.EMPTY_STRING, this.wrapperVer = A.wrapperVer || m0.EMPTY_STRING, this.telemetryCacheKey = rK.CACHE_KEY + ym.CACHE_KEY_SEPARATOR + A.clientId
  }
  generateCurrentRequestHeaderValue() {
    let A = `${this.apiId}${rK.VALUE_SEPARATOR}${this.cacheOutcome}`,
      Q = [this.wrapperSKU, this.wrapperVer],
      B = this.getNativeBrokerErrorCode();
    if (B?.length) Q.push(`broker_error=${B}`);
    let G = Q.join(rK.VALUE_SEPARATOR),
      Z = this.getRegionDiscoveryFields(),
      Y = [A, Z].join(rK.VALUE_SEPARATOR);
    return [rK.SCHEMA_VERSION, Y, G].join(rK.CATEGORY_SEPARATOR)
  }
  generateLastRequestHeaderValue() {
    let A = this.getLastRequests(),
      Q = fo.maxErrorsToSend(A),
      B = A.failedRequests.slice(0, 2 * Q).join(rK.VALUE_SEPARATOR),
      G = A.errors.slice(0, Q).join(rK.VALUE_SEPARATOR),
      Z = A.errors.length,
      Y = Q < Z ? rK.OVERFLOW_TRUE : rK.OVERFLOW_FALSE,
      J = [Z, Y].join(rK.VALUE_SEPARATOR);
    return [rK.SCHEMA_VERSION, A.cacheHits, B, G, J].join(rK.CATEGORY_SEPARATOR)
  }
  cacheFailedRequest(A) {
    let Q = this.getLastRequests();
    if (Q.errors.length >= rK.MAX_CACHED_ERRORS) Q.failedRequests.shift(), Q.failedRequests.shift(), Q.errors.shift();
    if (Q.failedRequests.push(this.apiId, this.correlationId), A instanceof Error && !!A && A.toString())
      if (A instanceof n6)
        if (A.subError) Q.errors.push(A.subError);
        else if (A.errorCode) Q.errors.push(A.errorCode);
    else Q.errors.push(A.toString());
    else Q.errors.push(A.toString());
    else Q.errors.push(rK.UNKNOWN_ERROR);
    this.cacheManager.setServerTelemetry(this.telemetryCacheKey, Q, this.correlationId);
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
      Q = fo.maxErrorsToSend(A),
      B = A.errors.length;
    if (Q === B) this.cacheManager.removeItem(this.telemetryCacheKey, this.correlationId);
    else {
      let G = {
        failedRequests: A.failedRequests.slice(Q * 2),
        errors: A.errors.slice(Q),
        cacheHits: 0
      };
      this.cacheManager.setServerTelemetry(this.telemetryCacheKey, G, this.correlationId)
    }
  }
  static maxErrorsToSend(A) {
    let Q, B = 0,
      G = 0,
      Z = A.errors.length;
    for (Q = 0; Q < Z; Q++) {
      let Y = A.failedRequests[2 * Q] || m0.EMPTY_STRING,
        J = A.failedRequests[2 * Q + 1] || m0.EMPTY_STRING,
        X = A.errors[Q] || m0.EMPTY_STRING;
      if (G += Y.toString().length + J.toString().length + X.length + 3, G < rK.MAX_LAST_HEADER_BYTES) B += 1;
      else break
    }
    return B
  }
  getRegionDiscoveryFields() {
    let A = [];
    return A.push(this.regionUsed || m0.EMPTY_STRING), A.push(this.regionSource || m0.EMPTY_STRING), A.push(this.regionOutcome || m0.EMPTY_STRING), A.join(",")
  }
  updateRegionDiscoveryMetadata(A) {
    this.regionUsed = A.region_used, this.regionSource = A.region_source, this.regionOutcome = A.region_outcome
  }
  setCacheOutcome(A) {
    this.cacheOutcome = A
  }
  setNativeBrokerErrorCode(A) {
    let Q = this.getLastRequests();
    Q.nativeBrokerErrorCode = A, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, Q, this.correlationId)
  }
  getNativeBrokerErrorCode() {
    return this.getLastRequests().nativeBrokerErrorCode
  }
  clearNativeBrokerErrorCode() {
    let A = this.getLastRequests();
    delete A.nativeBrokerErrorCode, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, A, this.correlationId)
  }
  static makeExtraSkuString(A) {
    return Vh8(A)
  }
}
// @from(Ln 233421, Col 4)
OpB = ","
// @from(Ln 233422, Col 2)
MpB = "|"
// @from(Ln 233423, Col 4)
RpB = w(() => {
  lY();
  U_(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 233427, Col 4)
xG = w(() => {
  UpB();
  qpB();
  NpB();
  gPA();
  wPA();
  g31();
  C31();
  CPA();
  d80();
  w31();
  xo();
  P80();
  LpB();
  vWA();
  cPA();
  zPA();
  E31();
  dPA();
  l31();
  U_();
  R80();
  fWA();
  aW();
  mD();
  Po();
  um();
  lY();
  So();
  RpB();
  TWA();
  l50();
  f31();
  vo();
  s2A();
  xWA();
  r50();
  s31(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 233466, Col 0)
class ho {
  static deserializeJSONBlob(A) {
    return !A ? {} : JSON.parse(A)
  }
  static deserializeAccounts(A) {
    let Q = {};
    if (A) Object.keys(A).map(function (B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          realm: G.realm,
          localAccountId: G.local_account_id,
          username: G.username,
          authorityType: G.authority_type,
          name: G.name,
          clientInfo: G.client_info,
          lastModificationTime: G.last_modification_time,
          lastModificationApp: G.last_modification_app,
          tenantProfiles: G.tenantProfiles?.map((J) => {
            return JSON.parse(J)
          }),
          lastUpdatedAt: Date.now().toString()
        },
        Y = new oW;
      t2A.toObject(Y, Z), Q[B] = Y
    });
    return Q
  }
  static deserializeIdTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function (B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          credentialType: G.credential_type,
          clientId: G.client_id,
          secret: G.secret,
          realm: G.realm,
          lastUpdatedAt: Date.now().toString()
        };
      Q[B] = Z
    });
    return Q
  }
  static deserializeAccessTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function (B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          credentialType: G.credential_type,
          clientId: G.client_id,
          secret: G.secret,
          realm: G.realm,
          target: G.target,
          cachedAt: G.cached_at,
          expiresOn: G.expires_on,
          extendedExpiresOn: G.extended_expires_on,
          refreshOn: G.refresh_on,
          keyId: G.key_id,
          tokenType: G.token_type,
          requestedClaims: G.requestedClaims,
          requestedClaimsHash: G.requestedClaimsHash,
          userAssertionHash: G.userAssertionHash,
          lastUpdatedAt: Date.now().toString()
        };
      Q[B] = Z
    });
    return Q
  }
  static deserializeRefreshTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function (B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          credentialType: G.credential_type,
          clientId: G.client_id,
          secret: G.secret,
          familyId: G.family_id,
          target: G.target,
          realm: G.realm,
          lastUpdatedAt: Date.now().toString()
        };
      Q[B] = Z
    });
    return Q
  }
  static deserializeAppMetadata(A) {
    let Q = {};
    if (A) Object.keys(A).map(function (B) {
      let G = A[B];
      Q[B] = {
        clientId: G.client_id,
        environment: G.environment,
        familyId: G.family_id
      }
    });
    return Q
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
// @from(Ln 233580, Col 4)
A81 = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 233583, Col 4)
s50 = {}
// @from(Ln 233588, Col 4)
_pB = w(() => {
  K31();
  A81(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 233592, Col 4)
jpB = "system_assigned_managed_identity"
// @from(Ln 233593, Col 2)
qh8 = "managed_identity"
// @from(Ln 233594, Col 2)
t50
// @from(Ln 233594, Col 7)
HN
// @from(Ln 233594, Col 11)
rW
// @from(Ln 233594, Col 15)
Q6
// @from(Ln 233594, Col 19)
L6
// @from(Ln 233594, Col 23)
VI
// @from(Ln 233594, Col 27)
OJ
// @from(Ln 233594, Col 31)
Q81
// @from(Ln 233594, Col 36)
TpB = "REGION_NAME"
// @from(Ln 233595, Col 2)
PpB = "MSAL_FORCE_REGION"
// @from(Ln 233596, Col 2)
SpB = 32
// @from(Ln 233597, Col 2)
xpB
// @from(Ln 233597, Col 7)
B81
// @from(Ln 233597, Col 12)
e50
// @from(Ln 233597, Col 17)
vC
// @from(Ln 233597, Col 21)
nm
// @from(Ln 233597, Col 25)
w_
// @from(Ln 233597, Col 29)
G81
// @from(Ln 233597, Col 34)
ypB = 4096
// @from(Ln 233598, Col 4)
MJ = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  t50 = `https://login.microsoftonline.com/${qh8}/`, HN = {
    AUTHORIZATION_HEADER_NAME: "Authorization",
    METADATA_HEADER_NAME: "Metadata",
    APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
    ML_AND_SF_SECRET_HEADER_NAME: "secret"
  }, rW = {
    API_VERSION: "api-version",
    RESOURCE: "resource",
    SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
    XMS_CC: "xms_cc"
  }, Q6 = {
    AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
    DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
    IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
    IDENTITY_HEADER: "IDENTITY_HEADER",
    IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
    IMDS_ENDPOINT: "IMDS_ENDPOINT",
    MSI_ENDPOINT: "MSI_ENDPOINT",
    MSI_SECRET: "MSI_SECRET"
  }, L6 = {
    APP_SERVICE: "AppService",
    AZURE_ARC: "AzureArc",
    CLOUD_SHELL: "CloudShell",
    DEFAULT_TO_IMDS: "DefaultToImds",
    IMDS: "Imds",
    MACHINE_LEARNING: "MachineLearning",
    SERVICE_FABRIC: "ServiceFabric"
  }, VI = {
    SYSTEM_ASSIGNED: "system-assigned",
    USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
    USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
    USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
  }, OJ = {
    GET: "get",
    POST: "post"
  }, Q81 = {
    SUCCESS_RANGE_START: i6.SUCCESS_RANGE_START,
    SUCCESS_RANGE_END: i6.SUCCESS_RANGE_END,
    SERVER_ERROR: i6.SERVER_ERROR
  }, xpB = {
    SHA256: "sha256"
  }, B81 = {
    CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  }, e50 = {
    KEY_SEPARATOR: "-"
  }, vC = {
    MSAL_SKU: "msal.js.node",
    JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    AUTHORIZATION_PENDING: "authorization_pending",
    HTTP_PROTOCOL: "http://",
    LOCALHOST: "localhost"
  }, nm = {
    acquireTokenSilent: 62,
    acquireTokenByUsernamePassword: 371,
    acquireTokenByDeviceCode: 671,
    acquireTokenByClientCredential: 771,
    acquireTokenByCode: 871,
    acquireTokenByRefreshToken: 872
  }, w_ = {
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
  }, G81 = {
    INTERVAL_MS: 100,
    TIMEOUT_MS: 5000
  }
})
// @from(Ln 233675, Col 0)
class lPA {
  static getNetworkResponse(A, Q, B) {
    return {
      headers: A,
      body: Q,
      status: B
    }
  }
  static urlToHttpOptions(A) {
    let Q = {
      protocol: A.protocol,
      hostname: A.hostname && A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname,
      hash: A.hash,
      search: A.search,
      pathname: A.pathname,
      path: `${A.pathname||""}${A.search||""}`,
      href: A.href
    };
    if (A.port !== "") Q.port = Number(A.port);
    if (A.username || A.password) Q.auth = `${decodeURIComponent(A.username)}:${decodeURIComponent(A.password)}`;
    return Q
  }
}
// @from(Ln 233698, Col 4)
vpB = w(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 233703, Col 0)
class iPA {
  constructor(A, Q) {
    this.proxyUrl = A || "", this.customAgentOptions = Q || {}
  }
  async sendGetRequestAsync(A, Q, B) {
    if (this.proxyUrl) return bpB(A, this.proxyUrl, OJ.GET, Q, this.customAgentOptions, B);
    else return fpB(A, OJ.GET, Q, this.customAgentOptions, B)
  }
  async sendPostRequestAsync(A, Q) {
    if (this.proxyUrl) return bpB(A, this.proxyUrl, OJ.POST, Q, this.customAgentOptions);
    else return fpB(A, OJ.POST, Q, this.customAgentOptions)
  }
}
// @from(Ln 233716, Col 4)
bpB = (A, Q, B, G, Z, Y) => {
    let J = new URL(A),
      X = new URL(Q),
      I = G?.headers || {},
      D = {
        host: X.hostname,
        port: X.port,
        method: "CONNECT",
        path: J.hostname,
        headers: I
      };
    if (Z && Object.keys(Z).length) D.agent = new A70.Agent(Z);
    let W = "";
    if (B === OJ.POST) {
      let V = G?.body || "";
      W = `Content-Type: application/x-www-form-urlencoded\r
Content-Length: ${V.length}\r
\r
${V}`
    } else if (Y) D.timeout = Y;
    let K = `${B.toUpperCase()} ${J.href} HTTP/1.1\r
Host: ${J.host}\r
Connection: close\r
` + W + `\r
`;
    return new Promise((V, F) => {
      let H = A70.request(D);
      if (Y) H.on("timeout", () => {
        H.destroy(), F(Error("Request time out"))
      });
      H.end(), H.on("connect", (E, z) => {
        let $ = E?.statusCode || Q81.SERVER_ERROR;
        if ($ < Q81.SUCCESS_RANGE_START || $ > Q81.SUCCESS_RANGE_END) H.destroy(), z.destroy(), F(Error(`Error connecting to proxy. Http status code: ${E.statusCode}. Http status message: ${E?.statusMessage||"Unknown"}`));
        z.write(K);
        let O = [];
        z.on("data", (L) => {
          O.push(L)
        }), z.on("end", () => {
          let M = Buffer.concat([...O]).toString().split(`\r
`),
            _ = parseInt(M[0].split(" ")[1]),
            j = M[0].split(" ").slice(2).join(" "),
            x = M[M.length - 1],
            b = M.slice(1, M.length - 2),
            S = new Map;
          b.forEach((n) => {
            let y = n.split(new RegExp(/:\s(.*)/s)),
              p = y[0],
              GA = y[1];
            try {
              let WA = JSON.parse(GA);
              if (WA && typeof WA === "object") GA = WA
            } catch (WA) {}
            S.set(p, GA)
          });
          let f = Object.fromEntries(S),
            AA = lPA.getNetworkResponse(f, hpB(_, j, f, x), _);
          if ((_ < i6.SUCCESS_RANGE_START || _ > i6.SUCCESS_RANGE_END) && AA.body.error !== vC.AUTHORIZATION_PENDING) H.destroy();
          V(AA)
        }), z.on("error", (L) => {
          H.destroy(), z.destroy(), F(Error(L.toString()))
        })
      }), H.on("error", (E) => {
        H.destroy(), F(Error(E.toString()))
      })
    })
  }
// @from(Ln 233783, Col 2)
fpB = (A, Q, B, G, Z) => {
    let Y = Q === OJ.POST,
      J = B?.body || "",
      X = new URL(A),
      I = B?.headers || {},
      D = {
        method: Q,
        headers: I,
        ...lPA.urlToHttpOptions(X)
      };
    if (G && Object.keys(G).length) D.agent = new kpB.Agent(G);
    if (Y) D.headers = {
      ...D.headers,
      "Content-Length": J.length
    };
    else if (Z) D.timeout = Z;
    return new Promise((W, K) => {
      let V;
      if (D.protocol === "http:") V = A70.request(D);
      else V = kpB.request(D);
      if (Y) V.write(J);
      if (Z) V.on("timeout", () => {
        V.destroy(), K(Error("Request time out"))
      });
      V.end(), V.on("response", (F) => {
        let {
          headers: H,
          statusCode: E,
          statusMessage: z
        } = F, $ = [];
        F.on("data", (O) => {
          $.push(O)
        }), F.on("end", () => {
          let O = Buffer.concat([...$]).toString(),
            L = H,
            M = lPA.getNetworkResponse(L, hpB(E, z, L, O), E);
          if ((E < i6.SUCCESS_RANGE_START || E > i6.SUCCESS_RANGE_END) && M.body.error !== vC.AUTHORIZATION_PENDING) V.destroy();
          W(M)
        })
      }), V.on("error", (F) => {
        V.destroy(), K(Error(F.toString()))
      })
    })
  }
// @from(Ln 233827, Col 2)
hpB = (A, Q, B, G) => {
    let Z;
    try {
      Z = JSON.parse(G)
    } catch (Y) {
      let J, X;
      if (A >= i6.CLIENT_ERROR_RANGE_START && A <= i6.CLIENT_ERROR_RANGE_END) J = "client_error", X = "A client";
      else if (A >= i6.SERVER_ERROR_RANGE_START && A <= i6.SERVER_ERROR_RANGE_END) J = "server_error", X = "A server";
      else J = "unknown_error", X = "An unknown";
      Z = {
        error: J,
        error_description: `${X} error occured.
Http status code: ${A}
Http status message: ${Q||"Unknown"}
Headers: ${JSON.stringify(B)}`
      }
    }
    return Z
  }
// @from(Ln 233846, Col 4)
gpB = w(() => {
  xG();
  MJ();
  vpB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 233851, Col 4)
Z81 = "invalid_file_extension"
// @from(Ln 233852, Col 2)
Y81 = "invalid_file_path"
// @from(Ln 233853, Col 2)
go = "invalid_managed_identity_id_type"
// @from(Ln 233854, Col 2)
J81 = "invalid_secret"
// @from(Ln 233855, Col 2)
upB = "missing_client_id"
// @from(Ln 233856, Col 2)
mpB = "network_unavailable"
// @from(Ln 233857, Col 2)
X81 = "platform_not_supported"
// @from(Ln 233858, Col 2)
I81 = "unable_to_create_azure_arc"
// @from(Ln 233859, Col 2)
D81 = "unable_to_create_cloud_shell"
// @from(Ln 233860, Col 2)
W81 = "unable_to_create_source"
// @from(Ln 233861, Col 2)
nPA = "unable_to_read_secret_file"
// @from(Ln 233862, Col 2)
dpB = "user_assigned_not_available_at_runtime"
// @from(Ln 233863, Col 2)
K81 = "www_authenticate_header_missing"
// @from(Ln 233864, Col 2)
V81 = "www_authenticate_header_unsupported_format"
// @from(Ln 233865, Col 2)
I9A
// @from(Ln 233866, Col 4)
D9A = w(() => {
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  I9A = {
    [Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
    [Q6.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
    [Q6.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
    [Q6.MSI_ENDPOINT]: "msi_endpoint_url_malformed"
  }
})
// @from(Ln 233876, Col 0)
function dD(A) {
  return new Q70(A)
}
// @from(Ln 233879, Col 4)
Nh8
// @from(Ln 233879, Col 9)
Q70
// @from(Ln 233880, Col 4)
uWA = w(() => {
  xG();
  D9A();
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Nh8 = {
    [Z81]: "The file path in the WWW-Authenticate header does not contain a .key file.",
    [Y81]: "The file path in the WWW-Authenticate header is not in a valid Windows or Linux Format.",
    [go]: "More than one ManagedIdentityIdType was provided.",
    [J81]: "The secret in the file on the file path in the WWW-Authenticate header is greater than 4096 bytes.",
    [X81]: "The platform is not supported by Azure Arc. Azure Arc only supports Windows and Linux.",
    [upB]: "A ManagedIdentityId id was not provided.",
    [I9A.AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
    [I9A.IDENTITY_ENDPOINT]: `The Managed Identity's '${Q6.IDENTITY_ENDPOINT}' environment variable is malformed.`,
    [I9A.IMDS_ENDPOINT]: `The Managed Identity's '${Q6.IMDS_ENDPOINT}' environment variable is malformed.`,
    [I9A.MSI_ENDPOINT]: `The Managed Identity's '${Q6.MSI_ENDPOINT}' environment variable is malformed.`,
    [mpB]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
    [I81]: "Azure Arc Managed Identities can only be system assigned.",
    [D81]: "Cloud Shell Managed Identities can only be system assigned.",
    [W81]: "Unable to create a Managed Identity source based on environment variables.",
    [nPA]: "Unable to read the secret file.",
    [dpB]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
    [K81]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
    [V81]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format."
  };
  Q70 = class Q70 extends n6 {
    constructor(A) {
      super(A, Nh8[A]);
      this.name = "ManagedIdentityError", Object.setPrototypeOf(this, Q70.prototype)
    }
  }
})
// @from(Ln 233911, Col 0)
class B70 {
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
    let Q = A?.userAssignedClientId,
      B = A?.userAssignedResourceId,
      G = A?.userAssignedObjectId;
    if (Q) {
      if (B || G) throw dD(go);
      this.id = Q, this.idType = VI.USER_ASSIGNED_CLIENT_ID
    } else if (B) {
      if (Q || G) throw dD(go);
      this.id = B, this.idType = VI.USER_ASSIGNED_RESOURCE_ID
    } else if (G) {
      if (Q || B) throw dD(go);
      this.id = G, this.idType = VI.USER_ASSIGNED_OBJECT_ID
    } else this.id = jpB, this.idType = VI.SYSTEM_ASSIGNED
  }
}
// @from(Ln 233940, Col 4)
cpB = w(() => {
  uWA();
  MJ();
  D9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 233945, Col 4)
sW
// @from(Ln 233945, Col 8)
MX
// @from(Ln 233946, Col 4)
aPA = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  sW = {
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
  MX = class MX extends n6 {
    constructor(A, Q) {
      super(A, Q);
      this.name = "NodeAuthError"
    }
    static createInvalidLoopbackAddressTypeError() {
      return new MX(sW.invalidLoopbackAddressType.code, `${sW.invalidLoopbackAddressType.desc}`)
    }
    static createUnableToLoadRedirectUrlError() {
      return new MX(sW.unableToLoadRedirectUri.code, `${sW.unableToLoadRedirectUri.desc}`)
    }
    static createNoAuthCodeInResponseError() {
      return new MX(sW.noAuthCodeInResponse.code, `${sW.noAuthCodeInResponse.desc}`)
    }
    static createNoLoopbackServerExistsError() {
      return new MX(sW.noLoopbackServerExists.code, `${sW.noLoopbackServerExists.desc}`)
    }
    static createLoopbackServerAlreadyExistsError() {
      return new MX(sW.loopbackServerAlreadyExists.code, `${sW.loopbackServerAlreadyExists.desc}`)
    }
    static createLoopbackServerTimeoutError() {
      return new MX(sW.loopbackServerTimeout.code, `${sW.loopbackServerTimeout.desc}`)
    }
    static createStateNotFoundError() {
      return new MX(sW.stateNotFoundError.code, sW.stateNotFoundError.desc)
    }
    static createThumbprintMissingError() {
      return new MX(sW.thumbprintMissing.code, sW.thumbprintMissing.desc)
    }
    static createRedirectUriNotSupportedError() {
      return new MX(sW.redirectUriNotSupported.code, sW.redirectUriNotSupported.desc)
    }
  }
})
// @from(Ln 234021, Col 0)
function ppB({
  auth: A,
  broker: Q,
  cache: B,
  system: G,
  telemetry: Z
}) {
  let Y = {
    ...Oh8,
    networkClient: new iPA(G?.proxyUrl, G?.customAgentOptions),
    loggerOptions: G?.loggerOptions || G70,
    disableInternalRetries: G?.disableInternalRetries || !1
  };
  if (!!A.clientCertificate && !A.clientCertificate.thumbprint && !A.clientCertificate.thumbprintSha256) throw MX.createStateNotFoundError();
  return {
    auth: {
      ...wh8,
      ...A
    },
    broker: {
      ...Q
    },
    cache: {
      ...Lh8,
      ...B
    },
    system: {
      ...Y,
      ...G
    },
    telemetry: {
      ...Mh8,
      ...Z
    }
  }
}
// @from(Ln 234058, Col 0)
function lpB({
  clientCapabilities: A,
  managedIdentityIdParams: Q,
  system: B
}) {
  let G = new B70(Q),
    Z = B?.loggerOptions || G70,
    Y;
  if (B?.networkClient) Y = B.networkClient;
  else Y = new iPA(B?.proxyUrl, B?.customAgentOptions);
  return {
    clientCapabilities: A || [],
    managedIdentityId: G,
    system: {
      loggerOptions: Z,
      networkClient: Y
    },
    disableInternalRetries: B?.disableInternalRetries || !1
  }
}
// @from(Ln 234078, Col 4)
wh8
// @from(Ln 234078, Col 9)
Lh8
// @from(Ln 234078, Col 14)
G70
// @from(Ln 234078, Col 19)
Oh8
// @from(Ln 234078, Col 24)
Mh8
// @from(Ln 234079, Col 4)
Z70 = w(() => {
  xG();
  gpB();
  cpB();
  aPA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  wh8 = {
    clientId: m0.EMPTY_STRING,
    authority: m0.DEFAULT_AUTHORITY,
    clientSecret: m0.EMPTY_STRING,
    clientAssertion: m0.EMPTY_STRING,
    clientCertificate: {
      thumbprint: m0.EMPTY_STRING,
      thumbprintSha256: m0.EMPTY_STRING,
      privateKey: m0.EMPTY_STRING,
      x5c: m0.EMPTY_STRING
    },
    knownAuthorities: [],
    cloudDiscoveryMetadata: m0.EMPTY_STRING,
    authorityMetadata: m0.EMPTY_STRING,
    clientCapabilities: [],
    protocolMode: vz.AAD,
    azureCloudOptions: {
      azureCloudInstance: hm.None,
      tenant: m0.EMPTY_STRING
    },
    skipAuthorityMetadataCache: !1,
    encodeExtraQueryParams: !1
  }, Lh8 = {
    claimsBasedCachingEnabled: !1
  }, G70 = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: KI.Info
  }, Oh8 = {
    loggerOptions: G70,
    networkClient: new iPA,
    proxyUrl: m0.EMPTY_STRING,
    customAgentOptions: {},
    disableInternalRetries: !1
  }, Mh8 = {
    application: {
      appName: m0.EMPTY_STRING,
      appVersion: m0.EMPTY_STRING
    }
  }
})
// @from(Ln 234125, Col 4)
Y70 = U((ipB) => {
  Object.defineProperty(ipB, "__esModule", {
    value: !0
  });
  ipB.default = jh8;
  var Rh8 = _h8(NA("crypto"));

  function _h8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var H81 = new Uint8Array(256),
    F81 = H81.length;

  function jh8() {
    if (F81 > H81.length - 16) Rh8.default.randomFillSync(H81), F81 = 0;
    return H81.slice(F81, F81 += 16)
  }
})
// @from(Ln 234145, Col 4)
opB = U((npB) => {
  Object.defineProperty(npB, "__esModule", {
    value: !0
  });
  npB.default = void 0;
  var Ph8 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  npB.default = Ph8
})
// @from(Ln 234153, Col 4)
oPA = U((rpB) => {
  Object.defineProperty(rpB, "__esModule", {
    value: !0
  });
  rpB.default = void 0;
  var Sh8 = xh8(opB());

  function xh8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function yh8(A) {
    return typeof A === "string" && Sh8.default.test(A)
  }
  var vh8 = yh8;
  rpB.default = vh8
})
// @from(Ln 234172, Col 4)
rPA = U((tpB) => {
  Object.defineProperty(tpB, "__esModule", {
    value: !0
  });
  tpB.default = void 0;
  var kh8 = bh8(oPA());

  function bh8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var rH = [];
  for (let A = 0; A < 256; ++A) rH.push((A + 256).toString(16).substr(1));

  function fh8(A, Q = 0) {
    let B = (rH[A[Q + 0]] + rH[A[Q + 1]] + rH[A[Q + 2]] + rH[A[Q + 3]] + "-" + rH[A[Q + 4]] + rH[A[Q + 5]] + "-" + rH[A[Q + 6]] + rH[A[Q + 7]] + "-" + rH[A[Q + 8]] + rH[A[Q + 9]] + "-" + rH[A[Q + 10]] + rH[A[Q + 11]] + rH[A[Q + 12]] + rH[A[Q + 13]] + rH[A[Q + 14]] + rH[A[Q + 15]]).toLowerCase();
    if (!(0, kh8.default)(B)) throw TypeError("Stringified UUID is invalid");
    return B
  }
  var hh8 = fh8;
  tpB.default = hh8
})
// @from(Ln 234195, Col 4)
ZlB = U((BlB) => {
  Object.defineProperty(BlB, "__esModule", {
    value: !0
  });
  BlB.default = void 0;
  var gh8 = QlB(Y70()),
    uh8 = QlB(rPA());

  function QlB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var AlB, J70, X70 = 0,
    I70 = 0;

  function mh8(A, Q, B) {
    let G = Q && B || 0,
      Z = Q || Array(16);
    A = A || {};
    let Y = A.node || AlB,
      J = A.clockseq !== void 0 ? A.clockseq : J70;
    if (Y == null || J == null) {
      let V = A.random || (A.rng || gh8.default)();
      if (Y == null) Y = AlB = [V[0] | 1, V[1], V[2], V[3], V[4], V[5]];
      if (J == null) J = J70 = (V[6] << 8 | V[7]) & 16383
    }
    let X = A.msecs !== void 0 ? A.msecs : Date.now(),
      I = A.nsecs !== void 0 ? A.nsecs : I70 + 1,
      D = X - X70 + (I - I70) / 1e4;
    if (D < 0 && A.clockseq === void 0) J = J + 1 & 16383;
    if ((D < 0 || X > X70) && A.nsecs === void 0) I = 0;
    if (I >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    X70 = X, I70 = I, J70 = J, X += 12219292800000;
    let W = ((X & 268435455) * 1e4 + I) % 4294967296;
    Z[G++] = W >>> 24 & 255, Z[G++] = W >>> 16 & 255, Z[G++] = W >>> 8 & 255, Z[G++] = W & 255;
    let K = X / 4294967296 * 1e4 & 268435455;
    Z[G++] = K >>> 8 & 255, Z[G++] = K & 255, Z[G++] = K >>> 24 & 15 | 16, Z[G++] = K >>> 16 & 255, Z[G++] = J >>> 8 | 128, Z[G++] = J & 255;
    for (let V = 0; V < 6; ++V) Z[G + V] = Y[V];
    return Q || (0, uh8.default)(Z)
  }
  var dh8 = mh8;
  BlB.default = dh8
})
// @from(Ln 234239, Col 4)
D70 = U((YlB) => {
  Object.defineProperty(YlB, "__esModule", {
    value: !0
  });
  YlB.default = void 0;
  var ch8 = ph8(oPA());

  function ph8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function lh8(A) {
    if (!(0, ch8.default)(A)) throw TypeError("Invalid UUID");
    let Q, B = new Uint8Array(16);
    return B[0] = (Q = parseInt(A.slice(0, 8), 16)) >>> 24, B[1] = Q >>> 16 & 255, B[2] = Q >>> 8 & 255, B[3] = Q & 255, B[4] = (Q = parseInt(A.slice(9, 13), 16)) >>> 8, B[5] = Q & 255, B[6] = (Q = parseInt(A.slice(14, 18), 16)) >>> 8, B[7] = Q & 255, B[8] = (Q = parseInt(A.slice(19, 23), 16)) >>> 8, B[9] = Q & 255, B[10] = (Q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, B[11] = Q / 4294967296 & 255, B[12] = Q >>> 24 & 255, B[13] = Q >>> 16 & 255, B[14] = Q >>> 8 & 255, B[15] = Q & 255, B
  }
  var ih8 = lh8;
  YlB.default = ih8
})
// @from(Ln 234260, Col 4)
W70 = U((WlB) => {
  Object.defineProperty(WlB, "__esModule", {
    value: !0
  });
  WlB.default = rh8;
  WlB.URL = WlB.DNS = void 0;
  var nh8 = XlB(rPA()),
    ah8 = XlB(D70());

  function XlB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function oh8(A) {
    A = unescape(encodeURIComponent(A));
    let Q = [];
    for (let B = 0; B < A.length; ++B) Q.push(A.charCodeAt(B));
    return Q
  }
  var IlB = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  WlB.DNS = IlB;
  var DlB = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  WlB.URL = DlB;

  function rh8(A, Q, B) {
    function G(Z, Y, J, X) {
      if (typeof Z === "string") Z = oh8(Z);
      if (typeof Y === "string") Y = (0, ah8.default)(Y);
      if (Y.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let I = new Uint8Array(16 + Z.length);
      if (I.set(Y), I.set(Z, Y.length), I = B(I), I[6] = I[6] & 15 | Q, I[8] = I[8] & 63 | 128, J) {
        X = X || 0;
        for (let D = 0; D < 16; ++D) J[X + D] = I[D];
        return J
      }
      return (0, nh8.default)(I)
    }
    try {
      G.name = A
    } catch (Z) {}
    return G.DNS = IlB, G.URL = DlB, G
  }
})
// @from(Ln 234305, Col 4)
HlB = U((VlB) => {
  Object.defineProperty(VlB, "__esModule", {
    value: !0
  });
  VlB.default = void 0;
  var eh8 = Ag8(NA("crypto"));

  function Ag8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Qg8(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return eh8.default.createHash("md5").update(A).digest()
  }
  var Bg8 = Qg8;
  VlB.default = Bg8
})
// @from(Ln 234326, Col 4)
ClB = U((zlB) => {
  Object.defineProperty(zlB, "__esModule", {
    value: !0
  });
  zlB.default = void 0;
  var Gg8 = ElB(W70()),
    Zg8 = ElB(HlB());

  function ElB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var Yg8 = (0, Gg8.default)("v3", 48, Zg8.default),
    Jg8 = Yg8;
  zlB.default = Jg8
})
// @from(Ln 234343, Col 4)
wlB = U((qlB) => {
  Object.defineProperty(qlB, "__esModule", {
    value: !0
  });
  qlB.default = void 0;
  var Xg8 = UlB(Y70()),
    Ig8 = UlB(rPA());

  function UlB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Dg8(A, Q, B) {
    A = A || {};
    let G = A.random || (A.rng || Xg8.default)();
    if (G[6] = G[6] & 15 | 64, G[8] = G[8] & 63 | 128, Q) {
      B = B || 0;
      for (let Z = 0; Z < 16; ++Z) Q[B + Z] = G[Z];
      return Q
    }
    return (0, Ig8.default)(G)
  }
  var Wg8 = Dg8;
  qlB.default = Wg8
})
// @from(Ln 234370, Col 4)
MlB = U((LlB) => {
  Object.defineProperty(LlB, "__esModule", {
    value: !0
  });
  LlB.default = void 0;
  var Kg8 = Vg8(NA("crypto"));

  function Vg8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Fg8(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return Kg8.default.createHash("sha1").update(A).digest()
  }
  var Hg8 = Fg8;
  LlB.default = Hg8
})
// @from(Ln 234391, Col 4)
TlB = U((_lB) => {
  Object.defineProperty(_lB, "__esModule", {
    value: !0
  });
  _lB.default = void 0;
  var Eg8 = RlB(W70()),
    zg8 = RlB(MlB());

  function RlB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var $g8 = (0, Eg8.default)("v5", 80, zg8.default),
    Cg8 = $g8;
  _lB.default = Cg8
})
// @from(Ln 234408, Col 4)
xlB = U((PlB) => {
  Object.defineProperty(PlB, "__esModule", {
    value: !0
  });
  PlB.default = void 0;
  var Ug8 = "00000000-0000-0000-0000-000000000000";
  PlB.default = Ug8
})
// @from(Ln 234416, Col 4)
klB = U((ylB) => {
  Object.defineProperty(ylB, "__esModule", {
    value: !0
  });
  ylB.default = void 0;
  var qg8 = Ng8(oPA());

  function Ng8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function wg8(A) {
    if (!(0, qg8.default)(A)) throw TypeError("Invalid UUID");
    return parseInt(A.substr(14, 1), 16)
  }
  var Lg8 = wg8;
  ylB.default = Lg8
})
// @from(Ln 234436, Col 4)
blB = U((BS) => {
  Object.defineProperty(BS, "__esModule", {
    value: !0
  });
  Object.defineProperty(BS, "v1", {
    enumerable: !0,
    get: function () {
      return Og8.default
    }
  });
  Object.defineProperty(BS, "v3", {
    enumerable: !0,
    get: function () {
      return Mg8.default
    }
  });
  Object.defineProperty(BS, "v4", {
    enumerable: !0,
    get: function () {
      return Rg8.default
    }
  });
  Object.defineProperty(BS, "v5", {
    enumerable: !0,
    get: function () {
      return _g8.default
    }
  });
  Object.defineProperty(BS, "NIL", {
    enumerable: !0,
    get: function () {
      return jg8.default
    }
  });
  Object.defineProperty(BS, "version", {
    enumerable: !0,
    get: function () {
      return Tg8.default
    }
  });
  Object.defineProperty(BS, "validate", {
    enumerable: !0,
    get: function () {
      return Pg8.default
    }
  });
  Object.defineProperty(BS, "stringify", {
    enumerable: !0,
    get: function () {
      return Sg8.default
    }
  });
  Object.defineProperty(BS, "parse", {
    enumerable: !0,
    get: function () {
      return xg8.default
    }
  });
  var Og8 = am(ZlB()),
    Mg8 = am(ClB()),
    Rg8 = am(wlB()),
    _g8 = am(TlB()),
    jg8 = am(xlB()),
    Tg8 = am(klB()),
    Pg8 = am(oPA()),
    Sg8 = am(rPA()),
    xg8 = am(D70());

  function am(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
})
// @from(Ln 234510, Col 4)
Ab
// @from(Ln 234510, Col 8)
GBZ
// @from(Ln 234510, Col 13)
ZBZ
// @from(Ln 234510, Col 18)
flB
// @from(Ln 234510, Col 23)
YBZ
// @from(Ln 234510, Col 28)
JBZ
// @from(Ln 234510, Col 33)
XBZ
// @from(Ln 234510, Col 38)
IBZ
// @from(Ln 234510, Col 43)
DBZ
// @from(Ln 234510, Col 48)
WBZ
// @from(Ln 234511, Col 4)
hlB = w(() => {
  Ab = c(blB(), 1), GBZ = Ab.default.v1, ZBZ = Ab.default.v3, flB = Ab.default.v4, YBZ = Ab.default.v5, JBZ = Ab.default.NIL, XBZ = Ab.default.version, IBZ = Ab.default.validate, DBZ = Ab.default.stringify, WBZ = Ab.default.parse
})
// @from(Ln 234514, Col 0)
class sPA {
  generateGuid() {
    return flB()
  }
  isGuid(A) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(A)
  }
}
// @from(Ln 234522, Col 4)
K70 = w(() => {
  hlB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 234525, Col 0)
class EN {
  static base64Encode(A, Q) {
    return Buffer.from(A, Q).toString(aH.BASE64)
  }
  static base64EncodeUrl(A, Q) {
    return EN.base64Encode(A, Q).replace(/=/g, m0.EMPTY_STRING).replace(/\+/g, "-").replace(/\//g, "_")
  }
  static base64Decode(A) {
    return Buffer.from(A, aH.BASE64).toString("utf8")
  }
  static base64DecodeUrl(A) {
    let Q = A.replace(/-/g, "+").replace(/_/g, "/");
    while (Q.length % 4) Q += "=";
    return EN.base64Decode(Q)
  }
}
// @from(Ln 234541, Col 4)
tPA = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 234545, Col 0)
class W9A {
  sha256(A) {
    return yg8.createHash(xpB.SHA256).update(A).digest()
  }
}
// @from(Ln 234550, Col 4)
E81 = w(() => {
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 234554, Col 0)
class V70 {
  constructor() {
    this.hashUtils = new W9A
  }
  async generatePkceCodes() {
    let A = this.generateCodeVerifier(),
      Q = this.generateCodeChallengeFromVerifier(A);
    return {
      verifier: A,
      challenge: Q
    }
  }
  generateCodeVerifier() {
    let A = [],
      Q = 256 - 256 % B81.CV_CHARSET.length;
    while (A.length <= SpB) {
      let G = vg8.randomBytes(1)[0];
      if (G >= Q) continue;
      let Z = G % B81.CV_CHARSET.length;
      A.push(B81.CV_CHARSET[Z])
    }
    let B = A.join(m0.EMPTY_STRING);
    return EN.base64EncodeUrl(B)
  }
  generateCodeChallengeFromVerifier(A) {
    return EN.base64EncodeUrl(this.hashUtils.sha256(A).toString(aH.BASE64), aH.BASE64)
  }
}
// @from(Ln 234582, Col 4)
glB = w(() => {
  xG();
  MJ();
  tPA();
  E81(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 234588, Col 0)
class om {
  constructor() {
    this.pkceGenerator = new V70, this.guidGenerator = new sPA, this.hashUtils = new W9A
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
    return EN.base64Encode(A)
  }
  base64Decode(A) {
    return EN.base64Decode(A)
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
    return EN.base64EncodeUrl(this.hashUtils.sha256(A).toString(aH.BASE64), aH.BASE64)
  }
}
// @from(Ln 234626, Col 4)
ePA = w(() => {
  xG();
  K70();
  tPA();
  glB();
  E81(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 234633, Col 4)
z81 = w(() => {
  lY();
  p80(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 234638, Col 0)
function ulB(A) {
  let Q = A.credentialType === SG.REFRESH_TOKEN && A.familyId || A.clientId,
    B = A.tokenType && A.tokenType.toLowerCase() !== J5.BEARER.toLowerCase() ? A.tokenType.toLowerCase() : "";
  return [A.homeAccountId, A.environment, A.credentialType, Q, A.realm || "", A.target || "", A.requestedClaimsHash || "", B].join(e50.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 234644, Col 0)
function mlB(A) {
  let Q = A.homeAccountId.split(".")[1];
  return [A.homeAccountId, A.environment, Q || A.tenantId || ""].join(e50.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 234648, Col 4)
dlB = w(() => {
  xG();
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 234652, Col 4)
K9A
// @from(Ln 234653, Col 4)
$81 = w(() => {
  xG();
  A81();
  K31();
  z81();
  dlB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  K9A = class K9A extends t2A {
    constructor(A, Q, B, G) {
      super(Q, B, A, new PWA, G);
      this.cache = {}, this.changeEmitters = [], this.logger = A
    }
    registerChangeEmitter(A) {
      this.changeEmitters.push(A)
    }
    emitChange() {
      this.changeEmitters.forEach((A) => A.call(null))
    }
    cacheToInMemoryCache(A) {
      let Q = {
        accounts: {},
        idTokens: {},
        accessTokens: {},
        refreshTokens: {},
        appMetadata: {}
      };
      for (let B in A) {
        let G = A[B];
        if (typeof G !== "object") continue;
        if (G instanceof oW) Q.accounts[B] = G;
        else if (SC.isIdTokenEntity(G)) Q.idTokens[B] = G;
        else if (SC.isAccessTokenEntity(G)) Q.accessTokens[B] = G;
        else if (SC.isRefreshTokenEntity(G)) Q.refreshTokens[B] = G;
        else if (SC.isAppMetadataEntity(B, G)) Q.appMetadata[B] = G;
        else continue
      }
      return Q
    }
    inMemoryCacheToCache(A) {
      let Q = this.getCache();
      return Q = {
        ...Q,
        ...A.accounts,
        ...A.idTokens,
        ...A.accessTokens,
        ...A.refreshTokens,
        ...A.appMetadata
      }, Q
    }
    getInMemoryCache() {
      return this.logger.trace("Getting in-memory cache"), this.cacheToInMemoryCache(this.getCache())
    }
    setInMemoryCache(A) {
      this.logger.trace("Setting in-memory cache");
      let Q = this.inMemoryCacheToCache(A);
      this.setCache(Q), this.emitChange()
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
    setItem(A, Q) {
      this.logger.tracePii(`Item key: ${A}`);
      let B = this.getCache();
      B[A] = Q, this.setCache(B)
    }
    generateCredentialKey(A) {
      return ulB(A)
    }
    generateAccountKey(A) {
      return mlB(A)
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
      return this.getItem(A) ? Object.assign(new oW, this.getItem(A)) : null
    }
    async setAccount(A) {
      let Q = this.generateAccountKey(oW.getAccountInfo(A));
      this.setItem(Q, A)
    }
    getIdTokenCredential(A) {
      let Q = this.getItem(A);
      if (SC.isIdTokenEntity(Q)) return Q;
      return null
    }
    async setIdTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getAccessTokenCredential(A) {
      let Q = this.getItem(A);
      if (SC.isAccessTokenEntity(Q)) return Q;
      return null
    }
    async setAccessTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getRefreshTokenCredential(A) {
      let Q = this.getItem(A);
      if (SC.isRefreshTokenEntity(Q)) return Q;
      return null
    }
    async setRefreshTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getAppMetadata(A) {
      let Q = this.getItem(A);
      if (SC.isAppMetadataEntity(A, Q)) return Q;
      return null
    }
    setAppMetadata(A) {
      let Q = SC.generateAppMetadataKey(A);
      this.setItem(Q, A)
    }
    getServerTelemetry(A) {
      let Q = this.getItem(A);
      if (Q && SC.isServerTelemetryEntity(A, Q)) return Q;
      return null
    }
    setServerTelemetry(A, Q) {
      this.setItem(A, Q)
    }
    getAuthorityMetadata(A) {
      let Q = this.getItem(A);
      if (Q && SC.isAuthorityMetadataEntity(A, Q)) return Q;
      return null
    }
    getAuthorityMetadataKeys() {
      return this.getKeys().filter((A) => {
        return this.isAuthorityMetadata(A)
      })
    }
    setAuthorityMetadata(A, Q) {
      this.setItem(A, Q)
    }
    getThrottlingCache(A) {
      let Q = this.getItem(A);
      if (Q && SC.isThrottlingEntity(A, Q)) return Q;
      return null
    }
    setThrottlingCache(A, Q) {
      this.setItem(A, Q)
    }
    removeItem(A) {
      this.logger.tracePii(`Item key: ${A}`);
      let Q = !1,
        B = this.getCache();
      if (B[A]) delete B[A], Q = !0;
      if (Q) this.setCache(B), this.emitChange();
      return Q
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
      this.logger.trace("Clearing cache entries created by MSAL"), this.getKeys().forEach((Q) => {
        this.removeItem(Q)
      }), this.emitChange()
    }
    static generateInMemoryCache(A) {
      return ho.deserializeAllCache(ho.deserializeJSONBlob(A))
    }
    static generateJsonCache(A) {
      return N2A.serializeAllCache(A)
    }
    updateCredentialCacheKey(A, Q) {
      let B = this.generateCredentialKey(Q);
      if (A !== B) {
        let G = this.getItem(A);
        if (G) return this.removeItem(A), this.setItem(B, G), this.logger.verbose(`Updated an outdated ${Q.credentialType} cache key`), B;
        else this.logger.error(`Attempted to update an outdated ${Q.credentialType} cache key but no item matching the outdated key was found in storage`)
      }
      return A
    }
  }
})
// @from(Ln 234854, Col 0)
class QSA {
  constructor(A, Q, B) {
    if (this.cacheHasChanged = !1, this.storage = A, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), B) this.persistence = B;
    this.logger = Q
  }
  hasChanged() {
    return this.cacheHasChanged
  }
  serialize() {
    this.logger.trace("Serializing in-memory cache");
    let A = N2A.serializeAllCache(this.storage.getInMemoryCache());
    if (this.cacheSnapshot) this.logger.trace("Reading cache snapshot from disk"), A = this.mergeState(JSON.parse(this.cacheSnapshot), A);
    else this.logger.trace("No cache snapshot to merge");
    return this.cacheHasChanged = !1, JSON.stringify(A)
  }
  deserialize(A) {
    if (this.logger.trace("Deserializing JSON to in-memory cache"), this.cacheSnapshot = A, this.cacheSnapshot) {
      this.logger.trace("Reading cache snapshot from disk");
      let Q = ho.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
      this.storage.setInMemoryCache(Q)
    } else this.logger.trace("No cache snapshot to deserialize")
  }
  getKVStore() {
    return this.storage.getCache()
  }
  getCacheSnapshot() {
    let A = K9A.generateInMemoryCache(this.cacheSnapshot);
    return this.storage.inMemoryCacheToCache(A)
  }
  async getAllAccounts(A = new om().createNewGuid()) {
    this.logger.trace("getAllAccounts called");
    let Q;
    try {
      if (this.persistence) Q = new N_(this, !1), await this.persistence.beforeCacheAccess(Q);
      return this.storage.getAllAccounts({}, A)
    } finally {
      if (this.persistence && Q) await this.persistence.afterCacheAccess(Q)
    }
  }
  async getAccountByHomeId(A) {
    let Q = await this.getAllAccounts();
    if (A && Q && Q.length) return Q.filter((B) => B.homeAccountId === A)[0] || null;
    else return null
  }
  async getAccountByLocalId(A) {
    let Q = await this.getAllAccounts();
    if (A && Q && Q.length) return Q.filter((B) => B.localAccountId === A)[0] || null;
    else return null
  }
  async removeAccount(A, Q) {
    this.logger.trace("removeAccount called");
    let B;
    try {
      if (this.persistence) B = new N_(this, !0), await this.persistence.beforeCacheAccess(B);
      this.storage.removeAccount(A, Q || new sPA().generateGuid())
    } finally {
      if (this.persistence && B) await this.persistence.afterCacheAccess(B)
    }
  }
  async overwriteCache() {
    if (!this.persistence) {
      this.logger.info("No persistence layer specified, cache cannot be overwritten");
      return
    }
    this.logger.info("Overwriting in-memory cache with persistent cache"), this.storage.clear();
    let A = new N_(this, !1);
    await this.persistence.beforeCacheAccess(A);
    let Q = this.getCacheSnapshot();
    this.storage.setCache(Q), await this.persistence.afterCacheAccess(A)
  }
  handleChangeEvent() {
    this.cacheHasChanged = !0
  }
  mergeState(A, Q) {
    this.logger.trace("Merging in-memory cache with cache snapshot");
    let B = this.mergeRemovals(A, Q);
    return this.mergeUpdates(B, Q)
  }
  mergeUpdates(A, Q) {
    return Object.keys(Q).forEach((B) => {
      let G = Q[B];
      if (!A.hasOwnProperty(B)) {
        if (G !== null) A[B] = G
      } else {
        let Z = G !== null,
          Y = typeof G === "object",
          J = !Array.isArray(G),
          X = typeof A[B] < "u" && A[B] !== null;
        if (Z && Y && J && X) this.mergeUpdates(A[B], G);
        else A[B] = G
      }
    }), A
  }
  mergeRemovals(A, Q) {
    this.logger.trace("Remove updated entries in cache");
    let B = A.Account ? this.mergeRemovalsDict(A.Account, Q.Account) : A.Account,
      G = A.AccessToken ? this.mergeRemovalsDict(A.AccessToken, Q.AccessToken) : A.AccessToken,
      Z = A.RefreshToken ? this.mergeRemovalsDict(A.RefreshToken, Q.RefreshToken) : A.RefreshToken,
      Y = A.IdToken ? this.mergeRemovalsDict(A.IdToken, Q.IdToken) : A.IdToken,
      J = A.AppMetadata ? this.mergeRemovalsDict(A.AppMetadata, Q.AppMetadata) : A.AppMetadata;
    return {
      ...A,
      Account: B,
      AccessToken: G,
      RefreshToken: Z,
      IdToken: Y,
      AppMetadata: J
    }
  }
  mergeRemovalsDict(A, Q) {
    let B = {
      ...A
    };
    return Object.keys(A).forEach((G) => {
      if (!Q || !Q.hasOwnProperty(G)) delete B[G]
    }), B
  }
  overlayDefaults(A) {
    return this.logger.trace("Overlaying input cache with the default cache"), {
      Account: {
        ...ASA.Account,
        ...A.Account
      },
      IdToken: {
        ...ASA.IdToken,
        ...A.IdToken
      },
      AccessToken: {
        ...ASA.AccessToken,
        ...A.AccessToken
      },
      RefreshToken: {
        ...ASA.RefreshToken,
        ...A.RefreshToken
      },
      AppMetadata: {
        ...ASA.AppMetadata,
        ...A.AppMetadata
      }
    }
  }
}
// @from(Ln 234996, Col 4)
ASA
// @from(Ln 234997, Col 4)
F70 = w(() => {
  $81();
  xG();
  A81();
  K31();
  ePA();
  K70(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  ASA = {
    Account: {},
    IdToken: {},
    AccessToken: {},
    RefreshToken: {},
    AppMetadata: {}
  }
})
// @from(Ln 235012, Col 4)
H70 = U((rBZ, clB) => {
  var C81 = dk().Buffer,
    kg8 = NA("stream"),
    bg8 = NA("util");

  function U81(A) {
    if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = C81.alloc(0), this;
    if (typeof A.pipe === "function") return this.buffer = C81.alloc(0), A.pipe(this), this;
    if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function () {
      this.emit("end", A), this.readable = !1, this.emit("close")
    }.bind(this)), this;
    throw TypeError("Unexpected data type (" + typeof A + ")")
  }
  bg8.inherits(U81, kg8);
  U81.prototype.write = function (Q) {
    this.buffer = C81.concat([this.buffer, C81.from(Q)]), this.emit("data", Q)
  };
  U81.prototype.end = function (Q) {
    if (Q) this.write(Q);
    this.emit("end", Q), this.emit("close"), this.writable = !1, this.readable = !1
  };
  clB.exports = U81
})
// @from(Ln 235035, Col 4)
C70 = U((sBZ, tlB) => {
  var dWA = dk().Buffer,
    L_ = NA("crypto"),
    llB = C61(),
    plB = NA("util"),
    fg8 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
    BSA = "secret must be a string or buffer",
    mWA = "key must be a string or a buffer",
    hg8 = "key must be a string, a buffer or an object",
    z70 = typeof L_.createPublicKey === "function";
  if (z70) mWA += " or a KeyObject", BSA += "or a KeyObject";

  function ilB(A) {
    if (dWA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (!z70) throw GS(mWA);
    if (typeof A !== "object") throw GS(mWA);
    if (typeof A.type !== "string") throw GS(mWA);
    if (typeof A.asymmetricKeyType !== "string") throw GS(mWA);
    if (typeof A.export !== "function") throw GS(mWA)
  }

  function nlB(A) {
    if (dWA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (typeof A === "object") return;
    throw GS(hg8)
  }

  function gg8(A) {
    if (dWA.isBuffer(A)) return;
    if (typeof A === "string") return A;
    if (!z70) throw GS(BSA);
    if (typeof A !== "object") throw GS(BSA);
    if (A.type !== "secret") throw GS(BSA);
    if (typeof A.export !== "function") throw GS(BSA)
  }

  function $70(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function alB(A) {
    A = A.toString();
    var Q = 4 - A.length % 4;
    if (Q !== 4)
      for (var B = 0; B < Q; ++B) A += "=";
    return A.replace(/\-/g, "+").replace(/_/g, "/")
  }

  function GS(A) {
    var Q = [].slice.call(arguments, 1),
      B = plB.format.bind(plB, A).apply(null, Q);
    return TypeError(B)
  }

  function ug8(A) {
    return dWA.isBuffer(A) || typeof A === "string"
  }

  function GSA(A) {
    if (!ug8(A)) A = JSON.stringify(A);
    return A
  }

  function olB(A) {
    return function (B, G) {
      gg8(G), B = GSA(B);
      var Z = L_.createHmac("sha" + A, G),
        Y = (Z.update(B), Z.digest("base64"));
      return $70(Y)
    }
  }
  var E70, mg8 = "timingSafeEqual" in L_ ? function (Q, B) {
    if (Q.byteLength !== B.byteLength) return !1;
    return L_.timingSafeEqual(Q, B)
  } : function (Q, B) {
    if (!E70) E70 = W60();
    return E70(Q, B)
  };

  function dg8(A) {
    return function (B, G, Z) {
      var Y = olB(A)(B, Z);
      return mg8(dWA.from(G), dWA.from(Y))
    }
  }

  function rlB(A) {
    return function (B, G) {
      nlB(G), B = GSA(B);
      var Z = L_.createSign("RSA-SHA" + A),
        Y = (Z.update(B), Z.sign(G, "base64"));
      return $70(Y)
    }
  }

  function slB(A) {
    return function (B, G, Z) {
      ilB(Z), B = GSA(B), G = alB(G);
      var Y = L_.createVerify("RSA-SHA" + A);
      return Y.update(B), Y.verify(Z, G, "base64")
    }
  }

  function cg8(A) {
    return function (B, G) {
      nlB(G), B = GSA(B);
      var Z = L_.createSign("RSA-SHA" + A),
        Y = (Z.update(B), Z.sign({
          key: G,
          padding: L_.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: L_.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
      return $70(Y)
    }
  }

  function pg8(A) {
    return function (B, G, Z) {
      ilB(Z), B = GSA(B), G = alB(G);
      var Y = L_.createVerify("RSA-SHA" + A);
      return Y.update(B), Y.verify({
        key: Z,
        padding: L_.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: L_.constants.RSA_PSS_SALTLEN_DIGEST
      }, G, "base64")
    }
  }

  function lg8(A) {
    var Q = rlB(A);
    return function () {
      var G = Q.apply(null, arguments);
      return G = llB.derToJose(G, "ES" + A), G
    }
  }

  function ig8(A) {
    var Q = slB(A);
    return function (G, Z, Y) {
      Z = llB.joseToDer(Z, "ES" + A).toString("base64");
      var J = Q(G, Z, Y);
      return J
    }
  }

  function ng8() {
    return function () {
      return ""
    }
  }

  function ag8() {
    return function (Q, B) {
      return B === ""
    }
  }
  tlB.exports = function (Q) {
    var B = {
        hs: olB,
        rs: rlB,
        ps: cg8,
        es: lg8,
        none: ng8
      },
      G = {
        hs: dg8,
        rs: slB,
        ps: pg8,
        es: ig8,
        none: ag8
      },
      Z = Q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
    if (!Z) throw GS(fg8, Q);
    var Y = (Z[1] || Z[3]).toLowerCase(),
      J = Z[2];
    return {
      sign: B[Y](J),
      verify: G[Y](J)
    }
  }
})
// @from(Ln 235220, Col 4)
U70 = U((tBZ, elB) => {
  var og8 = NA("buffer").Buffer;
  elB.exports = function (Q) {
    if (typeof Q === "string") return Q;
    if (typeof Q === "number" || og8.isBuffer(Q)) return Q.toString();
    return JSON.stringify(Q)
  }
})
// @from(Ln 235228, Col 4)
YiB = U((eBZ, ZiB) => {
  var rg8 = dk().Buffer,
    AiB = H70(),
    sg8 = C70(),
    tg8 = NA("stream"),
    QiB = U70(),
    q70 = NA("util");

  function BiB(A, Q) {
    return rg8.from(A, Q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function eg8(A, Q, B) {
    B = B || "utf8";
    var G = BiB(QiB(A), "binary"),
      Z = BiB(QiB(Q), B);
    return q70.format("%s.%s", G, Z)
  }

  function GiB(A) {
    var {
      header: Q,
      payload: B
    } = A, G = A.secret || A.privateKey, Z = A.encoding, Y = sg8(Q.alg), J = eg8(Q, B, Z), X = Y.sign(J, G);
    return q70.format("%s.%s", J, X)
  }

  function q81(A) {
    var Q = A.secret || A.privateKey || A.key,
      B = new AiB(Q);
    this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = B, this.payload = new AiB(A.payload), this.secret.once("close", function () {
      if (!this.payload.writable && this.readable) this.sign()
    }.bind(this)), this.payload.once("close", function () {
      if (!this.secret.writable && this.readable) this.sign()
    }.bind(this))
  }
  q70.inherits(q81, tg8);
  q81.prototype.sign = function () {
    try {
      var Q = GiB({
        header: this.header,
        payload: this.payload.buffer,
        secret: this.secret.buffer,
        encoding: this.encoding
      });
      return this.emit("done", Q), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (B) {
      this.readable = !1, this.emit("error", B), this.emit("close")
    }
  };
  q81.sign = GiB;
  ZiB.exports = q81
})
// @from(Ln 235281, Col 4)
EiB = U((A2Z, HiB) => {
  var XiB = dk().Buffer,
    JiB = H70(),
    Au8 = C70(),
    Qu8 = NA("stream"),
    IiB = U70(),
    Bu8 = NA("util"),
    Gu8 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

  function Zu8(A) {
    return Object.prototype.toString.call(A) === "[object Object]"
  }

  function Yu8(A) {
    if (Zu8(A)) return A;
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }

  function DiB(A) {
    var Q = A.split(".", 1)[0];
    return Yu8(XiB.from(Q, "base64").toString("binary"))
  }

  function Ju8(A) {
    return A.split(".", 2).join(".")
  }

  function WiB(A) {
    return A.split(".")[2]
  }

  function Xu8(A, Q) {
    Q = Q || "utf8";
    var B = A.split(".")[1];
    return XiB.from(B, "base64").toString(Q)
  }

  function KiB(A) {
    return Gu8.test(A) && !!DiB(A)
  }

  function ViB(A, Q, B) {
    if (!Q) {
      var G = Error("Missing algorithm parameter for jws.verify");
      throw G.code = "MISSING_ALGORITHM", G
    }
    A = IiB(A);
    var Z = WiB(A),
      Y = Ju8(A),
      J = Au8(Q);
    return J.verify(Y, Z, B)
  }

  function FiB(A, Q) {
    if (Q = Q || {}, A = IiB(A), !KiB(A)) return null;
    var B = DiB(A);
    if (!B) return null;
    var G = Xu8(A);
    if (B.typ === "JWT" || Q.json) G = JSON.parse(G, Q.encoding);
    return {
      header: B,
      payload: G,
      signature: WiB(A)
    }
  }

  function cWA(A) {
    A = A || {};
    var Q = A.secret || A.publicKey || A.key,
      B = new JiB(Q);
    this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = B, this.signature = new JiB(A.signature), this.secret.once("close", function () {
      if (!this.signature.writable && this.readable) this.verify()
    }.bind(this)), this.signature.once("close", function () {
      if (!this.secret.writable && this.readable) this.verify()
    }.bind(this))
  }
  Bu8.inherits(cWA, Qu8);
  cWA.prototype.verify = function () {
    try {
      var Q = ViB(this.signature.buffer, this.algorithm, this.key.buffer),
        B = FiB(this.signature.buffer, this.encoding);
      return this.emit("done", Q, B), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (G) {
      this.readable = !1, this.emit("error", G), this.emit("close")
    }
  };
  cWA.decode = FiB;
  cWA.isValid = KiB;
  cWA.verify = ViB;
  HiB.exports = cWA
})
// @from(Ln 235376, Col 4)
w81 = U((Du8) => {
  var ziB = YiB(),
    N81 = EiB(),
    Iu8 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
  Du8.ALGORITHMS = Iu8;
  Du8.sign = ziB.sign;
  Du8.verify = N81.verify;
  Du8.decode = N81.decode;
  Du8.isValid = N81.isValid;
  Du8.createSign = function (Q) {
    return new ziB(Q)
  };
  Du8.createVerify = function (Q) {
    return new N81(Q)
  }
})
// @from(Ln 235392, Col 4)
N70 = U((B2Z, $iB) => {
  var $u8 = w81();
  $iB.exports = function (A, Q) {
    Q = Q || {};
    var B = $u8.decode(A, Q);
    if (!B) return null;
    var G = B.payload;
    if (typeof G === "string") try {
      var Z = JSON.parse(G);
      if (Z !== null && typeof Z === "object") G = Z
    } catch (Y) {}
    if (Q.complete === !0) return {
      header: B.header,
      payload: G,
      signature: B.signature
    };
    return G
  }
})
// @from(Ln 235411, Col 4)
ZSA = U((G2Z, CiB) => {
  var L81 = function (A, Q) {
    if (Error.call(this, A), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    if (this.name = "JsonWebTokenError", this.message = A, Q) this.inner = Q
  };
  L81.prototype = Object.create(Error.prototype);
  L81.prototype.constructor = L81;
  CiB.exports = L81
})
// @from(Ln 235420, Col 4)
w70 = U((Z2Z, qiB) => {
  var UiB = ZSA(),
    O81 = function (A, Q) {
      UiB.call(this, A), this.name = "NotBeforeError", this.date = Q
    };
  O81.prototype = Object.create(UiB.prototype);
  O81.prototype.constructor = O81;
  qiB.exports = O81
})
// @from(Ln 235429, Col 4)
L70 = U((Y2Z, wiB) => {
  var NiB = ZSA(),
    M81 = function (A, Q) {
      NiB.call(this, A), this.name = "TokenExpiredError", this.expiredAt = Q
    };
  M81.prototype = Object.create(NiB.prototype);
  M81.prototype.constructor = M81;
  wiB.exports = M81
})
// @from(Ln 235438, Col 4)
O70 = U((J2Z, LiB) => {
  var Cu8 = XL1();
  LiB.exports = function (A, Q) {
    var B = Q || Math.floor(Date.now() / 1000);
    if (typeof A === "string") {
      var G = Cu8(A);
      if (typeof G > "u") return;
      return Math.floor(B + G / 1000)
    } else if (typeof A === "number") return B + A;
    else return
  }
})
// @from(Ln 235450, Col 4)
YSA = U((X2Z, OiB) => {
  var Uu8 = Number.MAX_SAFE_INTEGER || 9007199254740991,
    qu8 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
  OiB.exports = {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: Uu8,
    RELEASE_TYPES: qu8,
    SEMVER_SPEC_VERSION: "2.0.0",
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }
})
// @from(Ln 235464, Col 4)
JSA = U((I2Z, MiB) => {
  var Nu8 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
  MiB.exports = Nu8
})
// @from(Ln 235468, Col 4)
pWA = U((Qb, RiB) => {
  var {
    MAX_SAFE_COMPONENT_LENGTH: M70,
    MAX_SAFE_BUILD_LENGTH: wu8,
    MAX_LENGTH: Lu8
  } = YSA(), Ou8 = JSA();
  Qb = RiB.exports = {};
  var Mu8 = Qb.re = [],
    Ru8 = Qb.safeRe = [],
    h2 = Qb.src = [],
    _u8 = Qb.safeSrc = [],
    g2 = Qb.t = {},
    ju8 = 0,
    R70 = "[a-zA-Z0-9-]",
    Tu8 = [
      ["\\s", 1],
      ["\\d", Lu8],
      [R70, wu8]
    ],
    Pu8 = (A) => {
      for (let [Q, B] of Tu8) A = A.split(`${Q}*`).join(`${Q}{0,${B}}`).split(`${Q}+`).join(`${Q}{1,${B}}`);
      return A
    },
    q3 = (A, Q, B) => {
      let G = Pu8(Q),
        Z = ju8++;
      Ou8(A, Z, Q), g2[A] = Z, h2[Z] = Q, _u8[Z] = G, Mu8[Z] = new RegExp(Q, B ? "g" : void 0), Ru8[Z] = new RegExp(G, B ? "g" : void 0)
    };
  q3("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  q3("NUMERICIDENTIFIERLOOSE", "\\d+");
  q3("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${R70}*`);
  q3("MAINVERSION", `(${h2[g2.NUMERICIDENTIFIER]})\\.(${h2[g2.NUMERICIDENTIFIER]})\\.(${h2[g2.NUMERICIDENTIFIER]})`);
  q3("MAINVERSIONLOOSE", `(${h2[g2.NUMERICIDENTIFIERLOOSE]})\\.(${h2[g2.NUMERICIDENTIFIERLOOSE]})\\.(${h2[g2.NUMERICIDENTIFIERLOOSE]})`);
  q3("PRERELEASEIDENTIFIER", `(?:${h2[g2.NUMERICIDENTIFIER]}|${h2[g2.NONNUMERICIDENTIFIER]})`);
  q3("PRERELEASEIDENTIFIERLOOSE", `(?:${h2[g2.NUMERICIDENTIFIERLOOSE]}|${h2[g2.NONNUMERICIDENTIFIER]})`);
  q3("PRERELEASE", `(?:-(${h2[g2.PRERELEASEIDENTIFIER]}(?:\\.${h2[g2.PRERELEASEIDENTIFIER]})*))`);
  q3("PRERELEASELOOSE", `(?:-?(${h2[g2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${h2[g2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  q3("BUILDIDENTIFIER", `${R70}+`);
  q3("BUILD", `(?:\\+(${h2[g2.BUILDIDENTIFIER]}(?:\\.${h2[g2.BUILDIDENTIFIER]})*))`);
  q3("FULLPLAIN", `v?${h2[g2.MAINVERSION]}${h2[g2.PRERELEASE]}?${h2[g2.BUILD]}?`);
  q3("FULL", `^${h2[g2.FULLPLAIN]}$`);
  q3("LOOSEPLAIN", `[v=\\s]*${h2[g2.MAINVERSIONLOOSE]}${h2[g2.PRERELEASELOOSE]}?${h2[g2.BUILD]}?`);
  q3("LOOSE", `^${h2[g2.LOOSEPLAIN]}$`);
  q3("GTLT", "((?:<|>)?=?)");
  q3("XRANGEIDENTIFIERLOOSE", `${h2[g2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  q3("XRANGEIDENTIFIER", `${h2[g2.NUMERICIDENTIFIER]}|x|X|\\*`);
  q3("XRANGEPLAIN", `[v=\\s]*(${h2[g2.XRANGEIDENTIFIER]})(?:\\.(${h2[g2.XRANGEIDENTIFIER]})(?:\\.(${h2[g2.XRANGEIDENTIFIER]})(?:${h2[g2.PRERELEASE]})?${h2[g2.BUILD]}?)?)?`);
  q3("XRANGEPLAINLOOSE", `[v=\\s]*(${h2[g2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${h2[g2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${h2[g2.XRANGEIDENTIFIERLOOSE]})(?:${h2[g2.PRERELEASELOOSE]})?${h2[g2.BUILD]}?)?)?`);
  q3("XRANGE", `^${h2[g2.GTLT]}\\s*${h2[g2.XRANGEPLAIN]}$`);
  q3("XRANGELOOSE", `^${h2[g2.GTLT]}\\s*${h2[g2.XRANGEPLAINLOOSE]}$`);
  q3("COERCEPLAIN", `(^|[^\\d])(\\d{1,${M70}})(?:\\.(\\d{1,${M70}}))?(?:\\.(\\d{1,${M70}}))?`);
  q3("COERCE", `${h2[g2.COERCEPLAIN]}(?:$|[^\\d])`);
  q3("COERCEFULL", h2[g2.COERCEPLAIN] + `(?:${h2[g2.PRERELEASE]})?(?:${h2[g2.BUILD]})?(?:$|[^\\d])`);
  q3("COERCERTL", h2[g2.COERCE], !0);
  q3("COERCERTLFULL", h2[g2.COERCEFULL], !0);
  q3("LONETILDE", "(?:~>?)");
  q3("TILDETRIM", `(\\s*)${h2[g2.LONETILDE]}\\s+`, !0);
  Qb.tildeTrimReplace = "$1~";
  q3("TILDE", `^${h2[g2.LONETILDE]}${h2[g2.XRANGEPLAIN]}$`);
  q3("TILDELOOSE", `^${h2[g2.LONETILDE]}${h2[g2.XRANGEPLAINLOOSE]}$`);
  q3("LONECARET", "(?:\\^)");
  q3("CARETTRIM", `(\\s*)${h2[g2.LONECARET]}\\s+`, !0);
  Qb.caretTrimReplace = "$1^";
  q3("CARET", `^${h2[g2.LONECARET]}${h2[g2.XRANGEPLAIN]}$`);
  q3("CARETLOOSE", `^${h2[g2.LONECARET]}${h2[g2.XRANGEPLAINLOOSE]}$`);
  q3("COMPARATORLOOSE", `^${h2[g2.GTLT]}\\s*(${h2[g2.LOOSEPLAIN]})$|^$`);
  q3("COMPARATOR", `^${h2[g2.GTLT]}\\s*(${h2[g2.FULLPLAIN]})$|^$`);
  q3("COMPARATORTRIM", `(\\s*)${h2[g2.GTLT]}\\s*(${h2[g2.LOOSEPLAIN]}|${h2[g2.XRANGEPLAIN]})`, !0);
  Qb.comparatorTrimReplace = "$1$2$3";
  q3("HYPHENRANGE", `^\\s*(${h2[g2.XRANGEPLAIN]})\\s+-\\s+(${h2[g2.XRANGEPLAIN]})\\s*$`);
  q3("HYPHENRANGELOOSE", `^\\s*(${h2[g2.XRANGEPLAINLOOSE]})\\s+-\\s+(${h2[g2.XRANGEPLAINLOOSE]})\\s*$`);
  q3("STAR", "(<|>)?=?\\s*\\*");
  q3("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  q3("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 235543, Col 4)
R81 = U((D2Z, _iB) => {
  var Su8 = Object.freeze({
      loose: !0
    }),
    xu8 = Object.freeze({}),
    yu8 = (A) => {
      if (!A) return xu8;
      if (typeof A !== "object") return Su8;
      return A
    };
  _iB.exports = yu8
})
// @from(Ln 235555, Col 4)
_70 = U((W2Z, PiB) => {
  var jiB = /^[0-9]+$/,
    TiB = (A, Q) => {
      let B = jiB.test(A),
        G = jiB.test(Q);
      if (B && G) A = +A, Q = +Q;
      return A === Q ? 0 : B && !G ? -1 : G && !B ? 1 : A < Q ? -1 : 1
    },
    vu8 = (A, Q) => TiB(Q, A);
  PiB.exports = {
    compareIdentifiers: TiB,
    rcompareIdentifiers: vu8
  }
})
// @from(Ln 235569, Col 4)
bz = U((K2Z, viB) => {
  var _81 = JSA(),
    {
      MAX_LENGTH: SiB,
      MAX_SAFE_INTEGER: j81
    } = YSA(),
    {
      safeRe: xiB,
      safeSrc: yiB,
      t: T81
    } = pWA(),
    ku8 = R81(),
    {
      compareIdentifiers: lWA
    } = _70();
  class ZS {
    constructor(A, Q) {
      if (Q = ku8(Q), A instanceof ZS)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else A = A.version;
      else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
      if (A.length > SiB) throw TypeError(`version is longer than ${SiB} characters`);
      _81("SemVer", A, Q), this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease;
      let B = A.trim().match(Q.loose ? xiB[T81.LOOSE] : xiB[T81.FULL]);
      if (!B) throw TypeError(`Invalid Version: ${A}`);
      if (this.raw = A, this.major = +B[1], this.minor = +B[2], this.patch = +B[3], this.major > j81 || this.major < 0) throw TypeError("Invalid major version");
      if (this.minor > j81 || this.minor < 0) throw TypeError("Invalid minor version");
      if (this.patch > j81 || this.patch < 0) throw TypeError("Invalid patch version");
      if (!B[4]) this.prerelease = [];
      else this.prerelease = B[4].split(".").map((G) => {
        if (/^[0-9]+$/.test(G)) {
          let Z = +G;
          if (Z >= 0 && Z < j81) return Z
        }
        return G
      });
      this.build = B[5] ? B[5].split(".") : [], this.format()
    }
    format() {
      if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
      return this.version
    }
    toString() {
      return this.version
    }
    compare(A) {
      if (_81("SemVer.compare", this.version, this.options, A), !(A instanceof ZS)) {
        if (typeof A === "string" && A === this.version) return 0;
        A = new ZS(A, this.options)
      }
      if (A.version === this.version) return 0;
      return this.compareMain(A) || this.comparePre(A)
    }
    compareMain(A) {
      if (!(A instanceof ZS)) A = new ZS(A, this.options);
      return lWA(this.major, A.major) || lWA(this.minor, A.minor) || lWA(this.patch, A.patch)
    }
    comparePre(A) {
      if (!(A instanceof ZS)) A = new ZS(A, this.options);
      if (this.prerelease.length && !A.prerelease.length) return -1;
      else if (!this.prerelease.length && A.prerelease.length) return 1;
      else if (!this.prerelease.length && !A.prerelease.length) return 0;
      let Q = 0;
      do {
        let B = this.prerelease[Q],
          G = A.prerelease[Q];
        if (_81("prerelease compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return lWA(B, G)
      } while (++Q)
    }
    compareBuild(A) {
      if (!(A instanceof ZS)) A = new ZS(A, this.options);
      let Q = 0;
      do {
        let B = this.build[Q],
          G = A.build[Q];
        if (_81("build compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return lWA(B, G)
      } while (++Q)
    }
    inc(A, Q, B) {
      if (A.startsWith("pre")) {
        if (!Q && B === !1) throw Error("invalid increment argument: identifier is empty");
        if (Q) {
          let G = new RegExp(`^${this.options.loose?yiB[T81.PRERELEASELOOSE]:yiB[T81.PRERELEASE]}$`),
            Z = `-${Q}`.match(G);
          if (!Z || Z[1] !== Q) throw Error(`invalid identifier: ${Q}`)
        }
      }
      switch (A) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", Q, B);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", Q, B);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", Q, B), this.inc("pre", Q, B);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) this.inc("patch", Q, B);
          this.inc("pre", Q, B);
          break;
        case "release":
          if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
          this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
          this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) this.patch++;
          this.prerelease = [];
          break;
        case "pre": {
          let G = Number(B) ? 1 : 0;
          if (this.prerelease.length === 0) this.prerelease = [G];
          else {
            let Z = this.prerelease.length;
            while (--Z >= 0)
              if (typeof this.prerelease[Z] === "number") this.prerelease[Z]++, Z = -2;
            if (Z === -1) {
              if (Q === this.prerelease.join(".") && B === !1) throw Error("invalid increment argument: identifier already exists");
              this.prerelease.push(G)
            }
          }
          if (Q) {
            let Z = [Q, G];
            if (B === !1) Z = [Q];
            if (lWA(this.prerelease[0], Q) === 0) {
              if (isNaN(this.prerelease[1])) this.prerelease = Z
            } else this.prerelease = Z
          }
          break
        }
        default:
          throw Error(`invalid increment argument: ${A}`)
      }
      if (this.raw = this.format(), this.build.length) this.raw += `+${this.build.join(".")}`;
      return this
    }
  }
  viB.exports = ZS
})
// @from(Ln 235724, Col 4)
V9A = U((V2Z, biB) => {
  var kiB = bz(),
    bu8 = (A, Q, B = !1) => {
      if (A instanceof kiB) return A;
      try {
        return new kiB(A, Q)
      } catch (G) {
        if (!B) return null;
        throw G
      }
    };
  biB.exports = bu8
})
// @from(Ln 235737, Col 4)
hiB = U((F2Z, fiB) => {
  var fu8 = V9A(),
    hu8 = (A, Q) => {
      let B = fu8(A, Q);
      return B ? B.version : null
    };
  fiB.exports = hu8
})
// @from(Ln 235745, Col 4)
uiB = U((H2Z, giB) => {
  var gu8 = V9A(),
    uu8 = (A, Q) => {
      let B = gu8(A.trim().replace(/^[=v]+/, ""), Q);
      return B ? B.version : null
    };
  giB.exports = uu8
})
// @from(Ln 235753, Col 4)
ciB = U((E2Z, diB) => {
  var miB = bz(),
    mu8 = (A, Q, B, G, Z) => {
      if (typeof B === "string") Z = G, G = B, B = void 0;
      try {
        return new miB(A instanceof miB ? A.version : A, B).inc(Q, G, Z).version
      } catch (Y) {
        return null
      }
    };
  diB.exports = mu8
})
// @from(Ln 235765, Col 4)
iiB = U((z2Z, liB) => {
  var piB = V9A(),
    du8 = (A, Q) => {
      let B = piB(A, null, !0),
        G = piB(Q, null, !0),
        Z = B.compare(G);
      if (Z === 0) return null;
      let Y = Z > 0,
        J = Y ? B : G,
        X = Y ? G : B,
        I = !!J.prerelease.length;
      if (!!X.prerelease.length && !I) {
        if (!X.patch && !X.minor) return "major";
        if (X.compareMain(J) === 0) {
          if (X.minor && !X.patch) return "minor";
          return "patch"
        }
      }
      let W = I ? "pre" : "";
      if (B.major !== G.major) return W + "major";
      if (B.minor !== G.minor) return W + "minor";
      if (B.patch !== G.patch) return W + "patch";
      return "prerelease"
    };
  liB.exports = du8
})
// @from(Ln 235791, Col 4)
aiB = U(($2Z, niB) => {
  var cu8 = bz(),
    pu8 = (A, Q) => new cu8(A, Q).major;
  niB.exports = pu8
})
// @from(Ln 235796, Col 4)
riB = U((C2Z, oiB) => {
  var lu8 = bz(),
    iu8 = (A, Q) => new lu8(A, Q).minor;
  oiB.exports = iu8
})
// @from(Ln 235801, Col 4)
tiB = U((U2Z, siB) => {
  var nu8 = bz(),
    au8 = (A, Q) => new nu8(A, Q).patch;
  siB.exports = au8
})
// @from(Ln 235806, Col 4)
AnB = U((q2Z, eiB) => {
  var ou8 = V9A(),
    ru8 = (A, Q) => {
      let B = ou8(A, Q);
      return B && B.prerelease.length ? B.prerelease : null
    };
  eiB.exports = ru8
})
// @from(Ln 235814, Col 4)
O_ = U((N2Z, BnB) => {
  var QnB = bz(),
    su8 = (A, Q, B) => new QnB(A, B).compare(new QnB(Q, B));
  BnB.exports = su8
})
// @from(Ln 235819, Col 4)
ZnB = U((w2Z, GnB) => {
  var tu8 = O_(),
    eu8 = (A, Q, B) => tu8(Q, A, B);
  GnB.exports = eu8
})
// @from(Ln 235824, Col 4)
JnB = U((L2Z, YnB) => {
  var Am8 = O_(),
    Qm8 = (A, Q) => Am8(A, Q, !0);
  YnB.exports = Qm8
})