
// @from(Ln 420141, Col 0)
function Izq(A) {
    let q = e(100),
        {
            onExit: K,
            initialTab: Y
        } = A,
        z = Y === void 0 ? "allow" : Y,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = [], q[0] = w;
    else w = q[0];
    let [H, $] = Vc.useState(w), O = v6(O4z), _ = L7(), J = k_(), [X, D] = Vc.useState(), [j, M] = Vc.useState(), [P, W] = Vc.useState(null), [G, f] = Vc.useState(null), [Z, N] = Vc.useState(!1), [T, k] = Vc.useState(null), [y, B] = Vc.useState(!1), S;
    if (q[1] !== O) S = new Map, dD1(O).forEach((P1) => {
        S.set(Q1(P1), P1)
    }), q[1] = O, q[2] = S;
    else S = q[2];
    let m = S,
        b;
    if (q[3] !== O) b = new Map, tU(O).forEach((P1) => {
        b.set(Q1(P1), P1)
    }), q[3] = O, q[4] = b;
    else b = q[4];
    let g = b,
        U;
    if (q[5] !== O) U = new Map, cD1(O).forEach((P1) => {
        U.set(Q1(P1), P1)
    }), q[5] = O, q[6] = U;
    else U = q[6];
    let x = U,
        p;
    if (q[7] !== m || q[8] !== x || q[9] !== g) p = (P1, k1) => {
        let o1 = k1 === void 0 ? "" : k1,
            _6 = (() => {
                switch (P1) {
                    case "allow":
                        return m;
                    case "deny":
                        return g;
                    case "ask":
                        return x;
                    case "workspace":
                        return new Map
                }
            })(),
            z6 = [];
        if (P1 !== "workspace" && !o1) z6.push({
            label: `Add a new rule${l1.ellipsis}`,
            value: "add-new-rule"
        });
        let w6 = Array.from(_6.keys()).sort((G6, L6) => {
                let OA = _6.get(G6),
                    bA = _6.get(L6);
                if (OA && bA) {
                    let lA = M9(OA.ruleValue).toLowerCase(),
                        E7 = M9(bA.ruleValue).toLowerCase();
                    return lA.localeCompare(E7)
                }
                return 0
            }),
            r6 = o1.toLowerCase();
        for (let G6 of w6) {
            let L6 = _6.get(G6);
            if (L6) {
                let OA = M9(L6.ruleValue);
                if (o1 && !OA.toLowerCase().includes(r6)) continue;
                z6.push({
                    label: OA,
                    value: G6
                })
            }
        }
        return {
            options: z6,
            rulesByKey: _6
        }
    }, q[7] = m, q[8] = x, q[9] = g, q[10] = p;
    else p = q[10];
    let l = p,
        r = uq(),
        s = !X && !P && !G && !Z && !T,
        O1 = s && y,
        T1;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) T1 = () => {
        B(!1)
    }, q[11] = T1;
    else T1 = q[11];
    let N1;
    if (q[12] !== O1) N1 = {
        isActive: O1,
        onExit: T1
    }, q[12] = O1, q[13] = N1;
    else N1 = q[13];
    let {
        query: j1,
        setQuery: q1,
        cursorOffset: t
    } = qF(N1), J1;
    if (q[14] !== y || q[15] !== q1) J1 = (P1, k1) => {
        let o1 = !k1.ctrl && !k1.meta;
        if (!y) {
            if (P1 === "/" && o1) B(!0), q1("");
            else if (o1 && P1.length > 0 && P1 !== "j" && P1 !== "k" && P1 !== "m" && P1 !== "i" && !/^\s+$/.test(P1)) B(!0), q1(P1)
        }
    }, q[14] = y, q[15] = q1, q[16] = J1;
    else J1 = q[16];
    let D1;
    if (q[17] !== s) D1 = {
        isActive: s
    }, q[17] = s, q[18] = D1;
    else D1 = q[18];
    D8(J1, D1);
    let Z1;
    if (q[19] !== l) Z1 = (P1, k1) => {
        let {
            rulesByKey: o1
        } = l(k1);
        if (P1 === "add-new-rule") {
            W(k1);
            return
        } else {
            D(o1.get(P1));
            return
        }
    }, q[19] = l, q[20] = Z1;
    else Z1 = q[20];
    let E1 = Z1,
        a;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) a = () => {
        W(null)
    }, q[21] = a;
    else a = q[21];
    let A1 = a,
        M1;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) M1 = (P1, k1) => {
        f({
            ruleValue: P1,
            ruleBehavior: k1
        }), W(null)
    }, q[22] = M1;
    else M1 = q[22];
    let z1 = M1,
        Y1;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) Y1 = (P1, k1) => {
        f(null);
        for (let o1 of P1) $((_6) => [..._6, `Added ${o1.ruleBehavior} rule ${H6.bold(M9(o1.ruleValue))}`]);
        if (k1 && k1.length > 0)
            for (let o1 of k1) {
                let _6 = o1.shadowType === "deny" ? "blocked" : "shadowed";
                $((z6) => [...z6, H6.yellow(`${l1.warning} Warning: ${M9(o1.rule.ruleValue)} is ${_6}`), H6.dim(`  ${o1.reason}`), H6.dim(`  Fix: ${o1.fix}`)])
            }
    }, q[23] = Y1;
    else Y1 = q[23];
    let _1 = Y1,
        $1;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) $1 = () => {
        f(null)
    }, q[24] = $1;
    else $1 = q[24];
    let G1 = $1,
        L1;
    if (q[25] !== l || q[26] !== X || q[27] !== _ || q[28] !== O) L1 = () => {
        if (!X) return;
        let {
            options: P1
        } = l(X.ruleBehavior), k1 = Q1(X), o1 = P1.filter($4z).map(H4z), _6 = o1.indexOf(k1), z6;
        if (_6 !== -1) {
            if (_6 < o1.length - 1) z6 = o1[_6 + 1];
            else if (_6 > 0) z6 = o1[_6 - 1]
        }
        M(z6), bzq({
            rule: X,
            initialContext: O,
            setToolPermissionContext(w6) {
                _((r6) => ({
                    ...r6,
                    toolPermissionContext: w6
                }))
            }
        }), $((w6) => [...w6, `Deleted ${X.ruleBehavior} rule ${H6.bold(M9(X.ruleValue))}`]), D(void 0)
    }, q[25] = l, q[26] = X, q[27] = _, q[28] = O, q[29] = L1;
    else L1 = q[29];
    let x1 = L1;
    if (X) {
        let P1;
        if (q[30] === Symbol.for("react.memo_cache_sentinel")) P1 = () => D(void 0), q[30] = P1;
        else P1 = q[30];
        let k1;
        if (q[31] !== x1 || q[32] !== X) k1 = B8.createElement(z4z, {
            rule: X,
            onDelete: x1,
            onCancel: P1
        }), q[31] = x1, q[32] = X, q[33] = k1;
        else k1 = q[33];
        return k1
    }
    if (P && P !== "workspace") {
        let P1;
        if (q[34] !== P) P1 = B8.createElement(Lzq, {
            onCancel: A1,
            onSubmit: z1,
            ruleBehavior: P
        }), q[34] = P, q[35] = P1;
        else P1 = q[35];
        return P1
    }
    if (G) {
        let P1;
        if (q[36] !== G.ruleValue) P1 = [G.ruleValue], q[36] = G.ruleValue, q[37] = P1;
        else P1 = q[37];
        let k1;
        if (q[38] !== _) k1 = (_6) => {
            _((z6) => ({
                ...z6,
                toolPermissionContext: _6
            }))
        }, q[38] = _, q[39] = k1;
        else k1 = q[39];
        let o1;
        if (q[40] !== P1 || q[41] !== k1 || q[42] !== O || q[43] !== G.ruleBehavior) o1 = B8.createElement(yk7, {
            onAddRules: _1,
            onCancel: G1,
            ruleValues: P1,
            ruleBehavior: G.ruleBehavior,
            initialContext: O,
            setToolPermissionContext: k1
        }), q[40] = P1, q[41] = k1, q[42] = O, q[43] = G.ruleBehavior, q[44] = o1;
        else o1 = q[44];
        return o1
    }
    if (Z) {
        let P1;
        if (q[45] !== _ || q[46] !== O) P1 = (_6, z6) => {
            let r6 = {
                    type: "addDirectories",
                    directories: [_6],
                    destination: z6 ? "localSettings" : "session"
                },
                G6 = a2(O, r6);
            if (_((L6) => ({
                    ...L6,
                    toolPermissionContext: G6
                })), z6) eb(r6);
            $((L6) => [...L6, `Added directory ${H6.bold(_6)} to workspace${z6?" and saved to local settings":" for this session"}`]), N(!1)
        }, q[45] = _, q[46] = O, q[47] = P1;
        else P1 = q[47];
        let k1;
        if (q[48] === Symbol.for("react.memo_cache_sentinel")) k1 = () => N(!1), q[48] = k1;
        else k1 = q[48];
        let o1;
        if (q[49] !== P1 || q[50] !== O) o1 = B8.createElement(oU1, {
            onAddDirectory: P1,
            onCancel: k1,
            permissionContext: O
        }), q[49] = P1, q[50] = O, q[51] = o1;
        else o1 = q[51];
        return o1
    }
    if (T) {
        let P1;
        if (q[52] !== T) P1 = () => {
            $((z6) => [...z6, `Removed directory ${H6.bold(T)} from workspace`]), k(null)
        }, q[52] = T, q[53] = P1;
        else P1 = q[53];
        let k1;
        if (q[54] === Symbol.for("react.memo_cache_sentinel")) k1 = () => k(null), q[54] = k1;
        else k1 = q[54];
        let o1;
        if (q[55] !== _) o1 = (z6) => {
            _((w6) => ({
                ...w6,
                toolPermissionContext: z6
            }))
        }, q[55] = _, q[56] = o1;
        else o1 = q[56];
        let _6;
        if (q[57] !== T || q[58] !== P1 || q[59] !== o1 || q[60] !== O) _6 = B8.createElement(Szq, {
            directoryPath: T,
            onRemove: P1,
            onCancel: k1,
            permissionContext: O,
            setPermissionContext: o1
        }), q[57] = T, q[58] = P1, q[59] = o1, q[60] = O, q[61] = _6;
        else _6 = q[61];
        return _6
    }
    let f1;
    if (q[62] === Symbol.for("react.memo_cache_sentinel")) f1 = function(k1) {
        switch (k1) {
            case "allow":
                return "Claude Code won't ask before using allowed tools.";
            case "deny":
                return "Claude Code will always reject requests to use denied tools.";
            case "ask":
                return "Claude Code will always ask for confirmation before using these tools.";
            case "workspace":
                return "Claude Code can read files in the workspace, and make edits when auto-accept edits is on."
        }
    }, q[62] = f1;
    else f1 = q[62];
    let R1 = f1,
        H1;
    if (q[63] !== H || q[64] !== l || q[65] !== E1 || q[66] !== y || q[67] !== J || q[68] !== j || q[69] !== K || q[70] !== t || q[71] !== j1 || q[72] !== O) H1 = function(k1) {
        if (k1 === "workspace") return B8.createElement(yzq, {
            onExit: K,
            getToolPermissionContext: () => O,
            onRequestAddDirectory: () => N(!0),
            onRequestRemoveDirectory: (_6) => k(_6)
        });
        let {
            options: o1
        } = l(k1, j1);
        return B8.createElement(w4z, {
            options: o1,
            searchQuery: j1,
            isSearchMode: y,
            isFocused: J,
            onSelect: (_6) => E1(_6, k1),
            onCancel: () => {
                if (H.length > 0) K(H.join(`
`));
                else K("Permissions dialog dismissed", {
                    display: "system"
                })
            },
            lastFocusedRuleKey: j,
            onUpFromFirstItem: () => B(!0),
            cursorOffset: t
        })
    }, q[63] = H, q[64] = l, q[65] = E1, q[66] = y, q[67] = J, q[68] = j, q[69] = K, q[70] = t, q[71] = j1, q[72] = O, q[73] = H1;
    else H1 = q[73];
    let y1 = H1,
        B1 = !!X || !!P || !!G || Z || !!T,
        A6;
    if (q[74] === Symbol.for("react.memo_cache_sentinel")) A6 = B8.createElement(V, null, R1("allow")), q[74] = A6;
    else A6 = q[74];
    let O6;
    if (q[75] !== y1) O6 = B8.createElement(LH, {
        id: "allow",
        title: "Allow"
    }, B8.createElement(I, {
        flexDirection: "column",
        flexShrink: 0
    }, A6, y1("allow"))), q[75] = y1, q[76] = O6;
    else O6 = q[76];
    let P6;
    if (q[77] === Symbol.for("react.memo_cache_sentinel")) P6 = B8.createElement(V, null, R1("ask")), q[77] = P6;
    else P6 = q[77];
    let V6;
    if (q[78] !== y1) V6 = B8.createElement(LH, {
        id: "ask",
        title: "Ask"
    }, B8.createElement(I, {
        flexDirection: "column"
    }, P6, y1("ask"))), q[78] = y1, q[79] = V6;
    else V6 = q[79];
    let q6;
    if (q[80] === Symbol.for("react.memo_cache_sentinel")) q6 = B8.createElement(V, null, R1("deny")), q[80] = q6;
    else q6 = q[80];
    let p1;
    if (q[81] !== y1) p1 = B8.createElement(LH, {
        id: "deny",
        title: "Deny"
    }, B8.createElement(I, {
        flexDirection: "column"
    }, q6, y1("deny"))), q[81] = y1, q[82] = p1;
    else p1 = q[82];
    let K6;
    if (q[83] === Symbol.for("react.memo_cache_sentinel")) K6 = B8.createElement(V, null, R1("workspace")), q[83] = K6;
    else K6 = q[83];
    let j6;
    if (q[84] !== y1) j6 = B8.createElement(LH, {
        id: "workspace",
        title: "Workspace"
    }, B8.createElement(I, {
        flexDirection: "column"
    }, K6, y1("workspace"))), q[84] = y1, q[85] = j6;
    else j6 = q[85];
    let M6;
    if (q[86] !== z || q[87] !== B1 || q[88] !== y || q[89] !== O6 || q[90] !== V6 || q[91] !== p1 || q[92] !== j6) M6 = B8.createElement($y, {
        title: "Permissions:",
        color: "permission",
        defaultTab: z,
        hidden: B1,
        disableNavigation: y
    }, O6, V6, p1, j6), q[86] = z, q[87] = B1, q[88] = y, q[89] = O6, q[90] = V6, q[91] = p1, q[92] = j6, q[93] = M6;
    else M6 = q[93];
    let N6;
    if (q[94] !== r.keyName || q[95] !== r.pending) N6 = B8.createElement(I, {
        marginTop: 1,
        paddingLeft: 1
    }, B8.createElement(V, {
        dimColor: !0
    }, r.pending ? B8.createElement(B8.Fragment, null, "Press ", r.keyName, " again to exit") : B8.createElement(B8.Fragment, null, "Press ↑↓ to navigate · Enter to select · Type to search · Esc to cancel"))), q[94] = r.keyName, q[95] = r.pending, q[96] = N6;
    else N6 = q[96];
    let F6;
    if (q[97] !== M6 || q[98] !== N6) F6 = B8.createElement(I, {
        flexDirection: "column",
        flexShrink: 0
    }, M6, N6), q[97] = M6, q[98] = N6, q[99] = F6;
    else F6 = q[99];
    return F6
}
// @from(Ln 420543, Col 0)
function H4z(A) {
    return A.value
}
// @from(Ln 420547, Col 0)
function $4z(A) {
    return A.value !== "add-new-rule"
}
// @from(Ln 420551, Col 0)
function O4z(A) {
    return A.toolPermissionContext
}
// @from(Ln 420554, Col 4)
B8
// @from(Ln 420554, Col 8)
Vc
// @from(Ln 420555, Col 4)
xzq = v(() => {
    i1();
    m1();
    K7();
    U5();
    R2();
    PJ();
    b7();
    a$A();
    jw6();
    Rzq();
    q3();
    Czq();
    UhA();
    hzq();
    CO();
    d8();
    X91();
    HZ1();
    $Z1();
    m6();
    B8 = o(X1(), 1), Vc = o(X1(), 1)
})
// @from(Ln 420578, Col 4)
uzq = {}
// @from(Ln 420582, Col 4)
NuA
// @from(Ln 420582, Col 9)
_4z = async (A) => {
    return u8("permissions"), NuA.createElement(Izq, {
        onExit: A
    })
}
// @from(Ln 420587, Col 4)
Bzq = v(() => {
    xzq();
    v3();
    NuA = o(X1(), 1)
})
// @from(Ln 420592, Col 4)
J4z
// @from(Ln 420592, Col 9)
mzq
// @from(Ln 420593, Col 4)
Fzq = v(() => {
    J4z = {
        type: "local-jsx",
        name: "permissions",
        aliases: ["allowed-tools"],
        description: "Manage allow & deny tool permission rules",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Bzq(), uzq)),
        userFacingName() {
            return "permissions"
        }
    }, mzq = J4z
})
// @from(Ln 420607, Col 4)
Qzq = {}
// @from(Ln 420612, Col 0)
function X4z(A) {
    let q = e(11),
        {
            planContent: K,
            planPath: Y,
            editorName: z
        } = A,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = gJ.createElement(V, {
        bold: !0
    }, "Current Plan"), q[0] = w;
    else w = q[0];
    let H;
    if (q[1] !== Y) H = gJ.createElement(V, {
        dimColor: !0
    }, Y), q[1] = Y, q[2] = H;
    else H = q[2];
    let $;
    if (q[3] !== K) $ = gJ.createElement(I, {
        marginTop: 1
    }, gJ.createElement(V, null, K)), q[3] = K, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== z) O = z && gJ.createElement(I, {
        marginTop: 1
    }, gJ.createElement(V, {
        dimColor: !0
    }, '"/plan open"'), gJ.createElement(V, {
        dimColor: !0
    }, " to edit this plan in "), gJ.createElement(V, {
        bold: !0,
        dimColor: !0
    }, z)), q[5] = z, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] !== H || q[8] !== $ || q[9] !== O) _ = gJ.createElement(I, {
        flexDirection: "column"
    }, w, H, $, O), q[7] = H, q[8] = $, q[9] = O, q[10] = _;
    else _ = q[10];
    return _
}
// @from(Ln 420653, Col 0)
async function D4z(A, q, K) {
    let {
        getAppState: Y,
        setAppState: z
    } = q, H = (await Y()).toolPermissionContext.mode;
    if (H !== "plan") return ey(H, "plan"), z((M) => ({
        ...M,
        toolPermissionContext: a2(M.toolPermissionContext, {
            type: "setMode",
            mode: "plan",
            destination: "session"
        })
    })), A("Enabled plan mode"), null;
    let $ = pD(),
        O = uW();
    if (!$) return A("Already in plan mode. No plan written yet."), null;
    if (K.trim().split(/\s+/)[0] === "open") try {
        return await KF(O), A(`Opened plan in editor: ${O}`), null
    } catch (M) {
        return A(`Failed to open plan in editor: ${M}`), null
    }
    let J = FI(),
        X = J ? S_(J) : void 0,
        j = await JZ1(gJ.createElement(X4z, {
            planContent: $,
            planPath: O,
            editorName: X
        }));
    return A(j), null
}
// @from(Ln 420683, Col 4)
gJ
// @from(Ln 420684, Col 4)
gzq = v(() => {
    i1();
    m1();
    mX();
    YF();
    q$();
    fp1();
    CO();
    B6();
    gJ = o(X1(), 1)
})
// @from(Ln 420695, Col 4)
j4z
// @from(Ln 420695, Col 9)
TuA
// @from(Ln 420696, Col 4)
Uzq = v(() => {
    j4z = {
        type: "local-jsx",
        name: "plan",
        description: "Enable plan mode or view the current session plan",
        argumentHint: "[open]",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (gzq(), Qzq)),
        userFacingName() {
            return "plan"
        }
    }, TuA = j4z
})
// @from(Ln 420711, Col 0)
function pzq(A) {
    let q = e(2),
        {
            cooldown: K
        } = A;
    if (K) {
        let z;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = Dd1.createElement(V, {
            color: "promptBorder",
            dimColor: !0
        }, Ou), q[0] = z;
        else z = q[0];
        return z
    }
    let Y;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = Dd1.createElement(V, {
        color: "penguin"
    }, Ou), q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 420733, Col 0)
