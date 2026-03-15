
// @from(Ln 414969, Col 0)
function CJq({
    session: A,
    toolUseContext: q,
    onDone: K,
    onBack: Y
}) {
    let [z, _] = _r6.useState(!1), [w, O] = _r6.useState(null), $ = () => K("Remote session details dismissed", {
        display: "system"
    });
    jA((X, P) => {
        if (X === " ") K("Remote session details dismissed", {
            display: "system"
        });
        else if (P.leftArrow && Y) Y();
        else if (X === "t" && !z && !A.isUltraplan) H();
        else if (P.return) $()
    });
    async function H() {
        _(!0), O(null);
        try {
            await Oz6(A.sessionId)
        } catch (X) {
            O(_1(X)), _(!1)
        }
    }
    let j = (X) => {
            let P = Math.floor((Date.now() - X) / 1000),
                W = Math.floor(P / 3600),
                Z = Math.floor((P - W * 3600) / 60),
                G = P - W * 3600 - Z * 60;
            return `${W>0?`${W}h `:""}${Z>0||W>0?`${Z}m `:""}${G}s`
        },
        J = _r6.useMemo(() => {
            return JM(LR1(A.log)).filter((X) => X.type !== "progress").slice(-3)
        }, [A]),
        M = jq(A.title, 50),
        D = A.status === "pending" ? "starting" : A.status;
    return FY.default.createElement(m8, {
        title: "Remote session details",
        onCancel: $,
        color: "background",
        inputGuide: (X) => X.pending ? FY.default.createElement(T, null, "Press ", X.keyName, " again to exit") : FY.default.createElement(C8, null, Y && FY.default.createElement(a1, {
            shortcut: "←",
            action: "go back"
        }), FY.default.createElement(a1, {
            shortcut: "Esc/Enter/Space",
            action: "close"
        }), !z && !A.isUltraplan && FY.default.createElement(a1, {
            shortcut: "t",
            action: "teleport"
        }))
    }, FY.default.createElement(m, {
        flexDirection: "column"
    }, FY.default.createElement(T, null, FY.default.createElement(T, {
        bold: !0
    }, "Status"), ":", " ", D === "running" || D === "starting" ? FY.default.createElement(T, {
        color: "background"
    }, D) : D === "completed" ? FY.default.createElement(T, {
        color: "success"
    }, D) : FY.default.createElement(T, {
        color: "error"
    }, D)), FY.default.createElement(T, null, FY.default.createElement(T, {
        bold: !0
    }, "Runtime"), ": ", j(A.startTime)), FY.default.createElement(T, {
        wrap: "truncate-end"
    }, FY.default.createElement(T, {
        bold: !0
    }, "Title"), ": ", M), FY.default.createElement(T, null, FY.default.createElement(T, {
        bold: !0
    }, "Progress"), ":", " ", FY.default.createElement(yR1, {
        session: A
    })), FY.default.createElement(T, null, FY.default.createElement(T, {
        bold: !0
    }, "Session URL"), ":", " ", FY.default.createElement(y7, {
        url: ZV1(A.sessionId)
    }, FY.default.createElement(T, {
        dimColor: !0
    }, ZV1(A.sessionId))))), A.log.length > 0 && FY.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, FY.default.createElement(T, null, FY.default.createElement(T, {
        bold: !0
    }, "Recent messages"), ":"), FY.default.createElement(m, {
        flexDirection: "column",
        height: 10,
        overflowY: "hidden"
    }, J.map((X, P) => FY.default.createElement(tR, {
        key: P,
        message: X,
        lookups: Hl,
        addMargin: P > 0,
        tools: q.options.tools,
        commands: q.options.commands,
        verbose: q.options.verbose,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        style: "condensed",
        isTranscriptMode: !1,
        isStatic: !0
    }))), FY.default.createElement(m, {
        marginTop: 1
    }, FY.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Showing last ", J.length, " of ", A.log.length, " ", "messages"))), !A.isUltraplan && w && FY.default.createElement(m, {
        marginTop: 1
    }, FY.default.createElement(T, {
        color: "error"
    }, "Teleport failed: ", w)), !A.isUltraplan && z && FY.default.createElement(T, {
        color: "background"
    }, "Teleporting to session…"))
}
// @from(Ln 415083, Col 4)
FY
// @from(Ln 415083, Col 8)
_r6
// @from(Ln 415084, Col 4)
IJq = E(() => {
    i6();
    GV1();
    oc8();
    S66();
    Gf6();
    jN6();
    JA();
    Lq();
    Xq();
    wq();
    M4();
    s8();
    FY = t(P6(), 1), _r6 = t(P6(), 1)
})
// @from(Ln 415100, Col 0)
function hR1(A, q, K) {
    let Y = dK(q, A.toolName);
    if (!Y) return A.toolName;
    try {
        let z = Y.inputSchema.safeParse(A.input),
            _ = z.success ? z.data : {},
            w = Y.userFacingName(_);
        if (!w) return A.toolName;
        let O = Y.renderToolUseMessage(_, {
            theme: K,
            verbose: !1
        });
        if (O) return bJq.default.createElement(T, null, w, "(", O, ")");
        return w
    } catch {
        return A.toolName
    }
}
// @from(Ln 415118, Col 4)
bJq
// @from(Ln 415119, Col 4)
tc8 = E(() => {
    i6();
    bJq = t(P6(), 1)
})
// @from(Ln 415124, Col 0)
function y6z(A) {
    switch (A) {
        case "running":
        case "pending":
            return a6.pointer;
        case "completed":
            return a6.tick;
        case "failed":
        case "killed":
            return a6.cross;
        default:
            return a6.bullet
    }
}
// @from(Ln 415139, Col 0)
function L6z(A) {
    switch (A) {
        case "running":
        case "pending":
            return "background";
        case "completed":
            return "success";
        case "failed":
            return "error";
        case "killed":
            return "warning";
        default:
            return "background"
    }
}
// @from(Ln 415155, Col 0)
function xJq(A) {
    let q = A6(51),
        {
            agent: K,
            onDone: Y,
            onKillAgent: z,
            onBack: _
        } = A,
        [w] = z7(),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = FX(xM()), q[0] = O;
    else O = q[0];
    let $ = O,
        H = BZ6(K.startTime, K.status === "running", 1000, K.totalPausedMs ?? 0),
        j;
    if (q[1] !== Y) j = {
        "confirm:yes": Y
    }, q[1] = Y, q[2] = j;
    else j = q[2];
    let J;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Confirmation"
    }, q[3] = J;
    else J = q[3];
    tA(j, J);
    let M;
    if (q[4] !== K.status || q[5] !== _ || q[6] !== Y || q[7] !== z) M = (r, e) => {
        if (r === " ") Y();
        else if (e.leftArrow && _) _();
        else if (r === "x" && K.status === "running" && z) z()
    }, q[4] = K.status, q[5] = _, q[6] = Y, q[7] = z, q[8] = M;
    else M = q[8];
    jA(M);
    let D;
    if (q[9] !== K.prompt) D = d4(K.prompt, "plan"), q[9] = K.prompt, q[10] = D;
    else D = q[10];
    let X = D,
        P = K.prompt.length > 300 ? K.prompt.substring(0, 297) + "…" : K.prompt,
        W = K.result?.totalTokens ?? K.progress?.tokenCount,
        Z = K.result?.totalToolUseCount ?? K.progress?.toolUseCount,
        G = K.selectedAgent?.agentType ?? "agent",
        f = K.description || "Async agent",
        v;
    if (q[11] !== G || q[12] !== f) v = jw.default.createElement(T, null, G, " ›", " ", f), q[11] = G, q[12] = f, q[13] = v;
    else v = q[13];
    let N = v,
        V;
    if (q[14] !== K.status) V = K.status !== "running" && jw.default.createElement(T, {
        color: L6z(K.status)
    }, y6z(K.status), " ", K.status === "completed" ? "Completed" : K.status === "failed" ? "Failed" : "Stopped", " · "), q[14] = K.status, q[15] = V;
    else V = q[15];
    let L;
    if (q[16] !== W) L = W !== void 0 && W > 0 && jw.default.createElement(jw.default.Fragment, null, " · ", fq(W), " tokens"), q[16] = W, q[17] = L;
    else L = q[17];
    let h;
    if (q[18] !== Z) h = Z !== void 0 && Z > 0 && jw.default.createElement(jw.default.Fragment, null, " ", "· ", Z, " ", Z === 1 ? "tool" : "tools"), q[18] = Z, q[19] = h;
    else h = q[19];
    let R;
    if (q[20] !== H || q[21] !== L || q[22] !== h) R = jw.default.createElement(T, {
        dimColor: !0
    }, H, L, h), q[20] = H, q[21] = L, q[22] = h, q[23] = R;
    else R = q[23];
    let u;
    if (q[24] !== R || q[25] !== V) u = jw.default.createElement(T, null, V, R), q[24] = R, q[25] = V, q[26] = u;
    else u = q[26];
    let I = u,
        g;
    if (q[27] !== K.status || q[28] !== _ || q[29] !== z) g = (r) => r.pending ? jw.default.createElement(T, null, "Press ", r.keyName, " again to exit") : jw.default.createElement(C8, null, _ && jw.default.createElement(a1, {
        shortcut: "←",
        action: "go back"
    }), jw.default.createElement(a1, {
        shortcut: "Esc/Enter/Space",
        action: "close"
    }), K.status === "running" && z && jw.default.createElement(a1, {
        shortcut: "x",
        action: "stop"
    })), q[27] = K.status, q[28] = _, q[29] = z, q[30] = g;
    else g = q[30];
    let B;
    if (q[31] !== K.progress || q[32] !== K.status || q[33] !== w) B = K.status === "running" && K.progress?.recentActivities && K.progress.recentActivities.length > 0 && jw.default.createElement(m, {
        flexDirection: "column"
    }, jw.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Progress"), K.progress.recentActivities.map((r, e) => jw.default.createElement(T, {
        key: e,
        dimColor: e < K.progress.recentActivities.length - 1,
        wrap: "truncate-end"
    }, e === K.progress.recentActivities.length - 1 ? "› " : "  ", hR1(r, $, w)))), q[31] = K.progress, q[32] = K.status, q[33] = w, q[34] = B;
    else B = q[34];
    let b;
    if (q[35] !== P || q[36] !== X) b = X ? jw.default.createElement(m, {
        marginTop: 1
    }, jw.default.createElement(KN1, {
        addMargin: !1,
        planContent: X
    })) : jw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, jw.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Prompt"), jw.default.createElement(T, {
        wrap: "wrap"
    }, P)), q[35] = P, q[36] = X, q[37] = b;
    else b = q[37];
    let p;
    if (q[38] !== K.error || q[39] !== K.status) p = K.status === "failed" && K.error && jw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, jw.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error"), jw.default.createElement(T, {
        color: "error",
        wrap: "wrap"
    }, K.error)), q[38] = K.error, q[39] = K.status, q[40] = p;
    else p = q[40];
    let Q;
    if (q[41] !== B || q[42] !== b || q[43] !== p) Q = jw.default.createElement(m, {
        flexDirection: "column"
    }, B, b, p), q[41] = B, q[42] = b, q[43] = p, q[44] = Q;
    else Q = q[44];
    let U;
    if (q[45] !== Y || q[46] !== I || q[47] !== g || q[48] !== Q || q[49] !== N) U = jw.default.createElement(m8, {
        title: N,
        subtitle: I,
        onCancel: Y,
        color: "background",
        inputGuide: g
    }, Q), q[45] = Y, q[46] = I, q[47] = g, q[48] = Q, q[49] = N, q[50] = U;
    else U = q[50];
    return U
}
// @from(Ln 415289, Col 4)
jw
// @from(Ln 415290, Col 4)
uJq = E(() => {
    e6();
    i6();
    _7();
    M4();
    BZ1();
    b7();
    IX();
    Lq();
    Xq();
    yx8();
    JA();
    wq();
    tc8();
    jw = t(P6(), 1)
})
// @from(Ln 415307, Col 0)
function JN6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}
// @from(Ln 415311, Col 0)
function SR1(A) {
    if (A.shutdownRequested) return "stopping";
    if (A.awaitingPlanApproval) return "awaiting approval";
    if (A.isIdle) return "idle";
    return (A.progress?.recentActivities && rt(A.progress.recentActivities)) ?? A.progress?.lastActivity?.activityDescription ?? "working"
}
// @from(Ln 415318, Col 0)
function hh(A, q) {
    if (!q) return !1;
    let K = !1;
    for (let Y of Object.values(A)) {
        if (!ij(Y) || e2() && Y.type === "local_agent") continue;
        if (K = !0, Y.type !== "in_process_teammate") return !1
    }
    return K
}
// @from(Ln 415327, Col 4)
B16 = E(() => {
    Fv();
    gB()
})
// @from(Ln 415332, Col 0)
function mJq(A) {
    let q = A6(60),
        {
            teammate: K,
            onDone: Y,
            onKill: z,
            onBack: _,
            onForeground: w
        } = A,
        [O] = z7(),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = FX(xM()), q[0] = $;
    else $ = q[0];
    let H = $,
        j = BZ6(K.startTime, K.status === "running", 1000, K.totalPausedMs ?? 0),
        J;
    if (q[1] !== Y) J = {
        "confirm:yes": Y
    }, q[1] = Y, q[2] = J;
    else J = q[2];
    let M;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) M = {
        context: "Confirmation"
    }, q[3] = M;
    else M = q[3];
    tA(J, M);
    let D;
    if (q[4] !== _ || q[5] !== Y || q[6] !== w || q[7] !== z || q[8] !== K.status) D = (H6, J6) => {
        if (H6 === " ") Y();
        else if (J6.leftArrow && _) _();
        else if (H6 === "x" && K.status === "running" && z) z();
        else if (H6 === "f" && K.status === "running" && w) w()
    }, q[4] = _, q[5] = Y, q[6] = w, q[7] = z, q[8] = K.status, q[9] = D;
    else D = q[9];
    jA(D);
    let X;
    if (q[10] !== K) X = SR1(K), q[10] = K, q[11] = X;
    else X = q[11];
    let P = X,
        W = K.result?.totalTokens ?? K.progress?.tokenCount,
        Z = K.result?.totalToolUseCount ?? K.progress?.toolUseCount,
        G;
    if (q[12] !== K.prompt) G = jq(K.prompt, 300), q[12] = K.prompt, q[13] = G;
    else G = q[13];
    let f = G,
        v;
    if (q[14] !== K.identity.color) v = G0(K.identity.color), q[14] = K.identity.color, q[15] = v;
    else v = q[15];
    let N;
    if (q[16] !== v || q[17] !== K.identity.agentName) N = Jw.default.createElement(T, {
        color: v
    }, "@", K.identity.agentName), q[16] = v, q[17] = K.identity.agentName, q[18] = N;
    else N = q[18];
    let V;
    if (q[19] !== P) V = P && Jw.default.createElement(T, {
        dimColor: !0
    }, " (", P, ")"), q[19] = P, q[20] = V;
    else V = q[20];
    let L;
    if (q[21] !== N || q[22] !== V) L = Jw.default.createElement(T, null, N, V), q[21] = N, q[22] = V, q[23] = L;
    else L = q[23];
    let h = L,
        R;
    if (q[24] !== K.status) R = K.status !== "running" && Jw.default.createElement(T, {
        color: K.status === "completed" ? "success" : K.status === "killed" ? "warning" : "error"
    }, K.status === "completed" ? "Completed" : K.status === "failed" ? "Failed" : "Stopped", " · "), q[24] = K.status, q[25] = R;
    else R = q[25];
    let u;
    if (q[26] !== W) u = W !== void 0 && W > 0 && Jw.default.createElement(Jw.default.Fragment, null, " · ", fq(W), " tokens"), q[26] = W, q[27] = u;
    else u = q[27];
    let I;
    if (q[28] !== Z) I = Z !== void 0 && Z > 0 && Jw.default.createElement(Jw.default.Fragment, null, " ", "· ", Z, " ", Z === 1 ? "tool" : "tools"), q[28] = Z, q[29] = I;
    else I = q[29];
    let g;
    if (q[30] !== j || q[31] !== u || q[32] !== I) g = Jw.default.createElement(T, {
        dimColor: !0
    }, j, u, I), q[30] = j, q[31] = u, q[32] = I, q[33] = g;
    else g = q[33];
    let B;
    if (q[34] !== R || q[35] !== g) B = Jw.default.createElement(T, null, R, g), q[34] = R, q[35] = g, q[36] = B;
    else B = q[36];
    let b = B,
        p;
    if (q[37] !== _ || q[38] !== w || q[39] !== z || q[40] !== K.status) p = (H6) => H6.pending ? Jw.default.createElement(T, null, "Press ", H6.keyName, " again to exit") : Jw.default.createElement(C8, null, _ && Jw.default.createElement(a1, {
        shortcut: "←",
        action: "go back"
    }), Jw.default.createElement(a1, {
        shortcut: "Esc/Enter/Space",
        action: "close"
    }), K.status === "running" && z && Jw.default.createElement(a1, {
        shortcut: "x",
        action: "stop"
    }), K.status === "running" && w && Jw.default.createElement(a1, {
        shortcut: "f",
        action: "foreground"
    })), q[37] = _, q[38] = w, q[39] = z, q[40] = K.status, q[41] = p;
    else p = q[41];
    let Q;
    if (q[42] !== K.progress || q[43] !== K.status || q[44] !== O) Q = K.status === "running" && K.progress?.recentActivities && K.progress.recentActivities.length > 0 && Jw.default.createElement(m, {
        flexDirection: "column"
    }, Jw.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Progress"), K.progress.recentActivities.map((H6, J6) => Jw.default.createElement(T, {
        key: J6,
        dimColor: J6 < K.progress.recentActivities.length - 1,
        wrap: "truncate-end"
    }, J6 === K.progress.recentActivities.length - 1 ? "› " : "  ", hR1(H6, H, O)))), q[42] = K.progress, q[43] = K.status, q[44] = O, q[45] = Q;
    else Q = q[45];
    let U;
    if (q[46] === Symbol.for("react.memo_cache_sentinel")) U = Jw.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Prompt"), q[46] = U;
    else U = q[46];
    let r;
    if (q[47] !== f) r = Jw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, U, Jw.default.createElement(T, {
        wrap: "wrap"
    }, f)), q[47] = f, q[48] = r;
    else r = q[48];
    let e;
    if (q[49] !== K.error || q[50] !== K.status) e = K.status === "failed" && K.error && Jw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, Jw.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error"), Jw.default.createElement(T, {
        color: "error",
        wrap: "wrap"
    }, K.error)), q[49] = K.error, q[50] = K.status, q[51] = e;
    else e = q[51];
    let Y6;
    if (q[52] !== Y || q[53] !== b || q[54] !== p || q[55] !== Q || q[56] !== r || q[57] !== e || q[58] !== h) Y6 = Jw.default.createElement(m8, {
        title: h,
        subtitle: b,
        onCancel: Y,
        color: "background",
        inputGuide: p
    }, Q, r, e), q[52] = Y, q[53] = b, q[54] = p, q[55] = Q, q[56] = r, q[57] = e, q[58] = h, q[59] = Y6;
    else Y6 = q[59];
    return Y6
}
// @from(Ln 415478, Col 4)
Jw
// @from(Ln 415479, Col 4)
BJq = E(() => {
    e6();
    i6();
    _7();
    M4();
    BZ1();
    IX();
    B16();
    Lq();
    Xq();
    wq();
    kc();
    tc8();
    Jw = t(P6(), 1)
})
// @from(Ln 415495, Col 0)
function T_6(A) {
    let q = A6(4),
        {
            status: K,
            label: Y,
            suffix: z
        } = A,
        _ = Y ?? K,
        w = K === "completed" ? "success" : K === "failed" ? "error" : K === "killed" ? "warning" : void 0,
        O;
    if (q[0] !== w || q[1] !== _ || q[2] !== z) O = MN6.default.createElement(T, {
        color: w,
        dimColor: !0
    }, "(", _, z, ")"), q[0] = w, q[1] = _, q[2] = z, q[3] = O;
    else O = q[3];
    return O
}
// @from(Ln 415513, Col 0)
function gJq(A) {
    let q = A6(4),
        {
            shell: K
        } = A;
    switch (K.status) {
        case "completed": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = MN6.default.createElement(T_6, {
                status: "completed",
                label: "done"
            }), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "failed": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = MN6.default.createElement(T_6, {
                status: "failed",
                label: "error"
            }), q[1] = Y;
            else Y = q[1];
            return Y
        }
        case "killed": {
            let Y;
            if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = MN6.default.createElement(T_6, {
                status: "killed",
                label: "stopped"
            }), q[2] = Y;
            else Y = q[2];
            return Y
        }
        case "running":
        case "pending": {
            let Y;
            if (q[3] === Symbol.for("react.memo_cache_sentinel")) Y = MN6.default.createElement(T_6, {
                status: "running"
            }), q[3] = Y;
            else Y = q[3];
            return Y
        }
    }
}
// @from(Ln 415557, Col 4)
MN6
// @from(Ln 415558, Col 4)
FJq = E(() => {
    e6();
    i6();
    MN6 = t(P6(), 1)
})
// @from(Ln 415564, Col 0)
function pJq(A) {
    let q = A6(58),
        {
            task: K,
            maxActivityWidth: Y
        } = A,
        z = Y ?? 40;
    switch (K.type) {
        case "local_bash": {
            let _ = K.kind === "monitor" ? K.description : K.command,
                w;
            if (q[0] !== z || q[1] !== _) w = R3(_, z, !0), q[0] = z, q[1] = _, q[2] = w;
            else w = q[2];
            let O;
            if (q[3] !== K) O = HH.createElement(gJq, {
                shell: K
            }), q[3] = K, q[4] = O;
            else O = q[4];
            let $;
            if (q[5] !== w || q[6] !== O) $ = HH.createElement(T, null, w, " ", O), q[5] = w, q[6] = O, q[7] = $;
            else $ = q[7];
            return $
        }
        case "remote_agent": {
            let _;
            if (q[8] !== z || q[9] !== K.title) _ = R3(K.title, z, !0), q[8] = z, q[9] = K.title, q[10] = _;
            else _ = q[10];
            let w;
            if (q[11] !== K) w = HH.createElement(yR1, {
                session: K
            }), q[11] = K, q[12] = w;
            else w = q[12];
            let O;
            if (q[13] !== _ || q[14] !== w) O = HH.createElement(T, null, _, " ", w), q[13] = _, q[14] = w, q[15] = O;
            else O = q[15];
            return O
        }
        case "local_agent": {
            let _;
            if (q[16] !== z || q[17] !== K.description) _ = R3(K.description, z, !0), q[16] = z, q[17] = K.description, q[18] = _;
            else _ = q[18];
            let w = K.status === "completed" ? "done" : void 0,
                O = K.status === "completed" && !K.notified ? ", unread" : void 0,
                $;
            if (q[19] !== w || q[20] !== O || q[21] !== K.status) $ = HH.createElement(T_6, {
                status: K.status,
                label: w,
                suffix: O
            }), q[19] = w, q[20] = O, q[21] = K.status, q[22] = $;
            else $ = q[22];
            let H;
            if (q[23] !== _ || q[24] !== $) H = HH.createElement(T, null, _, " ", $), q[23] = _, q[24] = $, q[25] = H;
            else H = q[25];
            return H
        }
        case "in_process_teammate": {
            let _, w, O, $, H, j;
            if (q[26] !== z || q[27] !== K) {
                let D = SR1(K);
                w = T;
                let X;
                if (q[34] !== K.identity.color) X = G0(K.identity.color), q[34] = K.identity.color, q[35] = X;
                else X = q[35];
                if (q[36] !== X || q[37] !== K.identity.agentName) j = HH.createElement(T, {
                    color: X
                }, "@", K.identity.agentName), q[36] = X, q[37] = K.identity.agentName, q[38] = j;
                else j = q[38];
                _ = T, O = !0, $ = ": ", H = R3(D, z, !0), q[26] = z, q[27] = K, q[28] = _, q[29] = w, q[30] = O, q[31] = $, q[32] = H, q[33] = j
            } else _ = q[28], w = q[29], O = q[30], $ = q[31], H = q[32], j = q[33];
            let J;
            if (q[39] !== _ || q[40] !== O || q[41] !== $ || q[42] !== H) J = HH.createElement(_, {
                dimColor: O
            }, $, H), q[39] = _, q[40] = O, q[41] = $, q[42] = H, q[43] = J;
            else J = q[43];
            let M;
            if (q[44] !== w || q[45] !== j || q[46] !== J) M = HH.createElement(w, null, j, J), q[44] = w, q[45] = j, q[46] = J, q[47] = M;
            else M = q[47];
            return M
        }
        case "local_workflow": {
            let _ = K.workflowName ?? K.summary ?? K.description,
                w;
            if (q[48] !== z || q[49] !== _) w = R3(_, z, !0), q[48] = z, q[49] = _, q[50] = w;
            else w = q[50];
            let O = K.status === "running" ? `${K.agentCount} agent${K.agentCount===1?"":"s"}` : K.status === "completed" ? "done" : void 0,
                $ = K.status === "completed" && !K.notified ? ", unread" : void 0,
                H;
            if (q[51] !== O || q[52] !== $ || q[53] !== K.status) H = HH.createElement(T_6, {
                status: K.status,
                label: O,
                suffix: $
            }), q[51] = O, q[52] = $, q[53] = K.status, q[54] = H;
            else H = q[54];
            let j;
            if (q[55] !== w || q[56] !== H) j = HH.createElement(T, null, w, " ", H), q[55] = w, q[56] = H, q[57] = j;
            else j = q[57];
            return j
        }
    }
}
// @from(Ln 415664, Col 4)
HH
// @from(Ln 415665, Col 4)
QJq = E(() => {
    e6();
    FJq();
    oc8();
    M4();
    i6();
    kc();
    B16();
    HH = t(P6(), 1)
})
// @from(Ln 415676, Col 0)
function g16(A, q) {
    d("tengu_transcript_view_enter", {}), q((K) => {
        if (K.viewingAgentTaskId === A && K.viewSelectionMode === "viewing-agent") return K;
        return {
            ...K,
            viewingAgentTaskId: A,
            viewSelectionMode: "viewing-agent"
        }
    })
}
// @from(Ln 415687, Col 0)
function ib(A) {
    d("tengu_transcript_view_exit", {}), A((q) => {
        if (q.viewingAgentTaskId === void 0 && q.viewSelectionMode === "none") return q;
        return {
            ...q,
            viewingAgentTaskId: void 0,
            viewSelectionMode: "none"
        }
    })
}
// @from(Ln 415697, Col 4)
wr6 = E(() => {
    V1()
})
// @from(Ln 415701, Col 0)
function h6z(A, q) {
    return Object.values(A ?? {}).filter(ij).filter((Y) => !(Y.type === "local_agent" && Y.id === q))
}
// @from(Ln 415705, Col 0)
function IR1({
    onDone: A,
    toolUseContext: q,
    initialDetailTaskId: K
}) {
    let Y = M1((Q) => Q.tasks),
        z = M1((Q) => Q.foregroundedTaskId),
        _ = M1((Q) => Q.expandedView) === "teammates",
        w = xA(),
        O = Y,
        $ = Kq.useRef(!1),
        [H, j] = v_6.useState(() => {
            if (K) return $.current = !0, {
                mode: "detail",
                itemId: K
            };
            let Q = h6z(O, z);
            if (Q.length === 1) return $.current = !0, {
                mode: "detail",
                itemId: Q[0].id
            };
            return {
                mode: "list"
            }
        }),
        [J, M] = v_6.useState(0);
    oj("background-tasks-dialog");
    let {
        bashTasks: D,
        remoteSessions: X,
        agentTasks: P,
        teammateTasks: W,
        workflowTasks: Z,
        allSelectableItems: G
    } = v_6.useMemo(() => {
        let r = Object.values(O ?? {}).filter(ij).map(S6z).sort((X6, z6) => {
                let N6 = X6.status,
                    $6 = z6.status;
                if (N6 === "running" && $6 !== "running") return -1;
                if (N6 !== "running" && $6 === "running") return 1;
                let n = "task" in X6 ? X6.task.startTime : 0;
                return ("task" in z6 ? z6.task.startTime : 0) - n
            }),
            e = r.filter((X6) => X6.type === "local_bash"),
            Y6 = r.filter((X6) => X6.type === "remote_agent"),
            H6 = r.filter((X6) => X6.type === "local_agent" && X6.id !== z),
            J6 = r.filter((X6) => X6.type === "local_workflow"),
            K6 = _ ? [] : r.filter((X6) => X6.type === "in_process_teammate"),
            s = K6.length > 0 ? [{
                id: "__leader__",
                type: "leader",
                label: `@${BY}`,
                status: "running"
            }] : [];
        return {
            bashTasks: e,
            remoteSessions: Y6,
            agentTasks: H6,
            workflowTasks: J6,
            teammateTasks: [...s, ...K6],
            allSelectableItems: [...s, ...K6, ...e, ...Y6, ...H6, ...J6]
        }
    }, [O, z, _]), f = G[J] ?? null;
    tA({
        "confirm:previous": () => M((Q) => Math.max(0, Q - 1)),
        "confirm:next": () => M((Q) => Math.min(G.length - 1, Q + 1)),
        "confirm:yes": () => {
            let Q = G[J];
            if (Q)
                if (Q.type === "leader") ib(w), A("Viewing leader", {
                    display: "system"
                });
                else j({
                    mode: "detail",
                    itemId: Q.id
                })
        }
    }, {
        context: "Confirmation",
        isActive: H.mode === "list"
    }), jA((Q, U) => {
        if (H.mode !== "list") return;
        let r = G[J];
        if (!r) return;
        if (Q === "x") {
            if (r.type === "local_bash" && r.status === "running") v(r.id);
            else if (r.type === "local_agent" && r.status === "running") N(r.id);
            else if (r.type === "in_process_teammate" && r.status === "running") V(r.id);
            else if (r.type === "local_workflow" && r.status === "running" && CR1) CR1(r.id, w)
        }
        if (Q === "f") {
            if (r.type === "in_process_teammate" && r.status === "running") g16(r.id, w), A("Viewing teammate", {
                display: "system"
            });
            else if (r.type === "leader") ib(w), A("Viewing leader", {
                display: "system"
            })
        }
    });
    async function v(Q) {
        await Lf6.kill(Q, {
            abortController: q.abortController,
            getAppState: q.getAppState,
            setAppState: w
        })
    }
    async function N(Q) {
        await Fk1.kill(Q, {
            abortController: q.abortController,
            getAppState: q.getAppState,
            setAppState: w
        })
    }
    async function V(Q) {
        await sQ6.kill(Q, {
            abortController: q.abortController,
            getAppState: q.getAppState,
            setAppState: w
        })
    }
    let L = Kq.useEffectEvent(A);
    v_6.useEffect(() => {
        if (H.mode !== "list") {
            let U = (O ?? {})[H.itemId];
            if (!U || U.type !== "local_workflow" && !ij(U))
                if ($.current) L("Background tasks dialog dismissed", {
                    display: "system"
                });
                else j({
                    mode: "list"
                })
        }
        let Q = G.length;
        if (J >= Q && Q > 0) M(Q - 1)
    }, [H, O, J, G, L]);
    let h = () => {
        if ($.current && G.length <= 1) A("Background tasks dialog dismissed", {
            display: "system"
        });
        else $.current = !1, j({
            mode: "list"
        })
    };
    if (H.mode !== "list" && O) {
        let Q = O[H.itemId];
        if (!Q) return null;
        switch (Q.type) {
            case "local_bash":
                return Kq.default.createElement(LJq, {
                    shell: Q,
                    onDone: A,
                    onKillShell: () => void v(Q.id),
                    onBack: h,
                    key: `shell-${Q.id}`
                });
            case "local_agent":
                return Kq.default.createElement(xJq, {
                    agent: Q,
                    onDone: A,
                    onKillAgent: () => void N(Q.id),
                    onBack: h,
                    key: `agent-${Q.id}`
                });
            case "remote_agent":
                return Kq.default.createElement(CJq, {
                    session: Q,
                    onDone: A,
                    toolUseContext: q,
                    onBack: h,
                    key: `session-${Q.id}`
                });
            case "in_process_teammate":
                return Kq.default.createElement(mJq, {
                    teammate: Q,
                    onDone: A,
                    onKill: Q.status === "running" ? () => void V(Q.id) : void 0,
                    onBack: h,
                    onForeground: Q.status === "running" ? () => {
                        g16(Q.id, w), A("Viewing teammate", {
                            display: "system"
                        })
                    } : void 0,
                    key: `teammate-${Q.id}`
                });
            case "local_workflow":
                if (!UJq) return null;
                return Kq.default.createElement(UJq, {
                    workflow: Q,
                    onDone: A,
                    onKill: Q.status === "running" && CR1 ? () => CR1(Q.id, w) : void 0,
                    onSkipAgent: Q.status === "running" && dJq ? (U) => dJq(Q.id, U, w) : void 0,
                    onRetryAgent: Q.status === "running" && cJq ? (U) => cJq(Q.id, U, w) : void 0,
                    onBack: h,
                    key: `workflow-${Q.id}`
                })
        }
    }
    let R = D.filter((Q) => Q.status === "running").length,
        u = X.filter((Q) => Q.status === "running" || Q.status === "pending").length + P.filter((Q) => Q.status === "running").length,
        I = W.filter((Q) => Q.status === "running").length,
        g = jh([...I > 0 ? [Kq.default.createElement(T, {
            key: "teammates"
        }, I, " ", I !== 1 ? "agents" : "agent")] : [], ...R > 0 ? [Kq.default.createElement(T, {
            key: "shells"
        }, R, " ", R !== 1 ? "active shells" : "active shell")] : [], ...u > 0 ? [Kq.default.createElement(T, {
            key: "agents"
        }, u, " ", u !== 1 ? "active agents" : "active agent")] : []], (Q) => Kq.default.createElement(T, {
            key: `separator-${Q}`
        }, " · ")),
        B = [Kq.default.createElement(a1, {
            key: "upDown",
            shortcut: "↑/↓",
            action: "select"
        }), Kq.default.createElement(a1, {
            key: "enter",
            shortcut: "Enter",
            action: "view"
        }), ...f?.type === "in_process_teammate" && f.status === "running" ? [Kq.default.createElement(a1, {
            key: "foreground",
            shortcut: "f",
            action: "foreground"
        })] : [], ...(f?.type === "local_bash" || f?.type === "local_agent" || f?.type === "in_process_teammate" || f?.type === "local_workflow") && f.status === "running" ? [Kq.default.createElement(a1, {
            key: "kill",
            shortcut: "x",
            action: "stop"
        })] : [], ...P.some((Q) => Q.status === "running") ? [Kq.default.createElement(a1, {
            key: "kill-all",
            shortcut: "ctrl+f",
            action: "stop all agents"
        })] : [], Kq.default.createElement(a1, {
            key: "esc",
            shortcut: "Esc",
            action: "close"
        })],
        b = () => A("Background tasks dialog dismissed", {
            display: "system"
        });

    function p(Q) {
        if (Q.pending) return Kq.default.createElement(T, null, "Press ", Q.keyName, " again to exit");
        return Kq.default.createElement(C8, null, B)
    }
    return Kq.default.createElement(m8, {
        title: "Background tasks",
        subtitle: Kq.default.createElement(Kq.default.Fragment, null, g),
        onCancel: b,
        color: "background",
        inputGuide: p
    }, G.length === 0 ? Kq.default.createElement(T, {
        dimColor: !0
    }, "No tasks currently running") : Kq.default.createElement(m, {
        flexDirection: "column"
    }, W.length > 0 && Kq.default.createElement(m, {
        flexDirection: "column"
    }, (D.length > 0 || X.length > 0 || P.length > 0) && Kq.default.createElement(T, {
        dimColor: !0
    }, Kq.default.createElement(T, {
        bold: !0
    }, "  ", "Agents"), " (", W.filter((Q) => Q.type !== "leader").length, ")"), Kq.default.createElement(m, {
        flexDirection: "column"
    }, (() => {
        let Q = W.filter((Y6) => Y6.type === "leader"),
            U = W.filter((Y6) => Y6.type === "in_process_teammate"),
            r = new Map;
        for (let Y6 of U) {
            let H6 = Y6.task.identity.teamName,
                J6 = r.get(H6);
            if (J6) J6.push(Y6);
            else r.set(H6, [Y6])
        }
        let e = [...r.entries()];
        return Kq.default.createElement(Kq.default.Fragment, null, e.map(([Y6, H6]) => {
            let J6 = H6.length + Q.length;
            return Kq.default.createElement(m, {
                key: Y6,
                flexDirection: "column"
            }, Kq.default.createElement(T, {
                dimColor: !0
            }, "  ", "Team: ", Y6, " (", J6, ")"), Q.map((K6) => Kq.default.createElement(DN6, {
                key: `${K6.id}-${Y6}`,
                item: K6,
                isSelected: K6.id === f?.id
            })), H6.map((K6) => Kq.default.createElement(DN6, {
                key: K6.id,
                item: K6,
                isSelected: K6.id === f?.id
            })))
        }))
    })())), D.length > 0 && Kq.default.createElement(m, {
        flexDirection: "column",
        marginTop: W.length > 0 ? 1 : 0
    }, (W.length > 0 || X.length > 0 || P.length > 0) && Kq.default.createElement(T, {
        dimColor: !0
    }, Kq.default.createElement(T, {
        bold: !0
    }, "  ", "Bashes"), " (", D.length, ")"), Kq.default.createElement(m, {
        flexDirection: "column"
    }, D.map((Q) => Kq.default.createElement(DN6, {
        key: Q.id,
        item: Q,
        isSelected: Q.id === f?.id
    })))), X.length > 0 && Kq.default.createElement(m, {
        flexDirection: "column",
        marginTop: W.length > 0 || D.length > 0 ? 1 : 0
    }, Kq.default.createElement(T, {
        dimColor: !0
    }, Kq.default.createElement(T, {
        bold: !0
    }, "  ", "Remote agents"), " (", X.length, ")"), Kq.default.createElement(m, {
        flexDirection: "column"
    }, X.map((Q) => Kq.default.createElement(DN6, {
        key: Q.id,
        item: Q,
        isSelected: Q.id === f?.id
    })))), P.length > 0 && Kq.default.createElement(m, {
        flexDirection: "column",
        marginTop: W.length > 0 || D.length > 0 || X.length > 0 ? 1 : 0
    }, Kq.default.createElement(T, {
        dimColor: !0
    }, Kq.default.createElement(T, {
        bold: !0
    }, "  ", "Local agents"), " (", P.length, ")"), Kq.default.createElement(m, {
        flexDirection: "column"
    }, P.map((Q) => Kq.default.createElement(DN6, {
        key: Q.id,
        item: Q,
        isSelected: Q.id === f?.id
    })))), Z.length > 0 && Kq.default.createElement(m, {
        flexDirection: "column",
        marginTop: W.length > 0 || D.length > 0 || X.length > 0 || P.length > 0 ? 1 : 0
    }, Kq.default.createElement(T, {
        dimColor: !0
    }, Kq.default.createElement(T, {
        bold: !0
    }, "  ", "Workflows"), " (", Z.length, ")"), Kq.default.createElement(m, {
        flexDirection: "column"
    }, Z.map((Q) => Kq.default.createElement(DN6, {
        key: Q.id,
        item: Q,
        isSelected: Q.id === f?.id
    }))))))
}
// @from(Ln 416048, Col 0)
function S6z(A) {
    switch (A.type) {
        case "local_bash":
            return {
                id: A.id, type: "local_bash", label: A.kind === "monitor" ? A.description : A.command, status: A.status, task: A
            };
        case "remote_agent":
            return {
                id: A.id, type: "remote_agent", label: A.title, status: A.status, task: A
            };
        case "local_agent":
            return {
                id: A.id, type: "local_agent", label: A.description, status: A.status, task: A
            };
        case "in_process_teammate":
            return {
                id: A.id, type: "in_process_teammate", label: `@${A.identity.agentName}`, status: A.status, task: A
            };
        case "local_workflow":
            return {
                id: A.id, type: "local_workflow", label: A.summary ?? A.description, status: A.status, task: A
            }
    }
}
// @from(Ln 416073, Col 0)
function DN6(A) {
    let q = A6(14),
        {
            item: K,
            isSelected: Y
        } = A,
        {
            columns: z
        } = KA(),
        _ = Math.max(30, z - 26),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = e2(), q[0] = w;
    else w = q[0];
    let O = w,
        $ = O && Y,
        H = Y ? a6.pointer + " " : "  ",
        j;
    if (q[1] !== $ || q[2] !== H) j = Kq.default.createElement(T, {
        dimColor: $
    }, H), q[1] = $, q[2] = H, q[3] = j;
    else j = q[3];
    let J = Y && !O ? "suggestion" : void 0,
        M;
    if (q[4] !== K.task || q[5] !== K.type || q[6] !== _) M = K.type === "leader" ? Kq.default.createElement(T, null, "@", BY) : Kq.default.createElement(pJq, {
        task: K.task,
        maxActivityWidth: _
    }), q[4] = K.task, q[5] = K.type, q[6] = _, q[7] = M;
    else M = q[7];
    let D;
    if (q[8] !== J || q[9] !== M) D = Kq.default.createElement(T, {
        color: J
    }, M), q[8] = J, q[9] = M, q[10] = D;
    else D = q[10];
    let X;
    if (q[11] !== j || q[12] !== D) X = Kq.default.createElement(m, {
        flexDirection: "row"
    }, j, D), q[11] = j, q[12] = D, q[13] = X;
    else X = q[13];
    return X
}
// @from(Ln 416113, Col 4)
Kq
// @from(Ln 416113, Col 8)
v_6
// @from(Ln 416113, Col 13)
UJq = null
// @from(Ln 416114, Col 4)
ec8 = null
// @from(Ln 416115, Col 4)
CR1
// @from(Ln 416115, Col 9)
dJq
// @from(Ln 416115, Col 14)
cJq
// @from(Ln 416116, Col 4)
Al8 = E(() => {
    e6();
    i6();
    _7();
    fZ();
    b7();
    RJq();
    IJq();
    uJq();
    BJq();
    NA();
    Rf6();
    Vb();
    sk();
    QJq();
    _q();
    Lq();
    Xq();
    wq();
    wr6();
    Fv();
    Kq = t(P6(), 1), v_6 = t(P6(), 1), CR1 = ec8?.killWorkflowTask ?? null, dJq = ec8?.skipWorkflowAgent ?? null, cJq = ec8?.retryWorkflowAgent ?? null
})
// @from(Ln 416139, Col 4)
lJq = {}
// @from(Ln 416143, Col 0)
async function C6z(A, q) {
    return ql8.createElement(IR1, {
        toolUseContext: q,
        onDone: A
    })
}
// @from(Ln 416149, Col 4)
ql8
// @from(Ln 416150, Col 4)
iJq = E(() => {
    Al8();
    ql8 = t(P6(), 1)
})
// @from(Ln 416154, Col 4)
I6z
// @from(Ln 416154, Col 9)
nJq
// @from(Ln 416155, Col 4)
rJq = E(() => {
    I6z = {
        type: "local-jsx",
        name: "tasks",
        aliases: ["bashes"],
        description: "List and manage background tasks",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (iJq(), lJq)),
        userFacingName() {
            return "tasks"
        }
    }, nJq = I6z
})
// @from(Ln 416169, Col 4)
oJq
// @from(Ln 416170, Col 4)
aJq = E(() => {
    oJq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 416177, Col 4)
b6z = `---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Bash(git remote show:*), Read, Glob, Grep, LS, Task
description: Complete a security review of the pending changes on the current branch
---

You are a senior security engineer conducting a focused security review of the changes on this branch.

GIT STATUS:

\`\`\`
!\`git status\`
\`\`\`

FILES MODIFIED:

\`\`\`
!\`git diff --name-only origin/HEAD...\`
\`\`\`

COMMITS:

\`\`\`
!\`git log --no-decorate origin/HEAD...\`
\`\`\`

DIFF CONTENT:

\`\`\`
!\`git diff origin/HEAD...\`
\`\`\`

Review the complete diff above. This contains all code changes in the PR.


OBJECTIVE:
Perform a security-focused code review to identify HIGH-CONFIDENCE security vulnerabilities that could have real exploitation potential. This is not a general code review - focus ONLY on security implications newly added by this PR. Do not comment on existing security concerns.

CRITICAL INSTRUCTIONS:
1. MINIMIZE FALSE POSITIVES: Only flag issues where you're >80% confident of actual exploitability
2. AVOID NOISE: Skip theoretical issues, style concerns, or low-impact findings
3. FOCUS ON IMPACT: Prioritize vulnerabilities that could lead to unauthorized access, data breaches, or system compromise
4. EXCLUSIONS: Do NOT report the following issue types:
   - Denial of Service (DOS) vulnerabilities, even if they allow service disruption
   - Secrets or sensitive data stored on disk (these are handled by other processes)
   - Rate limiting or resource exhaustion issues

SECURITY CATEGORIES TO EXAMINE:

**Input Validation Vulnerabilities:**
- SQL injection via unsanitized user input
- Command injection in system calls or subprocesses
- XXE injection in XML parsing
- Template injection in templating engines
- NoSQL injection in database queries
- Path traversal in file operations

**Authentication & Authorization Issues:**
- Authentication bypass logic
- Privilege escalation paths
- Session management flaws
- JWT token vulnerabilities
- Authorization logic bypasses

**Crypto & Secrets Management:**
- Hardcoded API keys, passwords, or tokens
- Weak cryptographic algorithms or implementations
- Improper key storage or management
- Cryptographic randomness issues
- Certificate validation bypasses

**Injection & Code Execution:**
- Remote code execution via deseralization
- Pickle injection in Python
- YAML deserialization vulnerabilities
- Eval injection in dynamic code execution
- XSS vulnerabilities in web applications (reflected, stored, DOM-based)

**Data Exposure:**
- Sensitive data logging or storage
- PII handling violations
- API endpoint data leakage
- Debug information exposure

Additional notes:
- Even if something is only exploitable from the local network, it can still be a HIGH severity issue

ANALYSIS METHODOLOGY:

Phase 1 - Repository Context Research (Use file search tools):
- Identify existing security frameworks and libraries in use
- Look for established secure coding patterns in the codebase
- Examine existing sanitization and validation patterns
- Understand the project's security model and threat model

Phase 2 - Comparative Analysis:
- Compare new code changes against existing security patterns
- Identify deviations from established secure practices
- Look for inconsistent security implementations
- Flag code that introduces new attack surfaces

Phase 3 - Vulnerability Assessment:
- Examine each modified file for security implications
- Trace data flow from user inputs to sensitive operations
- Look for privilege boundaries being crossed unsafely
- Identify injection points and unsafe deserialization

REQUIRED OUTPUT FORMAT:

You MUST output your findings in markdown. The markdown output should contain the file, line number, severity, category (e.g. \`sql_injection\` or \`xss\`), description, exploit scenario, and fix recommendation.

For example:

# Vuln 1: XSS: \`foo.py:42\`

* Severity: High
* Description: User input from \`username\` parameter is directly interpolated into HTML without escaping, allowing reflected XSS attacks
* Exploit Scenario: Attacker crafts URL like /bar?q=<script>alert(document.cookie)</script> to execute JavaScript in victim's browser, enabling session hijacking or data theft
* Recommendation: Use Flask's escape() function or Jinja2 templates with auto-escaping enabled for all user inputs rendered in HTML

SEVERITY GUIDELINES:
- **HIGH**: Directly exploitable vulnerabilities leading to RCE, data breach, or authentication bypass
- **MEDIUM**: Vulnerabilities requiring specific conditions but with significant impact
- **LOW**: Defense-in-depth issues or lower-impact vulnerabilities

CONFIDENCE SCORING:
- 0.9-1.0: Certain exploit path identified, tested if possible
- 0.8-0.9: Clear vulnerability pattern with known exploitation methods
- 0.7-0.8: Suspicious pattern requiring specific conditions to exploit
- Below 0.7: Don't report (too speculative)

FINAL REMINDER:
Focus on HIGH and MEDIUM findings only. Better to miss some theoretical issues than flood the report with false positives. Each finding should be something a security engineer would confidently raise in a PR review.

FALSE POSITIVE FILTERING:

> You do not need to run commands to reproduce the vulnerability, just read the code to determine if it is a real vulnerability. Do not use the bash tool or write to any files.
>
> HARD EXCLUSIONS - Automatically exclude findings matching these patterns:
> 1. Denial of Service (DOS) vulnerabilities or resource exhaustion attacks.
> 2. Secrets or credentials stored on disk if they are otherwise secured.
> 3. Rate limiting concerns or service overload scenarios.
> 4. Memory consumption or CPU exhaustion issues.
> 5. Lack of input validation on non-security-critical fields without proven security impact.
> 6. Input sanitization concerns for GitHub Action workflows unless they are clearly triggerable via untrusted input.
> 7. A lack of hardening measures. Code is not expected to implement all security best practices, only flag concrete vulnerabilities.
> 8. Race conditions or timing attacks that are theoretical rather than practical issues. Only report a race condition if it is concretely problematic.
> 9. Vulnerabilities related to outdated third-party libraries. These are managed separately and should not be reported here.
> 10. Memory safety issues such as buffer overflows or use-after-free-vulnerabilities are impossible in rust. Do not report memory safety issues in rust or any other memory safe languages.
> 11. Files that are only unit tests or only used as part of running tests.
> 12. Log spoofing concerns. Outputting un-sanitized user input to logs is not a vulnerability.
> 13. SSRF vulnerabilities that only control the path. SSRF is only a concern if it can control the host or protocol.
> 14. Including user-controlled content in AI system prompts is not a vulnerability.
> 15. Regex injection. Injecting untrusted content into a regex is not a vulnerability.
> 16. Regex DOS concerns.
> 16. Insecure documentation. Do not report any findings in documentation files such as markdown files.
> 17. A lack of audit logs is not a vulnerability.
>
> PRECEDENTS -
> 1. Logging high value secrets in plaintext is a vulnerability. Logging URLs is assumed to be safe.
> 2. UUIDs can be assumed to be unguessable and do not need to be validated.
> 3. Environment variables and CLI flags are trusted values. Attackers are generally not able to modify them in a secure environment. Any attack that relies on controlling an environment variable is invalid.
> 4. Resource management issues such as memory or file descriptor leaks are not valid.
> 5. Subtle or low impact web vulnerabilities such as tabnabbing, XS-Leaks, prototype pollution, and open redirects should not be reported unless they are extremely high confidence.
> 6. React and Angular are generally secure against XSS. These frameworks do not need to sanitize or escape user input unless it is using dangerouslySetInnerHTML, bypassSecurityTrustHtml, or similar methods. Do not report XSS vulnerabilities in React or Angular components or tsx files unless they are using unsafe methods.
> 7. Most vulnerabilities in github action workflows are not exploitable in practice. Before validating a github action workflow vulnerability ensure it is concrete and has a very specific attack path.
> 8. A lack of permission checking or authentication in client-side JS/TS code is not a vulnerability. Client-side code is not trusted and does not need to implement these checks, they are handled on the server-side. The same applies to all flows that send untrusted data to the backend, the backend is responsible for validating and sanitizing all inputs.
> 9. Only include MEDIUM findings if they are obvious and concrete issues.
> 10. Most vulnerabilities in ipython notebooks (*.ipynb files) are not exploitable in practice. Before validating a notebook vulnerability ensure it is concrete and has a very specific attack path where untrusted input can trigger the vulnerability.
> 11. Logging non-PII data is not a vulnerability even if the data may be sensitive. Only report logging vulnerabilities if they expose sensitive information such as secrets, passwords, or personally identifiable information (PII).
> 12. Command injection vulnerabilities in shell scripts are generally not exploitable in practice since shell scripts generally do not run with untrusted user input. Only report command injection vulnerabilities in shell scripts if they are concrete and have a very specific attack path for untrusted input.
>
> SIGNAL QUALITY CRITERIA - For remaining findings, assess:
> 1. Is there a concrete, exploitable vulnerability with a clear attack path?
> 2. Does this represent a real security risk vs theoretical best practice?
> 3. Are there specific code locations and reproduction steps?
> 4. Would this finding be actionable for a security team?
>
> For each finding, assign a confidence score from 1-10:
> - 1-3: Low confidence, likely false positive or noise
> - 4-6: Medium confidence, needs investigation
> - 7-10: High confidence, likely true vulnerability

START ANALYSIS:

Begin your analysis now. Do this in 3 steps:

1. Use a sub-task to identify vulnerabilities. Use the repository exploration tools to understand the codebase context, then analyze the PR changes for security implications. In the prompt for this sub-task, include all of the above.
2. Then for each vulnerability identified by the above sub-task, create a new sub-task to filter out false-positives. Launch these sub-tasks as parallel sub-tasks. In the prompt for these sub-tasks, include everything in the "FALSE POSITIVE FILTERING" instructions.
3. Filter out any vulnerabilities where the sub-task reported a confidence less than 8.

Your final reply must contain the markdown report and nothing else.`
// @from(Ln 416368, Col 4)
sJq
// @from(Ln 416369, Col 4)
tJq = E(() => {
    TW6();
    BG();
    td();
    sJq = YN6({
        name: "security-review",
        description: "Complete a security review of the pending changes on the current branch",
        progressMessage: "analyzing code changes for security risks",
        pluginName: "security-review",
        pluginCommand: "security-review",
        async getPromptWhileMarketplaceIsPrivate(A, q) {
            let K = BH(b6z),
                Y = LI(K.frontmatter["allowed-tools"]);
            return [{
                type: "text",
                text: await uB(K.content, {
                    ...q,
                    getAppState() {
                        let _ = q.getAppState();
                        return {
                            ..._,
                            toolPermissionContext: {
                                ..._.toolPermissionContext,
                                alwaysAllowRules: {
                                    ..._.toolPermissionContext.alwaysAllowRules,
                                    command: Y
                                }
                            }
                        }
                    }
                }, "security-review")
            }]
        }
    })
})
// @from(Ln 416404, Col 4)
eJq
// @from(Ln 416405, Col 4)
AMq = E(() => {
    eJq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 416412, Col 4)
qMq = {}
// @from(Ln 416416, Col 4)
Kl8
// @from(Ln 416416, Col 9)
x6z = async (A, q) => {
    return Kl8.createElement(Vv6, {
        onClose: A,
        context: q,
        defaultTab: "Usage"
    })
}
// @from(Ln 416423, Col 4)
KMq = E(() => {
    By1();
    Kl8 = t(P6(), 1)
})
// @from(Ln 416427, Col 4)
Yl8
// @from(Ln 416428, Col 4)
YMq = E(() => {
    Yl8 = {
        type: "local-jsx",
        name: "usage",
        description: "Show plan usage limits",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (KMq(), qMq)),
        userFacingName() {
            return "usage"
        }
    }
})
// @from(Ln 416441, Col 4)
zMq = {}
// @from(Ln 416446, Col 0)
function u6z(A) {
    let q = A6(8),
        {
            onDone: K
        } = A,
        [, Y] = z7(),
        z;
    if (q[0] !== K || q[1] !== Y) z = (O) => {
        Y(O), K(`Theme set to ${O}`)
    }, q[0] = K, q[1] = Y, q[2] = z;
    else z = q[2];
    let _;
    if (q[3] !== K) _ = () => {
        K("Theme picker dismissed", {
            display: "system"
        })
    }, q[3] = K, q[4] = _;
    else _ = q[4];
    let w;
    if (q[5] !== z || q[6] !== _) w = N_6.createElement(S3, {
        color: "permission"
    }, N_6.createElement(Gv6, {
        onThemeSelect: z,
        onCancel: _,
        skipExitHandling: !0
    })), q[5] = z, q[6] = _, q[7] = w;
    else w = q[7];
    return w
}
// @from(Ln 416475, Col 4)
N_6
// @from(Ln 416475, Col 9)
m6z = async (A, q) => {
    return N_6.createElement(u6z, {
        onDone: A
    })
}
// @from(Ln 416480, Col 4)
_Mq = E(() => {
    e6();
    i6();
    Sy1();
    FJ();
    N_6 = t(P6(), 1)
})
// @from(Ln 416487, Col 4)
B6z
// @from(Ln 416487, Col 9)
zl8
// @from(Ln 416488, Col 4)
wMq = E(() => {
    B6z = {
        type: "local-jsx",
        name: "theme",
        description: "Change the theme",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (_Mq(), zMq)),
        userFacingName() {
            return "theme"
        }
    }, zl8 = B6z
})
// @from(Ln 416501, Col 4)
OMq = {}
// @from(Ln 416505, Col 4)
g6z = async () => {
    let q = X1().editorMode || "normal";
    if (q === "emacs") q = "normal";
    let K = q === "normal" ? "vim" : "normal";
    return d1((Y) => ({
        ...Y,
        editorMode: K
    })), d("tengu_editor_mode_changed", {
        mode: K,
        source: "command"
    }), {
        type: "text",
        value: `Editor mode set to ${K}. ${K==="vim"?"Use Escape key to toggle between INSERT and NORMAL modes.":"Using standard (readline) keyboard bindings."}`
    }
}
// @from(Ln 416520, Col 4)
$Mq = E(() => {
    k8();
    V1()
})
// @from(Ln 416524, Col 4)
F6z
// @from(Ln 416524, Col 9)
_l8
// @from(Ln 416525, Col 4)
HMq = E(() => {
    F6z = {
        name: "vim",
        description: "Toggle between Vim and Normal editing modes",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        type: "local",
        userFacingName: () => "vim",
        load: () => Promise.resolve().then(() => ($Mq(), OMq))
    }, _l8 = F6z
})
// @from(Ln 416537, Col 4)
MMq = {}
// @from(Ln 416546, Col 0)
function jMq() {
    return db
}
// @from(Ln 416550, Col 0)
function Q6z() {
    return p6z
}
// @from(Ln 416554, Col 0)
function JMq() {
    return `thinkback@${jMq()}`
}
// @from(Ln 416557, Col 0)
async function d6z() {
    let {
        enabled: A
    } = await _z(), q = A.find((Y) => Y.name === "thinkback" || Y.source && Y.source.includes(JMq()));
    if (!q) return null;
    let K = bR1(q.path, "skills", U6z);
    if (await uK(K)) return K;
    return null
}
// @from(Ln 416566, Col 0)
async function xR1(A) {
    let q = bR1(A, "player.js");
    if (!await uK(q)) return {
        success: !1,
        message: "Player script not found. The player.js file is missing from the thinkback skill."
    };
    let K = FP.get(process.stdout);
    if (!K) return {
        success: !1,
        message: "Failed to access terminal instance"
    };
    K.enterAlternateScreen();
    try {
        await q9("node", [q], {
            stdio: "inherit",
            cwd: A,
            reject: !1
        })
    } catch {} finally {
        K.exitAlternateScreen()
    }
    let Y = bR1(A, "year_in_review.html");
    if (await uK(Y)) {
        let z = y8();
        z8(z === "macos" ? "open" : z === "windows" ? "start" : "xdg-open", [Y])
    }
    return {
        success: !0,
        message: "Year in review animation complete!"
    }
}
// @from(Ln 416598, Col 0)
function c6z({
    onReady: A,
    onError: q
}) {
    let [K, Y] = Sh.useState({
        phase: "checking"
    }), [z, _] = Sh.useState("");
    if (Sh.useEffect(() => {
            async function O() {
                try {
                    let $ = await C3(),
                        H = jMq(),
                        j = Q6z(),
                        J = JMq(),
                        M = H in $,
                        D = iB(J);
                    if (!M) Y({
                        phase: "installing-marketplace"
                    }), k(`Installing marketplace ${j}`), await sB({
                        source: "github",
                        repo: j
                    }, (X) => {
                        _(X)
                    }), HY(), k(`Marketplace ${H} installed`);
                    else if (!D) Y({
                        phase: "installing-marketplace"
                    }), _("Updating marketplace…"), k(`Refreshing marketplace ${H}`), await we(H, (X) => {
                        _(X)
                    }), QI(), HY(), k(`Marketplace ${H} refreshed`);
                    if (!D) {
                        Y({
                            phase: "installing-plugin"
                        }), k(`Installing plugin ${J}`);
                        let X = await tU8([J]);
                        if (X.failed.length > 0) {
                            let P = X.failed.map((W) => `${W.name}: ${W.error}`).join(", ");
                            throw Error(`Failed to install plugin: ${P}`)
                        }
                        HY(), k(`Plugin ${J} installed`)
                    } else {
                        let {
                            disabled: X
                        } = await _z();
                        if (X.some((W) => W.name === "thinkback" || W.source?.includes(J))) {
                            Y({
                                phase: "enabling-plugin"
                            }), k(`Enabling plugin ${J}`);
                            let W = await ol(J);
                            if (!W.success) throw Error(`Failed to enable plugin: ${W.message}`);
                            HY(), k(`Plugin ${J} enabled`)
                        }
                    }
                    Y({
                        phase: "ready"
                    }), A()
                } catch ($) {
                    let H = $ instanceof Error ? $ : Error(String($));
                    _6(H), Y({
                        phase: "error",
                        message: H.message
                    }), q(H.message)
                }
            }
            O()
        }, [A, q]), K.phase === "error") return a5.createElement(m, {
        flexDirection: "column"
    }, a5.createElement(T, {
        color: "error"
    }, "Error: ", K.message));
    if (K.phase === "ready") return null;
    let w = K.phase === "checking" ? "Checking thinkback installation…" : K.phase === "installing-marketplace" ? "Installing marketplace…" : K.phase === "enabling-plugin" ? "Enabling thinkback plugin…" : "Installing thinkback plugin…";
    return a5.createElement(m, {
        flexDirection: "column"
    }, a5.createElement(m, null, a5.createElement(Wq, null), a5.createElement(T, null, z || w)))
}
// @from(Ln 416674, Col 0)
function l6z(A) {
    let q = A6(19),
        {
            onDone: K,
            onAction: Y,
            skillDir: z,
            hasGenerated: _
        } = A,
        [w, O] = Sh.useState(!1),
        $;
    if (q[0] !== _) $ = _ ? [{
        label: "Play animation",
        value: "play",
        description: "Watch your year in review"
    }, {
        label: "Edit content",
        value: "edit",
        description: "Modify the animation"
    }, {
        label: "Fix errors",
        value: "fix",
        description: "Fix validation or rendering issues"
    }, {
        label: "Regenerate",
        value: "regenerate",
        description: "Create a new animation from scratch"
    }] : [{
        label: "Let's go!",
        value: "regenerate",
        description: "Generate your personalized animation"
    }], q[0] = _, q[1] = $;
    else $ = q[1];
    let H = $,
        j;
    if (q[2] !== Y || q[3] !== K || q[4] !== z) j = function(f) {
        if (O(!0), f === "play") xR1(z).then(() => {
            K(void 0, {
                display: "skip"
            })
        });
        else Y(f)
    }, q[2] = Y, q[3] = K, q[4] = z, q[5] = j;
    else j = q[5];
    let J = j,
        M;
    if (q[6] !== K) M = function() {
        K(void 0, {
            display: "skip"
        })
    }, q[6] = K, q[7] = M;
    else M = q[7];
    let D = M;
    if (w) return null;
    let X;
    if (q[8] !== _) X = !_ && a5.createElement(m, {
        flexDirection: "column"
    }, a5.createElement(T, null, "Relive your year of coding with Claude."), a5.createElement(T, {
        dimColor: !0
    }, "We'll create a personalized ASCII animation celebrating your journey.")), q[8] = _, q[9] = X;
    else X = q[9];
    let P;
    if (q[10] !== J || q[11] !== H) P = a5.createElement(T8, {
        options: H,
        onChange: J,
        visibleOptionCount: 5
    }), q[10] = J, q[11] = H, q[12] = P;
    else P = q[12];
    let W;
    if (q[13] !== X || q[14] !== P) W = a5.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, X, P), q[13] = X, q[14] = P, q[15] = W;
    else W = q[15];
    let Z;
    if (q[16] !== D || q[17] !== W) Z = a5.createElement(m8, {
        title: "Think Back on 2025 with Claude Code",
        subtitle: "Generate your 2025 Claude Code Think Back (takes a few minutes to run)",
        onCancel: D,
        color: "claude"
    }, W), q[16] = D, q[17] = W, q[18] = Z;
    else Z = q[18];
    return Z
}
// @from(Ln 416758, Col 0)
function o6z(A) {
    let q = A6(27),
        {
            onDone: K
        } = A,
        [Y, z] = Sh.useState(!1),
        [_, w] = Sh.useState(null),
        [O, $] = Sh.useState(null),
        [H, j] = Sh.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = function() {
        z(!0)
    }, q[0] = J;
    else J = q[0];
    let M = J,
        D;
    if (q[1] !== K) D = (V) => {
        w(V), K(`Error with thinkback: ${V}. Try running /plugin to manually install the think-back plugin.`, {
            display: "system"
        })
    }, q[1] = K, q[2] = D;
    else D = q[2];
    let X = D,
        P, W;
    if (q[3] !== X || q[4] !== Y || q[5] !== _ || q[6] !== O) P = () => {
        if (Y && !O && !_) d6z().then((V) => {
            if (V) k(`Thinkback skill directory: ${V}`), $(V);
            else X("Could not find thinkback skill directory")
        })
    }, W = [Y, O, _, X], q[3] = X, q[4] = Y, q[5] = _, q[6] = O, q[7] = P, q[8] = W;
    else P = q[7], W = q[8];
    Sh.useEffect(P, W);
    let Z, G;
    if (q[9] !== O) Z = () => {
        if (!O) return;
        let V = bR1(O, "year_in_review.js");
        uK(V).then((L) => {
            k(`Checking for ${V}: ${L?"found":"not found"}`), j(L)
        })
    }, G = [O], q[9] = O, q[10] = Z, q[11] = G;
    else Z = q[10], G = q[11];
    Sh.useEffect(Z, G);
    let f;
    if (q[12] !== K) f = function(L) {
        K({
            edit: i6z,
            fix: n6z,
            regenerate: r6z
        } [L], {
            display: "user",
            shouldQuery: !0
        })
    }, q[12] = K, q[13] = f;
    else f = q[13];
    let v = f;
    if (_) {
        let V;
        if (q[14] !== _) V = a5.createElement(T, {
            color: "error"
        }, "Error: ", _), q[14] = _, q[15] = V;
        else V = q[15];
        let L;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) L = a5.createElement(T, {
            dimColor: !0
        }, "Try running /plugin to manually install the think-back plugin."), q[16] = L;
        else L = q[16];
        let h;
        if (q[17] !== V) h = a5.createElement(m, {
            flexDirection: "column"
        }, V, L), q[17] = V, q[18] = h;
        else h = q[18];
        return h
    }
    if (!Y) {
        let V;
        if (q[19] !== X) V = a5.createElement(c6z, {
            onReady: M,
            onError: X
        }), q[19] = X, q[20] = V;
        else V = q[20];
        return V
    }
    if (!O || H === null) {
        let V;
        if (q[21] === Symbol.for("react.memo_cache_sentinel")) V = a5.createElement(m, null, a5.createElement(Wq, null), a5.createElement(T, null, "Loading thinkback skill…")), q[21] = V;
        else V = q[21];
        return V
    }
    let N;
    if (q[22] !== v || q[23] !== H || q[24] !== K || q[25] !== O) N = a5.createElement(l6z, {
        onDone: K,
        onAction: v,
        skillDir: O,
        hasGenerated: H
    }), q[22] = v, q[23] = H, q[24] = K, q[25] = O, q[26] = N;
    else N = q[26];
    return N
}
// @from(Ln 416856, Col 0)
async function a6z(A) {
    return a5.createElement(o6z, {
        onDone: A
    })
}
// @from(Ln 416861, Col 4)
a5
// @from(Ln 416861, Col 8)
Sh
// @from(Ln 416861, Col 12)
p6z = "anthropics/claude-plugins-official"
// @from(Ln 416862, Col 4)
U6z = "thinkback"
// @from(Ln 416863, Col 4)
i6z = 'Use the Skill tool to invoke the "thinkback" skill with mode=edit to modify my existing Claude Code year in review animation. Ask me what I want to change. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 416864, Col 4)
n6z = 'Use the Skill tool to invoke the "thinkback" skill with mode=fix to fix validation or rendering errors in my existing Claude Code year in review animation. Run the validator, identify errors, and fix them. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 416865, Col 4)
r6z = 'Use the Skill tool to invoke the "thinkback" skill with mode=regenerate to create a completely new Claude Code year in review animation from scratch. Delete the existing animation and start fresh. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 416866, Col 4)
wl8 = E(() => {
    e6();
    i6();
    wq();
    WW();
    Z7();
    bU();
    YK();
    Eq();
    v3();
    Aw();
    fX();
    __6();
    tH();
    pv6();
    Uv();
    LO();
    H1();
    k1();
    lv6();
    a5 = t(P6(), 1), Sh = t(P6(), 1)
})
// @from(Ln 416888, Col 4)
s6z
// @from(Ln 416888, Col 9)
DMq
// @from(Ln 416889, Col 4)
XMq = E(() => {
    HA();
    s6z = {
        type: "local-jsx",
        name: "think-back",
        description: "Your 2025 Claude Code Year in Review",
        isEnabled: () => jY("tengu_thinkback"),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (wl8(), MMq)),
        userFacingName() {
            return "think-back"
        }
    }, DMq = s6z
})
// @from(Ln 416903, Col 4)
WMq = {}
// @from(Ln 416911, Col 0)
function e6z() {
    return `thinkback@${db}`
}
// @from(Ln 416914, Col 0)
async function A1z() {
    let A = DZ(),
        q = e6z(),
        K = A.plugins[q];
    if (!K || K.length === 0) return {
        type: "text",
        value: "Thinkback plugin not installed. Run /think-back first to install it."
    };
    let Y = K[0];
    if (!Y?.installPath) return {
        type: "text",
        value: "Thinkback plugin installation path not found."
    };
    let z = PMq(Y.installPath, "skills", t6z),
        _ = PMq(z, "year_in_review.js");
    if (!await uK(_)) return {
        type: "text",
        value: "No animation found. Run /think-back first to generate one."
    };
    return {
        type: "text",
        value: (await xR1(z)).message
    }
}
// @from(Ln 416938, Col 4)
t6z = "thinkback"
// @from(Ln 416939, Col 4)
ZMq = E(() => {
    Z7();
    wl8();
    fX();
    lv6()
})
// @from(Ln 416945, Col 4)
q1z
// @from(Ln 416945, Col 9)
GMq
// @from(Ln 416946, Col 4)
fMq = E(() => {
    HA();
    q1z = {
        type: "local",
        name: "thinkback-play",
        description: "Play the thinkback animation",
        isEnabled: () => jY("tengu_thinkback"),
        isHidden: !0,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (ZMq(), WMq)),
        userFacingName() {
            return "thinkback-play"
        }
    }, GMq = q1z
})
// @from(Ln 416962, Col 0)
function uR1(A) {
    let q = A6(9),
        {
            ruleValue: K
        } = A;
    switch (K.toolName) {
        case J4.name:
            if (K.ruleContent)
                if (K.ruleContent.endsWith(":*")) {
                    let Y;
                    if (q[0] !== K.ruleContent) Y = K.ruleContent.slice(0, -2), q[0] = K.ruleContent, q[1] = Y;
                    else Y = q[1];
                    let z;
                    if (q[2] !== Y) z = df.createElement(T, {
                        dimColor: !0
                    }, "Any Bash command starting with", " ", df.createElement(T, {
                        bold: !0
                    }, Y)), q[2] = Y, q[3] = z;
                    else z = q[3];
                    return z
                } else {
                    let Y;
                    if (q[4] !== K.ruleContent) Y = df.createElement(T, {
                        dimColor: !0
                    }, "The Bash command ", df.createElement(T, {
                        bold: !0
                    }, K.ruleContent)), q[4] = K.ruleContent, q[5] = Y;
                    else Y = q[5];
                    return Y
                }
            else {
                let Y;
                if (q[6] === Symbol.for("react.memo_cache_sentinel")) Y = df.createElement(T, {
                    dimColor: !0
                }, "Any Bash command"), q[6] = Y;
                else Y = q[6];
                return Y
            }
        default:
            if (!K.ruleContent) {
                let Y;
                if (q[7] !== K.toolName) Y = df.createElement(T, {
                    dimColor: !0
                }, "Any use of the ", df.createElement(T, {
                    bold: !0
                }, K.toolName), " tool"), q[7] = K.toolName, q[8] = Y;
                else Y = q[8];
                return Y
            } else return null
    }
}
// @from(Ln 417013, Col 4)
df
// @from(Ln 417014, Col 4)
Ol8 = E(() => {
    e6();
    i6();
    OZ();
    df = t(P6(), 1)
})
// @from(Ln 417021, Col 0)
function K1z(A) {
    switch (A) {
        case "localSettings":
            return {
                label: "Project settings (local)", description: `Saved in ${Yz6("localSettings")}`, value: A
            };
        case "projectSettings":
            return {
                label: "Project settings", description: `Checked in at ${Yz6("projectSettings")}`, value: A
            };
        case "userSettings":
            return {
                label: "User settings", description: "Saved in at ~/.claude/settings.json", value: A
            }
    }
}
// @from(Ln 417038, Col 0)
function TMq(A) {
    let q = A6(24),
        {
            onAddRules: K,
            onCancel: Y,
            ruleValues: z,
            ruleBehavior: _,
            initialContext: w,
            setToolPermissionContext: O
        } = A,
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = kC6.map(K1z), q[0] = $;
    else $ = q[0];
    let H = $,
        j;
    if (q[1] !== w || q[2] !== K || q[3] !== Y || q[4] !== _ || q[5] !== z || q[6] !== O) j = (v) => {
        if (v === "cancel") {
            Y();
            return
        } else if (kC6.includes(v)) {
            let N = v,
                V = Ez(w, {
                    type: "addRules",
                    rules: z,
                    behavior: _,
                    destination: N
                });
            Ym({
                type: "addRules",
                rules: z,
                behavior: _,
                destination: N
            }), O(V);
            let L = z.map((I) => ({
                    ruleValue: I,
                    ruleBehavior: _,
                    source: N
                })),
                h = vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled(),
                u = Ev6(V, {
                    sandboxAutoAllowEnabled: h
                }).filter((I) => z.some((g) => g.toolName === I.rule.ruleValue.toolName && g.ruleContent === I.rule.ruleValue.ruleContent));
            K(L, u.length > 0 ? u : void 0)
        }
    }, q[1] = w, q[2] = K, q[3] = Y, q[4] = _, q[5] = z, q[6] = O, q[7] = j;
    else j = q[7];
    let J = j,
        M = `Add ${_} permission rule${z.length===1?"":"s"}`,
        D;
    if (q[8] !== z) D = z.map(Y1z), q[8] = z, q[9] = D;
    else D = q[9];
    let X;
    if (q[10] !== D) X = r0.createElement(m, {
        flexDirection: "column",
        paddingX: 2
    }, D), q[10] = D, q[11] = X;
    else X = q[11];
    let P = z.length === 1 ? "Where should this rule be saved?" : "Where should these rules be saved?",
        W;
    if (q[12] !== P) W = r0.createElement(T, null, P), q[12] = P, q[13] = W;
    else W = q[13];
    let Z;
    if (q[14] !== J) Z = r0.createElement(T8, {
        options: H,
        onChange: J
    }), q[14] = J, q[15] = Z;
    else Z = q[15];
    let G;
    if (q[16] !== W || q[17] !== Z) G = r0.createElement(m, {
        flexDirection: "column",
        marginY: 1
    }, W, Z), q[16] = W, q[17] = Z, q[18] = G;
    else G = q[18];
    let f;
    if (q[19] !== Y || q[20] !== X || q[21] !== G || q[22] !== M) f = r0.createElement(m8, {
        title: M,
        onCancel: Y,
        color: "permission"
    }, X, G), q[19] = Y, q[20] = X, q[21] = G, q[22] = M, q[23] = f;
    else f = q[23];
    return f
}
// @from(Ln 417121, Col 0)
function Y1z(A) {
    return r0.createElement(m, {
        flexDirection: "column",
        key: L5(A)
    }, r0.createElement(T, {
        bold: !0
    }, L5(A)), r0.createElement(uR1, {
        ruleValue: A
    }))
}
// @from(Ln 417131, Col 4)
r0
// @from(Ln 417132, Col 4)
vMq = E(() => {
    e6();
    i6();
    v3();
    SP();
    F$();
    F$();
    Ol8();
    O2();
    i8();
    wq();
    ay1();
    Lz();
    r0 = t(P6(), 1)
})
// @from(Ln 417148, Col 0)
function NMq(A) {
    let q = A6(24),
        {
            onCancel: K,
            onSubmit: Y,
            ruleBehavior: z
        } = A,
        [_, w] = $l8.useState(""),
        [O, $] = $l8.useState(0),
        H = IK(),
        j;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = {
        context: "Settings"
    }, q[0] = j;
    else j = q[0];
    D8("confirm:no", K, j);
    let {
        columns: J
    } = KA(), M = J - 6, D;
    if (q[1] !== Y || q[2] !== z) D = (h) => {
        let R = h.trim();
        if (R.length === 0) return;
        let u = CH(R);
        Y(u, z)
    }, q[1] = Y, q[2] = z, q[3] = D;
    else D = q[3];
    let X = D,
        P;
    if (q[4] !== z) P = Iz.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Add ", z, " permission rule"), q[4] = z, q[5] = P;
    else P = q[5];
    let W;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = Iz.createElement(iG, null), q[6] = W;
    else W = q[6];
    let Z, G;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) Z = Iz.createElement(T, {
        bold: !0
    }, L5({
        toolName: BX.name
    })), G = Iz.createElement(T, {
        bold: !1
    }, " or "), q[7] = Z, q[8] = G;
    else Z = q[7], G = q[8];
    let f;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) f = Iz.createElement(T, null, "Permission rules are a tool name, optionally followed by a specifier in parentheses.", W, "e.g.,", " ", Z, G, Iz.createElement(T, {
        bold: !0
    }, L5({
        toolName: J4.name,
        ruleContent: "ls:*"
    }))), q[9] = f;
    else f = q[9];
    let v;
    if (q[10] !== O || q[11] !== X || q[12] !== _ || q[13] !== M) v = Iz.createElement(m, {
        flexDirection: "column"
    }, f, Iz.createElement(m, {
        borderDimColor: !0,
        borderStyle: "round",
        marginY: 1,
        paddingLeft: 1
    }, Iz.createElement(J5, {
        showCursor: !0,
        value: _,
        onChange: w,
        onSubmit: X,
        placeholder: `Enter permission rule${a6.ellipsis}`,
        columns: M,
        cursorOffset: O,
        onChangeCursorOffset: $
    }))), q[10] = O, q[11] = X, q[12] = _, q[13] = M, q[14] = v;
    else v = q[14];
    let N;
    if (q[15] !== P || q[16] !== v) N = Iz.createElement(m, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "permission"
    }, P, v), q[15] = P, q[16] = v, q[17] = N;
    else N = q[17];
    let V;
    if (q[18] !== H.keyName || q[19] !== H.pending) V = Iz.createElement(m, {
        marginLeft: 3
    }, H.pending ? Iz.createElement(T, {
        dimColor: !0
    }, "Press ", H.keyName, " again to exit") : Iz.createElement(T, {
        dimColor: !0
    }, "Enter to submit · Esc to cancel")), q[18] = H.keyName, q[19] = H.pending, q[20] = V;
    else V = q[20];
    let L;
    if (q[21] !== V || q[22] !== N) L = Iz.createElement(Iz.Fragment, null, N, V), q[21] = V, q[22] = N, q[23] = L;
    else L = q[23];
    return L
}
// @from(Ln 417244, Col 4)
Iz
// @from(Ln 417244, Col 8)
$l8
// @from(Ln 417245, Col 4)
VMq = E(() => {
    e6();
    i6();
    _7();
    PO();
    SP();
    _q();
    vT6();
    OZ();
    AH();
    b7();
    Iz = t(P6(), 1), $l8 = t(P6(), 1)
})
// @from(Ln 417259, Col 0)
function kMq(A) {
    let q = A6(17),
        {
            onExit: K,
            toolPermissionContext: Y,
            onRequestAddDirectory: z,
            onRequestRemoveDirectory: _
        } = A,
        w;
    if (q[0] !== Y.additionalWorkingDirectories) w = Array.from(Y.additionalWorkingDirectories.keys()).map(_1z), q[0] = Y.additionalWorkingDirectories, q[1] = w;
    else w = q[1];
    let O = w,
        $;
    if (q[2] !== O || q[3] !== z || q[4] !== _) $ = (Z) => {
        if (Z === "add-directory") {
            z();
            return
        }
        let G = O.find((f) => f.path === Z);
        if (G && G.isDeletable) _(G.path)
    }, q[2] = O, q[3] = z, q[4] = _, q[5] = $;
    else $ = q[5];
    let H = $,
        j;
    if (q[6] !== K) j = () => K("Workspace dialog dismissed", {
        display: "system"
    }), q[6] = K, q[7] = j;
    else j = q[7];
    let J = j,
        M;
    if (q[8] !== O) {
        M = O.map(z1z);
        let Z;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) Z = {
            label: `Add directory${a6.ellipsis}`,
            value: "add-directory"
        }, q[10] = Z;
        else Z = q[10];
        M.push(Z), q[8] = O, q[9] = M
    } else M = q[9];
    let D = M,
        X;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) X = nb.createElement(m, {
        flexDirection: "row",
        marginTop: 1,
        marginLeft: 2,
        gap: 1
    }, nb.createElement(T, null, `-  ${AA()}`), nb.createElement(T, {
        dimColor: !0
    }, "(Original working directory)")), q[11] = X;
    else X = q[11];
    let P = Math.min(10, D.length),
        W;
    if (q[12] !== J || q[13] !== H || q[14] !== D || q[15] !== P) W = nb.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, X, nb.createElement(T8, {
        options: D,
        onChange: H,
        onCancel: J,
        visibleOptionCount: P
    })), q[12] = J, q[13] = H, q[14] = D, q[15] = P, q[16] = W;
    else W = q[16];
    return W
}
// @from(Ln 417325, Col 0)
function z1z(A) {
    return {
        label: A.path,
        value: A.path
    }
}
// @from(Ln 417332, Col 0)
function _1z(A) {
    return {
        path: A,
        isCurrent: !1,
        isDeletable: !0
    }
}
// @from(Ln 417339, Col 4)
nb
// @from(Ln 417340, Col 4)
EMq = E(() => {
    e6();
    i6();
    v3();
    b7();
    T1();
    nb = t(P6(), 1)
})
// @from(Ln 417349, Col 0)
function yMq(A) {
    let q = A6(19),
        {
            directoryPath: K,
            onRemove: Y,
            onCancel: z,
            permissionContext: _,
            setPermissionContext: w
        } = A,
        O;
    if (q[0] !== K || q[1] !== Y || q[2] !== _ || q[3] !== w) O = () => {
        let W = Ez(_, {
            type: "removeDirectories",
            directories: [K],
            destination: "session"
        });
        w(W), Y()
    }, q[0] = K, q[1] = Y, q[2] = _, q[3] = w, q[4] = O;
    else O = q[4];
    let $ = O,
        H;
    if (q[5] !== $ || q[6] !== z) H = (W) => {
        if (W === "yes") $();
        else z()
    }, q[5] = $, q[6] = z, q[7] = H;
    else H = q[7];
    let j = H,
        J;
    if (q[8] !== K) J = rb.createElement(m, {
        marginX: 2,
        flexDirection: "column"
    }, rb.createElement(T, {
        bold: !0
    }, K)), q[8] = K, q[9] = J;
    else J = q[9];
    let M;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) M = rb.createElement(T, null, "Claude Code will no longer have access to files in this directory."), q[10] = M;
    else M = q[10];
    let D;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) D = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[11] = D;
    else D = q[11];
    let X;
    if (q[12] !== j || q[13] !== z) X = rb.createElement(T8, {
        onChange: j,
        onCancel: z,
        options: D
    }), q[12] = j, q[13] = z, q[14] = X;
    else X = q[14];
    let P;
    if (q[15] !== z || q[16] !== J || q[17] !== X) P = rb.createElement(m8, {
        title: "Remove directory from workspace?",
        onCancel: z,
        color: "error"
    }, J, M, X), q[15] = z, q[16] = J, q[17] = X, q[18] = P;
    else P = q[18];
    return P
}
// @from(Ln 417412, Col 4)
rb
// @from(Ln 417413, Col 4)
LMq = E(() => {
    e6();
    i6();
    v3();
    F$();
    wq();
    rb = t(P6(), 1)
})
// @from(Ln 417422, Col 0)
function w1z(A) {
    let q = A6(4),
        {
            rule: K
        } = A,
        Y;
    if (q[0] !== K.source) Y = Zn6(K.source), q[0] = K.source, q[1] = Y;
    else Y = q[1];
    let z = `From ${Y}`,
        _;
    if (q[2] !== z) _ = uA.createElement(T, {
        dimColor: !0
    }, z), q[2] = z, q[3] = _;
    else _ = q[3];
    return _
}
// @from(Ln 417439, Col 0)
function O1z(A) {
    switch (A) {
        case "allow":
            return "allowed";
        case "deny":
            return "denied";
        case "ask":
            return "ask"
    }
}
// @from(Ln 417450, Col 0)
function $1z(A) {
    let q = A6(42),
        {
            rule: K,
            onDelete: Y,
            onCancel: z
        } = A,
        _ = IK(),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        context: "Confirmation"
    }, q[0] = w;
    else w = q[0];
    D8("confirm:no", z, w);
    let O;
    if (q[1] !== K.ruleValue) O = L5(K.ruleValue), q[1] = K.ruleValue, q[2] = O;
    else O = q[2];
    let $;
    if (q[3] !== O) $ = uA.createElement(T, {
        bold: !0
    }, O), q[3] = O, q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== K.ruleValue) H = uA.createElement(uR1, {
        ruleValue: K.ruleValue
    }), q[5] = K.ruleValue, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== K) j = uA.createElement(w1z, {
        rule: K
    }), q[7] = K, q[8] = j;
    else j = q[8];
    let J;
    if (q[9] !== $ || q[10] !== H || q[11] !== j) J = uA.createElement(m, {
        flexDirection: "column",
        marginX: 2
    }, $, H, j), q[9] = $, q[10] = H, q[11] = j, q[12] = J;
    else J = q[12];
    let M = J,
        D;
    if (q[13] !== _.keyName || q[14] !== _.pending) D = uA.createElement(m, {
        marginLeft: 3
    }, _.pending ? uA.createElement(T, {
        dimColor: !0
    }, "Press ", _.keyName, " again to exit") : uA.createElement(T, {
        dimColor: !0
    }, "Esc to cancel")), q[13] = _.keyName, q[14] = _.pending, q[15] = D;
    else D = q[15];
    let X = D;
    if (K.source === "policySettings") {
        let L;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) L = uA.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Rule details"), q[16] = L;
        else L = q[16];
        let h;
        if (q[17] === Symbol.for("react.memo_cache_sentinel")) h = uA.createElement(T, {
            italic: !0
        }, "This rule is configured by managed settings and cannot be modified.", `
`, "Contact your system administrator for more information."), q[17] = h;
        else h = q[17];
        let R;
        if (q[18] !== M) R = uA.createElement(m, {
            flexDirection: "column",
            gap: 1,
            borderStyle: "round",
            paddingLeft: 1,
            paddingRight: 1,
            borderColor: "permission"
        }, L, M, h), q[18] = M, q[19] = R;
        else R = q[19];
        let u;
        if (q[20] !== X || q[21] !== R) u = uA.createElement(uA.Fragment, null, R, X), q[20] = X, q[21] = R, q[22] = u;
        else u = q[22];
        return u
    }
    let P;
    if (q[23] !== K.ruleBehavior) P = O1z(K.ruleBehavior), q[23] = K.ruleBehavior, q[24] = P;
    else P = q[24];
    let W;
    if (q[25] !== P) W = uA.createElement(T, {
        bold: !0,
        color: "error"
    }, "Delete ", P, " tool?"), q[25] = P, q[26] = W;
    else W = q[26];
    let Z;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) Z = uA.createElement(T, null, "Are you sure you want to delete this permission rule?"), q[27] = Z;
    else Z = q[27];
    let G;
    if (q[28] !== z || q[29] !== Y) G = (L) => L === "yes" ? Y() : z(), q[28] = z, q[29] = Y, q[30] = G;
    else G = q[30];
    let f;
    if (q[31] === Symbol.for("react.memo_cache_sentinel")) f = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[31] = f;
    else f = q[31];
    let v;
    if (q[32] !== z || q[33] !== G) v = uA.createElement(T8, {
        onChange: G,
        onCancel: z,
        options: f
    }), q[32] = z, q[33] = G, q[34] = v;
    else v = q[34];
    let N;
    if (q[35] !== M || q[36] !== v || q[37] !== W) N = uA.createElement(m, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "error"
    }, W, M, Z, v), q[35] = M, q[36] = v, q[37] = W, q[38] = N;
    else N = q[38];
    let V;
    if (q[39] !== X || q[40] !== N) V = uA.createElement(uA.Fragment, null, N, X), q[39] = X, q[40] = N, q[41] = V;
    else V = q[41];
    return V
}
// @from(Ln 417574, Col 0)
function H1z(A) {
    let q = A6(17),
        {
            options: K,
            searchQuery: Y,
            isSearchMode: z,
            isFocused: _,
            onSelect: w,
            onCancel: O,
            lastFocusedRuleKey: $,
            onUpFromFirstItem: H,
            cursorOffset: j
        } = A,
        J = V9q(),
        M;
    if (q[0] !== j || q[1] !== _ || q[2] !== z || q[3] !== Y || q[4] !== J) M = uA.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, uA.createElement(fh, {
        query: Y,
        isFocused: z,
        isTerminalFocused: _,
        width: J,
        cursorOffset: j
    })), q[0] = j, q[1] = _, q[2] = z, q[3] = Y, q[4] = J, q[5] = M;
    else M = q[5];
    let D = Math.min(10, K.length),
        X;
    if (q[6] !== z || q[7] !== $ || q[8] !== O || q[9] !== w || q[10] !== H || q[11] !== K || q[12] !== D) X = uA.createElement(T8, {
        options: K,
        onChange: w,
        onCancel: O,
        visibleOptionCount: D,
        isDisabled: z,
        defaultFocusValue: $,
        onUpFromFirstItem: H
    }), q[6] = z, q[7] = $, q[8] = O, q[9] = w, q[10] = H, q[11] = K, q[12] = D, q[13] = X;
    else X = q[13];
    let P;
    if (q[14] !== M || q[15] !== X) P = uA.createElement(m, {
        flexDirection: "column"
    }, M, X), q[14] = M, q[15] = X, q[16] = P;
    else P = q[16];
    return P
}
// @from(Ln 417620, Col 0)
function Hl8(A) {
    let q = A6(27),
        K, Y, z, _, w, O, $, H, j;
    if (q[0] !== A) {
        let {
            tab: X,
            getRulesOptions: P,
            handleToolSelect: W,
            ...Z
        } = A;
        j = X, z = W, _ = Z, Y = m, O = "column", $ = j === "allow" ? 0 : void 0;
        let G;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) G = {
            allow: "Claude Code won't ask before using allowed tools.",
            ask: "Claude Code will always ask for confirmation before using these tools.",
            deny: "Claude Code will always reject requests to use denied tools."
        }, q[10] = G;
        else G = q[10];
        let f = G[j];
        if (q[11] !== f) H = uA.createElement(T, null, f), q[11] = f, q[12] = H;
        else H = q[12];
        K = H1z, w = P(j, _.searchQuery), q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = _, q[5] = w, q[6] = O, q[7] = $, q[8] = H, q[9] = j
    } else K = q[1], Y = q[2], z = q[3], _ = q[4], w = q[5], O = q[6], $ = q[7], H = q[8], j = q[9];
    let J;
    if (q[13] !== z || q[14] !== j) J = (X) => z(X, j), q[13] = z, q[14] = j, q[15] = J;
    else J = q[15];
    let M;
    if (q[16] !== K || q[17] !== _ || q[18] !== w.options || q[19] !== J) M = uA.createElement(K, {
        options: w.options,
        onSelect: J,
        ..._
    }), q[16] = K, q[17] = _, q[18] = w.options, q[19] = J, q[20] = M;
    else M = q[20];
    let D;
    if (q[21] !== Y || q[22] !== O || q[23] !== $ || q[24] !== H || q[25] !== M) D = uA.createElement(Y, {
        flexDirection: O,
        flexShrink: $
    }, H, M), q[21] = Y, q[22] = O, q[23] = $, q[24] = H, q[25] = M, q[26] = D;
    else D = q[26];
    return D
}