
// @from(Ln 174279, Col 4)
TD8 = E(() => {
    vB7();
    cH1();
    kB7();
    jU();
    jU();
    Jx6();
    fD8 = class fD8 extends kC {
        constructor({
            baseURL: A = iH1("ANTHROPIC_FOUNDRY_BASE_URL"),
            apiKey: q = iH1("ANTHROPIC_FOUNDRY_API_KEY"),
            resource: K = iH1("ANTHROPIC_FOUNDRY_RESOURCE"),
            azureADTokenProvider: Y,
            dangerouslyAllowBrowser: z,
            ..._
        } = {}) {
            if (typeof Y === "function") z = !0;
            if (!Y && !q) throw new n7("Missing credentials. Please pass one of `apiKey` and `azureTokenProvider`, or set the `ANTHROPIC_FOUNDRY_API_KEY` environment variable.");
            if (Y && q) throw new n7("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
            if (!A) {
                if (!K) throw new n7("Must provide one of the `baseURL` or `resource` arguments, or the `ANTHROPIC_FOUNDRY_RESOURCE` environment variable");
                A = `https://${K}.services.ai.azure.com/anthropic/`
            } else if (K) throw new n7("baseURL and resource are mutually exclusive");
            super({
                apiKey: Y ?? q,
                baseURL: A,
                ..._,
                ...z !== void 0 ? {
                    dangerouslyAllowBrowser: z
                } : {}
            });
            this.resource = null, this.messages = gK9(this), this.beta = FK9(this), this.models = void 0
        }
        async authHeaders() {
            if (typeof this._options.apiKey === "function") {
                let A;
                try {
                    A = await this._options.apiKey()
                } catch (q) {
                    if (q instanceof n7) throw q;
                    throw new n7(`Failed to get token from azureADTokenProvider: ${q.message}`, {
                        cause: q
                    })
                }
                if (typeof A !== "string" || !A) throw new n7(`Expected azureADTokenProvider function argument to return a string but it returned ${A}`);
                return GD8([{
                    Authorization: `Bearer ${A}`
                }])
            }
            if (typeof this._options.apiKey === "string") return GD8([{
                "x-api-key": this.apiKey
            }]);
            return
        }
        validateHeaders() {
            return
        }
    }
})
// @from(Ln 174338, Col 4)
EB7 = {}
// @from(Ln 174344, Col 4)
yB7 = E(() => {
    TD8();
    TD8()
})
// @from(Ln 174348, Col 4)
nH1 = "4.10.1"
// @from(Ln 174349, Col 4)
gK6 = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
// @from(Ln 174350, Col 4)
LB7 = "common"
// @from(Ln 174351, Col 4)
mm
// @from(Ln 174351, Col 8)
Mm6
// @from(Ln 174351, Col 13)
RB7 = "login.microsoftonline.com"
// @from(Ln 174352, Col 4)
hB7
// @from(Ln 174352, Col 9)
SB7 = "cae"
// @from(Ln 174353, Col 4)
CB7 = "nocae"
// @from(Ln 174354, Col 4)
IB7 = "msal.cache"
// @from(Ln 174355, Col 4)
Bm = E(() => {
    (function(A) {
        A.AzureChina = "https://login.chinacloudapi.cn", A.AzureGermany = "https://login.microsoftonline.de", A.AzureGovernment = "https://login.microsoftonline.us", A.AzurePublicCloud = "https://login.microsoftonline.com"
    })(mm || (mm = {}));
    Mm6 = mm.AzurePublicCloud, hB7 = ["*"]
})
// @from(Ln 174362, Col 0)
function pK9(A) {
    var q, K, Y, z, _, w, O;
    let $ = {
        cache: {},
        broker: {
            isEnabled: (K = (q = A.brokerOptions) === null || q === void 0 ? void 0 : q.enabled) !== null && K !== void 0 ? K : !1,
            enableMsaPassthrough: (z = (Y = A.brokerOptions) === null || Y === void 0 ? void 0 : Y.legacyEnableMsaPassthrough) !== null && z !== void 0 ? z : !1,
            parentWindowHandle: (_ = A.brokerOptions) === null || _ === void 0 ? void 0 : _.parentWindowHandle
        }
    };
    if ((w = A.tokenCachePersistenceOptions) === null || w === void 0 ? void 0 : w.enabled) {
        if (rH1 === void 0) throw Error(["Persistent token caching was requested, but no persistence provider was configured.", "You must install the identity-cache-persistence plugin package (`npm install --save @azure/identity-cache-persistence`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(cachePersistencePlugin)` before using `tokenCachePersistenceOptions`."].join(" "));
        let H = A.tokenCachePersistenceOptions.name || IB7;
        $.cache.cachePlugin = rH1(Object.assign({
            name: `${H}.${CB7}`
        }, A.tokenCachePersistenceOptions)), $.cache.cachePluginCae = rH1(Object.assign({
            name: `${H}.${SB7}`
        }, A.tokenCachePersistenceOptions))
    }
    if ((O = A.brokerOptions) === null || O === void 0 ? void 0 : O.enabled) {
        if (vD8 === void 0) throw Error(["Broker for WAM was requested to be enabled, but no native broker was configured.", "You must install the identity-broker plugin package (`npm install --save @azure/identity-broker`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(createNativeBrokerPlugin())` before using `enableBroker`."].join(" "));
        $.broker.nativeBrokerPlugin = vD8.broker
    }
    return $
}
// @from(Ln 174387, Col 4)
rH1 = void 0
// @from(Ln 174388, Col 4)
bB7
// @from(Ln 174388, Col 9)
vD8 = void 0
// @from(Ln 174389, Col 4)
xB7
// @from(Ln 174389, Col 9)
uB7
// @from(Ln 174390, Col 4)
ND8 = E(() => {
    Bm();
    bB7 = {
        setPersistence(A) {
            rH1 = A
        }
    }, xB7 = {
        setNativeBroker(A) {
            vD8 = {
                broker: A
            }
        }
    };
    uB7 = {
        generatePluginConfiguration: pK9
    }
})
// @from(Ln 174413, Col 0)
function BB7(A, ...q) {
    mB7.stderr.write(`${UK9.format(A,...q)}${QK9}`)
}
// @from(Ln 174416, Col 4)
gB7 = () => {}
// @from(Ln 174418, Col 0)
function ED8(A) {
    pB7 = A, VD8 = [], kD8 = [];
    let q = /\*/g,
        K = A.split(",").map((Y) => Y.trim().replace(q, ".*?"));
    for (let Y of K)
        if (Y.startsWith("-")) kD8.push(new RegExp(`^${Y.substr(1)}$`));
        else VD8.push(new RegExp(`^${Y}$`));
    for (let Y of oH1) Y.enabled = yD8(Y.namespace)
}
// @from(Ln 174428, Col 0)
function yD8(A) {
    if (A.endsWith("*")) return !0;
    for (let q of kD8)
        if (q.test(A)) return !1;
    for (let q of VD8)
        if (q.test(A)) return !0;
    return !1
}
// @from(Ln 174437, Col 0)
function dK9() {
    let A = pB7 || "";
    return ED8(""), A
}
// @from(Ln 174442, Col 0)
function UB7(A) {
    let q = Object.assign(K, {
        enabled: yD8(A),
        destroy: cK9,
        log: QB7.log,
        namespace: A,
        extend: lK9
    });

    function K(...Y) {
        if (!q.enabled) return;
        if (Y.length > 0) Y[0] = `${A} ${Y[0]}`;
        q.log(...Y)
    }
    return oH1.push(q), q
}
// @from(Ln 174459, Col 0)
function cK9() {
    let A = oH1.indexOf(this);
    if (A >= 0) return oH1.splice(A, 1), !0;
    return !1
}
// @from(Ln 174465, Col 0)
function lK9(A) {
    let q = UB7(`${this.namespace}:${A}`);
    return q.log = this.log, q
}
// @from(Ln 174469, Col 4)
FB7
// @from(Ln 174469, Col 9)
pB7
// @from(Ln 174469, Col 14)
VD8
// @from(Ln 174469, Col 19)
kD8
// @from(Ln 174469, Col 24)
oH1
// @from(Ln 174469, Col 29)
QB7
// @from(Ln 174469, Col 34)
YP6
// @from(Ln 174470, Col 4)
dB7 = E(() => {
    gB7();
    FB7 = typeof process < "u" && process.env && process.env.DEBUG || void 0, VD8 = [], kD8 = [], oH1 = [];
    if (FB7) ED8(FB7);
    QB7 = Object.assign((A) => {
        return UB7(A)
    }, {
        enable: ED8,
        enabled: yD8,
        disable: dK9,
        log: BB7
    });
    YP6 = QB7
})
// @from(Ln 174485, Col 0)
function lB7(A, q) {
    q.log = (...K) => {
        A.log(...K)
    }
}
// @from(Ln 174491, Col 0)
function iB7(A) {
    return LD8.includes(A)
}
// @from(Ln 174495, Col 0)
function aH1(A) {
    let q = new Set,
        K = typeof process < "u" && process.env && process.env[A.logLevelEnvVarName] || void 0,
        Y, z = YP6(A.namespace);
    z.log = (...j) => {
        YP6.log(...j)
    };

    function _(j) {
        if (j && !iB7(j)) throw Error(`Unknown log level '${j}'. Acceptable values: ${LD8.join(",")}`);
        Y = j;
        let J = [];
        for (let M of q)
            if (w(M)) J.push(M.namespace);
        YP6.enable(J.join(","))
    }
    if (K)
        if (iB7(K)) _(K);
        else console.error(`${A.logLevelEnvVarName} set to unknown log level '${K}'; logging is not enabled. Acceptable values: ${LD8.join(", ")}.`);

    function w(j) {
        return Boolean(Y && cB7[j.level] <= cB7[Y])
    }

    function O(j, J) {
        let M = Object.assign(j.extend(J), {
            level: J
        });
        if (lB7(j, M), w(M)) {
            let D = YP6.disable();
            YP6.enable(D + "," + M.namespace)
        }
        return q.add(M), M
    }

    function $() {
        return Y
    }

    function H(j) {
        let J = z.extend(j);
        return lB7(z, J), {
            error: O(J, "error"),
            warning: O(J, "warning"),
            info: O(J, "info"),
            verbose: O(J, "verbose")
        }
    }
    return {
        setLogLevel: _,
        getLogLevel: $,
        createClientLogger: H,
        logger: z
    }
}
// @from(Ln 174551, Col 0)
function sH1(A) {
    return nB7.createClientLogger(A)
}
// @from(Ln 174554, Col 4)
LD8
// @from(Ln 174554, Col 9)
cB7
// @from(Ln 174554, Col 14)
nB7
// @from(Ln 174554, Col 19)
B_2
// @from(Ln 174555, Col 4)
tH1 = E(() => {
    dB7();
    LD8 = ["verbose", "info", "warning", "error"], cB7 = {
        verbose: 400,
        info: 300,
        warning: 200,
        error: 100
    };
    nB7 = aH1({
        logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
        namespace: "typeSpecRuntime"
    }), B_2 = nB7.logger
})
// @from(Ln 174568, Col 4)
rB7 = E(() => {
    tH1()
})
// @from(Ln 174572, Col 0)
function eH1() {
    return RD8.getLogLevel()
}
// @from(Ln 174576, Col 0)
function Vs(A) {
    return RD8.createClientLogger(A)
}
// @from(Ln 174579, Col 4)
RD8
// @from(Ln 174579, Col 9)
U_2
// @from(Ln 174580, Col 4)
FK6 = E(() => {
    rB7();
    RD8 = aH1({
        logLevelEnvVarName: "AZURE_LOG_LEVEL",
        namespace: "azure"
    }), U_2 = RD8.logger
})
// @from(Ln 174588, Col 0)
function Aj1(A) {
    return A.reduce((q, K) => {
        if (process.env[K]) q.assigned.push(K);
        else q.missing.push(K);
        return q
    }, {
        missing: [],
        assigned: []
    })
}
// @from(Ln 174599, Col 0)
function UJ(A) {
    return `SUCCESS. Scopes: ${Array.isArray(A)?A.join(", "):A}.`
}
// @from(Ln 174603, Col 0)
function d9(A, q) {
    let K = "ERROR.";
    if (A === null || A === void 0 ? void 0 : A.length) K += ` Scopes: ${Array.isArray(A)?A.join(", "):A}.`;
    return `${K} Error message: ${typeof q==="string"?q:q.message}.`
}
// @from(Ln 174609, Col 0)
function oB7(A, q, K = Tv) {
    let Y = q ? `${q.fullTitle} ${A}` : A;

    function z($) {
        K.info(`${Y} =>`, $)
    }

    function _($) {
        K.warning(`${Y} =>`, $)
    }

    function w($) {
        K.verbose(`${Y} =>`, $)
    }

    function O($) {
        K.error(`${Y} =>`, $)
    }
    return {
        title: A,
        fullTitle: Y,
        info: z,
        warning: _,
        verbose: w,
        error: O
    }
}
// @from(Ln 174637, Col 0)
function h5(A, q = Tv) {
    let K = oB7(A, void 0, q);
    return Object.assign(Object.assign({}, K), {
        parent: q,
        getToken: oB7("=> getToken()", K, q)
    })
}
// @from(Ln 174644, Col 4)
Tv
// @from(Ln 174645, Col 4)
H2 = E(() => {
    FK6();
    Tv = Vs("identity")
})
// @from(Ln 174650, Col 0)
function iK9(A) {
    return A && typeof A.error === "string" && typeof A.error_description === "string"
}
// @from(Ln 174654, Col 0)
function aB7(A) {
    return {
        error: A.error,
        errorDescription: A.error_description,
        correlationId: A.correlation_id,
        errorCodes: A.error_codes,
        timestamp: A.timestamp,
        traceId: A.trace_id
    }
}
// @from(Ln 174664, Col 4)
hD8 = "CredentialUnavailableError"
// @from(Ln 174665, Col 4)
D4
// @from(Ln 174665, Col 8)
Dm6 = "AuthenticationError"
// @from(Ln 174666, Col 4)
dC
// @from(Ln 174666, Col 8)
SD8 = "AggregateAuthenticationError"
// @from(Ln 174667, Col 4)
Xm6
// @from(Ln 174667, Col 9)
cC
// @from(Ln 174668, Col 4)
pM = E(() => {
    D4 = class D4 extends Error {
        constructor(A, q) {
            super(A, q);
            this.name = hD8
        }
    };
    dC = class dC extends Error {
        constructor(A, q, K) {
            let Y = {
                error: "unknown",
                errorDescription: "An unknown error occurred and no additional details are available."
            };
            if (iK9(q)) Y = aB7(q);
            else if (typeof q === "string") try {
                let z = JSON.parse(q);
                Y = aB7(z)
            } catch (z) {
                if (A === 400) Y = {
                    error: "invalid_request",
                    errorDescription: `The service indicated that the request was invalid.

${q}`
                };
                else Y = {
                    error: "unknown_error",
                    errorDescription: `An unknown error has occurred. Response body:

${q}`
                }
            } else Y = {
                error: "unknown_error",
                errorDescription: "An unknown error occurred and no additional details are available."
            };
            super(`${Y.error} Status code: ${A}
More details:
${Y.errorDescription},`, K);
            this.statusCode = A, this.errorResponse = Y, this.name = Dm6
        }
    };
    Xm6 = class Xm6 extends Error {
        constructor(A, q) {
            let K = A.join(`
`);
            super(`${q}
${K}`);
            this.errors = A, this.name = SD8
        }
    };
    cC = class cC extends Error {
        constructor(A) {
            super(A.message, A.cause ? {
                cause: A.cause
            } : void 0);
            this.scopes = A.scopes, this.getTokenOptions = A.getTokenOptions, this.name = "AuthenticationRequiredError"
        }
    }
})
// @from(Ln 174727, Col 0)
function nK9(A) {
    return `The current credential is not configured to acquire tokens for tenant ${A}. To enable acquiring tokens for this tenant add it to the AdditionallyAllowedTenants on the credential options, or add "*" to AdditionallyAllowedTenants to allow acquiring tokens for any tenant.`
}
// @from(Ln 174731, Col 0)
function WO(A, q, K = [], Y) {
    var z;
    let _;
    if (process.env.AZURE_IDENTITY_DISABLE_MULTITENANTAUTH) _ = A;
    else if (A === "adfs") _ = A;
    else _ = (z = q === null || q === void 0 ? void 0 : q.tenantId) !== null && z !== void 0 ? z : A;
    if (A && _ !== A && !K.includes("*") && !K.some((w) => w.localeCompare(_) === 0)) {
        let w = nK9(_);
        throw Y === null || Y === void 0 || Y.info(w), new D4(w)
    }
    return _
}
// @from(Ln 174743, Col 4)
sB7 = E(() => {
    pM()
})
// @from(Ln 174747, Col 0)
function dJ(A, q) {
    if (!q.match(/^[0-9a-zA-Z-.]+$/)) {
        let K = Error("Invalid tenant id provided. You can locate your tenant id by following the instructions listed here: https://learn.microsoft.com/partner-center/find-ids-and-domain-names.");
        throw A.info(d9("", K)), K
    }
}
// @from(Ln 174754, Col 0)
function zP6(A, q, K) {
    if (q) return dJ(A, q), q;
    if (!K) K = gK6;
    if (K !== gK6) return "common";
    return "organizations"
}
// @from(Ln 174761, Col 0)
function _$(A) {
    if (!A || A.length === 0) return [];
    if (A.includes("*")) return hB7;
    return A
}
// @from(Ln 174766, Col 4)
QM = E(() => {
    Bm();
    H2();
    sB7()
})
// @from(Ln 174772, Col 0)
function qj1(A) {
    return A.toLowerCase()
}
// @from(Ln 174776, Col 0)
function* rK9(A) {
    for (let q of A.values()) yield [q.name, q.value]
}
// @from(Ln 174780, Col 0)
function gm(A) {
    return new tB7(A)
}
// @from(Ln 174783, Col 4)
tB7
// @from(Ln 174784, Col 4)
Pm6 = E(() => {
    tB7 = class tB7 {
        constructor(A) {
            if (this._headersMap = new Map, A)
                for (let q of Object.keys(A)) this.set(q, A[q])
        }
        set(A, q) {
            this._headersMap.set(qj1(A), {
                name: A,
                value: String(q).trim()
            })
        }
        get(A) {
            var q;
            return (q = this._headersMap.get(qj1(A))) === null || q === void 0 ? void 0 : q.value
        }
        has(A) {
            return this._headersMap.has(qj1(A))
        }
        delete(A) {
            this._headersMap.delete(qj1(A))
        }
        toJSON(A = {}) {
            let q = {};
            if (A.preserveCase)
                for (let K of this._headersMap.values()) q[K.name] = K.value;
            else
                for (let [K, Y] of this._headersMap) q[K] = Y.value;
            return q
        }
        toString() {
            return JSON.stringify(this.toJSON({
                preserveCase: !0
            }))
        } [Symbol.iterator]() {
            return rK9(this._headersMap)
        }
    }
})
// @from(Ln 174823, Col 4)
eB7 = () => {}
// @from(Ln 174824, Col 4)
Ag7 = () => {}
// @from(Ln 174829, Col 0)
function Wm6() {
    return aK9()
}
// @from(Ln 174832, Col 4)
CD8
// @from(Ln 174832, Col 9)
aK9
// @from(Ln 174833, Col 4)
ID8 = E(() => {
    aK9 = typeof((CD8 = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || CD8 === void 0 ? void 0 : CD8.randomUUID) === "function" ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : oK9
})
// @from(Ln 174836, Col 0)
class qg7 {
    constructor(A) {
        var q, K, Y, z, _, w, O;
        this.url = A.url, this.body = A.body, this.headers = (q = A.headers) !== null && q !== void 0 ? q : gm(), this.method = (K = A.method) !== null && K !== void 0 ? K : "GET", this.timeout = (Y = A.timeout) !== null && Y !== void 0 ? Y : 0, this.multipartBody = A.multipartBody, this.formData = A.formData, this.disableKeepAlive = (z = A.disableKeepAlive) !== null && z !== void 0 ? z : !1, this.proxySettings = A.proxySettings, this.streamResponseStatusCodes = A.streamResponseStatusCodes, this.withCredentials = (_ = A.withCredentials) !== null && _ !== void 0 ? _ : !1, this.abortSignal = A.abortSignal, this.onUploadProgress = A.onUploadProgress, this.onDownloadProgress = A.onDownloadProgress, this.requestId = A.requestId || Wm6(), this.allowInsecureConnection = (w = A.allowInsecureConnection) !== null && w !== void 0 ? w : !1, this.enableBrowserStreams = (O = A.enableBrowserStreams) !== null && O !== void 0 ? O : !1, this.requestOverrides = A.requestOverrides, this.authSchemes = A.authSchemes
    }
}
// @from(Ln 174843, Col 0)
function bD8(A) {
    return new qg7(A)
}
// @from(Ln 174846, Col 4)
Kg7 = E(() => {
    Pm6();
    ID8()
})
// @from(Ln 174850, Col 0)
class Kj1 {
    constructor(A) {
        var q;
        this._policies = [], this._policies = (q = A === null || A === void 0 ? void 0 : A.slice(0)) !== null && q !== void 0 ? q : [], this._orderedPolicies = void 0
    }
    addPolicy(A, q = {}) {
        if (q.phase && q.afterPhase) throw Error("Policies inside a phase cannot specify afterPhase.");
        if (q.phase && !Yg7.has(q.phase)) throw Error(`Invalid phase name: ${q.phase}`);
        if (q.afterPhase && !Yg7.has(q.afterPhase)) throw Error(`Invalid afterPhase name: ${q.afterPhase}`);
        this._policies.push({
            policy: A,
            options: q
        }), this._orderedPolicies = void 0
    }
    removePolicy(A) {
        let q = [];
        return this._policies = this._policies.filter((K) => {
            if (A.name && K.policy.name === A.name || A.phase && K.options.phase === A.phase) return q.push(K.policy), !1;
            else return !0
        }), this._orderedPolicies = void 0, q
    }
    sendRequest(A, q) {
        return this.getOrderedPolicies().reduceRight((z, _) => {
            return (w) => {
                return _.sendRequest(w, z)
            }
        }, (z) => A.sendRequest(z))(q)
    }
    getOrderedPolicies() {
        if (!this._orderedPolicies) this._orderedPolicies = this.orderPolicies();
        return this._orderedPolicies
    }
    clone() {
        return new Kj1(this._policies)
    }
    static create() {
        return new Kj1
    }
    orderPolicies() {
        let A = [],
            q = new Map;

        function K(D) {
            return {
                name: D,
                policies: new Set,
                hasRun: !1,
                hasAfterPolicies: !1
            }
        }
        let Y = K("Serialize"),
            z = K("None"),
            _ = K("Deserialize"),
            w = K("Retry"),
            O = K("Sign"),
            $ = [Y, z, _, w, O];

        function H(D) {
            if (D === "Retry") return w;
            else if (D === "Serialize") return Y;
            else if (D === "Deserialize") return _;
            else if (D === "Sign") return O;
            else return z
        }
        for (let D of this._policies) {
            let {
                policy: X,
                options: P
            } = D, W = X.name;
            if (q.has(W)) throw Error("Duplicate policy names not allowed in pipeline");
            let Z = {
                policy: X,
                dependsOn: new Set,
                dependants: new Set
            };
            if (P.afterPhase) Z.afterPhase = H(P.afterPhase), Z.afterPhase.hasAfterPolicies = !0;
            q.set(W, Z), H(P.phase).policies.add(Z)
        }
        for (let D of this._policies) {
            let {
                policy: X,
                options: P
            } = D, W = X.name, Z = q.get(W);
            if (!Z) throw Error(`Missing node for policy ${W}`);
            if (P.afterPolicies)
                for (let G of P.afterPolicies) {
                    let f = q.get(G);
                    if (f) Z.dependsOn.add(f), f.dependants.add(Z)
                }
            if (P.beforePolicies)
                for (let G of P.beforePolicies) {
                    let f = q.get(G);
                    if (f) f.dependsOn.add(Z), Z.dependants.add(f)
                }
        }

        function j(D) {
            D.hasRun = !0;
            for (let X of D.policies) {
                if (X.afterPhase && (!X.afterPhase.hasRun || X.afterPhase.policies.size)) continue;
                if (X.dependsOn.size === 0) {
                    A.push(X.policy);
                    for (let P of X.dependants) P.dependsOn.delete(X);
                    q.delete(X.policy.name), D.policies.delete(X)
                }
            }
        }

        function J() {
            for (let D of $) {
                if (j(D), D.policies.size > 0 && D !== z) {
                    if (!z.hasRun) j(z);
                    return
                }
                if (D.hasAfterPolicies) j(z)
            }
        }
        let M = 0;
        while (q.size > 0) {
            M++;
            let D = A.length;
            if (J(), A.length <= D && M > 1) throw Error("Cannot satisfy policy dependencies due to requirements cycle.")
        }
        return A
    }
}
// @from(Ln 174977, Col 0)
function xD8() {
    return Kj1.create()
}
// @from(Ln 174980, Col 4)
Yg7
// @from(Ln 174981, Col 4)
zg7 = E(() => {
    Yg7 = new Set(["Deserialize", "Serialize", "Retry", "Sign"])
})
// @from(Ln 174985, Col 0)
function Zm6(A) {
    return typeof A === "object" && A !== null && !Array.isArray(A) && !(A instanceof RegExp) && !(A instanceof Date)
}
// @from(Ln 174989, Col 0)
function pK6(A) {
    if (Zm6(A)) {
        let q = typeof A.name === "string",
            K = typeof A.message === "string";
        return q && K
    }
    return !1
}
// @from(Ln 174997, Col 4)
uD8 = () => {}
// @from(Ln 175001, Col 4)
_g7
// @from(Ln 175002, Col 4)
wg7 = E(() => {
    _g7 = sK9.custom
})
// @from(Ln 175005, Col 0)
class Fm {
    constructor({
        additionalAllowedHeaderNames: A = [],
        additionalAllowedQueryParameters: q = []
    } = {}) {
        A = tK9.concat(A), q = eK9.concat(q), this.allowedHeaderNames = new Set(A.map((K) => K.toLowerCase())), this.allowedQueryParameters = new Set(q.map((K) => K.toLowerCase()))
    }
    sanitize(A) {
        let q = new Set;
        return JSON.stringify(A, (K, Y) => {
            if (Y instanceof Error) return Object.assign(Object.assign({}, Y), {
                name: Y.name,
                message: Y.message
            });
            if (K === "headers") return this.sanitizeHeaders(Y);
            else if (K === "url") return this.sanitizeUrl(Y);
            else if (K === "query") return this.sanitizeQuery(Y);
            else if (K === "body") return;
            else if (K === "response") return;
            else if (K === "operationSpec") return;
            else if (Array.isArray(Y) || Zm6(Y)) {
                if (q.has(Y)) return "[Circular]";
                q.add(Y)
            }
            return Y
        }, 2)
    }
    sanitizeUrl(A) {
        if (typeof A !== "string" || A === null || A === "") return A;
        let q = new URL(A);
        if (!q.search) return A;
        for (let [K] of q.searchParams)
            if (!this.allowedQueryParameters.has(K.toLowerCase())) q.searchParams.set(K, mD8);
        return q.toString()
    }
    sanitizeHeaders(A) {
        let q = {};
        for (let K of Object.keys(A))
            if (this.allowedHeaderNames.has(K.toLowerCase())) q[K] = A[K];
            else q[K] = mD8;
        return q
    }
    sanitizeQuery(A) {
        if (typeof A !== "object" || A === null) return A;
        let q = {};
        for (let K of Object.keys(A))
            if (this.allowedQueryParameters.has(K.toLowerCase())) q[K] = A[K];
            else q[K] = mD8;
        return q
    }
}
// @from(Ln 175056, Col 4)
mD8 = "REDACTED"
// @from(Ln 175057, Col 4)
tK9
// @from(Ln 175057, Col 9)
eK9
// @from(Ln 175058, Col 4)
Gm6 = E(() => {
    tK9 = ["x-ms-client-request-id", "x-ms-return-client-request-id", "x-ms-useragent", "x-ms-correlation-request-id", "x-ms-request-id", "client-request-id", "ms-cv", "return-client-request-id", "traceparent", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin", "Accept", "Accept-Encoding", "Cache-Control", "Connection", "Content-Length", "Content-Type", "Date", "ETag", "Expires", "If-Match", "If-Modified-Since", "If-None-Match", "If-Unmodified-Since", "Last-Modified", "Pragma", "Request-Id", "Retry-After", "Server", "Transfer-Encoding", "User-Agent", "WWW-Authenticate"], eK9 = ["api-version"]
})
// @from(Ln 175062, Col 0)
function BD8(A) {
    if (A instanceof vv) return !0;
    return pK6(A) && A.name === "RestError"
}
// @from(Ln 175066, Col 4)
A59
// @from(Ln 175066, Col 9)
vv
// @from(Ln 175067, Col 4)
gD8 = E(() => {
    uD8();
    wg7();
    Gm6();
    A59 = new Fm;
    vv = class vv extends Error {
        constructor(A, q = {}) {
            super(A);
            this.name = "RestError", this.code = q.code, this.statusCode = q.statusCode, Object.defineProperty(this, "request", {
                value: q.request,
                enumerable: !1
            }), Object.defineProperty(this, "response", {
                value: q.response,
                enumerable: !1
            }), Object.defineProperty(this, _g7, {
                value: () => {
                    return `RestError: ${this.message} 
 ${A59.sanitize(Object.assign(Object.assign({},this),{request:this.request,response:this.response}))}`
                },
                enumerable: !1
            }), Object.setPrototypeOf(this, vv.prototype)
        }
    };
    vv.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
    vv.PARSE_ERROR = "PARSE_ERROR"
})
// @from(Ln 175093, Col 4)
ks
// @from(Ln 175094, Col 4)
Yj1 = E(() => {
    ks = class ks extends Error {
        constructor(A) {
            super(A);
            this.name = "AbortError"
        }
    }
})
// @from(Ln 175102, Col 4)
lC
// @from(Ln 175103, Col 4)
zj1 = E(() => {
    tH1();
    lC = sH1("ts-http-runtime")
})
// @from(Ln 175114, Col 0)
function fm6(A) {
    return A && typeof A.pipe === "function"
}
// @from(Ln 175118, Col 0)
function Og7(A) {
    if (A.readable === !1) return Promise.resolve();
    return new Promise((q) => {
        let K = () => {
            q(), A.removeListener("close", K), A.removeListener("end", K), A.removeListener("error", K)
        };
        A.on("close", K), A.on("end", K), A.on("error", K)
    })
}
// @from(Ln 175128, Col 0)
function $g7(A) {
    return A && typeof A.byteLength === "number"
}
// @from(Ln 175131, Col 0)
class Hg7 {
    constructor() {
        this.cachedHttpsAgents = new WeakMap
    }
    async sendRequest(A) {
        var q, K, Y;
        let z = new AbortController,
            _;
        if (A.abortSignal) {
            if (A.abortSignal.aborted) throw new ks("The operation was aborted. Request has already been canceled.");
            _ = (J) => {
                if (J.type === "abort") z.abort()
            }, A.abortSignal.addEventListener("abort", _)
        }
        let w;
        if (A.timeout > 0) w = setTimeout(() => {
            let J = new Fm;
            lC.info(`request to '${J.sanitizeUrl(A.url)}' timed out. canceling...`), z.abort()
        }, A.timeout);
        let O = A.headers.get("Accept-Encoding"),
            $ = (O === null || O === void 0 ? void 0 : O.includes("gzip")) || (O === null || O === void 0 ? void 0 : O.includes("deflate")),
            H = typeof A.body === "function" ? A.body() : A.body;
        if (H && !A.headers.has("Content-Length")) {
            let J = w59(H);
            if (J !== null) A.headers.set("Content-Length", J)
        }
        let j;
        try {
            if (H && A.onUploadProgress) {
                let W = A.onUploadProgress,
                    Z = new FD8(W);
                if (Z.on("error", (G) => {
                        lC.error("Error in upload progress", G)
                    }), fm6(H)) H.pipe(Z);
                else Z.end(H);
                H = Z
            }
            let J = await this.makeRequest(A, z, H);
            if (w !== void 0) clearTimeout(w);
            let M = Y59(J),
                X = {
                    status: (q = J.statusCode) !== null && q !== void 0 ? q : 0,
                    headers: M,
                    request: A
                };
            if (A.method === "HEAD") return J.resume(), X;
            j = $ ? z59(J, M) : J;
            let P = A.onDownloadProgress;
            if (P) {
                let W = new FD8(P);
                W.on("error", (Z) => {
                    lC.error("Error in download progress", Z)
                }), j.pipe(W), j = W
            }
            if (((K = A.streamResponseStatusCodes) === null || K === void 0 ? void 0 : K.has(Number.POSITIVE_INFINITY)) || ((Y = A.streamResponseStatusCodes) === null || Y === void 0 ? void 0 : Y.has(X.status))) X.readableStreamBody = j;
            else X.bodyAsText = await _59(j);
            return X
        } finally {
            if (A.abortSignal && _) {
                let J = Promise.resolve();
                if (fm6(H)) J = Og7(H);
                let M = Promise.resolve();
                if (fm6(j)) M = Og7(j);
                Promise.all([J, M]).then(() => {
                    var D;
                    if (_)(D = A.abortSignal) === null || D === void 0 || D.removeEventListener("abort", _)
                }).catch((D) => {
                    lC.warning("Error when cleaning up abortListener on httpRequest", D)
                })
            }
        }
    }
    makeRequest(A, q, K) {
        var Y;
        let z = new URL(A.url),
            _ = z.protocol !== "https:";
        if (_ && !A.allowInsecureConnection) throw Error(`Cannot connect to ${A.url} while allowInsecureConnection is false.`);
        let w = (Y = A.agent) !== null && Y !== void 0 ? Y : this.getOrCreateAgent(A, _),
            O = Object.assign({
                agent: w,
                hostname: z.hostname,
                path: `${z.pathname}${z.search}`,
                port: z.port,
                method: A.method,
                headers: A.headers.toJSON({
                    preserveCase: !0
                })
            }, A.requestOverrides);
        return new Promise(($, H) => {
            let j = _ ? _P6.request(O, $) : wP6.request(O, $);
            if (j.once("error", (J) => {
                    var M;
                    H(new vv(J.message, {
                        code: (M = J.code) !== null && M !== void 0 ? M : vv.REQUEST_SEND_ERROR,
                        request: A
                    }))
                }), q.signal.addEventListener("abort", () => {
                    let J = new ks("The operation was aborted. Rejecting from abort signal callback while making request.");
                    j.destroy(J), H(J)
                }), K && fm6(K)) K.pipe(j);
            else if (K)
                if (typeof K === "string" || Buffer.isBuffer(K)) j.end(K);
                else if ($g7(K)) j.end(ArrayBuffer.isView(K) ? Buffer.from(K.buffer) : Buffer.from(K));
            else lC.error("Unrecognized body type", K), H(new vv("Unrecognized body type"));
            else j.end()
        })
    }
    getOrCreateAgent(A, q) {
        var K;
        let Y = A.disableKeepAlive;
        if (q) {
            if (Y) return _P6.globalAgent;
            if (!this.cachedHttpAgent) this.cachedHttpAgent = new _P6.Agent({
                keepAlive: !0
            });
            return this.cachedHttpAgent
        } else {
            if (Y && !A.tlsSettings) return wP6.globalAgent;
            let z = (K = A.tlsSettings) !== null && K !== void 0 ? K : K59,
                _ = this.cachedHttpsAgents.get(z);
            if (_ && _.options.keepAlive === !Y) return _;
            return lC.info("No cached TLS Agent exist, creating a new Agent"), _ = new wP6.Agent(Object.assign({
                keepAlive: !Y
            }, z)), this.cachedHttpsAgents.set(z, _), _
        }
    }
}
// @from(Ln 175259, Col 0)
function Y59(A) {
    let q = gm();
    for (let K of Object.keys(A.headers)) {
        let Y = A.headers[K];
        if (Array.isArray(Y)) {
            if (Y.length > 0) q.set(K, Y[0])
        } else if (Y) q.set(K, Y)
    }
    return q
}
// @from(Ln 175270, Col 0)
function z59(A, q) {
    let K = q.get("Content-Encoding");
    if (K === "gzip") {
        let Y = _j1.createGunzip();
        return A.pipe(Y), Y
    } else if (K === "deflate") {
        let Y = _j1.createInflate();
        return A.pipe(Y), Y
    }
    return A
}
// @from(Ln 175282, Col 0)
function _59(A) {
    return new Promise((q, K) => {
        let Y = [];
        A.on("data", (z) => {
            if (Buffer.isBuffer(z)) Y.push(z);
            else Y.push(Buffer.from(z))
        }), A.on("end", () => {
            q(Buffer.concat(Y).toString("utf8"))
        }), A.on("error", (z) => {
            if (z && (z === null || z === void 0 ? void 0 : z.name) === "AbortError") K(z);
            else K(new vv(`Error reading response as text: ${z.message}`, {
                code: vv.PARSE_ERROR
            }))
        })
    })
}
// @from(Ln 175299, Col 0)
function w59(A) {
    if (!A) return 0;
    else if (Buffer.isBuffer(A)) return A.length;
    else if (fm6(A)) return null;
    else if ($g7(A)) return A.byteLength;
    else if (typeof A === "string") return Buffer.from(A).length;
    else return null
}
// @from(Ln 175308, Col 0)
function jg7() {
    return new Hg7
}
// @from(Ln 175311, Col 4)
K59
// @from(Ln 175311, Col 9)
FD8
// @from(Ln 175312, Col 4)
Jg7 = E(() => {
    Yj1();
    Pm6();
    gD8();
    zj1();
    Gm6();
    K59 = {};
    FD8 = class FD8 extends q59 {
        _transform(A, q, K) {
            this.push(A), this.loadedBytes += A.length;
            try {
                this.progressCallback({
                    loadedBytes: this.loadedBytes
                }), K()
            } catch (Y) {
                K(Y)
            }
        }
        constructor(A) {
            super();
            this.loadedBytes = 0, this.progressCallback = A
        }
    }
})
// @from(Ln 175337, Col 0)
function pD8() {
    return jg7()
}
// @from(Ln 175340, Col 4)
Mg7 = E(() => {
    Jg7()
})
// @from(Ln 175343, Col 4)
OP6 = E(() => {
    Pm6();
    Kg7();
    zg7();
    gD8();
    Mg7();
    eB7();
    Ag7()
})
// @from(Ln 175353, Col 0)
function Tm6() {
    return xD8()
}
// @from(Ln 175356, Col 4)
QD8 = E(() => {
    OP6()
})
// @from(Ln 175359, Col 4)
UU
// @from(Ln 175360, Col 4)
wj1 = E(() => {
    FK6();
    UU = Vs("core-rest-pipeline")
})
// @from(Ln 175365, Col 0)
function UD8(A) {
    return {
        name: "agentPolicy",
        sendRequest: async (q, K) => {
            if (!q.agent) q.agent = A;
            return K(q)
        }
    }
}
// @from(Ln 175375, Col 0)
function dD8() {
    return {
        name: "decompressResponsePolicy",
        async sendRequest(A, q) {
            if (A.method !== "HEAD") A.headers.set("Accept-Encoding", "gzip,deflate");
            return q(A)
        }
    }
}
// @from(Ln 175385, Col 0)
function cD8(A, q) {
    return A = Math.ceil(A), q = Math.floor(q), Math.floor(Math.random() * (q - A + 1)) + A
}
// @from(Ln 175389, Col 0)
function vm6(A, q) {
    let K = q.retryDelayInMs * Math.pow(2, A),
        Y = Math.min(q.maxRetryDelayInMs, K);
    return {
        retryAfterInMs: Y / 2 + cD8(0, Y / 2)
    }
}
// @from(Ln 175396, Col 4)
lD8 = () => {}
// @from(Ln 175398, Col 0)
function Dg7(A, q, K) {
    return new Promise((Y, z) => {
        let _ = void 0,
            w = void 0,
            O = () => {
                return z(new ks((K === null || K === void 0 ? void 0 : K.abortErrorMsg) ? K === null || K === void 0 ? void 0 : K.abortErrorMsg : O59))
            },
            $ = () => {
                if ((K === null || K === void 0 ? void 0 : K.abortSignal) && w) K.abortSignal.removeEventListener("abort", w)
            };
        if (w = () => {
                if (_) clearTimeout(_);
                return $(), O()
            }, (K === null || K === void 0 ? void 0 : K.abortSignal) && K.abortSignal.aborted) return O();
        if (_ = setTimeout(() => {
                $(), Y(q)
            }, A), K === null || K === void 0 ? void 0 : K.abortSignal) K.abortSignal.addEventListener("abort", w)
    })
}
// @from(Ln 175418, Col 0)
function Xg7(A, q) {
    let K = A.headers.get(q);
    if (!K) return;
    let Y = Number(K);
    if (Number.isNaN(Y)) return;
    return Y
}
// @from(Ln 175425, Col 4)
O59 = "The operation was aborted."
// @from(Ln 175426, Col 4)
iD8 = E(() => {
    Yj1()
})
// @from(Ln 175430, Col 0)
function Pg7(A) {
    if (!(A && [429, 503].includes(A.status))) return;
    try {
        for (let z of $59) {
            let _ = Xg7(A, z);
            if (_ === 0 || _) return _ * (z === nD8 ? 1000 : 1)
        }
        let q = A.headers.get(nD8);
        if (!q) return;
        let Y = Date.parse(q) - Date.now();
        return Number.isFinite(Y) ? Math.max(0, Y) : void 0
    } catch (q) {
        return
    }
}
// @from(Ln 175446, Col 0)
function Wg7(A) {
    return Number.isFinite(Pg7(A))
}
// @from(Ln 175450, Col 0)
function Zg7() {
    return {
        name: "throttlingRetryStrategy",
        retry({
            response: A
        }) {
            let q = Pg7(A);
            if (!Number.isFinite(q)) return {
                skipStrategy: !0
            };
            return {
                retryAfterInMs: q
            }
        }
    }
}
// @from(Ln 175466, Col 4)
nD8 = "Retry-After"
// @from(Ln 175467, Col 4)
$59
// @from(Ln 175468, Col 4)
rD8 = E(() => {
    iD8();
    $59 = ["retry-after-ms", "x-ms-retry-after-ms", nD8]
})
// @from(Ln 175473, Col 0)
function Gg7(A = {}) {
    var q, K;
    let Y = (q = A.retryDelayInMs) !== null && q !== void 0 ? q : H59,
        z = (K = A.maxRetryDelayInMs) !== null && K !== void 0 ? K : j59;
    return {
        name: "exponentialRetryStrategy",
        retry({
            retryCount: _,
            response: w,
            responseError: O
        }) {
            let $ = M59(O),
                H = $ && A.ignoreSystemErrors,
                j = J59(w),
                J = j && A.ignoreHttpStatusCodes;
            if (w && (Wg7(w) || !j) || J || H) return {
                skipStrategy: !0
            };
            if (O && !$ && !j) return {
                errorToThrow: O
            };
            return vm6(_, {
                retryDelayInMs: Y,
                maxRetryDelayInMs: z
            })
        }
    }
}
// @from(Ln 175502, Col 0)
function J59(A) {
    return Boolean(A && A.status !== void 0 && (A.status >= 500 || A.status === 408) && A.status !== 501 && A.status !== 505)
}
// @from(Ln 175506, Col 0)
function M59(A) {
    if (!A) return !1;
    return A.code === "ETIMEDOUT" || A.code === "ESOCKETTIMEDOUT" || A.code === "ECONNREFUSED" || A.code === "ECONNRESET" || A.code === "ENOENT" || A.code === "ENOTFOUND"
}
// @from(Ln 175510, Col 4)
H59 = 1000
// @from(Ln 175511, Col 4)
j59 = 64000
// @from(Ln 175512, Col 4)
fg7 = E(() => {
    lD8();
    rD8()
})
// @from(Ln 175516, Col 4)
Nm6 = 3
// @from(Ln 175518, Col 0)
function Vm6(A, q = {
    maxRetries: Nm6
}) {
    let K = q.logger || D59;
    return {
        name: X59,
        async sendRequest(Y, z) {
            var _, w;
            let O, $, H = -1;
            A: while (!0) {
                H += 1, O = void 0, $ = void 0;
                try {
                    K.info(`Retry ${H}: Attempting to send request`, Y.requestId), O = await z(Y), K.info(`Retry ${H}: Received a response from request`, Y.requestId)
                } catch (j) {
                    if (K.error(`Retry ${H}: Received an error from request`, Y.requestId), $ = j, !j || $.name !== "RestError") throw j;
                    O = $.response
                }
                if ((_ = Y.abortSignal) === null || _ === void 0 ? void 0 : _.aborted) throw K.error(`Retry ${H}: Request aborted.`), new ks;
                if (H >= ((w = q.maxRetries) !== null && w !== void 0 ? w : Nm6))
                    if (K.info(`Retry ${H}: Maximum retries reached. Returning the last received response, or throwing the last received error.`), $) throw $;
                    else if (O) return O;
                else throw Error("Maximum retries reached with no response or error to throw");
                K.info(`Retry ${H}: Processing ${A.length} retry strategies.`);
                q: for (let j of A) {
                    let J = j.logger || K;
                    J.info(`Retry ${H}: Processing retry strategy ${j.name}.`);
                    let M = j.retry({
                        retryCount: H,
                        response: O,
                        responseError: $
                    });
                    if (M.skipStrategy) {
                        J.info(`Retry ${H}: Skipped.`);
                        continue q
                    }
                    let {
                        errorToThrow: D,
                        retryAfterInMs: X,
                        redirectTo: P
                    } = M;
                    if (D) throw J.error(`Retry ${H}: Retry strategy ${j.name} throws error:`, D), D;
                    if (X || X === 0) {
                        J.info(`Retry ${H}: Retry strategy ${j.name} retries after ${X}`), await Dg7(X, void 0, {
                            abortSignal: Y.abortSignal
                        });
                        continue A
                    }
                    if (P) {
                        J.info(`Retry ${H}: Retry strategy ${j.name} redirects to ${P}`), Y.url = P;
                        continue A
                    }
                }
                if ($) throw K.info("None of the retry strategies could work with the received error. Throwing it."), $;
                if (O) return K.info("None of the retry strategies could work with the received response. Returning it."), O
            }
        }
    }
}
// @from(Ln 175576, Col 4)
D59
// @from(Ln 175576, Col 9)
X59 = "retryPolicy"
// @from(Ln 175577, Col 4)
oD8 = E(() => {
    iD8();
    Yj1();
    tH1();
    D59 = sH1("ts-http-runtime retryPolicy")
})
// @from(Ln 175584, Col 0)
function sD8(A = {}) {
    var q;
    return {
        name: aD8,
        sendRequest: Vm6([Zg7(), Gg7(A)], {
            maxRetries: (q = A.maxRetries) !== null && q !== void 0 ? q : Nm6
        }).sendRequest
    }
}
// @from(Ln 175593, Col 4)
aD8 = "defaultRetryPolicy"
// @from(Ln 175594, Col 4)
Tg7 = E(() => {
    fg7();
    rD8();
    oD8()
})
// @from(Ln 175600, Col 0)
function pm(A, q) {
    return Buffer.from(A, q)
}
// @from(Ln 175603, Col 4)
tD8
// @from(Ln 175603, Col 9)
eD8
// @from(Ln 175603, Col 14)
AX8
// @from(Ln 175603, Col 19)
qX8
// @from(Ln 175603, Col 24)
vg7
// @from(Ln 175603, Col 29)
Ng7
// @from(Ln 175603, Col 34)
Vg7
// @from(Ln 175603, Col 39)
kg7
// @from(Ln 175603, Col 44)
$P6
// @from(Ln 175603, Col 49)
Eg7
// @from(Ln 175604, Col 4)
KX8 = E(() => {
    vg7 = typeof window < "u" && typeof window.document < "u", Ng7 = typeof self === "object" && typeof(self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((tD8 = self.constructor) === null || tD8 === void 0 ? void 0 : tD8.name) === "DedicatedWorkerGlobalScope" || ((eD8 = self.constructor) === null || eD8 === void 0 ? void 0 : eD8.name) === "ServiceWorkerGlobalScope" || ((AX8 = self.constructor) === null || AX8 === void 0 ? void 0 : AX8.name) === "SharedWorkerGlobalScope"), Vg7 = typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u", kg7 = typeof Bun < "u" && typeof Bun.version < "u", $P6 = typeof globalThis.process < "u" && Boolean(globalThis.process.version) && Boolean((qX8 = globalThis.process.versions) === null || qX8 === void 0 ? void 0 : qX8.node), Eg7 = typeof navigator < "u" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative"
})
// @from(Ln 175608, Col 0)
function P59(A) {
    var q;
    let K = {};
    for (let [Y, z] of A.entries())(q = K[Y]) !== null && q !== void 0 || (K[Y] = []), K[Y].push(z);
    return K
}
// @from(Ln 175615, Col 0)
function zX8() {
    return {
        name: YX8,
        async sendRequest(A, q) {
            if ($P6 && typeof FormData < "u" && A.body instanceof FormData) A.formData = P59(A.body), A.body = void 0;
            if (A.formData) {
                let K = A.headers.get("Content-Type");
                if (K && K.indexOf("application/x-www-form-urlencoded") !== -1) A.body = W59(A.formData);
                else await Z59(A.formData, A);
                A.formData = void 0
            }
            return q(A)
        }
    }
}
// @from(Ln 175631, Col 0)
function W59(A) {
    let q = new URLSearchParams;
    for (let [K, Y] of Object.entries(A))
        if (Array.isArray(Y))
            for (let z of Y) q.append(K, z.toString());
        else q.append(K, Y.toString());
    return q.toString()
}
// @from(Ln 175639, Col 0)
async function Z59(A, q) {
    let K = q.headers.get("Content-Type");
    if (K && !K.startsWith("multipart/form-data")) return;
    q.headers.set("Content-Type", K !== null && K !== void 0 ? K : "multipart/form-data");
    let Y = [];
    for (let [z, _] of Object.entries(A))
        for (let w of Array.isArray(_) ? _ : [_])
            if (typeof w === "string") Y.push({
                headers: gm({
                    "Content-Disposition": `form-data; name="${z}"`
                }),
                body: pm(w, "utf-8")
            });
            else if (w === void 0 || w === null || typeof w !== "object") throw Error(`Unexpected value for key ${z}: ${w}. Value should be serialized to string first.`);
    else {
        let O = w.name || "blob",
            $ = gm();
        $.set("Content-Disposition", `form-data; name="${z}"; filename="${O}"`), $.set("Content-Type", w.type || "application/octet-stream"), Y.push({
            headers: $,
            body: w
        })
    }
    q.multipartBody = {
        parts: Y
    }
}
// @from(Ln 175665, Col 4)
YX8 = "formDataPolicy"
// @from(Ln 175666, Col 4)
yg7 = E(() => {
    KX8();
    Pm6()
})
// @from(Ln 175671, Col 0)
function wX8(A = {}) {
    var q;
    let K = (q = A.logger) !== null && q !== void 0 ? q : lC.info,
        Y = new Fm({
            additionalAllowedHeaderNames: A.additionalAllowedHeaderNames,
            additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
        });
    return {
        name: _X8,
        async sendRequest(z, _) {
            if (!K.enabled) return _(z);
            K(`Request: ${Y.sanitize(z)}`);
            let w = await _(z);
            return K(`Response status code: ${w.status}`), K(`Headers: ${Y.sanitize(w.headers)}`), w
        }
    }
}
// @from(Ln 175688, Col 4)
_X8 = "logPolicy"
// @from(Ln 175689, Col 4)
Lg7 = E(() => {
    zj1();
    Gm6()
})
// @from(Ln 175694, Col 0)
function Oj1(A) {
    return typeof A.stream === "function"
}
// @from(Ln 175697, Col 4)
Rg7
// @from(Ln 175697, Col 9)
mw2
// @from(Ln 175697, Col 14)
Bw2
// @from(Ln 175697, Col 19)
gw2
// @from(Ln 175697, Col 24)
Fw2
// @from(Ln 175697, Col 29)
pw2
// @from(Ln 175697, Col 34)
Qw2
// @from(Ln 175697, Col 39)
Uw2
// @from(Ln 175697, Col 44)
dw2
// @from(Ln 175697, Col 49)
cw2
// @from(Ln 175697, Col 54)
lw2
// @from(Ln 175697, Col 59)
iw2
// @from(Ln 175697, Col 64)
nw2
// @from(Ln 175697, Col 69)
rw2
// @from(Ln 175697, Col 74)
ow2
// @from(Ln 175697, Col 79)
aw2
// @from(Ln 175697, Col 84)
sw2
// @from(Ln 175697, Col 89)
tw2
// @from(Ln 175697, Col 94)
ew2
// @from(Ln 175697, Col 99)
AO2
// @from(Ln 175697, Col 104)
QK6
// @from(Ln 175697, Col 109)
OX8
// @from(Ln 175697, Col 114)
qO2
// @from(Ln 175697, Col 119)
hg7
// @from(Ln 175697, Col 124)
KO2
// @from(Ln 175697, Col 129)
YO2
// @from(Ln 175697, Col 134)
zO2
// @from(Ln 175697, Col 139)
_O2
// @from(Ln 175697, Col 144)
wO2
// @from(Ln 175697, Col 149)
OO2
// @from(Ln 175697, Col 154)
$O2
// @from(Ln 175697, Col 159)
HO2
// @from(Ln 175697, Col 164)
jO2
// @from(Ln 175698, Col 4)
Sg7 = E(() => {
    Rg7 = t(_2(), 1), {
        __extends: mw2,
        __assign: Bw2,
        __rest: gw2,
        __decorate: Fw2,
        __param: pw2,
        __esDecorate: Qw2,
        __runInitializers: Uw2,
        __propKey: dw2,
        __setFunctionName: cw2,
        __metadata: lw2,
        __awaiter: iw2,
        __generator: nw2,
        __exportStar: rw2,
        __createBinding: ow2,
        __values: aw2,
        __read: sw2,
        __spread: tw2,
        __spreadArrays: ew2,
        __spreadArray: AO2,
        __await: QK6,
        __asyncGenerator: OX8,
        __asyncDelegator: qO2,
        __asyncValues: hg7,
        __makeTemplateObject: KO2,
        __importStar: YO2,
        __importDefault: zO2,
        __classPrivateFieldGet: _O2,
        __classPrivateFieldSet: wO2,
        __classPrivateFieldIn: OO2,
        __addDisposableResource: $O2,
        __disposeResources: HO2,
        __rewriteRelativeImportExtension: jO2
    } = Rg7.default
})
// @from(Ln 175738, Col 0)
function Cg7() {
    return OX8(this, arguments, function*() {
        let q = this.getReader();
        try {
            while (!0) {
                let {
                    done: K,
                    value: Y
                } = yield QK6(q.read());
                if (K) return yield QK6(void 0);
                yield yield QK6(Y)
            }
        } finally {
            q.releaseLock()
        }
    })
}
// @from(Ln 175756, Col 0)
function G59(A) {
    if (!A[Symbol.asyncIterator]) A[Symbol.asyncIterator] = Cg7.bind(A);
    if (!A.values) A.values = Cg7.bind(A)
}
// @from(Ln 175761, Col 0)
function Ig7(A) {
    if (A instanceof ReadableStream) return G59(A), $X8.fromWeb(A);
    else return A
}
// @from(Ln 175766, Col 0)
function f59(A) {
    if (A instanceof Uint8Array) return $X8.from(Buffer.from(A));
    else if (Oj1(A)) return Ig7(A.stream());
    else return Ig7(A)
}
// @from(Ln 175771, Col 0)
async function bg7(A) {
    return function() {
        let q = A.map((K) => typeof K === "function" ? K() : K).map(f59);
        return $X8.from(function() {
            return OX8(this, arguments, function*() {
                var K, Y, z, _;
                for (let H of q) try {
                    for (var w = !0, O = (Y = void 0, hg7(H)), $; $ = yield QK6(O.next()), K = $.done, !K; w = !0) _ = $.value, w = !1, yield yield QK6(_)
                } catch (j) {
                    Y = {
                        error: j
                    }
                } finally {
                    try {
                        if (!w && !K && (z = O.return)) yield QK6(z.call(O))
                    } finally {
                        if (Y) throw Y.error
                    }
                }
            })
        }())
    }
}
// @from(Ln 175794, Col 4)
xg7 = E(() => {
    Sg7()
})
// @from(Ln 175798, Col 0)
function T59() {
    return `----AzSDKFormBoundary${Wm6()}`
}
// @from(Ln 175802, Col 0)
function v59(A) {
    let q = "";
    for (let [K, Y] of A) q += `${K}: ${Y}\r
`;
    return q
}
// @from(Ln 175809, Col 0)
function N59(A) {
    if (A instanceof Uint8Array) return A.byteLength;
    else if (Oj1(A)) return A.size === -1 ? void 0 : A.size;
    else return
}
// @from(Ln 175815, Col 0)
function V59(A) {
    let q = 0;
    for (let K of A) {
        let Y = N59(K);
        if (Y === void 0) return;
        else q += Y
    }
    return q
}
// @from(Ln 175824, Col 0)
async function k59(A, q, K) {
    let Y = [pm(`--${K}`, "utf-8"), ...q.flatMap((_) => [pm(`\r
`, "utf-8"), pm(v59(_.headers), "utf-8"), pm(`\r
`, "utf-8"), _.body, pm(`\r
--${K}`, "utf-8")]), pm(`--\r
\r
`, "utf-8")],
        z = V59(Y);
    if (z) A.headers.set("Content-Length", z);
    A.body = await bg7(Y)
}
// @from(Ln 175836, Col 0)
function L59(A) {
    if (A.length > E59) throw Error(`Multipart boundary "${A}" exceeds maximum length of 70 characters`);
    if (Array.from(A).some((q) => !y59.has(q))) throw Error(`Multipart boundary "${A}" contains invalid characters`)
}
// @from(Ln 175841, Col 0)
function HX8() {
    return {
        name: $j1,
        async sendRequest(A, q) {
            var K;
            if (!A.multipartBody) return q(A);
            if (A.body) throw Error("multipartBody and regular body cannot be set at the same time");
            let Y = A.multipartBody.boundary,
                z = (K = A.headers.get("Content-Type")) !== null && K !== void 0 ? K : "multipart/mixed",
                _ = z.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
            if (!_) throw Error(`Got multipart request body, but content-type header was not multipart: ${z}`);
            let [, w, O] = _;
            if (O && Y && O !== Y) throw Error(`Multipart boundary was specified as ${O} in the header, but got ${Y} in the request body`);
            if (Y !== null && Y !== void 0 || (Y = O), Y) L59(Y);
            else Y = T59();
            return A.headers.set("Content-Type", `${w}; boundary=${Y}`), await k59(A, A.multipartBody.parts, Y), A.multipartBody = void 0, q(A)
        }
    }
}
// @from(Ln 175860, Col 4)
$j1 = "multipartPolicy"
// @from(Ln 175861, Col 4)
E59 = 70
// @from(Ln 175862, Col 4)
y59
// @from(Ln 175863, Col 4)
ug7 = E(() => {
    ID8();
    xg7();
    y59 = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?")
})
// @from(Ln 175868, Col 4)
gg7 = x((QL) => {
    var R59 = QL && QL.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        h59 = QL && QL.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        Bg7 = QL && QL.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) R59(q, A, K)
            }
            return h59(q, A), q
        },
        S59 = QL && QL.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        };
    Object.defineProperty(QL, "__esModule", {
        value: !0
    });
    QL.HttpProxyAgent = void 0;
    var C59 = Bg7(x6("net")),
        I59 = Bg7(x6("tls")),
        b59 = S59(X$6()),
        x59 = x6("events"),
        u59 = qr1(),
        mg7 = x6("url"),
        HP6 = (0, b59.default)("http-proxy-agent");
    class jX8 extends u59.Agent {
        constructor(A, q) {
            super(q);
            this.proxy = typeof A === "string" ? new mg7.URL(A) : A, this.proxyHeaders = q?.headers ?? {}, HP6("Creating new HttpProxyAgent instance: %o", this.proxy.href);
            let K = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
                Y = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
            this.connectOpts = {
                ...q ? m59(q, "headers") : null,
                host: K,
                port: Y
            }
        }
        addRequest(A, q) {
            A._header = null, this.setRequestProps(A, q), super.addRequest(A, q)
        }
        setRequestProps(A, q) {
            let {
                proxy: K
            } = this, Y = q.secureEndpoint ? "https:" : "http:", z = A.getHeader("host") || "localhost", _ = `${Y}//${z}`, w = new mg7.URL(A.path, _);
            if (q.port !== 80) w.port = String(q.port);
            A.path = String(w);
            let O = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
                ...this.proxyHeaders
            };
            if (K.username || K.password) {
                let $ = `${decodeURIComponent(K.username)}:${decodeURIComponent(K.password)}`;
                O["Proxy-Authorization"] = `Basic ${Buffer.from($).toString("base64")}`
            }
            if (!O["Proxy-Connection"]) O["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
            for (let $ of Object.keys(O)) {
                let H = O[$];
                if (H) A.setHeader($, H)
            }
        }
        async connect(A, q) {
            if (A._header = null, !A.path.includes("://")) this.setRequestProps(A, q);
            let K, Y;
            if (HP6("Regenerating stored HTTP header string for request"), A._implicitHeader(), A.outputData && A.outputData.length > 0) HP6("Patching connection write() output buffer with updated header"), K = A.outputData[0].data, Y = K.indexOf(`\r
\r
`) + 4, A.outputData[0].data = A._header + K.substring(Y), HP6("Output buffer: %o", A.outputData[0].data);
            let z;
            if (this.proxy.protocol === "https:") HP6("Creating `tls.Socket`: %o", this.connectOpts), z = I59.connect(this.connectOpts);
            else HP6("Creating `net.Socket`: %o", this.connectOpts), z = C59.connect(this.connectOpts);
            return await (0, x59.once)(z, "connect"), z
        }
    }
    jX8.protocols = ["http", "https"];
    QL.HttpProxyAgent = jX8;

    function m59(A, ...q) {
        let K = {},
            Y;
        for (Y in A)
            if (!q.includes(Y)) K[Y] = A[Y];
        return K
    }
})
// @from(Ln 175974, Col 0)
function Hj1(A) {
    if (process.env[A]) return process.env[A];
    else if (process.env[A.toLowerCase()]) return process.env[A.toLowerCase()];
    return
}
// @from(Ln 175980, Col 0)
function U59() {
    if (!process) return;
    let A = Hj1(B59),
        q = Hj1(F59),
        K = Hj1(g59);
    return A || q || K
}
// @from(Ln 175988, Col 0)
function d59(A, q, K) {
    if (q.length === 0) return !1;
    let Y = new URL(A).hostname;
    if (K === null || K === void 0 ? void 0 : K.has(Y)) return K.get(Y);
    let z = !1;
    for (let _ of q)
        if (_[0] === ".") {
            if (Y.endsWith(_)) z = !0;
            else if (Y.length === _.length - 1 && Y === _.slice(1)) z = !0
        } else if (Y === _) z = !0;
    return K === null || K === void 0 || K.set(Y, z), z
}
// @from(Ln 176001, Col 0)
function c59() {
    let A = Hj1(p59);
    if (cg7 = !0, A) return A.split(",").map((q) => q.trim()).filter((q) => q.length);
    return []
}
// @from(Ln 176007, Col 0)
function l59() {
    let A = U59();
    return A ? new URL(A) : void 0
}
// @from(Ln 176012, Col 0)
function pg7(A) {
    let q;
    try {
        q = new URL(A.host)
    } catch (K) {
        throw Error(`Expecting a valid host string in proxy settings, but found "${A.host}".`)
    }
    if (q.port = String(A.port), A.username) q.username = A.username;
    if (A.password) q.password = A.password;
    return q
}
// @from(Ln 176024, Col 0)
function Qg7(A, q, K) {
    if (A.agent) return;
    let z = new URL(A.url).protocol !== "https:";
    if (A.tlsSettings) lC.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
    let _ = A.headers.toJSON();
    if (z) {
        if (!q.httpProxyAgent) q.httpProxyAgent = new dg7.HttpProxyAgent(K, {
            headers: _
        });
        A.agent = q.httpProxyAgent
    } else {
        if (!q.httpsProxyAgent) q.httpsProxyAgent = new Ug7.HttpsProxyAgent(K, {
            headers: _
        });
        A.agent = q.httpsProxyAgent
    }
}
// @from(Ln 176042, Col 0)
function MX8(A, q) {
    if (!cg7) Fg7.push(...c59());
    let K = A ? pg7(A) : l59(),
        Y = {};
    return {
        name: JX8,
        async sendRequest(z, _) {
            var w;
            if (!z.proxySettings && K && !d59(z.url, (w = q === null || q === void 0 ? void 0 : q.customNoProxyList) !== null && w !== void 0 ? w : Fg7, (q === null || q === void 0 ? void 0 : q.customNoProxyList) ? void 0 : Q59)) Qg7(z, Y, K);
            else if (z.proxySettings) Qg7(z, Y, pg7(z.proxySettings));
            return _(z)
        }
    }
}
// @from(Ln 176056, Col 4)
Ug7
// @from(Ln 176056, Col 9)
dg7
// @from(Ln 176056, Col 14)
B59 = "HTTPS_PROXY"
// @from(Ln 176057, Col 4)
g59 = "HTTP_PROXY"
// @from(Ln 176058, Col 4)
F59 = "ALL_PROXY"
// @from(Ln 176059, Col 4)
p59 = "NO_PROXY"
// @from(Ln 176060, Col 4)
JX8 = "proxyPolicy"
// @from(Ln 176061, Col 4)
Fg7
// @from(Ln 176061, Col 9)
cg7 = !1
// @from(Ln 176062, Col 4)
Q59
// @from(Ln 176063, Col 4)
lg7 = E(() => {
    zj1();
    Ug7 = t(yR6(), 1), dg7 = t(gg7(), 1), Fg7 = [], Q59 = new Map
})
// @from(Ln 176068, Col 0)
function DX8(A = {}) {
    let {
        maxRetries: q = 20
    } = A;
    return {
        name: "redirectPolicy",
        async sendRequest(K, Y) {
            let z = await Y(K);
            return ng7(Y, z, q)
        }
    }
}
// @from(Ln 176080, Col 0)
async function ng7(A, q, K, Y = 0) {
    let {
        request: z,
        status: _,
        headers: w
    } = q, O = w.get("location");
    if (O && (_ === 300 || _ === 301 && ig7.includes(z.method) || _ === 302 && ig7.includes(z.method) || _ === 303 && z.method === "POST" || _ === 307) && Y < K) {
        let $ = new URL(O, z.url);
        if (z.url = $.toString(), _ === 303) z.method = "GET", z.headers.delete("Content-Length"), delete z.body;
        z.headers.delete("Authorization");
        let H = await A(z);
        return ng7(A, H, K, Y + 1)
    }
    return q
}
// @from(Ln 176095, Col 4)
ig7
// @from(Ln 176096, Col 4)
rg7 = E(() => {
    ig7 = ["GET", "HEAD"]
})
// @from(Ln 176100, Col 0)
function XX8(A) {
    return {
        name: "tlsPolicy",
        sendRequest: async (q, K) => {
            if (!q.tlsSettings) q.tlsSettings = A;
            return K(q)
        }
    }
}
// @from(Ln 176109, Col 4)
iC = E(() => {
    Tg7();
    oD8();
    yg7();
    Lg7();
    ug7();
    lg7();
    rg7()
})
// @from(Ln 176119, Col 0)
function og7(A = {}) {
    return wX8(Object.assign({
        logger: UU.info
    }, A))
}
// @from(Ln 176124, Col 4)
ag7 = E(() => {
    wj1();
    iC()
})
// @from(Ln 176129, Col 0)
function sg7(A = {}) {
    return DX8(A)
}
// @from(Ln 176132, Col 4)
tg7 = E(() => {
    iC()
})
// @from(Ln 176138, Col 0)
function eg7() {
    return "User-Agent"
}
// @from(Ln 176141, Col 0)
async function AF7(A) {
    if (jj1 && jj1.versions) {
        let q = jj1.versions;
        if (q.bun) A.set("Bun", q.bun);
        else if (q.deno) A.set("Deno", q.deno);
        else if (q.node) A.set("Node", q.node)
    }
    A.set("OS", `(${jP6.arch()}-${jP6.type()}-${jP6.release()})`)
}
// @from(Ln 176150, Col 4)
qF7 = () => {}
// @from(Ln 176151, Col 4)
Jj1 = "1.21.0"
// @from(Ln 176152, Col 4)
KF7 = 3
// @from(Ln 176154, Col 0)
function s59(A) {
    let q = [];
    for (let [K, Y] of A) {
        let z = Y ? `${K}/${Y}` : K;
        q.push(z)
    }
    return q.join(" ")
}
// @from(Ln 176163, Col 0)
function YF7() {
    return eg7()
}
// @from(Ln 176166, Col 0)
async function Mj1(A) {
    let q = new Map;
    q.set("core-rest-pipeline", Jj1), await AF7(q);
    let K = s59(q);
    return A ? `${A} ${K}` : K
}
// @from(Ln 176172, Col 4)
PX8 = E(() => {
    qF7()
})
// @from(Ln 176176, Col 0)
function _F7(A = {}) {
    let q = Mj1(A.userAgentPrefix);
    return {
        name: t59,
        async sendRequest(K, Y) {
            if (!K.headers.has(zF7)) K.headers.set(zF7, await q);
            return Y(K)
        }
    }
}
// @from(Ln 176186, Col 4)
zF7
// @from(Ln 176186, Col 9)
t59 = "userAgentPolicy"
// @from(Ln 176187, Col 4)
wF7 = E(() => {
    PX8();
    zF7 = YF7()
})
// @from(Ln 176191, Col 4)
Dj1 = E(() => {
    lD8();
    uD8();
    KX8();
    Gm6()
})
// @from(Ln 176197, Col 4)
JP6
// @from(Ln 176198, Col 4)
OF7 = E(() => {
    JP6 = class JP6 extends Error {
        constructor(A) {
            super(A);
            this.name = "AbortError"
        }
    }
})
// @from(Ln 176206, Col 4)
WX8 = E(() => {
    OF7()
})
// @from(Ln 176210, Col 0)
function $F7(A, q) {
    let {
        cleanupBeforeAbort: K,
        abortSignal: Y,
        abortErrorMsg: z
    } = q !== null && q !== void 0 ? q : {};
    return new Promise((_, w) => {
        function O() {
            w(new JP6(z !== null && z !== void 0 ? z : "The operation was aborted."))
        }

        function $() {
            Y === null || Y === void 0 || Y.removeEventListener("abort", H)
        }

        function H() {
            K === null || K === void 0 || K(), $(), O()
        }
        if (Y === null || Y === void 0 ? void 0 : Y.aborted) return O();
        try {
            A((j) => {
                $(), _(j)
            }, (j) => {
                $(), w(j)
            })
        } catch (j) {
            w(j)
        }
        Y === null || Y === void 0 || Y.addEventListener("abort", H)
    })
}
// @from(Ln 176241, Col 4)
HF7 = E(() => {
    WX8()
})
// @from(Ln 176245, Col 0)
function ZX8(A, q) {
    let K, {
        abortSignal: Y,
        abortErrorMsg: z
    } = q !== null && q !== void 0 ? q : {};
    return $F7((_) => {
        K = setTimeout(_, A)
    }, {
        cleanupBeforeAbort: () => clearTimeout(K),
        abortSignal: Y,
        abortErrorMsg: z !== null && z !== void 0 ? z : q39
    })
}
// @from(Ln 176258, Col 4)
q39 = "The delay was aborted."
// @from(Ln 176259, Col 4)
jF7 = E(() => {
    HF7()
})
// @from(Ln 176263, Col 0)
function MP6(A) {
    if (pK6(A)) return A.message;
    else {
        let q;
        try {
            if (typeof A === "object" && A) q = JSON.stringify(A);
            else q = String(A)
        } catch (K) {
            q = "[unable to stringify input]"
        }
        return `Unknown error ${q}`
    }
}
// @from(Ln 176276, Col 4)
JF7 = E(() => {
    Dj1()
})
// @from(Ln 176280, Col 0)
function MF7(A, q) {
    return vm6(A, q)
}
// @from(Ln 176284, Col 0)
function Xj1(A) {
    return pK6(A)
}
// @from(Ln 176287, Col 4)
Pj1
// @from(Ln 176287, Col 9)
km6
// @from(Ln 176288, Col 4)
Es = E(() => {
    Dj1();
    jF7();
    JF7();
    Pj1 = $P6, km6 = $P6
})
// @from(Ln 176295, Col 0)
function GX8(A) {
    return typeof A[DF7] === "function"
}
// @from(Ln 176299, Col 0)
function XF7(A) {
    if (GX8(A)) return A[DF7]();
    else return A
}
// @from(Ln 176303, Col 4)
DF7
// @from(Ln 176304, Col 4)
PF7 = E(() => {
    DF7 = Symbol("rawContent")
})
// @from(Ln 176308, Col 0)
function WF7() {
    let A = HX8();
    return {
        name: fX8,
        sendRequest: async (q, K) => {
            if (q.multipartBody) {
                for (let Y of q.multipartBody.parts)
                    if (GX8(Y.body)) Y.body = XF7(Y.body)
            }
            return A.sendRequest(q, K)
        }
    }
}
// @from(Ln 176321, Col 4)
fX8
// @from(Ln 176322, Col 4)
ZF7 = E(() => {
    iC();
    PF7();
    fX8 = $j1
})
// @from(Ln 176328, Col 0)
function GF7() {
    return dD8()
}
// @from(Ln 176331, Col 4)
fF7 = E(() => {
    iC()
})
// @from(Ln 176335, Col 0)
function TF7(A = {}) {
    return sD8(A)
}
// @from(Ln 176338, Col 4)
vF7 = E(() => {
    iC()
})
// @from(Ln 176342, Col 0)
function NF7() {
    return zX8()
}
// @from(Ln 176345, Col 4)
VF7 = E(() => {
    iC()
})
// @from(Ln 176349, Col 0)
function kF7(A, q) {
    return MX8(A, q)
}
// @from(Ln 176352, Col 4)
EF7 = E(() => {
    iC()
})
// @from(Ln 176356, Col 0)
function yF7(A = "x-ms-client-request-id") {
    return {
        name: "setClientRequestIdPolicy",
        async sendRequest(q, K) {
            if (!q.headers.has(A)) q.headers.set(A, q.requestId);
            return K(q)
        }
    }
}
// @from(Ln 176366, Col 0)
function LF7(A) {
    return UD8(A)
}
// @from(Ln 176369, Col 4)
RF7 = E(() => {
    iC()
})
// @from(Ln 176373, Col 0)
function hF7(A) {
    return XX8(A)
}
// @from(Ln 176376, Col 4)
SF7 = E(() => {
    iC()
})
// @from(Ln 176380, Col 0)
function CF7(A = {}) {
    let q = new Em6(A.parentContext);
    if (A.span) q = q.setValue(DP6.span, A.span);
    if (A.namespace) q = q.setValue(DP6.namespace, A.namespace);
    return q
}
// @from(Ln 176386, Col 0)
class Em6 {
    constructor(A) {
        this._contextMap = A instanceof Em6 ? new Map(A._contextMap) : new Map
    }
    setValue(A, q) {
        let K = new Em6(this);
        return K._contextMap.set(A, q), K
    }
    getValue(A) {
        return this._contextMap.get(A)
    }
    deleteValue(A) {
        let q = new Em6(this);
        return q._contextMap.delete(A), q
    }
}
// @from(Ln 176402, Col 4)
DP6
// @from(Ln 176403, Col 4)
TX8 = E(() => {
    DP6 = {
        span: Symbol.for("@azure/core-tracing span"),
        namespace: Symbol.for("@azure/core-tracing namespace")
    }
})
// @from(Ln 176409, Col 4)
xF7 = x((IF7) => {
    Object.defineProperty(IF7, "__esModule", {
        value: !0
    });
    IF7.state = void 0;
    IF7.state = {
        instrumenterImplementation: void 0
    }
})
// @from(Ln 176418, Col 4)
uF7
// @from(Ln 176418, Col 9)
Wj1
// @from(Ln 176419, Col 4)
mF7 = E(() => {
    uF7 = t(xF7(), 1), Wj1 = uF7.state
})
// @from(Ln 176423, Col 0)
function K39() {
    return {
        end: () => {},
        isRecording: () => !1,
        recordException: () => {},
        setAttribute: () => {},
        setStatus: () => {},
        addEvent: () => {}
    }
}
// @from(Ln 176434, Col 0)
function Y39() {
    return {
        createRequestHeaders: () => {
            return {}
        },
        parseTraceparentHeader: () => {
            return
        },
        startSpan: (A, q) => {
            return {
                span: K39(),
                tracingContext: CF7({
                    parentContext: q.tracingContext
                })
            }
        },
        withContext(A, q, ...K) {
            return q(...K)
        }
    }
}
// @from(Ln 176456, Col 0)
function ym6() {
    if (!Wj1.instrumenterImplementation) Wj1.instrumenterImplementation = Y39();
    return Wj1.instrumenterImplementation
}
// @from(Ln 176460, Col 4)
BF7 = E(() => {
    TX8();
    mF7()
})
// @from(Ln 176465, Col 0)
function Lm6(A) {
    let {
        namespace: q,
        packageName: K,
        packageVersion: Y
    } = A;

    function z(H, j, J) {
        var M;
        let D = ym6().startSpan(H, Object.assign(Object.assign({}, J), {
                packageName: K,
                packageVersion: Y,
                tracingContext: (M = j === null || j === void 0 ? void 0 : j.tracingOptions) === null || M === void 0 ? void 0 : M.tracingContext
            })),
            X = D.tracingContext,
            P = D.span;
        if (!X.getValue(DP6.namespace)) X = X.setValue(DP6.namespace, q);
        P.setAttribute("az.namespace", X.getValue(DP6.namespace));
        let W = Object.assign({}, j, {
            tracingOptions: Object.assign(Object.assign({}, j === null || j === void 0 ? void 0 : j.tracingOptions), {
                tracingContext: X
            })
        });
        return {
            span: P,
            updatedOptions: W
        }
    }
    async function _(H, j, J, M) {
        let {
            span: D,
            updatedOptions: X
        } = z(H, j, M);
        try {
            let P = await w(X.tracingOptions.tracingContext, () => Promise.resolve(J(X, D)));
            return D.setStatus({
                status: "success"
            }), P
        } catch (P) {
            throw D.setStatus({
                status: "error",
                error: P
            }), P
        } finally {
            D.end()
        }
    }

    function w(H, j, ...J) {
        return ym6().withContext(H, j, ...J)
    }

    function O(H) {
        return ym6().parseTraceparentHeader(H)
    }

    function $(H) {
        return ym6().createRequestHeaders(H)
    }
    return {
        startSpan: z,
        withSpan: _,
        withContext: w,
        parseTraceparentHeader: O,
        createRequestHeaders: $
    }
}
// @from(Ln 176532, Col 4)
gF7 = E(() => {
    BF7();
    TX8()
})
// @from(Ln 176536, Col 4)
vX8 = E(() => {
    gF7()
})
// @from(Ln 176540, Col 0)
function Rm6(A) {
    return BD8(A)
}
// @from(Ln 176543, Col 4)
XP6
// @from(Ln 176544, Col 4)
Zj1 = E(() => {
    OP6();
    XP6 = vv
})
// @from(Ln 176549, Col 0)
function FF7(A = {}) {
    let q = Mj1(A.userAgentPrefix),
        K = new Fm({
            additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
        }),
        Y = _39();
    return {
        name: z39,
        async sendRequest(z, _) {
            var w;
            if (!Y) return _(z);
            let O = await q,
                $ = {
                    "http.url": K.sanitizeUrl(z.url),
                    "http.method": z.method,
                    "http.user_agent": O,
                    requestId: z.requestId
                };
            if (O) $["http.user_agent"] = O;
            let {
                span: H,
                tracingContext: j
            } = (w = w39(Y, z, $)) !== null && w !== void 0 ? w : {};
            if (!H || !j) return _(z);
            try {
                let J = await Y.withContext(j, _, z);
                return $39(H, J), J
            } catch (J) {
                throw O39(H, J), J
            }
        }
    }
}
// @from(Ln 176583, Col 0)
function _39() {
    try {
        return Lm6({
            namespace: "",
            packageName: "@azure/core-rest-pipeline",
            packageVersion: Jj1
        })
    } catch (A) {
        UU.warning(`Error when creating the TracingClient: ${MP6(A)}`);
        return
    }
}
// @from(Ln 176596, Col 0)
function w39(A, q, K) {
    try {
        let {
            span: Y,
            updatedOptions: z
        } = A.startSpan(`HTTP ${q.method}`, {
            tracingOptions: q.tracingOptions
        }, {
            spanKind: "client",
            spanAttributes: K
        });
        if (!Y.isRecording()) {
            Y.end();
            return
        }
        let _ = A.createRequestHeaders(z.tracingOptions.tracingContext);
        for (let [w, O] of Object.entries(_)) q.headers.set(w, O);
        return {
            span: Y,
            tracingContext: z.tracingOptions.tracingContext
        }
    } catch (Y) {
        UU.warning(`Skipping creating a tracing span due to an error: ${MP6(Y)}`);
        return
    }
}
// @from(Ln 176623, Col 0)
function O39(A, q) {
    try {
        if (A.setStatus({
                status: "error",
                error: Xj1(q) ? q : void 0
            }), Rm6(q) && q.statusCode) A.setAttribute("http.status_code", q.statusCode);
        A.end()
    } catch (K) {
        UU.warning(`Skipping tracing span processing due to an error: ${MP6(K)}`)
    }
}
// @from(Ln 176635, Col 0)
function $39(A, q) {
    try {
        A.setAttribute("http.status_code", q.status);
        let K = q.headers.get("x-ms-request-id");
        if (K) A.setAttribute("serviceRequestId", K);
        if (q.status >= 400) A.setStatus({
            status: "error"
        });
        A.end()
    } catch (K) {
        UU.warning(`Skipping tracing span processing due to an error: ${MP6(K)}`)
    }
}
// @from(Ln 176648, Col 4)
z39 = "tracingPolicy"
// @from(Ln 176649, Col 4)
pF7 = E(() => {
    vX8();
    PX8();
    wj1();
    Es();
    Zj1();
    Dj1()
})
// @from(Ln 176658, Col 0)
function Gj1(A) {
    if (A instanceof AbortSignal) return {
        abortSignal: A
    };
    if (A.aborted) return {
        abortSignal: AbortSignal.abort(A.reason)
    };
    let q = new AbortController,
        K = !0;

    function Y() {
        if (K) A.removeEventListener("abort", z), K = !1
    }

    function z() {
        q.abort(A.reason), Y()
    }
    return A.addEventListener("abort", z), {
        abortSignal: q.signal,
        cleanup: Y
    }
}
// @from(Ln 176681, Col 0)
function QF7() {
    return {
        name: H39,
        sendRequest: async (A, q) => {
            if (!A.abortSignal) return q(A);
            let {
                abortSignal: K,
                cleanup: Y
            } = Gj1(A.abortSignal);
            A.abortSignal = K;
            try {
                return await q(A)
            } finally {
                Y === null || Y === void 0 || Y()
            }
        }
    }
}
// @from(Ln 176699, Col 4)
H39 = "wrapAbortSignalLikePolicy"
// @from(Ln 176700, Col 4)
UF7 = () => {}
// @from(Ln 176702, Col 0)
function NX8(A) {
    var q;
    let K = Tm6();
    if (km6) {
        if (A.agent) K.addPolicy(LF7(A.agent));
        if (A.tlsOptions) K.addPolicy(hF7(A.tlsOptions));
        K.addPolicy(kF7(A.proxyOptions)), K.addPolicy(GF7())
    }
    if (K.addPolicy(QF7()), K.addPolicy(NF7(), {
            beforePolicies: [fX8]
        }), K.addPolicy(_F7(A.userAgentOptions)), K.addPolicy(yF7((q = A.telemetryOptions) === null || q === void 0 ? void 0 : q.clientRequestIdHeaderName)), K.addPolicy(WF7(), {
            afterPhase: "Deserialize"
        }), K.addPolicy(TF7(A.retryOptions), {
            phase: "Retry"
        }), K.addPolicy(FF7(Object.assign(Object.assign({}, A.userAgentOptions), A.loggingOptions)), {
            afterPhase: "Retry"
        }), km6) K.addPolicy(sg7(A.redirectOptions), {
        afterPhase: "Retry"
    });
    return K.addPolicy(og7(A.loggingOptions), {
        afterPhase: "Sign"
    }), K
}
// @from(Ln 176725, Col 4)
dF7 = E(() => {
    ag7();
    QD8();
    tg7();
    wF7();
    ZF7();
    fF7();
    vF7();
    VF7();
    Es();
    EF7();
    RF7();
    SF7();
    pF7();
    UF7()
})
// @from(Ln 176742, Col 0)
function VX8() {
    let A = pD8();
    return {
        async sendRequest(q) {
            let {
                abortSignal: K,
                cleanup: Y
            } = q.abortSignal ? Gj1(q.abortSignal) : {};
            try {
                return q.abortSignal = K, await A.sendRequest(q)
            } finally {
                Y === null || Y === void 0 || Y()
            }
        }
    }
}
// @from(Ln 176758, Col 4)
cF7 = E(() => {
    OP6()
})
// @from(Ln 176762, Col 0)
function dU(A) {
    return gm(A)
}
// @from(Ln 176765, Col 4)
lF7 = E(() => {
    OP6()
})
// @from(Ln 176769, Col 0)
function fk(A) {
    return bD8(A)
}
// @from(Ln 176772, Col 4)
iF7 = E(() => {
    OP6()
})
// @from(Ln 176776, Col 0)
function kX8(A, q = {
    maxRetries: KF7
}) {
    return Vm6(A, Object.assign({
        logger: j39
    }, q))
}
// @from(Ln 176783, Col 4)
j39
// @from(Ln 176784, Col 4)
nF7 = E(() => {
    FK6();
    iC();
    j39 = Vs("core-rest-pipeline retryPolicy")
})
// @from(Ln 176789, Col 0)
async function M39(A, q, K) {
    async function Y() {
        if (Date.now() < K) try {
            return await A()
        } catch (_) {
            return null
        } else {
            let _ = await A();
            if (_ === null) throw Error("Failed to refresh access token.");
            return _
        }
    }
    let z = await Y();
    while (z === null) await ZX8(q), z = await Y();
    return z
}
// @from(Ln 176806, Col 0)
function rF7(A, q) {
    let K = null,
        Y = null,
        z, _ = Object.assign(Object.assign({}, J39), q),
        w = {
            get isRefreshing() {
                return K !== null
            },
            get shouldRefresh() {
                var $;
                if (w.isRefreshing) return !1;
                if ((Y === null || Y === void 0 ? void 0 : Y.refreshAfterTimestamp) && Y.refreshAfterTimestamp < Date.now()) return !0;
                return (($ = Y === null || Y === void 0 ? void 0 : Y.expiresOnTimestamp) !== null && $ !== void 0 ? $ : 0) - _.refreshWindowInMs < Date.now()
            },
            get mustRefresh() {
                return Y === null || Y.expiresOnTimestamp - _.forcedRefreshWindowInMs < Date.now()
            }
        };

    function O($, H) {
        var j;
        if (!w.isRefreshing) K = M39(() => A.getToken($, H), _.retryIntervalInMs, (j = Y === null || Y === void 0 ? void 0 : Y.expiresOnTimestamp) !== null && j !== void 0 ? j : Date.now()).then((M) => {
            return K = null, Y = M, z = H.tenantId, Y
        }).catch((M) => {
            throw K = null, Y = null, z = void 0, M
        });
        return K
    }
    return async ($, H) => {
        let j = Boolean(H.claims),
            J = z !== H.tenantId;
        if (j) Y = null;
        if (J || j || w.mustRefresh) return O($, H);
        if (w.shouldRefresh) O($, H);
        return Y
    }
}
// @from(Ln 176843, Col 4)
J39
// @from(Ln 176844, Col 4)
oF7 = E(() => {
    Es();
    J39 = {
        forcedRefreshWindowInMs: 1000,
        retryIntervalInMs: 3000,
        refreshWindowInMs: 120000
    }
})
// @from(Ln 176852, Col 0)
async function fj1(A, q) {
    try {
        return [await q(A), void 0]
    } catch (K) {
        if (Rm6(K) && K.response) return [K.response, K];
        else throw K
    }
}
// @from(Ln 176860, Col 0)
async function D39(A) {
    let {
        scopes: q,
        getAccessToken: K,
        request: Y
    } = A, z = {
        abortSignal: Y.abortSignal,
        tracingOptions: Y.tracingOptions,
        enableCae: !0
    }, _ = await K(q, z);
    if (_) A.request.headers.set("Authorization", `Bearer ${_.token}`)
}
// @from(Ln 176873, Col 0)
function aF7(A) {
    return A.status === 401 && A.headers.has("WWW-Authenticate")
}
// @from(Ln 176876, Col 0)
async function sF7(A, q) {
    var K;
    let {
        scopes: Y
    } = A, z = await A.getAccessToken(Y, {
        enableCae: !0,
        claims: q
    });
    if (!z) return !1;
    return A.request.headers.set("Authorization", `${(K=z.tokenType)!==null&&K!==void 0?K:"Bearer"} ${z.token}`), !0
}
// @from(Ln 176888, Col 0)
function hm6(A) {
    var q, K, Y;
    let {
        credential: z,
        scopes: _,
        challengeCallbacks: w
    } = A, O = A.logger || UU, $ = {
        authorizeRequest: (K = (q = w === null || w === void 0 ? void 0 : w.authorizeRequest) === null || q === void 0 ? void 0 : q.bind(w)) !== null && K !== void 0 ? K : D39,
        authorizeRequestOnChallenge: (Y = w === null || w === void 0 ? void 0 : w.authorizeRequestOnChallenge) === null || Y === void 0 ? void 0 : Y.bind(w)
    }, H = z ? rF7(z) : () => Promise.resolve(null);
    return {
        name: eF7,
        async sendRequest(j, J) {
            if (!j.url.toLowerCase().startsWith("https://")) throw Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
            await $.authorizeRequest({
                scopes: Array.isArray(_) ? _ : [_],
                request: j,
                getAccessToken: H,
                logger: O
            });
            let M, D, X;
            if ([M, D] = await fj1(j, J), aF7(M)) {
                let P = tF7(M.headers.get("WWW-Authenticate"));
                if (P) {
                    let W;
                    try {
                        W = atob(P)
                    } catch (Z) {
                        return O.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${P}`), M
                    }
                    if (X = await sF7({
                            scopes: Array.isArray(_) ? _ : [_],
                            response: M,
                            request: j,
                            getAccessToken: H,
                            logger: O
                        }, W), X)[M, D] = await fj1(j, J)
                } else if ($.authorizeRequestOnChallenge) {
                    if (X = await $.authorizeRequestOnChallenge({
                            scopes: Array.isArray(_) ? _ : [_],
                            request: j,
                            response: M,
                            getAccessToken: H,
                            logger: O
                        }), X)[M, D] = await fj1(j, J);
                    if (aF7(M)) {
                        if (P = tF7(M.headers.get("WWW-Authenticate")), P) {
                            let W;
                            try {
                                W = atob(P)
                            } catch (Z) {
                                return O.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${P}`), M
                            }
                            if (X = await sF7({
                                    scopes: Array.isArray(_) ? _ : [_],
                                    response: M,
                                    request: j,
                                    getAccessToken: H,
                                    logger: O
                                }, W), X)[M, D] = await fj1(j, J)
                        }
                    }
                }
            }
            if (D) throw D;
            else return M
        }
    }
}
// @from(Ln 176958, Col 0)
function X39(A) {
    let q = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g,
        K = /(\w+)="([^"]*)"/g,
        Y = [],
        z;
    while ((z = q.exec(A)) !== null) {
        let _ = z[1],
            w = z[2],
            O = {},
            $;
        while (($ = K.exec(w)) !== null) O[$[1]] = $[2];
        Y.push({
            scheme: _,
            params: O
        })
    }
    return Y
}
// @from(Ln 176977, Col 0)
function tF7(A) {
    var q;
    if (!A) return;
    return (q = X39(A).find((Y) => Y.scheme === "Bearer" && Y.params.claims && Y.params.error === "insufficient_claims")) === null || q === void 0 ? void 0 : q.params.claims
}
// @from(Ln 176982, Col 4)
eF7 = "bearerTokenAuthenticationPolicy"
// @from(Ln 176983, Col 4)
Ap7 = E(() => {
    oF7();
    wj1();
    Zj1()
})
// @from(Ln 176988, Col 4)
Qm = E(() => {
    QD8();
    dF7();
    cF7();
    lF7();
    iF7();
    Zj1();
    nF7();
    Ap7()
})
// @from(Ln 176998, Col 4)
EX8 = "$"
// @from(Ln 176999, Col 4)
Tj1 = "_"
// @from(Ln 177001, Col 0)
function P39(A, q) {
    return q !== "Composite" && q !== "Dictionary" && (typeof A === "string" || typeof A === "number" || typeof A === "boolean" || (q === null || q === void 0 ? void 0 : q.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i)) !== null || A === void 0 || A === null)
}
// @from(Ln 177005, Col 0)
function W39(A) {
    let q = Object.assign(Object.assign({}, A.headers), A.body);
    if (A.hasNullableType && Object.getOwnPropertyNames(q).length === 0) return A.shouldWrapBody ? {
        body: null
    } : null;
    else return A.shouldWrapBody ? Object.assign(Object.assign({}, A.headers), {
        body: A.body
    }) : q
}
// @from(Ln 177015, Col 0)
function yX8(A, q) {
    var K, Y;
    let z = A.parsedHeaders;
    if (A.request.method === "HEAD") return Object.assign(Object.assign({}, z), {
        body: A.parsedBody
    });
    let _ = q && q.bodyMapper,
        w = Boolean(_ === null || _ === void 0 ? void 0 : _.nullable),
        O = _ === null || _ === void 0 ? void 0 : _.type.name;
    if (O === "Stream") return Object.assign(Object.assign({}, z), {
        blobBody: A.blobBody,
        readableStreamBody: A.readableStreamBody
    });
    let $ = O === "Composite" && _.type.modelProperties || {},
        H = Object.keys($).some((j) => $[j].serializedName === "");
    if (O === "Sequence" || H) {
        let j = (K = A.parsedBody) !== null && K !== void 0 ? K : [];
        for (let J of Object.keys($))
            if ($[J].serializedName) j[J] = (Y = A.parsedBody) === null || Y === void 0 ? void 0 : Y[J];
        if (z)
            for (let J of Object.keys(z)) j[J] = z[J];
        return w && !A.parsedBody && !z && Object.getOwnPropertyNames($).length === 0 ? null : j
    }
    return W39({
        body: A.parsedBody,
        headers: z,
        hasNullableType: w,
        shouldWrapBody: P39(A.parsedBody, O)
    })
}
// @from(Ln 177045, Col 4)
qp7 = () => {}
// @from(Ln 177046, Col 4)
cU
// @from(Ln 177047, Col 4)
vj1 = E(() => {
    cU = {
        Base64Url: "Base64Url",
        Boolean: "Boolean",
        ByteArray: "ByteArray",
        Composite: "Composite",
        Date: "Date",
        DateTime: "DateTime",
        DateTimeRfc1123: "DateTimeRfc1123",
        Dictionary: "Dictionary",
        Enum: "Enum",
        Number: "Number",
        Object: "Object",
        Sequence: "Sequence",
        String: "String",
        Stream: "Stream",
        TimeSpan: "TimeSpan",
        UnixTime: "UnixTime"
    }
})
// @from(Ln 177067, Col 4)
zp7 = x((Kp7) => {
    Object.defineProperty(Kp7, "__esModule", {
        value: !0
    });
    Kp7.state = void 0;
    Kp7.state = {
        operationRequestMap: new WeakMap
    }
})
// @from(Ln 177076, Col 4)
_p7
// @from(Ln 177076, Col 9)
LX8
// @from(Ln 177077, Col 4)
wp7 = E(() => {
    _p7 = t(zp7(), 1), LX8 = _p7.state
})
// @from(Ln 177081, Col 0)
function ys(A, q, K) {
    let {
        parameterPath: Y,
        mapper: z
    } = q, _;
    if (typeof Y === "string") Y = [Y];
    if (Array.isArray(Y)) {
        if (Y.length > 0)
            if (z.isConstant) _ = z.defaultValue;
            else {
                let w = Op7(A, Y);
                if (!w.propertyFound && K) w = Op7(K, Y);
                let O = !1;
                if (!w.propertyFound) O = z.required || Y[0] === "options" && Y.length === 2;
                _ = O ? z.defaultValue : w.propertyValue
            }
    } else {
        if (z.required) _ = {};
        for (let w in Y) {
            let O = z.type.modelProperties[w],
                $ = Y[w],
                H = ys(A, {
                    parameterPath: $,
                    mapper: O
                }, K);
            if (H !== void 0) {
                if (!_) _ = {};
                _[w] = H
            }
        }
    }
    return _
}
// @from(Ln 177115, Col 0)
function Op7(A, q) {
    let K = {
            propertyFound: !1
        },
        Y = 0;
    for (; Y < q.length; ++Y) {
        let z = q[Y];
        if (A && z in A) A = A[z];
        else break
    }
    if (Y === q.length) K.propertyValue = A, K.propertyFound = !0;
    return K
}
// @from(Ln 177129, Col 0)
function Z39(A) {
    return $p7 in A
}
// @from(Ln 177133, Col 0)
function lU(A) {
    if (Z39(A)) return lU(A[$p7]);
    let q = LX8.operationRequestMap.get(A);
    if (!q) q = {}, LX8.operationRequestMap.set(A, q);
    return q
}
// @from(Ln 177139, Col 4)
$p7
// @from(Ln 177140, Col 4)
Sm6 = E(() => {
    wp7();
    $p7 = Symbol.for("@azure/core-client original request")
})
// @from(Ln 177145, Col 0)
function Hp7(A = {}) {
    var q, K, Y, z, _, w, O;
    let $ = (K = (q = A.expectedContentTypes) === null || q === void 0 ? void 0 : q.json) !== null && K !== void 0 ? K : G39,
        H = (z = (Y = A.expectedContentTypes) === null || Y === void 0 ? void 0 : Y.xml) !== null && z !== void 0 ? z : f39,
        j = A.parseXML,
        J = A.serializerOptions,
        M = {
            xml: {
                rootName: (_ = J === null || J === void 0 ? void 0 : J.xml.rootName) !== null && _ !== void 0 ? _ : "",
                includeRoot: (w = J === null || J === void 0 ? void 0 : J.xml.includeRoot) !== null && w !== void 0 ? w : !1,
                xmlCharKey: (O = J === null || J === void 0 ? void 0 : J.xml.xmlCharKey) !== null && O !== void 0 ? O : Tj1
            }
        };
    return {
        name: T39,
        async sendRequest(D, X) {
            let P = await X(D);
            return V39($, H, P, M, j)
        }
    }
}
// @from(Ln 177167, Col 0)
function v39(A) {
    let q, K = A.request,
        Y = lU(K),
        z = Y === null || Y === void 0 ? void 0 : Y.operationSpec;
    if (z)
        if (!(Y === null || Y === void 0 ? void 0 : Y.operationResponseGetter)) q = z.responses[A.status];
        else q = Y === null || Y === void 0 ? void 0 : Y.operationResponseGetter(z, A);
    return q
}
// @from(Ln 177177, Col 0)
function N39(A) {
    let q = A.request,
        K = lU(q),
        Y = K === null || K === void 0 ? void 0 : K.shouldDeserialize,
        z;
    if (Y === void 0) z = !0;
    else if (typeof Y === "boolean") z = Y;
    else z = Y(A);
    return z
}
// @from(Ln 177187, Col 0)
async function V39(A, q, K, Y, z) {
    let _ = await y39(A, q, K, Y, z);
    if (!N39(_)) return _;
    let w = lU(_.request),
        O = w === null || w === void 0 ? void 0 : w.operationSpec;
    if (!O || !O.responses) return _;
    let $ = v39(_),
        {
            error: H,
            shouldReturnResponse: j
        } = E39(_, O, $, Y);
    if (H) throw H;
    else if (j) return _;
    if ($) {
        if ($.bodyMapper) {
            let J = _.parsedBody;
            if (O.isXML && $.bodyMapper.type.name === cU.Sequence) J = typeof J === "object" ? J[$.bodyMapper.xmlElementName] : [];
            try {
                _.parsedBody = O.serializer.deserialize($.bodyMapper, J, "operationRes.parsedBody", Y)
            } catch (M) {
                throw new XP6(`Error ${M} occurred in deserializing the responseBody - ${_.bodyAsText}`, {
                    statusCode: _.status,
                    request: _.request,
                    response: _
                })
            }
        } else if (O.httpMethod === "HEAD") _.parsedBody = K.status >= 200 && K.status < 300;
        if ($.headersMapper) _.parsedHeaders = O.serializer.deserialize($.headersMapper, _.headers.toJSON(), "operationRes.parsedHeaders", {
            xml: {},
            ignoreUnknownProperties: !0
        })
    }
    return _
}
// @from(Ln 177222, Col 0)
function k39(A) {
    let q = Object.keys(A.responses);
    return q.length === 0 || q.length === 1 && q[0] === "default"
}
// @from(Ln 177227, Col 0)
function E39(A, q, K, Y) {
    var z, _, w, O, $;
    let H = 200 <= A.status && A.status < 300;
    if (k39(q) ? H : !!K)
        if (K) {
            if (!K.isError) return {
                error: null,
                shouldReturnResponse: !1
            }
        } else return {
            error: null,
            shouldReturnResponse: !1
        };
    let J = K !== null && K !== void 0 ? K : q.responses.default,
        M = ((z = A.request.streamResponseStatusCodes) === null || z === void 0 ? void 0 : z.has(A.status)) ? `Unexpected status code: ${A.status}` : A.bodyAsText,
        D = new XP6(M, {
            statusCode: A.status,
            request: A.request,
            response: A
        });
    if (!J && !(((w = (_ = A.parsedBody) === null || _ === void 0 ? void 0 : _.error) === null || w === void 0 ? void 0 : w.code) && (($ = (O = A.parsedBody) === null || O === void 0 ? void 0 : O.error) === null || $ === void 0 ? void 0 : $.message))) throw D;
    let X = J === null || J === void 0 ? void 0 : J.bodyMapper,
        P = J === null || J === void 0 ? void 0 : J.headersMapper;
    try {
        if (A.parsedBody) {
            let W = A.parsedBody,
                Z;
            if (X) {
                let f = W;
                if (q.isXML && X.type.name === cU.Sequence) {
                    f = [];
                    let v = X.xmlElementName;
                    if (typeof W === "object" && v) f = W[v]
                }
                Z = q.serializer.deserialize(X, f, "error.response.parsedBody", Y)
            }
            let G = W.error || Z || W;
            if (D.code = G.code, G.message) D.message = G.message;
            if (X) D.response.parsedBody = Z
        }
        if (A.headers && P) D.response.parsedHeaders = q.serializer.deserialize(P, A.headers.toJSON(), "operationRes.parsedHeaders")
    } catch (W) {
        D.message = `Error "${W.message}" occurred in deserializing the responseBody - "${A.bodyAsText}" for the default response.`
    }
    return {
        error: D,
        shouldReturnResponse: !1
    }
}
// @from(Ln 177276, Col 0)
async function y39(A, q, K, Y, z) {
    var _;
    if (!((_ = K.request.streamResponseStatusCodes) === null || _ === void 0 ? void 0 : _.has(K.status)) && K.bodyAsText) {
        let w = K.bodyAsText,
            O = K.headers.get("Content-Type") || "",
            $ = !O ? [] : O.split(";").map((H) => H.toLowerCase());
        try {
            if ($.length === 0 || $.some((H) => A.indexOf(H) !== -1)) return K.parsedBody = JSON.parse(w), K;
            else if ($.some((H) => q.indexOf(H) !== -1)) {
                if (!z) throw Error("Parsing XML not supported.");
                let H = await z(w, Y.xml);
                return K.parsedBody = H, K
            }
        } catch (H) {
            let j = `Error "${H}" occurred while parsing the response body - ${K.bodyAsText}.`,
                J = H.code || XP6.PARSE_ERROR;
            throw new XP6(j, {
                code: J,
                statusCode: K.status,
                request: K.request,
                response: K
            })
        }
    }
    return K
}
// @from(Ln 177302, Col 4)
G39
// @from(Ln 177302, Col 9)
f39
// @from(Ln 177302, Col 14)
T39 = "deserializationPolicy"
// @from(Ln 177303, Col 4)
jp7 = E(() => {
    Qm();
    vj1();
    Sm6();
    G39 = ["application/json", "text/json"], f39 = ["application/xml", "application/atom+xml"]
})