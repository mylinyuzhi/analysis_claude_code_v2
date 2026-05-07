
// @from(Ln 222503, Col 4)
Je6 = L(() => {
    p7();
    bf = _31().superRefine((q, K) => {
        if (!URL.canParse(q)) return K.addIssue({
            code: h31.custom,
            message: "URL must be parseable",
            fatal: !0
        }), RF6
    }).refine((q) => {
        let K = new URL(q);
        return K.protocol !== "javascript:" && K.protocol !== "data:" && K.protocol !== "vbscript:"
    }, {
        message: "URL cannot use javascript:, data:, or vbscript: scheme"
    }), EW4 = KP({
        resource: O1().url(),
        authorization_servers: _4(bf).optional(),
        jwks_uri: O1().url().optional(),
        scopes_supported: _4(O1()).optional(),
        bearer_methods_supported: _4(O1()).optional(),
        resource_signing_alg_values_supported: _4(O1()).optional(),
        resource_name: O1().optional(),
        resource_documentation: O1().optional(),
        resource_policy_uri: O1().url().optional(),
        resource_tos_uri: O1().url().optional(),
        tls_client_certificate_bound_access_tokens: Xw().optional(),
        authorization_details_types_supported: _4(O1()).optional(),
        dpop_signing_alg_values_supported: _4(O1()).optional(),
        dpop_bound_access_tokens_required: Xw().optional()
    }), He6 = KP({
        issuer: O1(),
        authorization_endpoint: bf,
        token_endpoint: bf,
        registration_endpoint: bf.optional(),
        scopes_supported: _4(O1()).optional(),
        response_types_supported: _4(O1()),
        response_modes_supported: _4(O1()).optional(),
        grant_types_supported: _4(O1()).optional(),
        token_endpoint_auth_methods_supported: _4(O1()).optional(),
        token_endpoint_auth_signing_alg_values_supported: _4(O1()).optional(),
        service_documentation: bf.optional(),
        revocation_endpoint: bf.optional(),
        revocation_endpoint_auth_methods_supported: _4(O1()).optional(),
        revocation_endpoint_auth_signing_alg_values_supported: _4(O1()).optional(),
        introspection_endpoint: O1().optional(),
        introspection_endpoint_auth_methods_supported: _4(O1()).optional(),
        introspection_endpoint_auth_signing_alg_values_supported: _4(O1()).optional(),
        code_challenge_methods_supported: _4(O1()).optional(),
        client_id_metadata_document_supported: Xw().optional()
    }), yqz = KP({
        issuer: O1(),
        authorization_endpoint: bf,
        token_endpoint: bf,
        userinfo_endpoint: bf.optional(),
        jwks_uri: bf,
        registration_endpoint: bf.optional(),
        scopes_supported: _4(O1()).optional(),
        response_types_supported: _4(O1()),
        response_modes_supported: _4(O1()).optional(),
        grant_types_supported: _4(O1()).optional(),
        acr_values_supported: _4(O1()).optional(),
        subject_types_supported: _4(O1()),
        id_token_signing_alg_values_supported: _4(O1()),
        id_token_encryption_alg_values_supported: _4(O1()).optional(),
        id_token_encryption_enc_values_supported: _4(O1()).optional(),
        userinfo_signing_alg_values_supported: _4(O1()).optional(),
        userinfo_encryption_alg_values_supported: _4(O1()).optional(),
        userinfo_encryption_enc_values_supported: _4(O1()).optional(),
        request_object_signing_alg_values_supported: _4(O1()).optional(),
        request_object_encryption_alg_values_supported: _4(O1()).optional(),
        request_object_encryption_enc_values_supported: _4(O1()).optional(),
        token_endpoint_auth_methods_supported: _4(O1()).optional(),
        token_endpoint_auth_signing_alg_values_supported: _4(O1()).optional(),
        display_values_supported: _4(O1()).optional(),
        claim_types_supported: _4(O1()).optional(),
        claims_supported: _4(O1()).optional(),
        service_documentation: O1().optional(),
        claims_locales_supported: _4(O1()).optional(),
        ui_locales_supported: _4(O1()).optional(),
        claims_parameter_supported: Xw().optional(),
        request_parameter_supported: Xw().optional(),
        request_uri_parameter_supported: Xw().optional(),
        require_request_uri_registration: Xw().optional(),
        op_policy_uri: bf.optional(),
        op_tos_uri: bf.optional(),
        client_id_metadata_document_supported: Xw().optional()
    }), GR8 = G4({
        ...yqz.shape,
        ...He6.pick({
            code_challenge_methods_supported: !0
        }).shape
    }), vR8 = G4({
        access_token: O1(),
        id_token: O1().optional(),
        token_type: O1(),
        expires_in: Zg6.number().optional(),
        scope: O1().optional(),
        refresh_token: O1().optional()
    }).strip(), TR8 = G4({
        error: O1(),
        error_description: O1().optional(),
        error_uri: O1().optional()
    }), NW4 = bf.optional().or(RK("").transform(() => {
        return
    })), Lqz = G4({
        redirect_uris: _4(bf),
        token_endpoint_auth_method: O1().optional(),
        grant_types: _4(O1()).optional(),
        response_types: _4(O1()).optional(),
        client_name: O1().optional(),
        client_uri: bf.optional(),
        logo_uri: NW4,
        scope: O1().optional(),
        contacts: _4(O1()).optional(),
        tos_uri: NW4,
        policy_uri: O1().optional(),
        jwks_uri: bf.optional(),
        jwks: G31().optional(),
        software_id: O1().optional(),
        software_version: O1().optional(),
        software_statement: O1().optional()
    }).strip(), hqz = G4({
        client_id: O1(),
        client_secret: O1().optional(),
        client_id_issued_at: GY().optional(),
        client_secret_expires_at: GY().optional()
    }).strip(), yW4 = Lqz.merge(hqz), f0w = G4({
        error: O1(),
        error_description: O1().optional()
    }).strip(), G0w = G4({
        token: O1(),
        token_type_hint: O1().optional()
    }).strip()
})
// @from(Ln 222637, Col 0)
function LW4(q) {
    let K = typeof q === "string" ? new URL(q) : new URL(q.href);
    return K.hash = "", K
}
// @from(Ln 222642, Col 0)
function hW4({
    requestedResource: q,
    configuredResource: K
}) {
    let _ = typeof q === "string" ? new URL(q) : new URL(q.href),
        z = typeof K === "string" ? new URL(K) : new URL(K.href);
    if (_.origin !== z.origin) return !1;
    if (_.pathname.length < z.pathname.length) return !1;
    let Y = _.pathname.endsWith("/") ? _.pathname : _.pathname + "/",
        A = z.pathname.endsWith("/") ? z.pathname : z.pathname + "/";
    return Y.startsWith(A)
}
// @from(Ln 222654, Col 4)
XX
// @from(Ln 222654, Col 8)
VR8
// @from(Ln 222654, Col 13)
Sy6
// @from(Ln 222654, Col 18)
RK6
// @from(Ln 222654, Col 23)
Cy6
// @from(Ln 222654, Col 28)
kR8
// @from(Ln 222654, Col 33)
NR8
// @from(Ln 222654, Col 38)
ER8
// @from(Ln 222654, Col 43)
ed
// @from(Ln 222654, Col 47)
by6
// @from(Ln 222654, Col 52)
yR8
// @from(Ln 222654, Col 57)
LR8
// @from(Ln 222654, Col 62)
hR8
// @from(Ln 222654, Col 67)
RR8
// @from(Ln 222654, Col 72)
Iy6
// @from(Ln 222654, Col 77)
xy6
// @from(Ln 222654, Col 82)
SR8
// @from(Ln 222654, Col 87)
CR8
// @from(Ln 222654, Col 92)
RW4
// @from(Ln 222655, Col 4)
cg1 = L(() => {
    XX = class XX extends Error {
        constructor(q, K) {
            super(q);
            this.errorUri = K, this.name = this.constructor.name
        }
        toResponseObject() {
            let q = {
                error: this.errorCode,
                error_description: this.message
            };
            if (this.errorUri) q.error_uri = this.errorUri;
            return q
        }
        get errorCode() {
            return this.constructor.errorCode
        }
    };
    VR8 = class VR8 extends XX {};
    VR8.errorCode = "invalid_request";
    Sy6 = class Sy6 extends XX {};
    Sy6.errorCode = "invalid_client";
    RK6 = class RK6 extends XX {};
    RK6.errorCode = "invalid_grant";
    Cy6 = class Cy6 extends XX {};
    Cy6.errorCode = "unauthorized_client";
    kR8 = class kR8 extends XX {};
    kR8.errorCode = "unsupported_grant_type";
    NR8 = class NR8 extends XX {};
    NR8.errorCode = "invalid_scope";
    ER8 = class ER8 extends XX {};
    ER8.errorCode = "access_denied";
    ed = class ed extends XX {};
    ed.errorCode = "server_error";
    by6 = class by6 extends XX {};
    by6.errorCode = "temporarily_unavailable";
    yR8 = class yR8 extends XX {};
    yR8.errorCode = "unsupported_response_type";
    LR8 = class LR8 extends XX {};
    LR8.errorCode = "unsupported_token_type";
    hR8 = class hR8 extends XX {};
    hR8.errorCode = "invalid_token";
    RR8 = class RR8 extends XX {};
    RR8.errorCode = "method_not_allowed";
    Iy6 = class Iy6 extends XX {};
    Iy6.errorCode = "too_many_requests";
    xy6 = class xy6 extends XX {};
    xy6.errorCode = "invalid_client_metadata";
    SR8 = class SR8 extends XX {};
    SR8.errorCode = "insufficient_scope";
    CR8 = class CR8 extends XX {};
    CR8.errorCode = "invalid_target";
    RW4 = {
        [VR8.errorCode]: VR8,
        [Sy6.errorCode]: Sy6,
        [RK6.errorCode]: RK6,
        [Cy6.errorCode]: Cy6,
        [kR8.errorCode]: kR8,
        [NR8.errorCode]: NR8,
        [ER8.errorCode]: ER8,
        [ed.errorCode]: ed,
        [by6.errorCode]: by6,
        [yR8.errorCode]: yR8,
        [LR8.errorCode]: LR8,
        [hR8.errorCode]: hR8,
        [RR8.errorCode]: RR8,
        [Iy6.errorCode]: Iy6,
        [xy6.errorCode]: xy6,
        [SR8.errorCode]: SR8,
        [CR8.errorCode]: CR8
    }
})
// @from(Ln 222728, Col 0)
function Rqz(q) {
    return ["client_secret_basic", "client_secret_post", "none"].includes(q)
}
// @from(Ln 222732, Col 0)
function Sqz(q, K) {
    let _ = q.client_secret !== void 0;
    if ("token_endpoint_auth_method" in q && q.token_endpoint_auth_method && Rqz(q.token_endpoint_auth_method) && (K.length === 0 || K.includes(q.token_endpoint_auth_method))) return q.token_endpoint_auth_method;
    if (K.length === 0) return _ ? "client_secret_basic" : "none";
    if (_ && K.includes("client_secret_basic")) return "client_secret_basic";
    if (_ && K.includes("client_secret_post")) return "client_secret_post";
    if (K.includes("none")) return "none";
    return _ ? "client_secret_post" : "none"
}
// @from(Ln 222742, Col 0)
function Cqz(q, K, _, z) {
    let {
        client_id: Y,
        client_secret: A
    } = K;
    switch (q) {
        case "client_secret_basic":
            bqz(Y, A, _);
            return;
        case "client_secret_post":
            Iqz(Y, A, z);
            return;
        case "none":
            xqz(Y, z);
            return;
        default:
            throw Error(`Unsupported client authentication method: ${q}`)
    }
}
// @from(Ln 222762, Col 0)
function bqz(q, K, _) {
    if (!K) throw Error("client_secret_basic authentication requires a client_secret");
    let z = btoa(`${q}:${K}`);
    _.set("Authorization", `Basic ${z}`)
}
// @from(Ln 222768, Col 0)
function Iqz(q, K, _) {
    if (_.set("client_id", q), K) _.set("client_secret", K)
}
// @from(Ln 222772, Col 0)
function xqz(q, K) {
    K.set("client_id", q)
}
// @from(Ln 222775, Col 0)
async function CW4(q) {
    let K = q instanceof Response ? q.status : void 0,
        _ = q instanceof Response ? await q.text() : q;
    try {
        let z = TR8.parse(JSON.parse(_)),
            {
                error: Y,
                error_description: A,
                error_uri: O
            } = z;
        return new(RW4[Y] || ed)(A || "", O)
    } catch (z) {
        let Y = `${K?`HTTP ${K}: `:""}Invalid OAuth error response: ${z}. Raw body: ${_}`;
        return new ed(Y)
    }
}
// @from(Ln 222791, Col 0)
async function lI(q, K) {
    try {
        return await ig1(q, K)
    } catch (_) {
        if (_ instanceof Sy6 || _ instanceof Cy6) return await q.invalidateCredentials?.("all"), await ig1(q, K);
        else if (_ instanceof RK6) return await q.invalidateCredentials?.("tokens"), await ig1(q, K);
        throw _
    }
}
// @from(Ln 222800, Col 0)
async function ig1(q, {
    serverUrl: K,
    authorizationCode: _,
    scope: z,
    resourceMetadataUrl: Y,
    fetchFn: A
}) {
    let O = await q.discoveryState?.(),
        w, $, j, H = Y;
    if (!H && O?.resourceMetadataUrl) H = new URL(O.resourceMetadataUrl);
    if (O?.authorizationServerUrl) {
        if ($ = O.authorizationServerUrl, w = O.resourceMetadata, j = O.authorizationServerMetadata ?? await bj6($, {
                fetchFn: A
            }), !w) try {
            w = await bR8(K, {
                resourceMetadataUrl: H
            }, A)
        } catch {}
        if (j !== O.authorizationServerMetadata || w !== O.resourceMetadata) await q.saveDiscoveryState?.({
            authorizationServerUrl: String($),
            resourceMetadataUrl: H?.toString(),
            resourceMetadata: w,
            authorizationServerMetadata: j
        })
    } else {
        let f = await ag1(K, {
            resourceMetadataUrl: H,
            fetchFn: A
        });
        $ = f.authorizationServerUrl, j = f.authorizationServerMetadata, w = f.resourceMetadata, await q.saveDiscoveryState?.({
            authorizationServerUrl: String($),
            resourceMetadataUrl: H?.toString(),
            resourceMetadata: w,
            authorizationServerMetadata: j
        })
    }
    let J = await mqz(K, q, w),
        X = z || w?.scopes_supported?.join(" ") || q.clientMetadata.scope,
        M = await Promise.resolve(q.clientInformation());
    if (!M) {
        if (_ !== void 0) throw Error("Existing OAuth client information is required when exchanging an authorization code");
        let f = j?.client_id_metadata_document_supported === !0,
            v = q.clientMetadataUrl;
        if (v && !uqz(v)) throw new xy6(`clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${v}`);
        if (f && v) M = {
            client_id: v
        }, await q.saveClientInformation?.(M);
        else {
            if (!q.saveClientInformation) throw Error("OAuth client information must be saveable for dynamic registration");
            let k = await Qqz($, {
                metadata: j,
                clientMetadata: q.clientMetadata,
                scope: X,
                fetchFn: A
            });
            await q.saveClientInformation(k), M = k
        }
    }
    let P = !q.redirectUrl;
    if (_ !== void 0 || P) {
        let f = await Uqz(q, $, {
            metadata: j,
            resource: J,
            authorizationCode: _,
            fetchFn: A
        });
        return await q.saveTokens(f), "AUTHORIZED"
    }
    let W = await q.tokens();
    if (W?.refresh_token) try {
        let f = await eg1($, {
            metadata: j,
            clientInformation: M,
            refreshToken: W.refresh_token,
            resource: J,
            addClientAuthentication: q.addClientAuthentication,
            fetchFn: A
        });
        return await q.saveTokens(f), "AUTHORIZED"
    } catch (f) {
        if (!(f instanceof XX) || f instanceof ed);
        else throw f
    }
    let D = q.state ? await q.state() : void 0,
        {
            authorizationUrl: Z,
            codeVerifier: G
        } = await sg1($, {
            metadata: j,
            clientInformation: M,
            state: D,
            redirectUrl: q.redirectUrl,
            scope: X,
            resource: J
        });
    return await q.saveCodeVerifier(G), await q.redirectToAuthorization(Z), "REDIRECT"
}
// @from(Ln 222898, Col 0)
function uqz(q) {
    if (!q) return !1;
    try {
        let K = new URL(q);
        return K.protocol === "https:" && K.pathname !== "/"
    } catch {
        return !1
    }
}
// @from(Ln 222907, Col 0)
async function mqz(q, K, _) {
    let z = LW4(q);
    if (K.validateResourceURL) return await K.validateResourceURL(z, _?.resource);
    if (!_) return;
    if (!hW4({
            requestedResource: z,
            configuredResource: _.resource
        })) throw Error(`Protected resource ${_.resource} does not match expected ${z} (or origin)`);
    return new URL(_.resource)
}
// @from(Ln 222918, Col 0)
function uy6(q) {
    let K = q.headers.get("WWW-Authenticate");
    if (!K) return {};
    let [_, z] = K.split(" ");
    if (_.toLowerCase() !== "bearer" || !z) return {};
    let Y = rg1(q, "resource_metadata") || void 0,
        A;
    if (Y) try {
        A = new URL(Y)
    } catch {}
    let O = rg1(q, "scope") || void 0,
        w = rg1(q, "error") || void 0;
    return {
        resourceMetadataUrl: A,
        scope: O,
        error: w
    }
}
// @from(Ln 222937, Col 0)
function rg1(q, K) {
    let _ = q.headers.get("WWW-Authenticate");
    if (!_) return null;
    let z = new RegExp(`${K}=(?:"([^"]+)"|([^\\s,]+))`),
        Y = _.match(z);
    if (Y) return Y[1] || Y[2];
    return null
}
// @from(Ln 222945, Col 0)
async function bR8(q, K, _ = fetch) {
    let z = await Fqz(q, "oauth-protected-resource", _, {
        protocolVersion: K?.protocolVersion,
        metadataUrl: K?.resourceMetadataUrl
    });
    if (!z || z.status === 404) throw await z?.body?.cancel(), Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
    if (!z.ok) throw await z.body?.cancel(), Error(`HTTP ${z.status} trying to load well-known OAuth protected resource metadata.`);
    return EW4.parse(await z.json())
}
// @from(Ln 222954, Col 0)
async function og1(q, K, _ = fetch) {
    try {
        return await _(q, {
            headers: K
        })
    } catch (z) {
        if (z instanceof TypeError)
            if (K) return og1(q, void 0, _);
            else return;
        throw z
    }
}
// @from(Ln 222967, Col 0)
function Bqz(q, K = "", _ = {}) {
    if (K.endsWith("/")) K = K.slice(0, -1);
    return _.prependPathname ? `${K}/.well-known/${q}` : `/.well-known/${q}${K}`
}
// @from(Ln 222971, Col 0)
async function SW4(q, K, _ = fetch) {
    return await og1(q, {
        "MCP-Protocol-Version": K
    }, _)
}
// @from(Ln 222977, Col 0)
function pqz(q, K) {
    return !q || q.status >= 400 && q.status < 500 && K !== "/"
}
// @from(Ln 222980, Col 0)
async function Fqz(q, K, _, z) {
    let Y = new URL(q),
        A = z?.protocolVersion ?? K16,
        O;
    if (z?.metadataUrl) O = new URL(z.metadataUrl);
    else {
        let $ = Bqz(K, Y.pathname);
        O = new URL($, z?.metadataServerUrl ?? Y), O.search = Y.search
    }
    let w = await SW4(O, A, _);
    if (!z?.metadataUrl && pqz(w, Y.pathname)) {
        let $ = new URL(`/.well-known/${K}`, Y);
        w = await SW4($, A, _)
    }
    return w
}
// @from(Ln 222997, Col 0)
function gqz(q) {
    let K = typeof q === "string" ? new URL(q) : q,
        _ = K.pathname !== "/",
        z = [];
    if (!_) return z.push({
        url: new URL("/.well-known/oauth-authorization-server", K.origin),
        type: "oauth"
    }), z.push({
        url: new URL("/.well-known/openid-configuration", K.origin),
        type: "oidc"
    }), z;
    let Y = K.pathname;
    if (Y.endsWith("/")) Y = Y.slice(0, -1);
    return z.push({
        url: new URL(`/.well-known/oauth-authorization-server${Y}`, K.origin),
        type: "oauth"
    }), z.push({
        url: new URL(`/.well-known/openid-configuration${Y}`, K.origin),
        type: "oidc"
    }), z.push({
        url: new URL(`${Y}/.well-known/openid-configuration`, K.origin),
        type: "oidc"
    }), z
}
// @from(Ln 223021, Col 0)
async function bj6(q, {
    fetchFn: K = fetch,
    protocolVersion: _ = K16
} = {}) {
    let z = {
            "MCP-Protocol-Version": _,
            Accept: "application/json"
        },
        Y = gqz(q);
    for (let {
            url: A,
            type: O
        }
        of Y) {
        let w = await og1(A, z, K);
        if (!w) continue;
        if (!w.ok) {
            if (await w.body?.cancel(), w.status >= 400 && w.status < 500) continue;
            throw Error(`HTTP ${w.status} trying to load ${O==="oauth"?"OAuth":"OpenID provider"} metadata from ${A}`)
        }
        if (O === "oauth") return He6.parse(await w.json());
        else return GR8.parse(await w.json())
    }
    return
}
// @from(Ln 223046, Col 0)
async function ag1(q, K) {
    let _, z;
    try {
        if (_ = await bR8(q, {
                resourceMetadataUrl: K?.resourceMetadataUrl
            }, K?.fetchFn), _.authorization_servers && _.authorization_servers.length > 0) z = _.authorization_servers[0]
    } catch {}
    if (!z) z = String(new URL("/", q));
    let Y = await bj6(z, {
        fetchFn: K?.fetchFn
    });
    return {
        authorizationServerUrl: z,
        authorizationServerMetadata: Y,
        resourceMetadata: _
    }
}
// @from(Ln 223063, Col 0)
async function sg1(q, {
    metadata: K,
    clientInformation: _,
    redirectUrl: z,
    scope: Y,
    state: A,
    resource: O
}) {
    let w;
    if (K) {
        if (w = new URL(K.authorization_endpoint), !K.response_types_supported.includes(lg1)) throw Error(`Incompatible auth server: does not support response type ${lg1}`);
        if (K.code_challenge_methods_supported && !K.code_challenge_methods_supported.includes(ng1)) throw Error(`Incompatible auth server: does not support code challenge method ${ng1}`)
    } else w = new URL("/authorize", q);
    let $ = await dg1(),
        j = $.code_verifier,
        H = $.code_challenge;
    if (w.searchParams.set("response_type", lg1), w.searchParams.set("client_id", _.client_id), w.searchParams.set("code_challenge", H), w.searchParams.set("code_challenge_method", ng1), w.searchParams.set("redirect_uri", String(z)), A) w.searchParams.set("state", A);
    if (Y) w.searchParams.set("scope", Y);
    if (Y?.includes("offline_access")) w.searchParams.append("prompt", "consent");
    if (O) w.searchParams.set("resource", O.href);
    return {
        authorizationUrl: w,
        codeVerifier: j
    }
}
// @from(Ln 223089, Col 0)
function bW4(q, K, _) {
    return new URLSearchParams({
        grant_type: "authorization_code",
        code: q,
        code_verifier: K,
        redirect_uri: String(_)
    })
}
// @from(Ln 223097, Col 0)
async function tg1(q, {
    metadata: K,
    tokenRequestParams: _,
    clientInformation: z,
    addClientAuthentication: Y,
    resource: A,
    fetchFn: O
}) {
    let w = K?.token_endpoint ? new URL(K.token_endpoint) : new URL("/token", q),
        $ = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
        });
    if (A) _.set("resource", A.href);
    if (Y) await Y($, _, w, K);
    else if (z) {
        let H = K?.token_endpoint_auth_methods_supported ?? [],
            J = Sqz(z, H);
        Cqz(J, z, $, _)
    }
    let j = await (O ?? fetch)(w, {
        method: "POST",
        headers: $,
        body: _
    });
    if (!j.ok) throw await CW4(j);
    return vR8.parse(await j.json())
}
// @from(Ln 223125, Col 0)
async function IW4(q, {
    metadata: K,
    clientInformation: _,
    authorizationCode: z,
    codeVerifier: Y,
    redirectUri: A,
    resource: O,
    addClientAuthentication: w,
    fetchFn: $
}) {
    let j = bW4(z, Y, A);
    return tg1(q, {
        metadata: K,
        tokenRequestParams: j,
        clientInformation: _,
        addClientAuthentication: w,
        resource: O,
        fetchFn: $
    })
}
// @from(Ln 223145, Col 0)
async function eg1(q, {
    metadata: K,
    clientInformation: _,
    refreshToken: z,
    resource: Y,
    addClientAuthentication: A,
    fetchFn: O
}) {
    let w = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: z
        }),
        $ = await tg1(q, {
            metadata: K,
            tokenRequestParams: w,
            clientInformation: _,
            addClientAuthentication: A,
            resource: Y,
            fetchFn: O
        });
    return {
        refresh_token: z,
        ...$
    }
}
// @from(Ln 223170, Col 0)
async function Uqz(q, K, {
    metadata: _,
    resource: z,
    authorizationCode: Y,
    fetchFn: A
} = {}) {
    let O = q.clientMetadata.scope,
        w;
    if (q.prepareTokenRequest) w = await q.prepareTokenRequest(O);
    if (!w) {
        if (!Y) throw Error("Either provider.prepareTokenRequest() or authorizationCode is required");
        if (!q.redirectUrl) throw Error("redirectUrl is required for authorization_code flow");
        let j = await q.codeVerifier();
        w = bW4(Y, j, q.redirectUrl)
    }
    let $ = await q.clientInformation();
    return tg1(K, {
        metadata: _,
        tokenRequestParams: w,
        clientInformation: $ ?? void 0,
        addClientAuthentication: q.addClientAuthentication,
        resource: z,
        fetchFn: A
    })
}
// @from(Ln 223195, Col 0)
async function Qqz(q, {
    metadata: K,
    clientMetadata: _,
    scope: z,
    fetchFn: Y
}) {
    let A;
    if (K) {
        if (!K.registration_endpoint) throw Error("Incompatible auth server: does not support dynamic client registration");
        A = new URL(K.registration_endpoint)
    } else A = new URL("/register", q);
    let O = await (Y ?? fetch)(A, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ..._,
            ...z !== void 0 ? {
                scope: z
            } : {}
        })
    });
    if (!O.ok) throw await CW4(O);
    return yW4.parse(await O.json())
}
// @from(Ln 223221, Col 4)
VD
// @from(Ln 223221, Col 8)
lg1 = "code"
// @from(Ln 223222, Col 4)
ng1 = "S256"
// @from(Ln 223223, Col 4)
Ij6 = L(() => {
    kW4();
    _P();
    Je6();
    Je6();
    cg1();
    VD = class VD extends Error {
        constructor(q) {
            super(q ?? "Unauthorized")
        }
    }
})
// @from(Ln 223235, Col 0)
class IR8 {
    constructor(q, K) {
        this._url = q, this._resourceMetadataUrl = void 0, this._scope = void 0, this._eventSourceInit = K?.eventSourceInit, this._requestInit = K?.requestInit, this._authProvider = K?.authProvider, this._fetch = K?.fetch, this._fetchWithInit = Cj6(K?.fetch, K?.requestInit)
    }
    async _authThenStart() {
        if (!this._authProvider) throw new VD("No auth provider");
        let q;
        try {
            q = await lI(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            })
        } catch (K) {
            throw this.onerror?.(K), K
        }
        if (q !== "AUTHORIZED") throw new VD;
        return await this._startOrAuth()
    }
    async _commonHeaders() {
        let q = {};
        if (this._authProvider) {
            let _ = await this._authProvider.tokens();
            if (_) q.Authorization = `Bearer ${_.access_token}`
        }
        if (this._protocolVersion) q["mcp-protocol-version"] = this._protocolVersion;
        let K = Ry6(this._requestInit?.headers);
        return new Headers({
            ...q,
            ...K
        })
    }
    _startOrAuth() {
        let q = this?._eventSourceInit?.fetch ?? this._fetch ?? fetch;
        return new Promise((K, _) => {
            this._eventSource = new hy6(this._url.href, {
                ...this._eventSourceInit,
                fetch: async (z, Y) => {
                    let A = await this._commonHeaders();
                    A.set("Accept", "text/event-stream");
                    let O = await q(z, {
                        ...Y,
                        headers: A
                    });
                    if (O.status === 401 && O.headers.has("www-authenticate")) {
                        let {
                            resourceMetadataUrl: w,
                            scope: $
                        } = uy6(O);
                        this._resourceMetadataUrl = w, this._scope = $
                    }
                    return O
                }
            }), this._abortController = new AbortController, this._eventSource.onerror = (z) => {
                if (z.code === 401 && this._authProvider) {
                    this._authThenStart().then(K, _);
                    return
                }
                let Y = new xW4(z.code, z.message, z);
                _(Y), this.onerror?.(Y)
            }, this._eventSource.onopen = () => {}, this._eventSource.addEventListener("endpoint", (z) => {
                let Y = z;
                try {
                    if (this._endpoint = new URL(Y.data, this._url), this._endpoint.origin !== this._url.origin) throw Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`)
                } catch (A) {
                    _(A), this.onerror?.(A), this.close();
                    return
                }
                K()
            }), this._eventSource.onmessage = (z) => {
                let Y = z,
                    A;
                try {
                    A = Pm.parse(JSON.parse(Y.data))
                } catch (O) {
                    this.onerror?.(O);
                    return
                }
                this.onmessage?.(A)
            }
        })
    }
    async start() {
        if (this._eventSource) throw Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return await this._startOrAuth()
    }
    async finishAuth(q) {
        if (!this._authProvider) throw new VD("No auth provider");
        if (await lI(this._authProvider, {
                serverUrl: this._url,
                authorizationCode: q,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new VD("Failed to authorize")
    }
    async close() {
        this._abortController?.abort(), this._eventSource?.close(), this.onclose?.()
    }
    async send(q) {
        if (!this._endpoint) throw Error("Not connected");
        try {
            let K = await this._commonHeaders();
            K.set("content-type", "application/json");
            let _ = {
                    ...this._requestInit,
                    method: "POST",
                    headers: K,
                    body: JSON.stringify(q),
                    signal: this._abortController?.signal
                },
                z = await (this._fetch ?? fetch)(this._endpoint, _);
            if (!z.ok) {
                let Y = await z.text().catch(() => null);
                if (z.status === 401 && this._authProvider) {
                    let {
                        resourceMetadataUrl: A,
                        scope: O
                    } = uy6(z);
                    if (this._resourceMetadataUrl = A, this._scope = O, await lI(this._authProvider, {
                            serverUrl: this._url,
                            resourceMetadataUrl: this._resourceMetadataUrl,
                            scope: this._scope,
                            fetchFn: this._fetchWithInit
                        }) !== "AUTHORIZED") throw new VD;
                    return this.send(q)
                }
                throw Error(`Error POSTing to endpoint (HTTP ${z.status}): ${Y}`)
            }
            await z.body?.cancel()
        } catch (K) {
            throw this.onerror?.(K), K
        }
    }
    setProtocolVersion(q) {
        this._protocolVersion = q
    }
}
// @from(Ln 223374, Col 4)
xW4
// @from(Ln 223375, Col 4)
uW4 = L(() => {
    VW4();
    _P();
    Ij6();
    xW4 = class xW4 extends Error {
        constructor(q, K, _) {
            super(`SSE error: ${K}`);
            this.code = q, this.event = _
        }
    }
})
// @from(Ln 223391, Col 0)
function KU1() {
    let q = {};
    for (let K of cqz) {
        let _ = qU1.env[K];
        if (_ === void 0) continue;
        if (_.startsWith("()")) continue;
        q[K] = _
    }
    return q
}
// @from(Ln 223401, Col 0)
class _U1 {
    constructor(q) {
        if (this._readBuffer = new HU6, this._stderrStream = null, this._serverParams = q, q.stderr === "pipe" || q.stderr === "overlapped") this._stderrStream = new dqz
    }
    async start() {
        if (this._process) throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return new Promise((q, K) => {
            if (this._process = mW4.default(this._serverParams.command, this._serverParams.args ?? [], {
                    env: {
                        ...KU1(),
                        ...this._serverParams.env
                    },
                    stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
                    shell: !1,
                    windowsHide: qU1.platform === "win32",
                    cwd: this._serverParams.cwd
                }), this._process.on("error", (_) => {
                    K(_), this.onerror?.(_)
                }), this._process.on("spawn", () => {
                    q()
                }), this._process.on("close", (_) => {
                    this._process = void 0, this.onclose?.()
                }), this._process.stdin?.on("error", (_) => {
                    this.onerror?.(_)
                }), this._process.stdout?.on("data", (_) => {
                    this._readBuffer.append(_), this.processReadBuffer()
                }), this._process.stdout?.on("error", (_) => {
                    this.onerror?.(_)
                }), this._stderrStream && this._process.stderr) this._process.stderr.pipe(this._stderrStream)
        })
    }
    get stderr() {
        if (this._stderrStream) return this._stderrStream;
        return this._process?.stderr ?? null
    }
    get pid() {
        return this._process?.pid ?? null
    }
    processReadBuffer() {
        while (!0) try {
            let q = this._readBuffer.readMessage();
            if (q === null) break;
            this.onmessage?.(q)
        } catch (q) {
            this.onerror?.(q)
        }
    }
    async close() {
        if (this._process) {
            let q = this._process;
            this._process = void 0;
            let K = new Promise((_) => {
                q.once("close", () => {
                    _()
                })
            });
            try {
                q.stdin?.end()
            } catch {}
            if (await Promise.race([K, new Promise((_) => setTimeout(_, 2000).unref())]), q.exitCode === null) {
                try {
                    q.kill("SIGTERM")
                } catch {}
                await Promise.race([K, new Promise((_) => setTimeout(_, 2000).unref())])
            }
            if (q.exitCode === null) try {
                q.kill("SIGKILL")
            } catch {}
        }
        this._readBuffer.clear()
    }
    send(q) {
        return new Promise((K) => {
            if (!this._process?.stdin) throw Error("Not connected");
            let _ = pj8(q);
            if (this._process.stdin.write(_)) K();
            else this._process.stdin.once("drain", K)
        })
    }
}
// @from(Ln 223481, Col 4)
mW4
// @from(Ln 223481, Col 9)
cqz
// @from(Ln 223482, Col 4)
BW4 = L(() => {
    y_1();
    mW4 = K6(iY1(), 1), cqz = qU1.platform === "win32" ? ["APPDATA", "HOMEDRIVE", "HOMEPATH", "LOCALAPPDATA", "PATH", "PROCESSOR_ARCHITECTURE", "SYSTEMDRIVE", "SYSTEMROOT", "TEMP", "USERNAME", "USERPROFILE", "PROGRAMFILES"] : ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"]
})
// @from(Ln 223486, Col 4)
zU1
// @from(Ln 223487, Col 4)
pW4 = L(() => {
    Cg1();
    zU1 = class zU1 extends TransformStream {
        constructor({
            onError: q,
            onRetry: K,
            onComment: _
        } = {}) {
            let z;
            super({
                start(Y) {
                    z = DR8({
                        onEvent: (A) => {
                            Y.enqueue(A)
                        },
                        onError(A) {
                            q === "terminate" ? Y.error(A) : typeof q == "function" && q(A)
                        },
                        onRetry: K,
                        onComment: _
                    })
                },
                transform(Y) {
                    z.feed(Y)
                }
            })
        }
    }
})
// @from(Ln 223516, Col 0)
class xR8 {
    constructor(q, K) {
        this._hasCompletedAuthFlow = !1, this._url = q, this._resourceMetadataUrl = void 0, this._scope = void 0, this._requestInit = K?.requestInit, this._authProvider = K?.authProvider, this._fetch = K?.fetch, this._fetchWithInit = Cj6(K?.fetch, K?.requestInit), this._sessionId = K?.sessionId, this._reconnectionOptions = K?.reconnectionOptions ?? lqz
    }
    async _authThenStart() {
        if (!this._authProvider) throw new VD("No auth provider");
        let q;
        try {
            q = await lI(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            })
        } catch (K) {
            throw this.onerror?.(K), K
        }
        if (q !== "AUTHORIZED") throw new VD;
        return await this._startOrAuthSse({
            resumptionToken: void 0
        })
    }
    async _commonHeaders() {
        let q = {};
        if (this._authProvider) {
            let _ = await this._authProvider.tokens();
            if (_) q.Authorization = `Bearer ${_.access_token}`
        }
        if (this._sessionId) q["mcp-session-id"] = this._sessionId;
        if (this._protocolVersion) q["mcp-protocol-version"] = this._protocolVersion;
        let K = Ry6(this._requestInit?.headers);
        return new Headers({
            ...q,
            ...K
        })
    }
    async _startOrAuthSse(q) {
        let {
            resumptionToken: K
        } = q;
        try {
            let _ = await this._commonHeaders();
            if (_.set("Accept", "text/event-stream"), K) _.set("last-event-id", K);
            let z = await (this._fetch ?? fetch)(this._url, {
                method: "GET",
                headers: _,
                signal: this._abortController?.signal
            });
            if (!z.ok) {
                if (await z.body?.cancel(), z.status === 401 && this._authProvider) return await this._authThenStart();
                if (z.status === 405) return;
                throw new xj6(z.status, `Failed to open SSE stream: ${z.statusText}`)
            }
            this._handleSseStream(z.body, q, !0)
        } catch (_) {
            throw this.onerror?.(_), _
        }
    }
    _getNextReconnectionDelay(q) {
        if (this._serverRetryMs !== void 0) return this._serverRetryMs;
        let K = this._reconnectionOptions.initialReconnectionDelay,
            _ = this._reconnectionOptions.reconnectionDelayGrowFactor,
            z = this._reconnectionOptions.maxReconnectionDelay;
        return Math.min(K * Math.pow(_, q), z)
    }
    _scheduleReconnection(q, K = 0) {
        let _ = this._reconnectionOptions.maxRetries;
        if (K >= _) {
            this.onerror?.(Error(`Maximum reconnection attempts (${_}) exceeded.`));
            return
        }
        let z = this._getNextReconnectionDelay(K);
        this._reconnectionTimeout = setTimeout(() => {
            this._startOrAuthSse(q).catch((Y) => {
                this.onerror?.(Error(`Failed to reconnect SSE stream: ${Y instanceof Error?Y.message:String(Y)}`)), this._scheduleReconnection(q, K + 1)
            })
        }, z)
    }
    _handleSseStream(q, K, _) {
        if (!q) return;
        let {
            onresumptiontoken: z,
            replayMessageId: Y
        } = K, A, O = !1, w = !1;
        (async () => {
            try {
                let j = q.pipeThrough(new TextDecoderStream).pipeThrough(new zU1({
                    onRetry: (X) => {
                        this._serverRetryMs = X
                    }
                })).getReader();
                while (!0) {
                    let {
                        value: X,
                        done: M
                    } = await j.read();
                    if (M) break;
                    if (X.id) A = X.id, O = !0, z?.(X.id);
                    if (!X.data) continue;
                    if (!X.event || X.event === "message") try {
                        let P = Pm.parse(JSON.parse(X.data));
                        if (oY6(P)) {
                            if (w = !0, Y !== void 0) P.id = Y
                        }
                        this.onmessage?.(P)
                    } catch (P) {
                        this.onerror?.(P)
                    }
                }
                if ((_ || O) && !w && this._abortController && !this._abortController.signal.aborted) this._scheduleReconnection({
                    resumptionToken: A,
                    onresumptiontoken: z,
                    replayMessageId: Y
                }, 0)
            } catch (j) {
                if (this.onerror?.(Error(`SSE stream disconnected: ${j}`)), (_ || O) && !w && this._abortController && !this._abortController.signal.aborted) try {
                    this._scheduleReconnection({
                        resumptionToken: A,
                        onresumptiontoken: z,
                        replayMessageId: Y
                    }, 0)
                } catch (X) {
                    this.onerror?.(Error(`Failed to reconnect: ${X instanceof Error?X.message:String(X)}`))
                }
            }
        })()
    }
    async start() {
        if (this._abortController) throw Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        this._abortController = new AbortController
    }
    async finishAuth(q) {
        if (!this._authProvider) throw new VD("No auth provider");
        if (await lI(this._authProvider, {
                serverUrl: this._url,
                authorizationCode: q,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new VD("Failed to authorize")
    }
    async close() {
        if (this._reconnectionTimeout) clearTimeout(this._reconnectionTimeout), this._reconnectionTimeout = void 0;
        this._abortController?.abort(), this.onclose?.()
    }
    async send(q, K) {
        try {
            let {
                resumptionToken: _,
                onresumptiontoken: z
            } = K || {};
            if (_) {
                this._startOrAuthSse({
                    resumptionToken: _,
                    replayMessageId: Gg6(q) ? q.id : void 0
                }).catch((J) => this.onerror?.(J));
                return
            }
            let Y = await this._commonHeaders();
            Y.set("content-type", "application/json"), Y.set("accept", "application/json, text/event-stream");
            let A = {
                    ...this._requestInit,
                    method: "POST",
                    headers: Y,
                    body: JSON.stringify(q),
                    signal: this._abortController?.signal
                },
                O = await (this._fetch ?? fetch)(this._url, A),
                w = O.headers.get("mcp-session-id");
            if (w) this._sessionId = w;
            if (!O.ok) {
                let J = await O.text().catch(() => null);
                if (O.status === 401 && this._authProvider) {
                    if (this._hasCompletedAuthFlow) throw new xj6(401, "Server returned 401 after successful authentication");
                    let {
                        resourceMetadataUrl: X,
                        scope: M
                    } = uy6(O);
                    if (this._resourceMetadataUrl = X, this._scope = M, await lI(this._authProvider, {
                            serverUrl: this._url,
                            resourceMetadataUrl: this._resourceMetadataUrl,
                            scope: this._scope,
                            fetchFn: this._fetchWithInit
                        }) !== "AUTHORIZED") throw new VD;
                    return this._hasCompletedAuthFlow = !0, this.send(q)
                }
                if (O.status === 403 && this._authProvider) {
                    let {
                        resourceMetadataUrl: X,
                        scope: M,
                        error: P
                    } = uy6(O);
                    if (P === "insufficient_scope") {
                        let W = O.headers.get("WWW-Authenticate");
                        if (this._lastUpscopingHeader === W) throw new xj6(403, "Server returned 403 after trying upscoping");
                        if (M) this._scope = M;
                        if (X) this._resourceMetadataUrl = X;
                        if (this._lastUpscopingHeader = W ?? void 0, await lI(this._authProvider, {
                                serverUrl: this._url,
                                resourceMetadataUrl: this._resourceMetadataUrl,
                                scope: this._scope,
                                fetchFn: this._fetch
                            }) !== "AUTHORIZED") throw new VD;
                        return this.send(q)
                    }
                }
                throw new xj6(O.status, `Error POSTing to endpoint: ${J}`)
            }
            if (this._hasCompletedAuthFlow = !1, this._lastUpscopingHeader = void 0, O.status === 202) {
                if (await O.body?.cancel(), XE7(q)) this._startOrAuthSse({
                    resumptionToken: void 0
                }).catch((J) => this.onerror?.(J));
                return
            }
            let j = (Array.isArray(q) ? q : [q]).filter((J) => ("method" in J) && ("id" in J) && J.id !== void 0).length > 0,
                H = O.headers.get("content-type");
            if (j)
                if (H?.includes("text/event-stream")) this._handleSseStream(O.body, {
                    onresumptiontoken: z
                }, !1);
                else if (H?.includes("application/json")) {
                let J = await O.json(),
                    X = Array.isArray(J) ? J.map((M) => Pm.parse(M)) : [Pm.parse(J)];
                for (let M of X) this.onmessage?.(M)
            } else throw await O.body?.cancel(), new xj6(-1, `Unexpected content type: ${H}`);
            else await O.body?.cancel()
        } catch (_) {
            throw this.onerror?.(_), _
        }
    }
    get sessionId() {
        return this._sessionId
    }
    async terminateSession() {
        if (!this._sessionId) return;
        try {
            let q = await this._commonHeaders(),
                K = {
                    ...this._requestInit,
                    method: "DELETE",
                    headers: q,
                    signal: this._abortController?.signal
                },
                _ = await (this._fetch ?? fetch)(this._url, K);
            if (await _.body?.cancel(), !_.ok && _.status !== 405) throw new xj6(_.status, `Failed to terminate session: ${_.statusText}`);
            this._sessionId = void 0
        } catch (q) {
            throw this.onerror?.(q), q
        }
    }
    setProtocolVersion(q) {
        this._protocolVersion = q
    }
    get protocolVersion() {
        return this._protocolVersion
    }
    async resumeStream(q, K) {
        await this._startOrAuthSse({
            resumptionToken: q,
            onresumptiontoken: K?.onresumptiontoken
        })
    }
}
// @from(Ln 223779, Col 4)
lqz
// @from(Ln 223779, Col 9)
xj6
// @from(Ln 223780, Col 4)
FW4 = L(() => {
    _P();
    Ij6();
    pW4();
    lqz = {
        initialReconnectionDelay: 1000,
        maxReconnectionDelay: 30000,
        reconnectionDelayGrowFactor: 1.5,
        maxRetries: 2
    };
    xj6 = class xj6 extends Error {
        constructor(q, K) {
            super(`Streamable HTTP error: ${K}`);
            this.code = q
        }
    }
})
// @from(Ln 223798, Col 0)
function nqz(q, K, _) {
    var z = -1,
        Y = q.length,
        A = K.length,
        O = {};
    while (++z < Y) {
        var w = z < A ? K[z] : void 0;
        _(O, q[z], w)
    }
    return O
}
// @from(Ln 223809, Col 4)
gW4
// @from(Ln 223810, Col 4)
UW4 = L(() => {
    gW4 = nqz
})
// @from(Ln 223814, Col 0)
function iqz(q, K) {
    return gW4(q || [], K || [], g86)
}
// @from(Ln 223817, Col 4)
QW4
// @from(Ln 223818, Col 4)
dW4 = L(() => {
    ep6();
    UW4();
    QW4 = iqz
})
// @from(Ln 223823, Col 0)
async function Xe6(q, K, {
    concurrency: _ = Number.POSITIVE_INFINITY,
    stopOnError: z = !0,
    signal: Y
} = {}) {
    return new Promise((A, O) => {
        if (q[Symbol.iterator] === void 0 && q[Symbol.asyncIterator] === void 0) throw TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof q})`);
        if (typeof K !== "function") throw TypeError("Mapper function is required");
        if (!(Number.isSafeInteger(_) && _ >= 1 || _ === Number.POSITIVE_INFINITY)) throw TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${_}\` (${typeof _})`);
        let w = [],
            $ = [],
            j = new Map,
            H = !1,
            J = !1,
            X = !1,
            M = 0,
            P = 0,
            W = q[Symbol.iterator] === void 0 ? q[Symbol.asyncIterator]() : q[Symbol.iterator](),
            D = () => {
                f(Y.reason)
            },
            Z = () => {
                Y?.removeEventListener("abort", D)
            },
            G = (V) => {
                A(V), Z()
            },
            f = (V) => {
                H = !0, J = !0, O(V), Z()
            };
        if (Y) {
            if (Y.aborted) f(Y.reason);
            Y.addEventListener("abort", D, {
                once: !0
            })
        }
        let v = async () => {
            if (J) return;
            let V = await W.next(),
                k = P;
            if (P++, V.done) {
                if (X = !0, M === 0 && !J) {
                    if (!z && $.length > 0) {
                        f(AggregateError($));
                        return
                    }
                    if (J = !0, j.size === 0) {
                        G(w);
                        return
                    }
                    let N = [];
                    for (let [R, h] of w.entries()) {
                        if (j.get(R) === cW4) continue;
                        N.push(h)
                    }
                    G(N)
                }
                return
            }
            M++, (async () => {
                try {
                    let N = await V.value;
                    if (J) return;
                    let R = await K(N, k);
                    if (R === cW4) j.set(k, R);
                    w[k] = R, M--, await v()
                } catch (N) {
                    if (z) f(N);
                    else {
                        $.push(N), M--;
                        try {
                            await v()
                        } catch (R) {
                            f(R)
                        }
                    }
                }
            })()
        };
        (async () => {
            for (let V = 0; V < _; V++) {
                try {
                    await v()
                } catch (k) {
                    f(k);
                    break
                }
                if (X || H) break
            }
        })()
    })
}
// @from(Ln 223915, Col 4)
cW4
// @from(Ln 223916, Col 4)
YU1 = L(() => {
    cW4 = Symbol("skip")
})
// @from(Ln 223919, Col 4)
lW4 = {}
// @from(Ln 223926, Col 0)
function OU1(q) {
    AU1 = q
}
// @from(Ln 223930, Col 0)
function ER(q) {
    if (!q.startsWith("cse_")) return q;
    if (AU1 && !AU1()) return q;
    return "session_" + q.slice(4)
}
// @from(Ln 223936, Col 0)
function wU1(q) {
    if (!q.startsWith("session_")) return q;
    return "cse_" + q.slice(8)
}
// @from(Ln 223940, Col 4)
AU1
// @from(Ln 223942, Col 0)
function rqz(q, K) {
    return q?.includes("_staging_") === !0 || K?.includes("staging") === !0
}
// @from(Ln 223946, Col 0)
function Me6(q, K) {
    return q?.includes("_local_") === !0 || K?.includes("localhost") === !0
}
// @from(Ln 223950, Col 0)
function $U1(q, K) {
    if (Me6(q, K)) return "http://localhost:4000";
    if (rqz(q, K)) return "https://claude-ai.staging.ant.dev";
    return "https://claude.ai"
}
// @from(Ln 223956, Col 0)
function g2(q, K) {
    let {
        toCompatSessionId: _
    } = B7(lW4), z = _(q);
    return `${$U1(z,K)}/code/${z}`
}
// @from(Ln 223962, Col 4)
uj6 = "https://claude.com/claude-code"
// @from(Ln 223964, Col 0)
function nW4(q) {
    switch (q.type) {
        case "assistant": {
            let K = q.message.content[0];
            return K?.type === "text" && !my6(K.text) && !SK6.has(K.text) || K?.type === "tool_use" && K.name in Pe6
        }
        case "user": {
            if (q.isMeta || q.isCompactSummary) return !1;
            let K = q.message.content[0];
            if (K?.type !== "text") return !1;
            if (SK6.has(K.text)) return !1;
            return !BR8(K.text).startsWith("<")
        }
        case "system":
            switch (q.subtype) {
                case "api_metrics":
                case "stop_hook_summary":
                case "turn_duration":
                case "memory_saved":
                case "agents_killed":
                case "away_summary":
                case "thinking":
                    return !1
            }
            return !0;
        case "grouped_tool_use":
        case "collapsed_read_search":
            return !0;
        case "attachment":
            switch (q.attachment.type) {
                case "queued_command":
                case "diagnostics":
                case "hook_blocking_error":
                case "hook_error_during_execution":
                    return !0
            }
            return !1
    }
}
// @from(Ln 224004, Col 0)
function mR8(q) {
    if (q.type === "assistant") {
        let K = q.message.content[0];
        if (K?.type === "tool_use") return {
            name: K.name,
            input: K.input
        }
    }
    if (q.type === "grouped_tool_use") {
        let K = q.messages[0]?.message.content[0];
        if (K?.type === "tool_use") return {
            name: q.toolName,
            input: K.input
        }
    }
    return
}
// @from(Ln 224022, Col 0)
function uR8(q) {
    return q
}
// @from(Ln 224026, Col 0)
function iW4(q, K) {
    if (!q.types.includes(K.msgType)) return !1;
    return !q.applies || q.applies(K)
}
// @from(Ln 224031, Col 0)
function If() {
    return ZH.default.useContext(Vs) ? "messageActionsBackground" : void 0
}
// @from(Ln 224035, Col 0)
function rW4(q, K, _, z) {
    let Y = ZH.useRef(q);
    Y.current = q;
    let A = ZH.useRef(z);
    A.current = z;
    let O = ZH.useMemo(() => {
        let $ = {
            "messageActions:prev": () => _.current?.navigatePrev(),
            "messageActions:next": () => _.current?.navigateNext(),
            "messageActions:prevUser": () => _.current?.navigatePrevUser(),
            "messageActions:nextUser": () => _.current?.navigateNextUser(),
            "messageActions:top": () => _.current?.navigateTop(),
            "messageActions:bottom": () => _.current?.navigateBottom(),
            "messageActions:escape": () => K((j) => j?.expanded ? {
                ...j,
                expanded: !1
            } : null),
            "messageActions:ctrlc": () => K(null)
        };
        for (let j of new Set(HU1.map((H) => H.key))) $[`messageActions:${j}`] = () => {
            let H = Y.current;
            if (!H) return;
            let J = HU1.find((M) => M.key === j && iW4(M, H));
            if (!J) return;
            if (J.stays) {
                K((M) => M ? {
                    ...M,
                    expanded: !M.expanded
                } : null);
                return
            }
            let X = _.current?.getSelected();
            if (!X) return;
            J.run(X, A.current), K(null)
        };
        return $
    }, [K, _]);
    return {
        enter: ZH.useCallback(() => {
            d("tengu_message_actions_enter", {}), _.current?.enterCursor()
        }, [_]),
        handlers: O
    }
}
// @from(Ln 224080, Col 0)
function oW4(q) {
    let K = s(28),
        {
            cursor: _
        } = q,
        z, Y, A, O, w, $, j, H, J;
    if (K[0] !== _) {
        let f = HU1.filter((v) => iW4(v, _));
        if (Y = u, $ = "column", j = 0, H = 1, K[10] === Symbol.for("react.memo_cache_sentinel")) J = ZH.default.createElement(u, {
            borderStyle: "single",
            borderTop: !0,
            borderBottom: !1,
            borderLeft: !1,
            borderRight: !1,
            borderDimColor: !0
        }), K[10] = J;
        else J = K[10];
        z = u, A = 2, O = 1, w = f.map((v, V) => {
            let k = typeof v.label === "function" ? v.label(_) : v.label;
            return ZH.default.createElement(ZH.default.Fragment, {
                key: v.key
            }, V > 0 && ZH.default.createElement(T, {
                dimColor: !0
            }, " · "), ZH.default.createElement(T, {
                bold: !0,
                dimColor: !1
            }, v.key), ZH.default.createElement(T, {
                dimColor: !0
            }, " ", k))
        }), K[0] = _, K[1] = z, K[2] = Y, K[3] = A, K[4] = O, K[5] = w, K[6] = $, K[7] = j, K[8] = H, K[9] = J
    } else z = K[1], Y = K[2], A = K[3], O = K[4], w = K[5], $ = K[6], j = K[7], H = K[8], J = K[9];
    let X, M, P, W, D;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) W = ZH.default.createElement(T, {
        dimColor: !0
    }, " · "), D = ZH.default.createElement(T, {
        bold: !0,
        dimColor: !1
    }, e6.arrowUp, e6.arrowDown), X = ZH.default.createElement(T, {
        dimColor: !0
    }, " navigate · "), M = ZH.default.createElement(T, {
        bold: !0,
        dimColor: !1
    }, "esc"), P = ZH.default.createElement(T, {
        dimColor: !0
    }, " back"), K[11] = X, K[12] = M, K[13] = P, K[14] = W, K[15] = D;
    else X = K[11], M = K[12], P = K[13], W = K[14], D = K[15];
    let Z;
    if (K[16] !== z || K[17] !== A || K[18] !== O || K[19] !== w) Z = ZH.default.createElement(z, {
        paddingX: A,
        paddingY: O
    }, w, W, D, X, M, P), K[16] = z, K[17] = A, K[18] = O, K[19] = w, K[20] = Z;
    else Z = K[20];
    let G;
    if (K[21] !== Y || K[22] !== Z || K[23] !== $ || K[24] !== j || K[25] !== H || K[26] !== J) G = ZH.default.createElement(Y, {
        flexDirection: $,
        flexShrink: j,
        paddingY: H
    }, J, Z), K[21] = Y, K[22] = Z, K[23] = $, K[24] = j, K[25] = H, K[26] = J, K[27] = G;
    else G = K[27];
    return G
}
// @from(Ln 224142, Col 0)
function BR8(q) {
    let _ = q.trimStart();
    while (_.startsWith("<system-reminder>")) {
        let z = _.indexOf("</system-reminder>");
        if (z < 0) break;
        _ = _.slice(z + 18).trimStart()
    }
    return _
}
// @from(Ln 224152, Col 0)
function aqz(q) {
    switch (q.type) {
        case "user": {
            let K = q.message.content[0];
            return K?.type === "text" ? BR8(K.text) : ""
        }
        case "assistant": {
            let K = q.message.content[0];
            if (K?.type === "text") return K.text;
            let _ = mR8(q);
            return _ ? Pe6[_.name]?.extract(_.input) ?? "" : ""
        }
        case "grouped_tool_use":
            return q.results.map(jU1).filter(Boolean).join(`

`);
        case "collapsed_read_search":
            return q.messages.flatMap((K) => K.type === "user" ? [jU1(K)] : K.type === "grouped_tool_use" ? K.results.map(jU1) : []).filter(Boolean).join(`

`);
        case "system":
            if ("content" in q) return q.content;
            if ("error" in q) return String(q.error);
            return q.subtype;
        case "attachment": {
            let K = q.attachment;
            if (K.type === "queued_command") {
                let _ = K.prompt;
                return typeof _ === "string" ? _ : _.flatMap((z) => z.type === "text" ? [z.text] : []).join(`
`)
            }
            return `[${K.type}]`
        }
    }
}
// @from(Ln 224188, Col 0)
function jU1(q) {
    let K = q.message.content[0];
    if (K?.type !== "tool_result") return "";
    let _ = K.content;
    if (typeof _ === "string") return _;
    if (!_) return "";
    return _.flatMap((z) => z.type === "text" ? [z.text] : []).join(`
`)
}
// @from(Ln 224197, Col 4)
ZH
// @from(Ln 224197, Col 8)
oqz
// @from(Ln 224197, Col 13)
kp = (q) => (K) => typeof K[q] === "string" ? K[q] : void 0
// @from(Ln 224198, Col 4)
Pe6
// @from(Ln 224198, Col 9)
HU1
// @from(Ln 224198, Col 14)
Vs
// @from(Ln 224198, Col 18)
CK6
// @from(Ln 224199, Col 4)
wy = L(() => {
    o6();
    Qq();
    g6();
    C7();
    C8();
    _7();
    ZH = K6(P6(), 1), oqz = ["user", "assistant", "grouped_tool_use", "collapsed_read_search", "system", "attachment"];
    Pe6 = {
        Read: {
            label: "path",
            extract: kp("file_path")
        },
        Edit: {
            label: "path",
            extract: kp("file_path")
        },
        Write: {
            label: "path",
            extract: kp("file_path")
        },
        NotebookEdit: {
            label: "path",
            extract: kp("notebook_path")
        },
        Bash: {
            label: "command",
            extract: kp("command")
        },
        Grep: {
            label: "pattern",
            extract: kp("pattern")
        },
        Glob: {
            label: "pattern",
            extract: kp("pattern")
        },
        WebFetch: {
            label: "url",
            extract: kp("url")
        },
        WebSearch: {
            label: "query",
            extract: kp("query")
        },
        Task: {
            label: "prompt",
            extract: kp("prompt")
        },
        Agent: {
            label: "prompt",
            extract: kp("prompt")
        },
        Tmux: {
            label: "command",
            extract: (q) => Array.isArray(q.args) ? `tmux ${q.args.join(" ")}` : void 0
        }
    };
    HU1 = [uR8({
        key: "enter",
        label: (q) => q.expanded ? "collapse" : "expand",
        types: ["grouped_tool_use", "collapsed_read_search", "attachment", "system"],
        stays: !0,
        run: () => {}
    }), uR8({
        key: "enter",
        label: "edit",
        types: ["user"],
        run: (q, K) => void K.edit(q)
    }), uR8({
        key: "c",
        label: "copy",
        types: oqz,
        run: (q, K) => K.copy(aqz(q))
    }), uR8({
        key: "p",
        label: (q) => `copy ${Pe6[q.toolName].label}`,
        types: ["grouped_tool_use", "assistant"],
        applies: (q) => q.toolName != null && (q.toolName in Pe6),
        run: (q, K) => {
            let _ = mR8(q);
            if (!_) return;
            let z = Pe6[_.name]?.extract(_.input);
            if (z) K.copy(z)
        }
    })];
    Vs = ZH.default.createContext(!1), CK6 = ZH.default.createContext(!1)
})
// @from(Ln 224288, Col 0)
function We6(q) {
    let K = s(2),
        {
            children: _
        } = q,
        z;
    if (K[0] !== _) z = bK6.default.createElement(aW4.Provider, {
        value: !0
    }, _), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 224301, Col 0)
