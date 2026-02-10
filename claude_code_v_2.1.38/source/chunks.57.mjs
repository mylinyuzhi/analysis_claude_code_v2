
// @from(Ln 149159, Col 0)
function hx5(A) {
    var q, K, Y, z, w, H, $;
    let O = {
        cache: {},
        broker: {
            isEnabled: (K = (q = A.brokerOptions) === null || q === void 0 ? void 0 : q.enabled) !== null && K !== void 0 ? K : !1,
            enableMsaPassthrough: (z = (Y = A.brokerOptions) === null || Y === void 0 ? void 0 : Y.legacyEnableMsaPassthrough) !== null && z !== void 0 ? z : !1,
            parentWindowHandle: (w = A.brokerOptions) === null || w === void 0 ? void 0 : w.parentWindowHandle
        }
    };
    if ((H = A.tokenCachePersistenceOptions) === null || H === void 0 ? void 0 : H.enabled) {
        if (T56 === void 0) throw Error(["Persistent token caching was requested, but no persistence provider was configured.", "You must install the identity-cache-persistence plugin package (`npm install --save @azure/identity-cache-persistence`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(cachePersistencePlugin)` before using `tokenCachePersistenceOptions`."].join(" "));
        let _ = A.tokenCachePersistenceOptions.name || M27;
        O.cache.cachePlugin = T56(Object.assign({
            name: `${_}.${j27}`
        }, A.tokenCachePersistenceOptions)), O.cache.cachePluginCae = T56(Object.assign({
            name: `${_}.${D27}`
        }, A.tokenCachePersistenceOptions))
    }
    if (($ = A.brokerOptions) === null || $ === void 0 ? void 0 : $.enabled) {
        if (T3A === void 0) throw Error(["Broker for WAM was requested to be enabled, but no native broker was configured.", "You must install the identity-broker plugin package (`npm install --save @azure/identity-broker`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(createNativeBrokerPlugin())` before using `enableBroker`."].join(" "));
        O.broker.nativeBrokerPlugin = T3A.broker
    }
    return O
}
// @from(Ln 149184, Col 4)
T56 = void 0
// @from(Ln 149185, Col 4)
P27
// @from(Ln 149185, Col 9)
T3A = void 0
// @from(Ln 149186, Col 4)
W27
// @from(Ln 149186, Col 9)
G27
// @from(Ln 149187, Col 4)
v3A = v(() => {
    Tu();
    P27 = {
        setPersistence(A) {
            T56 = A
        }
    }, W27 = {
        setNativeBroker(A) {
            T3A = {
                broker: A
            }
        }
    };
    G27 = {
        generatePluginConfiguration: hx5
    }
})
// @from(Ln 149210, Col 0)
function f27(A, ...q) {
    Z27.stderr.write(`${xx5.format(A,...q)}${Ix5}`)
}
// @from(Ln 149213, Col 4)
V27 = () => {}
// @from(Ln 149215, Col 0)
function L3A(A) {
    T27 = A, E3A = [], k3A = [];
    let q = /\*/g,
        K = A.split(",").map((Y) => Y.trim().replace(q, ".*?"));
    for (let Y of K)
        if (Y.startsWith("-")) k3A.push(new RegExp(`^${Y.substr(1)}$`));
        else E3A.push(new RegExp(`^${Y}$`));
    for (let Y of v56) Y.enabled = R3A(Y.namespace)
}
// @from(Ln 149225, Col 0)
function R3A(A) {
    if (A.endsWith("*")) return !0;
    for (let q of k3A)
        if (q.test(A)) return !1;
    for (let q of E3A)
        if (q.test(A)) return !0;
    return !1
}
// @from(Ln 149234, Col 0)
function bx5() {
    let A = T27 || "";
    return L3A(""), A
}
// @from(Ln 149239, Col 0)
function E27(A) {
    let q = Object.assign(K, {
        enabled: R3A(A),
        destroy: ux5,
        log: v27.log,
        namespace: A,
        extend: Bx5
    });

    function K(...Y) {
        if (!q.enabled) return;
        if (Y.length > 0) Y[0] = `${A} ${Y[0]}`;
        q.log(...Y)
    }
    return v56.push(q), q
}
// @from(Ln 149256, Col 0)
function ux5() {
    let A = v56.indexOf(this);
    if (A >= 0) return v56.splice(A, 1), !0;
    return !1
}
// @from(Ln 149262, Col 0)
function Bx5(A) {
    let q = E27(`${this.namespace}:${A}`);
    return q.log = this.log, q
}
// @from(Ln 149266, Col 4)
N27
// @from(Ln 149266, Col 9)
T27
// @from(Ln 149266, Col 14)
E3A
// @from(Ln 149266, Col 19)
k3A
// @from(Ln 149266, Col 24)
v56
// @from(Ln 149266, Col 29)
v27
// @from(Ln 149266, Col 34)
uJ1
// @from(Ln 149267, Col 4)
k27 = v(() => {
    V27();
    N27 = typeof process < "u" && process.env && process.env.DEBUG || void 0, E3A = [], k3A = [], v56 = [];
    if (N27) L3A(N27);
    v27 = Object.assign((A) => {
        return E27(A)
    }, {
        enable: L3A,
        enabled: R3A,
        disable: bx5,
        log: f27
    });
    uJ1 = v27
})
// @from(Ln 149282, Col 0)
function R27(A, q) {
    q.log = (...K) => {
        A.log(...K)
    }
}
// @from(Ln 149288, Col 0)
function y27(A) {
    return y3A.includes(A)
}
// @from(Ln 149292, Col 0)
function E56(A) {
    let q = new Set,
        K = typeof process < "u" && process.env && process.env[A.logLevelEnvVarName] || void 0,
        Y, z = uJ1(A.namespace);
    z.log = (...J) => {
        uJ1.log(...J)
    };

    function w(J) {
        if (J && !y27(J)) throw Error(`Unknown log level '${J}'. Acceptable values: ${y3A.join(",")}`);
        Y = J;
        let X = [];
        for (let D of q)
            if (H(D)) X.push(D.namespace);
        uJ1.enable(X.join(","))
    }
    if (K)
        if (y27(K)) w(K);
        else console.error(`${A.logLevelEnvVarName} set to unknown log level '${K}'; logging is not enabled. Acceptable values: ${y3A.join(", ")}.`);

    function H(J) {
        return Boolean(Y && L27[J.level] <= L27[Y])
    }

    function $(J, X) {
        let D = Object.assign(J.extend(X), {
            level: X
        });
        if (R27(J, D), H(D)) {
            let j = uJ1.disable();
            uJ1.enable(j + "," + D.namespace)
        }
        return q.add(D), D
    }

    function O() {
        return Y
    }

    function _(J) {
        let X = z.extend(J);
        return R27(z, X), {
            error: $(X, "error"),
            warning: $(X, "warning"),
            info: $(X, "info"),
            verbose: $(X, "verbose")
        }
    }
    return {
        setLogLevel: w,
        getLogLevel: O,
        createClientLogger: _,
        logger: z
    }
}
// @from(Ln 149348, Col 0)
function k56(A) {
    return C27.createClientLogger(A)
}
// @from(Ln 149351, Col 4)
y3A
// @from(Ln 149351, Col 9)
L27
// @from(Ln 149351, Col 14)
C27
// @from(Ln 149351, Col 19)
CT2
// @from(Ln 149352, Col 4)
L56 = v(() => {
    k27();
    y3A = ["verbose", "info", "warning", "error"], L27 = {
        verbose: 400,
        info: 300,
        warning: 200,
        error: 100
    };
    C27 = E56({
        logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
        namespace: "typeSpecRuntime"
    }), CT2 = C27.logger
})
// @from(Ln 149365, Col 4)
S27 = v(() => {
    L56()
})
// @from(Ln 149369, Col 0)
function R56() {
    return C3A.getLogLevel()
}
// @from(Ln 149373, Col 0)
function ur(A) {
    return C3A.createClientLogger(A)
}
// @from(Ln 149376, Col 4)
C3A
// @from(Ln 149376, Col 9)
bT2
// @from(Ln 149377, Col 4)
I71 = v(() => {
    S27();
    C3A = E56({
        logLevelEnvVarName: "AZURE_LOG_LEVEL",
        namespace: "azure"
    }), bT2 = C3A.logger
})
// @from(Ln 149385, Col 0)
function y56(A) {
    return A.reduce((q, K) => {
        if (process.env[K]) q.assigned.push(K);
        else q.missing.push(K);
        return q
    }, {
        missing: [],
        assigned: []
    })
}
// @from(Ln 149396, Col 0)
function VX(A) {
    return `SUCCESS. Scopes: ${Array.isArray(A)?A.join(", "):A}.`
}
// @from(Ln 149400, Col 0)
function e9(A, q) {
    let K = "ERROR.";
    if (A === null || A === void 0 ? void 0 : A.length) K += ` Scopes: ${Array.isArray(A)?A.join(", "):A}.`;
    return `${K} Error message: ${typeof q==="string"?q:q.message}.`
}
// @from(Ln 149406, Col 0)
function h27(A, q, K = EV) {
    let Y = q ? `${q.fullTitle} ${A}` : A;

    function z(O) {
        K.info(`${Y} =>`, O)
    }

    function w(O) {
        K.warning(`${Y} =>`, O)
    }

    function H(O) {
        K.verbose(`${Y} =>`, O)
    }

    function $(O) {
        K.error(`${Y} =>`, O)
    }
    return {
        title: A,
        fullTitle: Y,
        info: z,
        warning: w,
        verbose: H,
        error: $
    }
}
// @from(Ln 149434, Col 0)
function n3(A, q = EV) {
    let K = h27(A, void 0, q);
    return Object.assign(Object.assign({}, K), {
        parent: q,
        getToken: h27("=> getToken()", K, q)
    })
}
// @from(Ln 149441, Col 4)
EV
// @from(Ln 149442, Col 4)
t2 = v(() => {
    I71();
    EV = ur("identity")
})
// @from(Ln 149447, Col 0)
function mx5(A) {
    return A && typeof A.error === "string" && typeof A.error_description === "string"
}
// @from(Ln 149451, Col 0)
function I27(A) {
    return {
        error: A.error,
        errorDescription: A.error_description,
        correlationId: A.correlation_id,
        errorCodes: A.error_codes,
        timestamp: A.timestamp,
        traceId: A.trace_id
    }
}
// @from(Ln 149461, Col 4)
S3A = "CredentialUnavailableError"
// @from(Ln 149462, Col 4)
f4
// @from(Ln 149462, Col 8)
GS1 = "AuthenticationError"
// @from(Ln 149463, Col 4)
ZS
// @from(Ln 149463, Col 8)
h3A = "AggregateAuthenticationError"
// @from(Ln 149464, Col 4)
ZS1
// @from(Ln 149464, Col 9)
fS
// @from(Ln 149465, Col 4)
bD = v(() => {
    f4 = class f4 extends Error {
        constructor(A, q) {
            super(A, q);
            this.name = S3A
        }
    };
    ZS = class ZS extends Error {
        constructor(A, q, K) {
            let Y = {
                error: "unknown",
                errorDescription: "An unknown error occurred and no additional details are available."
            };
            if (mx5(q)) Y = I27(q);
            else if (typeof q === "string") try {
                let z = JSON.parse(q);
                Y = I27(z)
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
            this.statusCode = A, this.errorResponse = Y, this.name = GS1
        }
    };
    ZS1 = class ZS1 extends Error {
        constructor(A, q) {
            let K = A.join(`
`);
            super(`${q}
${K}`);
            this.errors = A, this.name = h3A
        }
    };
    fS = class fS extends Error {
        constructor(A) {
            super(A.message, A.cause ? {
                cause: A.cause
            } : void 0);
            this.scopes = A.scopes, this.getTokenOptions = A.getTokenOptions, this.name = "AuthenticationRequiredError"
        }
    }
})
// @from(Ln 149524, Col 0)
function Fx5(A) {
    return `The current credential is not configured to acquire tokens for tenant ${A}. To enable acquiring tokens for this tenant add it to the AdditionallyAllowedTenants on the credential options, or add "*" to AdditionallyAllowedTenants to allow acquiring tokens for any tenant.`
}
// @from(Ln 149528, Col 0)
function rH(A, q, K = [], Y) {
    var z;
    let w;
    if (process.env.AZURE_IDENTITY_DISABLE_MULTITENANTAUTH) w = A;
    else if (A === "adfs") w = A;
    else w = (z = q === null || q === void 0 ? void 0 : q.tenantId) !== null && z !== void 0 ? z : A;
    if (A && w !== A && !K.includes("*") && !K.some((H) => H.localeCompare(w) === 0)) {
        let H = Fx5(w);
        throw Y === null || Y === void 0 || Y.info(H), new f4(H)
    }
    return w
}
// @from(Ln 149540, Col 4)
x27 = v(() => {
    bD()
})
// @from(Ln 149544, Col 0)
function NX(A, q) {
    if (!q.match(/^[0-9a-zA-Z-.]+$/)) {
        let K = Error("Invalid tenant id provided. You can locate your tenant id by following the instructions listed here: https://learn.microsoft.com/partner-center/find-ids-and-domain-names.");
        throw A.info(e9("", K)), K
    }
}
// @from(Ln 149551, Col 0)
function BJ1(A, q, K) {
    if (q) return NX(A, q), q;
    if (!K) K = h71;
    if (K !== h71) return "common";
    return "organizations"
}
// @from(Ln 149558, Col 0)
function m$(A) {
    if (!A || A.length === 0) return [];
    if (A.includes("*")) return X27;
    return A
}
// @from(Ln 149563, Col 4)
uD = v(() => {
    Tu();
    t2();
    x27()
})
// @from(Ln 149568, Col 4)
I3A = "$"
// @from(Ln 149569, Col 4)
C56 = "_"
// @from(Ln 149571, Col 0)
function Qx5(A, q) {
    return q !== "Composite" && q !== "Dictionary" && (typeof A === "string" || typeof A === "number" || typeof A === "boolean" || (q === null || q === void 0 ? void 0 : q.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i)) !== null || A === void 0 || A === null)
}
// @from(Ln 149575, Col 0)
function gx5(A) {
    let q = Object.assign(Object.assign({}, A.headers), A.body);
    if (A.hasNullableType && Object.getOwnPropertyNames(q).length === 0) return A.shouldWrapBody ? {
        body: null
    } : null;
    else return A.shouldWrapBody ? Object.assign(Object.assign({}, A.headers), {
        body: A.body
    }) : q
}
// @from(Ln 149585, Col 0)
function x3A(A, q) {
    var K, Y;
    let z = A.parsedHeaders;
    if (A.request.method === "HEAD") return Object.assign(Object.assign({}, z), {
        body: A.parsedBody
    });
    let w = q && q.bodyMapper,
        H = Boolean(w === null || w === void 0 ? void 0 : w.nullable),
        $ = w === null || w === void 0 ? void 0 : w.type.name;
    if ($ === "Stream") return Object.assign(Object.assign({}, z), {
        blobBody: A.blobBody,
        readableStreamBody: A.readableStreamBody
    });
    let O = $ === "Composite" && w.type.modelProperties || {},
        _ = Object.keys(O).some((J) => O[J].serializedName === "");
    if ($ === "Sequence" || _) {
        let J = (K = A.parsedBody) !== null && K !== void 0 ? K : [];
        for (let X of Object.keys(O))
            if (O[X].serializedName) J[X] = (Y = A.parsedBody) === null || Y === void 0 ? void 0 : Y[X];
        if (z)
            for (let X of Object.keys(z)) J[X] = z[X];
        return H && !A.parsedBody && !z && Object.getOwnPropertyNames(O).length === 0 ? null : J
    }
    return gx5({
        body: A.parsedBody,
        headers: z,
        hasNullableType: H,
        shouldWrapBody: Qx5(A.parsedBody, $)
    })
}
// @from(Ln 149615, Col 4)
b27 = () => {}
// @from(Ln 149616, Col 4)
KU
// @from(Ln 149617, Col 4)
S56 = v(() => {
    KU = {
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
// @from(Ln 149637, Col 4)
Br
// @from(Ln 149638, Col 4)
h56 = v(() => {
    Br = class Br extends Error {
        constructor(A) {
            super(A);
            this.name = "AbortError"
        }
    }
})
// @from(Ln 149647, Col 0)
function I56(A) {
    return A.toLowerCase()
}
// @from(Ln 149651, Col 0)
function* Ux5(A) {
    for (let q of A.values()) yield [q.name, q.value]
}
// @from(Ln 149655, Col 0)
function vu(A) {
    return new u27(A)
}
// @from(Ln 149658, Col 4)
u27
// @from(Ln 149659, Col 4)
fS1 = v(() => {
    u27 = class u27 {
        constructor(A) {
            if (this._headersMap = new Map, A)
                for (let q of Object.keys(A)) this.set(q, A[q])
        }
        set(A, q) {
            this._headersMap.set(I56(A), {
                name: A,
                value: String(q).trim()
            })
        }
        get(A) {
            var q;
            return (q = this._headersMap.get(I56(A))) === null || q === void 0 ? void 0 : q.value
        }
        has(A) {
            return this._headersMap.has(I56(A))
        }
        delete(A) {
            this._headersMap.delete(I56(A))
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
            return Ux5(this._headersMap)
        }
    }
})
// @from(Ln 149698, Col 4)
B27 = () => {}
// @from(Ln 149699, Col 4)
m27 = () => {}
// @from(Ln 149704, Col 0)
function VS1() {
    return dx5()
}
// @from(Ln 149707, Col 4)
b3A
// @from(Ln 149707, Col 9)
dx5
// @from(Ln 149708, Col 4)
u3A = v(() => {
    dx5 = typeof((b3A = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || b3A === void 0 ? void 0 : b3A.randomUUID) === "function" ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : px5
})
// @from(Ln 149711, Col 0)
class F27 {
    constructor(A) {
        var q, K, Y, z, w, H, $;
        this.url = A.url, this.body = A.body, this.headers = (q = A.headers) !== null && q !== void 0 ? q : vu(), this.method = (K = A.method) !== null && K !== void 0 ? K : "GET", this.timeout = (Y = A.timeout) !== null && Y !== void 0 ? Y : 0, this.multipartBody = A.multipartBody, this.formData = A.formData, this.disableKeepAlive = (z = A.disableKeepAlive) !== null && z !== void 0 ? z : !1, this.proxySettings = A.proxySettings, this.streamResponseStatusCodes = A.streamResponseStatusCodes, this.withCredentials = (w = A.withCredentials) !== null && w !== void 0 ? w : !1, this.abortSignal = A.abortSignal, this.onUploadProgress = A.onUploadProgress, this.onDownloadProgress = A.onDownloadProgress, this.requestId = A.requestId || VS1(), this.allowInsecureConnection = (H = A.allowInsecureConnection) !== null && H !== void 0 ? H : !1, this.enableBrowserStreams = ($ = A.enableBrowserStreams) !== null && $ !== void 0 ? $ : !1, this.requestOverrides = A.requestOverrides, this.authSchemes = A.authSchemes
    }
}
// @from(Ln 149718, Col 0)
function B3A(A) {
    return new F27(A)
}
// @from(Ln 149721, Col 4)
Q27 = v(() => {
    fS1();
    u3A()
})
// @from(Ln 149725, Col 0)
class x56 {
    constructor(A) {
        var q;
        this._policies = [], this._policies = (q = A === null || A === void 0 ? void 0 : A.slice(0)) !== null && q !== void 0 ? q : [], this._orderedPolicies = void 0
    }
    addPolicy(A, q = {}) {
        if (q.phase && q.afterPhase) throw Error("Policies inside a phase cannot specify afterPhase.");
        if (q.phase && !g27.has(q.phase)) throw Error(`Invalid phase name: ${q.phase}`);
        if (q.afterPhase && !g27.has(q.afterPhase)) throw Error(`Invalid afterPhase name: ${q.afterPhase}`);
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
        return this.getOrderedPolicies().reduceRight((z, w) => {
            return (H) => {
                return w.sendRequest(H, z)
            }
        }, (z) => A.sendRequest(z))(q)
    }
    getOrderedPolicies() {
        if (!this._orderedPolicies) this._orderedPolicies = this.orderPolicies();
        return this._orderedPolicies
    }
    clone() {
        return new x56(this._policies)
    }
    static create() {
        return new x56
    }
    orderPolicies() {
        let A = [],
            q = new Map;

        function K(j) {
            return {
                name: j,
                policies: new Set,
                hasRun: !1,
                hasAfterPolicies: !1
            }
        }
        let Y = K("Serialize"),
            z = K("None"),
            w = K("Deserialize"),
            H = K("Retry"),
            $ = K("Sign"),
            O = [Y, z, w, H, $];

        function _(j) {
            if (j === "Retry") return H;
            else if (j === "Serialize") return Y;
            else if (j === "Deserialize") return w;
            else if (j === "Sign") return $;
            else return z
        }
        for (let j of this._policies) {
            let {
                policy: M,
                options: P
            } = j, W = M.name;
            if (q.has(W)) throw Error("Duplicate policy names not allowed in pipeline");
            let G = {
                policy: M,
                dependsOn: new Set,
                dependants: new Set
            };
            if (P.afterPhase) G.afterPhase = _(P.afterPhase), G.afterPhase.hasAfterPolicies = !0;
            q.set(W, G), _(P.phase).policies.add(G)
        }
        for (let j of this._policies) {
            let {
                policy: M,
                options: P
            } = j, W = M.name, G = q.get(W);
            if (!G) throw Error(`Missing node for policy ${W}`);
            if (P.afterPolicies)
                for (let f of P.afterPolicies) {
                    let Z = q.get(f);
                    if (Z) G.dependsOn.add(Z), Z.dependants.add(G)
                }
            if (P.beforePolicies)
                for (let f of P.beforePolicies) {
                    let Z = q.get(f);
                    if (Z) Z.dependsOn.add(G), G.dependants.add(Z)
                }
        }

        function J(j) {
            j.hasRun = !0;
            for (let M of j.policies) {
                if (M.afterPhase && (!M.afterPhase.hasRun || M.afterPhase.policies.size)) continue;
                if (M.dependsOn.size === 0) {
                    A.push(M.policy);
                    for (let P of M.dependants) P.dependsOn.delete(M);
                    q.delete(M.policy.name), j.policies.delete(M)
                }
            }
        }

        function X() {
            for (let j of O) {
                if (J(j), j.policies.size > 0 && j !== z) {
                    if (!z.hasRun) J(z);
                    return
                }
                if (j.hasAfterPolicies) J(z)
            }
        }
        let D = 0;
        while (q.size > 0) {
            D++;
            let j = A.length;
            if (X(), A.length <= j && D > 1) throw Error("Cannot satisfy policy dependencies due to requirements cycle.")
        }
        return A
    }
}
// @from(Ln 149852, Col 0)
function m3A() {
    return x56.create()
}
// @from(Ln 149855, Col 4)
g27
// @from(Ln 149856, Col 4)
U27 = v(() => {
    g27 = new Set(["Deserialize", "Serialize", "Retry", "Sign"])
})
// @from(Ln 149860, Col 0)
function NS1(A) {
    return typeof A === "object" && A !== null && !Array.isArray(A) && !(A instanceof RegExp) && !(A instanceof Date)
}
// @from(Ln 149864, Col 0)
function x71(A) {
    if (NS1(A)) {
        let q = typeof A.name === "string",
            K = typeof A.message === "string";
        return q && K
    }
    return !1
}
// @from(Ln 149872, Col 4)
F3A = () => {}
// @from(Ln 149876, Col 4)
p27
// @from(Ln 149877, Col 4)
d27 = v(() => {
    p27 = cx5.custom
})
// @from(Ln 149880, Col 0)
class Eu {
    constructor({
        additionalAllowedHeaderNames: A = [],
        additionalAllowedQueryParameters: q = []
    } = {}) {
        A = lx5.concat(A), q = ix5.concat(q), this.allowedHeaderNames = new Set(A.map((K) => K.toLowerCase())), this.allowedQueryParameters = new Set(q.map((K) => K.toLowerCase()))
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
            else if (Array.isArray(Y) || NS1(Y)) {
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
            if (!this.allowedQueryParameters.has(K.toLowerCase())) q.searchParams.set(K, Q3A);
        return q.toString()
    }
    sanitizeHeaders(A) {
        let q = {};
        for (let K of Object.keys(A))
            if (this.allowedHeaderNames.has(K.toLowerCase())) q[K] = A[K];
            else q[K] = Q3A;
        return q
    }
    sanitizeQuery(A) {
        if (typeof A !== "object" || A === null) return A;
        let q = {};
        for (let K of Object.keys(A))
            if (this.allowedQueryParameters.has(K.toLowerCase())) q[K] = A[K];
            else q[K] = Q3A;
        return q
    }
}
// @from(Ln 149931, Col 4)
Q3A = "REDACTED"
// @from(Ln 149932, Col 4)
lx5
// @from(Ln 149932, Col 9)
ix5
// @from(Ln 149933, Col 4)
TS1 = v(() => {
    lx5 = ["x-ms-client-request-id", "x-ms-return-client-request-id", "x-ms-useragent", "x-ms-correlation-request-id", "x-ms-request-id", "client-request-id", "ms-cv", "return-client-request-id", "traceparent", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin", "Accept", "Accept-Encoding", "Cache-Control", "Connection", "Content-Length", "Content-Type", "Date", "ETag", "Expires", "If-Match", "If-Modified-Since", "If-None-Match", "If-Unmodified-Since", "Last-Modified", "Pragma", "Request-Id", "Retry-After", "Server", "Transfer-Encoding", "User-Agent", "WWW-Authenticate"], ix5 = ["api-version"]
})
// @from(Ln 149937, Col 0)
function g3A(A) {
    if (A instanceof kV) return !0;
    return x71(A) && A.name === "RestError"
}
// @from(Ln 149941, Col 4)
nx5
// @from(Ln 149941, Col 9)
kV
// @from(Ln 149942, Col 4)
U3A = v(() => {
    F3A();
    d27();
    TS1();
    nx5 = new Eu;
    kV = class kV extends Error {
        constructor(A, q = {}) {
            super(A);
            this.name = "RestError", this.code = q.code, this.statusCode = q.statusCode, Object.defineProperty(this, "request", {
                value: q.request,
                enumerable: !1
            }), Object.defineProperty(this, "response", {
                value: q.response,
                enumerable: !1
            }), Object.defineProperty(this, p27, {
                value: () => {
                    return `RestError: ${this.message} 
 ${nx5.sanitize(Object.assign(Object.assign({},this),{request:this.request,response:this.response}))}`
                },
                enumerable: !1
            }), Object.setPrototypeOf(this, kV.prototype)
        }
    };
    kV.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
    kV.PARSE_ERROR = "PARSE_ERROR"
})
// @from(Ln 149969, Col 0)
function ku(A, q) {
    return Buffer.from(A, q)
}
// @from(Ln 149972, Col 4)
VS
// @from(Ln 149973, Col 4)
b56 = v(() => {
    L56();
    VS = k56("ts-http-runtime")
})
// @from(Ln 149984, Col 0)
function vS1(A) {
    return A && typeof A.pipe === "function"
}
// @from(Ln 149988, Col 0)
function c27(A) {
    if (A.readable === !1) return Promise.resolve();
    return new Promise((q) => {
        let K = () => {
            q(), A.removeListener("close", K), A.removeListener("end", K), A.removeListener("error", K)
        };
        A.on("close", K), A.on("end", K), A.on("error", K)
    })
}
// @from(Ln 149998, Col 0)
function l27(A) {
    return A && typeof A.byteLength === "number"
}
// @from(Ln 150001, Col 0)
class i27 {
    constructor() {
        this.cachedHttpsAgents = new WeakMap
    }
    async sendRequest(A) {
        var q, K, Y;
        let z = new AbortController,
            w;
        if (A.abortSignal) {
            if (A.abortSignal.aborted) throw new Br("The operation was aborted. Request has already been canceled.");
            w = (X) => {
                if (X.type === "abort") z.abort()
            }, A.abortSignal.addEventListener("abort", w)
        }
        let H;
        if (A.timeout > 0) H = setTimeout(() => {
            let X = new Eu;
            VS.info(`request to '${X.sanitizeUrl(A.url)}' timed out. canceling...`), z.abort()
        }, A.timeout);
        let $ = A.headers.get("Accept-Encoding"),
            O = ($ === null || $ === void 0 ? void 0 : $.includes("gzip")) || ($ === null || $ === void 0 ? void 0 : $.includes("deflate")),
            _ = typeof A.body === "function" ? A.body() : A.body;
        if (_ && !A.headers.has("Content-Length")) {
            let X = ex5(_);
            if (X !== null) A.headers.set("Content-Length", X)
        }
        let J;
        try {
            if (_ && A.onUploadProgress) {
                let W = A.onUploadProgress,
                    G = new p3A(W);
                if (G.on("error", (f) => {
                        VS.error("Error in upload progress", f)
                    }), vS1(_)) _.pipe(G);
                else G.end(_);
                _ = G
            }
            let X = await this.makeRequest(A, z, _);
            if (H !== void 0) clearTimeout(H);
            let D = ax5(X),
                M = {
                    status: (q = X.statusCode) !== null && q !== void 0 ? q : 0,
                    headers: D,
                    request: A
                };
            if (A.method === "HEAD") return X.resume(), M;
            J = O ? sx5(X, D) : X;
            let P = A.onDownloadProgress;
            if (P) {
                let W = new p3A(P);
                W.on("error", (G) => {
                    VS.error("Error in download progress", G)
                }), J.pipe(W), J = W
            }
            if (((K = A.streamResponseStatusCodes) === null || K === void 0 ? void 0 : K.has(Number.POSITIVE_INFINITY)) || ((Y = A.streamResponseStatusCodes) === null || Y === void 0 ? void 0 : Y.has(M.status))) M.readableStreamBody = J;
            else M.bodyAsText = await tx5(J);
            return M
        } finally {
            if (A.abortSignal && w) {
                let X = Promise.resolve();
                if (vS1(_)) X = c27(_);
                let D = Promise.resolve();
                if (vS1(J)) D = c27(J);
                Promise.all([X, D]).then(() => {
                    var j;
                    if (w)(j = A.abortSignal) === null || j === void 0 || j.removeEventListener("abort", w)
                }).catch((j) => {
                    VS.warning("Error when cleaning up abortListener on httpRequest", j)
                })
            }
        }
    }
    makeRequest(A, q, K) {
        var Y;
        let z = new URL(A.url),
            w = z.protocol !== "https:";
        if (w && !A.allowInsecureConnection) throw Error(`Cannot connect to ${A.url} while allowInsecureConnection is false.`);
        let H = (Y = A.agent) !== null && Y !== void 0 ? Y : this.getOrCreateAgent(A, w),
            $ = Object.assign({
                agent: H,
                hostname: z.hostname,
                path: `${z.pathname}${z.search}`,
                port: z.port,
                method: A.method,
                headers: A.headers.toJSON({
                    preserveCase: !0
                })
            }, A.requestOverrides);
        return new Promise((O, _) => {
            let J = w ? mJ1.request($, O) : FJ1.request($, O);
            if (J.once("error", (X) => {
                    var D;
                    _(new kV(X.message, {
                        code: (D = X.code) !== null && D !== void 0 ? D : kV.REQUEST_SEND_ERROR,
                        request: A
                    }))
                }), q.signal.addEventListener("abort", () => {
                    let X = new Br("The operation was aborted. Rejecting from abort signal callback while making request.");
                    J.destroy(X), _(X)
                }), K && vS1(K)) K.pipe(J);
            else if (K)
                if (typeof K === "string" || Buffer.isBuffer(K)) J.end(K);
                else if (l27(K)) J.end(ArrayBuffer.isView(K) ? Buffer.from(K.buffer) : Buffer.from(K));
            else VS.error("Unrecognized body type", K), _(new kV("Unrecognized body type"));
            else J.end()
        })
    }
    getOrCreateAgent(A, q) {
        var K;
        let Y = A.disableKeepAlive;
        if (q) {
            if (Y) return mJ1.globalAgent;
            if (!this.cachedHttpAgent) this.cachedHttpAgent = new mJ1.Agent({
                keepAlive: !0
            });
            return this.cachedHttpAgent
        } else {
            if (Y && !A.tlsSettings) return FJ1.globalAgent;
            let z = (K = A.tlsSettings) !== null && K !== void 0 ? K : ox5,
                w = this.cachedHttpsAgents.get(z);
            if (w && w.options.keepAlive === !Y) return w;
            return VS.info("No cached TLS Agent exist, creating a new Agent"), w = new FJ1.Agent(Object.assign({
                keepAlive: !Y
            }, z)), this.cachedHttpsAgents.set(z, w), w
        }
    }
}
// @from(Ln 150129, Col 0)
function ax5(A) {
    let q = vu();
    for (let K of Object.keys(A.headers)) {
        let Y = A.headers[K];
        if (Array.isArray(Y)) {
            if (Y.length > 0) q.set(K, Y[0])
        } else if (Y) q.set(K, Y)
    }
    return q
}
// @from(Ln 150140, Col 0)
function sx5(A, q) {
    let K = q.get("Content-Encoding");
    if (K === "gzip") {
        let Y = u56.createGunzip();
        return A.pipe(Y), Y
    } else if (K === "deflate") {
        let Y = u56.createInflate();
        return A.pipe(Y), Y
    }
    return A
}
// @from(Ln 150152, Col 0)
function tx5(A) {
    return new Promise((q, K) => {
        let Y = [];
        A.on("data", (z) => {
            if (Buffer.isBuffer(z)) Y.push(z);
            else Y.push(Buffer.from(z))
        }), A.on("end", () => {
            q(Buffer.concat(Y).toString("utf8"))
        }), A.on("error", (z) => {
            if (z && (z === null || z === void 0 ? void 0 : z.name) === "AbortError") K(z);
            else K(new kV(`Error reading response as text: ${z.message}`, {
                code: kV.PARSE_ERROR
            }))
        })
    })
}
// @from(Ln 150169, Col 0)
function ex5(A) {
    if (!A) return 0;
    else if (Buffer.isBuffer(A)) return A.length;
    else if (vS1(A)) return null;
    else if (l27(A)) return A.byteLength;
    else if (typeof A === "string") return Buffer.from(A).length;
    else return null
}
// @from(Ln 150178, Col 0)
function n27() {
    return new i27
}
// @from(Ln 150181, Col 4)
ox5
// @from(Ln 150181, Col 9)
p3A
// @from(Ln 150182, Col 4)
r27 = v(() => {
    h56();
    fS1();
    U3A();
    b56();
    TS1();
    ox5 = {};
    p3A = class p3A extends rx5 {
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
// @from(Ln 150207, Col 0)
function d3A() {
    return n27()
}
// @from(Ln 150210, Col 4)
o27 = v(() => {
    r27()
})
// @from(Ln 150214, Col 0)
function l3A(A = {}) {
    var q;
    let K = (q = A.logger) !== null && q !== void 0 ? q : VS.info,
        Y = new Eu({
            additionalAllowedHeaderNames: A.additionalAllowedHeaderNames,
            additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
        });
    return {
        name: c3A,
        async sendRequest(z, w) {
            if (!K.enabled) return w(z);
            K(`Request: ${Y.sanitize(z)}`);
            let H = await w(z);
            return K(`Response status code: ${H.status}`), K(`Headers: ${Y.sanitize(H.headers)}`), H
        }
    }
}
// @from(Ln 150231, Col 4)
c3A = "logPolicy"
// @from(Ln 150232, Col 4)
a27 = v(() => {
    b56();
    TS1()
})
// @from(Ln 150237, Col 0)
function i3A(A = {}) {
    let {
        maxRetries: q = 20
    } = A;
    return {
        name: "redirectPolicy",
        async sendRequest(K, Y) {
            let z = await Y(K);
            return t27(Y, z, q)
        }
    }
}
// @from(Ln 150249, Col 0)
async function t27(A, q, K, Y = 0) {
    let {
        request: z,
        status: w,
        headers: H
    } = q, $ = H.get("location");
    if ($ && (w === 300 || w === 301 && s27.includes(z.method) || w === 302 && s27.includes(z.method) || w === 303 && z.method === "POST" || w === 307) && Y < K) {
        let O = new URL($, z.url);
        if (z.url = O.toString(), w === 303) z.method = "GET", z.headers.delete("Content-Length"), delete z.body;
        z.headers.delete("Authorization");
        let _ = await A(z);
        return t27(A, _, K, Y + 1)
    }
    return q
}
// @from(Ln 150264, Col 4)
s27
// @from(Ln 150265, Col 4)
e27 = v(() => {
    s27 = ["GET", "HEAD"]
})
// @from(Ln 150268, Col 4)
ES1 = 3
// @from(Ln 150270, Col 0)
function n3A() {
    return {
        name: "decompressResponsePolicy",
        async sendRequest(A, q) {
            if (A.method !== "HEAD") A.headers.set("Accept-Encoding", "gzip,deflate");
            return q(A)
        }
    }
}
// @from(Ln 150280, Col 0)
function r3A(A, q) {
    return A = Math.ceil(A), q = Math.floor(q), Math.floor(Math.random() * (q - A + 1)) + A
}
// @from(Ln 150284, Col 0)
function kS1(A, q) {
    let K = q.retryDelayInMs * Math.pow(2, A),
        Y = Math.min(q.maxRetryDelayInMs, K);
    return {
        retryAfterInMs: Y / 2 + r3A(0, Y / 2)
    }
}
// @from(Ln 150291, Col 4)
o3A = () => {}
// @from(Ln 150293, Col 0)
function Aw7(A, q, K) {
    return new Promise((Y, z) => {
        let w = void 0,
            H = void 0,
            $ = () => {
                return z(new Br((K === null || K === void 0 ? void 0 : K.abortErrorMsg) ? K === null || K === void 0 ? void 0 : K.abortErrorMsg : Ab5))
            },
            O = () => {
                if ((K === null || K === void 0 ? void 0 : K.abortSignal) && H) K.abortSignal.removeEventListener("abort", H)
            };
        if (H = () => {
                if (w) clearTimeout(w);
                return O(), $()
            }, (K === null || K === void 0 ? void 0 : K.abortSignal) && K.abortSignal.aborted) return $();
        if (w = setTimeout(() => {
                O(), Y(q)
            }, A), K === null || K === void 0 ? void 0 : K.abortSignal) K.abortSignal.addEventListener("abort", H)
    })
}
// @from(Ln 150313, Col 0)
function qw7(A, q) {
    let K = A.headers.get(q);
    if (!K) return;
    let Y = Number(K);
    if (Number.isNaN(Y)) return;
    return Y
}
// @from(Ln 150320, Col 4)
Ab5 = "The operation was aborted."
// @from(Ln 150321, Col 4)
a3A = v(() => {
    h56()
})
// @from(Ln 150325, Col 0)
function Kw7(A) {
    if (!(A && [429, 503].includes(A.status))) return;
    try {
        for (let z of qb5) {
            let w = qw7(A, z);
            if (w === 0 || w) return w * (z === s3A ? 1000 : 1)
        }
        let q = A.headers.get(s3A);
        if (!q) return;
        let Y = Date.parse(q) - Date.now();
        return Number.isFinite(Y) ? Math.max(0, Y) : void 0
    } catch (q) {
        return
    }
}
// @from(Ln 150341, Col 0)
function Yw7(A) {
    return Number.isFinite(Kw7(A))
}
// @from(Ln 150345, Col 0)
function zw7() {
    return {
        name: "throttlingRetryStrategy",
        retry({
            response: A
        }) {
            let q = Kw7(A);
            if (!Number.isFinite(q)) return {
                skipStrategy: !0
            };
            return {
                retryAfterInMs: q
            }
        }
    }
}
// @from(Ln 150361, Col 4)
s3A = "Retry-After"
// @from(Ln 150362, Col 4)
qb5
// @from(Ln 150363, Col 4)
t3A = v(() => {
    a3A();
    qb5 = ["retry-after-ms", "x-ms-retry-after-ms", s3A]
})
// @from(Ln 150368, Col 0)
function ww7(A = {}) {
    var q, K;
    let Y = (q = A.retryDelayInMs) !== null && q !== void 0 ? q : Kb5,
        z = (K = A.maxRetryDelayInMs) !== null && K !== void 0 ? K : Yb5;
    return {
        name: "exponentialRetryStrategy",
        retry({
            retryCount: w,
            response: H,
            responseError: $
        }) {
            let O = wb5($),
                _ = O && A.ignoreSystemErrors,
                J = zb5(H),
                X = J && A.ignoreHttpStatusCodes;
            if (H && (Yw7(H) || !J) || X || _) return {
                skipStrategy: !0
            };
            if ($ && !O && !J) return {
                errorToThrow: $
            };
            return kS1(w, {
                retryDelayInMs: Y,
                maxRetryDelayInMs: z
            })
        }
    }
}
// @from(Ln 150397, Col 0)
function zb5(A) {
    return Boolean(A && A.status !== void 0 && (A.status >= 500 || A.status === 408) && A.status !== 501 && A.status !== 505)
}
// @from(Ln 150401, Col 0)
function wb5(A) {
    if (!A) return !1;
    return A.code === "ETIMEDOUT" || A.code === "ESOCKETTIMEDOUT" || A.code === "ECONNREFUSED" || A.code === "ECONNRESET" || A.code === "ENOENT" || A.code === "ENOTFOUND"
}
// @from(Ln 150405, Col 4)
Kb5 = 1000
// @from(Ln 150406, Col 4)
Yb5 = 64000
// @from(Ln 150407, Col 4)
Hw7 = v(() => {
    o3A();
    t3A()
})
// @from(Ln 150412, Col 0)
function LS1(A, q = {
    maxRetries: ES1
}) {
    let K = q.logger || Hb5;
    return {
        name: $b5,
        async sendRequest(Y, z) {
            var w, H;
            let $, O, _ = -1;
            A: while (!0) {
                _ += 1, $ = void 0, O = void 0;
                try {
                    K.info(`Retry ${_}: Attempting to send request`, Y.requestId), $ = await z(Y), K.info(`Retry ${_}: Received a response from request`, Y.requestId)
                } catch (J) {
                    if (K.error(`Retry ${_}: Received an error from request`, Y.requestId), O = J, !J || O.name !== "RestError") throw J;
                    $ = O.response
                }
                if ((w = Y.abortSignal) === null || w === void 0 ? void 0 : w.aborted) throw K.error(`Retry ${_}: Request aborted.`), new Br;
                if (_ >= ((H = q.maxRetries) !== null && H !== void 0 ? H : ES1))
                    if (K.info(`Retry ${_}: Maximum retries reached. Returning the last received response, or throwing the last received error.`), O) throw O;
                    else if ($) return $;
                else throw Error("Maximum retries reached with no response or error to throw");
                K.info(`Retry ${_}: Processing ${A.length} retry strategies.`);
                q: for (let J of A) {
                    let X = J.logger || K;
                    X.info(`Retry ${_}: Processing retry strategy ${J.name}.`);
                    let D = J.retry({
                        retryCount: _,
                        response: $,
                        responseError: O
                    });
                    if (D.skipStrategy) {
                        X.info(`Retry ${_}: Skipped.`);
                        continue q
                    }
                    let {
                        errorToThrow: j,
                        retryAfterInMs: M,
                        redirectTo: P
                    } = D;
                    if (j) throw X.error(`Retry ${_}: Retry strategy ${J.name} throws error:`, j), j;
                    if (M || M === 0) {
                        X.info(`Retry ${_}: Retry strategy ${J.name} retries after ${M}`), await Aw7(M, void 0, {
                            abortSignal: Y.abortSignal
                        });
                        continue A
                    }
                    if (P) {
                        X.info(`Retry ${_}: Retry strategy ${J.name} redirects to ${P}`), Y.url = P;
                        continue A
                    }
                }
                if (O) throw K.info("None of the retry strategies could work with the received error. Throwing it."), O;
                if ($) return K.info("None of the retry strategies could work with the received response. Returning it."), $
            }
        }
    }
}
// @from(Ln 150470, Col 4)
Hb5
// @from(Ln 150470, Col 9)
$b5 = "retryPolicy"
// @from(Ln 150471, Col 4)
e3A = v(() => {
    a3A();
    h56();
    L56();
    Hb5 = k56("ts-http-runtime retryPolicy")
})
// @from(Ln 150478, Col 0)
function q5A(A = {}) {
    var q;
    return {
        name: A5A,
        sendRequest: LS1([zw7(), ww7(A)], {
            maxRetries: (q = A.maxRetries) !== null && q !== void 0 ? q : ES1
        }).sendRequest
    }
}
// @from(Ln 150487, Col 4)
A5A = "defaultRetryPolicy"
// @from(Ln 150488, Col 4)
$w7 = v(() => {
    Hw7();
    t3A();
    e3A()
})
// @from(Ln 150493, Col 4)
K5A
// @from(Ln 150493, Col 9)
Y5A
// @from(Ln 150493, Col 14)
z5A
// @from(Ln 150493, Col 19)
w5A
// @from(Ln 150493, Col 24)
Ow7
// @from(Ln 150493, Col 29)
_w7
// @from(Ln 150493, Col 34)
Jw7
// @from(Ln 150493, Col 39)
Xw7
// @from(Ln 150493, Col 44)
QJ1
// @from(Ln 150493, Col 49)
Dw7
// @from(Ln 150494, Col 4)
H5A = v(() => {
    Ow7 = typeof window < "u" && typeof window.document < "u", _w7 = typeof self === "object" && typeof(self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((K5A = self.constructor) === null || K5A === void 0 ? void 0 : K5A.name) === "DedicatedWorkerGlobalScope" || ((Y5A = self.constructor) === null || Y5A === void 0 ? void 0 : Y5A.name) === "ServiceWorkerGlobalScope" || ((z5A = self.constructor) === null || z5A === void 0 ? void 0 : z5A.name) === "SharedWorkerGlobalScope"), Jw7 = typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u", Xw7 = typeof Bun < "u" && typeof Bun.version < "u", QJ1 = typeof globalThis.process < "u" && Boolean(globalThis.process.version) && Boolean((w5A = globalThis.process.versions) === null || w5A === void 0 ? void 0 : w5A.node), Dw7 = typeof navigator < "u" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative"
})
// @from(Ln 150498, Col 0)
function Ob5(A) {
    var q;
    let K = {};
    for (let [Y, z] of A.entries())(q = K[Y]) !== null && q !== void 0 || (K[Y] = []), K[Y].push(z);
    return K
}
// @from(Ln 150505, Col 0)
function O5A() {
    return {
        name: $5A,
        async sendRequest(A, q) {
            if (QJ1 && typeof FormData < "u" && A.body instanceof FormData) A.formData = Ob5(A.body), A.body = void 0;
            if (A.formData) {
                let K = A.headers.get("Content-Type");
                if (K && K.indexOf("application/x-www-form-urlencoded") !== -1) A.body = _b5(A.formData);
                else await Jb5(A.formData, A);
                A.formData = void 0
            }
            return q(A)
        }
    }
}
// @from(Ln 150521, Col 0)
function _b5(A) {
    let q = new URLSearchParams;
    for (let [K, Y] of Object.entries(A))
        if (Array.isArray(Y))
            for (let z of Y) q.append(K, z.toString());
        else q.append(K, Y.toString());
    return q.toString()
}
// @from(Ln 150529, Col 0)
async function Jb5(A, q) {
    let K = q.headers.get("Content-Type");
    if (K && !K.startsWith("multipart/form-data")) return;
    q.headers.set("Content-Type", K !== null && K !== void 0 ? K : "multipart/form-data");
    let Y = [];
    for (let [z, w] of Object.entries(A))
        for (let H of Array.isArray(w) ? w : [w])
            if (typeof H === "string") Y.push({
                headers: vu({
                    "Content-Disposition": `form-data; name="${z}"`
                }),
                body: ku(H, "utf-8")
            });
            else if (H === void 0 || H === null || typeof H !== "object") throw Error(`Unexpected value for key ${z}: ${H}. Value should be serialized to string first.`);
    else {
        let $ = H.name || "blob",
            O = vu();
        O.set("Content-Disposition", `form-data; name="${z}"; filename="${$}"`), O.set("Content-Type", H.type || "application/octet-stream"), Y.push({
            headers: O,
            body: H
        })
    }
    q.multipartBody = {
        parts: Y
    }
}
// @from(Ln 150555, Col 4)
$5A = "formDataPolicy"
// @from(Ln 150556, Col 4)
jw7 = v(() => {
    H5A();
    fS1()
})
// @from(Ln 150560, Col 4)
Ww7 = R((kL) => {
    var Xb5 = kL && kL.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        Db5 = kL && kL.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        Pw7 = kL && kL.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) Xb5(q, A, K)
            }
            return Db5(q, A), q
        },
        jb5 = kL && kL.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        };
    Object.defineProperty(kL, "__esModule", {
        value: !0
    });
    kL.HttpProxyAgent = void 0;
    var Mb5 = Pw7(h1("net")),
        Pb5 = Pw7(h1("tls")),
        Wb5 = jb5(L61()),
        Gb5 = h1("events"),
        Zb5 = wn6(),
        Mw7 = h1("url"),
        gJ1 = (0, Wb5.default)("http-proxy-agent");
    class _5A extends Zb5.Agent {
        constructor(A, q) {
            super(q);
            this.proxy = typeof A === "string" ? new Mw7.URL(A) : A, this.proxyHeaders = q?.headers ?? {}, gJ1("Creating new HttpProxyAgent instance: %o", this.proxy.href);
            let K = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
                Y = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
            this.connectOpts = {
                ...q ? fb5(q, "headers") : null,
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
            } = this, Y = q.secureEndpoint ? "https:" : "http:", z = A.getHeader("host") || "localhost", w = `${Y}//${z}`, H = new Mw7.URL(A.path, w);
            if (q.port !== 80) H.port = String(q.port);
            A.path = String(H);
            let $ = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
                ...this.proxyHeaders
            };
            if (K.username || K.password) {
                let O = `${decodeURIComponent(K.username)}:${decodeURIComponent(K.password)}`;
                $["Proxy-Authorization"] = `Basic ${Buffer.from(O).toString("base64")}`
            }
            if (!$["Proxy-Connection"]) $["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
            for (let O of Object.keys($)) {
                let _ = $[O];
                if (_) A.setHeader(O, _)
            }
        }
        async connect(A, q) {
            if (A._header = null, !A.path.includes("://")) this.setRequestProps(A, q);
            let K, Y;
            if (gJ1("Regenerating stored HTTP header string for request"), A._implicitHeader(), A.outputData && A.outputData.length > 0) gJ1("Patching connection write() output buffer with updated header"), K = A.outputData[0].data, Y = K.indexOf(`\r
\r
`) + 4, A.outputData[0].data = A._header + K.substring(Y), gJ1("Output buffer: %o", A.outputData[0].data);
            let z;
            if (this.proxy.protocol === "https:") gJ1("Creating `tls.Socket`: %o", this.connectOpts), z = Pb5.connect(this.connectOpts);
            else gJ1("Creating `net.Socket`: %o", this.connectOpts), z = Mb5.connect(this.connectOpts);
            return await (0, Gb5.once)(z, "connect"), z
        }
    }
    _5A.protocols = ["http", "https"];
    kL.HttpProxyAgent = _5A;

    function fb5(A, ...q) {
        let K = {},
            Y;
        for (Y in A)
            if (!q.includes(Y)) K[Y] = A[Y];
        return K
    }
})
// @from(Ln 150666, Col 0)
function B56(A) {
    if (process.env[A]) return process.env[A];
    else if (process.env[A.toLowerCase()]) return process.env[A.toLowerCase()];
    return
}
// @from(Ln 150672, Col 0)
function kb5() {
    if (!process) return;
    let A = B56(Vb5),
        q = B56(Tb5),
        K = B56(Nb5);
    return A || q || K
}
// @from(Ln 150680, Col 0)
function Lb5(A, q, K) {
    if (q.length === 0) return !1;
    let Y = new URL(A).hostname;
    if (K === null || K === void 0 ? void 0 : K.has(Y)) return K.get(Y);
    let z = !1;
    for (let w of q)
        if (w[0] === ".") {
            if (Y.endsWith(w)) z = !0;
            else if (Y.length === w.length - 1 && Y === w.slice(1)) z = !0
        } else if (Y === w) z = !0;
    return K === null || K === void 0 || K.set(Y, z), z
}
// @from(Ln 150693, Col 0)
function Rb5() {
    let A = B56(vb5);
    if (Tw7 = !0, A) return A.split(",").map((q) => q.trim()).filter((q) => q.length);
    return []
}
// @from(Ln 150699, Col 0)
function yb5() {
    let A = kb5();
    return A ? new URL(A) : void 0
}
// @from(Ln 150704, Col 0)
function Zw7(A) {
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
// @from(Ln 150716, Col 0)
function fw7(A, q, K) {
    if (A.agent) return;
    let z = new URL(A.url).protocol !== "https:";
    if (A.tlsSettings) VS.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
    let w = A.headers.toJSON();
    if (z) {
        if (!q.httpProxyAgent) q.httpProxyAgent = new Nw7.HttpProxyAgent(K, {
            headers: w
        });
        A.agent = q.httpProxyAgent
    } else {
        if (!q.httpsProxyAgent) q.httpsProxyAgent = new Vw7.HttpsProxyAgent(K, {
            headers: w
        });
        A.agent = q.httpsProxyAgent
    }
}
// @from(Ln 150734, Col 0)
function X5A(A, q) {
    if (!Tw7) Gw7.push(...Rb5());
    let K = A ? Zw7(A) : yb5(),
        Y = {};
    return {
        name: J5A,
        async sendRequest(z, w) {
            var H;
            if (!z.proxySettings && K && !Lb5(z.url, (H = q === null || q === void 0 ? void 0 : q.customNoProxyList) !== null && H !== void 0 ? H : Gw7, (q === null || q === void 0 ? void 0 : q.customNoProxyList) ? void 0 : Eb5)) fw7(z, Y, K);
            else if (z.proxySettings) fw7(z, Y, Zw7(z.proxySettings));
            return w(z)
        }
    }
}
// @from(Ln 150748, Col 4)
Vw7
// @from(Ln 150748, Col 9)
Nw7
// @from(Ln 150748, Col 14)
Vb5 = "HTTPS_PROXY"
// @from(Ln 150749, Col 4)
Nb5 = "HTTP_PROXY"
// @from(Ln 150750, Col 4)
Tb5 = "ALL_PROXY"
// @from(Ln 150751, Col 4)
vb5 = "NO_PROXY"
// @from(Ln 150752, Col 4)
J5A = "proxyPolicy"
// @from(Ln 150753, Col 4)
Gw7
// @from(Ln 150753, Col 9)
Tw7 = !1
// @from(Ln 150754, Col 4)
Eb5
// @from(Ln 150755, Col 4)
vw7 = v(() => {
    b56();
    Vw7 = o(Dk1(), 1), Nw7 = o(Ww7(), 1), Gw7 = [], Eb5 = new Map
})
// @from(Ln 150760, Col 0)
function D5A(A) {
    return {
        name: "agentPolicy",
        sendRequest: async (q, K) => {
            if (!q.agent) q.agent = A;
            return K(q)
        }
    }
}
// @from(Ln 150770, Col 0)
function j5A(A) {
    return {
        name: "tlsPolicy",
        sendRequest: async (q, K) => {
            if (!q.tlsSettings) q.tlsSettings = A;
            return K(q)
        }
    }
}
// @from(Ln 150780, Col 0)
function m56(A) {
    return typeof A.stream === "function"
}
// @from(Ln 150783, Col 4)
Ew7
// @from(Ln 150783, Col 9)
OE2
// @from(Ln 150783, Col 14)
_E2
// @from(Ln 150783, Col 19)
JE2
// @from(Ln 150783, Col 24)
XE2
// @from(Ln 150783, Col 29)
DE2
// @from(Ln 150783, Col 34)
jE2
// @from(Ln 150783, Col 39)
ME2
// @from(Ln 150783, Col 44)
PE2
// @from(Ln 150783, Col 49)
WE2
// @from(Ln 150783, Col 54)
GE2
// @from(Ln 150783, Col 59)
ZE2
// @from(Ln 150783, Col 64)
fE2
// @from(Ln 150783, Col 69)
VE2
// @from(Ln 150783, Col 74)
NE2
// @from(Ln 150783, Col 79)
TE2
// @from(Ln 150783, Col 84)
vE2
// @from(Ln 150783, Col 89)
EE2
// @from(Ln 150783, Col 94)
kE2
// @from(Ln 150783, Col 99)
LE2
// @from(Ln 150783, Col 104)
b71
// @from(Ln 150783, Col 109)
M5A
// @from(Ln 150783, Col 114)
RE2
// @from(Ln 150783, Col 119)
kw7
// @from(Ln 150783, Col 124)
yE2
// @from(Ln 150783, Col 129)
CE2
// @from(Ln 150783, Col 134)
SE2
// @from(Ln 150783, Col 139)
hE2
// @from(Ln 150783, Col 144)
IE2
// @from(Ln 150783, Col 149)
xE2
// @from(Ln 150783, Col 154)
bE2
// @from(Ln 150783, Col 159)
uE2
// @from(Ln 150783, Col 164)
BE2
// @from(Ln 150784, Col 4)
Lw7 = v(() => {
    Ew7 = o(n2(), 1), {
        __extends: OE2,
        __assign: _E2,
        __rest: JE2,
        __decorate: XE2,
        __param: DE2,
        __esDecorate: jE2,
        __runInitializers: ME2,
        __propKey: PE2,
        __setFunctionName: WE2,
        __metadata: GE2,
        __awaiter: ZE2,
        __generator: fE2,
        __exportStar: VE2,
        __createBinding: NE2,
        __values: TE2,
        __read: vE2,
        __spread: EE2,
        __spreadArrays: kE2,
        __spreadArray: LE2,
        __await: b71,
        __asyncGenerator: M5A,
        __asyncDelegator: RE2,
        __asyncValues: kw7,
        __makeTemplateObject: yE2,
        __importStar: CE2,
        __importDefault: SE2,
        __classPrivateFieldGet: hE2,
        __classPrivateFieldSet: IE2,
        __classPrivateFieldIn: xE2,
        __addDisposableResource: bE2,
        __disposeResources: uE2,
        __rewriteRelativeImportExtension: BE2
    } = Ew7.default
})
// @from(Ln 150824, Col 0)
function Rw7() {
    return M5A(this, arguments, function*() {
        let q = this.getReader();
        try {
            while (!0) {
                let {
                    done: K,
                    value: Y
                } = yield b71(q.read());
                if (K) return yield b71(void 0);
                yield yield b71(Y)
            }
        } finally {
            q.releaseLock()
        }
    })
}
// @from(Ln 150842, Col 0)
function Cb5(A) {
    if (!A[Symbol.asyncIterator]) A[Symbol.asyncIterator] = Rw7.bind(A);
    if (!A.values) A.values = Rw7.bind(A)
}
// @from(Ln 150847, Col 0)
function yw7(A) {
    if (A instanceof ReadableStream) return Cb5(A), P5A.fromWeb(A);
    else return A
}
// @from(Ln 150852, Col 0)
function Sb5(A) {
    if (A instanceof Uint8Array) return P5A.from(Buffer.from(A));
    else if (m56(A)) return yw7(A.stream());
    else return yw7(A)
}
// @from(Ln 150857, Col 0)
async function Cw7(A) {
    return function() {
        let q = A.map((K) => typeof K === "function" ? K() : K).map(Sb5);
        return P5A.from(function() {
            return M5A(this, arguments, function*() {
                var K, Y, z, w;
                for (let _ of q) try {
                    for (var H = !0, $ = (Y = void 0, kw7(_)), O; O = yield b71($.next()), K = O.done, !K; H = !0) w = O.value, H = !1, yield yield b71(w)
                } catch (J) {
                    Y = {
                        error: J
                    }
                } finally {
                    try {
                        if (!H && !K && (z = $.return)) yield b71(z.call($))
                    } finally {
                        if (Y) throw Y.error
                    }
                }
            })
        }())
    }
}
// @from(Ln 150880, Col 4)
Sw7 = v(() => {
    Lw7()
})
// @from(Ln 150884, Col 0)
function hb5() {
    return `----AzSDKFormBoundary${VS1()}`
}
// @from(Ln 150888, Col 0)
function Ib5(A) {
    let q = "";
    for (let [K, Y] of A) q += `${K}: ${Y}\r
`;
    return q
}
// @from(Ln 150895, Col 0)
function xb5(A) {
    if (A instanceof Uint8Array) return A.byteLength;
    else if (m56(A)) return A.size === -1 ? void 0 : A.size;
    else return
}
// @from(Ln 150901, Col 0)
function bb5(A) {
    let q = 0;
    for (let K of A) {
        let Y = xb5(K);
        if (Y === void 0) return;
        else q += Y
    }
    return q
}
// @from(Ln 150910, Col 0)
async function ub5(A, q, K) {
    let Y = [ku(`--${K}`, "utf-8"), ...q.flatMap((w) => [ku(`\r
`, "utf-8"), ku(Ib5(w.headers), "utf-8"), ku(`\r
`, "utf-8"), w.body, ku(`\r
--${K}`, "utf-8")]), ku(`--\r
\r
`, "utf-8")],
        z = bb5(Y);
    if (z) A.headers.set("Content-Length", z);
    A.body = await Cw7(Y)
}
// @from(Ln 150922, Col 0)
function Fb5(A) {
    if (A.length > Bb5) throw Error(`Multipart boundary "${A}" exceeds maximum length of 70 characters`);
    if (Array.from(A).some((q) => !mb5.has(q))) throw Error(`Multipart boundary "${A}" contains invalid characters`)
}
// @from(Ln 150927, Col 0)
function W5A() {
    return {
        name: F56,
        async sendRequest(A, q) {
            var K;
            if (!A.multipartBody) return q(A);
            if (A.body) throw Error("multipartBody and regular body cannot be set at the same time");
            let Y = A.multipartBody.boundary,
                z = (K = A.headers.get("Content-Type")) !== null && K !== void 0 ? K : "multipart/mixed",
                w = z.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
            if (!w) throw Error(`Got multipart request body, but content-type header was not multipart: ${z}`);
            let [, H, $] = w;
            if ($ && Y && $ !== Y) throw Error(`Multipart boundary was specified as ${$} in the header, but got ${Y} in the request body`);
            if (Y !== null && Y !== void 0 || (Y = $), Y) Fb5(Y);
            else Y = hb5();
            return A.headers.set("Content-Type", `${H}; boundary=${Y}`), await ub5(A, A.multipartBody.parts, Y), A.multipartBody = void 0, q(A)
        }
    }
}
// @from(Ln 150946, Col 4)
F56 = "multipartPolicy"
// @from(Ln 150947, Col 4)
Bb5 = 70
// @from(Ln 150948, Col 4)
mb5
// @from(Ln 150949, Col 4)
hw7 = v(() => {
    u3A();
    Sw7();
    mb5 = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?")
})
// @from(Ln 150954, Col 4)
UJ1 = v(() => {
    fS1();
    Q27();
    U27();
    U3A();
    o27();
    B27();
    m27()
})
// @from(Ln 150964, Col 0)
function RS1() {
    return m3A()
}
// @from(Ln 150967, Col 4)
G5A = v(() => {
    UJ1()
})
// @from(Ln 150970, Col 4)
YU
// @from(Ln 150971, Col 4)
Q56 = v(() => {
    I71();
    YU = ur("core-rest-pipeline")
})
// @from(Ln 150975, Col 4)
NS = v(() => {
    $w7();
    e3A();
    jw7();
    a27();
    hw7();
    vw7();
    e27()
})
// @from(Ln 150985, Col 0)
function Iw7(A = {}) {
    return l3A(Object.assign({
        logger: YU.info
    }, A))
}
// @from(Ln 150990, Col 4)
xw7 = v(() => {
    Q56();
    NS()
})
// @from(Ln 150995, Col 0)
function bw7(A = {}) {
    return i3A(A)
}
// @from(Ln 150998, Col 4)
uw7 = v(() => {
    NS()
})
// @from(Ln 151004, Col 0)
function Bw7() {
    return "User-Agent"
}
// @from(Ln 151007, Col 0)
async function mw7(A) {
    if (g56 && g56.versions) {
        let q = g56.versions;
        if (q.bun) A.set("Bun", q.bun);
        else if (q.deno) A.set("Deno", q.deno);
        else if (q.node) A.set("Node", q.node)
    }
    A.set("OS", `(${pJ1.arch()}-${pJ1.type()}-${pJ1.release()})`)
}
// @from(Ln 151016, Col 4)
Fw7 = () => {}
// @from(Ln 151017, Col 4)
U56 = "1.21.0"
// @from(Ln 151018, Col 4)
Qw7 = 3
// @from(Ln 151020, Col 0)
function cb5(A) {
    let q = [];
    for (let [K, Y] of A) {
        let z = Y ? `${K}/${Y}` : K;
        q.push(z)
    }
    return q.join(" ")
}
// @from(Ln 151029, Col 0)
function gw7() {
    return Bw7()
}
// @from(Ln 151032, Col 0)
async function p56(A) {
    let q = new Map;
    q.set("core-rest-pipeline", U56), await mw7(q);
    let K = cb5(q);
    return A ? `${A} ${K}` : K
}
// @from(Ln 151038, Col 4)
Z5A = v(() => {
    Fw7()
})
// @from(Ln 151042, Col 0)
function pw7(A = {}) {
    let q = p56(A.userAgentPrefix);
    return {
        name: lb5,
        async sendRequest(K, Y) {
            if (!K.headers.has(Uw7)) K.headers.set(Uw7, await q);
            return Y(K)
        }
    }
}
// @from(Ln 151052, Col 4)
Uw7
// @from(Ln 151052, Col 9)
lb5 = "userAgentPolicy"
// @from(Ln 151053, Col 4)
dw7 = v(() => {
    Z5A();
    Uw7 = gw7()
})
// @from(Ln 151057, Col 4)
d56 = v(() => {
    o3A();
    F3A();
    H5A();
    TS1()
})
// @from(Ln 151063, Col 4)
dJ1
// @from(Ln 151064, Col 4)
cw7 = v(() => {
    dJ1 = class dJ1 extends Error {
        constructor(A) {
            super(A);
            this.name = "AbortError"
        }
    }
})
// @from(Ln 151072, Col 4)
f5A = v(() => {
    cw7()
})
// @from(Ln 151076, Col 0)
function lw7(A, q) {
    let {
        cleanupBeforeAbort: K,
        abortSignal: Y,
        abortErrorMsg: z
    } = q !== null && q !== void 0 ? q : {};
    return new Promise((w, H) => {
        function $() {
            H(new dJ1(z !== null && z !== void 0 ? z : "The operation was aborted."))
        }

        function O() {
            Y === null || Y === void 0 || Y.removeEventListener("abort", _)
        }

        function _() {
            K === null || K === void 0 || K(), O(), $()
        }
        if (Y === null || Y === void 0 ? void 0 : Y.aborted) return $();
        try {
            A((J) => {
                O(), w(J)
            }, (J) => {
                O(), H(J)
            })
        } catch (J) {
            H(J)
        }
        Y === null || Y === void 0 || Y.addEventListener("abort", _)
    })
}
// @from(Ln 151107, Col 4)
iw7 = v(() => {
    f5A()
})
// @from(Ln 151111, Col 0)
function V5A(A, q) {
    let K, {
        abortSignal: Y,
        abortErrorMsg: z
    } = q !== null && q !== void 0 ? q : {};
    return lw7((w) => {
        K = setTimeout(w, A)
    }, {
        cleanupBeforeAbort: () => clearTimeout(K),
        abortSignal: Y,
        abortErrorMsg: z !== null && z !== void 0 ? z : rb5
    })
}
// @from(Ln 151124, Col 4)
rb5 = "The delay was aborted."
// @from(Ln 151125, Col 4)
nw7 = v(() => {
    iw7()
})
// @from(Ln 151129, Col 0)
function cJ1(A) {
    if (x71(A)) return A.message;
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
// @from(Ln 151142, Col 4)
rw7 = v(() => {
    d56()
})
// @from(Ln 151146, Col 0)
function ow7(A, q) {
    return kS1(A, q)
}
// @from(Ln 151150, Col 0)
function c56(A) {
    return x71(A)
}
// @from(Ln 151153, Col 4)
l56
// @from(Ln 151153, Col 9)
yS1
// @from(Ln 151154, Col 4)
mr = v(() => {
    d56();
    nw7();
    rw7();
    l56 = QJ1, yS1 = QJ1
})
// @from(Ln 151161, Col 0)
function N5A(A) {
    return typeof A[aw7] === "function"
}
// @from(Ln 151165, Col 0)
function sw7(A) {
    if (N5A(A)) return A[aw7]();
    else return A
}
// @from(Ln 151169, Col 4)
aw7
// @from(Ln 151170, Col 4)
tw7 = v(() => {
    aw7 = Symbol("rawContent")
})
// @from(Ln 151174, Col 0)
function ew7() {
    let A = W5A();
    return {
        name: T5A,
        sendRequest: async (q, K) => {
            if (q.multipartBody) {
                for (let Y of q.multipartBody.parts)
                    if (N5A(Y.body)) Y.body = sw7(Y.body)
            }
            return A.sendRequest(q, K)
        }
    }
}
// @from(Ln 151187, Col 4)
T5A
// @from(Ln 151188, Col 4)
AH7 = v(() => {
    NS();
    tw7();
    T5A = F56
})
// @from(Ln 151194, Col 0)
function qH7() {
    return n3A()
}
// @from(Ln 151197, Col 4)
KH7 = v(() => {
    NS()
})
// @from(Ln 151201, Col 0)
function YH7(A = {}) {
    return q5A(A)
}
// @from(Ln 151204, Col 4)
zH7 = v(() => {
    NS()
})
// @from(Ln 151208, Col 0)
function wH7() {
    return O5A()
}
// @from(Ln 151211, Col 4)
HH7 = v(() => {
    NS()
})
// @from(Ln 151215, Col 0)
function $H7(A, q) {
    return X5A(A, q)
}
// @from(Ln 151218, Col 4)
OH7 = v(() => {
    NS()
})
// @from(Ln 151222, Col 0)
function _H7(A = "x-ms-client-request-id") {
    return {
        name: "setClientRequestIdPolicy",
        async sendRequest(q, K) {
            if (!q.headers.has(A)) q.headers.set(A, q.requestId);
            return K(q)
        }
    }
}
// @from(Ln 151232, Col 0)
function JH7(A) {
    return D5A(A)
}
// @from(Ln 151235, Col 4)
XH7 = v(() => {
    NS()
})
// @from(Ln 151239, Col 0)
function DH7(A) {
    return j5A(A)
}
// @from(Ln 151242, Col 4)
jH7 = v(() => {
    NS()
})
// @from(Ln 151246, Col 0)
function MH7(A = {}) {
    let q = new CS1(A.parentContext);
    if (A.span) q = q.setValue(lJ1.span, A.span);
    if (A.namespace) q = q.setValue(lJ1.namespace, A.namespace);
    return q
}
// @from(Ln 151252, Col 0)
class CS1 {
    constructor(A) {
        this._contextMap = A instanceof CS1 ? new Map(A._contextMap) : new Map
    }
    setValue(A, q) {
        let K = new CS1(this);
        return K._contextMap.set(A, q), K
    }
    getValue(A) {
        return this._contextMap.get(A)
    }
    deleteValue(A) {
        let q = new CS1(this);
        return q._contextMap.delete(A), q
    }
}
// @from(Ln 151268, Col 4)
lJ1
// @from(Ln 151269, Col 4)
v5A = v(() => {
    lJ1 = {
        span: Symbol.for("@azure/core-tracing span"),
        namespace: Symbol.for("@azure/core-tracing namespace")
    }
})
// @from(Ln 151275, Col 4)
GH7 = R((PH7) => {
    Object.defineProperty(PH7, "__esModule", {
        value: !0
    });
    PH7.state = void 0;
    PH7.state = {
        instrumenterImplementation: void 0
    }
})
// @from(Ln 151284, Col 4)
ZH7
// @from(Ln 151284, Col 9)
i56
// @from(Ln 151285, Col 4)
fH7 = v(() => {
    ZH7 = o(GH7(), 1), i56 = ZH7.state
})
// @from(Ln 151289, Col 0)
function ob5() {
    return {
        end: () => {},
        isRecording: () => !1,
        recordException: () => {},
        setAttribute: () => {},
        setStatus: () => {},
        addEvent: () => {}
    }
}
// @from(Ln 151300, Col 0)
function ab5() {
    return {
        createRequestHeaders: () => {
            return {}
        },
        parseTraceparentHeader: () => {
            return
        },
        startSpan: (A, q) => {
            return {
                span: ob5(),
                tracingContext: MH7({
                    parentContext: q.tracingContext
                })
            }
        },
        withContext(A, q, ...K) {
            return q(...K)
        }
    }
}
// @from(Ln 151322, Col 0)
function SS1() {
    if (!i56.instrumenterImplementation) i56.instrumenterImplementation = ab5();
    return i56.instrumenterImplementation
}
// @from(Ln 151326, Col 4)
VH7 = v(() => {
    v5A();
    fH7()
})
// @from(Ln 151331, Col 0)
function hS1(A) {
    let {
        namespace: q,
        packageName: K,
        packageVersion: Y
    } = A;

    function z(_, J, X) {
        var D;
        let j = SS1().startSpan(_, Object.assign(Object.assign({}, X), {
                packageName: K,
                packageVersion: Y,
                tracingContext: (D = J === null || J === void 0 ? void 0 : J.tracingOptions) === null || D === void 0 ? void 0 : D.tracingContext
            })),
            M = j.tracingContext,
            P = j.span;
        if (!M.getValue(lJ1.namespace)) M = M.setValue(lJ1.namespace, q);
        P.setAttribute("az.namespace", M.getValue(lJ1.namespace));
        let W = Object.assign({}, J, {
            tracingOptions: Object.assign(Object.assign({}, J === null || J === void 0 ? void 0 : J.tracingOptions), {
                tracingContext: M
            })
        });
        return {
            span: P,
            updatedOptions: W
        }
    }
    async function w(_, J, X, D) {
        let {
            span: j,
            updatedOptions: M
        } = z(_, J, D);
        try {
            let P = await H(M.tracingOptions.tracingContext, () => Promise.resolve(X(M, j)));
            return j.setStatus({
                status: "success"
            }), P
        } catch (P) {
            throw j.setStatus({
                status: "error",
                error: P
            }), P
        } finally {
            j.end()
        }
    }

    function H(_, J, ...X) {
        return SS1().withContext(_, J, ...X)
    }

    function $(_) {
        return SS1().parseTraceparentHeader(_)
    }

    function O(_) {
        return SS1().createRequestHeaders(_)
    }
    return {
        startSpan: z,
        withSpan: w,
        withContext: H,
        parseTraceparentHeader: $,
        createRequestHeaders: O
    }
}
// @from(Ln 151398, Col 4)
NH7 = v(() => {
    VH7();
    v5A()
})
// @from(Ln 151402, Col 4)
E5A = v(() => {
    NH7()
})
// @from(Ln 151406, Col 0)
function IS1(A) {
    return g3A(A)
}
// @from(Ln 151409, Col 4)
iJ1
// @from(Ln 151410, Col 4)
n56 = v(() => {
    UJ1();
    iJ1 = kV
})
// @from(Ln 151415, Col 0)
function TH7(A = {}) {
    let q = p56(A.userAgentPrefix),
        K = new Eu({
            additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
        }),
        Y = tb5();
    return {
        name: sb5,
        async sendRequest(z, w) {
            var H;
            if (!Y) return w(z);
            let $ = await q,
                O = {
                    "http.url": K.sanitizeUrl(z.url),
                    "http.method": z.method,
                    "http.user_agent": $,
                    requestId: z.requestId
                };
            if ($) O["http.user_agent"] = $;
            let {
                span: _,
                tracingContext: J
            } = (H = eb5(Y, z, O)) !== null && H !== void 0 ? H : {};
            if (!_ || !J) return w(z);
            try {
                let X = await Y.withContext(J, w, z);
                return qu5(_, X), X
            } catch (X) {
                throw Au5(_, X), X
            }
        }
    }
}
// @from(Ln 151449, Col 0)
function tb5() {
    try {
        return hS1({
            namespace: "",
            packageName: "@azure/core-rest-pipeline",
            packageVersion: U56
        })
    } catch (A) {
        YU.warning(`Error when creating the TracingClient: ${cJ1(A)}`);
        return
    }
}
// @from(Ln 151462, Col 0)
function eb5(A, q, K) {
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
        let w = A.createRequestHeaders(z.tracingOptions.tracingContext);
        for (let [H, $] of Object.entries(w)) q.headers.set(H, $);
        return {
            span: Y,
            tracingContext: z.tracingOptions.tracingContext
        }
    } catch (Y) {
        YU.warning(`Skipping creating a tracing span due to an error: ${cJ1(Y)}`);
        return
    }
}
// @from(Ln 151489, Col 0)
function Au5(A, q) {
    try {
        if (A.setStatus({
                status: "error",
                error: c56(q) ? q : void 0
            }), IS1(q) && q.statusCode) A.setAttribute("http.status_code", q.statusCode);
        A.end()
    } catch (K) {
        YU.warning(`Skipping tracing span processing due to an error: ${cJ1(K)}`)
    }
}
// @from(Ln 151501, Col 0)
function qu5(A, q) {
    try {
        A.setAttribute("http.status_code", q.status);
        let K = q.headers.get("x-ms-request-id");
        if (K) A.setAttribute("serviceRequestId", K);
        if (q.status >= 400) A.setStatus({
            status: "error"
        });
        A.end()
    } catch (K) {
        YU.warning(`Skipping tracing span processing due to an error: ${cJ1(K)}`)
    }
}
// @from(Ln 151514, Col 4)
sb5 = "tracingPolicy"
// @from(Ln 151515, Col 4)
vH7 = v(() => {
    E5A();
    Z5A();
    Q56();
    mr();
    n56();
    d56()
})
// @from(Ln 151524, Col 0)
function r56(A) {
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
// @from(Ln 151547, Col 0)
function EH7() {
    return {
        name: Ku5,
        sendRequest: async (A, q) => {
            if (!A.abortSignal) return q(A);
            let {
                abortSignal: K,
                cleanup: Y
            } = r56(A.abortSignal);
            A.abortSignal = K;
            try {
                return await q(A)
            } finally {
                Y === null || Y === void 0 || Y()
            }
        }
    }
}
// @from(Ln 151565, Col 4)
Ku5 = "wrapAbortSignalLikePolicy"
// @from(Ln 151566, Col 4)
kH7 = () => {}
// @from(Ln 151568, Col 0)
function k5A(A) {
    var q;
    let K = RS1();
    if (yS1) {
        if (A.agent) K.addPolicy(JH7(A.agent));
        if (A.tlsOptions) K.addPolicy(DH7(A.tlsOptions));
        K.addPolicy($H7(A.proxyOptions)), K.addPolicy(qH7())
    }
    if (K.addPolicy(EH7()), K.addPolicy(wH7(), {
            beforePolicies: [T5A]
        }), K.addPolicy(pw7(A.userAgentOptions)), K.addPolicy(_H7((q = A.telemetryOptions) === null || q === void 0 ? void 0 : q.clientRequestIdHeaderName)), K.addPolicy(ew7(), {
            afterPhase: "Deserialize"
        }), K.addPolicy(YH7(A.retryOptions), {
            phase: "Retry"
        }), K.addPolicy(TH7(Object.assign(Object.assign({}, A.userAgentOptions), A.loggingOptions)), {
            afterPhase: "Retry"
        }), yS1) K.addPolicy(bw7(A.redirectOptions), {
        afterPhase: "Retry"
    });
    return K.addPolicy(Iw7(A.loggingOptions), {
        afterPhase: "Sign"
    }), K
}
// @from(Ln 151591, Col 4)
LH7 = v(() => {
    xw7();
    G5A();
    uw7();
    dw7();
    AH7();
    KH7();
    zH7();
    HH7();
    mr();
    OH7();
    XH7();
    jH7();
    vH7();
    kH7()
})
// @from(Ln 151608, Col 0)
function L5A() {
    let A = d3A();
    return {
        async sendRequest(q) {
            let {
                abortSignal: K,
                cleanup: Y
            } = q.abortSignal ? r56(q.abortSignal) : {};
            try {
                return q.abortSignal = K, await A.sendRequest(q)
            } finally {
                Y === null || Y === void 0 || Y()
            }
        }
    }
}
// @from(Ln 151624, Col 4)
RH7 = v(() => {
    UJ1()
})
// @from(Ln 151628, Col 0)
function zU(A) {
    return vu(A)
}
// @from(Ln 151631, Col 4)
yH7 = v(() => {
    UJ1()
})
// @from(Ln 151635, Col 0)
function $v(A) {
    return B3A(A)
}
// @from(Ln 151638, Col 4)
CH7 = v(() => {
    UJ1()
})
// @from(Ln 151642, Col 0)
function R5A(A, q = {
    maxRetries: Qw7
}) {
    return LS1(A, Object.assign({
        logger: Yu5
    }, q))
}
// @from(Ln 151649, Col 4)
Yu5
// @from(Ln 151650, Col 4)
SH7 = v(() => {
    I71();
    NS();
    Yu5 = ur("core-rest-pipeline retryPolicy")
})
// @from(Ln 151655, Col 0)
async function wu5(A, q, K) {
    async function Y() {
        if (Date.now() < K) try {
            return await A()
        } catch (w) {
            return null
        } else {
            let w = await A();
            if (w === null) throw Error("Failed to refresh access token.");
            return w
        }
    }
    let z = await Y();
    while (z === null) await V5A(q), z = await Y();
    return z
}
// @from(Ln 151672, Col 0)
function hH7(A, q) {
    let K = null,
        Y = null,
        z, w = Object.assign(Object.assign({}, zu5), q),
        H = {
            get isRefreshing() {
                return K !== null
            },
            get shouldRefresh() {
                var O;
                if (H.isRefreshing) return !1;
                if ((Y === null || Y === void 0 ? void 0 : Y.refreshAfterTimestamp) && Y.refreshAfterTimestamp < Date.now()) return !0;
                return ((O = Y === null || Y === void 0 ? void 0 : Y.expiresOnTimestamp) !== null && O !== void 0 ? O : 0) - w.refreshWindowInMs < Date.now()
            },
            get mustRefresh() {
                return Y === null || Y.expiresOnTimestamp - w.forcedRefreshWindowInMs < Date.now()
            }
        };

    function $(O, _) {
        var J;
        if (!H.isRefreshing) K = wu5(() => A.getToken(O, _), w.retryIntervalInMs, (J = Y === null || Y === void 0 ? void 0 : Y.expiresOnTimestamp) !== null && J !== void 0 ? J : Date.now()).then((D) => {
            return K = null, Y = D, z = _.tenantId, Y
        }).catch((D) => {
            throw K = null, Y = null, z = void 0, D
        });
        return K
    }
    return async (O, _) => {
        let J = Boolean(_.claims),
            X = z !== _.tenantId;
        if (J) Y = null;
        if (X || J || H.mustRefresh) return $(O, _);
        if (H.shouldRefresh) $(O, _);
        return Y
    }
}
// @from(Ln 151709, Col 4)
zu5
// @from(Ln 151710, Col 4)
IH7 = v(() => {
    mr();
    zu5 = {
        forcedRefreshWindowInMs: 1000,
        retryIntervalInMs: 3000,
        refreshWindowInMs: 120000
    }
})
// @from(Ln 151718, Col 0)
async function o56(A, q) {
    try {
        return [await q(A), void 0]
    } catch (K) {
        if (IS1(K) && K.response) return [K.response, K];
        else throw K
    }
}
// @from(Ln 151726, Col 0)
async function Hu5(A) {
    let {
        scopes: q,
        getAccessToken: K,
        request: Y
    } = A, z = {
        abortSignal: Y.abortSignal,
        tracingOptions: Y.tracingOptions,
        enableCae: !0
    }, w = await K(q, z);
    if (w) A.request.headers.set("Authorization", `Bearer ${w.token}`)
}
// @from(Ln 151739, Col 0)
function xH7(A) {
    return A.status === 401 && A.headers.has("WWW-Authenticate")
}
// @from(Ln 151742, Col 0)
async function bH7(A, q) {
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
// @from(Ln 151754, Col 0)
function xS1(A) {
    var q, K, Y;
    let {
        credential: z,
        scopes: w,
        challengeCallbacks: H
    } = A, $ = A.logger || YU, O = {
        authorizeRequest: (K = (q = H === null || H === void 0 ? void 0 : H.authorizeRequest) === null || q === void 0 ? void 0 : q.bind(H)) !== null && K !== void 0 ? K : Hu5,
        authorizeRequestOnChallenge: (Y = H === null || H === void 0 ? void 0 : H.authorizeRequestOnChallenge) === null || Y === void 0 ? void 0 : Y.bind(H)
    }, _ = z ? hH7(z) : () => Promise.resolve(null);
    return {
        name: BH7,
        async sendRequest(J, X) {
            if (!J.url.toLowerCase().startsWith("https://")) throw Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
            await O.authorizeRequest({
                scopes: Array.isArray(w) ? w : [w],
                request: J,
                getAccessToken: _,
                logger: $
            });
            let D, j, M;
            if ([D, j] = await o56(J, X), xH7(D)) {
                let P = uH7(D.headers.get("WWW-Authenticate"));
                if (P) {
                    let W;
                    try {
                        W = atob(P)
                    } catch (G) {
                        return $.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${P}`), D
                    }
                    if (M = await bH7({
                            scopes: Array.isArray(w) ? w : [w],
                            response: D,
                            request: J,
                            getAccessToken: _,
                            logger: $
                        }, W), M)[D, j] = await o56(J, X)
                } else if (O.authorizeRequestOnChallenge) {
                    if (M = await O.authorizeRequestOnChallenge({
                            scopes: Array.isArray(w) ? w : [w],
                            request: J,
                            response: D,
                            getAccessToken: _,
                            logger: $
                        }), M)[D, j] = await o56(J, X);
                    if (xH7(D)) {
                        if (P = uH7(D.headers.get("WWW-Authenticate")), P) {
                            let W;
                            try {
                                W = atob(P)
                            } catch (G) {
                                return $.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${P}`), D
                            }
                            if (M = await bH7({
                                    scopes: Array.isArray(w) ? w : [w],
                                    response: D,
                                    request: J,
                                    getAccessToken: _,
                                    logger: $
                                }, W), M)[D, j] = await o56(J, X)
                        }
                    }
                }
            }
            if (j) throw j;
            else return D
        }
    }
}
// @from(Ln 151824, Col 0)
function $u5(A) {
    let q = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g,
        K = /(\w+)="([^"]*)"/g,
        Y = [],
        z;
    while ((z = q.exec(A)) !== null) {
        let w = z[1],
            H = z[2],
            $ = {},
            O;
        while ((O = K.exec(H)) !== null) $[O[1]] = O[2];
        Y.push({
            scheme: w,
            params: $
        })
    }
    return Y
}
// @from(Ln 151843, Col 0)
function uH7(A) {
    var q;
    if (!A) return;
    return (q = $u5(A).find((Y) => Y.scheme === "Bearer" && Y.params.claims && Y.params.error === "insufficient_claims")) === null || q === void 0 ? void 0 : q.params.claims
}
// @from(Ln 151848, Col 4)
BH7 = "bearerTokenAuthenticationPolicy"
// @from(Ln 151849, Col 4)
mH7 = v(() => {
    IH7();
    Q56();
    n56()
})
// @from(Ln 151854, Col 4)
Lu = v(() => {
    G5A();
    LH7();
    RH7();
    yH7();
    CH7();
    n56();
    SH7();
    mH7()
})
// @from(Ln 151864, Col 4)
gH7 = R((FH7) => {
    Object.defineProperty(FH7, "__esModule", {
        value: !0
    });
    FH7.state = void 0;
    FH7.state = {
        operationRequestMap: new WeakMap
    }
})
// @from(Ln 151873, Col 4)
UH7
// @from(Ln 151873, Col 9)
y5A
// @from(Ln 151874, Col 4)
pH7 = v(() => {
    UH7 = o(gH7(), 1), y5A = UH7.state
})
// @from(Ln 151878, Col 0)
function Fr(A, q, K) {
    let {
        parameterPath: Y,
        mapper: z
    } = q, w;
    if (typeof Y === "string") Y = [Y];
    if (Array.isArray(Y)) {
        if (Y.length > 0)
            if (z.isConstant) w = z.defaultValue;
            else {
                let H = dH7(A, Y);
                if (!H.propertyFound && K) H = dH7(K, Y);
                let $ = !1;
                if (!H.propertyFound) $ = z.required || Y[0] === "options" && Y.length === 2;
                w = $ ? z.defaultValue : H.propertyValue
            }
    } else {
        if (z.required) w = {};
        for (let H in Y) {
            let $ = z.type.modelProperties[H],
                O = Y[H],
                _ = Fr(A, {
                    parameterPath: O,
                    mapper: $
                }, K);
            if (_ !== void 0) {
                if (!w) w = {};
                w[H] = _
            }
        }
    }
    return w
}
// @from(Ln 151912, Col 0)
function dH7(A, q) {
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
// @from(Ln 151926, Col 0)
function Ou5(A) {
    return cH7 in A
}
// @from(Ln 151930, Col 0)
function wU(A) {
    if (Ou5(A)) return wU(A[cH7]);
    let q = y5A.operationRequestMap.get(A);
    if (!q) q = {}, y5A.operationRequestMap.set(A, q);
    return q
}
// @from(Ln 151936, Col 4)
cH7
// @from(Ln 151937, Col 4)
bS1 = v(() => {
    pH7();
    cH7 = Symbol.for("@azure/core-client original request")
})
// @from(Ln 151942, Col 0)
function lH7(A = {}) {
    var q, K, Y, z, w, H, $;
    let O = (K = (q = A.expectedContentTypes) === null || q === void 0 ? void 0 : q.json) !== null && K !== void 0 ? K : _u5,
        _ = (z = (Y = A.expectedContentTypes) === null || Y === void 0 ? void 0 : Y.xml) !== null && z !== void 0 ? z : Ju5,
        J = A.parseXML,
        X = A.serializerOptions,
        D = {
            xml: {
                rootName: (w = X === null || X === void 0 ? void 0 : X.xml.rootName) !== null && w !== void 0 ? w : "",
                includeRoot: (H = X === null || X === void 0 ? void 0 : X.xml.includeRoot) !== null && H !== void 0 ? H : !1,
                xmlCharKey: ($ = X === null || X === void 0 ? void 0 : X.xml.xmlCharKey) !== null && $ !== void 0 ? $ : C56
            }
        };
    return {
        name: Xu5,
        async sendRequest(j, M) {
            let P = await M(j);
            return Mu5(O, _, P, D, J)
        }
    }
}
// @from(Ln 151964, Col 0)
function Du5(A) {
    let q, K = A.request,
        Y = wU(K),
        z = Y === null || Y === void 0 ? void 0 : Y.operationSpec;
    if (z)
        if (!(Y === null || Y === void 0 ? void 0 : Y.operationResponseGetter)) q = z.responses[A.status];
        else q = Y === null || Y === void 0 ? void 0 : Y.operationResponseGetter(z, A);
    return q
}
// @from(Ln 151974, Col 0)
function ju5(A) {
    let q = A.request,
        K = wU(q),
        Y = K === null || K === void 0 ? void 0 : K.shouldDeserialize,
        z;
    if (Y === void 0) z = !0;
    else if (typeof Y === "boolean") z = Y;
    else z = Y(A);
    return z
}
// @from(Ln 151984, Col 0)
async function Mu5(A, q, K, Y, z) {
    let w = await Gu5(A, q, K, Y, z);
    if (!ju5(w)) return w;
    let H = wU(w.request),
        $ = H === null || H === void 0 ? void 0 : H.operationSpec;
    if (!$ || !$.responses) return w;
    let O = Du5(w),
        {
            error: _,
            shouldReturnResponse: J
        } = Wu5(w, $, O, Y);
    if (_) throw _;
    else if (J) return w;
    if (O) {
        if (O.bodyMapper) {
            let X = w.parsedBody;
            if ($.isXML && O.bodyMapper.type.name === KU.Sequence) X = typeof X === "object" ? X[O.bodyMapper.xmlElementName] : [];
            try {
                w.parsedBody = $.serializer.deserialize(O.bodyMapper, X, "operationRes.parsedBody", Y)
            } catch (D) {
                throw new iJ1(`Error ${D} occurred in deserializing the responseBody - ${w.bodyAsText}`, {
                    statusCode: w.status,
                    request: w.request,
                    response: w
                })
            }
        } else if ($.httpMethod === "HEAD") w.parsedBody = K.status >= 200 && K.status < 300;
        if (O.headersMapper) w.parsedHeaders = $.serializer.deserialize(O.headersMapper, w.headers.toJSON(), "operationRes.parsedHeaders", {
            xml: {},
            ignoreUnknownProperties: !0
        })
    }
    return w
}
// @from(Ln 152019, Col 0)
function Pu5(A) {
    let q = Object.keys(A.responses);
    return q.length === 0 || q.length === 1 && q[0] === "default"
}
// @from(Ln 152024, Col 0)
function Wu5(A, q, K, Y) {
    var z, w, H, $, O;
    let _ = 200 <= A.status && A.status < 300;
    if (Pu5(q) ? _ : !!K)
        if (K) {
            if (!K.isError) return {
                error: null,
                shouldReturnResponse: !1
            }
        } else return {
            error: null,
            shouldReturnResponse: !1
        };
    let X = K !== null && K !== void 0 ? K : q.responses.default,
        D = ((z = A.request.streamResponseStatusCodes) === null || z === void 0 ? void 0 : z.has(A.status)) ? `Unexpected status code: ${A.status}` : A.bodyAsText,
        j = new iJ1(D, {
            statusCode: A.status,
            request: A.request,
            response: A
        });
    if (!X && !(((H = (w = A.parsedBody) === null || w === void 0 ? void 0 : w.error) === null || H === void 0 ? void 0 : H.code) && ((O = ($ = A.parsedBody) === null || $ === void 0 ? void 0 : $.error) === null || O === void 0 ? void 0 : O.message))) throw j;
    let M = X === null || X === void 0 ? void 0 : X.bodyMapper,
        P = X === null || X === void 0 ? void 0 : X.headersMapper;
    try {
        if (A.parsedBody) {
            let W = A.parsedBody,
                G;
            if (M) {
                let Z = W;
                if (q.isXML && M.type.name === KU.Sequence) {
                    Z = [];
                    let N = M.xmlElementName;
                    if (typeof W === "object" && N) Z = W[N]
                }
                G = q.serializer.deserialize(M, Z, "error.response.parsedBody", Y)
            }
            let f = W.error || G || W;
            if (j.code = f.code, f.message) j.message = f.message;
            if (M) j.response.parsedBody = G
        }
        if (A.headers && P) j.response.parsedHeaders = q.serializer.deserialize(P, A.headers.toJSON(), "operationRes.parsedHeaders")
    } catch (W) {
        j.message = `Error "${W.message}" occurred in deserializing the responseBody - "${A.bodyAsText}" for the default response.`
    }
    return {
        error: j,
        shouldReturnResponse: !1
    }
}
// @from(Ln 152073, Col 0)
async function Gu5(A, q, K, Y, z) {
    var w;
    if (!((w = K.request.streamResponseStatusCodes) === null || w === void 0 ? void 0 : w.has(K.status)) && K.bodyAsText) {
        let H = K.bodyAsText,
            $ = K.headers.get("Content-Type") || "",
            O = !$ ? [] : $.split(";").map((_) => _.toLowerCase());
        try {
            if (O.length === 0 || O.some((_) => A.indexOf(_) !== -1)) return K.parsedBody = JSON.parse(H), K;
            else if (O.some((_) => q.indexOf(_) !== -1)) {
                if (!z) throw Error("Parsing XML not supported.");
                let _ = await z(H, Y.xml);
                return K.parsedBody = _, K
            }
        } catch (_) {
            let J = `Error "${_}" occurred while parsing the response body - ${K.bodyAsText}.`,
                X = _.code || iJ1.PARSE_ERROR;
            throw new iJ1(J, {
                code: X,
                statusCode: K.status,
                request: K.request,
                response: K
            })
        }
    }
    return K
}
// @from(Ln 152099, Col 4)
_u5
// @from(Ln 152099, Col 9)
Ju5
// @from(Ln 152099, Col 14)
Xu5 = "deserializationPolicy"
// @from(Ln 152100, Col 4)
iH7 = v(() => {
    Lu();
    S56();
    bS1();
    _u5 = ["application/json", "text/json"], Ju5 = ["application/xml", "application/atom+xml"]
})
// @from(Ln 152107, Col 0)
function nH7(A) {
    let q = new Set;
    for (let K in A.responses) {
        let Y = A.responses[K];
        if (Y.bodyMapper && Y.bodyMapper.type.name === KU.Stream) q.add(Number(K))
    }
    return q
}
// @from(Ln 152116, Col 0)
function Ru(A) {
    let {
        parameterPath: q,
        mapper: K
    } = A, Y;
    if (typeof q === "string") Y = q;
    else if (Array.isArray(q)) Y = q.join(".");
    else Y = K.serializedName;
    return Y
}
// @from(Ln 152126, Col 4)
a56 = v(() => {
    S56()
})
// @from(Ln 152130, Col 0)
function rH7(A = {}) {
    let q = A.stringifyXML;
    return {
        name: Zu5,
        async sendRequest(K, Y) {
            let z = wU(K),
                w = z === null || z === void 0 ? void 0 : z.operationSpec,
                H = z === null || z === void 0 ? void 0 : z.operationArguments;
            if (w && H) fu5(K, H, w), Vu5(K, H, w, q);
            return Y(K)
        }
    }
}
// @from(Ln 152144, Col 0)
function fu5(A, q, K) {
    var Y, z;
    if (K.headerParameters)
        for (let H of K.headerParameters) {
            let $ = Fr(q, H);
            if ($ !== null && $ !== void 0 || H.mapper.required) {
                $ = K.serializer.serialize(H.mapper, $, Ru(H));
                let O = H.mapper.headerCollectionPrefix;
                if (O)
                    for (let _ of Object.keys($)) A.headers.set(O + _, $[_]);
                else A.headers.set(H.mapper.serializedName || Ru(H), $)
            }
        }
    let w = (z = (Y = q.options) === null || Y === void 0 ? void 0 : Y.requestOptions) === null || z === void 0 ? void 0 : z.customHeaders;
    if (w)
        for (let H of Object.keys(w)) A.headers.set(H, w[H])
}