function c91(A = !0, q = !1) {
    if (!A) return Ou;
    let K = f6().theme;
    if (q) return H6.dim(k8("promptBorder", K)(Ou));
    return k8("penguin", K)(Ou)
}
// @from(Ln 420739, Col 4)
Dd1
// @from(Ln 420740, Col 4)
vuA = v(() => {
    i1();
    q3();
    m1();
    Tr();
    cA();
    jW();
    Dd1 = o(X1(), 1)
})
// @from(Ln 420749, Col 4)
lzq = {}
// @from(Ln 420754, Col 0)
function czq(A, q) {
    if (e81(), Z7("userSettings", {
            fastMode: A ? !0 : void 0
        }), A) q((K) => {
        let Y = !x$(K.mainLoopModel);
        return {
            ...K,
            ...Y ? {
                mainLoopModel: zC1,
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
// @from(Ln 420774, Col 0)
function M4z(A) {
    let q = e(36),
        {
            onDone: K,
            unavailableReason: Y
        } = A,
        z = v6(Z4z),
        w = v6(G4z),
        H = L7(),
        [$, O] = dzq.useState(w ?? !1),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = J7A(), q[0] = _;
    else _ = q[0];
    let J = _,
        X = J.status === "cooldown",
        D = Y !== null,
        j, M;
    if (q[1] !== z) j = x$(z) && (z ?? "").includes("[1m]"), M = VV(_r(j, !0)), q[1] = z, q[2] = j, q[3] = M;
    else j = q[2], M = q[3];
    let P = M,
        W;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) W = HS(), q[4] = W;
    else W = q[4];
    let G = W,
        f;
    if (q[5] !== j) f = G ? VV(j ? E7A : v7A) : null, q[5] = j, q[6] = f;
    else f = q[6];
    let Z = f,
        N = G ? ` (${G.discountPercent}% off through ${G.endDate})` : "",
        T;
    if (q[7] !== $ || q[8] !== D || q[9] !== z || q[10] !== K || q[11] !== P || q[12] !== H) T = function() {
        if (D) return;
        if (czq($, H), $) {
            let T1 = c91($),
                N1 = !x$(z) ? ` · model set to ${$S}` : "";
            K(`${T1} Fast mode ON${N1} · ${P}${N}`)
        } else H(W4z), K("Fast mode OFF")
    }, q[7] = $, q[8] = D, q[9] = z, q[10] = K, q[11] = P, q[12] = H, q[13] = T;
    else T = q[13];
    let k = T,
        y;
    if (q[14] !== w || q[15] !== K) y = function() {
        let T1 = w ? `${c91()} Kept Fast mode ON` : "Kept Fast mode OFF";
        K(T1, {
            display: "system"
        })
    }, q[14] = w, q[15] = K, q[16] = y;
    else y = q[16];
    let B = y,
        S;
    if (q[17] !== D) S = function() {
        if (D) return;
        O(P4z)
    }, q[17] = D, q[18] = S;
    else S = q[18];
    let m = S,
        b;
    if (q[19] !== k || q[20] !== m) b = {
        "confirm:yes": k,
        "confirm:nextField": m,
        "confirm:next": m,
        "confirm:previous": m,
        "confirm:cycleMode": m,
        "confirm:toggle": m
    }, q[19] = k, q[20] = m, q[21] = b;
    else b = q[21];
    let g;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) g = {
        context: "Confirmation"
    }, q[22] = g;
    else g = q[22];
    c7(b, g);
    let U;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) U = gK.createElement(V, null, gK.createElement(pzq, {
        cooldown: X
    }), " Fast mode (research preview)"), q[23] = U;
    else U = q[23];
    let x = U,
        p;
    if (q[24] !== D) p = (O1) => O1.pending ? gK.createElement(V, null, "Press ", O1.keyName, " again to exit") : D ? gK.createElement(V, null, "Esc to cancel") : gK.createElement(V, null, "Tab to toggle · Enter to confirm · Esc to cancel"), q[24] = D, q[25] = p;
    else p = q[25];
    let l;
    if (q[26] !== $ || q[27] !== Z || q[28] !== P || q[29] !== Y) l = Y ? gK.createElement(I, {
        marginLeft: 2
    }, gK.createElement(V, {
        color: "error"
    }, Y)) : gK.createElement(gK.Fragment, null, gK.createElement(I, {
        flexDirection: "column",
        gap: 0,
        marginLeft: 2
    }, gK.createElement(I, {
        flexDirection: "row",
        gap: 2
    }, gK.createElement(V, {
        bold: !0
    }, "Fast mode"), gK.createElement(V, {
        color: $ ? "penguin" : void 0,
        bold: $
    }, $ ? "ON " : "OFF"), Z ? gK.createElement(gK.Fragment, null, gK.createElement(V, {
        dimColor: !0,
        strikethrough: !0
    }, Z), gK.createElement(V, {
        dimColor: !0
    }, P, N)) : gK.createElement(V, {
        dimColor: !0
    }, P))), X && J.status === "cooldown" && gK.createElement(I, {
        marginLeft: 2
    }, gK.createElement(V, {
        color: "warning"
    }, "You've hit your fast limit", " · resets in", " ", Xz(J.resetAt - Date.now(), {
        hideTrailingZeros: !0
    })))), q[26] = $, q[27] = Z, q[28] = P, q[29] = Y, q[30] = l;
    else l = q[30];
    let r;
    if (q[31] === Symbol.for("react.memo_cache_sentinel")) r = gK.createElement(V, {
        dimColor: !0
    }, "Learn more:", " ", gK.createElement(d7, {
        url: "https://code.claude.com/docs/en/fast-mode"
    }, "https://code.claude.com/docs/en/fast-mode")), q[31] = r;
    else r = q[31];
    let s;
    if (q[32] !== B || q[33] !== p || q[34] !== l) s = gK.createElement(w8, {
        title: x,
        subtitle: `High-speed mode for ${$S}. Billed as extra usage at a premium rate. Separate rate limits apply.`,
        onCancel: B,
        color: "penguin",
        borderDimColor: !1,
        inputGuide: p
    }, l, r), q[32] = B, q[33] = p, q[34] = l, q[35] = s;
    else s = q[35];
    return s
}
// @from(Ln 420907, Col 0)
function P4z(A) {
    return !A
}
// @from(Ln 420911, Col 0)
function W4z(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 420918, Col 0)
function G4z(A) {
    return A.fastMode
}
// @from(Ln 420922, Col 0)
function Z4z(A) {
    return A.mainLoopModel
}
// @from(Ln 420925, Col 0)
async function f4z(A, q, K) {
    let Y = kq6();
    if (Y) return `Fast mode unavailable: ${Y}`;
    let {
        mainLoopModel: z
    } = await q();
    if (czq(A, K), A) {
        let w = c91(!0),
            H = !x$(z) ? ` · model set to ${$S}` : "",
            $ = x$(z) && (z ?? "").includes("[1m]"),
            O = HS(),
            _ = VV(_r($, !0)),
            J = O ? ` (${O.discountPercent}% off through ${O.endDate})` : "";
        return `${w} Fast mode ON${H} · ${_}${J}`
    } else return "Fast mode OFF"
}
// @from(Ln 420941, Col 0)
async function V4z(A, q, K) {
    if (!i4()) return null;
    let Y = 300;
    if (await Promise.race([Lq6().then(() => !1), new Promise(($) => setTimeout(() => $(!0), Y))])) c("tengu_fast_mode_prefetch_timeout", {});
    let w = K?.trim().toLowerCase();
    if (w === "on" || w === "off") {
        let $ = await f4z(w === "on", q.getAppState, q.setAppState);
        return A($), null
    }
    let H = kq6();
    return gK.createElement(M4z, {
        onDone: A,
        unavailableReason: H
    })
}
// @from(Ln 420956, Col 4)
gK
// @from(Ln 420956, Col 8)
dzq
// @from(Ln 420957, Col 4)
izq = v(() => {
    i1();
    m1();
    d8();
    OJ();
    vq();
    u6();
    vuA();
    Bq();
    p8();
    K7();
    F_1();
    gK = o(X1(), 1), dzq = o(X1(), 1)
})
// @from(Ln 420971, Col 4)
N4z
// @from(Ln 420971, Col 9)
nzq
// @from(Ln 420972, Col 4)
rzq = v(() => {
    OJ();
    N4z = {
        type: "local-jsx",
        name: "fast",
        get description() {
            return `Toggle fast mode (${$S} only)`
        },
        isEnabled: () => i4(),
        get isHidden() {
            return !i4()
        },
        argumentHint: "[on|off]",
        userFacingName: () => "fast",
        load: () => Promise.resolve().then(() => (izq(), lzq))
    }, nzq = N4z
})
// @from(Ln 420990, Col 0)
function ozq({
    onDone: A
}) {
    let [q, K] = OF.useState(!0), [Y, z] = OF.useState([]), [w, H] = OF.useState(!1), [$, O] = OF.useState(null), [_, J] = OF.useState(void 0), X = uq(() => A("Guest passes dialog dismissed", {
        display: "system"
    })), D = OF.useCallback(() => {
        A("Guest passes dialog dismissed", {
            display: "system"
        })
    }, [A]);
    if (DA("confirm:no", D, {
            context: "Confirmation"
        }), D8((W, G) => {
            if (G.return && $)(async () => {
                if (await l0($)) c("tengu_guest_passes_link_copied", {}), A("Referral link copied to clipboard!");
                else A(xD1(), {
                    display: "system"
                })
            })()
        }), OF.useEffect(() => {
            async function W() {
                try {
                    let G = await op1();
                    if (!G || !G.eligible) {
                        H(!1), K(!1);
                        return
                    }
                    if (H(!0), G.referral_code_details?.referral_link) O(G.referral_code_details.referral_link);
                    J(G.referrer_reward);
                    let f = G.referral_code_details?.campaign ?? "claude_code_guest_pass",
                        Z;
                    try {
                        Z = await y9q(f)
                    } catch (y) {
                        K1(y), H(!1), K(!1);
                        return
                    }
                    let N = Z.redemptions || [],
                        T = Z.limit || 3,
                        k = [];
                    for (let y = 0; y < T; y++) {
                        let B = N[y];
                        k.push({
                            passNumber: y + 1,
                            isAvailable: !B
                        })
                    }
                    z(k), K(!1)
                } catch (G) {
                    K1(G), H(!1), K(!1)
                }
            }
            W()
        }, []), q) return q4.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, q4.createElement(V, {
        dimColor: !0
    }, "Loading guest pass information…"), q4.createElement(V, {
        dimColor: !0,
        italic: !0
    }, X.pending ? q4.createElement(q4.Fragment, null, "Press ", X.keyName, " again to exit") : q4.createElement(q4.Fragment, null, "Esc to cancel")));
    if (!w) return q4.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, q4.createElement(V, null, "Guest passes are not currently available."), q4.createElement(V, {
        dimColor: !0,
        italic: !0
    }, X.pending ? q4.createElement(q4.Fragment, null, "Press ", X.keyName, " again to exit") : q4.createElement(q4.Fragment, null, "Esc to cancel")));
    let j = Y.filter((W) => W.isAvailable).length,
        M = [...Y].sort((W, G) => +G.isAvailable - +W.isAvailable),
        P = (W) => {
            if (!W.isAvailable) return q4.createElement(I, {
                key: W.passNumber,
                flexDirection: "column",
                marginRight: 1
            }, q4.createElement(V, {
                dimColor: !0
            }, "┌─────────╱"), q4.createElement(V, {
                dimColor: !0
            }, " ) CC ✻ ┊╱"), q4.createElement(V, {
                dimColor: !0
            }, "└───────╱"));
            return q4.createElement(I, {
                key: W.passNumber,
                flexDirection: "column",
                marginRight: 1
            }, q4.createElement(V, null, "┌──────────┐"), q4.createElement(V, null, " ) CC ", q4.createElement(V, {
                color: "claude"
            }, "✻"), " ┊ ( "), q4.createElement(V, null, "└──────────┘"))
        };
    return q4.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, q4.createElement(V, {
        color: "permission"
    }, "Guest passes · ", j, " left"), q4.createElement(I, {
        flexDirection: "row",
        marginLeft: 2
    }, M.slice(0, 3).map((W) => P(W))), $ && q4.createElement(I, {
        marginLeft: 2
    }, q4.createElement(V, null, $)), q4.createElement(I, {
        flexDirection: "column",
        marginLeft: 2
    }, q4.createElement(V, {
        dimColor: !0
    }, _ ? `Share a free week of Claude Code with friends. If they love it and subscribe, you'll get ${Ee(_)} of extra usage to keep building. ` : "Share a free week of Claude Code with friends. ", q4.createElement(d7, {
        url: _ ? "https://support.claude.com/en/articles/13456702-claude-code-guest-passes" : "https://support.claude.com/en/articles/12875061-claude-code-guest-passes"
    }, "Terms apply."))), q4.createElement(I, null, q4.createElement(V, {
        dimColor: !0,
        italic: !0
    }, X.pending ? q4.createElement(q4.Fragment, null, "Press ", X.keyName, " again to exit") : q4.createElement(q4.Fragment, null, "Enter to copy link · Esc to cancel"))))
}
// @from(Ln 421106, Col 4)
q4
// @from(Ln 421106, Col 8)
OF
// @from(Ln 421107, Col 4)
azq = v(() => {
    m1();
    K7();
    Pc();
    y6();
    u6();
    OB();
    R2();
    q4 = o(X1(), 1), OF = o(X1(), 1)
})
// @from(Ln 421117, Col 4)
szq = {}
// @from(Ln 421121, Col 0)
async function T4z(A) {
    let K = !f6().hasVisitedPasses;
    if (K) {
        let Y = jN6();
        jA((z) => ({
            ...z,
            hasVisitedPasses: !0,
            passesLastSeenRemaining: Y ?? z.passesLastSeenRemaining
        }))
    }
    return c("tengu_guest_passes_visited", {
        is_first_visit: K
    }), EuA.createElement(ozq, {
        onDone: A
    })
}
// @from(Ln 421137, Col 4)
EuA
// @from(Ln 421138, Col 4)
tzq = v(() => {
    azq();
    cA();
    u6();
    Pc();
    EuA = o(X1(), 1)
})
// @from(Ln 421145, Col 4)
ezq
// @from(Ln 421146, Col 4)
A2q = v(() => {
    Pc();
    ezq = {
        type: "local-jsx",
        name: "passes",
        get description() {
            if (ke()) return "Share a free week of Claude Code with friends and earn extra usage";
            return "Share a free week of Claude Code with friends"
        },
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (tzq(), szq)),
        userFacingName() {
            return "passes"
        }
    }
})
// @from(Ln 421164, Col 0)
function q2q(A, q, K) {
    if (!A.success || !q.success) return !1;
    let Y = A.data,
        z = q.data;
    if (Y.grove_enabled !== null) return !1;
    if (K) return !0;
    if (!z.notice_is_grace_period) return !0;
    let H = z.notice_reminder_frequency;
    if (H !== null && Y.grove_notice_viewed_at) return Math.floor((Date.now() - new Date(Y.grove_notice_viewed_at).getTime()) / 86400000) >= H;
    else {
        let $ = Y.grove_notice_viewed_at;
        return $ === null || $ === void 0
    }
}
// @from(Ln 421179, Col 0)
function E4z() {
    let A = e(9),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = K4.default.createElement(V, null, "An update to our Consumer Terms and Privacy Policy will take effect on", " ", K4.default.createElement(V, {
        bold: !0
    }, "October 8, 2025"), ". You can accept the updated terms today."), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = K4.default.createElement(V, null, "What's changing?"), A[1] = K;
    else K = A[1];
    let Y, z;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) Y = K4.default.createElement(V, null, "• "), z = K4.default.createElement(V, {
        bold: !0
    }, "You can help improve Claude "), A[2] = Y, A[3] = z;
    else Y = A[2], z = A[3];
    let w;
    if (A[4] === Symbol.for("react.memo_cache_sentinel")) w = K4.default.createElement(I, {
        paddingLeft: 1
    }, K4.default.createElement(V, null, Y, z, K4.default.createElement(V, null, "— Allow the use of your chats and coding sessions to train and improve Anthropic AI models. Change anytime in your Privacy Settings (", K4.default.createElement(d7, {
        url: "https://claude.ai/settings/data-privacy-controls"
    }), ")."))), A[4] = w;
    else w = A[4];
    let H;
    if (A[5] === Symbol.for("react.memo_cache_sentinel")) H = K4.default.createElement(I, {
        flexDirection: "column"
    }, K, w, K4.default.createElement(I, {
        paddingLeft: 1
    }, K4.default.createElement(V, null, K4.default.createElement(V, null, "• "), K4.default.createElement(V, {
        bold: !0
    }, "Updates to data retention "), K4.default.createElement(V, null, "— To help us improve our AI models and safety protections, we're extending data retention to 5 years.")))), A[5] = H;
    else H = A[5];
    let $;
    if (A[6] === Symbol.for("react.memo_cache_sentinel")) $ = K4.default.createElement(d7, {
        url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
    }), A[6] = $;
    else $ = A[6];
    let O;
    if (A[7] === Symbol.for("react.memo_cache_sentinel")) O = K4.default.createElement(d7, {
        url: "https://anthropic.com/legal/terms"
    }), A[7] = O;
    else O = A[7];
    let _;
    if (A[8] === Symbol.for("react.memo_cache_sentinel")) _ = K4.default.createElement(K4.default.Fragment, null, q, H, K4.default.createElement(V, null, "Learn more (", $, ") or read the updated Consumer Terms (", O, ") and Privacy Policy (", K4.default.createElement(d7, {
        url: "https://anthropic.com/legal/privacy"
    }), ")")), A[8] = _;
    else _ = A[8];
    return _
}
// @from(Ln 421228, Col 0)
function k4z() {
    let A = e(7),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = K4.default.createElement(V, null, "We've updated our Consumer Terms and Privacy Policy."), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = K4.default.createElement(V, null, "What's changing?"), A[1] = K;
    else K = A[1];
    let Y;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) Y = K4.default.createElement(I, {
        flexDirection: "column"
    }, K4.default.createElement(V, {
        bold: !0
    }, "Help improve Claude"), K4.default.createElement(V, null, "Allow the use of your chats and coding sessions to train and improve Anthropic AI models. You can change this anytime in Privacy Settings"), K4.default.createElement(d7, {
        url: "https://claude.ai/settings/data-privacy-controls"
    })), A[2] = Y;
    else Y = A[2];
    let z;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) z = K4.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, K, Y, K4.default.createElement(I, {
        flexDirection: "column"
    }, K4.default.createElement(V, {
        bold: !0
    }, "How this affects data retention"), K4.default.createElement(V, null, "Turning ON the improve Claude setting extends data retention from 30 days to 5 years. Turning it OFF keeps the default 30-day data retention. Delete data anytime."))), A[3] = z;
    else z = A[3];
    let w;
    if (A[4] === Symbol.for("react.memo_cache_sentinel")) w = K4.default.createElement(d7, {
        url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
    }), A[4] = w;
    else w = A[4];
    let H;
    if (A[5] === Symbol.for("react.memo_cache_sentinel")) H = K4.default.createElement(d7, {
        url: "https://anthropic.com/legal/terms"
    }), A[5] = H;
    else H = A[5];
    let $;
    if (A[6] === Symbol.for("react.memo_cache_sentinel")) $ = K4.default.createElement(K4.default.Fragment, null, q, z, K4.default.createElement(V, null, "Learn more (", w, ") or read the updated Consumer Terms (", H, ") and Privacy Policy (", K4.default.createElement(d7, {
        url: "https://anthropic.com/legal/privacy"
    }), ")")), A[6] = $;
    else $ = A[6];
    return $
}
// @from(Ln 421273, Col 0)
function RN6(A) {
    let q = e(34),
        {
            showIfAlreadyViewed: K,
            location: Y,
            onDone: z
        } = A,
        [w, H] = K4.useState(null),
        [$, O] = K4.useState(null),
        _, J;
    if (q[0] !== Y || q[1] !== z || q[2] !== K) _ = () => {
        (async function() {
            let [g, U] = await Promise.all([VM1(), Ds()]), x = U.success ? U.data : null;
            O(x);
            let p = q2q(g, U, K);
            if (H(p), !p) {
                z("skip_rendering");
                return
            }
            MGA(), c("tengu_grove_policy_viewed", {
                location: Y,
                dismissable: x?.notice_is_grace_period
            })
        })()
    }, J = [K, Y, z], q[0] = Y, q[1] = z, q[2] = K, q[3] = _, q[4] = J;
    else _ = q[3], J = q[4];
    if (K4.useEffect(_, J), w === null) return null;
    if (!w) return null;
    let X;
    if (q[5] !== $?.notice_is_grace_period || q[6] !== z) X = async function(b) {
        A: switch (b) {
            case "accept_opt_in": {
                await dX6(!0), c("tengu_grove_policy_submitted", {
                    state: !0,
                    dismissable: $?.notice_is_grace_period
                });
                break A
            }
            case "accept_opt_out": {
                await dX6(!1), c("tengu_grove_policy_submitted", {
                    state: !1,
                    dismissable: $?.notice_is_grace_period
                });
                break A
            }
            case "defer": {
                c("tengu_grove_policy_dismissed", {
                    state: !0
                });
                break A
            }
            case "escape":
                c("tengu_grove_policy_escaped", {})
        }
        z(b)
    }, q[5] = $?.notice_is_grace_period, q[6] = z, q[7] = X;
    else X = q[7];
    let D = X,
        j;
    if (q[8] !== $?.domain_excluded) j = $?.domain_excluded ? [{
        label: "Accept terms • Help improve Claude: OFF (for emails with your domain)",
        value: "accept_opt_out"
    }] : [{
        label: "Accept terms • Help improve Claude: ON",
        value: "accept_opt_in"
    }, {
        label: "Accept terms • Help improve Claude: OFF",
        value: "accept_opt_out"
    }], q[8] = $?.domain_excluded, q[9] = j;
    else j = q[9];
    let M = j,
        P;
    if (q[10] !== $?.notice_is_grace_period || q[11] !== D) P = function() {
        if ($?.notice_is_grace_period) {
            D("defer");
            return
        }
        D("escape")
    }, q[10] = $?.notice_is_grace_period, q[11] = D, q[12] = P;
    else P = q[12];
    let W = P,
        G;
    if (q[13] !== $?.notice_is_grace_period) G = K4.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        flexGrow: 1
    }, $?.notice_is_grace_period ? K4.default.createElement(E4z, null) : K4.default.createElement(k4z, null)), q[13] = $?.notice_is_grace_period, q[14] = G;
    else G = q[14];
    let f;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) f = K4.default.createElement(I, {
        flexShrink: 0
    }, K4.default.createElement(V, {
        color: "professionalBlue"
    }, v4z)), q[15] = f;
    else f = q[15];
    let Z;
    if (q[16] !== G) Z = K4.default.createElement(I, {
        flexDirection: "row"
    }, G, f), q[16] = G, q[17] = Z;
    else Z = q[17];
    let N;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) N = K4.default.createElement(I, {
        flexDirection: "column"
    }, K4.default.createElement(V, {
        bold: !0
    }, "Please select how you'd like to continue"), K4.default.createElement(V, null, "Your choice takes effect immediately upon confirmation.")), q[18] = N;
    else N = q[18];
    let T;
    if (q[19] !== $?.notice_is_grace_period) T = $?.notice_is_grace_period ? [{
        label: "Not now",
        value: "defer"
    }] : [], q[19] = $?.notice_is_grace_period, q[20] = T;
    else T = q[20];
    let k;
    if (q[21] !== M || q[22] !== T) k = [...M, ...T], q[21] = M, q[22] = T, q[23] = k;
    else k = q[23];
    let y;
    if (q[24] !== D) y = (m) => D(m), q[24] = D, q[25] = y;
    else y = q[25];
    let B;
    if (q[26] !== W || q[27] !== k || q[28] !== y) B = K4.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, N, K4.default.createElement(kA, {
        options: k,
        onChange: y,
        onCancel: W
    })), q[26] = W, q[27] = k, q[28] = y, q[29] = B;
    else B = q[29];
    let S;
    if (q[30] !== W || q[31] !== B || q[32] !== Z) S = K4.default.createElement(w8, {
        title: "Updates to Consumer Terms and Policies",
        color: "professionalBlue",
        borderDimColor: !1,
        onCancel: W,
        inputGuide: L4z
    }, Z, B), q[30] = W, q[31] = B, q[32] = Z, q[33] = S;
    else S = q[33];
    return S
}
// @from(Ln 421414, Col 0)
function L4z(A) {
    return A.pending ? K4.default.createElement(V, null, "Press ", A.keyName, " again to exit") : K4.default.createElement(oA, null, K4.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), K4.default.createElement(YA, {
        shortcut: "Esc",
        action: "cancel"
    }))
}
// @from(Ln 421424, Col 0)
function K2q(A) {
    let q = e(17),
        {
            settings: K,
            domainExcluded: Y,
            onDone: z
        } = A,
        [w, H] = K4.useState(K.grove_enabled),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = [], q[0] = $;
    else $ = q[0];
    K4.default.useEffect(R4z, $);
    let O;
    if (q[1] !== Y || q[2] !== w) O = async (W, G) => {
        if (!Y && (G.tab || G.return || W === " ")) {
            let f = !w;
            H(f), await dX6(f)
        }
    }, q[1] = Y, q[2] = w, q[3] = O;
    else O = q[3];
    D8(O);
    let _;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) _ = K4.default.createElement(V, {
        color: "error"
    }, "false"), q[4] = _;
    else _ = q[4];
    let J = _;
    if (Y) {
        let W;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = K4.default.createElement(V, {
            color: "error"
        }, "false (for emails with your domain)"), q[5] = W;
        else W = q[5];
        J = W
    } else if (w) {
        let W;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = K4.default.createElement(V, {
            color: "success"
        }, "true"), q[6] = W;
        else W = q[6];
        J = W
    }
    let X;
    if (q[7] !== Y) X = (W) => W.pending ? K4.default.createElement(V, null, "Press ", W.keyName, " again to exit") : Y ? K4.default.createElement(YA, {
        shortcut: "Esc",
        action: "cancel"
    }) : K4.default.createElement(oA, null, K4.default.createElement(YA, {
        shortcut: "Enter/Tab/Space",
        action: "toggle"
    }), K4.default.createElement(YA, {
        shortcut: "Esc",
        action: "cancel"
    })), q[7] = Y, q[8] = X;
    else X = q[8];
    let D;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) D = K4.default.createElement(V, null, "Review and manage your privacy settings at", " ", K4.default.createElement(d7, {
        url: "https://claude.ai/settings/data-privacy-controls"
    })), q[9] = D;
    else D = q[9];
    let j;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) j = K4.default.createElement(I, {
        width: 44
    }, K4.default.createElement(V, {
        bold: !0
    }, "Help improve Claude")), q[10] = j;
    else j = q[10];
    let M;
    if (q[11] !== J) M = K4.default.createElement(I, null, j, K4.default.createElement(I, null, J)), q[11] = J, q[12] = M;
    else M = q[12];
    let P;
    if (q[13] !== z || q[14] !== X || q[15] !== M) P = K4.default.createElement(w8, {
        title: "Data Privacy",
        color: "professionalBlue",
        borderDimColor: !1,
        onCancel: z,
        inputGuide: X
    }, D, M), q[13] = z, q[14] = X, q[15] = M, q[16] = P;
    else P = q[16];
    return P
}
// @from(Ln 421505, Col 0)
function R4z() {
    c("tengu_grove_privacy_settings_viewed", {})
}
// @from(Ln 421508, Col 0)
async function Y2q() {
    let [A, q] = await Promise.all([VM1(), Ds()]);
    if (q2q(A, q, !1)) {
        let Y = q.success ? q.data : null;
        if (c("tengu_grove_print_viewed", {
                dismissable: Y?.notice_is_grace_period
            }), Y === null || Y.notice_is_grace_period) yl(`
An update to our Consumer Terms and Privacy Policy will take effect on October 8, 2025. Run \`claude\` to review the updated terms.

`), await MGA();
        else yl(`
[ACTION REQUIRED] An update to our Consumer Terms and Privacy Policy has taken effect on October 8, 2025. You must run \`claude\` to review the updated terms.

`), await nK(1)
    }
}
// @from(Ln 421524, Col 4)
K4
// @from(Ln 421524, Col 8)
v4z = ` _____________
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
// @from(Ln 421535, Col 4)
yN6 = v(() => {
    i1();
    m1();
    wY();
    u6();
    TM1();
    w$();
    m1();
    Bq();
    wK();
    HK();
    K4 = o(X1(), 1)
})
// @from(Ln 421548, Col 4)
w2q = {}
// @from(Ln 421552, Col 0)
async function y4z(A) {
    if (u8("privacy"), !await NM1()) return A(z2q), null;
    let [K, Y] = await Promise.all([VM1(), Ds()]);
    if (!K.success) return A(z2q), null;
    let z = K.data,
        w = Y.success ? Y.data : null;
    async function H(O) {
        if (O === "escape" || O === "defer") {
            A("Privacy settings dialog dismissed", {
                display: "system"
            });
            return
        }
        await $()
    }
    async function $() {
        let O = await VM1();
        if (!O.success) {
            A("Unable to retrieve updated privacy settings", {
                display: "system"
            });
            return
        }
        let _ = O.data,
            J = _.grove_enabled ? "true" : "false";
        if (A(`"Help improve Claude" set to ${J}.`), z.grove_enabled !== null && z.grove_enabled !== _.grove_enabled) c("tengu_grove_policy_toggled", {
            state: _.grove_enabled,
            location: "settings"
        })
    }
    if (z.grove_enabled !== null) return jd1.createElement(K2q, {
        settings: z,
        domainExcluded: w?.domain_excluded,
        onDone: $
    });
    return jd1.createElement(RN6, {
        showIfAlreadyViewed: !0,
        onDone: H,
        location: "settings"
    })
}
// @from(Ln 421593, Col 4)
jd1
// @from(Ln 421593, Col 9)
z2q = "Review and manage your privacy settings at https://claude.ai/settings/data-privacy-controls"
// @from(Ln 421594, Col 4)
H2q = v(() => {
    yN6();
    TM1();
    u6();
    v3();
    jd1 = o(X1(), 1)
})
// @from(Ln 421601, Col 4)
C4z
// @from(Ln 421601, Col 9)
$2q
// @from(Ln 421602, Col 4)
O2q = v(() => {
    J7();
    C4z = {
        type: "local-jsx",
        name: "privacy-settings",
        description: "View and update your privacy settings",
        isEnabled: () => {
            return jR1()
        },
        isHidden: !1,
        load: () => Promise.resolve().then(() => (H2q(), w2q)),
        userFacingName() {
            return "privacy-settings"
        }
    }, $2q = C4z
})
// @from(Ln 421619, Col 0)
function _2q({
    event: A,
    eventSummary: q,
    config: K,
    matcher: Y,
    onSuccess: z,
    onCancel: w
}) {
    let [H, $] = kuA.useState(!1), [O, _] = kuA.useState(null), J = lD1.map(s$A), X = async (D) => {
        $(!0), _(null);
        try {
            await uk7(A, K, Y, D), c("tengu_hook_created", {
                event: A,
                source: D,
                has_matcher: Y ? 1 : 0
            }), z()
        } catch (j) {
            _(j instanceof Error ? j.message : "Failed to add hook"), $(!1)
        }
    };
    if (H) return aY.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, aY.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, aY.createElement(c4, null), aY.createElement(V, null, "Adding hook configuration…")));
    if (O) return aY.createElement(w8, {
        title: "Failed to add hook",
        onCancel: w,
        color: "error",
        borderDimColor: !1
    }, aY.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, aY.createElement(V, null, O), aY.createElement(kA, {
        options: [{
            label: "OK",
            value: "ok"
        }],
        onChange: w
    })));
    return aY.createElement(w8, {
        title: "Save hook configuration",
        onCancel: w,
        borderDimColor: !1
    }, aY.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, aY.createElement(I, {
        flexDirection: "column",
        marginX: 2
    }, aY.createElement(V, null, "Event: ", A, " - ", q), aY.createElement(V, null, "Matcher: ", Y), aY.createElement(V, null, K.type === "command" ? "Command" : "Prompt", ":", " ", MZ(K))), aY.createElement(V, null, "Where should this hook be saved?"), aY.createElement(kA, {
        options: J,
        onChange: (D) => X(D),
        visibleOptionCount: 3
    })))
}
// @from(Ln 421677, Col 4)
aY
// @from(Ln 421677, Col 8)
kuA
// @from(Ln 421678, Col 4)
J2q = v(() => {
    m1();
    XB();
    U5();
    x2();
    jw6();
    Bq();
    u6();
    aY = o(X1(), 1), kuA = o(X1(), 1)
})
// @from(Ln 421689, Col 0)
function X2q(A) {
    let q = e(23),
        {
            hookEventMetadata: K,
            totalHooksCount: Y,
            configDifference: z,
            restrictedByPolicy: w,
            onSelectEvent: H,
            onCancel: $
        } = A,
        O = `${Y} hook${Y!==1?"s":""}`,
        _;
    if (q[0] !== w) _ = w && D$.createElement(I, {
        flexDirection: "column"
    }, D$.createElement(V, {
        color: "suggestion"
    }, l1.info, " Hooks Restricted by Policy"), D$.createElement(V, {
        dimColor: !0
    }, "Only hooks from managed settings can run. User-defined hooks from ~/.claude/settings.json, .claude/settings.json, and .claude/settings.local.json are blocked.")), q[0] = w, q[1] = _;
    else _ = q[1];
    let J;
    if (q[2] !== z) J = z && D$.createElement(I, {
        flexDirection: "column"
    }, D$.createElement(V, {
        color: "warning"
    }, l1.warning, " Settings Changed"), D$.createElement(V, {
        dimColor: !0
    }, "Hook settings have been modified outside of this menu. Review the following changes carefully:"), D$.createElement(V, {
        dimColor: !0
    }, z)), q[2] = z, q[3] = J;
    else J = q[3];
    let X;
    if (q[4] !== H) X = (f) => {
        if (f === "disable-all") H("disable-all");
        else H(f)
    }, q[4] = H, q[5] = X;
    else X = q[5];
    let D;
    if (q[6] !== K) D = Object.entries(K).map(S4z), q[6] = K, q[7] = D;
    else D = q[7];
    let j;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) j = {
        label: D$.createElement(V, {
            dimColor: !0
        }, "Disable all hooks"),
        value: "disable-all"
    }, q[8] = j;
    else j = q[8];
    let M;
    if (q[9] !== D) M = [...D, j], q[9] = D, q[10] = M;
    else M = q[10];
    let P;
    if (q[11] !== $ || q[12] !== X || q[13] !== M) P = D$.createElement(I, {
        flexDirection: "column"
    }, D$.createElement(kA, {
        onChange: X,
        onCancel: $,
        options: M
    })), q[11] = $, q[12] = X, q[13] = M, q[14] = P;
    else P = q[14];
    let W;
    if (q[15] !== _ || q[16] !== J || q[17] !== P) W = D$.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, _, J, P), q[15] = _, q[16] = J, q[17] = P, q[18] = W;
    else W = q[18];
    let G;
    if (q[19] !== $ || q[20] !== O || q[21] !== W) G = D$.createElement(w8, {
        title: "Hooks",
        subtitle: O,
        onCancel: $,
        borderDimColor: !1
    }, W), q[19] = $, q[20] = O, q[21] = W, q[22] = G;
    else G = q[22];
    return G
}
// @from(Ln 421766, Col 0)
function S4z(A) {
    let [q, K] = A;
    return {
        label: `${q} - ${K.summary}`,
        value: q
    }
}
// @from(Ln 421773, Col 4)
D$
// @from(Ln 421774, Col 4)
D2q = v(() => {
    i1();
    m1();
    U5();
    b7();
    Bq();
    D$ = o(X1(), 1)
})
// @from(Ln 421783, Col 0)
function j2q(A) {
    let q = e(27),
        {
            selectedEvent: K,
            matchersForSelectedEvent: Y,
            hooksByEventAndMatcher: z,
            eventDescription: w,
            onSelect: H,
            onCancel: $
        } = A,
        O;
    if (q[0] !== z || q[1] !== Y || q[2] !== K) {
        let Z;
        if (q[4] !== z || q[5] !== K) Z = (N) => {
            let T = z[K]?.[N] || [],
                k = Array.from(new Set(T.map(I4z)));
            return {
                matcher: N,
                sources: k,
                hookCount: T.length
            }
        }, q[4] = z, q[5] = K, q[6] = Z;
        else Z = q[6];
        O = Y.map(Z), q[0] = z, q[1] = Y, q[2] = K, q[3] = O
    } else O = q[3];
    let _ = O,
        J = `${K} - Tool Matchers`,
        X, D;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) X = {
        label: `+ Add new matcher${l1.ellipsis}`,
        value: "add-new"
    }, D = {
        label: "+ Match all (no filter)",
        value: "match-all"
    }, q[7] = X, q[8] = D;
    else X = q[7], D = q[8];
    let j;
    if (q[9] !== _) j = [X, D, ..._.map(h4z)], q[9] = _, q[10] = j;
    else j = q[10];
    let M;
    if (q[11] !== H) M = (Z) => {
        if (Z === "add-new") H(null);
        else if (Z === "match-all") H("");
        else H(Z)
    }, q[11] = H, q[12] = M;
    else M = q[12];
    let P;
    if (q[13] !== $ || q[14] !== j || q[15] !== M) P = cI.createElement(kA, {
        options: j,
        onChange: M,
        onCancel: $
    }), q[13] = $, q[14] = j, q[15] = M, q[16] = P;
    else P = q[16];
    let W;
    if (q[17] !== Y.length) W = Y.length === 0 && cI.createElement(I, {
        marginLeft: 2
    }, cI.createElement(V, {
        dimColor: !0
    }, "No matchers configured yet")), q[17] = Y.length, q[18] = W;
    else W = q[18];
    let G;
    if (q[19] !== P || q[20] !== W) G = cI.createElement(I, {
        flexDirection: "column"
    }, P, W), q[19] = P, q[20] = W, q[21] = G;
    else G = q[21];
    let f;
    if (q[22] !== w || q[23] !== $ || q[24] !== J || q[25] !== G) f = cI.createElement(w8, {
        title: J,
        subtitle: w,
        onCancel: $,
        borderDimColor: !1
    }, G), q[22] = w, q[23] = $, q[24] = J, q[25] = G, q[26] = f;
    else f = q[26];
    return f
}
// @from(Ln 421859, Col 0)
function h4z(A) {
    return {
        label: `[${A.sources.map(Fk7).join(", ")}] ${A.matcher}`,
        value: A.matcher,
        description: `${A.hookCount} hook${A.hookCount!==1?"s":""}`
    }
}
// @from(Ln 421867, Col 0)
function I4z(A) {
    return A.source
}
// @from(Ln 421870, Col 4)
cI
// @from(Ln 421871, Col 4)
M2q = v(() => {
    i1();
    m1();
    b7();
    XB();
    U5();
    Bq();
    cI = o(X1(), 1)
})
// @from(Ln 421881, Col 0)
function P2q(A) {
    let q = e(23),
        {
            selectedEvent: K,
            newMatcher: Y,
            onChangeNewMatcher: z,
            eventDescription: w,
            matcherMetadata: H,
            onCancel: $
        } = A,
        [O, _] = j$.useState(Y.length),
        J = `Add new matcher for ${K}`,
        X;
    if (q[0] !== H.fieldToMatch) X = j$.createElement(V, null, "Possible matcher values for field ", H.fieldToMatch, ":"), q[0] = H.fieldToMatch, q[1] = X;
    else X = q[1];
    let D;
    if (q[2] !== H.values) D = H.values.join(", "), q[2] = H.values, q[3] = D;
    else D = q[3];
    let j;
    if (q[4] !== D) j = j$.createElement(V, {
        dimColor: !0
    }, D), q[4] = D, q[5] = j;
    else j = q[5];
    let M;
    if (q[6] !== X || q[7] !== j) M = j$.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, X, j), q[6] = X, q[7] = j, q[8] = M;
    else M = q[8];
    let P;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) P = j$.createElement(V, null, "Matcher:"), q[9] = P;
    else P = q[9];
    let W;
    if (q[10] !== O || q[11] !== Y || q[12] !== z) W = j$.createElement(I, {
        flexDirection: "column"
    }, P, j$.createElement(I, {
        borderStyle: "round",
        borderDimColor: !0,
        paddingLeft: 1,
        paddingRight: 1
    }, j$.createElement(k3, {
        value: Y,
        onChange: z,
        columns: 78,
        showCursor: !0,
        cursorOffset: O,
        onChangeCursorOffset: _
    }))), q[10] = O, q[11] = Y, q[12] = z, q[13] = W;
    else W = q[13];
    let G;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) G = j$.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, j$.createElement(V, {
        dimColor: !0
    }, "Example Matchers:", `
