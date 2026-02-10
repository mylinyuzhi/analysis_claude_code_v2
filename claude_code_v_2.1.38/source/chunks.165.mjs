
// @from(Ln 425728, Col 0)
function kwq() {
    let A = e(13),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = dw(),
        w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        context: "Confirmation"
    }, A[0] = w;
    else w = A[0];
    DA("confirm:no", K, w);
    let H = z.location === "userSettings",
        $;
    if (A[1] !== H) $ = H ? [{
        label: "Enable (~/.claude/agent-memory/) (Recommended)",
        value: "user"
    }, {
        label: "None (no persistent memory)",
        value: "none"
    }, {
        label: "Project scope (.claude/agent-memory/)",
        value: "project"
    }, {
        label: "Local scope (.claude/agent-memory-local/)",
        value: "local"
    }] : [{
        label: "Enable (.claude/agent-memory/) (Recommended)",
        value: "project"
    }, {
        label: "None (no persistent memory)",
        value: "none"
    }, {
        label: "User scope (~/.claude/agent-memory/)",
        value: "user"
    }, {
        label: "Local scope (.claude/agent-memory-local/)",
        value: "local"
    }], A[1] = H, A[2] = $;
    else $ = A[2];
    let O = $,
        _;
    if (A[3] !== q || A[4] !== Y || A[5] !== z.finalAgent || A[6] !== z.systemPrompt) _ = (j) => {
        let M = j === "none" ? void 0 : j,
            P = z.finalAgent?.agentType;
        Y({
            selectedMemory: M,
            finalAgent: z.finalAgent ? {
                ...z.finalAgent,
                memory: M,
                getSystemPrompt: y2() && M && P ? () => z.systemPrompt + `

` + zK1(P, M) : () => z.systemPrompt
            } : void 0
        }), q()
    }, A[3] = q, A[4] = Y, A[5] = z.finalAgent, A[6] = z.systemPrompt, A[7] = _;
    else _ = A[7];
    let J = _,
        X;
    if (A[8] === Symbol.for("react.memo_cache_sentinel")) X = Be.default.createElement(oA, null, Be.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), Be.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), Be.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[8] = X;
    else X = A[8];
    let D;
    if (A[9] !== K || A[10] !== J || A[11] !== O) D = Be.default.createElement(AO, {
        subtitle: "Configure agent memory",
        footerText: X
    }, Be.default.createElement(I, {
        marginTop: 1
    }, Be.default.createElement(kA, {
        key: "memory-select",
        options: O,
        onChange: J,
        onCancel: K
    }))), A[9] = K, A[10] = J, A[11] = O, A[12] = D;
    else D = A[12];
    return D
}
// @from(Ln 425817, Col 4)
Be
// @from(Ln 425818, Col 4)
Lwq = v(() => {
    i1();
    xW();
    m1();
    U5();
    VE();
    xN();
    gB();
    wK();
    BK();
    HK();
    K7();
    Be = o(X1(), 1)
})
// @from(Ln 425833, Col 0)
function Rwq(A) {
    let q = e(83),
        {
            tools: K,
            existingAgents: Y,
            onSave: z,
            onSaveAndEdit: w,
            error: H
        } = A,
        {
            goBack: $,
            wizardData: O
        } = dw(),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Confirmation"
    }, q[0] = _;
    else _ = q[0];
    DA("confirm:no", $, _);
    let J;
    if (q[1] !== z || q[2] !== w) J = (O1, T1) => {
        if (O1 === "s" || T1.return) z();
        else if (O1 === "e") w()
    }, q[1] = z, q[2] = w, q[3] = J;
    else J = q[3];
    D8(J);
    let X = O.finalAgent,
        D, j, M, P, W, G, f, Z, N, T, k, y, B, S, m, b, g;
    if (q[4] !== X || q[5] !== Y || q[6] !== K || q[7] !== O.location) {
        let O1 = _wq(X, K, Y),
            T1;
        if (q[25] !== X) T1 = K3(X.getSystemPrompt(), 240), q[25] = X, q[26] = T1;
        else T1 = q[26];
        let N1 = T1,
            j1;
        if (q[27] !== X.whenToUse) j1 = K3(X.whenToUse, 240), q[27] = X.whenToUse, q[28] = j1;
        else j1 = q[28];
        let q1 = j1,
            t = mqz,
            J1;
        if (q[29] !== X.memory) J1 = y2() ? r5.default.createElement(V, null, r5.default.createElement(V, {
            bold: !0
        }, "Memory"), ": ", nO6(X.memory)) : null, q[29] = X.memory, q[30] = J1;
        else J1 = q[30];
        let D1 = J1;
        if (j = AO, N = "Confirm and save", q[31] === Symbol.for("react.memo_cache_sentinel")) T = r5.default.createElement(oA, null, r5.default.createElement(YA, {
            shortcut: "s/Enter",
            action: "save"
        }), r5.default.createElement(YA, {
            shortcut: "e",
            action: "edit in your editor"
        }), r5.default.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })), q[31] = T;
        else T = q[31];
        D = I, k = "column", y = 1;
        let Z1;
        if (q[32] === Symbol.for("react.memo_cache_sentinel")) Z1 = r5.default.createElement(V, {
            bold: !0
        }, "Name"), q[32] = Z1;
        else Z1 = q[32];
        if (q[33] !== X.agentType) B = r5.default.createElement(V, null, Z1, ": ", X.agentType), q[33] = X.agentType, q[34] = B;
        else B = q[34];
        let E1;
        if (q[35] === Symbol.for("react.memo_cache_sentinel")) E1 = r5.default.createElement(V, {
            bold: !0
        }, "Location"), q[35] = E1;
        else E1 = q[35];
        let a;
        if (q[36] !== X.agentType || q[37] !== O.location) a = i2q({
            source: O.location,
            agentType: X.agentType
        }), q[36] = X.agentType, q[37] = O.location, q[38] = a;
        else a = q[38];
        if (q[39] !== a) S = r5.default.createElement(V, null, E1, ":", " ", a), q[39] = a, q[40] = S;
        else S = q[40];
        let A1;
        if (q[41] === Symbol.for("react.memo_cache_sentinel")) A1 = r5.default.createElement(V, {
            bold: !0
        }, "Tools"), q[41] = A1;
        else A1 = q[41];
        let M1;
        if (q[42] !== X.tools) M1 = t(X.tools), q[42] = X.tools, q[43] = M1;
        else M1 = q[43];
        if (q[44] !== M1) m = r5.default.createElement(V, null, A1, ": ", M1), q[44] = M1, q[45] = m;
        else m = q[45];
        let z1;
        if (q[46] === Symbol.for("react.memo_cache_sentinel")) z1 = r5.default.createElement(V, {
            bold: !0
        }, "Model"), q[46] = z1;
        else z1 = q[46];
        let Y1;
        if (q[47] !== X.model) Y1 = pq6(X.model), q[47] = X.model, q[48] = Y1;
        else Y1 = q[48];
        if (q[49] !== Y1) b = r5.default.createElement(V, null, z1, ": ", Y1), q[49] = Y1, q[50] = b;
        else b = q[50];
        if (g = D1, q[51] === Symbol.for("react.memo_cache_sentinel")) M = r5.default.createElement(I, {
            marginTop: 1
        }, r5.default.createElement(V, null, r5.default.createElement(V, {
            bold: !0
        }, "Description"), " (tells Claude when to use this agent):")), q[51] = M;
        else M = q[51];
        if (q[52] !== q1) P = r5.default.createElement(I, {
            marginLeft: 2,
            marginTop: 1
        }, r5.default.createElement(V, null, q1)), q[52] = q1, q[53] = P;
        else P = q[53];
        if (q[54] === Symbol.for("react.memo_cache_sentinel")) W = r5.default.createElement(I, {
            marginTop: 1
        }, r5.default.createElement(V, null, r5.default.createElement(V, {
            bold: !0
        }, "System prompt"), ":")), q[54] = W;
        else W = q[54];
        if (q[55] !== N1) G = r5.default.createElement(I, {
            marginLeft: 2,
            marginTop: 1
        }, r5.default.createElement(V, null, N1)), q[55] = N1, q[56] = G;
        else G = q[56];
        f = O1.warnings.length > 0 && r5.default.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, r5.default.createElement(V, {
            color: "warning"
        }, "Warnings:"), O1.warnings.map(Bqz)), Z = O1.errors.length > 0 && r5.default.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, r5.default.createElement(V, {
            color: "error"
        }, "Errors:"), O1.errors.map(uqz)), q[4] = X, q[5] = Y, q[6] = K, q[7] = O.location, q[8] = D, q[9] = j, q[10] = M, q[11] = P, q[12] = W, q[13] = G, q[14] = f, q[15] = Z, q[16] = N, q[17] = T, q[18] = k, q[19] = y, q[20] = B, q[21] = S, q[22] = m, q[23] = b, q[24] = g
    } else D = q[8], j = q[9], M = q[10], P = q[11], W = q[12], G = q[13], f = q[14], Z = q[15], N = q[16], T = q[17], k = q[18], y = q[19], B = q[20], S = q[21], m = q[22], b = q[23], g = q[24];
    let U;
    if (q[57] !== H) U = H && r5.default.createElement(I, {
        marginTop: 1
    }, r5.default.createElement(V, {
        color: "error"
    }, H)), q[57] = H, q[58] = U;
    else U = q[58];
    let x;
    if (q[59] === Symbol.for("react.memo_cache_sentinel")) x = r5.default.createElement(V, {
        bold: !0
    }, "s"), q[59] = x;
    else x = q[59];
    let p;
    if (q[60] === Symbol.for("react.memo_cache_sentinel")) p = r5.default.createElement(V, {
        bold: !0
    }, "Enter"), q[60] = p;
    else p = q[60];
    let l;
    if (q[61] === Symbol.for("react.memo_cache_sentinel")) l = r5.default.createElement(I, {
        marginTop: 2
    }, r5.default.createElement(V, {
        color: "success"
    }, "Press ", x, " or ", p, " to save,", " ", r5.default.createElement(V, {
        bold: !0
    }, "e"), " to save and edit")), q[61] = l;
    else l = q[61];
    let r;
    if (q[62] !== D || q[63] !== M || q[64] !== P || q[65] !== W || q[66] !== G || q[67] !== f || q[68] !== Z || q[69] !== U || q[70] !== k || q[71] !== y || q[72] !== B || q[73] !== S || q[74] !== m || q[75] !== b || q[76] !== g) r = r5.default.createElement(D, {
        flexDirection: k,
        marginTop: y
    }, B, S, m, b, g, M, P, W, G, f, Z, U, l), q[62] = D, q[63] = M, q[64] = P, q[65] = W, q[66] = G, q[67] = f, q[68] = Z, q[69] = U, q[70] = k, q[71] = y, q[72] = B, q[73] = S, q[74] = m, q[75] = b, q[76] = g, q[77] = r;
    else r = q[77];
    let s;
    if (q[78] !== j || q[79] !== N || q[80] !== T || q[81] !== r) s = r5.default.createElement(j, {
        subtitle: N,
        footerText: T
    }, r), q[78] = j, q[79] = N, q[80] = T, q[81] = r, q[82] = s;
    else s = q[82];
    return s
}
// @from(Ln 426007, Col 0)
function uqz(A, q) {
    return r5.default.createElement(V, {
        key: q,
        color: "error"
    }, " ", "• ", A)
}
// @from(Ln 426014, Col 0)
function Bqz(A, q) {
    return r5.default.createElement(V, {
        key: q,
        dimColor: !0
    }, " ", "• ", A)
}
// @from(Ln 426021, Col 0)
function mqz(A) {
    if (A === void 0) return "All tools";
    if (A.length === 0) return "None";
    if (A.length === 1) return A[0] || "None";
    if (A.length === 2) return A.join(" and ");
    return `${A.slice(0,-1).join(", ")}, and ${A[A.length-1]}`
}
// @from(Ln 426028, Col 4)
r5
// @from(Ln 426029, Col 4)
ywq = v(() => {
    i1();
    xW();
    vq();
    m1();
    K7();
    VE();
    xN();
    QuA();
    gZ1();
    e7();
    wK();
    BK();
    HK();
    gB();
    r5 = o(X1(), 1)
})
// @from(Ln 426047, Col 0)
function Cwq({
    tools: A,
    existingAgents: q,
    onComplete: K
}) {
    let {
        wizardData: Y
    } = dw(), [z, w] = me.useState(null), H = L7(), $ = me.useCallback(async (J) => {
        if (!Y?.finalAgent) return;
        try {
            if (await r2q(Y.location, Y.finalAgent.agentType, Y.finalAgent.whenToUse, Y.finalAgent.tools, Y.finalAgent.getSystemPrompt(), !0, Y.finalAgent.color, Y.finalAgent.model, Y.finalAgent.memory), H((D) => {
                    if (!Y.finalAgent) return D;
                    let j = D.agentDefinitions.allAgents.concat(Y.finalAgent);
                    return {
                        ...D,
                        agentDefinitions: {
                            ...D.agentDefinitions,
                            activeAgents: hh(j),
                            allAgents: j
                        }
                    }
                }), J) {
                let D = RuA({
                    source: Y.location,
                    agentType: Y.finalAgent.agentType
                });
                await KF(D)
            }
            c("tengu_agent_created", {
                agent_type: Y.finalAgent.agentType,
                generation_method: Y.wasGenerated ? "generated" : "manual",
                source: Y.location,
                tool_count: Y.finalAgent.tools?.length ?? "all",
                has_custom_model: !!Y.finalAgent.model,
                has_custom_color: !!Y.finalAgent.color,
                has_memory: !!Y.finalAgent.memory,
                memory_scope: Y.finalAgent.memory ?? "none",
                ...J ? {
                    opened_in_editor: !0
                } : {}
            });
            let X = J ? `Created agent: ${H6.bold(Y.finalAgent.agentType)} and opened in editor. If you made edits, restart to load the latest version.` : `Created agent: ${H6.bold(Y.finalAgent.agentType)}`;
            K(X)
        } catch (X) {
            w(X instanceof Error ? X.message : "Failed to save agent")
        }
    }, [Y, K, H]), O = me.useCallback(() => $(!1), [$]), _ = me.useCallback(() => $(!0), [$]);
    return me.default.createElement(Rwq, {
        tools: A,
        existingAgents: q,
        onSave: O,
        onSaveAndEdit: _,
        error: z
    })
}
// @from(Ln 426102, Col 4)
me
// @from(Ln 426103, Col 4)
Swq = v(() => {
    q3();
    xN();
    ywq();
    gZ1();
    uv();
    YF();
    u6();
    d8();
    me = o(X1(), 1)
})
// @from(Ln 426115, Col 0)
function hwq(A) {
    let q = e(17),
        {
            tools: K,
            existingAgents: Y,
            onComplete: z,
            onCancel: w
        } = A,
        H;
    if (q[0] !== Y) H = () => Pd1.default.createElement(Jwq, {
        existingAgents: Y
    }), q[0] = Y, q[1] = H;
    else H = q[1];
    let $;
    if (q[2] !== K) $ = () => Pd1.default.createElement(Zwq, {
        tools: K
    }), q[2] = K, q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = y2() ? [kwq] : [], q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== Y || q[6] !== z || q[7] !== K) _ = () => Pd1.default.createElement(Cwq, {
        tools: K,
        existingAgents: Y,
        onComplete: z
    }), q[5] = Y, q[6] = z, q[7] = K, q[8] = _;
    else _ = q[8];
    let J;
    if (q[9] !== H || q[10] !== $ || q[11] !== _) J = [Awq, Kwq, $wq, H, Dwq, Mwq, $, Vwq, vwq, ...O, _], q[9] = H, q[10] = $, q[11] = _, q[12] = J;
    else J = q[12];
    let X = J,
        D;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) D = {}, q[13] = D;
    else D = q[13];
    let j;
    if (q[14] !== w || q[15] !== X) j = Pd1.default.createElement(IuA, {
        steps: X,
        initialData: D,
        onComplete: Fqz,
        onCancel: w,
        title: "Create new agent",
        showStepCounter: !1
    }), q[14] = w, q[15] = X, q[16] = j;
    else j = q[16];
    return j
}
// @from(Ln 426163, Col 0)
function Fqz() {}
// @from(Ln 426164, Col 4)
Pd1
// @from(Ln 426165, Col 4)
Iwq = v(() => {
    i1();
    xW();
    xN();
    qwq();
    Ywq();
    Owq();
    Xwq();
    jwq();
    Pwq();
    fwq();
    Nwq();
    Ewq();
    Lwq();
    Swq();
    Pd1 = o(X1(), 1)
})
// @from(Ln 426183, Col 0)
function xwq({
    agent: A,
    tools: q,
    onSaved: K,
    onBack: Y
}) {
    let z = L7(),
        [w, H] = My.useState("menu"),
        [$, O] = My.useState(0),
        [_, J] = My.useState(null),
        [X, D] = My.useState(A.color),
        j = My.useCallback(async () => {
            try {
                let Z = hN6(A);
                await KF(Z), K(`Opened ${A.agentType} in editor. If you made edits, restart to load the latest version.`)
            } catch (Z) {
                J(Z instanceof Error ? Z.message : "Failed to open editor")
            }
        }, [A, K]),
        M = My.useCallback(async (Z = {}) => {
            let {
                tools: N,
                color: T,
                model: k
            } = Z, y = T ?? X, B = N !== void 0, S = k !== void 0, m = y !== A.color;
            if (!B && !S && !m) return !1;
            try {
                if (!GJ6(A) && !ZJ6(A)) return !1;
                if (await o2q(A, A.whenToUse, N ?? A.tools, A.getSystemPrompt(), y, k ?? A.model), m && y) xK1(A.agentType, y);
                return z((b) => {
                    let g = b.agentDefinitions.allAgents.map((U) => U.agentType === A.agentType ? {
                        ...U,
                        tools: N ?? U.tools,
                        color: y,
                        model: k ?? U.model
                    } : U);
                    return {
                        ...b,
                        agentDefinitions: {
                            ...b.agentDefinitions,
                            activeAgents: hh(g),
                            allAgents: g
                        }
                    }
                }), K(`Updated agent: ${H6.bold(A.agentType)}`), !0
            } catch (b) {
                return J(b instanceof Error ? b.message : "Failed to save agent"), !1
            }
        }, [A, X, K, z]),
        P = My.useMemo(() => [{
            label: "Open in editor",
            action: j
        }, {
            label: "Edit tools",
            action: () => H("edit-tools")
        }, {
            label: "Edit model",
            action: () => H("edit-model")
        }, {
            label: "Edit color",
            action: () => H("edit-color")
        }], [j]),
        W = My.useCallback(() => {
            if (J(null), w === "menu") Y();
            else H("menu")
        }, [w, Y]),
        G = My.useCallback((Z) => {
            if (Z.upArrow) O((N) => Math.max(0, N - 1));
            else if (Z.downArrow) O((N) => Math.min(P.length - 1, N + 1));
            else if (Z.return) {
                let N = P[$];
                if (N) N.action()
            }
        }, [P, $]);
    DA("confirm:no", W, {
        context: "Confirmation"
    }), D8((Z, N) => {
        if (w === "menu") G(N)
    });
    let f = () => $0.createElement(I, {
        flexDirection: "column"
    }, $0.createElement(V, {
        dimColor: !0
    }, "Source: ", UZ1(A.source)), $0.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, P.map((Z, N) => $0.createElement(V, {
        key: Z.label,
        color: N === $ ? "suggestion" : void 0
    }, N === $ ? `${l1.pointer} ` : "  ", Z.label))), _ && $0.createElement(I, {
        marginTop: 1
    }, $0.createElement(V, {
        color: "error"
    }, _)));
    switch (w) {
        case "menu":
            return f();
        case "edit-tools":
            return $0.createElement(bN6, {
                tools: q,
                initialTools: A.tools,
                onComplete: async (Z) => {
                    H("menu"), await M({
                        tools: Z
                    })
                }
            });
        case "edit-color":
            return $0.createElement(BN6, {
                agentName: A.agentType,
                currentColor: X || A.color || "automatic",
                onConfirm: async (Z) => {
                    D(Z), H("menu"), await M({
                        color: Z
                    })
                }
            });
        case "edit-model":
            return $0.createElement(uN6, {
                initialModel: A.model,
                onComplete: async (Z) => {
                    H("menu"), await M({
                        model: Z
                    })
                }
            });
        default:
            return null
    }
}
// @from(Ln 426313, Col 4)
$0
// @from(Ln 426313, Col 8)
My
// @from(Ln 426314, Col 4)
bwq = v(() => {
    m1();
    K7();
    q3();
    uv();
    UuA();
    duA();
    puA();
    gZ1();
    YF();
    lM();
    b7();
    xN6();
    d8();
    $0 = o(X1(), 1), My = o(X1(), 1)
})
// @from(Ln 426331, Col 0)
function uwq(A) {
    let q = e(47),
        {
            agent: K,
            tools: Y,
            onBack: z
        } = A,
        w = qs(K, Y, !1),
        H;
    if (q[0] !== K) H = n2q(K), q[0] = K, q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] !== K.agentType) O = IK1(K.agentType), q[2] = K.agentType, q[3] = O;
    else O = q[3];
    let _ = O,
        J;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Confirmation"
    }, q[4] = J;
    else J = q[4];
    DA("confirm:no", z, J);
    let X;
    if (q[5] !== z) X = (r, s) => {
        if (s.return) z()
    }, q[5] = z, q[6] = X;
    else X = q[6];
    D8(X);
    let D = function() {
            if (w.hasWildcard) return Y4.createElement(V, null, "All tools");
            if (!K.tools || K.tools.length === 0) return Y4.createElement(V, null, "None");
            return Y4.createElement(Y4.Fragment, null, w.validTools.length > 0 && Y4.createElement(V, null, w.validTools.join(", ")), w.invalidTools.length > 0 && Y4.createElement(V, {
                color: "warning"
            }, l1.warning, " Unrecognized:", " ", w.invalidTools.join(", ")))
        },
        j = I,
        M = "column",
        P = 1,
        W;
    if (q[7] !== $) W = Y4.createElement(V, {
        dimColor: !0
    }, $), q[7] = $, q[8] = W;
    else W = q[8];
    let G;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) G = Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Description"), " (tells Claude when to use this agent):"), q[9] = G;
    else G = q[9];
    let f;
    if (q[10] !== K.whenToUse) f = Y4.createElement(I, {
        flexDirection: "column"
    }, G, Y4.createElement(I, {
        marginLeft: 2
    }, Y4.createElement(V, null, K.whenToUse))), q[10] = K.whenToUse, q[11] = f;
    else f = q[11];
    let Z = I,
        N;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) N = Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Tools"), ":", " "), q[12] = N;
    else N = q[12];
    let T = D(),
        k;
    if (q[13] !== Z || q[14] !== N || q[15] !== T) k = Y4.createElement(Z, null, N, T), q[13] = Z, q[14] = N, q[15] = T, q[16] = k;
    else k = q[16];
    let y;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) y = Y4.createElement(V, {
        bold: !0
    }, "Model"), q[17] = y;
    else y = q[17];
    let B;
    if (q[18] !== K.model) B = pq6(K.model), q[18] = K.model, q[19] = B;
    else B = q[19];
    let S;
    if (q[20] !== B) S = Y4.createElement(V, null, y, ": ", B), q[20] = B, q[21] = S;
    else S = q[21];
    let m;
    if (q[22] !== K.permissionMode) m = K.permissionMode && Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Permission mode"), ": ", K.permissionMode), q[22] = K.permissionMode, q[23] = m;
    else m = q[23];
    let b;
    if (q[24] !== K.memory) b = K.memory && Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Memory"), ": ", nO6(K.memory)), q[24] = K.memory, q[25] = b;
    else b = q[25];
    let g;
    if (q[26] !== K.hooks) g = K.hooks && Object.keys(K.hooks).length > 0 && Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Hooks"), ": ", Object.keys(K.hooks).join(", ")), q[26] = K.hooks, q[27] = g;
    else g = q[27];
    let U;
    if (q[28] !== K.skills) U = K.skills && K.skills.length > 0 && Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Skills"), ":", " ", K.skills.length > 10 ? `${K.skills.length} skills` : K.skills.join(", ")), q[28] = K.skills, q[29] = U;
    else U = q[29];
    let x;
    if (q[30] !== K.agentType || q[31] !== _) x = _ && Y4.createElement(I, null, Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "Color"), ":", " ", Y4.createElement(V, {
        backgroundColor: _,
        color: "inverseText"
    }, " ", K.agentType, " "))), q[30] = K.agentType, q[31] = _, q[32] = x;
    else x = q[32];
    let p;
    if (q[33] !== K) p = !iD(K) && Y4.createElement(Y4.Fragment, null, Y4.createElement(I, null, Y4.createElement(V, null, Y4.createElement(V, {
        bold: !0
    }, "System prompt"), ":")), Y4.createElement(I, {
        marginLeft: 2,
        marginRight: 2
    }, Y4.createElement(TJ, null, K.getSystemPrompt()))), q[33] = K, q[34] = p;
    else p = q[34];
    let l;
    if (q[35] !== j || q[36] !== k || q[37] !== S || q[38] !== m || q[39] !== b || q[40] !== g || q[41] !== U || q[42] !== x || q[43] !== p || q[44] !== W || q[45] !== f) l = Y4.createElement(j, {
        flexDirection: M,
        gap: P
    }, W, f, k, S, m, b, g, U, x, p), q[35] = j, q[36] = k, q[37] = S, q[38] = m, q[39] = b, q[40] = g, q[41] = U, q[42] = x, q[43] = p, q[44] = W, q[45] = f, q[46] = l;
    else l = q[46];
    return l
}
// @from(Ln 426451, Col 4)
Y4
// @from(Ln 426452, Col 4)
Bwq = v(() => {
    i1();
    m1();
    b7();
    uv();
    bK1();
    uh();
    gZ1();
    lM();
    e7();
    gB();
    K7();
    Y4 = o(X1(), 1)
})
// @from(Ln 426467, Col 0)
function dZ1(A) {
    let q = e(2),
        {
            instructions: K
        } = A,
        Y = K === void 0 ? "Press ↑↓ to navigate · Enter to select · Esc to go back" : K,
        z = uq(),
        w = z.pending ? `Press ${z.keyName} again to exit` : Y,
        H;
    if (q[0] !== w) H = Wd1.createElement(I, {
        marginLeft: 3
    }, Wd1.createElement(V, {
        dimColor: !0
    }, w)), q[0] = w, q[1] = H;
    else H = q[1];
    return H
}
// @from(Ln 426484, Col 4)
Wd1
// @from(Ln 426485, Col 4)
mwq = v(() => {
    i1();
    m1();
    R2();
    Wd1 = o(X1(), 1)
})
// @from(Ln 426492, Col 0)
function Qqz(A, q, K) {
    return Sx([...A, ...q], "name")
}
// @from(Ln 426496, Col 0)
function mN6(A, q, K) {
    return Fwq.useMemo(() => {
        let Y = YP6(K, q);
        return Qqz(A, Y, K.mode)
    }, [A, q, K])
}
// @from(Ln 426502, Col 4)
Fwq
// @from(Ln 426503, Col 4)
cuA = v(() => {
    H21();
    $P();
    mj1();
    Fwq = o(X1(), 1)
})
// @from(Ln 426510, Col 0)
function Qwq({
    tools: A,
    onExit: q
}) {
    let [K, Y] = Fe.useState({
        mode: "list-agents",
        source: "all"
    }), z = v6((W) => W.agentDefinitions), w = v6((W) => W.mcp.tools), H = v6((W) => W.toolPermissionContext), $ = L7(), {
        allAgents: O,
        activeAgents: _
    } = z, [J, X] = Fe.useState([]), D = mN6(A, w, H);
    uq();
    let j = Fe.useMemo(() => ({
        "built-in": O.filter((W) => W.source === "built-in"),
        userSettings: O.filter((W) => W.source === "userSettings"),
        projectSettings: O.filter((W) => W.source === "projectSettings"),
        policySettings: O.filter((W) => W.source === "policySettings"),
        localSettings: O.filter((W) => W.source === "localSettings"),
        flagSettings: O.filter((W) => W.source === "flagSettings"),
        plugin: O.filter((W) => W.source === "plugin"),
        all: O
    }), [O]);
    DA("confirm:no", () => {
        let W = J.length > 0 ? `Agent changes:
${J.join(`
`)}` : void 0;
        q(W ?? "Agents dialog dismissed", {
            display: J.length === 0 ? "system" : void 0
        })
    }, {
        context: "Confirmation",
        isActive: K.mode === "list-agents"
    }), DA("confirm:no", () => {
        if ("previousMode" in K) Y(K.previousMode)
    }, {
        context: "Confirmation",
        isActive: K.mode !== "list-agents" && K.mode !== "create-agent" && K.mode !== "view-agent" && "previousMode" in K
    });
    let M = Fe.useCallback((W) => {
            X((G) => [...G, W]), Y({
                mode: "list-agents",
                source: "all"
            })
        }, []),
        P = Fe.useCallback(async (W) => {
            try {
                await a2q(W), $((G) => {
                    let f = G.agentDefinitions.allAgents.filter((Z) => !(Z.agentType === W.agentType && Z.source === W.source));
                    return {
                        ...G,
                        agentDefinitions: {
                            ...G.agentDefinitions,
                            allAgents: f,
                            activeAgents: hh(f)
                        }
                    }
                }), X((G) => [...G, `Deleted agent: ${H6.bold(W.agentType)}`]), Y({
                    mode: "list-agents",
                    source: "all"
                })
            } catch (G) {
                K1(G instanceof Error ? G : Error("Failed to delete agent"))
            }
        }, []);
    switch (K.mode) {
        case "list-agents": {
            let W = K.source === "all" ? [...j["built-in"], ...j.userSettings, ...j.projectSettings, ...j.policySettings, ...j.flagSettings, ...j.plugin] : j[K.source],
                G = new Map;
            _.forEach((Z) => G.set(Z.agentType, Z));
            let f = W.map((Z) => {
                let N = G.get(Z.agentType),
                    T = N && N.source !== Z.source ? N.source : void 0;
                return {
                    ...Z,
                    overriddenBy: T
                }
            });
            return F4.createElement(F4.Fragment, null, F4.createElement(s2q, {
                source: K.source,
                agents: f,
                onBack: () => {
                    let Z = J.length > 0 ? `Agent changes:
${J.join(`
`)}` : void 0;
                    q(Z ?? "Agents dialog dismissed", {
                        display: J.length === 0 ? "system" : void 0
                    })
                },
                onSelect: (Z) => Y({
                    mode: "agent-menu",
                    agent: Z,
                    previousMode: K
                }),
                onCreateNew: () => Y({
                    mode: "create-agent"
                }),
                changes: J
            }), F4.createElement(dZ1, null))
        }
        case "create-agent":
            return F4.createElement(hwq, {
                tools: D,
                existingAgents: _,
                onComplete: M,
                onCancel: () => Y({
                    mode: "list-agents",
                    source: "all"
                })
            });
        case "agent-menu": {
            let G = O.find((T) => T.agentType === K.agent.agentType && T.source === K.agent.source) || K.agent,
                f = G.source === "built-in",
                Z = [{
                    label: "View agent",
                    value: "view"
                }, ...!f ? [{
                    label: "Edit agent",
                    value: "edit"
                }, {
                    label: "Delete agent",
                    value: "delete"
                }] : [], {
                    label: "Back",
                    value: "back"
                }],
                N = (T) => {
                    switch (T) {
                        case "view":
                            Y({
                                mode: "view-agent",
                                agent: G,
                                previousMode: K.previousMode
                            });
                            break;
                        case "edit":
                            Y({
                                mode: "edit-agent",
                                agent: G,
                                previousMode: K
                            });
                            break;
                        case "delete":
                            Y({
                                mode: "delete-confirm",
                                agent: G,
                                previousMode: K
                            });
                            break;
                        case "back":
                            Y(K.previousMode);
                            break
                    }
                };
            return F4.createElement(F4.Fragment, null, F4.createElement(he, {
                title: K.agent.agentType
            }, F4.createElement(I, {
                flexDirection: "column",
                marginTop: 1
            }, F4.createElement(kA, {
                options: Z,
                onChange: N,
                onCancel: () => Y(K.previousMode)
            }), J.length > 0 && F4.createElement(I, {
                marginTop: 1
            }, F4.createElement(V, {
                dimColor: !0
            }, J[J.length - 1])))), F4.createElement(dZ1, null))
        }
        case "view-agent": {
            let G = O.find((f) => f.agentType === K.agent.agentType && f.source === K.agent.source) || K.agent;
            return F4.createElement(F4.Fragment, null, F4.createElement(he, {
                title: G.agentType
            }, F4.createElement(uwq, {
                agent: G,
                tools: D,
                allAgents: O,
                onBack: () => Y({
                    mode: "agent-menu",
                    agent: G,
                    previousMode: K.previousMode
                })
            })), F4.createElement(dZ1, {
                instructions: "Press Enter or Esc to go back"
            }))
        }
        case "delete-confirm": {
            let W = [{
                label: "Yes, delete",
                value: "yes"
            }, {
                label: "No, cancel",
                value: "no"
            }];
            return F4.createElement(F4.Fragment, null, F4.createElement(he, {
                title: "Delete agent",
                titleColor: "error",
                borderColor: "error"
            }, F4.createElement(V, null, "Are you sure you want to delete the agent", " ", F4.createElement(V, {
                bold: !0
            }, K.agent.agentType), "?"), F4.createElement(I, {
                marginTop: 1
            }, F4.createElement(V, {
                dimColor: !0
            }, "Source: ", K.agent.source)), F4.createElement(I, {
                marginTop: 1
            }, F4.createElement(kA, {
                options: W,
                onChange: (G) => {
                    if (G === "yes") P(K.agent);
                    else if ("previousMode" in K) Y(K.previousMode)
                },
                onCancel: () => {
                    if ("previousMode" in K) Y(K.previousMode)
                }
            }))), F4.createElement(dZ1, {
                instructions: "Press ↑↓ to navigate, Enter to select, Esc to cancel"
            }))
        }
        case "edit-agent": {
            let G = O.find((f) => f.agentType === K.agent.agentType && f.source === K.agent.source) || K.agent;
            return F4.createElement(F4.Fragment, null, F4.createElement(he, {
                title: `Edit agent: ${G.agentType}`
            }, F4.createElement(xwq, {
                agent: G,
                tools: D,
                onSaved: (f) => {
                    M(f), Y(K.previousMode)
                },
                onBack: () => Y(K.previousMode)
            })), F4.createElement(dZ1, null))
        }
        default:
            return null
    }
}
// @from(Ln 426745, Col 4)
F4
// @from(Ln 426745, Col 8)
Fe
// @from(Ln 426746, Col 4)
gwq = v(() => {
    m1();
    K7();
    q3();
    R2();
    uv();
    gZ1();
    U5();
    t2q();
    Iwq();
    bwq();
    Bwq();
    y6();
    mwq();
    SuA();
    d8();
    cuA();
    F4 = o(X1(), 1), Fe = o(X1(), 1)
})
// @from(Ln 426765, Col 4)
Uwq = {}
// @from(Ln 426769, Col 0)
async function gqz(A, q) {
    let Y = (await q.getAppState()).toolPermissionContext,
        z = tD(Y);
    return luA.createElement(Qwq, {
        tools: z,
        onExit: A
    })
}
// @from(Ln 426777, Col 4)
luA
// @from(Ln 426778, Col 4)
pwq = v(() => {
    gwq();
    $P();
    luA = o(X1(), 1)
})
// @from(Ln 426783, Col 4)
Uqz
// @from(Ln 426783, Col 9)
dwq
// @from(Ln 426784, Col 4)
cwq = v(() => {
    Uqz = {
        type: "local-jsx",
        name: "agents",
        description: "Manage agent configurations",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (pwq(), Uwq)),
        userFacingName() {
            return "agents"
        }
    }, dwq = Uqz
})
// @from(Ln 426797, Col 4)
lwq = {}
// @from(Ln 426801, Col 0)
async function pqz(A, q, K) {
    return iuA.createElement(TKq, {
        onComplete: A,
        args: K
    })
}
// @from(Ln 426807, Col 4)
iuA
// @from(Ln 426808, Col 4)
iwq = v(() => {
    FxA();
    iuA = o(X1(), 1)
})
// @from(Ln 426812, Col 4)
dqz
// @from(Ln 426812, Col 9)
nwq
// @from(Ln 426813, Col 4)
rwq = v(() => {
    dqz = {
        type: "local-jsx",
        name: "plugin",
        aliases: ["plugins", "marketplace"],
        description: "Manage Claude Code plugins",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (iwq(), lwq)),
        userFacingName() {
            return "plugin"
        }
    }, nwq = dqz
})
// @from(Ln 426827, Col 4)
owq = {}
// @from(Ln 426831, Col 0)
async function cqz(A, q) {
    if (u8("rewind"), q.openMessageSelector) q.openMessageSelector();
    return {
        type: "skip"
    }
}
// @from(Ln 426837, Col 4)
awq = v(() => {
    v3()
})
// @from(Ln 426840, Col 4)
lqz
// @from(Ln 426840, Col 9)
swq
// @from(Ln 426841, Col 4)
twq = v(() => {
    lqz = {
        description: "Restore the code and/or conversation to a previous point",
        name: "rewind",
        aliases: ["checkpoint"],
        userFacingName: () => "rewind",
        argumentHint: "",
        isEnabled: () => !0,
        type: "local",
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (awq(), owq))
    }, swq = lqz
})
// @from(Ln 426855, Col 4)
ewq = () => {}
// @from(Ln 426856, Col 4)
AHq = () => {}
// @from(Ln 426857, Col 4)
qHq = () => {}
// @from(Ln 426858, Col 4)
KHq = v(() => {
    B6()
})
// @from(Ln 426861, Col 4)
YHq = () => {}
// @from(Ln 426863, Col 0)
function zHq() {
    let A = e(3),
        q = b8.isSandboxingEnabled(),
        K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        let w = b8.checkDependencies();
        K = w.warnings.length > 0 ? SK.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, w.warnings.map(iqz)) : null, A[0] = K
    } else K = A[0];
    let Y = K;
    if (!q) {
        let w;
        if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = SK.createElement(I, {
            flexDirection: "column",
            paddingY: 1
        }, SK.createElement(V, {
            color: "subtle"
        }, "Sandbox is not enabled"), Y), A[1] = w;
        else w = A[1];
        return w
    }
    let z;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) {
        let w = b8.getFsReadConfig(),
            H = b8.getFsWriteConfig(),
            $ = b8.getNetworkRestrictionConfig(),
            O = b8.getAllowUnixSockets(),
            _ = b8.getExcludedCommands(),
            J = b8.getLinuxGlobPatternWarnings();
        z = SK.createElement(I, {
            flexDirection: "column",
            paddingY: 1
        }, SK.createElement(I, {
            flexDirection: "column"
        }, SK.createElement(V, {
            bold: !0,
            color: "permission"
        }, "Excluded Commands:"), SK.createElement(V, {
            dimColor: !0
        }, _.length > 0 ? _.join(", ") : "None")), w.denyOnly.length > 0 && SK.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, SK.createElement(V, {
            bold: !0,
            color: "permission"
        }, "Filesystem Read Restrictions:"), SK.createElement(V, {
            dimColor: !0
        }, "Denied: ", w.denyOnly.join(", "))), H.allowOnly.length > 0 && SK.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, SK.createElement(V, {
            bold: !0,
            color: "permission"
        }, "Filesystem Write Restrictions:"), SK.createElement(V, {
            dimColor: !0
        }, "Allowed: ", H.allowOnly.join(", ")), H.denyWithinAllow.length > 0 && SK.createElement(V, {
            dimColor: !0
        }, "Denied within allowed: ", H.denyWithinAllow.join(", "))), ($.allowedHosts && $.allowedHosts.length > 0 || $.deniedHosts && $.deniedHosts.length > 0) && SK.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, SK.createElement(V, {
            bold: !0,
            color: "permission"
        }, "Network Restrictions", KC1() ? " (Managed)" : "", ":"), $.allowedHosts && $.allowedHosts.length > 0 && SK.createElement(V, {
            dimColor: !0
        }, "Allowed: ", $.allowedHosts.join(", ")), $.deniedHosts && $.deniedHosts.length > 0 && SK.createElement(V, {
            dimColor: !0
        }, "Denied: ", $.deniedHosts.join(", "))), O && O.length > 0 && SK.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, SK.createElement(V, {
            bold: !0,
            color: "permission"
        }, "Allowed Unix Sockets:"), SK.createElement(V, {
            dimColor: !0
        }, O.join(", "))), J.length > 0 && SK.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, SK.createElement(V, {
            bold: !0,
            color: "warning"
        }, "⚠ Warning: Glob patterns not fully supported on Linux"), SK.createElement(V, {
            dimColor: !0
        }, "The following patterns will be ignored:", " ", J.slice(0, 3).join(", "), J.length > 3 && ` (${J.length-3} more)`)), Y), A[2] = z
    } else z = A[2];
    return z
}
// @from(Ln 426953, Col 0)
function iqz(A, q) {
    return SK.createElement(V, {
        key: q,
        dimColor: !0
    }, A)
}
// @from(Ln 426959, Col 4)
SK
// @from(Ln 426960, Col 4)
wHq = v(() => {
    i1();
    m1();
    k2();
    SK = o(X1(), 1)
})
// @from(Ln 426967, Col 0)
function HHq(A) {
    let q = e(26),
        {
            onComplete: K
        } = A,
        [Y] = T7(),
        z = b8.isSandboxingEnabled(),
        w = b8.areUnsandboxedCommandsAllowed(),
        H = b8.areSandboxSettingsLockedByPolicy(),
        $ = w ? "open" : "closed",
        O;
    if (q[0] !== Y) O = k8("success", Y)("(current)"), q[0] = Y, q[1] = O;
    else O = q[1];
    let _ = O,
        J = $ === "open" ? `Allow unsandboxed fallback ${_}` : "Allow unsandboxed fallback",
        X;
    if (q[2] !== J) X = {
        label: J,
        value: "open"
    }, q[2] = J, q[3] = X;
    else X = q[3];
    let D = $ === "closed" ? `Strict sandbox mode ${_}` : "Strict sandbox mode",
        j;
    if (q[4] !== D) j = {
        label: D,
        value: "closed"
    }, q[4] = D, q[5] = j;
    else j = q[5];
    let M;
    if (q[6] !== X || q[7] !== j) M = [X, j], q[6] = X, q[7] = j, q[8] = M;
    else M = q[8];
    let P = M,
        W;
    if (q[9] !== K) W = async function(m) {
        let b = m;
        await b8.setSandboxSettings({
            allowUnsandboxedCommands: b === "open"
        }), K(b === "open" ? "✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary" : "✓ Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option")
    }, q[9] = K, q[10] = W;
    else W = q[10];
    let G = W;
    if (!z) {
        let S;
        if (q[11] === Symbol.for("react.memo_cache_sentinel")) S = Cj.default.createElement(I, {
            flexDirection: "column",
            paddingY: 1
        }, Cj.default.createElement(V, {
            color: "subtle"
        }, "Sandbox is not enabled. Enable sandbox to configure override settings.")), q[11] = S;
        else S = q[11];
        return S
    }
    if (H) {
        let S;
        if (q[12] === Symbol.for("react.memo_cache_sentinel")) S = Cj.default.createElement(V, {
            color: "subtle"
        }, "Override settings are managed by a higher-priority configuration and cannot be changed locally."), q[12] = S;
        else S = q[12];
        let m;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) m = Cj.default.createElement(I, {
            flexDirection: "column",
            paddingY: 1
        }, S, Cj.default.createElement(I, {
            marginTop: 1
        }, Cj.default.createElement(V, {
            dimColor: !0
        }, "Current setting:", " ", $ === "closed" ? "Strict sandbox mode" : "Allow unsandboxed fallback"))), q[13] = m;
        else m = q[13];
        return m
    }
    let f;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) f = Cj.default.createElement(I, {
        marginBottom: 1
    }, Cj.default.createElement(V, {
        bold: !0
    }, "Configure Overrides:")), q[14] = f;
    else f = q[14];
    let Z;
    if (q[15] !== K) Z = () => K(void 0, {
        display: "skip"
    }), q[15] = K, q[16] = Z;
    else Z = q[16];
    let N;
    if (q[17] !== G || q[18] !== P || q[19] !== Z) N = Cj.default.createElement(kA, {
        options: P,
        onChange: G,
        onCancel: Z
    }), q[17] = G, q[18] = P, q[19] = Z, q[20] = N;
    else N = q[20];
    let T;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) T = Cj.default.createElement(V, {
        dimColor: !0
    }, Cj.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Allow unsandboxed fallback:"), " ", "When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions)."), q[21] = T;
    else T = q[21];
    let k;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) k = Cj.default.createElement(V, {
        dimColor: !0
    }, Cj.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Strict sandbox mode:"), " ", "All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands."), q[22] = k;
    else k = q[22];
    let y;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) y = Cj.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, T, k, Cj.default.createElement(V, {
        dimColor: !0
    }, "Learn more:", " ", Cj.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing"
    }, "code.claude.com/docs/en/sandboxing#configure-sandboxing"))), q[23] = y;
    else y = q[23];
    let B;
    if (q[24] !== N) B = Cj.default.createElement(I, {
        flexDirection: "column",
        paddingY: 1
    }, f, N, y), q[24] = N, q[25] = B;
    else B = q[25];
    return B
}
// @from(Ln 427091, Col 4)
Cj
// @from(Ln 427092, Col 4)
$Hq = v(() => {
    i1();
    m1();
    U5();
    k2();
    m1();
    Cj = o(X1(), 1)
})
// @from(Ln 427101, Col 0)
function nuA(A) {
    let q = e(31),
        {
            depCheck: K
        } = A,
        Y;
    if (q[0] !== K.errors) Y = K.errors.some(rqz), q[0] = K.errors, q[1] = Y;
    else Y = q[1];
    let z = Y,
        w;
    if (q[2] !== K.errors) w = K.errors.some(nqz), q[2] = K.errors, q[3] = w;
    else w = q[3];
    let H = w,
        $ = K.warnings.length > 0,
        O, _;
    if (q[4] !== z) O = UJ.default.createElement(V, null, "bubblewrap (bwrap):", " ", z ? UJ.default.createElement(V, {
        color: "error"
    }, "not installed") : UJ.default.createElement(V, {
        color: "success"
    }, "installed")), _ = z && UJ.default.createElement(V, {
        dimColor: !0
    }, "  ", "· apt install bubblewrap"), q[4] = z, q[5] = O, q[6] = _;
    else O = q[5], _ = q[6];
    let J;
    if (q[7] !== O || q[8] !== _) J = UJ.default.createElement(I, {
        flexDirection: "column"
    }, O, _), q[7] = O, q[8] = _, q[9] = J;
    else J = q[9];
    let X, D;
    if (q[10] !== H) X = UJ.default.createElement(V, null, "socat:", " ", H ? UJ.default.createElement(V, {
        color: "error"
    }, "not installed") : UJ.default.createElement(V, {
        color: "success"
    }, "installed")), D = H && UJ.default.createElement(V, {
        dimColor: !0
    }, "  ", "· apt install socat"), q[10] = H, q[11] = X, q[12] = D;
    else X = q[11], D = q[12];
    let j;
    if (q[13] !== X || q[14] !== D) j = UJ.default.createElement(I, {
        flexDirection: "column"
    }, X, D), q[13] = X, q[14] = D, q[15] = j;
    else j = q[15];
    let M, P;
    if (q[16] !== $) P = $ ? UJ.default.createElement(V, {
        color: "warning"
    }, "not installed") : UJ.default.createElement(V, {
        color: "success"
    }, "installed"), M = $ && UJ.default.createElement(V, {
        dimColor: !0
    }, " (required to block unix domain sockets)"), q[16] = $, q[17] = M, q[18] = P;
    else M = q[17], P = q[18];
    let W;
    if (q[19] !== M || q[20] !== P) W = UJ.default.createElement(V, null, "seccomp filter:", " ", P, M), q[19] = M, q[20] = P, q[21] = W;
    else W = q[21];
    let G;
    if (q[22] !== $) G = $ && UJ.default.createElement(I, {
        flexDirection: "column"
    }, UJ.default.createElement(V, {
        dimColor: !0
    }, "  ", "· npm install -g @anthropic-ai/sandbox-runtime"), UJ.default.createElement(V, {
        dimColor: !0
    }, "  ", "· or copy vendor/seccomp/* from sandbox-runtime and set"), UJ.default.createElement(V, {
        dimColor: !0
    }, "    ", "sandbox.seccomp.bpfPath and applyPath in settings.json")), q[22] = $, q[23] = G;
    else G = q[23];
    let f;
    if (q[24] !== W || q[25] !== G) f = UJ.default.createElement(I, {
        flexDirection: "column"
    }, W, G), q[24] = W, q[25] = G, q[26] = f;
    else f = q[26];
    let Z;
    if (q[27] !== f || q[28] !== J || q[29] !== j) Z = UJ.default.createElement(I, {
        flexDirection: "column",
        paddingY: 1,
        gap: 1
    }, J, j, f), q[27] = f, q[28] = J, q[29] = j, q[30] = Z;
    else Z = q[30];
    return Z
}
// @from(Ln 427181, Col 0)
function nqz(A) {
    return A.includes("socat")
}
// @from(Ln 427185, Col 0)
function rqz(A) {
    return A.includes("bwrap")
}
// @from(Ln 427188, Col 4)
UJ
// @from(Ln 427189, Col 4)
OHq = v(() => {
    i1();
    m1();
    UJ = o(X1(), 1)
})
// @from(Ln 427195, Col 0)
function _Hq(A) {
    let q = e(43),
        {
            onComplete: K,
            depCheck: Y
        } = A,
        [z] = T7(),
        w = b8.isSandboxingEnabled(),
        H = b8.isAutoAllowBashIfSandboxedEnabled(),
        $ = Y.warnings.length > 0,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = C8(), q[0] = O;
    else O = q[0];
    let J = O.sandbox?.network?.allowAllUnixSockets,
        X = $ && !J,
        j = (() => {
            if (!w) return "disabled";
            if (H) return "auto-allow";
            return "regular"
        })(),
        M;
    if (q[1] !== z) M = k8("success", z)("(current)"), q[1] = z, q[2] = M;
    else M = q[2];
    let P = M,
        W = j === "auto-allow" ? `Sandbox BashTool, with auto-allow ${P}` : "Sandbox BashTool, with auto-allow",
        G;
    if (q[3] !== W) G = {
        label: W,
        value: "auto-allow"
    }, q[3] = W, q[4] = G;
    else G = q[4];
    let f = j === "regular" ? `Sandbox BashTool, with regular permissions ${P}` : "Sandbox BashTool, with regular permissions",
        Z;
    if (q[5] !== f) Z = {
        label: f,
        value: "regular"
    }, q[5] = f, q[6] = Z;
    else Z = q[6];
    let N = j === "disabled" ? `No Sandbox ${P}` : "No Sandbox",
        T;
    if (q[7] !== N) T = {
        label: N,
        value: "disabled"
    }, q[7] = N, q[8] = T;
    else T = q[8];
    let k;
    if (q[9] !== G || q[10] !== Z || q[11] !== T) k = [G, Z, T], q[9] = G, q[10] = Z, q[11] = T, q[12] = k;
    else k = q[12];
    let y = k,
        B;
    if (q[13] !== K) B = async function(a) {
        let A1 = a;
        A: switch (A1) {
            case "auto-allow": {
                await b8.setSandboxSettings({
                    enabled: !0,
                    autoAllowBashIfSandboxed: !0
                }), K("✓ Sandbox enabled with auto-allow for bash commands");
                break A
            }
            case "regular": {
                await b8.setSandboxSettings({
                    enabled: !0,
                    autoAllowBashIfSandboxed: !1
                }), K("✓ Sandbox enabled with regular bash permissions");
                break A
            }
            case "disabled":
                await b8.setSandboxSettings({
                    enabled: !1,
                    autoAllowBashIfSandboxed: !1
                }), K("○ Sandbox disabled")
        }
    }, q[13] = K, q[14] = B;
    else B = q[14];
    let S = B,
        m;
    if (q[15] !== K) m = {
        "confirm:no": () => K(void 0, {
            display: "skip"
        })
    }, q[15] = K, q[16] = m;
    else m = q[16];
    let b;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) b = {
        context: "Settings"
    }, q[17] = b;
    else b = q[17];
    c7(m, b);
    let g;
    if (q[18] !== X) g = X && eO.default.createElement(I, {
        marginBottom: 1
    }, eO.default.createElement(V, {
        color: "warning"
    }, "Cannot block unix domain sockets (see Dependencies tab)")), q[18] = X, q[19] = g;
    else g = q[19];
    let U;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) U = eO.default.createElement(I, {
        marginBottom: 1
    }, eO.default.createElement(V, {
        bold: !0
    }, "Configure Mode:")), q[20] = U;
    else U = q[20];
    let x;
    if (q[21] !== K) x = () => K(void 0, {
        display: "skip"
    }), q[21] = K, q[22] = x;
    else x = q[22];
    let p;
    if (q[23] !== S || q[24] !== y || q[25] !== x) p = eO.default.createElement(kA, {
        options: y,
        onChange: S,
        onCancel: x
    }), q[23] = S, q[24] = y, q[25] = x, q[26] = p;
    else p = q[26];
    let l;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) l = eO.default.createElement(V, {
        dimColor: !0
    }, eO.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, "Auto-allow mode:"), " ", "Commands will try to run in the sandbox automatically, and attempts to run outside of the sandbox fallback to regular permissions. Explicit ask/deny rules are always respected."), q[27] = l;
    else l = q[27];
    let r;
    if (q[28] === Symbol.for("react.memo_cache_sentinel")) r = eO.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, l, eO.default.createElement(V, {
        dimColor: !0
    }, "Learn more:", " ", eO.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/sandboxing"
    }, "code.claude.com/docs/en/sandboxing"))), q[28] = r;
    else r = q[28];
    let s;
    if (q[29] !== g || q[30] !== p) s = eO.default.createElement(LH, {
        key: "mode",
        title: "Mode"
    }, eO.default.createElement(I, {
        flexDirection: "column",
        paddingY: 1
    }, g, U, p, r)), q[29] = g, q[30] = p, q[31] = s;
    else s = q[31];
    let O1 = s,
        T1;
    if (q[32] !== K) T1 = eO.default.createElement(LH, {
        key: "overrides",
        title: "Overrides"
    }, eO.default.createElement(HHq, {
        onComplete: K
    })), q[32] = K, q[33] = T1;
    else T1 = q[33];
    let N1 = T1,
        j1;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) j1 = eO.default.createElement(LH, {
        key: "config",
        title: "Config"
    }, eO.default.createElement(zHq, null)), q[34] = j1;
    else j1 = q[34];
    let q1 = j1,
        t = Y.errors.length > 0,
        J1;
    if (q[35] !== Y || q[36] !== t || q[37] !== $ || q[38] !== O1 || q[39] !== N1) J1 = t ? [eO.default.createElement(LH, {
        key: "dependencies",
        title: "Dependencies"
    }, eO.default.createElement(nuA, {
        depCheck: Y
    }))] : [O1, ...$ ? [eO.default.createElement(LH, {
        key: "dependencies",
        title: "Dependencies"
    }, eO.default.createElement(nuA, {
        depCheck: Y
    }))] : [], N1, q1], q[35] = Y, q[36] = t, q[37] = $, q[38] = O1, q[39] = N1, q[40] = J1;
    else J1 = q[40];
    let D1 = J1,
        Z1;
    if (q[41] !== D1) Z1 = eO.default.createElement(I, {
        flexDirection: "column"
    }, eO.default.createElement($y, {
        title: "Sandbox:",
        color: "permission",
        defaultTab: "Mode"
    }, D1)), q[41] = D1, q[42] = Z1;
    else Z1 = q[42];
    return Z1
}
// @from(Ln 427381, Col 4)
eO
// @from(Ln 427382, Col 4)
JHq = v(() => {
    i1();
    m1();
    U5();
    k2();
    X91();
    m1();
    wHq();
    $Hq();
    OHq();
    K7();
    p8();
    eO = o(X1(), 1)
})
// @from(Ln 427396, Col 4)
jHq = {}
// @from(Ln 427401, Col 0)
async function oqz(A, q, K) {
    u8("sandbox");
    let z = C8().theme || "light",
        w = eA();
    if (!b8.isSupportedPlatform()) {
        let O = w === "wsl" ? "Error: Sandboxing requires WSL2. WSL1 is not supported." : "Error: Sandboxing is currently only supported on macOS, Linux, and WSL2.",
            _ = k8("error", z)(O);
        return A(_), null
    }
    let H = b8.checkDependencies();
    if (!b8.isPlatformInEnabledList()) {
        let O = k8("error", z)(`Error: Sandboxing is disabled for this platform (${w}) via the enabledPlatforms setting.`);
        return A(O), null
    }
    if (b8.areSandboxSettingsLockedByPolicy()) {
        let O = k8("error", z)("Error: Sandbox settings are overridden by a higher-priority configuration and cannot be changed locally.");
        return A(O), null
    }
    let $ = K?.trim() || "";
    if (!$) return DHq.default.createElement(_Hq, {
        onComplete: A,
        depCheck: H
    });
    if ($) {
        let _ = $.split(" ")[0];
        if (_ === "exclude") {
            let J = $.slice(8).trim();
            if (!J) {
                let P = k8("error", z)('Error: Please provide a command pattern to exclude (e.g., /sandbox exclude "npm run test:*")');
                return A(P), null
            }
            let X = J.replace(/^["']|["']$/g, "");
            ae8(X);
            let D = Vw("localSettings"),
                j = D ? XHq.relative(Ex(), D) : ".claude/settings.local.json",
                M = k8("success", z)(`Added "${X}" to excluded commands in ${j}`);
            return A(M), null
        } else {
            let J = k8("error", z)(`Error: Unknown subcommand "${_}". Available subcommand: exclude`);
            return A(J), null
        }
    }
    return null
}
// @from(Ln 427445, Col 4)
DHq
// @from(Ln 427446, Col 4)
MHq = v(() => {
    k2();
    m1();
    p8();
    B6();
    JHq();
    x3();
    v3();
    DHq = o(X1(), 1)
})
// @from(Ln 427456, Col 4)
aqz
// @from(Ln 427456, Col 9)
PHq
// @from(Ln 427457, Col 4)
WHq = v(() => {
    k2();
    b7();
    aqz = {
        name: "sandbox",
        get description() {
            let A = b8.isSandboxingEnabled(),
                q = b8.isAutoAllowBashIfSandboxedEnabled(),
                K = b8.areUnsandboxedCommandsAllowed(),
                Y = b8.areSandboxSettingsLockedByPolicy(),
                z = b8.checkDependencies().errors.length === 0,
                w;
            if (!z) w = l1.warning;
            else w = A ? l1.tick : l1.circle;
            let H = "sandbox disabled";
            if (A) H = q ? "sandbox enabled (auto-allow)" : "sandbox enabled", H += K ? ", fallback allowed" : "";
            if (Y) H += " (managed)";
            return `${w} ${H} (⏎ to configure)`
        },
        argumentHint: 'exclude "command pattern"',
        isEnabled: () => !0,
        isHidden: !b8.isSupportedPlatform() || !b8.isPlatformInEnabledList(),
        immediate: !0,
        type: "local-jsx",
        userFacingName: () => "sandbox",
        load: () => Promise.resolve().then(() => (MHq(), jHq))
    }, PHq = aqz
})
// @from(Ln 427498, Col 0)
function AKz(A) {
    return "result" in A || "error" in A
}
// @from(Ln 427502, Col 0)
function qKz(A) {
    return "method" in A && typeof A.method === "string"
}
// @from(Ln 427505, Col 0)
class ZHq {
    socket = null;
    connected = !1;
    connecting = !1;
    responseCallback = null;
    notificationHandler = null;
    responseBuffer = Buffer.alloc(0);
    reconnectAttempts = 0;
    maxReconnectAttempts = 10;
    reconnectDelay = 1000;
    reconnectTimer = null;
    context;
    disableAutoReconnect = !1;
    constructor(A) {
        this.context = A
    }
    async connect() {
        let {
            serverName: A,
            logger: q
        } = this.context;
        if (this.connecting) {
            q.info(`[${A}] Already connecting, skipping duplicate attempt`);
            return
        }
        this.closeSocket(), this.connecting = !0;
        let K = this.context.getSocketPath?.() ?? this.context.socketPath;
        q.info(`[${A}] Attempting to connect to: ${K}`);
        try {
            await this.validateSocketSecurity(K)
        } catch (z) {
            this.connecting = !1, q.info(`[${A}] Security validation failed:`, z);
            return
        }
        this.socket = sqz(K);
        let Y = setTimeout(() => {
            if (!this.connected) q.info(`[${A}] Connection attempt timed out after 5000ms`), this.closeSocket(), this.scheduleReconnect()
        }, 5000);
        this.socket.on("connect", () => {
            clearTimeout(Y), this.connected = !0, this.connecting = !1, this.reconnectAttempts = 0, q.info(`[${A}] Successfully connected to bridge server`)
        }), this.socket.on("data", (z) => {
            this.responseBuffer = Buffer.concat([this.responseBuffer, z]);
            while (this.responseBuffer.length >= 4) {
                let w = this.responseBuffer.readUInt32LE(0);
                if (this.responseBuffer.length < 4 + w) break;
                let H = this.responseBuffer.slice(4, 4 + w);
                this.responseBuffer = this.responseBuffer.slice(4 + w);
                try {
                    let $ = JSON.parse(H.toString("utf-8"));
                    if (qKz($)) {
                        if (q.info(`[${A}] Received notification: ${$.method}`), this.notificationHandler) this.notificationHandler($)
                    } else if (AKz($)) q.info(`[${A}] Received tool response: ${$}`), this.handleResponse($);
                    else q.info(`[${A}] Received unknown message: ${$}`)
                } catch ($) {
                    q.info(`[${A}] Failed to parse message:`, $)
                }
            }
        }), this.socket.on("error", (z) => {
            if (clearTimeout(Y), q.info(`[${A}] Socket error (code: ${z.code}):`, z), this.connected = !1, this.connecting = !1, z.code && ["ECONNREFUSED", "ECONNRESET", "EPIPE", "ENOENT", "EOPNOTSUPP", "ECONNABORTED"].includes(z.code)) this.scheduleReconnect()
        }), this.socket.on("close", () => {
            clearTimeout(Y), this.connected = !1, this.connecting = !1, this.scheduleReconnect()
        })
    }
    scheduleReconnect() {
        let {
            serverName: A,
            logger: q
        } = this.context;
        if (this.disableAutoReconnect) return;
        if (this.reconnectTimer) {
            q.info(`[${A}] Reconnect already scheduled, skipping`);
            return
        }
        this.reconnectAttempts++;
        let K = 100;
        if (this.reconnectAttempts > K) {
            q.info(`[${A}] Giving up after ${K} attempts. Will retry on next tool call.`), this.reconnectAttempts = 0;
            return
        }
        let Y = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        if (this.reconnectAttempts <= this.maxReconnectAttempts) q.info(`[${A}] Reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts})`);
        else if (this.reconnectAttempts % 10 === 0) q.info(`[${A}] Still polling for native host (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, Y)
    }
    handleResponse(A) {
        if (this.responseCallback) {
            let q = this.responseCallback;
            this.responseCallback = null, q(A)
        }
    }
    setNotificationHandler(A) {
        this.notificationHandler = A
    }
    async ensureConnected() {
        let {
            serverName: A
        } = this.context;
        if (this.connected && this.socket) return !0;
        if (!this.socket && !this.connecting) await this.connect();
        return new Promise((q, K) => {
            let Y = null,
                z = setTimeout(() => {
                    if (Y) clearTimeout(Y);
                    K(new Hf(`[${A}] Connection attempt timed out after 5000ms`))
                }, 5000),
                w = () => {
                    if (this.connected) clearTimeout(z), q(!0);
                    else Y = setTimeout(w, 500)
                };
            w()
        })
    }
    async sendRequest(A, q = 30000) {
        let {
            serverName: K
        } = this.context;
        if (!this.socket) throw new Hf(`[${K}] Cannot send request: not connected`);
        let Y = this.socket;
        return new Promise((z, w) => {
            let H = setTimeout(() => {
                this.responseCallback = null, w(new Hf(`[${K}] Tool request timed out after ${q}ms`))
            }, q);
            this.responseCallback = (X) => {
                clearTimeout(H), z(X)
            };
            let $ = JSON.stringify(A),
                O = Buffer.from($, "utf-8"),
                _ = Buffer.allocUnsafe(4);
            _.writeUInt32LE(O.length, 0);
            let J = Buffer.concat([_, O]);
            Y.write(J)
        })
    }
    async callTool(A, q, K) {
        let Y = {
            method: "execute_tool",
            params: {
                client_id: this.context.clientTypeId,
                tool: A,
                args: q
            }
        };
        return this.sendRequestWithRetry(Y)
    }
    async sendRequestWithRetry(A) {
        let {
            serverName: q,
            logger: K
        } = this.context;
        try {
            return await this.sendRequest(A)
        } catch (Y) {
            if (!(Y instanceof Hf)) throw Y;
            return K.info(`[${q}] Connection error, forcing reconnect and retrying: ${Y.message}`), this.closeSocket(), await this.ensureConnected(), await this.sendRequest(A)
        }
    }
    async setPermissionMode(A, q) {}
    isConnected() {
        return this.connected
    }
    closeSocket() {
        if (this.socket) this.socket.removeAllListeners(), this.socket.end(), this.socket.destroy(), this.socket = null;
        this.connected = !1, this.connecting = !1
    }
    cleanup() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        this.closeSocket(), this.reconnectAttempts = 0, this.responseBuffer = Buffer.alloc(0), this.responseCallback = null
    }
    disconnect() {
        this.cleanup()
    }
    async validateSocketSecurity(A) {
        let {
            serverName: q,
            logger: K
        } = this.context;
        if (tqz() === "win32") return;
        try {
            let Y = eqz(A);
            if ((Y.split("/").pop() || "").startsWith("claude-mcp-browser-bridge-")) try {
                let _ = await GHq.stat(Y);
                if (_.isDirectory()) {
                    let J = _.mode & 511;
                    if (J !== 448) throw Error(`[${q}] Insecure socket directory permissions: ${J.toString(8)} (expected 0700). Directory may have been tampered with.`);
                    let X = process.getuid?.();
                    if (X !== void 0 && _.uid !== X) throw Error(`Socket directory not owned by current user (uid: ${X}, dir uid: ${_.uid}). Potential security risk.`)
                }
            } catch (_) {
                if (_.code !== "ENOENT") throw _
            }
            let H = await GHq.stat(A);
            if (!H.isSocket()) throw Error(`[${q}] Path exists but it's not a socket: ${A}`);
            let $ = H.mode & 511;
            if ($ !== 384) throw Error(`[${q}] Insecure socket permissions: ${$.toString(8)} (expected 0600). Socket may have been tampered with.`);
            let O = process.getuid?.();
            if (O !== void 0 && H.uid !== O) throw Error(`Socket not owned by current user (uid: ${O}, socket uid: ${H.uid}). Potential security risk.`);
            K.info(`[${q}] Socket security validation passed`)
        } catch (Y) {
            if (Y.code === "ENOENT") {
                K.info(`[${q}] Socket not found, will be created by server`);
                return
            }
            throw Y
        }
    }
}
// @from(Ln 427714, Col 0)
function FN6(A) {
    return new ZHq(A)
}
// @from(Ln 427717, Col 4)
Hf
// @from(Ln 427718, Col 4)
Gd1 = v(() => {
    Hf = class Hf extends Error {
        constructor(A) {
            super(A);
            this.name = "SocketConnectionError"
        }
    }
})
// @from(Ln 427727, Col 0)
function ruA() {
    return process.platform === "darwin" ? "macOS" : process.platform === "win32" ? "Windows" : "Linux"
}
// @from(Ln 427730, Col 0)
class ouA {
    ws = null;
    connected = !1;
    authenticated = !1;
    connecting = !1;
    reconnectTimer = null;
    reconnectAttempts = 0;
    pendingCalls = new Map;
    notificationHandler = null;
    context;
    permissionMode = "ask";
    allowedDomains;
    tabsContextCollectionTimeoutMs = 2000;
    toolCallTimeoutMs = 120000;
    connectionStartTime = null;
    connectionEstablishedTime = null;
    selectedDeviceId;
    discoveryComplete = !1;
    discoveryPromise = null;
    pendingDiscovery = null;
    previousSelectedDeviceId;
    peerConnectedWaiters = [];
    pendingPairingRequestId;
    pairingInProgress = !1;
    persistedDeviceId;
    pendingSwitchResolve = null;
    constructor(A) {
        if (this.context = A, A.initialPermissionMode) this.permissionMode = A.initialPermissionMode
    }
    async ensureConnected() {
        let {
            logger: A,
            serverName: q
        } = this.context;
        if (A.info(`[${q}] ensureConnected called, connected=${this.connected}, authenticated=${this.authenticated}, wsState=${this.ws?.readyState}`), this.connected && this.authenticated && this.ws?.readyState === mt.OPEN) return A.info(`[${q}] Already connected and authenticated`), !0;
        if (!this.connecting) A.info(`[${q}] Not connecting, starting connection...`), await this.connect();
        else A.info(`[${q}] Already connecting, waiting...`);
        return new Promise((K) => {
            let Y = setTimeout(() => {
                    A.info(`[${q}] Connection timeout, connected=${this.connected}, authenticated=${this.authenticated}`), K(!1)
                }, 1e4),
                z = () => {
                    if (this.connected && this.authenticated) A.info(`[${q}] Connection successful`), clearTimeout(Y), K(!0);
                    else if (!this.connecting) A.info(`[${q}] No longer connecting, giving up`), clearTimeout(Y), K(!1);
                    else setTimeout(z, 200)
                };
            z()
        })
    }
    async callTool(A, q, K) {
        let {
            logger: Y,
            serverName: z,
            trackEvent: w
        } = this.context;
        if (!this.ws || this.ws.readyState !== mt.OPEN) throw new Hf(`[${z}] Bridge not connected`);
        if (!this.selectedDeviceId && !this.discoveryComplete) this.discoveryPromise ??= this.discoverAndSelectExtension().finally(() => {
            this.discoveryPromise = null
        }), await this.discoveryPromise;
        let H = crypto.randomUUID(),
            $ = A === "tabs_context_mcp",
            O = Date.now(),
            _ = $ ? this.tabsContextCollectionTimeoutMs : this.toolCallTimeoutMs;
        w?.("chrome_bridge_tool_call_started", {
            tool_name: A,
            tool_use_id: H
        });
        let J = K?.permissionMode ?? this.permissionMode,
            X = K?.allowedDomains ?? this.allowedDomains;
        return new Promise((D, j) => {
            let M = setTimeout(() => {
                let W = this.pendingCalls.get(H);
                if (W) {
                    this.pendingCalls.delete(H);
                    let G = Date.now() - W.startTime;
                    if ($ && W.results.length > 0) w?.("chrome_bridge_tool_call_completed", {
                        tool_name: A,
                        tool_use_id: H,
                        duration_ms: G
                    }), D(this.mergeTabsResults(W.results));
                    else Y.warn(`[${z}] Tool call timeout: ${A} (${H.slice(0,8)}) after ${G}ms, pending calls: ${this.pendingCalls.size}`), w?.("chrome_bridge_tool_call_timeout", {
                        tool_name: A,
                        tool_use_id: H,
                        duration_ms: G,
                        timeout_ms: _
                    }), j(new Hf(`[${z}] Tool call timed out: ${A}`))
                }
            }, _);
            this.pendingCalls.set(H, {
                resolve: D,
                reject: j,
                timer: M,
                results: [],
                isTabsContext: $,
                onPermissionRequest: K?.onPermissionRequest,
                startTime: O,
                toolName: A
            });
            let P = {
                type: "tool_call",
                tool_use_id: H,
                client_type: this.context.clientTypeId,
                tool: A,
                args: q
            };
            if (this.selectedDeviceId) P.target_device_id = this.selectedDeviceId;
            if (J) P.permission_mode = J;
            if (X?.length) P.allowed_domains = X;
            if (K?.onPermissionRequest) P.handle_permission_prompts = !0;
            Y.debug(`[${z}] Sending tool_call: ${A} (${H.slice(0,8)})`), this.ws.send(JSON.stringify(P))
        })
    }
    isConnected() {
        return this.connected && this.authenticated && this.ws?.readyState === mt.OPEN
    }
    disconnect() {
        this.cleanup()
    }
    setNotificationHandler(A) {
        this.notificationHandler = A
    }
    async setPermissionMode(A, q) {
        this.permissionMode = A, this.allowedDomains = q
    }
    async discoverAndSelectExtension() {
        let {
            logger: A,
            serverName: q
        } = this.context;
        this.persistedDeviceId ??= this.context.getPersistedDeviceId?.();
        let K = await this.queryBridgeExtensions();
        if (K.length === 0) {
            if (A.info(`[${q}] No extensions connected, waiting up to ${fHq}ms for peer_connected`), await this.waitForPeerConnected(fHq)) K = await this.queryBridgeExtensions()
        }
        if (this.discoveryComplete = !0, K.length === 0) {
            A.info(`[${q}] No extensions found after waiting`);
            return
        }
        if (K.length === 1) {
            let Y = K[0];
            if (!this.isLocalExtension(Y)) this.context.onRemoteExtensionWarning?.(Y);
            this.selectExtension(Y.deviceId);
            return
        }
        if (this.persistedDeviceId) {
            let Y = K.find((z) => z.deviceId === this.persistedDeviceId);
            if (Y) {
                A.info(`[${q}] Auto-connecting to persisted extension: ${Y.name||Y.deviceId.slice(0,8)}`), this.selectExtension(Y.deviceId);
                return
            }
        }
        this.broadcastPairingRequest(), this.pairingInProgress = !0
    }
    async queryBridgeExtensions() {
        let A = await new Promise((K) => {
                let Y = setTimeout(() => {
                    this.pendingDiscovery = null, K([])
                }, KKz);
                this.pendingDiscovery = {
                    resolve: K,
                    timeout: Y
                }, this.ws?.send(JSON.stringify({
                    type: "list_extensions"
                }))
            }),
            q = new Map;
        for (let K of A) {
            let Y = q.get(K.deviceId);
            if (!Y || K.connectedAt > Y.connectedAt) q.set(K.deviceId, K)
        }
        return [...q.values()]
    }
    selectExtension(A) {
        let {
            logger: q,
            serverName: K
        } = this.context;
        this.selectedDeviceId = A, this.previousSelectedDeviceId = void 0, q.info(`[${K}] Selected Chrome extension: ${A.slice(0,8)}...`)
    }
    isLocalExtension(A) {
        if (!A.osPlatform) return !1;
        return A.osPlatform === ruA()
    }
    waitForPeerConnected(A) {
        return new Promise((q) => {
            let K = setTimeout(() => {
                    this.peerConnectedWaiters = this.peerConnectedWaiters.filter((z) => z !== Y), q(!1)
                }, A),
                Y = (z) => {
                    clearTimeout(K), q(z)
                };
            this.peerConnectedWaiters.push(Y)
        })
    }
    broadcastPairingRequest() {
        let A = crypto.randomUUID();
        this.pendingPairingRequestId = A, this.ws?.send(JSON.stringify({
            type: "pairing_request",
            request_id: A,
            client_type: this.context.clientTypeId
        }))
    }
    async switchBrowser() {
        let A = await this.queryBridgeExtensions(),
            q = this.selectedDeviceId ?? this.previousSelectedDeviceId;
        if (A.length === 0 || A.length === 1 && (!q || A[0].deviceId === q)) return "no_other_browsers";
        this.previousSelectedDeviceId = this.selectedDeviceId, this.selectedDeviceId = void 0, this.discoveryComplete = !1, this.pairingInProgress = !1;
        let K = crypto.randomUUID();
        if (this.pendingPairingRequestId = K, this.ws?.readyState !== mt.OPEN) return null;
        if (this.ws.send(JSON.stringify({
                type: "pairing_request",
                request_id: K,
                client_type: this.context.clientTypeId
            })), this.pendingSwitchResolve) this.pendingSwitchResolve(null);
        return new Promise((Y) => {
            let z = setTimeout(() => {
                if (this.pendingPairingRequestId === K) this.pendingPairingRequestId = void 0;
                this.pendingSwitchResolve = null, Y(null)
            }, 120000);
            this.pendingSwitchResolve = (w) => {
                clearTimeout(z), this.pendingSwitchResolve = null, Y(w)
            }
        })
    }
    async connect() {
        let {
            logger: A,
            serverName: q,
            bridgeConfig: K,
            trackEvent: Y
        } = this.context;
        if (!K) {
            A.error(`[${q}] No bridge config provided`);
            return
        }
        if (this.connecting) return;
        this.connecting = !0, this.authenticated = !1, this.connectionStartTime = Date.now(), this.closeSocket();
        let z, w;
        if (K.devUserId) z = K.devUserId, A.debug(`[${q}] Using dev user ID for bridge connection`);
        else {
            A.debug(`[${q}] Fetching user ID for bridge connection`);
            let $ = await K.getUserId();
            if (!$) {
                let O = Date.now() - this.connectionStartTime;
                A.error(`[${q}] No user ID available after ${O}ms`), Y?.("chrome_bridge_connection_failed", {
                    duration_ms: O,
                    error_type: "no_user_id",
                    reconnect_attempt: this.reconnectAttempts
                }), this.connecting = !1, this.context.onAuthenticationError?.();
                return
            }
            if (z = $, A.debug(`[${q}] Fetching OAuth token for bridge connection`), w = await K.getOAuthToken(), !w) {
                let O = Date.now() - this.connectionStartTime;
                A.error(`[${q}] No OAuth token available after ${O}ms`), Y?.("chrome_bridge_connection_failed", {
                    duration_ms: O,
                    error_type: "no_oauth_token",
                    reconnect_attempt: this.reconnectAttempts
                }), this.connecting = !1, this.context.onAuthenticationError?.();
                return
            }
        }
        let H = `${K.url}/chrome/${z}`;
        A.info(`[${q}] Connecting to bridge: ${H}`), Y?.("chrome_bridge_connection_started", {
            bridge_url: H
        });
        try {
            this.ws = new mt(H)
        } catch ($) {
            let O = Date.now() - this.connectionStartTime;
            A.error(`[${q}] Failed to create WebSocket after ${O}ms:`, $), Y?.("chrome_bridge_connection_failed", {
                duration_ms: O,
                error_type: "websocket_error",
                reconnect_attempt: this.reconnectAttempts
            }), this.connecting = !1, this.scheduleReconnect();
            return
        }
        this.ws.on("open", () => {
            A.info(`[${q}] WebSocket connected, sending connect message`);
            let $ = {
                type: "connect",
                client_type: this.context.clientTypeId
            };
            if (K.devUserId) $.dev_user_id = K.devUserId;
            else $.oauth_token = w;
            this.ws?.send(JSON.stringify($))
        }), this.ws.on("message", ($) => {
            try {
                let O = JSON.parse($.toString());
                A.debug(`[${q}] Bridge received: ${JSON.stringify(O)}`), this.handleMessage(O)
            } catch (O) {
                A.error(`[${q}] Failed to parse bridge message:`, O)
            }
        }), this.ws.on("close", ($) => {
            let O = this.connectionEstablishedTime ? Date.now() - this.connectionEstablishedTime : 0;
            A.info(`[${q}] Bridge connection closed (code: ${$}, duration: ${O}ms)`), Y?.("chrome_bridge_disconnected", {
                close_code: $,
                duration_since_connect_ms: O,
                reconnect_attempt: this.reconnectAttempts + 1
            }), this.connected = !1, this.authenticated = !1, this.connecting = !1, this.connectionEstablishedTime = null, this.scheduleReconnect()
        }), this.ws.on("error", ($) => {
            let O = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
            A.error(`[${q}] Bridge WebSocket error after ${O}ms: ${$.message}`), Y?.("chrome_bridge_connection_failed", {
                duration_ms: O,
                error_type: "websocket_error",
                reconnect_attempt: this.reconnectAttempts
            }), this.connected = !1, this.authenticated = !1, this.connecting = !1
        })
    }
    handleMessage(A) {
        let {
            logger: q,
            serverName: K,
            trackEvent: Y
        } = this.context;
        switch (A.type) {
            case "paired": {
                let z = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
                q.info(`[${K}] Paired with Chrome extension (duration: ${z}ms)`), this.connected = !0, this.authenticated = !0, this.connecting = !1, this.reconnectAttempts = 0, this.connectionEstablishedTime = Date.now(), Y?.("chrome_bridge_connection_succeeded", {
                    duration_ms: z,
                    status: "paired"
                });
                break
            }
            case "waiting": {
                let z = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
                q.info(`[${K}] Waiting for Chrome extension to connect (duration: ${z}ms)`), this.connected = !0, this.authenticated = !0, this.connecting = !1, this.reconnectAttempts = 0, this.connectionEstablishedTime = Date.now(), Y?.("chrome_bridge_connection_succeeded", {
                    duration_ms: z,
                    status: "waiting"
                });
                break
            }
            case "peer_connected":
                if (q.info(`[${K}] Chrome extension connected to bridge`), Y?.("chrome_bridge_peer_connected", null), !this.selectedDeviceId) this.discoveryComplete = !1;
                if (this.previousSelectedDeviceId && A.deviceId === this.previousSelectedDeviceId && !this.pendingSwitchResolve) q.info(`[${K}] Previously selected extension reconnected, auto-reselecting`), this.selectExtension(this.previousSelectedDeviceId), this.previousSelectedDeviceId = void 0;
                if (this.peerConnectedWaiters.length > 0) {
                    let z = this.peerConnectedWaiters;
                    this.peerConnectedWaiters = [];
                    for (let w of z) w(!0)
                }
                break;
            case "peer_disconnected":
                if (q.info(`[${K}] Chrome extension disconnected from bridge`), Y?.("chrome_bridge_peer_disconnected", null), A.deviceId && A.deviceId === this.selectedDeviceId) q.info(`[${K}] Selected extension disconnected, clearing selection`), this.previousSelectedDeviceId = this.selectedDeviceId, this.selectedDeviceId = void 0, this.discoveryComplete = !1;
                break;
            case "extensions_list":
                if (this.pendingDiscovery) clearTimeout(this.pendingDiscovery.timeout), this.pendingDiscovery.resolve(A.extensions ?? []), this.pendingDiscovery = null;
                break;
            case "pairing_response": {
                let {
                    request_id: z,
                    device_id: w,
                    name: H
                } = A;
                if (this.pendingPairingRequestId === z && w && H) {
                    if (this.pendingPairingRequestId = void 0, this.pairingInProgress = !1, this.selectExtension(w), this.context.onExtensionPaired?.(w, H), q.info(`[${K}] Paired with "${H}" (${w.slice(0,8)})`), this.pendingSwitchResolve) this.pendingSwitchResolve({
                        deviceId: w,
                        name: H
                    }), this.pendingSwitchResolve = null
                }
                break
            }
            case "ping":
                this.ws?.send(JSON.stringify({
                    type: "pong"
                }));
                break;
            case "pong":
                break;
            case "tool_result":
                this.handleToolResult(A);
                break;
            case "permission_request":
                this.handlePermissionRequest(A);
                break;
            case "notification":
                if (this.notificationHandler) this.notificationHandler({
                    method: A.method,
                    params: A.params
                });
                break;
            case "error":
                if (q.warn(`[${K}] Bridge error: ${A.error}`), this.selectedDeviceId) this.selectedDeviceId = void 0, this.discoveryComplete = !1;
                break;
            default:
                q.warn(`[${K}] Unrecognized bridge message type: ${A.type}`)
        }
    }
    async handlePermissionRequest(A) {
        let {
            logger: q,
            serverName: K
        } = this.context, Y = A.tool_use_id, z = A.request_id;
        if (!Y || !z) {
            q.warn(`[${K}] permission_request missing tool_use_id or request_id`);
            return
        }
        let w = this.pendingCalls.get(Y);
        if (!w?.onPermissionRequest) {
            q.debug(`[${K}] Ignoring permission_request for unknown tool_use_id ${Y.slice(0,8)} (not our call)`);
            return
        }
        let H = {
            toolUseId: Y,
            requestId: z,
            toolType: A.tool_type ?? "unknown",
            url: A.url ?? "",
            actionData: A.action_data
        };
        try {
            let $ = await w.onPermissionRequest(H);
            this.sendPermissionResponse(z, $)
        } catch ($) {
            q.error(`[${K}] Error handling permission request:`, $), this.sendPermissionResponse(z, !1)
        }
    }
    sendPermissionResponse(A, q) {
        if (this.ws?.readyState === mt.OPEN) {
            let K = {
                type: "permission_response",
                request_id: A,
                allowed: q
            };
            if (this.selectedDeviceId) K.target_device_id = this.selectedDeviceId;
            this.ws.send(JSON.stringify(K))
        }
    }
    handleToolResult(A) {
        let {
            logger: q,
            serverName: K,
            trackEvent: Y
        } = this.context, z = A.tool_use_id;
        if (!z) {
            q.warn(`[${K}] Received tool_result without tool_use_id`);
            return
        }
        let w = this.pendingCalls.get(z);
        if (!w) {
            q.debug(`[${K}] Received tool_result for unknown call: ${z.slice(0,8)}`);
            return
        }
        let H = Date.now() - w.startTime,
            $ = this.normalizeBridgeResponse(A),
            O = Boolean(A.is_error) || "error" in $;
        if (w.isTabsContext && !this.selectedDeviceId) w.results.push($);
        else {
            if (clearTimeout(w.timer), this.pendingCalls.delete(z), O) {
                let _ = $.error?.content,
                    J = "Unknown error";
                if (Array.isArray(_)) {
                    let X = _.find((D) => typeof D === "object" && D !== null && ("text" in D));
                    if (X?.text) J = X.text.slice(0, 200)
                }
                q.warn(`[${K}] Tool call error: ${w.toolName} (${z.slice(0,8)}) after ${H}ms`), Y?.("chrome_bridge_tool_call_error", {
                    tool_name: w.toolName,
                    tool_use_id: z,
                    duration_ms: H,
                    error_message: J
                })
            } else q.debug(`[${K}] Tool call completed: ${w.toolName} (${z.slice(0,8)}) in ${H}ms`), Y?.("chrome_bridge_tool_call_completed", {
                tool_name: w.toolName,
                tool_use_id: z,
                duration_ms: H
            });
            w.resolve($)
        }
    }
    normalizeBridgeResponse(A) {
        if (A.result || A.error) return A;
        if (A.content) {
            if (A.is_error) return {
                error: {
                    content: A.content
                }
            };
            return {
                result: {
                    content: A.content
                }
            }
        }
        return A
    }
    mergeTabsResults(A) {
        let q = [];
        for (let K of A) {
            let w = K.result?.content;
            if (!w || !Array.isArray(w)) continue;
            for (let H of w)
                if (H.type === "text" && H.text) try {
                    let $ = JSON.parse(H.text);
                    if (Array.isArray($)) q.push(...$);
                    else if ($?.availableTabs && Array.isArray($.availableTabs)) q.push(...$.availableTabs)
                } catch {}
        }
        if (q.length > 0) {
            let K = q.map((Y) => {
                let z = Y;
                return `  • tabId ${z.tabId}: "${z.title}" (${z.url})`
            }).join(`
`);
            return {
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableTabs: q
                        })
                    }, {
                        type: "text",
                        text: `

Tab Context:
- Available tabs:
${K}`
                    }]
                }
            }
        }
        return A[0]
    }
    scheduleReconnect() {
        let {
            logger: A,
            serverName: q,
            trackEvent: K
        } = this.context;
        if (this.reconnectTimer) return;
        if (this.reconnectAttempts++, this.reconnectAttempts > 100) {
            A.warn(`[${q}] Giving up bridge reconnection after 100 attempts`), K?.("chrome_bridge_reconnect_exhausted", {
                total_attempts: 100
            }), this.reconnectAttempts = 0;
            return
        }
        let Y = Math.min(2000 * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        if (this.reconnectAttempts <= 10 || this.reconnectAttempts % 10 === 0) A.info(`[${q}] Bridge reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, Y)
    }
    closeSocket() {
        if (this.ws) this.ws.removeAllListeners(), this.ws.close(), this.ws = null;
        if (this.connected = !1, this.authenticated = !1, this.selectedDeviceId = void 0, this.discoveryComplete = !1, this.pendingPairingRequestId = void 0, this.pairingInProgress = !1, this.pendingSwitchResolve) this.pendingSwitchResolve(null), this.pendingSwitchResolve = null;
        if (this.pendingDiscovery) clearTimeout(this.pendingDiscovery.timeout), this.pendingDiscovery.resolve([]), this.pendingDiscovery = null;
        if (this.peerConnectedWaiters.length > 0) {
            let A = this.peerConnectedWaiters;
            this.peerConnectedWaiters = [];
            for (let q of A) q(!1)
        }
    }
    cleanup() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        for (let [A, q] of this.pendingCalls) clearTimeout(q.timer), q.reject(new Hf("Bridge client disconnected")), this.pendingCalls.delete(A);
        this.closeSocket(), this.reconnectAttempts = 0
    }
}
// @from(Ln 428286, Col 0)
function auA(A) {
    return new ouA(A)
}
// @from(Ln 428289, Col 4)
KKz = 5000
// @from(Ln 428290, Col 4)
fHq = 1e4
// @from(Ln 428291, Col 4)
suA = v(() => {
    zU1();
    Gd1()
})
// @from(Ln 428295, Col 4)
Qe