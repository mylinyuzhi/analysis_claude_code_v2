
// @from(Ln 177310, Col 0)
function Jp7(A) {
    let q = new Set;
    for (let K in A.responses) {
        let Y = A.responses[K];
        if (Y.bodyMapper && Y.bodyMapper.type.name === cU.Stream) q.add(Number(K))
    }
    return q
}
// @from(Ln 177319, Col 0)
function Um(A) {
    let {
        parameterPath: q,
        mapper: K
    } = A, Y;
    if (typeof q === "string") Y = q;
    else if (Array.isArray(q)) Y = q.join(".");
    else Y = K.serializedName;
    return Y
}
// @from(Ln 177329, Col 4)
Nj1 = E(() => {
    vj1()
})
// @from(Ln 177333, Col 0)
function Mp7(A = {}) {
    let q = A.stringifyXML;
    return {
        name: L39,
        async sendRequest(K, Y) {
            let z = lU(K),
                _ = z === null || z === void 0 ? void 0 : z.operationSpec,
                w = z === null || z === void 0 ? void 0 : z.operationArguments;
            if (_ && w) R39(K, w, _), h39(K, w, _, q);
            return Y(K)
        }
    }
}
// @from(Ln 177347, Col 0)
function R39(A, q, K) {
    var Y, z;
    if (K.headerParameters)
        for (let w of K.headerParameters) {
            let O = ys(q, w);
            if (O !== null && O !== void 0 || w.mapper.required) {
                O = K.serializer.serialize(w.mapper, O, Um(w));
                let $ = w.mapper.headerCollectionPrefix;
                if ($)
                    for (let H of Object.keys(O)) A.headers.set($ + H, O[H]);
                else A.headers.set(w.mapper.serializedName || Um(w), O)
            }
        }
    let _ = (z = (Y = q.options) === null || Y === void 0 ? void 0 : Y.requestOptions) === null || z === void 0 ? void 0 : z.customHeaders;
    if (_)
        for (let w of Object.keys(_)) A.headers.set(w, _[w])
}
// @from(Ln 177365, Col 0)
function h39(A, q, K, Y = function() {
    throw Error("XML serialization unsupported!")
}) {
    var z, _, w, O, $;
    let H = (z = q.options) === null || z === void 0 ? void 0 : z.serializerOptions,
        j = {
            xml: {
                rootName: (_ = H === null || H === void 0 ? void 0 : H.xml.rootName) !== null && _ !== void 0 ? _ : "",
                includeRoot: (w = H === null || H === void 0 ? void 0 : H.xml.includeRoot) !== null && w !== void 0 ? w : !1,
                xmlCharKey: (O = H === null || H === void 0 ? void 0 : H.xml.xmlCharKey) !== null && O !== void 0 ? O : Tj1
            }
        },
        J = j.xml.xmlCharKey;
    if (K.requestBody && K.requestBody.mapper) {
        A.body = ys(q, K.requestBody);
        let M = K.requestBody.mapper,
            {
                required: D,
                serializedName: X,
                xmlName: P,
                xmlElementName: W,
                xmlNamespace: Z,
                xmlNamespacePrefix: G,
                nullable: f
            } = M,
            v = M.type.name;
        try {
            if (A.body !== void 0 && A.body !== null || f && A.body === null || D) {
                let N = Um(K.requestBody);
                A.body = K.serializer.serialize(M, A.body, N, j);
                let V = v === cU.Stream;
                if (K.isXML) {
                    let L = G ? `xmlns:${G}` : "xmlns",
                        h = S39(Z, L, v, A.body, j);
                    if (v === cU.Sequence) A.body = Y(C39(h, W || P || X, L, Z), {
                        rootName: P || X,
                        xmlCharKey: J
                    });
                    else if (!V) A.body = Y(h, {
                        rootName: P || X,
                        xmlCharKey: J
                    })
                } else if (v === cU.String && ((($ = K.contentType) === null || $ === void 0 ? void 0 : $.match("text/plain")) || K.mediaType === "text")) return;
                else if (!V) A.body = JSON.stringify(A.body)
            }
        } catch (N) {
            throw Error(`Error "${N.message}" occurred in serializing the payload - ${JSON.stringify(X,void 0,"  ")}.`)
        }
    } else if (K.formDataParameters && K.formDataParameters.length > 0) {
        A.formData = {};
        for (let M of K.formDataParameters) {
            let D = ys(q, M);
            if (D !== void 0 && D !== null) {
                let X = M.mapper.serializedName || Um(M);
                A.formData[X] = K.serializer.serialize(M.mapper, D, Um(M), j)
            }
        }
    }
}
// @from(Ln 177425, Col 0)
function S39(A, q, K, Y, z) {
    if (A && !["Composite", "Sequence", "Dictionary"].includes(K)) {
        let _ = {};
        return _[z.xml.xmlCharKey] = Y, _[EX8] = {
            [q]: A
        }, _
    }
    return Y
}
// @from(Ln 177435, Col 0)
function C39(A, q, K, Y) {
    if (!Array.isArray(A)) A = [A];
    if (!K || !Y) return {
        [q]: A
    };
    let z = {
        [q]: A
    };
    return z[EX8] = {
        [K]: Y
    }, z
}
// @from(Ln 177447, Col 4)
L39 = "serializationPolicy"
// @from(Ln 177448, Col 4)
Dp7 = E(() => {
    Sm6();
    vj1();
    Nj1()
})
// @from(Ln 177454, Col 0)
function Xp7(A = {}) {
    let q = NX8(A !== null && A !== void 0 ? A : {});
    if (A.credentialOptions) q.addPolicy(hm6({
        credential: A.credentialOptions.credential,
        scopes: A.credentialOptions.credentialScopes
    }));
    return q.addPolicy(Mp7(A.serializationOptions), {
        phase: "Serialize"
    }), q.addPolicy(Hp7(A.deserializationOptions), {
        phase: "Deserialize"
    }), q
}
// @from(Ln 177466, Col 4)
Pp7 = E(() => {
    jp7();
    Qm();
    Dp7()
})
// @from(Ln 177472, Col 0)
function Wp7() {
    if (!RX8) RX8 = VX8();
    return RX8
}
// @from(Ln 177476, Col 4)
RX8
// @from(Ln 177477, Col 4)
Zp7 = E(() => {
    Qm()
})
// @from(Ln 177481, Col 0)
function fp7(A, q, K, Y) {
    let z = b39(q, K, Y),
        _ = !1,
        w = Gp7(A, z);
    if (q.path) {
        let H = Gp7(q.path, z);
        if (q.path === "/{nextLink}" && H.startsWith("/")) H = H.substring(1);
        if (x39(H)) w = H, _ = !0;
        else w = u39(w, H)
    }
    let {
        queryParams: O,
        sequenceParams: $
    } = m39(q, K, Y);
    return w = g39(w, O, $, _), w
}
// @from(Ln 177498, Col 0)
function Gp7(A, q) {
    let K = A;
    for (let [Y, z] of q) K = K.split(Y).join(z);
    return K
}
// @from(Ln 177504, Col 0)
function b39(A, q, K) {
    var Y;
    let z = new Map;
    if ((Y = A.urlParameters) === null || Y === void 0 ? void 0 : Y.length)
        for (let _ of A.urlParameters) {
            let w = ys(q, _, K),
                O = Um(_);
            if (w = A.serializer.serialize(_.mapper, w, O), !_.skipEncoding) w = encodeURIComponent(w);
            z.set(`{${_.mapper.serializedName||O}}`, w)
        }
    return z
}
// @from(Ln 177517, Col 0)
function x39(A) {
    return A.includes("://")
}
// @from(Ln 177521, Col 0)
function u39(A, q) {
    if (!q) return A;
    let K = new URL(A),
        Y = K.pathname;
    if (!Y.endsWith("/")) Y = `${Y}/`;
    if (q.startsWith("/")) q = q.substring(1);
    let z = q.indexOf("?");
    if (z !== -1) {
        let _ = q.substring(0, z),
            w = q.substring(z + 1);
        if (Y = Y + _, w) K.search = K.search ? `${K.search}&${w}` : w
    } else Y = Y + q;
    return K.pathname = Y, K.toString()
}
// @from(Ln 177536, Col 0)
function m39(A, q, K) {
    var Y;
    let z = new Map,
        _ = new Set;
    if ((Y = A.queryParameters) === null || Y === void 0 ? void 0 : Y.length)
        for (let w of A.queryParameters) {
            if (w.mapper.type.name === "Sequence" && w.mapper.serializedName) _.add(w.mapper.serializedName);
            let O = ys(q, w, K);
            if (O !== void 0 && O !== null || w.mapper.required) {
                O = A.serializer.serialize(w.mapper, O, Um(w));
                let $ = w.collectionFormat ? I39[w.collectionFormat] : "";
                if (Array.isArray(O)) O = O.map((H) => {
                    if (H === null || H === void 0) return "";
                    return H
                });
                if (w.collectionFormat === "Multi" && O.length === 0) continue;
                else if (Array.isArray(O) && (w.collectionFormat === "SSV" || w.collectionFormat === "TSV")) O = O.join($);
                if (!w.skipEncoding)
                    if (Array.isArray(O)) O = O.map((H) => {
                        return encodeURIComponent(H)
                    });
                    else O = encodeURIComponent(O);
                if (Array.isArray(O) && (w.collectionFormat === "CSV" || w.collectionFormat === "Pipes")) O = O.join($);
                z.set(w.mapper.serializedName || Um(w), O)
            }
        }
    return {
        queryParams: z,
        sequenceParams: _
    }
}
// @from(Ln 177568, Col 0)
function B39(A) {
    let q = new Map;
    if (!A || A[0] !== "?") return q;
    A = A.slice(1);
    let K = A.split("&");
    for (let Y of K) {
        let [z, _] = Y.split("=", 2), w = q.get(z);
        if (w)
            if (Array.isArray(w)) w.push(_);
            else q.set(z, [w, _]);
        else q.set(z, _)
    }
    return q
}
// @from(Ln 177583, Col 0)
function g39(A, q, K, Y = !1) {
    if (q.size === 0) return A;
    let z = new URL(A),
        _ = B39(z.search);
    for (let [O, $] of q) {
        let H = _.get(O);
        if (Array.isArray(H))
            if (Array.isArray($)) {
                H.push(...$);
                let j = new Set(H);
                _.set(O, Array.from(j))
            } else H.push($);
        else if (H) {
            if (Array.isArray($)) $.unshift(H);
            else if (K.has(O)) _.set(O, [H, $]);
            if (!Y) _.set(O, $)
        } else _.set(O, $)
    }
    let w = [];
    for (let [O, $] of _)
        if (typeof $ === "string") w.push(`${O}=${$}`);
        else if (Array.isArray($))
        for (let H of $) w.push(`${O}=${H}`);
    else w.push(`${O}=${$}`);
    return z.search = w.length ? `?${w.join("&")}` : "", z.toString()
}
// @from(Ln 177609, Col 4)
I39
// @from(Ln 177610, Col 4)
Tp7 = E(() => {
    Sm6();
    Nj1();
    I39 = {
        CSV: ",",
        SSV: " ",
        Multi: "Multi",
        TSV: "\t",
        Pipes: "|"
    }
})
// @from(Ln 177621, Col 4)
vp7
// @from(Ln 177622, Col 4)
Np7 = E(() => {
    FK6();
    vp7 = Vs("core-client")
})
// @from(Ln 177626, Col 0)
class Vj1 {
    constructor(A = {}) {
        var q, K;
        if (this._requestContentType = A.requestContentType, this._endpoint = (q = A.endpoint) !== null && q !== void 0 ? q : A.baseUri, A.baseUri) vp7.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
        if (this._allowInsecureConnection = A.allowInsecureConnection, this._httpClient = A.httpClient || Wp7(), this.pipeline = A.pipeline || F39(A), (K = A.additionalPolicies) === null || K === void 0 ? void 0 : K.length)
            for (let {
                    policy: Y,
                    position: z
                }
                of A.additionalPolicies) {
                let _ = z === "perRetry" ? "Sign" : void 0;
                this.pipeline.addPolicy(Y, {
                    afterPhase: _
                })
            }
    }
    async sendRequest(A) {
        return this.pipeline.sendRequest(this._httpClient, A)
    }
    async sendOperationRequest(A, q) {
        let K = q.baseUrl || this._endpoint;
        if (!K) throw Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
        let Y = fp7(K, q, A, this),
            z = fk({
                url: Y
            });
        z.method = q.httpMethod;
        let _ = lU(z);
        _.operationSpec = q, _.operationArguments = A;
        let w = q.contentType || this._requestContentType;
        if (w && q.requestBody) z.headers.set("Content-Type", w);
        let O = A.options;
        if (O) {
            let $ = O.requestOptions;
            if ($) {
                if ($.timeout) z.timeout = $.timeout;
                if ($.onUploadProgress) z.onUploadProgress = $.onUploadProgress;
                if ($.onDownloadProgress) z.onDownloadProgress = $.onDownloadProgress;
                if ($.shouldDeserialize !== void 0) _.shouldDeserialize = $.shouldDeserialize;
                if ($.allowInsecureConnection) z.allowInsecureConnection = !0
            }
            if (O.abortSignal) z.abortSignal = O.abortSignal;
            if (O.tracingOptions) z.tracingOptions = O.tracingOptions
        }
        if (this._allowInsecureConnection) z.allowInsecureConnection = !0;
        if (z.streamResponseStatusCodes === void 0) z.streamResponseStatusCodes = Jp7(q);
        try {
            let $ = await this.sendRequest(z),
                H = yX8($, q.responses[$.status]);
            if (O === null || O === void 0 ? void 0 : O.onResponse) O.onResponse($, H);
            return H
        } catch ($) {
            if (typeof $ === "object" && ($ === null || $ === void 0 ? void 0 : $.response)) {
                let H = $.response,
                    j = yX8(H, q.responses[$.statusCode] || q.responses.default);
                if ($.details = j, O === null || O === void 0 ? void 0 : O.onResponse) O.onResponse(H, j, $)
            }
            throw $
        }
    }
}
// @from(Ln 177688, Col 0)
function F39(A) {
    let q = p39(A),
        K = A.credential && q ? {
            credentialScopes: q,
            credential: A.credential
        } : void 0;
    return Xp7(Object.assign(Object.assign({}, A), {
        credentialOptions: K
    }))
}
// @from(Ln 177699, Col 0)
function p39(A) {
    if (A.credentialScopes) return A.credentialScopes;
    if (A.endpoint) return `${A.endpoint}/.default`;
    if (A.baseUri) return `${A.baseUri}/.default`;
    if (A.credential && !A.credentialScopes) throw Error("When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy");
    return
}
// @from(Ln 177706, Col 4)
Vp7 = E(() => {
    Qm();
    Pp7();
    qp7();
    Zp7();
    Sm6();
    Tp7();
    Nj1();
    Np7()
})
// @from(Ln 177716, Col 4)
kp7 = E(() => {
    Vp7()
})
// @from(Ln 177720, Col 0)
function Ep7(A) {
    if (A === "adfs") return "oauth2/token";
    else return "oauth2/v2.0/token"
}
// @from(Ln 177724, Col 4)
bY
// @from(Ln 177725, Col 4)
dP = E(() => {
    Bm();
    vX8();
    bY = Lm6({
        namespace: "Microsoft.AAD",
        packageName: "@azure/identity",
        packageVersion: nH1
    })
})
// @from(Ln 177735, Col 0)
function Cm6(A) {
    let q = "";
    if (Array.isArray(A)) {
        if (A.length !== 1) return;
        q = A[0]
    } else if (typeof A === "string") q = A;
    if (!q.endsWith("/.default")) return q;
    return q.substr(0, q.lastIndexOf("/.default"))
}
// @from(Ln 177745, Col 0)
function Lp7(A) {
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
// @from(Ln 177757, Col 0)
function Rp7(A) {
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
// @from(Ln 177769, Col 4)
yp7 = "Specifying a `clientId` or `resourceId` is not supported by the Service Fabric managed identity environment. The managed identity configuration is determined by the Service Fabric cluster resource configuration. See https://aka.ms/servicefabricmi for more information"
// @from(Ln 177771, Col 0)
function Q39(A) {
    let q = A === null || A === void 0 ? void 0 : A.authorityHost;
    if (Pj1) q = q !== null && q !== void 0 ? q : process.env.AZURE_AUTHORITY_HOST;
    return q !== null && q !== void 0 ? q : Mm6
}
// @from(Ln 177776, Col 4)
Im6 = "noCorrelationId"
// @from(Ln 177777, Col 4)
dm
// @from(Ln 177778, Col 4)
bm6 = E(() => {
    kp7();
    Es();
    Qm();
    pM();
    Bm();
    dP();
    H2();
    dm = class dm extends Vj1 {
        constructor(A) {
            var q, K;
            let Y = `azsdk-js-identity/${nH1}`,
                z = ((q = A === null || A === void 0 ? void 0 : A.userAgentOptions) === null || q === void 0 ? void 0 : q.userAgentPrefix) ? `${A.userAgentOptions.userAgentPrefix} ${Y}` : `${Y}`,
                _ = Q39(A);
            if (!_.startsWith("https:")) throw Error("The authorityHost address must use the 'https' protocol.");
            super(Object.assign(Object.assign({
                requestContentType: "application/json; charset=utf-8",
                retryOptions: {
                    maxRetries: 3
                }
            }, A), {
                userAgentOptions: {
                    userAgentPrefix: z
                },
                baseUri: _
            }));
            if (this.allowInsecureConnection = !1, this.authorityHost = _, this.abortControllers = new Map, this.allowLoggingAccountIdentifiers = (K = A === null || A === void 0 ? void 0 : A.loggingOptions) === null || K === void 0 ? void 0 : K.allowLoggingAccountIdentifiers, this.tokenCredentialOptions = Object.assign({}, A), A === null || A === void 0 ? void 0 : A.allowInsecureConnection) this.allowInsecureConnection = A.allowInsecureConnection
        }
        async sendTokenRequest(A) {
            Tv.info(`IdentityClient: sending token request to [${A.url}]`);
            let q = await this.sendRequest(A);
            if (q.bodyAsText && (q.status === 200 || q.status === 201)) {
                let K = JSON.parse(q.bodyAsText);
                if (!K.access_token) return null;
                this.logIdentifiers(q);
                let Y = {
                    accessToken: {
                        token: K.access_token,
                        expiresOnTimestamp: Lp7(K),
                        refreshAfterTimestamp: Rp7(K),
                        tokenType: "Bearer"
                    },
                    refreshToken: K.refresh_token
                };
                return Tv.info(`IdentityClient: [${A.url}] token acquired, expires on ${Y.accessToken.expiresOnTimestamp}`), Y
            } else {
                let K = new dC(q.status, q.bodyAsText);
                throw Tv.warning(`IdentityClient: authentication error. HTTP status: ${q.status}, ${K.errorResponse.errorDescription}`), K
            }
        }
        async refreshAccessToken(A, q, K, Y, z, _ = {}) {
            if (Y === void 0) return null;
            Tv.info(`IdentityClient: refreshing access token with client ID: ${q}, scopes: ${K} started`);
            let w = {
                grant_type: "refresh_token",
                client_id: q,
                refresh_token: Y,
                scope: K
            };
            if (z !== void 0) w.client_secret = z;
            let O = new URLSearchParams(w);
            return bY.withSpan("IdentityClient.refreshAccessToken", _, async ($) => {
                try {
                    let H = Ep7(A),
                        j = fk({
                            url: `${this.authorityHost}/${A}/${H}`,
                            method: "POST",
                            body: O.toString(),
                            abortSignal: _.abortSignal,
                            headers: dU({
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded"
                            }),
                            tracingOptions: $.tracingOptions
                        }),
                        J = await this.sendTokenRequest(j);
                    return Tv.info(`IdentityClient: refreshed token for client ID: ${q}`), J
                } catch (H) {
                    if (H.name === Dm6 && H.errorResponse.error === "interaction_required") return Tv.info(`IdentityClient: interaction required for client ID: ${q}`), null;
                    else throw Tv.warning(`IdentityClient: failed refreshing token for client ID: ${q}: ${H}`), H
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
            let q = A || Im6,
                K = [...this.abortControllers.get(q) || [], ...this.abortControllers.get(Im6) || []];
            if (!K.length) return;
            for (let Y of K) Y.abort();
            this.abortControllers.set(q, void 0)
        }
        getCorrelationId(A) {
            var q;
            let K = (q = A === null || A === void 0 ? void 0 : A.body) === null || q === void 0 ? void 0 : q.split("&").map((Y) => Y.split("=")).find(([Y]) => Y === "client-request-id");
            return K && K.length ? K[1] || Im6 : Im6
        }
        async sendGetRequestAsync(A, q) {
            let K = fk({
                    url: A,
                    method: "GET",
                    body: q === null || q === void 0 ? void 0 : q.body,
                    allowInsecureConnection: this.allowInsecureConnection,
                    headers: dU(q === null || q === void 0 ? void 0 : q.headers),
                    abortSignal: this.generateAbortSignal(Im6)
                }),
                Y = await this.sendRequest(K);
            return this.logIdentifiers(Y), {
                body: Y.bodyAsText ? JSON.parse(Y.bodyAsText) : void 0,
                headers: Y.headers.toJSON(),
                status: Y.status
            }
        }
        async sendPostRequestAsync(A, q) {
            let K = fk({
                    url: A,
                    method: "POST",
                    body: q === null || q === void 0 ? void 0 : q.body,
                    headers: dU(q === null || q === void 0 ? void 0 : q.headers),
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
                        appid: _,
                        upn: w,
                        tid: O,
                        oid: $
                    } = JSON.parse(Buffer.from(z, "base64").toString("utf8"));
                Tv.info(`[Authenticated account] Client ID: ${_}. Tenant ID: ${O}. User Principal Name: ${w||q}. Object ID (user): ${$}`)
            } catch (K) {
                Tv.warning("allowLoggingAccountIdentifiers was set, but we couldn't log the account information. Error:", K.message)
            }
        }
    }
})
// @from(Ln 177941, Col 0)
function hp7(A) {
    let q = n39[A];
    if (q) throw new D4(q)
}
// @from(Ln 177946, Col 0)
function Sp7(A) {
    let q = ["User", "settings.json"],
        K = "Code",
        Y = d39.homedir();

    function z(..._) {
        let w = c39.join(..._, "Code", ...q);
        return JSON.parse(U39.readFileSync(w, {
            encoding: "utf8"
        }))[A]
    }
    try {
        let _;
        switch (process.platform) {
            case "win32":
                return _ = process.env.APPDATA, _ ? z(_) : void 0;
            case "darwin":
                return z(Y, "Library", "Application Support");
            case "linux":
                return z(Y, ".config");
            default:
                return
        }
    } catch (_) {
        UK6.info(`Failed to load the Visual Studio Code configuration file. Error: ${_.message}`);
        return
    }
}
// @from(Ln 177974, Col 0)
class SX8 {
    constructor(A) {
        this.cloudName = Sp7("azure.cloud") || "AzureCloud";
        let q = r39[this.cloudName];
        if (this.identityClient = new dm(Object.assign({
                authorityHost: q
            }, A)), A && A.tenantId) dJ(UK6, A.tenantId), this.tenantId = A.tenantId;
        else this.tenantId = l39;
        this.additionallyAllowedTenantIds = _$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), hp7(this.tenantId)
    }
    async prepare() {
        let A = Sp7("azure.tenant");
        if (A) this.tenantId = A;
        hp7(this.tenantId)
    }
    prepareOnce() {
        if (!this.preparePromise) this.preparePromise = this.prepare();
        return this.preparePromise
    }
    async getToken(A, q) {
        var K, Y;
        await this.prepareOnce();
        let z = WO(this.tenantId, q, this.additionallyAllowedTenantIds, UK6) || this.tenantId;
        if (hX8 === void 0) throw new D4(["No implementation of `VisualStudioCodeCredential` is available.", "You must install the identity-vscode plugin package (`npm install --save-dev @azure/identity-vscode`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(vsCodePlugin)` before creating a `VisualStudioCodeCredential`.", "To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot."].join(" "));
        let _ = typeof A === "string" ? A : A.join(" ");
        if (!_.match(/^[0-9a-zA-Z-.:/]+$/)) {
            let $ = Error("Invalid scope was specified by the user or calling client");
            throw UK6.getToken.info(d9(A, $)), $
        }
        if (_.indexOf("offline_access") < 0) _ += " offline_access";
        let w = await hX8(),
            {
                password: O
            } = (Y = (K = w.find(({
                account: $
            }) => $ === this.cloudName)) !== null && K !== void 0 ? K : w[0]) !== null && Y !== void 0 ? Y : {};
        if (O) {
            let $ = await this.identityClient.refreshAccessToken(z, i39, _, O, void 0);
            if ($) return UK6.getToken.info(UJ(A)), $.accessToken;
            else {
                let H = new D4("Could not retrieve the token associated with Visual Studio Code. Have you connected using the 'Azure Account' extension recently? To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot.");
                throw UK6.getToken.info(d9(A, H)), H
            }
        } else {
            let $ = new D4("Could not retrieve the token associated with Visual Studio Code. Did you connect using the 'Azure Account' extension? To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot.");
            throw UK6.getToken.info(d9(A, $)), $
        }
    }
}
// @from(Ln 178023, Col 4)
l39 = "common"
// @from(Ln 178024, Col 4)
i39 = "aebc6443-996d-45c2-90f0-388ff96faa56"
// @from(Ln 178025, Col 4)
UK6
// @from(Ln 178025, Col 9)
hX8 = void 0
// @from(Ln 178026, Col 4)
Cp7
// @from(Ln 178026, Col 9)
n39
// @from(Ln 178026, Col 14)
r39
// @from(Ln 178027, Col 4)
CX8 = E(() => {
    H2();
    QM();
    Bm();
    pM();
    bm6();
    QM();
    UK6 = h5("VisualStudioCodeCredential"), Cp7 = {
        setVsCodeCredentialFinder(A) {
            hX8 = A
        }
    }, n39 = {
        adfs: "The VisualStudioCodeCredential does not support authentication with ADFS tenants."
    };
    r39 = {
        AzureCloud: mm.AzurePublicCloud,
        AzureChina: mm.AzureChina,
        AzureGermanCloud: mm.AzureGermany,
        AzureUSGovernment: mm.AzureGovernment
    }
})
// @from(Ln 178049, Col 0)
function a39(A) {
    A(o39)
}
// @from(Ln 178052, Col 4)
o39
// @from(Ln 178053, Col 4)
Ip7 = E(() => {
    ND8();
    CX8();
    o39 = {
        cachePluginControl: bB7,
        nativeBrokerPluginControl: xB7,
        vsCodeCredentialControl: Cp7
    }
})
// @from(Ln 178062, Col 0)
class dK6 {
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
// @from(Ln 178162, Col 4)
kj1 = E(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 178164, Col 4)
S8
// @from(Ln 178164, Col 8)
f5
// @from(Ln 178164, Col 12)
lW
// @from(Ln 178164, Col 16)
IX8
// @from(Ln 178164, Col 21)
Iw
// @from(Ln 178164, Col 25)
Nv
// @from(Ln 178164, Col 29)
cK6
// @from(Ln 178164, Col 34)
Ls
// @from(Ln 178164, Col 38)
Ej1
// @from(Ln 178164, Col 43)
PP6
// @from(Ln 178164, Col 48)
cm
// @from(Ln 178164, Col 52)
Vv
// @from(Ln 178164, Col 56)
lK6
// @from(Ln 178164, Col 61)
iU
// @from(Ln 178164, Col 65)
D_
// @from(Ln 178164, Col 69)
xm6 = "appmetadata"
// @from(Ln 178165, Col 4)
bp7 = "client_info"
// @from(Ln 178166, Col 4)
Rs = "1"
// @from(Ln 178167, Col 4)
WP6
// @from(Ln 178167, Col 9)
rG
// @from(Ln 178167, Col 13)
UM
// @from(Ln 178167, Col 17)
k9
// @from(Ln 178167, Col 21)
lm
// @from(Ln 178167, Col 25)
um6
// @from(Ln 178167, Col 30)
mm6
// @from(Ln 178167, Col 35)
iK6
// @from(Ln 178167, Col 40)
yj1
// @from(Ln 178167, Col 45)
l2
// @from(Ln 178167, Col 49)
ZP6 = 300
// @from(Ln 178168, Col 4)
cP
// @from(Ln 178169, Col 4)
bw = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    S8 = {
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
    }, f5 = {
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
    }, lW = [S8.OPENID_SCOPE, S8.PROFILE_SCOPE, S8.OFFLINE_ACCESS_SCOPE], IX8 = [...lW, S8.EMAIL_SCOPE], Iw = {
        CONTENT_TYPE: "Content-Type",
        CONTENT_LENGTH: "Content-Length",
        RETRY_AFTER: "Retry-After",
        CCS_HEADER: "X-AnchorMailbox",
        WWWAuthenticate: "WWW-Authenticate",
        AuthenticationInfo: "Authentication-Info",
        X_MS_REQUEST_ID: "x-ms-request-id",
        X_MS_HTTP_VERSION: "x-ms-httpver"
    }, Nv = {
        COMMON: "common",
        ORGANIZATIONS: "organizations",
        CONSUMERS: "consumers"
    }, cK6 = {
        ACCESS_TOKEN: "access_token",
        XMS_CC: "xms_cc"
    }, Ls = {
        LOGIN: "login",
        SELECT_ACCOUNT: "select_account",
        CONSENT: "consent",
        NONE: "none",
        CREATE: "create",
        NO_SESSION: "no_session"
    }, Ej1 = {
        PLAIN: "plain",
        S256: "S256"
    }, PP6 = {
        CODE: "code",
        IDTOKEN_TOKEN: "id_token token",
        IDTOKEN_TOKEN_REFRESHTOKEN: "id_token token refresh_token"
    }, cm = {
        QUERY: "query",
        FRAGMENT: "fragment",
        FORM_POST: "form_post"
    }, Vv = {
        IMPLICIT_GRANT: "implicit",
        AUTHORIZATION_CODE_GRANT: "authorization_code",
        CLIENT_CREDENTIALS_GRANT: "client_credentials",
        RESOURCE_OWNER_PASSWORD_GRANT: "password",
        REFRESH_TOKEN_GRANT: "refresh_token",
        DEVICE_CODE_GRANT: "device_code",
        JWT_BEARER: "urn:ietf:params:oauth:grant-type:jwt-bearer"
    }, lK6 = {
        MSSTS_ACCOUNT_TYPE: "MSSTS",
        ADFS_ACCOUNT_TYPE: "ADFS",
        MSAV1_ACCOUNT_TYPE: "MSA",
        GENERIC_ACCOUNT_TYPE: "Generic"
    }, iU = {
        CACHE_KEY_SEPARATOR: "-",
        CLIENT_INFO_SEPARATOR: "."
    }, D_ = {
        ID_TOKEN: "IdToken",
        ACCESS_TOKEN: "AccessToken",
        ACCESS_TOKEN_WITH_AUTH_SCHEME: "AccessToken_With_AuthScheme",
        REFRESH_TOKEN: "RefreshToken"
    }, WP6 = {
        CACHE_KEY: "authority-metadata",
        REFRESH_TIME_SECONDS: 86400
    }, rG = {
        CONFIG: "config",
        CACHE: "cache",
        NETWORK: "network",
        HARDCODED_VALUES: "hardcoded_values"
    }, UM = {
        SCHEMA_VERSION: 5,
        MAX_LAST_HEADER_BYTES: 330,
        MAX_CACHED_ERRORS: 50,
        CACHE_KEY: "server-telemetry",
        CATEGORY_SEPARATOR: "|",
        VALUE_SEPARATOR: ",",
        OVERFLOW_TRUE: "1",
        OVERFLOW_FALSE: "0",
        UNKNOWN_ERROR: "unknown_error"
    }, k9 = {
        BEARER: "Bearer",
        POP: "pop",
        SSH: "ssh-cert"
    }, lm = {
        DEFAULT_THROTTLE_TIME_SECONDS: 60,
        DEFAULT_MAX_THROTTLE_TIME_SECONDS: 3600,
        THROTTLING_PREFIX: "throttling",
        X_MS_LIB_CAPABILITY_VALUE: "retry-after, h429"
    }, um6 = {
        INVALID_GRANT_ERROR: "invalid_grant",
        CLIENT_MISMATCH_ERROR: "client_mismatch"
    }, mm6 = {
        username: "username",
        password: "password"
    }, iK6 = {
        FAILED_AUTO_DETECTION: "1",
        INTERNAL_CACHE: "2",
        ENVIRONMENT_VARIABLE: "3",
        IMDS: "4"
    }, yj1 = {
        CONFIGURED_NO_AUTO_DETECTION: "2",
        AUTO_DETECTION_REQUESTED_SUCCESSFUL: "4",
        AUTO_DETECTION_REQUESTED_FAILED: "5"
    }, l2 = {
        NOT_APPLICABLE: "0",
        FORCE_REFRESH_OR_CLAIMS: "1",
        NO_CACHED_ACCESS_TOKEN: "2",
        CACHED_ACCESS_TOKEN_EXPIRED: "3",
        PROACTIVELY_REFRESHED: "4"
    }, cP = {
        BASE64: "base64",
        HEX: "hex",
        UTF8: "utf-8"
    }
})
// @from(Ln 178337, Col 4)
GP6 = {}
// @from(Ln 178342, Col 4)
Bm6 = "unexpected_error"
// @from(Ln 178343, Col 4)
gm6 = "post_request_failed"
// @from(Ln 178344, Col 4)
bX8 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 178347, Col 0)
function uX8(A, q) {
    return new T5(A, q ? `${Lj1[A]} ${q}` : Lj1[A])
}
// @from(Ln 178350, Col 4)
Lj1
// @from(Ln 178350, Col 9)
xX8
// @from(Ln 178350, Col 14)
T5
// @from(Ln 178351, Col 4)
UL = E(() => {
    bw();
    bX8(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Lj1 = {
        [Bm6]: "Unexpected error in authentication.",
        [gm6]: "Post request failed from the network, could be a 4xx/5xx or a network unavailability. Please check the exact error code for details."
    }, xX8 = {
        unexpectedError: {
            code: Bm6,
            desc: Lj1[Bm6]
        },
        postRequestFailed: {
            code: gm6,
            desc: Lj1[gm6]
        }
    };
    T5 = class T5 extends Error {
        constructor(A, q, K) {
            let Y = q ? `${A}: ${q}` : A;
            super(Y);
            Object.setPrototypeOf(this, T5.prototype), this.errorCode = A || S8.EMPTY_STRING, this.errorMessage = q || S8.EMPTY_STRING, this.subError = K || S8.EMPTY_STRING, this.name = "AuthError"
        }
        setCorrelationId(A) {
            this.correlationId = A
        }
    }
})
// @from(Ln 178378, Col 4)
j2 = {}
// @from(Ln 178425, Col 4)
hs = "client_info_decoding_error"
// @from(Ln 178426, Col 4)
nK6 = "client_info_empty_error"
// @from(Ln 178427, Col 4)
Ss = "token_parsing_error"
// @from(Ln 178428, Col 4)
rK6 = "null_or_empty_token"
// @from(Ln 178429, Col 4)
oG = "endpoints_resolution_error"
// @from(Ln 178430, Col 4)
oK6 = "network_error"
// @from(Ln 178431, Col 4)
aK6 = "openid_config_error"
// @from(Ln 178432, Col 4)
sK6 = "hash_not_deserialized"
// @from(Ln 178433, Col 4)
nC = "invalid_state"
// @from(Ln 178434, Col 4)
tK6 = "state_mismatch"
// @from(Ln 178435, Col 4)
Cs = "state_not_found"
// @from(Ln 178436, Col 4)
eK6 = "nonce_mismatch"
// @from(Ln 178437, Col 4)
nU = "auth_time_not_found"
// @from(Ln 178438, Col 4)
A56 = "max_age_transpired"
// @from(Ln 178439, Col 4)
Fm6 = "multiple_matching_tokens"
// @from(Ln 178440, Col 4)
pm6 = "multiple_matching_accounts"
// @from(Ln 178441, Col 4)
q56 = "multiple_matching_appMetadata"
// @from(Ln 178442, Col 4)
K56 = "request_cannot_be_made"
// @from(Ln 178443, Col 4)
Y56 = "cannot_remove_empty_scope"
// @from(Ln 178444, Col 4)
z56 = "cannot_append_scopeset"
// @from(Ln 178445, Col 4)
Is = "empty_input_scopeset"
// @from(Ln 178446, Col 4)
Qm6 = "device_code_polling_cancelled"
// @from(Ln 178447, Col 4)
Um6 = "device_code_expired"
// @from(Ln 178448, Col 4)
dm6 = "device_code_unknown_error"
// @from(Ln 178449, Col 4)
rU = "no_account_in_silent_request"
// @from(Ln 178450, Col 4)
_56 = "invalid_cache_record"
// @from(Ln 178451, Col 4)
oU = "invalid_cache_environment"
// @from(Ln 178452, Col 4)
cm6 = "no_account_found"
// @from(Ln 178453, Col 4)
bs = "no_crypto_object"
// @from(Ln 178454, Col 4)
lm6 = "unexpected_credential_type"
// @from(Ln 178455, Col 4)
im6 = "invalid_assertion"
// @from(Ln 178456, Col 4)
nm6 = "invalid_client_credential"
// @from(Ln 178457, Col 4)
aU = "token_refresh_required"
// @from(Ln 178458, Col 4)
rm6 = "user_timeout_reached"
// @from(Ln 178459, Col 4)
w56 = "token_claims_cnf_required_for_signedjwt"
// @from(Ln 178460, Col 4)
O56 = "authorization_code_missing_from_server_response"
// @from(Ln 178461, Col 4)
om6 = "binding_key_not_removed"
// @from(Ln 178462, Col 4)
$56 = "end_session_endpoint_not_supported"
// @from(Ln 178463, Col 4)
H56 = "key_id_missing"
// @from(Ln 178464, Col 4)
am6 = "no_network_connectivity"
// @from(Ln 178465, Col 4)
sm6 = "user_canceled"
// @from(Ln 178466, Col 4)
tm6 = "missing_tenant_id_error"
// @from(Ln 178467, Col 4)
G3 = "method_not_implemented"
// @from(Ln 178468, Col 4)
em6 = "nested_app_auth_bridge_disabled"
// @from(Ln 178469, Col 4)
Sj = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 178472, Col 0)
function t8(A, q) {
    return new xs(A, q)
}
// @from(Ln 178475, Col 4)
v5
// @from(Ln 178475, Col 8)
mX8
// @from(Ln 178475, Col 13)
xs
// @from(Ln 178476, Col 4)
cJ = E(() => {
    UL();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    v5 = {
        [hs]: "The client info could not be parsed/decoded correctly",
        [nK6]: "The client info was empty",
        [Ss]: "Token cannot be parsed",
        [rK6]: "The token is null or empty",
        [oG]: "Endpoints cannot be resolved",
        [oK6]: "Network request failed",
        [aK6]: "Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints.",
        [sK6]: "The hash parameters could not be deserialized",
        [nC]: "State was not the expected format",
        [tK6]: "State mismatch error",
        [Cs]: "State not found",
        [eK6]: "Nonce mismatch error",
        [nU]: "Max Age was requested and the ID token is missing the auth_time variable. auth_time is an optional claim and is not enabled by default - it must be enabled. See https://aka.ms/msaljs/optional-claims for more information.",
        [A56]: "Max Age is set to 0, or too much time has elapsed since the last end-user authentication.",
        [Fm6]: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account.",
        [pm6]: "The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account",
        [q56]: "The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata",
        [K56]: "Token request cannot be made without authorization code or refresh token.",
        [Y56]: "Cannot remove null or empty scope from ScopeSet",
        [z56]: "Cannot append ScopeSet",
        [Is]: "Empty input ScopeSet cannot be processed",
        [Qm6]: "Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true.",
        [Um6]: "Device code is expired.",
        [dm6]: "Device code stopped polling for unknown reasons.",
        [rU]: "Please pass an account object, silent flow is not supported without account information",
        [_56]: "Cache record object was null or undefined.",
        [oU]: "Invalid environment when attempting to create cache entry",
        [cm6]: "No account found in cache for given key.",
        [bs]: "No crypto object detected.",
        [lm6]: "Unexpected credential type.",
        [im6]: "Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515",
        [nm6]: "Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential",
        [aU]: "Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired.",
        [rm6]: "User defined timeout for device code polling reached",
        [w56]: "Cannot generate a POP jwt if the token_claims are not populated",
        [O56]: "Server response does not contain an authorization code to proceed",
        [om6]: "Could not remove the credential's binding key from storage.",
        [$56]: "The provided authority does not support logout",
        [H56]: "A keyId value is missing from the requested bound token's cache record and is required to match the token to it's stored binding key.",
        [am6]: "No network connectivity. Check your internet connection.",
        [sm6]: "User cancelled the flow.",
        [tm6]: "A tenant id - not common, organizations, or consumers - must be specified when using the client_credentials flow.",
        [G3]: "This method has not been implemented",
        [em6]: "The nested app auth bridge is disabled"
    }, mX8 = {
        clientInfoDecodingError: {
            code: hs,
            desc: v5[hs]
        },
        clientInfoEmptyError: {
            code: nK6,
            desc: v5[nK6]
        },
        tokenParsingError: {
            code: Ss,
            desc: v5[Ss]
        },
        nullOrEmptyToken: {
            code: rK6,
            desc: v5[rK6]
        },
        endpointResolutionError: {
            code: oG,
            desc: v5[oG]
        },
        networkError: {
            code: oK6,
            desc: v5[oK6]
        },
        unableToGetOpenidConfigError: {
            code: aK6,
            desc: v5[aK6]
        },
        hashNotDeserialized: {
            code: sK6,
            desc: v5[sK6]
        },
        invalidStateError: {
            code: nC,
            desc: v5[nC]
        },
        stateMismatchError: {
            code: tK6,
            desc: v5[tK6]
        },
        stateNotFoundError: {
            code: Cs,
            desc: v5[Cs]
        },
        nonceMismatchError: {
            code: eK6,
            desc: v5[eK6]
        },
        authTimeNotFoundError: {
            code: nU,
            desc: v5[nU]
        },
        maxAgeTranspired: {
            code: A56,
            desc: v5[A56]
        },
        multipleMatchingTokens: {
            code: Fm6,
            desc: v5[Fm6]
        },
        multipleMatchingAccounts: {
            code: pm6,
            desc: v5[pm6]
        },
        multipleMatchingAppMetadata: {
            code: q56,
            desc: v5[q56]
        },
        tokenRequestCannotBeMade: {
            code: K56,
            desc: v5[K56]
        },
        removeEmptyScopeError: {
            code: Y56,
            desc: v5[Y56]
        },
        appendScopeSetError: {
            code: z56,
            desc: v5[z56]
        },
        emptyInputScopeSetError: {
            code: Is,
            desc: v5[Is]
        },
        DeviceCodePollingCancelled: {
            code: Qm6,
            desc: v5[Qm6]
        },
        DeviceCodeExpired: {
            code: Um6,
            desc: v5[Um6]
        },
        DeviceCodeUnknownError: {
            code: dm6,
            desc: v5[dm6]
        },
        NoAccountInSilentRequest: {
            code: rU,
            desc: v5[rU]
        },
        invalidCacheRecord: {
            code: _56,
            desc: v5[_56]
        },
        invalidCacheEnvironment: {
            code: oU,
            desc: v5[oU]
        },
        noAccountFound: {
            code: cm6,
            desc: v5[cm6]
        },
        noCryptoObj: {
            code: bs,
            desc: v5[bs]
        },
        unexpectedCredentialType: {
            code: lm6,
            desc: v5[lm6]
        },
        invalidAssertion: {
            code: im6,
            desc: v5[im6]
        },
        invalidClientCredential: {
            code: nm6,
            desc: v5[nm6]
        },
        tokenRefreshRequired: {
            code: aU,
            desc: v5[aU]
        },
        userTimeoutReached: {
            code: rm6,
            desc: v5[rm6]
        },
        tokenClaimsRequired: {
            code: w56,
            desc: v5[w56]
        },
        noAuthorizationCodeFromServer: {
            code: O56,
            desc: v5[O56]
        },
        bindingKeyNotRemovedError: {
            code: om6,
            desc: v5[om6]
        },
        logoutNotSupported: {
            code: $56,
            desc: v5[$56]
        },
        keyIdMissing: {
            code: H56,
            desc: v5[H56]
        },
        noNetworkConnectivity: {
            code: am6,
            desc: v5[am6]
        },
        userCanceledError: {
            code: sm6,
            desc: v5[sm6]
        },
        missingTenantIdError: {
            code: tm6,
            desc: v5[tm6]
        },
        nestedAppAuthBridgeDisabled: {
            code: em6,
            desc: v5[em6]
        }
    };
    xs = class xs extends T5 {
        constructor(A, q) {
            super(A, q ? `${v5[A]}: ${q}` : v5[A]);
            this.name = "ClientAuthError", Object.setPrototypeOf(this, xs.prototype)
        }
    }
})
// @from(Ln 178705, Col 4)
fP6
// @from(Ln 178706, Col 4)
BX8 = E(() => {
    cJ();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    fP6 = {
        createNewGuid: () => {
            throw t8(G3)
        },
        base64Decode: () => {
            throw t8(G3)
        },
        base64Encode: () => {
            throw t8(G3)
        },
        base64UrlEncode: () => {
            throw t8(G3)
        },
        encodeKid: () => {
            throw t8(G3)
        },
        async getPublicKeyThumbprint() {
            throw t8(G3)
        },
        async removeTokenBindingKey() {
            throw t8(G3)
        },
        async clearKeystore() {
            throw t8(G3)
        },
        async signJwt() {
            throw t8(G3)
        },
        async hashString() {
            throw t8(G3)
        }
    }
})
// @from(Ln 178742, Col 0)
class kv {
    constructor(A, q, K) {
        this.level = l$.Info;
        let Y = () => {
                return
            },
            z = A || kv.createDefaultLoggerOptions();
        this.localCallback = z.loggerCallback || Y, this.piiLoggingEnabled = z.piiLoggingEnabled || !1, this.level = typeof z.logLevel === "number" ? z.logLevel : l$.Info, this.correlationId = z.correlationId || S8.EMPTY_STRING, this.packageName = q || S8.EMPTY_STRING, this.packageVersion = K || S8.EMPTY_STRING
    }
    static createDefaultLoggerOptions() {
        return {
            loggerCallback: () => {},
            piiLoggingEnabled: !1,
            logLevel: l$.Info
        }
    }
    clone(A, q, K) {
        return new kv({
            loggerCallback: this.localCallback,
            piiLoggingEnabled: this.piiLoggingEnabled,
            logLevel: this.level,
            correlationId: K || this.correlationId
        }, A, q)
    }
    logMessage(A, q) {
        if (q.logLevel > this.level || !this.piiLoggingEnabled && q.containsPii) return;
        let z = `${`[${new Date().toUTCString()}] : [${q.correlationId||this.correlationId||""}]`} : ${this.packageName}@${this.packageVersion} : ${l$[q.logLevel]} - ${A}`;
        this.executeCallback(q.logLevel, z, q.containsPii || !1)
    }
    executeCallback(A, q, K) {
        if (this.localCallback) this.localCallback(A, q, K)
    }
    error(A, q) {
        this.logMessage(A, {
            logLevel: l$.Error,
            containsPii: !1,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    errorPii(A, q) {
        this.logMessage(A, {
            logLevel: l$.Error,
            containsPii: !0,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    warning(A, q) {
        this.logMessage(A, {
            logLevel: l$.Warning,
            containsPii: !1,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    warningPii(A, q) {
        this.logMessage(A, {
            logLevel: l$.Warning,
            containsPii: !0,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    info(A, q) {
        this.logMessage(A, {
            logLevel: l$.Info,
            containsPii: !1,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    infoPii(A, q) {
        this.logMessage(A, {
            logLevel: l$.Info,
            containsPii: !0,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    verbose(A, q) {
        this.logMessage(A, {
            logLevel: l$.Verbose,
            containsPii: !1,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    verbosePii(A, q) {
        this.logMessage(A, {
            logLevel: l$.Verbose,
            containsPii: !0,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    trace(A, q) {
        this.logMessage(A, {
            logLevel: l$.Trace,
            containsPii: !1,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    tracePii(A, q) {
        this.logMessage(A, {
            logLevel: l$.Trace,
            containsPii: !0,
            correlationId: q || S8.EMPTY_STRING
        })
    }
    isPiiLoggingEnabled() {
        return this.piiLoggingEnabled || !1
    }
}
// @from(Ln 178848, Col 4)
l$
// @from(Ln 178849, Col 4)
Rj1 = E(() => {
    bw(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    (function(A) {
        A[A.Error = 0] = "Error", A[A.Warning = 1] = "Warning", A[A.Info = 2] = "Info", A[A.Verbose = 3] = "Verbose", A[A.Trace = 4] = "Trace"
    })(l$ || (l$ = {}))
})
// @from(Ln 178855, Col 4)
hj1 = "@azure/msal-common"
// @from(Ln 178856, Col 4)
TP6 = "15.13.1"
// @from(Ln 178857, Col 4)
Sj1 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 178859, Col 4)
sU
// @from(Ln 178860, Col 4)
Cj1 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    sU = {
        None: "none",
        AzurePublic: "https://login.microsoftonline.com",
        AzurePpe: "https://login.windows-ppe.net",
        AzureChina: "https://login.chinacloudapi.cn",
        AzureGermany: "https://login.microsoftonline.de",
        AzureUsGovernment: "https://login.microsoftonline.us"
    }
})
// @from(Ln 178871, Col 4)
vP6 = {}
// @from(Ln 178897, Col 4)
j56 = "redirect_uri_empty"
// @from(Ln 178898, Col 4)
AB6 = "claims_request_parsing_error"
// @from(Ln 178899, Col 4)
J56 = "authority_uri_insecure"
// @from(Ln 178900, Col 4)
im = "url_parse_error"
// @from(Ln 178901, Col 4)
M56 = "empty_url_error"
// @from(Ln 178902, Col 4)
D56 = "empty_input_scopes_error"
// @from(Ln 178903, Col 4)
us = "invalid_claims"
// @from(Ln 178904, Col 4)
X56 = "token_request_empty"
// @from(Ln 178905, Col 4)
P56 = "logout_request_empty"
// @from(Ln 178906, Col 4)
qB6 = "invalid_code_challenge_method"
// @from(Ln 178907, Col 4)
W56 = "pkce_params_missing"
// @from(Ln 178908, Col 4)
ms = "invalid_cloud_discovery_metadata"
// @from(Ln 178909, Col 4)
Z56 = "invalid_authority_metadata"
// @from(Ln 178910, Col 4)
G56 = "untrusted_authority"
// @from(Ln 178911, Col 4)
tU = "missing_ssh_jwk"
// @from(Ln 178912, Col 4)
KB6 = "missing_ssh_kid"
// @from(Ln 178913, Col 4)
YB6 = "missing_nonce_authentication_header"
// @from(Ln 178914, Col 4)
zB6 = "invalid_authentication_header"
// @from(Ln 178915, Col 4)
_B6 = "cannot_set_OIDCOptions"
// @from(Ln 178916, Col 4)
wB6 = "cannot_allow_platform_broker"
// @from(Ln 178917, Col 4)
OB6 = "authority_mismatch"
// @from(Ln 178918, Col 4)
$B6 = "invalid_request_method_for_EAR"
// @from(Ln 178919, Col 4)
HB6 = "invalid_authorize_post_body_parameters"
// @from(Ln 178920, Col 4)
eU = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 178923, Col 0)
function J2(A) {
    return new NP6(A)
}
// @from(Ln 178926, Col 4)
w$
// @from(Ln 178926, Col 8)
gX8
// @from(Ln 178926, Col 13)
NP6
// @from(Ln 178927, Col 4)
Bs = E(() => {
    UL();
    eU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    w$ = {
        [j56]: "A redirect URI is required for all calls, and none has been set.",
        [AB6]: "Could not parse the given claims request object.",
        [J56]: "Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",
        [im]: "URL could not be parsed into appropriate segments.",
        [M56]: "URL was empty or null.",
        [D56]: "Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token.",
        [us]: "Given claims parameter must be a stringified JSON object.",
        [X56]: "Token request was empty and not found in cache.",
        [P56]: "The logout request was null or undefined.",
        [qB6]: 'code_challenge_method passed is invalid. Valid values are "plain" and "S256".',
        [W56]: "Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request",
        [ms]: "Invalid cloudDiscoveryMetadata provided. Must be a stringified JSON object containing tenant_discovery_endpoint and metadata fields",
        [Z56]: "Invalid authorityMetadata provided. Must by a stringified JSON object containing authorization_endpoint, token_endpoint, issuer fields.",
        [G56]: "The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter.",
        [tU]: "Missing sshJwk in SSH certificate request. A stringified JSON Web Key is required when using the SSH authentication scheme.",
        [KB6]: "Missing sshKid in SSH certificate request. A string that uniquely identifies the public SSH key is required when using the SSH authentication scheme.",
        [YB6]: "Unable to find an authentication header containing server nonce. Either the Authentication-Info or WWW-Authenticate headers must be present in order to obtain a server nonce.",
        [zB6]: "Invalid authentication header provided",
        [_B6]: "Cannot set OIDCOptions parameter. Please change the protocol mode to OIDC or use a non-Microsoft authority.",
        [wB6]: "Cannot set allowPlatformBroker parameter to true when not in AAD protocol mode.",
        [OB6]: "Authority mismatch error. Authority provided in login request or PublicClientApplication config does not match the environment of the provided account. Please use a matching account or make an interactive request to login to this authority.",
        [HB6]: "Invalid authorize post body parameters provided. If you are using authorizePostBodyParameters, the request method must be POST. Please check the request method and parameters.",
        [$B6]: "Invalid request method for EAR protocol mode. The request method cannot be GET when using EAR protocol mode. Please change the request method to POST."
    }, gX8 = {
        redirectUriNotSet: {
            code: j56,
            desc: w$[j56]
        },
        claimsRequestParsingError: {
            code: AB6,
            desc: w$[AB6]
        },
        authorityUriInsecure: {
            code: J56,
            desc: w$[J56]
        },
        urlParseError: {
            code: im,
            desc: w$[im]
        },
        urlEmptyError: {
            code: M56,
            desc: w$[M56]
        },
        emptyScopesError: {
            code: D56,
            desc: w$[D56]
        },
        invalidClaimsRequest: {
            code: us,
            desc: w$[us]
        },
        tokenRequestEmptyError: {
            code: X56,
            desc: w$[X56]
        },
        logoutRequestEmptyError: {
            code: P56,
            desc: w$[P56]
        },
        invalidCodeChallengeMethod: {
            code: qB6,
            desc: w$[qB6]
        },
        invalidCodeChallengeParams: {
            code: W56,
            desc: w$[W56]
        },
        invalidCloudDiscoveryMetadata: {
            code: ms,
            desc: w$[ms]
        },
        invalidAuthorityMetadata: {
            code: Z56,
            desc: w$[Z56]
        },
        untrustedAuthority: {
            code: G56,
            desc: w$[G56]
        },
        missingSshJwk: {
            code: tU,
            desc: w$[tU]
        },
        missingSshKid: {
            code: KB6,
            desc: w$[KB6]
        },
        missingNonceAuthenticationHeader: {
            code: YB6,
            desc: w$[YB6]
        },
        invalidAuthenticationHeader: {
            code: zB6,
            desc: w$[zB6]
        },
        cannotSetOIDCOptions: {
            code: _B6,
            desc: w$[_B6]
        },
        cannotAllowPlatformBroker: {
            code: wB6,
            desc: w$[wB6]
        },
        authorityMismatch: {
            code: OB6,
            desc: w$[OB6]
        },
        invalidAuthorizePostBodyParameters: {
            code: HB6,
            desc: w$[HB6]
        },
        invalidRequestMethodForEAR: {
            code: $B6,
            desc: w$[$B6]
        }
    };
    NP6 = class NP6 extends T5 {
        constructor(A) {
            super(A, w$[A]);
            this.name = "ClientConfigurationError", Object.setPrototypeOf(this, NP6.prototype)
        }
    }
})
// @from(Ln 179055, Col 0)
class i2 {
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
                let [_, w] = z.split(/=(.+)/g, 2);
                if (_ && w) q[Y(_)] = Y(w)
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
// @from(Ln 179099, Col 4)
gs = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 179101, Col 0)
class UH {
    constructor(A) {
        let q = A ? i2.trimArrayEntries([...A]) : [],
            K = q ? i2.removeEmptyStringsFromArray(q) : [];
        if (!K || !K.length) throw J2(D56);
        this.scopes = new Set, K.forEach((Y) => this.scopes.add(Y))
    }
    static fromString(A) {
        let K = (A || S8.EMPTY_STRING).split(" ");
        return new UH(K)
    }
    static createSearchScopes(A) {
        let q = A && A.length > 0 ? A : [...lW],
            K = new UH(q);
        if (!K.containsOnlyOIDCScopes()) K.removeOIDCScopes();
        else K.removeScope(S8.OFFLINE_ACCESS_SCOPE);
        return K
    }
    containsScope(A) {
        let q = this.printScopesLowerCase().split(" "),
            K = new UH(q);
        return A ? K.scopes.has(A.toLowerCase()) : !1
    }
    containsScopeSet(A) {
        if (!A || A.scopes.size <= 0) return !1;
        return this.scopes.size >= A.scopes.size && A.asArray().every((q) => this.containsScope(q))
    }
    containsOnlyOIDCScopes() {
        let A = 0;
        return IX8.forEach((q) => {
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
            throw t8(z56)
        }
    }
    removeScope(A) {
        if (!A) throw t8(Y56);
        this.scopes.delete(A.trim())
    }
    removeOIDCScopes() {
        IX8.forEach((A) => {
            this.scopes.delete(A)
        })
    }
    unionScopeSets(A) {
        if (!A) throw t8(Is);
        let q = new Set;
        return A.scopes.forEach((K) => q.add(K.toLowerCase())), this.scopes.forEach((K) => q.add(K.toLowerCase())), q
    }
    intersectingScopeSets(A) {
        if (!A) throw t8(Is);
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
        return S8.EMPTY_STRING
    }
    printScopesLowerCase() {
        return this.printScopes().toLowerCase()
    }
}
// @from(Ln 179181, Col 4)
jB6 = E(() => {
    Bs();
    gs();
    cJ();
    bw();
    eU();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 179190, Col 0)
function VP6(A, q) {
    if (!A) throw t8(nK6);
    try {
        let K = q(A);
        return JSON.parse(K)
    } catch (K) {
        throw t8(hs)
    }
}
// @from(Ln 179200, Col 0)
function nm(A) {
    if (!A) throw t8(hs);
    let q = A.split(iU.CLIENT_INFO_SEPARATOR, 2);
    return {
        uid: q[0],
        utid: q.length < 2 ? S8.EMPTY_STRING : q[1]
    }
}
// @from(Ln 179208, Col 4)
kP6 = E(() => {
    cJ();
    bw();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 179214, Col 0)
function xp7(A, q) {
    return !!A && !!q && A === q.split(".")[1]
}
// @from(Ln 179218, Col 0)
function JB6(A, q, K, Y) {
    if (Y) {
        let {
            oid: z,
            sub: _,
            tid: w,
            name: O,
            tfp: $,
            acr: H,
            preferred_username: j,
            upn: J,
            login_hint: M
        } = Y, D = w || $ || H || "";
        return {
            tenantId: D,
            localAccountId: z || _ || "",
            name: O,
            username: j || J || "",
            loginHint: M,
            isHomeTenant: xp7(D, A)
        }
    } else return {
        tenantId: K,
        localAccountId: q,
        username: "",
        isHomeTenant: xp7(K, A)
    }
}
// @from(Ln 179247, Col 0)
function Ij1(A, q, K, Y) {
    let z = A;
    if (q) {
        let {
            isHomeTenant: _,
            ...w
        } = q;
        z = {
            ...A,
            ...w
        }
    }
    if (K) {
        let {
            isHomeTenant: _,
            ...w
        } = JB6(A.homeAccountId, A.localAccountId, A.tenantId, K);
        return z = {
            ...z,
            ...w,
            idTokenClaims: K,
            idToken: Y
        }, z
    }
    return z
}
// @from(Ln 179273, Col 4)
bj1 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 179275, Col 4)
dL
// @from(Ln 179276, Col 4)
FX8 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    dL = {
        Default: 0,
        Adfs: 1,
        Dsts: 2,
        Ciam: 3
    }
})
// @from(Ln 179286, Col 0)
function xj1(A) {
    if (A) return A.tid || A.tfp || A.acr || null;
    return null
}
// @from(Ln 179290, Col 4)
pX8 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 179292, Col 4)
iW
// @from(Ln 179293, Col 4)
MB6 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    iW = {
        AAD: "AAD",
        OIDC: "OIDC",
        EAR: "EAR"
    }
})
// @from(Ln 179301, Col 0)
class lJ {
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
        let Y = new lJ;
        if (q.authorityType === dL.Adfs) Y.authorityType = lK6.ADFS_ACCOUNT_TYPE;
        else if (q.protocolMode === iW.OIDC) Y.authorityType = lK6.GENERIC_ACCOUNT_TYPE;
        else Y.authorityType = lK6.MSSTS_ACCOUNT_TYPE;
        let z;
        if (A.clientInfo && K) {
            if (z = VP6(A.clientInfo, K), z.xms_tdbr) Y.dataBoundary = z.xms_tdbr === "EU" ? "EU" : "None"
        }
        Y.clientInfo = A.clientInfo, Y.homeAccountId = A.homeAccountId, Y.nativeAccountId = A.nativeAccountId;
        let _ = A.environment || q && q.getPreferredCache();
        if (!_) throw t8(oU);
        Y.environment = _, Y.realm = z?.utid || xj1(A.idTokenClaims) || "", Y.localAccountId = z?.uid || A.idTokenClaims?.oid || A.idTokenClaims?.sub || "";
        let w = A.idTokenClaims?.preferred_username || A.idTokenClaims?.upn,
            O = A.idTokenClaims?.emails ? A.idTokenClaims.emails[0] : null;
        if (Y.username = w || O || "", Y.loginHint = A.idTokenClaims?.login_hint, Y.name = A.idTokenClaims?.name || "", Y.cloudGraphHostName = A.cloudGraphHostName, Y.msGraphHost = A.msGraphHost, A.tenantProfiles) Y.tenantProfiles = A.tenantProfiles;
        else {
            let $ = JB6(A.homeAccountId, Y.localAccountId, Y.realm, A.idTokenClaims);
            Y.tenantProfiles = [$]
        }
        return Y
    }
    static createFromAccountInfo(A, q, K) {
        let Y = new lJ;
        return Y.authorityType = A.authorityType || lK6.GENERIC_ACCOUNT_TYPE, Y.homeAccountId = A.homeAccountId, Y.localAccountId = A.localAccountId, Y.nativeAccountId = A.nativeAccountId, Y.realm = A.tenantId, Y.environment = A.environment, Y.username = A.username, Y.name = A.name, Y.loginHint = A.loginHint, Y.cloudGraphHostName = q, Y.msGraphHost = K, Y.tenantProfiles = Array.from(A.tenantProfiles?.values() || []), Y.dataBoundary = A.dataBoundary, Y
    }
    static generateHomeAccountId(A, q, K, Y, z) {
        if (!(q === dL.Adfs || q === dL.Dsts)) {
            if (A) try {
                let _ = VP6(A, Y.base64Decode);
                if (_.uid && _.utid) return `${_.uid}.${_.utid}`
            } catch (_) {}
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
                _ = q.idTokenClaims || {};
            Y = z.iat === _.iat && z.nonce === _.nonce
        }
        return A.homeAccountId === q.homeAccountId && A.localAccountId === q.localAccountId && A.username === q.username && A.tenantId === q.tenantId && A.loginHint === q.loginHint && A.environment === q.environment && A.nativeAccountId === q.nativeAccountId && Y
    }
}
// @from(Ln 179373, Col 4)
uj1 = E(() => {
    bw();
    kP6();
    bj1();
    cJ();
    FX8();
    pX8();
    MB6();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 179383, Col 4)
mj1 = {}
// @from(Ln 179391, Col 0)
function Ad(A, q) {
    let K = up7(A);
    try {
        let Y = q(K);
        return JSON.parse(Y)
    } catch (Y) {
        throw t8(Ss)
    }
}
// @from(Ln 179401, Col 0)
function QX8(A) {
    if (!A.signin_state) return !1;
    let q = ["kmsi", "dvc_dmjd"];
    return A.signin_state.some((Y) => q.includes(Y.trim().toLowerCase()))
}
// @from(Ln 179407, Col 0)
function up7(A) {
    if (!A) throw t8(rK6);
    let K = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(A);
    if (!K || K.length < 4) throw t8(Ss);
    return K[2]
}
// @from(Ln 179414, Col 0)
function DB6(A, q) {
    if (q === 0 || Date.now() - 300000 > A + q) throw t8(A56)
}
// @from(Ln 179417, Col 4)
EP6 = E(() => {
    cJ();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 179421, Col 4)
lP = {}
// @from(Ln 179429, Col 0)
function mp7(A) {
    if (!A) return A;
    let q = A.toLowerCase();
    if (i2.endsWith(q, "?")) q = q.slice(0, -1);
    else if (i2.endsWith(q, "?/")) q = q.slice(0, -2);
    if (!i2.endsWith(q, "/")) q += "/";
    return q
}
// @from(Ln 179438, Col 0)
function Bp7(A) {
    if (A.startsWith("#/")) return A.substring(2);
    else if (A.startsWith("#") || A.startsWith("?")) return A.substring(1);
    return A
}
// @from(Ln 179444, Col 0)
function UX8(A) {
    if (!A || A.indexOf("=") < 0) return null;
    try {
        let q = Bp7(A),
            K = Object.fromEntries(new URLSearchParams(q));
        if (K.code || K.ear_jwe || K.error || K.error_description || K.state) return K
    } catch (q) {
        throw t8(sK6)
    }
    return null
}
// @from(Ln 179456, Col 0)
function rm(A, q = !0, K) {
    let Y = [];
    return A.forEach((z, _) => {
        if (!q && K && _ in K) Y.push(`${_}=${z}`);
        else Y.push(`${_}=${encodeURIComponent(z)}`)
    }), Y.join("&")
}
// @from(Ln 179464, Col 0)
function s39(A) {
    if (!A) return A;
    let q = A.split("#")[0];
    try {
        let K = new URL(q),
            Y = K.origin + K.pathname + K.search;
        return mp7(Y)
    } catch (K) {
        return mp7(q)
    }
}
// @from(Ln 179475, Col 4)
f56 = E(() => {
    cJ();
    gs();
    Sj(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 179480, Col 0)
class U5 {
    get urlString() {
        return this._urlString
    }
    constructor(A) {
        if (this._urlString = A, !this._urlString) throw J2(M56);
        if (!A.includes("#")) this._urlString = U5.canonicalizeUri(A)
    }
    static canonicalizeUri(A) {
        if (A) {
            let q = A.toLowerCase();
            if (i2.endsWith(q, "?")) q = q.slice(0, -1);
            else if (i2.endsWith(q, "?/")) q = q.slice(0, -2);
            if (!i2.endsWith(q, "/")) q += "/";
            return q
        }
        return A
    }
    validateAsUri() {
        let A;
        try {
            A = this.getUrlComponents()
        } catch (q) {
            throw J2(im)
        }
        if (!A.HostNameAndPort || !A.PathSegments) throw J2(im);
        if (!A.Protocol || A.Protocol.toLowerCase() !== "https:") throw J2(J56)
    }
    static appendQueryString(A, q) {
        if (!q) return A;
        return A.indexOf("?") < 0 ? `${A}?${q}` : `${A}&${q}`
    }
    static removeHashFromUrl(A) {
        return U5.canonicalizeUri(A.split("#")[0])
    }
    replaceTenantPath(A) {
        let q = this.getUrlComponents(),
            K = q.PathSegments;
        if (A && K.length !== 0 && (K[0] === Nv.COMMON || K[0] === Nv.ORGANIZATIONS)) K[0] = A;
        return U5.constructAuthorityUriFromObject(q)
    }
    getUrlComponents() {
        let A = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"),
            q = this.urlString.match(A);
        if (!q) throw J2(im);
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
        if (!K) throw J2(im);
        return K[2]
    }
    static getAbsoluteUrl(A, q) {
        if (A[0] === S8.FORWARD_SLASH) {
            let Y = new U5(q).getUrlComponents();
            return Y.Protocol + "//" + Y.HostNameAndPort + A
        }
        return A
    }
    static constructAuthorityUriFromObject(A) {
        return new U5(A.Protocol + "//" + A.HostNameAndPort + "/" + A.PathSegments.join("/"))
    }
    static hashContainsKnownProperties(A) {
        return !!UX8(A)
    }
}
// @from(Ln 179555, Col 4)
Fs = E(() => {
    Bs();
    gs();
    bw();
    f56();
    eU(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 179563, Col 0)
function pp7(A, q) {
    let K, Y = A.canonicalAuthority;
    if (Y) {
        let z = new U5(Y).getUrlComponents().HostNameAndPort;
        K = gp7(z, A.cloudDiscoveryMetadata?.metadata, rG.CONFIG, q) || gp7(z, cX8.metadata, rG.HARDCODED_VALUES, q) || A.knownAuthorities
    }
    return K || []
}
// @from(Ln 179572, Col 0)
function gp7(A, q, K, Y) {
    if (Y?.trace(`getAliasesFromMetadata called with source: ${K}`), A && q) {
        let z = XB6(q, A);
        if (z) return Y?.trace(`getAliasesFromMetadata: found cloud discovery metadata in ${K}, returning aliases`), z.aliases;
        else Y?.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in ${K}`)
    }
    return null
}
// @from(Ln 179581, Col 0)
function Qp7(A) {
    return XB6(cX8.metadata, A)
}
// @from(Ln 179585, Col 0)
function XB6(A, q) {
    for (let K = 0; K < A.length; K++) {
        let Y = A[K];
        if (Y.aliases.includes(q)) return Y
    }
    return null
}
// @from(Ln 179592, Col 4)
Fp7
// @from(Ln 179592, Col 9)
dX8
// @from(Ln 179592, Col 14)
cX8
// @from(Ln 179592, Col 19)
lX8
// @from(Ln 179593, Col 4)
iX8 = E(() => {
    Fs();
    bw(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    Fp7 = {
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
    }, dX8 = Fp7.endpointMetadata, cX8 = Fp7.instanceDiscoveryMetadata, lX8 = new Set;
    cX8.metadata.forEach((A) => {
        A.aliases.forEach((q) => {
            lX8.add(q)
        })
    })
})
// @from(Ln 179650, Col 4)
nX8 = "cache_quota_exceeded"
// @from(Ln 179651, Col 4)
Bj1 = "cache_error_unknown"
// @from(Ln 179652, Col 4)
Up7 = E(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 179655, Col 0)
function dp7(A) {
    if (!(A instanceof Error)) return new PB6(Bj1);
    if (A.name === "QuotaExceededError" || A.name === "NS_ERROR_DOM_QUOTA_REACHED" || A.message.includes("exceeded the quota")) return new PB6(nX8);
    else return new PB6(A.name, A.message)
}
// @from(Ln 179660, Col 4)
rX8
// @from(Ln 179660, Col 9)
PB6
// @from(Ln 179661, Col 4)
cp7 = E(() => {
    UL();
    Up7(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    rX8 = {
        [nX8]: "Exceeded cache storage capacity.",
        [Bj1]: "Unexpected error occurred when using cache storage."
    };
    PB6 = class PB6 extends T5 {
        constructor(A, q) {
            let K = q || (rX8[A] ? rX8[A] : rX8[Bj1]);
            super(`${A}: ${K}`);
            Object.setPrototypeOf(this, PB6.prototype), this.name = "CacheError", this.errorCode = A, this.errorMessage = K
        }
    }
})