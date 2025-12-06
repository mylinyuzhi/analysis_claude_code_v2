
// @from(Start 8040421, End 8058833)
class kV {
  constructor(A, Q, B, G, Z, I, Y, J) {
    this.canonicalAuthority = A, this._canonicalAuthority.validateAsUri(), this.networkInterface = Q, this.cacheManager = B, this.authorityOptions = G, this.regionDiscoveryMetadata = {
      region_used: void 0,
      region_source: void 0,
      region_outcome: void 0
    }, this.logger = Z, this.performanceClient = Y, this.correlationId = I, this.managedIdentity = J || !1, this.regionDiscovery = new BNA(Q, this.logger, this.performanceClient, this.correlationId)
  }
  getAuthorityType(A) {
    if (A.HostNameAndPort.endsWith(L0.CIAM_AUTH_URL)) return jM.Ciam;
    let Q = A.PathSegments;
    if (Q.length) switch (Q[0].toLowerCase()) {
      case L0.ADFS:
        return jM.Adfs;
      case L0.DSTS:
        return jM.Dsts
    }
    return jM.Default
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
    this._canonicalAuthority = new w8(A), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null
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
    else throw b0(EE)
  }
  get tokenEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint);
    else throw b0(EE)
  }
  get deviceCodeEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
    else throw b0(EE)
  }
  get endSessionEndpoint() {
    if (this.discoveryComplete()) {
      if (!this.metadata.end_session_endpoint) throw b0(pe);
      return this.replacePath(this.metadata.end_session_endpoint)
    } else throw b0(EE)
  }
  get selfSignedJwtAudience() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.issuer);
    else throw b0(EE)
  }
  get jwksUri() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.jwks_uri);
    else throw b0(EE)
  }
  canReplaceTenant(A) {
    return A.PathSegments.length === 1 && !kV.reservedTenantDomains.has(A.PathSegments[0]) && this.getAuthorityType(A) === jM.Default && this.protocolMode !== aH.OIDC
  }
  replaceTenant(A) {
    return A.replace(/{tenant}|{tenantid}/g, this.tenant)
  }
  replacePath(A) {
    let Q = A,
      G = new w8(this.metadata.canonical_authority).getUrlComponents(),
      Z = G.PathSegments;
    return this.canonicalAuthorityUrlComponents.PathSegments.forEach((Y, J) => {
      let W = Z[J];
      if (J === 0 && this.canReplaceTenant(G)) {
        let X = new w8(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
        if (W !== X) this.logger.verbose(`Replacing tenant domain name ${W} with id ${X}`), W = X
      }
      if (Y !== W) Q = Q.replace(`/${W}/`, `/${Y}/`)
    }), this.replaceTenant(Q)
  }
  get defaultOpenIdConfigurationEndpoint() {
    let A = this.hostnameAndPort;
    if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === jM.Adfs || this.protocolMode === aH.OIDC && !this.isAliasOfKnownMicrosoftAuthority(A)) return `${this.canonicalAuthority}.well-known/openid-configuration`;
    return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`
  }
  discoveryComplete() {
    return !!this.metadata
  }
  async resolveEndpointsAsync() {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityResolveEndpointsAsync, this.correlationId);
    let A = this.getCurrentMetadataEntity(),
      Q = await _5(this.updateCloudDiscoveryMetadata.bind(this), Z0.AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(A);
    this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, A.preferred_network);
    let B = await _5(this.updateEndpointMetadata.bind(this), Z0.AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(A);
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
      expiresAt: uA1(),
      jwks_uri: ""
    };
    return A
  }
  updateCachedMetadata(A, Q, B) {
    if (Q !== CE.CACHE && B?.source !== CE.CACHE) A.expiresAt = uA1(), A.canonical_authority = this.canonicalAuthority;
    let G = this.cacheManager.generateAuthorityMetadataCacheKey(A.preferred_cache);
    this.cacheManager.setAuthorityMetadata(G, A), this.metadata = A
  }
  async updateEndpointMetadata(A) {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityUpdateEndpointMetadata, this.correlationId);
    let Q = this.updateEndpointMetadataFromLocalSources(A);
    if (Q) {
      if (Q.source === CE.HARDCODED_VALUES) {
        if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
          if (Q.metadata) {
            let G = await _5(this.updateMetadataWithRegionalInformation.bind(this), Z0.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(Q.metadata);
            bZA(A, G, !1), A.canonical_authority = this.canonicalAuthority
          }
        }
      }
      return Q.source
    }
    let B = await _5(this.getEndpointMetadataFromNetwork.bind(this), Z0.AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (B) {
      if (this.authorityOptions.azureRegionConfiguration?.azureRegion) B = await _5(this.updateMetadataWithRegionalInformation.bind(this), Z0.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(B);
      return bZA(A, B, !0), CE.NETWORK
    } else throw b0(ke, this.defaultOpenIdConfigurationEndpoint)
  }
  updateEndpointMetadataFromLocalSources(A) {
    this.logger.verbose("Attempting to get endpoint metadata from authority configuration");
    let Q = this.getEndpointMetadataFromConfig();
    if (Q) return this.logger.verbose("Found endpoint metadata in authority configuration"), bZA(A, Q, !1), {
      source: CE.CONFIG
    };
    if (this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."), this.authorityOptions.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");
    else {
      let G = this.getEndpointMetadataFromHardcodedValues();
      if (G) return bZA(A, G, !1), {
        source: CE.HARDCODED_VALUES,
        metadata: G
      };
      else this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")
    }
    let B = mA1(A);
    if (this.isAuthoritySameType(A) && A.endpointsFromNetwork && !B) return this.logger.verbose("Found endpoint metadata in the cache."), {
      source: CE.CACHE
    };
    else if (B) this.logger.verbose("The metadata entity is expired.");
    return null
  }
  isAuthoritySameType(A) {
    return new w8(A.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length
  }
  getEndpointMetadataFromConfig() {
    if (this.authorityOptions.authorityMetadata) try {
      return JSON.parse(this.authorityOptions.authorityMetadata)
    } catch (A) {
      throw hG(ee)
    }
    return null
  }
  async getEndpointMetadataFromNetwork() {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityGetEndpointMetadataFromNetwork, this.correlationId);
    let A = {},
      Q = this.defaultOpenIdConfigurationEndpoint;
    this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${Q}`);
    try {
      let B = await this.networkInterface.sendGetRequestAsync(Q, A);
      if (TaB(B.body)) return B.body;
      else return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"), null
    } catch (B) {
      return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${B}`), null
    }
  }
  getEndpointMetadataFromHardcodedValues() {
    if (this.hostnameAndPort in Va1) return Va1[this.hostnameAndPort];
    return null
  }
  async updateMetadataWithRegionalInformation(A) {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityUpdateMetadataWithRegionalInformation, this.correlationId);
    let Q = this.authorityOptions.azureRegionConfiguration?.azureRegion;
    if (Q) {
      if (Q !== L0.AZURE_REGION_AUTO_DISCOVER_FLAG) return this.regionDiscoveryMetadata.region_outcome = UA1.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = Q, kV.replaceWithRegionalInformation(A, Q);
      let B = await _5(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), Z0.RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
      if (B) return this.regionDiscoveryMetadata.region_outcome = UA1.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = B, kV.replaceWithRegionalInformation(A, B);
      this.regionDiscoveryMetadata.region_outcome = UA1.AUTO_DETECTION_REQUESTED_FAILED
    }
    return A
  }
  async updateCloudDiscoveryMetadata(A) {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityUpdateCloudDiscoveryMetadata, this.correlationId);
    let Q = this.updateCloudDiscoveryMetadataFromLocalSources(A);
    if (Q) return Q;
    let B = await _5(this.getCloudDiscoveryMetadataFromNetwork.bind(this), Z0.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (B) return ZNA(A, B, !0), CE.NETWORK;
    throw hG(AAA)
  }
  updateCloudDiscoveryMetadataFromLocalSources(A) {
    this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"), this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||L0.NOT_APPLICABLE}`), this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||L0.NOT_APPLICABLE}`), this.logger.verbosePii(`Canonical Authority: ${A.canonical_authority||L0.NOT_APPLICABLE}`);
    let Q = this.getCloudDiscoveryMetadataFromConfig();
    if (Q) return this.logger.verbose("Found cloud discovery metadata in authority configuration"), ZNA(A, Q, !1), CE.CONFIG;
    if (this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."), this.options.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");
    else {
      let G = waB(this.hostnameAndPort);
      if (G) return this.logger.verbose("Found cloud discovery metadata from hardcoded values."), ZNA(A, G, !1), CE.HARDCODED_VALUES;
      this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")
    }
    let B = mA1(A);
    if (this.isAuthoritySameType(A) && A.aliasesFromNetwork && !B) return this.logger.verbose("Found cloud discovery metadata in the cache."), CE.CACHE;
    else if (B) this.logger.verbose("The metadata entity is expired.");
    return null
  }
  getCloudDiscoveryMetadataFromConfig() {
    if (this.authorityType === jM.Ciam) return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."), kV.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    if (this.authorityOptions.cloudDiscoveryMetadata) {
      this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");
      try {
        this.logger.verbose("Attempting to parse the cloud discovery metadata.");
        let A = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),
          Q = uqA(A.metadata, this.hostnameAndPort);
        if (this.logger.verbose("Parsed the cloud discovery metadata."), Q) return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."), Q;
        else this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")
      } catch (A) {
        throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."), hG(Xl)
      }
    }
    if (this.isInKnownAuthorities()) return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."), kV.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return null
  }
  async getCloudDiscoveryMetadataFromNetwork() {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.correlationId);
    let A = `${L0.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,
      Q = {},
      B = null;
    try {
      let G = await this.networkInterface.sendGetRequestAsync(A, Q),
        Z, I;
      if (jaB(G.body)) Z = G.body, I = Z.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: ${Z.tenant_discovery_endpoint}`);
      else if (_aB(G.body)) {
        if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${G.status}`), Z = G.body, Z.error === L0.INVALID_INSTANCE) return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."), null;
        this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${Z.error}`), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${Z.error_description}`), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"), I = []
      } else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"), null;
      this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."), B = uqA(I, this.hostnameAndPort)
    } catch (G) {
      if (G instanceof t4) this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
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
    if (!B) this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."), this.logger.verbose("Creating custom Authority for custom domain scenario."), B = kV.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return B
  }
  isInKnownAuthorities() {
    return this.authorityOptions.knownAuthorities.filter((Q) => {
      return Q && w8.getDomainFromUrl(Q).toLowerCase() === this.hostnameAndPort
    }).length > 0
  }
  static generateAuthority(A, Q) {
    let B;
    if (Q && Q.azureCloudInstance !== hf.None) {
      let G = Q.tenant ? Q.tenant : L0.DEFAULT_COMMON_TENANT;
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
    if (this.managedIdentity) return L0.DEFAULT_AUTHORITY_HOST;
    else if (this.discoveryComplete()) return this.metadata.preferred_cache;
    else throw b0(EE)
  }
  isAlias(A) {
    return this.metadata.aliases.indexOf(A) > -1
  }
  isAliasOfKnownMicrosoftAuthority(A) {
    return Ka1.has(A)
  }
  static isPublicCloudAuthority(A) {
    return L0.KNOWN_PUBLIC_CLOUDS.indexOf(A) >= 0
  }
  static buildRegionalAuthorityString(A, Q, B) {
    let G = new w8(A);
    G.validateAsUri();
    let Z = G.getUrlComponents(),
      I = `${Q}.${Z.HostNameAndPort}`;
    if (this.isPublicCloudAuthority(Z.HostNameAndPort)) I = `${Q}.${L0.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
    let Y = w8.constructAuthorityUriFromObject({
      ...G.getUrlComponents(),
      HostNameAndPort: I
    }).urlString;
    if (B) return `${Y}?${B}`;
    return Y
  }
  static replaceWithRegionalInformation(A, Q) {
    let B = {
      ...A
    };
    if (B.authorization_endpoint = kV.buildRegionalAuthorityString(B.authorization_endpoint, Q), B.token_endpoint = kV.buildRegionalAuthorityString(B.token_endpoint, Q), B.end_session_endpoint) B.end_session_endpoint = kV.buildRegionalAuthorityString(B.end_session_endpoint, Q);
    return B
  }
  static transformCIAMAuthority(A) {
    let Q = A,
      G = new w8(A).getUrlComponents();
    if (G.PathSegments.length === 0 && G.HostNameAndPort.endsWith(L0.CIAM_AUTH_URL)) {
      let Z = G.HostNameAndPort.split(".")[0];
      Q = `${Q}${Z}${L0.AAD_TENANT_DOMAIN_SUFFIX}`
    }
    return Q
  }
}
// @from(Start 8058835, End 8059066)
function vaB(A) {
  let G = new w8(A).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
  switch (G) {
    case MU.COMMON:
    case MU.ORGANIZATIONS:
    case MU.CONSUMERS:
      return;
    default:
      return G
  }
}
// @from(Start 8059068, End 8059157)
function cA1(A) {
  return A.endsWith(L0.FORWARD_SLASH) ? A : `${A}${L0.FORWARD_SLASH}`
}
// @from(Start 8059159, End 8059456)
function zs1(A) {
  let Q = A.cloudDiscoveryMetadata,
    B = void 0;
  if (Q) try {
    B = JSON.parse(Q)
  } catch (G) {
    throw hG(Xl)
  }
  return {
    canonicalAuthority: A.authority ? cA1(A.authority) : void 0,
    knownAuthorities: A.knownAuthorities,
    cloudDiscoveryMetadata: B
  }
}
// @from(Start 8059461, End 8059786)
pA1 = L(() => {
  Ya1();
  PaB();
  Kl();
  dX();
  mZ();
  Da1();
  Vl();
  hqA();
  LA1();
  SaB();
  kaB();
  xaB();
  PM();
  uT();
  lf();
  dA1();
  SW();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  kV.reservedTenantDomains = new Set(["{tenant}", "{tenantid}", MU.COMMON, MU.CONSUMERS, MU.ORGANIZATIONS])
})
// @from(Start 8059792, End 8059800)
lA1 = {}
// @from(Start 8059854, End 8060200)
async function Us1(A, Q, B, G, Z, I, Y) {
  Y?.addQueueMeasurement(Z0.AuthorityFactoryCreateDiscoveredInstance, I);
  let J = kV.transformCIAMAuthority(cA1(A)),
    W = new kV(J, Q, B, G, Z, I, Y);
  try {
    return await _5(W.resolveEndpointsAsync.bind(W), Z0.AuthorityResolveEndpointsAsync, Z, Y, I)(), W
  } catch (X) {
    throw b0(EE)
  }
}
// @from(Start 8060205, End 8060310)
$s1 = L(() => {
  pA1();
  dX();
  uT();
  lf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8060316, End 8060318)
$E
// @from(Start 8060324, End 8060600)
fZA = L(() => {
  PM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  $E = class $E extends t4 {
    constructor(A, Q, B, G, Z) {
      super(A, Q, B);
      this.name = "ServerError", this.errorNo = G, this.status = Z, Object.setPrototypeOf(this, $E.prototype)
    }
  }
})
// @from(Start 8060603, End 8061036)
function hZA(A, Q, B) {
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
// @from(Start 8061041, End 8061107)
iA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8061109, End 8062639)
class nf {
  static generateThrottlingStorageKey(A) {
    return `${Xk.THROTTLING_PREFIX}.${JSON.stringify(A)}`
  }
  static preProcess(A, Q, B) {
    let G = nf.generateThrottlingStorageKey(Q),
      Z = A.getThrottlingCache(G);
    if (Z) {
      if (Z.throttleTime < Date.now()) {
        A.removeItem(G, B);
        return
      }
      throw new $E(Z.errorCodes?.join(" ") || L0.EMPTY_STRING, Z.errorMessage, Z.subError)
    }
  }
  static postProcess(A, Q, B, G) {
    if (nf.checkResponseStatus(B) || nf.checkResponseForRetryAfter(B)) {
      let Z = {
        throttleTime: nf.calculateThrottleTime(parseInt(B.headers[uZ.RETRY_AFTER])),
        error: B.body.error,
        errorCodes: B.body.error_codes,
        errorMessage: B.body.error_description,
        subError: B.body.suberror
      };
      A.setThrottlingCache(nf.generateThrottlingStorageKey(Q), Z, G)
    }
  }
  static checkResponseStatus(A) {
    return A.status === 429 || A.status >= 500 && A.status < 600
  }
  static checkResponseForRetryAfter(A) {
    if (A.headers) return A.headers.hasOwnProperty(uZ.RETRY_AFTER) && (A.status < 200 || A.status >= 300);
    return !1
  }
  static calculateThrottleTime(A) {
    let Q = A <= 0 ? 0 : A,
      B = Date.now() / 1000;
    return Math.floor(Math.min(B + (Q || Xk.DEFAULT_THROTTLE_TIME_SECONDS), B + Xk.DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000)
  }
  static removeThrottle(A, Q, B, G) {
    let Z = hZA(Q, B, G),
      I = this.generateThrottlingStorageKey(Z);
    A.removeItem(I, B.correlationId)
  }
}
// @from(Start 8062644, End 8062734)
baB = L(() => {
  mZ();
  fZA();
  iA1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8062740, End 8062743)
nA1
// @from(Start 8062749, End 8063083)
faB = L(() => {
  PM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  nA1 = class nA1 extends t4 {
    constructor(A, Q, B) {
      super(A.errorCode, A.errorMessage, A.subError);
      Object.setPrototypeOf(this, nA1.prototype), this.name = "NetworkError", this.error = A, this.httpStatus = Q, this.responseHeaders = B
    }
  }
})
// @from(Start 8063085, End 8066148)
class sH {
  constructor(A, Q) {
    this.config = OaB(A), this.logger = new RU(this.config.loggerOptions, qA1, MZA), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = Q
  }
  createTokenRequestHeaders(A) {
    let Q = {};
    if (Q[uZ.CONTENT_TYPE] = L0.URL_FORM_CONTENT_TYPE, !this.config.systemOptions.preventCorsPreflight && A) switch (A.type) {
      case zE.HOME_ACCOUNT_ID:
        try {
          let B = Fk(A.credential);
          Q[uZ.CCS_HEADER] = `Oid:${B.uid}@${B.utid}`
        } catch (B) {
          this.logger.verbose("Could not parse home account ID for CCS Header: " + B)
        }
        break;
      case zE.UPN:
        Q[uZ.CCS_HEADER] = `UPN: ${A.credential}`;
        break
    }
    return Q
  }
  async executePostToTokenEndpoint(A, Q, B, G, Z, I) {
    if (I) this.performanceClient?.addQueueMeasurement(I, Z);
    let Y = await this.sendPostRequest(G, A, {
      body: Q,
      headers: B
    }, Z);
    if (this.config.serverTelemetryManager && Y.status < 500 && Y.status !== 429) this.config.serverTelemetryManager.clearTelemetryCache();
    return Y
  }
  async sendPostRequest(A, Q, B, G) {
    nf.preProcess(this.cacheManager, A, G);
    let Z;
    try {
      Z = await _5(this.networkClient.sendPostRequestAsync.bind(this.networkClient), Z0.NetworkClientSendPostRequestAsync, this.logger, this.performanceClient, G)(Q, B);
      let I = Z.headers || {};
      this.performanceClient?.addFields({
        refreshTokenSize: Z.body.refresh_token?.length || 0,
        httpVerToken: I[uZ.X_MS_HTTP_VERSION] || "",
        requestId: I[uZ.X_MS_REQUEST_ID] || ""
      }, G)
    } catch (I) {
      if (I instanceof nA1) {
        let Y = I.responseHeaders;
        if (Y) this.performanceClient?.addFields({
          httpVerToken: Y[uZ.X_MS_HTTP_VERSION] || "",
          requestId: Y[uZ.X_MS_REQUEST_ID] || "",
          contentTypeHeader: Y[uZ.CONTENT_TYPE] || void 0,
          contentLengthHeader: Y[uZ.CONTENT_LENGTH] || void 0,
          httpStatus: I.httpStatus
        }, G);
        throw I.error
      }
      if (I instanceof t4) throw I;
      else throw b0(_e)
    }
    return nf.postProcess(this.cacheManager, A, Z, G), Z
  }
  async updateAuthority(A, Q) {
    this.performanceClient?.addQueueMeasurement(Z0.UpdateTokenEndpointAuthority, Q);
    let B = `https://${A}/${this.authority.tenant}/`,
      G = await Us1(B, this.networkClient, this.cacheManager, this.authority.options, this.logger, Q, this.performanceClient);
    this.authority = G
  }
  createTokenQueryParameters(A) {
    let Q = new Map;
    if (A.embeddedClientId) pf(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
    if (A.tokenQueryParameters) cf(Q, A.tokenQueryParameters);
    return XAA(Q, A.correlationId), ZAA(Q, A.correlationId, this.performanceClient), Kk(Q)
  }
}
// @from(Start 8066153, End 8066355)
INA = L(() => {
  kA1();
  wA1();
  mZ();
  NA1();
  dqA();
  PZA();
  xZA();
  QAA();
  $s1();
  uT();
  baB();
  PM();
  dX();
  faB();
  lf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8066361, End 8066369)
sA1 = {}
// @from(Start 8066629, End 8066651)
Cl = "no_tokens_found"
// @from(Start 8066655, End 8066689)
YNA = "native_account_unavailable"
// @from(Start 8066693, End 8066722)
JNA = "refresh_token_expired"
// @from(Start 8066726, End 8066748)
aA1 = "ux_not_allowed"
// @from(Start 8066752, End 8066780)
ws1 = "interaction_required"
// @from(Start 8066784, End 8066808)
qs1 = "consent_required"
// @from(Start 8066812, End 8066834)
Ns1 = "login_required"
// @from(Start 8066838, End 8066854)
El = "bad_token"
// @from(Start 8066860, End 8066926)
rA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8066929, End 8067121)
function tA1(A, Q, B) {
  let G = !!A && haB.indexOf(A) > -1,
    Z = !!B && Ea6.indexOf(B) > -1,
    I = !!Q && haB.some((Y) => {
      return Q.indexOf(Y) > -1
    });
  return G || I || Z
}
// @from(Start 8067123, End 8067169)
function eA1(A) {
  return new Wq(A, oA1[A])
}
// @from(Start 8067174, End 8067177)
haB
// @from(Start 8067179, End 8067182)
Ea6
// @from(Start 8067184, End 8067187)
oA1
// @from(Start 8067189, End 8067192)
Ls1
// @from(Start 8067194, End 8067196)
Wq
// @from(Start 8067202, End 8068593)
WNA = L(() => {
  mZ();
  PM();
  rA1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  haB = [ws1, qs1, Ns1, El, aA1], Ea6 = ["message_only", "additional_action", "basic_action", "user_password_expired", "consent_required", "bad_token"], oA1 = {
    [Cl]: "No refresh token found in the cache. Please sign-in.",
    [YNA]: "The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",
    [JNA]: "Refresh token has expired.",
    [El]: "Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve.",
    [aA1]: "`canShowUI` flag in Edge was set to false. User interaction required on web page. Please invoke an interactive API to resolve."
  }, Ls1 = {
    noTokensFoundError: {
      code: Cl,
      desc: oA1[Cl]
    },
    native_account_unavailable: {
      code: YNA,
      desc: oA1[YNA]
    },
    bad_token: {
      code: El,
      desc: oA1[El]
    }
  };
  Wq = class Wq extends t4 {
    constructor(A, Q, B, G, Z, I, Y, J) {
      super(A, Q, B);
      Object.setPrototypeOf(this, Wq.prototype), this.timestamp = G || L0.EMPTY_STRING, this.traceId = Z || L0.EMPTY_STRING, this.correlationId = I || L0.EMPTY_STRING, this.claims = Y || L0.EMPTY_STRING, this.name = "InteractionRequiredAuthError", this.errorNo = J
    }
  }
})
// @from(Start 8068595, End 8069380)
class A11 {
  static setRequestState(A, Q, B) {
    let G = A11.generateLibraryState(A, B);
    return Q ? `${G}${L0.RESOURCE_DELIM}${Q}` : G
  }
  static generateLibraryState(A, Q) {
    if (!A) throw b0(Yl);
    let B = {
      id: A.createNewGuid()
    };
    if (Q) B.meta = Q;
    let G = JSON.stringify(B);
    return A.base64Encode(G)
  }
  static parseRequestState(A, Q) {
    if (!A) throw b0(Yl);
    if (!Q) throw b0(gT);
    try {
      let B = Q.split(L0.RESOURCE_DELIM),
        G = B[0],
        Z = B.length > 1 ? B.slice(1).join(L0.RESOURCE_DELIM) : L0.EMPTY_STRING,
        I = A.base64Decode(G),
        Y = JSON.parse(I);
      return {
        userRequestState: Z || L0.EMPTY_STRING,
        libraryState: Y
      }
    } catch (B) {
      throw b0(gT)
    }
  }
}
// @from(Start 8069385, End 8069473)
gaB = L(() => {
  mZ();
  dX();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8069475, End 8070800)
class FAA {
  constructor(A, Q) {
    this.cryptoUtils = A, this.performanceClient = Q
  }
  async generateCnf(A, Q) {
    this.performanceClient?.addQueueMeasurement(Z0.PopTokenGenerateCnf, A.correlationId);
    let B = await _5(this.generateKid.bind(this), Z0.PopTokenGenerateCnf, Q, this.performanceClient, A.correlationId)(A),
      G = this.cryptoUtils.base64UrlEncode(JSON.stringify(B));
    return {
      kid: B.kid,
      reqCnfString: G
    }
  }
  async generateKid(A) {
    return this.performanceClient?.addQueueMeasurement(Z0.PopTokenGenerateKid, A.correlationId), {
      kid: await this.cryptoUtils.getPublicKeyThumbprint(A),
      xms_ksl: za6.SW
    }
  }
  async signPopToken(A, Q, B) {
    return this.signPayload(A, Q, B)
  }
  async signPayload(A, Q, B, G) {
    let {
      resourceRequestMethod: Z,
      resourceRequestUri: I,
      shrClaims: Y,
      shrNonce: J,
      shrOptions: W
    } = B, V = (I ? new w8(I) : void 0)?.getUrlComponents();
    return this.cryptoUtils.signJwt({
      at: A,
      ts: Jq(),
      m: Z?.toUpperCase(),
      u: V?.HostNameAndPort,
      nonce: J || this.cryptoUtils.createNewGuid(),
      p: V?.AbsolutePath,
      q: V?.QueryString ? [
        [], V.QueryString
      ] : void 0,
      client_claims: Y || void 0,
      ...G
    }, Q, W, B.correlationId)
  }
}
// @from(Start 8070805, End 8070808)
za6
// @from(Start 8070814, End 8070937)
Q11 = L(() => {
  Hl();
  Kl();
  uT();
  lf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  za6 = {
    SW: "sw"
  }
})
// @from(Start 8070939, End 8071121)
class SM {
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
// @from(Start 8071126, End 8071192)
Ms1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8071194, End 8078003)
class _J {
  constructor(A, Q, B, G, Z, I, Y) {
    this.clientId = A, this.cacheStorage = Q, this.cryptoObj = B, this.logger = G, this.serializableCache = Z, this.persistencePlugin = I, this.performanceClient = Y
  }
  validateTokenResponse(A, Q) {
    if (A.error || A.error_description || A.suberror) {
      let B = `Error(s): ${A.error_codes||L0.NOT_AVAILABLE} - Timestamp: ${A.timestamp||L0.NOT_AVAILABLE} - Description: ${A.error_description||L0.NOT_AVAILABLE} - Correlation ID: ${A.correlation_id||L0.NOT_AVAILABLE} - Trace ID: ${A.trace_id||L0.NOT_AVAILABLE}`,
        G = A.error_codes?.length ? A.error_codes[0] : void 0,
        Z = new $E(A.error, B, A.suberror, G, A.status);
      if (Q && A.status && A.status >= o4.SERVER_ERROR_RANGE_START && A.status <= o4.SERVER_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${Z}`);
        return
      } else if (Q && A.status && A.status >= o4.CLIENT_ERROR_RANGE_START && A.status <= o4.CLIENT_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${Z}`);
        return
      }
      if (tA1(A.error, A.error_description, A.suberror)) throw new Wq(A.error, A.error_description, A.suberror, A.timestamp || L0.EMPTY_STRING, A.trace_id || L0.EMPTY_STRING, A.correlation_id || L0.EMPTY_STRING, A.claims || L0.EMPTY_STRING, G);
      throw Z
    }
  }
  async handleServerTokenResponse(A, Q, B, G, Z, I, Y, J, W) {
    this.performanceClient?.addQueueMeasurement(Z0.HandleServerTokenResponse, A.correlation_id);
    let X;
    if (A.id_token) {
      if (X = mf(A.id_token || L0.EMPTY_STRING, this.cryptoObj.base64Decode), Z && Z.nonce) {
        if (X.nonce !== Z.nonce) throw b0(ve)
      }
      if (G.maxAge || G.maxAge === 0) {
        let D = X.auth_time;
        if (!D) throw b0(xf);
        gqA(D, G.maxAge)
      }
    }
    this.homeAccountIdentifier = cX.generateHomeAccountId(A.client_info || L0.EMPTY_STRING, Q.authorityType, this.logger, this.cryptoObj, X);
    let V;
    if (!!Z && !!Z.state) V = A11.parseRequestState(this.cryptoObj, Z.state);
    A.key_id = A.key_id || G.sshKid || void 0;
    let F = this.generateCacheRecord(A, Q, B, G, X, I, Z),
      K;
    try {
      if (this.persistencePlugin && this.serializableCache) this.logger.verbose("Persistence enabled, calling beforeCacheAccess"), K = new SM(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(K);
      if (Y && !J && F.account) {
        let D = this.cacheStorage.generateAccountKey(cX.getAccountInfo(F.account));
        if (!this.cacheStorage.getAccount(D, G.correlationId)) return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"), await _J.generateAuthenticationResult(this.cryptoObj, Q, F, !1, G, X, V, void 0, W)
      }
      await this.cacheStorage.saveCacheRecord(F, G.correlationId, Wa1(X || {}), G.storeInCache)
    } finally {
      if (this.persistencePlugin && this.serializableCache && K) this.logger.verbose("Persistence enabled, calling afterCacheAccess"), await this.persistencePlugin.afterCacheAccess(K)
    }
    return _J.generateAuthenticationResult(this.cryptoObj, Q, F, !1, G, X, V, A, W)
  }
  generateCacheRecord(A, Q, B, G, Z, I, Y) {
    let J = Q.getPreferredCache();
    if (!J) throw b0(bf);
    let W = RA1(Z),
      X, V;
    if (A.id_token && !!Z) X = Hs1(this.homeAccountIdentifier, J, A.id_token, this.clientId, W || ""), V = uaB(this.cacheStorage, Q, this.homeAccountIdentifier, this.cryptoObj.base64Decode, G.correlationId, Z, A.client_info, J, W, Y, void 0, this.logger);
    let F = null;
    if (A.access_token) {
      let H = A.scope ? SJ.fromString(A.scope) : new SJ(G.scopes || []),
        C = (typeof A.expires_in === "string" ? parseInt(A.expires_in, 10) : A.expires_in) || 0,
        E = (typeof A.ext_expires_in === "string" ? parseInt(A.ext_expires_in, 10) : A.ext_expires_in) || 0,
        U = (typeof A.refresh_in === "string" ? parseInt(A.refresh_in, 10) : A.refresh_in) || void 0,
        q = B + C,
        w = q + E,
        N = U && U > 0 ? B + U : void 0;
      F = Cs1(this.homeAccountIdentifier, J, A.access_token, this.clientId, W || Q.tenant || "", H.printScopes(), q, w, this.cryptoObj.base64Decode, N, A.token_type, I, A.key_id, G.claims, G.requestedClaimsHash)
    }
    let K = null;
    if (A.refresh_token) {
      let H;
      if (A.refresh_token_expires_in) {
        let C = typeof A.refresh_token_expires_in === "string" ? parseInt(A.refresh_token_expires_in, 10) : A.refresh_token_expires_in;
        H = B + C
      }
      K = Es1(this.homeAccountIdentifier, J, A.refresh_token, this.clientId, A.foci, I, H)
    }
    let D = null;
    if (A.foci) D = {
      clientId: this.clientId,
      environment: J,
      familyId: A.foci
    };
    return {
      account: V,
      idToken: X,
      accessToken: F,
      refreshToken: K,
      appMetadata: D
    }
  }
  static async generateAuthenticationResult(A, Q, B, G, Z, I, Y, J, W) {
    let X = L0.EMPTY_STRING,
      V = [],
      F = null,
      K, D, H = L0.EMPTY_STRING;
    if (B.accessToken) {
      if (B.accessToken.tokenType === A5.POP && !Z.popKid) {
        let q = new FAA(A),
          {
            secret: w,
            keyId: N
          } = B.accessToken;
        if (!N) throw b0(le);
        X = await q.signPopToken(w, N, Z)
      } else X = B.accessToken.secret;
      if (V = SJ.fromString(B.accessToken.target).asArray(), F = GNA(B.accessToken.expiresOn), K = GNA(B.accessToken.extendedExpiresOn), B.accessToken.refreshOn) D = GNA(B.accessToken.refreshOn)
    }
    if (B.appMetadata) H = B.appMetadata.familyId === Ql ? Ql : "";
    let C = I?.oid || I?.sub || "",
      E = I?.tid || "";
    if (J?.spa_accountid && !!B.account) B.account.nativeAccountId = J?.spa_accountid;
    let U = B.account ? MA1(cX.getAccountInfo(B.account), void 0, I, B.idToken?.secret) : null;
    return {
      authority: Q.canonicalAuthority,
      uniqueId: C,
      tenantId: E,
      scopes: V,
      account: U,
      idToken: B?.idToken?.secret || "",
      idTokenClaims: I || {},
      accessToken: X,
      fromCache: G,
      expiresOn: F,
      extExpiresOn: K,
      refreshOn: D,
      correlationId: Z.correlationId,
      requestId: W || L0.EMPTY_STRING,
      familyId: H,
      tokenType: B.accessToken?.tokenType || L0.EMPTY_STRING,
      state: Y ? Y.userRequestState : L0.EMPTY_STRING,
      cloudGraphHostName: B.account?.cloudGraphHostName || L0.EMPTY_STRING,
      msGraphHost: B.account?.msGraphHost || L0.EMPTY_STRING,
      code: J?.spa_code,
      fromNativeBroker: !1
    }
  }
}
// @from(Start 8078005, End 8078694)
function uaB(A, Q, B, G, Z, I, Y, J, W, X, V, F) {
  F?.verbose("setCachedAccount called");
  let D = A.getAccountKeys().find((q) => {
      return q.startsWith(B)
    }),
    H = null;
  if (D) H = A.getAccount(D, Z);
  let C = H || cX.createAccount({
      homeAccountId: B,
      idTokenClaims: I,
      clientInfo: Y,
      environment: J,
      cloudGraphHostName: X?.cloud_graph_host_name,
      msGraphHost: X?.msgraph_host,
      nativeAccountId: V
    }, Q, G),
    E = C.tenantProfiles || [],
    U = W || C.realm;
  if (U && !E.find((q) => {
      return q.tenantId === U
    })) {
    let q = fqA(B, C.localAccountId, U, I);
    E.push(q)
  }
  return C.tenantProfiles = E, C
}
// @from(Start 8078699, End 8078902)
XNA = L(() => {
  dX();
  fZA();
  bqA();
  TA1();
  WNA();
  gaB();
  mZ();
  Q11();
  Ms1();
  uT();
  jZA();
  Ja1();
  OA1();
  dA1();
  Hl();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8078904, End 8079034)
async function wE(A, Q, B) {
  if (typeof A === "string") return A;
  else return A({
    clientId: Q,
    tokenEndpoint: B
  })
}
// @from(Start 8079039, End 8079105)
B11 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8079111, End 8079114)
G11
// @from(Start 8079120, End 8085151)
maB = L(() => {
  INA();
  xZA();
  QAA();
  mZ();
  kZA();
  kA1();
  XNA();
  Fl();
  dX();
  Kl();
  Q11();
  Hl();
  PZA();
  dqA();
  Vl();
  uT();
  lf();
  B11();
  iA1();
  SW();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  G11 = class G11 extends sH {
    constructor(A, Q) {
      super(A, Q);
      this.includeRedirectUri = !0, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes
    }
    async acquireToken(A, Q) {
      if (this.performanceClient?.addQueueMeasurement(Z0.AuthClientAcquireToken, A.correlationId), !A.code) throw b0(he);
      let B = Jq(),
        G = await _5(this.executeTokenRequest.bind(this), Z0.AuthClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(this.authority, A),
        Z = G.headers?.[uZ.X_MS_REQUEST_ID],
        I = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin, this.performanceClient);
      return I.validateTokenResponse(G.body), _5(I.handleServerTokenResponse.bind(I), Z0.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(G.body, this.authority, B, A, Q, void 0, void 0, void 0, Z)
    }
    getLogoutUri(A) {
      if (!A) throw hG(oe);
      let Q = this.createLogoutUrlQueryString(A);
      return w8.appendQueryString(this.authority.endSessionEndpoint, Q)
    }
    async executeTokenRequest(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.AuthClientExecuteTokenRequest, Q.correlationId);
      let B = this.createTokenQueryParameters(Q),
        G = w8.appendQueryString(A.tokenEndpoint, B),
        Z = await _5(this.createTokenRequestBody.bind(this), Z0.AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, Q.correlationId)(Q),
        I = void 0;
      if (Q.clientInfo) try {
        let W = TZA(Q.clientInfo, this.cryptoUtils.base64Decode);
        I = {
          credential: `${W.uid}${yf.CLIENT_INFO_SEPARATOR}${W.utid}`,
          type: zE.HOME_ACCOUNT_ID
        }
      } catch (W) {
        this.logger.verbose("Could not parse client info for CCS Header: " + W)
      }
      let Y = this.createTokenRequestHeaders(I || Q.ccsCredential),
        J = hZA(this.config.authOptions.clientId, Q);
      return _5(this.executePostToTokenEndpoint.bind(this), Z0.AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, Q.correlationId)(G, Z, Y, J, Q.correlationId, Z0.AuthorizationCodeClientExecutePostToTokenEndpoint)
    }
    async createTokenRequestBody(A) {
      this.performanceClient?.addQueueMeasurement(Z0.AuthClientCreateTokenRequestBody, A.correlationId);
      let Q = new Map;
      if (YAA(Q, A.embeddedClientId || A.tokenBodyParameters?.[Dk] || this.config.authOptions.clientId), !this.includeRedirectUri) {
        if (!A.redirectUri) throw hG(ie)
      } else JAA(Q, A.redirectUri);
      if (IAA(Q, A.scopes, !0, this.oidcDefaultScopes), Xs1(Q, A.code), pqA(Q, this.config.libraryInfo), lqA(Q, this.config.telemetry.application), QNA(Q), this.serverTelemetryManager && !_A1(this.config)) ANA(Q, this.serverTelemetryManager);
      if (A.codeVerifier) Fs1(Q, A.codeVerifier);
      if (this.config.clientCredentials.clientSecret) nqA(Q, this.config.clientCredentials.clientSecret);
      if (this.config.clientCredentials.clientAssertion) {
        let G = this.config.clientCredentials.clientAssertion;
        aqA(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), sqA(Q, G.assertionType)
      }
      if (rqA(Q, OU.AUTHORIZATION_CODE_GRANT), VAA(Q), A.authenticationScheme === A5.POP) {
        let G = new FAA(this.cryptoUtils, this.performanceClient),
          Z;
        if (!A.popKid) Z = (await _5(G.generateCnf.bind(G), Z0.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
        else Z = this.cryptoUtils.encodeKid(A.popKid);
        tqA(Q, Z)
      } else if (A.authenticationScheme === A5.SSH)
        if (A.sshJwk) eqA(Q, A.sshJwk);
        else throw hG(gf);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) WAA(Q, A.claims, this.config.authOptions.clientCapabilities);
      let B = void 0;
      if (A.clientInfo) try {
        let G = TZA(A.clientInfo, this.cryptoUtils.base64Decode);
        B = {
          credential: `${G.uid}${yf.CLIENT_INFO_SEPARATOR}${G.utid}`,
          type: zE.HOME_ACCOUNT_ID
        }
      } catch (G) {
        this.logger.verbose("Could not parse client info for CCS Header: " + G)
      } else B = A.ccsCredential;
      if (this.config.systemOptions.preventCorsPreflight && B) switch (B.type) {
        case zE.HOME_ACCOUNT_ID:
          try {
            let G = Fk(B.credential);
            df(Q, G)
          } catch (G) {
            this.logger.verbose("Could not parse home account ID for CCS Header: " + G)
          }
          break;
        case zE.UPN:
          Dl(Q, B.credential);
          break
      }
      if (A.embeddedClientId) pf(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
      if (A.tokenBodyParameters) cf(Q, A.tokenBodyParameters);
      if (A.enableSpaAuthorizationCode && (!A.tokenBodyParameters || !A.tokenBodyParameters[bA1])) cf(Q, {
        [bA1]: "1"
      });
      return ZAA(Q, A.correlationId, this.performanceClient), Kk(Q)
    }
    createLogoutUrlQueryString(A) {
      let Q = new Map;
      if (A.postLogoutRedirectUri) Zs1(Q, A.postLogoutRedirectUri);
      if (A.correlationId) XAA(Q, A.correlationId);
      if (A.idTokenHint) Is1(Q, A.idTokenHint);
      if (A.state) iqA(Q, A.state);
      if (A.logoutHint) Ks1(Q, A.logoutHint);
      if (A.extraQueryParameters) cf(Q, A.extraQueryParameters);
      if (this.config.authOptions.instanceAware) oqA(Q);
      return Kk(Q, this.config.authOptions.encodeExtraQueryParams, A.extraQueryParameters)
    }
  }
})
// @from(Start 8085157, End 8085166)
Ua6 = 300
// @from(Start 8085170, End 8085173)
gZA
// @from(Start 8085179, End 8092148)
daB = L(() => {
  kA1();
  INA();
  xZA();
  QAA();
  mZ();
  kZA();
  XNA();
  Q11();
  Fl();
  Vl();
  dX();
  fZA();
  Hl();
  Kl();
  dqA();
  PZA();
  WNA();
  uT();
  lf();
  B11();
  iA1();
  rA1();
  uf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  gZA = class gZA extends sH {
    constructor(A, Q) {
      super(A, Q)
    }
    async acquireToken(A) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientAcquireToken, A.correlationId);
      let Q = Jq(),
        B = await _5(this.executeTokenRequest.bind(this), Z0.RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(A, this.authority),
        G = B.headers?.[uZ.X_MS_REQUEST_ID],
        Z = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Z.validateTokenResponse(B.body), _5(Z.handleServerTokenResponse.bind(Z), Z0.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(B.body, this.authority, Q, A, void 0, void 0, !0, A.forceCache, G)
    }
    async acquireTokenByRefreshToken(A) {
      if (!A) throw hG(re);
      if (this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientAcquireTokenByRefreshToken, A.correlationId), !A.account) throw b0(vf);
      if (this.cacheManager.isAppMetadataFOCI(A.account.environment)) try {
        return await _5(this.acquireTokenWithCachedRefreshToken.bind(this), Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !0)
      } catch (B) {
        let G = B instanceof Wq && B.errorCode === Cl,
          Z = B instanceof $E && B.errorCode === JqA.INVALID_GRANT_ERROR && B.subError === JqA.CLIENT_MISMATCH_ERROR;
        if (G || Z) return _5(this.acquireTokenWithCachedRefreshToken.bind(this), Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1);
        else throw B
      }
      return _5(this.acquireTokenWithCachedRefreshToken.bind(this), Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1)
    }
    async acquireTokenWithCachedRefreshToken(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, A.correlationId);
      let B = yaB(this.cacheManager.getRefreshToken.bind(this.cacheManager), Z0.CacheManagerGetRefreshToken, this.logger, this.performanceClient, A.correlationId)(A.account, Q, A.correlationId, void 0, this.performanceClient);
      if (!B) throw eA1(Cl);
      if (B.expiresOn && vZA(B.expiresOn, A.refreshTokenExpirationOffsetSeconds || Ua6)) throw this.performanceClient?.addFields({
        rtExpiresOnMs: Number(B.expiresOn)
      }, A.correlationId), eA1(JNA);
      let G = {
        ...A,
        refreshToken: B.secret,
        authenticationScheme: A.authenticationScheme || A5.BEARER,
        ccsCredential: {
          credential: A.account.homeAccountId,
          type: zE.HOME_ACCOUNT_ID
        }
      };
      try {
        return await _5(this.acquireToken.bind(this), Z0.RefreshTokenClientAcquireToken, this.logger, this.performanceClient, A.correlationId)(G)
      } catch (Z) {
        if (Z instanceof Wq) {
          if (this.performanceClient?.addFields({
              rtExpiresOnMs: Number(B.expiresOn)
            }, A.correlationId), Z.subError === El) {
            this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");
            let I = this.cacheManager.generateCredentialKey(B);
            this.cacheManager.removeRefreshToken(I, A.correlationId)
          }
        }
        throw Z
      }
    }
    async executeTokenRequest(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientExecuteTokenRequest, A.correlationId);
      let B = this.createTokenQueryParameters(A),
        G = w8.appendQueryString(Q.tokenEndpoint, B),
        Z = await _5(this.createTokenRequestBody.bind(this), Z0.RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, A.correlationId)(A),
        I = this.createTokenRequestHeaders(A.ccsCredential),
        Y = hZA(this.config.authOptions.clientId, A);
      return _5(this.executePostToTokenEndpoint.bind(this), Z0.RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, A.correlationId)(G, Z, I, Y, A.correlationId, Z0.RefreshTokenClientExecutePostToTokenEndpoint)
    }
    async createTokenRequestBody(A) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientCreateTokenRequestBody, A.correlationId);
      let Q = new Map;
      if (YAA(Q, A.embeddedClientId || A.tokenBodyParameters?.[Dk] || this.config.authOptions.clientId), A.redirectUri) JAA(Q, A.redirectUri);
      if (IAA(Q, A.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), rqA(Q, OU.REFRESH_TOKEN_GRANT), VAA(Q), pqA(Q, this.config.libraryInfo), lqA(Q, this.config.telemetry.application), QNA(Q), this.serverTelemetryManager && !_A1(this.config)) ANA(Q, this.serverTelemetryManager);
      if (Vs1(Q, A.refreshToken), this.config.clientCredentials.clientSecret) nqA(Q, this.config.clientCredentials.clientSecret);
      if (this.config.clientCredentials.clientAssertion) {
        let B = this.config.clientCredentials.clientAssertion;
        aqA(Q, await wE(B.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), sqA(Q, B.assertionType)
      }
      if (A.authenticationScheme === A5.POP) {
        let B = new FAA(this.cryptoUtils, this.performanceClient),
          G;
        if (!A.popKid) G = (await _5(B.generateCnf.bind(B), Z0.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
        else G = this.cryptoUtils.encodeKid(A.popKid);
        tqA(Q, G)
      } else if (A.authenticationScheme === A5.SSH)
        if (A.sshJwk) eqA(Q, A.sshJwk);
        else throw hG(gf);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) WAA(Q, A.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && A.ccsCredential) switch (A.ccsCredential.type) {
        case zE.HOME_ACCOUNT_ID:
          try {
            let B = Fk(A.ccsCredential.credential);
            df(Q, B)
          } catch (B) {
            this.logger.verbose("Could not parse home account ID for CCS Header: " + B)
          }
          break;
        case zE.UPN:
          Dl(Q, A.ccsCredential.credential);
          break
      }
      if (A.embeddedClientId) pf(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
      if (A.tokenBodyParameters) cf(Q, A.tokenBodyParameters);
      return ZAA(Q, A.correlationId, this.performanceClient), Kk(Q)
    }
  }
})
// @from(Start 8092154, End 8092157)
Z11
// @from(Start 8092163, End 8094872)
caB = L(() => {
  INA();
  Hl();
  dX();
  XNA();
  mZ();
  Fl();
  jZA();
  uT();
  lf();
  pA1();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  Z11 = class Z11 extends sH {
    constructor(A, Q) {
      super(A, Q)
    }
    async acquireCachedToken(A) {
      this.performanceClient?.addQueueMeasurement(Z0.SilentFlowClientAcquireCachedToken, A.correlationId);
      let Q = FZ.NOT_APPLICABLE;
      if (A.forceRefresh || !this.config.cacheOptions.claimsBasedCachingEnabled && !KZ.isEmptyObj(A.claims)) throw this.setCacheOutcome(FZ.FORCE_REFRESH_OR_CLAIMS, A.correlationId), b0(ff);
      if (!A.account) throw b0(vf);
      let B = A.account.tenantId || vaB(A.authority),
        G = this.cacheManager.getTokenKeys(),
        Z = this.cacheManager.getAccessToken(A.account, A, G, B);
      if (!Z) throw this.setCacheOutcome(FZ.NO_CACHED_ACCESS_TOKEN, A.correlationId), b0(ff);
      else if (Ds1(Z.cachedAt) || vZA(Z.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.setCacheOutcome(FZ.CACHED_ACCESS_TOKEN_EXPIRED, A.correlationId), b0(ff);
      else if (Z.refreshOn && vZA(Z.refreshOn, 0)) Q = FZ.PROACTIVELY_REFRESHED;
      let I = A.authority || this.authority.getPreferredCache(),
        Y = {
          account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(A.account), A.correlationId),
          accessToken: Z,
          idToken: this.cacheManager.getIdToken(A.account, A.correlationId, G, B, this.performanceClient),
          refreshToken: null,
          appMetadata: this.cacheManager.readAppMetadataFromCache(I)
        };
      if (this.setCacheOutcome(Q, A.correlationId), this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
      return [await _5(this.generateResultFromCacheRecord.bind(this), Z0.SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, A.correlationId)(Y, A), Q]
    }
    setCacheOutcome(A, Q) {
      if (this.serverTelemetryManager?.setCacheOutcome(A), this.performanceClient?.addFields({
          cacheOutcome: A
        }, Q), A !== FZ.NOT_APPLICABLE) this.logger.info(`Token refresh is required due to cache outcome: ${A}`)
    }
    async generateResultFromCacheRecord(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.SilentFlowClientGenerateResultFromCacheRecord, Q.correlationId);
      let B;
      if (A.idToken) B = mf(A.idToken.secret, this.config.cryptoInterface.base64Decode);
      if (Q.maxAge || Q.maxAge === 0) {
        let G = B?.auth_time;
        if (!G) throw b0(xf);
        gqA(G, Q.maxAge)
      }
      return _J.generateAuthenticationResult(this.cryptoUtils, this.authority, A, !0, Q, B)
    }
  }
})
// @from(Start 8094878, End 8094886)
VNA = {}
// @from(Start 8095070, End 8098229)
function $a6(A, Q, B, G) {
  let Z = Q.correlationId,
    I = new Map;
  YAA(I, Q.embeddedClientId || Q.extraQueryParameters?.[Dk] || A.clientId);
  let Y = [...Q.scopes || [], ...Q.extraScopesToConsent || []];
  if (IAA(I, Y, !0, A.authority.options.OIDCOptions?.defaultScopes), JAA(I, Q.redirectUri), XAA(I, Z), Gs1(I, Q.responseMode), VAA(I), Q.prompt) Js1(I, Q.prompt), G?.addFields({
    prompt: Q.prompt
  }, Z);
  if (Q.domainHint) Ys1(I, Q.domainHint), G?.addFields({
    domainHintFromRequest: !0
  }, Z);
  if (Q.prompt !== Al.SELECT_ACCOUNT) {
    if (Q.sid && Q.prompt === Al.NONE) B.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"), hA1(I, Q.sid), G?.addFields({
      sidFromRequest: !0
    }, Z);
    else if (Q.account) {
      let J = La6(Q.account),
        W = Ma6(Q.account);
      if (W && Q.domainHint) B.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'), W = null;
      if (W) {
        B.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"), yZA(I, W), G?.addFields({
          loginHintFromClaim: !0
        }, Z);
        try {
          let X = Fk(Q.account.homeAccountId);
          df(I, X)
        } catch (X) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      } else if (J && Q.prompt === Al.NONE) {
        B.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"), hA1(I, J), G?.addFields({
          sidFromClaim: !0
        }, Z);
        try {
          let X = Fk(Q.account.homeAccountId);
          df(I, X)
        } catch (X) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      } else if (Q.loginHint) B.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"), yZA(I, Q.loginHint), Dl(I, Q.loginHint), G?.addFields({
        loginHintFromRequest: !0
      }, Z);
      else if (Q.account.username) {
        B.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"), yZA(I, Q.account.username), G?.addFields({
          loginHintFromUpn: !0
        }, Z);
        try {
          let X = Fk(Q.account.homeAccountId);
          df(I, X)
        } catch (X) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      }
    } else if (Q.loginHint) B.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"), yZA(I, Q.loginHint), Dl(I, Q.loginHint), G?.addFields({
      loginHintFromRequest: !0
    }, Z)
  } else B.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");
  if (Q.nonce) Ws1(I, Q.nonce);
  if (Q.state) iqA(I, Q.state);
  if (Q.claims || A.clientCapabilities && A.clientCapabilities.length > 0) WAA(I, Q.claims, A.clientCapabilities);
  if (Q.embeddedClientId) pf(I, A.clientId, A.redirectUri);
  if (A.instanceAware && (!Q.extraQueryParameters || !Object.keys(Q.extraQueryParameters).includes(_ZA))) oqA(I);
  return I
}
// @from(Start 8098231, End 8098340)
function wa6(A, Q, B, G) {
  let Z = Kk(Q, B, G);
  return w8.appendQueryString(A.authorizationEndpoint, Z)
}
// @from(Start 8098342, End 8098415)
function qa6(A, Q) {
  if (paB(A, Q), !A.code) throw b0(ce);
  return A
}
// @from(Start 8098417, End 8099084)
function paB(A, Q) {
  if (!A.state || !Q) throw A.state ? b0(Zl, "Cached State") : b0(Zl, "Server State");
  let B, G;
  try {
    B = decodeURIComponent(A.state)
  } catch (Z) {
    throw b0(gT, A.state)
  }
  try {
    G = decodeURIComponent(Q)
  } catch (Z) {
    throw b0(gT, A.state)
  }
  if (B !== G) throw b0(xe);
  if (A.error || A.error_description || A.suberror) {
    let Z = Na6(A);
    if (tA1(A.error, A.error_description, A.suberror)) throw new Wq(A.error || "", A.error_description, A.suberror, A.timestamp || "", A.trace_id || "", A.correlation_id || "", A.claims || "", Z);
    throw new $E(A.error || "", A.error_description, A.suberror, Z)
  }
}
// @from(Start 8099086, End 8099212)
function Na6(A) {
  let B = A.error_uri?.lastIndexOf("code=");
  return B && B >= 0 ? A.error_uri?.substring(B + 5) : void 0
}
// @from(Start 8099214, End 8099271)
function La6(A) {
  return A.idTokenClaims?.sid || null
}
// @from(Start 8099273, End 8099352)
function Ma6(A) {
  return A.loginHint || A.idTokenClaims?.login_hint || null
}
// @from(Start 8099357, End 8099507)
laB = L(() => {
  xZA();
  kZA();
  mZ();
  PZA();
  QAA();
  Kl();
  dX();
  WNA();
  fZA();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8099510, End 8100029)
function Oa6(A) {
  let {
    skus: Q,
    libraryName: B,
    libraryVersion: G,
    extensionName: Z,
    extensionVersion: I
  } = A, Y = new Map([
    [0, [B, G]],
    [2, [Z, I]]
  ]), J = [];
  if (Q?.length) {
    if (J = Q.split(iaB), J.length < 4) return Q
  } else J = Array.from({
    length: 4
  }, () => naB);
  return Y.forEach((W, X) => {
    if (W.length === 2 && W[0]?.length && W[1]?.length) Ra6({
      skuArr: J,
      index: X,
      skuName: W[0],
      skuVersion: W[1]
    })
  }), J.join(iaB)
}
// @from(Start 8100031, End 8100185)
function Ra6(A) {
  let {
    skuArr: Q,
    index: B,
    skuName: G,
    skuVersion: Z
  } = A;
  if (B >= Q.length) return;
  Q[B] = [G, Z].join(naB)
}
// @from(Start 8100186, End 8104272)
class zl {
  constructor(A, Q) {
    this.cacheOutcome = FZ.NOT_APPLICABLE, this.cacheManager = Q, this.apiId = A.apiId, this.correlationId = A.correlationId, this.wrapperSKU = A.wrapperSKU || L0.EMPTY_STRING, this.wrapperVer = A.wrapperVer || L0.EMPTY_STRING, this.telemetryCacheKey = _V.CACHE_KEY + yf.CACHE_KEY_SEPARATOR + A.clientId
  }
  generateCurrentRequestHeaderValue() {
    let A = `${this.apiId}${_V.VALUE_SEPARATOR}${this.cacheOutcome}`,
      Q = [this.wrapperSKU, this.wrapperVer],
      B = this.getNativeBrokerErrorCode();
    if (B?.length) Q.push(`broker_error=${B}`);
    let G = Q.join(_V.VALUE_SEPARATOR),
      Z = this.getRegionDiscoveryFields(),
      I = [A, Z].join(_V.VALUE_SEPARATOR);
    return [_V.SCHEMA_VERSION, I, G].join(_V.CATEGORY_SEPARATOR)
  }
  generateLastRequestHeaderValue() {
    let A = this.getLastRequests(),
      Q = zl.maxErrorsToSend(A),
      B = A.failedRequests.slice(0, 2 * Q).join(_V.VALUE_SEPARATOR),
      G = A.errors.slice(0, Q).join(_V.VALUE_SEPARATOR),
      Z = A.errors.length,
      I = Q < Z ? _V.OVERFLOW_TRUE : _V.OVERFLOW_FALSE,
      Y = [Z, I].join(_V.VALUE_SEPARATOR);
    return [_V.SCHEMA_VERSION, A.cacheHits, B, G, Y].join(_V.CATEGORY_SEPARATOR)
  }
  cacheFailedRequest(A) {
    let Q = this.getLastRequests();
    if (Q.errors.length >= _V.MAX_CACHED_ERRORS) Q.failedRequests.shift(), Q.failedRequests.shift(), Q.errors.shift();
    if (Q.failedRequests.push(this.apiId, this.correlationId), A instanceof Error && !!A && A.toString())
      if (A instanceof t4)
        if (A.subError) Q.errors.push(A.subError);
        else if (A.errorCode) Q.errors.push(A.errorCode);
    else Q.errors.push(A.toString());
    else Q.errors.push(A.toString());
    else Q.errors.push(_V.UNKNOWN_ERROR);
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
      Q = zl.maxErrorsToSend(A),
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
      let I = A.failedRequests[2 * Q] || L0.EMPTY_STRING,
        Y = A.failedRequests[2 * Q + 1] || L0.EMPTY_STRING,
        J = A.errors[Q] || L0.EMPTY_STRING;
      if (G += I.toString().length + Y.toString().length + J.length + 3, G < _V.MAX_LAST_HEADER_BYTES) B += 1;
      else break
    }
    return B
  }
  getRegionDiscoveryFields() {
    let A = [];
    return A.push(this.regionUsed || L0.EMPTY_STRING), A.push(this.regionSource || L0.EMPTY_STRING), A.push(this.regionOutcome || L0.EMPTY_STRING), A.join(",")
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
    return Oa6(A)
  }
}
// @from(Start 8104277, End 8104286)
iaB = ","
// @from(Start 8104290, End 8104299)
naB = "|"
// @from(Start 8104305, End 8104385)
aaB = L(() => {
  mZ();
  PM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8104391, End 8104778)
p7 = L(() => {
  maB();
  daB();
  caB();
  INA();
  dqA();
  pA1();
  LA1();
  hqA();
  Ea1();
  TA1();
  Kl();
  Za1();
  laB();
  xZA();
  XNA();
  bqA();
  wA1();
  WNA();
  rA1();
  PM();
  Aa1();
  fZA();
  dX();
  SW();
  Vl();
  uf();
  mZ();
  Fl();
  aaB();
  jZA();
  $s1();
  dA1();
  Hl();
  QAA();
  kZA();
  Ms1();
  B11(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8104780, End 8108142)
class Ul {
  static deserializeJSONBlob(A) {
    return !A ? {} : JSON.parse(A)
  }
  static deserializeAccounts(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
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
          tenantProfiles: G.tenantProfiles?.map((Y) => {
            return JSON.parse(Y)
          }),
          lastUpdatedAt: Date.now().toString()
        },
        I = new cX;
      BAA.toObject(I, Z), Q[B] = I
    });
    return Q
  }
  static deserializeIdTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
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
    if (A) Object.keys(A).map(function(B) {
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
    if (A) Object.keys(A).map(function(B) {
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
    if (A) Object.keys(A).map(function(B) {
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
// @from(Start 8108147, End 8108215)
I11 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8108221, End 8108229)
Os1 = {}
// @from(Start 8108298, End 8108376)
saB = L(() => {
  EA1();
  I11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8108382, End 8108422)
raB = "system_assigned_managed_identity"
// @from(Start 8108426, End 8108450)
ya6 = "managed_identity"
// @from(Start 8108454, End 8108457)
Rs1
// @from(Start 8108459, End 8108461)
TU
// @from(Start 8108463, End 8108465)
pX
// @from(Start 8108467, End 8108469)
C4
// @from(Start 8108471, End 8108473)
S4
// @from(Start 8108475, End 8108477)
iY
// @from(Start 8108479, End 8108481)
zI
// @from(Start 8108483, End 8108486)
Y11
// @from(Start 8108488, End 8108507)
oaB = "REGION_NAME"
// @from(Start 8108511, End 8108536)
taB = "MSAL_FORCE_REGION"
// @from(Start 8108540, End 8108548)
eaB = 32
// @from(Start 8108552, End 8108555)
AsB
// @from(Start 8108557, End 8108560)
J11
// @from(Start 8108562, End 8108565)
Ts1
// @from(Start 8108567, End 8108569)
qE
// @from(Start 8108571, End 8108573)
af
// @from(Start 8108575, End 8108577)
_M
// @from(Start 8108579, End 8108582)
W11
// @from(Start 8108584, End 8108594)
QsB = 4096
// @from(Start 8108600, End 8111030)
UI = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Rs1 = `https://login.microsoftonline.com/${ya6}/`, TU = {
    AUTHORIZATION_HEADER_NAME: "Authorization",
    METADATA_HEADER_NAME: "Metadata",
    APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
    ML_AND_SF_SECRET_HEADER_NAME: "secret"
  }, pX = {
    API_VERSION: "api-version",
    RESOURCE: "resource",
    SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
    XMS_CC: "xms_cc"
  }, C4 = {
    AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
    DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
    IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
    IDENTITY_HEADER: "IDENTITY_HEADER",
    IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
    IMDS_ENDPOINT: "IMDS_ENDPOINT",
    MSI_ENDPOINT: "MSI_ENDPOINT",
    MSI_SECRET: "MSI_SECRET"
  }, S4 = {
    APP_SERVICE: "AppService",
    AZURE_ARC: "AzureArc",
    CLOUD_SHELL: "CloudShell",
    DEFAULT_TO_IMDS: "DefaultToImds",
    IMDS: "Imds",
    MACHINE_LEARNING: "MachineLearning",
    SERVICE_FABRIC: "ServiceFabric"
  }, iY = {
    SYSTEM_ASSIGNED: "system-assigned",
    USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
    USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
    USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
  }, zI = {
    GET: "get",
    POST: "post"
  }, Y11 = {
    SUCCESS_RANGE_START: o4.SUCCESS_RANGE_START,
    SUCCESS_RANGE_END: o4.SUCCESS_RANGE_END,
    SERVER_ERROR: o4.SERVER_ERROR
  }, AsB = {
    SHA256: "sha256"
  }, J11 = {
    CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  }, Ts1 = {
    KEY_SEPARATOR: "-"
  }, qE = {
    MSAL_SKU: "msal.js.node",
    JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    AUTHORIZATION_PENDING: "authorization_pending",
    HTTP_PROTOCOL: "http://",
    LOCALHOST: "localhost"
  }, af = {
    acquireTokenSilent: 62,
    acquireTokenByUsernamePassword: 371,
    acquireTokenByDeviceCode: 671,
    acquireTokenByClientCredential: 771,
    acquireTokenByCode: 871,
    acquireTokenByRefreshToken: 872
  }, _M = {
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
  }, W11 = {
    INTERVAL_MS: 100,
    TIMEOUT_MS: 5000
  }
})
// @from(Start 8111032, End 8111651)
class FNA {
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
// @from(Start 8111656, End 8111718)
BsB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8111769, End 8112259)
class KNA {
  constructor(A, Q) {
    this.proxyUrl = A || "", this.customAgentOptions = Q || {}
  }
  async sendGetRequestAsync(A, Q, B) {
    if (this.proxyUrl) return ZsB(A, this.proxyUrl, zI.GET, Q, this.customAgentOptions, B);
    else return IsB(A, zI.GET, Q, this.customAgentOptions, B)
  }
  async sendPostRequestAsync(A, Q) {
    if (this.proxyUrl) return ZsB(A, this.proxyUrl, zI.POST, Q, this.customAgentOptions);
    else return IsB(A, zI.POST, Q, this.customAgentOptions)
  }
}
// @from(Start 8112264, End 8114503)
ZsB = (A, Q, B, G, Z, I) => {
    let Y = new URL(A),
      J = new URL(Q),
      W = G?.headers || {},
      X = {
        host: J.hostname,
        port: J.port,
        method: "CONNECT",
        path: Y.hostname,
        headers: W
      };
    if (Z && Object.keys(Z).length) X.agent = new Ps1.Agent(Z);
    let V = "";
    if (B === zI.POST) {
      let K = G?.body || "";
      V = `Content-Type: application/x-www-form-urlencoded\r
Content-Length: ${K.length}\r
\r
${K}`
    } else if (I) X.timeout = I;
    let F = `${B.toUpperCase()} ${Y.href} HTTP/1.1\r
Host: ${Y.host}\r
Connection: close\r
` + V + `\r
`;
    return new Promise((K, D) => {
      let H = Ps1.request(X);
      if (I) H.on("timeout", () => {
        H.destroy(), D(Error("Request time out"))
      });
      H.end(), H.on("connect", (C, E) => {
        let U = C?.statusCode || Y11.SERVER_ERROR;
        if (U < Y11.SUCCESS_RANGE_START || U > Y11.SUCCESS_RANGE_END) H.destroy(), E.destroy(), D(Error(`Error connecting to proxy. Http status code: ${C.statusCode}. Http status message: ${C?.statusMessage||"Unknown"}`));
        E.write(F);
        let q = [];
        E.on("data", (w) => {
          q.push(w)
        }), E.on("end", () => {
          let N = Buffer.concat([...q]).toString().split(`\r
`),
            R = parseInt(N[0].split(" ")[1]),
            T = N[0].split(" ").slice(2).join(" "),
            y = N[N.length - 1],
            v = N.slice(1, N.length - 2),
            x = new Map;
          v.forEach((l) => {
            let k = l.split(new RegExp(/:\s(.*)/s)),
              m = k[0],
              o = k[1];
            try {
              let IA = JSON.parse(o);
              if (IA && typeof IA === "object") o = IA
            } catch (IA) {}
            x.set(m, o)
          });
          let u = Object.fromEntries(x),
            e = FNA.getNetworkResponse(u, YsB(R, T, u, y), R);
          if ((R < o4.SUCCESS_RANGE_START || R > o4.SUCCESS_RANGE_END) && e.body.error !== qE.AUTHORIZATION_PENDING) H.destroy();
          K(e)
        }), E.on("error", (w) => {
          H.destroy(), E.destroy(), D(Error(w.toString()))
        })
      }), H.on("error", (C) => {
        H.destroy(), D(Error(C.toString()))
      })
    })
  }
// @from(Start 8114507, End 8115786)
IsB = (A, Q, B, G, Z) => {
    let I = Q === zI.POST,
      Y = B?.body || "",
      J = new URL(A),
      W = B?.headers || {},
      X = {
        method: Q,
        headers: W,
        ...FNA.urlToHttpOptions(J)
      };
    if (G && Object.keys(G).length) X.agent = new GsB.Agent(G);
    if (I) X.headers = {
      ...X.headers,
      "Content-Length": Y.length
    };
    else if (Z) X.timeout = Z;
    return new Promise((V, F) => {
      let K;
      if (X.protocol === "http:") K = Ps1.request(X);
      else K = GsB.request(X);
      if (I) K.write(Y);
      if (Z) K.on("timeout", () => {
        K.destroy(), F(Error("Request time out"))
      });
      K.end(), K.on("response", (D) => {
        let {
          headers: H,
          statusCode: C,
          statusMessage: E
        } = D, U = [];
        D.on("data", (q) => {
          U.push(q)
        }), D.on("end", () => {
          let q = Buffer.concat([...U]).toString(),
            w = H,
            N = FNA.getNetworkResponse(w, YsB(C, E, w, q), C);
          if ((C < o4.SUCCESS_RANGE_START || C > o4.SUCCESS_RANGE_END) && N.body.error !== qE.AUTHORIZATION_PENDING) K.destroy();
          V(N)
        })
      }), K.on("error", (D) => {
        K.destroy(), F(Error(D.toString()))
      })
    })
  }
// @from(Start 8115790, End 8116375)
YsB = (A, Q, B, G) => {
    let Z;
    try {
      Z = JSON.parse(G)
    } catch (I) {
      let Y, J;
      if (A >= o4.CLIENT_ERROR_RANGE_START && A <= o4.CLIENT_ERROR_RANGE_END) Y = "client_error", J = "A client";
      else if (A >= o4.SERVER_ERROR_RANGE_START && A <= o4.SERVER_ERROR_RANGE_END) Y = "server_error", J = "A server";
      else Y = "unknown_error", J = "An unknown";
      Z = {
        error: Y,
        error_description: `${J} error occured.
Http status code: ${A}
Http status message: ${Q||"Unknown"}
Headers: ${JSON.stringify(B)}`
      }
    }
    return Z
  }
// @from(Start 8116381, End 8116466)
JsB = L(() => {
  p7();
  UI();
  BsB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8116472, End 8116502)
X11 = "invalid_file_extension"
// @from(Start 8116506, End 8116531)
V11 = "invalid_file_path"
// @from(Start 8116535, End 8116574)
$l = "invalid_managed_identity_id_type"
// @from(Start 8116578, End 8116600)
F11 = "invalid_secret"
// @from(Start 8116604, End 8116629)
WsB = "missing_client_id"
// @from(Start 8116633, End 8116660)
XsB = "network_unavailable"
// @from(Start 8116664, End 8116694)
K11 = "platform_not_supported"
// @from(Start 8116698, End 8116732)
D11 = "unable_to_create_azure_arc"
// @from(Start 8116736, End 8116772)
H11 = "unable_to_create_cloud_shell"
// @from(Start 8116776, End 8116807)
C11 = "unable_to_create_source"
// @from(Start 8116811, End 8116845)
DNA = "unable_to_read_secret_file"
// @from(Start 8116849, End 8116895)
VsB = "user_assigned_not_available_at_runtime"
// @from(Start 8116899, End 8116938)
E11 = "www_authenticate_header_missing"
// @from(Start 8116942, End 8116992)
z11 = "www_authenticate_header_unsupported_format"
// @from(Start 8116996, End 8116999)
KAA
// @from(Start 8117005, End 8117352)
DAA = L(() => {
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  KAA = {
    [C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
    [C4.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
    [C4.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
    [C4.MSI_ENDPOINT]: "msi_endpoint_url_malformed"
  }
})
// @from(Start 8117355, End 8117393)
function _W(A) {
  return new js1(A)
}
// @from(Start 8117398, End 8117401)
xa6
// @from(Start 8117403, End 8117406)
js1
// @from(Start 8117412, End 8119440)
uZA = L(() => {
  p7();
  DAA();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  xa6 = {
    [X11]: "The file path in the WWW-Authenticate header does not contain a .key file.",
    [V11]: "The file path in the WWW-Authenticate header is not in a valid Windows or Linux Format.",
    [$l]: "More than one ManagedIdentityIdType was provided.",
    [F11]: "The secret in the file on the file path in the WWW-Authenticate header is greater than 4096 bytes.",
    [K11]: "The platform is not supported by Azure Arc. Azure Arc only supports Windows and Linux.",
    [WsB]: "A ManagedIdentityId id was not provided.",
    [KAA.AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${C4.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
    [KAA.IDENTITY_ENDPOINT]: `The Managed Identity's '${C4.IDENTITY_ENDPOINT}' environment variable is malformed.`,
    [KAA.IMDS_ENDPOINT]: `The Managed Identity's '${C4.IMDS_ENDPOINT}' environment variable is malformed.`,
    [KAA.MSI_ENDPOINT]: `The Managed Identity's '${C4.MSI_ENDPOINT}' environment variable is malformed.`,
    [XsB]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
    [D11]: "Azure Arc Managed Identities can only be system assigned.",
    [H11]: "Cloud Shell Managed Identities can only be system assigned.",
    [C11]: "Unable to create a Managed Identity source based on environment variables.",
    [DNA]: "Unable to read the secret file.",
    [VsB]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
    [E11]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
    [z11]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format."
  };
  js1 = class js1 extends t4 {
    constructor(A) {
      super(A, xa6[A]);
      this.name = "ManagedIdentityError", Object.setPrototypeOf(this, js1.prototype)
    }
  }
})
// @from(Start 8119442, End 8120137)
class Ss1 {
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
      if (B || G) throw _W($l);
      this.id = Q, this.idType = iY.USER_ASSIGNED_CLIENT_ID
    } else if (B) {
      if (Q || G) throw _W($l);
      this.id = B, this.idType = iY.USER_ASSIGNED_RESOURCE_ID
    } else if (G) {
      if (Q || B) throw _W($l);
      this.id = G, this.idType = iY.USER_ASSIGNED_OBJECT_ID
    } else this.id = raB, this.idType = iY.SYSTEM_ASSIGNED
  }
}
// @from(Start 8120142, End 8120228)
FsB = L(() => {
  uZA();
  UI();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8120234, End 8120236)
lX
// @from(Start 8120238, End 8120240)
WY
// @from(Start 8120246, End 8123177)
HNA = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  lX = {
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
  WY = class WY extends t4 {
    constructor(A, Q) {
      super(A, Q);
      this.name = "NodeAuthError"
    }
    static createInvalidLoopbackAddressTypeError() {
      return new WY(lX.invalidLoopbackAddressType.code, `${lX.invalidLoopbackAddressType.desc}`)
    }
    static createUnableToLoadRedirectUrlError() {
      return new WY(lX.unableToLoadRedirectUri.code, `${lX.unableToLoadRedirectUri.desc}`)
    }
    static createNoAuthCodeInResponseError() {
      return new WY(lX.noAuthCodeInResponse.code, `${lX.noAuthCodeInResponse.desc}`)
    }
    static createNoLoopbackServerExistsError() {
      return new WY(lX.noLoopbackServerExists.code, `${lX.noLoopbackServerExists.desc}`)
    }
    static createLoopbackServerAlreadyExistsError() {
      return new WY(lX.loopbackServerAlreadyExists.code, `${lX.loopbackServerAlreadyExists.desc}`)
    }
    static createLoopbackServerTimeoutError() {
      return new WY(lX.loopbackServerTimeout.code, `${lX.loopbackServerTimeout.desc}`)
    }
    static createStateNotFoundError() {
      return new WY(lX.stateNotFoundError.code, lX.stateNotFoundError.desc)
    }
    static createThumbprintMissingError() {
      return new WY(lX.thumbprintMissing.code, lX.thumbprintMissing.desc)
    }
    static createRedirectUriNotSupportedError() {
      return new WY(lX.redirectUriNotSupported.code, lX.redirectUriNotSupported.desc)
    }
  }
})
// @from(Start 8123180, End 8123832)
function KsB({
  auth: A,
  broker: Q,
  cache: B,
  system: G,
  telemetry: Z
}) {
  let I = {
    ...fa6,
    networkClient: new KNA(G?.proxyUrl, G?.customAgentOptions),
    loggerOptions: G?.loggerOptions || _s1,
    disableInternalRetries: G?.disableInternalRetries || !1
  };
  if (!!A.clientCertificate && !A.clientCertificate.thumbprint && !A.clientCertificate.thumbprintSha256) throw WY.createStateNotFoundError();
  return {
    auth: {
      ...va6,
      ...A
    },
    broker: {
      ...Q
    },
    cache: {
      ...ba6,
      ...B
    },
    system: {
      ...I,
      ...G
    },
    telemetry: {
      ...ha6,
      ...Z
    }
  }
}
// @from(Start 8123834, End 8124287)
function DsB({
  clientCapabilities: A,
  managedIdentityIdParams: Q,
  system: B
}) {
  let G = new Ss1(Q),
    Z = B?.loggerOptions || _s1,
    I;
  if (B?.networkClient) I = B.networkClient;
  else I = new KNA(B?.proxyUrl, B?.customAgentOptions);
  return {
    clientCapabilities: A || [],
    managedIdentityId: G,
    system: {
      loggerOptions: Z,
      networkClient: I
    },
    disableInternalRetries: B?.disableInternalRetries || !1
  }
}
// @from(Start 8124292, End 8124295)
va6
// @from(Start 8124297, End 8124300)
ba6
// @from(Start 8124302, End 8124305)
_s1
// @from(Start 8124307, End 8124310)
fa6
// @from(Start 8124312, End 8124315)
ha6
// @from(Start 8124321, End 8125468)
ks1 = L(() => {
  p7();
  JsB();
  FsB();
  HNA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  va6 = {
    clientId: L0.EMPTY_STRING,
    authority: L0.DEFAULT_AUTHORITY,
    clientSecret: L0.EMPTY_STRING,
    clientAssertion: L0.EMPTY_STRING,
    clientCertificate: {
      thumbprint: L0.EMPTY_STRING,
      thumbprintSha256: L0.EMPTY_STRING,
      privateKey: L0.EMPTY_STRING,
      x5c: L0.EMPTY_STRING
    },
    knownAuthorities: [],
    cloudDiscoveryMetadata: L0.EMPTY_STRING,
    authorityMetadata: L0.EMPTY_STRING,
    clientCapabilities: [],
    protocolMode: aH.AAD,
    azureCloudOptions: {
      azureCloudInstance: hf.None,
      tenant: L0.EMPTY_STRING
    },
    skipAuthorityMetadataCache: !1,
    encodeExtraQueryParams: !1
  }, ba6 = {
    claimsBasedCachingEnabled: !1
  }, _s1 = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: lY.Info
  }, fa6 = {
    loggerOptions: _s1,
    networkClient: new KNA,
    proxyUrl: L0.EMPTY_STRING,
    customAgentOptions: {},
    disableInternalRetries: !1
  }, ha6 = {
    application: {
      appName: L0.EMPTY_STRING,
      appVersion: L0.EMPTY_STRING
    }
  }
})
// @from(Start 8125474, End 8125886)
ys1 = z((HsB) => {
  Object.defineProperty(HsB, "__esModule", {
    value: !0
  });
  HsB.default = ma6;
  var ga6 = ua6(UA("crypto"));

  function ua6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var $11 = new Uint8Array(256),
    U11 = $11.length;

  function ma6() {
    if (U11 > $11.length - 16) ga6.default.randomFillSync($11), U11 = 0;
    return $11.slice(U11, U11 += 16)
  }
})
// @from(Start 8125892, End 8126153)
zsB = z((CsB) => {
  Object.defineProperty(CsB, "__esModule", {
    value: !0
  });
  CsB.default = void 0;
  var ca6 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  CsB.default = ca6
})
// @from(Start 8126159, End 8126496)
CNA = z((UsB) => {
  Object.defineProperty(UsB, "__esModule", {
    value: !0
  });
  UsB.default = void 0;
  var pa6 = la6(zsB());

  function la6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function ia6(A) {
    return typeof A === "string" && pa6.default.test(A)
  }
  var na6 = ia6;
  UsB.default = na6
})
// @from(Start 8126502, End 8127268)
ENA = z((wsB) => {
  Object.defineProperty(wsB, "__esModule", {
    value: !0
  });
  wsB.default = void 0;
  var aa6 = sa6(CNA());

  function sa6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var RD = [];
  for (let A = 0; A < 256; ++A) RD.push((A + 256).toString(16).substr(1));

  function ra6(A, Q = 0) {
    let B = (RD[A[Q + 0]] + RD[A[Q + 1]] + RD[A[Q + 2]] + RD[A[Q + 3]] + "-" + RD[A[Q + 4]] + RD[A[Q + 5]] + "-" + RD[A[Q + 6]] + RD[A[Q + 7]] + "-" + RD[A[Q + 8]] + RD[A[Q + 9]] + "-" + RD[A[Q + 10]] + RD[A[Q + 11]] + RD[A[Q + 12]] + RD[A[Q + 13]] + RD[A[Q + 14]] + RD[A[Q + 15]]).toLowerCase();
    if (!(0, aa6.default)(B)) throw TypeError("Stringified UUID is invalid");
    return B
  }
  var oa6 = ra6;
  wsB.default = oa6
})
// @from(Start 8127274, End 8128806)
RsB = z((MsB) => {
  Object.defineProperty(MsB, "__esModule", {
    value: !0
  });
  MsB.default = void 0;
  var ta6 = LsB(ys1()),
    ea6 = LsB(ENA());

  function LsB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var NsB, xs1, vs1 = 0,
    bs1 = 0;

  function As6(A, Q, B) {
    let G = Q && B || 0,
      Z = Q || Array(16);
    A = A || {};
    let I = A.node || NsB,
      Y = A.clockseq !== void 0 ? A.clockseq : xs1;
    if (I == null || Y == null) {
      let K = A.random || (A.rng || ta6.default)();
      if (I == null) I = NsB = [K[0] | 1, K[1], K[2], K[3], K[4], K[5]];
      if (Y == null) Y = xs1 = (K[6] << 8 | K[7]) & 16383
    }
    let J = A.msecs !== void 0 ? A.msecs : Date.now(),
      W = A.nsecs !== void 0 ? A.nsecs : bs1 + 1,
      X = J - vs1 + (W - bs1) / 1e4;
    if (X < 0 && A.clockseq === void 0) Y = Y + 1 & 16383;
    if ((X < 0 || J > vs1) && A.nsecs === void 0) W = 0;
    if (W >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    vs1 = J, bs1 = W, xs1 = Y, J += 12219292800000;
    let V = ((J & 268435455) * 1e4 + W) % 4294967296;
    Z[G++] = V >>> 24 & 255, Z[G++] = V >>> 16 & 255, Z[G++] = V >>> 8 & 255, Z[G++] = V & 255;
    let F = J / 4294967296 * 1e4 & 268435455;
    Z[G++] = F >>> 8 & 255, Z[G++] = F & 255, Z[G++] = F >>> 24 & 15 | 16, Z[G++] = F >>> 16 & 255, Z[G++] = Y >>> 8 | 128, Z[G++] = Y & 255;
    for (let K = 0; K < 6; ++K) Z[G + K] = I[K];
    return Q || (0, ea6.default)(Z)
  }
  var Qs6 = As6;
  MsB.default = Qs6
})
// @from(Start 8128812, End 8129696)
fs1 = z((TsB) => {
  Object.defineProperty(TsB, "__esModule", {
    value: !0
  });
  TsB.default = void 0;
  var Bs6 = Gs6(CNA());

  function Gs6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Zs6(A) {
    if (!(0, Bs6.default)(A)) throw TypeError("Invalid UUID");
    let Q, B = new Uint8Array(16);
    return B[0] = (Q = parseInt(A.slice(0, 8), 16)) >>> 24, B[1] = Q >>> 16 & 255, B[2] = Q >>> 8 & 255, B[3] = Q & 255, B[4] = (Q = parseInt(A.slice(9, 13), 16)) >>> 8, B[5] = Q & 255, B[6] = (Q = parseInt(A.slice(14, 18), 16)) >>> 8, B[7] = Q & 255, B[8] = (Q = parseInt(A.slice(19, 23), 16)) >>> 8, B[9] = Q & 255, B[10] = (Q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, B[11] = Q / 4294967296 & 255, B[12] = Q >>> 24 & 255, B[13] = Q >>> 16 & 255, B[14] = Q >>> 8 & 255, B[15] = Q & 255, B
  }
  var Is6 = Zs6;
  TsB.default = Is6
})
// @from(Start 8129702, End 8130911)
hs1 = z((ksB) => {
  Object.defineProperty(ksB, "__esModule", {
    value: !0
  });
  ksB.default = Xs6;
  ksB.URL = ksB.DNS = void 0;
  var Ys6 = jsB(ENA()),
    Js6 = jsB(fs1());

  function jsB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Ws6(A) {
    A = unescape(encodeURIComponent(A));
    let Q = [];
    for (let B = 0; B < A.length; ++B) Q.push(A.charCodeAt(B));
    return Q
  }
  var SsB = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  ksB.DNS = SsB;
  var _sB = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  ksB.URL = _sB;

  function Xs6(A, Q, B) {
    function G(Z, I, Y, J) {
      if (typeof Z === "string") Z = Ws6(Z);
      if (typeof I === "string") I = (0, Js6.default)(I);
      if (I.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let W = new Uint8Array(16 + Z.length);
      if (W.set(I), W.set(Z, I.length), W = B(W), W[6] = W[6] & 15 | Q, W[8] = W[8] & 63 | 128, Y) {
        J = J || 0;
        for (let X = 0; X < 16; ++X) Y[J + X] = W[X];
        return Y
      }
      return (0, Ys6.default)(W)
    }
    try {
      G.name = A
    } catch (Z) {}
    return G.DNS = SsB, G.URL = _sB, G
  }
})
// @from(Start 8130917, End 8131375)
bsB = z((xsB) => {
  Object.defineProperty(xsB, "__esModule", {
    value: !0
  });
  xsB.default = void 0;
  var Ks6 = Ds6(UA("crypto"));

  function Ds6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Hs6(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return Ks6.default.createHash("md5").update(A).digest()
  }
  var Cs6 = Hs6;
  xsB.default = Cs6
})
// @from(Start 8131381, End 8131710)
usB = z((hsB) => {
  Object.defineProperty(hsB, "__esModule", {
    value: !0
  });
  hsB.default = void 0;
  var Es6 = fsB(hs1()),
    zs6 = fsB(bsB());

  function fsB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var Us6 = (0, Es6.default)("v3", 48, zs6.default),
    $s6 = Us6;
  hsB.default = $s6
})
// @from(Start 8131716, End 8132274)
psB = z((dsB) => {
  Object.defineProperty(dsB, "__esModule", {
    value: !0
  });
  dsB.default = void 0;
  var ws6 = msB(ys1()),
    qs6 = msB(ENA());

  function msB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Ns6(A, Q, B) {
    A = A || {};
    let G = A.random || (A.rng || ws6.default)();
    if (G[6] = G[6] & 15 | 64, G[8] = G[8] & 63 | 128, Q) {
      B = B || 0;
      for (let Z = 0; Z < 16; ++Z) Q[B + Z] = G[Z];
      return Q
    }
    return (0, qs6.default)(G)
  }
  var Ls6 = Ns6;
  dsB.default = Ls6
})
// @from(Start 8132280, End 8132739)
nsB = z((lsB) => {
  Object.defineProperty(lsB, "__esModule", {
    value: !0
  });
  lsB.default = void 0;
  var Ms6 = Os6(UA("crypto"));

  function Os6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Rs6(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return Ms6.default.createHash("sha1").update(A).digest()
  }
  var Ts6 = Rs6;
  lsB.default = Ts6
})
// @from(Start 8132745, End 8133074)
osB = z((ssB) => {
  Object.defineProperty(ssB, "__esModule", {
    value: !0
  });
  ssB.default = void 0;
  var Ps6 = asB(hs1()),
    js6 = asB(nsB());

  function asB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var Ss6 = (0, Ps6.default)("v5", 80, js6.default),
    _s6 = Ss6;
  ssB.default = _s6
})
// @from(Start 8133080, End 8133262)
ArB = z((tsB) => {
  Object.defineProperty(tsB, "__esModule", {
    value: !0
  });
  tsB.default = void 0;
  var ks6 = "00000000-0000-0000-0000-000000000000";
  tsB.default = ks6
})
// @from(Start 8133268, End 8133653)
GrB = z((QrB) => {
  Object.defineProperty(QrB, "__esModule", {
    value: !0
  });
  QrB.default = void 0;
  var ys6 = xs6(CNA());

  function xs6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function vs6(A) {
    if (!(0, ys6.default)(A)) throw TypeError("Invalid UUID");
    return parseInt(A.substr(14, 1), 16)
  }
  var bs6 = vs6;
  QrB.default = bs6
})
// @from(Start 8133659, End 8135075)
ZrB = z((mT) => {
  Object.defineProperty(mT, "__esModule", {
    value: !0
  });
  Object.defineProperty(mT, "v1", {
    enumerable: !0,
    get: function() {
      return fs6.default
    }
  });
  Object.defineProperty(mT, "v3", {
    enumerable: !0,
    get: function() {
      return hs6.default
    }
  });
  Object.defineProperty(mT, "v4", {
    enumerable: !0,
    get: function() {
      return gs6.default
    }
  });
  Object.defineProperty(mT, "v5", {
    enumerable: !0,
    get: function() {
      return us6.default
    }
  });
  Object.defineProperty(mT, "NIL", {
    enumerable: !0,
    get: function() {
      return ms6.default
    }
  });
  Object.defineProperty(mT, "version", {
    enumerable: !0,
    get: function() {
      return ds6.default
    }
  });
  Object.defineProperty(mT, "validate", {
    enumerable: !0,
    get: function() {
      return cs6.default
    }
  });
  Object.defineProperty(mT, "stringify", {
    enumerable: !0,
    get: function() {
      return ps6.default
    }
  });
  Object.defineProperty(mT, "parse", {
    enumerable: !0,
    get: function() {
      return ls6.default
    }
  });
  var fs6 = sf(RsB()),
    hs6 = sf(usB()),
    gs6 = sf(psB()),
    us6 = sf(osB()),
    ms6 = sf(ArB()),
    ds6 = sf(GrB()),
    cs6 = sf(CNA()),
    ps6 = sf(ENA()),
    ls6 = sf(fs1());

  function sf(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
})
// @from(Start 8135081, End 8135083)
Hk
// @from(Start 8135085, End 8135088)
UFG
// @from(Start 8135090, End 8135093)
$FG
// @from(Start 8135095, End 8135098)
IrB
// @from(Start 8135100, End 8135103)
wFG
// @from(Start 8135105, End 8135108)
qFG
// @from(Start 8135110, End 8135113)
NFG
// @from(Start 8135115, End 8135118)
LFG
// @from(Start 8135120, End 8135123)
MFG
// @from(Start 8135125, End 8135128)
OFG
// @from(Start 8135134, End 8135383)
YrB = L(() => {
  Hk = BA(ZrB(), 1), UFG = Hk.default.v1, $FG = Hk.default.v3, IrB = Hk.default.v4, wFG = Hk.default.v5, qFG = Hk.default.NIL, NFG = Hk.default.version, LFG = Hk.default.validate, MFG = Hk.default.stringify, OFG = Hk.default.parse
})