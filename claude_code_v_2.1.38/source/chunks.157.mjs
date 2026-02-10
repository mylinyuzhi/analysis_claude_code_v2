
// @from(Ln 402715, Col 0)
function aaY(A) {
    return A.pending ? Dc.default.createElement(V, null, "Press ", A.keyName, " again to exit") : Dc.default.createElement(oA, null, Dc.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), Dc.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), Dc.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }))
}
// @from(Ln 402730, Col 0)
function saY(A) {
    return A.mcp.tools
}
// @from(Ln 402733, Col 4)
Dc
// @from(Ln 402734, Col 4)
IV6 = v(() => {
    i1();
    m1();
    wY();
    tX();
    _T();
    d8();
    Bq();
    HK();
    wK();
    BK();
    Dc = o(X1(), 1)
})
// @from(Ln 402748, Col 0)
function Rp1(A) {
    let q = e(44),
        {
            tool: K,
            server: Y,
            onBack: z
        } = A,
        [w, H] = Dw.default.useState(""),
        $, O;
    if (q[0] !== Y.name || q[1] !== K) {
        O = Fn1(K.name, Y.name);
        let p = K.userFacingName ? K.userFacingName({}) : O;
        $ = Qn1(p), q[0] = Y.name, q[1] = K, q[2] = $, q[3] = O
    } else $ = q[2], O = q[3];
    let _ = $,
        J;
    if (q[4] !== K) J = K.isReadOnly?.({}) ?? !1, q[4] = K, q[5] = J;
    else J = q[5];
    let X = J,
        D;
    if (q[6] !== K) D = K.isDestructive?.({}) ?? !1, q[6] = K, q[7] = D;
    else D = q[7];
    let j = D,
        M;
    if (q[8] !== K) M = K.isOpenWorld?.({}) ?? !1, q[8] = K, q[9] = M;
    else M = q[9];
    let P = M,
        W, G;
    if (q[10] !== K) W = () => {
        (async function() {
            try {
                let r = await K.description({}, {
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
                H(r)
            } catch {
                H("Failed to load description")
            }
        })()
    }, G = [K], q[10] = K, q[11] = W, q[12] = G;
    else W = q[11], G = q[12];
    Dw.default.useEffect(W, G);
    let f;
    if (q[13] !== X) f = X && Dw.default.createElement(V, {
        color: "success"
    }, " [read-only]"), q[13] = X, q[14] = f;
    else f = q[14];
    let Z;
    if (q[15] !== j) Z = j && Dw.default.createElement(V, {
        color: "error"
    }, " [destructive]"), q[15] = j, q[16] = Z;
    else Z = q[16];
    let N;
    if (q[17] !== P) N = P && Dw.default.createElement(V, {
        dimColor: !0
    }, " [open-world]"), q[17] = P, q[18] = N;
    else N = q[18];
    let T;
    if (q[19] !== _ || q[20] !== f || q[21] !== Z || q[22] !== N) T = Dw.default.createElement(Dw.default.Fragment, null, _, f, Z, N), q[19] = _, q[20] = f, q[21] = Z, q[22] = N, q[23] = T;
    else T = q[23];
    let k = T,
        y;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) y = Dw.default.createElement(V, {
        bold: !0
    }, "Tool name: "), q[24] = y;
    else y = q[24];
    let B;
    if (q[25] !== O) B = Dw.default.createElement(I, null, y, Dw.default.createElement(V, {
        dimColor: !0
    }, O)), q[25] = O, q[26] = B;
    else B = q[26];
    let S;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) S = Dw.default.createElement(V, {
        bold: !0
    }, "Full name: "), q[27] = S;
    else S = q[27];
    let m;
    if (q[28] !== K.name) m = Dw.default.createElement(I, null, S, Dw.default.createElement(V, {
        dimColor: !0
    }, K.name)), q[28] = K.name, q[29] = m;
    else m = q[29];
    let b;
    if (q[30] !== w) b = w && Dw.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Dw.default.createElement(V, {
        bold: !0
    }, "Description:"), Dw.default.createElement(V, {
        wrap: "wrap"
    }, w)), q[30] = w, q[31] = b;
    else b = q[31];
    let g;
    if (q[32] !== K.inputJSONSchema) g = K.inputJSONSchema && K.inputJSONSchema.properties && Object.keys(K.inputJSONSchema.properties).length > 0 && Dw.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Dw.default.createElement(V, {
        bold: !0
    }, "Parameters:"), Dw.default.createElement(I, {
        marginLeft: 2,
        flexDirection: "column"
    }, Object.entries(K.inputJSONSchema.properties).map((p) => {
        let [l, r] = p, O1 = K.inputJSONSchema?.required?.includes(l);
        return Dw.default.createElement(V, {
            key: l
        }, "• ", l, O1 && Dw.default.createElement(V, {
            dimColor: !0
        }, " (required)"), ":", " ", Dw.default.createElement(V, {
            dimColor: !0
        }, typeof r === "object" && r && "type" in r ? String(r.type) : "unknown"), typeof r === "object" && r && "description" in r && Dw.default.createElement(V, {
            dimColor: !0
        }, " - ", String(r.description)))
    }))), q[32] = K.inputJSONSchema, q[33] = g;
    else g = q[33];
    let U;
    if (q[34] !== B || q[35] !== m || q[36] !== b || q[37] !== g) U = Dw.default.createElement(I, {
        flexDirection: "column"
    }, B, m, b, g), q[34] = B, q[35] = m, q[36] = b, q[37] = g, q[38] = U;
    else U = q[38];
    let x;
    if (q[39] !== z || q[40] !== Y.name || q[41] !== U || q[42] !== k) x = Dw.default.createElement(w8, {
        title: k,
        subtitle: Y.name,
        onCancel: z,
        inputGuide: taY
    }, U), q[39] = z, q[40] = Y.name, q[41] = U, q[42] = k, q[43] = x;
    else x = q[43];
    return x
}
// @from(Ln 402886, Col 0)
function taY(A) {
    return A.pending ? Dw.default.createElement(V, null, "Press ", A.keyName, " again to exit") : Dw.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })
}
// @from(Ln 402894, Col 4)
Dw
// @from(Ln 402895, Col 4)
xV6 = v(() => {
    i1();
    m1();
    _T();
    Bq();
    BK();
    Dw = o(X1(), 1)
})
// @from(Ln 402904, Col 0)
function ZxA({
    agentServer: A,
    onCancel: q,
    onComplete: K
}) {
    let [Y] = T7(), [z, w] = je.useState(!1), [H, $] = je.useState(null), [O, _] = je.useState(null), [J, X] = je.useState(null), D = je.useCallback(() => {
        if (z) {
            if (J) J.abort();
            w(!1), _(null), X(null)
        }
    }, [z, J]);
    DA("confirm:no", D, {
        context: "Confirmation",
        isActive: z
    });
    let j = je.useCallback(async () => {
            if (!A.needsAuth || !A.url) return;
            w(!0), $(null);
            let W = new AbortController;
            X(W);
            try {
                let G = {
                    type: A.transport,
                    url: A.url
                };
                await xG6(A.name, G, _, W.signal), K?.(`Authentication successful for ${A.name}. The server will connect when the agent runs.`)
            } catch (G) {
                if (G instanceof Error && !(G instanceof OG1)) $(G.message)
            } finally {
                w(!1), X(null)
            }
        }, [A, K]),
        M = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1);
    if (z) return a3.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, a3.default.createElement(V, {
        color: "claude"
    }, "Authenticating with ", A.name, "…"), a3.default.createElement(I, null, a3.default.createElement(c4, null), a3.default.createElement(V, null, " A browser window will open for authentication")), O && a3.default.createElement(I, {
        flexDirection: "column"
    }, a3.default.createElement(V, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually:"), a3.default.createElement(d7, {
        url: O
    })), a3.default.createElement(I, {
        marginLeft: 3
    }, a3.default.createElement(V, {
        dimColor: !0
    }, "Return here after authenticating in your browser.", " ", a3.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let P = [];
    if (A.needsAuth) P.push({
        label: A.isAuthenticated ? "Re-authenticate" : "Authenticate",
        value: "auth"
    });
    return P.push({
        label: "Back",
        value: "back"
    }), a3.default.createElement(w8, {
        title: `${M} MCP Server`,
        subtitle: "agent-only",
        onCancel: q,
        inputGuide: (W) => W.pending ? a3.default.createElement(V, null, "Press ", W.keyName, " again to exit") : a3.default.createElement(oA, null, a3.default.createElement(YA, {
            shortcut: "↑↓",
            action: "navigate"
        }), a3.default.createElement(YA, {
            shortcut: "Enter",
            action: "confirm"
        }), a3.default.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }))
    }, a3.default.createElement(I, {
        flexDirection: "column",
        gap: 0
    }, a3.default.createElement(I, null, a3.default.createElement(V, {
        bold: !0
    }, "Type: "), a3.default.createElement(V, {
        dimColor: !0
    }, A.transport)), A.url && a3.default.createElement(I, null, a3.default.createElement(V, {
        bold: !0
    }, "URL: "), a3.default.createElement(V, {
        dimColor: !0
    }, A.url)), A.command && a3.default.createElement(I, null, a3.default.createElement(V, {
        bold: !0
    }, "Command: "), a3.default.createElement(V, {
        dimColor: !0
    }, A.command)), a3.default.createElement(I, null, a3.default.createElement(V, {
        bold: !0
    }, "Used by: "), a3.default.createElement(V, {
        dimColor: !0
    }, A.sourceAgents.join(", "))), a3.default.createElement(I, {
        marginTop: 1
    }, a3.default.createElement(V, {
        bold: !0
    }, "Status: "), a3.default.createElement(V, null, k8("inactive", Y)(l1.radioOff), " not connected (agent-only)")), A.needsAuth && a3.default.createElement(I, null, a3.default.createElement(V, {
        bold: !0
    }, "Auth: "), A.isAuthenticated ? a3.default.createElement(V, null, k8("success", Y)(l1.tick), " authenticated") : a3.default.createElement(V, null, k8("warning", Y)(l1.triangleUpOutline), " may need authentication"))), a3.default.createElement(I, null, a3.default.createElement(V, {
        dimColor: !0
    }, "This server connects only when running the agent.")), H && a3.default.createElement(I, null, a3.default.createElement(V, {
        color: "error"
    }, "Error: ", H)), a3.default.createElement(I, null, a3.default.createElement(kA, {
        options: P,
        onChange: async (W) => {
            switch (W) {
                case "auth":
                    await j();
                    break;
                case "back":
                    q();
                    break
            }
        },
        onCancel: q
    })))
}
// @from(Ln 403027, Col 4)
a3
// @from(Ln 403027, Col 8)
je
// @from(Ln 403028, Col 4)
fxA = v(() => {
    m1();
    K7();
    BK();
    wY();
    b7();
    g51();
    x2();
    Bq();
    wK();
    HK();
    a3 = o(X1(), 1), je = o(X1(), 1)
})
// @from(Ln 403042, Col 0)
function bV6(A) {
    let q = e(66),
        {
            onComplete: K
        } = A,
        Y = v6(KsY),
        z = v6(qsY),
        w = Y.clients,
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = {
        type: "list"
    }, q[0] = H;
    else H = q[0];
    let [$, O] = Oy.default.useState(H), _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[1] = _;
    else _ = q[1];
    let [J, X] = Oy.default.useState(_), D;
    if (q[2] !== z.allAgents) D = bn4(z.allAgents), q[2] = z.allAgents, q[3] = D;
    else D = q[3];
    let j = D,
        M;
    if (q[4] !== w) M = w.filter(AsY).sort(eaY), q[4] = w, q[5] = M;
    else M = q[5];
    let P = M,
        W, G;
    if (q[6] !== P || q[7] !== Y.tools) W = () => {
        (async function() {
            let k = await Promise.all(P.map(async (y) => {
                let B = y.config.scope,
                    S = y.config.type === "sse",
                    m = y.config.type === "http",
                    b = y.config.type === "claudeai-proxy",
                    g = void 0;
                if (S || m) {
                    let p = await new Q51(y.name, y.config).tokens(),
                        l = nV() !== null && y.type === "connected",
                        r = y.type === "connected" && Bm(Y.tools, y.name).length > 0;
                    g = Boolean(p) || l || r
                }
                let U = {
                    name: y.name,
                    client: y,
                    scope: B
                };
                if (b) return {
                    ...U,
                    transport: "claudeai-proxy",
                    isAuthenticated: !1,
                    config: y.config
                };
                else if (S) return {
                    ...U,
                    transport: "sse",
                    isAuthenticated: g,
                    config: y.config
                };
                else if (m) return {
                    ...U,
                    transport: "http",
                    isAuthenticated: g,
                    config: y.config
                };
                else return {
                    ...U,
                    transport: "stdio",
                    config: y.config
                }
            }));
            X(k)
        })()
    }, G = [P, Y.tools], q[6] = P, q[7] = Y.tools, q[8] = W, q[9] = G;
    else W = q[8], G = q[9];
    Oy.default.useEffect(W, G);
    let f, Z;
    if (q[10] !== j.length || q[11] !== P.length || q[12] !== K || q[13] !== J.length) f = () => {
        if (J.length === 0 && P.length > 0) return;
        if (J.length === 0 && j.length === 0) K("No MCP servers configured. Please run /doctor if this is unexpected. Otherwise, run `claude mcp --help` or visit https://code.claude.com/docs/en/mcp to learn more.")
    }, Z = [J.length, P.length, j.length, K], q[10] = j.length, q[11] = P.length, q[12] = K, q[13] = J.length, q[14] = f, q[15] = Z;
    else f = q[14], Z = q[15];
    switch (Oy.useEffect(f, Z), $.type) {
        case "list": {
            let N, T;
            if (q[16] === Symbol.for("react.memo_cache_sentinel")) T = (y) => O({
                type: "server-menu",
                server: y
            }), N = (y) => O({
                type: "agent-server-menu",
                agentServer: y
            }), q[16] = N, q[17] = T;
            else N = q[16], T = q[17];
            let k;
            if (q[18] !== j || q[19] !== K || q[20] !== J || q[21] !== $.defaultTab) k = Oy.default.createElement(MxA, {
                servers: J,
                agentServers: j,
                onSelectServer: T,
                onSelectAgentServer: N,
                onComplete: K,
                defaultTab: $.defaultTab
            }), q[18] = j, q[19] = K, q[20] = J, q[21] = $.defaultTab, q[22] = k;
            else k = q[22];
            return k
        }
        case "server-menu": {
            let N;
            if (q[23] !== Y.tools || q[24] !== $.server.name) N = Bm(Y.tools, $.server.name), q[23] = Y.tools, q[24] = $.server.name, q[25] = N;
            else N = q[25];
            let T = N,
                k = $.server.transport === "claudeai-proxy" ? "claude.ai" : "Claude Code";
            if ($.server.transport === "stdio") {
                let y;
                if (q[26] !== $.server) y = () => O({
                    type: "server-tools",
                    server: $.server
                }), q[26] = $.server, q[27] = y;
                else y = q[27];
                let B;
                if (q[28] !== k) B = () => O({
                    type: "list",
                    defaultTab: k
                }), q[28] = k, q[29] = B;
                else B = q[29];
                let S;
                if (q[30] !== K || q[31] !== T.length || q[32] !== y || q[33] !== B || q[34] !== $.server) S = Oy.default.createElement(kp1, {
                    server: $.server,
                    serverToolsCount: T.length,
                    onViewTools: y,
                    onCancel: B,
                    onComplete: K
                }), q[30] = K, q[31] = T.length, q[32] = y, q[33] = B, q[34] = $.server, q[35] = S;
                else S = q[35];
                return S
            } else {
                let y;
                if (q[36] !== $.server) y = () => O({
                    type: "server-tools",
                    server: $.server
                }), q[36] = $.server, q[37] = y;
                else y = q[37];
                let B;
                if (q[38] !== k) B = () => O({
                    type: "list",
                    defaultTab: k
                }), q[38] = k, q[39] = B;
                else B = q[39];
                let S;
                if (q[40] !== K || q[41] !== T.length || q[42] !== y || q[43] !== B || q[44] !== $.server) S = Oy.default.createElement(y91, {
                    server: $.server,
                    serverToolsCount: T.length,
                    onViewTools: y,
                    onCancel: B,
                    onComplete: K
                }), q[40] = K, q[41] = T.length, q[42] = y, q[43] = B, q[44] = $.server, q[45] = S;
                else S = q[45];
                return S
            }
        }
        case "server-tools": {
            let N, T;
            if (q[46] !== $.server) T = (y, B) => O({
                type: "server-tool-detail",
                server: $.server,
                toolIndex: B
            }), N = () => O({
                type: "server-menu",
                server: $.server
            }), q[46] = $.server, q[47] = N, q[48] = T;
            else N = q[47], T = q[48];
            let k;
            if (q[49] !== N || q[50] !== T || q[51] !== $.server) k = Oy.default.createElement(Lp1, {
                server: $.server,
                onSelectTool: T,
                onBack: N
            }), q[49] = N, q[50] = T, q[51] = $.server, q[52] = k;
            else k = q[52];
            return k
        }
        case "server-tool-detail": {
            let N;
            if (q[53] !== Y.tools || q[54] !== $.server.name) N = Bm(Y.tools, $.server.name), q[53] = Y.tools, q[54] = $.server.name, q[55] = N;
            else N = q[55];
            let k = N[$.toolIndex];
            if (!k) return O({
                type: "server-tools",
                server: $.server
            }), null;
            let y;
            if (q[56] !== $.server) y = () => O({
                type: "server-tools",
                server: $.server
            }), q[56] = $.server, q[57] = y;
            else y = q[57];
            let B;
            if (q[58] !== y || q[59] !== k || q[60] !== $.server) B = Oy.default.createElement(Rp1, {
                tool: k,
                server: $.server,
                onBack: y
            }), q[58] = y, q[59] = k, q[60] = $.server, q[61] = B;
            else B = q[61];
            return B
        }
        case "agent-server-menu": {
            let N;
            if (q[62] === Symbol.for("react.memo_cache_sentinel")) N = () => O({
                type: "list",
                defaultTab: "Agents"
            }), q[62] = N;
            else N = q[62];
            let T;
            if (q[63] !== K || q[64] !== $.agentServer) T = Oy.default.createElement(ZxA, {
                agentServer: $.agentServer,
                onCancel: N,
                onComplete: K
            }), q[63] = K, q[64] = $.agentServer, q[65] = T;
            else T = q[65];
            return T
        }
    }
}
// @from(Ln 403261, Col 0)
function eaY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 403265, Col 0)
function AsY(A) {
    return A.name !== "ide"
}
// @from(Ln 403269, Col 0)
function qsY(A) {
    return A.agentDefinitions
}
// @from(Ln 403273, Col 0)
function KsY(A) {
    return A.mcp
}
// @from(Ln 403276, Col 4)
Oy
// @from(Ln 403277, Col 4)
pqq = v(() => {
    i1();
    g51();
    Oa();
    d8();
    tX();
    PxA();
    SV6();
    hV6();
    IV6();
    xV6();
    fxA();
    Oy = o(X1(), 1)
})
// @from(Ln 403292, Col 0)
function VxA(A) {
    let q = e(25),
        {
            serverName: K,
            onComplete: Y
        } = A,
        [z] = T7(),
        w = v6(YsY),
        H = GZ1(),
        [$, O] = yp1.useState(!0),
        [_, J] = yp1.useState(null),
        X, D;
    if (q[0] !== w || q[1] !== Y || q[2] !== H || q[3] !== K) X = () => {
        (async function() {
            try {
                if (!w.find((G) => G.name === K)) {
                    J(`MCP server "${K}" not found`), O(!1);
                    return
                }
                let W = await H(K);
                A: switch (W.client.type) {
                    case "connected": {
                        Y(`Successfully reconnected to ${K}`);
                        break A
                    }
                    case "needs-auth": {
                        J(`${K} requires authentication`), O(!1), Y(`${K} requires authentication. Use /mcp to authenticate.`);
                        break A
                    }
                    case "pending":
                    case "failed":
                    case "disabled": {
                        J(`Failed to reconnect to ${K}`), O(!1), Y(`Failed to reconnect to ${K}`);
                        break A
                    }
                    case "proxy":
                        Y(`${K} is a proxy server and does not require reconnection`)
                }
            } catch (P) {
                let W = P,
                    G = W instanceof Error ? W.message : String(W);
                J(G), O(!1), Y(`Error: ${G}`)
            }
        })()
    }, D = [K, H, w, Y], q[0] = w, q[1] = Y, q[2] = H, q[3] = K, q[4] = X, q[5] = D;
    else X = q[4], D = q[5];
    if (yp1.useEffect(X, D), $) {
        let j;
        if (q[6] !== K) j = _y.default.createElement(V, {
            color: "text"
        }, "Reconnecting to ", _y.default.createElement(V, {
            bold: !0
        }, K)), q[6] = K, q[7] = j;
        else j = q[7];
        let M;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = _y.default.createElement(I, null, _y.default.createElement(c4, null), _y.default.createElement(V, null, " Establishing connection to MCP server")), q[8] = M;
        else M = q[8];
        let P;
        if (q[9] !== j) P = _y.default.createElement(I, {
            flexDirection: "column",
            gap: 1,
            padding: 1
        }, j, M), q[9] = j, q[10] = P;
        else P = q[10];
        return P
    }
    if (_) {
        let j;
        if (q[11] !== z) j = k8("error", z)(l1.cross), q[11] = z, q[12] = j;
        else j = q[12];
        let M;
        if (q[13] !== j) M = _y.default.createElement(V, null, j, " "), q[13] = j, q[14] = M;
        else M = q[14];
        let P;
        if (q[15] !== K) P = _y.default.createElement(V, {
            color: "error"
        }, "Failed to reconnect to ", K), q[15] = K, q[16] = P;
        else P = q[16];
        let W;
        if (q[17] !== M || q[18] !== P) W = _y.default.createElement(I, null, M, P), q[17] = M, q[18] = P, q[19] = W;
        else W = q[19];
        let G;
        if (q[20] !== _) G = _y.default.createElement(V, {
            dimColor: !0
        }, "Error: ", _), q[20] = _, q[21] = G;
        else G = q[21];
        let f;
        if (q[22] !== W || q[23] !== G) f = _y.default.createElement(I, {
            flexDirection: "column",
            gap: 1,
            padding: 1
        }, W, G), q[22] = W, q[23] = G, q[24] = f;
        else f = q[24];
        return f
    }
    return null
}
// @from(Ln 403390, Col 0)
function YsY(A) {
    return A.mcp.clients
}
// @from(Ln 403393, Col 4)
_y
// @from(Ln 403393, Col 8)
yp1
// @from(Ln 403394, Col 4)
NxA = v(() => {
    i1();
    m1();
    x2();
    De();
    d8();
    m1();
    b7();
    _y = o(X1(), 1), yp1 = o(X1(), 1)
})
// @from(Ln 403404, Col 4)
dqq = v(() => {
    pqq();
    PxA();
    SV6();
    hV6();
    fxA();
    IV6();
    xV6();
    NxA()
})
// @from(Ln 403421, Col 0)
function uV6(A) {
    let q = A.trim(),
        K = b1(),
        Y = q.match(/^([a-zA-Z0-9._-]+@[^:]+:.+?(?:\.git)?)(#(.+))?$/);
    if (Y?.[1]) {
        let z = Y[1],
            w = Y[3];
        return w ? {
            source: "git",
            url: z,
            ref: w
        } : {
            source: "git",
            url: z
        }
    }
    if (q.startsWith("http://") || q.startsWith("https://")) {
        let z = q.match(/^([^#]+)(#(.+))?$/),
            w = z?.[1] || q,
            H = z?.[3];
        if (w.endsWith(".git")) return H ? {
            source: "git",
            url: w,
            ref: H
        } : {
            source: "git",
            url: w
        };
        let $;
        try {
            $ = new URL(w)
        } catch (O) {
            return {
                source: "url",
                url: w
            }
        }
        if ($.hostname === "github.com" || $.hostname === "www.github.com") {
            if ($.pathname.match(/^\/([^/]+\/[^/]+?)(\/|\.git|$)/)?.[1]) {
                let _ = w.endsWith(".git") ? w : `${w}.git`;
                return H ? {
                    source: "git",
                    url: _,
                    ref: H
                } : {
                    source: "git",
                    url: _
                }
            }
        }
        return {
            source: "url",
            url: w
        }
    }
    if (q.startsWith("./") || q.startsWith("../") || q.startsWith("/") || q.startsWith("~")) {
        let z = zsY(q.startsWith("~") ? q.replace(/^~/, wsY()) : q);
        if (!K.existsSync(z)) return {
            error: `Path does not exist: ${z}`
        };
        let w = K.statSync(z);
        if (w.isFile())
            if (z.endsWith(".json")) return {
                source: "file",
                path: z
            };
            else return {
                error: `File path must point to a .json file (marketplace.json), but got: ${z}`
            };
        else if (w.isDirectory()) return {
            source: "directory",
            path: z
        };
        else return {
            error: `Path is neither a file nor a directory: ${z}`
        }
    }
    if (q.includes("/") && !q.startsWith("@")) {
        if (q.includes(":")) return null;
        let z = q.match(/^([^#]+)(#(.+))?$/),
            w = z?.[1] || q,
            H = z?.[3];
        return H ? {
            source: "github",
            repo: w,
            ref: H
        } : {
            source: "github",
            repo: w
        }
    }
    return null
}
// @from(Ln 403514, Col 4)
TxA = v(() => {
    _8()
})
// @from(Ln 403518, Col 0)
function cqq({
    inputValue: A,
    setInputValue: q,
    cursorOffset: K,
    setCursorOffset: Y,
    error: z,
    setError: w,
    result: H,
    setResult: $,
    setViewState: O,
    onAddComplete: _,
    cliMode: J = !1
}) {
    let X = C91.useRef(!1),
        [D, j] = C91.useState(!1),
        [M, P] = C91.useState(""),
        W = async () => {
            let G = A.trim();
            if (!G) {
                w("Please enter a marketplace source");
                return
            }
            let f = uV6(G);
            if (!f) {
                w("Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
                return
            }
            if ("error" in f) {
                w(f.error);
                return
            }
            w(null);
            try {
                j(!0), P("");
                let {
                    name: Z
                } = await wE(f, (T) => {
                    P(T)
                });
                Uw();
                let N = f.source;
                if (f.source === "github") N = f.repo;
                if (c("tengu_marketplace_added", {
                        source_type: N
                    }), _) await _();
                if (P(""), j(!1), J) $(`Successfully added marketplace: ${Z}`);
                else O({
                    type: "browse-marketplace",
                    targetMarketplace: Z
                })
            } catch (Z) {
                let N = Z instanceof Error ? Z : Error(String(Z));
                if (K1(N), w(N.message), P(""), j(!1), J) $(`Error: ${N.message}`);
                else $(null)
            }
        };
    return C91.useEffect(() => {
        if (A && !X.current && !z && !H) X.current = !0, W()
    }, []), CK.createElement(I, {
        flexDirection: "column"
    }, CK.createElement(I, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: "round"
    }, CK.createElement(I, {
        marginBottom: 1
    }, CK.createElement(V, {
        bold: !0
    }, "Add Marketplace")), CK.createElement(I, {
        flexDirection: "column"
    }, CK.createElement(V, null, "Enter marketplace source:"), CK.createElement(V, {
        dimColor: !0
    }, "Examples:"), CK.createElement(V, {
        dimColor: !0
    }, " • owner/repo (GitHub)"), CK.createElement(V, {
        dimColor: !0
    }, " • git@github.com:owner/repo.git (SSH)"), CK.createElement(V, {
        dimColor: !0
    }, " • https://example.com/marketplace.json"), CK.createElement(V, {
        dimColor: !0
    }, " • ./path/to/marketplace"), CK.createElement(I, {
        marginTop: 1
    }, CK.createElement(k3, {
        value: A,
        onChange: q,
        onSubmit: W,
        columns: 80,
        cursorOffset: K,
        onChangeCursorOffset: Y,
        focus: !0,
        showCursor: !0
    }))), D && CK.createElement(I, {
        marginTop: 1
    }, CK.createElement(c4, null), CK.createElement(V, null, M || "Adding marketplace to configuration…")), z && CK.createElement(I, {
        marginTop: 1
    }, CK.createElement(V, {
        color: "error"
    }, z)), H && CK.createElement(I, {
        marginTop: 1
    }, CK.createElement(V, null, H))), CK.createElement(I, {
        marginLeft: 3
    }, CK.createElement(V, {
        dimColor: !0,
        italic: !0
    }, CK.createElement(oA, null, CK.createElement(YA, {
        shortcut: "Enter",
        action: "add"
    }), CK.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })))))
}
// @from(Ln 403632, Col 4)
CK
// @from(Ln 403632, Col 8)
C91
// @from(Ln 403633, Col 4)
lqq = v(() => {
    m1();
    gO();
    HK();
    wK();
    BK();
    p$();
    tR();
    u6();
    TxA();
    x2();
    y6();
    CK = o(X1(), 1), C91 = o(X1(), 1)
})
// @from(Ln 403648, Col 0)
function iqq({
    setViewState: A,
    error: q,
    setError: K,
    setResult: Y,
    exitState: z,
    onManageComplete: w,
    targetMarketplace: H,
    action: $
}) {
    let [O, _] = Af.useState([]), [J, X] = Af.useState(!0), [D, j] = Af.useState(0), [M, P] = Af.useState(!1), [W, G] = Af.useState(null), [f, Z] = Af.useState(null), [N, T] = Af.useState(null), [k, y] = Af.useState("list"), [B, S] = Af.useState(null), [m, b] = Af.useState(0), g = Af.useRef(!1);
    Af.useEffect(() => {
        async function N1() {
            try {
                let j1 = await n5(),
                    {
                        enabled: q1,
                        disabled: t
                    } = await iY(),
                    J1 = [...q1, ...t],
                    {
                        marketplaces: D1,
                        failures: Z1
                    } = await Wp(j1),
                    E1 = [];
                for (let {
                        name: M1,
                        config: z1,
                        data: Y1
                    }
                    of D1) {
                    let _1 = J1.filter(($1) => $1.source.endsWith(`@${M1}`));
                    E1.push({
                        name: M1,
                        source: ib1(z1.source),
                        lastUpdated: z1.lastUpdated,
                        pluginCount: Y1?.plugins.length,
                        installedPlugins: _1,
                        pendingUpdate: !1,
                        pendingRemove: !1,
                        autoUpdate: yv1(M1, z1)
                    })
                }
                E1.sort((M1, z1) => {
                    if (M1.name === "claude-plugin-directory") return -1;
                    if (z1.name === "claude-plugin-directory") return 1;
                    return M1.name.localeCompare(z1.name)
                }), _(E1);
                let a = D1.filter((M1) => M1.data !== null).length,
                    A1 = r01(Z1, a);
                if (A1)
                    if (A1.type === "warning") G(A1.message);
                    else throw Error(A1.message);
                if (H && !g.current && !q) {
                    g.current = !0;
                    let M1 = E1.findIndex((z1) => z1.name === H);
                    if (M1 >= 0) {
                        let z1 = E1[M1];
                        if ($) {
                            j(M1 + 1);
                            let Y1 = [...E1];
                            if ($ === "update") Y1[M1].pendingUpdate = !0;
                            else if ($ === "remove") Y1[M1].pendingRemove = !0;
                            _(Y1), setTimeout(() => {
                                p(Y1)
                            }, 100)
                        } else if (z1) j(M1 + 1), S(z1), y("details")
                    } else if (K) K(`Marketplace not found: ${H}`)
                }
            } catch (j1) {
                if (K) K(j1 instanceof Error ? j1.message : "Failed to load marketplaces");
                G(j1 instanceof Error ? j1.message : "Failed to load marketplaces")
            } finally {
                X(!1)
            }
        }
        N1()
    }, [H, $, q]);
    let U = () => {
            return O.some((N1) => N1.pendingUpdate || N1.pendingRemove)
        },
        x = () => {
            let N1 = O.filter((q1) => q1.pendingUpdate).length,
                j1 = O.filter((q1) => q1.pendingRemove).length;
            return {
                updateCount: N1,
                removeCount: j1
            }
        },
        p = async (N1) => {
            let j1 = N1 || O,
                q1 = k === "details";
            P(!0), G(null), Z(null), T(null);
            try {
                let t = y7("userSettings"),
                    J1 = 0,
                    D1 = 0;
                for (let _1 of j1) {
                    if (_1.pendingRemove) {
                        if (_1.installedPlugins && _1.installedPlugins.length > 0) {
                            let $1 = {
                                ...t?.enabledPlugins
                            };
                            for (let G1 of _1.installedPlugins) {
                                let L1 = EB(G1.name, _1.name);
                                $1[L1] = !1
                            }
                            Z7("userSettings", {
                                enabledPlugins: $1
                            })
                        }
                        await OG6(_1.name), D1++, c("tengu_marketplace_removed", {
                            marketplace_name: _1.name,
                            plugins_uninstalled: _1.installedPlugins?.length || 0
                        });
                        continue
                    }
                    if (_1.pendingUpdate) await St(_1.name, ($1) => {
                        T($1)
                    }), J1++, c("tengu_marketplace_updated", {
                        marketplace_name: _1.name
                    })
                }
                if (Uw(), w) await w();
                let Z1 = await n5(),
                    {
                        enabled: E1,
                        disabled: a
                    } = await iY(),
                    A1 = [...E1, ...a],
                    {
                        marketplaces: M1
                    } = await Wp(Z1),
                    z1 = [];
                for (let {
                        name: _1,
                        config: $1,
                        data: G1
                    }
                    of M1) {
                    let L1 = A1.filter((x1) => x1.source.endsWith(`@${_1}`));
                    z1.push({
                        name: _1,
                        source: ib1($1.source),
                        lastUpdated: $1.lastUpdated,
                        pluginCount: G1?.plugins.length,
                        installedPlugins: L1,
                        pendingUpdate: !1,
                        pendingRemove: !1,
                        autoUpdate: yv1(_1, $1)
                    })
                }
                if (z1.sort((_1, $1) => {
                        if (_1.name === "claude-plugin-directory") return -1;
                        if ($1.name === "claude-plugin-directory") return 1;
                        return _1.name.localeCompare($1.name)
                    }), _(z1), q1 && B) {
                    let _1 = z1.find(($1) => $1.name === B.name);
                    if (_1) S(_1)
                }
                let Y1 = [];
                if (J1 > 0) Y1.push(`Updated ${J1} marketplace${J1>1?"s":""}`);
                if (D1 > 0) Y1.push(`Removed ${D1} marketplace${D1>1?"s":""}`);
                if (Y1.length > 0) {
                    let _1 = `${l1.tick} ${Y1.join(", ")}`;
                    if (q1) Z(_1);
                    else Y(_1), setTimeout(() => {
                        A({
                            type: "menu"
                        })
                    }, 2000)
                } else if (!q1) A({
                    type: "menu"
                })
            } catch (t) {
                let J1 = t instanceof Error ? t.message : String(t);
                if (G(J1), K) K(J1)
            } finally {
                P(!1), T(null)
            }
        }, l = async () => {
            if (!B) return;
            let N1 = O.map((j1) => j1.name === B.name ? {
                ...j1,
                pendingRemove: !0
            } : j1);
            _(N1), await p(N1)
        }, r = (N1) => {
            if (!N1) return [];
            let j1 = [{
                label: `Browse plugins (${N1.pluginCount??0})`,
                value: "browse"
            }, {
                label: "Update marketplace",
                secondaryLabel: N1.lastUpdated ? `(last updated ${new Date(N1.lastUpdated).toLocaleDateString()})` : void 0,
                value: "update"
            }];
            if (!Cp1()) j1.push({
                label: N1.autoUpdate ? "Disable auto-update" : "Enable auto-update",
                value: "toggle-auto-update"
            });
            return j1.push({
                label: "Remove marketplace",
                value: "remove"
            }), j1
        }, s = async (N1) => {
            let j1 = !N1.autoUpdate;
            try {
                await zn4(N1.name, j1), _((q1) => q1.map((t) => t.name === N1.name ? {
                    ...t,
                    autoUpdate: j1
                } : t)), S((q1) => q1 ? {
                    ...q1,
                    autoUpdate: j1
                } : q1)
            } catch (q1) {
                G(q1 instanceof Error ? q1.message : "Failed to update setting")
            }
        };
    if (DA("confirm:no", () => {
            y("list"), b(0)
        }, {
            context: "Confirmation",
            isActive: !M && (k === "details" || k === "confirm-remove")
        }), DA("confirm:no", () => {
            _((N1) => N1.map((j1) => ({
                ...j1,
                pendingUpdate: !1,
                pendingRemove: !1
            }))), j(0)
        }, {
            context: "Confirmation",
            isActive: !M && k === "list" && U()
        }), DA("confirm:no", () => {
            A({
                type: "menu"
            })
        }, {
            context: "Confirmation",
            isActive: !M && k === "list" && !U()
        }), c7({
            "select:previous": () => j((N1) => Math.max(0, N1 - 1)),
            "select:next": () => {
                let N1 = O.length + 1;
                j((j1) => Math.min(N1 - 1, j1 + 1))
            },
            "select:accept": () => {
                let N1 = D - 1;
                if (D === 0) A({
                    type: "add-marketplace"
                });
                else if (U()) p();
                else {
                    let j1 = O[N1];
                    if (j1) S(j1), y("details"), b(0)
                }
            }
        }, {
            context: "Select",
            isActive: !M && k === "list"
        }), D8((N1) => {
            let j1 = D - 1;
            if ((N1 === "u" || N1 === "U") && j1 >= 0) _((q1) => q1.map((t, J1) => J1 === j1 ? {
                ...t,
                pendingUpdate: !t.pendingUpdate,
                pendingRemove: t.pendingUpdate ? t.pendingRemove : !1
            } : t));
            else if ((N1 === "r" || N1 === "R") && j1 >= 0) {
                let q1 = O[j1];
                if (q1) S(q1), y("confirm-remove")
            }
        }, {
            isActive: !M && k === "list"
        }), c7({
            "select:previous": () => b((N1) => Math.max(0, N1 - 1)),
            "select:next": () => {
                let N1 = r(B);
                b((j1) => Math.min(N1.length - 1, j1 + 1))
            },
            "select:accept": () => {
                if (!B) return;
                let j1 = r(B)[m];
                if (j1?.value === "browse") A({
                    type: "browse-marketplace",
                    targetMarketplace: B.name
                });
                else if (j1?.value === "update") {
                    let q1 = O.map((t) => t.name === B.name ? {
                        ...t,
                        pendingUpdate: !0
                    } : t);
                    _(q1), p(q1)
                } else if (j1?.value === "toggle-auto-update") s(B);
                else if (j1?.value === "remove") y("confirm-remove")
            }
        }, {
            context: "Select",
            isActive: !M && k === "details"
        }), D8((N1) => {
            if (N1 === "y" || N1 === "Y") l();
            else if (N1 === "n" || N1 === "N") y("list"), S(null)
        }, {
            isActive: !M && k === "confirm-remove"
        }), J) return g6.createElement(V, null, "Loading marketplaces…");
    if (O.length === 0) return g6.createElement(I, {
        flexDirection: "column"
    }, g6.createElement(I, {
        marginBottom: 1
    }, g6.createElement(V, {
        bold: !0
    }, "Manage marketplaces")), g6.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, g6.createElement(V, {
        color: "suggestion"
    }, l1.pointer, " +"), g6.createElement(V, {
        bold: !0,
        color: "suggestion"
    }, "Add Marketplace")), g6.createElement(I, {
        marginLeft: 3
    }, g6.createElement(V, {
        dimColor: !0,
        italic: !0
    }, z.pending ? g6.createElement(g6.Fragment, null, "Press ", z.keyName, " again to go back") : g6.createElement(oA, null, g6.createElement(NA, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "select"
    }), g6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })))));
    if (k === "confirm-remove" && B) {
        let N1 = B.installedPlugins?.length || 0;
        return g6.createElement(I, {
            flexDirection: "column"
        }, g6.createElement(V, {
            bold: !0,
            color: "warning"
        }, "Remove marketplace ", g6.createElement(V, {
            italic: !0
        }, B.name), "?"), g6.createElement(I, {
            flexDirection: "column"
        }, N1 > 0 && g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, {
            color: "warning"
        }, "This will also uninstall ", N1, " plugin", N1 !== 1 ? "s" : "", " from this marketplace:")), B.installedPlugins && B.installedPlugins.length > 0 && g6.createElement(I, {
            flexDirection: "column",
            marginTop: 1,
            marginLeft: 2
        }, B.installedPlugins.map((j1) => g6.createElement(V, {
            key: j1.name,
            dimColor: !0
        }, "• ", j1.name))), g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, null, "Press ", g6.createElement(V, {
            bold: !0
        }, "y"), " to confirm or ", g6.createElement(V, {
            bold: !0
        }, "n"), " to cancel"))))
    }
    if (k === "details" && B) {
        let N1 = B.pendingUpdate || M,
            j1 = r(B);
        return g6.createElement(I, {
            flexDirection: "column"
        }, g6.createElement(V, {
            bold: !0
        }, B.name), g6.createElement(V, {
            dimColor: !0
        }, B.source), g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, null, B.pluginCount || 0, " available plugin", B.pluginCount !== 1 ? "s" : "")), B.installedPlugins && B.installedPlugins.length > 0 && g6.createElement(I, {
            flexDirection: "column",
            marginTop: 1
        }, g6.createElement(V, {
            bold: !0
        }, "Installed plugins (", B.installedPlugins.length, "):"), g6.createElement(I, {
            flexDirection: "column",
            marginLeft: 1
        }, B.installedPlugins.map((q1) => g6.createElement(I, {
            key: q1.name,
            flexDirection: "row",
            gap: 1
        }, g6.createElement(V, null, l1.bullet), g6.createElement(I, {
            flexDirection: "column"
        }, g6.createElement(V, null, q1.name), g6.createElement(V, {
            dimColor: !0
        }, q1.manifest.description)))))), N1 && g6.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, g6.createElement(V, {
            color: "claude"
        }, "Updating marketplace…"), N && g6.createElement(V, {
            dimColor: !0
        }, N)), !N1 && f && g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, {
            color: "claude"
        }, f)), !N1 && W && g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, {
            color: "error"
        }, W)), !N1 && g6.createElement(I, {
            flexDirection: "column",
            marginTop: 1
        }, j1.map((q1, t) => {
            if (!q1) return null;
            let J1 = t === m;
            return g6.createElement(I, {
                key: q1.value
            }, g6.createElement(V, {
                color: J1 ? "suggestion" : void 0
            }, J1 ? l1.pointer : " ", " ", q1.label), q1.secondaryLabel && g6.createElement(V, {
                dimColor: !0
            }, " ", q1.secondaryLabel))
        })), !N1 && !Cp1() && B.autoUpdate && g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, {
            dimColor: !0
        }, "Auto-update enabled. Claude Code will automatically update this marketplace and its installed plugins.")), g6.createElement(I, {
            marginLeft: 3
        }, g6.createElement(V, {
            dimColor: !0,
            italic: !0
        }, N1 ? g6.createElement(g6.Fragment, null, "Please wait…") : g6.createElement(oA, null, g6.createElement(NA, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), g6.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        })))))
    }
    let {
        updateCount: O1,
        removeCount: T1
    } = x();
    return g6.createElement(I, {
        flexDirection: "column"
    }, g6.createElement(I, {
        marginBottom: 1
    }, g6.createElement(V, {
        bold: !0
    }, "Manage marketplaces")), g6.createElement(I, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1
    }, g6.createElement(V, {
        color: D === 0 ? "suggestion" : void 0
    }, D === 0 ? l1.pointer : " ", " +"), g6.createElement(V, {
        bold: !0,
        color: D === 0 ? "suggestion" : void 0
    }, "Add Marketplace")), g6.createElement(I, {
        flexDirection: "column"
    }, O.map((N1, j1) => {
        let q1 = j1 + 1 === D,
            t = [];
        if (N1.pendingUpdate) t.push("UPDATE");
        if (N1.pendingRemove) t.push("REMOVE");
        return g6.createElement(I, {
            key: N1.name,
            flexDirection: "row",
            gap: 1,
            marginBottom: 1
        }, g6.createElement(V, {
            color: q1 ? "suggestion" : void 0
        }, q1 ? l1.pointer : " ", " ", N1.pendingRemove ? l1.cross : l1.bullet), g6.createElement(I, {
            flexDirection: "column",
            flexGrow: 1
        }, g6.createElement(I, {
            flexDirection: "row",
            gap: 1
        }, g6.createElement(V, {
            bold: !0,
            strikethrough: N1.pendingRemove,
            dimColor: N1.pendingRemove
        }, N1.name === "claude-plugins-official" && g6.createElement(V, {
            color: "claude"
        }, "✻ "), N1.name, N1.name === "claude-plugins-official" && g6.createElement(V, {
            color: "claude"
        }, " ✻")), t.length > 0 && g6.createElement(V, {
            color: "warning"
        }, "[", t.join(", "), "]")), g6.createElement(V, {
            dimColor: !0
        }, N1.source), g6.createElement(V, {
            dimColor: !0
        }, N1.pluginCount !== void 0 && g6.createElement(g6.Fragment, null, N1.pluginCount, " available"), N1.installedPlugins && N1.installedPlugins.length > 0 && g6.createElement(g6.Fragment, null, " • ", N1.installedPlugins.length, " installed"), N1.lastUpdated && g6.createElement(g6.Fragment, null, " ", "• Updated", " ", new Date(N1.lastUpdated).toLocaleDateString()))))
    })), U() && g6.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, g6.createElement(V, null, g6.createElement(V, {
        bold: !0
    }, "Pending changes:"), " ", g6.createElement(V, {
        dimColor: !0
    }, "Enter to apply")), O1 > 0 && g6.createElement(V, null, "• Update ", O1, " marketplace", O1 > 1 ? "s" : ""), T1 > 0 && g6.createElement(V, {
        color: "warning"
    }, "• Remove ", T1, " marketplace", T1 > 1 ? "s" : "")), M && g6.createElement(I, {
        marginTop: 1
    }, g6.createElement(V, {
        color: "claude"
    }, "Processing changes…")), W && g6.createElement(I, {
        marginTop: 1
    }, g6.createElement(V, {
        color: "error"
    }, W)), g6.createElement(HsY, {
        exitState: z,
        hasPendingActions: U()
    }))
}
// @from(Ln 404165, Col 0)
function HsY(A) {
    let q = e(18),
        {
            exitState: K,
            hasPendingActions: Y
        } = A;
    if (K.pending) {
        let X;
        if (q[0] !== K.keyName) X = g6.createElement(I, {
            marginTop: 1
        }, g6.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Press ", K.keyName, " again to go back")), q[0] = K.keyName, q[1] = X;
        else X = q[1];
        return X
    }
    let z;
    if (q[2] !== Y) z = Y && g6.createElement(NA, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "apply changes"
    }), q[2] = Y, q[3] = z;
    else z = q[3];
    let w;
    if (q[4] !== Y) w = !Y && g6.createElement(NA, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "select"
    }), q[4] = Y, q[5] = w;
    else w = q[5];
    let H;
    if (q[6] !== Y) H = !Y && g6.createElement(YA, {
        shortcut: "u",
        action: "update"
    }), q[6] = Y, q[7] = H;
    else H = q[7];
    let $;
    if (q[8] !== Y) $ = !Y && g6.createElement(YA, {
        shortcut: "r",
        action: "remove"
    }), q[8] = Y, q[9] = $;
    else $ = q[9];
    let O = Y ? "cancel" : "go back",
        _;
    if (q[10] !== O) _ = g6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: O
    }), q[10] = O, q[11] = _;
    else _ = q[11];
    let J;
    if (q[12] !== z || q[13] !== w || q[14] !== H || q[15] !== $ || q[16] !== _) J = g6.createElement(I, {
        marginTop: 1
    }, g6.createElement(V, {
        dimColor: !0,
        italic: !0
    }, g6.createElement(oA, null, z, w, H, $, _))), q[12] = z, q[13] = w, q[14] = H, q[15] = $, q[16] = _, q[17] = J;
    else J = q[17];
    return J
}
// @from(Ln 404229, Col 4)
g6
// @from(Ln 404229, Col 8)
Af
// @from(Ln 404230, Col 4)
nqq = v(() => {
    i1();
    m1();
    m1();
    K7();
    b7();
    HK();
    wK();
    BK();
    p$();
    tR();
    u6();
    VJ();
    Xa();
    N0();
    cA();
    p8();
    g6 = o(X1(), 1), Af = o(X1(), 1)
})
// @from(Ln 404250, Col 0)
function Me({
    totalItems: A,
    maxVisible: q = $sY,
    selectedIndex: K = 0
}) {
    let Y = A > q,
        z = GE.useRef(0),
        w = GE.useMemo(() => {
            if (!Y) return 0;
            let f = z.current;
            if (K < f) return z.current = K, K;
            if (K >= f + q) {
                let T = K - q + 1;
                return z.current = T, T
            }
            let Z = Math.max(0, A - q),
                N = Math.min(f, Z);
            return z.current = N, N
        }, [K, q, Y, A]),
        H = w,
        $ = Math.min(w + q, A),
        O = GE.useCallback((f) => {
            if (!Y) return f;
            return f.slice(H, $)
        }, [Y, H, $]),
        _ = GE.useCallback((f) => {
            return H + f
        }, [H]),
        J = GE.useCallback((f) => {
            return f >= H && f < $
        }, [H, $]),
        X = GE.useCallback((f) => {}, []),
        D = GE.useCallback(() => {}, []),
        j = GE.useCallback(() => {}, []),
        M = GE.useCallback((f, Z) => {
            let N = Math.max(0, Math.min(f, A - 1));
            Z(N)
        }, [A]),
        P = GE.useCallback((f, Z) => {
            return !1
        }, []),
        W = Math.max(1, Math.ceil(A / q));
    return {
        currentPage: Math.floor(w / q),
        totalPages: W,
        startIndex: H,
        endIndex: $,
        needsPagination: Y,
        pageSize: q,
        getVisibleItems: O,
        toActualIndex: _,
        isOnCurrentPage: J,
        goToPage: X,
        nextPage: D,
        prevPage: j,
        handleSelectionChange: M,
        handlePageNavigation: P,
        scrollPosition: {
            current: K + 1,
            total: A,
            canScrollUp: w > 0,
            canScrollDown: w + q < A
        }
    }
}
// @from(Ln 404315, Col 4)
GE
// @from(Ln 404315, Col 8)
$sY = 5
// @from(Ln 404316, Col 4)
Sp1 = v(() => {
    GE = o(X1(), 1)
})
// @from(Ln 404320, Col 0)
function Pe(A) {
    if (A.entry.source && typeof A.entry.source === "object" && "source" in A.entry.source && A.entry.source.source === "github" && typeof A.entry.source === "object" && "repo" in A.entry.source) return A.entry.source.repo;
    return null
}
// @from(Ln 404325, Col 0)
function ZZ1(A, q) {
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
// @from(Ln 404350, Col 0)
function rqq(A) {
    let q = e(7),
        {
            hasSelection: K
        } = A,
        Y;
    if (q[0] !== K) Y = K && qf.createElement(NA, {
        action: "plugin:install",
        context: "Plugin",
        fallback: "i",
        description: "install",
        bold: !0
    }), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z, w, H;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = qf.createElement(NA, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), w = qf.createElement(NA, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), H = qf.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), q[2] = z, q[3] = w, q[4] = H;
    else z = q[2], w = q[3], H = q[4];
    let $;
    if (q[5] !== Y) $ = qf.createElement(I, {
        marginTop: 1
    }, qf.createElement(V, {
        dimColor: !0,
        italic: !0
    }, qf.createElement(oA, null, Y, z, w, H))), q[5] = Y, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 404392, Col 4)