`, "• Write (single tool)", `
`, "• Write|Edit (multiple tools)", `
`, "• Web.* (regex pattern)")), q[14] = G;
    else G = q[14];
    let f;
    if (q[15] !== M || q[16] !== W) f = j$.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, M, W, G), q[15] = M, q[16] = W, q[17] = f;
    else f = q[17];
    let Z;
    if (q[18] !== w || q[19] !== $ || q[20] !== J || q[21] !== f) Z = j$.createElement(w8, {
        title: J,
        subtitle: w,
        onCancel: $,
        borderDimColor: !1
    }, f), q[18] = w, q[19] = $, q[20] = J, q[21] = f, q[22] = Z;
    else Z = q[22];
    return Z
}
// @from(Ln 421957, Col 4)
j$
// @from(Ln 421958, Col 4)
W2q = v(() => {
    i1();
    m1();
    gO();
    Bq();
    j$ = o(X1(), 1)
})
// @from(Ln 421966, Col 0)
function G2q(A) {
    let q = e(38),
        {
            selectedEvent: K,
            selectedMatcher: Y,
            eventDescription: z,
            fullDescription: w,
            supportsMatcher: H,
            command: $,
            onChangeCommand: O,
            onCancel: _
        } = A,
        [J, X] = f3.useState($.length),
        {
            columns: D
        } = Z8(),
        j;
    if (q[0] !== $) {
        let r = $.trim().split(/\s+/)[0] || "";
        j = r && !r.startsWith("/") && !r.startsWith("~") && r.includes("/"), q[0] = $, q[1] = j
    } else j = q[1];
    let M = j,
        P;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) P = /\bsudo\b/, q[2] = P;
    else P = q[2];
    let W;
    if (q[3] !== $) W = P.test($), q[3] = $, q[4] = W;
    else W = q[4];
    let G = W,
        f;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) f = f3.createElement(I, {
        flexDirection: "column"
    }, f3.createElement(V, {
        dimColor: !0
    }, l1.info, " Hooks execute shell commands with your full user permissions. Only use hooks from trusted sources.", " ", f3.createElement(d7, {
        url: "https://code.claude.com/docs/en/hooks"
    }, "Learn more"))), q[5] = f;
    else f = q[5];
    let Z;
    if (q[6] !== K) Z = f3.createElement(V, {
        bold: !0
    }, K), q[6] = K, q[7] = Z;
    else Z = q[7];
    let N;
    if (q[8] !== z || q[9] !== Z) N = f3.createElement(V, null, "Event: ", Z, " - ", z), q[8] = z, q[9] = Z, q[10] = N;
    else N = q[10];
    let T;
    if (q[11] !== w) T = w && f3.createElement(I, null, f3.createElement(V, {
        dimColor: !0
    }, w)), q[11] = w, q[12] = T;
    else T = q[12];
    let k;
    if (q[13] !== Y || q[14] !== H) k = H && f3.createElement(V, null, "Matcher: ", f3.createElement(V, {
        bold: !0
    }, Y)), q[13] = Y, q[14] = H, q[15] = k;
    else k = q[15];
    let y;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) y = f3.createElement(V, null, "Command:"), q[16] = y;
    else y = q[16];
    let B = D - 8,
        S;
    if (q[17] !== $ || q[18] !== J || q[19] !== O || q[20] !== B) S = f3.createElement(I, {
        borderStyle: "round",
        borderDimColor: !0,
        paddingLeft: 1,
        paddingRight: 1
    }, f3.createElement(k3, {
        value: $,
        onChange: O,
        columns: B,
        showCursor: !0,
        cursorOffset: J,
        onChangeCursorOffset: X,
        multiline: !0
    })), q[17] = $, q[18] = J, q[19] = O, q[20] = B, q[21] = S;
    else S = q[21];
    let m;
    if (q[22] !== M || q[23] !== G) m = (M || G) && f3.createElement(I, {
        flexDirection: "column",
        gap: 0
    }, M && f3.createElement(V, {
        color: "warning"
    }, l1.warning, " Using a relative path for the executable may be insecure. Consider using an absolute path instead."), G && f3.createElement(V, {
        color: "warning"
    }, l1.warning, " Using sudo in hooks can be dangerous and may expose your system to security risks.")), q[22] = M, q[23] = G, q[24] = m;
    else m = q[24];
    let b;
    if (q[25] === Symbol.for("react.memo_cache_sentinel")) b = f3.createElement(LX, null), q[25] = b;
    else b = q[25];
    let g;
    if (q[26] === Symbol.for("react.memo_cache_sentinel")) g = f3.createElement(LX, null), q[26] = g;
    else g = q[26];
    let U;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) U = f3.createElement(LX, null), q[27] = U;
    else U = q[27];
    let x;
    if (q[28] === Symbol.for("react.memo_cache_sentinel")) x = f3.createElement(V, {
        dimColor: !0
    }, "Examples:", b, `• jq -r '.tool_input.file_path | select(endswith(".go"))' | xargs -r gofmt -w`, g, `• jq -r '"\\(.tool_input.command) - \\(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt`, U, "• /usr/local/bin/security_check.sh", f3.createElement(LX, null), "• python3 ~/hooks/validate_changes.py"), q[28] = x;
    else x = q[28];
    let p;
    if (q[29] !== S || q[30] !== m || q[31] !== N || q[32] !== T || q[33] !== k) p = f3.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, f, N, T, k, y, S, m, x), q[29] = S, q[30] = m, q[31] = N, q[32] = T, q[33] = k, q[34] = p;
    else p = q[34];
    let l;
    if (q[35] !== _ || q[36] !== p) l = f3.createElement(w8, {
        title: "Add new hook",
        onCancel: _,
        borderDimColor: !1
    }, p), q[35] = _, q[36] = p, q[37] = l;
    else l = q[37];
    return l
}
// @from(Ln 422081, Col 4)
f3
// @from(Ln 422082, Col 4)
Z2q = v(() => {
    i1();
    m1();
    gO();
    b7();
    m1();
    mq();
    Bq();
    f3 = o(X1(), 1)
})
// @from(Ln 422093, Col 0)
function f2q(A) {
    let q = e(21),
        {
            selectedMatcher: K,
            selectedEvent: Y,
            onDelete: z,
            onCancel: w
        } = A,
        H;
    if (q[0] !== K) H = zf.createElement(V, {
        bold: !0
    }, K), q[0] = K, q[1] = H;
    else H = q[1];
    let $;
    if (q[2] !== Y) $ = zf.createElement(V, {
        dimColor: !0
    }, "Event: ", Y), q[2] = Y, q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] !== H || q[5] !== $) O = zf.createElement(I, {
        flexDirection: "column",
        marginX: 2
    }, H, $), q[4] = H, q[5] = $, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) _ = zf.createElement(V, null, "This matcher has no hooks configured. Delete it?"), q[7] = _;
    else _ = q[7];
    let J;
    if (q[8] !== w || q[9] !== z) J = (P) => P === "yes" ? z() : w(), q[8] = w, q[9] = z, q[10] = J;
    else J = q[10];
    let X;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) X = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[11] = X;
    else X = q[11];
    let D;
    if (q[12] !== w || q[13] !== J) D = zf.createElement(kA, {
        onChange: J,
        onCancel: w,
        options: X
    }), q[12] = w, q[13] = J, q[14] = D;
    else D = q[14];
    let j;
    if (q[15] !== O || q[16] !== D) j = zf.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, O, _, D), q[15] = O, q[16] = D, q[17] = j;
    else j = q[17];
    let M;
    if (q[18] !== w || q[19] !== j) M = zf.createElement(w8, {
        title: "Delete matcher?",
        onCancel: w,
        borderDimColor: !1
    }, j), q[18] = w, q[19] = j, q[20] = M;
    else M = q[20];
    return M
}
// @from(Ln 422154, Col 4)
zf
// @from(Ln 422155, Col 4)
V2q = v(() => {
    i1();
    m1();
    U5();
    Bq();
    zf = o(X1(), 1)
})
// @from(Ln 422163, Col 0)
function N2q(A) {
    let q = e(20),
        {
            selectedEvent: K,
            selectedMatcher: Y,
            hooksForSelectedMatcher: z,
            hookEventMetadata: w,
            onSelect: H,
            onCancel: $
        } = A,
        O = w.matcherMetadata !== void 0 ? `${K} - Matcher: ${Y}` : K,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        label: `+ Add new hook${l1.ellipsis}`,
        value: "add-new"
    }, q[0] = _;
    else _ = q[0];
    let J;
    if (q[1] !== z) J = [_, ...z.map(x4z)], q[1] = z, q[2] = J;
    else J = q[2];
    let X;
    if (q[3] !== z || q[4] !== H) X = (W) => {
        if (W === "add-new") H(null);
        else {
            let G = parseInt(W, 10),
                f = z[G];
            if (f) H(f)
        }
    }, q[3] = z, q[4] = H, q[5] = X;
    else X = q[5];
    let D;
    if (q[6] !== $ || q[7] !== J || q[8] !== X) D = lI.createElement(kA, {
        options: J,
        onChange: X,
        onCancel: $
    }), q[6] = $, q[7] = J, q[8] = X, q[9] = D;
    else D = q[9];
    let j;
    if (q[10] !== z.length) j = z.length === 0 && lI.createElement(I, {
        marginLeft: 2
    }, lI.createElement(V, {
        dimColor: !0
    }, "No hooks configured yet")), q[10] = z.length, q[11] = j;
    else j = q[11];
    let M;
    if (q[12] !== D || q[13] !== j) M = lI.createElement(I, {
        flexDirection: "column"
    }, D, j), q[12] = D, q[13] = j, q[14] = M;
    else M = q[14];
    let P;
    if (q[15] !== w.description || q[16] !== $ || q[17] !== M || q[18] !== O) P = lI.createElement(w8, {
        title: O,
        subtitle: w.description,
        onCancel: $,
        borderDimColor: !1
    }, M), q[15] = w.description, q[16] = $, q[17] = M, q[18] = O, q[19] = P;
    else P = q[19];
    return P
}
// @from(Ln 422223, Col 0)
function x4z(A, q) {
    return {
        label: A.source === "pluginHook" ? `${MZ(A.config)} (read-only)` : MZ(A.config),
        value: q.toString(),
        description: A.source === "pluginHook" ? `${t$A(A.source)} - disable ${A.pluginName?A.pluginName:"plugin"} to remove` : t$A(A.source),
        disabled: A.source === "pluginHook"
    }
}
// @from(Ln 422231, Col 4)
lI
// @from(Ln 422232, Col 4)
T2q = v(() => {
    i1();
    b7();
    m1();
    XB();
    U5();
    Bq();
    lI = o(X1(), 1)
})
// @from(Ln 422242, Col 0)
function v2q(A) {
    let q = e(32),
        {
            selectedHook: K,
            eventSupportsMatcher: Y,
            onDelete: z,
            onCancel: w
        } = A,
        H;
    if (q[0] !== K.config) H = MZ(K.config), q[0] = K.config, q[1] = H;
    else H = q[1];
    let $;
    if (q[2] !== H) $ = H0.createElement(V, {
        bold: !0
    }, H), q[2] = H, q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] !== K.event) O = H0.createElement(V, {
        dimColor: !0
    }, "Event: ", K.event), q[4] = K.event, q[5] = O;
    else O = q[5];
    let _;
    if (q[6] !== Y || q[7] !== K.matcher) _ = Y && H0.createElement(V, {
        dimColor: !0
    }, "Matcher: ", K.matcher), q[6] = Y, q[7] = K.matcher, q[8] = _;
    else _ = q[8];
    let J;
    if (q[9] !== K.source) J = mk7(K.source), q[9] = K.source, q[10] = J;
    else J = q[10];
    let X;
    if (q[11] !== J) X = H0.createElement(V, {
        dimColor: !0
    }, J), q[11] = J, q[12] = X;
    else X = q[12];
    let D;
    if (q[13] !== $ || q[14] !== O || q[15] !== _ || q[16] !== X) D = H0.createElement(I, {
        flexDirection: "column",
        marginX: 2
    }, $, O, _, X), q[13] = $, q[14] = O, q[15] = _, q[16] = X, q[17] = D;
    else D = q[17];
    let j;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) j = H0.createElement(V, null, "This will remove the hook configuration from your settings."), q[18] = j;
    else j = q[18];
    let M;
    if (q[19] !== w || q[20] !== z) M = (Z) => Z === "yes" ? z() : w(), q[19] = w, q[20] = z, q[21] = M;
    else M = q[21];
    let P;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) P = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[22] = P;
    else P = q[22];
    let W;
    if (q[23] !== w || q[24] !== M) W = H0.createElement(kA, {
        onChange: M,
        onCancel: w,
        options: P
    }), q[23] = w, q[24] = M, q[25] = W;
    else W = q[25];
    let G;
    if (q[26] !== W || q[27] !== D) G = H0.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, D, j, W), q[26] = W, q[27] = D, q[28] = G;
    else G = q[28];
    let f;
    if (q[29] !== w || q[30] !== G) f = H0.createElement(w8, {
        title: "Delete hook?",
        onCancel: w,
        borderDimColor: !1
    }, G), q[29] = w, q[30] = G, q[31] = f;
    else f = q[31];
    return f
}
// @from(Ln 422319, Col 4)
H0
// @from(Ln 422320, Col 4)
E2q = v(() => {
    i1();
    m1();
    XB();
    U5();
    Bq();
    H0 = o(X1(), 1)
})
// @from(Ln 422329, Col 0)
function CN6(A, q) {
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
            PermissionRequest: {},
            Setup: {},
            TeammateIdle: {},
            TaskCompleted: {}
        },
        Y = Md1(q);
    bk7(A).forEach((w) => {
        let H = K[w.event];
        if (H) {
            let $ = Y[w.event].matcherMetadata !== void 0 ? w.matcher || "" : "";
            if (!H[$]) H[$] = [];
            H[$].push(w)
        }
    });
    let z = DN1();
    if (z)
        for (let [w, H] of Object.entries(z)) {
            let $ = w,
                O = K[$];
            if (!O) continue;
            for (let _ of H) {
                let J = _.matcher || "";
                for (let X of _.hooks)
                    if (X.type === "callback") {
                        if (!O[J]) O[J] = [];
                        O[J].push({
                            event: $,
                            config: {
                                type: "command",
                                command: "[Plugin Hook]"
                            },
                            matcher: _.matcher,
                            source: "pluginHook",
                            pluginName: _.pluginName
                        })
                    } else {
                        if (!O[J]) O[J] = [];
                        O[J].push({
                            event: $,
                            config: X,
                            matcher: _.matcher,
                            source: "pluginHook",
                            pluginName: _.pluginName
                        })
                    }
            }
        }
    return K
}
// @from(Ln 422392, Col 0)
function k2q(A, q) {
    let K = Object.keys(A[q] || {});
    return Qk7(K, A, q)
}
// @from(Ln 422397, Col 0)
function L2q(A, q, K) {
    let Y = K ?? "";
    return A[q]?.[Y] ?? []
}
// @from(Ln 422402, Col 0)
function Ce(A, q) {
    return Md1(q)[A].matcherMetadata
}
// @from(Ln 422406, Col 0)
function R2q(A, q) {
    return Md1(q)[A].summary
}
// @from(Ln 422409, Col 4)
Md1
// @from(Ln 422410, Col 4)
y2q = v(() => {
    zq();
    XB();
    B6();
    Md1 = KA(function(A) {
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
                    values: ["permission_prompt", "idle_prompt", "auth_success", "elicitation_dialog"]
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
                summary: "When a subagent (Task tool call) is started",
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
                summary: "Right before a subagent (Task tool call) concludes its response",
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
            }
        }
    })
})