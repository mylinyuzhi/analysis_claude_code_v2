
// @from(Ln 6448, Col 0)
class az {
    constructor({
        baseURL: q = ap6("ANTHROPIC_BASE_URL"),
        apiKey: K = ap6("ANTHROPIC_API_KEY") ?? null,
        authToken: _ = ap6("ANTHROPIC_AUTH_TOKEN") ?? null,
        ...z
    } = {}) {
        q71.add(this), xw8.set(this, void 0);
        let Y = {
            apiKey: K,
            authToken: _,
            ...z,
            baseURL: q || "https://api.anthropic.com"
        };
        if (!Y.dangerouslyAllowBrowser && JG7()) throw new bq(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
        this.baseURL = Y.baseURL, this.timeout = Y.timeout ?? K71.DEFAULT_TIMEOUT, this.logger = Y.logger ?? console;
        let A = "warn";
        this.logLevel = A, this.logLevel = X11(Y.logLevel, "ClientOptions.logLevel", this) ?? X11(ap6("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? A, this.fetchOptions = Y.fetchOptions, this.maxRetries = Y.maxRetries ?? 2, this.fetch = Y.fetch ?? MG7(), N4(this, xw8, WG7, "f"), this._options = Y, this.apiKey = typeof K === "string" ? K : null, this.authToken = _
    }
    withOptions(q) {
        return new this.constructor({
            ...this._options,
            baseURL: this.baseURL,
            maxRetries: this.maxRetries,
            timeout: this.timeout,
            logger: this.logger,
            logLevel: this.logLevel,
            fetch: this.fetch,
            fetchOptions: this.fetchOptions,
            apiKey: this.apiKey,
            authToken: this.authToken,
            ...q
        })
    }
    defaultQuery() {
        return this._options.defaultQuery
    }
    validateHeaders({
        values: q,
        nulls: K
    }) {
        if (q.get("x-api-key") || q.get("authorization")) return;
        if (this.apiKey && q.get("x-api-key")) return;
        if (K.has("x-api-key")) return;
        if (this.authToken && q.get("authorization")) return;
        if (K.has("authorization")) return;
        throw Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')
    }
    async authHeaders(q) {
        return r3([await this.apiKeyAuth(q), await this.bearerAuth(q)])
    }
    async apiKeyAuth(q) {
        if (this.apiKey == null) return;
        return r3([{
            "X-Api-Key": this.apiKey
        }])
    }
    async bearerAuth(q) {
        if (this.authToken == null) return;
        return r3([{
            Authorization: `Bearer ${this.authToken}`
        }])
    }
    stringifyQuery(q) {
        return DG7(q)
    }
    getUserAgent() {
        return `${this.constructor.name}/JS ${S86}`
    }
    defaultIdempotencyKey() {
        return `stainless-node-retry-${Y11()}`
    }
    makeStatusError(q, K, _, z) {
        return vq.generate(q, K, _, z)
    }
    buildURL(q, K, _) {
        let z = !U1(this, q71, "m", eG7).call(this) && _ || this.baseURL,
            Y = YG7(q) ? new URL(q) : new URL(z + (z.endsWith("/") && q.startsWith("/") ? q.slice(1) : q)),
            A = this.defaultQuery(),
            O = Object.fromEntries(Y.searchParams);
        if (!w11(A) || !w11(O)) K = {
            ...O,
            ...A,
            ...K
        };
        if (typeof K === "object" && K && !Array.isArray(K)) Y.search = this.stringifyQuery(K);
        return Y.toString()
    }
    _calculateNonstreamingTimeout(q) {
        if (3600 * q / 128000 > 600) throw new bq("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
        return 600000
    }
    async prepareOptions(q) {}
    async prepareRequest(q, {
        url: K,
        options: _
    }) {}
    get(q, K) {
        return this.methodRequest("get", q, K)
    }
    post(q, K) {
        return this.methodRequest("post", q, K)
    }
    patch(q, K) {
        return this.methodRequest("patch", q, K)
    }
    put(q, K) {
        return this.methodRequest("put", q, K)
    }
    delete(q, K) {
        return this.methodRequest("delete", q, K)
    }
    methodRequest(q, K, _) {
        return this.request(Promise.resolve(_).then((z) => {
            return {
                method: q,
                path: K,
                ...z
            }
        }))
    }
    request(q, K = null) {
        return new vY6(this, this.makeRequest(q, K, void 0))
    }
    async makeRequest(q, K, _) {
        let z = await q,
            Y = z.maxRetries ?? this.maxRetries;
        if (K == null) K = Y;
        await this.prepareOptions(z);
        let {
            req: A,
            url: O,
            timeout: w
        } = await this.buildRequest(z, {
            retryCount: Y - K
        });
        await this.prepareRequest(A, {
            url: O,
            options: z
        });
        let $ = "log_" + (Math.random() * 16777216 | 0).toString(16).padStart(6, "0"),
            j = _ === void 0 ? "" : `, retryOf: ${_}`,
            H = Date.now();
        if (B0(this).debug(`[${$}] sending request`, pi({
                retryOfRequestLogID: _,
                method: z.method,
                url: O,
                options: z,
                headers: A.headers
            })), z.signal?.aborted) throw new r_;
        let J = new AbortController,
            X = await this.fetchWithTimeout(O, A, w, J).catch(Hp6),
            M = Date.now();
        if (X instanceof globalThis.Error) {
            let D = `retrying, ${K} attempts remaining`;
            if (z.signal?.aborted) throw new r_;
            let Z = Bi(X) || /timed? ?out/i.test(String(X) + ("cause" in X ? String(X.cause) : ""));
            if (K) return B0(this).info(`[${$}] connection ${Z?"timed out":"failed"} - ${D}`), B0(this).debug(`[${$}] connection ${Z?"timed out":"failed"} (${D})`, pi({
                retryOfRequestLogID: _,
                url: O,
                durationMs: M - H,
                message: X.message
            })), this.retryRequest(z, K, _ ?? $);
            if (B0(this).info(`[${$}] connection ${Z?"timed out":"failed"} - error; no more retries left`), B0(this).debug(`[${$}] connection ${Z?"timed out":"failed"} (error; no more retries left)`, pi({
                    retryOfRequestLogID: _,
                    url: O,
                    durationMs: M - H,
                    message: X.message
                })), Z) throw new ng;
            throw new bZ({
                cause: X
            })
        }
        let P = [...X.headers.entries()].filter(([D]) => D === "request-id").map(([D, Z]) => ", " + D + ": " + JSON.stringify(Z)).join(""),
            W = `[${$}${j}${P}] ${A.method} ${O} ${X.ok?"succeeded":"failed"} with status ${X.status} in ${M-H}ms`;
        if (!X.ok) {
            let D = await this.shouldRetry(X);
            if (K && D) {
                let k = `retrying, ${K} attempts remaining`;
                return await PG7(X.body), B0(this).info(`${W} - ${k}`), B0(this).debug(`[${$}] response error (${k})`, pi({
                    retryOfRequestLogID: _,
                    url: X.url,
                    status: X.status,
                    headers: X.headers,
                    durationMs: M - H
                })), this.retryRequest(z, K, _ ?? $, X.headers)
            }
            let Z = D ? "error; no more retries left" : "error; not retryable";
            B0(this).info(`${W} - ${Z}`);
            let G = await X.text().catch((k) => Hp6(k).message),
                f = Aw8(G),
                v = f ? void 0 : G;
            throw B0(this).debug(`[${$}] response error (${Z})`, pi({
                retryOfRequestLogID: _,
                url: X.url,
                status: X.status,
                headers: X.headers,
                message: v,
                durationMs: Date.now() - H
            })), this.makeStatusError(X.status, f, v, X.headers)
        }
        return B0(this).info(W), B0(this).debug(`[${$}] response start`, pi({
            retryOfRequestLogID: _,
            url: X.url,
            status: X.status,
            headers: X.headers,
            durationMs: M - H
        })), {
            response: X,
            options: z,
            controller: J,
            requestLogID: $,
            retryOfRequestLogID: _,
            startTime: H
        }
    }
    getAPIList(q, K, _) {
        return this.requestAPIList(K, _ && "then" in _ ? _.then((z) => ({
            method: "get",
            path: q,
            ...z
        })) : {
            method: "get",
            path: q,
            ..._
        })
    }
    requestAPIList(q, K) {
        let _ = this.makeRequest(K, null, void 0);
        return new Mw8(this, _, q)
    }
    async fetchWithTimeout(q, K, _, z) {
        let {
            signal: Y,
            method: A,
            ...O
        } = K || {}, w = this._makeAbort(z);
        if (Y) Y.addEventListener("abort", w, {
            once: !0
        });
        let $ = setTimeout(w, _),
            j = globalThis.ReadableStream && O.body instanceof globalThis.ReadableStream || typeof O.body === "object" && O.body !== null && Symbol.asyncIterator in O.body,
            H = {
                signal: z.signal,
                ...j ? {
                    duplex: "half"
                } : {},
                method: "GET",
                ...O
            };
        if (A) H.method = A.toUpperCase();
        try {
            return await this.fetch.call(void 0, q, H)
        } finally {
            clearTimeout($)
        }
    }
    async shouldRetry(q) {
        let K = q.headers.get("x-should-retry");
        if (K === "true") return !0;
        if (K === "false") return !1;
        if (q.status === 408) return !0;
        if (q.status === 409) return !0;
        if (q.status === 429) return !0;
        if (q.status >= 500) return !0;
        return !1
    }
    async retryRequest(q, K, _, z) {
        let Y, A = z?.get("retry-after-ms");
        if (A) {
            let w = parseFloat(A);
            if (!Number.isNaN(w)) Y = w
        }
        let O = z?.get("retry-after");
        if (O && !Y) {
            let w = parseFloat(O);
            if (!Number.isNaN(w)) Y = w * 1000;
            else Y = Date.parse(O) - Date.now()
        }
        if (Y === void 0) {
            let w = q.maxRetries ?? this.maxRetries;
            Y = this.calculateDefaultRetryTimeoutMillis(K, w)
        }
        return await wG7(Y), this.makeRequest(q, K - 1, _)
    }
    calculateDefaultRetryTimeoutMillis(q, K) {
        let Y = K - q,
            A = Math.min(0.5 * Math.pow(2, Y), 8),
            O = 1 - Math.random() * 0.25;
        return A * O * 1000
    }
    calculateNonstreamingTimeout(q, K) {
        if (3600000 * q / 128000 > 600000 || K != null && q > K) throw new bq("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
        return 600000
    }
    async buildRequest(q, {
        retryCount: K = 0
    } = {}) {
        let _ = {
                ...q
            },
            {
                method: z,
                path: Y,
                query: A,
                defaultBaseURL: O
            } = _,
            w = this.buildURL(Y, A, O);
        if ("timeout" in _) OG7("timeout", _.timeout);
        _.timeout = _.timeout ?? this.timeout;
        let {
            bodyHeaders: $,
            body: j
        } = this.buildBody({
            options: _
        }), H = await this.buildHeaders({
            options: q,
            method: z,
            bodyHeaders: $,
            retryCount: K
        });
        return {
            req: {
                method: z,
                headers: H,
                ..._.signal && {
                    signal: _.signal
                },
                ...globalThis.ReadableStream && j instanceof globalThis.ReadableStream && {
                    duplex: "half"
                },
                ...j && {
                    body: j
                },
                ...this.fetchOptions ?? {},
                ..._.fetchOptions ?? {}
            },
            url: w,
            timeout: _.timeout
        }
    }
    async buildHeaders({
        options: q,
        method: K,
        bodyHeaders: _,
        retryCount: z
    }) {
        let Y = {};
        if (this.idempotencyHeader && K !== "get") {
            if (!q.idempotencyKey) q.idempotencyKey = this.defaultIdempotencyKey();
            Y[this.idempotencyHeader] = q.idempotencyKey
        }
        let A = r3([Y, {
            Accept: "application/json",
            "User-Agent": this.getUserAgent(),
            "X-Stainless-Retry-Count": String(z),
            ...q.timeout ? {
                "X-Stainless-Timeout": String(Math.trunc(q.timeout / 1000))
            } : {},
            ...XG7(),
            ...this._options.dangerouslyAllowBrowser ? {
                "anthropic-dangerous-direct-browser-access": "true"
            } : void 0,
            "anthropic-version": "2023-06-01"
        }, await this.authHeaders(q), this._options.defaultHeaders, _, q.headers]);
        return this.validateHeaders(A), A.values
    }
    _makeAbort(q) {
        return () => q.abort()
    }
    buildBody({
        options: {
            body: q,
            headers: K
        }
    }) {
        if (!q) return {
            bodyHeaders: void 0,
            body: void 0
        };
        let _ = r3([K]);
        if (ArrayBuffer.isView(q) || q instanceof ArrayBuffer || q instanceof DataView || typeof q === "string" && _.values.has("content-type") || globalThis.Blob && q instanceof globalThis.Blob || q instanceof FormData || q instanceof URLSearchParams || globalThis.ReadableStream && q instanceof globalThis.ReadableStream) return {
            bodyHeaders: void 0,
            body: q
        };
        else if (typeof q === "object" && ((Symbol.asyncIterator in q) || (Symbol.iterator in q) && ("next" in q) && typeof q.next === "function")) return {
            bodyHeaders: void 0,
            body: Ow8(q)
        };
        else if (typeof q === "object" && _.values.get("content-type") === "application/x-www-form-urlencoded") return {
            bodyHeaders: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: this.stringifyQuery(q)
        };
        else return U1(this, xw8, "f").call(this, {
            body: q,
            headers: _
        })
    }
}
// @from(Ln 6856, Col 4)
q71
// @from(Ln 6856, Col 9)
K71
// @from(Ln 6856, Col 14)
xw8
// @from(Ln 6856, Col 19)
eG7
// @from(Ln 6856, Col 24)
qv7 = "\\n\\nHuman:"
// @from(Ln 6857, Col 4)
Kv7 = "\\n\\nAssistant:"
// @from(Ln 6858, Col 4)
qh
// @from(Ln 6859, Col 4)
yC = L(() => {
    mi();
    GY6();
    $11();
    ZG7();
    m0();
    ig();
    T11();
    nD6();
    Jw8();
    Q11();
    e11();
    U11();
    t11();
    $11();
    tL();
    jw8();
    GY6();
    K71 = az, xw8 = new WeakMap, q71 = new WeakSet, eG7 = function() {
        return this.baseURL !== "https://api.anthropic.com"
    };
    az.Anthropic = K71;
    az.HUMAN_PROMPT = qv7;
    az.AI_PROMPT = Kv7;
    az.DEFAULT_TIMEOUT = 600000;
    az.AnthropicError = bq;
    az.APIError = vq;
    az.APIConnectionError = bZ;
    az.APIConnectionTimeoutError = ng;
    az.APIUserAbortError = r_;
    az.NotFoundError = fY6;
    az.ConflictError = Mp6;
    az.RateLimitError = Wp6;
    az.BadRequestError = Jp6;
    az.AuthenticationError = ZY6;
    az.InternalServerError = Dp6;
    az.PermissionDeniedError = Xp6;
    az.UnprocessableEntityError = Pp6;
    az.toFile = Pw8;
    qh = class qh extends az {
        constructor() {
            super(...arguments);
            this.completions = new m86(this), this.messages = new jV(this), this.models = new lD6(this), this.beta = new p0(this)
        }
    };
    qh.Completions = m86;
    qh.Messages = jV;
    qh.Models = lD6;
    qh.Beta = p0
})
// @from(Ln 6909, Col 4)
eG = L(() => {
    yC();
    T11();
    Jw8();
    yC();
    ig();
    m0()
})
// @from(Ln 6918, Col 0)
function uw8(q) {
    return q instanceof sz || q instanceof r_ || q instanceof Error && q.name === "AbortError"
}
// @from(Ln 6922, Col 0)
function p86(q, K) {
    return q instanceof Error && q.message === K
}
// @from(Ln 6926, Col 0)
function r1(q) {
    return q instanceof Error ? q : Error(String(q))
}
// @from(Ln 6930, Col 0)
function b6(q) {
    return q instanceof Error ? q.message : String(q)
}
// @from(Ln 6934, Col 0)
function Q1(q) {
    if (q && typeof q === "object" && "code" in q && typeof q.code === "string") return q.code;
    return
}
// @from(Ln 6939, Col 0)
function t1(q) {
    return Q1(q) === "ENOENT"
}
// @from(Ln 6943, Col 0)
function _71(q) {
    return Q1(q) === "EISDIR"
}
// @from(Ln 6947, Col 0)
function mw8(q) {
    if (q && typeof q === "object" && "path" in q && typeof q.path === "string") return q.path;
    return
}
// @from(Ln 6952, Col 0)
function z71(q, K = 5) {
    if (!(q instanceof Error)) return String(q);
    if (!q.stack) return q.message;
    let _ = q.stack.split(`
`),
        z = _[0] ?? q.message,
        Y = _.slice(1).filter((A) => A.trim().startsWith("at "));
    if (Y.length <= K) return q.stack;
    return [z, ...Y.slice(0, K)].join(`
`)
}
// @from(Ln 6964, Col 0)
function D5(q) {
    let K = Q1(q);
    return K === "ENOENT" || K === "EACCES" || K === "EPERM" || K === "ENOTDIR" || K === "ELOOP"
}
// @from(Ln 6969, Col 0)
function LC(q) {
    let K = b6(q);
    if (!q || typeof q !== "object" || !("isAxiosError" in q) || !q.isAxiosError) return {
        kind: "other",
        message: K
    };
    let _ = q,
        z = _.response?.status;
    if (z === 401 || z === 403) return {
        kind: "auth",
        status: z,
        message: K
    };
    if (_.code === "ECONNABORTED") return {
        kind: "timeout",
        status: z,
        message: K
    };
    if (_.code === "ECONNREFUSED" || _.code === "ENOTFOUND") return {
        kind: "network",
        status: z,
        message: K
    };
    return {
        kind: "http",
        status: z,
        message: K
    }
}
// @from(Ln 6998, Col 4)
sp6
// @from(Ln 6998, Col 9)
rg
// @from(Ln 6998, Col 13)
sz
// @from(Ln 6998, Col 17)
HV
// @from(Ln 6998, Col 21)
JV
// @from(Ln 6998, Col 25)
dj
// @from(Ln 6998, Col 29)
XV
// @from(Ln 6999, Col 4)
m8 = L(() => {
    eG();
    sp6 = class sp6 extends Error {
        constructor(q) {
            super(q);
            this.name = this.constructor.name
        }
    };
    rg = class rg extends Error {};
    sz = class sz extends Error {
        constructor(q) {
            super(q);
            this.name = "AbortError"
        }
    };
    HV = class HV extends Error {
        filePath;
        defaultConfig;
        constructor(q, K, _) {
            super(q);
            this.name = "ConfigParseError", this.filePath = K, this.defaultConfig = _
        }
    };
    JV = class JV extends Error {
        stdout;
        stderr;
        code;
        interrupted;
        hadSandboxViolation;
        constructor(q, K, _, z, Y = !1) {
            super("Shell command failed");
            this.stdout = q;
            this.stderr = K;
            this.code = _;
            this.interrupted = z;
            this.hadSandboxViolation = Y;
            this.name = "ShellError"
        }
    };
    dj = class dj extends Error {
        formattedMessage;
        constructor(q, K) {
            super(q);
            this.formattedMessage = K;
            this.name = "TeleportOperationError"
        }
    };
    XV = class XV extends Error {
        telemetryMessage;
        constructor(q, K) {
            super(q);
            this.name = "TelemetrySafeError", this.telemetryMessage = K ?? q
        }
    }
})
// @from(Ln 7055, Col 0)
function bf5(q, K) {
    var _ = -1,
        z = q == null ? 0 : q.length;
    while (++_ < z)
        if (K(q[_], _, q) === !1) break;
    return q
}
// @from(Ln 7062, Col 4)
_v7
// @from(Ln 7063, Col 4)
zv7 = L(() => {
    _v7 = bf5
})
// @from(Ln 7066, Col 4)
If5
// @from(Ln 7066, Col 9)
iD6
// @from(Ln 7067, Col 4)
Y71 = L(() => {
    D86();
    If5 = function() {
        try {
            var q = IN(Object, "defineProperty");
            return q({}, "", {}), q
        } catch (K) {}
    }(), iD6 = If5
})
// @from(Ln 7077, Col 0)
function xf5(q, K, _) {
    if (K == "__proto__" && iD6) iD6(q, K, {
        configurable: !0,
        enumerable: !0,
        value: _,
        writable: !0
    });
    else q[K] = _
}
// @from(Ln 7086, Col 4)
F86
// @from(Ln 7087, Col 4)
tp6 = L(() => {
    Y71();
    F86 = xf5
})
// @from(Ln 7092, Col 0)
function Bf5(q, K, _) {
    var z = q[K];
    if (!(mf5.call(q, K) && ug(z, _)) || _ === void 0 && !(K in q)) F86(q, K, _)
}
// @from(Ln 7096, Col 4)
uf5
// @from(Ln 7096, Col 9)
mf5
// @from(Ln 7096, Col 14)
g86
// @from(Ln 7097, Col 4)
ep6 = L(() => {
    tp6();
    t06();
    uf5 = Object.prototype, mf5 = uf5.hasOwnProperty;
    g86 = Bf5
})
// @from(Ln 7104, Col 0)
function pf5(q, K, _, z) {
    var Y = !_;
    _ || (_ = {});
    var A = -1,
        O = K.length;
    while (++A < O) {
        var w = K[A],
            $ = z ? z(_[w], q[w], w, _, q) : void 0;
        if ($ === void 0) $ = q[w];
        if (Y) F86(_, w, $);
        else g86(_, w, $)
    }
    return _
}
// @from(Ln 7118, Col 4)
hC
// @from(Ln 7119, Col 4)
EY6 = L(() => {
    ep6();
    tp6();
    hC = pf5
})
// @from(Ln 7125, Col 0)
function Ff5(q, K) {
    return q && hC(K, vC(K), q)
}
// @from(Ln 7128, Col 4)
Yv7
// @from(Ln 7129, Col 4)
Av7 = L(() => {
    EY6();
    OY6();
    Yv7 = Ff5
})
// @from(Ln 7135, Col 0)
function gf5(q) {
    var K = [];
    if (q != null)
        for (var _ in Object(q)) K.push(_);
    return K
}
// @from(Ln 7141, Col 4)
Ov7
// @from(Ln 7142, Col 4)
wv7 = L(() => {
    Ov7 = gf5
})
// @from(Ln 7146, Col 0)
function df5(q) {
    if (!xO(q)) return Ov7(q);
    var K = JD6(q),
        _ = [];
    for (var z in q)
        if (!(z == "constructor" && (K || !Qf5.call(q, z)))) _.push(z);
    return _
}
// @from(Ln 7154, Col 4)
Uf5
// @from(Ln 7154, Col 9)
Qf5
// @from(Ln 7154, Col 14)
$v7
// @from(Ln 7155, Col 4)
jv7 = L(() => {
    zV();
    fO8();
    wv7();
    Uf5 = Object.prototype, Qf5 = Uf5.hasOwnProperty;
    $v7 = df5
})
// @from(Ln 7163, Col 0)
function cf5(q) {
    return gg(q) ? ZO8(q, !0) : $v7(q)
}
// @from(Ln 7166, Col 4)
og
// @from(Ln 7167, Col 4)
rD6 = L(() => {
    j61();
    jv7();
    XD6();
    og = cf5
})
// @from(Ln 7174, Col 0)
function lf5(q, K) {
    return q && hC(K, og(K), q)
}
// @from(Ln 7177, Col 4)
Hv7
// @from(Ln 7178, Col 4)
Jv7 = L(() => {
    EY6();
    rD6();
    Hv7 = lf5
})
// @from(Ln 7183, Col 4)
pw8 = {}
// @from(Ln 7188, Col 0)
function if5(q, K) {
    if (K) return q.slice();
    var _ = q.length,
        z = Pv7 ? Pv7(_) : new q.constructor(_);
    return q.copy(z), z
}
// @from(Ln 7194, Col 4)
Wv7
// @from(Ln 7194, Col 9)
Xv7
// @from(Ln 7194, Col 14)
nf5
// @from(Ln 7194, Col 19)
Mv7
// @from(Ln 7194, Col 24)
Pv7
// @from(Ln 7194, Col 29)
qF6
// @from(Ln 7195, Col 4)
A71 = L(() => {
    GC();
    Wv7 = typeof pw8 == "object" && pw8 && !pw8.nodeType && pw8, Xv7 = Wv7 && typeof Bw8 == "object" && Bw8 && !Bw8.nodeType && Bw8, nf5 = Xv7 && Xv7.exports === Wv7, Mv7 = nf5 ? oJ.Buffer : void 0, Pv7 = Mv7 ? Mv7.allocUnsafe : void 0;
    qF6 = if5
})
// @from(Ln 7201, Col 0)
function rf5(q, K) {
    var _ = -1,
        z = q.length;
    K || (K = Array(z));
    while (++_ < z) K[_] = q[_];
    return K
}
// @from(Ln 7208, Col 4)
Fw8
// @from(Ln 7209, Col 4)
O71 = L(() => {
    Fw8 = rf5
})
// @from(Ln 7213, Col 0)
function of5(q, K) {
    return hC(q, wD6(q), K)
}
// @from(Ln 7216, Col 4)
Dv7
// @from(Ln 7217, Col 4)
Zv7 = L(() => {
    EY6();
    $O8();
    Dv7 = of5
})
// @from(Ln 7222, Col 4)
af5
// @from(Ln 7222, Col 9)
oD6
// @from(Ln 7223, Col 4)
gw8 = L(() => {
    H61();
    af5 = GO8(Object.getPrototypeOf, Object), oD6 = af5
})
// @from(Ln 7227, Col 4)
sf5
// @from(Ln 7227, Col 9)
tf5
// @from(Ln 7227, Col 14)
Uw8
// @from(Ln 7228, Col 4)
w71 = L(() => {
    YO8();
    gw8();
    $O8();
    O61();
    sf5 = Object.getOwnPropertySymbols, tf5 = !sf5 ? wO8 : function(q) {
        var K = [];
        while (q) OD6(K, wD6(q)), q = oD6(q);
        return K
    }, Uw8 = tf5
})
// @from(Ln 7240, Col 0)
function ef5(q, K) {
    return hC(q, Uw8(q), K)
}
// @from(Ln 7243, Col 4)
fv7
// @from(Ln 7244, Col 4)
Gv7 = L(() => {
    EY6();
    w71();
    fv7 = ef5
})
// @from(Ln 7250, Col 0)
function qG5(q) {
    return AO8(q, og, Uw8)
}
// @from(Ln 7253, Col 4)
aD6
// @from(Ln 7254, Col 4)
Qw8 = L(() => {
    Y61();
    w71();
    rD6();
    aD6 = qG5
})
// @from(Ln 7261, Col 0)
function zG5(q) {
    var K = q.length,
        _ = new q.constructor(K);
    if (K && typeof q[0] == "string" && _G5.call(q, "index")) _.index = q.index, _.input = q.input;
    return _
}
// @from(Ln 7267, Col 4)
KG5
// @from(Ln 7267, Col 9)
_G5
// @from(Ln 7267, Col 14)
vv7
// @from(Ln 7268, Col 4)
Tv7 = L(() => {
    KG5 = Object.prototype, _G5 = KG5.hasOwnProperty;
    vv7 = zG5
})
// @from(Ln 7273, Col 0)
function YG5(q) {
    var K = new q.constructor(q.byteLength);
    return new YD6(K).set(new YD6(q)), K
}
// @from(Ln 7277, Col 4)
sD6
// @from(Ln 7278, Col 4)
dw8 = L(() => {
    _61();
    sD6 = YG5
})
// @from(Ln 7283, Col 0)
function AG5(q, K) {
    var _ = K ? sD6(q.buffer) : q.buffer;
    return new q.constructor(_, q.byteOffset, q.byteLength)
}
// @from(Ln 7287, Col 4)
Vv7
// @from(Ln 7288, Col 4)
kv7 = L(() => {
    dw8();
    Vv7 = AG5
})
// @from(Ln 7293, Col 0)
function wG5(q) {
    var K = new q.constructor(q.source, OG5.exec(q));
    return K.lastIndex = q.lastIndex, K
}
// @from(Ln 7297, Col 4)
OG5
// @from(Ln 7297, Col 9)
Nv7
// @from(Ln 7298, Col 4)
Ev7 = L(() => {
    OG5 = /\w*$/;
    Nv7 = wG5
})
// @from(Ln 7303, Col 0)
function $G5(q) {
    return Lv7 ? Object(Lv7.call(q)) : {}
}
// @from(Ln 7306, Col 4)
yv7
// @from(Ln 7306, Col 9)
Lv7
// @from(Ln 7306, Col 14)
hv7
// @from(Ln 7307, Col 4)
Rv7 = L(() => {
    zY6();
    yv7 = x0 ? x0.prototype : void 0, Lv7 = yv7 ? yv7.valueOf : void 0;
    hv7 = $G5
})
// @from(Ln 7313, Col 0)
function jG5(q, K) {
    var _ = K ? sD6(q.buffer) : q.buffer;
    return new q.constructor(_, q.byteOffset, q.length)
}
// @from(Ln 7317, Col 4)
cw8
// @from(Ln 7318, Col 4)
$71 = L(() => {
    dw8();
    cw8 = jG5
})
// @from(Ln 7323, Col 0)
function RG5(q, K, _) {
    var z = q.constructor;
    switch (K) {
        case fG5:
            return sD6(q);
        case HG5:
        case JG5:
            return new z(+q);
        case GG5:
            return Vv7(q, _);
        case vG5:
        case TG5:
        case VG5:
        case kG5:
        case NG5:
        case EG5:
        case yG5:
        case LG5:
        case hG5:
            return cw8(q, _);
        case XG5:
            return new z;
        case MG5:
        case DG5:
            return new z(q);
        case PG5:
            return Nv7(q);
        case WG5:
            return new z;
        case ZG5:
            return hv7(q)
    }
}
// @from(Ln 7356, Col 4)
HG5 = "[object Boolean]"
// @from(Ln 7357, Col 4)
JG5 = "[object Date]"
// @from(Ln 7358, Col 4)
XG5 = "[object Map]"
// @from(Ln 7359, Col 4)
MG5 = "[object Number]"
// @from(Ln 7360, Col 4)
PG5 = "[object RegExp]"
// @from(Ln 7361, Col 4)
WG5 = "[object Set]"
// @from(Ln 7362, Col 4)
DG5 = "[object String]"
// @from(Ln 7363, Col 4)
ZG5 = "[object Symbol]"
// @from(Ln 7364, Col 4)
fG5 = "[object ArrayBuffer]"
// @from(Ln 7365, Col 4)
GG5 = "[object DataView]"
// @from(Ln 7366, Col 4)
vG5 = "[object Float32Array]"
// @from(Ln 7367, Col 4)
TG5 = "[object Float64Array]"
// @from(Ln 7368, Col 4)
VG5 = "[object Int8Array]"
// @from(Ln 7369, Col 4)
kG5 = "[object Int16Array]"
// @from(Ln 7370, Col 4)
NG5 = "[object Int32Array]"
// @from(Ln 7371, Col 4)
EG5 = "[object Uint8Array]"
// @from(Ln 7372, Col 4)
yG5 = "[object Uint8ClampedArray]"
// @from(Ln 7373, Col 4)
LG5 = "[object Uint16Array]"
// @from(Ln 7374, Col 4)
hG5 = "[object Uint32Array]"
// @from(Ln 7375, Col 4)
Sv7
// @from(Ln 7376, Col 4)
Cv7 = L(() => {
    dw8();
    kv7();
    Ev7();
    Rv7();
    $71();
    Sv7 = RG5
})
// @from(Ln 7384, Col 4)
bv7
// @from(Ln 7384, Col 9)
SG5
// @from(Ln 7384, Col 14)
Iv7
// @from(Ln 7385, Col 4)
xv7 = L(() => {
    zV();
    bv7 = Object.create, SG5 = function() {
        function q() {}
        return function(K) {
            if (!xO(K)) return {};
            if (bv7) return bv7(K);
            q.prototype = K;
            var _ = new q;
            return q.prototype = void 0, _
        }
    }(), Iv7 = SG5
})
// @from(Ln 7399, Col 0)
function CG5(q) {
    return typeof q.constructor == "function" && !JD6(q) ? Iv7(oD6(q)) : {}
}
// @from(Ln 7402, Col 4)
lw8
// @from(Ln 7403, Col 4)
j71 = L(() => {
    xv7();
    gw8();
    fO8();
    lw8 = CG5
})
// @from(Ln 7410, Col 0)
function IG5(q) {
    return TW(q) && yi(q) == bG5
}
// @from(Ln 7413, Col 4)
bG5 = "[object Map]"
// @from(Ln 7414, Col 4)
uv7
// @from(Ln 7415, Col 4)
mv7 = L(() => {
    bB6();
    Bg();
    uv7 = IG5
})
// @from(Ln 7420, Col 4)
Bv7
// @from(Ln 7420, Col 9)
xG5
// @from(Ln 7420, Col 14)
pv7
// @from(Ln 7421, Col 4)
Fv7 = L(() => {
    mv7();
    XO8();
    WO8();
    Bv7 = Fg && Fg.isMap, xG5 = Bv7 ? jD6(Bv7) : uv7, pv7 = xG5
})
// @from(Ln 7428, Col 0)
function mG5(q) {
    return TW(q) && yi(q) == uG5
}
// @from(Ln 7431, Col 4)
uG5 = "[object Set]"
// @from(Ln 7432, Col 4)
gv7
// @from(Ln 7433, Col 4)
Uv7 = L(() => {
    bB6();
    Bg();
    gv7 = mG5
})
// @from(Ln 7438, Col 4)
Qv7
// @from(Ln 7438, Col 9)
BG5
// @from(Ln 7438, Col 14)
dv7
// @from(Ln 7439, Col 4)
cv7 = L(() => {
    Uv7();
    XO8();
    WO8();
    Qv7 = Fg && Fg.isSet, BG5 = Qv7 ? jD6(Qv7) : gv7, dv7 = BG5
})
// @from(Ln 7446, Col 0)
function nw8(q, K, _, z, Y, A) {
    var O, w = K & pG5,
        $ = K & FG5,
        j = K & gG5;
    if (_) O = Y ? _(q, z, Y, A) : _(q);
    if (O !== void 0) return O;
    if (!xO(q)) return q;
    var H = uO(q);
    if (H) {
        if (O = vv7(q), !w) return Fw8(q, O)
    } else {
        var J = yi(q),
            X = J == nv7 || J == lG5;
        if (pg(q)) return qF6(q, w);
        if (J == iv7 || J == lv7 || X && !Y) {
            if (O = $ || X ? {} : lw8(q), !w) return $ ? fv7(q, Hv7(O, q)) : Dv7(q, Yv7(O, q))
        } else {
            if (!P$[J]) return Y ? q : {};
            O = Sv7(q, J, w)
        }
    }
    A || (A = new mg);
    var M = A.get(q);
    if (M) return M;
    if (A.set(q, O), dv7(q)) q.forEach(function(D) {
        O.add(nw8(D, K, _, D, q, A))
    });
    else if (pv7(q)) q.forEach(function(D, Z) {
        O.set(Z, nw8(D, K, _, Z, q, A))
    });
    var P = j ? $ ? aD6 : CB6 : $ ? og : vC,
        W = H ? void 0 : P(q);
    return _v7(W || q, function(D, Z) {
        if (W) Z = D, D = q[Z];
        g86(O, Z, nw8(D, K, _, Z, q, A))
    }), O
}
// @from(Ln 7483, Col 4)
pG5 = 1
// @from(Ln 7484, Col 4)
FG5 = 2
// @from(Ln 7485, Col 4)
gG5 = 4
// @from(Ln 7486, Col 4)
lv7 = "[object Arguments]"
// @from(Ln 7487, Col 4)
UG5 = "[object Array]"
// @from(Ln 7488, Col 4)
QG5 = "[object Boolean]"
// @from(Ln 7489, Col 4)
dG5 = "[object Date]"
// @from(Ln 7490, Col 4)
cG5 = "[object Error]"
// @from(Ln 7491, Col 4)
nv7 = "[object Function]"
// @from(Ln 7492, Col 4)
lG5 = "[object GeneratorFunction]"
// @from(Ln 7493, Col 4)
nG5 = "[object Map]"
// @from(Ln 7494, Col 4)
iG5 = "[object Number]"
// @from(Ln 7495, Col 4)
iv7 = "[object Object]"
// @from(Ln 7496, Col 4)
rG5 = "[object RegExp]"
// @from(Ln 7497, Col 4)
oG5 = "[object Set]"
// @from(Ln 7498, Col 4)
aG5 = "[object String]"
// @from(Ln 7499, Col 4)
sG5 = "[object Symbol]"
// @from(Ln 7500, Col 4)
tG5 = "[object WeakMap]"
// @from(Ln 7501, Col 4)
eG5 = "[object ArrayBuffer]"
// @from(Ln 7502, Col 4)
qv5 = "[object DataView]"
// @from(Ln 7503, Col 4)
Kv5 = "[object Float32Array]"
// @from(Ln 7504, Col 4)
_v5 = "[object Float64Array]"
// @from(Ln 7505, Col 4)
zv5 = "[object Int8Array]"
// @from(Ln 7506, Col 4)
Yv5 = "[object Int16Array]"
// @from(Ln 7507, Col 4)
Av5 = "[object Int32Array]"
// @from(Ln 7508, Col 4)
Ov5 = "[object Uint8Array]"
// @from(Ln 7509, Col 4)
wv5 = "[object Uint8ClampedArray]"
// @from(Ln 7510, Col 4)
$v5 = "[object Uint16Array]"
// @from(Ln 7511, Col 4)
jv5 = "[object Uint32Array]"
// @from(Ln 7512, Col 4)
P$
// @from(Ln 7512, Col 8)
rv7
// @from(Ln 7513, Col 4)
ov7 = L(() => {
    yB6();
    zv7();
    ep6();
    Av7();
    Jv7();
    A71();
    O71();
    Zv7();
    Gv7();
    J61();
    Qw8();
    bB6();
    Tv7();
    Cv7();
    j71();
    YV();
    hB6();
    Fv7();
    zV();
    cv7();
    OY6();
    rD6();
    P$ = {};
    P$[lv7] = P$[UG5] = P$[eG5] = P$[qv5] = P$[QG5] = P$[dG5] = P$[Kv5] = P$[_v5] = P$[zv5] = P$[Yv5] = P$[Av5] = P$[nG5] = P$[iG5] = P$[iv7] = P$[rG5] = P$[oG5] = P$[aG5] = P$[sG5] = P$[Ov5] = P$[wv5] = P$[$v5] = P$[jv5] = !0;
    P$[cG5] = P$[nv7] = P$[tG5] = !1;
    rv7 = nw8
})
// @from(Ln 7548, Col 0)
function Pv5() {
    return Mv5
}
// @from(Ln 7552, Col 0)
function I6(q, K, _) {
    let Y = [];
    try {
        const z = rz(Y, Jw`JSON.stringify(${q})`, 0);
        return JSON.stringify(q, K, _)
    } catch (A) {
        var O = A,
            w = 1
    } finally {
        oz(Y, O, w)
    }
}
// @from(Ln 7565, Col 0)
function H71(q, K) {
    let z = [];
    try {
        const _ = rz(z, Jw`structuredClone(${q})`, 0);
        return structuredClone(q, K)
    } catch (Y) {
        var A = Y,
            O = 1
    } finally {
        oz(z, A, O)
    }
}
// @from(Ln 7578, Col 0)
function aJ(q, K, _) {
    let A = [];
    try {
        const z = rz(A, Jw`fs.writeFileSync(${q}, ${K})`, 0);
        let Y = _ !== null && typeof _ === "object" && "flush" in _ && _.flush === !0;
        if (Y) {
            let j = typeof _ === "object" && "encoding" in _ ? _.encoding : void 0,
                H = typeof _ === "object" && "mode" in _ ? _.mode : void 0,
                J;
            try {
                J = Xv5(q, "w", H), av7(J, K, {
                    encoding: j ?? void 0
                }), Jv5(J)
            } finally {
                if (J !== void 0) Hv5(J)
            }
        } else av7(q, K, _)
    } catch (O) {
        var w = O,
            $ = 1
    } finally {
        oz(A, w, $)
    }
}
// @from(Ln 7602, Col 4)
tNA
// @from(Ln 7602, Col 9)
Mv5
// @from(Ln 7602, Col 14)
Jw
// @from(Ln 7602, Col 18)
n8 = (q, K) => {
    let z = [];
    try {
        const _ = rz(z, Jw`JSON.parse(${q})`, 0);
        return typeof K > "u" ? JSON.parse(q) : JSON.parse(q, K)
    } catch (Y) {
        var A = Y,
            O = 1
    } finally {
        oz(z, A, O)
    }
}
// @from(Ln 7614, Col 4)
e8 = L(() => {
    y8();
    K8();
    tNA = (() => {
        let q = process.env.CLAUDE_CODE_SLOW_OPERATION_THRESHOLD_MS;
        if (q !== void 0) {
            let K = Number(q);
            if (!Number.isNaN(K) && K >= 0) return K
        }
        return 1 / 0
    })(), Mv5 = {
        [Symbol.dispose]() {}
    };
    Jw = Pv5
})
// @from(Ln 7646, Col 0)
function vA(q, K) {
    if (K.startsWith("//") || K.startsWith("\\\\")) return {
        resolvedPath: K,
        isSymlink: !1,
        isCanonical: !1
    };
    try {
        let _ = q.lstatSync(K);
        if (_.isFIFO() || _.isSocket() || _.isCharacterDevice() || _.isBlockDevice()) return {
            resolvedPath: K,
            isSymlink: !1,
            isCanonical: !1
        };
        let z = q.realpathSync(K);
        return {
            resolvedPath: z,
            isSymlink: z !== K,
            isCanonical: !0
        }
    } catch (_) {
        return {
            resolvedPath: K,
            isSymlink: !1,
            isCanonical: !1
        }
    }
}
// @from(Ln 7674, Col 0)
function di(q, K, _) {
    let {
        resolvedPath: z
    } = vA(q, K);
    if (_.has(z)) return !0;
    return _.add(z), !1
}
// @from(Ln 7682, Col 0)
function Vv5(q, K) {
    let _ = K,
        z = [];
    while (_ !== F0.dirname(_)) {
        let Y, A;
        try {
            Y = q.readlinkSync(_)
        } catch (O) {
            A = Q1(O)
        }
        if (Y !== void 0) try {
            let O = q.realpathSync(_);
            return z.length === 0 ? O : F0.join(O, ...z)
        } catch {
            let O = F0.isAbsolute(Y) ? Y : F0.resolve(F0.dirname(_), Y);
            return z.length === 0 ? O : F0.join(O, ...z)
        }
        if (A === "ENOENT") {
            z.unshift(F0.basename(_)), _ = F0.dirname(_);
            continue
        }
        try {
            let O = q.realpathSync(_);
            if (O !== _) return z.length === 0 ? O : F0.join(O, ...z)
        } catch {}
        return
    }
    return
}
// @from(Ln 7712, Col 0)
function Ym(q) {
    let K = q;
    if (K === "~") K = tv7().normalize("NFC");
    else if (K.startsWith("~/")) K = F0.join(tv7().normalize("NFC"), K.slice(2));
    let _ = new Set,
        z = V8();
    if (_.add(K), K.startsWith("//") || K.startsWith("\\\\")) return Array.from(_);
    try {
        let O = K,
            w = new Set,
            $ = 40;
        for (let j = 0; j < $; j++) {
            if (w.has(O)) break;
            w.add(O);
            let H, J;
            try {
                H = z.readlinkSync(O)
            } catch (M) {
                J = Q1(M)
            }
            if (H === void 0) {
                if (J === "ENOENT") {
                    if (O === K) {
                        let M = Vv5(z, K);
                        if (M !== void 0) _.add(M)
                    }
                }
                break
            }
            let X = F0.isAbsolute(H) ? H : F0.resolve(F0.dirname(O), H);
            _.add(X), O = X
        }
    } catch {}
    let {
        resolvedPath: Y,
        isSymlink: A
    } = vA(z, K);
    if (A && Y !== K) _.add(Y);
    return Array.from(_)
}
// @from(Ln 7753, Col 0)
function V8() {
    return Nv5
}
// @from(Ln 7756, Col 0)
async function rw8(q, K, _) {
    let $ = [];
    try {
        const z = rz($, await iw8(q, "r"), 1);
        let Y = (await z.stat()).size;
        if (Y <= K) return null;
        let A = Math.min(Y - K, _);
        let O = Buffer.allocUnsafe(A);
        let w = 0;
        while (w < A) {
            let {
                bytesRead: M
            } = await z.read(O, w, A - w, K + w);
            if (M === 0) break;
            w += M
        }
        return {
            content: O.toString("utf8", 0, w),
            bytesRead: w,
            bytesTotal: Y
        }
    } catch (j) {
        var H = j,
            J = 1
    } finally {
        var X = oz($, H, J);
        X && await X
    }
}
// @from(Ln 7785, Col 0)
async function RC(q, K) {
    let $ = [];
    try {
        const _ = rz($, await iw8(q, "r"), 1);
        let z = (await _.stat()).size;
        if (z === 0) return {
            content: "",
            bytesRead: 0,
            bytesTotal: 0
        };
        let Y = Math.max(0, z - K);
        let A = z - Y;
        let O = Buffer.allocUnsafe(A);
        let w = 0;
        while (w < A) {
            let {
                bytesRead: M
            } = await _.read(O, w, A - w, Y + w);
            if (M === 0) break;
            w += M
        }
        return {
            content: O.toString("utf8", 0, w),
            bytesRead: w,
            bytesTotal: z
        }
    } catch (j) {
        var H = j,
            J = 1
    } finally {
        var X = oz($, H, J);
        X && await X
    }
}
// @from(Ln 7819, Col 0)
async function* ow8(q) {
    let _ = await iw8(q, "r");
    try {
        let Y = (await _.stat()).size,
            A = Buffer.alloc(0),
            O = Buffer.alloc(4096);
        while (Y > 0) {
            let w = Math.min(4096, Y);
            Y -= w, await _.read(O, 0, w, Y);
            let $ = Buffer.concat([O.subarray(0, w), A]),
                j = $.indexOf(10);
            if (j === -1) {
                A = $;
                continue
            }
            A = Buffer.from($.subarray(0, j));
            let H = $.toString("utf8", j + 1).split(`
`);
            for (let J = H.length - 1; J >= 0; J--) {
                let X = H[J];
                if (X) yield X
            }
        }
        if (A.length > 0) yield A.toString("utf8")
    } finally {
        await _.close()
    }
}
// @from(Ln 7847, Col 4)
kv5
// @from(Ln 7847, Col 9)
Nv5
// @from(Ln 7848, Col 4)
Yq = L(() => {
    m8();
    e8();
    kv5 = {
        cwd() {
            return process.cwd()
        },
        existsSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.existsSync(${q})`, 0);
                return W9.existsSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        async stat(q) {
            return vv5(q)
        },
        async readdir(q) {
            return Dv5(q, {
                withFileTypes: !0
            })
        },
        async unlink(q) {
            return Tv5(q)
        },
        async rmdir(q) {
            return fv5(q)
        },
        async rm(q, K) {
            return Gv5(q, K)
        },
        async mkdir(q, K) {
            try {
                await Wv5(q, {
                    recursive: !0,
                    ...K
                })
            } catch (_) {
                if (Q1(_) !== "EEXIST") throw _
            }
        },
        async readFile(q, K) {
            return sv7(q, {
                encoding: K.encoding
            })
        },
        async rename(q, K) {
            return Zv5(q, K)
        },
        statSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.statSync(${q})`, 0);
                return W9.statSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        lstatSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.lstatSync(${q})`, 0);
                return W9.lstatSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        readFileSync(q, K) {
            let z = [];
            try {
                const _ = rz(z, Jw`fs.readFileSync(${q})`, 0);
                return W9.readFileSync(q, {
                    encoding: K.encoding
                })
            } catch (Y) {
                var A = Y,
                    O = 1
            } finally {
                oz(z, A, O)
            }
        },
        readFileBytesSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.readFileBytesSync(${q})`, 0);
                return W9.readFileSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        readSync(q, K) {
            let Y = [];
            try {
                const _ = rz(Y, Jw`fs.readSync(${q}, ${K.length} bytes)`, 0);
                let z = void 0;
                try {
                    z = W9.openSync(q, "r");
                    let $ = Buffer.alloc(K.length),
                        j = W9.readSync(z, $, 0, K.length, 0);
                    return {
                        buffer: $,
                        bytesRead: j
                    }
                } finally {
                    if (z) W9.closeSync(z)
                }
            } catch (A) {
                var O = A,
                    w = 1
            } finally {
                oz(Y, O, w)
            }
        },
        appendFileSync(q, K, _) {
            let Y = [];
            try {
                const z = rz(Y, Jw`fs.appendFileSync(${q}, ${K.length} chars)`, 0);
                if (_?.mode !== void 0) try {
                    let $ = W9.openSync(q, "ax", _.mode);
                    try {
                        W9.appendFileSync($, K)
                    } finally {
                        W9.closeSync($)
                    }
                    return
                } catch ($) {
                    if (Q1($) !== "EEXIST") throw $
                }
                W9.appendFileSync(q, K)
            } catch (A) {
                var O = A,
                    w = 1
            } finally {
                oz(Y, O, w)
            }
        },
        copyFileSync(q, K) {
            let z = [];
            try {
                const _ = rz(z, Jw`fs.copyFileSync(${q} → ${K})`, 0);
                W9.copyFileSync(q, K)
            } catch (Y) {
                var A = Y,
                    O = 1
            } finally {
                oz(z, A, O)
            }
        },
        unlinkSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.unlinkSync(${q})`, 0);
                W9.unlinkSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        renameSync(q, K) {
            let z = [];
            try {
                const _ = rz(z, Jw`fs.renameSync(${q} → ${K})`, 0);
                W9.renameSync(q, K)
            } catch (Y) {
                var A = Y,
                    O = 1
            } finally {
                oz(z, A, O)
            }
        },
        linkSync(q, K) {
            let z = [];
            try {
                const _ = rz(z, Jw`fs.linkSync(${q} → ${K})`, 0);
                W9.linkSync(q, K)
            } catch (Y) {
                var A = Y,
                    O = 1
            } finally {
                oz(z, A, O)
            }
        },
        symlinkSync(q, K, _) {
            let Y = [];
            try {
                const z = rz(Y, Jw`fs.symlinkSync(${q} → ${K})`, 0);
                W9.symlinkSync(q, K, _)
            } catch (A) {
                var O = A,
                    w = 1
            } finally {
                oz(Y, O, w)
            }
        },
        readlinkSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.readlinkSync(${q})`, 0);
                return W9.readlinkSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        realpathSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.realpathSync(${q})`, 0);
                return W9.realpathSync(q).normalize("NFC")
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        mkdirSync(q, K) {
            let Y = [];
            try {
                const _ = rz(Y, Jw`fs.mkdirSync(${q})`, 0);
                let z = {
                    recursive: !0
                };
                if (K?.mode !== void 0) z.mode = K.mode;
                try {
                    W9.mkdirSync(q, z)
                } catch ($) {
                    if (Q1($) !== "EEXIST") throw $
                }
            } catch (A) {
                var O = A,
                    w = 1
            } finally {
                oz(Y, O, w)
            }
        },
        readdirSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.readdirSync(${q})`, 0);
                return W9.readdirSync(q, {
                    withFileTypes: !0
                })
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        readdirStringSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.readdirStringSync(${q})`, 0);
                return W9.readdirSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        isDirEmptySync(q) {
            let z = [];
            try {
                const K = rz(z, Jw`fs.isDirEmptySync(${q})`, 0);
                let _ = this.readdirSync(q);
                return _.length === 0
            } catch (Y) {
                var A = Y,
                    O = 1
            } finally {
                oz(z, A, O)
            }
        },
        rmdirSync(q) {
            let _ = [];
            try {
                const K = rz(_, Jw`fs.rmdirSync(${q})`, 0);
                W9.rmdirSync(q)
            } catch (z) {
                var Y = z,
                    A = 1
            } finally {
                oz(_, Y, A)
            }
        },
        rmSync(q, K) {
            let z = [];
            try {
                const _ = rz(z, Jw`fs.rmSync(${q})`, 0);
                W9.rmSync(q, K)
            } catch (Y) {
                var A = Y,
                    O = 1
            } finally {
                oz(z, A, O)
            }
        },
        createWriteStream(q) {
            return W9.createWriteStream(q)
        },
        async readFileBytes(q, K) {
            if (K === void 0) return sv7(q);
            let _ = await iw8(q, "r");
            try {
                let {
                    size: z
                } = await _.stat(), Y = Math.min(z, K), A = Buffer.allocUnsafe(Y), O = 0;
                while (O < Y) {
                    let {
                        bytesRead: w
                    } = await _.read(A, O, Y - O, O);
                    if (w === 0) break;
                    O += w
                }
                return O < Y ? A.subarray(0, O) : A
            } finally {
                await _.close()
            }
        }
    }, Nv5 = kv5
})
// @from(Ln 8189, Col 4)
M71 = {}
// @from(Ln 8198, Col 0)
function ev7(q) {
    return (K) => {
        if (K.code === "EPIPE") q.destroy()
    }
}
// @from(Ln 8204, Col 0)
function J71() {
    process.stdout.on("error", ev7(process.stdout)), process.stderr.on("error", ev7(process.stderr))
}
// @from(Ln 8208, Col 0)
function qT7(q, K) {
    if (q.destroyed) return;
    q.write(K)
}
// @from(Ln 8213, Col 0)
function f4(q) {
    qT7(process.stdout, q)
}
// @from(Ln 8217, Col 0)
function tD6(q) {
    qT7(process.stderr, q)
}
// @from(Ln 8221, Col 0)
function Ev5(q) {
    console.error(q), process.exit(1)
}
// @from(Ln 8225, Col 0)
function X71(q, K) {
    return new Promise((_) => {
        let z = (w) => {
                clearTimeout(O), q.off("end", Y), q.off("data", A), _(w)
            },
            Y = () => z(!1),
            A = () => clearTimeout(O),
            O = setTimeout(z, K, !0);
        q.once("end", Y), q.once("data", A)
    })
}
// @from(Ln 8247, Col 0)
function sw8() {
    return typeof process < "u" && Array.isArray(process.argv) ? process.argv : []
}
// @from(Ln 8251, Col 0)
function YT7() {
    let q = MV() || !1;
    return zT7 = !0, MV.cache.clear?.(), q
}
// @from(Ln 8256, Col 0)
function Cv5(q) {
    if (!MV()) return !1;
    if (typeof process > "u" || typeof process.versions > "u" || typeof process.versions.node > "u") return !1;
    let K = Sv5();
    return tf7(q, K)
}
// @from(Ln 8263, Col 0)
function OT7(q) {
    f71 = q
}
// @from(Ln 8267, Col 0)
function wT7() {
    return f71
}
// @from(Ln 8271, Col 0)
function $T7(q) {
    return D71 = Z71(q, `${I8()}.txt`), D71
}
// @from(Ln 8274, Col 0)
async function bv5(q, K, _, z) {
    if (q) await yv5(K, {
        recursive: !0
    }).catch(() => {});
    try {
        await KT7(_, z)
    } catch (Y) {
        if (!_71(Y)) throw Y;
        await KT7($T7(_), z)
    }
    jT7()
}
// @from(Ln 8287, Col 0)
function Iv5() {}
// @from(Ln 8289, Col 0)
function xv5() {
    if (!aw8) {
        let q = null;
        aw8 = bD6({
            writeFn: (K) => {
                let _ = yY6(),
                    z = _T7(_),
                    Y = q !== z;
                if (q = z, MV()) {
                    if (Y) try {
                        V8().mkdirSync(z)
                    } catch {}
                    try {
                        V8().appendFileSync(_, K)
                    } catch (A) {
                        if (!_71(A)) throw A;
                        V8().appendFileSync($T7(_), K)
                    }
                    jT7();
                    return
                }
                P71 = P71.then(bv5.bind(null, Y, z, _, K)).catch(Iv5)
            },
            flushIntervalMs: 1000,
            maxBufferSize: 100,
            immediateMode: MV()
        }), eq(async () => {
            aw8?.dispose(), await P71
        })
    }
    return aw8
}
// @from(Ln 8322, Col 0)
function E(q, {
    level: K
} = {
    level: "debug"
}) {
    if (W71[K] < W71[Rv5()]) return;
    if (!Cv5(q)) return;
    if (f71 && q.includes(`
`)) q = I6(q);
    let z = `${new Date().toISOString()} [${K.toUpperCase()}] ${q.trim()}
`;
    if (SC()) {
        tD6(z);
        return
    }
    xv5().write(z)
}
// @from(Ln 8340, Col 0)
function yY6() {
    return AT7() ?? D71 ?? process.env.CLAUDE_CODE_DEBUG_LOGS_DIR ?? Z71(A7(), "debug", `${I8()}.txt`)
}
// @from(Ln 8344, Col 0)
function Kh(q, K) {
    return
}
// @from(Ln 8347, Col 4)
W71
// @from(Ln 8347, Col 9)
Rv5
// @from(Ln 8347, Col 14)
zT7 = !1
// @from(Ln 8348, Col 4)
MV
// @from(Ln 8348, Col 8)
Sv5
// @from(Ln 8348, Col 13)
SC
// @from(Ln 8348, Col 17)
AT7
// @from(Ln 8348, Col 22)
f71 = !1
// @from(Ln 8349, Col 4)
aw8 = null
// @from(Ln 8350, Col 4)
P71
// @from(Ln 8350, Col 9)
D71 = null
// @from(Ln 8351, Col 4)
jT7
// @from(Ln 8352, Col 4)
K8 = L(() => {
    U4();
    y8();
    R9();
    ef7();
    Q8();
    m8();
    Yq();
    e8();
    W71 = {
        verbose: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4
    }, Rv5 = P1(() => {
        let q = process.env.CLAUDE_CODE_DEBUG_LOG_LEVEL?.toLowerCase().trim();
        if (q && Object.hasOwn(W71, q)) return q;
        return "debug"
    });
    MV = P1(() => {
        let q = sw8();
        return zT7 || S6(process.env.DEBUG) || S6(process.env.DEBUG_SDK) || q.includes("--debug") || q.includes("-d") || SC() || q.some((K) => K.startsWith("--debug=")) || AT7() !== null
    });
    Sv5 = P1(() => {
        let q = sw8().find((_) => _.startsWith("--debug="));
        if (!q) return null;
        let K = q.substring(8);
        return sf7(K)
    }), SC = P1(() => {
        let q = sw8();
        return q.includes("--debug-to-stderr") || q.includes("-d2e")
    }), AT7 = P1(() => {
        let q = sw8();
        for (let K = 0; K < q.length; K++) {
            let _ = q[K];
            if (_.startsWith("--debug-file=")) return _.substring(13);
            if (_ === "--debug-file" && K + 1 < q.length) return q[K + 1]
        }
        return null
    });
    P71 = Promise.resolve();
    jT7 = P1(async () => {
        try {
            let q = yY6(),
                K = _T7(q),
                _ = Z71(K, "latest");
            await hv5(_).catch(() => {}), await Lv5(q, _)
        } catch {}
    })
})
// @from(Ln 8404, Col 0)
function rH() {
    if (!G71) G71 = new Intl.Segmenter(void 0, {
        granularity: "grapheme"
    });
    return G71
}
// @from(Ln 8411, Col 0)
function KF6(q) {
    if (!q) return "";
    return rH().segment(q)[Symbol.iterator]().next().value?.segment ?? ""
}
// @from(Ln 8416, Col 0)
function ci(q) {
    if (!q) return "";
    let K = "";
    for (let {
            segment: _
        }
        of rH().segment(q)) K = _;
    return K
}
// @from(Ln 8426, Col 0)
function MT7() {
    if (!v71) v71 = new Intl.Segmenter(void 0, {
        granularity: "word"
    });
    return v71
}
// @from(Ln 8433, Col 0)
function V71(q, K) {
    let _ = `${q}:${K}`,
        z = HT7.get(_);
    if (!z) z = new Intl.RelativeTimeFormat("en", {
        style: q,
        numeric: K
    }), HT7.set(_, z);
    return z
}
// @from(Ln 8443, Col 0)
function _F6() {
    if (!T71) T71 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return T71
}
// @from(Ln 8448, Col 0)
function PT7() {
    if (tw8 === null) try {
        let q = Intl.DateTimeFormat().resolvedOptions().locale;
        tw8 = new Intl.Locale(q).language
    } catch {
        tw8 = void 0
    }
    return tw8
}
// @from(Ln 8458, Col 0)
function uv5(q) {
    if (!q) return "";
    let K = JT7.get(q);
    if (K !== void 0) return K;
    let _ = Object.entries(q).sort(([Y], [A]) => Y < A ? -1 : Y > A ? 1 : 0),
        z = "";
    for (let [Y, A] of _) z += `${Y}=${String(A)};`;
    return JT7.set(q, z), z
}
// @from(Ln 8468, Col 0)
function ew8(q, K) {
    let _ = `${q??""}|${uv5(K)}`,
        z = XT7.get(_);
    if (!z) z = new Intl.DateTimeFormat(q, K), XT7.set(_, z);
    return z
}
// @from(Ln 8474, Col 4)
G71 = null
// @from(Ln 8475, Col 4)
v71 = null
// @from(Ln 8476, Col 4)
HT7
// @from(Ln 8476, Col 9)
T71 = null
// @from(Ln 8477, Col 4)
tw8 = null
// @from(Ln 8478, Col 4)
JT7
// @from(Ln 8478, Col 9)
XT7
// @from(Ln 8479, Col 4)
IZ = L(() => {
    HT7 = new Map;
    JT7 = new WeakMap;
    XT7 = new Map
})
// @from(Ln 8484, Col 4)
k71 = p((TEA, WT7) => {
    WT7.exports = function() {
        return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g
    }
})
// @from(Ln 8490, Col 0)
function DT7(q) {
    return q === 161 || q === 164 || q === 167 || q === 168 || q === 170 || q === 173 || q === 174 || q >= 176 && q <= 180 || q >= 182 && q <= 186 || q >= 188 && q <= 191 || q === 198 || q === 208 || q === 215 || q === 216 || q >= 222 && q <= 225 || q === 230 || q >= 232 && q <= 234 || q === 236 || q === 237 || q === 240 || q === 242 || q === 243 || q >= 247 && q <= 250 || q === 252 || q === 254 || q === 257 || q === 273 || q === 275 || q === 283 || q === 294 || q === 295 || q === 299 || q >= 305 && q <= 307 || q === 312 || q >= 319 && q <= 322 || q === 324 || q >= 328 && q <= 331 || q === 333 || q === 338 || q === 339 || q === 358 || q === 359 || q === 363 || q === 462 || q === 464 || q === 466 || q === 468 || q === 470 || q === 472 || q === 474 || q === 476 || q === 593 || q === 609 || q === 708 || q === 711 || q >= 713 && q <= 715 || q === 717 || q === 720 || q >= 728 && q <= 731 || q === 733 || q === 735 || q >= 768 && q <= 879 || q >= 913 && q <= 929 || q >= 931 && q <= 937 || q >= 945 && q <= 961 || q >= 963 && q <= 969 || q === 1025 || q >= 1040 && q <= 1103 || q === 1105 || q === 8208 || q >= 8211 && q <= 8214 || q === 8216 || q === 8217 || q === 8220 || q === 8221 || q >= 8224 && q <= 8226 || q >= 8228 && q <= 8231 || q === 8240 || q === 8242 || q === 8243 || q === 8245 || q === 8251 || q === 8254 || q === 8308 || q === 8319 || q >= 8321 && q <= 8324 || q === 8364 || q === 8451 || q === 8453 || q === 8457 || q === 8467 || q === 8470 || q === 8481 || q === 8482 || q === 8486 || q === 8491 || q === 8531 || q === 8532 || q >= 8539 && q <= 8542 || q >= 8544 && q <= 8555 || q >= 8560 && q <= 8569 || q === 8585 || q >= 8592 && q <= 8601 || q === 8632 || q === 8633 || q === 8658 || q === 8660 || q === 8679 || q === 8704 || q === 8706 || q === 8707 || q === 8711 || q === 8712 || q === 8715 || q === 8719 || q === 8721 || q === 8725 || q === 8730 || q >= 8733 && q <= 8736 || q === 8739 || q === 8741 || q >= 8743 && q <= 8748 || q === 8750 || q >= 8756 && q <= 8759 || q === 8764 || q === 8765 || q === 8776 || q === 8780 || q === 8786 || q === 8800 || q === 8801 || q >= 8804 && q <= 8807 || q === 8810 || q === 8811 || q === 8814 || q === 8815 || q === 8834 || q === 8835 || q === 8838 || q === 8839 || q === 8853 || q === 8857 || q === 8869 || q === 8895 || q === 8978 || q >= 9312 && q <= 9449 || q >= 9451 && q <= 9547 || q >= 9552 && q <= 9587 || q >= 9600 && q <= 9615 || q >= 9618 && q <= 9621 || q === 9632 || q === 9633 || q >= 9635 && q <= 9641 || q === 9650 || q === 9651 || q === 9654 || q === 9655 || q === 9660 || q === 9661 || q === 9664 || q === 9665 || q >= 9670 && q <= 9672 || q === 9675 || q >= 9678 && q <= 9681 || q >= 9698 && q <= 9701 || q === 9711 || q === 9733 || q === 9734 || q === 9737 || q === 9742 || q === 9743 || q === 9756 || q === 9758 || q === 9792 || q === 9794 || q === 9824 || q === 9825 || q >= 9827 && q <= 9829 || q >= 9831 && q <= 9834 || q === 9836 || q === 9837 || q === 9839 || q === 9886 || q === 9887 || q === 9919 || q >= 9926 && q <= 9933 || q >= 9935 && q <= 9939 || q >= 9941 && q <= 9953 || q === 9955 || q === 9960 || q === 9961 || q >= 9963 && q <= 9969 || q === 9972 || q >= 9974 && q <= 9977 || q === 9979 || q === 9980 || q === 9982 || q === 9983 || q === 10045 || q >= 10102 && q <= 10111 || q >= 11094 && q <= 11097 || q >= 12872 && q <= 12879 || q >= 57344 && q <= 63743 || q >= 65024 && q <= 65039 || q === 65533 || q >= 127232 && q <= 127242 || q >= 127248 && q <= 127277 || q >= 127280 && q <= 127337 || q >= 127344 && q <= 127373 || q === 127375 || q === 127376 || q >= 127387 && q <= 127404 || q >= 917760 && q <= 917999 || q >= 983040 && q <= 1048573 || q >= 1048576 && q <= 1114109
}
// @from(Ln 8494, Col 0)
function zF6(q) {
    return q === 12288 || q >= 65281 && q <= 65376 || q >= 65504 && q <= 65510
}
// @from(Ln 8498, Col 0)
function YF6(q) {
    return q >= 4352 && q <= 4447 || q === 8986 || q === 8987 || q === 9001 || q === 9002 || q >= 9193 && q <= 9196 || q === 9200 || q === 9203 || q === 9725 || q === 9726 || q === 9748 || q === 9749 || q >= 9776 && q <= 9783 || q >= 9800 && q <= 9811 || q === 9855 || q >= 9866 && q <= 9871 || q === 9875 || q === 9889 || q === 9898 || q === 9899 || q === 9917 || q === 9918 || q === 9924 || q === 9925 || q === 9934 || q === 9940 || q === 9962 || q === 9970 || q === 9971 || q === 9973 || q === 9978 || q === 9981 || q === 9989 || q === 9994 || q === 9995 || q === 10024 || q === 10060 || q === 10062 || q >= 10067 && q <= 10069 || q === 10071 || q >= 10133 && q <= 10135 || q === 10160 || q === 10175 || q === 11035 || q === 11036 || q === 11088 || q === 11093 || q >= 11904 && q <= 11929 || q >= 11931 && q <= 12019 || q >= 12032 && q <= 12245 || q >= 12272 && q <= 12287 || q >= 12289 && q <= 12350 || q >= 12353 && q <= 12438 || q >= 12441 && q <= 12543 || q >= 12549 && q <= 12591 || q >= 12593 && q <= 12686 || q >= 12688 && q <= 12773 || q >= 12783 && q <= 12830 || q >= 12832 && q <= 12871 || q >= 12880 && q <= 42124 || q >= 42128 && q <= 42182 || q >= 43360 && q <= 43388 || q >= 44032 && q <= 55203 || q >= 63744 && q <= 64255 || q >= 65040 && q <= 65049 || q >= 65072 && q <= 65106 || q >= 65108 && q <= 65126 || q >= 65128 && q <= 65131 || q >= 94176 && q <= 94180 || q >= 94192 && q <= 94198 || q >= 94208 && q <= 101589 || q >= 101631 && q <= 101662 || q >= 101760 && q <= 101874 || q >= 110576 && q <= 110579 || q >= 110581 && q <= 110587 || q === 110589 || q === 110590 || q >= 110592 && q <= 110882 || q === 110898 || q >= 110928 && q <= 110930 || q === 110933 || q >= 110948 && q <= 110951 || q >= 110960 && q <= 111355 || q >= 119552 && q <= 119638 || q >= 119648 && q <= 119670 || q === 126980 || q === 127183 || q === 127374 || q >= 127377 && q <= 127386 || q >= 127488 && q <= 127490 || q >= 127504 && q <= 127547 || q >= 127552 && q <= 127560 || q === 127568 || q === 127569 || q >= 127584 && q <= 127589 || q >= 127744 && q <= 127776 || q >= 127789 && q <= 127797 || q >= 127799 && q <= 127868 || q >= 127870 && q <= 127891 || q >= 127904 && q <= 127946 || q >= 127951 && q <= 127955 || q >= 127968 && q <= 127984 || q === 127988 || q >= 127992 && q <= 128062 || q === 128064 || q >= 128066 && q <= 128252 || q >= 128255 && q <= 128317 || q >= 128331 && q <= 128334 || q >= 128336 && q <= 128359 || q === 128378 || q === 128405 || q === 128406 || q === 128420 || q >= 128507 && q <= 128591 || q >= 128640 && q <= 128709 || q === 128716 || q >= 128720 && q <= 128722 || q >= 128725 && q <= 128728 || q >= 128732 && q <= 128735 || q === 128747 || q === 128748 || q >= 128756 && q <= 128764 || q >= 128992 && q <= 129003 || q === 129008 || q >= 129292 && q <= 129338 || q >= 129340 && q <= 129349 || q >= 129351 && q <= 129535 || q >= 129648 && q <= 129660 || q >= 129664 && q <= 129674 || q >= 129678 && q <= 129734 || q === 129736 || q >= 129741 && q <= 129756 || q >= 129759 && q <= 129770 || q >= 129775 && q <= 129784 || q >= 131072 && q <= 196605 || q >= 196608 && q <= 262141
}
// @from(Ln 8501, Col 4)
N71 = () => {}
// @from(Ln 8503, Col 0)
function mv5(q) {
    if (!Number.isSafeInteger(q)) throw TypeError(`Expected a code point, got \`${typeof q}\`.`)
}
// @from(Ln 8507, Col 0)
function AF6(q, {
    ambiguousAsWide: K = !1
} = {}) {
    if (mv5(q), zF6(q) || YF6(q) || K && DT7(q)) return 2;
    return 1
}
// @from(Ln 8513, Col 4)
q28 = L(() => {
    N71();
    N71()
})
// @from(Ln 8518, Col 0)
function E71({
    onlyFirst: q = !1
} = {}) {
    let _ = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
    return new RegExp(_, q ? void 0 : "g")
}
// @from(Ln 8525, Col 0)
function LY6(q) {
    if (typeof q !== "string") throw TypeError(`Expected a \`string\`, got \`${typeof q}\``);
    return q.replace(Bv5, "")
}
// @from(Ln 8529, Col 4)
Bv5
// @from(Ln 8530, Col 4)
K28 = L(() => {
    Bv5 = E71()
})
// @from(Ln 8533, Col 4)
pv5
// @from(Ln 8533, Col 9)
MO
// @from(Ln 8534, Col 4)
mN = L(() => {
    K28();
    pv5 = typeof Bun < "u" && typeof Bun.stripANSI === "function" ? Bun.stripANSI : null, MO = pv5 ?? LY6
})
// @from(Ln 8539, Col 0)
function Fv5(q) {
    if (typeof q !== "string" || q.length === 0) return 0;
    let K = !0;
    for (let z = 0; z < q.length; z++) {
        let Y = q.charCodeAt(z);
        if (Y >= 127 || Y === 27) {
            K = !1;
            break
        }
    }
    if (K) {
        let z = 0;
        for (let Y = 0; Y < q.length; Y++)
            if (q.charCodeAt(Y) > 31) z++;
        return z
    }
    if (q.includes("\x1B")) {
        if (q = MO(q), q.length === 0) return 0
    }
    if (!gv5(q)) {
        let z = 0;
        for (let Y of q) {
            let A = Y.codePointAt(0);
            if (!fT7(A)) z += AF6(A, {
                ambiguousAsWide: !1
            })
        }
        return z
    }
    let _ = 0;
    for (let {
            segment: z
        }
        of rH().segment(q)) {
        if (ZT7.lastIndex = 0, ZT7.test(z)) {
            _ += Uv5(z);
            continue
        }
        for (let Y of z) {
            let A = Y.codePointAt(0);
            if (!fT7(A)) {
                _ += AF6(A, {
                    ambiguousAsWide: !1
                });
                break
            }
        }
    }
    return _
}
// @from(Ln 8590, Col 0)
function gv5(q) {
    for (let K of q) {
        let _ = K.codePointAt(0);
        if (_ >= 127744 && _ <= 129791) return !0;
        if (_ >= 9728 && _ <= 10175) return !0;
        if (_ >= 127462 && _ <= 127487) return !0;
        if (_ >= 65024 && _ <= 65039) return !0;
        if (_ === 8205) return !0
    }
    return !1
}
// @from(Ln 8602, Col 0)
function Uv5(q) {
    let K = q.codePointAt(0);
    if (K >= 127462 && K <= 127487) {
        let _ = 0;
        for (let z of q) _++;
        return _ === 1 ? 1 : 2
    }
    if (q.length === 2) {
        if (q.codePointAt(1) === 65039 && (K >= 48 && K <= 57 || K === 35 || K === 42)) return 1
    }
    return 2
}
// @from(Ln 8615, Col 0)
function fT7(q) {
    if (q >= 32 && q < 127) return !1;
    if (q >= 160 && q < 768) return q === 173;
    if (q <= 31 || q >= 127 && q <= 159) return !0;
    if (q >= 8203 && q <= 8205 || q === 65279 || q >= 8288 && q <= 8292) return !0;
    if (q >= 65024 && q <= 65039 || q >= 917760 && q <= 917999) return !0;
    if (q >= 768 && q <= 879 || q >= 6832 && q <= 6911 || q >= 7616 && q <= 7679 || q >= 8400 && q <= 8447 || q >= 65056 && q <= 65071) return !0;
    if (q >= 2304 && q <= 3407) {
        let K = q & 127;
        if (K <= 3) return !0;
        if (K >= 58 && K <= 79) return !0;
        if (K >= 81 && K <= 87) return !0;
        if (K >= 98 && K <= 99) return !0
    }
    if (q === 3633 || q >= 3636 && q <= 3642 || q >= 3655 && q <= 3662 || q === 3761 || q >= 3764 && q <= 3772 || q >= 3784 && q <= 3789) return !0;
    if (q >= 1536 && q <= 1541 || q === 1757 || q === 1807 || q === 2274) return !0;
    if (q >= 55296 && q <= 57343) return !0;
    if (q >= 917504 && q <= 917631) return !0;
    return !1
}
// @from(Ln 8635, Col 4)
vT7
// @from(Ln 8635, Col 9)
ZT7
// @from(Ln 8635, Col 14)
GT7
// @from(Ln 8635, Col 19)
Qv5
// @from(Ln 8635, Col 24)
N1
// @from(Ln 8636, Col 4)
n5 = L(() => {
    q28();
    IZ();
    mN();
    vT7 = K6(k71(), 1), ZT7 = vT7.default();
    GT7 = typeof Bun < "u" && typeof Bun.stringWidth === "function" ? Bun.stringWidth : null, Qv5 = {
        ambiguousIsNarrow: !0
    }, N1 = GT7 ? (q) => GT7(q, Qv5) : Fv5
})
// @from(Ln 8646, Col 0)
function OF6(q, K) {
    if (N1(q) <= K) return q;
    if (K <= 0) return "…";
    if (K < 5) return j4(q, K);
    let _ = q.lastIndexOf("/"),
        z = _ >= 0 ? q.slice(_) : q,
        Y = _ >= 0 ? q.slice(0, _) : "",
        A = N1(z);
    if (A >= K - 1) return hY6(q, K);
    let O = K - 1 - A;
    if (O <= 0) return hY6(z, K);
    return RY6(Y, O) + "…" + z
}
// @from(Ln 8660, Col 0)
function j4(q, K) {
    if (N1(q) <= K) return q;
    if (K <= 1) return "…";
    let _ = 0,
        z = "";
    for (let {
            segment: Y
        }
        of rH().segment(q)) {
        let A = N1(Y);
        if (_ + A > K - 1) break;
        z += Y, _ += A
    }
    return z + "…"
}
// @from(Ln 8676, Col 0)
function hY6(q, K) {
    if (N1(q) <= K) return q;
    if (K <= 1) return "…";
    let _ = [...rH().segment(q)],
        z = 0,
        Y = _.length;
    for (let A = _.length - 1; A >= 0; A--) {
        let O = N1(_[A].segment);
        if (z + O > K - 1) break;
        z += O, Y = A
    }
    return "…" + _.slice(Y).map((A) => A.segment).join("")
}
// @from(Ln 8690, Col 0)
function RY6(q, K) {
    if (N1(q) <= K) return q;
    if (K <= 0) return "";
    let _ = 0,
        z = "";
    for (let {
            segment: Y
        }
        of rH().segment(q)) {
        let A = N1(Y);
        if (_ + A > K) break;
        z += Y, _ += A
    }
    return z
}
// @from(Ln 8706, Col 0)
function w5(q, K, _ = !1) {
    let z = q;
    if (_) {
        let Y = q.indexOf(`
`);
        if (Y !== -1) {
            if (z = q.substring(0, Y), N1(z) + 1 > K) return j4(z, K);
            return `${z}…`
        }
    }
    if (N1(z) <= K) return z;
    return j4(z, K)
}
// @from(Ln 8719, Col 4)
U86 = L(() => {
    n5();
    IZ()
})
// @from(Ln 8724, Col 0)
function o4(q) {
    let K = q / 1024;
    if (K < 1) return `${q} bytes`;
    if (K < 1024) return `${K.toFixed(1).replace(/\.0$/,"")}KB`;
    let _ = K / 1024;
    if (_ < 1024) return `${_.toFixed(1).replace(/\.0$/,"")}MB`;
    return `${(_/1024).toFixed(1).replace(/\.0$/,"")}GB`
}
// @from(Ln 8733, Col 0)
function z28(q) {
    return `${(q/1000).toFixed(1)}s`
}
// @from(Ln 8737, Col 0)
function C5(q, K) {
    if (q < 60000) {
        if (q === 0) return "0s";
        if (q < 1) return `${(q/1000).toFixed(1)}s`;
        return `${Math.floor(q/1000).toString()}s`
    }
    let _ = Math.floor(q / 86400000),
        z = Math.floor(q % 86400000 / 3600000),
        Y = Math.floor(q % 3600000 / 60000),
        A = Math.round(q % 60000 / 1000);
    if (A === 60) A = 0, Y++;
    if (Y === 60) Y = 0, z++;
    if (z === 24) z = 0, _++;
    let O = K?.hideTrailingZeros;
    if (K?.mostSignificantOnly) {
        if (_ > 0) return `${_}d`;
        if (z > 0) return `${z}h`;
        if (Y > 0) return `${Y}m`;
        return `${A}s`
    }
    if (_ > 0) {
        if (O && z === 0 && Y === 0) return `${_}d`;
        if (O && Y === 0) return `${_}d ${z}h`;
        return `${_}d ${z}h ${Y}m`
    }
    if (z > 0) {
        if (O && Y === 0 && A === 0) return `${z}h`;
        if (O && A === 0) return `${z}h ${Y}m`;
        return `${z}h ${Y}m ${A}s`
    }
    if (Y > 0) {
        if (O && A === 0) return `${Y}m`;
        return `${Y}m ${A}s`
    }
    return `${A}s`
}
// @from(Ln 8774, Col 0)
function iK(q) {
    let K = q >= 1000;
    return dv5(K).format(q).toLowerCase()
}
// @from(Ln 8779, Col 0)
function h3(q) {
    return iK(q).replace(".0", "")
}
// @from(Ln 8783, Col 0)
function _28(q, K = {}) {
    let {
        style: _ = "narrow",
        numeric: z = "always",
        now: Y = new Date
    } = K, A = q.getTime() - Y.getTime(), O = Math.trunc(A / 1000), w = [{
        unit: "year",
        seconds: 31536000,
        shortUnit: "y"
    }, {
        unit: "month",
        seconds: 2592000,
        shortUnit: "mo"
    }, {
        unit: "week",
        seconds: 604800,
        shortUnit: "w"
    }, {
        unit: "day",
        seconds: 86400,
        shortUnit: "d"
    }, {
        unit: "hour",
        seconds: 3600,
        shortUnit: "h"
    }, {
        unit: "minute",
        seconds: 60,
        shortUnit: "m"
    }, {
        unit: "second",
        seconds: 1,
        shortUnit: "s"
    }];
    for (let {
            unit: $,
            seconds: j,
            shortUnit: H
        }
        of w)
        if (Math.abs(O) >= j) {
            let J = Math.trunc(O / j);
            if (_ === "narrow") return O < 0 ? `${Math.abs(J)}${H} ago` : `in ${J}${H}`;
            return V71("long", z).format(J, $)
        } if (_ === "narrow") return O <= 0 ? "0s ago" : "in 0s";
    return V71(_, z).format(0, "second")
}
// @from(Ln 8831, Col 0)
function CC(q, K = {}) {
    let {
        now: _ = new Date,
        ...z
    } = K;
    if (q > _) return _28(q, {
        ...z,
        now: _
    });
    return _28(q, {
        ...z,
        numeric: "always",
        now: _
    })
}
// @from(Ln 8847, Col 0)
function wF6(q) {
    let K = q.fileSize !== void 0 ? o4(q.fileSize) : `${q.messageCount} messages`,
        _ = [CC(q.modified, {
            style: "short"
        }), ...q.gitBranch ? [q.gitBranch] : [], K];
    if (q.tag) _.push(`#${q.tag}`);
    if (q.agentSetting) _.push(`@${q.agentSetting}`);
    if (q.prNumber) _.push(q.prRepository ? `${q.prRepository}#${q.prNumber}` : `#${q.prNumber}`);
    return _.join(" · ")
}
// @from(Ln 8858, Col 0)
function Q86(q, K = !1, _ = !0) {
    if (!q) return;
    let z = new Date(q * 1000),
        Y = new Date,
        A = z.getMinutes();
    if ((z.getTime() - Y.getTime()) / 3600000 > 24) {
        let $ = {
            month: "short",
            day: "numeric",
            hour: _ ? "numeric" : void 0,
            minute: !_ || A === 0 ? void 0 : "2-digit",
            hour12: _ ? !0 : void 0
        };
        if (z.getFullYear() !== Y.getFullYear()) $.year = "numeric";
        return z.toLocaleString("en-US", $).replace(/ ([AP]M)/i, (H, J) => J.toLowerCase()) + (K ? ` (${_F6()})` : "")
    }
    return z.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: A === 0 ? void 0 : "2-digit",
        hour12: !0
    }).replace(/ ([AP]M)/i, ($, j) => j.toLowerCase()) + (K ? ` (${_F6()})` : "")
}
// @from(Ln 8881, Col 0)
function TT7(q, K = !1, _ = !0) {
    let z = new Date(q);
    return `${Q86(Math.floor(z.getTime()/1000),K,_)}`
}
// @from(Ln 8885, Col 4)
y71 = null
// @from(Ln 8886, Col 4)
L71 = null
// @from(Ln 8887, Col 4)
dv5 = (q) => {
        if (q) {
            if (!y71) y71 = new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
                minimumFractionDigits: 1
            });
            return y71
        } else {
            if (!L71) L71 = new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
                minimumFractionDigits: 0
            });
            return L71
        }
    }
