
// @from(Start 7961270, End 7964062)
class RU {
  constructor(A, Q, B) {
    this.level = lY.Info;
    let G = () => {
        return
      },
      Z = A || RU.createDefaultLoggerOptions();
    this.localCallback = Z.loggerCallback || G, this.piiLoggingEnabled = Z.piiLoggingEnabled || !1, this.level = typeof Z.logLevel === "number" ? Z.logLevel : lY.Info, this.correlationId = Z.correlationId || L0.EMPTY_STRING, this.packageName = Q || L0.EMPTY_STRING, this.packageVersion = B || L0.EMPTY_STRING
  }
  static createDefaultLoggerOptions() {
    return {
      loggerCallback: () => {},
      piiLoggingEnabled: !1,
      logLevel: lY.Info
    }
  }
  clone(A, Q, B) {
    return new RU({
      loggerCallback: this.localCallback,
      piiLoggingEnabled: this.piiLoggingEnabled,
      logLevel: this.level,
      correlationId: B || this.correlationId
    }, A, Q)
  }
  logMessage(A, Q) {
    if (Q.logLevel > this.level || !this.piiLoggingEnabled && Q.containsPii) return;
    let Z = `${`[${new Date().toUTCString()}] : [${Q.correlationId||this.correlationId||""}]`} : ${this.packageName}@${this.packageVersion} : ${lY[Q.logLevel]} - ${A}`;
    this.executeCallback(Q.logLevel, Z, Q.containsPii || !1)
  }
  executeCallback(A, Q, B) {
    if (this.localCallback) this.localCallback(A, Q, B)
  }
  error(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Error,
      containsPii: !1,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  errorPii(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Error,
      containsPii: !0,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  warning(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Warning,
      containsPii: !1,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  warningPii(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Warning,
      containsPii: !0,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  info(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Info,
      containsPii: !1,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  infoPii(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Info,
      containsPii: !0,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  verbose(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Verbose,
      containsPii: !1,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  verbosePii(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Verbose,
      containsPii: !0,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  trace(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Trace,
      containsPii: !1,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  tracePii(A, Q) {
    this.logMessage(A, {
      logLevel: lY.Trace,
      containsPii: !0,
      correlationId: Q || L0.EMPTY_STRING
    })
  }
  isPiiLoggingEnabled() {
    return this.piiLoggingEnabled || !1
  }
}
// @from(Start 7964067, End 7964069)
lY
// @from(Start 7964075, End 7964325)
wA1 = L(() => {
  mZ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  (function(A) {
    A[A.Error = 0] = "Error", A[A.Warning = 1] = "Warning", A[A.Info = 2] = "Info", A[A.Verbose = 3] = "Verbose", A[A.Trace = 4] = "Trace"
  })(lY || (lY = {}))
})
// @from(Start 7964331, End 7964357)
qA1 = "@azure/msal-common"
// @from(Start 7964361, End 7964376)
MZA = "15.13.1"
// @from(Start 7964382, End 7964448)
NA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7964454, End 7964456)
hf
// @from(Start 7964462, End 7964822)
LA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  hf = {
    None: "none",
    AzurePublic: "https://login.microsoftonline.com",
    AzurePpe: "https://login.windows-ppe.net",
    AzureChina: "https://login.chinacloudapi.cn",
    AzureGermany: "https://login.microsoftonline.de",
    AzureUsGovernment: "https://login.microsoftonline.us"
  }
})
// @from(Start 7964828, End 7964836)
OZA = {}
// @from(Start 7965665, End 7965690)
ie = "redirect_uri_empty"
// @from(Start 7965694, End 7965730)
RqA = "claims_request_parsing_error"
// @from(Start 7965734, End 7965763)
ne = "authority_uri_insecure"
// @from(Start 7965767, End 7965789)
Vk = "url_parse_error"
// @from(Start 7965793, End 7965815)
ae = "empty_url_error"
// @from(Start 7965819, End 7965850)
se = "empty_input_scopes_error"
// @from(Start 7965854, End 7965875)
Wl = "invalid_claims"
// @from(Start 7965879, End 7965905)
re = "token_request_empty"
// @from(Start 7965909, End 7965936)
oe = "logout_request_empty"
// @from(Start 7965940, End 7965977)
TqA = "invalid_code_challenge_method"
// @from(Start 7965981, End 7966007)
te = "pkce_params_missing"
// @from(Start 7966011, End 7966050)
Xl = "invalid_cloud_discovery_metadata"
// @from(Start 7966054, End 7966087)
ee = "invalid_authority_metadata"
// @from(Start 7966091, End 7966118)
AAA = "untrusted_authority"
// @from(Start 7966122, End 7966144)
gf = "missing_ssh_jwk"
// @from(Start 7966148, End 7966171)
PqA = "missing_ssh_kid"
// @from(Start 7966175, End 7966218)
jqA = "missing_nonce_authentication_header"
// @from(Start 7966222, End 7966259)
SqA = "invalid_authentication_header"
// @from(Start 7966263, End 7966293)
_qA = "cannot_set_OIDCOptions"
// @from(Start 7966297, End 7966333)
kqA = "cannot_allow_platform_broker"
// @from(Start 7966337, End 7966363)
yqA = "authority_mismatch"
// @from(Start 7966367, End 7966405)
xqA = "invalid_request_method_for_EAR"
// @from(Start 7966409, End 7966455)
vqA = "invalid_authorize_post_body_parameters"
// @from(Start 7966461, End 7966526)
uf = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7966529, End 7966567)
function hG(A) {
  return new RZA(A)
}
// @from(Start 7966572, End 7966574)
JY
// @from(Start 7966576, End 7966579)
Ia1
// @from(Start 7966581, End 7966584)
RZA
// @from(Start 7966590, End 7971327)
Vl = L(() => {
  PM();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  JY = {
    [ie]: "A redirect URI is required for all calls, and none has been set.",
    [RqA]: "Could not parse the given claims request object.",
    [ne]: "Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",
    [Vk]: "URL could not be parsed into appropriate segments.",
    [ae]: "URL was empty or null.",
    [se]: "Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token.",
    [Wl]: "Given claims parameter must be a stringified JSON object.",
    [re]: "Token request was empty and not found in cache.",
    [oe]: "The logout request was null or undefined.",
    [TqA]: 'code_challenge_method passed is invalid. Valid values are "plain" and "S256".',
    [te]: "Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request",
    [Xl]: "Invalid cloudDiscoveryMetadata provided. Must be a stringified JSON object containing tenant_discovery_endpoint and metadata fields",
    [ee]: "Invalid authorityMetadata provided. Must by a stringified JSON object containing authorization_endpoint, token_endpoint, issuer fields.",
    [AAA]: "The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter.",
    [gf]: "Missing sshJwk in SSH certificate request. A stringified JSON Web Key is required when using the SSH authentication scheme.",
    [PqA]: "Missing sshKid in SSH certificate request. A string that uniquely identifies the public SSH key is required when using the SSH authentication scheme.",
    [jqA]: "Unable to find an authentication header containing server nonce. Either the Authentication-Info or WWW-Authenticate headers must be present in order to obtain a server nonce.",
    [SqA]: "Invalid authentication header provided",
    [_qA]: "Cannot set OIDCOptions parameter. Please change the protocol mode to OIDC or use a non-Microsoft authority.",
    [kqA]: "Cannot set allowPlatformBroker parameter to true when not in AAD protocol mode.",
    [yqA]: "Authority mismatch error. Authority provided in login request or PublicClientApplication config does not match the environment of the provided account. Please use a matching account or make an interactive request to login to this authority.",
    [vqA]: "Invalid authorize post body parameters provided. If you are using authorizePostBodyParameters, the request method must be POST. Please check the request method and parameters.",
    [xqA]: "Invalid request method for EAR protocol mode. The request method cannot be GET when using EAR protocol mode. Please change the request method to POST."
  }, Ia1 = {
    redirectUriNotSet: {
      code: ie,
      desc: JY[ie]
    },
    claimsRequestParsingError: {
      code: RqA,
      desc: JY[RqA]
    },
    authorityUriInsecure: {
      code: ne,
      desc: JY[ne]
    },
    urlParseError: {
      code: Vk,
      desc: JY[Vk]
    },
    urlEmptyError: {
      code: ae,
      desc: JY[ae]
    },
    emptyScopesError: {
      code: se,
      desc: JY[se]
    },
    invalidClaimsRequest: {
      code: Wl,
      desc: JY[Wl]
    },
    tokenRequestEmptyError: {
      code: re,
      desc: JY[re]
    },
    logoutRequestEmptyError: {
      code: oe,
      desc: JY[oe]
    },
    invalidCodeChallengeMethod: {
      code: TqA,
      desc: JY[TqA]
    },
    invalidCodeChallengeParams: {
      code: te,
      desc: JY[te]
    },
    invalidCloudDiscoveryMetadata: {
      code: Xl,
      desc: JY[Xl]
    },
    invalidAuthorityMetadata: {
      code: ee,
      desc: JY[ee]
    },
    untrustedAuthority: {
      code: AAA,
      desc: JY[AAA]
    },
    missingSshJwk: {
      code: gf,
      desc: JY[gf]
    },
    missingSshKid: {
      code: PqA,
      desc: JY[PqA]
    },
    missingNonceAuthenticationHeader: {
      code: jqA,
      desc: JY[jqA]
    },
    invalidAuthenticationHeader: {
      code: SqA,
      desc: JY[SqA]
    },
    cannotSetOIDCOptions: {
      code: _qA,
      desc: JY[_qA]
    },
    cannotAllowPlatformBroker: {
      code: kqA,
      desc: JY[kqA]
    },
    authorityMismatch: {
      code: yqA,
      desc: JY[yqA]
    },
    invalidAuthorizePostBodyParameters: {
      code: vqA,
      desc: JY[vqA]
    },
    invalidRequestMethodForEAR: {
      code: xqA,
      desc: JY[xqA]
    }
  };
  RZA = class RZA extends t4 {
    constructor(A) {
      super(A, JY[A]);
      this.name = "ClientConfigurationError", Object.setPrototypeOf(this, RZA.prototype)
    }
  }
})
// @from(Start 7971329, End 7972361)
class KZ {
  static isEmptyObj(A) {
    if (A) try {
      let Q = JSON.parse(A);
      return Object.keys(Q).length === 0
    } catch (Q) {}
    return !0
  }
  static startsWith(A, Q) {
    return A.indexOf(Q) === 0
  }
  static endsWith(A, Q) {
    return A.length >= Q.length && A.lastIndexOf(Q) === A.length - Q.length
  }
  static queryStringToObject(A) {
    let Q = {},
      B = A.split("&"),
      G = (Z) => decodeURIComponent(Z.replace(/\+/g, " "));
    return B.forEach((Z) => {
      if (Z.trim()) {
        let [I, Y] = Z.split(/=(.+)/g, 2);
        if (I && Y) Q[G(I)] = G(Y)
      }
    }), Q
  }
  static trimArrayEntries(A) {
    return A.map((Q) => Q.trim())
  }
  static removeEmptyStringsFromArray(A) {
    return A.filter((Q) => {
      return !!Q
    })
  }
  static jsonParseHelper(A) {
    try {
      return JSON.parse(A)
    } catch (Q) {
      return null
    }
  }
  static matchPattern(A, Q) {
    return new RegExp(A.replace(/\\/g, "\\\\").replace(/\*/g, "[^ ]*").replace(/\?/g, "\\?")).test(Q)
  }
}
// @from(Start 7972366, End 7972431)
Fl = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7972433, End 7974558)
class SJ {
  constructor(A) {
    let Q = A ? KZ.trimArrayEntries([...A]) : [],
      B = Q ? KZ.removeEmptyStringsFromArray(Q) : [];
    if (!B || !B.length) throw hG(se);
    this.scopes = new Set, B.forEach((G) => this.scopes.add(G))
  }
  static fromString(A) {
    let B = (A || L0.EMPTY_STRING).split(" ");
    return new SJ(B)
  }
  static createSearchScopes(A) {
    let Q = A && A.length > 0 ? A : [...nH],
      B = new SJ(Q);
    if (!B.containsOnlyOIDCScopes()) B.removeOIDCScopes();
    else B.removeScope(L0.OFFLINE_ACCESS_SCOPE);
    return B
  }
  containsScope(A) {
    let Q = this.printScopesLowerCase().split(" "),
      B = new SJ(Q);
    return A ? B.scopes.has(A.toLowerCase()) : !1
  }
  containsScopeSet(A) {
    if (!A || A.scopes.size <= 0) return !1;
    return this.scopes.size >= A.scopes.size && A.asArray().every((Q) => this.containsScope(Q))
  }
  containsOnlyOIDCScopes() {
    let A = 0;
    return en1.forEach((Q) => {
      if (this.containsScope(Q)) A += 1
    }), this.scopes.size === A
  }
  appendScope(A) {
    if (A) this.scopes.add(A.trim())
  }
  appendScopes(A) {
    try {
      A.forEach((Q) => this.appendScope(Q))
    } catch (Q) {
      throw b0(ue)
    }
  }
  removeScope(A) {
    if (!A) throw b0(ge);
    this.scopes.delete(A.trim())
  }
  removeOIDCScopes() {
    en1.forEach((A) => {
      this.scopes.delete(A)
    })
  }
  unionScopeSets(A) {
    if (!A) throw b0(Il);
    let Q = new Set;
    return A.scopes.forEach((B) => Q.add(B.toLowerCase())), this.scopes.forEach((B) => Q.add(B.toLowerCase())), Q
  }
  intersectingScopeSets(A) {
    if (!A) throw b0(Il);
    if (!A.containsOnlyOIDCScopes()) A.removeOIDCScopes();
    let Q = this.unionScopeSets(A),
      B = A.getScopeCount(),
      G = this.getScopeCount();
    return Q.size < G + B
  }
  getScopeCount() {
    return this.scopes.size
  }
  asArray() {
    let A = [];
    return this.scopes.forEach((Q) => A.push(Q)), A
  }
  printScopes() {
    if (this.scopes) return this.asArray().join(" ");
    return L0.EMPTY_STRING
  }
  printScopesLowerCase() {
    return this.printScopes().toLowerCase()
  }
}
// @from(Start 7974563, End 7974675)
bqA = L(() => {
  Vl();
  Fl();
  dX();
  mZ();
  uf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 7974678, End 7974812)
function TZA(A, Q) {
  if (!A) throw b0(je);
  try {
    let B = Q(A);
    return JSON.parse(B)
  } catch (B) {
    throw b0(Bl)
  }
}
// @from(Start 7974814, End 7974982)
function Fk(A) {
  if (!A) throw b0(Bl);
  let Q = A.split(yf.CLIENT_INFO_SEPARATOR, 2);
  return {
    uid: Q[0],
    utid: Q.length < 2 ? L0.EMPTY_STRING : Q[1]
  }
}
// @from(Start 7974987, End 7975075)
PZA = L(() => {
  dX();
  mZ();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 7975078, End 7975145)
function DaB(A, Q) {
  return !!A && !!Q && A === Q.split(".")[1]
}
// @from(Start 7975147, End 7975655)
function fqA(A, Q, B, G) {
  if (G) {
    let {
      oid: Z,
      sub: I,
      tid: Y,
      name: J,
      tfp: W,
      acr: X,
      preferred_username: V,
      upn: F,
      login_hint: K
    } = G, D = Y || W || X || "";
    return {
      tenantId: D,
      localAccountId: Z || I || "",
      name: J,
      username: V || F || "",
      loginHint: K,
      isHomeTenant: DaB(D, A)
    }
  } else return {
    tenantId: B,
    localAccountId: Q,
    username: "",
    isHomeTenant: DaB(B, A)
  }
}
// @from(Start 7975657, End 7976031)
function MA1(A, Q, B, G) {
  let Z = A;
  if (Q) {
    let {
      isHomeTenant: I,
      ...Y
    } = Q;
    Z = {
      ...A,
      ...Y
    }
  }
  if (B) {
    let {
      isHomeTenant: I,
      ...Y
    } = fqA(A.homeAccountId, A.localAccountId, A.tenantId, B);
    return Z = {
      ...Z,
      ...Y,
      idTokenClaims: B,
      idToken: G
    }, Z
  }
  return Z
}
// @from(Start 7976036, End 7976102)
OA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7976108, End 7976110)
jM
// @from(Start 7976116, End 7976249)
Ya1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  jM = {
    Default: 0,
    Adfs: 1,
    Dsts: 2,
    Ciam: 3
  }
})
// @from(Start 7976252, End 7976334)
function RA1(A) {
  if (A) return A.tid || A.tfp || A.acr || null;
  return null
}
// @from(Start 7976339, End 7976405)
Ja1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7976411, End 7976413)
aH
// @from(Start 7976419, End 7976547)
hqA = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  aH = {
    AAD: "AAD",
    OIDC: "OIDC",
    EAR: "EAR"
  }
})
// @from(Start 7976549, End 7979986)
class cX {
  static getAccountInfo(A) {
    return {
      homeAccountId: A.homeAccountId,
      environment: A.environment,
      tenantId: A.realm,
      username: A.username,
      localAccountId: A.localAccountId,
      loginHint: A.loginHint,
      name: A.name,
      nativeAccountId: A.nativeAccountId,
      authorityType: A.authorityType,
      tenantProfiles: new Map((A.tenantProfiles || []).map((Q) => {
        return [Q.tenantId, Q]
      })),
      dataBoundary: A.dataBoundary
    }
  }
  isSingleTenant() {
    return !this.tenantProfiles
  }
  static createAccount(A, Q, B) {
    let G = new cX;
    if (Q.authorityType === jM.Adfs) G.authorityType = Te.ADFS_ACCOUNT_TYPE;
    else if (Q.protocolMode === aH.OIDC) G.authorityType = Te.GENERIC_ACCOUNT_TYPE;
    else G.authorityType = Te.MSSTS_ACCOUNT_TYPE;
    let Z;
    if (A.clientInfo && B) {
      if (Z = TZA(A.clientInfo, B), Z.xms_tdbr) G.dataBoundary = Z.xms_tdbr === "EU" ? "EU" : "None"
    }
    G.clientInfo = A.clientInfo, G.homeAccountId = A.homeAccountId, G.nativeAccountId = A.nativeAccountId;
    let I = A.environment || Q && Q.getPreferredCache();
    if (!I) throw b0(bf);
    G.environment = I, G.realm = Z?.utid || RA1(A.idTokenClaims) || "", G.localAccountId = Z?.uid || A.idTokenClaims?.oid || A.idTokenClaims?.sub || "";
    let Y = A.idTokenClaims?.preferred_username || A.idTokenClaims?.upn,
      J = A.idTokenClaims?.emails ? A.idTokenClaims.emails[0] : null;
    if (G.username = Y || J || "", G.loginHint = A.idTokenClaims?.login_hint, G.name = A.idTokenClaims?.name || "", G.cloudGraphHostName = A.cloudGraphHostName, G.msGraphHost = A.msGraphHost, A.tenantProfiles) G.tenantProfiles = A.tenantProfiles;
    else {
      let W = fqA(A.homeAccountId, G.localAccountId, G.realm, A.idTokenClaims);
      G.tenantProfiles = [W]
    }
    return G
  }
  static createFromAccountInfo(A, Q, B) {
    let G = new cX;
    return G.authorityType = A.authorityType || Te.GENERIC_ACCOUNT_TYPE, G.homeAccountId = A.homeAccountId, G.localAccountId = A.localAccountId, G.nativeAccountId = A.nativeAccountId, G.realm = A.tenantId, G.environment = A.environment, G.username = A.username, G.name = A.name, G.loginHint = A.loginHint, G.cloudGraphHostName = Q, G.msGraphHost = B, G.tenantProfiles = Array.from(A.tenantProfiles?.values() || []), G.dataBoundary = A.dataBoundary, G
  }
  static generateHomeAccountId(A, Q, B, G, Z) {
    if (!(Q === jM.Adfs || Q === jM.Dsts)) {
      if (A) try {
        let I = TZA(A, G.base64Decode);
        if (I.uid && I.utid) return `${I.uid}.${I.utid}`
      } catch (I) {}
      B.warning("No client info in response")
    }
    return Z?.sub || ""
  }
  static isAccountEntity(A) {
    if (!A) return !1;
    return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("realm") && A.hasOwnProperty("localAccountId") && A.hasOwnProperty("username") && A.hasOwnProperty("authorityType")
  }
  static accountInfoIsEqual(A, Q, B) {
    if (!A || !Q) return !1;
    let G = !0;
    if (B) {
      let Z = A.idTokenClaims || {},
        I = Q.idTokenClaims || {};
      G = Z.iat === I.iat && Z.nonce === I.nonce
    }
    return A.homeAccountId === Q.homeAccountId && A.localAccountId === Q.localAccountId && A.username === Q.username && A.tenantId === Q.tenantId && A.loginHint === Q.loginHint && A.environment === Q.environment && A.nativeAccountId === Q.nativeAccountId && G
  }
}
// @from(Start 7979991, End 7980124)
TA1 = L(() => {
  mZ();
  PZA();
  OA1();
  dX();
  Ya1();
  Ja1();
  hqA();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 7980130, End 7980138)
PA1 = {}
// @from(Start 7980261, End 7980388)
function mf(A, Q) {
  let B = HaB(A);
  try {
    let G = Q(B);
    return JSON.parse(G)
  } catch (G) {
    throw b0(Gl)
  }
}
// @from(Start 7980390, End 7980547)
function Wa1(A) {
  if (!A.signin_state) return !1;
  let Q = ["kmsi", "dvc_dmjd"];
  return A.signin_state.some((G) => Q.includes(G.trim().toLowerCase()))
}
// @from(Start 7980549, End 7980704)
function HaB(A) {
  if (!A) throw b0(Se);
  let B = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(A);
  if (!B || B.length < 4) throw b0(Gl);
  return B[2]
}
// @from(Start 7980706, End 7980787)
function gqA(A, Q) {
  if (Q === 0 || Date.now() - 300000 > A + Q) throw b0(be)
}
// @from(Start 7980792, End 7980872)
jZA = L(() => {
  dX();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 7980878, End 7980885)
OD = {}
// @from(Start 7981046, End 7981261)
function CaB(A) {
  if (!A) return A;
  let Q = A.toLowerCase();
  if (KZ.endsWith(Q, "?")) Q = Q.slice(0, -1);
  else if (KZ.endsWith(Q, "?/")) Q = Q.slice(0, -2);
  if (!KZ.endsWith(Q, "/")) Q += "/";
  return Q
}
// @from(Start 7981263, End 7981416)
function EaB(A) {
  if (A.startsWith("#/")) return A.substring(2);
  else if (A.startsWith("#") || A.startsWith("?")) return A.substring(1);
  return A
}
// @from(Start 7981418, End 7981698)
function Xa1(A) {
  if (!A || A.indexOf("=") < 0) return null;
  try {
    let Q = EaB(A),
      B = Object.fromEntries(new URLSearchParams(Q));
    if (B.code || B.ear_jwe || B.error || B.error_description || B.state) return B
  } catch (Q) {
    throw b0(ye)
  }
  return null
}
// @from(Start 7981700, End 7981889)
function Kk(A, Q = !0, B) {
  let G = [];
  return A.forEach((Z, I) => {
    if (!Q && B && I in B) G.push(`${I}=${Z}`);
    else G.push(`${I}=${encodeURIComponent(Z)}`)
  }), G.join("&")
}
// @from(Start 7981891, End 7982089)
function Tn6(A) {
  if (!A) return A;
  let Q = A.split("#")[0];
  try {
    let B = new URL(Q),
      G = B.origin + B.pathname + B.search;
    return CaB(G)
  } catch (B) {
    return CaB(Q)
  }
}
// @from(Start 7982094, End 7982182)
QAA = L(() => {
  dX();
  Fl();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 7982184, End 7984432)
class w8 {
  get urlString() {
    return this._urlString
  }
  constructor(A) {
    if (this._urlString = A, !this._urlString) throw hG(ae);
    if (!A.includes("#")) this._urlString = w8.canonicalizeUri(A)
  }
  static canonicalizeUri(A) {
    if (A) {
      let Q = A.toLowerCase();
      if (KZ.endsWith(Q, "?")) Q = Q.slice(0, -1);
      else if (KZ.endsWith(Q, "?/")) Q = Q.slice(0, -2);
      if (!KZ.endsWith(Q, "/")) Q += "/";
      return Q
    }
    return A
  }
  validateAsUri() {
    let A;
    try {
      A = this.getUrlComponents()
    } catch (Q) {
      throw hG(Vk)
    }
    if (!A.HostNameAndPort || !A.PathSegments) throw hG(Vk);
    if (!A.Protocol || A.Protocol.toLowerCase() !== "https:") throw hG(ne)
  }
  static appendQueryString(A, Q) {
    if (!Q) return A;
    return A.indexOf("?") < 0 ? `${A}?${Q}` : `${A}&${Q}`
  }
  static removeHashFromUrl(A) {
    return w8.canonicalizeUri(A.split("#")[0])
  }
  replaceTenantPath(A) {
    let Q = this.getUrlComponents(),
      B = Q.PathSegments;
    if (A && B.length !== 0 && (B[0] === MU.COMMON || B[0] === MU.ORGANIZATIONS)) B[0] = A;
    return w8.constructAuthorityUriFromObject(Q)
  }
  getUrlComponents() {
    let A = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"),
      Q = this.urlString.match(A);
    if (!Q) throw hG(Vk);
    let B = {
        Protocol: Q[1],
        HostNameAndPort: Q[4],
        AbsolutePath: Q[5],
        QueryString: Q[7]
      },
      G = B.AbsolutePath.split("/");
    if (G = G.filter((Z) => Z && Z.length > 0), B.PathSegments = G, B.QueryString && B.QueryString.endsWith("/")) B.QueryString = B.QueryString.substring(0, B.QueryString.length - 1);
    return B
  }
  static getDomainFromUrl(A) {
    let Q = RegExp("^([^:/?#]+://)?([^/?#]*)"),
      B = A.match(Q);
    if (!B) throw hG(Vk);
    return B[2]
  }
  static getAbsoluteUrl(A, Q) {
    if (A[0] === L0.FORWARD_SLASH) {
      let G = new w8(Q).getUrlComponents();
      return G.Protocol + "//" + G.HostNameAndPort + A
    }
    return A
  }
  static constructAuthorityUriFromObject(A) {
    return new w8(A.Protocol + "//" + A.HostNameAndPort + "/" + A.PathSegments.join("/"))
  }
  static hashContainsKnownProperties(A) {
    return !!Xa1(A)
  }
}
// @from(Start 7984437, End 7984541)
Kl = L(() => {
  Vl();
  Fl();
  mZ();
  QAA();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 7984544, End 7984826)
function $aB(A, Q) {
  let B, G = A.canonicalAuthority;
  if (G) {
    let Z = new w8(G).getUrlComponents().HostNameAndPort;
    B = zaB(Z, A.cloudDiscoveryMetadata?.metadata, CE.CONFIG, Q) || zaB(Z, Fa1.metadata, CE.HARDCODED_VALUES, Q) || A.knownAuthorities
  }
  return B || []
}
// @from(Start 7984828, End 7985189)
function zaB(A, Q, B, G) {
  if (G?.trace(`getAliasesFromMetadata called with source: ${B}`), A && Q) {
    let Z = uqA(Q, A);
    if (Z) return G?.trace(`getAliasesFromMetadata: found cloud discovery metadata in ${B}, returning aliases`), Z.aliases;
    else G?.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in ${B}`)
  }
  return null
}
// @from(Start 7985191, End 7985240)
function waB(A) {
  return uqA(Fa1.metadata, A)
}
// @from(Start 7985242, End 7985379)
function uqA(A, Q) {
  for (let B = 0; B < A.length; B++) {
    let G = A[B];
    if (G.aliases.includes(Q)) return G
  }
  return null
}
// @from(Start 7985384, End 7985387)
UaB
// @from(Start 7985389, End 7985392)
Va1
// @from(Start 7985394, End 7985397)
Fa1
// @from(Start 7985399, End 7985402)
Ka1
// @from(Start 7985408, End 7988186)
Da1 = L(() => {
  Kl();
  mZ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  UaB = {
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
  }, Va1 = UaB.endpointMetadata, Fa1 = UaB.instanceDiscoveryMetadata, Ka1 = new Set;
  Fa1.metadata.forEach((A) => {
    A.aliases.forEach((Q) => {
      Ka1.add(Q)
    })
  })
})
// @from(Start 7988192, End 7988220)
Ha1 = "cache_quota_exceeded"
// @from(Start 7988224, End 7988251)
jA1 = "cache_error_unknown"
// @from(Start 7988257, End 7988323)
qaB = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7988326, End 7988583)
function NaB(A) {
  if (!(A instanceof Error)) return new mqA(jA1);
  if (A.name === "QuotaExceededError" || A.name === "NS_ERROR_DOM_QUOTA_REACHED" || A.message.includes("exceeded the quota")) return new mqA(Ha1);
  else return new mqA(A.name, A.message)
}
// @from(Start 7988588, End 7988591)
Ca1
// @from(Start 7988593, End 7988596)
mqA
// @from(Start 7988602, End 7989069)
LaB = L(() => {
  PM();
  qaB(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  Ca1 = {
    [Ha1]: "Exceeded cache storage capacity.",
    [jA1]: "Unexpected error occurred when using cache storage."
  };
  mqA = class mqA extends t4 {
    constructor(A, Q) {
      let B = Q || (Ca1[A] ? Ca1[A] : Ca1[jA1]);
      super(`${A}: ${B}`);
      Object.setPrototypeOf(this, mqA.prototype), this.name = "CacheError", this.errorCode = A, this.errorMessage = B
    }
  }
})
// @from(Start 7989071, End 8006056)
class BAA {
  constructor(A, Q, B, G, Z) {
    this.clientId = A, this.cryptoImpl = Q, this.commonLogger = B.clone(qA1, MZA), this.staticAuthorityOptions = Z, this.performanceClient = G
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
    if (B.length > 0) return cX.getAccountInfo(B[0]);
    else return null
  }
  buildTenantProfiles(A, Q, B) {
    return A.flatMap((G) => {
      return this.getTenantProfilesFromAccountEntity(G, Q, B?.tenantId, B)
    })
  }
  getTenantedAccountInfoByFilter(A, Q, B, G, Z) {
    let I = null,
      Y;
    if (Z) {
      if (!this.tenantProfileMatchesFilter(B, Z)) return null
    }
    let J = this.getIdToken(A, G, Q, B.tenantId);
    if (J) {
      if (Y = mf(J.secret, this.cryptoImpl.base64Decode), !this.idTokenClaimsMatchTenantProfileFilter(Y, Z)) return null
    }
    return I = MA1(A, B, Y, J?.secret), I
  }
  getTenantProfilesFromAccountEntity(A, Q, B, G) {
    let Z = cX.getAccountInfo(A),
      I = Z.tenantProfiles || new Map,
      Y = this.getTokenKeys();
    if (B) {
      let W = I.get(B);
      if (W) I = new Map([
        [B, W]
      ]);
      else return []
    }
    let J = [];
    return I.forEach((W) => {
      let X = this.getTenantedAccountInfoByFilter(Z, Y, W, Q, G);
      if (X) J.push(X)
    }), J
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
    if (!A) throw b0(me);
    try {
      if (A.account) await this.setAccount(A.account, Q, B);
      if (!!A.idToken && G?.idToken !== !1) await this.setIdTokenCredential(A.idToken, Q, B);
      if (!!A.accessToken && G?.accessToken !== !1) await this.saveAccessToken(A.accessToken, Q, B);
      if (!!A.refreshToken && G?.refreshToken !== !1) await this.setRefreshTokenCredential(A.refreshToken, Q, B);
      if (A.appMetadata) this.setAppMetadata(A.appMetadata, Q)
    } catch (Z) {
      if (this.commonLogger?.error("CacheManager.saveCacheRecord: failed"), Z instanceof t4) throw Z;
      else throw NaB(Z)
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
      I = SJ.fromString(A.target);
    Z.accessToken.forEach((Y) => {
      if (!this.accessTokenKeyMatchesFilter(Y, G, !1)) return;
      let J = this.getAccessTokenCredential(Y, Q);
      if (J && this.credentialMatchesFilter(J, G)) {
        if (SJ.fromString(J.target).intersectingScopeSets(I)) this.removeAccessToken(Y, Q)
      }
    }), await this.setAccessTokenCredential(A, Q, B)
  }
  getAccountsFilteredBy(A, Q) {
    let B = this.getAccountKeys(),
      G = [];
    return B.forEach((Z) => {
      let I = this.getAccount(Z, Q);
      if (!I) return;
      if (!!A.homeAccountId && !this.matchHomeAccountId(I, A.homeAccountId)) return;
      if (!!A.username && !this.matchUsername(I.username, A.username)) return;
      if (!!A.environment && !this.matchEnvironment(I, A.environment)) return;
      if (!!A.realm && !this.matchRealm(I, A.realm)) return;
      if (!!A.nativeAccountId && !this.matchNativeAccountId(I, A.nativeAccountId)) return;
      if (!!A.authorityType && !this.matchAuthorityType(I, A.authorityType)) return;
      let Y = {
          localAccountId: A?.localAccountId,
          name: A?.name
        },
        J = I.tenantProfiles?.filter((W) => {
          return this.tenantProfileMatchesFilter(W, Y)
        });
      if (J && J.length === 0) return;
      G.push(I)
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
    if (A.credentialType === c7.ACCESS_TOKEN_WITH_AUTH_SCHEME) {
      if (!!Q.tokenType && !this.matchTokenType(A, Q.tokenType)) return !1;
      if (Q.tokenType === A5.SSH) {
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
      }, Q), !B || B.credentialType.toLowerCase() !== c7.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase() || B.tokenType !== A5.POP) return;
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
    let I = {
        homeAccountId: A.homeAccountId,
        environment: A.environment,
        credentialType: c7.ID_TOKEN,
        clientId: this.clientId,
        realm: G
      },
      Y = this.getIdTokensByFilter(I, Q, B),
      J = Y.size;
    if (J < 1) return this.commonLogger.info("CacheManager:getIdToken - No token found"), null;
    else if (J > 1) {
      let W = Y;
      if (!G) {
        let X = new Map;
        Y.forEach((F, K) => {
          if (F.realm === A.tenantId) X.set(K, F)
        });
        let V = X.size;
        if (V < 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result"), Y.values().next().value;
        else if (V === 1) return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile"), X.values().next().value;
        else W = X
      }
      if (this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them"), W.forEach((X, V) => {
          this.removeIdToken(V, Q)
        }), Z && Q) Z.addFields({
        multiMatchedID: Y.size
      }, Q);
      return null
    }
    return this.commonLogger.info("CacheManager:getIdToken - Returning ID token"), Y.values().next().value
  }
  getIdTokensByFilter(A, Q, B) {
    let G = B && B.idToken || this.getTokenKeys().idToken,
      Z = new Map;
    return G.forEach((I) => {
      if (!this.idTokenKeyMatchesFilter(I, {
          clientId: this.clientId,
          ...A
        })) return;
      let Y = this.getIdTokenCredential(I, Q);
      if (Y && this.credentialMatchesFilter(Y, A)) Z.set(I, Y)
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
    let I = SJ.createSearchScopes(Q.scopes),
      Y = Q.authenticationScheme || A5.BEARER,
      J = Y && Y.toLowerCase() !== A5.BEARER.toLowerCase() ? c7.ACCESS_TOKEN_WITH_AUTH_SCHEME : c7.ACCESS_TOKEN,
      W = {
        homeAccountId: A.homeAccountId,
        environment: A.environment,
        credentialType: J,
        clientId: this.clientId,
        realm: G || A.tenantId,
        target: I,
        tokenType: Y,
        keyId: Q.sshKid,
        requestedClaimsHash: Q.requestedClaimsHash
      },
      X = B && B.accessToken || this.getTokenKeys().accessToken,
      V = [];
    X.forEach((K) => {
      if (this.accessTokenKeyMatchesFilter(K, W, !0)) {
        let D = this.getAccessTokenCredential(K, Z);
        if (D && this.credentialMatchesFilter(D, W)) V.push(D)
      }
    });
    let F = V.length;
    if (F < 1) return this.commonLogger.info("CacheManager:getAccessToken - No token found", Z), null;
    else if (F > 1) return this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them", Z), V.forEach((K) => {
      this.removeAccessToken(this.generateCredentialKey(K), Z)
    }), this.performanceClient.addFields({
      multiMatchedAT: V.length
    }, Z), null;
    return this.commonLogger.info("CacheManager:getAccessToken - Returning access token", Z), V[0]
  }
  accessTokenKeyMatchesFilter(A, Q, B) {
    let G = A.toLowerCase();
    if (Q.clientId && G.indexOf(Q.clientId.toLowerCase()) === -1) return !1;
    if (Q.homeAccountId && G.indexOf(Q.homeAccountId.toLowerCase()) === -1) return !1;
    if (Q.realm && G.indexOf(Q.realm.toLowerCase()) === -1) return !1;
    if (Q.requestedClaimsHash && G.indexOf(Q.requestedClaimsHash.toLowerCase()) === -1) return !1;
    if (Q.target) {
      let Z = Q.target.asArray();
      for (let I = 0; I < Z.length; I++)
        if (B && !G.includes(Z[I].toLowerCase())) return !1;
        else if (!B && G.includes(Z[I].toLowerCase())) return !0
    }
    return !0
  }
  getAccessTokensByFilter(A, Q) {
    let B = this.getTokenKeys(),
      G = [];
    return B.accessToken.forEach((Z) => {
      if (!this.accessTokenKeyMatchesFilter(Z, A, !0)) return;
      let I = this.getAccessTokenCredential(Z, Q);
      if (I && this.credentialMatchesFilter(I, A)) G.push(I)
    }), G
  }
  getRefreshToken(A, Q, B, G, Z) {
    this.commonLogger.trace("CacheManager - getRefreshToken called");
    let I = Q ? Ql : void 0,
      Y = {
        homeAccountId: A.homeAccountId,
        environment: A.environment,
        credentialType: c7.REFRESH_TOKEN,
        clientId: this.clientId,
        familyId: I
      },
      J = G && G.refreshToken || this.getTokenKeys().refreshToken,
      W = [];
    J.forEach((V) => {
      if (this.refreshTokenKeyMatchesFilter(V, Y)) {
        let F = this.getRefreshTokenCredential(V, B);
        if (F && this.credentialMatchesFilter(F, Y)) W.push(F)
      }
    });
    let X = W.length;
    if (X < 1) return this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found."), null;
    if (X > 1 && Z && B) Z.addFields({
      multiMatchedRT: X
    }, B);
    return this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token"), W[0]
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
      G = Object.keys(B).map((I) => B[I]),
      Z = G.length;
    if (Z < 1) return null;
    else if (Z > 1) throw b0(fe);
    return G[0]
  }
  isAppMetadataFOCI(A) {
    let Q = this.readAppMetadataFromCache(A);
    return !!(Q && Q.familyId === Ql)
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
      let G = $aB(this.staticAuthorityOptions, this.commonLogger);
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
    if (A.credentialType !== c7.ACCESS_TOKEN && A.credentialType !== c7.ACCESS_TOKEN_WITH_AUTH_SCHEME || !A.target) return !1;
    return SJ.fromString(A.target).containsScopeSet(Q)
  }
  matchTokenType(A, Q) {
    return !!(A.tokenType && A.tokenType === Q)
  }
  matchKeyId(A, Q) {
    return !!(A.keyId && A.keyId === Q)
  }
  isAppMetadata(A) {
    return A.indexOf(YqA) !== -1
  }
  isAuthorityMetadata(A) {
    return A.indexOf(wZA.CACHE_KEY) !== -1
  }
  generateAuthorityMetadataCacheKey(A) {
    return `${wZA.CACHE_KEY}-${this.clientId}-${A}`
  }
  static toObject(A, Q) {
    for (let B in Q) A[B] = Q[B];
    return A
  }
}
// @from(Start 8006061, End 8006064)
SA1
// @from(Start 8006070, End 8007475)
Ea1 = L(() => {
  mZ();
  bqA();
  TA1();
  dX();
  OA1();
  jZA();
  NA1();
  Da1();
  LaB();
  PM();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  SA1 = class SA1 extends BAA {
    async setAccount() {
      throw b0(l8)
    }
    getAccount() {
      throw b0(l8)
    }
    async setIdTokenCredential() {
      throw b0(l8)
    }
    getIdTokenCredential() {
      throw b0(l8)
    }
    async setAccessTokenCredential() {
      throw b0(l8)
    }
    getAccessTokenCredential() {
      throw b0(l8)
    }
    async setRefreshTokenCredential() {
      throw b0(l8)
    }
    getRefreshTokenCredential() {
      throw b0(l8)
    }
    setAppMetadata() {
      throw b0(l8)
    }
    getAppMetadata() {
      throw b0(l8)
    }
    setServerTelemetry() {
      throw b0(l8)
    }
    getServerTelemetry() {
      throw b0(l8)
    }
    setAuthorityMetadata() {
      throw b0(l8)
    }
    getAuthorityMetadata() {
      throw b0(l8)
    }
    getAuthorityMetadataKeys() {
      throw b0(l8)
    }
    setThrottlingCache() {
      throw b0(l8)
    }
    getThrottlingCache() {
      throw b0(l8)
    }
    removeItem() {
      throw b0(l8)
    }
    getKeys() {
      throw b0(l8)
    }
    getAccountKeys() {
      throw b0(l8)
    }
    getTokenKeys() {
      throw b0(l8)
    }
    generateCredentialKey() {
      throw b0(l8)
    }
    generateAccountKey() {
      throw b0(l8)
    }
  }
})
// @from(Start 8007481, End 8007483)
Z0
// @from(Start 8007485, End 8007488)
jYG
// @from(Start 8007490, End 8007493)
MaB
// @from(Start 8007499, End 8019676)
uT = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  Z0 = {
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
  }, jYG = new Map([
    [Z0.AcquireTokenByCode, "ATByCode"],
    [Z0.AcquireTokenByRefreshToken, "ATByRT"],
    [Z0.AcquireTokenSilent, "ATS"],
    [Z0.AcquireTokenSilentAsync, "ATSAsync"],
    [Z0.AcquireTokenPopup, "ATPopup"],
    [Z0.AcquireTokenRedirect, "ATRedirect"],
    [Z0.CryptoOptsGetPublicKeyThumbprint, "CryptoGetPKThumb"],
    [Z0.CryptoOptsSignJwt, "CryptoSignJwt"],
    [Z0.SilentCacheClientAcquireToken, "SltCacheClientAT"],
    [Z0.SilentIframeClientAcquireToken, "SltIframeClientAT"],
    [Z0.SilentRefreshClientAcquireToken, "SltRClientAT"],
    [Z0.SsoSilent, "SsoSlt"],
    [Z0.StandardInteractionClientGetDiscoveredAuthority, "StdIntClientGetDiscAuth"],
    [Z0.FetchAccountIdWithNativeBroker, "FetchAccIdWithNtvBroker"],
    [Z0.NativeInteractionClientAcquireToken, "NtvIntClientAT"],
    [Z0.BaseClientCreateTokenRequestHeaders, "BaseClientCreateTReqHead"],
    [Z0.NetworkClientSendPostRequestAsync, "NetClientSendPost"],
    [Z0.RefreshTokenClientExecutePostToTokenEndpoint, "RTClientExecPost"],
    [Z0.AuthorizationCodeClientExecutePostToTokenEndpoint, "AuthCodeClientExecPost"],
    [Z0.BrokerHandhshake, "BrokerHandshake"],
    [Z0.AcquireTokenByRefreshTokenInBroker, "ATByRTInBroker"],
    [Z0.AcquireTokenByBroker, "ATByBroker"],
    [Z0.RefreshTokenClientExecuteTokenRequest, "RTClientExecTReq"],
    [Z0.RefreshTokenClientAcquireToken, "RTClientAT"],
    [Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, "RTClientATWithCachedRT"],
    [Z0.RefreshTokenClientAcquireTokenByRefreshToken, "RTClientATByRT"],
    [Z0.RefreshTokenClientCreateTokenRequestBody, "RTClientCreateTReqBody"],
    [Z0.AcquireTokenFromCache, "ATFromCache"],
    [Z0.SilentFlowClientAcquireCachedToken, "SltFlowClientATCached"],
    [Z0.SilentFlowClientGenerateResultFromCacheRecord, "SltFlowClientGenResFromCache"],
    [Z0.AcquireTokenBySilentIframe, "ATBySltIframe"],
    [Z0.InitializeBaseRequest, "InitBaseReq"],
    [Z0.InitializeSilentRequest, "InitSltReq"],
    [Z0.InitializeClientApplication, "InitClientApplication"],
    [Z0.InitializeCache, "InitCache"],
    [Z0.ImportExistingCache, "importCache"],
    [Z0.SetUserData, "setUserData"],
    [Z0.LocalStorageUpdated, "localStorageUpdated"],
    [Z0.SilentIframeClientTokenHelper, "SIClientTHelper"],
    [Z0.SilentHandlerInitiateAuthRequest, "SHandlerInitAuthReq"],
    [Z0.SilentHandlerMonitorIframeForHash, "SltHandlerMonitorIframeForHash"],
    [Z0.SilentHandlerLoadFrame, "SHandlerLoadFrame"],
    [Z0.SilentHandlerLoadFrameSync, "SHandlerLoadFrameSync"],
    [Z0.StandardInteractionClientCreateAuthCodeClient, "StdIntClientCreateAuthCodeClient"],
    [Z0.StandardInteractionClientGetClientConfiguration, "StdIntClientGetClientConf"],
    [Z0.StandardInteractionClientInitializeAuthorizationRequest, "StdIntClientInitAuthReq"],
    [Z0.GetAuthCodeUrl, "GetAuthCodeUrl"],
    [Z0.HandleCodeResponseFromServer, "HandleCodeResFromServer"],
    [Z0.HandleCodeResponse, "HandleCodeResp"],
    [Z0.HandleResponseEar, "HandleRespEar"],
    [Z0.HandleResponseCode, "HandleRespCode"],
    [Z0.HandleResponsePlatformBroker, "HandleRespPlatBroker"],
    [Z0.UpdateTokenEndpointAuthority, "UpdTEndpointAuth"],
    [Z0.AuthClientAcquireToken, "AuthClientAT"],
    [Z0.AuthClientExecuteTokenRequest, "AuthClientExecTReq"],
    [Z0.AuthClientCreateTokenRequestBody, "AuthClientCreateTReqBody"],
    [Z0.PopTokenGenerateCnf, "PopTGenCnf"],
    [Z0.PopTokenGenerateKid, "PopTGenKid"],
    [Z0.HandleServerTokenResponse, "HandleServerTRes"],
    [Z0.DeserializeResponse, "DeserializeRes"],
    [Z0.AuthorityFactoryCreateDiscoveredInstance, "AuthFactCreateDiscInst"],
    [Z0.AuthorityResolveEndpointsAsync, "AuthResolveEndpointsAsync"],
    [Z0.AuthorityResolveEndpointsFromLocalSources, "AuthResolveEndpointsFromLocal"],
    [Z0.AuthorityGetCloudDiscoveryMetadataFromNetwork, "AuthGetCDMetaFromNet"],
    [Z0.AuthorityUpdateCloudDiscoveryMetadata, "AuthUpdCDMeta"],
    [Z0.AuthorityGetEndpointMetadataFromNetwork, "AuthUpdCDMetaFromNet"],
    [Z0.AuthorityUpdateEndpointMetadata, "AuthUpdEndpointMeta"],
    [Z0.AuthorityUpdateMetadataWithRegionalInformation, "AuthUpdMetaWithRegInfo"],
    [Z0.RegionDiscoveryDetectRegion, "RegDiscDetectReg"],
    [Z0.RegionDiscoveryGetRegionFromIMDS, "RegDiscGetRegFromIMDS"],
    [Z0.RegionDiscoveryGetCurrentVersion, "RegDiscGetCurrentVer"],
    [Z0.AcquireTokenByCodeAsync, "ATByCodeAsync"],
    [Z0.GetEndpointMetadataFromNetwork, "GetEndpointMetaFromNet"],
    [Z0.GetCloudDiscoveryMetadataFromNetworkMeasurement, "GetCDMetaFromNet"],
    [Z0.HandleRedirectPromiseMeasurement, "HandleRedirectPromise"],
    [Z0.HandleNativeRedirectPromiseMeasurement, "HandleNtvRedirectPromise"],
    [Z0.UpdateCloudDiscoveryMetadataMeasurement, "UpdateCDMeta"],
    [Z0.UsernamePasswordClientAcquireToken, "UserPassClientAT"],
    [Z0.NativeMessageHandlerHandshake, "NtvMsgHandlerHandshake"],
    [Z0.NativeGenerateAuthResult, "NtvGenAuthRes"],
    [Z0.RemoveHiddenIframe, "RemoveHiddenIframe"],
    [Z0.ClearTokensAndKeysWithClaims, "ClearTAndKeysWithClaims"],
    [Z0.CacheManagerGetRefreshToken, "CacheManagerGetRT"],
    [Z0.GeneratePkceCodes, "GenPkceCodes"],
    [Z0.GenerateCodeVerifier, "GenCodeVerifier"],
    [Z0.GenerateCodeChallengeFromVerifier, "GenCodeChallengeFromVerifier"],
    [Z0.Sha256Digest, "Sha256Digest"],
    [Z0.GetRandomValues, "GetRandomValues"],
    [Z0.GenerateHKDF, "genHKDF"],
    [Z0.GenerateBaseKey, "genBaseKey"],
    [Z0.Base64Decode, "b64Decode"],
    [Z0.UrlEncodeArr, "urlEncArr"],
    [Z0.Encrypt, "encrypt"],
    [Z0.Decrypt, "decrypt"],
    [Z0.GenerateEarKey, "genEarKey"],
    [Z0.DecryptEarResponse, "decryptEarResp"]
  ]), MaB = {
    NotStarted: 0,
    InProgress: 1,
    Completed: 2
  }
})
// @from(Start 8019678, End 8019808)
class za1 {
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
// @from(Start 8019809, End 8020816)
class SZA {
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
        status: MaB.InProgress,
        authority: "",
        libraryName: "",
        libraryVersion: "",
        clientId: "",
        name: A,
        startTimeMs: Date.now(),
        correlationId: Q || ""
      },
      measurement: new za1
    }
  }
  startPerformanceMeasurement() {
    return new za1
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
// @from(Start 8020821, End 8020893)
Ua1 = L(() => {
  uT(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8020896, End 8021776)
function OaB({
  authOptions: A,
  systemOptions: Q,
  loggerOptions: B,
  cacheOptions: G,
  storageInterface: Z,
  networkInterface: I,
  cryptoInterface: Y,
  clientCredentials: J,
  libraryInfo: W,
  telemetry: X,
  serverTelemetryManager: V,
  persistencePlugin: F,
  serializableCache: K
}) {
  let D = {
    ...jn6,
    ...B
  };
  return {
    authOptions: bn6(A),
    systemOptions: {
      ...Pn6,
      ...Q
    },
    loggerOptions: D,
    cacheOptions: {
      ...Sn6,
      ...G
    },
    storageInterface: Z || new SA1(A.clientId, LZA, new RU(D), new SZA),
    networkInterface: I || _n6,
    cryptoInterface: Y || LZA,
    clientCredentials: J || yn6,
    libraryInfo: {
      ...kn6,
      ...W
    },
    telemetry: {
      ...vn6,
      ...X
    },
    serverTelemetryManager: V || null,
    persistencePlugin: F || null,
    serializableCache: K || null
  }
}
// @from(Start 8021778, End 8021968)
function bn6(A) {
  return {
    clientCapabilities: [],
    azureCloudOptions: xn6,
    skipAuthorityMetadataCache: !1,
    instanceAware: !1,
    encodeExtraQueryParams: !1,
    ...A
  }
}
// @from(Start 8021970, End 8022055)
function _A1(A) {
  return A.authOptions.authority.options.protocolMode === aH.OIDC
}
// @from(Start 8022060, End 8022063)
Pn6
// @from(Start 8022065, End 8022068)
jn6
// @from(Start 8022070, End 8022073)
Sn6
// @from(Start 8022075, End 8022078)
_n6
// @from(Start 8022080, End 8022083)
kn6
// @from(Start 8022085, End 8022088)
yn6
// @from(Start 8022090, End 8022093)
xn6
// @from(Start 8022095, End 8022098)
vn6
// @from(Start 8022104, End 8022982)
kA1 = L(() => {
  Za1();
  wA1();
  mZ();
  NA1();
  LA1();
  Ea1();
  hqA();
  dX();
  Ua1();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  Pn6 = {
    tokenRenewalOffsetSeconds: qZA,
    preventCorsPreflight: !1
  }, jn6 = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: lY.Info,
    correlationId: L0.EMPTY_STRING
  }, Sn6 = {
    claimsBasedCachingEnabled: !1
  }, _n6 = {
    async sendGetRequestAsync() {
      throw b0(l8)
    },
    async sendPostRequestAsync() {
      throw b0(l8)
    }
  }, kn6 = {
    sku: L0.SKU,
    version: MZA,
    cpu: L0.EMPTY_STRING,
    os: L0.EMPTY_STRING
  }, yn6 = {
    clientSecret: L0.EMPTY_STRING,
    clientAssertion: void 0
  }, xn6 = {
    azureCloudInstance: hf.None,
    tenant: `${L0.DEFAULT_COMMON_TENANT}`
  }, vn6 = {
    application: {
      appName: "",
      appVersion: ""
    }
  }
})
// @from(Start 8022988, End 8022990)
zE
// @from(Start 8022996, End 8023130)
dqA = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  zE = {
    HOME_ACCOUNT_ID: "home_account_id",
    UPN: "UPN"
  }
})
// @from(Start 8023136, End 8023144)
GAA = {}
// @from(Start 8024736, End 8024752)
Dk = "client_id"
// @from(Start 8024756, End 8024776)
yA1 = "redirect_uri"
// @from(Start 8024780, End 8024801)
$a1 = "response_type"
// @from(Start 8024805, End 8024826)
wa1 = "response_mode"
// @from(Start 8024830, End 8024848)
qa1 = "grant_type"
// @from(Start 8024852, End 8024866)
Na1 = "claims"
// @from(Start 8024870, End 8024883)
La1 = "scope"
// @from(Start 8024887, End 8024900)
fn6 = "error"
// @from(Start 8024904, End 8024929)
hn6 = "error_description"
// @from(Start 8024933, End 8024953)
gn6 = "access_token"
// @from(Start 8024957, End 8024973)
un6 = "id_token"
// @from(Start 8024977, End 8024998)
Ma1 = "refresh_token"
// @from(Start 8025002, End 8025020)
mn6 = "expires_in"
// @from(Start 8025024, End 8025056)
dn6 = "refresh_token_expires_in"
// @from(Start 8025060, End 8025073)
Oa1 = "state"
// @from(Start 8025077, End 8025090)
Ra1 = "nonce"
// @from(Start 8025094, End 8025108)
Ta1 = "prompt"
// @from(Start 8025112, End 8025133)
cn6 = "session_state"
// @from(Start 8025137, End 8025156)
pn6 = "client_info"
// @from(Start 8025160, End 8025172)
Pa1 = "code"
// @from(Start 8025176, End 8025198)
ja1 = "code_challenge"
// @from(Start 8025202, End 8025231)
Sa1 = "code_challenge_method"
// @from(Start 8025235, End 8025256)
_a1 = "code_verifier"
// @from(Start 8025260, End 8025285)
ka1 = "client-request-id"
// @from(Start 8025289, End 8025309)
ya1 = "x-client-SKU"
// @from(Start 8025313, End 8025333)
xa1 = "x-client-VER"
// @from(Start 8025337, End 8025356)
va1 = "x-client-OS"
// @from(Start 8025360, End 8025380)
ba1 = "x-client-CPU"
// @from(Start 8025384, End 8025418)
fa1 = "x-client-current-telemetry"
// @from(Start 8025422, End 8025453)
ha1 = "x-client-last-telemetry"
// @from(Start 8025457, End 8025484)
ga1 = "x-ms-lib-capability"
// @from(Start 8025488, End 8025506)
ua1 = "x-app-name"
// @from(Start 8025510, End 8025527)
ma1 = "x-app-ver"
// @from(Start 8025531, End 8025563)
da1 = "post_logout_redirect_uri"
// @from(Start 8025567, End 8025588)
ca1 = "id_token_hint"
// @from(Start 8025592, End 8025611)
pa1 = "device_code"
// @from(Start 8025615, End 8025636)
la1 = "client_secret"
// @from(Start 8025640, End 8025664)
ia1 = "client_assertion"
// @from(Start 8025668, End 8025697)
na1 = "client_assertion_type"
// @from(Start 8025701, End 8025719)
xA1 = "token_type"
// @from(Start 8025723, End 8025738)
vA1 = "req_cnf"
// @from(Start 8025742, End 8025759)
aa1 = "assertion"
// @from(Start 8025763, End 8025790)
sa1 = "requested_token_use"
// @from(Start 8025794, End 8025814)
ln6 = "on_behalf_of"
// @from(Start 8025818, End 8025830)
in6 = "foci"
// @from(Start 8025834, End 8025857)
nn6 = "X-AnchorMailbox"
// @from(Start 8025861, End 8025884)
bA1 = "return_spa_code"
// @from(Start 8025888, End 8025908)
ra1 = "nativebroker"
// @from(Start 8025912, End 8025931)
oa1 = "logout_hint"
// @from(Start 8025935, End 8025946)
ta1 = "sid"
// @from(Start 8025950, End 8025968)
ea1 = "login_hint"
// @from(Start 8025972, End 8025991)
As1 = "domain_hint"
// @from(Start 8025995, End 8026020)
an6 = "x-client-xtra-sku"
// @from(Start 8026024, End 8026045)
cqA = "brk_client_id"
// @from(Start 8026049, End 8026073)
fA1 = "brk_redirect_uri"
// @from(Start 8026077, End 8026099)
_ZA = "instance_aware"
// @from(Start 8026103, End 8026118)
Qs1 = "ear_jwk"
// @from(Start 8026122, End 8026144)
Bs1 = "ear_jwe_crypto"
// @from(Start 8026150, End 8026216)
kZA = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8026222, End 8026229)
PB = {}
// @from(Start 8027613, End 8027784)
function ZAA(A, Q, B) {
  if (!Q) return;
  let G = A.get(Dk);
  if (G && A.has(cqA)) B?.addFields({
    embeddedClientId: G,
    embeddedRedirectUri: A.get(yA1)
  }, Q)
}
// @from(Start 8027786, End 8027824)
function sn6(A, Q) {
  A.set($a1, Q)
}
// @from(Start 8027826, End 8027879)
function Gs1(A, Q) {
  A.set(wa1, Q ? Q : Wk.QUERY)
}
// @from(Start 8027881, End 8027918)
function rn6(A) {
  A.set(ra1, "1")
}
// @from(Start 8027920, End 8028128)
function IAA(A, Q, B = !0, G = nH) {
  if (B && !G.includes("openid") && !Q.includes("openid")) G.push("openid");
  let Z = B ? [...Q || [], ...G] : Q || [],
    I = new SJ(Z);
  A.set(La1, I.printScopes())
}
// @from(Start 8028130, End 8028167)
function YAA(A, Q) {
  A.set(Dk, Q)
}
// @from(Start 8028169, End 8028207)
function JAA(A, Q) {
  A.set(yA1, Q)
}
// @from(Start 8028209, End 8028247)
function Zs1(A, Q) {
  A.set(da1, Q)
}
// @from(Start 8028249, End 8028287)
function Is1(A, Q) {
  A.set(ca1, Q)
}
// @from(Start 8028289, End 8028327)
function Ys1(A, Q) {
  A.set(As1, Q)
}
// @from(Start 8028329, End 8028367)
function yZA(A, Q) {
  A.set(ea1, Q)
}
// @from(Start 8028369, End 8028425)
function Dl(A, Q) {
  A.set(uZ.CCS_HEADER, `UPN:${Q}`)
}
// @from(Start 8028427, End 8028497)
function df(A, Q) {
  A.set(uZ.CCS_HEADER, `Oid:${Q.uid}@${Q.utid}`)
}
// @from(Start 8028499, End 8028537)
function hA1(A, Q) {
  A.set(ta1, Q)
}
// @from(Start 8028539, End 8028664)
function WAA(A, Q, B) {
  let G = RaB(Q, B);
  try {
    JSON.parse(G)
  } catch (Z) {
    throw hG(Wl)
  }
  A.set(Na1, G)
}
// @from(Start 8028666, End 8028704)
function XAA(A, Q) {
  A.set(ka1, Q)
}
// @from(Start 8028706, End 8028831)
function pqA(A, Q) {
  if (A.set(ya1, Q.sku), A.set(xa1, Q.version), Q.os) A.set(va1, Q.os);
  if (Q.cpu) A.set(ba1, Q.cpu)
}
// @from(Start 8028833, End 8028942)
function lqA(A, Q) {
  if (Q?.appName) A.set(ua1, Q.appName);
  if (Q?.appVersion) A.set(ma1, Q.appVersion)
}
// @from(Start 8028944, End 8028982)
function Js1(A, Q) {
  A.set(Ta1, Q)
}
// @from(Start 8028984, End 8029029)
function iqA(A, Q) {
  if (Q) A.set(Oa1, Q)
}
// @from(Start 8029031, End 8029069)
function Ws1(A, Q) {
  A.set(Ra1, Q)
}
// @from(Start 8029071, End 8029160)
function on6(A, Q, B) {
  if (Q && B) A.set(ja1, Q), A.set(Sa1, B);
  else throw hG(te)
}
// @from(Start 8029162, End 8029200)
function Xs1(A, Q) {
  A.set(Pa1, Q)
}
// @from(Start 8029202, End 8029240)
function tn6(A, Q) {
  A.set(pa1, Q)
}
// @from(Start 8029242, End 8029280)
function Vs1(A, Q) {
  A.set(Ma1, Q)
}
// @from(Start 8029282, End 8029320)
function Fs1(A, Q) {
  A.set(_a1, Q)
}
// @from(Start 8029322, End 8029360)
function nqA(A, Q) {
  A.set(la1, Q)
}
// @from(Start 8029362, End 8029407)
function aqA(A, Q) {
  if (Q) A.set(ia1, Q)
}
// @from(Start 8029409, End 8029454)
function sqA(A, Q) {
  if (Q) A.set(na1, Q)
}
// @from(Start 8029456, End 8029494)
function en6(A, Q) {
  A.set(aa1, Q)
}
// @from(Start 8029496, End 8029534)
function Aa6(A, Q) {
  A.set(sa1, Q)
}
// @from(Start 8029536, End 8029574)
function rqA(A, Q) {
  A.set(qa1, Q)
}
// @from(Start 8029576, End 8029613)
function VAA(A) {
  A.set(KaB, "1")
}
// @from(Start 8029615, End 8029672)
function oqA(A) {
  if (!A.has(_ZA)) A.set(_ZA, "true")
}
// @from(Start 8029674, End 8029778)
function cf(A, Q) {
  Object.entries(Q).forEach(([B, G]) => {
    if (!A.has(B) && G) A.set(B, G)
  })
}
// @from(Start 8029780, End 8030088)
function RaB(A, Q) {
  let B;
  if (!A) B = {};
  else try {
    B = JSON.parse(A)
  } catch (G) {
    throw hG(Wl)
  }
  if (Q && Q.length > 0) {
    if (!B.hasOwnProperty(Re.ACCESS_TOKEN)) B[Re.ACCESS_TOKEN] = {};
    B[Re.ACCESS_TOKEN][Re.XMS_CC] = {
      values: Q
    }
  }
  return JSON.stringify(B)
}
// @from(Start 8030090, End 8030137)
function Qa6(A, Q) {
  A.set(WqA.username, Q)
}
// @from(Start 8030139, End 8030186)
function Ba6(A, Q) {
  A.set(WqA.password, Q)
}
// @from(Start 8030188, End 8030253)
function tqA(A, Q) {
  if (Q) A.set(xA1, A5.POP), A.set(vA1, Q)
}
// @from(Start 8030255, End 8030320)
function eqA(A, Q) {
  if (Q) A.set(xA1, A5.SSH), A.set(vA1, Q)
}
// @from(Start 8030322, End 8030444)
function ANA(A, Q) {
  A.set(fa1, Q.generateCurrentRequestHeaderValue()), A.set(ha1, Q.generateLastRequestHeaderValue())
}
// @from(Start 8030446, End 8030508)
function QNA(A) {
  A.set(ga1, Xk.X_MS_LIB_CAPABILITY_VALUE)
}
// @from(Start 8030510, End 8030548)
function Ks1(A, Q) {
  A.set(oa1, Q)
}
// @from(Start 8030550, End 8030641)
function pf(A, Q, B) {
  if (!A.has(cqA)) A.set(cqA, Q);
  if (!A.has(fA1)) A.set(fA1, B)
}
// @from(Start 8030643, End 8030771)
function Ga6(A, Q) {
  A.set(Qs1, encodeURIComponent(Q));
  let B = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0";
  A.set(Bs1, B)
}
// @from(Start 8030773, End 8030865)
function Za6(A, Q) {
  Object.entries(Q).forEach(([B, G]) => {
    if (G) A.set(B, G)
  })
}
// @from(Start 8030870, End 8030976)
xZA = L(() => {
  mZ();
  kZA();
  bqA();
  Vl();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8030979, End 8031150)
function TaB(A) {
  return A.hasOwnProperty("authorization_endpoint") && A.hasOwnProperty("token_endpoint") && A.hasOwnProperty("issuer") && A.hasOwnProperty("jwks_uri")
}
// @from(Start 8031155, End 8031221)
PaB = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8031224, End 8031330)
function jaB(A) {
  return A.hasOwnProperty("tenant_discovery_endpoint") && A.hasOwnProperty("metadata")
}
// @from(Start 8031335, End 8031401)
SaB = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8031404, End 8031499)
function _aB(A) {
  return A.hasOwnProperty("error") && A.hasOwnProperty("error_description")
}
// @from(Start 8031504, End 8031570)
kaB = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8031576, End 8032238)
yaB = (A, Q, B, G, Z) => {
    return (...I) => {
      B.trace(`Executing function ${Q}`);
      let Y = G?.startMeasurement(Q, Z);
      if (Z) {
        let J = Q + "CallCount";
        G?.incrementFields({
          [J]: 1
        }, Z)
      }
      try {
        let J = A(...I);
        return Y?.end({
          success: !0
        }), B.trace(`Returning result from ${Q}`), J
      } catch (J) {
        B.trace(`Error occurred in ${Q}`);
        try {
          B.trace(JSON.stringify(J))
        } catch (W) {
          B.trace("Unable to print error message.")
        }
        throw Y?.end({
          success: !1
        }, J), J
      }
    }
  }
// @from(Start 8032242, End 8032932)
_5 = (A, Q, B, G, Z) => {
    return (...I) => {
      B.trace(`Executing function ${Q}`);
      let Y = G?.startMeasurement(Q, Z);
      if (Z) {
        let J = Q + "CallCount";
        G?.incrementFields({
          [J]: 1
        }, Z)
      }
      return G?.setPreQueueTime(Q, Z), A(...I).then((J) => {
        return B.trace(`Returning result from ${Q}`), Y?.end({
          success: !0
        }), J
      }).catch((J) => {
        B.trace(`Error occurred in ${Q}`);
        try {
          B.trace(JSON.stringify(J))
        } catch (W) {
          B.trace("Unable to print error message.")
        }
        throw Y?.end({
          success: !1
        }, J), J
      })
    }
  }
// @from(Start 8032938, End 8033003)
lf = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8033005, End 8035090)
class BNA {
  constructor(A, Q, B, G) {
    this.networkInterface = A, this.logger = Q, this.performanceClient = B, this.correlationId = G
  }
  async detectRegion(A, Q) {
    this.performanceClient?.addQueueMeasurement(Z0.RegionDiscoveryDetectRegion, this.correlationId);
    let B = A;
    if (!B) {
      let G = BNA.IMDS_OPTIONS;
      try {
        let Z = await _5(this.getRegionFromIMDS.bind(this), Z0.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(L0.IMDS_VERSION, G);
        if (Z.status === o4.SUCCESS) B = Z.body, Q.region_source = Pe.IMDS;
        if (Z.status === o4.BAD_REQUEST) {
          let I = await _5(this.getCurrentVersion.bind(this), Z0.RegionDiscoveryGetCurrentVersion, this.logger, this.performanceClient, this.correlationId)(G);
          if (!I) return Q.region_source = Pe.FAILED_AUTO_DETECTION, null;
          let Y = await _5(this.getRegionFromIMDS.bind(this), Z0.RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(I, G);
          if (Y.status === o4.SUCCESS) B = Y.body, Q.region_source = Pe.IMDS
        }
      } catch (Z) {
        return Q.region_source = Pe.FAILED_AUTO_DETECTION, null
      }
    } else Q.region_source = Pe.ENVIRONMENT_VARIABLE;
    if (!B) Q.region_source = Pe.FAILED_AUTO_DETECTION;
    return B || null
  }
  async getRegionFromIMDS(A, Q) {
    return this.performanceClient?.addQueueMeasurement(Z0.RegionDiscoveryGetRegionFromIMDS, this.correlationId), this.networkInterface.sendGetRequestAsync(`${L0.IMDS_ENDPOINT}?api-version=${A}&format=text`, Q, L0.IMDS_TIMEOUT)
  }
  async getCurrentVersion(A) {
    this.performanceClient?.addQueueMeasurement(Z0.RegionDiscoveryGetCurrentVersion, this.correlationId);
    try {
      let Q = await this.networkInterface.sendGetRequestAsync(`${L0.IMDS_ENDPOINT}?format=json`, A);
      if (Q.status === o4.BAD_REQUEST && Q.body && Q.body["newest-versions"] && Q.body["newest-versions"].length > 0) return Q.body["newest-versions"][0];
      return null
    } catch (Q) {
      return null
    }
  }
}
// @from(Start 8035095, End 8035254)
xaB = L(() => {
  mZ();
  uT();
  lf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  BNA.IMDS_OPTIONS = {
    headers: {
      Metadata: "true"
    }
  }
})
// @from(Start 8035260, End 8035267)
EI = {}
// @from(Start 8035481, End 8035547)
function Jq() {
  return Math.round(new Date().getTime() / 1000)
}
// @from(Start 8035549, End 8035596)
function Ia6(A) {
  return A.getTime() / 1000
}
// @from(Start 8035598, End 8035679)
function GNA(A) {
  if (A) return new Date(Number(A) * 1000);
  return new Date
}
// @from(Start 8035681, End 8035751)
function vZA(A, Q) {
  let B = Number(A) || 0;
  return Jq() + Q > B
}
// @from(Start 8035753, End 8035846)
function Ya6(A, Q) {
  let B = Number(A) + Q * 24 * 60 * 60 * 1000;
  return Date.now() > B
}
// @from(Start 8035848, End 8035893)
function Ds1(A) {
  return Number(A) > Jq()
}
// @from(Start 8035895, End 8035972)
function Ja6(A, Q) {
  return new Promise((B) => setTimeout(() => B(Q), A))
}
// @from(Start 8035977, End 8036042)
Hl = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8036048, End 8036055)
UE = {}
// @from(Start 8036674, End 8036882)
function Hs1(A, Q, B, G, Z) {
  return {
    credentialType: c7.ID_TOKEN,
    homeAccountId: A,
    environment: Q,
    clientId: G,
    secret: B,
    realm: Z,
    lastUpdatedAt: Date.now().toString()
  }
}
// @from(Start 8036884, End 8037708)
function Cs1(A, Q, B, G, Z, I, Y, J, W, X, V, F, K, D, H) {
  let C = {
    homeAccountId: A,
    credentialType: c7.ACCESS_TOKEN,
    secret: B,
    cachedAt: Jq().toString(),
    expiresOn: Y.toString(),
    extendedExpiresOn: J.toString(),
    environment: Q,
    clientId: G,
    realm: Z,
    target: I,
    tokenType: V || A5.BEARER,
    lastUpdatedAt: Date.now().toString()
  };
  if (F) C.userAssertionHash = F;
  if (X) C.refreshOn = X.toString();
  if (D) C.requestedClaims = D, C.requestedClaimsHash = H;
  if (C.tokenType?.toLowerCase() !== A5.BEARER.toLowerCase()) switch (C.credentialType = c7.ACCESS_TOKEN_WITH_AUTH_SCHEME, C.tokenType) {
    case A5.POP:
      let E = mf(B, W);
      if (!E?.cnf?.kid) throw b0(de);
      C.keyId = E.cnf.kid;
      break;
    case A5.SSH:
      C.keyId = K
  }
  return C
}
// @from(Start 8037710, End 8038024)
function Es1(A, Q, B, G, Z, I, Y) {
  let J = {
    credentialType: c7.REFRESH_TOKEN,
    homeAccountId: A,
    environment: Q,
    clientId: G,
    secret: B,
    lastUpdatedAt: Date.now().toString()
  };
  if (I) J.userAssertionHash = I;
  if (Z) J.familyId = Z;
  if (Y) J.expiresOn = Y.toString();
  return J
}
// @from(Start 8038026, End 8038223)
function gA1(A) {
  return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("credentialType") && A.hasOwnProperty("clientId") && A.hasOwnProperty("secret")
}
// @from(Start 8038225, End 8038439)
function Wa6(A) {
  if (!A) return !1;
  return gA1(A) && A.hasOwnProperty("realm") && A.hasOwnProperty("target") && (A.credentialType === c7.ACCESS_TOKEN || A.credentialType === c7.ACCESS_TOKEN_WITH_AUTH_SCHEME)
}
// @from(Start 8038441, End 8038562)
function Xa6(A) {
  if (!A) return !1;
  return gA1(A) && A.hasOwnProperty("realm") && A.credentialType === c7.ID_TOKEN
}
// @from(Start 8038564, End 8038661)
function Va6(A) {
  if (!A) return !1;
  return gA1(A) && A.credentialType === c7.REFRESH_TOKEN
}
// @from(Start 8038663, End 8038866)
function Fa6(A, Q) {
  let B = A.indexOf(_V.CACHE_KEY) === 0,
    G = !0;
  if (Q) G = Q.hasOwnProperty("failedRequests") && Q.hasOwnProperty("errors") && Q.hasOwnProperty("cacheHits");
  return B && G
}
// @from(Start 8038868, End 8039033)
function Ka6(A, Q) {
  let B = !1;
  if (A) B = A.indexOf(Xk.THROTTLING_PREFIX) === 0;
  let G = !0;
  if (Q) G = Q.hasOwnProperty("throttleTime");
  return B && G
}
// @from(Start 8039035, End 8039152)
function Da6({
  environment: A,
  clientId: Q
}) {
  return [YqA, A, Q].join(yf.CACHE_KEY_SEPARATOR).toLowerCase()
}
// @from(Start 8039154, End 8039294)
function Ha6(A, Q) {
  if (!Q) return !1;
  return A.indexOf(YqA) === 0 && Q.hasOwnProperty("clientId") && Q.hasOwnProperty("environment")
}
// @from(Start 8039296, End 8039798)
function Ca6(A, Q) {
  if (!Q) return !1;
  return A.indexOf(wZA.CACHE_KEY) === 0 && Q.hasOwnProperty("aliases") && Q.hasOwnProperty("preferred_cache") && Q.hasOwnProperty("preferred_network") && Q.hasOwnProperty("canonical_authority") && Q.hasOwnProperty("authorization_endpoint") && Q.hasOwnProperty("token_endpoint") && Q.hasOwnProperty("issuer") && Q.hasOwnProperty("aliasesFromNetwork") && Q.hasOwnProperty("endpointsFromNetwork") && Q.hasOwnProperty("expiresAt") && Q.hasOwnProperty("jwks_uri")
}
// @from(Start 8039800, End 8039859)
function uA1() {
  return Jq() + wZA.REFRESH_TIME_SECONDS
}
// @from(Start 8039861, End 8040100)
function bZA(A, Q, B) {
  A.authorization_endpoint = Q.authorization_endpoint, A.token_endpoint = Q.token_endpoint, A.end_session_endpoint = Q.end_session_endpoint, A.issuer = Q.issuer, A.endpointsFromNetwork = B, A.jwks_uri = Q.jwks_uri
}
// @from(Start 8040102, End 8040259)
function ZNA(A, Q, B) {
  A.aliases = Q.aliases, A.preferred_cache = Q.preferred_cache, A.preferred_network = Q.preferred_network, A.aliasesFromNetwork = B
}
// @from(Start 8040261, End 8040309)
function mA1(A) {
  return A.expiresAt <= Jq()
}
// @from(Start 8040314, End 8040419)
dA1 = L(() => {
  jZA();
  dX();
  mZ();
  Hl();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})