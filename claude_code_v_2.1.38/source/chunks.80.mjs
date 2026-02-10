
// @from(Ln 215395, Col 0)
function kX9(A, q, K, Y) {
    let {
        client_id: z,
        client_secret: w
    } = q;
    switch (A) {
        case "client_secret_basic":
            LX9(z, w, K);
            return;
        case "client_secret_post":
            RX9(z, w, Y);
            return;
        case "none":
            yX9(z, Y);
            return;
        default:
            throw Error(`Unsupported client authentication method: ${A}`)
    }
}
// @from(Ln 215415, Col 0)
function LX9(A, q, K) {
    if (!q) throw Error("client_secret_basic authentication requires a client_secret");
    let Y = btoa(`${A}:${q}`);
    K.set("Authorization", `Basic ${Y}`)
}
// @from(Ln 215421, Col 0)
function RX9(A, q, K) {
    if (K.set("client_id", A), q) K.set("client_secret", q)
}
// @from(Ln 215425, Col 0)
function yX9(A, q) {
    q.set("client_id", A)
}
// @from(Ln 215428, Col 0)
async function Ox7(A) {
    let q = A instanceof Response ? A.status : void 0,
        K = A instanceof Response ? await A.text() : A;
    try {
        let Y = A$6.parse(JSON.parse(K)),
            {
                error: z,
                error_description: w,
                error_uri: H
            } = Y;
        return new(Hx7[z] || TB)(w || "", H)
    } catch (Y) {
        let z = `${q?`HTTP ${q}: `:""}Invalid OAuth error response: ${Y}. Raw body: ${K}`;
        return new TB(z)
    }
}
// @from(Ln 215444, Col 0)
async function AR(A, q) {
    var K, Y;
    try {
        return await aJA(A, q)
    } catch (z) {
        if (z instanceof x01 || z instanceof b01) return await ((K = A.invalidateCredentials) === null || K === void 0 ? void 0 : K.call(A, "all")), await aJA(A, q);
        else if (z instanceof Ha) return await ((Y = A.invalidateCredentials) === null || Y === void 0 ? void 0 : Y.call(A, "tokens")), await aJA(A, q);
        throw z
    }
}
// @from(Ln 215454, Col 0)
async function aJA(A, {
    serverUrl: q,
    authorizationCode: K,
    scope: Y,
    resourceMetadataUrl: z,
    fetchFn: w
}) {
    var H, $;
    let O, _;
    try {
        if (O = await hX9(q, {
                resourceMetadataUrl: z
            }, w), O.authorization_servers && O.authorization_servers.length > 0) _ = O.authorization_servers[0]
    } catch (f) {}
    if (!_) _ = new URL("/", q);
    let J = await SX9(q, A, O),
        X = await Bb1(_, {
            fetchFn: w
        }),
        D = await Promise.resolve(A.clientInformation());
    if (!D) {
        if (K !== void 0) throw Error("Existing OAuth client information is required when exchanging an authorization code");
        let f = (X === null || X === void 0 ? void 0 : X.client_id_metadata_document_supported) === !0,
            Z = A.clientMetadataUrl;
        if (Z && !CX9(Z)) throw new m01(`clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${Z}`);
        if (f && Z) D = {
            client_id: Z
        }, await ((H = A.saveClientInformation) === null || H === void 0 ? void 0 : H.call(A, D));
        else {
            if (!A.saveClientInformation) throw Error("OAuth client information must be saveable for dynamic registration");
            let T = await QX9(_, {
                metadata: X,
                clientMetadata: A.clientMetadata,
                fetchFn: w
            });
            await A.saveClientInformation(T), D = T
        }
    }
    let j = !A.redirectUrl;
    if (K !== void 0 || j) {
        let f = await FX9(A, _, {
            metadata: X,
            resource: J,
            authorizationCode: K,
            fetchFn: w
        });
        return await A.saveTokens(f), "AUTHORIZED"
    }
    let M = await A.tokens();
    if (M === null || M === void 0 ? void 0 : M.refresh_token) try {
        let f = await eJA(_, {
            metadata: X,
            clientInformation: D,
            refreshToken: M.refresh_token,
            resource: J,
            addClientAuthentication: A.addClientAuthentication,
            fetchFn: w
        });
        return await A.saveTokens(f), "AUTHORIZED"
    } catch (f) {
        if (!(f instanceof xX) || f instanceof TB);
        else throw f
    }
    let P = A.state ? await A.state() : void 0,
        {
            authorizationUrl: W,
            codeVerifier: G
        } = await BX9(_, {
            metadata: X,
            clientInformation: D,
            state: P,
            redirectUrl: A.redirectUrl,
            scope: Y || (($ = O === null || O === void 0 ? void 0 : O.scopes_supported) === null || $ === void 0 ? void 0 : $.join(" ")) || A.clientMetadata.scope,
            resource: J
        });
    return await A.saveCodeVerifier(G), await A.redirectToAuthorization(W), "REDIRECT"
}
// @from(Ln 215532, Col 0)
function CX9(A) {
    if (!A) return !1;
    try {
        let q = new URL(A);
        return q.protocol === "https:" && q.pathname !== "/"
    } catch (q) {
        return !1
    }
}
// @from(Ln 215541, Col 0)
async function SX9(A, q, K) {
    let Y = zx7(A);
    if (q.validateResourceURL) return await q.validateResourceURL(Y, K === null || K === void 0 ? void 0 : K.resource);
    if (!K) return;
    if (!wx7({
            requestedResource: Y,
            configuredResource: K.resource
        })) throw Error(`Protected resource ${K.resource} does not match expected ${Y} (or origin)`);
    return new URL(K.resource)
}
// @from(Ln 215552, Col 0)
function F01(A) {
    let q = A.headers.get("WWW-Authenticate");
    if (!q) return {};
    let [K, Y] = q.split(" ");
    if (K.toLowerCase() !== "bearer" || !Y) return {};
    let z = sJA(A, "resource_metadata") || void 0,
        w;
    if (z) try {
        w = new URL(z)
    } catch (O) {}
    let H = sJA(A, "scope") || void 0,
        $ = sJA(A, "error") || void 0;
    return {
        resourceMetadataUrl: w,
        scope: H,
        error: $
    }
}
// @from(Ln 215571, Col 0)
function sJA(A, q) {
    let K = A.headers.get("WWW-Authenticate");
    if (!K) return null;
    let Y = new RegExp(`${q}=(?:"([^"]+)"|([^\\s,]+))`),
        z = K.match(Y);
    if (z) return z[1] || z[2];
    return null
}
// @from(Ln 215579, Col 0)
async function hX9(A, q, K = fetch) {
    var Y, z;
    let w = await bX9(A, "oauth-protected-resource", K, {
        protocolVersion: q === null || q === void 0 ? void 0 : q.protocolVersion,
        metadataUrl: q === null || q === void 0 ? void 0 : q.resourceMetadataUrl
    });
    if (!w || w.status === 404) throw await ((Y = w === null || w === void 0 ? void 0 : w.body) === null || Y === void 0 ? void 0 : Y.cancel()), Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
    if (!w.ok) throw await ((z = w.body) === null || z === void 0 ? void 0 : z.cancel()), Error(`HTTP ${w.status} trying to load well-known OAuth protected resource metadata.`);
    return Ax7.parse(await w.json())
}
// @from(Ln 215589, Col 0)
async function tJA(A, q, K = fetch) {
    try {
        return await K(A, {
            headers: q
        })
    } catch (Y) {
        if (Y instanceof TypeError)
            if (q) return tJA(A, void 0, K);
            else return;
        throw Y
    }
}
// @from(Ln 215602, Col 0)
function IX9(A, q = "", K = {}) {
    if (q.endsWith("/")) q = q.slice(0, -1);
    return K.prependPathname ? `${q}/.well-known/${A}` : `/.well-known/${A}${q}`
}
// @from(Ln 215606, Col 0)
async function $x7(A, q, K = fetch) {
    return await tJA(A, {
        "MCP-Protocol-Version": q
    }, K)
}
// @from(Ln 215612, Col 0)
function xX9(A, q) {
    return !A || A.status >= 400 && A.status < 500 && q !== "/"
}
// @from(Ln 215615, Col 0)
async function bX9(A, q, K, Y) {
    var z, w;
    let H = new URL(A),
        $ = (z = Y === null || Y === void 0 ? void 0 : Y.protocolVersion) !== null && z !== void 0 ? z : ao,
        O;
    if (Y === null || Y === void 0 ? void 0 : Y.metadataUrl) O = new URL(Y.metadataUrl);
    else {
        let J = IX9(q, H.pathname);
        O = new URL(J, (w = Y === null || Y === void 0 ? void 0 : Y.metadataServerUrl) !== null && w !== void 0 ? w : H), O.search = H.search
    }
    let _ = await $x7(O, $, K);
    if (!(Y === null || Y === void 0 ? void 0 : Y.metadataUrl) && xX9(_, H.pathname)) {
        let J = new URL(`/.well-known/${q}`, H);
        _ = await $x7(J, $, K)
    }
    return _
}
// @from(Ln 215633, Col 0)
function uX9(A) {
    let q = typeof A === "string" ? new URL(A) : A,
        K = q.pathname !== "/",
        Y = [];
    if (!K) return Y.push({
        url: new URL("/.well-known/oauth-authorization-server", q.origin),
        type: "oauth"
    }), Y.push({
        url: new URL("/.well-known/openid-configuration", q.origin),
        type: "oidc"
    }), Y;
    let z = q.pathname;
    if (z.endsWith("/")) z = z.slice(0, -1);
    return Y.push({
        url: new URL(`/.well-known/oauth-authorization-server${z}`, q.origin),
        type: "oauth"
    }), Y.push({
        url: new URL(`/.well-known/openid-configuration${z}`, q.origin),
        type: "oidc"
    }), Y.push({
        url: new URL(`${z}/.well-known/openid-configuration`, q.origin),
        type: "oidc"
    }), Y
}
// @from(Ln 215657, Col 0)
async function Bb1(A, {
    fetchFn: q = fetch,
    protocolVersion: K = ao
} = {}) {
    var Y;
    let z = {
            "MCP-Protocol-Version": K,
            Accept: "application/json"
        },
        w = uX9(A);
    for (let {
            url: H,
            type: $
        }
        of w) {
        let O = await tJA(H, z, q);
        if (!O) continue;
        if (!O.ok) {
            if (await ((Y = O.body) === null || Y === void 0 ? void 0 : Y.cancel()), O.status >= 400 && O.status < 500) continue;
            throw Error(`HTTP ${O.status} trying to load ${$==="oauth"?"OAuth":"OpenID provider"} metadata from ${H}`)
        }
        if ($ === "oauth") return iJA.parse(await O.json());
        else return qx7.parse(await O.json())
    }
    return
}
// @from(Ln 215683, Col 0)
async function BX9(A, {
    metadata: q,
    clientInformation: K,
    redirectUrl: Y,
    scope: z,
    state: w,
    resource: H
}) {
    let $;
    if (q) {
        if ($ = new URL(q.authorization_endpoint), !q.response_types_supported.includes(rJA)) throw Error(`Incompatible auth server: does not support response type ${rJA}`);
        if (q.code_challenge_methods_supported && !q.code_challenge_methods_supported.includes(oJA)) throw Error(`Incompatible auth server: does not support code challenge method ${oJA}`)
    } else $ = new URL("/authorize", A);
    let O = await lJA(),
        _ = O.code_verifier,
        J = O.code_challenge;
    if ($.searchParams.set("response_type", rJA), $.searchParams.set("client_id", K.client_id), $.searchParams.set("code_challenge", J), $.searchParams.set("code_challenge_method", oJA), $.searchParams.set("redirect_uri", String(Y)), w) $.searchParams.set("state", w);
    if (z) $.searchParams.set("scope", z);
    if (z === null || z === void 0 ? void 0 : z.includes("offline_access")) $.searchParams.append("prompt", "consent");
    if (H) $.searchParams.set("resource", H.href);
    return {
        authorizationUrl: $,
        codeVerifier: _
    }
}
// @from(Ln 215709, Col 0)
function mX9(A, q, K) {
    return new URLSearchParams({
        grant_type: "authorization_code",
        code: A,
        code_verifier: q,
        redirect_uri: String(K)
    })
}
// @from(Ln 215717, Col 0)
async function _x7(A, {
    metadata: q,
    tokenRequestParams: K,
    clientInformation: Y,
    addClientAuthentication: z,
    resource: w,
    fetchFn: H
}) {
    var $;
    let O = (q === null || q === void 0 ? void 0 : q.token_endpoint) ? new URL(q.token_endpoint) : new URL("/token", A),
        _ = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
        });
    if (w) K.set("resource", w.href);
    if (z) await z(_, K, O, q);
    else if (Y) {
        let X = ($ = q === null || q === void 0 ? void 0 : q.token_endpoint_auth_methods_supported) !== null && $ !== void 0 ? $ : [],
            D = EX9(Y, X);
        kX9(D, Y, _, K)
    }
    let J = await (H !== null && H !== void 0 ? H : fetch)(O, {
        method: "POST",
        headers: _,
        body: K
    });
    if (!J.ok) throw await Ox7(J);
    return Kx7.parse(await J.json())
}
// @from(Ln 215746, Col 0)
async function eJA(A, {
    metadata: q,
    clientInformation: K,
    refreshToken: Y,
    resource: z,
    addClientAuthentication: w,
    fetchFn: H
}) {
    let $ = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: Y
        }),
        O = await _x7(A, {
            metadata: q,
            tokenRequestParams: $,
            clientInformation: K,
            addClientAuthentication: w,
            resource: z,
            fetchFn: H
        });
    return {
        refresh_token: Y,
        ...O
    }
}
// @from(Ln 215771, Col 0)
async function FX9(A, q, {
    metadata: K,
    resource: Y,
    authorizationCode: z,
    fetchFn: w
} = {}) {
    let H = A.clientMetadata.scope,
        $;
    if (A.prepareTokenRequest) $ = await A.prepareTokenRequest(H);
    if (!$) {
        if (!z) throw Error("Either provider.prepareTokenRequest() or authorizationCode is required");
        if (!A.redirectUrl) throw Error("redirectUrl is required for authorization_code flow");
        let _ = await A.codeVerifier();
        $ = mX9(z, _, A.redirectUrl)
    }
    let O = await A.clientInformation();
    return _x7(q, {
        metadata: K,
        tokenRequestParams: $,
        clientInformation: O !== null && O !== void 0 ? O : void 0,
        addClientAuthentication: A.addClientAuthentication,
        resource: Y,
        fetchFn: w
    })
}
// @from(Ln 215796, Col 0)
async function QX9(A, {
    metadata: q,
    clientMetadata: K,
    fetchFn: Y
}) {
    let z;
    if (q) {
        if (!q.registration_endpoint) throw Error("Incompatible auth server: does not support dynamic client registration");
        z = new URL(q.registration_endpoint)
    } else z = new URL("/register", A);
    let w = await (Y !== null && Y !== void 0 ? Y : fetch)(z, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(K)
    });
    if (!w.ok) throw await Ox7(w);
    return Yx7.parse(await w.json())
}
// @from(Ln 215816, Col 4)
r0
// @from(Ln 215816, Col 8)
rJA = "code"
// @from(Ln 215817, Col 4)
oJA = "S256"
// @from(Ln 215818, Col 4)
mb1 = v(() => {
    tI7();
    gD();
    q$6();
    q$6();
    nJA();
    r0 = class r0 extends Error {
        constructor(A) {
            super(A !== null && A !== void 0 ? A : "Unauthorized")
        }
    }
})
// @from(Ln 215830, Col 0)
class D$6 {
    constructor(A, q) {
        this._url = A, this._resourceMetadataUrl = void 0, this._scope = void 0, this._eventSourceInit = q === null || q === void 0 ? void 0 : q.eventSourceInit, this._requestInit = q === null || q === void 0 ? void 0 : q.requestInit, this._authProvider = q === null || q === void 0 ? void 0 : q.authProvider, this._fetch = q === null || q === void 0 ? void 0 : q.fetch, this._fetchWithInit = hq1(q === null || q === void 0 ? void 0 : q.fetch, q === null || q === void 0 ? void 0 : q.requestInit)
    }
    async _authThenStart() {
        var A;
        if (!this._authProvider) throw new r0("No auth provider");
        let q;
        try {
            q = await AR(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            })
        } catch (K) {
            throw (A = this.onerror) === null || A === void 0 || A.call(this, K), K
        }
        if (q !== "AUTHORIZED") throw new r0;
        return await this._startOrAuth()
    }
    async _commonHeaders() {
        var A;
        let q = {};
        if (this._authProvider) {
            let Y = await this._authProvider.tokens();
            if (Y) q.Authorization = `Bearer ${Y.access_token}`
        }
        if (this._protocolVersion) q["mcp-protocol-version"] = this._protocolVersion;
        let K = I01((A = this._requestInit) === null || A === void 0 ? void 0 : A.headers);
        return new Headers({
            ...q,
            ...K
        })
    }
    _startOrAuth() {
        var A, q, K;
        let Y = (K = (q = (A = this === null || this === void 0 ? void 0 : this._eventSourceInit) === null || A === void 0 ? void 0 : A.fetch) !== null && q !== void 0 ? q : this._fetch) !== null && K !== void 0 ? K : fetch;
        return new Promise((z, w) => {
            this._eventSource = new h01(this._url.href, {
                ...this._eventSourceInit,
                fetch: async (H, $) => {
                    let O = await this._commonHeaders();
                    O.set("Accept", "text/event-stream");
                    let _ = await Y(H, {
                        ...$,
                        headers: O
                    });
                    if (_.status === 401 && _.headers.has("www-authenticate")) {
                        let {
                            resourceMetadataUrl: J,
                            scope: X
                        } = F01(_);
                        this._resourceMetadataUrl = J, this._scope = X
                    }
                    return _
                }
            }), this._abortController = new AbortController, this._eventSource.onerror = (H) => {
                var $;
                if (H.code === 401 && this._authProvider) {
                    this._authThenStart().then(z, w);
                    return
                }
                let O = new Jx7(H.code, H.message, H);
                w(O), ($ = this.onerror) === null || $ === void 0 || $.call(this, O)
            }, this._eventSource.onopen = () => {}, this._eventSource.addEventListener("endpoint", (H) => {
                var $;
                let O = H;
                try {
                    if (this._endpoint = new URL(O.data, this._url), this._endpoint.origin !== this._url.origin) throw Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`)
                } catch (_) {
                    w(_), ($ = this.onerror) === null || $ === void 0 || $.call(this, _), this.close();
                    return
                }
                z()
            }), this._eventSource.onmessage = (H) => {
                var $, O;
                let _ = H,
                    J;
                try {
                    J = Ah.parse(JSON.parse(_.data))
                } catch (X) {
                    ($ = this.onerror) === null || $ === void 0 || $.call(this, X);
                    return
                }(O = this.onmessage) === null || O === void 0 || O.call(this, J)
            }
        })
    }
    async start() {
        if (this._eventSource) throw Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return await this._startOrAuth()
    }
    async finishAuth(A) {
        if (!this._authProvider) throw new r0("No auth provider");
        if (await AR(this._authProvider, {
                serverUrl: this._url,
                authorizationCode: A,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new r0("Failed to authorize")
    }
    async close() {
        var A, q, K;
        (A = this._abortController) === null || A === void 0 || A.abort(), (q = this._eventSource) === null || q === void 0 || q.close(), (K = this.onclose) === null || K === void 0 || K.call(this)
    }
    async send(A) {
        var q, K, Y;
        if (!this._endpoint) throw Error("Not connected");
        try {
            let z = await this._commonHeaders();
            z.set("content-type", "application/json");
            let w = {
                    ...this._requestInit,
                    method: "POST",
                    headers: z,
                    body: JSON.stringify(A),
                    signal: (q = this._abortController) === null || q === void 0 ? void 0 : q.signal
                },
                H = await ((K = this._fetch) !== null && K !== void 0 ? K : fetch)(this._endpoint, w);
            if (!H.ok) {
                let $ = await H.text().catch(() => null);
                if (H.status === 401 && this._authProvider) {
                    let {
                        resourceMetadataUrl: O,
                        scope: _
                    } = F01(H);
                    if (this._resourceMetadataUrl = O, this._scope = _, await AR(this._authProvider, {
                            serverUrl: this._url,
                            resourceMetadataUrl: this._resourceMetadataUrl,
                            scope: this._scope,
                            fetchFn: this._fetchWithInit
                        }) !== "AUTHORIZED") throw new r0;
                    return this.send(A)
                }
                throw Error(`Error POSTing to endpoint (HTTP ${H.status}): ${$}`)
            }
        } catch (z) {
            throw (Y = this.onerror) === null || Y === void 0 || Y.call(this, z), z
        }
    }
    setProtocolVersion(A) {
        this._protocolVersion = A
    }
}
// @from(Ln 215975, Col 4)
Jx7
// @from(Ln 215976, Col 4)
Xx7 = v(() => {
    sI7();
    gD();
    mb1();
    Jx7 = class Jx7 extends Error {
        constructor(A, q, K) {
            super(`SSE error: ${q}`);
            this.code = A, this.event = K
        }
    }
})
// @from(Ln 215987, Col 4)
AXA
// @from(Ln 215988, Col 4)
Dx7 = v(() => {
    xJA();
    AXA = class AXA extends TransformStream {
        constructor({
            onError: A,
            onRetry: q,
            onComment: K
        } = {}) {
            let Y;
            super({
                start(z) {
                    Y = sH6({
                        onEvent: (w) => {
                            z.enqueue(w)
                        },
                        onError(w) {
                            A === "terminate" ? z.error(w) : typeof A == "function" && A(w)
                        },
                        onRetry: q,
                        onComment: K
                    })
                },
                transform(z) {
                    Y.feed(z)
                }
            })
        }
    }
})
// @from(Ln 216017, Col 0)
class j$6 {
    constructor(A, q) {
        var K;
        this._hasCompletedAuthFlow = !1, this._url = A, this._resourceMetadataUrl = void 0, this._scope = void 0, this._requestInit = q === null || q === void 0 ? void 0 : q.requestInit, this._authProvider = q === null || q === void 0 ? void 0 : q.authProvider, this._fetch = q === null || q === void 0 ? void 0 : q.fetch, this._fetchWithInit = hq1(q === null || q === void 0 ? void 0 : q.fetch, q === null || q === void 0 ? void 0 : q.requestInit), this._sessionId = q === null || q === void 0 ? void 0 : q.sessionId, this._reconnectionOptions = (K = q === null || q === void 0 ? void 0 : q.reconnectionOptions) !== null && K !== void 0 ? K : gX9
    }
    async _authThenStart() {
        var A;
        if (!this._authProvider) throw new r0("No auth provider");
        let q;
        try {
            q = await AR(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            })
        } catch (K) {
            throw (A = this.onerror) === null || A === void 0 || A.call(this, K), K
        }
        if (q !== "AUTHORIZED") throw new r0;
        return await this._startOrAuthSse({
            resumptionToken: void 0
        })
    }
    async _commonHeaders() {
        var A;
        let q = {};
        if (this._authProvider) {
            let Y = await this._authProvider.tokens();
            if (Y) q.Authorization = `Bearer ${Y.access_token}`
        }
        if (this._sessionId) q["mcp-session-id"] = this._sessionId;
        if (this._protocolVersion) q["mcp-protocol-version"] = this._protocolVersion;
        let K = I01((A = this._requestInit) === null || A === void 0 ? void 0 : A.headers);
        return new Headers({
            ...q,
            ...K
        })
    }
    async _startOrAuthSse(A) {
        var q, K, Y, z;
        let {
            resumptionToken: w
        } = A;
        try {
            let H = await this._commonHeaders();
            if (H.set("Accept", "text/event-stream"), w) H.set("last-event-id", w);
            let $ = await ((q = this._fetch) !== null && q !== void 0 ? q : fetch)(this._url, {
                method: "GET",
                headers: H,
                signal: (K = this._abortController) === null || K === void 0 ? void 0 : K.signal
            });
            if (!$.ok) {
                if (await ((Y = $.body) === null || Y === void 0 ? void 0 : Y.cancel()), $.status === 401 && this._authProvider) return await this._authThenStart();
                if ($.status === 405) return;
                throw new Iq1($.status, `Failed to open SSE stream: ${$.statusText}`)
            }
            this._handleSseStream($.body, A, !0)
        } catch (H) {
            throw (z = this.onerror) === null || z === void 0 || z.call(this, H), H
        }
    }
    _getNextReconnectionDelay(A) {
        if (this._serverRetryMs !== void 0) return this._serverRetryMs;
        let q = this._reconnectionOptions.initialReconnectionDelay,
            K = this._reconnectionOptions.reconnectionDelayGrowFactor,
            Y = this._reconnectionOptions.maxReconnectionDelay;
        return Math.min(q * Math.pow(K, A), Y)
    }
    _scheduleReconnection(A, q = 0) {
        var K;
        let Y = this._reconnectionOptions.maxRetries;
        if (q >= Y) {
            (K = this.onerror) === null || K === void 0 || K.call(this, Error(`Maximum reconnection attempts (${Y}) exceeded.`));
            return
        }
        let z = this._getNextReconnectionDelay(q);
        this._reconnectionTimeout = setTimeout(() => {
            this._startOrAuthSse(A).catch((w) => {
                var H;
                (H = this.onerror) === null || H === void 0 || H.call(this, Error(`Failed to reconnect SSE stream: ${w instanceof Error?w.message:String(w)}`)), this._scheduleReconnection(A, q + 1)
            })
        }, z)
    }
    _handleSseStream(A, q, K) {
        if (!A) return;
        let {
            onresumptiontoken: Y,
            replayMessageId: z
        } = q, w, H = !1, $ = !1;
        (async () => {
            var _, J, X, D;
            try {
                let j = A.pipeThrough(new TextDecoderStream).pipeThrough(new AXA({
                    onRetry: (W) => {
                        this._serverRetryMs = W
                    }
                })).getReader();
                while (!0) {
                    let {
                        value: W,
                        done: G
                    } = await j.read();
                    if (G) break;
                    if (W.id) w = W.id, H = !0, Y === null || Y === void 0 || Y(W.id);
                    if (!W.data) continue;
                    if (!W.event || W.event === "message") try {
                        let f = Ah.parse(JSON.parse(W.data));
                        if (fq1(f)) {
                            if ($ = !0, z !== void 0) f.id = z
                        }(_ = this.onmessage) === null || _ === void 0 || _.call(this, f)
                    } catch (f) {
                        (J = this.onerror) === null || J === void 0 || J.call(this, f)
                    }
                }
                if ((K || H) && !$ && this._abortController && !this._abortController.signal.aborted) this._scheduleReconnection({
                    resumptionToken: w,
                    onresumptiontoken: Y,
                    replayMessageId: z
                }, 0)
            } catch (j) {
                if ((X = this.onerror) === null || X === void 0 || X.call(this, Error(`SSE stream disconnected: ${j}`)), (K || H) && !$ && this._abortController && !this._abortController.signal.aborted) try {
                    this._scheduleReconnection({
                        resumptionToken: w,
                        onresumptiontoken: Y,
                        replayMessageId: z
                    }, 0)
                } catch (W) {
                    (D = this.onerror) === null || D === void 0 || D.call(this, Error(`Failed to reconnect: ${W instanceof Error?W.message:String(W)}`))
                }
            }
        })()
    }
    async start() {
        if (this._abortController) throw Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        this._abortController = new AbortController
    }
    async finishAuth(A) {
        if (!this._authProvider) throw new r0("No auth provider");
        if (await AR(this._authProvider, {
                serverUrl: this._url,
                authorizationCode: A,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new r0("Failed to authorize")
    }
    async close() {
        var A, q;
        if (this._reconnectionTimeout) clearTimeout(this._reconnectionTimeout), this._reconnectionTimeout = void 0;
        (A = this._abortController) === null || A === void 0 || A.abort(), (q = this.onclose) === null || q === void 0 || q.call(this)
    }
    async send(A, q) {
        var K, Y, z, w, H;
        try {
            let {
                resumptionToken: $,
                onresumptiontoken: O
            } = q || {};
            if ($) {
                this._startOrAuthSse({
                    resumptionToken: $,
                    replayMessageId: rx1(A) ? A.id : void 0
                }).catch((W) => {
                    var G;
                    return (G = this.onerror) === null || G === void 0 ? void 0 : G.call(this, W)
                });
                return
            }
            let _ = await this._commonHeaders();
            _.set("content-type", "application/json"), _.set("accept", "application/json, text/event-stream");
            let J = {
                    ...this._requestInit,
                    method: "POST",
                    headers: _,
                    body: JSON.stringify(A),
                    signal: (K = this._abortController) === null || K === void 0 ? void 0 : K.signal
                },
                X = await ((Y = this._fetch) !== null && Y !== void 0 ? Y : fetch)(this._url, J),
                D = X.headers.get("mcp-session-id");
            if (D) this._sessionId = D;
            if (!X.ok) {
                let W = await X.text().catch(() => null);
                if (X.status === 401 && this._authProvider) {
                    if (this._hasCompletedAuthFlow) throw new Iq1(401, "Server returned 401 after successful authentication");
                    let {
                        resourceMetadataUrl: G,
                        scope: f
                    } = F01(X);
                    if (this._resourceMetadataUrl = G, this._scope = f, await AR(this._authProvider, {
                            serverUrl: this._url,
                            resourceMetadataUrl: this._resourceMetadataUrl,
                            scope: this._scope,
                            fetchFn: this._fetchWithInit
                        }) !== "AUTHORIZED") throw new r0;
                    return this._hasCompletedAuthFlow = !0, this.send(A)
                }
                if (X.status === 403 && this._authProvider) {
                    let {
                        resourceMetadataUrl: G,
                        scope: f,
                        error: Z
                    } = F01(X);
                    if (Z === "insufficient_scope") {
                        let N = X.headers.get("WWW-Authenticate");
                        if (this._lastUpscopingHeader === N) throw new Iq1(403, "Server returned 403 after trying upscoping");
                        if (f) this._scope = f;
                        if (G) this._resourceMetadataUrl = G;
                        if (this._lastUpscopingHeader = N !== null && N !== void 0 ? N : void 0, await AR(this._authProvider, {
                                serverUrl: this._url,
                                resourceMetadataUrl: this._resourceMetadataUrl,
                                scope: this._scope,
                                fetchFn: this._fetch
                            }) !== "AUTHORIZED") throw new r0;
                        return this.send(A)
                    }
                }
                throw new Iq1(X.status, `Error POSTing to endpoint: ${W}`)
            }
            if (this._hasCompletedAuthFlow = !1, this._lastUpscopingHeader = void 0, X.status === 202) {
                if (await ((z = X.body) === null || z === void 0 ? void 0 : z.cancel()), nR7(A)) this._startOrAuthSse({
                    resumptionToken: void 0
                }).catch((W) => {
                    var G;
                    return (G = this.onerror) === null || G === void 0 ? void 0 : G.call(this, W)
                });
                return
            }
            let M = (Array.isArray(A) ? A : [A]).filter((W) => ("method" in W) && ("id" in W) && W.id !== void 0).length > 0,
                P = X.headers.get("content-type");
            if (M)
                if (P === null || P === void 0 ? void 0 : P.includes("text/event-stream")) this._handleSseStream(X.body, {
                    onresumptiontoken: O
                }, !1);
                else if (P === null || P === void 0 ? void 0 : P.includes("application/json")) {
                let W = await X.json(),
                    G = Array.isArray(W) ? W.map((f) => Ah.parse(f)) : [Ah.parse(W)];
                for (let f of G)(w = this.onmessage) === null || w === void 0 || w.call(this, f)
            } else throw new Iq1(-1, `Unexpected content type: ${P}`)
        } catch ($) {
            throw (H = this.onerror) === null || H === void 0 || H.call(this, $), $
        }
    }
    get sessionId() {
        return this._sessionId
    }
    async terminateSession() {
        var A, q, K, Y;
        if (!this._sessionId) return;
        try {
            let z = await this._commonHeaders(),
                w = {
                    ...this._requestInit,
                    method: "DELETE",
                    headers: z,
                    signal: (A = this._abortController) === null || A === void 0 ? void 0 : A.signal
                },
                H = await ((q = this._fetch) !== null && q !== void 0 ? q : fetch)(this._url, w);
            if (await ((K = H.body) === null || K === void 0 ? void 0 : K.cancel()), !H.ok && H.status !== 405) throw new Iq1(H.status, `Failed to terminate session: ${H.statusText}`);
            this._sessionId = void 0
        } catch (z) {
            throw (Y = this.onerror) === null || Y === void 0 || Y.call(this, z), z
        }
    }
    setProtocolVersion(A) {
        this._protocolVersion = A
    }
    get protocolVersion() {
        return this._protocolVersion
    }
    async resumeStream(A, q) {
        await this._startOrAuthSse({
            resumptionToken: A,
            onresumptiontoken: q === null || q === void 0 ? void 0 : q.onresumptiontoken
        })
    }
}
// @from(Ln 216294, Col 4)
gX9
// @from(Ln 216294, Col 9)
Iq1
// @from(Ln 216295, Col 4)
jx7 = v(() => {
    gD();
    mb1();
    Dx7();
    gX9 = {
        initialReconnectionDelay: 1000,
        maxReconnectionDelay: 30000,
        reconnectionDelayGrowFactor: 1.5,
        maxRetries: 2
    };
    Iq1 = class Iq1 extends Error {
        constructor(A, q) {
            super(`Streamable HTTP error: ${q}`);
            this.code = A
        }
    }
})
// @from(Ln 216313, Col 0)
function xq1() {
    return x8("tengu_mcp_elicitation", !1)
}
// @from(Ln 216316, Col 4)
qXA = v(() => {
    U4()
})
// @from(Ln 216319, Col 0)
async function Mx7(A, q = 10) {
    if (process.platform === "win32") {
        let z = `
      $pid = ${String(A)}
      $ancestors = @()
      for ($i = 0; $i -lt ${q}; $i++) {
        $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
        if (-not $proc -or -not $proc.ParentProcessId -or $proc.ParentProcessId -eq 0) { break }
        $pid = $proc.ParentProcessId
        $ancestors += $pid
      }
      $ancestors -join ','
    `.trim(),
            w = await d4("powershell.exe", ["-NoProfile", "-Command", z], {
                timeout: 3000
            });
        if (w.code !== 0 || !w.stdout?.trim()) return [];
        return w.stdout.trim().split(",").filter(Boolean).map((H) => parseInt(H, 10)).filter((H) => !isNaN(H))
    }
    let K = `pid=${String(A)}; for i in $(seq 1 ${q}); do ppid=$(ps -o ppid= -p $pid 2>/dev/null | tr -d ' '); if [ -z "$ppid" ] || [ "$ppid" = "0" ] || [ "$ppid" = "1" ]; then break; fi; echo $ppid; pid=$ppid; done`,
        Y = await d4("sh", ["-c", K], {
            timeout: 3000
        });
    if (Y.code !== 0 || !Y.stdout?.trim()) return [];
    return Y.stdout.trim().split(`
`).filter(Boolean).map((z) => parseInt(z, 10)).filter((z) => !isNaN(z))
}
// @from(Ln 216347, Col 0)
function Px7(A) {
    try {
        let q = String(A),
            K = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${q}\\").CommandLine"` : `ps -o command= -p ${q}`,
            Y = Qf(K, {
                timeout: 1000
            });
        return Y ? Y.trim() : null
    } catch {
        return null
    }
}
// @from(Ln 216359, Col 0)
async function Wx7(A, q = 10) {
    if (process.platform === "win32") {
        let z = `
      $currentPid = ${String(A)}
      $commands = @()
      for ($i = 0; $i -lt ${q}; $i++) {
        $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$currentPid" -ErrorAction SilentlyContinue
        if (-not $proc) { break }
        if ($proc.CommandLine) { $commands += $proc.CommandLine }
        if (-not $proc.ParentProcessId -or $proc.ParentProcessId -eq 0) { break }
        $currentPid = $proc.ParentProcessId
      }
      $commands -join [char]0
    `.trim(),
            w = await d4("powershell.exe", ["-NoProfile", "-Command", z], {
                timeout: 3000
            });
        if (w.code !== 0 || !w.stdout?.trim()) return [];
        return w.stdout.split("\x00").filter(Boolean)
    }
    let K = `currentpid=${String(A)}; for i in $(seq 1 ${q}); do cmd=$(ps -o command= -p $currentpid 2>/dev/null); if [ -n "$cmd" ]; then printf '%s\\0' "$cmd"; fi; ppid=$(ps -o ppid= -p $currentpid 2>/dev/null | tr -d ' '); if [ -z "$ppid" ] || [ "$ppid" = "0" ] || [ "$ppid" = "1" ]; then break; fi; currentpid=$ppid; done`,
        Y = await d4("sh", ["-c", K], {
            timeout: 3000
        });
    if (Y.code !== 0 || !Y.stdout?.trim()) return [];
    return Y.stdout.split("\x00").filter(Boolean)
}
// @from(Ln 216386, Col 4)
M$6 = v(() => {
    tq()
})
// @from(Ln 216392, Col 0)
function pX9(A) {
    let q = Fb1.homedir(),
        K = [],
        Y = Zx7[A.toLowerCase()];
    if (!Y) return K;
    let z = process.env.APPDATA || o0.join(q, "AppData", "Roaming"),
        w = process.env.LOCALAPPDATA || o0.join(q, "AppData", "Local");
    switch (Fb1.platform()) {
        case "darwin":
            if (K.push(o0.join(q, "Library", "Application Support", "JetBrains"), o0.join(q, "Library", "Application Support")), A.toLowerCase() === "androidstudio") K.push(o0.join(q, "Library", "Application Support", "Google"));
            break;
        case "win32":
            if (K.push(o0.join(z, "JetBrains"), o0.join(w, "JetBrains"), o0.join(z)), A.toLowerCase() === "androidstudio") K.push(o0.join(w, "Google"));
            break;
        case "linux":
            K.push(o0.join(q, ".config", "JetBrains"), o0.join(q, ".local", "share", "JetBrains"));
            for (let H of Y) K.push(o0.join(q, "." + H));
            if (A.toLowerCase() === "androidstudio") K.push(o0.join(q, ".config", "Google"));
            break;
        default:
            break
    }
    return K
}
// @from(Ln 216417, Col 0)
function dX9(A) {
    let q = [],
        K = b1(),
        Y = pX9(A),
        z = Zx7[A.toLowerCase()];
    if (!z) return q;
    for (let w of Y) {
        if (!K.existsSync(w)) continue;
        for (let H of z) try {
            let $ = new RegExp("^" + H + ".*$"),
                O = K.readdirSync(w).filter((_) => $.test(_.name) && K.statSync(o0.join(w, _.name)).isDirectory()).map((_) => o0.join(w, _.name));
            for (let _ of O) {
                let J = Fb1.platform() === "linux" ? _ : o0.join(_, "plugins");
                if (K.existsSync(J)) q.push(J)
            }
        } catch {
            continue
        }
    }
    return q.filter((w, H) => q.indexOf(w) === H)
}
// @from(Ln 216439, Col 0)
function KXA(A) {
    let q = dX9(A);
    for (let K of q) {
        let Y = o0.join(K, UX9);
        if (b1().existsSync(Y)) return !0
    }
    return !1
}
// @from(Ln 216448, Col 0)
function fx7(A, q = !1) {
    if (q) Gx7.cache.delete(A);
    return Gx7(A)
}
// @from(Ln 216452, Col 4)
UX9 = "claude-code-jetbrains-plugin"
// @from(Ln 216453, Col 4)
Zx7
// @from(Ln 216453, Col 9)
Gx7
// @from(Ln 216454, Col 4)
YXA = v(() => {
    _8();
    zq();
    Zx7 = {
        pycharm: ["PyCharm"],
        intellij: ["IntelliJIdea", "IdeaIC"],
        webstorm: ["WebStorm"],
        phpstorm: ["PhpStorm"],
        rubymine: ["RubyMine"],
        clion: ["CLion"],
        goland: ["GoLand"],
        rider: ["Rider"],
        datagrip: ["DataGrip"],
        appcode: ["AppCode"],
        dataspell: ["DataSpell"],
        aqua: ["Aqua"],
        gateway: ["Gateway"],
        fleet: ["Fleet"],
        androidstudio: ["AndroidStudio"]
    };
    Gx7 = KA(KXA)
})
// @from(Ln 216476, Col 0)
async function Vx7() {
    if (bq1 !== void 0) return bq1;
    if (process.platform === "darwin") return bq1 = null, null;
    try {
        let A = await Wx7(process.pid, 10);
        for (let q of A) {
            let K = q.toLowerCase();
            for (let Y of bI6)
                if (K.includes(Y)) return bq1 = Y, Y
        }
    } catch {}
    return bq1 = null, null
}
// @from(Ln 216489, Col 0)
async function rX9() {
    if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
        if (xA.platform !== "darwin") return await Vx7() || "pycharm"
    }
    return xA.terminal
}
// @from(Ln 216496, Col 0)
function oX9() {
    if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
        if (xA.platform !== "darwin") {
            if (bq1 !== void 0) return bq1 || "pycharm";
            return "pycharm"
        }
    }
    return xA.terminal
}
// @from(Ln 216505, Col 0)
async function zXA() {
    if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") await Vx7()
}
// @from(Ln 216508, Col 4)
lX9
// @from(Ln 216508, Col 9)
iX9 = () => {
        return process.platform === "linux" && process.env.CLAUDE_CODE_BUBBLEWRAP === "1"
    }
// @from(Ln 216511, Col 4)
nX9
// @from(Ln 216511, Col 9)
bq1
// @from(Ln 216511, Col 14)
lV
// @from(Ln 216512, Col 4)
$a = v(() => {
    tq();
    M$6();
    zq();
    _8();
    G5();
    lX9 = KA(async () => {
        let {
            code: A
        } = await IA("test", ["-f", "/.dockerenv"]);
        if (A !== 0) return !1;
        return process.platform === "linux"
    }), nX9 = KA(() => {
        if (process.platform !== "linux") return !1;
        let A = process.arch === "x64" ? "x86_64" : "aarch64";
        return b1().existsSync(`/lib/libc.musl-${A}.so.1`)
    });
    lV = {
        ...xA,
        terminal: oX9(),
        getIsDocker: lX9,
        getIsBubblewrapSandbox: iX9,
        isMuslEnvironment: nX9,
        getTerminalWithJetBrainsDetectionAsync: rX9,
        initJetBrainsDetection: zXA
    }
})
// @from(Ln 216540, Col 0)
function Nx7(A) {
    let q = e(23),
        {
            onDone: K,
            installationStatus: Y
        } = A;
    aX9();
    let z;
    if (q[0] !== K) z = {
        "confirm:yes": K,
        "confirm:no": K
    }, q[0] = K, q[1] = z;
    else z = q[1];
    let w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = {
        context: "Confirmation"
    }, q[2] = w;
    else w = q[2];
    c7(z, w);
    let H;
    if (q[3] !== Y?.ideType) H = Y?.ideType ?? Q01(), q[3] = Y?.ideType, q[4] = H;
    else H = q[4];
    let $ = H,
        O = Oh($),
        _;
    if (q[5] !== $) _ = S_($), q[5] = $, q[6] = _;
    else _ = q[6];
    let J = _,
        X = Y?.installedVersion,
        D = O ? "plugin" : "extension",
        j = xA.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K",
        M;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) M = ZJ.default.createElement(V, {
        color: "claude"
    }, "✻ "), q[7] = M;
    else M = q[7];
    let P;
    if (q[8] !== J) P = ZJ.default.createElement(ZJ.default.Fragment, null, M, ZJ.default.createElement(V, null, "Welcome to Claude Code for ", J)), q[8] = J, q[9] = P;
    else P = q[9];
    let W = X ? `installed ${D} v${X}` : void 0,
        G;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) G = ZJ.default.createElement(V, {
        color: "suggestion"
    }, "⧉ open files"), q[10] = G;
    else G = q[10];
    let f;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) f = ZJ.default.createElement(V, null, "• Claude has context of ", G, " ", "and ", ZJ.default.createElement(V, {
        color: "suggestion"
    }, "⧉ selected lines")), q[11] = f;
    else f = q[11];
    let Z;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) Z = ZJ.default.createElement(V, {
        color: "diffAddedWord"
    }, "+11"), q[12] = Z;
    else Z = q[12];
    let N;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) N = ZJ.default.createElement(V, null, "• Review Claude Code's changes", " ", Z, " ", ZJ.default.createElement(V, {
        color: "diffRemovedWord"
    }, "-22"), " in the comfort of your IDE"), q[13] = N;
    else N = q[13];
    let T;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) T = ZJ.default.createElement(V, null, "• Cmd+Esc", ZJ.default.createElement(V, {
        dimColor: !0
    }, " for Quick Launch")), q[14] = T;
    else T = q[14];
    let k;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) k = ZJ.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, f, N, T, ZJ.default.createElement(V, null, "• ", j, ZJ.default.createElement(V, {
        dimColor: !0
    }, " to reference files or lines in your input"))), q[15] = k;
    else k = q[15];
    let y;
    if (q[16] !== K || q[17] !== P || q[18] !== W) y = ZJ.default.createElement(w8, {
        title: P,
        subtitle: W,
        color: "ide",
        onCancel: K,
        hideInputGuide: !0
    }, k), q[16] = K, q[17] = P, q[18] = W, q[19] = y;
    else y = q[19];
    let B;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) B = ZJ.default.createElement(I, {
        paddingX: 1
    }, ZJ.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Press Enter to continue")), q[20] = B;
    else B = q[20];
    let S;
    if (q[21] !== y) S = ZJ.default.createElement(ZJ.default.Fragment, null, y, B), q[21] = y, q[22] = S;
    else S = q[22];
    return S
}
// @from(Ln 216636, Col 0)
function P$6() {
    let A = f6(),
        q = lV.terminal || "unknown";
    return A.hasIdeOnboardingBeenShown?.[q] === !0
}
// @from(Ln 216642, Col 0)
function aX9() {
    if (P$6()) return;
    let A = lV.terminal || "unknown";
    jA((q) => ({
        ...q,
        hasIdeOnboardingBeenShown: {
            ...q.hasIdeOnboardingBeenShown,
            [A]: !0
        }
    }))
}
// @from(Ln 216653, Col 4)
ZJ
// @from(Ln 216654, Col 4)
wXA = v(() => {
    i1();
    m1();
    q$();
    G5();
    K7();
    cA();
    $a();
    Bq();
    ZJ = o(X1(), 1)
})
// @from(Ln 216668, Col 0)
class g01 {
    wslDistroName;
    constructor(A) {
        this.wslDistroName = A
    }
    toLocalPath(A) {
        if (!A) return A;
        if (this.wslDistroName) {
            let q = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
            if (q && q[1] !== this.wslDistroName) return A
        }
        try {
            return Tx7("wslpath", ["-u", A], {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim()
        } catch {
            return A.replace(/\\/g, "/").replace(/^([A-Z]):/i, (q, K) => `/mnt/${K.toLowerCase()}`)
        }
    }
    toIDEPath(A) {
        if (!A) return A;
        try {
            return Tx7("wslpath", ["-w", A], {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim()
        } catch {
            return A
        }
    }
}
// @from(Ln 216701, Col 0)
function vx7(A, q) {
    let K = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
    if (K) return K[1] === q;
    return !0
}
// @from(Ln 216706, Col 4)
HXA = () => {}
// @from(Ln 216720, Col 0)
function Cx7(A) {
    try {
        return process.kill(A, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 216727, Col 0)
async function AD9(A) {
    if (!Cx7(A)) return !1;
    if (!bX()) return !0;
    if (process.ppid === A) return !0;
    return (await Mx7(process.ppid, 10)).includes(A)
}
// @from(Ln 216734, Col 0)
function f$6(A) {
    if (!A) return !1;
    let q = U01[A];
    return q && q.ideKind === "vscode"
}
// @from(Ln 216740, Col 0)
function Oh(A) {
    if (!A) return !1;
    let q = U01[A];
    return q && q.ideKind === "jetbrains"
}
// @from(Ln 216746, Col 0)
function Q01() {
    if (!bX()) return null;
    return xA.terminal
}
// @from(Ln 216751, Col 0)
function V$6() {
    try {
        return qD9().flatMap((K) => {
            try {
                return b1().readdirSync(K).filter((Y) => Y.name.endsWith(".lock")).map((Y) => {
                    let z = $XA(K, Y.name);
                    return {
                        path: z,
                        mtime: b1().statSync(z).mtime
                    }
                })
            } catch (Y) {
                return K1(Y), []
            }
        }).sort((K, Y) => Y.mtime.getTime() - K.mtime.getTime()).map((K) => K.path)
    } catch (A) {
        return K1(A), []
    }
}
// @from(Ln 216771, Col 0)
function Sx7(A) {
    try {
        let q = b1().readFileSync(A, {
                encoding: "utf-8"
            }),
            K = [],
            Y, z, w = !1,
            H = !1,
            $;
        try {
            let J = _A(q);
            if (J.workspaceFolders) K = J.workspaceFolders;
            Y = J.pid, z = J.ideName, w = J.transport === "ws", H = J.runningInWindows === !0, $ = J.authToken
        } catch (J) {
            K = q.split(`
`).map((X) => X.trim())
        }
        let O = A.split(G$6).pop();
        if (!O) return null;
        let _ = O.replace(".lock", "");
        return {
            workspaceFolders: K,
            port: parseInt(_),
            pid: Y,
            ideName: z,
            useWebSocket: w,
            runningInWindows: H,
            authToken: $
        }
    } catch (q) {
        return K1(q), null
    }
}
// @from(Ln 216804, Col 0)
async function OXA(A, q, K = 500) {
    try {
        return new Promise((Y) => {
            let z = eX9({
                host: A,
                port: q,
                timeout: K
            });
            z.on("connect", () => {
                z.destroy(), Y(!0)
            }), z.on("error", () => {
                Y(!1)
            }), z.on("timeout", () => {
                z.destroy(), Y(!1)
            })
        })
    } catch (Y) {
        return !1
    }
}
// @from(Ln 216825, Col 0)
function qD9() {
    let A = [],
        q = b1(),
        K = eA(),
        Y = $XA(O8(), "ide");
    if (q.existsSync(Y)) A.push(Y);
    if (K !== "wsl") return A;
    let z = process.env.USERPROFILE;
    if (!z) try {
        let w = Qf("powershell.exe -Command '$env:USERPROFILE'");
        if (w) z = w.trim()
    } catch {
        h("Unable to get Windows USERPROFILE via PowerShell - IDE detection may be incomplete")
    }
    if (z) {
        let H = new g01(process.env.WSL_DISTRO_NAME).toLocalPath(z),
            $ = Z$6(H, ".claude", "ide");
        if (q.existsSync($)) A.push($)
    }
    try {
        if (q.existsSync("/mnt/c/Users")) {
            let H = q.readdirSync("/mnt/c/Users");
            for (let $ of H) {
                if ($.name === "Public" || $.name === "Default" || $.name === "Default User" || $.name === "All Users") continue;
                let O = $XA("/mnt/c/Users", $.name, ".claude", "ide");
                if (q.existsSync(O)) A.push(O)
            }
        }
    } catch (w) {
        K1(w instanceof Error ? w : Error(String(w)))
    }
    return A
}
// @from(Ln 216858, Col 0)
async function KD9() {
    try {
        let A = V$6();
        for (let q of A) {
            let K = Sx7(q);
            if (!K) {
                try {
                    b1().unlinkSync(q)
                } catch (w) {
                    K1(w)
                }
                continue
            }
            let Y = await Qx7(K.runningInWindows, K.port),
                z = !1;
            if (K.pid) {
                if (!Cx7(K.pid)) {
                    if (eA() !== "wsl") z = !0;
                    else if (!await OXA(Y, K.port)) z = !0
                }
            } else if (!await OXA(Y, K.port)) z = !0;
            if (z) try {
                b1().unlinkSync(q)
            } catch (w) {
                K1(w)
            }
        }
    } catch (A) {
        K1(A)
    }
}
// @from(Ln 216889, Col 0)
async function zD9(A) {
    try {
        let q = await HD9(A);
        if (c("tengu_ext_installed", {}), !f6().diffTool) jA((Y) => ({
            ...Y,
            diffTool: "auto"
        }));
        return {
            installed: !0,
            error: null,
            installedVersion: q,
            ideType: A
        }
    } catch (q) {
        c("tengu_ext_install_error", {});
        let K = q instanceof Error ? q.message : String(q);
        return K1(q), {
            installed: !1,
            error: K,
            installedVersion: null,
            ideType: A
        }
    }
}
// @from(Ln 216913, Col 0)
async function Ex7() {
    if (W$6) W$6.abort();
    W$6 = Aq();
    let A = W$6.signal;
    await KD9();
    let q = Date.now();
    while (Date.now() - q < 30000 && !A.aborted) {
        let K = await Ub1(!1);
        if (A.aborted) return null;
        if (K.length === 1) return K[0];
        await new Promise((Y) => setTimeout(Y, 1000))
    }
    return null
}
// @from(Ln 216927, Col 0)
async function Ub1(A) {
    let q = [];
    try {
        let K = process.env.CLAUDE_CODE_SSE_PORT,
            Y = K ? parseInt(K) : null,
            z = y8().normalize("NFC"),
            w = V$6();
        for (let H of w) {
            let $ = Sx7(H);
            if (!$) continue;
            if (eA() !== "wsl" && bX()) {
                if (!(Y !== null && $.port === Y)) {
                    if (!($.pid ? await AD9($.pid) : !1)) continue
                }
            }
            let O = !1;
            if (process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK === "true") O = !0;
            else if ($.port === Y) O = !0;
            else O = $.workspaceFolders.some((D) => {
                if (!D) return !1;
                let j = D;
                if (eA() === "wsl" && $.runningInWindows && process.env.WSL_DISTRO_NAME) {
                    if (!vx7(D, process.env.WSL_DISTRO_NAME)) return !1;
                    let P = Z$6(j).normalize("NFC");
                    if (z === P || z.startsWith(P + G$6)) return !0;
                    j = new g01(process.env.WSL_DISTRO_NAME).toLocalPath(D)
                }
                let M = Z$6(j).normalize("NFC");
                if (eA() === "windows") {
                    let P = z.replace(/^[a-zA-Z]:/, (G) => G.toUpperCase()),
                        W = M.replace(/^[a-zA-Z]:/, (G) => G.toUpperCase());
                    return P === W || P.startsWith(W + G$6)
                }
                return z === M || z.startsWith(M + G$6)
            });
            if (!O && !A) continue;
            let _ = $.ideName ?? (bX() ? S_(lV.terminal) : "IDE"),
                J = await Qx7($.runningInWindows, $.port),
                X;
            if ($.useWebSocket) X = `ws://${J}:${$.port}`;
            else X = `http://${J}:${$.port}/sse`;
            q.push({
                url: X,
                name: _,
                workspaceFolders: $.workspaceFolders,
                port: $.port,
                isValid: O,
                authToken: $.authToken,
                ideRunningInWindows: $.runningInWindows
            })
        }
        if (!A && Y) {
            let H = q.filter(($) => $.isValid && $.port === Y);
            if (H.length === 1) return H
        }
    } catch (K) {
        K1(K)
    }
    return q
}
// @from(Ln 216987, Col 0)
async function hx7(A) {
    await A.notification({
        method: "ide_connected",
        params: {
            pid: process.pid
        }
    })
}
// @from(Ln 216996, Col 0)
function N$6(A) {
    return A.some((q) => q.type === "connected" && q.name === "ide")
}
// @from(Ln 216999, Col 0)
async function kx7(A) {
    if (f$6(A)) {
        let q = Ix7(A);
        if (q) try {
            if ((await d4(q, ["--list-extensions"], {
                    env: JXA()
                })).stdout?.includes(wD9)) return !0
        } catch {}
    } else if (Oh(A)) return KXA(A);
    return !1
}
// @from(Ln 217010, Col 0)
async function HD9(A) {
    if (f$6(A)) {
        let q = Ix7(A);
        if (q) {
            let K = await $D9(q);
            if (!K || yx7.lt(K, Lx7())) {
                await new Promise((z) => {
                    setTimeout(z, 500)
                });
                let Y = await d4(q, ["--force", "--install-extension", "anthropic.claude-code"], {
                    env: JXA()
                });
                if (Y.code !== 0) throw Error(`${Y.code}: ${Y.error} ${Y.stderr}`);
                K = Lx7()
            }
            return K
        }
    }
    return null
}
// @from(Ln 217031, Col 0)
function JXA() {
    if (eA() === "linux") return {
        ...process.env,
        DISPLAY: ""
    };
    return
}
// @from(Ln 217039, Col 0)
function Lx7() {
    return {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION
}
// @from(Ln 217049, Col 0)
async function $D9(A) {
    let {
        stdout: q
    } = await IA(A, ["--list-extensions", "--show-versions"], {
        env: JXA()
    }), K = q?.split(`
`) || [];
    for (let Y of K) {
        let [z, w] = Y.split("@");
        if (z === "anthropic.claude-code" && w) return w
    }
    return null
}
// @from(Ln 217063, Col 0)
function OD9() {
    try {
        if (eA() !== "macos") return null;
        let q = process.ppid;
        for (let K = 0; K < 10; K++) {
            if (!q || q === 0 || q === 1) break;
            let Y = Qf(`ps -o command= -p ${q}`)?.trim();
            if (Y) {
                let w = {
                        "Visual Studio Code.app": "code",
                        "Cursor.app": "cursor",
                        "Windsurf.app": "windsurf",
                        "Visual Studio Code - Insiders.app": "code",
                        "VSCodium.app": "codium"
                    },
                    H = "/Contents/MacOS/Electron";
                for (let [$, O] of Object.entries(w)) {
                    let _ = Y.indexOf($ + "/Contents/MacOS/Electron");
                    if (_ !== -1) {
                        let J = _ + $.length;
                        return Y.substring(0, J) + "/Contents/Resources/app/bin/" + O
                    }
                }
            }
            let z = Qf(`ps -o ppid= -p ${q}`)?.trim();
            if (!z) break;
            q = parseInt(z.trim())
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 217097, Col 0)
function Ix7(A) {
    let q = OD9();
    if (q) {
        if (b1().existsSync(q)) return q
    }
    switch (A) {
        case "vscode":
            return "code";
        case "cursor":
            return "cursor";
        case "windsurf":
            return "windsurf";
        default:
            break
    }
    return null
}
// @from(Ln 217114, Col 0)
async function xx7() {
    return (await IA("cursor", ["--version"])).code === 0
}
// @from(Ln 217117, Col 0)
async function bx7() {
    return (await IA("windsurf", ["--version"])).code === 0
}
// @from(Ln 217120, Col 0)
async function ux7() {
    let A = await IA("code", ["--help"]);
    return A.code === 0 && Boolean(A.stdout?.includes("Visual Studio Code"))
}
// @from(Ln 217124, Col 0)
async function _D9() {
    let A = [];
    try {
        let q = eA();
        if (q === "macos") {
            let Y = (await XY('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep', {
                shell: !0,
                reject: !1
            })).stdout ?? "";
            for (let [z, w] of Object.entries(U01))
                for (let H of w.processKeywordsMac)
                    if (Y.includes(H)) {
                        A.push(z);
                        break
                    }
        } else if (q === "windows") {
            let z = ((await XY('tasklist | findstr /I "Code.exe Cursor.exe Windsurf.exe idea64.exe pycharm64.exe webstorm64.exe phpstorm64.exe rubymine64.exe clion64.exe goland64.exe rider64.exe datagrip64.exe appcode.exe dataspell64.exe aqua64.exe gateway64.exe fleet.exe studio64.exe"', {
                shell: !0,
                reject: !1
            })).stdout ?? "").toLowerCase();
            for (let [w, H] of Object.entries(U01))
                for (let $ of H.processKeywordsWindows)
                    if (z.includes($.toLowerCase())) {
                        A.push(w);
                        break
                    }
        } else if (q === "linux") {
            let z = ((await XY('ps aux | grep -E "code|cursor|windsurf|idea|pycharm|webstorm|phpstorm|rubymine|clion|goland|rider|datagrip|dataspell|aqua|gateway|fleet|android-studio" | grep -v grep', {
                shell: !0,
                reject: !1
            })).stdout ?? "").toLowerCase();
            for (let [w, H] of Object.entries(U01))
                for (let $ of H.processKeywordsLinux)
                    if (z.includes($)) {
                        if (w !== "vscode") {
                            A.push(w);
                            break
                        } else if (!z.includes("cursor") && !z.includes("appcode")) {
                            A.push(w);
                            break
                        }
                    }
        }
    } catch (q) {
        K1(q)
    }
    return A
}
// @from(Ln 217172, Col 0)
async function XXA() {
    let A = await _D9();
    return _XA = A, A
}
// @from(Ln 217176, Col 0)
async function Bx7() {
    if (_XA === null) return XXA();
    return _XA
}
// @from(Ln 217181, Col 0)
function T$6(A) {
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return DXA(q)
}
// @from(Ln 217186, Col 0)
function DXA(A) {
    let q = A?.config;
    return q?.type === "sse-ide" || q?.type === "ws-ide" ? q.ideName : bX() ? S_(lV.terminal) : null
}
// @from(Ln 217191, Col 0)
function S_(A) {
    if (!A) return "IDE";
    let q = U01[A];
    if (q) return q.displayName;
    let K = Rx7[A.toLowerCase().trim()];
    if (K) return K;
    let Y = A.split(" ")[0],
        z = Y ? sX9(Y).toLowerCase() : null;
    if (z) {
        let w = Rx7[z];
        if (w) return w;
        return _Q(z)
    }
    return _Q(A)
}
// @from(Ln 217207, Col 0)
function iV(A) {
    if (!A) return;
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return q?.type === "connected" ? q : void 0
}
// @from(Ln 217212, Col 0)
async function mx7(A) {
    try {
        await _h("closeAllDiffTabs", {}, A)
    } catch (q) {}
}
// @from(Ln 217217, Col 0)
async function Fx7(A, q, K, Y) {
    Ex7().then(A);
    let z = f6().autoInstallIdeExtension ?? !0;
    if (process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL !== "true" && z) {
        let w = q ?? Q01();
        if (w) {
            if (f$6(w)) kx7(w).then(async (H) => {
                zD9(w).catch(($) => {
                    return {
                        installed: !1,
                        error: $.message || "Installation failed",
                        installedVersion: null,
                        ideType: w
                    }
                }).then(($) => {
                    if (Y($), $?.installed) Ex7().then(A);
                    if (!H && $?.installed === !0 && !P$6()) K()
                })
            });
            else if (Oh(w) && !P$6()) kx7(w).then(async (H) => {
                if (H) K()
            })
        }
    }
}
// @from(Ln 217242, Col 4)
yx7
// @from(Ln 217242, Col 9)
U01
// @from(Ln 217242, Col 14)
Qb1
// @from(Ln 217242, Col 19)
gb1
// @from(Ln 217242, Col 24)
bX
// @from(Ln 217242, Col 28)
YD9
// @from(Ln 217242, Col 33)
Fww
// @from(Ln 217242, Col 38)
W$6 = null
// @from(Ln 217243, Col 4)
wD9 = "anthropic.claude-code"
// @from(Ln 217244, Col 4)
_XA = null
// @from(Ln 217245, Col 4)
Rx7
// @from(Ln 217245, Col 9)
Qx7
// @from(Ln 217246, Col 4)
q$ = v(() => {
    G5();
    hA();
    M$6();
    tq();
    Bf();
    cA();
    u6();
    TN1();
    zq();
    B6();
    _8();
    y6();
    x3();
    SW();
    YXA();
    wXA();
    HXA();
    Z6();
    G2();
    $a();
    m6();
    yx7 = o(GS(), 1);
    U01 = {
        cursor: {
            ideKind: "vscode",
            displayName: "Cursor",
            processKeywordsMac: ["Cursor Helper", "Cursor.app"],
            processKeywordsWindows: ["cursor.exe"],
            processKeywordsLinux: ["cursor"]
        },
        windsurf: {
            ideKind: "vscode",
            displayName: "Windsurf",
            processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
            processKeywordsWindows: ["windsurf.exe"],
            processKeywordsLinux: ["windsurf"]
        },
        vscode: {
            ideKind: "vscode",
            displayName: "VS Code",
            processKeywordsMac: ["Visual Studio Code", "Code Helper"],
            processKeywordsWindows: ["code.exe"],
            processKeywordsLinux: ["code"]
        },
        intellij: {
            ideKind: "jetbrains",
            displayName: "IntelliJ IDEA",
            processKeywordsMac: ["IntelliJ IDEA"],
            processKeywordsWindows: ["idea64.exe"],
            processKeywordsLinux: ["idea", "intellij"]
        },
        pycharm: {
            ideKind: "jetbrains",
            displayName: "PyCharm",
            processKeywordsMac: ["PyCharm"],
            processKeywordsWindows: ["pycharm64.exe"],
            processKeywordsLinux: ["pycharm"]
        },
        webstorm: {
            ideKind: "jetbrains",
            displayName: "WebStorm",
            processKeywordsMac: ["WebStorm"],
            processKeywordsWindows: ["webstorm64.exe"],
            processKeywordsLinux: ["webstorm"]
        },
        phpstorm: {
            ideKind: "jetbrains",
            displayName: "PhpStorm",
            processKeywordsMac: ["PhpStorm"],
            processKeywordsWindows: ["phpstorm64.exe"],
            processKeywordsLinux: ["phpstorm"]
        },
        rubymine: {
            ideKind: "jetbrains",
            displayName: "RubyMine",
            processKeywordsMac: ["RubyMine"],
            processKeywordsWindows: ["rubymine64.exe"],
            processKeywordsLinux: ["rubymine"]
        },
        clion: {
            ideKind: "jetbrains",
            displayName: "CLion",
            processKeywordsMac: ["CLion"],
            processKeywordsWindows: ["clion64.exe"],
            processKeywordsLinux: ["clion"]
        },
        goland: {
            ideKind: "jetbrains",
            displayName: "GoLand",
            processKeywordsMac: ["GoLand"],
            processKeywordsWindows: ["goland64.exe"],
            processKeywordsLinux: ["goland"]
        },
        rider: {
            ideKind: "jetbrains",
            displayName: "Rider",
            processKeywordsMac: ["Rider"],
            processKeywordsWindows: ["rider64.exe"],
            processKeywordsLinux: ["rider"]
        },
        datagrip: {
            ideKind: "jetbrains",
            displayName: "DataGrip",
            processKeywordsMac: ["DataGrip"],
            processKeywordsWindows: ["datagrip64.exe"],
            processKeywordsLinux: ["datagrip"]
        },
        appcode: {
            ideKind: "jetbrains",
            displayName: "AppCode",
            processKeywordsMac: ["AppCode"],
            processKeywordsWindows: ["appcode.exe"],
            processKeywordsLinux: ["appcode"]
        },
        dataspell: {
            ideKind: "jetbrains",
            displayName: "DataSpell",
            processKeywordsMac: ["DataSpell"],
            processKeywordsWindows: ["dataspell64.exe"],
            processKeywordsLinux: ["dataspell"]
        },
        aqua: {
            ideKind: "jetbrains",
            displayName: "Aqua",
            processKeywordsMac: [],
            processKeywordsWindows: ["aqua64.exe"],
            processKeywordsLinux: []
        },
        gateway: {
            ideKind: "jetbrains",
            displayName: "Gateway",
            processKeywordsMac: [],
            processKeywordsWindows: ["gateway64.exe"],
            processKeywordsLinux: []
        },
        fleet: {
            ideKind: "jetbrains",
            displayName: "Fleet",
            processKeywordsMac: [],
            processKeywordsWindows: ["fleet.exe"],
            processKeywordsLinux: []
        },
        androidstudio: {
            ideKind: "jetbrains",
            displayName: "Android Studio",
            processKeywordsMac: ["Android Studio"],
            processKeywordsWindows: ["studio64.exe"],
            processKeywordsLinux: ["android-studio"]
        }
    };
    Qb1 = KA(() => {
        return f$6(xA.terminal)
    }), gb1 = KA(() => {
        return Oh(lV.terminal)
    }), bX = KA(() => {
        return Qb1() || gb1() || Boolean(process.env.FORCE_CODE_TERMINAL)
    });
    YD9 = tX9(import.meta.url), Fww = Z$6(YD9, "../");
    Rx7 = {
        code: "VS Code",
        cursor: "Cursor",
        windsurf: "Windsurf",
        antigravity: "Antigravity",
        vi: "Vim",
        vim: "Vim",
        nano: "nano",
        notepad: "Notepad",
        "start /wait notepad": "Notepad",
        emacs: "Emacs",
        subl: "Sublime Text",
        atom: "Atom"
    };
    Qx7 = KA(async (A, q) => {
        if (process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE) return process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE;
        if (eA() !== "wsl" || !A) return "127.0.0.1";
        try {
            let K = await XY("ip route show | grep -i default", {
                shell: !0,
                reject: !1
            });
            if (K.exitCode === 0 && K.stdout) {
                let Y = K.stdout.match(/default via (\d+\.\d+\.\d+\.\d+)/);
                if (Y) {
                    let z = Y[1];
                    if (await OXA(z, q)) return z
                }
            }
        } catch (K) {}
        return "127.0.0.1"
    })
})
// @from(Ln 217439, Col 0)
function JD9() {
    let A = mL6();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
    if (!q) return z61(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return h(`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`, {
        level: "error"
    }), z61(null), null;
    try {
        let Y = b1(),
            z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            w = Y.readFileSync(z, {
                encoding: "utf8"
            }).trim();
        if (!w) return h("File descriptor contained empty token", {
            level: "error"
        }), z61(null), null;
        return h(`Successfully read token from file descriptor ${K}`), z61(w), w
    } catch (Y) {
        return h(`Failed to read token from file descriptor ${K}: ${Y instanceof Error?Y.message:String(Y)}`, {
            level: "error"
        }), z61(null), null
    }
}
// @from(Ln 217465, Col 0)
function nV() {
    let A = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
    if (A) return A;
    return JD9()
}
// @from(Ln 217470, Col 4)
Oa = v(() => {
    Z6();
    _8();
    B6()
})
// @from(Ln 217476, Col 0)
function gx7(A) {
    v$6 = A
}
// @from(Ln 217480, Col 0)
function jXA() {
    v$6 = null
}
// @from(Ln 217484, Col 0)
function Ux7() {
    v$6?.()
}
// @from(Ln 217488, Col 0)
function px7() {
    return v$6 !== null
}
// @from(Ln 217491, Col 4)
v$6 = null
// @from(Ln 217493, Col 0)
function XD9(A) {
    let q = A,
        K = "",
        Y = 0,
        z = 10;
    while (q !== K && Y < z) K = q, q = q.normalize("NFKC"), q = q.replace(/[\p{Cf}\p{Co}\p{Cn}]/gu, ""), q = q.replace(/[\u200B-\u200F]/g, "").replace(/[\u202A-\u202E]/g, "").replace(/[\u2066-\u2069]/g, "").replace(/[\uFEFF]/g, "").replace(/[\uE000-\uF8FF]/g, ""), Y++;
    if (Y >= z) throw Error(`Unicode sanitization reached maximum iterations (${z}) for input: ${A.slice(0,100)}`);
    return q
}
// @from(Ln 217503, Col 0)
function _a(A) {
    if (typeof A === "string") return XD9(A);
    if (Array.isArray(A)) return A.map(_a);
    if (A !== null && typeof A === "object") {
        let q = {};
        for (let [K, Y] of Object.entries(A)) q[_a(K)] = _a(Y);
        return q
    }
    return A
}
// @from(Ln 217514, Col 0)
function E$6() {
    return parseInt(process.env.MAX_MCP_OUTPUT_TOKENS ?? "25000", 10)
}
// @from(Ln 217518, Col 0)
function cx7(A) {
    return A.type === "text"
}
// @from(Ln 217522, Col 0)
function lx7(A) {
    return A.type === "image"
}
// @from(Ln 217526, Col 0)
function MXA(A) {
    if (!A) return 0;
    if (typeof A === "string") return A2(A);
    return A.reduce((q, K) => {
        if (cx7(K)) return q + A2(K.text);
        else if (lx7(K)) return q + dx7;
        return q
    }, 0)
}
// @from(Ln 217536, Col 0)
function jD9() {
    return E$6() * 4
}
// @from(Ln 217540, Col 0)
function MD9() {
    return `

[OUTPUT TRUNCATED - exceeded ${E$6()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`
}
// @from(Ln 217548, Col 0)
function PD9(A, q) {
    if (A.length <= q) return A;
    return A.slice(0, q)
}
// @from(Ln 217552, Col 0)
async function WD9(A, q) {
    let K = [],
        Y = 0;
    for (let z of A)
        if (cx7(z)) {
            let w = q - Y;
            if (w <= 0) break;
            if (z.text.length <= w) K.push(z), Y += z.text.length;
            else {
                K.push({
                    type: "text",
                    text: z.text.slice(0, w)
                });
                break
            }
        } else if (lx7(z)) {
        let w = dx7 * 4;
        if (Y + w <= q) K.push(z), Y += w;
        else {
            let H = q - Y;
            if (H > 0) {
                let $ = Math.floor(H * 0.75);
                try {
                    let O = await tT7(z, $);
                    if (K.push(O), O.source.type === "base64") Y += O.source.data.length;
                    else Y += w
                } catch {}
            }
        }
    } else K.push(z);
    return K
}
// @from(Ln 217584, Col 0)
async function pb1(A) {
    if (!A) return !1;
    if (MXA(A) <= E$6() * DD9) return !1;
    try {
        let Y = await hx1(typeof A === "string" ? [{
            role: "user",
            content: A
        }] : [{
            role: "user",
            content: A
        }], []);
        return !!(Y && Y > E$6())
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), !1
    }
}
// @from(Ln 217600, Col 0)
async function GD9(A) {
    if (!A) return A;
    let q = jD9(),
        K = MD9();
    if (typeof A === "string") return PD9(A, q) + K;
    else {
        let Y = await WD9(A, q);
        return Y.push({
            type: "text",
            text: K
        }), Y
    }
}
// @from(Ln 217613, Col 0)
async function PXA(A) {
    if (!await pb1(A)) return A;
    return await GD9(A)
}
// @from(Ln 217617, Col 4)
DD9 = 0.5
// @from(Ln 217618, Col 4)
dx7 = 1600
// @from(Ln 217619, Col 4)
k$6 = v(() => {
    vv();
    y6();
    dL()
})
// @from(Ln 217625, Col 0)
function L$6(A, q) {
    switch (A) {
        case "toolResult":
            return "Plain text";
        case "structuredContent":
            return q ? `JSON with schema: ${q}` : "JSON";
        case "contentArray":
            return q ? `JSON array with schema: ${q}` : "JSON array"
    }
}
// @from(Ln 217636, Col 0)
function R$6(A, q, K, Y) {
    let z = `Error: result (${q.toLocaleString()} characters) exceeds maximum allowed tokens. Output has been saved to ${A}.
Format: ${K}
Use offset and limit parameters to read specific portions of the file, the ${s9} tool to search for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
- You MUST read the content from the file at ${A} in sequential chunks until 100% of the content has been read.
`,
        w = Y ? `- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${Y.toLocaleString()} chars.
` : `- If you receive truncation warnings when reading the file, reduce the chunk size until you have read 100% of the content without truncation.
`,
        H = `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`;
    return z + w + `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`
}
// @from(Ln 217651, Col 4)
WXA = v(() => {
    DW()
})
// @from(Ln 217658, Col 0)
function db1() {
    return ix7.getStore()
}
// @from(Ln 217662, Col 0)
function p01(A, q) {
    return ix7.run(A, q)
}
// @from(Ln 217666, Col 0)
function fD9(A) {
    return A?.agentType === "subagent"
}
// @from(Ln 217670, Col 0)
function nx7() {
    let A = db1();
    if (!fD9(A) || !A.subagentName) return;
    return A.isBuiltIn ? A.subagentName : "user-defined"
}
// @from(Ln 217675, Col 4)
ix7
// @from(Ln 217676, Col 4)
d01 = v(() => {
    S9();
    ix7 = new ZD9
})
// @from(Ln 217684, Col 0)
function AK(A) {
    if (A.startsWith("mcp__")) return "mcp_tool";
    return A
}
// @from(Ln 217689, Col 0)
function rx7() {
    return J6(process.env.OTEL_LOG_TOOL_DETAILS)
}
// @from(Ln 217693, Col 0)
function vB() {
    return J6(process.env.ANALYTICS_LOG_TOOL_DETAILS)
}
// @from(Ln 217697, Col 0)
function Jh(A) {
    if (!A.startsWith("mcp__")) return;
    let q = A.split("__");
    if (q.length < 3) return;
    let K = q[1],
        Y = q.slice(2).join("__");
    if (!K || !Y) return;
    return {
        serverName: K,
        mcpToolName: Y
    }
}
// @from(Ln 217710, Col 0)
function ox7(A, q) {
    if (A !== "Skill") return;
    if (typeof q === "object" && q !== null && "skill" in q && typeof q.skill === "string") return q.skill;
    return
}
// @from(Ln 217716, Col 0)
function cb1(A) {
    let q = VD9(A).toLowerCase();
    if (!q || q === ".") return;
    let K = q.slice(1);
    if (K.length > vD9) return "other";
    return K
}
// @from(Ln 217724, Col 0)
function ax7(A, q) {
    if (!A.includes(".") && !q) return;
    let K, Y = new Set;
    if (q) {
        let z = cb1(q);
        if (z) Y.add(z), K = z
    }
    for (let z of A.split(kD9)) {
        if (!z) continue;
        let w = z.split(LD9);
        if (w.length < 2) continue;
        let H = w[0],
            $ = H.lastIndexOf("/"),
            O = $ >= 0 ? H.slice($ + 1) : H;
        if (!ED9.has(O)) continue;
        for (let _ = 1; _ < w.length; _++) {
            let J = w[_];
            if (J.charCodeAt(0) === 45) continue;
            let X = cb1(J);
            if (X && !Y.has(X)) Y.add(X), K = K ? K + "," + X : X
        }
    }
    if (!K) return;
    return K
}
// @from(Ln 217750, Col 0)
function RD9() {
    let A = db1();
    if (A) {
        let $ = {
            agentId: A.agentId,
            parentSessionId: A.parentSessionId,
            agentType: A.agentType
        };
        if (A.agentType === "teammate") $.teamName = A.teamName;
        return $
    }
    let q = ID(),
        K = Dr(),
        Y = i3(),
        w = Dz() ? "teammate" : q ? "standalone" : void 0;
    if (q || w || K || Y) return {
        ...q ? {
            agentId: q
        } : {},
        ...w ? {
            agentType: w
        } : {},
        ...K ? {
            parentSessionId: K
        } : {},
        ...Y ? {
            teamName: Y
        } : {}
    };
    let H = jL6();
    if (H) return {
        parentSessionId: H
    };
    return {}
}
// @from(Ln 217786, Col 0)
function SD9() {
    return
}
// @from(Ln 217789, Col 0)
async function c01(A = {}) {
    let q = A.model ? String(A.model) : l3(),
        K = vT(q),
        Y = await CD9(),
        z = SD9();
    return {
        model: q,
        sessionId: U6(),
        userType: "external",
        ...K.length > 0 ? {
            betas: K.join(",")
        } : {},
        envContext: Y,
        ...process.env.CLAUDE_CODE_ENTRYPOINT && {
            entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT
        },
        ...process.env.CLAUDE_AGENT_SDK_VERSION && {
            agentSdkVersion: process.env.CLAUDE_AGENT_SDK_VERSION
        },
        isInteractive: String(wQ()),
        clientType: ON1(),
        ...z && {
            processMetrics: z
        },
        sweBenchRunId: process.env.SWE_BENCH_RUN_ID || "",
        sweBenchInstanceId: process.env.SWE_BENCH_INSTANCE_ID || "",
        sweBenchTaskId: process.env.SWE_BENCH_TASK_ID || "",
        ...RD9(),
        ...dK() && {
            subscriptionType: dK()
        }
    }
}
// @from(Ln 217823, Col 0)
function sx7(A, q = {}) {
    let {
        envContext: K,
        processMetrics: Y,
        ...z
    } = A;
    return {
        ...q,
        ...z,
        env: K,
        ...Y && {
            process: Y
        },
        surface: TD9
    }
}
// @from(Ln 217840, Col 0)
function tx7(A, q, K = {}) {
    let {
        envContext: Y,
        processMetrics: z,
        ...w
    } = A, H = {
        platform: Y.platform,
        arch: Y.arch,
        node_version: Y.nodeVersion,
        terminal: Y.terminal || "unknown",
        package_managers: Y.packageManagers,
        runtimes: Y.runtimes,
        is_running_with_bun: Y.isRunningWithBun,
        is_ci: Y.isCi,
        is_claubbit: Y.isClaubbit,
        is_claude_code_remote: Y.isClaudeCodeRemote,
        is_local_agent_mode: Y.isLocalAgentMode,
        is_conductor: Y.isConductor,
        is_github_action: Y.isGithubAction,
        is_claude_code_action: Y.isClaudeCodeAction,
        is_claude_ai_auth: Y.isClaudeAiAuth,
        version: Y.version,
        build_time: Y.buildTime,
        deployment_environment: Y.deploymentEnvironment
    };
    if (Y.remoteEnvironmentType) H.remote_environment_type = Y.remoteEnvironmentType;
    if (Y.claudeCodeContainerId) H.claude_code_container_id = Y.claudeCodeContainerId;
    if (Y.claudeCodeRemoteSessionId) H.claude_code_remote_session_id = Y.claudeCodeRemoteSessionId;
    if (Y.tags) H.tags = Y.tags.split(",").map((O) => O.trim()).filter(Boolean);
    if (Y.githubEventName) H.github_event_name = Y.githubEventName;
    if (Y.githubActionsRunnerEnvironment) H.github_actions_runner_environment = Y.githubActionsRunnerEnvironment;
    if (Y.githubActionsRunnerOs) H.github_actions_runner_os = Y.githubActionsRunnerOs;
    if (Y.githubActionRef) H.github_action_ref = Y.githubActionRef;
    if (Y.wslVersion) H.wsl_version = Y.wslVersion;
    if (Y.versionBase) H.version_base = Y.versionBase;
    let $ = {
        session_id: w.sessionId,
        model: w.model,
        user_type: w.userType,
        is_interactive: w.isInteractive === "true",
        client_type: w.clientType
    };
    if (w.betas) $.betas = w.betas;
    if (w.entrypoint) $.entrypoint = w.entrypoint;
    if (w.agentSdkVersion) $.agent_sdk_version = w.agentSdkVersion;
    if (w.sweBenchRunId) $.swe_bench_run_id = w.sweBenchRunId;
    if (w.sweBenchInstanceId) $.swe_bench_instance_id = w.sweBenchInstanceId;
    if (w.sweBenchTaskId) $.swe_bench_task_id = w.sweBenchTaskId;
    if (w.agentId) $.agent_id = w.agentId;
    if (w.parentSessionId) $.parent_session_id = w.parentSessionId;
    if (w.agentType) $.agent_type = w.agentType;
    if (w.teamName) $.team_name = w.teamName;
    if (q.githubActionsMetadata) {
        let O = q.githubActionsMetadata;
        H.github_actions_metadata = {
            actor_id: O.actorId,
            repository_id: O.repositoryId,
            repository_owner_id: O.repositoryOwnerId
        }
    }
    return {
        env: H,
        ...z && {
            process: Q1(z)
        },
        core: $,
        additional: K
    }
}
// @from(Ln 217909, Col 4)
TD9 = "claude-code"
// @from(Ln 217910, Col 4)
vD9 = 10
// @from(Ln 217911, Col 4)
ED9
// @from(Ln 217911, Col 9)
kD9
// @from(Ln 217911, Col 14)
LD9
// @from(Ln 217911, Col 19)
yD9
// @from(Ln 217911, Col 24)
CD9
// @from(Ln 217911, Col 29)
y$6 = null
// @from(Ln 217912, Col 4)
GXA = null
// @from(Ln 217913, Col 4)
U$ = v(() => {
    zq();
    G5();
    $a();
    Wk();
    e7();
    B6();
    hA();
    J7();
    x3();
    d01();
    m6();
    Cz();
    ED9 = new Set(["rm", "mv", "cp", "touch", "mkdir", "chmod", "chown", "cat", "head", "tail", "sort", "stat", "diff", "wc", "grep", "rg", "sed"]), kD9 = /\s*(?:&&|\|\||[;|])\s*/, LD9 = /\s+/;
    yD9 = KA(() => {
        let A = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION.match(/^\d+\.\d+\.\d+(?:-[a-z]+)?/);
        return A ? A[0] : void 0
    }), CD9 = KA(async () => {
        let [A, q] = await Promise.all([xA.getPackageManagers(), xA.getRuntimes()]);
        return {
            platform: xA.platform,
            arch: xA.arch,
            nodeVersion: xA.nodeVersion,
            terminal: lV.terminal,
            packageManagers: A.join(","),
            runtimes: q.join(","),
            isRunningWithBun: xA.isRunningWithBun(),
            isCi: J6(!1),
            isClaubbit: J6(process.env.CLAUBBIT),
            isClaudeCodeRemote: J6(process.env.CLAUDE_CODE_REMOTE),
            isLocalAgentMode: process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent",
            isConductor: xA.isConductor(),
            ...process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE && {
                remoteEnvironmentType: process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE
            },
            ...{},
            ...process.env.CLAUDE_CODE_CONTAINER_ID && {
                claudeCodeContainerId: process.env.CLAUDE_CODE_CONTAINER_ID
            },
            ...process.env.CLAUDE_CODE_REMOTE_SESSION_ID && {
                claudeCodeRemoteSessionId: process.env.CLAUDE_CODE_REMOTE_SESSION_ID
            },
            ...process.env.CLAUDE_CODE_TAGS && {
                tags: process.env.CLAUDE_CODE_TAGS
            },
            isGithubAction: J6(process.env.GITHUB_ACTIONS),
            isClaudeCodeAction: J6(process.env.CLAUDE_CODE_ACTION),
            isClaudeAiAuth: i8(),
            version: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION,
            versionBase: yD9(),
            buildTime: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.BUILD_TIME,
            deploymentEnvironment: xA.detectDeploymentEnvironment(),
            ...J6(process.env.GITHUB_ACTIONS) && {
                githubEventName: process.env.GITHUB_EVENT_NAME,
                githubActionsRunnerEnvironment: process.env.RUNNER_ENVIRONMENT,
                githubActionsRunnerOs: process.env.RUNNER_OS,
                githubActionRef: process.env.GITHUB_ACTION_PATH?.includes("claude-code-action/") ? process.env.GITHUB_ACTION_PATH.split("claude-code-action/")[1] : void 0
            },
            ...g61() && {
                wslVersion: g61()
            }
        }
    })
})
// @from(Ln 218007, Col 0)
function bD9() {
    return ZXA(fJ(y8()), U6())
}
// @from(Ln 218011, Col 0)
function l01() {
    return ZXA(bD9(), fXA)
}
// @from(Ln 218014, Col 0)
async function uD9() {
    try {
        await hD9(l01(), {
            recursive: !0
        })
    } catch {}
}
// @from(Ln 218021, Col 0)
async function uq1(A, q) {
    let K = Array.isArray(A);
    if (K) {
        if (A.some((J) => J.type !== "text")) return {
            error: "Cannot persist tool results containing non-text content"
        }
    }
    await uD9();
    let Y = K ? "json" : "txt",
        z = ZXA(l01(), `${q}.${Y}`),
        w = K ? Q1(A, null, 2) : A,
        H = !1;
    try {
        await xD9(z), H = !0
    } catch {}
    if (!H) {
        try {
            await ID9(z, w, "utf-8")
        } catch (_) {
            let J = _ instanceof Error ? _ : Error(String(_));
            return K1(J), {
                error: QD9(J)
            }
        }
        h(`Persisted tool result to ${z} (${L2(w.length)})`)
    }
    let {
        preview: $,
        hasMore: O
    } = FD9(w, ex7);
    return {
        filepath: z,
        originalSize: w.length,
        isJson: K,
        preview: $,
        hasMore: O
    }
}
// @from(Ln 218060, Col 0)
function BD9(A) {
    let q = `${C$6}
`;
    return q += `Output too large (${L2(A.originalSize)}). Full output saved to: ${A.filepath}

`, q += `Preview (first ${L2(ex7)}):
`, q += A.preview, q += A.hasMore ? `
...
` : `
`, q += VXA, q
}
// @from(Ln 218071, Col 0)
async function S$6(A, q, K) {
    let Y = A.mapToolResultToToolResultBlockParam(q, K);
    return mD9(Y, A.name, Math.min(A.maxResultSizeChars, $R7))
}
// @from(Ln 218075, Col 0)
async function mD9(A, q, K) {
    let Y = A.content;
    if (!Y) return A;
    if (Array.isArray(Y)) {
        if (Y.some((_) => typeof _ === "object" && ("type" in _) && _.type === "image")) return A
    }
    if ((typeof Y === "string" ? Y.length : Q1(Y).length) <= (K ?? px1)) return A;
    let H = await uq1(Y, A.tool_use_id);
    if (Bq1(H)) return A;
    let $ = BD9(H);
    return c("tengu_tool_result_persisted", {
        toolName: AK(q),
        originalSizeBytes: H.originalSize,
        persistedSizeBytes: $.length,
        estimatedOriginalTokens: Math.ceil(H.originalSize / LOA),
        estimatedPersistedTokens: Math.ceil($.length / LOA)
    }), {
        ...A,
        content: $
    }
}
// @from(Ln 218097, Col 0)
function FD9(A, q) {
    if (A.length <= q) return {
        preview: A,
        hasMore: !1
    };
    let Y = A.slice(0, q).lastIndexOf(`
`),
        z = Y > q * 0.5 ? Y : q;
    return {
        preview: A.slice(0, z),
        hasMore: !0
    }
}
// @from(Ln 218111, Col 0)
function Bq1(A) {
    return "error" in A
}
// @from(Ln 218115, Col 0)
function QD9(A) {
    let q = A;
    if (q.code) switch (q.code) {
        case "ENOENT":
            return `Directory not found: ${q.path??"unknown path"}`;
        case "EACCES":
            return `Permission denied: ${q.path??"unknown path"}`;
        case "ENOSPC":
            return "No space left on device";
        case "EROFS":
            return "Read-only file system";
        case "EMFILE":
            return "Too many open files";
        case "EEXIST":
            return `File already exists: ${q.path??"unknown path"}`;
        default:
            return `${q.code}: ${q.message}`
    }
    return A.message
}
// @from(Ln 218135, Col 4)
fXA = "tool-results"
// @from(Ln 218136, Col 4)
C$6 = "<persisted-output>"
// @from(Ln 218137, Col 4)
VXA = "</persisted-output>"
// @from(Ln 218138, Col 4)
NXA = "[Old tool result content cleared]"
// @from(Ln 218139, Col 4)
ex7 = 2000
// @from(Ln 218140, Col 4)
Pp = v(() => {
    Z6();
    y6();
    wq();
    u6();
    U$();
    B6();
    lq();
    m6()
})
// @from(Ln 218151, Col 0)
function i01(A) {
    let q = [];
    return {
        expanded: A.replace(/\$\{([^}]+)\}/g, (Y, z) => {
            let [w, H] = z.split(":-", 2), $ = process.env[w];
            if ($ !== void 0) return $;
            if (H !== void 0) return H;
            return q.push(w), Y
        }),
        missingVars: q
    }
}
// @from(Ln 218167, Col 0)
function pD9() {
    if (JN1()) return Ab7;
    if (J6(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS)) return Ab7;
    return UD9
}
// @from(Ln 218173, Col 0)
function Lv() {
    return gD9(O8(), pD9())
}
// @from(Ln 218176, Col 4)
UD9 = "plugins"
// @from(Ln 218177, Col 4)
Ab7 = "cowork_plugins"
// @from(Ln 218178, Col 4)
lb1 = v(() => {
    hA();
    B6()
})
// @from(Ln 218182, Col 0)
async function dD9(A) {
    try {
        return !!await mf(A)
    } catch {
        return !1
    }
}
// @from(Ln 218189, Col 4)
h$6
// @from(Ln 218190, Col 4)
TXA = v(() => {
    zq();
    WQ();
    h$6 = KA(async () => {
        return dD9("git")
    })
})
// @from(Ln 218198, Col 0)
function n01(A, q) {
    let Y = A.slice(0, 2).map((H) => {
            let $ = H.reason || H.error || "unknown error";
            return q ? `${H.name} (${$})` : H.name
        }).join(q ? "; " : ", "),
        z = A.length - 2,
        w = z > 0 ? ` and ${z} more` : "";
    return `${Y}${w}`
}
// @from(Ln 218208, Col 0)
function ib1(A) {
    switch (A.source) {
        case "github":
            return A.repo;
        case "url":
            return A.url;
        case "git":
            return A.url;
        case "directory":
            return A.path;
        case "file":
            return A.path;
        default:
            return "Unknown source"
    }
}
// @from(Ln 218225, Col 0)
function EB(A, q) {
    return `${A}@${q}`
}
// @from(Ln 218228, Col 0)
async function Wp(A) {
    let q = [],
        K = [];
    for (let [Y, z] of Object.entries(A)) {
        if (!Fq1(z.source)) continue;
        let w = null;
        try {
            w = await NZ(Y)
        } catch (H) {
            let $ = H instanceof Error ? H.message : String(H);
            K.push({
                name: Y,
                error: $
            }), K1(H instanceof Error ? H : Error(`Failed to load marketplace ${Y}: ${H}`))
        }
        q.push({
            name: Y,
            config: z,
            data: w
        })
    }
    return {
        marketplaces: q,
        failures: K
    }
}
// @from(Ln 218255, Col 0)
function r01(A, q) {
    if (A.length === 0) return null;
    if (q > 0) return {
        type: "warning",
        message: A.length === 1 ? `Warning: Failed to load marketplace '${A[0].name}': ${A[0].error}` : `Warning: Failed to load ${A.length} marketplaces: ${cD9(A)}`
    };
    return {
        type: "error",
        message: `Failed to load all marketplaces. Errors: ${lD9(A)}`
    }
}
// @from(Ln 218267, Col 0)
function cD9(A) {
    return A.map((q) => q.name).join(", ")
}
// @from(Ln 218271, Col 0)
function lD9(A) {
    return A.map((q) => `${q.name}: ${q.error}`).join("; ")
}
// @from(Ln 218275, Col 0)
function mq1() {
    let A = y7("policySettings");
    if (!A?.strictKnownMarketplaces) return null;
    return A.strictKnownMarketplaces
}
// @from(Ln 218281, Col 0)
function iD9() {
    let A = y7("policySettings");
    if (!A?.blockedMarketplaces) return null;
    return A.blockedMarketplaces
}
// @from(Ln 218287, Col 0)
function nD9(A, q) {
    if (A.source !== q.source) return !1;
    switch (A.source) {
        case "url":
            return A.url === q.url;
        case "github":
            return A.repo === q.repo && (A.ref || void 0) === (q.ref || void 0) && (A.path || void 0) === (q.path || void 0);
        case "git":
            return A.url === q.url && (A.ref || void 0) === (q.ref || void 0) && (A.path || void 0) === (q.path || void 0);
        case "npm":
            return A.package === q.package;
        case "file":
            return A.path === q.path;
        case "directory":
            return A.path === q.path;
        default:
            return !1
    }
}
// @from(Ln 218307, Col 0)
function vXA(A) {
    switch (A.source) {
        case "github":
            return "github.com";
        case "git": {
            let q = A.url.match(/^[^@]+@([^:]+):/);
            if (q?.[1]) return q[1];
            try {
                return new URL(A.url).hostname
            } catch {
                return null
            }
        }
        case "url":
            try {
                return new URL(A.url).hostname
            } catch {
                return null
            }
        default:
            return null
    }
}
// @from(Ln 218331, Col 0)
function rD9(A, q) {
    let K = vXA(A);
    if (!K) return !1;
    try {
        return new RegExp(q.hostPattern).test(K)
    } catch {
        return K1(Error(`Invalid hostPattern regex: ${q.hostPattern}`)), !1
    }
}
// @from(Ln 218341, Col 0)
function Kb7() {
    let A = mq1();
    if (!A) return [];
    return A.filter((q) => q.source === "hostPattern").map((q) => q.hostPattern)
}
// @from(Ln 218347, Col 0)
function qb7(A) {
    let q = A.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/);
    if (q && q[1]) return q[1];
    let K = A.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/);
    if (K && K[1]) return K[1];
    return null
}
// @from(Ln 218355, Col 0)
function Ja(A, q) {
    if (!A) return !0;
    return (A || void 0) === (q || void 0)
}