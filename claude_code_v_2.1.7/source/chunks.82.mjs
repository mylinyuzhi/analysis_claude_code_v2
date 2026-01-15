
// @from(Ln 238625, Col 4)
CoB = w(() => {
  z9A();
  MJ();
  $9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  C9A = class C9A extends $N {
    constructor(A, Q, B, G, Z, Y, J) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = Y, this.identityHeader = J
    }
    static getEnvironmentVariables() {
      let A = process.env[Q6.IDENTITY_ENDPOINT],
        Q = process.env[Q6.IDENTITY_HEADER];
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z) {
      let [Y, J] = C9A.getEnvironmentVariables();
      if (!Y || !J) return A.info(`[Managed Identity] ${L6.APP_SERVICE} managed identity is unavailable because one or both of the '${Q6.IDENTITY_HEADER}' and '${Q6.IDENTITY_ENDPOINT}' environment variables are not defined.`), null;
      let X = C9A.getValidatedEnvVariableUrlString(Q6.IDENTITY_ENDPOINT, Y, L6.APP_SERVICE, A);
      return A.info(`[Managed Identity] Environment variables validation passed for ${L6.APP_SERVICE} managed identity. Endpoint URI: ${X}. Creating ${L6.APP_SERVICE} managed identity.`), new C9A(A, Q, B, G, Z, Y, J)
    }
    createRequest(A, Q) {
      let B = new QO(OJ.GET, this.identityEndpoint);
      if (B.headers[HN.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, B.queryParameters[rW.API_VERSION] = yl8, B.queryParameters[rW.RESOURCE] = A, Q.idType !== VI.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType)] = Q.id;
      return B
    }
  }
})
// @from(Ln 238659, Col 4)
hl8 = "2019-11-01"
// @from(Ln 238660, Col 2)
qoB = "http://127.0.0.1:40342/metadata/identity/oauth2/token"
// @from(Ln 238661, Col 2)
NoB = "N/A: himds executable exists"
// @from(Ln 238662, Col 2)
woB
// @from(Ln 238662, Col 7)
gl8
// @from(Ln 238662, Col 12)
mo
// @from(Ln 238663, Col 4)
LoB = w(() => {
  xG();
  $9A();
  z9A();
  uWA();
  MJ();
  D9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  woB = {
    win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
    linux: "/var/opt/azcmagent/tokens/"
  }, gl8 = {
    win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
    linux: "/opt/azcmagent/bin/himds"
  };
  mo = class mo extends $N {
    constructor(A, Q, B, G, Z, Y) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[Q6.IDENTITY_ENDPOINT],
        Q = process.env[Q6.IMDS_ENDPOINT];
      if (!A || !Q) {
        let B = gl8[process.platform];
        try {
          vl8(B, UoB.F_OK | UoB.R_OK), A = qoB, Q = NoB
        } catch (G) {}
      }
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z, Y) {
      let [J, X] = mo.getEnvironmentVariables();
      if (!J || !X) return A.info(`[Managed Identity] ${L6.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${Q6.IDENTITY_ENDPOINT}' and '${Q6.IMDS_ENDPOINT}' are not defined. ${L6.AZURE_ARC} managed identity is also unavailable through file detection.`), null;
      if (X === NoB) A.info(`[Managed Identity] ${L6.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${L6.AZURE_ARC} endpoint: ${qoB}. Creating ${L6.AZURE_ARC} managed identity.`);
      else {
        let I = mo.getValidatedEnvVariableUrlString(Q6.IDENTITY_ENDPOINT, J, L6.AZURE_ARC, A);
        I.endsWith("/") && I.slice(0, -1), mo.getValidatedEnvVariableUrlString(Q6.IMDS_ENDPOINT, X, L6.AZURE_ARC, A), A.info(`[Managed Identity] Environment variables validation passed for ${L6.AZURE_ARC} managed identity. Endpoint URI: ${I}. Creating ${L6.AZURE_ARC} managed identity.`)
      }
      if (Y.idType !== VI.SYSTEM_ASSIGNED) throw dD(I81);
      return new mo(A, Q, B, G, Z, J)
    }
    createRequest(A) {
      let Q = new QO(OJ.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
      return Q.headers[HN.METADATA_HEADER_NAME] = "true", Q.queryParameters[rW.API_VERSION] = hl8, Q.queryParameters[rW.RESOURCE] = A, Q
    }
    async getServerTokenResponseAsync(A, Q, B, G) {
      let Z;
      if (A.status === i6.UNAUTHORIZED) {
        let Y = A.headers["www-authenticate"];
        if (!Y) throw dD(K81);
        if (!Y.includes("Basic realm=")) throw dD(V81);
        let J = Y.split("Basic realm=")[1];
        if (!woB.hasOwnProperty(process.platform)) throw dD(X81);
        let X = woB[process.platform],
          I = fl8.basename(J);
        if (!I.endsWith(".key")) throw dD(Z81);
        if (X + I !== J) throw dD(Y81);
        let D;
        try {
          D = await kl8(J).size
        } catch (V) {
          throw dD(nPA)
        }
        if (D > ypB) throw dD(J81);
        let W;
        try {
          W = bl8(J, aH.UTF8)
        } catch (V) {
          throw dD(nPA)
        }
        let K = `Basic ${W}`;
        this.logger.info("[Managed Identity] Adding authorization header to the request."), B.headers[HN.AUTHORIZATION_HEADER_NAME] = K;
        try {
          Z = await Q.sendGetRequestAsync(B.computeUri(), G)
        } catch (V) {
          if (V instanceof n6) throw V;
          else throw YQ(xZ.networkError)
        }
      }
      return this.getServerTokenResponse(Z || A)
    }
  }
})
// @from(Ln 238746, Col 4)
U9A
// @from(Ln 238747, Col 4)
OoB = w(() => {
  $9A();
  z9A();
  MJ();
  uWA();
  D9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  U9A = class U9A extends $N {
    constructor(A, Q, B, G, Z, Y) {
      super(A, Q, B, G, Z);
      this.msiEndpoint = Y
    }
    static getEnvironmentVariables() {
      return [process.env[Q6.MSI_ENDPOINT]]
    }
    static tryCreate(A, Q, B, G, Z, Y) {
      let [J] = U9A.getEnvironmentVariables();
      if (!J) return A.info(`[Managed Identity] ${L6.CLOUD_SHELL} managed identity is unavailable because the '${Q6.MSI_ENDPOINT} environment variable is not defined.`), null;
      let X = U9A.getValidatedEnvVariableUrlString(Q6.MSI_ENDPOINT, J, L6.CLOUD_SHELL, A);
      if (A.info(`[Managed Identity] Environment variable validation passed for ${L6.CLOUD_SHELL} managed identity. Endpoint URI: ${X}. Creating ${L6.CLOUD_SHELL} managed identity.`), Y.idType !== VI.SYSTEM_ASSIGNED) throw dD(D81);
      return new U9A(A, Q, B, G, Z, J)
    }
    createRequest(A) {
      let Q = new QO(OJ.POST, this.msiEndpoint);
      return Q.headers[HN.METADATA_HEADER_NAME] = "true", Q.bodyParameters[rW.RESOURCE] = A, Q
    }
  }
})
// @from(Ln 238774, Col 0)
class AG0 {
  constructor(A, Q, B) {
    this.minExponentialBackoff = A, this.maxExponentialBackoff = Q, this.exponentialDeltaBackoff = B
  }
  calculateDelay(A) {
    if (A === 0) return this.minExponentialBackoff;
    return Math.min(Math.pow(2, A - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff)
  }
}
// @from(Ln 238783, Col 4)
MoB = w(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 238786, Col 0)
class q9A {
  constructor() {
    this.exponentialRetryStrategy = new AG0(q9A.MIN_EXPONENTIAL_BACKOFF_MS, q9A.MAX_EXPONENTIAL_BACKOFF_MS, q9A.EXPONENTIAL_DELTA_BACKOFF_MS)
  }
  static get MIN_EXPONENTIAL_BACKOFF_MS() {
    return cl8
  }
  static get MAX_EXPONENTIAL_BACKOFF_MS() {
    return pl8
  }
  static get EXPONENTIAL_DELTA_BACKOFF_MS() {
    return ll8
  }
  static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
    return il8
  }
  set isNewRequest(A) {
    this._isNewRequest = A
  }
  async pauseForRetry(A, Q, B) {
    if (this._isNewRequest) this._isNewRequest = !1, this.maxRetries = A === i6.GONE ? dl8 : ml8;
    if ((ul8.includes(A) || A >= i6.SERVER_ERROR_RANGE_START && A <= i6.SERVER_ERROR_RANGE_END && Q < this.maxRetries) && Q < this.maxRetries) {
      let G = A === i6.GONE ? q9A.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(Q);
      return B.verbose(`Retrying request in ${G}ms (retry attempt: ${Q+1})`), await new Promise((Z) => {
        return setTimeout(Z, G)
      }), !0
    }
    return !1
  }
}
// @from(Ln 238816, Col 4)
ul8
// @from(Ln 238816, Col 9)
ml8 = 3
// @from(Ln 238817, Col 2)
dl8 = 7
// @from(Ln 238818, Col 2)
cl8 = 1000
// @from(Ln 238819, Col 2)
pl8 = 4000
// @from(Ln 238820, Col 2)
ll8 = 2000
// @from(Ln 238821, Col 2)
il8 = 1e4
// @from(Ln 238822, Col 4)
RoB = w(() => {
  z81();
  MoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  ul8 = [i6.NOT_FOUND, i6.REQUEST_TIMEOUT, i6.GONE, i6.TOO_MANY_REQUESTS]
})
// @from(Ln 238827, Col 4)
_oB = "/metadata/identity/oauth2/token"
// @from(Ln 238828, Col 2)
nl8
// @from(Ln 238828, Col 7)
al8 = "2018-02-01"
// @from(Ln 238829, Col 2)
CSA
// @from(Ln 238830, Col 4)
joB = w(() => {
  $9A();
  z9A();
  MJ();
  RoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  nl8 = `http://169.254.169.254${_oB}`;
  CSA = class CSA extends $N {
    constructor(A, Q, B, G, Z, Y) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = Y
    }
    static tryCreate(A, Q, B, G, Z) {
      let Y;
      if (process.env[Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST]) A.info(`[Managed Identity] Environment variable ${Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${L6.IMDS} returned endpoint: ${process.env[Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`), Y = CSA.getValidatedEnvVariableUrlString(Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${_oB}`, L6.IMDS, A);
      else A.info(`[Managed Identity] Unable to find ${Q6.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${L6.IMDS}, using the default endpoint.`), Y = nl8;
      return new CSA(A, Q, B, G, Z, Y)
    }
    createRequest(A, Q) {
      let B = new QO(OJ.GET, this.identityEndpoint);
      if (B.headers[HN.METADATA_HEADER_NAME] = "true", B.queryParameters[rW.API_VERSION] = al8, B.queryParameters[rW.RESOURCE] = A, Q.idType !== VI.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType, !0)] = Q.id;
      return B.retryPolicy = new q9A, B
    }
  }
})
// @from(Ln 238854, Col 4)
ol8 = "2019-07-01-preview"
// @from(Ln 238855, Col 2)
N9A
// @from(Ln 238856, Col 4)
ToB = w(() => {
  $9A();
  z9A();
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  N9A = class N9A extends $N {
    constructor(A, Q, B, G, Z, Y, J) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = Y, this.identityHeader = J
    }
    static getEnvironmentVariables() {
      let A = process.env[Q6.IDENTITY_ENDPOINT],
        Q = process.env[Q6.IDENTITY_HEADER],
        B = process.env[Q6.IDENTITY_SERVER_THUMBPRINT];
      return [A, Q, B]
    }
    static tryCreate(A, Q, B, G, Z, Y) {
      let [J, X, I] = N9A.getEnvironmentVariables();
      if (!J || !X || !I) return A.info(`[Managed Identity] ${L6.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${Q6.IDENTITY_HEADER}', '${Q6.IDENTITY_ENDPOINT}' or '${Q6.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`), null;
      let D = N9A.getValidatedEnvVariableUrlString(Q6.IDENTITY_ENDPOINT, J, L6.SERVICE_FABRIC, A);
      if (A.info(`[Managed Identity] Environment variables validation passed for ${L6.SERVICE_FABRIC} managed identity. Endpoint URI: ${D}. Creating ${L6.SERVICE_FABRIC} managed identity.`), Y.idType !== VI.SYSTEM_ASSIGNED) A.warning(`[Managed Identity] ${L6.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`);
      return new N9A(A, Q, B, G, Z, J, X)
    }
    createRequest(A, Q) {
      let B = new QO(OJ.GET, this.identityEndpoint);
      if (B.headers[HN.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, B.queryParameters[rW.API_VERSION] = ol8, B.queryParameters[rW.RESOURCE] = A, Q.idType !== VI.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType)] = Q.id;
      return B
    }
  }
})
// @from(Ln 238885, Col 4)
rl8 = "2017-09-01"
// @from(Ln 238886, Col 2)
sl8
// @from(Ln 238886, Col 7)
w9A
// @from(Ln 238887, Col 4)
PoB = w(() => {
  z9A();
  MJ();
  $9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  sl8 = `Only client id is supported for user-assigned managed identity in ${L6.MACHINE_LEARNING}.`;
  w9A = class w9A extends $N {
    constructor(A, Q, B, G, Z, Y, J) {
      super(A, Q, B, G, Z);
      this.msiEndpoint = Y, this.secret = J
    }
    static getEnvironmentVariables() {
      let A = process.env[Q6.MSI_ENDPOINT],
        Q = process.env[Q6.MSI_SECRET];
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z) {
      let [Y, J] = w9A.getEnvironmentVariables();
      if (!Y || !J) return A.info(`[Managed Identity] ${L6.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${Q6.MSI_ENDPOINT}' and '${Q6.MSI_SECRET}' environment variables are not defined.`), null;
      let X = w9A.getValidatedEnvVariableUrlString(Q6.MSI_ENDPOINT, Y, L6.MACHINE_LEARNING, A);
      return A.info(`[Managed Identity] Environment variables validation passed for ${L6.MACHINE_LEARNING} managed identity. Endpoint URI: ${X}. Creating ${L6.MACHINE_LEARNING} managed identity.`), new w9A(A, Q, B, G, Z, Y, J)
    }
    createRequest(A, Q) {
      let B = new QO(OJ.GET, this.msiEndpoint);
      if (B.headers[HN.METADATA_HEADER_NAME] = "true", B.headers[HN.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, B.queryParameters[rW.API_VERSION] = rl8, B.queryParameters[rW.RESOURCE] = A, Q.idType === VI.SYSTEM_ASSIGNED) B.queryParameters[E9A.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[Q6.DEFAULT_IDENTITY_CLIENT_ID];
      else if (Q.idType === VI.USER_ASSIGNED_CLIENT_ID) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType, !1, !0)] = Q.id;
      else throw Error(sl8);
      return B
    }
  }
})
// @from(Ln 238917, Col 0)
class rm {
  constructor(A, Q, B, G, Z) {
    this.logger = A, this.nodeStorage = Q, this.networkClient = B, this.cryptoProvider = G, this.disableInternalRetries = Z
  }
  async sendManagedIdentityTokenRequest(A, Q, B, G) {
    if (!rm.identitySource) rm.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, Q);
    return rm.identitySource.acquireTokenWithManagedIdentity(A, Q, B, G)
  }
  allEnvironmentVariablesAreDefined(A) {
    return Object.values(A).every((Q) => {
      return Q !== void 0
    })
  }
  getManagedIdentitySource() {
    return rm.sourceName = this.allEnvironmentVariablesAreDefined(N9A.getEnvironmentVariables()) ? L6.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(C9A.getEnvironmentVariables()) ? L6.APP_SERVICE : this.allEnvironmentVariablesAreDefined(w9A.getEnvironmentVariables()) ? L6.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(U9A.getEnvironmentVariables()) ? L6.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(mo.getEnvironmentVariables()) ? L6.AZURE_ARC : L6.DEFAULT_TO_IMDS, rm.sourceName
  }
  selectManagedIdentitySource(A, Q, B, G, Z, Y) {
    let J = N9A.tryCreate(A, Q, B, G, Z, Y) || C9A.tryCreate(A, Q, B, G, Z) || w9A.tryCreate(A, Q, B, G, Z) || U9A.tryCreate(A, Q, B, G, Z, Y) || mo.tryCreate(A, Q, B, G, Z, Y) || CSA.tryCreate(A, Q, B, G, Z);
    if (!J) throw dD(W81);
    return J
  }
}
// @from(Ln 238939, Col 4)
SoB = w(() => {
  CoB();
  LoB();
  OoB();
  joB();
  ToB();
  uWA();
  MJ();
  PoB();
  D9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 238950, Col 0)
class Bb {
  constructor(A) {
    this.config = lpB(A || {}), this.logger = new FN(this.config.system.loggerOptions, c81, JS);
    let Q = {
      canonicalAuthority: m0.DEFAULT_AUTHORITY
    };
    if (!Bb.nodeStorage) Bb.nodeStorage = new K9A(this.logger, this.config.managedIdentityId.id, LWA, Q);
    this.networkClient = this.config.system.networkClient, this.cryptoProvider = new om;
    let B = {
      protocolMode: vz.AAD,
      knownAuthorities: [t50],
      cloudDiscoveryMetadata: "",
      authorityMetadata: ""
    };
    this.fakeAuthority = new sK(t50, this.networkClient, Bb.nodeStorage, B, this.logger, this.cryptoProvider.createNewGuid(), void 0, !0), this.fakeClientCredentialClient = new H9A({
      authOptions: {
        clientId: this.config.managedIdentityId.id,
        authority: this.fakeAuthority
      }
    }), this.managedIdentityClient = new rm(this.logger, Bb.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new W9A
  }
  async acquireToken(A) {
    if (!A.resource) throw yZ(MWA.urlEmptyError);
    let Q = {
      forceRefresh: A.forceRefresh,
      resource: A.resource.replace("/.default", ""),
      scopes: [A.resource.replace("/.default", "")],
      authority: this.fakeAuthority.canonicalAuthority,
      correlationId: this.cryptoProvider.createNewGuid(),
      claims: A.claims,
      clientCapabilities: this.config.clientCapabilities
    };
    if (Q.forceRefresh) return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority);
    let [B, G] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(Q, this.config, this.cryptoProvider, this.fakeAuthority, Bb.nodeStorage);
    if (Q.claims) {
      let Z = this.managedIdentityClient.getManagedIdentitySource();
      if (B && tl8.includes(Z)) {
        let Y = this.hashUtils.sha256(B.accessToken).toString(aH.HEX);
        Q.revokedTokenSha256Hash = Y
      }
      return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority)
    }
    if (B) {
      if (G === YY.PROACTIVELY_REFRESHED) {
        this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
        let Z = !0;
        await this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority, Z)
      }
      return B
    } else return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority)
  }
  async acquireTokenFromManagedIdentity(A, Q, B, G) {
    return this.managedIdentityClient.sendManagedIdentityTokenRequest(A, Q, B, G)
  }
  getManagedIdentitySource() {
    return rm.sourceName || this.managedIdentityClient.getManagedIdentitySource()
  }
}
// @from(Ln 239008, Col 4)
tl8
// @from(Ln 239009, Col 4)
xoB = w(() => {
  xG();
  Z70();
  iWA();
  ePA();
  l81();
  SoB();
  $81();
  MJ();
  E81(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  tl8 = [L6.SERVICE_FABRIC]
})
// @from(Ln 239021, Col 0)
class QG0 {
  constructor(A, Q) {
    this.client = A, this.partitionManager = Q
  }
  async beforeCacheAccess(A) {
    let Q = await this.partitionManager.getKey(),
      B = await this.client.get(Q);
    A.tokenCache.deserialize(B)
  }
  async afterCacheAccess(A) {
    if (A.cacheHasChanged) {
      let Q = A.tokenCache.getKVStore(),
        B = Object.values(Q).filter((Z) => oW.isAccountEntity(Z)),
        G;
      if (B.length > 0) {
        let Z = B[0];
        G = await this.partitionManager.extractKey(Z)
      } else G = await this.partitionManager.getKey();
      await this.client.set(G, A.tokenCache.serialize())
    }
  }
}
// @from(Ln 239043, Col 4)
yoB = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 239046, Col 4)
BO = {}
// @from(Ln 239084, Col 4)
n81 = w(() => {
  _pB();
  KoB();
  VoB();
  p81();
  l81();
  r70();
  s70();
  xoB();
  a70();
  d81();
  F70();
  yoB();
  MJ();
  ePA();
  xG();
  iWA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 239102, Col 4)
voB = w(() => {
  n81()
})
// @from(Ln 239106, Col 0)
function nWA(A, Q, B) {
  let G = (Z) => {
    return USA.getToken.info(Z), new jm({
      scopes: Array.isArray(A) ? A : [A],
      getTokenOptions: B,
      message: Z
    })
  };
  if (!Q) throw G("No response");
  if (!Q.expiresOn) throw G('Response had no "expiresOn" property.');
  if (!Q.accessToken) throw G('Response had no "accessToken" property.')
}
// @from(Ln 239119, Col 0)
function BG0(A) {
  let Q = A === null || A === void 0 ? void 0 : A.authorityHost;
  if (!Q && STA) Q = process.env.AZURE_AUTHORITY_HOST;
  return Q !== null && Q !== void 0 ? Q : qTA
}
// @from(Ln 239125, Col 0)
function GG0(A, Q) {
  if (!Q) Q = qTA;
  if (new RegExp(`${A}/?$`).test(Q)) return Q;
  if (Q.endsWith("/")) return Q + A;
  else return `${Q}/${A}`
}
// @from(Ln 239132, Col 0)
function koB(A, Q, B) {
  if (A === "adfs" && Q || B) return [Q];
  return []
}
// @from(Ln 239137, Col 0)
function o81(A) {
  switch (A) {
    case "error":
      return BO.LogLevel.Error;
    case "info":
      return BO.LogLevel.Info;
    case "verbose":
      return BO.LogLevel.Verbose;
    case "warning":
      return BO.LogLevel.Warning;
    default:
      return BO.LogLevel.Info
  }
}
// @from(Ln 239152, Col 0)
function L9A(A, Q, B) {
  if (Q.name === "AuthError" || Q.name === "ClientAuthError" || Q.name === "BrowserAuthError") {
    let G = Q;
    switch (G.errorCode) {
      case "endpoints_resolution_error":
        return USA.info(PG(A, Q.message)), new U4(Q.message);
      case "device_code_polling_cancelled":
        return new HWA("The authentication has been aborted by the caller.");
      case "consent_required":
      case "interaction_required":
      case "login_required":
        USA.info(PG(A, `Authentication returned errorCode ${G.errorCode}`));
        break;
      default:
        USA.info(PG(A, `Failed to acquire token: ${Q.message}`));
        break
    }
  }
  if (Q.name === "ClientConfigurationError" || Q.name === "BrowserConfigurationAuthError" || Q.name === "AbortError" || Q.name === "AuthenticationError") return Q;
  if (Q.name === "NativeAuthError") return USA.info(PG(A, `Error from the native broker: ${Q.message} with status code: ${Q.statusCode}`)), Q;
  return new jm({
    scopes: A,
    getTokenOptions: B,
    message: Q.message
  })
}
// @from(Ln 239179, Col 0)
function boB(A) {
  return {
    localAccountId: A.homeAccountId,
    environment: A.authority,
    username: A.username,
    homeAccountId: A.homeAccountId,
    tenantId: A.tenantId
  }
}
// @from(Ln 239189, Col 0)
function foB(A, Q) {
  var B;
  return {
    authority: (B = Q.environment) !== null && B !== void 0 ? B : muB,
    homeAccountId: Q.homeAccountId,
    tenantId: Q.tenantId || uuB,
    username: Q.username,
    clientId: A,
    version: el8
  }
}
// @from(Ln 239200, Col 4)
USA
// @from(Ln 239200, Col 9)
el8 = "1.0"
// @from(Ln 239201, Col 2)
a81 = (A, Q = Z31 ? "Node" : "Browser") => (B, G, Z) => {
    if (Z) return;
    switch (B) {
      case BO.LogLevel.Error:
        A.info(`MSAL ${Q} V2 error: ${G}`);
        return;
      case BO.LogLevel.Info:
        A.info(`MSAL ${Q} V2 info message: ${G}`);
        return;
      case BO.LogLevel.Verbose:
        A.info(`MSAL ${Q} V2 verbose message: ${G}`);
        return;
      case BO.LogLevel.Warning:
        A.info(`MSAL ${Q} V2 warning: ${G}`);
        return
    }
  }
// @from(Ln 239218, Col 4)
ZG0 = w(() => {
  RC();
  uD();
  JWA();
  Co();
  F80();
  voB();
  USA = p7("IdentityUtils")
})
// @from(Ln 239228, Col 0)
function hoB(A) {
  return N80([{
    name: "imdsRetryPolicy",
    retry: ({
      retryCount: Q,
      response: B
    }) => {
      if ((B === null || B === void 0 ? void 0 : B.status) !== 404) return {
        skipStrategy: !0
      };
      return _dB(Q, {
        retryDelayInMs: A.startDelayInMs,
        maxRetryDelayInMs: Ai8
      })
    }
  }], {
    maxRetries: A.maxRetries
  })
}
// @from(Ln 239247, Col 4)
Ai8 = 64000
// @from(Ln 239248, Col 4)
goB = w(() => {
  Sm();
  Co()
})
// @from(Ln 239253, Col 0)
function Gi8(A) {
  var Q;
  if (!hTA(A)) throw Error(`${sm}: Multiple scopes are not supported.`);
  let G = new URL(Bi8, (Q = process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) !== null && Q !== void 0 ? Q : Qi8),
    Z = {
      Accept: "application/json"
    };
  return {
    url: `${G}`,
    method: "GET",
    headers: q2A(Z)
  }
}
// @from(Ln 239266, Col 4)
sm = "ManagedIdentityCredential - IMDS"
// @from(Ln 239267, Col 2)
O9A
// @from(Ln 239267, Col 7)
Qi8 = "http://169.254.169.254"
// @from(Ln 239268, Col 2)
Bi8 = "/metadata/identity/oauth2/token"
// @from(Ln 239269, Col 2)
YG0
// @from(Ln 239270, Col 4)
uoB = w(() => {
  Sm();
  Co();
  uD();
  tL();
  O9A = p7(sm);
  YG0 = {
    name: "imdsMsi",
    async isAvailable(A) {
      let {
        scopes: Q,
        identityClient: B,
        getTokenOptions: G
      } = A, Z = hTA(Q);
      if (!Z) return O9A.info(`${sm}: Unavailable. Multiple scopes are not supported.`), !1;
      if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) return !0;
      if (!B) throw Error("Missing IdentityClient");
      let Y = Gi8(Z);
      return LX.withSpan("ManagedIdentityCredential-pingImdsEndpoint", G !== null && G !== void 0 ? G : {}, async (J) => {
        var X, I;
        Y.tracingOptions = J.tracingOptions;
        let D = eP(Y);
        D.timeout = ((X = J.requestOptions) === null || X === void 0 ? void 0 : X.timeout) || 1000, D.allowInsecureConnection = !0;
        let W;
        try {
          O9A.info(`${sm}: Pinging the Azure IMDS endpoint`), W = await B.sendRequest(D)
        } catch (K) {
          if (G31(K)) O9A.verbose(`${sm}: Caught error ${K.name}: ${K.message}`);
          return O9A.info(`${sm}: The Azure IMDS endpoint is unavailable`), !1
        }
        if (W.status === 403) {
          if ((I = W.bodyAsText) === null || I === void 0 ? void 0 : I.includes("unreachable")) return O9A.info(`${sm}: The Azure IMDS endpoint is unavailable`), O9A.info(`${sm}: ${W.bodyAsText}`), !1
        }
        return O9A.info(`${sm}: The Azure IMDS endpoint is available`), !0
      })
    }
  }
})
// @from(Ln 239309, Col 0)
function r81(A) {
  var Q, B;
  let G = A;
  if (G === void 0 && ((B = (Q = globalThis.process) === null || Q === void 0 ? void 0 : Q.env) === null || B === void 0 ? void 0 : B.AZURE_REGIONAL_AUTHORITY_NAME) !== void 0) G = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
  if (G === JG0.AutoDiscoverRegion) return "AUTO_DISCOVER";
  return G
}
// @from(Ln 239316, Col 4)
JG0
// @from(Ln 239317, Col 4)
moB = w(() => {
  (function (A) {
    A.AutoDiscoverRegion = "AutoDiscoverRegion", A.USWest = "westus", A.USWest2 = "westus2", A.USCentral = "centralus", A.USEast = "eastus", A.USEast2 = "eastus2", A.USNorthCentral = "northcentralus", A.USSouthCentral = "southcentralus", A.USWestCentral = "westcentralus", A.CanadaCentral = "canadacentral", A.CanadaEast = "canadaeast", A.BrazilSouth = "brazilsouth", A.EuropeNorth = "northeurope", A.EuropeWest = "westeurope", A.UKSouth = "uksouth", A.UKWest = "ukwest", A.FranceCentral = "francecentral", A.FranceSouth = "francesouth", A.SwitzerlandNorth = "switzerlandnorth", A.SwitzerlandWest = "switzerlandwest", A.GermanyNorth = "germanynorth", A.GermanyWestCentral = "germanywestcentral", A.NorwayWest = "norwaywest", A.NorwayEast = "norwayeast", A.AsiaEast = "eastasia", A.AsiaSouthEast = "southeastasia", A.JapanEast = "japaneast", A.JapanWest = "japanwest", A.AustraliaEast = "australiaeast", A.AustraliaSouthEast = "australiasoutheast", A.AustraliaCentral = "australiacentral", A.AustraliaCentral2 = "australiacentral2", A.IndiaCentral = "centralindia", A.IndiaSouth = "southindia", A.IndiaWest = "westindia", A.KoreaSouth = "koreasouth", A.KoreaCentral = "koreacentral", A.UAECentral = "uaecentral", A.UAENorth = "uaenorth", A.SouthAfricaNorth = "southafricanorth", A.SouthAfricaWest = "southafricawest", A.ChinaNorth = "chinanorth", A.ChinaEast = "chinaeast", A.ChinaNorth2 = "chinanorth2", A.ChinaEast2 = "chinaeast2", A.GermanyCentral = "germanycentral", A.GermanyNorthEast = "germanynortheast", A.GovernmentUSVirginia = "usgovvirginia", A.GovernmentUSIowa = "usgoviowa", A.GovernmentUSArizona = "usgovarizona", A.GovernmentUSTexas = "usgovtexas", A.GovernmentUSDodEast = "usdodeast", A.GovernmentUSDodCentral = "usdodcentral"
  })(JG0 || (JG0 = {}))
})
// @from(Ln 239324, Col 0)
function Zi8() {
  try {
    return doB.statSync("/.dockerenv"), !0
  } catch {
    return !1
  }
}
// @from(Ln 239332, Col 0)
function Yi8() {
  try {
    return doB.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
  } catch {
    return !1
  }
}
// @from(Ln 239340, Col 0)
function IG0() {
  if (XG0 === void 0) XG0 = Zi8() || Yi8();
  return XG0
}
// @from(Ln 239344, Col 4)
XG0
// @from(Ln 239345, Col 4)
coB = () => {}
// @from(Ln 239348, Col 0)
function aWA() {
  if (DG0 === void 0) DG0 = Xi8() || IG0();
  return DG0
}
// @from(Ln 239352, Col 4)
DG0
// @from(Ln 239352, Col 9)
Xi8 = () => {
  try {
    return Ji8.statSync("/run/.containerenv"), !0
  } catch {
    return !1
  }
}
// @from(Ln 239359, Col 4)
WG0 = w(() => {
  coB()
})
// @from(Ln 239365, Col 4)
poB = () => {
    if (loB.platform !== "linux") return !1;
    if (Ii8.release().toLowerCase().includes("microsoft")) {
      if (aWA()) return !1;
      return !0
    }
    try {
      return Di8.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !aWA() : !1
    } catch {
      return !1
    }
  }
// @from(Ln 239377, Col 2)
co
// @from(Ln 239378, Col 4)
KG0 = w(() => {
  WG0();
  co = loB.env.__IS_WSL_TEST__ ? poB : poB()
})
// @from(Ln 239386, Col 4)
Ki8
// @from(Ln 239386, Col 9)
Vi8 = async () => {
  return `${await Ki8()}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
}
// @from(Ln 239388, Col 3)
VG0 = async () => {
  if (co) return Vi8();
  return `${ioB.env.SYSTEMROOT||ioB.env.windir||String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}
// @from(Ln 239392, Col 4)
aoB = w(() => {
  KG0();
  KG0();
  Ki8 = (() => {
    let Q;
    return async function () {
      if (Q) return Q;
      let B = "/etc/wsl.conf",
        G = !1;
      try {
        await noB.access(B, Wi8.F_OK), G = !0
      } catch {}
      if (!G) return "/mnt/";
      let Z = await noB.readFile(B, {
          encoding: "utf8"
        }),
        Y = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(Z);
      if (!Y) return "/mnt/";
      return Q = Y.groups.mountPoint.trim(), Q = Q.endsWith("/") ? Q : `${Q}/`, Q
    }
  })()
})
// @from(Ln 239415, Col 0)
function po(A, Q, B) {
  let G = (Z) => Object.defineProperty(A, Q, {
    value: Z,
    enumerable: !0,
    writable: !0
  });
  return Object.defineProperty(A, Q, {
    configurable: !0,
    enumerable: !0,
    get() {
      let Z = B();
      return G(Z), Z
    },
    set(Z) {
      G(Z)
    }
  }), A
}
// @from(Ln 239440, Col 0)
async function FG0() {
  if (Hi8.platform !== "darwin") throw Error("macOS only");
  let {
    stdout: A
  } = await zi8("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
  return /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(A)?.groups.id ?? "com.apple.Safari"
}
// @from(Ln 239447, Col 4)
zi8
// @from(Ln 239448, Col 4)
ooB = w(() => {
  zi8 = Fi8(Ei8)
})
// @from(Ln 239459, Col 0)
async function roB(A, {
  humanReadableOutput: Q = !0,
  signal: B
} = {}) {
  if ($i8.platform !== "darwin") throw Error("macOS only");
  let G = Q ? [] : ["-ss"],
    Z = {};
  if (B) Z.signal = B;
  let {
    stdout: Y
  } = await qi8("osascript", ["-e", A, G], Z);
  return Y.trim()
}
// @from(Ln 239472, Col 4)
qi8
// @from(Ln 239473, Col 4)
soB = w(() => {
  qi8 = Ci8(Ui8)
})
// @from(Ln 239476, Col 0)
async function HG0(A) {
  return roB(`tell application "Finder" to set app_path to application file id "${A}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)
}
// @from(Ln 239480, Col 4)
toB = w(() => {
  soB()
})
// @from(Ln 239489, Col 0)
async function zG0(A = Li8) {
  let {
    stdout: Q
  } = await A("reg", ["QUERY", " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice", "/v", "ProgId"]), B = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(Q);
  if (!B) throw new EG0(`Cannot find Windows browser in stdout: ${JSON.stringify(Q)}`);
  let {
    id: G
  } = B.groups, Z = Oi8[G];
  if (!Z) throw new EG0(`Unknown browser ID: ${G}`);
  return Z
}
// @from(Ln 239500, Col 4)
Li8
// @from(Ln 239500, Col 9)
Oi8
// @from(Ln 239500, Col 14)
EG0
// @from(Ln 239501, Col 4)
eoB = w(() => {
  Li8 = Ni8(wi8), Oi8 = {
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
  EG0 = class EG0 extends Error {}
})
// @from(Ln 239549, Col 0)
async function CG0() {
  if ($G0.platform === "darwin") {
    let A = await FG0();
    return {
      name: await HG0(A),
      id: A
    }
  }
  if ($G0.platform === "linux") {
    let {
      stdout: A
    } = await _i8("xdg-mime", ["query", "default", "x-scheme-handler/http"]), Q = A.trim();
    return {
      name: ji8(Q.replace(/.desktop$/, "").replace("-", " ")),
      id: Q
    }
  }
  if ($G0.platform === "win32") return zG0();
  throw Error("Only macOS, Linux, and Windows are supported")
}
// @from(Ln 239569, Col 4)
_i8
// @from(Ln 239569, Col 9)
ji8 = (A) => A.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (Q) => Q.toUpperCase())
// @from(Ln 239570, Col 4)
ArB = w(() => {
  ooB();
  toB();
  eoB();
  _i8 = Mi8(Ri8)
})
// @from(Ln 239576, Col 4)
IrB = {}
// @from(Ln 239597, Col 0)
async function vi8() {
  let A = await VG0(),
    Q = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`,
    B = YrB.from(Q, "utf16le").toString("base64"),
    {
      stdout: G
    } = await yi8(A, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", B], {
      encoding: "utf8"
    }),
    Z = G.trim(),
    Y = {
      ChromeHTML: "com.google.chrome",
      BraveHTML: "com.brave.Browser",
      MSEdgeHTM: "com.microsoft.edge",
      FirefoxURL: "org.mozilla.firefox"
    };
  return Y[Z] ? {
    id: Y[Z]
  } : {}
}
// @from(Ln 239618, Col 0)
function ZrB(A) {
  if (typeof A === "string" || Array.isArray(A)) return A;
  let {
    [BrB]: Q
  } = A;
  if (!Q) throw Error(`${BrB} is not supported`);
  return Q
}
// @from(Ln 239627, Col 0)
function s81({
  [oWA]: A
}, {
  wsl: Q
}) {
  if (Q && co) return ZrB(Q);
  if (!A) throw Error(`${oWA} is not supported`);
  return ZrB(A)
}
// @from(Ln 239636, Col 4)
yi8
// @from(Ln 239636, Col 9)
qG0
// @from(Ln 239636, Col 14)
QrB
// @from(Ln 239636, Col 19)
oWA
// @from(Ln 239636, Col 24)
BrB
// @from(Ln 239636, Col 29)
GrB = async (A, Q) => {
  let B;
  for (let G of A) try {
    return await Q(G)
  } catch (Z) {
    B = Z
  }
  throw B
}
// @from(Ln 239644, Col 3)
qSA = async (A) => {
  if (A = {
      wait: !1,
      background: !1,
      newInstance: !1,
      allowNonzeroExitCode: !1,
      ...A
    }, Array.isArray(A.app)) return GrB(A.app, (X) => qSA({
    ...A,
    app: X
  }));
  let {
    name: Q,
    arguments: B = []
  } = A.app ?? {};
  if (B = [...B], Array.isArray(Q)) return GrB(Q, (X) => qSA({
    ...A,
    app: {
      name: X,
      arguments: B
    }
  }));
  if (Q === "browser" || Q === "browserPrivate") {
    let X = {
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
      I = {
        chrome: "--incognito",
        brave: "--incognito",
        firefox: "--private-window",
        edge: "--inPrivate"
      },
      D = co ? await vi8() : await CG0();
    if (D.id in X) {
      let W = X[D.id];
      if (Q === "browserPrivate") B.push(I[W]);
      return qSA({
        ...A,
        app: {
          name: lo[W],
          arguments: B
        }
      })
    }
    throw Error(`${D.name} is not supported as a default browser`)
  }
  let G, Z = [],
    Y = {};
  if (oWA === "darwin") {
    if (G = "open", A.wait) Z.push("--wait-apps");
    if (A.background) Z.push("--background");
    if (A.newInstance) Z.push("--new");
    if (Q) Z.push("-a", Q)
  } else if (oWA === "win32" || co && !aWA() && !Q) {
    if (G = await VG0(), Z.push("-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand"), !co) Y.windowsVerbatimArguments = !0;
    let X = ["Start"];
    if (A.wait) X.push("-Wait");
    if (Q) {
      if (X.push(`"\`"${Q}\`""`), A.target) B.push(A.target)
    } else if (A.target) X.push(`"${A.target}"`);
    if (B.length > 0) B = B.map((I) => `"\`"${I}\`""`), X.push("-ArgumentList", B.join(","));
    A.target = YrB.from(X.join(" "), "utf16le").toString("base64")
  } else {
    if (Q) G = Q;
    else {
      let X = !qG0 || qG0 === "/",
        I = !1;
      try {
        await Si8.access(QrB, xi8.X_OK), I = !0
      } catch {}
      G = UG0.versions.electron ?? (oWA === "android" || X || !I) ? "xdg-open" : QrB
    }
    if (B.length > 0) Z.push(...B);
    if (!A.wait) Y.stdio = "ignore", Y.detached = !0
  }
  if (oWA === "darwin" && B.length > 0) Z.push("--args", ...B);
  if (A.target) Z.push(A.target);
  let J = XrB.spawn(G, Z, Y);
  if (A.wait) return new Promise((X, I) => {
    J.once("error", I), J.once("close", (D) => {
      if (!A.allowNonzeroExitCode && D > 0) {
        I(Error(`Exited with code ${D}`));
        return
      }
      X(J)
    })
  });
  return J.unref(), J
}
// @from(Ln 239740, Col 3)
ki8 = (A, Q) => {
  if (typeof A !== "string") throw TypeError("Expected a `target`");
  return qSA({
    ...Q,
    target: A
  })
}
// @from(Ln 239746, Col 3)
bi8 = (A, Q) => {
  if (typeof A !== "string" && !Array.isArray(A)) throw TypeError("Expected a valid `name`");
  let {
    arguments: B = []
  } = Q ?? {};
  if (B !== void 0 && B !== null && !Array.isArray(B)) throw TypeError("Expected `appArguments` as Array type");
  return qSA({
    ...Q,
    app: {
      name: A,
      arguments: B
    }
  })
}
// @from(Ln 239759, Col 3)
lo
// @from(Ln 239759, Col 7)
fi8
// @from(Ln 239760, Col 4)
DrB = w(() => {
  aoB();
  ArB();
  WG0();
  yi8 = Pi8(XrB.execFile), qG0 = JrB.dirname(Ti8(import.meta.url)), QrB = JrB.join(qG0, "xdg-open"), {
    platform: oWA,
    arch: BrB
  } = UG0;
  lo = {};
  po(lo, "chrome", () => s81({
    darwin: "google chrome",
    win32: "chrome",
    linux: ["google-chrome", "google-chrome-stable", "chromium"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
      x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
    }
  }));
  po(lo, "brave", () => s81({
    darwin: "brave browser",
    win32: "brave",
    linux: ["brave-browser", "brave"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
      x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
    }
  }));
  po(lo, "firefox", () => s81({
    darwin: "firefox",
    win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
    linux: "firefox"
  }, {
    wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
  }));
  po(lo, "edge", () => s81({
    darwin: "microsoft edge",
    win32: "msedge",
    linux: ["microsoft-edge", "microsoft-edge-dev"]
  }, {
    wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  }));
  po(lo, "browser", () => "browser");
  po(lo, "browserPrivate", () => "browserPrivate");
  fi8 = ki8
})
// @from(Ln 239808, Col 0)
function hi8(A, Q, B = {}) {
  var G, Z, Y;
  let J = KmB((G = B.logger) !== null && G !== void 0 ? G : CN, Q, A),
    X = GG0(J, BG0(B)),
    I = new CWA(Object.assign(Object.assign({}, B.tokenCredentialOptions), {
      authorityHost: X,
      loggingOptions: B.loggingOptions
    }));
  return {
    auth: {
      clientId: A,
      authority: X,
      knownAuthorities: koB(J, X, B.disableInstanceDiscovery)
    },
    system: {
      networkClient: I,
      loggerOptions: {
        loggerCallback: a81((Z = B.logger) !== null && Z !== void 0 ? Z : CN),
        logLevel: o81(u61()),
        piiLoggingEnabled: (Y = B.loggingOptions) === null || Y === void 0 ? void 0 : Y.enableUnsafeSupportLogging
      }
    }
  }
}
// @from(Ln 239833, Col 0)
function io(A, Q, B = {}) {
  var G;
  let Z = {
      msalConfig: hi8(A, Q, B),
      cachedAccount: B.authenticationRecord ? boB(B.authenticationRecord) : null,
      pluginConfiguration: nuB.generatePluginConfiguration(B),
      logger: (G = B.logger) !== null && G !== void 0 ? G : CN
    },
    Y = new Map;
  async function J(_ = {}) {
    let j = _.enableCae ? "CAE" : "default",
      x = Y.get(j);
    if (x) return Z.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), x;
    Z.logger.getToken.info(`Creating new PublicClientApplication with CAE ${_.enableCae?"enabled":"disabled"}.`);
    let b = _.enableCae ? Z.pluginConfiguration.cache.cachePluginCae : Z.pluginConfiguration.cache.cachePlugin;
    return Z.msalConfig.auth.clientCapabilities = _.enableCae ? ["cp1"] : void 0, x = new ESA(Object.assign(Object.assign({}, Z.msalConfig), {
      broker: {
        nativeBrokerPlugin: Z.pluginConfiguration.broker.nativeBrokerPlugin
      },
      cache: {
        cachePlugin: await b
      }
    })), Y.set(j, x), x
  }
  let X = new Map;
  async function I(_ = {}) {
    let j = _.enableCae ? "CAE" : "default",
      x = X.get(j);
    if (x) return Z.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), x;
    Z.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${_.enableCae?"enabled":"disabled"}.`);
    let b = _.enableCae ? Z.pluginConfiguration.cache.cachePluginCae : Z.pluginConfiguration.cache.cachePlugin;
    return Z.msalConfig.auth.clientCapabilities = _.enableCae ? ["cp1"] : void 0, x = new $SA(Object.assign(Object.assign({}, Z.msalConfig), {
      broker: {
        nativeBrokerPlugin: Z.pluginConfiguration.broker.nativeBrokerPlugin
      },
      cache: {
        cachePlugin: await b
      }
    })), X.set(j, x), x
  }
  async function D(_, j, x = {}) {
    if (Z.cachedAccount === null) throw Z.logger.getToken.info("No cached account found in local state."), new jm({
      scopes: j
    });
    if (x.claims) Z.cachedClaims = x.claims;
    let b = {
      account: Z.cachedAccount,
      scopes: j,
      claims: Z.cachedClaims
    };
    if (Z.pluginConfiguration.broker.isEnabled) {
      if (b.tokenQueryParameters || (b.tokenQueryParameters = {}), Z.pluginConfiguration.broker.enableMsaPassthrough) b.tokenQueryParameters.msal_request_type = "consumer_passthrough"
    }
    if (x.proofOfPossessionOptions) b.shrNonce = x.proofOfPossessionOptions.nonce, b.authenticationScheme = "pop", b.resourceRequestMethod = x.proofOfPossessionOptions.resourceRequestMethod, b.resourceRequestUri = x.proofOfPossessionOptions.resourceRequestUrl;
    Z.logger.getToken.info("Attempting to acquire token silently");
    try {
      return await _.acquireTokenSilent(b)
    } catch (S) {
      throw L9A(j, S, x)
    }
  }

  function W(_) {
    if (_ === null || _ === void 0 ? void 0 : _.tenantId) return GG0(_.tenantId, BG0(B));
    return Z.msalConfig.auth.authority
  }
  async function K(_, j, x, b) {
    var S, u;
    let f = null;
    try {
      f = await D(_, j, x)
    } catch (AA) {
      if (AA.name !== "AuthenticationRequiredError") throw AA;
      if (x.disableAutomaticAuthentication) throw new jm({
        scopes: j,
        getTokenOptions: x,
        message: "Automatic authentication has been disabled. You may call the authentication() method."
      })
    }
    if (f === null) try {
      f = await b()
    } catch (AA) {
      throw L9A(j, AA, x)
    }
    return nWA(j, f, x), Z.cachedAccount = (S = f === null || f === void 0 ? void 0 : f.account) !== null && S !== void 0 ? S : null, Z.logger.getToken.info(HF(j)), {
      token: f.accessToken,
      expiresOnTimestamp: f.expiresOn.getTime(),
      refreshAfterTimestamp: (u = f.refreshOn) === null || u === void 0 ? void 0 : u.getTime(),
      tokenType: f.tokenType
    }
  }
  async function V(_, j, x = {}) {
    var b;
    Z.logger.getToken.info("Attempting to acquire token using client secret"), Z.msalConfig.auth.clientSecret = j;
    let S = await I(x);
    try {
      let u = await S.acquireTokenByClientCredential({
        scopes: _,
        authority: W(x),
        azureRegion: r81(),
        claims: x === null || x === void 0 ? void 0 : x.claims
      });
      return nWA(_, u, x), Z.logger.getToken.info(HF(_)), {
        token: u.accessToken,
        expiresOnTimestamp: u.expiresOn.getTime(),
        refreshAfterTimestamp: (b = u.refreshOn) === null || b === void 0 ? void 0 : b.getTime(),
        tokenType: u.tokenType
      }
    } catch (u) {
      throw L9A(_, u, x)
    }
  }
  async function F(_, j, x = {}) {
    var b;
    Z.logger.getToken.info("Attempting to acquire token using client assertion"), Z.msalConfig.auth.clientAssertion = j;
    let S = await I(x);
    try {
      let u = await S.acquireTokenByClientCredential({
        scopes: _,
        authority: W(x),
        azureRegion: r81(),
        claims: x === null || x === void 0 ? void 0 : x.claims,
        clientAssertion: j
      });
      return nWA(_, u, x), Z.logger.getToken.info(HF(_)), {
        token: u.accessToken,
        expiresOnTimestamp: u.expiresOn.getTime(),
        refreshAfterTimestamp: (b = u.refreshOn) === null || b === void 0 ? void 0 : b.getTime(),
        tokenType: u.tokenType
      }
    } catch (u) {
      throw L9A(_, u, x)
    }
  }
  async function H(_, j, x = {}) {
    var b;
    Z.logger.getToken.info("Attempting to acquire token using client certificate"), Z.msalConfig.auth.clientCertificate = j;
    let S = await I(x);
    try {
      let u = await S.acquireTokenByClientCredential({
        scopes: _,
        authority: W(x),
        azureRegion: r81(),
        claims: x === null || x === void 0 ? void 0 : x.claims
      });
      return nWA(_, u, x), Z.logger.getToken.info(HF(_)), {
        token: u.accessToken,
        expiresOnTimestamp: u.expiresOn.getTime(),
        refreshAfterTimestamp: (b = u.refreshOn) === null || b === void 0 ? void 0 : b.getTime(),
        tokenType: u.tokenType
      }
    } catch (u) {
      throw L9A(_, u, x)
    }
  }
  async function E(_, j, x = {}) {
    Z.logger.getToken.info("Attempting to acquire token using device code");
    let b = await J(x);
    return K(b, _, x, () => {
      var S, u;
      let f = {
          scopes: _,
          cancel: (u = (S = x === null || x === void 0 ? void 0 : x.abortSignal) === null || S === void 0 ? void 0 : S.aborted) !== null && u !== void 0 ? u : !1,
          deviceCodeCallback: j,
          authority: W(x),
          claims: x === null || x === void 0 ? void 0 : x.claims
        },
        AA = b.acquireTokenByDeviceCode(f);
      if (x.abortSignal) x.abortSignal.addEventListener("abort", () => {
        f.cancel = !0
      });
      return AA
    })
  }
  async function z(_, j, x, b = {}) {
    Z.logger.getToken.info("Attempting to acquire token using username and password");
    let S = await J(b);
    return K(S, _, b, () => {
      let u = {
        scopes: _,
        username: j,
        password: x,
        authority: W(b),
        claims: b === null || b === void 0 ? void 0 : b.claims
      };
      return S.acquireTokenByUsernamePassword(u)
    })
  }

  function $() {
    if (!Z.cachedAccount) return;
    return foB(A, Z.cachedAccount)
  }
  async function O(_, j, x, b, S = {}) {
    Z.logger.getToken.info("Attempting to acquire token using authorization code");
    let u;
    if (b) Z.msalConfig.auth.clientSecret = b, u = await I(S);
    else u = await J(S);
    return K(u, _, S, () => {
      return u.acquireTokenByCode({
        scopes: _,
        redirectUri: j,
        code: x,
        authority: W(S),
        claims: S === null || S === void 0 ? void 0 : S.claims
      })
    })
  }
  async function L(_, j, x, b = {}) {
    var S;
    if (CN.getToken.info("Attempting to acquire token on behalf of another user"), typeof x === "string") CN.getToken.info("Using client secret for on behalf of flow"), Z.msalConfig.auth.clientSecret = x;
    else if (typeof x === "function") CN.getToken.info("Using client assertion callback for on behalf of flow"), Z.msalConfig.auth.clientAssertion = x;
    else CN.getToken.info("Using client certificate for on behalf of flow"), Z.msalConfig.auth.clientCertificate = x;
    let u = await I(b);
    try {
      let f = await u.acquireTokenOnBehalfOf({
        scopes: _,
        authority: W(b),
        claims: b.claims,
        oboAssertion: j
      });
      return nWA(_, f, b), CN.getToken.info(HF(_)), {
        token: f.accessToken,
        expiresOnTimestamp: f.expiresOn.getTime(),
        refreshAfterTimestamp: (S = f.refreshOn) === null || S === void 0 ? void 0 : S.getTime(),
        tokenType: f.tokenType
      }
    } catch (f) {
      throw L9A(_, f, b)
    }
  }
  async function M(_, j = {}) {
    CN.getToken.info("Attempting to acquire token interactively");
    let x = await J(j);
    async function b(u) {
      var f;
      CN.verbose("Authentication will resume through the broker");
      let AA = S();
      if (Z.pluginConfiguration.broker.parentWindowHandle) AA.windowHandle = Buffer.from(Z.pluginConfiguration.broker.parentWindowHandle);
      else CN.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
      if (Z.pluginConfiguration.broker.enableMsaPassthrough)((f = AA.tokenQueryParameters) !== null && f !== void 0 ? f : AA.tokenQueryParameters = {}).msal_request_type = "consumer_passthrough";
      if (u) AA.prompt = "none", CN.verbose("Attempting broker authentication using the default broker account");
      else CN.verbose("Attempting broker authentication without the default broker account");
      if (j.proofOfPossessionOptions) AA.shrNonce = j.proofOfPossessionOptions.nonce, AA.authenticationScheme = "pop", AA.resourceRequestMethod = j.proofOfPossessionOptions.resourceRequestMethod, AA.resourceRequestUri = j.proofOfPossessionOptions.resourceRequestUrl;
      try {
        return await x.acquireTokenInteractive(AA)
      } catch (n) {
        if (CN.verbose(`Failed to authenticate through the broker: ${n.message}`), u) return b(!1);
        else throw n
      }
    }

    function S() {
      var u, f;
      return {
        openBrowser: async (AA) => {
          await (await Promise.resolve().then(() => (DrB(), IrB))).default(AA, {
            wait: !0,
            newInstance: !0
          })
        },
        scopes: _,
        authority: W(j),
        claims: j === null || j === void 0 ? void 0 : j.claims,
        loginHint: j === null || j === void 0 ? void 0 : j.loginHint,
        errorTemplate: (u = j === null || j === void 0 ? void 0 : j.browserCustomizationOptions) === null || u === void 0 ? void 0 : u.errorMessage,
        successTemplate: (f = j === null || j === void 0 ? void 0 : j.browserCustomizationOptions) === null || f === void 0 ? void 0 : f.successMessage,
        prompt: (j === null || j === void 0 ? void 0 : j.loginHint) ? "login" : "select_account"
      }
    }
    return K(x, _, j, async () => {
      var u;
      let f = S();
      if (Z.pluginConfiguration.broker.isEnabled) return b((u = Z.pluginConfiguration.broker.useDefaultBrokerAccount) !== null && u !== void 0 ? u : !1);
      if (j.proofOfPossessionOptions) f.shrNonce = j.proofOfPossessionOptions.nonce, f.authenticationScheme = "pop", f.resourceRequestMethod = j.proofOfPossessionOptions.resourceRequestMethod, f.resourceRequestUri = j.proofOfPossessionOptions.resourceRequestUrl;
      return x.acquireTokenInteractive(f)
    })
  }
  return {
    getActiveAccount: $,
    getTokenByClientSecret: V,
    getTokenByClientAssertion: F,
    getTokenByClientCertificate: H,
    getTokenByDeviceCode: E,
    getTokenByUsernamePassword: z,
    getTokenByAuthorizationCode: O,
    getTokenOnBehalfOf: L,
    getTokenByInteractiveRequest: M
  }
}
// @from(Ln 240123, Col 4)
CN
// @from(Ln 240124, Col 4)
NSA = w(() => {
  n81();
  uD();
  auB();
  ZG0();
  RC();
  O80();
  moB();
  $2A();
  rP();
  CN = p7("MsalClient")
})
// @from(Ln 240136, Col 0)
class NG0 {
  constructor(A, Q, B, G = {}) {
    if (!A) throw new U4("ClientAssertionCredential: tenantId is a required parameter.");
    if (!Q) throw new U4("ClientAssertionCredential: clientId is a required parameter.");
    if (!B) throw new U4("ClientAssertionCredential: clientAssertion is a required parameter.");
    this.tenantId = A, this.additionallyAllowedTenantIds = DN(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.options = G, this.getAssertion = B, this.msalClient = io(Q, A, Object.assign(Object.assign({}, G), {
      logger: WrB,
      tokenCredentialOptions: this.options
    }))
  }
  async getToken(A, Q = {}) {
    return LX.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = _C(this.tenantId, B, this.additionallyAllowedTenantIds, WrB);
      let G = Array.isArray(A) ? A : [A];
      return this.msalClient.getTokenByClientAssertion(G, this.getAssertion, B)
    })
  }
}
// @from(Ln 240154, Col 4)
WrB
// @from(Ln 240155, Col 4)
KrB = w(() => {
  NSA();
  rP();
  RC();
  uD();
  tL();
  WrB = p7("ClientAssertionCredential")
})
// @from(Ln 240166, Col 0)
class R9A {
  constructor(A) {
    this.azureFederatedTokenFileContent = void 0, this.cacheDate = void 0;
    let Q = m61(ui8).assigned.join(", ");
    wSA.info(`Found the following environment variables: ${Q}`);
    let B = A !== null && A !== void 0 ? A : {},
      G = B.tenantId || process.env.AZURE_TENANT_ID,
      Z = B.clientId || process.env.AZURE_CLIENT_ID;
    if (this.federatedTokenFilePath = B.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, G) IN(wSA, G);
    if (!Z) throw new U4(`${M9A}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!G) throw new U4(`${M9A}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!this.federatedTokenFilePath) throw new U4(`${M9A}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    wSA.info(`Invoking ClientAssertionCredential with tenant ID: ${G}, clientId: ${B.clientId} and federated token path: [REDACTED]`), this.client = new NG0(G, Z, this.readFileContents.bind(this), A)
  }
  async getToken(A, Q) {
    if (!this.client) {
      let B = `${M9A}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
      throw wSA.info(B), new U4(B)
    }
    return wSA.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(A, Q)
  }
  async readFileContents() {
    if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000) this.azureFederatedTokenFileContent = void 0;
    if (!this.federatedTokenFilePath) throw new U4(`${M9A}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
    if (!this.azureFederatedTokenFileContent) {
      let Q = (await gi8(this.federatedTokenFilePath, "utf8")).trim();
      if (!Q) throw new U4(`${M9A}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
      else this.azureFederatedTokenFileContent = Q, this.cacheDate = Date.now()
    }
    return this.azureFederatedTokenFileContent
  }
}
// @from(Ln 240205, Col 4)
M9A = "WorkloadIdentityCredential"
// @from(Ln 240206, Col 2)
ui8
// @from(Ln 240206, Col 7)
wSA
// @from(Ln 240207, Col 4)
wG0 = w(() => {
  uD();
  KrB();
  RC();
  rP();
  ui8 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_FEDERATED_TOKEN_FILE"], wSA = p7(M9A)
})
// @from(Ln 240214, Col 4)
VrB = "ManagedIdentityCredential - Token Exchange"
// @from(Ln 240215, Col 2)
mi8
// @from(Ln 240215, Col 7)
LG0
// @from(Ln 240216, Col 4)
FrB = w(() => {
  wG0();
  uD();
  mi8 = p7(VrB), LG0 = {
    name: "tokenExchangeMsi",
    async isAvailable(A) {
      let Q = process.env,
        B = Boolean((A || Q.AZURE_CLIENT_ID) && Q.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
      if (!B) mi8.info(`${VrB}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
      return B
    },
    async getToken(A, Q = {}) {
      let {
        scopes: B,
        clientId: G
      } = A, Z = {};
      return new R9A(Object.assign(Object.assign({
        clientId: G,
        tenantId: process.env.AZURE_TENANT_ID,
        tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE
      }, Z), {
        disableInstanceDiscovery: !0
      })).getToken(B, Q)
    }
  }
})
// @from(Ln 240242, Col 0)
class rWA {
  constructor(A, Q) {
    var B, G;
    this.msiRetryConfig = {
      maxRetries: 5,
      startDelayInMs: 800,
      intervalIncrement: 2
    };
    let Z;
    if (typeof A === "string") this.clientId = A, Z = Q !== null && Q !== void 0 ? Q : {};
    else this.clientId = A === null || A === void 0 ? void 0 : A.clientId, Z = A !== null && A !== void 0 ? A : {};
    this.resourceId = Z === null || Z === void 0 ? void 0 : Z.resourceId, this.objectId = Z === null || Z === void 0 ? void 0 : Z.objectId;
    let Y = [{
      key: "clientId",
      value: this.clientId
    }, {
      key: "resourceId",
      value: this.resourceId
    }, {
      key: "objectId",
      value: this.objectId
    }].filter((X) => X.value);
    if (Y.length > 1) throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}`);
    if (Z.allowInsecureConnection = !0, ((B = Z.retryOptions) === null || B === void 0 ? void 0 : B.maxRetries) !== void 0) this.msiRetryConfig.maxRetries = Z.retryOptions.maxRetries;
    this.identityClient = new CWA(Object.assign(Object.assign({}, Z), {
      additionalPolicies: [{
        policy: hoB(this.msiRetryConfig),
        position: "perCall"
      }]
    })), this.managedIdentityApp = new Bb({
      managedIdentityIdParams: {
        userAssignedClientId: this.clientId,
        userAssignedResourceId: this.resourceId,
        userAssignedObjectId: this.objectId
      },
      system: {
        disableInternalRetries: !0,
        networkClient: this.identityClient,
        loggerOptions: {
          logLevel: o81(u61()),
          piiLoggingEnabled: (G = Z.loggingOptions) === null || G === void 0 ? void 0 : G.enableUnsafeSupportLogging,
          loggerCallback: a81(GO)
        }
      }
    }), this.isAvailableIdentityClient = new CWA(Object.assign(Object.assign({}, Z), {
      retryOptions: {
        maxRetries: 0
      }
    }));
    let J = this.managedIdentityApp.getManagedIdentitySource();
    if (J === "CloudShell") {
      if (this.clientId || this.resourceId || this.objectId) throw GO.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new U4("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.")
    }
    if (J === "ServiceFabric") {
      if (this.clientId || this.resourceId || this.objectId) throw GO.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new U4(`ManagedIdentityCredential: ${ucB}`)
    }
    if (GO.info(`Using ${J} managed identity.`), Y.length === 1) {
      let {
        key: X,
        value: I
      } = Y[0];
      GO.info(`${J} with ${X}: ${I}`)
    }
  }
  async getToken(A, Q = {}) {
    GO.getToken.info("Using the MSAL provider for Managed Identity.");
    let B = hTA(A);
    if (!B) throw new U4(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(A)}`);
    return LX.withSpan("ManagedIdentityCredential.getToken", Q, async () => {
      var G;
      try {
        let Z = await LG0.isAvailable(this.clientId),
          Y = this.managedIdentityApp.getManagedIdentitySource(),
          J = Y === "DefaultToImds" || Y === "Imds";
        if (GO.getToken.info(`MSAL Identity source: ${Y}`), Z) {
          GO.getToken.info("Using the token exchange managed identity.");
          let I = await LG0.getToken({
            scopes: A,
            clientId: this.clientId,
            identityClient: this.identityClient,
            retryConfig: this.msiRetryConfig,
            resourceId: this.resourceId
          });
          if (I === null) throw new U4("Attempted to use the token exchange managed identity, but received a null response.");
          return I
        } else if (J) {
          if (GO.getToken.info("Using the IMDS endpoint to probe for availability."), !await YG0.isAvailable({
              scopes: A,
              clientId: this.clientId,
              getTokenOptions: Q,
              identityClient: this.isAvailableIdentityClient,
              resourceId: this.resourceId
            })) throw new U4("Attempted to use the IMDS endpoint, but it is not available.")
        }
        GO.getToken.info("Calling into MSAL for managed identity token.");
        let X = await this.managedIdentityApp.acquireToken({
          resource: B
        });
        return this.ensureValidMsalToken(A, X, Q), GO.getToken.info(HF(A)), {
          expiresOnTimestamp: X.expiresOn.getTime(),
          token: X.accessToken,
          refreshAfterTimestamp: (G = X.refreshOn) === null || G === void 0 ? void 0 : G.getTime(),
          tokenType: "Bearer"
        }
      } catch (Z) {
        if (GO.getToken.error(PG(A, Z)), Z.name === "AuthenticationRequiredError") throw Z;
        if (di8(Z)) throw new U4(`ManagedIdentityCredential: Network unreachable. Message: ${Z.message}`, {
          cause: Z
        });
        throw new U4(`ManagedIdentityCredential: Authentication failed. Message ${Z.message}`, {
          cause: Z
        })
      }
    })
  }
  ensureValidMsalToken(A, Q, B) {
    let G = (Z) => {
      return GO.getToken.info(Z), new jm({
        scopes: Array.isArray(A) ? A : [A],
        getTokenOptions: B,
        message: Z
      })
    };
    if (!Q) throw G("No response.");
    if (!Q.expiresOn) throw G('Response had no "expiresOn" property.');
    if (!Q.accessToken) throw G('Response had no "accessToken" property.')
  }
}
// @from(Ln 240371, Col 0)
function di8(A) {
  if (A.errorCode === "network_error") return !0;
  if (A.code === "ENETUNREACH" || A.code === "EHOSTUNREACH") return !0;
  if (A.statusCode === 403 || A.code === 403) {
    if (A.message.includes("unreachable")) return !0
  }
  return !1
}
// @from(Ln 240379, Col 4)
GO
// @from(Ln 240380, Col 4)
HrB = w(() => {
  $2A();
  n81();
  O80();
  RC();
  ZG0();
  goB();
  uD();
  tL();
  uoB();
  FrB();
  GO = p7("ManagedIdentityCredential")
})
// @from(Ln 240394, Col 0)
function t81(A) {
  return Array.isArray(A) ? A : [A]
}
// @from(Ln 240398, Col 0)
function sWA(A, Q) {
  if (!A.match(/^[0-9a-zA-Z-_.:/]+$/)) {
    let B = Error("Invalid scope was specified by the user or calling client");
    throw Q.getToken.info(PG(A, B)), B
  }
}
// @from(Ln 240405, Col 0)
function e81(A) {
  return A.replace(/\/.default$/, "")
}
// @from(Ln 240408, Col 4)
tWA = w(() => {
  uD()
})
// @from(Ln 240412, Col 0)
function OG0(A, Q) {
  if (!Q.match(/^[0-9a-zA-Z-._ ]+$/)) {
    let B = Error("Invalid subscription provided. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id.");
    throw A.info(PG("", B)), B
  }
}
// @from(Ln 240418, Col 4)
ErB = w(() => {
  uD()
})
// @from(Ln 240422, Col 0)
class MG0 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) IN(R_, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    if (A === null || A === void 0 ? void 0 : A.subscription) OG0(R_, A === null || A === void 0 ? void 0 : A.subscription), this.subscription = A === null || A === void 0 ? void 0 : A.subscription;
    this.additionallyAllowedTenantIds = DN(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getToken(A, Q = {}) {
    let B = _C(this.tenantId, Q, this.additionallyAllowedTenantIds);
    if (B) IN(R_, B);
    if (this.subscription) OG0(R_, this.subscription);
    let G = typeof A === "string" ? A : A[0];
    return R_.getToken.info(`Using the scope ${G}`), LX.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      var Z, Y, J, X;
      try {
        sWA(G, R_);
        let I = e81(G),
          D = await zrB.getAzureCliAccessToken(I, B, this.subscription, this.timeout),
          W = (Z = D.stderr) === null || Z === void 0 ? void 0 : Z.match("(.*)az login --scope(.*)"),
          K = ((Y = D.stderr) === null || Y === void 0 ? void 0 : Y.match("(.*)az login(.*)")) && !W;
        if (((J = D.stderr) === null || J === void 0 ? void 0 : J.match("az:(.*)not found")) || ((X = D.stderr) === null || X === void 0 ? void 0 : X.startsWith("'az' is not recognized"))) {
          let F = new U4("Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.");
          throw R_.getToken.info(PG(A, F)), F
        }
        if (K) {
          let F = new U4("Please run 'az login' from a command prompt to authenticate before using this credential.");
          throw R_.getToken.info(PG(A, F)), F
        }
        try {
          let F = D.stdout,
            H = this.parseRawResponse(F);
          return R_.getToken.info(HF(A)), H
        } catch (F) {
          if (D.stderr) throw new U4(D.stderr);
          throw F
        }
      } catch (I) {
        let D = I.name === "CredentialUnavailableError" ? I : new U4(I.message || "Unknown error while trying to retrieve the access token");
        throw R_.getToken.info(PG(A, D)), D
      }
    })
  }
  parseRawResponse(A) {
    let Q = JSON.parse(A),
      B = Q.accessToken,
      G = Number.parseInt(Q.expires_on, 10) * 1000;
    if (!isNaN(G)) return R_.getToken.info("expires_on is available and is valid, using it"), {
      token: B,
      expiresOnTimestamp: G,
      tokenType: "Bearer"
    };
    if (G = new Date(Q.expiresOn).getTime(), isNaN(G)) throw new U4(`Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${Q.expiresOn}"`);
    return {
      token: B,
      expiresOnTimestamp: G,
      tokenType: "Bearer"
    }
  }
}
// @from(Ln 240480, Col 4)
R_
// @from(Ln 240480, Col 8)
zrB
// @from(Ln 240481, Col 4)
$rB = w(() => {
  rP();
  uD();
  tWA();
  RC();
  tL();
  ErB();
  R_ = p7("AzureCliCredential"), zrB = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let A = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!A) R_.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), A = "C:\\Windows";
        return A
      } else return "/bin"
    },
    async getAzureCliAccessToken(A, Q, B, G) {
      let Z = [],
        Y = [];
      if (Q) Z = ["--tenant", Q];
      if (B) Y = ["--subscription", `"${B}"`];
      return new Promise((J, X) => {
        try {
          ci8.execFile("az", ["account", "get-access-token", "--output", "json", "--resource", A, ...Z, ...Y], {
            cwd: zrB.getSafeWorkingDir(),
            shell: !0,
            timeout: G
          }, (I, D, W) => {
            J({
              stdout: D,
              stderr: W,
              error: I
            })
          })
        } catch (I) {
          X(I)
        }
      })
    }
  }
})
// @from(Ln 240522, Col 0)
class RG0 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) IN(tm, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    this.additionallyAllowedTenantIds = DN(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getToken(A, Q = {}) {
    let B = _C(this.tenantId, Q, this.additionallyAllowedTenantIds);
    if (B) IN(tm, B);
    let G;
    if (typeof A === "string") G = [A];
    else G = A;
    return tm.getToken.info(`Using the scopes ${A}`), LX.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      var Z, Y, J, X;
      try {
        G.forEach((K) => {
          sWA(K, tm)
        });
        let I = await CrB.getAzdAccessToken(G, B, this.timeout),
          D = ((Z = I.stderr) === null || Z === void 0 ? void 0 : Z.match("not logged in, run `azd login` to login")) || ((Y = I.stderr) === null || Y === void 0 ? void 0 : Y.match("not logged in, run `azd auth login` to login"));
        if (((J = I.stderr) === null || J === void 0 ? void 0 : J.match("azd:(.*)not found")) || ((X = I.stderr) === null || X === void 0 ? void 0 : X.startsWith("'azd' is not recognized")) || I.error && I.error.code === "ENOENT") {
          let K = new U4("Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
          throw tm.getToken.info(PG(A, K)), K
        }
        if (D) {
          let K = new U4("Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
          throw tm.getToken.info(PG(A, K)), K
        }
        try {
          let K = JSON.parse(I.stdout);
          return tm.getToken.info(HF(A)), {
            token: K.token,
            expiresOnTimestamp: new Date(K.expiresOn).getTime(),
            tokenType: "Bearer"
          }
        } catch (K) {
          if (I.stderr) throw new U4(I.stderr);
          throw K
        }
      } catch (I) {
        let D = I.name === "CredentialUnavailableError" ? I : new U4(I.message || "Unknown error while trying to retrieve the access token");
        throw tm.getToken.info(PG(A, D)), D
      }
    })
  }
}
// @from(Ln 240567, Col 4)
tm
// @from(Ln 240567, Col 8)
CrB
// @from(Ln 240568, Col 4)
UrB = w(() => {
  uD();
  RC();
  rP();
  tL();
  tWA();
  tm = p7("AzureDeveloperCliCredential"), CrB = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let A = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!A) tm.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), A = "C:\\Windows";
        return A
      } else return "/bin"
    },
    async getAzdAccessToken(A, Q, B) {
      let G = [];
      if (Q) G = ["--tenant-id", Q];
      return new Promise((Z, Y) => {
        try {
          pi8.execFile("azd", ["auth", "token", "--output", "json", ...A.reduce((J, X) => J.concat("--scope", X), []), ...G], {
            cwd: CrB.getSafeWorkingDir(),
            timeout: B
          }, (J, X, I) => {
            Z({
              stdout: X,
              stderr: I,
              error: J
            })
          })
        } catch (J) {
          Y(J)
        }
      })
    }
  }
})
// @from(Ln 240605, Col 4)
NrB
// @from(Ln 240606, Col 4)
wrB = w(() => {
  NrB = {
    execFile(A, Q, B) {
      return new Promise((G, Z) => {
        qrB.execFile(A, Q, B, (Y, J, X) => {
          if (Buffer.isBuffer(J)) J = J.toString("utf8");
          if (Buffer.isBuffer(X)) X = X.toString("utf8");
          if (X || Y) Z(X ? Error(X) : Y);
          else G(J)
        })
      })
    }
  }
})
// @from(Ln 240621, Col 0)
function MrB(A) {
  if (OrB) return `${A}.exe`;
  else return A
}
// @from(Ln 240625, Col 0)
async function LrB(A, Q) {
  let B = [];
  for (let G of A) {
    let [Z, ...Y] = G, J = await NrB.execFile(Z, Y, {
      encoding: "utf8",
      timeout: Q
    });
    B.push(J)
  }
  return B
}
// @from(Ln 240636, Col 0)
class TG0 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) IN(em, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    this.additionallyAllowedTenantIds = DN(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getAzurePowerShellAccessToken(A, Q, B) {
    for (let G of [...jG0]) {
      try {
        await LrB([
          [G, "/?"]
        ], B)
      } catch (J) {
        jG0.shift();
        continue
      }
      let Y = (await LrB([
        [G, "-NoProfile", "-NonInteractive", "-Command", `
          $tenantId = "${Q!==null&&Q!==void 0?Q:""}"
          $m = Import-Module Az.Accounts -MinimumVersion 2.2.0 -PassThru
          $useSecureString = $m.Version -ge [version]'2.17.0'

          $params = @{
            ResourceUrl = "${A}"
          }

          if ($tenantId.Length -gt 0) {
            $params["TenantId"] = $tenantId
          }

          if ($useSecureString) {
            $params["AsSecureString"] = $true
          }

          $token = Get-AzAccessToken @params

          $result = New-Object -TypeName PSObject
          $result | Add-Member -MemberType NoteProperty -Name ExpiresOn -Value $token.ExpiresOn
          if ($useSecureString) {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value (ConvertFrom-SecureString -AsPlainText $token.Token)
          } else {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value $token.Token
          }

          Write-Output (ConvertTo-Json $result)
          `]
      ]))[0];
      return ni8(Y)
    }
    throw Error("Unable to execute PowerShell. Ensure that it is installed in your system")
  }
  async getToken(A, Q = {}) {
    return LX.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      let B = _C(this.tenantId, Q, this.additionallyAllowedTenantIds),
        G = typeof A === "string" ? A : A[0];
      if (B) IN(em, B);
      try {
        sWA(G, em), em.getToken.info(`Using the scope ${G}`);
        let Z = e81(G),
          Y = await this.getAzurePowerShellAccessToken(Z, B, this.timeout);
        return em.getToken.info(HF(A)), {
          token: Y.Token,
          expiresOnTimestamp: new Date(Y.ExpiresOn).getTime(),
          tokenType: "Bearer"
        }
      } catch (Z) {
        if (ii8(Z)) {
          let J = new U4(_G0.installed);
          throw em.getToken.info(PG(G, J)), J
        } else if (li8(Z)) {
          let J = new U4(_G0.login);
          throw em.getToken.info(PG(G, J)), J
        }
        let Y = new U4(`${Z}. ${_G0.troubleshoot}`);
        throw em.getToken.info(PG(G, Y)), Y
      }
    })
  }
}
// @from(Ln 240714, Col 0)
async function ni8(A) {
  let Q = /{[^{}]*}/g,
    B = A.match(Q),
    G = A;
  if (B) try {
    for (let Z of B) try {
      let Y = JSON.parse(Z);
      if (Y === null || Y === void 0 ? void 0 : Y.Token) {
        if (G = G.replace(Z, ""), G) em.getToken.warning(G);
        return Y
      }
    } catch (Y) {
      continue
    }
  } catch (Z) {
    throw Error(`Unable to parse the output of PowerShell. Received output: ${A}`)
  }
  throw Error(`No access token found in the output. Received output: ${A}`)
}
// @from(Ln 240733, Col 4)
em
// @from(Ln 240733, Col 8)
OrB
// @from(Ln 240733, Col 13)
RrB
// @from(Ln 240733, Col 18)
_G0
// @from(Ln 240733, Col 23)
li8 = (A) => A.message.match(`(.*)${RrB.login}(.*)`)
// @from(Ln 240734, Col 2)
ii8 = (A) => A.message.match(RrB.installed)
// @from(Ln 240735, Col 2)
jG0
// @from(Ln 240736, Col 4)
_rB = w(() => {
  rP();
  uD();
  tWA();
  RC();
  wrB();
  tL();
  em = p7("AzurePowerShellCredential"), OrB = process.platform === "win32";
  RrB = {
    login: "Run Connect-AzAccount to login",
    installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
  }, _G0 = {
    login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
    installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
    troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
  }, jG0 = [MrB("pwsh")];
  if (OrB) jG0.push(MrB("powershell"))
})
// @from(Ln 240754, Col 0)
class SG0 {
  constructor(...A) {
    this._sources = [], this._sources = A
  }
  async getToken(A, Q = {}) {
    let {
      token: B
    } = await this.getTokenInternal(A, Q);
    return B
  }
  async getTokenInternal(A, Q = {}) {
    let B = null,
      G, Z = [];
    return LX.withSpan("ChainedTokenCredential.getToken", Q, async (Y) => {
      for (let J = 0; J < this._sources.length && B === null; J++) try {
        B = await this._sources[J].getToken(A, Y), G = this._sources[J]
      } catch (X) {
        if (X.name === "CredentialUnavailableError" || X.name === "AuthenticationRequiredError") Z.push(X);
        else throw PG0.getToken.info(PG(A, X)), X
      }
      if (!B && Z.length > 0) {
        let J = new M30(Z, "ChainedTokenCredential authentication failed.");
        throw PG0.getToken.info(PG(A, J)), J
      }
      if (PG0.getToken.info(`Result for ${G.constructor.name}: ${HF(A)}`), B === null) throw new U4("Failed to retrieve a valid token");
      return {
        token: B,
        successfulCredential: G
      }
    })
  }
}
// @from(Ln 240786, Col 4)
PG0
// @from(Ln 240787, Col 4)
jrB = w(() => {
  RC();
  uD();
  tL();
  PG0 = p7("ChainedTokenCredential")
})
// @from(Ln 240800, Col 0)
class xG0 {
  constructor(A, Q, B, G = {}) {
    if (!A || !Q) throw Error(`${LSA}: tenantId and clientId are required parameters.`);
    this.tenantId = A, this.additionallyAllowedTenantIds = DN(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.sendCertificateChain = G.sendCertificateChain, this.certificateConfiguration = Object.assign({}, typeof B === "string" ? {
      certificatePath: B
    } : B);
    let Z = this.certificateConfiguration.certificate,
      Y = this.certificateConfiguration.certificatePath;
    if (!this.certificateConfiguration || !(Z || Y)) throw Error(`${LSA}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (Z && Y) throw Error(`${LSA}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    this.msalClient = io(Q, A, Object.assign(Object.assign({}, G), {
      logger: PrB,
      tokenCredentialOptions: G
    }))
  }
  async getToken(A, Q = {}) {
    return LX.withSpan(`${LSA}.getToken`, Q, async (B) => {
      B.tenantId = _C(this.tenantId, B, this.additionallyAllowedTenantIds, PrB);
      let G = Array.isArray(A) ? A : [A],
        Z = await this.buildClientCertificate();
      return this.msalClient.getTokenByClientCertificate(G, Z, B)
    })
  }
  async buildClientCertificate() {
    var A;
    let Q = await ri8(this.certificateConfiguration, (A = this.sendCertificateChain) !== null && A !== void 0 ? A : !1),
      B;
    if (this.certificateConfiguration.certificatePassword !== void 0) B = ai8({
      key: Q.certificateContents,
      passphrase: this.certificateConfiguration.certificatePassword,
      format: "pem"
    }).export({
      format: "pem",
      type: "pkcs8"
    }).toString();
    else B = Q.certificateContents;
    return {
      thumbprint: Q.thumbprint,
      thumbprintSha256: Q.thumbprintSha256,
      privateKey: B,
      x5c: Q.x5c
    }
  }
}
// @from(Ln 240844, Col 0)
async function ri8(A, Q) {
  let {
    certificate: B,
    certificatePath: G
  } = A, Z = B || await oi8(G, "utf8"), Y = Q ? Z : void 0, J = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, X = [], I;
  do
    if (I = J.exec(Z), I) X.push(I[3]); while (I);
  if (X.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
  let D = TrB("sha1").update(Buffer.from(X[0], "base64")).digest("hex").toUpperCase(),
    W = TrB("sha256").update(Buffer.from(X[0], "base64")).digest("hex").toUpperCase();
  return {
    certificateContents: Z,
    thumbprintSha256: W,
    thumbprint: D,
    x5c: Y
  }
}
// @from(Ln 240861, Col 4)
LSA = "ClientCertificateCredential"
// @from(Ln 240862, Col 2)
PrB
// @from(Ln 240863, Col 4)
SrB = w(() => {
  NSA();
  rP();
  uD();
  tL();
  PrB = p7(LSA)
})
// @from(Ln 240870, Col 0)
class yG0 {
  constructor(A, Q, B, G = {}) {
    if (!A) throw new U4("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!Q) throw new U4("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!B) throw new U4("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    this.clientSecret = B, this.tenantId = A, this.additionallyAllowedTenantIds = DN(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.msalClient = io(Q, A, Object.assign(Object.assign({}, G), {
      logger: xrB,
      tokenCredentialOptions: G
    }))
  }
  async getToken(A, Q = {}) {
    return LX.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = _C(this.tenantId, B, this.additionallyAllowedTenantIds, xrB);
      let G = t81(A);
      return this.msalClient.getTokenByClientSecret(G, this.clientSecret, B)
    })
  }
}
// @from(Ln 240888, Col 4)
xrB
// @from(Ln 240889, Col 4)
yrB = w(() => {
  NSA();
  rP();
  RC();
  uD();
  tWA();
  tL();
  xrB = p7("ClientSecretCredential")
})
// @from(Ln 240898, Col 0)
class vG0 {
  constructor(A, Q, B, G, Z = {}) {
    if (!A) throw new U4("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!Q) throw new U4("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!B) throw new U4("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!G) throw new U4("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    this.tenantId = A, this.additionallyAllowedTenantIds = DN(Z === null || Z === void 0 ? void 0 : Z.additionallyAllowedTenants), this.username = B, this.password = G, this.msalClient = io(Q, this.tenantId, Object.assign(Object.assign({}, Z), {
      tokenCredentialOptions: Z !== null && Z !== void 0 ? Z : {}
    }))
  }
  async getToken(A, Q = {}) {
    return LX.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = _C(this.tenantId, B, this.additionallyAllowedTenantIds, si8);
      let G = t81(A);
      return this.msalClient.getTokenByUsernamePassword(G, this.username, this.password, B)
    })
  }
}
// @from(Ln 240916, Col 4)
si8
// @from(Ln 240917, Col 4)
vrB = w(() => {
  NSA();
  rP();
  RC();
  uD();
  tWA();
  tL();
  si8 = p7("UsernamePasswordCredential")
})
// @from(Ln 240927, Col 0)
function ei8() {
  var A;
  return ((A = process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS) !== null && A !== void 0 ? A : "").split(";")
}
// @from(Ln 240932, Col 0)
function An8() {
  var A;
  let Q = ((A = process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN) !== null && A !== void 0 ? A : "").toLowerCase(),
    B = Q === "true" || Q === "1";
  return Ad.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${B}`), B
}
// @from(Ln 240938, Col 0)
class kG0 {
  constructor(A) {
    this._credential = void 0;
    let Q = m61(ti8).assigned.join(", ");
    Ad.info(`Found the following environment variables: ${Q}`);
    let B = process.env.AZURE_TENANT_ID,
      G = process.env.AZURE_CLIENT_ID,
      Z = process.env.AZURE_CLIENT_SECRET,
      Y = ei8(),
      J = An8(),
      X = Object.assign(Object.assign({}, A), {
        additionallyAllowedTenantIds: Y,
        sendCertificateChain: J
      });
    if (B) IN(Ad, B);
    if (B && G && Z) {
      Ad.info(`Invoking ClientSecretCredential with tenant ID: ${B}, clientId: ${G} and clientSecret: [REDACTED]`), this._credential = new yG0(B, G, Z, X);
      return
    }
    let I = process.env.AZURE_CLIENT_CERTIFICATE_PATH,
      D = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
    if (B && G && I) {
      Ad.info(`Invoking ClientCertificateCredential with tenant ID: ${B}, clientId: ${G} and certificatePath: ${I}`), this._credential = new xG0(B, G, {
        certificatePath: I,
        certificatePassword: D
      }, X);
      return
    }
    let W = process.env.AZURE_USERNAME,
      K = process.env.AZURE_PASSWORD;
    if (B && G && W && K) Ad.info(`Invoking UsernamePasswordCredential with tenant ID: ${B}, clientId: ${G} and username: ${W}`), Ad.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new vG0(B, G, W, K, X)
  }
  async getToken(A, Q = {}) {
    return LX.withSpan(`${A51}.getToken`, Q, async (B) => {
      if (this._credential) try {
        let G = await this._credential.getToken(A, B);
        return Ad.getToken.info(HF(A)), G
      } catch (G) {
        let Z = new NTA(400, {
          error: `${A51} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
          error_description: G.message.toString().split("More details:").join("")
        });
        throw Ad.getToken.info(PG(A, Z)), Z
      }
      throw new U4(`${A51} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`)
    })
  }
}
// @from(Ln 240986, Col 4)
ti8
// @from(Ln 240986, Col 9)
A51 = "EnvironmentCredential"
// @from(Ln 240987, Col 2)
Ad
// @from(Ln 240988, Col 4)
krB = w(() => {
  RC();
  uD();
  SrB();
  yrB();
  vrB();
  rP();
  tL();
  ti8 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "AZURE_CLIENT_CERTIFICATE_PASSWORD", "AZURE_USERNAME", "AZURE_PASSWORD", "AZURE_ADDITIONALLY_ALLOWED_TENANTS", "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"];
  Ad = p7(A51)
})
// @from(Ln 241000, Col 0)
function Qn8(A = {}) {
  var Q, B, G, Z;
  (Q = A.retryOptions) !== null && Q !== void 0 || (A.retryOptions = {
    maxRetries: 5,
    retryDelayInMs: 800
  });
  let Y = (B = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && B !== void 0 ? B : process.env.AZURE_CLIENT_ID,
    J = (G = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && G !== void 0 ? G : Y,
    X = A === null || A === void 0 ? void 0 : A.managedIdentityResourceId,
    I = process.env.AZURE_FEDERATED_TOKEN_FILE,
    D = (Z = A === null || A === void 0 ? void 0 : A.tenantId) !== null && Z !== void 0 ? Z : process.env.AZURE_TENANT_ID;
  if (X) {
    let W = Object.assign(Object.assign({}, A), {
      resourceId: X
    });
    return new rWA(W)
  }
  if (I && J) {
    let W = Object.assign(Object.assign({}, A), {
      tenantId: D
    });
    return new rWA(J, W)
  }
  if (Y) {
    let W = Object.assign(Object.assign({}, A), {
      clientId: Y
    });
    return new rWA(W)
  }
  return new rWA(A)
}
// @from(Ln 241032, Col 0)
function Bn8(A) {
  var Q, B, G;
  let Z = (Q = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && Q !== void 0 ? Q : process.env.AZURE_CLIENT_ID,
    Y = (B = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && B !== void 0 ? B : Z,
    J = process.env.AZURE_FEDERATED_TOKEN_FILE,
    X = (G = A === null || A === void 0 ? void 0 : A.tenantId) !== null && G !== void 0 ? G : process.env.AZURE_TENANT_ID;
  if (J && Y) {
    let I = Object.assign(Object.assign({}, A), {
      tenantId: X,
      clientId: Y,
      tokenFilePath: J
    });
    return new R9A(I)
  }
  if (X) {
    let I = Object.assign(Object.assign({}, A), {
      tenantId: X
    });
    return new R9A(I)
  }
  return new R9A(A)
}
// @from(Ln 241055, Col 0)
function Gn8(A = {}) {
  let Q = A.processTimeoutInMs;
  return new RG0(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Ln 241062, Col 0)
function Zn8(A = {}) {
  let Q = A.processTimeoutInMs;
  return new MG0(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Ln 241069, Col 0)
function Yn8(A = {}) {
  let Q = A.processTimeoutInMs;
  return new TG0(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Ln 241076, Col 0)
function Jn8(A = {}) {
  return new kG0(A)
}
// @from(Ln 241079, Col 0)
class brB {
  constructor(A, Q) {
    this.credentialName = A, this.credentialUnavailableErrorMessage = Q
  }
  getToken() {
    return bG0.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null)
  }
}
// @from(Ln 241087, Col 4)
bG0
// @from(Ln 241087, Col 9)
Q51
// @from(Ln 241088, Col 4)
frB = w(() => {
  HrB();
  $rB();
  UrB();
  _rB();
  jrB();
  krB();
  wG0();
  uD();
  bG0 = p7("DefaultAzureCredential");
  Q51 = class Q51 extends SG0 {
    constructor(A) {
      let Q = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0,
        B = [Zn8, Yn8, Gn8],
        G = [Jn8, Bn8, Qn8],
        Z = [];
      if (Q) switch (Q) {
        case "dev":
          Z = B;
          break;
        case "prod":
          Z = G;
          break;
        default: {
          let J = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev'.`;
          throw bG0.warning(J), Error(J)
        }
      } else Z = [...G, ...B];
      let Y = Z.map((J) => {
        try {
          return J(A)
        } catch (X) {
          return bG0.warning(`Skipped ${J.name} because of an error creating the credential: ${X}`), new brB(J.name, X.message)
        }
      });
      super(...Y)
    }
  }
})
// @from(Ln 241128, Col 0)
function fG0(A, Q, B) {
  let {
    abortSignal: G,
    tracingOptions: Z
  } = B || {}, Y = PTA();
  Y.addPolicy(bTA({
    credential: A,
    scopes: Q
  }));
  async function J() {
    var X;
    let D = (X = (await Y.sendRequest({
      sendRequest: (W) => Promise.resolve({
        request: W,
        status: 200,
        headers: W.headers
      })
    }, eP({
      url: "https://example.com",
      abortSignal: G,
      tracingOptions: Z
    }))).headers.get("authorization")) === null || X === void 0 ? void 0 : X.split(" ")[1];
    if (!D) throw Error("Failed to get access token");
    return D
  }
  return J
}
// @from(Ln 241155, Col 4)
hrB = w(() => {
  Sm()
})
// @from(Ln 241158, Col 4)
grB = w(() => {
  frB();
  hrB();
  ccB()
})
// @from(Ln 241164, Col 0)
function B51() {
  return {
    error: (A, ...Q) => console.error("[Anthropic SDK ERROR]", A, ...Q),
    warn: (A, ...Q) => console.error("[Anthropic SDK WARN]", A, ...Q),
    info: (A, ...Q) => console.error("[Anthropic SDK INFO]", A, ...Q),
    debug: (A, ...Q) => console.error("[Anthropic SDK DEBUG]", A, ...Q)
  }
}
// @from(Ln 241172, Col 0)
async function XS({
  apiKey: A,
  maxRetries: Q,
  model: B,
  fetchOverride: G
}) {
  let Z = process.env.CLAUDE_CODE_CONTAINER_ID,
    Y = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
    J = In8(),
    X = {
      "x-app": "cli",
      "User-Agent": gn(),
      ...J,
      ...Z ? {
        "x-claude-remote-container-id": Z
      } : {},
      ...Y ? {
        "x-claude-remote-session-id": Y
      } : {}
    };
  if (k(`[API:request] Creating client, ANTHROPIC_CUSTOM_HEADERS present: ${!!process.env.ANTHROPIC_CUSTOM_HEADERS}, has Authorization header: ${!!J.Authorization}`), a1(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) X["x-anthropic-additional-protection"] = "true";
  if (k("[API:auth] OAuth token check starting"), await xR(), k("[API:auth] OAuth token check complete"), !qB()) Xn8(X, p2());
  let D = {
    defaultHeaders: X,
    maxRetries: Q,
    timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
    dangerouslyAllowBrowser: !0,
    fetchOptions: pJA(),
    ...G && {
      fetch: G
    }
  };
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    let K = B === SD() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : lAA(),
      V = {
        ...D,
        awsRegion: K,
        ...a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && {
          skipAuth: !0
        },
        ...Sy() && {
          logger: B51()
        }
      };
    if (process.env.AWS_BEARER_TOKEN_BEDROCK) V.skipAuth = !0, V.defaultHeaders = {
      ...V.defaultHeaders,
      Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
    };
    else if (!a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
      let F = await DQA();
      if (F) V.awsAccessKey = F.accessKeyId, V.awsSecretKey = F.secretAccessKey, V.awsSessionToken = F.sessionToken
    }
    return new b41(V)
  }
  if (a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    let K;
    if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
      if (a1(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) K = () => Promise.resolve("");
      else K = fG0(new Q51, "https://cognitiveservices.azure.com/.default");
    let V = {
      ...D,
      ...K && {
        azureADTokenProvider: K
      },
      ...Sy() && {
        logger: B51()
      }
    };
    return new u41(V)
  }
  if (a1(process.env.CLAUDE_CODE_USE_VERTEX)) {
    let K = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project,
      V = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials,
      F = a1(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH) ? {
        getClient: () => ({
          getRequestHeaders: () => ({})
        })
      } : new urB.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        ...K || V ? {} : {
          projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID
        }
      }),
      H = {
        ...D,
        region: SdA(B),
        googleAuth: F,
        ...Sy() && {
          logger: B51()
        }
      };
    return new v61(H)
  }
  let W = {
    apiKey: qB() ? null : A || YL(),
    authToken: qB() ? g4()?.accessToken : void 0,
    ...{},
    ...D,
    ...Sy() && {
      logger: B51()
    }
  };
  return new hP(W)
}
// @from(Ln 241277, Col 0)
function Xn8(A, Q) {
  let B = process.env.ANTHROPIC_AUTH_TOKEN || mOA(Q);
  if (B) A.Authorization = `Bearer ${B}`
}
// @from(Ln 241282, Col 0)
function In8() {
  let A = {},
    Q = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!Q) return A;
  let B = Q.split(/\n|\r\n/);
  for (let G of B) {
    if (!G.trim()) continue;
    let Z = G.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (Z) {
      let [, Y, J] = Z;
      if (Y && J !== void 0) A[Y] = J
    }
  }
  return A
}
// @from(Ln 241297, Col 4)
urB
// @from(Ln 241298, Col 4)
OSA = w(() => {
  xyB();
  hyB();
  vk();
  guB();
  grB();
  Q2();
  C0();
  qz();
  fQ();
  fn();
  JX();
  T1();
  l2();
  urB = c(W30(), 1)
})
// @from(Ln 241315, Col 0)
function hG0(A) {
  if (_ZA()) return xEQ(A);
  return A
}
// @from(Ln 241320, Col 0)
function eWA(A) {
  return A || _ZA()
}
// @from(Ln 241324, Col 0)
function mrB(A) {
  return _ZA() && A.status === 429
}
// @from(Ln 241327, Col 4)
MSA = w(() => {
  onA();
  vk();
  l2()
})
// @from(Ln 241333, Col 0)
function drB(A) {
  return Dn8.some((Q) => A.startsWith(Q))
}
// @from(Ln 241337, Col 0)
function crB(A, Q) {
  if (A.isUsingOverage) {
    if (A.overageStatus === "allowed_warning") return {
      message: "You're close to your extra usage spending limit",
      severity: "warning"
    };
    return null
  }
  if (A.status === "rejected") return {
    message: Wn8(A, Q),
    severity: "error"
  };
  if (A.status === "allowed_warning") {
    if (A.utilization !== void 0 && A.utilization < 0.7) return null;
    if (ZP()) {
      let Z = N6(),
        Y = Z === "team" || Z === "enterprise",
        J = v3()?.hasExtraUsageEnabled === !0;
      if (Y && J && !Xk()) return null
    }
    let G = Kn8(A);
    if (G) return {
      message: G,
      severity: "warning"
    }
  }
  return null
}
// @from(Ln 241366, Col 0)
function gG0(A, Q) {
  let B = crB(A, Q);
  if (B && B.severity === "error") return B.message;
  return null
}
// @from(Ln 241372, Col 0)
function uG0(A, Q) {
  let B = crB(A, Q);
  if (B && B.severity === "warning") return B.message;
  return null
}