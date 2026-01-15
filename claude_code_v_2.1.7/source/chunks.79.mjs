
// @from(Ln 230116, Col 0)
function tcB(A) {
  return qPA(f80.metadata, A)
}
// @from(Ln 230120, Col 0)
function qPA(A, Q) {
  for (let B = 0; B < A.length; B++) {
    let G = A[B];
    if (G.aliases.includes(Q)) return G
  }
  return null
}
// @from(Ln 230127, Col 4)
rcB
// @from(Ln 230127, Col 9)
b80
// @from(Ln 230127, Col 14)
f80
// @from(Ln 230127, Col 19)
h80
// @from(Ln 230128, Col 4)
g80 = w(() => {
  xo();
  lY(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  rcB = {
    endpointMetadata: {
      "login.microsoftonline.com": {
        token_endpoint: "https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/token",
        jwks_uri: "https://login.microsoftonline.com/{tenantid}/discovery/v2.0/keys",
        issuer: "https://login.microsoftonline.com/{tenantid}/v2.0",
        authorization_endpoint: "https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/authorize",
        end_session_endpoint: "https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/logout"
      },
      "login.chinacloudapi.cn": {
        token_endpoint: "https://login.chinacloudapi.cn/{tenantid}/oauth2/v2.0/token",
        jwks_uri: "https://login.chinacloudapi.cn/{tenantid}/discovery/v2.0/keys",
        issuer: "https://login.partner.microsoftonline.cn/{tenantid}/v2.0",
        authorization_endpoint: "https://login.chinacloudapi.cn/{tenantid}/oauth2/v2.0/authorize",
        end_session_endpoint: "https://login.chinacloudapi.cn/{tenantid}/oauth2/v2.0/logout"
      },
      "login.microsoftonline.us": {
        token_endpoint: "https://login.microsoftonline.us/{tenantid}/oauth2/v2.0/token",
        jwks_uri: "https://login.microsoftonline.us/{tenantid}/discovery/v2.0/keys",
        issuer: "https://login.microsoftonline.us/{tenantid}/v2.0",
        authorization_endpoint: "https://login.microsoftonline.us/{tenantid}/oauth2/v2.0/authorize",
        end_session_endpoint: "https://login.microsoftonline.us/{tenantid}/oauth2/v2.0/logout"
      }
    },
    instanceDiscoveryMetadata: {
      metadata: [{
        preferred_network: "login.microsoftonline.com",
        preferred_cache: "login.windows.net",
        aliases: ["login.microsoftonline.com", "login.windows.net", "login.microsoft.com", "sts.windows.net"]
      }, {
        preferred_network: "login.partner.microsoftonline.cn",
        preferred_cache: "login.partner.microsoftonline.cn",
        aliases: ["login.partner.microsoftonline.cn", "login.chinacloudapi.cn"]
      }, {
        preferred_network: "login.microsoftonline.de",
        preferred_cache: "login.microsoftonline.de",
        aliases: ["login.microsoftonline.de"]
      }, {
        preferred_network: "login.microsoftonline.us",
        preferred_cache: "login.microsoftonline.us",
        aliases: ["login.microsoftonline.us", "login.usgovcloudapi.net"]
      }, {
        preferred_network: "login-us.microsoftonline.com",
        preferred_cache: "login-us.microsoftonline.com",
        aliases: ["login-us.microsoftonline.com"]
      }]
    }
  }, b80 = rcB.endpointMetadata, f80 = rcB.instanceDiscoveryMetadata, h80 = new Set;
  f80.metadata.forEach((A) => {
    A.aliases.forEach((Q) => {
      h80.add(Q)
    })
  })
})
// @from(Ln 230185, Col 4)
u80 = "cache_quota_exceeded"
// @from(Ln 230186, Col 2)
O31 = "cache_error_unknown"
// @from(Ln 230187, Col 4)
ecB = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 230191, Col 0)
function ApB(A) {
  if (!(A instanceof Error)) return new NPA(O31);
  if (A.name === "QuotaExceededError" || A.name === "NS_ERROR_DOM_QUOTA_REACHED" || A.message.includes("exceeded the quota")) return new NPA(u80);
  else return new NPA(A.name, A.message)
}
// @from(Ln 230196, Col 4)
m80
// @from(Ln 230196, Col 9)
NPA
// @from(Ln 230197, Col 4)
QpB = w(() => {
  U_();
  ecB(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  m80 = {
    [u80]: "Exceeded cache storage capacity.",
    [O31]: "Unexpected error occurred when using cache storage."
  };
  NPA = class NPA extends n6 {
    constructor(A, Q) {
      let B = Q || (m80[A] ? m80[A] : m80[O31]);
      super(`${A}: ${B}`);
      Object.setPrototypeOf(this, NPA.prototype), this.name = "CacheError", this.errorCode = A, this.errorMessage = B
    }
  }
})
// @from(Ln 230212, Col 0)
class t2A {
  constructor(A, Q, B, G, Z) {
    this.clientId = A, this.cryptoImpl = Q, this.commonLogger = B.clone(z31, OWA), this.staticAuthorityOptions = Z, this.performanceClient = G
  }
  getAllAccounts(A, Q) {
    return this.buildTenantProfiles(this.getAccountsFilteredBy(A, Q), Q, A)
  }
  getAccountInfoFilteredBy(A, Q) {
    if (Object.keys(A).length === 0 || Object.values(A).every((G) => !G)) return this.commonLogger.warning("getAccountInfoFilteredBy: Account filter is empty or invalid, returning null"), null;
    let B = this.getAllAccounts(A, Q);
    if (B.length > 1) return B.sort((Z) => {
      return Z.idTokenClaims ? -1 : 1
    })[0];
    else if (B.length === 1) return B[0];
    else return null
  }
  getBaseAccountInfo(A, Q) {
    let B = this.getAccountsFilteredBy(A, Q);
    if (B.length > 0) return oW.getAccountInfo(B[0]);
    else return null
  }
  buildTenantProfiles(A, Q, B) {
    return A.flatMap((G) => {
      return this.getTenantProfilesFromAccountEntity(G, Q, B?.tenantId, B)
    })
  }
  getTenantedAccountInfoByFilter(A, Q, B, G, Z) {
    let Y = null,
      J;
    if (Z) {
      if (!this.tenantProfileMatchesFilter(B, Z)) return null
    }
    let X = this.getIdToken(A, G, Q, B.tenantId);
    if (X) {
      if (J = mm(X.secret, this.cryptoImpl.base64Decode), !this.idTokenClaimsMatchTenantProfileFilter(J, Z)) return null
    }
    return Y = U31(A, B, J, X?.secret), Y
  }
  getTenantProfilesFromAccountEntity(A, Q, B, G) {
    let Z = oW.getAccountInfo(A),
      Y = Z.tenantProfiles || new Map,
      J = this.getTokenKeys();
    if (B) {
      let I = Y.get(B);
      if (I) Y = new Map([
        [B, I]
      ]);
      else return []
    }
    let X = [];
    return Y.forEach((I) => {
      let D = this.getTenantedAccountInfoByFilter(Z, J, I, Q, G);
      if (D) X.push(D)
    }), X
  }
  tenantProfileMatchesFilter(A, Q) {
    if (!!Q.localAccountId && !this.matchLocalAccountIdFromTenantProfile(A, Q.localAccountId)) return !1;
    if (!!Q.name && A.name !== Q.name) return !1;
    if (Q.isHomeTenant !== void 0 && A.isHomeTenant !== Q.isHomeTenant) return !1;
    return !0
  }
  idTokenClaimsMatchTenantProfileFilter(A, Q) {
    if (Q) {
      if (!!Q.localAccountId && !this.matchLocalAccountIdFromTokenClaims(A, Q.localAccountId)) return !1;
      if (!!Q.loginHint && !this.matchLoginHintFromTokenClaims(A, Q.loginHint)) return !1;
      if (!!Q.username && !this.matchUsername(A.preferred_username, Q.username)) return !1;
      if (!!Q.name && !this.matchName(A, Q.name)) return !1;
      if (!!Q.sid && !this.matchSid(A, Q.sid)) return !1
    }
    return !0
  }
  async saveCacheRecord(A, Q, B, G) {
    if (!A) throw YQ(f2A);
    try {
      if (A.account) await this.setAccount(A.account, Q, B);
      if (!!A.idToken && G?.idToken !== !1) await this.setIdTokenCredential(A.idToken, Q, B);
      if (!!A.accessToken && G?.accessToken !== !1) await this.saveAccessToken(A.accessToken, Q, B);
      if (!!A.refreshToken && G?.refreshToken !== !1) await this.setRefreshTokenCredential(A.refreshToken, Q, B);
      if (A.appMetadata) this.setAppMetadata(A.appMetadata, Q)
    } catch (Z) {
      if (this.commonLogger?.error("CacheManager.saveCacheRecord: failed"), Z instanceof n6) throw Z;
      else throw ApB(Z)
    }
  }
  async saveAccessToken(A, Q, B) {
    let G = {
        clientId: A.clientId,
        credentialType: A.credentialType,
        environment: A.environment,
        homeAccountId: A.homeAccountId,
        realm: A.realm,
        tokenType: A.tokenType,
        requestedClaimsHash: A.requestedClaimsHash
      },
      Z = this.getTokenKeys(),
      Y = aI.fromString(A.target);
    Z.accessToken.forEach((J) => {
      if (!this.accessTokenKeyMatchesFilter(J, G, !1)) return;
      let X = this.getAccessTokenCredential(J, Q);
      if (X && this.credentialMatchesFilter(X, G)) {
        if (aI.fromString(X.target).intersectingScopeSets(Y)) this.removeAccessToken(J, Q)
      }
    }), await this.setAccessTokenCredential(A, Q, B)
  }
  getAccountsFilteredBy(A, Q) {
    let B = this.getAccountKeys(),
      G = [];
    return B.forEach((Z) => {
      let Y = this.getAccount(Z, Q);
      if (!Y) return;
      if (!!A.homeAccountId && !this.matchHomeAccountId(Y, A.homeAccountId)) return;
      if (!!A.username && !this.matchUsername(Y.username, A.username)) return;
      if (!!A.environment && !this.matchEnvironment(Y, A.environment)) return;
      if (!!A.realm && !this.matchRealm(Y, A.realm)) return;
      if (!!A.nativeAccountId && !this.matchNativeAccountId(Y, A.nativeAccountId)) return;
      if (!!A.authorityType && !this.matchAuthorityType(Y, A.authorityType)) return;
      let J = {
          localAccountId: A?.localAccountId,
          name: A?.name
        },
        X = Y.tenantProfiles?.filter((I) => {
          return this.tenantProfileMatchesFilter(I, J)
        });
      if (X && X.length === 0) return;
      G.push(Y)
    }), G
  }
  credentialMatchesFilter(A, Q) {
    if (!!Q.clientId && !this.matchClientId(A, Q.clientId)) return !1;
    if (!!Q.userAssertionHash && !this.matchUserAssertionHash(A, Q.userAssertionHash)) return !1;
    if (typeof Q.homeAccountId === "string" && !this.matchHomeAccountId(A, Q.homeAccountId)) return !1;
    if (!!Q.environment && !this.matchEnvironment(A, Q.environment)) return !1;
    if (!!Q.realm && !this.matchRealm(A, Q.realm)) return !1;
    if (!!Q.credentialType && !this.matchCredentialType(A, Q.credentialType)) return !1;
    if (!!Q.familyId && !this.matchFamilyId(A, Q.familyId)) return !1;
    if (!!Q.target && !this.matchTarget(A, Q.target)) return !1;
    if (Q.requestedClaimsHash || A.requestedClaimsHash) {
      if (A.requestedClaimsHash !== Q.requestedClaimsHash) return !1
    }
    if (A.credentialType === SG.ACCESS_TOKEN_WITH_AUTH_SCHEME) {
      if (!!Q.tokenType && !this.matchTokenType(A, Q.tokenType)) return !1;
      if (Q.tokenType === J5.SSH) {
        if (Q.keyId && !this.matchKeyId(A, Q.keyId)) return !1
      }
    }
    return !0
  }
  getAppMetadataFilteredBy(A) {
    let Q = this.getKeys(),
      B = {};
    return Q.forEach((G) => {
      if (!this.isAppMetadata(G)) return;
      let Z = this.getAppMetadata(G);
      if (!Z) return;
      if (!!A.environment && !this.matchEnvironment(Z, A.environment)) return;
      if (!!A.clientId && !this.matchClientId(Z, A.clientId)) return;
      B[G] = Z
    }), B
  }
  getAuthorityMetadataByAlias(A) {
    let Q = this.getAuthorityMetadataKeys(),
      B = null;
    return Q.forEach((G) => {
      if (!this.isAuthorityMetadata(G) || G.indexOf(this.clientId) === -1) return;
      let Z = this.getAuthorityMetadata(G);
      if (!Z) return;
      if (Z.aliases.indexOf(A) === -1) return;
      B = Z
    }), B
  }
  removeAllAccounts(A) {
    this.getAllAccounts({}, A).forEach((B) => {
      this.removeAccount(B, A)
    })
  }
  removeAccount(A, Q) {
    this.removeAccountContext(A, Q);
    let B = this.getAccountKeys(),
      G = (Z) => {
        return Z.includes(A.homeAccountId) && Z.includes(A.environment)
      };
    B.filter(G).forEach((Z) => {
      this.removeItem(Z, Q), this.performanceClient.incrementFields({
        accountsRemoved: 1
      }, Q)
    })
  }
  removeAccountContext(A, Q) {
    let B = this.getTokenKeys(),
      G = (Z) => {
        return Z.includes(A.homeAccountId) && Z.includes(A.environment)
      };
    B.idToken.filter(G).forEach((Z) => {
      this.removeIdToken(Z, Q)
    }), B.accessToken.filter(G).forEach((Z) => {
      this.removeAccessToken(Z, Q)
    }), B.refreshToken.filter(G).forEach((Z) => {
      this.removeRefreshToken(Z, Q)
    })
  }
  removeAccessToken(A, Q) {
    let B = this.getAccessTokenCredential(A, Q);
    if (this.removeItem(A, Q), this.performanceClient.incrementFields({
        accessTokensRemoved: 1
      }, Q), !B || B.credentialType.toLowerCase() !== SG.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase() || B.tokenType !== J5.POP) return;
    let G = B.keyId;
    if (G) this.cryptoImpl.removeTokenBindingKey(G).catch(() => {
      this.commonLogger.error(`Failed to remove token binding key ${G}`, Q), this.performanceClient?.incrementFields({
        removeTokenBindingKeyFailure: 1
      }, Q)
    })
  }
  removeAppMetadata(A) {
    return this.getKeys().forEach((B) => {
      if (this.isAppMetadata(B)) this.removeItem(B, A)
    }), !0
  }
  getIdToken(A, Q, B, G, Z) {
    this.commonLogger.trace("CacheManager - getIdToken called");
    let Y = {
        homeAccountId: A.homeAccountId,
        environment: A.environment,
        credentialType: SG.ID_TOKEN,
        clientId: this.clientId,
        realm: G
      },
      J = this.getIdTokensByFilter(Y, Q, B),
      X = J.size;
    if (X < 1) return this.commonLogger.info("CacheManager:getIdToken - No token found"), null;
    else if (X > 1) {
      let I = J;
      if (!G) {
        let D = new Map;
        J.forEach((K, V) => {
          if (K.realm === A.tenantId) D.set(V, K)
        });
        let W = D.size;
        if (W < 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result"), J.values().next().value;
        else if (W === 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile"), D.values().next().value;
        else I = D
      }
      if (this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them"), I.forEach((D, W) => {
          this.removeIdToken(W, Q)
        }), Z && Q) Z.addFields({
        multiMatchedID: J.size
      }, Q);
      return null
    }
    return this.commonLogger.info("CacheManager:getIdToken - Returning ID token"), J.values().next().value
  }
  getIdTokensByFilter(A, Q, B) {
    let G = B && B.idToken || this.getTokenKeys().idToken,
      Z = new Map;
    return G.forEach((Y) => {
      if (!this.idTokenKeyMatchesFilter(Y, {
          clientId: this.clientId,
          ...A
        })) return;
      let J = this.getIdTokenCredential(Y, Q);
      if (J && this.credentialMatchesFilter(J, A)) Z.set(Y, J)
    }), Z
  }
  idTokenKeyMatchesFilter(A, Q) {
    let B = A.toLowerCase();
    if (Q.clientId && B.indexOf(Q.clientId.toLowerCase()) === -1) return !1;
    if (Q.homeAccountId && B.indexOf(Q.homeAccountId.toLowerCase()) === -1) return !1;
    return !0
  }
  removeIdToken(A, Q) {
    this.removeItem(A, Q)
  }
  removeRefreshToken(A, Q) {
    this.removeItem(A, Q)
  }
  getAccessToken(A, Q, B, G) {
    let Z = Q.correlationId;
    this.commonLogger.trace("CacheManager - getAccessToken called", Z);
    let Y = aI.createSearchScopes(Q.scopes),
      J = Q.authenticationScheme || J5.BEARER,
      X = J && J.toLowerCase() !== J5.BEARER.toLowerCase() ? SG.ACCESS_TOKEN_WITH_AUTH_SCHEME : SG.ACCESS_TOKEN,
      I = {
        homeAccountId: A.homeAccountId,
        environment: A.environment,
        credentialType: X,
        clientId: this.clientId,
        realm: G || A.tenantId,
        target: Y,
        tokenType: J,
        keyId: Q.sshKid,
        requestedClaimsHash: Q.requestedClaimsHash
      },
      D = B && B.accessToken || this.getTokenKeys().accessToken,
      W = [];
    D.forEach((V) => {
      if (this.accessTokenKeyMatchesFilter(V, I, !0)) {
        let F = this.getAccessTokenCredential(V, Z);
        if (F && this.credentialMatchesFilter(F, I)) W.push(F)
      }
    });
    let K = W.length;
    if (K < 1) return this.commonLogger.info("CacheManager:getAccessToken - No token found", Z), null;
    else if (K > 1) return this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them", Z), W.forEach((V) => {
      this.removeAccessToken(this.generateCredentialKey(V), Z)
    }), this.performanceClient.addFields({
      multiMatchedAT: W.length
    }, Z), null;
    return this.commonLogger.info("CacheManager:getAccessToken - Returning access token", Z), W[0]
  }
  accessTokenKeyMatchesFilter(A, Q, B) {
    let G = A.toLowerCase();
    if (Q.clientId && G.indexOf(Q.clientId.toLowerCase()) === -1) return !1;
    if (Q.homeAccountId && G.indexOf(Q.homeAccountId.toLowerCase()) === -1) return !1;
    if (Q.realm && G.indexOf(Q.realm.toLowerCase()) === -1) return !1;
    if (Q.requestedClaimsHash && G.indexOf(Q.requestedClaimsHash.toLowerCase()) === -1) return !1;
    if (Q.target) {
      let Z = Q.target.asArray();
      for (let Y = 0; Y < Z.length; Y++)
        if (B && !G.includes(Z[Y].toLowerCase())) return !1;
        else if (!B && G.includes(Z[Y].toLowerCase())) return !0
    }
    return !0
  }
  getAccessTokensByFilter(A, Q) {
    let B = this.getTokenKeys(),
      G = [];
    return B.accessToken.forEach((Z) => {
      if (!this.accessTokenKeyMatchesFilter(Z, A, !0)) return;
      let Y = this.getAccessTokenCredential(Z, Q);
      if (Y && this.credentialMatchesFilter(Y, A)) G.push(Y)
    }), G
  }
  getRefreshToken(A, Q, B, G, Z) {
    this.commonLogger.trace("CacheManager - getRefreshToken called");
    let Y = Q ? No : void 0,
      J = {
        homeAccountId: A.homeAccountId,
        environment: A.environment,
        credentialType: SG.REFRESH_TOKEN,
        clientId: this.clientId,
        familyId: Y
      },
      X = G && G.refreshToken || this.getTokenKeys().refreshToken,
      I = [];
    X.forEach((W) => {
      if (this.refreshTokenKeyMatchesFilter(W, J)) {
        let K = this.getRefreshTokenCredential(W, B);
        if (K && this.credentialMatchesFilter(K, J)) I.push(K)
      }
    });
    let D = I.length;
    if (D < 1) return this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found."), null;
    if (D > 1 && Z && B) Z.addFields({
      multiMatchedRT: D
    }, B);
    return this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token"), I[0]
  }
  refreshTokenKeyMatchesFilter(A, Q) {
    let B = A.toLowerCase();
    if (Q.familyId && B.indexOf(Q.familyId.toLowerCase()) === -1) return !1;
    if (!Q.familyId && Q.clientId && B.indexOf(Q.clientId.toLowerCase()) === -1) return !1;
    if (Q.homeAccountId && B.indexOf(Q.homeAccountId.toLowerCase()) === -1) return !1;
    return !0
  }
  readAppMetadataFromCache(A) {
    let Q = {
        environment: A,
        clientId: this.clientId
      },
      B = this.getAppMetadataFilteredBy(Q),
      G = Object.keys(B).map((Y) => B[Y]),
      Z = G.length;
    if (Z < 1) return null;
    else if (Z > 1) throw YQ(y2A);
    return G[0]
  }
  isAppMetadataFOCI(A) {
    let Q = this.readAppMetadataFromCache(A);
    return !!(Q && Q.familyId === No)
  }
  matchHomeAccountId(A, Q) {
    return typeof A.homeAccountId === "string" && Q === A.homeAccountId
  }
  matchLocalAccountIdFromTokenClaims(A, Q) {
    let B = A.oid || A.sub;
    return Q === B
  }
  matchLocalAccountIdFromTenantProfile(A, Q) {
    return A.localAccountId === Q
  }
  matchName(A, Q) {
    return Q.toLowerCase() === A.name?.toLowerCase()
  }
  matchUsername(A, Q) {
    return !!(A && typeof A === "string" && Q?.toLowerCase() === A.toLowerCase())
  }
  matchUserAssertionHash(A, Q) {
    return !!(A.userAssertionHash && Q === A.userAssertionHash)
  }
  matchEnvironment(A, Q) {
    if (this.staticAuthorityOptions) {
      let G = scB(this.staticAuthorityOptions, this.commonLogger);
      if (G.includes(Q) && G.includes(A.environment)) return !0
    }
    let B = this.getAuthorityMetadataByAlias(Q);
    if (B && B.aliases.indexOf(A.environment) > -1) return !0;
    return !1
  }
  matchCredentialType(A, Q) {
    return A.credentialType && Q.toLowerCase() === A.credentialType.toLowerCase()
  }
  matchClientId(A, Q) {
    return !!(A.clientId && Q === A.clientId)
  }
  matchFamilyId(A, Q) {
    return !!(A.familyId && Q === A.familyId)
  }
  matchRealm(A, Q) {
    return A.realm?.toLowerCase() === Q.toLowerCase()
  }
  matchNativeAccountId(A, Q) {
    return !!(A.nativeAccountId && Q === A.nativeAccountId)
  }
  matchLoginHintFromTokenClaims(A, Q) {
    if (A.login_hint === Q) return !0;
    if (A.preferred_username === Q) return !0;
    if (A.upn === Q) return !0;
    return !1
  }
  matchSid(A, Q) {
    return A.sid === Q
  }
  matchAuthorityType(A, Q) {
    return !!(A.authorityType && Q.toLowerCase() === A.authorityType.toLowerCase())
  }
  matchTarget(A, Q) {
    if (A.credentialType !== SG.ACCESS_TOKEN && A.credentialType !== SG.ACCESS_TOKEN_WITH_AUTH_SCHEME || !A.target) return !1;
    return aI.fromString(A.target).containsScopeSet(Q)
  }
  matchTokenType(A, Q) {
    return !!(A.tokenType && A.tokenType === Q)
  }
  matchKeyId(A, Q) {
    return !!(A.keyId && A.keyId === Q)
  }
  isAppMetadata(A) {
    return A.indexOf(uTA) !== -1
  }
  isAuthorityMetadata(A) {
    return A.indexOf(qWA.CACHE_KEY) !== -1
  }
  generateAuthorityMetadataCacheKey(A) {
    return `${qWA.CACHE_KEY}-${this.clientId}-${A}`
  }
  static toObject(A, Q) {
    for (let B in Q) A[B] = Q[B];
    return A
  }
}
// @from(Ln 230670, Col 4)
M31
// @from(Ln 230671, Col 4)
d80 = w(() => {
  lY();
  zPA();
  w31();
  aW();
  q31();
  TWA();
  $31();
  g80();
  QpB();
  U_();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  M31 = class M31 extends t2A {
    async setAccount() {
      throw YQ(o3)
    }
    getAccount() {
      throw YQ(o3)
    }
    async setIdTokenCredential() {
      throw YQ(o3)
    }
    getIdTokenCredential() {
      throw YQ(o3)
    }
    async setAccessTokenCredential() {
      throw YQ(o3)
    }
    getAccessTokenCredential() {
      throw YQ(o3)
    }
    async setRefreshTokenCredential() {
      throw YQ(o3)
    }
    getRefreshTokenCredential() {
      throw YQ(o3)
    }
    setAppMetadata() {
      throw YQ(o3)
    }
    getAppMetadata() {
      throw YQ(o3)
    }
    setServerTelemetry() {
      throw YQ(o3)
    }
    getServerTelemetry() {
      throw YQ(o3)
    }
    setAuthorityMetadata() {
      throw YQ(o3)
    }
    getAuthorityMetadata() {
      throw YQ(o3)
    }
    getAuthorityMetadataKeys() {
      throw YQ(o3)
    }
    setThrottlingCache() {
      throw YQ(o3)
    }
    getThrottlingCache() {
      throw YQ(o3)
    }
    removeItem() {
      throw YQ(o3)
    }
    getKeys() {
      throw YQ(o3)
    }
    getAccountKeys() {
      throw YQ(o3)
    }
    getTokenKeys() {
      throw YQ(o3)
    }
    generateCredentialKey() {
      throw YQ(o3)
    }
    generateAccountKey() {
      throw YQ(o3)
    }
  }
})
// @from(Ln 230755, Col 4)
N0
// @from(Ln 230755, Col 8)
HeG
// @from(Ln 230755, Col 13)
BpB
// @from(Ln 230756, Col 4)
QS = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  N0 = {
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
  }, HeG = new Map([
    [N0.AcquireTokenByCode, "ATByCode"],
    [N0.AcquireTokenByRefreshToken, "ATByRT"],
    [N0.AcquireTokenSilent, "ATS"],
    [N0.AcquireTokenSilentAsync, "ATSAsync"],
    [N0.AcquireTokenPopup, "ATPopup"],
    [N0.AcquireTokenRedirect, "ATRedirect"],
    [N0.CryptoOptsGetPublicKeyThumbprint, "CryptoGetPKThumb"],
    [N0.CryptoOptsSignJwt, "CryptoSignJwt"],
    [N0.SilentCacheClientAcquireToken, "SltCacheClientAT"],
    [N0.SilentIframeClientAcquireToken, "SltIframeClientAT"],
    [N0.SilentRefreshClientAcquireToken, "SltRClientAT"],
    [N0.SsoSilent, "SsoSlt"],
    [N0.StandardInteractionClientGetDiscoveredAuthority, "StdIntClientGetDiscAuth"],
    [N0.FetchAccountIdWithNativeBroker, "FetchAccIdWithNtvBroker"],
    [N0.NativeInteractionClientAcquireToken, "NtvIntClientAT"],
    [N0.BaseClientCreateTokenRequestHeaders, "BaseClientCreateTReqHead"],
    [N0.NetworkClientSendPostRequestAsync, "NetClientSendPost"],
    [N0.RefreshTokenClientExecutePostToTokenEndpoint, "RTClientExecPost"],
    [N0.AuthorizationCodeClientExecutePostToTokenEndpoint, "AuthCodeClientExecPost"],
    [N0.BrokerHandhshake, "BrokerHandshake"],
    [N0.AcquireTokenByRefreshTokenInBroker, "ATByRTInBroker"],
    [N0.AcquireTokenByBroker, "ATByBroker"],
    [N0.RefreshTokenClientExecuteTokenRequest, "RTClientExecTReq"],
    [N0.RefreshTokenClientAcquireToken, "RTClientAT"],
    [N0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, "RTClientATWithCachedRT"],
    [N0.RefreshTokenClientAcquireTokenByRefreshToken, "RTClientATByRT"],
    [N0.RefreshTokenClientCreateTokenRequestBody, "RTClientCreateTReqBody"],
    [N0.AcquireTokenFromCache, "ATFromCache"],
    [N0.SilentFlowClientAcquireCachedToken, "SltFlowClientATCached"],
    [N0.SilentFlowClientGenerateResultFromCacheRecord, "SltFlowClientGenResFromCache"],
    [N0.AcquireTokenBySilentIframe, "ATBySltIframe"],
    [N0.InitializeBaseRequest, "InitBaseReq"],
    [N0.InitializeSilentRequest, "InitSltReq"],
    [N0.InitializeClientApplication, "InitClientApplication"],
    [N0.InitializeCache, "InitCache"],
    [N0.ImportExistingCache, "importCache"],
    [N0.SetUserData, "setUserData"],
    [N0.LocalStorageUpdated, "localStorageUpdated"],
    [N0.SilentIframeClientTokenHelper, "SIClientTHelper"],
    [N0.SilentHandlerInitiateAuthRequest, "SHandlerInitAuthReq"],
    [N0.SilentHandlerMonitorIframeForHash, "SltHandlerMonitorIframeForHash"],
    [N0.SilentHandlerLoadFrame, "SHandlerLoadFrame"],
    [N0.SilentHandlerLoadFrameSync, "SHandlerLoadFrameSync"],
    [N0.StandardInteractionClientCreateAuthCodeClient, "StdIntClientCreateAuthCodeClient"],
    [N0.StandardInteractionClientGetClientConfiguration, "StdIntClientGetClientConf"],
    [N0.StandardInteractionClientInitializeAuthorizationRequest, "StdIntClientInitAuthReq"],
    [N0.GetAuthCodeUrl, "GetAuthCodeUrl"],
    [N0.HandleCodeResponseFromServer, "HandleCodeResFromServer"],
    [N0.HandleCodeResponse, "HandleCodeResp"],
    [N0.HandleResponseEar, "HandleRespEar"],
    [N0.HandleResponseCode, "HandleRespCode"],
    [N0.HandleResponsePlatformBroker, "HandleRespPlatBroker"],
    [N0.UpdateTokenEndpointAuthority, "UpdTEndpointAuth"],
    [N0.AuthClientAcquireToken, "AuthClientAT"],
    [N0.AuthClientExecuteTokenRequest, "AuthClientExecTReq"],
    [N0.AuthClientCreateTokenRequestBody, "AuthClientCreateTReqBody"],
    [N0.PopTokenGenerateCnf, "PopTGenCnf"],
    [N0.PopTokenGenerateKid, "PopTGenKid"],
    [N0.HandleServerTokenResponse, "HandleServerTRes"],
    [N0.DeserializeResponse, "DeserializeRes"],
    [N0.AuthorityFactoryCreateDiscoveredInstance, "AuthFactCreateDiscInst"],
    [N0.AuthorityResolveEndpointsAsync, "AuthResolveEndpointsAsync"],
    [N0.AuthorityResolveEndpointsFromLocalSources, "AuthResolveEndpointsFromLocal"],
    [N0.AuthorityGetCloudDiscoveryMetadataFromNetwork, "AuthGetCDMetaFromNet"],
    [N0.AuthorityUpdateCloudDiscoveryMetadata, "AuthUpdCDMeta"],
    [N0.AuthorityGetEndpointMetadataFromNetwork, "AuthUpdCDMetaFromNet"],
    [N0.AuthorityUpdateEndpointMetadata, "AuthUpdEndpointMeta"],
    [N0.AuthorityUpdateMetadataWithRegionalInformation, "AuthUpdMetaWithRegInfo"],
    [N0.RegionDiscoveryDetectRegion, "RegDiscDetectReg"],
    [N0.RegionDiscoveryGetRegionFromIMDS, "RegDiscGetRegFromIMDS"],
    [N0.RegionDiscoveryGetCurrentVersion, "RegDiscGetCurrentVer"],
    [N0.AcquireTokenByCodeAsync, "ATByCodeAsync"],
    [N0.GetEndpointMetadataFromNetwork, "GetEndpointMetaFromNet"],
    [N0.GetCloudDiscoveryMetadataFromNetworkMeasurement, "GetCDMetaFromNet"],
    [N0.HandleRedirectPromiseMeasurement, "HandleRedirectPromise"],
    [N0.HandleNativeRedirectPromiseMeasurement, "HandleNtvRedirectPromise"],
    [N0.UpdateCloudDiscoveryMetadataMeasurement, "UpdateCDMeta"],
    [N0.UsernamePasswordClientAcquireToken, "UserPassClientAT"],
    [N0.NativeMessageHandlerHandshake, "NtvMsgHandlerHandshake"],
    [N0.NativeGenerateAuthResult, "NtvGenAuthRes"],
    [N0.RemoveHiddenIframe, "RemoveHiddenIframe"],
    [N0.ClearTokensAndKeysWithClaims, "ClearTAndKeysWithClaims"],
    [N0.CacheManagerGetRefreshToken, "CacheManagerGetRT"],
    [N0.GeneratePkceCodes, "GenPkceCodes"],
    [N0.GenerateCodeVerifier, "GenCodeVerifier"],
    [N0.GenerateCodeChallengeFromVerifier, "GenCodeChallengeFromVerifier"],
    [N0.Sha256Digest, "Sha256Digest"],
    [N0.GetRandomValues, "GetRandomValues"],
    [N0.GenerateHKDF, "genHKDF"],
    [N0.GenerateBaseKey, "genBaseKey"],
    [N0.Base64Decode, "b64Decode"],
    [N0.UrlEncodeArr, "urlEncArr"],
    [N0.Encrypt, "encrypt"],
    [N0.Decrypt, "decrypt"],
    [N0.GenerateEarKey, "genEarKey"],
    [N0.DecryptEarResponse, "decryptEarResp"]
  ]), BpB = {
    NotStarted: 0,
    InProgress: 1,
    Completed: 2
  }
})
// @from(Ln 230961, Col 0)
class c80 {
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
// @from(Ln 230972, Col 0)
class PWA {
  generateId() {
    return "callback-id"
  }
  startMeasurement(A, Q) {
    return {
      end: () => null,
      discard: () => {},
      add: () => {},
      increment: () => {},
      event: {
        eventId: this.generateId(),
        status: BpB.InProgress,
        authority: "",
        libraryName: "",
        libraryVersion: "",
        clientId: "",
        name: A,
        startTimeMs: Date.now(),
        correlationId: Q || ""
      },
      measurement: new c80
    }
  }
  startPerformanceMeasurement() {
    return new c80
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
// @from(Ln 231033, Col 4)
p80 = w(() => {
  QS(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231037, Col 0)
function GpB({
  authOptions: A,
  systemOptions: Q,
  loggerOptions: B,
  cacheOptions: G,
  storageInterface: Z,
  networkInterface: Y,
  cryptoInterface: J,
  clientCredentials: X,
  libraryInfo: I,
  telemetry: D,
  serverTelemetryManager: W,
  persistencePlugin: K,
  serializableCache: V
}) {
  let F = {
    ...zf8,
    ...B
  };
  return {
    authOptions: Lf8(A),
    systemOptions: {
      ...Ef8,
      ...Q
    },
    loggerOptions: F,
    cacheOptions: {
      ...$f8,
      ...G
    },
    storageInterface: Z || new M31(A.clientId, LWA, new FN(F), new PWA),
    networkInterface: Y || Cf8,
    cryptoInterface: J || LWA,
    clientCredentials: X || qf8,
    libraryInfo: {
      ...Uf8,
      ...I
    },
    telemetry: {
      ...wf8,
      ...D
    },
    serverTelemetryManager: W || null,
    persistencePlugin: K || null,
    serializableCache: V || null
  }
}
// @from(Ln 231085, Col 0)
function Lf8(A) {
  return {
    clientCapabilities: [],
    azureCloudOptions: Nf8,
    skipAuthorityMetadataCache: !1,
    instanceAware: !1,
    encodeExtraQueryParams: !1,
    ...A
  }
}
// @from(Ln 231096, Col 0)
function R31(A) {
  return A.authOptions.authority.options.protocolMode === vz.OIDC
}
// @from(Ln 231099, Col 4)
Ef8
// @from(Ln 231099, Col 9)
zf8
// @from(Ln 231099, Col 14)
$f8
// @from(Ln 231099, Col 19)
Cf8
// @from(Ln 231099, Col 24)
Uf8
// @from(Ln 231099, Col 29)
qf8
// @from(Ln 231099, Col 34)
Nf8
// @from(Ln 231099, Col 39)
wf8
// @from(Ln 231100, Col 4)
_31 = w(() => {
  P80();
  E31();
  lY();
  $31();
  C31();
  d80();
  CPA();
  aW();
  p80();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  Ef8 = {
    tokenRenewalOffsetSeconds: NWA,
    preventCorsPreflight: !1
  }, zf8 = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: KI.Info,
    correlationId: m0.EMPTY_STRING
  }, $f8 = {
    claimsBasedCachingEnabled: !1
  }, Cf8 = {
    async sendGetRequestAsync() {
      throw YQ(o3)
    },
    async sendPostRequestAsync() {
      throw YQ(o3)
    }
  }, Uf8 = {
    sku: m0.SKU,
    version: OWA,
    cpu: m0.EMPTY_STRING,
    os: m0.EMPTY_STRING
  }, qf8 = {
    clientSecret: m0.EMPTY_STRING,
    clientAssertion: void 0
  }, Nf8 = {
    azureCloudInstance: hm.None,
    tenant: `${m0.DEFAULT_COMMON_TENANT}`
  }, wf8 = {
    application: {
      appName: "",
      appVersion: ""
    }
  }
})
// @from(Ln 231146, Col 4)
PC
// @from(Ln 231147, Col 4)
wPA = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  PC = {
    HOME_ACCOUNT_ID: "home_account_id",
    UPN: "UPN"
  }
})
// @from(Ln 231154, Col 4)
e2A = {}
// @from(Ln 231215, Col 4)
ek = "client_id"
// @from(Ln 231216, Col 2)
j31 = "redirect_uri"
// @from(Ln 231217, Col 2)
l80 = "response_type"
// @from(Ln 231218, Col 2)
i80 = "response_mode"
// @from(Ln 231219, Col 2)
n80 = "grant_type"
// @from(Ln 231220, Col 2)
a80 = "claims"
// @from(Ln 231221, Col 2)
o80 = "scope"
// @from(Ln 231222, Col 2)
Of8 = "error"
// @from(Ln 231223, Col 2)
Mf8 = "error_description"
// @from(Ln 231224, Col 2)
Rf8 = "access_token"
// @from(Ln 231225, Col 2)
_f8 = "id_token"
// @from(Ln 231226, Col 2)
r80 = "refresh_token"
// @from(Ln 231227, Col 2)
jf8 = "expires_in"
// @from(Ln 231228, Col 2)
Tf8 = "refresh_token_expires_in"
// @from(Ln 231229, Col 2)
s80 = "state"
// @from(Ln 231230, Col 2)
t80 = "nonce"
// @from(Ln 231231, Col 2)
e80 = "prompt"
// @from(Ln 231232, Col 2)
Pf8 = "session_state"
// @from(Ln 231233, Col 2)
Sf8 = "client_info"
// @from(Ln 231234, Col 2)
A50 = "code"
// @from(Ln 231235, Col 2)
Q50 = "code_challenge"
// @from(Ln 231236, Col 2)
B50 = "code_challenge_method"
// @from(Ln 231237, Col 2)
G50 = "code_verifier"
// @from(Ln 231238, Col 2)
Z50 = "client-request-id"
// @from(Ln 231239, Col 2)
Y50 = "x-client-SKU"
// @from(Ln 231240, Col 2)
J50 = "x-client-VER"
// @from(Ln 231241, Col 2)
X50 = "x-client-OS"
// @from(Ln 231242, Col 2)
I50 = "x-client-CPU"
// @from(Ln 231243, Col 2)
D50 = "x-client-current-telemetry"
// @from(Ln 231244, Col 2)
W50 = "x-client-last-telemetry"
// @from(Ln 231245, Col 2)
K50 = "x-ms-lib-capability"
// @from(Ln 231246, Col 2)
V50 = "x-app-name"
// @from(Ln 231247, Col 2)
F50 = "x-app-ver"
// @from(Ln 231248, Col 2)
H50 = "post_logout_redirect_uri"
// @from(Ln 231249, Col 2)
E50 = "id_token_hint"
// @from(Ln 231250, Col 2)
z50 = "device_code"
// @from(Ln 231251, Col 2)
$50 = "client_secret"
// @from(Ln 231252, Col 2)
C50 = "client_assertion"
// @from(Ln 231253, Col 2)
U50 = "client_assertion_type"
// @from(Ln 231254, Col 2)
T31 = "token_type"
// @from(Ln 231255, Col 2)
P31 = "req_cnf"
// @from(Ln 231256, Col 2)
q50 = "assertion"
// @from(Ln 231257, Col 2)
N50 = "requested_token_use"
// @from(Ln 231258, Col 2)
xf8 = "on_behalf_of"
// @from(Ln 231259, Col 2)
yf8 = "foci"
// @from(Ln 231260, Col 2)
vf8 = "X-AnchorMailbox"
// @from(Ln 231261, Col 2)
S31 = "return_spa_code"
// @from(Ln 231262, Col 2)
w50 = "nativebroker"
// @from(Ln 231263, Col 2)
L50 = "logout_hint"
// @from(Ln 231264, Col 2)
O50 = "sid"
// @from(Ln 231265, Col 2)
M50 = "login_hint"
// @from(Ln 231266, Col 2)
R50 = "domain_hint"
// @from(Ln 231267, Col 2)
kf8 = "x-client-xtra-sku"
// @from(Ln 231268, Col 2)
LPA = "brk_client_id"
// @from(Ln 231269, Col 2)
x31 = "brk_redirect_uri"
// @from(Ln 231270, Col 2)
SWA = "instance_aware"
// @from(Ln 231271, Col 2)
_50 = "ear_jwk"
// @from(Ln 231272, Col 2)
j50 = "ear_jwe_crypto"
// @from(Ln 231273, Col 4)
xWA = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231276, Col 4)
E2 = {}
// @from(Ln 231326, Col 0)
function A9A(A, Q, B) {
  if (!Q) return;
  let G = A.get(ek);
  if (G && A.has(LPA)) B?.addFields({
    embeddedClientId: G,
    embeddedRedirectUri: A.get(j31)
  }, Q)
}
// @from(Ln 231335, Col 0)
function bf8(A, Q) {
  A.set(l80, Q)
}
// @from(Ln 231339, Col 0)
function T50(A, Q) {
  A.set(i80, Q ? Q : ak.QUERY)
}
// @from(Ln 231343, Col 0)
function ff8(A) {
  A.set(w50, "1")
}
// @from(Ln 231347, Col 0)
function Q9A(A, Q, B = !0, G = yz) {
  if (B && !G.includes("openid") && !Q.includes("openid")) G.push("openid");
  let Z = B ? [...Q || [], ...G] : Q || [],
    Y = new aI(Z);
  A.set(o80, Y.printScopes())
}
// @from(Ln 231354, Col 0)
function B9A(A, Q) {
  A.set(ek, Q)
}
// @from(Ln 231358, Col 0)
function G9A(A, Q) {
  A.set(j31, Q)
}
// @from(Ln 231362, Col 0)
function P50(A, Q) {
  A.set(H50, Q)
}
// @from(Ln 231366, Col 0)
function S50(A, Q) {
  A.set(E50, Q)
}
// @from(Ln 231370, Col 0)
function x50(A, Q) {
  A.set(R50, Q)
}
// @from(Ln 231374, Col 0)
function yWA(A, Q) {
  A.set(M50, Q)
}
// @from(Ln 231378, Col 0)
function yo(A, Q) {
  A.set(pY.CCS_HEADER, `UPN:${Q}`)
}
// @from(Ln 231382, Col 0)
function dm(A, Q) {
  A.set(pY.CCS_HEADER, `Oid:${Q.uid}@${Q.utid}`)
}
// @from(Ln 231386, Col 0)
function y31(A, Q) {
  A.set(O50, Q)
}
// @from(Ln 231390, Col 0)
function Z9A(A, Q, B) {
  let G = ZpB(Q, B);
  try {
    JSON.parse(G)
  } catch (Z) {
    throw yZ(jo)
  }
  A.set(a80, G)
}
// @from(Ln 231400, Col 0)
function Y9A(A, Q) {
  A.set(Z50, Q)
}
// @from(Ln 231404, Col 0)
function OPA(A, Q) {
  if (A.set(Y50, Q.sku), A.set(J50, Q.version), Q.os) A.set(X50, Q.os);
  if (Q.cpu) A.set(I50, Q.cpu)
}
// @from(Ln 231409, Col 0)
function MPA(A, Q) {
  if (Q?.appName) A.set(V50, Q.appName);
  if (Q?.appVersion) A.set(F50, Q.appVersion)
}
// @from(Ln 231414, Col 0)
function y50(A, Q) {
  A.set(e80, Q)
}
// @from(Ln 231418, Col 0)
function RPA(A, Q) {
  if (Q) A.set(s80, Q)
}
// @from(Ln 231422, Col 0)
function v50(A, Q) {
  A.set(t80, Q)
}
// @from(Ln 231426, Col 0)
function hf8(A, Q, B) {
  if (Q && B) A.set(Q50, Q), A.set(B50, B);
  else throw yZ(a2A)
}
// @from(Ln 231431, Col 0)
function k50(A, Q) {
  A.set(A50, Q)
}
// @from(Ln 231435, Col 0)
function gf8(A, Q) {
  A.set(z50, Q)
}
// @from(Ln 231439, Col 0)
function b50(A, Q) {
  A.set(r80, Q)
}
// @from(Ln 231443, Col 0)
function f50(A, Q) {
  A.set(G50, Q)
}
// @from(Ln 231447, Col 0)
function _PA(A, Q) {
  A.set($50, Q)
}
// @from(Ln 231451, Col 0)
function jPA(A, Q) {
  if (Q) A.set(C50, Q)
}
// @from(Ln 231455, Col 0)
function TPA(A, Q) {
  if (Q) A.set(U50, Q)
}
// @from(Ln 231459, Col 0)
function uf8(A, Q) {
  A.set(q50, Q)
}
// @from(Ln 231463, Col 0)
function mf8(A, Q) {
  A.set(N50, Q)
}
// @from(Ln 231467, Col 0)
function PPA(A, Q) {
  A.set(n80, Q)
}
// @from(Ln 231471, Col 0)
function J9A(A) {
  A.set(pcB, "1")
}
// @from(Ln 231475, Col 0)
function SPA(A) {
  if (!A.has(SWA)) A.set(SWA, "true")
}
// @from(Ln 231479, Col 0)
function cm(A, Q) {
  Object.entries(Q).forEach(([B, G]) => {
    if (!A.has(B) && G) A.set(B, G)
  })
}
// @from(Ln 231485, Col 0)
function ZpB(A, Q) {
  let B;
  if (!A) B = {};
  else try {
    B = JSON.parse(A)
  } catch (G) {
    throw yZ(jo)
  }
  if (Q && Q.length > 0) {
    if (!B.hasOwnProperty(w2A.ACCESS_TOKEN)) B[w2A.ACCESS_TOKEN] = {};
    B[w2A.ACCESS_TOKEN][w2A.XMS_CC] = {
      values: Q
    }
  }
  return JSON.stringify(B)
}
// @from(Ln 231502, Col 0)
function df8(A, Q) {
  A.set(dTA.username, Q)
}
// @from(Ln 231506, Col 0)
function cf8(A, Q) {
  A.set(dTA.password, Q)
}
// @from(Ln 231510, Col 0)
function xPA(A, Q) {
  if (Q) A.set(T31, J5.POP), A.set(P31, Q)
}
// @from(Ln 231514, Col 0)
function yPA(A, Q) {
  if (Q) A.set(T31, J5.SSH), A.set(P31, Q)
}
// @from(Ln 231518, Col 0)
function vPA(A, Q) {
  A.set(D50, Q.generateCurrentRequestHeaderValue()), A.set(W50, Q.generateLastRequestHeaderValue())
}
// @from(Ln 231522, Col 0)
function kPA(A) {
  A.set(K50, ok.X_MS_LIB_CAPABILITY_VALUE)
}
// @from(Ln 231526, Col 0)
function h50(A, Q) {
  A.set(L50, Q)
}
// @from(Ln 231530, Col 0)
function pm(A, Q, B) {
  if (!A.has(LPA)) A.set(LPA, Q);
  if (!A.has(x31)) A.set(x31, B)
}
// @from(Ln 231535, Col 0)
function pf8(A, Q) {
  A.set(_50, encodeURIComponent(Q));
  let B = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0";
  A.set(j50, B)
}
// @from(Ln 231541, Col 0)
function lf8(A, Q) {
  Object.entries(Q).forEach(([B, G]) => {
    if (G) A.set(B, G)
  })
}
// @from(Ln 231546, Col 4)
vWA = w(() => {
  lY();
  xWA();
  zPA();
  Po();
  um(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231554, Col 0)
function YpB(A) {
  return A.hasOwnProperty("authorization_endpoint") && A.hasOwnProperty("token_endpoint") && A.hasOwnProperty("issuer") && A.hasOwnProperty("jwks_uri")
}
// @from(Ln 231557, Col 4)
JpB = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231561, Col 0)
function XpB(A) {
  return A.hasOwnProperty("tenant_discovery_endpoint") && A.hasOwnProperty("metadata")
}
// @from(Ln 231564, Col 4)
IpB = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231568, Col 0)
function DpB(A) {
  return A.hasOwnProperty("error") && A.hasOwnProperty("error_description")
}
// @from(Ln 231571, Col 4)
WpB = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231574, Col 4)
KpB = (A, Q, B, G, Z) => {
    return (...Y) => {
      B.trace(`Executing function ${Q}`);
      let J = G?.startMeasurement(Q, Z);
      if (Z) {
        let X = Q + "CallCount";
        G?.incrementFields({
          [X]: 1
        }, Z)
      }
      try {
        let X = A(...Y);
        return J?.end({
          success: !0
        }), B.trace(`Returning result from ${Q}`), X
      } catch (X) {
        B.trace(`Error occurred in ${Q}`);
        try {
          B.trace(JSON.stringify(X))
        } catch (I) {
          B.trace("Unable to print error message.")
        }
        throw J?.end({
          success: !1
        }, X), X
      }
    }
  }
