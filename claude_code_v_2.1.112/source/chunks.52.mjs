
// @from(Ln 129545, Col 0)
class dQ {
    constructor(q) {
        this.config = lLq(q || {}), this.logger = new IE(this.config.system.loggerOptions, jT8, VB);
        let K = {
            canonicalAuthority: q7.DEFAULT_AUTHORITY
        };
        if (!dQ.nodeStorage) dQ.nodeStorage = new A26(this.logger, this.config.managedIdentityId.id, jV6, K);
        this.networkClient = this.config.system.networkClient, this.cryptoProvider = new co;
        let _ = {
            protocolMode: bv.AAD,
            knownAuthorities: [wE1],
            cloudDiscoveryMetadata: "",
            authorityMetadata: ""
        };
        this.fakeAuthority = new gW(wE1, this.networkClient, dQ.nodeStorage, _, this.logger, this.cryptoProvider.createNewGuid(), void 0, !0), this.fakeClientCredentialClient = new j26({
            authOptions: {
                clientId: this.config.managedIdentityId.id,
                authority: this.fakeAuthority
            }
        }), this.managedIdentityClient = new lo(this.logger, dQ.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new Y26
    }
    async acquireToken(q) {
        if (!q.resource) throw aw(JV6.urlEmptyError);
        let K = {
            forceRefresh: q.forceRefresh,
            resource: q.resource.replace("/.default", ""),
            scopes: [q.resource.replace("/.default", "")],
            authority: this.fakeAuthority.canonicalAuthority,
            correlationId: this.cryptoProvider.createNewGuid(),
            claims: q.claims,
            clientCapabilities: this.config.clientCapabilities
        };
        if (K.forceRefresh) return this.acquireTokenFromManagedIdentity(K, this.config.managedIdentityId, this.fakeAuthority);
        let [_, z] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(K, this.config, this.cryptoProvider, this.fakeAuthority, dQ.nodeStorage);
        if (K.claims) {
            let Y = this.managedIdentityClient.getManagedIdentitySource();
            if (_ && t7_.includes(Y)) {
                let A = this.hashUtils.sha256(_.accessToken).toString(jf.HEX);
                K.revokedTokenSha256Hash = A
            }
            return this.acquireTokenFromManagedIdentity(K, this.config.managedIdentityId, this.fakeAuthority)
        }
        if (_) {
            if (z === C2.PROACTIVELY_REFRESHED) {
                this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                let Y = !0;
                await this.acquireTokenFromManagedIdentity(K, this.config.managedIdentityId, this.fakeAuthority, Y)
            }
            return _
        } else return this.acquireTokenFromManagedIdentity(K, this.config.managedIdentityId, this.fakeAuthority)
    }
    async acquireTokenFromManagedIdentity(q, K, _, z) {
        return this.managedIdentityClient.sendManagedIdentityTokenRequest(q, K, _, z)
    }
    getManagedIdentitySource() {
        return lo.sourceName || this.managedIdentityClient.getManagedIdentitySource()
    }
}
// @from(Ln 129603, Col 4)
t7_
// @from(Ln 129604, Col 4)
cbq = L(() => {
    cO();
    ME1();
    xV6();
    Xr6();
    JT8();
    dbq();
    Iv8();
    jj();
    Cv8(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    t7_ = [s3.SERVICE_FABRIC]
})
// @from(Ln 129616, Col 0)
class Py1 {
    constructor(q, K) {
        this.client = q, this.partitionManager = K
    }
    async beforeCacheAccess(q) {
        let K = await this.partitionManager.getKey(),
            _ = await this.client.get(K);
        q.tokenCache.deserialize(_)
    }
    async afterCacheAccess(q) {
        if (q.cacheHasChanged) {
            let K = q.tokenCache.getKVStore(),
                _ = Object.values(K).filter((Y) => VP.isAccountEntity(Y)),
                z;
            if (_.length > 0) {
                let Y = _[0];
                z = await this.partitionManager.extractKey(Y)
            } else z = await this.partitionManager.getKey();
            await this.client.set(z, q.tokenCache.serialize())
        }
    }
}
// @from(Ln 129638, Col 4)
lbq = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 129641, Col 4)
ah = {}
// @from(Ln 129679, Col 4)
MT8 = L(() => {
    LLq();
    kbq();
    Nbq();
    HT8();
    JT8();
    jy1();
    Hy1();
    cbq();
    wy1();
    $T8();
    VE1();
    lbq();
    jj();
    Xr6();
    cO();
    xV6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 129697, Col 4)
nbq = L(() => {
    MT8()
})
// @from(Ln 129701, Col 0)
function uV6(q, K, _) {
    let z = (Y) => {
        return Ir6.getToken.info(Y), new MB({
            scopes: Array.isArray(q) ? q : [q],
            getTokenOptions: _,
            message: Y
        })
    };
    if (!K) throw z("No response");
    if (!K.expiresOn) throw z('Response had no "expiresOn" property.');
    if (!K.accessToken) throw z('Response had no "accessToken" property.')
}
// @from(Ln 129714, Col 0)
function Wy1(q) {
    let K = q === null || q === void 0 ? void 0 : q.authorityHost;
    if (!K && dn6) K = process.env.AZURE_AUTHORITY_HOST;
    return K !== null && K !== void 0 ? K : Cn6
}
// @from(Ln 129720, Col 0)
function Dy1(q, K) {
    if (!K) K = Cn6;
    if (new RegExp(`${q}/?$`).test(K)) return K;
    if (K.endsWith("/")) return K + q;
    else return `${K}/${q}`
}
// @from(Ln 129727, Col 0)
function rbq(q, K, _) {
    if (q === "adfs" && K || _) return [K];
    return []
}
// @from(Ln 129732, Col 0)
function WT8(q) {
    switch (q) {
        case "error":
            return ah.LogLevel.Error;
        case "info":
            return ah.LogLevel.Info;
        case "verbose":
            return ah.LogLevel.Verbose;
        case "warning":
            return ah.LogLevel.Warning;
        default:
            return ah.LogLevel.Info
    }
}
// @from(Ln 129747, Col 0)
function f26(q, K, _) {
    if (K.name === "AuthError" || K.name === "ClientAuthError" || K.name === "BrowserAuthError") {
        let z = K;
        switch (z.errorCode) {
            case "endpoints_resolution_error":
                return Ir6.info(YY(q, K.message)), new c4(K.message);
            case "device_code_polling_cancelled":
                return new KV6("The authentication has been aborted by the caller.");
            case "consent_required":
            case "interaction_required":
            case "login_required":
                Ir6.info(YY(q, `Authentication returned errorCode ${z.errorCode}`));
                break;
            default:
                Ir6.info(YY(q, `Failed to acquire token: ${K.message}`));
                break
        }
    }
    if (K.name === "ClientConfigurationError" || K.name === "BrowserConfigurationAuthError" || K.name === "AbortError" || K.name === "AuthenticationError") return K;
    if (K.name === "NativeAuthError") return Ir6.info(YY(q, `Error from the native broker: ${K.message} with status code: ${K.statusCode}`)), K;
    return new MB({
        scopes: q,
        getTokenOptions: _,
        message: K.message
    })
}
// @from(Ln 129774, Col 0)
function obq(q) {
    return {
        localAccountId: q.homeAccountId,
        environment: q.authority,
        username: q.username,
        homeAccountId: q.homeAccountId,
        tenantId: q.tenantId
    }
}
// @from(Ln 129784, Col 0)
function abq(q, K) {
    var _;
    return {
        authority: (_ = K.environment) !== null && _ !== void 0 ? _ : Fkq,
        homeAccountId: K.homeAccountId,
        tenantId: K.tenantId || pkq,
        username: K.username,
        clientId: q,
        version: ibq
    }
}
// @from(Ln 129796, Col 0)
function sbq(q) {
    return JSON.stringify(q)
}
// @from(Ln 129800, Col 0)
function tbq(q) {
    let K = JSON.parse(q);
    if (K.version && K.version !== ibq) throw Error("Unsupported AuthenticationRecord version");
    return K
}
// @from(Ln 129805, Col 4)
Ir6
// @from(Ln 129805, Col 9)
ibq = "1.0"
// @from(Ln 129806, Col 4)
PT8 = (q, K = fG8 ? "Node" : "Browser") => (_, z, Y) => {
        if (Y) return;
        switch (_) {
            case ah.LogLevel.Error:
                q.info(`MSAL ${K} V2 error: ${z}`);
                return;
            case ah.LogLevel.Info:
                q.info(`MSAL ${K} V2 info message: ${z}`);
                return;
            case ah.LogLevel.Verbose:
                q.info(`MSAL ${K} V2 verbose message: ${z}`);
                return;
            case ah.LogLevel.Warning:
                q.info(`MSAL ${K} V2 warning: ${z}`);
                return
        }
    }
// @from(Ln 129823, Col 4)
DT8 = L(() => {
    BW();
    rw();
    LQ();
    Xq6();
    fk1();
    nbq();
    Ir6 = u9("IdentityUtils")
})
// @from(Ln 129833, Col 0)
function ebq(q) {
    return yk1([{
        name: "imdsRetryPolicy",
        retry: ({
            retryCount: K,
            response: _
        }) => {
            if ((_ === null || _ === void 0 ? void 0 : _.status) !== 404) return {
                skipStrategy: !0
            };
            return kEq(K, {
                retryDelayInMs: q.startDelayInMs,
                maxRetryDelayInMs: e7_
            })
        }
    }], {
        maxRetries: q.maxRetries
    })
}
// @from(Ln 129852, Col 4)
e7_ = 64000
// @from(Ln 129853, Col 4)
qIq = L(() => {
    CQ();
    Xq6()
})
// @from(Ln 129858, Col 0)
function _q_(q) {
    var K;
    if (!an6(q)) throw Error(`${no}: Multiple scopes are not supported.`);
    let z = new URL(Kq_, (K = process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) !== null && K !== void 0 ? K : qq_),
        Y = {
            Accept: "application/json"
        };
    return {
        url: `${z}`,
        method: "GET",
        headers: No(Y)
    }
}
// @from(Ln 129871, Col 4)
no = "ManagedIdentityCredential - IMDS"
// @from(Ln 129872, Col 4)
G26
// @from(Ln 129872, Col 9)
qq_ = "http://169.254.169.254"
// @from(Ln 129873, Col 4)
Kq_ = "/metadata/identity/oauth2/token"
// @from(Ln 129874, Col 4)
Zy1
// @from(Ln 129875, Col 4)
KIq = L(() => {
    CQ();
    Xq6();
    rw();
    $f();
    G26 = u9(no);
    Zy1 = {
        name: "imdsMsi",
        async isAvailable(q) {
            let {
                scopes: K,
                identityClient: _,
                getTokenOptions: z
            } = q, Y = an6(K);
            if (!Y) return G26.info(`${no}: Unavailable. Multiple scopes are not supported.`), !1;
            if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) return !0;
            if (!_) throw Error("Missing IdentityClient");
            let A = _q_(Y);
            return _A.withSpan("ManagedIdentityCredential-pingImdsEndpoint", z !== null && z !== void 0 ? z : {}, async (O) => {
                var w, $;
                A.tracingOptions = O.tracingOptions;
                let j = nh(A);
                j.timeout = ((w = O.requestOptions) === null || w === void 0 ? void 0 : w.timeout) || 1000, j.allowInsecureConnection = !0;
                let H;
                try {
                    G26.info(`${no}: Pinging the Azure IMDS endpoint`), H = await _.sendRequest(j)
                } catch (J) {
                    if (ZG8(J)) G26.verbose(`${no}: Caught error ${J.name}: ${J.message}`);
                    return G26.info(`${no}: The Azure IMDS endpoint is unavailable`), !1
                }
                if (H.status === 403) {
                    if (($ = H.bodyAsText) === null || $ === void 0 ? void 0 : $.includes("unreachable")) return G26.info(`${no}: The Azure IMDS endpoint is unavailable`), G26.info(`${no}: ${H.bodyAsText}`), !1
                }
                return G26.info(`${no}: The Azure IMDS endpoint is available`), !0
            })
        }
    }
})
// @from(Ln 129914, Col 0)
function ZT8(q) {
    var K, _;
    let z = q;
    if (z === void 0 && ((_ = (K = globalThis.process) === null || K === void 0 ? void 0 : K.env) === null || _ === void 0 ? void 0 : _.AZURE_REGIONAL_AUTHORITY_NAME) !== void 0) z = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
    if (z === fy1.AutoDiscoverRegion) return "AUTO_DISCOVER";
    return z
}
// @from(Ln 129921, Col 4)
fy1
// @from(Ln 129922, Col 4)
_Iq = L(() => {
    (function(q) {
        q.AutoDiscoverRegion = "AutoDiscoverRegion", q.USWest = "westus", q.USWest2 = "westus2", q.USCentral = "centralus", q.USEast = "eastus", q.USEast2 = "eastus2", q.USNorthCentral = "northcentralus", q.USSouthCentral = "southcentralus", q.USWestCentral = "westcentralus", q.CanadaCentral = "canadacentral", q.CanadaEast = "canadaeast", q.BrazilSouth = "brazilsouth", q.EuropeNorth = "northeurope", q.EuropeWest = "westeurope", q.UKSouth = "uksouth", q.UKWest = "ukwest", q.FranceCentral = "francecentral", q.FranceSouth = "francesouth", q.SwitzerlandNorth = "switzerlandnorth", q.SwitzerlandWest = "switzerlandwest", q.GermanyNorth = "germanynorth", q.GermanyWestCentral = "germanywestcentral", q.NorwayWest = "norwaywest", q.NorwayEast = "norwayeast", q.AsiaEast = "eastasia", q.AsiaSouthEast = "southeastasia", q.JapanEast = "japaneast", q.JapanWest = "japanwest", q.AustraliaEast = "australiaeast", q.AustraliaSouthEast = "australiasoutheast", q.AustraliaCentral = "australiacentral", q.AustraliaCentral2 = "australiacentral2", q.IndiaCentral = "centralindia", q.IndiaSouth = "southindia", q.IndiaWest = "westindia", q.KoreaSouth = "koreasouth", q.KoreaCentral = "koreacentral", q.UAECentral = "uaecentral", q.UAENorth = "uaenorth", q.SouthAfricaNorth = "southafricanorth", q.SouthAfricaWest = "southafricawest", q.ChinaNorth = "chinanorth", q.ChinaEast = "chinaeast", q.ChinaNorth2 = "chinanorth2", q.ChinaEast2 = "chinaeast2", q.GermanyCentral = "germanycentral", q.GermanyNorthEast = "germanynortheast", q.GovernmentUSVirginia = "usgovvirginia", q.GovernmentUSIowa = "usgoviowa", q.GovernmentUSArizona = "usgovarizona", q.GovernmentUSTexas = "usgovtexas", q.GovernmentUSDodEast = "usdodeast", q.GovernmentUSDodCentral = "usdodcentral"
    })(fy1 || (fy1 = {}))
})
// @from(Ln 129929, Col 0)
function zq_() {
    try {
        return zIq.statSync("/.dockerenv"), !0
    } catch {
        return !1
    }
}
// @from(Ln 129937, Col 0)
function Yq_() {
    try {
        return zIq.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
    } catch {
        return !1
    }
}
// @from(Ln 129945, Col 0)
function vy1() {
    if (Gy1 === void 0) Gy1 = zq_() || Yq_();
    return Gy1
}
// @from(Ln 129949, Col 4)
Gy1
// @from(Ln 129950, Col 4)
YIq = () => {}
// @from(Ln 129953, Col 0)
function mV6() {
    if (Ty1 === void 0) Ty1 = Oq_() || vy1();
    return Ty1
}
// @from(Ln 129957, Col 4)
Ty1
// @from(Ln 129957, Col 9)
Oq_ = () => {
    try {
        return Aq_.statSync("/run/.containerenv"), !0
    } catch {
        return !1
    }
}
// @from(Ln 129964, Col 4)
Vy1 = L(() => {
    YIq()
})
// @from(Ln 129970, Col 4)
AIq = () => {
        if (OIq.platform !== "linux") return !1;
        if (wq_.release().toLowerCase().includes("microsoft")) {
            if (mV6()) return !1;
            return !0
        }
        try {
            return $q_.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !mV6() : !1
        } catch {
            return !1
        }
    }
// @from(Ln 129982, Col 4)
mq6
// @from(Ln 129983, Col 4)
ky1 = L(() => {
    Vy1();
    mq6 = OIq.env.__IS_WSL_TEST__ ? AIq : AIq()
})
// @from(Ln 129991, Col 4)
Hq_
// @from(Ln 129991, Col 9)
Jq_ = async () => {
    return `${await Hq_()}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
}
// @from(Ln 129993, Col 3)
Ny1 = async () => {
    if (mq6) return Jq_();
    return `${wIq.env.SYSTEMROOT||wIq.env.windir||String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}
// @from(Ln 129997, Col 4)
jIq = L(() => {
    ky1();
    ky1();
    Hq_ = (() => {
        let K;
        return async function() {
            if (K) return K;
            let _ = "/etc/wsl.conf",
                z = !1;
            try {
                await $Iq.access(_, jq_.F_OK), z = !0
            } catch {}
            if (!z) return "/mnt/";
            let Y = await $Iq.readFile(_, {
                    encoding: "utf8"
                }),
                A = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(Y);
            if (!A) return "/mnt/";
            return K = A.groups.mountPoint.trim(), K = K.endsWith("/") ? K : `${K}/`, K
        }
    })()
})
// @from(Ln 130020, Col 0)
function Bq6(q, K, _) {
    let z = (Y) => Object.defineProperty(q, K, {
        value: Y,
        enumerable: !0,
        writable: !0
    });
    return Object.defineProperty(q, K, {
        configurable: !0,
        enumerable: !0,
        get() {
            let Y = _();
            return z(Y), Y
        },
        set(Y) {
            z(Y)
        }
    }), q
}
// @from(Ln 130045, Col 0)
async function Ey1() {
    if (Mq_.platform !== "darwin") throw Error("macOS only");
    let {
        stdout: q
    } = await Wq_("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
    return /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(q)?.groups.id ?? "com.apple.Safari"
}
// @from(Ln 130052, Col 4)
Wq_
// @from(Ln 130053, Col 4)
HIq = L(() => {
    Wq_ = Xq_(Pq_)
})
// @from(Ln 130064, Col 0)
async function JIq(q, {
    humanReadableOutput: K = !0,
    signal: _
} = {}) {
    if (Dq_.platform !== "darwin") throw Error("macOS only");
    let z = K ? [] : ["-ss"],
        Y = {};
    if (_) Y.signal = _;
    let {
        stdout: A
    } = await Gq_("osascript", ["-e", q, z], Y);
    return A.trim()
}
// @from(Ln 130077, Col 4)
Gq_
// @from(Ln 130078, Col 4)
XIq = L(() => {
    Gq_ = Zq_(fq_)
})
// @from(Ln 130081, Col 0)
async function yy1(q) {
    return JIq(`tell application "Finder" to set app_path to application file id "${q}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)
}
// @from(Ln 130085, Col 4)
MIq = L(() => {
    XIq()
})
// @from(Ln 130094, Col 0)
async function hy1(q = Vq_) {
    let {
        stdout: K
    } = await q("reg", ["QUERY", " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice", "/v", "ProgId"]), _ = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(K);
    if (!_) throw new Ly1(`Cannot find Windows browser in stdout: ${JSON.stringify(K)}`);
    let {
        id: z
    } = _.groups, Y = kq_[z];
    if (!Y) throw new Ly1(`Unknown browser ID: ${z}`);
    return Y
}
// @from(Ln 130105, Col 4)
Vq_
// @from(Ln 130105, Col 9)
kq_
// @from(Ln 130105, Col 14)
Ly1
// @from(Ln 130106, Col 4)
PIq = L(() => {
    Vq_ = vq_(Tq_), kq_ = {
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
    Ly1 = class Ly1 extends Error {}
})
// @from(Ln 130154, Col 0)
async function Sy1() {
    if (Ry1.platform === "darwin") {
        let q = await Ey1();
        return {
            name: await yy1(q),
            id: q
        }
    }
    if (Ry1.platform === "linux") {
        let {
            stdout: q
        } = await yq_("xdg-mime", ["query", "default", "x-scheme-handler/http"]), K = q.trim();
        return {
            name: Lq_(K.replace(/.desktop$/, "").replace("-", " ")),
            id: K
        }
    }
    if (Ry1.platform === "win32") return hy1();
    throw Error("Only macOS, Linux, and Windows are supported")
}
// @from(Ln 130174, Col 4)
yq_
// @from(Ln 130174, Col 9)
Lq_ = (q) => q.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (K) => K.toUpperCase())
// @from(Ln 130175, Col 4)
WIq = L(() => {
    HIq();
    MIq();
    PIq();
    yq_ = Nq_(Eq_)
})
// @from(Ln 130181, Col 4)
kIq = {}
// @from(Ln 130202, Col 0)
async function Iq_() {
    let q = await Ny1(),
        K = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`,
        _ = vIq.from(K, "utf16le").toString("base64"),
        {
            stdout: z
        } = await bq_(q, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", _], {
            encoding: "utf8"
        }),
        Y = z.trim(),
        A = {
            ChromeHTML: "com.google.chrome",
            BraveHTML: "com.brave.Browser",
            MSEdgeHTM: "com.microsoft.edge",
            FirefoxURL: "org.mozilla.firefox"
        };
    return A[Y] ? {
        id: A[Y]
    } : {}
}
// @from(Ln 130223, Col 0)
function GIq(q) {
    if (typeof q === "string" || Array.isArray(q)) return q;
    let {
        [ZIq]: K
    } = q;
    if (!K) throw Error(`${ZIq} is not supported`);
    return K
}
// @from(Ln 130232, Col 0)
function fT8({
    [BV6]: q
}, {
    wsl: K
}) {
    if (K && mq6) return GIq(K);
    if (!q) throw Error(`${BV6} is not supported`);
    return GIq(q)
}
// @from(Ln 130241, Col 4)
bq_
// @from(Ln 130241, Col 9)
by1
// @from(Ln 130241, Col 14)
DIq
// @from(Ln 130241, Col 19)
BV6
// @from(Ln 130241, Col 24)
ZIq
// @from(Ln 130241, Col 29)
fIq = async (q, K) => {
    let _;
    for (let z of q) try {
        return await K(z)
    } catch (Y) {
        _ = Y
    }
    throw _
}
// @from(Ln 130249, Col 3)
xr6 = async (q) => {
    if (q = {
            wait: !1,
            background: !1,
            newInstance: !1,
            allowNonzeroExitCode: !1,
            ...q
        }, Array.isArray(q.app)) return fIq(q.app, (w) => xr6({
        ...q,
        app: w
    }));
    let {
        name: K,
        arguments: _ = []
    } = q.app ?? {};
    if (_ = [..._], Array.isArray(K)) return fIq(K, (w) => xr6({
        ...q,
        app: {
            name: w,
            arguments: _
        }
    }));
    if (K === "browser" || K === "browserPrivate") {
        let w = {
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
            j = mq6 ? await Iq_() : await Sy1();
        if (j.id in w) {
            let H = w[j.id];
            if (K === "browserPrivate") _.push($[H]);
            return xr6({
                ...q,
                app: {
                    name: pq6[H],
                    arguments: _
                }
            })
        }
        throw Error(`${j.name} is not supported as a default browser`)
    }
    let z, Y = [],
        A = {};
    if (BV6 === "darwin") {
        if (z = "open", q.wait) Y.push("--wait-apps");
        if (q.background) Y.push("--background");
        if (q.newInstance) Y.push("--new");
        if (K) Y.push("-a", K)
    } else if (BV6 === "win32" || mq6 && !mV6() && !K) {
        if (z = await Ny1(), Y.push("-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand"), !mq6) A.windowsVerbatimArguments = !0;
        let w = ["Start"];
        if (q.wait) w.push("-Wait");
        if (K) {
            if (w.push(`"\`"${K}\`""`), q.target) _.push(q.target)
        } else if (q.target) w.push(`"${q.target}"`);
        if (_.length > 0) _ = _.map(($) => `"\`"${$}\`""`), w.push("-ArgumentList", _.join(","));
        q.target = vIq.from(w.join(" "), "utf16le").toString("base64")
    } else {
        if (K) z = K;
        else {
            let w = !by1 || by1 === "/",
                $ = !1;
            try {
                await Sq_.access(DIq, Cq_.X_OK), $ = !0
            } catch {}
            z = Cy1.versions.electron ?? (BV6 === "android" || w || !$) ? "xdg-open" : DIq
        }
        if (_.length > 0) Y.push(..._);
        if (!q.wait) A.stdio = "ignore", A.detached = !0
    }
    if (BV6 === "darwin" && _.length > 0) Y.push("--args", ..._);
    if (q.target) Y.push(q.target);
    let O = VIq.spawn(z, Y, A);
    if (q.wait) return new Promise((w, $) => {
        O.once("error", $), O.once("close", (j) => {
            if (!q.allowNonzeroExitCode && j > 0) {
                $(Error(`Exited with code ${j}`));
                return
            }
            w(O)
        })
    });
    return O.unref(), O
}
// @from(Ln 130345, Col 3)
xq_ = (q, K) => {
    if (typeof q !== "string") throw TypeError("Expected a `target`");
    return xr6({
        ...K,
        target: q
    })
}
// @from(Ln 130351, Col 3)
uq_ = (q, K) => {
    if (typeof q !== "string" && !Array.isArray(q)) throw TypeError("Expected a valid `name`");
    let {
        arguments: _ = []
    } = K ?? {};
    if (_ !== void 0 && _ !== null && !Array.isArray(_)) throw TypeError("Expected `appArguments` as Array type");
    return xr6({
        ...K,
        app: {
            name: q,
            arguments: _
        }
    })
}
// @from(Ln 130364, Col 3)
pq6
// @from(Ln 130364, Col 8)
mq_
// @from(Ln 130365, Col 4)
NIq = L(() => {
    jIq();
    WIq();
    Vy1();
    bq_ = Rq_(VIq.execFile), by1 = TIq.dirname(hq_(import.meta.url)), DIq = TIq.join(by1, "xdg-open"), {
        platform: BV6,
        arch: ZIq
    } = Cy1;
    pq6 = {};
    Bq6(pq6, "chrome", () => fT8({
        darwin: "google chrome",
        win32: "chrome",
        linux: ["google-chrome", "google-chrome-stable", "chromium"]
    }, {
        wsl: {
            ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
        }
    }));
    Bq6(pq6, "brave", () => fT8({
        darwin: "brave browser",
        win32: "brave",
        linux: ["brave-browser", "brave"]
    }, {
        wsl: {
            ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
            x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
        }
    }));
    Bq6(pq6, "firefox", () => fT8({
        darwin: "firefox",
        win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
        linux: "firefox"
    }, {
        wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
    }));
    Bq6(pq6, "edge", () => fT8({
        darwin: "microsoft edge",
        win32: "msedge",
        linux: ["microsoft-edge", "microsoft-edge-dev"]
    }, {
        wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
    }));
    Bq6(pq6, "browser", () => "browser");
    Bq6(pq6, "browserPrivate", () => "browserPrivate");
    mq_ = xq_
})
// @from(Ln 130413, Col 0)
function Bq_(q, K, _ = {}) {
    var z, Y, A;
    let O = rT6((z = _.logger) !== null && z !== void 0 ? z : pE, K, q),
        w = Dy1(O, Wy1(_)),
        $ = new IQ(Object.assign(Object.assign({}, _.tokenCredentialOptions), {
            authorityHost: w,
            loggingOptions: _.loggingOptions
        }));
    return {
        auth: {
            clientId: q,
            authority: w,
            knownAuthorities: rbq(O, w, _.disableInstanceDiscovery)
        },
        system: {
            networkClient: $,
            loggerOptions: {
                loggerCallback: PT8((Y = _.logger) !== null && Y !== void 0 ? Y : pE),
                logLevel: WT8(_G8()),
                piiLoggingEnabled: (A = _.loggingOptions) === null || A === void 0 ? void 0 : A.enableUnsafeSupportLogging
            }
        }
    }
}
// @from(Ln 130438, Col 0)
function uv(q, K, _ = {}) {
    var z;
    let Y = {
            msalConfig: Bq_(q, K, _),
            cachedAccount: _.authenticationRecord ? obq(_.authenticationRecord) : null,
            pluginConfiguration: nkq.generatePluginConfiguration(_),
            logger: (z = _.logger) !== null && z !== void 0 ? z : pE
        },
        A = new Map;
    async function O(V = {}) {
        let k = V.enableCae ? "CAE" : "default",
            N = A.get(k);
        if (N) return Y.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), N;
        Y.logger.getToken.info(`Creating new PublicClientApplication with CAE ${V.enableCae?"enabled":"disabled"}.`);
        let R = V.enableCae ? Y.pluginConfiguration.cache.cachePluginCae : Y.pluginConfiguration.cache.cachePlugin;
        return Y.msalConfig.auth.clientCapabilities = V.enableCae ? ["cp1"] : void 0, N = new Rr6(Object.assign(Object.assign({}, Y.msalConfig), {
            broker: {
                nativeBrokerPlugin: Y.pluginConfiguration.broker.nativeBrokerPlugin
            },
            cache: {
                cachePlugin: await R
            }
        })), A.set(k, N), N
    }
    let w = new Map;
    async function $(V = {}) {
        let k = V.enableCae ? "CAE" : "default",
            N = w.get(k);
        if (N) return Y.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), N;
        Y.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${V.enableCae?"enabled":"disabled"}.`);
        let R = V.enableCae ? Y.pluginConfiguration.cache.cachePluginCae : Y.pluginConfiguration.cache.cachePlugin;
        return Y.msalConfig.auth.clientCapabilities = V.enableCae ? ["cp1"] : void 0, N = new Cr6(Object.assign(Object.assign({}, Y.msalConfig), {
            broker: {
                nativeBrokerPlugin: Y.pluginConfiguration.broker.nativeBrokerPlugin
            },
            cache: {
                cachePlugin: await R
            }
        })), w.set(k, N), N
    }
    async function j(V, k, N = {}) {
        if (Y.cachedAccount === null) throw Y.logger.getToken.info("No cached account found in local state."), new MB({
            scopes: k
        });
        if (N.claims) Y.cachedClaims = N.claims;
        let R = {
            account: Y.cachedAccount,
            scopes: k,
            claims: Y.cachedClaims
        };
        if (Y.pluginConfiguration.broker.isEnabled) {
            if (R.tokenQueryParameters || (R.tokenQueryParameters = {}), Y.pluginConfiguration.broker.enableMsaPassthrough) R.tokenQueryParameters.msal_request_type = "consumer_passthrough"
        }
        if (N.proofOfPossessionOptions) R.shrNonce = N.proofOfPossessionOptions.nonce, R.authenticationScheme = "pop", R.resourceRequestMethod = N.proofOfPossessionOptions.resourceRequestMethod, R.resourceRequestUri = N.proofOfPossessionOptions.resourceRequestUrl;
        Y.logger.getToken.info("Attempting to acquire token silently");
        try {
            return await V.acquireTokenSilent(R)
        } catch (h) {
            throw f26(k, h, N)
        }
    }

    function H(V) {
        if (V === null || V === void 0 ? void 0 : V.tenantId) return Dy1(V.tenantId, Wy1(_));
        return Y.msalConfig.auth.authority
    }
    async function J(V, k, N, R) {
        var h, C;
        let x = null;
        try {
            x = await j(V, k, N)
        } catch (B) {
            if (B.name !== "AuthenticationRequiredError") throw B;
            if (N.disableAutomaticAuthentication) throw new MB({
                scopes: k,
                getTokenOptions: N,
                message: "Automatic authentication has been disabled. You may call the authentication() method."
            })
        }
        if (x === null) try {
            x = await R()
        } catch (B) {
            throw f26(k, B, N)
        }
        return uV6(k, x, N), Y.cachedAccount = (h = x === null || x === void 0 ? void 0 : x.account) !== null && h !== void 0 ? h : null, Y.logger.getToken.info(GP(k)), {
            token: x.accessToken,
            expiresOnTimestamp: x.expiresOn.getTime(),
            refreshAfterTimestamp: (C = x.refreshOn) === null || C === void 0 ? void 0 : C.getTime(),
            tokenType: x.tokenType
        }
    }
    async function X(V, k, N = {}) {
        var R;
        Y.logger.getToken.info("Attempting to acquire token using client secret"), Y.msalConfig.auth.clientSecret = k;
        let h = await $(N);
        try {
            let C = await h.acquireTokenByClientCredential({
                scopes: V,
                authority: H(N),
                azureRegion: ZT8(),
                claims: N === null || N === void 0 ? void 0 : N.claims
            });
            return uV6(V, C, N), Y.logger.getToken.info(GP(V)), {
                token: C.accessToken,
                expiresOnTimestamp: C.expiresOn.getTime(),
                refreshAfterTimestamp: (R = C.refreshOn) === null || R === void 0 ? void 0 : R.getTime(),
                tokenType: C.tokenType
            }
        } catch (C) {
            throw f26(V, C, N)
        }
    }
    async function M(V, k, N = {}) {
        var R;
        Y.logger.getToken.info("Attempting to acquire token using client assertion"), Y.msalConfig.auth.clientAssertion = k;
        let h = await $(N);
        try {
            let C = await h.acquireTokenByClientCredential({
                scopes: V,
                authority: H(N),
                azureRegion: ZT8(),
                claims: N === null || N === void 0 ? void 0 : N.claims,
                clientAssertion: k
            });
            return uV6(V, C, N), Y.logger.getToken.info(GP(V)), {
                token: C.accessToken,
                expiresOnTimestamp: C.expiresOn.getTime(),
                refreshAfterTimestamp: (R = C.refreshOn) === null || R === void 0 ? void 0 : R.getTime(),
                tokenType: C.tokenType
            }
        } catch (C) {
            throw f26(V, C, N)
        }
    }
    async function P(V, k, N = {}) {
        var R;
        Y.logger.getToken.info("Attempting to acquire token using client certificate"), Y.msalConfig.auth.clientCertificate = k;
        let h = await $(N);
        try {
            let C = await h.acquireTokenByClientCredential({
                scopes: V,
                authority: H(N),
                azureRegion: ZT8(),
                claims: N === null || N === void 0 ? void 0 : N.claims
            });
            return uV6(V, C, N), Y.logger.getToken.info(GP(V)), {
                token: C.accessToken,
                expiresOnTimestamp: C.expiresOn.getTime(),
                refreshAfterTimestamp: (R = C.refreshOn) === null || R === void 0 ? void 0 : R.getTime(),
                tokenType: C.tokenType
            }
        } catch (C) {
            throw f26(V, C, N)
        }
    }
    async function W(V, k, N = {}) {
        Y.logger.getToken.info("Attempting to acquire token using device code");
        let R = await O(N);
        return J(R, V, N, () => {
            var h, C;
            let x = {
                    scopes: V,
                    cancel: (C = (h = N === null || N === void 0 ? void 0 : N.abortSignal) === null || h === void 0 ? void 0 : h.aborted) !== null && C !== void 0 ? C : !1,
                    deviceCodeCallback: k,
                    authority: H(N),
                    claims: N === null || N === void 0 ? void 0 : N.claims
                },
                B = R.acquireTokenByDeviceCode(x);
            if (N.abortSignal) N.abortSignal.addEventListener("abort", () => {
                x.cancel = !0
            });
            return B
        })
    }
    async function D(V, k, N, R = {}) {
        Y.logger.getToken.info("Attempting to acquire token using username and password");
        let h = await O(R);
        return J(h, V, R, () => {
            let C = {
                scopes: V,
                username: k,
                password: N,
                authority: H(R),
                claims: R === null || R === void 0 ? void 0 : R.claims
            };
            return h.acquireTokenByUsernamePassword(C)
        })
    }

    function Z() {
        if (!Y.cachedAccount) return;
        return abq(q, Y.cachedAccount)
    }
    async function G(V, k, N, R, h = {}) {
        Y.logger.getToken.info("Attempting to acquire token using authorization code");
        let C;
        if (R) Y.msalConfig.auth.clientSecret = R, C = await $(h);
        else C = await O(h);
        return J(C, V, h, () => {
            return C.acquireTokenByCode({
                scopes: V,
                redirectUri: k,
                code: N,
                authority: H(h),
                claims: h === null || h === void 0 ? void 0 : h.claims
            })
        })
    }
    async function f(V, k, N, R = {}) {
        var h;
        if (pE.getToken.info("Attempting to acquire token on behalf of another user"), typeof N === "string") pE.getToken.info("Using client secret for on behalf of flow"), Y.msalConfig.auth.clientSecret = N;
        else if (typeof N === "function") pE.getToken.info("Using client assertion callback for on behalf of flow"), Y.msalConfig.auth.clientAssertion = N;
        else pE.getToken.info("Using client certificate for on behalf of flow"), Y.msalConfig.auth.clientCertificate = N;
        let C = await $(R);
        try {
            let x = await C.acquireTokenOnBehalfOf({
                scopes: V,
                authority: H(R),
                claims: R.claims,
                oboAssertion: k
            });
            return uV6(V, x, R), pE.getToken.info(GP(V)), {
                token: x.accessToken,
                expiresOnTimestamp: x.expiresOn.getTime(),
                refreshAfterTimestamp: (h = x.refreshOn) === null || h === void 0 ? void 0 : h.getTime(),
                tokenType: x.tokenType
            }
        } catch (x) {
            throw f26(V, x, R)
        }
    }
    async function v(V, k = {}) {
        pE.getToken.info("Attempting to acquire token interactively");
        let N = await O(k);
        async function R(C) {
            var x;
            pE.verbose("Authentication will resume through the broker");
            let B = h();
            if (Y.pluginConfiguration.broker.parentWindowHandle) B.windowHandle = Buffer.from(Y.pluginConfiguration.broker.parentWindowHandle);
            else pE.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
            if (Y.pluginConfiguration.broker.enableMsaPassthrough)((x = B.tokenQueryParameters) !== null && x !== void 0 ? x : B.tokenQueryParameters = {}).msal_request_type = "consumer_passthrough";
            if (C) B.prompt = "none", pE.verbose("Attempting broker authentication using the default broker account");
            else pE.verbose("Attempting broker authentication without the default broker account");
            if (k.proofOfPossessionOptions) B.shrNonce = k.proofOfPossessionOptions.nonce, B.authenticationScheme = "pop", B.resourceRequestMethod = k.proofOfPossessionOptions.resourceRequestMethod, B.resourceRequestUri = k.proofOfPossessionOptions.resourceRequestUrl;
            try {
                return await N.acquireTokenInteractive(B)
            } catch (m) {
                if (pE.verbose(`Failed to authenticate through the broker: ${m.message}`), C) return R(!1);
                else throw m
            }
        }

        function h() {
            var C, x;
            return {
                openBrowser: async (B) => {
                    await (await Promise.resolve().then(() => (NIq(), kIq))).default(B, {
                        wait: !0,
                        newInstance: !0
                    })
                },
                scopes: V,
                authority: H(k),
                claims: k === null || k === void 0 ? void 0 : k.claims,
                loginHint: k === null || k === void 0 ? void 0 : k.loginHint,
                errorTemplate: (C = k === null || k === void 0 ? void 0 : k.browserCustomizationOptions) === null || C === void 0 ? void 0 : C.errorMessage,
                successTemplate: (x = k === null || k === void 0 ? void 0 : k.browserCustomizationOptions) === null || x === void 0 ? void 0 : x.successMessage,
                prompt: (k === null || k === void 0 ? void 0 : k.loginHint) ? "login" : "select_account"
            }
        }
        return J(N, V, k, async () => {
            var C;
            let x = h();
            if (Y.pluginConfiguration.broker.isEnabled) return R((C = Y.pluginConfiguration.broker.useDefaultBrokerAccount) !== null && C !== void 0 ? C : !1);
            if (k.proofOfPossessionOptions) x.shrNonce = k.proofOfPossessionOptions.nonce, x.authenticationScheme = "pop", x.resourceRequestMethod = k.proofOfPossessionOptions.resourceRequestMethod, x.resourceRequestUri = k.proofOfPossessionOptions.resourceRequestUrl;
            return N.acquireTokenInteractive(x)
        })
    }
    return {
        getActiveAccount: Z,
        getTokenByClientSecret: X,
        getTokenByClientAssertion: M,
        getTokenByClientCertificate: P,
        getTokenByDeviceCode: W,
        getTokenByUsernamePassword: D,
        getTokenByAuthorizationCode: G,
        getTokenOnBehalfOf: f,
        getTokenByInteractiveRequest: v
    }
}
// @from(Ln 130728, Col 4)
pE
// @from(Ln 130729, Col 4)
io = L(() => {
    MT8();
    rw();
    NV1();
    DT8();
    BW();
    tn6();
    _Iq();
    Jw6();
    pW();
    pE = u9("MsalClient")
})
// @from(Ln 130741, Col 0)
class v26 {
    constructor(q, K, _, z = {}) {
        if (!q) throw new c4("ClientAssertionCredential: tenantId is a required parameter.");
        if (!K) throw new c4("ClientAssertionCredential: clientId is a required parameter.");
        if (!_) throw new c4("ClientAssertionCredential: clientAssertion is a required parameter.");
        this.tenantId = q, this.additionallyAllowedTenantIds = _H(z === null || z === void 0 ? void 0 : z.additionallyAllowedTenants), this.options = z, this.getAssertion = _, this.msalClient = uv(K, q, Object.assign(Object.assign({}, z), {
            logger: EIq,
            tokenCredentialOptions: this.options
        }))
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, EIq);
            let z = Array.isArray(q) ? q : [q];
            return this.msalClient.getTokenByClientAssertion(z, this.getAssertion, _)
        })
    }
}
// @from(Ln 130759, Col 4)
EIq
// @from(Ln 130760, Col 4)
GT8 = L(() => {
    io();
    pW();
    BW();
    rw();
    $f();
    EIq = u9("ClientAssertionCredential")
})
// @from(Ln 130771, Col 0)
class ro {
    constructor(q) {
        this.azureFederatedTokenFileContent = void 0, this.cacheDate = void 0;
        let K = zG8(Fq_).assigned.join(", ");
        ur6.info(`Found the following environment variables: ${K}`);
        let _ = q !== null && q !== void 0 ? q : {},
            z = _.tenantId || process.env.AZURE_TENANT_ID,
            Y = _.clientId || process.env.AZURE_CLIENT_ID;
        if (this.federatedTokenFilePath = _.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, z) vP(ur6, z);
        if (!Y) throw new c4(`${T26}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        if (!z) throw new c4(`${T26}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        if (!this.federatedTokenFilePath) throw new c4(`${T26}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        ur6.info(`Invoking ClientAssertionCredential with tenant ID: ${z}, clientId: ${_.clientId} and federated token path: [REDACTED]`), this.client = new v26(z, Y, this.readFileContents.bind(this), q)
    }
    async getToken(q, K) {
        if (!this.client) {
            let _ = `${T26}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
            throw ur6.info(_), new c4(_)
        }
        return ur6.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(q, K)
    }
    async readFileContents() {
        if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000) this.azureFederatedTokenFileContent = void 0;
        if (!this.federatedTokenFilePath) throw new c4(`${T26}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
        if (!this.azureFederatedTokenFileContent) {
            let K = (await pq_(this.federatedTokenFilePath, "utf8")).trim();
            if (!K) throw new c4(`${T26}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
            else this.azureFederatedTokenFileContent = K, this.cacheDate = Date.now()
        }
        return this.azureFederatedTokenFileContent
    }
}
// @from(Ln 130810, Col 4)
T26 = "WorkloadIdentityCredential"
// @from(Ln 130811, Col 4)
Fq_
// @from(Ln 130811, Col 9)
ur6
// @from(Ln 130812, Col 4)
vT8 = L(() => {
    rw();
    GT8();
    BW();
    pW();
    Fq_ = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_FEDERATED_TOKEN_FILE"], ur6 = u9(T26)
})
// @from(Ln 130819, Col 4)
yIq = "ManagedIdentityCredential - Token Exchange"
// @from(Ln 130820, Col 4)
gq_
// @from(Ln 130820, Col 9)
Iy1
// @from(Ln 130821, Col 4)
LIq = L(() => {
    vT8();
    rw();
    gq_ = u9(yIq), Iy1 = {
        name: "tokenExchangeMsi",
        async isAvailable(q) {
            let K = process.env,
                _ = Boolean((q || K.AZURE_CLIENT_ID) && K.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
            if (!_) gq_.info(`${yIq}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
            return _
        },
        async getToken(q, K = {}) {
            let {
                scopes: _,
                clientId: z
            } = q, Y = {};
            return new ro(Object.assign(Object.assign({
                clientId: z,
                tenantId: process.env.AZURE_TENANT_ID,
                tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE
            }, Y), {
                disableInstanceDiscovery: !0
            })).getToken(_, K)
        }
    }
})
// @from(Ln 130847, Col 0)
class Fq6 {
    constructor(q, K) {
        var _, z;
        this.msiRetryConfig = {
            maxRetries: 5,
            startDelayInMs: 800,
            intervalIncrement: 2
        };
        let Y;
        if (typeof q === "string") this.clientId = q, Y = K !== null && K !== void 0 ? K : {};
        else this.clientId = q === null || q === void 0 ? void 0 : q.clientId, Y = q !== null && q !== void 0 ? q : {};
        this.resourceId = Y === null || Y === void 0 ? void 0 : Y.resourceId, this.objectId = Y === null || Y === void 0 ? void 0 : Y.objectId;
        let A = [{
            key: "clientId",
            value: this.clientId
        }, {
            key: "resourceId",
            value: this.resourceId
        }, {
            key: "objectId",
            value: this.objectId
        }].filter((w) => w.value);
        if (A.length > 1) throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}`);
        if (Y.allowInsecureConnection = !0, ((_ = Y.retryOptions) === null || _ === void 0 ? void 0 : _.maxRetries) !== void 0) this.msiRetryConfig.maxRetries = Y.retryOptions.maxRetries;
        this.identityClient = new IQ(Object.assign(Object.assign({}, Y), {
            additionalPolicies: [{
                policy: ebq(this.msiRetryConfig),
                position: "perCall"
            }]
        })), this.managedIdentityApp = new dQ({
            managedIdentityIdParams: {
                userAssignedClientId: this.clientId,
                userAssignedResourceId: this.resourceId,
                userAssignedObjectId: this.objectId
            },
            system: {
                disableInternalRetries: !0,
                networkClient: this.identityClient,
                loggerOptions: {
                    logLevel: WT8(_G8()),
                    piiLoggingEnabled: (z = Y.loggingOptions) === null || z === void 0 ? void 0 : z.enableUnsafeSupportLogging,
                    loggerCallback: PT8(sh)
                }
            }
        }), this.isAvailableIdentityClient = new IQ(Object.assign(Object.assign({}, Y), {
            retryOptions: {
                maxRetries: 0
            }
        }));
        let O = this.managedIdentityApp.getManagedIdentitySource();
        if (O === "CloudShell") {
            if (this.clientId || this.resourceId || this.objectId) throw sh.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new c4("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.")
        }
        if (O === "ServiceFabric") {
            if (this.clientId || this.resourceId || this.objectId) throw sh.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new c4(`ManagedIdentityCredential: ${Byq}`)
        }
        if (sh.info(`Using ${O} managed identity.`), A.length === 1) {
            let {
                key: w,
                value: $
            } = A[0];
            sh.info(`${O} with ${w}: ${$}`)
        }
    }
    async getToken(q, K = {}) {
        sh.getToken.info("Using the MSAL provider for Managed Identity.");
        let _ = an6(q);
        if (!_) throw new c4(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(q)}`);
        return _A.withSpan("ManagedIdentityCredential.getToken", K, async () => {
            var z;
            try {
                let Y = await Iy1.isAvailable(this.clientId),
                    A = this.managedIdentityApp.getManagedIdentitySource(),
                    O = A === "DefaultToImds" || A === "Imds";
                if (sh.getToken.info(`MSAL Identity source: ${A}`), Y) {
                    sh.getToken.info("Using the token exchange managed identity.");
                    let $ = await Iy1.getToken({
                        scopes: q,
                        clientId: this.clientId,
                        identityClient: this.identityClient,
                        retryConfig: this.msiRetryConfig,
                        resourceId: this.resourceId
                    });
                    if ($ === null) throw new c4("Attempted to use the token exchange managed identity, but received a null response.");
                    return $
                } else if (O) {
                    if (sh.getToken.info("Using the IMDS endpoint to probe for availability."), !await Zy1.isAvailable({
                            scopes: q,
                            clientId: this.clientId,
                            getTokenOptions: K,
                            identityClient: this.isAvailableIdentityClient,
                            resourceId: this.resourceId
                        })) throw new c4("Attempted to use the IMDS endpoint, but it is not available.")
                }
                sh.getToken.info("Calling into MSAL for managed identity token.");
                let w = await this.managedIdentityApp.acquireToken({
                    resource: _
                });
                return this.ensureValidMsalToken(q, w, K), sh.getToken.info(GP(q)), {
                    expiresOnTimestamp: w.expiresOn.getTime(),
                    token: w.accessToken,
                    refreshAfterTimestamp: (z = w.refreshOn) === null || z === void 0 ? void 0 : z.getTime(),
                    tokenType: "Bearer"
                }
            } catch (Y) {
                if (sh.getToken.error(YY(q, Y)), Y.name === "AuthenticationRequiredError") throw Y;
                if (Uq_(Y)) throw new c4(`ManagedIdentityCredential: Network unreachable. Message: ${Y.message}`, {
                    cause: Y
                });
                throw new c4(`ManagedIdentityCredential: Authentication failed. Message ${Y.message}`, {
                    cause: Y
                })
            }
        })
    }
    ensureValidMsalToken(q, K, _) {
        let z = (Y) => {
            return sh.getToken.info(Y), new MB({
                scopes: Array.isArray(q) ? q : [q],
                getTokenOptions: _,
                message: Y
            })
        };
        if (!K) throw z("No response.");
        if (!K.expiresOn) throw z('Response had no "expiresOn" property.');
        if (!K.accessToken) throw z('Response had no "accessToken" property.')
    }
}
// @from(Ln 130976, Col 0)
function Uq_(q) {
    if (q.errorCode === "network_error") return !0;
    if (q.code === "ENETUNREACH" || q.code === "EHOSTUNREACH") return !0;
    if (q.statusCode === 403 || q.code === 403) {
        if (q.message.includes("unreachable")) return !0
    }
    return !1
}
// @from(Ln 130984, Col 4)
sh
// @from(Ln 130985, Col 4)
xy1 = L(() => {
    Jw6();
    MT8();
    tn6();
    BW();
    DT8();
    qIq();
    rw();
    $f();
    KIq();
    LIq();
    sh = u9("ManagedIdentityCredential")
})
// @from(Ln 130999, Col 0)
function th(q) {
    return Array.isArray(q) ? q : [q]
}
// @from(Ln 131003, Col 0)
function pV6(q, K) {
    if (!q.match(/^[0-9a-zA-Z-_.:/]+$/)) {
        let _ = Error("Invalid scope was specified by the user or calling client");
        throw K.getToken.info(YY(q, _)), _
    }
}
// @from(Ln 131010, Col 0)
function TT8(q) {
    return q.replace(/\/.default$/, "")
}
// @from(Ln 131013, Col 4)
cQ = L(() => {
    rw()
})
// @from(Ln 131017, Col 0)
function uy1(q, K) {
    if (!K.match(/^[0-9a-zA-Z-._ ]+$/)) {
        let _ = Error("Invalid subscription provided. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id.");
        throw q.info(YY("", _)), _
    }
}
// @from(Ln 131023, Col 4)
hIq = L(() => {
    rw()
})
// @from(Ln 131027, Col 0)
class mr6 {
    constructor(q) {
        if (q === null || q === void 0 ? void 0 : q.tenantId) vP(tb, q === null || q === void 0 ? void 0 : q.tenantId), this.tenantId = q === null || q === void 0 ? void 0 : q.tenantId;
        if (q === null || q === void 0 ? void 0 : q.subscription) uy1(tb, q === null || q === void 0 ? void 0 : q.subscription), this.subscription = q === null || q === void 0 ? void 0 : q.subscription;
        this.additionallyAllowedTenantIds = _H(q === null || q === void 0 ? void 0 : q.additionallyAllowedTenants), this.timeout = q === null || q === void 0 ? void 0 : q.processTimeoutInMs
    }
    async getToken(q, K = {}) {
        let _ = Oj(this.tenantId, K, this.additionallyAllowedTenantIds);
        if (_) vP(tb, _);
        if (this.subscription) uy1(tb, this.subscription);
        let z = typeof q === "string" ? q : q[0];
        return tb.getToken.info(`Using the scope ${z}`), _A.withSpan(`${this.constructor.name}.getToken`, K, async () => {
            var Y, A, O, w;
            try {
                pV6(z, tb);
                let $ = TT8(z),
                    j = await RIq.getAzureCliAccessToken($, _, this.subscription, this.timeout),
                    H = (Y = j.stderr) === null || Y === void 0 ? void 0 : Y.match("(.*)az login --scope(.*)"),
                    J = ((A = j.stderr) === null || A === void 0 ? void 0 : A.match("(.*)az login(.*)")) && !H;
                if (((O = j.stderr) === null || O === void 0 ? void 0 : O.match("az:(.*)not found")) || ((w = j.stderr) === null || w === void 0 ? void 0 : w.startsWith("'az' is not recognized"))) {
                    let M = new c4("Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.");
                    throw tb.getToken.info(YY(q, M)), M
                }
                if (J) {
                    let M = new c4("Please run 'az login' from a command prompt to authenticate before using this credential.");
                    throw tb.getToken.info(YY(q, M)), M
                }
                try {
                    let M = j.stdout,
                        P = this.parseRawResponse(M);
                    return tb.getToken.info(GP(q)), P
                } catch (M) {
                    if (j.stderr) throw new c4(j.stderr);
                    throw M
                }
            } catch ($) {
                let j = $.name === "CredentialUnavailableError" ? $ : new c4($.message || "Unknown error while trying to retrieve the access token");
                throw tb.getToken.info(YY(q, j)), j
            }
        })
    }
    parseRawResponse(q) {
        let K = JSON.parse(q),
            _ = K.accessToken,
            z = Number.parseInt(K.expires_on, 10) * 1000;
        if (!isNaN(z)) return tb.getToken.info("expires_on is available and is valid, using it"), {
            token: _,
            expiresOnTimestamp: z,
            tokenType: "Bearer"
        };
        if (z = new Date(K.expiresOn).getTime(), isNaN(z)) throw new c4(`Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${K.expiresOn}"`);
        return {
            token: _,
            expiresOnTimestamp: z,
            tokenType: "Bearer"
        }
    }
}
// @from(Ln 131085, Col 4)
tb
// @from(Ln 131085, Col 8)
RIq
// @from(Ln 131086, Col 4)
my1 = L(() => {
    pW();
    rw();
    cQ();
    BW();
    $f();
    hIq();
    tb = u9("AzureCliCredential"), RIq = {
        getSafeWorkingDir() {
            if (process.platform === "win32") {
                let q = process.env.SystemRoot || process.env.SYSTEMROOT;
                if (!q) tb.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), q = "C:\\Windows";
                return q
            } else return "/bin"
        },
        async getAzureCliAccessToken(q, K, _, z) {
            let Y = [],
                A = [];
            if (K) Y = ["--tenant", K];
            if (_) A = ["--subscription", `"${_}"`];
            return new Promise((O, w) => {
                try {
                    Qq_.execFile("az", ["account", "get-access-token", "--output", "json", "--resource", q, ...Y, ...A], {
                        cwd: RIq.getSafeWorkingDir(),
                        shell: !0,
                        timeout: z
                    }, ($, j, H) => {
                        O({
                            stdout: j,
                            stderr: H,
                            error: $
                        })
                    })
                } catch ($) {
                    w($)
                }
            })
        }
    }
})
// @from(Ln 131127, Col 0)
class Br6 {
    constructor(q) {
        if (q === null || q === void 0 ? void 0 : q.tenantId) vP(oo, q === null || q === void 0 ? void 0 : q.tenantId), this.tenantId = q === null || q === void 0 ? void 0 : q.tenantId;
        this.additionallyAllowedTenantIds = _H(q === null || q === void 0 ? void 0 : q.additionallyAllowedTenants), this.timeout = q === null || q === void 0 ? void 0 : q.processTimeoutInMs
    }
    async getToken(q, K = {}) {
        let _ = Oj(this.tenantId, K, this.additionallyAllowedTenantIds);
        if (_) vP(oo, _);
        let z;
        if (typeof q === "string") z = [q];
        else z = q;
        return oo.getToken.info(`Using the scopes ${q}`), _A.withSpan(`${this.constructor.name}.getToken`, K, async () => {
            var Y, A, O, w;
            try {
                z.forEach((J) => {
                    pV6(J, oo)
                });
                let $ = await SIq.getAzdAccessToken(z, _, this.timeout),
                    j = ((Y = $.stderr) === null || Y === void 0 ? void 0 : Y.match("not logged in, run `azd login` to login")) || ((A = $.stderr) === null || A === void 0 ? void 0 : A.match("not logged in, run `azd auth login` to login"));
                if (((O = $.stderr) === null || O === void 0 ? void 0 : O.match("azd:(.*)not found")) || ((w = $.stderr) === null || w === void 0 ? void 0 : w.startsWith("'azd' is not recognized")) || $.error && $.error.code === "ENOENT") {
                    let J = new c4("Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
                    throw oo.getToken.info(YY(q, J)), J
                }
                if (j) {
                    let J = new c4("Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
                    throw oo.getToken.info(YY(q, J)), J
                }
                try {
                    let J = JSON.parse($.stdout);
                    return oo.getToken.info(GP(q)), {
                        token: J.token,
                        expiresOnTimestamp: new Date(J.expiresOn).getTime(),
                        tokenType: "Bearer"
                    }
                } catch (J) {
                    if ($.stderr) throw new c4($.stderr);
                    throw J
                }
            } catch ($) {
                let j = $.name === "CredentialUnavailableError" ? $ : new c4($.message || "Unknown error while trying to retrieve the access token");
                throw oo.getToken.info(YY(q, j)), j
            }
        })
    }
}
// @from(Ln 131172, Col 4)
oo
// @from(Ln 131172, Col 8)
SIq
// @from(Ln 131173, Col 4)
By1 = L(() => {
    rw();
    BW();
    pW();
    $f();
    cQ();
    oo = u9("AzureDeveloperCliCredential"), SIq = {
        getSafeWorkingDir() {
            if (process.platform === "win32") {
                let q = process.env.SystemRoot || process.env.SYSTEMROOT;
                if (!q) oo.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), q = "C:\\Windows";
                return q
            } else return "/bin"
        },
        async getAzdAccessToken(q, K, _) {
            let z = [];
            if (K) z = ["--tenant-id", K];
            return new Promise((Y, A) => {
                try {
                    dq_.execFile("azd", ["auth", "token", "--output", "json", ...q.reduce((O, w) => O.concat("--scope", w), []), ...z], {
                        cwd: SIq.getSafeWorkingDir(),
                        timeout: _
                    }, (O, w, $) => {
                        Y({
                            stdout: w,
                            stderr: $,
                            error: O
                        })
                    })
                } catch (O) {
                    A(O)
                }
            })
        }
    }
})
// @from(Ln 131210, Col 4)
bIq
// @from(Ln 131211, Col 4)
IIq = L(() => {
    bIq = {
        execFile(q, K, _) {
            return new Promise((z, Y) => {
                CIq.execFile(q, K, _, (A, O, w) => {
                    if (Buffer.isBuffer(O)) O = O.toString("utf8");
                    if (Buffer.isBuffer(w)) w = w.toString("utf8");
                    if (w || A) Y(w ? Error(w) : A);
                    else z(O)
                })
            })
        }
    }
})
// @from(Ln 131226, Col 0)
function mIq(q) {
    if (uIq) return `${q}.exe`;
    else return q
}
// @from(Ln 131230, Col 0)
async function xIq(q, K) {
    let _ = [];
    for (let z of q) {
        let [Y, ...A] = z, O = await bIq.execFile(Y, A, {
            encoding: "utf8",
            timeout: K
        });
        _.push(O)
    }
    return _
}
// @from(Ln 131241, Col 0)
class pr6 {
    constructor(q) {
        if (q === null || q === void 0 ? void 0 : q.tenantId) vP(ao, q === null || q === void 0 ? void 0 : q.tenantId), this.tenantId = q === null || q === void 0 ? void 0 : q.tenantId;
        this.additionallyAllowedTenantIds = _H(q === null || q === void 0 ? void 0 : q.additionallyAllowedTenants), this.timeout = q === null || q === void 0 ? void 0 : q.processTimeoutInMs
    }
    async getAzurePowerShellAccessToken(q, K, _) {
        for (let z of [...Fy1]) {
            try {
                await xIq([
                    [z, "/?"]
                ], _)
            } catch (O) {
                Fy1.shift();
                continue
            }
            let A = (await xIq([
                [z, "-NoProfile", "-NonInteractive", "-Command", `
          $tenantId = "${K!==null&&K!==void 0?K:""}"
          $m = Import-Module Az.Accounts -MinimumVersion 2.2.0 -PassThru
          $useSecureString = $m.Version -ge [version]'2.17.0'

          $params = @{
            ResourceUrl = "${q}"
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
            return nq_(A)
        }
        throw Error("Unable to execute PowerShell. Ensure that it is installed in your system")
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async () => {
            let _ = Oj(this.tenantId, K, this.additionallyAllowedTenantIds),
                z = typeof q === "string" ? q : q[0];
            if (_) vP(ao, _);
            try {
                pV6(z, ao), ao.getToken.info(`Using the scope ${z}`);
                let Y = TT8(z),
                    A = await this.getAzurePowerShellAccessToken(Y, _, this.timeout);
                return ao.getToken.info(GP(q)), {
                    token: A.Token,
                    expiresOnTimestamp: new Date(A.ExpiresOn).getTime(),
                    tokenType: "Bearer"
                }
            } catch (Y) {
                if (lq_(Y)) {
                    let O = new c4(py1.installed);
                    throw ao.getToken.info(YY(z, O)), O
                } else if (cq_(Y)) {
                    let O = new c4(py1.login);
                    throw ao.getToken.info(YY(z, O)), O
                }
                let A = new c4(`${Y}. ${py1.troubleshoot}`);
                throw ao.getToken.info(YY(z, A)), A
            }
        })
    }
}
// @from(Ln 131319, Col 0)
async function nq_(q) {
    let K = /{[^{}]*}/g,
        _ = q.match(K),
        z = q;
    if (_) try {
        for (let Y of _) try {
            let A = JSON.parse(Y);
            if (A === null || A === void 0 ? void 0 : A.Token) {
                if (z = z.replace(Y, ""), z) ao.getToken.warning(z);
                return A
            }
        } catch (A) {
            continue
        }
    } catch (Y) {
        throw Error(`Unable to parse the output of PowerShell. Received output: ${q}`)
    }
    throw Error(`No access token found in the output. Received output: ${q}`)
}
// @from(Ln 131338, Col 4)
ao
// @from(Ln 131338, Col 8)
uIq
// @from(Ln 131338, Col 13)
BIq
// @from(Ln 131338, Col 18)
py1
// @from(Ln 131338, Col 23)
cq_ = (q) => q.message.match(`(.*)${BIq.login}(.*)`)
// @from(Ln 131339, Col 4)
lq_ = (q) => q.message.match(BIq.installed)
// @from(Ln 131340, Col 4)
Fy1
// @from(Ln 131341, Col 4)
gy1 = L(() => {
    pW();
    rw();
    cQ();
    BW();
    IIq();
    $f();
    ao = u9("AzurePowerShellCredential"), uIq = process.platform === "win32";
    BIq = {
        login: "Run Connect-AzAccount to login",
        installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
    }, py1 = {
        login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
        installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
        troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
    }, Fy1 = [mIq("pwsh")];
    if (uIq) Fy1.push(mIq("powershell"))
})
// @from(Ln 131359, Col 0)
class Fr6 {
    constructor(...q) {
        this._sources = [], this._sources = q
    }
    async getToken(q, K = {}) {
        let {
            token: _
        } = await this.getTokenInternal(q, K);
        return _
    }
    async getTokenInternal(q, K = {}) {
        let _ = null,
            z, Y = [];
        return _A.withSpan("ChainedTokenCredential.getToken", K, async (A) => {
            for (let O = 0; O < this._sources.length && _ === null; O++) try {
                _ = await this._sources[O].getToken(q, A), z = this._sources[O]
            } catch (w) {
                if (w.name === "CredentialUnavailableError" || w.name === "AuthenticationRequiredError") Y.push(w);
                else throw Uy1.getToken.info(YY(q, w)), w
            }
            if (!_ && Y.length > 0) {
                let O = new In6(Y, "ChainedTokenCredential authentication failed.");
                throw Uy1.getToken.info(YY(q, O)), O
            }
            if (Uy1.getToken.info(`Result for ${z.constructor.name}: ${GP(q)}`), _ === null) throw new c4("Failed to retrieve a valid token");
            return {
                token: _,
                successfulCredential: z
            }
        })
    }
}
// @from(Ln 131391, Col 4)
Uy1
// @from(Ln 131392, Col 4)
Qy1 = L(() => {
    BW();
    rw();
    $f();
    Uy1 = u9("ChainedTokenCredential")
})
// @from(Ln 131405, Col 0)
class Ur6 {
    constructor(q, K, _, z = {}) {
        if (!q || !K) throw Error(`${gr6}: tenantId and clientId are required parameters.`);
        this.tenantId = q, this.additionallyAllowedTenantIds = _H(z === null || z === void 0 ? void 0 : z.additionallyAllowedTenants), this.sendCertificateChain = z.sendCertificateChain, this.certificateConfiguration = Object.assign({}, typeof _ === "string" ? {
            certificatePath: _
        } : _);
        let Y = this.certificateConfiguration.certificate,
            A = this.certificateConfiguration.certificatePath;
        if (!this.certificateConfiguration || !(Y || A)) throw Error(`${gr6}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (Y && A) throw Error(`${gr6}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        this.msalClient = uv(K, q, Object.assign(Object.assign({}, z), {
            logger: FIq,
            tokenCredentialOptions: z
        }))
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${gr6}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, FIq);
            let z = Array.isArray(q) ? q : [q],
                Y = await this.buildClientCertificate();
            return this.msalClient.getTokenByClientCertificate(z, Y, _)
        })
    }
    async buildClientCertificate() {
        var q;
        let K = await oq_(this.certificateConfiguration, (q = this.sendCertificateChain) !== null && q !== void 0 ? q : !1),
            _;
        if (this.certificateConfiguration.certificatePassword !== void 0) _ = iq_({
            key: K.certificateContents,
            passphrase: this.certificateConfiguration.certificatePassword,
            format: "pem"
        }).export({
            format: "pem",
            type: "pkcs8"
        }).toString();
        else _ = K.certificateContents;
        return {
            thumbprint: K.thumbprint,
            thumbprintSha256: K.thumbprintSha256,
            privateKey: _,
            x5c: K.x5c
        }
    }
}
// @from(Ln 131449, Col 0)
async function oq_(q, K) {
    let {
        certificate: _,
        certificatePath: z
    } = q, Y = _ || await rq_(z, "utf8"), A = K ? Y : void 0, O = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, w = [], $;
    do
        if ($ = O.exec(Y), $) w.push($[3]); while ($);
    if (w.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
    let j = pIq("sha1").update(Buffer.from(w[0], "base64")).digest("hex").toUpperCase(),
        H = pIq("sha256").update(Buffer.from(w[0], "base64")).digest("hex").toUpperCase();
    return {
        certificateContents: Y,
        thumbprintSha256: H,
        thumbprint: j,
        x5c: A
    }
}
// @from(Ln 131466, Col 4)
gr6 = "ClientCertificateCredential"
// @from(Ln 131467, Col 4)
FIq
// @from(Ln 131468, Col 4)
dy1 = L(() => {
    io();
    pW();
    rw();
    $f();
    FIq = u9(gr6)
})
// @from(Ln 131475, Col 0)
class Qr6 {
    constructor(q, K, _, z = {}) {
        if (!q) throw new c4("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        if (!K) throw new c4("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        if (!_) throw new c4("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        this.clientSecret = _, this.tenantId = q, this.additionallyAllowedTenantIds = _H(z === null || z === void 0 ? void 0 : z.additionallyAllowedTenants), this.msalClient = uv(K, q, Object.assign(Object.assign({}, z), {
            logger: gIq,
            tokenCredentialOptions: z
        }))
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, gIq);
            let z = th(q);
            return this.msalClient.getTokenByClientSecret(z, this.clientSecret, _)
        })
    }
}
// @from(Ln 131493, Col 4)
gIq
// @from(Ln 131494, Col 4)
cy1 = L(() => {
    io();
    pW();
    BW();
    rw();
    cQ();
    $f();
    gIq = u9("ClientSecretCredential")
})
// @from(Ln 131503, Col 0)
class dr6 {
    constructor(q, K, _, z, Y = {}) {
        if (!q) throw new c4("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!K) throw new c4("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!_) throw new c4("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!z) throw new c4("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        this.tenantId = q, this.additionallyAllowedTenantIds = _H(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.username = _, this.password = z, this.msalClient = uv(K, this.tenantId, Object.assign(Object.assign({}, Y), {
            tokenCredentialOptions: Y !== null && Y !== void 0 ? Y : {}
        }))
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, aq_);
            let z = th(q);
            return this.msalClient.getTokenByUsernamePassword(z, this.username, this.password, _)
        })
    }
}
// @from(Ln 131521, Col 4)
aq_
// @from(Ln 131522, Col 4)
ly1 = L(() => {
    io();
    pW();
    BW();
    rw();
    cQ();
    $f();
    aq_ = u9("UsernamePasswordCredential")
})
// @from(Ln 131532, Col 0)
function tq_() {
    var q;
    return ((q = process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS) !== null && q !== void 0 ? q : "").split(";")
}
// @from(Ln 131537, Col 0)
function eq_() {
    var q;
    let K = ((q = process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN) !== null && q !== void 0 ? q : "").toLowerCase(),
        _ = K === "true" || K === "1";
    return so.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${_}`), _
}
// @from(Ln 131543, Col 0)
class cr6 {
    constructor(q) {
        this._credential = void 0;
        let K = zG8(sq_).assigned.join(", ");
        so.info(`Found the following environment variables: ${K}`);
        let _ = process.env.AZURE_TENANT_ID,
            z = process.env.AZURE_CLIENT_ID,
            Y = process.env.AZURE_CLIENT_SECRET,
            A = tq_(),
            O = eq_(),
            w = Object.assign(Object.assign({}, q), {
                additionallyAllowedTenantIds: A,
                sendCertificateChain: O
            });
        if (_) vP(so, _);
        if (_ && z && Y) {
            so.info(`Invoking ClientSecretCredential with tenant ID: ${_}, clientId: ${z} and clientSecret: [REDACTED]`), this._credential = new Qr6(_, z, Y, w);
            return
        }
        let $ = process.env.AZURE_CLIENT_CERTIFICATE_PATH,
            j = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
        if (_ && z && $) {
            so.info(`Invoking ClientCertificateCredential with tenant ID: ${_}, clientId: ${z} and certificatePath: ${$}`), this._credential = new Ur6(_, z, {
                certificatePath: $,
                certificatePassword: j
            }, w);
            return
        }
        let H = process.env.AZURE_USERNAME,
            J = process.env.AZURE_PASSWORD;
        if (_ && z && H && J) so.info(`Invoking UsernamePasswordCredential with tenant ID: ${_}, clientId: ${z} and username: ${H}`), so.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new dr6(_, z, H, J, w)
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${VT8}.getToken`, K, async (_) => {
            if (this._credential) try {
                let z = await this._credential.getToken(q, _);
                return so.getToken.info(GP(q)), z
            } catch (z) {
                let Y = new XB(400, {
                    error: `${VT8} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
                    error_description: z.message.toString().split("More details:").join("")
                });
                throw so.getToken.info(YY(q, Y)), Y
            }
            throw new c4(`${VT8} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`)
        })
    }
}
// @from(Ln 131591, Col 4)
sq_
// @from(Ln 131591, Col 9)
VT8 = "EnvironmentCredential"
// @from(Ln 131592, Col 4)
so
// @from(Ln 131593, Col 4)
ny1 = L(() => {
    BW();
    rw();
    dy1();
    cy1();
    ly1();
    pW();
    $f();
    sq_ = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "AZURE_CLIENT_CERTIFICATE_PASSWORD", "AZURE_USERNAME", "AZURE_PASSWORD", "AZURE_ADDITIONALLY_ALLOWED_TENANTS", "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"];
    so = u9(VT8)
})
// @from(Ln 131605, Col 0)
function q4_(q = {}) {
    var K, _, z, Y;
    (K = q.retryOptions) !== null && K !== void 0 || (q.retryOptions = {
        maxRetries: 5,
        retryDelayInMs: 800
    });
    let A = (_ = q === null || q === void 0 ? void 0 : q.managedIdentityClientId) !== null && _ !== void 0 ? _ : process.env.AZURE_CLIENT_ID,
        O = (z = q === null || q === void 0 ? void 0 : q.workloadIdentityClientId) !== null && z !== void 0 ? z : A,
        w = q === null || q === void 0 ? void 0 : q.managedIdentityResourceId,
        $ = process.env.AZURE_FEDERATED_TOKEN_FILE,
        j = (Y = q === null || q === void 0 ? void 0 : q.tenantId) !== null && Y !== void 0 ? Y : process.env.AZURE_TENANT_ID;
    if (w) {
        let H = Object.assign(Object.assign({}, q), {
            resourceId: w
        });
        return new Fq6(H)
    }
    if ($ && O) {
        let H = Object.assign(Object.assign({}, q), {
            tenantId: j
        });
        return new Fq6(O, H)
    }
    if (A) {
        let H = Object.assign(Object.assign({}, q), {
            clientId: A
        });
        return new Fq6(H)
    }
    return new Fq6(q)
}
// @from(Ln 131637, Col 0)
function K4_(q) {
    var K, _, z;
    let Y = (K = q === null || q === void 0 ? void 0 : q.managedIdentityClientId) !== null && K !== void 0 ? K : process.env.AZURE_CLIENT_ID,
        A = (_ = q === null || q === void 0 ? void 0 : q.workloadIdentityClientId) !== null && _ !== void 0 ? _ : Y,
        O = process.env.AZURE_FEDERATED_TOKEN_FILE,
        w = (z = q === null || q === void 0 ? void 0 : q.tenantId) !== null && z !== void 0 ? z : process.env.AZURE_TENANT_ID;
    if (O && A) {
        let $ = Object.assign(Object.assign({}, q), {
            tenantId: w,
            clientId: A,
            tokenFilePath: O
        });
        return new ro($)
    }
    if (w) {
        let $ = Object.assign(Object.assign({}, q), {
            tenantId: w
        });
        return new ro($)
    }
    return new ro(q)
}
// @from(Ln 131660, Col 0)
function _4_(q = {}) {
    let K = q.processTimeoutInMs;
    return new Br6(Object.assign({
        processTimeoutInMs: K
    }, q))
}
// @from(Ln 131667, Col 0)
function z4_(q = {}) {
    let K = q.processTimeoutInMs;
    return new mr6(Object.assign({
        processTimeoutInMs: K
    }, q))
}
// @from(Ln 131674, Col 0)
function Y4_(q = {}) {
    let K = q.processTimeoutInMs;
    return new pr6(Object.assign({
        processTimeoutInMs: K
    }, q))
}
// @from(Ln 131681, Col 0)
function A4_(q = {}) {
    return new cr6(q)
}
// @from(Ln 131684, Col 0)
class UIq {
    constructor(q, K) {
        this.credentialName = q, this.credentialUnavailableErrorMessage = K
    }
    getToken() {
        return iy1.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null)
    }
}
// @from(Ln 131692, Col 4)
iy1
// @from(Ln 131692, Col 9)
lr6
// @from(Ln 131693, Col 4)
ry1 = L(() => {
    xy1();
    my1();
    By1();
    gy1();
    Qy1();
    ny1();
    vT8();
    rw();
    iy1 = u9("DefaultAzureCredential");
    lr6 = class lr6 extends Fr6 {
        constructor(q) {
            let K = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0,
                _ = [z4_, Y4_, _4_],
                z = [A4_, K4_, q4_],
                Y = [];
            if (K) switch (K) {
                case "dev":
                    Y = _;
                    break;
                case "prod":
                    Y = z;
                    break;
                default: {
                    let O = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev'.`;
                    throw iy1.warning(O), Error(O)
                }
            } else Y = [...z, ..._];
            let A = Y.map((O) => {
                try {
                    return O(q)
                } catch (w) {
                    return iy1.warning(`Skipped ${O.name} because of an error creating the credential: ${w}`), new UIq(O.name, w.message)
                }
            });
            super(...A)
        }
    }
})
// @from(Ln 131732, Col 0)
class ay1 {
    constructor(q) {
        var K, _, z, Y, A;
        this.tenantId = rT6(oy1, q.tenantId, q.clientId), this.additionallyAllowedTenantIds = _H(q === null || q === void 0 ? void 0 : q.additionallyAllowedTenants);
        let O = Object.assign(Object.assign({}, q), {
                tokenCredentialOptions: q,
                logger: oy1
            }),
            w = q;
        if (this.browserCustomizationOptions = w.browserCustomizationOptions, this.loginHint = w.loginHint, (K = w === null || w === void 0 ? void 0 : w.brokerOptions) === null || K === void 0 ? void 0 : K.enabled)
            if (!((_ = w === null || w === void 0 ? void 0 : w.brokerOptions) === null || _ === void 0 ? void 0 : _.parentWindowHandle)) throw Error("In order to do WAM authentication, `parentWindowHandle` under `brokerOptions` is a required parameter");
            else O.brokerOptions = {
                enabled: !0,
                parentWindowHandle: w.brokerOptions.parentWindowHandle,
                legacyEnableMsaPassthrough: (z = w.brokerOptions) === null || z === void 0 ? void 0 : z.legacyEnableMsaPassthrough,
                useDefaultBrokerAccount: (Y = w.brokerOptions) === null || Y === void 0 ? void 0 : Y.useDefaultBrokerAccount
            };
        this.msalClient = uv((A = q.clientId) !== null && A !== void 0 ? A : Hw6, this.tenantId, O), this.disableAutomaticAuthentication = q === null || q === void 0 ? void 0 : q.disableAutomaticAuthentication
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, oy1);
            let z = th(q);
            return this.msalClient.getTokenByInteractiveRequest(z, Object.assign(Object.assign({}, _), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication,
                browserCustomizationOptions: this.browserCustomizationOptions,
                loginHint: this.loginHint
            }))
        })
    }
    async authenticate(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.authenticate`, K, async (_) => {
            let z = th(q);
            return await this.msalClient.getTokenByInteractiveRequest(z, Object.assign(Object.assign({}, _), {
                disableAutomaticAuthentication: !1,
                browserCustomizationOptions: this.browserCustomizationOptions,
                loginHint: this.loginHint
            })), this.msalClient.getActiveAccount()
        })
    }
}
// @from(Ln 131773, Col 4)
oy1
// @from(Ln 131774, Col 4)
QIq = L(() => {
    pW();
    rw();
    cQ();
    $f();
    io();
    LQ();
    oy1 = u9("InteractiveBrowserCredential")
})
// @from(Ln 131784, Col 0)
function O4_(q) {
    console.log(q.message)
}
// @from(Ln 131787, Col 0)
class ty1 {
    constructor(q) {
        var K, _;
        this.tenantId = q === null || q === void 0 ? void 0 : q.tenantId, this.additionallyAllowedTenantIds = _H(q === null || q === void 0 ? void 0 : q.additionallyAllowedTenants);
        let z = (K = q === null || q === void 0 ? void 0 : q.clientId) !== null && K !== void 0 ? K : Hw6,
            Y = rT6(sy1, q === null || q === void 0 ? void 0 : q.tenantId, z);
        this.userPromptCallback = (_ = q === null || q === void 0 ? void 0 : q.userPromptCallback) !== null && _ !== void 0 ? _ : O4_, this.msalClient = uv(z, Y, Object.assign(Object.assign({}, q), {
            logger: sy1,
            tokenCredentialOptions: q || {}
        })), this.disableAutomaticAuthentication = q === null || q === void 0 ? void 0 : q.disableAutomaticAuthentication
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, sy1);
            let z = th(q);
            return this.msalClient.getTokenByDeviceCode(z, this.userPromptCallback, Object.assign(Object.assign({}, _), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication
            }))
        })
    }
    async authenticate(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.authenticate`, K, async (_) => {
            let z = Array.isArray(q) ? q : [q];
            return await this.msalClient.getTokenByDeviceCode(z, this.userPromptCallback, Object.assign(Object.assign({}, _), {
                disableAutomaticAuthentication: !1
            })), this.msalClient.getActiveAccount()
        })
    }
}
// @from(Ln 131816, Col 4)
sy1
// @from(Ln 131817, Col 4)
dIq = L(() => {
    pW();
    rw();
    cQ();
    $f();
    io();
    LQ();
    sy1 = u9("DeviceCodeCredential")
})
// @from(Ln 131826, Col 0)
class ey1 {
    constructor(q, K, _, z, Y = {}) {
        var A, O;
        if (!K) throw new c4(`${kB}: is unavailable. clientId is a required parameter.`);
        if (!q) throw new c4(`${kB}: is unavailable. tenantId is a required parameter.`);
        if (!_) throw new c4(`${kB}: is unavailable. serviceConnectionId is a required parameter.`);
        if (!z) throw new c4(`${kB}: is unavailable. systemAccessToken is a required parameter.`);
        if (Y.loggingOptions = Object.assign(Object.assign({}, Y === null || Y === void 0 ? void 0 : Y.loggingOptions), {
                additionalAllowedHeaderNames: [...(O = (A = Y.loggingOptions) === null || A === void 0 ? void 0 : A.additionalAllowedHeaderNames) !== null && O !== void 0 ? O : [], "x-vss-e2eid", "x-msedge-ref"]
            }), this.identityClient = new IQ(Y), vP(eb, q), eb.info(`Invoking AzurePipelinesCredential with tenant ID: ${q}, client ID: ${K}, and service connection ID: ${_}`), !process.env.SYSTEM_OIDCREQUESTURI) throw new c4(`${kB}: is unavailable. Ensure that you're running this task in an Azure Pipeline, so that following missing system variable(s) can be defined- "SYSTEM_OIDCREQUESTURI"`);
        let w = `${process.env.SYSTEM_OIDCREQUESTURI}?api-version=${w4_}&serviceConnectionId=${_}`;
        eb.info(`Invoking ClientAssertionCredential with tenant ID: ${q}, client ID: ${K} and service connection ID: ${_}`), this.clientAssertionCredential = new v26(q, K, this.requestOidcToken.bind(this, w, z), Y)
    }
    async getToken(q, K) {
        if (!this.clientAssertionCredential) {
            let _ = `${kB}: is unavailable. To use Federation Identity in Azure Pipelines, the following parameters are required - 
      tenantId,
      clientId,
      serviceConnectionId,
      systemAccessToken,
      "SYSTEM_OIDCREQUESTURI".      
      See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
            throw eb.error(_), new c4(_)
        }
        return eb.info("Invoking getToken() of Client Assertion Credential"), this.clientAssertionCredential.getToken(q, K)
    }
    async requestOidcToken(q, K) {
        eb.info("Requesting OIDC token from Azure Pipelines..."), eb.info(q);
        let _ = nh({
                url: q,
                method: "POST",
                headers: No({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${K}`,
                    "X-TFS-FedAuthRedirect": "Suppress"
                })
            }),
            z = await this.identityClient.sendRequest(_);
        return $4_(z)
    }
}
// @from(Ln 131868, Col 0)
function $4_(q) {
    let K = q.bodyAsText;
    if (!K) throw eb.error(`${kB}: Authentication Failed. Received null token from OIDC request. Response status- ${q.status}. Complete response - ${JSON.stringify(q)}`), new XB(q.status, {
        error: `${kB}: Authentication Failed. Received null token from OIDC request.`,
        error_description: `${JSON.stringify(q)}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
    });
    try {
        let _ = JSON.parse(K);
        if (_ === null || _ === void 0 ? void 0 : _.oidcToken) return _.oidcToken;
        else {
            let z = `${kB}: Authentication Failed. oidcToken field not detected in the response.`,
                Y = "";
            if (q.status !== 200) Y = `Response body = ${K}. Response Headers ["x-vss-e2eid"] = ${q.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] = ${q.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
            throw eb.error(z), eb.error(Y), new XB(q.status, {
                error: z,
                error_description: Y
            })
        }
    } catch (_) {
        let z = `${kB}: Authentication Failed. oidcToken field not detected in the response.`;
        throw eb.error(`Response from service = ${K}, Response Headers ["x-vss-e2eid"] = ${q.headers.get("x-vss-e2eid")} 
      and ["x-msedge-ref"] = ${q.headers.get("x-msedge-ref")}, error message = ${_.message}`), eb.error(z), new XB(q.status, {
            error: z,
            error_description: `Response = ${K}. Response headers ["x-vss-e2eid"] = ${q.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] =  ${q.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
        })
    }
}
// @from(Ln 131895, Col 4)
kB = "AzurePipelinesCredential"
// @from(Ln 131896, Col 4)
eb
// @from(Ln 131896, Col 8)
w4_ = "7.1"
// @from(Ln 131897, Col 4)
cIq = L(() => {
    BW();
    CQ();
    GT8();
    tn6();
    pW();
    rw();
    eb = u9(kB)
})
// @from(Ln 131906, Col 0)
class qL1 {
    constructor(q, K, _, z, Y, A) {
        if (vP(lIq, q), this.clientSecret = _, typeof Y === "string") this.authorizationCode = z, this.redirectUri = Y;
        else this.authorizationCode = _, this.redirectUri = z, this.clientSecret = void 0, A = Y;
        this.tenantId = q, this.additionallyAllowedTenantIds = _H(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.msalClient = uv(K, q, Object.assign(Object.assign({}, A), {
            logger: lIq,
            tokenCredentialOptions: A !== null && A !== void 0 ? A : {}
        }))
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${this.constructor.name}.getToken`, K, async (_) => {
            let z = Oj(this.tenantId, _, this.additionallyAllowedTenantIds);
            _.tenantId = z;
            let Y = th(q);
            return this.msalClient.getTokenByAuthorizationCode(Y, this.redirectUri, this.authorizationCode, this.clientSecret, Object.assign(Object.assign({}, _), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication
            }))
        })
    }
}
// @from(Ln 131926, Col 4)
lIq
// @from(Ln 131927, Col 4)
nIq = L(() => {
    pW();
    pW();
    rw();
    cQ();
    $f();
    io();
    lIq = u9("AuthorizationCodeCredential")
})