
// @from(Ln 436879, Col 4)
QP = E(() => {
    U4();
    Up();
    RO8();
    df7();
    lf7();
    HT7();
    JT7();
    hD();
    PT7();
    Vw1();
    kw1();
    k1();
    s8();
    H1();
    RM();
    V1();
    Sw();
    T1();
    fA();
    F5();
    KY();
    gL();
    LN1();
    qk1();
    ZR();
    A8();
    sy();
    qM();
    ni8();
    cZq();
    Mu();
    dV();
    U$();
    jR();
    eZq();
    sk1();
    tk1();
    W16();
    Gq6();
    WZ();
    $Z6();
    AGq();
    ax6();
    SR();
    g1();
    g1();
    A8();
    WE1 = class WE1 extends Error {
        serverName;
        constructor(A, q) {
            super(q);
            this.name = "McpAuthError", this.serverName = A
        }
    };
    qn8 = class qn8 extends Error {
        constructor(A) {
            super(`MCP server "${A}" session expired`);
            this.name = "McpSessionExpiredError"
        }
    };
    ZE1 = class ZE1 extends EV {
        mcpMeta;
        constructor(A, q, K) {
            super(A, q);
            this.mcpMeta = K;
            this.name = "McpToolCallError"
        }
    };
    _Gq = Promise.resolve();
    S3z = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
    b3z = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
    zh = e1(async (A, q, K) => {
        let Y = Date.now(),
            z;
        try {
            let _, w = UW();
            if (q.type === "sse") {
                let I = new q_6(A, q),
                    g = await Bh1(A, q),
                    B = {
                        authProvider: I,
                        fetch: ti8(AK6()),
                        requestInit: {
                            headers: {
                                "User-Agent": vr(),
                                ...g
                            }
                        }
                    };
                B.eventSourceInit = {
                    fetch: async (b, p) => {
                        let Q = {},
                            U = await I.tokens();
                        if (U) Q.Authorization = `Bearer ${U.access_token}`;
                        let r = W46();
                        return fetch(b, {
                            ...p,
                            ...r,
                            headers: {
                                "User-Agent": vr(),
                                ...Q,
                                ...p?.headers,
                                ...g,
                                Accept: "text/event-stream"
                            }
                        })
                    }
                }, _ = new vw1(new URL(q.url), B), n1(A, "SSE transport initialized, awaiting connection")
            } else if (q.type === "sse-ide") {
                n1(A, `Setting up SSE-IDE transport to ${q.url}`);
                let I = W46(),
                    g = I.dispatcher ? {
                        eventSourceInit: {
                            fetch: async (B, b) => {
                                return fetch(B, {
                                    ...b,
                                    ...I,
                                    headers: {
                                        "User-Agent": vr(),
                                        ...b?.headers
                                    }
                                })
                            }
                        }
                    } : {};
                _ = new vw1(new URL(q.url), Object.keys(g).length > 0 ? g : void 0)
            } else if (q.type === "ws-ide") {
                let I = iS(),
                    g = {
                        "User-Agent": vr(),
                        ...q.authToken && {
                            "X-Claude-Code-Ide-Authorization": q.authToken
                        }
                    },
                    B;
                if (typeof Bun < "u") B = new globalThis.WebSocket(q.url, {
                    protocols: ["mcp"],
                    headers: g,
                    proxy: mQ(q.url),
                    tls: I || void 0
                });
                else B = await wGq(q.url, {
                    headers: g,
                    agent: uQ(q.url),
                    ...I || {}
                });
                _ = new uh1(B)
            } else if (q.type === "ws") {
                n1(A, `Initializing WebSocket transport to ${q.url}`);
                let I = await Bh1(A, q),
                    g = iS(),
                    B = {
                        "User-Agent": vr(),
                        ...w && {
                            Authorization: `Bearer ${w}`
                        },
                        ...I
                    },
                    b = Object.fromEntries(Object.entries(B).map(([Q, U]) => Q.toLowerCase() === "authorization" ? [Q, "[REDACTED]"] : [Q, U]));
                n1(A, `WebSocket transport options: ${B6({url:q.url,headers:b,hasSessionAuth:!!w})}`);
                let p;
                if (typeof Bun < "u") p = new globalThis.WebSocket(q.url, {
                    protocols: ["mcp"],
                    headers: B,
                    proxy: mQ(q.url),
                    tls: g || void 0
                });
                else p = await wGq(q.url, {
                    headers: B,
                    agent: uQ(q.url),
                    ...g || {}
                });
                _ = new uh1(p)
            } else if (q.type === "http") {
                n1(A, `Initializing HTTP transport to ${q.url}`), n1(A, `Node version: ${process.version}, Platform: ${process.platform}`), n1(A, `Environment: ${B6({NODE_OPTIONS:process.env.NODE_OPTIONS||"not set",UV_THREADPOOL_SIZE:process.env.UV_THREADPOOL_SIZE||"default",HTTP_PROXY:process.env.HTTP_PROXY||"not set",HTTPS_PROXY:process.env.HTTPS_PROXY||"not set",NO_PROXY:process.env.NO_PROXY||"not set"})}`);
                let I = new q_6(A, q),
                    g = await Bh1(A, q),
                    B = W46();
                n1(A, `Proxy options: ${B.dispatcher?"custom dispatcher":"default"}`);
                let b = {
                        authProvider: I,
                        fetch: ti8(AK6()),
                        requestInit: {
                            ...B,
                            headers: {
                                "User-Agent": vr(),
                                ...w && {
                                    Authorization: `Bearer ${w}`
                                },
                                ...g
                            }
                        }
                    },
                    p = b.requestInit?.headers ? Object.fromEntries(Object.entries(b.requestInit.headers).map(([Q, U]) => Q.toLowerCase() === "authorization" ? [Q, "[REDACTED]"] : [Q, U])) : void 0;
                n1(A, `HTTP transport options: ${B6({url:q.url,headers:p,hasAuthProvider:!!I,timeoutMs:MGq})}`), _ = new Nw1(new URL(q.url), b), n1(A, "HTTP transport created successfully")
            } else if (q.type === "sdk") throw Error("SDK servers should be handled in print.ts");
            else if (q.type === "claudeai-proxy") {
                if (n1(A, `Initializing claude.ai proxy transport for server ${q.id}`), !sA()) throw Error("No claude.ai OAuth token found");
                let g = P7(),
                    B = `${g.MCP_PROXY_URL}${g.MCP_PROXY_PATH.replace("{server_id}",q.id)}`;
                n1(A, `Using claude.ai proxy at ${B}`);
                let b = h3z(globalThis.fetch),
                    p = W46(),
                    Q = {
                        fetch: ti8(b),
                        requestInit: {
                            ...p,
                            headers: {
                                "User-Agent": vr(),
                                "X-Mcp-Client-Session-Id": R1()
                            }
                        }
                    };
                _ = new Nw1(new URL(B), Q), n1(A, "claude.ai proxy transport created successfully")
            } else if ((q.type === "stdio" || !q.type) && W96(A)) {
                let {
                    createChromeContext: I
                } = await Promise.resolve().then(() => (wn8(), _n8)), {
                    createClaudeForChromeMcpServer: g
                } = await Promise.resolve().then(() => (wL6(), izA)), {
                    createLinkedTransportPair: B
                } = await Promise.resolve().then(() => zGq), b = I(q.env);
                z = g(b);
                let [p, Q] = B();
                await z.connect(Q), _ = p, n1(A, "In-process Chrome MCP server started")
            } else if (q.type === "stdio" || !q.type) {
                let I = process.env.CLAUDE_CODE_SHELL_PREFIX || q.command,
                    g = process.env.CLAUDE_CODE_SHELL_PREFIX ? [
                        [q.command, ...q.args].join(" ")
                    ] : q.args;
                _ = new SO8({
                    command: I,
                    args: g,
                    env: {
                        ...process.env,
                        ...q.env
                    },
                    stderr: "pipe"
                })
            } else throw Error(`Unsupported server type: ${q.type}. claude.ai MCP servers are enabled by default (GrowthBook-gated). To opt out, set ENABLE_CLAUDEAI_MCP_SERVERS=false.`);
            let O, $ = "";
            if (q.type === "stdio" || !q.type) {
                let I = _;
                if (I.stderr) O = (g) => {
                    if ($.length < 67108864) try {
                        $ += g.toString()
                    } catch {}
                }, I.stderr.on("data", O)
            }
            let H = KK6(),
                j = new zw1({
                    name: "claude-code",
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.76",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-03-14T00:12:49Z"
                    }.VERSION ?? "unknown"
                }, {
                    capabilities: {
                        roots: {},
                        ...H ? {
                            elicitation: {
                                form: {},
                                url: {}
                            }
                        } : {}
                    }
                });
            if (q.type === "http") n1(A, "Client created, setting up request handler");
            if (j.setRequestHandler(jQ1, async () => {
                    return n1(A, "Received ListRoots request from server"), {
                        roots: [{
                            uri: `file://${AA()}`
                        }]
                    }
                }), n1(A, `Starting connection with timeout of ${gh1()}ms`), q.type === "http") {
                n1(A, `Testing basic HTTP connectivity to ${q.url}`);
                try {
                    let I = new URL(q.url);
                    if (n1(A, `Parsed URL: host=${I.hostname}, port=${I.port||"default"}, protocol=${I.protocol}`), I.hostname === "127.0.0.1" || I.hostname === "localhost") n1(A, `Using loopback address: ${I.hostname}`)
                } catch (I) {
                    n1(A, `Failed to parse URL: ${I}`)
                }
            }
            let J = j.connect(_),
                M = new Promise((I, g) => {
                    let B = setTimeout(() => {
                        let b = Date.now() - Y;
                        if (n1(A, `Connection timeout triggered after ${b}ms (limit: ${gh1()}ms)`), z) z.close().catch(() => {});
                        _.close().catch(() => {}), g(new EV(`MCP server "${A}" connection timed out after ${gh1()}ms`, "MCP connection timeout"))
                    }, gh1());
                    J.then(() => {
                        clearTimeout(B)
                    }, (b) => {
                        clearTimeout(B)
                    })
                });
            try {
                if (await Promise.race([J, M]), $) EY(A, `Server stderr: ${$}`), $ = "";
                let I = Date.now() - Y;
                n1(A, `Successfully connected to ${q.type} server in ${I}ms`)
            } catch (I) {
                let g = Date.now() - Y;
                if (q.type === "sse" && I instanceof Error) {
                    if (n1(A, `SSE Connection failed after ${g}ms: ${B6({url:q.url,error:I.message,errorType:I.constructor.name,stack:I.stack})}`), EY(A, I), I instanceof zX) return d("tengu_mcp_server_needs_auth", {
                        transportType: "sse",
                        ...Uj(q) ? {
                            mcpServerBaseUrl: Uj(q)
                        } : {}
                    }), n1(A, "Authentication required for SSE server"), si8(A), {
                        name: A,
                        type: "needs-auth",
                        config: q
                    }
                } else if (q.type === "http" && I instanceof Error) {
                    let B = I;
                    if (n1(A, `HTTP Connection failed after ${g}ms: ${I.message} (code: ${B.code||"none"}, errno: ${B.errno||"none"})`), EY(A, I), I instanceof zX) return d("tengu_mcp_server_needs_auth", {
                        transportType: "http",
                        ...Uj(q) ? {
                            mcpServerBaseUrl: Uj(q)
                        } : {}
                    }), n1(A, "Authentication required for HTTP server"), si8(A), {
                        name: A,
                        type: "needs-auth",
                        config: q
                    }
                } else if (q.type === "claudeai-proxy" && I instanceof Error) {
                    if (n1(A, `claude.ai proxy connection failed after ${g}ms: ${I.message}`), EY(A, I), I.code === 401) return d("tengu_mcp_server_needs_auth", {
                        transportType: "claudeai-proxy",
                        ...Uj(q) ? {
                            mcpServerBaseUrl: Uj(q)
                        } : {}
                    }), n1(A, "Authentication required for claude.ai proxy server"), si8(A), {
                        name: A,
                        type: "needs-auth",
                        config: q
                    }
                } else if (q.type === "sse-ide" || q.type === "ws-ide") d("tengu_mcp_ide_server_connection_failed", {
                    connectionDurationMs: g
                });
                if (z) z.close().catch(() => {});
                if (_.close().catch(() => {}), $) EY(A, `Server stderr: ${$}`);
                throw I
            }
            let D = j.getServerCapabilities(),
                X = j.getServerVersion(),
                P = j.getInstructions();
            if (n1(A, `Connection established with capabilities: ${B6({hasTools:!!D?.tools,hasPrompts:!!D?.prompts,hasResources:!!D?.resources,hasResourceSubscribe:!!D?.resources?.subscribe,serverVersion:X||"unknown"})}`), k(`[MCP] Server "${A}" connected with subscribe=${!!D?.resources?.subscribe}`), H) j.setRequestHandler(yp, async (I) => {
                return n1(A, `Elicitation request received during initialization: ${B6(I)}`), {
                    action: "cancel"
                }
            });
            if (q.type === "sse-ide" || q.type === "ws-ide") {
                let I = Date.now() - Y;
                d("tengu_mcp_ide_server_connection_succeeded", {
                    connectionDurationMs: I,
                    serverVersion: X
                });
                try {
                    KR7(j)
                } catch (g) {
                    EY(A, `Failed to send ide_connected notification: ${g}`)
                }
            }
            let W = Date.now(),
                Z = !1,
                G = j.onerror,
                f = j.onclose,
                v = 0,
                N = 3,
                V = (I) => {
                    return I.includes("ECONNRESET") || I.includes("ETIMEDOUT") || I.includes("EPIPE") || I.includes("EHOSTUNREACH") || I.includes("ECONNREFUSED") || I.includes("Body Timeout Error") || I.includes("terminated")
                };
            j.onerror = (I) => {
                let g = Date.now() - W;
                Z = !0;
                let B = q.type || "stdio";
                if (n1(A, `${B.toUpperCase()} connection dropped after ${Math.floor(g/1000)}s uptime`), I.message)
                    if (I.message.includes("ECONNRESET")) n1(A, "Connection reset - server may have crashed or restarted");
                    else if (I.message.includes("ETIMEDOUT")) n1(A, "Connection timeout - network issue or server unresponsive");
                else if (I.message.includes("ECONNREFUSED")) n1(A, "Connection refused - server may be down");
                else if (I.message.includes("EPIPE")) n1(A, "Broken pipe - server closed connection unexpectedly");
                else if (I.message.includes("EHOSTUNREACH")) n1(A, "Host unreachable - network connectivity issue");
                else if (I.message.includes("ESRCH")) n1(A, "Process not found - stdio server process terminated");
                else if (I.message.includes("spawn")) n1(A, "Failed to spawn process - check command and permissions");
                else n1(A, `Connection error: ${I.message}`);
                if ((B === "http" || B === "claudeai-proxy") && jGq(I)) {
                    if (n1(A, "MCP session expired (server returned 404 with session-not-found), triggering reconnection"), j.onclose?.(), G) G(I);
                    return
                }
                if (B === "sse" || B === "http" || B === "claudeai-proxy")
                    if (V(I.message)) {
                        if (v++, n1(A, `Terminal connection error ${v}/${N}`), v >= N) n1(A, "Max consecutive errors reached, triggering reconnection via onclose"), v = 0, j.onclose?.()
                    } else v = 0;
                if (G) G(I)
            }, j.onclose = () => {
                let I = Date.now() - W,
                    g = q.type ?? "unknown";
                n1(A, `${g.toUpperCase()} connection closed after ${Math.floor(I/1000)}s (${Z?"with errors":"cleanly"})`);
                let B = ei8(A, q);
                if (JE.cache.delete(A), Rl.cache.delete(A), K_6.cache.delete(A), zh.cache.delete(B), n1(A, "Cleared connection cache for reconnection"), f) f()
            };
            let L = async () => {
                if (z) {
                    try {
                        await z.close()
                    } catch (I) {
                        n1(A, `Error closing in-process server: ${I}`)
                    }
                    try {
                        await j.close()
                    } catch (I) {
                        n1(A, `Error closing client: ${I}`)
                    }
                    return
                }
                if (O && (q.type === "stdio" || !q.type)) _.stderr?.off("data", O);
                if (q.type === "stdio") try {
                    let g = _.pid;
                    if (g) {
                        n1(A, "Sending SIGINT to MCP server process");
                        try {
                            process.kill(g, "SIGINT")
                        } catch (B) {
                            n1(A, `Error sending SIGINT: ${B}`);
                            return
                        }
                        await new Promise(async (B) => {
                            let b = !1,
                                p = setInterval(() => {
                                    try {
                                        process.kill(g, 0)
                                    } catch {
                                        if (!b) b = !0, clearInterval(p), clearTimeout(Q), n1(A, "MCP server process exited cleanly"), B()
                                    }
                                }, 50),
                                Q = setTimeout(() => {
                                    if (!b) b = !0, clearInterval(p), n1(A, "Cleanup timeout reached, stopping process monitoring"), B()
                                }, 600);
                            try {
                                if (await new Promise((U) => setTimeout(U, 100)), !b) {
                                    try {
                                        process.kill(g, 0), n1(A, "SIGINT failed, sending SIGTERM to MCP server process");
                                        try {
                                            process.kill(g, "SIGTERM")
                                        } catch (U) {
                                            n1(A, `Error sending SIGTERM: ${U}`), b = !0, clearInterval(p), clearTimeout(Q), B();
                                            return
                                        }
                                    } catch {
                                        b = !0, clearInterval(p), clearTimeout(Q), B();
                                        return
                                    }
                                    if (await new Promise((U) => setTimeout(U, 400)), !b) try {
                                        process.kill(g, 0), n1(A, "SIGTERM failed, sending SIGKILL to MCP server process");
                                        try {
                                            process.kill(g, "SIGKILL")
                                        } catch (U) {
                                            n1(A, `Error sending SIGKILL: ${U}`)
                                        }
                                    } catch {
                                        b = !0, clearInterval(p), clearTimeout(Q), B()
                                    }
                                }
                                if (!b) b = !0, clearInterval(p), clearTimeout(Q), B()
                            } catch {
                                if (!b) b = !0, clearInterval(p), clearTimeout(Q), B()
                            }
                        })
                    }
                } catch (I) {
                    n1(A, `Error terminating process: ${I}`)
                }
                try {
                    await j.close()
                } catch (I) {
                    n1(A, `Error closing client: ${I}`)
                }
            }, h = E4(L), R = async () => {
                h?.(), await L()
            }, u = Date.now() - Y;
            return d("tengu_mcp_server_connection_succeeded", {
                connectionDurationMs: u,
                transportType: q.type ?? "stdio",
                totalServers: K?.totalServers,
                stdioCount: K?.stdioCount,
                sseCount: K?.sseCount,
                httpCount: K?.httpCount,
                sseIdeCount: K?.sseIdeCount,
                wsIdeCount: K?.wsIdeCount,
                ...Uj(q) ? {
                    mcpServerBaseUrl: Uj(q)
                } : {}
            }), {
                name: A,
                client: j,
                type: "connected",
                capabilities: D ?? {},
                serverInfo: X,
                instructions: P,
                config: q,
                cleanup: R
            }
        } catch (_) {
            let w = Date.now() - Y;
            if (d("tengu_mcp_server_connection_failed", {
                    connectionDurationMs: w,
                    totalServers: K?.totalServers || 1,
                    stdioCount: K?.stdioCount || (q.type === "stdio" ? 1 : 0),
                    sseCount: K?.sseCount || (q.type === "sse" ? 1 : 0),
                    httpCount: K?.httpCount || (q.type === "http" ? 1 : 0),
                    sseIdeCount: K?.sseIdeCount || (q.type === "sse-ide" ? 1 : 0),
                    wsIdeCount: K?.wsIdeCount || (q.type === "ws-ide" ? 1 : 0),
                    transportType: q.type ?? "stdio",
                    ...Uj(q) ? {
                        mcpServerBaseUrl: Uj(q)
                    } : {}
                }), n1(A, `Connection failed after ${w}ms: ${_1(_)}`), EY(A, `Connection failed: ${_1(_)}`), z) z.close().catch(() => {});
            return {
                name: A,
                type: "failed",
                config: q,
                error: _1(_)
            }
        }
    }, ei8);
    JE = ZP(async (A) => {
        if (A.type !== "connected") return [];
        try {
            if (!A.capabilities?.tools) return [];
            let q = await A.client.request({
                    method: "tools/list"
                }, $y6),
                K = Ws(q.tools),
                Y = A.config.type === "sdk" && t6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
            return K.map((z) => {
                let _ = $58(A.name, z.name);
                return {
                    ...tZq,
                    name: Y ? z.name : _,
                    mcpInfo: {
                        serverName: A.name,
                        toolName: z.name
                    },
                    isMcp: !0,
                    async description() {
                        return z.description ?? ""
                    },
                    async prompt() {
                        return z.description ?? ""
                    },
                    isConcurrencySafe() {
                        return z.annotations?.readOnlyHint ?? !1
                    },
                    isReadOnly() {
                        return z.annotations?.readOnlyHint ?? !1
                    },
                    toAutoClassifierInput(w) {
                        return u3z(w, z.name)
                    },
                    isDestructive() {
                        return z.annotations?.destructiveHint ?? !1
                    },
                    isOpenWorld() {
                        return z.annotations?.openWorldHint ?? !1
                    },
                    inputJSONSchema: z.inputSchema,
                    async checkPermissions() {
                        return {
                            behavior: "passthrough",
                            message: "MCPTool requires permission.",
                            suggestions: [{
                                type: "addRules",
                                rules: [{
                                    toolName: _,
                                    ruleContent: void 0
                                }],
                                behavior: "allow",
                                destination: "localSettings"
                            }]
                        }
                    },
                    async call(w, O, $, H, j) {
                        let J = p3z(H),
                            M = J ? {
                                "claudecode/toolUseId": J
                            } : {};
                        if (j && J) j({
                            toolUseID: J,
                            data: {
                                type: "mcp_progress",
                                status: "started",
                                serverName: A.name,
                                toolName: z.name
                            }
                        });
                        let D = Date.now(),
                            X = 1;
                        for (let P = 0;; P++) try {
                            let W = await yT6(A),
                                Z = await F3z({
                                    client: W,
                                    clientConnection: A,
                                    tool: z.name,
                                    args: w,
                                    meta: M,
                                    signal: O.abortController.signal,
                                    setAppState: O.setAppState,
                                    onProgress: j && J ? (G) => {
                                        j({
                                            toolUseID: J,
                                            data: G
                                        })
                                    } : void 0,
                                    handleElicitation: O.handleElicitation
                                });
                            if (j && J) j({
                                toolUseID: J,
                                data: {
                                    type: "mcp_progress",
                                    status: "completed",
                                    serverName: A.name,
                                    toolName: z.name,
                                    elapsedTimeMs: Date.now() - D
                                }
                            });
                            return {
                                data: Z.content,
                                ...Z._meta || Z.structuredContent ? {
                                    mcpMeta: {
                                        ...Z._meta && {
                                            _meta: Z._meta
                                        },
                                        ...Z.structuredContent && {
                                            structuredContent: Z.structuredContent
                                        }
                                    }
                                } : {}
                            }
                        } catch (W) {
                            if (W instanceof qn8 && P < X) {
                                n1(A.name, `Retrying tool '${z.name}' after session recovery`);
                                continue
                            }
                            if (j && J) j({
                                toolUseID: J,
                                data: {
                                    type: "mcp_progress",
                                    status: "failed",
                                    serverName: A.name,
                                    toolName: z.name,
                                    elapsedTimeMs: Date.now() - D
                                }
                            });
                            if (W instanceof Error && !(W instanceof EV)) {
                                let Z = W.constructor.name;
                                if (Z === "Error") throw new EV(W.message, W.message.slice(0, 200));
                                if (Z === "McpError" && "code" in W && typeof W.code === "number") throw new EV(W.message, `McpError ${W.code}`)
                            }
                            throw W
                        }
                    },
                    userFacingName() {
                        let w = z.annotations?.title || z.name;
                        return `${A.name} - ${w} (MCP)`
                    },
                    ...W96(A.name) ? T3z().getClaudeInChromeMCPToolOverrides(z.name) : {}
                }
            }).filter(x3z)
        } catch (q) {
            return EY(A.name, `Failed to fetch tools: ${_1(q)}`), []
        }
    }, (A) => A.name, zn8), Rl = ZP(async (A) => {
        if (A.type !== "connected") return [];
        try {
            if (!A.capabilities?.resources) return [];
            let q = await A.client.request({
                method: "resources/list"
            }, Ky6);
            if (!q.resources) return [];
            return q.resources.map((K) => ({
                ...K,
                server: A.name
            }))
        } catch (q) {
            return EY(A.name, `Failed to fetch resources: ${_1(q)}`), []
        }
    }, (A) => A.name, zn8), K_6 = ZP(async (A) => {
        if (A.type !== "connected") return [];
        try {
            if (!A.capabilities?.prompts) return [];
            let q = await A.client.request({
                method: "prompts/list"
            }, _y6);
            if (!q.prompts) return [];
            return Ws(q.prompts).map((Y) => {
                let z = Object.values(Y.arguments ?? {}).map((_) => _.name);
                return {
                    type: "prompt",
                    name: "mcp__" + lO(A.name) + "__" + Y.name,
                    description: Y.description ?? "",
                    hasUserSpecifiedDescription: !!Y.description,
                    contentLength: 0,
                    isEnabled: () => !0,
                    isHidden: !1,
                    isMcp: !0,
                    progressMessage: "running",
                    userFacingName() {
                        return `${A.name}:${Y.name} (MCP)`
                    },
                    argNames: z,
                    source: "mcp",
                    async getPromptForCommand(_) {
                        let w = _.split(" ");
                        try {
                            let O = await yT6(A),
                                $ = await O.client.getPrompt({
                                    name: Y.name,
                                    arguments: XT7(z, w)
                                });
                            return (await Promise.all($.messages.map((j) => XGq(j.content, O.name)))).flat()
                        } catch (O) {
                            throw EY(A.name, `Error running command '${Y.name}': ${_1(O)}`), O
                        }
                    }
                }
            })
        } catch (q) {
            return EY(A.name, `Failed to fetch commands: ${_1(q)}`), []
        }
    }, (A) => A.name, zn8)
})
// @from(Ln 437615, Col 0)
class Gb {
    static instance;
    baseline = new Map;
    initialized = !1;
    mcpClient;
    lastProcessedTimestamps = new Map;
    rightFileDiagnosticsState = new Map;
    static getInstance() {
        if (!Gb.instance) Gb.instance = new Gb;
        return Gb.instance
    }
    initialize(A) {
        if (this.initialized) return;
        this.mcpClient = A, this.initialized = !0
    }
    async shutdown() {
        this.initialized = !1, this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear()
    }
    reset() {
        this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear()
    }
    normalizeFileUri(A) {
        let q = ["file://", "_claude_fs_right:", "_claude_fs_left:"],
            K = A;
        for (let Y of q)
            if (A.startsWith(Y)) {
                K = A.slice(Y.length);
                break
            } return $$(K)
    }
    async ensureFileOpened(A) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        try {
            await pC("openFile", {
                filePath: A,
                preview: !1,
                startText: "",
                endText: "",
                selectToEndOfLine: !1,
                makeFrontmost: !1
            }, this.mcpClient)
        } catch (q) {
            _6(q)
        }
    }
    async beforeFileEdited(A) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        let q = Date.now();
        try {
            let K = await pC("getDiagnostics", {
                    uri: `file://${A}`
                }, this.mcpClient),
                Y = this.parseDiagnosticResult(K)[0];
            if (Y) {
                if (!fGq(this.normalizeFileUri(A), this.normalizeFileUri(Y.uri))) {
                    _6(new GGq(`Diagnostics file path mismatch: expected ${A}, got ${Y.uri})`));
                    return
                }
                let z = this.normalizeFileUri(A);
                this.baseline.set(z, Y.diagnostics), this.lastProcessedTimestamps.set(z, q)
            } else {
                let z = this.normalizeFileUri(A);
                this.baseline.set(z, []), this.lastProcessedTimestamps.set(z, q)
            }
        } catch (K) {}
    }
    async getNewDiagnostics() {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return [];
        let A = [];
        try {
            let z = await pC("getDiagnostics", {}, this.mcpClient);
            A = this.parseDiagnosticResult(z)
        } catch (z) {
            return []
        }
        let q = A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("file://")),
            K = new Map;
        A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("_claude_fs_right:")).forEach((z) => {
            K.set(this.normalizeFileUri(z.uri), z)
        });
        let Y = [];
        for (let z of q) {
            let _ = this.normalizeFileUri(z.uri),
                w = this.baseline.get(_) || [],
                O = K.get(_),
                $ = z;
            if (O) {
                let j = this.rightFileDiagnosticsState.get(_);
                if (!j || !this.areDiagnosticArraysEqual(j, O.diagnostics)) $ = O;
                this.rightFileDiagnosticsState.set(_, O.diagnostics)
            }
            let H = $.diagnostics.filter((j) => !w.some((J) => this.areDiagnosticsEqual(j, J)));
            if (H.length > 0) Y.push({
                uri: z.uri,
                diagnostics: H
            });
            this.baseline.set(_, $.diagnostics)
        }
        return Y
    }
    parseDiagnosticResult(A) {
        if (Array.isArray(A)) {
            let q = A.find((K) => K.type === "text");
            if (q && "text" in q) return i1(q.text)
        }
        return []
    }
    areDiagnosticsEqual(A, q) {
        return A.message === q.message && A.severity === q.severity && A.source === q.source && A.code === q.code && A.range.start.line === q.range.start.line && A.range.start.character === q.range.start.character && A.range.end.line === q.range.end.line && A.range.end.character === q.range.end.character
    }
    areDiagnosticArraysEqual(A, q) {
        if (A.length !== q.length) return !1;
        return A.every((K) => q.some((Y) => this.areDiagnosticsEqual(K, Y))) && q.every((K) => A.some((Y) => this.areDiagnosticsEqual(Y, K)))
    }
    async handleQueryStart(A) {
        if (!this.initialized) {
            let q = Gv(A);
            if (q) this.initialize(q)
        } else this.reset()
    }
    static formatDiagnosticsSummary(A) {
        let K = A.map((Y) => {
            let z = Y.uri.split("/").pop() || Y.uri,
                _ = Y.diagnostics.map((w) => {
                    return `  ${Gb.getSeveritySymbol(w.severity)} [Line ${w.range.start.line+1}:${w.range.start.character+1}] ${w.message}${w.code?` [${w.code}]`:""}${w.source?` (${w.source})`:""}`
                }).join(`
`);
            return `${z}:
${_}`
        }).join(`

`);
        if (K.length > ZGq) return K.slice(0, ZGq - 12) + "…[truncated]";
        return K
    }
    static getSeveritySymbol(A) {
        return {
            Error: a6.cross,
            Warning: a6.warning,
            Info: a6.info,
            Hint: a6.star
        } [A] || a6.bullet
    }
}
// @from(Ln 437759, Col 4)
GGq
// @from(Ln 437759, Col 9)
ZGq = 4000
// @from(Ln 437760, Col 4)
Nl
// @from(Ln 437761, Col 4)
iY6 = E(() => {
    QP();
    Sw();
    k1();
    s8();
    b7();
    g1();
    Z7();
    GGq = class GGq extends iL6 {};
    Nl = Gb.getInstance()
})
// @from(Ln 437773, Col 0)
function TGq(A, q, K) {
    if (!On8(A)) return null;
    if (!x58(q).isValid) return null;
    let z = K(),
        _ = x58(z);
    if (!_.isValid) return {
        result: !1,
        message: `Claude Code settings.json validation failed after edit:
${_.error}

Full schema:
${_.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
        errorCode: 10
    };
    return null
}
// @from(Ln 437790, Col 4)
vGq = E(() => {
    l31();
    RY()
})
// @from(Ln 437795, Col 0)
function ph1(A) {
    if (!A) return "Update";
    if (A.file_path?.startsWith(t2())) return "Updated plan";
    if (A.edits != null) return "Update";
    if (A.old_string === "") return "Create";
    return "Update"
}
// @from(Ln 437803, Col 0)
function $n8(A) {
    if (!A?.file_path) return null;
    return $K(A.file_path)
}
// @from(Ln 437808, Col 0)
function NGq({
    file_path: A
}, {
    verbose: q
}) {
    if (!A) return null;
    if (A.startsWith(t2())) return "";
    return s_.createElement(Qk, {
        filePath: A
    }, q ? A : $K(A))
}
// @from(Ln 437820, Col 0)
function VGq() {
    return null
}
// @from(Ln 437824, Col 0)
function kGq({
    filePath: A,
    structuredPatch: q,
    originalFile: K
}, Y, {
    style: z,
    verbose: _
}) {
    let w = A.startsWith(t2());
    return s_.createElement(rV1, {
        filePath: A,
        structuredPatch: q,
        firstLine: K.split(`
`)[0] ?? null,
        fileContent: K,
        style: z,
        verbose: _,
        previewHint: w ? "/plan to preview" : void 0
    })
}
// @from(Ln 437845, Col 0)
function EGq(A, q) {
    let {
        style: K,
        verbose: Y
    } = q, z = A.file_path, _ = A.old_string ?? "", w = A.new_string ?? "", O = A.replace_all ?? !1;
    if ("edits" in A && A.edits != null) return s_.createElement(Dz6, {
        file_path: z,
        operation: "update",
        firstLine: null,
        verbose: Y
    });
    if (_ === "") return s_.createElement(Dz6, {
        file_path: z,
        operation: "write",
        content: w,
        firstLine: w.split(`
`)[0] ?? null,
        verbose: Y
    });
    try {
        let H = $1().existsSync(z) ? $1().readFileSync(z, {
                encoding: "utf8"
            }) : "",
            j = sq6(H, _) || _,
            J = hD6(_, j, w),
            {
                patch: M
            } = qw1({
                filePath: z,
                fileContents: H,
                oldString: j,
                newString: J,
                replaceAll: O
            });
        return s_.createElement(Dz6, {
            file_path: z,
            operation: "update",
            patch: M,
            firstLine: H.split(`
`)[0] ?? null,
            fileContent: H,
            style: K,
            verbose: Y
        })
    } catch (H) {
        return _6(H), s_.createElement(t1, {
            height: 1
        }, s_.createElement(T, null, "(No changes)"))
    }
}
// @from(Ln 437896, Col 0)
function yGq(A, q) {
    let {
        verbose: K
    } = q;
    if (!K && typeof A === "string" && d4(A, "tool_use_error")) {
        let Y = d4(A, "tool_use_error");
        if (Y?.includes("File has not been read yet")) return s_.createElement(t1, null, s_.createElement(T, {
            dimColor: !0
        }, "File must be read first"));
        if (Y?.includes(wZ)) return s_.createElement(t1, null, s_.createElement(T, {
            color: "error"
        }, "File not found"));
        return s_.createElement(t1, null, s_.createElement(T, {
            color: "error"
        }, "Error editing file"))
    }
    return s_.createElement(eK, {
        result: A,
        verbose: K
    })
}
// @from(Ln 437917, Col 4)
s_
// @from(Ln 437918, Col 4)
Hn8 = E(() => {
    i6();
    am8();
    kO();
    tm8();
    ZW6();
    iq();
    Z7();
    JA();
    tq6();
    SA();
    k1();
    rH();
    s_ = t(P6(), 1)
})
// @from(Ln 437939, Col 0)
function c3z(A) {
    try {
        let q = i66(A);
        return {
            content: q.content,
            fileExists: !0,
            encoding: q.encoding,
            lineEndings: q.lineEndings
        }
    } catch (q) {
        if (q.code === "ENOENT") return {
            content: "",
            fileExists: !1,
            encoding: "utf8",
            lineEndings: "LF"
        };
        throw q
    }
}
// @from(Ln 437958, Col 4)
pX
// @from(Ln 437959, Col 4)
Sz6 = E(() => {
    V1();
    F21();
    Z7();
    lA();
    NU();
    xf7();
    tq6();
    RY();
    F9();
    SA();
    iY6();
    Ib();
    AT6();
    k1();
    H1();
    El6();
    vGq();
    JN();
    cf6();
    Hn8();
    HA();
    VU();
    tV1();
    A8();
    g1();
    od();
    pX = {
        name: R4,
        searchHint: "modify file contents in place",
        maxResultSizeChars: 1e5,
        strict: !0,
        async description() {
            return "A tool for editing files"
        },
        async prompt() {
            return bf7()
        },
        userFacingName: ph1,
        getToolUseSummary: $n8,
        getActivityDescription(A) {
            let q = $n8(A);
            return q ? `Editing ${q}` : "Editing file"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return lV1()
        },
        inputParamAliases: {
            old_str: "old_string",
            new_str: "new_string",
            oldString: "old_string",
            newString: "new_string",
            filePath: "file_path",
            filepath: "file_path",
            path: "file_path"
        },
        get outputSchema() {
            return Pa4()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return `${A.file_path}: ${A.new_string}`
        },
        getPath(A) {
            return A.file_path
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return Xz6(pX, A, K.toolPermissionContext)
        },
        renderToolUseMessage: NGq,
        renderToolUseProgressMessage: VGq,
        renderToolResultMessage: kGq,
        renderToolUseRejectedMessage: EGq,
        renderToolUseErrorMessage: yGq,
        async validateInput(A, q) {
            let {
                file_path: K,
                old_string: Y,
                new_string: z,
                replace_all: _ = !1
            } = A, w = L4(K), O = cV1(w, z);
            if (O) return {
                result: !1,
                message: O,
                errorCode: 0
            };
            if (Y === z) return {
                result: !1,
                behavior: "ask",
                message: "No changes to make: old_string and new_string are exactly the same.",
                errorCode: 1
            };
            let $ = q.getAppState();
            if (ZX(w, $.toolPermissionContext, "edit", "deny") !== null) return {
                result: !1,
                behavior: "ask",
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 2
            };
            if (w.startsWith("\\\\") || w.startsWith("//")) return {
                result: !0
            };
            let j = $1(),
                J;
            try {
                let Z = await j.readFileBytes(w),
                    G = Z.length >= 2 && Z[0] === 255 && Z[1] === 254 ? "utf16le" : "utf8";
                J = Z.toString(G).replaceAll(`\r
`, `
`)
            } catch (Z) {
                if (Z.code === "ENOENT") J = null;
                else throw Z
            }
            if (J === null) {
                if (Y === "") return {
                    result: !0
                };
                let Z = uP1(w),
                    G = await Ft(w),
                    f = `File does not exist. ${wZ} ${G1()}.`;
                if (G) f += ` Did you mean ${G}?`;
                else if (Z) f += ` Did you mean ${Z}?`;
                return {
                    result: !1,
                    behavior: "ask",
                    message: f,
                    errorCode: 4
                }
            }
            if (Y === "") {
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
            if (w.endsWith(".ipynb")) return {
                result: !1,
                behavior: "ask",
                message: `File is a Jupyter Notebook. Use the ${bJ} to edit this file.`,
                errorCode: 5
            };
            let M = q.readFileState.get(w);
            if (!M || M.isPartialView) return {
                result: !1,
                behavior: "ask",
                message: "File has not been read yet. Read it first before writing to it.",
                meta: {
                    isFilePathAbsolute: String(jn8(K))
                },
                errorCode: 6
            };
            if (M) {
                if (Jh(w) > M.timestamp)
                    if (M.offset === void 0 && M.limit === void 0 && J === M.content);
                    else return {
                        result: !1,
                        behavior: "ask",
                        message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                        errorCode: 7
                    }
            }
            let D = J,
                X = sq6(D, Y);
            if (!X) return {
                result: !1,
                behavior: "ask",
                message: `String to replace not found in file.
String: ${Y}`,
                meta: {
                    isFilePathAbsolute: String(jn8(K))
                },
                errorCode: 8
            };
            let P = D.split(X).length - 1;
            if (P > 1 && !_) return {
                result: !1,
                behavior: "ask",
                message: `Found ${P} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${Y}`,
                meta: {
                    isFilePathAbsolute: String(jn8(K)),
                    actualOldString: X
                },
                errorCode: 9
            };
            let W = TGq(w, D, () => {
                return _ ? D.replaceAll(X, z) : D.replace(X, z)
            });
            if (W !== null) return W;
            return {
                result: !0,
                meta: {
                    actualOldString: X
                }
            }
        },
        inputsEquivalent(A, q) {
            if ("edits" in A || "edits" in q) return B6(A) === B6(q);
            return pf7({
                file_path: A.file_path,
                edits: [{
                    old_string: A.old_string,
                    new_string: A.new_string,
                    replace_all: A.replace_all ?? !1
                }]
            }, {
                file_path: q.file_path,
                edits: [{
                    old_string: q.old_string,
                    new_string: q.new_string,
                    replace_all: q.replace_all ?? !1
                }]
            })
        },
        async call(A, {
            readFileState: q,
            userModified: K,
            updateFileHistoryState: Y,
            dynamicSkillDirTriggers: z
        }, _, w) {
            let {
                file_path: O,
                old_string: $,
                new_string: H,
                replace_all: j = !1
            } = A, J = $1(), M = L4(O), D = G1();
            if (!t6(process.env.CLAUDE_CODE_SIMPLE)) {
                let u = await EW6([M], D);
                if (u.length > 0) {
                    for (let I of u) z?.add(I);
                    yW6(u).catch(() => {})
                }
                LW6([M], D)
            }
            await Nl.beforeFileEdited(M);
            let {
                content: X,
                fileExists: P,
                encoding: W,
                lineEndings: Z
            } = c3z(M);
            if (P) {
                let u = Jh(M),
                    I = q.get(M);
                if (!I || u > I.timestamp) {
                    if (!(I && I.offset === void 0 && I.limit === void 0 && X === I.content)) throw Error(y21)
                }
            }
            if (iz()) await R66(Y, M, w.uuid);
            let G = sq6(X, $) || $,
                f = hD6($, G, H),
                {
                    patch: v,
                    updatedFile: N
                } = qw1({
                    filePath: M,
                    fileContents: X,
                    oldString: G,
                    newString: f,
                    replaceAll: j
                }),
                V = U3z(M);
            J.mkdirSync(V), l66(M, N, W, Z);
            let L = vl();
            if (L) pV1(`file://${M}`), L.changeFile(M, N).catch((u) => {
                k(`LSP: Failed to notify server of file change for ${M}: ${u.message}`), _6(u)
            }), L.saveFile(M).catch((u) => {
                k(`LSP: Failed to notify server of file save for ${M}: ${u.message}`), _6(u)
            });
            if (L66(M, X, N), q.set(M, {
                    content: N,
                    timestamp: Jh(M),
                    offset: void 0,
                    limit: void 0
                }), M.endsWith(`${d3z}CLAUDE.md`)) d("tengu_write_claudemd", {});
            px6(v), RC({
                operation: "edit",
                tool: "FileEditTool",
                filePath: M
            });
            let h;
            if (t6(process.env.CLAUDE_CODE_REMOTE) && w8("tengu_quartz_lantern", !1)) {
                let u = Date.now(),
                    I = await sV1(M);
                if (I) h = I;
                d("tengu_tool_use_diff_computed", {
                    isEditTool: !0,
                    durationMs: Date.now() - u,
                    hasDiff: !!I
                })
            }
            return {
                data: {
                    filePath: O,
                    oldString: G,
                    newString: H,
                    originalFile: X,
                    structuredPatch: v,
                    userModified: K ?? !1,
                    replaceAll: j,
                    ...h && {
                        gitDiff: h
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                filePath: K,
                oldString: Y,
                newString: z,
                userModified: _,
                replaceAll: w
            } = A, O = _ ? ".  The user modified your proposed changes before accepting them. " : "";
            if (w) {
                let H = w8("tengu_copper_wren", !1) ? `The file ${K} has been updated${O}. All occurrences were successfully replaced.` : `The file ${K} has been updated${O}. All occurrences of '${Y}' were successfully replaced with '${z}'.`;
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: H
                }
            }
            return {
                tool_use_id: q,
                type: "tool_result",
                content: `The file ${K} has been updated successfully${O}.${""}`
            }
        }
    }
})
// @from(Ln 438308, Col 0)
function n3z(A, q) {
    let K = i3z[A];
    if (!K || K.length === 0) return q;
    let Y = {
            ...q
        },
        z = Y.properties;
    if (z && typeof z === "object") {
        let _ = {
            ...z
        };
        for (let w of K) delete _[w];
        Y.properties = _
    }
    return Y
}
// @from(Ln 438324, Col 0)
async function Sh1(A, q) {
    let K = jY("tengu_tool_pear"),
        Y = "inputJSONSchema" in A && A.inputJSONSchema ? A.inputJSONSchema : fU(A.inputSchema);
    if (!E7()) Y = n3z(A.name, Y);
    let z = {
        name: A.name,
        description: await A.prompt({
            getToolPermissionContext: q.getToolPermissionContext,
            tools: q.tools,
            agents: q.agents,
            allowedAgentTypes: q.allowedAgentTypes
        }),
        input_schema: Y
    };
    if (K && A.strict === !0 && q.model && eY6(q.model)) z.strict = !0;
    if (q.betas?.includes(nA1) && A.input_examples) z.input_examples = A.input_examples;
    if (q.deferLoading) z.defer_loading = !0;
    if (q.cacheControl) z.cache_control = q.cacheControl;
    if (w8("tengu_fgts", !1) || t6(process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING)) z.eager_input_streaming = !0;
    return z
}
// @from(Ln 438346, Col 0)
function RGq(A) {
    let [q] = Jn8(A), K = q?.text;
    d("tengu_sysprompt_block", {
        snippet: K?.slice(0, 20),
        length: K?.length ?? 0,
        hash: K ? l3z("sha256").update(K).digest("hex") : ""
    })
}
// @from(Ln 438355, Col 0)
function Jn8(A, q) {
    let K = C_6() && (t6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || w8("tengu_system_prompt_global_cache", !1));
    if (K && q?.skipGlobalCacheForSystemPrompt) {
        d("tengu_sysprompt_using_tool_based_cache", {
            promptBlockCount: A.length
        });
        let $, H, j = [];
        for (let D of A) {
            if (!D) continue;
            if (D === S_6) continue;
            if (D.startsWith("x-anthropic-billing-header")) $ = D;
            else if (x21.has(D)) H = D;
            else j.push(D)
        }
        let J = [];
        if ($) J.push({
            text: $,
            cacheScope: null
        });
        if (H) J.push({
            text: H,
            cacheScope: "org"
        });
        let M = j.join(`

`);
        if (M) J.push({
            text: M,
            cacheScope: "org"
        });
        return J
    }
    if (K) {
        let $ = A.findIndex((H) => H === S_6);
        if ($ !== -1) {
            let H, j, J = [],
                M = [];
            for (let W = 0; W < A.length; W++) {
                let Z = A[W];
                if (!Z || Z === S_6) continue;
                if (Z.startsWith("x-anthropic-billing-header")) H = Z;
                else if (x21.has(Z)) j = Z;
                else if (W < $) J.push(Z);
                else M.push(Z)
            }
            let D = [];
            if (H) D.push({
                text: H,
                cacheScope: null
            });
            if (j) D.push({
                text: j,
                cacheScope: null
            });
            let X = J.join(`

`);
            if (X) D.push({
                text: X,
                cacheScope: "global"
            });
            let P = M.join(`

`);
            if (P) D.push({
                text: P,
                cacheScope: null
            });
            return d("tengu_sysprompt_boundary_found", {
                blockCount: D.length,
                staticBlockLength: X.length,
                dynamicBlockLength: P.length
            }), D
        } else d("tengu_sysprompt_missing_boundary_marker", {
            promptBlockCount: A.length
        })
    }
    let Y, z, _ = [];
    for (let $ of A) {
        if (!$) continue;
        if ($.startsWith("x-anthropic-billing-header")) Y = $;
        else if (x21.has($)) z = $;
        else _.push($)
    }
    let w = [];
    if (Y) w.push({
        text: Y,
        cacheScope: null
    });
    if (z) w.push({
        text: z,
        cacheScope: "org"
    });
    let O = _.join(`

`);
    if (O) w.push({
        text: O,
        cacheScope: "org"
    });
    return w
}
// @from(Ln 438458, Col 0)
function xKq(A, q) {
    return [...A, Object.entries(q).map(([K, Y]) => `${K}: ${Y}`).join(`
`)].filter(Boolean)
}
// @from(Ln 438463, Col 0)
function eE1(A, q) {
    if (Object.entries(q).length === 0) return A;
    return [p1({
        content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(q).map(([K,Y])=>`# ${K}
${Y}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
        isMeta: !0
    }), ...A]
}
// @from(Ln 438478, Col 0)
async function hGq(A, q) {
    if (My()) return;
    let [{
        tools: K
    }, Y, z, _] = await Promise.all([Fr6(A), FX(q), a2(), mw()]), w = _.gitStatus?.length ?? 0, O = z.claudeMd?.length ?? 0, $ = w + O, H = G1(), j = zT6(q), J = YT6(j, H), M = await e81(H, AbortSignal.timeout(1000), J), D = 0, X = 0, P = 0, W = 0, Z = 0, G = Y.filter((v) => !v.isMcp);
    D = K.length, W = G.length;
    let f = new Set;
    for (let v of K) {
        let N = v.name.split("__");
        if (N.length >= 3 && N[1]) f.add(N[1])
    }
    X = f.size;
    for (let v of K) {
        let N = "inputJSONSchema" in v && v.inputJSONSchema ? v.inputJSONSchema : fU(v.inputSchema);
        P += j5(B6(N))
    }
    for (let v of G) {
        let N = "inputJSONSchema" in v && v.inputJSONSchema ? v.inputJSONSchema : fU(v.inputSchema);
        Z += j5(B6(N))
    }
    d("tengu_context_size", {
        git_status_size: w,
        claude_md_size: O,
        total_context_size: $,
        project_file_count_rounded: M,
        mcp_tools_count: D,
        mcp_servers_count: X,
        mcp_tools_tokens: P,
        non_mcp_tools_count: W,
        non_mcp_tools_tokens: Z
    })
}
// @from(Ln 438511, Col 0)
function SGq(A, q, K) {
    switch (A.name) {
        case aJ: {
            let Y = sJ(K),
                z = Fj(K);
            return K94(), Y !== null ? {
                ...q,
                plan: Y,
                planFilePath: z
            } : q
        }
        case J4.name: {
            let Y = J4.inputSchema.parse(q),
                {
                    command: z,
                    timeout: _,
                    description: w
                } = Y,
                O = G1(),
                $ = z.replace(`cd ${O} && `, "");
            if (y8() === "windows") $ = $.replace(`cd ${GP(O)} && `, "");
            if ($ = $.replace(/\\\\;/g, "\\;"), /^echo\s+["']?[^|&;><]*["']?$/i.test($.trim())) d("tengu_bash_tool_simple_echo", {});
            let H = "run_in_background" in Y ? Y.run_in_background : void 0;
            return {
                command: $,
                description: w,
                ..._ ? {
                    timeout: _
                } : {},
                ...w ? {
                    description: w
                } : {},
                ...H ? {
                    run_in_background: H
                } : {},
                ..."dangerouslyDisableSandbox" in Y && Y.dangerouslyDisableSandbox ? {
                    dangerouslyDisableSandbox: Y.dangerouslyDisableSandbox
                } : {}
            }
        }
        case pX.name: {
            let Y = pX.inputSchema.parse(q),
                {
                    file_path: z,
                    edits: _
                } = Ff7({
                    file_path: Y.file_path,
                    edits: [{
                        old_string: Y.old_string,
                        new_string: Y.new_string,
                        replace_all: Y.replace_all
                    }]
                });
            return {
                replace_all: _[0].replace_all,
                file_path: z,
                old_string: _[0].old_string,
                new_string: _[0].new_string
            }
        }
        case xX.name: {
            let Y = xX.inputSchema.parse(q);
            return {
                file_path: Y.file_path,
                content: yO8(Y.content)
            }
        }
        case $C: {
            let Y = q,
                z = Y.task_id ?? Y.agentId ?? Y.bash_id,
                _ = Y.timeout ?? (typeof Y.wait_up_to === "number" ? Y.wait_up_to * 1000 : void 0);
            return {
                task_id: z ?? "",
                block: Y.block ?? !0,
                timeout: _ ?? 30000
            }
        }
        default:
            return q
    }
}
// @from(Ln 438593, Col 0)
function CGq(A, q) {
    switch (A.name) {
        case aJ: {
            if (q && typeof q === "object" && (("plan" in q) || ("planFilePath" in q))) {
                let {
                    plan: K,
                    planFilePath: Y,
                    ...z
                } = q;
                return z
            }
            return q
        }
        case pX.name: {
            if (q && typeof q === "object" && "edits" in q) {
                let {
                    old_string: K,
                    new_string: Y,
                    replace_all: z,
                    ..._
                } = q;
                return _
            }
            return q
        }
        default:
            return q
    }
}
// @from(Ln 438622, Col 4)
i3z
// @from(Ln 438623, Col 4)
Fz6 = E(() => {
    A8();
    g21();
    HA();
    B21();
    V1();
    JA();
    jy();
    lA();
    YK();
    lx();
    RY();
    OZ();
    Sz6();
    tq6();
    El6();
    c66();
    Qz();
    rH();
    Hf();
    g1();
    Mf();
    Tr();
    QP();
    bv();
    IX();
    ip();
    jE();
    HA();
    i3z = {
        [aJ]: ["launchSwarm", "teammateCount"],
        [r4]: ["name", "team_name", "mode"]
    }
})
// @from(Ln 438658, Col 0)
function Mn8(A, q) {
    let K = -1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z && typeof z === "object" && "type" in z && z.type === "tool_result") K = Y
    }
    if (K >= 0) {
        let Y = K + 1;
        if (A.splice(Y, 0, q), Y === A.length - 1) A.push({
            type: "text",
            text: "."
        })
    } else {
        let Y = Math.max(0, A.length - 1);
        A.splice(Y, 0, q)
    }
}
// @from(Ln 438679, Col 0)
function Ih1(A) {
    let q = process.env.CLAUDE_CODE_EXTRA_BODY,
        K = {};
    if (q) try {
        let Y = WK(q);
        if (Y && typeof Y === "object" && !Array.isArray(Y)) K = {
            ...Y
        };
        else k(`CLAUDE_CODE_EXTRA_BODY env var must be a JSON object, but was given ${q}`, {
            level: "error"
        })
    } catch (Y) {
        k(`Error parsing CLAUDE_CODE_EXTRA_BODY: ${_1(Y)}`, {
            level: "error"
        })
    }
    if (A && A.length > 0)
        if (K.anthropic_beta && Array.isArray(K.anthropic_beta)) {
            let Y = K.anthropic_beta,
                z = A.filter((_) => !Y.includes(_));
            K.anthropic_beta = [...Y, ...z]
        } else K.anthropic_beta = A;
    return K
}
// @from(Ln 438704, Col 0)
function IGq(A) {
    if (t6(process.env.DISABLE_PROMPT_CACHING)) return !1;
    if (t6(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
        let q = lH();
        if (A === q) return !1
    }
    if (t6(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
        let q = Ef();
        if (A === q) return !1
    }
    if (t6(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
        let q = GN();
        if (A === q) return !1
    }
    return !0
}
// @from(Ln 438721, Col 0)
function Ml({
    scope: A,
    querySource: q
} = {}) {
    return {
        type: "ephemeral",
        ...o3z(q) ? {
            ttl: "1h"
        } : {},
        ...A === "global" ? {
            scope: A
        } : {}
    }
}
// @from(Ln 438736, Col 0)
function o3z(A) {
    if (QA() === "bedrock" && t6(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)) return !0;
    if (!(iA() && !Jf.isUsingOverage)) return !1;
    let K = eu1();
    if (K === null) K = w8("tengu_prompt_cache_1h_config", {}).allowlist ?? [], Am1(K);
    return A !== void 0 && K.some((Y) => Y.endsWith("*") ? A.startsWith(Y.slice(0, -1)) : A === Y)
}
// @from(Ln 438744, Col 0)
function a3z(A, q, K, Y, z) {
    if (!yC(z) || "effort" in q) return;
    if (A === void 0) Y.push(sn1);
    else if (typeof A === "string") q.effort = A, Y.push(sn1)
}
// @from(Ln 438750, Col 0)
function Vt() {
    let A = Jy(),
        q = L3()?.accountUuid ?? "",
        K = R1();
    return {
        user_id: `user_${A}_account_${q}_session_${K}`
    }
}
// @from(Ln 438758, Col 0)
async function uGq(A, q) {
    if (q) return !0;
    try {
        let K = lH(),
            Y = bk(K);
        return await Vz4(_P1(() => MI({
            apiKey: A,
            maxRetries: 3,
            model: K,
            source: "verify_api_key"
        }), async (z) => {
            let _ = [{
                role: "user",
                content: "test"
            }];
            return await z.beta.messages.create({
                model: K,
                max_tokens: 1,
                messages: _,
                temperature: 1,
                ...Y.length > 0 ? {
                    betas: Y
                } : {},
                metadata: Vt(),
                ...Ih1()
            }), !0
        }, {
            maxRetries: 2,
            model: K,
            thinkingConfig: {
                type: "disabled"
            }
        }))
    } catch (K) {
        let Y = K;
        if (K instanceof RB) Y = K.originalError;
        if (_6(Y), Y instanceof Error && Y.message.includes('{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}')) return !1;
        throw Y
    }
}
// @from(Ln 438799, Col 0)
function s3z(A, q = !1, K, Y) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "user",
            content: [{
                type: "text",
                text: A.message.content,
                ...K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {}
            }]
        };
        else return {
            role: "user",
            content: A.message.content.map((z, _) => ({
                ...z,
                ..._ === A.message.content.length - 1 ? K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {} : {}
            }))
        };
    return {
        role: "user",
        content: Array.isArray(A.message.content) ? [...A.message.content] : A.message.content
    }
}
// @from(Ln 438830, Col 0)
function t3z(A, q = !1, K, Y) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "assistant",
            content: [{
                type: "text",
                text: A.message.content,
                ...K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {}
            }]
        };
        else return {
            role: "assistant",
            content: A.message.content.map((z, _) => ({
                ...z,
                ..._ === A.message.content.length - 1 && z.type !== "thinking" && z.type !== "redacted_thinking" ? K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {} : {}
            }))
        };
    return {
        role: "assistant",
        content: A.message.content
    }
}
// @from(Ln 438860, Col 0)
async function _i({
    messages: A,
    systemPrompt: q,
    thinkingConfig: K,
    tools: Y,
    signal: z,
    options: _
}) {
    let w;
    for await (let O of ff8(A, async function*() {
        yield* mGq(A, q, K, Y, z, _)
    })) if (O.type === "assistant") w = O;
    if (!w) {
        if (z.aborted) throw new Az;
        throw Error("No assistant message found")
    }
    return w
}
// @from(Ln 438878, Col 0)
async function* NT6({
    messages: A,
    systemPrompt: q,
    thinkingConfig: K,
    tools: Y,
    signal: z,
    options: _
}) {
    return yield* ff8(A, async function*() {
        yield* mGq(A, q, K, Y, z, _)
    })
}
// @from(Ln 438891, Col 0)
function e3z(A) {
    if (!("isLsp" in A) || !A.isLsp) return !1;
    let q = qT6();
    return q.status === "pending" || q.status === "not-started"
}
// @from(Ln 438896, Col 0)
async function* bGq(A, q, K, Y, z) {
    let _ = _P1(() => MI({
            maxRetries: 0,
            model: A.model,
            fetchOverride: A.fetchOverride,
            source: A.source
        }), async (O, $, H) => {
            let j = Date.now(),
                J = K(H);
            z(J), Y($, j, J.max_tokens);
            let M = O9z(J, w9z);
            return await O.beta.messages.create({
                ...M,
                model: lg(M.model)
            })
        }, {
            model: q.model,
            fallbackModel: q.fallbackModel,
            thinkingConfig: q.thinkingConfig,
            ...Dq() ? {
                fastMode: q.fastMode
            } : {},
            signal: q.signal,
            initialConsecutive529Errors: q.initialConsecutive529Errors
        }),
        w;
    do
        if (w = await _.next(), !w.done && w.value.type === "system") yield w.value; while (!w.done);
    return w.value
}
// @from(Ln 438927, Col 0)
function A9z(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K.type === "assistant" && K.requestId) return K.requestId
    }
    return
}
// @from(Ln 438935, Col 0)
function Uh1(A) {
    return A.type === "image" || A.type === "document"
}
// @from(Ln 438939, Col 0)
function xGq(A) {
    return A.type === "tool_result"
}
// @from(Ln 438943, Col 0)
function q9z(A, q) {
    let K = 0;
    for (let Y of A) {
        if (!Array.isArray(Y.message.content)) continue;
        for (let z of Y.message.content) {
            if (Uh1(z)) K++;
            if (xGq(z) && Array.isArray(z.content)) {
                for (let _ of z.content)
                    if (Uh1(_)) K++
            }
        }
    }
    if (K -= q, K <= 0) return A;
    return A.map((Y) => {
        if (K <= 0) return Y;
        let z = Y.message.content;
        if (!Array.isArray(z)) return Y;
        let _ = K,
            w = z.map((O) => {
                if (K <= 0 || !xGq(O) || !Array.isArray(O.content)) return O;
                let $ = O.content.filter((H) => {
                    if (K > 0 && Uh1(H)) return K--, !1;
                    return !0
                });
                return $.length === O.content.length ? O : {
                    ...O,
                    content: $
                }
            }).filter((O) => {
                if (K > 0 && Uh1(O)) return K--, !1;
                return !0
            });
        return _ === K ? Y : {
            ...Y,
            message: {
                ...Y.message,
                content: w
            }
        }
    })
}