// @from(Ln 231602, Col 2)
y5 = (A, Q, B, G, Z) => {
    return (...Y) => {
      B.trace(`Executing function ${Q}`);
      let J = G?.startMeasurement(Q, Z);
      if (Z) {
        let X = Q + "CallCount";
        G?.incrementFields({
          [X]: 1
        }, Z)
      }
      return G?.setPreQueueTime(Q, Z), A(...Y).then((X) => {
        return B.trace(`Returning result from ${Q}`), J?.end({
          success: !0
        }), X
      }).catch((X) => {
        B.trace(`Error occurred in ${Q}`);
        try {
          B.trace(JSON.stringify(X))
        } catch (I) {
          B.trace("Unable to print error message.")
        }
        throw J?.end({
          success: !1
        }, X), X
      })
    }
  }
// @from(Ln 231629, Col 4)
lm = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231632, Col 0)
class bPA {
  constructor(A, Q, B, G) {
    this.networkInterface = A, this.logger = Q, this.performanceClient = B, this.correlationId = G
  }
  async detectRegion(A, Q) {
    this.performanceClient?.addQueueMeasurement(N0.RegionDiscoveryDetectRegion, this.correlationId);
    let B = A;
    if (!B) {
      let G = bPA.IMDS_OPTIONS;
      try {
        let Z = await y5(this.getRegionFromIMDS.bind(this), N0.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(m0.IMDS_VERSION, G);
        if (Z.status === i6.SUCCESS) B = Z.body, Q.region_source = O2A.IMDS;
        if (Z.status === i6.BAD_REQUEST) {
          let Y = await y5(this.getCurrentVersion.bind(this), N0.RegionDiscoveryGetCurrentVersion, this.logger, this.performanceClient, this.correlationId)(G);
          if (!Y) return Q.region_source = O2A.FAILED_AUTO_DETECTION, null;
          let J = await y5(this.getRegionFromIMDS.bind(this), N0.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(Y, G);
          if (J.status === i6.SUCCESS) B = J.body, Q.region_source = O2A.IMDS
        }
      } catch (Z) {
        return Q.region_source = O2A.FAILED_AUTO_DETECTION, null
      }
    } else Q.region_source = O2A.ENVIRONMENT_VARIABLE;
    if (!B) Q.region_source = O2A.FAILED_AUTO_DETECTION;
    return B || null
  }
  async getRegionFromIMDS(A, Q) {
    return this.performanceClient?.addQueueMeasurement(N0.RegionDiscoveryGetRegionFromIMDS, this.correlationId), this.networkInterface.sendGetRequestAsync(`${m0.IMDS_ENDPOINT}?api-version=${A}&format=text`, Q, m0.IMDS_TIMEOUT)
  }
  async getCurrentVersion(A) {
    this.performanceClient?.addQueueMeasurement(N0.RegionDiscoveryGetCurrentVersion, this.correlationId);
    try {
      let Q = await this.networkInterface.sendGetRequestAsync(`${m0.IMDS_ENDPOINT}?format=json`, A);
      if (Q.status === i6.BAD_REQUEST && Q.body && Q.body["newest-versions"] && Q.body["newest-versions"].length > 0) return Q.body["newest-versions"][0];
      return null
    } catch (Q) {
      return null
    }
  }
}
// @from(Ln 231671, Col 4)
VpB = w(() => {
  lY();
  QS();
  lm(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  bPA.IMDS_OPTIONS = {
    headers: {
      Metadata: "true"
    }
  }
})
// @from(Ln 231681, Col 4)
LJ = {}
// @from(Ln 231692, Col 0)
function eL() {
  return Math.round(new Date().getTime() / 1000)
}
// @from(Ln 231696, Col 0)
function if8(A) {
  return A.getTime() / 1000
}
// @from(Ln 231700, Col 0)
function fPA(A) {
  if (A) return new Date(Number(A) * 1000);
  return new Date
}
// @from(Ln 231705, Col 0)
function kWA(A, Q) {
  let B = Number(A) || 0;
  return eL() + Q > B
}
// @from(Ln 231710, Col 0)
function nf8(A, Q) {
  let B = Number(A) + Q * 24 * 60 * 60 * 1000;
  return Date.now() > B
}
// @from(Ln 231715, Col 0)
function g50(A) {
  return Number(A) > eL()
}
// @from(Ln 231719, Col 0)
function af8(A, Q) {
  return new Promise((B) => setTimeout(() => B(Q), A))
}
// @from(Ln 231722, Col 4)
vo = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231725, Col 4)
SC = {}
// @from(Ln 231745, Col 0)
function u50(A, Q, B, G, Z) {
  return {
    credentialType: SG.ID_TOKEN,
    homeAccountId: A,
    environment: Q,
    clientId: G,
    secret: B,
    realm: Z,
    lastUpdatedAt: Date.now().toString()
  }
}
// @from(Ln 231757, Col 0)
function m50(A, Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H) {
  let E = {
    homeAccountId: A,
    credentialType: SG.ACCESS_TOKEN,
    secret: B,
    cachedAt: eL().toString(),
    expiresOn: J.toString(),
    extendedExpiresOn: X.toString(),
    environment: Q,
    clientId: G,
    realm: Z,
    target: Y,
    tokenType: W || J5.BEARER,
    lastUpdatedAt: Date.now().toString()
  };
  if (K) E.userAssertionHash = K;
  if (D) E.refreshOn = D.toString();
  if (F) E.requestedClaims = F, E.requestedClaimsHash = H;
  if (E.tokenType?.toLowerCase() !== J5.BEARER.toLowerCase()) switch (E.credentialType = SG.ACCESS_TOKEN_WITH_AUTH_SCHEME, E.tokenType) {
    case J5.POP:
      let z = mm(B, I);
      if (!z?.cnf?.kid) throw YQ(h2A);
      E.keyId = z.cnf.kid;
      break;
    case J5.SSH:
      E.keyId = V
  }
  return E
}
// @from(Ln 231787, Col 0)
function d50(A, Q, B, G, Z, Y, J) {
  let X = {
    credentialType: SG.REFRESH_TOKEN,
    homeAccountId: A,
    environment: Q,
    clientId: G,
    secret: B,
    lastUpdatedAt: Date.now().toString()
  };
  if (Y) X.userAssertionHash = Y;
  if (Z) X.familyId = Z;
  if (J) X.expiresOn = J.toString();
  return X
}
// @from(Ln 231802, Col 0)
function v31(A) {
  return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("credentialType") && A.hasOwnProperty("clientId") && A.hasOwnProperty("secret")
}
// @from(Ln 231806, Col 0)
function of8(A) {
  if (!A) return !1;
  return v31(A) && A.hasOwnProperty("realm") && A.hasOwnProperty("target") && (A.credentialType === SG.ACCESS_TOKEN || A.credentialType === SG.ACCESS_TOKEN_WITH_AUTH_SCHEME)
}
// @from(Ln 231811, Col 0)
function rf8(A) {
  if (!A) return !1;
  return v31(A) && A.hasOwnProperty("realm") && A.credentialType === SG.ID_TOKEN
}
// @from(Ln 231816, Col 0)
function sf8(A) {
  if (!A) return !1;
  return v31(A) && A.credentialType === SG.REFRESH_TOKEN
}
// @from(Ln 231821, Col 0)
function tf8(A, Q) {
  let B = A.indexOf(rK.CACHE_KEY) === 0,
    G = !0;
  if (Q) G = Q.hasOwnProperty("failedRequests") && Q.hasOwnProperty("errors") && Q.hasOwnProperty("cacheHits");
  return B && G
}
// @from(Ln 231828, Col 0)
function ef8(A, Q) {
  let B = !1;
  if (A) B = A.indexOf(ok.THROTTLING_PREFIX) === 0;
  let G = !0;
  if (Q) G = Q.hasOwnProperty("throttleTime");
  return B && G
}
// @from(Ln 231836, Col 0)
function Ah8({
  environment: A,
  clientId: Q
}) {
  return [uTA, A, Q].join(ym.CACHE_KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 231843, Col 0)
function Qh8(A, Q) {
  if (!Q) return !1;
  return A.indexOf(uTA) === 0 && Q.hasOwnProperty("clientId") && Q.hasOwnProperty("environment")
}
// @from(Ln 231848, Col 0)
function Bh8(A, Q) {
  if (!Q) return !1;
  return A.indexOf(qWA.CACHE_KEY) === 0 && Q.hasOwnProperty("aliases") && Q.hasOwnProperty("preferred_cache") && Q.hasOwnProperty("preferred_network") && Q.hasOwnProperty("canonical_authority") && Q.hasOwnProperty("authorization_endpoint") && Q.hasOwnProperty("token_endpoint") && Q.hasOwnProperty("issuer") && Q.hasOwnProperty("aliasesFromNetwork") && Q.hasOwnProperty("endpointsFromNetwork") && Q.hasOwnProperty("expiresAt") && Q.hasOwnProperty("jwks_uri")
}
// @from(Ln 231853, Col 0)
function k31() {
  return eL() + qWA.REFRESH_TIME_SECONDS
}
// @from(Ln 231857, Col 0)
function bWA(A, Q, B) {
  A.authorization_endpoint = Q.authorization_endpoint, A.token_endpoint = Q.token_endpoint, A.end_session_endpoint = Q.end_session_endpoint, A.issuer = Q.issuer, A.endpointsFromNetwork = B, A.jwks_uri = Q.jwks_uri
}
// @from(Ln 231861, Col 0)
function hPA(A, Q, B) {
  A.aliases = Q.aliases, A.preferred_cache = Q.preferred_cache, A.preferred_network = Q.preferred_network, A.aliasesFromNetwork = B
}
// @from(Ln 231865, Col 0)
function b31(A) {
  return A.expiresAt <= eL()
}
// @from(Ln 231868, Col 4)
f31 = w(() => {
  TWA();
  aW();
  lY();
  vo();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 231875, Col 0)
class sK {
  constructor(A, Q, B, G, Z, Y, J, X) {
    this.canonicalAuthority = A, this._canonicalAuthority.validateAsUri(), this.networkInterface = Q, this.cacheManager = B, this.authorityOptions = G, this.regionDiscoveryMetadata = {
      region_used: void 0,
      region_source: void 0,
      region_outcome: void 0
    }, this.logger = Z, this.performanceClient = J, this.correlationId = Y, this.managedIdentity = X || !1, this.regionDiscovery = new bPA(Q, this.logger, this.performanceClient, this.correlationId)
  }
  getAuthorityType(A) {
    if (A.HostNameAndPort.endsWith(m0.CIAM_AUTH_URL)) return q_.Ciam;
    let Q = A.PathSegments;
    if (Q.length) switch (Q[0].toLowerCase()) {
      case m0.ADFS:
        return q_.Adfs;
      case m0.DSTS:
        return q_.Dsts
    }
    return q_.Default
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
    this._canonicalAuthority = new U3(A), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null
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
    else throw YQ(TC)
  }
  get tokenEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint);
    else throw YQ(TC)
  }
  get deviceCodeEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
    else throw YQ(TC)
  }
  get endSessionEndpoint() {
    if (this.discoveryComplete()) {
      if (!this.metadata.end_session_endpoint) throw YQ(u2A);
      return this.replacePath(this.metadata.end_session_endpoint)
    } else throw YQ(TC)
  }
  get selfSignedJwtAudience() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.issuer);
    else throw YQ(TC)
  }
  get jwksUri() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.jwks_uri);
    else throw YQ(TC)
  }
  canReplaceTenant(A) {
    return A.PathSegments.length === 1 && !sK.reservedTenantDomains.has(A.PathSegments[0]) && this.getAuthorityType(A) === q_.Default && this.protocolMode !== vz.OIDC
  }
  replaceTenant(A) {
    return A.replace(/{tenant}|{tenantid}/g, this.tenant)
  }
  replacePath(A) {
    let Q = A,
      G = new U3(this.metadata.canonical_authority).getUrlComponents(),
      Z = G.PathSegments;
    return this.canonicalAuthorityUrlComponents.PathSegments.forEach((J, X) => {
      let I = Z[X];
      if (X === 0 && this.canReplaceTenant(G)) {
        let D = new U3(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
        if (I !== D) this.logger.verbose(`Replacing tenant domain name ${I} with id ${D}`), I = D
      }
      if (J !== I) Q = Q.replace(`/${I}/`, `/${J}/`)
    }), this.replaceTenant(Q)
  }
  get defaultOpenIdConfigurationEndpoint() {
    let A = this.hostnameAndPort;
    if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === q_.Adfs || this.protocolMode === vz.OIDC && !this.isAliasOfKnownMicrosoftAuthority(A)) return `${this.canonicalAuthority}.well-known/openid-configuration`;
    return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`
  }
  discoveryComplete() {
    return !!this.metadata
  }
  async resolveEndpointsAsync() {
    this.performanceClient?.addQueueMeasurement(N0.AuthorityResolveEndpointsAsync, this.correlationId);
    let A = this.getCurrentMetadataEntity(),
      Q = await y5(this.updateCloudDiscoveryMetadata.bind(this), N0.AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(A);
    this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, A.preferred_network);
    let B = await y5(this.updateEndpointMetadata.bind(this), N0.AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(A);
    this.updateCachedMetadata(A, Q, {
      source: B
    }), this.performanceClient?.addFields({
      cloudDiscoverySource: Q,
      authorityEndpointSource: B
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
      expiresAt: k31(),
      jwks_uri: ""
    };
    return A
  }
  updateCachedMetadata(A, Q, B) {
    if (Q !== jC.CACHE && B?.source !== jC.CACHE) A.expiresAt = k31(), A.canonical_authority = this.canonicalAuthority;
    let G = this.cacheManager.generateAuthorityMetadataCacheKey(A.preferred_cache);
    this.cacheManager.setAuthorityMetadata(G, A), this.metadata = A
  }
  async updateEndpointMetadata(A) {
    this.performanceClient?.addQueueMeasurement(N0.AuthorityUpdateEndpointMetadata, this.correlationId);
    let Q = this.updateEndpointMetadataFromLocalSources(A);
    if (Q) {
      if (Q.source === jC.HARDCODED_VALUES) {
        if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
          if (Q.metadata) {
            let G = await y5(this.updateMetadataWithRegionalInformation.bind(this), N0.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(Q.metadata);
            bWA(A, G, !1), A.canonical_authority = this.canonicalAuthority
          }
        }
      }
      return Q.source
    }
    let B = await y5(this.getEndpointMetadataFromNetwork.bind(this), N0.AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (B) {
      if (this.authorityOptions.azureRegionConfiguration?.azureRegion) B = await y5(this.updateMetadataWithRegionalInformation.bind(this), N0.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(B);
      return bWA(A, B, !0), jC.NETWORK
    } else throw YQ(j2A, this.defaultOpenIdConfigurationEndpoint)
  }
  updateEndpointMetadataFromLocalSources(A) {
    this.logger.verbose("Attempting to get endpoint metadata from authority configuration");
    let Q = this.getEndpointMetadataFromConfig();
    if (Q) return this.logger.verbose("Found endpoint metadata in authority configuration"), bWA(A, Q, !1), {
      source: jC.CONFIG
    };
    if (this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."), this.authorityOptions.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");
    else {
      let G = this.getEndpointMetadataFromHardcodedValues();
      if (G) return bWA(A, G, !1), {
        source: jC.HARDCODED_VALUES,
        metadata: G
      };
      else this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")
    }
    let B = b31(A);
    if (this.isAuthoritySameType(A) && A.endpointsFromNetwork && !B) return this.logger.verbose("Found endpoint metadata in the cache."), {
      source: jC.CACHE
    };
    else if (B) this.logger.verbose("The metadata entity is expired.");
    return null
  }
  isAuthoritySameType(A) {
    return new U3(A.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length
  }
  getEndpointMetadataFromConfig() {
    if (this.authorityOptions.authorityMetadata) try {
      return JSON.parse(this.authorityOptions.authorityMetadata)
    } catch (A) {
      throw yZ(o2A)
    }
    return null
  }
  async getEndpointMetadataFromNetwork() {
    this.performanceClient?.addQueueMeasurement(N0.AuthorityGetEndpointMetadataFromNetwork, this.correlationId);
    let A = {},
      Q = this.defaultOpenIdConfigurationEndpoint;
    this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${Q}`);
    try {
      let B = await this.networkInterface.sendGetRequestAsync(Q, A);
      if (YpB(B.body)) return B.body;
      else return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"), null
    } catch (B) {
      return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${B}`), null
    }
  }
  getEndpointMetadataFromHardcodedValues() {
    if (this.hostnameAndPort in b80) return b80[this.hostnameAndPort];
    return null
  }
  async updateMetadataWithRegionalInformation(A) {
    this.performanceClient?.addQueueMeasurement(N0.AuthorityUpdateMetadataWithRegionalInformation, this.correlationId);
    let Q = this.authorityOptions.azureRegionConfiguration?.azureRegion;
    if (Q) {
      if (Q !== m0.AZURE_REGION_AUTO_DISCOVER_FLAG) return this.regionDiscoveryMetadata.region_outcome = F31.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = Q, sK.replaceWithRegionalInformation(A, Q);
      let B = await y5(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), N0.RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
      if (B) return this.regionDiscoveryMetadata.region_outcome = F31.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = B, sK.replaceWithRegionalInformation(A, B);
      this.regionDiscoveryMetadata.region_outcome = F31.AUTO_DETECTION_REQUESTED_FAILED
    }
    return A
  }
  async updateCloudDiscoveryMetadata(A) {
    this.performanceClient?.addQueueMeasurement(N0.AuthorityUpdateCloudDiscoveryMetadata, this.correlationId);
    let Q = this.updateCloudDiscoveryMetadataFromLocalSources(A);
    if (Q) return Q;
    let B = await y5(this.getCloudDiscoveryMetadataFromNetwork.bind(this), N0.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (B) return hPA(A, B, !0), jC.NETWORK;
    throw yZ(r2A)
  }
  updateCloudDiscoveryMetadataFromLocalSources(A) {
    this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"), this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||m0.NOT_APPLICABLE}`), this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||m0.NOT_APPLICABLE}`), this.logger.verbosePii(`Canonical Authority: ${A.canonical_authority||m0.NOT_APPLICABLE}`);
    let Q = this.getCloudDiscoveryMetadataFromConfig();
    if (Q) return this.logger.verbose("Found cloud discovery metadata in authority configuration"), hPA(A, Q, !1), jC.CONFIG;
    if (this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."), this.options.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");
    else {
      let G = tcB(this.hostnameAndPort);
      if (G) return this.logger.verbose("Found cloud discovery metadata from hardcoded values."), hPA(A, G, !1), jC.HARDCODED_VALUES;
      this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")
    }
    let B = b31(A);
    if (this.isAuthoritySameType(A) && A.aliasesFromNetwork && !B) return this.logger.verbose("Found cloud discovery metadata in the cache."), jC.CACHE;
    else if (B) this.logger.verbose("The metadata entity is expired.");
    return null
  }
  getCloudDiscoveryMetadataFromConfig() {
    if (this.authorityType === q_.Ciam) return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."), sK.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    if (this.authorityOptions.cloudDiscoveryMetadata) {
      this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");
      try {
        this.logger.verbose("Attempting to parse the cloud discovery metadata.");
        let A = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),
          Q = qPA(A.metadata, this.hostnameAndPort);
        if (this.logger.verbose("Parsed the cloud discovery metadata."), Q) return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."), Q;
        else this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")
      } catch (A) {
        throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."), yZ(To)
      }
    }
    if (this.isInKnownAuthorities()) return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."), sK.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return null
  }
  async getCloudDiscoveryMetadataFromNetwork() {
    this.performanceClient?.addQueueMeasurement(N0.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.correlationId);
    let A = `${m0.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,
      Q = {},
      B = null;
    try {
      let G = await this.networkInterface.sendGetRequestAsync(A, Q),
        Z, Y;
      if (XpB(G.body)) Z = G.body, Y = Z.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: ${Z.tenant_discovery_endpoint}`);
      else if (DpB(G.body)) {
        if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${G.status}`), Z = G.body, Z.error === m0.INVALID_INSTANCE) return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."), null;
        this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${Z.error}`), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${Z.error_description}`), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"), Y = []
      } else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"), null;
      this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."), B = qPA(Y, this.hostnameAndPort)
    } catch (G) {
      if (G instanceof n6) this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
Error: ${G.errorCode}
Error Description: ${G.errorMessage}`);
      else {
        let Z = G;
        this.logger.error(`A non-MSALJS error was thrown while attempting to get the cloud instance discovery metadata.
Error: ${Z.name}
Error Description: ${Z.message}`)
      }
      return null
    }
    if (!B) this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."), this.logger.verbose("Creating custom Authority for custom domain scenario."), B = sK.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return B
  }
  isInKnownAuthorities() {
    return this.authorityOptions.knownAuthorities.filter((Q) => {
      return Q && U3.getDomainFromUrl(Q).toLowerCase() === this.hostnameAndPort
    }).length > 0
  }
  static generateAuthority(A, Q) {
    let B;
    if (Q && Q.azureCloudInstance !== hm.None) {
      let G = Q.tenant ? Q.tenant : m0.DEFAULT_COMMON_TENANT;
      B = `${Q.azureCloudInstance}/${G}/`
    }
    return B ? B : A
  }
  static createCloudDiscoveryMetadataFromHost(A) {
    return {
      preferred_network: A,
      preferred_cache: A,
      aliases: [A]
    }
  }
  getPreferredCache() {
    if (this.managedIdentity) return m0.DEFAULT_AUTHORITY_HOST;
    else if (this.discoveryComplete()) return this.metadata.preferred_cache;
    else throw YQ(TC)
  }
  isAlias(A) {
    return this.metadata.aliases.indexOf(A) > -1
  }
  isAliasOfKnownMicrosoftAuthority(A) {
    return h80.has(A)
  }
  static isPublicCloudAuthority(A) {
    return m0.KNOWN_PUBLIC_CLOUDS.indexOf(A) >= 0
  }
  static buildRegionalAuthorityString(A, Q, B) {
    let G = new U3(A);
    G.validateAsUri();
    let Z = G.getUrlComponents(),
      Y = `${Q}.${Z.HostNameAndPort}`;
    if (this.isPublicCloudAuthority(Z.HostNameAndPort)) Y = `${Q}.${m0.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
    let J = U3.constructAuthorityUriFromObject({
      ...G.getUrlComponents(),
      HostNameAndPort: Y
    }).urlString;
    if (B) return `${J}?${B}`;
    return J
  }
  static replaceWithRegionalInformation(A, Q) {
    let B = {
      ...A
    };
    if (B.authorization_endpoint = sK.buildRegionalAuthorityString(B.authorization_endpoint, Q), B.token_endpoint = sK.buildRegionalAuthorityString(B.token_endpoint, Q), B.end_session_endpoint) B.end_session_endpoint = sK.buildRegionalAuthorityString(B.end_session_endpoint, Q);
    return B
  }
  static transformCIAMAuthority(A) {
    let Q = A,
      G = new U3(A).getUrlComponents();
    if (G.PathSegments.length === 0 && G.HostNameAndPort.endsWith(m0.CIAM_AUTH_URL)) {
      let Z = G.HostNameAndPort.split(".")[0];
      Q = `${Q}${Z}${m0.AAD_TENANT_DOMAIN_SUFFIX}`
    }
    return Q
  }
}
// @from(Ln 232223, Col 0)
function FpB(A) {
  let G = new U3(A).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
  switch (G) {
    case KN.COMMON:
    case KN.ORGANIZATIONS:
    case KN.CONSUMERS:
      return;
    default:
      return G
  }
}
// @from(Ln 232235, Col 0)
function h31(A) {
  return A.endsWith(m0.FORWARD_SLASH) ? A : `${A}${m0.FORWARD_SLASH}`
}
// @from(Ln 232239, Col 0)
function c50(A) {
  let Q = A.cloudDiscoveryMetadata,
    B = void 0;
  if (Q) try {
    B = JSON.parse(Q)
  } catch (G) {
    throw yZ(To)
  }
  return {
    canonicalAuthority: A.authority ? h31(A.authority) : void 0,
    knownAuthorities: A.knownAuthorities,
    cloudDiscoveryMetadata: B
  }
}
// @from(Ln 232253, Col 4)
g31 = w(() => {
  x80();
  JpB();
  xo();
  aW();
  lY();
  g80();
  Po();
  CPA();
  C31();
  IpB();
  WpB();
  VpB();
  U_();
  QS();
  lm();
  f31();
  mD();
  um(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  sK.reservedTenantDomains = new Set(["{tenant}", "{tenantid}", KN.COMMON, KN.CONSUMERS, KN.ORGANIZATIONS])
})
// @from(Ln 232274, Col 4)
u31 = {}
// @from(Ln 232278, Col 0)
async function p50(A, Q, B, G, Z, Y, J) {
  J?.addQueueMeasurement(N0.AuthorityFactoryCreateDiscoveredInstance, Y);
  let X = sK.transformCIAMAuthority(h31(A)),
    I = new sK(X, Q, B, G, Z, Y, J);
  try {
    return await y5(I.resolveEndpointsAsync.bind(I), N0.AuthorityResolveEndpointsAsync, Z, J, Y)(), I
  } catch (D) {
    throw YQ(TC)
  }
}
// @from(Ln 232288, Col 4)
l50 = w(() => {
  g31();
  aW();
  QS();
  lm();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232295, Col 4)
xC
// @from(Ln 232296, Col 4)
fWA = w(() => {
  U_(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  xC = class xC extends n6 {
    constructor(A, Q, B, G, Z) {
      super(A, Q, B);
      this.name = "ServerError", this.errorNo = G, this.status = Z, Object.setPrototypeOf(this, xC.prototype)
    }
  }
})
// @from(Ln 232306, Col 0)
function hWA(A, Q, B) {
  return {
    clientId: A,
    authority: Q.authority,
    scopes: Q.scopes,
    homeAccountIdentifier: B,
    claims: Q.claims,
    authenticationScheme: Q.authenticationScheme,
    resourceRequestMethod: Q.resourceRequestMethod,
    resourceRequestUri: Q.resourceRequestUri,
    shrClaims: Q.shrClaims,
    sshKid: Q.sshKid,
    embeddedClientId: Q.embeddedClientId || Q.tokenBodyParameters?.clientId
  }
}
// @from(Ln 232321, Col 4)
m31 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232324, Col 0)
class im {
  static generateThrottlingStorageKey(A) {
    return `${ok.THROTTLING_PREFIX}.${JSON.stringify(A)}`
  }
  static preProcess(A, Q, B) {
    let G = im.generateThrottlingStorageKey(Q),
      Z = A.getThrottlingCache(G);
    if (Z) {
      if (Z.throttleTime < Date.now()) {
        A.removeItem(G, B);
        return
      }
      throw new xC(Z.errorCodes?.join(" ") || m0.EMPTY_STRING, Z.errorMessage, Z.subError)
    }
  }
  static postProcess(A, Q, B, G) {
    if (im.checkResponseStatus(B) || im.checkResponseForRetryAfter(B)) {
      let Z = {
        throttleTime: im.calculateThrottleTime(parseInt(B.headers[pY.RETRY_AFTER])),
        error: B.body.error,
        errorCodes: B.body.error_codes,
        errorMessage: B.body.error_description,
        subError: B.body.suberror
      };
      A.setThrottlingCache(im.generateThrottlingStorageKey(Q), Z, G)
    }
  }
  static checkResponseStatus(A) {
    return A.status === 429 || A.status >= 500 && A.status < 600
  }
  static checkResponseForRetryAfter(A) {
    if (A.headers) return A.headers.hasOwnProperty(pY.RETRY_AFTER) && (A.status < 200 || A.status >= 300);
    return !1
  }
  static calculateThrottleTime(A) {
    let Q = A <= 0 ? 0 : A,
      B = Date.now() / 1000;
    return Math.floor(Math.min(B + (Q || ok.DEFAULT_THROTTLE_TIME_SECONDS), B + ok.DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000)
  }
  static removeThrottle(A, Q, B, G) {
    let Z = hWA(Q, B, G),
      Y = this.generateThrottlingStorageKey(Z);
    A.removeItem(Y, B.correlationId)
  }
}
// @from(Ln 232369, Col 4)
HpB = w(() => {
  lY();
  fWA();
  m31(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232374, Col 4)
d31
// @from(Ln 232375, Col 4)
EpB = w(() => {
  U_(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  d31 = class d31 extends n6 {
    constructor(A, Q, B) {
      super(A.errorCode, A.errorMessage, A.subError);
      Object.setPrototypeOf(this, d31.prototype), this.name = "NetworkError", this.error = A, this.httpStatus = Q, this.responseHeaders = B
    }
  }
})
// @from(Ln 232384, Col 0)
class kz {
  constructor(A, Q) {
    this.config = GpB(A), this.logger = new FN(this.config.loggerOptions, z31, OWA), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = Q
  }
  createTokenRequestHeaders(A) {
    let Q = {};
    if (Q[pY.CONTENT_TYPE] = m0.URL_FORM_CONTENT_TYPE, !this.config.systemOptions.preventCorsPreflight && A) switch (A.type) {
      case PC.HOME_ACCOUNT_ID:
        try {
          let B = sk(A.credential);
          Q[pY.CCS_HEADER] = `Oid:${B.uid}@${B.utid}`
        } catch (B) {
          this.logger.verbose("Could not parse home account ID for CCS Header: " + B)
        }
        break;
      case PC.UPN:
        Q[pY.CCS_HEADER] = `UPN: ${A.credential}`;
        break
    }
    return Q
  }
  async executePostToTokenEndpoint(A, Q, B, G, Z, Y) {
    if (Y) this.performanceClient?.addQueueMeasurement(Y, Z);
    let J = await this.sendPostRequest(G, A, {
      body: Q,
      headers: B
    }, Z);
    if (this.config.serverTelemetryManager && J.status < 500 && J.status !== 429) this.config.serverTelemetryManager.clearTelemetryCache();
    return J
  }
  async sendPostRequest(A, Q, B, G) {
    im.preProcess(this.cacheManager, A, G);
    let Z;
    try {
      Z = await y5(this.networkClient.sendPostRequestAsync.bind(this.networkClient), N0.NetworkClientSendPostRequestAsync, this.logger, this.performanceClient, G)(Q, B);
      let Y = Z.headers || {};
      this.performanceClient?.addFields({
        refreshTokenSize: Z.body.refresh_token?.length || 0,
        httpVerToken: Y[pY.X_MS_HTTP_VERSION] || "",
        requestId: Y[pY.X_MS_REQUEST_ID] || ""
      }, G)
    } catch (Y) {
      if (Y instanceof d31) {
        let J = Y.responseHeaders;
        if (J) this.performanceClient?.addFields({
          httpVerToken: J[pY.X_MS_HTTP_VERSION] || "",
          requestId: J[pY.X_MS_REQUEST_ID] || "",
          contentTypeHeader: J[pY.CONTENT_TYPE] || void 0,
          contentLengthHeader: J[pY.CONTENT_LENGTH] || void 0,
          httpStatus: Y.httpStatus
        }, G);
        throw Y.error
      }
      if (Y instanceof n6) throw Y;
      else throw YQ(_2A)
    }
    return im.postProcess(this.cacheManager, A, Z, G), Z
  }
  async updateAuthority(A, Q) {
    this.performanceClient?.addQueueMeasurement(N0.UpdateTokenEndpointAuthority, Q);
    let B = `https://${A}/${this.authority.tenant}/`,
      G = await p50(B, this.networkClient, this.cacheManager, this.authority.options, this.logger, Q, this.performanceClient);
    this.authority = G
  }
  createTokenQueryParameters(A) {
    let Q = new Map;
    if (A.embeddedClientId) pm(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
    if (A.tokenQueryParameters) cm(Q, A.tokenQueryParameters);
    return Y9A(Q, A.correlationId), A9A(Q, A.correlationId, this.performanceClient), tk(Q)
  }
}
// @from(Ln 232455, Col 4)
gPA = w(() => {
  _31();
  E31();
  lY();
  $31();
  wPA();
  jWA();
  vWA();
  s2A();
  l50();
  QS();
  HpB();
  U_();
  aW();
  EpB();
  lm();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232473, Col 4)
p31 = {}
// @from(Ln 232484, Col 4)
ko = "no_tokens_found"
// @from(Ln 232485, Col 2)
uPA = "native_account_unavailable"
// @from(Ln 232486, Col 2)
mPA = "refresh_token_expired"
// @from(Ln 232487, Col 2)
c31 = "ux_not_allowed"
// @from(Ln 232488, Col 2)
i50 = "interaction_required"
// @from(Ln 232489, Col 2)
n50 = "consent_required"
// @from(Ln 232490, Col 2)
a50 = "login_required"
// @from(Ln 232491, Col 2)
bo = "bad_token"
// @from(Ln 232492, Col 4)
l31 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232496, Col 0)
function n31(A, Q, B) {
  let G = !!A && zpB.indexOf(A) > -1,
    Z = !!B && Gh8.indexOf(B) > -1,
    Y = !!Q && zpB.some((J) => {
      return Q.indexOf(J) > -1
    });
  return G || Y || Z
}
// @from(Ln 232505, Col 0)
function a31(A) {
  return new AO(A, i31[A])
}
// @from(Ln 232508, Col 4)
zpB
// @from(Ln 232508, Col 9)
Gh8
// @from(Ln 232508, Col 14)
i31
// @from(Ln 232508, Col 19)
o50
// @from(Ln 232508, Col 24)
AO
// @from(Ln 232509, Col 4)
dPA = w(() => {
  lY();
  U_();
  l31(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  zpB = [i50, n50, a50, bo, c31], Gh8 = ["message_only", "additional_action", "basic_action", "user_password_expired", "consent_required", "bad_token"], i31 = {
    [ko]: "No refresh token found in the cache. Please sign-in.",
    [uPA]: "The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",
    [mPA]: "Refresh token has expired.",
    [bo]: "Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve.",
    [c31]: "`canShowUI` flag in Edge was set to false. User interaction required on web page. Please invoke an interactive API to resolve."
  }, o50 = {
    noTokensFoundError: {
      code: ko,
      desc: i31[ko]
    },
    native_account_unavailable: {
      code: uPA,
      desc: i31[uPA]
    },
    bad_token: {
      code: bo,
      desc: i31[bo]
    }
  };
  AO = class AO extends n6 {
    constructor(A, Q, B, G, Z, Y, J, X) {
      super(A, Q, B);
      Object.setPrototypeOf(this, AO.prototype), this.timestamp = G || m0.EMPTY_STRING, this.traceId = Z || m0.EMPTY_STRING, this.correlationId = Y || m0.EMPTY_STRING, this.claims = J || m0.EMPTY_STRING, this.name = "InteractionRequiredAuthError", this.errorNo = X
    }
  }
})
// @from(Ln 232540, Col 0)
class o31 {
  static setRequestState(A, Q, B) {
    let G = o31.generateLibraryState(A, B);
    return Q ? `${G}${m0.RESOURCE_DELIM}${Q}` : G
  }
  static generateLibraryState(A, Q) {
    if (!A) throw YQ(Ro);
    let B = {
      id: A.createNewGuid()
    };
    if (Q) B.meta = Q;
    let G = JSON.stringify(B);
    return A.base64Encode(G)
  }
  static parseRequestState(A, Q) {
    if (!A) throw YQ(Ro);
    if (!Q) throw YQ(AS);
    try {
      let B = Q.split(m0.RESOURCE_DELIM),
        G = B[0],
        Z = B.length > 1 ? B.slice(1).join(m0.RESOURCE_DELIM) : m0.EMPTY_STRING,
        Y = A.base64Decode(G),
        J = JSON.parse(Y);
      return {
        userRequestState: Z || m0.EMPTY_STRING,
        libraryState: J
      }
    } catch (B) {
      throw YQ(AS)
    }
  }
}
// @from(Ln 232572, Col 4)
$pB = w(() => {
  lY();
  aW();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232577, Col 0)
class X9A {
  constructor(A, Q) {
    this.cryptoUtils = A, this.performanceClient = Q
  }
  async generateCnf(A, Q) {
    this.performanceClient?.addQueueMeasurement(N0.PopTokenGenerateCnf, A.correlationId);
    let B = await y5(this.generateKid.bind(this), N0.PopTokenGenerateCnf, Q, this.performanceClient, A.correlationId)(A),
      G = this.cryptoUtils.base64UrlEncode(JSON.stringify(B));
    return {
      kid: B.kid,
      reqCnfString: G
    }
  }
  async generateKid(A) {
    return this.performanceClient?.addQueueMeasurement(N0.PopTokenGenerateKid, A.correlationId), {
      kid: await this.cryptoUtils.getPublicKeyThumbprint(A),
      xms_ksl: Zh8.SW
    }
  }
  async signPopToken(A, Q, B) {
    return this.signPayload(A, Q, B)
  }
  async signPayload(A, Q, B, G) {
    let {
      resourceRequestMethod: Z,
      resourceRequestUri: Y,
      shrClaims: J,
      shrNonce: X,
      shrOptions: I
    } = B, W = (Y ? new U3(Y) : void 0)?.getUrlComponents();
    return this.cryptoUtils.signJwt({
      at: A,
      ts: eL(),
      m: Z?.toUpperCase(),
      u: W?.HostNameAndPort,
      nonce: X || this.cryptoUtils.createNewGuid(),
      p: W?.AbsolutePath,
      q: W?.QueryString ? [
        [], W.QueryString
      ] : void 0,
      client_claims: J || void 0,
      ...G
    }, Q, I, B.correlationId)
  }
}
// @from(Ln 232622, Col 4)
Zh8
// @from(Ln 232623, Col 4)
r31 = w(() => {
  vo();
  xo();
  QS();
  lm(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  Zh8 = {
    SW: "sw"
  }
})
// @from(Ln 232632, Col 0)
class N_ {
  constructor(A, Q) {
    this.cache = A, this.hasChanged = Q
  }
  get cacheHasChanged() {
    return this.hasChanged
  }
  get tokenCache() {
    return this.cache
  }
}
// @from(Ln 232643, Col 4)
r50 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232646, Col 0)
class oI {
  constructor(A, Q, B, G, Z, Y, J) {
    this.clientId = A, this.cacheStorage = Q, this.cryptoObj = B, this.logger = G, this.serializableCache = Z, this.persistencePlugin = Y, this.performanceClient = J
  }
  validateTokenResponse(A, Q) {
    if (A.error || A.error_description || A.suberror) {
      let B = `Error(s): ${A.error_codes||m0.NOT_AVAILABLE} - Timestamp: ${A.timestamp||m0.NOT_AVAILABLE} - Description: ${A.error_description||m0.NOT_AVAILABLE} - Correlation ID: ${A.correlation_id||m0.NOT_AVAILABLE} - Trace ID: ${A.trace_id||m0.NOT_AVAILABLE}`,
        G = A.error_codes?.length ? A.error_codes[0] : void 0,
        Z = new xC(A.error, B, A.suberror, G, A.status);
      if (Q && A.status && A.status >= i6.SERVER_ERROR_RANGE_START && A.status <= i6.SERVER_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${Z}`);
        return
      } else if (Q && A.status && A.status >= i6.CLIENT_ERROR_RANGE_START && A.status <= i6.CLIENT_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${Z}`);
        return
      }
      if (n31(A.error, A.error_description, A.suberror)) throw new AO(A.error, A.error_description, A.suberror, A.timestamp || m0.EMPTY_STRING, A.trace_id || m0.EMPTY_STRING, A.correlation_id || m0.EMPTY_STRING, A.claims || m0.EMPTY_STRING, G);
      throw Z
    }
  }
  async handleServerTokenResponse(A, Q, B, G, Z, Y, J, X, I) {
    this.performanceClient?.addQueueMeasurement(N0.HandleServerTokenResponse, A.correlation_id);
    let D;
    if (A.id_token) {
      if (D = mm(A.id_token || m0.EMPTY_STRING, this.cryptoObj.base64Decode), Z && Z.nonce) {
        if (D.nonce !== Z.nonce) throw YQ(S2A)
      }
      if (G.maxAge || G.maxAge === 0) {
        let F = D.auth_time;
        if (!F) throw YQ(vm);
        UPA(F, G.maxAge)
      }
    }
    this.homeAccountIdentifier = oW.generateHomeAccountId(A.client_info || m0.EMPTY_STRING, Q.authorityType, this.logger, this.cryptoObj, D);
    let W;
    if (!!Z && !!Z.state) W = o31.parseRequestState(this.cryptoObj, Z.state);
    A.key_id = A.key_id || G.sshKid || void 0;
    let K = this.generateCacheRecord(A, Q, B, G, D, Y, Z),
      V;
    try {
      if (this.persistencePlugin && this.serializableCache) this.logger.verbose("Persistence enabled, calling beforeCacheAccess"), V = new N_(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(V);
      if (J && !X && K.account) {
        let F = this.cacheStorage.generateAccountKey(oW.getAccountInfo(K.account));
        if (!this.cacheStorage.getAccount(F, G.correlationId)) return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"), await oI.generateAuthenticationResult(this.cryptoObj, Q, K, !1, G, D, W, void 0, I)
      }
      await this.cacheStorage.saveCacheRecord(K, G.correlationId, v80(D || {}), G.storeInCache)
    } finally {
      if (this.persistencePlugin && this.serializableCache && V) this.logger.verbose("Persistence enabled, calling afterCacheAccess"), await this.persistencePlugin.afterCacheAccess(V)
    }
    return oI.generateAuthenticationResult(this.cryptoObj, Q, K, !1, G, D, W, A, I)
  }
  generateCacheRecord(A, Q, B, G, Z, Y, J) {
    let X = Q.getPreferredCache();
    if (!X) throw YQ(bm);
    let I = N31(Z),
      D, W;
    if (A.id_token && !!Z) D = u50(this.homeAccountIdentifier, X, A.id_token, this.clientId, I || ""), W = CpB(this.cacheStorage, Q, this.homeAccountIdentifier, this.cryptoObj.base64Decode, G.correlationId, Z, A.client_info, X, I, J, void 0, this.logger);
    let K = null;
    if (A.access_token) {
      let H = A.scope ? aI.fromString(A.scope) : new aI(G.scopes || []),
        E = (typeof A.expires_in === "string" ? parseInt(A.expires_in, 10) : A.expires_in) || 0,
        z = (typeof A.ext_expires_in === "string" ? parseInt(A.ext_expires_in, 10) : A.ext_expires_in) || 0,
        $ = (typeof A.refresh_in === "string" ? parseInt(A.refresh_in, 10) : A.refresh_in) || void 0,
        O = B + E,
        L = O + z,
        M = $ && $ > 0 ? B + $ : void 0;
      K = m50(this.homeAccountIdentifier, X, A.access_token, this.clientId, I || Q.tenant || "", H.printScopes(), O, L, this.cryptoObj.base64Decode, M, A.token_type, Y, A.key_id, G.claims, G.requestedClaimsHash)
    }
    let V = null;
    if (A.refresh_token) {
      let H;
      if (A.refresh_token_expires_in) {
        let E = typeof A.refresh_token_expires_in === "string" ? parseInt(A.refresh_token_expires_in, 10) : A.refresh_token_expires_in;
        H = B + E
      }
      V = d50(this.homeAccountIdentifier, X, A.refresh_token, this.clientId, A.foci, Y, H)
    }
    let F = null;
    if (A.foci) F = {
      clientId: this.clientId,
      environment: X,
      familyId: A.foci
    };
    return {
      account: W,
      idToken: D,
      accessToken: K,
      refreshToken: V,
      appMetadata: F
    }
  }
  static async generateAuthenticationResult(A, Q, B, G, Z, Y, J, X, I) {
    let D = m0.EMPTY_STRING,
      W = [],
      K = null,
      V, F, H = m0.EMPTY_STRING;
    if (B.accessToken) {
      if (B.accessToken.tokenType === J5.POP && !Z.popKid) {
        let O = new X9A(A),
          {
            secret: L,
            keyId: M
          } = B.accessToken;
        if (!M) throw YQ(m2A);
        D = await O.signPopToken(L, M, Z)
      } else D = B.accessToken.secret;
      if (W = aI.fromString(B.accessToken.target).asArray(), K = fPA(B.accessToken.expiresOn), V = fPA(B.accessToken.extendedExpiresOn), B.accessToken.refreshOn) F = fPA(B.accessToken.refreshOn)
    }
    if (B.appMetadata) H = B.appMetadata.familyId === No ? No : "";
    let E = Y?.oid || Y?.sub || "",
      z = Y?.tid || "";
    if (X?.spa_accountid && !!B.account) B.account.nativeAccountId = X?.spa_accountid;
    let $ = B.account ? U31(oW.getAccountInfo(B.account), void 0, Y, B.idToken?.secret) : null;
    return {
      authority: Q.canonicalAuthority,
      uniqueId: E,
      tenantId: z,
      scopes: W,
      account: $,
      idToken: B?.idToken?.secret || "",
      idTokenClaims: Y || {},
      accessToken: D,
      fromCache: G,
      expiresOn: K,
      extExpiresOn: V,
      refreshOn: F,
      correlationId: Z.correlationId,
      requestId: I || m0.EMPTY_STRING,
      familyId: H,
      tokenType: B.accessToken?.tokenType || m0.EMPTY_STRING,
      state: J ? J.userRequestState : m0.EMPTY_STRING,
      cloudGraphHostName: B.account?.cloudGraphHostName || m0.EMPTY_STRING,
      msGraphHost: B.account?.msGraphHost || m0.EMPTY_STRING,
      code: X?.spa_code,
      fromNativeBroker: !1
    }
  }
}
// @from(Ln 232787, Col 0)
function CpB(A, Q, B, G, Z, Y, J, X, I, D, W, K) {
  K?.verbose("setCachedAccount called");
  let F = A.getAccountKeys().find((O) => {
      return O.startsWith(B)
    }),
    H = null;
  if (F) H = A.getAccount(F, Z);
  let E = H || oW.createAccount({
      homeAccountId: B,
      idTokenClaims: Y,
      clientInfo: J,
      environment: X,
      cloudGraphHostName: D?.cloud_graph_host_name,
      msGraphHost: D?.msgraph_host,
      nativeAccountId: W
    }, Q, G),
    z = E.tenantProfiles || [],
    $ = I || E.realm;
  if ($ && !z.find((O) => {
      return O.tenantId === $
    })) {
    let O = $PA(B, E.localAccountId, $, Y);
    z.push(O)
  }
  return E.tenantProfiles = z, E
}
// @from(Ln 232813, Col 4)
cPA = w(() => {
  aW();
  fWA();
  zPA();
  w31();
  dPA();
  $pB();
  lY();
  r31();
  r50();
  QS();
  TWA();
  y80();
  q31();
  f31();
  vo();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232831, Col 0)
async function yC(A, Q, B) {
  if (typeof A === "string") return A;
  else return A({
    clientId: Q,
    tokenEndpoint: B
  })
}
// @from(Ln 232838, Col 4)
s31 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 232841, Col 4)
t31