
// @from(Ln 423417, Col 0)
function kXq(A) {
    let q = A6(157),
        {
            tools: K,
            onExit: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        mode: "list-agents",
        source: "all"
    }, q[0] = z;
    else z = q[0];
    let [_, w] = bl8.useState(z), O = M1(a8z), $ = M1(o8z), H = M1(r8z), j = xA(), {
        allAgents: J,
        activeAgents: M
    } = O, D;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) D = [], q[1] = D;
    else D = q[1];
    let [X, P] = bl8.useState(D), W = tR1(K, $, H);
    IK();
    let Z;
    if (q[2] !== J) Z = J.filter(n8z), q[2] = J, q[3] = Z;
    else Z = q[3];
    let G;
    if (q[4] !== J) G = J.filter(i8z), q[4] = J, q[5] = G;
    else G = q[5];
    let f;
    if (q[6] !== J) f = J.filter(l8z), q[6] = J, q[7] = f;
    else f = q[7];
    let v;
    if (q[8] !== J) v = J.filter(c8z), q[8] = J, q[9] = v;
    else v = q[9];
    let N;
    if (q[10] !== J) N = J.filter(d8z), q[10] = J, q[11] = N;
    else N = q[11];
    let V;
    if (q[12] !== J) V = J.filter(U8z), q[12] = J, q[13] = V;
    else V = q[13];
    let L;
    if (q[14] !== J) L = J.filter(Q8z), q[14] = J, q[15] = L;
    else L = q[15];
    let h;
    if (q[16] !== J || q[17] !== Z || q[18] !== G || q[19] !== f || q[20] !== v || q[21] !== N || q[22] !== V || q[23] !== L) h = {
        "built-in": Z,
        userSettings: G,
        projectSettings: f,
        policySettings: v,
        localSettings: N,
        flagSettings: V,
        plugin: L,
        all: J
    }, q[16] = J, q[17] = Z, q[18] = G, q[19] = f, q[20] = v, q[21] = N, q[22] = V, q[23] = L, q[24] = h;
    else h = q[24];
    let R = h,
        u;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) u = (b) => {
        P((p) => [...p, b]), w({
            mode: "list-agents",
            source: "all"
        })
    }, q[25] = u;
    else u = q[25];
    let I = u,
        g;
    if (q[26] !== j) g = async (b) => {
        try {
            await uDq(b), j((p) => {
                let Q = p.agentDefinitions.allAgents.filter((U) => !(U.agentType === b.agentType && U.source === b.source));
                return {
                    ...p,
                    agentDefinitions: {
                        ...p.agentDefinitions,
                        allAgents: Q,
                        activeAgents: dv(Q)
                    }
                }
            }), P((p) => [...p, `Deleted agent: ${O1.bold(b.agentType)}`]), w({
                mode: "list-agents",
                source: "all"
            })
        } catch (p) {
            let Q = p;
            _6(Q instanceof Error ? Q : Error("Failed to delete agent"))
        }
    }, q[26] = j, q[27] = g;
    else g = q[27];
    let B = g;
    switch (_.mode) {
        case "list-agents": {
            let b;
            if (q[28] !== R || q[29] !== _.source) b = _.source === "all" ? [...R["built-in"], ...R.userSettings, ...R.projectSettings, ...R.localSettings, ...R.policySettings, ...R.flagSettings, ...R.plugin] : R[_.source], q[28] = R, q[29] = _.source, q[30] = b;
            else b = q[30];
            let p = b,
                Q;
            if (q[31] !== M || q[32] !== p) Q = pR1(p, M), q[31] = M, q[32] = p, q[33] = Q;
            else Q = q[33];
            let r = Q,
                e;
            if (q[34] !== X || q[35] !== Y) e = () => {
                let X6 = X.length > 0 ? `Agent changes:
${X.join(`
`)}` : void 0;
                Y(X6 ?? "Agents dialog dismissed", {
                    display: X.length === 0 ? "system" : void 0
                })
            }, q[34] = X, q[35] = Y, q[36] = e;
            else e = q[36];
            let Y6;
            if (q[37] !== _) Y6 = (X6) => w({
                mode: "agent-menu",
                agent: X6,
                previousMode: _
            }), q[37] = _, q[38] = Y6;
            else Y6 = q[38];
            let H6;
            if (q[39] === Symbol.for("react.memo_cache_sentinel")) H6 = () => w({
                mode: "create-agent"
            }), q[39] = H6;
            else H6 = q[39];
            let J6;
            if (q[40] !== X || q[41] !== _.source || q[42] !== r || q[43] !== e || q[44] !== Y6) J6 = m4.createElement(BDq, {
                source: _.source,
                agents: r,
                onBack: e,
                onSelect: Y6,
                onCreateNew: H6,
                changes: X
            }), q[40] = X, q[41] = _.source, q[42] = r, q[43] = e, q[44] = Y6, q[45] = J6;
            else J6 = q[45];
            let K6;
            if (q[46] === Symbol.for("react.memo_cache_sentinel")) K6 = m4.createElement(GN6, null), q[46] = K6;
            else K6 = q[46];
            let s;
            if (q[47] !== J6) s = m4.createElement(m4.Fragment, null, J6, K6), q[47] = J6, q[48] = s;
            else s = q[48];
            return s
        }
        case "create-agent": {
            let b;
            if (q[49] === Symbol.for("react.memo_cache_sentinel")) b = () => w({
                mode: "list-agents",
                source: "all"
            }), q[49] = b;
            else b = q[49];
            let p;
            if (q[50] !== M || q[51] !== W) p = m4.createElement(WXq, {
                tools: W,
                existingAgents: M,
                onComplete: I,
                onCancel: b
            }), q[50] = M, q[51] = W, q[52] = p;
            else p = q[52];
            return p
        }
        case "agent-menu": {
            let b;
            if (q[53] !== J || q[54] !== _.agent.agentType || q[55] !== _.agent.source) {
                let l;
                if (q[57] !== _.agent.agentType || q[58] !== _.agent.source) l = (q6) => q6.agentType === _.agent.agentType && q6.source === _.agent.source, q[57] = _.agent.agentType, q[58] = _.agent.source, q[59] = l;
                else l = q[59];
                b = J.find(l), q[53] = J, q[54] = _.agent.agentType, q[55] = _.agent.source, q[56] = b
            } else b = q[56];
            let Q = b || _.agent,
                U = Q.source !== "built-in" && Q.source !== "plugin" && Q.source !== "flagSettings",
                r;
            if (q[60] === Symbol.for("react.memo_cache_sentinel")) r = {
                label: "View agent",
                value: "view"
            }, q[60] = r;
            else r = q[60];
            let e;
            if (q[61] !== U) e = U ? [{
                label: "Edit agent",
                value: "edit"
            }, {
                label: "Delete agent",
                value: "delete"
            }] : [], q[61] = U, q[62] = e;
            else e = q[62];
            let Y6;
            if (q[63] === Symbol.for("react.memo_cache_sentinel")) Y6 = {
                label: "Back",
                value: "back"
            }, q[63] = Y6;
            else Y6 = q[63];
            let H6;
            if (q[64] !== e) H6 = [r, ...e, Y6], q[64] = e, q[65] = H6;
            else H6 = q[65];
            let J6 = H6,
                K6;
            if (q[66] !== Q || q[67] !== _) K6 = (l) => {
                A: switch (l) {
                    case "view": {
                        w({
                            mode: "view-agent",
                            agent: Q,
                            previousMode: _.previousMode
                        });
                        break A
                    }
                    case "edit": {
                        w({
                            mode: "edit-agent",
                            agent: Q,
                            previousMode: _
                        });
                        break A
                    }
                    case "delete": {
                        w({
                            mode: "delete-confirm",
                            agent: Q,
                            previousMode: _
                        });
                        break A
                    }
                    case "back":
                        w(_.previousMode)
                }
            }, q[66] = Q, q[67] = _, q[68] = K6;
            else K6 = q[68];
            let s = K6,
                X6;
            if (q[69] !== _.previousMode) X6 = () => w(_.previousMode), q[69] = _.previousMode, q[70] = X6;
            else X6 = q[70];
            let z6;
            if (q[71] !== _.previousMode) z6 = () => w(_.previousMode), q[71] = _.previousMode, q[72] = z6;
            else z6 = q[72];
            let N6;
            if (q[73] !== s || q[74] !== J6 || q[75] !== z6) N6 = m4.createElement(T8, {
                options: J6,
                onChange: s,
                onCancel: z6
            }), q[73] = s, q[74] = J6, q[75] = z6, q[76] = N6;
            else N6 = q[76];
            let $6;
            if (q[77] !== X) $6 = X.length > 0 && m4.createElement(m, {
                marginTop: 1
            }, m4.createElement(T, {
                dimColor: !0
            }, X[X.length - 1])), q[77] = X, q[78] = $6;
            else $6 = q[78];
            let n;
            if (q[79] !== N6 || q[80] !== $6) n = m4.createElement(m, {
                flexDirection: "column"
            }, N6, $6), q[79] = N6, q[80] = $6, q[81] = n;
            else n = q[81];
            let o;
            if (q[82] !== _.agent.agentType || q[83] !== X6 || q[84] !== n) o = m4.createElement(m8, {
                title: _.agent.agentType,
                onCancel: X6,
                hideInputGuide: !0
            }, n), q[82] = _.agent.agentType, q[83] = X6, q[84] = n, q[85] = o;
            else o = q[85];
            let a;
            if (q[86] === Symbol.for("react.memo_cache_sentinel")) a = m4.createElement(GN6, null), q[86] = a;
            else a = q[86];
            let i;
            if (q[87] !== o) i = m4.createElement(m4.Fragment, null, o, a), q[87] = o, q[88] = i;
            else i = q[88];
            return i
        }
        case "view-agent": {
            let b;
            if (q[89] !== J || q[90] !== _.agent) {
                let K6;
                if (q[92] !== _.agent) K6 = (s) => s.agentType === _.agent.agentType && s.source === _.agent.source, q[92] = _.agent, q[93] = K6;
                else K6 = q[93];
                b = J.find(K6), q[89] = J, q[90] = _.agent, q[91] = b
            } else b = q[91];
            let Q = b || _.agent,
                U;
            if (q[94] !== Q || q[95] !== _.previousMode) U = () => w({
                mode: "agent-menu",
                agent: Q,
                previousMode: _.previousMode
            }), q[94] = Q, q[95] = _.previousMode, q[96] = U;
            else U = q[96];
            let r;
            if (q[97] !== Q || q[98] !== _.previousMode) r = () => w({
                mode: "agent-menu",
                agent: Q,
                previousMode: _.previousMode
            }), q[97] = Q, q[98] = _.previousMode, q[99] = r;
            else r = q[99];
            let e;
            if (q[100] !== Q || q[101] !== J || q[102] !== W || q[103] !== r) e = m4.createElement(TXq, {
                agent: Q,
                tools: W,
                allAgents: J,
                onBack: r
            }), q[100] = Q, q[101] = J, q[102] = W, q[103] = r, q[104] = e;
            else e = q[104];
            let Y6;
            if (q[105] !== Q.agentType || q[106] !== U || q[107] !== e) Y6 = m4.createElement(m8, {
                title: Q.agentType,
                onCancel: U,
                hideInputGuide: !0
            }, e), q[105] = Q.agentType, q[106] = U, q[107] = e, q[108] = Y6;
            else Y6 = q[108];
            let H6;
            if (q[109] === Symbol.for("react.memo_cache_sentinel")) H6 = m4.createElement(GN6, {
                instructions: "Press Enter or Esc to go back"
            }), q[109] = H6;
            else H6 = q[109];
            let J6;
            if (q[110] !== Y6) J6 = m4.createElement(m4.Fragment, null, Y6, H6), q[110] = Y6, q[111] = J6;
            else J6 = q[111];
            return J6
        }
        case "delete-confirm": {
            let b;
            if (q[112] === Symbol.for("react.memo_cache_sentinel")) b = [{
                label: "Yes, delete",
                value: "yes"
            }, {
                label: "No, cancel",
                value: "no"
            }], q[112] = b;
            else b = q[112];
            let p = b,
                Q;
            if (q[113] !== _) Q = () => {
                if ("previousMode" in _) w(_.previousMode)
            }, q[113] = _, q[114] = Q;
            else Q = q[114];
            let U;
            if (q[115] !== _.agent.agentType) U = m4.createElement(T, null, "Are you sure you want to delete the agent", " ", m4.createElement(T, {
                bold: !0
            }, _.agent.agentType), "?"), q[115] = _.agent.agentType, q[116] = U;
            else U = q[116];
            let r;
            if (q[117] !== _.agent.source) r = m4.createElement(m, {
                marginTop: 1
            }, m4.createElement(T, {
                dimColor: !0
            }, "Source: ", _.agent.source)), q[117] = _.agent.source, q[118] = r;
            else r = q[118];
            let e;
            if (q[119] !== B || q[120] !== _) e = (X6) => {
                if (X6 === "yes") B(_.agent);
                else if ("previousMode" in _) w(_.previousMode)
            }, q[119] = B, q[120] = _, q[121] = e;
            else e = q[121];
            let Y6;
            if (q[122] !== _) Y6 = () => {
                if ("previousMode" in _) w(_.previousMode)
            }, q[122] = _, q[123] = Y6;
            else Y6 = q[123];
            let H6;
            if (q[124] !== e || q[125] !== Y6) H6 = m4.createElement(m, {
                marginTop: 1
            }, m4.createElement(T8, {
                options: p,
                onChange: e,
                onCancel: Y6
            })), q[124] = e, q[125] = Y6, q[126] = H6;
            else H6 = q[126];
            let J6;
            if (q[127] !== Q || q[128] !== U || q[129] !== r || q[130] !== H6) J6 = m4.createElement(m8, {
                title: "Delete agent",
                onCancel: Q,
                color: "error"
            }, U, r, H6), q[127] = Q, q[128] = U, q[129] = r, q[130] = H6, q[131] = J6;
            else J6 = q[131];
            let K6;
            if (q[132] === Symbol.for("react.memo_cache_sentinel")) K6 = m4.createElement(GN6, {
                instructions: "Press ↑↓ to navigate, Enter to select, Esc to cancel"
            }), q[132] = K6;
            else K6 = q[132];
            let s;
            if (q[133] !== J6) s = m4.createElement(m4.Fragment, null, J6, K6), q[133] = J6, q[134] = s;
            else s = q[134];
            return s
        }
        case "edit-agent": {
            let b;
            if (q[135] !== J || q[136] !== _.agent) {
                let X6;
                if (q[138] !== _.agent) X6 = (z6) => z6.agentType === _.agent.agentType && z6.source === _.agent.source, q[138] = _.agent, q[139] = X6;
                else X6 = q[139];
                b = J.find(X6), q[135] = J, q[136] = _.agent, q[137] = b
            } else b = q[137];
            let Q = b || _.agent,
                U = `Edit agent: ${Q.agentType}`,
                r;
            if (q[140] !== _.previousMode) r = () => w(_.previousMode), q[140] = _.previousMode, q[141] = r;
            else r = q[141];
            let e, Y6;
            if (q[142] !== _.previousMode) e = (X6) => {
                I(X6), w(_.previousMode)
            }, Y6 = () => w(_.previousMode), q[142] = _.previousMode, q[143] = e, q[144] = Y6;
            else e = q[143], Y6 = q[144];
            let H6;
            if (q[145] !== Q || q[146] !== W || q[147] !== e || q[148] !== Y6) H6 = m4.createElement(GXq, {
                agent: Q,
                tools: W,
                onSaved: e,
                onBack: Y6
            }), q[145] = Q, q[146] = W, q[147] = e, q[148] = Y6, q[149] = H6;
            else H6 = q[149];
            let J6;
            if (q[150] !== U || q[151] !== r || q[152] !== H6) J6 = m4.createElement(m8, {
                title: U,
                onCancel: r,
                hideInputGuide: !0
            }, H6), q[150] = U, q[151] = r, q[152] = H6, q[153] = J6;
            else J6 = q[153];
            let K6;
            if (q[154] === Symbol.for("react.memo_cache_sentinel")) K6 = m4.createElement(GN6, null), q[154] = K6;
            else K6 = q[154];
            let s;
            if (q[155] !== J6) s = m4.createElement(m4.Fragment, null, J6, K6), q[155] = J6, q[156] = s;
            else s = q[156];
            return s
        }
        default:
            return null
    }
}
// @from(Ln 423838, Col 0)
function Q8z(A) {
    return A.source === "plugin"
}
// @from(Ln 423842, Col 0)
function U8z(A) {
    return A.source === "flagSettings"
}
// @from(Ln 423846, Col 0)
function d8z(A) {
    return A.source === "localSettings"
}
// @from(Ln 423850, Col 0)
function c8z(A) {
    return A.source === "policySettings"
}
// @from(Ln 423854, Col 0)
function l8z(A) {
    return A.source === "projectSettings"
}
// @from(Ln 423858, Col 0)
function i8z(A) {
    return A.source === "userSettings"
}
// @from(Ln 423862, Col 0)
function n8z(A) {
    return A.source === "built-in"
}
// @from(Ln 423866, Col 0)
function r8z(A) {
    return A.toolPermissionContext
}
// @from(Ln 423870, Col 0)
function o8z(A) {
    return A.mcp.tools
}
// @from(Ln 423874, Col 0)
function a8z(A) {
    return A.agentDefinitions
}
// @from(Ln 423877, Col 4)
m4
// @from(Ln 423877, Col 8)
bl8
// @from(Ln 423878, Col 4)
EXq = E(() => {
    e6();
    i6();
    aK();
    PO();
    J0();
    cR1();
    PN6();
    v3();
    gDq();
    ZXq();
    fXq();
    vXq();
    k1();
    NXq();
    wq();
    NA();
    Il8();
    m4 = t(P6(), 1), bl8 = t(P6(), 1)
})
// @from(Ln 423898, Col 4)
yXq = {}
// @from(Ln 423902, Col 0)
async function s8z(A, q) {
    let Y = q.getAppState().toolPermissionContext,
        z = FX(Y);
    return xl8.createElement(kXq, {
        tools: z,
        onExit: A
    })
}
// @from(Ln 423910, Col 4)
xl8
// @from(Ln 423911, Col 4)
LXq = E(() => {
    EXq();
    IX();
    xl8 = t(P6(), 1)
})
// @from(Ln 423916, Col 4)
t8z
// @from(Ln 423916, Col 9)
RXq
// @from(Ln 423917, Col 4)
hXq = E(() => {
    t8z = {
        type: "local-jsx",
        name: "agents",
        description: "Manage agent configurations",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (LXq(), yXq)),
        userFacingName() {
            return "agents"
        }
    }, RXq = t8z
})
// @from(Ln 423930, Col 4)
SXq = {}
// @from(Ln 423934, Col 0)
async function e8z(A, q, K) {
    return ul8.createElement(ewq, {
        onComplete: A,
        args: K
    })
}
// @from(Ln 423940, Col 4)
ul8
// @from(Ln 423941, Col 4)
CXq = E(() => {
    Wd8();
    ul8 = t(P6(), 1)
})
// @from(Ln 423945, Col 4)
AAz
// @from(Ln 423945, Col 9)
IXq
// @from(Ln 423946, Col 4)
bXq = E(() => {
    AAz = {
        type: "local-jsx",
        name: "plugin",
        aliases: ["plugins", "marketplace"],
        description: "Manage Claude Code plugins",
        isEnabled: () => !0,
        isHidden: !1,
        immediate: !0,
        load: () => Promise.resolve().then(() => (CXq(), SXq)),
        userFacingName() {
            return "plugin"
        }
    }, IXq = AAz
})
// @from(Ln 423961, Col 0)
async function TN6(A) {
    k("refreshActivePlugins: clearing all plugin caches"), HY(), uXq();
    let [q, K, Y] = await Promise.all([_z(), w96(), UI(AA())]), {
        enabled: z,
        disabled: _,
        errors: w
    } = q, [O, $] = await Promise.all([Promise.all(z.map(async (D) => {
        if (D.mcpServers) return Object.keys(D.mcpServers).length;
        let X = await He(D, w);
        if (X) D.mcpServers = X;
        return X ? Object.keys(X).length : 0
    })), Promise.all(z.map(async (D) => {
        if (D.lspServers) return Object.keys(D.lspServers).length;
        let X = await Nl6(D, w);
        if (X) D.lspServers = X;
        return X ? Object.keys(X).length : 0
    }))]), H = O.reduce((D, X) => D + X, 0), j = $.reduce((D, X) => D + X, 0);
    A((D) => ({
        ...D,
        plugins: {
            ...D.plugins,
            enabled: z,
            disabled: _,
            commands: K,
            errors: qAz(D.plugins.errors, w),
            needsRefresh: !1
        },
        agentDefinitions: Y,
        mcp: {
            ...D.mcp,
            pluginReconnectKey: D.mcp.pluginReconnectKey + 1
        }
    })), dV1();
    let J = !1;
    try {
        await nB()
    } catch (D) {
        J = !0, _6(D), k(`refreshActivePlugins: loadPluginHooks failed: ${_1(D)}`)
    }
    let M = z.reduce((D, X) => {
        if (!X.hooksConfig) return D;
        return D + Object.values(X.hooksConfig).reduce((P, W) => P + (W?.reduce((Z, G) => Z + G.hooks.length, 0) ?? 0), 0)
    }, 0);
    return k(`refreshActivePlugins: ${z.length} enabled, ${K.length} commands, ${Y.allAgents.length} agents, ${M} hooks, ${H} MCP, ${j} LSP`), {
        enabled_count: z.length,
        disabled_count: _.length,
        command_count: K.length,
        agent_count: Y.allAgents.length,
        hook_count: M,
        mcp_count: H,
        lsp_count: j,
        error_count: w.length + (J ? 1 : 0),
        agentDefinitions: Y,
        pluginCommands: K
    }
}
// @from(Ln 424018, Col 0)
function qAz(A, q) {
    let K = A.filter((_) => _.source === "lsp-manager" || _.source.startsWith("plugin:")),
        Y = new Set(q.map(xXq));
    return [...K.filter((_) => !Y.has(xXq(_))), ...q]
}
// @from(Ln 424024, Col 0)
function xXq(A) {
    return A.type === "generic-error" ? `generic-error:${A.source}:${A.error}` : `${A.type}:${A.source}`
}
// @from(Ln 424027, Col 4)
eR1 = E(() => {
    Uv();
    yl6();
    tH();
    cp6();
    O96();
    jQ6();
    gV1();
    Ib();
    J0();
    T1();
    H1();
    k1();
    s8()
})
// @from(Ln 424042, Col 4)
mXq = {}
// @from(Ln 424047, Col 0)
function L_6(A, q) {
    return `${A} ${q}${A===1?"":"s"}`
}
// @from(Ln 424050, Col 4)
KAz = async (A, q) => {
    let K = await TN6(q.setAppState),
        z = `Reloaded: ${[L_6(K.enabled_count,"plugin"),L_6(K.command_count,"command"),L_6(K.agent_count,"agent"),L_6(K.hook_count,"hook"),L_6(K.mcp_count,"plugin MCP server"),L_6(K.lsp_count,"plugin LSP server")].join(" · ")}`;
    if (K.error_count > 0) z += `
${L_6(K.error_count,"error")} during load. Run /doctor for details.`;
    return {
        type: "text",
        value: z
    }
}
// @from(Ln 424060, Col 4)
BXq = E(() => {
    eR1()
})
// @from(Ln 424063, Col 4)
YAz
// @from(Ln 424063, Col 9)
gXq
// @from(Ln 424064, Col 4)
FXq = E(() => {
    YAz = {
        type: "local",
        name: "reload-plugins",
        description: "Activate pending plugin changes in the current session",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (BXq(), mXq)),
        userFacingName() {
            return "reload-plugins"
        }
    }, gXq = YAz
})
// @from(Ln 424078, Col 4)
pXq = {}
// @from(Ln 424082, Col 0)
async function zAz(A, q) {
    if (q.openMessageSelector) q.openMessageSelector();
    return {
        type: "skip"
    }
}
// @from(Ln 424088, Col 4)
_Az
// @from(Ln 424088, Col 9)
QXq
// @from(Ln 424089, Col 4)
UXq = E(() => {
    _Az = {
        description: "Restore the code and/or conversation to a previous point",
        name: "rewind",
        aliases: ["checkpoint"],
        userFacingName: () => "rewind",
        argumentHint: "",
        isEnabled: () => !0,
        type: "local",
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => pXq)
    }, QXq = _Az
})
// @from(Ln 424123, Col 0)
async function PAz(A, q = 0) {
    let K = process.memoryUsage(),
        Y = XAz(),
        z = process.resourceUsage(),
        _ = process.uptime(),
        w;
    try {
        w = DAz()
    } catch {}
    let O = process._getActiveHandles().length,
        $ = process._getActiveRequests().length,
        H;
    try {
        H = (await $Az("/proc/self/fd")).length
    } catch {}
    let j;
    try {
        j = await HAz("/proc/self/smaps_rollup", "utf8")
    } catch {}
    let J = K.rss - K.heapUsed,
        M = _ > 0 ? K.rss / _ : 0,
        D = M * 3600 / 1048576,
        X = [];
    if (Y.number_of_detached_contexts > 0) X.push(`${Y.number_of_detached_contexts} detached context(s) - possible iframe/context leak`);
    if (O > 100) X.push(`${O} active handles - possible timer/socket leak`);
    if (J > K.heapUsed) X.push("Native memory > heap - leak may be in native addons (node-pty, sharp, etc.)");
    if (D > 100) X.push(`High memory growth rate: ${D.toFixed(1)} MB/hour`);
    if (H && H > 500) X.push(`${H} open file descriptors - possible file/socket leak`);
    return {
        timestamp: new Date().toISOString(),
        sessionId: R1(),
        trigger: A,
        dumpNumber: q,
        uptimeSeconds: _,
        memoryUsage: {
            heapUsed: K.heapUsed,
            heapTotal: K.heapTotal,
            external: K.external,
            arrayBuffers: K.arrayBuffers,
            rss: K.rss
        },
        memoryGrowthRate: {
            bytesPerSecond: M,
            mbPerHour: D
        },
        v8HeapStats: {
            heapSizeLimit: Y.heap_size_limit,
            mallocedMemory: Y.malloced_memory,
            peakMallocedMemory: Y.peak_malloced_memory,
            detachedContexts: Y.number_of_detached_contexts,
            nativeContexts: Y.number_of_native_contexts
        },
        v8HeapSpaces: w?.map((P) => ({
            name: P.space_name,
            size: P.space_size,
            used: P.space_used_size,
            available: P.space_available_size
        })),
        resourceUsage: {
            maxRSS: z.maxRSS * 1024,
            userCPUTime: z.userCPUTime,
            systemCPUTime: z.systemCPUTime
        },
        activeHandles: O,
        activeRequests: $,
        openFileDescriptors: H,
        analysis: {
            potentialLeaks: X,
            recommendation: X.length > 0 ? `WARNING: ${X.length} potential leak indicator(s) found. See potentialLeaks array.` : "No obvious leak indicators. Check heap snapshot for retained objects."
        },
        smapsRollup: j,
        platform: process.platform,
        nodeVersion: process.version,
        ccVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION
    }
}
// @from(Ln 424206, Col 0)
async function cXq(A = "manual", q = 0) {
    try {
        let K = R1(),
            Y = await PAz(A, q),
            z = (J) => (J / 1024 / 1024 / 1024).toFixed(3);
        k(`[HeapDump] Memory state:
  heapUsed: ${z(Y.memoryUsage.heapUsed)} GB (in snapshot)
  external: ${z(Y.memoryUsage.external)} GB (NOT in snapshot)
  rss: ${z(Y.memoryUsage.rss)} GB (total process)
  ${Y.analysis.recommendation}`);
        let _ = iXq();
        await $1().mkdir(_);
        let w = q > 0 ? `-dump${q}` : "",
            O = `${K}${w}.heapsnapshot`,
            $ = `${K}${w}-diagnostics.json`,
            H = dXq(_, O),
            j = dXq(_, $);
        return await jAz(j, B6(Y, null, 2), {
            mode: 384
        }), k(`[HeapDump] Diagnostics written to ${j}`), await WAz(H), k(`[HeapDump] Heap dump written to ${H}`), d("tengu_heap_dump", {
            triggerManual: A === "manual",
            triggerAuto15GB: A === "auto-1.5GB",
            dumpNumber: q,
            success: !0
        }), {
            success: !0,
            heapPath: H,
            diagPath: j
        }
    } catch (K) {
        let Y = K instanceof Error ? K : Error(String(K));
        return _6(Y), d("tengu_heap_dump", {
            triggerManual: A === "manual",
            triggerAuto15GB: A === "auto-1.5GB",
            dumpNumber: q,
            success: !1
        }), {
            success: !1,
            error: Y.message
        }
    }
}
// @from(Ln 424248, Col 0)
async function WAz(A) {
    if (typeof Bun < "u") {
        OAz(A, Bun.generateHeapSnapshot("v8", "arraybuffer"), {
            mode: 384
        }), Bun.gc(!0);
        return
    }
    let q = wAz(A, {
            mode: 384
        }),
        K = MAz();
    await JAz(K, q)
}
// @from(Ln 424261, Col 4)
lXq = E(() => {
    SA();
    T1();
    V1();
    H1();
    Z7();
    k1();
    g1()
})
// @from(Ln 424270, Col 4)
nXq = {}
// @from(Ln 424274, Col 0)
async function ZAz() {
    let A = await cXq();
    if (!A.success) return {
        type: "text",
        value: `Failed to create heap dump: ${A.error}`
    };
    return {
        type: "text",
        value: `${A.heapPath}
${A.diagPath}`
    }
}
// @from(Ln 424286, Col 4)
rXq = E(() => {
    lXq()
})
// @from(Ln 424289, Col 4)
GAz
// @from(Ln 424289, Col 9)
oXq
// @from(Ln 424290, Col 4)
aXq = E(() => {
    GAz = {
        type: "local",
        name: "heapdump",
        description: "Dump the JS heap to ~/Desktop",
        isEnabled: () => !0,
        isHidden: !0,
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (rXq(), nXq)),
        userFacingName() {
            return "heapdump"
        }
    }, oXq = GAz
})
// @from(Ln 424304, Col 4)
sXq
// @from(Ln 424305, Col 4)
tXq = E(() => {
    sXq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 424313, Col 0)
function NAz(A) {
    return A.replace(TAz, (q, K, Y) => {
        if (Y.length < vAz) return `"${K}":"[REDACTED]"`;
        let z = `${Y.slice(0,8)}...${Y.slice(-4)}`;
        return `"${K}":"${z}"`
    })
}
// @from(Ln 424321, Col 0)
function ml8(A) {
    let q = A.replace(/\n/g, "\\n");
    if (q.length <= Ah1) return q;
    return q.slice(0, Ah1) + `... (${q.length} chars)`
}
// @from(Ln 424327, Col 0)
function vN6(A) {
    let q = typeof A === "string" ? A : B6(A),
        K = NAz(q);
    if (K.length <= Ah1) return K;
    return K.slice(0, Ah1) + `... (${K.length} chars)`
}
// @from(Ln 424334, Col 0)
function qh1(A) {
    let q = _1(A);
    if (A && typeof A === "object" && "response" in A) {
        let K = A.response;
        if (K?.data && typeof K.data === "object") {
            let Y = K.data,
                z = typeof Y.message === "string" ? Y.message : typeof Y.error === "object" && Y.error && ("message" in Y.error) && typeof Y.error.message === "string" ? Y.error.message : void 0;
            if (z) return `${q}: ${z}`
        }
    }
    return q
}
// @from(Ln 424347, Col 0)
function eXq(A) {
    if (A && typeof A === "object" && "response" in A && A.response && typeof A.response.status === "number") return A.response.status;
    return
}
// @from(Ln 424351, Col 4)
Ah1 = 2000
// @from(Ln 424352, Col 4)
fAz
// @from(Ln 424352, Col 9)
TAz
// @from(Ln 424352, Col 14)
vAz = 16
// @from(Ln 424353, Col 4)
Xr6 = E(() => {
    g1();
    s8();
    fAz = ["session_ingress_token", "environment_secret", "access_token", "secret", "token"], TAz = new RegExp(`"(${fAz.join("|")})"\\s*:\\s*"([^"]*)"`, "g")
})
// @from(Ln 424358, Col 4)
APq = {}
// @from(Ln 424364, Col 4)
Bl8 = 86400000
// @from(Ln 424365, Col 4)
NN6 = "Remote Control is only available with claude.ai subscriptions. Please use `/login` to sign in with your claude.ai account."
// @from(Ln 424366, Col 4)
gl8 = "Error: You must be logged in to use Remote Control.\n\nRemote Control is only available with claude.ai subscriptions. Please use `/login` to sign in with your claude.ai account."
// @from(Ln 424368, Col 0)
function dZ(A, q) {
    if (!A || !VAz.test(A)) throw Error(`Invalid ${q}: contains unsafe characters`);
    return A
}
// @from(Ln 424373, Col 0)
function Kh1(A) {
    function q(O) {
        A.onDebug?.(O)
    }
    let K = 0,
        Y = 100;

    function z(O) {
        return {
            Authorization: `Bearer ${O}`,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
            "anthropic-beta": qPq,
            "x-environment-runner-version": A.runnerVersion
        }
    }

    function _() {
        let O = A.getAccessToken();
        if (!O) throw Error(NN6);
        return O
    }
    async function w(O, $) {
        let H = _(),
            j = await O(H);
        if (j.status !== 401) return j;
        if (!A.onAuth401) return q(`[bridge:api] ${$}: 401 received, no refresh handler`), j;
        if (q(`[bridge:api] ${$}: 401 received, attempting token refresh`), await A.onAuth401(H)) {
            q(`[bridge:api] ${$}: Token refreshed, retrying request`);
            let M = _(),
                D = await O(M);
            if (D.status !== 401) return D;
            q(`[bridge:api] ${$}: Retry after refresh also got 401`)
        } else q(`[bridge:api] ${$}: Token refresh failed`);
        return j
    }
    return {
        async registerBridgeEnvironment(O) {
            q(`[bridge:api] POST /v1/environments/bridge bridgeId=${O.bridgeId}`);
            let $ = await w((H) => X8.post(`${A.baseUrl}/v1/environments/bridge`, {
                machine_name: O.machineName,
                directory: O.dir,
                branch: O.branch,
                git_repo_url: O.gitRepoUrl,
                max_sessions: O.maxSessions,
                metadata: {
                    worker_type: O.workerType
                },
                ...O.reuseEnvironmentId && {
                    environment_id: O.reuseEnvironmentId
                }
            }, {
                headers: z(H),
                timeout: 15000,
                validateStatus: (j) => j < 500
            }), "Registration");
            return Oi($.status, $.data, "Registration"), q(`[bridge:api] POST /v1/environments/bridge -> ${$.status} environment_id=${$.data.environment_id}`), q(`[bridge:api] >>> ${vN6({machine_name:O.machineName,directory:O.dir,branch:O.branch,git_repo_url:O.gitRepoUrl,max_sessions:O.maxSessions,metadata:{worker_type:O.workerType}})}`), q(`[bridge:api] <<< ${vN6($.data)}`), $.data
        },
        async pollForWork(O, $, H, j) {
            dZ(O, "environmentId");
            let J = K;
            K = 0;
            let M = await X8.get(`${A.baseUrl}/v1/environments/${O}/work/poll`, {
                headers: z($),
                params: j !== void 0 ? {
                    reclaim_older_than_ms: j
                } : void 0,
                timeout: 1e4,
                signal: H,
                validateStatus: (D) => D < 500
            });
            if (Oi(M.status, M.data, "Poll"), !M.data) {
                if (K = J + 1, K === 1 || K % Y === 0) q(`[bridge:api] GET .../work/poll -> ${M.status} (no work, ${K} consecutive empty polls)`);
                return null
            }
            return q(`[bridge:api] GET .../work/poll -> ${M.status} workId=${M.data.id} type=${M.data.data?.type}${M.data.data?.id?` sessionId=${M.data.data.id}`:""}`), q(`[bridge:api] <<< ${vN6(M.data)}`), M.data
        },
        async acknowledgeWork(O, $, H) {
            dZ(O, "environmentId"), dZ($, "workId"), q(`[bridge:api] POST .../work/${$}/ack`);
            let j = await X8.post(`${A.baseUrl}/v1/environments/${O}/work/${$}/ack`, {}, {
                headers: z(H),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            });
            Oi(j.status, j.data, "Acknowledge"), q(`[bridge:api] POST .../work/${$}/ack -> ${j.status}`)
        },
        async stopWork(O, $, H) {
            dZ(O, "environmentId"), dZ($, "workId"), q(`[bridge:api] POST .../work/${$}/stop force=${H}`);
            let j = await w((J) => X8.post(`${A.baseUrl}/v1/environments/${O}/work/${$}/stop`, {
                force: H
            }, {
                headers: z(J),
                timeout: 1e4,
                validateStatus: (M) => M < 500
            }), "StopWork");
            Oi(j.status, j.data, "StopWork"), q(`[bridge:api] POST .../work/${$}/stop -> ${j.status}`)
        },
        async deregisterEnvironment(O) {
            dZ(O, "environmentId"), q(`[bridge:api] DELETE /v1/environments/bridge/${O}`);
            let $ = await w((H) => X8.delete(`${A.baseUrl}/v1/environments/bridge/${O}`, {
                headers: z(H),
                timeout: 1e4,
                validateStatus: (j) => j < 500
            }), "Deregister");
            Oi($.status, $.data, "Deregister"), q(`[bridge:api] DELETE /v1/environments/bridge/${O} -> ${$.status}`)
        },
        async archiveSession(O) {
            dZ(O, "sessionId"), q(`[bridge:api] POST /v1/sessions/${O}/archive`);
            let $ = await w((H) => X8.post(`${A.baseUrl}/v1/sessions/${O}/archive`, {}, {
                headers: z(H),
                timeout: 1e4,
                validateStatus: (j) => j < 500
            }), "ArchiveSession");
            if ($.status === 409) {
                q(`[bridge:api] POST /v1/sessions/${O}/archive -> 409 (already archived)`);
                return
            }
            Oi($.status, $.data, "ArchiveSession"), q(`[bridge:api] POST /v1/sessions/${O}/archive -> ${$.status}`)
        },
        async reconnectSession(O, $) {
            dZ(O, "environmentId"), dZ($, "sessionId"), q(`[bridge:api] POST /v1/environments/${O}/bridge/reconnect session_id=${$}`);
            let H = await w((j) => X8.post(`${A.baseUrl}/v1/environments/${O}/bridge/reconnect`, {
                session_id: $
            }, {
                headers: z(j),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            }), "ReconnectSession");
            Oi(H.status, H.data, "ReconnectSession"), q(`[bridge:api] POST .../bridge/reconnect -> ${H.status}`)
        },
        async heartbeatWork(O, $, H) {
            dZ(O, "environmentId"), dZ($, "workId"), q(`[bridge:api] POST .../work/${$}/heartbeat`);
            let j = await X8.post(`${A.baseUrl}/v1/environments/${O}/work/${$}/heartbeat`, {}, {
                headers: z(H),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            });
            return Oi(j.status, j.data, "Heartbeat"), q(`[bridge:api] POST .../work/${$}/heartbeat -> ${j.status} lease_extended=${j.data.lease_extended} state=${j.data.state}`), j.data
        },
        async sendPermissionResponseEvent(O, $, H) {
            dZ(O, "sessionId"), q(`[bridge:api] POST /v1/sessions/${O}/events type=${$.type}`);
            let j = await X8.post(`${A.baseUrl}/v1/sessions/${O}/events`, {
                events: [$]
            }, {
                headers: {
                    Authorization: `Bearer ${H}`,
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01",
                    "anthropic-beta": qPq
                },
                timeout: 1e4,
                validateStatus: (J) => J < 500
            });
            Oi(j.status, j.data, "SendPermissionResponseEvent"), q(`[bridge:api] POST /v1/sessions/${O}/events -> ${j.status}`), q(`[bridge:api] >>> ${vN6({events:[$]})}`), q(`[bridge:api] <<< ${vN6(j.data)}`)
        }
    }
}
// @from(Ln 424531, Col 0)
function Oi(A, q, K) {
    if (A === 200 || A === 204) return;
    let Y = EAz(q),
        z = kAz(q);
    switch (A) {
        case 401:
            throw new cZ(`${K}: Authentication failed (401)${Y?`: ${Y}`:""}. ${NN6}`, 401, z);
        case 403:
            throw new cZ(VN6(z) ? "Remote Control session has expired. Please restart with `claude remote-control` or /remote-control." : `${K}: Access denied (403)${Y?`: ${Y}`:""}. Check your organization permissions.`, 403, z);
        case 404:
            throw new cZ(Y ?? `${K}: Not found (404). Remote Control may not be available for this organization.`, 404, z);
        case 410:
            throw new cZ(Y ?? "Remote Control session has expired. Please restart with `claude remote-control` or /remote-control.", 410, z ?? "environment_expired");
        case 429:
            throw Error(`${K}: Rate limited (429). Polling too frequently.`);
        default:
            throw Error(`${K}: Failed with status ${A}${Y?`: ${Y}`:""}`)
    }
}
// @from(Ln 424551, Col 0)
function VN6(A) {
    if (!A) return !1;
    return A.includes("expired") || A.includes("lifetime")
}
// @from(Ln 424556, Col 0)
function Pr6(A) {
    if (A.status !== 403) return !1;
    return A.message.includes("external_poll_sessions") || A.message.includes("environments:manage")
}
// @from(Ln 424561, Col 0)
function kAz(A) {
    if (A && typeof A === "object") {
        if ("error" in A && A.error && typeof A.error === "object" && "type" in A.error && typeof A.error.type === "string") return A.error.type
    }
    return
}
// @from(Ln 424568, Col 0)
function EAz(A) {
    if (A && typeof A === "object") {
        if ("message" in A && typeof A.message === "string") return A.message;
        if ("error" in A && A.error && typeof A.error === "object" && "message" in A.error && typeof A.error.message === "string") return A.error.message
    }
    return
}
// @from(Ln 424575, Col 4)
qPq = "environments-2025-11-01"
// @from(Ln 424576, Col 4)
VAz
// @from(Ln 424576, Col 9)
cZ
// @from(Ln 424577, Col 4)
Wr6 = E(() => {
    kK();
    Xr6();
    VAz = /^[a-zA-Z0-9_-]+$/;
    cZ = class cZ extends Error {
        status;
        errorType;
        constructor(A, q, K) {
            super(A);
            this.name = "BridgeFatalError", this.status = q, this.errorType = K
        }
    }
})
// @from(Ln 424591, Col 0)
function KPq() {
    return yAz
}
// @from(Ln 424594, Col 4)
yAz = null
// @from(Ln 424595, Col 4)
Fl8 = E(() => {
    Wr6();
    H1()
})
// @from(Ln 424599, Col 4)
pl8 = `/bridge-kick <subcommand>
  close <code>              fire ws_closed with the given code (e.g. 1002)
  poll <status> [type]      next poll throws BridgeFatalError(status, type)
  poll transient            next poll throws axios-style rejection (5xx/net)
  register fail [N]         next N registers transient-fail (default 1)
  register fatal            next register 403s (terminal)
  reconnect-session fail    next POST /bridge/reconnect fails
  heartbeat <status>        next heartbeat throws BridgeFatalError(status)
  reconnect                 call reconnectEnvironmentWithSession directly
  status                    print bridge state`
// @from(Ln 424609, Col 4)
LAz = async (A) => {
        let q = KPq();
        if (!q) return {
            type: "text",
            value: "No bridge debug handle registered. Remote Control must be connected (USER_TYPE=ant)."
        };
        let [K, Y, z] = A.trim().split(/\s+/);
        switch (K) {
            case "close": {
                let _ = Number(Y);
                if (!Number.isFinite(_)) return {
                    type: "text",
                    value: `close: need a numeric code
${pl8}`
                };
                return q.fireClose(_), {
                    type: "text",
                    value: `Fired transport close(${_}). Watch debug.log for [bridge:repl] recovery.`
                }
            }
            case "poll": {
                if (Y === "transient") return q.injectFault({
                    method: "pollForWork",
                    kind: "transient",
                    status: 503,
                    count: 1
                }), q.wakePollLoop(), {
                    type: "text",
                    value: "Next poll will throw a transient (axios rejection). Poll loop woken."
                };
                let _ = Number(Y);
                if (!Number.isFinite(_)) return {
                    type: "text",
                    value: `poll: need 'transient' or a status code
${pl8}`
                };
                let w = z ?? (_ === 404 ? "not_found_error" : "authentication_error");
                return q.injectFault({
                    method: "pollForWork",
                    kind: "fatal",
                    status: _,
                    errorType: w,
                    count: 1
                }), q.wakePollLoop(), {
                    type: "text",
                    value: `Next poll will throw BridgeFatalError(${_}, ${w}). Poll loop woken.`
                }
            }
            case "register": {
                if (Y === "fatal") return q.injectFault({
                    method: "registerBridgeEnvironment",
                    kind: "fatal",
                    status: 403,
                    errorType: "permission_error",
                    count: 1
                }), {
                    type: "text",
                    value: "Next registerBridgeEnvironment will 403. Trigger with close/reconnect."
                };
                let _ = Number(z) || 1;
                return q.injectFault({
                    method: "registerBridgeEnvironment",
                    kind: "transient",
                    status: 503,
                    count: _
                }), {
                    type: "text",
                    value: `Next ${_} registerBridgeEnvironment call(s) will transient-fail. Trigger with close/reconnect.`
                }
            }
            case "reconnect-session":
                return q.injectFault({
                    method: "reconnectSession",
                    kind: "fatal",
                    status: 404,
                    errorType: "not_found_error",
                    count: 1
                }), {
                    type: "text",
                    value: "Next POST /bridge/reconnect will 404. doReconnect Strategy 1 falls through to Strategy 2."
                };
            case "heartbeat": {
                let _ = Number(Y) || 401;
                return q.injectFault({
                    method: "heartbeatWork",
                    kind: "fatal",
                    status: _,
                    errorType: _ === 401 ? "authentication_error" : "not_found_error",
                    count: 1
                }), {
                    type: "text",
                    value: `Next heartbeat will ${_}. Watch for onHeartbeatFatal → work-state teardown.`
                }
            }
            case "reconnect":
                return q.forceReconnect(), {
                    type: "text",
                    value: "Called reconnectEnvironmentWithSession(). Watch debug.log."
                };
            case "status":
                return {
                    type: "text", value: q.describe()
                };
            default:
                return {
                    type: "text", value: pl8
                }
        }
    }
// @from(Ln 424717, Col 7)
RAz
// @from(Ln 424717, Col 12)
YPq
// @from(Ln 424718, Col 4)
zPq = E(() => {
    Fl8();
    RAz = {
        type: "local",
        name: "bridge-kick",
        description: "Inject bridge failure states for manual recovery testing",
        isEnabled: () => !1,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve({
            call: LAz
        }),
        userFacingName() {
            return "bridge-kick"
        }
    }, YPq = RAz
})
// @from(Ln 424735, Col 4)
_Pq
// @from(Ln 424736, Col 4)
wPq = E(() => {
    _Pq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 424743, Col 4)
OPq
// @from(Ln 424743, Col 9)
$Pq
// @from(Ln 424743, Col 14)
HPq
// @from(Ln 424744, Col 4)
jPq = E(() => {
    OPq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }, $Pq = OPq, HPq = OPq
})
// @from(Ln 424751, Col 4)
JPq
// @from(Ln 424752, Col 4)
MPq = E(() => {
    JPq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 424759, Col 4)
DPq
// @from(Ln 424760, Col 4)
XPq = E(() => {
    DPq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 424768, Col 0)
function PPq() {
    let A = A6(3),
        q = vA.isSandboxingEnabled(),
        K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        let _ = vA.checkDependencies();
        K = _.warnings.length > 0 ? vK.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, _.warnings.map(hAz)) : null, A[0] = K
    } else K = A[0];
    let Y = K;
    if (!q) {
        let _;
        if (A[1] === Symbol.for("react.memo_cache_sentinel")) _ = vK.createElement(m, {
            flexDirection: "column",
            paddingY: 1
        }, vK.createElement(T, {
            color: "subtle"
        }, "Sandbox is not enabled"), Y), A[1] = _;
        else _ = A[1];
        return _
    }
    let z;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) {
        let _ = vA.getFsReadConfig(),
            w = vA.getFsWriteConfig(),
            O = vA.getNetworkRestrictionConfig(),
            $ = vA.getAllowUnixSockets(),
            H = vA.getExcludedCommands(),
            j = vA.getLinuxGlobPatternWarnings();
        z = vK.createElement(m, {
            flexDirection: "column",
            paddingY: 1
        }, vK.createElement(m, {
            flexDirection: "column"
        }, vK.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Excluded Commands:"), vK.createElement(T, {
            dimColor: !0
        }, H.length > 0 ? H.join(", ") : "None")), _.denyOnly.length > 0 && vK.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, vK.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Filesystem Read Restrictions:"), vK.createElement(T, {
            dimColor: !0
        }, "Denied: ", _.denyOnly.join(", "))), w.allowOnly.length > 0 && vK.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, vK.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Filesystem Write Restrictions:"), vK.createElement(T, {
            dimColor: !0
        }, "Allowed: ", w.allowOnly.join(", ")), w.denyWithinAllow.length > 0 && vK.createElement(T, {
            dimColor: !0
        }, "Denied within allowed: ", w.denyWithinAllow.join(", "))), (O.allowedHosts && O.allowedHosts.length > 0 || O.deniedHosts && O.deniedHosts.length > 0) && vK.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, vK.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Network Restrictions", Uq6() ? " (Managed)" : "", ":"), O.allowedHosts && O.allowedHosts.length > 0 && vK.createElement(T, {
            dimColor: !0
        }, "Allowed: ", O.allowedHosts.join(", ")), O.deniedHosts && O.deniedHosts.length > 0 && vK.createElement(T, {
            dimColor: !0
        }, "Denied: ", O.deniedHosts.join(", "))), $ && $.length > 0 && vK.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, vK.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Allowed Unix Sockets:"), vK.createElement(T, {
            dimColor: !0
        }, $.join(", "))), j.length > 0 && vK.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, vK.createElement(T, {
            bold: !0,
            color: "warning"
        }, "⚠ Warning: Glob patterns not fully supported on Linux"), vK.createElement(T, {
            dimColor: !0
        }, "The following patterns will be ignored:", " ", j.slice(0, 3).join(", "), j.length > 3 && ` (${j.length-3} more)`)), Y), A[2] = z
    } else z = A[2];
    return z
}
// @from(Ln 424858, Col 0)
function hAz(A, q) {
    return vK.createElement(T, {
        key: q,
        dimColor: !0
    }, A)
}
// @from(Ln 424864, Col 4)
vK
// @from(Ln 424865, Col 4)
WPq = E(() => {
    e6();
    i6();
    Lz();
    vK = t(P6(), 1)
})
// @from(Ln 424872, Col 0)
function ZPq(A) {
    let q = A6(26),
        {
            onComplete: K
        } = A,
        [Y] = z7(),
        z = vA.isSandboxingEnabled(),
        _ = vA.areUnsandboxedCommandsAllowed(),
        w = vA.areSandboxSettingsLockedByPolicy(),
        O = _ ? "open" : "closed",
        $;
    if (q[0] !== Y) $ = kA("success", Y)("(current)"), q[0] = Y, q[1] = $;
    else $ = q[1];
    let H = $,
        j = O === "open" ? `Allow unsandboxed fallback ${H}` : "Allow unsandboxed fallback",
        J;
    if (q[2] !== j) J = {
        label: j,
        value: "open"
    }, q[2] = j, q[3] = J;
    else J = q[3];
    let M = O === "closed" ? `Strict sandbox mode ${H}` : "Strict sandbox mode",
        D;
    if (q[4] !== M) D = {
        label: M,
        value: "closed"
    }, q[4] = M, q[5] = D;
    else D = q[5];
    let X;
    if (q[6] !== J || q[7] !== D) X = [J, D], q[6] = J, q[7] = D, q[8] = X;
    else X = q[8];
    let P = X,
        W;
    if (q[9] !== K) W = async function(u) {
        let I = u;
        await vA.setSandboxSettings({
            allowUnsandboxedCommands: I === "open"
        }), K(I === "open" ? "✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary" : "✓ Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option")
    }, q[9] = K, q[10] = W;
    else W = q[10];
    let Z = W;
    if (!z) {
        let R;
        if (q[11] === Symbol.for("react.memo_cache_sentinel")) R = nX.default.createElement(m, {
            flexDirection: "column",
            paddingY: 1
        }, nX.default.createElement(T, {
            color: "subtle"
        }, "Sandbox is not enabled. Enable sandbox to configure override settings.")), q[11] = R;
        else R = q[11];
        return R
    }
    if (w) {
        let R;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) R = nX.default.createElement(T, {
            color: "subtle"
        }, "Override settings are managed by a higher-priority configuration and cannot be changed locally."), q[12] = R;
        else R = q[12];
        let u;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) u = nX.default.createElement(m, {
            flexDirection: "column",
            paddingY: 1
        }, R, nX.default.createElement(m, {
            marginTop: 1
        }, nX.default.createElement(T, {
            dimColor: !0
        }, "Current setting:", " ", O === "closed" ? "Strict sandbox mode" : "Allow unsandboxed fallback"))), q[13] = u;
        else u = q[13];
        return u
    }
    let G;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) G = nX.default.createElement(m, {
        marginBottom: 1
    }, nX.default.createElement(T, {
        bold: !0
    }, "Configure Overrides:")), q[14] = G;
    else G = q[14];
    let f;
    if (q[15] !== K) f = () => K(void 0, {
        display: "skip"
    }), q[15] = K, q[16] = f;
    else f = q[16];
    let v;
    if (q[17] !== Z || q[18] !== P || q[19] !== f) v = nX.default.createElement(T8, {
        options: P,
        onChange: Z,
        onCancel: f
    }), q[17] = Z, q[18] = P, q[19] = f, q[20] = v;
    else v = q[20];
    let N;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) N = nX.default.createElement(T, {
        dimColor: !0
    }, nX.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Allow unsandboxed fallback:"), " ", "When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions)."), q[21] = N;
    else N = q[21];
    let V;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) V = nX.default.createElement(T, {
        dimColor: !0
    }, nX.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Strict sandbox mode:"), " ", "All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands."), q[22] = V;
    else V = q[22];
    let L;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) L = nX.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, N, V, nX.default.createElement(T, {
        dimColor: !0
    }, "Learn more:", " ", nX.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing"
    }, "code.claude.com/docs/en/sandboxing#configure-sandboxing"))), q[23] = L;
    else L = q[23];
    let h;
    if (q[24] !== v) h = nX.default.createElement(m, {
        flexDirection: "column",
        paddingY: 1
    }, G, v, L), q[24] = v, q[25] = h;
    else h = q[25];
    return h
}
// @from(Ln 424996, Col 4)
nX
// @from(Ln 424997, Col 4)
GPq = E(() => {
    e6();
    i6();
    v3();
    Lz();
    i6();
    nX = t(P6(), 1)
})
// @from(Ln 425006, Col 0)
function Ql8(A) {
    let q = A6(31),
        {
            depCheck: K
        } = A,
        Y;
    if (q[0] !== K.errors) Y = K.errors.some(CAz), q[0] = K.errors, q[1] = Y;
    else Y = q[1];
    let z = Y,
        _;
    if (q[2] !== K.errors) _ = K.errors.some(SAz), q[2] = K.errors, q[3] = _;
    else _ = q[3];
    let w = _,
        O = K.warnings.length > 0,
        $, H;
    if (q[4] !== z) $ = $J.default.createElement(T, null, "bubblewrap (bwrap):", " ", z ? $J.default.createElement(T, {
        color: "error"
    }, "not installed") : $J.default.createElement(T, {
        color: "success"
    }, "installed")), H = z && $J.default.createElement(T, {
        dimColor: !0
    }, "  ", "· apt install bubblewrap"), q[4] = z, q[5] = $, q[6] = H;
    else $ = q[5], H = q[6];
    let j;
    if (q[7] !== $ || q[8] !== H) j = $J.default.createElement(m, {
        flexDirection: "column"
    }, $, H), q[7] = $, q[8] = H, q[9] = j;
    else j = q[9];
    let J, M;
    if (q[10] !== w) J = $J.default.createElement(T, null, "socat:", " ", w ? $J.default.createElement(T, {
        color: "error"
    }, "not installed") : $J.default.createElement(T, {
        color: "success"
    }, "installed")), M = w && $J.default.createElement(T, {
        dimColor: !0
    }, "  ", "· apt install socat"), q[10] = w, q[11] = J, q[12] = M;
    else J = q[11], M = q[12];
    let D;
    if (q[13] !== J || q[14] !== M) D = $J.default.createElement(m, {
        flexDirection: "column"
    }, J, M), q[13] = J, q[14] = M, q[15] = D;
    else D = q[15];
    let X, P;
    if (q[16] !== O) P = O ? $J.default.createElement(T, {
        color: "warning"
    }, "not installed") : $J.default.createElement(T, {
        color: "success"
    }, "installed"), X = O && $J.default.createElement(T, {
        dimColor: !0
    }, " (required to block unix domain sockets)"), q[16] = O, q[17] = X, q[18] = P;
    else X = q[17], P = q[18];
    let W;
    if (q[19] !== X || q[20] !== P) W = $J.default.createElement(T, null, "seccomp filter:", " ", P, X), q[19] = X, q[20] = P, q[21] = W;
    else W = q[21];
    let Z;
    if (q[22] !== O) Z = O && $J.default.createElement(m, {
        flexDirection: "column"
    }, $J.default.createElement(T, {
        dimColor: !0
    }, "  ", "· npm install -g @anthropic-ai/sandbox-runtime"), $J.default.createElement(T, {
        dimColor: !0
    }, "  ", "· or copy vendor/seccomp/* from sandbox-runtime and set"), $J.default.createElement(T, {
        dimColor: !0
    }, "    ", "sandbox.seccomp.bpfPath and applyPath in settings.json")), q[22] = O, q[23] = Z;
    else Z = q[23];
    let G;
    if (q[24] !== W || q[25] !== Z) G = $J.default.createElement(m, {
        flexDirection: "column"
    }, W, Z), q[24] = W, q[25] = Z, q[26] = G;
    else G = q[26];
    let f;
    if (q[27] !== G || q[28] !== j || q[29] !== D) f = $J.default.createElement(m, {
        flexDirection: "column",
        paddingY: 1,
        gap: 1
    }, j, D, G), q[27] = G, q[28] = j, q[29] = D, q[30] = f;
    else f = q[30];
    return f
}
// @from(Ln 425086, Col 0)
function SAz(A) {
    return A.includes("socat")
}
// @from(Ln 425090, Col 0)
function CAz(A) {
    return A.includes("bwrap")
}
// @from(Ln 425093, Col 4)
$J
// @from(Ln 425094, Col 4)
fPq = E(() => {
    e6();
    i6();
    $J = t(P6(), 1)
})
// @from(Ln 425100, Col 0)
function TPq(A) {
    let q = A6(43),
        {
            onComplete: K,
            depCheck: Y
        } = A,
        [z] = z7(),
        _ = vA.isSandboxingEnabled(),
        w = vA.isAutoAllowBashIfSandboxedEnabled(),
        O = Y.warnings.length > 0,
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = PA(), q[0] = $;
    else $ = q[0];
    let j = $.sandbox?.network?.allowAllUnixSockets,
        J = O && !j,
        D = (() => {
            if (!_) return "disabled";
            if (w) return "auto-allow";
            return "regular"
        })(),
        X;
    if (q[1] !== z) X = kA("success", z)("(current)"), q[1] = z, q[2] = X;
    else X = q[2];
    let P = X,
        W = D === "auto-allow" ? `Sandbox BashTool, with auto-allow ${P}` : "Sandbox BashTool, with auto-allow",
        Z;
    if (q[3] !== W) Z = {
        label: W,
        value: "auto-allow"
    }, q[3] = W, q[4] = Z;
    else Z = q[4];
    let G = D === "regular" ? `Sandbox BashTool, with regular permissions ${P}` : "Sandbox BashTool, with regular permissions",
        f;
    if (q[5] !== G) f = {
        label: G,
        value: "regular"
    }, q[5] = G, q[6] = f;
    else f = q[6];
    let v = D === "disabled" ? `No Sandbox ${P}` : "No Sandbox",
        N;
    if (q[7] !== v) N = {
        label: v,
        value: "disabled"
    }, q[7] = v, q[8] = N;
    else N = q[8];
    let V;
    if (q[9] !== Z || q[10] !== f || q[11] !== N) V = [Z, f, N], q[9] = Z, q[10] = f, q[11] = N, q[12] = V;
    else V = q[12];
    let L = V,
        h;
    if (q[13] !== K) h = async function(n) {
        let o = n;
        A: switch (o) {
            case "auto-allow": {
                await vA.setSandboxSettings({
                    enabled: !0,
                    autoAllowBashIfSandboxed: !0
                }), K("✓ Sandbox enabled with auto-allow for bash commands");
                break A
            }
            case "regular": {
                await vA.setSandboxSettings({
                    enabled: !0,
                    autoAllowBashIfSandboxed: !1
                }), K("✓ Sandbox enabled with regular bash permissions");
                break A
            }
            case "disabled":
                await vA.setSandboxSettings({
                    enabled: !1,
                    autoAllowBashIfSandboxed: !1
                }), K("○ Sandbox disabled")
        }
    }, q[13] = K, q[14] = h;
    else h = q[14];
    let R = h,
        u;
    if (q[15] !== K) u = {
        "confirm:no": () => K(void 0, {
            display: "skip"
        })
    }, q[15] = K, q[16] = u;
    else u = q[16];
    let I;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) I = {
        context: "Settings"
    }, q[17] = I;
    else I = q[17];
    tA(u, I);
    let g;
    if (q[18] !== J) g = J && jH.default.createElement(m, {
        marginBottom: 1
    }, jH.default.createElement(T, {
        color: "warning"
    }, "Cannot block unix domain sockets (see Dependencies tab)")), q[18] = J, q[19] = g;
    else g = q[19];
    let B;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) B = jH.default.createElement(m, {
        marginBottom: 1
    }, jH.default.createElement(T, {
        bold: !0
    }, "Configure Mode:")), q[20] = B;
    else B = q[20];
    let b;
    if (q[21] !== K) b = () => K(void 0, {
        display: "skip"
    }), q[21] = K, q[22] = b;
    else b = q[22];
    let p;
    if (q[23] !== R || q[24] !== L || q[25] !== b) p = jH.default.createElement(T8, {
        options: L,
        onChange: R,
        onCancel: b
    }), q[23] = R, q[24] = L, q[25] = b, q[26] = p;
    else p = q[26];
    let Q;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) Q = jH.default.createElement(T, {
        dimColor: !0
    }, jH.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Auto-allow mode:"), " ", "Commands will try to run in the sandbox automatically, and attempts to run outside of the sandbox fallback to regular permissions. Explicit ask/deny rules are always respected."), q[27] = Q;
    else Q = q[27];
    let U;
    if (q[28] === Symbol.for("react.memo_cache_sentinel")) U = jH.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, Q, jH.default.createElement(T, {
        dimColor: !0
    }, "Learn more:", " ", jH.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/sandboxing"
    }, "code.claude.com/docs/en/sandboxing"))), q[28] = U;
    else U = q[28];
    let r;
    if (q[29] !== g || q[30] !== p) r = jH.default.createElement(Hw, {
        key: "mode",
        title: "Mode"
    }, jH.default.createElement(m, {
        flexDirection: "column",
        paddingY: 1
    }, g, B, p, U)), q[29] = g, q[30] = p, q[31] = r;
    else r = q[31];
    let e = r,
        Y6;
    if (q[32] !== K) Y6 = jH.default.createElement(Hw, {
        key: "overrides",
        title: "Overrides"
    }, jH.default.createElement(ZPq, {
        onComplete: K
    })), q[32] = K, q[33] = Y6;
    else Y6 = q[33];
    let H6 = Y6,
        J6;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) J6 = jH.default.createElement(Hw, {
        key: "config",
        title: "Config"
    }, jH.default.createElement(PPq, null)), q[34] = J6;
    else J6 = q[34];
    let K6 = J6,
        s = Y.errors.length > 0,
        X6;
    if (q[35] !== Y || q[36] !== s || q[37] !== O || q[38] !== e || q[39] !== H6) X6 = s ? [jH.default.createElement(Hw, {
        key: "dependencies",
        title: "Dependencies"
    }, jH.default.createElement(Ql8, {
        depCheck: Y
    }))] : [e, ...O ? [jH.default.createElement(Hw, {
        key: "dependencies",
        title: "Dependencies"
    }, jH.default.createElement(Ql8, {
        depCheck: Y
    }))] : [], H6, K6], q[35] = Y, q[36] = s, q[37] = O, q[38] = e, q[39] = H6, q[40] = X6;
    else X6 = q[40];
    let z6 = X6,
        N6;
    if (q[41] !== z6) N6 = jH.default.createElement(S3, {
        color: "permission"
    }, jH.default.createElement(Gh, {
        title: "Sandbox:",
        color: "permission",
        defaultTab: "Mode"
    }, z6)), q[41] = z6, q[42] = N6;
    else N6 = q[42];
    return N6
}
// @from(Ln 425286, Col 4)
jH
// @from(Ln 425287, Col 4)
vPq = E(() => {
    e6();
    i6();
    v3();
    Lz();
    FJ();
    oz6();
    i6();
    WPq();
    GPq();
    fPq();
    _7();
    i8();
    jH = t(P6(), 1)
})
// @from(Ln 425302, Col 4)
kPq = {}
// @from(Ln 425307, Col 0)
async function IAz(A, q, K) {
    let z = PA().theme || "light",
        _ = y8();
    if (!vA.isSupportedPlatform()) {
        let $ = _ === "wsl" ? "Error: Sandboxing requires WSL2. WSL1 is not supported." : "Error: Sandboxing is currently only supported on macOS, Linux, and WSL2.",
            H = kA("error", z)($);
        return A(H), null
    }
    let w = vA.checkDependencies();
    if (!vA.isPlatformInEnabledList()) {
        let $ = kA("error", z)(`Error: Sandboxing is disabled for this platform (${_}) via the enabledPlatforms setting.`);
        return A($), null
    }
    if (vA.areSandboxSettingsLockedByPolicy()) {
        let $ = kA("error", z)("Error: Sandbox settings are overridden by a higher-priority configuration and cannot be changed locally.");
        return A($), null
    }
    let O = K?.trim() || "";
    if (!O) return VPq.default.createElement(TPq, {
        onComplete: A,
        depCheck: w
    });
    if (O) {
        let H = O.split(" ")[0];
        if (H === "exclude") {
            let j = O.slice(8).trim();
            if (!j) {
                let P = kA("error", z)('Error: Please provide a command pattern to exclude (e.g., /sandbox exclude "npm run test:*")');
                return A(P), null
            }
            let J = j.replace(/^["']|["']$/g, "");
            Uw8(J);
            let M = F_("localSettings"),
                D = M ? NPq.relative(OS(), M) : ".claude/settings.local.json",
                X = kA("success", z)(`Added "${J}" to excluded commands in ${D}`);
            return A(X), null
        } else {
            let j = kA("error", z)(`Error: Unknown subcommand "${H}". Available subcommand: exclude`);
            return A(j), null
        }
    }
    return null
}
// @from(Ln 425350, Col 4)
VPq
// @from(Ln 425351, Col 4)
EPq = E(() => {
    Lz();
    i6();
    i8();
    T1();
    vPq();
    YK();
    VPq = t(P6(), 1)
})
// @from(Ln 425360, Col 4)
bAz
// @from(Ln 425360, Col 9)
yPq
// @from(Ln 425361, Col 4)
LPq = E(() => {
    Lz();
    b7();
    bAz = {
        name: "sandbox",
        get description() {
            let A = vA.isSandboxingEnabled(),
                q = vA.isAutoAllowBashIfSandboxedEnabled(),
                K = vA.areUnsandboxedCommandsAllowed(),
                Y = vA.areSandboxSettingsLockedByPolicy(),
                z = vA.checkDependencies().errors.length === 0,
                _;
            if (!z) _ = a6.warning;
            else _ = A ? a6.tick : a6.circle;
            let w = "sandbox disabled";
            if (A) w = q ? "sandbox enabled (auto-allow)" : "sandbox enabled", w += K ? ", fallback allowed" : "";
            if (Y) w += " (managed)";
            return `${_} ${w} (⏎ to configure)`
        },
        argumentHint: 'exclude "command pattern"',
        isEnabled: () => !0,
        get isHidden() {
            return !vA.isSupportedPlatform() || !vA.isPlatformInEnabledList()
        },
        immediate: !0,
        type: "local-jsx",
        userFacingName: () => "sandbox",
        load: () => Promise.resolve().then(() => (EPq(), kPq))
    }, yPq = bAz
})
// @from(Ln 425398, Col 0)
function mAz() {
    return [uAz]
}
// @from(Ln 425401, Col 0)
async function BAz(A, q) {
    if (A.length === 0) return q?.("[Claude in Chrome] No browser paths to check"), {
        isInstalled: !1,
        browser: null
    };
    let K = mAz();
    for (let {
            browser: Y,
            path: z
        }
        of A) {
        let _ = [];
        try {
            _ = await RPq(z, {
                withFileTypes: !0
            })
        } catch (O) {
            let $ = O.code;
            if ($ === "ENOENT" || $ === "EACCES" || $ === "EPERM") continue;
            throw O
        }
        let w = _.filter((O) => O.isDirectory()).filter((O) => O.name === "Default" || O.name.startsWith("Profile ")).map((O) => O.name);
        if (w.length > 0) q?.(`[Claude in Chrome] Found ${Y} profiles: ${w.join(", ")}`);
        for (let O of w)
            for (let $ of K) {
                let H = xAz(z, O, "Extensions", $);
                try {
                    return await RPq(H), q?.(`[Claude in Chrome] Extension ${$} found in ${Y} ${O}`), {
                        isInstalled: !0,
                        browser: Y
                    }
                } catch {}
            }
    }
    return q?.("[Claude in Chrome] Extension not found in any browser"), {
        isInstalled: !1,
        browser: null
    }
}
// @from(Ln 425440, Col 0)
async function hPq(A, q) {
    return (await BAz(A, q)).isInstalled
}
// @from(Ln 425443, Col 4)
uAz = "fcoeoabgfenejglbffodgkkbkcdhcgfn"
// @from(Ln 425444, Col 4)
SPq = () => {}
// @from(Ln 425461, Col 0)
function zh1(A) {
    if (q7() && A !== !0) return !1;
    if (A === !0) return !0;
    if (A === !1) return !1;
    if (t6(process.env.CLAUDE_CODE_ENABLE_CFC)) return !0;
    if (xz(process.env.CLAUDE_CODE_ENABLE_CFC)) return !1;
    let q = X1();
    if (q.claudeInChromeDefaultEnabled !== void 0) return q.claudeInChromeDefaultEnabled;
    return !1
}
// @from(Ln 425472, Col 0)
function kN6() {
    if (Yh1 !== void 0) return Yh1;
    return Yh1 = DW() && cAz() && w8("tengu_chrome_auto_enable", !1), Yh1
}
// @from(Ln 425477, Col 0)
function dl8() {
    let A = rY(),
        q = Sp.map((z) => `mcp__claude-in-chrome__${z.name}`),
        K = {};
    if (qA6()) K.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";
    let Y = Object.keys(K).length > 0;
    if (A) {
        let z = `"${process.execPath}" --chrome-native-host`;
        return bPq(z).then((_) => IPq(_)), {
            mcpConfig: {
                [lv]: {
                    type: "stdio",
                    command: process.execPath,
                    args: ["--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...Y && {
                        env: K
                    }
                }
            },
            allowedTools: q,
            systemPrompt: dF8()
        }
    } else {
        let z = pAz(import.meta.url),
            _ = $i(z, ".."),
            w = $i(_, "cli.js");
        return bPq(`"${process.execPath}" "${w}" --chrome-native-host`).then(($) => IPq($)), {
            mcpConfig: {
                [lv]: {
                    type: "stdio",
                    command: process.execPath,
                    args: [`${w}`, "--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...Y && {
                        env: K
                    }
                }
            },
            allowedTools: q,
            systemPrompt: dF8()
        }
    }
}
// @from(Ln 425522, Col 0)
function UAz() {
    if (y8() === "windows") {
        let q = FAz(),
            K = process.env.APPDATA || $i(q, "AppData", "Local");
        return [$i(K, "Claude Code", "ChromeNativeHost")]
    }
    return Ow4().map(({
        path: q
    }) => q)
}
// @from(Ln 425532, Col 0)
async function IPq(A) {
    let q = UAz();
    if (q.length === 0) throw Error("Claude in Chrome Native Host not supported on this platform");
    let K = {
            name: Ul8,
            description: "Claude Code Browser Extension Native Host",
            path: A,
            type: "stdio",
            allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/", ...[]]
        },
        Y = B6(K, null, 2),
        z = !1;
    for (let _ of q) {
        let w = $i(_, CPq);
        if (await uPq(w, "utf-8").catch(() => null) === Y) continue;
        try {
            await xPq(_, {
                recursive: !0
            }), await mPq(w, Y), k(`[Claude in Chrome] Installed native host manifest at: ${w}`), z = !0
        } catch ($) {
            k(`[Claude in Chrome] Failed to install manifest at ${w}: ${$}`)
        }
    }
    if (y8() === "windows") {
        let _ = $i(q[0], CPq);
        dAz(_)
    }
    if (z) Hi().then((_) => {
        if (_) k("[Claude in Chrome] First-time install detected, opening reconnect page in browser"), VW1(QAz);
        else k("[Claude in Chrome] First-time install detected, but extension not installed, skipping reconnect")
    })
}
// @from(Ln 425565, Col 0)
function dAz(A) {
    let q = $w4();
    for (let {
            browser: K,
            key: Y
        }
        of q) {
        let z = `${Y}\\${Ul8}`;
        RA("reg", ["add", z, "/ve", "/t", "REG_SZ", "/d", A, "/f"]).then((_) => {
            if (_.code === 0) k(`[Claude in Chrome] Registered native host for ${K} in Windows registry: ${z}`);
            else k(`[Claude in Chrome] Failed to register native host for ${K} in Windows registry: ${_.stderr}`)
        })
    }
}
// @from(Ln 425579, Col 0)
async function bPq(A) {
    let q = y8(),
        K = $i(c8(), "chrome"),
        Y = q === "windows" ? $i(K, "chrome-native-host.bat") : $i(K, "chrome-native-host"),
        z = q === "windows" ? `@echo off
REM Chrome native host wrapper script
REM Generated by Claude Code - do not edit manually
${A}
` : `#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec ${A}
`;
    if (await uPq(Y, "utf-8").catch(() => null) === z) return Y;
    if (await xPq(K, {
            recursive: !0
        }), await mPq(Y, z), q !== "windows") await gAz(Y, 493);
    return k(`[Claude in Chrome] Created Chrome native host wrapper script: ${Y}`), Y
}
// @from(Ln 425599, Col 0)
function cAz() {
    return Hi().then((q) => {
        if (!q) return;
        if (X1().cachedChromeExtensionInstalled !== q) d1((Y) => ({
            ...Y,
            cachedChromeExtensionInstalled: q
        }))
    }), X1().cachedChromeExtensionInstalled ?? !1
}
// @from(Ln 425608, Col 0)
async function Hi() {
    let A = ww4();
    if (A.length === 0) return k(`[Claude in Chrome] Unsupported platform for extension detection: ${y8()}`), !1;
    return hPq(A, k)
}
// @from(Ln 425613, Col 4)
QAz = "https://clau.de/chrome/reconnect"
// @from(Ln 425614, Col 4)
Ul8 = "com.anthropic.claude_code_browser_extension"
// @from(Ln 425615, Col 4)
CPq
// @from(Ln 425615, Col 9)
Yh1 = void 0
// @from(Ln 425616, Col 4)
R_6 = E(() => {
    YK();
    H1();
    Eq();
    A8();
    T1();
    wL6();
    SR();
    k8();
    g1();
    HA();
    SPq();
    CPq = `${Ul8}.json`
})
// @from(Ln 425630, Col 4)
BPq = {}
// @from(Ln 425635, Col 0)
function rAz(A) {
    let q = A6(41),
        {
            onDone: K,
            isExtensionInstalled: Y,
            configEnabled: z,
            isClaudeAISubscriber: _,
            isWSL: w
        } = A,
        O = M1(eAz),
        [$, H] = Zr6.useState(0),
        [j, J] = Zr6.useState(z ?? !1),
        [M, D] = Zr6.useState(!1),
        [X, P] = Zr6.useState(Y),
        W;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) W = !1, q[0] = W;
    else W = q[0];
    let Z = W,
        G;
    if (q[1] !== O) G = O.find(tAz), q[1] = O, q[2] = G;
    else G = q[2];
    let v = G?.type === "connected",
        N;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) N = function(Y6) {
        if (Z) R9(Y6);
        else VW1(Y6)
    }, q[3] = N;
    else N = q[3];
    let V = N,
        L;
    if (q[4] !== j) L = function(Y6) {
        A: switch (Y6) {
            case "install-extension": {
                H(sAz), D(!0), V(lAz);
                break A
            }
            case "reconnect": {
                H(aAz), Hi().then((H6) => {
                    if (P(H6), H6) D(!1)
                }), V(nAz);
                break A
            }
            case "manage-permissions": {
                H(oAz), V(iAz);
                break A
            }
            case "toggle-default": {
                let H6 = !j;
                d1((J6) => ({
                    ...J6,
                    claudeInChromeDefaultEnabled: H6
                })), J(H6)
            }
        }
    }, q[4] = j, q[5] = L;
    else L = q[5];
    let h = L,
        R;
    if (q[6] !== j || q[7] !== X) {
        R = [];
        let e = X ? "" : " (requires extension)";
        if (!X && !Z) {
            let z6;
            if (q[9] === Symbol.for("react.memo_cache_sentinel")) z6 = {
                label: "Install Chrome extension",
                value: "install-extension"
            }, q[9] = z6;
            else z6 = q[9];
            R.push(z6)
        }
        let Y6;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) Y6 = jz.default.createElement(T, null, "Manage permissions"), q[10] = Y6;
        else Y6 = q[10];
        let H6;
        if (q[11] !== e) H6 = {
            label: jz.default.createElement(jz.default.Fragment, null, Y6, jz.default.createElement(T, {
                dimColor: !0
            }, e)),
            value: "manage-permissions"
        }, q[11] = e, q[12] = H6;
        else H6 = q[12];
        let J6;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) J6 = jz.default.createElement(T, null, "Reconnect extension"), q[13] = J6;
        else J6 = q[13];
        let K6;
        if (q[14] !== e) K6 = {
            label: jz.default.createElement(jz.default.Fragment, null, J6, jz.default.createElement(T, {
                dimColor: !0
            }, e)),
            value: "reconnect"
        }, q[14] = e, q[15] = K6;
        else K6 = q[15];
        let s = `Enabled by default: ${j?"Yes":"No"}`,
            X6;
        if (q[16] !== s) X6 = {
            label: s,
            value: "toggle-default"
        }, q[16] = s, q[17] = X6;
        else X6 = q[17];
        R.push(H6, K6, X6), q[6] = j, q[7] = X, q[8] = R
    } else R = q[8];
    let u = w || !_,
        I;
    if (q[18] !== K) I = () => K(), q[18] = K, q[19] = I;
    else I = q[19];
    let g;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) g = jz.default.createElement(T, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. Navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests."), q[20] = g;
    else g = q[20];
    let B;
    if (q[21] !== w) B = w && jz.default.createElement(T, {
        color: "error"
    }, "Claude in Chrome is not supported in WSL at this time."), q[21] = w, q[22] = B;
    else B = q[22];
    let b;
    if (q[23] !== _) b = !_ && jz.default.createElement(T, {
        color: "error"
    }, "Claude in Chrome requires a claude.ai subscription."), q[23] = _, q[24] = b;
    else b = q[24];
    let p;
    if (q[25] !== h || q[26] !== v || q[27] !== u || q[28] !== X || q[29] !== R || q[30] !== $ || q[31] !== M) p = !u && jz.default.createElement(jz.default.Fragment, null, !Z && jz.default.createElement(m, {
        flexDirection: "column"
    }, jz.default.createElement(T, null, "Status:", " ", v ? jz.default.createElement(T, {
        color: "success"
    }, "Enabled") : jz.default.createElement(T, {
        color: "inactive"
    }, "Disabled")), jz.default.createElement(T, null, "Extension:", " ", X ? jz.default.createElement(T, {
        color: "success"
    }, "Installed") : jz.default.createElement(T, {
        color: "warning"
    }, "Not detected"))), jz.default.createElement(T8, {
        key: $,
        options: R,
        onChange: h,
        hideIndexes: !0
    }), M && jz.default.createElement(T, {
        color: "warning"
    }, "Once installed, select ", '"Reconnect extension"', " to connect."), jz.default.createElement(T, null, jz.default.createElement(T, {
        dimColor: !0
    }, "Usage: "), jz.default.createElement(T, null, "claude --chrome"), jz.default.createElement(T, {
        dimColor: !0
    }, " or "), jz.default.createElement(T, null, "claude --no-chrome")), jz.default.createElement(T, {
        dimColor: !0
    }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on.")), q[25] = h, q[26] = v, q[27] = u, q[28] = X, q[29] = R, q[30] = $, q[31] = M, q[32] = p;
    else p = q[32];
    let Q;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) Q = jz.default.createElement(T, {
        dimColor: !0
    }, "Learn more: https://code.claude.com/docs/en/chrome"), q[33] = Q;
    else Q = q[33];
    let U;
    if (q[34] !== B || q[35] !== b || q[36] !== p) U = jz.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, g, B, b, p, Q), q[34] = B, q[35] = b, q[36] = p, q[37] = U;
    else U = q[37];
    let r;
    if (q[38] !== U || q[39] !== I) r = jz.default.createElement(m8, {
        title: "Claude in Chrome (Beta)",
        onCancel: I,
        color: "chromeYellow"
    }, U), q[38] = U, q[39] = I, q[40] = r;
    else r = q[40];
    return r
}
// @from(Ln 425800, Col 0)
function oAz(A) {
    return A + 1
}
// @from(Ln 425804, Col 0)
function aAz(A) {
    return A + 1
}
// @from(Ln 425808, Col 0)
function sAz(A) {
    return A + 1
}
// @from(Ln 425812, Col 0)
function tAz(A) {
    return A.name === lv
}
// @from(Ln 425816, Col 0)
function eAz(A) {
    return A.mcp.clients
}
// @from(Ln 425819, Col 4)
jz
// @from(Ln 425819, Col 8)
Zr6
// @from(Ln 425819, Col 13)
lAz = "https://claude.ai/chrome"
// @from(Ln 425820, Col 4)
iAz = "https://clau.de/chrome/permissions"
// @from(Ln 425821, Col 4)
nAz = "https://clau.de/chrome/reconnect"
// @from(Ln 425822, Col 4)
A7z = async function(A) {
        let q = await Hi(),
            K = X1(),
            Y = iA(),
            z = Q8.isWslEnvironment();
        return jz.default.createElement(rAz, {
            onDone: A,
            isExtensionInstalled: q,
            configEnabled: K.claudeInChromeDefaultEnabled,
            isClaudeAISubscriber: Y,
            isWSL: z
        })
    }
