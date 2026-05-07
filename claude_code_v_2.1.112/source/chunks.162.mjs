
// @from(Ln 418644, Col 4)
oW = L(() => {
    fW4();
    uW4();
    BW4();
    FW4();
    _P();
    G16();
    U4();
    dW4();
    YU1();
    y8();
    _s();
    z3();
    gq();
    FR8();
    xLK();
    IhK();
    Dd8();
    x$();
    T7();
    R9();
    Bz7();
    K8();
    Q8();
    m8();
    Zf();
    kj();
    CI();
    U8();
    zQ8();
    Hl8();
    mhK();
    Lm();
    Jk();
    Qm();
    _M();
    ox();
    zy();
    ND();
    C8();
    q2();
    dl8();
    fh();
    iD();
    Ij6();
    ghK();
    r76();
    me();
    tS6();
    rD();
    UhK();
    ip();
    Va();
    Q8();
    e8();
    rd8 = class rd8 extends Error {
        serverName;
        constructor(q, K) {
            super(K);
            this.name = "McpAuthError", this.serverName = q
        }
    };
    oz7 = class oz7 extends Error {
        constructor(q) {
            super(`MCP server "${q}" session expired`);
            this.name = "McpSessionExpiredError"
        }
    };
    od8 = class od8 extends XV {
        mcpMeta;
        constructor(q, K, _) {
            super(q, K);
            this.mcpMeta = _;
            this.name = "McpToolCallError"
        }
    };
    JRK = Promise.resolve();
    FvY = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
    QvY = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
    OL = P1(async (q, K, _) => {
        let z = Date.now(),
            Y;
        try {
            let A, O = qW();
            if (K.type === "sse") {
                let m = new jP6(q, K),
                    S = await cl8(q, K),
                    F = {
                        authProvider: m,
                        fetch: iz7(Iz7(Cj6(), m)),
                        requestInit: {
                            headers: {
                                "User-Agent": Pa(),
                                "Accept-Encoding": "identity",
                                ...S
                            }
                        }
                    };
                F.eventSourceInit = {
                    fetch: async (U, g) => {
                        let c = {},
                            n = await m.tokens();
                        if (n) c.Authorization = `Bearer ${n.access_token}`;
                        let l = b76();
                        return fetch(U, {
                            ...g,
                            ...l,
                            headers: {
                                "User-Agent": Pa(),
                                "Accept-Encoding": "identity",
                                ...c,
                                ...g?.headers,
                                ...S,
                                Accept: "text/event-stream"
                            }
                        })
                    }
                }, A = new IR8(new URL(K.url), F), i8(q, "SSE transport initialized, awaiting connection")
            } else if (K.type === "sse-ide") {
                i8(q, `Setting up SSE-IDE transport to ${K.url}`);
                let m = b76(),
                    S = {
                        requestInit: {
                            headers: {
                                "User-Agent": Pa(),
                                "Accept-Encoding": "identity"
                            }
                        },
                        ...m.dispatcher && {
                            eventSourceInit: {
                                fetch: async (F, U) => {
                                    return fetch(F, {
                                        ...U,
                                        ...m,
                                        headers: {
                                            "User-Agent": Pa(),
                                            "Accept-Encoding": "identity",
                                            ...U?.headers
                                        }
                                    })
                                }
                            }
                        }
                    };
                A = new IR8(new URL(K.url), S)
            } else if (K.type === "ws-ide") {
                let m = OE(),
                    S = {
                        "User-Agent": Pa(),
                        ...K.authToken && {
                            "X-Claude-Code-Ide-Authorization": K.authToken
                        }
                    },
                    F;
                if (typeof Bun < "u") F = new globalThis.WebSocket(K.url, {
                    protocols: ["mcp"],
                    headers: S,
                    proxy: Tb(K.url),
                    tls: m || void 0
                });
                else F = await XRK(K.url, {
                    headers: S,
                    agent: vb(K.url),
                    ...m || {}
                });
                A = new Ql8(F)
            } else if (K.type === "ws") {
                i8(q, `Initializing WebSocket transport to ${K.url}`);
                let m = await cl8(q, K),
                    S = OE(),
                    F = {
                        "User-Agent": Pa(),
                        ...O && {
                            Authorization: `Bearer ${O}`
                        },
                        ...m
                    },
                    U = c0(F, (c, n) => n.toLowerCase() === "authorization" ? "[REDACTED]" : c);
                i8(q, `WebSocket transport options: ${I6({url:K.url,headers:U,hasSessionAuth:!!O})}`);
                let g;
                if (typeof Bun < "u") g = new globalThis.WebSocket(K.url, {
                    protocols: ["mcp"],
                    headers: F,
                    proxy: Tb(K.url),
                    tls: S || void 0
                });
                else g = await XRK(K.url, {
                    headers: F,
                    agent: vb(K.url),
                    ...S || {}
                });
                A = new Ql8(g)
            } else if (K.type === "http") {
                i8(q, `Initializing HTTP transport to ${K.url}`), i8(q, `Node version: ${process.version}, Platform: ${process.platform}`), i8(q, `Environment: ${I6({NODE_OPTIONS:process.env.NODE_OPTIONS||"not set",UV_THREADPOOL_SIZE:process.env.UV_THREADPOOL_SIZE||"default",HTTP_PROXY:process.env.HTTP_PROXY||"not set",HTTPS_PROXY:process.env.HTTPS_PROXY||"not set",NO_PROXY:process.env.NO_PROXY||"not set"})}`);
                let m = new jP6(q, K),
                    S = await cl8(q, K),
                    F = !!await m.tokens(),
                    U = b76();
                i8(q, `Proxy options: ${U.dispatcher?"custom dispatcher":"default"}`);
                let g = {
                        authProvider: m,
                        fetch: iz7(Iz7(Cj6(), m)),
                        requestInit: {
                            ...U,
                            headers: {
                                "User-Agent": Pa(),
                                "Accept-Encoding": "identity",
                                ...O && !F && {
                                    Authorization: `Bearer ${O}`
                                },
                                ...S
                            }
                        }
                    },
                    c = g.requestInit?.headers ? c0(g.requestInit.headers, (n, l) => l.toLowerCase() === "authorization" ? "[REDACTED]" : n) : void 0;
                i8(q, `HTTP transport options: ${I6({url:K.url,headers:c,hasAuthProvider:!!m,timeoutMs:GRK})}`), A = new xR8(new URL(K.url), g), i8(q, "HTTP transport created successfully")
            } else if (K.type === "sdk") throw Error("SDK servers should be handled in print.ts");
            else if (K.type === "claudeai-proxy") {
                if (i8(q, `Initializing claude.ai proxy transport for server ${K.id}`), !o7()) throw Error("No claude.ai OAuth token found");
                let S = r7(),
                    F = `${S.MCP_PROXY_URL}${S.MCP_PROXY_PATH.replace("{server_id}",K.id)}`;
                i8(q, `Using claude.ai proxy at ${F}`);
                let U = pvY(globalThis.fetch),
                    g = b76(),
                    c = {
                        fetch: iz7(U),
                        requestInit: {
                            ...g,
                            headers: {
                                "User-Agent": Pa(),
                                "Accept-Encoding": "identity",
                                "X-Mcp-Client-Session-Id": I8()
                            }
                        }
                    };
                A = new xR8(new URL(F), c), i8(q, "claude.ai proxy transport created successfully")
            } else if ((K.type === "stdio" || !K.type) && rH6(q)) {
                let {
                    createChromeContext: m
                } = await Promise.resolve().then(() => (qY7(), ez7)), {
                    createClaudeForChromeMcpServer: S
                } = await Promise.resolve().then(() => (jU6(), DS7)), {
                    createLinkedTransportPair: F
                } = await Promise.resolve().then(() => dz7), U = m(K.env);
                Y = S(U);
                let [g, c] = F();
                await Y.connect(c), A = g, i8(q, "In-process Chrome MCP server started")
            } else if ((K.type === "stdio" || !K.type) && _$6(q)) {
                let {
                    createComputerUseMcpServerForCli: m
                } = await Promise.resolve().then(() => (lz7(), cz7)), {
                    createLinkedTransportPair: S
                } = await Promise.resolve().then(() => dz7);
                Y = await m();
                let [F, U] = S();
                await Y.connect(U), A = F, i8(q, "In-process Computer Use MCP server started")
            } else if (K.type === "stdio" || !K.type) {
                let m = process.env.CLAUDE_CODE_SHELL_PREFIX || K.command,
                    S = process.env.CLAUDE_CODE_SHELL_PREFIX ? [
                        [K.command, ...K.args].join(" ")
                    ] : K.args,
                    F = jp1() ? {
                        ...KU1(),
                        ...TL8()
                    } : Dk();
                A = new _U1({
                    command: m,
                    args: S,
                    env: {
                        ...F,
                        ...K.env
                    },
                    stderr: "pipe"
                })
            } else throw Error(`Unsupported server type: ${K.type}`);
            let w, $ = "";
            if (K.type === "stdio" || !K.type) {
                let m = A;
                if (m.stderr) w = (S) => {
                    if ($.length < 67108864) try {
                        $ += S.toString()
                    } catch {}
                }, m.stderr.on("data", w)
            }
            let j = new WR8({
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
                capabilities: {
                    roots: {},
                    elicitation: {}
                }
            });
            if (K.type === "http") i8(q, "Client created, setting up request handler");
            if (j.setRequestHandler(i31, async () => {
                    return i8(q, "Received ListRoots request from server"), {
                        roots: [{
                            uri: `file://${Y7()}`
                        }]
                    }
                }), i8(q, `Starting connection with timeout of ${ol8()}ms`), K.type === "http") {
                i8(q, `Testing basic HTTP connectivity to ${K.url}`);
                try {
                    let m = new URL(K.url);
                    if (i8(q, `Parsed URL: host=${m.hostname}, port=${m.port||"default"}, protocol=${m.protocol}`), m.hostname === "127.0.0.1" || m.hostname === "localhost") i8(q, `Using loopback address: ${m.hostname}`)
                } catch (m) {
                    i8(q, `Failed to parse URL: ${m}`)
                }
            }
            let H = j.connect(A),
                J = new Promise((m, S) => {
                    let F = setTimeout(() => {
                        let U = Date.now() - z;
                        if (i8(q, `Connection timeout triggered after ${U}ms (limit: ${ol8()}ms)`), Y) Y.close().catch(() => {});
                        A.close().catch(() => {}), S(new XV(`MCP server "${q}" connection timed out after ${ol8()}ms`, "MCP connection timeout"))
                    }, ol8());
                    H.then(() => {
                        clearTimeout(F)
                    }, (U) => {
                        clearTimeout(F)
                    })
                });
            try {
                if (await Promise.race([H, J]), $) yz(q, `Server stderr: ${$}`), $ = "";
                let m = Date.now() - z;
                i8(q, `Successfully connected (transport: ${K.type||"stdio"}) in ${m}ms`)
            } catch (m) {
                let S = Date.now() - z;
                if (K.type === "sse" && m instanceof Error) {
                    if (i8(q, `SSE Connection failed after ${S}ms: ${I6({url:K.url,error:m.message,errorType:m.constructor.name,stack:m.stack})}`), yz(q, m), m instanceof VD) return nz7(q, K, "sse")
                } else if (K.type === "http" && m instanceof Error) {
                    let F = m;
                    if (i8(q, `HTTP Connection failed after ${S}ms: ${m.message} (code: ${F.code||"none"}, errno: ${F.errno||"none"})`), yz(q, m), m instanceof VD) return nz7(q, K, "http")
                } else if (K.type === "claudeai-proxy" && m instanceof Error) {
                    if (i8(q, `claude.ai proxy connection failed after ${S}ms: ${m.message}`), yz(q, m), m.code === 401) return nz7(q, K, "claudeai-proxy")
                } else if (K.type === "sse-ide" || K.type === "ws-ide") d("tengu_mcp_ide_server_connection_failed", {
                    connectionDurationMs: S
                });
                if (Y) Y.close().catch(() => {});
                if (A.close().catch(() => {}), $) yz(q, `Server stderr: ${$}`);
                throw m
            }
            let X = j.getServerCapabilities(),
                M = j.getServerVersion(),
                P = j.getInstructions(),
                W = P;
            if (P && P.length > M98) W = P.slice(0, M98) + "… [truncated]", i8(q, `Server instructions truncated from ${P.length} to ${M98} chars`);
            if (i8(q, `Connection established with capabilities: ${I6({hasTools:!!X?.tools,hasPrompts:!!X?.prompts,hasResources:!!X?.resources,hasResourceSubscribe:!!X?.resources?.subscribe,serverVersion:M||"unknown"})}`), E(`[MCP] Server "${q}" connected with subscribe=${!!X?.resources?.subscribe}`), j.setRequestHandler($r, async (m) => {
                    return i8(q, `Elicitation request received during initialization: ${I6(m)}`), {
                        action: "cancel"
                    }
                }), K.type === "sse-ide" || K.type === "ws-ide") {
                let m = Date.now() - z;
                d("tengu_mcp_ide_server_connection_succeeded", {
                    connectionDurationMs: m,
                    serverVersion: M
                });
                try {
                    sR4(j)
                } catch (S) {
                    yz(q, `Failed to send ide_connected notification: ${S}`)
                }
            }
            let D = Date.now(),
                Z = !1,
                G = j.onerror,
                f = j.onclose,
                v = 3,
                V = {
                    lastErrorAt: 0,
                    consecutiveErrors: 0
                },
                k = !1,
                N = (m) => {
                    if (k) return;
                    k = !0, i8(q, `Closing transport (${m})`), j.close().catch((S) => {
                        i8(q, `Error during close: ${b6(S)}`)
                    })
                },
                R = (m) => {
                    return m.includes("ECONNRESET") || m.includes("ETIMEDOUT") || m.includes("EPIPE") || m.includes("EHOSTUNREACH") || m.includes("ECONNREFUSED") || m.includes("Body Timeout Error") || m.includes("terminated") || m.includes("SSE stream disconnected") || m.includes("Failed to reconnect SSE stream")
                };
            if (j.onerror = (m) => {
                    let S = K.type || "stdio";
                    if (S === "stdio" && m instanceof SyntaxError) {
                        yz(q, `Ignoring non-JSON line on stdout: ${m.message}`);
                        return
                    }
                    if ((S === "sse" || S === "http" || S === "claudeai-proxy") && m instanceof SyntaxError) {
                        if (Z = !0, V.lastErrorAt = Date.now(), N("malformed JSON-RPC message (response truncated)"), G) G(m);
                        return
                    }
                    let F = Date.now() - D;
                    if (Z = !0, i8(q, `${S.toUpperCase()} connection dropped after ${Math.floor(F/1000)}s uptime`), m.message)
                        if (m.message.includes("ECONNRESET")) i8(q, "Connection reset - server may have crashed or restarted");
                        else if (m.message.includes("ETIMEDOUT")) i8(q, "Connection timeout - network issue or server unresponsive");
                    else if (m.message.includes("ECONNREFUSED")) i8(q, "Connection refused - server may be down");
                    else if (m.message.includes("EPIPE")) i8(q, "Broken pipe - server closed connection unexpectedly");
                    else if (m.message.includes("EHOSTUNREACH")) i8(q, "Host unreachable - network connectivity issue");
                    else if (m.message.includes("ESRCH")) i8(q, "Process not found - stdio server process terminated");
                    else if (m.message.includes("spawn")) i8(q, "Failed to spawn process - check command and permissions");
                    else i8(q, `Connection error: ${m.message}`);
                    if (S === "stdio") {
                        if (N(`stdio transport error: ${m.name||"Error"}`), G) G(m);
                        return
                    }
                    if ((S === "http" || S === "claudeai-proxy") && ZRK(m)) {
                        if (i8(q, "MCP session expired (server returned 404 with session-not-found), triggering reconnection"), N("session expired"), G) G(m);
                        return
                    }
                    if (S === "sse" || S === "http" || S === "claudeai-proxy") {
                        if (m.message.includes("Maximum reconnection attempts")) {
                            if (N("SSE reconnection exhausted"), G) G(m);
                            return
                        }
                        if (R(m.message)) {
                            if (V.consecutiveErrors++, V.lastErrorAt = Date.now(), i8(q, `Terminal connection error ${V.consecutiveErrors}/${v}`), V.consecutiveErrors >= v) V.consecutiveErrors = 0, N("max consecutive terminal errors")
                        } else V.consecutiveErrors = 0
                    }
                    if (G) G(m)
                }, j.transport) {
                let m = j.transport.onmessage;
                j.transport.onmessage = (S, F) => {
                    if (V.lastErrorAt !== 0) V.lastErrorAt = 0, V.consecutiveErrors = 0;
                    m?.(S, F)
                }
            }
            j.onclose = () => {
                let m = Date.now() - D,
                    S = K.type ?? "unknown";
                i8(q, `${S.toUpperCase()} connection closed after ${Math.floor(m/1000)}s (${Z?"with errors":"cleanly"})`);
                let F = D98(q, K);
                if (NS.cache.delete(q), Es.cache.delete(q), HP6.cache.delete(q), JP6.cache.delete(q), OL.cache.delete(F), i8(q, "Cleared connection cache for reconnection"), f) f()
            };
            let h = async () => {
                if (Y) {
                    try {
                        await Y.close()
                    } catch (m) {
                        i8(q, `Error closing in-process server: ${m}`)
                    }
                    try {
                        await j.close()
                    } catch (m) {
                        i8(q, `Error closing client: ${m}`)
                    }
                    return
                }
                if (w && (K.type === "stdio" || !K.type)) A.stderr?.off("data", w);
                if (K.type === "stdio") try {
                    let S = A.pid;
                    if (S) {
                        i8(q, "Sending SIGINT to MCP server process");
                        try {
                            process.kill(S, "SIGINT")
                        } catch (F) {
                            i8(q, `Error sending SIGINT: ${F}`);
                            return
                        }
                        await new Promise(async (F) => {
                            let U = !1,
                                g = setInterval(() => {
                                    try {
                                        process.kill(S, 0)
                                    } catch {
                                        if (!U) U = !0, clearInterval(g), clearTimeout(c), i8(q, "MCP server process exited cleanly"), F()
                                    }
                                }, 50),
                                c = setTimeout(() => {
                                    if (!U) U = !0, clearInterval(g), i8(q, "Cleanup timeout reached, stopping process monitoring"), F()
                                }, 600);
                            try {
                                if (await l7(100), !U) {
                                    try {
                                        process.kill(S, 0), i8(q, "SIGINT failed, sending SIGTERM to MCP server process");
                                        try {
                                            process.kill(S, "SIGTERM")
                                        } catch (n) {
                                            i8(q, `Error sending SIGTERM: ${n}`), U = !0, clearInterval(g), clearTimeout(c), F();
                                            return
                                        }
                                    } catch {
                                        U = !0, clearInterval(g), clearTimeout(c), F();
                                        return
                                    }
                                    if (await l7(400), !U) try {
                                        process.kill(S, 0), i8(q, "SIGTERM failed, sending SIGKILL to MCP server process");
                                        try {
                                            process.kill(S, "SIGKILL")
                                        } catch (n) {
                                            i8(q, `Error sending SIGKILL: ${n}`)
                                        }
                                    } catch {
                                        U = !0, clearInterval(g), clearTimeout(c), F()
                                    }
                                }
                                if (!U) U = !0, clearInterval(g), clearTimeout(c), F()
                            } catch {
                                if (!U) U = !0, clearInterval(g), clearTimeout(c), F()
                            }
                        })
                    }
                } catch (m) {
                    i8(q, `Error terminating process: ${m}`)
                }
                try {
                    await j.close()
                } catch (m) {
                    i8(q, `Error closing client: ${m}`)
                }
            }, C = eq(h), x = async () => {
                C?.(), await h()
            }, B = Date.now() - z;
            return d("tengu_mcp_server_connection_succeeded", {
                connectionDurationMs: B,
                transportType: K.type ?? "stdio",
                totalServers: _?.totalServers,
                stdioCount: _?.stdioCount,
                sseCount: _?.sseCount,
                httpCount: _?.httpCount,
                sseIdeCount: _?.sseIdeCount,
                wsIdeCount: _?.wsIdeCount,
                ...W98(K)
            }), {
                name: q,
                client: j,
                type: "connected",
                capabilities: X ?? {},
                serverInfo: M,
                instructions: W,
                config: K,
                cleanup: x,
                transportErrorState: V
            }
        } catch (A) {
            let O = Date.now() - z;
            if (d("tengu_mcp_server_connection_failed", {
                    connectionDurationMs: O,
                    errorCode: A && typeof A === "object" && "code" in A && A.code !== void 0 ? String(A.code) : void 0,
                    totalServers: _?.totalServers || 1,
                    stdioCount: _?.stdioCount || (K.type === "stdio" ? 1 : 0),
                    sseCount: _?.sseCount || (K.type === "sse" ? 1 : 0),
                    httpCount: _?.httpCount || (K.type === "http" ? 1 : 0),
                    sseIdeCount: _?.sseIdeCount || (K.type === "sse-ide" ? 1 : 0),
                    wsIdeCount: _?.wsIdeCount || (K.type === "ws-ide" ? 1 : 0),
                    transportType: K.type ?? "stdio",
                    ...W98(K)
                }), i8(q, `Connection failed after ${O}ms: ${b6(A)}`), yz(q, `Connection failed: ${b6(A)}`), Y) Y.close().catch(() => {});
            return {
                name: q,
                type: "failed",
                config: K,
                error: b6(A)
            }
        }
    }, D98);
    NS = aX(async (q) => {
        if (q.type !== "connected") return [];
        try {
            if (!q.capabilities?.tools) return [];
            let K = await q.client.request({
                    method: "tools/list"
                }, bg6),
                _ = iI6(K.tools),
                z = q.config.type === "sdk" && S6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
            return _.map((Y) => {
                let A = tC(q.name, Y.name),
                    O = Y._meta?.["anthropic/maxResultSizeChars"],
                    w = typeof O === "number" && Number.isFinite(O) && O > 0;
                return {
                    ...Zz7,
                    name: z ? Y.name : A,
                    mcpInfo: {
                        serverName: q.name,
                        toolName: Y.name
                    },
                    isMcp: !0,
                    searchHint: typeof Y._meta?.["anthropic/searchHint"] === "string" ? Y._meta["anthropic/searchHint"].replace(/\s+/g, " ").trim() || void 0 : void 0,
                    alwaysLoad: Y._meta?.["anthropic/alwaysLoad"] === !0,
                    async description() {
                        return Y.description ?? ""
                    },
                    async prompt() {
                        let $ = Y.description ?? "";
                        return $.length > M98 ? $.slice(0, M98) + "… [truncated]" : $
                    },
                    isConcurrencySafe() {
                        return Y.annotations?.readOnlyHint ?? !1
                    },
                    isReadOnly() {
                        return Y.annotations?.readOnlyHint ?? !1
                    },
                    toAutoClassifierInput($) {
                        return cvY($, Y.name)
                    },
                    isDestructive() {
                        return Y.annotations?.destructiveHint ?? !1
                    },
                    isOpenWorld() {
                        return Y.annotations?.openWorldHint ?? !1
                    },
                    maxResultSizeChars: w ? Math.min(O, Vg1) : Zz7.maxResultSizeChars,
                    persistenceThresholdCeiling: w ? Vg1 : void 0,
                    inputJSONSchema: Y.inputSchema,
                    async checkPermissions() {
                        return {
                            behavior: "passthrough",
                            message: "MCPTool requires permission.",
                            suggestions: [{
                                type: "addRules",
                                rules: [{
                                    toolName: A,
                                    ruleContent: void 0
                                }],
                                behavior: "allow",
                                destination: "localSettings"
                            }]
                        }
                    },
                    async call($, j, H, J, X) {
                        let M = rvY(J),
                            P = M ? {
                                "claudecode/toolUseId": M
                            } : {};
                        if (X && M) X({
                            toolUseID: M,
                            data: {
                                type: "mcp_progress",
                                status: "started",
                                serverName: q.name,
                                toolName: Y.name
                            }
                        });
                        let W = Date.now(),
                            D = 1;
                        for (let Z = 0;; Z++) try {
                            let G = await Fy6(q),
                                f = await ivY({
                                    client: G,
                                    clientConnection: q,
                                    tool: Y.name,
                                    args: $,
                                    meta: P,
                                    signal: j.abortController.signal,
                                    setAppState: j.setAppState,
                                    imageLimits: vO(j.options.mainLoopModel),
                                    onProgress: X && M ? (v) => {
                                        X({
                                            toolUseID: M,
                                            data: v
                                        })
                                    } : void 0,
                                    handleElicitation: j.handleElicitation,
                                    hasResultSizeAnnotation: w
                                });
                            if (X && M) X({
                                toolUseID: M,
                                data: {
                                    type: "mcp_progress",
                                    status: "completed",
                                    serverName: q.name,
                                    toolName: Y.name,
                                    elapsedTimeMs: Date.now() - W
                                }
                            });
                            return {
                                data: f.content,
                                ...(f._meta || f.structuredContent) && {
                                    mcpMeta: {
                                        ...f._meta && {
                                            _meta: f._meta
                                        },
                                        ...f.structuredContent && {
                                            structuredContent: f.structuredContent
                                        }
                                    }
                                }
                            }
                        } catch (G) {
                            if (G instanceof oz7 && Z < D) {
                                i8(q.name, `Retrying tool '${Y.name}' after session recovery`);
                                continue
                            }
                            if (X && M) X({
                                toolUseID: M,
                                data: {
                                    type: "mcp_progress",
                                    status: "failed",
                                    serverName: q.name,
                                    toolName: Y.name,
                                    elapsedTimeMs: Date.now() - W
                                }
                            });
                            if (G instanceof Error && !(G instanceof XV)) {
                                let f = G.constructor.name;
                                if (f === "Error") throw new XV(G.message, G.message.slice(0, 200));
                                if (f === "McpError" && "code" in G && typeof G.code === "number") throw new XV(G.message, `McpError ${G.code}`)
                            }
                            throw G
                        }
                    },
                    userFacingName() {
                        let $ = Y.annotations?.title || Y.name;
                        return `${q.name} - ${$} (MCP)`
                    },
                    ...rH6(q.name) && (q.config.type === "stdio" || !q.config.type) ? LvY().getClaudeInChromeMCPToolOverrides(Y.name) : {},
                    ...(q.config.type === "stdio" || !q.config.type) && _$6(q.name) ? hvY().getComputerUseMCPToolOverrides(Y.name) : {},
                    ...phK(Y.name) ? FhK() : {}
                }
            }).filter(dvY)
        } catch (K) {
            return yz(q.name, `Failed to fetch tools: ${b6(K)}`), []
        }
    }, (q) => q.name, sl8), Es = aX(async (q) => {
        if (q.type !== "connected") return [];
        try {
            if (!q.capabilities?.resources) return [];
            let K = await q.client.request({
                method: "resources/list"
            }, yg6);
            if (!K.resources) return [];
            return K.resources.map((_) => ({
                ..._,
                server: q.name
            }))
        } catch (K) {
            return yz(q.name, `Failed to fetch resources: ${b6(K)}`), []
        }
    }, (q) => q.name, sl8), HP6 = aX(async (q) => {
        if (q.type !== "connected") return [];
        try {
            if (!q.capabilities?.resources) return [];
            let K = await q.client.request({
                method: "resources/templates/list"
            }, Lg6);
            if (!K.resourceTemplates) return [];
            return K.resourceTemplates.map((_) => ({
                ..._,
                server: q.name
            }))
        } catch (K) {
            return i8(q.name, `Failed to fetch resource templates: ${b6(K)}`), []
        }
    }, (q) => q.name, sl8);
    JP6 = aX(async (q) => {
        if (q.type !== "connected") return [];
        try {
            if (!q.capabilities?.prompts) return [];
            let K = await q.client.request({
                method: "prompts/list"
            }, Sg6);
            if (!K.prompts) return [];
            return iI6(K.prompts).map((z) => {
                let Y = Object.values(z.arguments ?? {}).map((A) => A.name);
                return {
                    type: "prompt",
                    name: "mcp__" + Pw(q.name) + "__" + z.name,
                    description: z.description ?? "",
                    hasUserSpecifiedDescription: !!z.description,
                    contentLength: 0,
                    isEnabled: () => !0,
                    isHidden: !1,
                    isMcp: !0,
                    progressMessage: "running",
                    userFacingName() {
                        return `${q.name}:${z.name} (MCP)`
                    },
                    argNames: Y,
                    source: "mcp",
                    async getPromptForCommand(A, O) {
                        let w = A.split(" ");
                        try {
                            let $ = await Fy6(q),
                                j = await $.client.getPrompt({
                                    name: z.name,
                                    arguments: QW4(Y, w)
                                }),
                                H = vO(O.options.mainLoopModel);
                            return (await Promise.all(j.messages.map((X) => kRK(X.content, $.name, H)))).flat()
                        } catch ($) {
                            throw yz(q.name, `Error running command '${z.name}': ${b6($)}`), $
                        }
                    }
                }
            })
        } catch (K) {
            return yz(q.name, `Failed to fetch commands: ${b6(K)}`), []
        }
    }, (q) => q.name, sl8)
})
// @from(Ln 419444, Col 0)
class mF {
    static instance;
    baseline = new Map;
    initialized = !1;
    mcpClient;
    lastProcessedTimestamps = new Map;
    rightFileDiagnosticsState = new Map;
    static getInstance() {
        if (!mF.instance) mF.instance = new mF;
        return mF.instance
    }
    initialize(q) {
        if (this.initialized) return;
        this.mcpClient = q, this.initialized = !0
    }
    async shutdown() {
        this.initialized = !1, this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear()
    }
    reset() {
        this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear()
    }
    normalizeFileUri(q) {
        let K = ["file://", "_claude_fs_right:", "_claude_fs_left:"],
            _ = q;
        for (let z of K)
            if (q.startsWith(z)) {
                _ = q.slice(z.length);
                break
            } return tX(_)
    }
    async ensureFileOpened(q) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        try {
            await Qp("openFile", {
                filePath: q,
                preview: !1,
                startText: "",
                endText: "",
                selectToEndOfLine: !1,
                makeFrontmost: !1
            }, this.mcpClient)
        } catch (K) {
            j6(K)
        }
    }
    async beforeFileEdited(q) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        let K = Date.now();
        try {
            let _ = await Qp("getDiagnostics", {
                    uri: `file://${q}`
                }, this.mcpClient),
                z = this.parseDiagnosticResult(_)[0];
            if (z) {
                if (!sm7(this.normalizeFileUri(q), this.normalizeFileUri(z.uri))) {
                    j6(new LRK(`Diagnostics file path mismatch: expected ${q}, got ${z.uri})`));
                    return
                }
                let Y = this.normalizeFileUri(q);
                this.baseline.set(Y, z.diagnostics), this.lastProcessedTimestamps.set(Y, K)
            } else {
                let Y = this.normalizeFileUri(q);
                this.baseline.set(Y, []), this.lastProcessedTimestamps.set(Y, K)
            }
        } catch (_) {}
    }
    async getNewDiagnostics() {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return [];
        let q = [];
        try {
            let Y = await Qp("getDiagnostics", {}, this.mcpClient);
            q = this.parseDiagnosticResult(Y)
        } catch (Y) {
            return []
        }
        let K = q.filter((Y) => this.baseline.has(this.normalizeFileUri(Y.uri))).filter((Y) => Y.uri.startsWith("file://")),
            _ = new Map;
        q.filter((Y) => this.baseline.has(this.normalizeFileUri(Y.uri))).filter((Y) => Y.uri.startsWith("_claude_fs_right:")).forEach((Y) => {
            _.set(this.normalizeFileUri(Y.uri), Y)
        });
        let z = [];
        for (let Y of K) {
            let A = this.normalizeFileUri(Y.uri),
                O = this.baseline.get(A) || [],
                w = _.get(A),
                $ = Y;
            if (w) {
                let H = this.rightFileDiagnosticsState.get(A);
                if (!H || !this.areDiagnosticArraysEqual(H, w.diagnostics)) $ = w;
                this.rightFileDiagnosticsState.set(A, w.diagnostics)
            }
            let j = $.diagnostics.filter((H) => !O.some((J) => this.areDiagnosticsEqual(H, J)));
            if (j.length > 0) z.push({
                uri: Y.uri,
                diagnostics: j
            });
            this.baseline.set(A, $.diagnostics)
        }
        return z
    }
    parseDiagnosticResult(q) {
        if (Array.isArray(q)) {
            let K = q.find((_) => _.type === "text");
            if (K && "text" in K) return n8(K.text)
        }
        return []
    }
    areDiagnosticsEqual(q, K) {
        return q.message === K.message && q.severity === K.severity && q.source === K.source && q.code === K.code && q.range.start.line === K.range.start.line && q.range.start.character === K.range.start.character && q.range.end.line === K.range.end.line && q.range.end.character === K.range.end.character
    }
    areDiagnosticArraysEqual(q, K) {
        if (q.length !== K.length) return !1;
        return q.every((_) => K.some((z) => this.areDiagnosticsEqual(_, z))) && K.every((_) => q.some((z) => this.areDiagnosticsEqual(z, _)))
    }
    async handleQueryStart(q) {
        if (!this.initialized) {
            let K = ky(q);
            if (K) this.initialize(K)
        } else this.reset()
    }
    static formatDiagnosticsSummary(q) {
        let _ = q.map((z) => {
            let Y = z.uri.split("/").pop() || z.uri,
                A = z.diagnostics.map((O) => {
                    return `  ${mF.getSeveritySymbol(O.severity)} [Line ${O.range.start.line+1}:${O.range.start.character+1}] ${O.message}${O.code?` [${O.code}]`:""}${O.source?` (${O.source})`:""}`
                }).join(`
`);
            return `${Y}:
${A}`
        }).join(`

`);
        if (_.length > yRK) return _.slice(0, yRK - 12) + "…[truncated]";
        return _
    }
    static getSeveritySymbol(q) {
        return {
            Error: e6.cross,
            Warning: e6.warning,
            Info: e6.info,
            Hint: e6.star
        } [q] || e6.bullet
    }
}
// @from(Ln 419588, Col 4)
LRK
// @from(Ln 419588, Col 9)
yRK = 4000
// @from(Ln 419589, Col 4)
we
// @from(Ln 419590, Col 4)
aX6 = L(() => {
    Qq();
    U8();
    oW();
    m8();
    eK();
    kj();
    e8();
    LRK = class LRK extends sp6 {};
    we = mF.getInstance()
})
// @from(Ln 419602, Col 0)
function hRK(q, K, _) {
    if (!tl8(q)) return null;
    if (!hO1(K).isValid) return null;
    let Y = _(),
        A = hO1(Y);
    if (!A.isValid) return {
        result: !1,
        message: `Claude Code settings.json validation failed after edit:
${A.error}

Full schema:
${A.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
        errorCode: 10
    };
    return null
}
// @from(Ln 419619, Col 4)
RRK = L(() => {
    Sz();
    pQ6()
})
// @from(Ln 419624, Col 0)
function ovY() {
    return `
- You must use your \`${xq}\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file.`
}
// @from(Ln 419629, Col 0)
function SRK() {
    return avY()
}
// @from(Ln 419633, Col 0)
function avY() {
    let q = BY1() ? "line number + tab" : "spaces + line number + arrow",
        K = u8("tengu_edit_minimalanchor_jrn", !1) ? "\n- Keep `old_string` minimal — usually 1-3 lines, only enough to be unique in the file. Including excess context wastes tokens and is an error.\n- The edit will FAIL if `old_string` is not unique in the file. In that case, add the minimum extra context needed for uniqueness, or use `replace_all` to change every instance." : "\n- The edit will FAIL if `old_string` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use `replace_all` to change every instance of `old_string`.";
    return `Performs exact string replacements in files.

Usage:${ovY()}
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: ${q}. Everything after that is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.${K}
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`
}
// @from(Ln 419644, Col 4)
CRK = L(() => {
    B1();
    eK();
    Rz()
})
// @from(Ln 419650, Col 0)
function el8(q) {
    if (!q) return "Update";
    if (q.file_path?.startsWith(aO())) return "Updated plan";
    if (q.edits != null) return "Update";
    if (q.old_string === "") return "Create";
    return "Update"
}
// @from(Ln 419658, Col 0)
function KY7(q) {
    if (!q?.file_path) return null;
    return S3(q.file_path)
}
// @from(Ln 419663, Col 0)
function bRK({
    file_path: q
}, {
    verbose: K
}) {
    if (!q) return null;
    if (q.startsWith(aO())) return "";
    return BA.createElement(YG, {
        filePath: q
    }, K ? q : S3(q))
}
// @from(Ln 419675, Col 0)
function IRK({
    filePath: q = "",
    structuredPatch: K,
    originalFile: _
}, z, {
    style: Y,
    verbose: A
}) {
    if (!q) return null;
    let O = q.startsWith(aO());
    return BA.createElement(uU8, {
        filePath: q,
        structuredPatch: K,
        firstLine: _ ? oY(_) : null,
        fileContent: _ || void 0,
        style: Y,
        verbose: A,
        previewHint: O ? "/plan to preview" : void 0
    })
}
// @from(Ln 419696, Col 0)
function xRK(q, K) {
    let {
        style: _,
        verbose: z
    } = K, Y = q.file_path, A = q.old_string ?? "", O = q.new_string ?? "", w = q.replace_all ?? !1;
    if ("edits" in q && q.edits != null) return BA.createElement(Q96, {
        file_path: Y,
        operation: "update",
        firstLine: null,
        verbose: z
    });
    if (A === "") return BA.createElement(Q96, {
        file_path: Y,
        operation: "write",
        content: O,
        firstLine: oY(O),
        verbose: z
    });
    return BA.createElement(svY, {
        filePath: Y,
        oldString: A,
        newString: O,
        replaceAll: w,
        style: _,
        verbose: z
    })
}
// @from(Ln 419724, Col 0)
function uRK(q, K) {
    let {
        verbose: _
    } = K;
    if (!_ && typeof q === "string" && vK(q, "tool_use_error")) {
        let z = vK(q, "tool_use_error");
        if (z?.includes("File has not been read yet")) return BA.createElement(_1, null, BA.createElement(T, {
            dimColor: !0
        }, "File must be read first"));
        if (z?.includes(Ov)) return BA.createElement(_1, null, BA.createElement(T, {
            color: "error"
        }, "File not found"));
        return BA.createElement(_1, null, BA.createElement(T, {
            color: "error"
        }, "Error editing file"))
    }
    return BA.createElement(d$, {
        result: q,
        verbose: _
    })
}
// @from(Ln 419746, Col 0)
function svY(q) {
    let K = s(16),
        {
            filePath: _,
            oldString: z,
            newString: Y,
            replaceAll: A,
            style: O,
            verbose: w
        } = q,
        $;
    if (K[0] !== _ || K[1] !== Y || K[2] !== z || K[3] !== A) $ = () => evY(_, z, Y, A), K[0] = _, K[1] = Y, K[2] = z, K[3] = A, K[4] = $;
    else $ = K[4];
    let [j] = aI6.useState($), H;
    if (K[5] !== _ || K[6] !== w) H = BA.createElement(Q96, {
        file_path: _,
        operation: "update",
        firstLine: null,
        verbose: w
    }), K[5] = _, K[6] = w, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] !== j || K[9] !== _ || K[10] !== O || K[11] !== w) J = BA.createElement(tvY, {
        promise: j,
        filePath: _,
        style: O,
        verbose: w
    }), K[8] = j, K[9] = _, K[10] = O, K[11] = w, K[12] = J;
    else J = K[12];
    let X;
    if (K[13] !== H || K[14] !== J) X = BA.createElement(aI6.Suspense, {
        fallback: H
    }, J), K[13] = H, K[14] = J, K[15] = X;
    else X = K[15];
    return X
}
// @from(Ln 419783, Col 0)
function tvY(q) {
    let K = s(7),
        {
            promise: _,
            filePath: z,
            style: Y,
            verbose: A
        } = q,
        {
            patch: O,
            firstLine: w,
            fileContent: $
        } = aI6.use(_),
        j;
    if (K[0] !== $ || K[1] !== z || K[2] !== w || K[3] !== O || K[4] !== Y || K[5] !== A) j = BA.createElement(Q96, {
        file_path: z,
        operation: "update",
        patch: O,
        firstLine: w,
        fileContent: $,
        style: Y,
        verbose: A
    }), K[0] = $, K[1] = z, K[2] = w, K[3] = O, K[4] = Y, K[5] = A, K[6] = j;
    else j = K[6];
    return j
}
// @from(Ln 419809, Col 0)
async function evY(q, K, _, z) {
    try {
        let Y = await JPK(q, K, hh6);
        if (Y === null || Y.truncated || Y.content === "") {
            let {
                patch: $
            } = Q88({
                filePath: q,
                fileContents: K,
                oldString: K,
                newString: _
            });
            return {
                patch: $,
                firstLine: null,
                fileContent: void 0
            }
        }
        let A = lH6(Y.content, K) || K,
            O = Rh6(K, A, _),
            {
                patch: w
            } = Q88({
                filePath: q,
                fileContents: Y.content,
                oldString: A,
                newString: O,
                replaceAll: z
            });
        return {
            patch: _I8(w, Y.lineOffset - 1),
            firstLine: Y.lineOffset === 1 ? oY(Y.content) : null,
            fileContent: Y.content
        }
    } catch (Y) {
        return j6(Y), {
            patch: [],
            firstLine: null,
            fileContent: void 0
        }
    }
}
// @from(Ln 419851, Col 4)
BA
// @from(Ln 419851, Col 8)
aI6
// @from(Ln 419852, Col 4)
_Y7 = L(() => {
    o6();
    L47();
    GK();
    _7();
    ny();
    y47();
    S96();
    g6();
    Rc();
    eK();
    U8();
    NJ();
    FU8();
    Q56();
    BA = K6(P6(), 1), aI6 = K6(P6(), 1)
})
// @from(Ln 419875, Col 0)
function _TY(q) {
    try {
        let K = iC(q);
        return {
            content: K.content,
            fileExists: !0,
            encoding: K.encoding,
            lineEndings: K.lineEndings
        }
    } catch (K) {
        if (t1(K)) return {
            content: "",
            fileExists: !1,
            encoding: "utf8",
            lineEndings: "LF"
        };
        throw K
    }
}
// @from(Ln 419894, Col 4)
mRK = 1073741824
// @from(Ln 419895, Col 4)
mM
// @from(Ln 419896, Col 4)
A_6 = L(() => {
    C8();
    Vy6();
    aX6();
    uh6();
    nl();
    vy6();
    ol();
    gq();
    n7();
    K8();
    Rc();
    Q8();
    m8();
    eK();
    cy();
    LU8();
    nN();
    FP();
    c7();
    Yq();
    SU8();
    U8();
    b9();
    Sz();
    NK6();
    RRK();
    Rz();
    CRK();
    A58();
    _Y7();
    Q56();
    mM = Iq({
        name: J4,
        searchHint: "modify file contents in place",
        maxResultSizeChars: 1e5,
        strict: !0,
        async description() {
            return "A tool for editing files"
        },
        async prompt() {
            return SRK()
        },
        userFacingName: el8,
        getToolUseSummary: KY7,
        getActivityDescription(q) {
            let K = KY7(q);
            return K ? `Editing ${K}` : "Editing file"
        },
        get inputSchema() {
            return CU8()
        },
        get outputSchema() {
            return v47()
        },
        stripForStorage(q) {
            if (typeof q !== "object" || q === null) return q;
            if ((q.originalFile ?? "") === "") return q;
            return {
                ...q,
                originalFile: ""
            }
        },
        toAutoClassifierInput(q) {
            return `${q.file_path}: ${q.new_string}`
        },
        getPath(q) {
            return q.file_path
        },
        backfillObservableInput(q) {
            if (typeof q.file_path === "string") q.file_path = Wq(q.file_path)
        },
        async preparePermissionMatcher({
            file_path: q
        }) {
            return (K) => Vk(K, q)
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return PM6(mM, q, _.toolPermissionContext)
        },
        renderToolUseMessage: bRK,
        renderToolResultMessage: IRK,
        renderToolUseRejectedMessage: xRK,
        renderToolUseErrorMessage: uRK,
        async validateInput(q, K) {
            let {
                file_path: _,
                old_string: z,
                new_string: Y,
                replace_all: A = !1
            } = q, O = Wq(_), w = yU8(O, Y);
            if (w) return {
                result: !1,
                message: w,
                errorCode: 0
            };
            if (z === Y) return {
                result: !1,
                behavior: "ask",
                message: "No changes to make: old_string and new_string are exactly the same.",
                errorCode: 1
            };
            let $ = K.getAppState();
            if (ZJ(O, $.toolPermissionContext, "edit", "deny") !== null) return {
                result: !1,
                behavior: "ask",
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 2
            };
            if (O.startsWith("\\\\") || O.startsWith("//")) return {
                result: !0
            };
            let H = V8();
            try {
                let {
                    size: Z,
                    mode: G
                } = await H.stat(O);
                if (Z > mRK) return {
                    result: !1,
                    behavior: "ask",
                    message: `File is too large to edit (${o4(Z)}). Maximum editable file size is ${o4(mRK)}.`,
                    errorCode: 10
                };
                if (gf6(G)) return {
                    result: !1,
                    behavior: "ask",
                    message: Ff6,
                    errorCode: 11
                }
            } catch (Z) {
                if (!t1(Z)) throw Z
            }
            let J;
            try {
                let Z = await H.readFileBytes(O),
                    G = Z.length >= 2 && Z[0] === 255 && Z[1] === 254 ? "utf16le" : "utf8";
                J = Z.toString(G).replaceAll(`\r
`, `
`)
            } catch (Z) {
                if (t1(Z)) J = null;
                else throw Z
            }
            if (J === null) {
                if (z === "") return {
                    result: !0
                };
                let Z = GJ8(O),
                    G = await C16(O),
                    f = `File does not exist. ${Ov} ${b8()}.`;
                if (G) f += ` Did you mean ${G}?`;
                else if (Z) f += ` Did you mean ${Z}?`;
                return {
                    result: !1,
                    behavior: "ask",
                    message: f,
                    errorCode: 4
                }
            }
            if (z === "") {
                if (J.trim() !== "") return {
                    result: !1,
                    behavior: "ask",
                    message: "Cannot create new file - file already exists.",
                    errorCode: 3
                };
                return {
                    result: !0
                }
            }
            if (O.endsWith(".ipynb")) return {
                result: !1,
                behavior: "ask",
                message: `File is a Jupyter Notebook. Use the ${HJ} to edit this file.`,
                errorCode: 5
            };
            let X = K.readFileState.get(O);
            if (!X || X.isPartialView) return {
                result: !1,
                behavior: "ask",
                message: "File has not been read yet. Read it first before writing to it.",
                meta: {
                    isFilePathAbsolute: String(zY7(_))
                },
                errorCode: 6
            };
            if (X) {
                if (Av(O) > X.timestamp)
                    if ((X.offset ?? 1) <= 1 && X.limit === void 0 && Ac(X, J));
                    else return {
                        result: !1,
                        behavior: "ask",
                        message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                        errorCode: 7
                    }
            }
            let M = J,
                P = lH6(M, z);
            if (!P) return {
                result: !1,
                behavior: "ask",
                message: `String to replace not found in file.
String: ${z}`,
                meta: {
                    isFilePathAbsolute: String(zY7(_))
                },
                errorCode: 8
            };
            let W = M.split(P).length - 1;
            if (W > 1 && !A) return {
                result: !1,
                behavior: "ask",
                message: `Found ${W} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${z}`,
                meta: {
                    isFilePathAbsolute: String(zY7(_)),
                    actualOldString: P
                },
                errorCode: 9
            };
            let D = hRK(O, M, () => {
                return A ? M.replaceAll(P, Y) : M.replace(P, Y)
            });
            if (D !== null) return D;
            return {
                result: !0,
                meta: {
                    actualOldString: P
                }
            }
        },
        inputsEquivalent(q, K) {
            return CS4({
                file_path: q.file_path,
                edits: [{
                    old_string: q.old_string,
                    new_string: q.new_string,
                    replace_all: q.replace_all ?? !1
                }]
            }, {
                file_path: K.file_path,
                edits: [{
                    old_string: K.old_string,
                    new_string: K.new_string,
                    replace_all: K.replace_all ?? !1
                }]
            })
        },
        async call(q, {
            readFileState: K,
            userModified: _,
            getFileHistoryState: z,
            applyFileHistoryOp: Y,
            dynamicSkillDirTriggers: A
        }, O, w) {
            let {
                file_path: $,
                old_string: j,
                new_string: H,
                replace_all: J = !1
            } = q, X = V8(), M = Wq($), P = b8();
            if (!S6(process.env.CLAUDE_CODE_SIMPLE)) {
                let x = await vb6([M], P);
                if (x.length > 0) {
                    for (let B of x) A?.add(B);
                    Tb6(x).catch(() => {})
                }
                Vb6([M], P)
            }
            if (await we.beforeFileEdited(M), await X.mkdir(qTY(M)), kO()) await M96(z, Y, M, w.uuid);
            let {
                content: W,
                fileExists: D,
                encoding: Z,
                lineEndings: G
            } = _TY(M);
            if (D) {
                let x = K.get(M);
                if (!x) throw Error(NL8);
                if (Av(M) > x.timestamp) {
                    if (!((x.offset ?? 1) <= 1 && x.limit === void 0 && Ac(x, W))) throw Error(EL8)
                }
            }
            let f = lH6(W, j) || j,
                v = Rh6(j, f, H),
                V = Q88({
                    filePath: M,
                    fileContents: W,
                    oldString: f,
                    newString: v,
                    replaceAll: J
                }),
                k = XR8(M, V.updatedFile),
                N = k === V.updatedFile ? V.patch : U56({
                    filePath: M,
                    oldContent: W,
                    newContent: k,
                    convertTabs: !0
                });
            S16(M, k, Z, G);
            let R = F96();
            if (R) kI8(M), NI8(M), R.changeFile(M, k).catch((x) => {
                E(`LSP: Failed to notify server of file change for ${M}: ${x.message}`), j6(x)
            }), R.saveFile(M).catch((x) => {
                E(`LSP: Failed to notify server of file save for ${M}: ${x.message}`), j6(x)
            });
            if (EK6(M, W, k), K.set(M, {
                    content: k,
                    timestamp: Av(M),
                    offset: void 0,
                    limit: void 0
                }), M.endsWith(`${KTY}CLAUDE.md`)) d("tengu_write_claudemd", {});
            g88(N), cF({
                operation: "edit",
                tool: "FileEditTool",
                filePath: M
            }), d("tengu_edit_string_lengths", {
                oldStringBytes: Buffer.byteLength(j, "utf8"),
                newStringBytes: Buffer.byteLength(H, "utf8"),
                replaceAll: J
            });
            let h;
            if (S6(process.env.CLAUDE_CODE_REMOTE)) {
                let x = Date.now(),
                    B = await RU8(M);
                if (B) h = B;
                d("tengu_tool_use_diff_computed", {
                    isEditTool: !0,
                    durationMs: Date.now() - x,
                    hasDiff: !!B
                })
            }
            return {
                data: {
                    filePath: $,
                    oldString: f,
                    newString: H,
                    originalFile: W,
                    structuredPatch: N,
                    userModified: _ ?? !1,
                    replaceAll: J,
                    ...h && {
                        gitDiff: h
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let {
                filePath: _,
                userModified: z,
                replaceAll: Y
            } = q, A = z ? ".  The user modified your proposed changes before accepting them. " : "", O = qN6() && !z ? ok8 : "";
            if (Y) return {
                tool_use_id: K,
                type: "tool_result",
                content: `The file ${_} has been updated${A}. All occurrences were successfully replaced.${O}`
            };
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `The file ${_} has been updated successfully${A}.${O}`
            }
        }
    })
})
// @from(Ln 420265, Col 0)
function I96() {
    return zTY ??= [Kz, hX, mM, Au, _N, KK, Ou]
}
// @from(Ln 420268, Col 4)
zTY
// @from(Ln 420269, Col 4)
bK8 = L(() => {
    AZ();
    A_6();
    aF();
    rl();
    yb6();
    c96();
    DM6()
})
// @from(Ln 420278, Col 4)
BRK = {}
// @from(Ln 420286, Col 0)
function YTY(q) {
    let K = q;
    if (!K) return !1;
    if (K.path && Ae6(K.path)) return !0;
    return !1
}
// @from(Ln 420293, Col 0)
function ATY(q, K) {
    if (q !== IK && q !== J4) return !1;
    let _ = K,
        z = _?.file_path ?? _?.path;
    return z !== void 0 && Ae6(z)
}
// @from(Ln 420300, Col 0)
function OTY(q, K, _) {
    let z = q.teamMemoryReadCount ?? 0,
        Y = q.teamMemorySearchCount ?? 0,
        A = q.teamMemoryWriteCount ?? 0;
    if (z > 0) {
        let O = K ? _.length === 0 ? "Recalling" : "recalling" : _.length === 0 ? "Recalled" : "recalled";
        _.push(`${O} ${z} team ${z===1?"memory":"memories"}`)
    }
    if (Y > 0) {
        let O = K ? _.length === 0 ? "Searching" : "searching" : _.length === 0 ? "Searched" : "searched";
        _.push(`${O} team memories`)
    }
    if (A > 0) {
        let O = K ? _.length === 0 ? "Writing" : "writing" : _.length === 0 ? "Wrote" : "wrote";
        _.push(`${O} ${A} team ${A===1?"memory":"memories"}`)
    }
}
// @from(Ln 420317, Col 4)
pRK = L(() => {
    ev();
    u$()
})
// @from(Ln 420322, Col 0)
function wTY(q) {
    let K = q;
    return K?.file_path ?? K?.path
}
// @from(Ln 420327, Col 0)
function $TY(q) {
    let K = q;
    if (!K) return !1;
    if (K.path) {
        if (AP6(K.path) || l_7(K.path)) return !0
    }
    if (K.glob && uyK(K.glob)) return !0;
    if (K.command && xyK(K.command)) return !0;
    return !1
}
// @from(Ln 420338, Col 0)
function jTY(q, K) {
    if (q !== IK && q !== J4) return !1;
    let _ = wTY(K);
    return _ !== void 0 && AP6(_)
}
// @from(Ln 420344, Col 0)
function YY7(q) {
    let K = "$ " + q.split(`
`).map((_) => _.replace(/\s+/g, " ").trim()).filter((_) => _ !== "").join(`
`);
    return K.length > FRK ? K.slice(0, FRK - 1) + "…" : K
}
// @from(Ln 420351, Col 0)
function V_6(q, K, _) {
    if (q === GO) return {
        isCollapsible: !0,
        isSearch: !1,
        isRead: !1,
        isList: !1,
        isREPL: !0,
        isMemoryWrite: !1,
        isAbsorbedSilently: !0
    };
    if (jTY(q, K)) return {
        isCollapsible: !0,
        isSearch: !1,
        isRead: !1,
        isList: !1,
        isREPL: !1,
        isMemoryWrite: !0,
        isAbsorbedSilently: !1
    };
    if (lq() && q === Zj) return {
        isCollapsible: !0,
        isSearch: !1,
        isRead: !1,
        isList: !1,
        isREPL: !1,
        isMemoryWrite: !1,
        isAbsorbedSilently: !0
    };
    let z = rK(_, q) ?? rK(I96(), q);
    if (z?.isMcp) return {
        isCollapsible: !0,
        isSearch: !1,
        isRead: !1,
        isList: !1,
        isREPL: !1,
        isMemoryWrite: !1,
        isAbsorbedSilently: !1,
        mcpServerName: z.mcpInfo?.serverName
    };
    if (!z?.isSearchOrReadCommand) return {
        isCollapsible: !1,
        isSearch: !1,
        isRead: !1,
        isList: !1,
        isREPL: !1,
        isMemoryWrite: !1,
        isAbsorbedSilently: !1
    };
    let Y = z.isSearchOrReadCommand(K),
        A = Y.isList ?? !1,
        O = Y.isSearch || Y.isRead || A;
    return {
        isCollapsible: O || (lq() ? q === S7 : !1),
        isSearch: Y.isSearch,
        isRead: Y.isRead,
        isList: A,
        isREPL: !1,
        isMemoryWrite: !1,
        isAbsorbedSilently: !1,
        isBash: lq() ? !O && q === S7 : void 0
    }
}
// @from(Ln 420414, Col 0)
function pK8(q, K) {
    if (q?.type === "tool_use" && q.name) {
        let _ = V_6(q.name, q.input, K);
        if (_.isCollapsible || _.isREPL) return {
            isSearch: _.isSearch,
            isRead: _.isRead,
            isList: _.isList,
            isREPL: _.isREPL,
            isMemoryWrite: _.isMemoryWrite,
            isAbsorbedSilently: _.isAbsorbedSilently,
            mcpServerName: _.mcpServerName,
            isBash: _.isBash
        }
    }
    return null
}
// @from(Ln 420431, Col 0)
function qn8(q, K, _) {
    return V_6(q, K, _).isCollapsible
}
// @from(Ln 420435, Col 0)
function HTY(q, K) {
    if (q.type === "assistant") {
        let _ = q.message.content[0],
            z = pK8(_, K);
        if (z && _?.type === "tool_use") return {
            name: _.name,
            input: _.input,
            ...z
        }
    }
    if (q.type === "grouped_tool_use") {
        let _ = q.messages[0]?.message.content[0],
            z = pK8(_ ? {
                type: "tool_use",
                name: q.toolName,
                input: _.input
            } : void 0, K);
        if (z && _?.type === "tool_use") return {
            name: q.toolName,
            input: _.input,
            ...z
        }
    }
    return null
}
// @from(Ln 420461, Col 0)
function dRK(q) {
    if (q.type === "assistant") {
        let K = q.message.content[0];
        if (K?.type === "text" && K.text.trim().length > 0) return !0
    }
    return !1
}
// @from(Ln 420469, Col 0)
function JTY(q, K) {
    if (q.type === "assistant") {
        let _ = q.message.content[0];
        if (_?.type === "tool_use" && !qn8(_.name, _.input, K)) return !0
    }
    if (q.type === "grouped_tool_use") {
        let _ = q.messages[0]?.message.content[0];
        if (_?.type === "tool_use" && !qn8(q.toolName, _.input, K)) return !0
    }
    return !1
}
// @from(Ln 420481, Col 0)
function XTY(q) {
    return q.type === "system" && q.subtype === "stop_hook_summary" && q.hookLabel === "PreToolUse"
}
// @from(Ln 420485, Col 0)
function cRK(q) {
    return q.length > 0 && q.every((K) => K.path.startsWith("<synthesis:"))
}
// @from(Ln 420489, Col 0)
function MTY(q) {
    if (q.type === "assistant") {
        let K = q.message.content[0];
        if (K?.type === "thinking" || K?.type === "redacted_thinking") return !0
    }
    if (q.type === "attachment") return !0;
    if (q.type === "system") return !0;
    return !1
}
// @from(Ln 420499, Col 0)
function PTY(q, K) {
    if (q.type === "assistant") {
        let _ = q.message.content[0];
        return _?.type === "tool_use" && qn8(_.name, _.input, K)
    }
    if (q.type === "grouped_tool_use") {
        let _ = q.messages[0]?.message.content[0];
        return _?.type === "tool_use" && qn8(q.toolName, _.input, K)
    }
    return !1
}
// @from(Ln 420511, Col 0)
function WTY(q, K) {
    if (q.type === "user") {
        let _ = q.message.content.filter((z) => z.type === "tool_result");
        return _.length > 0 && _.every((z) => K.has(z.tool_use_id))
    }
    return !1
}
// @from(Ln 420519, Col 0)
function AY7(q) {
    if (q.type === "assistant") {
        let K = q.message.content[0];
        if (K?.type === "tool_use") return [K.id]
    }
    if (q.type === "grouped_tool_use") return q.messages.map((K) => {
        let _ = K.message.content[0];
        return _.type === "tool_use" ? _.id : ""
    }).filter(Boolean);
    return []
}
// @from(Ln 420531, Col 0)
function Kb6(q) {
    let K = [];
    for (let _ of q.messages) K.push(...AY7(_));
    return K
}
// @from(Ln 420537, Col 0)
function OY7(q, K) {
    return Kb6(q).some((_) => K.has(_))
}
// @from(Ln 420541, Col 0)
function lRK(q) {
    let K = q.displayMessage;
    if (K.type === "grouped_tool_use") return K.displayMessage;
    return K
}
// @from(Ln 420547, Col 0)
function sI6(q) {
    if (q.type === "grouped_tool_use") return q.messages.length;
    return 1
}
// @from(Ln 420552, Col 0)
function DTY(q) {
    let K = [];
    if (q.type === "assistant") {
        let _ = q.message.content[0];
        if (_?.type === "tool_use") {
            let z = _.input;
            if (z?.file_path) K.push(z.file_path)
        }
    } else if (q.type === "grouped_tool_use")
        for (let _ of q.messages) {
            let z = _.message.content[0];
            if (z?.type === "tool_use") {
                let Y = z.input;
                if (Y?.file_path) K.push(Y.file_path)
            }
        }
    return K
}
// @from(Ln 420571, Col 0)
function ZTY(q, K) {
    if (q.type !== "user") return;
    let _ = q.toolUseResult;
    if (!_?.stdout && !_?.stderr) return;
    let z = (_.stdout ?? "") + `
` + (_.stderr ?? "");
    for (let Y of q.message.content) {
        if (Y.type !== "tool_result") continue;
        let A = K.bashCommands?.get(Y.tool_use_id);
        if (!A) continue;
        let {
            commit: O,
            push: w,
            branch: $,
            pr: j
        } = hd4(A, z);
        if (O) K.commits?.push(O);
        if (w) K.pushes?.push(w);
        if ($) K.branches?.push($);
        if (j) K.prs?.push(j);
        if (O || w || $ || j) K.gitOpBashCount = (K.gitOpBashCount ?? 0) + 1
    }
}
// @from(Ln 420595, Col 0)
function gRK() {
    let q = {
        messages: [],
        searchCount: 0,
        readFilePaths: new Set,
        readOperationCount: 0,
        listCount: 0,
        toolUseIds: new Set,
        memorySearchCount: 0,
        memoryReadFilePaths: new Set,
        memoryWriteCount: 0,
        nonMemSearchArgs: [],
        latestDisplayHint: void 0,
        hookTotalMs: 0,
        hookCount: 0,
        hookInfos: []
    };
    if (q.teamMemorySearchCount = 0, q.teamMemoryReadFilePaths = new Set, q.teamMemoryWriteCount = 0, q.mcpCallCount = 0, q.mcpServerNames = new Set, lq()) q.bashCount = 0, q.bashCommands = new Map, q.commits = [], q.pushes = [], q.branches = [], q.prs = [], q.gitOpBashCount = 0;
    return q
}
// @from(Ln 420616, Col 0)
function fTY(q) {
    let K = q.messages[0],
        _ = q.readFilePaths.size > 0 ? q.readFilePaths.size : q.readOperationCount,
        z = q.memoryReadFilePaths.size,
        Y = z + (q.relevantMemories?.length ?? 0),
        A = q.teamMemoryReadFilePaths,
        O = [...q.readFilePaths].filter((J) => !q.memoryReadFilePaths.has(J) && !(A?.has(J) ?? !1)),
        w = q.teamMemorySearchCount ?? 0,
        $ = q.teamMemoryReadFilePaths?.size ?? 0,
        j = q.teamMemoryWriteCount ?? 0,
        H = {
            type: "collapsed_read_search",
            searchCount: Math.max(0, q.searchCount - q.memorySearchCount - w),
            readCount: Math.max(0, _ - z - $),
            listCount: q.listCount,
            replCount: 0,
            memorySearchCount: q.memorySearchCount,
            memoryReadCount: Y,
            memoryWriteCount: q.memoryWriteCount,
            readFilePaths: O,
            searchArgs: q.nonMemSearchArgs,
            latestDisplayHint: q.latestDisplayHint,
            messages: q.messages,
            displayMessage: K,
            uuid: `collapsed-${K.uuid}`,
            timestamp: K.timestamp
        };
    if (H.teamMemorySearchCount = w, H.teamMemoryReadCount = $, H.teamMemoryWriteCount = j, (q.mcpCallCount ?? 0) > 0) H.mcpCallCount = q.mcpCallCount, H.mcpServerNames = [...q.mcpServerNames ?? []];
    if (lq()) {
        if ((q.bashCount ?? 0) > 0) H.bashCount = q.bashCount, H.gitOpBashCount = q.gitOpBashCount;
        if ((q.commits?.length ?? 0) > 0) H.commits = q.commits;
        if ((q.pushes?.length ?? 0) > 0) H.pushes = q.pushes;
        if ((q.branches?.length ?? 0) > 0) H.branches = q.branches;
        if ((q.prs?.length ?? 0) > 0) H.prs = q.prs
    }
    if (q.hookCount > 0) H.hookTotalMs = q.hookTotalMs, H.hookCount = q.hookCount, H.hookInfos = q.hookInfos;
    if (q.relevantMemories && q.relevantMemories.length > 0) H.relevantMemories = q.relevantMemories;
    return H
}
// @from(Ln 420656, Col 0)
function nRK(q, K) {
    let _ = [],
        z = gRK(),
        Y = [];

    function A() {
        if (z.messages.length === 0) return;
        _.push(fTY(z));
        for (let O of Y) _.push(O);
        Y = [], z = gRK()
    }
    for (let O of q)
        if (PTY(O, K)) {
            let w = HTY(O, K);
            if (w.isMemoryWrite) {
                let $ = sI6(O);
                if (f98?.isTeamMemoryWriteOrEdit(w.name, w.input)) z.teamMemoryWriteCount = (z.teamMemoryWriteCount ?? 0) + $;
                else z.memoryWriteCount += $
            } else if (w.isAbsorbedSilently);
            else if (w.mcpServerName) {
                let $ = sI6(O);
                z.mcpCallCount = (z.mcpCallCount ?? 0) + $, z.mcpServerNames?.add(w.mcpServerName);
                let j = w.input;
                if (j?.query) z.latestDisplayHint = `"${j.query}"`
            } else if (lq() && w.isBash) {
                let $ = sI6(O);
                z.bashCount = (z.bashCount ?? 0) + $;
                let j = w.input;
                if (j?.command) {
                    z.latestDisplayHint = wR8(j.command) ?? YY7(j.command);
                    for (let H of AY7(O)) z.bashCommands?.set(H, j.command)
                }
            } else if (w.isList) {
                z.listCount += sI6(O);
                let $ = w.input;
                if ($?.command) z.latestDisplayHint = YY7($.command)
            } else if (w.isSearch) {
                let $ = sI6(O);
                if (z.searchCount += $, f98?.isTeamMemorySearch(w.input)) z.teamMemorySearchCount = (z.teamMemorySearchCount ?? 0) + $;
                else if ($TY(w.input)) z.memorySearchCount += $;
                else {
                    let j = w.input;
                    if (j?.pattern) z.nonMemSearchArgs.push(j.pattern), z.latestDisplayHint = `"${j.pattern}"`
                }
            } else {
                let $ = DTY(O);
                for (let j of $)
                    if (z.readFilePaths.add(j), f98?.isTeamMemFile(j)) z.teamMemoryReadFilePaths?.add(j);
                    else if (AP6(j)) z.memoryReadFilePaths.add(j);
                else z.latestDisplayHint = S3(j);
                if ($.length === 0) {
                    z.readOperationCount += sI6(O);
                    let j = w.input;
                    if (j?.command) z.latestDisplayHint = YY7(j.command)
                }
            }
            for (let $ of AY7(O)) z.toolUseIds.add($);
            z.messages.push(O)
        } else if (WTY(O, z.toolUseIds)) {
        if (z.messages.push(O), lq() && z.bashCommands?.size) ZTY(O, z)
    } else if (z.messages.length > 0 && XTY(O)) z.hookCount += O.hookCount, z.hookTotalMs += O.totalDurationMs ?? O.hookInfos.reduce((w, $) => w + ($.durationMs ?? 0), 0), z.hookInfos.push(...O.hookInfos);
    else if (z.messages.length > 0 && O.type === "attachment" && O.attachment.type === "relevant_memories" && !(wH() && cRK(O.attachment.memories))) z.relevantMemories ??= [], z.relevantMemories.push(...O.attachment.memories);
    else if (iRK(O)) A(), _.push(O);
    else if (MTY(O))
        if (z.messages.length > 0) Y.push(O);
        else _.push(O);
    else if (dRK(O)) A(), _.push(O);
    else if (JTY(O, K)) A(), _.push(O);
    else A(), _.push(O);
    return A(), _
}
// @from(Ln 420728, Col 0)
function iRK(q) {
    if (q.type !== "attachment") return !1;
    let K = q.attachment;
    if (K.type !== "queued_command" || K.commandMode !== "prompt") return !1;
    let _ = K.origin;
    if (!K.isMeta && _ === void 0) return !0;
    if (_?.kind === "channel") return !0;
    return _?.kind, !1
}
// @from(Ln 420738, Col 0)
function URK(q) {
    if (q.type === "user") return q.message.content[0]?.type !== "tool_result";
    return iRK(q)
}
// @from(Ln 420743, Col 0)
function GTY(q, K) {
    if (q.searchCount += K.searchCount, q.readCount += K.readCount, q.listCount += K.listCount, q.replCount += K.replCount, q.memorySearchCount += K.memorySearchCount, q.memoryReadCount += K.memoryReadCount, q.memoryWriteCount += K.memoryWriteCount, K.mcpCallCount) q.mcpCallCount = (q.mcpCallCount ?? 0) + K.mcpCallCount, q.mcpServerNames = F4([...q.mcpServerNames ?? [], ...K.mcpServerNames ?? []]);
    if (K.bashCount) q.bashCount = (q.bashCount ?? 0) + K.bashCount;
    if (K.gitOpBashCount) q.gitOpBashCount = (q.gitOpBashCount ?? 0) + K.gitOpBashCount;
    if (K.otherToolCount) q.otherToolCount = (q.otherToolCount ?? 0) + K.otherToolCount;
    if (K.frameCount) q.frameCount = (q.frameCount ?? 0) + K.frameCount;
    if (K.editFileCount) q.editFileCount = (q.editFileCount ?? 0) + K.editFileCount;
    if (K.linesAdded) q.linesAdded = (q.linesAdded ?? 0) + K.linesAdded;
    if (K.linesRemoved) q.linesRemoved = (q.linesRemoved ?? 0) + K.linesRemoved;
    if (K.commits?.length) q.commits = [...q.commits ?? [], ...K.commits];
    if (K.pushes?.length) q.pushes = [...q.pushes ?? [], ...K.pushes];
    if (K.branches?.length) q.branches = [...q.branches ?? [], ...K.branches];
    if (K.prs?.length) q.prs = [...q.prs ?? [], ...K.prs];
    if (K.readFilePaths?.length) q.readFilePaths = [...q.readFilePaths ?? [], ...K.readFilePaths];
    if (K.searchArgs?.length) q.searchArgs = [...q.searchArgs ?? [], ...K.searchArgs];
    if (K.hookCount) q.hookCount = (q.hookCount ?? 0) + K.hookCount, q.hookTotalMs = (q.hookTotalMs ?? 0) + (K.hookTotalMs ?? 0), q.hookInfos = [...q.hookInfos ?? [], ...K.hookInfos ?? []];
    q.latestDisplayHint = K.latestDisplayHint ?? q.latestDisplayHint, q.messages.push(...K.messages)
}
// @from(Ln 420762, Col 0)
function rRK(q, K, _, z = !1) {
    let Y = [],
        A = 0;
    while (A < q.length) {
        let O = q[A];
        if (!URK(O)) {
            Y.push(O), A++;
            continue
        }
        Y.push(O), A++;
        let w = A;
        while (w < q.length && !URK(q[w])) w++;
        let $ = z && w === q.length,
            j = -1;
        if (!$) {
            for (let D = w - 1; D >= A; D--)
                if (dRK(q[D])) {
                    j = D;
                    break
                }
        }
        let H = new Set,
            J = new Set;
        for (let D = w - 1; !$ && D >= A; D--) {
            let Z = q[D];
            if (Z.type !== "assistant") continue;
            let G = Z.message.content[0];
            if (G?.type !== "tool_use" || J.has(G.name)) continue;
            if (J.add(G.name), rK(K, G.name)?.briefStandalone) {
                H.add(D);
                for (let f = D + 1; f < w; f++) {
                    let v = q[f];
                    if (v.type === "assistant") break;
                    if (v.type !== "user") continue;
                    let V = v.message.content[0];
                    if (V?.type === "tool_result" && V.tool_use_id === G.id) {
                        H.add(f);
                        break
                    }
                }
            }
        }
        let X = null,
            M = w,
            P;
        for (let D = A; D < w; D++) {
            if (D === j || H.has(D)) continue;
            let Z = q[D];
            if (Z.type === "system") {
                if (!(Z.subtype === "api_metrics" || Z.subtype === "informational" && Z.level === "info")) H.add(D);
                continue
            }
            let G = null;
            if (Z.type === "collapsed_read_search") G = Z;
            else if (Z.type === "grouped_tool_use") G = QRK(Z, Z.toolName, Z.messages.map((f) => f.message.content[0]?.input), K);
            else if (Z.type === "assistant") {
                let f = Z.message.content[0];
                if (f?.type === "tool_use") G = QRK(Z, f.name, [f.input], K);
                else if ($ && f?.type === "text" && f.text.trim().length > 0) P = f.text
            } else if (Z.type === "user") {
                if (X) {
                    X.messages.push(Z);
                    let f = Z.toolUseResult,
                        v = f?.toolStats ?? (f?.status === "async_launched" && f.agentId ? _?.(f.agentId) : void 0);
                    if (v) {
                        if (X.readCount += v.readCount, X.searchCount += v.searchCount, v.bashCount) X.bashCount = (X.bashCount ?? 0) + v.bashCount;
                        if (v.editFileCount) X.editFileCount = (X.editFileCount ?? 0) + v.editFileCount;
                        if (v.linesAdded) X.linesAdded = (X.linesAdded ?? 0) + v.linesAdded;
                        if (v.linesRemoved) X.linesRemoved = (X.linesRemoved ?? 0) + v.linesRemoved;
                        if (v.otherToolCount) X.otherToolCount = (X.otherToolCount ?? 0) + v.otherToolCount;
                        if (v.frameCount) X.frameCount = (X.frameCount ?? 0) + v.frameCount
                    }
                }
            }
            if (Z.type === "attachment" && Z.attachment.type === "relevant_memories" && wH() && cRK(Z.attachment.memories)) H.add(D);
            if (G)
                if (X) GTY(X, G);
                else X = {
                    ...G,
                    messages: [...G.messages]
                }, M = D
        }
        if (j !== -1) H.add(j);
        let W = [...H].map((D) => [D, q[D]]);
        if (X) {
            if (X.uuid = `brief-${X.uuid}`, P) X.pendingText = P;
            W.push([M, X])
        }
        W.sort((D, Z) => D[0] - Z[0]);
        for (let [, D] of W) Y.push(D);
        A = w
    }
    return Y
}
// @from(Ln 420857, Col 0)
function QRK(q, K, _, z) {
    let Y = rK(z, K),
        A = _.length,
        O = {
            type: "collapsed_read_search",
            searchCount: 0,
            readCount: 0,
            listCount: 0,
            replCount: 0,
            memorySearchCount: 0,
            memoryReadCount: 0,
            memoryWriteCount: 0,
            messages: [q],
            displayMessage: q,
            uuid: q.uuid,
            timestamp: q.timestamp
        };
    if (K === T4 || K === Gh) return O;
    if (Y?.isMcp) {
        if (O.mcpCallCount = A, Y.mcpInfo?.serverName) O.mcpServerNames = [Y.mcpInfo.serverName]
    } else if (Mg8.has(K)) {
        O.editFileCount = A;
        let w = 0,
            $ = 0;
        for (let j of _) {
            let H = Pg8(K, j);
            w += H.added, $ += H.removed
        }
        if (w > 0) O.linesAdded = w;
        if ($ > 0) O.linesRemoved = $
    } else O.otherToolCount = A;
    return O
}
// @from(Ln 420891, Col 0)
function OU8(q, K, _, z = 0, Y, A = 0) {
    let O = [];
    if (Y) {
        let {
            memorySearchCount: $,
            memoryReadCount: j,
            memoryWriteCount: H
        } = Y;
        if (j > 0) {
            let J = _ ? O.length === 0 ? "Recalling" : "recalling" : O.length === 0 ? "Recalled" : "recalled";
            O.push(`${J} ${j} ${j===1?"memory":"memories"}`)
        }
        if ($ > 0) {
            let J = _ ? O.length === 0 ? "Searching" : "searching" : O.length === 0 ? "Searched" : "searched";
            O.push(`${J} memories`)
        }
        if (H > 0) {
            let J = _ ? O.length === 0 ? "Writing" : "writing" : O.length === 0 ? "Wrote" : "wrote";
            O.push(`${J} ${H} ${H===1?"memory":"memories"}`)
        }
        if (f98) f98.appendTeamMemorySummaryParts(Y, _, O)
    }
    if (q > 0) {
        let $ = _ ? O.length === 0 ? "Searching for" : "searching for" : O.length === 0 ? "Searched for" : "searched for";
        O.push(`${$} ${q} ${q===1?"pattern":"patterns"}`)
    }
    if (K > 0) {
        let $ = _ ? O.length === 0 ? "Reading" : "reading" : O.length === 0 ? "Read" : "read";
        O.push(`${$} ${K} ${K===1?"file":"files"}`)
    }
    if (A > 0) {
        let $ = _ ? O.length === 0 ? "Listing" : "listing" : O.length === 0 ? "Listed" : "listed";
        O.push(`${$} ${A} ${A===1?"directory":"directories"}`)
    }
    if (z > 0) {
        let $ = _ ? "REPL'ing" : "REPL'd";
        O.push(`${$} ${z} ${z===1?"time":"times"}`)
    }
    let w = O.join(", ");
    return _ ? `${w}…` : w
}
// @from(Ln 420933, Col 0)
function kC6(q) {
    if (q.length === 0) return;
    let K = 0,
        _ = 0;
    for (let Y = q.length - 1; Y >= 0; Y--) {
        let A = q[Y];
        if (A.isSearch) K++;
        else if (A.isRead) _++;
        else break
    }
    if (K + _ >= 2) return OU8(K, _, !0);
    for (let Y = q.length - 1; Y >= 0; Y--)
        if (q[Y]?.activityDescription) return q[Y].activityDescription;
    return
}
// @from(Ln 420948, Col 4)
f98
// @from(Ln 420948, Col 9)
FRK = 300
// @from(Ln 420949, Col 4)
Bt = L(() => {
    VY();
    gq();
    sY();
    u$();
    EP();
    bK8();
    z78();
    Kc();
    b77();
    eK();
    nO();
    UI6();
    f98 = (pRK(), B7(BRK))
})
// @from(Ln 420965, Col 0)
function lX6() {
    return {
        toolUseCount: 0,
        latestInputTokens: 0,
        cumulativeOutputTokens: 0,
        recentActivities: []
    }
}
// @from(Ln 420974, Col 0)
function DK8(q) {
    return q.latestInputTokens + q.cumulativeOutputTokens
}
// @from(Ln 420978, Col 0)
function N96(q, K, _, z) {
    if (K.type === "progress" && K.data.type === "repl_tool_call" && K.data.phase === "start") {
        let {
            toolName: A,
            toolInput: O
        } = K.data, w = z ? V_6(A, O, z) : void 0;
        if (q.recentActivities.push({
                toolName: A,
                input: O,
                activityDescription: _?.(A, O),
                isSearch: w?.isSearch,
                isRead: w?.isRead
            }), q.recentActivities.length > oRK) q.recentActivities.shift();
        return
    }
    if (K.type !== "assistant") return;
    let Y = K.message.usage;
    q.latestInputTokens = Y.input_tokens + (Y.cache_creation_input_tokens ?? 0) + (Y.cache_read_input_tokens ?? 0), q.cumulativeOutputTokens += Y.output_tokens;
    for (let A of K.message.content) {
        if (A.type !== "tool_use") continue;
        if (q.toolUseCount++, A.name === iW) continue;
        if (A.name === GO) continue;
        let O = A.input,
            w = z ? V_6(A.name, O, z) : void 0;
        q.recentActivities.push({
            toolName: A.name,
            input: O,
            activityDescription: _?.(A.name, O),
            isSearch: w?.isSearch,
            isRead: w?.isRead
        })
    }
    while (q.recentActivities.length > oRK) q.recentActivities.shift()
}
// @from(Ln 421013, Col 0)
function nt(q) {
    return {
        toolUseCount: q.toolUseCount,
        tokenCount: DK8(q),
        lastActivity: q.recentActivities.at(-1),
        recentActivities: [...q.recentActivities]
    }
}
// @from(Ln 421022, Col 0)
function nX6(q) {
    return (K, _) => {
        return rK(q, K)?.getActivityDescription?.(_) ?? void 0
    }
}
// @from(Ln 421028, Col 0)
function sD(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "local_agent"
}
// @from(Ln 421032, Col 0)
function aRK(q) {
    return sD(q) && q.agentType !== "main-session"
}
// @from(Ln 421036, Col 0)
function Ud8(q, K, _) {
    _.update(q, (z) => ({
        ...z,
        pendingMessages: [...z.pendingMessages, K]
    }))
}
// @from(Ln 421043, Col 0)
function sRK(q, K, _) {
    _.update(q, (z) => ({
        ...z,
        messages: [...z.messages ?? [], K]
    }))
}
// @from(Ln 421050, Col 0)
function QNK(q, K) {
    let _ = K.get(q);
    if (!sD(_) || _.pendingMessages.length === 0) return [];
    let z = _.pendingMessages;
    return K.update(q, (Y) => ({
        ...Y,
        pendingMessages: []
    })), z
}
// @from(Ln 421060, Col 0)
function V96({
    taskId: q,
    description: K,
    status: _,
    error: z,
    taskRegistry: Y,
    abortSpeculation: A,
    finalMessage: O,
    usage: w,
    toolUseId: $,
    worktreePath: j,
    worktreeBranch: H
}) {
    let J = !1;
    if (Y.update(q, (f) => {
            if (f.notified) return f;
            return J = !0, {
                ...f,
                notified: !0
            }
        }), !J) return;
    A?.();
    let X = _ === "completed" ? `Agent "${K}" completed` : _ === "failed" ? `Agent "${K}" failed: ${z||"Unknown error"}` : `Agent "${K}" was stopped`,
        M = $A(q),
        P = $ ? `
<${lC}>${$}</${lC}>` : "",
        W = O ? `
<result>${fJ(O)}</result>` : "",
        D = w ? `
<usage><total_tokens>${w.totalTokens}</total_tokens><tool_uses>${w.toolUses}</tool_uses><duration_ms>${w.durationMs}</duration_ms></usage>` : "",
        Z = j ? `
<${XY1}><${MY1}>${j}</${MY1}>${H?`<${PY1}>${H}</${PY1}>`:""}</${XY1}>` : "",
        G = `<${TA}>
<${hW}>${q}</${hW}>${P}
<${nC}>${M}</${nC}>
<${rX}>${_}</${rX}>
<${Mw}>${fJ(X)}</${Mw}>${W}${D}${Z}
</${TA}>`;
    LY({
        value: G,
        mode: "task-notification",
        priority: "next"
    })
}
// @from(Ln 421105, Col 0)
function IF(q, K) {
    let _ = !1;
    if (K.update(q, (z) => {
            if (z.status !== "running") return z;
            return _ = !0, z.abortController?.abort(), z.unregisterCleanup?.(), {
                ...z,
                status: "killed",
                endTime: Date.now(),
                evictAfter: z.retain ? void 0 : Date.now() + JI8,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), _) n2(q)
}
// @from(Ln 421121, Col 0)
function tRK(q, K) {
    for (let [_, z] of Object.entries(q))
        if (z.type === "local_agent" && z.status === "running") IF(_, K)
}
// @from(Ln 421126, Col 0)
function eRK(q, K) {
    K.update(q, (_) => {
        if (_.notified) return _;
        return {
            ..._,
            notified: !0
        }
    })
}
// @from(Ln 421136, Col 0)
function ZK8(q, K, _) {
    _.update(q, (z) => {
        if (z.status !== "running") return z;
        let Y = z.progress?.summary;
        return {
            ...z,
            progress: Y ? {
                ...K,
                summary: Y
            } : K
        }
    })
}
// @from(Ln 421150, Col 0)
function Sd4(q, K, _) {
    let z = null;
    if (_.update(q, (Y) => {
            if (Y.status !== "running") return Y;
            return z = {
                tokenCount: Y.progress?.tokenCount ?? 0,
                toolUseCount: Y.progress?.toolUseCount ?? 0,
                startTime: Y.startTime,
                toolUseId: Y.toolUseId
            }, {
                ...Y,
                progress: {
                    ...Y.progress,
                    toolUseCount: Y.progress?.toolUseCount ?? 0,
                    tokenCount: Y.progress?.tokenCount ?? 0,
                    summary: K
                }
            }
        }), z && Ug()) {
        let {
            tokenCount: Y,
            toolUseCount: A,
            startTime: O,
            toolUseId: w
        } = z;
        vg8({
            taskId: q,
            toolUseId: w,
            description: K,
            startTime: O,
            totalTokens: Y,
            toolUses: A,
            summary: K
        })
    }
}
// @from(Ln 421187, Col 0)
function yg8(q, K) {
    let _ = q.agentId;
    K.update(_, (z) => {
        if (z.status !== "running") return z;
        return z.unregisterCleanup?.(), {
            ...z,
            status: "completed",
            result: q,
            endTime: Date.now(),
            evictAfter: z.retain ? void 0 : Date.now() + JI8,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), n2(_)
}
// @from(Ln 421204, Col 0)
function Lg8(q, K, _) {
    _.update(q, (z) => {
        if (z.status !== "running") return z;
        return z.unregisterCleanup?.(), {
            ...z,
            status: "failed",
            error: K,
            endTime: Date.now(),
            evictAfter: z.retain ? void 0 : Date.now() + JI8,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), n2(q)
}
// @from(Ln 421220, Col 0)
function wU8({
    agentId: q,
    description: K,
    prompt: _,
    selectedAgent: z,
    taskRegistry: Y,
    parentAbortController: A,
    toolUseId: O,
    cwd: w
}) {
    uM6(q, X0(w2(q)));
    let $ = A ? tv(A) : F5(),
        j = {
            ...cf(q, "local_agent", K, O),
            type: "local_agent",
            status: "running",
            agentId: q,
            prompt: _,
            cwd: w,
            selectedAgent: z,
            agentType: z.agentType ?? "general-purpose",
            abortController: $,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: [],
            retain: !1,
            diskLoaded: !1
        },
        H = eq(async () => {
            IF(q, Y)
        });
    return j.unregisterCleanup = H, Y.register(j), j
}
// @from(Ln 421256, Col 0)
function SHK({
    agentId: q,
    description: K,
    prompt: _,
    selectedAgent: z,
    taskRegistry: Y,
    autoBackgroundMs: A,
    toolUseId: O,
    cwd: w
}) {
    uM6(q, X0(w2(q)));
    let $ = F5(),
        j = eq(async () => {
            IF(q, Y)
        }),
        H = {
            ...cf(q, "local_agent", K, O),
            type: "local_agent",
            status: "running",
            agentId: q,
            prompt: _,
            cwd: w,
            selectedAgent: z,
            agentType: z.agentType ?? "general-purpose",
            abortController: $,
            unregisterCleanup: j,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !1,
            pendingMessages: [],
            retain: !1,
            diskLoaded: !1
        },
        J, X = new Promise((P) => {
            J = P
        });
    tI6.set(q, J), Y.register(H);
    let M;
    if (A !== void 0 && A > 0) {
        let P = setTimeout((W, D) => {
            W.update(D, (G) => {
                if (G.isBackgrounded) return G;
                return {
                    ...G,
                    isBackgrounded: !0
                }
            });
            let Z = tI6.get(D);
            if (Z) Z(), tI6.delete(D)
        }, A, Y, q);
        M = () => clearTimeout(P)
    }
    return {
        taskId: q,
        backgroundSignal: X,
        cancelAutoBackground: M
    }
}
// @from(Ln 421316, Col 0)
function qSK(q, K) {
    let _ = K.get(q);
    if (!sD(_) || _.isBackgrounded) return !1;
    K.update(q, (Y) => ({
        ...Y,
        isBackgrounded: !0
    }));
    let z = tI6.get(q);
    if (z) z(), tI6.delete(q);
    return !0
}
// @from(Ln 421328, Col 0)
function CHK(q, K) {
    tI6.delete(q);
    let _ = K.get(q);
    if (!sD(_) || _.isBackgrounded) return;
    let z = _.unregisterCleanup;
    K.remove(q), z?.()
}
// @from(Ln 421335, Col 4)
oRK = 5
// @from(Ln 421336, Col 4)
lQ8
// @from(Ln 421336, Col 9)
tI6
// @from(Ln 421337, Col 4)
vM = L(() => {
    y8();
    rA();
    $T();
    gq();
    EP();
    td();
    Cf();
    x$();
    R9();
    Bt();
    b$();
    g4();
    EH();
    bc();
    U77();
    lQ8 = {
        name: "LocalAgentTask",
        type: "local_agent",
        async kill(q, K) {
            IF(q, K)
        }
    };
    tI6 = new Map
})
// @from(Ln 421366, Col 0)
function yTY(q) {
    let K = q.trimEnd().split(`
`).pop() ?? "";
    return ETY.some((_) => _.test(K))
}