
// @from(Ln 417662, Col 0)
function RMq(A) {
    let q = A6(101),
        {
            onExit: K,
            initialTab: Y
        } = A,
        z = Y === void 0 ? "allow" : Y,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    let [w, O] = Yi.useState(_), $ = M1(M1z), H = xA(), j = p_(), [J, M] = Yi.useState(), [D, X] = Yi.useState(), [P, W] = Yi.useState(null), [Z, G] = Yi.useState(null), [f, v] = Yi.useState(!1), [N, V] = Yi.useState(null), [L, h] = Yi.useState(!1), R;
    if (q[1] !== $) R = new Map, yv6($).forEach((d6) => {
        R.set(B6(d6), d6)
    }), q[1] = $, q[2] = R;
    else R = q[2];
    let u = R,
        I;
    if (q[3] !== $) I = new Map, KF($).forEach((d6) => {
        I.set(B6(d6), d6)
    }), q[3] = $, q[4] = I;
    else I = q[4];
    let g = I,
        B;
    if (q[5] !== $) B = new Map, Lv6($).forEach((d6) => {
        B.set(B6(d6), d6)
    }), q[5] = $, q[6] = B;
    else B = q[6];
    let b = B,
        p;
    if (q[7] !== u || q[8] !== b || q[9] !== g) p = (d6, S6) => {
        let g6 = S6 === void 0 ? "" : S6,
            D1 = (() => {
                switch (d6) {
                    case "allow":
                        return u;
                    case "deny":
                        return g;
                    case "ask":
                        return b;
                    case "workspace":
                        return new Map
                }
            })(),
            J1 = [];
        if (d6 !== "workspace" && !g6) J1.push({
            label: `Add a new rule${a6.ellipsis}`,
            value: "add-new-rule"
        });
        let E1 = Array.from(D1.keys()).sort((e8, n8) => {
                let H7 = D1.get(e8),
                    GA = D1.get(n8);
                if (H7 && GA) {
                    let h8 = L5(H7.ruleValue).toLowerCase(),
                        U8 = L5(GA.ruleValue).toLowerCase();
                    return h8.localeCompare(U8)
                }
                return 0
            }),
            K8 = g6.toLowerCase();
        for (let e8 of E1) {
            let n8 = D1.get(e8);
            if (n8) {
                let H7 = L5(n8.ruleValue);
                if (g6 && !H7.toLowerCase().includes(K8)) continue;
                J1.push({
                    label: H7,
                    value: e8
                })
            }
        }
        return {
            options: J1,
            rulesByKey: D1
        }
    }, q[7] = u, q[8] = b, q[9] = g, q[10] = p;
    else p = q[10];
    let Q = p,
        U = IK(),
        r = !J && !P && !Z && !f && !N,
        e = r && L,
        Y6;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) Y6 = () => {
        h(!1)
    }, q[11] = Y6;
    else Y6 = q[11];
    let H6;
    if (q[12] !== e) H6 = {
        isActive: e,
        onExit: Y6
    }, q[12] = e, q[13] = H6;
    else H6 = q[13];
    let {
        query: J6,
        setQuery: K6,
        cursorOffset: s
    } = Th(H6), X6;
    if (q[14] !== L || q[15] !== K6) X6 = (d6, S6) => {
        let g6 = !S6.ctrl && !S6.meta;
        if (!L) {
            if (d6 === "/" && g6) h(!0), K6("");
            else if (g6 && d6.length > 0 && d6 !== "j" && d6 !== "k" && d6 !== "m" && d6 !== "i" && !/^\s+$/.test(d6)) h(!0), K6(d6)
        }
    }, q[14] = L, q[15] = K6, q[16] = X6;
    else X6 = q[16];
    let z6;
    if (q[17] !== r) z6 = {
        isActive: r
    }, q[17] = r, q[18] = z6;
    else z6 = q[18];
    jA(X6, z6);
    let N6;
    if (q[19] !== Q) N6 = (d6, S6) => {
        let {
            rulesByKey: g6
        } = Q(S6);
        if (d6 === "add-new-rule") {
            W(S6);
            return
        } else {
            M(g6.get(d6));
            return
        }
    }, q[19] = Q, q[20] = N6;
    else N6 = q[20];
    let $6 = N6,
        n;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) n = () => {
        W(null)
    }, q[21] = n;
    else n = q[21];
    let o = n,
        a;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) a = (d6, S6) => {
        G({
            ruleValue: d6,
            ruleBehavior: S6
        }), W(null)
    }, q[22] = a;
    else a = q[22];
    let i = a,
        l;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) l = (d6, S6) => {
        G(null);
        for (let g6 of d6) O((D1) => [...D1, `Added ${g6.ruleBehavior} rule ${O1.bold(L5(g6.ruleValue))}`]);
        if (S6 && S6.length > 0)
            for (let g6 of S6) {
                let D1 = g6.shadowType === "deny" ? "blocked" : "shadowed";
                O((J1) => [...J1, O1.yellow(`${a6.warning} Warning: ${L5(g6.rule.ruleValue)} is ${D1}`), O1.dim(`  ${g6.reason}`), O1.dim(`  Fix: ${g6.fix}`)])
            }
    }, q[23] = l;
    else l = q[23];
    let q6 = l,
        w6;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) w6 = () => {
        G(null)
    }, q[24] = w6;
    else w6 = q[24];
    let O6 = w6,
        L6;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) L6 = () => v(!0), q[25] = L6;
    else L6 = q[25];
    let y6 = L6,
        G6;
    if (q[26] === Symbol.for("react.memo_cache_sentinel")) G6 = (d6) => V(d6), q[26] = G6;
    else G6 = q[26];
    let R6 = G6,
        T6;
    if (q[27] !== w || q[28] !== K) T6 = () => {
        if (w.length > 0) K(w.join(`
`));
        else K("Permissions dialog dismissed", {
            display: "system"
        })
    }, q[27] = w, q[28] = K, q[29] = T6;
    else T6 = q[29];
    let D6 = T6,
        Q6;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) Q6 = () => h(!0), q[30] = Q6;
    else Q6 = q[30];
    let k6 = Q6,
        Z6;
    if (q[31] !== Q || q[32] !== J || q[33] !== H || q[34] !== $) Z6 = () => {
        if (!J) return;
        let {
            options: d6
        } = Q(J.ruleBehavior), S6 = B6(J), g6 = d6.filter(J1z).map(j1z), D1 = g6.indexOf(S6), J1;
        if (D1 !== -1) {
            if (D1 < g6.length - 1) J1 = g6[D1 + 1];
            else if (D1 > 0) J1 = g6[D1 - 1]
        }
        X(J1), SMq({
            rule: J,
            initialContext: $,
            setToolPermissionContext(E1) {
                H((K8) => ({
                    ...K8,
                    toolPermissionContext: E1
                }))
            }
        }), O((E1) => [...E1, `Deleted ${J.ruleBehavior} rule ${O1.bold(L5(J.ruleValue))}`]), M(void 0)
    }, q[31] = Q, q[32] = J, q[33] = H, q[34] = $, q[35] = Z6;
    else Z6 = q[35];
    let u6 = Z6;
    if (J) {
        let d6;
        if (q[36] === Symbol.for("react.memo_cache_sentinel")) d6 = () => M(void 0), q[36] = d6;
        else d6 = q[36];
        let S6;
        if (q[37] !== u6 || q[38] !== J) S6 = uA.createElement($1z, {
            rule: J,
            onDelete: u6,
            onCancel: d6
        }), q[37] = u6, q[38] = J, q[39] = S6;
        else S6 = q[39];
        return S6
    }
    if (P && P !== "workspace") {
        let d6;
        if (q[40] !== P) d6 = uA.createElement(NMq, {
            onCancel: o,
            onSubmit: i,
            ruleBehavior: P
        }), q[40] = P, q[41] = d6;
        else d6 = q[41];
        return d6
    }
    if (Z) {
        let d6;
        if (q[42] !== Z.ruleValue) d6 = [Z.ruleValue], q[42] = Z.ruleValue, q[43] = d6;
        else d6 = q[43];
        let S6;
        if (q[44] !== H) S6 = (D1) => {
            H((J1) => ({
                ...J1,
                toolPermissionContext: D1
            }))
        }, q[44] = H, q[45] = S6;
        else S6 = q[45];
        let g6;
        if (q[46] !== d6 || q[47] !== S6 || q[48] !== $ || q[49] !== Z.ruleBehavior) g6 = uA.createElement(TMq, {
            onAddRules: q6,
            onCancel: O6,
            ruleValues: d6,
            ruleBehavior: Z.ruleBehavior,
            initialContext: $,
            setToolPermissionContext: S6
        }), q[46] = d6, q[47] = S6, q[48] = $, q[49] = Z.ruleBehavior, q[50] = g6;
        else g6 = q[50];
        return g6
    }
    if (f) {
        let d6;
        if (q[51] !== H || q[52] !== $) d6 = (D1, J1) => {
            let K8 = {
                    type: "addDirectories",
                    directories: [D1],
                    destination: J1 ? "localSettings" : "session"
                },
                e8 = Ez($, K8);
            if (H((n8) => ({
                    ...n8,
                    toolPermissionContext: e8
                })), J1) Ym(K8);
            O((n8) => [...n8, `Added directory ${O1.bold(D1)} to workspace${J1?" and saved to local settings":" for this session"}`]), v(!1)
        }, q[51] = H, q[52] = $, q[53] = d6;
        else d6 = q[53];
        let S6;
        if (q[54] === Symbol.for("react.memo_cache_sentinel")) S6 = () => v(!1), q[54] = S6;
        else S6 = q[54];
        let g6;
        if (q[55] !== d6 || q[56] !== $) g6 = uA.createElement(Ui6, {
            onAddDirectory: d6,
            onCancel: S6,
            permissionContext: $
        }), q[55] = d6, q[56] = $, q[57] = g6;
        else g6 = q[57];
        return g6
    }
    if (N) {
        let d6;
        if (q[58] !== N) d6 = () => {
            O((J1) => [...J1, `Removed directory ${O1.bold(N)} from workspace`]), V(null)
        }, q[58] = N, q[59] = d6;
        else d6 = q[59];
        let S6;
        if (q[60] === Symbol.for("react.memo_cache_sentinel")) S6 = () => V(null), q[60] = S6;
        else S6 = q[60];
        let g6;
        if (q[61] !== H) g6 = (J1) => {
            H((E1) => ({
                ...E1,
                toolPermissionContext: J1
            }))
        }, q[61] = H, q[62] = g6;
        else g6 = q[62];
        let D1;
        if (q[63] !== N || q[64] !== d6 || q[65] !== g6 || q[66] !== $) D1 = uA.createElement(yMq, {
            directoryPath: N,
            onRemove: d6,
            onCancel: S6,
            permissionContext: $,
            setPermissionContext: g6
        }), q[63] = N, q[64] = d6, q[65] = g6, q[66] = $, q[67] = D1;
        else D1 = q[67];
        return D1
    }
    let C6;
    if (q[68] !== Q || q[69] !== D6 || q[70] !== $6 || q[71] !== L || q[72] !== j || q[73] !== D || q[74] !== s || q[75] !== J6) C6 = {
        searchQuery: J6,
        isSearchMode: L,
        isFocused: j,
        onCancel: D6,
        lastFocusedRuleKey: D,
        onUpFromFirstItem: k6,
        cursorOffset: s,
        getRulesOptions: Q,
        handleToolSelect: $6
    }, q[68] = Q, q[69] = D6, q[70] = $6, q[71] = L, q[72] = j, q[73] = D, q[74] = s, q[75] = J6, q[76] = C6;
    else C6 = q[76];
    let o6 = C6,
        V6 = !!J || !!P || !!Z || f || !!N,
        b6;
    if (q[77] !== o6) b6 = uA.createElement(Hw, {
        id: "allow",
        title: "Allow"
    }, uA.createElement(Hl8, {
        tab: "allow",
        ...o6
    })), q[77] = o6, q[78] = b6;
    else b6 = q[78];
    let E6;
    if (q[79] !== o6) E6 = uA.createElement(Hw, {
        id: "ask",
        title: "Ask"
    }, uA.createElement(Hl8, {
        tab: "ask",
        ...o6
    })), q[79] = o6, q[80] = E6;
    else E6 = q[80];
    let U6;
    if (q[81] !== o6) U6 = uA.createElement(Hw, {
        id: "deny",
        title: "Deny"
    }, uA.createElement(Hl8, {
        tab: "deny",
        ...o6
    })), q[81] = o6, q[82] = U6;
    else U6 = q[82];
    let c6;
    if (q[83] === Symbol.for("react.memo_cache_sentinel")) c6 = uA.createElement(T, null, "Claude Code can read files in the workspace, and make edits when auto-accept edits is on."), q[83] = c6;
    else c6 = q[83];
    let K1;
    if (q[84] !== K || q[85] !== $) K1 = uA.createElement(Hw, {
        id: "workspace",
        title: "Workspace"
    }, uA.createElement(m, {
        flexDirection: "column"
    }, c6, uA.createElement(kMq, {
        onExit: K,
        toolPermissionContext: $,
        onRequestAddDirectory: y6,
        onRequestRemoveDirectory: R6
    }))), q[84] = K, q[85] = $, q[86] = K1;
    else K1 = q[86];
    let j6;
    if (q[87] !== z || q[88] !== V6 || q[89] !== L || q[90] !== b6 || q[91] !== E6 || q[92] !== U6 || q[93] !== K1) j6 = uA.createElement(Gh, {
        title: "Permissions:",
        color: "permission",
        defaultTab: z,
        hidden: V6,
        disableNavigation: L
    }, b6, E6, U6, K1), q[87] = z, q[88] = V6, q[89] = L, q[90] = b6, q[91] = E6, q[92] = U6, q[93] = K1, q[94] = j6;
    else j6 = q[94];
    let W6;
    if (q[95] !== U.keyName || q[96] !== U.pending) W6 = uA.createElement(m, {
        marginTop: 1,
        paddingLeft: 1
    }, uA.createElement(T, {
        dimColor: !0
    }, U.pending ? uA.createElement(uA.Fragment, null, "Press ", U.keyName, " again to exit") : uA.createElement(uA.Fragment, null, "Press ↑↓ to navigate · Enter to select · Type to search · Esc to cancel"))), q[95] = U.keyName, q[96] = U.pending, q[97] = W6;
    else W6 = q[97];
    let n6;
    if (q[98] !== j6 || q[99] !== W6) n6 = uA.createElement(S3, {
        color: "permission"
    }, j6, W6), q[98] = j6, q[99] = W6, q[100] = n6;
    else n6 = q[100];
    return n6
}
// @from(Ln 418051, Col 0)
function j1z(A) {
    return A.value
}
// @from(Ln 418055, Col 0)
function J1z(A) {
    return A.value !== "add-new-rule"
}
// @from(Ln 418059, Col 0)
function M1z(A) {
    return A.toolPermissionContext
}
// @from(Ln 418062, Col 4)
uA
// @from(Ln 418062, Col 8)
Yi
// @from(Ln 418063, Col 4)
hMq = E(() => {
    e6();
    i6();
    _7();
    v3();
    PO();
    Bj();
    SP();
    b7();
    Ol8();
    vMq();
    VMq();
    aK();
    EMq();
    ap8();
    LMq();
    F$();
    NA();
    FJ();
    oz6();
    H16();
    j16();
    g1();
    uA = t(P6(), 1), Yi = t(P6(), 1)
})
// @from(Ln 418088, Col 4)
CMq = {}
// @from(Ln 418092, Col 4)
jl8
// @from(Ln 418092, Col 9)
D1z = async (A) => {
    return jl8.createElement(RMq, {
        onExit: A
    })
}
// @from(Ln 418097, Col 4)
IMq = E(() => {
    hMq();
    jl8 = t(P6(), 1)
})
// @from(Ln 418101, Col 4)
X1z
// @from(Ln 418101, Col 9)
bMq
// @from(Ln 418102, Col 4)
xMq = E(() => {
    X1z = {
        type: "local-jsx",
        name: "permissions",
        aliases: ["allowed-tools"],
        description: "Manage allow & deny tool permission rules",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (IMq(), CMq)),
        userFacingName() {
            return "permissions"
        }
    }, bMq = X1z
})
// @from(Ln 418116, Col 4)
uMq = {}
// @from(Ln 418121, Col 0)
function P1z(A) {
    let q = A6(11),
        {
            planContent: K,
            planPath: Y,
            editorName: z
        } = A,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = OJ.createElement(T, {
        bold: !0
    }, "Current Plan"), q[0] = _;
    else _ = q[0];
    let w;
    if (q[1] !== Y) w = OJ.createElement(T, {
        dimColor: !0
    }, Y), q[1] = Y, q[2] = w;
    else w = q[2];
    let O;
    if (q[3] !== K) O = OJ.createElement(m, {
        marginTop: 1
    }, OJ.createElement(T, null, K)), q[3] = K, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] !== z) $ = z && OJ.createElement(m, {
        marginTop: 1
    }, OJ.createElement(T, {
        dimColor: !0
    }, '"/plan open"'), OJ.createElement(T, {
        dimColor: !0
    }, " to edit this plan in "), OJ.createElement(T, {
        bold: !0,
        dimColor: !0
    }, z)), q[5] = z, q[6] = $;
    else $ = q[6];
    let H;
    if (q[7] !== w || q[8] !== O || q[9] !== $) H = OJ.createElement(m, {
        flexDirection: "column"
    }, _, w, O, $), q[7] = w, q[8] = O, q[9] = $, q[10] = H;
    else H = q[10];
    return H
}
// @from(Ln 418162, Col 0)
async function W1z(A, q, K) {
    let {
        getAppState: Y,
        setAppState: z
    } = q, w = Y().toolPermissionContext.mode;
    if (w !== "plan") {
        Dp(w, "plan"), z((P) => ({
            ...P,
            toolPermissionContext: Ez(LT6(P.toolPermissionContext), {
                type: "setMode",
                mode: "plan",
                destination: "session"
            })
        }));
        let X = K.trim();
        if (X && X !== "open") A("Enabled plan mode", {
            shouldQuery: !0
        });
        else A("Enabled plan mode");
        return null
    }
    let O = sJ(),
        $ = Fj();
    if (!O) return A("Already in plan mode. No plan written yet."), null;
    if (K.trim().split(/\s+/)[0] === "open") {
        let X = await NE($);
        if (X.error) A(`Failed to open plan in editor: ${X.error}`);
        else A(`Opened plan in editor: ${$}`);
        return null
    }
    let j = vh(),
        J = j ? Y$(j) : void 0,
        D = await Fy1(OJ.createElement(P1z, {
            planContent: O,
            planPath: $,
            editorName: J
        }));
    return A(D), null
}
// @from(Ln 418201, Col 4)
OJ
// @from(Ln 418202, Col 4)
mMq = E(() => {
    e6();
    i6();
    rH();
    ll();
    VE();
    Sw();
    py1();
    F$();
    rJ();
    T1();
    OJ = t(P6(), 1)
})
// @from(Ln 418215, Col 4)
Z1z
// @from(Ln 418215, Col 9)
Jl8
// @from(Ln 418216, Col 4)
BMq = E(() => {
    Z1z = {
        type: "local-jsx",
        name: "plan",
        description: "Enable plan mode or view the current session plan",
        argumentHint: "[open|<description>]",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (mMq(), uMq)),
        userFacingName() {
            return "plan"
        }
    }, Jl8 = Z1z
})
// @from(Ln 418231, Col 0)
function XN6() {
    return w8("tengu_immediate_model_command", !1)
}
// @from(Ln 418234, Col 4)
mR1 = E(() => {
    HA()
})
// @from(Ln 418238, Col 0)
function gMq(A) {
    let q = A6(2),
        {
            cooldown: K
        } = A;
    if (K) {
        let z;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = Or6.createElement(T, {
            color: "promptBorder",
            dimColor: !0
        }, De), q[0] = z;
        else z = q[0];
        return z
    }
    let Y;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = Or6.createElement(T, {
        color: "fastMode"
    }, De), q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 418260, Col 0)
