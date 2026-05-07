
// @from(Ln 103160, Col 0)
async function df1(q) {
    try {
        let K = await Z1.post(r7().API_KEY_URL, null, {
                headers: {
                    Authorization: `Bearer ${q}`
                }
            }),
            _ = K.data?.raw_key;
        if (_) return await lf1(_), d("tengu_oauth_api_key", {
            status: "success",
            statusCode: K.status
        }), _;
        return null
    } catch (K) {
        throw d("tengu_oauth_api_key", {
            status: "failure",
            error: K instanceof Error ? K.message : String(K)
        }), K
    }
}
// @from(Ln 103181, Col 0)
function XQ(q) {
    if (q === null) return !1;
    let K = 300000;
    return Date.now() + K >= q
}
// @from(Ln 103186, Col 0)
async function wZ8(q) {
    let K = await JQ(q),
        _ = K?.organization?.organization_type,
        z = null;
    switch (_) {
        case "claude_max":
            z = "max";
            break;
        case "claude_pro":
            z = "pro";
            break;
        case "claude_enterprise":
            z = "enterprise";
            break;
        case "claude_team":
            z = "team";
            break;
        default:
            z = null;
            break
    }
    let Y = {
        subscriptionType: z,
        rateLimitTier: K?.organization?.rate_limit_tier ?? null,
        hasExtraUsageEnabled: K?.organization?.has_extra_usage_enabled ?? null,
        billingType: K?.organization?.billing_type ?? null
    };
    if (K?.account?.display_name) Y.displayName = K.account.display_name;
    if (K?.account?.created_at) Y.accountCreatedAt = K.account.created_at;
    if (K?.organization?.subscription_created_at) Y.subscriptionCreatedAt = K.organization.subscription_created_at;
    return d("tengu_oauth_profile_fetch_success", {}), {
        ...Y,
        rawProfile: K
    }
}
// @from(Ln 103221, Col 0)
async function zD() {
    let q = process.env.CLAUDE_CODE_ORGANIZATION_UUID;
    if (q) return q;
    let _ = H8().oauthAccount?.organizationUuid;
    if (_) return _;
    let z = o7()?.accessToken;
    if (z === void 0 || !AD()) return null;
    let A = (await JQ(z))?.organization?.uuid;
    if (!A) return null;
    return A
}
// @from(Ln 103232, Col 0)
async function cf1() {
    let q = process.env.CLAUDE_CODE_ACCOUNT_UUID,
        K = process.env.CLAUDE_CODE_USER_EMAIL,
        _ = process.env.CLAUDE_CODE_ORGANIZATION_UUID,
        z = Boolean(q && K && _);
    if (q && K && _) {
        if (!H8().oauthAccount) DT6({
            accountUuid: q,
            emailAddress: K,
            organizationUuid: _
        })
    }
    await _Y();
    let Y = H8();
    if (Y.oauthAccount && Y.oauthAccount.billingType !== void 0 && Y.oauthAccount.accountCreatedAt !== void 0 && Y.oauthAccount.subscriptionCreatedAt !== void 0 || !i7() || !AD()) return !1;
    let A = o7();
    if (A?.accessToken) {
        let O = await JQ(A.accessToken);
        if (O) {
            if (z) E("OAuth profile fetch succeeded, overriding env var account info", {
                level: "info"
            });
            return DT6({
                accountUuid: O.account.uuid,
                emailAddress: O.account.email,
                organizationUuid: O.organization.uuid,
                displayName: O.account.display_name || void 0,
                hasExtraUsageEnabled: O.organization.has_extra_usage_enabled ?? !1,
                billingType: O.organization.billing_type ?? void 0,
                accountCreatedAt: O.account.created_at,
                subscriptionCreatedAt: O.organization.subscription_created_at ?? void 0
            }), !0
        }
    }
    return !1
}
// @from(Ln 103269, Col 0)
function DT6({
    accountUuid: q,
    emailAddress: K,
    organizationUuid: _,
    displayName: z,
    hasExtraUsageEnabled: Y,
    billingType: A,
    accountCreatedAt: O,
    subscriptionCreatedAt: w
}) {
    let $ = {
        accountUuid: q,
        emailAddress: K,
        organizationUuid: _,
        hasExtraUsageEnabled: Y,
        billingType: A,
        accountCreatedAt: O,
        subscriptionCreatedAt: w
    };
    if (z) $.displayName = z;
    d8((j) => {
        if (j.oauthAccount?.accountUuid === $.accountUuid && j.oauthAccount?.emailAddress === $.emailAddress && j.oauthAccount?.organizationUuid === $.organizationUuid && j.oauthAccount?.displayName === $.displayName && j.oauthAccount?.hasExtraUsageEnabled === $.hasExtraUsageEnabled && j.oauthAccount?.billingType === $.billingType && j.oauthAccount?.accountCreatedAt === $.accountCreatedAt && j.oauthAccount?.subscriptionCreatedAt === $.subscriptionCreatedAt) return j;
        return {
            ...j,
            oauthAccount: $
        }
    })
}
// @from(Ln 103297, Col 4)
YD = L(() => {
    CK();
    C8();
    z3();
    T7();
    h1();
    K8();
    m8();
    WT6()
})
// @from(Ln 103312, Col 0)
function nf1(q, K, _) {
    if (!S6(process.env.CLAUDE_CODE_REMOTE)) return;
    try {
        IE9($Z8, {
            recursive: !0,
            mode: 448
        }), xE9(q, K, {
            encoding: "utf8",
            mode: 384
        }), E(`Persisted ${_} to ${q} for subprocess access`)
    } catch (z) {
        E(`Failed to persist ${_} to disk (non-fatal): ${b6(z)}`, {
            level: "error"
        })
    }
}
// @from(Ln 103329, Col 0)
function nl6(q, K) {
    try {
        let z = V8().readFileSync(q, {
            encoding: "utf8"
        }).trim();
        if (!z) return null;
        return E(`Read ${K} from well-known file ${q}`), z
    } catch (_) {
        if (!t1(_)) E(`Failed to read ${K} from ${q}: ${b6(_)}`, {
            level: "debug"
        });
        return null
    }
}
// @from(Ln 103344, Col 0)
function GMq({
    envVar: q,
    wellKnownPath: K,
    label: _,
    getCached: z,
    setCached: Y
}) {
    let A = z();
    if (A !== void 0) return A;
    let O = process.env[q];
    if (!O) {
        let $ = nl6(K, _);
        return Y($), $
    }
    let w = parseInt(O, 10);
    if (Number.isNaN(w)) return E(`${q} must be a valid file descriptor number, got: ${O}`, {
        level: "error"
    }), Y(null), null;
    try {
        let $ = V8(),
            j = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${w}` : `/proc/self/fd/${w}`,
            H = $.readFileSync(j, {
                encoding: "utf8"
            }).trim();
        if (!H) return E(`File descriptor contained empty ${_}`, {
            level: "error"
        }), Y(null), null;
        return E(`Successfully read ${_} from file descriptor ${w}`), Y(H), nf1(K, H, _), H
    } catch ($) {
        E(`Failed to read ${_} from file descriptor ${w}: ${b6($)}`, {
            level: "error"
        });
        let j = nl6(K, _);
        return Y(j), j
    }
}
// @from(Ln 103381, Col 0)
function HZ8() {
    return GMq({
        envVar: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
        wellKnownPath: uE9,
        label: "OAuth token",
        getCached: Z81,
        setCached: f81
    })
}
// @from(Ln 103391, Col 0)
function if1() {
    return GMq({
        envVar: "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
        wellKnownPath: mE9,
        label: "API key",
        getCached: G81,
        setCached: v81
    })
}
// @from(Ln 103400, Col 4)
$Z8 = "/home/claude/.claude/remote"
// @from(Ln 103401, Col 4)
uE9
// @from(Ln 103401, Col 9)
mE9
// @from(Ln 103401, Col 14)
jZ8
// @from(Ln 103402, Col 4)
rf1 = L(() => {
    y8();
    K8();
    Q8();
    m8();
    Yq();
    uE9 = `${$Z8}/.oauth_token`, mE9 = `${$Z8}/.api_key`, jZ8 = `${$Z8}/.session_ingress_token`
})
// @from(Ln 103417, Col 0)
function Fh(q = "") {
    let K = A7(),
        z = !process.env.CLAUDE_CONFIG_DIR ? "" : `-${BE9("sha256").update(K).digest("hex").substring(0,8)}`;
    return `Claude Code${r7().OAUTH_FILE_SUFFIX}${q}${z}`
}
// @from(Ln 103423, Col 0)
function _B() {
    try {
        return process.env.USER || pE9().username
    } catch {
        return "claude-code-user"
    }
}
// @from(Ln 103431, Col 0)
function TE() {
    IW.cache = {
        data: null,
        cachedAt: 0
    }, IW.generation++, IW.readInFlight = null
}
// @from(Ln 103438, Col 0)
function vMq(q) {
    if (IW.cache.cachedAt !== 0) return;
    let K = null;
    if (q) try {
        K = JSON.parse(q)
    } catch {
        return
    }
    IW.cache = {
        data: K,
        cachedAt: Date.now()
    }
}
// @from(Ln 103451, Col 4)
sO6 = "-credentials"
// @from(Ln 103452, Col 4)
of1 = 30000
// @from(Ln 103453, Col 4)
IW
// @from(Ln 103454, Col 4)
r76 = L(() => {
    z3();
    Q8();
    IW = {
        cache: {
            data: null,
            cachedAt: 0
        },
        generation: 0,
        readInFlight: null
    }
})
// @from(Ln 103466, Col 0)
async function TMq() {
    if (process.platform === "darwin") {
        let q = Fh(),
            K = await ij(`security delete-generic-password -a $USER -s "${q}"`, {
                reject: !1
            });
        if (K.exitCode !== 0) throw Error(K.stderr ? `Failed to delete keychain entry: ${K.stderr}` : "Failed to delete keychain entry")
    }
}
// @from(Ln 103476, Col 0)
function VE(q) {
    return q.slice(-20)
}
// @from(Ln 103479, Col 4)
il6 = L(() => {
    r76();
    NV()
})
// @from(Ln 103483, Col 4)
_G1 = p((cE9) => {
    cE9.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(cE9.HttpAuthLocation || (cE9.HttpAuthLocation = {}));
    cE9.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(cE9.HttpApiKeyAuthLocation || (cE9.HttpApiKeyAuthLocation = {}));
    cE9.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(cE9.EndpointURLScheme || (cE9.EndpointURLScheme = {}));
    cE9.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(cE9.AlgorithmId || (cE9.AlgorithmId = {}));
    var FE9 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => cE9.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => cE9.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        gE9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        UE9 = (q) => {
            return FE9(q)
        },
        QE9 = (q) => {
            return gE9(q)
        };
    cE9.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(cE9.FieldPosition || (cE9.FieldPosition = {}));
    var dE9 = "__smithy_context";
    cE9.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(cE9.IniSectionType || (cE9.IniSectionType = {}));
    cE9.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(cE9.RequestHandlerProtocol || (cE9.RequestHandlerProtocol = {}));
    cE9.SMITHY_CONTEXT_KEY = dE9;
    cE9.getDefaultClientConfiguration = UE9;
    cE9.resolveDefaultRuntimeConfig = QE9
})
// @from(Ln 103548, Col 4)
tO6 = p((GT6) => {
    var NMq = gU(),
        wG1 = XE(),
        YG1 = _G1(),
        rE9 = sj(),
        VMq = JE();
    class EMq {
        config;
        middlewareStack = NMq.constructStack();
        initConfig;
        handlers;
        constructor(q) {
            this.config = q
        }
        send(q, K, _) {
            let z = typeof K !== "function" ? K : void 0,
                Y = typeof K === "function" ? K : _,
                A = z === void 0 && this.config.cacheMiddleware === !0,
                O;
            if (A) {
                if (!this.handlers) this.handlers = new WeakMap;
                let w = this.handlers;
                if (w.has(q.constructor)) O = w.get(q.constructor);
                else O = q.resolveMiddleware(this.middlewareStack, this.config, z), w.set(q.constructor, O)
            } else delete this.handlers, O = q.resolveMiddleware(this.middlewareStack, this.config, z);
            if (Y) O(q).then((w) => Y(null, w.output), (w) => Y(w)).catch(() => {});
            else return O(q).then((w) => w.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var zG1 = "***SensitiveInformation***";

    function AG1(q, K) {
        if (K == null) return K;
        let _ = rE9.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return zG1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return zG1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return zG1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = AG1(O, z[A]);
            return Y
        }
        return K
    }
    class $G1 {
        middlewareStack = NMq.constructStack();
        schema;
        static classBuilder() {
            return new yMq
        }
        resolveMiddlewareWithContext(q, K, _, {
            middlewareFn: z,
            clientName: Y,
            commandName: A,
            inputFilterSensitiveLog: O,
            outputFilterSensitiveLog: w,
            smithyContext: $,
            additionalContext: j,
            CommandCtor: H
        }) {
            for (let W of z.bind(this)(H, q, K, _)) this.middlewareStack.use(W);
            let J = q.concat(this.middlewareStack),
                {
                    logger: X
                } = K,
                M = {
                    logger: X,
                    clientName: Y,
                    commandName: A,
                    inputFilterSensitiveLog: O,
                    outputFilterSensitiveLog: w,
                    [YG1.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...j
                },
                {
                    requestHandler: P
                } = K;
            return J.resolve((W) => P.handle(W.request, _ || {}), M)
        }
    }
    class yMq {
        _init = () => {};
        _ep = {};
        _middlewareFn = () => [];
        _commandName = "";
        _clientName = "";
        _additionalContext = {};
        _smithyContext = {};
        _inputFilterSensitiveLog = void 0;
        _outputFilterSensitiveLog = void 0;
        _serializer = null;
        _deserializer = null;
        _operationSchema;
        init(q) {
            this._init = q
        }
        ep(q) {
            return this._ep = q, this
        }
        m(q) {
            return this._middlewareFn = q, this
        }
        s(q, K, _ = {}) {
            return this._smithyContext = {
                service: q,
                operation: K,
                ..._
            }, this
        }
        c(q = {}) {
            return this._additionalContext = q, this
        }
        n(q, K) {
            return this._clientName = q, this._commandName = K, this
        }
        f(q = (_) => _, K = (_) => _) {
            return this._inputFilterSensitiveLog = q, this._outputFilterSensitiveLog = K, this
        }
        ser(q) {
            return this._serializer = q, this
        }
        de(q) {
            return this._deserializer = q, this
        }
        sc(q) {
            return this._operationSchema = q, this._smithyContext.operationSchema = q, this
        }
        build() {
            let q = this,
                K;
            return K = class extends $G1 {
                input;
                static getEndpointParameterInstructions() {
                    return q._ep
                }
                constructor(...[_]) {
                    super();
                    this.input = _ ?? {}, q._init(this), this.schema = q._operationSchema
                }
                resolveMiddleware(_, z, Y) {
                    let A = q._operationSchema,
                        O = A?.[4] ?? A?.input,
                        w = A?.[5] ?? A?.output;
                    return this.resolveMiddlewareWithContext(_, z, Y, {
                        CommandCtor: K,
                        middlewareFn: q._middlewareFn,
                        clientName: q._clientName,
                        commandName: q._commandName,
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? AG1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? AG1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var oE9 = "***SensitiveInformation***",
        aE9 = (q, K) => {
            for (let _ of Object.keys(q)) {
                let z = q[_],
                    Y = async function(O, w, $) {
                        let j = new z(O);
                        if (typeof w === "function") this.send(j, w);
                        else if (typeof $ === "function") {
                            if (typeof w !== "object") throw Error(`Expected http options but got ${typeof w}`);
                            this.send(j, w || {}, $)
                        } else return this.send(j, w)
                    }, A = (_[0].toLowerCase() + _.slice(1)).replace(/Command$/, "");
                K.prototype[A] = Y
            }
        };
    class fT6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(q) {
            super(q.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return fT6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === fT6) return fT6.isInstance(q);
            if (fT6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var LMq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        hMq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = tE9(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw LMq(O, K)
        },
        sE9 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                hMq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        tE9 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        eE9 = (q) => {
            switch (q) {
                case "standard":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "in-region":
                    return {
                        retryMode: "standard", connectionTimeout: 1100
                    };
                case "cross-region":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "mobile":
                    return {
                        retryMode: "standard", connectionTimeout: 30000
                    };
                default:
                    return {}
            }
        },
        kMq = !1,
        qy9 = (q) => {
            if (q && !kMq && parseInt(q.substring(1, q.indexOf("."))) < 16) kMq = !0
        },
        Ky9 = (q) => {
            let K = [];
            for (let _ in YG1.AlgorithmId) {
                let z = YG1.AlgorithmId[_];
                if (q[z] === void 0) continue;
                K.push({
                    algorithmId: () => z,
                    checksumConstructor: () => q[z]
                })
            }
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        _y9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        zy9 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        Yy9 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        RMq = (q) => {
            return Object.assign(Ky9(q), zy9(q))
        },
        Ay9 = RMq,
        Oy9 = (q) => {
            return Object.assign(_y9(q), Yy9(q))
        },
        wy9 = (q) => Array.isArray(q) ? q : [q],
        SMq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = SMq(q[_]);
            return q
        },
        $y9 = (q) => {
            return q != null
        };
    class CMq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function bMq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, Jy9(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            IMq(z, null, A, O)
        }
        return z
    }
    var jy9 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        Hy9 = (q, K) => {
            let _ = {};
            for (let z in K) IMq(_, q, K, z);
            return _
        },
        Jy9 = (q, K, _) => {
            return bMq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        IMq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = Xy9, $ = My9, j = z] = O;
                if (typeof w === "function" && w(K[j]) || typeof w !== "function" && !!w) q[z] = $(K[j]);
                return
            }
            let [Y, A] = _[z];
            if (typeof A === "function") {
                let O, w = Y === void 0 && (O = A()) != null,
                    $ = typeof Y === "function" && !!Y(void 0) || typeof Y !== "function" && !!Y;
                if (w) q[z] = O;
                else if ($) q[z] = A()
            } else {
                let O = Y === void 0 && A != null,
                    w = typeof Y === "function" && !!Y(A) || typeof Y !== "function" && !!Y;
                if (O || w) q[z] = A
            }
        },
        Xy9 = (q) => q != null,
        My9 = (q) => q,
        Py9 = (q) => {
            if (q !== q) return "NaN";
            switch (q) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return q
            }
        },
        Wy9 = (q) => q.toISOString().replace(".000Z", "Z"),
        OG1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(OG1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = OG1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(GT6, "collectBody", {
        enumerable: !0,
        get: function() {
            return wG1.collectBody
        }
    });
    Object.defineProperty(GT6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return wG1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(GT6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return wG1.resolvedPath
        }
    });
    GT6.Client = EMq;
    GT6.Command = $G1;
    GT6.NoOpLogger = CMq;
    GT6.SENSITIVE_STRING = oE9;
    GT6.ServiceException = fT6;
    GT6._json = OG1;
    GT6.convertMap = jy9;
    GT6.createAggregatedClient = aE9;
    GT6.decorateServiceException = LMq;
    GT6.emitWarningIfUnsupportedVersion = qy9;
    GT6.getArrayIfSingleItem = wy9;
    GT6.getDefaultClientConfiguration = Ay9;
    GT6.getDefaultExtensionConfiguration = RMq;
    GT6.getValueFromTextNode = SMq;
    GT6.isSerializableHeaderValue = $y9;
    GT6.loadConfigsForDefaultMode = eE9;
    GT6.map = bMq;
    GT6.resolveDefaultRuntimeConfig = Oy9;
    GT6.serializeDateTime = Wy9;
    GT6.serializeFloat = Py9;
    GT6.take = Hy9;
    GT6.throwDefaultError = hMq;
    GT6.withBaseException = sE9;
    Object.keys(VMq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(GT6, q)) Object.defineProperty(GT6, q, {
            enumerable: !0,
            get: function() {
                return VMq[q]
            }
        })
    })
})
// @from(Ln 104018, Col 4)
HG1 = p((uMq) => {
    Object.defineProperty(uMq, "__esModule", {
        value: !0
    });
    uMq.resolveHttpAuthSchemeConfig = uMq.resolveStsAuthConfig = uMq.defaultSTSHttpAuthSchemeProvider = uMq.defaultSTSHttpAuthSchemeParametersProvider = void 0;
    var Fy9 = k$(),
        jG1 = Dv(),
        gy9 = JG1(),
        Uy9 = async (q, K, _) => {
            return {
                operation: (0, jG1.getSmithyContext)(K).operation,
                region: await (0, jG1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    uMq.defaultSTSHttpAuthSchemeParametersProvider = Uy9;

    function Qy9(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sts",
                region: q.region
            },
            propertiesExtractor: (K, _) => ({
                signingProperties: {
                    config: K,
                    context: _
                }
            })
        }
    }

    function xMq(q) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var dy9 = (q) => {
        let K = [];
        switch (q.operation) {
            case "AssumeRoleWithSAML": {
                K.push(xMq(q));
                break
            }
            case "AssumeRoleWithWebIdentity": {
                K.push(xMq(q));
                break
            }
            default:
                K.push(Qy9(q))
        }
        return K
    };
    uMq.defaultSTSHttpAuthSchemeProvider = dy9;
    var cy9 = (q) => Object.assign(q, {
        stsClientCtor: gy9.STSClient
    });
    uMq.resolveStsAuthConfig = cy9;
    var ly9 = (q) => {
        let K = uMq.resolveStsAuthConfig(q),
            _ = (0, Fy9.resolveAwsSdkSigV4Config)(K);
        return Object.assign(_, {
            authSchemePreference: (0, jG1.normalizeProvider)(q.authSchemePreference ?? [])
        })
    };
    uMq.resolveHttpAuthSchemeConfig = ly9
})
// @from(Ln 104087, Col 4)
XG1 = p((pMq) => {
    Object.defineProperty(pMq, "__esModule", {
        value: !0
    });
    pMq.commonParams = pMq.resolveClientEndpointParameters = void 0;
    var ry9 = (q) => {
        return Object.assign(q, {
            useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
            useFipsEndpoint: q.useFipsEndpoint ?? !1,
            useGlobalEndpoint: q.useGlobalEndpoint ?? !1,
            defaultSigningName: "sts"
        })
    };
    pMq.resolveClientEndpointParameters = ry9;
    pMq.commonParams = {
        UseGlobalEndpoint: {
            type: "builtInParams",
            name: "useGlobalEndpoint"
        },
        UseFIPS: {
            type: "builtInParams",
            name: "useFipsEndpoint"
        },
        Endpoint: {
            type: "builtInParams",
            name: "endpoint"
        },
        Region: {
            type: "builtInParams",
            name: "region"
        },
        UseDualStack: {
            type: "builtInParams",
            name: "useDualstackEndpoint"
        }
    }
})
// @from(Ln 104124, Col 4)
gMq = p((p$O, ay9) => {
    ay9.exports = {
        name: "@aws-sdk/client-sts",
        description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-sts",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "rimraf ./dist-types tsconfig.types.tsbuildinfo && tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
            test: "yarn g:vitest run",
            "test:watch": "yarn g:vitest watch"
        },
        main: "./dist-cjs/index.js",
        types: "./dist-types/index.d.ts",
        module: "./dist-es/index.js",
        sideEffects: !1,
        dependencies: {
            "@aws-crypto/sha256-browser": "5.2.0",
            "@aws-crypto/sha256-js": "5.2.0",
            "@aws-sdk/core": "3.936.0",
            "@aws-sdk/credential-provider-node": "3.936.0",
            "@aws-sdk/middleware-host-header": "3.936.0",
            "@aws-sdk/middleware-logger": "3.936.0",
            "@aws-sdk/middleware-recursion-detection": "3.936.0",
            "@aws-sdk/middleware-user-agent": "3.936.0",
            "@aws-sdk/region-config-resolver": "3.936.0",
            "@aws-sdk/types": "3.936.0",
            "@aws-sdk/util-endpoints": "3.936.0",
            "@aws-sdk/util-user-agent-browser": "3.936.0",
            "@aws-sdk/util-user-agent-node": "3.936.0",
            "@smithy/config-resolver": "^4.4.3",
            "@smithy/core": "^3.18.5",
            "@smithy/fetch-http-handler": "^5.3.6",
            "@smithy/hash-node": "^4.2.5",
            "@smithy/invalid-dependency": "^4.2.5",
            "@smithy/middleware-content-length": "^4.2.5",
            "@smithy/middleware-endpoint": "^4.3.12",
            "@smithy/middleware-retry": "^4.4.12",
            "@smithy/middleware-serde": "^4.2.6",
            "@smithy/middleware-stack": "^4.2.5",
            "@smithy/node-config-provider": "^4.3.5",
            "@smithy/node-http-handler": "^4.4.5",
            "@smithy/protocol-http": "^5.3.5",
            "@smithy/smithy-client": "^4.9.8",
            "@smithy/types": "^4.9.0",
            "@smithy/url-parser": "^4.2.5",
            "@smithy/util-base64": "^4.3.0",
            "@smithy/util-body-length-browser": "^4.2.0",
            "@smithy/util-body-length-node": "^4.2.1",
            "@smithy/util-defaults-mode-browser": "^4.3.11",
            "@smithy/util-defaults-mode-node": "^4.2.14",
            "@smithy/util-endpoints": "^3.2.5",
            "@smithy/util-middleware": "^4.2.5",
            "@smithy/util-retry": "^4.2.5",
            "@smithy/util-utf8": "^4.2.0",
            tslib: "^2.6.2"
        },
        devDependencies: {
            "@tsconfig/node18": "18.2.4",
            "@types/node": "^18.19.69",
            concurrently: "7.0.0",
            "downlevel-dts": "0.10.1",
            rimraf: "3.0.2",
            typescript: "~5.8.3"
        },
        engines: {
            node: ">=18.0.0"
        },
        typesVersions: {
            "<4.0": {
                "dist-types/*": ["dist-types/ts3.4/*"]
            }
        },
        files: ["dist-*/**"],
        author: {
            name: "AWS SDK for JavaScript Team",
            url: "https://aws.amazon.com/javascript/"
        },
        license: "Apache-2.0",
        browser: {
            "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
        },
        "react-native": {
            "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
        },
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-sts"
        }
    }
})
// @from(Ln 104223, Col 4)
UMq = p((ty9) => {
    var sy9 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    ty9.isArrayBuffer = sy9
})
// @from(Ln 104227, Col 4)
PG1 = p((zL9) => {
    var qL9 = UMq(),
        MG1 = d6("buffer"),
        KL9 = (q, K = 0, _ = q.byteLength - K) => {
            if (!qL9.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return MG1.Buffer.from(q, K, _)
        },
        _L9 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? MG1.Buffer.from(q, K) : MG1.Buffer.from(q)
        };
    zL9.fromArrayBuffer = KL9;
    zL9.fromString = _L9
})
// @from(Ln 104241, Col 4)
cMq = p((QMq) => {
    Object.defineProperty(QMq, "__esModule", {
        value: !0
    });
    QMq.fromBase64 = void 0;
    var OL9 = PG1(),
        wL9 = /^[A-Za-z0-9+/]*={0,2}$/,
        $L9 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!wL9.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, OL9.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    QMq.fromBase64 = $L9
})
// @from(Ln 104256, Col 4)
iMq = p((lMq) => {
    Object.defineProperty(lMq, "__esModule", {
        value: !0
    });
    lMq.toBase64 = void 0;
    var jL9 = PG1(),
        HL9 = nw(),
        JL9 = (q) => {
            let K;
            if (typeof q === "string") K = (0, HL9.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, jL9.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    lMq.toBase64 = JL9
})
// @from(Ln 104272, Col 4)
aMq = p((ol6) => {
    var rMq = cMq(),
        oMq = iMq();
    Object.keys(rMq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ol6, q)) Object.defineProperty(ol6, q, {
            enumerable: !0,
            get: function() {
                return rMq[q]
            }
        })
    });
    Object.keys(oMq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ol6, q)) Object.defineProperty(ol6, q, {
            enumerable: !0,
            get: function() {
                return oMq[q]
            }
        })
    })
})
// @from(Ln 104292, Col 4)
vPq = p((fPq) => {
    Object.defineProperty(fPq, "__esModule", {
        value: !0
    });
    fPq.ruleSet = void 0;
    var $Pq = "required",
        v_ = "type",
        eA = "fn",
        qO = "argv",
        a76 = "ref",
        sMq = !1,
        WG1 = !0,
        o76 = "booleanEquals",
        qf = "stringEquals",
        jPq = "sigv4",
        HPq = "sts",
        JPq = "us-east-1",
        ej = "endpoint",
        tMq = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
        MQ = "tree",
        vT6 = "error",
        ZG1 = "getAttr",
        eMq = {
            [$Pq]: !1,
            [v_]: "string"
        },
        DG1 = {
            [$Pq]: !0,
            default: !1,
            [v_]: "boolean"
        },
        XPq = {
            [a76]: "Endpoint"
        },
        qPq = {
            [eA]: "isSet",
            [qO]: [{
                [a76]: "Region"
            }]
        },
        Kf = {
            [a76]: "Region"
        },
        KPq = {
            [eA]: "aws.partition",
            [qO]: [Kf],
            assign: "PartitionResult"
        },
        MPq = {
            [a76]: "UseFIPS"
        },
        PPq = {
            [a76]: "UseDualStack"
        },
        Nv = {
            url: "https://sts.amazonaws.com",
            properties: {
                authSchemes: [{
                    name: jPq,
                    signingName: HPq,
                    signingRegion: JPq
                }]
            },
            headers: {}
        },
        gh = {},
        _Pq = {
            conditions: [{
                [eA]: qf,
                [qO]: [Kf, "aws-global"]
            }],
            [ej]: Nv,
            [v_]: ej
        },
        WPq = {
            [eA]: o76,
            [qO]: [MPq, !0]
        },
        DPq = {
            [eA]: o76,
            [qO]: [PPq, !0]
        },
        zPq = {
            [eA]: ZG1,
            [qO]: [{
                [a76]: "PartitionResult"
            }, "supportsFIPS"]
        },
        ZPq = {
            [a76]: "PartitionResult"
        },
        YPq = {
            [eA]: o76,
            [qO]: [!0, {
                [eA]: ZG1,
                [qO]: [ZPq, "supportsDualStack"]
            }]
        },
        APq = [{
            [eA]: "isSet",
            [qO]: [XPq]
        }],
        OPq = [WPq],
        wPq = [DPq],
        XL9 = {
            version: "1.0",
            parameters: {
                Region: eMq,
                UseDualStack: DG1,
                UseFIPS: DG1,
                Endpoint: eMq,
                UseGlobalEndpoint: DG1
            },
            rules: [{
                conditions: [{
                    [eA]: o76,
                    [qO]: [{
                        [a76]: "UseGlobalEndpoint"
                    }, WG1]
                }, {
                    [eA]: "not",
                    [qO]: APq
                }, qPq, KPq, {
                    [eA]: o76,
                    [qO]: [MPq, sMq]
                }, {
                    [eA]: o76,
                    [qO]: [PPq, sMq]
                }],
                rules: [{
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "ap-northeast-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "ap-south-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "ap-southeast-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "ap-southeast-2"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, _Pq, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "ca-central-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "eu-central-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "eu-north-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "eu-west-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "eu-west-2"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "eu-west-3"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "sa-east-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, JPq]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "us-east-2"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "us-west-1"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    conditions: [{
                        [eA]: qf,
                        [qO]: [Kf, "us-west-2"]
                    }],
                    endpoint: Nv,
                    [v_]: ej
                }, {
                    endpoint: {
                        url: tMq,
                        properties: {
                            authSchemes: [{
                                name: jPq,
                                signingName: HPq,
                                signingRegion: "{Region}"
                            }]
                        },
                        headers: gh
                    },
                    [v_]: ej
                }],
                [v_]: MQ
            }, {
                conditions: APq,
                rules: [{
                    conditions: OPq,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    [v_]: vT6
                }, {
                    conditions: wPq,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    [v_]: vT6
                }, {
                    endpoint: {
                        url: XPq,
                        properties: gh,
                        headers: gh
                    },
                    [v_]: ej
                }],
                [v_]: MQ
            }, {
                conditions: [qPq],
                rules: [{
                    conditions: [KPq],
                    rules: [{
                        conditions: [WPq, DPq],
                        rules: [{
                            conditions: [{
                                [eA]: o76,
                                [qO]: [WG1, zPq]
                            }, YPq],
                            rules: [{
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: gh,
                                    headers: gh
                                },
                                [v_]: ej
                            }],
                            [v_]: MQ
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            [v_]: vT6
                        }],
                        [v_]: MQ
                    }, {
                        conditions: OPq,
                        rules: [{
                            conditions: [{
                                [eA]: o76,
                                [qO]: [zPq, WG1]
                            }],
                            rules: [{
                                conditions: [{
                                    [eA]: qf,
                                    [qO]: [{
                                        [eA]: ZG1,
                                        [qO]: [ZPq, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://sts.{Region}.amazonaws.com",
                                    properties: gh,
                                    headers: gh
                                },
                                [v_]: ej
                            }, {
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: gh,
                                    headers: gh
                                },
                                [v_]: ej
                            }],
                            [v_]: MQ
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            [v_]: vT6
                        }],
                        [v_]: MQ
                    }, {
                        conditions: wPq,
                        rules: [{
                            conditions: [YPq],
                            rules: [{
                                endpoint: {
                                    url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: gh,
                                    headers: gh
                                },
                                [v_]: ej
                            }],
                            [v_]: MQ
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            [v_]: vT6
                        }],
                        [v_]: MQ
                    }, _Pq, {
                        endpoint: {
                            url: tMq,
                            properties: gh,
                            headers: gh
                        },
                        [v_]: ej
                    }],
                    [v_]: MQ
                }],
                [v_]: MQ
            }, {
                error: "Invalid Configuration: Missing Region",
                [v_]: vT6
            }]
        };
    fPq.ruleSet = XL9
})
// @from(Ln 104656, Col 4)
kPq = p((TPq) => {
    Object.defineProperty(TPq, "__esModule", {
        value: !0
    });
    TPq.defaultEndpointResolver = void 0;
    var ML9 = QU(),
        fG1 = dm(),
        PL9 = vPq(),
        WL9 = new fG1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
        }),
        DL9 = (q, K = {}) => {
            return WL9.get(q, () => (0, fG1.resolveEndpoint)(PL9.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    TPq.defaultEndpointResolver = DL9;
    fG1.customEndpointFunctions.aws = ML9.awsEndpointFunctions
})
// @from(Ln 104677, Col 4)
hPq = p((yPq) => {
    Object.defineProperty(yPq, "__esModule", {
        value: !0
    });
    yPq.getRuntimeConfig = void 0;
    var ZL9 = k$(),
        fL9 = Ao(),
        GL9 = FO(),
        vL9 = tO6(),
        TL9 = jb(),
        NPq = aMq(),
        EPq = nw(),
        VL9 = HG1(),
        kL9 = kPq(),
        NL9 = (q) => {
            return {
                apiVersion: "2011-06-15",
                base64Decoder: q?.base64Decoder ?? NPq.fromBase64,
                base64Encoder: q?.base64Encoder ?? NPq.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? kL9.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? VL9.defaultSTSHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new ZL9.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new GL9.NoAuthSigner
                }],
                logger: q?.logger ?? new vL9.NoOpLogger,
                protocol: q?.protocol ?? new fL9.AwsQueryProtocol({
                    defaultNamespace: "com.amazonaws.sts",
                    xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
                    version: "2011-06-15"
                }),
                serviceId: q?.serviceId ?? "STS",
                urlParser: q?.urlParser ?? TL9.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? EPq.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? EPq.toUtf8
            }
        };
    yPq.getRuntimeConfig = NL9
})
// @from(Ln 104723, Col 4)
uPq = p((IPq) => {
    Object.defineProperty(IPq, "__esModule", {
        value: !0
    });
    IPq.getRuntimeConfig = void 0;
    var EL9 = IV(),
        yL9 = EL9.__importDefault(gMq()),
        GG1 = k$(),
        RPq = uO6(),
        SPq = Ko(),
        JZ8 = KM(),
        LL9 = FO(),
        hL9 = _o(),
        CPq = rZ(),
        eO6 = jE(),
        bPq = wE(),
        RL9 = zo(),
        SL9 = lU(),
        CL9 = hPq(),
        bL9 = tO6(),
        IL9 = wo(),
        xL9 = tO6(),
        uL9 = (q) => {
            (0, xL9.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, IL9.resolveDefaultsModeConfig)(q),
                _ = () => K().then(bL9.loadConfigsForDefaultMode),
                z = (0, CL9.getRuntimeConfig)(q);
            (0, GG1.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, eO6.loadConfig)(GG1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? RL9.calculateBodyLength,
                credentialDefaultProvider: q?.credentialDefaultProvider ?? RPq.defaultProvider,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, SPq.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: yL9.default.version
                }),
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (A) => A.getIdentityProvider("aws.auth#sigv4") || (async (O) => await (0, RPq.defaultProvider)(O?.__config || {})()),
                    signer: new GG1.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (A) => A.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new LL9.NoAuthSigner
                }],
                maxAttempts: q?.maxAttempts ?? (0, eO6.loadConfig)(CPq.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, eO6.loadConfig)(JZ8.NODE_REGION_CONFIG_OPTIONS, {
                    ...JZ8.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: bPq.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, eO6.loadConfig)({
                    ...CPq.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || SL9.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? hL9.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? bPq.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, eO6.loadConfig)(JZ8.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, eO6.loadConfig)(JZ8.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, eO6.loadConfig)(SPq.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    IPq.getRuntimeConfig = uL9
})
// @from(Ln 104795, Col 4)
FPq = p((UL9) => {
    var mL9 = _G1(),
        BL9 = (q) => {
            return {
                setHttpHandler(K) {
                    q.httpHandler = K
                },
                httpHandler() {
                    return q.httpHandler
                },
                updateHttpClientConfig(K, _) {
                    q.httpHandler?.updateHttpClientConfig(K, _)
                },
                httpHandlerConfigs() {
                    return q.httpHandler.httpHandlerConfigs()
                }
            }
        },
        pL9 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class mPq {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = mL9.FieldPosition.HEADER,
            values: _ = []
        }) {
            this.name = q, this.kind = K, this.values = _
        }
        add(q) {
            this.values.push(q)
        }
        set(q) {
            this.values = q
        }
        remove(q) {
            this.values = this.values.filter((K) => K !== q)
        }
        toString() {
            return this.values.map((q) => q.includes(",") || q.includes(" ") ? `"${q}"` : q).join(", ")
        }
        get() {
            return this.values
        }
    }
    class BPq {
        entries = {};
        encoding;
        constructor({
            fields: q = [],
            encoding: K = "utf-8"
        }) {
            q.forEach(this.setField.bind(this)), this.encoding = K
        }
        setField(q) {
            this.entries[q.name.toLowerCase()] = q
        }
        getField(q) {
            return this.entries[q.toLowerCase()]
        }
        removeField(q) {
            delete this.entries[q.toLowerCase()]
        }
        getByType(q) {
            return Object.values(this.entries).filter((K) => K.kind === q)
        }
    }
    class XZ8 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(q) {
            this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
        }
        static clone(q) {
            let K = new XZ8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = FL9(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return XZ8.clone(this)
        }
    }

    function FL9(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class pPq {
        statusCode;
        reason;
        headers;
        body;
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    }

    function gL9(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    UL9.Field = mPq;
    UL9.Fields = BPq;
    UL9.HttpRequest = XZ8;
    UL9.HttpResponse = pPq;
    UL9.getHttpHandlerExtensionConfiguration = BL9;
    UL9.isValidHostname = gL9;
    UL9.resolveHttpHandlerRuntimeConfig = pL9
})
// @from(Ln 104937, Col 4)
QPq = p((gPq) => {
    Object.defineProperty(gPq, "__esModule", {
        value: !0
    });
    gPq.resolveHttpAuthRuntimeConfig = gPq.getHttpAuthExtensionConfiguration = void 0;
    var oL9 = (q) => {
        let {
            httpAuthSchemes: K,
            httpAuthSchemeProvider: _,
            credentials: z
        } = q;
        return {
            setHttpAuthScheme(Y) {
                let A = K.findIndex((O) => O.schemeId === Y.schemeId);
                if (A === -1) K.push(Y);
                else K.splice(A, 1, Y)
            },
            httpAuthSchemes() {
                return K
            },
            setHttpAuthSchemeProvider(Y) {
                _ = Y
            },
            httpAuthSchemeProvider() {
                return _
            },
            setCredentials(Y) {
                z = Y
            },
            credentials() {
                return z
            }
        }
    };
    gPq.getHttpAuthExtensionConfiguration = oL9;
    var aL9 = (q) => {
        return {
            httpAuthSchemes: q.httpAuthSchemes(),
            httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
            credentials: q.credentials()
        }
    };
    gPq.resolveHttpAuthRuntimeConfig = aL9
})
// @from(Ln 104981, Col 4)
oPq = p((iPq) => {
    Object.defineProperty(iPq, "__esModule", {
        value: !0
    });
    iPq.resolveRuntimeExtensions = void 0;
    var dPq = lm(),
        cPq = FPq(),
        lPq = tO6(),
        nPq = QPq(),
        tL9 = (q, K) => {
            let _ = Object.assign((0, dPq.getAwsRegionExtensionConfiguration)(q), (0, lPq.getDefaultExtensionConfiguration)(q), (0, cPq.getHttpHandlerExtensionConfiguration)(q), (0, nPq.getHttpAuthExtensionConfiguration)(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, (0, dPq.resolveAwsRegionExtensionConfiguration)(_), (0, lPq.resolveDefaultRuntimeConfig)(_), (0, cPq.resolveHttpHandlerRuntimeConfig)(_), (0, nPq.resolveHttpAuthRuntimeConfig)(_))
        };
    iPq.resolveRuntimeExtensions = tL9
})
// @from(Ln 104996, Col 4)
JG1 = p((TG1) => {
    Object.defineProperty(TG1, "__esModule", {
        value: !0
    });
    TG1.STSClient = TG1.__Client = void 0;
    var aPq = nr(),
        eL9 = ir(),
        qh9 = rr(),
        sPq = cU(),
        Kh9 = KM(),
        vG1 = FO(),
        _h9 = sj(),
        zh9 = qo(),
        Yh9 = cm(),
        tPq = rZ(),
        qWq = tO6();
    Object.defineProperty(TG1, "__Client", {
        enumerable: !0,
        get: function() {
            return qWq.Client
        }
    });
    var ePq = HG1(),
        Ah9 = XG1(),
        Oh9 = uPq(),
        wh9 = oPq();
    class KWq extends qWq.Client {
        config;
        constructor(...[q]) {
            let K = (0, Oh9.getRuntimeConfig)(q || {});
            super(K);
            this.initConfig = K;
            let _ = (0, Ah9.resolveClientEndpointParameters)(K),
                z = (0, sPq.resolveUserAgentConfig)(_),
                Y = (0, tPq.resolveRetryConfig)(z),
                A = (0, Kh9.resolveRegionConfig)(Y),
                O = (0, aPq.resolveHostHeaderConfig)(A),
                w = (0, Yh9.resolveEndpointConfig)(O),
                $ = (0, ePq.resolveHttpAuthSchemeConfig)(w),
                j = (0, wh9.resolveRuntimeExtensions)($, q?.extensions || []);
            this.config = j, this.middlewareStack.use((0, _h9.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, sPq.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, tPq.getRetryPlugin)(this.config)), this.middlewareStack.use((0, zh9.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, aPq.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, eL9.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, qh9.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, vG1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
                httpAuthSchemeParametersProvider: ePq.defaultSTSHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (H) => new vG1.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": H.credentials
                })
            })), this.middlewareStack.use((0, vG1.getHttpSigningPlugin)(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    TG1.STSClient = KWq
})
// @from(Ln 105049, Col 4)
FG1 = p((MZ8) => {
    var al6 = JG1(),
        kE = tO6(),
        zB = cm(),
        YB = XG1(),
        Uh = sj(),
        VG1 = $E(),
        $h9 = lm(),
        NE = class q extends kE.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        zWq = class q extends NE {
            name = "ExpiredTokenException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ExpiredTokenException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        YWq = class q extends NE {
            name = "MalformedPolicyDocumentException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "MalformedPolicyDocumentException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        AWq = class q extends NE {
            name = "PackedPolicyTooLargeException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "PackedPolicyTooLargeException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        OWq = class q extends NE {
            name = "RegionDisabledException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "RegionDisabledException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        wWq = class q extends NE {
            name = "IDPRejectedClaimException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "IDPRejectedClaimException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        $Wq = class q extends NE {
            name = "InvalidIdentityTokenException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "InvalidIdentityTokenException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        jWq = class q extends NE {
            name = "IDPCommunicationErrorException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "IDPCommunicationErrorException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        HWq = class q extends NE {
            name = "InvalidAuthorizationMessageException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "InvalidAuthorizationMessageException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        JWq = class q extends NE {
            name = "ExpiredTradeInTokenException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ExpiredTradeInTokenException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        XWq = class q extends NE {
            name = "JWTPayloadSizeExceededException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "JWTPayloadSizeExceededException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        MWq = class q extends NE {
            name = "OutboundWebIdentityFederationDisabledException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "OutboundWebIdentityFederationDisabledException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        PWq = class q extends NE {
            name = "SessionDurationEscalationException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "SessionDurationEscalationException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        kG1 = "Arn",
        WWq = "AccessKeyId",
        jh9 = "AssumedPrincipal",
        Hh9 = "AssumeRole",
        Jh9 = "AssumedRoleId",
        Xh9 = "AssumeRoleRequest",
        Mh9 = "AssumeRoleResponse",
        Ph9 = "AssumeRootRequest",
        Wh9 = "AssumeRootResponse",
        PZ8 = "AssumedRoleUser",
        Dh9 = "AssumeRoleWithSAML",
        Zh9 = "AssumeRoleWithSAMLRequest",
        fh9 = "AssumeRoleWithSAMLResponse",
        Gh9 = "AssumeRoleWithWebIdentity",
        vh9 = "AssumeRoleWithWebIdentityRequest",
        Th9 = "AssumeRoleWithWebIdentityResponse",
        Vh9 = "AssumeRoot",
        DWq = "Account",
        NG1 = "Audience",
        s76 = "Credentials",
        kh9 = "ContextAssertion",
        Nh9 = "DecodeAuthorizationMessage",
        Eh9 = "DecodeAuthorizationMessageRequest",
        yh9 = "DecodeAuthorizationMessageResponse",
        Lh9 = "DecodedMessage",
        qw6 = "DurationSeconds",
        ZWq = "Expiration",
        hh9 = "ExternalId",
        Rh9 = "EncodedMessage",
        Sh9 = "ExpiredTokenException",
        Ch9 = "ExpiredTradeInTokenException",
        fWq = "FederatedUser",
        bh9 = "FederatedUserId",
        Ih9 = "GetAccessKeyInfo",
        xh9 = "GetAccessKeyInfoRequest",
        uh9 = "GetAccessKeyInfoResponse",
        mh9 = "GetCallerIdentity",
        Bh9 = "GetCallerIdentityRequest",
        ph9 = "GetCallerIdentityResponse",
        Fh9 = "GetDelegatedAccessToken",
        gh9 = "GetDelegatedAccessTokenRequest",
        Uh9 = "GetDelegatedAccessTokenResponse",
        Qh9 = "GetFederationToken",
        dh9 = "GetFederationTokenRequest",
        ch9 = "GetFederationTokenResponse",
        lh9 = "GetSessionToken",
        nh9 = "GetSessionTokenRequest",
        ih9 = "GetSessionTokenResponse",
        rh9 = "GetWebIdentityToken",
        oh9 = "GetWebIdentityTokenRequest",
        ah9 = "GetWebIdentityTokenResponse",
        sh9 = "Issuer",
        th9 = "InvalidAuthorizationMessageException",
        eh9 = "IDPCommunicationErrorException",
        qR9 = "IDPRejectedClaimException",
        KR9 = "InvalidIdentityTokenException",
        _R9 = "JWTPayloadSizeExceededException",
        zR9 = "Key",
        YR9 = "MalformedPolicyDocumentException",
        AR9 = "Name",
        OR9 = "NameQualifier",
        wR9 = "OutboundWebIdentityFederationDisabledException",
        WZ8 = "Policy",
        DZ8 = "PolicyArns",
        $R9 = "PrincipalArn",
        jR9 = "ProviderArn",
        HR9 = "ProvidedContexts",
        JR9 = "ProvidedContextsListType",
        XR9 = "ProvidedContext",
        MR9 = "PolicyDescriptorType",
        PR9 = "ProviderId",
        sl6 = "PackedPolicySize",
        WR9 = "PackedPolicyTooLargeException",
        DR9 = "Provider",
        EG1 = "RoleArn",
        ZR9 = "RegionDisabledException",
        GWq = "RoleSessionName",
        fR9 = "Subject",
        GR9 = "SigningAlgorithm",
        vR9 = "SecretAccessKey",
        TR9 = "SAMLAssertion",
        VR9 = "SAMLAssertionType",
        kR9 = "SessionDurationEscalationException",
        NR9 = "SubjectFromWebIdentityToken",
        tl6 = "SourceIdentity",
        vWq = "SerialNumber",
        ER9 = "SubjectType",
        yR9 = "SessionToken",
        yG1 = "Tags",
        TWq = "TokenCode",
        LR9 = "TradeInToken",
        hR9 = "TargetPrincipal",
        RR9 = "TaskPolicyArn",
        SR9 = "TransitiveTagKeys",
        CR9 = "Tag",
        bR9 = "UserId",
        IR9 = "Value",
        VWq = "WebIdentityToken",
        xR9 = "arn",
        uR9 = "accessKeySecretType",
        mb = "awsQueryError",
        Bb = "client",
        mR9 = "clientTokenType",
        pb = "error",
        Fb = "httpError",
        gb = "message",
        BR9 = "policyDescriptorListType",
        kWq = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
        pR9 = "tradeInTokenType",
        FR9 = "tagListType",
        gR9 = "webIdentityTokenType",
        d4 = "com.amazonaws.sts",
        UR9 = [0, d4, uR9, 8, 0],
        QR9 = [0, d4, mR9, 8, 0],
        dR9 = [0, d4, VR9, 8, 0],
        cR9 = [0, d4, pR9, 8, 0],
        lR9 = [0, d4, gR9, 8, 0],
        LG1 = [3, d4, PZ8, 0, [Jh9, kG1],
            [0, 0]
        ],
        nR9 = [3, d4, Xh9, 0, [EG1, GWq, DZ8, WZ8, qw6, yG1, SR9, hh9, vWq, TWq, tl6, HR9],
            [0, 0, () => ZZ8, 0, 1, () => hG1, 64, 0, 0, 0, 0, () => SS9]
        ],
        iR9 = [3, d4, Mh9, 0, [s76, PZ8, sl6, tl6],
            [
                [() => Kw6, 0], () => LG1, 1, 0
            ]
        ],
        rR9 = [3, d4, Zh9, 0, [EG1, $R9, TR9, DZ8, WZ8, qw6],
            [0, 0, [() => dR9, 0], () => ZZ8, 0, 1]
        ],
        oR9 = [3, d4, fh9, 0, [s76, PZ8, sl6, fR9, ER9, sh9, NG1, OR9, tl6],
            [
                [() => Kw6, 0], () => LG1, 1, 0, 0, 0, 0, 0, 0
            ]
        ],
        aR9 = [3, d4, vh9, 0, [EG1, GWq, VWq, PR9, DZ8, WZ8, qw6],
            [0, 0, [() => QR9, 0], 0, () => ZZ8, 0, 1]
        ],
        sR9 = [3, d4, Th9, 0, [s76, NR9, PZ8, sl6, DR9, NG1, tl6],
            [
                [() => Kw6, 0], 0, () => LG1, 1, 0, 0, 0
            ]
        ],
        tR9 = [3, d4, Ph9, 0, [hR9, RR9, qw6],
            [0, () => NWq, 1]
        ],
        eR9 = [3, d4, Wh9, 0, [s76, tl6],
            [
                [() => Kw6, 0], 0
            ]
        ],
        Kw6 = [3, d4, s76, 0, [WWq, vR9, yR9, ZWq],
            [0, [() => UR9, 0], 0, 4]
        ],
        qS9 = [3, d4, Eh9, 0, [Rh9],
            [0]
        ],
        KS9 = [3, d4, yh9, 0, [Lh9],
            [0]
        ],
        _S9 = [-3, d4, Sh9, {
                [pb]: Bb,
                [Fb]: 400,
                [mb]: ["ExpiredTokenException", 400]
            },
            [gb],
            [0]
        ];
    Uh.TypeRegistry.for(d4).registerError(_S9, zWq);
    var zS9 = [-3, d4, Ch9, {
            [pb]: Bb,
            [Fb]: 400,
            [mb]: ["ExpiredTradeInTokenException", 400]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(zS9, JWq);
    var YS9 = [3, d4, fWq, 0, [bh9, kG1],
            [0, 0]
        ],
        AS9 = [3, d4, xh9, 0, [WWq],
            [0]
        ],
        OS9 = [3, d4, uh9, 0, [DWq],
            [0]
        ],
        wS9 = [3, d4, Bh9, 0, [],
            []
        ],
        $S9 = [3, d4, ph9, 0, [bR9, DWq, kG1],
            [0, 0, 0]
        ],
        jS9 = [3, d4, gh9, 0, [LR9],
            [
                [() => cR9, 0]
            ]
        ],
        HS9 = [3, d4, Uh9, 0, [s76, sl6, jh9],
            [
                [() => Kw6, 0], 1, 0
            ]
        ],
        JS9 = [3, d4, dh9, 0, [AR9, WZ8, DZ8, qw6, yG1],
            [0, 0, () => ZZ8, 1, () => hG1]
        ],
        XS9 = [3, d4, ch9, 0, [s76, fWq, sl6],
            [
                [() => Kw6, 0], () => YS9, 1
            ]
        ],
        MS9 = [3, d4, nh9, 0, [qw6, vWq, TWq],
            [1, 0, 0]
        ],
        PS9 = [3, d4, ih9, 0, [s76],
            [
                [() => Kw6, 0]
            ]
        ],
        WS9 = [3, d4, oh9, 0, [NG1, qw6, GR9, yG1],
            [64, 1, 0, () => hG1]
        ],
        DS9 = [3, d4, ah9, 0, [VWq, ZWq],
            [
                [() => lR9, 0], 4
            ]
        ],
        ZS9 = [-3, d4, eh9, {
                [pb]: Bb,
                [Fb]: 400,
                [mb]: ["IDPCommunicationError", 400]
            },
            [gb],
            [0]
        ];
    Uh.TypeRegistry.for(d4).registerError(ZS9, jWq);
    var fS9 = [-3, d4, qR9, {
            [pb]: Bb,
            [Fb]: 403,
            [mb]: ["IDPRejectedClaim", 403]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(fS9, wWq);
    var GS9 = [-3, d4, th9, {
            [pb]: Bb,
            [Fb]: 400,
            [mb]: ["InvalidAuthorizationMessageException", 400]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(GS9, HWq);
    var vS9 = [-3, d4, KR9, {
            [pb]: Bb,
            [Fb]: 400,
            [mb]: ["InvalidIdentityToken", 400]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(vS9, $Wq);
    var TS9 = [-3, d4, _R9, {
            [pb]: Bb,
            [Fb]: 400,
            [mb]: ["JWTPayloadSizeExceededException", 400]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(TS9, XWq);
    var VS9 = [-3, d4, YR9, {
            [pb]: Bb,
            [Fb]: 400,
            [mb]: ["MalformedPolicyDocument", 400]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(VS9, YWq);
    var kS9 = [-3, d4, wR9, {
            [pb]: Bb,
            [Fb]: 403,
            [mb]: ["OutboundWebIdentityFederationDisabledException", 403]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(kS9, MWq);
    var NS9 = [-3, d4, WR9, {
            [pb]: Bb,
            [Fb]: 400,
            [mb]: ["PackedPolicyTooLarge", 400]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(NS9, AWq);
    var NWq = [3, d4, MR9, 0, [xR9],
            [0]
        ],
        ES9 = [3, d4, XR9, 0, [jR9, kh9],
            [0, 0]
        ],
        yS9 = [-3, d4, ZR9, {
                [pb]: Bb,
                [Fb]: 403,
                [mb]: ["RegionDisabledException", 403]
            },
            [gb],
            [0]
        ];
    Uh.TypeRegistry.for(d4).registerError(yS9, OWq);
    var LS9 = [-3, d4, kR9, {
            [pb]: Bb,
            [Fb]: 403,
            [mb]: ["SessionDurationEscalationException", 403]
        },
        [gb],
        [0]
    ];
    Uh.TypeRegistry.for(d4).registerError(LS9, PWq);
    var hS9 = [3, d4, CR9, 0, [zR9, IR9],
            [0, 0]
        ],
        RS9 = [-3, kWq, "STSServiceException", 0, [],
            []
        ];
    Uh.TypeRegistry.for(kWq).registerError(RS9, NE);
    var ZZ8 = [1, d4, BR9, 0, () => NWq],
        SS9 = [1, d4, JR9, 0, () => ES9],
        hG1 = [1, d4, FR9, 0, () => hS9],
        CS9 = [9, d4, Hh9, 0, () => nR9, () => iR9],
        bS9 = [9, d4, Dh9, 0, () => rR9, () => oR9],
        IS9 = [9, d4, Gh9, 0, () => aR9, () => sR9],
        xS9 = [9, d4, Vh9, 0, () => tR9, () => eR9],
        uS9 = [9, d4, Nh9, 0, () => qS9, () => KS9],
        mS9 = [9, d4, Ih9, 0, () => AS9, () => OS9],
        BS9 = [9, d4, mh9, 0, () => wS9, () => $S9],
        pS9 = [9, d4, Fh9, 0, () => jS9, () => HS9],
        FS9 = [9, d4, Qh9, 0, () => JS9, () => XS9],
        gS9 = [9, d4, lh9, 0, () => MS9, () => PS9],
        US9 = [9, d4, rh9, 0, () => WS9, () => DS9];
    class fZ8 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(CS9).build() {}
    class RG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithSAML", {}).n("STSClient", "AssumeRoleWithSAMLCommand").sc(bS9).build() {}
    class GZ8 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(IS9).build() {}
    class SG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoot", {}).n("STSClient", "AssumeRootCommand").sc(xS9).build() {}
    class CG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "DecodeAuthorizationMessage", {}).n("STSClient", "DecodeAuthorizationMessageCommand").sc(uS9).build() {}
    class bG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetAccessKeyInfo", {}).n("STSClient", "GetAccessKeyInfoCommand").sc(mS9).build() {}
    class IG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetCallerIdentity", {}).n("STSClient", "GetCallerIdentityCommand").sc(BS9).build() {}
    class xG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetDelegatedAccessToken", {}).n("STSClient", "GetDelegatedAccessTokenCommand").sc(pS9).build() {}
    class uG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetFederationToken", {}).n("STSClient", "GetFederationTokenCommand").sc(FS9).build() {}
    class mG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetSessionToken", {}).n("STSClient", "GetSessionTokenCommand").sc(gS9).build() {}
    class BG1 extends kE.Command.classBuilder().ep(YB.commonParams).m(function(q, K, _, z) {
        return [zB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetWebIdentityToken", {}).n("STSClient", "GetWebIdentityTokenCommand").sc(US9).build() {}
    var QS9 = {
        AssumeRoleCommand: fZ8,
        AssumeRoleWithSAMLCommand: RG1,
        AssumeRoleWithWebIdentityCommand: GZ8,
        AssumeRootCommand: SG1,
        DecodeAuthorizationMessageCommand: CG1,
        GetAccessKeyInfoCommand: bG1,
        GetCallerIdentityCommand: IG1,
        GetDelegatedAccessTokenCommand: xG1,
        GetFederationTokenCommand: uG1,
        GetSessionTokenCommand: mG1,
        GetWebIdentityTokenCommand: BG1
    };
    class pG1 extends al6.STSClient {}
    kE.createAggregatedClient(QS9, pG1);
    var EWq = (q) => {
            if (typeof q?.Arn === "string") {
                let K = q.Arn.split(":");
                if (K.length > 4 && K[4] !== "") return K[4]
            }
            return
        },
        yWq = async (q, K, _, z = {}) => {
            let Y = typeof q === "function" ? await q() : q,
                A = typeof K === "function" ? await K() : K,
                O = await $h9.stsRegionDefaultResolver(z)();
            return _?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${Y} (credential provider clientConfig)`, `${A} (contextual client)`, `${O} (STS default: AWS_REGION, profile region, or us-east-1)`), Y ?? A ?? O
        }, dS9 = (q, K) => {
            let _, z;
            return async (Y, A) => {
                if (z = Y, !_) {
                    let {
                        logger: H = q?.parentClientConfig?.logger,
                        profile: J = q?.parentClientConfig?.profile,
                        region: X,
                        requestHandler: M = q?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: P,
                        userAgentAppId: W = q?.parentClientConfig?.userAgentAppId
                    } = q, D = await yWq(X, q?.parentClientConfig?.region, P, {
                        logger: H,
                        profile: J
                    }), Z = !LWq(M);
                    _ = new K({
                        ...q,
                        userAgentAppId: W,
                        profile: J,
                        credentialDefaultProvider: () => async () => z,
                        region: D,
                        requestHandler: Z ? M : void 0,
                        logger: H
                    })
                }
                let {
                    Credentials: O,
                    AssumedRoleUser: w
                } = await _.send(new fZ8(A));
                if (!O || !O.AccessKeyId || !O.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${A.RoleArn}`);
                let $ = EWq(w),
                    j = {
                        accessKeyId: O.AccessKeyId,
                        secretAccessKey: O.SecretAccessKey,
                        sessionToken: O.SessionToken,
                        expiration: O.Expiration,
                        ...O.CredentialScope && {
                            credentialScope: O.CredentialScope
                        },
                        ...$ && {
                            accountId: $
                        }
                    };
                return VG1.setCredentialFeature(j, "CREDENTIALS_STS_ASSUME_ROLE", "i"), j
            }
        }, cS9 = (q, K) => {
            let _;
            return async (z) => {
                if (!_) {
                    let {
                        logger: $ = q?.parentClientConfig?.logger,
                        profile: j = q?.parentClientConfig?.profile,
                        region: H,
                        requestHandler: J = q?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: X,
                        userAgentAppId: M = q?.parentClientConfig?.userAgentAppId
                    } = q, P = await yWq(H, q?.parentClientConfig?.region, X, {
                        logger: $,
                        profile: j
                    }), W = !LWq(J);
                    _ = new K({
                        ...q,
                        userAgentAppId: M,
                        profile: j,
                        region: P,
                        requestHandler: W ? J : void 0,
                        logger: $
                    })
                }
                let {
                    Credentials: Y,
                    AssumedRoleUser: A
                } = await _.send(new GZ8(z));
                if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${z.RoleArn}`);
                let O = EWq(A),
                    w = {
                        accessKeyId: Y.AccessKeyId,
                        secretAccessKey: Y.SecretAccessKey,
                        sessionToken: Y.SessionToken,
                        expiration: Y.Expiration,
                        ...Y.CredentialScope && {
                            credentialScope: Y.CredentialScope
                        },
                        ...O && {
                            accountId: O
                        }
                    };
                if (O) VG1.setCredentialFeature(w, "RESOLVED_ACCOUNT_ID", "T");
                return VG1.setCredentialFeature(w, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), w
            }
        }, LWq = (q) => {
            return q?.metadata?.handlerProtocol === "h2"
        }, hWq = (q, K) => {
            if (!K) return q;
            else return class extends q {
                constructor(z) {
                    super(z);
                    for (let Y of K) this.middlewareStack.use(Y)
                }
            }
        }, RWq = (q = {}, K) => dS9(q, hWq(al6.STSClient, K)), SWq = (q = {}, K) => cS9(q, hWq(al6.STSClient, K)), lS9 = (q) => (K) => q({
            roleAssumer: RWq(K),
            roleAssumerWithWebIdentity: SWq(K),
            ...K
        });
    Object.defineProperty(MZ8, "$Command", {
        enumerable: !0,
        get: function() {
            return kE.Command
        }
    });
    MZ8.AssumeRoleCommand = fZ8;
    MZ8.AssumeRoleWithSAMLCommand = RG1;
    MZ8.AssumeRoleWithWebIdentityCommand = GZ8;
    MZ8.AssumeRootCommand = SG1;
    MZ8.DecodeAuthorizationMessageCommand = CG1;
    MZ8.ExpiredTokenException = zWq;
    MZ8.ExpiredTradeInTokenException = JWq;
    MZ8.GetAccessKeyInfoCommand = bG1;
    MZ8.GetCallerIdentityCommand = IG1;
    MZ8.GetDelegatedAccessTokenCommand = xG1;
    MZ8.GetFederationTokenCommand = uG1;
    MZ8.GetSessionTokenCommand = mG1;
    MZ8.GetWebIdentityTokenCommand = BG1;
    MZ8.IDPCommunicationErrorException = jWq;
    MZ8.IDPRejectedClaimException = wWq;
    MZ8.InvalidAuthorizationMessageException = HWq;
    MZ8.InvalidIdentityTokenException = $Wq;
    MZ8.JWTPayloadSizeExceededException = XWq;
    MZ8.MalformedPolicyDocumentException = YWq;
    MZ8.OutboundWebIdentityFederationDisabledException = MWq;
    MZ8.PackedPolicyTooLargeException = AWq;
    MZ8.RegionDisabledException = OWq;
    MZ8.STS = pG1;
    MZ8.STSServiceException = NE;
    MZ8.SessionDurationEscalationException = PWq;
    MZ8.decorateDefaultCredentialProvider = lS9;
    MZ8.getDefaultRoleAssumer = RWq;
    MZ8.getDefaultRoleAssumerWithWebIdentity = SWq;
    Object.keys(al6).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(MZ8, q)) Object.defineProperty(MZ8, q, {
            enumerable: !0,
            get: function() {
                return al6[q]
            }
        })
    })
})
// @from(Ln 105760, Col 4)
bWq = p((CWq) => {
    Object.defineProperty(CWq, "__esModule", {
        value: !0
    });
    CWq.propertyProviderChain = CWq.createCredentialChain = void 0;
    var vC9 = jP(),
        TC9 = (...q) => {
            let K = -1,
                z = Object.assign(async (Y) => {
                    let A = await CWq.propertyProviderChain(...q)(Y);
                    if (!A.expiration && K !== -1) A.expiration = new Date(Date.now() + K);
                    return A
                }, {
                    expireAfter(Y) {
                        if (Y < 300000) throw Error("@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.");
                        return K = Y, z
                    }
                });
            return z
        };
    CWq.createCredentialChain = TC9;
    var VC9 = (...q) => async (K) => {
        if (q.length === 0) throw new vC9.ProviderError("No providers in chain", {
            tryNextLink: !1
        });
        let _;
        for (let z of q) try {
            return await z(K)
        } catch (Y) {
            if (_ = Y, Y?.tryNextLink) continue;
            throw Y
        }
        throw _
    };
    CWq.propertyProviderChain = VC9
})
// @from(Ln 105796, Col 4)
iG1 = p((RC9) => {
    RC9.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(RC9.HttpAuthLocation || (RC9.HttpAuthLocation = {}));
    RC9.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(RC9.HttpApiKeyAuthLocation || (RC9.HttpApiKeyAuthLocation = {}));
    RC9.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(RC9.EndpointURLScheme || (RC9.EndpointURLScheme = {}));
    RC9.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(RC9.AlgorithmId || (RC9.AlgorithmId = {}));
    var NC9 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => RC9.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => RC9.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        EC9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        yC9 = (q) => {
            return NC9(q)
        },
        LC9 = (q) => {
            return EC9(q)
        };
    RC9.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(RC9.FieldPosition || (RC9.FieldPosition = {}));
    var hC9 = "__smithy_context";
    RC9.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(RC9.IniSectionType || (RC9.IniSectionType = {}));
    RC9.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(RC9.RequestHandlerProtocol || (RC9.RequestHandlerProtocol = {}));
    RC9.SMITHY_CONTEXT_KEY = hC9;
    RC9.getDefaultClientConfiguration = yC9;
    RC9.resolveDefaultRuntimeConfig = LC9
})