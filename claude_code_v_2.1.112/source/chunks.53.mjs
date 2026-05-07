
// @from(Ln 131942, Col 0)
class _L1 {
    constructor(q) {
        let {
            clientSecret: K
        } = q, {
            certificatePath: _,
            sendCertificateChain: z
        } = q, {
            getAssertion: Y
        } = q, {
            tenantId: A,
            clientId: O,
            userAssertionToken: w,
            additionallyAllowedTenants: $
        } = q;
        if (!A) throw new c4(`${FV6}: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!O) throw new c4(`${FV6}: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!K && !_ && !Y) throw new c4(`${FV6}: You must provide one of clientSecret, certificatePath, or a getAssertion callback but none were provided. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!w) throw new c4(`${FV6}: userAssertionToken is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        this.certificatePath = _, this.clientSecret = K, this.userAssertionToken = w, this.sendCertificateChain = z, this.clientAssertion = Y, this.tenantId = A, this.additionallyAllowedTenantIds = _H($), this.msalClient = uv(O, this.tenantId, Object.assign(Object.assign({}, q), {
            logger: KL1,
            tokenCredentialOptions: q
        }))
    }
    async getToken(q, K = {}) {
        return _A.withSpan(`${FV6}.getToken`, K, async (_) => {
            _.tenantId = Oj(this.tenantId, _, this.additionallyAllowedTenantIds, KL1);
            let z = th(q);
            if (this.certificatePath) {
                let Y = await this.buildClientCertificate(this.certificatePath);
                return this.msalClient.getTokenOnBehalfOf(z, this.userAssertionToken, Y, _)
            } else if (this.clientSecret) return this.msalClient.getTokenOnBehalfOf(z, this.userAssertionToken, this.clientSecret, K);
            else if (this.clientAssertion) return this.msalClient.getTokenOnBehalfOf(z, this.userAssertionToken, this.clientAssertion, K);
            else throw Error("Expected either clientSecret or certificatePath or clientAssertion to be defined.")
        })
    }
    async buildClientCertificate(q) {
        try {
            let K = await this.parseCertificate({
                certificatePath: q
            }, this.sendCertificateChain);
            return {
                thumbprint: K.thumbprint,
                thumbprintSha256: K.thumbprintSha256,
                privateKey: K.certificateContents,
                x5c: K.x5c
            }
        } catch (K) {
            throw KL1.info(YY("", K)), K
        }
    }
    async parseCertificate(q, K) {
        let _ = q.certificatePath,
            z = await j4_(_, "utf8"),
            Y = K ? z : void 0,
            A = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g,
            O = [],
            w;
        do
            if (w = A.exec(z), w) O.push(w[3]); while (w);
        if (O.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
        let $ = iIq("sha1").update(Buffer.from(O[0], "base64")).digest("hex").toUpperCase(),
            j = iIq("sha256").update(Buffer.from(O[0], "base64")).digest("hex").toUpperCase();
        return {
            certificateContents: z,
            thumbprintSha256: j,
            thumbprint: $,
            x5c: Y
        }
    }
}
// @from(Ln 132013, Col 4)
FV6 = "OnBehalfOfCredential"
// @from(Ln 132014, Col 4)
KL1
// @from(Ln 132015, Col 4)
rIq = L(() => {
    io();
    rw();
    pW();
    BW();
    cQ();
    $f();
    KL1 = u9(FV6)
})
// @from(Ln 132025, Col 0)
function oIq(q, K, _) {
    let {
        abortSignal: z,
        tracingOptions: Y
    } = _ || {}, A = Fn6();
    A.addPolicy(rn6({
        credential: q,
        scopes: K
    }));
    async function O() {
        var w;
        let j = (w = (await A.sendRequest({
            sendRequest: (H) => Promise.resolve({
                request: H,
                status: 200,
                headers: H.headers
            })
        }, nh({
            url: "https://example.com",
            abortSignal: z,
            tracingOptions: Y
        }))).headers.get("authorization")) === null || w === void 0 ? void 0 : w.split(" ")[1];
        if (!j) throw Error("Failed to get access token");
        return j
    }
    return O
}
// @from(Ln 132052, Col 4)
aIq = L(() => {
    CQ()
})
// @from(Ln 132055, Col 4)
sIq = {}
// @from(Ln 132091, Col 0)
function H4_() {
    return new lr6
}
// @from(Ln 132094, Col 4)
tIq = L(() => {
    ry1();
    BW();
    DT8();
    Qy1();
    cy1();
    ry1();
    ny1();
    dy1();
    GT8();
    my1();
    By1();
    QIq();
    xy1();
    dIq();
    cIq();
    nIq();
    gy1();
    ly1();
    Ik1();
    rIq();
    vT8();
    rw();
    LQ();
    aIq();
    dyq()
})
// @from(Ln 132121, Col 4)
nr6 = L(() => {
    m0()
})
// @from(Ln 132124, Col 4)
zL1 = (q) => (zL1 = Array.isArray, zL1(q))
// @from(Ln 132125, Col 4)
YL1
// @from(Ln 132126, Col 4)
kT8 = L(() => {
    nr6();
    YL1 = zL1
})
// @from(Ln 132131, Col 0)
function* X4_(q) {
    if (!q) return;
    if (eIq in q) {
        let {
            values: z,
            nulls: Y
        } = q;
        yield* z.entries();
        for (let A of Y) yield [A, null];
        return
    }
    let K = !1,
        _;
    if (q instanceof Headers) _ = q.entries();
    else if (YL1(q)) _ = q;
    else K = !0, _ = Object.entries(q ?? {});
    for (let z of _) {
        let Y = z[0];
        if (typeof Y !== "string") throw TypeError("expected header name to be a string");
        let A = YL1(z[1]) ? z[1] : [z[1]],
            O = !1;
        for (let w of A) {
            if (w === void 0) continue;
            if (K && !O) O = !0, yield [Y, null];
            yield [Y, w]
        }
    }
}
// @from(Ln 132159, Col 4)
eIq
// @from(Ln 132159, Col 9)
AL1 = (q) => {
    let K = new Headers,
        _ = new Set;
    for (let z of q) {
        let Y = new Set;
        for (let [A, O] of X4_(z)) {
            let w = A.toLowerCase();
            if (!Y.has(w)) K.delete(A), Y.add(w);
            if (O === null) K.delete(A), _.add(w);
            else K.append(A, O), _.delete(w)
        }
    }
    return {
        [eIq]: !0,
        values: K,
        nulls: _
    }
}
// @from(Ln 132177, Col 4)
qxq = L(() => {
    kT8();
    eIq = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 132181, Col 4)
Kxq = L(() => {
    nr6()
})
// @from(Ln 132184, Col 4)
gV6 = (q) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[q]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(q)?.trim();
    return
}
// @from(Ln 132189, Col 4)
_xq = L(() => {
    kT8()
})
// @from(Ln 132192, Col 4)
zxq = L(() => {
    nr6()
})
// @from(Ln 132195, Col 4)
Yxq = L(() => {
    kT8();
    Kxq();
    _xq();
    zxq()
})
// @from(Ln 132202, Col 4)
Axq
// @from(Ln 132202, Col 9)
Oxq
// @from(Ln 132202, Col 14)
wxq
// @from(Ln 132202, Col 19)
$xq
// @from(Ln 132202, Col 24)
P4_ = (q) => Promise.resolve().then(() => K6(LT6(), 1)).then(({
        fromNodeProviderChain: K
    }) => K({
        ...q != null ? {
            profile: q
        } : {},
        clientConfig: {
            requestHandler: new Oxq.FetchHttpHandler({
                requestInit: (_) => {
                    return {
                        ..._
                    }
                }
            })
        }
    })).catch((K) => {
        throw Error(`Failed to import '@aws-sdk/credential-providers'. You can provide a custom \`providerChainResolver\` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': \`new AnthropicAws({ providerChainResolver })\` Original error: ${K.message}`)
    })
// @from(Ln 132220, Col 4)
jxq = async (q, K) => {
        M4_(q.method, "Expected request method property to be set");
        let _;
        if (K.awsAccessKey && K.awsSecretAccessKey) _ = {
            accessKeyId: K.awsAccessKey,
            secretAccessKey: K.awsSecretAccessKey,
            ...K.awsSessionToken != null && {
                sessionToken: K.awsSessionToken
            }
        };
        else if (K.providerChainResolver) _ = await (await K.providerChainResolver())();
        else _ = await (await P4_(K.awsProfile))();
        let z = new $xq.SignatureV4({
                service: K.serviceName,
                region: K.regionName,
                credentials: _,
                sha256: Axq.Sha256
            }),
            Y = new URL(K.url),
            A = !q.headers ? {} : (Symbol.iterator in q.headers) ? Object.fromEntries(Array.from(q.headers).map((j) => [...j])) : {
                ...q.headers
            };
        delete A.connection, A.host = Y.hostname;
        let O = {};
        Y.searchParams.forEach((j, H) => {
            O[H] = j
        });
        let w = new wxq.HttpRequest({
            method: q.method.toUpperCase(),
            protocol: Y.protocol,
            path: Y.pathname,
            query: O,
            headers: A,
            body: q.body
        });
        return (await z.sign(w)).headers
    }
// @from(Ln 132257, Col 4)
Hxq = L(() => {
    Axq = K6(Kf8(), 1), Oxq = K6(DO6(), 1), wxq = K6(Wn6(), 1), $xq = K6(ff8(), 1)
})
// @from(Ln 132260, Col 4)
W4_ = "aws-external-anthropic"
// @from(Ln 132261, Col 4)
OL1
// @from(Ln 132262, Col 4)
wL1 = L(() => {
    qxq();
    nr6();
    Yxq();
    yC();
    yC();
    Hxq();
    OL1 = class OL1 extends qh {
        constructor({
            awsRegion: q,
            baseURL: K,
            apiKey: _,
            awsAccessKey: z = null,
            awsSecretAccessKey: Y = null,
            awsSessionToken: A = null,
            awsProfile: O,
            providerChainResolver: w = null,
            workspaceId: $,
            skipAuth: j = !1,
            ...H
        } = {}) {
            let J = q ?? gV6("AWS_REGION") ?? gV6("AWS_DEFAULT_REGION"),
                X = K ?? gV6("ANTHROPIC_AWS_BASE_URL") ?? (J ? `https://aws-external-anthropic.${J}.api.aws` : void 0);
            if (!X && !j) throw new bq("No AWS region or base URL found. Set `awsRegion` in the constructor, the `AWS_REGION` / `AWS_DEFAULT_REGION` environment variable, or provide a `baseURL` / `ANTHROPIC_AWS_BASE_URL` environment variable.");
            let M = _ != null;
            if (z != null !== (Y != null)) throw new bq("`awsAccessKey` and `awsSecretAccessKey` must be provided together. You provided only one.");
            let W = z != null && Y != null,
                D = O != null,
                Z;
            if (M) Z = _;
            else if (!W && !D) Z = gV6("ANTHROPIC_AWS_API_KEY") ?? void 0;
            let G = $ ?? gV6("ANTHROPIC_AWS_WORKSPACE_ID");
            if (!G && !j) throw new bq("No workspace ID found. Set `workspaceId` in the constructor or the `ANTHROPIC_AWS_WORKSPACE_ID` environment variable.");
            super({
                apiKey: Z,
                baseURL: X,
                ...H,
                defaultHeaders: AL1([{
                    "anthropic-workspace-id": G
                }, H.defaultHeaders])
            });
            this.skipAuth = !1, this.awsRegion = J, this.awsAccessKey = z, this.awsSecretAccessKey = Y, this.awsSessionToken = A, this.awsProfile = O ?? null, this.providerChainResolver = w, this.workspaceId = G, this.skipAuth = j, this._useSigV4 = Z == null
        }
        async authHeaders(q) {
            if (this.skipAuth) return;
            if (!this._useSigV4) return super.authHeaders(q);
            return
        }
        validateHeaders() {}
        async prepareRequest(q, {
            url: K,
            options: _
        }) {
            if (this.skipAuth || !this._useSigV4) return;
            let z = this.awsRegion;
            if (!z) throw new bq("No AWS region found. Set `awsRegion` in the constructor or the `AWS_REGION` / `AWS_DEFAULT_REGION` environment variable.");
            let Y = await jxq(q, {
                url: K,
                regionName: z,
                serviceName: W4_,
                awsAccessKey: this.awsAccessKey,
                awsSecretAccessKey: this.awsSecretAccessKey,
                awsSessionToken: this.awsSessionToken,
                awsProfile: this.awsProfile,
                providerChainResolver: this.providerChainResolver
            });
            q.headers = AL1([Y, q.headers]).values
        }
    }
})
// @from(Ln 132332, Col 4)
Jxq = {}
// @from(Ln 132338, Col 4)
Xxq = L(() => {
    wL1();
    wL1()
})
// @from(Ln 132342, Col 4)
$L1 = p((MFO, vxq) => {
    var NT8 = Object.prototype.hasOwnProperty,
        Gxq = Object.prototype.toString,
        Mxq = Object.defineProperty,
        Pxq = Object.getOwnPropertyDescriptor,
        Wxq = function(K) {
            if (typeof Array.isArray === "function") return Array.isArray(K);
            return Gxq.call(K) === "[object Array]"
        },
        Dxq = function(K) {
            if (!K || Gxq.call(K) !== "[object Object]") return !1;
            var _ = NT8.call(K, "constructor"),
                z = K.constructor && K.constructor.prototype && NT8.call(K.constructor.prototype, "isPrototypeOf");
            if (K.constructor && !_ && !z) return !1;
            var Y;
            for (Y in K);
            return typeof Y > "u" || NT8.call(K, Y)
        },
        Zxq = function(K, _) {
            if (Mxq && _.name === "__proto__") Mxq(K, _.name, {
                enumerable: !0,
                configurable: !0,
                value: _.newValue,
                writable: !0
            });
            else K[_.name] = _.newValue
        },
        fxq = function(K, _) {
            if (_ === "__proto__") {
                if (!NT8.call(K, _)) return;
                else if (Pxq) return Pxq(K, _).value
            }
            return K[_]
        };
    vxq.exports = function q() {
        var K, _, z, Y, A, O, w = arguments[0],
            $ = 1,
            j = arguments.length,
            H = !1;
        if (typeof w === "boolean") H = w, w = arguments[1] || {}, $ = 2;
        if (w == null || typeof w !== "object" && typeof w !== "function") w = {};
        for (; $ < j; ++$)
            if (K = arguments[$], K != null) {
                for (_ in K)
                    if (z = fxq(w, _), Y = fxq(K, _), w !== Y) {
                        if (H && Y && (Dxq(Y) || (A = Wxq(Y)))) {
                            if (A) A = !1, O = z && Wxq(z) ? z : [];
                            else O = z && Dxq(z) ? z : {};
                            Zxq(w, {
                                name: _,
                                newValue: q(H, O, Y)
                            })
                        } else if (typeof Y < "u") Zxq(w, {
                            name: _,
                            newValue: Y
                        })
                    }
            } return w
    }
})
// @from(Ln 132402, Col 4)
yT8 = p((Nxq) => {
    function sw(q, K, _) {
        if (_.globals) q = _.globals[q.name];
        return new q(`${_.context?_.context:"Value"} ${K}.`)
    }

    function dV6(q, K) {
        if (typeof q === "bigint") throw sw(TypeError, "is a BigInt which cannot be converted to a number", K);
        if (!K.globals) return Number(q);
        return K.globals.Number(q)
    }

    function Vxq(q) {
        if (q > 0 && q % 1 === 0.5 && (q & 1) === 0 || q < 0 && q % 1 === -0.5 && (q & 1) === 1) return ir6(Math.floor(q));
        return ir6(Math.round(q))
    }

    function ET8(q) {
        return ir6(Math.trunc(q))
    }

    function Txq(q) {
        return q < 0 ? -1 : 1
    }

    function D4_(q, K) {
        let _ = q % K;
        if (Txq(K) !== Txq(_)) return _ + K;
        return _
    }

    function ir6(q) {
        return q === 0 ? 0 : q
    }

    function cV6(q, {
        unsigned: K
    }) {
        let _, z;
        if (K) _ = 0, z = 2 ** q - 1;
        else _ = -(2 ** (q - 1)), z = 2 ** (q - 1) - 1;
        let Y = 2 ** q,
            A = 2 ** (q - 1);
        return (O, w = {}) => {
            let $ = dV6(O, w);
            if ($ = ir6($), w.enforceRange) {
                if (!Number.isFinite($)) throw sw(TypeError, "is not a finite number", w);
                if ($ = ET8($), $ < _ || $ > z) throw sw(TypeError, `is outside the accepted range of ${_} to ${z}, inclusive`, w);
                return $
            }
            if (!Number.isNaN($) && w.clamp) return $ = Math.min(Math.max($, _), z), $ = Vxq($), $;
            if (!Number.isFinite($) || $ === 0) return 0;
            if ($ = ET8($), $ >= _ && $ <= z) return $;
            if ($ = D4_($, Y), !K && $ >= A) return $ - Y;
            return $
        }
    }

    function kxq(q, {
        unsigned: K
    }) {
        let _ = Number.MAX_SAFE_INTEGER,
            z = K ? 0 : Number.MIN_SAFE_INTEGER,
            Y = K ? BigInt.asUintN : BigInt.asIntN;
        return (A, O = {}) => {
            let w = dV6(A, O);
            if (w = ir6(w), O.enforceRange) {
                if (!Number.isFinite(w)) throw sw(TypeError, "is not a finite number", O);
                if (w = ET8(w), w < z || w > _) throw sw(TypeError, `is outside the accepted range of ${z} to ${_}, inclusive`, O);
                return w
            }
            if (!Number.isNaN(w) && O.clamp) return w = Math.min(Math.max(w, z), _), w = Vxq(w), w;
            if (!Number.isFinite(w) || w === 0) return 0;
            let $ = BigInt(ET8(w));
            return $ = Y(q, $), Number($)
        }
    }
    Nxq.any = (q) => {
        return q
    };
    Nxq.undefined = () => {
        return
    };
    Nxq.boolean = (q) => {
        return Boolean(q)
    };
    Nxq.byte = cV6(8, {
        unsigned: !1
    });
    Nxq.octet = cV6(8, {
        unsigned: !0
    });
    Nxq.short = cV6(16, {
        unsigned: !1
    });
    Nxq["unsigned short"] = cV6(16, {
        unsigned: !0
    });
    Nxq.long = cV6(32, {
        unsigned: !1
    });
    Nxq["unsigned long"] = cV6(32, {
        unsigned: !0
    });
    Nxq["long long"] = kxq(64, {
        unsigned: !1
    });
    Nxq["unsigned long long"] = kxq(64, {
        unsigned: !0
    });
    Nxq.double = (q, K = {}) => {
        let _ = dV6(q, K);
        if (!Number.isFinite(_)) throw sw(TypeError, "is not a finite floating-point value", K);
        return _
    };
    Nxq["unrestricted double"] = (q, K = {}) => {
        return dV6(q, K)
    };
    Nxq.float = (q, K = {}) => {
        let _ = dV6(q, K);
        if (!Number.isFinite(_)) throw sw(TypeError, "is not a finite floating-point value", K);
        if (Object.is(_, -0)) return _;
        let z = Math.fround(_);
        if (!Number.isFinite(z)) throw sw(TypeError, "is outside the range of a single-precision floating-point value", K);
        return z
    };
    Nxq["unrestricted float"] = (q, K = {}) => {
        let _ = dV6(q, K);
        if (isNaN(_)) return _;
        if (Object.is(_, -0)) return _;
        return Math.fround(_)
    };
    Nxq.DOMString = (q, K = {}) => {
        if (K.treatNullAsEmptyString && q === null) return "";
        if (typeof q === "symbol") throw sw(TypeError, "is a symbol, which cannot be converted to a string", K);
        return (K.globals ? K.globals.String : String)(q)
    };
    Nxq.ByteString = (q, K = {}) => {
        let _ = Nxq.DOMString(q, K),
            z;
        for (let Y = 0;
            (z = _.codePointAt(Y)) !== void 0; ++Y)
            if (z > 255) throw sw(TypeError, "is not a valid ByteString", K);
        return _
    };
    Nxq.USVString = (q, K = {}) => {
        let _ = Nxq.DOMString(q, K),
            z = _.length,
            Y = [];
        for (let A = 0; A < z; ++A) {
            let O = _.charCodeAt(A);
            if (O < 55296 || O > 57343) Y.push(String.fromCodePoint(O));
            else if (56320 <= O && O <= 57343) Y.push(String.fromCodePoint(65533));
            else if (A === z - 1) Y.push(String.fromCodePoint(65533));
            else {
                let w = _.charCodeAt(A + 1);
                if (56320 <= w && w <= 57343) {
                    let $ = O & 1023,
                        j = w & 1023;
                    Y.push(String.fromCodePoint(65536 + 1024 * $ + j)), ++A
                } else Y.push(String.fromCodePoint(65533))
            }
        }
        return Y.join("")
    };
    Nxq.object = (q, K = {}) => {
        if (q === null || typeof q !== "object" && typeof q !== "function") throw sw(TypeError, "is not an object", K);
        return q
    };
    var Z4_ = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get,
        f4_ = typeof SharedArrayBuffer === "function" ? Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get : null;

    function jL1(q) {
        try {
            return Z4_.call(q), !0
        } catch {
            return !1
        }
    }

    function UV6(q) {
        try {
            return f4_.call(q), !0
        } catch {
            return !1
        }
    }

    function QV6(q) {
        try {
            return new Uint8Array(q), !1
        } catch {
            return !0
        }
    }
    Nxq.ArrayBuffer = (q, K = {}) => {
        if (!jL1(q)) {
            if (K.allowShared && !UV6(q)) throw sw(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", K);
            throw sw(TypeError, "is not an ArrayBuffer", K)
        }
        if (QV6(q)) throw sw(TypeError, "is a detached ArrayBuffer", K);
        return q
    };
    var G4_ = Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
    Nxq.DataView = (q, K = {}) => {
        try {
            G4_.call(q)
        } catch (_) {
            throw sw(TypeError, "is not a DataView", K)
        }
        if (!K.allowShared && UV6(q.buffer)) throw sw(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", K);
        if (QV6(q.buffer)) throw sw(TypeError, "is backed by a detached ArrayBuffer", K);
        return q
    };
    var v4_ = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array).prototype, Symbol.toStringTag).get;
    [Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array].forEach((q) => {
        let {
            name: K
        } = q, _ = /^[AEIOU]/u.test(K) ? "an" : "a";
        Nxq[K] = (z, Y = {}) => {
            if (!ArrayBuffer.isView(z) || v4_.call(z) !== K) throw sw(TypeError, `is not ${_} ${K} object`, Y);
            if (!Y.allowShared && UV6(z.buffer)) throw sw(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", Y);
            if (QV6(z.buffer)) throw sw(TypeError, "is a view on a detached ArrayBuffer", Y);
            return z
        }
    });
    Nxq.ArrayBufferView = (q, K = {}) => {
        if (!ArrayBuffer.isView(q)) throw sw(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", K);
        if (!K.allowShared && UV6(q.buffer)) throw sw(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", K);
        if (QV6(q.buffer)) throw sw(TypeError, "is a view on a detached ArrayBuffer", K);
        return q
    };
    Nxq.BufferSource = (q, K = {}) => {
        if (ArrayBuffer.isView(q)) {
            if (!K.allowShared && UV6(q.buffer)) throw sw(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", K);
            if (QV6(q.buffer)) throw sw(TypeError, "is a view on a detached ArrayBuffer", K);
            return q
        }
        if (!K.allowShared && !jL1(q)) throw sw(TypeError, "is not an ArrayBuffer or a view on one", K);
        if (K.allowShared && !UV6(q) && !jL1(q)) throw sw(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", K);
        if (QV6(q)) throw sw(TypeError, "is a detached ArrayBuffer", K);
        return q
    };
    Nxq.DOMTimeStamp = Nxq["unsigned long long"]
})
// @from(Ln 132647, Col 4)
hT8 = p((bxq, Ixq) => {
    function d4_(q) {
        return typeof q === "object" && q !== null || typeof q === "function"
    }
    var yxq = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

    function c4_(q, K) {
        for (let _ of Reflect.ownKeys(K)) {
            let z = Reflect.getOwnPropertyDescriptor(K, _);
            if (z && !Reflect.defineProperty(q, _, z)) throw TypeError(`Cannot redefine property: ${String(_)}`)
        }
    }

    function l4_(q, K) {
        let _ = Rxq(q);
        return Object.defineProperties(Object.create(_["%Object.prototype%"]), Object.getOwnPropertyDescriptors(K))
    }
    var Lxq = Symbol("wrapper"),
        hxq = Symbol("impl"),
        lV6 = Symbol("SameObject caches"),
        LT8 = Symbol.for("[webidl2js] constructor registry"),
        n4_ = Object.getPrototypeOf(Object.getPrototypeOf(async function*() {}).prototype);

    function Rxq(q) {
        if (yxq(q, LT8)) return q[LT8];
        let K = Object.create(null);
        K["%Object.prototype%"] = q.Object.prototype, K["%IteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(new q.Array()[Symbol.iterator]()));
        try {
            K["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(q.eval("(async function* () {})").prototype))
        } catch {
            K["%AsyncIteratorPrototype%"] = n4_
        }
        return q[LT8] = K, K
    }

    function i4_(q, K, _) {
        if (!q[lV6]) q[lV6] = Object.create(null);
        if (K in q[lV6]) return q[lV6][K];
        return q[lV6][K] = _(), q[lV6][K]
    }

    function Sxq(q) {
        return q ? q[Lxq] : null
    }

    function Cxq(q) {
        return q ? q[hxq] : null
    }

    function r4_(q) {
        let K = Sxq(q);
        return K ? K : q
    }

    function o4_(q) {
        let K = Cxq(q);
        return K ? K : q
    }
    var a4_ = Symbol("internal");

    function s4_(q) {
        if (typeof q !== "string") return !1;
        let K = q >>> 0;
        if (K === 4294967295) return !1;
        let _ = `${K}`;
        if (q !== _) return !1;
        return !0
    }
    var t4_ = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;

    function e4_(q) {
        try {
            return t4_.call(q), !0
        } catch (K) {
            return !1
        }
    }

    function qK_([q, K], _) {
        let z;
        switch (_) {
            case "key":
                z = q;
                break;
            case "value":
                z = K;
                break;
            case "key+value":
                z = [q, K];
                break
        }
        return {
            value: z,
            done: !1
        }
    }
    var KK_ = Symbol("supports property index"),
        _K_ = Symbol("supported property indices"),
        zK_ = Symbol("supports property name"),
        YK_ = Symbol("supported property names"),
        AK_ = Symbol("indexed property get"),
        OK_ = Symbol("indexed property set new"),
        wK_ = Symbol("indexed property set existing"),
        $K_ = Symbol("named property get"),
        jK_ = Symbol("named property set new"),
        HK_ = Symbol("named property set existing"),
        JK_ = Symbol("named property delete"),
        XK_ = Symbol("async iterator get the next iteration result"),
        MK_ = Symbol("async iterator return steps"),
        PK_ = Symbol("async iterator initialization steps"),
        WK_ = Symbol("async iterator end of iteration");
    Ixq.exports = bxq = {
        isObject: d4_,
        hasOwn: yxq,
        define: c4_,
        newObjectInRealm: l4_,
        wrapperSymbol: Lxq,
        implSymbol: hxq,
        getSameObject: i4_,
        ctorRegistrySymbol: LT8,
        initCtorRegistry: Rxq,
        wrapperForImpl: Sxq,
        implForWrapper: Cxq,
        tryWrapperForImpl: r4_,
        tryImplForWrapper: o4_,
        iterInternalSymbol: a4_,
        isArrayBuffer: e4_,
        isArrayIndexPropName: s4_,
        supportsPropertyIndex: KK_,
        supportedPropertyIndices: _K_,
        supportsPropertyName: zK_,
        supportedPropertyNames: YK_,
        indexedGet: AK_,
        indexedSetNew: OK_,
        indexedSetExisting: wK_,
        namedGet: $K_,
        namedSetNew: jK_,
        namedSetExisting: HK_,
        namedDelete: JK_,
        asyncIteratorNext: XK_,
        asyncIteratorReturn: MK_,
        asyncIteratorInit: PK_,
        asyncIteratorEOI: WK_,
        iteratorResult: qK_
    }
})
// @from(Ln 132793, Col 4)
Uxq = p((WFO, gxq) => {
    var DK_ = /^xn--/,
        ZK_ = /[^\0-\x7F]/,
        fK_ = /[\x2E\u3002\uFF0E\uFF61]/g,
        GK_ = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input"
        },
        lQ = Math.floor,
        JL1 = String.fromCharCode;

    function gq6(q) {
        throw RangeError(GK_[q])
    }

    function vK_(q, K) {
        let _ = [],
            z = q.length;
        while (z--) _[z] = K(q[z]);
        return _
    }

    function uxq(q, K) {
        let _ = q.split("@"),
            z = "";
        if (_.length > 1) z = _[0] + "@", q = _[1];
        q = q.replace(fK_, ".");
        let Y = q.split("."),
            A = vK_(Y, K).join(".");
        return z + A
    }

    function mxq(q) {
        let K = [],
            _ = 0,
            z = q.length;
        while (_ < z) {
            let Y = q.charCodeAt(_++);
            if (Y >= 55296 && Y <= 56319 && _ < z) {
                let A = q.charCodeAt(_++);
                if ((A & 64512) == 56320) K.push(((Y & 1023) << 10) + (A & 1023) + 65536);
                else K.push(Y), _--
            } else K.push(Y)
        }
        return K
    }
    var TK_ = (q) => String.fromCodePoint(...q),
        VK_ = function(q) {
            if (q >= 48 && q < 58) return 26 + (q - 48);
            if (q >= 65 && q < 91) return q - 65;
            if (q >= 97 && q < 123) return q - 97;
            return 36
        },
        xxq = function(q, K) {
            return q + 22 + 75 * (q < 26) - ((K != 0) << 5)
        },
        Bxq = function(q, K, _) {
            let z = 0;
            q = _ ? lQ(q / 700) : q >> 1, q += lQ(q / K);
            for (; q > 455; z += 36) q = lQ(q / 35);
            return lQ(z + 36 * q / (q + 38))
        },
        pxq = function(q) {
            let K = [],
                _ = q.length,
                z = 0,
                Y = 128,
                A = 72,
                O = q.lastIndexOf("-");
            if (O < 0) O = 0;
            for (let w = 0; w < O; ++w) {
                if (q.charCodeAt(w) >= 128) gq6("not-basic");
                K.push(q.charCodeAt(w))
            }
            for (let w = O > 0 ? O + 1 : 0; w < _;) {
                let $ = z;
                for (let H = 1, J = 36;; J += 36) {
                    if (w >= _) gq6("invalid-input");
                    let X = VK_(q.charCodeAt(w++));
                    if (X >= 36) gq6("invalid-input");
                    if (X > lQ((2147483647 - z) / H)) gq6("overflow");
                    z += X * H;
                    let M = J <= A ? 1 : J >= A + 26 ? 26 : J - A;
                    if (X < M) break;
                    let P = 36 - M;
                    if (H > lQ(2147483647 / P)) gq6("overflow");
                    H *= P
                }
                let j = K.length + 1;
                if (A = Bxq(z - $, j, $ == 0), lQ(z / j) > 2147483647 - Y) gq6("overflow");
                Y += lQ(z / j), z %= j, K.splice(z++, 0, Y)
            }
            return String.fromCodePoint(...K)
        },
        Fxq = function(q) {
            let K = [];
            q = mxq(q);
            let _ = q.length,
                z = 128,
                Y = 0,
                A = 72;
            for (let $ of q)
                if ($ < 128) K.push(JL1($));
            let O = K.length,
                w = O;
            if (O) K.push("-");
            while (w < _) {
                let $ = 2147483647;
                for (let H of q)
                    if (H >= z && H < $) $ = H;
                let j = w + 1;
                if ($ - z > lQ((2147483647 - Y) / j)) gq6("overflow");
                Y += ($ - z) * j, z = $;
                for (let H of q) {
                    if (H < z && ++Y > 2147483647) gq6("overflow");
                    if (H === z) {
                        let J = Y;
                        for (let X = 36;; X += 36) {
                            let M = X <= A ? 1 : X >= A + 26 ? 26 : X - A;
                            if (J < M) break;
                            let P = J - M,
                                W = 36 - M;
                            K.push(JL1(xxq(M + P % W, 0))), J = lQ(P / W)
                        }
                        K.push(JL1(xxq(J, 0))), A = Bxq(Y, j, w === O), Y = 0, ++w
                    }
                }++Y, ++z
            }
            return K.join("")
        },
        kK_ = function(q) {
            return uxq(q, function(K) {
                return DK_.test(K) ? pxq(K.slice(4).toLowerCase()) : K
            })
        },
        NK_ = function(q) {
            return uxq(q, function(K) {
                return ZK_.test(K) ? "xn--" + Fxq(K) : K
            })
        },
        EK_ = {
            version: "2.3.1",
            ucs2: {
                decode: mxq,
                encode: TK_
            },
            decode: pxq,
            encode: Fxq,
            toASCII: NK_,
            toUnicode: kK_
        };
    gxq.exports = EK_
})