function V_6(A = !0, q = !1) {
    if (!A) return De;
    let K = km(X1().theme);
    if (q) return O1.dim(kA("promptBorder", K)(De));
    return kA("fastMode", K)(De)
}
// @from(Ln 418266, Col 4)
Or6
// @from(Ln 418267, Col 4)
Ml8 = E(() => {
    e6();
    aK();
    i6();
    bK6();
    k8();
    EX6();
    qw();
    Or6 = t(P6(), 1)
})
// @from(Ln 418277, Col 4)
pMq = {}
// @from(Ln 418283, Col 0)
function Dl8(A, q) {
    if (aq6(), TA("userSettings", {
            fastMode: A ? !0 : void 0
        }), A) q((K) => {
        let Y = !FH(K.mainLoopModel);
        return {
            ...K,
            ...Y ? {
                mainLoopModel: Bx6(),
                mainLoopModelForSession: null
            } : {},
            fastMode: !0
        }
    });
    else q((K) => ({
        ...K,
        fastMode: !1
    }))
}
// @from(Ln 418303, Col 0)
function BR1(A) {
    let q = A6(30),
        {
            onDone: K,
            unavailableReason: Y
        } = A,
        z = M1(v1z),
        _ = M1(T1z),
        w = xA(),
        [O, $] = FMq.useState(_ ?? !1),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = TO8(), q[0] = H;
    else H = q[0];
    let j = H,
        J = j.status === "cooldown",
        M = Y !== null,
        D;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) D = zR(N06(!0)), q[1] = D;
    else D = q[1];
    let X = D,
        P;
    if (q[2] !== O || q[3] !== M || q[4] !== z || q[5] !== K || q[6] !== w) P = function() {
        if (M) return;
        if (Dl8(O, w), d("tengu_fast_mode_toggled", {
                enabled: O,
                source: "picker"
            }), O) {
            let b = V_6(O),
                p = !FH(z) ? ` · model set to ${Ok}` : "";
            K(`${b} Fast mode ON${p} · ${X}`)
        } else w(f1z), K("Fast mode OFF")
    }, q[2] = O, q[3] = M, q[4] = z, q[5] = K, q[6] = w, q[7] = P;
    else P = q[7];
    let W = P,
        Z;
    if (q[8] !== _ || q[9] !== M || q[10] !== K || q[11] !== w) Z = function() {
        if (M) {
            if (_) Dl8(!1, w);
            K("Fast mode OFF", {
                display: "system"
            });
            return
        }
        let b = _ ? `${V_6()} Kept Fast mode ON` : "Kept Fast mode OFF";
        K(b, {
            display: "system"
        })
    }, q[8] = _, q[9] = M, q[10] = K, q[11] = w, q[12] = Z;
    else Z = q[12];
    let G = Z,
        f;
    if (q[13] !== M) f = function() {
        if (M) return;
        $(G1z)
    }, q[13] = M, q[14] = f;
    else f = q[14];
    let v = f,
        N;
    if (q[15] !== W || q[16] !== v) N = {
        "confirm:yes": W,
        "confirm:nextField": v,
        "confirm:next": v,
        "confirm:previous": v,
        "confirm:cycleMode": v,
        "confirm:toggle": v
    }, q[15] = W, q[16] = v, q[17] = N;
    else N = q[17];
    let V;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) V = {
        context: "Confirmation"
    }, q[18] = V;
    else V = q[18];
    tA(N, V);
    let L;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) L = H3.createElement(T, null, H3.createElement(gMq, {
        cooldown: J
    }), " Fast mode (research preview)"), q[19] = L;
    else L = q[19];
    let h = L,
        R;
    if (q[20] !== M) R = (B) => B.pending ? H3.createElement(T, null, "Press ", B.keyName, " again to exit") : M ? H3.createElement(T, null, "Esc to cancel") : H3.createElement(T, null, "Tab to toggle · Enter to confirm · Esc to cancel"), q[20] = M, q[21] = R;
    else R = q[21];
    let u;
    if (q[22] !== O || q[23] !== Y) u = Y ? H3.createElement(m, {
        marginLeft: 2
    }, H3.createElement(T, {
        color: "error"
    }, Y)) : H3.createElement(H3.Fragment, null, H3.createElement(m, {
        flexDirection: "column",
        gap: 0,
        marginLeft: 2
    }, H3.createElement(m, {
        flexDirection: "row",
        gap: 2
    }, H3.createElement(T, {
        bold: !0
    }, "Fast mode"), H3.createElement(T, {
        color: O ? "fastMode" : void 0,
        bold: O
    }, O ? "ON " : "OFF"), H3.createElement(T, {
        dimColor: !0
    }, X))), J && j.status === "cooldown" && H3.createElement(m, {
        marginLeft: 2
    }, H3.createElement(T, {
        color: "warning"
    }, j.reason === "overloaded" ? "Fast mode overloaded and is temporarily unavailable" : "You've hit your fast limit", " · resets in ", UK(j.resetAt - Date.now(), {
        hideTrailingZeros: !0
    })))), q[22] = O, q[23] = Y, q[24] = u;
    else u = q[24];
    let I;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) I = H3.createElement(T, {
        dimColor: !0
    }, "Learn more:", " ", H3.createElement(y7, {
        url: "https://code.claude.com/docs/en/fast-mode"
    }, "https://code.claude.com/docs/en/fast-mode")), q[25] = I;
    else I = q[25];
    let g;
    if (q[26] !== G || q[27] !== u || q[28] !== R) g = H3.createElement(m8, {
        title: h,
        subtitle: `High-speed mode for ${Ok}. Billed as extra usage at a premium rate. Separate rate limits apply.`,
        onCancel: G,
        color: "fastMode",
        inputGuide: R
    }, u, I), q[26] = G, q[27] = u, q[28] = R, q[29] = g;
    else g = q[29];
    return g
}
// @from(Ln 418431, Col 0)
function G1z(A) {
    return !A
}
// @from(Ln 418435, Col 0)
function f1z(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 418442, Col 0)
function T1z(A) {
    return A.fastMode
}
// @from(Ln 418446, Col 0)
function v1z(A) {
    return A.mainLoopModel
}
// @from(Ln 418449, Col 0)
async function N1z(A, q, K) {
    let Y = ra();
    if (Y) return `Fast mode unavailable: ${Y}`;
    let {
        mainLoopModel: z
    } = q();
    if (Dl8(A, K), d("tengu_fast_mode_toggled", {
            enabled: A,
            source: "shortcut"
        }), A) {
        let _ = V_6(!0),
            w = !FH(z) ? ` · model set to ${Ok}` : "",
            O = zR(N06(!0));
        return `${_} Fast mode ON${w} · ${O}`
    } else return "Fast mode OFF"
}
// @from(Ln 418465, Col 0)
async function V1z(A, q, K) {
    if (!Dq()) return null;
    await n21();
    let Y = K?.trim().toLowerCase();
    if (Y === "on" || Y === "off") {
        let _ = await N1z(Y === "on", q.getAppState, q.setAppState);
        return A(_), null
    }
    let z = ra();
    return d("tengu_fast_mode_picker_shown", {
        unavailable_reason: z ?? ""
    }), H3.createElement(BR1, {
        onDone: A,
        unavailableReason: z
    })
}
// @from(Ln 418481, Col 4)
H3
// @from(Ln 418481, Col 8)
FMq
// @from(Ln 418482, Col 4)
Xl8 = E(() => {
    e6();
    i6();
    NA();
    FW();
    M4();
    V1();
    Ml8();
    wq();
    i8();
    _7();
    Mt();
    H3 = t(P6(), 1), FMq = t(P6(), 1)
})
// @from(Ln 418496, Col 4)
k1z
// @from(Ln 418496, Col 9)
QMq
// @from(Ln 418497, Col 4)
UMq = E(() => {
    FW();
    mR1();
    k1z = {
        type: "local-jsx",
        name: "fast",
        get description() {
            return `Toggle fast mode (${Ok} only)`
        },
        isEnabled: () => Dq(),
        get isHidden() {
            return !Dq()
        },
        argumentHint: "[on|off]",
        userFacingName: () => "fast",
        get immediate() {
            return XN6()
        },
        load: () => Promise.resolve().then(() => (Xl8(), pMq))
    }, QMq = k1z
})
// @from(Ln 418519, Col 0)
function dMq({
    onDone: A
}) {
    let [q, K] = fF.useState(!0), [Y, z] = fF.useState([]), [_, w] = fF.useState(!1), [O, $] = fF.useState(null), [H, j] = fF.useState(void 0), J = IK(() => A("Guest passes dialog dismissed", {
        display: "system"
    })), M = fF.useCallback(() => {
        A("Guest passes dialog dismissed", {
            display: "system"
        })
    }, [A]);
    if (D8("confirm:no", M, {
            context: "Confirmation"
        }), jA((W, Z) => {
            if (Z.return && O)(async () => {
                if (await ZZ(O)) d("tengu_guest_passes_link_copied", {}), A("Referral link copied to clipboard!");
                else A(C96(), {
                    display: "system"
                })
            })()
        }), fF.useEffect(() => {
            async function W() {
                try {
                    let Z = await Nc8();
                    if (!Z || !Z.eligible) {
                        w(!1), K(!1);
                        return
                    }
                    if (w(!0), Z.referral_code_details?.referral_link) $(Z.referral_code_details.referral_link);
                    j(Z.referrer_reward);
                    let G = Z.referral_code_details?.campaign ?? "claude_code_guest_pass",
                        f;
                    try {
                        f = await jjq(G)
                    } catch (L) {
                        _6(L), w(!1), K(!1);
                        return
                    }
                    let v = f.redemptions || [],
                        N = f.limit || 3,
                        V = [];
                    for (let L = 0; L < N; L++) {
                        let h = v[L];
                        V.push({
                            passNumber: L + 1,
                            isAvailable: !h
                        })
                    }
                    z(V), K(!1)
                } catch (Z) {
                    _6(Z), w(!1), K(!1)
                }
            }
            W()
        }, []), q) return L7.createElement(S3, null, L7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, L7.createElement(T, {
        dimColor: !0
    }, "Loading guest pass information…"), L7.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? L7.createElement(L7.Fragment, null, "Press ", J.keyName, " again to exit") : L7.createElement(L7.Fragment, null, "Esc to cancel"))));
    if (!_) return L7.createElement(S3, null, L7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, L7.createElement(T, null, "Guest passes are not currently available."), L7.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? L7.createElement(L7.Fragment, null, "Press ", J.keyName, " again to exit") : L7.createElement(L7.Fragment, null, "Esc to cancel"))));
    let D = Y.filter((W) => W.isAvailable).length,
        X = [...Y].sort((W, Z) => +Z.isAvailable - +W.isAvailable),
        P = (W) => {
            if (!W.isAvailable) return L7.createElement(m, {
                key: W.passNumber,
                flexDirection: "column",
                marginRight: 1
            }, L7.createElement(T, {
                dimColor: !0
            }, "┌─────────╱"), L7.createElement(T, {
                dimColor: !0
            }, " ) CC ✻ ┊╱"), L7.createElement(T, {
                dimColor: !0
            }, "└───────╱"));
            return L7.createElement(m, {
                key: W.passNumber,
                flexDirection: "column",
                marginRight: 1
            }, L7.createElement(T, null, "┌──────────┐"), L7.createElement(T, null, " ) CC ", L7.createElement(T, {
                color: "claude"
            }, "✻"), " ┊ ( "), L7.createElement(T, null, "└──────────┘"))
        };
    return L7.createElement(S3, null, L7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, L7.createElement(T, {
        color: "permission"
    }, "Guest passes · ", D, " left"), L7.createElement(m, {
        flexDirection: "row",
        marginLeft: 2
    }, X.slice(0, 3).map((W) => P(W))), O && L7.createElement(m, {
        marginLeft: 2
    }, L7.createElement(T, null, O)), L7.createElement(m, {
        flexDirection: "column",
        marginLeft: 2
    }, L7.createElement(T, {
        dimColor: !0
    }, H ? `Share a free week of Claude Code with friends. If they love it and subscribe, you'll get ${I16(H)} of extra usage to keep building. ` : "Share a free week of Claude Code with friends. ", L7.createElement(y7, {
        url: H ? "https://support.claude.com/en/articles/13456702-claude-code-guest-passes" : "https://support.claude.com/en/articles/12875061-claude-code-guest-passes"
    }, "Terms apply."))), L7.createElement(m, null, L7.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? L7.createElement(L7.Fragment, null, "Press ", J.keyName, " again to exit") : L7.createElement(L7.Fragment, null, "Enter to copy link · Esc to cancel")))))
}
// @from(Ln 418632, Col 4)
L7
// @from(Ln 418632, Col 8)
fF
// @from(Ln 418633, Col 4)
cMq = E(() => {
    i6();
    _7();
    FJ();
    x16();
    k1();
    V1();
    vc();
    PO();
    L7 = t(P6(), 1), fF = t(P6(), 1)
})
// @from(Ln 418644, Col 4)
lMq = {}
// @from(Ln 418648, Col 0)
async function E1z(A) {
    let K = !X1().hasVisitedPasses;
    if (K) {
        let Y = jR1();
        d1((z) => ({
            ...z,
            hasVisitedPasses: !0,
            passesLastSeenRemaining: Y ?? z.passesLastSeenRemaining
        }))
    }
    return d("tengu_guest_passes_visited", {
        is_first_visit: K
    }), Pl8.createElement(dMq, {
        onDone: A
    })
}
// @from(Ln 418664, Col 4)
Pl8
// @from(Ln 418665, Col 4)
iMq = E(() => {
    cMq();
    k8();
    V1();
    x16();
    Pl8 = t(P6(), 1)
})
// @from(Ln 418672, Col 4)
nMq
// @from(Ln 418673, Col 4)
rMq = E(() => {
    x16();
    nMq = {
        type: "local-jsx",
        name: "passes",
        get description() {
            if (b16()) return "Share a free week of Claude Code with friends and earn extra usage";
            return "Share a free week of Claude Code with friends"
        },
        isEnabled: () => !0,
        get isHidden() {
            let {
                eligible: A,
                hasCache: q
            } = HN6();
            return !A || !q
        },
        load: () => Promise.resolve().then(() => (iMq(), lMq)),
        userFacingName() {
            return "passes"
        }
    }
})
// @from(Ln 418696, Col 4)
oMq = {}
// @from(Ln 418702, Col 0)
function L1z() {
    let A = A6(9),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = t7.default.createElement(T, null, "An update to our Consumer Terms and Privacy Policy will take effect on", " ", t7.default.createElement(T, {
        bold: !0
    }, "October 8, 2025"), ". You can accept the updated terms today."), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = t7.default.createElement(T, null, "What's changing?"), A[1] = K;
    else K = A[1];
    let Y, z;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) Y = t7.default.createElement(T, null, "• "), z = t7.default.createElement(T, {
        bold: !0
    }, "You can help improve Claude "), A[2] = Y, A[3] = z;
    else Y = A[2], z = A[3];
    let _;
    if (A[4] === Symbol.for("react.memo_cache_sentinel")) _ = t7.default.createElement(m, {
        paddingLeft: 1
    }, t7.default.createElement(T, null, Y, z, t7.default.createElement(T, null, "— Allow the use of your chats and coding sessions to train and improve Anthropic AI models. Change anytime in your Privacy Settings (", t7.default.createElement(y7, {
        url: "https://claude.ai/settings/data-privacy-controls"
    }), ")."))), A[4] = _;
    else _ = A[4];
    let w;
    if (A[5] === Symbol.for("react.memo_cache_sentinel")) w = t7.default.createElement(m, {
        flexDirection: "column"
    }, K, _, t7.default.createElement(m, {
        paddingLeft: 1
    }, t7.default.createElement(T, null, t7.default.createElement(T, null, "• "), t7.default.createElement(T, {
        bold: !0
    }, "Updates to data retention "), t7.default.createElement(T, null, "— To help us improve our AI models and safety protections, we're extending data retention to 5 years.")))), A[5] = w;
    else w = A[5];
    let O;
    if (A[6] === Symbol.for("react.memo_cache_sentinel")) O = t7.default.createElement(y7, {
        url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
    }), A[6] = O;
    else O = A[6];
    let $;
    if (A[7] === Symbol.for("react.memo_cache_sentinel")) $ = t7.default.createElement(y7, {
        url: "https://anthropic.com/legal/terms"
    }), A[7] = $;
    else $ = A[7];
    let H;
    if (A[8] === Symbol.for("react.memo_cache_sentinel")) H = t7.default.createElement(t7.default.Fragment, null, q, w, t7.default.createElement(T, null, "Learn more (", O, ") or read the updated Consumer Terms (", $, ") and Privacy Policy (", t7.default.createElement(y7, {
        url: "https://anthropic.com/legal/privacy"
    }), ")")), A[8] = H;
    else H = A[8];
    return H
}
// @from(Ln 418751, Col 0)
function R1z() {
    let A = A6(7),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = t7.default.createElement(T, null, "We've updated our Consumer Terms and Privacy Policy."), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = t7.default.createElement(T, null, "What's changing?"), A[1] = K;
    else K = A[1];
    let Y;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) Y = t7.default.createElement(m, {
        flexDirection: "column"
    }, t7.default.createElement(T, {
        bold: !0
    }, "Help improve Claude"), t7.default.createElement(T, null, "Allow the use of your chats and coding sessions to train and improve Anthropic AI models. You can change this anytime in Privacy Settings"), t7.default.createElement(y7, {
        url: "https://claude.ai/settings/data-privacy-controls"
    })), A[2] = Y;
    else Y = A[2];
    let z;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) z = t7.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, K, Y, t7.default.createElement(m, {
        flexDirection: "column"
    }, t7.default.createElement(T, {
        bold: !0
    }, "How this affects data retention"), t7.default.createElement(T, null, "Turning ON the improve Claude setting extends data retention from 30 days to 5 years. Turning it OFF keeps the default 30-day data retention. Delete data anytime."))), A[3] = z;
    else z = A[3];
    let _;
    if (A[4] === Symbol.for("react.memo_cache_sentinel")) _ = t7.default.createElement(y7, {
        url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
    }), A[4] = _;
    else _ = A[4];
    let w;
    if (A[5] === Symbol.for("react.memo_cache_sentinel")) w = t7.default.createElement(y7, {
        url: "https://anthropic.com/legal/terms"
    }), A[5] = w;
    else w = A[5];
    let O;
    if (A[6] === Symbol.for("react.memo_cache_sentinel")) O = t7.default.createElement(t7.default.Fragment, null, q, z, t7.default.createElement(T, null, "Learn more (", _, ") or read the updated Consumer Terms (", w, ") and Privacy Policy (", t7.default.createElement(y7, {
        url: "https://anthropic.com/legal/privacy"
    }), ")")), A[6] = O;
    else O = A[6];
    return O
}
// @from(Ln 418796, Col 0)
function Wl8(A) {
    let q = A6(34),
        {
            showIfAlreadyViewed: K,
            location: Y,
            onDone: z
        } = A,
        [_, w] = t7.useState(null),
        [O, $] = t7.useState(null),
        H, j;
    if (q[0] !== Y || q[1] !== z || q[2] !== K) H = () => {
        (async function() {
            let [g, B] = await Promise.all([eI(), Ie()]), b = B.success ? B.data : null;
            $(b);
            let p = ZR8(g, B, K);
            if (w(p), !p) {
                z("skip_rendering");
                return
            }
            WR8(), d("tengu_grove_policy_viewed", {
                location: Y,
                dismissable: b?.notice_is_grace_period
            })
        })()
    }, j = [K, Y, z], q[0] = Y, q[1] = z, q[2] = K, q[3] = H, q[4] = j;
    else H = q[3], j = q[4];
    if (t7.useEffect(H, j), _ === null) return null;
    if (!_) return null;
    let J;
    if (q[5] !== O?.notice_is_grace_period || q[6] !== z) J = async function(I) {
        A: switch (I) {
            case "accept_opt_in": {
                await xG1(!0), d("tengu_grove_policy_submitted", {
                    state: !0,
                    dismissable: O?.notice_is_grace_period
                });
                break A
            }
            case "accept_opt_out": {
                await xG1(!1), d("tengu_grove_policy_submitted", {
                    state: !1,
                    dismissable: O?.notice_is_grace_period
                });
                break A
            }
            case "defer": {
                d("tengu_grove_policy_dismissed", {
                    state: !0
                });
                break A
            }
            case "escape":
                d("tengu_grove_policy_escaped", {})
        }
        z(I)
    }, q[5] = O?.notice_is_grace_period, q[6] = z, q[7] = J;
    else J = q[7];
    let M = J,
        D;
    if (q[8] !== O?.domain_excluded) D = O?.domain_excluded ? [{
        label: "Accept terms • Help improve Claude: OFF (for emails with your domain)",
        value: "accept_opt_out"
    }] : [{
        label: "Accept terms • Help improve Claude: ON",
        value: "accept_opt_in"
    }, {
        label: "Accept terms • Help improve Claude: OFF",
        value: "accept_opt_out"
    }], q[8] = O?.domain_excluded, q[9] = D;
    else D = q[9];
    let X = D,
        P;
    if (q[10] !== O?.notice_is_grace_period || q[11] !== M) P = function() {
        if (O?.notice_is_grace_period) {
            M("defer");
            return
        }
        M("escape")
    }, q[10] = O?.notice_is_grace_period, q[11] = M, q[12] = P;
    else P = q[12];
    let W = P,
        Z;
    if (q[13] !== O?.notice_is_grace_period) Z = t7.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        flexGrow: 1
    }, O?.notice_is_grace_period ? t7.default.createElement(L1z, null) : t7.default.createElement(R1z, null)), q[13] = O?.notice_is_grace_period, q[14] = Z;
    else Z = q[14];
    let G;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) G = t7.default.createElement(m, {
        flexShrink: 0
    }, t7.default.createElement(T, {
        color: "professionalBlue"
    }, y1z)), q[15] = G;
    else G = q[15];
    let f;
    if (q[16] !== Z) f = t7.default.createElement(m, {
        flexDirection: "row"
    }, Z, G), q[16] = Z, q[17] = f;
    else f = q[17];
    let v;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) v = t7.default.createElement(m, {
        flexDirection: "column"
    }, t7.default.createElement(T, {
        bold: !0
    }, "Please select how you'd like to continue"), t7.default.createElement(T, null, "Your choice takes effect immediately upon confirmation.")), q[18] = v;
    else v = q[18];
    let N;
    if (q[19] !== O?.notice_is_grace_period) N = O?.notice_is_grace_period ? [{
        label: "Not now",
        value: "defer"
    }] : [], q[19] = O?.notice_is_grace_period, q[20] = N;
    else N = q[20];
    let V;
    if (q[21] !== X || q[22] !== N) V = [...X, ...N], q[21] = X, q[22] = N, q[23] = V;
    else V = q[23];
    let L;
    if (q[24] !== M) L = (u) => M(u), q[24] = M, q[25] = L;
    else L = q[25];
    let h;
    if (q[26] !== W || q[27] !== V || q[28] !== L) h = t7.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, v, t7.default.createElement(T8, {
        options: V,
        onChange: L,
        onCancel: W
    })), q[26] = W, q[27] = V, q[28] = L, q[29] = h;
    else h = q[29];
    let R;
    if (q[30] !== W || q[31] !== h || q[32] !== f) R = t7.default.createElement(m8, {
        title: "Updates to Consumer Terms and Policies",
        color: "professionalBlue",
        onCancel: W,
        inputGuide: h1z
    }, f, h), q[30] = W, q[31] = h, q[32] = f, q[33] = R;
    else R = q[33];
    return R
}
// @from(Ln 418936, Col 0)
function h1z(A) {
    return A.pending ? t7.default.createElement(T, null, "Press ", A.keyName, " again to exit") : t7.default.createElement(C8, null, t7.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), t7.default.createElement(a1, {
        shortcut: "Esc",
        action: "cancel"
    }))
}
// @from(Ln 418946, Col 0)
function Zl8(A) {
    let q = A6(17),
        {
            settings: K,
            domainExcluded: Y,
            onDone: z
        } = A,
        [_, w] = t7.useState(K.grove_enabled),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = [], q[0] = O;
    else O = q[0];
    t7.default.useEffect(S1z, O);
    let $;
    if (q[1] !== Y || q[2] !== _) $ = async (W, Z) => {
        if (!Y && (Z.tab || Z.return || W === " ")) {
            let G = !_;
            w(G), await xG1(G)
        }
    }, q[1] = Y, q[2] = _, q[3] = $;
    else $ = q[3];
    jA($);
    let H;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) H = t7.default.createElement(T, {
        color: "error"
    }, "false"), q[4] = H;
    else H = q[4];
    let j = H;
    if (Y) {
        let W;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = t7.default.createElement(T, {
            color: "error"
        }, "false (for emails with your domain)"), q[5] = W;
        else W = q[5];
        j = W
    } else if (_) {
        let W;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = t7.default.createElement(T, {
            color: "success"
        }, "true"), q[6] = W;
        else W = q[6];
        j = W
    }
    let J;
    if (q[7] !== Y) J = (W) => W.pending ? t7.default.createElement(T, null, "Press ", W.keyName, " again to exit") : Y ? t7.default.createElement(a1, {
        shortcut: "Esc",
        action: "cancel"
    }) : t7.default.createElement(C8, null, t7.default.createElement(a1, {
        shortcut: "Enter/Tab/Space",
        action: "toggle"
    }), t7.default.createElement(a1, {
        shortcut: "Esc",
        action: "cancel"
    })), q[7] = Y, q[8] = J;
    else J = q[8];
    let M;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) M = t7.default.createElement(T, null, "Review and manage your privacy settings at", " ", t7.default.createElement(y7, {
        url: "https://claude.ai/settings/data-privacy-controls"
    })), q[9] = M;
    else M = q[9];
    let D;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) D = t7.default.createElement(m, {
        width: 44
    }, t7.default.createElement(T, {
        bold: !0
    }, "Help improve Claude")), q[10] = D;
    else D = q[10];
    let X;
    if (q[11] !== j) X = t7.default.createElement(m, null, D, t7.default.createElement(m, null, j)), q[11] = j, q[12] = X;
    else X = q[12];
    let P;
    if (q[13] !== z || q[14] !== J || q[15] !== X) P = t7.default.createElement(m8, {
        title: "Data Privacy",
        color: "professionalBlue",
        onCancel: z,
        inputGuide: J
    }, M, X), q[13] = z, q[14] = J, q[15] = X, q[16] = P;
    else P = q[16];
    return P
}
// @from(Ln 419026, Col 0)
function S1z() {
    d("tengu_grove_privacy_settings_viewed", {})
}
// @from(Ln 419029, Col 4)
t7
// @from(Ln 419029, Col 8)
y1z = ` _____________
 |          \\  \\
 | NEW TERMS \\__\\
 |              |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |              |
 |______________|`
