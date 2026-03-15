
// @from(Ln 459548, Col 0)
function zVq() {
    if (F_6("datadog")) return !1;
    if (Io8 !== void 0) return Io8;
    try {
        return jY(KVq)
    } catch {
        return !1
    }
}
// @from(Ln 459558, Col 0)
function AOz(A, q) {
    let K = US1(A);
    if (K === 0) return;
    let Y = K !== null ? {
        ...q,
        sample_rate: K
    } : q;
    if (YVq()) HR8(A, Y);
    if (zVq()) xL8(A, Y);
    Hv6(A, Y)
}
// @from(Ln 459569, Col 0)
async function qOz(A, q) {
    let K = US1(A);
    if (K === 0) return;
    let Y = K !== null ? {
        ...q,
        sample_rate: K
    } : q;
    if (YVq()) await HR8(A, Y);
    if (zVq()) xL8(A, Y);
    Hv6(A, Y)
}
// @from(Ln 459580, Col 0)
async function bo8() {
    Co8 = jY(qVq), Io8 = jY(KVq)
}
// @from(Ln 459584, Col 0)
function o_6() {
    oAA({
        logEvent: AOz,
        logEventAsync: qOz
    })
}
// @from(Ln 459590, Col 4)
qVq = "tengu_log_segment_events"
// @from(Ln 459591, Col 4)
KVq = "tengu_log_datadog_events"
// @from(Ln 459592, Col 4)
Co8 = void 0
// @from(Ln 459593, Col 4)
Io8 = void 0
// @from(Ln 459594, Col 4)
Lo6 = E(() => {
    HA();
    SG1();
    NG1();
    n96();
    ir8();
    V1()
})
// @from(Ln 459602, Col 4)
_n8 = {}
// @from(Ln 459611, Col 0)
function _Oz() {
    if (!w8("tengu_copper_bridge", !1)) return;
    if (t6(process.env.USE_LOCAL_OAUTH) || t6(process.env.LOCAL_BRIDGE)) return "ws://localhost:8765";
    if (t6(process.env.USE_STAGING_OAUTH)) return "wss://bridge-staging.claudeusercontent.com";
    return "wss://bridge.claudeusercontent.com"
}
// @from(Ln 459618, Col 0)
function wOz() {
    return t6(process.env.USE_LOCAL_OAUTH) || t6(process.env.LOCAL_BRIDGE)
}
// @from(Ln 459622, Col 0)
function wVq(A) {
    let q = new OVq,
        K = _Oz();
    return q.info(`Bridge URL: ${K??"none (using native socket)"}`), {
        serverName: "Claude in Chrome",
        logger: q,
        socketPath: kW1(),
        getSocketPaths: jw4,
        clientTypeId: "claude-code",
        onAuthenticationError: () => {
            q.warn("Authentication error occurred. Please ensure you are logged into the Claude browser extension with the same claude.ai account as Claude Code.")
        },
        onToolCallDisconnected: () => {
            return `Browser extension is not connected. Please ensure the Claude browser extension is installed and running (${KOz}), and that you are logged into claude.ai with the same account as Claude Code. If this is your first time connecting to Chrome, you may need to restart Chrome for the installation to take effect. If you continue to experience issues, please report a bug: ${YOz}`
        },
        onExtensionPaired: (Y, z) => {
            d1((_) => {
                if (_.chromeExtension?.pairedDeviceId === Y && _.chromeExtension?.pairedDeviceName === z) return _;
                return {
                    ..._,
                    chromeExtension: {
                        pairedDeviceId: Y,
                        pairedDeviceName: z
                    }
                }
            }), q.info(`Paired with "${z}" (${Y.slice(0,8)})`)
        },
        getPersistedDeviceId: () => {
            return X1().chromeExtension?.pairedDeviceId
        },
        ...K && {
            bridgeConfig: {
                url: K,
                getUserId: async () => {
                    return X1().oauthAccount?.accountUuid
                },
                getOAuthToken: async () => {
                    return sA()?.accessToken ?? ""
                },
                ...wOz() && {
                    devUserId: "dev_user_local"
                }
            }
        },
        ...(A?.CLAUDE_CHROME_PERMISSION_MODE || process.env.CLAUDE_CHROME_PERMISSION_MODE) && {
            initialPermissionMode: A?.CLAUDE_CHROME_PERMISSION_MODE ?? process.env.CLAUDE_CHROME_PERMISSION_MODE
        },
        ...!1,
        trackEvent: (Y, z) => {
            let _ = {};
            if (z)
                for (let [w, O] of Object.entries(z)) {
                    let $ = w === "status" ? "bridge_status" : w;
                    if (typeof O === "boolean" || typeof O === "number") _[$] = O;
                    else if (typeof O === "string" && zOz.has($)) _[$] = O
                }
            d(Y, _)
        }
    }
}
// @from(Ln 459682, Col 0)
async function OOz() {
    vo6(), o_6();
    let A = wVq(),
        q = y11(A),
        K = new Xy6,
        Y = !1,
        z = async () => {
            if (Y) return;
            Y = !0, await TU6(), await vG1(), process.exit(0)
        };
    process.stdin.on("end", () => void z()), process.stdin.on("error", () => void z()), k("[Claude in Chrome] Starting MCP server"), await q.connect(K), k("[Claude in Chrome] MCP server started")
}
// @from(Ln 459694, Col 0)
class OVq {
    silly(A, ...q) {
        k(Ro6(A, ...q), {
            level: "debug"
        })
    }
    debug(A, ...q) {
        k(Ro6(A, ...q), {
            level: "debug"
        })
    }
    info(A, ...q) {
        k(Ro6(A, ...q), {
            level: "info"
        })
    }
    warn(A, ...q) {
        k(Ro6(A, ...q), {
            level: "warn"
        })
    }
    error(A, ...q) {
        k(Ro6(A, ...q), {
            level: "error"
        })
    }
}
// @from(Ln 459721, Col 4)
KOz = "https://claude.ai/chrome"
// @from(Ln 459722, Col 4)
YOz = "https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome"
// @from(Ln 459723, Col 4)
zOz
// @from(Ln 459724, Col 4)
wn8 = E(() => {
    H1();
    DQ1();
    wL6();
    fA();
    tY6();
    k8();
    A8();
    HA();
    V1();
    NG1();
    n96();
    Lo6();
    SR();
    zOz = new Set(["bridge_status", "error_type", "tool_name"])
})
// @from(Ln 459740, Col 4)
DVq = {}
// @from(Ln 459764, Col 0)
function DH(A, ...q) {
    if (jVq) {
        let K = new Date().toISOString(),
            Y = q.length > 0 ? " " + B6(q) : "",
            z = `[${K}] [Claude Chrome Native Host] ${A}${Y}
`;
        jOz(jVq, z).catch(() => {})
    }
    console.error(`[Claude Chrome Native Host] ${A}`, ...q)
}
// @from(Ln 459775, Col 0)
function a_6(A) {
    let q = Buffer.from(A, "utf-8"),
        K = Buffer.alloc(4);
    K.writeUInt32LE(q.length, 0), process.stdout.write(K), process.stdout.write(q)
}
// @from(Ln 459780, Col 0)
async function POz() {
    DH("Initializing...");
    let A = new JVq,
        q = new MVq;
    await A.start();
    while (!0) {
        let K = await q.read();
        if (K === null) break;
        await A.handleMessage(K)
    }
    await A.stop()
}
// @from(Ln 459792, Col 0)
class JVq {
    mcpClients = new Map;
    nextClientId = 1;
    server = null;
    running = !1;
    socketPath = null;
    async start() {
        if (this.running) return;
        if (this.socketPath = kW1(), xo8() !== "win32") {
            let A = HQ6();
            try {
                if (!(await DOz(A)).isDirectory()) await uo8(A)
            } catch {}
            await JOz(A, {
                recursive: !0,
                mode: 448
            }), await $Vq(A, 448).catch(() => {});
            try {
                let q = await HVq(A);
                for (let K of q) {
                    if (!K.endsWith(".sock")) continue;
                    let Y = parseInt(K.replace(".sock", ""), 10);
                    if (isNaN(Y)) continue;
                    try {
                        process.kill(Y, 0)
                    } catch {
                        await uo8(HOz(A, K)).catch(() => {}), DH(`Removed stale socket for PID ${Y}`)
                    }
                }
            } catch {}
        }
        if (DH(`Creating socket listener: ${this.socketPath}`), this.server = $Oz((A) => this.handleMcpClient(A)), await new Promise((A, q) => {
                this.server.listen(this.socketPath, () => {
                    DH("Socket server listening for connections"), this.running = !0, A()
                }), this.server.on("error", (K) => {
                    DH("Socket server error:", K), q(K)
                })
            }), xo8() !== "win32") try {
            await $Vq(this.socketPath, 384), DH("Socket permissions set to 0600")
        } catch (A) {
            DH("Failed to set socket permissions:", A)
        }
    }
    async stop() {
        if (!this.running) return;
        for (let [, A] of this.mcpClients) A.socket.destroy();
        if (this.mcpClients.clear(), this.server) await new Promise((A) => {
            this.server.close(() => A())
        }), this.server = null;
        if (xo8() !== "win32" && this.socketPath) {
            try {
                await uo8(this.socketPath), DH("Cleaned up socket file")
            } catch {}
            try {
                let A = HQ6();
                if ((await HVq(A)).length === 0) await MOz(A), DH("Removed empty socket directory")
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
    async handleMessage(A) {
        let q = i1(A);
        switch (DH(`Handling Chrome message type: ${q.type}`), q.type) {
            case "ping":
                DH("Responding to ping"), a_6(B6({
                    type: "pong",
                    timestamp: Date.now()
                }));
                break;
            case "get_status":
                a_6(B6({
                    type: "status_response",
                    native_host_version: XOz
                }));
                break;
            case "tool_response": {
                if (this.mcpClients.size > 0) {
                    DH(`Forwarding tool response to ${this.mcpClients.size} MCP clients`);
                    let {
                        type: K,
                        ...Y
                    } = q, z = Buffer.from(B6(Y), "utf-8"), _ = Buffer.alloc(4);
                    _.writeUInt32LE(z.length, 0);
                    let w = Buffer.concat([_, z]);
                    for (let [O, $] of this.mcpClients) try {
                        $.socket.write(w)
                    } catch (H) {
                        DH(`Failed to send to MCP client ${O}:`, H)
                    }
                }
                break
            }
            case "notification": {
                if (this.mcpClients.size > 0) {
                    DH(`Forwarding notification to ${this.mcpClients.size} MCP clients`);
                    let {
                        type: K,
                        ...Y
                    } = q, z = Buffer.from(B6(Y), "utf-8"), _ = Buffer.alloc(4);
                    _.writeUInt32LE(z.length, 0);
                    let w = Buffer.concat([_, z]);
                    for (let [O, $] of this.mcpClients) try {
                        $.socket.write(w)
                    } catch (H) {
                        DH(`Failed to send notification to MCP client ${O}:`, H)
                    }
                }
                break
            }
            default:
                DH(`Unknown message type: ${q.type}`), a_6(B6({
                    type: "error",
                    error: `Unknown message type: ${q.type}`
                }))
        }
    }
    handleMcpClient(A) {
        let q = this.nextClientId++,
            K = {
                id: q,
                socket: A,
                buffer: Buffer.alloc(0)
            };
        this.mcpClients.set(q, K), DH(`MCP client ${q} connected. Total clients: ${this.mcpClients.size}`), a_6(B6({
            type: "mcp_connected"
        })), A.on("data", (Y) => {
            K.buffer = Buffer.concat([K.buffer, Y]);
            while (K.buffer.length >= 4) {
                let z = K.buffer.readUInt32LE(0);
                if (z === 0 || z > mo8) {
                    DH(`Invalid message length from MCP client ${q}: ${z}`), A.destroy();
                    return
                }
                if (K.buffer.length < 4 + z) break;
                let _ = K.buffer.slice(4, 4 + z);
                K.buffer = K.buffer.slice(4 + z);
                try {
                    let w = i1(_.toString("utf-8"));
                    DH(`Forwarding tool request from MCP client ${q}: ${w.method}`), a_6(B6({
                        type: "tool_request",
                        method: w.method,
                        params: w.params
                    }))
                } catch (w) {
                    DH(`Failed to parse tool request from MCP client ${q}:`, w)
                }
            }
        }), A.on("error", (Y) => {
            DH(`MCP client ${q} error: ${Y}`)
        }), A.on("close", () => {
            DH(`MCP client ${q} disconnected. Remaining clients: ${this.mcpClients.size-1}`), this.mcpClients.delete(q), a_6(B6({
                type: "mcp_disconnected"
            }))
        })
    }
}
// @from(Ln 459954, Col 0)
class MVq {
    buffer = Buffer.alloc(0);
    pendingResolve = null;
    closed = !1;
    constructor() {
        process.stdin.on("data", (A) => {
            this.buffer = Buffer.concat([this.buffer, A]), this.tryProcessMessage()
        }), process.stdin.on("end", () => {
            if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
        }), process.stdin.on("error", () => {
            if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
        })
    }
    tryProcessMessage() {
        if (!this.pendingResolve) return;
        if (this.buffer.length < 4) return;
        let A = this.buffer.readUInt32LE(0);
        if (A === 0 || A > mo8) {
            DH(`Invalid message length: ${A}`), this.pendingResolve(null), this.pendingResolve = null;
            return
        }
        if (this.buffer.length < 4 + A) return;
        let q = this.buffer.subarray(4, 4 + A);
        this.buffer = this.buffer.subarray(4 + A);
        let K = q.toString("utf-8");
        this.pendingResolve(K), this.pendingResolve = null
    }
    async read() {
        if (this.closed) return null;
        if (this.buffer.length >= 4) {
            let A = this.buffer.readUInt32LE(0);
            if (A > 0 && A <= mo8 && this.buffer.length >= 4 + A) {
                let q = this.buffer.subarray(4, 4 + A);
                return this.buffer = this.buffer.subarray(4 + A), q.toString("utf-8")
            }
        }
        return new Promise((A) => {
            this.pendingResolve = A, this.tryProcessMessage()
        })
    }
}
// @from(Ln 459995, Col 4)
XOz = "1.0.0"
// @from(Ln 459996, Col 4)
mo8 = 1048576
// @from(Ln 459997, Col 4)
jVq = void 0
// @from(Ln 459998, Col 4)
XVq = E(() => {
    SR();
    g1()
})
// @from(Ln 460002, Col 4)
hi
// @from(Ln 460003, Col 4)
Bo8 = E(() => {
    hi = {
        poll_interval_ms_not_at_capacity: 2000,
        poll_interval_ms_at_capacity: 600000,
        non_exclusive_heartbeat_interval_ms: 0,
        multisession_poll_interval_ms_not_at_capacity: 2000,
        multisession_poll_interval_ms_partial_capacity: 2000,
        multisession_poll_interval_ms_at_capacity: 600000,
        reclaim_older_than_ms: 5000,
        session_keepalive_interval_ms: 120000
    }
})
// @from(Ln 460016, Col 0)
function IF() {
    let A = lk("tengu_bridge_poll_interval_config", hi, 300000),
        q = WOz().safeParse(A);
    return q.success ? q.data : hi
}
// @from(Ln 460021, Col 4)
PVq
// @from(Ln 460021, Col 9)
WOz
// @from(Ln 460022, Col 4)
YC1 = E(() => {
    K7();
    HA();
    Bo8();
    PVq = {
        message: "must be 0 (disabled) or ≥100ms"
    }, WOz = F6(() => C.object({
        poll_interval_ms_not_at_capacity: C.number().int().min(100),
        poll_interval_ms_at_capacity: C.number().int().refine((A) => A === 0 || A >= 100, PVq),
        non_exclusive_heartbeat_interval_ms: C.number().int().min(0).default(0),
        multisession_poll_interval_ms_not_at_capacity: C.number().int().min(100).default(hi.multisession_poll_interval_ms_not_at_capacity),
        multisession_poll_interval_ms_partial_capacity: C.number().int().min(100).default(hi.multisession_poll_interval_ms_partial_capacity),
        multisession_poll_interval_ms_at_capacity: C.number().int().refine((A) => A === 0 || A >= 100, PVq).default(hi.multisession_poll_interval_ms_at_capacity),
        reclaim_older_than_ms: C.number().int().min(1).default(5000),
        session_keepalive_interval_ms: C.number().int().min(0).default(120000)
    }).refine((A) => A.non_exclusive_heartbeat_interval_ms > 0 || A.poll_interval_ms_at_capacity > 0, {
        message: "at-capacity liveness requires non_exclusive_heartbeat_interval_ms > 0 or poll_interval_ms_at_capacity > 0"
    }).refine((A) => A.non_exclusive_heartbeat_interval_ms > 0 || A.multisession_poll_interval_ms_at_capacity > 0, {
        message: "at-capacity liveness requires non_exclusive_heartbeat_interval_ms > 0 or multisession_poll_interval_ms_at_capacity > 0"
    }))
})
// @from(Ln 460060, Col 0)
function zC1(A) {
    return A.replace(/[^a-zA-Z0-9_-]/g, "_")
}
// @from(Ln 460064, Col 0)
function kOz(A, q) {
    let K = VOz[A] ?? A,
        Y = q.file_path ?? q.filePath ?? q.pattern ?? q.command?.slice(0, 60) ?? q.url ?? q.query ?? "";
    if (Y) return `${K} ${Y}`;
    return K
}
// @from(Ln 460071, Col 0)
function EOz(A, q, K) {
    let Y;
    try {
        Y = i1(A)
    } catch {
        return []
    }
    if (!Y || typeof Y !== "object") return [];
    let z = Y,
        _ = [],
        w = Date.now();
    switch (z.type) {
        case "assistant": {
            let O = z.message;
            if (!O) break;
            let $ = O.content;
            if (!Array.isArray($)) break;
            for (let H of $) {
                if (!H || typeof H !== "object") continue;
                let j = H;
                if (j.type === "tool_use") {
                    let J = j.name ?? "Tool",
                        M = j.input ?? {},
                        D = kOz(J, M);
                    _.push({
                        type: "tool_start",
                        summary: D,
                        timestamp: w
                    }), K(`[bridge:activity] sessionId=${q} tool_use name=${J} ${LOz(M)}`)
                } else if (j.type === "text") {
                    let J = j.text ?? "";
                    if (J.length > 0) _.push({
                        type: "text",
                        summary: J.slice(0, 80),
                        timestamp: w
                    }), K(`[bridge:activity] sessionId=${q} text "${J.slice(0,100)}"`)
                }
            }
            break
        }
        case "result": {
            let O = z.subtype;
            if (O === "success") _.push({
                type: "result",
                summary: "Session completed",
                timestamp: w
            }), K(`[bridge:activity] sessionId=${q} result subtype=success`);
            else if (O) {
                let H = z.errors?.[0] ?? `Error: ${O}`;
                _.push({
                    type: "error",
                    summary: H,
                    timestamp: w
                }), K(`[bridge:activity] sessionId=${q} result subtype=${O} error="${H}"`)
            } else K(`[bridge:activity] sessionId=${q} result subtype=undefined`);
            break
        }
        default:
            break
    }
    return _
}
// @from(Ln 460134, Col 0)
function yOz(A) {
    if (A.parent_tool_use_id != null || A.isSynthetic || A.isReplay) return;
    let K = A.message?.content,
        Y;
    if (typeof K === "string") Y = K;
    else if (Array.isArray(K)) {
        for (let z of K)
            if (z && typeof z === "object" && z.type === "text") {
                Y = z.text;
                break
            }
    }
    return Y = Y?.trim(), Y ? Y : void 0
}
// @from(Ln 460149, Col 0)
function LOz(A) {
    let q = [];
    for (let [K, Y] of Object.entries(A)) {
        if (typeof Y === "string") q.push(`${K}="${Y.slice(0,100)}"`);
        if (q.length >= 3) break
    }
    return q.join(" ")
}
// @from(Ln 460158, Col 0)
function GVq(A) {
    return {
        spawn(q, K) {
            let Y = zC1(q.sessionId),
                z;
            if (A.debugFile) {
                let Z = A.debugFile.lastIndexOf(".");
                if (Z > 0) z = `${A.debugFile.slice(0,Z)}-${Y}${A.debugFile.slice(Z)}`;
                else z = `${A.debugFile}-${Y}`
            } else if (A.verbose) z = ZVq(fOz(), "claude", `bridge-session-${Y}.log`);
            let _ = null,
                w;
            if (A.debugFile) w = ZVq(TOz(A.debugFile), `bridge-transcript-${Y}.jsonl`), _ = GOz(w, {
                flags: "a"
            }), _.on("error", (Z) => {
                A.onDebug(`[bridge:session] Transcript write error: ${Z.message}`), _ = null
            }), A.onDebug(`[bridge:session] Transcript log: ${w}`);
            let O = [...A.scriptArgs, "--print", "--sdk-url", q.sdkUrl, "--session-id", q.sessionId, "--input-format", "stream-json", "--output-format", "stream-json", "--replay-user-messages", ...A.verbose ? ["--verbose"] : [], ...z ? ["--debug-file", z] : [], ...A.permissionMode ? ["--permission-mode", A.permissionMode] : []],
                $ = {
                    ...A.env,
                    CLAUDE_CODE_OAUTH_TOKEN: void 0,
                    CLAUDE_CODE_ENVIRONMENT_KIND: "bridge",
                    ...A.sandbox && {
                        CLAUDE_CODE_FORCE_SANDBOX: "1"
                    },
                    CLAUDE_CODE_SESSION_ACCESS_TOKEN: q.accessToken,
                    CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2: "1",
                    ...q.useCcrV2 && {
                        CLAUDE_CODE_USE_CCR_V2: "1",
                        CLAUDE_CODE_WORKER_EPOCH: String(q.workerEpoch)
                    }
                };
            if (A.onDebug(`[bridge:session] Spawning sessionId=${q.sessionId} sdkUrl=${q.sdkUrl} accessToken=${q.accessToken?"present":"MISSING"}`), A.onDebug(`[bridge:session] Child args: ${O.join(" ")}`), z) A.onDebug(`[bridge:session] Debug log: ${z}`);
            let H = ZOz(A.execPath, O, {
                cwd: K,
                stdio: ["pipe", "pipe", "pipe"],
                env: $,
                windowsHide: !0
            });
            A.onDebug(`[bridge:session] sessionId=${q.sessionId} pid=${H.pid}`);
            let j = [],
                J = null,
                M = [],
                D = !1,
                X = !1;
            if (H.stderr) WVq({
                input: H.stderr
            }).on("line", (G) => {
                if (A.verbose) process.stderr.write(G + `
`);
                if (M.length >= NOz) M.shift();
                M.push(G)
            });
            if (H.stdout) WVq({
                input: H.stdout
            }).on("line", (G) => {
                if (_) _.write(G + `
`);
                if (A.onDebug(`[bridge:ws] sessionId=${q.sessionId} <<< ${ml8(G)}`), A.verbose) process.stderr.write(G + `
`);
                let f = EOz(G, q.sessionId, A.onDebug);
                for (let v of f) {
                    if (j.length >= vOz) j.shift();
                    j.push(v), J = v, A.onActivity?.(q.sessionId, v)
                } {
                    let v;
                    try {
                        v = i1(G)
                    } catch {}
                    if (v && typeof v === "object") {
                        let N = v;
                        if (N.type === "control_request") {
                            if (N.request?.subtype === "can_use_tool" && A.onPermissionRequest) A.onPermissionRequest(q.sessionId, v, q.accessToken)
                        } else if (N.type === "user" && !X && q.onFirstUserMessage) {
                            let V = yOz(N);
                            if (V) X = !0, q.onFirstUserMessage(V)
                        }
                    }
                }
            });
            let P = new Promise((Z) => {
                    H.on("close", (G, f) => {
                        if (_) _.end(), _ = null;
                        if (f === "SIGTERM" || f === "SIGINT") A.onDebug(`[bridge:session] sessionId=${q.sessionId} interrupted signal=${f} pid=${H.pid}`), Z("interrupted");
                        else if (G === 0) A.onDebug(`[bridge:session] sessionId=${q.sessionId} completed exit_code=0 pid=${H.pid}`), Z("completed");
                        else A.onDebug(`[bridge:session] sessionId=${q.sessionId} failed exit_code=${G} pid=${H.pid}`), Z("failed")
                    }), H.on("error", (G) => {
                        A.onDebug(`[bridge:session] sessionId=${q.sessionId} spawn error: ${G.message}`), Z("failed")
                    })
                }),
                W = {
                    sessionId: q.sessionId,
                    done: P,
                    activities: j,
                    accessToken: q.accessToken,
                    lastStderr: M,
                    get currentActivity() {
                        return J
                    },
                    kill() {
                        if (!H.killed)
                            if (A.onDebug(`[bridge:session] Sending SIGTERM to sessionId=${q.sessionId} pid=${H.pid}`), process.platform === "win32") H.kill();
                            else H.kill("SIGTERM")
                    },
                    forceKill() {
                        if (!D && H.pid)
                            if (D = !0, A.onDebug(`[bridge:session] Sending SIGKILL to sessionId=${q.sessionId} pid=${H.pid}`), process.platform === "win32") H.kill();
                            else H.kill("SIGKILL")
                    },
                    writeStdin(Z) {
                        if (H.stdin && !H.stdin.destroyed) A.onDebug(`[bridge:ws] sessionId=${q.sessionId} >>> ${ml8(Z)}`), H.stdin.write(Z)
                    },
                    updateAccessToken(Z) {
                        W.accessToken = Z, W.writeStdin(B6({
                            type: "update_environment_variables",
                            variables: {
                                CLAUDE_CODE_SESSION_ACCESS_TOKEN: Z
                            }
                        }) + `
`), A.onDebug(`[bridge:session] Sent token refresh via stdin for sessionId=${q.sessionId}`)
                    }
                };
            return W
        }
    }
}
// @from(Ln 460284, Col 4)
vOz = 10
// @from(Ln 460285, Col 4)
NOz = 10
// @from(Ln 460286, Col 4)
VOz
// @from(Ln 460287, Col 4)
fVq = E(() => {
    g1();
    Xr6();
    VOz = {
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
// @from(Ln 460312, Col 0)
function Y86() {
    let A = new Date,
        q = String(A.getHours()).padStart(2, "0"),
        K = String(A.getMinutes()).padStart(2, "0"),
        Y = String(A.getSeconds()).padStart(2, "0");
    return `${q}:${K}:${Y}`
}
// @from(Ln 460320, Col 0)
function z86(A, q) {
    return `${WV1(void 0,q)}/code?bridge=${A}`
}
// @from(Ln 460324, Col 0)
function vVq(A, q, K) {
    return `${WV1(A,K)}/code/${A}?bridge=${q}`
}
// @from(Ln 460328, Col 0)
function _C1({
    error: A,
    connected: q,
    sessionActive: K,
    reconnecting: Y
}) {
    if (A) return {
        label: "Remote Control failed",
        color: "error"
    };
    if (Y) return {
        label: "Remote Control reconnecting",
        color: "warning"
    };
    if (K || q) return {
        label: "Remote Control active",
        color: "success"
    };
    return {
        label: "Remote Control connecting…",
        color: "warning"
    }
}
// @from(Ln 460352, Col 0)
function wC1(A) {
    return `Code everywhere with the Claude app or ${A}`
}
// @from(Ln 460356, Col 0)
function OC1(A) {
    return `Continue coding in the Claude app or ${A}`
}
// @from(Ln 460360, Col 0)
function NVq(A, q) {
    return `\x1B]8;;${q}\x07${A}\x1B]8;;\x07`
}
// @from(Ln 460363, Col 4)
TVq = 30000
// @from(Ln 460364, Col 4)
$C1 = "Something went wrong, please try again"
// @from(Ln 460365, Col 4)
_86 = E(() => {
    q3();
    AL();
    M4()
})
// @from(Ln 460370, Col 0)
async function hOz(A) {
    return (await Lh(A, ROz)).split(`
`).filter((K) => K.length > 0)
}
// @from(Ln 460375, Col 0)
function VVq(A) {
    let q = A.write ?? ((U) => process.stdout.write(U)),
        K = A.verbose,
        Y = 0,
        z = "idle",
        _ = "Ready",
        w = "",
        O = "",
        $ = "",
        H = "",
        j = "",
        J = "",
        M = null,
        D = [],
        X = !1,
        P = null,
        W = 0,
        Z = 0,
        G = 1,
        f = null,
        v = "single-session",
        N = new Map,
        V = null,
        L = 0;

    function h(U) {
        let r = process.stdout.columns || 80,
            e = 0;
        for (let Y6 of U.split(`
`)) {
            if (Y6.length === 0) {
                e++;
                continue
            }
            let H6 = f8(Y6);
            e += Math.max(1, Math.ceil(H6 / r))
        }
        if (U.endsWith(`
`)) e--;
        return e
    }

    function R(U) {
        q(U), Y += h(U)
    }

    function u() {
        if (Y <= 0) return;
        k(`[bridge:ui] clearStatusLines count=${Y}`), q(`\x1B[${Y}A`), q("\x1B[J"), Y = 0
    }

    function I(U) {
        u(), q(U)
    }

    function g(U) {
        hOz(U).then((r) => {
            D = r, Q()
        }).catch((r) => {
            k(`QR code generation failed: ${r}`, {
                level: "error"
            })
        })
    }

    function B() {
        u();
        let U = XQ6[L % XQ6.length],
            r = "";
        if (w) r += O1.dim(" · ") + O1.dim(w);
        if (O) r += O1.dim(" · ") + O1.dim(O);
        R(`${O1.yellow(U)} ${O1.yellow("Connecting")}${r}
`)
    }

    function b() {
        p(), B(), V = setInterval(() => {
            L++, B()
        }, 150)
    }

    function p() {
        if (V) clearInterval(V), V = null
    }

    function Q() {
        if (z === "reconnecting" || z === "failed") return;
        u();
        let U = z === "idle";
        if (X)
            for (let s of D) R(`${O1.dim(s)}
`);
        let r = yW1,
            e = U ? O1.green : O1.cyan,
            H6 = (U ? O1.green : O1.cyan)(_),
            J6 = "";
        if (w) J6 += O1.dim(" · ") + O1.dim(w);
        if (O && v !== "worktree") J6 += O1.dim(" · ") + O1.dim(O);
        if (R(`${e(r)} ${H6}${J6}
`), G > 1) {
            let s = v === "worktree" ? "New sessions will be created in an isolated worktree" : "New sessions will be created in the current directory";
            R(`    ${O1.dim(`Capacity: ${Z}/${G} · ${s}`)}
`);
            for (let [, X6] of N) {
                let z6 = X6.title ? jq(X6.title, 35) : O1.dim("Attached"),
                    N6 = NVq(z6, X6.url),
                    $6 = X6.activity,
                    o = $6 && $6.type !== "result" && $6.type !== "error" ? O1.dim(` ${jq($6.summary,40)}`) : "";
                R(`    ${N6}${o}
`)
            }
        }
        if (G === 1) {
            let s = v === "single-session" ? "Single session · exits when complete" : v === "worktree" ? `Capacity: ${Z}/1 · New sessions will be created in an isolated worktree` : `Capacity: ${Z}/1 · New sessions will be created in the current directory`;
            R(`    ${O1.dim(s)}
`)
        }
        if (G === 1 && !U && P && Date.now() - W < TVq) R(`  ${O1.dim(jq(P,60))}
`);
        let K6 = M ?? H;
        if (K6) {
            R(`
`);
            let s = U ? wC1(K6) : OC1(K6),
                X6 = X ? O1.dim.italic("space to hide QR code") : O1.dim.italic("space to show QR code"),
                z6 = f ? O1.dim.italic(" · w to toggle spawn mode") : "";
            R(`${O1.dim(s)}
`), R(`${X6}${z6}
`)
        }
    }
    return {
        printBanner(U, r) {
            if (j = U.sessionIngressUrl, J = r, H = z86(r, j), g(H), K) q(O1.dim("Remote Control") + ` v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION}
`);
            if (K) {
                if (U.spawnMode !== "single-session") q(O1.dim("Spawn mode: ") + `${U.spawnMode}
`), q(O1.dim("Max concurrent sessions: ") + `${U.maxSessions}
`);
                q(O1.dim("Environment ID: ") + `${r}
`)
            }
            if (U.sandbox) q(O1.dim("Sandbox: ") + `${O1.green("Enabled")}
`);
            q(`
`), b()
        },
        logSessionStart(U, r) {
            if (K) {
                let e = jq(r, 80);
                I(O1.dim(`[${Y86()}]`) + ` Session started: ${O1.white(`"${e}"`)} (${O1.dim(U)})
`)
            }
        },
        logSessionComplete(U, r) {
            I(O1.dim(`[${Y86()}]`) + ` Session ${O1.green("completed")} (${UK(r)}) ${O1.dim(U)}
`)
        },
        logSessionFailed(U, r) {
            I(O1.dim(`[${Y86()}]`) + ` Session ${O1.red("failed")}: ${r} ${O1.dim(U)}
`)
        },
        logStatus(U) {
            I(O1.dim(`[${Y86()}]`) + ` ${U}
`)
        },
        logVerbose(U) {
            if (K) I(O1.dim(`[${Y86()}] ${U}`) + `
`)
        },
        logError(U) {
            I(O1.red(`[${Y86()}] Error: ${U}`) + `
`)
        },
        logReconnected(U) {
            I(O1.dim(`[${Y86()}]`) + ` ${O1.green("Reconnected")} after ${UK(U)}
`)
        },
        setRepoInfo(U, r) {
            w = U, O = r
        },
        setDebugLogPath(U) {
            $ = U
        },
        updateIdleStatus() {
            p(), z = "idle", _ = "Ready", P = null, W = 0, M = null, g(H), Q()
        },
        setAttached(U) {
            if (p(), z = "attached", _ = "Connected", P = null, W = 0, G <= 1) M = vVq(U, J, j), g(M);
            Q()
        },
        updateReconnectingStatus(U, r) {
            if (p(), u(), z = "reconnecting", X)
                for (let Y6 of D) R(`${O1.dim(Y6)}
`);
            let e = XQ6[L % XQ6.length];
            L++, R(`${O1.yellow(e)} ${O1.yellow("Reconnecting")} ${O1.dim("·")} ${O1.dim(`retrying in ${U}`)} ${O1.dim("·")} ${O1.dim(`disconnected ${r}`)}
`)
        },
        updateFailedStatus(U) {
            p(), u(), z = "failed";
            let r = "";
            if (w) r += O1.dim(" · ") + O1.dim(w);
            if (O) r += O1.dim(" · ") + O1.dim(O);
            if (R(`${O1.red(LW1)} ${O1.red("Remote Control Failed")}${r}
`), R(`${O1.dim($C1)}
`), U) R(`${O1.red(U)}
`)
        },
        updateSessionStatus(U, r, e, Y6) {
            if (e.type === "tool_start") P = e.summary, W = Date.now();
            Q()
        },
        clearStatus() {
            p(), u()
        },
        toggleQr() {
            X = !X, Q()
        },
        updateSessionCount(U, r, e) {
            if (Z === U && G === r && v === e) return;
            Z = U, G = r, v = e
        },
        setSpawnModeDisplay(U) {
            if (f === U) return;
            if (f = U, U) v = U
        },
        addSession(U, r) {
            N.set(U, {
                url: r
            })
        },
        updateSessionActivity(U, r) {
            let e = N.get(U);
            if (!e) return;
            e.activity = r
        },
        setSessionTitle(U, r) {
            let e = N.get(U);
            if (!e) return;
            if (e.title = r, z === "reconnecting" || z === "failed") return;
            if (G === 1) z = "titled", _ = jq(r, 40);
            Q()
        },
        removeSession(U) {
            N.delete(U)
        },
        refreshDisplay() {
            if (z === "reconnecting" || z === "failed") return;
            Q()
        }
    }
}
// @from(Ln 460628, Col 4)
ROz
// @from(Ln 460629, Col 4)
kVq = E(() => {
    aK();
    KN6();
    q3();
    qw();
    _86();
    H1();
    ROz = {
        type: "utf8",
        errorCorrectionLevel: "L",
        small: !0
    }
})
// @from(Ln 460643, Col 0)
function HC1(A) {
    let q = Buffer.from(A, "base64url").toString("utf-8"),
        K = i1(q);
    if (!K || typeof K !== "object" || !("version" in K) || K.version !== 1) throw Error(`Unsupported work secret version: ${K&&typeof K==="object"&&"version"in K?K.version:"unknown"}`);
    let Y = K;
    if (typeof Y.session_ingress_token !== "string" || Y.session_ingress_token.length === 0) throw Error("Invalid work secret: missing or empty session_ingress_token");
    if (typeof Y.api_base_url !== "string") throw Error("Invalid work secret: missing api_base_url");
    return K
}
// @from(Ln 460653, Col 0)
function jC1(A, q) {
    let K = A.includes("localhost") || A.includes("127.0.0.1"),
        Y = K ? "ws" : "wss",
        z = K ? "v2" : "v1",
        _ = A.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `${Y}://${_}/${z}/session_ingress/ws/${q}`
}
// @from(Ln 460661, Col 0)
function ho6(A, q) {
    if (A === q) return !0;
    let K = A.slice(A.lastIndexOf("_") + 1),
        Y = q.slice(q.lastIndexOf("_") + 1);
    return K.length >= 4 && K === Y
}
// @from(Ln 460668, Col 0)
function AV6(A) {
    if (!A.startsWith("cse_")) return A;
    return "session_" + A.slice(4)
}
// @from(Ln 460673, Col 0)
function JC1(A, q) {
    return `${A.replace(/\/+$/,"")}/v1/code/sessions/${q}`
}
// @from(Ln 460676, Col 0)
async function MC1(A, q) {
    let K = await X8.post(`${A}/worker/register`, {}, {
            headers: {
                Authorization: `Bearer ${q}`,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            },
            timeout: 1e4
        }),
        Y = K.data?.worker_epoch,
        z = typeof Y === "string" ? Number(Y) : Y;
    if (typeof z !== "number" || !Number.isFinite(z) || !Number.isSafeInteger(z)) throw Error(`registerWorker: invalid worker_epoch in response: ${B6(K.data)}`);
    return z
}
// @from(Ln 460690, Col 4)
DC1 = E(() => {
    kK();
    g1()
})
// @from(Ln 460695, Col 0)
function SOz(A) {
    let K = (A.startsWith("sk-ant-si-") ? A.slice(10) : A).split(".");
    if (K.length !== 3 || !K[1]) return null;
    try {
        let Y = i1(Buffer.from(K[1], "base64url").toString("utf8"));
        if (typeof Y.exp === "number") return Y.exp;
        return null
    } catch {
        return null
    }
}
// @from(Ln 460707, Col 0)
function RVq({
    getAccessToken: A,
    onRefresh: q,
    label: K
}) {
    let Y = new Map,
        z = new Map,
        _ = new Map;

    function w(J) {
        let M = (_.get(J) ?? 0) + 1;
        return _.set(J, M), M
    }

    function O(J, M) {
        let D = SOz(M);
        if (!D) {
            k(`[${K}:token] Could not decode JWT expiry for sessionId=${J}, token prefix=${M.slice(0,15)}…, keeping existing timer`);
            return
        }
        let X = Y.get(J);
        if (X) clearTimeout(X);
        let P = w(J),
            W = new Date(D * 1000).toISOString(),
            Z = D * 1000 - Date.now() - EVq;
        if (Z <= 0) {
            k(`[${K}:token] Token for sessionId=${J} expires=${W} (past or within buffer), refreshing immediately`), $(J, P);
            return
        }
        k(`[${K}:token] Scheduled token refresh for sessionId=${J} in ${UK(Z)} (expires=${W}, buffer=${EVq/1000}s)`);
        let G = setTimeout($, Z, J, P);
        Y.set(J, G)
    }
    async function $(J, M) {
        let D;
        try {
            D = await A()
        } catch (P) {
            k(`[${K}:token] getAccessToken threw for sessionId=${J}: ${_1(P)}`, {
                level: "error"
            })
        }
        if (_.get(J) !== M) {
            k(`[${K}:token] doRefresh for sessionId=${J} stale (gen ${M} vs ${_.get(J)}), skipping`);
            return
        }
        if (!D) {
            let P = (z.get(J) ?? 0) + 1;
            if (z.set(J, P), k(`[${K}:token] No OAuth token available for refresh, sessionId=${J} (failure ${P}/${LVq})`, {
                    level: "error"
                }), U1("error", "bridge_token_refresh_no_oauth"), P < LVq) {
                let W = setTimeout($, COz, J, M);
                Y.set(J, W)
            }
            return
        }
        z.delete(J), k(`[${K}:token] Refreshing token for sessionId=${J}: new token prefix=${D.slice(0,15)}…`), d("tengu_bridge_token_refreshed", {}), q(J, D);
        let X = setTimeout($, yVq, J, M);
        Y.set(J, X), k(`[${K}:token] Scheduled follow-up refresh for sessionId=${J} in ${UK(yVq)}`)
    }

    function H(J) {
        w(J);
        let M = Y.get(J);
        if (M) clearTimeout(M), Y.delete(J);
        z.delete(J)
    }

    function j() {
        for (let J of _.keys()) w(J);
        for (let J of Y.values()) clearTimeout(J);
        Y.clear(), z.clear()
    }
    return {
        schedule: O,
        cancel: H,
        cancelAll: j
    }
}
// @from(Ln 460786, Col 4)
EVq = 300000
// @from(Ln 460787, Col 4)
yVq = 1800000
// @from(Ln 460788, Col 4)
LVq = 3
// @from(Ln 460789, Col 4)
COz = 60000
// @from(Ln 460790, Col 4)
hVq = E(() => {
    g1();
    H1();
    u_();
    V1();
    _86();
    s8()
})
// @from(Ln 460798, Col 4)
So6 = {}
// @from(Ln 460819, Col 0)
function XC1(A) {
    return gOz(SjA(), BD(A), "bridge-pointer.json")
}
// @from(Ln 460822, Col 0)
async function pOz(A, q) {
    let K = XC1(A);
    try {
        await IOz(BOz(K), {
            recursive: !0
        }), await mOz(K, B6(q), "utf8"), k(`[bridge:pointer] wrote ${K}`)
    } catch (Y) {
        k(`[bridge:pointer] write failed: ${Y}`, {
            level: "warn"
        })
    }
}
// @from(Ln 460834, Col 0)
async function go8(A) {
    let q = XC1(A),
        K, Y;
    try {
        Y = (await xOz(q)).mtimeMs, K = await bOz(q, "utf8")
    } catch {
        return null
    }
    let z = FOz().safeParse(UOz(K));
    if (!z.success) return k(`[bridge:pointer] invalid schema, clearing: ${q}`), await Fo8(A), null;
    let _ = Date.now() - Y;
    if (_ > CVq) return k(`[bridge:pointer] stale (>4h mtime), clearing: ${q}`), await Fo8(A), null;
    return {
        ...z.data,
        ageMs: _
    }
}
// @from(Ln 460851, Col 0)
async function QOz(A) {
    let q = await go8(A);
    if (q) return {
        pointer: q,
        dir: A
    };
    let K = await bl1(A);
    if (K.length <= 1) return null;
    if (K.length > SVq) return k(`[bridge:pointer] ${K.length} worktrees exceeds fanout cap ${SVq}, skipping`), null;
    let Y = BD(A),
        z = K.filter((O) => BD(O) !== Y),
        _ = await Promise.all(z.map(async (O) => {
            let $ = await go8(O);
            return $ ? {
                pointer: $,
                dir: O
            } : null
        })),
        w = null;
    for (let O of _)
        if (O && (!w || O.pointer.ageMs < w.pointer.ageMs)) w = O;
    if (w) k(`[bridge:pointer] fanout found pointer in worktree ${w.dir} (ageMs=${w.pointer.ageMs})`);
    return w
}
// @from(Ln 460875, Col 0)
async function Fo8(A) {
    let q = XC1(A);
    try {
        await uOz(q), k(`[bridge:pointer] cleared ${q}`)
    } catch (K) {
        if (K.code !== "ENOENT") k(`[bridge:pointer] clear failed: ${K}`, {
            level: "warn"
        })
    }
}
// @from(Ln 460886, Col 0)
function UOz(A) {
    try {
        return i1(A)
    } catch {
        return null
    }
}
// @from(Ln 460893, Col 4)
SVq = 50
// @from(Ln 460894, Col 4)
CVq = 14400000
// @from(Ln 460895, Col 4)
FOz
// @from(Ln 460896, Col 4)
Co6 = E(() => {
    K7();
    H1();
    g1();
    cL6();
    xl1();
    FOz = F6(() => C.object({
        sessionId: C.string(),
        environmentId: C.string(),
        source: C.enum(["standalone", "repl"])
    }))
})
// @from(Ln 460908, Col 4)
do8 = {}
// @from(Ln 460921, Col 0)
function po8() {
    return IVq(rA6.errors(), bVq + ".jsonl")
}
// @from(Ln 460925, Col 0)
function PC1(A) {
    return IVq(rA6.mcpLogs(A), bVq + ".jsonl")
}
// @from(Ln 460929, Col 0)
function cOz(A) {
    let q = sw6(A);
    return {
        write(K) {
            q.write(B6(K) + `
`)
        },
        flush: q.flush,
        dispose: q.dispose
    }
}
// @from(Ln 460941, Col 0)
function lOz() {
    for (let A of Io6.values()) A.flush()
}
// @from(Ln 460945, Col 0)
function iOz() {
    for (let A of Io6.values()) A.dispose();
    Io6.clear()
}
// @from(Ln 460950, Col 0)
function Qo8(A) {
    let q = Io6.get(A);
    if (!q) {
        let K = dOz(A);
        q = cOz({
            writeFn: (Y) => {
                try {
                    $1().appendFileSync(A, Y)
                } catch {
                    $1().mkdirSync(K), $1().appendFileSync(A, Y)
                }
            },
            flushIntervalMs: 1000,
            maxBufferSize: 50
        }), Io6.set(A, q), E4(async () => q?.dispose())
    }
    return q
}
// @from(Ln 460969, Col 0)
function nOz(A, q) {
    return
}
// @from(Ln 460973, Col 0)
function rOz(A) {
    if (typeof A === "string") return A;
    if (A && typeof A === "object") {
        let q = A;
        if (typeof q.message === "string") return q.message;
        if (typeof q.error === "object" && q.error && "message" in q.error && typeof q.error.message === "string") return q.error.message
    }
    return
}
// @from(Ln 460983, Col 0)
function oOz(A) {
    let q = A.stack || A.message,
        K = "";
    if (X8.isAxiosError(A) && A.config?.url) {
        let Y = [`url=${A.config.url}`];
        if (A.response?.status !== void 0) Y.push(`status=${A.response.status}`);
        let z = rOz(A.response?.data);
        if (z) Y.push(`body=${z}`);
        K = `[${Y.join(",")}] `
    }
    k(`${A.name}: ${K}${q}`, {
        level: "error"
    }), nOz(po8(), {
        error: `${K}${q}`
    })
}
// @from(Ln 461000, Col 0)
function aOz(A, q) {
    k(`MCP server "${A}" ${q}`, {
        level: "error"
    });
    let K = PC1(A),
        z = {
            error: q instanceof Error ? q.stack || q.message : String(q),
            timestamp: new Date().toISOString(),
            sessionId: R1(),
            cwd: $1().cwd()
        };
    Qo8(K).write(z)
}
// @from(Ln 461014, Col 0)
function sOz(A, q) {
    k(`MCP server "${A}": ${q}`);
    let K = PC1(A),
        Y = {
            debug: q,
            timestamp: new Date().toISOString(),
            sessionId: R1(),
            cwd: $1().cwd()
        };
    Qo8(K).write(Y)
}
// @from(Ln 461026, Col 0)
function Uo8() {
    eHA({
        logError: oOz,
        logMCPError: aOz,
        logMCPDebug: sOz,
        getErrorsPath: po8,
        getMCPLogsPath: PC1
    }), k("Error log sink initialized")
}
// @from(Ln 461035, Col 4)
bVq
// @from(Ln 461035, Col 9)
Io6
// @from(Ln 461036, Col 4)
WC1 = E(() => {
    kK();
    R81();
    H1();
    KY();
    g1();
    T1();
    SA();
    k1();
    bVq = tHA(new Date);
    Io6 = new Map
})
// @from(Ln 461048, Col 4)
io8 = {}
// @from(Ln 461069, Col 0)
async function BVq() {
    return zn6("tengu_ccr_bridge_multi_session")
}
// @from(Ln 461073, Col 0)
function uVq(A) {
    return A.connCapMs * 2
}
// @from(Ln 461077, Col 0)
function z$z() {
    if (rY() || !process.argv[1]) return [];
    return [process.argv[1]]
}
// @from(Ln 461082, Col 0)
function _$z(A, q, K) {
    try {
        return A.spawn(q, K)
    } catch (Y) {
        let z = _1(Y);
        return _6(Error(`Session spawn failed: ${z}`)), z
    }
}
// @from(Ln 461090, Col 0)
async function gVq(A, q, K, Y, z, _, w, O = K$z, $, H) {
    let j = new AbortController;
    if (w.aborted) j.abort();
    else w.addEventListener("abort", () => j.abort(), {
        once: !0
    });
    let J = j.signal,
        M = new Map,
        D = new Map,
        X = new Map,
        P = new Map,
        W = new Map,
        Z = new Set,
        G = new Map,
        f = new Set,
        v = new Set,
        N = new AbortController;

    function V() {
        let z6 = new AbortController,
            N6 = () => z6.abort();
        if (J.aborted || N.signal.aborted) return z6.abort(), {
            signal: z6.signal,
            cleanup: () => {}
        };
        J.addEventListener("abort", N6, {
            once: !0
        });
        let $6 = N.signal;
        return $6.addEventListener("abort", N6, {
            once: !0
        }), {
            signal: z6.signal,
            cleanup: () => {
                J.removeEventListener("abort", N6), $6.removeEventListener("abort", N6)
            }
        }
    }
    async function L() {
        let z6 = !1,
            N6 = !1,
            $6 = !1;
        for (let [n] of M) {
            let o = X.get(n),
                a = P.get(n);
            if (!o || !a) continue;
            try {
                await Y.heartbeatWork(q, o, a), z6 = !0
            } catch (i) {
                if (k(`[bridge:heartbeat] Failed for sessionId=${n} workId=${o}: ${_1(i)}`), i instanceof cZ)
                    if (d("tengu_bridge_heartbeat_error", {
                            status: i.status,
                            error_type: i.status === 401 || i.status === 403 ? "auth_failed" : "fatal"
                        }), i.status === 401 || i.status === 403) N6 = !0;
                    else $6 = !0
            }
        }
        if ($6) return "fatal";
        if (N6) return "auth_failed";
        return z6 ? "ok" : "failed"
    }
    let h = new Set,
        R = H ? RVq({
            getAccessToken: H,
            onRefresh: (z6, N6) => {
                let $6 = M.get(z6);
                if (!$6) return;
                $6.updateAccessToken(N6)
            },
            label: "bridge"
        }) : null,
        u = Date.now(),
        I = new Set,
        g = 0,
        B = 0,
        b = null,
        p = null,
        Q = null,
        U = null,
        r = !1;
    if (k(`[bridge:work] Starting poll loop spawnMode=${A.spawnMode} maxSessions=${A.maxSessions} environmentId=${q}`), U1("info", "bridge_loop_started", {
            max_sessions: A.maxSessions,
            spawn_mode: A.spawnMode
        }), _.printBanner(A, q), _.updateSessionCount(0, A.maxSessions, A.spawnMode), $) _.setAttached($);

    function e() {
        _.updateSessionCount(M.size, A.maxSessions, A.spawnMode);
        for (let [i, l] of M) {
            let q6 = l.currentActivity;
            if (q6) _.updateSessionActivity(AV6(i), q6)
        }
        if (M.size === 0) {
            _.updateIdleStatus();
            return
        }
        let [z6, N6] = [...M.entries()].pop(), $6 = D.get(z6);
        if (!$6) return;
        let n = N6.currentActivity;
        if (!n || n.type === "result" || n.type === "error") {
            if (A.maxSessions > 1) _.refreshDisplay();
            return
        }
        let o = UK(Date.now() - $6),
            a = N6.activities.filter((i) => i.type === "tool_start").slice(-5).map((i) => i.summary);
        _.updateSessionStatus(z6, o, n, a)
    }

    function Y6() {
        H6(), e(), U = setInterval(e, Y$z)
    }

    function H6() {
        if (U) clearInterval(U), U = null
    }

    function J6(z6, N6, $6) {
        return (n) => {
            let o = X.get(z6);
            M.delete(z6), D.delete(z6), X.delete(z6), P.delete(z6);
            let a = AV6(z6);
            _.removeSession(a), v.delete(a), h.delete(z6);
            let i = W.get(z6);
            if (i) clearTimeout(i), W.delete(z6);
            R?.cancel(z6), N.abort(), N = new AbortController;
            let l = f.delete(z6),
                q6 = l && n === "interrupted" ? "failed" : n,
                w6 = Date.now() - N6;
            k(`[bridge:session] sessionId=${z6} workId=${o??"unknown"} exited status=${q6} duration=${UK(w6)}`), d("tengu_bridge_session_done", {
                status: q6,
                duration_ms: w6
            }), U1("info", "bridge_session_done", {
                status: q6,
                duration_ms: w6
            }), _.clearStatus(), H6();
            let O6 = $6.lastStderr.length > 0 ? $6.lastStderr.join(`
`) : void 0,
                L6;
            switch (q6) {
                case "completed":
                    _.logSessionComplete(z6, w6);
                    break;
                case "failed":
                    if (!l && !J.aborted) L6 = O6 ?? "Process exited with error", _.logSessionFailed(z6, L6), _6(Error(`Bridge session failed: ${L6}`));
                    break;
                case "interrupted":
                    _.logVerbose(`Session ${z6} interrupted`);
                    break
            }
            if (q6 !== "interrupted" && o) {
                let G6 = bo6(Y, q, o, _);
                I.add(G6), G6.finally(() => I.delete(G6)), Z.add(o)
            }
            let y6 = G.get(z6);
            if (y6) {
                G.delete(z6);
                let G6 = E66(y6.worktreePath, y6.worktreeBranch, y6.gitRoot, y6.hookBased).catch((R6) => _.logVerbose(`Failed to remove worktree ${y6.worktreePath}: ${_1(R6)}`));
                I.add(G6), G6.finally(() => I.delete(G6))
            }
            if (q6 !== "interrupted" && !J.aborted)
                if (A.spawnMode !== "single-session") {
                    let G6 = Y.archiveSession(AV6(z6)).catch((R6) => _.logVerbose(`Failed to archive session ${z6}: ${_1(R6)}`));
                    I.add(G6), G6.finally(() => I.delete(G6)), k(`[bridge:session] Session ${q6}, returning to idle (multi-session mode)`)
                } else {
                    k(`[bridge:session] Session ${q6}, aborting poll loop to tear down environment`), j.abort();
                    return
                } if (!J.aborted) Y6()
        }
    }
    if (!$) Y6();
    while (!J.aborted) {
        let z6 = IF();
        try {
            let N6 = await Y.pollForWork(q, K, J, z6.reclaim_older_than_ms);
            if (b !== null || p !== null) {
                let i = Date.now() - (b ?? p ?? Date.now());
                _.logReconnected(i), k(`[bridge:poll] Reconnected after ${UK(i)}`), d("tengu_bridge_reconnected", {
                    disconnected_ms: i
                })
            }
            if (g = 0, B = 0, b = null, p = null, Q = null, !N6) {
                if (M.size >= A.maxSessions) {
                    let l = z6.multisession_poll_interval_ms_at_capacity;
                    if (z6.non_exclusive_heartbeat_interval_ms > 0) {
                        d("tengu_bridge_heartbeat_mode_entered", {
                            active_sessions: M.size,
                            heartbeat_interval_ms: z6.non_exclusive_heartbeat_interval_ms
                        });
                        let q6 = l > 0 ? Date.now() + l : null,
                            w6 = "ok",
                            O6 = 0;
                        while (!J.aborted && M.size >= A.maxSessions && (q6 === null || Date.now() < q6)) {
                            let y6 = IF();
                            if (y6.non_exclusive_heartbeat_interval_ms <= 0) break;
                            let G6 = V();
                            if (w6 = await L(), w6 === "auth_failed" || w6 === "fatal") {
                                G6.cleanup();
                                break
                            }
                            O6++, await iZ(y6.non_exclusive_heartbeat_interval_ms, G6.signal), G6.cleanup()
                        }
                        let L6 = w6 === "auth_failed" || w6 === "fatal" ? w6 : J.aborted ? "shutdown" : M.size < A.maxSessions ? "capacity_changed" : q6 !== null && Date.now() >= q6 ? "poll_due" : "config_disabled";
                        if (d("tengu_bridge_heartbeat_mode_exited", {
                                reason: L6,
                                heartbeat_cycles: O6,
                                active_sessions: M.size
                            }), L6 === "poll_due") k(`[bridge:poll] Heartbeat poll_due after ${O6} cycles — falling through to pollForWork`);
                        if (w6 === "auth_failed" || w6 === "fatal") {
                            let y6 = V();
                            await iZ(l > 0 ? l : z6.non_exclusive_heartbeat_interval_ms, y6.signal), y6.cleanup()
                        }
                    } else if (l > 0) {
                        let q6 = V();
                        await iZ(l, q6.signal), q6.cleanup()
                    }
                } else {
                    let l = M.size > 0 ? z6.multisession_poll_interval_ms_partial_capacity : z6.multisession_poll_interval_ms_not_at_capacity;
                    await iZ(l, J)
                }
                continue
            }
            let n = M.size >= A.maxSessions;
            if (Z.has(N6.id)) {
                if (k(`[bridge:work] Skipping already-completed workId=${N6.id}`), n) {
                    let i = V();
                    if (z6.non_exclusive_heartbeat_interval_ms > 0) await L(), await iZ(z6.non_exclusive_heartbeat_interval_ms, i.signal);
                    else if (z6.multisession_poll_interval_ms_at_capacity > 0) await iZ(z6.multisession_poll_interval_ms_at_capacity, i.signal);
                    i.cleanup()
                } else await iZ(1000, J);
                continue
            }
            let o;
            try {
                o = HC1(N6.secret)
            } catch (i) {
                let l = _1(i);
                _.logError(`Failed to decode work secret for workId=${N6.id}: ${l}`), d("tengu_bridge_work_secret_failed", {}), Z.add(N6.id);
                let q6 = bo6(Y, q, N6.id, _);
                if (I.add(q6), q6.finally(() => I.delete(q6)), n) {
                    let w6 = V();
                    if (z6.non_exclusive_heartbeat_interval_ms > 0) await L(), await iZ(z6.non_exclusive_heartbeat_interval_ms, w6.signal);
                    else if (z6.multisession_poll_interval_ms_at_capacity > 0) await iZ(z6.multisession_poll_interval_ms_at_capacity, w6.signal);
                    w6.cleanup()
                }
                continue
            }
            let a = async () => {
                k(`[bridge:work] Acknowledging workId=${N6.id}`);
                try {
                    await Y.acknowledgeWork(q, N6.id, o.session_ingress_token)
                } catch (i) {
                    k(`[bridge:work] Acknowledge failed workId=${N6.id}: ${_1(i)}`)
                }
            };
            switch (N6.data.type) {
                case "healthcheck":
                    await a(), k("[bridge:work] Healthcheck received"), _.logVerbose("Healthcheck received");
                    break;
                case "session": {
                    let i = N6.data.id;
                    try {
                        dZ(i, "session_id")
                    } catch {
                        await a(), _.logError(`Invalid session_id received: ${i}`);
                        break
                    }
                    let l = M.get(i);
                    if (l) {
                        if (l.updateAccessToken(o.session_ingress_token), P.set(i, o.session_ingress_token), X.set(i, N6.id), !h.has(i)) R?.schedule(i, o.session_ingress_token);
                        k(`[bridge:work] Updated access token for existing sessionId=${i} workId=${N6.id}`), await a();
                        break
                    }
                    if (M.size >= A.maxSessions) {
                        k(`[bridge:work] At capacity (${M.size}/${A.maxSessions}), cannot spawn new session for workId=${N6.id}`);
                        break
                    }
                    await a();
                    let q6, w6 = !1,
                        O6;
                    if (o.use_code_sessions === !0 || t6(process.env.CLAUDE_BRIDGE_USE_CCR_V2)) {
                        q6 = JC1(A.apiBaseUrl, i);
                        for (let Z6 = 1; Z6 <= 2; Z6++) try {
                            O6 = await MC1(q6, o.session_ingress_token), w6 = !0, k(`[bridge:session] CCR v2: registered worker sessionId=${i} epoch=${O6} attempt=${Z6}`);
                            break
                        } catch (u6) {
                            let C6 = _1(u6);
                            if (Z6 < 2) {
                                if (k(`[bridge:session] CCR v2: registerWorker attempt ${Z6} failed, retrying: ${C6}`), await iZ(2000, J), J.aborted) break;
                                continue
                            }
                            _.logError(`CCR v2 worker registration failed for session ${i}: ${C6}`), _6(Error(`registerWorker failed: ${C6}`)), Z.add(N6.id);
                            let o6 = bo6(Y, q, N6.id, _);
                            I.add(o6), o6.finally(() => I.delete(o6))
                        }
                        if (!w6) break
                    } else q6 = jC1(A.sessionIngressUrl, i);
                    let L6 = A.dir;
                    if (A.spawnMode === "worktree" && ($ === void 0 || !ho6(i, $))) try {
                        let Z6 = await zl6(`bridge-${zC1(i)}`);
                        G.set(i, {
                            worktreePath: Z6.worktreePath,
                            worktreeBranch: Z6.worktreeBranch,
                            gitRoot: Z6.gitRoot,
                            hookBased: Z6.hookBased
                        }), L6 = Z6.worktreePath, k(`[bridge:session] Created worktree for sessionId=${i} at ${Z6.worktreePath}`)
                    } catch (Z6) {
                        let u6 = _1(Z6);
                        _.logError(`Failed to create worktree for session ${i}: ${u6}`), _6(Error(`Worktree creation failed: ${u6}`)), Z.add(N6.id);
                        let C6 = bo6(Y, q, N6.id, _);
                        I.add(C6), C6.finally(() => I.delete(C6));
                        break
                    }
                    k(`[bridge:session] Spawning sessionId=${i} sdkUrl=${q6}`);
                    let y6 = AV6(i),
                        G6 = _$z(z, {
                            sessionId: i,
                            sdkUrl: q6,
                            accessToken: o.session_ingress_token,
                            useCcrV2: w6,
                            workerEpoch: O6,
                            onFirstUserMessage: (Z6) => {
                                if (v.has(y6)) return;
                                v.add(y6);
                                let u6 = D$z(Z6);
                                _.setSessionTitle(y6, u6), k(`[bridge:title] derived title for ${y6}: ${u6}`), Promise.resolve().then(() => (wN6(), dn6)).then(({
                                    updateBridgeSessionTitle: C6
                                }) => C6(y6, u6, {
                                    baseUrl: A.apiBaseUrl
                                })).catch((C6) => k(`[bridge:title] failed to update title for ${y6}: ${C6}`, {
                                    level: "error"
                                }))
                            }
                        }, L6);
                    if (typeof G6 === "string") {
                        _.logError(`Failed to spawn session ${i}: ${G6}`);
                        let Z6 = G.get(i);
                        if (Z6) {
                            G.delete(i);
                            let C6 = E66(Z6.worktreePath, Z6.worktreeBranch, Z6.gitRoot, Z6.hookBased).catch((o6) => _.logVerbose(`Failed to remove worktree ${Z6.worktreePath}: ${_1(o6)}`));
                            I.add(C6), C6.finally(() => I.delete(C6))
                        }
                        Z.add(N6.id);
                        let u6 = bo6(Y, q, N6.id, _);
                        I.add(u6), u6.finally(() => I.delete(u6));
                        break
                    }
                    let R6 = G6;
                    d("tengu_bridge_session_started", {
                        active_sessions: M.size
                    }), U1("info", "bridge_session_started"), M.set(i, R6), X.set(i, N6.id), P.set(i, o.session_ingress_token);
                    let T6 = Date.now();
                    D.set(i, T6), _.logSessionStart(i, `Session ${i}`);
                    let D6 = zC1(i),
                        Q6;
                    if (A.debugFile) {
                        let Z6 = A.debugFile.lastIndexOf(".");
                        if (Z6 > 0) Q6 = `${A.debugFile.slice(0,Z6)}-${D6}${A.debugFile.slice(Z6)}`;
                        else Q6 = `${A.debugFile}-${D6}`
                    } else if (A.verbose) Q6 = q$z(eOz(), "claude", `bridge-session-${D6}.log`);
                    if (Q6) _.logVerbose(`Debug log: ${Q6}`);
                    _.addSession(y6, hZ(y6, A.sessionIngressUrl)), Y6(), _.setAttached(y6), X$z(y6, A.apiBaseUrl).then((Z6) => {
                        if (Z6 && M.has(i)) v.add(y6), _.setSessionTitle(y6, Z6), k(`[bridge:title] server title for ${y6}: ${Z6}`)
                    }).catch((Z6) => k(`[bridge:title] failed to fetch title for ${y6}: ${Z6}`, {
                        level: "error"
                    }));
                    let k6 = A.sessionTimeoutMs ?? Bl8;
                    if (k6 > 0) {
                        let Z6 = setTimeout(O$z, k6, i, k6, _, f, R6);
                        W.set(i, Z6)
                    }
                    if (w6) h.add(i);
                    else R?.schedule(i, o.session_ingress_token);
                    R6.done.then(J6(i, T6, R6));
                    break
                }
                default:
                    await a(), k(`[bridge:work] Unknown work type: ${N6.data.type}, skipping`);
                    break
            }
            if (n) {
                let i = V();
                if (z6.non_exclusive_heartbeat_interval_ms > 0) await L(), await iZ(z6.non_exclusive_heartbeat_interval_ms, i.signal);
                else if (z6.multisession_poll_interval_ms_at_capacity > 0) await iZ(z6.multisession_poll_interval_ms_at_capacity, i.signal);
                i.cleanup()
            }
        } catch (N6) {
            if (J.aborted) break;
            if (N6 instanceof cZ) {
                if (r = !0, VN6(N6.errorType)) _.logStatus(N6.message);
                else if (Pr6(N6)) k(`[bridge:work] Suppressed 403 error: ${N6.message}`);
                else _.logError(N6.message), _6(N6);
                d("tengu_bridge_fatal_error", {
                    status: N6.status,
                    error_type: N6.errorType
                }), U1(VN6(N6.errorType) ? "info" : "error", "bridge_fatal_error", {
                    status: N6.status,
                    error_type: N6.errorType
                });
                break
            }
            let $6 = qh1(N6);
            if (FVq(N6) || pVq(N6)) {
                let n = Date.now();
                if (Q !== null && n - Q > uVq(O)) k(`[bridge:work] Detected system sleep (${Math.round((n-Q)/1000)}s gap), resetting error budget`), U1("info", "bridge_poll_sleep_detected", {
                    gapMs: n - Q
                }), b = null, g = 0, p = null, B = 0;
                if (Q = n, !b) b = n;
                let o = n - b;
                if (o >= O.connGiveUpMs) {
                    _.logError(`Server unreachable for ${Math.round(o/60000)} minutes, giving up.`), d("tengu_bridge_poll_give_up", {
                        error_type: "connection",
                        elapsed_ms: o
                    }), U1("error", "bridge_poll_give_up", {
                        error_type: "connection",
                        elapsed_ms: o
                    }), r = !0;
                    break
                }
                p = null, B = 0, g = g ? Math.min(g * 2, O.connCapMs) : O.connInitialMs;
                let a = lo8(g);
                if (_.logVerbose(`Connection error, retrying in ${xo6(a)} (${Math.round(o/1000)}s elapsed): ${$6}`), _.updateReconnectingStatus(xo6(a), UK(o)), IF().non_exclusive_heartbeat_interval_ms > 0) await L();
                await iZ(a, J)
            } else {
                let n = Date.now();
                if (Q !== null && n - Q > uVq(O)) k(`[bridge:work] Detected system sleep (${Math.round((n-Q)/1000)}s gap), resetting error budget`), U1("info", "bridge_poll_sleep_detected", {
                    gapMs: n - Q
                }), b = null, g = 0, p = null, B = 0;
                if (Q = n, !p) p = n;
                let o = n - p;
                if (o >= O.generalGiveUpMs) {
                    _.logError(`Persistent errors for ${Math.round(o/60000)} minutes, giving up.`), d("tengu_bridge_poll_give_up", {
                        error_type: "general",
                        elapsed_ms: o
                    }), U1("error", "bridge_poll_give_up", {
                        error_type: "general",
                        elapsed_ms: o
                    }), r = !0;
                    break
                }
                b = null, g = 0, B = B ? Math.min(B * 2, O.generalCapMs) : O.generalInitialMs;
                let a = lo8(B);
                if (_.logVerbose(`Poll failed, retrying in ${xo6(a)} (${Math.round(o/1000)}s elapsed): ${$6}`), _.updateReconnectingStatus(xo6(a), UK(o)), IF().non_exclusive_heartbeat_interval_ms > 0) await L();
                await iZ(a, J)
            }
        }
    }
    H6(), _.clearStatus();
    let K6 = Date.now() - u;
    d("tengu_bridge_shutdown", {
        active_sessions: M.size,
        loop_duration_ms: K6
    }), U1("info", "bridge_shutdown", {
        active_sessions: M.size,
        loop_duration_ms: K6
    });
    let s = new Set(M.keys());
    if ($) s.add($);
    if (M.size > 0) {
        k(`[bridge:shutdown] Shutting down ${M.size} active session(s)`), _.logStatus(`Shutting down ${M.size} active session(s)…`);
        let z6 = new Map(X);
        for (let [$6, n] of M.entries()) k(`[bridge:shutdown] Sending SIGTERM to sessionId=${$6}`), n.kill();
        let N6 = new AbortController;
        await Promise.race([Promise.allSettled([...M.values()].map(($6) => $6.done)), iZ(30000, N6.signal)]), N6.abort();
        for (let [$6, n] of M.entries()) k(`[bridge:shutdown] Force-killing stuck sessionId=${$6}`), n.forceKill();
        for (let $6 of W.values()) clearTimeout($6);
        if (W.clear(), R?.cancelAll(), G.size > 0) {
            let $6 = [...G.values()];
            G.clear(), k(`[bridge:shutdown] Cleaning up ${$6.length} worktree(s)`), await Promise.allSettled($6.map((n) => E66(n.worktreePath, n.worktreeBranch, n.gitRoot, n.hookBased)))
        }
        await Promise.allSettled([...z6.entries()].map(([$6, n]) => {
            return Y.stopWork(q, n, !0).catch((o) => _.logVerbose(`Failed to stop work ${n} for session ${$6}: ${_1(o)}`))
        }))
    }
    if (I.size > 0) await Promise.allSettled([...I]);
    if (s.size > 0) k(`[bridge:shutdown] Archiving ${s.size} session(s)`), await Promise.allSettled([...s].map((z6) => Y.archiveSession(AV6(z6)).catch((N6) => _.logVerbose(`Failed to archive session ${z6}: ${_1(N6)}`))));
    try {
        await Y.deregisterEnvironment(q), k("[bridge:shutdown] Environment deregistered, bridge offline"), _.logVerbose("Environment deregistered.")
    } catch (z6) {
        _.logVerbose(`Failed to deregister environment: ${_1(z6)}`)
    }
    let {
        clearBridgePointer: X6
    } = await Promise.resolve().then(() => (Co6(), So6));
    await X6(A.dir), _.logVerbose("Environment offline.")
}
// @from(Ln 461575, Col 0)
function FVq(A) {
    if (A && typeof A === "object" && "code" in A && typeof A.code === "string" && w$z.has(A.code)) return !0;
    return !1
}
// @from(Ln 461580, Col 0)
function pVq(A) {
    return !!A && typeof A === "object" && "code" in A && typeof A.code === "string" && A.code === "ERR_BAD_RESPONSE"
}
// @from(Ln 461584, Col 0)
function lo8(A) {
    return Math.max(0, A + A * 0.25 * (2 * Math.random() - 1))
}
// @from(Ln 461588, Col 0)
function xo6(A) {
    return A >= 1000 ? `${(A/1000).toFixed(1)}s` : `${Math.round(A)}ms`
}
// @from(Ln 461591, Col 0)
async function bo6(A, q, K, Y) {
    for (let w = 1; w <= 3; w++) try {
        await A.stopWork(q, K, !1), k(`[bridge:work] stopWork succeeded for workId=${K} on attempt ${w}/3`);
        return
    } catch (O) {
        if (O instanceof cZ) {
            if (Pr6(O)) k(`[bridge:work] Suppressed stopWork 403 for ${K}: ${O.message}`);
            else Y.logError(`Failed to stop work ${K}: ${O.message}`);
            U1("error", "bridge_stop_work_failed", {
                attempts: w,
                fatal: !0
            });
            return
        }
        let $ = _1(O);
        if (w < 3) {
            let H = lo8(1000 * Math.pow(2, w - 1));
            Y.logVerbose(`Failed to stop work ${K} (attempt ${w}/3), retrying in ${xo6(H)}: ${$}`), await new Promise((j) => setTimeout(j, H))
        } else Y.logError(`Failed to stop work ${K} after 3 attempts: ${$}`), U1("error", "bridge_stop_work_failed", {
            attempts: 3
        })
    }
}
// @from(Ln 461615, Col 0)
function O$z(A, q, K, Y, z) {
    k(`[bridge:session] sessionId=${A} timed out after ${UK(q)}`), d("tengu_bridge_session_timeout", {
        timeout_ms: q
    }), K.logSessionFailed(A, `Session timed out after ${UK(q)}`), Y.add(A), z.kill()
}
// @from(Ln 461621, Col 0)
function iZ(A, q) {
    if (q?.aborted) return Promise.resolve();
    return new Promise((K) => {
        if (!q) {
            setTimeout(K, A);
            return
        }
        let Y = () => {
                clearTimeout(z), K()
            },
            z = setTimeout((_, w, O) => {
                _.removeEventListener("abort", w), O()
            }, A, q, Y, K);
        q.addEventListener("abort", Y, {
            once: !0
        })
    })
}
// @from(Ln 461640, Col 0)
function H$z(A) {
    if (A === "session") return "single-session";
    if (A === "same-dir") return "same-dir";
    if (A === "worktree") return "worktree";
    return `--spawn requires one of: ${$$z.join(", ")} (got: ${A??"<missing>"})`
}
// @from(Ln 461647, Col 0)
function j$z(A) {
    let q = A === void 0 ? NaN : parseInt(A, 10);
    if (isNaN(q) || q < 1) return `--capacity requires a positive integer (got: ${A??"<missing>"})`;
    return q
}
// @from(Ln 461653, Col 0)
function QVq(A) {
    let q = !1,
        K = !1,
        Y, z, _, w, O = !1,
        $, H, j, J, M = !1;
    for (let X = 0; X < A.length; X++) {
        let P = A[X];
        if (P === "--help" || P === "-h") O = !0;
        else if (P === "--verbose" || P === "-v") q = !0;
        else if (P === "--sandbox") K = !0;
        else if (P === "--no-sandbox") K = !1;
        else if (P === "--debug-file" && X + 1 < A.length) Y = co8(A[++X]);
        else if (P.startsWith("--debug-file=")) Y = co8(P.slice(13));
        else if (P === "--session-timeout" && X + 1 < A.length) z = parseInt(A[++X], 10) * 1000;
        else if (P.startsWith("--session-timeout=")) z = parseInt(P.slice(18), 10) * 1000;
        else if (P === "--permission-mode" && X + 1 < A.length) _ = A[++X];
        else if (P.startsWith("--permission-mode=")) _ = P.slice(18);
        else if (P === "--name" && X + 1 < A.length) w = A[++X];
        else if (P.startsWith("--name=")) w = P.slice(7);
        else if (P === "--spawn" || P.startsWith("--spawn=")) {
            if ($ !== void 0) return D("--spawn may only be specified once");
            let W = P.startsWith("--spawn=") ? P.slice(8) : A[++X],
                Z = H$z(W);
            if (Z === "single-session" || Z === "same-dir" || Z === "worktree") $ = Z;
            else return D(Z)
        } else if (P === "--capacity" || P.startsWith("--capacity=")) {
            if (H !== void 0) return D("--capacity may only be specified once");
            let W = P.startsWith("--capacity=") ? P.slice(11) : A[++X],
                Z = j$z(W);
            if (typeof Z === "number") H = Z;
            else return D(Z)
        } else if (P === "--create-session-in-dir") j = !0;
        else if (P === "--no-create-session-in-dir") j = !1;
        else return D(`Unknown argument: ${P}
Run 'claude remote-control --help' for usage.`)
    }
    if ($ === "single-session" && H !== void 0) return D("--capacity cannot be used with --spawn=session (single-session mode has fixed capacity 1).");
    if ((J || M) && ($ !== void 0 || H !== void 0 || j !== void 0)) return D("--session-id and --continue cannot be used with --spawn, --capacity, or --create-session-in-dir.");
    if (J && M) return D("--session-id and --continue cannot be used together.");
    return {
        verbose: q,
        sandbox: K,
        debugFile: Y,
        sessionTimeoutMs: z,
        permissionMode: _,
        name: w,
        spawnMode: $,
        capacity: H,
        createSessionInDir: j,
        sessionId: J,
        continueSession: M,
        help: O
    };

    function D(X) {
        return {
            verbose: q,
            sandbox: K,
            debugFile: Y,
            sessionTimeoutMs: z,
            permissionMode: _,
            name: w,
            spawnMode: $,
            capacity: H,
            createSessionInDir: j,
            sessionId: J,
            continueSession: M,
            help: O,
            error: X
        }
    }
}
// @from(Ln 461725, Col 0)
async function J$z() {
    let {
        EXTERNAL_PERMISSION_MODES: A
    } = await Promise.resolve().then(() => (EC6(), K58)), q = A.join(", "), K = await BVq(), Y = K ? `  --spawn <mode>                   Spawn mode: same-dir, worktree, session
                                   (default: same-dir)
  --capacity <N>                   Max concurrent sessions in worktree or
                                   same-dir mode (default: ${mVq})
  --[no-]create-session-in-dir     Pre-create a session in the current
                                   directory; in worktree mode this session
                                   stays in cwd while on-demand sessions get
                                   isolated worktrees (default: on)
` : "", w = `
Remote Control - Connect your local environment to claude.ai/code

USAGE
  claude remote-control [options]
OPTIONS
  --name <name>                    Name for the session (shown in claude.ai/code)
  --permission-mode <mode>         Permission mode for spawned sessions
                                   (${q})
  --debug-file <path>              Write debug logs to file
  -v, --verbose                    Enable verbose output
  -h, --help                       Show this help
${Y}
DESCRIPTION
  Remote Control allows you to control sessions on your local device from
  claude.ai/code (https://claude.ai/code). Run this command in the
  directory you want to work in, then connect from the Claude app or web.
${K?`
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
${K?`  - Worktree mode requires a git repository or WorktreeCreate/WorktreeRemove hooks
`:""}`;
    console.log(w)
}
// @from(Ln 461769, Col 0)
function D$z(A) {
    let q = A.replace(/\s+/g, " ").trim();
    return jq(q, M$z)
}
// @from(Ln 461773, Col 0)
async function X$z(A, q) {
    let {
        getBridgeSession: K
    } = await Promise.resolve().then(() => (wN6(), dn6));
    return (await K(A, {
        baseUrl: q
    }))?.title || void 0
}
// @from(Ln 461781, Col 0)
async function P$z(A) {
    let q = QVq(A);
    if (q.help) {
        await J$z();
        return
    }
    if (q.error) console.error(`Error: ${q.error}`), process.exit(1);
    let {
        verbose: K,
        sandbox: Y,
        debugFile: z,
        sessionTimeoutMs: _,
        permissionMode: w,
        name: O,
        spawnMode: $,
        capacity: H,
        createSessionInDir: j,
        sessionId: J,
        continueSession: M
    } = q, D = J, X, P = await BVq();
    if (($ !== void 0 || H !== void 0 || j !== void 0) && !P) console.error("Error: Multi-session Remote Control is not enabled for your account yet."), process.exit(1);
    if (w !== void 0) {
        let {
            PERMISSION_MODES: c6
        } = await Promise.resolve().then(() => (EC6(), K58)), K1 = c6;
        if (!K1.includes(w)) console.error(`Error: Invalid permission mode '${w}'. Valid modes: ${K1.join(", ")}`), process.exit(1)
    }
    let Z = co8("."),
        {
            enableConfigs: G,
            checkHasTrustDialogAccepted: f
        } = await Promise.resolve().then(() => (k8(), Vo6));
    G();
    let {
        initializeErrorLogSink: v
    } = await Promise.resolve().then(() => (WC1(), do8)), {
        initializeAnalyticsSink: N
    } = await Promise.resolve().then(() => (Lo6(), _Vq));
    v(), N();
    let {
        setOriginalCwd: V,
        setCwdState: L
    } = await Promise.resolve().then(() => (T1(), qm1));
    if (V(Z), L(Z), !f()) console.error(`Error: Workspace not trusted. Please run \`claude\` in ${Z} first to review and accept the workspace trust dialog.`), process.exit(1);
    let {
        getClaudeAIOAuthTokens: h,
        clearOAuthTokenCache: R,
        checkAndRefreshOAuthTokenIfNeeded: u
    } = await Promise.resolve().then(() => (fA(), S16)), {
        getOauthConfig: I
    } = await Promise.resolve().then(() => (F5(), q$6)), g = () => h()?.accessToken;
    if (!g()) console.error(gl8), process.exit(1);
    let {
        getGlobalConfig: b,
        saveGlobalConfig: p,
        getCurrentProjectConfig: Q,
        saveCurrentProjectConfig: U
    } = await Promise.resolve().then(() => (k8(), Vo6));
    if (!b().remoteDialogSeen) {
        let K1 = (await import("readline")).createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(`
Remote Control lets you access this CLI session from the web (claude.ai/code)
or the Claude app, so you can pick up where you left off on any device.

You can disconnect remote access anytime by running /remote-control again.
`);
        let j6 = await new Promise((W6) => {
            K1.question("Enable Remote Control? (y/n) ", W6)
        });
        if (K1.close(), p((W6) => {
                if (W6.remoteDialogSeen) return W6;
                return {
                    ...W6,
                    remoteDialogSeen: !0
                }
            }), j6.toLowerCase() !== "y" && j6.toLowerCase() !== "yes") process.exit(0)
    }
    let r = I().BASE_API_URL;
    if (r.startsWith("http://") && !r.includes("localhost") && !r.includes("127.0.0.1")) console.error("Error: Remote Control base URL uses HTTP. Only HTTPS or localhost HTTP is allowed."), process.exit(1);
    let e = r,
        {
            getBranch: Y6,
            getRemoteUrl: H6,
            findGitRoot: J6
        } = await Promise.resolve().then(() => ($5(), h58)),
        {
            hasWorktreeCreateHook: K6
        } = await Promise.resolve().then(() => (hw(), PR8)),
        s = K6() || J6(Z) !== null,
        X6 = P ? Q().remoteControlSpawnMode : void 0;
    if (X6 === "worktree" && !s) console.error("Warning: Saved spawn mode is worktree but this directory is not a git repository. Falling back to same-dir."), X6 = void 0, U((c6) => {
        if (c6.remoteControlSpawnMode === void 0) return c6;
        return {
            ...c6,
            remoteControlSpawnMode: void 0
        }
    });
    if (P && !X6 && s && $ === void 0 && !D && process.stdin.isTTY) {
        let K1 = (await import("readline")).createInterface({
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
        let j6 = await new Promise((n6) => {
            K1.question("Choose [1/2] (default: 1): ", n6)
        });
        K1.close();
        let W6 = j6.trim() === "2" ? "worktree" : "same-dir";
        X6 = W6, U((n6) => {
            if (n6.remoteControlSpawnMode === W6) return n6;
            return {
                ...n6,
                remoteControlSpawnMode: W6
            }
        })
    }
    let z6 = D ? "single-session" : $ ?? X6 ?? (P ? "same-dir" : "single-session"),
        N6 = z6 === "single-session" ? 1 : H ?? mVq,
        $6 = j ?? !0;
    if (!D) {
        let {
            clearBridgePointer: c6
        } = await Promise.resolve().then(() => (Co6(), So6));
        await c6(Z)
    }
    if (z6 === "worktree" && !s) console.error("Error: Worktree mode requires a git repository or WorktreeCreate hooks configured. Use --spawn=session for single-session mode."), process.exit(1);
    let n = await Y6(),
        o = await H6(),
        a = tOz(),
        i = xVq(),
        {
            handleOAuth401Error: l
        } = await Promise.resolve().then(() => (fA(), S16)),
        q6 = Kh1({
            baseUrl: r,
            getAccessToken: g,
            runnerVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION,
            onDebug: k,
            onAuth401: l
        }),
        w6, O6 = {
            dir: Z,
            machineName: a,
            branch: n,
            gitRepoUrl: o,
            maxSessions: N6,
            spawnMode: z6,
            verbose: K,
            sandbox: Y,
            bridgeId: i,
            workerType: "claude_code",
            environmentId: xVq(),
            reuseEnvironmentId: w6,
            apiBaseUrl: r,
            sessionIngressUrl: e,
            debugFile: z,
            sessionTimeoutMs: _
        };
    k(`[bridge:init] bridgeId=${i}${w6?` reuseEnvironmentId=${w6}`:""} dir=${Z} branch=${n} gitRepoUrl=${o} machine=${a}`), k(`[bridge:init] apiBaseUrl=${r} sessionIngressUrl=${e}`), k(`[bridge:init] sandbox=${Y}${z?` debugFile=${z}`:""}`);
    let L6, y6;
    try {
        let c6 = await q6.registerBridgeEnvironment(O6);
        L6 = c6.environment_id, y6 = c6.environment_secret
    } catch (c6) {
        d("tengu_bridge_registration_failed", {
            status: c6 instanceof cZ ? c6.status : void 0
        }), console.error(c6 instanceof cZ && c6.status === 404 ? "Remote Control environments are not available for your account." : `Error: ${_1(c6)}`), process.exit(1)
    }
    let G6;
    k(`[bridge:init] Registered, server environmentId=${L6}`);
    let R6 = IF();
    d("tengu_bridge_started", {
        max_sessions: O6.maxSessions,
        has_debug_file: !!O6.debugFile,
        sandbox: O6.sandbox,
        verbose: O6.verbose,
        heartbeat_interval_ms: R6.non_exclusive_heartbeat_interval_ms
    }), U1("info", "bridge_started", {
        max_sessions: O6.maxSessions,
        sandbox: O6.sandbox
    });
    let T6 = GVq({
            execPath: process.execPath,
            scriptArgs: z$z(),
            env: process.env,
            verbose: K,
            sandbox: Y,
            debugFile: z,
            permissionMode: w,
            onDebug: k,
            onActivity: (c6, K1) => {
                k(`[bridge:activity] sessionId=${c6} ${K1.type} ${K1.summary}`)
            },
            onPermissionRequest: (c6, K1, j6) => {
                k(`[bridge:perm] sessionId=${c6} tool=${K1.request.tool_name} request_id=${K1.request_id} (not auto-approving)`)
            }
        }),
        D6 = VVq({
            verbose: K
        }),
        {
            parseGitHubRepository: Q6
        } = await Promise.resolve().then(() => (yG(), gC6)),
        k6 = o ? Q6(o) : null,
        Z6 = k6 ? k6.split("/").pop() : A$z(Z);
    D6.setRepoInfo(Z6, n);
    let u6 = z6 !== "single-session" && s;
    if (u6) D6.setSpawnModeDisplay(z6);
    let C6 = (c6) => {
        if (c6[0] === 3 || c6[0] === 4) {
            process.emit("SIGINT");
            return
        }
        if (c6[0] === 32) {
            D6.toggleQr();
            return
        }
        if (c6[0] === 119) {
            if (!u6) return;
            let K1 = O6.spawnMode === "same-dir" ? "worktree" : "same-dir";
            O6.spawnMode = K1, D6.logStatus(K1 === "worktree" ? "Spawn mode: worktree (new sessions get isolated git worktrees)" : "Spawn mode: same-dir (new sessions share the current directory)"), D6.setSpawnModeDisplay(K1), D6.refreshDisplay(), U((j6) => {
                if (j6.remoteControlSpawnMode === K1) return j6;
                return {
                    ...j6,
                    remoteControlSpawnMode: K1
                }
            });
            return
        }
    };
    if (process.stdin.isTTY) process.stdin.setRawMode(!0), process.stdin.resume(), process.stdin.on("data", C6);
    let o6 = new AbortController,
        V6 = () => {
            k("[bridge:shutdown] SIGINT received, shutting down"), o6.abort()
        },
        b6 = () => {
            k("[bridge:shutdown] SIGTERM received, shutting down"), o6.abort()
        };
    process.on("SIGINT", V6), process.on("SIGTERM", b6);
    let E6 = null;
    if ($6) {
        let {
            createBridgeSession: c6
        } = await Promise.resolve().then(() => (wN6(), dn6));
        try {
            if (E6 = await c6({
                    environmentId: L6,
                    title: O,
                    events: [],
                    gitRepoUrl: o,
                    branch: n,
                    signal: o6.signal,
                    baseUrl: r,
                    getAccessToken: g,
                    permissionMode: w
                }), E6) k(`[bridge:init] Created initial session ${E6}`)
        } catch (K1) {
            k(`[bridge:init] Session creation failed (non-fatal): ${_1(K1)}`)
        }
    }
    let U6 = null;
    if (E6 && z6 === "single-session") {
        let {
            writeBridgePointer: c6
        } = await Promise.resolve().then(() => (Co6(), So6)), K1 = {
            sessionId: E6,
            environmentId: L6,
            source: "standalone"
        };
        await c6(O6.dir, K1), U6 = setInterval(c6, 3600000, O6.dir, K1), U6.unref?.()
    }
    try {
        await gVq(O6, L6, y6, q6, T6, D6, o6.signal, void 0, E6 ?? void 0, async () => {
            return R(), await u(), g()
        })
    } finally {
        if (U6 !== null) clearInterval(U6);
        if (process.off("SIGINT", V6), process.off("SIGTERM", b6), process.stdin.off("data", C6), process.stdin.isTTY) process.stdin.setRawMode(!1);
        process.stdin.pause()
    }
    process.exit(0)
}
// @from(Ln 462081, Col 4)
K$z
// @from(Ln 462081, Col 9)
Y$z = 1000
// @from(Ln 462082, Col 4)
mVq = 32
// @from(Ln 462083, Col 4)
w$z
// @from(Ln 462083, Col 9)
$$z
// @from(Ln 462083, Col 14)
M$z = 80
// @from(Ln 462084, Col 4)
no8 = E(() => {
    V1();
    HA();
    YC1();
    H1();
    u_();
    k1();
    Wr6();
    fVq();
    kVq();
    _86();
    M4();
    Xr6();
    DC1();
    hVq();
    jN();
    s8();
    A8();
    K$z = {
        connInitialMs: 2000,
        connCapMs: 120000,
        connGiveUpMs: 600000,
        generalInitialMs: 500,
        generalCapMs: 30000,
        generalGiveUpMs: 600000
    };
    w$z = new Set(["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENETUNREACH", "EHOSTUNREACH"]);
    $$z = ["session", "same-dir", "worktree"]
})
// @from(Ln 462114, Col 0)
function uo6(A) {
    if (!A || !process.env.ANTHROPIC_UNIX_SOCKET) return A || {};
    let {
        ANTHROPIC_UNIX_SOCKET: q,
        ANTHROPIC_BASE_URL: K,
        ANTHROPIC_API_KEY: Y,
        ANTHROPIC_AUTH_TOKEN: z,
        CLAUDE_CODE_OAUTH_TOKEN: _,
        ...w
    } = A;
    return w
}
// @from(Ln 462127, Col 0)
function UVq() {
    Object.assign(process.env, uo6(X1().env));
    for (let q of W$z) {
        if (!SH(q)) continue;
        Object.assign(process.env, uo6(L8(q)?.env))
    }
    let A = uo6(PA()?.env);
    for (let [q, K] of Object.entries(A))
        if (YG6.has(q.toUpperCase())) process.env[q] = K
}
// @from(Ln 462138, Col 0)
function bF() {
    Object.assign(process.env, uo6(X1().env)), Object.assign(process.env, uo6(PA()?.env)), CmA(), ImA(), LtA(), BK1()
}
// @from(Ln 462141, Col 4)
W$z
// @from(Ln 462142, Col 4)
qV6 = E(() => {
    k8();
    dV();
    i8();
    O2();
    uG1();
    hh6();
    Mu();
    W$z = ["userSettings", "flagSettings", "policySettings"]
})
// @from(Ln 462153, Col 0)
function dVq() {
    if (process.env.NODE_EXTRA_CA_CERTS) return;
    let A = Z$z();
    if (A) process.env.NODE_EXTRA_CA_CERTS = A, k(`CA certs: Applied NODE_EXTRA_CA_CERTS from config to process.env: ${A}`)
}
// @from(Ln 462159, Col 0)
function Z$z() {
    try {
        let q = X1()?.env,
            Y = L8("userSettings")?.env;
        k(`CA certs: Config fallback - globalEnv keys: ${q?Object.keys(q).join(","):"none"}, settingsEnv keys: ${Y?Object.keys(Y).join(","):"none"}`);
        let z = Y?.NODE_EXTRA_CA_CERTS || q?.NODE_EXTRA_CA_CERTS;
        if (z) k(`CA certs: Found NODE_EXTRA_CA_CERTS in config/settings: ${z}`);
        return z
    } catch (A) {
        k(`CA certs: Config fallback failed: ${A}`, {
            level: "error"
        });
        return
    }
}
// @from(Ln 462174, Col 4)
cVq = E(() => {
    H1();
    k8();
    i8()
})
// @from(Ln 462179, Col 4)
lVq = {}
// @from(Ln 462184, Col 0)
function G$z(A) {
    let q = A6(19),
        {
            filePath: K,
            errorDescription: Y,
            onExit: z,
            onReset: _
        } = A,
        w;
    if (q[0] !== z || q[1] !== _) w = (P) => {
        if (P === "exit") z();
        else _()
    }, q[0] = z, q[1] = _, q[2] = w;
    else w = q[2];
    let O = w,
        $;
    if (q[3] !== K) $ = gh.default.createElement(T, null, "The configuration file at ", gh.default.createElement(T, {
        bold: !0
    }, K), " contains invalid JSON."), q[3] = K, q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== Y) H = gh.default.createElement(T, null, Y), q[5] = Y, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== $ || q[8] !== H) j = gh.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, $, H), q[7] = $, q[8] = H, q[9] = j;
    else j = q[9];
    let J;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) J = gh.default.createElement(T, {
        bold: !0
    }, "Choose an option:"), q[10] = J;
    else J = q[10];
    let M;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) M = [{
        label: "Exit and fix manually",
        value: "exit"
    }, {
        label: "Reset with default configuration",
        value: "reset"
    }], q[11] = M;
    else M = q[11];
    let D;
    if (q[12] !== O || q[13] !== z) D = gh.default.createElement(m, {
        flexDirection: "column"
    }, J, gh.default.createElement(T8, {
        options: M,
        onChange: O,
        onCancel: z
    })), q[12] = O, q[13] = z, q[14] = D;
    else D = q[14];
    let X;
    if (q[15] !== z || q[16] !== j || q[17] !== D) X = gh.default.createElement(m8, {
        title: "Configuration Error",
        color: "error",
        onCancel: z
    }, j, D), q[15] = z, q[16] = j, q[17] = D, q[18] = X;
    else X = q[18];
    return X
}
// @from(Ln 462245, Col 0)
async function T$z({
    error: A
}) {
    let q = {
        ...xc(!1),
        theme: f$z
    };
    await new Promise(async (K) => {
        let {
            unmount: Y
        } = await BC(gh.default.createElement(Yj, null, gh.default.createElement(aj, null, gh.default.createElement(G$z, {
            filePath: A.filePath,
            errorDescription: A.message,
            onExit: () => {
                Y(), K(), process.exit(1)
            },
            onReset: () => {
                fz(A.filePath, B6(A.defaultConfig, null, 2), {
                    flush: !1,
                    encoding: "utf8"
                }), Y(), K(), process.exit(0)
            }
        }))), q)
    })
}
// @from(Ln 462270, Col 4)
gh
// @from(Ln 462270, Col 8)
f$z = "dark"
// @from(Ln 462271, Col 4)
iVq = E(() => {
    e6();
    i6();
    o9();
    i6();
    g1();
    NA();
    Mg();
    g1();
    VU6();
    wq();
    gh = t(P6(), 1)
})
// @from(Ln 462285, Col 0)
function ZC1() {
    if (kR8()) {
        if (q7() && a$()) ro8().catch((A) => {
            k(`[3P telemetry] Eager telemetry init failed (beta tracing): ${_1(A)}`, {
                level: "error"
            })
        });
        k("[3P telemetry] Waiting for remote managed settings before telemetry init"), FG1().then(async () => {
            k("[3P telemetry] Remote managed settings loaded, initializing telemetry"), bF(), await ro8()
        }).catch((A) => {
            k(`[3P telemetry] Telemetry init failed (remote settings path): ${_1(A)}`, {
                level: "error"
            })
        })
    } else ro8().catch((A) => {
        k(`[3P telemetry] Telemetry init failed: ${_1(A)}`, {
            level: "error"
        })
    })
}
// @from(Ln 462305, Col 0)
async function ro8() {
    if (nVq) return;
    nVq = !0, await v$z()
}
// @from(Ln 462309, Col 0)
async function v$z() {
    let {
        initializeTelemetry: A
    } = await Promise.resolve().then(() => (Gb8(), Zb8)), q = await A();
    if (q) Xu1(q, (Y, z) => {
        let _ = q?.createCounter(Y, z);
        return {
            add(w, O = {}) {
                let H = {
                    ...mW6(),
                    ...O
                };
                _?.add(w, H)
            }
        }
    }), Pu1()?.add(1)
}
// @from(Ln 462326, Col 4)
nVq = !1
// @from(Ln 462327, Col 4)
rVq