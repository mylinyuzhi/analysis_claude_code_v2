
// @from(Ln 398861, Col 0)
function nU8({
    agentServer: A,
    onCancel: q,
    onComplete: K
}) {
    let [Y] = z7(), [z, _] = Ub.useState(!1), [w, O] = Ub.useState(null), [$, H] = Ub.useState(null), j = Ub.useRef(null);
    Ub.useEffect(() => () => j.current?.abort(), []);
    let J = Ub.useCallback(() => {
        if (z) j.current?.abort(), j.current = null, _(!1), H(null)
    }, [z]);
    D8("confirm:no", J, {
        context: "Confirmation",
        isActive: z
    });
    let M = Ub.useCallback(async () => {
            if (!A.needsAuth || !A.url) return;
            _(!0), O(null);
            let P = new AbortController;
            j.current = P;
            try {
                let W = {
                    type: A.transport,
                    url: A.url
                };
                await mv6(A.name, W, H, P.signal), K?.(`Authentication successful for ${A.name}. The server will connect when the agent runs.`)
            } catch (W) {
                if (W instanceof Error && !(W instanceof uv6)) O(W.message)
            } finally {
                _(!1), j.current = null
            }
        }, [A, K]),
        D = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1);
    if (z) return I5.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, I5.default.createElement(T, {
        color: "claude"
    }, "Authenticating with ", A.name, "…"), I5.default.createElement(m, null, I5.default.createElement(Wq, null), I5.default.createElement(T, null, " A browser window will open for authentication")), $ && I5.default.createElement(m, {
        flexDirection: "column"
    }, I5.default.createElement(T, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually:"), I5.default.createElement(y7, {
        url: $
    })), I5.default.createElement(m, {
        marginLeft: 3
    }, I5.default.createElement(T, {
        dimColor: !0
    }, "Return here after authenticating in your browser.", " ", I5.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let X = [];
    if (A.needsAuth) X.push({
        label: A.isAuthenticated ? "Re-authenticate" : "Authenticate",
        value: "auth"
    });
    return X.push({
        label: "Back",
        value: "back"
    }), I5.default.createElement(m8, {
        title: `${D} MCP Server`,
        subtitle: "agent-only",
        onCancel: q,
        inputGuide: (P) => P.pending ? I5.default.createElement(T, null, "Press ", P.keyName, " again to exit") : I5.default.createElement(C8, null, I5.default.createElement(a1, {
            shortcut: "↑↓",
            action: "navigate"
        }), I5.default.createElement(a1, {
            shortcut: "Enter",
            action: "confirm"
        }), I5.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }))
    }, I5.default.createElement(m, {
        flexDirection: "column",
        gap: 0
    }, I5.default.createElement(m, null, I5.default.createElement(T, {
        bold: !0
    }, "Type: "), I5.default.createElement(T, {
        dimColor: !0
    }, A.transport)), A.url && I5.default.createElement(m, null, I5.default.createElement(T, {
        bold: !0
    }, "URL: "), I5.default.createElement(T, {
        dimColor: !0
    }, A.url)), A.command && I5.default.createElement(m, null, I5.default.createElement(T, {
        bold: !0
    }, "Command: "), I5.default.createElement(T, {
        dimColor: !0
    }, A.command)), I5.default.createElement(m, null, I5.default.createElement(T, {
        bold: !0
    }, "Used by: "), I5.default.createElement(T, {
        dimColor: !0
    }, A.sourceAgents.join(", "))), I5.default.createElement(m, {
        marginTop: 1
    }, I5.default.createElement(T, {
        bold: !0
    }, "Status: "), I5.default.createElement(T, null, kA("inactive", Y)(a6.radioOff), " not connected (agent-only)")), A.needsAuth && I5.default.createElement(m, null, I5.default.createElement(T, {
        bold: !0
    }, "Auth: "), A.isAuthenticated ? I5.default.createElement(T, null, kA("success", Y)(a6.tick), " authenticated") : I5.default.createElement(T, null, kA("warning", Y)(a6.triangleUpOutline), " may need authentication"))), I5.default.createElement(m, null, I5.default.createElement(T, {
        dimColor: !0
    }, "This server connects only when running the agent.")), w && I5.default.createElement(m, null, I5.default.createElement(T, {
        color: "error"
    }, "Error: ", w)), I5.default.createElement(m, null, I5.default.createElement(T8, {
        options: X,
        onChange: async (P) => {
            switch (P) {
                case "auth":
                    await M();
                    break;
                case "back":
                    q();
                    break
            }
        },
        onCancel: q
    })))
}
// @from(Ln 398983, Col 4)
I5
// @from(Ln 398983, Col 8)
Ub
// @from(Ln 398984, Col 4)
rU8 = E(() => {
    i6();
    _7();
    OK();
    o9();
    b7();
    W16();
    LO();
    wq();
    Lq();
    Xq();
    I5 = t(P6(), 1), Ub = t(P6(), 1)
})
// @from(Ln 398998, Col 0)
function kL1(A) {
    let q = A6(66),
        {
            onComplete: K
        } = A,
        Y = M1(ZiY),
        z = M1(WiY),
        _ = Y.clients,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        type: "list"
    }, q[0] = w;
    else w = q[0];
    let [O, $] = Vh.default.useState(w), H;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) H = [], q[1] = H;
    else H = q[1];
    let [j, J] = Vh.default.useState(H), M;
    if (q[2] !== z.allAgents) M = Yw4(z.allAgents), q[2] = z.allAgents, q[3] = M;
    else M = q[3];
    let D = M,
        X;
    if (q[4] !== _) X = _.filter(PiY).sort(XiY), q[4] = _, q[5] = X;
    else X = q[5];
    let P = X,
        W, Z;
    if (q[6] !== P || q[7] !== Y.tools) W = () => {
        (async function() {
            let V = await Promise.all(P.map(async (L) => {
                let h = L.config.scope,
                    R = L.config.type === "sse",
                    u = L.config.type === "http",
                    I = L.config.type === "claudeai-proxy",
                    g = void 0;
                if (R || u) {
                    let p = await new q_6(L.name, L.config).tokens(),
                        Q = UW() !== null && L.type === "connected",
                        U = L.type === "connected" && eB(Y.tools, L.name).length > 0;
                    g = Boolean(p) || Q || U
                }
                let B = {
                    name: L.name,
                    client: L,
                    scope: h
                };
                if (I) return {
                    ...B,
                    transport: "claudeai-proxy",
                    isAuthenticated: !1,
                    config: L.config
                };
                else if (R) return {
                    ...B,
                    transport: "sse",
                    isAuthenticated: g,
                    config: L.config
                };
                else if (u) return {
                    ...B,
                    transport: "http",
                    isAuthenticated: g,
                    config: L.config
                };
                else return {
                    ...B,
                    transport: "stdio",
                    config: L.config
                }
            }));
            J(V)
        })()
    }, Z = [P, Y.tools], q[6] = P, q[7] = Y.tools, q[8] = W, q[9] = Z;
    else W = q[8], Z = q[9];
    Vh.default.useEffect(W, Z);
    let G, f;
    if (q[10] !== D.length || q[11] !== P.length || q[12] !== K || q[13] !== j.length) G = () => {
        if (j.length === 0 && P.length > 0) return;
        if (j.length === 0 && D.length === 0) K("No MCP servers configured. Please run /doctor if this is unexpected. Otherwise, run `claude mcp --help` or visit https://code.claude.com/docs/en/mcp to learn more.")
    }, f = [j.length, P.length, D.length, K], q[10] = D.length, q[11] = P.length, q[12] = K, q[13] = j.length, q[14] = G, q[15] = f;
    else G = q[14], f = q[15];
    switch (Vh.useEffect(G, f), O.type) {
        case "list": {
            let v, N;
            if (q[16] === Symbol.for("react.memo_cache_sentinel")) N = (L) => $({
                type: "server-menu",
                server: L
            }), v = (L) => $({
                type: "agent-server-menu",
                agentServer: L
            }), q[16] = v, q[17] = N;
            else v = q[16], N = q[17];
            let V;
            if (q[18] !== D || q[19] !== K || q[20] !== j || q[21] !== O.defaultTab) V = Vh.default.createElement(pU8, {
                servers: j,
                agentServers: D,
                onSelectServer: N,
                onSelectAgentServer: v,
                onComplete: K,
                defaultTab: O.defaultTab
            }), q[18] = D, q[19] = K, q[20] = j, q[21] = O.defaultTab, q[22] = V;
            else V = q[22];
            return V
        }
        case "server-menu": {
            let v;
            if (q[23] !== Y.tools || q[24] !== O.server.name) v = eB(Y.tools, O.server.name), q[23] = Y.tools, q[24] = O.server.name, q[25] = v;
            else v = q[25];
            let N = v,
                V = O.server.transport === "claudeai-proxy" ? "claude.ai" : "Claude Code";
            if (O.server.transport === "stdio") {
                let L;
                if (q[26] !== O.server) L = () => $({
                    type: "server-tools",
                    server: O.server
                }), q[26] = O.server, q[27] = L;
                else L = q[27];
                let h;
                if (q[28] !== V) h = () => $({
                    type: "list",
                    defaultTab: V
                }), q[28] = V, q[29] = h;
                else h = q[29];
                let R;
                if (q[30] !== K || q[31] !== N.length || q[32] !== L || q[33] !== h || q[34] !== O.server) R = Vh.default.createElement(En6, {
                    server: O.server,
                    serverToolsCount: N.length,
                    onViewTools: L,
                    onCancel: h,
                    onComplete: K
                }), q[30] = K, q[31] = N.length, q[32] = L, q[33] = h, q[34] = O.server, q[35] = R;
                else R = q[35];
                return R
            } else {
                let L;
                if (q[36] !== O.server) L = () => $({
                    type: "server-tools",
                    server: O.server
                }), q[36] = O.server, q[37] = L;
                else L = q[37];
                let h;
                if (q[38] !== V) h = () => $({
                    type: "list",
                    defaultTab: V
                }), q[38] = V, q[39] = h;
                else h = q[39];
                let R;
                if (q[40] !== K || q[41] !== N.length || q[42] !== L || q[43] !== h || q[44] !== O.server) R = Vh.default.createElement(z_6, {
                    server: O.server,
                    serverToolsCount: N.length,
                    onViewTools: L,
                    onCancel: h,
                    onComplete: K
                }), q[40] = K, q[41] = N.length, q[42] = L, q[43] = h, q[44] = O.server, q[45] = R;
                else R = q[45];
                return R
            }
        }
        case "server-tools": {
            let v, N;
            if (q[46] !== O.server) N = (L, h) => $({
                type: "server-tool-detail",
                server: O.server,
                toolIndex: h
            }), v = () => $({
                type: "server-menu",
                server: O.server
            }), q[46] = O.server, q[47] = v, q[48] = N;
            else v = q[47], N = q[48];
            let V;
            if (q[49] !== v || q[50] !== N || q[51] !== O.server) V = Vh.default.createElement(yn6, {
                server: O.server,
                onSelectTool: N,
                onBack: v
            }), q[49] = v, q[50] = N, q[51] = O.server, q[52] = V;
            else V = q[52];
            return V
        }
        case "server-tool-detail": {
            let v;
            if (q[53] !== Y.tools || q[54] !== O.server.name) v = eB(Y.tools, O.server.name), q[53] = Y.tools, q[54] = O.server.name, q[55] = v;
            else v = q[55];
            let V = v[O.toolIndex];
            if (!V) return $({
                type: "server-tools",
                server: O.server
            }), null;
            let L;
            if (q[56] !== O.server) L = () => $({
                type: "server-tools",
                server: O.server
            }), q[56] = O.server, q[57] = L;
            else L = q[57];
            let h;
            if (q[58] !== L || q[59] !== V || q[60] !== O.server) h = Vh.default.createElement(Ln6, {
                tool: V,
                server: O.server,
                onBack: L
            }), q[58] = L, q[59] = V, q[60] = O.server, q[61] = h;
            else h = q[61];
            return h
        }
        case "agent-server-menu": {
            let v;
            if (q[62] === Symbol.for("react.memo_cache_sentinel")) v = () => $({
                type: "list",
                defaultTab: "Agents"
            }), q[62] = v;
            else v = q[62];
            let N;
            if (q[63] !== K || q[64] !== O.agentServer) N = Vh.default.createElement(nU8, {
                agentServer: O.agentServer,
                onCancel: v,
                onComplete: K
            }), q[63] = K, q[64] = O.agentServer, q[65] = N;
            else N = q[65];
            return N
        }
    }
}
// @from(Ln 399217, Col 0)
function XiY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 399221, Col 0)
function PiY(A) {
    return A.name !== "ide"
}
// @from(Ln 399225, Col 0)
function WiY(A) {
    return A.agentDefinitions
}
// @from(Ln 399229, Col 0)
function ZiY(A) {
    return A.mcp
}
// @from(Ln 399232, Col 4)
Vh
// @from(Ln 399233, Col 4)
Hwq = E(() => {
    e6();
    W16();
    gL();
    NA();
    qM();
    QU8();
    TL1();
    vL1();
    NL1();
    VL1();
    rU8();
    Vh = t(P6(), 1)
})
// @from(Ln 399248, Col 0)
function oU8(A) {
    let q = A6(25),
        {
            serverName: K,
            onComplete: Y
        } = A,
        [z] = z7(),
        _ = S5(),
        w = gv6(),
        [O, $] = Rn6.useState(!0),
        [H, j] = Rn6.useState(null),
        J, M;
    if (q[0] !== Y || q[1] !== w || q[2] !== K || q[3] !== _) J = () => {
        (async function() {
            try {
                if (!_.getState().mcp.clients.find((Z) => Z.name === K)) {
                    j(`MCP server "${K}" not found`), $(!1), Y(`MCP server "${K}" not found`);
                    return
                }
                let W = await w(K);
                A: switch (W.client.type) {
                    case "connected": {
                        $(!1), Y(`Successfully reconnected to ${K}`);
                        break A
                    }
                    case "needs-auth": {
                        j(`${K} requires authentication`), $(!1), Y(`${K} requires authentication. Use /mcp to authenticate.`);
                        break A
                    }
                    case "pending":
                    case "failed":
                    case "disabled":
                        j(`Failed to reconnect to ${K}`), $(!1), Y(`Failed to reconnect to ${K}`)
                }
            } catch (P) {
                let W = P,
                    Z = W instanceof Error ? W.message : String(W);
                j(Z), $(!1), Y(`Error: ${Z}`)
            }
        })()
    }, M = [K, w, _, Y], q[0] = Y, q[1] = w, q[2] = K, q[3] = _, q[4] = J, q[5] = M;
    else J = q[4], M = q[5];
    if (Rn6.useEffect(J, M), O) {
        let D;
        if (q[6] !== K) D = kh.default.createElement(T, {
            color: "text"
        }, "Reconnecting to ", kh.default.createElement(T, {
            bold: !0
        }, K)), q[6] = K, q[7] = D;
        else D = q[7];
        let X;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) X = kh.default.createElement(m, null, kh.default.createElement(Wq, null), kh.default.createElement(T, null, " Establishing connection to MCP server")), q[8] = X;
        else X = q[8];
        let P;
        if (q[9] !== D) P = kh.default.createElement(m, {
            flexDirection: "column",
            gap: 1,
            padding: 1
        }, D, X), q[9] = D, q[10] = P;
        else P = q[10];
        return P
    }
    if (H) {
        let D;
        if (q[11] !== z) D = kA("error", z)(a6.cross), q[11] = z, q[12] = D;
        else D = q[12];
        let X;
        if (q[13] !== D) X = kh.default.createElement(T, null, D, " "), q[13] = D, q[14] = X;
        else X = q[14];
        let P;
        if (q[15] !== K) P = kh.default.createElement(T, {
            color: "error"
        }, "Failed to reconnect to ", K), q[15] = K, q[16] = P;
        else P = q[16];
        let W;
        if (q[17] !== X || q[18] !== P) W = kh.default.createElement(m, null, X, P), q[17] = X, q[18] = P, q[19] = W;
        else W = q[19];
        let Z;
        if (q[20] !== H) Z = kh.default.createElement(T, {
            dimColor: !0
        }, "Error: ", H), q[20] = H, q[21] = Z;
        else Z = q[21];
        let G;
        if (q[22] !== W || q[23] !== Z) G = kh.default.createElement(m, {
            flexDirection: "column",
            gap: 1,
            padding: 1
        }, W, Z), q[22] = W, q[23] = Z, q[24] = G;
        else G = q[24];
        return G
    }
    return null
}
// @from(Ln 399341, Col 4)
kh
// @from(Ln 399341, Col 8)
Rn6
// @from(Ln 399342, Col 4)
aU8 = E(() => {
    e6();
    i6();
    LO();
    f16();
    NA();
    i6();
    b7();
    kh = t(P6(), 1), Rn6 = t(P6(), 1)
})
// @from(Ln 399352, Col 4)
jwq = E(() => {
    Hwq();
    QU8();
    TL1();
    vL1();
    rU8();
    NL1();
    VL1();
    aU8()
})
// @from(Ln 399362, Col 4)
Jwq = {}
// @from(Ln 399375, Col 0)
async function sU8() {
    let A = mA(),
        q = [],
        K = pp6();
    for (let [Y, z] of Object.entries(K))
        if (Y.includes("@") && z) q.push(Y);
    if (A.enabledPlugins)
        for (let [Y, z] of Object.entries(A.enabledPlugins)) {
            if (!Y.includes("@")) continue;
            let _ = q.indexOf(Y);
            if (z) {
                if (_ === -1) q.push(Y)
            } else if (_ !== -1) q.splice(_, 1)
        }
    return q
}
// @from(Ln 399392, Col 0)
function T16() {
    let A = new Map,
        q = pp6();
    for (let [Y, z] of Object.entries(q)) {
        if (!Y.includes("@")) continue;
        if (z === !0) A.set(Y, "flag");
        else if (z === !1) A.delete(Y)
    }
    let K = [{
        scope: "managed",
        source: "policySettings"
    }, {
        scope: "user",
        source: "userSettings"
    }, {
        scope: "project",
        source: "projectSettings"
    }, {
        scope: "local",
        source: "localSettings"
    }, {
        scope: "flag",
        source: "flagSettings"
    }];
    for (let {
            scope: Y,
            source: z
        }
        of K) {
        let _ = L8(z);
        if (!_?.enabledPlugins) continue;
        for (let [w, O] of Object.entries(_.enabledPlugins)) {
            if (!w.includes("@")) continue;
            if (w in q && q[w] !== O) k(`Plugin ${w} from --add-dir (${q[w]}) overridden by ${z} (${O})`);
            if (O === !0) A.set(w, Y);
            else if (O === !1) A.delete(w)
        }
    }
    return k(`Found ${A.size} enabled plugins with scopes: ${Array.from(A.entries()).map(([Y,z])=>`${Y}(${z})`).join(", ")}`), A
}
// @from(Ln 399433, Col 0)
function fiY(A) {
    return A !== "flag"
}
// @from(Ln 399437, Col 0)
function TiY(A) {
    return Tk8[A]
}
// @from(Ln 399440, Col 0)
async function EL1() {
    Rk8().catch((K) => {
        _6(K)
    });
    let A = Up6(),
        q = Object.keys(A.plugins);
    return k(`Found ${q.length} installed plugins`), q
}
// @from(Ln 399448, Col 0)
async function viY(A) {
    try {
        let q = await EL1(),
            K = A.filter((_) => !q.includes(_));
        return (await Promise.all(K.map(async (_) => {
            try {
                let w = await Qv(_);
                return {
                    pluginId: _,
                    found: w !== null && w !== void 0
                }
            } catch (w) {
                return k(`Failed to check plugin ${_} in marketplace: ${w}`), {
                    pluginId: _,
                    found: !1
                }
            }
        }))).filter(({
            found: _
        }) => _).map(({
            pluginId: _
        }) => _)
    } catch (q) {
        return _6(q), []
    }
}
// @from(Ln 399474, Col 0)
async function tU8(A, q, K = "user") {
    let Y = K !== "user" ? G1() : void 0,
        z = cB(K),
        _ = L8(z),
        w = {
            ..._?.enabledPlugins
        },
        O = [],
        $ = [];
    for (let H = 0; H < A.length; H++) {
        let j = A[H];
        if (!j) continue;
        if (q) q(j, H + 1, A.length);
        try {
            let J = await Qv(j);
            if (!J) {
                $.push({
                    name: j,
                    error: "Plugin not found in any marketplace"
                });
                continue
            }
            let {
                entry: M,
                marketplaceInstallLocation: D
            } = J;
            if (!SC6(M.source)) await ap6(j, M, K, Y);
            else W24({
                pluginId: j,
                installPath: GiY(D, M.source),
                version: M.version
            }, K, Y);
            w[j] = !0, O.push(j)
        } catch (J) {
            let M = J instanceof Error ? J.message : String(J);
            $.push({
                name: j,
                error: M
            }), _6(J)
        }
    }
    return TA(z, {
        ..._,
        enabledPlugins: w
    }), {
        installed: O,
        failed: $
    }
}
// @from(Ln 399523, Col 4)
__6 = E(() => {
    i8();
    Aw();
    k1();
    H1();
    i8();
    IW();
    M96();
    BI();
    lA();
    fX();
    B01()
})
// @from(Ln 399542, Col 0)
async function yL1(A) {
    let q = A.trim(),
        K = $1(),
        Y = q.match(/^([a-zA-Z0-9._-]+@[^:]+:.+?(?:\.git)?)(#(.+))?$/);
    if (Y?.[1]) {
        let w = Y[1],
            O = Y[3];
        return O ? {
            source: "git",
            url: w,
            ref: O
        } : {
            source: "git",
            url: w
        }
    }
    if (q.startsWith("http://") || q.startsWith("https://")) {
        let w = q.match(/^([^#]+)(#(.+))?$/),
            O = w?.[1] || q,
            $ = w?.[3];
        if (O.endsWith(".git") || O.includes("/_git/")) return $ ? {
            source: "git",
            url: O,
            ref: $
        } : {
            source: "git",
            url: O
        };
        let H;
        try {
            H = new URL(O)
        } catch (j) {
            return {
                source: "url",
                url: O
            }
        }
        if (H.hostname === "github.com" || H.hostname === "www.github.com") {
            if (H.pathname.match(/^\/([^/]+\/[^/]+?)(\/|\.git|$)/)?.[1]) {
                let J = O.endsWith(".git") ? O : `${O}.git`;
                return $ ? {
                    source: "git",
                    url: J,
                    ref: $
                } : {
                    source: "git",
                    url: J
                }
            }
        }
        return {
            source: "url",
            url: O
        }
    }
    let _ = process.platform === "win32" && (q.startsWith(".\\") || q.startsWith("..\\") || /^[a-zA-Z]:[/\\]/.test(q));
    if (q.startsWith("./") || q.startsWith("../") || q.startsWith("/") || q.startsWith("~") || _) {
        let w = NiY(q.startsWith("~") ? q.replace(/^~/, ViY()) : q),
            O;
        try {
            O = await K.stat(w)
        } catch ($) {
            let H = $.code;
            return {
                error: H === "ENOENT" ? `Path does not exist: ${w}` : `Cannot access path: ${w} (${H??$})`
            }
        }
        if (O.isFile())
            if (w.endsWith(".json")) return {
                source: "file",
                path: w
            };
            else return {
                error: `File path must point to a .json file (marketplace.json), but got: ${w}`
            };
        else if (O.isDirectory()) return {
            source: "directory",
            path: w
        };
        else return {
            error: `Path is neither a file nor a directory: ${w}`
        }
    }
    if (q.includes("/") && !q.startsWith("@")) {
        if (q.includes(":")) return null;
        let w = q.match(/^([^#@]+)(?:[#@](.+))?$/),
            O = w?.[1] || q,
            $ = w?.[2];
        return $ ? {
            source: "github",
            repo: O,
            ref: $
        } : {
            source: "github",
            repo: O
        }
    }
    return null
}
// @from(Ln 399641, Col 4)
eU8 = E(() => {
    SA()
})
// @from(Ln 399645, Col 0)
function Mwq({
    inputValue: A,
    setInputValue: q,
    cursorOffset: K,
    setCursorOffset: Y,
    error: z,
    setError: _,
    result: w,
    setResult: O,
    setViewState: $,
    onAddComplete: H,
    cliMode: j = !1
}) {
    let J = w_6.useRef(!1),
        [M, D] = w_6.useState(!1),
        [X, P] = w_6.useState(""),
        W = async () => {
            let Z = A.trim();
            if (!Z) {
                _("Please enter a marketplace source");
                return
            }
            let G = await yL1(Z);
            if (!G) {
                _("Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
                return
            }
            if ("error" in G) {
                _(G.error);
                return
            }
            _(null);
            try {
                D(!0), P("");
                let {
                    name: f,
                    resolvedSource: v
                } = await sB(G, (V) => {
                    P(V)
                });
                rp6(f, {
                    source: v
                }), HY();
                let N = G.source;
                if (G.source === "github") N = G.repo;
                if (d("tengu_marketplace_added", {
                        source_type: N
                    }), H) await H();
                if (P(""), D(!1), j) O(`Successfully added marketplace: ${f}`);
                else $({
                    type: "browse-marketplace",
                    targetMarketplace: f
                })
            } catch (f) {
                let v = f instanceof Error ? f : Error(String(f));
                if (_6(v), _(v.message), P(""), D(!1), j) O(`Error: ${v.message}`);
                else O(null)
            }
        };
    return w_6.useEffect(() => {
        if (A && !J.current && !z && !w) J.current = !0, W()
    }, []), TK.createElement(m, {
        flexDirection: "column"
    }, TK.createElement(m, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: "round"
    }, TK.createElement(m, {
        marginBottom: 1
    }, TK.createElement(T, {
        bold: !0
    }, "Add Marketplace")), TK.createElement(m, {
        flexDirection: "column"
    }, TK.createElement(T, null, "Enter marketplace source:"), TK.createElement(T, {
        dimColor: !0
    }, "Examples:"), TK.createElement(T, {
        dimColor: !0
    }, " • owner/repo (GitHub)"), TK.createElement(T, {
        dimColor: !0
    }, " • git@github.com:owner/repo.git (SSH)"), TK.createElement(T, {
        dimColor: !0
    }, " • https://example.com/marketplace.json"), TK.createElement(T, {
        dimColor: !0
    }, " • ./path/to/marketplace"), TK.createElement(m, {
        marginTop: 1
    }, TK.createElement(J5, {
        value: A,
        onChange: q,
        onSubmit: W,
        columns: 80,
        cursorOffset: K,
        onChangeCursorOffset: Y,
        focus: !0,
        showCursor: !0
    }))), M && TK.createElement(m, {
        marginTop: 1
    }, TK.createElement(Wq, null), TK.createElement(T, null, X || "Adding marketplace to configuration…")), z && TK.createElement(m, {
        marginTop: 1
    }, TK.createElement(T, {
        color: "error"
    }, z)), w && TK.createElement(m, {
        marginTop: 1
    }, TK.createElement(T, null, w))), TK.createElement(m, {
        marginLeft: 3
    }, TK.createElement(T, {
        dimColor: !0,
        italic: !0
    }, TK.createElement(C8, null, TK.createElement(a1, {
        shortcut: "Enter",
        action: "add"
    }), TK.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 399762, Col 4)
TK
// @from(Ln 399762, Col 8)
w_6
// @from(Ln 399763, Col 4)
Dwq = E(() => {
    i6();
    AH();
    Xq();
    Lq();
    OK();
    Aw();
    Uv();
    V1();
    eU8();
    LO();
    k1();
    TK = t(P6(), 1), w_6 = t(P6(), 1)
})
// @from(Ln 399782, Col 0)
function Ad8(A) {
    if (!i0.includes(A)) throw Error(`Invalid scope "${A}". Must be one of: ${i0.join(", ")}`)
}
// @from(Ln 399786, Col 0)
function $_6(A) {
    return i0.includes(A)
}
// @from(Ln 399790, Col 0)
function Pwq(A) {
    return A === "project" || A === "local" ? AA() : void 0
}
// @from(Ln 399794, Col 0)
function Wwq(A) {
    return L8("projectSettings")?.enabledPlugins?.[A] === !0
}
// @from(Ln 399798, Col 0)
function EiY(A) {
    let q = A.includes("@"),
        K = ["local", "project", "user"];
    for (let Y of K) {
        let z = L8(cB(Y))?.enabledPlugins;
        if (!z) continue;
        for (let _ of Object.keys(z))
            if (q ? _ === A : _.startsWith(`${A}@`)) return {
                pluginId: _,
                scope: Y
            }
    }
    return null
}
// @from(Ln 399813, Col 0)
function yiY(A, q) {
    let {
        name: K,
        marketplace: Y
    } = n3(A);
    return q.find((z) => {
        if (z.name === A || z.name === K) return !0;
        if (Y && z.source) return z.name === K && z.source.includes(`@${Y}`);
        return !1
    })
}
// @from(Ln 399825, Col 0)
function LiY(A) {
    let {
        name: q
    } = n3(A), K = DZ();
    if (K.plugins[A]?.length) return {
        pluginId: A,
        pluginName: q
    };
    let Y = Object.keys(K.plugins).find((z) => {
        let {
            name: _
        } = n3(z);
        return _ === q && (K.plugins[z]?.length ?? 0) > 0
    });
    if (Y) return {
        pluginId: Y,
        pluginName: q
    };
    return null
}
// @from(Ln 399846, Col 0)
function LL1(A) {
    let K = DZ().plugins[A];
    if (!K || K.length === 0) return {
        scope: "user"
    };
    let Y = AA(),
        z = K.find((O) => O.scope === "local" && O.projectPath === Y);
    if (z) return {
        scope: z.scope,
        projectPath: z.projectPath
    };
    let _ = K.find((O) => O.scope === "project" && O.projectPath === Y);
    if (_) return {
        scope: _.scope,
        projectPath: _.projectPath
    };
    let w = K.find((O) => O.scope === "user");
    if (w) return {
        scope: w.scope
    };
    return {
        scope: K[0].scope,
        projectPath: K[0].projectPath
    }
}
// @from(Ln 399871, Col 0)
async function Zwq(A, q = "user") {
    Ad8(q);
    let {
        name: K,
        marketplace: Y
    } = n3(A), z, _, w;
    if (Y) {
        let j = await Qv(A);
        if (j) z = j.entry, _ = Y, w = j.marketplaceInstallLocation
    } else {
        let j = await C3();
        for (let [J, M] of Object.entries(j)) try {
            let X = (await j0(J)).plugins.find((P) => P.name === K);
            if (X) {
                z = X, _ = J, w = M.installLocation;
                break
            }
        } catch (D) {
            _6(D instanceof Error ? D : Error(`Failed to load marketplace "${J}": ${D}`));
            continue
        }
    }
    if (!z || !_) {
        let j = Y ? `marketplace "${Y}"` : "any configured marketplace";
        return {
            success: !1,
            message: `Plugin "${K}" not found in ${j}`
        }
    }
    let O = z,
        $ = `${O.name}@${_}`,
        H = await tk8({
            pluginId: $,
            entry: O,
            scope: q,
            marketplaceInstallLocation: w
        });
    if (!H.ok) switch (H.reason) {
        case "local-source-no-location":
            return {
                success: !1, message: `Cannot install local plugin "${H.pluginName}" without marketplace install location`
            };
        case "settings-write-failed":
            return {
                success: !1, message: `Failed to update settings: ${H.message}`
            };
        case "resolution-failed":
            return {
                success: !1, message: sk8(H.resolution)
            }
    }
    return {
        success: !0,
        message: `Successfully installed plugin: ${$} (scope: ${q})${H.depNote}`,
        pluginId: $,
        pluginName: O.name,
        scope: q
    }
}
// @from(Ln 399930, Col 0)
async function v16(A, q = "user") {
    Ad8(q);
    let {
        enabled: K,
        disabled: Y
    } = await _z(), z = [...K, ...Y], _ = yiY(A, z), w = cB(q), O = L8(w), $, H;
    if (_) $ = Object.keys(O?.enabledPlugins ?? {}).find((N) => N === A || N === _.name || N.startsWith(`${_.name}@`)) ?? (A.includes("@") ? A : _.name), H = _.name;
    else {
        let N = LiY(A);
        if (!N) return {
            success: !1,
            message: `Plugin "${A}" not found in installed plugins`
        };
        $ = N.pluginId, H = N.pluginName
    }
    let j = Pwq(q),
        M = DZ().plugins[$],
        D = M?.find((N) => N.scope === q && N.projectPath === j);
    if (!D) {
        let {
            scope: N
        } = LL1($);
        if (N !== q && M && M.length > 0) {
            if (N === "project") return {
                success: !1,
                message: `Plugin "${A}" is enabled at project scope (.claude/settings.json, shared with your team). To disable just for you: claude plugin disable ${A} --scope local`
            };
            return {
                success: !1,
                message: `Plugin "${A}" is installed in ${N} scope, not ${q}. Use --scope ${N} to uninstall.`
            }
        }
        return {
            success: !1,
            message: `Plugin "${A}" is not installed in ${q} scope. Use --scope to specify the correct scope.`
        }
    }
    let X = D.installPath,
        P = {
            ...O?.enabledPlugins
        };
    P[$] = void 0, TA(w, {
        enabledPlugins: P
    }), HY(), b_4($, q, j);
    let Z = DZ().plugins[$],
        G = !Z || Z.length === 0;
    if (G && X) await tW6(X);
    if (G) Yz1($);
    let f = J96() ? lk8($, z) : [],
        v = ik8(f);
    return {
        success: !0,
        message: `Successfully uninstalled plugin: ${H} (scope: ${q})${v}`,
        pluginId: $,
        pluginName: H,
        scope: q,
        reverseDependents: f.length > 0 ? f : void 0
    }
}
// @from(Ln 399989, Col 0)
async function qd8(A, q, K) {
    let Y = q ? "enable" : "disable";
    if (Z24(A)) {
        let {
            error: W
        } = TA("userSettings", {
            enabledPlugins: {
                ...L8("userSettings")?.enabledPlugins,
                [A]: q
            }
        });
        if (W) return {
            success: !1,
            message: `Failed to ${Y} built-in plugin: ${W.message}`
        };
        HY();
        let {
            name: Z
        } = n3(A);
        return {
            success: !0,
            message: `Successfully ${Y}d built-in plugin: ${Z}`,
            pluginId: A,
            pluginName: Z,
            scope: "user"
        }
    }
    if (K) Ad8(K);
    let z, _, w = EiY(A);
    if (K)
        if (_ = K, w) z = w.pluginId;
        else if (A.includes("@")) z = A;
    else return {
        success: !1,
        message: `Plugin "${A}" not found in settings. Use plugin@marketplace format.`
    };
    else if (w) z = w.pluginId, _ = w.scope;
    else if (A.includes("@")) z = A, _ = "user";
    else return {
        success: !1,
        message: `Plugin "${A}" not found in any editable settings scope. Use plugin@marketplace format.`
    };
    let O = cB(_),
        $ = L8(O)?.enabledPlugins?.[z],
        H = {
            user: 0,
            project: 1,
            local: 2
        },
        j = K && w && H[K] > H[w.scope];
    if (K && $ === void 0 && w && w.scope !== K && !j) return {
        success: !1,
        message: `Plugin "${A}" is installed at ${w.scope} scope, not ${K}. Use --scope ${w.scope} or omit --scope to auto-detect.`
    };
    let J = K && !j ? $ === !0 : T16().has(z);
    if (q === J) return {
        success: !1,
        message: `Plugin "${A}" is already ${q?"enabled":"disabled"}${K?` at ${K} scope`:""}`
    };
    let M;
    if (J96() && !q) {
        let {
            enabled: W,
            disabled: Z
        } = await _z(), G = lk8(z, [...W, ...Z]);
        if (G.length > 0) M = G
    }
    let {
        error: D
    } = TA(O, {
        enabledPlugins: {
            ...L8(O)?.enabledPlugins,
            [z]: q
        }
    });
    if (D) return {
        success: !1,
        message: `Failed to ${Y} plugin: ${D.message}`
    };
    HY();
    let {
        name: X
    } = n3(z), P = ik8(M);
    return {
        success: !0,
        message: `Successfully ${Y}d plugin: ${X} (scope: ${_})${P}`,
        pluginId: z,
        pluginName: X,
        scope: _,
        reverseDependents: M
    }
}
// @from(Ln 400081, Col 0)
async function ol(A, q) {
    return qd8(A, !0, q)
}
// @from(Ln 400084, Col 0)
async function H_6(A, q) {
    return qd8(A, !1, q)
}
// @from(Ln 400087, Col 0)
async function Gwq() {
    let A = T16();
    if (A.size === 0) return {
        success: !0,
        message: "No enabled plugins to disable"
    };
    let q = [],
        K = [];
    for (let [Y] of A) {
        let z = await qd8(Y, !1);
        if (z.success) q.push(Y);
        else K.push(`${Y}: ${z.message}`)
    }
    if (K.length > 0) return {
        success: !1,
        message: `Disabled ${q.length} plugin${q.length===1?"":"s"}, ${K.length} failed:
${K.join(`
`)}`
    };
    return {
        success: !0,
        message: `Disabled ${q.length} plugin${q.length===1?"":"s"}`
    }
}
// @from(Ln 400111, Col 0)
async function Fv6(A, q) {
    let {
        name: K,
        marketplace: Y
    } = n3(A), z = Y ? `${K}@${Y}` : A, _ = await Qv(A);
    if (!_) return {
        success: !1,
        message: `Plugin "${K}" not found`,
        pluginId: z,
        scope: q
    };
    let {
        entry: w,
        marketplaceInstallLocation: O
    } = _, H = gI().plugins[z];
    if (!H || H.length === 0) return {
        success: !1,
        message: `Plugin "${K}" is not installed`,
        pluginId: z,
        scope: q
    };
    let j = Pwq(q),
        J = H.find((M) => M.scope === q && M.projectPath === j);
    if (!J) {
        let M = j ? `${q} (${j})` : q;
        return {
            success: !1,
            message: `Plugin "${K}" is not installed at scope ${M}`,
            pluginId: z,
            scope: q
        }
    }
    return RiY({
        pluginId: z,
        pluginName: K,
        entry: w,
        marketplaceInstallLocation: O,
        installation: J,
        scope: q,
        projectPath: j
    })
}
// @from(Ln 400153, Col 0)
async function RiY({
    pluginId: A,
    pluginName: q,
    entry: K,
    marketplaceInstallLocation: Y,
    installation: z,
    scope: _,
    projectPath: w
}) {
    let O = $1(),
        $ = z.version,
        H, j, J = !1,
        M;
    if (typeof K.source !== "string") {
        let D = await sp6(K.source, {
            manifest: {
                name: K.name
            }
        });
        H = D.path, J = !0, M = D.gitCommitSha, j = await Jc(A, K.source, D.manifest, D.path, K.version, D.gitCommitSha)
    } else {
        let D;
        try {
            D = await O.stat(Y)
        } catch (Z) {
            if (Z.code === "ENOENT") return {
                success: !1,
                message: `Marketplace directory not found at ${Y}`,
                pluginId: A,
                scope: _
            };
            throw Z
        }
        let X = D.isDirectory() ? Y : kiY(Y);
        H = Xwq(X, K.source);
        try {
            await O.stat(H)
        } catch (Z) {
            if (Z.code === "ENOENT") return {
                success: !1,
                message: `Plugin source not found at ${H}`,
                pluginId: A,
                scope: _
            };
            throw Z
        }
        let P, W = Xwq(H, ".claude-plugin", "plugin.json");
        try {
            P = await $W1(W, K.name, K.source)
        } catch {}
        j = await Jc(A, K.source, P, H, K.version)
    }
    try {
        let D = FI(A, j),
            X = KZ6(A, j);
        if (z.version === j || z.installPath === D || z.installPath === X) return {
            success: !0,
            message: `${q} is already at the latest version (${j}).`,
            pluginId: A,
            newVersion: j,
            oldVersion: $,
            alreadyUpToDate: !0,
            scope: _
        };
        D = await OW1(H, A, j, K);
        let W = z.installPath;
        if (x_4(A, _, w, D, j, M), W && W !== D) {
            let f = gI();
            if (!Object.values(f.plugins).some((N) => N.some((V) => V.installPath === W))) await tW6(W)
        }
        let Z = w ? `${_} (${w})` : _;
        return {
            success: !0,
            message: `Plugin "${q}" updated from ${$||"unknown"} to ${j} for scope ${Z}. Restart to apply changes.`,
            pluginId: A,
            newVersion: j,
            oldVersion: $,
            scope: _
        }
    } finally {
        if (J && H !== FI(A, j)) await O.rm(H, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 400239, Col 4)
i0
// @from(Ln 400239, Col 8)
O_6
// @from(Ln 400240, Col 4)
pv6 = E(() => {
    eu();
    tH();
    fX();
    M96();
    Aw();
    zW1();
    i8();
    Uv();
    BI();
    T1();
    YW1();
    SA();
    k1();
    __6();
    ep6();
    i0 = ["user", "project", "local"], O_6 = ["user", "project", "local", "managed"]
})
// @from(Ln 400259, Col 0)
function fwq(A) {
    if (RL1 = A, hn6 !== null && hn6.length > 0) A(hn6), hn6 = null;
    return () => {
        RL1 = null
    }
}
// @from(Ln 400265, Col 0)
async function hiY() {
    let A = await C3(),
        q = _e(),
        K = new Set;
    for (let [Y, z] of Object.entries(A)) {
        let _ = q[Y]?.autoUpdate;
        if (_ !== void 0 ? _ : RC6(Y, z)) K.add(Y.toLowerCase())
    }
    return K
}
// @from(Ln 400275, Col 0)
async function SiY(A, q) {
    let K = !1;
    for (let {
            scope: Y
        }
        of q) try {
        let z = await Fv6(A, Y);
        if (z.success && !z.alreadyUpToDate) K = !0, k(`Plugin autoupdate: updated ${A} from ${z.oldVersion} to ${z.newVersion}`);
        else if (!z.alreadyUpToDate) k(`Plugin autoupdate: failed to update ${A}: ${z.message}`, {
            level: "warn"
        })
    } catch (z) {
        k(`Plugin autoupdate: error updating ${A}: ${_1(z)}`, {
            level: "warn"
        })
    }
    return K ? A : null
}
// @from(Ln 400293, Col 0)
async function Kd8(A) {
    let q = gI(),
        K = Object.keys(q.plugins);
    if (K.length === 0) return [];
    return (await Promise.allSettled(K.map(async (z) => {
        let {
            marketplace: _
        } = n3(z);
        if (!_ || !A.has(_.toLowerCase())) return null;
        let w = q.plugins[z];
        if (!w || w.length === 0) return null;
        let O = w.filter(yk8);
        if (O.length === 0) return null;
        return SiY(z, O)
    }))).filter((z) => z.status === "fulfilled" && z.value !== null).map((z) => z.value)
}
// @from(Ln 400309, Col 0)
async function CiY(A) {
    return Kd8(A)
}
// @from(Ln 400313, Col 0)
function Twq() {
    (async () => {
        if (Qv6()) {
            k("Plugin autoupdate: skipped (auto-updater disabled)");
            return
        }
        try {
            let A = await hiY();
            if (A.size === 0) return;
            let K = (await Promise.allSettled(Array.from(A).map(async (z) => {
                try {
                    await we(z, void 0, {
                        disableCredentialHelper: !0
                    })
                } catch (_) {
                    k(`Plugin autoupdate: failed to refresh marketplace ${z}: ${_1(_)}`, {
                        level: "warn"
                    })
                }
            }))).filter((z) => z.status === "rejected");
            if (K.length > 0) k(`Plugin autoupdate: ${K.length} marketplace refresh(es) failed`, {
                level: "warn"
            });
            k("Plugin autoupdate: checking installed plugins");
            let Y = await CiY(A);
            if (Y.length > 0)
                if (RL1) RL1(Y);
                else hn6 = Y
        } catch (A) {
            _6(A)
        }
    })()
}
// @from(Ln 400346, Col 4)
RL1 = null
// @from(Ln 400347, Col 4)
hn6 = null
// @from(Ln 400348, Col 4)
hL1 = E(() => {
    H1();
    k1();
    k8();
    fX();
    Aw();
    pv6();
    BI();
    IW();
    s8()
})
// @from(Ln 400360, Col 0)
function vwq({
    setViewState: A,
    error: q,
    setError: K,
    setResult: Y,
    exitState: z,
    onManageComplete: _,
    targetMarketplace: w,
    action: O
}) {
    let [$, H] = pf.useState([]), [j, J] = pf.useState(!0), [M, D] = pf.useState(0), [X, P] = pf.useState(!1), [W, Z] = pf.useState(null), [G, f] = pf.useState(null), [v, N] = pf.useState(null), [V, L] = pf.useState("list"), [h, R] = pf.useState(null), [u, I] = pf.useState(0), g = pf.useRef(!1);
    pf.useEffect(() => {
        async function H6() {
            try {
                let J6 = await C3(),
                    {
                        enabled: K6,
                        disabled: s
                    } = await _z(),
                    X6 = [...K6, ...s],
                    {
                        marketplaces: z6,
                        failures: N6
                    } = await mI(J6),
                    $6 = [];
                for (let {
                        name: a,
                        config: i,
                        data: l
                    }
                    of z6) {
                    let q6 = X6.filter((w6) => w6.source.endsWith(`@${a}`));
                    $6.push({
                        name: a,
                        source: gp6(i.source),
                        lastUpdated: i.lastUpdated,
                        pluginCount: l?.plugins.length,
                        installedPlugins: q6,
                        pendingUpdate: !1,
                        pendingRemove: !1,
                        autoUpdate: RC6(a, i)
                    })
                }
                $6.sort((a, i) => {
                    if (a.name === "claude-plugin-directory") return -1;
                    if (i.name === "claude-plugin-directory") return 1;
                    return a.name.localeCompare(i.name)
                }), H($6);
                let n = z6.filter((a) => a.data !== null).length,
                    o = iW6(N6, n);
                if (o)
                    if (o.type === "warning") Z(o.message);
                    else throw Error(o.message);
                if (w && !g.current && !q) {
                    g.current = !0;
                    let a = $6.findIndex((i) => i.name === w);
                    if (a >= 0) {
                        let i = $6[a];
                        if (O) {
                            D(a + 1);
                            let l = [...$6];
                            if (O === "update") l[a].pendingUpdate = !0;
                            else if (O === "remove") l[a].pendingRemove = !0;
                            H(l), setTimeout(p, 100, l)
                        } else if (i) D(a + 1), R(i), L("details")
                    } else if (K) K(`Marketplace not found: ${w}`)
                }
            } catch (J6) {
                if (K) K(J6 instanceof Error ? J6.message : "Failed to load marketplaces");
                Z(J6 instanceof Error ? J6.message : "Failed to load marketplaces")
            } finally {
                J(!1)
            }
        }
        H6()
    }, [w, O, q]);
    let B = () => {
            return $.some((H6) => H6.pendingUpdate || H6.pendingRemove)
        },
        b = () => {
            let H6 = $.filter((K6) => K6.pendingUpdate).length,
                J6 = $.filter((K6) => K6.pendingRemove).length;
            return {
                updateCount: H6,
                removeCount: J6
            }
        },
        p = async (H6) => {
            let J6 = H6 || $,
                K6 = V === "details";
            P(!0), Z(null), f(null), N(null);
            try {
                let s = L8("userSettings"),
                    X6 = 0,
                    z6 = 0,
                    N6 = new Set;
                for (let O6 of J6) {
                    if (O6.pendingRemove) {
                        if (O6.installedPlugins && O6.installedPlugins.length > 0) {
                            let L6 = {
                                ...s?.enabledPlugins
                            };
                            for (let y6 of O6.installedPlugins) {
                                let G6 = UB(y6.name, O6.name);
                                L6[G6] = !1
                            }
                            TA("userSettings", {
                                enabledPlugins: L6
                            })
                        }
                        await AZ6(O6.name), z6++, d("tengu_marketplace_removed", {
                            marketplace_name: O6.name,
                            plugins_uninstalled: O6.installedPlugins?.length || 0
                        });
                        continue
                    }
                    if (O6.pendingUpdate) await we(O6.name, (L6) => {
                        N(L6)
                    }), X6++, N6.add(O6.name.toLowerCase()), d("tengu_marketplace_updated", {
                        marketplace_name: O6.name
                    })
                }
                let $6 = 0;
                if (N6.size > 0) $6 = (await Kd8(N6)).length;
                if (HY(), _) await _();
                let n = await C3(),
                    {
                        enabled: o,
                        disabled: a
                    } = await _z(),
                    i = [...o, ...a],
                    {
                        marketplaces: l
                    } = await mI(n),
                    q6 = [];
                for (let {
                        name: O6,
                        config: L6,
                        data: y6
                    }
                    of l) {
                    let G6 = i.filter((R6) => R6.source.endsWith(`@${O6}`));
                    q6.push({
                        name: O6,
                        source: gp6(L6.source),
                        lastUpdated: L6.lastUpdated,
                        pluginCount: y6?.plugins.length,
                        installedPlugins: G6,
                        pendingUpdate: !1,
                        pendingRemove: !1,
                        autoUpdate: RC6(O6, L6)
                    })
                }
                if (q6.sort((O6, L6) => {
                        if (O6.name === "claude-plugin-directory") return -1;
                        if (L6.name === "claude-plugin-directory") return 1;
                        return O6.name.localeCompare(L6.name)
                    }), H(q6), K6 && h) {
                    let O6 = q6.find((L6) => L6.name === h.name);
                    if (O6) R(O6)
                }
                let w6 = [];
                if (X6 > 0) {
                    let O6 = $6 > 0 ? ` (${$6} plugin${$6>1?"s":""} bumped)` : "";
                    w6.push(`Updated ${X6} marketplace${X6>1?"s":""}${O6}`)
                }
                if (z6 > 0) w6.push(`Removed ${z6} marketplace${z6>1?"s":""}`);
                if (w6.length > 0) {
                    let O6 = `${a6.tick} ${w6.join(", ")}`;
                    if (K6) f(O6);
                    else Y(O6), setTimeout(A, 2000, {
                        type: "menu"
                    })
                } else if (!K6) A({
                    type: "menu"
                })
            } catch (s) {
                let X6 = _1(s);
                if (Z(X6), K) K(X6)
            } finally {
                P(!1), N(null)
            }
        }, Q = async () => {
            if (!h) return;
            let H6 = $.map((J6) => J6.name === h.name ? {
                ...J6,
                pendingRemove: !0
            } : J6);
            H(H6), await p(H6)
        }, U = (H6) => {
            if (!H6) return [];
            let J6 = [{
                label: `Browse plugins (${H6.pluginCount??0})`,
                value: "browse"
            }, {
                label: "Update marketplace",
                secondaryLabel: H6.lastUpdated ? `(last updated ${new Date(H6.lastUpdated).toLocaleDateString()})` : void 0,
                value: "update"
            }];
            if (!Qv6()) J6.push({
                label: H6.autoUpdate ? "Disable auto-update" : "Enable auto-update",
                value: "toggle-auto-update"
            });
            return J6.push({
                label: "Remove marketplace",
                value: "remove"
            }), J6
        }, r = async (H6) => {
            let J6 = !H6.autoUpdate;
            try {
                await j24(H6.name, J6), H((K6) => K6.map((s) => s.name === H6.name ? {
                    ...s,
                    autoUpdate: J6
                } : s)), R((K6) => K6 ? {
                    ...K6,
                    autoUpdate: J6
                } : K6)
            } catch (K6) {
                Z(K6 instanceof Error ? K6.message : "Failed to update setting")
            }
        };
    if (D8("confirm:no", () => {
            L("list"), I(0)
        }, {
            context: "Confirmation",
            isActive: !X && (V === "details" || V === "confirm-remove")
        }), D8("confirm:no", () => {
            H((H6) => H6.map((J6) => ({
                ...J6,
                pendingUpdate: !1,
                pendingRemove: !1
            }))), D(0)
        }, {
            context: "Confirmation",
            isActive: !X && V === "list" && B()
        }), D8("confirm:no", () => {
            A({
                type: "menu"
            })
        }, {
            context: "Confirmation",
            isActive: !X && V === "list" && !B()
        }), tA({
            "select:previous": () => D((H6) => Math.max(0, H6 - 1)),
            "select:next": () => {
                let H6 = $.length + 1;
                D((J6) => Math.min(H6 - 1, J6 + 1))
            },
            "select:accept": () => {
                let H6 = M - 1;
                if (M === 0) A({
                    type: "add-marketplace"
                });
                else if (B()) p();
                else {
                    let J6 = $[H6];
                    if (J6) R(J6), L("details"), I(0)
                }
            }
        }, {
            context: "Select",
            isActive: !X && V === "list"
        }), jA((H6) => {
            let J6 = M - 1;
            if ((H6 === "u" || H6 === "U") && J6 >= 0) H((K6) => K6.map((s, X6) => X6 === J6 ? {
                ...s,
                pendingUpdate: !s.pendingUpdate,
                pendingRemove: s.pendingUpdate ? s.pendingRemove : !1
            } : s));
            else if ((H6 === "r" || H6 === "R") && J6 >= 0) {
                let K6 = $[J6];
                if (K6) R(K6), L("confirm-remove")
            }
        }, {
            isActive: !X && V === "list"
        }), tA({
            "select:previous": () => I((H6) => Math.max(0, H6 - 1)),
            "select:next": () => {
                let H6 = U(h);
                I((J6) => Math.min(H6.length - 1, J6 + 1))
            },
            "select:accept": () => {
                if (!h) return;
                let J6 = U(h)[u];
                if (J6?.value === "browse") A({
                    type: "browse-marketplace",
                    targetMarketplace: h.name
                });
                else if (J6?.value === "update") {
                    let K6 = $.map((s) => s.name === h.name ? {
                        ...s,
                        pendingUpdate: !0
                    } : s);
                    H(K6), p(K6)
                } else if (J6?.value === "toggle-auto-update") r(h);
                else if (J6?.value === "remove") L("confirm-remove")
            }
        }, {
            context: "Select",
            isActive: !X && V === "details"
        }), jA((H6) => {
            if (H6 === "y" || H6 === "Y") Q();
            else if (H6 === "n" || H6 === "N") L("list"), R(null)
        }, {
            isActive: !X && V === "confirm-remove"
        }), j) return m1.createElement(T, null, "Loading marketplaces…");
    if ($.length === 0) return m1.createElement(m, {
        flexDirection: "column"
    }, m1.createElement(m, {
        marginBottom: 1
    }, m1.createElement(T, {
        bold: !0
    }, "Manage marketplaces")), m1.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, m1.createElement(T, {
        color: "suggestion"
    }, a6.pointer, " +"), m1.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, "Add Marketplace")), m1.createElement(m, {
        marginLeft: 3
    }, m1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, z.pending ? m1.createElement(m1.Fragment, null, "Press ", z.keyName, " again to go back") : m1.createElement(C8, null, m1.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "select"
    }), m1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })))));
    if (V === "confirm-remove" && h) {
        let H6 = h.installedPlugins?.length || 0;
        return m1.createElement(m, {
            flexDirection: "column"
        }, m1.createElement(T, {
            bold: !0,
            color: "warning"
        }, "Remove marketplace ", m1.createElement(T, {
            italic: !0
        }, h.name), "?"), m1.createElement(m, {
            flexDirection: "column"
        }, H6 > 0 && m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, {
            color: "warning"
        }, "This will also uninstall ", H6, " plugin", H6 !== 1 ? "s" : "", " from this marketplace:")), h.installedPlugins && h.installedPlugins.length > 0 && m1.createElement(m, {
            flexDirection: "column",
            marginTop: 1,
            marginLeft: 2
        }, h.installedPlugins.map((J6) => m1.createElement(T, {
            key: J6.name,
            dimColor: !0
        }, "• ", J6.name))), m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, null, "Press ", m1.createElement(T, {
            bold: !0
        }, "y"), " to confirm or ", m1.createElement(T, {
            bold: !0
        }, "n"), " to cancel"))))
    }
    if (V === "details" && h) {
        let H6 = h.pendingUpdate || X,
            J6 = U(h);
        return m1.createElement(m, {
            flexDirection: "column"
        }, m1.createElement(T, {
            bold: !0
        }, h.name), m1.createElement(T, {
            dimColor: !0
        }, h.source), m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, null, h.pluginCount || 0, " available plugin", h.pluginCount !== 1 ? "s" : "")), h.installedPlugins && h.installedPlugins.length > 0 && m1.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, m1.createElement(T, {
            bold: !0
        }, "Installed plugins (", h.installedPlugins.length, "):"), m1.createElement(m, {
            flexDirection: "column",
            marginLeft: 1
        }, h.installedPlugins.map((K6) => m1.createElement(m, {
            key: K6.name,
            flexDirection: "row",
            gap: 1
        }, m1.createElement(T, null, a6.bullet), m1.createElement(m, {
            flexDirection: "column"
        }, m1.createElement(T, null, K6.name), m1.createElement(T, {
            dimColor: !0
        }, K6.manifest.description)))))), H6 && m1.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, m1.createElement(T, {
            color: "claude"
        }, "Updating marketplace…"), v && m1.createElement(T, {
            dimColor: !0
        }, v)), !H6 && G && m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, {
            color: "claude"
        }, G)), !H6 && W && m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, {
            color: "error"
        }, W)), !H6 && m1.createElement(m, {
            flexDirection: "column",
            marginTop: 1
        }, J6.map((K6, s) => {
            if (!K6) return null;
            let X6 = s === u;
            return m1.createElement(m, {
                key: K6.value
            }, m1.createElement(T, {
                color: X6 ? "suggestion" : void 0
            }, X6 ? a6.pointer : " ", " ", K6.label), K6.secondaryLabel && m1.createElement(T, {
                dimColor: !0
            }, " ", K6.secondaryLabel))
        })), !H6 && !Qv6() && h.autoUpdate && m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, {
            dimColor: !0
        }, "Auto-update enabled. Claude Code will automatically update this marketplace and its installed plugins.")), m1.createElement(m, {
            marginLeft: 3
        }, m1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, H6 ? m1.createElement(m1.Fragment, null, "Please wait…") : m1.createElement(C8, null, m1.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), m1.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        })))))
    }
    let {
        updateCount: e,
        removeCount: Y6
    } = b();
    return m1.createElement(m, {
        flexDirection: "column"
    }, m1.createElement(m, {
        marginBottom: 1
    }, m1.createElement(T, {
        bold: !0
    }, "Manage marketplaces")), m1.createElement(m, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1
    }, m1.createElement(T, {
        color: M === 0 ? "suggestion" : void 0
    }, M === 0 ? a6.pointer : " ", " +"), m1.createElement(T, {
        bold: !0,
        color: M === 0 ? "suggestion" : void 0
    }, "Add Marketplace")), m1.createElement(m, {
        flexDirection: "column"
    }, $.map((H6, J6) => {
        let K6 = J6 + 1 === M,
            s = [];
        if (H6.pendingUpdate) s.push("UPDATE");
        if (H6.pendingRemove) s.push("REMOVE");
        return m1.createElement(m, {
            key: H6.name,
            flexDirection: "row",
            gap: 1,
            marginBottom: 1
        }, m1.createElement(T, {
            color: K6 ? "suggestion" : void 0
        }, K6 ? a6.pointer : " ", " ", H6.pendingRemove ? a6.cross : a6.bullet), m1.createElement(m, {
            flexDirection: "column",
            flexGrow: 1
        }, m1.createElement(m, {
            flexDirection: "row",
            gap: 1
        }, m1.createElement(T, {
            bold: !0,
            strikethrough: H6.pendingRemove,
            dimColor: H6.pendingRemove
        }, H6.name === "claude-plugins-official" && m1.createElement(T, {
            color: "claude"
        }, "✻ "), H6.name, H6.name === "claude-plugins-official" && m1.createElement(T, {
            color: "claude"
        }, " ✻")), s.length > 0 && m1.createElement(T, {
            color: "warning"
        }, "[", s.join(", "), "]")), m1.createElement(T, {
            dimColor: !0
        }, H6.source), m1.createElement(T, {
            dimColor: !0
        }, H6.pluginCount !== void 0 && m1.createElement(m1.Fragment, null, H6.pluginCount, " available"), H6.installedPlugins && H6.installedPlugins.length > 0 && m1.createElement(m1.Fragment, null, " • ", H6.installedPlugins.length, " installed"), H6.lastUpdated && m1.createElement(m1.Fragment, null, " ", "• Updated", " ", new Date(H6.lastUpdated).toLocaleDateString()))))
    })), B() && m1.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, m1.createElement(T, null, m1.createElement(T, {
        bold: !0
    }, "Pending changes:"), " ", m1.createElement(T, {
        dimColor: !0
    }, "Enter to apply")), e > 0 && m1.createElement(T, null, "• Update ", e, " marketplace", e > 1 ? "s" : ""), Y6 > 0 && m1.createElement(T, {
        color: "warning"
    }, "• Remove ", Y6, " marketplace", Y6 > 1 ? "s" : "")), X && m1.createElement(m, {
        marginTop: 1
    }, m1.createElement(T, {
        color: "claude"
    }, "Processing changes…")), W && m1.createElement(m, {
        marginTop: 1
    }, m1.createElement(T, {
        color: "error"
    }, W)), m1.createElement(IiY, {
        exitState: z,
        hasPendingActions: B()
    }))
}
// @from(Ln 400879, Col 0)
function IiY(A) {
    let q = A6(18),
        {
            exitState: K,
            hasPendingActions: Y
        } = A;
    if (K.pending) {
        let J;
        if (q[0] !== K.keyName) J = m1.createElement(m, {
            marginTop: 1
        }, m1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Press ", K.keyName, " again to go back")), q[0] = K.keyName, q[1] = J;
        else J = q[1];
        return J
    }
    let z;
    if (q[2] !== Y) z = Y && m1.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "apply changes"
    }), q[2] = Y, q[3] = z;
    else z = q[3];
    let _;
    if (q[4] !== Y) _ = !Y && m1.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "select"
    }), q[4] = Y, q[5] = _;
    else _ = q[5];
    let w;
    if (q[6] !== Y) w = !Y && m1.createElement(a1, {
        shortcut: "u",
        action: "update"
    }), q[6] = Y, q[7] = w;
    else w = q[7];
    let O;
    if (q[8] !== Y) O = !Y && m1.createElement(a1, {
        shortcut: "r",
        action: "remove"
    }), q[8] = Y, q[9] = O;
    else O = q[9];
    let $ = Y ? "cancel" : "go back",
        H;
    if (q[10] !== $) H = m1.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: $
    }), q[10] = $, q[11] = H;
    else H = q[11];
    let j;
    if (q[12] !== z || q[13] !== _ || q[14] !== w || q[15] !== O || q[16] !== H) j = m1.createElement(m, {
        marginTop: 1
    }, m1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, m1.createElement(C8, null, z, _, w, O, H))), q[12] = z, q[13] = _, q[14] = w, q[15] = O, q[16] = H, q[17] = j;
    else j = q[17];
    return j
}
// @from(Ln 400943, Col 4)
m1
// @from(Ln 400943, Col 8)
pf
// @from(Ln 400944, Col 4)
Nwq = E(() => {
    e6();
    i6();
    i6();
    _7();
    b7();
    Xq();
    Lq();
    OK();
    Aw();
    Uv();
    V1();
    tH();
    dB();
    IW();
    hL1();
    k8();
    i8();
    s8();
    m1 = t(P6(), 1), pf = t(P6(), 1)
})
// @from(Ln 400966, Col 0)
function Uv6({
    totalItems: A,
    maxVisible: q = biY,
    selectedIndex: K = 0
}) {
    let Y = A > q,
        z = EE.useRef(0),
        _ = EE.useMemo(() => {
            if (!Y) return 0;
            let G = z.current;
            if (K < G) return z.current = K, K;
            if (K >= G + q) {
                let N = K - q + 1;
                return z.current = N, N
            }
            let f = Math.max(0, A - q),
                v = Math.min(G, f);
            return z.current = v, v
        }, [K, q, Y, A]),
        w = _,
        O = Math.min(_ + q, A),
        $ = EE.useCallback((G) => {
            if (!Y) return G;
            return G.slice(w, O)
        }, [Y, w, O]),
        H = EE.useCallback((G) => {
            return w + G
        }, [w]),
        j = EE.useCallback((G) => {
            return G >= w && G < O
        }, [w, O]),
        J = EE.useCallback((G) => {}, []),
        M = EE.useCallback(() => {}, []),
        D = EE.useCallback(() => {}, []),
        X = EE.useCallback((G, f) => {
            let v = Math.max(0, Math.min(G, A - 1));
            f(v)
        }, [A]),
        P = EE.useCallback((G, f) => {
            return !1
        }, []),
        W = Math.max(1, Math.ceil(A / q));
    return {
        currentPage: Math.floor(_ / q),
        totalPages: W,
        startIndex: w,
        endIndex: O,
        needsPagination: Y,
        pageSize: q,
        getVisibleItems: $,
        toActualIndex: H,
        isOnCurrentPage: j,
        goToPage: J,
        nextPage: M,
        prevPage: D,
        handleSelectionChange: X,
        handlePageNavigation: P,
        scrollPosition: {
            current: K + 1,
            total: A,
            canScrollUp: _ > 0,
            canScrollDown: _ + q < A
        }
    }
}
// @from(Ln 401031, Col 4)
EE
// @from(Ln 401031, Col 8)
biY = 5
// @from(Ln 401032, Col 4)
SL1 = E(() => {
    EE = t(P6(), 1)
})
// @from(Ln 401036, Col 0)
function CL1() {
    let A = A6(3),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = V_4(), A[0] = q;
    else q = A[0];
    let K = q,
        Y;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) Y = j_6.createElement(T, {
        color: "claude"
    }, a6.warning, " "), A[1] = Y;
    else Y = A[1];
    let z;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) z = j_6.createElement(m, {
        marginBottom: 1
    }, Y, j_6.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.", K ? ` ${K}` : "")), A[2] = z;
    else z = A[2];
    return z
}
// @from(Ln 401057, Col 4)
j_6
// @from(Ln 401058, Col 4)
Yd8 = E(() => {
    e6();
    i6();
    b7();
    dB();
    j_6 = t(P6(), 1)
})
// @from(Ln 401066, Col 0)
function N16(A) {
    if (A.entry.source && typeof A.entry.source === "object" && "source" in A.entry.source && A.entry.source.source === "github" && typeof A.entry.source === "object" && "repo" in A.entry.source) return A.entry.source.repo;
    return null
}
// @from(Ln 401071, Col 0)
function dv6(A, q) {
    let K = [{
        label: "Install for you (user scope)",
        action: "install-user"
    }, {
        label: "Install for all collaborators on this repository (project scope)",
        action: "install-project"
    }, {
        label: "Install for you, in this repo only (local scope)",
        action: "install-local"
    }];
    if (A) K.push({
        label: "Open homepage",
        action: "homepage"
    });
    if (q) K.push({
        label: "View on GitHub",
        action: "github"
    });
    return K.push({
        label: "Back to plugin list",
        action: "back"
    }), K
}
// @from(Ln 401096, Col 0)
function Vwq(A) {
    let q = A6(7),
        {
            hasSelection: K
        } = A,
        Y;
    if (q[0] !== K) Y = K && Qf.createElement(O8, {
        action: "plugin:install",
        context: "Plugin",
        fallback: "i",
        description: "install",
        bold: !0
    }), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z, _, w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = Qf.createElement(O8, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), _ = Qf.createElement(O8, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), w = Qf.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), q[2] = z, q[3] = _, q[4] = w;
    else z = q[2], _ = q[3], w = q[4];
    let O;
    if (q[5] !== Y) O = Qf.createElement(m, {
        marginTop: 1
    }, Qf.createElement(T, {
        dimColor: !0,
        italic: !0
    }, Qf.createElement(C8, null, Y, z, _, w))), q[5] = Y, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 401138, Col 4)
