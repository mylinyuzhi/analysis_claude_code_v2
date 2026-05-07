
// @from(Ln 506534, Col 0)
function A8A(q) {
    let K = q.find((Y) => Y.role === "user");
    if (!K) return "";
    let _ = K.content;
    if (typeof _ === "string") return _;
    let z = _.find((Y) => Y.type === "text");
    return z?.type === "text" ? z.text : ""
}
// @from(Ln 506542, Col 0)
async function dR(q) {
    let {
        model: K,
        system: _,
        messages: z,
        tools: Y,
        tool_choice: A,
        output_format: O,
        max_tokens: w = 1024,
        maxRetries: $ = 2,
        signal: j,
        skipSystemPromptPrefix: H,
        temperature: J,
        thinking: X,
        stop_sequences: M,
        extraBodyParams: P
    } = q, W = await qR({
        maxRetries: $,
        model: K,
        source: "side_query"
    }), D = [...KR(K)];
    if (O && R26(K) && !D.includes(t76)) D.push(t76);
    let Z = A8A(z),
        G = vJ7(Z, {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION),
        f = dk8(G),
        v = [f ? {
            type: "text",
            text: f
        } : null, ...H ? [] : [{
            type: "text",
            text: Qk8({
                isNonInteractive: !1,
                hasAppendSystemPrompt: !1
            })
        }], ...Array.isArray(_) ? _ : _ ? [{
            type: "text",
            text: _
        }] : []].filter((B) => B !== null),
        V;
    if (X === !1) V = {
        type: "disabled"
    };
    else if (X !== void 0) V = {
        type: "enabled",
        budget_tokens: Math.min(X, w - 1)
    };
    let k = Of(K),
        N = Date.now(),
        R = await W.beta.messages.create({
            model: k,
            max_tokens: w,
            system: v,
            messages: z,
            ...Y && {
                tools: Y
            },
            ...A && {
                tool_choice: A
            },
            ...O && {
                output_config: {
                    format: O
                }
            },
            ...J !== void 0 && WV8(k) && {
                temperature: J
            },
            ...M && {
                stop_sequences: M
            },
            ...V && {
                thinking: V
            },
            ...D.length > 0 && {
                betas: D
            },
            metadata: fK6(),
            ...P
        }, {
            signal: j
        }),
        h = R._request_id ?? void 0,
        C = Date.now(),
        x = Ri();
    return d("tengu_api_success", {
        requestId: h,
        querySource: q.querySource,
        model: k,
        inputTokens: R.usage.input_tokens,
        outputTokens: R.usage.output_tokens,
        cachedInputTokens: R.usage.cache_read_input_tokens ?? 0,
        uncachedInputTokens: R.usage.cache_creation_input_tokens ?? 0,
        durationMsIncludingRetries: C - N,
        timeSinceLastApiCallMs: x !== null ? C - x : void 0
    }), QB6(C), R
}
// @from(Ln 506645, Col 4)
tH6 = L(() => {
    y8();
    e76();
    ck8();
    C8();
    O2();
    Pk6();
    pv();
    TJ7();
    Sq()
})
// @from(Ln 506656, Col 4)
ez7 = {}
// @from(Ln 506665, Col 0)
function j8A(q) {
    return t85.some((K) => K === q)
}
// @from(Ln 506669, Col 0)
function H8A() {
    if (S6(process.env.USE_LOCAL_OAUTH) || S6(process.env.LOCAL_BRIDGE)) return "ws://localhost:8765";
    if (S6(process.env.USE_STAGING_OAUTH)) return "wss://bridge-staging.claudeusercontent.com";
    return "wss://bridge.claudeusercontent.com"
}
// @from(Ln 506675, Col 0)
function J8A() {
    return S6(process.env.USE_LOCAL_OAUTH) || S6(process.env.LOCAL_BRIDGE)
}
// @from(Ln 506679, Col 0)
function e85(q) {
    let K = new q15,
        _ = H8A();
    K.info(`Bridge URL: ${_}`);
    let z = q?.CLAUDE_CHROME_PERMISSION_MODE ?? process.env.CLAUDE_CHROME_PERMISSION_MODE,
        Y;
    if (z)
        if (j8A(z)) Y = z;
        else K.warn(`Invalid CLAUDE_CHROME_PERMISSION_MODE "${z}". Valid values: ${t85.join(", ")}`);
    return {
        serverName: "Claude in Chrome",
        logger: K,
        socketPath: DI8(),
        getSocketPaths: zC4,
        clientTypeId: "claude-code",
        onAuthenticationError: () => {
            K.warn("Authentication error occurred. Please ensure you are logged into the Claude browser extension with the same claude.ai account as Claude Code.")
        },
        onToolCallDisconnected: () => {
            return `Browser extension is not connected. Please ensure the Claude browser extension is installed and running (${O8A}), and that you are logged into claude.ai with the same account as Claude Code. If this is your first time connecting to Chrome, you may need to restart Chrome for the installation to take effect. If you continue to experience issues, please report a bug: ${w8A}`
        },
        onExtensionPaired: (A, O) => {
            d8((w) => {
                if (w.chromeExtension?.pairedDeviceId === A && w.chromeExtension?.pairedDeviceName === O) return w;
                return {
                    ...w,
                    chromeExtension: {
                        pairedDeviceId: A,
                        pairedDeviceName: O
                    }
                }
            }), K.info(`Paired with "${O}" (${A.slice(0,8)})`)
        },
        getPersistedDeviceId: () => {
            return H8().chromeExtension?.pairedDeviceId
        },
        bridgeConfig: {
            url: _,
            getUserId: async () => {
                return H8().oauthAccount?.accountUuid
            },
            getOAuthToken: async () => {
                return o7()?.accessToken ?? ""
            },
            ...J8A() && {
                devUserId: "dev_user_local"
            }
        },
        ...Y && {
            initialPermissionMode: Y
        },
        ...!1,
        trackEvent: (A, O) => {
            let w = {};
            if (O)
                for (let [$, j] of Object.entries(O)) {
                    let H = $ === "status" ? "bridge_status" : $;
                    if (typeof j === "boolean" || typeof j === "number") w[H] = j;
                    else if (typeof j === "string" && $8A.has(H)) w[H] = j
                }
            d(A, w)
        }
    }
}
// @from(Ln 506743, Col 0)
async function X8A() {
    $$6(), ak6();
    let q = e85(),
        K = Bj8(q),
        _ = new YA6,
        z = !1,
        Y = async () => {
            if (z) return;
            z = !0, await ka(), await Ra(), process.exit(0)
        };
    process.stdin.on("end", () => void Y()), process.stdin.on("error", () => void Y()), E("[Claude in Chrome] Starting MCP server"), await K.connect(_), E("[Claude in Chrome] MCP server started")
}
// @from(Ln 506755, Col 0)
class q15 {
    silly(q, ...K) {
        E(Ez8(q, ...K), {
            level: "debug"
        })
    }
    debug(q, ...K) {
        E(Ez8(q, ...K), {
            level: "debug"
        })
    }
    info(q, ...K) {
        E(Ez8(q, ...K), {
            level: "info"
        })
    }
    warn(q, ...K) {
        E(Ez8(q, ...K), {
            level: "warn"
        })
    }
    error(q, ...K) {
        E(Ez8(q, ...K), {
            level: "error"
        })
    }
}
// @from(Ln 506782, Col 4)
O8A = "https://claude.ai/chrome"
// @from(Ln 506783, Col 4)
w8A = "https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome"
// @from(Ln 506784, Col 4)
$8A
// @from(Ln 506784, Col 9)
t85
// @from(Ln 506785, Col 4)
qY7 = L(() => {
    jU6();
    Fj8();
    J$6();
    BB();
    C8();
    Ka6();
    T7();
    h1();
    K8();
    Q8();
    tH6();
    ip();
    $8A = new Set(["bridge_status", "error_type", "tool_name"]), t85 = ["ask", "skip_all_permission_checks", "follow_a_plan"]
})
// @from(Ln 506800, Col 4)
O15 = {}
// @from(Ln 506823, Col 0)
function uj(q, ...K) {
    if (z15) {
        let _ = new Date().toISOString(),
            z = K.length > 0 ? " " + I6(K) : "",
            Y = `[${_}] [Claude Chrome Native Host] ${q}${z}
`;
        M8A(z15, Y).catch(() => {})
    }
    console.error(`[Claude Chrome Native Host] ${q}`, ...K)
}
// @from(Ln 506834, Col 0)
function f66(q) {
    let K = Buffer.from(q, "utf-8"),
        _ = Buffer.alloc(4);
    _.writeUInt32LE(K.length, 0), process.stdout.write(_), process.stdout.write(K)
}
// @from(Ln 506839, Col 0)
async function G8A() {
    uj("Initializing...");
    let q = new Y15,
        K = new A15;
    await q.start();
    while (!0) {
        let _ = await K.read();
        if (_ === null) break;
        await q.handleMessage(_)
    }
    await q.stop()
}
// @from(Ln 506851, Col 0)
class Y15 {
    mcpClients = new Map;
    nextClientId = 1;
    server = null;
    running = !1;
    socketPath = null;
    async start() {
        if (this.running) return;
        if (this.socketPath = DI8(), LJ7() !== "win32") {
            let q = i88();
            await yJ7(q).catch(() => {}), await P8A(q, {
                recursive: !0,
                mode: 448
            }), await K15(q, 448).catch(() => {});
            try {
                let K = await _15(q);
                for (let _ of K) {
                    if (!_.endsWith(".sock")) continue;
                    let z = parseInt(_.replace(".sock", ""), 10);
                    if (isNaN(z)) continue;
                    try {
                        process.kill(z, 0)
                    } catch {
                        await yJ7(Z8A(q, _)).catch(() => {}), uj(`Removed stale socket for PID ${z}`)
                    }
                }
            } catch {}
        }
        if (uj(`Creating socket listener: ${this.socketPath}`), this.server = D8A((q) => this.handleMcpClient(q)), await new Promise((q, K) => {
                this.server.listen(this.socketPath, () => {
                    uj("Socket server listening for connections"), this.running = !0, q()
                }), this.server.on("error", (_) => {
                    uj("Socket server error:", _), K(_)
                })
            }), LJ7() !== "win32") try {
            await K15(this.socketPath, 384), uj("Socket permissions set to 0600")
        } catch (q) {
            uj("Failed to set socket permissions:", q)
        }
    }
    async stop() {
        if (!this.running) return;
        for (let [, q] of this.mcpClients) q.socket.destroy();
        if (this.mcpClients.clear(), this.server) await new Promise((q) => {
            this.server.close(() => q())
        }), this.server = null;
        if (LJ7() !== "win32" && this.socketPath) {
            try {
                await yJ7(this.socketPath), uj("Cleaned up socket file")
            } catch {}
            try {
                let q = i88();
                if ((await _15(q)).length === 0) await W8A(q), uj("Removed empty socket directory")
            } catch {}
        }
        this.running = !1
    }
    async isRunning() {
        return this.running
    }
    async getClientCount() {
        return this.mcpClients.size
    }
    async handleMessage(q) {
        let K;
        try {
            K = n8(q)
        } catch (Y) {
            uj("Invalid JSON from Chrome:", Y.message), f66(I6({
                type: "error",
                error: "Invalid message format"
            }));
            return
        }
        let _ = v8A().safeParse(K);
        if (!_.success) {
            uj("Invalid message from Chrome:", _.error.message), f66(I6({
                type: "error",
                error: "Invalid message format"
            }));
            return
        }
        let z = _.data;
        switch (uj(`Handling Chrome message type: ${z.type}`), z.type) {
            case "ping":
                uj("Responding to ping"), f66(I6({
                    type: "pong",
                    timestamp: Date.now()
                }));
                break;
            case "get_status":
                f66(I6({
                    type: "status_response",
                    native_host_version: f8A
                }));
                break;
            case "tool_response": {
                if (this.mcpClients.size > 0) {
                    uj(`Forwarding tool response to ${this.mcpClients.size} MCP clients`);
                    let {
                        type: Y,
                        ...A
                    } = z, O = Buffer.from(I6(A), "utf-8"), w = Buffer.alloc(4);
                    w.writeUInt32LE(O.length, 0);
                    let $ = Buffer.concat([w, O]);
                    for (let [j, H] of this.mcpClients) try {
                        H.socket.write($)
                    } catch (J) {
                        uj(`Failed to send to MCP client ${j}:`, J)
                    }
                }
                break
            }
            case "notification": {
                if (this.mcpClients.size > 0) {
                    uj(`Forwarding notification to ${this.mcpClients.size} MCP clients`);
                    let {
                        type: Y,
                        ...A
                    } = z, O = Buffer.from(I6(A), "utf-8"), w = Buffer.alloc(4);
                    w.writeUInt32LE(O.length, 0);
                    let $ = Buffer.concat([w, O]);
                    for (let [j, H] of this.mcpClients) try {
                        H.socket.write($)
                    } catch (J) {
                        uj(`Failed to send notification to MCP client ${j}:`, J)
                    }
                }
                break
            }
            default:
                uj(`Unknown message type: ${z.type}`), f66(I6({
                    type: "error",
                    error: `Unknown message type: ${z.type}`
                }))
        }
    }
    handleMcpClient(q) {
        let K = this.nextClientId++,
            _ = {
                id: K,
                socket: q,
                buffer: Buffer.alloc(0)
            };
        this.mcpClients.set(K, _), uj(`MCP client ${K} connected. Total clients: ${this.mcpClients.size}`), f66(I6({
            type: "mcp_connected"
        })), q.on("data", (z) => {
            _.buffer = Buffer.concat([_.buffer, z]);
            while (_.buffer.length >= 4) {
                let Y = _.buffer.readUInt32LE(0);
                if (Y === 0 || Y > hJ7) {
                    uj(`Invalid message length from MCP client ${K}: ${Y}`), q.destroy();
                    return
                }
                if (_.buffer.length < 4 + Y) break;
                let A = _.buffer.slice(4, 4 + Y);
                _.buffer = _.buffer.slice(4 + Y);
                try {
                    let O = n8(A.toString("utf-8"));
                    uj(`Forwarding tool request from MCP client ${K}: ${O.method}`), f66(I6({
                        type: "tool_request",
                        method: O.method,
                        params: O.params
                    }))
                } catch (O) {
                    uj(`Failed to parse tool request from MCP client ${K}:`, O)
                }
            }
        }), q.on("error", (z) => {
            uj(`MCP client ${K} error: ${z}`)
        }), q.on("close", () => {
            uj(`MCP client ${K} disconnected. Remaining clients: ${this.mcpClients.size-1}`), this.mcpClients.delete(K), f66(I6({
                type: "mcp_disconnected"
            }))
        })
    }
}
// @from(Ln 507028, Col 0)
class A15 {
    buffer = Buffer.alloc(0);
    pendingResolve = null;
    closed = !1;
    constructor() {
        process.stdin.on("data", (q) => {
            this.buffer = Buffer.concat([this.buffer, q]), this.tryProcessMessage()
        }), process.stdin.on("end", () => {
            if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
        }), process.stdin.on("error", () => {
            if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
        })
    }
    tryProcessMessage() {
        if (!this.pendingResolve) return;
        if (this.buffer.length < 4) return;
        let q = this.buffer.readUInt32LE(0);
        if (q === 0 || q > hJ7) {
            uj(`Invalid message length: ${q}`), this.pendingResolve(null), this.pendingResolve = null;
            return
        }
        if (this.buffer.length < 4 + q) return;
        let K = this.buffer.subarray(4, 4 + q);
        this.buffer = this.buffer.subarray(4 + q);
        let _ = K.toString("utf-8");
        this.pendingResolve(_), this.pendingResolve = null
    }
    async read() {
        if (this.closed) return null;
        if (this.buffer.length >= 4) {
            let q = this.buffer.readUInt32LE(0);
            if (q > 0 && q <= hJ7 && this.buffer.length >= 4 + q) {
                let K = this.buffer.subarray(4, 4 + q);
                return this.buffer = this.buffer.subarray(4 + q), K.toString("utf-8")
            }
        }
        return new Promise((q) => {
            this.pendingResolve = q, this.tryProcessMessage()
        })
    }
}
// @from(Ln 507069, Col 4)
f8A = "1.0.0"
// @from(Ln 507070, Col 4)
hJ7 = 1048576
// @from(Ln 507071, Col 4)
z15 = void 0
// @from(Ln 507072, Col 4)
v8A
// @from(Ln 507073, Col 4)
w15 = L(() => {
    Hs();
    e8();
    ip();
    v8A = C6(() => g7.object({
        type: g7.string()
    }).passthrough())
})
// @from(Ln 507082, Col 0)
function pu6() {
    let {
        namespace: q,
        cluster: K
    } = zG7();
    return {
        ...q && {
            cooNamespace: q
        },
        ...K && {
            cooCluster: K
        }
    }
}
// @from(Ln 507096, Col 4)
Na8 = L(() => {
    Q8()
})
// @from(Ln 507099, Col 0)
async function V8A(q) {
    return (await yu(q, T8A)).split(`
`).filter((_) => _.length > 0)
}
// @from(Ln 507104, Col 0)
function $15(q) {
    let K = q.write ?? ((U) => process.stdout.write(U)),
        _ = q.verbose,
        z = 0,
        Y = "idle",
        A = "Ready",
        O = "",
        w = "",
        $ = "",
        j = "",
        H = "",
        J = null,
        X = [],
        M = !1,
        P = null,
        W = 0,
        D = 0,
        Z = 1,
        G = null,
        f = "single-session",
        v = new Map,
        V = null,
        k = 0;

    function N(U) {
        let g = process.stdout.columns || 80,
            c = 0;
        for (let n of U.split(`
`)) {
            if (n.length === 0) {
                c++;
                continue
            }
            let l = N1(n);
            c += Math.max(1, Math.ceil(l / g))
        }
        if (U.endsWith(`
`)) c--;
        return c
    }

    function R(U) {
        K(U), z += N(U)
    }

    function h() {
        if (z <= 0) return;
        E(`[bridge:ui] clearStatusLines count=${z}`), K(`\x1B[${z}A`), K("\x1B[J"), z = 0
    }

    function C(U) {
        h(), K(U)
    }

    function x(U) {
        V8A(U).then((g) => {
            X = g, F()
        }).catch((g) => {
            E(`QR code generation failed: ${g}`, {
                level: "error"
            })
        })
    }

    function B() {
        h();
        let U = SQ6[k % SQ6.length],
            g = "";
        if (O) g += Y8.dim(" · ") + Y8.dim(O);
        if (w) g += Y8.dim(" · ") + Y8.dim(w);
        R(`${Y8.yellow(U)} ${Y8.yellow("Connecting")}${g}
`)
    }

    function m() {
        S(), B(), V = setInterval(() => {
            k++, B()
        }, 150)
    }

    function S() {
        if (V) clearInterval(V), V = null
    }

    function F() {
        if (Y === "reconnecting" || Y === "failed") return;
        h();
        let U = Y === "idle";
        if (M)
            for (let e of X) R(`${Y8.dim(e)}
`);
        let g = OX8,
            c = U ? Y8.green : Y8.cyan,
            l = (U ? Y8.green : Y8.cyan)(A),
            z6 = "";
        if (O) z6 += Y8.dim(" · ") + Y8.dim(O);
        if (w && f !== "worktree") z6 += Y8.dim(" · ") + Y8.dim(w);
        if (R(`${c(g)} ${l}${z6}
`), Z > 1) {
            let e = f === "worktree" ? "New sessions will be created in an isolated worktree" : "New sessions will be created in the current directory";
            R(`    ${Y8.dim(`Capacity: ${D}/${Z} · ${e}`)}
`);
            for (let [, i] of v) {
                let O6 = i.title ? j4(i.title, 35) : Y8.dim("Attached"),
                    J6 = SAK(O6, i.url),
                    $6 = i.activity,
                    q6 = $6 && $6.type !== "result" && $6.type !== "error" ? Y8.dim(` ${j4($6.summary,40)}`) : "";
                R(`    ${J6}${q6}
`)
            }
        }
        if (Z === 1) {
            let e = f === "single-session" ? "Single session · exits when complete" : f === "worktree" ? `Capacity: ${D}/1 · New sessions will be created in an isolated worktree` : `Capacity: ${D}/1 · New sessions will be created in the current directory`;
            R(`    ${Y8.dim(e)}
`)
        }
        if (Z === 1 && !U && P && Date.now() - W < LAK) R(`  ${Y8.dim(j4(P,60))}
`);
        let A6 = J ?? j;
        if (A6) {
            R(`
`);
            let e = U ? TF8(A6) : VF8(A6),
                i = M ? Y8.dim.italic("space to hide QR code") : Y8.dim.italic("space to show QR code"),
                O6 = G ? Y8.dim.italic(" · w to toggle spawn mode") : "";
            R(`${Y8.dim(e)}
`), R(`${i}${O6}
`)
        }
    }
    return {
        printBanner(U, g) {
            if (H = U.sessionIngressUrl, j = C48(g, H), x(j), _) K(Y8.dim("Remote Control") + ` v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}
`);
            if (_) {
                if (U.spawnMode !== "single-session") K(Y8.dim("Spawn mode: ") + `${U.spawnMode}
`), K(Y8.dim("Max concurrent sessions: ") + `${U.maxSessions}
`);
                K(Y8.dim("Environment ID: ") + `${g}
`)
            }
            if (U.sandbox) K(Y8.dim("Sandbox: ") + `${Y8.green("Enabled")}
`);
            K(`
`), m()
        },
        logSessionStart(U, g) {
            if (_) {
                let c = j4(g, 80);
                C(Y8.dim(`[${w96()}]`) + ` Session started: ${Y8.white(`"${c}"`)} (${Y8.dim(U)})
`)
            }
        },
        logSessionComplete(U, g) {
            C(Y8.dim(`[${w96()}]`) + ` Session ${Y8.green("completed")} (${C5(g)}) ${Y8.dim(U)}
`)
        },
        logSessionFailed(U, g) {
            C(Y8.dim(`[${w96()}]`) + ` Session ${Y8.red("failed")}: ${g} ${Y8.dim(U)}
`)
        },
        logStatus(U) {
            C(Y8.dim(`[${w96()}]`) + ` ${U}
`)
        },
        logVerbose(U) {
            if (_) C(Y8.dim(`[${w96()}] ${U}`) + `
`)
        },
        logError(U) {
            C(Y8.red(`[${w96()}] Error: ${U}`) + `
`)
        },
        logReconnected(U) {
            C(Y8.dim(`[${w96()}]`) + ` ${Y8.green("Reconnected")} after ${C5(U)}
`)
        },
        setRepoInfo(U, g) {
            O = U, w = g
        },
        setDebugLogPath(U) {
            $ = U
        },
        updateIdleStatus() {
            S(), Y = "idle", A = "Ready", P = null, W = 0, J = null, x(j), F()
        },
        setAttached(U) {
            if (S(), Y = "attached", A = "Connected", P = null, W = 0, Z <= 1) J = g2(U, H), x(J);
            F()
        },
        updateReconnectingStatus(U, g) {
            if (S(), h(), Y = "reconnecting", M)
                for (let n of X) R(`${Y8.dim(n)}
`);
            let c = SQ6[k % SQ6.length];
            k++, R(`${Y8.yellow(c)} ${Y8.yellow("Reconnecting")} ${Y8.dim("·")} ${Y8.dim(`retrying in ${U}`)} ${Y8.dim("·")} ${Y8.dim(`disconnected ${g}`)}
`)
        },
        updateFailedStatus(U) {
            S(), h(), Y = "failed";
            let g = "";
            if (O) g += Y8.dim(" · ") + Y8.dim(O);
            if (w) g += Y8.dim(" · ") + Y8.dim(w);
            if (R(`${Y8.red(wX8)} ${Y8.red("Remote Control Failed")}${g}
`), R(`${Y8.dim(kF8)}
`), U) R(`${Y8.red(U)}
`)
        },
        updateSessionStatus(U, g, c, n) {
            if (c.type === "tool_start") P = c.summary, W = Date.now();
            F()
        },
        clearStatus() {
            S(), h()
        },
        toggleQr() {
            M = !M, F()
        },
        updateSessionCount(U, g, c) {
            if (D === U && Z === g && f === c) return;
            D = U, Z = g, f = c
        },
        setSpawnModeDisplay(U) {
            if (G === U) return;
            if (G = U, U) f = U
        },
        addSession(U, g) {
            v.set(U, {
                url: g
            })
        },
        updateSessionActivity(U, g) {
            let c = v.get(U);
            if (!c) return;
            c.activity = g
        },
        setSessionTitle(U, g) {
            let c = v.get(U);
            if (!c) return;
            if (c.title = g, Y === "reconnecting" || Y === "failed") return;
            if (Z === 1) Y = "titled", A = j4(g, 40);
            F()
        },
        removeSession(U) {
            v.delete(U)
        },
        refreshDisplay() {
            if (Y === "reconnecting" || Y === "failed") return;
            F()
        }
    }
}
// @from(Ln 507356, Col 4)
T8A
// @from(Ln 507357, Col 4)
j15 = L(() => {
    Y3();
    lx6();
    A3();
    n5();
    K8();
    $96();
    T8A = {
        type: "utf8",
        errorCorrectionLevel: "L",
        small: !0
    }
})
// @from(Ln 507371, Col 0)
function H15(q) {
    let K = new AbortController;

    function _() {
        K.abort(), K = new AbortController
    }

    function z() {
        let Y = new AbortController,
            A = () => Y.abort();
        if (q.aborted || K.signal.aborted) return Y.abort(), {
            signal: Y.signal,
            cleanup: () => {}
        };
        q.addEventListener("abort", A, {
            once: !0
        });
        let O = K.signal;
        return O.addEventListener("abort", A, {
            once: !0
        }), {
            signal: Y.signal,
            cleanup: () => {
                q.removeEventListener("abort", A), O.removeEventListener("abort", A)
            }
        }
    }
    return {
        signal: z,
        wake: _
    }
}
// @from(Ln 507404, Col 0)
function RJ7(q) {
    if (q < 60000) return `${Math.round(q/1000)}s`;
    let K = Math.floor(q / 60000),
        _ = Math.round(q % 60000 / 1000);
    return _ > 0 ? `${K}m ${_}s` : `${K}m`
}
// @from(Ln 507411, Col 0)
function k8A(q) {
    let _ = (q.startsWith("sk-ant-si-") ? q.slice(10) : q).split(".");
    if (_.length !== 3 || !_[1]) return null;
    try {
        return n8(Buffer.from(_[1], "base64url").toString("utf8"))
    } catch {
        return null
    }
}
// @from(Ln 507421, Col 0)
function SJ7(q) {
    let K = k8A(q);
    if (K !== null && typeof K === "object" && "exp" in K && typeof K.exp === "number") return K.exp;
    return null
}
// @from(Ln 507427, Col 0)
function Ea8({
    getAccessToken: q,
    onRefresh: K,
    label: _,
    refreshBufferMs: z = N8A
}) {
    let Y = new Map,
        A = new Map,
        O = new Map;

    function w(M) {
        let P = (O.get(M) ?? 0) + 1;
        return O.set(M, P), P
    }

    function $(M, P) {
        let W = SJ7(P);
        if (!W) {
            E(`[${_}:token] Could not decode JWT expiry for sessionId=${M}, token prefix=${P.slice(0,15)}…, keeping existing timer`);
            return
        }
        let D = Y.get(M);
        if (D) clearTimeout(D);
        let Z = w(M),
            G = new Date(W * 1000).toISOString(),
            f = W * 1000 - Date.now() - z;
        if (f <= 0) {
            E(`[${_}:token] Token for sessionId=${M} expires=${G} (past or within buffer), refreshing immediately`), H(M, Z);
            return
        }
        E(`[${_}:token] Scheduled token refresh for sessionId=${M} in ${RJ7(f)} (expires=${G}, buffer=${z/1000}s)`);
        let v = setTimeout(H, f, M, Z);
        Y.set(M, v)
    }

    function j(M, P) {
        let W = Y.get(M);
        if (W) clearTimeout(W);
        let D = w(M),
            Z = Math.max(P * 1000 - z, 30000);
        E(`[${_}:token] Scheduled token refresh for sessionId=${M} in ${RJ7(Z)} (expires_in=${P}s, buffer=${z/1000}s)`);
        let G = setTimeout(H, Z, M, D);
        Y.set(M, G)
    }
    async function H(M, P) {
        let W;
        try {
            W = await q()
        } catch (Z) {
            E(`[${_}:token] getAccessToken threw for sessionId=${M}: ${b6(Z)}`, {
                level: "error"
            })
        }
        if (O.get(M) !== P) {
            E(`[${_}:token] doRefresh for sessionId=${M} stale (gen ${P} vs ${O.get(M)}), skipping`);
            return
        }
        if (!W) {
            let Z = (A.get(M) ?? 0) + 1;
            if (A.set(M, Z), E(`[${_}:token] No OAuth token available for refresh, sessionId=${M} (failure ${Z}/${X15})`, {
                    level: "error"
                }), j1("error", "bridge_token_refresh_no_oauth"), Z < X15) {
                let G = setTimeout(H, E8A, M, P);
                Y.set(M, G)
            }
            return
        }
        A.delete(M), E(`[${_}:token] Refreshing token for sessionId=${M}: new token prefix=${W.slice(0,15)}…`), d("tengu_bridge_token_refreshed", {}), K(M, W);
        let D = setTimeout(H, J15, M, P);
        Y.set(M, D), E(`[${_}:token] Scheduled follow-up refresh for sessionId=${M} in ${RJ7(J15)}`)
    }

    function J(M) {
        w(M);
        let P = Y.get(M);
        if (P) clearTimeout(P), Y.delete(M);
        A.delete(M)
    }

    function X() {
        for (let M of O.keys()) w(M);
        for (let M of Y.values()) clearTimeout(M);
        Y.clear(), A.clear()
    }
    return {
        schedule: $,
        scheduleFromExpiresIn: j,
        cancel: J,
        cancelAll: X
    }
}
// @from(Ln 507518, Col 4)
N8A = 300000
// @from(Ln 507519, Col 4)
J15 = 1800000
// @from(Ln 507520, Col 4)
X15 = 3
// @from(Ln 507521, Col 4)
E8A = 60000
// @from(Ln 507522, Col 4)
ya8 = L(() => {
    C8();
    K8();
    VA();
    m8();
    e8()
})
// @from(Ln 507529, Col 4)
Fu6
// @from(Ln 507530, Col 4)
M15 = L(() => {
    Fu6 = {
        poll_interval_ms_not_at_capacity: 2000,
        poll_interval_ms_at_capacity: 600000,
        non_exclusive_heartbeat_interval_ms: 0,
        multisession_poll_interval_ms_not_at_capacity: 2000,
        multisession_poll_interval_ms_partial_capacity: 2000,
        multisession_poll_interval_ms_at_capacity: 600000,
        reclaim_older_than_ms: 5000,
        session_keepalive_interval_v2_ms: 120000
    }
})
// @from(Ln 507543, Col 0)
function Wz6() {
    let q = XD("tengu_bridge_poll_interval_config", Fu6, 300000),
        K = y8A().safeParse(q);
    return K.success ? K.data : Fu6
}
// @from(Ln 507548, Col 4)
P15
// @from(Ln 507548, Col 9)
y8A
// @from(Ln 507549, Col 4)
CJ7 = L(() => {
    p7();
    B1();
    M15();
    P15 = {
        message: "must be 0 (disabled) or ≥100ms"
    }, y8A = C6(() => y.object({
        poll_interval_ms_not_at_capacity: y.number().int().min(100),
        poll_interval_ms_at_capacity: y.number().int().refine((q) => q === 0 || q >= 100, P15),
        non_exclusive_heartbeat_interval_ms: y.number().int().min(0).default(0),
        multisession_poll_interval_ms_not_at_capacity: y.number().int().min(100).default(Fu6.multisession_poll_interval_ms_not_at_capacity),
        multisession_poll_interval_ms_partial_capacity: y.number().int().min(100).default(Fu6.multisession_poll_interval_ms_partial_capacity),
        multisession_poll_interval_ms_at_capacity: y.number().int().refine((q) => q === 0 || q >= 100, P15).default(Fu6.multisession_poll_interval_ms_at_capacity),
        reclaim_older_than_ms: y.number().int().min(1).default(5000),
        session_keepalive_interval_v2_ms: y.number().int().min(0).default(120000)
    }).refine((q) => q.non_exclusive_heartbeat_interval_ms > 0 || q.poll_interval_ms_at_capacity > 0, {
        message: "at-capacity liveness requires non_exclusive_heartbeat_interval_ms > 0 or poll_interval_ms_at_capacity > 0"
    }).refine((q) => q.non_exclusive_heartbeat_interval_ms > 0 || q.multisession_poll_interval_ms_at_capacity > 0, {
        message: "at-capacity liveness requires non_exclusive_heartbeat_interval_ms > 0 or multisession_poll_interval_ms_at_capacity > 0"
    }))
})
// @from(Ln 507584, Col 0)
function La8(q) {
    return q.replace(/[^a-zA-Z0-9_-]/g, "_")
}
// @from(Ln 507588, Col 0)
function I8A(q, K) {
    let _ = b8A[q] ?? q,
        z = K.file_path ?? K.filePath ?? K.pattern ?? K.command?.slice(0, 60) ?? K.url ?? K.query ?? "";
    if (z) return `${_} ${z}`;
    return _
}
// @from(Ln 507595, Col 0)
function x8A(q, K, _) {
    let z;
    try {
        z = n8(q)
    } catch {
        return []
    }
    if (!z || typeof z !== "object") return [];
    let Y = z,
        A = [],
        O = Date.now();
    switch (Y.type) {
        case "assistant": {
            let w = Y.message;
            if (!w) break;
            let $ = w.content;
            if (!Array.isArray($)) break;
            for (let j of $) {
                if (!j || typeof j !== "object") continue;
                let H = j;
                if (H.type === "tool_use") {
                    let J = H.name ?? "Tool",
                        X = H.input ?? {},
                        M = I8A(J, X);
                    A.push({
                        type: "tool_start",
                        summary: M,
                        timestamp: O
                    }), _(`[bridge:activity] sessionId=${K} tool_use name=${J} ${m8A(X)}`)
                } else if (H.type === "text") {
                    let J = H.text ?? "";
                    if (J.length > 0) A.push({
                        type: "text",
                        summary: J.slice(0, 80),
                        timestamp: O
                    }), _(`[bridge:activity] sessionId=${K} text "${J.slice(0,100)}"`)
                }
            }
            break
        }
        case "result": {
            let w = Y.subtype;
            if (w === "success") A.push({
                type: "result",
                summary: "Session completed",
                timestamp: O
            }), _(`[bridge:activity] sessionId=${K} result subtype=success`);
            else if (w) {
                let j = Y.errors?.[0] ?? `Error: ${w}`;
                A.push({
                    type: "error",
                    summary: j,
                    timestamp: O
                }), _(`[bridge:activity] sessionId=${K} result subtype=${w} error="${j}"`)
            } else _(`[bridge:activity] sessionId=${K} result subtype=undefined`);
            break
        }
        default:
            break
    }
    return A
}
// @from(Ln 507658, Col 0)
function u8A(q) {
    if (q.parent_tool_use_id != null || q.isSynthetic || q.isReplay) return;
    let _ = q.message?.content,
        z;
    if (typeof _ === "string") z = _;
    else if (Array.isArray(_)) {
        for (let Y of _)
            if (Y && typeof Y === "object" && Y.type === "text") {
                z = Y.text;
                break
            }
    }
    return z = z?.trim(), z ? z : void 0
}
// @from(Ln 507673, Col 0)
function m8A(q) {
    let K = [];
    for (let [_, z] of Object.entries(q)) {
        if (typeof z === "string") K.push(`${_}="${z.slice(0,100)}"`);
        if (K.length >= 3) break
    }
    return K.join(" ")
}
// @from(Ln 507682, Col 0)
function bJ7(q) {
    return {
        spawn(K, _) {
            let z = La8(K.sessionId),
                Y;
            if (q.debugFile) {
                let Z = q.debugFile.lastIndexOf(".");
                if (Z > 0) Y = `${q.debugFile.slice(0,Z)}-${z}${q.debugFile.slice(Z)}`;
                else Y = `${q.debugFile}-${z}`
            } else if (q.verbose) Y = W15(z2(), "claude", `bridge-session-${z}.log`);
            let A = null,
                O;
            if (q.debugFile) O = W15(R8A(q.debugFile), `bridge-transcript-${z}.jsonl`), A = h8A(O, {
                flags: "a"
            }), A.on("error", (Z) => {
                q.onDebug(`[bridge:session] Transcript write error: ${Z.message}`), A = null
            }), q.onDebug(`[bridge:session] Transcript log: ${O}`);
            let w = [...q.scriptArgs, "--print", "--sdk-url", K.sdkUrl, "--session-id", K.sessionId, "--input-format", "stream-json", "--output-format", "stream-json", "--replay-user-messages", ...q.verbose ? ["--verbose"] : [], ...Y ? ["--debug-file", Y] : [], ...q.permissionMode ? ["--permission-mode", q.permissionMode] : []],
                $ = {
                    ...q.env,
                    CLAUDE_CODE_OAUTH_TOKEN: void 0,
                    CLAUDE_CODE_ENVIRONMENT_KIND: "bridge",
                    ...q.sandbox && {
                        CLAUDE_CODE_FORCE_SANDBOX: "1"
                    },
                    CLAUDE_CODE_SESSION_ACCESS_TOKEN: K.accessToken,
                    CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2: "1",
                    ...K.useCcrV2 && {
                        CLAUDE_CODE_USE_CCR_V2: "1",
                        CLAUDE_CODE_WORKER_EPOCH: String(K.workerEpoch)
                    }
                };
            if (q.onDebug(`[bridge:session] Spawning sessionId=${K.sessionId} sdkUrl=${K.sdkUrl} accessToken=${K.accessToken?"present":"MISSING"}`), q.onDebug(`[bridge:session] Child args: ${w.join(" ")}`), Y) q.onDebug(`[bridge:session] Debug log: ${Y}`);
            let j = L8A(q.execPath, w, {
                cwd: _,
                stdio: ["pipe", "pipe", "pipe"],
                env: $,
                windowsHide: !0
            });
            q.onDebug(`[bridge:session] sessionId=${K.sessionId} pid=${j.pid}`);
            let H = [],
                J = null,
                X = [],
                M = !1,
                P = !1;
            if (j.stderr) D15({
                input: j.stderr
            }).on("line", (G) => {
                if (q.verbose) process.stderr.write(G + `
`);
                if (X.length >= C8A) X.shift();
                X.push(G)
            });
            if (j.stdout) D15({
                input: j.stdout
            }).on("line", (G) => {
                if (A) A.write(G + `
`);
                if (q.onDebug(`[bridge:ws] sessionId=${K.sessionId} <<< ${ZA7(G)}`), q.verbose) process.stderr.write(G + `
`);
                let f = x8A(G, K.sessionId, q.onDebug);
                for (let v of f) {
                    if (H.length >= S8A) H.shift();
                    H.push(v), J = v, q.onActivity?.(K.sessionId, v)
                } {
                    let v;
                    try {
                        v = n8(G)
                    } catch {}
                    if (v && typeof v === "object") {
                        let V = v;
                        if (V.type === "control_request") {
                            if (V.request?.subtype === "can_use_tool" && q.onPermissionRequest) q.onPermissionRequest(K.sessionId, v, K.accessToken)
                        } else if (V.type === "user" && !P && K.onFirstUserMessage) {
                            let k = u8A(V);
                            if (k) P = !0, K.onFirstUserMessage(k)
                        }
                    }
                }
            });
            let W = new Promise((Z) => {
                    j.on("close", (G, f) => {
                        if (A) A.end(), A = null;
                        if (f === "SIGTERM" || f === "SIGINT") q.onDebug(`[bridge:session] sessionId=${K.sessionId} interrupted signal=${f} pid=${j.pid}`), Z("interrupted");
                        else if (G === 0) q.onDebug(`[bridge:session] sessionId=${K.sessionId} completed exit_code=0 pid=${j.pid}`), Z("completed");
                        else q.onDebug(`[bridge:session] sessionId=${K.sessionId} failed exit_code=${G} pid=${j.pid}`), Z("failed")
                    }), j.on("error", (G) => {
                        q.onDebug(`[bridge:session] sessionId=${K.sessionId} spawn error: ${G.message}`), Z("failed")
                    })
                }),
                D = {
                    sessionId: K.sessionId,
                    done: W,
                    activities: H,
                    accessToken: K.accessToken,
                    lastStderr: X,
                    get currentActivity() {
                        return J
                    },
                    kill() {
                        if (!j.killed)
                            if (q.onDebug(`[bridge:session] Sending SIGTERM to sessionId=${K.sessionId} pid=${j.pid}`), process.platform === "win32") j.kill();
                            else j.kill("SIGTERM")
                    },
                    forceKill() {
                        if (!M && j.pid)
                            if (M = !0, q.onDebug(`[bridge:session] Sending SIGKILL to sessionId=${K.sessionId} pid=${j.pid}`), process.platform === "win32") j.kill();
                            else j.kill("SIGKILL")
                    },
                    writeStdin(Z) {
                        if (j.stdin && !j.stdin.destroyed) q.onDebug(`[bridge:ws] sessionId=${K.sessionId} >>> ${ZA7(Z)}`), j.stdin.write(Z)
                    },
                    updateAccessToken(Z) {
                        D.accessToken = Z, D.writeStdin(I6({
                            type: "update_environment_variables",
                            variables: {
                                CLAUDE_CODE_SESSION_ACCESS_TOKEN: Z
                            }
                        }) + `
`), q.onDebug(`[bridge:session] Sent token refresh via stdin for sessionId=${K.sessionId}`)
                    }
                };
            return D
        }
    }
}
// @from(Ln 507808, Col 4)
S8A = 10
// @from(Ln 507809, Col 4)
C8A = 10
// @from(Ln 507810, Col 4)
b8A
// @from(Ln 507811, Col 4)
Z15 = L(() => {
    e8();
    cW();
    Qe();
    b8A = {
        Read: "Reading",
        Write: "Writing",
        Edit: "Editing",
        MultiEdit: "Editing",
        Bash: "Running",
        Glob: "Searching",
        Grep: "Searching",
        WebFetch: "Fetching",
        WebSearch: "Searching",
        Task: "Running task",
        FileReadTool: "Reading",
        FileWriteTool: "Writing",
        FileEditTool: "Editing",
        GlobTool: "Searching",
        GrepTool: "Searching",
        BashTool: "Running",
        NotebookEditTool: "Editing notebook",
        LSP: "LSP"
    }
})
// @from(Ln 507837, Col 0)
function f15(q) {
    let K = Buffer.from(q, "base64url").toString("utf-8"),
        _ = n8(K);
    if (!_ || typeof _ !== "object" || !("version" in _) || _.version !== 1) throw Error(`Unsupported work secret version: ${_&&typeof _==="object"&&"version"in _?_.version:"unknown"}`);
    let z = _;
    if (typeof z.session_ingress_token !== "string" || z.session_ingress_token.length === 0) throw Error("Invalid work secret: missing or empty session_ingress_token");
    if (typeof z.api_base_url !== "string") throw Error("Invalid work secret: missing api_base_url");
    return _
}
// @from(Ln 507847, Col 0)
function G15(q, K) {
    let _ = q.includes("localhost") || q.includes("127.0.0.1"),
        z = _ ? "ws" : "wss",
        Y = _ ? "v2" : "v1",
        A = q.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `${z}://${A}/${Y}/session_ingress/ws/${K}`
}
// @from(Ln 507855, Col 0)
function IJ7(q, K) {
    if (q === K) return !0;
    let _ = q.slice(q.lastIndexOf("_") + 1),
        z = K.slice(K.lastIndexOf("_") + 1);
    return _.length >= 4 && _ === z
}
// @from(Ln 507862, Col 0)
function yz8(q, K) {
    return `${q.replace(/\/+$/,"")}/v1/code/sessions/${K}`
}
// @from(Ln 507865, Col 0)
async function ha8(q, K) {
    let _ = await Z1.post(`${q}/worker/register`, {}, {
            headers: {
                Authorization: `Bearer ${K}`,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            },
            timeout: 1e4
        }),
        z = _.data?.worker_epoch,
        Y = typeof z === "string" ? Number(z) : z;
    if (typeof Y !== "number" || !Number.isFinite(Y) || !Number.isSafeInteger(Y)) throw Error(`registerWorker: invalid worker_epoch in response: ${I6(_.data)}`);
    return Y
}
// @from(Ln 507879, Col 4)
Ra8 = L(() => {
    CK();
    e8()
})
// @from(Ln 507883, Col 4)
Ca8 = {}
// @from(Ln 507904, Col 0)
function Sa8(q) {
    return d8A(uf6(), AP(q), "bridge-pointer.json")
}
// @from(Ln 507907, Col 0)
async function l8A(q, K) {
    let _ = Sa8(q);
    try {
        await B8A(Q8A(_), {
            recursive: !0
        }), await U8A(_, I6(K), "utf8"), E(`[bridge:pointer] wrote ${_}`)
    } catch (z) {
        E(`[bridge:pointer] write failed: ${z}`, {
            level: "warn"
        })
    }
}
// @from(Ln 507919, Col 0)
async function xJ7(q) {
    let K = Sa8(q),
        _, z;
    try {
        z = (await F8A(K)).mtimeMs, _ = await p8A(K, "utf8")
    } catch {
        return null
    }
    let Y = c8A().safeParse(i8A(_));
    if (!Y.success) return E(`[bridge:pointer] invalid schema, clearing: ${K}`), await uJ7(q), null;
    let A = Math.max(0, Date.now() - z);
    if (A > T15) return E(`[bridge:pointer] stale (>4h mtime), clearing: ${K}`), await uJ7(q), null;
    return {
        ...Y.data,
        ageMs: A
    }
}
// @from(Ln 507936, Col 0)
async function n8A(q) {
    let K = await xJ7(q);
    if (K) return {
        pointer: K,
        dir: q
    };
    let _ = await xf6(q);
    if (_.length <= 1) return null;
    if (_.length > v15) return E(`[bridge:pointer] ${_.length} worktrees exceeds fanout cap ${v15}, skipping`), null;
    let z = AP(q),
        Y = _.filter((w) => AP(w) !== z),
        A = await Promise.all(Y.map(async (w) => {
            let $ = await xJ7(w);
            return $ ? {
                pointer: $,
                dir: w
            } : null
        })),
        O = null;
    for (let w of A)
        if (w && (!O || w.pointer.ageMs < O.pointer.ageMs)) O = w;
    if (O) E(`[bridge:pointer] fanout found pointer in worktree ${O.dir} (ageMs=${O.pointer.ageMs})`);
    return O
}
// @from(Ln 507960, Col 0)
async function uJ7(q) {
    let K = Sa8(q);
    try {
        await g8A(K), E(`[bridge:pointer] cleared ${K}`)
    } catch (_) {
        if (!t1(_)) E(`[bridge:pointer] clear failed: ${_}`, {
            level: "warn"
        })
    }
}
// @from(Ln 507971, Col 0)
function i8A(q) {
    try {
        return n8(q)
    } catch {
        return null
    }
}
// @from(Ln 507978, Col 4)
v15 = 50
// @from(Ln 507979, Col 4)
T15 = 14400000
// @from(Ln 507980, Col 4)
c8A
// @from(Ln 507981, Col 4)
ba8 = L(() => {
    p7();
    K8();
    m8();
    zQ6();
    hm();
    e8();
    c8A = C6(() => y.object({
        sessionId: y.string(),
        environmentId: y.string(),
        source: y.enum(["standalone", "repl"])
    }))
})
// @from(Ln 507999, Col 0)
function E15() {
    return k15(TA6.errors(), N15 + ".jsonl")
}
// @from(Ln 508003, Col 0)
function mJ7(q) {
    return k15(TA6.mcpLogs(q), N15 + ".jsonl")
}
// @from(Ln 508007, Col 0)
function o8A(q) {
    let K = bD6(q);
    return {
        write(_) {
            K.write(I6(_) + `
`)
        },
        flush: K.flush,
        dispose: K.dispose
    }
}
// @from(Ln 508019, Col 0)
function BJ7(q) {
    let K = V15.get(q);
    if (!K) {
        let _ = r8A(q);
        K = o8A({
            writeFn: (z) => {
                try {
                    V8().appendFileSync(q, z)
                } catch {
                    V8().mkdirSync(_), V8().appendFileSync(q, z)
                }
            },
            flushIntervalMs: 1000,
            maxBufferSize: 50
        }), V15.set(q, K), eq(async () => K?.dispose())
    }
    return K
}
// @from(Ln 508038, Col 0)
function a8A(q, K) {
    return
}
// @from(Ln 508042, Col 0)
function s8A(q) {
    if (typeof q === "string") return q;
    if (q && typeof q === "object") {
        let K = q;
        if (typeof K.message === "string") return K.message;
        if (typeof K.error === "object" && K.error && "message" in K.error && typeof K.error.message === "string") return K.error.message
    }
    return
}
// @from(Ln 508052, Col 0)
function t8A(q) {
    let K = q.stack || q.message,
        _ = "";
    if (Z1.isAxiosError(q) && q.config?.url) {
        let z = [`url=${q.config.url}`];
        if (q.response?.status !== void 0) z.push(`status=${q.response.status}`);
        let Y = s8A(q.response?.data);
        if (Y) z.push(`body=${Y}`);
        _ = `[${z.join(",")}] `
    }
    E(`${q.name}: ${_}${K}`, {
        level: "error"
    }), a8A(E15(), {
        error: `${_}${K}`
    })
}
// @from(Ln 508069, Col 0)
function e8A(q, K) {
    E(`MCP server "${q}" ${K}`, {
        level: "error"
    });
    let _ = mJ7(q),
        Y = {
            error: K instanceof Error ? K.stack || K.message : String(K),
            timestamp: new Date().toISOString(),
            sessionId: I8(),
            cwd: V8().cwd()
        };
    BJ7(_).write(Y)
}
// @from(Ln 508083, Col 0)
function q1A(q, K) {
    E(`MCP server "${q}": ${K}`);
    let _ = mJ7(q),
        z = {
            debug: K,
            timestamp: new Date().toISOString(),
            sessionId: I8(),
            cwd: V8().cwd()
        };
    BJ7(_).write(z)
}
// @from(Ln 508095, Col 0)
function y15() {
    nu7({
        logError: t8A,
        logMCPError: e8A,
        logMCPDebug: q1A,
        getErrorsPath: E15,
        getMCPLogsPath: mJ7
    }), E("Error log sink initialized")
}
// @from(Ln 508104, Col 4)
N15
// @from(Ln 508104, Col 9)
V15
// @from(Ln 508105, Col 4)
L15 = L(() => {
    CK();
    y8();
    sH8();
    R9();
    K8();
    Yq();
    U8();
    e8();
    N15 = lu7(new Date);
    V15 = new Map
})
// @from(Ln 508117, Col 4)
Ia8 = {}
// @from(Ln 508122, Col 0)
function pJ7() {
    y15(), ak6()
}
// @from(Ln 508125, Col 4)
Lz8 = L(() => {
    Ka6();
    L15()
})
// @from(Ln 508129, Col 4)
dJ7 = {}
// @from(Ln 508150, Col 0)
async function C15() {
    return gv("tengu_ccr_bridge_multi_session")
}
// @from(Ln 508154, Col 0)
function h15(q) {
    return q.connCapMs * 2
}
// @from(Ln 508158, Col 0)
function b15() {
    if (v$() || !process.argv[1]) return [];
    return [process.argv[1]]
}
// @from(Ln 508163, Col 0)
function A1A(q, K, _) {
    try {
        return q.spawn(K, _)
    } catch (z) {
        let Y = b6(z);
        return j6(Error(`Session spawn failed: ${Y}`)), Y
    }
}
// @from(Ln 508171, Col 0)
async function QJ7(q, K, _, z, Y, A, O, w = z1A, $, j) {
    let H = new AbortController;
    if (O.aborted) H.abort();
    else O.addEventListener("abort", () => H.abort(), {
        once: !0
    });
    let J = H.signal,
        X = new Map,
        M = new Map,
        P = new Map,
        W = new Map,
        D = new Map,
        Z = new Set,
        G = new Map,
        f = new Set,
        v = new Set,
        V = H15(J);
    async function k() {
        let $6 = !1,
            H6 = !1,
            q6 = [];
        for (let [o] of X) {
            let _6 = P.get(o),
                r = D.get(o);
            if (!_6 || !r) continue;
            try {
                await z.heartbeatWork(K, _6, r), $6 = !0
            } catch (t) {
                if (E(`[bridge:heartbeat] Failed for sessionId=${o} workId=${_6}: ${b6(t)}`), t instanceof Cu)
                    if (d("tengu_bridge_heartbeat_error", {
                            status: t.status,
                            error_type: t.status === 401 || t.status === 403 ? "auth_failed" : "fatal"
                        }), t.status === 401 || t.status === 403) q6.push(o);
                    else H6 = !0
            }
        }
        for (let o of q6) {
            A.logVerbose(`Session ${o} token expired — re-queuing via bridge/reconnect`);
            try {
                await z.reconnectSession(K, o), E(`[bridge:heartbeat] Re-queued sessionId=${o} via bridge/reconnect`)
            } catch (_6) {
                A.logError(`Failed to refresh session ${o} token: ${b6(_6)}`), E(`[bridge:heartbeat] reconnectSession(${o}) failed: ${b6(_6)}`, {
                    level: "error"
                })
            }
        }
        if (H6) return "fatal";
        if (q6.length > 0) return "auth_failed";
        return $6 ? "ok" : "failed"
    }
    let N = new Set,
        R = j ? Ea8({
            getAccessToken: j,
            onRefresh: ($6, H6) => {
                let q6 = X.get($6);
                if (!q6) return;
                if (N.has($6)) A.logVerbose(`Refreshing session ${$6} token via bridge/reconnect`), z.reconnectSession(K, $6).catch((o) => {
                    A.logError(`Failed to refresh session ${$6} token: ${b6(o)}`), E(`[bridge:token] reconnectSession(${$6}) failed: ${b6(o)}`, {
                        level: "error"
                    })
                });
                else q6.updateAccessToken(H6)
            },
            label: "bridge"
        }) : null,
        h = Date.now(),
        C = new Set;

    function x($6) {
        C.add($6), $6.finally(() => C.delete($6))
    }
    let B = 0,
        m = 0,
        S = null,
        F = null,
        U = null,
        g = null,
        c = !1;
    if (E(`[bridge:work] Starting poll loop spawnMode=${q.spawnMode} maxSessions=${q.maxSessions} environmentId=${K}`), j1("info", "bridge_loop_started", {
            max_sessions: q.maxSessions,
            spawn_mode: q.spawnMode
        }), A.printBanner(q, K), A.updateSessionCount(0, q.maxSessions, q.spawnMode), $) A.setAttached($);

    function n() {
        A.updateSessionCount(X.size, q.maxSessions, q.spawnMode);
        for (let [t, Y6] of X) {
            let X6 = Y6.currentActivity;
            if (X6) A.updateSessionActivity(W.get(t) ?? t, X6)
        }
        if (X.size === 0) {
            A.updateIdleStatus();
            return
        }
        let [$6, H6] = [...X.entries()].pop(), q6 = M.get($6);
        if (!q6) return;
        let o = H6.currentActivity;
        if (!o || o.type === "result" || o.type === "error") {
            if (q.maxSessions > 1) A.refreshDisplay();
            return
        }
        let _6 = C5(Date.now() - q6),
            r = H6.activities.filter((t) => t.type === "tool_start").slice(-5).map((t) => t.summary);
        A.updateSessionStatus($6, _6, o, r)
    }

    function l() {
        z6(), n(), g = setInterval(n, Y1A)
    }

    function z6() {
        if (g) clearInterval(g), g = null
    }

    function A6($6, H6, q6) {
        return (o) => {
            let _6 = P.get($6);
            X.delete($6), M.delete($6), P.delete($6), D.delete($6);
            let r = W.get($6) ?? $6;
            W.delete($6), A.removeSession(r), v.delete(r), N.delete($6), R?.cancel($6), V.wake();
            let t = Date.now() - H6;
            E(`[bridge:session] sessionId=${$6} workId=${_6??"unknown"} exited status=${o} duration=${C5(t)}`), d("tengu_bridge_session_done", {
                status: o,
                duration_ms: t
            }), j1("info", "bridge_session_done", {
                status: o,
                duration_ms: t
            }), A.clearStatus(), z6();
            let Y6 = q6.lastStderr.length > 0 ? q6.lastStderr.join(`
`) : void 0,
                X6;
            switch (o) {
                case "completed":
                    A.logSessionComplete($6, t);
                    break;
                case "failed":
                    if (!J.aborted) X6 = Y6 ?? "Process exited with error", A.logSessionFailed($6, X6), j6(Error(`Bridge session failed: ${X6}`));
                    break;
                case "interrupted":
                    A.logVerbose(`Session ${$6} interrupted`);
                    break
            }
            if (o !== "interrupted" && _6) x(hz8(z, K, _6, A, w.stopWorkBaseDelayMs)), Z.add(_6);
            let M6 = o === "failed" && !J.aborted && !c;
            if (M6) f.add($6);
            let W6 = G.get($6);
            if (W6)
                if (G.delete($6), M6) A.logStatus(`kept worktree ${W6.worktreePath} · session crashed`);
                else x(FJ7(W6, A));
            if (o !== "interrupted" && !J.aborted)
                if (q.spawnMode !== "single-session") {
                    if (o === "completed") x(z.archiveSession(r).catch((V6) => A.logVerbose(`Failed to archive session ${$6}: ${b6(V6)}`)));
                    E(`[bridge:session] Session ${o}, returning to idle (multi-session mode)`)
                } else {
                    E(`[bridge:session] Session ${o}, aborting poll loop to tear down environment`), H.abort();
                    return
                } if (!J.aborted) l()
        }
    }
    if (!$) l();
    while (!J.aborted) {
        let $6 = Wz6();
        try {
            let H6 = await z.pollForWork(K, _, J, $6.reclaim_older_than_ms);
            if (S !== null || F !== null) {
                let Y6 = Date.now() - (S ?? F ?? Date.now());
                A.logReconnected(Y6), E(`[bridge:poll] Reconnected after ${C5(Y6)}`), d("tengu_bridge_reconnected", {
                    disconnected_ms: Y6
                })
            }
            if (B = 0, m = 0, S = null, F = null, U = null, !H6) {
                if (X.size >= q.maxSessions) {
                    let X6 = $6.multisession_poll_interval_ms_at_capacity;
                    if ($6.non_exclusive_heartbeat_interval_ms > 0) {
                        d("tengu_bridge_heartbeat_mode_entered", {
                            active_sessions: X.size,
                            heartbeat_interval_ms: $6.non_exclusive_heartbeat_interval_ms
                        });
                        let M6 = X6 > 0 ? Date.now() + X6 : null,
                            W6 = "ok",
                            V6 = 0;
                        while (!J.aborted && X.size >= q.maxSessions && (M6 === null || Date.now() < M6)) {
                            let G6 = Wz6();
                            if (G6.non_exclusive_heartbeat_interval_ms <= 0) break;
                            let k6 = V.signal();
                            if (W6 = await k(), W6 === "auth_failed" || W6 === "fatal") {
                                k6.cleanup();
                                break
                            }
                            V6++, await l7(G6.non_exclusive_heartbeat_interval_ms, k6.signal), k6.cleanup()
                        }
                        let f6 = W6 === "auth_failed" || W6 === "fatal" ? W6 : J.aborted ? "shutdown" : X.size < q.maxSessions ? "capacity_changed" : M6 !== null && Date.now() >= M6 ? "poll_due" : "config_disabled";
                        if (d("tengu_bridge_heartbeat_mode_exited", {
                                reason: f6,
                                heartbeat_cycles: V6,
                                active_sessions: X.size
                            }), f6 === "poll_due") E(`[bridge:poll] Heartbeat poll_due after ${V6} cycles — falling through to pollForWork`);
                        if (W6 === "auth_failed" || W6 === "fatal") {
                            let G6 = V.signal();
                            await l7(X6 > 0 ? X6 : $6.non_exclusive_heartbeat_interval_ms, G6.signal), G6.cleanup()
                        }
                    } else if (X6 > 0) {
                        let M6 = V.signal();
                        await l7(X6, M6.signal), M6.cleanup()
                    }
                } else {
                    let X6 = X.size > 0 ? $6.multisession_poll_interval_ms_partial_capacity : $6.multisession_poll_interval_ms_not_at_capacity;
                    await l7(X6, J)
                }
                continue
            }
            let o = X.size >= q.maxSessions;
            if (Z.has(H6.id)) {
                if (E(`[bridge:work] Skipping already-completed workId=${H6.id}`), o) {
                    let Y6 = V.signal();
                    if ($6.non_exclusive_heartbeat_interval_ms > 0) await k(), await l7($6.non_exclusive_heartbeat_interval_ms, Y6.signal);
                    else if ($6.multisession_poll_interval_ms_at_capacity > 0) await l7($6.multisession_poll_interval_ms_at_capacity, Y6.signal);
                    Y6.cleanup()
                } else await l7(1000, J);
                continue
            }
            let _6;
            try {
                _6 = f15(H6.secret)
            } catch (Y6) {
                let X6 = b6(Y6);
                if (A.logError(`Failed to decode work secret for workId=${H6.id}: ${X6}`), d("tengu_bridge_work_secret_failed", {}), Z.add(H6.id), x(hz8(z, K, H6.id, A, w.stopWorkBaseDelayMs)), o) {
                    let M6 = V.signal();
                    if ($6.non_exclusive_heartbeat_interval_ms > 0) await k(), await l7($6.non_exclusive_heartbeat_interval_ms, M6.signal);
                    else if ($6.multisession_poll_interval_ms_at_capacity > 0) await l7($6.multisession_poll_interval_ms_at_capacity, M6.signal);
                    M6.cleanup()
                }
                continue
            }
            let r = async () => {
                E(`[bridge:work] Acknowledging workId=${H6.id}`);
                try {
                    await z.acknowledgeWork(K, H6.id, _6.session_ingress_token)
                } catch (Y6) {
                    E(`[bridge:work] Acknowledge failed workId=${H6.id}: ${b6(Y6)}`)
                }
            }, t = H6.data.type;
            switch (H6.data.type) {
                case "healthcheck":
                    await r(), E("[bridge:work] Healthcheck received"), A.logVerbose("Healthcheck received");
                    break;
                case "session": {
                    let Y6 = H6.data.id;
                    try {
                        ZL(Y6, "session_id")
                    } catch {
                        await r(), A.logError(`Invalid session_id received: ${Y6}`);
                        break
                    }
                    let X6 = X.get(Y6);
                    if (X6) {
                        X6.updateAccessToken(_6.session_ingress_token), D.set(Y6, _6.session_ingress_token), P.set(Y6, H6.id), R?.schedule(Y6, _6.session_ingress_token), E(`[bridge:work] Updated access token for existing sessionId=${Y6} workId=${H6.id}`), await r();
                        break
                    }
                    if (X.size >= q.maxSessions) {
                        E(`[bridge:work] At capacity (${X.size}/${q.maxSessions}), cannot spawn new session for workId=${H6.id}`);
                        break
                    }
                    await r();
                    let M6 = Date.now(),
                        W6, V6 = !1,
                        f6;
                    if (_6.use_code_sessions === !0 || S6(process.env.CLAUDE_BRIDGE_USE_CCR_V2)) {
                        W6 = yz8(q.apiBaseUrl, Y6);
                        for (let p6 = 1; p6 <= 2; p6++) try {
                            f6 = await ha8(W6, _6.session_ingress_token), V6 = !0, E(`[bridge:session] CCR v2: registered worker sessionId=${Y6} epoch=${f6} attempt=${p6}`);
                            break
                        } catch (q8) {
                            let L8 = b6(q8);
                            if (p6 < 2) {
                                if (E(`[bridge:session] CCR v2: registerWorker attempt ${p6} failed, retrying: ${L8}`), await l7(2000, J), J.aborted) break;
                                continue
                            }
                            A.logError(`CCR v2 worker registration failed for session ${Y6}: ${L8}`), j6(Error(`registerWorker failed: ${L8}`)), Z.add(H6.id), x(hz8(z, K, H6.id, A, w.stopWorkBaseDelayMs))
                        }
                        if (!V6) break
                    } else W6 = G15(q.sessionIngressUrl, Y6);
                    let {
                        spawnMode: G6,
                        dir: k6
                    } = q, T6 = 0;
                    if (G6 === "worktree" && ($ === void 0 || !IJ7(Y6, $))) {
                        let p6 = Date.now();
                        try {
                            let q8 = await cK8(`bridge-${La8(Y6)}`);
                            T6 = Date.now() - p6, G.set(Y6, {
                                worktreePath: q8.worktreePath,
                                worktreeBranch: q8.worktreeBranch,
                                gitRoot: q8.gitRoot,
                                hookBased: q8.hookBased,
                                headCommit: q8.headCommit
                            }), k6 = q8.worktreePath, E(`[bridge:session] Created worktree for sessionId=${Y6} at ${q8.worktreePath}`)
                        } catch (q8) {
                            let L8 = b6(q8);
                            A.logError(`Failed to create worktree for session ${Y6}: ${L8}`), j6(Error(`Worktree creation failed: ${L8}`)), Z.add(H6.id), x(hz8(z, K, H6.id, A, w.stopWorkBaseDelayMs));
                            break
                        }
                    }
                    E(`[bridge:session] Spawning sessionId=${Y6} sdkUrl=${W6}`);
                    let v6 = ER(Y6),
                        L6 = A1A(Y, {
                            sessionId: Y6,
                            sdkUrl: W6,
                            accessToken: _6.session_ingress_token,
                            useCcrV2: V6,
                            workerEpoch: f6,
                            onFirstUserMessage: (p6) => {
                                if (v.has(v6)) return;
                                v.add(v6);
                                let q8 = X1A(p6);
                                A.setSessionTitle(v6, q8), E(`[bridge:title] derived title for ${v6}: ${q8}`), Promise.resolve().then(() => (rP6(), ax6)).then(({
                                    updateBridgeSessionTitle: L8
                                }) => L8(v6, q8, {
                                    baseUrl: q.apiBaseUrl
                                })).catch((L8) => E(`[bridge:title] failed to update title for ${v6}: ${L8}`, {
                                    level: "error"
                                }))
                            }
                        }, k6);
                    if (typeof L6 === "string") {
                        A.logError(`Failed to spawn session ${Y6}: ${L6}`);
                        let p6 = G.get(Y6);
                        if (p6) G.delete(Y6), x(FJ7(p6, A, {
                            force: !0
                        }));
                        Z.add(H6.id), x(hz8(z, K, H6.id, A, w.stopWorkBaseDelayMs));
                        break
                    }
                    let y6 = L6,
                        c6 = Date.now() - M6;
                    d("tengu_bridge_session_started", {
                        active_sessions: X.size,
                        spawn_mode: G6,
                        in_worktree: G.has(Y6),
                        spawn_duration_ms: c6,
                        worktree_create_ms: T6,
                        inProtectedNamespace: kC(),
                        ...pu6()
                    }), j1("info", "bridge_session_started", {
                        spawn_mode: G6,
                        in_worktree: G.has(Y6),
                        spawn_duration_ms: c6,
                        worktree_create_ms: T6
                    }), X.set(Y6, y6), P.set(Y6, H6.id), D.set(Y6, _6.session_ingress_token), W.set(Y6, v6);
                    let Z8 = Date.now();
                    M.set(Y6, Z8), A.logSessionStart(Y6, `Session ${Y6}`);
                    let N8 = La8(Y6),
                        R6;
                    if (q.debugFile) {
                        let p6 = q.debugFile.lastIndexOf(".");
                        if (p6 > 0) R6 = `${q.debugFile.slice(0,p6)}-${N8}${q.debugFile.slice(p6)}`;
                        else R6 = `${q.debugFile}-${N8}`
                    } else if (q.verbose) R6 = _1A(z2(), "claude", `bridge-session-${N8}.log`);
                    if (R6) A.logVerbose(`Debug log: ${R6}`);
                    if (A.addSession(v6, g2(v6, q.sessionIngressUrl)), l(), A.setAttached(v6), M1A(v6, q.apiBaseUrl).then((p6) => {
                            if (p6 && X.has(Y6)) v.add(v6), A.setSessionTitle(v6, p6), E(`[bridge:title] server title for ${v6}: ${p6}`)
                        }).catch((p6) => E(`[bridge:title] failed to fetch title for ${v6}: ${p6}`, {
                            level: "error"
                        })), V6) N.add(Y6);
                    R?.schedule(Y6, _6.session_ingress_token), y6.done.then(A6(Y6, Z8, y6));
                    break
                }
                default:
                    await r(), E(`[bridge:work] Unknown work type: ${t}, skipping`);
                    break
            }
            if (o) {
                let Y6 = V.signal();
                if ($6.non_exclusive_heartbeat_interval_ms > 0) await k(), await l7($6.non_exclusive_heartbeat_interval_ms, Y6.signal);
                else if ($6.multisession_poll_interval_ms_at_capacity > 0) await l7($6.multisession_poll_interval_ms_at_capacity, Y6.signal);
                Y6.cleanup()
            }
        } catch (H6) {
            if (J.aborted) break;
            if (H6 instanceof Cu) {
                if (c = !0, ko8(H6.errorType)) A.logStatus(H6.message);
                else if (yj7(H6)) E(`[bridge:work] Suppressed 403 error: ${H6.message}`);
                else A.logError(H6.message), j6(H6);
                d("tengu_bridge_fatal_error", {
                    status: H6.status,
                    error_type: H6.errorType
                }), j1(ko8(H6.errorType) ? "info" : "error", "bridge_fatal_error", {
                    status: H6.status,
                    error_type: H6.errorType
                });
                break
            }
            let q6 = GbK(H6);
            if (I15(H6) || x15(H6)) {
                let o = Date.now();
                if (U !== null && o - U > h15(w)) E(`[bridge:work] Detected system sleep (${Math.round((o-U)/1000)}s gap), resetting error budget`), j1("info", "bridge_poll_sleep_detected", {
                    gapMs: o - U
                }), S = null, B = 0, F = null, m = 0;
                if (U = o, !S) S = o;
                let _6 = o - S;
                if (_6 >= w.connGiveUpMs) {
                    A.logError(`Server unreachable for ${Math.round(_6/60000)} minutes, giving up.`), d("tengu_bridge_poll_give_up", {
                        error_type: "connection",
                        elapsed_ms: _6
                    }), j1("error", "bridge_poll_give_up", {
                        error_type: "connection",
                        elapsed_ms: _6
                    }), c = !0;
                    break
                }
                F = null, m = 0, B = B ? Math.min(B * 2, w.connCapMs) : w.connInitialMs;
                let r = UJ7(B);
                if (A.logVerbose(`Connection error, retrying in ${Rz8(r)} (${Math.round(_6/1000)}s elapsed): ${q6}`), A.updateReconnectingStatus(Rz8(r), C5(_6)), Wz6().non_exclusive_heartbeat_interval_ms > 0) await k();
                await l7(r, J)
            } else {
                let o = Date.now();
                if (U !== null && o - U > h15(w)) E(`[bridge:work] Detected system sleep (${Math.round((o-U)/1000)}s gap), resetting error budget`), j1("info", "bridge_poll_sleep_detected", {
                    gapMs: o - U
                }), S = null, B = 0, F = null, m = 0;
                if (U = o, !F) F = o;
                let _6 = o - F;
                if (_6 >= w.generalGiveUpMs) {
                    A.logError(`Persistent errors for ${Math.round(_6/60000)} minutes, giving up.`), d("tengu_bridge_poll_give_up", {
                        error_type: "general",
                        elapsed_ms: _6
                    }), j1("error", "bridge_poll_give_up", {
                        error_type: "general",
                        elapsed_ms: _6
                    }), c = !0;
                    break
                }
                S = null, B = 0, m = m ? Math.min(m * 2, w.generalCapMs) : w.generalInitialMs;
                let r = UJ7(m);
                if (A.logVerbose(`Poll failed, retrying in ${Rz8(r)} (${Math.round(_6/1000)}s elapsed): ${q6}`), A.updateReconnectingStatus(Rz8(r), C5(_6)), Wz6().non_exclusive_heartbeat_interval_ms > 0) await k();
                await l7(r, J)
            }
        }
    }
    z6(), A.clearStatus();
    let e = Date.now() - h;
    d("tengu_bridge_shutdown", {
        active_sessions: X.size,
        loop_duration_ms: e
    }), j1("info", "bridge_shutdown", {
        active_sessions: X.size,
        loop_duration_ms: e
    });
    let i = new Set(X.keys());
    if ($ && ![...f].some(($6) => IJ7($6, $))) i.add($);
    let O6 = new Map(W);
    if (X.size > 0) {
        E(`[bridge:shutdown] Shutting down ${X.size} active session(s)`), A.logStatus(`Shutting down ${X.size} active session(s)…`);
        let $6 = new Map(P);
        for (let [q6, o] of X.entries()) E(`[bridge:shutdown] Sending SIGTERM to sessionId=${q6}`), o.kill();
        let H6 = new AbortController;
        await Promise.race([Promise.allSettled([...X.values()].map((q6) => q6.done)), l7(w.shutdownGraceMs ?? 30000, H6.signal)]), H6.abort();
        for (let [q6, o] of X.entries()) E(`[bridge:shutdown] Force-killing stuck sessionId=${q6}`), o.forceKill();
        if (R?.cancelAll(), G.size > 0) {
            let q6 = [...G.values()];
            G.clear(), E(`[bridge:shutdown] Cleaning up ${q6.length} worktree(s)`), await Promise.allSettled(q6.map((o) => FJ7(o, A)))
        }
        await Promise.allSettled([...$6.entries()].map(([q6, o]) => {
            return z.stopWork(K, o, !0).catch((_6) => A.logVerbose(`Failed to stop work ${o} for session ${q6}: ${b6(_6)}`))
        }))
    }
    if (C.size > 0) await Promise.allSettled([...C]);
    if (i.size > 0) E(`[bridge:shutdown] Archiving ${i.size} session(s)`), await Promise.allSettled([...i].map(($6) => z.archiveSession(O6.get($6) ?? ER($6)).catch((H6) => A.logVerbose(`Failed to archive session ${$6}: ${b6(H6)}`))));
    try {
        await z.deregisterEnvironment(K), E("[bridge:shutdown] Environment deregistered, bridge offline"), A.logVerbose("Environment deregistered.")
    } catch ($6) {
        A.logVerbose(`Failed to deregister environment: ${b6($6)}`)
    }
    let {
        clearBridgePointer: J6
    } = await Promise.resolve().then(() => (ba8(), Ca8));
    await J6(q.dir), A.logVerbose("Environment offline.")
}
// @from(Ln 508648, Col 0)
function I15(q) {
    if (q && typeof q === "object" && "code" in q && typeof q.code === "string" && O1A.has(q.code)) return !0;
    return !1
}
// @from(Ln 508653, Col 0)
function x15(q) {
    return !!q && typeof q === "object" && "code" in q && typeof q.code === "string" && q.code === "ERR_BAD_RESPONSE"
}
// @from(Ln 508657, Col 0)
function UJ7(q) {
    return Math.max(0, q + q * 0.25 * (2 * Math.random() - 1))
}
// @from(Ln 508661, Col 0)
function Rz8(q) {
    return q >= 1000 ? `${(q/1000).toFixed(1)}s` : `${Math.round(q)}ms`
}
// @from(Ln 508664, Col 0)
async function hz8(q, K, _, z, Y = 1000) {
    for (let O = 1; O <= 3; O++) try {
        await q.stopWork(K, _, !1), E(`[bridge:work] stopWork succeeded for workId=${_} on attempt ${O}/3`);
        return
    } catch (w) {
        if (w instanceof Cu) {
            if (yj7(w)) E(`[bridge:work] Suppressed stopWork 403 for ${_}: ${w.message}`);
            else z.logError(`Failed to stop work ${_}: ${w.message}`);
            j1("error", "bridge_stop_work_failed", {
                attempts: O,
                fatal: !0
            });
            return
        }
        let $ = b6(w);
        if (O < 3) {
            let j = UJ7(Y * Math.pow(2, O - 1));
            z.logVerbose(`Failed to stop work ${_} (attempt ${O}/3), retrying in ${Rz8(j)}: ${$}`), await l7(j)
        } else z.logError(`Failed to stop work ${_} after 3 attempts: ${$}`), j1("error", "bridge_stop_work_failed", {
            attempts: 3
        })
    }
}
// @from(Ln 508687, Col 0)
async function FJ7(q, K, _) {
    let z = _?.force || q.hookBased && q.headCommit === void 0,
        {
            dirty: Y,
            commitsAhead: A,
            gitError: O
        } = z ? {
            dirty: !1,
            commitsAhead: 0,
            gitError: !1
        } : await Ta8(q.worktreePath, q.headCommit);
    if (Y || A > 0) {
        let $ = `${A} ${O7(A,"commit")}`,
            j = O ? "git error checking changes" : Y && A > 0 ? `uncommitted changes · ${$}` : Y ? "uncommitted changes" : $;
        K.logStatus(`kept worktree ${q.worktreePath} · ${j}`), E(`[bridge:worktree] kept ${q.worktreePath} dirty=${Y} commitsAhead=${A} gitError=${!!O}`);
        return
    }
    if (await AM6(q.worktreePath, q.worktreeBranch, q.gitRoot, q.hookBased, "bridge")) K.logStatus(`removed worktree ${q.worktreePath}`);
    else K.logStatus(`worktree removal failed, kept: ${q.worktreePath}`)
}
// @from(Ln 508708, Col 0)
function $1A(q) {
    if (q === "session") return "single-session";
    if (q === "same-dir") return "same-dir";
    if (q === "worktree") return "worktree";
    return `--spawn requires one of: ${w1A.join(", ")} (got: ${q??"<missing>"})`
}
// @from(Ln 508715, Col 0)
function j1A(q) {
    let K = q === void 0 ? NaN : parseInt(q, 10);
    if (isNaN(K) || K < 1) return `--capacity requires a positive integer (got: ${q??"<missing>"})`;
    return K
}
// @from(Ln 508721, Col 0)
function u15(q) {
    let K = !1,
        _ = !1,
        z, Y, A, O, w = !1,
        $, j, H, J, X = !1;
    for (let P = 0; P < q.length; P++) {
        let W = q[P];
        if (W === "--help" || W === "-h") w = !0;
        else if (W === "--verbose" || W === "-v") K = !0;
        else if (W === "--sandbox") _ = !0;
        else if (W === "--no-sandbox") _ = !1;
        else if (W === "--debug-file" && P + 1 < q.length) z = gJ7(q[++P]);
        else if (W.startsWith("--debug-file=")) z = gJ7(W.slice(13));
        else if (W === "--permission-mode" && P + 1 < q.length) Y = q[++P];
        else if (W.startsWith("--permission-mode=")) Y = W.slice(18);
        else if (W === "--name" && P + 1 < q.length) A = q[++P];
        else if (W.startsWith("--name=")) A = W.slice(7);
        else if (W === "--remote-control-session-name-prefix" && P + 1 < q.length) O = q[++P];
        else if (W.startsWith("--remote-control-session-name-prefix=")) O = W.slice(37);
        else if (W === "--spawn" || W.startsWith("--spawn=")) {
            if ($ !== void 0) return M("--spawn may only be specified once");
            let D = W.startsWith("--spawn=") ? W.slice(8) : q[++P],
                Z = $1A(D);
            if (Z === "single-session" || Z === "same-dir" || Z === "worktree") $ = Z;
            else return M(Z)
        } else if (W === "--capacity" || W.startsWith("--capacity=")) {
            if (j !== void 0) return M("--capacity may only be specified once");
            let D = W.startsWith("--capacity=") ? W.slice(11) : q[++P],
                Z = j1A(D);
            if (typeof Z === "number") j = Z;
            else return M(Z)
        } else if (W === "--create-session-in-dir") H = !0;
        else if (W === "--no-create-session-in-dir") H = !1;
        else return M(`Unknown argument: ${W}
Run 'claude remote-control --help' for usage.`)
    }
    if ($ === "single-session" && j !== void 0) return M("--capacity cannot be used with --spawn=session (single-session mode has fixed capacity 1).");
    if ((J || X) && ($ !== void 0 || j !== void 0 || H !== void 0)) return M("--session-id and --continue cannot be used with --spawn, --capacity, or --create-session-in-dir.");
    if (J && X) return M("--session-id and --continue cannot be used together.");
    return {
        verbose: K,
        sandbox: _,
        debugFile: z,
        permissionMode: Y,
        name: A,
        sessionNamePrefix: O,
        spawnMode: $,
        capacity: j,
        createSessionInDir: H,
        sessionId: J,
        continueSession: X,
        help: w
    };

    function M(P) {
        return {
            verbose: K,
            sandbox: _,
            debugFile: z,
            permissionMode: Y,
            name: A,
            sessionNamePrefix: O,
            spawnMode: $,
            capacity: j,
            createSessionInDir: H,
            sessionId: J,
            continueSession: X,
            help: w,
            error: P
        }
    }
}
// @from(Ln 508793, Col 0)
async function H1A() {
    let {
        EXTERNAL_PERMISSION_MODES: q
    } = await Promise.resolve().then(() => (qG6(), AO1)), K = q.join(", "), _ = await C15(), z = _ ? `  --spawn <mode>                   Spawn mode: same-dir, worktree, session
                                   (default: same-dir)
  --capacity <N>                   Max concurrent sessions in worktree or
                                   same-dir mode (default: ${S15})
  --[no-]create-session-in-dir     Pre-create a session in the current
                                   directory; in worktree mode this session
                                   stays in cwd while on-demand sessions get
                                   isolated worktrees (default: on)
` : "", O = `
Remote Control - Connect your local environment to claude.ai/code

USAGE
  claude remote-control [options]
OPTIONS
  --name <name>                    Name for the session (shown in claude.ai/code)
  --remote-control-session-name-prefix <prefix>
                                   Prefix for auto-generated session names
                                   (default: hostname; env:
                                   CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX)
  --permission-mode <mode>         Permission mode for spawned sessions
                                   (${K})
  --debug-file <path>              Write debug logs to file
  -v, --verbose                    Enable verbose output
  -h, --help                       Show this help
${z}
DESCRIPTION
  Remote Control allows you to control sessions on your local device from
  claude.ai/code (https://claude.ai/code). Run this command in the
  directory you want to work in, then connect from the Claude app or web.
${_?`
  Remote Control runs as a persistent server that accepts multiple concurrent
  sessions in the current directory. One session is pre-created on start so
  you have somewhere to type immediately. Use --spawn=worktree to isolate
  each on-demand session in its own git worktree, or --spawn=session for
  the classic single-session mode (exits when that session ends). Press 'w'
  during runtime to toggle between same-dir and worktree.
`:""}
NOTES
  - You must be logged in with a Claude account that has a subscription
  - Run \`claude\` first in the directory to accept the workspace trust dialog
${_?`  - Worktree mode requires a git repository or WorktreeCreate/WorktreeRemove hooks
`:""}`;
    console.log(O)
}
// @from(Ln 508841, Col 0)
function X1A(q) {
    let K = q.replace(/\s+/g, " ").trim();
    return j4(K, J1A)
}
// @from(Ln 508845, Col 0)
async function M1A(q, K) {
    let {
        getBridgeSession: _
    } = await Promise.resolve().then(() => (rP6(), ax6));
    return (await _(q, {
        baseUrl: K
    }))?.title || void 0
}
// @from(Ln 508853, Col 0)
async function P1A(q) {
    let K = u15(q);
    if (K.help) {
        await H1A();
        return
    }
    if (K.error) console.error(`Error: ${K.error}`), process.exit(1);
    let {
        verbose: _,
        sandbox: z,
        debugFile: Y,
        permissionMode: A,
        name: O,
        sessionNamePrefix: w,
        spawnMode: $,
        capacity: j,
        createSessionInDir: H,
        sessionId: J,
        continueSession: X
    } = K;
    if (w) process.env.CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX = w;
    let M = J,
        P, W = $ !== void 0 || j !== void 0 || H !== void 0;
    if (A !== void 0) {
        let {
            PERMISSION_MODES: w8
        } = await Promise.resolve().then(() => (qG6(), AO1)), x8 = w8;
        if (!x8.includes(A)) console.error(`Error: Invalid permission mode '${A}'. Valid modes: ${x8.join(", ")}`), process.exit(1)
    }
    let D = gJ7("."),
        {
            enableConfigs: Z,
            checkHasTrustDialogAccepted: G
        } = await Promise.resolve().then(() => (h1(), P46));
    Z();
    let {
        initSinks: f
    } = await Promise.resolve().then(() => (Lz8(), Ia8));
    f();
    let v = await C15();
    if (W && !v) await af7("tengu_bridge_multi_session_denied", {
        used_spawn: $ !== void 0,
        used_capacity: j !== void 0,
        used_create_session_in_dir: H !== void 0
    }), await Promise.race([Promise.all([ka(), Ra()]), l7(500, void 0, {
        unref: !0
    })]).catch(() => {}), console.error("Error: Multi-session Remote Control is not enabled for your account yet."), process.exit(1);
    let {
        setOriginalCwd: V,
        setCwdState: k
    } = await Promise.resolve().then(() => (y8(), CD6));
    if (V(D), k(D), !G()) console.error(`Error: Workspace not trusted. Please run \`claude\` in ${D} first to review and accept the workspace trust dialog.`), process.exit(1);
    let {
        clearOAuthTokenCache: N,
        checkAndRefreshOAuthTokenIfNeeded: R
    } = await Promise.resolve().then(() => (T7(), zR)), {
        getBridgeAccessToken: h,
        getBridgeBaseUrl: C
    } = await Promise.resolve().then(() => (qn(), g57));
    if (!h()) console.error(mr8), process.exit(1);
    let {
        getGlobalConfig: B,
        saveGlobalConfig: m,
        getCurrentProjectConfig: S,
        saveCurrentProjectConfig: F
    } = await Promise.resolve().then(() => (h1(), P46));
    if (!B().remoteDialogSeen) {
        let x8 = (await import("readline")).createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(`
Remote Control lets you access this CLI session from the web (claude.ai/code)
or the Claude app, so you can pick up where you left off on any device.

You can disconnect remote access anytime by running /remote-control again.
`);
        let a6 = await new Promise((D8) => {
            x8.question("Enable Remote Control? (y/n) ", D8)
        });
        if (x8.close(), m((D8) => {
                if (D8.remoteDialogSeen) return D8;
                return {
                    ...D8,
                    remoteDialogSeen: !0
                }
            }), a6.toLowerCase() !== "y" && a6.toLowerCase() !== "yes") process.exit(0)
    }
    let U = C();
    if (U.startsWith("http://") && !U.includes("localhost") && !U.includes("127.0.0.1")) console.error("Error: Remote Control base URL uses HTTP. Only HTTPS or localhost HTTP is allowed."), process.exit(1);
    let g = U,
        {
            getBranch: c,
            getRemoteUrl: n,
            findGitRoot: l,
            redactGitRemoteCredentials: z6
        } = await Promise.resolve().then(() => (pK(), oJ8)),
        {
            hasWorktreeCreateHook: A6
        } = await Promise.resolve().then(() => (K9(), tb8)),
        e = A6() || l(D) !== null,
        i = v ? S().remoteControlSpawnMode : void 0;
    if (i === "worktree" && !e) console.error("Warning: Saved spawn mode is worktree but this directory is not a git repository. Falling back to same-dir."), i = void 0, F((w8) => {
        if (w8.remoteControlSpawnMode === void 0) return w8;
        return {
            ...w8,
            remoteControlSpawnMode: void 0
        }
    });
    if (v && !i && e && $ === void 0 && !M && process.stdin.isTTY) {
        let x8 = (await import("readline")).createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(`
Claude Remote Control is launching in spawn mode which lets you create new sessions in this project from Claude Code on Web or your Mobile app. Learn more here: https://code.claude.com/docs/en/remote-control

Spawn mode for this project:
` + `  [1] same-dir — sessions share the current directory (default)
` + `  [2] worktree — each session gets an isolated git worktree

` + `This can be changed later or explicitly set with --spawn=same-dir or --spawn=worktree.
`);
        let a6 = await new Promise((Q6) => {
            x8.question("Choose [1/2] (default: 1): ", Q6)
        });
        x8.close();
        let D8 = a6.trim() === "2" ? "worktree" : "same-dir";
        i = D8, d("tengu_bridge_spawn_mode_chosen", {
            spawn_mode: D8
        }), F((Q6) => {
            if (Q6.remoteControlSpawnMode === D8) return Q6;
            return {
                ...Q6,
                remoteControlSpawnMode: D8
            }
        })
    }
    let O6, J6;
    if (M) J6 = "single-session", O6 = "resume";
    else if ($ !== void 0) J6 = $, O6 = "flag";
    else if (i !== void 0) J6 = i, O6 = "saved";
    else J6 = v ? "same-dir" : "single-session", O6 = "gate_default";
    let $6 = J6 === "single-session" ? 1 : j ?? S15,
        H6 = H ?? !0;
    if (!M) {
        let {
            clearBridgePointer: w8
        } = await Promise.resolve().then(() => (ba8(), Ca8));
        await w8(D)
    }
    if (J6 === "worktree" && !e) console.error("Error: Worktree mode requires a git repository or WorktreeCreate hooks configured. Use --spawn=session for single-session mode."), process.exit(1);
    let q6 = await c(),
        o = await n(),
        _6 = R15(),
        r = xa8(),
        {
            handleOAuth401Error: t
        } = await Promise.resolve().then(() => (T7(), zR)),
        Y6 = Ej7({
            baseUrl: U,
            getAccessToken: h,
            runnerVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION,
            onDebug: E,
            onAuth401: t,
            getTrustedDeviceToken: VJ6
        }),
        X6, M6 = {
            dir: D,
            machineName: _6,
            branch: q6,
            gitRepoUrl: o,
            maxSessions: $6,
            spawnMode: J6,
            verbose: _,
            sandbox: z,
            bridgeId: r,
            workerType: "claude_code",
            environmentId: xa8(),
            reuseEnvironmentId: X6,
            apiBaseUrl: U,
            sessionIngressUrl: g,
            debugFile: Y
        };
    E(`[bridge:init] bridgeId=${r}${X6?` reuseEnvironmentId=${X6}`:""} dir=${D} branch=${q6} gitRepoUrl=${z6(o)} machine=${_6}`), E(`[bridge:init] apiBaseUrl=${U} sessionIngressUrl=${g}`), E(`[bridge:init] sandbox=${z}${Y?` debugFile=${Y}`:""}`);
    let W6, V6;
    try {
        let w8 = await Y6.registerBridgeEnvironment(M6);
        W6 = w8.environment_id, V6 = w8.environment_secret
    } catch (w8) {
        d("tengu_bridge_registration_failed", {
            status: w8 instanceof Cu ? w8.status : void 0
        }), console.error(w8 instanceof Cu && w8.status === 404 ? "Remote Control environments are not available for your account." : `Error: ${b6(w8)}`), process.exit(1)
    }
    let f6;
    E(`[bridge:init] Registered, server environmentId=${W6}`);
    let G6 = Wz6();
    d("tengu_bridge_started", {
        max_sessions: M6.maxSessions,
        has_debug_file: !!M6.debugFile,
        sandbox: M6.sandbox,
        verbose: M6.verbose,
        heartbeat_interval_ms: G6.non_exclusive_heartbeat_interval_ms,
        spawn_mode: M6.spawnMode,
        spawn_mode_source: O6,
        multi_session_gate: v,
        pre_create_session: H6,
        worktree_available: e
    }), j1("info", "bridge_started", {
        max_sessions: M6.maxSessions,
        sandbox: M6.sandbox,
        spawn_mode: M6.spawnMode
    });
    let k6 = bJ7({
            execPath: process.execPath,
            scriptArgs: b15(),
            env: process.env,
            verbose: _,
            sandbox: z,
            debugFile: Y,
            permissionMode: A,
            onDebug: E,
            onActivity: (w8, x8) => {
                E(`[bridge:activity] sessionId=${w8} ${x8.type} ${x8.summary}`)
            },
            onPermissionRequest: (w8, x8, a6) => {
                E(`[bridge:perm] sessionId=${w8} tool=${x8.request.tool_name} request_id=${x8.request_id} (not auto-approving)`)
            }
        }),
        T6 = $15({
            verbose: _
        }),
        {
            parseGitHubRepository: v6
        } = await Promise.resolve().then(() => (gZ(), GQ6)),
        L6 = o ? v6(o) : null,
        y6 = L6 ? L6.split("/").pop() : K1A(D);
    T6.setRepoInfo(y6, q6);
    let c6 = J6 !== "single-session" && e;
    if (c6) T6.setSpawnModeDisplay(J6);
    let Z8 = (w8) => {
        if (w8[0] === 3 || w8[0] === 4) {
            process.emit("SIGINT");
            return
        }
        if (w8[0] === 32) {
            T6.toggleQr();
            return
        }
        if (w8[0] === 119) {
            if (!c6) return;
            let x8 = M6.spawnMode === "same-dir" ? "worktree" : "same-dir";
            M6.spawnMode = x8, d("tengu_bridge_spawn_mode_toggled", {
                spawn_mode: x8
            }), T6.logStatus(x8 === "worktree" ? "Spawn mode: worktree (new sessions get isolated git worktrees)" : "Spawn mode: same-dir (new sessions share the current directory)"), T6.setSpawnModeDisplay(x8), T6.refreshDisplay(), F((a6) => {
                if (a6.remoteControlSpawnMode === x8) return a6;
                return {
                    ...a6,
                    remoteControlSpawnMode: x8
                }
            });
            return
        }
    };
    if (process.stdin.isTTY) process.stdin.setRawMode(!0), process.stdin.resume(), process.stdin.on("data", Z8);
    let N8 = new AbortController,
        R6 = () => {
            E("[bridge:shutdown] SIGINT received, shutting down"), N8.abort()
        },
        p6 = () => {
            E("[bridge:shutdown] SIGTERM received, shutting down"), N8.abort()
        };
    process.on("SIGINT", R6), process.on("SIGTERM", p6);
    let q8 = null;
    if (H6) {
        let {
            createBridgeSession: w8
        } = await Promise.resolve().then(() => (rP6(), ax6));
        try {
            if (q8 = await w8({
                    environmentId: W6,
                    title: O ?? `${U58()}-${Zh6()}`,
                    events: [],
                    gitRepoUrl: o,
                    branch: q6,
                    signal: N8.signal,
                    baseUrl: U,
                    getAccessToken: h,
                    permissionMode: A
                }), q8) E(`[bridge:init] Created initial session ${q8}`)
        } catch (x8) {
            E(`[bridge:init] Session creation failed (non-fatal): ${b6(x8)}`)
        }
    }
    let L8 = null;
    if (q8 && J6 === "single-session") {
        let {
            writeBridgePointer: w8
        } = await Promise.resolve().then(() => (ba8(), Ca8)), x8 = {
            sessionId: q8,
            environmentId: W6,
            source: "standalone"
        };
        await w8(M6.dir, x8), L8 = setInterval(w8, 3600000, M6.dir, x8), L8.unref?.()
    }
    try {
        await QJ7(M6, W6, V6, Y6, k6, T6, N8.signal, void 0, q8 ?? void 0, async () => {
            return N(), await R(), h()
        })
    } finally {
        if (L8 !== null) clearInterval(L8);
        if (process.off("SIGINT", R6), process.off("SIGTERM", p6), process.stdin.off("data", Z8), process.stdin.isTTY) process.stdin.setRawMode(!1);
        process.stdin.pause()
    }
    process.exit(0)
}
// @from(Ln 509176, Col 0)
async function W1A(q, K) {
    let {
        dir: _,
        log: z
    } = q;
    process.chdir(_);
    let {
        setOriginalCwd: Y,
        setCwdState: A
    } = await Promise.resolve().then(() => (y8(), CD6));
    Y(_), A(_);
    let {
        enableConfigs: O,
        checkHasTrustDialogAccepted: w
    } = await Promise.resolve().then(() => (h1(), P46));
    O();
    let {
        initSinks: $
    } = await Promise.resolve().then(() => (Lz8(), Ia8));
    if ($(), !w()) throw new Sz8(`Workspace not trusted: ${_}. Run \`claude\` in that directory first to accept the trust dialog.`);
    if (!q.getAccessToken()) throw Error(mr8);
    let {
        getBridgeBaseUrl: j
    } = await Promise.resolve().then(() => (qn(), g57)), H = j();
    if (H.startsWith("http://") && !H.includes("localhost") && !H.includes("127.0.0.1")) throw new Sz8("Remote Control base URL uses HTTP. Only HTTPS or localhost HTTP is allowed.");
    let J = H,
        {
            getBranch: X,
            getRemoteUrl: M,
            findGitRoot: P
        } = await Promise.resolve().then(() => (pK(), oJ8)),
        {
            hasWorktreeCreateHook: W
        } = await Promise.resolve().then(() => (K9(), tb8));
    if (q.spawnMode === "worktree") {
        if (!(W() || P(_) !== null)) throw new Sz8(`Worktree mode requires a git repository or WorktreeCreate hooks. Directory ${_} has neither.`)
    }
    let D = await X(),
        Z = await M(),
        G = R15(),
        f = xa8(),
        v = {
            dir: _,
            machineName: G,
            branch: D,
            gitRepoUrl: Z,
            maxSessions: q.capacity,
            spawnMode: q.spawnMode,
            verbose: !1,
            sandbox: q.sandbox,
            bridgeId: f,
            workerType: "claude_code",
            environmentId: xa8(),
            apiBaseUrl: H,
            sessionIngressUrl: J
        },
        V = Ej7({
            baseUrl: H,
            getAccessToken: q.getAccessToken,
            runnerVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION,
            onDebug: z,
            onAuth401: q.onAuth401,
            getTrustedDeviceToken: VJ6
        }),
        k, N;
    try {
        let x = await V.registerBridgeEnvironment(v);
        k = x.environment_id, N = x.environment_secret
    } catch (x) {
        throw Error(`Bridge registration failed: ${b6(x)}`)
    }
    let R = bJ7({
            execPath: process.execPath,
            scriptArgs: b15(),
            env: process.env,
            verbose: !1,
            sandbox: q.sandbox,
            permissionMode: q.permissionMode,
            onDebug: z
        }),
        h = D1A(z);
    h.printBanner(v, k);
    let C;
    if (q.createSessionOnStart) {
        let {
            createBridgeSession: x
        } = await Promise.resolve().then(() => (rP6(), ax6));
        try {
            let B = await x({
                environmentId: k,
                title: q.name,
                events: [],
                gitRepoUrl: Z,
                branch: D,
                signal: K,
                baseUrl: H,
                getAccessToken: q.getAccessToken,
                permissionMode: q.permissionMode
            });
            if (B) C = B, z(`created initial session ${B}`)
        } catch (B) {
            z(`session pre-creation failed (non-fatal): ${b6(B)}`)
        }
    }
    await QJ7(v, k, N, V, R, h, K, void 0, C, async () => q.getAccessToken())
}