qf
// @from(Ln 404393, Col 4)
vxA = v(() => {
    i1();
    m1();
    HK();
    BK();
    qf = o(X1(), 1)
})
// @from(Ln 404407, Col 0)
function aqq() {
    return OsY(Lv(), JsY)
}
// @from(Ln 404411, Col 0)
function DsY() {
    let A = b1(),
        q = aqq();
    try {
        if (!A.existsSync(q)) return h("Install counts cache does not exist"), null;
        let K = A.readFileSync(q, {
                encoding: "utf-8"
            }),
            Y = _A(K);
        if (typeof Y !== "object" || Y === null || !("version" in Y) || !("fetchedAt" in Y) || !("counts" in Y)) return h("Install counts cache has invalid structure"), null;
        let z = Y;
        if (z.version !== ExA) return h(`Install counts cache version mismatch (got ${z.version}, expected ${ExA})`), null;
        if (typeof z.fetchedAt !== "string" || !Array.isArray(z.counts)) return h("Install counts cache has invalid structure"), null;
        let w = new Date(z.fetchedAt).getTime();
        if (Number.isNaN(w)) return h("Install counts cache has invalid fetchedAt timestamp"), null;
        if (!z.counts.every((O) => typeof O === "object" && O !== null && typeof O.plugin === "string" && typeof O.unique_installs === "number")) return h("Install counts cache has malformed entries"), null;
        if (Date.now() - w > XsY) return h("Install counts cache is stale (>24h old)"), null;
        return {
            version: z.version,
            fetchedAt: z.fetchedAt,
            counts: z.counts
        }
    } catch (K) {
        return h(`Failed to load install counts cache: ${K instanceof Error?K.message:String(K)}`), null
    }
}
// @from(Ln 404438, Col 0)
function jsY(A) {
    let q = b1(),
        K = aqq(),
        Y = `${K}.${_sY(8).toString("hex")}.tmp`;
    try {
        let z = Lv();
        q.mkdirSync(z);
        let w = Q1(A, null, 2);
        c8(Y, w, {
            encoding: "utf-8",
            mode: 384,
            flush: !0
        }), q.renameSync(Y, K), h("Install counts cache saved successfully")
    } catch (z) {
        K1(z instanceof Error ? z : Error(String(z)));
        try {
            if (q.existsSync(Y)) q.unlinkSync(Y)
        } catch {}
    }
}
// @from(Ln 404458, Col 0)
async function MsY() {
    h(`Fetching install counts from ${oqq}`);
    let A = await sA.get(oqq, {
        timeout: 1e4
    });
    if (!A.data?.plugins || !Array.isArray(A.data.plugins)) throw Error("Invalid response format from install counts API");
    return A.data.plugins
}
// @from(Ln 404466, Col 0)
async function fZ1() {
    let A = DsY();
    if (A) {
        h("Using cached install counts");
        let q = new Map;
        for (let K of A.counts) q.set(K.plugin, K.unique_installs);
        return q
    }
    try {
        let q = await MsY(),
            K = {
                version: ExA,
                fetchedAt: new Date().toISOString(),
                counts: q
            };
        jsY(K);
        let Y = new Map;
        for (let z of q) Y.set(z.plugin, z.unique_installs);
        return Y
    } catch (q) {
        return K1(q instanceof Error ? q : Error(String(q))), h(`Failed to fetch install counts: ${q instanceof Error?q.message:String(q)}`), null
    }
}
// @from(Ln 404490, Col 0)
function BV6(A) {
    if (A < 1000) return String(A);
    if (A < 1e6) {
        let z = (A / 1000).toFixed(1);
        return z.endsWith(".0") ? `${z.slice(0,-2)}K` : `${z}K`
    }
    let K = (A / 1e6).toFixed(1);
    return K.endsWith(".0") ? `${K.slice(0,-2)}M` : `${K}M`
}
// @from(Ln 404499, Col 4)
ExA = 1
// @from(Ln 404500, Col 4)
JsY = "install-counts-cache.json"
// @from(Ln 404501, Col 4)
oqq = "https://raw.githubusercontent.com/anthropics/claude-plugins-official/refs/heads/stats/stats/plugin-installs.json"
// @from(Ln 404502, Col 4)
XsY = 86400000
// @from(Ln 404503, Col 4)
mV6 = v(() => {
    y5();
    lb1();
    _8();
    m6();
    Z6();
    y6();
    m6()
})
// @from(Ln 404513, Col 0)
function sqq({
    error: A,
    setError: q,
    result: K,
    setResult: Y,
    setViewState: z,
    onInstallComplete: w,
    targetMarketplace: H,
    targetPlugin: $
}) {
    let [O, _] = Y0.useState("marketplace-list"), [J, X] = Y0.useState(null), [D, j] = Y0.useState(null), [M, P] = Y0.useState([]), [W, G] = Y0.useState([]), [f, Z] = Y0.useState(!0), [N, T] = Y0.useState(null), [k, y] = Y0.useState(0), [B, S] = Y0.useState(new Set), [m, b] = Y0.useState(new Set), g = Me({
        totalItems: W.length,
        selectedIndex: k
    }), [U, x] = Y0.useState(0), [p, l] = Y0.useState(!1), [r, s] = Y0.useState(null), [O1, T1] = Y0.useState(null), N1 = AA.useCallback(() => {
        if (O === "plugin-list")
            if (H) z({
                type: "manage-marketplaces",
                targetMarketplace: H
            });
            else if (M.length === 1) z({
            type: "menu"
        });
        else _("marketplace-list"), X(null), S(new Set);
        else if (O === "plugin-details") _("plugin-list"), j(null);
        else z({
            type: "menu"
        })
    }, [O, H, z, M.length]);
    DA("confirm:no", N1, {
        context: "Confirmation"
    }), Y0.useEffect(() => {
        async function D1() {
            try {
                let Z1 = await n5(),
                    {
                        marketplaces: E1,
                        failures: a
                    } = await Wp(Z1),
                    A1 = [];
                for (let {
                        name: Y1,
                        config: _1,
                        data: $1
                    }
                    of E1)
                    if ($1) {
                        let G1 = $1.plugins.filter((L1) => BM(EB(L1.name, Y1))).length;
                        A1.push({
                            name: Y1,
                            totalPlugins: $1.plugins.length,
                            installedCount: G1,
                            source: ib1(_1.source)
                        })
                    } A1.sort((Y1, _1) => {
                    if (Y1.name === "claude-plugin-directory") return -1;
                    if (_1.name === "claude-plugin-directory") return 1;
                    return 0
                }), P(A1);
                let M1 = E1.filter((Y1) => Y1.data !== null).length,
                    z1 = r01(a, M1);
                if (z1)
                    if (z1.type === "warning") T1(z1.message + ". Showing available marketplaces.");
                    else throw Error(z1.message);
                if (A1.length === 1 && !H && !$) {
                    let Y1 = A1[0];
                    if (Y1) X(Y1.name), _("plugin-list")
                }
                if ($) {
                    let Y1 = null,
                        _1 = null;
                    for (let [$1] of Object.entries(Z1)) {
                        let G1 = await NZ($1);
                        if (G1) {
                            let L1 = G1.plugins.find((x1) => x1.name === $);
                            if (L1) {
                                let x1 = EB(L1.name, $1);
                                Y1 = {
                                    entry: L1,
                                    marketplaceName: $1,
                                    pluginId: x1,
                                    isInstalled: BM(x1)
                                }, _1 = $1;
                                break
                            }
                        }
                    }
                    if (Y1 && _1) {
                        let $1 = Y1.pluginId;
                        if (BM($1)) q(`Plugin '${$1}' is already installed. Use '/plugin' to manage existing plugins.`);
                        else X(_1), j(Y1), _("plugin-details")
                    } else q(`Plugin "${$}" not found in any marketplace`)
                } else if (H)
                    if (A1.some((_1) => _1.name === H)) X(H), _("plugin-list");
                    else q(`Marketplace "${H}" not found`)
            } catch (Z1) {
                q(Z1 instanceof Error ? Z1.message : "Failed to load marketplaces")
            } finally {
                Z(!1)
            }
        }
        D1()
    }, [q, H, $]), Y0.useEffect(() => {
        if (!J) return;
        async function D1(Z1) {
            Z(!0);
            try {
                let E1 = await NZ(Z1);
                if (!E1) throw Error(`Failed to load marketplace: ${Z1}`);
                let a = [];
                for (let A1 of E1.plugins) {
                    let M1 = EB(A1.name, Z1);
                    a.push({
                        entry: A1,
                        marketplaceName: Z1,
                        pluginId: M1,
                        isInstalled: BM(M1)
                    })
                }
                try {
                    let A1 = await fZ1();
                    if (T(A1), A1) a.sort((M1, z1) => {
                        let Y1 = A1.get(M1.pluginId) ?? 0,
                            _1 = A1.get(z1.pluginId) ?? 0;
                        if (Y1 !== _1) return _1 - Y1;
                        return M1.entry.name.localeCompare(z1.entry.name)
                    });
                    else a.sort((M1, z1) => M1.entry.name.localeCompare(z1.entry.name))
                } catch (A1) {
                    h(`Failed to fetch install counts: ${A1 instanceof Error?A1.message:String(A1)}`), a.sort((M1, z1) => M1.entry.name.localeCompare(z1.entry.name))
                }
                G(a), y(0), S(new Set)
            } catch (E1) {
                q(E1 instanceof Error ? E1.message : "Failed to load plugins")
            } finally {
                Z(!1)
            }
        }
        D1(J)
    }, [J, q]);
    let j1 = async () => {
        if (B.size === 0) return;
        let D1 = W.filter((A1) => B.has(A1.pluginId));
        b(new Set(D1.map((A1) => A1.pluginId)));
        let Z1 = 0,
            E1 = 0,
            a = [];
        for (let A1 of D1) {
            let M1 = await ug1({
                pluginId: A1.pluginId,
                entry: A1.entry,
                marketplaceName: A1.marketplaceName,
                scope: "user"
            });
            if (M1.success) Z1++;
            else E1++, a.push({
                name: A1.entry.name,
                reason: M1.error
            })
        }
        if (b(new Set), S(new Set), Uw(), E1 === 0) {
            let A1 = `✓ Installed ${Z1} plugin${Z1!==1?"s":""}. Restart Claude Code to load new plugins.`;
            Y(A1)
        } else if (Z1 === 0) q(`Failed to install: ${n01(a,!0)}`);
        else {
            let A1 = `✓ Installed ${Z1} of ${Z1+E1} plugins. Failed: ${n01(a,!1)}. Restart Claude Code to load successfully installed plugins.`;
            Y(A1)
        }
        if (Z1 > 0) {
            if (w) await w()
        }
        z({
            type: "menu"
        })
    }, q1 = async (D1, Z1 = "user") => {
        l(!0), s(null);
        let E1 = await ug1({
            pluginId: D1.pluginId,
            entry: D1.entry,
            marketplaceName: D1.marketplaceName,
            scope: Z1
        });
        if (E1.success) {
            if (Y(E1.message), w) await w();
            z({
                type: "menu"
            })
        } else l(!1), s(E1.error)
    };
    Y0.useEffect(() => {
        if (A) Y(A)
    }, [A, Y]), c7({
        "select:previous": () => {
            if (k > 0) y(k - 1)
        },
        "select:next": () => {
            if (k < M.length - 1) y(k + 1)
        },
        "select:accept": () => {
            let D1 = M[k];
            if (D1) X(D1.name), _("plugin-list")
        }
    }, {
        context: "Select",
        isActive: O === "marketplace-list"
    }), c7({
        "select:previous": () => {
            if (k > 0) g.handleSelectionChange(k - 1, y)
        },
        "select:next": () => {
            if (k < W.length - 1) g.handleSelectionChange(k + 1, y)
        },
        "select:accept": () => {
            if (k === W.length && B.size > 0) j1();
            else if (k < W.length) {
                let D1 = W[k];
                if (D1)
                    if (D1.isInstalled) z({
                        type: "manage-plugins",
                        targetPlugin: D1.entry.name,
                        targetMarketplace: D1.marketplaceName
                    });
                    else j(D1), _("plugin-details"), x(0), s(null)
            }
        }
    }, {
        context: "Select",
        isActive: O === "plugin-list"
    }), c7({
        "plugin:toggle": () => {
            if (k < W.length) {
                let D1 = W[k];
                if (D1 && !D1.isInstalled) {
                    let Z1 = new Set(B);
                    if (Z1.has(D1.pluginId)) Z1.delete(D1.pluginId);
                    else Z1.add(D1.pluginId);
                    S(Z1)
                }
            }
        },
        "plugin:install": () => {
            if (B.size > 0) j1()
        }
    }, {
        context: "Plugin",
        isActive: O === "plugin-list"
    });
    let t = AA.useMemo(() => {
        if (!D) return [];
        let D1 = D.entry.homepage,
            Z1 = Pe(D);
        return ZZ1(D1, Z1)
    }, [D]);
    if (c7({
            "select:previous": () => {
                if (U > 0) x(U - 1)
            },
            "select:next": () => {
                if (U < t.length - 1) x(U + 1)
            },
            "select:accept": () => {
                if (!D) return;
                let D1 = t[U]?.action,
                    Z1 = D.entry.homepage,
                    E1 = Pe(D);
                if (D1 === "install-user") q1(D, "user");
                else if (D1 === "install-project") q1(D, "project");
                else if (D1 === "install-local") q1(D, "local");
                else if (D1 === "homepage" && Z1) zY(Z1);
                else if (D1 === "github" && E1) zY(`https://github.com/${E1}`);
                else if (D1 === "back") _("plugin-list"), j(null)
            }
        }, {
            context: "Select",
            isActive: O === "plugin-details" && !!D
        }), f) return AA.createElement(V, null, "Loading…");
    if (A) return AA.createElement(V, {
        color: "error"
    }, A);
    if (O === "marketplace-list") {
        if (M.length === 0) return AA.createElement(I, {
            flexDirection: "column"
        }, AA.createElement(I, {
            marginBottom: 1
        }, AA.createElement(V, {
            bold: !0
        }, "Select marketplace")), AA.createElement(V, null, "No marketplaces configured."), AA.createElement(V, {
            dimColor: !0
        }, "Add a marketplace first using ", "'Add marketplace'", "."), AA.createElement(I, {
            marginTop: 1,
            paddingLeft: 1
        }, AA.createElement(V, {
            dimColor: !0
        }, AA.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }))));
        return AA.createElement(I, {
            flexDirection: "column"
        }, AA.createElement(I, {
            marginBottom: 1
        }, AA.createElement(V, {
            bold: !0
        }, "Select marketplace")), O1 && AA.createElement(I, {
            marginBottom: 1,
            flexDirection: "column"
        }, AA.createElement(V, {
            color: "warning"
        }, l1.warning, " ", O1)), M.map((D1, Z1) => AA.createElement(I, {
            key: D1.name,
            flexDirection: "column",
            marginBottom: Z1 < M.length - 1 ? 1 : 0
        }, AA.createElement(I, null, AA.createElement(V, {
            color: k === Z1 ? "suggestion" : void 0
        }, k === Z1 ? l1.pointer : " ", " ", D1.name)), AA.createElement(I, {
            marginLeft: 2
        }, AA.createElement(V, {
            dimColor: !0
        }, D1.totalPlugins, " plugin", D1.totalPlugins !== 1 ? "s" : "", " available", D1.installedCount > 0 && ` · ${D1.installedCount} already installed`, D1.source && ` · ${D1.source}`)))), AA.createElement(I, {
            marginTop: 1
        }, AA.createElement(V, {
            dimColor: !0,
            italic: !0
        }, AA.createElement(oA, null, AA.createElement(NA, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), AA.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        })))))
    }
    if (O === "plugin-details" && D) {
        let D1 = D.entry.homepage,
            Z1 = Pe(D),
            E1 = ZZ1(D1, Z1);
        return AA.createElement(I, {
            flexDirection: "column"
        }, AA.createElement(I, {
            marginBottom: 1
        }, AA.createElement(V, {
            bold: !0
        }, "Plugin Details")), AA.createElement(I, {
            flexDirection: "column",
            marginBottom: 1
        }, AA.createElement(V, {
            bold: !0
        }, D.entry.name), D.entry.version && AA.createElement(V, {
            dimColor: !0
        }, "Version: ", D.entry.version), D.entry.description && AA.createElement(I, {
            marginTop: 1
        }, AA.createElement(V, null, D.entry.description)), D.entry.author && AA.createElement(I, {
            marginTop: 1
        }, AA.createElement(V, {
            dimColor: !0
        }, "By:", " ", typeof D.entry.author === "string" ? D.entry.author : D.entry.author.name))), AA.createElement(I, {
            flexDirection: "column",
            marginBottom: 1
        }, AA.createElement(V, {
            bold: !0
        }, "Will install:"), D.entry.commands && AA.createElement(V, {
            dimColor: !0
        }, "• Commands:", " ", Array.isArray(D.entry.commands) ? D.entry.commands.join(", ") : Object.keys(D.entry.commands).join(", ")), D.entry.agents && AA.createElement(V, {
            dimColor: !0
        }, "• Agents:", " ", Array.isArray(D.entry.agents) ? D.entry.agents.join(", ") : Object.keys(D.entry.agents).join(", ")), D.entry.hooks && AA.createElement(V, {
            dimColor: !0
        }, "• Hooks: ", Object.keys(D.entry.hooks).join(", ")), D.entry.mcpServers && AA.createElement(V, {
            dimColor: !0
        }, "• MCP Servers:", " ", Array.isArray(D.entry.mcpServers) ? D.entry.mcpServers.join(", ") : typeof D.entry.mcpServers === "object" ? Object.keys(D.entry.mcpServers).join(", ") : "configured"), !D.entry.commands && !D.entry.agents && !D.entry.hooks && !D.entry.mcpServers && AA.createElement(AA.Fragment, null, typeof D.entry.source === "object" && "source" in D.entry.source && (D.entry.source.source === "github" || D.entry.source.source === "url" || D.entry.source.source === "npm" || D.entry.source.source === "pip") ? AA.createElement(V, {
            dimColor: !0
        }, "• Component summary not available for remote plugin") : AA.createElement(V, {
            dimColor: !0
        }, "• Components will be discovered at installation"))), AA.createElement(I, {
            marginBottom: 1
        }, AA.createElement(V, {
            color: "claude"
        }, l1.warning, " "), AA.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.")), r && AA.createElement(I, {
            marginBottom: 1
        }, AA.createElement(V, {
            color: "error"
        }, "Error: ", r)), AA.createElement(I, {
            flexDirection: "column"
        }, E1.map((a, A1) => AA.createElement(I, {
            key: a.action
        }, U === A1 && AA.createElement(V, null, "> "), U !== A1 && AA.createElement(V, null, "  "), AA.createElement(V, {
            bold: U === A1
        }, p && a.action === "install" ? "Installing…" : a.label)))), AA.createElement(I, {
            marginTop: 1,
            paddingLeft: 1
        }, AA.createElement(V, {
            dimColor: !0
        }, AA.createElement(oA, null, AA.createElement(NA, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), AA.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (W.length === 0) return AA.createElement(I, {
        flexDirection: "column"
    }, AA.createElement(I, {
        marginBottom: 1
    }, AA.createElement(V, {
        bold: !0
    }, "Install plugins")), AA.createElement(V, {
        dimColor: !0
    }, "No new plugins available to install."), AA.createElement(V, {
        dimColor: !0
    }, "All plugins from this marketplace are already installed."), AA.createElement(I, {
        marginLeft: 3
    }, AA.createElement(V, {
        dimColor: !0,
        italic: !0
    }, AA.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let J1 = g.getVisibleItems(W);
    return AA.createElement(I, {
        flexDirection: "column"
    }, AA.createElement(I, {
        marginBottom: 1
    }, AA.createElement(V, {
        bold: !0
    }, "Install Plugins")), g.scrollPosition.canScrollUp && AA.createElement(I, null, AA.createElement(V, {
        dimColor: !0
    }, " ", l1.arrowUp, " more above")), J1.map((D1, Z1) => {
        let E1 = g.toActualIndex(Z1),
            a = k === E1,
            A1 = B.has(D1.pluginId),
            M1 = m.has(D1.pluginId),
            z1 = Z1 === J1.length - 1;
        return AA.createElement(I, {
            key: D1.pluginId,
            flexDirection: "column",
            marginBottom: z1 && !A ? 0 : 1
        }, AA.createElement(I, null, AA.createElement(V, {
            color: a ? "suggestion" : void 0
        }, a ? l1.pointer : " ", " "), AA.createElement(V, {
            color: D1.isInstalled ? "success" : void 0
        }, D1.isInstalled ? l1.tick : M1 ? l1.ellipsis : A1 ? l1.radioOn : l1.radioOff, " ", D1.entry.name, D1.entry.category && AA.createElement(V, {
            dimColor: !0
        }, " [", D1.entry.category, "]"), D1.entry.tags?.includes("community-managed") && AA.createElement(V, {
            dimColor: !0
        }, " [Community Managed]"), D1.isInstalled && AA.createElement(V, {
            dimColor: !0
        }, " (installed)"), N && AA.createElement(V, {
            dimColor: !0
        }, " · ", BV6(N.get(D1.pluginId) ?? 0), " ", "installs"))), D1.entry.description && AA.createElement(I, {
            marginLeft: 4
        }, AA.createElement(V, {
            dimColor: !0
        }, D1.entry.description.length > 60 ? D1.entry.description.substring(0, 57) + "..." : D1.entry.description), D1.entry.version && AA.createElement(V, {
            dimColor: !0
        }, " · v", D1.entry.version)))
    }), g.scrollPosition.canScrollDown && AA.createElement(I, null, AA.createElement(V, {
        dimColor: !0
    }, " ", l1.arrowDown, " more below")), A && AA.createElement(I, {
        marginTop: 1
    }, AA.createElement(V, {
        color: "error"
    }, l1.cross, " ", A)), AA.createElement(rqq, {
        hasSelection: B.size > 0
    }))
}
// @from(Ln 404992, Col 4)
AA
// @from(Ln 404992, Col 8)
Y0
// @from(Ln 404993, Col 4)
tqq = v(() => {
    m1();
    b7();
    HK();
    BK();
    K7();
    p$();
    Xa();
    tR();
    Z6();
    Oj();
    ad();
    mM();
    Sp1();
    vxA();
    mV6();
    AA = o(X1(), 1), Y0 = o(X1(), 1)
})
// @from(Ln 405015, Col 0)
function eqq({
    error: A,
    setError: q,
    result: K,
    setResult: Y,
    setViewState: z,
    onInstallComplete: w,
    onSearchModeChange: H,
    targetPlugin: $
}) {
    let [O, _] = tO.useState("plugin-list"), [J, X] = tO.useState(null), [D, j] = tO.useState([]), [M, P] = tO.useState(!0), [W, G] = tO.useState(null), [f, Z] = tO.useState(!1), N = tO.useCallback((z1) => {
        Z(z1), H?.(z1)
    }, [H]), {
        query: T,
        setQuery: k,
        cursorOffset: y
    } = qF({
        isActive: O === "plugin-list" && f && !M,
        onExit: () => {
            N(!1)
        }
    }), B = k_(), {
        columns: S
    } = Z8(), m = tO.useMemo(() => {
        if (!T) return D;
        let z1 = T.toLowerCase();
        return D.filter((Y1) => Y1.entry.name.toLowerCase().includes(z1) || Y1.entry.description?.toLowerCase().includes(z1) || Y1.marketplaceName.toLowerCase().includes(z1))
    }, [D, T]), [b, g] = tO.useState(0), [U, x] = tO.useState(new Set), [p, l] = tO.useState(new Set), r = Me({
        totalItems: m.length,
        selectedIndex: b
    });
    tO.useEffect(() => {
        g(0)
    }, [T]);
    let [s, O1] = tO.useState(0), [T1, N1] = tO.useState(!1), [j1, q1] = tO.useState(null), [t, J1] = tO.useState(null), [D1, Z1] = tO.useState(null);
    tO.useEffect(() => {
        async function z1() {
            try {
                let Y1 = await n5(),
                    {
                        marketplaces: _1,
                        failures: $1
                    } = await Wp(Y1),
                    G1 = [];
                for (let {
                        name: H1,
                        data: y1
                    }
                    of _1)
                    if (y1)
                        for (let B1 of y1.plugins) {
                            let A6 = EB(B1.name, H1);
                            G1.push({
                                entry: B1,
                                marketplaceName: H1,
                                pluginId: A6,
                                isInstalled: BM(A6)
                            })
                        }
                let L1 = G1.filter((H1) => !H1.isInstalled);
                try {
                    let H1 = await fZ1();
                    if (G(H1), H1) L1.sort((y1, B1) => {
                        let A6 = H1.get(y1.pluginId) ?? 0,
                            O6 = H1.get(B1.pluginId) ?? 0;
                        if (A6 !== O6) return O6 - A6;
                        return y1.entry.name.localeCompare(B1.entry.name)
                    });
                    else L1.sort((y1, B1) => y1.entry.name.localeCompare(B1.entry.name))
                } catch (H1) {
                    h(`Failed to fetch install counts: ${H1 instanceof Error?H1.message:String(H1)}`), L1.sort((y1, B1) => y1.entry.name.localeCompare(B1.entry.name))
                }
                j(L1);
                let x1 = Object.keys(Y1).length;
                if (L1.length === 0) {
                    let H1 = await Yb7({
                        configuredMarketplaceCount: x1,
                        failedMarketplaceCount: $1.length
                    });
                    Z1(H1)
                }
                let f1 = _1.filter((H1) => H1.data !== null).length,
                    R1 = r01($1, f1);
                if (R1)
                    if (R1.type === "warning") J1(R1.message + ". Showing available plugins.");
                    else throw Error(R1.message);
                if ($) {
                    let H1 = G1.find((y1) => y1.entry.name === $);
                    if (H1)
                        if (H1.isInstalled) q(`Plugin '${H1.pluginId}' is already installed. Use '/plugin' to manage existing plugins.`);
                        else X(H1), _("plugin-details");
                    else q(`Plugin "${$}" not found in any marketplace`)
                }
            } catch (Y1) {
                q(Y1 instanceof Error ? Y1.message : "Failed to load plugins")
            } finally {
                P(!1)
            }
        }
        z1()
    }, [q, $]);
    let E1 = async () => {
        if (U.size === 0) return;
        let z1 = D.filter((G1) => U.has(G1.pluginId));
        l(new Set(z1.map((G1) => G1.pluginId)));
        let Y1 = 0,
            _1 = 0,
            $1 = [];
        for (let G1 of z1) try {
            let L1;
            if (typeof G1.entry.source === "string" && G1.entry.source.startsWith("./")) {
                let R1 = await a0(G1.pluginId);
                if (R1) L1 = PsY(R1.marketplaceInstallLocation, G1.entry.source)
            }
            await HE(G1.pluginId, G1.entry, "user", void 0, L1);
            let f1 = {
                ...y7("userSettings")?.enabledPlugins,
                [G1.pluginId]: !0
            };
            Z7("userSettings", {
                enabledPlugins: f1
            }), Y1++, c("tengu_plugin_installed", {
                plugin_id: G1.pluginId,
                marketplace_name: G1.marketplaceName
            })
        } catch (L1) {
            _1++;
            let x1 = L1 instanceof Error ? L1.message : String(L1);
            $1.push({
                name: G1.entry.name,
                reason: x1
            }), K1(L1 instanceof Error ? L1 : Error(`Failed to install ${G1.entry.name}: ${L1}`))
        }
        if (l(new Set), x(new Set), Uw(), _1 === 0) {
            let G1 = `✓ Installed ${Y1} plugin${Y1!==1?"s":""}. Restart Claude Code to load new plugins.`;
            Y(G1)
        } else if (Y1 === 0) q(`Failed to install: ${n01($1,!0)}`);
        else {
            let G1 = `✓ Installed ${Y1} of ${Y1+_1} plugins. Failed: ${n01($1,!1)}. Restart Claude Code to load successfully installed plugins.`;
            Y(G1)
        }
        if (Y1 > 0) {
            if (w) await w()
        }
        z({
            type: "menu"
        })
    }, a = async (z1, Y1 = "user") => {
        N1(!0), q1(null);
        let _1 = await ug1({
            pluginId: z1.pluginId,
            entry: z1.entry,
            marketplaceName: z1.marketplaceName,
            scope: Y1
        });
        if (_1.success) {
            if (Y(_1.message), w) await w();
            z({
                type: "menu"
            })
        } else N1(!1), q1(_1.error)
    };
    tO.useEffect(() => {
        if (A) Y(A)
    }, [A, Y]), DA("confirm:no", () => {
        _("plugin-list"), X(null)
    }, {
        context: "Confirmation",
        isActive: O === "plugin-details"
    }), DA("confirm:no", () => {
        z({
            type: "menu"
        })
    }, {
        context: "Confirmation",
        isActive: O === "plugin-list" && !f
    }), D8((z1, Y1) => {
        let _1 = !Y1.ctrl && !Y1.meta;
        if (!f) {
            if (z1 === "/" && _1) N(!0), k("");
            else if (_1 && z1.length > 0 && !/^\s+$/.test(z1) && z1 !== "j" && z1 !== "k" && z1 !== "i") N(!0), k(z1)
        }
    }, {
        isActive: O === "plugin-list" && !M
    }), c7({
        "select:previous": () => {
            if (b === 0) N(!0);
            else r.handleSelectionChange(b - 1, g)
        },
        "select:next": () => {
            if (b < m.length - 1) r.handleSelectionChange(b + 1, g)
        },
        "select:accept": () => {
            if (b === m.length && U.size > 0) E1();
            else if (b < m.length) {
                let z1 = m[b];
                if (z1)
                    if (z1.isInstalled) z({
                        type: "manage-plugins",
                        targetPlugin: z1.entry.name,
                        targetMarketplace: z1.marketplaceName
                    });
                    else X(z1), _("plugin-details"), O1(0), q1(null)
            }
        }
    }, {
        context: "Select",
        isActive: O === "plugin-list" && !f
    }), c7({
        "plugin:toggle": () => {
            if (b < m.length) {
                let z1 = m[b];
                if (z1 && !z1.isInstalled) {
                    let Y1 = new Set(U);
                    if (Y1.has(z1.pluginId)) Y1.delete(z1.pluginId);
                    else Y1.add(z1.pluginId);
                    x(Y1)
                }
            }
        },
        "plugin:install": () => {
            if (U.size > 0) E1()
        }
    }, {
        context: "Plugin",
        isActive: O === "plugin-list" && !f
    });
    let A1 = e6.useMemo(() => {
        if (!J) return [];
        let z1 = J.entry.homepage,
            Y1 = Pe(J);
        return ZZ1(z1, Y1)
    }, [J]);
    if (c7({
            "select:previous": () => {
                if (s > 0) O1(s - 1)
            },
            "select:next": () => {
                if (s < A1.length - 1) O1(s + 1)
            },
            "select:accept": () => {
                if (!J) return;
                let z1 = A1[s]?.action,
                    Y1 = J.entry.homepage,
                    _1 = Pe(J);
                if (z1 === "install-user") a(J, "user");
                else if (z1 === "install-project") a(J, "project");
                else if (z1 === "install-local") a(J, "local");
                else if (z1 === "homepage" && Y1) zY(Y1);
                else if (z1 === "github" && _1) zY(`https://github.com/${_1}`);
                else if (z1 === "back") _("plugin-list"), X(null)
            }
        }, {
            context: "Select",
            isActive: O === "plugin-details" && !!J
        }), M) return e6.createElement(V, null, "Loading…");
    if (A) return e6.createElement(V, {
        color: "error"
    }, A);
    if (O === "plugin-details" && J) {
        let z1 = J.entry.homepage,
            Y1 = Pe(J),
            _1 = ZZ1(z1, Y1);
        return e6.createElement(I, {
            flexDirection: "column"
        }, e6.createElement(I, {
            marginBottom: 1
        }, e6.createElement(V, {
            bold: !0
        }, "Plugin details")), e6.createElement(I, {
            flexDirection: "column",
            marginBottom: 1
        }, e6.createElement(V, {
            bold: !0
        }, J.entry.name), e6.createElement(V, {
            dimColor: !0
        }, "from ", J.marketplaceName), J.entry.version && e6.createElement(V, {
            dimColor: !0
        }, "Version: ", J.entry.version), J.entry.description && e6.createElement(I, {
            marginTop: 1
        }, e6.createElement(V, null, J.entry.description)), J.entry.author && e6.createElement(I, {
            marginTop: 1
        }, e6.createElement(V, {
            dimColor: !0
        }, "By:", " ", typeof J.entry.author === "string" ? J.entry.author : J.entry.author.name))), e6.createElement(I, {
            marginBottom: 1
        }, e6.createElement(V, {
            color: "claude"
        }, l1.warning, " "), e6.createElement(V, {
            dimColor: !0,
            italic: !0
        }, "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.")), j1 && e6.createElement(I, {
            marginBottom: 1
        }, e6.createElement(V, {
            color: "error"
        }, "Error: ", j1)), e6.createElement(I, {
            flexDirection: "column"
        }, _1.map(($1, G1) => e6.createElement(I, {
            key: $1.action
        }, s === G1 && e6.createElement(V, null, "> "), s !== G1 && e6.createElement(V, null, "  "), e6.createElement(V, {
            bold: s === G1
        }, T1 && $1.action.startsWith("install-") ? "Installing…" : $1.label)))), e6.createElement(I, {
            marginTop: 1
        }, e6.createElement(V, {
            dimColor: !0
        }, e6.createElement(oA, null, e6.createElement(NA, {
            action: "select:accept",
            context: "Select",
            fallback: "Enter",
            description: "select"
        }), e6.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "back"
        })))))
    }
    if (D.length === 0) return e6.createElement(I, {
        flexDirection: "column"
    }, e6.createElement(I, {
        marginBottom: 1
    }, e6.createElement(V, {
        bold: !0
    }, "Discover plugins")), e6.createElement(GsY, {
        reason: D1
    }), e6.createElement(I, {
        marginTop: 1
    }, e6.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Esc to go back")));
    let M1 = r.getVisibleItems(m);
    return e6.createElement(I, {
        flexDirection: "column"
    }, e6.createElement(I, null, e6.createElement(V, {
        bold: !0
    }, "Discover plugins"), r.needsPagination && e6.createElement(V, {
        dimColor: !0
    }, " ", "(", r.scrollPosition.current, "/", r.scrollPosition.total, ")")), e6.createElement(I, {
        marginBottom: 1
    }, e6.createElement(AF, {
        query: T,
        isFocused: f,
        isTerminalFocused: B,
        width: S - 4,
        cursorOffset: y
    })), t && e6.createElement(I, {
        marginBottom: 1
    }, e6.createElement(V, {
        color: "warning"
    }, l1.warning, " ", t)), m.length === 0 && T && e6.createElement(I, {
        marginBottom: 1
    }, e6.createElement(V, {
        dimColor: !0
    }, 'No plugins match "', T, '"')), r.scrollPosition.canScrollUp && e6.createElement(I, null, e6.createElement(V, {
        dimColor: !0
    }, " ", l1.arrowUp, " more above")), M1.map((z1, Y1) => {
        let _1 = r.toActualIndex(Y1),
            $1 = b === _1,
            G1 = U.has(z1.pluginId),
            L1 = p.has(z1.pluginId),
            x1 = Y1 === M1.length - 1;
        return e6.createElement(I, {
            key: `${r.startIndex}-${z1.pluginId}`,
            flexDirection: "column",
            marginBottom: x1 && !A ? 0 : 1
        }, e6.createElement(I, null, e6.createElement(V, {
            color: $1 && !f ? "suggestion" : void 0
        }, $1 && !f ? l1.pointer : " ", " "), e6.createElement(V, null, L1 ? l1.ellipsis : G1 ? l1.radioOn : l1.radioOff, " ", z1.entry.name, e6.createElement(V, {
            dimColor: !0
        }, " · ", z1.marketplaceName), z1.entry.tags?.includes("community-managed") && e6.createElement(V, {
            dimColor: !0
        }, " [Community Managed]"), W && e6.createElement(V, {
            dimColor: !0
        }, " · ", BV6(W.get(z1.pluginId) ?? 0), " ", "installs"))), z1.entry.description && e6.createElement(I, {
            marginLeft: 4
        }, e6.createElement(V, {
            dimColor: !0
        }, z1.entry.description.length > 60 ? z1.entry.description.substring(0, 57) + "..." : z1.entry.description)))
    }), r.scrollPosition.canScrollDown && e6.createElement(I, null, e6.createElement(V, {
        dimColor: !0
    }, " ", l1.arrowDown, " more below")), A && e6.createElement(I, {
        marginTop: 1
    }, e6.createElement(V, {
        color: "error"
    }, l1.cross, " ", A)), e6.createElement(WsY, {
        hasSelection: U.size > 0
    }))
}
// @from(Ln 405405, Col 0)
function WsY(A) {
    let q = e(8),
        {
            hasSelection: K
        } = A,
        Y;
    if (q[0] !== K) Y = K && e6.createElement(NA, {
        action: "plugin:install",
        context: "Plugin",
        fallback: "i",
        description: "install",
        bold: !0
    }), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z, w, H, $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = e6.createElement(V, null, "type to search"), w = e6.createElement(NA, {
        action: "plugin:toggle",
        context: "Plugin",
        fallback: "Space",
        description: "toggle"
    }), H = e6.createElement(NA, {
        action: "select:accept",
        context: "Select",
        fallback: "Enter",
        description: "details"
    }), $ = e6.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }), q[2] = z, q[3] = w, q[4] = H, q[5] = $;
    else z = q[2], w = q[3], H = q[4], $ = q[5];
    let O;
    if (q[6] !== Y) O = e6.createElement(I, {
        marginTop: 1
    }, e6.createElement(V, {
        dimColor: !0,
        italic: !0
    }, e6.createElement(oA, null, Y, z, w, H, $))), q[6] = Y, q[7] = O;
    else O = q[7];
    return O
}