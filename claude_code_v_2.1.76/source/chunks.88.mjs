
// @from(Ln 227600, Col 0)
function iL9(A, q, K) {
    try {
        let Y = -1;
        for (let O = 0; O < K.length; O++) {
            let $ = K[O];
            if (!$) continue;
            let H = $.message.content;
            if (Array.isArray(H)) {
                for (let j of H)
                    if (j.type === "tool_use" && "id" in j && j.id === A) {
                        Y = O;
                        break
                    }
            }
            if (Y !== -1) break
        }
        let z = -1;
        for (let O = 0; O < q.length; O++) {
            let $ = q[O];
            if (!$) continue;
            if ($.type === "assistant" && "message" in $) {
                let H = $.message.content;
                if (Array.isArray(H)) {
                    for (let j of H)
                        if (j.type === "tool_use" && "id" in j && j.id === A) {
                            z = O;
                            break
                        }
                }
            }
            if (z !== -1) break
        }
        let _ = [];
        for (let O = Y + 1; O < K.length; O++) {
            let $ = K[O];
            if (!$) continue;
            let H = $.message.content;
            if (Array.isArray(H))
                for (let j of H) {
                    let J = $.message.role;
                    if (j.type === "tool_use" && "id" in j) _.push(`${J}:tool_use:${j.id}`);
                    else if (j.type === "tool_result" && "tool_use_id" in j) _.push(`${J}:tool_result:${j.tool_use_id}`);
                    else if (j.type === "text") _.push(`${J}:text`);
                    else if (j.type === "thinking") _.push(`${J}:thinking`);
                    else if (j.type === "image") _.push(`${J}:image`);
                    else _.push(`${J}:${j.type}`)
                } else if (typeof H === "string") _.push(`${$.message.role}:string_content`)
        }
        let w = [];
        for (let O = z + 1; O < q.length; O++) {
            let $ = q[O];
            if (!$) continue;
            switch ($.type) {
                case "user":
                case "assistant": {
                    if ("message" in $) {
                        let H = $.message.content;
                        if (Array.isArray(H))
                            for (let j of H) {
                                let J = $.message.role;
                                if (j.type === "tool_use" && "id" in j) w.push(`${J}:tool_use:${j.id}`);
                                else if (j.type === "tool_result" && "tool_use_id" in j) w.push(`${J}:tool_result:${j.tool_use_id}`);
                                else if (j.type === "text") w.push(`${J}:text`);
                                else if (j.type === "thinking") w.push(`${J}:thinking`);
                                else if (j.type === "image") w.push(`${J}:image`);
                                else w.push(`${J}:${j.type}`)
                            } else if (typeof H === "string") w.push(`${$.message.role}:string_content`)
                    }
                    break
                }
                case "attachment":
                    if ("attachment" in $) w.push(`attachment:${$.attachment.type}`);
                    break;
                case "system":
                    if ("subtype" in $) w.push(`system:${$.subtype}`);
                    break;
                case "progress":
                    if ("progress" in $ && $.progress && typeof $.progress === "object" && "type" in $.progress) w.push(`progress:${$.progress.type??"unknown"}`);
                    else w.push("progress:unknown");
                    break
            }
        }
        d("tengu_tool_use_tool_result_mismatch_error", {
            toolUseId: A,
            normalizedSequence: _.join(", "),
            preNormalizedSequence: w.join(", "),
            normalizedMessageCount: K.length,
            originalMessageCount: q.length,
            normalizedToolUseIndex: Y,
            originalToolUseIndex: z
        })
    } catch (Y) {}
}
// @from(Ln 227694, Col 0)
function oX1(A, q, K) {
    if (A instanceof zm || A instanceof mW && A.message.toLowerCase().includes("timeout")) return y9({
        content: rX1,
        error: "unknown"
    });
    if (A instanceof n06 || A instanceof pd) return y9({
        content: dX1()
    });
    if (A instanceof Error && A.message.includes(v36)) return y9({
        content: v36,
        error: "rate_limit"
    });
    if (A instanceof a7 && A.status === 429 && p06(iA())) {
        let Y = A.headers?.get?.("anthropic-ratelimit-unified-representative-claim"),
            z = A.headers?.get?.("anthropic-ratelimit-unified-overage-status");
        if (Y || z) {
            let _ = {
                    status: "rejected",
                    unifiedRateLimitFallbackAvailable: !1,
                    isUsingOverage: !1
                },
                w = A.headers?.get?.("anthropic-ratelimit-unified-reset");
            if (w) _.resetsAt = Number(w);
            if (Y) _.rateLimitType = Y;
            if (z) _.overageStatus = z;
            let O = A.headers?.get?.("anthropic-ratelimit-unified-overage-reset");
            if (O) _.overageResetsAt = Number(O);
            let $ = A.headers?.get?.("anthropic-ratelimit-unified-overage-disabled-reason");
            if ($) _.overageDisabledReason = $;
            let H = gT8(_, q);
            if (H) return y9({
                content: H,
                error: "rate_limit"
            });
            return y9({
                content: N36,
                error: "rate_limit"
            })
        }
        return y9({
            content: `${j$}: Rate limit reached`,
            error: "rate_limit"
        })
    }
    if (A instanceof Error && A.message.toLowerCase().includes("prompt is too long")) return y9({
        content: EB,
        error: "invalid_request",
        errorDetails: A.message
    });
    if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return y9({
        content: kv8(),
        error: "invalid_request"
    });
    if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return y9({
        content: Ev8(),
        error: "invalid_request"
    });
    if (A instanceof Error && A.message.includes("The PDF specified was not valid")) return y9({
        content: yv8(),
        error: "invalid_request"
    });
    if (A instanceof a7 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return y9({
        content: dX1()
    });
    if (A instanceof a7 && A.status === 400 && A.message.includes("image dimensions exceed") && A.message.includes("many-image")) return y9({
        content: q7() ? "An image in the conversation exceeds the dimension limit for many-image requests (2000px). Start a new session with fewer images." : "An image in the conversation exceeds the dimension limit for many-image requests (2000px). Run /compact to remove old images from context, or start a new session.",
        error: "invalid_request"
    });
    if (wH6 && A instanceof a7 && A.status === 400 && A.message.includes(wH6) && A.message.includes("anthropic-beta")) return y9({
        content: "Auto mode temporarily unavailable",
        error: "invalid_request"
    });
    if (A instanceof a7 && A.status === 413) return y9({
        content: Lv8(),
        error: "invalid_request"
    });
    if (A instanceof a7 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) {
        if (K?.messages && K?.messagesForAPI) {
            let Y = A.message.match(/toolu_[a-zA-Z0-9]+/),
                z = Y ? Y[0] : null;
            if (z) iL9(z, K.messages, K.messagesForAPI)
        } {
            let z = q7() ? "" : " Run /rewind to recover the conversation.";
            return y9({
                content: "API Error: 400 due to tool use concurrency issues." + z,
                error: "invalid_request"
            })
        }
    }
    if (A instanceof a7 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) d("tengu_unexpected_tool_result", {});
    if (iA() && A instanceof a7 && A.status === 400 && A.message.toLowerCase().includes("invalid model name") && (V36(q) || q === "opus")) return y9({
        content: "Claude Opus is not available with the Claude Pro plan. If you have updated your subscription plan recently, run /logout and /login for the plan to take effect.",
        error: "invalid_request"
    });
    if (A instanceof Error && A.message.includes("Your credit balance is too low")) return y9({
        content: cX1,
        error: "billing_error"
    });
    if (A instanceof a7 && A.status === 400 && A.message.toLowerCase().includes("organization has been disabled")) {
        let {
            source: Y
        } = s2();
        if (Y === "ANTHROPIC_API_KEY" && process.env.ANTHROPIC_API_KEY && !iA()) {
            let z = sA()?.accessToken != null;
            return y9({
                error: "invalid_request",
                content: z ? vv8 : Nv8
            })
        }
    }
    if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) {
        let {
            source: Y
        } = s2();
        return y9({
            error: "authentication_failed",
            content: Y === "ANTHROPIC_API_KEY" || Y === "apiKeyHelper" ? iX1 : lX1
        })
    }
    if (A instanceof a7 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return y9({
        error: "authentication_failed",
        content: cL9()
    });
    if (A instanceof a7 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return y9({
        error: "authentication_failed",
        content: lL9()
    });
    if (A instanceof a7 && (A.status === 401 || A.status === 403)) return y9({
        error: "authentication_failed",
        content: q7() ? `Failed to authenticate. ${j$}: ${A.message}` : `${j$}: ${A.message} · Please run /login`
    });
    if (t6(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) {
        let Y = q7() ? "--model" : "/model",
            z = l44(q);
        return y9({
            content: z ? `${j$} (${q}): ${A.message}. Try ${Y} to switch to ${z}.` : `${j$} (${q}): ${A.message}. Run ${Y} to pick a different model.`,
            error: "invalid_request"
        })
    }
    if (A instanceof a7 && A.status === 404) {
        let Y = q7() ? "--model" : "/model",
            z = l44(q);
        return y9({
            content: z ? `The model ${q} is not available on your ${QA()} deployment. Try ${Y} to switch to ${z}, or ask your admin to enable this model.` : `There's an issue with the selected model (${q}). It may not exist or you may not have access to it. Run ${Y} to pick a different model.`,
            error: "invalid_request"
        })
    }
    if (A instanceof mW) return y9({
        content: `${j$}: ${i06(A)}`,
        error: "unknown"
    });
    if (A instanceof Error) return y9({
        content: `${j$}: ${A.message}`,
        error: "unknown"
    });
    return y9({
        content: j$,
        error: "unknown"
    })
}
// @from(Ln 227855, Col 0)
function l44(A) {
    if (QA() === "firstParty") return;
    let q = A.toLowerCase();
    if (q.includes("opus-4-6") || q.includes("opus_4_6")) return _3().opus41;
    if (q.includes("sonnet-4-6") || q.includes("sonnet_4_6")) return _3().sonnet45;
    if (q.includes("sonnet-4-5") || q.includes("sonnet_4_5")) return _3().sonnet40;
    return
}
// @from(Ln 227864, Col 0)
function i44(A) {
    if (A instanceof Error && A.message === "Request was aborted.") return "aborted";
    if (A instanceof zm || A instanceof mW && A.message.toLowerCase().includes("timeout")) return "api_timeout";
    if (A instanceof Error && A.message.includes(Vv8)) return "repeated_529";
    if (A instanceof Error && A.message.includes(v36)) return "capacity_off_switch";
    if (A instanceof a7 && A.status === 429) return "rate_limit";
    if (A instanceof a7 && (A.status === 529 || A.message?.includes('"type":"overloaded_error"'))) return "server_overload";
    if (A instanceof Error && A.message.toLowerCase().includes(EB.toLowerCase())) return "prompt_too_long";
    if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return "pdf_too_large";
    if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return "pdf_password_protected";
    if (A instanceof a7 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return "image_too_large";
    if (A instanceof a7 && A.status === 400 && A.message.includes("image dimensions exceed") && A.message.includes("many-image")) return "image_too_large";
    if (A instanceof a7 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) return "tool_use_mismatch";
    if (A instanceof a7 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) return "unexpected_tool_result";
    if (A instanceof a7 && A.status === 400 && A.message.toLowerCase().includes("invalid model name")) return "invalid_model";
    if (A instanceof Error && A.message.toLowerCase().includes(cX1.toLowerCase())) return "credit_balance_low";
    if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) return "invalid_api_key";
    if (A instanceof a7 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return "token_revoked";
    if (A instanceof a7 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return "oauth_org_not_allowed";
    if (A instanceof a7 && (A.status === 401 || A.status === 403)) return "auth_error";
    if (t6(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return "bedrock_model_access";
    if (A instanceof a7) {
        let q = A.status;
        if (q >= 500) return "server_error";
        if (q >= 400) return "client_error"
    }
    if (A instanceof mW) {
        if (l06(A)?.isSSLError) return "ssl_cert_error";
        return "connection_error"
    }
    return "unknown"
}
// @from(Ln 227897, Col 0)
function n44(A, q) {
    if (A !== "refusal") return;
    d("tengu_refusal_api_response", {});
    let K = q7() ? `${j$}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Try rephrasing the request or attempting a different approach.` : `${j$}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Please double press esc to edit your last message or start a new session for Claude Code to assist with a different task.`;
    return y9({
        content: K + (q !== "claude-sonnet-4-20250514" ? " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." : ""),
        error: "invalid_request"
    })
}
// @from(Ln 227906, Col 4)
j$ = "API Error"
// @from(Ln 227907, Col 4)
EB = "Prompt is too long"
// @from(Ln 227908, Col 4)
cX1 = "Credit balance is too low"
// @from(Ln 227909, Col 4)
lX1 = "Not logged in · Please run /login"
// @from(Ln 227910, Col 4)
iX1 = "Invalid API key · Fix external API key"
// @from(Ln 227911, Col 4)
vv8 = "Your ANTHROPIC_API_KEY belongs to a disabled organization · Unset the environment variable to use your subscription instead"
// @from(Ln 227912, Col 4)
Nv8 = "Your ANTHROPIC_API_KEY belongs to a disabled organization · Update or unset the environment variable"
// @from(Ln 227913, Col 4)
nX1 = "OAuth token revoked · Please run /login"
// @from(Ln 227914, Col 4)
Vv8 = "Repeated 529 Overloaded errors"
// @from(Ln 227915, Col 4)
v36 = "Opus is experiencing high load, please use /model to switch to Sonnet"
// @from(Ln 227916, Col 4)
rX1 = "Request timed out"
// @from(Ln 227917, Col 4)
dL9 = "Your account does not have access to Claude Code. Please run /login."
// @from(Ln 227918, Col 4)
yB = E(() => {
    wv();
    fA();
    JA();
    z4();
    Nz();
    V1();
    ud();
    IF6();
    A8();
    T1();
    Z7();
    uv();
    vX1();
    jR();
    ht();
    Tr()
})
// @from(Ln 227936, Col 4)
xv8 = x((tL9) => {
    tL9.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(tL9.HttpAuthLocation || (tL9.HttpAuthLocation = {}));
    tL9.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(tL9.HttpApiKeyAuthLocation || (tL9.HttpApiKeyAuthLocation = {}));
    tL9.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(tL9.EndpointURLScheme || (tL9.EndpointURLScheme = {}));
    tL9.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(tL9.AlgorithmId || (tL9.AlgorithmId = {}));
    var nL9 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => tL9.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => tL9.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        rL9 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        oL9 = (A) => {
            return nL9(A)
        },
        aL9 = (A) => {
            return rL9(A)
        };
    tL9.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(tL9.FieldPosition || (tL9.FieldPosition = {}));
    var sL9 = "__smithy_context";
    tL9.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(tL9.IniSectionType || (tL9.IniSectionType = {}));
    tL9.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(tL9.RequestHandlerProtocol || (tL9.RequestHandlerProtocol = {}));
    tL9.SMITHY_CONTEXT_KEY = sL9;
    tL9.getDefaultClientConfiguration = oL9;
    tL9.resolveDefaultRuntimeConfig = aL9
})
// @from(Ln 228001, Col 4)
k36 = x(($W6) => {
    var a44 = Pu(),
        Fv8 = pT(),
        mv8 = xv8(),
        KR9 = dO(),
        r44 = FT();
    class s44 {
        config;
        middlewareStack = a44.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                _ = Y === void 0 && this.config.cacheMiddleware === !0,
                w;
            if (_) {
                if (!this.handlers) this.handlers = new WeakMap;
                let O = this.handlers;
                if (O.has(A.constructor)) w = O.get(A.constructor);
                else w = A.resolveMiddleware(this.middlewareStack, this.config, Y), O.set(A.constructor, w)
            } else delete this.handlers, w = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) w(A).then((O) => z(null, O.output), (O) => z(O)).catch(() => {});
            else return w(A).then((O) => O.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var uv8 = "***SensitiveInformation***";

    function Bv8(A, q) {
        if (q == null) return q;
        let K = KR9.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return uv8;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return uv8
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return uv8
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = Bv8(w, Y[_]);
            return z
        }
        return q
    }
    class pv8 {
        middlewareStack = a44.constructStack();
        schema;
        static classBuilder() {
            return new t44
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: _,
            inputFilterSensitiveLog: w,
            outputFilterSensitiveLog: O,
            smithyContext: $,
            additionalContext: H,
            CommandCtor: j
        }) {
            for (let P of Y.bind(this)(j, A, q, K)) this.middlewareStack.use(P);
            let J = A.concat(this.middlewareStack),
                {
                    logger: M
                } = q,
                D = {
                    logger: M,
                    clientName: z,
                    commandName: _,
                    inputFilterSensitiveLog: w,
                    outputFilterSensitiveLog: O,
                    [mv8.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...H
                },
                {
                    requestHandler: X
                } = q;
            return J.resolve((P) => X.handle(P.request, K || {}), D)
        }
    }
    class t44 {
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
        init(A) {
            this._init = A
        }
        ep(A) {
            return this._ep = A, this
        }
        m(A) {
            return this._middlewareFn = A, this
        }
        s(A, q, K = {}) {
            return this._smithyContext = {
                service: A,
                operation: q,
                ...K
            }, this
        }
        c(A = {}) {
            return this._additionalContext = A, this
        }
        n(A, q) {
            return this._clientName = A, this._commandName = q, this
        }
        f(A = (K) => K, q = (K) => K) {
            return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = q, this
        }
        ser(A) {
            return this._serializer = A, this
        }
        de(A) {
            return this._deserializer = A, this
        }
        sc(A) {
            return this._operationSchema = A, this._smithyContext.operationSchema = A, this
        }
        build() {
            let A = this,
                q;
            return q = class extends pv8 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let _ = A._operationSchema,
                        w = _?.[4] ?? _?.input,
                        O = _?.[5] ?? _?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? Bv8.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? Bv8.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var YR9 = "***SensitiveInformation***",
        zR9 = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        };
    class OW6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(A) {
            super(A.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return OW6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === OW6) return OW6.isInstance(A);
            if (OW6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var e44 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        Aq4 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = wR9(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw e44(w, q)
        },
        _R9 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                Aq4({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        wR9 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        OR9 = (A) => {
            switch (A) {
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
        o44 = !1,
        $R9 = (A) => {
            if (A && !o44 && parseInt(A.substring(1, A.indexOf("."))) < 16) o44 = !0
        },
        HR9 = (A) => {
            let q = [];
            for (let K in mv8.AlgorithmId) {
                let Y = mv8.AlgorithmId[K];
                if (A[Y] === void 0) continue;
                q.push({
                    algorithmId: () => Y,
                    checksumConstructor: () => A[Y]
                })
            }
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        jR9 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        JR9 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        MR9 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        qq4 = (A) => {
            return Object.assign(HR9(A), JR9(A))
        },
        DR9 = qq4,
        XR9 = (A) => {
            return Object.assign(jR9(A), MR9(A))
        },
        PR9 = (A) => Array.isArray(A) ? A : [A],
        Kq4 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = Kq4(A[K]);
            return A
        },
        WR9 = (A) => {
            return A != null
        };
    class Yq4 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function zq4(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, fR9(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            _q4(Y, null, _, w)
        }
        return Y
    }
    var ZR9 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        GR9 = (A, q) => {
            let K = {};
            for (let Y in q) _q4(K, A, q, Y);
            return K
        },
        fR9 = (A, q, K) => {
            return zq4(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        _q4 = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = TR9, $ = vR9, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        },
        TR9 = (A) => A != null,
        vR9 = (A) => A,
        NR9 = (A) => {
            if (A !== A) return "NaN";
            switch (A) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return A
            }
        },
        VR9 = (A) => A.toISOString().replace(".000Z", "Z"),
        gv8 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(gv8);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = gv8(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty($W6, "collectBody", {
        enumerable: !0,
        get: function() {
            return Fv8.collectBody
        }
    });
    Object.defineProperty($W6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return Fv8.extendedEncodeURIComponent
        }
    });
    Object.defineProperty($W6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return Fv8.resolvedPath
        }
    });
    $W6.Client = s44;
    $W6.Command = pv8;
    $W6.NoOpLogger = Yq4;
    $W6.SENSITIVE_STRING = YR9;
    $W6.ServiceException = OW6;
    $W6._json = gv8;
    $W6.convertMap = ZR9;
    $W6.createAggregatedClient = zR9;
    $W6.decorateServiceException = e44;
    $W6.emitWarningIfUnsupportedVersion = $R9;
    $W6.getArrayIfSingleItem = PR9;
    $W6.getDefaultClientConfiguration = DR9;
    $W6.getDefaultExtensionConfiguration = qq4;
    $W6.getValueFromTextNode = Kq4;
    $W6.isSerializableHeaderValue = WR9;
    $W6.loadConfigsForDefaultMode = OR9;
    $W6.map = zq4;
    $W6.resolveDefaultRuntimeConfig = XR9;
    $W6.serializeDateTime = VR9;
    $W6.serializeFloat = NR9;
    $W6.take = GR9;
    $W6.throwDefaultError = Aq4;
    $W6.withBaseException = _R9;
    Object.keys(r44).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call($W6, A)) Object.defineProperty($W6, A, {
            enumerable: !0,
            get: function() {
                return r44[A]
            }
        })
    })
})
// @from(Ln 228471, Col 4)
Uv8 = x((Oq4) => {
    Object.defineProperty(Oq4, "__esModule", {
        value: !0
    });
    Oq4.resolveHttpAuthSchemeConfig = Oq4.resolveStsAuthConfig = Oq4.defaultSTSHttpAuthSchemeProvider = Oq4.defaultSTSHttpAuthSchemeParametersProvider = void 0;
    var nR9 = Nw(),
        Qv8 = VW(),
        rR9 = dv8(),
        oR9 = async (A, q, K) => {
            return {
                operation: (0, Qv8.getSmithyContext)(q).operation,
                region: await (0, Qv8.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    Oq4.defaultSTSHttpAuthSchemeParametersProvider = oR9;

    function aR9(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sts",
                region: A.region
            },
            propertiesExtractor: (q, K) => ({
                signingProperties: {
                    config: q,
                    context: K
                }
            })
        }
    }

    function wq4(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var sR9 = (A) => {
        let q = [];
        switch (A.operation) {
            case "AssumeRoleWithSAML": {
                q.push(wq4(A));
                break
            }
            case "AssumeRoleWithWebIdentity": {
                q.push(wq4(A));
                break
            }
            default:
                q.push(aR9(A))
        }
        return q
    };
    Oq4.defaultSTSHttpAuthSchemeProvider = sR9;
    var tR9 = (A) => Object.assign(A, {
        stsClientCtor: rR9.STSClient
    });
    Oq4.resolveStsAuthConfig = tR9;
    var eR9 = (A) => {
        let q = Oq4.resolveStsAuthConfig(A),
            K = (0, nR9.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, Qv8.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    Oq4.resolveHttpAuthSchemeConfig = eR9
})
// @from(Ln 228540, Col 4)
cv8 = x((jq4) => {
    Object.defineProperty(jq4, "__esModule", {
        value: !0
    });
    jq4.commonParams = jq4.resolveClientEndpointParameters = void 0;
    var Kh9 = (A) => {
        return Object.assign(A, {
            useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
            useFipsEndpoint: A.useFipsEndpoint ?? !1,
            useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
            defaultSigningName: "sts"
        })
    };
    jq4.resolveClientEndpointParameters = Kh9;
    jq4.commonParams = {
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
// @from(Ln 228577, Col 4)
Mq4 = x(($F2, zh9) => {
    zh9.exports = {
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
// @from(Ln 228676, Col 4)
Dq4 = x((wh9) => {
    var _h9 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    wh9.isArrayBuffer = _h9
})
// @from(Ln 228680, Col 4)
iv8 = x((Jh9) => {
    var $h9 = Dq4(),
        lv8 = x6("buffer"),
        Hh9 = (A, q = 0, K = A.byteLength - q) => {
            if (!$h9.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return lv8.Buffer.from(A, q, K)
        },
        jh9 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? lv8.Buffer.from(A, q) : lv8.Buffer.from(A)
        };
    Jh9.fromArrayBuffer = Hh9;
    Jh9.fromString = jh9
})
// @from(Ln 228694, Col 4)
Wq4 = x((Xq4) => {
    Object.defineProperty(Xq4, "__esModule", {
        value: !0
    });
    Xq4.fromBase64 = void 0;
    var Xh9 = iv8(),
        Ph9 = /^[A-Za-z0-9+/]*={0,2}$/,
        Wh9 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!Ph9.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, Xh9.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    Xq4.fromBase64 = Wh9
})
// @from(Ln 228709, Col 4)
fq4 = x((Zq4) => {
    Object.defineProperty(Zq4, "__esModule", {
        value: !0
    });
    Zq4.toBase64 = void 0;
    var Zh9 = iv8(),
        Gh9 = C_(),
        fh9 = (A) => {
            let q;
            if (typeof A === "string") q = (0, Gh9.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, Zh9.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    Zq4.toBase64 = fh9
})
// @from(Ln 228725, Col 4)
Nq4 = x((UF6) => {
    var Tq4 = Wq4(),
        vq4 = fq4();
    Object.keys(Tq4).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(UF6, A)) Object.defineProperty(UF6, A, {
            enumerable: !0,
            get: function() {
                return Tq4[A]
            }
        })
    });
    Object.keys(vq4).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(UF6, A)) Object.defineProperty(UF6, A, {
            enumerable: !0,
            get: function() {
                return vq4[A]
            }
        })
    })
})
// @from(Ln 228745, Col 4)
iq4 = x((cq4) => {
    Object.defineProperty(cq4, "__esModule", {
        value: !0
    });
    cq4.ruleSet = void 0;
    var xq4 = "required",
        f3 = "type",
        Rz = "fn",
        hz = "argv",
        Ct = "ref",
        Vq4 = !1,
        nv8 = !0,
        St = "booleanEquals",
        A0 = "stringEquals",
        uq4 = "sigv4",
        mq4 = "sts",
        Bq4 = "us-east-1",
        J$ = "endpoint",
        kq4 = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
        LB = "tree",
        HW6 = "error",
        ov8 = "getAttr",
        Eq4 = {
            [xq4]: !1,
            [f3]: "string"
        },
        rv8 = {
            [xq4]: !0,
            default: !1,
            [f3]: "boolean"
        },
        gq4 = {
            [Ct]: "Endpoint"
        },
        yq4 = {
            [Rz]: "isSet",
            [hz]: [{
                [Ct]: "Region"
            }]
        },
        q0 = {
            [Ct]: "Region"
        },
        Lq4 = {
            [Rz]: "aws.partition",
            [hz]: [q0],
            assign: "PartitionResult"
        },
        Fq4 = {
            [Ct]: "UseFIPS"
        },
        pq4 = {
            [Ct]: "UseDualStack"
        },
        zZ = {
            url: "https://sts.amazonaws.com",
            properties: {
                authSchemes: [{
                    name: uq4,
                    signingName: mq4,
                    signingRegion: Bq4
                }]
            },
            headers: {}
        },
        gk = {},
        Rq4 = {
            conditions: [{
                [Rz]: A0,
                [hz]: [q0, "aws-global"]
            }],
            [J$]: zZ,
            [f3]: J$
        },
        Qq4 = {
            [Rz]: St,
            [hz]: [Fq4, !0]
        },
        Uq4 = {
            [Rz]: St,
            [hz]: [pq4, !0]
        },
        hq4 = {
            [Rz]: ov8,
            [hz]: [{
                [Ct]: "PartitionResult"
            }, "supportsFIPS"]
        },
        dq4 = {
            [Ct]: "PartitionResult"
        },
        Sq4 = {
            [Rz]: St,
            [hz]: [!0, {
                [Rz]: ov8,
                [hz]: [dq4, "supportsDualStack"]
            }]
        },
        Cq4 = [{
            [Rz]: "isSet",
            [hz]: [gq4]
        }],
        Iq4 = [Qq4],
        bq4 = [Uq4],
        Th9 = {
            version: "1.0",
            parameters: {
                Region: Eq4,
                UseDualStack: rv8,
                UseFIPS: rv8,
                Endpoint: Eq4,
                UseGlobalEndpoint: rv8
            },
            rules: [{
                conditions: [{
                    [Rz]: St,
                    [hz]: [{
                        [Ct]: "UseGlobalEndpoint"
                    }, nv8]
                }, {
                    [Rz]: "not",
                    [hz]: Cq4
                }, yq4, Lq4, {
                    [Rz]: St,
                    [hz]: [Fq4, Vq4]
                }, {
                    [Rz]: St,
                    [hz]: [pq4, Vq4]
                }],
                rules: [{
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "ap-northeast-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "ap-south-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "ap-southeast-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "ap-southeast-2"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, Rq4, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "ca-central-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "eu-central-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "eu-north-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "eu-west-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "eu-west-2"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "eu-west-3"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "sa-east-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, Bq4]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "us-east-2"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "us-west-1"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    conditions: [{
                        [Rz]: A0,
                        [hz]: [q0, "us-west-2"]
                    }],
                    endpoint: zZ,
                    [f3]: J$
                }, {
                    endpoint: {
                        url: kq4,
                        properties: {
                            authSchemes: [{
                                name: uq4,
                                signingName: mq4,
                                signingRegion: "{Region}"
                            }]
                        },
                        headers: gk
                    },
                    [f3]: J$
                }],
                [f3]: LB
            }, {
                conditions: Cq4,
                rules: [{
                    conditions: Iq4,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    [f3]: HW6
                }, {
                    conditions: bq4,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    [f3]: HW6
                }, {
                    endpoint: {
                        url: gq4,
                        properties: gk,
                        headers: gk
                    },
                    [f3]: J$
                }],
                [f3]: LB
            }, {
                conditions: [yq4],
                rules: [{
                    conditions: [Lq4],
                    rules: [{
                        conditions: [Qq4, Uq4],
                        rules: [{
                            conditions: [{
                                [Rz]: St,
                                [hz]: [nv8, hq4]
                            }, Sq4],
                            rules: [{
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: gk,
                                    headers: gk
                                },
                                [f3]: J$
                            }],
                            [f3]: LB
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            [f3]: HW6
                        }],
                        [f3]: LB
                    }, {
                        conditions: Iq4,
                        rules: [{
                            conditions: [{
                                [Rz]: St,
                                [hz]: [hq4, nv8]
                            }],
                            rules: [{
                                conditions: [{
                                    [Rz]: A0,
                                    [hz]: [{
                                        [Rz]: ov8,
                                        [hz]: [dq4, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://sts.{Region}.amazonaws.com",
                                    properties: gk,
                                    headers: gk
                                },
                                [f3]: J$
                            }, {
                                endpoint: {
                                    url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: gk,
                                    headers: gk
                                },
                                [f3]: J$
                            }],
                            [f3]: LB
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            [f3]: HW6
                        }],
                        [f3]: LB
                    }, {
                        conditions: bq4,
                        rules: [{
                            conditions: [Sq4],
                            rules: [{
                                endpoint: {
                                    url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: gk,
                                    headers: gk
                                },
                                [f3]: J$
                            }],
                            [f3]: LB
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            [f3]: HW6
                        }],
                        [f3]: LB
                    }, Rq4, {
                        endpoint: {
                            url: kq4,
                            properties: gk,
                            headers: gk
                        },
                        [f3]: J$
                    }],
                    [f3]: LB
                }],
                [f3]: LB
            }, {
                error: "Invalid Configuration: Missing Region",
                [f3]: HW6
            }]
        };
    cq4.ruleSet = Th9
})
// @from(Ln 229109, Col 4)
oq4 = x((nq4) => {
    Object.defineProperty(nq4, "__esModule", {
        value: !0
    });
    nq4.defaultEndpointResolver = void 0;
    var vh9 = Zu(),
        av8 = nS(),
        Nh9 = iq4(),
        Vh9 = new av8.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
        }),
        kh9 = (A, q = {}) => {
            return Vh9.get(A, () => (0, av8.resolveEndpoint)(Nh9.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    nq4.defaultEndpointResolver = kh9;
    av8.customEndpointFunctions.aws = vh9.awsEndpointFunctions
})
// @from(Ln 229130, Col 4)
AK4 = x((tq4) => {
    Object.defineProperty(tq4, "__esModule", {
        value: !0
    });
    tq4.getRuntimeConfig = void 0;
    var Eh9 = Nw(),
        yh9 = RQ(),
        Lh9 = w_(),
        Rh9 = k36(),
        hh9 = hy(),
        aq4 = Nq4(),
        sq4 = C_(),
        Sh9 = Uv8(),
        Ch9 = oq4(),
        Ih9 = (A) => {
            return {
                apiVersion: "2011-06-15",
                base64Decoder: A?.base64Decoder ?? aq4.fromBase64,
                base64Encoder: A?.base64Encoder ?? aq4.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? Ch9.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Sh9.defaultSTSHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new Eh9.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new Lh9.NoAuthSigner
                }],
                logger: A?.logger ?? new Rh9.NoOpLogger,
                protocol: A?.protocol ?? new yh9.AwsQueryProtocol({
                    defaultNamespace: "com.amazonaws.sts",
                    xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
                    version: "2011-06-15"
                }),
                serviceId: A?.serviceId ?? "STS",
                urlParser: A?.urlParser ?? hh9.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? sq4.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? sq4.toUtf8
            }
        };
    tq4.getRuntimeConfig = Ih9
})
// @from(Ln 229176, Col 4)
OK4 = x((_K4) => {
    Object.defineProperty(_K4, "__esModule", {
        value: !0
    });
    _K4.getRuntimeConfig = void 0;
    var bh9 = _2(),
        xh9 = bh9.__importDefault(Mq4()),
        sv8 = Nw(),
        qK4 = P46(),
        KK4 = kQ(),
        aX1 = Nj(),
        uh9 = w_(),
        mh9 = EQ(),
        YK4 = kP(),
        E36 = BT(),
        zK4 = uT(),
        Bh9 = yQ(),
        gh9 = Tu(),
        Fh9 = AK4(),
        ph9 = k36(),
        Qh9 = SQ(),
        Uh9 = k36(),
        dh9 = (A) => {
            (0, Uh9.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, Qh9.resolveDefaultsModeConfig)(A),
                K = () => q().then(ph9.loadConfigsForDefaultMode),
                Y = (0, Fh9.getRuntimeConfig)(A);
            (0, sv8.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, E36.loadConfig)(sv8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? Bh9.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? qK4.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, KK4.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: xh9.default.version
                }),
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (_) => _.getIdentityProvider("aws.auth#sigv4") || (async (w) => await (0, qK4.defaultProvider)(w?.__config || {})()),
                    signer: new sv8.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (_) => _.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new uh9.NoAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, E36.loadConfig)(YK4.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, E36.loadConfig)(aX1.NODE_REGION_CONFIG_OPTIONS, {
                    ...aX1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: zK4.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, E36.loadConfig)({
                    ...YK4.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || gh9.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? mh9.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? zK4.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, E36.loadConfig)(aX1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, E36.loadConfig)(aX1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, E36.loadConfig)(KK4.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    _K4.getRuntimeConfig = dh9
})
// @from(Ln 229248, Col 4)
JK4 = x((oh9) => {
    var ch9 = xv8(),
        lh9 = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        ih9 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class $K4 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = ch9.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class HK4 {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class sX1 {
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
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new sX1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = nh9(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return sX1.clone(this)
        }
    }

    function nh9(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class jK4 {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function rh9(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    oh9.Field = $K4;
    oh9.Fields = HK4;
    oh9.HttpRequest = sX1;
    oh9.HttpResponse = jK4;
    oh9.getHttpHandlerExtensionConfiguration = lh9;
    oh9.isValidHostname = rh9;
    oh9.resolveHttpHandlerRuntimeConfig = ih9
})
// @from(Ln 229390, Col 4)
XK4 = x((MK4) => {
    Object.defineProperty(MK4, "__esModule", {
        value: !0
    });
    MK4.resolveHttpAuthRuntimeConfig = MK4.getHttpAuthExtensionConfiguration = void 0;
    var YS9 = (A) => {
        let {
            httpAuthSchemes: q,
            httpAuthSchemeProvider: K,
            credentials: Y
        } = A;
        return {
            setHttpAuthScheme(z) {
                let _ = q.findIndex((w) => w.schemeId === z.schemeId);
                if (_ === -1) q.push(z);
                else q.splice(_, 1, z)
            },
            httpAuthSchemes() {
                return q
            },
            setHttpAuthSchemeProvider(z) {
                K = z
            },
            httpAuthSchemeProvider() {
                return K
            },
            setCredentials(z) {
                Y = z
            },
            credentials() {
                return Y
            }
        }
    };
    MK4.getHttpAuthExtensionConfiguration = YS9;
    var zS9 = (A) => {
        return {
            httpAuthSchemes: A.httpAuthSchemes(),
            httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
            credentials: A.credentials()
        }
    };
    MK4.resolveHttpAuthRuntimeConfig = zS9
})
// @from(Ln 229434, Col 4)
vK4 = x((fK4) => {
    Object.defineProperty(fK4, "__esModule", {
        value: !0
    });
    fK4.resolveRuntimeExtensions = void 0;
    var PK4 = oS(),
        WK4 = JK4(),
        ZK4 = k36(),
        GK4 = XK4(),
        wS9 = (A, q) => {
            let K = Object.assign((0, PK4.getAwsRegionExtensionConfiguration)(A), (0, ZK4.getDefaultExtensionConfiguration)(A), (0, WK4.getHttpHandlerExtensionConfiguration)(A), (0, GK4.getHttpAuthExtensionConfiguration)(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, (0, PK4.resolveAwsRegionExtensionConfiguration)(K), (0, ZK4.resolveDefaultRuntimeConfig)(K), (0, WK4.resolveHttpHandlerRuntimeConfig)(K), (0, GK4.resolveHttpAuthRuntimeConfig)(K))
        };
    fK4.resolveRuntimeExtensions = wS9
})
// @from(Ln 229449, Col 4)
dv8 = x((ev8) => {
    Object.defineProperty(ev8, "__esModule", {
        value: !0
    });
    ev8.STSClient = ev8.__Client = void 0;
    var NK4 = PQ(),
        OS9 = WQ(),
        $S9 = ZQ(),
        VK4 = fu(),
        HS9 = Nj(),
        tv8 = w_(),
        jS9 = dO(),
        JS9 = VQ(),
        MS9 = rS(),
        kK4 = kP(),
        yK4 = k36();
    Object.defineProperty(ev8, "__Client", {
        enumerable: !0,
        get: function() {
            return yK4.Client
        }
    });
    var EK4 = Uv8(),
        DS9 = cv8(),
        XS9 = OK4(),
        PS9 = vK4();
    class LK4 extends yK4.Client {
        config;
        constructor(...[A]) {
            let q = (0, XS9.getRuntimeConfig)(A || {});
            super(q);
            this.initConfig = q;
            let K = (0, DS9.resolveClientEndpointParameters)(q),
                Y = (0, VK4.resolveUserAgentConfig)(K),
                z = (0, kK4.resolveRetryConfig)(Y),
                _ = (0, HS9.resolveRegionConfig)(z),
                w = (0, NK4.resolveHostHeaderConfig)(_),
                O = (0, MS9.resolveEndpointConfig)(w),
                $ = (0, EK4.resolveHttpAuthSchemeConfig)(O),
                H = (0, PS9.resolveRuntimeExtensions)($, A?.extensions || []);
            this.config = H, this.middlewareStack.use((0, jS9.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, VK4.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, kK4.getRetryPlugin)(this.config)), this.middlewareStack.use((0, JS9.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, NK4.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, OS9.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, $S9.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, tv8.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
                httpAuthSchemeParametersProvider: EK4.defaultSTSHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new tv8.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials
                })
            })), this.middlewareStack.use((0, tv8.getHttpSigningPlugin)(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    ev8.STSClient = LK4
})
// @from(Ln 229502, Col 4)
Y54 = x((tX1) => {
    var dF6 = dv8(),
        Bv = k36(),
        vI = rS(),
        NI = cv8(),
        Fk = dO(),
        AN8 = mT(),
        WS9 = oS(),
        gv = class A extends Bv.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        hK4 = class A extends gv {
            name = "ExpiredTokenException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ExpiredTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        SK4 = class A extends gv {
            name = "MalformedPolicyDocumentException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "MalformedPolicyDocumentException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        CK4 = class A extends gv {
            name = "PackedPolicyTooLargeException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "PackedPolicyTooLargeException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        IK4 = class A extends gv {
            name = "RegionDisabledException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "RegionDisabledException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        bK4 = class A extends gv {
            name = "IDPRejectedClaimException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "IDPRejectedClaimException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        xK4 = class A extends gv {
            name = "InvalidIdentityTokenException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidIdentityTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        uK4 = class A extends gv {
            name = "IDPCommunicationErrorException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "IDPCommunicationErrorException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        mK4 = class A extends gv {
            name = "InvalidAuthorizationMessageException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidAuthorizationMessageException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        BK4 = class A extends gv {
            name = "ExpiredTradeInTokenException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ExpiredTradeInTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        gK4 = class A extends gv {
            name = "JWTPayloadSizeExceededException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "JWTPayloadSizeExceededException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        FK4 = class A extends gv {
            name = "OutboundWebIdentityFederationDisabledException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "OutboundWebIdentityFederationDisabledException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        pK4 = class A extends gv {
            name = "SessionDurationEscalationException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "SessionDurationEscalationException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        qN8 = "Arn",
        QK4 = "AccessKeyId",
        ZS9 = "AssumedPrincipal",
        GS9 = "AssumeRole",
        fS9 = "AssumedRoleId",
        TS9 = "AssumeRoleRequest",
        vS9 = "AssumeRoleResponse",
        NS9 = "AssumeRootRequest",
        VS9 = "AssumeRootResponse",
        eX1 = "AssumedRoleUser",
        kS9 = "AssumeRoleWithSAML",
        ES9 = "AssumeRoleWithSAMLRequest",
        yS9 = "AssumeRoleWithSAMLResponse",
        LS9 = "AssumeRoleWithWebIdentity",
        RS9 = "AssumeRoleWithWebIdentityRequest",
        hS9 = "AssumeRoleWithWebIdentityResponse",
        SS9 = "AssumeRoot",
        UK4 = "Account",
        KN8 = "Audience",
        It = "Credentials",
        CS9 = "ContextAssertion",
        IS9 = "DecodeAuthorizationMessage",
        bS9 = "DecodeAuthorizationMessageRequest",
        xS9 = "DecodeAuthorizationMessageResponse",
        uS9 = "DecodedMessage",
        y36 = "DurationSeconds",
        dK4 = "Expiration",
        mS9 = "ExternalId",
        BS9 = "EncodedMessage",
        gS9 = "ExpiredTokenException",
        FS9 = "ExpiredTradeInTokenException",
        cK4 = "FederatedUser",
        pS9 = "FederatedUserId",
        QS9 = "GetAccessKeyInfo",
        US9 = "GetAccessKeyInfoRequest",
        dS9 = "GetAccessKeyInfoResponse",
        cS9 = "GetCallerIdentity",
        lS9 = "GetCallerIdentityRequest",
        iS9 = "GetCallerIdentityResponse",
        nS9 = "GetDelegatedAccessToken",
        rS9 = "GetDelegatedAccessTokenRequest",
        oS9 = "GetDelegatedAccessTokenResponse",
        aS9 = "GetFederationToken",
        sS9 = "GetFederationTokenRequest",
        tS9 = "GetFederationTokenResponse",
        eS9 = "GetSessionToken",
        AC9 = "GetSessionTokenRequest",
        qC9 = "GetSessionTokenResponse",
        KC9 = "GetWebIdentityToken",
        YC9 = "GetWebIdentityTokenRequest",
        zC9 = "GetWebIdentityTokenResponse",
        _C9 = "Issuer",
        wC9 = "InvalidAuthorizationMessageException",
        OC9 = "IDPCommunicationErrorException",
        $C9 = "IDPRejectedClaimException",
        HC9 = "InvalidIdentityTokenException",
        jC9 = "JWTPayloadSizeExceededException",
        JC9 = "Key",
        MC9 = "MalformedPolicyDocumentException",
        DC9 = "Name",
        XC9 = "NameQualifier",
        PC9 = "OutboundWebIdentityFederationDisabledException",
        AP1 = "Policy",
        qP1 = "PolicyArns",
        WC9 = "PrincipalArn",
        ZC9 = "ProviderArn",
        GC9 = "ProvidedContexts",
        fC9 = "ProvidedContextsListType",
        TC9 = "ProvidedContext",
        vC9 = "PolicyDescriptorType",
        NC9 = "ProviderId",
        cF6 = "PackedPolicySize",
        VC9 = "PackedPolicyTooLargeException",
        kC9 = "Provider",
        YN8 = "RoleArn",
        EC9 = "RegionDisabledException",
        lK4 = "RoleSessionName",
        yC9 = "Subject",
        LC9 = "SigningAlgorithm",
        RC9 = "SecretAccessKey",
        hC9 = "SAMLAssertion",
        SC9 = "SAMLAssertionType",
        CC9 = "SessionDurationEscalationException",
        IC9 = "SubjectFromWebIdentityToken",
        lF6 = "SourceIdentity",
        iK4 = "SerialNumber",
        bC9 = "SubjectType",
        xC9 = "SessionToken",
        zN8 = "Tags",
        nK4 = "TokenCode",
        uC9 = "TradeInToken",
        mC9 = "TargetPrincipal",
        BC9 = "TaskPolicyArn",
        gC9 = "TransitiveTagKeys",
        FC9 = "Tag",
        pC9 = "UserId",
        QC9 = "Value",
        rK4 = "WebIdentityToken",
        UC9 = "arn",
        dC9 = "accessKeySecretType",
        JR = "awsQueryError",
        MR = "client",
        cC9 = "clientTokenType",
        DR = "error",
        XR = "httpError",
        PR = "message",
        lC9 = "policyDescriptorListType",
        oK4 = "smithy.ts.sdk.synthetic.com.amazonaws.sts",
        iC9 = "tradeInTokenType",
        nC9 = "tagListType",
        rC9 = "webIdentityTokenType",
        X4 = "com.amazonaws.sts",
        oC9 = [0, X4, dC9, 8, 0],
        aC9 = [0, X4, cC9, 8, 0],
        sC9 = [0, X4, SC9, 8, 0],
        tC9 = [0, X4, iC9, 8, 0],
        eC9 = [0, X4, rC9, 8, 0],
        _N8 = [3, X4, eX1, 0, [fS9, qN8],
            [0, 0]
        ],
        AI9 = [3, X4, TS9, 0, [YN8, lK4, qP1, AP1, y36, zN8, gC9, mS9, iK4, nK4, lF6, GC9],
            [0, 0, () => KP1, 0, 1, () => wN8, 64, 0, 0, 0, 0, () => gI9]
        ],
        qI9 = [3, X4, vS9, 0, [It, eX1, cF6, lF6],
            [
                [() => L36, 0], () => _N8, 1, 0
            ]
        ],
        KI9 = [3, X4, ES9, 0, [YN8, WC9, hC9, qP1, AP1, y36],
            [0, 0, [() => sC9, 0], () => KP1, 0, 1]
        ],
        YI9 = [3, X4, yS9, 0, [It, eX1, cF6, yC9, bC9, _C9, KN8, XC9, lF6],
            [
                [() => L36, 0], () => _N8, 1, 0, 0, 0, 0, 0, 0
            ]
        ],
        zI9 = [3, X4, RS9, 0, [YN8, lK4, rK4, NC9, qP1, AP1, y36],
            [0, 0, [() => aC9, 0], 0, () => KP1, 0, 1]
        ],
        _I9 = [3, X4, hS9, 0, [It, IC9, eX1, cF6, kC9, KN8, lF6],
            [
                [() => L36, 0], 0, () => _N8, 1, 0, 0, 0
            ]
        ],
        wI9 = [3, X4, NS9, 0, [mC9, BC9, y36],
            [0, () => aK4, 1]
        ],
        OI9 = [3, X4, VS9, 0, [It, lF6],
            [
                [() => L36, 0], 0
            ]
        ],
        L36 = [3, X4, It, 0, [QK4, RC9, xC9, dK4],
            [0, [() => oC9, 0], 0, 4]
        ],
        $I9 = [3, X4, bS9, 0, [BS9],
            [0]
        ],
        HI9 = [3, X4, xS9, 0, [uS9],
            [0]
        ],
        jI9 = [-3, X4, gS9, {
                [DR]: MR,
                [XR]: 400,
                [JR]: ["ExpiredTokenException", 400]
            },
            [PR],
            [0]
        ];
    Fk.TypeRegistry.for(X4).registerError(jI9, hK4);
    var JI9 = [-3, X4, FS9, {
            [DR]: MR,
            [XR]: 400,
            [JR]: ["ExpiredTradeInTokenException", 400]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(JI9, BK4);
    var MI9 = [3, X4, cK4, 0, [pS9, qN8],
            [0, 0]
        ],
        DI9 = [3, X4, US9, 0, [QK4],
            [0]
        ],
        XI9 = [3, X4, dS9, 0, [UK4],
            [0]
        ],
        PI9 = [3, X4, lS9, 0, [],
            []
        ],
        WI9 = [3, X4, iS9, 0, [pC9, UK4, qN8],
            [0, 0, 0]
        ],
        ZI9 = [3, X4, rS9, 0, [uC9],
            [
                [() => tC9, 0]
            ]
        ],
        GI9 = [3, X4, oS9, 0, [It, cF6, ZS9],
            [
                [() => L36, 0], 1, 0
            ]
        ],
        fI9 = [3, X4, sS9, 0, [DC9, AP1, qP1, y36, zN8],
            [0, 0, () => KP1, 1, () => wN8]
        ],
        TI9 = [3, X4, tS9, 0, [It, cK4, cF6],
            [
                [() => L36, 0], () => MI9, 1
            ]
        ],
        vI9 = [3, X4, AC9, 0, [y36, iK4, nK4],
            [1, 0, 0]
        ],
        NI9 = [3, X4, qC9, 0, [It],
            [
                [() => L36, 0]
            ]
        ],
        VI9 = [3, X4, YC9, 0, [KN8, y36, LC9, zN8],
            [64, 1, 0, () => wN8]
        ],
        kI9 = [3, X4, zC9, 0, [rK4, dK4],
            [
                [() => eC9, 0], 4
            ]
        ],
        EI9 = [-3, X4, OC9, {
                [DR]: MR,
                [XR]: 400,
                [JR]: ["IDPCommunicationError", 400]
            },
            [PR],
            [0]
        ];
    Fk.TypeRegistry.for(X4).registerError(EI9, uK4);
    var yI9 = [-3, X4, $C9, {
            [DR]: MR,
            [XR]: 403,
            [JR]: ["IDPRejectedClaim", 403]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(yI9, bK4);
    var LI9 = [-3, X4, wC9, {
            [DR]: MR,
            [XR]: 400,
            [JR]: ["InvalidAuthorizationMessageException", 400]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(LI9, mK4);
    var RI9 = [-3, X4, HC9, {
            [DR]: MR,
            [XR]: 400,
            [JR]: ["InvalidIdentityToken", 400]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(RI9, xK4);
    var hI9 = [-3, X4, jC9, {
            [DR]: MR,
            [XR]: 400,
            [JR]: ["JWTPayloadSizeExceededException", 400]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(hI9, gK4);
    var SI9 = [-3, X4, MC9, {
            [DR]: MR,
            [XR]: 400,
            [JR]: ["MalformedPolicyDocument", 400]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(SI9, SK4);
    var CI9 = [-3, X4, PC9, {
            [DR]: MR,
            [XR]: 403,
            [JR]: ["OutboundWebIdentityFederationDisabledException", 403]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(CI9, FK4);
    var II9 = [-3, X4, VC9, {
            [DR]: MR,
            [XR]: 400,
            [JR]: ["PackedPolicyTooLarge", 400]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(II9, CK4);
    var aK4 = [3, X4, vC9, 0, [UC9],
            [0]
        ],
        bI9 = [3, X4, TC9, 0, [ZC9, CS9],
            [0, 0]
        ],
        xI9 = [-3, X4, EC9, {
                [DR]: MR,
                [XR]: 403,
                [JR]: ["RegionDisabledException", 403]
            },
            [PR],
            [0]
        ];
    Fk.TypeRegistry.for(X4).registerError(xI9, IK4);
    var uI9 = [-3, X4, CC9, {
            [DR]: MR,
            [XR]: 403,
            [JR]: ["SessionDurationEscalationException", 403]
        },
        [PR],
        [0]
    ];
    Fk.TypeRegistry.for(X4).registerError(uI9, pK4);
    var mI9 = [3, X4, FC9, 0, [JC9, QC9],
            [0, 0]
        ],
        BI9 = [-3, oK4, "STSServiceException", 0, [],
            []
        ];
    Fk.TypeRegistry.for(oK4).registerError(BI9, gv);
    var KP1 = [1, X4, lC9, 0, () => aK4],
        gI9 = [1, X4, fC9, 0, () => bI9],
        wN8 = [1, X4, nC9, 0, () => mI9],
        FI9 = [9, X4, GS9, 0, () => AI9, () => qI9],
        pI9 = [9, X4, kS9, 0, () => KI9, () => YI9],
        QI9 = [9, X4, LS9, 0, () => zI9, () => _I9],
        UI9 = [9, X4, SS9, 0, () => wI9, () => OI9],
        dI9 = [9, X4, IS9, 0, () => $I9, () => HI9],
        cI9 = [9, X4, QS9, 0, () => DI9, () => XI9],
        lI9 = [9, X4, cS9, 0, () => PI9, () => WI9],
        iI9 = [9, X4, nS9, 0, () => ZI9, () => GI9],
        nI9 = [9, X4, aS9, 0, () => fI9, () => TI9],
        rI9 = [9, X4, eS9, 0, () => vI9, () => NI9],
        oI9 = [9, X4, KC9, 0, () => VI9, () => kI9];
    class YP1 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(FI9).build() {}
    class ON8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithSAML", {}).n("STSClient", "AssumeRoleWithSAMLCommand").sc(pI9).build() {}
    class zP1 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(QI9).build() {}
    class $N8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoot", {}).n("STSClient", "AssumeRootCommand").sc(UI9).build() {}
    class HN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "DecodeAuthorizationMessage", {}).n("STSClient", "DecodeAuthorizationMessageCommand").sc(dI9).build() {}
    class jN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetAccessKeyInfo", {}).n("STSClient", "GetAccessKeyInfoCommand").sc(cI9).build() {}
    class JN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetCallerIdentity", {}).n("STSClient", "GetCallerIdentityCommand").sc(lI9).build() {}
    class MN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetDelegatedAccessToken", {}).n("STSClient", "GetDelegatedAccessTokenCommand").sc(iI9).build() {}
    class DN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetFederationToken", {}).n("STSClient", "GetFederationTokenCommand").sc(nI9).build() {}
    class XN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetSessionToken", {}).n("STSClient", "GetSessionTokenCommand").sc(rI9).build() {}
    class PN8 extends Bv.Command.classBuilder().ep(NI.commonParams).m(function(A, q, K, Y) {
        return [vI.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetWebIdentityToken", {}).n("STSClient", "GetWebIdentityTokenCommand").sc(oI9).build() {}
    var aI9 = {
        AssumeRoleCommand: YP1,
        AssumeRoleWithSAMLCommand: ON8,
        AssumeRoleWithWebIdentityCommand: zP1,
        AssumeRootCommand: $N8,
        DecodeAuthorizationMessageCommand: HN8,
        GetAccessKeyInfoCommand: jN8,
        GetCallerIdentityCommand: JN8,
        GetDelegatedAccessTokenCommand: MN8,
        GetFederationTokenCommand: DN8,
        GetSessionTokenCommand: XN8,
        GetWebIdentityTokenCommand: PN8
    };
    class WN8 extends dF6.STSClient {}
    Bv.createAggregatedClient(aI9, WN8);
    var sK4 = (A) => {
            if (typeof A?.Arn === "string") {
                let q = A.Arn.split(":");
                if (q.length > 4 && q[4] !== "") return q[4]
            }
            return
        },
        tK4 = async (A, q, K, Y = {}) => {
            let z = typeof A === "function" ? await A() : A,
                _ = typeof q === "function" ? await q() : q,
                w = await WS9.stsRegionDefaultResolver(Y)();
            return K?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${z} (credential provider clientConfig)`, `${_} (contextual client)`, `${w} (STS default: AWS_REGION, profile region, or us-east-1)`), z ?? _ ?? w
        }, sI9 = (A, q) => {
            let K, Y;
            return async (z, _) => {
                if (Y = z, !K) {
                    let {
                        logger: j = A?.parentClientConfig?.logger,
                        profile: J = A?.parentClientConfig?.profile,
                        region: M,
                        requestHandler: D = A?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: X,
                        userAgentAppId: P = A?.parentClientConfig?.userAgentAppId
                    } = A, W = await tK4(M, A?.parentClientConfig?.region, X, {
                        logger: j,
                        profile: J
                    }), Z = !eK4(D);
                    K = new q({
                        ...A,
                        userAgentAppId: P,
                        profile: J,
                        credentialDefaultProvider: () => async () => Y,
                        region: W,
                        requestHandler: Z ? D : void 0,
                        logger: j
                    })
                }
                let {
                    Credentials: w,
                    AssumedRoleUser: O
                } = await K.send(new YP1(_));
                if (!w || !w.AccessKeyId || !w.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${_.RoleArn}`);
                let $ = sK4(O),
                    H = {
                        accessKeyId: w.AccessKeyId,
                        secretAccessKey: w.SecretAccessKey,
                        sessionToken: w.SessionToken,
                        expiration: w.Expiration,
                        ...w.CredentialScope && {
                            credentialScope: w.CredentialScope
                        },
                        ...$ && {
                            accountId: $
                        }
                    };
                return AN8.setCredentialFeature(H, "CREDENTIALS_STS_ASSUME_ROLE", "i"), H
            }
        }, tI9 = (A, q) => {
            let K;
            return async (Y) => {
                if (!K) {
                    let {
                        logger: $ = A?.parentClientConfig?.logger,
                        profile: H = A?.parentClientConfig?.profile,
                        region: j,
                        requestHandler: J = A?.parentClientConfig?.requestHandler,
                        credentialProviderLogger: M,
                        userAgentAppId: D = A?.parentClientConfig?.userAgentAppId
                    } = A, X = await tK4(j, A?.parentClientConfig?.region, M, {
                        logger: $,
                        profile: H
                    }), P = !eK4(J);
                    K = new q({
                        ...A,
                        userAgentAppId: D,
                        profile: H,
                        region: X,
                        requestHandler: P ? J : void 0,
                        logger: $
                    })
                }
                let {
                    Credentials: z,
                    AssumedRoleUser: _
                } = await K.send(new zP1(Y));
                if (!z || !z.AccessKeyId || !z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${Y.RoleArn}`);
                let w = sK4(_),
                    O = {
                        accessKeyId: z.AccessKeyId,
                        secretAccessKey: z.SecretAccessKey,
                        sessionToken: z.SessionToken,
                        expiration: z.Expiration,
                        ...z.CredentialScope && {
                            credentialScope: z.CredentialScope
                        },
                        ...w && {
                            accountId: w
                        }
                    };
                if (w) AN8.setCredentialFeature(O, "RESOLVED_ACCOUNT_ID", "T");
                return AN8.setCredentialFeature(O, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), O
            }
        }, eK4 = (A) => {
            return A?.metadata?.handlerProtocol === "h2"
        }, A54 = (A, q) => {
            if (!q) return A;
            else return class extends A {
                constructor(Y) {
                    super(Y);
                    for (let z of q) this.middlewareStack.use(z)
                }
            }
        }, q54 = (A = {}, q) => sI9(A, A54(dF6.STSClient, q)), K54 = (A = {}, q) => tI9(A, A54(dF6.STSClient, q)), eI9 = (A) => (q) => A({
            roleAssumer: q54(q),
            roleAssumerWithWebIdentity: K54(q),
            ...q
        });
    Object.defineProperty(tX1, "$Command", {
        enumerable: !0,
        get: function() {
            return Bv.Command
        }
    });
    tX1.AssumeRoleCommand = YP1;
    tX1.AssumeRoleWithSAMLCommand = ON8;
    tX1.AssumeRoleWithWebIdentityCommand = zP1;
    tX1.AssumeRootCommand = $N8;
    tX1.DecodeAuthorizationMessageCommand = HN8;
    tX1.ExpiredTokenException = hK4;
    tX1.ExpiredTradeInTokenException = BK4;
    tX1.GetAccessKeyInfoCommand = jN8;
    tX1.GetCallerIdentityCommand = JN8;
    tX1.GetDelegatedAccessTokenCommand = MN8;
    tX1.GetFederationTokenCommand = DN8;
    tX1.GetSessionTokenCommand = XN8;
    tX1.GetWebIdentityTokenCommand = PN8;
    tX1.IDPCommunicationErrorException = uK4;
    tX1.IDPRejectedClaimException = bK4;
    tX1.InvalidAuthorizationMessageException = mK4;
    tX1.InvalidIdentityTokenException = xK4;
    tX1.JWTPayloadSizeExceededException = gK4;
    tX1.MalformedPolicyDocumentException = SK4;
    tX1.OutboundWebIdentityFederationDisabledException = FK4;
    tX1.PackedPolicyTooLargeException = CK4;
    tX1.RegionDisabledException = IK4;
    tX1.STS = WN8;
    tX1.STSServiceException = gv;
    tX1.SessionDurationEscalationException = pK4;
    tX1.decorateDefaultCredentialProvider = eI9;
    tX1.getDefaultRoleAssumer = q54;
    tX1.getDefaultRoleAssumerWithWebIdentity = K54;
    Object.keys(dF6).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(tX1, A)) Object.defineProperty(tX1, A, {
            enumerable: !0,
            get: function() {
                return dF6[A]
            }
        })
    })
})
// @from(Ln 230214, Col 0)
function z54(A) {
    return A?.name === "CredentialsProviderError"
}
// @from(Ln 230218, Col 0)
function _54(A) {
    if (!A || typeof A !== "object") return !1;
    let q = A;
    if (!q.Credentials || typeof q.Credentials !== "object") return !1;
    let K = q.Credentials;
    return typeof K.AccessKeyId === "string" && typeof K.SecretAccessKey === "string" && typeof K.SessionToken === "string" && K.AccessKeyId.length > 0 && K.SecretAccessKey.length > 0 && K.SessionToken.length > 0
}
// @from(Ln 230225, Col 0)
async function w54() {
    try {
        k("Clearing AWS credential provider cache");
        let {
            fromIni: A
        } = await Promise.resolve().then(() => t(EM8(), 1));
        await A({
            ignoreCache: !0
        })(), k("AWS credential provider cache refreshed")
    } catch (A) {
        k("Failed to clear AWS credential cache (this is expected if no credentials are configured)")
    }
}
// @from(Ln 230238, Col 4)
ZN8 = async () => {
    let {
        STSClient: A,
        GetCallerIdentityCommand: q
    } = await Promise.resolve().then(() => t(Y54(), 1));
    await new A().send(new q({}))
}
// @from(Ln 230245, Col 4)
GN8 = E(() => {
    H1()
})