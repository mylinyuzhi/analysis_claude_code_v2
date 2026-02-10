
// @from(Ln 152162, Col 0)
function Vu5(A, q, K, Y = function() {
    throw Error("XML serialization unsupported!")
}) {
    var z, w, H, $, O;
    let _ = (z = q.options) === null || z === void 0 ? void 0 : z.serializerOptions,
        J = {
            xml: {
                rootName: (w = _ === null || _ === void 0 ? void 0 : _.xml.rootName) !== null && w !== void 0 ? w : "",
                includeRoot: (H = _ === null || _ === void 0 ? void 0 : _.xml.includeRoot) !== null && H !== void 0 ? H : !1,
                xmlCharKey: ($ = _ === null || _ === void 0 ? void 0 : _.xml.xmlCharKey) !== null && $ !== void 0 ? $ : C56
            }
        },
        X = J.xml.xmlCharKey;
    if (K.requestBody && K.requestBody.mapper) {
        A.body = Fr(q, K.requestBody);
        let D = K.requestBody.mapper,
            {
                required: j,
                serializedName: M,
                xmlName: P,
                xmlElementName: W,
                xmlNamespace: G,
                xmlNamespacePrefix: f,
                nullable: Z
            } = D,
            N = D.type.name;
        try {
            if (A.body !== void 0 && A.body !== null || Z && A.body === null || j) {
                let T = Ru(K.requestBody);
                A.body = K.serializer.serialize(D, A.body, T, J);
                let k = N === KU.Stream;
                if (K.isXML) {
                    let y = f ? `xmlns:${f}` : "xmlns",
                        B = Nu5(G, y, N, A.body, J);
                    if (N === KU.Sequence) A.body = Y(Tu5(B, W || P || M, y, G), {
                        rootName: P || M,
                        xmlCharKey: X
                    });
                    else if (!k) A.body = Y(B, {
                        rootName: P || M,
                        xmlCharKey: X
                    })
                } else if (N === KU.String && (((O = K.contentType) === null || O === void 0 ? void 0 : O.match("text/plain")) || K.mediaType === "text")) return;
                else if (!k) A.body = JSON.stringify(A.body)
            }
        } catch (T) {
            throw Error(`Error "${T.message}" occurred in serializing the payload - ${JSON.stringify(M,void 0,"  ")}.`)
        }
    } else if (K.formDataParameters && K.formDataParameters.length > 0) {
        A.formData = {};
        for (let D of K.formDataParameters) {
            let j = Fr(q, D);
            if (j !== void 0 && j !== null) {
                let M = D.mapper.serializedName || Ru(D);
                A.formData[M] = K.serializer.serialize(D.mapper, j, Ru(D), J)
            }
        }
    }
}
// @from(Ln 152222, Col 0)
function Nu5(A, q, K, Y, z) {
    if (A && !["Composite", "Sequence", "Dictionary"].includes(K)) {
        let w = {};
        return w[z.xml.xmlCharKey] = Y, w[I3A] = {
            [q]: A
        }, w
    }
    return Y
}
// @from(Ln 152232, Col 0)
function Tu5(A, q, K, Y) {
    if (!Array.isArray(A)) A = [A];
    if (!K || !Y) return {
        [q]: A
    };
    let z = {
        [q]: A
    };
    return z[I3A] = {
        [K]: Y
    }, z
}
// @from(Ln 152244, Col 4)
Zu5 = "serializationPolicy"
// @from(Ln 152245, Col 4)
oH7 = v(() => {
    bS1();
    S56();
    a56()
})
// @from(Ln 152251, Col 0)
function aH7(A = {}) {
    let q = k5A(A !== null && A !== void 0 ? A : {});
    if (A.credentialOptions) q.addPolicy(xS1({
        credential: A.credentialOptions.credential,
        scopes: A.credentialOptions.credentialScopes
    }));
    return q.addPolicy(rH7(A.serializationOptions), {
        phase: "Serialize"
    }), q.addPolicy(lH7(A.deserializationOptions), {
        phase: "Deserialize"
    }), q
}
// @from(Ln 152263, Col 4)
sH7 = v(() => {
    iH7();
    Lu();
    oH7()
})
// @from(Ln 152269, Col 0)
function tH7() {
    if (!C5A) C5A = L5A();
    return C5A
}
// @from(Ln 152273, Col 4)
C5A
// @from(Ln 152274, Col 4)
eH7 = v(() => {
    Lu()
})
// @from(Ln 152278, Col 0)
function q$7(A, q, K, Y) {
    let z = Eu5(q, K, Y),
        w = !1,
        H = A$7(A, z);
    if (q.path) {
        let _ = A$7(q.path, z);
        if (q.path === "/{nextLink}" && _.startsWith("/")) _ = _.substring(1);
        if (ku5(_)) H = _, w = !0;
        else H = Lu5(H, _)
    }
    let {
        queryParams: $,
        sequenceParams: O
    } = Ru5(q, K, Y);
    return H = Cu5(H, $, O, w), H
}
// @from(Ln 152295, Col 0)
function A$7(A, q) {
    let K = A;
    for (let [Y, z] of q) K = K.split(Y).join(z);
    return K
}
// @from(Ln 152301, Col 0)
function Eu5(A, q, K) {
    var Y;
    let z = new Map;
    if ((Y = A.urlParameters) === null || Y === void 0 ? void 0 : Y.length)
        for (let w of A.urlParameters) {
            let H = Fr(q, w, K),
                $ = Ru(w);
            if (H = A.serializer.serialize(w.mapper, H, $), !w.skipEncoding) H = encodeURIComponent(H);
            z.set(`{${w.mapper.serializedName||$}}`, H)
        }
    return z
}
// @from(Ln 152314, Col 0)
function ku5(A) {
    return A.includes("://")
}
// @from(Ln 152318, Col 0)
function Lu5(A, q) {
    if (!q) return A;
    let K = new URL(A),
        Y = K.pathname;
    if (!Y.endsWith("/")) Y = `${Y}/`;
    if (q.startsWith("/")) q = q.substring(1);
    let z = q.indexOf("?");
    if (z !== -1) {
        let w = q.substring(0, z),
            H = q.substring(z + 1);
        if (Y = Y + w, H) K.search = K.search ? `${K.search}&${H}` : H
    } else Y = Y + q;
    return K.pathname = Y, K.toString()
}
// @from(Ln 152333, Col 0)
function Ru5(A, q, K) {
    var Y;
    let z = new Map,
        w = new Set;
    if ((Y = A.queryParameters) === null || Y === void 0 ? void 0 : Y.length)
        for (let H of A.queryParameters) {
            if (H.mapper.type.name === "Sequence" && H.mapper.serializedName) w.add(H.mapper.serializedName);
            let $ = Fr(q, H, K);
            if ($ !== void 0 && $ !== null || H.mapper.required) {
                $ = A.serializer.serialize(H.mapper, $, Ru(H));
                let O = H.collectionFormat ? vu5[H.collectionFormat] : "";
                if (Array.isArray($)) $ = $.map((_) => {
                    if (_ === null || _ === void 0) return "";
                    return _
                });
                if (H.collectionFormat === "Multi" && $.length === 0) continue;
                else if (Array.isArray($) && (H.collectionFormat === "SSV" || H.collectionFormat === "TSV")) $ = $.join(O);
                if (!H.skipEncoding)
                    if (Array.isArray($)) $ = $.map((_) => {
                        return encodeURIComponent(_)
                    });
                    else $ = encodeURIComponent($);
                if (Array.isArray($) && (H.collectionFormat === "CSV" || H.collectionFormat === "Pipes")) $ = $.join(O);
                z.set(H.mapper.serializedName || Ru(H), $)
            }
        }
    return {
        queryParams: z,
        sequenceParams: w
    }
}
// @from(Ln 152365, Col 0)
function yu5(A) {
    let q = new Map;
    if (!A || A[0] !== "?") return q;
    A = A.slice(1);
    let K = A.split("&");
    for (let Y of K) {
        let [z, w] = Y.split("=", 2), H = q.get(z);
        if (H)
            if (Array.isArray(H)) H.push(w);
            else q.set(z, [H, w]);
        else q.set(z, w)
    }
    return q
}
// @from(Ln 152380, Col 0)
function Cu5(A, q, K, Y = !1) {
    if (q.size === 0) return A;
    let z = new URL(A),
        w = yu5(z.search);
    for (let [$, O] of q) {
        let _ = w.get($);
        if (Array.isArray(_))
            if (Array.isArray(O)) {
                _.push(...O);
                let J = new Set(_);
                w.set($, Array.from(J))
            } else _.push(O);
        else if (_) {
            if (Array.isArray(O)) O.unshift(_);
            else if (K.has($)) w.set($, [_, O]);
            if (!Y) w.set($, O)
        } else w.set($, O)
    }
    let H = [];
    for (let [$, O] of w)
        if (typeof O === "string") H.push(`${$}=${O}`);
        else if (Array.isArray(O))
        for (let _ of O) H.push(`${$}=${_}`);
    else H.push(`${$}=${O}`);
    return z.search = H.length ? `?${H.join("&")}` : "", z.toString()
}
// @from(Ln 152406, Col 4)
vu5
// @from(Ln 152407, Col 4)
K$7 = v(() => {
    bS1();
    a56();
    vu5 = {
        CSV: ",",
        SSV: " ",
        Multi: "Multi",
        TSV: "\t",
        Pipes: "|"
    }
})
// @from(Ln 152418, Col 4)
Y$7
// @from(Ln 152419, Col 4)
z$7 = v(() => {
    I71();
    Y$7 = ur("core-client")
})
// @from(Ln 152423, Col 0)
class s56 {
    constructor(A = {}) {
        var q, K;
        if (this._requestContentType = A.requestContentType, this._endpoint = (q = A.endpoint) !== null && q !== void 0 ? q : A.baseUri, A.baseUri) Y$7.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
        if (this._allowInsecureConnection = A.allowInsecureConnection, this._httpClient = A.httpClient || tH7(), this.pipeline = A.pipeline || Su5(A), (K = A.additionalPolicies) === null || K === void 0 ? void 0 : K.length)
            for (let {
                    policy: Y,
                    position: z
                }
                of A.additionalPolicies) {
                let w = z === "perRetry" ? "Sign" : void 0;
                this.pipeline.addPolicy(Y, {
                    afterPhase: w
                })
            }
    }
    async sendRequest(A) {
        return this.pipeline.sendRequest(this._httpClient, A)
    }
    async sendOperationRequest(A, q) {
        let K = q.baseUrl || this._endpoint;
        if (!K) throw Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
        let Y = q$7(K, q, A, this),
            z = $v({
                url: Y
            });
        z.method = q.httpMethod;
        let w = wU(z);
        w.operationSpec = q, w.operationArguments = A;
        let H = q.contentType || this._requestContentType;
        if (H && q.requestBody) z.headers.set("Content-Type", H);
        let $ = A.options;
        if ($) {
            let O = $.requestOptions;
            if (O) {
                if (O.timeout) z.timeout = O.timeout;
                if (O.onUploadProgress) z.onUploadProgress = O.onUploadProgress;
                if (O.onDownloadProgress) z.onDownloadProgress = O.onDownloadProgress;
                if (O.shouldDeserialize !== void 0) w.shouldDeserialize = O.shouldDeserialize;
                if (O.allowInsecureConnection) z.allowInsecureConnection = !0
            }
            if ($.abortSignal) z.abortSignal = $.abortSignal;
            if ($.tracingOptions) z.tracingOptions = $.tracingOptions
        }
        if (this._allowInsecureConnection) z.allowInsecureConnection = !0;
        if (z.streamResponseStatusCodes === void 0) z.streamResponseStatusCodes = nH7(q);
        try {
            let O = await this.sendRequest(z),
                _ = x3A(O, q.responses[O.status]);
            if ($ === null || $ === void 0 ? void 0 : $.onResponse) $.onResponse(O, _);
            return _
        } catch (O) {
            if (typeof O === "object" && (O === null || O === void 0 ? void 0 : O.response)) {
                let _ = O.response,
                    J = x3A(_, q.responses[O.statusCode] || q.responses.default);
                if (O.details = J, $ === null || $ === void 0 ? void 0 : $.onResponse) $.onResponse(_, J, O)
            }
            throw O
        }
    }
}
// @from(Ln 152485, Col 0)
function Su5(A) {
    let q = hu5(A),
        K = A.credential && q ? {
            credentialScopes: q,
            credential: A.credential
        } : void 0;
    return aH7(Object.assign(Object.assign({}, A), {
        credentialOptions: K
    }))
}
// @from(Ln 152496, Col 0)
function hu5(A) {
    if (A.credentialScopes) return A.credentialScopes;
    if (A.endpoint) return `${A.endpoint}/.default`;
    if (A.baseUri) return `${A.baseUri}/.default`;
    if (A.credential && !A.credentialScopes) throw Error("When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy");
    return
}
// @from(Ln 152503, Col 4)
w$7 = v(() => {
    Lu();
    sH7();
    b27();
    eH7();
    bS1();
    K$7();
    a56();
    z$7()
})
// @from(Ln 152513, Col 4)
H$7 = v(() => {
    w$7()
})
// @from(Ln 152517, Col 0)
function $$7(A) {
    if (A === "adfs") return "oauth2/token";
    else return "oauth2/v2.0/token"
}
// @from(Ln 152521, Col 4)
RY
// @from(Ln 152522, Col 4)
fM = v(() => {
    Tu();
    E5A();
    RY = hS1({
        namespace: "Microsoft.AAD",
        packageName: "@azure/identity",
        packageVersion: N56
    })
})
// @from(Ln 152532, Col 0)
function uS1(A) {
    let q = "";
    if (Array.isArray(A)) {
        if (A.length !== 1) return;
        q = A[0]
    } else if (typeof A === "string") q = A;
    if (!q.endsWith("/.default")) return q;
    return q.substr(0, q.lastIndexOf("/.default"))
}
// @from(Ln 152542, Col 0)
function _$7(A) {
    if (typeof A.expires_on === "number") return A.expires_on * 1000;
    if (typeof A.expires_on === "string") {
        let q = +A.expires_on;
        if (!isNaN(q)) return q * 1000;
        let K = Date.parse(A.expires_on);
        if (!isNaN(K)) return K
    }
    if (typeof A.expires_in === "number") return Date.now() + A.expires_in * 1000;
    throw Error(`Failed to parse token expiration from body. expires_in="${A.expires_in}", expires_on="${A.expires_on}"`)
}
// @from(Ln 152554, Col 0)
function J$7(A) {
    if (A.refresh_on) {
        if (typeof A.refresh_on === "number") return A.refresh_on * 1000;
        if (typeof A.refresh_on === "string") {
            let q = +A.refresh_on;
            if (!isNaN(q)) return q * 1000;
            let K = Date.parse(A.refresh_on);
            if (!isNaN(K)) return K
        }
        throw Error(`Failed to parse refresh_on from body. refresh_on="${A.refresh_on}"`)
    } else return
}
// @from(Ln 152566, Col 4)
O$7 = "Specifying a `clientId` or `resourceId` is not supported by the Service Fabric managed identity environment. The managed identity configuration is determined by the Service Fabric cluster resource configuration. See https://aka.ms/servicefabricmi for more information"
// @from(Ln 152568, Col 0)
function Iu5(A) {
    let q = A === null || A === void 0 ? void 0 : A.authorityHost;
    if (l56) q = q !== null && q !== void 0 ? q : process.env.AZURE_AUTHORITY_HOST;
    return q !== null && q !== void 0 ? q : WS1
}
// @from(Ln 152573, Col 4)
BS1 = "noCorrelationId"
// @from(Ln 152574, Col 4)
yu
// @from(Ln 152575, Col 4)
mS1 = v(() => {
    H$7();
    mr();
    Lu();
    bD();
    Tu();
    fM();
    t2();
    yu = class yu extends s56 {
        constructor(A) {
            var q, K;
            let Y = `azsdk-js-identity/${N56}`,
                z = ((q = A === null || A === void 0 ? void 0 : A.userAgentOptions) === null || q === void 0 ? void 0 : q.userAgentPrefix) ? `${A.userAgentOptions.userAgentPrefix} ${Y}` : `${Y}`,
                w = Iu5(A);
            if (!w.startsWith("https:")) throw Error("The authorityHost address must use the 'https' protocol.");
            super(Object.assign(Object.assign({
                requestContentType: "application/json; charset=utf-8",
                retryOptions: {
                    maxRetries: 3
                }
            }, A), {
                userAgentOptions: {
                    userAgentPrefix: z
                },
                baseUri: w
            }));
            if (this.allowInsecureConnection = !1, this.authorityHost = w, this.abortControllers = new Map, this.allowLoggingAccountIdentifiers = (K = A === null || A === void 0 ? void 0 : A.loggingOptions) === null || K === void 0 ? void 0 : K.allowLoggingAccountIdentifiers, this.tokenCredentialOptions = Object.assign({}, A), A === null || A === void 0 ? void 0 : A.allowInsecureConnection) this.allowInsecureConnection = A.allowInsecureConnection
        }
        async sendTokenRequest(A) {
            EV.info(`IdentityClient: sending token request to [${A.url}]`);
            let q = await this.sendRequest(A);
            if (q.bodyAsText && (q.status === 200 || q.status === 201)) {
                let K = JSON.parse(q.bodyAsText);
                if (!K.access_token) return null;
                this.logIdentifiers(q);
                let Y = {
                    accessToken: {
                        token: K.access_token,
                        expiresOnTimestamp: _$7(K),
                        refreshAfterTimestamp: J$7(K),
                        tokenType: "Bearer"
                    },
                    refreshToken: K.refresh_token
                };
                return EV.info(`IdentityClient: [${A.url}] token acquired, expires on ${Y.accessToken.expiresOnTimestamp}`), Y
            } else {
                let K = new ZS(q.status, q.bodyAsText);
                throw EV.warning(`IdentityClient: authentication error. HTTP status: ${q.status}, ${K.errorResponse.errorDescription}`), K
            }
        }
        async refreshAccessToken(A, q, K, Y, z, w = {}) {
            if (Y === void 0) return null;
            EV.info(`IdentityClient: refreshing access token with client ID: ${q}, scopes: ${K} started`);
            let H = {
                grant_type: "refresh_token",
                client_id: q,
                refresh_token: Y,
                scope: K
            };
            if (z !== void 0) H.client_secret = z;
            let $ = new URLSearchParams(H);
            return RY.withSpan("IdentityClient.refreshAccessToken", w, async (O) => {
                try {
                    let _ = $$7(A),
                        J = $v({
                            url: `${this.authorityHost}/${A}/${_}`,
                            method: "POST",
                            body: $.toString(),
                            abortSignal: w.abortSignal,
                            headers: zU({
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded"
                            }),
                            tracingOptions: O.tracingOptions
                        }),
                        X = await this.sendTokenRequest(J);
                    return EV.info(`IdentityClient: refreshed token for client ID: ${q}`), X
                } catch (_) {
                    if (_.name === GS1 && _.errorResponse.error === "interaction_required") return EV.info(`IdentityClient: interaction required for client ID: ${q}`), null;
                    else throw EV.warning(`IdentityClient: failed refreshing token for client ID: ${q}: ${_}`), _
                }
            })
        }
        generateAbortSignal(A) {
            let q = new AbortController,
                K = this.abortControllers.get(A) || [];
            K.push(q), this.abortControllers.set(A, K);
            let Y = q.signal.onabort;
            return q.signal.onabort = (...z) => {
                if (this.abortControllers.set(A, void 0), Y) Y.apply(q.signal, z)
            }, q.signal
        }
        abortRequests(A) {
            let q = A || BS1,
                K = [...this.abortControllers.get(q) || [], ...this.abortControllers.get(BS1) || []];
            if (!K.length) return;
            for (let Y of K) Y.abort();
            this.abortControllers.set(q, void 0)
        }
        getCorrelationId(A) {
            var q;
            let K = (q = A === null || A === void 0 ? void 0 : A.body) === null || q === void 0 ? void 0 : q.split("&").map((Y) => Y.split("=")).find(([Y]) => Y === "client-request-id");
            return K && K.length ? K[1] || BS1 : BS1
        }
        async sendGetRequestAsync(A, q) {
            let K = $v({
                    url: A,
                    method: "GET",
                    body: q === null || q === void 0 ? void 0 : q.body,
                    allowInsecureConnection: this.allowInsecureConnection,
                    headers: zU(q === null || q === void 0 ? void 0 : q.headers),
                    abortSignal: this.generateAbortSignal(BS1)
                }),
                Y = await this.sendRequest(K);
            return this.logIdentifiers(Y), {
                body: Y.bodyAsText ? JSON.parse(Y.bodyAsText) : void 0,
                headers: Y.headers.toJSON(),
                status: Y.status
            }
        }
        async sendPostRequestAsync(A, q) {
            let K = $v({
                    url: A,
                    method: "POST",
                    body: q === null || q === void 0 ? void 0 : q.body,
                    headers: zU(q === null || q === void 0 ? void 0 : q.headers),
                    allowInsecureConnection: this.allowInsecureConnection,
                    abortSignal: this.generateAbortSignal(this.getCorrelationId(q))
                }),
                Y = await this.sendRequest(K);
            return this.logIdentifiers(Y), {
                body: Y.bodyAsText ? JSON.parse(Y.bodyAsText) : void 0,
                headers: Y.headers.toJSON(),
                status: Y.status
            }
        }
        getTokenCredentialOptions() {
            return this.tokenCredentialOptions
        }
        logIdentifiers(A) {
            if (!this.allowLoggingAccountIdentifiers || !A.bodyAsText) return;
            let q = "No User Principal Name available";
            try {
                let Y = (A.parsedBody || JSON.parse(A.bodyAsText)).access_token;
                if (!Y) return;
                let z = Y.split(".")[1],
                    {
                        appid: w,
                        upn: H,
                        tid: $,
                        oid: O
                    } = JSON.parse(Buffer.from(z, "base64").toString("utf8"));
                EV.info(`[Authenticated account] Client ID: ${w}. Tenant ID: ${$}. User Principal Name: ${H||q}. Object ID (user): ${O}`)
            } catch (K) {
                EV.warning("allowLoggingAccountIdentifiers was set, but we couldn't log the account information. Error:", K.message)
            }
        }
    }
})
// @from(Ln 152738, Col 0)
function X$7(A) {
    let q = Fu5[A];
    if (q) throw new f4(q)
}
// @from(Ln 152743, Col 0)
function D$7(A) {
    let q = ["User", "settings.json"],
        K = "Code",
        Y = bu5.homedir();

    function z(...w) {
        let H = uu5.join(...w, "Code", ...q);
        return JSON.parse(xu5.readFileSync(H, {
            encoding: "utf8"
        }))[A]
    }
    try {
        let w;
        switch (process.platform) {
            case "win32":
                return w = process.env.APPDATA, w ? z(w) : void 0;
            case "darwin":
                return z(Y, "Library", "Application Support");
            case "linux":
                return z(Y, ".config");
            default:
                return
        }
    } catch (w) {
        u71.info(`Failed to load the Visual Studio Code configuration file. Error: ${w.message}`);
        return
    }
}
// @from(Ln 152771, Col 0)
class h5A {
    constructor(A) {
        this.cloudName = D$7("azure.cloud") || "AzureCloud";
        let q = Qu5[this.cloudName];
        if (this.identityClient = new yu(Object.assign({
                authorityHost: q
            }, A)), A && A.tenantId) NX(u71, A.tenantId), this.tenantId = A.tenantId;
        else this.tenantId = Bu5;
        this.additionallyAllowedTenantIds = m$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), X$7(this.tenantId)
    }
    async prepare() {
        let A = D$7("azure.tenant");
        if (A) this.tenantId = A;
        X$7(this.tenantId)
    }
    prepareOnce() {
        if (!this.preparePromise) this.preparePromise = this.prepare();
        return this.preparePromise
    }
    async getToken(A, q) {
        var K, Y;
        await this.prepareOnce();
        let z = rH(this.tenantId, q, this.additionallyAllowedTenantIds, u71) || this.tenantId;
        if (S5A === void 0) throw new f4(["No implementation of `VisualStudioCodeCredential` is available.", "You must install the identity-vscode plugin package (`npm install --save-dev @azure/identity-vscode`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(vsCodePlugin)` before creating a `VisualStudioCodeCredential`.", "To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot."].join(" "));
        let w = typeof A === "string" ? A : A.join(" ");
        if (!w.match(/^[0-9a-zA-Z-.:/]+$/)) {
            let O = Error("Invalid scope was specified by the user or calling client");
            throw u71.getToken.info(e9(A, O)), O
        }
        if (w.indexOf("offline_access") < 0) w += " offline_access";
        let H = await S5A(),
            {
                password: $
            } = (Y = (K = H.find(({
                account: O
            }) => O === this.cloudName)) !== null && K !== void 0 ? K : H[0]) !== null && Y !== void 0 ? Y : {};
        if ($) {
            let O = await this.identityClient.refreshAccessToken(z, mu5, w, $, void 0);
            if (O) return u71.getToken.info(VX(A)), O.accessToken;
            else {
                let _ = new f4("Could not retrieve the token associated with Visual Studio Code. Have you connected using the 'Azure Account' extension recently? To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot.");
                throw u71.getToken.info(e9(A, _)), _
            }
        } else {
            let O = new f4("Could not retrieve the token associated with Visual Studio Code. Did you connect using the 'Azure Account' extension? To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot.");
            throw u71.getToken.info(e9(A, O)), O
        }
    }
}
// @from(Ln 152820, Col 4)
Bu5 = "common"
// @from(Ln 152821, Col 4)
mu5 = "aebc6443-996d-45c2-90f0-388ff96faa56"
// @from(Ln 152822, Col 4)
u71
// @from(Ln 152822, Col 9)
S5A = void 0
// @from(Ln 152823, Col 4)
j$7
// @from(Ln 152823, Col 9)
Fu5
// @from(Ln 152823, Col 14)
Qu5
// @from(Ln 152824, Col 4)
I5A = v(() => {
    t2();
    uD();
    Tu();
    bD();
    mS1();
    uD();
    u71 = n3("VisualStudioCodeCredential"), j$7 = {
        setVsCodeCredentialFinder(A) {
            S5A = A
        }
    }, Fu5 = {
        adfs: "The VisualStudioCodeCredential does not support authentication with ADFS tenants."
    };
    Qu5 = {
        AzureCloud: Nu.AzurePublicCloud,
        AzureChina: Nu.AzureChina,
        AzureGermanCloud: Nu.AzureGermany,
        AzureUSGovernment: Nu.AzureGovernment
    }
})
// @from(Ln 152846, Col 0)
function Uu5(A) {
    A(gu5)
}
// @from(Ln 152849, Col 4)
gu5
// @from(Ln 152850, Col 4)
M$7 = v(() => {
    v3A();
    I5A();
    gu5 = {
        cachePluginControl: P27,
        nativeBrokerPluginControl: W27,
        vsCodeCredentialControl: j$7
    }
})
// @from(Ln 152859, Col 0)
class B71 {
    static serializeJSONBlob(A) {
        return JSON.stringify(A)
    }
    static serializeAccounts(A) {
        let q = {};
        return Object.keys(A).map(function(K) {
            let Y = A[K];
            q[K] = {
                home_account_id: Y.homeAccountId,
                environment: Y.environment,
                realm: Y.realm,
                local_account_id: Y.localAccountId,
                username: Y.username,
                authority_type: Y.authorityType,
                name: Y.name,
                client_info: Y.clientInfo,
                last_modification_time: Y.lastModificationTime,
                last_modification_app: Y.lastModificationApp,
                tenantProfiles: Y.tenantProfiles?.map((z) => {
                    return JSON.stringify(z)
                })
            }
        }), q
    }
    static serializeIdTokens(A) {
        let q = {};
        return Object.keys(A).map(function(K) {
            let Y = A[K];
            q[K] = {
                home_account_id: Y.homeAccountId,
                environment: Y.environment,
                credential_type: Y.credentialType,
                client_id: Y.clientId,
                secret: Y.secret,
                realm: Y.realm
            }
        }), q
    }
    static serializeAccessTokens(A) {
        let q = {};
        return Object.keys(A).map(function(K) {
            let Y = A[K];
            q[K] = {
                home_account_id: Y.homeAccountId,
                environment: Y.environment,
                credential_type: Y.credentialType,
                client_id: Y.clientId,
                secret: Y.secret,
                realm: Y.realm,
                target: Y.target,
                cached_at: Y.cachedAt,
                expires_on: Y.expiresOn,
                extended_expires_on: Y.extendedExpiresOn,
                refresh_on: Y.refreshOn,
                key_id: Y.keyId,
                token_type: Y.tokenType,
                requestedClaims: Y.requestedClaims,
                requestedClaimsHash: Y.requestedClaimsHash,
                userAssertionHash: Y.userAssertionHash
            }
        }), q
    }
    static serializeRefreshTokens(A) {
        let q = {};
        return Object.keys(A).map(function(K) {
            let Y = A[K];
            q[K] = {
                home_account_id: Y.homeAccountId,
                environment: Y.environment,
                credential_type: Y.credentialType,
                client_id: Y.clientId,
                secret: Y.secret,
                family_id: Y.familyId,
                target: Y.target,
                realm: Y.realm
            }
        }), q
    }
    static serializeAppMetadata(A) {
        let q = {};
        return Object.keys(A).map(function(K) {
            let Y = A[K];
            q[K] = {
                client_id: Y.clientId,
                environment: Y.environment,
                family_id: Y.familyId
            }
        }), q
    }
    static serializeAllCache(A) {
        return {
            Account: this.serializeAccounts(A.accounts),
            IdToken: this.serializeIdTokens(A.idTokens),
            AccessToken: this.serializeAccessTokens(A.accessTokens),
            RefreshToken: this.serializeRefreshTokens(A.refreshTokens),
            AppMetadata: this.serializeAppMetadata(A.appMetadata)
        }
    }
}
// @from(Ln 152959, Col 4)
t56 = v(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 152961, Col 4)
uA
// @from(Ln 152961, Col 8)
B3
// @from(Ln 152961, Col 12)
ZW
// @from(Ln 152961, Col 16)
x5A
// @from(Ln 152961, Col 21)
PH
// @from(Ln 152961, Col 25)
LV
// @from(Ln 152961, Col 29)
m71
// @from(Ln 152961, Col 34)
Qr
// @from(Ln 152961, Col 38)
e56
// @from(Ln 152961, Col 43)
nJ1
// @from(Ln 152961, Col 48)
Cu
// @from(Ln 152961, Col 52)
RV
// @from(Ln 152961, Col 56)
F71
// @from(Ln 152961, Col 61)
HU
// @from(Ln 152961, Col 65)
tz
// @from(Ln 152961, Col 69)
FS1 = "appmetadata"
// @from(Ln 152962, Col 4)
P$7 = "client_info"
// @from(Ln 152963, Col 4)
gr = "1"
// @from(Ln 152964, Col 4)
rJ1
// @from(Ln 152964, Col 9)
nG
// @from(Ln 152964, Col 13)
BD
// @from(Ln 152964, Col 17)
b9
// @from(Ln 152964, Col 21)
Su
// @from(Ln 152964, Col 25)
QS1
// @from(Ln 152964, Col 30)
gS1
// @from(Ln 152964, Col 35)
Q71
// @from(Ln 152964, Col 40)
A96
// @from(Ln 152964, Col 45)
Ew
// @from(Ln 152964, Col 49)
oJ1 = 300
// @from(Ln 152965, Col 4)
VM
// @from(Ln 152966, Col 4)
WH = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    uA = {
        LIBRARY_NAME: "MSAL.JS",
        SKU: "msal.js.common",
        DEFAULT_AUTHORITY: "https://login.microsoftonline.com/common/",
        DEFAULT_AUTHORITY_HOST: "login.microsoftonline.com",
        DEFAULT_COMMON_TENANT: "common",
        ADFS: "adfs",
        DSTS: "dstsv2",
        AAD_INSTANCE_DISCOVERY_ENDPT: "https://login.microsoftonline.com/common/discovery/instance?api-version=1.1&authorization_endpoint=",
        CIAM_AUTH_URL: ".ciamlogin.com",
        AAD_TENANT_DOMAIN_SUFFIX: ".onmicrosoft.com",
        RESOURCE_DELIM: "|",
        NO_ACCOUNT: "NO_ACCOUNT",
        CLAIMS: "claims",
        CONSUMER_UTID: "9188040d-6c67-4c5b-b112-36a304b66dad",
        OPENID_SCOPE: "openid",
        PROFILE_SCOPE: "profile",
        OFFLINE_ACCESS_SCOPE: "offline_access",
        EMAIL_SCOPE: "email",
        CODE_GRANT_TYPE: "authorization_code",
        RT_GRANT_TYPE: "refresh_token",
        S256_CODE_CHALLENGE_METHOD: "S256",
        URL_FORM_CONTENT_TYPE: "application/x-www-form-urlencoded;charset=utf-8",
        AUTHORIZATION_PENDING: "authorization_pending",
        NOT_DEFINED: "not_defined",
        EMPTY_STRING: "",
        NOT_APPLICABLE: "N/A",
        NOT_AVAILABLE: "Not Available",
        FORWARD_SLASH: "/",
        IMDS_ENDPOINT: "http://169.254.169.254/metadata/instance/compute/location",
        IMDS_VERSION: "2020-06-01",
        IMDS_TIMEOUT: 2000,
        AZURE_REGION_AUTO_DISCOVER_FLAG: "TryAutoDetect",
        REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX: "login.microsoft.com",
        KNOWN_PUBLIC_CLOUDS: ["login.microsoftonline.com", "login.windows.net", "login.microsoft.com", "sts.windows.net"],
        SHR_NONCE_VALIDITY: 240,
        INVALID_INSTANCE: "invalid_instance"
    }, B3 = {
        SUCCESS: 200,
        SUCCESS_RANGE_START: 200,
        SUCCESS_RANGE_END: 299,
        REDIRECT: 302,
        CLIENT_ERROR: 400,
        CLIENT_ERROR_RANGE_START: 400,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        REQUEST_TIMEOUT: 408,
        GONE: 410,
        TOO_MANY_REQUESTS: 429,
        CLIENT_ERROR_RANGE_END: 499,
        SERVER_ERROR: 500,
        SERVER_ERROR_RANGE_START: 500,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
        SERVER_ERROR_RANGE_END: 599,
        MULTI_SIDED_ERROR: 600
    }, ZW = [uA.OPENID_SCOPE, uA.PROFILE_SCOPE, uA.OFFLINE_ACCESS_SCOPE], x5A = [...ZW, uA.EMAIL_SCOPE], PH = {
        CONTENT_TYPE: "Content-Type",
        CONTENT_LENGTH: "Content-Length",
        RETRY_AFTER: "Retry-After",
        CCS_HEADER: "X-AnchorMailbox",
        WWWAuthenticate: "WWW-Authenticate",
        AuthenticationInfo: "Authentication-Info",
        X_MS_REQUEST_ID: "x-ms-request-id",
        X_MS_HTTP_VERSION: "x-ms-httpver"
    }, LV = {
        COMMON: "common",
        ORGANIZATIONS: "organizations",
        CONSUMERS: "consumers"
    }, m71 = {
        ACCESS_TOKEN: "access_token",
        XMS_CC: "xms_cc"
    }, Qr = {
        LOGIN: "login",
        SELECT_ACCOUNT: "select_account",
        CONSENT: "consent",
        NONE: "none",
        CREATE: "create",
        NO_SESSION: "no_session"
    }, e56 = {
        PLAIN: "plain",
        S256: "S256"
    }, nJ1 = {
        CODE: "code",
        IDTOKEN_TOKEN: "id_token token",
        IDTOKEN_TOKEN_REFRESHTOKEN: "id_token token refresh_token"
    }, Cu = {
        QUERY: "query",
        FRAGMENT: "fragment",
        FORM_POST: "form_post"
    }, RV = {
        IMPLICIT_GRANT: "implicit",
        AUTHORIZATION_CODE_GRANT: "authorization_code",
        CLIENT_CREDENTIALS_GRANT: "client_credentials",
        RESOURCE_OWNER_PASSWORD_GRANT: "password",
        REFRESH_TOKEN_GRANT: "refresh_token",
        DEVICE_CODE_GRANT: "device_code",
        JWT_BEARER: "urn:ietf:params:oauth:grant-type:jwt-bearer"
    }, F71 = {
        MSSTS_ACCOUNT_TYPE: "MSSTS",
        ADFS_ACCOUNT_TYPE: "ADFS",
        MSAV1_ACCOUNT_TYPE: "MSA",
        GENERIC_ACCOUNT_TYPE: "Generic"
    }, HU = {
        CACHE_KEY_SEPARATOR: "-",
        CLIENT_INFO_SEPARATOR: "."
    }, tz = {
        ID_TOKEN: "IdToken",
        ACCESS_TOKEN: "AccessToken",
        ACCESS_TOKEN_WITH_AUTH_SCHEME: "AccessToken_With_AuthScheme",
        REFRESH_TOKEN: "RefreshToken"
    }, rJ1 = {
        CACHE_KEY: "authority-metadata",
        REFRESH_TIME_SECONDS: 86400
    }, nG = {
        CONFIG: "config",
        CACHE: "cache",
        NETWORK: "network",
        HARDCODED_VALUES: "hardcoded_values"
    }, BD = {
        SCHEMA_VERSION: 5,
        MAX_LAST_HEADER_BYTES: 330,
        MAX_CACHED_ERRORS: 50,
        CACHE_KEY: "server-telemetry",
        CATEGORY_SEPARATOR: "|",
        VALUE_SEPARATOR: ",",
        OVERFLOW_TRUE: "1",
        OVERFLOW_FALSE: "0",
        UNKNOWN_ERROR: "unknown_error"
    }, b9 = {
        BEARER: "Bearer",
        POP: "pop",
        SSH: "ssh-cert"
    }, Su = {
        DEFAULT_THROTTLE_TIME_SECONDS: 60,
        DEFAULT_MAX_THROTTLE_TIME_SECONDS: 3600,
        THROTTLING_PREFIX: "throttling",
        X_MS_LIB_CAPABILITY_VALUE: "retry-after, h429"
    }, QS1 = {
        INVALID_GRANT_ERROR: "invalid_grant",
        CLIENT_MISMATCH_ERROR: "client_mismatch"
    }, gS1 = {
        username: "username",
        password: "password"
    }, Q71 = {
        FAILED_AUTO_DETECTION: "1",
        INTERNAL_CACHE: "2",
        ENVIRONMENT_VARIABLE: "3",
        IMDS: "4"
    }, A96 = {
        CONFIGURED_NO_AUTO_DETECTION: "2",
        AUTO_DETECTION_REQUESTED_SUCCESSFUL: "4",
        AUTO_DETECTION_REQUESTED_FAILED: "5"
    }, Ew = {
        NOT_APPLICABLE: "0",
        FORCE_REFRESH_OR_CLAIMS: "1",
        NO_CACHED_ACCESS_TOKEN: "2",
        CACHED_ACCESS_TOKEN_EXPIRED: "3",
        PROACTIVELY_REFRESHED: "4"
    }, VM = {
        BASE64: "base64",
        HEX: "hex",
        UTF8: "utf-8"
    }
})
// @from(Ln 153134, Col 4)
aJ1 = {}
// @from(Ln 153139, Col 4)
US1 = "unexpected_error"
// @from(Ln 153140, Col 4)
pS1 = "post_request_failed"
// @from(Ln 153141, Col 4)
b5A = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 153144, Col 0)
function B5A(A, q) {
    return new m3(A, q ? `${q96[A]} ${q}` : q96[A])
}
// @from(Ln 153147, Col 4)
q96
// @from(Ln 153147, Col 9)
u5A
// @from(Ln 153147, Col 14)
m3
// @from(Ln 153148, Col 4)
LL = v(() => {
    WH();
    b5A(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    q96 = {
        [US1]: "Unexpected error in authentication.",
        [pS1]: "Post request failed from the network, could be a 4xx/5xx or a network unavailability. Please check the exact error code for details."
    }, u5A = {
        unexpectedError: {
            code: US1,
            desc: q96[US1]
        },
        postRequestFailed: {
            code: pS1,
            desc: q96[pS1]
        }
    };
    m3 = class m3 extends Error {
        constructor(A, q, K) {
            let Y = q ? `${A}: ${q}` : A;
            super(Y);
            Object.setPrototypeOf(this, m3.prototype), this.errorCode = A || uA.EMPTY_STRING, this.errorMessage = q || uA.EMPTY_STRING, this.subError = K || uA.EMPTY_STRING, this.name = "AuthError"
        }
        setCorrelationId(A) {
            this.correlationId = A
        }
    }
})
// @from(Ln 153175, Col 4)
e2 = {}
// @from(Ln 153222, Col 4)
Ur = "client_info_decoding_error"
// @from(Ln 153223, Col 4)
g71 = "client_info_empty_error"
// @from(Ln 153224, Col 4)
pr = "token_parsing_error"
// @from(Ln 153225, Col 4)
U71 = "null_or_empty_token"
// @from(Ln 153226, Col 4)
rG = "endpoints_resolution_error"
// @from(Ln 153227, Col 4)
p71 = "network_error"
// @from(Ln 153228, Col 4)
d71 = "openid_config_error"
// @from(Ln 153229, Col 4)
c71 = "hash_not_deserialized"
// @from(Ln 153230, Col 4)
TS = "invalid_state"
// @from(Ln 153231, Col 4)
l71 = "state_mismatch"
// @from(Ln 153232, Col 4)
dr = "state_not_found"
// @from(Ln 153233, Col 4)
i71 = "nonce_mismatch"
// @from(Ln 153234, Col 4)
$U = "auth_time_not_found"
// @from(Ln 153235, Col 4)
n71 = "max_age_transpired"
// @from(Ln 153236, Col 4)
dS1 = "multiple_matching_tokens"
// @from(Ln 153237, Col 4)
cS1 = "multiple_matching_accounts"
// @from(Ln 153238, Col 4)
r71 = "multiple_matching_appMetadata"
// @from(Ln 153239, Col 4)
o71 = "request_cannot_be_made"
// @from(Ln 153240, Col 4)
a71 = "cannot_remove_empty_scope"
// @from(Ln 153241, Col 4)
s71 = "cannot_append_scopeset"
// @from(Ln 153242, Col 4)
cr = "empty_input_scopeset"
// @from(Ln 153243, Col 4)
lS1 = "device_code_polling_cancelled"
// @from(Ln 153244, Col 4)
iS1 = "device_code_expired"
// @from(Ln 153245, Col 4)
nS1 = "device_code_unknown_error"
// @from(Ln 153246, Col 4)
OU = "no_account_in_silent_request"
// @from(Ln 153247, Col 4)
t71 = "invalid_cache_record"
// @from(Ln 153248, Col 4)
_U = "invalid_cache_environment"
// @from(Ln 153249, Col 4)
rS1 = "no_account_found"
// @from(Ln 153250, Col 4)
lr = "no_crypto_object"
// @from(Ln 153251, Col 4)
oS1 = "unexpected_credential_type"
// @from(Ln 153252, Col 4)
aS1 = "invalid_assertion"
// @from(Ln 153253, Col 4)
sS1 = "invalid_client_credential"
// @from(Ln 153254, Col 4)
JU = "token_refresh_required"
// @from(Ln 153255, Col 4)
tS1 = "user_timeout_reached"
// @from(Ln 153256, Col 4)
e71 = "token_claims_cnf_required_for_signedjwt"
// @from(Ln 153257, Col 4)
A41 = "authorization_code_missing_from_server_response"
// @from(Ln 153258, Col 4)
eS1 = "binding_key_not_removed"
// @from(Ln 153259, Col 4)
q41 = "end_session_endpoint_not_supported"
// @from(Ln 153260, Col 4)
K41 = "key_id_missing"
// @from(Ln 153261, Col 4)
Ah1 = "no_network_connectivity"
// @from(Ln 153262, Col 4)
qh1 = "user_canceled"
// @from(Ln 153263, Col 4)
Kh1 = "missing_tenant_id_error"
// @from(Ln 153264, Col 4)
x5 = "method_not_implemented"
// @from(Ln 153265, Col 4)
Yh1 = "nested_app_auth_bridge_disabled"
// @from(Ln 153266, Col 4)
XJ = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 153269, Col 0)
function Y8(A, q) {
    return new ir(A, q)
}
// @from(Ln 153272, Col 4)
F3
// @from(Ln 153272, Col 8)
m5A
// @from(Ln 153272, Col 13)
ir
// @from(Ln 153273, Col 4)
TX = v(() => {
    LL();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    F3 = {
        [Ur]: "The client info could not be parsed/decoded correctly",
        [g71]: "The client info was empty",
        [pr]: "Token cannot be parsed",
        [U71]: "The token is null or empty",
        [rG]: "Endpoints cannot be resolved",
        [p71]: "Network request failed",
        [d71]: "Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints.",
        [c71]: "The hash parameters could not be deserialized",
        [TS]: "State was not the expected format",
        [l71]: "State mismatch error",
        [dr]: "State not found",
        [i71]: "Nonce mismatch error",
        [$U]: "Max Age was requested and the ID token is missing the auth_time variable. auth_time is an optional claim and is not enabled by default - it must be enabled. See https://aka.ms/msaljs/optional-claims for more information.",
        [n71]: "Max Age is set to 0, or too much time has elapsed since the last end-user authentication.",
        [dS1]: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account.",
        [cS1]: "The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account",
        [r71]: "The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata",
        [o71]: "Token request cannot be made without authorization code or refresh token.",
        [a71]: "Cannot remove null or empty scope from ScopeSet",
        [s71]: "Cannot append ScopeSet",
        [cr]: "Empty input ScopeSet cannot be processed",
        [lS1]: "Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true.",
        [iS1]: "Device code is expired.",
        [nS1]: "Device code stopped polling for unknown reasons.",
        [OU]: "Please pass an account object, silent flow is not supported without account information",
        [t71]: "Cache record object was null or undefined.",
        [_U]: "Invalid environment when attempting to create cache entry",
        [rS1]: "No account found in cache for given key.",
        [lr]: "No crypto object detected.",
        [oS1]: "Unexpected credential type.",
        [aS1]: "Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515",
        [sS1]: "Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential",
        [JU]: "Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired.",
        [tS1]: "User defined timeout for device code polling reached",
        [e71]: "Cannot generate a POP jwt if the token_claims are not populated",
        [A41]: "Server response does not contain an authorization code to proceed",
        [eS1]: "Could not remove the credential's binding key from storage.",
        [q41]: "The provided authority does not support logout",
        [K41]: "A keyId value is missing from the requested bound token's cache record and is required to match the token to it's stored binding key.",
        [Ah1]: "No network connectivity. Check your internet connection.",
        [qh1]: "User cancelled the flow.",
        [Kh1]: "A tenant id - not common, organizations, or consumers - must be specified when using the client_credentials flow.",
        [x5]: "This method has not been implemented",
        [Yh1]: "The nested app auth bridge is disabled"
    }, m5A = {
        clientInfoDecodingError: {
            code: Ur,
            desc: F3[Ur]
        },
        clientInfoEmptyError: {
            code: g71,
            desc: F3[g71]
        },
        tokenParsingError: {
            code: pr,
            desc: F3[pr]
        },
        nullOrEmptyToken: {
            code: U71,
            desc: F3[U71]
        },
        endpointResolutionError: {
            code: rG,
            desc: F3[rG]
        },
        networkError: {
            code: p71,
            desc: F3[p71]
        },
        unableToGetOpenidConfigError: {
            code: d71,
            desc: F3[d71]
        },
        hashNotDeserialized: {
            code: c71,
            desc: F3[c71]
        },
        invalidStateError: {
            code: TS,
            desc: F3[TS]
        },
        stateMismatchError: {
            code: l71,
            desc: F3[l71]
        },
        stateNotFoundError: {
            code: dr,
            desc: F3[dr]
        },
        nonceMismatchError: {
            code: i71,
            desc: F3[i71]
        },
        authTimeNotFoundError: {
            code: $U,
            desc: F3[$U]
        },
        maxAgeTranspired: {
            code: n71,
            desc: F3[n71]
        },
        multipleMatchingTokens: {
            code: dS1,
            desc: F3[dS1]
        },
        multipleMatchingAccounts: {
            code: cS1,
            desc: F3[cS1]
        },
        multipleMatchingAppMetadata: {
            code: r71,
            desc: F3[r71]
        },
        tokenRequestCannotBeMade: {
            code: o71,
            desc: F3[o71]
        },
        removeEmptyScopeError: {
            code: a71,
            desc: F3[a71]
        },
        appendScopeSetError: {
            code: s71,
            desc: F3[s71]
        },
        emptyInputScopeSetError: {
            code: cr,
            desc: F3[cr]
        },
        DeviceCodePollingCancelled: {
            code: lS1,
            desc: F3[lS1]
        },
        DeviceCodeExpired: {
            code: iS1,
            desc: F3[iS1]
        },
        DeviceCodeUnknownError: {
            code: nS1,
            desc: F3[nS1]
        },
        NoAccountInSilentRequest: {
            code: OU,
            desc: F3[OU]
        },
        invalidCacheRecord: {
            code: t71,
            desc: F3[t71]
        },
        invalidCacheEnvironment: {
            code: _U,
            desc: F3[_U]
        },
        noAccountFound: {
            code: rS1,
            desc: F3[rS1]
        },
        noCryptoObj: {
            code: lr,
            desc: F3[lr]
        },
        unexpectedCredentialType: {
            code: oS1,
            desc: F3[oS1]
        },
        invalidAssertion: {
            code: aS1,
            desc: F3[aS1]
        },
        invalidClientCredential: {
            code: sS1,
            desc: F3[sS1]
        },
        tokenRefreshRequired: {
            code: JU,
            desc: F3[JU]
        },
        userTimeoutReached: {
            code: tS1,
            desc: F3[tS1]
        },
        tokenClaimsRequired: {
            code: e71,
            desc: F3[e71]
        },
        noAuthorizationCodeFromServer: {
            code: A41,
            desc: F3[A41]
        },
        bindingKeyNotRemovedError: {
            code: eS1,
            desc: F3[eS1]
        },
        logoutNotSupported: {
            code: q41,
            desc: F3[q41]
        },
        keyIdMissing: {
            code: K41,
            desc: F3[K41]
        },
        noNetworkConnectivity: {
            code: Ah1,
            desc: F3[Ah1]
        },
        userCanceledError: {
            code: qh1,
            desc: F3[qh1]
        },
        missingTenantIdError: {
            code: Kh1,
            desc: F3[Kh1]
        },
        nestedAppAuthBridgeDisabled: {
            code: Yh1,
            desc: F3[Yh1]
        }
    };
    ir = class ir extends m3 {
        constructor(A, q) {
            super(A, q ? `${F3[A]}: ${q}` : F3[A]);
            this.name = "ClientAuthError", Object.setPrototypeOf(this, ir.prototype)
        }
    }
})
// @from(Ln 153502, Col 4)
sJ1
// @from(Ln 153503, Col 4)
F5A = v(() => {
    TX();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    sJ1 = {
        createNewGuid: () => {
            throw Y8(x5)
        },
        base64Decode: () => {
            throw Y8(x5)
        },
        base64Encode: () => {
            throw Y8(x5)
        },
        base64UrlEncode: () => {
            throw Y8(x5)
        },
        encodeKid: () => {
            throw Y8(x5)
        },
        async getPublicKeyThumbprint() {
            throw Y8(x5)
        },
        async removeTokenBindingKey() {
            throw Y8(x5)
        },
        async clearKeystore() {
            throw Y8(x5)
        },
        async signJwt() {
            throw Y8(x5)
        },
        async hashString() {
            throw Y8(x5)
        }
    }
})
// @from(Ln 153539, Col 0)
class yV {
    constructor(A, q, K) {
        this.level = mO.Info;
        let Y = () => {
                return
            },
            z = A || yV.createDefaultLoggerOptions();
        this.localCallback = z.loggerCallback || Y, this.piiLoggingEnabled = z.piiLoggingEnabled || !1, this.level = typeof z.logLevel === "number" ? z.logLevel : mO.Info, this.correlationId = z.correlationId || uA.EMPTY_STRING, this.packageName = q || uA.EMPTY_STRING, this.packageVersion = K || uA.EMPTY_STRING
    }
    static createDefaultLoggerOptions() {
        return {
            loggerCallback: () => {},
            piiLoggingEnabled: !1,
            logLevel: mO.Info
        }
    }
    clone(A, q, K) {
        return new yV({
            loggerCallback: this.localCallback,
            piiLoggingEnabled: this.piiLoggingEnabled,
            logLevel: this.level,
            correlationId: K || this.correlationId
        }, A, q)
    }
    logMessage(A, q) {
        if (q.logLevel > this.level || !this.piiLoggingEnabled && q.containsPii) return;
        let z = `${`[${new Date().toUTCString()}] : [${q.correlationId||this.correlationId||""}]`} : ${this.packageName}@${this.packageVersion} : ${mO[q.logLevel]} - ${A}`;
        this.executeCallback(q.logLevel, z, q.containsPii || !1)
    }
    executeCallback(A, q, K) {
        if (this.localCallback) this.localCallback(A, q, K)
    }
    error(A, q) {
        this.logMessage(A, {
            logLevel: mO.Error,
            containsPii: !1,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    errorPii(A, q) {
        this.logMessage(A, {
            logLevel: mO.Error,
            containsPii: !0,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    warning(A, q) {
        this.logMessage(A, {
            logLevel: mO.Warning,
            containsPii: !1,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    warningPii(A, q) {
        this.logMessage(A, {
            logLevel: mO.Warning,
            containsPii: !0,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    info(A, q) {
        this.logMessage(A, {
            logLevel: mO.Info,
            containsPii: !1,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    infoPii(A, q) {
        this.logMessage(A, {
            logLevel: mO.Info,
            containsPii: !0,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    verbose(A, q) {
        this.logMessage(A, {
            logLevel: mO.Verbose,
            containsPii: !1,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    verbosePii(A, q) {
        this.logMessage(A, {
            logLevel: mO.Verbose,
            containsPii: !0,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    trace(A, q) {
        this.logMessage(A, {
            logLevel: mO.Trace,
            containsPii: !1,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    tracePii(A, q) {
        this.logMessage(A, {
            logLevel: mO.Trace,
            containsPii: !0,
            correlationId: q || uA.EMPTY_STRING
        })
    }
    isPiiLoggingEnabled() {
        return this.piiLoggingEnabled || !1
    }
}
// @from(Ln 153645, Col 4)
mO
// @from(Ln 153646, Col 4)
K96 = v(() => {
    WH(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    (function(A) {
        A[A.Error = 0] = "Error", A[A.Warning = 1] = "Warning", A[A.Info = 2] = "Info", A[A.Verbose = 3] = "Verbose", A[A.Trace = 4] = "Trace"
    })(mO || (mO = {}))
})
// @from(Ln 153652, Col 4)
Y96 = "@azure/msal-common"
// @from(Ln 153653, Col 4)
tJ1 = "15.13.1"
// @from(Ln 153654, Col 4)
z96 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 153656, Col 4)
XU
// @from(Ln 153657, Col 4)
w96 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    XU = {
        None: "none",
        AzurePublic: "https://login.microsoftonline.com",
        AzurePpe: "https://login.windows-ppe.net",
        AzureChina: "https://login.chinacloudapi.cn",
        AzureGermany: "https://login.microsoftonline.de",
        AzureUsGovernment: "https://login.microsoftonline.us"
    }
})
// @from(Ln 153668, Col 4)
eJ1 = {}
// @from(Ln 153694, Col 4)
Y41 = "redirect_uri_empty"
// @from(Ln 153695, Col 4)
zh1 = "claims_request_parsing_error"
// @from(Ln 153696, Col 4)
z41 = "authority_uri_insecure"
// @from(Ln 153697, Col 4)
hu = "url_parse_error"
// @from(Ln 153698, Col 4)
w41 = "empty_url_error"
// @from(Ln 153699, Col 4)
H41 = "empty_input_scopes_error"
// @from(Ln 153700, Col 4)
nr = "invalid_claims"
// @from(Ln 153701, Col 4)
$41 = "token_request_empty"
// @from(Ln 153702, Col 4)
O41 = "logout_request_empty"
// @from(Ln 153703, Col 4)
wh1 = "invalid_code_challenge_method"
// @from(Ln 153704, Col 4)
_41 = "pkce_params_missing"
// @from(Ln 153705, Col 4)
rr = "invalid_cloud_discovery_metadata"
// @from(Ln 153706, Col 4)
J41 = "invalid_authority_metadata"
// @from(Ln 153707, Col 4)
X41 = "untrusted_authority"
// @from(Ln 153708, Col 4)
DU = "missing_ssh_jwk"
// @from(Ln 153709, Col 4)
Hh1 = "missing_ssh_kid"
// @from(Ln 153710, Col 4)
$h1 = "missing_nonce_authentication_header"
// @from(Ln 153711, Col 4)
Oh1 = "invalid_authentication_header"
// @from(Ln 153712, Col 4)
_h1 = "cannot_set_OIDCOptions"
// @from(Ln 153713, Col 4)
Jh1 = "cannot_allow_platform_broker"
// @from(Ln 153714, Col 4)
Xh1 = "authority_mismatch"
// @from(Ln 153715, Col 4)
Dh1 = "invalid_request_method_for_EAR"
// @from(Ln 153716, Col 4)
jh1 = "invalid_authorize_post_body_parameters"
// @from(Ln 153717, Col 4)
jU = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 153720, Col 0)
function Aw(A) {
    return new AX1(A)
}
// @from(Ln 153723, Col 4)
F$
// @from(Ln 153723, Col 8)
Q5A
// @from(Ln 153723, Col 13)
AX1
// @from(Ln 153724, Col 4)
or = v(() => {
    LL();
    jU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    F$ = {
        [Y41]: "A redirect URI is required for all calls, and none has been set.",
        [zh1]: "Could not parse the given claims request object.",
        [z41]: "Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",
        [hu]: "URL could not be parsed into appropriate segments.",
        [w41]: "URL was empty or null.",
        [H41]: "Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token.",
        [nr]: "Given claims parameter must be a stringified JSON object.",
        [$41]: "Token request was empty and not found in cache.",
        [O41]: "The logout request was null or undefined.",
        [wh1]: 'code_challenge_method passed is invalid. Valid values are "plain" and "S256".',
        [_41]: "Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request",
        [rr]: "Invalid cloudDiscoveryMetadata provided. Must be a stringified JSON object containing tenant_discovery_endpoint and metadata fields",
        [J41]: "Invalid authorityMetadata provided. Must by a stringified JSON object containing authorization_endpoint, token_endpoint, issuer fields.",
        [X41]: "The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter.",
        [DU]: "Missing sshJwk in SSH certificate request. A stringified JSON Web Key is required when using the SSH authentication scheme.",
        [Hh1]: "Missing sshKid in SSH certificate request. A string that uniquely identifies the public SSH key is required when using the SSH authentication scheme.",
        [$h1]: "Unable to find an authentication header containing server nonce. Either the Authentication-Info or WWW-Authenticate headers must be present in order to obtain a server nonce.",
        [Oh1]: "Invalid authentication header provided",
        [_h1]: "Cannot set OIDCOptions parameter. Please change the protocol mode to OIDC or use a non-Microsoft authority.",
        [Jh1]: "Cannot set allowPlatformBroker parameter to true when not in AAD protocol mode.",
        [Xh1]: "Authority mismatch error. Authority provided in login request or PublicClientApplication config does not match the environment of the provided account. Please use a matching account or make an interactive request to login to this authority.",
        [jh1]: "Invalid authorize post body parameters provided. If you are using authorizePostBodyParameters, the request method must be POST. Please check the request method and parameters.",
        [Dh1]: "Invalid request method for EAR protocol mode. The request method cannot be GET when using EAR protocol mode. Please change the request method to POST."
    }, Q5A = {
        redirectUriNotSet: {
            code: Y41,
            desc: F$[Y41]
        },
        claimsRequestParsingError: {
            code: zh1,
            desc: F$[zh1]
        },
        authorityUriInsecure: {
            code: z41,
            desc: F$[z41]
        },
        urlParseError: {
            code: hu,
            desc: F$[hu]
        },
        urlEmptyError: {
            code: w41,
            desc: F$[w41]
        },
        emptyScopesError: {
            code: H41,
            desc: F$[H41]
        },
        invalidClaimsRequest: {
            code: nr,
            desc: F$[nr]
        },
        tokenRequestEmptyError: {
            code: $41,
            desc: F$[$41]
        },
        logoutRequestEmptyError: {
            code: O41,
            desc: F$[O41]
        },
        invalidCodeChallengeMethod: {
            code: wh1,
            desc: F$[wh1]
        },
        invalidCodeChallengeParams: {
            code: _41,
            desc: F$[_41]
        },
        invalidCloudDiscoveryMetadata: {
            code: rr,
            desc: F$[rr]
        },
        invalidAuthorityMetadata: {
            code: J41,
            desc: F$[J41]
        },
        untrustedAuthority: {
            code: X41,
            desc: F$[X41]
        },
        missingSshJwk: {
            code: DU,
            desc: F$[DU]
        },
        missingSshKid: {
            code: Hh1,
            desc: F$[Hh1]
        },
        missingNonceAuthenticationHeader: {
            code: $h1,
            desc: F$[$h1]
        },
        invalidAuthenticationHeader: {
            code: Oh1,
            desc: F$[Oh1]
        },
        cannotSetOIDCOptions: {
            code: _h1,
            desc: F$[_h1]
        },
        cannotAllowPlatformBroker: {
            code: Jh1,
            desc: F$[Jh1]
        },
        authorityMismatch: {
            code: Xh1,
            desc: F$[Xh1]
        },
        invalidAuthorizePostBodyParameters: {
            code: jh1,
            desc: F$[jh1]
        },
        invalidRequestMethodForEAR: {
            code: Dh1,
            desc: F$[Dh1]
        }
    };
    AX1 = class AX1 extends m3 {
        constructor(A) {
            super(A, F$[A]);
            this.name = "ClientConfigurationError", Object.setPrototypeOf(this, AX1.prototype)
        }
    }
})
// @from(Ln 153852, Col 0)
class kw {
    static isEmptyObj(A) {
        if (A) try {
            let q = JSON.parse(A);
            return Object.keys(q).length === 0
        } catch (q) {}
        return !0
    }
    static startsWith(A, q) {
        return A.indexOf(q) === 0
    }
    static endsWith(A, q) {
        return A.length >= q.length && A.lastIndexOf(q) === A.length - q.length
    }
    static queryStringToObject(A) {
        let q = {},
            K = A.split("&"),
            Y = (z) => decodeURIComponent(z.replace(/\+/g, " "));
        return K.forEach((z) => {
            if (z.trim()) {
                let [w, H] = z.split(/=(.+)/g, 2);
                if (w && H) q[Y(w)] = Y(H)
            }
        }), q
    }
    static trimArrayEntries(A) {
        return A.map((q) => q.trim())
    }
    static removeEmptyStringsFromArray(A) {
        return A.filter((q) => {
            return !!q
        })
    }
    static jsonParseHelper(A) {
        try {
            return JSON.parse(A)
        } catch (q) {
            return null
        }
    }
    static matchPattern(A, q) {
        return new RegExp(A.replace(/\\/g, "\\\\").replace(/\*/g, "[^ ]*").replace(/\?/g, "\\?")).test(q)
    }
}
// @from(Ln 153896, Col 4)
ar = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 153898, Col 0)
class L_ {
    constructor(A) {
        let q = A ? kw.trimArrayEntries([...A]) : [],
            K = q ? kw.removeEmptyStringsFromArray(q) : [];
        if (!K || !K.length) throw Aw(H41);
        this.scopes = new Set, K.forEach((Y) => this.scopes.add(Y))
    }
    static fromString(A) {
        let K = (A || uA.EMPTY_STRING).split(" ");
        return new L_(K)
    }
    static createSearchScopes(A) {
        let q = A && A.length > 0 ? A : [...ZW],
            K = new L_(q);
        if (!K.containsOnlyOIDCScopes()) K.removeOIDCScopes();
        else K.removeScope(uA.OFFLINE_ACCESS_SCOPE);
        return K
    }
    containsScope(A) {
        let q = this.printScopesLowerCase().split(" "),
            K = new L_(q);
        return A ? K.scopes.has(A.toLowerCase()) : !1
    }
    containsScopeSet(A) {
        if (!A || A.scopes.size <= 0) return !1;
        return this.scopes.size >= A.scopes.size && A.asArray().every((q) => this.containsScope(q))
    }
    containsOnlyOIDCScopes() {
        let A = 0;
        return x5A.forEach((q) => {
            if (this.containsScope(q)) A += 1
        }), this.scopes.size === A
    }
    appendScope(A) {
        if (A) this.scopes.add(A.trim())
    }
    appendScopes(A) {
        try {
            A.forEach((q) => this.appendScope(q))
        } catch (q) {
            throw Y8(s71)
        }
    }
    removeScope(A) {
        if (!A) throw Y8(a71);
        this.scopes.delete(A.trim())
    }
    removeOIDCScopes() {
        x5A.forEach((A) => {
            this.scopes.delete(A)
        })
    }
    unionScopeSets(A) {
        if (!A) throw Y8(cr);
        let q = new Set;
        return A.scopes.forEach((K) => q.add(K.toLowerCase())), this.scopes.forEach((K) => q.add(K.toLowerCase())), q
    }
    intersectingScopeSets(A) {
        if (!A) throw Y8(cr);
        if (!A.containsOnlyOIDCScopes()) A.removeOIDCScopes();
        let q = this.unionScopeSets(A),
            K = A.getScopeCount(),
            Y = this.getScopeCount();
        return q.size < Y + K
    }
    getScopeCount() {
        return this.scopes.size
    }
    asArray() {
        let A = [];
        return this.scopes.forEach((q) => A.push(q)), A
    }
    printScopes() {
        if (this.scopes) return this.asArray().join(" ");
        return uA.EMPTY_STRING
    }
    printScopesLowerCase() {
        return this.printScopes().toLowerCase()
    }
}
// @from(Ln 153978, Col 4)
Mh1 = v(() => {
    or();
    ar();
    TX();
    WH();
    jU();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 153987, Col 0)
function qX1(A, q) {
    if (!A) throw Y8(g71);
    try {
        let K = q(A);
        return JSON.parse(K)
    } catch (K) {
        throw Y8(Ur)
    }
}
// @from(Ln 153997, Col 0)
function Iu(A) {
    if (!A) throw Y8(Ur);
    let q = A.split(HU.CLIENT_INFO_SEPARATOR, 2);
    return {
        uid: q[0],
        utid: q.length < 2 ? uA.EMPTY_STRING : q[1]
    }
}
// @from(Ln 154005, Col 4)
KX1 = v(() => {
    TX();
    WH();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 154011, Col 0)
function W$7(A, q) {
    return !!A && !!q && A === q.split(".")[1]
}
// @from(Ln 154015, Col 0)
function Ph1(A, q, K, Y) {
    if (Y) {
        let {
            oid: z,
            sub: w,
            tid: H,
            name: $,
            tfp: O,
            acr: _,
            preferred_username: J,
            upn: X,
            login_hint: D
        } = Y, j = H || O || _ || "";
        return {
            tenantId: j,
            localAccountId: z || w || "",
            name: $,
            username: J || X || "",
            loginHint: D,
            isHomeTenant: W$7(j, A)
        }
    } else return {
        tenantId: K,
        localAccountId: q,
        username: "",
        isHomeTenant: W$7(K, A)
    }
}
// @from(Ln 154044, Col 0)
function H96(A, q, K, Y) {
    let z = A;
    if (q) {
        let {
            isHomeTenant: w,
            ...H
        } = q;
        z = {
            ...A,
            ...H
        }
    }
    if (K) {
        let {
            isHomeTenant: w,
            ...H
        } = Ph1(A.homeAccountId, A.localAccountId, A.tenantId, K);
        return z = {
            ...z,
            ...H,
            idTokenClaims: K,
            idToken: Y
        }, z
    }
    return z
}
// @from(Ln 154070, Col 4)
$96 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 154072, Col 4)
RL
// @from(Ln 154073, Col 4)
g5A = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    RL = {
        Default: 0,
        Adfs: 1,
        Dsts: 2,
        Ciam: 3
    }
})
// @from(Ln 154083, Col 0)
function O96(A) {
    if (A) return A.tid || A.tfp || A.acr || null;
    return null
}
// @from(Ln 154087, Col 4)
U5A = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 154089, Col 4)
fW
// @from(Ln 154090, Col 4)
Wh1 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    fW = {
        AAD: "AAD",
        OIDC: "OIDC",
        EAR: "EAR"
    }
})
// @from(Ln 154098, Col 0)
class vX {
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
            tenantProfiles: new Map((A.tenantProfiles || []).map((q) => {
                return [q.tenantId, q]
            })),
            dataBoundary: A.dataBoundary
        }
    }
    isSingleTenant() {
        return !this.tenantProfiles
    }
    static createAccount(A, q, K) {
        let Y = new vX;
        if (q.authorityType === RL.Adfs) Y.authorityType = F71.ADFS_ACCOUNT_TYPE;
        else if (q.protocolMode === fW.OIDC) Y.authorityType = F71.GENERIC_ACCOUNT_TYPE;
        else Y.authorityType = F71.MSSTS_ACCOUNT_TYPE;
        let z;
        if (A.clientInfo && K) {
            if (z = qX1(A.clientInfo, K), z.xms_tdbr) Y.dataBoundary = z.xms_tdbr === "EU" ? "EU" : "None"
        }
        Y.clientInfo = A.clientInfo, Y.homeAccountId = A.homeAccountId, Y.nativeAccountId = A.nativeAccountId;
        let w = A.environment || q && q.getPreferredCache();
        if (!w) throw Y8(_U);
        Y.environment = w, Y.realm = z?.utid || O96(A.idTokenClaims) || "", Y.localAccountId = z?.uid || A.idTokenClaims?.oid || A.idTokenClaims?.sub || "";
        let H = A.idTokenClaims?.preferred_username || A.idTokenClaims?.upn,
            $ = A.idTokenClaims?.emails ? A.idTokenClaims.emails[0] : null;
        if (Y.username = H || $ || "", Y.loginHint = A.idTokenClaims?.login_hint, Y.name = A.idTokenClaims?.name || "", Y.cloudGraphHostName = A.cloudGraphHostName, Y.msGraphHost = A.msGraphHost, A.tenantProfiles) Y.tenantProfiles = A.tenantProfiles;
        else {
            let O = Ph1(A.homeAccountId, Y.localAccountId, Y.realm, A.idTokenClaims);
            Y.tenantProfiles = [O]
        }
        return Y
    }
    static createFromAccountInfo(A, q, K) {
        let Y = new vX;
        return Y.authorityType = A.authorityType || F71.GENERIC_ACCOUNT_TYPE, Y.homeAccountId = A.homeAccountId, Y.localAccountId = A.localAccountId, Y.nativeAccountId = A.nativeAccountId, Y.realm = A.tenantId, Y.environment = A.environment, Y.username = A.username, Y.name = A.name, Y.loginHint = A.loginHint, Y.cloudGraphHostName = q, Y.msGraphHost = K, Y.tenantProfiles = Array.from(A.tenantProfiles?.values() || []), Y.dataBoundary = A.dataBoundary, Y
    }
    static generateHomeAccountId(A, q, K, Y, z) {
        if (!(q === RL.Adfs || q === RL.Dsts)) {
            if (A) try {
                let w = qX1(A, Y.base64Decode);
                if (w.uid && w.utid) return `${w.uid}.${w.utid}`
            } catch (w) {}
            K.warning("No client info in response")
        }
        return z?.sub || ""
    }
    static isAccountEntity(A) {
        if (!A) return !1;
        return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("realm") && A.hasOwnProperty("localAccountId") && A.hasOwnProperty("username") && A.hasOwnProperty("authorityType")
    }
    static accountInfoIsEqual(A, q, K) {
        if (!A || !q) return !1;
        let Y = !0;
        if (K) {
            let z = A.idTokenClaims || {},
                w = q.idTokenClaims || {};
            Y = z.iat === w.iat && z.nonce === w.nonce
        }
        return A.homeAccountId === q.homeAccountId && A.localAccountId === q.localAccountId && A.username === q.username && A.tenantId === q.tenantId && A.loginHint === q.loginHint && A.environment === q.environment && A.nativeAccountId === q.nativeAccountId && Y
    }
}
// @from(Ln 154170, Col 4)
_96 = v(() => {
    WH();
    KX1();
    $96();
    TX();
    g5A();
    U5A();
    Wh1();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 154180, Col 4)
J96 = {}
// @from(Ln 154188, Col 0)
function MU(A, q) {
    let K = G$7(A);
    try {
        let Y = q(K);
        return JSON.parse(Y)
    } catch (Y) {
        throw Y8(pr)
    }
}
// @from(Ln 154198, Col 0)
function p5A(A) {
    if (!A.signin_state) return !1;
    let q = ["kmsi", "dvc_dmjd"];
    return A.signin_state.some((Y) => q.includes(Y.trim().toLowerCase()))
}
// @from(Ln 154204, Col 0)
function G$7(A) {
    if (!A) throw Y8(U71);
    let K = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(A);
    if (!K || K.length < 4) throw Y8(pr);
    return K[2]
}
// @from(Ln 154211, Col 0)
function Gh1(A, q) {
    if (q === 0 || Date.now() - 300000 > A + q) throw Y8(n71)
}
// @from(Ln 154214, Col 4)
YX1 = v(() => {
    TX();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 154218, Col 4)
NM = {}
// @from(Ln 154226, Col 0)
function Z$7(A) {
    if (!A) return A;
    let q = A.toLowerCase();
    if (kw.endsWith(q, "?")) q = q.slice(0, -1);
    else if (kw.endsWith(q, "?/")) q = q.slice(0, -2);
    if (!kw.endsWith(q, "/")) q += "/";
    return q
}
// @from(Ln 154235, Col 0)
function f$7(A) {
    if (A.startsWith("#/")) return A.substring(2);
    else if (A.startsWith("#") || A.startsWith("?")) return A.substring(1);
    return A
}
// @from(Ln 154241, Col 0)
function d5A(A) {
    if (!A || A.indexOf("=") < 0) return null;
    try {
        let q = f$7(A),
            K = Object.fromEntries(new URLSearchParams(q));
        if (K.code || K.ear_jwe || K.error || K.error_description || K.state) return K
    } catch (q) {
        throw Y8(c71)
    }
    return null
}
// @from(Ln 154253, Col 0)
function xu(A, q = !0, K) {
    let Y = [];
    return A.forEach((z, w) => {
        if (!q && K && w in K) Y.push(`${w}=${z}`);
        else Y.push(`${w}=${encodeURIComponent(z)}`)
    }), Y.join("&")
}
// @from(Ln 154261, Col 0)
function pu5(A) {
    if (!A) return A;
    let q = A.split("#")[0];
    try {
        let K = new URL(q),
            Y = K.origin + K.pathname + K.search;
        return Z$7(Y)
    } catch (K) {
        return Z$7(q)
    }
}
// @from(Ln 154272, Col 4)
D41 = v(() => {
    TX();
    ar();
    XJ(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 154277, Col 0)
class A5 {
    get urlString() {
        return this._urlString
    }
    constructor(A) {
        if (this._urlString = A, !this._urlString) throw Aw(w41);
        if (!A.includes("#")) this._urlString = A5.canonicalizeUri(A)
    }
    static canonicalizeUri(A) {
        if (A) {
            let q = A.toLowerCase();
            if (kw.endsWith(q, "?")) q = q.slice(0, -1);
            else if (kw.endsWith(q, "?/")) q = q.slice(0, -2);
            if (!kw.endsWith(q, "/")) q += "/";
            return q
        }
        return A
    }
    validateAsUri() {
        let A;
        try {
            A = this.getUrlComponents()
        } catch (q) {
            throw Aw(hu)
        }
        if (!A.HostNameAndPort || !A.PathSegments) throw Aw(hu);
        if (!A.Protocol || A.Protocol.toLowerCase() !== "https:") throw Aw(z41)
    }
    static appendQueryString(A, q) {
        if (!q) return A;
        return A.indexOf("?") < 0 ? `${A}?${q}` : `${A}&${q}`
    }
    static removeHashFromUrl(A) {
        return A5.canonicalizeUri(A.split("#")[0])
    }
    replaceTenantPath(A) {
        let q = this.getUrlComponents(),
            K = q.PathSegments;
        if (A && K.length !== 0 && (K[0] === LV.COMMON || K[0] === LV.ORGANIZATIONS)) K[0] = A;
        return A5.constructAuthorityUriFromObject(q)
    }
    getUrlComponents() {
        let A = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"),
            q = this.urlString.match(A);
        if (!q) throw Aw(hu);
        let K = {
                Protocol: q[1],
                HostNameAndPort: q[4],
                AbsolutePath: q[5],
                QueryString: q[7]
            },
            Y = K.AbsolutePath.split("/");
        if (Y = Y.filter((z) => z && z.length > 0), K.PathSegments = Y, K.QueryString && K.QueryString.endsWith("/")) K.QueryString = K.QueryString.substring(0, K.QueryString.length - 1);
        return K
    }
    static getDomainFromUrl(A) {
        let q = RegExp("^([^:/?#]+://)?([^/?#]*)"),
            K = A.match(q);
        if (!K) throw Aw(hu);
        return K[2]
    }
    static getAbsoluteUrl(A, q) {
        if (A[0] === uA.FORWARD_SLASH) {
            let Y = new A5(q).getUrlComponents();
            return Y.Protocol + "//" + Y.HostNameAndPort + A
        }
        return A
    }
    static constructAuthorityUriFromObject(A) {
        return new A5(A.Protocol + "//" + A.HostNameAndPort + "/" + A.PathSegments.join("/"))
    }
    static hashContainsKnownProperties(A) {
        return !!d5A(A)
    }
}
// @from(Ln 154352, Col 4)
sr = v(() => {
    or();
    ar();
    WH();
    D41();
    jU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 154360, Col 0)
function T$7(A, q) {
    let K, Y = A.canonicalAuthority;
    if (Y) {
        let z = new A5(Y).getUrlComponents().HostNameAndPort;
        K = V$7(z, A.cloudDiscoveryMetadata?.metadata, nG.CONFIG, q) || V$7(z, l5A.metadata, nG.HARDCODED_VALUES, q) || A.knownAuthorities
    }
    return K || []
}
// @from(Ln 154369, Col 0)
function V$7(A, q, K, Y) {
    if (Y?.trace(`getAliasesFromMetadata called with source: ${K}`), A && q) {
        let z = Zh1(q, A);
        if (z) return Y?.trace(`getAliasesFromMetadata: found cloud discovery metadata in ${K}, returning aliases`), z.aliases;
        else Y?.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in ${K}`)
    }
    return null
}
// @from(Ln 154378, Col 0)
function v$7(A) {
    return Zh1(l5A.metadata, A)
}
// @from(Ln 154382, Col 0)
function Zh1(A, q) {
    for (let K = 0; K < A.length; K++) {
        let Y = A[K];
        if (Y.aliases.includes(q)) return Y
    }
    return null
}
// @from(Ln 154389, Col 4)
N$7
// @from(Ln 154389, Col 9)
c5A
// @from(Ln 154389, Col 14)
l5A
// @from(Ln 154389, Col 19)
i5A
// @from(Ln 154390, Col 4)
n5A = v(() => {
    sr();
    WH(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    N$7 = {
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
    }, c5A = N$7.endpointMetadata, l5A = N$7.instanceDiscoveryMetadata, i5A = new Set;
    l5A.metadata.forEach((A) => {
        A.aliases.forEach((q) => {
            i5A.add(q)
        })
    })
})
// @from(Ln 154447, Col 4)
r5A = "cache_quota_exceeded"
// @from(Ln 154448, Col 4)
X96 = "cache_error_unknown"
// @from(Ln 154449, Col 4)
E$7 = v(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 154452, Col 0)
function k$7(A) {
    if (!(A instanceof Error)) return new fh1(X96);
    if (A.name === "QuotaExceededError" || A.name === "NS_ERROR_DOM_QUOTA_REACHED" || A.message.includes("exceeded the quota")) return new fh1(r5A);
    else return new fh1(A.name, A.message)
}
// @from(Ln 154457, Col 4)
o5A
// @from(Ln 154457, Col 9)
fh1
// @from(Ln 154458, Col 4)
L$7 = v(() => {
    LL();
    E$7(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    o5A = {
        [r5A]: "Exceeded cache storage capacity.",
        [X96]: "Unexpected error occurred when using cache storage."
    };
    fh1 = class fh1 extends m3 {
        constructor(A, q) {
            let K = q || (o5A[A] ? o5A[A] : o5A[X96]);
            super(`${A}: ${K}`);
            Object.setPrototypeOf(this, fh1.prototype), this.name = "CacheError", this.errorCode = A, this.errorMessage = K
        }
    }
})