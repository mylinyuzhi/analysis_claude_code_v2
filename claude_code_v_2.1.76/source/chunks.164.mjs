
// @from(Ln 420623, Col 0)
function BDq(A) {
    let q = A6(67),
        {
            source: K,
            agents: Y,
            onBack: z,
            onSelect: _,
            onCreateNew: w,
            changes: O
        } = A,
        [$, H] = aA.useState(null),
        [j, J] = aA.useState(!0),
        M;
    if (q[0] !== Y) M = [...Y].sort(dR1), q[0] = Y, q[1] = M;
    else M = q[1];
    let D = M,
        X = v8z,
        P;
    if (q[2] !== j) P = () => aA.createElement(m, null, aA.createElement(T, {
        color: j ? "suggestion" : void 0
    }, j ? `${a6.pointer} ` : "  "), aA.createElement(T, {
        color: j ? "suggestion" : void 0
    }, "Create new agent")), q[2] = j, q[3] = P;
    else P = q[3];
    let W = P,
        Z;
    if (q[4] !== j || q[5] !== $?.agentType || q[6] !== $?.source) Z = (J6) => {
        let K6 = J6.source === "built-in",
            s = !K6 && !j && $?.agentType === J6.agentType && $?.source === J6.source,
            {
                isOverridden: X6,
                overriddenBy: z6
            } = X(J6),
            N6 = K6 || X6,
            $6 = !K6 && s ? "suggestion" : void 0,
            n = QR1(J6);
        return aA.createElement(m, {
            key: `${J6.agentType}-${J6.source}`
        }, aA.createElement(T, {
            dimColor: N6 && !s,
            color: $6
        }, K6 ? "" : s ? `${a6.pointer} ` : "  "), aA.createElement(T, {
            dimColor: N6 && !s,
            color: $6
        }, J6.agentType), n && aA.createElement(T, {
            dimColor: !0,
            color: $6
        }, " · ", n), J6.memory && aA.createElement(T, {
            dimColor: !0,
            color: $6
        }, " · ", J6.memory, " memory"), z6 && aA.createElement(T, {
            dimColor: !s,
            color: s ? "warning" : void 0
        }, " ", a6.warning, " shadowed by ", UR1(z6)))
    }, q[4] = j, q[5] = $?.agentType, q[6] = $?.source, q[7] = Z;
    else Z = q[7];
    let G = Z,
        f;
    if (q[8] !== D || q[9] !== K) {
        A: {
            let J6 = D.filter(T8z);
            if (K === "all") {
                f = jr6.filter(f8z).flatMap((K6) => {
                    let {
                        source: s
                    } = K6;
                    return J6.filter((X6) => X6.source === s)
                });
                break A
            }
            f = J6
        }
        q[8] = D,
        q[9] = K,
        q[10] = f
    }
    else f = q[10];
    let v = f,
        N, V;
    if (q[11] !== j || q[12] !== w || q[13] !== v || q[14] !== $) N = () => {
        if (!$ && !j && v.length > 0)
            if (w) J(!0);
            else H(v[0] || null)
    }, V = [v, $, j, w], q[11] = j, q[12] = w, q[13] = v, q[14] = $, q[15] = N, q[16] = V;
    else N = q[15], V = q[16];
    aA.useEffect(N, V);
    let L;
    if (q[17] !== j || q[18] !== w || q[19] !== _ || q[20] !== v || q[21] !== $) L = (J6, K6) => {
        if (K6.return) {
            if (j && w) w();
            else if ($) _($);
            return
        }
        if (!K6.upArrow && !K6.downArrow) return;
        let s = !!w,
            X6 = v.length + (s ? 1 : 0);
        if (X6 === 0) return;
        let z6 = 0;
        if (!j && $) {
            let $6 = v.findIndex((n) => n.agentType === $.agentType && n.source === $.source);
            if ($6 >= 0) z6 = s ? $6 + 1 : $6
        }
        let N6 = K6.upArrow ? z6 === 0 ? X6 - 1 : z6 - 1 : z6 === X6 - 1 ? 0 : z6 + 1;
        if (s && N6 === 0) J(!0), H(null);
        else {
            let $6 = s ? N6 - 1 : N6,
                n = v[$6];
            if (n) J(!1), H(n)
        }
    }, q[17] = j, q[18] = w, q[19] = _, q[20] = v, q[21] = $, q[22] = L;
    else L = q[22];
    jA(L);
    let h;
    if (q[23] !== G || q[24] !== D) h = (J6) => {
        let K6 = J6 === void 0 ? "Built-in (always available):" : J6,
            s = D.filter(G8z);
        return aA.createElement(m, {
            flexDirection: "column",
            marginBottom: 1,
            paddingLeft: 2
        }, aA.createElement(T, {
            bold: !0,
            dimColor: !0
        }, K6), s.map(G))
    }, q[23] = G, q[24] = D, q[25] = h;
    else h = q[25];
    let R = h,
        u;
    if (q[26] !== G) u = (J6, K6) => {
        if (!K6.length) return null;
        let s = K6[0]?.baseDir;
        return aA.createElement(m, {
            flexDirection: "column",
            marginBottom: 1
        }, aA.createElement(m, {
            paddingLeft: 2
        }, aA.createElement(T, {
            bold: !0,
            dimColor: !0
        }, J6), s && aA.createElement(T, {
            dimColor: !0
        }, " (", s, ")")), K6.map((X6) => G(X6)))
    }, q[26] = G, q[27] = u;
    else u = q[27];
    let I = u,
        g;
    if (q[28] !== K) g = WN6(K), q[28] = K, q[29] = g;
    else g = q[29];
    let B = g;
    if (!D.length || K !== "built-in" && !D.some(Z8z)) {
        let J6;
        if (q[30] !== w || q[31] !== W) J6 = w && aA.createElement(m, null, W()), q[30] = w, q[31] = W, q[32] = J6;
        else J6 = q[32];
        let K6, s, X6;
        if (q[33] === Symbol.for("react.memo_cache_sentinel")) K6 = aA.createElement(T, {
            dimColor: !0
        }, "No agents found. Create specialized subagents that Claude can delegate to."), s = aA.createElement(T, {
            dimColor: !0
        }, "Each subagent has its own context window, custom system prompt, and specific tools."), X6 = aA.createElement(T, {
            dimColor: !0
        }, "Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer."), q[33] = K6, q[34] = s, q[35] = X6;
        else K6 = q[33], s = q[34], X6 = q[35];
        let z6;
        if (q[36] !== R || q[37] !== D || q[38] !== K) z6 = K !== "built-in" && D.some(W8z) && aA.createElement(aA.Fragment, null, aA.createElement(Wk, null), R()), q[36] = R, q[37] = D, q[38] = K, q[39] = z6;
        else z6 = q[39];
        let N6;
        if (q[40] !== z || q[41] !== B || q[42] !== J6 || q[43] !== z6) N6 = aA.createElement(m8, {
            title: B,
            subtitle: "No agents found",
            onCancel: z,
            hideInputGuide: !0
        }, J6, K6, s, X6, z6), q[40] = z, q[41] = B, q[42] = J6, q[43] = z6, q[44] = N6;
        else N6 = q[44];
        return N6
    }
    let p;
    if (q[45] !== D) p = D.filter(P8z), q[45] = D, q[46] = p;
    else p = q[46];
    let Q = `${p.length} agents`,
        U;
    if (q[47] !== O) U = O && O.length > 0 && aA.createElement(m, {
        marginTop: 1
    }, aA.createElement(T, {
        dimColor: !0
    }, O[O.length - 1])), q[47] = O, q[48] = U;
    else U = q[48];
    let r;
    if (q[49] !== w || q[50] !== W) r = w && aA.createElement(m, {
        marginBottom: 1
    }, W()), q[49] = w, q[50] = W, q[51] = r;
    else r = q[51];
    let e;
    if (q[52] !== G || q[53] !== I || q[54] !== R || q[55] !== D || q[56] !== K) e = K === "all" ? aA.createElement(aA.Fragment, null, jr6.filter(X8z).map((J6) => {
        let {
            label: K6,
            source: s
        } = J6;
        return aA.createElement(aA.Fragment, {
            key: s
        }, I(K6, D.filter((X6) => X6.source === s)))
    }), (() => {
        let J6 = D.filter(D8z);
        return J6.length > 0 ? aA.createElement(m, {
            flexDirection: "column",
            marginBottom: 1,
            paddingLeft: 2
        }, aA.createElement(T, {
            dimColor: !0
        }, aA.createElement(T, {
            bold: !0
        }, "Built-in agents"), " (always available)"), J6.map(G)) : null
    })()) : K === "built-in" ? aA.createElement(aA.Fragment, null, aA.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Built-in agents are provided by default and cannot be modified."), aA.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, D.map((J6) => G(J6)))) : aA.createElement(aA.Fragment, null, D.filter(M8z).map((J6) => G(J6)), D.some(J8z) && aA.createElement(aA.Fragment, null, aA.createElement(Wk, null), R())), q[52] = G, q[53] = I, q[54] = R, q[55] = D, q[56] = K, q[57] = e;
    else e = q[57];
    let Y6;
    if (q[58] !== r || q[59] !== e) Y6 = aA.createElement(m, {
        flexDirection: "column"
    }, r, e), q[58] = r, q[59] = e, q[60] = Y6;
    else Y6 = q[60];
    let H6;
    if (q[61] !== z || q[62] !== B || q[63] !== Q || q[64] !== U || q[65] !== Y6) H6 = aA.createElement(m8, {
        title: B,
        subtitle: Q,
        onCancel: z,
        hideInputGuide: !0
    }, U, Y6), q[61] = z, q[62] = B, q[63] = Q, q[64] = U, q[65] = Y6, q[66] = H6;
    else H6 = q[66];
    return H6
}
// @from(Ln 420858, Col 0)
function J8z(A) {
    return A.source === "built-in"
}
// @from(Ln 420862, Col 0)
function M8z(A) {
    return A.source !== "built-in"
}
// @from(Ln 420866, Col 0)
function D8z(A) {
    return A.source === "built-in"
}
// @from(Ln 420870, Col 0)
function X8z(A) {
    return A.source !== "built-in"
}
// @from(Ln 420874, Col 0)
function P8z(A) {
    return !A.overriddenBy
}
// @from(Ln 420878, Col 0)
function W8z(A) {
    return A.source === "built-in"
}
// @from(Ln 420882, Col 0)
function Z8z(A) {
    return A.source !== "built-in"
}
// @from(Ln 420886, Col 0)
function G8z(A) {
    return A.source === "built-in"
}
// @from(Ln 420890, Col 0)
function f8z(A) {
    return A.source !== "built-in"
}
// @from(Ln 420894, Col 0)
function T8z(A) {
    return A.source !== "built-in"
}
// @from(Ln 420898, Col 0)
function v8z(A) {
    return {
        isOverridden: !!A.overriddenBy,
        overriddenBy: A.overriddenBy || null
    }
}
// @from(Ln 420904, Col 4)
aA
// @from(Ln 420905, Col 4)
gDq = E(() => {
    e6();
    i6();
    i6();
    b7();
    cR1();
    wq();
    nR1();
    cu6();
    aA = t(P6(), 1)
})
// @from(Ln 420917, Col 0)
function Nl8(A) {
    let q = A6(38),
        {
            steps: K,
            initialData: Y,
            onComplete: z,
            onCancel: _,
            children: w,
            title: O,
            showStepCounter: $
        } = A,
        H;
    if (q[0] !== Y) H = Y === void 0 ? {} : Y, q[0] = Y, q[1] = H;
    else H = q[1];
    let j = H,
        J = $ === void 0 ? !0 : $,
        [M, D] = Ch.useState(0),
        [X, P] = Ch.useState(j),
        [W, Z] = Ch.useState(!1),
        G;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) G = [], q[2] = G;
    else G = q[2];
    let [f, v] = Ch.useState(G);
    IK();
    let N, V;
    if (q[3] !== W || q[4] !== z || q[5] !== X) N = () => {
        if (W) v([]), z(X)
    }, V = [W, X, z], q[3] = W, q[4] = z, q[5] = X, q[6] = N, q[7] = V;
    else N = q[6], V = q[7];
    Ch.useEffect(N, V);
    let L;
    if (q[8] !== M || q[9] !== f || q[10] !== K.length) L = () => {
        if (M < K.length - 1) {
            if (f.length > 0) v((J6) => [...J6, M]);
            D(k8z)
        } else Z(!0)
    }, q[8] = M, q[9] = f, q[10] = K.length, q[11] = L;
    else L = q[11];
    let h = L,
        R;
    if (q[12] !== M || q[13] !== f || q[14] !== _) R = () => {
        if (f.length > 0) {
            let J6 = f[f.length - 1];
            if (J6 !== void 0) v(V8z), D(J6)
        } else if (M > 0) D(N8z);
        else if (_) _()
    }, q[12] = M, q[13] = f, q[14] = _, q[15] = R;
    else R = q[15];
    let u = R,
        I;
    if (q[16] !== M || q[17] !== K.length) I = (J6) => {
        if (J6 >= 0 && J6 < K.length) v((K6) => [...K6, M]), D(J6)
    }, q[16] = M, q[17] = K.length, q[18] = I;
    else I = q[18];
    let g = I,
        B;
    if (q[19] !== _) B = () => {
        if (v([]), _) _()
    }, q[19] = _, q[20] = B;
    else B = q[20];
    let b = B,
        p;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) p = (J6) => {
        P((K6) => ({
            ...K6,
            ...J6
        }))
    }, q[21] = p;
    else p = q[21];
    let Q = p,
        U;
    if (q[22] !== b || q[23] !== M || q[24] !== u || q[25] !== h || q[26] !== g || q[27] !== J || q[28] !== K.length || q[29] !== O || q[30] !== X) U = {
        currentStepIndex: M,
        totalSteps: K.length,
        wizardData: X,
        setWizardData: P,
        updateWizardData: Q,
        goNext: h,
        goBack: u,
        goToStep: g,
        cancel: b,
        title: O,
        showStepCounter: J
    }, q[22] = b, q[23] = M, q[24] = u, q[25] = h, q[26] = g, q[27] = J, q[28] = K.length, q[29] = O, q[30] = X, q[31] = U;
    else U = q[31];
    let r = U,
        e = K[M];
    if (!e || W) return null;
    let Y6;
    if (q[32] !== e || q[33] !== w) Y6 = w || Ch.default.createElement(e, null), q[32] = e, q[33] = w, q[34] = Y6;
    else Y6 = q[34];
    let H6;
    if (q[35] !== r || q[36] !== Y6) H6 = Ch.default.createElement(vl8.Provider, {
        value: r
    }, Y6), q[35] = r, q[36] = Y6, q[37] = H6;
    else H6 = q[37];
    return H6
}
// @from(Ln 421016, Col 0)
function N8z(A) {
    return A - 1
}
// @from(Ln 421020, Col 0)
function V8z(A) {
    return A.slice(0, -1)
}
// @from(Ln 421024, Col 0)
function k8z(A) {
    return A + 1
}
// @from(Ln 421027, Col 4)
Ch
// @from(Ln 421027, Col 8)
vl8
// @from(Ln 421028, Col 4)
Vl8 = E(() => {
    e6();
    PO();
    Ch = t(P6(), 1), vl8 = Ch.createContext(null)
})
// @from(Ln 421034, Col 0)
function Mw() {
    let A = FDq.useContext(vl8);
    if (!A) throw Error("useWizard must be used within a WizardProvider");
    return A
}
// @from(Ln 421039, Col 4)
FDq
// @from(Ln 421040, Col 4)
kl8 = E(() => {
    Vl8();
    FDq = t(P6(), 1)
})
// @from(Ln 421045, Col 0)
function El8({
    instructions: A = k_6.default.createElement(C8, null, k_6.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), k_6.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), k_6.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))
}) {
    let q = IK();
    return k_6.default.createElement(m, {
        marginLeft: 3,
        marginTop: 1
    }, k_6.default.createElement(T, {
        dimColor: !0
    }, q.pending ? `Press ${q.keyName} again to exit` : A))
}
// @from(Ln 421067, Col 4)
k_6
// @from(Ln 421068, Col 4)
yl8 = E(() => {
    i6();
    PO();
    Lq();
    OK();
    Xq();
    k_6 = t(P6(), 1)
})
// @from(Ln 421077, Col 0)
function f$(A) {
    let q = A6(11),
        {
            title: K,
            color: Y,
            children: z,
            subtitle: _,
            footerText: w
        } = A,
        O = Y === void 0 ? "suggestion" : Y,
        {
            currentStepIndex: $,
            totalSteps: H,
            title: j,
            showStepCounter: J,
            goBack: M
        } = Mw(),
        D = K || j || "Wizard",
        X = J !== !1 ? ` (${$+1}/${H})` : "",
        P = `${D}${X}`,
        W;
    if (q[0] !== z || q[1] !== O || q[2] !== M || q[3] !== _ || q[4] !== P) W = Jr6.default.createElement(m8, {
        title: P,
        subtitle: _,
        onCancel: M,
        color: O,
        hideInputGuide: !0,
        isCancelActive: !1
    }, z), q[0] = z, q[1] = O, q[2] = M, q[3] = _, q[4] = P, q[5] = W;
    else W = q[5];
    let Z;
    if (q[6] !== w) Z = Jr6.default.createElement(El8, {
        instructions: w
    }), q[6] = w, q[7] = Z;
    else Z = q[7];
    let G;
    if (q[8] !== W || q[9] !== Z) G = Jr6.default.createElement(Jr6.default.Fragment, null, W, Z), q[8] = W, q[9] = Z, q[10] = G;
    else G = q[10];
    return G
}
// @from(Ln 421117, Col 4)
Jr6
// @from(Ln 421118, Col 4)
LE = E(() => {
    e6();
    kl8();
    yl8();
    wq();
    Jr6 = t(P6(), 1)
})
// @from(Ln 421125, Col 4)
hN = E(() => {
    Vl8();
    kl8();
    LE();
    yl8()
})
// @from(Ln 421132, Col 0)
function pDq() {
    let A = A6(11),
        {
            goNext: q,
            updateWizardData: K,
            cancel: Y
        } = Mw(),
        z;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        label: "Project (.claude/agents/)",
        value: "projectSettings"
    }, A[0] = z;
    else z = A[0];
    let _;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) _ = [z, {
        label: "Personal (~/.claude/agents/)",
        value: "userSettings"
    }], A[1] = _;
    else _ = A[1];
    let w = _,
        O;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) O = F16.default.createElement(C8, null, F16.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), F16.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), F16.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })), A[2] = O;
    else O = A[2];
    let $;
    if (A[3] !== q || A[4] !== K) $ = (J) => {
        K({
            location: J
        }), q()
    }, A[3] = q, A[4] = K, A[5] = $;
    else $ = A[5];
    let H;
    if (A[6] !== Y) H = () => Y(), A[6] = Y, A[7] = H;
    else H = A[7];
    let j;
    if (A[8] !== $ || A[9] !== H) j = F16.default.createElement(f$, {
        subtitle: "Choose location",
        footerText: O
    }, F16.default.createElement(m, null, F16.default.createElement(T8, {
        key: "location-select",
        options: w,
        onChange: $,
        onCancel: H
    }))), A[8] = $, A[9] = H, A[10] = j;
    else j = A[10];
    return j
}
// @from(Ln 421189, Col 4)
F16
// @from(Ln 421190, Col 4)
QDq = E(() => {
    e6();
    i6();
    v3();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    F16 = t(P6(), 1)
})
// @from(Ln 421202, Col 0)
function UDq() {
    let A = A6(11),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            goToStep: z
        } = Mw(),
        _;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = [{
        label: "Generate with Claude (recommended)",
        value: "generate"
    }, {
        label: "Manual configuration",
        value: "manual"
    }], A[0] = _;
    else _ = A[0];
    let w = _,
        O;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) O = p16.default.createElement(C8, null, p16.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), p16.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), p16.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[1] = O;
    else O = A[1];
    let $;
    if (A[2] !== q || A[3] !== z || A[4] !== Y) $ = (J) => {
        let M = J;
        if (Y({
                method: M,
                wasGenerated: M === "generate"
            }), M === "generate") q();
        else z(3)
    }, A[2] = q, A[3] = z, A[4] = Y, A[5] = $;
    else $ = A[5];
    let H;
    if (A[6] !== K) H = () => K(), A[6] = K, A[7] = H;
    else H = A[7];
    let j;
    if (A[8] !== $ || A[9] !== H) j = p16.default.createElement(f$, {
        subtitle: "Creation method",
        footerText: O
    }, p16.default.createElement(m, null, p16.default.createElement(T8, {
        key: "method-select",
        options: w,
        onChange: $,
        onCancel: H
    }))), A[8] = $, A[9] = H, A[10] = j;
    else j = A[10];
    return j
}
// @from(Ln 421260, Col 4)
p16
// @from(Ln 421261, Col 4)
dDq = E(() => {
    e6();
    i6();
    v3();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    p16 = t(P6(), 1)
})
// @from(Ln 421272, Col 0)
async function lDq(A, q, K, Y) {
    let z = K.length > 0 ? `

IMPORTANT: The following identifiers already exist and must NOT be used: ${K.join(", ")}` : "",
        _ = `Create an agent configuration based on this request: "${A}".${z}
  Return ONLY the JSON object, no other text.`,
        w = p1({
            content: _
        }),
        O = await a2(),
        $ = eE1([w], O),
        H = Z3() ? cDq + E8z : cDq,
        M = (await _i({
            messages: cM($),
            systemPrompt: uq([H]),
            thinkingConfig: {
                type: "disabled"
            },
            tools: [],
            signal: Y,
            options: {
                getToolPermissionContext: async () => xM(),
                model: q,
                toolChoice: void 0,
                agents: [],
                isNonInteractiveSession: !1,
                hasAppendSystemPrompt: !1,
                querySource: "agent_creation",
                mcpTools: []
            }
        })).message.content.filter((X) => X.type === "text").map((X) => X.text).join(`
`),
        D;
    try {
        D = i1(M.trim())
    } catch {
        let X = M.match(/\{[\s\S]*\}/);
        if (!X) throw Error("No JSON object found in response");
        D = i1(X[0])
    }
    if (!D.identifier || !D.whenToUse || !D.systemPrompt) throw Error("Invalid agent configuration generated");
    return d("tengu_agent_definition_generated", {
        agent_identifier: D.identifier
    }), {
        identifier: D.identifier,
        whenToUse: D.whenToUse,
        systemPrompt: D.systemPrompt
    }
}
// @from(Ln 421321, Col 4)
cDq
// @from(Ln 421321, Col 9)
E8z = `

7. **Agent Memory Instructions**: If the user mentions "memory", "remember", "learn", "persist", or similar concepts, OR if the agent would benefit from building up knowledge across conversations (e.g., code reviewers learning patterns, architects learning codebase structure, etc.), include domain-specific memory update instructions in the systemPrompt.

   Add a section like this to the systemPrompt, tailored to the agent's specific domain:

   "**Update your agent memory** as you discover [domain-specific items]. This builds up institutional knowledge across conversations. Write concise notes about what you found and where.

   Examples of what to record:
   - [domain-specific item 1]
   - [domain-specific item 2]
   - [domain-specific item 3]"

   Examples of domain-specific memory instructions:
   - For a code-reviewer: "Update your agent memory as you discover code patterns, style conventions, common issues, and architectural decisions in this codebase."
   - For a test-runner: "Update your agent memory as you discover test patterns, common failure modes, flaky tests, and testing best practices."
   - For an architect: "Update your agent memory as you discover codepaths, library locations, key architectural decisions, and component relationships."
   - For a documentation writer: "Update your agent memory as you discover documentation patterns, API structures, and terminology conventions."

   The memory instructions should be specific to what the agent would naturally learn while performing its core tasks.
`
// @from(Ln 421342, Col 4)
iDq = E(() => {
    mH();
    gw();
    JA();
    bv();
    V1();
    Fz6();
    g1();
    cDq = `You are an elite AI agent architect specializing in crafting high-performance agent configurations. Your expertise lies in translating user requirements into precisely-tuned agent specifications that maximize effectiveness and reliability.

**Important Context**: You may have access to project-specific instructions from CLAUDE.md files and other context that may include coding standards, project structure, and custom requirements. Consider this context when creating agents to ensure they align with the project's established patterns and practices.

When a user describes what they want an agent to do, you will:

1. **Extract Core Intent**: Identify the fundamental purpose, key responsibilities, and success criteria for the agent. Look for both explicit requirements and implicit needs. Consider any project-specific context from CLAUDE.md files. For agents that are meant to review code, you should assume that the user is asking to review recently written code and not the whole codebase, unless the user has explicitly instructed you otherwise.

2. **Design Expert Persona**: Create a compelling expert identity that embodies deep domain knowledge relevant to the task. The persona should inspire confidence and guide the agent's decision-making approach.

3. **Architect Comprehensive Instructions**: Develop a system prompt that:
   - Establishes clear behavioral boundaries and operational parameters
   - Provides specific methodologies and best practices for task execution
   - Anticipates edge cases and provides guidance for handling them
   - Incorporates any specific requirements or preferences mentioned by the user
   - Defines output format expectations when relevant
   - Aligns with project-specific coding standards and patterns from CLAUDE.md

4. **Optimize for Performance**: Include:
   - Decision-making frameworks appropriate to the domain
   - Quality control mechanisms and self-verification steps
   - Efficient workflow patterns
   - Clear escalation or fallback strategies

5. **Create Identifier**: Design a concise, descriptive identifier that:
   - Uses lowercase letters, numbers, and hyphens only
   - Is typically 2-4 words joined by hyphens
   - Clearly indicates the agent's primary function
   - Is memorable and easy to type
   - Avoids generic terms like "helper" or "assistant"

6 **Example agent descriptions**:
  - in the 'whenToUse' field of the JSON object, you should include examples of when this agent should be used.
  - examples should be of the form:
    - <example>
      Context: The user is creating a test-runner agent that should be called after a logical chunk of code is written.
      user: "Please write a function that checks if a number is prime"
      assistant: "Here is the relevant function: "
      <function call omitted for brevity only for this example>
      <commentary>
      Since a significant piece of code was written, use the ${r4} tool to launch the test-runner agent to run the tests.
      </commentary>
      assistant: "Now let me use the test-runner agent to run the tests"
    </example>
    - <example>
      Context: User is creating an agent to respond to the word "hello" with a friendly jok.
      user: "Hello"
      assistant: "I'm going to use the ${r4} tool to launch the greeting-responder agent to respond with a friendly joke"
      <commentary>
      Since the user is greeting, use the greeting-responder agent to respond with a friendly joke. 
      </commentary>
    </example>
  - If the user mentioned or implied that the agent should be used proactively, you should include examples of this.
- NOTE: Ensure that in the examples, you are making the assistant use the Agent tool and not simply respond directly to the task.

Your output must be a valid JSON object with exactly these fields:
{
  "identifier": "A unique, descriptive identifier using lowercase letters, numbers, and hyphens (e.g., 'test-runner', 'api-docs-writer', 'code-formatter')",
  "whenToUse": "A precise, actionable description starting with 'Use this agent when...' that clearly defines the triggering conditions and use cases. Ensure you include examples as described above.",
  "systemPrompt": "The complete system prompt that will govern the agent's behavior, written in second person ('You are...', 'You will...') and structured for maximum clarity and effectiveness"
}

Key principles for your system prompts:
- Be specific rather than generic - avoid vague instructions
- Include concrete examples when they would clarify behavior
- Balance comprehensiveness with clarity - every instruction should add value
- Ensure the agent has enough context to handle variations of the core task
- Make the agent proactive in seeking clarification when needed
- Build in quality assurance and self-correction mechanisms

Remember: The agents you create should be autonomous experts capable of handling their designated tasks with minimal additional guidance. Your system prompts are their complete operational manual.
`
})
// @from(Ln 421424, Col 0)
function nDq() {
    let {
        updateWizardData: A,
        goBack: q,
        goToStep: K,
        wizardData: Y
    } = Mw(), [z, _] = nw.useState(Y.generationPrompt || ""), [w, O] = nw.useState(!1), [$, H] = nw.useState(null), [j, J] = nw.useState(z.length), M = sR(), D = nw.useRef(null), X = nw.useCallback(() => {
        if (D.current) D.current.abort(), D.current = null, O(!1), H("Generation cancelled")
    }, []);
    D8("confirm:no", X, {
        context: "Settings",
        isActive: w
    });
    let P = nw.useCallback(async () => {
        let f = await NN(z);
        if (f.content !== null) _(f.content), J(f.content.length)
    }, [z]);
    D8("chat:externalEditor", P, {
        context: "Chat",
        isActive: !w
    });
    let W = nw.useCallback(() => {
        A({
            generationPrompt: "",
            agentType: "",
            systemPrompt: "",
            whenToUse: "",
            generatedAgent: void 0,
            wasGenerated: !1
        }), _(""), H(null), q()
    }, [A, q]);
    D8("confirm:no", W, {
        context: "Settings",
        isActive: !w
    });
    let Z = async () => {
        let f = z.trim();
        if (!f) {
            H("Please describe what the agent should do");
            return
        }
        H(null), O(!0), A({
            generationPrompt: f,
            isGenerating: !0
        });
        let v = sK();
        D.current = v;
        try {
            let N = await lDq(f, M, [], v.signal);
            A({
                agentType: N.identifier,
                whenToUse: N.whenToUse,
                systemPrompt: N.systemPrompt,
                generatedAgent: N,
                isGenerating: !1,
                wasGenerated: !0
            }), K(6)
        } catch (N) {
            if (N instanceof Az);
            else if (N instanceof Error && !N.message.includes("No assistant message found")) H(N.message || "Failed to generate agent");
            A({
                isGenerating: !1
            })
        } finally {
            O(!1), D.current = null
        }
    }, G = "Describe what this agent should do and when it should be used (be comprehensive for best results)";
    if (w) return nw.default.createElement(f$, {
        subtitle: G,
        footerText: nw.default.createElement(O8, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "cancel"
        })
    }, nw.default.createElement(m, {
        flexDirection: "row",
        alignItems: "center"
    }, nw.default.createElement(Wq, null), nw.default.createElement(T, {
        color: "suggestion"
    }, " Generating agent from description...")));
    return nw.default.createElement(f$, {
        subtitle: G,
        footerText: nw.default.createElement(C8, null, nw.default.createElement(O8, {
            action: "confirm:yes",
            context: "Confirmation",
            fallback: "Enter",
            description: "submit"
        }), nw.default.createElement(O8, {
            action: "chat:externalEditor",
            context: "Chat",
            fallback: "ctrl+g",
            description: "open in editor"
        }), nw.default.createElement(O8, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "go back"
        }))
    }, nw.default.createElement(m, {
        flexDirection: "column"
    }, $ && nw.default.createElement(m, {
        marginBottom: 1
    }, nw.default.createElement(T, {
        color: "error"
    }, $)), nw.default.createElement(J5, {
        value: z,
        onChange: _,
        onSubmit: Z,
        placeholder: "e.g., Help me write unit tests for my code...",
        columns: 80,
        cursorOffset: j,
        onChangeCursorOffset: J,
        focus: !0,
        showCursor: !0
    })))
}
// @from(Ln 421541, Col 4)
nw
// @from(Ln 421542, Col 4)
rDq = E(() => {
    i6();
    _7();
    AH();
    LE();
    hN();
    LO();
    iDq();
    mY6();
    U$();
    OK();
    Xq();
    wv();
    VE();
    nw = t(P6(), 1)
})
// @from(Ln 421559, Col 0)
function Ll8(A) {
    if (!A) return "Agent type is required";
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(A)) return "Agent type must start and end with alphanumeric characters and contain only letters, numbers, and hyphens";
    if (A.length < 3) return "Agent type must be at least 3 characters long";
    if (A.length > 50) return "Agent type must be less than 50 characters";
    return null
}
// @from(Ln 421567, Col 0)
function oDq(A, q, K) {
    let Y = [],
        z = [];
    if (!A.agentType) Y.push("Agent type is required");
    else {
        let w = Ll8(A.agentType);
        if (w) Y.push(w);
        let O = K.find(($) => $.agentType === A.agentType && $.source !== A.source);
        if (O) Y.push(`Agent type "${A.agentType}" already exists in ${WN6(O.source)}`)
    }
    if (!A.whenToUse) Y.push("Description (description) is required");
    else if (A.whenToUse.length < 10) z.push("Description should be more descriptive (at least 10 characters)");
    else if (A.whenToUse.length > 5000) z.push("Description is very long (over 5000 characters)");
    if (A.tools !== void 0 && !Array.isArray(A.tools)) Y.push("Tools must be an array");
    else {
        if (A.tools === void 0) z.push("Agent has access to all tools");
        else if (A.tools.length === 0) z.push("No tools selected - agent will have very limited capabilities");
        let w = _c(A, q, !1);
        if (w.invalidTools.length > 0) Y.push(`Invalid tools: ${w.invalidTools.join(", ")}`)
    }
    let _ = A.getSystemPrompt();
    if (!_) Y.push("System prompt is required");
    else if (_.length < 20) Y.push("System prompt is too short (minimum 20 characters)");
    else if (_.length > 1e4) z.push("System prompt is very long (over 10,000 characters)");
    return {
        isValid: Y.length === 0,
        errors: Y,
        warnings: z
    }
}
// @from(Ln 421597, Col 4)
Rl8 = E(() => {
    cW6();
    nR1()
})
// @from(Ln 421602, Col 0)
function aDq(A) {
    let q = A6(15),
        {
            goNext: K,
            goBack: Y,
            updateWizardData: z,
            wizardData: _
        } = Mw(),
        [w, O] = UZ.useState(_.agentType || ""),
        [$, H] = UZ.useState(null),
        [j, J] = UZ.useState(w.length),
        M;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = {
        context: "Settings"
    }, q[0] = M;
    else M = q[0];
    D8("confirm:no", Y, M);
    let D;
    if (q[1] !== K || q[2] !== z) D = (v) => {
        let N = v.trim(),
            V = Ll8(N);
        if (V) {
            H(V);
            return
        }
        H(null), z({
            agentType: N
        }), K()
    }, q[1] = K, q[2] = z, q[3] = D;
    else D = q[3];
    let X = D,
        P;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) P = UZ.default.createElement(C8, null, UZ.default.createElement(a1, {
        shortcut: "Type",
        action: "enter text"
    }), UZ.default.createElement(a1, {
        shortcut: "Enter",
        action: "continue"
    }), UZ.default.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[4] = P;
    else P = q[4];
    let W;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = UZ.default.createElement(T, null, "Enter a unique identifier for your agent:"), q[5] = W;
    else W = q[5];
    let Z;
    if (q[6] !== w || q[7] !== j || q[8] !== X) Z = UZ.default.createElement(m, {
        marginTop: 1
    }, UZ.default.createElement(J5, {
        value: w,
        onChange: O,
        onSubmit: X,
        placeholder: "e.g., test-runner, tech-lead, etc",
        columns: 60,
        cursorOffset: j,
        onChangeCursorOffset: J,
        focus: !0,
        showCursor: !0
    })), q[6] = w, q[7] = j, q[8] = X, q[9] = Z;
    else Z = q[9];
    let G;
    if (q[10] !== $) G = $ && UZ.default.createElement(m, {
        marginTop: 1
    }, UZ.default.createElement(T, {
        color: "error"
    }, $)), q[10] = $, q[11] = G;
    else G = q[11];
    let f;
    if (q[12] !== Z || q[13] !== G) f = UZ.default.createElement(f$, {
        subtitle: "Agent type (identifier)",
        footerText: P
    }, UZ.default.createElement(m, {
        flexDirection: "column"
    }, W, Z, G)), q[12] = Z, q[13] = G, q[14] = f;
    else f = q[14];
    return f
}
// @from(Ln 421682, Col 4)
UZ
// @from(Ln 421683, Col 4)
sDq = E(() => {
    e6();
    i6();
    AH();
    LE();
    hN();
    Rl8();
    Lq();
    OK();
    Xq();
    _7();
    UZ = t(P6(), 1)
})
// @from(Ln 421697, Col 0)
function tDq() {
    let A = A6(20),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = Mw(),
        [_, w] = iX.useState(z.systemPrompt || ""),
        [O, $] = iX.useState(_.length),
        [H, j] = iX.useState(null),
        J;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, A[0] = J;
    else J = A[0];
    D8("confirm:no", K, J);
    let M;
    if (A[1] !== _) M = async () => {
        let L = await NN(_);
        if (L.content !== null) w(L.content), $(L.content.length)
    }, A[1] = _, A[2] = M;
    else M = A[2];
    let D = M,
        X;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Chat"
    }, A[3] = X;
    else X = A[3];
    D8("chat:externalEditor", D, X);
    let P;
    if (A[4] !== q || A[5] !== _ || A[6] !== Y) P = () => {
        let L = _.trim();
        if (!L) {
            j("System prompt is required");
            return
        }
        j(null), Y({
            systemPrompt: L
        }), q()
    }, A[4] = q, A[5] = _, A[6] = Y, A[7] = P;
    else P = A[7];
    let W = P,
        Z;
    if (A[8] === Symbol.for("react.memo_cache_sentinel")) Z = iX.default.createElement(C8, null, iX.default.createElement(a1, {
        shortcut: "Type",
        action: "enter text"
    }), iX.default.createElement(a1, {
        shortcut: "Enter",
        action: "continue"
    }), iX.default.createElement(O8, {
        action: "chat:externalEditor",
        context: "Chat",
        fallback: "ctrl+g",
        description: "open in editor"
    }), iX.default.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), A[8] = Z;
    else Z = A[8];
    let G, f;
    if (A[9] === Symbol.for("react.memo_cache_sentinel")) G = iX.default.createElement(T, null, "Enter the system prompt for your agent:"), f = iX.default.createElement(T, {
        dimColor: !0
    }, "Be comprehensive for best results"), A[9] = G, A[10] = f;
    else G = A[9], f = A[10];
    let v;
    if (A[11] !== O || A[12] !== W || A[13] !== _) v = iX.default.createElement(m, {
        marginTop: 1
    }, iX.default.createElement(J5, {
        value: _,
        onChange: w,
        onSubmit: W,
        placeholder: "You are a helpful code reviewer who...",
        columns: 80,
        cursorOffset: O,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), A[11] = O, A[12] = W, A[13] = _, A[14] = v;
    else v = A[14];
    let N;
    if (A[15] !== H) N = H && iX.default.createElement(m, {
        marginTop: 1
    }, iX.default.createElement(T, {
        color: "error"
    }, H)), A[15] = H, A[16] = N;
    else N = A[16];
    let V;
    if (A[17] !== v || A[18] !== N) V = iX.default.createElement(f$, {
        subtitle: "System prompt",
        footerText: Z
    }, iX.default.createElement(m, {
        flexDirection: "column"
    }, G, f, v, N)), A[17] = v, A[18] = N, A[19] = V;
    else V = A[19];
    return V
}
// @from(Ln 421796, Col 4)
iX
// @from(Ln 421797, Col 4)
eDq = E(() => {
    e6();
    i6();
    AH();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    _7();
    VE();
    iX = t(P6(), 1)
})
// @from(Ln 421811, Col 0)
function AXq() {
    let A = A6(18),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = Mw(),
        [_, w] = s0.useState(z.whenToUse || ""),
        [O, $] = s0.useState(_.length),
        [H, j] = s0.useState(null),
        J;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, A[0] = J;
    else J = A[0];
    D8("confirm:no", K, J);
    let M;
    if (A[1] !== _) M = async () => {
        let V = await NN(_);
        if (V.content !== null) w(V.content), $(V.content.length)
    }, A[1] = _, A[2] = M;
    else M = A[2];
    let D = M,
        X;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Chat"
    }, A[3] = X;
    else X = A[3];
    D8("chat:externalEditor", D, X);
    let P;
    if (A[4] !== q || A[5] !== Y) P = (V) => {
        let L = V.trim();
        if (!L) {
            j("Description is required");
            return
        }
        j(null), Y({
            whenToUse: L
        }), q()
    }, A[4] = q, A[5] = Y, A[6] = P;
    else P = A[6];
    let W = P,
        Z;
    if (A[7] === Symbol.for("react.memo_cache_sentinel")) Z = s0.default.createElement(C8, null, s0.default.createElement(a1, {
        shortcut: "Type",
        action: "enter text"
    }), s0.default.createElement(a1, {
        shortcut: "Enter",
        action: "continue"
    }), s0.default.createElement(O8, {
        action: "chat:externalEditor",
        context: "Chat",
        fallback: "ctrl+g",
        description: "open in editor"
    }), s0.default.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), A[7] = Z;
    else Z = A[7];
    let G;
    if (A[8] === Symbol.for("react.memo_cache_sentinel")) G = s0.default.createElement(T, null, "When should Claude use this agent?"), A[8] = G;
    else G = A[8];
    let f;
    if (A[9] !== O || A[10] !== W || A[11] !== _) f = s0.default.createElement(m, {
        marginTop: 1
    }, s0.default.createElement(J5, {
        value: _,
        onChange: w,
        onSubmit: W,
        placeholder: "e.g., use this agent after you're done writing code...",
        columns: 80,
        cursorOffset: O,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), A[9] = O, A[10] = W, A[11] = _, A[12] = f;
    else f = A[12];
    let v;
    if (A[13] !== H) v = H && s0.default.createElement(m, {
        marginTop: 1
    }, s0.default.createElement(T, {
        color: "error"
    }, H)), A[13] = H, A[14] = v;
    else v = A[14];
    let N;
    if (A[15] !== f || A[16] !== v) N = s0.default.createElement(f$, {
        subtitle: "Description (tell Claude when to use this agent)",
        footerText: Z
    }, s0.default.createElement(m, {
        flexDirection: "column"
    }, G, f, v)), A[15] = f, A[16] = v, A[17] = N;
    else N = A[17];
    return N
}
// @from(Ln 421908, Col 4)
s0
// @from(Ln 421909, Col 4)
qXq = E(() => {
    e6();
    i6();
    AH();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    _7();
    VE();
    s0 = t(P6(), 1)
})
// @from(Ln 421923, Col 0)
function y8z(A) {
    let q = new Map;
    return A.forEach((K) => {
        if (rk(K)) {
            let Y = iV(K.name);
            if (Y?.serverName) {
                let z = q.get(Y.serverName) || [];
                z.push(K), q.set(Y.serverName, z)
            }
        }
    }), Array.from(q.entries()).map(([K, Y]) => ({
        serverName: K,
        tools: Y
    })).sort((K, Y) => K.serverName.localeCompare(Y.serverName))
}
// @from(Ln 421939, Col 0)
function rR1(A) {
    let q = A6(68),
        {
            tools: K,
            initialTools: Y,
            onComplete: z,
            onCancel: _
        } = A,
        w;
    if (q[0] !== K) w = Xk8({
        tools: K,
        isBuiltIn: !1,
        isAsync: !1
    }), q[0] = K, q[1] = w;
    else w = q[1];
    let O = w,
        $;
    if (q[2] !== O || q[3] !== Y) $ = !Y || Y.includes("*") ? O.map(x8z) : Y, q[2] = O, q[3] = Y, q[4] = $;
    else $ = q[4];
    let H = $,
        [j, J] = lf.useState(H),
        [M, D] = lf.useState(0),
        [X, P] = lf.useState(!1),
        W;
    if (q[5] !== O) W = new Set(O.map(b8z)), q[5] = O, q[6] = W;
    else W = q[6];
    let Z = W,
        G;
    if (q[7] !== j || q[8] !== Z) {
        let i;
        if (q[10] !== Z) i = (l) => Z.has(l), q[10] = Z, q[11] = i;
        else i = q[11];
        G = j.filter(i), q[7] = j, q[8] = Z, q[9] = G
    } else G = q[9];
    let f = G,
        v;
    if (q[12] !== f) v = new Set(f), q[12] = f, q[13] = v;
    else v = q[13];
    let N = v,
        V = f.length === O.length && O.length > 0,
        L;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) L = (i) => {
        if (!i) return;
        J((l) => l.includes(i) ? l.filter((q6) => q6 !== i) : [...l, i])
    }, q[14] = L;
    else L = q[14];
    let h = L,
        R;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) R = (i, l) => {
        J((q6) => {
            if (l) {
                let w6 = i.filter((O6) => !q6.includes(O6));
                return [...q6, ...w6]
            } else return q6.filter((w6) => !i.includes(w6))
        })
    }, q[15] = R;
    else R = q[15];
    let u = R,
        I;
    if (q[16] !== O || q[17] !== z || q[18] !== f) I = () => {
        let i = O.map(I8z),
            q6 = f.length === i.length && i.every((w6) => f.includes(w6)) ? void 0 : f;
        z(q6)
    }, q[16] = O, q[17] = z, q[18] = f, q[19] = I;
    else I = q[19];
    let g = I,
        B;
    if (q[20] !== O) {
        let i = KXq();
        B = {
            readOnly: [],
            edit: [],
            execution: [],
            mcp: [],
            other: []
        }, O.forEach((l) => {
            if (rk(l)) B.mcp.push(l);
            else if (i.READ_ONLY.toolNames.has(l.name)) B.readOnly.push(l);
            else if (i.EDIT.toolNames.has(l.name)) B.edit.push(l);
            else if (i.EXECUTION.toolNames.has(l.name)) B.execution.push(l);
            else if (l.name !== r4) B.other.push(l)
        }), q[20] = O, q[21] = B
    } else B = q[21];
    let b = B,
        p;
    if (q[22] !== N) p = (i) => {
        let q6 = i.filter((w6) => N.has(w6.name)).length < i.length;
        return () => {
            let w6 = i.map(C8z);
            u(w6, q6)
        }
    }, q[22] = N, q[23] = p;
    else p = q[23];
    let Q = p,
        U;
    if (q[24] !== Q || q[25] !== O || q[26] !== M || q[27] !== g || q[28] !== V || q[29] !== N || q[30] !== X || q[31] !== b.edit || q[32] !== b.execution || q[33] !== b.mcp || q[34] !== b.other || q[35] !== b.readOnly) {
        U = [], U.push({
            id: "continue",
            label: "Continue",
            action: g,
            isContinue: !0
        });
        let i;
        if (q[37] !== O || q[38] !== V) i = () => {
            let y6 = O.map(S8z);
            u(y6, !V)
        }, q[37] = O, q[38] = V, q[39] = i;
        else i = q[39];
        U.push({
            id: "bucket-all",
            label: `${V?a6.checkboxOn:a6.checkboxOff} All tools`,
            action: i
        });
        let l = KXq();
        [{
            id: "bucket-readonly",
            name: l.READ_ONLY.name,
            tools: b.readOnly
        }, {
            id: "bucket-edit",
            name: l.EDIT.name,
            tools: b.edit
        }, {
            id: "bucket-execution",
            name: l.EXECUTION.name,
            tools: b.execution
        }, {
            id: "bucket-mcp",
            name: l.MCP.name,
            tools: b.mcp
        }, {
            id: "bucket-other",
            name: l.OTHER.name,
            tools: b.other
        }].forEach((y6) => {
            let {
                id: G6,
                name: R6,
                tools: T6
            } = y6;
            if (T6.length === 0) return;
            let Q6 = T6.filter((k6) => N.has(k6.name)).length === T6.length;
            U.push({
                id: G6,
                label: `${Q6?a6.checkboxOn:a6.checkboxOff} ${R6}`,
                action: Q(T6)
            })
        });
        let w6 = U.length,
            O6;
        if (q[40] !== M || q[41] !== X || q[42] !== w6) O6 = () => {
            if (P(!X), X && M > w6) D(w6)
        }, q[40] = M, q[41] = X, q[42] = w6, q[43] = O6;
        else O6 = q[43];
        U.push({
            id: "toggle-individual",
            label: X ? "Hide advanced options" : "Show advanced options",
            action: O6,
            isToggle: !0
        });
        let L6 = y8z(O);
        if (X) {
            if (L6.length > 0) U.push({
                id: "mcp-servers-header",
                label: "MCP Servers:",
                action: h8z,
                isHeader: !0
            }), L6.forEach((y6) => {
                let {
                    serverName: G6,
                    tools: R6
                } = y6, D6 = R6.filter((Q6) => N.has(Q6.name)).length === R6.length;
                U.push({
                    id: `mcp-server-${G6}`,
                    label: `${D6?a6.checkboxOn:a6.checkboxOff} ${G6} (${R6.length} tool${R6.length===1?"":"s"})`,
                    action: () => {
                        let Q6 = R6.map(R8z);
                        u(Q6, !D6)
                    }
                })
            }), U.push({
                id: "tools-header",
                label: "Individual Tools:",
                action: L8z,
                isHeader: !0
            });
            O.forEach((y6) => {
                let G6 = y6.name;
                if (y6.name.startsWith("mcp__")) {
                    let R6 = iV(y6.name);
                    G6 = R6 ? `${R6.toolName} (${R6.serverName})` : y6.name
                }
                U.push({
                    id: `tool-${y6.name}`,
                    label: `${N.has(y6.name)?a6.checkboxOn:a6.checkboxOff} ${G6}`,
                    action: () => h(y6.name)
                })
            })
        }
        q[24] = Q, q[25] = O, q[26] = M, q[27] = g, q[28] = V, q[29] = N, q[30] = X, q[31] = b.edit, q[32] = b.execution, q[33] = b.mcp, q[34] = b.other, q[35] = b.readOnly, q[36] = U
    } else U = q[36];
    let r;
    if (q[44] !== Y || q[45] !== _ || q[46] !== z) r = () => {
        if (_) _();
        else z(Y)
    }, q[44] = Y, q[45] = _, q[46] = z, q[47] = r;
    else r = q[47];
    let e = r,
        Y6;
    if (q[48] === Symbol.for("react.memo_cache_sentinel")) Y6 = {
        context: "Confirmation"
    }, q[48] = Y6;
    else Y6 = q[48];
    D8("confirm:no", e, Y6);
    let H6;
    if (q[49] !== M || q[50] !== U) H6 = (i, l) => {
        if (l.return) {
            let q6 = U[M];
            if (q6 && !q6.isHeader) q6.action()
        } else if (l.upArrow) {
            let q6 = M - 1;
            while (q6 > 0 && U[q6]?.isHeader) q6--;
            D(Math.max(0, q6))
        } else if (l.downArrow) {
            let q6 = M + 1;
            while (q6 < U.length - 1 && U[q6]?.isHeader) q6++;
            D(Math.min(U.length - 1, q6))
        }
    }, q[49] = M, q[50] = U, q[51] = H6;
    else H6 = q[51];
    jA(H6);
    let J6 = M === 0 ? "suggestion" : void 0,
        K6 = M === 0,
        s = M === 0 ? `${a6.pointer} ` : "  ",
        X6;
    if (q[52] !== J6 || q[53] !== K6 || q[54] !== s) X6 = lf.default.createElement(T, {
        color: J6,
        bold: K6
    }, s, "[ Continue ]"), q[52] = J6, q[53] = K6, q[54] = s, q[55] = X6;
    else X6 = q[55];
    let z6;
    if (q[56] === Symbol.for("react.memo_cache_sentinel")) z6 = lf.default.createElement(Wk, {
        width: 40
    }), q[56] = z6;
    else z6 = q[56];
    let N6;
    if (q[57] !== U) N6 = U.slice(1), q[57] = U, q[58] = N6;
    else N6 = q[58];
    let $6;
    if (q[59] !== M || q[60] !== N6) $6 = N6.map((i, l) => {
        let q6 = l + 1 === M,
            w6 = i.isToggle,
            O6 = i.isHeader;
        return lf.default.createElement(lf.default.Fragment, {
            key: i.id
        }, w6 && lf.default.createElement(Wk, {
            width: 40
        }), O6 && l > 0 && lf.default.createElement(m, {
            marginTop: 1
        }), lf.default.createElement(T, {
            color: O6 ? void 0 : q6 ? "suggestion" : void 0,
            dimColor: O6,
            bold: w6 && q6
        }, O6 ? "" : q6 ? `${a6.pointer} ` : "  ", w6 ? `[ ${i.label} ]` : i.label))
    }), q[59] = M, q[60] = N6, q[61] = $6;
    else $6 = q[61];
    let n = V ? "All tools selected" : `${N.size} of ${O.length} tools selected`,
        o;
    if (q[62] !== n) o = lf.default.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, lf.default.createElement(T, {
        dimColor: !0
    }, n)), q[62] = n, q[63] = o;
    else o = q[63];
    let a;
    if (q[64] !== X6 || q[65] !== $6 || q[66] !== o) a = lf.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, X6, z6, $6, o), q[64] = X6, q[65] = $6, q[66] = o, q[67] = a;
    else a = q[67];
    return a
}
// @from(Ln 422223, Col 0)
function L8z() {}
// @from(Ln 422225, Col 0)
function R8z(A) {
    return A.name
}
// @from(Ln 422229, Col 0)
function h8z() {}
// @from(Ln 422231, Col 0)
function S8z(A) {
    return A.name
}
// @from(Ln 422235, Col 0)
function C8z(A) {
    return A.name
}
// @from(Ln 422239, Col 0)
function I8z(A) {
    return A.name
}
// @from(Ln 422243, Col 0)
function b8z(A) {
    return A.name
}
// @from(Ln 422247, Col 0)
function x8z(A) {
    return A.name
}
// @from(Ln 422250, Col 4)
lf
// @from(Ln 422250, Col 8)
KXq = () => ({
    READ_ONLY: {
        name: "Read-only tools",
        toolNames: new Set([rg.name, bb.name, zD.name, L9.name, BX.name, xv.name, lk1.name, Uk1.name, ck1.name, Ll.name, hl.name])
    },
    EDIT: {
        name: "Edit tools",
        toolNames: new Set([pX.name, xX.name, Vl.name])
    },
    EXECUTION: {
        name: "Execution tools",
        toolNames: new Set([J4.name, void 0].filter(Boolean))
    },
    MCP: {
        name: "MCP tools",
        toolNames: new Set,
        isMcp: !0
    },
    OTHER: {
        name: "Other tools",
        toolNames: new Set
    }
})
// @from(Ln 422273, Col 4)
hl8 = E(() => {
    e6();
    i6();
    i6();
    _7();
    b7();
    cu6();
    sy();
    qM();
    Ll6();
    KT6();
    tl6();
    RI();
    vT6();
    R06();
    og8();
    dg8();
    ng8();
    sk1();
    tk1();
    Sz6();
    c66();
    Rl6();
    OZ();
    cW6();
    lf = t(P6(), 1)
})
// @from(Ln 422301, Col 0)
function YXq(A) {
    let q = A6(9),
        {
            tools: K
        } = A,
        {
            goNext: Y,
            goBack: z,
            updateWizardData: _,
            wizardData: w
        } = Mw(),
        O;
    if (q[0] !== Y || q[1] !== _) O = (M) => {
        _({
            selectedTools: M
        }), Y()
    }, q[0] = Y, q[1] = _, q[2] = O;
    else O = q[2];
    let $ = O,
        H = w.selectedTools,
        j;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) j = E_6.default.createElement(C8, null, E_6.default.createElement(a1, {
        shortcut: "Enter",
        action: "toggle selection"
    }), E_6.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), E_6.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), q[3] = j;
    else j = q[3];
    let J;
    if (q[4] !== z || q[5] !== $ || q[6] !== H || q[7] !== K) J = E_6.default.createElement(f$, {
        subtitle: "Select tools",
        footerText: j
    }, E_6.default.createElement(rR1, {
        tools: K,
        initialTools: H,
        onComplete: $,
        onCancel: z
    })), q[4] = z, q[5] = $, q[6] = H, q[7] = K, q[8] = J;
    else J = q[8];
    return J
}
// @from(Ln 422348, Col 4)
E_6
// @from(Ln 422349, Col 4)
zXq = E(() => {
    e6();
    hl8();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    E_6 = t(P6(), 1)
})
// @from(Ln 422360, Col 0)
function oR1(A) {
    let q = A6(11),
        {
            initialModel: K,
            onComplete: Y,
            onCancel: z
        } = A,
        _;
    if (q[0] !== K) {
        A: {
            let J = D_4();
            if (K && !J.some((M) => M.value === K)) {
                _ = [{
                    value: K,
                    label: K,
                    description: "Current model (custom ID)"
                }, ...J];
                break A
            }
            _ = J
        }
        q[0] = K,
        q[1] = _
    }
    else _ = q[1];
    let w = _,
        O = K ?? "sonnet",
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = wi.createElement(m, {
        marginBottom: 1
    }, wi.createElement(T, {
        dimColor: !0
    }, "Model determines the agent's reasoning capabilities and speed.")), q[2] = $;
    else $ = q[2];
    let H;
    if (q[3] !== z || q[4] !== Y) H = () => z ? z() : Y(void 0), q[3] = z, q[4] = Y, q[5] = H;
    else H = q[5];
    let j;
    if (q[6] !== O || q[7] !== w || q[8] !== Y || q[9] !== H) j = wi.createElement(m, {
        flexDirection: "column"
    }, $, wi.createElement(T8, {
        options: w,
        defaultValue: O,
        onChange: Y,
        onCancel: H
    })), q[6] = O, q[7] = w, q[8] = Y, q[9] = H, q[10] = j;
    else j = q[10];
    return j
}
// @from(Ln 422409, Col 4)
wi
// @from(Ln 422410, Col 4)
Sl8 = E(() => {
    e6();
    i6();
    v3();
    A96();
    wi = t(P6(), 1)
})
// @from(Ln 422418, Col 0)
function _Xq() {
    let A = A6(8),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = Mw(),
        _;
    if (A[0] !== q || A[1] !== Y) _ = (H) => {
        Y({
            selectedModel: H
        }), q()
    }, A[0] = q, A[1] = Y, A[2] = _;
    else _ = A[2];
    let w = _,
        O;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) O = y_6.default.createElement(C8, null, y_6.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), y_6.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), y_6.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[3] = O;
    else O = A[3];
    let $;
    if (A[4] !== K || A[5] !== w || A[6] !== z.selectedModel) $ = y_6.default.createElement(f$, {
        subtitle: "Select model",
        footerText: O
    }, y_6.default.createElement(oR1, {
        initialModel: z.selectedModel,
        onComplete: w,
        onCancel: K
    })), A[4] = K, A[5] = w, A[6] = z.selectedModel, A[7] = $;
    else $ = A[7];
    return $
}
// @from(Ln 422460, Col 4)
y_6
// @from(Ln 422461, Col 4)
wXq = E(() => {
    e6();
    Sl8();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    y_6 = t(P6(), 1)
})
// @from(Ln 422472, Col 0)
function aR1(A) {
    let q = A6(16),
        {
            agentName: K,
            currentColor: Y,
            onConfirm: z
        } = A,
        _ = Y === void 0 ? "automatic" : Y,
        w;
    if (q[0] !== _) w = ZN6.findIndex((W) => W === _), q[0] = _, q[1] = w;
    else w = q[1];
    let [O, $] = OXq.useState(Math.max(0, w)), H;
    if (q[2] !== z || q[3] !== O) H = (W, Z) => {
        if (Z.upArrow) $(m8z);
        else if (Z.downArrow) $(u8z);
        else if (Z.return) {
            let G = ZN6[O];
            z(G === "automatic" ? void 0 : G)
        }
    }, q[2] = z, q[3] = O, q[4] = H;
    else H = q[4];
    jA(H);
    let j = ZN6[O],
        J;
    if (q[5] !== O) J = ZN6.map((W, Z) => {
        let G = Z === O;
        return RE.default.createElement(m, {
            key: W,
            flexDirection: "row",
            gap: 1
        }, RE.default.createElement(T, {
            color: G ? "suggestion" : void 0
        }, G ? a6.pointer : " "), W === "automatic" ? RE.default.createElement(T, {
            bold: G
        }, "Automatic color") : RE.default.createElement(m, {
            gap: 1
        }, RE.default.createElement(T, {
            backgroundColor: t$[W],
            color: "inverseText"
        }, " "), RE.default.createElement(T, {
            bold: G
        }, W.charAt(0).toUpperCase() + W.slice(1))))
    }), q[5] = O, q[6] = J;
    else J = q[6];
    let M;
    if (q[7] !== J) M = RE.default.createElement(m, {
        flexDirection: "column"
    }, J), q[7] = J, q[8] = M;
    else M = q[8];
    let D;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) D = RE.default.createElement(T, null, "Preview: "), q[9] = D;
    else D = q[9];
    let X;
    if (q[10] !== K || q[11] !== j) X = RE.default.createElement(m, {
        marginTop: 1
    }, D, j === void 0 || j === "automatic" ? RE.default.createElement(T, {
        inverse: !0,
        bold: !0
    }, " ", "@", K, " ") : RE.default.createElement(T, {
        backgroundColor: t$[j],
        color: "inverseText",
        bold: !0
    }, " ", "@", K, " ")), q[10] = K, q[11] = j, q[12] = X;
    else X = q[12];
    let P;
    if (q[13] !== M || q[14] !== X) P = RE.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, M, X), q[13] = M, q[14] = X, q[15] = P;
    else P = q[15];
    return P
}
// @from(Ln 422545, Col 0)
function u8z(A) {
    return A < ZN6.length - 1 ? A + 1 : 0
}
// @from(Ln 422549, Col 0)
function m8z(A) {
    return A > 0 ? A - 1 : ZN6.length - 1
}
// @from(Ln 422552, Col 4)
RE
// @from(Ln 422552, Col 8)
OXq
// @from(Ln 422552, Col 13)
ZN6
// @from(Ln 422553, Col 4)
Cl8 = E(() => {
    e6();
    i6();
    H0();
    b7();
    RE = t(P6(), 1), OXq = t(P6(), 1), ZN6 = ["automatic", ...s$]
})
// @from(Ln 422561, Col 0)
function $Xq() {
    let A = A6(14),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = Mw(),
        _;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Confirmation"
    }, A[0] = _;
    else _ = A[0];
    D8("confirm:no", K, _);
    let w;
    if (A[1] !== q || A[2] !== Y || A[3] !== z.agentType || A[4] !== z.location || A[5] !== z.selectedModel || A[6] !== z.selectedTools || A[7] !== z.systemPrompt || A[8] !== z.whenToUse) w = (J) => {
        Y({
            selectedColor: J,
            finalAgent: {
                agentType: z.agentType,
                whenToUse: z.whenToUse,
                getSystemPrompt: () => z.systemPrompt,
                tools: z.selectedTools,
                ...z.selectedModel ? {
                    model: z.selectedModel
                } : {},
                ...J ? {
                    color: J
                } : {},
                source: z.location
            }
        }), q()
    }, A[1] = q, A[2] = Y, A[3] = z.agentType, A[4] = z.location, A[5] = z.selectedModel, A[6] = z.selectedTools, A[7] = z.systemPrompt, A[8] = z.whenToUse, A[9] = w;
    else w = A[9];
    let O = w,
        $;
    if (A[10] === Symbol.for("react.memo_cache_sentinel")) $ = Q16.default.createElement(C8, null, Q16.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), Q16.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), Q16.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[10] = $;
    else $ = A[10];
    let H = z.agentType || "agent",
        j;
    if (A[11] !== O || A[12] !== H) j = Q16.default.createElement(f$, {
        subtitle: "Choose background color",
        footerText: $
    }, Q16.default.createElement(m, null, Q16.default.createElement(aR1, {
        agentName: H,
        currentColor: "automatic",
        onConfirm: O
    }))), A[11] = O, A[12] = H, A[13] = j;
    else j = A[13];
    return j
}
// @from(Ln 422623, Col 4)
Q16
// @from(Ln 422624, Col 4)
HXq = E(() => {
    e6();
    i6();
    Cl8();
    LE();
    hN();
    Lq();
    OK();
    Xq();
    _7();
    Q16 = t(P6(), 1)
})
// @from(Ln 422637, Col 0)
function jXq() {
    let A = A6(13),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = Mw(),
        _;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Confirmation"
    }, A[0] = _;
    else _ = A[0];
    D8("confirm:no", K, _);
    let w = z.location === "userSettings",
        O;
    if (A[1] !== w) O = w ? [{
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
    }], A[1] = w, A[2] = O;
    else O = A[2];
    let $ = O,
        H;
    if (A[3] !== q || A[4] !== Y || A[5] !== z.finalAgent || A[6] !== z.systemPrompt) H = (D) => {
        let X = D === "none" ? void 0 : D,
            P = z.finalAgent?.agentType;
        Y({
            selectedMemory: X,
            finalAgent: z.finalAgent ? {
                ...z.finalAgent,
                memory: X,
                getSystemPrompt: Z3() && X && P ? () => z.systemPrompt + `

` + m36(P, X) : () => z.systemPrompt
            } : void 0
        }), q()
    }, A[3] = q, A[4] = Y, A[5] = z.finalAgent, A[6] = z.systemPrompt, A[7] = H;
    else H = A[7];
    let j = H,
        J;
    if (A[8] === Symbol.for("react.memo_cache_sentinel")) J = U16.default.createElement(C8, null, U16.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), U16.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), U16.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[8] = J;
    else J = A[8];
    let M;
    if (A[9] !== K || A[10] !== j || A[11] !== $) M = U16.default.createElement(f$, {
        subtitle: "Configure agent memory",
        footerText: J
    }, U16.default.createElement(m, null, U16.default.createElement(T8, {
        key: "memory-select",
        options: $,
        onChange: j,
        onCancel: K
    }))), A[9] = K, A[10] = j, A[11] = $, A[12] = M;
    else M = A[12];
    return M
}
// @from(Ln 422724, Col 4)
U16
// @from(Ln 422725, Col 4)
JXq = E(() => {
    e6();
    mH();
    i6();
    v3();
    LE();
    hN();
    yI();
    Lq();
    OK();
    Xq();
    _7();
    U16 = t(P6(), 1)
})
// @from(Ln 422740, Col 0)
function MXq(A) {
    let q = A6(81),
        {
            tools: K,
            existingAgents: Y,
            onSave: z,
            onSaveAndEdit: _,
            error: w
        } = A,
        {
            goBack: O,
            wizardData: $
        } = Mw(),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Confirmation"
    }, q[0] = H;
    else H = q[0];
    D8("confirm:no", O, H);
    let j;
    if (q[1] !== z || q[2] !== _) j = (r, e) => {
        if (r === "s" || e.return) z();
        else if (r === "e") _()
    }, q[1] = z, q[2] = _, q[3] = j;
    else j = q[3];
    jA(j);
    let J = $.finalAgent,
        M, D, X, P, W, Z, G, f, v, N, V, L, h, R, u, I;
    if (q[4] !== J || q[5] !== Y || q[6] !== K || q[7] !== $.location) {
        let r = oDq(J, K, Y),
            e;
        if (q[24] !== J) e = jq(J.getSystemPrompt(), 240), q[24] = J, q[25] = e;
        else e = q[25];
        let Y6 = e,
            H6;
        if (q[26] !== J.whenToUse) H6 = jq(J.whenToUse, 240), q[26] = J.whenToUse, q[27] = H6;
        else H6 = q[27];
        let J6 = H6,
            K6 = F8z,
            s;
        if (q[28] !== J.memory) s = Z3() ? m3.default.createElement(T, null, m3.default.createElement(T, {
            bold: !0
        }, "Memory"), ": ", LP1(J.memory)) : null, q[28] = J.memory, q[29] = s;
        else s = q[29];
        let X6 = s;
        if (D = f$, f = "Confirm and save", q[30] === Symbol.for("react.memo_cache_sentinel")) v = m3.default.createElement(C8, null, m3.default.createElement(a1, {
            shortcut: "s/Enter",
            action: "save"
        }), m3.default.createElement(a1, {
            shortcut: "e",
            action: "edit in your editor"
        }), m3.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })), q[30] = v;
        else v = q[30];
        M = m, N = "column";
        let z6;
        if (q[31] === Symbol.for("react.memo_cache_sentinel")) z6 = m3.default.createElement(T, {
            bold: !0
        }, "Name"), q[31] = z6;
        else z6 = q[31];
        if (q[32] !== J.agentType) V = m3.default.createElement(T, null, z6, ": ", J.agentType), q[32] = J.agentType, q[33] = V;
        else V = q[33];
        let N6;
        if (q[34] === Symbol.for("react.memo_cache_sentinel")) N6 = m3.default.createElement(T, {
            bold: !0
        }, "Location"), q[34] = N6;
        else N6 = q[34];
        let $6;
        if (q[35] !== J.agentType || q[36] !== $.location) $6 = CDq({
            source: $.location,
            agentType: J.agentType
        }), q[35] = J.agentType, q[36] = $.location, q[37] = $6;
        else $6 = q[37];
        if (q[38] !== $6) L = m3.default.createElement(T, null, N6, ":", " ", $6), q[38] = $6, q[39] = L;
        else L = q[39];
        let n;
        if (q[40] === Symbol.for("react.memo_cache_sentinel")) n = m3.default.createElement(T, {
            bold: !0
        }, "Tools"), q[40] = n;
        else n = q[40];
        let o;
        if (q[41] !== J.tools) o = K6(J.tools), q[41] = J.tools, q[42] = o;
        else o = q[42];
        if (q[43] !== o) h = m3.default.createElement(T, null, n, ": ", o), q[43] = o, q[44] = h;
        else h = q[44];
        let a;
        if (q[45] === Symbol.for("react.memo_cache_sentinel")) a = m3.default.createElement(T, {
            bold: !0
        }, "Model"), q[45] = a;
        else a = q[45];
        let i;
        if (q[46] !== J.model) i = I01(J.model), q[46] = J.model, q[47] = i;
        else i = q[47];
        if (q[48] !== i) R = m3.default.createElement(T, null, a, ": ", i), q[48] = i, q[49] = R;
        else R = q[49];
        if (u = X6, q[50] === Symbol.for("react.memo_cache_sentinel")) I = m3.default.createElement(m, {
            marginTop: 1
        }, m3.default.createElement(T, null, m3.default.createElement(T, {
            bold: !0
        }, "Description"), " (tells Claude when to use this agent):")), q[50] = I;
        else I = q[50];
        if (q[51] !== J6) X = m3.default.createElement(m, {
            marginLeft: 2,
            marginTop: 1
        }, m3.default.createElement(T, null, J6)), q[51] = J6, q[52] = X;
        else X = q[52];
        if (q[53] === Symbol.for("react.memo_cache_sentinel")) P = m3.default.createElement(m, {
            marginTop: 1
        }, m3.default.createElement(T, null, m3.default.createElement(T, {
            bold: !0
        }, "System prompt"), ":")), q[53] = P;
        else P = q[53];
        if (q[54] !== Y6) W = m3.default.createElement(m, {
            marginLeft: 2,
            marginTop: 1
        }, m3.default.createElement(T, null, Y6)), q[54] = Y6, q[55] = W;
        else W = q[55];
        Z = r.warnings.length > 0 && m3.default.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, m3.default.createElement(T, {
            color: "warning"
        }, "Warnings:"), r.warnings.map(g8z)), G = r.errors.length > 0 && m3.default.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, m3.default.createElement(T, {
            color: "error"
        }, "Errors:"), r.errors.map(B8z)), q[4] = J, q[5] = Y, q[6] = K, q[7] = $.location, q[8] = M, q[9] = D, q[10] = X, q[11] = P, q[12] = W, q[13] = Z, q[14] = G, q[15] = f, q[16] = v, q[17] = N, q[18] = V, q[19] = L, q[20] = h, q[21] = R, q[22] = u, q[23] = I
    } else M = q[8], D = q[9], X = q[10], P = q[11], W = q[12], Z = q[13], G = q[14], f = q[15], v = q[16], N = q[17], V = q[18], L = q[19], h = q[20], R = q[21], u = q[22], I = q[23];
    let g;
    if (q[56] !== w) g = w && m3.default.createElement(m, {
        marginTop: 1
    }, m3.default.createElement(T, {
        color: "error"
    }, w)), q[56] = w, q[57] = g;
    else g = q[57];
    let B;
    if (q[58] === Symbol.for("react.memo_cache_sentinel")) B = m3.default.createElement(T, {
        bold: !0
    }, "s"), q[58] = B;
    else B = q[58];
    let b;
    if (q[59] === Symbol.for("react.memo_cache_sentinel")) b = m3.default.createElement(T, {
        bold: !0
    }, "Enter"), q[59] = b;
    else b = q[59];
    let p;
    if (q[60] === Symbol.for("react.memo_cache_sentinel")) p = m3.default.createElement(m, {
        marginTop: 2
    }, m3.default.createElement(T, {
        color: "success"
    }, "Press ", B, " or ", b, " to save,", " ", m3.default.createElement(T, {
        bold: !0
    }, "e"), " to save and edit")), q[60] = p;
    else p = q[60];
    let Q;
    if (q[61] !== M || q[62] !== X || q[63] !== P || q[64] !== W || q[65] !== Z || q[66] !== G || q[67] !== g || q[68] !== N || q[69] !== V || q[70] !== L || q[71] !== h || q[72] !== R || q[73] !== u || q[74] !== I) Q = m3.default.createElement(M, {
        flexDirection: N
    }, V, L, h, R, u, I, X, P, W, Z, G, g, p), q[61] = M, q[62] = X, q[63] = P, q[64] = W, q[65] = Z, q[66] = G, q[67] = g, q[68] = N, q[69] = V, q[70] = L, q[71] = h, q[72] = R, q[73] = u, q[74] = I, q[75] = Q;
    else Q = q[75];
    let U;
    if (q[76] !== D || q[77] !== f || q[78] !== v || q[79] !== Q) U = m3.default.createElement(D, {
        subtitle: f,
        footerText: v
    }, Q), q[76] = D, q[77] = f, q[78] = v, q[79] = Q, q[80] = U;
    else U = q[80];
    return U
}
// @from(Ln 422913, Col 0)
function B8z(A, q) {
    return m3.default.createElement(T, {
        key: q,
        color: "error"
    }, " ", "• ", A)
}
// @from(Ln 422920, Col 0)
function g8z(A, q) {
    return m3.default.createElement(T, {
        key: q,
        dimColor: !0
    }, " ", "• ", A)
}
// @from(Ln 422927, Col 0)
function F8z(A) {
    if (A === void 0) return "All tools";
    if (A.length === 0) return "None";
    if (A.length === 1) return A[0] || "None";
    if (A.length === 2) return A.join(" and ");
    return `${A.slice(0,-1).join(", ")}, and ${A[A.length-1]}`
}
// @from(Ln 422934, Col 4)
m3
// @from(Ln 422935, Col 4)
DXq = E(() => {
    e6();
    mH();
    M4();
    i6();
    _7();
    LE();
    hN();
    Rl8();
    PN6();
    A96();
    Lq();
    OK();
    Xq();
    yI();
    m3 = t(P6(), 1)
})
// @from(Ln 422953, Col 0)
function XXq({
    tools: A,
    existingAgents: q,
    onComplete: K
}) {
    let {
        wizardData: Y
    } = Mw(), [z, _] = d16.useState(null), w = xA(), O = d16.useCallback(async (j) => {
        if (!Y?.finalAgent) return;
        try {
            if (await bDq(Y.location, Y.finalAgent.agentType, Y.finalAgent.whenToUse, Y.finalAgent.tools, Y.finalAgent.getSystemPrompt(), !0, Y.finalAgent.color, Y.finalAgent.model, Y.finalAgent.memory), w((M) => {
                    if (!Y.finalAgent) return M;
                    let D = M.agentDefinitions.allAgents.concat(Y.finalAgent);
                    return {
                        ...M,
                        agentDefinitions: {
                            ...M.agentDefinitions,
                            activeAgents: dv(D),
                            allAgents: D
                        }
                    }
                }), j) {
                let M = Tl8({
                    source: Y.location,
                    agentType: Y.finalAgent.agentType
                });
                await NE(M)
            }
            d("tengu_agent_created", {
                agent_type: Y.finalAgent.agentType,
                generation_method: Y.wasGenerated ? "generated" : "manual",
                source: Y.location,
                tool_count: Y.finalAgent.tools?.length ?? "all",
                has_custom_model: !!Y.finalAgent.model,
                has_custom_color: !!Y.finalAgent.color,
                has_memory: !!Y.finalAgent.memory,
                memory_scope: Y.finalAgent.memory ?? "none",
                ...j ? {
                    opened_in_editor: !0
                } : {}
            });
            let J = j ? `Created agent: ${O1.bold(Y.finalAgent.agentType)} and opened in editor. If you made edits, restart to load the latest version.` : `Created agent: ${O1.bold(Y.finalAgent.agentType)}`;
            K(J)
        } catch (J) {
            _(J instanceof Error ? J.message : "Failed to save agent")
        }
    }, [Y, K, w]), $ = d16.useCallback(() => O(!1), [O]), H = d16.useCallback(() => O(!0), [O]);
    return d16.default.createElement(MXq, {
        tools: A,
        existingAgents: q,
        onSave: $,
        onSaveAndEdit: H,
        error: z
    })
}
// @from(Ln 423008, Col 4)
d16
// @from(Ln 423009, Col 4)
PXq = E(() => {
    aK();
    hN();
    DXq();
    PN6();
    J0();
    VE();
    V1();
    NA();
    d16 = t(P6(), 1)
})
// @from(Ln 423021, Col 0)
function WXq(A) {
    let q = A6(17),
        {
            tools: K,
            existingAgents: Y,
            onComplete: z,
            onCancel: _
        } = A,
        w;
    if (q[0] !== Y) w = () => Mr6.default.createElement(aDq, {
        existingAgents: Y
    }), q[0] = Y, q[1] = w;
    else w = q[1];
    let O;
    if (q[2] !== K) O = () => Mr6.default.createElement(YXq, {
        tools: K
    }), q[2] = K, q[3] = O;
    else O = q[3];
    let $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = Z3() ? [jXq] : [], q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== Y || q[6] !== z || q[7] !== K) H = () => Mr6.default.createElement(XXq, {
        tools: K,
        existingAgents: Y,
        onComplete: z
    }), q[5] = Y, q[6] = z, q[7] = K, q[8] = H;
    else H = q[8];
    let j;
    if (q[9] !== w || q[10] !== O || q[11] !== H) j = [pDq, UDq, nDq, w, tDq, AXq, O, _Xq, $Xq, ...$, H], q[9] = w, q[10] = O, q[11] = H, q[12] = j;
    else j = q[12];
    let J = j,
        M;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) M = {}, q[13] = M;
    else M = q[13];
    let D;
    if (q[14] !== _ || q[15] !== J) D = Mr6.default.createElement(Nl8, {
        steps: J,
        initialData: M,
        onComplete: p8z,
        onCancel: _,
        title: "Create new agent",
        showStepCounter: !1
    }), q[14] = _, q[15] = J, q[16] = D;
    else D = q[16];
    return D
}
// @from(Ln 423069, Col 0)
function p8z() {}
// @from(Ln 423070, Col 4)
Mr6
// @from(Ln 423071, Col 4)
ZXq = E(() => {
    e6();
    mH();
    hN();
    QDq();
    dDq();
    rDq();
    sDq();
    eDq();
    qXq();
    zXq();
    wXq();
    HXq();
    JXq();
    PXq();
    Mr6 = t(P6(), 1)
})
// @from(Ln 423089, Col 0)
function GXq({
    agent: A,
    tools: q,
    onSaved: K,
    onBack: Y
}) {
    let z = xA(),
        [_, w] = Ih.useState("menu"),
        [O, $] = Ih.useState(0),
        [H, j] = Ih.useState(null),
        [J, M] = Ih.useState(A.color),
        D = Ih.useCallback(async () => {
            let f = iR1(A),
                v = await NE(f);
            if (v.error) j(v.error);
            else K(`Opened ${A.agentType} in editor. If you made edits, restart to load the latest version.`)
        }, [A, K]),
        X = Ih.useCallback(async (f = {}) => {
            let {
                tools: v,
                color: N,
                model: V
            } = f, L = N ?? J, h = v !== void 0, R = V !== void 0, u = L !== A.color;
            if (!h && !R && !u) return !1;
            try {
                if (!YQ6(A) && !zQ6(A)) return !1;
                if (await xDq(A, A.whenToUse, v ?? A.tools, A.getSystemPrompt(), L, V ?? A.model), u && L) t36(A.agentType, L);
                return z((I) => {
                    let g = I.agentDefinitions.allAgents.map((B) => B.agentType === A.agentType ? {
                        ...B,
                        tools: v ?? B.tools,
                        color: L,
                        model: V ?? B.model
                    } : B);
                    return {
                        ...I,
                        agentDefinitions: {
                            ...I.agentDefinitions,
                            activeAgents: dv(g),
                            allAgents: g
                        }
                    }
                }), K(`Updated agent: ${O1.bold(A.agentType)}`), !0
            } catch (I) {
                return j(I instanceof Error ? I.message : "Failed to save agent"), !1
            }
        }, [A, J, K, z]),
        P = Ih.useMemo(() => [{
            label: "Open in editor",
            action: D
        }, {
            label: "Edit tools",
            action: () => w("edit-tools")
        }, {
            label: "Edit model",
            action: () => w("edit-model")
        }, {
            label: "Edit color",
            action: () => w("edit-color")
        }], [D]),
        W = Ih.useCallback(() => {
            if (j(null), _ === "menu") Y();
            else w("menu")
        }, [_, Y]),
        Z = Ih.useCallback((f) => {
            if (f.upArrow) $((v) => Math.max(0, v - 1));
            else if (f.downArrow) $((v) => Math.min(P.length - 1, v + 1));
            else if (f.return) {
                let v = P[O];
                if (v) v.action()
            }
        }, [P, O]);
    D8("confirm:no", W, {
        context: "Confirmation"
    }), jA((f, v) => {
        if (_ === "menu") Z(v)
    });
    let G = () => XD.createElement(m, {
        flexDirection: "column"
    }, XD.createElement(T, {
        dimColor: !0
    }, "Source: ", WN6(A.source)), XD.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, P.map((f, v) => XD.createElement(T, {
        key: f.label,
        color: v === O ? "suggestion" : void 0
    }, v === O ? `${a6.pointer} ` : "  ", f.label))), H && XD.createElement(m, {
        marginTop: 1
    }, XD.createElement(T, {
        color: "error"
    }, H)));
    switch (_) {
        case "menu":
            return G();
        case "edit-tools":
            return XD.createElement(rR1, {
                tools: q,
                initialTools: A.tools,
                onComplete: async (f) => {
                    w("menu"), await X({
                        tools: f
                    })
                }
            });
        case "edit-color":
            return XD.createElement(aR1, {
                agentName: A.agentType,
                currentColor: J || A.color || "automatic",
                onConfirm: async (f) => {
                    M(f), w("menu"), await X({
                        color: f
                    })
                }
            });
        case "edit-model":
            return XD.createElement(oR1, {
                initialModel: A.model,
                onComplete: async (f) => {
                    w("menu"), await X({
                        model: f
                    })
                }
            });
        default:
            return null
    }
}
// @from(Ln 423217, Col 4)
XD
// @from(Ln 423217, Col 8)
Ih
// @from(Ln 423218, Col 4)
fXq = E(() => {
    i6();
    _7();
    aK();
    J0();
    hl8();
    Cl8();
    Sl8();
    PN6();
    VE();
    H0();
    b7();
    nR1();
    NA();
    XD = t(P6(), 1), Ih = t(P6(), 1)
})
// @from(Ln 423235, Col 0)
function TXq(A) {
    let q = A6(47),
        {
            agent: K,
            tools: Y,
            onBack: z
        } = A,
        _ = _c(K, Y, !1),
        w;
    if (q[0] !== K) w = IDq(K), q[0] = K, q[1] = w;
    else w = q[1];
    let O = w,
        $;
    if (q[2] !== K.agentType) $ = s36(K.agentType), q[2] = K.agentType, q[3] = $;
    else $ = q[3];
    let H = $,
        j;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) j = {
        context: "Confirmation"
    }, q[4] = j;
    else j = q[4];
    D8("confirm:no", z, j);
    let J;
    if (q[5] !== z) J = (U, r) => {
        if (r.return) z()
    }, q[5] = z, q[6] = J;
    else J = q[6];
    jA(J);
    let M = function() {
            if (_.hasWildcard) return e7.createElement(T, null, "All tools");
            if (!K.tools || K.tools.length === 0) return e7.createElement(T, null, "None");
            return e7.createElement(e7.Fragment, null, _.validTools.length > 0 && e7.createElement(T, null, _.validTools.join(", ")), _.invalidTools.length > 0 && e7.createElement(T, {
                color: "warning"
            }, a6.warning, " Unrecognized:", " ", _.invalidTools.join(", ")))
        },
        D = m,
        X = "column",
        P = 1,
        W;
    if (q[7] !== O) W = e7.createElement(T, {
        dimColor: !0
    }, O), q[7] = O, q[8] = W;
    else W = q[8];
    let Z;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) Z = e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Description"), " (tells Claude when to use this agent):"), q[9] = Z;
    else Z = q[9];
    let G;
    if (q[10] !== K.whenToUse) G = e7.createElement(m, {
        flexDirection: "column"
    }, Z, e7.createElement(m, {
        marginLeft: 2
    }, e7.createElement(T, null, K.whenToUse))), q[10] = K.whenToUse, q[11] = G;
    else G = q[11];
    let f = m,
        v;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) v = e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Tools"), ":", " "), q[12] = v;
    else v = q[12];
    let N = M(),
        V;
    if (q[13] !== f || q[14] !== v || q[15] !== N) V = e7.createElement(f, null, v, N), q[13] = f, q[14] = v, q[15] = N, q[16] = V;
    else V = q[16];
    let L;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) L = e7.createElement(T, {
        bold: !0
    }, "Model"), q[17] = L;
    else L = q[17];
    let h;
    if (q[18] !== K.model) h = I01(K.model), q[18] = K.model, q[19] = h;
    else h = q[19];
    let R;
    if (q[20] !== h) R = e7.createElement(T, null, L, ": ", h), q[20] = h, q[21] = R;
    else R = q[21];
    let u;
    if (q[22] !== K.permissionMode) u = K.permissionMode && e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Permission mode"), ": ", K.permissionMode), q[22] = K.permissionMode, q[23] = u;
    else u = q[23];
    let I;
    if (q[24] !== K.memory) I = K.memory && e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Memory"), ": ", LP1(K.memory)), q[24] = K.memory, q[25] = I;
    else I = q[25];
    let g;
    if (q[26] !== K.hooks) g = K.hooks && Object.keys(K.hooks).length > 0 && e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Hooks"), ": ", Object.keys(K.hooks).join(", ")), q[26] = K.hooks, q[27] = g;
    else g = q[27];
    let B;
    if (q[28] !== K.skills) B = K.skills && K.skills.length > 0 && e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Skills"), ":", " ", K.skills.length > 10 ? `${K.skills.length} skills` : K.skills.join(", ")), q[28] = K.skills, q[29] = B;
    else B = q[29];
    let b;
    if (q[30] !== K.agentType || q[31] !== H) b = H && e7.createElement(m, null, e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "Color"), ":", " ", e7.createElement(T, {
        backgroundColor: H,
        color: "inverseText"
    }, " ", K.agentType, " "))), q[30] = K.agentType, q[31] = H, q[32] = b;
    else b = q[32];
    let p;
    if (q[33] !== K) p = !Qj(K) && e7.createElement(e7.Fragment, null, e7.createElement(m, null, e7.createElement(T, null, e7.createElement(T, {
        bold: !0
    }, "System prompt"), ":")), e7.createElement(m, {
        marginLeft: 2,
        marginRight: 2
    }, e7.createElement(U_, null, K.getSystemPrompt()))), q[33] = K, q[34] = p;
    else p = q[34];
    let Q;
    if (q[35] !== D || q[36] !== V || q[37] !== R || q[38] !== u || q[39] !== I || q[40] !== g || q[41] !== B || q[42] !== b || q[43] !== p || q[44] !== W || q[45] !== G) Q = e7.createElement(D, {
        flexDirection: X,
        gap: P
    }, W, G, V, R, u, I, g, B, b, p), q[35] = D, q[36] = V, q[37] = R, q[38] = u, q[39] = I, q[40] = g, q[41] = B, q[42] = b, q[43] = p, q[44] = W, q[45] = G, q[46] = Q;
    else Q = q[46];
    return Q
}
// @from(Ln 423355, Col 4)
e7
// @from(Ln 423356, Col 4)
vXq = E(() => {
    e6();
    i6();
    b7();
    J0();
    cW6();
    ov();
    PN6();
    H0();
    A96();
    yI();
    _7();
    e7 = t(P6(), 1)
})
// @from(Ln 423371, Col 0)
function GN6(A) {
    let q = A6(2),
        {
            instructions: K
        } = A,
        Y = K === void 0 ? "Press ↑↓ to navigate · Enter to select · Esc to go back" : K,
        z = IK(),
        _ = z.pending ? `Press ${z.keyName} again to exit` : Y,
        w;
    if (q[0] !== _) w = Dr6.createElement(m, {
        marginLeft: 2
    }, Dr6.createElement(T, {
        dimColor: !0
    }, _)), q[0] = _, q[1] = w;
    else w = q[1];
    return w
}
// @from(Ln 423388, Col 4)
Dr6
// @from(Ln 423389, Col 4)
NXq = E(() => {
    e6();
    i6();
    PO();
    Dr6 = t(P6(), 1)
})
// @from(Ln 423396, Col 0)
function fN6(A, q, K) {
    return K0([...A, ...q], "name")
}
// @from(Ln 423399, Col 4)
sR1 = E(() => {
    dd();
    kp6()
})
// @from(Ln 423404, Col 0)
function tR1(A, q, K) {
    return VXq.useMemo(() => {
        let z = u66(K, q);
        return fN6(A, z, K.mode)
    }, [A, q, K, !1])
}
// @from(Ln 423410, Col 4)
VXq
// @from(Ln 423411, Col 4)
Il8 = E(() => {
    IX();
    sR1();
    VXq = t(P6(), 1)
})