function U2() {
    let q = s(3),
        K = bK6.useContext(aW4),
        _ = bK6.useContext(CK6),
        z = GR("app:toggleTranscript", "Global", "ctrl+o");
    if (K || _) return null;
    let Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        keyCase: "lower"
    }, q[0] = Y;
    else Y = q[0];
    let A;
    if (q[1] !== z) A = bK6.default.createElement(T, {
        dimColor: !0
    }, bK6.default.createElement(A8, {
        chord: z,
        action: "expand",
        parens: !0,
        format: Y
    })), q[1] = z, q[2] = A;
    else A = q[2];
    return A
}
// @from(Ln 224325, Col 0)
function sW4() {
    let q = WJ("app:toggleTranscript", "Global", "ctrl+o");
    return Y8.dim(`(${q} to expand)`)
}
// @from(Ln 224329, Col 4)
bK6
// @from(Ln 224329, Col 9)
aW4
// @from(Ln 224330, Col 4)
kk = L(() => {
    o6();
    Y3();
    g6();
    zp();
    iy8();
    u7();
    wy();
    bK6 = K6(P6(), 1), aW4 = bK6.default.createContext(!1)
})
// @from(Ln 224341, Col 0)
function tqz(q, K) {
    let _ = q.split(`
`),
        z = [];
    for (let A of _) {
        let O = N1(A);
        if (O <= K) z.push(A.trimEnd());
        else {
            let w = 0;
            while (w < O) {
                let $ = vf(A, w, w + K);
                z.push($.trimEnd()), w += K
            }
        }
    }
    let Y = z.length - By6;
    if (Y === 1) return {
        aboveTheFold: z.slice(0, By6 + 1).join(`
`).trimEnd(),
        remainingLines: 0
    };
    return {
        aboveTheFold: z.slice(0, By6).join(`
`).trimEnd(),
        remainingLines: Math.max(0, Y)
    }
}
// @from(Ln 224369, Col 0)
function tW4(q, K, _ = !1) {
    let z = q.trimEnd();
    if (!z) return "";
    let Y = Math.max(K - sqz, 10),
        A = By6 * Y * 4,
        O = z.length > A,
        w = O ? z.slice(0, A) : z,
        {
            aboveTheFold: $,
            remainingLines: j
        } = tqz(w, Y),
        H = O ? Math.max(j, Math.ceil(z.length / Y) - By6) : j;
    return [$, H > 0 ? Y8.dim(`… +${H} lines${_?"":` ${sW4()}`}`) : ""].filter(Boolean).join(`
`)
}
// @from(Ln 224385, Col 0)
function yR(q) {
    if (typeof q !== "string") return !1;
    let K = 0;
    for (let _ = 0; _ <= By6; _++) {
        if (K = q.indexOf(`
`, K), K === -1) return !1;
        K++
    }
    return K < q.length
}
// @from(Ln 224395, Col 4)
By6 = 3
// @from(Ln 224396, Col 4)
sqz = 10
// @from(Ln 224397, Col 4)
mj6 = L(() => {
    Y3();
    kk();
    n5();
    k$6()
})
// @from(Ln 224403, Col 4)
py6 = "ListMcpResourcesTool"
// @from(Ln 224404, Col 4)
eW4 = `
Lists available resources from configured MCP servers.
Each resource object includes a 'server' field indicating which server it's from.

Usage examples:
- List all resources from all servers: \`listMcpResources\`
- List resources from a specific server: \`listMcpResources({ server: "myserver" })\`
`
// @from(Ln 224412, Col 4)
q04 = `
List available resources from configured MCP servers.
Each returned resource will include all standard MCP resource fields plus a 'server' field 
indicating which server the resource belongs to.

Parameters:
- server (optional): The name of a specific MCP server to get resources from. If not provided,
  resources from all servers will be returned.
`
// @from(Ln 224422, Col 0)
function qc(q, K, _) {
    if (!(_?.supportsHyperlinks ?? Vf())) return q;
    let Y = K ?? q,
        A = Y8.blue(Y);
    return `${K04}${q}${_04}${A}${K04}${_04}`
}
// @from(Ln 224428, Col 4)
K04 = "\x1B]8;;"
// @from(Ln 224429, Col 4)
_04 = "\x07"
// @from(Ln 224430, Col 4)
De6 = L(() => {
    Y3();
    vd()
})
// @from(Ln 224435, Col 0)
function A04(q) {
    let K = s(2),
        {
            children: _
        } = q,
        z;
    if (K[0] !== _) z = Ze6.createElement(Y04.Provider, {
        value: !0
    }, _), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 224448, Col 0)
