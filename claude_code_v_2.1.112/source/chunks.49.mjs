
// @from(Ln 122313, Col 0)
class gW {
    constructor(q, K, _, z, Y, A, O, w) {
        this.canonicalAuthority = q, this._canonicalAuthority.validateAsUri(), this.networkInterface = K, this.cacheManager = _, this.authorityOptions = z, this.regionDiscoveryMetadata = {
            region_used: void 0,
            region_source: void 0,
            region_outcome: void 0
        }, this.logger = Y, this.performanceClient = O, this.correlationId = A, this.managedIdentity = w || !1, this.regionDiscovery = new oi6(K, this.logger, this.performanceClient, this.correlationId)
    }
    getAuthorityType(q) {
        if (q.HostNameAndPort.endsWith(q7.CIAM_AUTH_URL)) return nb.Ciam;
        let K = q.PathSegments;
        if (K.length) switch (K[0].toLowerCase()) {
            case q7.ADFS:
                return nb.Adfs;
            case q7.DSTS:
                return nb.Dsts
        }
        return nb.Default
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
    set canonicalAuthority(q) {
        this._canonicalAuthority = new l9(q), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null
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
        else throw k7(QV)
    }
    get tokenEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint);
        else throw k7(QV)
    }
    get deviceCodeEndpoint() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
        else throw k7(QV)
    }
    get endSessionEndpoint() {
        if (this.discoveryComplete()) {
            if (!this.metadata.end_session_endpoint) throw k7(xw6);
            return this.replacePath(this.metadata.end_session_endpoint)
        } else throw k7(QV)
    }
    get selfSignedJwtAudience() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.issuer);
        else throw k7(QV)
    }
    get jwksUri() {
        if (this.discoveryComplete()) return this.replacePath(this.metadata.jwks_uri);
        else throw k7(QV)
    }
    canReplaceTenant(q) {
        return q.PathSegments.length === 1 && !gW.reservedTenantDomains.has(q.PathSegments[0]) && this.getAuthorityType(q) === nb.Default && this.protocolMode !== bv.OIDC
    }
    replaceTenant(q) {
        return q.replace(/{tenant}|{tenantid}/g, this.tenant)
    }
    replacePath(q) {
        let K = q,
            z = new l9(this.metadata.canonical_authority).getUrlComponents(),
            Y = z.PathSegments;
        return this.canonicalAuthorityUrlComponents.PathSegments.forEach((O, w) => {
            let $ = Y[w];
            if (w === 0 && this.canReplaceTenant(z)) {
                let j = new l9(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
                if ($ !== j) this.logger.verbose(`Replacing tenant domain name ${$} with id ${j}`), $ = j
            }
            if (O !== $) K = K.replace(`/${$}/`, `/${O}/`)
        }), this.replaceTenant(K)
    }
    get defaultOpenIdConfigurationEndpoint() {
        let q = this.hostnameAndPort;
        if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === nb.Adfs || this.protocolMode === bv.OIDC && !this.isAliasOfKnownMicrosoftAuthority(q)) return `${this.canonicalAuthority}.well-known/openid-configuration`;
        return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`
    }
    discoveryComplete() {
        return !!this.metadata
    }
    async resolveEndpointsAsync() {
        this.performanceClient?.addQueueMeasurement(m1.AuthorityResolveEndpointsAsync, this.correlationId);
        let q = this.getCurrentMetadataEntity(),
            K = await AY(this.updateCloudDiscoveryMetadata.bind(this), m1.AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(q);
        this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, q.preferred_network);
        let _ = await AY(this.updateEndpointMetadata.bind(this), m1.AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(q);
        this.updateCachedMetadata(q, K, {
            source: _
        }), this.performanceClient?.addFields({
            cloudDiscoverySource: K,
            authorityEndpointSource: _
        }, this.correlationId)
    }
    getCurrentMetadataEntity() {
        let q = this.cacheManager.getAuthorityMetadataByAlias(this.hostnameAndPort);
        if (!q) q = {
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
            expiresAt: sG8(),
            jwks_uri: ""
        };
        return q
    }
    updateCachedMetadata(q, K, _) {
        if (K !== UV.CACHE && _?.source !== UV.CACHE) q.expiresAt = sG8(), q.canonical_authority = this.canonicalAuthority;
        let z = this.cacheManager.generateAuthorityMetadataCacheKey(q.preferred_cache);
        this.cacheManager.setAuthorityMetadata(z, q), this.metadata = q
    }
    async updateEndpointMetadata(q) {
        this.performanceClient?.addQueueMeasurement(m1.AuthorityUpdateEndpointMetadata, this.correlationId);
        let K = this.updateEndpointMetadataFromLocalSources(q);
        if (K) {
            if (K.source === UV.HARDCODED_VALUES) {
                if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
                    if (K.metadata) {
                        let z = await AY(this.updateMetadataWithRegionalInformation.bind(this), m1.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(K.metadata);
                        VV6(q, z, !1), q.canonical_authority = this.canonicalAuthority
                    }
                }
            }
            return K.source
        }
        let _ = await AY(this.getEndpointMetadataFromNetwork.bind(this), m1.AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
        if (_) {
            if (this.authorityOptions.azureRegionConfiguration?.azureRegion) _ = await AY(this.updateMetadataWithRegionalInformation.bind(this), m1.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(_);
            return VV6(q, _, !0), UV.NETWORK
        } else throw k7(Vw6, this.defaultOpenIdConfigurationEndpoint)
    }
    updateEndpointMetadataFromLocalSources(q) {
        this.logger.verbose("Attempting to get endpoint metadata from authority configuration");
        let K = this.getEndpointMetadataFromConfig();
        if (K) return this.logger.verbose("Found endpoint metadata in authority configuration"), VV6(q, K, !1), {
            source: UV.CONFIG
        };
        if (this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."), this.authorityOptions.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");
        else {
            let z = this.getEndpointMetadataFromHardcodedValues();
            if (z) return VV6(q, z, !1), {
                source: UV.HARDCODED_VALUES,
                metadata: z
            };
            else this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")
        }
        let _ = tG8(q);
        if (this.isAuthoritySameType(q) && q.endpointsFromNetwork && !_) return this.logger.verbose("Found endpoint metadata in the cache."), {
            source: UV.CACHE
        };
        else if (_) this.logger.verbose("The metadata entity is expired.");
        return null
    }
    isAuthoritySameType(q) {
        return new l9(q.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length
    }
    getEndpointMetadataFromConfig() {
        if (this.authorityOptions.authorityMetadata) try {
            return JSON.parse(this.authorityOptions.authorityMetadata)
        } catch (q) {
            throw aw(dw6)
        }
        return null
    }
    async getEndpointMetadataFromNetwork() {
        this.performanceClient?.addQueueMeasurement(m1.AuthorityGetEndpointMetadataFromNetwork, this.correlationId);
        let q = {},
            K = this.defaultOpenIdConfigurationEndpoint;
        this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${K}`);
        try {
            let _ = await this.networkInterface.sendGetRequestAsync(K, q);
            if (ALq(_.body)) return _.body;
            else return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"), null
        } catch (_) {
            return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${_}`), null
        }
    }
    getEndpointMetadataFromHardcodedValues() {
        if (this.hostnameAndPort in lk1) return lk1[this.hostnameAndPort];
        return null
    }
    async updateMetadataWithRegionalInformation(q) {
        this.performanceClient?.addQueueMeasurement(m1.AuthorityUpdateMetadataWithRegionalInformation, this.correlationId);
        let K = this.authorityOptions.azureRegionConfiguration?.azureRegion;
        if (K) {
            if (K !== q7.AZURE_REGION_AUTO_DISCOVER_FLAG) return this.regionDiscoveryMetadata.region_outcome = RG8.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = K, gW.replaceWithRegionalInformation(q, K);
            let _ = await AY(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), m1.RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
            if (_) return this.regionDiscoveryMetadata.region_outcome = RG8.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = _, gW.replaceWithRegionalInformation(q, _);
            this.regionDiscoveryMetadata.region_outcome = RG8.AUTO_DETECTION_REQUESTED_FAILED
        }
        return q
    }
    async updateCloudDiscoveryMetadata(q) {
        this.performanceClient?.addQueueMeasurement(m1.AuthorityUpdateCloudDiscoveryMetadata, this.correlationId);
        let K = this.updateCloudDiscoveryMetadataFromLocalSources(q);
        if (K) return K;
        let _ = await AY(this.getCloudDiscoveryMetadataFromNetwork.bind(this), m1.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
        if (_) return si6(q, _, !0), UV.NETWORK;
        throw aw(cw6)
    }
    updateCloudDiscoveryMetadataFromLocalSources(q) {
        this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"), this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||q7.NOT_APPLICABLE}`), this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||q7.NOT_APPLICABLE}`), this.logger.verbosePii(`Canonical Authority: ${q.canonical_authority||q7.NOT_APPLICABLE}`);
        let K = this.getCloudDiscoveryMetadataFromConfig();
        if (K) return this.logger.verbose("Found cloud discovery metadata in authority configuration"), si6(q, K, !1), UV.CONFIG;
        if (this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."), this.options.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");
        else {
            let z = tyq(this.hostnameAndPort);
            if (z) return this.logger.verbose("Found cloud discovery metadata from hardcoded values."), si6(q, z, !1), UV.HARDCODED_VALUES;
            this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")
        }
        let _ = tG8(q);
        if (this.isAuthoritySameType(q) && q.aliasesFromNetwork && !_) return this.logger.verbose("Found cloud discovery metadata in the cache."), UV.CACHE;
        else if (_) this.logger.verbose("The metadata entity is expired.");
        return null
    }
    getCloudDiscoveryMetadataFromConfig() {
        if (this.authorityType === nb.Ciam) return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."), gW.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        if (this.authorityOptions.cloudDiscoveryMetadata) {
            this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");
            try {
                this.logger.verbose("Attempting to parse the cloud discovery metadata.");
                let q = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),
                    K = Ii6(q.metadata, this.hostnameAndPort);
                if (this.logger.verbose("Parsed the cloud discovery metadata."), K) return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."), K;
                else this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")
            } catch (q) {
                throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."), aw(kq6)
            }
        }
        if (this.isInKnownAuthorities()) return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."), gW.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        return null
    }
    async getCloudDiscoveryMetadataFromNetwork() {
        this.performanceClient?.addQueueMeasurement(m1.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.correlationId);
        let q = `${q7.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,
            K = {},
            _ = null;
        try {
            let z = await this.networkInterface.sendGetRequestAsync(q, K),
                Y, A;
            if (wLq(z.body)) Y = z.body, A = Y.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: ${Y.tenant_discovery_endpoint}`);
            else if (jLq(z.body)) {
                if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${z.status}`), Y = z.body, Y.error === q7.INVALID_INSTANCE) return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."), null;
                this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${Y.error}`), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${Y.error_description}`), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"), A = []
            } else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"), null;
            this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."), _ = Ii6(A, this.hostnameAndPort)
        } catch (z) {
            if (z instanceof G9) this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
Error: ${z.errorCode}
Error Description: ${z.errorMessage}`);
            else {
                let Y = z;
                this.logger.error(`A non-MSALJS error was thrown while attempting to get the cloud instance discovery metadata.
Error: ${Y.name}
Error Description: ${Y.message}`)
            }
            return null
        }
        if (!_) this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."), this.logger.verbose("Creating custom Authority for custom domain scenario."), _ = gW.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
        return _
    }
    isInKnownAuthorities() {
        return this.authorityOptions.knownAuthorities.filter((K) => {
            return K && l9.getDomainFromUrl(K).toLowerCase() === this.hostnameAndPort
        }).length > 0
    }
    static generateAuthority(q, K) {
        let _;
        if (K && K.azureCloudInstance !== bo.None) {
            let z = K.tenant ? K.tenant : q7.DEFAULT_COMMON_TENANT;
            _ = `${K.azureCloudInstance}/${z}/`
        }
        return _ ? _ : q
    }
    static createCloudDiscoveryMetadataFromHost(q) {
        return {
            preferred_network: q,
            preferred_cache: q,
            aliases: [q]
        }
    }
    getPreferredCache() {
        if (this.managedIdentity) return q7.DEFAULT_AUTHORITY_HOST;
        else if (this.discoveryComplete()) return this.metadata.preferred_cache;
        else throw k7(QV)
    }
    isAlias(q) {
        return this.metadata.aliases.indexOf(q) > -1
    }
    isAliasOfKnownMicrosoftAuthority(q) {
        return ik1.has(q)
    }
    static isPublicCloudAuthority(q) {
        return q7.KNOWN_PUBLIC_CLOUDS.indexOf(q) >= 0
    }
    static buildRegionalAuthorityString(q, K, _) {
        let z = new l9(q);
        z.validateAsUri();
        let Y = z.getUrlComponents(),
            A = `${K}.${Y.HostNameAndPort}`;
        if (this.isPublicCloudAuthority(Y.HostNameAndPort)) A = `${K}.${q7.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
        let O = l9.constructAuthorityUriFromObject({
            ...z.getUrlComponents(),
            HostNameAndPort: A
        }).urlString;
        if (_) return `${O}?${_}`;
        return O
    }
    static replaceWithRegionalInformation(q, K) {
        let _ = {
            ...q
        };
        if (_.authorization_endpoint = gW.buildRegionalAuthorityString(_.authorization_endpoint, K), _.token_endpoint = gW.buildRegionalAuthorityString(_.token_endpoint, K), _.end_session_endpoint) _.end_session_endpoint = gW.buildRegionalAuthorityString(_.end_session_endpoint, K);
        return _
    }
    static transformCIAMAuthority(q) {
        let K = q,
            z = new l9(q).getUrlComponents();
        if (z.PathSegments.length === 0 && z.HostNameAndPort.endsWith(q7.CIAM_AUTH_URL)) {
            let Y = z.HostNameAndPort.split(".")[0];
            K = `${K}${Y}${q7.AAD_TENANT_DOMAIN_SUFFIX}`
        }
        return K
    }
}
// @from(Ln 122661, Col 0)
function MLq(q) {
    let z = new l9(q).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
    switch (z) {
        case CE.COMMON:
        case CE.ORGANIZATIONS:
        case CE.CONSUMERS:
            return;
        default:
            return z
    }
}
// @from(Ln 122673, Col 0)
function qv8(q) {
    return q.endsWith(q7.FORWARD_SLASH) ? q : `${q}${q7.FORWARD_SLASH}`
}
// @from(Ln 122677, Col 0)
function tN1(q) {
    let K = q.cloudDiscoveryMetadata,
        _ = void 0;
    if (K) try {
        _ = JSON.parse(K)
    } catch (z) {
        throw aw(kq6)
    }
    return {
        canonicalAuthority: q.authority ? qv8(q.authority) : void 0,
        knownAuthorities: q.knownAuthorities,
        cloudDiscoveryMetadata: _
    }
}
// @from(Ln 122691, Col 4)
Kv8 = L(() => {
    Uk1();
    OLq();
    yq6();
    TP();
    L$();
    rk1();
    Nq6();
    Ci6();
    xG8();
    $Lq();
    HLq();
    XLq();
    lb();
    ZB();
    Fo();
    eG8();
    wM();
    xo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    gW.reservedTenantDomains = new Set(["{tenant}", "{tenantid}", CE.COMMON, CE.CONSUMERS, CE.ORGANIZATIONS])
})
// @from(Ln 122712, Col 4)
_v8 = {}
// @from(Ln 122716, Col 0)
async function eN1(q, K, _, z, Y, A, O) {
    O?.addQueueMeasurement(m1.AuthorityFactoryCreateDiscoveredInstance, A);
    let w = gW.transformCIAMAuthority(qv8(q)),
        $ = new gW(w, K, _, z, Y, A, O);
    try {
        return await AY($.resolveEndpointsAsync.bind($), m1.AuthorityResolveEndpointsAsync, Y, O, A)(), $
    } catch (j) {
        throw k7(QV)
    }
}
// @from(Ln 122726, Col 4)
qE1 = L(() => {
    Kv8();
    TP();
    ZB();
    Fo();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 122733, Col 4)
lV
// @from(Ln 122734, Col 4)
kV6 = L(() => {
    lb(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    lV = class lV extends G9 {
        constructor(q, K, _, z, Y) {
            super(q, K, _);
            this.name = "ServerError", this.errorNo = z, this.status = Y, Object.setPrototypeOf(this, lV.prototype)
        }
    }
})
// @from(Ln 122744, Col 0)
function NV6(q, K, _) {
    return {
        clientId: q,
        authority: K.authority,
        scopes: K.scopes,
        homeAccountIdentifier: _,
        claims: K.claims,
        authenticationScheme: K.authenticationScheme,
        resourceRequestMethod: K.resourceRequestMethod,
        resourceRequestUri: K.resourceRequestUri,
        shrClaims: K.shrClaims,
        sshKid: K.sshKid,
        embeddedClientId: K.embeddedClientId || K.tokenBodyParameters?.clientId
    }
}
// @from(Ln 122759, Col 4)
zv8 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122761, Col 0)
class go {
    static generateThrottlingStorageKey(q) {
        return `${uQ.THROTTLING_PREFIX}.${JSON.stringify(q)}`
    }
    static preProcess(q, K, _) {
        let z = go.generateThrottlingStorageKey(K),
            Y = q.getThrottlingCache(z);
        if (Y) {
            if (Y.throttleTime < Date.now()) {
                q.removeItem(z, _);
                return
            }
            throw new lV(Y.errorCodes?.join(" ") || q7.EMPTY_STRING, Y.errorMessage, Y.subError)
        }
    }
    static postProcess(q, K, _, z) {
        if (go.checkResponseStatus(_) || go.checkResponseForRetryAfter(_)) {
            let Y = {
                throttleTime: go.calculateThrottleTime(parseInt(_.headers[y$.RETRY_AFTER])),
                error: _.body.error,
                errorCodes: _.body.error_codes,
                errorMessage: _.body.error_description,
                subError: _.body.suberror
            };
            q.setThrottlingCache(go.generateThrottlingStorageKey(K), Y, z)
        }
    }
    static checkResponseStatus(q) {
        return q.status === 429 || q.status >= 500 && q.status < 600
    }
    static checkResponseForRetryAfter(q) {
        if (q.headers) return q.headers.hasOwnProperty(y$.RETRY_AFTER) && (q.status < 200 || q.status >= 300);
        return !1
    }
    static calculateThrottleTime(q) {
        let K = q <= 0 ? 0 : q,
            _ = Date.now() / 1000;
        return Math.floor(Math.min(_ + (K || uQ.DEFAULT_THROTTLE_TIME_SECONDS), _ + uQ.DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000)
    }
    static removeThrottle(q, K, _, z) {
        let Y = NV6(K, _, z),
            A = this.generateThrottlingStorageKey(Y);
        q.removeItem(A, _.correlationId)
    }
}
// @from(Ln 122806, Col 4)
PLq = L(() => {
    L$();
    kV6();
    zv8(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 122811, Col 4)
Yv8
// @from(Ln 122812, Col 4)
WLq = L(() => {
    lb(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Yv8 = class Yv8 extends G9 {
        constructor(q, K, _) {
            super(q.errorCode, q.errorMessage, q.subError);
            Object.setPrototypeOf(this, Yv8.prototype), this.name = "NetworkError", this.error = q, this.httpStatus = K, this.responseHeaders = _
        }
    }
})
// @from(Ln 122821, Col 0)
class Iv {
    constructor(q, K) {
        this.config = zLq(q), this.logger = new IE(this.config.loggerOptions, bG8, HV6), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = K
    }
    createTokenRequestHeaders(q) {
        let K = {};
        if (K[y$.CONTENT_TYPE] = q7.URL_FORM_CONTENT_TYPE, !this.config.systemOptions.preventCorsPreflight && q) switch (q.type) {
            case dV.HOME_ACCOUNT_ID:
                try {
                    let _ = BQ(q.credential);
                    K[y$.CCS_HEADER] = `Oid:${_.uid}@${_.utid}`
                } catch (_) {
                    this.logger.verbose("Could not parse home account ID for CCS Header: " + _)
                }
                break;
            case dV.UPN:
                K[y$.CCS_HEADER] = `UPN: ${q.credential}`;
                break
        }
        return K
    }
    async executePostToTokenEndpoint(q, K, _, z, Y, A) {
        if (A) this.performanceClient?.addQueueMeasurement(A, Y);
        let O = await this.sendPostRequest(z, q, {
            body: K,
            headers: _
        }, Y);
        if (this.config.serverTelemetryManager && O.status < 500 && O.status !== 429) this.config.serverTelemetryManager.clearTelemetryCache();
        return O
    }
    async sendPostRequest(q, K, _, z) {
        go.preProcess(this.cacheManager, q, z);
        let Y;
        try {
            Y = await AY(this.networkClient.sendPostRequestAsync.bind(this.networkClient), m1.NetworkClientSendPostRequestAsync, this.logger, this.performanceClient, z)(K, _);
            let A = Y.headers || {};
            this.performanceClient?.addFields({
                refreshTokenSize: Y.body.refresh_token?.length || 0,
                httpVerToken: A[y$.X_MS_HTTP_VERSION] || "",
                requestId: A[y$.X_MS_REQUEST_ID] || ""
            }, z)
        } catch (A) {
            if (A instanceof Yv8) {
                let O = A.responseHeaders;
                if (O) this.performanceClient?.addFields({
                    httpVerToken: O[y$.X_MS_HTTP_VERSION] || "",
                    requestId: O[y$.X_MS_REQUEST_ID] || "",
                    contentTypeHeader: O[y$.CONTENT_TYPE] || void 0,
                    contentLengthHeader: O[y$.CONTENT_LENGTH] || void 0,
                    httpStatus: A.httpStatus
                }, z);
                throw A.error
            }
            if (A instanceof G9) throw A;
            else throw k7(Tw6)
        }
        return go.postProcess(this.cacheManager, q, Y, z), Y
    }
    async updateAuthority(q, K) {
        this.performanceClient?.addQueueMeasurement(m1.UpdateTokenEndpointAuthority, K);
        let _ = `https://${q}/${this.authority.tenant}/`,
            z = await eN1(_, this.networkClient, this.cacheManager, this.authority.options, this.logger, K, this.performanceClient);
        this.authority = z
    }
    createTokenQueryParameters(q) {
        let K = new Map;
        if (q.embeddedClientId) po(K, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
        if (q.tokenQueryParameters) Bo(K, q.tokenQueryParameters);
        return ew6(K, q.correlationId), rw6(K, q.correlationId, this.performanceClient), pQ(K)
    }
}
// @from(Ln 122892, Col 4)
ti6 = L(() => {
    dG8();
    CG8();
    L$();
    IG8();
    ui6();
    PV6();
    vV6();
    lw6();
    qE1();
    ZB();
    PLq();
    lb();
    TP();
    WLq();
    Fo();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 122910, Col 4)
Ov8 = {}
// @from(Ln 122921, Col 4)
Rq6 = "no_tokens_found"
// @from(Ln 122922, Col 4)
ei6 = "native_account_unavailable"
// @from(Ln 122923, Col 4)
qr6 = "refresh_token_expired"
// @from(Ln 122924, Col 4)
Av8 = "ux_not_allowed"
// @from(Ln 122925, Col 4)
KE1 = "interaction_required"
// @from(Ln 122926, Col 4)
_E1 = "consent_required"
// @from(Ln 122927, Col 4)
zE1 = "login_required"
// @from(Ln 122928, Col 4)
Sq6 = "bad_token"
// @from(Ln 122929, Col 4)
wv8 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122932, Col 0)
function jv8(q, K, _) {
    let z = !!q && DLq.indexOf(q) > -1,
        Y = !!_ && io9.indexOf(_) > -1,
        A = !!K && DLq.some((O) => {
            return K.indexOf(O) > -1
        });
    return z || A || Y
}
// @from(Ln 122941, Col 0)
function Hv8(q) {
    return new rh(q, $v8[q])
}
// @from(Ln 122944, Col 4)
DLq
// @from(Ln 122944, Col 9)
io9
// @from(Ln 122944, Col 14)
$v8
// @from(Ln 122944, Col 19)
YE1
// @from(Ln 122944, Col 24)
rh
// @from(Ln 122945, Col 4)
Kr6 = L(() => {
    L$();
    lb();
    wv8(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    DLq = [KE1, _E1, zE1, Sq6, Av8], io9 = ["message_only", "additional_action", "basic_action", "user_password_expired", "consent_required", "bad_token"], $v8 = {
        [Rq6]: "No refresh token found in the cache. Please sign-in.",
        [ei6]: "The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",
        [qr6]: "Refresh token has expired.",
        [Sq6]: "Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve.",
        [Av8]: "`canShowUI` flag in Edge was set to false. User interaction required on web page. Please invoke an interactive API to resolve."
    }, YE1 = {
        noTokensFoundError: {
            code: Rq6,
            desc: $v8[Rq6]
        },
        native_account_unavailable: {
            code: ei6,
            desc: $v8[ei6]
        },
        bad_token: {
            code: Sq6,
            desc: $v8[Sq6]
        }
    };
    rh = class rh extends G9 {
        constructor(q, K, _, z, Y, A, O, w) {
            super(q, K, _);
            Object.setPrototypeOf(this, rh.prototype), this.timestamp = z || q7.EMPTY_STRING, this.traceId = Y || q7.EMPTY_STRING, this.correlationId = A || q7.EMPTY_STRING, this.claims = O || q7.EMPTY_STRING, this.name = "InteractionRequiredAuthError", this.errorNo = w
        }
    }
})
// @from(Ln 122976, Col 0)
class Jv8 {
    static setRequestState(q, K, _) {
        let z = Jv8.generateLibraryState(q, _);
        return K ? `${z}${q7.RESOURCE_DELIM}${K}` : z
    }
    static generateLibraryState(q, K) {
        if (!q) throw k7(vq6);
        let _ = {
            id: q.createNewGuid()
        };
        if (K) _.meta = K;
        let z = JSON.stringify(_);
        return q.base64Encode(z)
    }
    static parseRequestState(q, K) {
        if (!q) throw k7(vq6);
        if (!K) throw k7(DB);
        try {
            let _ = K.split(q7.RESOURCE_DELIM),
                z = _[0],
                Y = _.length > 1 ? _.slice(1).join(q7.RESOURCE_DELIM) : q7.EMPTY_STRING,
                A = q.base64Decode(z),
                O = JSON.parse(A);
            return {
                userRequestState: Y || q7.EMPTY_STRING,
                libraryState: O
            }
        } catch (_) {
            throw k7(DB)
        }
    }
}
// @from(Ln 123008, Col 4)
ZLq = L(() => {
    L$();
    TP();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 123013, Col 0)
class K26 {
    constructor(q, K) {
        this.cryptoUtils = q, this.performanceClient = K
    }
    async generateCnf(q, K) {
        this.performanceClient?.addQueueMeasurement(m1.PopTokenGenerateCnf, q.correlationId);
        let _ = await AY(this.generateKid.bind(this), m1.PopTokenGenerateCnf, K, this.performanceClient, q.correlationId)(q),
            z = this.cryptoUtils.base64UrlEncode(JSON.stringify(_));
        return {
            kid: _.kid,
            reqCnfString: z
        }
    }
    async generateKid(q) {
        return this.performanceClient?.addQueueMeasurement(m1.PopTokenGenerateKid, q.correlationId), {
            kid: await this.cryptoUtils.getPublicKeyThumbprint(q),
            xms_ksl: ro9.SW
        }
    }
    async signPopToken(q, K, _) {
        return this.signPayload(q, K, _)
    }
    async signPayload(q, K, _, z) {
        let {
            resourceRequestMethod: Y,
            resourceRequestUri: A,
            shrClaims: O,
            shrNonce: w,
            shrOptions: $
        } = _, H = (A ? new l9(A) : void 0)?.getUrlComponents();
        return this.cryptoUtils.signJwt({
            at: q,
            ts: ih(),
            m: Y?.toUpperCase(),
            u: H?.HostNameAndPort,
            nonce: w || this.cryptoUtils.createNewGuid(),
            p: H?.AbsolutePath,
            q: H?.QueryString ? [
                [], H.QueryString
            ] : void 0,
            client_claims: O || void 0,
            ...z
        }, K, $, _.correlationId)
    }
}
// @from(Ln 123058, Col 4)
ro9
// @from(Ln 123059, Col 4)
Xv8 = L(() => {
    hq6();
    yq6();
    ZB();
    Fo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    ro9 = {
        SW: "sw"
    }
})
// @from(Ln 123068, Col 0)
class ib {
    constructor(q, K) {
        this.cache = q, this.hasChanged = K
    }
    get cacheHasChanged() {
        return this.hasChanged
    }
    get tokenCache() {
        return this.cache
    }
}
// @from(Ln 123079, Col 4)
AE1 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 123081, Col 0)
class wX {
    constructor(q, K, _, z, Y, A, O) {
        this.clientId = q, this.cacheStorage = K, this.cryptoObj = _, this.logger = z, this.serializableCache = Y, this.persistencePlugin = A, this.performanceClient = O
    }
    validateTokenResponse(q, K) {
        if (q.error || q.error_description || q.suberror) {
            let _ = `Error(s): ${q.error_codes||q7.NOT_AVAILABLE} - Timestamp: ${q.timestamp||q7.NOT_AVAILABLE} - Description: ${q.error_description||q7.NOT_AVAILABLE} - Correlation ID: ${q.correlation_id||q7.NOT_AVAILABLE} - Trace ID: ${q.trace_id||q7.NOT_AVAILABLE}`,
                z = q.error_codes?.length ? q.error_codes[0] : void 0,
                Y = new lV(q.error, _, q.suberror, z, q.status);
            if (K && q.status && q.status >= f9.SERVER_ERROR_RANGE_START && q.status <= f9.SERVER_ERROR_RANGE_END) {
                this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${Y}`);
                return
            } else if (K && q.status && q.status >= f9.CLIENT_ERROR_RANGE_START && q.status <= f9.CLIENT_ERROR_RANGE_END) {
                this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${Y}`);
                return
            }
            if (jv8(q.error, q.error_description, q.suberror)) throw new rh(q.error, q.error_description, q.suberror, q.timestamp || q7.EMPTY_STRING, q.trace_id || q7.EMPTY_STRING, q.correlation_id || q7.EMPTY_STRING, q.claims || q7.EMPTY_STRING, z);
            throw Y
        }
    }
    async handleServerTokenResponse(q, K, _, z, Y, A, O, w, $) {
        this.performanceClient?.addQueueMeasurement(m1.HandleServerTokenResponse, q.correlation_id);
        let j;
        if (q.id_token) {
            if (j = uo(q.id_token || q7.EMPTY_STRING, this.cryptoObj.base64Decode), Y && Y.nonce) {
                if (j.nonce !== Y.nonce) throw k7(Ew6)
            }
            if (z.maxAge || z.maxAge === 0) {
                let M = j.auth_time;
                if (!M) throw k7(ho);
                bi6(M, z.maxAge)
            }
        }
        this.homeAccountIdentifier = VP.generateHomeAccountId(q.client_info || q7.EMPTY_STRING, K.authorityType, this.logger, this.cryptoObj, j);
        let H;
        if (!!Y && !!Y.state) H = Jv8.parseRequestState(this.cryptoObj, Y.state);
        q.key_id = q.key_id || z.sshKid || void 0;
        let J = this.generateCacheRecord(q, K, _, z, j, A, Y),
            X;
        try {
            if (this.persistencePlugin && this.serializableCache) this.logger.verbose("Persistence enabled, calling beforeCacheAccess"), X = new ib(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(X);
            if (O && !w && J.account) {
                let M = this.cacheStorage.generateAccountKey(VP.getAccountInfo(J.account));
                if (!this.cacheStorage.getAccount(M, z.correlationId)) return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"), await wX.generateAuthenticationResult(this.cryptoObj, K, J, !1, z, j, H, void 0, $)
            }
            await this.cacheStorage.saveCacheRecord(J, z.correlationId, dk1(j || {}), z.storeInCache)
        } finally {
            if (this.persistencePlugin && this.serializableCache && X) this.logger.verbose("Persistence enabled, calling afterCacheAccess"), await this.persistencePlugin.afterCacheAccess(X)
        }
        return wX.generateAuthenticationResult(this.cryptoObj, K, J, !1, z, j, H, q, $)
    }
    generateCacheRecord(q, K, _, z, Y, A, O) {
        let w = K.getPreferredCache();
        if (!w) throw k7(So);
        let $ = BG8(Y),
            j, H;
        if (q.id_token && !!Y) j = oN1(this.homeAccountIdentifier, w, q.id_token, this.clientId, $ || ""), H = fLq(this.cacheStorage, K, this.homeAccountIdentifier, this.cryptoObj.base64Decode, z.correlationId, Y, q.client_info, w, $, O, void 0, this.logger);
        let J = null;
        if (q.access_token) {
            let P = q.scope ? OX.fromString(q.scope) : new OX(z.scopes || []),
                W = (typeof q.expires_in === "string" ? parseInt(q.expires_in, 10) : q.expires_in) || 0,
                D = (typeof q.ext_expires_in === "string" ? parseInt(q.ext_expires_in, 10) : q.ext_expires_in) || 0,
                Z = (typeof q.refresh_in === "string" ? parseInt(q.refresh_in, 10) : q.refresh_in) || void 0,
                G = _ + W,
                f = G + D,
                v = Z && Z > 0 ? _ + Z : void 0;
            J = aN1(this.homeAccountIdentifier, w, q.access_token, this.clientId, $ || K.tenant || "", P.printScopes(), G, f, this.cryptoObj.base64Decode, v, q.token_type, A, q.key_id, z.claims, z.requestedClaimsHash)
        }
        let X = null;
        if (q.refresh_token) {
            let P;
            if (q.refresh_token_expires_in) {
                let W = typeof q.refresh_token_expires_in === "string" ? parseInt(q.refresh_token_expires_in, 10) : q.refresh_token_expires_in;
                P = _ + W
            }
            X = sN1(this.homeAccountIdentifier, w, q.refresh_token, this.clientId, q.foci, A, P)
        }
        let M = null;
        if (q.foci) M = {
            clientId: this.clientId,
            environment: w,
            familyId: q.foci
        };
        return {
            account: H,
            idToken: j,
            accessToken: J,
            refreshToken: X,
            appMetadata: M
        }
    }
    static async generateAuthenticationResult(q, K, _, z, Y, A, O, w, $) {
        let j = q7.EMPTY_STRING,
            H = [],
            J = null,
            X, M, P = q7.EMPTY_STRING;
        if (_.accessToken) {
            if (_.accessToken.tokenType === hz.POP && !Y.popKid) {
                let G = new K26(q),
                    {
                        secret: f,
                        keyId: v
                    } = _.accessToken;
                if (!v) throw k7(uw6);
                j = await G.signPopToken(f, v, Y)
            } else j = _.accessToken.secret;
            if (H = OX.fromString(_.accessToken.target).asArray(), J = ai6(_.accessToken.expiresOn), X = ai6(_.accessToken.extendedExpiresOn), _.accessToken.refreshOn) M = ai6(_.accessToken.refreshOn)
        }
        if (_.appMetadata) P = _.appMetadata.familyId === Wq6 ? Wq6 : "";
        let W = A?.oid || A?.sub || "",
            D = A?.tid || "";
        if (w?.spa_accountid && !!_.account) _.account.nativeAccountId = w?.spa_accountid;
        let Z = _.account ? uG8(VP.getAccountInfo(_.account), void 0, A, _.idToken?.secret) : null;
        return {
            authority: K.canonicalAuthority,
            uniqueId: W,
            tenantId: D,
            scopes: H,
            account: Z,
            idToken: _?.idToken?.secret || "",
            idTokenClaims: A || {},
            accessToken: j,
            fromCache: z,
            expiresOn: J,
            extExpiresOn: X,
            refreshOn: M,
            correlationId: Y.correlationId,
            requestId: $ || q7.EMPTY_STRING,
            familyId: P,
            tokenType: _.accessToken?.tokenType || q7.EMPTY_STRING,
            state: O ? O.userRequestState : q7.EMPTY_STRING,
            cloudGraphHostName: _.account?.cloudGraphHostName || q7.EMPTY_STRING,
            msGraphHost: _.account?.msGraphHost || q7.EMPTY_STRING,
            code: w?.spa_code,
            fromNativeBroker: !1
        }
    }
}
// @from(Ln 123222, Col 0)
function fLq(q, K, _, z, Y, A, O, w, $, j, H, J) {
    J?.verbose("setCachedAccount called");
    let M = q.getAccountKeys().find((G) => {
            return G.startsWith(_)
        }),
        P = null;
    if (M) P = q.getAccount(M, Y);
    let W = P || VP.createAccount({
            homeAccountId: _,
            idTokenClaims: A,
            clientInfo: O,
            environment: w,
            cloudGraphHostName: j?.cloud_graph_host_name,
            msGraphHost: j?.msgraph_host,
            nativeAccountId: H
        }, K, z),
        D = W.tenantProfiles || [],
        Z = $ || W.realm;
    if (Z && !D.find((G) => {
            return G.tenantId === Z
        })) {
        let G = Si6(_, W.localAccountId, Z, A);
        D.push(G)
    }
    return W.tenantProfiles = D, W
}
// @from(Ln 123248, Col 4)
_r6 = L(() => {
    TP();
    kV6();
    Ri6();
    pG8();
    Kr6();
    ZLq();
    L$();
    Xv8();
    AE1();
    ZB();
    WV6();
    Qk1();
    mG8();
    eG8();
    hq6();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 123266, Col 0)
async function nV(q, K, _) {
    if (typeof q === "string") return q;
    else return q({
        clientId: K,
        tokenEndpoint: _
    })
}
// @from(Ln 123273, Col 4)
Mv8 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 123275, Col 4)
Pv8
// @from(Ln 123276, Col 4)
GLq = L(() => {
    ti6();
    vV6();
    lw6();
    L$();
    fV6();
    dG8();
    _r6();
    Eq6();
    TP();
    yq6();
    Xv8();
    hq6();
    PV6();
    ui6();
    Nq6();
    ZB();
    Fo();
    Mv8();
    zv8();
    wM();
    xo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Pv8 = class Pv8 extends Iv {
        constructor(q, K) {
            super(q, K);
            this.includeRedirectUri = !0, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes
        }
        async acquireToken(q, K) {
            if (this.performanceClient?.addQueueMeasurement(m1.AuthClientAcquireToken, q.correlationId), !q.code) throw k7(hw6);
            let _ = ih(),
                z = await AY(this.executeTokenRequest.bind(this), m1.AuthClientExecuteTokenRequest, this.logger, this.performanceClient, q.correlationId)(this.authority, q),
                Y = z.headers?.[y$.X_MS_REQUEST_ID],
                A = new wX(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin, this.performanceClient);
            return A.validateTokenResponse(z.body), AY(A.handleServerTokenResponse.bind(A), m1.HandleServerTokenResponse, this.logger, this.performanceClient, q.correlationId)(z.body, this.authority, _, q, K, void 0, void 0, void 0, Y)
        }
        getLogoutUri(q) {
            if (!q) throw aw(Uw6);
            let K = this.createLogoutUrlQueryString(q);
            return l9.appendQueryString(this.authority.endSessionEndpoint, K)
        }
        async executeTokenRequest(q, K) {
            this.performanceClient?.addQueueMeasurement(m1.AuthClientExecuteTokenRequest, K.correlationId);
            let _ = this.createTokenQueryParameters(K),
                z = l9.appendQueryString(q.tokenEndpoint, _),
                Y = await AY(this.createTokenRequestBody.bind(this), m1.AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, K.correlationId)(K),
                A = void 0;
            if (K.clientInfo) try {
                let $ = MV6(K.clientInfo, this.cryptoUtils.base64Decode);
                A = {
                    credential: `${$.uid}${Lo.CLIENT_INFO_SEPARATOR}${$.utid}`,
                    type: dV.HOME_ACCOUNT_ID
                }
            } catch ($) {
                this.logger.verbose("Could not parse client info for CCS Header: " + $)
            }
            let O = this.createTokenRequestHeaders(A || K.ccsCredential),
                w = NV6(this.config.authOptions.clientId, K);
            return AY(this.executePostToTokenEndpoint.bind(this), m1.AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, K.correlationId)(z, Y, O, w, K.correlationId, m1.AuthorizationCodeClientExecutePostToTokenEndpoint)
        }
        async createTokenRequestBody(q) {
            this.performanceClient?.addQueueMeasurement(m1.AuthClientCreateTokenRequestBody, q.correlationId);
            let K = new Map;
            if (aw6(K, q.embeddedClientId || q.tokenBodyParameters?.[FQ] || this.config.authOptions.clientId), !this.includeRedirectUri) {
                if (!q.redirectUri) throw aw(mw6)
            } else sw6(K, q.redirectUri);
            if (ow6(K, q.scopes, !0, this.oidcDefaultScopes), cN1(K, q.code), Bi6(K, this.config.libraryInfo), pi6(K, this.config.telemetry.application), ri6(K), this.serverTelemetryManager && !QG8(this.config)) ii6(K, this.serverTelemetryManager);
            if (q.codeVerifier) nN1(K, q.codeVerifier);
            if (this.config.clientCredentials.clientSecret) gi6(K, this.config.clientCredentials.clientSecret);
            if (this.config.clientCredentials.clientAssertion) {
                let z = this.config.clientCredentials.clientAssertion;
                Ui6(K, await nV(z.assertion, this.config.authOptions.clientId, q.resourceRequestUri)), Qi6(K, z.assertionType)
            }
            if (di6(K, bE.AUTHORIZATION_CODE_GRANT), q26(K), q.authenticationScheme === hz.POP) {
                let z = new K26(this.cryptoUtils, this.performanceClient),
                    Y;
                if (!q.popKid) Y = (await AY(z.generateCnf.bind(z), m1.PopTokenGenerateCnf, this.logger, this.performanceClient, q.correlationId)(q, this.logger)).reqCnfString;
                else Y = this.cryptoUtils.encodeKid(q.popKid);
                li6(K, Y)
            } else if (q.authenticationScheme === hz.SSH)
                if (q.sshJwk) ni6(K, q.sshJwk);
                else throw aw(Io);
            if (!b2.isEmptyObj(q.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) tw6(K, q.claims, this.config.authOptions.clientCapabilities);
            let _ = void 0;
            if (q.clientInfo) try {
                let z = MV6(q.clientInfo, this.cryptoUtils.base64Decode);
                _ = {
                    credential: `${z.uid}${Lo.CLIENT_INFO_SEPARATOR}${z.utid}`,
                    type: dV.HOME_ACCOUNT_ID
                }
            } catch (z) {
                this.logger.verbose("Could not parse client info for CCS Header: " + z)
            } else _ = q.ccsCredential;
            if (this.config.systemOptions.preventCorsPreflight && _) switch (_.type) {
                case dV.HOME_ACCOUNT_ID:
                    try {
                        let z = BQ(_.credential);
                        mo(K, z)
                    } catch (z) {
                        this.logger.verbose("Could not parse home account ID for CCS Header: " + z)
                    }
                    break;
                case dV.UPN:
                    Lq6(K, _.credential);
                    break
            }
            if (q.embeddedClientId) po(K, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
            if (q.tokenBodyParameters) Bo(K, q.tokenBodyParameters);
            if (q.enableSpaAuthorizationCode && (!q.tokenBodyParameters || !q.tokenBodyParameters[iG8])) Bo(K, {
                [iG8]: "1"
            });
            return rw6(K, q.correlationId, this.performanceClient), pQ(K)
        }
        createLogoutUrlQueryString(q) {
            let K = new Map;
            if (q.postLogoutRedirectUri) FN1(K, q.postLogoutRedirectUri);
            if (q.correlationId) ew6(K, q.correlationId);
            if (q.idTokenHint) gN1(K, q.idTokenHint);
            if (q.state) Fi6(K, q.state);
            if (q.logoutHint) iN1(K, q.logoutHint);
            if (q.extraQueryParameters) Bo(K, q.extraQueryParameters);
            if (this.config.authOptions.instanceAware) ci6(K);
            return pQ(K, this.config.authOptions.encodeExtraQueryParams, q.extraQueryParameters)
        }
    }
})
// @from(Ln 123401, Col 4)
oo9 = 300
// @from(Ln 123402, Col 4)
EV6
// @from(Ln 123403, Col 4)
vLq = L(() => {
    dG8();
    ti6();
    vV6();
    lw6();
    L$();
    fV6();
    _r6();
    Xv8();
    Eq6();
    Nq6();
    TP();
    kV6();
    hq6();
    yq6();
    ui6();
    PV6();
    Kr6();
    ZB();
    Fo();
    Mv8();
    zv8();
    wv8();
    xo();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    EV6 = class EV6 extends Iv {
        constructor(q, K) {
            super(q, K)
        }
        async acquireToken(q) {
            this.performanceClient?.addQueueMeasurement(m1.RefreshTokenClientAcquireToken, q.correlationId);
            let K = ih(),
                _ = await AY(this.executeTokenRequest.bind(this), m1.RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, q.correlationId)(q, this.authority),
                z = _.headers?.[y$.X_MS_REQUEST_ID],
                Y = new wX(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return Y.validateTokenResponse(_.body), AY(Y.handleServerTokenResponse.bind(Y), m1.HandleServerTokenResponse, this.logger, this.performanceClient, q.correlationId)(_.body, this.authority, K, q, void 0, void 0, !0, q.forceCache, z)
        }
        async acquireTokenByRefreshToken(q) {
            if (!q) throw aw(gw6);
            if (this.performanceClient?.addQueueMeasurement(m1.RefreshTokenClientAcquireTokenByRefreshToken, q.correlationId), !q.account) throw k7(Ro);
            if (this.cacheManager.isAppMetadataFOCI(q.account.environment)) try {
                return await AY(this.acquireTokenWithCachedRefreshToken.bind(this), m1.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, q.correlationId)(q, !0)
            } catch (_) {
                let z = _ instanceof rh && _.errorCode === Rq6,
                    Y = _ instanceof lV && _.errorCode === qi6.INVALID_GRANT_ERROR && _.subError === qi6.CLIENT_MISMATCH_ERROR;
                if (z || Y) return AY(this.acquireTokenWithCachedRefreshToken.bind(this), m1.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, q.correlationId)(q, !1);
                else throw _
            }
            return AY(this.acquireTokenWithCachedRefreshToken.bind(this), m1.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, q.correlationId)(q, !1)
        }
        async acquireTokenWithCachedRefreshToken(q, K) {
            this.performanceClient?.addQueueMeasurement(m1.RefreshTokenClientAcquireTokenWithCachedRefreshToken, q.correlationId);
            let _ = JLq(this.cacheManager.getRefreshToken.bind(this.cacheManager), m1.CacheManagerGetRefreshToken, this.logger, this.performanceClient, q.correlationId)(q.account, K, q.correlationId, void 0, this.performanceClient);
            if (!_) throw Hv8(Rq6);
            if (_.expiresOn && TV6(_.expiresOn, q.refreshTokenExpirationOffsetSeconds || oo9)) throw this.performanceClient?.addFields({
                rtExpiresOnMs: Number(_.expiresOn)
            }, q.correlationId), Hv8(qr6);
            let z = {
                ...q,
                refreshToken: _.secret,
                authenticationScheme: q.authenticationScheme || hz.BEARER,
                ccsCredential: {
                    credential: q.account.homeAccountId,
                    type: dV.HOME_ACCOUNT_ID
                }
            };
            try {
                return await AY(this.acquireToken.bind(this), m1.RefreshTokenClientAcquireToken, this.logger, this.performanceClient, q.correlationId)(z)
            } catch (Y) {
                if (Y instanceof rh) {
                    if (this.performanceClient?.addFields({
                            rtExpiresOnMs: Number(_.expiresOn)
                        }, q.correlationId), Y.subError === Sq6) {
                        this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");
                        let A = this.cacheManager.generateCredentialKey(_);
                        this.cacheManager.removeRefreshToken(A, q.correlationId)
                    }
                }
                throw Y
            }
        }
        async executeTokenRequest(q, K) {
            this.performanceClient?.addQueueMeasurement(m1.RefreshTokenClientExecuteTokenRequest, q.correlationId);
            let _ = this.createTokenQueryParameters(q),
                z = l9.appendQueryString(K.tokenEndpoint, _),
                Y = await AY(this.createTokenRequestBody.bind(this), m1.RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, q.correlationId)(q),
                A = this.createTokenRequestHeaders(q.ccsCredential),
                O = NV6(this.config.authOptions.clientId, q);
            return AY(this.executePostToTokenEndpoint.bind(this), m1.RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, q.correlationId)(z, Y, A, O, q.correlationId, m1.RefreshTokenClientExecutePostToTokenEndpoint)
        }
        async createTokenRequestBody(q) {
            this.performanceClient?.addQueueMeasurement(m1.RefreshTokenClientCreateTokenRequestBody, q.correlationId);
            let K = new Map;
            if (aw6(K, q.embeddedClientId || q.tokenBodyParameters?.[FQ] || this.config.authOptions.clientId), q.redirectUri) sw6(K, q.redirectUri);
            if (ow6(K, q.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), di6(K, bE.REFRESH_TOKEN_GRANT), q26(K), Bi6(K, this.config.libraryInfo), pi6(K, this.config.telemetry.application), ri6(K), this.serverTelemetryManager && !QG8(this.config)) ii6(K, this.serverTelemetryManager);
            if (lN1(K, q.refreshToken), this.config.clientCredentials.clientSecret) gi6(K, this.config.clientCredentials.clientSecret);
            if (this.config.clientCredentials.clientAssertion) {
                let _ = this.config.clientCredentials.clientAssertion;
                Ui6(K, await nV(_.assertion, this.config.authOptions.clientId, q.resourceRequestUri)), Qi6(K, _.assertionType)
            }
            if (q.authenticationScheme === hz.POP) {
                let _ = new K26(this.cryptoUtils, this.performanceClient),
                    z;
                if (!q.popKid) z = (await AY(_.generateCnf.bind(_), m1.PopTokenGenerateCnf, this.logger, this.performanceClient, q.correlationId)(q, this.logger)).reqCnfString;
                else z = this.cryptoUtils.encodeKid(q.popKid);
                li6(K, z)
            } else if (q.authenticationScheme === hz.SSH)
                if (q.sshJwk) ni6(K, q.sshJwk);
                else throw aw(Io);
            if (!b2.isEmptyObj(q.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) tw6(K, q.claims, this.config.authOptions.clientCapabilities);
            if (this.config.systemOptions.preventCorsPreflight && q.ccsCredential) switch (q.ccsCredential.type) {
                case dV.HOME_ACCOUNT_ID:
                    try {
                        let _ = BQ(q.ccsCredential.credential);
                        mo(K, _)
                    } catch (_) {
                        this.logger.verbose("Could not parse home account ID for CCS Header: " + _)
                    }
                    break;
                case dV.UPN:
                    Lq6(K, q.ccsCredential.credential);
                    break
            }
            if (q.embeddedClientId) po(K, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
            if (q.tokenBodyParameters) Bo(K, q.tokenBodyParameters);
            return rw6(K, q.correlationId, this.performanceClient), pQ(K)
        }
    }
})
// @from(Ln 123532, Col 4)
Wv8
// @from(Ln 123533, Col 4)
TLq = L(() => {
    ti6();
    hq6();
    TP();
    _r6();
    L$();
    Eq6();
    WV6();
    ZB();
    Fo();
    Kv8();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Wv8 = class Wv8 extends Iv {
        constructor(q, K) {
            super(q, K)
        }
        async acquireCachedToken(q) {
            this.performanceClient?.addQueueMeasurement(m1.SilentFlowClientAcquireCachedToken, q.correlationId);
            let K = C2.NOT_APPLICABLE;
            if (q.forceRefresh || !this.config.cacheOptions.claimsBasedCachingEnabled && !b2.isEmptyObj(q.claims)) throw this.setCacheOutcome(C2.FORCE_REFRESH_OR_CLAIMS, q.correlationId), k7(Co);
            if (!q.account) throw k7(Ro);
            let _ = q.account.tenantId || MLq(q.authority),
                z = this.cacheManager.getTokenKeys(),
                Y = this.cacheManager.getAccessToken(q.account, q, z, _);
            if (!Y) throw this.setCacheOutcome(C2.NO_CACHED_ACCESS_TOKEN, q.correlationId), k7(Co);
            else if (rN1(Y.cachedAt) || TV6(Y.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.setCacheOutcome(C2.CACHED_ACCESS_TOKEN_EXPIRED, q.correlationId), k7(Co);
            else if (Y.refreshOn && TV6(Y.refreshOn, 0)) K = C2.PROACTIVELY_REFRESHED;
            let A = q.authority || this.authority.getPreferredCache(),
                O = {
                    account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(q.account), q.correlationId),
                    accessToken: Y,
                    idToken: this.cacheManager.getIdToken(q.account, q.correlationId, z, _, this.performanceClient),
                    refreshToken: null,
                    appMetadata: this.cacheManager.readAppMetadataFromCache(A)
                };
            if (this.setCacheOutcome(K, q.correlationId), this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
            return [await AY(this.generateResultFromCacheRecord.bind(this), m1.SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, q.correlationId)(O, q), K]
        }
        setCacheOutcome(q, K) {
            if (this.serverTelemetryManager?.setCacheOutcome(q), this.performanceClient?.addFields({
                    cacheOutcome: q
                }, K), q !== C2.NOT_APPLICABLE) this.logger.info(`Token refresh is required due to cache outcome: ${q}`)
        }
        async generateResultFromCacheRecord(q, K) {
            this.performanceClient?.addQueueMeasurement(m1.SilentFlowClientGenerateResultFromCacheRecord, K.correlationId);
            let _;
            if (q.idToken) _ = uo(q.idToken.secret, this.config.cryptoInterface.base64Decode);
            if (K.maxAge || K.maxAge === 0) {
                let z = _?.auth_time;
                if (!z) throw k7(ho);
                bi6(z, K.maxAge)
            }
            return wX.generateAuthenticationResult(this.cryptoUtils, this.authority, q, !0, K, _)
        }
    }
})
// @from(Ln 123589, Col 4)
zr6 = {}
// @from(Ln 123597, Col 0)
function ao9(q, K, _, z) {
    let Y = K.correlationId,
        A = new Map;
    aw6(A, K.embeddedClientId || K.extraQueryParameters?.[FQ] || q.clientId);
    let O = [...K.scopes || [], ...K.extraScopesToConsent || []];
    if (ow6(A, O, !0, q.authority.options.OIDCOptions?.defaultScopes), sw6(A, K.redirectUri), ew6(A, Y), pN1(A, K.responseMode), q26(A), K.prompt) QN1(A, K.prompt), z?.addFields({
        prompt: K.prompt
    }, Y);
    if (K.domainHint) UN1(A, K.domainHint), z?.addFields({
        domainHintFromRequest: !0
    }, Y);
    if (K.prompt !== Pq6.SELECT_ACCOUNT) {
        if (K.sid && K.prompt === Pq6.NONE) _.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"), oG8(A, K.sid), z?.addFields({
            sidFromRequest: !0
        }, Y);
        else if (K.account) {
            let w = qa9(K.account),
                $ = Ka9(K.account);
            if ($ && K.domainHint) _.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'), $ = null;
            if ($) {
                _.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"), GV6(A, $), z?.addFields({
                    loginHintFromClaim: !0
                }, Y);
                try {
                    let j = BQ(K.account.homeAccountId);
                    mo(A, j)
                } catch (j) {
                    _.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            } else if (w && K.prompt === Pq6.NONE) {
                _.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"), oG8(A, w), z?.addFields({
                    sidFromClaim: !0
                }, Y);
                try {
                    let j = BQ(K.account.homeAccountId);
                    mo(A, j)
                } catch (j) {
                    _.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            } else if (K.loginHint) _.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"), GV6(A, K.loginHint), Lq6(A, K.loginHint), z?.addFields({
                loginHintFromRequest: !0
            }, Y);
            else if (K.account.username) {
                _.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"), GV6(A, K.account.username), z?.addFields({
                    loginHintFromUpn: !0
                }, Y);
                try {
                    let j = BQ(K.account.homeAccountId);
                    mo(A, j)
                } catch (j) {
                    _.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
                }
            }
        } else if (K.loginHint) _.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"), GV6(A, K.loginHint), Lq6(A, K.loginHint), z?.addFields({
            loginHintFromRequest: !0
        }, Y)
    } else _.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");
    if (K.nonce) dN1(A, K.nonce);
    if (K.state) Fi6(A, K.state);
    if (K.claims || q.clientCapabilities && q.clientCapabilities.length > 0) tw6(A, K.claims, q.clientCapabilities);
    if (K.embeddedClientId) po(A, q.clientId, q.redirectUri);
    if (q.instanceAware && (!K.extraQueryParameters || !Object.keys(K.extraQueryParameters).includes(ZV6))) ci6(A);
    return A
}
// @from(Ln 123662, Col 0)
function so9(q, K, _, z) {
    let Y = pQ(K, _, z);
    return l9.appendQueryString(q.authorizationEndpoint, Y)
}
// @from(Ln 123667, Col 0)
function to9(q, K) {
    if (VLq(q, K), !q.code) throw k7(Iw6);
    return q
}
// @from(Ln 123672, Col 0)
function VLq(q, K) {
    if (!q.state || !K) throw q.state ? k7(fq6, "Cached State") : k7(fq6, "Server State");
    let _, z;
    try {
        _ = decodeURIComponent(q.state)
    } catch (Y) {
        throw k7(DB, q.state)
    }
    try {
        z = decodeURIComponent(K)
    } catch (Y) {
        throw k7(DB, q.state)
    }
    if (_ !== z) throw k7(Nw6);
    if (q.error || q.error_description || q.suberror) {
        let Y = eo9(q);
        if (jv8(q.error, q.error_description, q.suberror)) throw new rh(q.error || "", q.error_description, q.suberror, q.timestamp || "", q.trace_id || "", q.correlation_id || "", q.claims || "", Y);
        throw new lV(q.error || "", q.error_description, q.suberror, Y)
    }
}
// @from(Ln 123693, Col 0)
function eo9(q) {
    let _ = q.error_uri?.lastIndexOf("code=");
    return _ && _ >= 0 ? q.error_uri?.substring(_ + 5) : void 0
}
// @from(Ln 123698, Col 0)
function qa9(q) {
    return q.idTokenClaims?.sid || null
}
// @from(Ln 123702, Col 0)
function Ka9(q) {
    return q.loginHint || q.idTokenClaims?.login_hint || null
}
// @from(Ln 123705, Col 4)
kLq = L(() => {
    vV6();
    fV6();
    L$();
    PV6();
    lw6();
    yq6();
    TP();
    Kr6();
    kV6();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 123718, Col 0)
function _a9(q) {
    let {
        skus: K,
        libraryName: _,
        libraryVersion: z,
        extensionName: Y,
        extensionVersion: A
    } = q, O = new Map([
        [0, [_, z]],
        [2, [Y, A]]
    ]), w = [];
    if (K?.length) {
        if (w = K.split(NLq), w.length < 4) return K
    } else w = Array.from({
        length: 4
    }, () => ELq);
    return O.forEach(($, j) => {
        if ($.length === 2 && $[0]?.length && $[1]?.length) za9({
            skuArr: w,
            index: j,
            skuName: $[0],
            skuVersion: $[1]
        })
    }), w.join(NLq)
}
// @from(Ln 123744, Col 0)
function za9(q) {
    let {
        skuArr: K,
        index: _,
        skuName: z,
        skuVersion: Y
    } = q;
    if (_ >= K.length) return;
    K[_] = [z, Y].join(ELq)
}
// @from(Ln 123754, Col 0)
class Cq6 {
    constructor(q, K) {
        this.cacheOutcome = C2.NOT_APPLICABLE, this.cacheManager = K, this.apiId = q.apiId, this.correlationId = q.correlationId, this.wrapperSKU = q.wrapperSKU || q7.EMPTY_STRING, this.wrapperVer = q.wrapperVer || q7.EMPTY_STRING, this.telemetryCacheKey = FW.CACHE_KEY + Lo.CACHE_KEY_SEPARATOR + q.clientId
    }
    generateCurrentRequestHeaderValue() {
        let q = `${this.apiId}${FW.VALUE_SEPARATOR}${this.cacheOutcome}`,
            K = [this.wrapperSKU, this.wrapperVer],
            _ = this.getNativeBrokerErrorCode();
        if (_?.length) K.push(`broker_error=${_}`);
        let z = K.join(FW.VALUE_SEPARATOR),
            Y = this.getRegionDiscoveryFields(),
            A = [q, Y].join(FW.VALUE_SEPARATOR);
        return [FW.SCHEMA_VERSION, A, z].join(FW.CATEGORY_SEPARATOR)
    }
    generateLastRequestHeaderValue() {
        let q = this.getLastRequests(),
            K = Cq6.maxErrorsToSend(q),
            _ = q.failedRequests.slice(0, 2 * K).join(FW.VALUE_SEPARATOR),
            z = q.errors.slice(0, K).join(FW.VALUE_SEPARATOR),
            Y = q.errors.length,
            A = K < Y ? FW.OVERFLOW_TRUE : FW.OVERFLOW_FALSE,
            O = [Y, A].join(FW.VALUE_SEPARATOR);
        return [FW.SCHEMA_VERSION, q.cacheHits, _, z, O].join(FW.CATEGORY_SEPARATOR)
    }
    cacheFailedRequest(q) {
        let K = this.getLastRequests();
        if (K.errors.length >= FW.MAX_CACHED_ERRORS) K.failedRequests.shift(), K.failedRequests.shift(), K.errors.shift();
        if (K.failedRequests.push(this.apiId, this.correlationId), q instanceof Error && !!q && q.toString())
            if (q instanceof G9)
                if (q.subError) K.errors.push(q.subError);
                else if (q.errorCode) K.errors.push(q.errorCode);
        else K.errors.push(q.toString());
        else K.errors.push(q.toString());
        else K.errors.push(FW.UNKNOWN_ERROR);
        this.cacheManager.setServerTelemetry(this.telemetryCacheKey, K, this.correlationId);
        return
    }
    incrementCacheHits() {
        let q = this.getLastRequests();
        return q.cacheHits += 1, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, q, this.correlationId), q.cacheHits
    }
    getLastRequests() {
        let q = {
            failedRequests: [],
            errors: [],
            cacheHits: 0
        };
        return this.cacheManager.getServerTelemetry(this.telemetryCacheKey) || q
    }
    clearTelemetryCache() {
        let q = this.getLastRequests(),
            K = Cq6.maxErrorsToSend(q),
            _ = q.errors.length;
        if (K === _) this.cacheManager.removeItem(this.telemetryCacheKey, this.correlationId);
        else {
            let z = {
                failedRequests: q.failedRequests.slice(K * 2),
                errors: q.errors.slice(K),
                cacheHits: 0
            };
            this.cacheManager.setServerTelemetry(this.telemetryCacheKey, z, this.correlationId)
        }
    }
    static maxErrorsToSend(q) {
        let K, _ = 0,
            z = 0,
            Y = q.errors.length;
        for (K = 0; K < Y; K++) {
            let A = q.failedRequests[2 * K] || q7.EMPTY_STRING,
                O = q.failedRequests[2 * K + 1] || q7.EMPTY_STRING,
                w = q.errors[K] || q7.EMPTY_STRING;
            if (z += A.toString().length + O.toString().length + w.length + 3, z < FW.MAX_LAST_HEADER_BYTES) _ += 1;
            else break
        }
        return _
    }
    getRegionDiscoveryFields() {
        let q = [];
        return q.push(this.regionUsed || q7.EMPTY_STRING), q.push(this.regionSource || q7.EMPTY_STRING), q.push(this.regionOutcome || q7.EMPTY_STRING), q.join(",")
    }
    updateRegionDiscoveryMetadata(q) {
        this.regionUsed = q.region_used, this.regionSource = q.region_source, this.regionOutcome = q.region_outcome
    }
    setCacheOutcome(q) {
        this.cacheOutcome = q
    }
    setNativeBrokerErrorCode(q) {
        let K = this.getLastRequests();
        K.nativeBrokerErrorCode = q, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, K, this.correlationId)
    }
    getNativeBrokerErrorCode() {
        return this.getLastRequests().nativeBrokerErrorCode
    }
    clearNativeBrokerErrorCode() {
        let q = this.getLastRequests();
        delete q.nativeBrokerErrorCode, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, q, this.correlationId)
    }
    static makeExtraSkuString(q) {
        return _a9(q)
    }
}
// @from(Ln 123855, Col 4)
NLq = ","
// @from(Ln 123856, Col 4)
ELq = "|"
// @from(Ln 123857, Col 4)
yLq = L(() => {
    L$();
    lb(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 123861, Col 4)
cO = L(() => {
    GLq();
    vLq();
    TLq();
    ti6();
    ui6();
    Kv8();
    xG8();
    Ci6();
    sk1();
    pG8();
    yq6();
    Fk1();
    kLq();
    vV6();
    _r6();
    Ri6();
    CG8();
    Kr6();
    wv8();
    lb();
    uk1();
    kV6();
    TP();
    wM();
    Nq6();
    xo();
    L$();
    Eq6();
    yLq();
    WV6();
    qE1();
    eG8();
    hq6();
    lw6();
    fV6();
    AE1();
    Mv8(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 123900, Col 0)
class bq6 {
    static deserializeJSONBlob(q) {
        return !q ? {} : JSON.parse(q)
    }
    static deserializeAccounts(q) {
        let K = {};
        if (q) Object.keys(q).map(function(_) {
            let z = q[_],
                Y = {
                    homeAccountId: z.home_account_id,
                    environment: z.environment,
                    realm: z.realm,
                    localAccountId: z.local_account_id,
                    username: z.username,
                    authorityType: z.authority_type,
                    name: z.name,
                    clientInfo: z.client_info,
                    lastModificationTime: z.last_modification_time,
                    lastModificationApp: z.last_modification_app,
                    tenantProfiles: z.tenantProfiles?.map((O) => {
                        return JSON.parse(O)
                    }),
                    lastUpdatedAt: Date.now().toString()
                },
                A = new VP;
            nw6.toObject(A, Y), K[_] = A
        });
        return K
    }
    static deserializeIdTokens(q) {
        let K = {};
        if (q) Object.keys(q).map(function(_) {
            let z = q[_],
                Y = {
                    homeAccountId: z.home_account_id,
                    environment: z.environment,
                    credentialType: z.credential_type,
                    clientId: z.client_id,
                    secret: z.secret,
                    realm: z.realm,
                    lastUpdatedAt: Date.now().toString()
                };
            K[_] = Y
        });
        return K
    }
    static deserializeAccessTokens(q) {
        let K = {};
        if (q) Object.keys(q).map(function(_) {
            let z = q[_],
                Y = {
                    homeAccountId: z.home_account_id,
                    environment: z.environment,
                    credentialType: z.credential_type,
                    clientId: z.client_id,
                    secret: z.secret,
                    realm: z.realm,
                    target: z.target,
                    cachedAt: z.cached_at,
                    expiresOn: z.expires_on,
                    extendedExpiresOn: z.extended_expires_on,
                    refreshOn: z.refresh_on,
                    keyId: z.key_id,
                    tokenType: z.token_type,
                    requestedClaims: z.requestedClaims,
                    requestedClaimsHash: z.requestedClaimsHash,
                    userAssertionHash: z.userAssertionHash,
                    lastUpdatedAt: Date.now().toString()
                };
            K[_] = Y
        });
        return K
    }
    static deserializeRefreshTokens(q) {
        let K = {};
        if (q) Object.keys(q).map(function(_) {
            let z = q[_],
                Y = {
                    homeAccountId: z.home_account_id,
                    environment: z.environment,
                    credentialType: z.credential_type,
                    clientId: z.client_id,
                    secret: z.secret,
                    familyId: z.family_id,
                    target: z.target,
                    realm: z.realm,
                    lastUpdatedAt: Date.now().toString()
                };
            K[_] = Y
        });
        return K
    }
    static deserializeAppMetadata(q) {
        let K = {};
        if (q) Object.keys(q).map(function(_) {
            let z = q[_];
            K[_] = {
                clientId: z.client_id,
                environment: z.environment,
                familyId: z.family_id
            }
        });
        return K
    }
    static deserializeAllCache(q) {
        return {
            accounts: q.Account ? this.deserializeAccounts(q.Account) : {},
            idTokens: q.IdToken ? this.deserializeIdTokens(q.IdToken) : {},
            accessTokens: q.AccessToken ? this.deserializeAccessTokens(q.AccessToken) : {},
            refreshTokens: q.RefreshToken ? this.deserializeRefreshTokens(q.RefreshToken) : {},
            appMetadata: q.AppMetadata ? this.deserializeAppMetadata(q.AppMetadata) : {}
        }
    }
}
// @from(Ln 124014, Col 4)
Dv8 = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124017, Col 4)
OE1 = {}
// @from(Ln 124022, Col 4)
LLq = L(() => {
    LG8();
    Dv8(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124026, Col 4)
hLq = "system_assigned_managed_identity"
// @from(Ln 124027, Col 4)
Ha9 = "managed_identity"
// @from(Ln 124028, Col 4)
wE1
// @from(Ln 124028, Col 9)
xE
// @from(Ln 124028, Col 13)
kP
// @from(Ln 124028, Col 17)
b3
// @from(Ln 124028, Col 21)
s3
// @from(Ln 124028, Col 25)
wJ
// @from(Ln 124028, Col 29)
$j
// @from(Ln 124028, Col 33)
Zv8
// @from(Ln 124028, Col 38)
RLq = "REGION_NAME"
// @from(Ln 124029, Col 4)
SLq = "MSAL_FORCE_REGION"
// @from(Ln 124030, Col 4)
CLq = 32
// @from(Ln 124031, Col 4)
bLq
// @from(Ln 124031, Col 9)
fv8
// @from(Ln 124031, Col 14)
$E1
// @from(Ln 124031, Col 19)
iV
// @from(Ln 124031, Col 23)
Uo
// @from(Ln 124031, Col 27)
rb
// @from(Ln 124031, Col 31)
Gv8
// @from(Ln 124031, Col 36)
ILq = 4096
// @from(Ln 124032, Col 4)
jj = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    wE1 = `https://login.microsoftonline.com/${Ha9}/`, xE = {
        AUTHORIZATION_HEADER_NAME: "Authorization",
        METADATA_HEADER_NAME: "Metadata",
        APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
        ML_AND_SF_SECRET_HEADER_NAME: "secret"
    }, kP = {
        API_VERSION: "api-version",
        RESOURCE: "resource",
        SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
        XMS_CC: "xms_cc"
    }, b3 = {
        AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
        DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
        IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
        IDENTITY_HEADER: "IDENTITY_HEADER",
        IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
        IMDS_ENDPOINT: "IMDS_ENDPOINT",
        MSI_ENDPOINT: "MSI_ENDPOINT",
        MSI_SECRET: "MSI_SECRET"
    }, s3 = {
        APP_SERVICE: "AppService",
        AZURE_ARC: "AzureArc",
        CLOUD_SHELL: "CloudShell",
        DEFAULT_TO_IMDS: "DefaultToImds",
        IMDS: "Imds",
        MACHINE_LEARNING: "MachineLearning",
        SERVICE_FABRIC: "ServiceFabric"
    }, wJ = {
        SYSTEM_ASSIGNED: "system-assigned",
        USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
        USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
        USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
    }, $j = {
        GET: "get",
        POST: "post"
    }, Zv8 = {
        SUCCESS_RANGE_START: f9.SUCCESS_RANGE_START,
        SUCCESS_RANGE_END: f9.SUCCESS_RANGE_END,
        SERVER_ERROR: f9.SERVER_ERROR
    }, bLq = {
        SHA256: "sha256"
    }, fv8 = {
        CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    }, $E1 = {
        KEY_SEPARATOR: "-"
    }, iV = {
        MSAL_SKU: "msal.js.node",
        JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        AUTHORIZATION_PENDING: "authorization_pending",
        HTTP_PROTOCOL: "http://",
        LOCALHOST: "localhost"
    }, Uo = {
        acquireTokenSilent: 62,
        acquireTokenByUsernamePassword: 371,
        acquireTokenByDeviceCode: 671,
        acquireTokenByClientCredential: 771,
        acquireTokenByCode: 871,
        acquireTokenByRefreshToken: 872
    }, rb = {
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
    }, Gv8 = {
        INTERVAL_MS: 100,
        TIMEOUT_MS: 5000
    }
})
// @from(Ln 124109, Col 0)
class Yr6 {
    static getNetworkResponse(q, K, _) {
        return {
            headers: q,
            body: K,
            status: _
        }
    }
    static urlToHttpOptions(q) {
        let K = {
            protocol: q.protocol,
            hostname: q.hostname && q.hostname.startsWith("[") ? q.hostname.slice(1, -1) : q.hostname,
            hash: q.hash,
            search: q.search,
            pathname: q.pathname,
            path: `${q.pathname||""}${q.search||""}`,
            href: q.href
        };
        if (q.port !== "") K.port = Number(q.port);
        if (q.username || q.password) K.auth = `${decodeURIComponent(q.username)}:${decodeURIComponent(q.password)}`;
        return K
    }
}
// @from(Ln 124132, Col 4)
xLq = L(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 124136, Col 0)
class Ar6 {
    constructor(q, K) {
        this.proxyUrl = q || "", this.customAgentOptions = K || {}
    }
    async sendGetRequestAsync(q, K, _) {
        if (this.proxyUrl) return mLq(q, this.proxyUrl, $j.GET, K, this.customAgentOptions, _);
        else return BLq(q, $j.GET, K, this.customAgentOptions, _)
    }
    async sendPostRequestAsync(q, K) {
        if (this.proxyUrl) return mLq(q, this.proxyUrl, $j.POST, K, this.customAgentOptions);
        else return BLq(q, $j.POST, K, this.customAgentOptions)
    }
}
// @from(Ln 124149, Col 4)
mLq = (q, K, _, z, Y, A) => {
        let O = new URL(q),
            w = new URL(K),
            $ = z?.headers || {},
            j = {
                host: w.hostname,
                port: w.port,
                method: "CONNECT",
                path: O.hostname,
                headers: $
            };
        if (Y && Object.keys(Y).length) j.agent = new jE1.Agent(Y);
        let H = "";
        if (_ === $j.POST) {
            let X = z?.body || "";
            H = `Content-Type: application/x-www-form-urlencoded\r
Content-Length: ${X.length}\r
\r
${X}`
        } else if (A) j.timeout = A;
        let J = `${_.toUpperCase()} ${O.href} HTTP/1.1\r
Host: ${O.host}\r
Connection: close\r
` + H + `\r
`;
        return new Promise((X, M) => {
            let P = jE1.request(j);
            if (A) P.on("timeout", () => {
                P.destroy(), M(Error("Request time out"))
            });
            P.end(), P.on("connect", (W, D) => {
                let Z = W?.statusCode || Zv8.SERVER_ERROR;
                if (Z < Zv8.SUCCESS_RANGE_START || Z > Zv8.SUCCESS_RANGE_END) P.destroy(), D.destroy(), M(Error(`Error connecting to proxy. Http status code: ${W.statusCode}. Http status message: ${W?.statusMessage||"Unknown"}`));
                D.write(J);
                let G = [];
                D.on("data", (f) => {
                    G.push(f)
                }), D.on("end", () => {
                    let v = Buffer.concat([...G]).toString().split(`\r
`),
                        V = parseInt(v[0].split(" ")[1]),
                        k = v[0].split(" ").slice(2).join(" "),
                        N = v[v.length - 1],
                        R = v.slice(1, v.length - 2),
                        h = new Map;
                    R.forEach((m) => {
                        let S = m.split(new RegExp(/:\s(.*)/s)),
                            F = S[0],
                            U = S[1];
                        try {
                            let g = JSON.parse(U);
                            if (g && typeof g === "object") U = g
                        } catch (g) {}
                        h.set(F, U)
                    });
                    let x = Object.fromEntries(h),
                        B = Yr6.getNetworkResponse(x, pLq(V, k, x, N), V);
                    if ((V < f9.SUCCESS_RANGE_START || V > f9.SUCCESS_RANGE_END) && B.body.error !== iV.AUTHORIZATION_PENDING) P.destroy();
                    X(B)
                }), D.on("error", (f) => {
                    P.destroy(), D.destroy(), M(Error(f.toString()))
                })
            }), P.on("error", (W) => {
                P.destroy(), M(Error(W.toString()))
            })
        })
    }
// @from(Ln 124216, Col 4)
BLq = (q, K, _, z, Y) => {
        let A = K === $j.POST,
            O = _?.body || "",
            w = new URL(q),
            $ = _?.headers || {},
            j = {
                method: K,
                headers: $,
                ...Yr6.urlToHttpOptions(w)
            };
        if (z && Object.keys(z).length) j.agent = new uLq.Agent(z);
        if (A) j.headers = {
            ...j.headers,
            "Content-Length": O.length
        };
        else if (Y) j.timeout = Y;
        return new Promise((H, J) => {
            let X;
            if (j.protocol === "http:") X = jE1.request(j);
            else X = uLq.request(j);
            if (A) X.write(O);
            if (Y) X.on("timeout", () => {
                X.destroy(), J(Error("Request time out"))
            });
            X.end(), X.on("response", (M) => {
                let {
                    headers: P,
                    statusCode: W,
                    statusMessage: D
                } = M, Z = [];
                M.on("data", (G) => {
                    Z.push(G)
                }), M.on("end", () => {
                    let G = Buffer.concat([...Z]).toString(),
                        f = P,
                        v = Yr6.getNetworkResponse(f, pLq(W, D, f, G), W);
                    if ((W < f9.SUCCESS_RANGE_START || W > f9.SUCCESS_RANGE_END) && v.body.error !== iV.AUTHORIZATION_PENDING) X.destroy();
                    H(v)
                })
            }), X.on("error", (M) => {
                X.destroy(), J(Error(M.toString()))
            })
        })
    }
// @from(Ln 124260, Col 4)
pLq = (q, K, _, z) => {
        let Y;
        try {
            Y = JSON.parse(z)
        } catch (A) {
            let O, w;
            if (q >= f9.CLIENT_ERROR_RANGE_START && q <= f9.CLIENT_ERROR_RANGE_END) O = "client_error", w = "A client";
            else if (q >= f9.SERVER_ERROR_RANGE_START && q <= f9.SERVER_ERROR_RANGE_END) O = "server_error", w = "A server";
            else O = "unknown_error", w = "An unknown";
            Y = {
                error: O,
                error_description: `${w} error occured.
Http status code: ${q}
Http status message: ${K||"Unknown"}
Headers: ${JSON.stringify(_)}`
            }
        }
        return Y
    }
// @from(Ln 124279, Col 4)
FLq = L(() => {
    cO();
    jj();
    xLq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124284, Col 4)
vv8 = "invalid_file_extension"
// @from(Ln 124285, Col 4)
Tv8 = "invalid_file_path"
// @from(Ln 124286, Col 4)
Iq6 = "invalid_managed_identity_id_type"
// @from(Ln 124287, Col 4)
Vv8 = "invalid_secret"
// @from(Ln 124288, Col 4)
gLq = "missing_client_id"
// @from(Ln 124289, Col 4)
ULq = "network_unavailable"
// @from(Ln 124290, Col 4)
kv8 = "platform_not_supported"
// @from(Ln 124291, Col 4)
Nv8 = "unable_to_create_azure_arc"
// @from(Ln 124292, Col 4)
Ev8 = "unable_to_create_cloud_shell"
// @from(Ln 124293, Col 4)
yv8 = "unable_to_create_source"
// @from(Ln 124294, Col 4)
Or6 = "unable_to_read_secret_file"
// @from(Ln 124295, Col 4)
QLq = "user_assigned_not_available_at_runtime"
// @from(Ln 124296, Col 4)
Lv8 = "www_authenticate_header_missing"
// @from(Ln 124297, Col 4)
hv8 = "www_authenticate_header_unsupported_format"
// @from(Ln 124298, Col 4)
_26
// @from(Ln 124299, Col 4)
z26 = L(() => {
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    _26 = {
        [b3.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
        [b3.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
        [b3.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
        [b3.MSI_ENDPOINT]: "msi_endpoint_url_malformed"
    }
})
// @from(Ln 124309, Col 0)
function $M(q) {
    return new HE1(q)
}
// @from(Ln 124312, Col 4)
Ja9
// @from(Ln 124312, Col 9)
HE1
// @from(Ln 124313, Col 4)
yV6 = L(() => {
    cO();
    z26();
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Ja9 = {
        [vv8]: "The file path in the WWW-Authenticate header does not contain a .key file.",
        [Tv8]: "The file path in the WWW-Authenticate header is not in a valid Windows or Linux Format.",
        [Iq6]: "More than one ManagedIdentityIdType was provided.",
        [Vv8]: "The secret in the file on the file path in the WWW-Authenticate header is greater than 4096 bytes.",
        [kv8]: "The platform is not supported by Azure Arc. Azure Arc only supports Windows and Linux.",
        [gLq]: "A ManagedIdentityId id was not provided.",
        [_26.AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${b3.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
        [_26.IDENTITY_ENDPOINT]: `The Managed Identity's '${b3.IDENTITY_ENDPOINT}' environment variable is malformed.`,
        [_26.IMDS_ENDPOINT]: `The Managed Identity's '${b3.IMDS_ENDPOINT}' environment variable is malformed.`,
        [_26.MSI_ENDPOINT]: `The Managed Identity's '${b3.MSI_ENDPOINT}' environment variable is malformed.`,
        [ULq]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
        [Nv8]: "Azure Arc Managed Identities can only be system assigned.",
        [Ev8]: "Cloud Shell Managed Identities can only be system assigned.",
        [yv8]: "Unable to create a Managed Identity source based on environment variables.",
        [Or6]: "Unable to read the secret file.",
        [QLq]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
        [Lv8]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
        [hv8]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format."
    };
    HE1 = class HE1 extends G9 {
        constructor(q) {
            super(q, Ja9[q]);
            this.name = "ManagedIdentityError", Object.setPrototypeOf(this, HE1.prototype)
        }
    }
})
// @from(Ln 124344, Col 0)
class JE1 {
    get id() {
        return this._id
    }
    set id(q) {
        this._id = q
    }
    get idType() {
        return this._idType
    }
    set idType(q) {
        this._idType = q
    }
    constructor(q) {
        let K = q?.userAssignedClientId,
            _ = q?.userAssignedResourceId,
            z = q?.userAssignedObjectId;
        if (K) {
            if (_ || z) throw $M(Iq6);
            this.id = K, this.idType = wJ.USER_ASSIGNED_CLIENT_ID
        } else if (_) {
            if (K || z) throw $M(Iq6);
            this.id = _, this.idType = wJ.USER_ASSIGNED_RESOURCE_ID
        } else if (z) {
            if (K || _) throw $M(Iq6);
            this.id = z, this.idType = wJ.USER_ASSIGNED_OBJECT_ID
        } else this.id = hLq, this.idType = wJ.SYSTEM_ASSIGNED
    }
}
// @from(Ln 124373, Col 4)
dLq = L(() => {
    yV6();
    jj();
    z26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124378, Col 4)
NP
// @from(Ln 124378, Col 8)
YH
// @from(Ln 124379, Col 4)
wr6 = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    NP = {
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
    YH = class YH extends G9 {
        constructor(q, K) {
            super(q, K);
            this.name = "NodeAuthError"
        }
        static createInvalidLoopbackAddressTypeError() {
            return new YH(NP.invalidLoopbackAddressType.code, `${NP.invalidLoopbackAddressType.desc}`)
        }
        static createUnableToLoadRedirectUrlError() {
            return new YH(NP.unableToLoadRedirectUri.code, `${NP.unableToLoadRedirectUri.desc}`)
        }
        static createNoAuthCodeInResponseError() {
            return new YH(NP.noAuthCodeInResponse.code, `${NP.noAuthCodeInResponse.desc}`)
        }
        static createNoLoopbackServerExistsError() {
            return new YH(NP.noLoopbackServerExists.code, `${NP.noLoopbackServerExists.desc}`)
        }
        static createLoopbackServerAlreadyExistsError() {
            return new YH(NP.loopbackServerAlreadyExists.code, `${NP.loopbackServerAlreadyExists.desc}`)
        }
        static createLoopbackServerTimeoutError() {
            return new YH(NP.loopbackServerTimeout.code, `${NP.loopbackServerTimeout.desc}`)
        }
        static createStateNotFoundError() {
            return new YH(NP.stateNotFoundError.code, NP.stateNotFoundError.desc)
        }
        static createThumbprintMissingError() {
            return new YH(NP.thumbprintMissing.code, NP.thumbprintMissing.desc)
        }
        static createRedirectUriNotSupportedError() {
            return new YH(NP.redirectUriNotSupported.code, NP.redirectUriNotSupported.desc)
        }
    }
})
// @from(Ln 124454, Col 0)
function cLq({
    auth: q,
    broker: K,
    cache: _,
    system: z,
    telemetry: Y
}) {
    let A = {
        ...Pa9,
        networkClient: new Ar6(z?.proxyUrl, z?.customAgentOptions),
        loggerOptions: z?.loggerOptions || XE1,
        disableInternalRetries: z?.disableInternalRetries || !1
    };
    if (!!q.clientCertificate && !q.clientCertificate.thumbprint && !q.clientCertificate.thumbprintSha256) throw YH.createStateNotFoundError();
    return {
        auth: {
            ...Xa9,
            ...q
        },
        broker: {
            ...K
        },
        cache: {
            ...Ma9,
            ..._
        },
        system: {
            ...A,
            ...z
        },
        telemetry: {
            ...Wa9,
            ...Y
        }
    }
}
// @from(Ln 124491, Col 0)
function lLq({
    clientCapabilities: q,
    managedIdentityIdParams: K,
    system: _
}) {
    let z = new JE1(K),
        Y = _?.loggerOptions || XE1,
        A;
    if (_?.networkClient) A = _.networkClient;
    else A = new Ar6(_?.proxyUrl, _?.customAgentOptions);
    return {
        clientCapabilities: q || [],
        managedIdentityId: z,
        system: {
            loggerOptions: Y,
            networkClient: A
        },
        disableInternalRetries: _?.disableInternalRetries || !1
    }
}
// @from(Ln 124511, Col 4)
Xa9
// @from(Ln 124511, Col 9)
Ma9
// @from(Ln 124511, Col 14)
XE1
// @from(Ln 124511, Col 19)
Pa9
// @from(Ln 124511, Col 24)
Wa9
// @from(Ln 124512, Col 4)
ME1 = L(() => {
    cO();
    FLq();
    dLq();
    wr6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Xa9 = {
        clientId: q7.EMPTY_STRING,
        authority: q7.DEFAULT_AUTHORITY,
        clientSecret: q7.EMPTY_STRING,
        clientAssertion: q7.EMPTY_STRING,
        clientCertificate: {
            thumbprint: q7.EMPTY_STRING,
            thumbprintSha256: q7.EMPTY_STRING,
            privateKey: q7.EMPTY_STRING,
            x5c: q7.EMPTY_STRING
        },
        knownAuthorities: [],
        cloudDiscoveryMetadata: q7.EMPTY_STRING,
        authorityMetadata: q7.EMPTY_STRING,
        clientCapabilities: [],
        protocolMode: bv.AAD,
        azureCloudOptions: {
            azureCloudInstance: bo.None,
            tenant: q7.EMPTY_STRING
        },
        skipAuthorityMetadataCache: !1,
        encodeExtraQueryParams: !1
    }, Ma9 = {
        claimsBasedCachingEnabled: !1
    }, XE1 = {
        loggerCallback: () => {},
        piiLoggingEnabled: !1,
        logLevel: OJ.Info
    }, Pa9 = {
        loggerOptions: XE1,
        networkClient: new Ar6,
        proxyUrl: q7.EMPTY_STRING,
        customAgentOptions: {},
        disableInternalRetries: !1
    }, Wa9 = {
        application: {
            appName: q7.EMPTY_STRING,
            appVersion: q7.EMPTY_STRING
        }
    }
})
// @from(Ln 124558, Col 4)
PE1 = p((nLq) => {
    Object.defineProperty(nLq, "__esModule", {
        value: !0
    });
    nLq.default = fa9;
    var Da9 = Za9(d6("crypto"));

    function Za9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var Sv8 = new Uint8Array(256),
        Rv8 = Sv8.length;

    function fa9() {
        if (Rv8 > Sv8.length - 16) Da9.default.randomFillSync(Sv8), Rv8 = 0;
        return Sv8.slice(Rv8, Rv8 += 16)
    }
})
// @from(Ln 124578, Col 4)
oLq = p((iLq) => {
    Object.defineProperty(iLq, "__esModule", {
        value: !0
    });
    iLq.default = void 0;
    var va9 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    iLq.default = va9
})
// @from(Ln 124586, Col 4)
$r6 = p((aLq) => {
    Object.defineProperty(aLq, "__esModule", {
        value: !0
    });
    aLq.default = void 0;
    var Ta9 = Va9(oLq());

    function Va9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function ka9(q) {
        return typeof q === "string" && Ta9.default.test(q)
    }
    var Na9 = ka9;
    aLq.default = Na9
})
// @from(Ln 124605, Col 4)
jr6 = p((tLq) => {
    Object.defineProperty(tLq, "__esModule", {
        value: !0
    });
    tLq.default = void 0;
    var Ea9 = ya9($r6());

    function ya9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var Jf = [];
    for (let q = 0; q < 256; ++q) Jf.push((q + 256).toString(16).substr(1));

    function La9(q, K = 0) {
        let _ = (Jf[q[K + 0]] + Jf[q[K + 1]] + Jf[q[K + 2]] + Jf[q[K + 3]] + "-" + Jf[q[K + 4]] + Jf[q[K + 5]] + "-" + Jf[q[K + 6]] + Jf[q[K + 7]] + "-" + Jf[q[K + 8]] + Jf[q[K + 9]] + "-" + Jf[q[K + 10]] + Jf[q[K + 11]] + Jf[q[K + 12]] + Jf[q[K + 13]] + Jf[q[K + 14]] + Jf[q[K + 15]]).toLowerCase();
        if (!(0, Ea9.default)(_)) throw TypeError("Stringified UUID is invalid");
        return _
    }
    var ha9 = La9;
    tLq.default = ha9
})