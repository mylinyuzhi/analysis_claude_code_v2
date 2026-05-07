
// @from(Ln 119425, Col 4)
Gq6 = "empty_input_scopeset"
// @from(Ln 119426, Col 4)
Oi6 = "device_code_polling_cancelled"
// @from(Ln 119427, Col 4)
wi6 = "device_code_expired"
// @from(Ln 119428, Col 4)
$i6 = "device_code_unknown_error"
// @from(Ln 119429, Col 4)
Ro = "no_account_in_silent_request"
// @from(Ln 119430, Col 4)
Cw6 = "invalid_cache_record"
// @from(Ln 119431, Col 4)
So = "invalid_cache_environment"
// @from(Ln 119432, Col 4)
ji6 = "no_account_found"
// @from(Ln 119433, Col 4)
vq6 = "no_crypto_object"
// @from(Ln 119434, Col 4)
Hi6 = "unexpected_credential_type"
// @from(Ln 119435, Col 4)
Ji6 = "invalid_assertion"
// @from(Ln 119436, Col 4)
Xi6 = "invalid_client_credential"
// @from(Ln 119437, Col 4)
Co = "token_refresh_required"
// @from(Ln 119438, Col 4)
Mi6 = "user_timeout_reached"
// @from(Ln 119439, Col 4)
bw6 = "token_claims_cnf_required_for_signedjwt"
// @from(Ln 119440, Col 4)
Iw6 = "authorization_code_missing_from_server_response"
// @from(Ln 119441, Col 4)
Pi6 = "binding_key_not_removed"
// @from(Ln 119442, Col 4)
xw6 = "end_session_endpoint_not_supported"
// @from(Ln 119443, Col 4)
uw6 = "key_id_missing"
// @from(Ln 119444, Col 4)
Wi6 = "no_network_connectivity"
// @from(Ln 119445, Col 4)
Di6 = "user_canceled"
// @from(Ln 119446, Col 4)
Zi6 = "missing_tenant_id_error"
// @from(Ln 119447, Col 4)
V_ = "method_not_implemented"
// @from(Ln 119448, Col 4)
fi6 = "nested_app_auth_bridge_disabled"
// @from(Ln 119449, Col 4)
wM = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 119452, Col 0)
function k7(q, K) {
    return new Tq6(q, K)
}
// @from(Ln 119455, Col 4)
v9
// @from(Ln 119455, Col 8)
pk1
// @from(Ln 119455, Col 13)
Tq6
// @from(Ln 119456, Col 4)
TP = L(() => {
    lb();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    v9 = {
        [Dq6]: "The client info could not be parsed/decoded correctly",
        [Gw6]: "The client info was empty",
        [Zq6]: "Token cannot be parsed",
        [vw6]: "The token is null or empty",
        [QV]: "Endpoints cannot be resolved",
        [Tw6]: "Network request failed",
        [Vw6]: "Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints.",
        [kw6]: "The hash parameters could not be deserialized",
        [DB]: "State was not the expected format",
        [Nw6]: "State mismatch error",
        [fq6]: "State not found",
        [Ew6]: "Nonce mismatch error",
        [ho]: "Max Age was requested and the ID token is missing the auth_time variable. auth_time is an optional claim and is not enabled by default - it must be enabled. See https://aka.ms/msaljs/optional-claims for more information.",
        [yw6]: "Max Age is set to 0, or too much time has elapsed since the last end-user authentication.",
        [Yi6]: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account.",
        [Ai6]: "The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account",
        [Lw6]: "The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata",
        [hw6]: "Token request cannot be made without authorization code or refresh token.",
        [Rw6]: "Cannot remove null or empty scope from ScopeSet",
        [Sw6]: "Cannot append ScopeSet",
        [Gq6]: "Empty input ScopeSet cannot be processed",
        [Oi6]: "Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true.",
        [wi6]: "Device code is expired.",
        [$i6]: "Device code stopped polling for unknown reasons.",
        [Ro]: "Please pass an account object, silent flow is not supported without account information",
        [Cw6]: "Cache record object was null or undefined.",
        [So]: "Invalid environment when attempting to create cache entry",
        [ji6]: "No account found in cache for given key.",
        [vq6]: "No crypto object detected.",
        [Hi6]: "Unexpected credential type.",
        [Ji6]: "Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515",
        [Xi6]: "Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential",
        [Co]: "Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired.",
        [Mi6]: "User defined timeout for device code polling reached",
        [bw6]: "Cannot generate a POP jwt if the token_claims are not populated",
        [Iw6]: "Server response does not contain an authorization code to proceed",
        [Pi6]: "Could not remove the credential's binding key from storage.",
        [xw6]: "The provided authority does not support logout",
        [uw6]: "A keyId value is missing from the requested bound token's cache record and is required to match the token to it's stored binding key.",
        [Wi6]: "No network connectivity. Check your internet connection.",
        [Di6]: "User cancelled the flow.",
        [Zi6]: "A tenant id - not common, organizations, or consumers - must be specified when using the client_credentials flow.",
        [V_]: "This method has not been implemented",
        [fi6]: "The nested app auth bridge is disabled"
    }, pk1 = {
        clientInfoDecodingError: {
            code: Dq6,
            desc: v9[Dq6]
        },
        clientInfoEmptyError: {
            code: Gw6,
            desc: v9[Gw6]
        },
        tokenParsingError: {
            code: Zq6,
            desc: v9[Zq6]
        },
        nullOrEmptyToken: {
            code: vw6,
            desc: v9[vw6]
        },
        endpointResolutionError: {
            code: QV,
            desc: v9[QV]
        },
        networkError: {
            code: Tw6,
            desc: v9[Tw6]
        },
        unableToGetOpenidConfigError: {
            code: Vw6,
            desc: v9[Vw6]
        },
        hashNotDeserialized: {
            code: kw6,
            desc: v9[kw6]
        },
        invalidStateError: {
            code: DB,
            desc: v9[DB]
        },
        stateMismatchError: {
            code: Nw6,
            desc: v9[Nw6]
        },
        stateNotFoundError: {
            code: fq6,
            desc: v9[fq6]
        },
        nonceMismatchError: {
            code: Ew6,
            desc: v9[Ew6]
        },
        authTimeNotFoundError: {
            code: ho,
            desc: v9[ho]
        },
        maxAgeTranspired: {
            code: yw6,
            desc: v9[yw6]
        },
        multipleMatchingTokens: {
            code: Yi6,
            desc: v9[Yi6]
        },
        multipleMatchingAccounts: {
            code: Ai6,
            desc: v9[Ai6]
        },
        multipleMatchingAppMetadata: {
            code: Lw6,
            desc: v9[Lw6]
        },
        tokenRequestCannotBeMade: {
            code: hw6,
            desc: v9[hw6]
        },
        removeEmptyScopeError: {
            code: Rw6,
            desc: v9[Rw6]
        },
        appendScopeSetError: {
            code: Sw6,
            desc: v9[Sw6]
        },
        emptyInputScopeSetError: {
            code: Gq6,
            desc: v9[Gq6]
        },
        DeviceCodePollingCancelled: {
            code: Oi6,
            desc: v9[Oi6]
        },
        DeviceCodeExpired: {
            code: wi6,
            desc: v9[wi6]
        },
        DeviceCodeUnknownError: {
            code: $i6,
            desc: v9[$i6]
        },
        NoAccountInSilentRequest: {
            code: Ro,
            desc: v9[Ro]
        },
        invalidCacheRecord: {
            code: Cw6,
            desc: v9[Cw6]
        },
        invalidCacheEnvironment: {
            code: So,
            desc: v9[So]
        },
        noAccountFound: {
            code: ji6,
            desc: v9[ji6]
        },
        noCryptoObj: {
            code: vq6,
            desc: v9[vq6]
        },
        unexpectedCredentialType: {
            code: Hi6,
            desc: v9[Hi6]
        },
        invalidAssertion: {
            code: Ji6,
            desc: v9[Ji6]
        },
        invalidClientCredential: {
            code: Xi6,
            desc: v9[Xi6]
        },
        tokenRefreshRequired: {
            code: Co,
            desc: v9[Co]
        },
        userTimeoutReached: {
            code: Mi6,
            desc: v9[Mi6]
        },
        tokenClaimsRequired: {
            code: bw6,
            desc: v9[bw6]
        },
        noAuthorizationCodeFromServer: {
            code: Iw6,
            desc: v9[Iw6]
        },
        bindingKeyNotRemovedError: {
            code: Pi6,
            desc: v9[Pi6]
        },
        logoutNotSupported: {
            code: xw6,
            desc: v9[xw6]
        },
        keyIdMissing: {
            code: uw6,
            desc: v9[uw6]
        },
        noNetworkConnectivity: {
            code: Wi6,
            desc: v9[Wi6]
        },
        userCanceledError: {
            code: Di6,
            desc: v9[Di6]
        },
        missingTenantIdError: {
            code: Zi6,
            desc: v9[Zi6]
        },
        nestedAppAuthBridgeDisabled: {
            code: fi6,
            desc: v9[fi6]
        }
    };
    Tq6 = class Tq6 extends G9 {
        constructor(q, K) {
            super(q, K ? `${v9[q]}: ${K}` : v9[q]);
            this.name = "ClientAuthError", Object.setPrototypeOf(this, Tq6.prototype)
        }
    }
})
// @from(Ln 119685, Col 4)
jV6
// @from(Ln 119686, Col 4)
Fk1 = L(() => {
    TP();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    jV6 = {
        createNewGuid: () => {
            throw k7(V_)
        },
        base64Decode: () => {
            throw k7(V_)
        },
        base64Encode: () => {
            throw k7(V_)
        },
        base64UrlEncode: () => {
            throw k7(V_)
        },
        encodeKid: () => {
            throw k7(V_)
        },
        async getPublicKeyThumbprint() {
            throw k7(V_)
        },
        async removeTokenBindingKey() {
            throw k7(V_)
        },
        async clearKeystore() {
            throw k7(V_)
        },
        async signJwt() {
            throw k7(V_)
        },
        async hashString() {
            throw k7(V_)
        }
    }
})
// @from(Ln 119722, Col 0)
class IE {
    constructor(q, K, _) {
        this.level = OJ.Info;
        let z = () => {
                return
            },
            Y = q || IE.createDefaultLoggerOptions();
        this.localCallback = Y.loggerCallback || z, this.piiLoggingEnabled = Y.piiLoggingEnabled || !1, this.level = typeof Y.logLevel === "number" ? Y.logLevel : OJ.Info, this.correlationId = Y.correlationId || q7.EMPTY_STRING, this.packageName = K || q7.EMPTY_STRING, this.packageVersion = _ || q7.EMPTY_STRING
    }
    static createDefaultLoggerOptions() {
        return {
            loggerCallback: () => {},
            piiLoggingEnabled: !1,
            logLevel: OJ.Info
        }
    }
    clone(q, K, _) {
        return new IE({
            loggerCallback: this.localCallback,
            piiLoggingEnabled: this.piiLoggingEnabled,
            logLevel: this.level,
            correlationId: _ || this.correlationId
        }, q, K)
    }
    logMessage(q, K) {
        if (K.logLevel > this.level || !this.piiLoggingEnabled && K.containsPii) return;
        let Y = `${`[${new Date().toUTCString()}] : [${K.correlationId||this.correlationId||""}]`} : ${this.packageName}@${this.packageVersion} : ${OJ[K.logLevel]} - ${q}`;
        this.executeCallback(K.logLevel, Y, K.containsPii || !1)
    }
    executeCallback(q, K, _) {
        if (this.localCallback) this.localCallback(q, K, _)
    }
    error(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Error,
            containsPii: !1,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    errorPii(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Error,
            containsPii: !0,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    warning(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Warning,
            containsPii: !1,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    warningPii(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Warning,
            containsPii: !0,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    info(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Info,
            containsPii: !1,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    infoPii(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Info,
            containsPii: !0,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    verbose(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Verbose,
            containsPii: !1,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    verbosePii(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Verbose,
            containsPii: !0,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    trace(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Trace,
            containsPii: !1,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    tracePii(q, K) {
        this.logMessage(q, {
            logLevel: OJ.Trace,
            containsPii: !0,
            correlationId: K || q7.EMPTY_STRING
        })
    }
    isPiiLoggingEnabled() {
        return this.piiLoggingEnabled || !1
    }
}
// @from(Ln 119828, Col 4)
OJ
// @from(Ln 119829, Col 4)
CG8 = L(() => {
    L$(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    (function(q) {
        q[q.Error = 0] = "Error", q[q.Warning = 1] = "Warning", q[q.Info = 2] = "Info", q[q.Verbose = 3] = "Verbose", q[q.Trace = 4] = "Trace"
    })(OJ || (OJ = {}))
})
// @from(Ln 119835, Col 4)
bG8 = "@azure/msal-common"
// @from(Ln 119836, Col 4)
HV6 = "15.13.1"
// @from(Ln 119837, Col 4)
IG8 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 119839, Col 4)
bo
// @from(Ln 119840, Col 4)
xG8 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    bo = {
        None: "none",
        AzurePublic: "https://login.microsoftonline.com",
        AzurePpe: "https://login.windows-ppe.net",
        AzureChina: "https://login.chinacloudapi.cn",
        AzureGermany: "https://login.microsoftonline.de",
        AzureUsGovernment: "https://login.microsoftonline.us"
    }
})
// @from(Ln 119851, Col 4)
JV6 = {}
// @from(Ln 119877, Col 4)
mw6 = "redirect_uri_empty"
// @from(Ln 119878, Col 4)
Gi6 = "claims_request_parsing_error"
// @from(Ln 119879, Col 4)
Bw6 = "authority_uri_insecure"
// @from(Ln 119880, Col 4)
mQ = "url_parse_error"
// @from(Ln 119881, Col 4)
pw6 = "empty_url_error"
// @from(Ln 119882, Col 4)
Fw6 = "empty_input_scopes_error"
// @from(Ln 119883, Col 4)
Vq6 = "invalid_claims"
// @from(Ln 119884, Col 4)
gw6 = "token_request_empty"
// @from(Ln 119885, Col 4)
Uw6 = "logout_request_empty"
// @from(Ln 119886, Col 4)
vi6 = "invalid_code_challenge_method"
// @from(Ln 119887, Col 4)
Qw6 = "pkce_params_missing"
// @from(Ln 119888, Col 4)
kq6 = "invalid_cloud_discovery_metadata"
// @from(Ln 119889, Col 4)
dw6 = "invalid_authority_metadata"
// @from(Ln 119890, Col 4)
cw6 = "untrusted_authority"
// @from(Ln 119891, Col 4)
Io = "missing_ssh_jwk"
// @from(Ln 119892, Col 4)
Ti6 = "missing_ssh_kid"
// @from(Ln 119893, Col 4)
Vi6 = "missing_nonce_authentication_header"
// @from(Ln 119894, Col 4)
ki6 = "invalid_authentication_header"
// @from(Ln 119895, Col 4)
Ni6 = "cannot_set_OIDCOptions"
// @from(Ln 119896, Col 4)
Ei6 = "cannot_allow_platform_broker"
// @from(Ln 119897, Col 4)
yi6 = "authority_mismatch"
// @from(Ln 119898, Col 4)
Li6 = "invalid_request_method_for_EAR"
// @from(Ln 119899, Col 4)
hi6 = "invalid_authorize_post_body_parameters"
// @from(Ln 119900, Col 4)
xo = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 119903, Col 0)
function aw(q) {
    return new XV6(q)
}
// @from(Ln 119906, Col 4)
zH
// @from(Ln 119906, Col 8)
gk1
// @from(Ln 119906, Col 13)
XV6
// @from(Ln 119907, Col 4)
Nq6 = L(() => {
    lb();
    xo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    zH = {
        [mw6]: "A redirect URI is required for all calls, and none has been set.",
        [Gi6]: "Could not parse the given claims request object.",
        [Bw6]: "Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",
        [mQ]: "URL could not be parsed into appropriate segments.",
        [pw6]: "URL was empty or null.",
        [Fw6]: "Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token.",
        [Vq6]: "Given claims parameter must be a stringified JSON object.",
        [gw6]: "Token request was empty and not found in cache.",
        [Uw6]: "The logout request was null or undefined.",
        [vi6]: 'code_challenge_method passed is invalid. Valid values are "plain" and "S256".',
        [Qw6]: "Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request",
        [kq6]: "Invalid cloudDiscoveryMetadata provided. Must be a stringified JSON object containing tenant_discovery_endpoint and metadata fields",
        [dw6]: "Invalid authorityMetadata provided. Must by a stringified JSON object containing authorization_endpoint, token_endpoint, issuer fields.",
        [cw6]: "The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter.",
        [Io]: "Missing sshJwk in SSH certificate request. A stringified JSON Web Key is required when using the SSH authentication scheme.",
        [Ti6]: "Missing sshKid in SSH certificate request. A string that uniquely identifies the public SSH key is required when using the SSH authentication scheme.",
        [Vi6]: "Unable to find an authentication header containing server nonce. Either the Authentication-Info or WWW-Authenticate headers must be present in order to obtain a server nonce.",
        [ki6]: "Invalid authentication header provided",
        [Ni6]: "Cannot set OIDCOptions parameter. Please change the protocol mode to OIDC or use a non-Microsoft authority.",
        [Ei6]: "Cannot set allowPlatformBroker parameter to true when not in AAD protocol mode.",
        [yi6]: "Authority mismatch error. Authority provided in login request or PublicClientApplication config does not match the environment of the provided account. Please use a matching account or make an interactive request to login to this authority.",
        [hi6]: "Invalid authorize post body parameters provided. If you are using authorizePostBodyParameters, the request method must be POST. Please check the request method and parameters.",
        [Li6]: "Invalid request method for EAR protocol mode. The request method cannot be GET when using EAR protocol mode. Please change the request method to POST."
    }, gk1 = {
        redirectUriNotSet: {
            code: mw6,
            desc: zH[mw6]
        },
        claimsRequestParsingError: {
            code: Gi6,
            desc: zH[Gi6]
        },
        authorityUriInsecure: {
            code: Bw6,
            desc: zH[Bw6]
        },
        urlParseError: {
            code: mQ,
            desc: zH[mQ]
        },
        urlEmptyError: {
            code: pw6,
            desc: zH[pw6]
        },
        emptyScopesError: {
            code: Fw6,
            desc: zH[Fw6]
        },
        invalidClaimsRequest: {
            code: Vq6,
            desc: zH[Vq6]
        },
        tokenRequestEmptyError: {
            code: gw6,
            desc: zH[gw6]
        },
        logoutRequestEmptyError: {
            code: Uw6,
            desc: zH[Uw6]
        },
        invalidCodeChallengeMethod: {
            code: vi6,
            desc: zH[vi6]
        },
        invalidCodeChallengeParams: {
            code: Qw6,
            desc: zH[Qw6]
        },
        invalidCloudDiscoveryMetadata: {
            code: kq6,
            desc: zH[kq6]
        },
        invalidAuthorityMetadata: {
            code: dw6,
            desc: zH[dw6]
        },
        untrustedAuthority: {
            code: cw6,
            desc: zH[cw6]
        },
        missingSshJwk: {
            code: Io,
            desc: zH[Io]
        },
        missingSshKid: {
            code: Ti6,
            desc: zH[Ti6]
        },
        missingNonceAuthenticationHeader: {
            code: Vi6,
            desc: zH[Vi6]
        },
        invalidAuthenticationHeader: {
            code: ki6,
            desc: zH[ki6]
        },
        cannotSetOIDCOptions: {
            code: Ni6,
            desc: zH[Ni6]
        },
        cannotAllowPlatformBroker: {
            code: Ei6,
            desc: zH[Ei6]
        },
        authorityMismatch: {
            code: yi6,
            desc: zH[yi6]
        },
        invalidAuthorizePostBodyParameters: {
            code: hi6,
            desc: zH[hi6]
        },
        invalidRequestMethodForEAR: {
            code: Li6,
            desc: zH[Li6]
        }
    };
    XV6 = class XV6 extends G9 {
        constructor(q) {
            super(q, zH[q]);
            this.name = "ClientConfigurationError", Object.setPrototypeOf(this, XV6.prototype)
        }
    }
})
// @from(Ln 120035, Col 0)
class b2 {
    static isEmptyObj(q) {
        if (q) try {
            let K = JSON.parse(q);
            return Object.keys(K).length === 0
        } catch (K) {}
        return !0
    }
    static startsWith(q, K) {
        return q.indexOf(K) === 0
    }
    static endsWith(q, K) {
        return q.length >= K.length && q.lastIndexOf(K) === q.length - K.length
    }
    static queryStringToObject(q) {
        let K = {},
            _ = q.split("&"),
            z = (Y) => decodeURIComponent(Y.replace(/\+/g, " "));
        return _.forEach((Y) => {
            if (Y.trim()) {
                let [A, O] = Y.split(/=(.+)/g, 2);
                if (A && O) K[z(A)] = z(O)
            }
        }), K
    }
    static trimArrayEntries(q) {
        return q.map((K) => K.trim())
    }
    static removeEmptyStringsFromArray(q) {
        return q.filter((K) => {
            return !!K
        })
    }
    static jsonParseHelper(q) {
        try {
            return JSON.parse(q)
        } catch (K) {
            return null
        }
    }
    static matchPattern(q, K) {
        return new RegExp(q.replace(/\\/g, "\\\\").replace(/\*/g, "[^ ]*").replace(/\?/g, "\\?")).test(K)
    }
}
// @from(Ln 120079, Col 4)
Eq6 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 120081, Col 0)
class OX {
    constructor(q) {
        let K = q ? b2.trimArrayEntries([...q]) : [],
            _ = K ? b2.removeEmptyStringsFromArray(K) : [];
        if (!_ || !_.length) throw aw(Fw6);
        this.scopes = new Set, _.forEach((z) => this.scopes.add(z))
    }
    static fromString(q) {
        let _ = (q || q7.EMPTY_STRING).split(" ");
        return new OX(_)
    }
    static createSearchScopes(q) {
        let K = q && q.length > 0 ? q : [...Cv],
            _ = new OX(K);
        if (!_.containsOnlyOIDCScopes()) _.removeOIDCScopes();
        else _.removeScope(q7.OFFLINE_ACCESS_SCOPE);
        return _
    }
    containsScope(q) {
        let K = this.printScopesLowerCase().split(" "),
            _ = new OX(K);
        return q ? _.scopes.has(q.toLowerCase()) : !1
    }
    containsScopeSet(q) {
        if (!q || q.scopes.size <= 0) return !1;
        return this.scopes.size >= q.scopes.size && q.asArray().every((K) => this.containsScope(K))
    }
    containsOnlyOIDCScopes() {
        let q = 0;
        return xk1.forEach((K) => {
            if (this.containsScope(K)) q += 1
        }), this.scopes.size === q
    }
    appendScope(q) {
        if (q) this.scopes.add(q.trim())
    }
    appendScopes(q) {
        try {
            q.forEach((K) => this.appendScope(K))
        } catch (K) {
            throw k7(Sw6)
        }
    }
    removeScope(q) {
        if (!q) throw k7(Rw6);
        this.scopes.delete(q.trim())
    }
    removeOIDCScopes() {
        xk1.forEach((q) => {
            this.scopes.delete(q)
        })
    }
    unionScopeSets(q) {
        if (!q) throw k7(Gq6);
        let K = new Set;
        return q.scopes.forEach((_) => K.add(_.toLowerCase())), this.scopes.forEach((_) => K.add(_.toLowerCase())), K
    }
    intersectingScopeSets(q) {
        if (!q) throw k7(Gq6);
        if (!q.containsOnlyOIDCScopes()) q.removeOIDCScopes();
        let K = this.unionScopeSets(q),
            _ = q.getScopeCount(),
            z = this.getScopeCount();
        return K.size < z + _
    }
    getScopeCount() {
        return this.scopes.size
    }
    asArray() {
        let q = [];
        return this.scopes.forEach((K) => q.push(K)), q
    }
    printScopes() {
        if (this.scopes) return this.asArray().join(" ");
        return q7.EMPTY_STRING
    }
    printScopesLowerCase() {
        return this.printScopes().toLowerCase()
    }
}
// @from(Ln 120161, Col 4)
Ri6 = L(() => {
    Nq6();
    Eq6();
    TP();
    L$();
    xo();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 120170, Col 0)
function MV6(q, K) {
    if (!q) throw k7(Gw6);
    try {
        let _ = K(q);
        return JSON.parse(_)
    } catch (_) {
        throw k7(Dq6)
    }
}
// @from(Ln 120180, Col 0)
function BQ(q) {
    if (!q) throw k7(Dq6);
    let K = q.split(Lo.CLIENT_INFO_SEPARATOR, 2);
    return {
        uid: K[0],
        utid: K.length < 2 ? q7.EMPTY_STRING : K[1]
    }
}
// @from(Ln 120188, Col 4)
PV6 = L(() => {
    TP();
    L$();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 120194, Col 0)
function lyq(q, K) {
    return !!q && !!K && q === K.split(".")[1]
}
// @from(Ln 120198, Col 0)
function Si6(q, K, _, z) {
    if (z) {
        let {
            oid: Y,
            sub: A,
            tid: O,
            name: w,
            tfp: $,
            acr: j,
            preferred_username: H,
            upn: J,
            login_hint: X
        } = z, M = O || $ || j || "";
        return {
            tenantId: M,
            localAccountId: Y || A || "",
            name: w,
            username: H || J || "",
            loginHint: X,
            isHomeTenant: lyq(M, q)
        }
    } else return {
        tenantId: _,
        localAccountId: K,
        username: "",
        isHomeTenant: lyq(_, q)
    }
}
// @from(Ln 120227, Col 0)
function uG8(q, K, _, z) {
    let Y = q;
    if (K) {
        let {
            isHomeTenant: A,
            ...O
        } = K;
        Y = {
            ...q,
            ...O
        }
    }
    if (_) {
        let {
            isHomeTenant: A,
            ...O
        } = Si6(q.homeAccountId, q.localAccountId, q.tenantId, _);
        return Y = {
            ...Y,
            ...O,
            idTokenClaims: _,
            idToken: z
        }, Y
    }
    return Y
}
// @from(Ln 120253, Col 4)
mG8 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 120255, Col 4)
nb
// @from(Ln 120256, Col 4)
Uk1 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    nb = {
        Default: 0,
        Adfs: 1,
        Dsts: 2,
        Ciam: 3
    }
})
// @from(Ln 120266, Col 0)
function BG8(q) {
    if (q) return q.tid || q.tfp || q.acr || null;
    return null
}
// @from(Ln 120270, Col 4)
Qk1 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 120272, Col 4)
bv
// @from(Ln 120273, Col 4)
Ci6 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    bv = {
        AAD: "AAD",
        OIDC: "OIDC",
        EAR: "EAR"
    }
})
// @from(Ln 120281, Col 0)
class VP {
    static getAccountInfo(q) {
        return {
            homeAccountId: q.homeAccountId,
            environment: q.environment,
            tenantId: q.realm,
            username: q.username,
            localAccountId: q.localAccountId,
            loginHint: q.loginHint,
            name: q.name,
            nativeAccountId: q.nativeAccountId,
            authorityType: q.authorityType,
            tenantProfiles: new Map((q.tenantProfiles || []).map((K) => {
                return [K.tenantId, K]
            })),
            dataBoundary: q.dataBoundary
        }
    }
    isSingleTenant() {
        return !this.tenantProfiles
    }
    static createAccount(q, K, _) {
        let z = new VP;
        if (K.authorityType === nb.Adfs) z.authorityType = Zw6.ADFS_ACCOUNT_TYPE;
        else if (K.protocolMode === bv.OIDC) z.authorityType = Zw6.GENERIC_ACCOUNT_TYPE;
        else z.authorityType = Zw6.MSSTS_ACCOUNT_TYPE;
        let Y;
        if (q.clientInfo && _) {
            if (Y = MV6(q.clientInfo, _), Y.xms_tdbr) z.dataBoundary = Y.xms_tdbr === "EU" ? "EU" : "None"
        }
        z.clientInfo = q.clientInfo, z.homeAccountId = q.homeAccountId, z.nativeAccountId = q.nativeAccountId;
        let A = q.environment || K && K.getPreferredCache();
        if (!A) throw k7(So);
        z.environment = A, z.realm = Y?.utid || BG8(q.idTokenClaims) || "", z.localAccountId = Y?.uid || q.idTokenClaims?.oid || q.idTokenClaims?.sub || "";
        let O = q.idTokenClaims?.preferred_username || q.idTokenClaims?.upn,
            w = q.idTokenClaims?.emails ? q.idTokenClaims.emails[0] : null;
        if (z.username = O || w || "", z.loginHint = q.idTokenClaims?.login_hint, z.name = q.idTokenClaims?.name || "", z.cloudGraphHostName = q.cloudGraphHostName, z.msGraphHost = q.msGraphHost, q.tenantProfiles) z.tenantProfiles = q.tenantProfiles;
        else {
            let $ = Si6(q.homeAccountId, z.localAccountId, z.realm, q.idTokenClaims);
            z.tenantProfiles = [$]
        }
        return z
    }
    static createFromAccountInfo(q, K, _) {
        let z = new VP;
        return z.authorityType = q.authorityType || Zw6.GENERIC_ACCOUNT_TYPE, z.homeAccountId = q.homeAccountId, z.localAccountId = q.localAccountId, z.nativeAccountId = q.nativeAccountId, z.realm = q.tenantId, z.environment = q.environment, z.username = q.username, z.name = q.name, z.loginHint = q.loginHint, z.cloudGraphHostName = K, z.msGraphHost = _, z.tenantProfiles = Array.from(q.tenantProfiles?.values() || []), z.dataBoundary = q.dataBoundary, z
    }
    static generateHomeAccountId(q, K, _, z, Y) {
        if (!(K === nb.Adfs || K === nb.Dsts)) {
            if (q) try {
                let A = MV6(q, z.base64Decode);
                if (A.uid && A.utid) return `${A.uid}.${A.utid}`
            } catch (A) {}
            _.warning("No client info in response")
        }
        return Y?.sub || ""
    }
    static isAccountEntity(q) {
        if (!q) return !1;
        return q.hasOwnProperty("homeAccountId") && q.hasOwnProperty("environment") && q.hasOwnProperty("realm") && q.hasOwnProperty("localAccountId") && q.hasOwnProperty("username") && q.hasOwnProperty("authorityType")
    }
    static accountInfoIsEqual(q, K, _) {
        if (!q || !K) return !1;
        let z = !0;
        if (_) {
            let Y = q.idTokenClaims || {},
                A = K.idTokenClaims || {};
            z = Y.iat === A.iat && Y.nonce === A.nonce
        }
        return q.homeAccountId === K.homeAccountId && q.localAccountId === K.localAccountId && q.username === K.username && q.tenantId === K.tenantId && q.loginHint === K.loginHint && q.environment === K.environment && q.nativeAccountId === K.nativeAccountId && z
    }
}
// @from(Ln 120353, Col 4)
pG8 = L(() => {
    L$();
    PV6();
    mG8();
    TP();
    Uk1();
    Qk1();
    Ci6();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 120363, Col 4)
FG8 = {}
// @from(Ln 120371, Col 0)
function uo(q, K) {
    let _ = nyq(q);
    try {
        let z = K(_);
        return JSON.parse(z)
    } catch (z) {
        throw k7(Zq6)
    }
}
// @from(Ln 120381, Col 0)
function dk1(q) {
    if (!q.signin_state) return !1;
    let K = ["kmsi", "dvc_dmjd"];
    return q.signin_state.some((z) => K.includes(z.trim().toLowerCase()))
}
// @from(Ln 120387, Col 0)
function nyq(q) {
    if (!q) throw k7(vw6);
    let _ = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(q);
    if (!_ || _.length < 4) throw k7(Zq6);
    return _[2]
}
// @from(Ln 120394, Col 0)
function bi6(q, K) {
    if (K === 0 || Date.now() - 300000 > q + K) throw k7(yw6)
}
// @from(Ln 120397, Col 4)
WV6 = L(() => {
    TP();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 120401, Col 4)
Hf = {}
// @from(Ln 120409, Col 0)
function iyq(q) {
    if (!q) return q;
    let K = q.toLowerCase();
    if (b2.endsWith(K, "?")) K = K.slice(0, -1);
    else if (b2.endsWith(K, "?/")) K = K.slice(0, -2);
    if (!b2.endsWith(K, "/")) K += "/";
    return K
}
// @from(Ln 120418, Col 0)
function ryq(q) {
    if (q.startsWith("#/")) return q.substring(2);
    else if (q.startsWith("#") || q.startsWith("?")) return q.substring(1);
    return q
}
// @from(Ln 120424, Col 0)
function ck1(q) {
    if (!q || q.indexOf("=") < 0) return null;
    try {
        let K = ryq(q),
            _ = Object.fromEntries(new URLSearchParams(K));
        if (_.code || _.ear_jwe || _.error || _.error_description || _.state) return _
    } catch (K) {
        throw k7(kw6)
    }
    return null
}
// @from(Ln 120436, Col 0)
function pQ(q, K = !0, _) {
    let z = [];
    return q.forEach((Y, A) => {
        if (!K && _ && A in _) z.push(`${A}=${Y}`);
        else z.push(`${A}=${encodeURIComponent(Y)}`)
    }), z.join("&")
}
// @from(Ln 120444, Col 0)
function Yo9(q) {
    if (!q) return q;
    let K = q.split("#")[0];
    try {
        let _ = new URL(K),
            z = _.origin + _.pathname + _.search;
        return iyq(z)
    } catch (_) {
        return iyq(K)
    }
}
// @from(Ln 120455, Col 4)
lw6 = L(() => {
    TP();
    Eq6();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 120460, Col 0)
class l9 {
    get urlString() {
        return this._urlString
    }
    constructor(q) {
        if (this._urlString = q, !this._urlString) throw aw(pw6);
        if (!q.includes("#")) this._urlString = l9.canonicalizeUri(q)
    }
    static canonicalizeUri(q) {
        if (q) {
            let K = q.toLowerCase();
            if (b2.endsWith(K, "?")) K = K.slice(0, -1);
            else if (b2.endsWith(K, "?/")) K = K.slice(0, -2);
            if (!b2.endsWith(K, "/")) K += "/";
            return K
        }
        return q
    }
    validateAsUri() {
        let q;
        try {
            q = this.getUrlComponents()
        } catch (K) {
            throw aw(mQ)
        }
        if (!q.HostNameAndPort || !q.PathSegments) throw aw(mQ);
        if (!q.Protocol || q.Protocol.toLowerCase() !== "https:") throw aw(Bw6)
    }
    static appendQueryString(q, K) {
        if (!K) return q;
        return q.indexOf("?") < 0 ? `${q}?${K}` : `${q}&${K}`
    }
    static removeHashFromUrl(q) {
        return l9.canonicalizeUri(q.split("#")[0])
    }
    replaceTenantPath(q) {
        let K = this.getUrlComponents(),
            _ = K.PathSegments;
        if (q && _.length !== 0 && (_[0] === CE.COMMON || _[0] === CE.ORGANIZATIONS)) _[0] = q;
        return l9.constructAuthorityUriFromObject(K)
    }
    getUrlComponents() {
        let q = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"),
            K = this.urlString.match(q);
        if (!K) throw aw(mQ);
        let _ = {
                Protocol: K[1],
                HostNameAndPort: K[4],
                AbsolutePath: K[5],
                QueryString: K[7]
            },
            z = _.AbsolutePath.split("/");
        if (z = z.filter((Y) => Y && Y.length > 0), _.PathSegments = z, _.QueryString && _.QueryString.endsWith("/")) _.QueryString = _.QueryString.substring(0, _.QueryString.length - 1);
        return _
    }
    static getDomainFromUrl(q) {
        let K = RegExp("^([^:/?#]+://)?([^/?#]*)"),
            _ = q.match(K);
        if (!_) throw aw(mQ);
        return _[2]
    }
    static getAbsoluteUrl(q, K) {
        if (q[0] === q7.FORWARD_SLASH) {
            let z = new l9(K).getUrlComponents();
            return z.Protocol + "//" + z.HostNameAndPort + q
        }
        return q
    }
    static constructAuthorityUriFromObject(q) {
        return new l9(q.Protocol + "//" + q.HostNameAndPort + "/" + q.PathSegments.join("/"))
    }
    static hashContainsKnownProperties(q) {
        return !!ck1(q)
    }
}
// @from(Ln 120535, Col 4)
yq6 = L(() => {
    Nq6();
    Eq6();
    L$();
    lw6();
    xo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 120543, Col 0)
function syq(q, K) {
    let _, z = q.canonicalAuthority;
    if (z) {
        let Y = new l9(z).getUrlComponents().HostNameAndPort;
        _ = oyq(Y, q.cloudDiscoveryMetadata?.metadata, UV.CONFIG, K) || oyq(Y, nk1.metadata, UV.HARDCODED_VALUES, K) || q.knownAuthorities
    }
    return _ || []
}
// @from(Ln 120552, Col 0)
function oyq(q, K, _, z) {
    if (z?.trace(`getAliasesFromMetadata called with source: ${_}`), q && K) {
        let Y = Ii6(K, q);
        if (Y) return z?.trace(`getAliasesFromMetadata: found cloud discovery metadata in ${_}, returning aliases`), Y.aliases;
        else z?.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in ${_}`)
    }
    return null
}
// @from(Ln 120561, Col 0)
function tyq(q) {
    return Ii6(nk1.metadata, q)
}
// @from(Ln 120565, Col 0)
function Ii6(q, K) {
    for (let _ = 0; _ < q.length; _++) {
        let z = q[_];
        if (z.aliases.includes(K)) return z
    }
    return null
}
// @from(Ln 120572, Col 4)
ayq
// @from(Ln 120572, Col 9)
lk1
// @from(Ln 120572, Col 14)
nk1
// @from(Ln 120572, Col 19)
ik1
// @from(Ln 120573, Col 4)
rk1 = L(() => {
    yq6();
    L$(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    ayq = {
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
    }, lk1 = ayq.endpointMetadata, nk1 = ayq.instanceDiscoveryMetadata, ik1 = new Set;
    nk1.metadata.forEach((q) => {
        q.aliases.forEach((K) => {
            ik1.add(K)
        })
    })
})
// @from(Ln 120630, Col 4)
ok1 = "cache_quota_exceeded"
// @from(Ln 120631, Col 4)
gG8 = "cache_error_unknown"
// @from(Ln 120632, Col 4)
eyq = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 120635, Col 0)
function qLq(q) {
    if (!(q instanceof Error)) return new xi6(gG8);
    if (q.name === "QuotaExceededError" || q.name === "NS_ERROR_DOM_QUOTA_REACHED" || q.message.includes("exceeded the quota")) return new xi6(ok1);
    else return new xi6(q.name, q.message)
}
// @from(Ln 120640, Col 4)
ak1
// @from(Ln 120640, Col 9)
xi6
// @from(Ln 120641, Col 4)
KLq = L(() => {
    lb();
    eyq(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    ak1 = {
        [ok1]: "Exceeded cache storage capacity.",
        [gG8]: "Unexpected error occurred when using cache storage."
    };
    xi6 = class xi6 extends G9 {
        constructor(q, K) {
            let _ = K || (ak1[q] ? ak1[q] : ak1[gG8]);
            super(`${q}: ${_}`);
            Object.setPrototypeOf(this, xi6.prototype), this.name = "CacheError", this.errorCode = q, this.errorMessage = _
        }
    }
})
// @from(Ln 120656, Col 0)
class nw6 {
    constructor(q, K, _, z, Y) {
        this.clientId = q, this.cryptoImpl = K, this.commonLogger = _.clone(bG8, HV6), this.staticAuthorityOptions = Y, this.performanceClient = z
    }
    getAllAccounts(q, K) {
        return this.buildTenantProfiles(this.getAccountsFilteredBy(q, K), K, q)
    }
    getAccountInfoFilteredBy(q, K) {
        if (Object.keys(q).length === 0 || Object.values(q).every((z) => !z)) return this.commonLogger.warning("getAccountInfoFilteredBy: Account filter is empty or invalid, returning null"), null;
        let _ = this.getAllAccounts(q, K);
        if (_.length > 1) return _.sort((Y) => {
            return Y.idTokenClaims ? -1 : 1
        })[0];
        else if (_.length === 1) return _[0];
        else return null
    }
    getBaseAccountInfo(q, K) {
        let _ = this.getAccountsFilteredBy(q, K);
        if (_.length > 0) return VP.getAccountInfo(_[0]);
        else return null
    }
    buildTenantProfiles(q, K, _) {
        return q.flatMap((z) => {
            return this.getTenantProfilesFromAccountEntity(z, K, _?.tenantId, _)
        })
    }
    getTenantedAccountInfoByFilter(q, K, _, z, Y) {
        let A = null,
            O;
        if (Y) {
            if (!this.tenantProfileMatchesFilter(_, Y)) return null
        }
        let w = this.getIdToken(q, z, K, _.tenantId);
        if (w) {
            if (O = uo(w.secret, this.cryptoImpl.base64Decode), !this.idTokenClaimsMatchTenantProfileFilter(O, Y)) return null
        }
        return A = uG8(q, _, O, w?.secret), A
    }
    getTenantProfilesFromAccountEntity(q, K, _, z) {
        let Y = VP.getAccountInfo(q),
            A = Y.tenantProfiles || new Map,
            O = this.getTokenKeys();
        if (_) {
            let $ = A.get(_);
            if ($) A = new Map([
                [_, $]
            ]);
            else return []
        }
        let w = [];
        return A.forEach(($) => {
            let j = this.getTenantedAccountInfoByFilter(Y, O, $, K, z);
            if (j) w.push(j)
        }), w
    }
    tenantProfileMatchesFilter(q, K) {
        if (!!K.localAccountId && !this.matchLocalAccountIdFromTenantProfile(q, K.localAccountId)) return !1;
        if (!!K.name && q.name !== K.name) return !1;
        if (K.isHomeTenant !== void 0 && q.isHomeTenant !== K.isHomeTenant) return !1;
        return !0
    }
    idTokenClaimsMatchTenantProfileFilter(q, K) {
        if (K) {
            if (!!K.localAccountId && !this.matchLocalAccountIdFromTokenClaims(q, K.localAccountId)) return !1;
            if (!!K.loginHint && !this.matchLoginHintFromTokenClaims(q, K.loginHint)) return !1;
            if (!!K.username && !this.matchUsername(q.preferred_username, K.username)) return !1;
            if (!!K.name && !this.matchName(q, K.name)) return !1;
            if (!!K.sid && !this.matchSid(q, K.sid)) return !1
        }
        return !0
    }
    async saveCacheRecord(q, K, _, z) {
        if (!q) throw k7(Cw6);
        try {
            if (q.account) await this.setAccount(q.account, K, _);
            if (!!q.idToken && z?.idToken !== !1) await this.setIdTokenCredential(q.idToken, K, _);
            if (!!q.accessToken && z?.accessToken !== !1) await this.saveAccessToken(q.accessToken, K, _);
            if (!!q.refreshToken && z?.refreshToken !== !1) await this.setRefreshTokenCredential(q.refreshToken, K, _);
            if (q.appMetadata) this.setAppMetadata(q.appMetadata, K)
        } catch (Y) {
            if (this.commonLogger?.error("CacheManager.saveCacheRecord: failed"), Y instanceof G9) throw Y;
            else throw qLq(Y)
        }
    }
    async saveAccessToken(q, K, _) {
        let z = {
                clientId: q.clientId,
                credentialType: q.credentialType,
                environment: q.environment,
                homeAccountId: q.homeAccountId,
                realm: q.realm,
                tokenType: q.tokenType,
                requestedClaimsHash: q.requestedClaimsHash
            },
            Y = this.getTokenKeys(),
            A = OX.fromString(q.target);
        Y.accessToken.forEach((O) => {
            if (!this.accessTokenKeyMatchesFilter(O, z, !1)) return;
            let w = this.getAccessTokenCredential(O, K);
            if (w && this.credentialMatchesFilter(w, z)) {
                if (OX.fromString(w.target).intersectingScopeSets(A)) this.removeAccessToken(O, K)
            }
        }), await this.setAccessTokenCredential(q, K, _)
    }
    getAccountsFilteredBy(q, K) {
        let _ = this.getAccountKeys(),
            z = [];
        return _.forEach((Y) => {
            let A = this.getAccount(Y, K);
            if (!A) return;
            if (!!q.homeAccountId && !this.matchHomeAccountId(A, q.homeAccountId)) return;
            if (!!q.username && !this.matchUsername(A.username, q.username)) return;
            if (!!q.environment && !this.matchEnvironment(A, q.environment)) return;
            if (!!q.realm && !this.matchRealm(A, q.realm)) return;
            if (!!q.nativeAccountId && !this.matchNativeAccountId(A, q.nativeAccountId)) return;
            if (!!q.authorityType && !this.matchAuthorityType(A, q.authorityType)) return;
            let O = {
                    localAccountId: q?.localAccountId,
                    name: q?.name
                },
                w = A.tenantProfiles?.filter(($) => {
                    return this.tenantProfileMatchesFilter($, O)
                });
            if (w && w.length === 0) return;
            z.push(A)
        }), z
    }
    credentialMatchesFilter(q, K) {
        if (!!K.clientId && !this.matchClientId(q, K.clientId)) return !1;
        if (!!K.userAssertionHash && !this.matchUserAssertionHash(q, K.userAssertionHash)) return !1;
        if (typeof K.homeAccountId === "string" && !this.matchHomeAccountId(q, K.homeAccountId)) return !1;
        if (!!K.environment && !this.matchEnvironment(q, K.environment)) return !1;
        if (!!K.realm && !this.matchRealm(q, K.realm)) return !1;
        if (!!K.credentialType && !this.matchCredentialType(q, K.credentialType)) return !1;
        if (!!K.familyId && !this.matchFamilyId(q, K.familyId)) return !1;
        if (!!K.target && !this.matchTarget(q, K.target)) return !1;
        if (K.requestedClaimsHash || q.requestedClaimsHash) {
            if (q.requestedClaimsHash !== K.requestedClaimsHash) return !1
        }
        if (q.credentialType === dO.ACCESS_TOKEN_WITH_AUTH_SCHEME) {
            if (!!K.tokenType && !this.matchTokenType(q, K.tokenType)) return !1;
            if (K.tokenType === hz.SSH) {
                if (K.keyId && !this.matchKeyId(q, K.keyId)) return !1
            }
        }
        return !0
    }
    getAppMetadataFilteredBy(q) {
        let K = this.getKeys(),
            _ = {};
        return K.forEach((z) => {
            if (!this.isAppMetadata(z)) return;
            let Y = this.getAppMetadata(z);
            if (!Y) return;
            if (!!q.environment && !this.matchEnvironment(Y, q.environment)) return;
            if (!!q.clientId && !this.matchClientId(Y, q.clientId)) return;
            _[z] = Y
        }), _
    }
    getAuthorityMetadataByAlias(q) {
        let K = this.getAuthorityMetadataKeys(),
            _ = null;
        return K.forEach((z) => {
            if (!this.isAuthorityMetadata(z) || z.indexOf(this.clientId) === -1) return;
            let Y = this.getAuthorityMetadata(z);
            if (!Y) return;
            if (Y.aliases.indexOf(q) === -1) return;
            _ = Y
        }), _
    }
    removeAllAccounts(q) {
        this.getAllAccounts({}, q).forEach((_) => {
            this.removeAccount(_, q)
        })
    }
    removeAccount(q, K) {
        this.removeAccountContext(q, K);
        let _ = this.getAccountKeys(),
            z = (Y) => {
                return Y.includes(q.homeAccountId) && Y.includes(q.environment)
            };
        _.filter(z).forEach((Y) => {
            this.removeItem(Y, K), this.performanceClient.incrementFields({
                accountsRemoved: 1
            }, K)
        })
    }
    removeAccountContext(q, K) {
        let _ = this.getTokenKeys(),
            z = (Y) => {
                return Y.includes(q.homeAccountId) && Y.includes(q.environment)
            };
        _.idToken.filter(z).forEach((Y) => {
            this.removeIdToken(Y, K)
        }), _.accessToken.filter(z).forEach((Y) => {
            this.removeAccessToken(Y, K)
        }), _.refreshToken.filter(z).forEach((Y) => {
            this.removeRefreshToken(Y, K)
        })
    }
    removeAccessToken(q, K) {
        let _ = this.getAccessTokenCredential(q, K);
        if (this.removeItem(q, K), this.performanceClient.incrementFields({
                accessTokensRemoved: 1
            }, K), !_ || _.credentialType.toLowerCase() !== dO.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase() || _.tokenType !== hz.POP) return;
        let z = _.keyId;
        if (z) this.cryptoImpl.removeTokenBindingKey(z).catch(() => {
            this.commonLogger.error(`Failed to remove token binding key ${z}`, K), this.performanceClient?.incrementFields({
                removeTokenBindingKeyFailure: 1
            }, K)
        })
    }
    removeAppMetadata(q) {
        return this.getKeys().forEach((_) => {
            if (this.isAppMetadata(_)) this.removeItem(_, q)
        }), !0
    }
    getIdToken(q, K, _, z, Y) {
        this.commonLogger.trace("CacheManager - getIdToken called");
        let A = {
                homeAccountId: q.homeAccountId,
                environment: q.environment,
                credentialType: dO.ID_TOKEN,
                clientId: this.clientId,
                realm: z
            },
            O = this.getIdTokensByFilter(A, K, _),
            w = O.size;
        if (w < 1) return this.commonLogger.info("CacheManager:getIdToken - No token found"), null;
        else if (w > 1) {
            let $ = O;
            if (!z) {
                let j = new Map;
                O.forEach((J, X) => {
                    if (J.realm === q.tenantId) j.set(X, J)
                });
                let H = j.size;
                if (H < 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result"), O.values().next().value;
                else if (H === 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile"), j.values().next().value;
                else $ = j
            }
            if (this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them"), $.forEach((j, H) => {
                    this.removeIdToken(H, K)
                }), Y && K) Y.addFields({
                multiMatchedID: O.size
            }, K);
            return null
        }
        return this.commonLogger.info("CacheManager:getIdToken - Returning ID token"), O.values().next().value
    }
    getIdTokensByFilter(q, K, _) {
        let z = _ && _.idToken || this.getTokenKeys().idToken,
            Y = new Map;
        return z.forEach((A) => {
            if (!this.idTokenKeyMatchesFilter(A, {
                    clientId: this.clientId,
                    ...q
                })) return;
            let O = this.getIdTokenCredential(A, K);
            if (O && this.credentialMatchesFilter(O, q)) Y.set(A, O)
        }), Y
    }
    idTokenKeyMatchesFilter(q, K) {
        let _ = q.toLowerCase();
        if (K.clientId && _.indexOf(K.clientId.toLowerCase()) === -1) return !1;
        if (K.homeAccountId && _.indexOf(K.homeAccountId.toLowerCase()) === -1) return !1;
        return !0
    }
    removeIdToken(q, K) {
        this.removeItem(q, K)
    }
    removeRefreshToken(q, K) {
        this.removeItem(q, K)
    }
    getAccessToken(q, K, _, z) {
        let Y = K.correlationId;
        this.commonLogger.trace("CacheManager - getAccessToken called", Y);
        let A = OX.createSearchScopes(K.scopes),
            O = K.authenticationScheme || hz.BEARER,
            w = O && O.toLowerCase() !== hz.BEARER.toLowerCase() ? dO.ACCESS_TOKEN_WITH_AUTH_SCHEME : dO.ACCESS_TOKEN,
            $ = {
                homeAccountId: q.homeAccountId,
                environment: q.environment,
                credentialType: w,
                clientId: this.clientId,
                realm: z || q.tenantId,
                target: A,
                tokenType: O,
                keyId: K.sshKid,
                requestedClaimsHash: K.requestedClaimsHash
            },
            j = _ && _.accessToken || this.getTokenKeys().accessToken,
            H = [];
        j.forEach((X) => {
            if (this.accessTokenKeyMatchesFilter(X, $, !0)) {
                let M = this.getAccessTokenCredential(X, Y);
                if (M && this.credentialMatchesFilter(M, $)) H.push(M)
            }
        });
        let J = H.length;
        if (J < 1) return this.commonLogger.info("CacheManager:getAccessToken - No token found", Y), null;
        else if (J > 1) return this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them", Y), H.forEach((X) => {
            this.removeAccessToken(this.generateCredentialKey(X), Y)
        }), this.performanceClient.addFields({
            multiMatchedAT: H.length
        }, Y), null;
        return this.commonLogger.info("CacheManager:getAccessToken - Returning access token", Y), H[0]
    }
    accessTokenKeyMatchesFilter(q, K, _) {
        let z = q.toLowerCase();
        if (K.clientId && z.indexOf(K.clientId.toLowerCase()) === -1) return !1;
        if (K.homeAccountId && z.indexOf(K.homeAccountId.toLowerCase()) === -1) return !1;
        if (K.realm && z.indexOf(K.realm.toLowerCase()) === -1) return !1;
        if (K.requestedClaimsHash && z.indexOf(K.requestedClaimsHash.toLowerCase()) === -1) return !1;
        if (K.target) {
            let Y = K.target.asArray();
            for (let A = 0; A < Y.length; A++)
                if (_ && !z.includes(Y[A].toLowerCase())) return !1;
                else if (!_ && z.includes(Y[A].toLowerCase())) return !0
        }
        return !0
    }
    getAccessTokensByFilter(q, K) {
        let _ = this.getTokenKeys(),
            z = [];
        return _.accessToken.forEach((Y) => {
            if (!this.accessTokenKeyMatchesFilter(Y, q, !0)) return;
            let A = this.getAccessTokenCredential(Y, K);
            if (A && this.credentialMatchesFilter(A, q)) z.push(A)
        }), z
    }
    getRefreshToken(q, K, _, z, Y) {
        this.commonLogger.trace("CacheManager - getRefreshToken called");
        let A = K ? Wq6 : void 0,
            O = {
                homeAccountId: q.homeAccountId,
                environment: q.environment,
                credentialType: dO.REFRESH_TOKEN,
                clientId: this.clientId,
                familyId: A
            },
            w = z && z.refreshToken || this.getTokenKeys().refreshToken,
            $ = [];
        w.forEach((H) => {
            if (this.refreshTokenKeyMatchesFilter(H, O)) {
                let J = this.getRefreshTokenCredential(H, _);
                if (J && this.credentialMatchesFilter(J, O)) $.push(J)
            }
        });
        let j = $.length;
        if (j < 1) return this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found."), null;
        if (j > 1 && Y && _) Y.addFields({
            multiMatchedRT: j
        }, _);
        return this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token"), $[0]
    }
    refreshTokenKeyMatchesFilter(q, K) {
        let _ = q.toLowerCase();
        if (K.familyId && _.indexOf(K.familyId.toLowerCase()) === -1) return !1;
        if (!K.familyId && K.clientId && _.indexOf(K.clientId.toLowerCase()) === -1) return !1;
        if (K.homeAccountId && _.indexOf(K.homeAccountId.toLowerCase()) === -1) return !1;
        return !0
    }
    readAppMetadataFromCache(q) {
        let K = {
                environment: q,
                clientId: this.clientId
            },
            _ = this.getAppMetadataFilteredBy(K),
            z = Object.keys(_).map((A) => _[A]),
            Y = z.length;
        if (Y < 1) return null;
        else if (Y > 1) throw k7(Lw6);
        return z[0]
    }
    isAppMetadataFOCI(q) {
        let K = this.readAppMetadataFromCache(q);
        return !!(K && K.familyId === Wq6)
    }
    matchHomeAccountId(q, K) {
        return typeof q.homeAccountId === "string" && K === q.homeAccountId
    }
    matchLocalAccountIdFromTokenClaims(q, K) {
        let _ = q.oid || q.sub;
        return K === _
    }
    matchLocalAccountIdFromTenantProfile(q, K) {
        return q.localAccountId === K
    }
    matchName(q, K) {
        return K.toLowerCase() === q.name?.toLowerCase()
    }
    matchUsername(q, K) {
        return !!(q && typeof q === "string" && K?.toLowerCase() === q.toLowerCase())
    }
    matchUserAssertionHash(q, K) {
        return !!(q.userAssertionHash && K === q.userAssertionHash)
    }
    matchEnvironment(q, K) {
        if (this.staticAuthorityOptions) {
            let z = syq(this.staticAuthorityOptions, this.commonLogger);
            if (z.includes(K) && z.includes(q.environment)) return !0
        }
        let _ = this.getAuthorityMetadataByAlias(K);
        if (_ && _.aliases.indexOf(q.environment) > -1) return !0;
        return !1
    }
    matchCredentialType(q, K) {
        return q.credentialType && K.toLowerCase() === q.credentialType.toLowerCase()
    }
    matchClientId(q, K) {
        return !!(q.clientId && K === q.clientId)
    }
    matchFamilyId(q, K) {
        return !!(q.familyId && K === q.familyId)
    }
    matchRealm(q, K) {
        return q.realm?.toLowerCase() === K.toLowerCase()
    }
    matchNativeAccountId(q, K) {
        return !!(q.nativeAccountId && K === q.nativeAccountId)
    }
    matchLoginHintFromTokenClaims(q, K) {
        if (q.login_hint === K) return !0;
        if (q.preferred_username === K) return !0;
        if (q.upn === K) return !0;
        return !1
    }
    matchSid(q, K) {
        return q.sid === K
    }
    matchAuthorityType(q, K) {
        return !!(q.authorityType && K.toLowerCase() === q.authorityType.toLowerCase())
    }
    matchTarget(q, K) {
        if (q.credentialType !== dO.ACCESS_TOKEN && q.credentialType !== dO.ACCESS_TOKEN_WITH_AUTH_SCHEME || !q.target) return !1;
        return OX.fromString(q.target).containsScopeSet(K)
    }
    matchTokenType(q, K) {
        return !!(q.tokenType && q.tokenType === K)
    }
    matchKeyId(q, K) {
        return !!(q.keyId && q.keyId === K)
    }
    isAppMetadata(q) {
        return q.indexOf(en6) !== -1
    }
    isAuthorityMetadata(q) {
        return q.indexOf(OV6.CACHE_KEY) !== -1
    }
    generateAuthorityMetadataCacheKey(q) {
        return `${OV6.CACHE_KEY}-${this.clientId}-${q}`
    }
    static toObject(q, K) {
        for (let _ in K) q[_] = K[_];
        return q
    }
}
// @from(Ln 121114, Col 4)
UG8
// @from(Ln 121115, Col 4)
sk1 = L(() => {
    L$();
    Ri6();
    pG8();
    TP();
    mG8();
    WV6();
    IG8();
    rk1();
    KLq();
    lb();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    UG8 = class UG8 extends nw6 {
        async setAccount() {
            throw k7(V_)
        }
        getAccount() {
            throw k7(V_)
        }
        async setIdTokenCredential() {
            throw k7(V_)
        }
        getIdTokenCredential() {
            throw k7(V_)
        }
        async setAccessTokenCredential() {
            throw k7(V_)
        }
        getAccessTokenCredential() {
            throw k7(V_)
        }
        async setRefreshTokenCredential() {
            throw k7(V_)
        }
        getRefreshTokenCredential() {
            throw k7(V_)
        }
        setAppMetadata() {
            throw k7(V_)
        }
        getAppMetadata() {
            throw k7(V_)
        }
        setServerTelemetry() {
            throw k7(V_)
        }
        getServerTelemetry() {
            throw k7(V_)
        }
        setAuthorityMetadata() {
            throw k7(V_)
        }
        getAuthorityMetadata() {
            throw k7(V_)
        }
        getAuthorityMetadataKeys() {
            throw k7(V_)
        }
        setThrottlingCache() {
            throw k7(V_)
        }
        getThrottlingCache() {
            throw k7(V_)
        }
        removeItem() {
            throw k7(V_)
        }
        getKeys() {
            throw k7(V_)
        }
        getAccountKeys() {
            throw k7(V_)
        }
        getTokenKeys() {
            throw k7(V_)
        }
        generateCredentialKey() {
            throw k7(V_)
        }
        generateAccountKey() {
            throw k7(V_)
        }
    }
})
// @from(Ln 121199, Col 4)
m1
// @from(Ln 121199, Col 8)
FTO
// @from(Ln 121199, Col 13)
_Lq
// @from(Ln 121200, Col 4)
ZB = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    m1 = {
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
    }, FTO = new Map([
        [m1.AcquireTokenByCode, "ATByCode"],
        [m1.AcquireTokenByRefreshToken, "ATByRT"],
        [m1.AcquireTokenSilent, "ATS"],
        [m1.AcquireTokenSilentAsync, "ATSAsync"],
        [m1.AcquireTokenPopup, "ATPopup"],
        [m1.AcquireTokenRedirect, "ATRedirect"],
        [m1.CryptoOptsGetPublicKeyThumbprint, "CryptoGetPKThumb"],
        [m1.CryptoOptsSignJwt, "CryptoSignJwt"],
        [m1.SilentCacheClientAcquireToken, "SltCacheClientAT"],
        [m1.SilentIframeClientAcquireToken, "SltIframeClientAT"],
        [m1.SilentRefreshClientAcquireToken, "SltRClientAT"],
        [m1.SsoSilent, "SsoSlt"],
        [m1.StandardInteractionClientGetDiscoveredAuthority, "StdIntClientGetDiscAuth"],
        [m1.FetchAccountIdWithNativeBroker, "FetchAccIdWithNtvBroker"],
        [m1.NativeInteractionClientAcquireToken, "NtvIntClientAT"],
        [m1.BaseClientCreateTokenRequestHeaders, "BaseClientCreateTReqHead"],
        [m1.NetworkClientSendPostRequestAsync, "NetClientSendPost"],
        [m1.RefreshTokenClientExecutePostToTokenEndpoint, "RTClientExecPost"],
        [m1.AuthorizationCodeClientExecutePostToTokenEndpoint, "AuthCodeClientExecPost"],
        [m1.BrokerHandhshake, "BrokerHandshake"],
        [m1.AcquireTokenByRefreshTokenInBroker, "ATByRTInBroker"],
        [m1.AcquireTokenByBroker, "ATByBroker"],
        [m1.RefreshTokenClientExecuteTokenRequest, "RTClientExecTReq"],
        [m1.RefreshTokenClientAcquireToken, "RTClientAT"],
        [m1.RefreshTokenClientAcquireTokenWithCachedRefreshToken, "RTClientATWithCachedRT"],
        [m1.RefreshTokenClientAcquireTokenByRefreshToken, "RTClientATByRT"],
        [m1.RefreshTokenClientCreateTokenRequestBody, "RTClientCreateTReqBody"],
        [m1.AcquireTokenFromCache, "ATFromCache"],
        [m1.SilentFlowClientAcquireCachedToken, "SltFlowClientATCached"],
        [m1.SilentFlowClientGenerateResultFromCacheRecord, "SltFlowClientGenResFromCache"],
        [m1.AcquireTokenBySilentIframe, "ATBySltIframe"],
        [m1.InitializeBaseRequest, "InitBaseReq"],
        [m1.InitializeSilentRequest, "InitSltReq"],
        [m1.InitializeClientApplication, "InitClientApplication"],
        [m1.InitializeCache, "InitCache"],
        [m1.ImportExistingCache, "importCache"],
        [m1.SetUserData, "setUserData"],
        [m1.LocalStorageUpdated, "localStorageUpdated"],
        [m1.SilentIframeClientTokenHelper, "SIClientTHelper"],
        [m1.SilentHandlerInitiateAuthRequest, "SHandlerInitAuthReq"],
        [m1.SilentHandlerMonitorIframeForHash, "SltHandlerMonitorIframeForHash"],
        [m1.SilentHandlerLoadFrame, "SHandlerLoadFrame"],
        [m1.SilentHandlerLoadFrameSync, "SHandlerLoadFrameSync"],
        [m1.StandardInteractionClientCreateAuthCodeClient, "StdIntClientCreateAuthCodeClient"],
        [m1.StandardInteractionClientGetClientConfiguration, "StdIntClientGetClientConf"],
        [m1.StandardInteractionClientInitializeAuthorizationRequest, "StdIntClientInitAuthReq"],
        [m1.GetAuthCodeUrl, "GetAuthCodeUrl"],
        [m1.HandleCodeResponseFromServer, "HandleCodeResFromServer"],
        [m1.HandleCodeResponse, "HandleCodeResp"],
        [m1.HandleResponseEar, "HandleRespEar"],
        [m1.HandleResponseCode, "HandleRespCode"],
        [m1.HandleResponsePlatformBroker, "HandleRespPlatBroker"],
        [m1.UpdateTokenEndpointAuthority, "UpdTEndpointAuth"],
        [m1.AuthClientAcquireToken, "AuthClientAT"],
        [m1.AuthClientExecuteTokenRequest, "AuthClientExecTReq"],
        [m1.AuthClientCreateTokenRequestBody, "AuthClientCreateTReqBody"],
        [m1.PopTokenGenerateCnf, "PopTGenCnf"],
        [m1.PopTokenGenerateKid, "PopTGenKid"],
        [m1.HandleServerTokenResponse, "HandleServerTRes"],
        [m1.DeserializeResponse, "DeserializeRes"],
        [m1.AuthorityFactoryCreateDiscoveredInstance, "AuthFactCreateDiscInst"],
        [m1.AuthorityResolveEndpointsAsync, "AuthResolveEndpointsAsync"],
        [m1.AuthorityResolveEndpointsFromLocalSources, "AuthResolveEndpointsFromLocal"],
        [m1.AuthorityGetCloudDiscoveryMetadataFromNetwork, "AuthGetCDMetaFromNet"],
        [m1.AuthorityUpdateCloudDiscoveryMetadata, "AuthUpdCDMeta"],
        [m1.AuthorityGetEndpointMetadataFromNetwork, "AuthUpdCDMetaFromNet"],
        [m1.AuthorityUpdateEndpointMetadata, "AuthUpdEndpointMeta"],
        [m1.AuthorityUpdateMetadataWithRegionalInformation, "AuthUpdMetaWithRegInfo"],
        [m1.RegionDiscoveryDetectRegion, "RegDiscDetectReg"],
        [m1.RegionDiscoveryGetRegionFromIMDS, "RegDiscGetRegFromIMDS"],
        [m1.RegionDiscoveryGetCurrentVersion, "RegDiscGetCurrentVer"],
        [m1.AcquireTokenByCodeAsync, "ATByCodeAsync"],
        [m1.GetEndpointMetadataFromNetwork, "GetEndpointMetaFromNet"],
        [m1.GetCloudDiscoveryMetadataFromNetworkMeasurement, "GetCDMetaFromNet"],
        [m1.HandleRedirectPromiseMeasurement, "HandleRedirectPromise"],
        [m1.HandleNativeRedirectPromiseMeasurement, "HandleNtvRedirectPromise"],
        [m1.UpdateCloudDiscoveryMetadataMeasurement, "UpdateCDMeta"],
        [m1.UsernamePasswordClientAcquireToken, "UserPassClientAT"],
        [m1.NativeMessageHandlerHandshake, "NtvMsgHandlerHandshake"],
        [m1.NativeGenerateAuthResult, "NtvGenAuthRes"],
        [m1.RemoveHiddenIframe, "RemoveHiddenIframe"],
        [m1.ClearTokensAndKeysWithClaims, "ClearTAndKeysWithClaims"],
        [m1.CacheManagerGetRefreshToken, "CacheManagerGetRT"],
        [m1.GeneratePkceCodes, "GenPkceCodes"],
        [m1.GenerateCodeVerifier, "GenCodeVerifier"],
        [m1.GenerateCodeChallengeFromVerifier, "GenCodeChallengeFromVerifier"],
        [m1.Sha256Digest, "Sha256Digest"],
        [m1.GetRandomValues, "GetRandomValues"],
        [m1.GenerateHKDF, "genHKDF"],
        [m1.GenerateBaseKey, "genBaseKey"],
        [m1.Base64Decode, "b64Decode"],
        [m1.UrlEncodeArr, "urlEncArr"],
        [m1.Encrypt, "encrypt"],
        [m1.Decrypt, "decrypt"],
        [m1.GenerateEarKey, "genEarKey"],
        [m1.DecryptEarResponse, "decryptEarResp"]
    ]), _Lq = {
        NotStarted: 0,
        InProgress: 1,
        Completed: 2
    }
})
// @from(Ln 121405, Col 0)
class tk1 {
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
// @from(Ln 121416, Col 0)
class DV6 {
    generateId() {
        return "callback-id"
    }
    startMeasurement(q, K) {
        return {
            end: () => null,
            discard: () => {},
            add: () => {},
            increment: () => {},
            event: {
                eventId: this.generateId(),
                status: _Lq.InProgress,
                authority: "",
                libraryName: "",
                libraryVersion: "",
                clientId: "",
                name: q,
                startTimeMs: Date.now(),
                correlationId: K || ""
            },
            measurement: new tk1
        }
    }
    startPerformanceMeasurement() {
        return new tk1
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
// @from(Ln 121477, Col 4)
ek1 = L(() => {
    ZB(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 121481, Col 0)
function zLq({
    authOptions: q,
    systemOptions: K,
    loggerOptions: _,
    cacheOptions: z,
    storageInterface: Y,
    networkInterface: A,
    cryptoInterface: O,
    clientCredentials: w,
    libraryInfo: $,
    telemetry: j,
    serverTelemetryManager: H,
    persistencePlugin: J,
    serializableCache: X
}) {
    let M = {
        ...Oo9,
        ..._
    };
    return {
        authOptions: Mo9(q),
        systemOptions: {
            ...Ao9,
            ...K
        },
        loggerOptions: M,
        cacheOptions: {
            ...wo9,
            ...z
        },
        storageInterface: Y || new UG8(q.clientId, jV6, new IE(M), new DV6),
        networkInterface: A || $o9,
        cryptoInterface: O || jV6,
        clientCredentials: w || Ho9,
        libraryInfo: {
            ...jo9,
            ...$
        },
        telemetry: {
            ...Xo9,
            ...j
        },
        serverTelemetryManager: H || null,
        persistencePlugin: J || null,
        serializableCache: X || null
    }
}
// @from(Ln 121529, Col 0)
function Mo9(q) {
    return {
        clientCapabilities: [],
        azureCloudOptions: Jo9,
        skipAuthorityMetadataCache: !1,
        instanceAware: !1,
        encodeExtraQueryParams: !1,
        ...q
    }
}
// @from(Ln 121540, Col 0)
function QG8(q) {
    return q.authOptions.authority.options.protocolMode === bv.OIDC
}
// @from(Ln 121543, Col 4)
Ao9
// @from(Ln 121543, Col 9)
Oo9
// @from(Ln 121543, Col 14)
wo9
// @from(Ln 121543, Col 19)
$o9
// @from(Ln 121543, Col 24)
jo9
// @from(Ln 121543, Col 29)
Ho9
// @from(Ln 121543, Col 34)
Jo9
// @from(Ln 121543, Col 39)
Xo9
// @from(Ln 121544, Col 4)
dG8 = L(() => {
    Fk1();
    CG8();
    L$();
    IG8();
    xG8();
    sk1();
    Ci6();
    TP();
    ek1();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Ao9 = {
        tokenRenewalOffsetSeconds: wV6,
        preventCorsPreflight: !1
    }, Oo9 = {
        loggerCallback: () => {},
        piiLoggingEnabled: !1,
        logLevel: OJ.Info,
        correlationId: q7.EMPTY_STRING
    }, wo9 = {
        claimsBasedCachingEnabled: !1
    }, $o9 = {
        async sendGetRequestAsync() {
            throw k7(V_)
        },
        async sendPostRequestAsync() {
            throw k7(V_)
        }
    }, jo9 = {
        sku: q7.SKU,
        version: HV6,
        cpu: q7.EMPTY_STRING,
        os: q7.EMPTY_STRING
    }, Ho9 = {
        clientSecret: q7.EMPTY_STRING,
        clientAssertion: void 0
    }, Jo9 = {
        azureCloudInstance: bo.None,
        tenant: `${q7.DEFAULT_COMMON_TENANT}`
    }, Xo9 = {
        application: {
            appName: "",
            appVersion: ""
        }
    }
})
// @from(Ln 121590, Col 4)
dV
// @from(Ln 121591, Col 4)
ui6 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    dV = {
        HOME_ACCOUNT_ID: "home_account_id",
        UPN: "UPN"
    }
})
// @from(Ln 121598, Col 4)
iw6 = {}
// @from(Ln 121659, Col 4)
FQ = "client_id"
// @from(Ln 121660, Col 4)
cG8 = "redirect_uri"
// @from(Ln 121661, Col 4)
qN1 = "response_type"
// @from(Ln 121662, Col 4)
KN1 = "response_mode"
// @from(Ln 121663, Col 4)
_N1 = "grant_type"
// @from(Ln 121664, Col 4)
zN1 = "claims"
// @from(Ln 121665, Col 4)
YN1 = "scope"
// @from(Ln 121666, Col 4)
Po9 = "error"
// @from(Ln 121667, Col 4)
Wo9 = "error_description"
// @from(Ln 121668, Col 4)
Do9 = "access_token"
// @from(Ln 121669, Col 4)
Zo9 = "id_token"
// @from(Ln 121670, Col 4)
AN1 = "refresh_token"
// @from(Ln 121671, Col 4)
fo9 = "expires_in"
// @from(Ln 121672, Col 4)
Go9 = "refresh_token_expires_in"
// @from(Ln 121673, Col 4)
ON1 = "state"
// @from(Ln 121674, Col 4)
wN1 = "nonce"
// @from(Ln 121675, Col 4)
$N1 = "prompt"
// @from(Ln 121676, Col 4)
vo9 = "session_state"
// @from(Ln 121677, Col 4)
To9 = "client_info"
// @from(Ln 121678, Col 4)
jN1 = "code"
// @from(Ln 121679, Col 4)
HN1 = "code_challenge"
// @from(Ln 121680, Col 4)
JN1 = "code_challenge_method"
// @from(Ln 121681, Col 4)
XN1 = "code_verifier"
// @from(Ln 121682, Col 4)
MN1 = "client-request-id"
// @from(Ln 121683, Col 4)
PN1 = "x-client-SKU"
// @from(Ln 121684, Col 4)
WN1 = "x-client-VER"
// @from(Ln 121685, Col 4)
DN1 = "x-client-OS"
// @from(Ln 121686, Col 4)
ZN1 = "x-client-CPU"
// @from(Ln 121687, Col 4)
fN1 = "x-client-current-telemetry"
// @from(Ln 121688, Col 4)
GN1 = "x-client-last-telemetry"
// @from(Ln 121689, Col 4)
vN1 = "x-ms-lib-capability"
// @from(Ln 121690, Col 4)
TN1 = "x-app-name"
// @from(Ln 121691, Col 4)
VN1 = "x-app-ver"
// @from(Ln 121692, Col 4)
kN1 = "post_logout_redirect_uri"
// @from(Ln 121693, Col 4)
NN1 = "id_token_hint"
// @from(Ln 121694, Col 4)
EN1 = "device_code"
// @from(Ln 121695, Col 4)
yN1 = "client_secret"
// @from(Ln 121696, Col 4)
LN1 = "client_assertion"
// @from(Ln 121697, Col 4)
hN1 = "client_assertion_type"
// @from(Ln 121698, Col 4)
lG8 = "token_type"
// @from(Ln 121699, Col 4)
nG8 = "req_cnf"
// @from(Ln 121700, Col 4)
RN1 = "assertion"
// @from(Ln 121701, Col 4)
SN1 = "requested_token_use"
// @from(Ln 121702, Col 4)
Vo9 = "on_behalf_of"
// @from(Ln 121703, Col 4)
ko9 = "foci"
// @from(Ln 121704, Col 4)
No9 = "X-AnchorMailbox"
// @from(Ln 121705, Col 4)
iG8 = "return_spa_code"
// @from(Ln 121706, Col 4)
CN1 = "nativebroker"
// @from(Ln 121707, Col 4)
bN1 = "logout_hint"
// @from(Ln 121708, Col 4)
IN1 = "sid"
// @from(Ln 121709, Col 4)
xN1 = "login_hint"
// @from(Ln 121710, Col 4)
uN1 = "domain_hint"
// @from(Ln 121711, Col 4)
Eo9 = "x-client-xtra-sku"
// @from(Ln 121712, Col 4)
mi6 = "brk_client_id"
// @from(Ln 121713, Col 4)
rG8 = "brk_redirect_uri"
// @from(Ln 121714, Col 4)
ZV6 = "instance_aware"
// @from(Ln 121715, Col 4)
mN1 = "ear_jwk"
// @from(Ln 121716, Col 4)
BN1 = "ear_jwe_crypto"
// @from(Ln 121717, Col 4)
fV6 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 121719, Col 4)
b4 = {}
// @from(Ln 121769, Col 0)
function rw6(q, K, _) {
    if (!K) return;
    let z = q.get(FQ);
    if (z && q.has(mi6)) _?.addFields({
        embeddedClientId: z,
        embeddedRedirectUri: q.get(cG8)
    }, K)
}
// @from(Ln 121778, Col 0)
function yo9(q, K) {
    q.set(qN1, K)
}
// @from(Ln 121782, Col 0)
function pN1(q, K) {
    q.set(KN1, K ? K : xQ.QUERY)
}
// @from(Ln 121786, Col 0)
function Lo9(q) {
    q.set(CN1, "1")
}
// @from(Ln 121790, Col 0)
function ow6(q, K, _ = !0, z = Cv) {
    if (_ && !z.includes("openid") && !K.includes("openid")) z.push("openid");
    let Y = _ ? [...K || [], ...z] : K || [],
        A = new OX(Y);
    q.set(YN1, A.printScopes())
}
// @from(Ln 121797, Col 0)
function aw6(q, K) {
    q.set(FQ, K)
}
// @from(Ln 121801, Col 0)
function sw6(q, K) {
    q.set(cG8, K)
}
// @from(Ln 121805, Col 0)
function FN1(q, K) {
    q.set(kN1, K)
}
// @from(Ln 121809, Col 0)
function gN1(q, K) {
    q.set(NN1, K)
}
// @from(Ln 121813, Col 0)
function UN1(q, K) {
    q.set(uN1, K)
}
// @from(Ln 121817, Col 0)
function GV6(q, K) {
    q.set(xN1, K)
}
// @from(Ln 121821, Col 0)
function Lq6(q, K) {
    q.set(y$.CCS_HEADER, `UPN:${K}`)
}
// @from(Ln 121825, Col 0)
function mo(q, K) {
    q.set(y$.CCS_HEADER, `Oid:${K.uid}@${K.utid}`)
}
// @from(Ln 121829, Col 0)
function oG8(q, K) {
    q.set(IN1, K)
}
// @from(Ln 121833, Col 0)
function tw6(q, K, _) {
    let z = YLq(K, _);
    try {
        JSON.parse(z)
    } catch (Y) {
        throw aw(Vq6)
    }
    q.set(zN1, z)
}
// @from(Ln 121843, Col 0)
function ew6(q, K) {
    q.set(MN1, K)
}
// @from(Ln 121847, Col 0)
function Bi6(q, K) {
    if (q.set(PN1, K.sku), q.set(WN1, K.version), K.os) q.set(DN1, K.os);
    if (K.cpu) q.set(ZN1, K.cpu)
}
// @from(Ln 121852, Col 0)
function pi6(q, K) {
    if (K?.appName) q.set(TN1, K.appName);
    if (K?.appVersion) q.set(VN1, K.appVersion)
}
// @from(Ln 121857, Col 0)
function QN1(q, K) {
    q.set($N1, K)
}
// @from(Ln 121861, Col 0)
function Fi6(q, K) {
    if (K) q.set(ON1, K)
}
// @from(Ln 121865, Col 0)
function dN1(q, K) {
    q.set(wN1, K)
}
// @from(Ln 121869, Col 0)
function ho9(q, K, _) {
    if (K && _) q.set(HN1, K), q.set(JN1, _);
    else throw aw(Qw6)
}
// @from(Ln 121874, Col 0)
function cN1(q, K) {
    q.set(jN1, K)
}
// @from(Ln 121878, Col 0)
function Ro9(q, K) {
    q.set(EN1, K)
}
// @from(Ln 121882, Col 0)
function lN1(q, K) {
    q.set(AN1, K)
}
// @from(Ln 121886, Col 0)
function nN1(q, K) {
    q.set(XN1, K)
}
// @from(Ln 121890, Col 0)
function gi6(q, K) {
    q.set(yN1, K)
}
// @from(Ln 121894, Col 0)
function Ui6(q, K) {
    if (K) q.set(LN1, K)
}
// @from(Ln 121898, Col 0)
function Qi6(q, K) {
    if (K) q.set(hN1, K)
}
// @from(Ln 121902, Col 0)
function So9(q, K) {
    q.set(RN1, K)
}
// @from(Ln 121906, Col 0)
function Co9(q, K) {
    q.set(SN1, K)
}
// @from(Ln 121910, Col 0)
function di6(q, K) {
    q.set(_N1, K)
}
// @from(Ln 121914, Col 0)
function q26(q) {
    q.set(cyq, "1")
}
// @from(Ln 121918, Col 0)
function ci6(q) {
    if (!q.has(ZV6)) q.set(ZV6, "true")
}
// @from(Ln 121922, Col 0)
function Bo(q, K) {
    Object.entries(K).forEach(([_, z]) => {
        if (!q.has(_) && z) q.set(_, z)
    })
}
// @from(Ln 121928, Col 0)
function YLq(q, K) {
    let _;
    if (!q) _ = {};
    else try {
        _ = JSON.parse(q)
    } catch (z) {
        throw aw(Vq6)
    }
    if (K && K.length > 0) {
        if (!_.hasOwnProperty(Dw6.ACCESS_TOKEN)) _[Dw6.ACCESS_TOKEN] = {};
        _[Dw6.ACCESS_TOKEN][Dw6.XMS_CC] = {
            values: K
        }
    }
    return JSON.stringify(_)
}
// @from(Ln 121945, Col 0)
function bo9(q, K) {
    q.set(Ki6.username, K)
}
// @from(Ln 121949, Col 0)
function Io9(q, K) {
    q.set(Ki6.password, K)
}
// @from(Ln 121953, Col 0)
function li6(q, K) {
    if (K) q.set(lG8, hz.POP), q.set(nG8, K)
}
// @from(Ln 121957, Col 0)
function ni6(q, K) {
    if (K) q.set(lG8, hz.SSH), q.set(nG8, K)
}
// @from(Ln 121961, Col 0)
function ii6(q, K) {
    q.set(fN1, K.generateCurrentRequestHeaderValue()), q.set(GN1, K.generateLastRequestHeaderValue())
}
// @from(Ln 121965, Col 0)
function ri6(q) {
    q.set(vN1, uQ.X_MS_LIB_CAPABILITY_VALUE)
}
// @from(Ln 121969, Col 0)
function iN1(q, K) {
    q.set(bN1, K)
}
// @from(Ln 121973, Col 0)
function po(q, K, _) {
    if (!q.has(mi6)) q.set(mi6, K);
    if (!q.has(rG8)) q.set(rG8, _)
}
// @from(Ln 121978, Col 0)
function xo9(q, K) {
    q.set(mN1, encodeURIComponent(K));
    let _ = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0";
    q.set(BN1, _)
}
// @from(Ln 121984, Col 0)
function uo9(q, K) {
    Object.entries(K).forEach(([_, z]) => {
        if (z) q.set(_, z)
    })
}
// @from(Ln 121989, Col 4)
vV6 = L(() => {
    L$();
    fV6();
    Ri6();
    Nq6();
    xo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 121997, Col 0)
function ALq(q) {
    return q.hasOwnProperty("authorization_endpoint") && q.hasOwnProperty("token_endpoint") && q.hasOwnProperty("issuer") && q.hasOwnProperty("jwks_uri")
}
// @from(Ln 122000, Col 4)
OLq = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122003, Col 0)
function wLq(q) {
    return q.hasOwnProperty("tenant_discovery_endpoint") && q.hasOwnProperty("metadata")
}
// @from(Ln 122006, Col 4)
$Lq = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122009, Col 0)
function jLq(q) {
    return q.hasOwnProperty("error") && q.hasOwnProperty("error_description")
}
// @from(Ln 122012, Col 4)
HLq = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122014, Col 4)
JLq = (q, K, _, z, Y) => {
        return (...A) => {
            _.trace(`Executing function ${K}`);
            let O = z?.startMeasurement(K, Y);
            if (Y) {
                let w = K + "CallCount";
                z?.incrementFields({
                    [w]: 1
                }, Y)
            }
            try {
                let w = q(...A);
                return O?.end({
                    success: !0
                }), _.trace(`Returning result from ${K}`), w
            } catch (w) {
                _.trace(`Error occurred in ${K}`);
                try {
                    _.trace(JSON.stringify(w))
                } catch ($) {
                    _.trace("Unable to print error message.")
                }
                throw O?.end({
                    success: !1
                }, w), w
            }
        }
    }
// @from(Ln 122042, Col 4)
AY = (q, K, _, z, Y) => {
        return (...A) => {
            _.trace(`Executing function ${K}`);
            let O = z?.startMeasurement(K, Y);
            if (Y) {
                let w = K + "CallCount";
                z?.incrementFields({
                    [w]: 1
                }, Y)
            }
            return z?.setPreQueueTime(K, Y), q(...A).then((w) => {
                return _.trace(`Returning result from ${K}`), O?.end({
                    success: !0
                }), w
            }).catch((w) => {
                _.trace(`Error occurred in ${K}`);
                try {
                    _.trace(JSON.stringify(w))
                } catch ($) {
                    _.trace("Unable to print error message.")
                }
                throw O?.end({
                    success: !1
                }, w), w
            })
        }
    }
// @from(Ln 122069, Col 4)
Fo = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122071, Col 0)
class oi6 {
    constructor(q, K, _, z) {
        this.networkInterface = q, this.logger = K, this.performanceClient = _, this.correlationId = z
    }
    async detectRegion(q, K) {
        this.performanceClient?.addQueueMeasurement(m1.RegionDiscoveryDetectRegion, this.correlationId);
        let _ = q;
        if (!_) {
            let z = oi6.IMDS_OPTIONS;
            try {
                let Y = await AY(this.getRegionFromIMDS.bind(this), m1.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(q7.IMDS_VERSION, z);
                if (Y.status === f9.SUCCESS) _ = Y.body, K.region_source = fw6.IMDS;
                if (Y.status === f9.BAD_REQUEST) {
                    let A = await AY(this.getCurrentVersion.bind(this), m1.RegionDiscoveryGetCurrentVersion, this.logger, this.performanceClient, this.correlationId)(z);
                    if (!A) return K.region_source = fw6.FAILED_AUTO_DETECTION, null;
                    let O = await AY(this.getRegionFromIMDS.bind(this), m1.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(A, z);
                    if (O.status === f9.SUCCESS) _ = O.body, K.region_source = fw6.IMDS
                }
            } catch (Y) {
                return K.region_source = fw6.FAILED_AUTO_DETECTION, null
            }
        } else K.region_source = fw6.ENVIRONMENT_VARIABLE;
        if (!_) K.region_source = fw6.FAILED_AUTO_DETECTION;
        return _ || null
    }
    async getRegionFromIMDS(q, K) {
        return this.performanceClient?.addQueueMeasurement(m1.RegionDiscoveryGetRegionFromIMDS, this.correlationId), this.networkInterface.sendGetRequestAsync(`${q7.IMDS_ENDPOINT}?api-version=${q}&format=text`, K, q7.IMDS_TIMEOUT)
    }
    async getCurrentVersion(q) {
        this.performanceClient?.addQueueMeasurement(m1.RegionDiscoveryGetCurrentVersion, this.correlationId);
        try {
            let K = await this.networkInterface.sendGetRequestAsync(`${q7.IMDS_ENDPOINT}?format=json`, q);
            if (K.status === f9.BAD_REQUEST && K.body && K.body["newest-versions"] && K.body["newest-versions"].length > 0) return K.body["newest-versions"][0];
            return null
        } catch (K) {
            return null
        }
    }
}
// @from(Ln 122110, Col 4)
XLq = L(() => {
    L$();
    ZB();
    Fo(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    oi6.IMDS_OPTIONS = {
        headers: {
            Metadata: "true"
        }
    }
})
// @from(Ln 122120, Col 4)
wj = {}
// @from(Ln 122131, Col 0)
function ih() {
    return Math.round(new Date().getTime() / 1000)
}
// @from(Ln 122135, Col 0)
function mo9(q) {
    return q.getTime() / 1000
}
// @from(Ln 122139, Col 0)
function ai6(q) {
    if (q) return new Date(Number(q) * 1000);
    return new Date
}
// @from(Ln 122144, Col 0)
function TV6(q, K) {
    let _ = Number(q) || 0;
    return ih() + K > _
}
// @from(Ln 122149, Col 0)
function Bo9(q, K) {
    let _ = Number(q) + K * 24 * 60 * 60 * 1000;
    return Date.now() > _
}
// @from(Ln 122154, Col 0)
function rN1(q) {
    return Number(q) > ih()
}
// @from(Ln 122158, Col 0)
function po9(q, K) {
    return new Promise((_) => setTimeout(() => _(K), q))
}
// @from(Ln 122161, Col 4)
hq6 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 122163, Col 4)
cV = {}
// @from(Ln 122183, Col 0)
function oN1(q, K, _, z, Y) {
    return {
        credentialType: dO.ID_TOKEN,
        homeAccountId: q,
        environment: K,
        clientId: z,
        secret: _,
        realm: Y,
        lastUpdatedAt: Date.now().toString()
    }
}
// @from(Ln 122195, Col 0)
function aN1(q, K, _, z, Y, A, O, w, $, j, H, J, X, M, P) {
    let W = {
        homeAccountId: q,
        credentialType: dO.ACCESS_TOKEN,
        secret: _,
        cachedAt: ih().toString(),
        expiresOn: O.toString(),
        extendedExpiresOn: w.toString(),
        environment: K,
        clientId: z,
        realm: Y,
        target: A,
        tokenType: H || hz.BEARER,
        lastUpdatedAt: Date.now().toString()
    };
    if (J) W.userAssertionHash = J;
    if (j) W.refreshOn = j.toString();
    if (M) W.requestedClaims = M, W.requestedClaimsHash = P;
    if (W.tokenType?.toLowerCase() !== hz.BEARER.toLowerCase()) switch (W.credentialType = dO.ACCESS_TOKEN_WITH_AUTH_SCHEME, W.tokenType) {
        case hz.POP:
            let D = uo(_, $);
            if (!D?.cnf?.kid) throw k7(bw6);
            W.keyId = D.cnf.kid;
            break;
        case hz.SSH:
            W.keyId = X
    }
    return W
}
// @from(Ln 122225, Col 0)
function sN1(q, K, _, z, Y, A, O) {
    let w = {
        credentialType: dO.REFRESH_TOKEN,
        homeAccountId: q,
        environment: K,
        clientId: z,
        secret: _,
        lastUpdatedAt: Date.now().toString()
    };
    if (A) w.userAssertionHash = A;
    if (Y) w.familyId = Y;
    if (O) w.expiresOn = O.toString();
    return w
}
// @from(Ln 122240, Col 0)
function aG8(q) {
    return q.hasOwnProperty("homeAccountId") && q.hasOwnProperty("environment") && q.hasOwnProperty("credentialType") && q.hasOwnProperty("clientId") && q.hasOwnProperty("secret")
}
// @from(Ln 122244, Col 0)
function Fo9(q) {
    if (!q) return !1;
    return aG8(q) && q.hasOwnProperty("realm") && q.hasOwnProperty("target") && (q.credentialType === dO.ACCESS_TOKEN || q.credentialType === dO.ACCESS_TOKEN_WITH_AUTH_SCHEME)
}
// @from(Ln 122249, Col 0)
function go9(q) {
    if (!q) return !1;
    return aG8(q) && q.hasOwnProperty("realm") && q.credentialType === dO.ID_TOKEN
}
// @from(Ln 122254, Col 0)
function Uo9(q) {
    if (!q) return !1;
    return aG8(q) && q.credentialType === dO.REFRESH_TOKEN
}
// @from(Ln 122259, Col 0)
function Qo9(q, K) {
    let _ = q.indexOf(FW.CACHE_KEY) === 0,
        z = !0;
    if (K) z = K.hasOwnProperty("failedRequests") && K.hasOwnProperty("errors") && K.hasOwnProperty("cacheHits");
    return _ && z
}
// @from(Ln 122266, Col 0)
function do9(q, K) {
    let _ = !1;
    if (q) _ = q.indexOf(uQ.THROTTLING_PREFIX) === 0;
    let z = !0;
    if (K) z = K.hasOwnProperty("throttleTime");
    return _ && z
}
// @from(Ln 122274, Col 0)
function co9({
    environment: q,
    clientId: K
}) {
    return [en6, q, K].join(Lo.CACHE_KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 122281, Col 0)
function lo9(q, K) {
    if (!K) return !1;
    return q.indexOf(en6) === 0 && K.hasOwnProperty("clientId") && K.hasOwnProperty("environment")
}
// @from(Ln 122286, Col 0)
function no9(q, K) {
    if (!K) return !1;
    return q.indexOf(OV6.CACHE_KEY) === 0 && K.hasOwnProperty("aliases") && K.hasOwnProperty("preferred_cache") && K.hasOwnProperty("preferred_network") && K.hasOwnProperty("canonical_authority") && K.hasOwnProperty("authorization_endpoint") && K.hasOwnProperty("token_endpoint") && K.hasOwnProperty("issuer") && K.hasOwnProperty("aliasesFromNetwork") && K.hasOwnProperty("endpointsFromNetwork") && K.hasOwnProperty("expiresAt") && K.hasOwnProperty("jwks_uri")
}
// @from(Ln 122291, Col 0)
function sG8() {
    return ih() + OV6.REFRESH_TIME_SECONDS
}
// @from(Ln 122295, Col 0)
function VV6(q, K, _) {
    q.authorization_endpoint = K.authorization_endpoint, q.token_endpoint = K.token_endpoint, q.end_session_endpoint = K.end_session_endpoint, q.issuer = K.issuer, q.endpointsFromNetwork = _, q.jwks_uri = K.jwks_uri
}
// @from(Ln 122299, Col 0)
function si6(q, K, _) {
    q.aliases = K.aliases, q.preferred_cache = K.preferred_cache, q.preferred_network = K.preferred_network, q.aliasesFromNetwork = _
}
// @from(Ln 122303, Col 0)
function tG8(q) {
    return q.expiresAt <= ih()
}
// @from(Ln 122306, Col 4)
eG8 = L(() => {
    WV6();
    TP();
    L$();
    hq6();
    wM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})