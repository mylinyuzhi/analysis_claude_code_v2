
// @from(Ln 510913, Col 0)
function evz(A) {
    let q = A6(8),
        {
            command: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = [], q[0] = Y;
    else Y = q[0];
    Mz.default.useEffect(ANz, Y);
    let z;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) z = Mz.default.createElement(T, null, "This conversation is from a different directory."), q[1] = z;
    else z = q[1];
    let _;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) _ = Mz.default.createElement(T, null, "To resume, run:"), q[2] = _;
    else _ = q[2];
    let w;
    if (q[3] !== K) w = Mz.default.createElement(m, {
        flexDirection: "column"
    }, _, Mz.default.createElement(T, null, " ", K)), q[3] = K, q[4] = w;
    else w = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = Mz.default.createElement(T, {
        dimColor: !0
    }, "(Command copied to clipboard)"), q[5] = O;
    else O = q[5];
    let $;
    if (q[6] !== w) $ = Mz.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, z, w, O), q[6] = w, q[7] = $;
    else $ = q[7];
    return $
}
// @from(Ln 510947, Col 0)
function ANz() {
    let A = setTimeout(qNz, 100);
    return () => clearTimeout(A)
}
// @from(Ln 510952, Col 0)
function qNz() {
    process.exit(0)
}
// @from(Ln 510955, Col 4)
Mz
// @from(Ln 510956, Col 4)
YFq = E(() => {
    e6();
    i6();
    _7();
    LO();
    at8();
    gc8();
    k1();
    V1();
    JA();
    Oq();
    Uc8();
    Mz6();
    if6();
    _q();
    vc();
    Fc8();
    T1();
    Oq();
    Uo6();
    $k();
    NA();
    io6();
    Mz = t(P6(), 1)
})
// @from(Ln 510982, Col 0)
function zFq(A) {
    let q = A6(33),
        {
            servers: K,
            scope: Y,
            onDone: z
        } = A,
        _;
    if (q[0] !== K) _ = Object.keys(K), q[0] = K, q[1] = _;
    else _ = q[1];
    let w = _,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = {}, q[2] = O;
    else O = q[2];
    let [$, H] = Eb1.useState(O), j, J;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) j = () => {
        Je().then((B) => {
            let {
                servers: b
            } = B;
            return H(b)
        })
    }, J = [], q[3] = j, q[4] = J;
    else j = q[3], J = q[4];
    Eb1.useEffect(j, J);
    let M;
    if (q[5] !== $ || q[6] !== w) M = w.filter((B) => $[B] !== void 0), q[5] = $, q[6] = w, q[7] = M;
    else M = q[7];
    let D = M,
        X = async function(b) {
            let p = 0;
            for (let Q of b) {
                let U = K[Q];
                if (U) {
                    let r = Q;
                    if ($[r] !== void 0) {
                        let e = 1;
                        while ($[`${Q}_${e}`] !== void 0) e++;
                        r = `${Q}_${e}`
                    }
                    await je(r, U, Y), p++
                }
            }
            Z(p)
        }, [P] = z7(), W;
    if (q[8] !== z || q[9] !== Y || q[10] !== P) W = (B) => {
        if (B > 0) Z4(`
${kA("success",P)(`Successfully imported ${B} MCP server${B!==1?"s":""} to ${Y} config.`)}
`);
        else Z4(`
No servers were imported.`);
        z(), Vq()
    }, q[8] = z, q[9] = Y, q[10] = P, q[11] = W;
    else W = q[11];
    let Z = W,
        G;
    if (q[12] !== Z) G = () => {
        Z(0)
    }, q[12] = Z, q[13] = G;
    else G = q[13];
    let f = G,
        v = `Found ${w.length} MCP server${w.length!==1?"s":""} in Claude Desktop.`,
        N;
    if (q[14] !== D.length) N = D.length > 0 && UE.default.createElement(T, {
        color: "warning"
    }, "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix."), q[14] = D.length, q[15] = N;
    else N = q[15];
    let V;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) V = UE.default.createElement(T, null, "Please select the servers you want to import:"), q[16] = V;
    else V = q[16];
    let L, h;
    if (q[17] !== D || q[18] !== w) L = w.map((B) => ({
        label: `${B}${D.includes(B)?" (already exists)":""}`,
        value: B
    })), h = w.filter((B) => !D.includes(B)), q[17] = D, q[18] = w, q[19] = L, q[20] = h;
    else L = q[19], h = q[20];
    let R;
    if (q[21] !== X || q[22] !== L || q[23] !== h) R = UE.default.createElement(bv6, {
        options: L,
        defaultValue: h,
        onSubmit: X
    }), q[21] = X, q[22] = L, q[23] = h, q[24] = R;
    else R = q[24];
    let u;
    if (q[25] !== f || q[26] !== R || q[27] !== v || q[28] !== N) u = UE.default.createElement(m8, {
        title: "Import MCP Servers from Claude Desktop",
        subtitle: v,
        color: "success",
        onCancel: f,
        hideInputGuide: !0
    }, N, V, R), q[25] = f, q[26] = R, q[27] = v, q[28] = N, q[29] = u;
    else u = q[29];
    let I;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) I = UE.default.createElement(m, {
        paddingX: 1
    }, UE.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, UE.default.createElement(C8, null, UE.default.createElement(a1, {
        shortcut: "Space",
        action: "select"
    }), UE.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), UE.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))), q[30] = I;
    else I = q[30];
    let g;
    if (q[31] !== u) g = UE.default.createElement(UE.default.Fragment, null, u, I), q[31] = u, q[32] = g;
    else g = q[32];
    return g
}
// @from(Ln 511098, Col 4)
UE
// @from(Ln 511098, Col 8)
Eb1
// @from(Ln 511099, Col 4)
_Fq = E(() => {
    e6();
    i6();
    KL1();
    WZ();
    c_();
    wq();
    Lq();
    OK();
    Xq();
    UE = t(P6(), 1), Eb1 = t(P6(), 1)
})
// @from(Ln 511111, Col 4)
OFq = {}
// @from(Ln 511115, Col 0)
async function KNz(A, q, K) {
    let z = yd(100);
    VO(A);
    let _ = new _L6({
        name: "claude/tengu",
        version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION
    }, {
        capabilities: {
            tools: {}
        }
    });
    _.setRequestHandler(Oy6, async () => {
        let O = xM(),
            $ = FX(O);
        return {
            tools: await Promise.all($.map(async (H) => {
                let j;
                if (H.outputSchema) {
                    let J = fU(H.outputSchema);
                    if (typeof J === "object" && J !== null && "type" in J && J.type === "object") j = J
                }
                return {
                    ...H,
                    description: await H.prompt({
                        getToolPermissionContext: async () => O,
                        tools: $,
                        agents: []
                    }),
                    inputSchema: fU(H.inputSchema),
                    outputSchema: j
                }
            }))
        }
    }), _.setRequestHandler(GA6, async ({
        params: {
            name: O,
            arguments: $
        }
    }) => {
        let H = xM(),
            j = FX(H),
            J = dK(j, O);
        if (!J) throw Error(`Tool ${O} not found`);
        try {
            if (!J.isEnabled()) throw Error(`Tool ${O} is not enabled`);
            let M = cK(),
                D = await J.validateInput?.($ ?? {}, {
                    abortController: sK(),
                    options: {
                        commands: wFq,
                        tools: j,
                        mainLoopModel: M,
                        thinkingConfig: {
                            type: "disabled"
                        },
                        mcpClients: [],
                        mcpResources: {},
                        isNonInteractiveSession: !0,
                        debug: q,
                        verbose: K,
                        agentDefinitions: {
                            activeAgents: [],
                            allAgents: []
                        }
                    },
                    getAppState: () => z16(),
                    setAppState: () => {},
                    messages: [],
                    readFileState: z,
                    setInProgressToolUseIDs: () => {},
                    setResponseLength: () => {},
                    updateFileHistoryState: () => {},
                    updateAttributionState: () => {}
                });
            if (D && !D.result) throw Error(`Tool ${O} input is invalid: ${D.message}`);
            let X = await J.call($ ?? {}, {
                abortController: sK(),
                options: {
                    commands: wFq,
                    tools: j,
                    mainLoopModel: cK(),
                    thinkingConfig: {
                        type: "disabled"
                    },
                    mcpClients: [],
                    mcpResources: {},
                    isNonInteractiveSession: !0,
                    debug: q,
                    verbose: K,
                    agentDefinitions: {
                        activeAgents: [],
                        allAgents: []
                    }
                },
                getAppState: () => z16(),
                setAppState: () => {},
                messages: [],
                readFileState: z,
                setInProgressToolUseIDs: () => {},
                setResponseLength: () => {},
                updateFileHistoryState: () => {},
                updateAttributionState: () => {}
            }, tJ, $Z({
                content: []
            }));
            return {
                content: [{
                    type: "text",
                    text: typeof X === "string" ? X : B6(X.data)
                }]
            }
        } catch (M) {
            return _6(M), {
                isError: !0,
                content: [{
                    type: "text",
                    text: (M instanceof Error ? kF8(M) : [String(M)]).filter(Boolean).join(`
`).trim() || "Error"
                }]
            }
        }
    });
    async function w() {
        let O = new Xy6;
        await _.connect(O)
    }
    return await w()
}
// @from(Ln 511250, Col 4)
wFq
// @from(Ln 511251, Col 4)
$Fq = E(() => {
    Md1();
    DQ1();
    hD();
    g21();
    Bj();
    WR();
    z4();
    k1();
    tP();
    XE1();
    lc8();
    JA();
    IX();
    U$();
    cT6();
    g1();
    wFq = [kR1]
})
// @from(Ln 511270, Col 4)
MFq = {}
// @from(Ln 511282, Col 0)
async function JFq() {
    let A = y8();
    if (!Sl1.includes(A)) throw Error(`Unsupported platform: ${A} - Claude Desktop integration only works on macOS and WSL.`);
    if (A === "macos") return tt8.join(jFq.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
    let q = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
    if (q) {
        let Y = `/mnt/c${q.replace(/^[A-Z]:/,"")}/AppData/Roaming/Claude/claude_desktop_config.json`;
        try {
            return await HFq(Y), Y
        } catch {}
    }
    try {
        try {
            let Y = await zNz("/mnt/c/Users", {
                withFileTypes: !0
            });
            for (let z of Y) {
                if (z.name === "Public" || z.name === "Default" || z.name === "Default User" || z.name === "All Users") continue;
                let _ = tt8.join("/mnt/c/Users", z.name, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
                try {
                    return await HFq(_), _
                } catch {}
            }
        } catch {}
    } catch (K) {
        _6(K)
    }
    throw Error("Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.")
}
// @from(Ln 511311, Col 0)
async function _Nz() {
    if (!Sl1.includes(y8())) throw Error("Unsupported platform - Claude Desktop integration only works on macOS and WSL.");
    try {
        let A = await JFq(),
            q;
        try {
            q = await YNz(A, {
                encoding: "utf8"
            })
        } catch (_) {
            if (_.code === "ENOENT") return {};
            throw _
        }
        let K = WK(q);
        if (!K || typeof K !== "object") return {};
        let Y = K.mcpServers;
        if (!Y || typeof Y !== "object") return {};
        let z = {};
        for (let [_, w] of Object.entries(Y)) {
            if (!w || typeof w !== "object") continue;
            let O = X58().safeParse(w);
            if (O.success) z[_] = O.data
        }
        return z
    } catch (A) {
        return _6(A), {}
    }
}
// @from(Ln 511339, Col 4)
DFq = E(() => {
    K_();
    k1();
    b46();
    YK()
})
// @from(Ln 511345, Col 4)
G86 = {}
// @from(Ln 511361, Col 0)
async function XFq(A, q) {
    try {
        let K = await zh(A, q);
        if (K.type === "connected") return "✓ Connected";
        else if (K.type === "needs-auth") return "! Needs authentication";
        else return "✗ Failed to connect"
    } catch (K) {
        return "✗ Connection error"
    }
}
// @from(Ln 511371, Col 0)
async function $Nz({
    debug: A,
    verbose: q
}) {
    let K = wNz();
    d("tengu_mcp_start", {});
    try {
        await ONz(K)
    } catch {
        console.error(`Error: Directory ${K} does not exist`), process.exit(1)
    }
    try {
        let {
            setup: Y
        } = await Promise.resolve().then(() => (nC1(), iC1));
        await Y(K, "default", !1, !1, void 0, !1);
        let {
            startMCPServer: z
        } = await Promise.resolve().then(() => ($Fq(), OFq));
        await z(K, A ?? !1, q ?? !1)
    } catch (Y) {
        console.error("Error: Failed to start MCP server:", Y), process.exit(1)
    }
}
// @from(Ln 511395, Col 0)
async function HNz(A, q) {
    let K = cv(A),
        Y = () => {
            if (K && (K.type === "sse" || K.type === "http")) XL1(A, K), x2q(A, K)
        };
    try {
        if (q.scope) {
            let H = wZ6(q.scope);
            d("tengu_mcp_delete", {
                name: A,
                scope: H
            }), await fE8(A, H), Y(), process.stdout.write(`Removed MCP server ${A} from ${H} config
`), process.stdout.write(`File modified: ${PZ(H)}
`), process.exit(0)
        }
        let z = d2(),
            _ = X1(),
            {
                servers: w
            } = dj("project"),
            O = !!w[A],
            $ = [];
        if (z.mcpServers?.[A]) $.push("local");
        if (O) $.push("project");
        if (_.mcpServers?.[A]) $.push("user");
        if ($.length === 0) process.stderr.write(`No MCP server found with name: "${A}"
`), process.exit(1);
        else if ($.length === 1) {
            let H = $[0];
            d("tengu_mcp_delete", {
                name: A,
                scope: H
            }), await fE8(A, H), Y(), process.stdout.write(`Removed MCP server "${A}" from ${H} config
`), process.stdout.write(`File modified: ${PZ(H)}
`), process.exit(0)
        } else process.stderr.write(`MCP server "${A}" exists in multiple scopes:
`), $.forEach((H) => {
            process.stderr.write(`  - ${OQ6(H)} (${PZ(H)})
`)
        }), process.stderr.write(`
To remove from a specific scope, use:
`), $.forEach((H) => {
            process.stderr.write(`  claude mcp remove "${A}" -s ${H}
`)
        }), process.exit(1)
    } catch (z) {
        process.stderr.write(`${z.message}
`), process.exit(1)
    }
}
// @from(Ln 511445, Col 0)
async function jNz() {
    d("tengu_mcp_list", {});
    let {
        servers: A
    } = await Je();
    if (Object.keys(A).length === 0) console.log("No MCP servers configured. Use `claude mcp add` to add a server.");
    else {
        console.log(`Checking MCP server health...
`);
        let q = Object.entries(A),
            K = await Ux6(q, async ([Y, z]) => ({
                name: Y,
                server: z,
                status: await XFq(Y, z)
            }), {
                concurrency: Yn8()
            });
        for (let {
                name: Y,
                server: z,
                status: _
            }
            of K)
            if (z.type === "sse") console.log(`${Y}: ${z.url} (SSE) - ${_}`);
            else if (z.type === "http") console.log(`${Y}: ${z.url} (HTTP) - ${_}`);
        else if (z.type === "claudeai-proxy") console.log(`${Y}: ${z.url} - ${_}`);
        else if (!z.type || z.type === "stdio") {
            let w = Array.isArray(z.args) ? z.args : [];
            console.log(`${Y}: ${z.command} ${w.join(" ")} - ${_}`)
        }
    }
    await Vq(0)
}
// @from(Ln 511478, Col 0)
async function JNz(A) {
    d("tengu_mcp_get", {
        name: A
    });
    let q = cv(A);
    if (!q) console.error(`No MCP server found with name: ${A}`), process.exit(1);
    console.log(`${A}:`), console.log(`  Scope: ${OQ6(q.scope)}`);
    let K = await XFq(A, q);
    if (console.log(`  Status: ${K}`), q.type === "sse") {
        if (console.log("  Type: sse"), console.log(`  URL: ${q.url}`), q.headers) {
            console.log("  Headers:");
            for (let [Y, z] of Object.entries(q.headers)) console.log(`    ${Y}: ${z}`)
        }
        if (q.oauth?.clientId || q.oauth?.callbackPort) {
            let Y = [];
            if (q.oauth.clientId) {
                if (Y.push("client_id configured"), FU8(A, q)?.clientSecret) Y.push("client_secret configured")
            }
            if (q.oauth.callbackPort) Y.push(`callback_port ${q.oauth.callbackPort}`);
            console.log(`  OAuth: ${Y.join(", ")}`)
        }
    } else if (q.type === "http") {
        if (console.log("  Type: http"), console.log(`  URL: ${q.url}`), q.headers) {
            console.log("  Headers:");
            for (let [Y, z] of Object.entries(q.headers)) console.log(`    ${Y}: ${z}`)
        }
        if (q.oauth?.clientId || q.oauth?.callbackPort) {
            let Y = [];
            if (q.oauth.clientId) {
                if (Y.push("client_id configured"), FU8(A, q)?.clientSecret) Y.push("client_secret configured")
            }
            if (q.oauth.callbackPort) Y.push(`callback_port ${q.oauth.callbackPort}`);
            console.log(`  OAuth: ${Y.join(", ")}`)
        }
    } else if (q.type === "stdio") {
        console.log("  Type: stdio"), console.log(`  Command: ${q.command}`);
        let Y = Array.isArray(q.args) ? q.args : [];
        if (console.log(`  Args: ${Y.join(" ")}`), q.env) {
            console.log("  Environment:");
            for (let [z, _] of Object.entries(q.env)) console.log(`    ${z}=${_}`)
        }
    }
    console.log(`
To remove this server, run: claude mcp remove "${A}" -s ${q.scope}`), await Vq(0)
}
// @from(Ln 511523, Col 0)
async function MNz(A, q, K) {
    try {
        let Y = wZ6(K.scope),
            z = WK(q),
            w = K.clientSecret && z && typeof z === "object" && "type" in z && (z.type === "sse" || z.type === "http") && "url" in z && typeof z.url === "string" && "oauth" in z && z.oauth && typeof z.oauth === "object" && "clientId" in z.oauth ? await vn6() : void 0;
        await je(A, z, Y);
        let O = z && typeof z === "object" && "type" in z ? String(z.type || "stdio") : "stdio";
        if (w && z && typeof z === "object" && "type" in z && (z.type === "sse" || z.type === "http") && "url" in z && typeof z.url === "string") Nn6(A, {
            type: z.type,
            url: z.url
        }, w);
        d("tengu_mcp_add", {
            scope: Y,
            source: "json",
            type: O
        }), console.log(`Added ${O} MCP server ${A} to ${Y} config`), process.exit(0)
    } catch (Y) {
        console.error(Y.message), process.exit(1)
    }
}
// @from(Ln 511543, Col 0)
async function DNz(A) {
    try {
        let q = wZ6(A.scope),
            K = y8();
        d("tengu_mcp_add", {
            scope: q,
            platform: K,
            source: "desktop"
        });
        let {
            readClaudeDesktopMcpServers: Y
        } = await Promise.resolve().then(() => (DFq(), MFq)), z = await Y();
        if (Object.keys(z).length === 0) console.log("No MCP servers found in Claude Desktop configuration or configuration file does not exist."), process.exit(0);
        let {
            unmount: _
        } = await BC(yb1.default.createElement(Yj, null, yb1.default.createElement(aj, null, yb1.default.createElement(zFq, {
            servers: z,
            scope: q,
            onDone: () => {
                _()
            }
        }))), {
            exitOnCtrlC: !0
        })
    } catch (q) {
        console.error(q.message), process.exit(1)
    }
}
// @from(Ln 511571, Col 0)
async function XNz() {
    d("tengu_mcp_reset_mcpjson_choices", {}), c2((A) => ({
        ...A,
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        enableAllProjectMcpServers: !1
    })), console.log("All project-scoped (.mcp.json) server approvals and rejections have been reset."), console.log("You will be prompted for approval next time you start Claude Code."), process.exit(0)
}
// @from(Ln 511579, Col 4)
yb1
// @from(Ln 511580, Col 4)
f86 = E(() => {
    RO8();
    i6();
    NA();
    Mg();
    _Fq();
    V1();
    WZ();
    qM();
    W16();
    QP();
    k8();
    YK();
    K_();
    c_();
    yb1 = t(P6(), 1)
})
// @from(Ln 511597, Col 4)
sh = {}
// @from(Ln 511615, Col 0)
function Ua6(A, q) {
    _6(A), console.error(`${a6.cross} Failed to ${q}: ${_1(A)}`), process.exit(1)
}
// @from(Ln 511618, Col 0)
async function PNz(A, q) {
    if (q.cowork) $V(!0);
    try {
        let K = await QL1(A);
        if (console.log(`Validating ${K.fileType} manifest: ${K.filePath}
`), K.errors.length > 0) console.log(`${a6.cross} Found ${K.errors.length} error${K.errors.length===1?"":"s"}:
`), K.errors.forEach((Y) => {
            console.log(`  ${a6.pointer} ${Y.path}: ${Y.message}`)
        }), console.log("");
        if (K.warnings.length > 0) console.log(`${a6.warning} Found ${K.warnings.length} warning${K.warnings.length===1?"":"s"}:
`), K.warnings.forEach((Y) => {
            console.log(`  ${a6.pointer} ${Y.path}: ${Y.message}`)
        }), console.log("");
        if (K.success) {
            if (K.warnings.length > 0) console.log(`${a6.tick} Validation passed with warnings`);
            else console.log(`${a6.tick} Validation passed`);
            process.exit(0)
        } else console.log(`${a6.cross} Validation failed`), process.exit(1)
    } catch (K) {
        _6(K), console.error(`${a6.cross} Unexpected error during validation: ${_1(K)}`), process.exit(2)
    }
}
// @from(Ln 511640, Col 0)
async function WNz(A) {
    if (A.cowork) $V(!0);
    d("tengu_plugin_list_command", {});
    let q = DZ(),
        {
            getPluginEditableScopes: K
        } = await Promise.resolve().then(() => (__6(), Jwq)),
        Y = K(),
        z = Object.keys(q.plugins),
        {
            enabled: _,
            disabled: w,
            errors: O
        } = await _z(),
        $ = [..._, ...w],
        H = $.filter((J) => J.source.endsWith("@inline")),
        j = O.filter((J) => J.source.endsWith("@inline") || J.source.startsWith("inline["));
    if (A.json) {
        let J = new Map($.map((D) => [D.source, D])),
            M = [];
        for (let D of z.sort()) {
            let X = q.plugins[D];
            if (!X || X.length === 0) continue;
            let P = n3(D).name,
                W = O.filter((Z) => Z.source === D || ("plugin" in Z) && Z.plugin === P).map(sM);
            for (let Z of X) {
                let G = J.get(D),
                    f;
                if (G) {
                    let v = G.mcpServers || await He(G);
                    if (v && Object.keys(v).length > 0) f = v
                }
                M.push({
                    id: D,
                    version: Z.version || "unknown",
                    scope: Z.scope,
                    enabled: Y.has(D),
                    installPath: Z.installPath,
                    installedAt: Z.installedAt,
                    lastUpdated: Z.lastUpdated,
                    projectPath: Z.projectPath,
                    mcpServers: f,
                    errors: W.length > 0 ? W : void 0
                })
            }
        }
        for (let D of H) {
            let X = D.mcpServers || await He(D),
                P = j.filter((W) => W.source === D.source || ("plugin" in W) && W.plugin === D.name).map(sM);
            M.push({
                id: D.source,
                version: D.manifest.version ?? "unknown",
                scope: "session",
                enabled: D.enabled !== !1,
                installPath: D.path,
                mcpServers: X && Object.keys(X).length > 0 ? X : void 0,
                errors: P.length > 0 ? P : void 0
            })
        }
        for (let D of j.filter((X) => X.source.startsWith("inline["))) M.push({
            id: D.source,
            version: "unknown",
            scope: "session",
            enabled: !1,
            installPath: "path" in D ? D.path : "",
            errors: [sM(D)]
        });
        if (A.available) {
            let D = [];
            try {
                let [X, P] = await Promise.all([C3(), cv6()]), {
                    marketplaces: W
                } = await mI(X);
                for (let {
                        name: Z,
                        data: G
                    }
                    of W)
                    if (G)
                        for (let f of G.plugins) {
                            let v = UB(f.name, Z);
                            if (!iB(v)) D.push({
                                pluginId: v,
                                name: f.name,
                                description: f.description,
                                marketplaceName: Z,
                                version: f.version,
                                source: f.source,
                                installCount: P?.get(v)
                            })
                        }
            } catch {}
            console.log(B6({
                installed: M,
                available: D
            }, null, 2))
        } else console.log(B6(M, null, 2));
        process.exit(0)
    }
    if (z.length === 0 && H.length === 0) {
        if (j.length === 0) console.log("No plugins installed. Use `claude plugin install` to install a plugin."), process.exit(0)
    }
    if (z.length > 0) console.log(`Installed plugins:
`);
    for (let J of z.sort()) {
        let M = q.plugins[J];
        if (!M || M.length === 0) continue;
        let D = n3(J).name,
            X = O.filter((P) => P.source === J || ("plugin" in P) && P.plugin === D);
        for (let P of M) {
            let W = Y.has(J),
                Z = X.length > 0 ? `${a6.cross} failed to load` : W ? `${a6.tick} enabled` : `${a6.cross} disabled`,
                G = P.version || "unknown",
                f = P.scope;
            console.log(`  ${a6.pointer} ${J}`), console.log(`    Version: ${G}`), console.log(`    Scope: ${f}`), console.log(`    Status: ${Z}`);
            for (let v of X) console.log(`    Error: ${sM(v)}`);
            console.log("")
        }
    }
    if (H.length > 0 || j.length > 0) {
        console.log(`Session-only plugins (--plugin-dir):
`);
        for (let J of H) {
            let M = j.filter((X) => X.source === J.source || ("plugin" in X) && X.plugin === J.name),
                D = M.length > 0 ? `${a6.cross} loaded with errors` : `${a6.tick} loaded`;
            console.log(`  ${a6.pointer} ${J.source}`), console.log(`    Version: ${J.manifest.version??"unknown"}`), console.log(`    Path: ${J.path}`), console.log(`    Status: ${D}`);
            for (let X of M) console.log(`    Error: ${sM(X)}`);
            console.log("")
        }
        for (let J of j.filter((M) => M.source.startsWith("inline["))) console.log(`  ${a6.pointer} ${J.source}: ${a6.cross} ${sM(J)}
`)
    }
    process.exit(0)
}
// @from(Ln 511774, Col 0)
async function ZNz(A, q) {
    if (q.cowork) $V(!0);
    try {
        let K = await yL1(A);
        if (!K) console.error(`${a6.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`), process.exit(1);
        if ("error" in K) console.error(`${a6.cross} ${K.error}`), process.exit(1);
        let Y = q.scope ?? "user";
        if (Y !== "user" && Y !== "project" && Y !== "local") console.error(`${a6.cross} Invalid scope '${Y}'. Use: user, project, or local`), process.exit(1);
        let z = cB(Y),
            _ = K;
        if (q.sparse && q.sparse.length > 0)
            if (_.source === "github" || _.source === "git") _ = {
                ..._,
                sparsePaths: q.sparse
            };
            else console.error(`${a6.cross} --sparse is only supported for github and git marketplace sources (got: ${_.source})`), process.exit(1);
        console.log("Adding marketplace...");
        let {
            name: w,
            alreadyMaterialized: O,
            resolvedSource: $
        } = await sB(_, (j) => {
            console.log(j)
        });
        rp6(w, {
            source: $
        }, z), HY();
        let H = _.source;
        if (_.source === "github") H = _.repo;
        d("tengu_marketplace_added", {
            source_type: H
        }), console.log(O ? `${a6.tick} Marketplace '${w}' already on disk — declared in ${Y} settings` : `${a6.tick} Successfully added marketplace: ${w} (declared in ${Y} settings)`), process.exit(0)
    } catch (K) {
        Ua6(K, "add marketplace")
    }
}
// @from(Ln 511810, Col 0)
async function GNz(A) {
    if (A.cowork) $V(!0);
    try {
        let q = await C3(),
            K = Object.keys(q);
        if (A.json) {
            let Y = K.sort().map((z) => {
                let _ = q[z],
                    w = _?.source;
                return {
                    name: z,
                    source: w?.source,
                    ...w?.source === "github" && {
                        repo: w.repo
                    },
                    ...w?.source === "git" && {
                        url: w.url
                    },
                    ...w?.source === "url" && {
                        url: w.url
                    },
                    ...w?.source === "directory" && {
                        path: w.path
                    },
                    ...w?.source === "file" && {
                        path: w.path
                    },
                    installLocation: _?.installLocation
                }
            });
            console.log(B6(Y, null, 2)), process.exit(0)
        }
        if (K.length === 0) console.log("No marketplaces configured"), process.exit(0);
        console.log(`Configured marketplaces:
`), K.forEach((Y) => {
            let z = q[Y];
            if (console.log(`  ${a6.pointer} ${Y}`), z?.source) {
                let _ = z.source;
                if (_.source === "github") console.log(`    Source: GitHub (${_.repo})`);
                else if (_.source === "git") console.log(`    Source: Git (${_.url})`);
                else if (_.source === "url") console.log(`    Source: URL (${_.url})`);
                else if (_.source === "directory") console.log(`    Source: Directory (${_.path})`);
                else if (_.source === "file") console.log(`    Source: File (${_.path})`)
            }
            console.log("")
        }), process.exit(0)
    } catch (q) {
        Ua6(q, "list marketplaces")
    }
}
// @from(Ln 511860, Col 0)
async function fNz(A, q) {
    if (q.cowork) $V(!0);
    try {
        await AZ6(A), HY(), d("tengu_marketplace_removed", {
            marketplace_name: A
        }), console.log(`${a6.tick} Successfully removed marketplace: ${A}`), process.exit(0)
    } catch (K) {
        Ua6(K, "remove marketplace")
    }
}
// @from(Ln 511870, Col 0)
async function TNz(A, q) {
    if (q.cowork) $V(!0);
    try {
        if (A) console.log(`Updating marketplace: ${A}...`), await we(A, (K) => {
            console.log(K)
        }), HY(), d("tengu_marketplace_updated", {
            marketplace_name: A
        }), console.log(`${a6.tick} Successfully updated marketplace: ${A}`), process.exit(0);
        else {
            let K = await C3(),
                Y = Object.keys(K);
            if (Y.length === 0) console.log("No marketplaces configured"), process.exit(0);
            console.log(`Updating ${Y.length} marketplace(s)...`), await H24(), HY(), d("tengu_marketplace_updated_all", {
                count: Y.length
            }), console.log(`${a6.tick} Successfully updated ${Y.length} marketplace(s)`), process.exit(0)
        }
    } catch (K) {
        Ua6(K, "update marketplace(s)")
    }
}
// @from(Ln 511890, Col 0)
async function vNz(A, q) {
    if (q.cowork) $V(!0);
    let K = q.scope || "user";
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (!i0.includes(K)) console.error(`Invalid scope: ${K}. Must be one of: ${i0.join(", ")}.`), process.exit(1);
    d("tengu_plugin_install_command", {
        plugin: A,
        scope: K
    }), await pEq(A, K)
}
// @from(Ln 511900, Col 0)
async function NNz(A, q) {
    if (q.cowork) $V(!0);
    let K = q.scope || "user";
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (!i0.includes(K)) console.error(`Invalid scope: ${K}. Must be one of: ${i0.join(", ")}.`), process.exit(1);
    d("tengu_plugin_uninstall_command", {
        plugin: A,
        scope: K
    }), await QEq(A, K)
}
// @from(Ln 511910, Col 0)
async function VNz(A, q) {
    if (q.cowork) $V(!0);
    let K;
    if (q.scope) {
        if (!i0.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${i0.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (q.cowork && K !== void 0 && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (q.cowork && K === void 0) K = "user";
    d("tengu_plugin_enable_command", {
        plugin: A,
        scope: K ?? "auto"
    }), await UEq(A, K)
}
// @from(Ln 511925, Col 0)
async function kNz(A, q) {
    if (q.all && A) process.stderr.write(`Cannot use --all with a specific plugin
`), process.exit(1);
    if (!q.all && !A) process.stderr.write(`Please specify a plugin name or use --all to disable all plugins
`), process.exit(1);
    if (q.cowork) $V(!0);
    if (q.all) {
        if (q.scope) process.stderr.write(`Cannot use --scope with --all
`), process.exit(1);
        d("tengu_plugin_disable_command", {
            plugin: "--all"
        }), await cEq();
        return
    }
    let K;
    if (q.scope) {
        if (!i0.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${i0.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (q.cowork && K !== void 0 && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (q.cowork && K === void 0) K = "user";
    d("tengu_plugin_disable_command", {
        plugin: A,
        scope: K ?? "auto"
    }), await dEq(A, K)
}
// @from(Ln 511952, Col 0)
async function ENz(A, q) {
    if (q.cowork) $V(!0);
    d("tengu_plugin_update_command", {});
    let K = "user";
    if (q.scope) {
        if (!O_6.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${O_6.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    await lEq(A, K)
}
// @from(Ln 511964, Col 4)
th = E(() => {
    b7();
    g1();
    V1();
    k1();
    Md8();
    Aw();
    dB();
    fX();
    Uv();
    bL1();
    eU8();
    BI();
    Na8();
    fX();
    tH();
    jQ6();
    T1();
    s8()
})
// @from(Ln 511984, Col 4)
WFq = {}
// @from(Ln 511995, Col 0)
function RNz() {
    let A = Q8.platform === "win32",
        q = yNz();
    if (A) return LNz(q, ".local", "bin", "claude.exe").replace(/\//g, "\\");
    return "~/.local/bin/claude"
}
// @from(Ln 512002, Col 0)
function PFq(A) {
    let q = A6(5),
        {
            messages: K
        } = A;
    if (K.length === 0) return null;
    let Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = j9.default.createElement(m, null, j9.default.createElement(T, {
        color: "warning"
    }, j9.default.createElement(kv6, {
        status: "warning",
        withSpace: !0
    }), "Setup notes:")), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = K.map(hNz), q[1] = K, q[2] = z;
    else z = q[2];
    let _;
    if (q[3] !== z) _ = j9.default.createElement(m, {
        flexDirection: "column",
        gap: 0,
        marginBottom: 1
    }, Y, z), q[3] = z, q[4] = _;
    else _ = q[4];
    return _
}
// @from(Ln 512029, Col 0)
function hNz(A, q) {
    return j9.default.createElement(m, {
        key: q,
        marginLeft: 2
    }, j9.default.createElement(T, {
        dimColor: !0
    }, "• ", A))
}
// @from(Ln 512038, Col 0)
function SNz({
    onDone: A,
    force: q,
    target: K
}) {
    let [Y, z] = da6.useState({
        type: "checking"
    });
    return da6.useEffect(() => {
        async function _() {
            try {
                k(`Install: Starting installation process (force=${q}, target=${K})`);
                let w = K || mA()?.autoUpdatesChannel || "latest";
                z({
                    type: "installing",
                    version: w
                }), k(`Install: Calling installLatest(channelOrVersion=${w}, forceReinstall=${q})`);
                let O = await ql(w, q);
                if (k(`Install: installLatest returned version=${O.latestVersion}, wasUpdated=${O.wasUpdated}, lockFailed=${O.lockFailed}`), O.lockFailed) throw Error("Could not install - another process is currently installing Claude. Please try again in a moment.");
                if (!O.latestVersion) k("Install: Failed to retrieve version information during install", {
                    level: "error"
                });
                if (!O.wasUpdated) k("Install: Already up to date");
                z({
                    type: "setting-up"
                });
                let $ = await gg(!0);
                if (k(`Install: Setup launcher completed with ${$.length} messages`), $.length > 0) $.forEach((X) => k(`Install: Setup message: ${X.message}`));
                k("Install: Cleaning up npm installations after successful install");
                let {
                    removed: H,
                    errors: j,
                    warnings: J
                } = await Yc6();
                if (H > 0) k(`Cleaned up ${H} npm installation(s)`);
                if (j.length > 0) k(`Cleanup errors: ${j.join(", ")}`);
                let M = await Kc6();
                if (M.length > 0) k(`Shell alias cleanup: ${M.map((X)=>X.message).join("; ")}`);
                if (d("tengu_claude_install_command", {
                        has_version: O.latestVersion ? 1 : 0,
                        forced: q ? 1 : 0
                    }), K === "latest" || K === "stable") TA("userSettings", {
                    autoUpdatesChannel: K
                }), k(`Install: Saved autoUpdatesChannel=${K} to user settings`);
                let D = [...J, ...M.map((X) => X.message)];
                if ($.length > 0) z({
                    type: "set-up",
                    messages: $.map((X) => X.message)
                }), setTimeout(z, 2000, {
                    type: "success",
                    version: O.latestVersion || "current",
                    setupMessages: [...$.map((X) => X.message), ...D]
                });
                else k("Install: Shell PATH already configured"), z({
                    type: "success",
                    version: O.latestVersion || "current",
                    setupMessages: D.length > 0 ? D : void 0
                })
            } catch (w) {
                k(`Install command failed: ${w}`, {
                    level: "error"
                }), z({
                    type: "error",
                    message: _1(w)
                })
            }
        }
        _()
    }, [q, K]), da6.useEffect(() => {
        if (Y.type === "success") setTimeout(A, 2000, "Claude Code installation completed successfully", {
            display: "system"
        });
        else if (Y.type === "error") setTimeout(A, 3000, "Claude Code installation failed", {
            display: "system"
        })
    }, [Y, A]), j9.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, Y.type === "checking" && j9.default.createElement(T, {
        color: "claude"
    }, "Checking installation status..."), Y.type === "cleaning-npm" && j9.default.createElement(T, {
        color: "warning"
    }, "Cleaning up old npm installations..."), Y.type === "installing" && j9.default.createElement(T, {
        color: "claude"
    }, "Installing Claude Code native build ", Y.version, "..."), Y.type === "setting-up" && j9.default.createElement(T, {
        color: "claude"
    }, "Setting up launcher and shell integration..."), Y.type === "set-up" && j9.default.createElement(PFq, {
        messages: Y.messages
    }), Y.type === "success" && j9.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, j9.default.createElement(m, null, j9.default.createElement(kv6, {
        status: "success",
        withSpace: !0
    }), j9.default.createElement(T, {
        color: "success",
        bold: !0
    }, "Claude Code successfully installed!")), j9.default.createElement(m, {
        marginLeft: 2,
        flexDirection: "column",
        gap: 1
    }, Y.version !== "current" && j9.default.createElement(m, null, j9.default.createElement(T, {
        dimColor: !0
    }, "Version: "), j9.default.createElement(T, {
        color: "claude"
    }, Y.version)), j9.default.createElement(m, null, j9.default.createElement(T, {
        dimColor: !0
    }, "Location: "), j9.default.createElement(T, {
        color: "text"
    }, RNz()))), j9.default.createElement(m, {
        marginLeft: 2,
        flexDirection: "column",
        gap: 1
    }, j9.default.createElement(m, {
        marginTop: 1
    }, j9.default.createElement(T, {
        dimColor: !0
    }, "Next: Run "), j9.default.createElement(T, {
        color: "claude",
        bold: !0
    }, "claude --help"), j9.default.createElement(T, {
        dimColor: !0
    }, " to get started"))), Y.setupMessages && j9.default.createElement(PFq, {
        messages: Y.setupMessages
    })), Y.type === "error" && j9.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, j9.default.createElement(m, null, j9.default.createElement(kv6, {
        status: "error",
        withSpace: !0
    }), j9.default.createElement(T, {
        color: "error"
    }, "Installation failed")), j9.default.createElement(T, {
        color: "error"
    }, Y.message), j9.default.createElement(m, {
        marginTop: 1
    }, j9.default.createElement(T, {
        dimColor: !0
    }, "Try running with --force to override checks"))))
}
// @from(Ln 512178, Col 4)
j9
// @from(Ln 512178, Col 8)
da6
// @from(Ln 512178, Col 13)
CNz
// @from(Ln 512179, Col 4)
ZFq = E(() => {
    e6();
    i6();
    i6();
    Pb();
    H1();
    V1();
    i8();
    wU8();
    d3();
    s8();
    j9 = t(P6(), 1), da6 = t(P6(), 1);
    CNz = {
        type: "local-jsx",
        name: "install",
        description: "Install Claude Code native build",
        argumentHint: "[options]",
        async call(A, q, K) {
            let Y = K.includes("--force"),
                _ = K.filter((O) => !O.startsWith("--"))[0],
                {
                    unmount: w
                } = await BC(j9.default.createElement(SNz, {
                    onDone: (O, $) => {
                        w(), A(O, $)
                    },
                    force: Y,
                    target: _
                }))
        }
    }
})
// @from(Ln 512211, Col 4)
Lb1 = {}
// @from(Ln 512220, Col 0)
async function bNz(A) {
    d("tengu_setup_token_command", {});
    let q = !iH(),
        {
            ConsoleOAuthFlow: K
        } = await Promise.resolve().then(() => ($c6(), xU4));
    await new Promise((Y) => {
        A.render(zW.default.createElement(Yj, {
            onChangeAppState: bi
        }, zW.default.createElement(aj, null, zW.default.createElement(m, {
            flexDirection: "column",
            gap: 1
        }, zW.default.createElement(bC1, null), q && zW.default.createElement(m, {
            flexDirection: "column"
        }, zW.default.createElement(T, {
            color: "warning"
        }, "Warning: You already have authentication configured via environment variable or API key helper."), zW.default.createElement(T, {
            color: "warning"
        }, "The setup-token command will create a new OAuth token which you can use instead.")), zW.default.createElement(K, {
            onDone: () => {
                Y()
            },
            mode: "setup-token",
            startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
        })))))
    }), A.unmount(), process.exit(0)
}
// @from(Ln 512248, Col 0)
function uNz(A) {
    let q = A6(2),
        {
            onDone: K
        } = A;
    $b1();
    let Y;
    if (q[0] !== K) Y = zW.default.createElement(zW.default.Suspense, {
        fallback: null
    }, zW.default.createElement(xNz, {
        onDone: K
    })), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 512263, Col 0)
async function mNz(A) {
    d("tengu_doctor_command", {}), await new Promise((q) => {
        A.render(zW.default.createElement(Yj, null, zW.default.createElement(aj, null, zW.default.createElement(GL1, {
            dynamicMcpConfig: void 0,
            isStrictMcpConfig: !1
        }, zW.default.createElement(uNz, {
            onDone: () => {
                q()
            }
        })))))
    }), A.unmount(), process.exit(0)
}
// @from(Ln 512275, Col 0)
async function BNz(A, q) {
    let {
        setup: K
    } = await Promise.resolve().then(() => (nC1(), iC1));
    await K(INz(), "default", !1, !1, void 0, !1);
    let {
        install: Y
    } = await Promise.resolve().then(() => (ZFq(), WFq));
    await new Promise((z) => {
        let _ = [];
        if (A) _.push(A);
        if (q.force) _.push("--force");
        Y.call((w) => {
            z(), process.exit(w.includes("failed") ? 1 : 0)
        }, {}, _)
    })
}
// @from(Ln 512292, Col 4)
zW
// @from(Ln 512292, Col 8)
xNz
// @from(Ln 512293, Col 4)
Rb1 = E(() => {
    e6();
    i6();
    NA();
    Mg();
    f16();
    Ga8();
    do6();
    pt8();
    V1();
    fA();
    zW = t(P6(), 1);
    xNz = zW.default.lazy(() => Promise.resolve().then(() => (fU8(), tYq)).then((A) => ({
        default: A.Doctor
    })))
})
// @from(Ln 512309, Col 4)
fFq = {}
// @from(Ln 512314, Col 0)
function GFq(A) {
    let q = QR1(A),
        K = [A.agentType];
    if (q) K.push(q);
    if (A.memory) K.push(`${A.memory} memory`);
    return K.join(" · ")
}
// @from(Ln 512321, Col 0)
async function gNz() {
    let A = G1(),
        {
            allAgents: q
        } = await UI(A),
        K = dv(q),
        Y = pR1(q, K),
        z = [],
        _ = 0;
    for (let {
            label: w,
            source: O
        }
        of jr6) {
        let $ = Y.filter((H) => H.source === O).sort(dR1);
        if ($.length === 0) continue;
        z.push(`${w}:`);
        for (let H of $)
            if (H.overriddenBy) {
                let j = UR1(H.overriddenBy);
                z.push(`  (shadowed by ${j}) ${GFq(H)}`)
            } else z.push(`  ${GFq(H)}`), _++;
        z.push("")
    }
    if (z.length === 0) console.log("No agents found.");
    else console.log(`${_} active agents
`), console.log(z.join(`
`).trimEnd())
}
// @from(Ln 512350, Col 4)
TFq = E(() => {
    J0();
    cR1();
    lA()
})
// @from(Ln 512355, Col 4)
et8 = {}
// @from(Ln 512361, Col 0)
function vFq(A) {
    process.stdout.write(B6(A, null, 2) + `
`)
}
// @from(Ln 512366, Col 0)
function FNz() {
    vFq(sx8())
}
// @from(Ln 512370, Col 0)
function pNz() {
    let A = RN1(),
        q = sx8();
    vFq({
        allow: A?.allow?.length ? A.allow : q.allow,
        deny: A?.deny?.length ? A.deny : q.deny,
        environment: A?.environment?.length ? A.environment : q.environment
    })
}
// @from(Ln 512379, Col 4)
Ae8 = E(() => {
    lc6();
    i8();
    g1()
})
// @from(Ln 512384, Col 4)
NFq = {}
// @from(Ln 512388, Col 0)
async function QNz() {
    d("tengu_update_check", {}), Z4(`Current version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION}
`);
    let A = mA()?.autoUpdatesChannel ?? "latest";
    Z4(`Checking for updates to ${A} version...
`), k("update: Starting update check"), k("update: Running diagnostic");
    let q = await SY6();
    if (k(`update: Installation type: ${q.installationType}`), k(`update: Config install method: ${q.configInstallMethod}`), q.multipleInstallations.length > 1) {
        Z4(`
`), Z4(O1.yellow("Warning: Multiple installations found") + `
`);
        for (let H of q.multipleInstallations) {
            let j = q.installationType === H.type ? " (currently running)" : "";
            Z4(`- ${H.type} at ${H.path}${j}
`)
        }
    }
    if (q.warnings.length > 0) {
        Z4(`
`);
        for (let H of q.warnings) k(`update: Warning detected: ${H.issue}`), k(`update: Showing warning: ${H.issue}`), Z4(O1.yellow(`Warning: ${H.issue}
`)), Z4(O1.bold(`Fix: ${H.fix}
`))
    }
    let K = X1();
    if (!K.installMethod && q.installationType !== "package-manager") {
        Z4(`
`), Z4(`Updating configuration to track installation method...
`);
        let H = "unknown";
        switch (q.installationType) {
            case "npm-local":
                H = "local";
                break;
            case "native":
                H = "native";
                break;
            case "npm-global":
                H = "global";
                break;
            default:
                H = "unknown"
        }
        d1((j) => ({
            ...j,
            installMethod: H
        })), Z4(`Installation method set to: ${H}
`)
    }
    if (q.installationType === "development") Z4(`
`), Z4(O1.yellow("Warning: Cannot update development build") + `
`), await Vq(1);
    if (q.installationType === "package-manager") {
        let H = await _f6();
        if (Z4(`
`), H === "homebrew") {
            Z4(`Claude is managed by Homebrew.
`);
            let j = await LY6(A);
            if (j && !BM({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION, j)) Z4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} → ${j}
`), Z4(`
`), Z4(`To update, run:
`), Z4(O1.bold("  brew upgrade claude-code") + `
`);
            else Z4(`Claude is up to date!
`)
        } else if (H === "winget") {
            Z4(`Claude is managed by winget.
`);
            let j = await LY6(A);
            if (j && !BM({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION, j)) Z4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} → ${j}
`), Z4(`
`), Z4(`To update, run:
`), Z4(O1.bold("  winget upgrade Anthropic.ClaudeCode") + `
`);
            else Z4(`Claude is up to date!
`)
        } else if (H === "apk") {
            Z4(`Claude is managed by apk.
`);
            let j = await LY6(A);
            if (j && !BM({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION, j)) Z4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} → ${j}
`), Z4(`
`), Z4(`To update, run:
`), Z4(O1.bold("  apk upgrade claude-code") + `
`);
            else Z4(`Claude is up to date!
`)
        } else Z4(`Claude is managed by a package manager.
`), Z4(`Please use your package manager to update.
`);
        await Vq(0)
    }
    if (K.installMethod && q.configInstallMethod !== "not set" && q.installationType !== "package-manager") {
        let {
            installationType: H,
            configInstallMethod: j
        } = q, M = {
            "npm-local": "local",
            "npm-global": "global",
            native: "native",
            development: "development",
            unknown: "unknown"
        } [H] || H;
        if (M !== j && j !== "unknown") Z4(`
`), Z4(O1.yellow("Warning: Configuration mismatch") + `
`), Z4(`Config expects: ${j} installation
`), Z4(`Currently running: ${H}
`), Z4(O1.yellow(`Updating the ${H} installation you are currently using`) + `
`), d1((D) => ({
            ...D,
            installMethod: M
        })), Z4(`Config updated to reflect current installation method: ${M}
`)
    }
    if (q.installationType === "native") {
        k("update: Detected native installation, using native updater");
        try {
            let H = await ql(A, !0);
            if (H.lockFailed) {
                let j = H.lockHolderPid ? ` (PID ${H.lockHolderPid})` : "";
                Z4(O1.yellow(`Another Claude process${j} is currently running. Please try again in a moment.`) + `
`), await Vq(0)
            }
            if (!H.latestVersion) process.stderr.write(`Failed to check for updates
`), await Vq(1);
            if (H.latestVersion === {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION) Z4(O1.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION})`) + `
`);
            else Z4(O1.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} to version ${H.latestVersion}`) + `
`), await DT8();
            await Vq(0)
        } catch (H) {
            process.stderr.write(`Error: Failed to install native update
`), process.stderr.write(String(H) + `
`), process.stderr.write(`Try running "claude doctor" for diagnostics
`), await Vq(1)
        }
    }
    if (K.installMethod !== "native") await qc6();
    k("update: Checking npm registry for latest version"), k(`update: Package URL: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}`);
    let Y = A === "stable" ? "stable" : "latest",
        z = `npm view ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}@${Y} version`;
    k(`update: Running: ${z}`);
    let _ = await LY6(A);
    if (k(`update: Latest version from npm: ${_||"FAILED"}`), !_) {
        if (k("update: Failed to get latest version from npm registry"), process.stderr.write(O1.red("Failed to check for updates") + `
`), process.stderr.write(`Unable to fetch latest version from npm registry
`), process.stderr.write(`
`), process.stderr.write(`Possible causes:
`), process.stderr.write(`  • Network connectivity issues
`), process.stderr.write(`  • npm registry is unreachable
`), process.stderr.write(`  • Corporate proxy/firewall blocking npm
`), {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.PACKAGE_URL && !{
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.PACKAGE_URL.startsWith("@anthropic")) process.stderr.write(`  • Internal/development build not published to npm
`);
        process.stderr.write(`
`), process.stderr.write(`Try:
`), process.stderr.write(`  • Check your internet connection
`), process.stderr.write(`  • Run with --debug flag for more details
`);
        let H = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.PACKAGE_URL || "@anthropic-ai/claude-code";
        process.stderr.write(`  • Manually check: npm view ${H} version
`), process.stderr.write(`  • Check if you need to login: npm whoami
`), await Vq(1)
    }
    if (_ === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION) Z4(O1.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION})`) + `
`), await Vq(0);
    Z4(`New version available: ${_} (current: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION})
`), Z4(`Installing update...
`);
    let w = !1,
        O = "";
    switch (q.installationType) {
        case "npm-local":
            w = !0, O = "local";
            break;
        case "npm-global":
            w = !1, O = "global";
            break;
        case "unknown": {
            let H = _66();
            w = H, O = H ? "local" : "global", Z4(O1.yellow("Warning: Could not determine installation type") + `
`), Z4(`Attempting ${O} update based on file detection...
`);
            break
        }
        default:
            process.stderr.write(`Error: Cannot update ${q.installationType} installation
`), await Vq(1)
    }
    Z4(`Using ${O} installation update method...
`), k(`update: Update method determined: ${O}`), k(`update: useLocalUpdate: ${w}`);
    let $;
    if (w) k("update: Calling installOrUpdateClaudePackage() for local update"), $ = await ld6(A);
    else k("update: Calling installGlobalPackage() for global update"), $ = await rd6();
    switch (k(`update: Installation status: ${$}`), $) {
        case "success":
            Z4(O1.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} to version ${_}`) + `
`), await DT8();
            break;
        case "no_permissions":
            if (process.stderr.write(`Error: Insufficient permissions to install update
`), w) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}
`);
            else process.stderr.write(`Try running with sudo or fix npm permissions
`), process.stderr.write(`Or consider using native installation with: claude install
`);
            await Vq(1);
            break;
        case "install_failed":
            if (process.stderr.write(`Error: Failed to install update
`), w) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.PACKAGE_URL}
`);
            else process.stderr.write(`Or consider using native installation with: claude install
`);
            await Vq(1);
            break;
        case "in_progress":
            process.stderr.write(`Error: Another instance is currently performing an update
`), process.stderr.write(`Please wait and try again later
`), await Vq(1);
            break
    }
    await Vq(0)
}
// @from(Ln 512670, Col 4)
VFq = E(() => {
    V1();
    ac();
    vv1();
    k8();
    yY6();
    Pb();
    tc();
    aK();
    H1();
    c_();
    i8();
    XT8()
})
// @from(Ln 512684, Col 4)
yFq = {}
// @from(Ln 512700, Col 0)
function rNz() {
    try {
        let A = L8("policySettings");
        if (A) {
            let q = hvq(A);
            d("tengu_managed_settings_loaded", {
                keyCount: q.length,
                keys: q.join(",")
            })
        }
    } catch {}
}
// @from(Ln 512713, Col 0)
function oNz() {
    let A = A$6(),
        q = process.execArgv.some((Y) => {
            if (A) return /--inspect(-brk)?/.test(Y);
            else return /--inspect(-brk)?|--debug(-brk)?/.test(Y)
        }),
        K = process.env.NODE_OPTIONS && /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
    try {
        return !!global.require("inspector").url() || q || K
    } catch {
        return q || K
    }
}
// @from(Ln 512727, Col 0)
function aNz() {
    d1((q) => ({
        ...q,
        numStartups: (q.numStartups ?? 0) + 1
    })), tNz();
    let A = H5(xw6() ?? g0());
    gC1(G1(), uM(A, Zj()))
}
// @from(Ln 512736, Col 0)
function sNz() {
    let A = {};
    if (process.env.NODE_EXTRA_CA_CERTS) A.has_node_extra_ca_certs = !0;
    if (process.env.CLAUDE_CODE_CLIENT_CERT) A.has_client_cert = !0;
    if (aw6("--use-system-ca")) A.has_use_system_ca = !0;
    if (aw6("--use-openssl-ca")) A.has_use_openssl_ca = !0;
    return A
}
// @from(Ln 512744, Col 0)
async function tNz() {
    if (My()) return;
    let [A, q, K, Y] = await Promise.all([IH(), TJ6(), tG7(G1()), iEq()]);
    d("tengu_startup_telemetry", {
        is_git: A,
        worktree_count: q,
        repo_text_file_size_bytes: K ?? void 0,
        gh_auth_status: Y,
        sandbox_enabled: vA.isSandboxingEnabled(),
        are_unsandboxed_commands_allowed: vA.areUnsandboxedCommandsAllowed(),
        is_auto_bash_allowed_if_sandbox_enabled: vA.isAutoAllowBashIfSandboxedEnabled(),
        auto_updater_disabled: CF(),
        prefers_reduced_motion: mA().prefersReducedMotion ?? !1,
        ...sNz()
    })
}
// @from(Ln 512761, Col 0)
function eNz() {
    Oyq(), Hyq(), Jyq(), yyq(), Tyq(), Xyq(), Nyq(), kyq(), Wyq(), Gyq(), THq().catch(() => {})
}
// @from(Ln 512765, Col 0)
function AVz() {
    if (q7()) {
        U1("info", "prefetch_system_context_non_interactive"), mw();
        return
    }
    if (l_()) U1("info", "prefetch_system_context_has_trust"), mw();
    else U1("info", "prefetch_system_context_skipped_no_trust")
}
// @from(Ln 512774, Col 0)
function mC1() {
    if (t6(process.env.CLAUDE_CODE_EXIT_AFTER_FIRST_RENDER)) return;
    if (wMA(), a2(), AVz(), UC1(), t6(process.env.CLAUDE_CODE_USE_BEDROCK) && !t6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) So8();
    if (t6(process.env.CLAUDE_CODE_USE_VERTEX) && !t6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) ho8();
    if (e81(G1(), AbortSignal.timeout(3000), []), bo8(), tO.initialize(), !t6(process.env.CLAUDE_CODE_SIMPLE)) YV6.initialize()
}
// @from(Ln 512781, Col 0)
function qVz(A) {
    try {
        let q = A.trim(),
            K = q.startsWith("{") && q.endsWith("}"),
            Y;
        if (K) {
            if (!WK(q)) process.stderr.write(O1.red(`Error: Invalid JSON provided to --settings
`)), process.exit(1);
            Y = sy1("claude-settings", ".json", {
                contentHash: q
            }), fz(Y, q, "utf8")
        } else {
            let {
                resolvedPath: z
            } = qO($1(), A);
            if (!UNz(z)) process.stderr.write(O1.red(`Error: Settings file not found: ${z}
`)), process.exit(1);
            Y = z
        }
        Eu1(Y), zP()
    } catch (q) {
        if (q instanceof Error) _6(q);
        process.stderr.write(O1.red(`Error processing settings: ${_1(q)}
`)), process.exit(1)
    }
}
// @from(Ln 512808, Col 0)
function KVz(A) {
    try {
        let q = j57(A);
        bu1(q), zP()
    } catch (q) {
        if (q instanceof Error) _6(q);
        process.stderr.write(O1.red(`Error processing --setting-sources: ${_1(q)}
`)), process.exit(1)
    }
}
// @from(Ln 512819, Col 0)
function YVz() {
    Zq("eagerLoadSettings_start");
    let A = Ca8("--settings");
    if (A) qVz(A);
    let q = Ca8("--setting-sources");
    if (q !== void 0) KVz(q);
    Zq("eagerLoadSettings_end")
}
// @from(Ln 512828, Col 0)
function zVz(A) {
    if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
    let q = process.argv.slice(2),
        K = q.indexOf("mcp");
    if (K !== -1 && q[K + 1] === "serve") {
        process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
        return
    }
    if (t6(process.env.CLAUDE_CODE_ACTION)) {
        process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
        return
    }
    process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}
// @from(Ln 512842, Col 0)
async function _Vz() {
    Zq("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", eVq(), process.on("exit", () => {
        HVz()
    }), process.on("SIGINT", () => {
        process.exit(0)
    }), Zq("main_warning_handler_initialized");
    let A = process.argv.slice(2),
        q = A.includes("-p") || A.includes("--print"),
        K = A.includes("--init-only"),
        Y = A.some(($) => $.startsWith("--sdk-url")),
        z = q || K || Y || !process.stdout.isTTY;
    if (z) $s();
    vu1(!z), zVz(z);
    let w = (() => {
        if (t6(process.env.GITHUB_ACTIONS)) return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent") return "local-agent";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop") return "claude-desktop";
        let $ = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" || $) return "remote";
        return "cli"
    })();
    Nu1(w);
    let O = process.env.CLAUDE_CODE_QUESTION_PREVIEW_FORMAT;
    if (O === "markdown" || O === "html") Et6(O);
    else if (!w.startsWith("sdk-")) Et6("markdown");
    if (process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge") ku1("remote-control");
    Zq("main_client_type_determined"), YVz(), Zq("main_before_run"), process.title = "claude", await OVz(), Zq("main_after_run")
}
// @from(Ln 512874, Col 0)
async function wVz(A, q) {
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        if (q === "stream-json") return process.stdin;
        process.stdin.setEncoding("utf8");
        let K = "";
        return process.stdin.on("data", (Y) => {
            K += Y
        }), await new Promise((Y) => {
            process.stdin.on("end", Y)
        }), [A, K].filter(Boolean).join(`
`)
    }
    return A
}