// @from(Ln 425835, Col 4)
gPq = E(() => {
    e6();
    i6();
    R_6();
    SR();
    k8();
    wq();
    v3();
    NA();
    fA();
    d3();
    kX();
    A8();
    jz = t(P6(), 1), Zr6 = t(P6(), 1)
})
// @from(Ln 425850, Col 4)
q7z
// @from(Ln 425850, Col 9)
FPq
// @from(Ln 425851, Col 4)
pPq = E(() => {
    T1();
    q7z = {
        name: "chrome",
        description: "Claude in Chrome (Beta) settings",
        isEnabled: () => !q7(),
        isHidden: !1,
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (gPq(), BPq)),
        userFacingName: () => "chrome"
    }, FPq = q7z
})
// @from(Ln 425863, Col 4)
QPq = {}
// @from(Ln 425867, Col 0)
async function K7z() {
    if (await R9("https://www.stickermule.com/claudecode")) return {
        type: "text",
        value: "Opening sticker page in browser…"
    };
    else return {
        type: "text",
        value: "Failed to open browser. Visit: https://www.stickermule.com/claudecode"
    }
}
// @from(Ln 425877, Col 4)
UPq = E(() => {
    kX()
})
// @from(Ln 425880, Col 4)
Y7z
// @from(Ln 425880, Col 9)
cl8
// @from(Ln 425881, Col 4)
dPq = E(() => {
    Y7z = {
        type: "local",
        name: "stickers",
        description: "Order Claude Code stickers",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (UPq(), QPq)),
        userFacingName() {
            return "stickers"
        }
    }, cl8 = Y7z
})
// @from(Ln 425910, Col 0)
function rw(A) {
    let {
        files: q
    } = A, K, Y = A.getPromptForCommand;
    if (q && Object.keys(q).length > 0) {
        K = nPq(A.name);
        let _, w = A.getPromptForCommand;
        Y = async (O, $) => {
            _ ??= j7z(A.name, q);
            let H = await _,
                j = await w(O, $);
            if (H === null) return j;
            return W7z(j, H)
        }
    }
    let z = {
        type: "prompt",
        name: A.name,
        description: A.description,
        aliases: A.aliases,
        hasUserSpecifiedDescription: !0,
        allowedTools: A.allowedTools ?? [],
        argumentHint: A.argumentHint,
        whenToUse: A.whenToUse,
        model: A.model,
        disableModelInvocation: A.disableModelInvocation ?? !1,
        userInvocable: A.userInvocable ?? !0,
        contentLength: 0,
        source: "bundled",
        loadedFrom: "bundled",
        hooks: A.hooks,
        skillRoot: K,
        context: A.context,
        agent: A.agent,
        isEnabled: A.isEnabled ?? (() => !0),
        isHidden: !(A.userInvocable ?? !0),
        progressMessage: "running",
        userFacingName: () => A.name,
        getPromptForCommand: Y
    };
    lPq.push(z)
}
// @from(Ln 425953, Col 0)
function iPq() {
    return [...lPq]
}
// @from(Ln 425957, Col 0)
function nPq(A) {
    return cPq(ll8(), A)
}
// @from(Ln 425960, Col 0)
async function j7z(A, q) {
    let K = nPq(A);
    try {
        return await J7z(K, q), K
    } catch (Y) {
        return k(`Failed to extract bundled skill '${A}' to ${K}: ${Y instanceof Error?Y.message:String(Y)}`), null
    }
}
// @from(Ln 425968, Col 0)
async function J7z(A, q) {
    let K = new Map;
    for (let [Y, z] of Object.entries(q)) {
        let _ = P7z(A, Y),
            w = w7z(_),
            O = [_, z],
            $ = K.get(w);
        if ($) $.push(O);
        else K.set(w, [O])
    }
    await Promise.all([...K].map(async ([Y, z]) => {
        await z7z(Y, {
            recursive: !0,
            mode: 448
        }), await Promise.all(z.map(([_, w]) => X7z(_, w)))
    }))
}
// @from(Ln 425985, Col 0)
async function X7z(A, q) {
    let K = await _7z(A, D7z, 384);
    try {
        await K.writeFile(q, "utf8")
    } finally {
        await K.close()
    }
}
// @from(Ln 425994, Col 0)
function P7z(A, q) {
    let K = O7z(q);
    if ($7z(K) || K.split(H7z).includes("..") || K.split("/").includes("..")) throw Error(`bundled skill file path escapes skill dir: ${q}`);
    return cPq(A, K)
}
// @from(Ln 426000, Col 0)
function W7z(A, q) {
    let K = `Base directory for this skill: ${q}

`;
    if (A.length > 0 && A[0].type === "text") return [{
        type: "text",
        text: K + A[0].text
    }, ...A.slice(1)];
    return [{
        type: "text",
        text: K
    }, ...A]
}
// @from(Ln 426013, Col 4)
lPq
// @from(Ln 426013, Col 9)
M7z
// @from(Ln 426013, Col 14)
D7z
// @from(Ln 426014, Col 4)
nf = E(() => {
    H1();
    RY();
    lPq = [];
    M7z = _h1.O_NOFOLLOW ?? 0, D7z = process.platform === "win32" ? "wx" : _h1.O_WRONLY | _h1.O_CREAT | _h1.O_EXCL | M7z
})
// @from(Ln 426020, Col 4)
rPq
// @from(Ln 426021, Col 4)
oPq = E(() => {
    rPq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 426029, Col 0)
function aPq({
    onDone: A,
    onCancel: q
}) {
    let [K, Y] = c16.useState("loading"), [z, _] = c16.useState([]), [w, O] = c16.useState(0), [$, H] = c16.useState(), j = S0();
    if (c16.useEffect(() => {
            async function N() {
                let V = [],
                    L = await z8("git", ["status", "--porcelain"]);
                if (L.stdout) V = L.stdout.split(`
`).filter((h) => h.trim() !== ""), _(V);
                if (j) {
                    let {
                        stdout: h
                    } = await z8("git", ["rev-list", "--count", `${j.originalHeadCommit}..HEAD`]), R = parseInt(h.trim()) || 0;
                    if (O(R), V.length === 0 && R === 0) {
                        Y("removing"), df6().then(() => {
                            process.chdir(j.originalCwd), VO(j.originalCwd), t2.cache.clear?.(), H("Worktree removed (no changes)")
                        }).catch((u) => {
                            k(`Failed to clean up worktree: ${u}`, {
                                level: "error"
                            }), H("Worktree cleanup failed, exiting anyway")
                        }).then(() => {
                            Y("done")
                        });
                        return
                    } else Y("asking")
                }
            }
            N()
        }, [j]), c16.useEffect(() => {
            if (K === "done") A($)
        }, [K, A, $]), !j) return A("No active worktree session found", {
        display: "system"
    }), null;
    if (K === "loading" || K === "done") return null;
    async function J(N) {
        if (!j) return;
        let V = Boolean(j.tmuxSessionName);
        if (N === "keep" || N === "keep-with-tmux") {
            if (Y("keeping"), d("tengu_worktree_kept", {
                    commits: w,
                    changed_files: z.length
                }), await Uf6(), process.chdir(j.originalCwd), VO(j.originalCwd), t2.cache.clear?.(), V) H(`Worktree kept. Your work is saved at ${j.worktreePath} on branch ${j.worktreeBranch}. Reattach to tmux session with: tmux attach -t ${j.tmuxSessionName}`);
            else H(`Worktree kept. Your work is saved at ${j.worktreePath} on branch ${j.worktreeBranch}`);
            Y("done")
        } else if (N === "keep-kill-tmux") {
            if (Y("keeping"), d("tengu_worktree_kept", {
                    commits: w,
                    changed_files: z.length
                }), j.tmuxSessionName) await Qf6(j.tmuxSessionName);
            await Uf6(), process.chdir(j.originalCwd), VO(j.originalCwd), t2.cache.clear?.(), H(`Worktree kept at ${j.worktreePath} on branch ${j.worktreeBranch}. Tmux session terminated.`), Y("done")
        } else if (N === "remove" || N === "remove-with-tmux") {
            if (Y("removing"), d("tengu_worktree_removed", {
                    commits: w,
                    changed_files: z.length
                }), j.tmuxSessionName) await Qf6(j.tmuxSessionName);
            try {
                await df6(), process.chdir(j.originalCwd), VO(j.originalCwd), t2.cache.clear?.()
            } catch (h) {
                k(`Failed to clean up worktree: ${h}`, {
                    level: "error"
                }), H("Worktree cleanup failed, exiting anyway"), Y("done");
                return
            }
            let L = V ? " Tmux session terminated." : "";
            if (w > 0 && z.length > 0) H(`Worktree removed. ${w} ${w===1?"commit":"commits"} and uncommitted changes were discarded.${L}`);
            else if (w > 0) H(`Worktree removed. ${w} ${w===1?"commit":"commits"} on ${j.worktreeBranch} ${w===1?"was":"were"} discarded.${L}`);
            else if (z.length > 0) H(`Worktree removed. Uncommitted changes were discarded.${L}`);
            else H(`Worktree removed.${L}`);
            Y("done")
        }
    }
    if (K === "keeping") return ji.default.createElement(m, {
        flexDirection: "row",
        marginY: 1
    }, ji.default.createElement(Wq, null), ji.default.createElement(T, null, "Keeping worktree…"));
    if (K === "removing") return ji.default.createElement(m, {
        flexDirection: "row",
        marginY: 1
    }, ji.default.createElement(Wq, null), ji.default.createElement(T, null, "Removing worktree…"));
    let M = j.worktreeBranch,
        D = z.length > 0,
        X = w > 0,
        P = "";
    if (D && X) P = `You have ${z.length} uncommitted ${z.length===1?"file":"files"} and ${w} ${w===1?"commit":"commits"} on ${M}. All will be lost if you remove.`;
    else if (D) P = `You have ${z.length} uncommitted ${z.length===1?"file":"files"}. These will be lost if you remove the worktree.`;
    else if (X) P = `You have ${w} ${w===1?"commit":"commits"} on ${M}. The branch will be deleted if you remove the worktree.`;
    else P = "You are working in a worktree. Keep it to continue working there, or remove it to clean up.";

    function W() {
        if (q) {
            q();
            return
        }
        J("keep")
    }
    let Z = D || X ? "All changes and commits will be lost." : "Clean up the worktree directory.",
        G = Boolean(j.tmuxSessionName),
        f = G ? [{
            label: "Keep worktree and tmux session",
            value: "keep-with-tmux",
            description: `Stays at ${j.worktreePath}. Reattach with: tmux attach -t ${j.tmuxSessionName}`
        }, {
            label: "Keep worktree, kill tmux session",
            value: "keep-kill-tmux",
            description: `Keeps worktree at ${j.worktreePath}, terminates tmux session.`
        }, {
            label: "Remove worktree and tmux session",
            value: "remove-with-tmux",
            description: Z
        }] : [{
            label: "Keep worktree",
            value: "keep",
            description: `Stays at ${j.worktreePath}`
        }, {
            label: "Remove worktree",
            value: "remove",
            description: Z
        }];
    return ji.default.createElement(m8, {
        title: "Exiting worktree session",
        subtitle: P,
        onCancel: W
    }, ji.default.createElement(T8, {
        defaultFocusValue: G ? "keep-with-tmux" : "keep",
        options: f,
        onChange: J
    }))
}
// @from(Ln 426159, Col 4)
ji
// @from(Ln 426159, Col 8)
c16
// @from(Ln 426160, Col 4)
sPq = E(() => {
    i6();
    v3();
    jN();
    LO();
    WR();
    rH();
    Eq();
    V1();
    H1();
    wq();
    ji = t(P6(), 1), c16 = t(P6(), 1)
})
// @from(Ln 426174, Col 0)
function G7z() {
    return YM(Z7z) ?? "Goodbye!"
}
// @from(Ln 426178, Col 0)
function wh1(A) {
    let q = A6(5),
        {
            showWorktree: K,
            onDone: Y,
            onCancel: z
        } = A,
        _;
    if (q[0] !== Y) _ = async function($) {
        Y($ ?? G7z()), await Vq(0, "prompt_input_exit")
    }, q[0] = Y, q[1] = _;
    else _ = q[1];
    let w = _;
    if (K) {
        let O;
        if (q[2] !== z || q[3] !== w) O = tPq.default.createElement(aPq, {
            onDone: w,
            onCancel: z
        }), q[2] = z, q[3] = w, q[4] = O;
        else O = q[4];
        return O
    }
    return null
}
// @from(Ln 426202, Col 4)
tPq
// @from(Ln 426202, Col 9)
Z7z
// @from(Ln 426203, Col 4)
il8 = E(() => {
    e6();
    Nc();
    sPq();
    c_();
    tPq = t(P6(), 1), Z7z = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"]
})
// @from(Ln 426210, Col 4)
ePq = {}
// @from(Ln 426215, Col 0)
function T7z() {
    return YM(f7z) ?? "Goodbye!"
}
// @from(Ln 426218, Col 0)
async function v7z(A) {
    let q = S0() !== null;
    if (q) return nl8.createElement(wh1, {
        showWorktree: q,
        onDone: A,
        onCancel: () => A()
    });
    return A(T7z()), await Vq(0, "prompt_input_exit"), null
}
// @from(Ln 426227, Col 4)
nl8
// @from(Ln 426227, Col 9)
f7z
// @from(Ln 426228, Col 4)
A0q = E(() => {
    Nc();
    c_();
    jN();
    il8();
    nl8 = t(P6(), 1), f7z = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"]
})
// @from(Ln 426235, Col 4)
N7z
// @from(Ln 426235, Col 9)
Gr6
// @from(Ln 426236, Col 4)
rl8 = E(() => {
    N7z = {
        type: "local-jsx",
        name: "exit",
        aliases: ["quit"],
        description: "Exit the REPL",
        isEnabled: () => !0,
        isHidden: !1,
        immediate: !0,
        load: () => Promise.resolve().then(() => (A0q(), ePq)),
        userFacingName() {
            return "exit"
        }
    }, Gr6 = N7z
})