
// @from(Ln 452050, Col 0)
function H_8(q) {
    let K = s(44),
        {
            tool: _,
            server: z,
            onBack: Y
        } = q,
        [A, O] = f2.default.useState(""),
        w, $;
    if (K[0] !== z.name || K[1] !== _) {
        $ = fX8(_.name, z.name);
        let F = _.userFacingName ? _.userFacingName({}) : $;
        w = GX8(F), K[0] = z.name, K[1] = _, K[2] = w, K[3] = $
    } else w = K[2], $ = K[3];
    let j = w,
        H;
    if (K[4] !== _) H = _.isReadOnly?.({}) ?? !1, K[4] = _, K[5] = H;
    else H = K[5];
    let J = H,
        X;
    if (K[6] !== _) X = _.isDestructive?.({}) ?? !1, K[6] = _, K[7] = X;
    else X = K[7];
    let M = X,
        P;
    if (K[8] !== _) P = _.isOpenWorld?.({}) ?? !1, K[8] = _, K[9] = P;
    else P = K[9];
    let W = P,
        D, Z;
    if (K[10] !== _) D = () => {
        (async function() {
            try {
                let g = await _.description({}, {
                    isNonInteractiveSession: !1,
                    toolPermissionContext: {
                        mode: "default",
                        additionalWorkingDirectories: new Map,
                        alwaysAllowRules: {},
                        alwaysDenyRules: {},
                        alwaysAskRules: {},
                        isBypassPermissionsModeAvailable: !1
                    },
                    tools: []
                });
                O(g)
            } catch {
                O("Failed to load description")
            }
        })()
    }, Z = [_], K[10] = _, K[11] = D, K[12] = Z;
    else D = K[11], Z = K[12];
    f2.default.useEffect(D, Z);
    let G;
    if (K[13] !== J) G = J && f2.default.createElement(T, {
        color: "success"
    }, " [read-only]"), K[13] = J, K[14] = G;
    else G = K[14];
    let f;
    if (K[15] !== M) f = M && f2.default.createElement(T, {
        color: "error"
    }, " [destructive]"), K[15] = M, K[16] = f;
    else f = K[16];
    let v;
    if (K[17] !== W) v = W && f2.default.createElement(T, {
        dimColor: !0
    }, " [open-world]"), K[17] = W, K[18] = v;
    else v = K[18];
    let V;
    if (K[19] !== j || K[20] !== G || K[21] !== f || K[22] !== v) V = f2.default.createElement(f2.default.Fragment, null, j, G, f, v), K[19] = j, K[20] = G, K[21] = f, K[22] = v, K[23] = V;
    else V = K[23];
    let k = V,
        N;
    if (K[24] === Symbol.for("react.memo_cache_sentinel")) N = f2.default.createElement(T, {
        bold: !0
    }, "Tool name: "), K[24] = N;
    else N = K[24];
    let R;
    if (K[25] !== $) R = f2.default.createElement(u, null, N, f2.default.createElement(T, {
        dimColor: !0
    }, $)), K[25] = $, K[26] = R;
    else R = K[26];
    let h;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) h = f2.default.createElement(T, {
        bold: !0
    }, "Full name: "), K[27] = h;
    else h = K[27];
    let C;
    if (K[28] !== _.name) C = f2.default.createElement(u, null, h, f2.default.createElement(T, {
        dimColor: !0
    }, _.name)), K[28] = _.name, K[29] = C;
    else C = K[29];
    let x;
    if (K[30] !== A) x = A && f2.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, f2.default.createElement(T, {
        bold: !0
    }, "Description:"), f2.default.createElement(T, {
        wrap: "wrap"
    }, A)), K[30] = A, K[31] = x;
    else x = K[31];
    let B;
    if (K[32] !== _.inputJSONSchema) B = _.inputJSONSchema && _.inputJSONSchema.properties && Object.keys(_.inputJSONSchema.properties).length > 0 && f2.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, f2.default.createElement(T, {
        bold: !0
    }, "Parameters:"), f2.default.createElement(u, {
        marginLeft: 2,
        flexDirection: "column"
    }, Object.entries(_.inputJSONSchema.properties).map((F) => {
        let [U, g] = F, n = _.inputJSONSchema?.required?.includes(U);
        return f2.default.createElement(T, {
            key: U
        }, "• ", U, f2.default.createElement(CP6, {
            when: n ?? !1
        }, "required"), ":", " ", f2.default.createElement(T, {
            dimColor: !0
        }, typeof g === "object" && g && "type" in g ? String(g.type) : "unknown"), typeof g === "object" && g && "description" in g && f2.default.createElement(T, {
            dimColor: !0
        }, " - ", String(g.description)))
    }))), K[32] = _.inputJSONSchema, K[33] = B;
    else B = K[33];
    let m;
    if (K[34] !== R || K[35] !== C || K[36] !== x || K[37] !== B) m = f2.default.createElement(u, {
        flexDirection: "column"
    }, R, C, x, B), K[34] = R, K[35] = C, K[36] = x, K[37] = B, K[38] = m;
    else m = K[38];
    let S;
    if (K[39] !== Y || K[40] !== z.name || K[41] !== m || K[42] !== k) S = f2.default.createElement(R1, {
        title: k,
        subtitle: z.name,
        onCancel: Y,
        inputGuide: yIY
    }, m), K[39] = Y, K[40] = z.name, K[41] = m, K[42] = k, K[43] = S;
    else S = K[43];
    return S
}
// @from(Ln 452188, Col 0)
function yIY(q) {
    return q.pending ? f2.default.createElement(T, null, "Press ", q.keyName, " again to exit") : f2.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })
}
// @from(Ln 452196, Col 4)
f2
// @from(Ln 452197, Col 4)
Ri8 = L(() => {
    o6();
    g6();
    fh();
    bK();
    Xi8();
    S4();
    f2 = K6(P6(), 1)
})
// @from(Ln 452207, Col 0)
function J_8(q) {
    let K = s(21),
        {
            server: _,
            onSelectTool: z,
            onBack: Y
        } = q,
        A = M8(hIY),
        O;
    q: {
        if (_.client.type !== "connected") {
            let Z;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) Z = [], K[0] = Z;
            else Z = K[0];
            O = Z;
            break q
        }
        let D;
        if (K[1] !== A || K[2] !== _.name) D = Ll(A, _.name),
        K[1] = A,
        K[2] = _.name,
        K[3] = D;
        else D = K[3];O = D
    }
    let w = O,
        $;
    if (K[4] !== _.name || K[5] !== w) {
        let D;
        if (K[7] !== _.name) D = (Z, G) => {
            let f = fX8(Z.name, _.name),
                v = Z.userFacingName ? Z.userFacingName({}) : f,
                V = GX8(v),
                k = Z.isReadOnly?.({}) ?? !1,
                N = Z.isDestructive?.({}) ?? !1,
                R = Z.isOpenWorld?.({}) ?? !1,
                h = [];
            if (k) h.push("read-only");
            if (N) h.push("destructive");
            if (R) h.push("open-world");
            return {
                label: V,
                value: G.toString(),
                description: h.length > 0 ? h.join(", ") : void 0,
                descriptionColor: N ? "error" : k ? "success" : void 0
            }
        }, K[7] = _.name, K[8] = D;
        else D = K[8];
        $ = w.map(D), K[4] = _.name, K[5] = w, K[6] = $
    } else $ = K[6];
    let j = $,
        H = `Tools for ${_.name}`,
        J = w.length,
        X;
    if (K[9] !== w.length) X = O7(w.length, "tool"), K[9] = w.length, K[10] = X;
    else X = K[10];
    let M = `${J} ${X}`,
        P;
    if (K[11] !== Y || K[12] !== z || K[13] !== w || K[14] !== j) P = w.length === 0 ? ne.default.createElement(T, {
        dimColor: !0
    }, "No tools available") : ne.default.createElement(A1, {
        options: j,
        onChange: (D) => {
            let Z = parseInt(D),
                G = w[Z];
            if (G) z(G, Z)
        },
        onCancel: Y
    }), K[11] = Y, K[12] = z, K[13] = w, K[14] = j, K[15] = P;
    else P = K[15];
    let W;
    if (K[16] !== Y || K[17] !== H || K[18] !== M || K[19] !== P) W = ne.default.createElement(R1, {
        title: H,
        subtitle: M,
        onCancel: Y,
        inputGuide: LIY
    }, P), K[16] = Y, K[17] = H, K[18] = M, K[19] = P, K[20] = W;
    else W = K[20];
    return W
}
// @from(Ln 452287, Col 0)
function LIY(q) {
    return q.pending ? ne.default.createElement(T, null, "Press ", q.keyName, " again to exit") : ne.default.createElement(z1, null, ne.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), ne.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), ne.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }))
}
// @from(Ln 452305, Col 0)
function hIY(q) {
    return q.mcp.tools
}
// @from(Ln 452308, Col 4)
ne
// @from(Ln 452309, Col 4)
Si8 = L(() => {
    o6();
    g6();
    fh();
    iD();
    N7();
    bK();
    g_();
    Nq();
    S4();
    u7();
    ne = K6(P6(), 1)
})
// @from(Ln 452323, Col 0)
function Ci8(q) {
    let K = s(66),
        {
            onComplete: _
        } = q,
        z = M8(bIY),
        Y = M8(CIY),
        A = z.clients,
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = {
        type: "list"
    }, K[0] = O;
    else O = K[0];
    let [w, $] = Nu.default.useState(O), j;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) j = [], K[1] = j;
    else j = K[1];
    let [H, J] = Nu.default.useState(j), X;
    if (K[2] !== Y.allAgents) X = D_K(Y.allAgents), K[2] = Y.allAgents, K[3] = X;
    else X = K[3];
    let M = X,
        P;
    if (K[4] !== A) P = A.filter(SIY).sort(RIY), K[4] = A, K[5] = P;
    else P = K[5];
    let W = P,
        D, Z;
    if (K[6] !== W || K[7] !== z.tools) D = () => {
        let v = !1;
        return async function() {
            let N = await Promise.all(W.map(async (R) => {
                let h = R.config.scope,
                    C = R.config.type === "sse",
                    x = R.config.type === "http",
                    B = R.config.type === "claudeai-proxy",
                    m = void 0;
                if (C || x) {
                    let U = await new jP6(R.name, R.config).tokens(),
                        g = qW() !== null && R.type === "connected",
                        c = R.type === "connected" && Ll(z.tools, R.name).length > 0;
                    m = Boolean(U) || g || c
                }
                let S = {
                    name: R.name,
                    client: R,
                    scope: h
                };
                if (B) return {
                    ...S,
                    transport: "claudeai-proxy",
                    isAuthenticated: !1,
                    config: R.config
                };
                else if (C) return {
                    ...S,
                    transport: "sse",
                    isAuthenticated: m,
                    config: R.config
                };
                else if (x) return {
                    ...S,
                    transport: "http",
                    isAuthenticated: m,
                    config: R.config
                };
                else return {
                    ...S,
                    transport: "stdio",
                    config: R.config
                }
            }));
            if (v) return;
            J(N)
        }(), () => {
            v = !0
        }
    }, Z = [W, z.tools], K[6] = W, K[7] = z.tools, K[8] = D, K[9] = Z;
    else D = K[8], Z = K[9];
    Nu.default.useEffect(D, Z);
    let G, f;
    if (K[10] !== M.length || K[11] !== W.length || K[12] !== _ || K[13] !== H.length) G = () => {
        if (H.length === 0 && W.length > 0) return;
        if (H.length === 0 && M.length === 0) _("No MCP servers configured. Please run /doctor if this is unexpected. Otherwise, run `claude mcp --help` or visit https://code.claude.com/docs/en/mcp to learn more.")
    }, f = [H.length, W.length, M.length, _], K[10] = M.length, K[11] = W.length, K[12] = _, K[13] = H.length, K[14] = G, K[15] = f;
    else G = K[14], f = K[15];
    switch (Nu.useEffect(G, f), w.type) {
        case "list": {
            let v, V;
            if (K[16] === Symbol.for("react.memo_cache_sentinel")) V = (N) => $({
                type: "server-menu",
                server: N
            }), v = (N) => $({
                type: "agent-server-menu",
                agentServer: N
            }), K[16] = v, K[17] = V;
            else v = K[16], V = K[17];
            let k;
            if (K[18] !== M || K[19] !== _ || K[20] !== H || K[21] !== w.defaultTab) k = Nu.default.createElement(nO7, {
                servers: H,
                agentServers: M,
                onSelectServer: V,
                onSelectAgentServer: v,
                onComplete: _,
                defaultTab: w.defaultTab
            }), K[18] = M, K[19] = _, K[20] = H, K[21] = w.defaultTab, K[22] = k;
            else k = K[22];
            return k
        }
        case "server-menu": {
            let v;
            if (K[23] !== z.tools || K[24] !== w.server.name) v = Ll(z.tools, w.server.name), K[23] = z.tools, K[24] = w.server.name, K[25] = v;
            else v = K[25];
            let V = v,
                k = w.server.transport === "claudeai-proxy" ? "claude.ai" : "Claude Code";
            if (w.server.transport === "stdio") {
                let N;
                if (K[26] !== w.server) N = () => $({
                    type: "server-tools",
                    server: w.server
                }), K[26] = w.server, K[27] = N;
                else N = K[27];
                let R;
                if (K[28] !== k) R = () => $({
                    type: "list",
                    defaultTab: k
                }), K[28] = k, K[29] = R;
                else R = K[29];
                let h;
                if (K[30] !== _ || K[31] !== V.length || K[32] !== N || K[33] !== R || K[34] !== w.server) h = Nu.default.createElement(j_8, {
                    server: w.server,
                    serverToolsCount: V.length,
                    onViewTools: N,
                    onCancel: R,
                    onComplete: _
                }), K[30] = _, K[31] = V.length, K[32] = N, K[33] = R, K[34] = w.server, K[35] = h;
                else h = K[35];
                return h
            } else {
                let N;
                if (K[36] !== w.server) N = () => $({
                    type: "server-tools",
                    server: w.server
                }), K[36] = w.server, K[37] = N;
                else N = K[37];
                let R;
                if (K[38] !== k) R = () => $({
                    type: "list",
                    defaultTab: k
                }), K[38] = k, K[39] = R;
                else R = K[39];
                let h;
                if (K[40] !== _ || K[41] !== V.length || K[42] !== N || K[43] !== R || K[44] !== w.server) h = Nu.default.createElement(FP6, {
                    server: w.server,
                    serverToolsCount: V.length,
                    onViewTools: N,
                    onCancel: R,
                    onComplete: _
                }), K[40] = _, K[41] = V.length, K[42] = N, K[43] = R, K[44] = w.server, K[45] = h;
                else h = K[45];
                return h
            }
        }
        case "server-tools": {
            let v, V;
            if (K[46] !== w.server) V = (N, R) => $({
                type: "server-tool-detail",
                server: w.server,
                toolIndex: R
            }), v = () => $({
                type: "server-menu",
                server: w.server
            }), K[46] = w.server, K[47] = v, K[48] = V;
            else v = K[47], V = K[48];
            let k;
            if (K[49] !== v || K[50] !== V || K[51] !== w.server) k = Nu.default.createElement(J_8, {
                server: w.server,
                onSelectTool: V,
                onBack: v
            }), K[49] = v, K[50] = V, K[51] = w.server, K[52] = k;
            else k = K[52];
            return k
        }
        case "server-tool-detail": {
            let v;
            if (K[53] !== z.tools || K[54] !== w.server.name) v = Ll(z.tools, w.server.name), K[53] = z.tools, K[54] = w.server.name, K[55] = v;
            else v = K[55];
            let k = v[w.toolIndex];
            if (!k) return $({
                type: "server-tools",
                server: w.server
            }), null;
            let N;
            if (K[56] !== w.server) N = () => $({
                type: "server-tools",
                server: w.server
            }), K[56] = w.server, K[57] = N;
            else N = K[57];
            let R;
            if (K[58] !== N || K[59] !== k || K[60] !== w.server) R = Nu.default.createElement(H_8, {
                tool: k,
                server: w.server,
                onBack: N
            }), K[58] = N, K[59] = k, K[60] = w.server, K[61] = R;
            else R = K[61];
            return R
        }
        case "agent-server-menu": {
            let v;
            if (K[62] === Symbol.for("react.memo_cache_sentinel")) v = () => $({
                type: "list",
                defaultTab: "Agents"
            }), K[62] = v;
            else v = K[62];
            let V;
            if (K[63] !== _ || K[64] !== w.agentServer) V = Nu.default.createElement(cO7, {
                agentServer: w.agentServer,
                onCancel: v,
                onComplete: _
            }), K[63] = _, K[64] = w.agentServer, K[65] = V;
            else V = K[65];
            return V
        }
    }
}
// @from(Ln 452546, Col 0)
function RIY(q, K) {
    return q.name.localeCompare(K.name)
}
// @from(Ln 452550, Col 0)
function SIY(q) {
    return q.name !== "ide"
}
// @from(Ln 452554, Col 0)
function CIY(q) {
    return q.agentDefinitions
}
// @from(Ln 452558, Col 0)
function bIY(q) {
    return q.mcp
}
// @from(Ln 452561, Col 4)
Nu
// @from(Ln 452562, Col 4)
ppK = L(() => {
    o6();
    me();
    iD();
    N7();
    ox();
    lO7();
    iO7();
    Li8();
    hi8();
    Ri8();
    Si8();
    Nu = K6(P6(), 1)
})
// @from(Ln 452576, Col 4)
FpK = L(() => {
    lO7();
    iO7();
    Kw7();
    Li8();
    ppK();
    hi8();
    Ri8();
    Si8()
})
// @from(Ln 452586, Col 4)
UpK = {}
// @from(Ln 452599, Col 0)
async function xIY() {
    let q = v7(),
        K = [],
        _ = ej6();
    for (let [z, Y] of Object.entries(_))
        if (z.includes("@") && Y) K.push(z);
    if (q.enabledPlugins)
        for (let [z, Y] of Object.entries(q.enabledPlugins)) {
            if (!z.includes("@")) continue;
            let A = K.indexOf(z);
            if (Y) {
                if (A === -1) K.push(z)
            } else if (A !== -1) K.splice(A, 1)
        }
    return K
}
// @from(Ln 452616, Col 0)
function p_6() {
    let q = new Map,
        K = ej6();
    for (let [z, Y] of Object.entries(K)) {
        if (!z.includes("@")) continue;
        if (Y === !0) q.set(z, "flag");
        else if (Y === !1) q.delete(z)
    }
    let _ = [{
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
            scope: z,
            source: Y
        }
        of _) {
        let A = E1(Y);
        if (!A?.enabledPlugins) continue;
        for (let [O, w] of Object.entries(A.enabledPlugins)) {
            if (!O.includes("@")) continue;
            if (O in K && K[O] !== w) E(`Plugin ${O} from --add-dir (${K[O]}) overridden by ${Y} (${w})`);
            if (w === !0) q.set(O, z);
            else if (w === !1) q.delete(O)
        }
    }
    return E(`Found ${q.size} enabled plugins with scopes: ${Array.from(q.entries()).map(([z,Y])=>`${z}(${Y})`).join(", ")}`), q
}
// @from(Ln 452657, Col 0)
function uIY(q) {
    return q !== "flag"
}
// @from(Ln 452661, Col 0)
function mIY(q) {
    return ZQ1[q]
}
// @from(Ln 452664, Col 0)
async function gpK() {
    w_7().catch((_) => {
        j6(_)
    });
    let q = N68(),
        K = Object.keys(q.plugins);
    return E(`Found ${K.length} installed plugins`), K
}
// @from(Ln 452672, Col 0)
async function BIY(q) {
    try {
        let K = await gpK(),
            _ = q.filter((A) => !K.includes(A));
        return (await Promise.all(_.map(async (A) => {
            try {
                let O = await mf(A);
                return {
                    pluginId: A,
                    found: O !== null && O !== void 0
                }
            } catch (O) {
                return E(`Failed to check plugin ${A} in marketplace: ${O}`), {
                    pluginId: A,
                    found: !1
                }
            }
        }))).filter(({
            found: A
        }) => A).map(({
            pluginId: A
        }) => A)
    } catch (K) {
        return j6(K), []
    }
}
// @from(Ln 452698, Col 0)
async function pIY(q, K, _ = "user") {
    let z = _ !== "user" ? b8() : void 0,
        Y = jc(_),
        A = E1(Y),
        O = {
            ...A?.enabledPlugins
        },
        w = [],
        $ = [];
    for (let j = 0; j < q.length; j++) {
        let H = q[j];
        if (!H) continue;
        if (K) K(H, j + 1, q.length);
        try {
            let J = await mf(H);
            if (!J) {
                $.push({
                    name: H,
                    error: "Plugin not found in any marketplace"
                });
                continue
            }
            let {
                entry: X,
                marketplaceInstallLocation: M
            } = J;
            if (!uQ6(X.source)) await Z68(H, X, _, z);
            else WG4({
                pluginId: H,
                installPath: IIY(M, X.source),
                version: X.version
            }, _, z);
            O[H] = !0, w.push(H)
        } catch (J) {
            let X = J instanceof Error ? J.message : String(J);
            $.push({
                name: H,
                error: X
            }), j6(J)
        }
    }
    return P7(Y, {
        ...A,
        enabledPlugins: O
    }), {
        installed: w,
        failed: $
    }
}
// @from(Ln 452747, Col 4)
X_8 = L(() => {
    n7();
    K8();
    U8();
    a1();
    WS8();
    yD();
    m$();
    aW();
    Y56();
    Hv()
})
// @from(Ln 452765, Col 0)
async function bi8(q) {
    let K = q.trim(),
        _ = V8(),
        z = K.match(/^([a-zA-Z0-9._-]+@[^:]+:.+?(?:\.git)?)(#(.+))?$/);
    if (z?.[1]) {
        let O = z[1],
            w = z[3];
        return w ? {
            source: "git",
            url: O,
            ref: w
        } : {
            source: "git",
            url: O
        }
    }
    if (K.startsWith("http://") || K.startsWith("https://")) {
        let O = K.match(/^([^#]+)(#(.+))?$/),
            w = O?.[1] || K,
            $ = O?.[3];
        if (w.endsWith(".git") || w.includes("/_git/")) return $ ? {
            source: "git",
            url: w,
            ref: $
        } : {
            source: "git",
            url: w
        };
        let j;
        try {
            j = new URL(w)
        } catch (H) {
            return {
                source: "url",
                url: w
            }
        }
        if (j.hostname === "github.com" || j.hostname === "www.github.com") {
            if (j.pathname.match(/^\/([^/]+\/[^/]+?)(\/|\.git|$)/)?.[1]) {
                let J = w.endsWith(".git") ? w : `${w}.git`;
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
            url: w
        }
    }
    let A = process.platform === "win32" && (K.startsWith(".\\") || K.startsWith("..\\") || /^[a-zA-Z]:[/\\]/.test(K));
    if (K.startsWith("./") || K.startsWith("../") || K.startsWith("/") || K.startsWith("~") || A) {
        let O = gIY(K.startsWith("~") ? K.replace(/^~/, FIY()) : K),
            w;
        try {
            w = await _.stat(O)
        } catch ($) {
            let j = Q1($);
            return {
                error: j === "ENOENT" ? `Path does not exist: ${O}` : `Cannot access path: ${O} (${j??$})`
            }
        }
        if (w.isFile())
            if (O.endsWith(".json")) return {
                source: "file",
                path: O
            };
            else return {
                error: `File path must point to a .json file (marketplace.json), but got: ${O}`
            };
        else if (w.isDirectory()) return {
            source: "directory",
            path: O
        };
        else return {
            error: `Path is neither a file nor a directory: ${O}`
        }
    }
    if (K.includes("/") && !K.startsWith("@")) {
        if (K.includes(":")) return null;
        let O = K.match(/^([^#@]+)(?:[#@](.+))?$/),
            w = O?.[1] || K,
            $ = O?.[2];
        return $ ? {
            source: "github",
            repo: w,
            ref: $
        } : {
            source: "github",
            repo: w
        }
    }
    return null
}
// @from(Ln 452864, Col 4)
zw7 = L(() => {
    m8();
    Yq()
})
// @from(Ln 452869, Col 0)
function QpK({
    inputValue: q,
    setInputValue: K,
    cursorOffset: _,
    setCursorOffset: z,
    error: Y,
    setError: A,
    result: O,
    setResult: w,
    setViewState: $,
    onAddComplete: j,
    cliMode: H = !1
}) {
    let J = gP6.useRef(!1),
        [X, M] = gP6.useState(!1),
        [P, W] = gP6.useState(""),
        D = async () => {
            let Z = q.trim();
            if (!Z) {
                A("Please enter a marketplace source");
                return
            }
            let G = await bi8(Z);
            if (!G) {
                A("Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
                return
            }
            if ("error" in G) {
                A(G.error);
                return
            }
            A(null);
            try {
                M(!0), W("");
                let {
                    name: f,
                    resolvedSource: v
                } = await M_6(G, (k) => {
                    W(k)
                });
                h38(f, {
                    source: v
                }), YO();
                let V = G.source;
                if (G.source === "github") V = G.repo;
                if (d("tengu_marketplace_added", {
                        source_type: V
                    }), j) await j();
                if (W(""), M(!1), H) w(`Successfully added marketplace: ${f}`);
                else $({
                    type: "browse-marketplace",
                    targetMarketplace: f
                })
            } catch (f) {
                let v = r1(f);
                if (j6(v), A(v.message), W(""), M(!1), H) w(`Error: ${v.message}`);
                else w(null)
            }
        };
    return gP6.useEffect(() => {
        if (q && !J.current && !Y && !O) J.current = !0, D()
    }, []), P3.createElement(u, {
        flexDirection: "column"
    }, P3.createElement(u, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: "round"
    }, P3.createElement(u, {
        marginBottom: 1
    }, P3.createElement(T, {
        bold: !0
    }, "Add Marketplace")), P3.createElement(u, {
        flexDirection: "column"
    }, P3.createElement(T, null, "Enter marketplace source:"), P3.createElement(T, {
        dimColor: !0
    }, "Examples:"), P3.createElement(T, {
        dimColor: !0
    }, " · owner/repo (GitHub)"), P3.createElement(T, {
        dimColor: !0
    }, " · git@github.com:owner/repo.git (SSH)"), P3.createElement(T, {
        dimColor: !0
    }, " · https://example.com/marketplace.json"), P3.createElement(T, {
        dimColor: !0
    }, " · ./path/to/marketplace"), P3.createElement(u, {
        marginTop: 1
    }, P3.createElement(l4, {
        value: q,
        onChange: K,
        onSubmit: D,
        columns: 80,
        cursorOffset: _,
        onChangeCursorOffset: z,
        focus: !0,
        showCursor: !0
    }))), X && P3.createElement(u, {
        marginTop: 1
    }, P3.createElement(Y5, null), P3.createElement(T, null, P || "Adding marketplace to configuration…")), Y && P3.createElement(u, {
        marginTop: 1
    }, P3.createElement(T, {
        color: "error"
    }, Y)), O && P3.createElement(u, {
        marginTop: 1
    }, P3.createElement(T, null, O))), P3.createElement(u, {
        marginLeft: 3
    }, P3.createElement(T, {
        dimColor: !0,
        italic: !0
    }, P3.createElement(z1, null, P3.createElement(A8, {
        chord: "enter",
        action: "add"
    }), P3.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 452986, Col 4)
P3
// @from(Ln 452986, Col 8)
gP6
// @from(Ln 452987, Col 4)
dpK = L(() => {
    C8();
    bK();
    Nq();
    u7();
    Ej();
    NY();
    g6();
    m8();
    U8();
    uR();
    m$();
    zw7();
    P3 = K6(P6(), 1), gP6 = K6(P6(), 1)
})
// @from(Ln 453015, Col 0)
function cpK() {
    return nIY(gP(), iIY)
}
// @from(Ln 453018, Col 0)
async function oIY() {
    let q = cpK();
    try {
        let K = await QIY(q, {
                encoding: "utf-8"
            }),
            _ = n8(K);
        if (typeof _ !== "object" || _ === null || !("version" in _) || !("fetchedAt" in _) || !("counts" in _)) return E("Install counts cache has invalid structure"), null;
        let z = _;
        if (z.version !== Yw7) return E(`Install counts cache version mismatch (got ${z.version}, expected ${Yw7})`), null;
        if (typeof z.fetchedAt !== "string" || !Array.isArray(z.counts)) return E("Install counts cache has invalid structure"), null;
        let Y = new Date(z.fetchedAt).getTime();
        if (Number.isNaN(Y)) return E("Install counts cache has invalid fetchedAt timestamp"), null;
        if (!z.counts.every((w) => typeof w === "object" && w !== null && typeof w.plugin === "string" && typeof w.unique_installs === "number")) return E("Install counts cache has malformed entries"), null;
        if (Date.now() - Y > rIY) return E("Install counts cache is stale (>24h old)"), null;
        return {
            version: z.version,
            fetchedAt: z.fetchedAt,
            counts: z.counts
        }
    } catch (K) {
        if (Q1(K) !== "ENOENT") E(`Failed to load install counts cache: ${b6(K)}`);
        return null
    }
}
// @from(Ln 453043, Col 0)
async function aIY(q) {
    let K = cpK(),
        _ = `${K}.${UIY(8).toString("hex")}.tmp`;
    try {
        let z = gP();
        await V8().mkdir(z);
        let Y = I6(q, null, 2);
        await lIY(_, Y, {
            encoding: "utf-8",
            mode: 384
        }), await dIY(_, K), E("Install counts cache saved successfully")
    } catch (z) {
        j6(z);
        try {
            await cIY(_)
        } catch {}
    }
}
// @from(Ln 453061, Col 0)
async function sIY() {
    E(`Fetching install counts from ${M_8}`);
    let q = performance.now();
    try {
        let K = await Z1.get(M_8, {
            timeout: 1e4
        });
        if (!K.data?.plugins || !Array.isArray(K.data.plugins)) throw Error("Invalid response format from install counts API");
        return ED("install_counts", M_8, "success", performance.now() - q), K.data.plugins
    } catch (K) {
        throw ED("install_counts", M_8, "failure", performance.now() - q, Kx(K)), K
    }
}
// @from(Ln 453074, Col 0)
async function Ex6() {
    let q = await oIY();
    if (q) {
        E("Using cached install counts"), ED("install_counts", M_8, "cache_hit", 0);
        let K = new Map;
        for (let _ of q.counts) K.set(_.plugin, _.unique_installs);
        return K
    }
    try {
        let K = await sIY(),
            _ = {
                version: Yw7,
                fetchedAt: new Date().toISOString(),
                counts: K
            };
        await aIY(_);
        let z = new Map;
        for (let Y of K) z.set(Y.plugin, Y.unique_installs);
        return z
    } catch (K) {
        return j6(K), E(`Failed to fetch install counts: ${b6(K)}`), null
    }
}
// @from(Ln 453098, Col 0)
function Ii8(q) {
    if (q < 1000) return String(q);
    if (q < 1e6) {
        let Y = (q / 1000).toFixed(1);
        return Y.endsWith(".0") ? `${Y.slice(0,-2)}K` : `${Y}K`
    }
    let _ = (q / 1e6).toFixed(1);
    return _.endsWith(".0") ? `${_.slice(0,-2)}M` : `${_}M`
}
// @from(Ln 453107, Col 4)
Yw7 = 1
// @from(Ln 453108, Col 4)
iIY = "install-counts-cache.json"
// @from(Ln 453109, Col 4)
M_8 = "https://raw.githubusercontent.com/anthropics/claude-plugins-official/refs/heads/stats/stats/plugin-installs.json"
// @from(Ln 453110, Col 4)
rIY = 86400000
// @from(Ln 453111, Col 4)
xi8 = L(() => {
    CK();
    K8();
    m8();
    Yq();
    U8();
    e8();
    Y68();
    Jy()
})
// @from(Ln 453122, Col 0)
function tIY(q, K, _, z) {
    let Y = {};
    for (let A of q) {
        let O = _[A],
            w = K[A] ?? "";
        if (O?.sensitive === !0 && w === "" && z?.[A] !== void 0) continue;
        if (O?.type === "number") {
            if (w.trim() === "") continue;
            let $ = Number(w);
            Y[A] = Number.isNaN($) ? w : $
        } else if (O?.type === "boolean") Y[A] = S6(w);
        else Y[A] = w
    }
    return Y
}
// @from(Ln 453138, Col 0)
function P_8(q) {
    let K = s(70),
        {
            title: _,
            subtitle: z,
            configSchema: Y,
            initialValues: A,
            onSave: O,
            onCancel: w
        } = q,
        $;
    if (K[0] !== Y) $ = Object.keys(Y), K[0] = Y, K[1] = $;
    else $ = K[1];
    let j = $,
        H;
    if (K[2] !== Y || K[3] !== A) H = (Y6) => {
        if (Y[Y6]?.sensitive === !0) return "";
        let X6 = A?.[Y6];
        return X6 === void 0 ? "" : String(X6)
    }, K[2] = Y, K[3] = A, K[4] = H;
    else H = K[4];
    let J = H,
        [X, M] = $Z.useState(0),
        P;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) P = {}, K[5] = P;
    else P = K[5];
    let [W, D] = $Z.useState(P), Z;
    if (K[6] !== j[0] || K[7] !== J) Z = () => j[0] ? J(j[0]) : "", K[6] = j[0], K[7] = J, K[8] = Z;
    else Z = K[8];
    let [G, f] = $Z.useState(Z), v = j[X], V = v ? Y[v] : null, k;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Settings"
    }, K[9] = k;
    else k = K[9];
    G1("confirm:no", w, k);
    let N;
    if (K[10] !== v || K[11] !== X || K[12] !== G || K[13] !== j || K[14] !== J) N = () => {
        if (X < j.length - 1 && v) {
            D((X6) => ({
                ...X6,
                [v]: G
            })), M(KxY);
            let Y6 = j[X + 1];
            f(Y6 ? J(Y6) : "")
        }
    }, K[10] = v, K[11] = X, K[12] = G, K[13] = j, K[14] = J, K[15] = N;
    else N = K[15];
    let R = N,
        h;
    if (K[16] !== Y || K[17] !== v || K[18] !== X || K[19] !== G || K[20] !== j || K[21] !== J || K[22] !== A || K[23] !== O || K[24] !== W) h = () => {
        if (!v) return;
        let Y6 = {
            ...W,
            [v]: G
        };
        if (X === j.length - 1) O(tIY(j, Y6, Y, A));
        else {
            D(Y6), M(qxY);
            let X6 = j[X + 1];
            f(X6 ? J(X6) : "")
        }
    }, K[16] = Y, K[17] = v, K[18] = X, K[19] = G, K[20] = j, K[21] = J, K[22] = A, K[23] = O, K[24] = W, K[25] = h;
    else h = K[25];
    let C = h,
        x;
    if (K[26] !== C || K[27] !== R) x = function(X6) {
        if (X6.key === "return") {
            X6.preventDefault(), C();
            return
        }
        if (X6.key === "tab") {
            X6.preventDefault(), R();
            return
        }
        if (X6.key === "backspace" || X6.key === "delete") {
            X6.preventDefault(), f(eIY);
            return
        }
        if (X6.ctrl || X6.meta) return;
        if (X6.key.length === 1) X6.preventDefault(), f((M6) => M6 + X6.key)
    }, K[26] = C, K[27] = R, K[28] = x;
    else x = K[28];
    let B = x,
        m;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) m = function(X6) {
        X6.preventDefault(), f((M6) => M6 + (X6.text.split(/\r\n|\r|\n/, 2)[0] ?? "").trim())
    }, K[29] = m;
    else m = K[29];
    let S = m;
    if (!V || !v) return null;
    let F = V.sensitive === !0,
        U = V.required === !0,
        g;
    if (K[30] !== G || K[31] !== F) g = F ? "*".repeat(N1(G)) : G, K[30] = G, K[31] = F, K[32] = g;
    else g = K[32];
    let c = g,
        n = V.title || v,
        l;
    if (K[33] !== U) l = U && $Z.default.createElement(T, {
        color: "error"
    }, " *"), K[33] = U, K[34] = l;
    else l = K[34];
    let z6;
    if (K[35] !== n || K[36] !== l) z6 = $Z.default.createElement(T, {
        bold: !0
    }, n, l), K[35] = n, K[36] = l, K[37] = z6;
    else z6 = K[37];
    let A6;
    if (K[38] !== V.description) A6 = V.description && $Z.default.createElement(T, {
        dimColor: !0
    }, V.description), K[38] = V.description, K[39] = A6;
    else A6 = K[39];
    let e;
    if (K[40] === Symbol.for("react.memo_cache_sentinel")) e = $Z.default.createElement(T, null, e6.pointerSmall, " "), K[40] = e;
    else e = K[40];
    let i;
    if (K[41] !== c) i = $Z.default.createElement(T, null, c), K[41] = c, K[42] = i;
    else i = K[42];
    let O6;
    if (K[43] === Symbol.for("react.memo_cache_sentinel")) O6 = $Z.default.createElement(T, null, "█"), K[43] = O6;
    else O6 = K[43];
    let J6;
    if (K[44] !== i) J6 = $Z.default.createElement(u, {
        marginTop: 1
    }, e, i, O6), K[44] = i, K[45] = J6;
    else J6 = K[45];
    let $6;
    if (K[46] !== B || K[47] !== z6 || K[48] !== A6 || K[49] !== J6) $6 = $Z.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: B,
        onPaste: S
    }, z6, A6, J6), K[46] = B, K[47] = z6, K[48] = A6, K[49] = J6, K[50] = $6;
    else $6 = K[50];
    let H6 = X + 1,
        q6;
    if (K[51] !== j.length || K[52] !== H6) q6 = $Z.default.createElement(T, {
        dimColor: !0
    }, "Field ", H6, " of ", j.length), K[51] = j.length, K[52] = H6, K[53] = q6;
    else q6 = K[53];
    let o;
    if (K[54] !== X || K[55] !== j.length) o = X < j.length - 1 && $Z.default.createElement(T, {
        dimColor: !0
    }, "Tab: Next field · Enter: Save and continue"), K[54] = X, K[55] = j.length, K[56] = o;
    else o = K[56];
    let _6;
    if (K[57] !== X || K[58] !== j.length) _6 = X === j.length - 1 && $Z.default.createElement(T, {
        dimColor: !0
    }, "Enter: Save configuration"), K[57] = X, K[58] = j.length, K[59] = _6;
    else _6 = K[59];
    let r;
    if (K[60] !== q6 || K[61] !== o || K[62] !== _6) r = $Z.default.createElement(u, {
        flexDirection: "column"
    }, q6, o, _6), K[60] = q6, K[61] = o, K[62] = _6, K[63] = r;
    else r = K[63];
    let t;
    if (K[64] !== w || K[65] !== z || K[66] !== $6 || K[67] !== r || K[68] !== _) t = $Z.default.createElement(R1, {
        title: _,
        subtitle: z,
        onCancel: w,
        isCancelActive: !1
    }, $6, r), K[64] = w, K[65] = z, K[66] = $6, K[67] = r, K[68] = _, K[69] = t;
    else t = K[69];
    return t
}
// @from(Ln 453305, Col 0)
function eIY(q) {
    return q.slice(0, -1)
}
// @from(Ln 453309, Col 0)
function qxY(q) {
    return q + 1
}
// @from(Ln 453313, Col 0)
function KxY(q) {
    return q + 1
}
// @from(Ln 453316, Col 4)
$Z
// @from(Ln 453317, Col 4)
Aw7 = L(() => {
    o6();
    Qq();
    S4();
    n5();
    g6();
    C7();
    Q8();
    $Z = K6(P6(), 1)
})
// @from(Ln 453327, Col 0)
async function ui8(q) {
    let {
        enabled: K,
        disabled: _
    } = await sW();
    return [...K, ..._].find((z) => z.repository === q || z.source === q)
}
// @from(Ln 453335, Col 0)
function yx6({
    plugin: q,
    pluginId: K,
    onDone: _
}) {
    let [z] = kn.useState(() => {
        let j = [],
            H = Ch4(q);
        if (Object.keys(H).length > 0) j.push({
            key: "top-level",
            title: `Configure ${q.name}`,
            subtitle: "Plugin options",
            schema: H,
            load: () => ID(K),
            save: (X) => Tb8(K, X, q.manifest.userConfig)
        });
        let J = H_K(q);
        for (let X of J) j.push({
            key: `channel:${X.server}`,
            title: `Configure ${X.displayName}`,
            subtitle: `Plugin: ${q.name}`,
            schema: X.configSchema,
            load: () => IH6(K, X.server) ?? void 0,
            save: (M) => Gb8(K, X.server, M, X.configSchema)
        });
        return j
    }), [Y, A] = kn.useState(0), O = kn.useRef(_);
    if (O.current = _, kn.useEffect(() => {
            if (z.length === 0) O.current("skipped")
        }, [z.length]), z.length === 0) return null;
    let w = z[Y];

    function $(j) {
        try {
            w.save(j)
        } catch (J) {
            _("error", b6(J));
            return
        }
        let H = Y + 1;
        if (H < z.length) A(H);
        else _("configured")
    }
    return kn.createElement(P_8, {
        key: w.key,
        title: w.title,
        subtitle: w.subtitle,
        configSchema: w.schema,
        initialValues: w.load(),
        onSave: $,
        onCancel: () => _("skipped")
    })
}
// @from(Ln 453388, Col 4)
kn
// @from(Ln 453389, Col 4)
mi8 = L(() => {
    m8();
    W88();
    WX6();
    vH();
    Gx();
    Aw7();
    kn = K6(P6(), 1)
})
// @from(Ln 453399, Col 0)
function Bi8() {
    let q = s(3),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = Wf4(), q[0] = K;
    else K = q[0];
    let _ = K,
        z;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) z = UP6.createElement(T, {
        color: "claude"
    }, e6.warning, " "), q[1] = z;
    else z = q[1];
    let Y;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = UP6.createElement(u, {
        marginBottom: 1
    }, z, UP6.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.", _ ? ` ${_}` : "")), q[2] = Y;
    else Y = q[2];
    return Y
}
// @from(Ln 453420, Col 4)
UP6
// @from(Ln 453421, Col 4)
Ow7 = L(() => {
    o6();
    Qq();
    g6();
    Xc();
    UP6 = K6(P6(), 1)
})
// @from(Ln 453429, Col 0)
function F_6(q) {
    if (q.entry.source && typeof q.entry.source === "object" && "source" in q.entry.source && q.entry.source.source === "github" && typeof q.entry.source === "object" && "repo" in q.entry.source) return q.entry.source.repo;
    return null
}
// @from(Ln 453434, Col 0)
function Lx6(q, K) {
    let _ = [{
        label: "Install for you (user scope)",
        action: "install-user"
    }, {
        label: "Install for all collaborators on this repository (project scope)",
        action: "install-project"
    }, {
        label: "Install for you, in this repo only (local scope)",
        action: "install-local"
    }];
    if (q) _.push({
        label: "Open homepage",
        action: "homepage"
    });
    if (K) _.push({
        label: "View on GitHub",
        action: "github"
    });
    return _.push({
        label: "Back to plugin list",
        action: "back"
    }), _
}
// @from(Ln 453459, Col 0)
function lpK(q) {
    let K = s(7),
        {
            hasSelection: _
        } = q,
        z;
    if (K[0] !== _) z = _ && ON.createElement(v1, {
        action: "plugin:install",
        context: "Plugin",
        fallback: "i",
        description: "install",
        bold: !0
    }), K[0] = _, K[1] = z;
    else z = K[1];
    let Y, A, O;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) Y = ON.createElement(v1, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), A = ON.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), O = ON.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), K[2] = Y, K[3] = A, K[4] = O;
    else Y = K[2], A = K[3], O = K[4];
    let w;
    if (K[5] !== z) w = ON.createElement(u, {
        marginTop: 1
    }, ON.createElement(T, {
        dimColor: !0,
        italic: !0
    }, ON.createElement(z1, null, z, Y, A, O))), K[5] = z, K[6] = w;
    else w = K[6];
    return w
}
// @from(Ln 453501, Col 4)
ON
// @from(Ln 453502, Col 4)
ww7 = L(() => {
    o6();
    bK();
    Nq();
    g6();
    ON = K6(P6(), 1)
})
// @from(Ln 453510, Col 0)
function QP6({
    totalItems: q,
    maxVisible: K = _xY,
    selectedIndex: _ = 0
}) {
    let z = q > K,
        Y = mS.useRef(0),
        A = mS.useMemo(() => {
            if (!z) return 0;
            let G = Y.current;
            if (_ < G) return Y.current = _, _;
            if (_ >= G + K) {
                let V = _ - K + 1;
                return Y.current = V, V
            }
            let f = Math.max(0, q - K),
                v = Math.min(G, f);
            return Y.current = v, v
        }, [_, K, z, q]),
        O = A,
        w = Math.min(A + K, q),
        $ = mS.useCallback((G) => {
            if (!z) return G;
            return G.slice(O, w)
        }, [z, O, w]),
        j = mS.useCallback((G) => {
            return O + G
        }, [O]),
        H = mS.useCallback((G) => {
            return G >= O && G < w
        }, [O, w]),
        J = mS.useCallback((G) => {}, []),
        X = mS.useCallback(() => {}, []),
        M = mS.useCallback(() => {}, []),
        P = mS.useCallback((G, f) => {
            let v = Math.max(0, Math.min(G, q - 1));
            f(v)
        }, [q]),
        W = mS.useCallback((G, f) => {
            return !1
        }, []),
        D = Math.max(1, Math.ceil(q / K));
    return {
        currentPage: Math.floor(A / K),
        totalPages: D,
        startIndex: O,
        endIndex: w,
        needsPagination: z,
        pageSize: K,
        getVisibleItems: $,
        toActualIndex: j,
        isOnCurrentPage: H,
        goToPage: J,
        nextPage: X,
        prevPage: M,
        handleSelectionChange: P,
        handlePageNavigation: W,
        scrollPosition: {
            current: _ + 1,
            total: q,
            canScrollUp: A > 0,
            canScrollDown: A + K < q
        }
    }
}
// @from(Ln 453575, Col 4)
mS
// @from(Ln 453575, Col 8)
_xY = 5
// @from(Ln 453576, Col 4)
W_8 = L(() => {
    mS = K6(P6(), 1)
})
// @from(Ln 453580, Col 0)
function npK({
    error: q,
    setError: K,
    result: _,
    setResult: z,
    setViewState: Y,
    onInstallComplete: A,
    targetMarketplace: O,
    targetPlugin: w
}) {
    let [$, j] = G0.useState("marketplace-list"), [H, J] = G0.useState(null), [X, M] = G0.useState(null), [P, W] = G0.useState([]), [D, Z] = G0.useState([]), [G, f] = G0.useState(!0), [v, V] = G0.useState(null), [k, N] = G0.useState(0), [R, h] = G0.useState(new Set), [C, x] = G0.useState(new Set), B = QP6({
        totalItems: D.length,
        selectedIndex: k
    }), [m, S] = G0.useState(0), [F, U] = G0.useState(!1), [g, c] = G0.useState(null), [n, l] = G0.useState(null), z6 = V1.useCallback(() => {
        if ($ === "plugin-list")
            if (O) Y({
                type: "manage-marketplaces",
                targetMarketplace: O
            });
            else if (P.length === 1) Y({
            type: "menu"
        });
        else j("marketplace-list"), J(null), h(new Set);
        else if ($ === "plugin-details") j("plugin-list"), M(null);
        else Y({
            type: "menu"
        })
    }, [$, O, Y, P.length]);
    G1("confirm:no", z6, {
        context: "Confirmation"
    }), G0.useEffect(() => {
        async function J6() {
            try {
                let $6 = await Dz(),
                    {
                        marketplaces: H6,
                        failures: q6
                    } = await Rp($6),
                    o = [];
                for (let {
                        name: t,
                        config: Y6,
                        data: X6
                    }
                    of H6)
                    if (X6) {
                        let M6 = w7(X6.plugins, (W6) => Hu(Jc(W6.name, t)));
                        o.push({
                            name: t,
                            totalPlugins: X6.plugins.length,
                            installedCount: M6,
                            source: O68(Y6.source)
                        })
                    } o.sort((t, Y6) => {
                    if (t.name === "claude-plugin-directory") return -1;
                    if (Y6.name === "claude-plugin-directory") return 1;
                    return 0
                }), W(o);
                let _6 = w7(H6, (t) => t.data !== null),
                    r = $L6(q6, _6);
                if (r)
                    if (r.type === "warning") l(r.message + ". Showing available marketplaces.");
                    else throw Error(r.message);
                if (o.length === 1 && !O && !w) {
                    let t = o[0];
                    if (t) J(t.name), j("plugin-list")
                }
                if (w) {
                    let t = null,
                        Y6 = null;
                    for (let [X6] of Object.entries($6)) {
                        let M6 = await xf(X6);
                        if (M6) {
                            let W6 = M6.plugins.find((V6) => V6.name === w);
                            if (W6) {
                                let V6 = Jc(W6.name, X6);
                                t = {
                                    entry: W6,
                                    marketplaceName: X6,
                                    pluginId: V6,
                                    isInstalled: aM6(V6)
                                }, Y6 = X6;
                                break
                            }
                        }
                    }
                    if (t && Y6) {
                        let X6 = t.pluginId;
                        if (aM6(X6)) K(`Plugin '${X6}' is already installed globally. Use '/plugin' to manage existing plugins.`);
                        else J(Y6), M(t), j("plugin-details")
                    } else K(`Plugin "${w}" not found in any marketplace`)
                } else if (O)
                    if (o.some((Y6) => Y6.name === O)) J(O), j("plugin-list");
                    else K(`Marketplace "${O}" not found`)
            } catch ($6) {
                K($6 instanceof Error ? $6.message : "Failed to load marketplaces")
            } finally {
                f(!1)
            }
        }
        J6()
    }, [K, O, w]), G0.useEffect(() => {
        if (!H) return;
        let J6 = !1;
        async function $6(H6) {
            f(!0);
            try {
                let q6 = await xf(H6);
                if (J6) return;
                if (!q6) throw Error(`Failed to load marketplace: ${H6}`);
                let o = [];
                for (let _6 of q6.plugins) {
                    let r = Jc(_6.name, H6);
                    if (Rk(r)) continue;
                    o.push({
                        entry: _6,
                        marketplaceName: H6,
                        pluginId: r,
                        isInstalled: aM6(r)
                    })
                }
                try {
                    let _6 = await Ex6();
                    if (J6) return;
                    if (V(_6), _6) o.sort((r, t) => {
                        let Y6 = _6.get(r.pluginId) ?? 0,
                            X6 = _6.get(t.pluginId) ?? 0;
                        if (Y6 !== X6) return X6 - Y6;
                        return r.entry.name.localeCompare(t.entry.name)
                    });
                    else o.sort((r, t) => r.entry.name.localeCompare(t.entry.name))
                } catch (_6) {
                    if (J6) return;
                    E(`Failed to fetch install counts: ${b6(_6)}`), o.sort((r, t) => r.entry.name.localeCompare(t.entry.name))
                }
                Z(o), N(0), h(new Set)
            } catch (q6) {
                if (J6) return;
                K(q6 instanceof Error ? q6.message : "Failed to load plugins")
            } finally {
                f(!1)
            }
        }
        return $6(H), () => {
            J6 = !0
        }
    }, [H, K]);
    let A6 = async () => {
        if (R.size === 0) return;
        let J6 = D.filter((o) => R.has(o.pluginId));
        x(new Set(J6.map((o) => o.pluginId)));
        let $6 = 0,
            H6 = 0,
            q6 = [];
        for (let o of J6) {
            let _6 = await z56({
                pluginId: o.pluginId,
                entry: o.entry,
                marketplaceName: o.marketplaceName,
                scope: "user"
            });
            if (_6.success) $6++;
            else H6++, q6.push({
                name: o.entry.name,
                reason: _6.error
            })
        }
        if (x(new Set), h(new Set), YO(), H6 === 0) {
            let o = `✓ Installed ${$6} ${O7($6,"plugin")}. Run /reload-plugins to activate.`;
            z(o)
        } else if ($6 === 0) K(`Failed to install: ${wL6(q6,!0)}`);
        else {
            let o = `✓ Installed ${$6} of ${$6+H6} plugins. Failed: ${wL6(q6,!1)}. Run /reload-plugins to activate successfully installed plugins.`;
            z(o)
        }
        if ($6 > 0) {
            if (A) await A()
        }
        Y({
            type: "menu"
        })
    }, e = async (J6, $6 = "user") => {
        U(!0), c(null);
        let H6 = await z56({
            pluginId: J6.pluginId,
            entry: J6.entry,
            marketplaceName: J6.marketplaceName,
            scope: $6
        });
        if (H6.success) {
            let q6 = await ui8(J6.pluginId);
            if (q6) {
                U(!1), j({
                    type: "plugin-options",
                    plugin: q6,
                    pluginId: J6.pluginId,
                    depNote: H6.depNote
                });
                return
            }
            if (z(H6.message), A) await A();
            Y({
                type: "menu"
            })
        } else U(!1), c(H6.error)
    };
    G0.useEffect(() => {
        if (q) z(q)
    }, [q, z]), L7({
        "select:previous": () => {
            if (k > 0) N(k - 1)
        },
        "select:next": () => {
            if (k < P.length - 1) N(k + 1)
        },
        "select:accept": () => {
            let J6 = P[k];
            if (J6) J(J6.name), j("plugin-list")
        }
    }, {
        context: "Select",
        isActive: $ === "marketplace-list"
    }), L7({
        "select:previous": () => {
            if (k > 0) B.handleSelectionChange(k - 1, N)
        },
        "select:next": () => {
            if (k < D.length - 1) B.handleSelectionChange(k + 1, N)
        },
        "select:accept": () => {
            if (k === D.length && R.size > 0) A6();
            else if (k < D.length) {
                let J6 = D[k];
                if (J6)
                    if (J6.isInstalled) Y({
                        type: "manage-plugins",
                        targetPlugin: J6.entry.name,
                        targetMarketplace: J6.marketplaceName
                    });
                    else M(J6), j("plugin-details"), S(0), c(null)
            }
        }
    }, {
        context: "Select",
        isActive: $ === "plugin-list"
    }), L7({
        "plugin:toggle": () => {
            if (k < D.length) {
                let J6 = D[k];
                if (J6 && !J6.isInstalled) {
                    let $6 = new Set(R);
                    if ($6.has(J6.pluginId)) $6.delete(J6.pluginId);
                    else $6.add(J6.pluginId);
                    h($6)
                }
            }
        },
        "plugin:install": () => {
            if (R.size > 0) A6()
        }
    }, {
        context: "Plugin",
        isActive: $ === "plugin-list"
    });
    let i = V1.useMemo(() => {
        if (!X) return [];
        let J6 = X.entry.homepage,
            $6 = F_6(X);
        return Lx6(J6, $6)
    }, [X]);
    if (L7({
            "select:previous": () => {
                if (m > 0) S(m - 1)
            },
            "select:next": () => {
                if (m < i.length - 1) S(m + 1)
            },
            "select:accept": () => {
                if (!X) return;
                let J6 = i[m]?.action,
                    $6 = X.entry.homepage,
                    H6 = F_6(X);
                if (J6 === "install-user") e(X, "user");
                else if (J6 === "install-project") e(X, "project");
                else if (J6 === "install-local") e(X, "local");
                else if (J6 === "homepage" && $6) J3($6);
                else if (J6 === "github" && H6) J3(`https://github.com/${H6}`);
                else if (J6 === "back") j("plugin-list"), M(null)
            }
        }, {
            context: "Select",
            isActive: $ === "plugin-details" && !!X
        }), typeof $ === "object" && $.type === "plugin-options") {
        let q6 = function(o) {
                if (z(o), A) A();
                Y({
                    type: "menu"
                })
            },
            {
                plugin: J6,
                pluginId: $6,
                depNote: H6
            } = $;
        return V1.createElement(yx6, {
            plugin: J6,
            pluginId: $6,
            onDone: (o, _6) => {
                switch (o) {
                    case "configured":
                        q6(`✓ Installed and configured ${J6.name}${H6}. Run /reload-plugins to apply.`);
                        break;
                    case "skipped":
                        q6(`✓ Installed ${J6.name}${H6}. Run /reload-plugins to apply.`);
                        break;
                    case "error":
                        q6(`Installed but failed to save config: ${_6}`);
                        break
                }
            }
        })
    }
    if (G) return V1.createElement(T, null, "Loading…");
    if (q) return V1.createElement(T, {
        color: "error"
    }, q);
    if ($ === "marketplace-list") {
        if (P.length === 0) return V1.createElement(u, {
            flexDirection: "column"
        }, V1.createElement(u, {
            marginBottom: 1
        }, V1.createElement(T, {
            bold: !0
        }, "Select marketplace")), V1.createElement(T, null, "No marketplaces configured."), V1.createElement(T, {
            dimColor: !0
        }, "Add a marketplace first using ", "'Add marketplace'", "."), V1.createElement(u, {
            marginTop: 1,
            paddingLeft: 1
        }, V1.createElement(T, {
            dimColor: !0
        }, V1.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }))));
        return V1.createElement(u, {
            flexDirection: "column"
        }, V1.createElement(u, {
            marginBottom: 1
        }, V1.createElement(T, {
            bold: !0
        }, "Select marketplace")), n && V1.createElement(u, {
            marginBottom: 1,
            flexDirection: "column"
        }, V1.createElement(T, {
            color: "warning"
        }, V1.createElement(D4, {
            status: "warning",
            withSpace: !0
        }), n)), P.map((J6, $6) => V1.createElement(u, {
            key: J6.name,
            flexDirection: "column",
            marginBottom: $6 < P.length - 1 ? 1 : 0
        }, V1.createElement(u, null, V1.createElement(T, {
            color: k === $6 ? "suggestion" : void 0
        }, k === $6 ? e6.pointer : " ", " ", J6.name)), V1.createElement(u, {
            marginLeft: 2
        }, V1.createElement(T, {
            dimColor: !0
        }, V1.createElement(z1, null, V1.createElement(V1.Fragment, null, J6.totalPlugins, " ", O7(J6.totalPlugins, "plugin"), " available"), J6.installedCount > 0 && `${J6.installedCount} already installed`, J6.source))))), V1.createElement(u, {
            marginTop: 1
        }, V1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, V1.createElement(z1, null, V1.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), V1.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        })))))
    }
    if ($ === "plugin-details" && X) {
        let J6 = X.entry.homepage,
            $6 = F_6(X),
            H6 = Lx6(J6, $6);
        return V1.createElement(u, {
            flexDirection: "column"
        }, V1.createElement(u, {
            marginBottom: 1
        }, V1.createElement(T, {
            bold: !0
        }, "Plugin Details")), V1.createElement(u, {
            flexDirection: "column",
            marginBottom: 1
        }, V1.createElement(T, {
            bold: !0
        }, X.entry.name), X.entry.version && V1.createElement(T, {
            dimColor: !0
        }, "Version: ", X.entry.version), X.entry.description && V1.createElement(u, {
            marginTop: 1
        }, V1.createElement(T, null, X.entry.description)), X.entry.author && V1.createElement(u, {
            marginTop: 1
        }, V1.createElement(T, {
            dimColor: !0
        }, "By:", " ", typeof X.entry.author === "string" ? X.entry.author : X.entry.author.name))), V1.createElement(u, {
            flexDirection: "column",
            marginBottom: 1
        }, V1.createElement(T, {
            bold: !0
        }, "Will install:"), X.entry.commands && V1.createElement(T, {
            dimColor: !0
        }, "· Commands:", " ", Array.isArray(X.entry.commands) ? X.entry.commands.join(", ") : Object.keys(X.entry.commands).join(", ")), X.entry.agents && V1.createElement(T, {
            dimColor: !0
        }, "· Agents:", " ", Array.isArray(X.entry.agents) ? X.entry.agents.join(", ") : Object.keys(X.entry.agents).join(", ")), X.entry.hooks && V1.createElement(T, {
            dimColor: !0
        }, "· Hooks: ", Object.keys(X.entry.hooks).join(", ")), X.entry.mcpServers && V1.createElement(T, {
            dimColor: !0
        }, "· MCP Servers:", " ", Array.isArray(X.entry.mcpServers) ? X.entry.mcpServers.join(", ") : typeof X.entry.mcpServers === "object" ? Object.keys(X.entry.mcpServers).join(", ") : "configured"), !X.entry.commands && !X.entry.agents && !X.entry.hooks && !X.entry.mcpServers && V1.createElement(V1.Fragment, null, typeof X.entry.source === "object" && "source" in X.entry.source && (X.entry.source.source === "github" || X.entry.source.source === "url" || X.entry.source.source === "npm" || X.entry.source.source === "pip") ? V1.createElement(T, {
            dimColor: !0
        }, "· Component summary not available for remote plugin") : V1.createElement(T, {
            dimColor: !0
        }, "· Components will be discovered at installation"))), V1.createElement(Bi8, null), g && V1.createElement(u, {
            marginBottom: 1
        }, V1.createElement(T, {
            color: "error"
        }, "Error: ", g)), V1.createElement(u, {
            flexDirection: "column"
        }, H6.map((q6, o) => V1.createElement(u, {
            key: q6.action
        }, m === o && V1.createElement(T, null, "> "), m !== o && V1.createElement(T, null, "  "), V1.createElement(T, {
            bold: m === o
        }, F && q6.action === "install" ? "Installing…" : q6.label)))), V1.createElement(u, {
            marginTop: 1,
            paddingLeft: 1
        }, V1.createElement(T, {
            dimColor: !0
        }, V1.createElement(z1, null, V1.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), V1.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (D.length === 0) return V1.createElement(u, {
        flexDirection: "column"
    }, V1.createElement(u, {
        marginBottom: 1
    }, V1.createElement(T, {
        bold: !0
    }, "Install plugins")), V1.createElement(T, {
        dimColor: !0
    }, "No new plugins available to install."), V1.createElement(T, {
        dimColor: !0
    }, "All plugins from this marketplace are already installed."), V1.createElement(u, {
        marginLeft: 3
    }, V1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, V1.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let O6 = B.getVisibleItems(D);
    return V1.createElement(u, {
        flexDirection: "column"
    }, V1.createElement(u, {
        marginBottom: 1
    }, V1.createElement(T, {
        bold: !0
    }, "Install Plugins")), B.scrollPosition.canScrollUp && V1.createElement(u, null, V1.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowUp, " more above")), O6.map((J6, $6) => {
        let H6 = B.toActualIndex($6),
            q6 = k === H6,
            o = R.has(J6.pluginId),
            _6 = C.has(J6.pluginId),
            r = $6 === O6.length - 1;
        return V1.createElement(u, {
            key: J6.pluginId,
            flexDirection: "column",
            marginBottom: r && !q ? 0 : 1
        }, V1.createElement(u, null, V1.createElement(T, {
            color: q6 ? "suggestion" : void 0
        }, q6 ? e6.pointer : " ", " "), V1.createElement(T, {
            color: J6.isInstalled ? "success" : void 0
        }, J6.isInstalled ? e6.tick : _6 ? e6.ellipsis : o ? e6.radioOn : e6.radioOff, " ", J6.entry.name, J6.entry.category && V1.createElement(T, {
            dimColor: !0
        }, " [", J6.entry.category, "]"), J6.entry.tags?.includes("community-managed") && V1.createElement(T, {
            dimColor: !0
        }, " [Community Managed]"), J6.isInstalled && V1.createElement(T, {
            dimColor: !0
        }, " (installed)"), v && H === WM && V1.createElement(T, {
            dimColor: !0
        }, " · ", Ii8(v.get(J6.pluginId) ?? 0), " ", "installs"))), J6.entry.description && V1.createElement(u, {
            marginLeft: 4
        }, V1.createElement(T, {
            dimColor: !0
        }, j4(J6.entry.description, 60)), J6.entry.version && V1.createElement(T, {
            dimColor: !0
        }, " · v", J6.entry.version)))
    }), B.scrollPosition.canScrollDown && V1.createElement(u, null, V1.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowDown, " more below")), q && V1.createElement(u, {
        marginTop: 1
    }, V1.createElement(T, {
        color: "error"
    }, V1.createElement(D4, {
        status: "error",
        withSpace: !0
    }), q)), V1.createElement(lpK, {
        hasSelection: R.size > 0
    }))
}
// @from(Ln 454106, Col 4)
V1
// @from(Ln 454106, Col 8)
G0
// @from(Ln 454107, Col 4)
ipK = L(() => {
    Qq();
    bK();
    Nq();
    Y2();
    g6();
    C7();
    Nj();
    K8();
    m8();
    uR();
    xi8();
    yD();
    Xc();
    m$();
    qH6();
    Y56();
    AH6();
    U86();
    mi8();
    Ow7();
    ww7();
    W_8();
    V1 = K6(P6(), 1), G0 = K6(P6(), 1)
})
// @from(Ln 454133, Col 0)
function rpK({
    error: q,
    setError: K,
    result: _,
    setResult: z,
    setViewState: Y,
    onInstallComplete: A,
    onSearchModeChange: O,
    targetPlugin: w
}) {
    let [$, j] = FJ.useState("plugin-list"), [H, J] = FJ.useState(null), [X, M] = FJ.useState([]), [P, W] = FJ.useState(!0), [D, Z] = FJ.useState(null), [G, f] = FJ.useState(!1), v = FJ.useCallback((M6) => {
        f(M6), O?.(M6)
    }, [O]), {
        query: V,
        setQuery: k,
        cursorOffset: N,
        handleKeyDown: R,
        handlePaste: h
    } = bS({
        isActive: $ === "plugin-list" && G && !P,
        onExit: () => {
            v(!1)
        }
    }), C = K2(), {
        columns: x
    } = s1(), B = FJ.useMemo(() => {
        if (!V) return X;
        let M6 = V.toLowerCase();
        return X.filter((W6) => W6.entry.name.toLowerCase().includes(M6) || W6.entry.description?.toLowerCase().includes(M6) || W6.marketplaceName.toLowerCase().includes(M6))
    }, [X, V]), [m, S] = FJ.useState(0), [F, U] = FJ.useState(new Set), [g, c] = FJ.useState(new Set), n = QP6({
        totalItems: B.length,
        selectedIndex: m
    });
    FJ.useEffect(() => {
        S(0)
    }, [V]);
    let [l, z6] = FJ.useState(0), [A6, e] = FJ.useState(!1), [i, O6] = FJ.useState(null), [J6, $6] = FJ.useState(null), [H6, q6] = FJ.useState(null);
    FJ.useEffect(() => {
        async function M6() {
            try {
                let W6 = await Dz(),
                    {
                        marketplaces: V6,
                        failures: f6
                    } = await Rp(W6),
                    G6 = [];
                for (let {
                        name: y6,
                        data: c6
                    }
                    of V6)
                    if (c6)
                        for (let Z8 of c6.plugins) {
                            let N8 = Jc(Z8.name, y6);
                            G6.push({
                                entry: Z8,
                                marketplaceName: y6,
                                pluginId: N8,
                                isInstalled: Hu(N8)
                            })
                        }
                let k6 = G6.filter((y6) => !y6.isInstalled && !Rk(y6.pluginId));
                try {
                    let y6 = await Ex6();
                    if (Z(y6), y6) k6.sort((c6, Z8) => {
                        let N8 = y6.get(c6.pluginId) ?? 0,
                            R6 = y6.get(Z8.pluginId) ?? 0;
                        if (N8 !== R6) return R6 - N8;
                        return c6.entry.name.localeCompare(Z8.entry.name)
                    });
                    else k6.sort((c6, Z8) => c6.entry.name.localeCompare(Z8.entry.name))
                } catch (y6) {
                    E(`Failed to fetch install counts: ${b6(y6)}`), k6.sort((c6, Z8) => c6.entry.name.localeCompare(Z8.entry.name))
                }
                M(k6);
                let T6 = Object.keys(W6).length;
                if (k6.length === 0) {
                    let y6 = await Zf4({
                        configuredMarketplaceCount: T6,
                        failedMarketplaceCount: f6.length
                    });
                    if (y6 === "all-plugins-installed" && G6.length > 0 && G6.every((c6) => c6.isInstalled && !aM6(c6.pluginId)) && !G6.some((c6) => Rk(c6.pluginId))) y6 = "all-plugins-project-installed";
                    q6(y6)
                }
                let v6 = w7(V6, (y6) => y6.data !== null),
                    L6 = $L6(f6, v6);
                if (L6)
                    if (L6.type === "warning") $6(L6.message + (k6.length > 0 ? ". Showing available plugins." : "."));
                    else throw Error(L6.message);
                if (w) {
                    let y6 = G6.find((c6) => c6.entry.name === w);
                    if (y6)
                        if (aM6(y6.pluginId)) K(`Plugin '${y6.pluginId}' is already installed. Use '/plugin' to manage existing plugins.`);
                        else J(y6), j("plugin-details");
                    else K(`Plugin "${w}" not found in any marketplace`)
                }
            } catch (W6) {
                K(W6 instanceof Error ? W6.message : "Failed to load plugins")
            } finally {
                W(!1)
            }
        }
        M6()
    }, [K, w]);
    let o = async () => {
        if (F.size === 0) return;
        let M6 = X.filter((G6) => F.has(G6.pluginId));
        c(new Set(M6.map((G6) => G6.pluginId)));
        let W6 = 0,
            V6 = 0,
            f6 = [];
        for (let G6 of M6) {
            let k6 = await z56({
                pluginId: G6.pluginId,
                entry: G6.entry,
                marketplaceName: G6.marketplaceName,
                scope: "user"
            });
            if (k6.success) W6++;
            else V6++, f6.push({
                name: G6.entry.name,
                reason: k6.error
            })
        }
        if (c(new Set), U(new Set), YO(), V6 === 0) {
            let G6 = `✓ Installed ${W6} ${O7(W6,"plugin")}. Run /reload-plugins to activate.`;
            z(G6)
        } else if (W6 === 0) K(`Failed to install: ${wL6(f6,!0)}`);
        else {
            let G6 = `✓ Installed ${W6} of ${W6+V6} plugins. Failed: ${wL6(f6,!1)}. Run /reload-plugins to activate successfully installed plugins.`;
            z(G6)
        }
        if (W6 > 0) {
            if (A) await A()
        }
        Y({
            type: "menu"
        })
    }, _6 = async (M6, W6 = "user") => {
        e(!0), O6(null);
        let V6 = await z56({
            pluginId: M6.pluginId,
            entry: M6.entry,
            marketplaceName: M6.marketplaceName,
            scope: W6
        });
        if (V6.success) {
            let f6 = await ui8(M6.pluginId);
            if (f6) {
                e(!1), j({
                    type: "plugin-options",
                    plugin: f6,
                    pluginId: M6.pluginId,
                    depNote: V6.depNote
                });
                return
            }
            if (z(V6.message), A) await A();
            Y({
                type: "menu"
            })
        } else e(!1), O6(V6.error)
    };
    FJ.useEffect(() => {
        if (q) z(q)
    }, [q, z]), G1("confirm:no", () => {
        j("plugin-list"), J(null)
    }, {
        context: "Confirmation",
        isActive: $ === "plugin-details"
    }), G1("confirm:no", () => {
        Y({
            type: "menu"
        })
    }, {
        context: "Confirmation",
        isActive: $ === "plugin-list" && !G
    });

    function r(M6) {
        if (G) {
            R(M6);
            return
        }
        if (M6.ctrl || M6.meta || P) return;
        if (M6.key === "/") M6.preventDefault(), v(!0), k("");
        else if (M6.key.length === 1 && M6.key !== " ") M6.preventDefault(), v(!0), k(M6.key)
    }

    function t(M6) {
        if (G) {
            h(M6);
            return
        }
        if (P) return;
        let W6 = (M6.text.split(/\r\n|\r|\n/, 2)[0] ?? "").trim();
        if (!W6) return;
        M6.preventDefault(), v(!0), k(W6)
    }
    L7({
        "select:previous": () => {
            if (m === 0) v(!0);
            else n.handleSelectionChange(m - 1, S)
        },
        "select:next": () => {
            if (m < B.length - 1) n.handleSelectionChange(m + 1, S)
        },
        "select:accept": () => {
            if (m === B.length && F.size > 0) o();
            else if (m < B.length) {
                let M6 = B[m];
                if (M6)
                    if (M6.isInstalled) Y({
                        type: "manage-plugins",
                        targetPlugin: M6.entry.name,
                        targetMarketplace: M6.marketplaceName
                    });
                    else J(M6), j("plugin-details"), z6(0), O6(null)
            }
        }
    }, {
        context: "Select",
        isActive: $ === "plugin-list" && !G
    }), L7({
        "plugin:toggle": () => {
            if (m < B.length) {
                let M6 = B[m];
                if (M6 && !M6.isInstalled) {
                    let W6 = new Set(F);
                    if (W6.has(M6.pluginId)) W6.delete(M6.pluginId);
                    else W6.add(M6.pluginId);
                    U(W6)
                }
            }
        },
        "plugin:install": () => {
            if (F.size > 0) o()
        }
    }, {
        context: "Plugin",
        isActive: $ === "plugin-list" && !G
    });
    let Y6 = J1.useMemo(() => {
        if (!H) return [];
        let M6 = H.entry.homepage,
            W6 = F_6(H);
        return Lx6(M6, W6)
    }, [H]);
    if (L7({
            "select:previous": () => {
                if (l > 0) z6(l - 1)
            },
            "select:next": () => {
                if (l < Y6.length - 1) z6(l + 1)
            },
            "select:accept": () => {
                if (!H) return;
                let M6 = Y6[l]?.action,
                    W6 = H.entry.homepage,
                    V6 = F_6(H);
                if (M6 === "install-user") _6(H, "user");
                else if (M6 === "install-project") _6(H, "project");
                else if (M6 === "install-local") _6(H, "local");
                else if (M6 === "homepage" && W6) J3(W6);
                else if (M6 === "github" && V6) J3(`https://github.com/${V6}`);
                else if (M6 === "back") j("plugin-list"), J(null)
            }
        }, {
            context: "Select",
            isActive: $ === "plugin-details" && !!H
        }), typeof $ === "object" && $.type === "plugin-options") {
        let f6 = function(G6) {
                if (z(G6), A) A();
                Y({
                    type: "menu"
                })
            },
            {
                plugin: M6,
                pluginId: W6,
                depNote: V6
            } = $;
        return J1.createElement(yx6, {
            plugin: M6,
            pluginId: W6,
            onDone: (G6, k6) => {
                switch (G6) {
                    case "configured":
                        f6(`✓ Installed and configured ${M6.name}${V6}. Run /reload-plugins to apply.`);
                        break;
                    case "skipped":
                        f6(`✓ Installed ${M6.name}${V6}. Run /reload-plugins to apply.`);
                        break;
                    case "error":
                        f6(`Installed but failed to save config: ${k6}`);
                        break
                }
            }
        })
    }
    if (P) return J1.createElement(T, null, "Loading…");
    if (q) return J1.createElement(T, {
        color: "error"
    }, q);
    if ($ === "plugin-details" && H) {
        let M6 = H.entry.homepage,
            W6 = F_6(H),
            V6 = Lx6(M6, W6);
        return J1.createElement(u, {
            flexDirection: "column"
        }, J1.createElement(u, {
            marginBottom: 1
        }, J1.createElement(T, {
            bold: !0
        }, "Plugin details")), J1.createElement(u, {
            flexDirection: "column",
            marginBottom: 1
        }, J1.createElement(T, {
            bold: !0
        }, H.entry.name), J1.createElement(T, {
            dimColor: !0
        }, "from ", H.marketplaceName), H.entry.version && J1.createElement(T, {
            dimColor: !0
        }, "Version: ", H.entry.version), H.entry.description && J1.createElement(u, {
            marginTop: 1
        }, J1.createElement(T, null, H.entry.description)), H.entry.author && J1.createElement(u, {
            marginTop: 1
        }, J1.createElement(T, {
            dimColor: !0
        }, "By:", " ", typeof H.entry.author === "string" ? H.entry.author : H.entry.author.name))), J1.createElement(Bi8, null), i && J1.createElement(u, {
            marginBottom: 1
        }, J1.createElement(T, {
            color: "error"
        }, "Error: ", i)), J1.createElement(u, {
            flexDirection: "column"
        }, V6.map((f6, G6) => J1.createElement(u, {
            key: f6.action
        }, l === G6 && J1.createElement(T, null, "> "), l !== G6 && J1.createElement(T, null, "  "), J1.createElement(T, {
            bold: l === G6
        }, A6 && f6.action.startsWith("install-") ? "Installing…" : f6.label)))), J1.createElement(u, {
            marginTop: 1
        }, J1.createElement(T, {
            dimColor: !0
        }, J1.createElement(z1, null, J1.createElement(v1, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), J1.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (X.length === 0) return J1.createElement(u, {
        flexDirection: "column"
    }, J1.createElement(u, {
        marginBottom: 1
    }, J1.createElement(T, {
        bold: !0
    }, "Discover plugins")), J6 && J1.createElement(u, {
        marginBottom: 1
    }, J1.createElement(T, {
        color: "warning"
    }, J1.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), J6)), J1.createElement(YxY, {
        reason: H6
    }), J1.createElement(u, {
        marginTop: 1
    }, J1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J1.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let X6 = n.getVisibleItems(B);
    return J1.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: r,
        onPaste: t
    }, J1.createElement(u, null, J1.createElement(T, {
        bold: !0
    }, "Discover plugins"), n.needsPagination && J1.createElement(T, {
        dimColor: !0
    }, " ", "(", n.scrollPosition.current, "/", n.scrollPosition.total, ")")), J1.createElement(u, {
        marginBottom: 1
    }, J1.createElement(wg, {
        query: V,
        isFocused: G,
        isTerminalFocused: C,
        width: x - 4,
        cursorOffset: N
    })), J6 && J1.createElement(u, {
        marginBottom: 1
    }, J1.createElement(T, {
        color: "warning"
    }, J1.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), J6)), B.length === 0 && V && J1.createElement(u, {
        marginBottom: 1
    }, J1.createElement(T, {
        dimColor: !0
    }, 'No plugins match "', V, '"')), n.scrollPosition.canScrollUp && J1.createElement(u, null, J1.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowUp, " more above")), X6.map((M6, W6) => {
        let V6 = n.toActualIndex(W6),
            f6 = m === V6,
            G6 = F.has(M6.pluginId),
            k6 = g.has(M6.pluginId),
            T6 = W6 === X6.length - 1;
        return J1.createElement(u, {
            key: `${n.startIndex}-${M6.pluginId}`,
            flexDirection: "column",
            marginBottom: T6 && !q ? 0 : 1
        }, J1.createElement(u, null, J1.createElement(T, {
            color: f6 && !G ? "suggestion" : void 0
        }, f6 && !G ? e6.pointer : " ", " "), J1.createElement(T, null, k6 ? e6.ellipsis : G6 ? e6.radioOn : e6.radioOff, " ", M6.entry.name, J1.createElement(T, {
            dimColor: !0
        }, " · ", M6.marketplaceName), M6.entry.tags?.includes("community-managed") && J1.createElement(T, {
            dimColor: !0
        }, " [Community Managed]"), D && M6.marketplaceName === WM && J1.createElement(T, {
            dimColor: !0
        }, " · ", Ii8(D.get(M6.pluginId) ?? 0), " ", "installs"))), M6.entry.description && J1.createElement(u, {
            marginLeft: 4
        }, J1.createElement(T, {
            dimColor: !0
        }, j4(M6.entry.description, 60))))
    }), n.scrollPosition.canScrollDown && J1.createElement(u, null, J1.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowDown, " more below")), q && J1.createElement(u, {
        marginTop: 1
    }, J1.createElement(T, {
        color: "error"
    }, J1.createElement(D4, {
        status: "error",
        withSpace: !0
    }), q)), J1.createElement(zxY, {
        hasSelection: F.size > 0,
        canToggle: m < B.length && !B[m]?.isInstalled
    }))
}
// @from(Ln 454584, Col 0)
function zxY(q) {
    let K = s(10),
        {
            hasSelection: _,
            canToggle: z
        } = q,
        Y;
    if (K[0] !== _) Y = _ && J1.createElement(v1, {
        action: "plugin:install",
        context: "Plugin",
        fallback: "i",
        description: "install",
        bold: !0
    }), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) A = J1.createElement(T, null, "type to search"), K[2] = A;
    else A = K[2];
    let O;
    if (K[3] !== z) O = z && J1.createElement(v1, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), K[3] = z, K[4] = O;
    else O = K[4];
    let w, $;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) w = J1.createElement(v1, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), $ = J1.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), K[5] = w, K[6] = $;
    else w = K[5], $ = K[6];
    let j;
    if (K[7] !== Y || K[8] !== O) j = J1.createElement(u, {
        marginTop: 1
    }, J1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J1.createElement(z1, null, Y, A, O, w, $))), K[7] = Y, K[8] = O, K[9] = j;
    else j = K[9];
    return j
}
// @from(Ln 454634, Col 0)
function YxY(q) {
    let K = s(7),
        {
            reason: _
        } = q;
    switch (_) {
        case "git-not-installed": {
            let z;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "Git is required to install marketplaces."), J1.createElement(T, {
                dimColor: !0
            }, "Please install git and restart Claude Code.")), K[0] = z;
            else z = K[0];
            return z
        }
        case "all-blocked-by-policy": {
            let z;
            if (K[1] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "Your organization policy does not allow any external marketplaces."), J1.createElement(T, {
                dimColor: !0
            }, "Contact your administrator.")), K[1] = z;
            else z = K[1];
            return z
        }
        case "policy-restricts-sources": {
            let z;
            if (K[2] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "Your organization restricts which marketplaces can be added."), J1.createElement(T, {
                dimColor: !0
            }, "Switch to the Marketplaces tab to view allowed sources.")), K[2] = z;
            else z = K[2];
            return z
        }
        case "all-marketplaces-failed": {
            let z;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "Failed to load marketplace data."), J1.createElement(T, {
                dimColor: !0
            }, "Check your network connection.")), K[3] = z;
            else z = K[3];
            return z
        }
        case "all-plugins-installed": {
            let z;
            if (K[4] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "All available plugins are already installed."), J1.createElement(T, {
                dimColor: !0
            }, "Check for new plugins later or add more marketplaces.")), K[4] = z;
            else z = K[4];
            return z
        }
        case "all-plugins-project-installed": {
            let z;
            if (K[5] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "All available plugins are installed for this project."), J1.createElement(T, {
                dimColor: !0
            }, "Use the Browse tab to install at user scope.")), K[5] = z;
            else z = K[5];
            return z
        }
        case "no-marketplaces-configured":
        default: {
            let z;
            if (K[6] === Symbol.for("react.memo_cache_sentinel")) z = J1.createElement(J1.Fragment, null, J1.createElement(T, {
                dimColor: !0
            }, "No plugins available."), J1.createElement(T, {
                dimColor: !0
            }, "Add a marketplace first using the Marketplaces tab.")), K[6] = z;
            else z = K[6];
            return z
        }
    }
}
// @from(Ln 454713, Col 4)
J1
// @from(Ln 454713, Col 8)
FJ
// @from(Ln 454714, Col 4)
opK = L(() => {
    o6();
    Qq();
    bK();
    Nq();
    Y2();
    EP6();
    R_6();
    I4();
    g6();
    C7();
    Nj();
    K8();
    m8();
    uR();
    xi8();
    yD();
    Xc();
    m$();
    qH6();
    Y56();
    AH6();
    U86();
    mi8();
    Ow7();
    ww7();
    W_8();
    J1 = K6(P6(), 1), FJ = K6(P6(), 1)
})
// @from(Ln 454748, Col 0)
function $w7(q) {
    if (!vG.includes(q)) throw Error(`Invalid scope "${q}". Must be one of: ${vG.join(", ")}`)
}
// @from(Ln 454752, Col 0)
function Rx6(q) {
    return vG.includes(q)
}
// @from(Ln 454756, Col 0)
function apK(q) {
    return q === "project" || q === "local" ? Y7() : void 0
}
// @from(Ln 454760, Col 0)
function spK(q) {
    return E1("projectSettings")?.enabledPlugins?.[q] === !0
}
// @from(Ln 454764, Col 0)
function wxY(q) {
    let K = q.includes("@"),
        _ = ["local", "project", "user"];
    for (let z of _) {
        let Y = E1(jc(z))?.enabledPlugins;
        if (!Y) continue;
        for (let A of Object.keys(Y))
            if (K ? A === q : A.startsWith(`${q}@`)) return {
                pluginId: A,
                scope: z
            }
    }
    return null
}
// @from(Ln 454779, Col 0)
function $xY(q, K) {
    let {
        name: _,
        marketplace: z
    } = Z4(q);
    return K.find((Y) => {
        if (Y.name === q || Y.name === _) return !0;
        if (z && Y.source) return Y.name === _ && Y.source.includes(`@${z}`);
        return !1
    })
}
// @from(Ln 454791, Col 0)
function jxY(q) {
    let {
        name: K
    } = Z4(q), _ = OZ();
    if (_.plugins[q]?.length) return {
        pluginId: q,
        pluginName: K
    };
    let z = Object.keys(_.plugins).find((Y) => {
        let {
            name: A
        } = Z4(Y);
        return A === K && (_.plugins[Y]?.length ?? 0) > 0
    });
    if (z) return {
        pluginId: z,
        pluginName: K
    };
    return null
}
// @from(Ln 454812, Col 0)
function pi8(q) {
    let _ = OZ().plugins[q];
    if (!_ || _.length === 0) return {
        scope: "user"
    };
    let z = Y7(),
        Y = _.find((w) => w.scope === "local" && w.projectPath === z);
    if (Y) return {
        scope: Y.scope,
        projectPath: Y.projectPath
    };
    let A = _.find((w) => w.scope === "project" && w.projectPath === z);
    if (A) return {
        scope: A.scope,
        projectPath: A.projectPath
    };
    let O = _.find((w) => w.scope === "user");
    if (O) return {
        scope: O.scope
    };
    return {
        scope: _[0].scope,
        projectPath: _[0].projectPath
    }
}
// @from(Ln 454837, Col 0)
async function tpK(q, K = "user") {
    $w7(K);
    let {
        name: _,
        marketplace: z
    } = Z4(q), Y, A, O;
    if (z) {
        let H = await mf(q);
        if (H) Y = H.entry, A = z, O = H.marketplaceInstallLocation
    } else {
        let H = await Dz();
        for (let [J, X] of Object.entries(H)) try {
            let P = (await xf(J)).plugins.find((W) => W.name === _);
            if (P) {
                Y = P, A = J, O = X.installLocation;
                break
            }
        } catch (M) {
            j6(r1(M));
            continue
        }
    }
    if (!Y || !A) {
        let H = z ? `marketplace "${z}"` : "any configured marketplace";
        return {
            success: !1,
            message: `Plugin "${_}" not found in ${H}`
        }
    }
    let w = Y,
        $ = `${w.name}@${A}`,
        j = await $d1({
            pluginId: $,
            entry: w,
            scope: K,
            marketplaceInstallLocation: O,
            trigger: "cli"
        });
    if (!j.ok) switch (j.reason) {
        case "local-source-no-location":
            return {
                success: !1, message: `Cannot install local plugin "${j.pluginName}" without marketplace install location`
            };
        case "settings-write-failed":
            return {
                success: !1, message: `Failed to update settings: ${j.message}`
            };
        case "resolution-failed":
            return {
                success: !1, message: wd1(j.resolution)
            };
        case "blocked-by-policy":
            return {
                success: !1, message: `Plugin "${j.pluginName}" is blocked by your organization's policy and cannot be installed`
            };
        case "dependency-blocked-by-policy":
            return {
                success: !1, message: `Plugin "${j.pluginName}" depends on "${j.blockedDependency}", which is blocked by your organization's policy`
            };
        case "range-conflict": {
            let H = j.dep === $ ? "Plugin" : "Dependency";
            return {
                success: !1,
                message: fS8(H, j.dep, j.ranges, j.why)
            }
        }
        case "no-matching-tag": {
            let H = j.dep === $ ? "Plugin" : "Dependency";
            return {
                success: !1,
                message: GS8(H, j.dep, j.range)
            }
        }
    }
    return {
        success: !0,
        message: `Successfully installed plugin: ${$} (scope: ${K})${j.depNote}`,
        pluginId: $,
        pluginName: w.name,
        scope: K
    }
}
// @from(Ln 454919, Col 0)
async function ie(q, K = "user", _ = !0) {
    $w7(K);
    let {
        enabled: z,
        disabled: Y
    } = await sW(), A = [...z, ...Y], O = $xY(q, A), w = jc(K), $ = E1(w), j, H;
    if (O) j = Object.keys($?.enabledPlugins ?? {}).find((k) => k === q || k === O.name || k.startsWith(`${O.name}@`)) ?? (q.includes("@") ? q : O.name), H = O.name;
    else {
        let k = jxY(q);
        if (!k) return {
            success: !1,
            message: `Plugin "${q}" not found in installed plugins`
        };
        j = k.pluginId, H = k.pluginName
    }
    let J = apK(K),
        M = OZ().plugins[j],
        P = M?.find((k) => k.scope === K && k.projectPath === J);
    if (!P) {
        let {
            scope: k
        } = pi8(j);
        if (k !== K && M && M.length > 0) {
            if (k === "project") return {
                success: !1,
                message: `Plugin "${q}" is enabled at project scope (.claude/settings.json, shared with your team). To disable just for you: claude plugin disable ${q} --scope local`
            };
            return {
                success: !1,
                message: `Plugin "${q}" is installed in ${k} scope, not ${K}. Use --scope ${k} to uninstall.`
            }
        }
        return {
            success: !1,
            message: `Plugin "${q}" is not installed in ${K} scope. Use --scope to specify the correct scope.`
        }
    }
    let W = P.installPath,
        D = {
            ...$?.enabledPlugins
        };
    D[j] = void 0, P7(w, {
        enabledPlugins: D
    }), YO(), DEK(j, K, J);
    let G = OZ().plugins[j],
        f = !G || G.length === 0;
    if (f && W) await hI6(W);
    if (f) {
        if (Vb8(j), _) await PS8(j)
    }
    let v = vQ1(j, A),
        V = TQ1(v);
    return {
        success: !0,
        message: `Successfully uninstalled plugin: ${H} (scope: ${K})${V}`,
        pluginId: j,
        pluginName: H,
        scope: K,
        reverseDependents: v.length > 0 ? v : void 0
    }
}
// @from(Ln 454980, Col 0)
async function jw7(q, K, _) {
    let z = K ? "enable" : "disable";
    if (qf4(q)) {
        let {
            error: D
        } = P7("userSettings", {
            enabledPlugins: {
                ...E1("userSettings")?.enabledPlugins,
                [q]: K
            }
        });
        if (D) return {
            success: !1,
            message: `Failed to ${z} built-in plugin: ${D.message}`
        };
        YO();
        let {
            name: Z
        } = Z4(q);
        return {
            success: !0,
            message: `Successfully ${z}d built-in plugin: ${Z}`,
            pluginId: q,
            pluginName: Z,
            scope: "user"
        }
    }
    if (_) $w7(_);
    let Y, A, O = wxY(q);
    if (_)
        if (A = _, O) Y = O.pluginId;
        else if (q.includes("@")) Y = q;
    else return {
        success: !1,
        message: `Plugin "${q}" not found in settings. Use plugin@marketplace format.`
    };
    else if (O) Y = O.pluginId, A = O.scope;
    else if (q.includes("@")) Y = q, A = "user";
    else return {
        success: !1,
        message: `Plugin "${q}" not found in any editable settings scope. Use plugin@marketplace format.`
    };
    if (K && Rk(Y)) return {
        success: !1,
        message: `Plugin "${Y}" is blocked by your organization's policy and cannot be enabled`
    };
    let w = jc(A),
        $ = E1(w)?.enabledPlugins?.[Y],
        j = {
            user: 0,
            project: 1,
            local: 2
        },
        H = _ && O && j[_] > j[O.scope];
    if (_ && $ === void 0 && O && O.scope !== _ && !H) return {
        success: !1,
        message: `Plugin "${q}" is installed at ${O.scope} scope, not ${_}. Use --scope ${O.scope} or omit --scope to auto-detect.`
    };
    let J = _ && !H ? $ === !0 : p_6().has(Y);
    if (K === J) return {
        success: !1,
        message: `Plugin "${q}" is already ${K?"enabled":"disabled"}${_?` at ${_} scope`:""}`
    };
    let X;
    if (!K) {
        let {
            enabled: D,
            disabled: Z
        } = await sW(), G = vQ1(Y, [...D, ...Z]);
        if (G.length > 0) X = G
    }
    let {
        error: M
    } = P7(w, {
        enabledPlugins: {
            ...E1(w)?.enabledPlugins,
            [Y]: K
        }
    });
    if (M) return {
        success: !1,
        message: `Failed to ${z} plugin: ${M.message}`
    };
    YO();
    let {
        name: P
    } = Z4(Y), W = TQ1(X);
    return {
        success: !0,
        message: `Successfully ${z}d plugin: ${P} (scope: ${A})${W}`,
        pluginId: Y,
        pluginName: P,
        scope: A,
        reverseDependents: X
    }
}
// @from(Ln 455076, Col 0)
async function Sx6(q, K) {
    return jw7(q, !0, K)
}
// @from(Ln 455079, Col 0)
async function Cx6(q, K) {
    return jw7(q, !1, K)
}
// @from(Ln 455082, Col 0)
async function epK() {
    let q = p_6();
    if (q.size === 0) return {
        success: !0,
        message: "No enabled plugins to disable"
    };
    let K = [],
        _ = [];
    for (let [z] of q) {
        let Y = await jw7(z, !1);
        if (Y.success) K.push(z);
        else _.push(`${z}: ${Y.message}`)
    }
    if (_.length > 0) return {
        success: !1,
        message: `Disabled ${K.length} ${O7(K.length,"plugin")}, ${_.length} failed:
${_.join(`
`)}`
    };
    return {
        success: !0,
        message: `Disabled ${K.length} ${O7(K.length,"plugin")}`
    }
}