
// @from(Start 8232628, End 8233275)
$AA = L(() => {
  p7();
  UI();
  uZA();
  loB();
  ioB();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  UAA = {
    MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
    MANAGED_IDENTITY_CLIENT_ID: "client_id",
    MANAGED_IDENTITY_OBJECT_ID: "object_id",
    MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
    MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
  };
  jU.getValidatedEnvVariableUrlString = (A, Q, B, G) => {
    try {
      return new w8(Q).urlString
    } catch (Z) {
      throw G.info(`[Managed Identity] ${B} managed identity is unavailable because the '${A}' environment variable is malformed.`), _W(KAA[A])
    }
  }
})
// @from(Start 8233277, End 8233481)
class Dr1 {
  calculateDelay(A, Q) {
    if (!A) return Q;
    let B = Math.round(parseFloat(A) * 1000);
    if (isNaN(B)) B = new Date(A).valueOf() - new Date().valueOf();
    return Math.max(Q, B)
  }
}
// @from(Start 8233486, End 8233548)
noB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8233550, End 8234051)
class h11 {
  constructor() {
    this.linearRetryStrategy = new Dr1
  }
  static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
    return tt6
  }
  async pauseForRetry(A, Q, B, G) {
    if (et6.includes(A) && Q < ot6) {
      let Z = this.linearRetryStrategy.calculateDelay(G, h11.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
      return B.verbose(`Retrying request in ${Z}ms (retry attempt: ${Q+1})`), await new Promise((I) => {
        return setTimeout(I, Z)
      }), !0
    }
    return !1
  }
}
// @from(Start 8234056, End 8234063)
ot6 = 3
// @from(Start 8234067, End 8234077)
tt6 = 1000
// @from(Start 8234081, End 8234084)
et6
// @from(Start 8234090, End 8234294)
aoB = L(() => {
  q11();
  noB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  et6 = [o4.NOT_FOUND, o4.REQUEST_TIMEOUT, o4.TOO_MANY_REQUESTS, o4.SERVER_ERROR, o4.SERVICE_UNAVAILABLE, o4.GATEWAY_TIMEOUT]
})
// @from(Start 8234296, End 8234880)
class Xq {
  constructor(A, Q, B) {
    this.httpMethod = A, this._baseEndpoint = Q, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = B || new h11
  }
  computeUri() {
    let A = new Map;
    if (this.queryParameters) PB.addExtraQueryParameters(A, this.queryParameters);
    let Q = OD.mapToQueryString(A);
    return w8.appendQueryString(this._baseEndpoint, Q)
  }
  computeParametersBodyString() {
    let A = new Map;
    if (this.bodyParameters) PB.addExtraQueryParameters(A, this.bodyParameters);
    return OD.mapToQueryString(A)
  }
}
// @from(Start 8234885, End 8234962)
wAA = L(() => {
  p7();
  aoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8234968, End 8234986)
Ae6 = "2019-08-01"
// @from(Start 8234990, End 8234993)
qAA
// @from(Start 8234999, End 8236429)
soB = L(() => {
  $AA();
  UI();
  wAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  qAA = class qAA extends jU {
    constructor(A, Q, B, G, Z, I, Y) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I, this.identityHeader = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.IDENTITY_ENDPOINT],
        Q = process.env[C4.IDENTITY_HEADER];
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z) {
      let [I, Y] = qAA.getEnvironmentVariables();
      if (!I || !Y) return A.info(`[Managed Identity] ${S4.APP_SERVICE} managed identity is unavailable because one or both of the '${C4.IDENTITY_HEADER}' and '${C4.IDENTITY_ENDPOINT}' environment variables are not defined.`), null;
      let J = qAA.getValidatedEnvVariableUrlString(C4.IDENTITY_ENDPOINT, I, S4.APP_SERVICE, A);
      return A.info(`[Managed Identity] Environment variables validation passed for ${S4.APP_SERVICE} managed identity. Endpoint URI: ${J}. Creating ${S4.APP_SERVICE} managed identity.`), new qAA(A, Q, B, G, Z, I, Y)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.identityEndpoint);
      if (B.headers[TU.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, B.queryParameters[pX.API_VERSION] = Ae6, B.queryParameters[pX.RESOURCE] = A, Q.idType !== iY.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType)] = Q.id;
      return B
    }
  }
})
// @from(Start 8236563, End 8236581)
Ie6 = "2019-11-01"
// @from(Start 8236585, End 8236646)
ooB = "http://127.0.0.1:40342/metadata/identity/oauth2/token"
// @from(Start 8236650, End 8236686)
toB = "N/A: himds executable exists"
// @from(Start 8236690, End 8236693)
eoB
// @from(Start 8236695, End 8236698)
Ye6
// @from(Start 8236700, End 8236702)
ql
// @from(Start 8236708, End 8240112)
AtB = L(() => {
  p7();
  wAA();
  $AA();
  uZA();
  UI();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  eoB = {
    win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
    linux: "/var/opt/azcmagent/tokens/"
  }, Ye6 = {
    win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
    linux: "/opt/azcmagent/bin/himds"
  };
  ql = class ql extends jU {
    constructor(A, Q, B, G, Z, I) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.IDENTITY_ENDPOINT],
        Q = process.env[C4.IMDS_ENDPOINT];
      if (!A || !Q) {
        let B = Ye6[process.platform];
        try {
          Qe6(B, roB.F_OK | roB.R_OK), A = ooB, Q = toB
        } catch (G) {}
      }
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z, I) {
      let [Y, J] = ql.getEnvironmentVariables();
      if (!Y || !J) return A.info(`[Managed Identity] ${S4.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${C4.IDENTITY_ENDPOINT}' and '${C4.IMDS_ENDPOINT}' are not defined. ${S4.AZURE_ARC} managed identity is also unavailable through file detection.`), null;
      if (J === toB) A.info(`[Managed Identity] ${S4.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${S4.AZURE_ARC} endpoint: ${ooB}. Creating ${S4.AZURE_ARC} managed identity.`);
      else {
        let W = ql.getValidatedEnvVariableUrlString(C4.IDENTITY_ENDPOINT, Y, S4.AZURE_ARC, A);
        W.endsWith("/") && W.slice(0, -1), ql.getValidatedEnvVariableUrlString(C4.IMDS_ENDPOINT, J, S4.AZURE_ARC, A), A.info(`[Managed Identity] Environment variables validation passed for ${S4.AZURE_ARC} managed identity. Endpoint URI: ${W}. Creating ${S4.AZURE_ARC} managed identity.`)
      }
      if (I.idType !== iY.SYSTEM_ASSIGNED) throw _W(D11);
      return new ql(A, Q, B, G, Z, Y)
    }
    createRequest(A) {
      let Q = new Xq(zI.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
      return Q.headers[TU.METADATA_HEADER_NAME] = "true", Q.queryParameters[pX.API_VERSION] = Ie6, Q.queryParameters[pX.RESOURCE] = A, Q
    }
    async getServerTokenResponseAsync(A, Q, B, G) {
      let Z;
      if (A.status === o4.UNAUTHORIZED) {
        let I = A.headers["www-authenticate"];
        if (!I) throw _W(E11);
        if (!I.includes("Basic realm=")) throw _W(z11);
        let Y = I.split("Basic realm=")[1];
        if (!eoB.hasOwnProperty(process.platform)) throw _W(K11);
        let J = eoB[process.platform],
          W = Ze6.basename(Y);
        if (!W.endsWith(".key")) throw _W(X11);
        if (J + W !== Y) throw _W(V11);
        let X;
        try {
          X = await Be6(Y).size
        } catch (K) {
          throw _W(DNA)
        }
        if (X > QsB) throw _W(F11);
        let V;
        try {
          V = Ge6(Y, MD.UTF8)
        } catch (K) {
          throw _W(DNA)
        }
        let F = `Basic ${V}`;
        this.logger.info("[Managed Identity] Adding authorization header to the request."), B.headers[TU.AUTHORIZATION_HEADER_NAME] = F;
        try {
          Z = await Q.sendGetRequestAsync(B.computeUri(), G)
        } catch (K) {
          if (K instanceof t4) throw K;
          else throw b0(fG.networkError)
        }
      }
      return this.getServerTokenResponse(Z || A)
    }
  }
})
// @from(Start 8240118, End 8240121)
NAA
// @from(Start 8240127, End 8241257)
QtB = L(() => {
  wAA();
  $AA();
  UI();
  uZA();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  NAA = class NAA extends jU {
    constructor(A, Q, B, G, Z, I) {
      super(A, Q, B, G, Z);
      this.msiEndpoint = I
    }
    static getEnvironmentVariables() {
      return [process.env[C4.MSI_ENDPOINT]]
    }
    static tryCreate(A, Q, B, G, Z, I) {
      let [Y] = NAA.getEnvironmentVariables();
      if (!Y) return A.info(`[Managed Identity] ${S4.CLOUD_SHELL} managed identity is unavailable because the '${C4.MSI_ENDPOINT} environment variable is not defined.`), null;
      let J = NAA.getValidatedEnvVariableUrlString(C4.MSI_ENDPOINT, Y, S4.CLOUD_SHELL, A);
      if (A.info(`[Managed Identity] Environment variable validation passed for ${S4.CLOUD_SHELL} managed identity. Endpoint URI: ${J}. Creating ${S4.CLOUD_SHELL} managed identity.`), I.idType !== iY.SYSTEM_ASSIGNED) throw _W(H11);
      return new NAA(A, Q, B, G, Z, Y)
    }
    createRequest(A) {
      let Q = new Xq(zI.POST, this.msiEndpoint);
      return Q.headers[TU.METADATA_HEADER_NAME] = "true", Q.bodyParameters[pX.RESOURCE] = A, Q
    }
  }
})
// @from(Start 8241259, End 8241579)
class Hr1 {
  constructor(A, Q, B) {
    this.minExponentialBackoff = A, this.maxExponentialBackoff = Q, this.exponentialDeltaBackoff = B
  }
  calculateDelay(A) {
    if (A === 0) return this.minExponentialBackoff;
    return Math.min(Math.pow(2, A - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff)
  }
}
// @from(Start 8241584, End 8241646)
BtB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8241648, End 8242706)
class LAA {
  constructor() {
    this.exponentialRetryStrategy = new Hr1(LAA.MIN_EXPONENTIAL_BACKOFF_MS, LAA.MAX_EXPONENTIAL_BACKOFF_MS, LAA.EXPONENTIAL_DELTA_BACKOFF_MS)
  }
  static get MIN_EXPONENTIAL_BACKOFF_MS() {
    return Ve6
  }
  static get MAX_EXPONENTIAL_BACKOFF_MS() {
    return Fe6
  }
  static get EXPONENTIAL_DELTA_BACKOFF_MS() {
    return Ke6
  }
  static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
    return De6
  }
  set isNewRequest(A) {
    this._isNewRequest = A
  }
  async pauseForRetry(A, Q, B) {
    if (this._isNewRequest) this._isNewRequest = !1, this.maxRetries = A === o4.GONE ? Xe6 : We6;
    if ((Je6.includes(A) || A >= o4.SERVER_ERROR_RANGE_START && A <= o4.SERVER_ERROR_RANGE_END && Q < this.maxRetries) && Q < this.maxRetries) {
      let G = A === o4.GONE ? LAA.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(Q);
      return B.verbose(`Retrying request in ${G}ms (retry attempt: ${Q+1})`), await new Promise((Z) => {
        return setTimeout(Z, G)
      }), !0
    }
    return !1
  }
}
// @from(Start 8242711, End 8242714)
Je6
// @from(Start 8242716, End 8242723)
We6 = 3
// @from(Start 8242727, End 8242734)
Xe6 = 7
// @from(Start 8242738, End 8242748)
Ve6 = 1000
// @from(Start 8242752, End 8242762)
Fe6 = 4000
// @from(Start 8242766, End 8242776)
Ke6 = 2000
// @from(Start 8242780, End 8242789)
De6 = 1e4
// @from(Start 8242795, End 8242947)
GtB = L(() => {
  q11();
  BtB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Je6 = [o4.NOT_FOUND, o4.REQUEST_TIMEOUT, o4.GONE, o4.TOO_MANY_REQUESTS]
})
// @from(Start 8242953, End 8242992)
ZtB = "/metadata/identity/oauth2/token"
// @from(Start 8242996, End 8242999)
He6
// @from(Start 8243001, End 8243019)
Ce6 = "2018-02-01"
// @from(Start 8243023, End 8243026)
SNA
// @from(Start 8243032, End 8244349)
ItB = L(() => {
  wAA();
  $AA();
  UI();
  GtB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  He6 = `http://169.254.169.254${ZtB}`;
  SNA = class SNA extends jU {
    constructor(A, Q, B, G, Z, I) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I
    }
    static tryCreate(A, Q, B, G, Z) {
      let I;
      if (process.env[C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]) A.info(`[Managed Identity] Environment variable ${C4.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${S4.IMDS} returned endpoint: ${process.env[C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`), I = SNA.getValidatedEnvVariableUrlString(C4.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${ZtB}`, S4.IMDS, A);
      else A.info(`[Managed Identity] Unable to find ${C4.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${S4.IMDS}, using the default endpoint.`), I = He6;
      return new SNA(A, Q, B, G, Z, I)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.identityEndpoint);
      if (B.headers[TU.METADATA_HEADER_NAME] = "true", B.queryParameters[pX.API_VERSION] = Ce6, B.queryParameters[pX.RESOURCE] = A, Q.idType !== iY.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType, !0)] = Q.id;
      return B.retryPolicy = new LAA, B
    }
  }
})
// @from(Start 8244355, End 8244381)
Ee6 = "2019-07-01-preview"
// @from(Start 8244385, End 8244388)
MAA
// @from(Start 8244394, End 8246248)
YtB = L(() => {
  wAA();
  $AA();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  MAA = class MAA extends jU {
    constructor(A, Q, B, G, Z, I, Y) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I, this.identityHeader = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.IDENTITY_ENDPOINT],
        Q = process.env[C4.IDENTITY_HEADER],
        B = process.env[C4.IDENTITY_SERVER_THUMBPRINT];
      return [A, Q, B]
    }
    static tryCreate(A, Q, B, G, Z, I) {
      let [Y, J, W] = MAA.getEnvironmentVariables();
      if (!Y || !J || !W) return A.info(`[Managed Identity] ${S4.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${C4.IDENTITY_HEADER}', '${C4.IDENTITY_ENDPOINT}' or '${C4.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`), null;
      let X = MAA.getValidatedEnvVariableUrlString(C4.IDENTITY_ENDPOINT, Y, S4.SERVICE_FABRIC, A);
      if (A.info(`[Managed Identity] Environment variables validation passed for ${S4.SERVICE_FABRIC} managed identity. Endpoint URI: ${X}. Creating ${S4.SERVICE_FABRIC} managed identity.`), I.idType !== iY.SYSTEM_ASSIGNED) A.warning(`[Managed Identity] ${S4.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`);
      return new MAA(A, Q, B, G, Z, Y, J)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.identityEndpoint);
      if (B.headers[TU.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, B.queryParameters[pX.API_VERSION] = Ee6, B.queryParameters[pX.RESOURCE] = A, Q.idType !== iY.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType)] = Q.id;
      return B
    }
  }
})
// @from(Start 8246254, End 8246272)
ze6 = "2017-09-01"
// @from(Start 8246276, End 8246279)
Ue6
// @from(Start 8246281, End 8246284)
OAA
// @from(Start 8246290, End 8248027)
JtB = L(() => {
  $AA();
  UI();
  wAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Ue6 = `Only client id is supported for user-assigned managed identity in ${S4.MACHINE_LEARNING}.`;
  OAA = class OAA extends jU {
    constructor(A, Q, B, G, Z, I, Y) {
      super(A, Q, B, G, Z);
      this.msiEndpoint = I, this.secret = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.MSI_ENDPOINT],
        Q = process.env[C4.MSI_SECRET];
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z) {
      let [I, Y] = OAA.getEnvironmentVariables();
      if (!I || !Y) return A.info(`[Managed Identity] ${S4.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${C4.MSI_ENDPOINT}' and '${C4.MSI_SECRET}' environment variables are not defined.`), null;
      let J = OAA.getValidatedEnvVariableUrlString(C4.MSI_ENDPOINT, I, S4.MACHINE_LEARNING, A);
      return A.info(`[Managed Identity] Environment variables validation passed for ${S4.MACHINE_LEARNING} managed identity. Endpoint URI: ${J}. Creating ${S4.MACHINE_LEARNING} managed identity.`), new OAA(A, Q, B, G, Z, I, Y)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.msiEndpoint);
      if (B.headers[TU.METADATA_HEADER_NAME] = "true", B.headers[TU.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, B.queryParameters[pX.API_VERSION] = ze6, B.queryParameters[pX.RESOURCE] = A, Q.idType === iY.SYSTEM_ASSIGNED) B.queryParameters[UAA.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[C4.DEFAULT_IDENTITY_CLIENT_ID];
      else if (Q.idType === iY.USER_ASSIGNED_CLIENT_ID) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType, !1, !0)] = Q.id;
      else throw Error(Ue6);
      return B
    }
  }
})
// @from(Start 8248029, End 8249488)
class of {
  constructor(A, Q, B, G, Z) {
    this.logger = A, this.nodeStorage = Q, this.networkClient = B, this.cryptoProvider = G, this.disableInternalRetries = Z
  }
  async sendManagedIdentityTokenRequest(A, Q, B, G) {
    if (!of.identitySource) of.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, Q);
    return of.identitySource.acquireTokenWithManagedIdentity(A, Q, B, G)
  }
  allEnvironmentVariablesAreDefined(A) {
    return Object.values(A).every((Q) => {
      return Q !== void 0
    })
  }
  getManagedIdentitySource() {
    return of.sourceName = this.allEnvironmentVariablesAreDefined(MAA.getEnvironmentVariables()) ? S4.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(qAA.getEnvironmentVariables()) ? S4.APP_SERVICE : this.allEnvironmentVariablesAreDefined(OAA.getEnvironmentVariables()) ? S4.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(NAA.getEnvironmentVariables()) ? S4.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(ql.getEnvironmentVariables()) ? S4.AZURE_ARC : S4.DEFAULT_TO_IMDS, of.sourceName
  }
  selectManagedIdentitySource(A, Q, B, G, Z, I) {
    let Y = MAA.tryCreate(A, Q, B, G, Z, I) || qAA.tryCreate(A, Q, B, G, Z) || OAA.tryCreate(A, Q, B, G, Z) || NAA.tryCreate(A, Q, B, G, Z, I) || ql.tryCreate(A, Q, B, G, Z, I) || SNA.tryCreate(A, Q, B, G, Z);
    if (!Y) throw _W(C11);
    return Y
  }
}
// @from(Start 8249493, End 8249633)
WtB = L(() => {
  soB();
  AtB();
  QtB();
  ItB();
  YtB();
  uZA();
  UI();
  JtB();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8249635, End 8252479)
class Ck {
  constructor(A) {
    this.config = DsB(A || {}), this.logger = new RU(this.config.system.loggerOptions, v11, pT);
    let Q = {
      canonicalAuthority: L0.DEFAULT_AUTHORITY
    };
    if (!Ck.nodeStorage) Ck.nodeStorage = new CAA(this.logger, this.config.managedIdentityId.id, LZA, Q);
    this.networkClient = this.config.system.networkClient, this.cryptoProvider = new rf;
    let B = {
      protocolMode: aH.AAD,
      knownAuthorities: [Rs1],
      cloudDiscoveryMetadata: "",
      authorityMetadata: ""
    };
    this.fakeAuthority = new kV(Rs1, this.networkClient, Ck.nodeStorage, B, this.logger, this.cryptoProvider.createNewGuid(), void 0, !0), this.fakeClientCredentialClient = new zAA({
      authOptions: {
        clientId: this.config.managedIdentityId.id,
        authority: this.fakeAuthority
      }
    }), this.managedIdentityClient = new of(this.logger, Ck.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new HAA
  }
  async acquireToken(A) {
    if (!A.resource) throw hG(OZA.urlEmptyError);
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
    let [B, G] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(Q, this.config, this.cryptoProvider, this.fakeAuthority, Ck.nodeStorage);
    if (Q.claims) {
      let Z = this.managedIdentityClient.getManagedIdentitySource();
      if (B && $e6.includes(Z)) {
        let I = this.hashUtils.sha256(B.accessToken).toString(MD.HEX);
        Q.revokedTokenSha256Hash = I
      }
      return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority)
    }
    if (B) {
      if (G === FZ.PROACTIVELY_REFRESHED) {
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
    return of.sourceName || this.managedIdentityClient.getManagedIdentitySource()
  }
}
// @from(Start 8252484, End 8252487)
$e6
// @from(Start 8252493, End 8252660)
XtB = L(() => {
  p7();
  ks1();
  pZA();
  $NA();
  f11();
  WtB();
  N11();
  UI();
  w11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  $e6 = [S4.SERVICE_FABRIC]
})
// @from(Start 8252662, End 8253303)
class Cr1 {
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
        B = Object.values(Q).filter((Z) => cX.isAccountEntity(Z)),
        G;
      if (B.length > 0) {
        let Z = B[0];
        G = await this.partitionManager.extractKey(Z)
      } else G = await this.partitionManager.getKey();
      await this.client.set(G, A.tokenCache.serialize())
    }
  }
}
// @from(Start 8253308, End 8253376)
VtB = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8253382, End 8253389)
Vq = {}
// @from(Start 8254560, End 8254762)
g11 = L(() => {
  saB();
  doB();
  coB();
  b11();
  f11();
  Vr1();
  Fr1();
  XtB();
  Wr1();
  x11();
  ms1();
  VtB();
  UI();
  $NA();
  p7();
  pZA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8254768, End 8254794)
FtB = L(() => {
  g11()
})
// @from(Start 8254797, End 8255157)
function lZA(A, Q, B) {
  let G = (Z) => {
    return _NA.getToken.info(Z), new Pf({
      scopes: Array.isArray(A) ? A : [A],
      getTokenOptions: B,
      message: Z
    })
  };
  if (!Q) throw G("No response");
  if (!Q.expiresOn) throw G('Response had no "expiresOn" property.');
  if (!Q.accessToken) throw G('Response had no "accessToken" property.')
}
// @from(Start 8255159, End 8255344)
function Er1(A) {
  let Q = A === null || A === void 0 ? void 0 : A.authorityHost;
  if (!Q && owA) Q = process.env.AZURE_AUTHORITY_HOST;
  return Q !== null && Q !== void 0 ? Q : uwA
}
// @from(Start 8255346, End 8255497)
function zr1(A, Q) {
  if (!Q) Q = uwA;
  if (new RegExp(`${A}/?$`).test(Q)) return Q;
  if (Q.endsWith("/")) return Q + A;
  else return `${Q}/${A}`
}
// @from(Start 8255499, End 8255578)
function KtB(A, Q, B) {
  if (A === "adfs" && Q || B) return [Q];
  return []
}
// @from(Start 8255580, End 8255867)
function m11(A) {
  switch (A) {
    case "error":
      return Vq.LogLevel.Error;
    case "info":
      return Vq.LogLevel.Info;
    case "verbose":
      return Vq.LogLevel.Verbose;
    case "warning":
      return Vq.LogLevel.Warning;
    default:
      return Vq.LogLevel.Info
  }
}
// @from(Start 8255869, End 8256942)
function RAA(A, Q, B) {
  if (Q.name === "AuthError" || Q.name === "ClientAuthError" || Q.name === "BrowserAuthError") {
    let G = Q;
    switch (G.errorCode) {
      case "endpoints_resolution_error":
        return _NA.info(d7(A, Q.message)), new p9(Q.message);
      case "device_code_polling_cancelled":
        return new HZA("The authentication has been aborted by the caller.");
      case "consent_required":
      case "interaction_required":
      case "login_required":
        _NA.info(d7(A, `Authentication returned errorCode ${G.errorCode}`));
        break;
      default:
        _NA.info(d7(A, `Failed to acquire token: ${Q.message}`));
        break
    }
  }
  if (Q.name === "ClientConfigurationError" || Q.name === "BrowserConfigurationAuthError" || Q.name === "AbortError" || Q.name === "AuthenticationError") return Q;
  if (Q.name === "NativeAuthError") return _NA.info(d7(A, `Error from the native broker: ${Q.message} with status code: ${Q.statusCode}`)), Q;
  return new Pf({
    scopes: A,
    getTokenOptions: B,
    message: Q.message
  })
}
// @from(Start 8256944, End 8257132)
function DtB(A) {
  return {
    localAccountId: A.homeAccountId,
    environment: A.authority,
    username: A.username,
    homeAccountId: A.homeAccountId,
    tenantId: A.tenantId
  }
}
// @from(Start 8257134, End 8257380)
function HtB(A, Q) {
  var B;
  return {
    authority: (B = Q.environment) !== null && B !== void 0 ? B : xpB,
    homeAccountId: Q.homeAccountId,
    tenantId: Q.tenantId || ypB,
    username: Q.username,
    clientId: A,
    version: we6
  }
}
// @from(Start 8257385, End 8257388)
_NA
// @from(Start 8257390, End 8257401)
we6 = "1.0"
// @from(Start 8257405, End 8257889)
u11 = (A, Q = XA1 ? "Node" : "Browser") => (B, G, Z) => {
    if (Z) return;
    switch (B) {
      case Vq.LogLevel.Error:
        A.info(`MSAL ${Q} V2 error: ${G}`);
        return;
      case Vq.LogLevel.Info:
        A.info(`MSAL ${Q} V2 info message: ${G}`);
        return;
      case Vq.LogLevel.Verbose:
        A.info(`MSAL ${Q} V2 verbose message: ${G}`);
        return;
      case Vq.LogLevel.Warning:
        A.info(`MSAL ${Q} V2 warning: ${G}`);
        return
    }
  }
// @from(Start 8257895, End 8257992)
Ur1 = L(() => {
  DE();
  jW();
  IZA();
  tp();
  mn1();
  FtB();
  _NA = W7("IdentityUtils")
})
// @from(Start 8257995, End 8258387)
function CtB(A) {
  return sn1([{
    name: "imdsRetryPolicy",
    retry: ({
      retryCount: Q,
      response: B
    }) => {
      if ((B === null || B === void 0 ? void 0 : B.status) !== 404) return {
        skipStrategy: !0
      };
      return siB(Q, {
        retryDelayInMs: A.startDelayInMs,
        maxRetryDelayInMs: qe6
      })
    }
  }], {
    maxRetries: A.maxRetries
  })
}
// @from(Start 8258392, End 8258403)
qe6 = 64000
// @from(Start 8258409, End 8258442)
EtB = L(() => {
  _f();
  tp()
})
// @from(Start 8258445, End 8258778)
function Me6(A) {
  var Q;
  if (!ZqA(A)) throw Error(`${tf}: Multiple scopes are not supported.`);
  let G = new URL(Le6, (Q = process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) !== null && Q !== void 0 ? Q : Ne6),
    Z = {
      Accept: "application/json"
    };
  return {
    url: `${G}`,
    method: "GET",
    headers: Me(Z)
  }
}
// @from(Start 8258783, End 8258822)
tf = "ManagedIdentityCredential - IMDS"
// @from(Start 8258826, End 8258829)
TAA
// @from(Start 8258831, End 8258861)
Ne6 = "http://169.254.169.254"
// @from(Start 8258865, End 8258904)
Le6 = "/metadata/identity/oauth2/token"
// @from(Start 8258908, End 8258911)
$r1
// @from(Start 8258917, End 8260376)
ztB = L(() => {
  _f();
  tp();
  jW();
  Yq();
  TAA = W7(tf);
  $r1 = {
    name: "imdsMsi",
    async isAvailable(A) {
      let {
        scopes: Q,
        identityClient: B,
        getTokenOptions: G
      } = A, Z = ZqA(Q);
      if (!Z) return TAA.info(`${tf}: Unavailable. Multiple scopes are not supported.`), !1;
      if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) return !0;
      if (!B) throw Error("Missing IdentityClient");
      let I = Me6(Z);
      return YY.withSpan("ManagedIdentityCredential-pingImdsEndpoint", G !== null && G !== void 0 ? G : {}, async (Y) => {
        var J, W;
        I.tracingOptions = Y.tracingOptions;
        let X = hT(I);
        X.timeout = ((J = Y.requestOptions) === null || J === void 0 ? void 0 : J.timeout) || 1000, X.allowInsecureConnection = !0;
        let V;
        try {
          TAA.info(`${tf}: Pinging the Azure IMDS endpoint`), V = await B.sendRequest(X)
        } catch (F) {
          if (WA1(F)) TAA.verbose(`${tf}: Caught error ${F.name}: ${F.message}`);
          return TAA.info(`${tf}: The Azure IMDS endpoint is unavailable`), !1
        }
        if (V.status === 403) {
          if ((W = V.bodyAsText) === null || W === void 0 ? void 0 : W.includes("unreachable")) return TAA.info(`${tf}: The Azure IMDS endpoint is unavailable`), TAA.info(`${tf}: ${V.bodyAsText}`), !1
        }
        return TAA.info(`${tf}: The Azure IMDS endpoint is available`), !0
      })
    }
  }
})
// @from(Start 8260379, End 8260718)
function d11(A) {
  var Q, B;
  let G = A;
  if (G === void 0 && ((B = (Q = globalThis.process) === null || Q === void 0 ? void 0 : Q.env) === null || B === void 0 ? void 0 : B.AZURE_REGIONAL_AUTHORITY_NAME) !== void 0) G = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
  if (G === wr1.AutoDiscoverRegion) return "AUTO_DISCOVER";
  return G
}
// @from(Start 8260723, End 8260726)
wr1
// @from(Start 8260732, End 8262533)
UtB = L(() => {
  (function(A) {
    A.AutoDiscoverRegion = "AutoDiscoverRegion", A.USWest = "westus", A.USWest2 = "westus2", A.USCentral = "centralus", A.USEast = "eastus", A.USEast2 = "eastus2", A.USNorthCentral = "northcentralus", A.USSouthCentral = "southcentralus", A.USWestCentral = "westcentralus", A.CanadaCentral = "canadacentral", A.CanadaEast = "canadaeast", A.BrazilSouth = "brazilsouth", A.EuropeNorth = "northeurope", A.EuropeWest = "westeurope", A.UKSouth = "uksouth", A.UKWest = "ukwest", A.FranceCentral = "francecentral", A.FranceSouth = "francesouth", A.SwitzerlandNorth = "switzerlandnorth", A.SwitzerlandWest = "switzerlandwest", A.GermanyNorth = "germanynorth", A.GermanyWestCentral = "germanywestcentral", A.NorwayWest = "norwaywest", A.NorwayEast = "norwayeast", A.AsiaEast = "eastasia", A.AsiaSouthEast = "southeastasia", A.JapanEast = "japaneast", A.JapanWest = "japanwest", A.AustraliaEast = "australiaeast", A.AustraliaSouthEast = "australiasoutheast", A.AustraliaCentral = "australiacentral", A.AustraliaCentral2 = "australiacentral2", A.IndiaCentral = "centralindia", A.IndiaSouth = "southindia", A.IndiaWest = "westindia", A.KoreaSouth = "koreasouth", A.KoreaCentral = "koreacentral", A.UAECentral = "uaecentral", A.UAENorth = "uaenorth", A.SouthAfricaNorth = "southafricanorth", A.SouthAfricaWest = "southafricawest", A.ChinaNorth = "chinanorth", A.ChinaEast = "chinaeast", A.ChinaNorth2 = "chinanorth2", A.ChinaEast2 = "chinaeast2", A.GermanyCentral = "germanycentral", A.GermanyNorthEast = "germanynortheast", A.GovernmentUSVirginia = "usgovvirginia", A.GovernmentUSIowa = "usgoviowa", A.GovernmentUSArizona = "usgovarizona", A.GovernmentUSTexas = "usgovtexas", A.GovernmentUSDodEast = "usdodeast", A.GovernmentUSDodCentral = "usdodcentral"
  })(wr1 || (wr1 = {}))
})
// @from(Start 8262563, End 8262662)
function Oe6() {
  try {
    return $tB.statSync("/.dockerenv"), !0
  } catch {
    return !1
  }
}
// @from(Start 8262664, End 8262796)
function Re6() {
  try {
    return $tB.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
  } catch {
    return !1
  }
}
// @from(Start 8262798, End 8262873)
function Nr1() {
  if (qr1 === void 0) qr1 = Oe6() || Re6();
  return qr1
}
// @from(Start 8262878, End 8262881)
qr1
// @from(Start 8262887, End 8262901)
wtB = () => {}
// @from(Start 8262931, End 8263006)
function iZA() {
  if (Lr1 === void 0) Lr1 = Pe6() || Nr1();
  return Lr1
}
// @from(Start 8263011, End 8263014)
Lr1
// @from(Start 8263016, End 8263119)
Pe6 = () => {
  try {
    return Te6.statSync("/run/.containerenv"), !0
  } catch {
    return !1
  }
}
// @from(Start 8263125, End 8263151)
Mr1 = L(() => {
  wtB()
})
// @from(Start 8263243, End 8263567)
qtB = () => {
    if (NtB.platform !== "linux") return !1;
    if (je6.release().toLowerCase().includes("microsoft")) {
      if (iZA()) return !1;
      return !0
    }
    try {
      return Se6.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !iZA() : !1
    } catch {
      return !1
    }
  }
// @from(Start 8263571, End 8263573)
Nl
// @from(Start 8263579, End 8263651)
Or1 = L(() => {
  Mr1();
  Nl = NtB.env.__IS_WSL_TEST__ ? qtB : qtB()
})
// @from(Start 8263749, End 8263752)
ke6
// @from(Start 8263754, End 8263857)
ye6 = async () => {
  return `${await ke6()}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
}
// @from(Start 8263859, End 8264028)
Rr1 = async () => {
  if (Nl) return ye6();
  return `${LtB.env.SYSTEMROOT||LtB.env.windir||String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}
// @from(Start 8264034, End 8264566)
OtB = L(() => {
  Or1();
  Or1();
  ke6 = (() => {
    let Q;
    return async function() {
      if (Q) return Q;
      let B = "/etc/wsl.conf",
        G = !1;
      try {
        await MtB.access(B, _e6.F_OK), G = !0
      } catch {}
      if (!G) return "/mnt/";
      let Z = await MtB.readFile(B, {
          encoding: "utf8"
        }),
        I = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(Z);
      if (!I) return "/mnt/";
      return Q = I.groups.mountPoint.trim(), Q = Q.endsWith("/") ? Q : `${Q}/`, Q
    }
  })()
})
// @from(Start 8264569, End 8264875)
function Ll(A, Q, B) {
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
// @from(Start 8265012, End 8265364)
async function Tr1() {
  if (ve6.platform !== "darwin") throw Error("macOS only");
  let {
    stdout: A
  } = await fe6("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
  return /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(A)?.groups.id ?? "com.apple.Safari"
}
// @from(Start 8265369, End 8265372)
fe6
// @from(Start 8265378, End 8265413)
RtB = L(() => {
  fe6 = xe6(be6)
})
// @from(Start 8265574, End 8265862)
async function TtB(A, {
  humanReadableOutput: Q = !0,
  signal: B
} = {}) {
  if (he6.platform !== "darwin") throw Error("macOS only");
  let G = Q ? [] : ["-ss"],
    Z = {};
  if (B) Z.signal = B;
  let {
    stdout: I
  } = await me6("osascript", ["-e", A, G], Z);
  return I.trim()
}
// @from(Start 8265867, End 8265870)
me6
// @from(Start 8265876, End 8265911)
PtB = L(() => {
  me6 = ge6(ue6)
})
// @from(Start 8265913, End 8266177)
async function Pr1(A) {
  return TtB(`tell application "Finder" to set app_path to application file id "${A}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)
}
// @from(Start 8266182, End 8266208)
jtB = L(() => {
  PtB()
})
// @from(Start 8266314, End 8266766)
async function Sr1(A = pe6) {
  let {
    stdout: Q
  } = await A("reg", ["QUERY", " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice", "/v", "ProgId"]), B = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(Q);
  if (!B) throw new jr1(`Cannot find Windows browser in stdout: ${JSON.stringify(Q)}`);
  let {
    id: G
  } = B.groups, Z = le6[G];
  if (!Z) throw new jr1(`Unknown browser ID: ${G}`);
  return Z
}
// @from(Start 8266771, End 8266774)
pe6
// @from(Start 8266776, End 8266779)
le6
// @from(Start 8266781, End 8266784)
jr1
// @from(Start 8266790, End 8267627)
StB = L(() => {
  pe6 = de6(ce6), le6 = {
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
  jr1 = class jr1 extends Error {}
})
// @from(Start 8267765, End 8268268)
async function kr1() {
  if (_r1.platform === "darwin") {
    let A = await Tr1();
    return {
      name: await Pr1(A),
      id: A
    }
  }
  if (_r1.platform === "linux") {
    let {
      stdout: A
    } = await ae6("xdg-mime", ["query", "default", "x-scheme-handler/http"]), Q = A.trim();
    return {
      name: se6(Q.replace(/.desktop$/, "").replace("-", " ")),
      id: Q
    }
  }
  if (_r1.platform === "win32") return Sr1();
  throw Error("Only macOS, Linux, and Windows are supported")
}
// @from(Start 8268273, End 8268276)
ae6
// @from(Start 8268278, End 8268358)
se6 = (A) => A.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (Q) => Q.toUpperCase())
// @from(Start 8268364, End 8268426)
_tB = L(() => {
  RtB();
  jtB();
  StB();
  ae6 = ie6(ne6)
})
// @from(Start 8268432, End 8268440)
gtB = {}
// @from(Start 8268822, End 8269453)
async function QA5() {
  let A = await Rr1(),
    Q = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`,
    B = btB.from(Q, "utf16le").toString("base64"),
    {
      stdout: G
    } = await AA5(A, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", B], {
      encoding: "utf8"
    }),
    Z = G.trim(),
    I = {
      ChromeHTML: "com.google.chrome",
      BraveHTML: "com.brave.Browser",
      MSEdgeHTM: "com.microsoft.edge",
      FirefoxURL: "org.mozilla.firefox"
    };
  return I[Z] ? {
    id: I[Z]
  } : {}
}
// @from(Start 8269455, End 8269624)
function vtB(A) {
  if (typeof A === "string" || Array.isArray(A)) return A;
  let {
    [ytB]: Q
  } = A;
  if (!Q) throw Error(`${ytB} is not supported`);
  return Q
}
// @from(Start 8269626, End 8269768)
function c11({
  [nZA]: A
}, {
  wsl: Q
}) {
  if (Q && Nl) return vtB(Q);
  if (!A) throw Error(`${nZA} is not supported`);
  return vtB(A)
}
// @from(Start 8269773, End 8269776)
AA5
// @from(Start 8269778, End 8269781)
xr1
// @from(Start 8269783, End 8269786)
ktB
// @from(Start 8269788, End 8269791)
nZA
// @from(Start 8269793, End 8269796)
ytB
// @from(Start 8269798, End 8269919)
xtB = async (A, Q) => {
  let B;
  for (let G of A) try {
    return await Q(G)
  } catch (Z) {
    B = Z
  }
  throw B
}
// @from(Start 8269921, End 8272744)
kNA = async (A) => {
  if (A = {
      wait: !1,
      background: !1,
      newInstance: !1,
      allowNonzeroExitCode: !1,
      ...A
    }, Array.isArray(A.app)) return xtB(A.app, (J) => kNA({
    ...A,
    app: J
  }));
  let {
    name: Q,
    arguments: B = []
  } = A.app ?? {};
  if (B = [...B], Array.isArray(Q)) return xtB(Q, (J) => kNA({
    ...A,
    app: {
      name: J,
      arguments: B
    }
  }));
  if (Q === "browser" || Q === "browserPrivate") {
    let J = {
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
      W = {
        chrome: "--incognito",
        brave: "--incognito",
        firefox: "--private-window",
        edge: "--inPrivate"
      },
      X = Nl ? await QA5() : await kr1();
    if (X.id in J) {
      let V = J[X.id];
      if (Q === "browserPrivate") B.push(W[V]);
      return kNA({
        ...A,
        app: {
          name: Ml[V],
          arguments: B
        }
      })
    }
    throw Error(`${X.name} is not supported as a default browser`)
  }
  let G, Z = [],
    I = {};
  if (nZA === "darwin") {
    if (G = "open", A.wait) Z.push("--wait-apps");
    if (A.background) Z.push("--background");
    if (A.newInstance) Z.push("--new");
    if (Q) Z.push("-a", Q)
  } else if (nZA === "win32" || Nl && !iZA() && !Q) {
    if (G = await Rr1(), Z.push("-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand"), !Nl) I.windowsVerbatimArguments = !0;
    let J = ["Start"];
    if (A.wait) J.push("-Wait");
    if (Q) {
      if (J.push(`"\`"${Q}\`""`), A.target) B.push(A.target)
    } else if (A.target) J.push(`"${A.target}"`);
    if (B.length > 0) B = B.map((W) => `"\`"${W}\`""`), J.push("-ArgumentList", B.join(","));
    A.target = btB.from(J.join(" "), "utf16le").toString("base64")
  } else {
    if (Q) G = Q;
    else {
      let J = !xr1 || xr1 === "/",
        W = !1;
      try {
        await te6.access(ktB, ee6.X_OK), W = !0
      } catch {}
      G = yr1.versions.electron ?? (nZA === "android" || J || !W) ? "xdg-open" : ktB
    }
    if (B.length > 0) Z.push(...B);
    if (!A.wait) I.stdio = "ignore", I.detached = !0
  }
  if (nZA === "darwin" && B.length > 0) Z.push("--args", ...B);
  if (A.target) Z.push(A.target);
  let Y = htB.spawn(G, Z, I);
  if (A.wait) return new Promise((J, W) => {
    Y.once("error", W), Y.once("close", (X) => {
      if (!A.allowNonzeroExitCode && X > 0) {
        W(Error(`Exited with code ${X}`));
        return
      }
      J(Y)
    })
  });
  return Y.unref(), Y
}
// @from(Start 8272746, End 8272878)
BA5 = (A, Q) => {
  if (typeof A !== "string") throw TypeError("Expected a `target`");
  return kNA({
    ...Q,
    target: A
  })
}
// @from(Start 8272880, End 8273232)
GA5 = (A, Q) => {
  if (typeof A !== "string" && !Array.isArray(A)) throw TypeError("Expected a valid `name`");
  let {
    arguments: B = []
  } = Q ?? {};
  if (B !== void 0 && B !== null && !Array.isArray(B)) throw TypeError("Expected `appArguments` as Array type");
  return kNA({
    ...Q,
    app: {
      name: A,
      arguments: B
    }
  })
}
// @from(Start 8273234, End 8273236)
Ml
// @from(Start 8273238, End 8273241)
ZA5
// @from(Start 8273247, End 8274795)
utB = L(() => {
  OtB();
  _tB();
  Mr1();
  AA5 = oe6(htB.execFile), xr1 = ftB.dirname(re6(import.meta.url)), ktB = ftB.join(xr1, "xdg-open"), {
    platform: nZA,
    arch: ytB
  } = yr1;
  Ml = {};
  Ll(Ml, "chrome", () => c11({
    darwin: "google chrome",
    win32: "chrome",
    linux: ["google-chrome", "google-chrome-stable", "chromium"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
      x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
    }
  }));
  Ll(Ml, "brave", () => c11({
    darwin: "brave browser",
    win32: "brave",
    linux: ["brave-browser", "brave"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
      x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
    }
  }));
  Ll(Ml, "firefox", () => c11({
    darwin: "firefox",
    win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
    linux: "firefox"
  }, {
    wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
  }));
  Ll(Ml, "edge", () => c11({
    darwin: "microsoft edge",
    win32: "msedge",
    linux: ["microsoft-edge", "microsoft-edge-dev"]
  }, {
    wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  }));
  Ll(Ml, "browser", () => "browser");
  Ll(Ml, "browserPrivate", () => "browserPrivate");
  ZA5 = BA5
})
// @from(Start 8274798, End 8275521)
function IA5(A, Q, B = {}) {
  var G, Z, I;
  let Y = ZlB((G = B.logger) !== null && G !== void 0 ? G : SU, Q, A),
    J = zr1(Y, Er1(B)),
    W = new UZA(Object.assign(Object.assign({}, B.tokenCredentialOptions), {
      authorityHost: J,
      loggingOptions: B.loggingOptions
    }));
  return {
    auth: {
      clientId: A,
      authority: J,
      knownAuthorities: KtB(Y, J, B.disableInstanceDiscovery)
    },
    system: {
      networkClient: W,
      loggerOptions: {
        loggerCallback: u11((Z = B.logger) !== null && Z !== void 0 ? Z : SU),
        logLevel: m11(deA()),
        piiLoggingEnabled: (I = B.loggingOptions) === null || I === void 0 ? void 0 : I.enableUnsafeSupportLogging
      }
    }
  }
}
// @from(Start 8275523, End 8287411)
function Ol(A, Q, B = {}) {
  var G;
  let Z = {
      msalConfig: IA5(A, Q, B),
      cachedAccount: B.authenticationRecord ? DtB(B.authenticationRecord) : null,
      pluginConfiguration: upB.generatePluginConfiguration(B),
      logger: (G = B.logger) !== null && G !== void 0 ? G : SU
    },
    I = new Map;
  async function Y(R = {}) {
    let T = R.enableCae ? "CAE" : "default",
      y = I.get(T);
    if (y) return Z.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), y;
    Z.logger.getToken.info(`Creating new PublicClientApplication with CAE ${R.enableCae?"enabled":"disabled"}.`);
    let v = R.enableCae ? Z.pluginConfiguration.cache.cachePluginCae : Z.pluginConfiguration.cache.cachePlugin;
    return Z.msalConfig.auth.clientCapabilities = R.enableCae ? ["cp1"] : void 0, y = new TNA(Object.assign(Object.assign({}, Z.msalConfig), {
      broker: {
        nativeBrokerPlugin: Z.pluginConfiguration.broker.nativeBrokerPlugin
      },
      cache: {
        cachePlugin: await v
      }
    })), I.set(T, y), y
  }
  let J = new Map;
  async function W(R = {}) {
    let T = R.enableCae ? "CAE" : "default",
      y = J.get(T);
    if (y) return Z.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), y;
    Z.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${R.enableCae?"enabled":"disabled"}.`);
    let v = R.enableCae ? Z.pluginConfiguration.cache.cachePluginCae : Z.pluginConfiguration.cache.cachePlugin;
    return Z.msalConfig.auth.clientCapabilities = R.enableCae ? ["cp1"] : void 0, y = new jNA(Object.assign(Object.assign({}, Z.msalConfig), {
      broker: {
        nativeBrokerPlugin: Z.pluginConfiguration.broker.nativeBrokerPlugin
      },
      cache: {
        cachePlugin: await v
      }
    })), J.set(T, y), y
  }
  async function X(R, T, y = {}) {
    if (Z.cachedAccount === null) throw Z.logger.getToken.info("No cached account found in local state."), new Pf({
      scopes: T
    });
    if (y.claims) Z.cachedClaims = y.claims;
    let v = {
      account: Z.cachedAccount,
      scopes: T,
      claims: Z.cachedClaims
    };
    if (Z.pluginConfiguration.broker.isEnabled) {
      if (v.tokenQueryParameters || (v.tokenQueryParameters = {}), Z.pluginConfiguration.broker.enableMsaPassthrough) v.tokenQueryParameters.msal_request_type = "consumer_passthrough"
    }
    if (y.proofOfPossessionOptions) v.shrNonce = y.proofOfPossessionOptions.nonce, v.authenticationScheme = "pop", v.resourceRequestMethod = y.proofOfPossessionOptions.resourceRequestMethod, v.resourceRequestUri = y.proofOfPossessionOptions.resourceRequestUrl;
    Z.logger.getToken.info("Attempting to acquire token silently");
    try {
      return await R.acquireTokenSilent(v)
    } catch (x) {
      throw RAA(T, x, y)
    }
  }

  function V(R) {
    if (R === null || R === void 0 ? void 0 : R.tenantId) return zr1(R.tenantId, Er1(B));
    return Z.msalConfig.auth.authority
  }
  async function F(R, T, y, v) {
    var x, p;
    let u = null;
    try {
      u = await X(R, T, y)
    } catch (e) {
      if (e.name !== "AuthenticationRequiredError") throw e;
      if (y.disableAutomaticAuthentication) throw new Pf({
        scopes: T,
        getTokenOptions: y,
        message: "Automatic authentication has been disabled. You may call the authentication() method."
      })
    }
    if (u === null) try {
      u = await v()
    } catch (e) {
      throw RAA(T, e, y)
    }
    return lZA(T, u, y), Z.cachedAccount = (x = u === null || u === void 0 ? void 0 : u.account) !== null && x !== void 0 ? x : null, Z.logger.getToken.info(mF(T)), {
      token: u.accessToken,
      expiresOnTimestamp: u.expiresOn.getTime(),
      refreshAfterTimestamp: (p = u.refreshOn) === null || p === void 0 ? void 0 : p.getTime(),
      tokenType: u.tokenType
    }
  }
  async function K(R, T, y = {}) {
    var v;
    Z.logger.getToken.info("Attempting to acquire token using client secret"), Z.msalConfig.auth.clientSecret = T;
    let x = await W(y);
    try {
      let p = await x.acquireTokenByClientCredential({
        scopes: R,
        authority: V(y),
        azureRegion: d11(),
        claims: y === null || y === void 0 ? void 0 : y.claims
      });
      return lZA(R, p, y), Z.logger.getToken.info(mF(R)), {
        token: p.accessToken,
        expiresOnTimestamp: p.expiresOn.getTime(),
        refreshAfterTimestamp: (v = p.refreshOn) === null || v === void 0 ? void 0 : v.getTime(),
        tokenType: p.tokenType
      }
    } catch (p) {
      throw RAA(R, p, y)
    }
  }
  async function D(R, T, y = {}) {
    var v;
    Z.logger.getToken.info("Attempting to acquire token using client assertion"), Z.msalConfig.auth.clientAssertion = T;
    let x = await W(y);
    try {
      let p = await x.acquireTokenByClientCredential({
        scopes: R,
        authority: V(y),
        azureRegion: d11(),
        claims: y === null || y === void 0 ? void 0 : y.claims,
        clientAssertion: T
      });
      return lZA(R, p, y), Z.logger.getToken.info(mF(R)), {
        token: p.accessToken,
        expiresOnTimestamp: p.expiresOn.getTime(),
        refreshAfterTimestamp: (v = p.refreshOn) === null || v === void 0 ? void 0 : v.getTime(),
        tokenType: p.tokenType
      }
    } catch (p) {
      throw RAA(R, p, y)
    }
  }
  async function H(R, T, y = {}) {
    var v;
    Z.logger.getToken.info("Attempting to acquire token using client certificate"), Z.msalConfig.auth.clientCertificate = T;
    let x = await W(y);
    try {
      let p = await x.acquireTokenByClientCredential({
        scopes: R,
        authority: V(y),
        azureRegion: d11(),
        claims: y === null || y === void 0 ? void 0 : y.claims
      });
      return lZA(R, p, y), Z.logger.getToken.info(mF(R)), {
        token: p.accessToken,
        expiresOnTimestamp: p.expiresOn.getTime(),
        refreshAfterTimestamp: (v = p.refreshOn) === null || v === void 0 ? void 0 : v.getTime(),
        tokenType: p.tokenType
      }
    } catch (p) {
      throw RAA(R, p, y)
    }
  }
  async function C(R, T, y = {}) {
    Z.logger.getToken.info("Attempting to acquire token using device code");
    let v = await Y(y);
    return F(v, R, y, () => {
      var x, p;
      let u = {
          scopes: R,
          cancel: (p = (x = y === null || y === void 0 ? void 0 : y.abortSignal) === null || x === void 0 ? void 0 : x.aborted) !== null && p !== void 0 ? p : !1,
          deviceCodeCallback: T,
          authority: V(y),
          claims: y === null || y === void 0 ? void 0 : y.claims
        },
        e = v.acquireTokenByDeviceCode(u);
      if (y.abortSignal) y.abortSignal.addEventListener("abort", () => {
        u.cancel = !0
      });
      return e
    })
  }
  async function E(R, T, y, v = {}) {
    Z.logger.getToken.info("Attempting to acquire token using username and password");
    let x = await Y(v);
    return F(x, R, v, () => {
      let p = {
        scopes: R,
        username: T,
        password: y,
        authority: V(v),
        claims: v === null || v === void 0 ? void 0 : v.claims
      };
      return x.acquireTokenByUsernamePassword(p)
    })
  }

  function U() {
    if (!Z.cachedAccount) return;
    return HtB(A, Z.cachedAccount)
  }
  async function q(R, T, y, v, x = {}) {
    Z.logger.getToken.info("Attempting to acquire token using authorization code");
    let p;
    if (v) Z.msalConfig.auth.clientSecret = v, p = await W(x);
    else p = await Y(x);
    return F(p, R, x, () => {
      return p.acquireTokenByCode({
        scopes: R,
        redirectUri: T,
        code: y,
        authority: V(x),
        claims: x === null || x === void 0 ? void 0 : x.claims
      })
    })
  }
  async function w(R, T, y, v = {}) {
    var x;
    if (SU.getToken.info("Attempting to acquire token on behalf of another user"), typeof y === "string") SU.getToken.info("Using client secret for on behalf of flow"), Z.msalConfig.auth.clientSecret = y;
    else if (typeof y === "function") SU.getToken.info("Using client assertion callback for on behalf of flow"), Z.msalConfig.auth.clientAssertion = y;
    else SU.getToken.info("Using client certificate for on behalf of flow"), Z.msalConfig.auth.clientCertificate = y;
    let p = await W(v);
    try {
      let u = await p.acquireTokenOnBehalfOf({
        scopes: R,
        authority: V(v),
        claims: v.claims,
        oboAssertion: T
      });
      return lZA(R, u, v), SU.getToken.info(mF(R)), {
        token: u.accessToken,
        expiresOnTimestamp: u.expiresOn.getTime(),
        refreshAfterTimestamp: (x = u.refreshOn) === null || x === void 0 ? void 0 : x.getTime(),
        tokenType: u.tokenType
      }
    } catch (u) {
      throw RAA(R, u, v)
    }
  }
  async function N(R, T = {}) {
    SU.getToken.info("Attempting to acquire token interactively");
    let y = await Y(T);
    async function v(p) {
      var u;
      SU.verbose("Authentication will resume through the broker");
      let e = x();
      if (Z.pluginConfiguration.broker.parentWindowHandle) e.windowHandle = Buffer.from(Z.pluginConfiguration.broker.parentWindowHandle);
      else SU.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
      if (Z.pluginConfiguration.broker.enableMsaPassthrough)((u = e.tokenQueryParameters) !== null && u !== void 0 ? u : e.tokenQueryParameters = {}).msal_request_type = "consumer_passthrough";
      if (p) e.prompt = "none", SU.verbose("Attempting broker authentication using the default broker account");
      else SU.verbose("Attempting broker authentication without the default broker account");
      if (T.proofOfPossessionOptions) e.shrNonce = T.proofOfPossessionOptions.nonce, e.authenticationScheme = "pop", e.resourceRequestMethod = T.proofOfPossessionOptions.resourceRequestMethod, e.resourceRequestUri = T.proofOfPossessionOptions.resourceRequestUrl;
      try {
        return await y.acquireTokenInteractive(e)
      } catch (l) {
        if (SU.verbose(`Failed to authenticate through the broker: ${l.message}`), p) return v(!1);
        else throw l
      }
    }

    function x() {
      var p, u;
      return {
        openBrowser: async (e) => {
          await (await Promise.resolve().then(() => (utB(), gtB))).default(e, {
            wait: !0,
            newInstance: !0
          })
        },
        scopes: R,
        authority: V(T),
        claims: T === null || T === void 0 ? void 0 : T.claims,
        loginHint: T === null || T === void 0 ? void 0 : T.loginHint,
        errorTemplate: (p = T === null || T === void 0 ? void 0 : T.browserCustomizationOptions) === null || p === void 0 ? void 0 : p.errorMessage,
        successTemplate: (u = T === null || T === void 0 ? void 0 : T.browserCustomizationOptions) === null || u === void 0 ? void 0 : u.successMessage,
        prompt: (T === null || T === void 0 ? void 0 : T.loginHint) ? "login" : "select_account"
      }
    }
    return F(y, R, T, async () => {
      var p;
      let u = x();
      if (Z.pluginConfiguration.broker.isEnabled) return v((p = Z.pluginConfiguration.broker.useDefaultBrokerAccount) !== null && p !== void 0 ? p : !1);
      if (T.proofOfPossessionOptions) u.shrNonce = T.proofOfPossessionOptions.nonce, u.authenticationScheme = "pop", u.resourceRequestMethod = T.proofOfPossessionOptions.resourceRequestMethod, u.resourceRequestUri = T.proofOfPossessionOptions.resourceRequestUrl;
      return y.acquireTokenInteractive(u)
    })
  }
  return {
    getActiveAccount: U,
    getTokenByClientSecret: K,
    getTokenByClientAssertion: D,
    getTokenByClientCertificate: H,
    getTokenByDeviceCode: C,
    getTokenByUsernamePassword: E,
    getTokenByAuthorizationCode: q,
    getTokenOnBehalfOf: w,
    getTokenByInteractiveRequest: N
  }
}
// @from(Start 8287416, End 8287418)
SU
// @from(Start 8287424, End 8287543)
yNA = L(() => {
  g11();
  jW();
  mpB();
  Ur1();
  DE();
  tn1();
  UtB();
  qe();
  vT();
  SU = W7("MsalClient")
})
// @from(Start 8287545, End 8288501)
class vr1 {
  constructor(A, Q, B, G = {}) {
    if (!A) throw new p9("ClientAssertionCredential: tenantId is a required parameter.");
    if (!Q) throw new p9("ClientAssertionCredential: clientId is a required parameter.");
    if (!B) throw new p9("ClientAssertionCredential: clientAssertion is a required parameter.");
    this.tenantId = A, this.additionallyAllowedTenantIds = NU(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.options = G, this.getAssertion = B, this.msalClient = Ol(Q, A, Object.assign(Object.assign({}, G), {
      logger: mtB,
      tokenCredentialOptions: this.options
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, mtB);
      let G = Array.isArray(A) ? A : [A];
      return this.msalClient.getTokenByClientAssertion(G, this.getAssertion, B)
    })
  }
}
// @from(Start 8288506, End 8288509)
mtB
// @from(Start 8288515, End 8288614)
dtB = L(() => {
  yNA();
  vT();
  DE();
  jW();
  Yq();
  mtB = W7("ClientAssertionCredential")
})
// @from(Start 8288670, End 8291733)
class jAA {
  constructor(A) {
    this.azureFederatedTokenFileContent = void 0, this.cacheDate = void 0;
    let Q = ceA(JA5).assigned.join(", ");
    xNA.info(`Found the following environment variables: ${Q}`);
    let B = A !== null && A !== void 0 ? A : {},
      G = B.tenantId || process.env.AZURE_TENANT_ID,
      Z = B.clientId || process.env.AZURE_CLIENT_ID;
    if (this.federatedTokenFilePath = B.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, G) qU(xNA, G);
    if (!Z) throw new p9(`${PAA}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!G) throw new p9(`${PAA}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!this.federatedTokenFilePath) throw new p9(`${PAA}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    xNA.info(`Invoking ClientAssertionCredential with tenant ID: ${G}, clientId: ${B.clientId} and federated token path: [REDACTED]`), this.client = new vr1(G, Z, this.readFileContents.bind(this), A)
  }
  async getToken(A, Q) {
    if (!this.client) {
      let B = `${PAA}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
      throw xNA.info(B), new p9(B)
    }
    return xNA.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(A, Q)
  }
  async readFileContents() {
    if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000) this.azureFederatedTokenFileContent = void 0;
    if (!this.federatedTokenFilePath) throw new p9(`${PAA}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
    if (!this.azureFederatedTokenFileContent) {
      let Q = (await YA5(this.federatedTokenFilePath, "utf8")).trim();
      if (!Q) throw new p9(`${PAA}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
      else this.azureFederatedTokenFileContent = Q, this.cacheDate = Date.now()
    }
    return this.azureFederatedTokenFileContent
  }
}
// @from(Start 8291738, End 8291772)
PAA = "WorkloadIdentityCredential"
// @from(Start 8291776, End 8291779)
JA5
// @from(Start 8291781, End 8291784)
xNA
// @from(Start 8291790, End 8291933)
br1 = L(() => {
  jW();
  dtB();
  DE();
  vT();
  JA5 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_FEDERATED_TOKEN_FILE"], xNA = W7(PAA)
})
// @from(Start 8291939, End 8291989)
ctB = "ManagedIdentityCredential - Token Exchange"
// @from(Start 8291993, End 8291996)
WA5
// @from(Start 8291998, End 8292001)
fr1
// @from(Start 8292007, End 8292852)
ptB = L(() => {
  br1();
  jW();
  WA5 = W7(ctB), fr1 = {
    name: "tokenExchangeMsi",
    async isAvailable(A) {
      let Q = process.env,
        B = Boolean((A || Q.AZURE_CLIENT_ID) && Q.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
      if (!B) WA5.info(`${ctB}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
      return B
    },
    async getToken(A, Q = {}) {
      let {
        scopes: B,
        clientId: G
      } = A, Z = {};
      return new jAA(Object.assign(Object.assign({
        clientId: G,
        tenantId: process.env.AZURE_TENANT_ID,
        tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE
      }, Z), {
        disableInstanceDiscovery: !0
      })).getToken(B, Q)
    }
  }
})
// @from(Start 8292854, End 8298735)
class aZA {
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
    let I = [{
      key: "clientId",
      value: this.clientId
    }, {
      key: "resourceId",
      value: this.resourceId
    }, {
      key: "objectId",
      value: this.objectId
    }].filter((J) => J.value);
    if (I.length > 1) throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}`);
    if (Z.allowInsecureConnection = !0, ((B = Z.retryOptions) === null || B === void 0 ? void 0 : B.maxRetries) !== void 0) this.msiRetryConfig.maxRetries = Z.retryOptions.maxRetries;
    this.identityClient = new UZA(Object.assign(Object.assign({}, Z), {
      additionalPolicies: [{
        policy: CtB(this.msiRetryConfig),
        position: "perCall"
      }]
    })), this.managedIdentityApp = new Ck({
      managedIdentityIdParams: {
        userAssignedClientId: this.clientId,
        userAssignedResourceId: this.resourceId,
        userAssignedObjectId: this.objectId
      },
      system: {
        disableInternalRetries: !0,
        networkClient: this.identityClient,
        loggerOptions: {
          logLevel: m11(deA()),
          piiLoggingEnabled: (G = Z.loggingOptions) === null || G === void 0 ? void 0 : G.enableUnsafeSupportLogging,
          loggerCallback: u11(Fq)
        }
      }
    }), this.isAvailableIdentityClient = new UZA(Object.assign(Object.assign({}, Z), {
      retryOptions: {
        maxRetries: 0
      }
    }));
    let Y = this.managedIdentityApp.getManagedIdentitySource();
    if (Y === "CloudShell") {
      if (this.clientId || this.resourceId || this.objectId) throw Fq.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new p9("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.")
    }
    if (Y === "ServiceFabric") {
      if (this.clientId || this.resourceId || this.objectId) throw Fq.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new p9(`ManagedIdentityCredential: ${WaB}`)
    }
    if (Fq.info(`Using ${Y} managed identity.`), I.length === 1) {
      let {
        key: J,
        value: W
      } = I[0];
      Fq.info(`${Y} with ${J}: ${W}`)
    }
  }
  async getToken(A, Q = {}) {
    Fq.getToken.info("Using the MSAL provider for Managed Identity.");
    let B = ZqA(A);
    if (!B) throw new p9(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(A)}`);
    return YY.withSpan("ManagedIdentityCredential.getToken", Q, async () => {
      var G;
      try {
        let Z = await fr1.isAvailable(this.clientId),
          I = this.managedIdentityApp.getManagedIdentitySource(),
          Y = I === "DefaultToImds" || I === "Imds";
        if (Fq.getToken.info(`MSAL Identity source: ${I}`), Z) {
          Fq.getToken.info("Using the token exchange managed identity.");
          let W = await fr1.getToken({
            scopes: A,
            clientId: this.clientId,
            identityClient: this.identityClient,
            retryConfig: this.msiRetryConfig,
            resourceId: this.resourceId
          });
          if (W === null) throw new p9("Attempted to use the token exchange managed identity, but received a null response.");
          return W
        } else if (Y) {
          if (Fq.getToken.info("Using the IMDS endpoint to probe for availability."), !await $r1.isAvailable({
              scopes: A,
              clientId: this.clientId,
              getTokenOptions: Q,
              identityClient: this.isAvailableIdentityClient,
              resourceId: this.resourceId
            })) throw new p9("Attempted to use the IMDS endpoint, but it is not available.")
        }
        Fq.getToken.info("Calling into MSAL for managed identity token.");
        let J = await this.managedIdentityApp.acquireToken({
          resource: B
        });
        return this.ensureValidMsalToken(A, J, Q), Fq.getToken.info(mF(A)), {
          expiresOnTimestamp: J.expiresOn.getTime(),
          token: J.accessToken,
          refreshAfterTimestamp: (G = J.refreshOn) === null || G === void 0 ? void 0 : G.getTime(),
          tokenType: "Bearer"
        }
      } catch (Z) {
        if (Fq.getToken.error(d7(A, Z)), Z.name === "AuthenticationRequiredError") throw Z;
        if (XA5(Z)) throw new p9(`ManagedIdentityCredential: Network unreachable. Message: ${Z.message}`, {
          cause: Z
        });
        throw new p9(`ManagedIdentityCredential: Authentication failed. Message ${Z.message}`, {
          cause: Z
        })
      }
    })
  }
  ensureValidMsalToken(A, Q, B) {
    let G = (Z) => {
      return Fq.getToken.info(Z), new Pf({
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
// @from(Start 8298737, End 8298995)
function XA5(A) {
  if (A.errorCode === "network_error") return !0;
  if (A.code === "ENETUNREACH" || A.code === "EHOSTUNREACH") return !0;
  if (A.statusCode === 403 || A.code === 403) {
    if (A.message.includes("unreachable")) return !0
  }
  return !1
}
// @from(Start 8299000, End 8299002)
Fq
// @from(Start 8299008, End 8299151)
ltB = L(() => {
  qe();
  g11();
  tn1();
  DE();
  Ur1();
  EtB();
  jW();
  Yq();
  ztB();
  ptB();
  Fq = W7("ManagedIdentityCredential")
})
// @from(Start 8299154, End 8299209)
function p11(A) {
  return Array.isArray(A) ? A : [A]
}
// @from(Start 8299211, End 8299397)
function sZA(A, Q) {
  if (!A.match(/^[0-9a-zA-Z-_.:/]+$/)) {
    let B = Error("Invalid scope was specified by the user or calling client");
    throw Q.getToken.info(d7(A, B)), B
  }
}
// @from(Start 8299399, End 8299456)
function l11(A) {
  return A.replace(/\/.default$/, "")
}
// @from(Start 8299461, End 8299486)
rZA = L(() => {
  jW()
})
// @from(Start 8299489, End 8299790)
function hr1(A, Q) {
  if (!Q.match(/^[0-9a-zA-Z-._ ]+$/)) {
    let B = Error("Invalid subscription provided. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id.");
    throw A.info(d7("", B)), B
  }
}
// @from(Start 8299795, End 8299820)
itB = L(() => {
  jW()
})
// @from(Start 8299855, End 8302859)
class gr1 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) qU(yM, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    if (A === null || A === void 0 ? void 0 : A.subscription) hr1(yM, A === null || A === void 0 ? void 0 : A.subscription), this.subscription = A === null || A === void 0 ? void 0 : A.subscription;
    this.additionallyAllowedTenantIds = NU(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getToken(A, Q = {}) {
    let B = HE(this.tenantId, Q, this.additionallyAllowedTenantIds);
    if (B) qU(yM, B);
    if (this.subscription) hr1(yM, this.subscription);
    let G = typeof A === "string" ? A : A[0];
    return yM.getToken.info(`Using the scope ${G}`), YY.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      var Z, I, Y, J;
      try {
        sZA(G, yM);
        let W = l11(G),
          X = await ntB.getAzureCliAccessToken(W, B, this.subscription, this.timeout),
          V = (Z = X.stderr) === null || Z === void 0 ? void 0 : Z.match("(.*)az login --scope(.*)"),
          F = ((I = X.stderr) === null || I === void 0 ? void 0 : I.match("(.*)az login(.*)")) && !V;
        if (((Y = X.stderr) === null || Y === void 0 ? void 0 : Y.match("az:(.*)not found")) || ((J = X.stderr) === null || J === void 0 ? void 0 : J.startsWith("'az' is not recognized"))) {
          let D = new p9("Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.");
          throw yM.getToken.info(d7(A, D)), D
        }
        if (F) {
          let D = new p9("Please run 'az login' from a command prompt to authenticate before using this credential.");
          throw yM.getToken.info(d7(A, D)), D
        }
        try {
          let D = X.stdout,
            H = this.parseRawResponse(D);
          return yM.getToken.info(mF(A)), H
        } catch (D) {
          if (X.stderr) throw new p9(X.stderr);
          throw D
        }
      } catch (W) {
        let X = W.name === "CredentialUnavailableError" ? W : new p9(W.message || "Unknown error while trying to retrieve the access token");
        throw yM.getToken.info(d7(A, X)), X
      }
    })
  }
  parseRawResponse(A) {
    let Q = JSON.parse(A),
      B = Q.accessToken,
      G = Number.parseInt(Q.expires_on, 10) * 1000;
    if (!isNaN(G)) return yM.getToken.info("expires_on is available and is valid, using it"), {
      token: B,
      expiresOnTimestamp: G,
      tokenType: "Bearer"
    };
    if (G = new Date(Q.expiresOn).getTime(), isNaN(G)) throw new p9(`Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${Q.expiresOn}"`);
    return {
      token: B,
      expiresOnTimestamp: G,
      tokenType: "Bearer"
    }
  }
}
// @from(Start 8302864, End 8302866)
yM
// @from(Start 8302868, End 8302871)
ntB
// @from(Start 8302877, End 8303962)
atB = L(() => {
  vT();
  jW();
  rZA();
  DE();
  Yq();
  itB();
  yM = W7("AzureCliCredential"), ntB = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let A = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!A) yM.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), A = "C:\\Windows";
        return A
      } else return "/bin"
    },
    async getAzureCliAccessToken(A, Q, B, G) {
      let Z = [],
        I = [];
      if (Q) Z = ["--tenant", Q];
      if (B) I = ["--subscription", `"${B}"`];
      return new Promise((Y, J) => {
        try {
          VA5.execFile("az", ["account", "get-access-token", "--output", "json", "--resource", A, ...Z, ...I], {
            cwd: ntB.getSafeWorkingDir(),
            shell: !0,
            timeout: G
          }, (W, X, V) => {
            Y({
              stdout: X,
              stderr: V,
              error: W
            })
          })
        } catch (W) {
          J(W)
        }
      })
    }
  }
})
// @from(Start 8303997, End 8306466)
class ur1 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) qU(ef, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    this.additionallyAllowedTenantIds = NU(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getToken(A, Q = {}) {
    let B = HE(this.tenantId, Q, this.additionallyAllowedTenantIds);
    if (B) qU(ef, B);
    let G;
    if (typeof A === "string") G = [A];
    else G = A;
    return ef.getToken.info(`Using the scopes ${A}`), YY.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      var Z, I, Y, J;
      try {
        G.forEach((F) => {
          sZA(F, ef)
        });
        let W = await stB.getAzdAccessToken(G, B, this.timeout),
          X = ((Z = W.stderr) === null || Z === void 0 ? void 0 : Z.match("not logged in, run `azd login` to login")) || ((I = W.stderr) === null || I === void 0 ? void 0 : I.match("not logged in, run `azd auth login` to login"));
        if (((Y = W.stderr) === null || Y === void 0 ? void 0 : Y.match("azd:(.*)not found")) || ((J = W.stderr) === null || J === void 0 ? void 0 : J.startsWith("'azd' is not recognized")) || W.error && W.error.code === "ENOENT") {
          let F = new p9("Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
          throw ef.getToken.info(d7(A, F)), F
        }
        if (X) {
          let F = new p9("Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
          throw ef.getToken.info(d7(A, F)), F
        }
        try {
          let F = JSON.parse(W.stdout);
          return ef.getToken.info(mF(A)), {
            token: F.token,
            expiresOnTimestamp: new Date(F.expiresOn).getTime(),
            tokenType: "Bearer"
          }
        } catch (F) {
          if (W.stderr) throw new p9(W.stderr);
          throw F
        }
      } catch (W) {
        let X = W.name === "CredentialUnavailableError" ? W : new p9(W.message || "Unknown error while trying to retrieve the access token");
        throw ef.getToken.info(d7(A, X)), X
      }
    })
  }
}
// @from(Start 8306471, End 8306473)
ef
// @from(Start 8306475, End 8306478)
stB
// @from(Start 8306484, End 8307503)
rtB = L(() => {
  jW();
  DE();
  vT();
  Yq();
  rZA();
  ef = W7("AzureDeveloperCliCredential"), stB = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let A = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!A) ef.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), A = "C:\\Windows";
        return A
      } else return "/bin"
    },
    async getAzdAccessToken(A, Q, B) {
      let G = [];
      if (Q) G = ["--tenant-id", Q];
      return new Promise((Z, I) => {
        try {
          FA5.execFile("azd", ["auth", "token", "--output", "json", ...A.reduce((Y, J) => Y.concat("--scope", J), []), ...G], {
            cwd: stB.getSafeWorkingDir(),
            timeout: B
          }, (Y, J, W) => {
            Z({
              stdout: J,
              stderr: W,
              error: Y
            })
          })
        } catch (Y) {
          I(Y)
        }
      })
    }
  }
})
// @from(Start 8307547, End 8307550)
ttB
// @from(Start 8307556, End 8307899)
etB = L(() => {
  ttB = {
    execFile(A, Q, B) {
      return new Promise((G, Z) => {
        otB.execFile(A, Q, B, (I, Y, J) => {
          if (Buffer.isBuffer(Y)) Y = Y.toString("utf8");
          if (Buffer.isBuffer(J)) J = J.toString("utf8");
          if (J || I) Z(J ? Error(J) : I);
          else G(Y)
        })
      })
    }
  }
})
// @from(Start 8307902, End 8307967)
function BeB(A) {
  if (QeB) return `${A}.exe`;
  else return A
}
// @from(Start 8307968, End 8308163)
async function AeB(A, Q) {
  let B = [];
  for (let G of A) {
    let [Z, ...I] = G, Y = await ttB.execFile(Z, I, {
      encoding: "utf8",
      timeout: Q
    });
    B.push(Y)
  }
  return B
}
// @from(Start 8308164, End 8310948)
class cr1 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) qU(Ah, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    this.additionallyAllowedTenantIds = NU(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getAzurePowerShellAccessToken(A, Q, B) {
    for (let G of [...dr1]) {
      try {
        await AeB([
          [G, "/?"]
        ], B)
      } catch (Y) {
        dr1.shift();
        continue
      }
      let I = (await AeB([
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
      return HA5(I)
    }
    throw Error("Unable to execute PowerShell. Ensure that it is installed in your system")
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      let B = HE(this.tenantId, Q, this.additionallyAllowedTenantIds),
        G = typeof A === "string" ? A : A[0];
      if (B) qU(Ah, B);
      try {
        sZA(G, Ah), Ah.getToken.info(`Using the scope ${G}`);
        let Z = l11(G),
          I = await this.getAzurePowerShellAccessToken(Z, B, this.timeout);
        return Ah.getToken.info(mF(A)), {
          token: I.Token,
          expiresOnTimestamp: new Date(I.ExpiresOn).getTime(),
          tokenType: "Bearer"
        }
      } catch (Z) {
        if (DA5(Z)) {
          let Y = new p9(mr1.installed);
          throw Ah.getToken.info(d7(G, Y)), Y
        } else if (KA5(Z)) {
          let Y = new p9(mr1.login);
          throw Ah.getToken.info(d7(G, Y)), Y
        }
        let I = new p9(`${Z}. ${mr1.troubleshoot}`);
        throw Ah.getToken.info(d7(G, I)), I
      }
    })
  }
}
// @from(Start 8310949, End 8311462)
async function HA5(A) {
  let Q = /{[^{}]*}/g,
    B = A.match(Q),
    G = A;
  if (B) try {
    for (let Z of B) try {
      let I = JSON.parse(Z);
      if (I === null || I === void 0 ? void 0 : I.Token) {
        if (G = G.replace(Z, ""), G) Ah.getToken.warning(G);
        return I
      }
    } catch (I) {
      continue
    }
  } catch (Z) {
    throw Error(`Unable to parse the output of PowerShell. Received output: ${A}`)
  }
  throw Error(`No access token found in the output. Received output: ${A}`)
}
// @from(Start 8311467, End 8311469)
Ah
// @from(Start 8311471, End 8311474)
QeB
// @from(Start 8311476, End 8311479)
GeB
// @from(Start 8311481, End 8311484)
mr1
// @from(Start 8311486, End 8311538)
KA5 = (A) => A.message.match(`(.*)${GeB.login}(.*)`)
// @from(Start 8311542, End 8311585)
DA5 = (A) => A.message.match(GeB.installed)
// @from(Start 8311589, End 8311592)
dr1
// @from(Start 8311598, End 8312433)
ZeB = L(() => {
  vT();
  jW();
  rZA();
  DE();
  etB();
  Yq();
  Ah = W7("AzurePowerShellCredential"), QeB = process.platform === "win32";
  GeB = {
    login: "Run Connect-AzAccount to login",
    installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
  }, mr1 = {
    login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
    installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
    troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
  }, dr1 = [BeB("pwsh")];
  if (QeB) dr1.push(BeB("powershell"))
})
// @from(Start 8312435, End 8313494)
class lr1 {
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
    return YY.withSpan("ChainedTokenCredential.getToken", Q, async (I) => {
      for (let Y = 0; Y < this._sources.length && B === null; Y++) try {
        B = await this._sources[Y].getToken(A, I), G = this._sources[Y]
      } catch (J) {
        if (J.name === "CredentialUnavailableError" || J.name === "AuthenticationRequiredError") Z.push(J);
        else throw pr1.getToken.info(d7(A, J)), J
      }
      if (!B && Z.length > 0) {
        let Y = new ti1(Z, "ChainedTokenCredential authentication failed.");
        throw pr1.getToken.info(d7(A, Y)), Y
      }
      if (pr1.getToken.info(`Result for ${G.constructor.name}: ${mF(A)}`), B === null) throw new p9("Failed to retrieve a valid token");
      return {
        token: B,
        successfulCredential: G
      }
    })
  }
}
// @from(Start 8313499, End 8313502)
pr1
// @from(Start 8313508, End 8313587)
IeB = L(() => {
  DE();
  jW();
  Yq();
  pr1 = W7("ChainedTokenCredential")
})
// @from(Start 8313721, End 8315910)
class ir1 {
  constructor(A, Q, B, G = {}) {
    if (!A || !Q) throw Error(`${vNA}: tenantId and clientId are required parameters.`);
    this.tenantId = A, this.additionallyAllowedTenantIds = NU(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.sendCertificateChain = G.sendCertificateChain, this.certificateConfiguration = Object.assign({}, typeof B === "string" ? {
      certificatePath: B
    } : B);
    let Z = this.certificateConfiguration.certificate,
      I = this.certificateConfiguration.certificatePath;
    if (!this.certificateConfiguration || !(Z || I)) throw Error(`${vNA}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (Z && I) throw Error(`${vNA}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    this.msalClient = Ol(Q, A, Object.assign(Object.assign({}, G), {
      logger: JeB,
      tokenCredentialOptions: G
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${vNA}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, JeB);
      let G = Array.isArray(A) ? A : [A],
        Z = await this.buildClientCertificate();
      return this.msalClient.getTokenByClientCertificate(G, Z, B)
    })
  }
  async buildClientCertificate() {
    var A;
    let Q = await zA5(this.certificateConfiguration, (A = this.sendCertificateChain) !== null && A !== void 0 ? A : !1),
      B;
    if (this.certificateConfiguration.certificatePassword !== void 0) B = CA5({
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
// @from(Start 8315911, End 8316603)
async function zA5(A, Q) {
  let {
    certificate: B,
    certificatePath: G
  } = A, Z = B || await EA5(G, "utf8"), I = Q ? Z : void 0, Y = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, J = [], W;
  do
    if (W = Y.exec(Z), W) J.push(W[3]); while (W);
  if (J.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
  let X = YeB("sha1").update(Buffer.from(J[0], "base64")).digest("hex").toUpperCase(),
    V = YeB("sha256").update(Buffer.from(J[0], "base64")).digest("hex").toUpperCase();
  return {
    certificateContents: Z,
    thumbprintSha256: V,
    thumbprint: X,
    x5c: I
  }
}
// @from(Start 8316608, End 8316643)
vNA = "ClientCertificateCredential"
// @from(Start 8316647, End 8316650)
JeB
// @from(Start 8316656, End 8316723)
WeB = L(() => {
  yNA();
  vT();
  jW();
  Yq();
  JeB = W7(vNA)
})
// @from(Start 8316725, End 8317920)
class nr1 {
  constructor(A, Q, B, G = {}) {
    if (!A) throw new p9("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!Q) throw new p9("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!B) throw new p9("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    this.clientSecret = B, this.tenantId = A, this.additionallyAllowedTenantIds = NU(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.msalClient = Ol(Q, A, Object.assign(Object.assign({}, G), {
      logger: XeB,
      tokenCredentialOptions: G
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, XeB);
      let G = p11(A);
      return this.msalClient.getTokenByClientSecret(G, this.clientSecret, B)
    })
  }
}
// @from(Start 8317925, End 8317928)
XeB
// @from(Start 8317934, End 8318039)
VeB = L(() => {
  yNA();
  vT();
  DE();
  jW();
  rZA();
  Yq();
  XeB = W7("ClientSecretCredential")
})
// @from(Start 8318041, End 8319480)
class ar1 {
  constructor(A, Q, B, G, Z = {}) {
    if (!A) throw new p9("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!Q) throw new p9("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!B) throw new p9("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!G) throw new p9("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    this.tenantId = A, this.additionallyAllowedTenantIds = NU(Z === null || Z === void 0 ? void 0 : Z.additionallyAllowedTenants), this.username = B, this.password = G, this.msalClient = Ol(Q, this.tenantId, Object.assign(Object.assign({}, Z), {
      tokenCredentialOptions: Z !== null && Z !== void 0 ? Z : {}
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, UA5);
      let G = p11(A);
      return this.msalClient.getTokenByUsernamePassword(G, this.username, this.password, B)
    })
  }
}
// @from(Start 8319485, End 8319488)
UA5
// @from(Start 8319494, End 8319603)
FeB = L(() => {
  yNA();
  vT();
  DE();
  jW();
  rZA();
  Yq();
  UA5 = W7("UsernamePasswordCredential")
})
// @from(Start 8319606, End 8319742)
function wA5() {
  var A;
  return ((A = process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS) !== null && A !== void 0 ? A : "").split(";")
}
// @from(Start 8319744, End 8320063)
function qA5() {
  var A;
  let Q = ((A = process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN) !== null && A !== void 0 ? A : "").toLowerCase(),
    B = Q === "true" || Q === "1";
  return Qh.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${B}`), B
}
// @from(Start 8320064, End 8322393)
class sr1 {
  constructor(A) {
    this._credential = void 0;
    let Q = ceA($A5).assigned.join(", ");
    Qh.info(`Found the following environment variables: ${Q}`);
    let B = process.env.AZURE_TENANT_ID,
      G = process.env.AZURE_CLIENT_ID,
      Z = process.env.AZURE_CLIENT_SECRET,
      I = wA5(),
      Y = qA5(),
      J = Object.assign(Object.assign({}, A), {
        additionallyAllowedTenantIds: I,
        sendCertificateChain: Y
      });
    if (B) qU(Qh, B);
    if (B && G && Z) {
      Qh.info(`Invoking ClientSecretCredential with tenant ID: ${B}, clientId: ${G} and clientSecret: [REDACTED]`), this._credential = new nr1(B, G, Z, J);
      return
    }
    let W = process.env.AZURE_CLIENT_CERTIFICATE_PATH,
      X = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
    if (B && G && W) {
      Qh.info(`Invoking ClientCertificateCredential with tenant ID: ${B}, clientId: ${G} and certificatePath: ${W}`), this._credential = new ir1(B, G, {
        certificatePath: W,
        certificatePassword: X
      }, J);
      return
    }
    let V = process.env.AZURE_USERNAME,
      F = process.env.AZURE_PASSWORD;
    if (B && G && V && F) Qh.info(`Invoking UsernamePasswordCredential with tenant ID: ${B}, clientId: ${G} and username: ${V}`), Qh.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new ar1(B, G, V, F, J)
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${i11}.getToken`, Q, async (B) => {
      if (this._credential) try {
        let G = await this._credential.getToken(A, B);
        return Qh.getToken.info(mF(A)), G
      } catch (G) {
        let Z = new mwA(400, {
          error: `${i11} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
          error_description: G.message.toString().split("More details:").join("")
        });
        throw Qh.getToken.info(d7(A, Z)), Z
      }
      throw new p9(`${i11} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`)
    })
  }
}
// @from(Start 8322398, End 8322401)
$A5
// @from(Start 8322403, End 8322432)
i11 = "EnvironmentCredential"
// @from(Start 8322436, End 8322438)
Qh
// @from(Start 8322444, End 8322790)
KeB = L(() => {
  DE();
  jW();
  WeB();
  VeB();
  FeB();
  vT();
  Yq();
  $A5 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "AZURE_CLIENT_CERTIFICATE_PASSWORD", "AZURE_USERNAME", "AZURE_PASSWORD", "AZURE_ADDITIONALLY_ALLOWED_TENANTS", "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"];
  Qh = W7(i11)
})
// @from(Start 8322793, End 8323823)
function NA5(A = {}) {
  var Q, B, G, Z;
  (Q = A.retryOptions) !== null && Q !== void 0 || (A.retryOptions = {
    maxRetries: 5,
    retryDelayInMs: 800
  });
  let I = (B = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && B !== void 0 ? B : process.env.AZURE_CLIENT_ID,
    Y = (G = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && G !== void 0 ? G : I,
    J = A === null || A === void 0 ? void 0 : A.managedIdentityResourceId,
    W = process.env.AZURE_FEDERATED_TOKEN_FILE,
    X = (Z = A === null || A === void 0 ? void 0 : A.tenantId) !== null && Z !== void 0 ? Z : process.env.AZURE_TENANT_ID;
  if (J) {
    let V = Object.assign(Object.assign({}, A), {
      resourceId: J
    });
    return new aZA(V)
  }
  if (W && Y) {
    let V = Object.assign(Object.assign({}, A), {
      tenantId: X
    });
    return new aZA(Y, V)
  }
  if (I) {
    let V = Object.assign(Object.assign({}, A), {
      clientId: I
    });
    return new aZA(V)
  }
  return new aZA(A)
}
// @from(Start 8323825, End 8324577)
function LA5(A) {
  var Q, B, G;
  let Z = (Q = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && Q !== void 0 ? Q : process.env.AZURE_CLIENT_ID,
    I = (B = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && B !== void 0 ? B : Z,
    Y = process.env.AZURE_FEDERATED_TOKEN_FILE,
    J = (G = A === null || A === void 0 ? void 0 : A.tenantId) !== null && G !== void 0 ? G : process.env.AZURE_TENANT_ID;
  if (Y && I) {
    let W = Object.assign(Object.assign({}, A), {
      tenantId: J,
      clientId: I,
      tokenFilePath: Y
    });
    return new jAA(W)
  }
  if (J) {
    let W = Object.assign(Object.assign({}, A), {
      tenantId: J
    });
    return new jAA(W)
  }
  return new jAA(A)
}
// @from(Start 8324579, End 8324703)
function MA5(A = {}) {
  let Q = A.processTimeoutInMs;
  return new ur1(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Start 8324705, End 8324829)
function OA5(A = {}) {
  let Q = A.processTimeoutInMs;
  return new gr1(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Start 8324831, End 8324955)
function RA5(A = {}) {
  let Q = A.processTimeoutInMs;
  return new cr1(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Start 8324957, End 8325001)
function TA5(A = {}) {
  return new sr1(A)
}
// @from(Start 8325002, End 8325270)
class DeB {
  constructor(A, Q) {
    this.credentialName = A, this.credentialUnavailableErrorMessage = Q
  }
  getToken() {
    return rr1.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null)
  }
}
// @from(Start 8325275, End 8325278)
rr1
// @from(Start 8325280, End 8325283)
n11
// @from(Start 8325289, End 8326300)
HeB = L(() => {
  ltB();
  atB();
  rtB();
  ZeB();
  IeB();
  KeB();
  br1();
  jW();
  rr1 = W7("DefaultAzureCredential");
  n11 = class n11 extends lr1 {
    constructor(A) {
      let Q = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0,
        B = [OA5, RA5, MA5],
        G = [TA5, LA5, NA5],
        Z = [];
      if (Q) switch (Q) {
        case "dev":
          Z = B;
          break;
        case "prod":
          Z = G;
          break;
        default: {
          let Y = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev'.`;
          throw rr1.warning(Y), Error(Y)
        }
      } else Z = [...G, ...B];
      let I = Z.map((Y) => {
        try {
          return Y(A)
        } catch (J) {
          return rr1.warning(`Skipped ${Y.name} because of an error creating the credential: ${J}`), new DeB(Y.name, J.message)
        }
      });
      super(...I)
    }
  }
})
// @from(Start 8326303, End 8326926)
function or1(A, Q, B) {
  let {
    abortSignal: G,
    tracingOptions: Z
  } = B || {}, I = rwA();
  I.addPolicy(BqA({
    credential: A,
    scopes: Q
  }));
  async function Y() {
    var J;
    let X = (J = (await I.sendRequest({
      sendRequest: (V) => Promise.resolve({
        request: V,
        status: 200,
        headers: V.headers
      })
    }, hT({
      url: "https://example.com",
      abortSignal: G,
      tracingOptions: Z
    }))).headers.get("authorization")) === null || J === void 0 ? void 0 : J.split(" ")[1];
    if (!X) throw Error("Failed to get access token");
    return X
  }
  return Y
}
// @from(Start 8326931, End 8326956)
CeB = L(() => {
  _f()
})
// @from(Start 8326962, End 8327006)
EeB = L(() => {
  HeB();
  CeB();
  FaB()
})
// @from(Start 8327009, End 8327329)
function a11() {
  return {
    error: (A, ...Q) => console.error("[Anthropic SDK ERROR]", A, ...Q),
    warn: (A, ...Q) => console.error("[Anthropic SDK WARN]", A, ...Q),
    info: (A, ...Q) => console.error("[Anthropic SDK INFO]", A, ...Q),
    debug: (A, ...Q) => console.error("[Anthropic SDK DEBUG]", A, ...Q)
  }
}