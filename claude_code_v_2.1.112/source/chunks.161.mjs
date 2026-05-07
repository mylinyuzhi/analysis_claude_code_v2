
// @from(Ln 415852, Col 0)
function ul8(q) {
    if (!q) return;
    if ("scope" in q && typeof q.scope === "string") return q.scope;
    if ("default_scope" in q && typeof q.default_scope === "string") return q.default_scope;
    if (q.scopes_supported && Array.isArray(q.scopes_supported)) return q.scopes_supported.join(" ");
    return
}
// @from(Ln 415860, Col 0)
function uGY(q, K) {
    if (q !== null && q.split(" ").includes("offline_access")) return q;
    if (!K?.scopes_supported?.includes("offline_access")) return q;
    return q === null ? "offline_access" : `${q} offline_access`
}
// @from(Ln 415865, Col 4)
Cz7
// @from(Ln 415865, Col 9)
CGY = 30000
// @from(Ln 415866, Col 4)
Sz7 = 5
// @from(Ln 415867, Col 4)
bGY
// @from(Ln 415867, Col 9)
IGY
// @from(Ln 415867, Col 14)
Xu
// @from(Ln 415867, Col 18)
bl8
// @from(Ln 415867, Col 23)
Il8
// @from(Ln 415867, Col 28)
xl8
// @from(Ln 415868, Col 4)
me = L(() => {
    Ij6();
    cg1();
    Je6();
    CK();
    G16();
    z3();
    Nj();
    Q8();
    m8();
    U8();
    NK();
    _46();
    r76();
    e8();
    C8();
    Lz7();
    iD();
    ThK();
    e38();
    Cz7 = K6(Ez7(), 1), bGY = ["state", "nonce", "code_challenge", "code_verifier", "code"];
    IGY = new Set(["invalid_refresh_token", "expired_refresh_token", "token_expired"]);
    Xu = class Xu extends Error {
        constructor() {
            super("Authentication was cancelled");
            this.name = "AuthenticationCancelledError"
        }
    };
    bl8 = new Map, Il8 = new Map;
    xl8 = new Map
})
// @from(Ln 415900, Col 0)
function pGY() {
    return X7.isSSH() || S6(process.env.CLAUDE_CODE_REMOTE) || nK()
}
// @from(Ln 415904, Col 0)
function FGY(q) {
    if ("url" in q) return q.url;
    return
}
// @from(Ln 415909, Col 0)
function gGY(q) {
    try {
        let K = new URL(q).searchParams.get("redirect_uri");
        if (K) return K
    } catch {}
    return "http://localhost:<port>/callback"
}
// @from(Ln 415917, Col 0)
function xz7(q, K) {
    let _ = FGY(K),
        z = K.type ?? "stdio",
        Y = _ ? `${z} at ${_}` : z,
        A = `The \`${q}\` MCP server (${Y}) is installed but requires authentication. ` + "Call this tool to start the OAuth flow — you'll receive an authorization URL to share with the user. " + "Once the user completes authorization in their browser, the server's real tools will become available automatically.";
    return {
        name: tC(q, "authenticate"),
        isMcp: !0,
        mcpInfo: {
            serverName: q,
            toolName: "authenticate"
        },
        isEnabled: () => !0,
        isConcurrencySafe: () => !1,
        isReadOnly: () => !1,
        toAutoClassifierInput: () => q,
        userFacingName: () => `${q} - authenticate (MCP)`,
        maxResultSizeChars: 1e4,
        renderToolUseMessage: () => `Authenticate ${q} MCP server`,
        async description() {
            return A
        },
        async prompt() {
            return A
        },
        get inputSchema() {
            return mGY()
        },
        async checkPermissions(O) {
            return {
                behavior: "allow",
                updatedInput: O
            }
        },
        async call(O, w) {
            if (K.type === "claudeai-proxy") return {
                data: {
                    status: "unsupported",
                    message: `This is a claude.ai MCP connector. Ask the user to run /mcp and select "${q}" to authenticate.`
                }
            };
            if (K.type !== "sse" && K.type !== "http") return {
                data: {
                    status: "unsupported",
                    message: `Server "${q}" uses ${z} transport which does not support OAuth from this tool. Ask the user to run /mcp and authenticate manually.`
                }
            };
            let $ = K,
                j, H = new Promise((M) => {
                    j = M
                }),
                {
                    setAppState: J
                } = w,
                X = T_6(q, $, (M) => j?.(M), void 0, {
                    skipBrowserOpen: !0
                });
            pl8(q, X), X.then(async () => {
                Sp8();
                let M = await _g(q, K),
                    P = Zh(q);
                J((W) => ({
                    ...W,
                    mcp: {
                        ...W.mcp,
                        clients: W.mcp.clients.map((D) => D.name === q ? M.client : D),
                        tools: [...PG(W.mcp.tools, (D) => D.name?.startsWith(P)), ...M.tools],
                        commands: [...PG(W.mcp.commands, (D) => D.name?.startsWith(P)), ...M.commands],
                        resources: M.resources ? {
                            ...W.mcp.resources,
                            [q]: M.resources
                        } : W.mcp.resources
                    }
                })), i8(q, `OAuth complete, reconnected with ${M.tools.length} tool(s)`)
            }).catch((M) => {
                yz(q, `OAuth flow failed after tool-triggered start: ${b6(M)}`)
            });
            try {
                let M = await Promise.race([H, X.then(() => null)]);
                if (M) {
                    let P = tC(q, "complete_authentication"),
                        W = gGY(M),
                        D = pGY() ? `

This session is remote, so after authorizing the browser will try to load \`${W}?code=...\` and show a connection error — that's expected. Ask the user to copy the full URL from the browser's address bar and paste it into chat, then call \`${P}\` with that URL as \`callback_url\`.` : `

If the browser shows a connection error on the redirect page, ask the user to paste the full URL from the address bar and call \`${P}\` with it.`;
                    return {
                        data: {
                            status: "auth_url",
                            authUrl: M,
                            message: `Ask the user to open this URL in their browser to authorize the ${q} MCP server:

${M}

Once they complete the flow, the server's tools will become available automatically.${D}`
                        }
                    }
                }
                return {
                    data: {
                        status: "auth_url",
                        message: `Authentication completed silently for ${q}. The server's tools should now be available.`
                    }
                }
            } catch (M) {
                return {
                    data: {
                        status: "error",
                        message: `Failed to start OAuth flow for ${q}: ${b6(M)}. Ask the user to run /mcp and authenticate manually.`
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(O, w) {
            return {
                tool_use_id: w,
                type: "tool_result",
                content: O.message
            }
        }
    }
}
// @from(Ln 416041, Col 0)
function uz7(q) {
    let K = tC(q, "authenticate"),
        _ = `Complete an in-progress OAuth flow for the \`${q}\` MCP server by submitting the callback URL. Call \`${K}\` first to start the flow and get the authorization URL. ` + "After the user authorizes in their browser, the browser is redirected to a `http://localhost:<port>/callback?code=...&state=...` URL — " + "on remote sessions that page fails to load, but the URL in the address bar is still valid. Pass that full URL here as `callback_url`.";
    return {
        name: tC(q, "complete_authentication"),
        isMcp: !0,
        mcpInfo: {
            serverName: q,
            toolName: "complete_authentication"
        },
        isEnabled: () => !0,
        isConcurrencySafe: () => !1,
        isReadOnly: () => !1,
        toAutoClassifierInput: () => q,
        userFacingName: () => `${q} - complete authentication (MCP)`,
        maxResultSizeChars: 1e4,
        renderToolUseMessage: () => `Complete authentication for ${q} MCP server`,
        async description() {
            return _
        },
        async prompt() {
            return _
        },
        get inputSchema() {
            return BGY()
        },
        async checkPermissions(z) {
            return {
                behavior: "allow",
                updatedInput: z
            }
        },
        async call(z) {
            let {
                callback_url: Y
            } = z, A = Bl8(q);
            if (!A) return {
                data: {
                    status: "error",
                    message: `No OAuth flow is in progress for ${q}. Call \`${K}\` first, then retry with the callback URL.`
                }
            };
            let O = !1;
            try {
                let $ = new URL(Y);
                O = $.searchParams.has("code") || $.searchParams.has("error")
            } catch {}
            if (!O) return {
                data: {
                    status: "error",
                    message: "Invalid callback URL: missing authorization code. Ask the user to paste the full redirect URL from their browser's address bar, including the `?code=...&state=...` query string."
                }
            };
            let w = Fl8(q);
            A(Y);
            try {
                return await w, {
                    data: {
                        status: "success",
                        message: `Authentication complete for ${q}. The server's tools should now be available.`
                    }
                }
            } catch ($) {
                if ($ instanceof Xu) return {
                    data: {
                        status: "error",
                        message: `The OAuth flow for ${q} was cancelled (a newer attempt may have superseded it). Call \`${K}\` again to restart.`
                    }
                };
                return {
                    data: {
                        status: "error",
                        message: `Authentication failed for ${q}: ${b6($)}`
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(z, Y) {
            return {
                tool_use_id: Y,
                type: "tool_result",
                content: z.message
            }
        }
    }
}
// @from(Ln 416127, Col 4)
mGY
// @from(Ln 416127, Col 9)
BGY
// @from(Ln 416128, Col 4)
IhK = L(() => {
    Wl8();
    p7();
    y8();
    me();
    oW();
    fh();
    D_();
    Q8();
    m8();
    U8();
    mGY = C6(() => y.object({})), BGY = C6(() => y.object({
        callback_url: y.string().describe("The full callback URL from the browser address bar after authorizing, e.g. http://localhost:<port>/callback?code=...&state=...")
    }))
})
// @from(Ln 416144, Col 0)
function xhK(q) {
    let K = q.trim(),
        _ = K.split(/\s+/)[0]?.toLowerCase();
    if (!_) return;
    if (_ === "npx" || _ === "bunx") {
        let z = K.split(/\s+/)[1]?.toLowerCase();
        if (z && z in mz7) return mz7[z]
    }
    return mz7[_]
}
// @from(Ln 416155, Col 0)
function uhK(q) {
    for (let {
            pattern: K,
            tool: _
        }
        of UGY)
        if (K.test(q)) return _;
    return
}
// @from(Ln 416164, Col 4)
mz7
// @from(Ln 416164, Col 9)
UGY
// @from(Ln 416165, Col 4)
Bz7 = L(() => {
    mz7 = {
        src: "sourcegraph",
        cody: "cody",
        aider: "aider",
        tabby: "tabby",
        tabnine: "tabnine",
        augment: "augment",
        pieces: "pieces",
        qodo: "qodo",
        aide: "aide",
        hound: "hound",
        seagoat: "seagoat",
        bloop: "bloop",
        gitloop: "gitloop",
        q: "amazon-q",
        gemini: "gemini"
    }, UGY = [{
        pattern: /^sourcegraph$/i,
        tool: "sourcegraph"
    }, {
        pattern: /^cody$/i,
        tool: "cody"
    }, {
        pattern: /^openctx$/i,
        tool: "openctx"
    }, {
        pattern: /^aider$/i,
        tool: "aider"
    }, {
        pattern: /^continue$/i,
        tool: "continue"
    }, {
        pattern: /^github[-_]?copilot$/i,
        tool: "github-copilot"
    }, {
        pattern: /^copilot$/i,
        tool: "github-copilot"
    }, {
        pattern: /^cursor$/i,
        tool: "cursor"
    }, {
        pattern: /^tabby$/i,
        tool: "tabby"
    }, {
        pattern: /^codeium$/i,
        tool: "codeium"
    }, {
        pattern: /^tabnine$/i,
        tool: "tabnine"
    }, {
        pattern: /^augment[-_]?code$/i,
        tool: "augment"
    }, {
        pattern: /^augment$/i,
        tool: "augment"
    }, {
        pattern: /^windsurf$/i,
        tool: "windsurf"
    }, {
        pattern: /^aide$/i,
        tool: "aide"
    }, {
        pattern: /^codestory$/i,
        tool: "aide"
    }, {
        pattern: /^pieces$/i,
        tool: "pieces"
    }, {
        pattern: /^qodo$/i,
        tool: "qodo"
    }, {
        pattern: /^amazon[-_]?q$/i,
        tool: "amazon-q"
    }, {
        pattern: /^gemini[-_]?code[-_]?assist$/i,
        tool: "gemini"
    }, {
        pattern: /^gemini$/i,
        tool: "gemini"
    }, {
        pattern: /^hound$/i,
        tool: "hound"
    }, {
        pattern: /^seagoat$/i,
        tool: "seagoat"
    }, {
        pattern: /^bloop$/i,
        tool: "bloop"
    }, {
        pattern: /^gitloop$/i,
        tool: "gitloop"
    }, {
        pattern: /^claude[-_]?context$/i,
        tool: "claude-context"
    }, {
        pattern: /^code[-_]?index[-_]?mcp$/i,
        tool: "code-index-mcp"
    }, {
        pattern: /^code[-_]?index$/i,
        tool: "code-index-mcp"
    }, {
        pattern: /^local[-_]?code[-_]?search$/i,
        tool: "local-code-search"
    }, {
        pattern: /^codebase$/i,
        tool: "autodev-codebase"
    }, {
        pattern: /^autodev[-_]?codebase$/i,
        tool: "autodev-codebase"
    }, {
        pattern: /^code[-_]?context$/i,
        tool: "claude-context"
    }]
})
// @from(Ln 416280, Col 0)
class Ql8 {
    ws;
    started = !1;
    opened;
    isBun = typeof Bun < "u";
    constructor(q) {
        this.ws = q;
        if (this.opened = new Promise((K, _) => {
                if (this.ws.readyState === Ul8) K();
                else if (this.isBun) {
                    let z = this.ws,
                        Y = () => {
                            z.removeEventListener("open", Y), z.removeEventListener("error", A), K()
                        },
                        A = (O) => {
                            z.removeEventListener("open", Y), z.removeEventListener("error", A), j1("error", "mcp_websocket_connect_fail"), _(O)
                        };
                    z.addEventListener("open", Y), z.addEventListener("error", A)
                } else {
                    let z = this.ws;
                    z.on("open", () => {
                        K()
                    }), z.on("error", (Y) => {
                        j1("error", "mcp_websocket_connect_fail"), _(Y)
                    })
                }
            }), this.isBun) {
            let K = this.ws;
            K.addEventListener("message", this.onBunMessage), K.addEventListener("error", this.onBunError), K.addEventListener("close", this.onBunClose)
        } else {
            let K = this.ws;
            K.on("message", this.onNodeMessage), K.on("error", this.onNodeError), K.on("close", this.onNodeClose)
        }
    }
    onclose;
    onerror;
    onmessage;
    onBunMessage = (q) => {
        try {
            let K = typeof q.data === "string" ? q.data : String(q.data),
                _ = n8(K),
                z = Pm.parse(_);
            this.onmessage?.(z)
        } catch (K) {
            this.handleError(K)
        }
    };
    onBunError = () => {
        this.handleError(Error("WebSocket error"))
    };
    onBunClose = () => {
        this.handleCloseCleanup()
    };
    onNodeMessage = (q) => {
        try {
            let K = n8(q.toString("utf-8")),
                _ = Pm.parse(K);
            this.onmessage?.(_)
        } catch (K) {
            this.handleError(K)
        }
    };
    onNodeError = (q) => {
        this.handleError(q)
    };
    onNodeClose = () => {
        this.handleCloseCleanup()
    };
    handleError(q) {
        j1("error", "mcp_websocket_message_fail"), this.onerror?.(r1(q))
    }
    handleCloseCleanup() {
        if (this.onclose?.(), this.isBun) {
            let q = this.ws;
            q.removeEventListener("message", this.onBunMessage), q.removeEventListener("error", this.onBunError), q.removeEventListener("close", this.onBunClose)
        } else {
            let q = this.ws;
            q.off("message", this.onNodeMessage), q.off("error", this.onNodeError), q.off("close", this.onNodeClose)
        }
    }
    async start() {
        if (this.started) throw Error("Start can only be called once per transport.");
        if (await this.opened, this.ws.readyState !== Ul8) throw j1("error", "mcp_websocket_start_not_opened"), Error("WebSocket is not open. Cannot start transport.");
        this.started = !0
    }
    async close() {
        if (this.ws.readyState === Ul8 || this.ws.readyState === QGY) this.ws.close();
        this.handleCloseCleanup()
    }
    async send(q) {
        if (this.ws.readyState !== Ul8) throw j1("error", "mcp_websocket_send_not_opened"), Error("WebSocket is not open. Cannot send message.");
        let K = I6(q);
        try {
            if (this.isBun) this.ws.send(K);
            else await new Promise((_, z) => {
                this.ws.send(K, (Y) => {
                    if (Y) z(Y);
                    else _()
                })
            })
        } catch (_) {
            throw this.handleError(_), _
        }
    }
}
// @from(Ln 416385, Col 4)
QGY = 0
// @from(Ln 416386, Col 4)
Ul8 = 1
// @from(Ln 416387, Col 4)
mhK = L(() => {
    _P();
    VA();
    m8();
    e8()
})
// @from(Ln 416394, Col 0)
function pz7(q) {
    let K = q,
        _ = "",
        z = 0,
        Y = 10;
    while (K !== _ && z < Y) _ = K, K = K.normalize("NFKC"), K = K.replace(/[\p{Cf}\p{Co}\p{Cn}]/gu, ""), K = K.replace(/[\u200B-\u200F]/g, "").replace(/[\u202A-\u202E]/g, "").replace(/[\u2066-\u2069]/g, "").replace(/[\uFEFF]/g, "").replace(/[\uE000-\uF8FF]/g, ""), z++;
    if (z >= Y) throw Error(`Unicode sanitization reached maximum iterations (${Y}) for input: ${q.slice(0,100)}`);
    return K
}
// @from(Ln 416404, Col 0)
function iI6(q) {
    if (typeof q === "string") return pz7(q);
    if (Array.isArray(q)) return q.map(iI6);
    if (q !== null && typeof q === "object") {
        let K = {};
        for (let [_, z] of Object.entries(q)) K[iI6(_)] = iI6(z);
        return K
    }
    return q
}
// @from(Ln 416415, Col 0)
function dGY(q) {
    return q.mode === "url" ? "url" : "form"
}
// @from(Ln 416419, Col 0)
function cGY(q, K, _) {
    return q.findIndex((z) => z.serverName === K && z.params.mode === "url" && ("elicitationId" in z.params) && z.params.elicitationId === _)
}
// @from(Ln 416423, Col 0)
function BhK(q, K, _) {
    try {
        q.setRequestHandler($r, async (z, Y) => {
            i8(K, `Received elicitation request: ${I6(z)}`);
            let A = dGY(z.params);
            d("tengu_mcp_elicitation_shown", {
                mode: A
            });
            try {
                let O = await Y98(K, z.params, Y.signal);
                if (O) return i8(K, `Elicitation resolved by hook: ${I6(O)}`), d("tengu_mcp_elicitation_response", {
                    mode: A,
                    action: O.action
                }), O;
                let w = A === "url" && "elicitationId" in z.params ? z.params.elicitationId : void 0,
                    j = await new Promise((J) => {
                        let X = () => {
                            J({
                                action: "cancel"
                            })
                        };
                        if (Y.signal.aborted) {
                            X();
                            return
                        }
                        let M = w ? {
                            actionLabel: "Skip confirmation"
                        } : void 0;
                        _((P) => ({
                            ...P,
                            elicitation: {
                                queue: [...P.elicitation.queue, {
                                    serverName: K,
                                    requestId: Y.requestId,
                                    params: z.params,
                                    signal: Y.signal,
                                    waitingState: M,
                                    respond: (W) => {
                                        Y.signal.removeEventListener("abort", X), d("tengu_mcp_elicitation_response", {
                                            mode: A,
                                            action: W.action
                                        }), J(W)
                                    }
                                }]
                            }
                        })), Y.signal.addEventListener("abort", X, {
                            once: !0
                        })
                    });
                return i8(K, `Elicitation response: ${I6(j)}`), await A98(K, j, Y.signal, A, w)
            } catch (O) {
                return yz(K, `Elicitation error: ${O}`), {
                    action: "cancel"
                }
            }
        }), q.setNotificationHandler(mg6, (z) => {
            let {
                elicitationId: Y
            } = z.params;
            i8(K, `Received elicitation completion notification: ${Y}`), lx({
                message: `MCP server "${K}" confirmed elicitation ${Y} complete`,
                notificationType: "elicitation_complete"
            });
            let A = !1;
            if (_((O) => {
                    let w = cGY(O.elicitation.queue, K, Y);
                    if (w === -1) return O;
                    A = !0;
                    let $ = [...O.elicitation.queue];
                    return $[w] = {
                        ...$[w],
                        completed: !0
                    }, {
                        ...O,
                        elicitation: {
                            queue: $
                        }
                    }
                }), !A) i8(K, `Ignoring completion notification for unknown elicitation: ${Y}`)
        })
    } catch {
        return
    }
}
// @from(Ln 416507, Col 0)
async function Y98(q, K, _) {
    try {
        let z = K.mode === "url" ? "url" : "form",
            Y = "url" in K ? K.url : void 0,
            A = "elicitationId" in K ? K.elicitationId : void 0,
            {
                elicitationResponse: O,
                blockingError: w
            } = await O98({
                serverName: q,
                message: K.message,
                requestedSchema: "requestedSchema" in K ? K.requestedSchema : void 0,
                signal: _,
                mode: z,
                url: Y,
                elicitationId: A
            });
        if (w) return {
            action: "decline"
        };
        if (O) return {
            action: O.action,
            content: O.content
        };
        return
    } catch (z) {
        yz(q, `Elicitation hook error: ${z}`);
        return
    }
}
// @from(Ln 416537, Col 0)
async function A98(q, K, _, z, Y) {
    try {
        let {
            elicitationResultResponse: A,
            blockingError: O
        } = await w98({
            serverName: q,
            action: K.action,
            content: K.content,
            signal: _,
            mode: z,
            elicitationId: Y
        });
        if (O) return lx({
            message: `Elicitation response for server "${q}": decline`,
            notificationType: "elicitation_response"
        }), {
            action: "decline"
        };
        let w = A ? {
            action: A.action,
            content: A.content ?? K.content
        } : K;
        return lx({
            message: `Elicitation response for server "${q}": ${w.action}`,
            notificationType: "elicitation_response"
        }), w
    } catch (A) {
        return yz(q, `ElicitationResult hook error: ${A}`), lx({
            message: `Elicitation response for server "${q}": ${K.action}`,
            notificationType: "elicitation_response"
        }), K
    }
}
// @from(Ln 416571, Col 4)
dl8 = L(() => {
    _P();
    K9();
    U8();
    e8();
    C8()
})
// @from(Ln 416579, Col 0)
function phK(q) {
    return nGY.has(q)
}
// @from(Ln 416583, Col 0)
function iGY(q) {
    let K = q.channel_id ?? q.channel;
    if (typeof K !== "string" || !K) return null;
    let _ = K.replace(/^#/, ""),
        z = `#${_}`,
        Y = lGY.test(_) ? `https://slack.com/app_redirect?channel=${_}` : null;
    return {
        label: z,
        url: Y
    }
}
// @from(Ln 416595, Col 0)
function FhK() {
    return {
        userFacingName() {
            return "Slacked"
        },
        renderToolUseMessage(q, {
            verbose: K
        }) {
            if (!K) return "";
            return Object.entries(q).map(([_, z]) => `${_}: ${I6(z)}`).join(", ")
        },
        renderToolUseTag(q) {
            let K = iGY(q);
            if (K === null) return null;
            return $98.createElement(u, {
                flexWrap: "nowrap",
                marginLeft: 1
            }, $98.createElement(v5, null, K.url && Vf() ? qc(K.url, K.label) : K.label))
        }
    }
}
// @from(Ln 416616, Col 4)
$98
// @from(Ln 416616, Col 9)
lGY
// @from(Ln 416616, Col 14)
nGY
// @from(Ln 416617, Col 4)
ghK = L(() => {
    vd();
    g6();
    De6();
    e8();
    $98 = K6(P6(), 1), lGY = /^[CDG][A-Z0-9]{6,}$/, nGY = new Set(["slack_send_message", "slack_post_message"])
})
// @from(Ln 416625, Col 0)
function rGY(q) {
    return q.scope === "project" || q.scope === "local"
}
// @from(Ln 416628, Col 0)
async function oGY(q, K) {
    if (!K.headersHelper) return null;
    if ("scope" in K && rGY(K) && !I7()) {
        if (!EA()) {
            let z = Error(`Security: headersHelper for MCP server '${q}' executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.FEEDBACK_CHANNEL}.`);
            return Kh("MCP headersHelper invoked before trust check", z), d("tengu_mcp_headersHelper_missing_trust", {}), null
        }
    }
    try {
        i8(q, "Executing headersHelper to get dynamic headers");
        let _ = await M7(K.headersHelper, [], {
            shell: !0,
            timeout: 1e4,
            env: {
                ...process.env,
                CLAUDE_CODE_MCP_SERVER_NAME: q,
                CLAUDE_CODE_MCP_SERVER_URL: K.url
            }
        });
        if (_.code !== 0 || !_.stdout) throw Error(`headersHelper for MCP server '${q}' did not return a valid value`);
        let z = _.stdout.trim(),
            Y = n8(z);
        if (typeof Y !== "object" || Y === null || Array.isArray(Y)) throw Error(`headersHelper for MCP server '${q}' must return a JSON object with string key-value pairs`);
        for (let [A, O] of Object.entries(Y))
            if (typeof O !== "string") throw Error(`headersHelper for MCP server '${q}' returned non-string value for key "${A}": ${typeof O}`);
        return i8(q, `Successfully retrieved ${Object.keys(Y).length} headers from headersHelper`), Y
    } catch (_) {
        return yz(q, `Error getting headers from headersHelper: ${b6(_)}`), j6(Error(`Error getting MCP headers from headersHelper for server '${q}': ${b6(_)}`)), null
    }
}
// @from(Ln 416658, Col 0)
async function cl8(q, K) {
    let _ = K.headers || {},
        z = await oGY(q, K) || {};
    return {
        ..._,
        ...z
    }
}
// @from(Ln 416666, Col 4)
UhK = L(() => {
    y8();
    h1();
    K8();
    m8();
    Q4();
    U8();
    e8();
    C8()
})
// @from(Ln 416676, Col 0)
class Fz7 {
    serverName;
    sendMcpMessage;
    isClosed = !1;
    onclose;
    onerror;
    onmessage;
    constructor(q, K) {
        this.serverName = q;
        this.sendMcpMessage = K
    }
    async start() {}
    async send(q) {
        if (this.isClosed) throw Error("Transport is closed");
        let K = await this.sendMcpMessage(this.serverName, q);
        if (this.onmessage) this.onmessage(K)
    }
    async close() {
        if (this.isClosed) return;
        this.isClosed = !0, this.onclose?.()
    }
}
// @from(Ln 416698, Col 4)
dhK = {}
// @from(Ln 416704, Col 0)
function sGY(q, K, _) {
    let z = q.tabId;
    if (typeof z === "number") _C4(z);
    let Y = [];
    switch (K) {
        case "navigate":
            if (typeof q.url === "string") try {
                let A = new URL(q.url);
                Y.push(A.hostname)
            } catch {
                Y.push(j4(q.url, 30))
            }
            break;
        case "find":
            if (typeof q.query === "string") Y.push(`pattern: ${j4(q.query,30)}`);
            break;
        case "computer":
            if (typeof q.action === "string") {
                let A = q.action;
                if (A === "left_click" || A === "right_click" || A === "double_click" || A === "middle_click")
                    if (typeof q.ref === "string") Y.push(`${A} on ${q.ref}`);
                    else if (Array.isArray(q.coordinate)) Y.push(`${A} at (${q.coordinate.join(", ")})`);
                else Y.push(A);
                else if (A === "type" && typeof q.text === "string") Y.push(`type "${j4(q.text,15)}"`);
                else if (A === "key" && typeof q.text === "string") Y.push(`key ${q.text}`);
                else if (A === "scroll" && typeof q.scroll_direction === "string") Y.push(`scroll ${q.scroll_direction}`);
                else if (A === "wait" && typeof q.duration === "number") Y.push(`wait ${q.duration}s`);
                else if (A === "left_click_drag") Y.push("drag");
                else Y.push(A)
            }
            break;
        case "gif_creator":
            if (typeof q.action === "string") Y.push(`${q.action}`);
            break;
        case "resize_window":
            if (typeof q.width === "number" && typeof q.height === "number") Y.push(`${q.width}x${q.height}`);
            break;
        case "read_console_messages":
            if (typeof q.pattern === "string") Y.push(`pattern: ${j4(q.pattern,20)}`);
            if (q.onlyErrors === !0) Y.push("errors only");
            break;
        case "read_network_requests":
            if (typeof q.urlPattern === "string") Y.push(`pattern: ${j4(q.urlPattern,20)}`);
            break;
        case "shortcuts_execute":
            if (typeof q.shortcutId === "string") Y.push(`shortcut_id: ${q.shortcutId}`);
            break;
        case "javascript_tool":
            if (_ && typeof q.text === "string") return q.text;
            return "";
        case "tabs_create_mcp":
        case "tabs_context_mcp":
        case "form_input":
        case "shortcuts_list":
        case "read_page":
        case "upload_image":
        case "get_page_text":
        case "update_plan":
            return ""
    }
    return Y.join(", ") || null
}
// @from(Ln 416767, Col 0)
function tGY(q) {
    if (!Vf()) return null;
    if (typeof q !== "object" || q === null || !("tabId" in q)) return null;
    let K = typeof q.tabId === "number" ? q.tabId : typeof q.tabId === "string" ? parseInt(q.tabId, 10) : NaN;
    if (isNaN(K)) return null;
    let _ = `${aGY}${K}`;
    return zg.createElement(T, null, " ", zg.createElement(yq, {
        url: _
    }, zg.createElement(T, {
        color: "subtle"
    }, "[View Tab]")))
}
// @from(Ln 416780, Col 0)
function QhK(q, K, _) {
    if (_) return Xl8(q, [], {
        verbose: _
    });
    let z = null;
    switch (K) {
        case "navigate":
            z = "Navigation completed";
            break;
        case "tabs_create_mcp":
            z = "Tab created";
            break;
        case "tabs_context_mcp":
            z = "Tabs read";
            break;
        case "form_input":
            z = "Input completed";
            break;
        case "computer":
            z = "Action completed";
            break;
        case "resize_window":
            z = "Window resized";
            break;
        case "find":
            z = "Search completed";
            break;
        case "gif_creator":
            z = "GIF action completed";
            break;
        case "read_console_messages":
            z = "Console messages retrieved";
            break;
        case "read_network_requests":
            z = "Network requests retrieved";
            break;
        case "shortcuts_list":
            z = "Shortcuts retrieved";
            break;
        case "shortcuts_execute":
            z = "Shortcut executed";
            break;
        case "javascript_tool":
            z = "Script executed";
            break;
        case "read_page":
            z = "Page read";
            break;
        case "upload_image":
            z = "Image uploaded";
            break;
        case "get_page_text":
            z = "Page text retrieved";
            break;
        case "update_plan":
            z = "Plan updated";
            break
    }
    if (z) return zg.createElement(_1, {
        height: 1
    }, zg.createElement(T, {
        dimColor: !0
    }, z));
    return null
}
// @from(Ln 416846, Col 0)
function eGY(q) {
    return {
        userFacingName(K) {
            return `Claude in Chrome[${q.replace(/_mcp$/,"")}]`
        },
        renderToolUseMessage(K, {
            verbose: _
        }) {
            return sGY(K, q, _)
        },
        renderToolUseTag(K) {
            return tGY(K)
        },
        renderToolResultMessage(K, _, {
            verbose: z
        }) {
            if (!qvY(K)) return null;
            return QhK(K, q, z)
        }
    }
}
// @from(Ln 416868, Col 0)
function qvY(q) {
    return typeof q === "object" && q !== null
}
// @from(Ln 416871, Col 4)
zg
// @from(Ln 416871, Col 8)
aGY = "https://clau.de/chrome/tab/"
// @from(Ln 416872, Col 4)
chK = L(() => {
    GK();
    vd();
    g6();
    Dz7();
    c7();
    ip();
    zg = K6(P6(), 1)
})
// @from(Ln 416882, Col 0)
function ihK(q) {
    let K = s(3),
        {
            request: _,
            onDone: z
        } = q,
        Y;
    if (K[0] !== z || K[1] !== _) Y = _.tccState ? L5.createElement(KvY, {
        tccState: _.tccState,
        onDone: () => z(nhK)
    }) : L5.createElement(zvY, {
        request: _,
        onDone: z
    }), K[0] = z, K[1] = _, K[2] = Y;
    else Y = K[2];
    return Y
}
// @from(Ln 416900, Col 0)
function KvY(q) {
    let K = s(26),
        {
            tccState: _,
            onDone: z
        } = q,
        Y;
    if (K[0] !== _.accessibility || K[1] !== _.screenRecording) {
        if (Y = [], !_.accessibility) {
            let G;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) G = {
                label: "Open System Settings → Accessibility",
                value: "open_accessibility"
            }, K[3] = G;
            else G = K[3];
            Y.push(G)
        }
        if (!_.screenRecording) {
            let G;
            if (K[4] === Symbol.for("react.memo_cache_sentinel")) G = {
                label: "Open System Settings → Screen Recording",
                value: "open_screen_recording"
            }, K[4] = G;
            else G = K[4];
            Y.push(G)
        }
        let Z;
        if (K[5] === Symbol.for("react.memo_cache_sentinel")) Z = {
            label: "Try again",
            value: "retry"
        }, K[5] = Z;
        else Z = K[5];
        Y.push(Z), K[0] = _.accessibility, K[1] = _.screenRecording, K[2] = Y
    } else Y = K[2];
    let A = Y,
        O;
    if (K[6] !== z) O = function(G) {
        let f = oR();
        switch (G) {
            case "open_accessibility": {
                f.tcc.requestAccessibility(), w1("open", ["x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"], {
                    useCwd: !1
                });
                return
            }
            case "open_screen_recording": {
                f.tcc.requestScreenRecording(), w1("open", ["x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"], {
                    useCwd: !1
                });
                return
            }
            case "retry": {
                z();
                return
            }
        }
    }, K[6] = z, K[7] = O;
    else O = K[7];
    let w = O,
        $ = _.accessibility ? `${e6.tick} granted` : `${e6.cross} not granted`,
        j;
    if (K[8] !== $) j = L5.createElement(T, null, "Accessibility:", " ", $), K[8] = $, K[9] = j;
    else j = K[9];
    let H = _.screenRecording ? `${e6.tick} granted` : `${e6.cross} not granted`,
        J;
    if (K[10] !== H) J = L5.createElement(T, null, "Screen Recording:", " ", H), K[10] = H, K[11] = J;
    else J = K[11];
    let X;
    if (K[12] !== j || K[13] !== J) X = L5.createElement(u, {
        flexDirection: "column"
    }, j, J), K[12] = j, K[13] = J, K[14] = X;
    else X = K[14];
    let M;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) M = L5.createElement(T, {
        dimColor: !0
    }, 'Grant the missing permissions in System Settings, then select "Try again". macOS may require you to restart Claude Code after granting Screen Recording.'), K[15] = M;
    else M = K[15];
    let P;
    if (K[16] !== w || K[17] !== z || K[18] !== A) P = L5.createElement(A1, {
        options: A,
        onChange: w,
        onCancel: z
    }), K[16] = w, K[17] = z, K[18] = A, K[19] = P;
    else P = K[19];
    let W;
    if (K[20] !== X || K[21] !== P) W = L5.createElement(u, {
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1,
        gap: 1
    }, X, M, P), K[20] = X, K[21] = P, K[22] = W;
    else W = K[22];
    let D;
    if (K[23] !== z || K[24] !== W) D = L5.createElement(R1, {
        title: "Computer Use needs macOS permissions",
        onCancel: z
    }, W), K[23] = z, K[24] = W, K[25] = D;
    else D = K[25];
    return D
}
// @from(Ln 417001, Col 0)
function zvY(q) {
    let K = s(48),
        {
            request: _,
            onDone: z
        } = q,
        Y;
    if (K[0] !== _.apps) Y = () => new Set(_.apps.flatMap(wvY)), K[0] = _.apps, K[1] = Y;
    else Y = K[1];
    let [A] = lhK.useState(Y), O;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) O = ["clipboardRead", "clipboardWrite", "systemKeyCombos"], K[2] = O;
    else O = K[2];
    let w = O,
        $;
    if (K[3] !== _.requestedFlags) $ = w.filter((S) => _.requestedFlags[S]), K[3] = _.requestedFlags, K[4] = $;
    else $ = K[4];
    let j = $,
        H = A.size,
        J;
    if (K[5] !== A.size) J = O7(A.size, "app"), K[5] = A.size, K[6] = J;
    else J = K[6];
    let X = `Allow for this session (${H} ${J})`,
        M;
    if (K[7] !== X) M = {
        label: X,
        value: "allow_all"
    }, K[7] = X, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) P = {
        label: L5.createElement(T, null, "Deny, and tell Claude what to do differently ", L5.createElement(T, {
            bold: !0
        }, "(esc)")),
        value: "deny"
    }, K[9] = P;
    else P = K[9];
    let W;
    if (K[10] !== M) W = [M, P], K[10] = M, K[11] = W;
    else W = K[11];
    let D = W,
        Z;
    if (K[12] !== A || K[13] !== z || K[14] !== _.apps || K[15] !== j) Z = function(F) {
        if (!F) {
            z(nhK);
            return
        }
        let U = Date.now(),
            g = _.apps.flatMap((l) => l.resolved && A.has(l.resolved.bundleId) ? [{
                bundleId: l.resolved.bundleId,
                displayName: l.resolved.displayName,
                grantedAt: U
            }] : []),
            c = _.apps.filter((l) => !l.resolved || !A.has(l.resolved.bundleId)).map(OvY),
            n = {
                ...ac,
                ...Object.fromEntries(j.map(AvY))
            };
        z({
            granted: g,
            denied: c,
            flags: n
        })
    }, K[12] = A, K[13] = z, K[14] = _.apps, K[15] = j, K[16] = Z;
    else Z = K[16];
    let G = Z,
        f;
    if (K[17] !== G) f = () => G(!1), K[17] = G, K[18] = f;
    else f = K[18];
    let v;
    if (K[19] !== _.reason) v = _.reason ? L5.createElement(T, {
        dimColor: !0
    }, _.reason) : null, K[19] = _.reason, K[20] = v;
    else v = K[20];
    let V;
    if (K[21] !== A || K[22] !== _.apps) {
        let S;
        if (K[24] !== A) S = (F) => {
            let U = F.resolved;
            if (!U) return L5.createElement(T, {
                key: F.requestedName,
                dimColor: !0
            }, "  ", e6.circle, " ", F.requestedName, " ", L5.createElement(T, {
                dimColor: !0
            }, "(not installed)"));
            if (F.alreadyGranted) return L5.createElement(T, {
                key: U.bundleId,
                dimColor: !0
            }, "  ", e6.tick, " ", U.displayName, " ", L5.createElement(T, {
                dimColor: !0
            }, "(already granted)"));
            let g = hx4(U.bundleId),
                c = A.has(U.bundleId);
            return L5.createElement(u, {
                key: U.bundleId,
                flexDirection: "column"
            }, L5.createElement(T, null, "  ", c ? e6.circleFilled : e6.circle, " ", U.displayName), g ? L5.createElement(T, {
                bold: !0
            }, "    ", e6.warning, " ", _vY[g]) : null)
        }, K[24] = A, K[25] = S;
        else S = K[25];
        V = _.apps.map(S), K[21] = A, K[22] = _.apps, K[23] = V
    } else V = K[23];
    let k;
    if (K[26] !== V) k = L5.createElement(u, {
        flexDirection: "column"
    }, V), K[26] = V, K[27] = k;
    else k = K[27];
    let N;
    if (K[28] !== j) N = j.length > 0 ? L5.createElement(u, {
        flexDirection: "column"
    }, L5.createElement(T, {
        dimColor: !0
    }, "Also requested:"), j.map(YvY)) : null, K[28] = j, K[29] = N;
    else N = K[29];
    let R;
    if (K[30] !== _.willHide) R = _.willHide && _.willHide.length > 0 ? L5.createElement(T, {
        dimColor: !0
    }, _.willHide.length, " other", " ", O7(_.willHide.length, "app"), " will be hidden while Claude works.") : null, K[30] = _.willHide, K[31] = R;
    else R = K[31];
    let h, C;
    if (K[32] !== G) h = (S) => G(S === "allow_all"), C = () => G(!1), K[32] = G, K[33] = h, K[34] = C;
    else h = K[33], C = K[34];
    let x;
    if (K[35] !== D || K[36] !== h || K[37] !== C) x = L5.createElement(A1, {
        options: D,
        onChange: h,
        onCancel: C
    }), K[35] = D, K[36] = h, K[37] = C, K[38] = x;
    else x = K[38];
    let B;
    if (K[39] !== v || K[40] !== k || K[41] !== N || K[42] !== R || K[43] !== x) B = L5.createElement(u, {
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1,
        gap: 1
    }, v, k, N, R, x), K[39] = v, K[40] = k, K[41] = N, K[42] = R, K[43] = x, K[44] = B;
    else B = K[44];
    let m;
    if (K[45] !== f || K[46] !== B) m = L5.createElement(R1, {
        title: "Computer Use wants to control these apps",
        onCancel: f
    }, B), K[45] = f, K[46] = B, K[47] = m;
    else m = K[47];
    return m
}
// @from(Ln 417147, Col 0)
function YvY(q) {
    return L5.createElement(T, {
        key: q,
        dimColor: !0
    }, "  ", "· ", q)
}
// @from(Ln 417154, Col 0)
function AvY(q) {
    return [q, !0]
}
// @from(Ln 417158, Col 0)
function OvY(q) {
    return {
        bundleId: q.resolved?.bundleId ?? q.requestedName,
        reason: q.resolved ? "user_denied" : "not_installed"
    }
}
// @from(Ln 417165, Col 0)
function wvY(q) {
    return q.resolved && !q.alreadyGranted ? [q.resolved.bundleId] : []
}
// @from(Ln 417168, Col 4)
L5
// @from(Ln 417168, Col 8)
lhK
// @from(Ln 417168, Col 13)
nhK
// @from(Ln 417168, Col 18)
_vY
// @from(Ln 417169, Col 4)
rhK = L(() => {
    o6();
    Lr1();
    Ix8();
    Qq();
    g6();
    Q4();
    gK();
    S4();
    L5 = K6(P6(), 1), lhK = K6(P6(), 1), nhK = {
        granted: [],
        denied: [],
        flags: ac
    };
    _vY = {
        shell: "equivalent to shell access",
        filesystem: "can read/write any file",
        system_settings: "can change system settings"
    }
})
// @from(Ln 417190, Col 0)
function gz7() {
    return {
        ...ohK,
        ...Fv("tengu_malort_pedway", ohK)
    }
}
// @from(Ln 417197, Col 0)
function $vY() {
    let q = MK();
    return q === "max" || q === "pro"
}
// @from(Ln 417202, Col 0)
function ll8() {
    return $vY() && gz7().enabled
}
// @from(Ln 417206, Col 0)
function nl8() {
    let {
        enabled: q,
        coordinateMode: K,
        ..._
    } = gz7();
    return _
}
// @from(Ln 417215, Col 0)
function rI6() {
    return ahK ??= gz7().coordinateMode, ahK
}
// @from(Ln 417218, Col 4)
ohK
// @from(Ln 417218, Col 9)
ahK
// @from(Ln 417219, Col 4)
oI6 = L(() => {
    B1();
    T7();
    Q8();
    ohK = {
        enabled: !1,
        pixelValidation: !1,
        clipboardPasteMultiline: !0,
        mouseAnimation: !0,
        hideBeforeAction: !0,
        autoTargetDisplay: !0,
        clipboardGuard: !0,
        coordinateMode: "pixels"
    }
})
// @from(Ln 417237, Col 0)
class shK {
    silly(q, ...K) {
        E(j98(q, ...K), {
            level: "debug"
        })
    }
    debug(q, ...K) {
        E(j98(q, ...K), {
            level: "debug"
        })
    }
    info(q, ...K) {
        E(j98(q, ...K), {
            level: "info"
        })
    }
    warn(q, ...K) {
        E(j98(q, ...K), {
            level: "warn"
        })
    }
    error(q, ...K) {
        E(j98(q, ...K), {
            level: "error"
        })
    }
}
// @from(Ln 417265, Col 0)
function H98() {
    if (il8) return il8;
    return il8 = {
        serverName: QE,
        logger: new shK,
        executor: dr1({
            getMouseAnimationEnabled: () => nl8().mouseAnimation,
            getHideBeforeActionEnabled: () => nl8().hideBeforeAction
        }),
        ensureOsPermissions: async () => {
            let q = oR(),
                K = q.tcc.checkAccessibility(),
                _ = q.tcc.checkScreenRecording();
            return K && _ ? {
                granted: !0
            } : {
                granted: !1,
                accessibility: K,
                screenRecording: _
            }
        },
        isDisabled: () => !ll8(),
        getSubGates: nl8,
        getAutoUnhideEnabled: () => !0,
        cropRawPatch: () => null
    }, il8
}
// @from(Ln 417292, Col 4)
il8
// @from(Ln 417293, Col 4)
Uz7 = L(() => {
    K8();
    Va();
    cr1();
    oI6()
})
// @from(Ln 417300, Col 0)
function J98(q) {
    return q ? `(${q[0]}, ${q[1]})` : ""
}
// @from(Ln 417304, Col 0)
function thK(q) {
    return {
        userFacingName() {
            return `Computer Use[${q}]`
        },
        renderToolUseMessage(K) {
            switch (q) {
                case "screenshot":
                case "left_mouse_down":
                case "left_mouse_up":
                case "cursor_position":
                case "list_granted_applications":
                case "read_clipboard":
                    return "";
                case "left_click":
                case "right_click":
                case "middle_click":
                case "double_click":
                case "triple_click":
                case "mouse_move":
                    return J98(K.coordinate);
                case "left_click_drag":
                    return K.start_coordinate ? `${J98(K.start_coordinate)} → ${J98(K.coordinate)}` : `to ${J98(K.coordinate)}`;
                case "type":
                    return typeof K.text === "string" ? `"${j4(K.text,40)}"` : "";
                case "key":
                case "hold_key":
                    return typeof K.text === "string" ? K.text : "";
                case "scroll":
                    return [K.direction, K.amount && `×${K.amount}`, K.coordinate && `at ${J98(K.coordinate)}`].filter(Boolean).join(" ");
                case "zoom": {
                    let _ = K.region;
                    return Array.isArray(_) && _.length === 4 ? `[${_[0]}, ${_[1]}, ${_[2]}, ${_[3]}]` : ""
                }
                case "wait":
                    return typeof K.duration === "number" ? `${K.duration}s` : "";
                case "write_clipboard":
                    return typeof K.text === "string" ? `"${j4(K.text,40)}"` : "";
                case "open_application":
                    return typeof K.bundle_id === "string" ? String(K.bundle_id) : "";
                case "request_access": {
                    let _ = K.apps;
                    if (!Array.isArray(_)) return "";
                    return _.map((Y) => typeof Y?.displayName === "string" ? Y.displayName : "").filter(Boolean).join(", ")
                }
                case "computer_batch": {
                    let _ = K.actions;
                    return Array.isArray(_) ? `${_.length} actions` : ""
                }
                default:
                    return ""
            }
        },
        renderToolResultMessage(K, _, {
            verbose: z
        }) {
            if (z || typeof K !== "object" || K === null) return null;
            let Y = jvY[q];
            if (!Y) return null;
            return X98.createElement(_1, {
                height: 1
            }, X98.createElement(T, {
                dimColor: !0
            }, Y))
        }
    }
}
// @from(Ln 417371, Col 4)
X98
// @from(Ln 417371, Col 9)
jvY
// @from(Ln 417372, Col 4)
ehK = L(() => {
    GK();
    g6();
    c7();
    X98 = K6(P6(), 1);
    jvY = {
        screenshot: "Captured",
        zoom: "Captured",
        request_access: "Access updated",
        left_click: "Clicked",
        right_click: "Clicked",
        middle_click: "Clicked",
        double_click: "Clicked",
        triple_click: "Clicked",
        type: "Typed",
        key: "Pressed",
        hold_key: "Pressed",
        scroll: "Scrolled",
        left_click_drag: "Dragged",
        open_application: "Opened"
    }
})
// @from(Ln 417394, Col 4)
YRK = {}
// @from(Ln 417400, Col 0)
function zN() {
    return _RK
}
// @from(Ln 417404, Col 0)
function qRK(q) {
    return `Computer use is in use by another Claude session (${q.slice(0,8)}…). Wait for that session to finish or run /exit there.`
}
// @from(Ln 417408, Col 0)
function zRK() {
    return {
        getAllowedApps: () => zN().getAppState().computerUseMcpState?.allowedApps ?? [],
        getGrantFlags: () => zN().getAppState().computerUseMcpState?.grantFlags ?? ac,
        getUserDeniedBundleIds: () => [],
        getSelectedDisplayId: () => zN().getAppState().computerUseMcpState?.selectedDisplayId,
        getDisplayPinnedByModel: () => zN().getAppState().computerUseMcpState?.displayPinnedByModel ?? !1,
        getDisplayResolvedForApps: () => zN().getAppState().computerUseMcpState?.displayResolvedForApps,
        getLastScreenshotDims: () => {
            let q = zN().getAppState().computerUseMcpState?.lastScreenshotDims;
            return q ? {
                ...q,
                displayId: q.displayId ?? 0,
                originX: q.originX ?? 0,
                originY: q.originY ?? 0
            } : void 0
        },
        onPermissionRequest: (q, K) => XvY(q),
        onAllowedAppsChanged: (q, K) => zN().setComputerUseMcpState?.((_) => {
            let z = _?.allowedApps,
                Y = _?.grantFlags,
                A = z?.length === q.length && q.every((w, $) => z[$]?.bundleId === w.bundleId),
                O = Y?.clipboardRead === K.clipboardRead && Y?.clipboardWrite === K.clipboardWrite && Y?.systemKeyCombos === K.systemKeyCombos;
            return A && O ? _ : {
                ..._,
                allowedApps: [...q],
                grantFlags: K
            }
        }),
        onAppsHidden: (q) => {
            if (q.length === 0) return;
            zN().setComputerUseMcpState?.((K) => {
                let _ = K?.hiddenDuringTurn;
                if (_ && q.every((z) => _.has(z))) return K;
                return {
                    ...K,
                    hiddenDuringTurn: new Set([..._ ?? [], ...q])
                }
            })
        },
        onResolvedDisplayUpdated: (q) => zN().setComputerUseMcpState?.((K) => {
            if (K?.selectedDisplayId === q && !K.displayPinnedByModel && K.displayResolvedForApps === void 0) return K;
            return {
                ...K,
                selectedDisplayId: q,
                displayPinnedByModel: !1,
                displayResolvedForApps: void 0
            }
        }),
        onDisplayPinned: (q) => zN().setComputerUseMcpState?.((K) => {
            let _ = q !== void 0,
                z = _ ? K?.displayResolvedForApps : void 0;
            if (K?.selectedDisplayId === q && K?.displayPinnedByModel === _ && K?.displayResolvedForApps === z) return K;
            return {
                ...K,
                selectedDisplayId: q,
                displayPinnedByModel: _,
                displayResolvedForApps: z
            }
        }),
        onDisplayResolvedForApps: (q) => zN().setComputerUseMcpState?.((K) => {
            if (K?.displayResolvedForApps === q) return K;
            return {
                ...K,
                displayResolvedForApps: q
            }
        }),
        onScreenshotCaptured: (q) => zN().setComputerUseMcpState?.((K) => {
            let _ = K?.lastScreenshotDims;
            return _?.width === q.width && _?.height === q.height && _?.displayWidth === q.displayWidth && _?.displayHeight === q.displayHeight && _?.displayId === q.displayId && _?.originX === q.originX && _?.originY === q.originY ? K : {
                ...K,
                lastScreenshotDims: q
            }
        }),
        checkCuLock: async () => {
            let q = await Ax4();
            switch (q.kind) {
                case "free":
                    return {
                        holder: void 0, isSelf: !1
                    };
                case "held_by_self":
                    return {
                        holder: I8(), isSelf: !0
                    };
                case "blocked":
                    return {
                        holder: q.by, isSelf: !1
                    }
            }
        },
        acquireCuLock: async () => {
            let q = await wx4();
            if (q.kind === "blocked") throw Error(qRK(q.by));
            if (q.fresh) {
                let K = Wx4(() => {
                    E("[cu-esc] user escape, aborting turn"), zN().abortController.abort()
                });
                zN().sendOSNotification?.({
                    message: K ? "Claude is using your computer · press Esc to stop" : "Claude is using your computer · press Ctrl+C to stop",
                    notificationType: "computer_use_enter"
                })
            }
        },
        formatLockHeldMessage: qRK
    }
}
// @from(Ln 417516, Col 0)
function HvY() {
    if (rl8) return rl8;
    let q = zRK();
    return rl8 = {
        ctx: q,
        dispatch: Qx8(H98(), rI6(), q)
    }, rl8
}
// @from(Ln 417525, Col 0)
function JvY(q) {
    let K = async (_, z) => {
        _RK = z;
        let {
            dispatch: Y
        } = HvY(), {
            telemetry: A,
            ...O
        } = await Y(q, _);
        if (A?.error_kind) E(`[Computer Use MCP] ${q} error_kind=${A.error_kind}`);
        return {
            data: Array.isArray(O.content) ? O.content.map(($) => $.type === "image" ? {
                type: "image",
                source: {
                    type: "base64",
                    media_type: $.mimeType ?? "image/jpeg",
                    data: $.data
                }
            } : {
                type: "text",
                text: $.type === "text" ? $.text : ""
            }) : O.content
        }
    };
    return {
        ...thK(q),
        call: K
    }
}
// @from(Ln 417554, Col 0)
async function XvY(q) {
    let K = zN(),
        _ = K.setToolJSX;
    if (!_) return {
        granted: [],
        denied: [],
        flags: ac
    };
    try {
        return await new Promise((z, Y) => {
            let A = K.abortController.signal;
            if (A.aborted) {
                Y(Error("Computer Use permission dialog aborted"));
                return
            }
            let O = () => {
                A.removeEventListener("abort", O), Y(Error("Computer Use permission dialog aborted"))
            };
            A.addEventListener("abort", O), _({
                jsx: KRK.createElement(ihK, {
                    request: q,
                    onDone: (w) => {
                        A.removeEventListener("abort", O), z(w)
                    }
                }),
                shouldHidePromptInput: !0
            })
        })
    } finally {
        _(null)
    }
}
// @from(Ln 417586, Col 4)
KRK
// @from(Ln 417586, Col 9)
rl8
// @from(Ln 417586, Col 14)
_RK
// @from(Ln 417587, Col 4)
ARK = L(() => {
    n18();
    y8();
    rhK();
    K8();
    Vr1();
    bx8();
    oI6();
    Uz7();
    ehK();
    KRK = K6(P6(), 1)
})
// @from(Ln 417599, Col 4)
dz7 = {}
// @from(Ln 417603, Col 0)
class Qz7 {
    peer;
    closed = !1;
    onclose;
    onerror;
    onmessage;
    _setPeer(q) {
        this.peer = q
    }
    async start() {}
    async send(q) {
        if (this.closed) throw Error("Transport is closed");
        queueMicrotask(() => {
            this.peer?.onmessage?.(q)
        })
    }
    async close() {
        if (this.closed) return;
        if (this.closed = !0, this.onclose?.(), this.peer && !this.peer.closed) this.peer.closed = !0, this.peer.onclose?.()
    }
}
// @from(Ln 417625, Col 0)
function MvY() {
    let q = new Qz7,
        K = new Qz7;
    return q._setPeer(K), K._setPeer(q), [q, K]
}
// @from(Ln 417631, Col 0)
function fvY(q, K) {
    if (PvY.some((_) => q.startsWith(_))) return !0;
    if (K) {
        let _ = K.endsWith("/") ? `${K}Applications/` : `${K}/Applications/`;
        if (q.startsWith(_)) return !0
    }
    return !1
}
// @from(Ln 417640, Col 0)
function GvY(q) {
    return WvY.some((K) => K.test(q))
}
// @from(Ln 417644, Col 0)
function ORK(q, K) {
    let _ = new Set;
    return q.map((z) => z.trim()).filter((z) => {
        if (!z) return !1;
        if (z.length > 40) return !1;
        if (K && !ZvY.test(z)) return !1;
        if (_.has(z)) return !1;
        return _.add(z), !0
    }).sort((z, Y) => z.localeCompare(Y))
}
// @from(Ln 417655, Col 0)
function vvY(q) {
    let K = ORK(q, !0);
    if (K.length <= 50) return K;
    return [...K.slice(0, 50), `… and ${K.length-50} more`]
}
// @from(Ln 417661, Col 0)
function TvY(q) {
    return ORK(q, !1)
}
// @from(Ln 417665, Col 0)
function wRK(q, K) {
    let {
        alwaysKept: _,
        rest: z
    } = q.reduce((O, w) => {
        if (DvY.has(w.bundleId)) O.alwaysKept.push(w.displayName);
        else if (fvY(w.path, K) && !GvY(w.displayName)) O.rest.push(w.displayName);
        return O
    }, {
        alwaysKept: [],
        rest: []
    }), Y = TvY(_), A = new Set(Y);
    return [...Y, ...vvY(z).filter((O) => !A.has(O))]
}
// @from(Ln 417679, Col 4)
PvY
// @from(Ln 417679, Col 9)
WvY
// @from(Ln 417679, Col 14)
DvY
// @from(Ln 417679, Col 19)
ZvY
// @from(Ln 417680, Col 4)
$RK = L(() => {
    PvY = ["/Applications/", "/System/Applications/"], WvY = [/Helper(?:$|\s\()/, /Agent(?:$|\s\()/, /Service(?:$|\s\()/, /Uninstaller(?:$|\s\()/, /Updater(?:$|\s\()/, /^\./], DvY = new Set(["com.apple.Safari", "com.google.Chrome", "com.microsoft.edgemac", "org.mozilla.firefox", "company.thebrowser.Browser", "com.tinyspeck.slackmacgap", "us.zoom.xos", "com.microsoft.teams2", "com.microsoft.teams", "com.apple.MobileSMS", "com.apple.mail", "com.microsoft.Word", "com.microsoft.Excel", "com.microsoft.Powerpoint", "com.microsoft.Outlook", "com.apple.iWork.Pages", "com.apple.iWork.Numbers", "com.apple.iWork.Keynote", "com.google.GoogleDocs", "notion.id", "com.apple.Notes", "md.obsidian", "com.linear", "com.figma.Desktop", "com.microsoft.VSCode", "com.apple.Terminal", "com.googlecode.iterm2", "com.github.GitHubDesktop", "com.apple.finder", "com.apple.iCal", "com.apple.systempreferences"]), ZvY = /^[\p{L}\p{M}\p{N}_ .&'()+-]+$/u
})
// @from(Ln 417683, Col 4)
cz7 = {}
// @from(Ln 417691, Col 0)
async function kvY() {
    let K = H98().executor.listInstalledApps(),
        _, z = new Promise((A) => {
            _ = setTimeout(A, jRK, void 0)
        }),
        Y = await Promise.race([K, z]).catch(() => {
            return
        }).finally(() => clearTimeout(_));
    if (!Y) {
        K.catch(() => {}), E(`[Computer Use MCP] app enumeration exceeded ${jRK}ms or failed; tool description omits list`);
        return
    }
    return wRK(Y, VvY())
}
// @from(Ln 417705, Col 0)
async function HRK() {
    let q = H98(),
        K = rI6(),
        _ = ur1(q, K),
        z = await kvY(),
        Y = DJ6(q.executor.capabilities, K, z);
    return _.setRequestHandler(wr, async () => q.isDisabled() ? {
        tools: []
    } : {
        tools: Y
    }), _
}
// @from(Ln 417717, Col 0)
async function NvY() {
    $$6(), ak6();
    let q = await HRK(),
        K = new YA6,
        _ = !1,
        z = async () => {
            if (_) return;
            _ = !0, await Promise.all([ka(), Ra()]), process.exit(0)
        };
    process.stdin.on("end", () => void z()), process.stdin.on("error", () => void z()), E("[Computer Use MCP] Starting MCP server"), await q.connect(K), E("[Computer Use MCP] MCP server started")
}
// @from(Ln 417728, Col 4)
jRK = 1000
// @from(Ln 417729, Col 4)
lz7 = L(() => {
    n18();
    Fj8();
    _P();
    J$6();
    BB();
    Ka6();
    h1();
    K8();
    $RK();
    oI6();
    Uz7()
})
// @from(Ln 417753, Col 0)
function ZRK(q) {
    if (("code" in q ? q.code : void 0) !== 404) return !1;
    return q.message.includes('"code":-32001') || q.message.includes('"code": -32001')
}
// @from(Ln 417758, Col 0)
function yvY() {
    let q = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
    return q > 0 ? q : EvY
}
// @from(Ln 417763, Col 0)
function az7() {
    return xvY(A7(), "mcp-needs-auth-cache.json")
}
// @from(Ln 417767, Col 0)
function fRK() {
    if (!P98) P98 = SvY(az7(), "utf-8").then((q) => n8(q)).catch(() => ({}));
    return P98
}
// @from(Ln 417771, Col 0)
async function mvY(q) {
    let _ = (await fRK())[q];
    if (!_) return !1;
    return Date.now() - _.timestamp < uvY
}
// @from(Ln 417777, Col 0)
function BvY(q) {
    JRK = JRK.then(async () => {
        let K = await fRK();
        K[q] = {
            timestamp: Date.now()
        };
        let _ = az7();
        await RvY(IvY(_), {
            recursive: !0
        }), await bvY(_, I6(K)), P98 = null
    }).catch(() => {})
}
// @from(Ln 417790, Col 0)
function Sp8() {
    P98 = null, CvY(az7()).catch(() => {})
}
// @from(Ln 417794, Col 0)
function W98(q) {
    let K = uy(q);
    return K ? {
        mcpServerBaseUrl: K
    } : {}
}
// @from(Ln 417801, Col 0)
function nz7(q, K, _) {
    return d("tengu_mcp_server_needs_auth", {
        transportType: _,
        ...W98(K)
    }), i8(q, `Authentication required for ${{sse:"SSE",http:"HTTP","claudeai-proxy":"claude.ai proxy"}[_]} server`), BvY(q), {
        name: q,
        type: "needs-auth",
        config: K
    }
}
// @from(Ln 417812, Col 0)
function pvY(q) {
    return async (K, _) => {
        let z = async () => {
            await _Y();
            let w = o7();
            if (!w) throw Error("No claude.ai OAuth token available");
            let $ = new Headers(_?.headers);
            return $.set("Authorization", `Bearer ${w.accessToken}`), {
                response: await q(K, {
                    ..._,
                    headers: $
                }),
                sentToken: w.accessToken
            }
        }, {
            response: Y,
            sentToken: A
        } = await z();
        if (Y.status !== 401) return Y;
        let O = await $B(A).catch(() => !1);
        if (d("tengu_mcp_claudeai_proxy_401", {
                tokenChanged: O
            }), !O) {
            let w = o7()?.accessToken;
            if (!w || w === A) return Y
        }
        try {
            return (await z()).response
        } catch {
            return Y
        }
    }
}
// @from(Ln 417845, Col 0)
async function XRK(q, K) {
    return new(await Promise.resolve().then(() => (xY6(), fF6))).default(q, ["mcp"], K)
}
// @from(Ln 417849, Col 0)
function ol8() {
    let q = parseInt(process.env.MCP_TIMEOUT || "", 10);
    return q > 0 ? q : 30000
}
// @from(Ln 417854, Col 0)
function iz7(q) {
    return async (K, _) => {
        if ((_?.method ?? "GET").toUpperCase() === "GET") return q(K, _);
        let Y = new Headers(_?.headers);
        if (!Y.has("accept")) Y.set("accept", gvY);
        let A = new AbortController,
            O = setTimeout(($) => $.abort(new DOMException("The operation timed out.", "TimeoutError")), GRK, A);
        O.unref?.();
        let w = _?.signal;
        if (w?.aborted) A.abort(w.reason);
        else w?.addEventListener("abort", () => A.abort(w.reason), {
            once: !0
        });
        try {
            return await q(K, {
                ..._,
                headers: Y,
                signal: A.signal
            })
        } finally {
            clearTimeout(O)
        }
    }
}
// @from(Ln 417879, Col 0)
function sz7() {
    let q = parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10);
    return q > 0 ? q : 3
}
// @from(Ln 417884, Col 0)
function UvY() {
    let q = parseInt(process.env.MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE || "", 10);
    return q > 0 ? q : 20
}
// @from(Ln 417889, Col 0)
function MRK(q) {
    return !q.type || q.type === "stdio" || q.type === "sdk"
}
// @from(Ln 417893, Col 0)
function dvY(q) {
    return !q.name.startsWith("mcp__ide__") || QvY.includes(q.name)
}
// @from(Ln 417897, Col 0)
function D98(q, K) {
    return `${q}-${I6(K)}`
}
// @from(Ln 417900, Col 0)
async function WG(q, K) {
    let _ = D98(q, K);
    try {
        let z = await OL(q, K);
        if (z.type === "connected") await z.cleanup()
    } catch {}
    OL.cache.delete(_), NS.cache.delete(q), Es.cache.delete(q), HP6.cache.delete(q), JP6.cache.delete(q)
}
// @from(Ln 417908, Col 0)
async function Fy6(q) {
    if (q.config.type === "sdk") return q;
    let K = await OL(q.name, q.config);
    if (K.type !== "connected") throw new XV(`MCP server "${q.name}" is not connected`, "MCP server not connected");
    return K
}
// @from(Ln 417915, Col 0)
function vRK(q, K) {
    if (q.type !== K.type) return !1;
    let {
        scope: _,
        ...z
    } = q, {
        scope: Y,
        ...A
    } = K;
    return I6(z) === I6(A)
}
// @from(Ln 417927, Col 0)
function cvY(q, K) {
    let _ = Object.keys(q);
    return _.length > 0 ? _.map((z) => `${z}=${String(q[z])}`).join(" ") : K
}
// @from(Ln 417931, Col 0)
async function TRK(q, K, _, z, Y) {
    if (!q.capabilities?.completions) return [];
    try {
        return (await q.client.complete({
            ref: {
                type: "ref/resource",
                uri: K
            },
            argument: {
                name: _,
                value: z
            },
            context: Object.keys(Y).length > 0 ? {
                arguments: Y
            } : void 0
        })).completion.values
    } catch (A) {
        return i8(q.name, `Failed to complete resource template: ${b6(A)}`), []
    }
}
// @from(Ln 417951, Col 0)
async function Qp(q, K, _) {
    return (await NRK({
        client: _,
        tool: q,
        args: K,
        signal: F5().signal,
        imageLimits: Ks
    })).content
}
// @from(Ln 417960, Col 0)
async function _g(q, K) {
    try {
        TE(), await WG(q, K);
        let _ = await OL(q, K);
        if (_.type !== "connected") return {
            client: _,
            tools: [],
            commands: []
        };
        if (K.type === "http" || K.type === "sse") bz7(q, K);
        if (K.type === "claudeai-proxy") c87(q);
        let z = !!_.capabilities?.resources,
            [Y, A, O, w, $] = await Promise.all([NS(_), JP6(_), Promise.resolve([]), z ? Es(_) : Promise.resolve([]), z ? HP6(_) : Promise.resolve([])]),
            j = [...A, ...O],
            H = [];
        if (z) {
            if (![Ns, De].some((X) => Y.some((M) => e3(M, X.name)))) H.push(Ns, De)
        }
        return {
            client: _,
            tools: [...Y, ...H],
            commands: j,
            resources: w.length > 0 ? w : void 0,
            resourceTemplates: $
        }
    } catch (_) {
        return yz(q, `Error during reconnection: ${b6(_)}`), {
            client: {
                name: q,
                type: "failed",
                config: K
            },
            tools: [],
            commands: []
        }
    }
}
// @from(Ln 417997, Col 0)
async function PRK(q, K, _) {
    await Xe6(q, _, {
        concurrency: K
    })
}
// @from(Ln 418002, Col 0)
async function VRK(q, K) {
    if (q.length === 0) return 0;
    let _, z = new Promise((Y) => {
        _ = setTimeout((A) => A("deadline"), K, Y)
    });
    try {
        let Y = await Promise.all(q.map((A) => Promise.race([A.then(() => "settled", () => "settled"), z])));
        return w7(Y, (A) => A === "deadline")
    } finally {
        clearTimeout(_)
    }
}
// @from(Ln 418014, Col 0)
async function XP6(q, K) {
    let _ = !1,
        z = Object.entries(K ?? (await Ct()).servers),
        Y = [];
    for (let W of z)
        if (ZT(W[0])) q({
            client: {
                name: W[0],
                type: "disabled",
                config: W[1]
            },
            tools: [],
            commands: []
        });
        else Y.push(W);
    let A = Y.length,
        O = w7(Y, ([W, D]) => D.type === "stdio"),
        w = w7(Y, ([W, D]) => D.type === "sse"),
        $ = w7(Y, ([W, D]) => D.type === "http"),
        j = w7(Y, ([W, D]) => D.type === "sse-ide"),
        H = w7(Y, ([W, D]) => D.type === "ws-ide"),
        J = Y.filter(([W, D]) => MRK(D)),
        X = Y.filter(([W, D]) => !MRK(D)),
        M = {
            totalServers: A,
            stdioCount: O,
            sseCount: w,
            httpCount: $,
            sseIdeCount: j,
            wsIdeCount: H
        },
        P = async ([W, D]) => {
            try {
                if (ZT(W)) {
                    q({
                        client: {
                            name: W,
                            type: "disabled",
                            config: D
                        },
                        tools: [],
                        commands: []
                    });
                    return
                }
                if ((D.type === "claudeai-proxy" || D.type === "http" || D.type === "sse") && (await mvY(W) || (D.type === "http" || D.type === "sse") && ChK(W, D))) {
                    i8(W, "Skipping connection (cached needs-auth)"), q({
                        client: {
                            name: W,
                            type: "needs-auth",
                            config: D
                        },
                        tools: [xz7(W, D), uz7(W)],
                        commands: []
                    });
                    return
                }
                let Z = await OL(W, D, M);
                if (Z.type !== "connected") {
                    q({
                        client: Z,
                        tools: Z.type === "needs-auth" ? [xz7(W, D), uz7(W)] : [],
                        commands: []
                    });
                    return
                }
                if (D.type === "http" || D.type === "sse") bz7(W, D);
                if (D.type === "claudeai-proxy") c87(W);
                let G = !!Z.capabilities?.resources,
                    [f, v, V, k, N] = await Promise.all([NS(Z), JP6(Z), Promise.resolve([]), G ? Es(Z) : Promise.resolve([]), G ? HP6(Z) : Promise.resolve([])]),
                    R = [...v, ...V],
                    h = [];
                if (G && !_) _ = !0, h.push(Ns, De);
                q({
                    client: Z,
                    tools: [...f, ...h],
                    commands: R,
                    resources: k.length > 0 ? k : void 0,
                    resourceTemplates: N
                })
            } catch (Z) {
                yz(W, `Error fetching tools/commands/resources: ${b6(Z)}`), q({
                    client: {
                        name: W,
                        type: "failed",
                        config: D
                    },
                    tools: [],
                    commands: []
                })
            }
        };
    await Promise.all([PRK(J, sz7(), P), PRK(X, UvY(), P)])
}
// @from(Ln 418109, Col 0)
function Z98(q) {
    return new Promise((K) => {
        let _ = 0,
            z = 0;
        if (_ = Object.keys(q).length, _ === 0) {
            K({
                clients: [],
                tools: [],
                commands: []
            });
            return
        }
        let Y = [],
            A = [],
            O = [];
        XP6((w) => {
            if (Y.push(w.client), A.push(...w.tools), O.push(...w.commands), z++, z >= _) {
                let $ = O.reduce((j, H) => {
                    let J = H.name.length + (H.description ?? "").length + (H.argumentHint ?? "").length;
                    return j + J
                }, 0);
                d("tengu_mcp_tools_commands_loaded", {
                    tools_count: A.length,
                    commands_count: O.length,
                    commands_metadata_length: $
                }), K({
                    clients: Y,
                    tools: A,
                    commands: O
                })
            }
        }, q).catch((w) => {
            yz("prefetchAllMcpResources", `Failed to get MCP resources: ${b6(w)}`), K({
                clients: [],
                tools: [],
                commands: []
            })
        })
    })
}
// @from(Ln 418149, Col 0)
async function kRK(q, K, _, z = !1) {
    switch (q.type) {
        case "text": {
            let Y = {
                type: "text",
                text: q.text
            };
            if (z) {
                let A = q._meta;
                if (A) Y._meta = A
            }
            return [Y]
        }
        case "audio": {
            let Y = q;
            return await WRK(Buffer.from(Y.data, "base64"), Y.mimeType, K, `[Audio from ${K}] `)
        }
        case "image": {
            let {
                block: Y
            } = await sE({
                data: String(q.data),
                mediaType: q.mimeType,
                limits: _
            });
            return [Y]
        }
        case "resource": {
            let Y = q.resource,
                A = `[Resource from ${K} at ${Y.uri}] `;
            if ("text" in Y) return [{
                type: "text",
                text: `${A}${Y.text}`
            }];
            else if ("blob" in Y)
                if (FvY.has(Y.mimeType ?? "")) {
                    let {
                        block: w
                    } = await sE({
                        data: Y.blob,
                        mediaType: Y.mimeType,
                        limits: _
                    }), $ = [];
                    if (A) $.push({
                        type: "text",
                        text: A
                    });
                    return $.push(w), $
                } else return await WRK(Buffer.from(Y.blob, "base64"), Y.mimeType, K, A);
            return []
        }
        case "resource_link": {
            let Y = q,
                A = `[Resource link: ${Y.name}] ${Y.uri}`;
            if (Y.description) A += ` (${Y.description})`;
            return [{
                type: "text",
                text: A
            }]
        }
        default:
            return []
    }
}
// @from(Ln 418213, Col 0)
async function WRK(q, K, _, z) {
    let Y = `mcp-${Pw(_)}-blob-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        A = await Cb6(q, K, Y);
    if ("error" in A) return [{
        type: "text",
        text: `${z}Binary content (${K||"unknown type"}, ${q.length} bytes) could not be saved to disk: ${A.error}`
    }];
    return [{
        type: "text",
        text: _Q8(A.filepath, K, A.size, z)
    }]
}
// @from(Ln 418226, Col 0)
function al8(q, K = 2) {
    if (q === null) return "null";
    if (Array.isArray(q)) {
        if (q.length === 0) return "[]";
        return `[${al8(q[0],K-1)}]`
    }
    if (typeof q === "object") {
        if (K <= 0) return "{...}";
        let z = Object.entries(q).slice(0, 10).map(([A, O]) => `${A}: ${al8(O,K-1)}`),
            Y = Object.keys(q).length > 10 ? ", ..." : "";
        return `{${z.join(", ")}${Y}}`
    }
    return typeof q
}
// @from(Ln 418240, Col 0)
async function lvY(q, K, _, z) {
    if (q && typeof q === "object") {
        if ("toolResult" in q) return {
            content: String(q.toolResult),
            type: "toolResult"
        };
        if ("structuredContent" in q && q.structuredContent !== void 0) return {
            content: I6(q.structuredContent),
            type: "structuredContent",
            schema: al8(q.structuredContent)
        };
        if ("content" in q && Array.isArray(q.content)) {
            let A = (await Promise.all(q.content.map((O) => kRK(O, _, z, !0)))).flat();
            return {
                content: A,
                type: "contentArray",
                schema: al8(i38(A))
            }
        }
    }
    let Y = `MCP server "${_}" tool "${K}": unexpected response format`;
    throw yz(_, Y), new XV(Y, "MCP tool unexpected response format")
}
// @from(Ln 418264, Col 0)
function DRK(q) {
    if (!q || typeof q === "string") return !1;
    return q.some((K) => K.type === "image")
}
// @from(Ln 418268, Col 0)
async function nvY(q, K, _, z, Y = !1) {
    let {
        content: A,
        type: O,
        schema: w
    } = await lvY(q, K, _, z);
    if (_ === "ide") return A;
    if (Y && !DRK(A)) return A;
    if (!await Mz7(A)) return A;
    let $ = r38(A);
    if (c5(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) return d("tengu_mcp_large_result_handled", {
        outcome: "truncated",
        reason: "env_disabled",
        sizeEstimateTokens: $
    }), await Pz7(A);
    if (!A) return A;
    if (DRK(A)) return d("tengu_mcp_large_result_handled", {
        outcome: "truncated",
        reason: "contains_images",
        sizeEstimateTokens: $
    }), await Pz7(A);
    let j = Date.now(),
        H = `mcp-${Pw(_)}-${Pw(K)}-${j}`,
        J = i38(A),
        X = zK7(),
        M = Array.isArray(J) ? J.length : void 0,
        P = X && Array.isArray(J) && J.length === 1 && J[0]?.type === "text" && !("annotations" in J[0]) && !("_meta" in J[0]) ? J[0].text : void 0,
        W = typeof J === "string" ? J : P ?? I6(J, null, 2),
        D = O === "toolResult" || P !== void 0,
        Z = D ? "text" : "json",
        G;
    if (X && D) {
        let V = W.split(`
`);
        if (V.length > 1 && V.at(-1) === "") V.pop();
        let k = 0;
        for (let N of V)
            if (N.length > k) k = N.length;
        G = {
            count: V.length,
            maxLen: k
        }
    }
    let f = await _L6(W, H);
    if (YL6(f)) {
        let V = W.length;
        return d("tengu_mcp_large_result_handled", {
            outcome: "truncated",
            reason: "persist_failed",
            sizeEstimateTokens: $
        }), `Error: result (${V.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${f.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`
    }
    d("tengu_mcp_large_result_handled", {
        outcome: "persisted",
        reason: "file_saved",
        sizeEstimateTokens: $,
        persistedSizeChars: f.originalSize,
        resultType: O,
        blockCount: M,
        persistedAs: Z
    });
    let v = P !== void 0 ? YK7("toolResult") : YK7(O, w);
    return vWK(f.filepath, f.originalSize, v, void 0, G)
}
// @from(Ln 418332, Col 0)
async function ivY({
    client: q,
    clientConnection: K,
    tool: _,
    args: z,
    meta: Y,
    signal: A,
    setAppState: O,
    onProgress: w,
    callToolFn: $ = NRK,
    handleElicitation: j,
    hasResultSizeAnnotation: H = !1,
    imageLimits: J
}) {
    for (let M = 0;; M++) try {
        return await $({
            client: q,
            tool: _,
            args: z,
            meta: Y,
            signal: A,
            onProgress: w,
            hasResultSizeAnnotation: H,
            imageLimits: J
        })
    } catch (P) {
        if (!(P instanceof SK) || P.code !== V5.UrlElicitationRequired) throw P;
        if (M >= 3) throw P;
        let W = P.data,
            Z = (W != null && typeof W === "object" && "elicitations" in W && Array.isArray(W.elicitations) ? W.elicitations : []).filter((f) => l31.safeParse(f).success),
            G = K.type === "connected" ? K.name : "unknown";
        if (Z.length === 0) throw i8(G, `Tool '${_}' returned -32042 but no valid elicitations in error data`), P;
        i8(G, `Tool '${_}' requires URL elicitation (error -32042, attempt ${M+1}), processing ${Z.length} elicitation(s)`);
        for (let f of Z) {
            let {
                elicitationId: v
            } = f, V = await Y98(G, f, A);
            if (V) {
                if (i8(G, `URL elicitation ${v} resolved by hook: ${I6(V)}`), V.action !== "accept") return {
                    content: `URL elicitation was ${V.action==="decline"?"declined":V.action+"ed"} by a hook. The tool "${_}" could not complete because it requires the user to open a URL.`
                };
                continue
            }
            let k;
            if (j) k = await j(G, f, A);
            else {
                let R = {
                    actionLabel: "Retry now",
                    showCancel: !0
                };
                k = await new Promise((h) => {
                    let C = () => {
                        h({
                            action: "cancel"
                        })
                    };
                    if (A.aborted) {
                        C();
                        return
                    }
                    A.addEventListener("abort", C, {
                        once: !0
                    }), O((x) => ({
                        ...x,
                        elicitation: {
                            queue: [...x.elicitation.queue, {
                                serverName: G,
                                requestId: `error-elicit-${v}`,
                                params: f,
                                signal: A,
                                waitingState: R,
                                respond: (B) => {
                                    if (B.action === "accept") return;
                                    A.removeEventListener("abort", C), h(B)
                                },
                                onWaitingDismiss: (B) => {
                                    if (A.removeEventListener("abort", C), B === "retry") h({
                                        action: "accept"
                                    });
                                    else h({
                                        action: "cancel"
                                    })
                                }
                            }]
                        }
                    }))
                })
            }
            let N = await A98(G, k, A, "url", v);
            if (N.action !== "accept") return i8(G, `User ${N.action==="decline"?"declined":N.action+"ed"} URL elicitation ${v}`), {
                content: `URL elicitation was ${N.action==="decline"?"declined":N.action+"ed"} by the user. The tool "${_}" could not complete because it requires the user to open a URL.`
            };
            i8(G, `Elicitation ${v} completed, retrying tool call`)
        }
    }
}
// @from(Ln 418428, Col 0)
async function NRK({
    client: {
        client: q,
        name: K,
        config: _,
        transportErrorState: z
    },
    tool: Y,
    args: A,
    meta: O,
    signal: w,
    onProgress: $,
    hasResultSizeAnnotation: j = !1,
    imageLimits: H
}) {
    let J = Date.now(),
        X;
    try {
        i8(K, `Calling MCP tool: ${Y}`);
        let M, P = new Promise((N, R) => {
            M = R
        });
        X = setInterval(() => {
            let N = Math.floor((Date.now() - J) / 1000);
            if (i8(K, `Tool '${Y}' still running (${N}s elapsed)`), z && z.lastErrorAt > J && Date.now() - z.lastErrorAt > 90000) i8(K, `Tool '${Y}' aborting: transport error ${Math.floor((Date.now()-z.lastErrorAt)/1000)}s ago, response presumed lost`), M(new XV(`MCP server "${K}" transport dropped mid-call; response for tool "${Y}" was lost`, "MCP transport lost mid-call"))
        }, 30000);
        let W = yvY(),
            D, Z = new Promise((N, R) => {
                D = setTimeout((h, C, x, B) => {
                    h(new XV(`MCP server "${C}" tool "${x}" timed out after ${Math.floor(B/1000)}s`, "MCP tool timeout"))
                }, W, R, K, Y, W)
            }),
            G = await Promise.race([q.callTool({
                name: Y,
                arguments: A,
                _meta: O
            }, zU, {
                signal: w,
                timeout: W,
                onprogress: $ ? (N) => {
                    $({
                        type: "mcp_progress",
                        status: "progress",
                        serverName: K,
                        toolName: Y,
                        progress: N.progress,
                        total: N.total,
                        progressMessage: N.message
                    })
                } : void 0
            }), Z, P]).finally(() => {
                if (D) clearTimeout(D);
                if (X !== void 0) clearInterval(X), X = void 0
            });
        if ("isError" in G && G.isError) {
            let N = "Unknown error";
            if ("content" in G && Array.isArray(G.content) && G.content.length > 0) {
                let R = G.content.filter((h) => h != null && typeof h === "object" && ("text" in h)).map((h) => h.text);
                if (R.length > 0) N = R.join(`
`)
            } else if ("error" in G) N = String(G.error);
            throw yz(K, N), new od8(N, "MCP tool returned error", "_meta" in G && G._meta ? {
                _meta: G._meta
            } : void 0)
        }
        let f = Date.now() - J,
            v = f < 1000 ? `${f}ms` : f < 60000 ? `${Math.floor(f/1000)}s` : `${Math.floor(f/60000)}m ${Math.floor(f%60000/1000)}s`;
        i8(K, `Tool '${Y}' completed successfully in ${v}`);
        let V = uhK(K);
        if (V) d("tengu_code_indexing_tool_used", {
            tool: V,
            source: "mcp",
            success: !0
        });
        return {
            content: await nvY(G, Y, K, H, j),
            _meta: G._meta,
            structuredContent: G.structuredContent
        }
    } catch (M) {
        if (X !== void 0) clearInterval(X);
        let P = Date.now() - J;
        if (M instanceof Error && M.name !== "AbortError") i8(K, `Tool '${Y}' failed after ${Math.floor(P/1000)}s: ${M.message}`);
        if (M instanceof Error) {
            let W = "code" in M ? M.code : void 0;
            if (W === 401 || M instanceof VD) {
                i8(K, "Tool call returned 401 Unauthorized - token may have expired");
                let G = W98(_);
                throw d("tengu_mcp_tool_call_auth_error", {
                    errorCode: String(W ?? 401),
                    transportType: _.type ?? "stdio",
                    ...G,
                    ...vk8(_.type, G.mcpServerBaseUrl) && {
                        mcpServerName: Pw(K),
                        mcpToolName: Pw(Y)
                    }
                }), new rd8(K, `MCP server "${K}" requires re-authorization (token expired)`)
            }
            let D = ZRK(M),
                Z = "code" in M && M.code === -32000 && M.message.includes("Connection closed") && (_.type === "http" || _.type === "claudeai-proxy");
            if (D || Z) {
                i8(K, `MCP session expired during tool call (${D?"404/-32001":"connection closed"}), clearing connection cache for re-initialization`);
                let G = W98(_);
                throw d("tengu_mcp_session_expired", {
                    errorCode: W !== void 0 ? String(W) : void 0,
                    transportType: _.type ?? "stdio",
                    ...G,
                    ...vk8(_.type, G.mcpServerBaseUrl) && {
                        mcpServerName: Pw(K),
                        mcpToolName: Pw(Y)
                    }
                }), await WG(K, _), new oz7(K)
            }
        }
        if (!(M instanceof Error) || M.name !== "AbortError") throw M;
        return {
            content: void 0
        }
    } finally {
        if (X !== void 0) clearInterval(X)
    }
}
// @from(Ln 418551, Col 0)
function rvY(q) {
    if (q.message.content[0]?.type !== "tool_use") return;
    return q.message.content[0].id
}
// @from(Ln 418555, Col 0)
async function ERK(q, K) {
    let _ = [],
        z = [],
        Y = await Promise.allSettled(Object.entries(q).map(async ([A, O]) => {
            let w = new Fz7(A, K),
                $ = new WR8({
                    name: "claude-code",
                    title: "Claude Code",
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.112",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-04-16T18:33:19Z"
                    }.VERSION ?? "unknown",
                    description: "Anthropic's agentic coding tool",
                    websiteUrl: uj6
                }, {
                    capabilities: {}
                });
            try {
                await $.connect(w);
                let j = $.getServerCapabilities(),
                    H = {
                        type: "connected",
                        name: A,
                        capabilities: j || {},
                        client: $,
                        config: {
                            ...O,
                            scope: "dynamic"
                        },
                        cleanup: async () => {
                            await $.close()
                        }
                    },
                    J = [];
                if (j?.tools) {
                    let X = await NS(H);
                    J.push(...X)
                }
                return {
                    client: H,
                    tools: J
                }
            } catch (j) {
                return yz(A, `Failed to connect SDK MCP server: ${j}`), {
                    client: {
                        type: "failed",
                        name: A,
                        config: {
                            ...O,
                            scope: "user"
                        }
                    },
                    tools: []
                }
            }
        }));
    for (let A of Y)
        if (A.status === "fulfilled") _.push(A.value.client), z.push(...A.value.tools);
    return {
        clients: _,
        tools: z
    }
}
// @from(Ln 418622, Col 0)
async function tz7(q) {
    await Promise.all(q.map(async (K) => {
        if (K.type !== "connected") return;
        try {
            await K.cleanup()
        } catch (_) {
            E(`MCP client cleanup failed for ${K.name}: ${_}`, {
                level: "error"
            })
        }
    }))
}
// @from(Ln 418634, Col 4)
rd8
// @from(Ln 418634, Col 9)
oz7
// @from(Ln 418634, Col 14)
od8
// @from(Ln 418634, Col 19)
EvY = 1e8
// @from(Ln 418635, Col 4)
M98 = 2048
// @from(Ln 418636, Col 4)
LvY = () => (chK(), B7(dhK))
// @from(Ln 418637, Col 4)
hvY = () => (ARK(), B7(YRK))
// @from(Ln 418638, Col 4)
uvY = 900000
// @from(Ln 418639, Col 4)
P98 = null
// @from(Ln 418640, Col 4)
JRK
// @from(Ln 418640, Col 9)
FvY
// @from(Ln 418640, Col 14)
GRK = 60000
// @from(Ln 418641, Col 4)
gvY = "application/json, text/event-stream"
// @from(Ln 418642, Col 4)
QvY
// @from(Ln 418642, Col 9)
OL
// @from(Ln 418642, Col 13)
sl8 = 20
// @from(Ln 418643, Col 4)
NS
// @from(Ln 418643, Col 8)
Es
// @from(Ln 418643, Col 12)
HP6
// @from(Ln 418643, Col 17)
JP6