function O04() {
    return z04.useContext(Y04)
}
// @from(Ln 224451, Col 4)
Ze6
// @from(Ln 224451, Col 9)
z04
// @from(Ln 224451, Col 14)
Y04
// @from(Ln 224452, Col 4)
JU1 = L(() => {
    o6();
    Ze6 = K6(P6(), 1), z04 = K6(P6(), 1), Y04 = Ze6.createContext(!1)
})
// @from(Ln 224457, Col 0)
function eqz(q) {
    try {
        let K = n8(q),
            _ = I6(K),
            z = q.replaceAll("\\/", "/").replace(/\s+/g, ""),
            Y = _.replace(/\s+/g, "");
        if (z !== Y) return q;
        return I6(K, null, 2)
    } catch {
        return q
    }
}
// @from(Ln 224470, Col 0)
function K4z(q) {
    if (q.length > q4z) return q;
    return q.split(`
`).map(eqz).join(`
`)
}
// @from(Ln 224477, Col 0)
function w04(q) {
    if (q.length > z4z) return q;
    if (q.includes(L$6)) return q;
    return q.replace(_4z, (K) => qc(K))
}
// @from(Ln 224483, Col 0)
function LR(q) {
    let K = s(10),
        {
            content: _,
            verbose: z,
            isError: Y,
            isWarning: A
        } = q,
        {
            columns: O
        } = s1(),
        w = O04(),
        $ = ks.useContext(CK6),
        j = z || w,
        H;
    if (K[0] !== O || K[1] !== _ || K[2] !== $ || K[3] !== j) {
        q: {
            let W = w04(K4z(_));
            if (j) {
                H = pR8(W);
                break q
            }
            H = pR8(tW4(W, O, $))
        }
        K[0] = O,
        K[1] = _,
        K[2] = $,
        K[3] = j,
        K[4] = H
    }
    else H = K[4];
    let J = H,
        X = Y ? "error" : A ? "warning" : void 0,
        M;
    if (K[5] !== J) M = ks.createElement(v5, null, J), K[5] = J, K[6] = M;
    else M = K[6];
    let P;
    if (K[7] !== X || K[8] !== M) P = ks.createElement(_1, null, ks.createElement(T, {
        color: X
    }, M)), K[7] = X, K[8] = M, K[9] = P;
    else P = K[9];
    return P
}
// @from(Ln 224527, Col 0)
function pR8(q) {
    return q.replace(/\u001b\[([0-9]+;)*4(;[0-9]+)*m|\u001b\[4(;[0-9]+)*m|\u001b\[([0-9]+;)*4m/g, "")
}
// @from(Ln 224530, Col 4)
ks
// @from(Ln 224530, Col 8)
q4z = 1e4
// @from(Ln 224531, Col 4)
_4z
// @from(Ln 224531, Col 9)
z4z = 1e5
// @from(Ln 224532, Col 4)
Bj6 = L(() => {
    o6();
    I4();
    Xd();
    g6();
    De6();
    e8();
    mj6();
    GK();
    wy();
    JU1();
    ks = K6(P6(), 1);
    _4z = /https?:\/\/[^\s"'<>\\]+/g
})
// @from(Ln 224547, Col 0)
function $04(q) {
    return q.server ? `List MCP resources from server "${q.server}"` : "List all MCP resources"
}
// @from(Ln 224551, Col 0)
function j04(q, K, {
    verbose: _
}) {
    if (!q || q.length === 0) return pj6.createElement(_1, {
        height: 1
    }, pj6.createElement(T, {
        dimColor: !0
    }, "(No resources found)"));
    let z = I6(q, null, 2);
    return pj6.createElement(LR, {
        content: z,
        verbose: _
    })
}
// @from(Ln 224565, Col 4)
pj6
// @from(Ln 224566, Col 4)
H04 = L(() => {
    GK();
    Bj6();
    g6();
    e8();
    pj6 = K6(P6(), 1)
})
// @from(Ln 224573, Col 4)
Y4z
// @from(Ln 224573, Col 9)
A4z
// @from(Ln 224573, Col 14)
Ns
// @from(Ln 224574, Col 4)
FR8 = L(() => {
    p7();
    oW();
    gq();
    m8();
    U8();
    e8();
    mj6();
    H04();
    Y4z = C6(() => y.object({
        server: y.string().optional().describe("Optional server name to filter resources by")
    })), A4z = C6(() => y.array(y.object({
        uri: y.string().describe("Resource URI"),
        name: y.string().describe("Resource name"),
        mimeType: y.string().optional().describe("MIME type of the resource"),
        description: y.string().optional().describe("Resource description"),
        server: y.string().describe("Server that provides this resource")
    }))), Ns = Iq({
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.server ?? ""
        },
        shouldDefer: !0,
        name: py6,
        searchHint: "list resources from connected MCP servers",
        maxResultSizeChars: 1e5,
        async description() {
            return eW4
        },
        async prompt() {
            return q04
        },
        get inputSchema() {
            return Y4z()
        },
        get outputSchema() {
            return A4z()
        },
        async call(q, {
            options: {
                mcpClients: K
            }
        }) {
            let {
                server: _
            } = q, z = _ ? K.filter((A) => A.name === _) : K;
            if (_ && z.length === 0) throw Error(`Server "${_}" not found. Available servers: ${K.map((A)=>A.name).join(", ")}`);
            return {
                data: (await Promise.all(z.map(async (A) => {
                    if (A.type !== "connected") return [];
                    try {
                        let O = await Fy6(A);
                        return await Es(O)
                    } catch (O) {
                        return yz(A.name, b6(O)), []
                    }
                }))).flat()
            }
        },
        renderToolUseMessage: $04,
        userFacingName: () => "listMcpResources",
        renderToolResultMessage: j04,
        isResultTruncated(q) {
            return yR(I6(q))
        },
        mapToolResultToToolResultBlockParam(q, K) {
            if (!q || q.length === 0) return {
                tool_use_id: K,
                type: "tool_result",
                content: "No resources found. MCP servers may still provide tools even if they have no resources."
            };
            return {
                tool_use_id: K,
                type: "tool_result",
                content: I6(q)
            }
        }
    })
})
// @from(Ln 224659, Col 0)
function w_(q, K = 4) {
    return Math.round(q.length / K)
}
// @from(Ln 224663, Col 0)
function O4z(q) {
    switch (q) {
        case "json":
        case "jsonl":
        case "jsonc":
            return 2;
        default:
            return 4
    }
}
// @from(Ln 224674, Col 0)
function J04(q, K) {
    return w_(q, O4z(K))
}
// @from(Ln 224678, Col 0)
function gy6(q) {
    if (!q) return 0;
    if (typeof q === "string") return w_(q);
    let K = 0;
    for (let _ of q) K += w4z(_);
    return K
}
// @from(Ln 224686, Col 0)
function w4z(q) {
    if (typeof q === "string") return w_(q);
    if (q.type === "text") return w_(q.text);
    if (q.type === "image" || q.type === "document") return 2000;
    if (q.type === "tool_result") return gy6(q.content);
    if (q.type === "tool_use") return w_(q.name + I6(q.input ?? {}));
    if (q.type === "thinking") return w_(q.thinking);
    if (q.type === "redacted_thinking") return w_(q.data);
    return w_(I6(q))
}
// @from(Ln 224696, Col 4)
Nk = L(() => {
    e8()
})
// @from(Ln 224699, Col 4)
Zj = "ToolSearch"
// @from(Ln 224700, Col 4)
X04 = {}
// @from(Ln 224708, Col 4)
fH = "ScheduleWakeup"
// @from(Ln 224709, Col 4)
Fj6 = "<<autonomous-loop>>"
// @from(Ln 224710, Col 4)
ys = "<<autonomous-loop-dynamic>>"
// @from(Ln 224711, Col 4)
XU1
// @from(Ln 224711, Col 9)
MU1 = "Schedule when to resume work in /loop dynamic mode (always pass the `prompt` arg). Call before ending the turn to keep the loop alive; omit the call to end it."
// @from(Ln 224712, Col 4)
fe6 = L(() => {
    XU1 = `Schedule when to resume work in /loop dynamic mode — the user invoked /loop without an interval, asking you to self-pace iterations of a specific task.

Pass the same /loop prompt back via \`prompt\` each turn so the next firing repeats the task. For an autonomous /loop (no user prompt), pass the literal sentinel \`${"<<autonomous-loop-dynamic>>"}\` as \`prompt\` instead — the runtime resolves it back to the autonomous-loop instructions at fire time. (There is a similar \`${"<<autonomous-loop>>"}\` sentinel for CronCreate-based autonomous loops; do not confuse the two — ${"ScheduleWakeup"} always uses the \`-dynamic\` variant.) Omit the call to end the loop.

## Picking delaySeconds

The Anthropic prompt cache has a 5-minute TTL. Sleeping past 300 seconds means the next wake-up reads your full conversation context uncached — slower and more expensive. So the natural breakpoints:

- **Under 5 minutes (60s–270s)**: cache stays warm. Right for active work — checking a build, polling for state that's about to change, watching a process you just started.
- **5 minutes to 1 hour (300s–3600s)**: pay the cache miss. Right when there's no point checking sooner — waiting on something that takes minutes to change, or genuinely idle.

**Don't pick 300s.** It's the worst-of-both: you pay the cache miss without amortizing it. If you're tempted to "wait 5 minutes," either drop to 270s (stay in cache) or commit to 1200s+ (one cache miss buys a much longer wait). Don't think in round-number minutes — think in cache windows.

For idle ticks with no specific signal to watch, default to **1200s–1800s** (20–30 min). The loop checks back, you don't burn cache 12× per hour for nothing, and the user can always interrupt if they need you sooner.

Think about what you're actually waiting for, not just "how long should I sleep." If you kicked off an 8-minute build, sleeping 60s burns the cache 8 times before it finishes — sleep ~270s twice instead.

The runtime clamps to [60, 3600], so you don't need to clamp yourself.

## The reason field

One short sentence on what you chose and why. Goes to telemetry and is shown back to the user. "checking long bun build" beats "waiting." The user reads this to understand what you're doing without having to predict your cadence in advance — make it specific.
`
})
// @from(Ln 224738, Col 0)
function j4z(q, K) {
    let {
        min: _,
        max: z
    } = K, Y = new Set;
    for (let A of q.split(",")) {
        let O = A.match(/^\*(?:\/(\d+))?$/);
        if (O) {
            let j = O[1] ? parseInt(O[1], 10) : 1;
            if (j < 1) return null;
            for (let H = _; H <= z; H += j) Y.add(H);
            continue
        }
        let w = A.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
        if (w) {
            let j = parseInt(w[1], 10),
                H = parseInt(w[2], 10),
                J = w[3] ? parseInt(w[3], 10) : 1,
                X = _ === 0 && z === 6,
                M = X ? 7 : z;
            if (j > H || J < 1 || j < _ || H > M) return null;
            for (let P = j; P <= H; P += J) Y.add(X && P === 7 ? 0 : P);
            continue
        }
        if (A.match(/^\d+$/)) {
            let j = parseInt(A, 10);
            if (_ === 0 && z === 6 && j === 7) j = 0;
            if (j < _ || j > z) return null;
            Y.add(j);
            continue
        }
        return null
    }
    if (Y.size === 0) return null;
    return Array.from(Y).sort((A, O) => A - O)
}
// @from(Ln 224775, Col 0)
function gj6(q) {
    let K = q.trim().split(/\s+/);
    if (K.length !== 5) return null;
    let _ = [];
    for (let z = 0; z < 5; z++) {
        let Y = j4z(K[z], $4z[z]);
        if (!Y) return null;
        _.push(Y)
    }
    return {
        minute: _[0],
        hour: _[1],
        dayOfMonth: _[2],
        month: _[3],
        dayOfWeek: _[4]
    }
}
// @from(Ln 224793, Col 0)
function P04(q, K) {
    let _ = new Set(q.minute),
        z = new Set(q.hour),
        Y = new Set(q.dayOfMonth),
        A = new Set(q.month),
        O = new Set(q.dayOfWeek),
        w = q.dayOfMonth.length === 31,
        $ = q.dayOfWeek.length === 7,
        j = new Date(K.getTime());
    j.setSeconds(0, 0), j.setMinutes(j.getMinutes() + 1);
    let H = 527040;
    for (let J = 0; J < H; J++) {
        let X = j.getMonth() + 1;
        if (!A.has(X)) {
            j.setMonth(j.getMonth() + 1, 1), j.setHours(0, 0, 0, 0);
            continue
        }
        let M = j.getDate(),
            P = j.getDay();
        if (!(w && $ ? !0 : w ? O.has(P) : $ ? Y.has(M) : Y.has(M) || O.has(P))) {
            j.setDate(j.getDate() + 1), j.setHours(0, 0, 0, 0);
            continue
        }
        if (!z.has(j.getHours())) {
            j.setHours(j.getHours() + 1, 0, 0, 0);
            continue
        }
        if (!_.has(j.getMinutes())) {
            j.setMinutes(j.getMinutes() + 1);
            continue
        }
        return j
    }
    return null
}
// @from(Ln 224829, Col 0)
function H4z(q, K) {
    return new Date(2000, 0, 1, K, q).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}
// @from(Ln 224836, Col 0)
function J4z(q, K) {
    let _ = new Date;
    return _.setUTCHours(K, q, 0, 0), _.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
    })
}
// @from(Ln 224845, Col 0)
function Np(q, K) {
    let _ = K?.utc ?? !1,
        z = q.trim().split(/\s+/);
    if (z.length !== 5) return q;
    let [Y, A, O, w, $] = z;
    if (A === "*" && O === "*" && w === "*" && $ === "*") {
        if (Y === "*") return "Every minute";
        let M = Y.match(/^\*\/(\d+)$/);
        if (M) {
            let P = parseInt(M[1], 10);
            return P === 1 ? "Every minute" : `Every ${P} minutes`
        }
    }
    if (Y.match(/^\d+$/) && A === "*" && O === "*" && w === "*" && $ === "*") {
        let M = parseInt(Y, 10);
        if (M === 0) return "Every hour";
        return `Every hour at :${M.toString().padStart(2,"0")}`
    }
    let j = A.match(/^\*\/(\d+)$/);
    if (Y.match(/^\d+$/) && j && O === "*" && w === "*" && $ === "*") {
        let M = parseInt(j[1], 10),
            P = parseInt(Y, 10),
            W = P === 0 ? "" : ` at :${P.toString().padStart(2,"0")}`;
        return M === 1 ? `Every hour${W}` : `Every ${M} hours${W}`
    }
    if (!Y.match(/^\d+$/) || !A.match(/^\d+$/)) return q;
    let H = parseInt(Y, 10),
        J = parseInt(A, 10),
        X = _ ? J4z : H4z;
    if (O === "*" && w === "*" && $ === "*") return `Every day at ${X(H,J)}`;
    if (O === "*" && w === "*" && $.match(/^\d$/)) {
        let M = parseInt($, 10) % 7,
            P;
        if (_) {
            let W = new Date,
                D = (M - W.getUTCDay() + 7) % 7;
            W.setUTCDate(W.getUTCDate() + D), W.setUTCHours(J, H, 0, 0), P = M04[W.getDay()]
        } else P = M04[M];
        if (P) return `Every ${P} at ${X(H,J)}`
    }
    if (O === "*" && w === "*" && $ === "1-5") return `Weekdays at ${X(H,J)}`;
    return q
}
// @from(Ln 224888, Col 4)
$4z
// @from(Ln 224888, Col 9)
M04
// @from(Ln 224889, Col 4)
Uj6 = L(() => {
    $4z = [{
        min: 0,
        max: 59
    }, {
        min: 0,
        max: 23
    }, {
        min: 1,
        max: 31
    }, {
        min: 1,
        max: 12
    }, {
        min: 0,
        max: 6
    }];
    M04 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
})
// @from(Ln 224922, Col 0)
function Ls(q) {
    return PU1(q ?? c9(), Z4z)
}
// @from(Ln 224925, Col 0)
async function Qy6(q) {
    let K = V8(),
        _;
    try {
        _ = await K.readFile(Ls(q), {
            encoding: "utf-8"
        })
    } catch (O) {
        if (D5(O)) return [];
        return j6(O), []
    }
    let z = k5(_, !1);
    if (!z || typeof z !== "object") return [];
    let Y = z;
    if (!Array.isArray(Y.tasks)) return [];
    let A = [];
    for (let O of Y.tasks) {
        if (!O || typeof O.id !== "string" || typeof O.cron !== "string" || typeof O.prompt !== "string" || typeof O.createdAt !== "number") {
            E(`[ScheduledTasks] skipping malformed task: ${I6(O)}`);
            continue
        }
        if (!gj6(O.cron)) {
            E(`[ScheduledTasks] skipping task ${O.id} with invalid cron '${O.cron}'`);
            continue
        }
        A.push({
            id: O.id,
            cron: O.cron,
            prompt: O.prompt,
            createdAt: O.createdAt,
            ...typeof O.lastFiredAt === "number" && {
                lastFiredAt: O.lastFiredAt
            },
            ...O.recurring && {
                recurring: !0
            },
            ...O.permanent && {
                permanent: !0
            }
        })
    }
    return A
}
// @from(Ln 224969, Col 0)
function gR8(q) {
    let K;
    try {
        K = M4z(Ls(q), "utf-8")
    } catch {
        return !1
    }
    let _ = k5(K, !1);
    if (!_ || typeof _ !== "object") return !1;
    let z = _.tasks;
    return Array.isArray(z) && z.length > 0
}
// @from(Ln 224981, Col 0)
async function WU1(q, K) {
    let _ = K ?? c9();
    await P4z(PU1(_, ".claude"), {
        recursive: !0
    });
    let z = {
        tasks: q.map(({
            durable: Y,
            ...A
        }) => A)
    };
    await W4z(Ls(_), I6(z, null, 2) + `
`, "utf-8")
}
// @from(Ln 224995, Col 0)
async function UR8(q, K, _, z, Y) {
    let A = X4z().slice(0, 8),
        O = {
            id: A,
            cron: q,
            prompt: K,
            createdAt: Date.now(),
            ..._ && {
                recurring: !0
            }
        };
    if (!z) return DY6({
        ...O,
        ...Y && {
            agentId: Y
        }
    }), A;
    let w = await Qy6();
    return w.push(O), await WU1(w), A
}
// @from(Ln 225015, Col 0)
async function hs(q, K) {
    if (q.length === 0) return;
    if (K === void 0 && Ci(q) === q.length) return;
    let _ = new Set(q),
        z = await Qy6(K),
        Y = z.filter((A) => !_.has(A.id));
    if (Y.length === z.length) return;
    await WU1(Y, K)
}
// @from(Ln 225024, Col 0)
async function W04(q, K, _) {
    if (q.length === 0) return;
    let z = new Set(q),
        Y = await Qy6(_),
        A = !1;
    for (let O of Y)
        if (z.has(O.id)) O.lastFiredAt = K, A = !0;
    if (!A) return;
    await WU1(Y, _)
}
// @from(Ln 225034, Col 0)
async function IK6(q) {
    let K = await Qy6(q);
    if (q !== void 0) return K;
    let _ = nL().map((z) => ({
        ...z,
        durable: !1
    }));
    return [...K, ..._]
}
// @from(Ln 225044, Col 0)
function Uy6(q, K) {
    let _ = gj6(q);
    if (!_) return null;
    let z = P04(_, new Date(K));
    return z ? z.getTime() : null
}
// @from(Ln 225051, Col 0)
function D04(q) {
    let K = parseInt(q.slice(0, 8), 16) / 4294967296;
    return Number.isFinite(K) ? K : 0
}
// @from(Ln 225056, Col 0)
function DU1(q, K, _, z = Ep) {
    let Y = Uy6(q, K);
    if (Y === null) return null;
    let A = Uy6(q, Y);
    if (A === null) return Y;
    let O = A - Y;
    if (D4z.test(q) && z.cacheLeadMs > 0 && z.cacheLeadMs < O && O >= Ge6 && O - z.cacheLeadMs < Ge6) return K + O - z.cacheLeadMs;
    let w = Math.min(D04(_) * z.recurringFrac * O, z.recurringCapMs);
    return Y + w
}
// @from(Ln 225067, Col 0)
function QR8(q, K, _, z = Ep) {
    let Y = Uy6(q, K);
    if (Y === null) return null;
    if (new Date(Y).getMinutes() % z.oneShotMinuteMod !== 0) return Y;
    let A = z.oneShotFloorMs + D04(_) * (z.oneShotMaxMs - z.oneShotFloorMs);
    return Math.max(Y - A, K)
}
// @from(Ln 225075, Col 0)
function Z04(q, K) {
    return q.filter((_) => {
        let z = Uy6(_.cron, _.createdAt);
        return z !== null && z < K
    })
}
// @from(Ln 225081, Col 4)
Ge6 = 300000
// @from(Ln 225082, Col 4)
D4z
// @from(Ln 225082, Col 9)
Z4z
// @from(Ln 225082, Col 14)
Ep
// @from(Ln 225083, Col 4)
yp = L(() => {
    y8();
    Uj6();
    K8();
    m8();
    Yq();
    mO();
    U8();
    e8();
    D4z = /^\*\/\d+ \* \* \* \*$/, Z4z = PU1(".claude", "scheduled_tasks.json");
    Ep = {
        recurringFrac: 0.5,
        recurringCapMs: 1800000,
        oneShotMaxMs: 90000,
        oneShotFloorMs: 0,
        oneShotMinuteMod: 30,
        recurringMaxAgeMs: 604800000,
        cacheLeadMs: 15000
    }
})
// @from(Ln 225103, Col 4)
f04 = {}
// @from(Ln 225108, Col 0)
function xK6() {
    let q = XD("tengu_kairos_cron_config", Ep, f4z),
        K = v4z().safeParse(q);
    return K.success ? K.data : Ep
}
// @from(Ln 225113, Col 4)
f4z = 60000
// @from(Ln 225114, Col 4)
ZU1 = 1800000
// @from(Ln 225115, Col 4)
G4z = 2592000000
// @from(Ln 225116, Col 4)
v4z
// @from(Ln 225117, Col 4)
ve6 = L(() => {
    p7();
    B1();
    yp();
    v4z = C6(() => y.object({
        recurringFrac: y.number().min(0).max(1),
        recurringCapMs: y.number().int().min(0).max(ZU1),
        oneShotMaxMs: y.number().int().min(0).max(ZU1),
        oneShotFloorMs: y.number().int().min(0).max(ZU1),
        oneShotMinuteMod: y.number().int().min(1).max(60),
        recurringMaxAgeMs: y.number().int().min(0).max(G4z).default(Ep.recurringMaxAgeMs),
        cacheLeadMs: y.number().int().min(0).max(60000).default(Ep.cacheLeadMs)
    }).refine((q) => q.oneShotFloorMs <= q.oneShotMaxMs))
})
// @from(Ln 225131, Col 4)
dR8 = {}
// @from(Ln 225140, Col 0)
function T4z() {
    return u8("tengu_kairos_loop_dynamic", !1)
}
// @from(Ln 225144, Col 0)
function V4z(q, K, _) {
    E4z(K);
    let z = Date.now(),
        Y = b81(K),
        A = Y !== void 0 && z > Y.lastScheduledFor + Te6 * 1000,
        O = Y === void 0 || A ? z : Y.startedAt,
        w = xK6().recurringMaxAgeMs;
    if (w > 0 && z - O >= w) {
        if (!Y?.agedOut) iO8(K, {
            startedAt: O,
            lastScheduledFor: z - (Te6 - dy6) * 1000,
            agedOut: !0
        }), d("tengu_loop_dynamic_wakeup_aged_out", {
            loop_age_ms: z - O,
            max_age_ms: w
        });
        return null
    }
    let {
        clamped: $,
        wasClamped: j,
        targetMs: H,
        createdAt: J,
        target: X
    } = k4z(q), M = `${X.getMinutes()} ${X.getHours()} * * *`;
    return DY6({
        id: G04(),
        cron: M,
        prompt: K,
        createdAt: J,
        kind: "loop"
    }), iO8(K, {
        startedAt: O,
        lastScheduledFor: H
    }), Si(!0), d("tengu_loop_dynamic_wakeup_scheduled", {
        chosen_delay_seconds: Number.isFinite(q) ? q : 0,
        clamped_delay_seconds: $,
        was_clamped: j,
        reason: _ !== void 0 ? _.slice(0, 200) : void 0
    }), {
        scheduledFor: H,
        clampedDelaySeconds: $,
        wasClamped: j
    }
}
// @from(Ln 225190, Col 0)
function k4z(q) {
    let K;
    if (Number.isNaN(q)) K = dy6;
    else if (q === 1 / 0) K = Te6;
    else if (q === -1 / 0) K = dy6;
    else K = Math.round(q);
    let _ = Math.max(dy6, Math.min(Te6, K)),
        z = !Number.isFinite(q) || K !== _,
        Y = Date.now(),
        A = Y + _ * 1000,
        O = N4z(A),
        w = xK6().cacheLeadMs;
    if (w > 0 && _ * 1000 <= Ge6) {
        let H = Ge6 - w;
        while (O - Y > H && O - 60000 >= Y + dy6 * 1000) O -= 60000
    }
    let $ = new Date(O),
        j = A < O ? A : O - 1;
    return {
        clamped: _,
        wasClamped: z,
        targetMs: O,
        createdAt: j,
        target: $
    }
}
// @from(Ln 225217, Col 0)
function N4z(q) {
    let K = new Date(q);
    if (K.getSeconds() > 0 || K.getMilliseconds() > 0) K.setMinutes(K.getMinutes() + 1);
    return K.setSeconds(0, 0), K.getTime()
}
// @from(Ln 225223, Col 0)
function G04() {
    return Math.floor(Math.random() * 4294967295).toString(16).padStart(8, "0")
}
// @from(Ln 225227, Col 0)
function E4z(q) {
    let K = nL().filter((_) => _.kind === "loop" && _.prompt === q).map((_) => _.id);
    if (K.length === 0) return;
    Ci(K)
}
// @from(Ln 225232, Col 4)
dy6 = 60
// @from(Ln 225233, Col 4)
Te6 = 3600
// @from(Ln 225234, Col 4)
cR8 = L(() => {
    y8();
    B1();
    C8();
    ve6();
    yp()
})
// @from(Ln 225241, Col 4)
GU1 = {}
// @from(Ln 225249, Col 0)
function nI(q) {
    if (q.alwaysLoad === !0) return !1;
    if (q.isMcp === !0) return !0;
    if (q.name === Zj) return !1;
    if (v04 && q.name === v04) return !1;
    if (T04 && q.name === T04) {
        if ((cR8(), B7(dR8)).isLoopDynamicEnabled()) return !1
    }
    return q.shouldDefer === !0
}
// @from(Ln 225260, Col 0)
function fU1(q) {
    return q.name
}
// @from(Ln 225264, Col 0)
function lR8() {
    return y4z + L4z
}
// @from(Ln 225267, Col 4)
v04
// @from(Ln 225267, Col 9)
T04
// @from(Ln 225267, Col 14)
y4z = `Fetches full schema definitions for deferred tools so they can be called.

Deferred tools appear by name in <system-reminder> messages.`
// @from(Ln 225270, Col 4)
L4z = ` Until fetched, only the name is known — there is no parameter schema, so the tool cannot be invoked. This tool takes a query, matches it against the deferred tool list, and returns the matched tools' complete JSONSchema definitions inside a <functions> block. Once a tool's schema appears in that result, it is callable exactly like any tool defined at the top of the prompt.

Result format: each matched tool appears as one <function>{"description": "...", "name": "...", "parameters": {...}}</function> line inside the <functions> block — the same encoding as the tool list at the top of this prompt.

Query forms:
- "select:Read,Edit,Grep" — fetch these exact tools by name
- "notebook jupyter" — keyword search, up to max_results best matches
- "+slack send" — require "slack" in the name, rank by remaining terms`
// @from(Ln 225278, Col 4)
Kc = L(() => {
    y8();
    sY();
    v04 = (vh(), B7(TU)).BRIEF_TOOL_NAME, T04 = (fe6(), B7(X04)).SCHEDULE_WAKEUP_TOOL_NAME
})
// @from(Ln 225284, Col 0)
function V04() {
    return `
- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a "Sources:" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response
  - Example format:

    [Your answer here]

    Sources:
    - [Source Title 1](https://example.com/1)
    - [Source Title 2](https://example.com/2)

Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - The current month is ${$W4()}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If the user asks for "latest React docs", search for "React documentation" with the current year, NOT last year
`
}
// @from(Ln 225313, Col 4)
hR = "WebSearch"
// @from(Ln 225314, Col 4)
cy6 = L(() => {
    Rj6()
})
// @from(Ln 225317, Col 4)
I5 = "PowerShell"
// @from(Ln 225319, Col 0)
function ly6() {
    let q = process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL;
    if (y1() !== "windows") return S6(q);
    if (S6(q)) return !0;
    if (c5(q)) return !1;
    return u8("tengu_cobalt_ridge", !1)
}
// @from(Ln 225326, Col 4)
dj6
// @from(Ln 225327, Col 4)
uK6 = L(() => {
    B1();
    Q8();
    NK();
    dj6 = [S7, I5]
})