Qf
// @from(Ln 401139, Col 4)
zd8 = E(() => {
    e6();
    i6();
    Xq();
    OK();
    Qf = t(P6(), 1)
})
// @from(Ln 401159, Col 0)
function Ewq() {
    return xiY(eH(), piY)
}
// @from(Ln 401162, Col 0)
async function UiY() {
    let A = Ewq();
    try {
        let q = await miY(A, {
                encoding: "utf-8"
            }),
            K = i1(q);
        if (typeof K !== "object" || K === null || !("version" in K) || !("fetchedAt" in K) || !("counts" in K)) return k("Install counts cache has invalid structure"), null;
        let Y = K;
        if (Y.version !== _d8) return k(`Install counts cache version mismatch (got ${Y.version}, expected ${_d8})`), null;
        if (typeof Y.fetchedAt !== "string" || !Array.isArray(Y.counts)) return k("Install counts cache has invalid structure"), null;
        let z = new Date(Y.fetchedAt).getTime();
        if (Number.isNaN(z)) return k("Install counts cache has invalid fetchedAt timestamp"), null;
        if (!Y.counts.every((O) => typeof O === "object" && O !== null && typeof O.plugin === "string" && typeof O.unique_installs === "number")) return k("Install counts cache has malformed entries"), null;
        if (Date.now() - z > QiY) return k("Install counts cache is stale (>24h old)"), null;
        return {
            version: Y.version,
            fetchedAt: Y.fetchedAt,
            counts: Y.counts
        }
    } catch (q) {
        if (q.code !== "ENOENT") k(`Failed to load install counts cache: ${_1(q)}`);
        return null
    }
}
// @from(Ln 401187, Col 0)
async function diY(A) {
    let q = Ewq(),
        K = `${q}.${uiY(8).toString("hex")}.tmp`;
    try {
        let Y = eH();
        await $1().mkdir(Y);
        let z = B6(A, null, 2);
        await BiY(K, z, {
            encoding: "utf-8",
            mode: 384
        }), await giY(K, q), k("Install counts cache saved successfully")
    } catch (Y) {
        _6(Y);
        try {
            await FiY(K)
        } catch {}
    }
}
// @from(Ln 401205, Col 0)
async function ciY() {
    k(`Fetching install counts from ${kwq}`);
    let A = await X8.get(kwq, {
        timeout: 1e4
    });
    if (!A.data?.plugins || !Array.isArray(A.data.plugins)) throw Error("Invalid response format from install counts API");
    return A.data.plugins
}
// @from(Ln 401213, Col 0)
async function cv6() {
    let A = await UiY();
    if (A) {
        k("Using cached install counts");
        let q = new Map;
        for (let K of A.counts) q.set(K.plugin, K.unique_installs);
        return q
    }
    try {
        let q = await ciY(),
            K = {
                version: _d8,
                fetchedAt: new Date().toISOString(),
                counts: q
            };
        await diY(K);
        let Y = new Map;
        for (let z of q) Y.set(z.plugin, z.unique_installs);
        return Y
    } catch (q) {
        return _6(q), k(`Failed to fetch install counts: ${_1(q)}`), null
    }
}
// @from(Ln 401237, Col 0)
function IL1(A) {
    if (A < 1000) return String(A);
    if (A < 1e6) {
        let z = (A / 1000).toFixed(1);
        return z.endsWith(".0") ? `${z.slice(0,-2)}K` : `${z}K`
    }
    let K = (A / 1e6).toFixed(1);
    return K.endsWith(".0") ? `${K.slice(0,-2)}M` : `${K}M`
}
// @from(Ln 401246, Col 4)
_d8 = 1
// @from(Ln 401247, Col 4)
piY = "install-counts-cache.json"
// @from(Ln 401248, Col 4)
kwq = "https://raw.githubusercontent.com/anthropics/claude-plugins-official/refs/heads/stats/stats/plugin-installs.json"
// @from(Ln 401249, Col 4)
QiY = 86400000
// @from(Ln 401250, Col 4)
bL1 = E(() => {
    kK();
    SA();
    ze();
    H1();
    k1();
    g1();
    s8()
})
// @from(Ln 401259, Col 4)
wd8
// @from(Ln 401259, Col 9)
db = "claude-plugins-official"
// @from(Ln 401260, Col 4)
lv6 = E(() => {
    wd8 = {
        source: "github",
        repo: "anthropics/claude-plugins-official"
    }
})
// @from(Ln 401266, Col 4)
xL1 = () => {}
// @from(Ln 401268, Col 0)
function ywq({
    error: A,
    setError: q,
    result: K,
    setResult: Y,
    setViewState: z,
    onInstallComplete: _,
    targetMarketplace: w,
    targetPlugin: O
}) {
    let [$, H] = JD.useState("marketplace-list"), [j, J] = JD.useState(null), [M, D] = JD.useState(null), [X, P] = JD.useState([]), [W, Z] = JD.useState([]), [G, f] = JD.useState(!0), [v, N] = JD.useState(null), [V, L] = JD.useState(0), [h, R] = JD.useState(new Set), [u, I] = JD.useState(new Set), g = Uv6({
        totalItems: W.length,
        selectedIndex: V
    }), [B, b] = JD.useState(0), [p, Q] = JD.useState(!1), [U, r] = JD.useState(null), [e, Y6] = JD.useState(null), H6 = q8.useCallback(() => {
        if ($ === "plugin-list")
            if (w) z({
                type: "manage-marketplaces",
                targetMarketplace: w
            });
            else if (X.length === 1) z({
            type: "menu"
        });
        else H("marketplace-list"), J(null), R(new Set);
        else if ($ === "plugin-details") H("plugin-list"), D(null);
        else z({
            type: "menu"
        })
    }, [$, w, z, X.length]);
    D8("confirm:no", H6, {
        context: "Confirmation"
    }), JD.useEffect(() => {
        async function z6() {
            try {
                let N6 = await C3(),
                    {
                        marketplaces: $6,
                        failures: n
                    } = await mI(N6),
                    o = [];
                for (let {
                        name: l,
                        config: q6,
                        data: w6
                    }
                    of $6)
                    if (w6) {
                        let O6 = w6.plugins.filter((L6) => iB(UB(L6.name, l))).length;
                        o.push({
                            name: l,
                            totalPlugins: w6.plugins.length,
                            installedCount: O6,
                            source: gp6(q6.source)
                        })
                    } o.sort((l, q6) => {
                    if (l.name === "claude-plugin-directory") return -1;
                    if (q6.name === "claude-plugin-directory") return 1;
                    return 0
                }), P(o);
                let a = $6.filter((l) => l.data !== null).length,
                    i = iW6(n, a);
                if (i)
                    if (i.type === "warning") Y6(i.message + ". Showing available marketplaces.");
                    else throw Error(i.message);
                if (o.length === 1 && !w && !O) {
                    let l = o[0];
                    if (l) J(l.name), H("plugin-list")
                }
                if (O) {
                    let l = null,
                        q6 = null;
                    for (let [w6] of Object.entries(N6)) {
                        let O6 = await j0(w6);
                        if (O6) {
                            let L6 = O6.plugins.find((y6) => y6.name === O);
                            if (L6) {
                                let y6 = UB(L6.name, w6);
                                l = {
                                    entry: L6,
                                    marketplaceName: w6,
                                    pluginId: y6,
                                    isInstalled: nW6(y6)
                                }, q6 = w6;
                                break
                            }
                        }
                    }
                    if (l && q6) {
                        let w6 = l.pluginId;
                        if (nW6(w6)) q(`Plugin '${w6}' is already installed globally. Use '/plugin' to manage existing plugins.`);
                        else J(q6), D(l), H("plugin-details")
                    } else q(`Plugin "${O}" not found in any marketplace`)
                } else if (w)
                    if (o.some((q6) => q6.name === w)) J(w), H("plugin-list");
                    else q(`Marketplace "${w}" not found`)
            } catch (N6) {
                q(N6 instanceof Error ? N6.message : "Failed to load marketplaces")
            } finally {
                f(!1)
            }
        }
        z6()
    }, [q, w, O]), JD.useEffect(() => {
        if (!j) return;
        async function z6(N6) {
            f(!0);
            try {
                let $6 = await j0(N6);
                if (!$6) throw Error(`Failed to load marketplace: ${N6}`);
                let n = [];
                for (let o of $6.plugins) {
                    let a = UB(o.name, N6);
                    n.push({
                        entry: o,
                        marketplaceName: N6,
                        pluginId: a,
                        isInstalled: nW6(a)
                    })
                }
                try {
                    let o = await cv6();
                    if (N(o), o) n.sort((a, i) => {
                        let l = o.get(a.pluginId) ?? 0,
                            q6 = o.get(i.pluginId) ?? 0;
                        if (l !== q6) return q6 - l;
                        return a.entry.name.localeCompare(i.entry.name)
                    });
                    else n.sort((a, i) => a.entry.name.localeCompare(i.entry.name))
                } catch (o) {
                    k(`Failed to fetch install counts: ${_1(o)}`), n.sort((a, i) => a.entry.name.localeCompare(i.entry.name))
                }
                Z(n), L(0), R(new Set)
            } catch ($6) {
                q($6 instanceof Error ? $6.message : "Failed to load plugins")
            } finally {
                f(!1)
            }
        }
        z6(j)
    }, [j, q]);
    let J6 = async () => {
        if (h.size === 0) return;
        let z6 = W.filter((o) => h.has(o.pluginId));
        I(new Set(z6.map((o) => o.pluginId)));
        let N6 = 0,
            $6 = 0,
            n = [];
        for (let o of z6) {
            let a = await qZ6({
                pluginId: o.pluginId,
                entry: o.entry,
                marketplaceName: o.marketplaceName,
                scope: "user"
            });
            if (a.success) N6++;
            else $6++, n.push({
                name: o.entry.name,
                reason: a.error
            })
        }
        if (I(new Set), R(new Set), HY(), $6 === 0) {
            let o = `✓ Installed ${N6} plugin${N6!==1?"s":""}. Run /reload-plugins to activate.`;
            Y(o)
        } else if (N6 === 0) q(`Failed to install: ${lW6(n,!0)}`);
        else {
            let o = `✓ Installed ${N6} of ${N6+$6} plugins. Failed: ${lW6(n,!1)}. Run /reload-plugins to activate successfully installed plugins.`;
            Y(o)
        }
        if (N6 > 0) {
            if (_) await _()
        }
        z({
            type: "menu"
        })
    }, K6 = async (z6, N6 = "user") => {
        Q(!0), r(null);
        let $6 = await qZ6({
            pluginId: z6.pluginId,
            entry: z6.entry,
            marketplaceName: z6.marketplaceName,
            scope: N6
        });
        if ($6.success) {
            if (Y($6.message), _) await _();
            z({
                type: "menu"
            })
        } else Q(!1), r($6.error)
    };
    JD.useEffect(() => {
        if (A) Y(A)
    }, [A, Y]), tA({
        "select:previous": () => {
            if (V > 0) L(V - 1)
        },
        "select:next": () => {
            if (V < X.length - 1) L(V + 1)
        },
        "select:accept": () => {
            let z6 = X[V];
            if (z6) J(z6.name), H("plugin-list")
        }
    }, {
        context: "Select",
        isActive: $ === "marketplace-list"
    }), tA({
        "select:previous": () => {
            if (V > 0) g.handleSelectionChange(V - 1, L)
        },
        "select:next": () => {
            if (V < W.length - 1) g.handleSelectionChange(V + 1, L)
        },
        "select:accept": () => {
            if (V === W.length && h.size > 0) J6();
            else if (V < W.length) {
                let z6 = W[V];
                if (z6)
                    if (z6.isInstalled) z({
                        type: "manage-plugins",
                        targetPlugin: z6.entry.name,
                        targetMarketplace: z6.marketplaceName
                    });
                    else D(z6), H("plugin-details"), b(0), r(null)
            }
        }
    }, {
        context: "Select",
        isActive: $ === "plugin-list"
    }), tA({
        "plugin:toggle": () => {
            if (V < W.length) {
                let z6 = W[V];
                if (z6 && !z6.isInstalled) {
                    let N6 = new Set(h);
                    if (N6.has(z6.pluginId)) N6.delete(z6.pluginId);
                    else N6.add(z6.pluginId);
                    R(N6)
                }
            }
        },
        "plugin:install": () => {
            if (h.size > 0) J6()
        }
    }, {
        context: "Plugin",
        isActive: $ === "plugin-list"
    });
    let s = q8.useMemo(() => {
        if (!M) return [];
        let z6 = M.entry.homepage,
            N6 = N16(M);
        return dv6(z6, N6)
    }, [M]);
    if (tA({
            "select:previous": () => {
                if (B > 0) b(B - 1)
            },
            "select:next": () => {
                if (B < s.length - 1) b(B + 1)
            },
            "select:accept": () => {
                if (!M) return;
                let z6 = s[B]?.action,
                    N6 = M.entry.homepage,
                    $6 = N16(M);
                if (z6 === "install-user") K6(M, "user");
                else if (z6 === "install-project") K6(M, "project");
                else if (z6 === "install-local") K6(M, "local");
                else if (z6 === "homepage" && N6) R9(N6);
                else if (z6 === "github" && $6) R9(`https://github.com/${$6}`);
                else if (z6 === "back") H("plugin-list"), D(null)
            }
        }, {
            context: "Select",
            isActive: $ === "plugin-details" && !!M
        }), G) return q8.createElement(T, null, "Loading…");
    if (A) return q8.createElement(T, {
        color: "error"
    }, A);
    if ($ === "marketplace-list") {
        if (X.length === 0) return q8.createElement(m, {
            flexDirection: "column"
        }, q8.createElement(m, {
            marginBottom: 1
        }, q8.createElement(T, {
            bold: !0
        }, "Select marketplace")), q8.createElement(T, null, "No marketplaces configured."), q8.createElement(T, {
            dimColor: !0
        }, "Add a marketplace first using ", "'Add marketplace'", "."), q8.createElement(m, {
            marginTop: 1,
            paddingLeft: 1
        }, q8.createElement(T, {
            dimColor: !0
        }, q8.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }))));
        return q8.createElement(m, {
            flexDirection: "column"
        }, q8.createElement(m, {
            marginBottom: 1
        }, q8.createElement(T, {
            bold: !0
        }, "Select marketplace")), e && q8.createElement(m, {
            marginBottom: 1,
            flexDirection: "column"
        }, q8.createElement(T, {
            color: "warning"
        }, a6.warning, " ", e)), X.map((z6, N6) => q8.createElement(m, {
            key: z6.name,
            flexDirection: "column",
            marginBottom: N6 < X.length - 1 ? 1 : 0
        }, q8.createElement(m, null, q8.createElement(T, {
            color: V === N6 ? "suggestion" : void 0
        }, V === N6 ? a6.pointer : " ", " ", z6.name)), q8.createElement(m, {
            marginLeft: 2
        }, q8.createElement(T, {
            dimColor: !0
        }, z6.totalPlugins, " plugin", z6.totalPlugins !== 1 ? "s" : "", " available", z6.installedCount > 0 && ` · ${z6.installedCount} already installed`, z6.source && ` · ${z6.source}`)))), q8.createElement(m, {
            marginTop: 1
        }, q8.createElement(T, {
            dimColor: !0,
            italic: !0
        }, q8.createElement(C8, null, q8.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), q8.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        })))))
    }
    if ($ === "plugin-details" && M) {
        let z6 = M.entry.homepage,
            N6 = N16(M),
            $6 = dv6(z6, N6);
        return q8.createElement(m, {
            flexDirection: "column"
        }, q8.createElement(m, {
            marginBottom: 1
        }, q8.createElement(T, {
            bold: !0
        }, "Plugin Details")), q8.createElement(m, {
            flexDirection: "column",
            marginBottom: 1
        }, q8.createElement(T, {
            bold: !0
        }, M.entry.name), M.entry.version && q8.createElement(T, {
            dimColor: !0
        }, "Version: ", M.entry.version), M.entry.description && q8.createElement(m, {
            marginTop: 1
        }, q8.createElement(T, null, M.entry.description)), M.entry.author && q8.createElement(m, {
            marginTop: 1
        }, q8.createElement(T, {
            dimColor: !0
        }, "By:", " ", typeof M.entry.author === "string" ? M.entry.author : M.entry.author.name))), q8.createElement(m, {
            flexDirection: "column",
            marginBottom: 1
        }, q8.createElement(T, {
            bold: !0
        }, "Will install:"), M.entry.commands && q8.createElement(T, {
            dimColor: !0
        }, "• Commands:", " ", Array.isArray(M.entry.commands) ? M.entry.commands.join(", ") : Object.keys(M.entry.commands).join(", ")), M.entry.agents && q8.createElement(T, {
            dimColor: !0
        }, "• Agents:", " ", Array.isArray(M.entry.agents) ? M.entry.agents.join(", ") : Object.keys(M.entry.agents).join(", ")), M.entry.hooks && q8.createElement(T, {
            dimColor: !0
        }, "• Hooks: ", Object.keys(M.entry.hooks).join(", ")), M.entry.mcpServers && q8.createElement(T, {
            dimColor: !0
        }, "• MCP Servers:", " ", Array.isArray(M.entry.mcpServers) ? M.entry.mcpServers.join(", ") : typeof M.entry.mcpServers === "object" ? Object.keys(M.entry.mcpServers).join(", ") : "configured"), !M.entry.commands && !M.entry.agents && !M.entry.hooks && !M.entry.mcpServers && q8.createElement(q8.Fragment, null, typeof M.entry.source === "object" && "source" in M.entry.source && (M.entry.source.source === "github" || M.entry.source.source === "url" || M.entry.source.source === "npm" || M.entry.source.source === "pip") ? q8.createElement(T, {
            dimColor: !0
        }, "• Component summary not available for remote plugin") : q8.createElement(T, {
            dimColor: !0
        }, "• Components will be discovered at installation"))), q8.createElement(CL1, null), U && q8.createElement(m, {
            marginBottom: 1
        }, q8.createElement(T, {
            color: "error"
        }, "Error: ", U)), q8.createElement(m, {
            flexDirection: "column"
        }, $6.map((n, o) => q8.createElement(m, {
            key: n.action
        }, B === o && q8.createElement(T, null, "> "), B !== o && q8.createElement(T, null, "  "), q8.createElement(T, {
            bold: B === o
        }, p && n.action === "install" ? "Installing…" : n.label)))), q8.createElement(m, {
            marginTop: 1,
            paddingLeft: 1
        }, q8.createElement(T, {
            dimColor: !0
        }, q8.createElement(C8, null, q8.createElement(O8, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), q8.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (W.length === 0) return q8.createElement(m, {
        flexDirection: "column"
    }, q8.createElement(m, {
        marginBottom: 1
    }, q8.createElement(T, {
        bold: !0
    }, "Install plugins")), q8.createElement(T, {
        dimColor: !0
    }, "No new plugins available to install."), q8.createElement(T, {
        dimColor: !0
    }, "All plugins from this marketplace are already installed."), q8.createElement(m, {
        marginLeft: 3
    }, q8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, q8.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let X6 = g.getVisibleItems(W);
    return q8.createElement(m, {
        flexDirection: "column"
    }, q8.createElement(m, {
        marginBottom: 1
    }, q8.createElement(T, {
        bold: !0
    }, "Install Plugins")), g.scrollPosition.canScrollUp && q8.createElement(m, null, q8.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowUp, " more above")), X6.map((z6, N6) => {
        let $6 = g.toActualIndex(N6),
            n = V === $6,
            o = h.has(z6.pluginId),
            a = u.has(z6.pluginId),
            i = N6 === X6.length - 1;
        return q8.createElement(m, {
            key: z6.pluginId,
            flexDirection: "column",
            marginBottom: i && !A ? 0 : 1
        }, q8.createElement(m, null, q8.createElement(T, {
            color: n ? "suggestion" : void 0
        }, n ? a6.pointer : " ", " "), q8.createElement(T, {
            color: z6.isInstalled ? "success" : void 0
        }, z6.isInstalled ? a6.tick : a ? a6.ellipsis : o ? a6.radioOn : a6.radioOff, " ", z6.entry.name, z6.entry.category && q8.createElement(T, {
            dimColor: !0
        }, " [", z6.entry.category, "]"), z6.entry.tags?.includes("community-managed") && q8.createElement(T, {
            dimColor: !0
        }, " [Community Managed]"), z6.isInstalled && q8.createElement(T, {
            dimColor: !0
        }, " (installed)"), v && j === db && q8.createElement(T, {
            dimColor: !0
        }, " · ", IL1(v.get(z6.pluginId) ?? 0), " ", "installs"))), z6.entry.description && q8.createElement(m, {
            marginLeft: 4
        }, q8.createElement(T, {
            dimColor: !0
        }, z6.entry.description.length > 60 ? z6.entry.description.substring(0, 57) + "..." : z6.entry.description), z6.entry.version && q8.createElement(T, {
            dimColor: !0
        }, " · v", z6.entry.version)))
    }), g.scrollPosition.canScrollDown && q8.createElement(m, null, q8.createElement(T, {
        dimColor: !0
    }, " ", a6.arrowDown, " more below")), A && q8.createElement(m, {
        marginTop: 1
    }, q8.createElement(T, {
        color: "error"
    }, a6.cross, " ", A)), q8.createElement(Vwq, {
        hasSelection: h.size > 0
    }))
}
// @from(Ln 401740, Col 4)
q8
// @from(Ln 401740, Col 8)
JD
// @from(Ln 401741, Col 4)
Lwq = E(() => {
    i6();
    b7();
    Xq();
    OK();
    _7();
    Aw();
    dB();
    Uv();
    H1();
    kX();
    M96();
    fX();
    SL1();
    Yd8();
    zd8();
    bL1();
    lv6();
    s8();
    xL1();
    q8 = t(P6(), 1), JD = t(P6(), 1)
})