// @from(Ln 419040, Col 4)
Gl8 = E(() => {
    e6();
    i6();
    o9();
    V1();
    KG6();
    i6();
    wq();
    Lq();
    Xq();
    t7 = t(P6(), 1)
})
// @from(Ln 419052, Col 4)
sMq = {}
// @from(Ln 419056, Col 0)
async function C1z(A) {
    if (!await qG6()) return A(aMq), null;
    let [K, Y] = await Promise.all([eI(), Ie()]);
    if (!K.success) return A(aMq), null;
    let z = K.data,
        _ = Y.success ? Y.data : null;
    async function w($) {
        if ($ === "escape" || $ === "defer") {
            A("Privacy settings dialog dismissed", {
                display: "system"
            });
            return
        }
        await O()
    }
    async function O() {
        let $ = await eI();
        if (!$.success) {
            A("Unable to retrieve updated privacy settings", {
                display: "system"
            });
            return
        }
        let H = $.data,
            j = H.grove_enabled ? "true" : "false";
        if (A(`"Help improve Claude" set to ${j}.`), z.grove_enabled !== null && z.grove_enabled !== H.grove_enabled) d("tengu_grove_policy_toggled", {
            state: H.grove_enabled,
            location: "settings"
        })
    }
    if (z.grove_enabled !== null) return $r6.createElement(Zl8, {
        settings: z,
        domainExcluded: _?.domain_excluded,
        onDone: O
    });
    return $r6.createElement(Wl8, {
        showIfAlreadyViewed: !0,
        onDone: w,
        location: "settings"
    })
}
// @from(Ln 419097, Col 4)
$r6
// @from(Ln 419097, Col 9)
aMq = "Review and manage your privacy settings at https://claude.ai/settings/data-privacy-controls"
// @from(Ln 419098, Col 4)
tMq = E(() => {
    Gl8();
    KG6();
    V1();
    $r6 = t(P6(), 1)
})
// @from(Ln 419104, Col 4)
I1z
// @from(Ln 419104, Col 9)
eMq
// @from(Ln 419105, Col 4)
ADq = E(() => {
    fA();
    I1z = {
        type: "local-jsx",
        name: "privacy-settings",
        description: "View and update your privacy settings",
        isEnabled: () => {
            return vU6()
        },
        isHidden: !1,
        load: () => Promise.resolve().then(() => (tMq(), sMq)),
        userFacingName() {
            return "privacy-settings"
        }
    }, eMq = I1z
})
// @from(Ln 419122, Col 0)
function qDq(A) {
    let q = A6(21),
        {
            hookEventMetadata: K,
            hooksByEvent: Y,
            totalHooksCount: z,
            restrictedByPolicy: _,
            onSelectEvent: w,
            onCancel: O
        } = A,
        $ = `${z} hook${z!==1?"s":""} configured`,
        H;
    if (q[0] !== _) H = _ && bO.createElement(m, {
        flexDirection: "column"
    }, bO.createElement(T, {
        color: "suggestion"
    }, a6.info, " Hooks Restricted by Policy"), bO.createElement(T, {
        dimColor: !0
    }, "Only hooks from managed settings can run. User-defined hooks from ~/.claude/settings.json, .claude/settings.json, and .claude/settings.local.json are blocked.")), q[0] = _, q[1] = H;
    else H = q[1];
    let j;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) j = bO.createElement(m, {
        flexDirection: "column"
    }, bO.createElement(T, {
        dimColor: !0
    }, a6.info, " This menu is read-only. To add or modify hooks, edit settings.json directly or ask Claude.", " ", bO.createElement(y7, {
        url: "https://code.claude.com/docs/en/hooks"
    }, "Learn more"))), q[2] = j;
    else j = q[2];
    let J;
    if (q[3] !== w) J = (Z) => {
        w(Z)
    }, q[3] = w, q[4] = J;
    else J = q[4];
    let M;
    if (q[5] !== K) M = Object.entries(K), q[5] = K, q[6] = M;
    else M = q[6];
    let D;
    if (q[7] !== Y || q[8] !== M) D = M.map((Z) => {
        let [G, f] = Z, v = Y[G] || 0;
        return {
            label: v > 0 ? bO.createElement(T, null, G, " ", bO.createElement(T, {
                color: "suggestion"
            }, "(", v, ")")) : G,
            value: G,
            description: f.summary
        }
    }), q[7] = Y, q[8] = M, q[9] = D;
    else D = q[9];
    let X;
    if (q[10] !== O || q[11] !== J || q[12] !== D) X = bO.createElement(m, {
        flexDirection: "column"
    }, bO.createElement(T8, {
        onChange: J,
        onCancel: O,
        options: D
    })), q[10] = O, q[11] = J, q[12] = D, q[13] = X;
    else X = q[13];
    let P;
    if (q[14] !== H || q[15] !== X) P = bO.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, H, j, X), q[14] = H, q[15] = X, q[16] = P;
    else P = q[16];
    let W;
    if (q[17] !== O || q[18] !== $ || q[19] !== P) W = bO.createElement(m8, {
        title: "Hooks",
        subtitle: $,
        onCancel: O
    }, P), q[17] = O, q[18] = $, q[19] = P, q[20] = W;
    else W = q[20];
    return W
}
// @from(Ln 419195, Col 4)
bO
// @from(Ln 419196, Col 4)
KDq = E(() => {
    e6();
    i6();
    v3();
    b7();
    wq();
    i6();
    bO = t(P6(), 1)
})
// @from(Ln 419206, Col 0)
function YDq(A) {
    let q = A6(25),
        {
            selectedEvent: K,
            matchersForSelectedEvent: Y,
            hooksByEventAndMatcher: z,
            eventDescription: _,
            onSelect: w,
            onCancel: O
        } = A,
        $;
    if (q[0] !== z || q[1] !== Y || q[2] !== K) {
        let P;
        if (q[4] !== z || q[5] !== K) P = (W) => {
            let Z = z[K]?.[W] || [],
                G = Array.from(new Set(Z.map(u1z)));
            return {
                matcher: W,
                sources: G,
                hookCount: Z.length
            }
        }, q[4] = z, q[5] = K, q[6] = P;
        else P = q[6];
        $ = Y.map(P), q[0] = z, q[1] = Y, q[2] = K, q[3] = $
    } else $ = q[3];
    let H = $;
    if (Y.length === 0) {
        let P = `${K} - Matchers`,
            W;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) W = o0.createElement(m, {
            flexDirection: "column",
            gap: 1
        }, o0.createElement(T, {
            dimColor: !0
        }, "No hooks configured for this event."), o0.createElement(T, {
            dimColor: !0
        }, "To add hooks, edit settings.json directly or ask Claude.")), q[7] = W;
        else W = q[7];
        let Z;
        if (q[8] !== _ || q[9] !== O || q[10] !== P) Z = o0.createElement(m8, {
            title: P,
            subtitle: _,
            onCancel: O,
            inputGuide: x1z
        }, W), q[8] = _, q[9] = O, q[10] = P, q[11] = Z;
        else Z = q[11];
        return Z
    }
    let j = `${K} - Matchers`,
        J;
    if (q[12] !== H) J = H.map(b1z), q[12] = H, q[13] = J;
    else J = q[13];
    let M;
    if (q[14] !== w) M = (P) => {
        w(P)
    }, q[14] = w, q[15] = M;
    else M = q[15];
    let D;
    if (q[16] !== O || q[17] !== J || q[18] !== M) D = o0.createElement(m, {
        flexDirection: "column"
    }, o0.createElement(T8, {
        options: J,
        onChange: M,
        onCancel: O
    })), q[16] = O, q[17] = J, q[18] = M, q[19] = D;
    else D = q[19];
    let X;
    if (q[20] !== _ || q[21] !== O || q[22] !== j || q[23] !== D) X = o0.createElement(m8, {
        title: j,
        subtitle: _,
        onCancel: O
    }, D), q[20] = _, q[21] = O, q[22] = j, q[23] = D, q[24] = X;
    else X = q[24];
    return X
}
// @from(Ln 419282, Col 0)
function b1z(A) {
    let q = A.sources.map(Q24).join(", "),
        K = A.matcher || "(all)";
    return {
        label: `[${q}] ${K}`,
        value: A.matcher,
        description: `${A.hookCount} hook${A.hookCount!==1?"s":""}`
    }
}
// @from(Ln 419292, Col 0)
function x1z() {
    return o0.createElement(T, null, "Esc to go back")
}
// @from(Ln 419296, Col 0)
function u1z(A) {
    return A.source
}
// @from(Ln 419299, Col 4)
o0
// @from(Ln 419300, Col 4)
zDq = E(() => {
    e6();
    i6();
    P96();
    v3();
    wq();
    o0 = t(P6(), 1)
})
// @from(Ln 419309, Col 0)
function _Dq(A) {
    let q = A6(19),
        {
            selectedEvent: K,
            selectedMatcher: Y,
            hooksForSelectedMatcher: z,
            hookEventMetadata: _,
            onSelect: w,
            onCancel: O
        } = A,
        $ = _.matcherMetadata !== void 0 ? `${K} - Matcher: ${Y||"(all)"}` : K;
    if (z.length === 0) {
        let X;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = a0.createElement(m, {
            flexDirection: "column",
            gap: 1
        }, a0.createElement(T, {
            dimColor: !0
        }, "No hooks configured for this event."), a0.createElement(T, {
            dimColor: !0
        }, "To add hooks, edit settings.json directly or ask Claude.")), q[0] = X;
        else X = q[0];
        let P;
        if (q[1] !== _.description || q[2] !== O || q[3] !== $) P = a0.createElement(m8, {
            title: $,
            subtitle: _.description,
            onCancel: O,
            inputGuide: B1z
        }, X), q[1] = _.description, q[2] = O, q[3] = $, q[4] = P;
        else P = q[4];
        return P
    }
    let H = _.description,
        j;
    if (q[5] !== z) j = z.map(m1z), q[5] = z, q[6] = j;
    else j = q[6];
    let J;
    if (q[7] !== z || q[8] !== w) J = (X) => {
        let P = parseInt(X, 10),
            W = z[P];
        if (W) w(W)
    }, q[7] = z, q[8] = w, q[9] = J;
    else J = q[9];
    let M;
    if (q[10] !== O || q[11] !== j || q[12] !== J) M = a0.createElement(m, {
        flexDirection: "column"
    }, a0.createElement(T8, {
        options: j,
        onChange: J,
        onCancel: O
    })), q[10] = O, q[11] = j, q[12] = J, q[13] = M;
    else M = q[13];
    let D;
    if (q[14] !== _.description || q[15] !== O || q[16] !== M || q[17] !== $) D = a0.createElement(m8, {
        title: $,
        subtitle: H,
        onCancel: O
    }, M), q[14] = _.description, q[15] = O, q[16] = M, q[17] = $, q[18] = D;
    else D = q[18];
    return D
}
// @from(Ln 419371, Col 0)
function m1z(A, q) {
    return {
        label: `[${A.config.type}] ${dI(A.config)}`,
        value: q.toString(),
        description: A.source === "pluginHook" && A.pluginName ? `${wE8(A.source)} (${A.pluginName})` : wE8(A.source)
    }
}
// @from(Ln 419379, Col 0)
function B1z() {
    return a0.createElement(T, null, "Esc to go back")
}
// @from(Ln 419382, Col 4)
a0
// @from(Ln 419383, Col 4)
wDq = E(() => {
    e6();
    i6();
    P96();
    v3();
    wq();
    a0 = t(P6(), 1)
})
// @from(Ln 419392, Col 0)
function ODq(A) {
    let q = A6(40),
        {
            selectedHook: K,
            eventSupportsMatcher: Y,
            onCancel: z
        } = A,
        _;
    if (q[0] !== K.event) _ = s5.createElement(T, null, "Event: ", s5.createElement(T, {
        bold: !0
    }, K.event)), q[0] = K.event, q[1] = _;
    else _ = q[1];
    let w;
    if (q[2] !== Y || q[3] !== K.matcher) w = Y && s5.createElement(T, null, "Matcher: ", s5.createElement(T, {
        bold: !0
    }, K.matcher || "(all)")), q[2] = Y, q[3] = K.matcher, q[4] = w;
    else w = q[4];
    let O;
    if (q[5] !== K.config.type) O = s5.createElement(T, null, "Type: ", s5.createElement(T, {
        bold: !0
    }, K.config.type)), q[5] = K.config.type, q[6] = O;
    else O = q[6];
    let $;
    if (q[7] !== K.source) $ = p24(K.source), q[7] = K.source, q[8] = $;
    else $ = q[8];
    let H;
    if (q[9] !== $) H = s5.createElement(T, null, "Source:", " ", s5.createElement(T, {
        dimColor: !0
    }, $)), q[9] = $, q[10] = H;
    else H = q[10];
    let j;
    if (q[11] !== K.pluginName) j = K.pluginName && s5.createElement(T, null, "Plugin: ", s5.createElement(T, {
        dimColor: !0
    }, K.pluginName)), q[11] = K.pluginName, q[12] = j;
    else j = q[12];
    let J;
    if (q[13] !== _ || q[14] !== w || q[15] !== O || q[16] !== H || q[17] !== j) J = s5.createElement(m, {
        flexDirection: "column"
    }, _, w, O, H, j), q[13] = _, q[14] = w, q[15] = O, q[16] = H, q[17] = j, q[18] = J;
    else J = q[18];
    let M;
    if (q[19] !== K.config) M = F1z(K.config), q[19] = K.config, q[20] = M;
    else M = q[20];
    let D;
    if (q[21] !== M) D = s5.createElement(T, {
        dimColor: !0
    }, M, ":"), q[21] = M, q[22] = D;
    else D = q[22];
    let X;
    if (q[23] !== K.config) X = p1z(K.config), q[23] = K.config, q[24] = X;
    else X = q[24];
    let P;
    if (q[25] !== X) P = s5.createElement(m, {
        borderStyle: "round",
        borderDimColor: !0,
        paddingLeft: 1,
        paddingRight: 1
    }, s5.createElement(T, null, X)), q[25] = X, q[26] = P;
    else P = q[26];
    let W;
    if (q[27] !== P || q[28] !== D) W = s5.createElement(m, {
        flexDirection: "column"
    }, D, P), q[27] = P, q[28] = D, q[29] = W;
    else W = q[29];
    let Z;
    if (q[30] !== K.config) Z = "statusMessage" in K.config && K.config.statusMessage && s5.createElement(T, null, "Status message:", " ", s5.createElement(T, {
        dimColor: !0
    }, K.config.statusMessage)), q[30] = K.config, q[31] = Z;
    else Z = q[31];
    let G;
    if (q[32] === Symbol.for("react.memo_cache_sentinel")) G = s5.createElement(T, {
        dimColor: !0
    }, "To modify or remove this hook, edit settings.json directly or ask Claude to help."), q[32] = G;
    else G = q[32];
    let f;
    if (q[33] !== W || q[34] !== Z || q[35] !== J) f = s5.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, J, W, Z, G), q[33] = W, q[34] = Z, q[35] = J, q[36] = f;
    else f = q[36];
    let v;
    if (q[37] !== z || q[38] !== f) v = s5.createElement(m8, {
        title: "Hook details",
        onCancel: z,
        inputGuide: g1z
    }, f), q[37] = z, q[38] = f, q[39] = v;
    else v = q[39];
    return v
}
// @from(Ln 419482, Col 0)
function g1z() {
    return s5.createElement(T, null, "Esc to go back")
}
// @from(Ln 419486, Col 0)
function F1z(A) {
    switch (A.type) {
        case "command":
            return "Command";
        case "prompt":
            return "Prompt";
        case "agent":
            return "Prompt";
        case "http":
            return "URL"
    }
}
// @from(Ln 419499, Col 0)
function p1z(A) {
    switch (A.type) {
        case "command":
            return A.command;
        case "prompt":
            return A.prompt;
        case "agent":
            return A.prompt;
        case "http":
            return A.url
    }
}
// @from(Ln 419511, Col 4)
s5
// @from(Ln 419512, Col 4)
$Dq = E(() => {
    e6();
    i6();
    P96();
    wq();
    s5 = t(P6(), 1)
})
// @from(Ln 419520, Col 0)
function HDq(A, q) {
    let K = {
            PreToolUse: {},
            PostToolUse: {},
            PostToolUseFailure: {},
            Notification: {},
            UserPromptSubmit: {},
            SessionStart: {},
            SessionEnd: {},
            Stop: {},
            SubagentStart: {},
            SubagentStop: {},
            PreCompact: {},
            PostCompact: {},
            PermissionRequest: {},
            Setup: {},
            TeammateIdle: {},
            TaskCompleted: {},
            Elicitation: {},
            ElicitationResult: {},
            ConfigChange: {},
            WorktreeCreate: {},
            WorktreeRemove: {},
            InstructionsLoaded: {}
        },
        Y = gR1(q);
    F24(A).forEach((_) => {
        let w = K[_.event];
        if (w) {
            let O = Y[_.event].matcherMetadata !== void 0 ? _.matcher || "" : "";
            if (!w[O]) w[O] = [];
            w[O].push(_)
        }
    });
    let z = Xp();
    if (z)
        for (let [_, w] of Object.entries(z)) {
            let O = _,
                $ = K[O];
            if (!$) continue;
            for (let H of w) {
                let j = H.matcher || "";
                if ("pluginRoot" in H) {
                    $[j] ??= [];
                    for (let J of H.hooks) $[j].push({
                        event: O,
                        config: J,
                        matcher: H.matcher,
                        source: "pluginHook",
                        pluginName: H.pluginId
                    })
                }
            }
        }
    return K
}
// @from(Ln 419577, Col 0)
function jDq(A, q) {
    let K = Object.keys(A[q] || {});
    return U24(K, A, q)
}
// @from(Ln 419582, Col 0)
function JDq(A, q, K) {
    let Y = K ?? "";
    return A[q]?.[Y] ?? []
}
// @from(Ln 419587, Col 0)
function Hr6(A, q) {
    return gR1(q)[A].matcherMetadata
}
// @from(Ln 419590, Col 4)
gR1
// @from(Ln 419591, Col 4)
MDq = E(() => {
    U4();
    P96();
    T1();
    gR1 = e1(function(A) {
        return {
            PreToolUse: {
                summary: "Before tool execution",
                description: `Input to command is JSON of tool call arguments.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and block tool call
Other exit codes - show stderr to user only but continue with tool call`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: A
                }
            },
            PostToolUse: {
                summary: "After tool execution",
                description: `Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: A
                }
            },
            PostToolUseFailure: {
                summary: "After tool execution fails",
                description: `Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: A
                }
            },
            Notification: {
                summary: "When notifications are sent",
                description: `Input to command is JSON with notification message and type.
Exit code 0 - stdout/stderr not shown
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "notification_type",
                    values: ["permission_prompt", "idle_prompt", "auth_success", "elicitation_dialog", "elicitation_complete", "elicitation_response"]
                }
            },
            UserPromptSubmit: {
                summary: "When the user submits a prompt",
                description: `Input to command is JSON with original user prompt text.
Exit code 0 - stdout shown to Claude
Exit code 2 - block processing, erase original prompt, and show stderr to user only
Other exit codes - show stderr to user only`
            },
            SessionStart: {
                summary: "When a new session is started",
                description: `Input to command is JSON with session start source.
Exit code 0 - stdout shown to Claude
Blocking errors are ignored
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "source",
                    values: ["startup", "resume", "clear", "compact"]
                }
            },
            Stop: {
                summary: "Right before Claude concludes its response",
                description: `Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and continue conversation
Other exit codes - show stderr to user only`
            },
            SubagentStart: {
                summary: "When a subagent (Agent tool call) is started",
                description: `Input to command is JSON with agent_id and agent_type.
Exit code 0 - stdout shown to subagent
Blocking errors are ignored
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "agent_type",
                    values: []
                }
            },
            SubagentStop: {
                summary: "Right before a subagent (Agent tool call) concludes its response",
                description: `Input to command is JSON with agent_id, agent_type, and agent_transcript_path.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to subagent and continue having it run
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "agent_type",
                    values: []
                }
            },
            PreCompact: {
                summary: "Before conversation compaction",
                description: `Input to command is JSON with compaction details.
Exit code 0 - stdout appended as custom compact instructions
Exit code 2 - block compaction
Other exit codes - show stderr to user only but continue with compaction`,
                matcherMetadata: {
                    fieldToMatch: "trigger",
                    values: ["manual", "auto"]
                }
            },
            PostCompact: {
                summary: "After conversation compaction",
                description: `Input to command is JSON with compaction details and the summary.
Exit code 0 - stdout shown to user
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "trigger",
                    values: ["manual", "auto"]
                }
            },
            SessionEnd: {
                summary: "When a session is ending",
                description: `Input to command is JSON with session end reason.
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "reason",
                    values: ["clear", "logout", "prompt_input_exit", "other"]
                }
            },
            PermissionRequest: {
                summary: "When a permission dialog is displayed",
                description: `Input to command is JSON with tool_name, tool_input, and tool_use_id.
Output JSON with hookSpecificOutput containing decision to allow or deny.
Exit code 0 - use hook decision if provided
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: A
                }
            },
            Setup: {
                summary: "Repo setup hooks for init and maintenance",
                description: `Input to command is JSON with trigger (init or maintenance).
Exit code 0 - stdout shown to Claude
Blocking errors are ignored
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "trigger",
                    values: ["init", "maintenance"]
                }
            },
            TeammateIdle: {
                summary: "When a teammate is about to go idle",
                description: `Input to command is JSON with teammate_name and team_name.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to teammate and prevent idle (teammate continues working)
Other exit codes - show stderr to user only`
            },
            TaskCompleted: {
                summary: "When a task is being marked as completed",
                description: `Input to command is JSON with task_id, task_subject, task_description, teammate_name, and team_name.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and prevent task completion
Other exit codes - show stderr to user only`
            },
            Elicitation: {
                summary: "When an MCP server requests user input (elicitation)",
                description: `Input to command is JSON with mcp_server_name, message, and requested_schema.
Output JSON with hookSpecificOutput containing action (accept/decline/cancel) and optional content.
Exit code 0 - use hook response if provided
Exit code 2 - deny the elicitation
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "mcp_server_name",
                    values: []
                }
            },
            ElicitationResult: {
                summary: "After a user responds to an MCP elicitation",
                description: `Input to command is JSON with mcp_server_name, action, content, mode, and elicitation_id.
Output JSON with hookSpecificOutput containing optional action and content to override the response.
Exit code 0 - use hook response if provided
Exit code 2 - block the response (action becomes decline)
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "mcp_server_name",
                    values: []
                }
            },
            ConfigChange: {
                summary: "When configuration files change during a session",
                description: `Input to command is JSON with source (user_settings, project_settings, local_settings, policy_settings, skills) and file_path.
Exit code 0 - allow the change
Exit code 2 - block the change from being applied to the session
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "source",
                    values: ["user_settings", "project_settings", "local_settings", "policy_settings", "skills"]
                }
            },
            InstructionsLoaded: {
                summary: "When an instruction file (CLAUDE.md or rule) is loaded",
                description: `Input to command is JSON with file_path, memory_type (User, Project, Local, Managed), load_reason (session_start, nested_traversal, path_glob_match, include), globs (optional — the paths: frontmatter patterns that matched), trigger_file_path (optional — the file Claude touched that caused the load), and parent_file_path (optional — the file that @-included this one).
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only
This hook is observability-only and does not support blocking.`,
                matcherMetadata: {
                    fieldToMatch: "load_reason",
                    values: ["session_start", "nested_traversal", "path_glob_match", "include"]
                }
            },
            WorktreeCreate: {
                summary: "Create an isolated worktree for VCS-agnostic isolation",
                description: `Input to command is JSON with name (suggested worktree slug).
Stdout should contain the absolute path to the created worktree directory.
Exit code 0 - worktree created successfully
Other exit codes - worktree creation failed`
            },
            WorktreeRemove: {
                summary: "Remove a previously created worktree",
                description: `Input to command is JSON with worktree_path (absolute path to worktree).
Exit code 0 - worktree removed successfully
Other exit codes - show stderr to user only`
            }
        }
    }, (A) => A.slice().sort().join(","))
})
// @from(Ln 419816, Col 0)
function DDq(A) {
    let q = A6(96),
        {
            toolNames: K,
            onExit: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        mode: "select-event"
    }, q[0] = z;
    else z = q[0];
    let [_, w] = FR1.useState(z), [O, $] = FR1.useState(i1z), [H, j] = FR1.useState(l1z), J;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) J = (n) => {
        if (n === "policySettings") {
            let a = PA()?.disableAllHooks === !0;
            $(a && L8("policySettings")?.disableAllHooks === !0), j(L8("policySettings")?.allowManagedHooksOnly === !0)
        }
    }, q[1] = J;
    else J = q[1];
    u06(J);
    let M = _.mode,
        D = "event" in _ ? _.event : "PreToolUse",
        X = "matcher" in _ ? _.matcher : null,
        P = M1(c1z),
        W = S5(),
        Z;
    if (q[2] !== P.tools || q[3] !== K) Z = [...K, ...P.tools.map(d1z)], q[2] = P.tools, q[3] = K, q[4] = Z;
    else Z = q[4];
    let G = Z,
        f;
    if (q[5] !== W || q[6] !== G) f = HDq(W.getState(), G), q[5] = W, q[6] = G, q[7] = f;
    else f = q[7];
    let v = f,
        N;
    if (q[8] !== v || q[9] !== D) N = jDq(v, D), q[8] = v, q[9] = D, q[10] = N;
    else N = q[10];
    let V = N,
        L;
    if (q[11] !== v || q[12] !== D || q[13] !== X) L = JDq(v, D, X), q[11] = v, q[12] = D, q[13] = X, q[14] = L;
    else L = q[14];
    let h = L,
        R;
    if (q[15] !== Y) R = () => {
        Y("Hooks dialog dismissed", {
            display: "system"
        })
    }, q[15] = Y, q[16] = R;
    else R = q[16];
    let u = R,
        I = M === "select-event",
        g;
    if (q[17] !== I) g = {
        context: "Confirmation",
        isActive: I
    }, q[17] = I, q[18] = g;
    else g = q[18];
    D8("confirm:no", u, g);
    let B;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) B = () => {
        w({
            mode: "select-event"
        })
    }, q[19] = B;
    else B = q[19];
    let b = M === "select-matcher",
        p;
    if (q[20] !== b) p = {
        context: "Confirmation",
        isActive: b
    }, q[20] = b, q[21] = p;
    else p = q[21];
    D8("confirm:no", B, p);
    let Q;
    if (q[22] !== G || q[23] !== _) Q = () => {
        if ("event" in _)
            if (Hr6(_.event, G) !== void 0) w({
                mode: "select-matcher",
                event: _.event
            });
            else w({
                mode: "select-event"
            })
    }, q[22] = G, q[23] = _, q[24] = Q;
    else Q = q[24];
    let U = M === "select-hook",
        r;
    if (q[25] !== U) r = {
        context: "Confirmation",
        isActive: U
    }, q[25] = U, q[26] = r;
    else r = q[26];
    D8("confirm:no", Q, r);
    let e;
    if (q[27] !== _) e = () => {
        if (_.mode === "view-hook") {
            let {
                event: n,
                hook: o
            } = _;
            w({
                mode: "select-hook",
                event: n,
                matcher: o.matcher || ""
            })
        }
    }, q[27] = _, q[28] = e;
    else e = q[28];
    let Y6 = M === "view-hook",
        H6;
    if (q[29] !== Y6) H6 = {
        context: "Confirmation",
        isActive: Y6
    }, q[29] = Y6, q[30] = H6;
    else H6 = q[30];
    D8("confirm:no", e, H6);
    let J6;
    if (q[31] !== G) J6 = gR1(G), q[31] = G, q[32] = J6;
    else J6 = q[32];
    let K6 = J6,
        X6 = PA()?.disableAllHooks === !0,
        z6;
    if (q[33] !== v) {
        let n = {},
            o = 0;
        for (let [a, i] of Object.entries(v)) {
            let l = Object.values(i).reduce(U1z, 0);
            n[a] = l, o = o + l
        }
        z6 = {
            hooksByEvent: n,
            totalHooksCount: o
        }, q[33] = v, q[34] = z6
    } else z6 = q[34];
    let {
        hooksByEvent: N6,
        totalHooksCount: $6
    } = z6;
    if (X6) {
        let n;
        if (q[35] === Symbol.for("react.memo_cache_sentinel")) n = XY.createElement(T, {
            bold: !0
        }, "disabled"), q[35] = n;
        else n = q[35];
        let o = O && " by a managed settings file",
            a;
        if (q[36] !== $6) a = XY.createElement(T, {
            bold: !0
        }, $6), q[36] = $6, q[37] = a;
        else a = q[37];
        let i = $6 !== 1 ? "s" : "",
            l = $6 !== 1 ? "are" : "is",
            q6;
        if (q[38] !== o || q[39] !== a || q[40] !== i || q[41] !== l) q6 = XY.createElement(T, null, "All hooks are currently ", n, o, ". You have", " ", a, " configured hook", i, " that", " ", l, " not running."), q[38] = o, q[39] = a, q[40] = i, q[41] = l, q[42] = q6;
        else q6 = q[42];
        let w6, O6, L6, y6;
        if (q[43] === Symbol.for("react.memo_cache_sentinel")) w6 = XY.createElement(m, {
            marginTop: 1
        }, XY.createElement(T, {
            dimColor: !0
        }, "When hooks are disabled:")), O6 = XY.createElement(T, {
            dimColor: !0
        }, "• No hook commands will execute"), L6 = XY.createElement(T, {
            dimColor: !0
        }, "• StatusLine will not be displayed"), y6 = XY.createElement(T, {
            dimColor: !0
        }, "• Tool operations will proceed without hook validation"), q[43] = w6, q[44] = O6, q[45] = L6, q[46] = y6;
        else w6 = q[43], O6 = q[44], L6 = q[45], y6 = q[46];
        let G6;
        if (q[47] !== q6) G6 = XY.createElement(m, {
            flexDirection: "column"
        }, q6, w6, O6, L6, y6), q[47] = q6, q[48] = G6;
        else G6 = q[48];
        let R6;
        if (q[49] !== O) R6 = !O && XY.createElement(T, {
            dimColor: !0
        }, 'To re-enable hooks, remove "disableAllHooks" from settings.json or ask Claude.'), q[49] = O, q[50] = R6;
        else R6 = q[50];
        let T6;
        if (q[51] !== G6 || q[52] !== R6) T6 = XY.createElement(m, {
            flexDirection: "column",
            gap: 1
        }, G6, R6), q[51] = G6, q[52] = R6, q[53] = T6;
        else T6 = q[53];
        let D6;
        if (q[54] !== u || q[55] !== T6) D6 = XY.createElement(m8, {
            title: "Hook Configuration - Disabled",
            onCancel: u,
            inputGuide: Q1z
        }, T6), q[54] = u, q[55] = T6, q[56] = D6;
        else D6 = q[56];
        return D6
    }
    switch (_.mode) {
        case "select-event": {
            let n;
            if (q[57] !== G) n = (a) => {
                if (Hr6(a, G) !== void 0) w({
                    mode: "select-matcher",
                    event: a
                });
                else w({
                    mode: "select-hook",
                    event: a,
                    matcher: ""
                })
            }, q[57] = G, q[58] = n;
            else n = q[58];
            let o;
            if (q[59] !== u || q[60] !== K6 || q[61] !== N6 || q[62] !== H || q[63] !== n || q[64] !== $6) o = XY.createElement(qDq, {
                hookEventMetadata: K6,
                hooksByEvent: N6,
                totalHooksCount: $6,
                restrictedByPolicy: H,
                onSelectEvent: n,
                onCancel: u
            }), q[59] = u, q[60] = K6, q[61] = N6, q[62] = H, q[63] = n, q[64] = $6, q[65] = o;
            else o = q[65];
            return o
        }
        case "select-matcher": {
            let n = K6[_.event],
                o;
            if (q[66] !== _.event) o = (l) => {
                w({
                    mode: "select-hook",
                    event: _.event,
                    matcher: l
                })
            }, q[66] = _.event, q[67] = o;
            else o = q[67];
            let a;
            if (q[68] === Symbol.for("react.memo_cache_sentinel")) a = () => {
                w({
                    mode: "select-event"
                })
            }, q[68] = a;
            else a = q[68];
            let i;
            if (q[69] !== v || q[70] !== _.event || q[71] !== V || q[72] !== n.description || q[73] !== o) i = XY.createElement(YDq, {
                selectedEvent: _.event,
                matchersForSelectedEvent: V,
                hooksByEventAndMatcher: v,
                eventDescription: n.description,
                onSelect: o,
                onCancel: a
            }), q[69] = v, q[70] = _.event, q[71] = V, q[72] = n.description, q[73] = o, q[74] = i;
            else i = q[74];
            return i
        }
        case "select-hook": {
            let n = K6[_.event],
                o;
            if (q[75] !== _.event) o = (l) => {
                w({
                    mode: "view-hook",
                    event: _.event,
                    hook: l
                })
            }, q[75] = _.event, q[76] = o;
            else o = q[76];
            let a;
            if (q[77] !== G || q[78] !== _.event) a = () => {
                if (Hr6(_.event, G) !== void 0) w({
                    mode: "select-matcher",
                    event: _.event
                });
                else w({
                    mode: "select-event"
                })
            }, q[77] = G, q[78] = _.event, q[79] = a;
            else a = q[79];
            let i;
            if (q[80] !== h || q[81] !== _.event || q[82] !== _.matcher || q[83] !== n || q[84] !== o || q[85] !== a) i = XY.createElement(_Dq, {
                selectedEvent: _.event,
                selectedMatcher: _.matcher,
                hooksForSelectedMatcher: h,
                hookEventMetadata: n,
                onSelect: o,
                onCancel: a
            }), q[80] = h, q[81] = _.event, q[82] = _.matcher, q[83] = n, q[84] = o, q[85] = a, q[86] = i;
            else i = q[86];
            return i
        }
        case "view-hook": {
            let n = _.hook,
                o;
            if (q[87] !== G || q[88] !== _.event) o = Hr6(_.event, G), q[87] = G, q[88] = _.event, q[89] = o;
            else o = q[89];
            let a = o !== void 0,
                i;
            if (q[90] !== _) i = () => {
                let {
                    event: q6,
                    hook: w6
                } = _;
                w({
                    mode: "select-hook",
                    event: q6,
                    matcher: w6.matcher || ""
                })
            }, q[90] = _, q[91] = i;
            else i = q[91];
            let l;
            if (q[92] !== _.hook || q[93] !== a || q[94] !== i) l = XY.createElement(ODq, {
                selectedHook: n,
                eventSupportsMatcher: a,
                onCancel: i
            }), q[92] = _.hook, q[93] = a, q[94] = i, q[95] = l;
            else l = q[95];
            return l
        }
    }
}
// @from(Ln 420130, Col 0)
function Q1z() {
    return XY.createElement(T, null, "Esc to close")
}
// @from(Ln 420134, Col 0)
function U1z(A, q) {
    return A + q.length
}
// @from(Ln 420138, Col 0)
function d1z(A) {
    return A.name
}
// @from(Ln 420142, Col 0)
function c1z(A) {
    return A.mcp
}
// @from(Ln 420146, Col 0)
function l1z() {
    return L8("policySettings")?.allowManagedHooksOnly === !0
}
// @from(Ln 420150, Col 0)
function i1z() {
    return PA()?.disableAllHooks === !0 && L8("policySettings")?.disableAllHooks === !0
}
// @from(Ln 420153, Col 4)
XY
// @from(Ln 420153, Col 8)
FR1
// @from(Ln 420154, Col 4)
XDq = E(() => {
    e6();
    i6();
    _7();
    KDq();
    zDq();
    wDq();
    $Dq();
    MDq();
    NA();
    wq();
    i8();
    XX1();
    XY = t(P6(), 1), FR1 = t(P6(), 1)
})
// @from(Ln 420169, Col 4)
PDq = {}
// @from(Ln 420173, Col 4)
fl8
// @from(Ln 420173, Col 9)
n1z = async (A, q) => {
    d("tengu_hooks_command", {});
    let Y = q.getAppState().toolPermissionContext,
        z = FX(Y).map((_) => _.name);
    return fl8.createElement(DDq, {
        toolNames: z,
        onExit: A
    })
}
// @from(Ln 420182, Col 4)
WDq = E(() => {
    XDq();
    IX();
    V1();
    fl8 = t(P6(), 1)
})
// @from(Ln 420188, Col 4)
r1z
// @from(Ln 420188, Col 9)
ZDq
// @from(Ln 420189, Col 4)
GDq = E(() => {
    r1z = {
        type: "local-jsx",
        name: "hooks",
        description: "View hook configurations for tool events",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (WDq(), PDq)),
        userFacingName() {
            return "hooks"
        }
    }, ZDq = r1z
})
// @from(Ln 420202, Col 4)
fDq = {}
// @from(Ln 420209, Col 0)
async function a1z(A, q) {
    let K = q.readFileState ? jB(q.readFileState) : [];
    if (K.length === 0) return {
        type: "text",
        value: "No files in context"
    };
    return {
        type: "text",
        value: `Files in context:
${K.map((z)=>o1z(G1(),z)).join(`
`)}`
    }
}
// @from(Ln 420222, Col 4)
TDq = E(() => {
    lA();
    tP()
})
// @from(Ln 420226, Col 4)
s1z
// @from(Ln 420226, Col 9)
vDq
// @from(Ln 420227, Col 4)
NDq = E(() => {
    s1z = {
        type: "local",
        name: "files",
        description: "List all files currently in context",
        isEnabled: () => !1,
        isHidden: !1,
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (TDq(), fDq)),
        userFacingName() {
            return "files"
        }
    }, vDq = s1z
})
// @from(Ln 420241, Col 4)
kDq = {}
// @from(Ln 420255, Col 0)
function VDq(A) {
    let q = A?.message?.content;
    if (!q) return "Forked conversation";
    let K = typeof q === "string" ? q : q.find((Y) => Y.type === "text")?.text;
    if (!K) return "Forked conversation";
    return K.replace(/\s+/g, " ").trim().slice(0, 100) || "Forked conversation"
}
// @from(Ln 420262, Col 0)
async function K8z(A) {
    let q = t1z(),
        K = R1(),
        Y = mj(AA()),
        z = cf(q),
        _ = Cz();
    await A8z(Y, {
        recursive: !0,
        mode: 448
    });
    let w;
    try {
        w = await e1z(_)
    } catch {
        throw Error("No conversation to fork")
    }
    if (w.length === 0) throw Error("No conversation to fork");
    let O = cx(w),
        $ = O.filter((D) => Wl(D) && !D.isSidechain),
        H = O.filter((D) => D.type === "content-replacement" && D.sessionId === K).flatMap((D) => D.replacements);
    if ($.length === 0) throw Error("No messages to fork");
    let j = null,
        J = [],
        M = [];
    for (let D of $) {
        let X = {
                ...D,
                sessionId: q,
                parentUuid: j,
                isSidechain: !1,
                forkedFrom: {
                    sessionId: K,
                    messageUuid: D.uuid
                }
            },
            P = {
                ...D,
                sessionId: q
            };
        M.push(P), J.push(B6(X)), j = D.uuid
    }
    if (H.length > 0) {
        let D = {
            type: "content-replacement",
            sessionId: q,
            replacements: H
        };
        J.push(B6(D))
    }
    return await q8z(z, J.join(`
`) + `
`, {
        encoding: "utf8",
        mode: 384
    }), {
        sessionId: q,
        title: A,
        forkPath: z,
        serializedMessages: M,
        contentReplacementRecords: H
    }
}
// @from(Ln 420324, Col 0)
async function Y8z(A) {
    let q = `${A} (Fork)`;
    if ((await GF(q, {
            exact: !0
        })).length === 0) return q;
    let Y = await GF(`${A} (Fork`),
        z = new Set([1]),
        _ = new RegExp(`^${RJ6(A)} \\(Fork(?: (\\d+))?\\)$`);
    for (let O of Y) {
        let $ = O.customTitle?.match(_);
        if ($)
            if ($[1]) z.add(parseInt($[1], 10));
            else z.add(1)
    }
    let w = 2;
    while (z.has(w)) w++;
    return `${A} (Fork ${w})`
}
// @from(Ln 420342, Col 0)
async function z8z(A, q, K) {
    let Y = K?.trim() || void 0,
        z = R1();
    try {
        let {
            sessionId: _,
            title: w,
            forkPath: O,
            serializedMessages: $,
            contentReplacementRecords: H
        } = await K8z(Y), j = new Date, J = VDq($.find((G) => G.type === "user")), D = await Y8z(w ?? J);
        await X_6(_, D, O), d("tengu_conversation_forked", {
            message_count: $.length,
            has_custom_title: !!w
        });
        let X = {
                date: j.toISOString().split("T")[0],
                messages: $,
                fullPath: O,
                value: j.getTime(),
                created: j,
                modified: j,
                firstPrompt: J,
                messageCount: $.length,
                isSidechain: !1,
                sessionId: _,
                customTitle: D,
                contentReplacements: H
            },
            P = w ? ` "${w}"` : "",
            W = `
To resume the original: claude -r ${z}`,
            Z = `Forked conversation${P}. You are now in the fork.${W}`;
        if (q.resume) await q.resume(_, X, "fork"), A(Z, {
            display: "system"
        });
        else A(`Forked conversation${P}. Resume with: /resume ${_}`);
        return null
    } catch (_) {
        let w = _ instanceof Error ? _.message : "Unknown error occurred";
        return A(`Failed to fork conversation: ${w}`), null
    }
}
// @from(Ln 420385, Col 4)
EDq = E(() => {
    Oq();
    T1();
    g1();
    K_();
    V1()
})
// @from(Ln 420392, Col 4)
_8z
// @from(Ln 420392, Col 9)
yDq
// @from(Ln 420393, Col 4)
LDq = E(() => {
    _8z = {
        type: "local-jsx",
        name: "fork",
        description: "Create a fork of the current conversation at this point",
        argumentHint: "[name]",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (EDq(), kDq)),
        userFacingName() {
            return "fork"
        }
    }, yDq = _8z
})
// @from(Ln 420408, Col 0)
function pR1(A, q) {
    let K = new Map;
    for (let _ of q) K.set(_.agentType, _);
    let Y = new Set,
        z = [];
    for (let _ of A) {
        let w = `${_.agentType}:${_.source}`;
        if (Y.has(w)) continue;
        Y.add(w);
        let O = K.get(_.agentType),
            $ = O && O.source !== _.source ? O.source : void 0;
        z.push({
            ..._,
            overriddenBy: $
        })
    }
    return z
}
// @from(Ln 420427, Col 0)
function QR1(A) {
    let q = A.model || Dk8();
    if (!q) return;
    return q === "inherit" ? "inherit" : q
}
// @from(Ln 420433, Col 0)
function UR1(A) {
    return jJ6(A).toLowerCase()
}
// @from(Ln 420437, Col 0)
function dR1(A, q) {
    return A.agentType.localeCompare(q.agentType, void 0, {
        sensitivity: "base"
    })
}
// @from(Ln 420442, Col 4)
jr6
// @from(Ln 420443, Col 4)
cR1 = E(() => {
    A96();
    O2();
    jr6 = [{
        label: "User agents",
        source: "userSettings"
    }, {
        label: "Project agents",
        source: "projectSettings"
    }, {
        label: "Local agents",
        source: "localSettings"
    }, {
        label: "Managed agents",
        source: "policySettings"
    }, {
        label: "Plugin agents",
        source: "plugin"
    }, {
        label: "CLI arg agents",
        source: "flagSettings"
    }, {
        label: "Built-in agents",
        source: "built-in"
    }]
})
// @from(Ln 420469, Col 4)
TF
// @from(Ln 420470, Col 4)
RDq = E(() => {
    TF = {
        FOLDER_NAME: ".claude",
        AGENTS_DIR: "agents"
    }
})
// @from(Ln 420486, Col 0)
function hDq(A, q, K, Y, z, _, w, O) {
    let $ = q.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\\\n"),
        j = K === void 0 || K.length === 1 && K[0] === "*" ? "" : `
tools: ${K.join(", ")}`,
        J = _ ? `
model: ${_}` : "",
        M = O !== void 0 ? `
effort: ${O}` : "",
        D = z ? `
color: ${z}` : "",
        X = w ? `
memory: ${w}` : "";
    return `---
name: ${A}
description: "${$}"${j}${J}${M}${D}${X}
---

${Y}
`
}
// @from(Ln 420507, Col 0)
function lR1(A) {
    switch (A) {
        case "flagSettings":
            throw Error(`Cannot get directory path for ${A} agents`);
        case "userSettings":
            return zi(c8(), TF.AGENTS_DIR);
        case "projectSettings":
            return zi(G1(), TF.FOLDER_NAME, TF.AGENTS_DIR);
        case "policySettings":
            return zi(bW(), TF.FOLDER_NAME, TF.AGENTS_DIR);
        case "localSettings":
            return zi(G1(), TF.FOLDER_NAME, TF.AGENTS_DIR)
    }
}
// @from(Ln 420522, Col 0)
function SDq(A) {
    switch (A) {
        case "projectSettings":
            return zi(".", TF.FOLDER_NAME, TF.AGENTS_DIR);
        default:
            return lR1(A)
    }
}
// @from(Ln 420531, Col 0)
function Tl8(A) {
    let q = lR1(A.source);
    return zi(q, `${A.agentType}.md`)
}
// @from(Ln 420536, Col 0)
function iR1(A) {
    if (A.source === "built-in") return "Built-in";
    if (A.source === "plugin") throw Error("Cannot get file path for plugin agents");
    let q = lR1(A.source),
        K = A.filename || A.agentType;
    return zi(q, `${K}.md`)
}
// @from(Ln 420544, Col 0)
function CDq(A) {
    if (A.source === "built-in") return "Built-in";
    let q = SDq(A.source);
    return zi(q, `${A.agentType}.md`)
}
// @from(Ln 420550, Col 0)
function IDq(A) {
    if (Qj(A)) return "Built-in";
    if (zQ6(A)) return `Plugin: ${A.plugin||"Unknown"}`;
    if (A.source === "flagSettings") return "CLI argument";
    let q = SDq(A.source),
        K = A.filename || A.agentType;
    return zi(q, `${K}.md`)
}
// @from(Ln 420558, Col 0)
async function j8z(A) {
    let q = lR1(A);
    return await w8z(q, {
        recursive: !0
    }), q
}
// @from(Ln 420564, Col 0)
async function bDq(A, q, K, Y, z, _ = !0, w, O, $, H) {
    if (A === "built-in") throw Error("Cannot save built-in agents");
    await j8z(A);
    let j = Tl8({
        source: A,
        agentType: q
    });
    if (_) try {
        throw await H8z(j), Error(`Agent file already exists: ${j}`)
    } catch (M) {
        if (M.code !== "ENOENT") throw M
    }
    let J = hDq(q, K, Y, z, w, O, $, H);
    await mDq(j, J)
}
// @from(Ln 420579, Col 0)
async function xDq(A, q, K, Y, z, _, w, O) {
    if (A.source === "built-in") throw Error("Cannot update built-in agents");
    let $ = iR1(A),
        H = hDq(A.agentType, q, K, Y, z, _, w, O);
    await mDq($, H)
}
// @from(Ln 420585, Col 0)
async function uDq(A) {
    if (A.source === "built-in") throw Error("Cannot delete built-in agents");
    let q = iR1(A);
    try {
        await $8z(q)
    } catch (K) {
        if (K.code !== "ENOENT") throw K
    }
}
// @from(Ln 420594, Col 0)
async function mDq(A, q) {
    let K = await O8z(A, "w");
    try {
        await K.writeFile(q, {
            encoding: "utf-8"
        }), await K.datasync()
    } finally {
        await K.close()
    }
}
// @from(Ln 420604, Col 4)
PN6 = E(() => {
    lA();
    A8();
    J0();
    RDq();
    So()
})
// @from(Ln 420612, Col 0)
function WN6(A) {
    if (A === "all") return "Agents";
    if (A === "built-in") return "Built-in agents";
    if (A === "plugin") return "Plugin agents";
    return EU(vo(A))
}
// @from(Ln 420618, Col 4)
nR1 = E(() => {
    Ou6();
    O2()
})