// @from(Ln 8904, Col 4)
c7 = L(() => {
    IZ();
    U86()
})
// @from(Ln 8909, Col 0)
function _h() {
    if (!h71) h71 = d6("perf_hooks").performance;
    return h71
}
// @from(Ln 8914, Col 0)
function Am(q) {
    return q.toFixed(3)
}
// @from(Ln 8918, Col 0)
function Y28(q, K, _, z, Y, A, O = "") {
    let w = z ? ` | RSS: ${o4(z.rss)}, Heap: ${o4(z.heapUsed)}` : "";
    return `[+${Am(q).padStart(Y)}ms] (+${Am(K).padStart(A)}ms) ${_}${O}${w}`
}
// @from(Ln 8922, Col 4)
h71 = null
// @from(Ln 8923, Col 4)
A28 = L(() => {
    c7()
})
// @from(Ln 8926, Col 4)
RT7 = {}
// @from(Ln 8939, Col 0)
function XK(q) {
    if (!ET7) return;
    if (_h().mark(q), $F6) yT7.push(process.memoryUsage())
}
// @from(Ln 8944, Col 0)
function VT7() {
    if (!$F6) return "Startup profiling not enabled";
    let K = _h().getEntriesByType("mark");
    if (K.length === 0) return "No profiling checkpoints recorded";
    let _ = [];
    _.push("=".repeat(80)), _.push("STARTUP PROFILING REPORT"), _.push("=".repeat(80)), _.push("");
    let z = 0;
    for (let [A, O] of K.entries()) _.push(Y28(O.startTime, O.startTime - z, O.name, yT7[A], 8, 7)), z = O.startTime;
    let Y = K[K.length - 1];
    return _.push(""), _.push(`Total startup time: ${Am(Y?.startTime??0)}ms`), _.push("=".repeat(80)), _.join(`
`)
}
// @from(Ln 8957, Col 0)
function jF6() {
    if (kT7) return;
    if (kT7 = !0, hT7(), $F6) {
        let q = LT7(),
            K = cv5(q);
        V8().mkdirSync(K), aJ(q, VT7(), {
            encoding: "utf8",
            flush: !0
        }), E("Startup profiling report:"), E(VT7())
    }
}
// @from(Ln 8969, Col 0)
function rv5() {
    return $F6
}
// @from(Ln 8973, Col 0)
function LT7() {
    return lv5(A7(), "startup-perf", `${I8()}.txt`)
}
// @from(Ln 8977, Col 0)
function hT7() {
    if (!NT7) return;
    let K = _h().getEntriesByType("mark");
    if (K.length === 0) return;
    let _ = new Map;
    for (let Y of K) _.set(Y.name, Y.startTime);
    let z = {};
    for (let [Y, [A, O]] of Object.entries(iv5)) {
        let w = _.get(A),
            $ = _.get(O);
        if (w !== void 0 && $ !== void 0) z[`${Y}_ms`] = Math.round($ - w)
    }
    z.checkpoint_count = K.length, d("tengu_startup_perf", z)
}
// @from(Ln 8991, Col 4)
$F6
// @from(Ln 8991, Col 9)
nv5 = 0.005
// @from(Ln 8992, Col 4)
NT7
// @from(Ln 8992, Col 9)
ET7
// @from(Ln 8992, Col 14)
yT7
// @from(Ln 8992, Col 19)
iv5
// @from(Ln 8992, Col 24)
kT7 = !1
// @from(Ln 8993, Col 4)
ag = L(() => {
    y8();
    C8();
    K8();
    Q8();
    Yq();
    A28();
    e8();
    $F6 = S6(process.env.CLAUDE_CODE_PROFILE_STARTUP), NT7 = Math.random() < nv5, ET7 = $F6 || NT7, yT7 = [], iv5 = {
        import_time: ["cli_entry", "main_tsx_imports_loaded"],
        init_time: ["init_function_start", "init_function_end"],
        settings_time: ["eagerLoadSettings_start", "eagerLoadSettings_end"],
        total_time: ["cli_entry", "main_after_run"]
    };
    if (ET7) XK("profiler_initialized")
})
// @from(Ln 9009, Col 4)
li = p((eEA, bT7) => {
    var ST7 = ["nodebuffer", "arraybuffer", "fragments"],
        CT7 = typeof Blob < "u";
    if (CT7) ST7.push("blob");
    bT7.exports = {
        BINARY_TYPES: ST7,
        EMPTY_BUFFER: Buffer.alloc(0),
        GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        hasBlob: CT7,
        kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
        kListener: Symbol("kListener"),
        kStatusCode: Symbol("status-code"),
        kWebSocket: Symbol("websocket"),
        NOOP: () => {}
    }
})
// @from(Ln 9025, Col 4)
HF6 = p((qyA, O28) => {
    var {
        EMPTY_BUFFER: ov5
    } = li(), R71 = Buffer[Symbol.species];

    function av5(q, K) {
        if (q.length === 0) return ov5;
        if (q.length === 1) return q[0];
        let _ = Buffer.allocUnsafe(K),
            z = 0;
        for (let Y = 0; Y < q.length; Y++) {
            let A = q[Y];
            _.set(A, z), z += A.length
        }
        if (z < K) return new R71(_.buffer, _.byteOffset, z);
        return _
    }

    function IT7(q, K, _, z, Y) {
        for (let A = 0; A < Y; A++) _[z + A] = q[A] ^ K[A & 3]
    }

    function xT7(q, K) {
        for (let _ = 0; _ < q.length; _++) q[_] ^= K[_ & 3]
    }

    function sv5(q) {
        if (q.length === q.buffer.byteLength) return q.buffer;
        return q.buffer.slice(q.byteOffset, q.byteOffset + q.length)
    }

    function S71(q) {
        if (S71.readOnly = !0, Buffer.isBuffer(q)) return q;
        let K;
        if (q instanceof ArrayBuffer) K = new R71(q);
        else if (ArrayBuffer.isView(q)) K = new R71(q.buffer, q.byteOffset, q.byteLength);
        else K = Buffer.from(q), S71.readOnly = !1;
        return K
    }
    O28.exports = {
        concat: av5,
        mask: IT7,
        toArrayBuffer: sv5,
        toBuffer: S71,
        unmask: xT7
    };
    if (!process.env.WS_NO_BUFFER_UTIL) try {
        let q = (() => {
            throw new Error("Cannot require module " + "bufferutil");
        })();
        O28.exports.mask = function(K, _, z, Y, A) {
            if (A < 48) IT7(K, _, z, Y, A);
            else q.mask(K, _, z, Y, A)
        }, O28.exports.unmask = function(K, _) {
            if (K.length < 32) xT7(K, _);
            else q.unmask(K, _)
        }
    } catch (q) {}
})
// @from(Ln 9084, Col 4)
pT7 = p((KyA, BT7) => {
    var uT7 = Symbol("kDone"),
        C71 = Symbol("kRun");
    class mT7 {
        constructor(q) {
            this[uT7] = () => {
                this.pending--, this[C71]()
            }, this.concurrency = q || 1 / 0, this.jobs = [], this.pending = 0
        }
        add(q) {
            this.jobs.push(q), this[C71]()
        } [C71]() {
            if (this.pending === this.concurrency) return;
            if (this.jobs.length) {
                let q = this.jobs.shift();
                this.pending++, q(this[uT7])
            }
        }
    }
    BT7.exports = mT7
})