
// @from(Ln 202718, Col 4)
KL8 = L(() => {
    o6();
    A3();
    I4();
    n5();
    g6();
    c7();
    Ef = K6(P6(), 1), RB1 = K6(P6(), 1);
    jc_ = RB1.memo(function(K) {
        let _ = s(39),
            {
                item: z,
                maxColumnWidth: Y,
                isSelected: A
            } = K,
            O = s1().columns;
        if ($c_(z.id)) {
            let h;
            if (_[0] !== z.id) h = wc_(z.id), _[0] = z.id, _[1] = h;
            else h = _[1];
            let C = h,
                x = A ? "suggestion" : void 0,
                B = !A,
                m = z.id.startsWith("file-"),
                S = z.id.startsWith("mcp-resource-"),
                F;
            if (_[2] !== z.id) F = z.id.startsWith("mcp-template-value::"), _[2] = z.id, _[3] = F;
            else F = _[3];
            let U = F,
                g = z.id.startsWith("mcp-template::"),
                c = z.description ? 3 : 0,
                n;
            if (m || g || U) {
                let e;
                if (_[4] !== z.description) e = z.description ? Math.min(20, N1(z.description)) : 0, _[4] = z.description, _[5] = e;
                else e = _[5];
                let i = e,
                    O6 = O - 2 - 4 - c - i,
                    J6;
                if (_[6] !== U || _[7] !== z.displayText || _[8] !== O6) J6 = U ? hY6(z.displayText, O6) : OF6(z.displayText, O6), _[6] = U, _[7] = z.displayText, _[8] = O6, _[9] = J6;
                else J6 = _[9];
                n = J6
            } else if (S) {
                let e;
                if (_[10] !== z.displayText) e = j4(z.displayText, 30), _[10] = z.displayText, _[11] = e;
                else e = _[11];
                n = e
            } else n = z.displayText;
            let l = O - 2 - N1(n) - c - 4,
                z6;
            if (z.description) {
                let e = Math.max(0, l),
                    i;
                if (_[12] !== z.description || _[13] !== e) i = j4(z.description.replace(/\s+/g, " "), e), _[12] = z.description, _[13] = e, _[14] = i;
                else i = _[14];
                z6 = `${C} ${n} – ${i}`
            } else z6 = `${C} ${n}`;
            let A6;
            if (_[15] !== B || _[16] !== z6 || _[17] !== x) A6 = Ef.createElement(T, {
                color: x,
                dimColor: B,
                wrap: "truncate"
            }, z6), _[15] = B, _[16] = z6, _[17] = x, _[18] = A6;
            else A6 = _[18];
            return A6
        }
        let $ = Math.floor(O * 0.4),
            j = Math.min(Y ?? N1(z.displayText) + 5, $),
            H = z.color || (A ? "suggestion" : void 0),
            J = !A,
            X = z.displayText;
        if (N1(X) > j - 2) {
            let h = j - 2,
                C;
            if (_[19] !== X || _[20] !== h) C = j4(X, h), _[19] = X, _[20] = h, _[21] = C;
            else C = _[21];
            X = C
        }
        let M = X + " ".repeat(Math.max(0, j - N1(X))),
            P = z.tag ? `[${z.tag}] ` : "",
            W = N1(P),
            D = Math.max(0, O - j - W - 4),
            Z;
        if (_[22] !== D || _[23] !== z.description) Z = z.description ? j4(z.description.replace(/\s+/g, " "), D) : "", _[22] = D, _[23] = z.description, _[24] = Z;
        else Z = _[24];
        let G = Z,
            f;
        if (_[25] !== M || _[26] !== J || _[27] !== H) f = Ef.createElement(T, {
            color: H,
            dimColor: J
        }, M), _[25] = M, _[26] = J, _[27] = H, _[28] = f;
        else f = _[28];
        let v;
        if (_[29] !== P) v = P ? Ef.createElement(T, {
            dimColor: !0
        }, P) : null, _[29] = P, _[30] = v;
        else v = _[30];
        let V = A ? "suggestion" : void 0,
            k = !A,
            N;
        if (_[31] !== V || _[32] !== k || _[33] !== G) N = Ef.createElement(T, {
            color: V,
            dimColor: k
        }, G), _[31] = V, _[32] = k, _[33] = G, _[34] = N;
        else N = _[34];
        let R;
        if (_[35] !== f || _[36] !== v || _[37] !== N) R = Ef.createElement(T, {
            wrap: "truncate"
        }, f, v, N), _[35] = f, _[36] = v, _[37] = N, _[38] = R;
        else R = _[38];
        return R
    });
    Hj4 = RB1.memo(ps6)
})
// @from(Ln 202833, Col 0)
function Jj4() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = u3.createElement(T, {
        dimColor: !0
    }, "Claude Code will be able to read files in this directory and make edits when auto-accept edits is on."), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 202843, Col 0)
function Mc_(q) {
    let K = s(5),
        {
            path: _
        } = q,
        z;
    if (K[0] !== _) z = u3.createElement(T, {
        color: "permission"
    }, _), K[0] = _, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) Y = u3.createElement(Jj4, null), K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== z) A = u3.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        gap: 1
    }, z, Y), K[3] = z, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 202866, Col 0)
function Pc_(q) {
    let K = s(14),
        {
            value: _,
            onChange: z,
            onSubmit: Y,
            error: A,
            suggestions: O,
            selectedSuggestion: w
        } = q,
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = u3.createElement(T, null, "Enter the path to the directory:"), K[0] = $;
    else $ = K[0];
    let j;
    if (K[1] !== z || K[2] !== Y || K[3] !== _) j = u3.createElement(u, {
        borderDimColor: !0,
        borderStyle: "round",
        marginY: 1,
        paddingLeft: 1
    }, u3.createElement(l4, {
        showCursor: !0,
        placeholder: `Directory path${e6.ellipsis}`,
        value: _,
        onChange: z,
        onSubmit: Y,
        columns: 80,
        cursorOffset: _.length,
        onChangeCursorOffset: Wc_
    })), K[1] = z, K[2] = Y, K[3] = _, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== w || K[6] !== O) H = O.length > 0 && u3.createElement(u, {
        marginBottom: 1
    }, u3.createElement(ps6, {
        suggestions: O,
        selectedSuggestion: w
    })), K[5] = w, K[6] = O, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] !== A) J = A && u3.createElement(T, {
        color: "error"
    }, A), K[8] = A, K[9] = J;
    else J = K[9];
    let X;
    if (K[10] !== j || K[11] !== H || K[12] !== J) X = u3.createElement(u, {
        flexDirection: "column"
    }, $, j, H, J), K[10] = j, K[11] = H, K[12] = J, K[13] = X;
    else X = K[13];
    return X
}
// @from(Ln 202917, Col 0)
function Wc_() {}
// @from(Ln 202919, Col 0)
function Fs6(q) {
    let K = s(34),
        {
            onAddDirectory: _,
            onCancel: z,
            permissionContext: Y,
            directoryPath: A
        } = q,
        [O, w] = Kj6.useState(""),
        [$, j] = Kj6.useState(null),
        H;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = [], K[0] = H;
    else H = K[0];
    let [J, X] = Kj6.useState(H), [M, P] = Kj6.useState(0), W;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) W = async (g) => {
        if (!g) {
            X([]), P(0);
            return
        }
        let c = await ly8(g);
        X(c), P(0)
    }, K[1] = W;
    else W = K[1];
    let Z = ra(W, 100),
        G, f;
    if (K[2] !== Z || K[3] !== O) G = () => {
        Z(O)
    }, f = [O, Z], K[2] = Z, K[3] = O, K[4] = G, K[5] = f;
    else G = K[4], f = K[5];
    Kj6.useEffect(G, f);
    let v;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) v = (g) => {
        let c = g.id + "/";
        w(c), j(null)
    }, K[6] = v;
    else v = K[6];
    let V = v,
        k;
    if (K[7] !== _ || K[8] !== Y) k = async (g) => {
        let c = await KE6(g, Y);
        if (c.resultType === "success") _(c.absolutePath, !1);
        else j(_E6(c))
    }, K[7] = _, K[8] = Y, K[9] = k;
    else k = K[9];
    let N = k,
        R;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) R = {
        context: "Settings"
    }, K[10] = R;
    else R = K[10];
    G1("confirm:no", z, R);
    let h;
    if (K[11] !== N || K[12] !== M || K[13] !== J) h = (g) => {
        if (J.length > 0) {
            if (g.key === "tab") {
                g.preventDefault();
                let c = J[M];
                if (c) V(c);
                return
            }
            if (g.key === "return") {
                g.preventDefault();
                let c = J[M];
                if (c) N(c.id + "/");
                return
            }
            if (g.key === "up" || g.ctrl && g.key === "p") {
                g.preventDefault(), P((c) => c <= 0 ? J.length - 1 : c - 1);
                return
            }
            if (g.key === "down" || g.ctrl && g.key === "n") {
                g.preventDefault(), P((c) => c >= J.length - 1 ? 0 : c + 1);
                return
            }
        }
    }, K[11] = N, K[12] = M, K[13] = J, K[14] = h;
    else h = K[14];
    let C = h,
        x;
    if (K[15] !== A || K[16] !== _ || K[17] !== z) x = (g) => {
        if (!A) return;
        let c = g;
        q: switch (c) {
            case "yes-session": {
                _(A, !1);
                break q
            }
            case "yes-remember": {
                _(A, !0);
                break q
            }
            case "no":
                z()
        }
    }, K[15] = A, K[16] = _, K[17] = z, K[18] = x;
    else x = K[18];
    let B = x,
        m = A ? void 0 : Dc_,
        S;
    if (K[19] !== O || K[20] !== A || K[21] !== $ || K[22] !== B || K[23] !== N || K[24] !== M || K[25] !== J) S = A ? u3.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, u3.createElement(Mc_, {
        path: A
    }), u3.createElement(A1, {
        options: Xc_,
        onChange: B,
        onCancel: () => B("no")
    })) : u3.createElement(u, {
        flexDirection: "column",
        gap: 1,
        marginX: 2
    }, u3.createElement(Jj4, null), u3.createElement(Pc_, {
        value: O,
        onChange: w,
        onSubmit: N,
        error: $,
        suggestions: J,
        selectedSuggestion: M
    })), K[19] = O, K[20] = A, K[21] = $, K[22] = B, K[23] = N, K[24] = M, K[25] = J, K[26] = S;
    else S = K[26];
    let F;
    if (K[27] !== z || K[28] !== m || K[29] !== S) F = u3.createElement(R1, {
        title: "Add directory to workspace",
        onCancel: z,
        color: "permission",
        isCancelActive: !1,
        inputGuide: m
    }, S), K[27] = z, K[28] = m, K[29] = S, K[30] = F;
    else F = K[30];
    let U;
    if (K[31] !== C || K[32] !== F) U = u3.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: C
    }, F), K[31] = C, K[32] = F, K[33] = U;
    else U = K[33];
    return U
}
// @from(Ln 203060, Col 0)
function Dc_(q) {
    return q.pending ? u3.createElement(T, null, "Press ", q.keyName, " again to exit") : u3.createElement(z1, null, u3.createElement(A8, {
        chord: "tab",
        action: "complete"
    }), u3.createElement(A8, {
        chord: "enter",
        action: "add"
    }), u3.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    }))
}
// @from(Ln 203074, Col 4)
u3
// @from(Ln 203074, Col 8)
Kj6
// @from(Ln 203074, Col 13)
Xc_
// @from(Ln 203075, Col 4)
SB1 = L(() => {
    o6();
    Qq();
    wk();
    gE8();
    NY();
    g6();
    C7();
    GB1();
    bK();
    gK();
    Nq();
    S4();
    u7();
    KL8();
    u3 = K6(P6(), 1), Kj6 = K6(P6(), 1), Xc_ = [{
        value: "yes-session",
        label: "Yes, for this session"
    }, {
        value: "yes-remember",
        label: "Yes, and remember this directory"
    }, {
        value: "no",
        label: "No"
    }]
})
// @from(Ln 203102, Col 0)
function Us6() {
    return E1("policySettings")?.allowManagedPermissionRulesOnly === !0
}
// @from(Ln 203106, Col 0)
function xI() {
    return !Us6()
}
// @from(Ln 203110, Col 0)
function fc_(q) {
    let K = Ww(q);
    if (!K) return null;
    try {
        let {
            resolvedPath: _
        } = vA(V8(), K), z = VV(_);
        if (z.trim() === "") return {};
        let Y = k5(z, !1);
        return Y && typeof Y === "object" ? Y : null
    } catch {
        return null
    }
}
// @from(Ln 203125, Col 0)
function Gc_(q, K) {
    if (!q || !q.permissions) return [];
    let {
        permissions: _
    } = q, z = [];
    for (let Y of Zc_) {
        let A = _[Y];
        if (A)
            for (let O of A) z.push({
                source: K,
                ruleBehavior: Y,
                ruleValue: h2(O)
            })
    }
    return z
}
// @from(Ln 203142, Col 0)
function _L8() {
    if (Us6()) return gs6("policySettings");
    let q = [];
    for (let K of Er()) q.push(...gs6(K));
    return q
}
// @from(Ln 203149, Col 0)
function gs6(q) {
    let K = E1(q);
    return Gc_(K, q)
}
// @from(Ln 203154, Col 0)
function Xj4(q) {
    if (!vc_.includes(q.source)) return !1;
    let K = I9(q.ruleValue),
        _ = E1(q.source);
    if (!_ || !_.permissions) return !1;
    let z = _.permissions[q.ruleBehavior];
    if (!z) return !1;
    let Y = (A) => I9(h2(A));
    if (!z.some((A) => Y(A) === K)) return !1;
    try {
        let A = {
                ..._,
                permissions: {
                    ..._.permissions,
                    [q.ruleBehavior]: z.filter((w) => Y(w) !== K)
                }
            },
            {
                error: O
            } = P7(q.source, A);
        if (O) return !1;
        return !0
    } catch (A) {
        return j6(A), !1
    }
}
// @from(Ln 203181, Col 0)
function Tc_() {
    return {
        permissions: {}
    }
}
// @from(Ln 203187, Col 0)
function Mj4({
    ruleValues: q,
    ruleBehavior: K
}, _) {
    if (Us6()) return !1;
    if (q.length < 1) return !0;
    let z = q.map(I9),
        Y = E1(_) || fc_(_) || Tc_();
    try {
        let A = Y.permissions || {},
            O = A[K] || [],
            w = new Set(O.map((J) => I9(h2(J)))),
            $ = z.filter((J) => !w.has(J));
        if ($.length === 0) return !0;
        let j = {
                ...Y,
                permissions: {
                    ...A,
                    [K]: [...O, ...$]
                }
            },
            H = P7(_, j);
        if (H.error) throw H.error;
        return !0
    } catch (A) {
        return j6(A), !1
    }
}
// @from(Ln 203215, Col 4)
Zc_
// @from(Ln 203215, Col 9)
vc_
// @from(Ln 203216, Col 4)
uI = L(() => {
    nN();
    Yq();
    mO();
    U8();
    aY();
    a1();
    cZ();
    Zc_ = ["allow", "deny", "ask"];
    vc_ = $v
})
// @from(Ln 203231, Col 0)
function gd(q) {
    if (!q) return [];
    return q.flatMap((K) => {
        switch (K.type) {
            case "addRules":
                return K.rules;
            default:
                return []
        }
    })
}
// @from(Ln 203243, Col 0)
function EY(q, K) {
    switch (K.type) {
        case "setMode":
            if (K.mode === "bypassPermissions" && !q.isBypassPermissionsModeAvailable) return E("Ignoring permission update: setMode 'bypassPermissions' rejected — mode is not available (disableBypassPermissionsMode set, or session not launched in bypassPermissions mode)"), q;
            return E(`Applying permission update: Setting mode to '${K.mode}'`), {
                ...q,
                mode: K.mode
            };
        case "addRules": {
            let _ = K.rules.map((Y) => I9(Y));
            E(`Applying permission update: Adding ${K.rules.length} ${K.behavior} rule(s) to destination '${K.destination}': ${I6(_)}`);
            let z = K.behavior === "allow" ? "alwaysAllowRules" : K.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...q,
                [z]: {
                    ...q[z],
                    [K.destination]: [...q[z][K.destination] || [], ..._]
                }
            }
        }
        case "replaceRules": {
            let _ = K.rules.map((Y) => I9(Y));
            E(`Replacing all ${K.behavior} rules for destination '${K.destination}' with ${K.rules.length} rule(s): ${I6(_)}`);
            let z = K.behavior === "allow" ? "alwaysAllowRules" : K.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...q,
                [z]: {
                    ...q[z],
                    [K.destination]: _
                }
            }
        }
        case "addDirectories": {
            E(`Applying permission update: Adding ${K.directories.length} director${K.directories.length===1?"y":"ies"} with destination '${K.destination}': ${I6(K.directories)}`);
            let _ = new Map(q.additionalWorkingDirectories);
            for (let z of K.directories) _.set(z, {
                path: z,
                source: K.destination
            });
            return {
                ...q,
                additionalWorkingDirectories: _
            }
        }
        case "removeRules": {
            let _ = K.rules.map((w) => I9(w));
            E(`Applying permission update: Removing ${K.rules.length} ${K.behavior} rule(s) from source '${K.destination}': ${I6(_)}`);
            let z = K.behavior === "allow" ? "alwaysAllowRules" : K.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
                Y = q[z][K.destination] || [],
                A = new Set(_),
                O = Y.filter((w) => !A.has(w));
            return {
                ...q,
                [z]: {
                    ...q[z],
                    [K.destination]: O
                }
            }
        }
        case "removeDirectories": {
            E(`Applying permission update: Removing ${K.directories.length} director${K.directories.length===1?"y":"ies"}: ${I6(K.directories)}`);
            let _ = new Map(q.additionalWorkingDirectories);
            for (let z of K.directories) _.delete(z);
            return {
                ...q,
                additionalWorkingDirectories: _
            }
        }
        default:
            return q
    }
}
// @from(Ln 203316, Col 0)
function Ky(q, K) {
    let _ = q;
    for (let z of K) _ = EY(_, z);
    return _
}
// @from(Ln 203322, Col 0)
function CB1(q) {
    return q === "localSettings" || q === "userSettings" || q === "projectSettings"
}
// @from(Ln 203326, Col 0)
function Ud(q) {
    if (!CB1(q.destination)) return;
    if (q.type === "setMode" && q.mode === "bypassPermissions") {
        E(`setMode:'bypassPermissions' is session-scoped; not persisting as defaultMode to ${q.destination}`);
        return
    }
    switch (E(`Persisting permission update: ${q.type} to source '${q.destination}'`), q.type) {
        case "addRules": {
            E(`Persisting ${q.rules.length} ${q.behavior} rule(s) to ${q.destination}`), Mj4({
                ruleValues: q.rules,
                ruleBehavior: q.behavior
            }, q.destination);
            break
        }
        case "addDirectories": {
            E(`Persisting ${q.directories.length} director${q.directories.length===1?"y":"ies"} to ${q.destination}`);
            let _ = E1(q.destination)?.permissions?.additionalDirectories || [],
                z = q.directories.filter((Y) => !_.includes(Y));
            if (z.length > 0) {
                let Y = [..._, ...z];
                P7(q.destination, {
                    permissions: {
                        additionalDirectories: Y
                    }
                })
            }
            break
        }
        case "removeRules": {
            E(`Removing ${q.rules.length} ${q.behavior} rule(s) from ${q.destination}`);
            let z = (E1(q.destination)?.permissions || {})[q.behavior] || [],
                Y = new Set(q.rules.map(I9)),
                A = z.filter((O) => {
                    let w = I9(h2(O));
                    return !Y.has(w)
                });
            P7(q.destination, {
                permissions: {
                    [q.behavior]: A
                }
            });
            break
        }
        case "removeDirectories": {
            E(`Removing ${q.directories.length} director${q.directories.length===1?"y":"ies"} from ${q.destination}`);
            let _ = E1(q.destination)?.permissions?.additionalDirectories || [],
                z = new Set(q.directories),
                Y = _.filter((A) => !z.has(A));
            P7(q.destination, {
                permissions: {
                    additionalDirectories: Y
                }
            });
            break
        }
        case "setMode": {
            E(`Persisting mode '${q.mode}' to ${q.destination}`), P7(q.destination, {
                permissions: {
                    defaultMode: q.mode
                }
            });
            break
        }
        case "replaceRules": {
            E(`Replacing all ${q.behavior} rules in ${q.destination} with ${q.rules.length} rule(s)`);
            let K = q.rules.map(I9);
            P7(q.destination, {
                permissions: {
                    [q.behavior]: K
                }
            });
            break
        }
    }
}
// @from(Ln 203402, Col 0)
function Hp(q) {
    for (let K of q) Ud(K)
}
// @from(Ln 203406, Col 0)
function _j6(q, K = "session") {
    let _ = Pj4(q);
    if (_ === "/") return;
    return {
        type: "addRules",
        rules: [{
            toolName: "Read",
            ruleContent: Vc_.isAbsolute(_) ? `/${_}/**` : `${_}/**`
        }],
        behavior: "allow",
        destination: K
    }
}
// @from(Ln 203419, Col 4)
MH = L(() => {
    K8();
    a1();
    e8();
    Sz();
    cZ();
    uI()
})
// @from(Ln 203428, Col 0)
function x7(q, K) {
    if (!process.env.SRT_DEBUG) return;
    let _ = K?.level || "info",
        z = "[SandboxDebug]";
    switch (_) {
        case "error":
            console.error(`${z} ${q}`);
            break;
        case "warn":
            console.warn(`${z} ${q}`);
            break;
        default:
            console.error(`${z} ${q}`)
    }
}
// @from(Ln 203455, Col 0)
function IB1(q) {
    let K = q?.http ?? process.env.HTTP_PROXY ?? process.env.http_proxy ?? void 0,
        _ = q?.https ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? K,
        z = q?.noProxy ?? process.env.NO_PROXY ?? process.env.no_proxy ?? "";
    if (!K && !_) return;
    let Y = (w) => {
            if (!w) return;
            let j = /^[a-z][a-z0-9+.-]*:\/\//i.test(w) ? w : `http://${w}`;
            try {
                let H = new bB1(j);
                if (H.protocol !== "http:" && H.protocol !== "https:" || !H.hostname) throw Error("unsupported scheme or empty host");
                return H
            } catch {
                x7(`Invalid parent proxy URL, ignoring: ${Lc_(w)}`, {
                    level: "error"
                });
                return
            }
        },
        A = Y(K),
        O = Y(_);
    if (!A && !O) return;
    return {
        httpUrl: A,
        httpsUrl: O,
        noProxy: Ec_(z)
    }
}
// @from(Ln 203484, Col 0)
function Ec_(q) {
    let K = {
        all: !1,
        suffixes: [],
        cidr: new Wj4
    };
    for (let _ of q.split(",")) {
        if (_ = _.trim(), !_) continue;
        if (_ === "*") {
            K.all = !0;
            continue
        }
        let z = _.indexOf("/");
        if (z !== -1) {
            let w = _.slice(0, z),
                $ = _.slice(z + 1),
                j = zj6(w);
            if (j && $ !== "" && /^\d+$/.test($)) {
                let H = Number($),
                    J = j === 6 ? 128 : 32;
                if (H >= 0 && H <= J) {
                    try {
                        K.cidr.addSubnet(w, H, j === 6 ? "ipv6" : "ipv4")
                    } catch {}
                    continue
                }
            }
            continue
        }
        let Y = _.toLowerCase(),
            A = /^\[([^\]]+)\](?::\d+)?$/.exec(Y);
        if (A) Y = A[1];
        if (Y.startsWith("*.")) Y = Y.slice(1);
        let O = zj6(Y);
        if (!O) {
            let w = Y.lastIndexOf(":");
            if (w !== -1 && /^\d+$/.test(Y.slice(w + 1))) Y = Y.slice(0, w)
        } else try {
            K.cidr.addAddress(Y, O === 6 ? "ipv6" : "ipv4");
            continue
        } catch {}
        K.suffixes.push(Y)
    }
    return K
}
// @from(Ln 203530, Col 0)
function Qs6(q, K) {
    let _ = Jp(K.toLowerCase().replace(/\.$/, ""));
    if (_ === "localhost") return !0;
    let z = zj6(_);
    if (z) {
        if (yc_.check(_, z === 6 ? "ipv6" : "ipv4")) return !0
    }
    if (q.noProxy.all) return !0;
    if (z) {
        if (q.noProxy.cidr.check(_, z === 6 ? "ipv6" : "ipv4")) return !0
    }
    for (let Y of q.noProxy.suffixes)
        if (Y.startsWith(".")) {
            if (_ === Y.slice(1) || _.endsWith(Y)) return !0
        } else if (_ === Y || _.endsWith("." + Y)) return !0;
    return !1
}
// @from(Ln 203548, Col 0)
function ds6(q, K) {
    if (K.isHttps) return q.httpsUrl ?? q.httpUrl;
    return q.httpUrl
}
// @from(Ln 203553, Col 0)
function xB1(q) {
    let {
        destHost: K,
        destPort: _
    } = q, z = Jp(K);
    if (!ls6(z)) return Promise.reject(Error(`Invalid destination host for CONNECT: ${JSON.stringify(K)}`));
    if (!Number.isInteger(_) || _ < 1 || _ > 65535) return Promise.reject(Error(`Invalid destination port: ${_}`));
    let Y = zj6(z) === 6 ? `[${z}]:${_}` : `${z}:${_}`;
    return new Promise((A, O) => {
        let w = q.dial(),
            $ = !1,
            j = (J) => {
                if ($) return;
                $ = !0, w.destroy(), O(J)
            },
            H = () => j(Error("Proxy closed during CONNECT handshake"));
        w.setTimeout(q.timeoutMs ?? Zj4, () => j(Error("CONNECT handshake timed out"))), w.once("error", j), w.once("close", H), w.once(q.readyEvent, () => {
            w.write(`CONNECT ${Y} HTTP/1.1\r
Host: ${Y}\r
` + (q.authHeader ? `Proxy-Authorization: ${q.authHeader}\r
` : "") + `\r
`);
            let J = "",
                X = (M) => {
                    J += M.toString("latin1");
                    let P = J.indexOf(`\r
\r
`);
                    if (P === -1) {
                        if (J.length > 16384) j(Error("CONNECT response header too large"));
                        return
                    }
                    w.pause(), w.removeListener("data", X);
                    let W = J.slice(0, J.indexOf(`\r
`));
                    if (!/^HTTP\/1\.[01] 2\d\d(?:\s|$)/.test(W)) return j(Error(`Proxy refused CONNECT: ${W.trim()}`));
                    let D = J.slice(P + 4);
                    if (D.length) w.unshift(Buffer.from(D, "latin1"));
                    $ = !0, w.setTimeout(0), w.removeListener("error", j), w.removeListener("close", H), A(w)
                };
            w.on("data", X)
        })
    })
}
// @from(Ln 203598, Col 0)
function zL8(q, K, _) {
    let z = Jp(q.hostname),
        Y = Number(q.port) || (q.protocol === "https:" ? 443 : 80),
        A = q.protocol === "https:";
    return xB1({
        destHost: K,
        destPort: _,
        authHeader: uB1(q),
        readyEvent: A ? "secureConnect" : "connect",
        dial: () => A ? kc_({
            host: z,
            port: Y,
            ...zj6(z) ? {} : {
                servername: z
            }
        }) : Dj4(Y, z)
    })
}
// @from(Ln 203617, Col 0)
function uB1(q) {
    if (!q.username && !q.password) return;
    try {
        let K = `${decodeURIComponent(q.username)}:${decodeURIComponent(q.password)}`;
        return `Basic ${Buffer.from(K).toString("base64")}`
    } catch {
        let K = `${q.username}:${q.password}`;
        return `Basic ${Buffer.from(K).toString("base64")}`
    }
}
// @from(Ln 203628, Col 0)
function cs6(q) {
    let K = new Set,
        _ = q.connection;
    if (_)
        for (let Y of String(_).split(",")) K.add(Y.trim().toLowerCase());
    let z = {};
    for (let [Y, A] of Object.entries(q)) {
        let O = Y.toLowerCase();
        if (!Nc_.has(O) && !K.has(O)) z[Y] = A
    }
    return z
}
// @from(Ln 203641, Col 0)
function Jp(q) {
    return q.startsWith("[") && q.endsWith("]") ? q.slice(1, -1) : q
}
// @from(Ln 203645, Col 0)
function mB1(q) {
    if (!q) return "-";
    if (!q.username && !q.password) return q.href;
    let K = new bB1(q.href);
    return K.username = "***", K.password = "***", K.href
}
// @from(Ln 203652, Col 0)
function Lc_(q) {
    return q.replace(/\/\/[^@/]*@/, "//***:***@")
}
// @from(Ln 203656, Col 0)
function ls6(q) {
    if (!q || q.length > 255) return !1;
    let K = Jp(q);
    if (K.includes("%")) return !1;
    if (zj6(K)) return !0;
    return /^[A-Za-z0-9._-]+$/.test(K)
}
// @from(Ln 203664, Col 0)
function fj4(q) {
    try {
        let K = Jp(q),
            _ = zj6(K) === 6 ? `[${K}]` : K,
            z = new bB1(`http://${_}/`).hostname;
        return Jp(z).replace(/\.$/, "")
    } catch {
        return
    }
}
// @from(Ln 203675, Col 0)
function YL8(q, K, _ = Zj4) {
    return new Promise((z, Y) => {
        let A = Dj4(K, q),
            O = !1,
            w = ($) => {
                if (O) return;
                if (O = !0, A.setTimeout(0), $) A.destroy(), Y($);
                else z(A)
            };
        A.setTimeout(_, () => w(Error("connect timed out"))), A.once("connect", () => w()), A.once("error", w), A.once("close", () => w(Error("socket closed before connect")))
    })
}
// @from(Ln 203687, Col 4)
Zj4 = 30000
// @from(Ln 203688, Col 4)
Nc_
// @from(Ln 203688, Col 9)
yc_
// @from(Ln 203689, Col 4)
AL8 = L(() => {
    Nc_ = new Set(["connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "proxy-connection", "te", "trailer", "transfer-encoding", "upgrade"]);
    yc_ = (() => {
        let q = new Wj4;
        return q.addSubnet("127.0.0.0", 8, "ipv4"), q.addAddress("::1", "ipv6"), q.addSubnet("::ffff:127.0.0.0", 104, "ipv6"), q
    })()
})
// @from(Ln 203713, Col 0)
function vj4(q) {
    let K = Rc_();
    return K.on("connect", async (_, z, Y) => {
        z.on("error", (O) => {
            x7(`Client socket error: ${O.message}`, {
                level: "error"
            })
        });
        let A = !1;
        z.once("close", () => {
            A = !0
        });
        try {
            let O = bc_(_.url);
            if (!O) {
                x7(`Invalid CONNECT request: ${_.url}`, {
                    level: "error"
                }), z.end(`HTTP/1.1 400 Bad Request\r
\r
`);
                return
            }
            let {
                hostname: w,
                port: $
            } = O;
            if (!await q.filter($, w, z)) {
                x7(`Connection blocked to ${w}:${$}`, {
                    level: "error"
                }), z.end(`HTTP/1.1 403 Forbidden\r
Content-Type: text/plain\r
X-Proxy-Error: blocked-by-allowlist\r
\r
Connection blocked by network allowlist`);
                return
            }
            let H = q.getMitmSocketPath?.(w),
                J = !H && q.parentProxy && !Qs6(q.parentProxy, w) ? ds6(q.parentProxy, {
                    isHttps: !0
                }) : void 0,
                X;
            try {
                if (H) x7(`Routing CONNECT ${w}:${$} through MITM proxy at ${H}`), X = await xB1({
                    dial: () => Sc_({
                        path: H
                    }),
                    readyEvent: "connect",
                    destHost: w,
                    destPort: $
                });
                else if (J) X = await zL8(J, w, $);
                else X = await YL8(w, $)
            } catch (M) {
                x7(`CONNECT tunnel failed: ${M.message}`, {
                    level: "error"
                }), z.end(`HTTP/1.1 502 Bad Gateway\r
\r
`);
                return
            }
            if (A) {
                X.on("error", () => {}), X.destroy();
                return
            }
            if (z.write(`HTTP/1.1 200 Connection Established\r
\r
`), Y.length) X.write(Y);
            X.pipe(z), z.pipe(X), X.on("error", (M) => {
                x7(`CONNECT tunnel failed: ${M.message}`, {
                    level: "error"
                }), z.destroy()
            }), z.on("close", () => X.destroy()), X.on("close", () => z.destroy())
        } catch (O) {
            x7(`Error handling CONNECT: ${O}`, {
                level: "error"
            }), z.end(`HTTP/1.1 500 Internal Server Error\r
\r
`)
        }
    }), K.on("request", async (_, z) => {
        try {
            let Y = new Cc_(_.url),
                A = Jp(Y.hostname),
                O = Y.port ? parseInt(Y.port, 10) : Y.protocol === "https:" ? 443 : 80;
            if (!await q.filter(O, A, _.socket)) {
                x7(`HTTP request blocked to ${A}:${O}`, {
                    level: "error"
                }), z.writeHead(403, {
                    "Content-Type": "text/plain",
                    "X-Proxy-Error": "blocked-by-allowlist"
                }), z.end("Connection blocked by network allowlist");
                return
            }
            if (_.socket.destroyed) return;
            let $ = {
                    ...cs6(_.headers),
                    host: Y.host
                },
                j = q.getMitmSocketPath?.(A),
                H = !j && q.parentProxy && !Qs6(q.parentProxy, A) ? ds6(q.parentProxy, {
                    isHttps: Y.protocol === "https:"
                }) : void 0,
                J = `${Y.protocol}//${Y.host}${Y.pathname}${Y.search}`,
                X;
            if (j) {
                x7(`Routing HTTP ${_.method} ${A}:${O} through MITM proxy at ${j}`);
                let M = new hc_({
                    socketPath: j
                });
                X = BB1({
                    agent: M,
                    path: J,
                    method: _.method,
                    headers: $
                }, (P) => {
                    z.writeHead(P.statusCode, cs6(P.headers)), P.pipe(z)
                })
            } else if (H) {
                let M = Jp(H.hostname),
                    P = Number(H.port) || (H.protocol === "https:" ? 443 : 80),
                    W = uB1(H);
                X = (H.protocol === "https:" ? Gj4 : BB1)({
                    hostname: M,
                    port: P,
                    path: J,
                    method: _.method,
                    headers: W ? {
                        ...$,
                        "proxy-authorization": W
                    } : $
                }, (Z) => {
                    z.writeHead(Z.statusCode, cs6(Z.headers)), Z.pipe(z)
                })
            } else X = (Y.protocol === "https:" ? Gj4 : BB1)({
                hostname: A,
                port: O,
                path: Y.pathname + Y.search,
                method: _.method,
                headers: $
            }, (P) => {
                z.writeHead(P.statusCode, cs6(P.headers)), P.pipe(z)
            });
            X.on("error", (M) => {
                if (x7(`Proxy request failed: ${M.message}`, {
                        level: "error"
                    }), !z.headersSent) z.writeHead(502, {
                    "Content-Type": "text/plain"
                }), z.end("Bad Gateway");
                else z.destroy()
            }), z.on("close", () => X.destroy()), _.pipe(X)
        } catch (Y) {
            if (x7(`Error handling HTTP request: ${Y}`, {
                    level: "error"
                }), !z.headersSent) z.writeHead(500, {
                "Content-Type": "text/plain"
            }), z.end("Internal Server Error");
            else z.destroy()
        }
    }), K
}
// @from(Ln 203874, Col 0)
function bc_(q) {
    let K = /^\[([^\]]+)\]:(\d+)$/.exec(q) ?? /^([^:]+):(\d+)$/.exec(q);
    if (!K) return;
    let _ = Number(K[2]);
    if (!Number.isInteger(_) || _ < 1 || _ > 65535) return;
    return {
        hostname: K[1],
        port: _
    }
}
// @from(Ln 203884, Col 4)
Tj4 = L(() => {
    AL8()
})
// @from(Ln 203887, Col 4)
hj4 = p((qjw, Lj4) => {
    var {
        create: Ic_,
        defineProperty: OL8,
        getOwnPropertyDescriptor: xc_,
        getOwnPropertyNames: uc_,
        getPrototypeOf: mc_
    } = Object, Bc_ = Object.prototype.hasOwnProperty, pc_ = (q, K) => {
        for (var _ in K) OL8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Vj4 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of uc_(K))
                if (!Bc_.call(q, Y) && Y !== _) OL8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = xc_(K, Y)) || z.enumerable
                })
        }
        return q
    }, kj4 = (q, K, _) => (_ = q != null ? Ic_(mc_(q)) : {}, Vj4(K || !q || !q.__esModule ? OL8(_, "default", {
        value: q,
        enumerable: !0
    }) : _, q)), Fc_ = (q) => Vj4(OL8({}, "__esModule", {
        value: !0
    }), q), Nj4 = {};
    pc_(Nj4, {
        Socks5Server: () => yj4,
        createServer: () => dc_,
        defaultConnectionHandler: () => FB1
    });
    Lj4.exports = Fc_(Nj4);
    var gc_ = kj4(d6("net")),
        Ej4 = ((q) => {
            return q[q.connect = 1] = "connect", q[q.bind = 2] = "bind", q[q.udp = 3] = "udp", q
        })(Ej4 || {}),
        pB1 = ((q) => {
            return q[q.REQUEST_GRANTED = 0] = "REQUEST_GRANTED", q[q.GENERAL_FAILURE = 1] = "GENERAL_FAILURE", q[q.CONNECTION_NOT_ALLOWED = 2] = "CONNECTION_NOT_ALLOWED", q[q.NETWORK_UNREACHABLE = 3] = "NETWORK_UNREACHABLE", q[q.HOST_UNREACHABLE = 4] = "HOST_UNREACHABLE", q[q.CONNECTION_REFUSED = 5] = "CONNECTION_REFUSED", q[q.TTL_EXPIRED = 6] = "TTL_EXPIRED", q[q.COMMAND_NOT_SUPPORTED = 7] = "COMMAND_NOT_SUPPORTED", q[q.ADDRESS_TYPE_NOT_SUPPORTED = 8] = "ADDRESS_TYPE_NOT_SUPPORTED", q
        })(pB1 || {}),
        Uc_ = class {
            constructor(q, K) {
                this.errorHandler = () => {}, this.metadata = {}, this.socket = K, this.server = q, K.on("error", this.errorHandler), K.pause(), this.handleGreeting()
            }
            readBytes(q) {
                return new Promise((K) => {
                    let _ = Buffer.allocUnsafe(q),
                        z = 0,
                        Y = (A) => {
                            let O = Math.min(A.length, q - z);
                            if (A.copy(_, z, 0, O), z += O, z < q) return;
                            this.socket.removeListener("data", Y), this.socket.push(A.subarray(O)), K(_), this.socket.pause()
                        };
                    this.socket.on("data", Y), this.socket.resume()
                })
            }
            async handleGreeting() {
                if ((await this.readBytes(1)).readUInt8() !== 5) return this.socket.destroy();
                let K = (await this.readBytes(1)).readUInt8();
                if (K > 128 || K === 0) return this.socket.destroy();
                let _ = await this.readBytes(K),
                    z = this.server.authHandler ? 2 : 0;
                if (!_.includes(z)) return this.socket.write(Buffer.from([5, 255])), this.socket.destroy();
                if (this.socket.write(Buffer.from([5, z])), this.server.authHandler) this.handleUserPassword();
                else this.handleConnectionRequest()
            }
            async handleUserPassword() {
                await this.readBytes(1);
                let q = (await this.readBytes(1)).readUint8(),
                    K = (await this.readBytes(q)).toString(),
                    _ = (await this.readBytes(1)).readUint8(),
                    z = (await this.readBytes(_)).toString();
                this.username = K, this.password = z;
                let Y = !1,
                    A = () => {
                        if (Y) return;
                        Y = !0, this.socket.write(Buffer.from([1, 0])), this.handleConnectionRequest()
                    },
                    O = () => {
                        if (Y) return;
                        Y = !0, this.socket.write(Buffer.from([1, 1])), this.socket.destroy()
                    },
                    w = await this.server.authHandler(this, A, O);
                if (w === !0) A();
                else if (w === !1) O()
            }
            async handleConnectionRequest() {
                await this.readBytes(1);
                let q = (await this.readBytes(1))[0],
                    K = Ej4[q];
                if (!K) return this.socket.destroy();
                this.command = K, await this.readBytes(1);
                let _ = (await this.readBytes(1)).readUInt8(),
                    z = "";
                switch (_) {
                    case 1:
                        z = (await this.readBytes(4)).join(".");
                        break;
                    case 3:
                        let j = (await this.readBytes(1)).readUInt8();
                        z = (await this.readBytes(j)).toString();
                        break;
                    case 4:
                        let H = await this.readBytes(16);
                        for (let J = 0; J < 16; J++) {
                            if (J % 2 === 0 && J > 0) z += ":";
                            z += `${H[J]<16?"0":""}${H[J].toString(16)}`
                        }
                        break;
                    default:
                        this.socket.destroy();
                        return
                }
                let Y = (await this.readBytes(2)).readUInt16BE();
                if (!this.server.supportedCommands.has(K)) return this.socket.write(Buffer.from([5, 7])), this.socket.destroy();
                this.destAddress = z, this.destPort = Y;
                let A = !1,
                    O = () => {
                        if (A) return;
                        A = !0, this.connect()
                    };
                if (!this.server.rulesetValidator) return O();
                let w = () => {
                        if (A) return;
                        A = !0, this.socket.write(Buffer.from([5, 2, 0, 1, 0, 0, 0, 0, 0, 0])), this.socket.destroy()
                    },
                    $ = await this.server.rulesetValidator(this, O, w);
                if ($ === !0) O();
                else if ($ === !1) w()
            }
            connect() {
                this.socket.removeListener("error", this.errorHandler), this.server.connectionHandler(this, (q) => {
                    if (pB1[q] === void 0) throw Error(`"${q}" is not a valid status.`);
                    if (this.socket.write(Buffer.from([5, pB1[q], 0, 1, 0, 0, 0, 0, 0, 0])), q !== "REQUEST_GRANTED") this.socket.destroy()
                }), this.socket.resume()
            }
        },
        Qc_ = kj4(d6("net"));

    function FB1(q, K) {
        if (q.command !== "connect") return K("COMMAND_NOT_SUPPORTED");
        q.socket.on("error", () => {});
        let _ = Qc_.default.createConnection({
            host: q.destAddress,
            port: q.destPort
        });
        _.setNoDelay();
        let z = !1;
        return _.on("error", (Y) => {
            if (!z) switch (Y.code) {
                case "EINVAL":
                case "ENOENT":
                case "ENOTFOUND":
                case "ETIMEDOUT":
                case "EADDRNOTAVAIL":
                case "EHOSTUNREACH":
                    K("HOST_UNREACHABLE");
                    break;
                case "ENETUNREACH":
                    K("NETWORK_UNREACHABLE");
                    break;
                case "ECONNREFUSED":
                    K("CONNECTION_REFUSED");
                    break;
                default:
                    K("GENERAL_FAILURE")
            }
        }), _.on("ready", () => {
            z = !0, K("REQUEST_GRANTED"), q.socket.pipe(_).pipe(q.socket)
        }), q.socket.on("close", () => _.destroy()), _
    }
    var yj4 = class {
        constructor() {
            this.supportedCommands = new Set(["connect"]), this.connectionHandler = FB1, this.server = gc_.default.createServer((q) => {
                q.setNoDelay(), this._handleConnection(q)
            })
        }
        listen(...q) {
            return this.server.listen(...q), this
        }
        close(q) {
            return this.server.close(q), this
        }
        setAuthHandler(q) {
            return this.authHandler = q, this
        }
        disableAuthHandler() {
            return this.authHandler = void 0, this
        }
        setRulesetValidator(q) {
            return this.rulesetValidator = q, this
        }
        disableRulesetValidator() {
            return this.rulesetValidator = void 0, this
        }
        setConnectionHandler(q) {
            return this.connectionHandler = q, this
        }
        useDefaultConnectionHandler() {
            return this.connectionHandler = FB1, this
        }
        _handleConnection(q) {
            return new Uc_(this, q), this
        }
    };

    function dc_(q) {
        let K = new yj4;
        if (q?.auth) K.setAuthHandler((_) => {
            return _.username === q.auth.username && _.password === q.auth.password
        });
        if (q?.port) K.listen(q.port, q.hostname);
        return K
    }
})
// @from(Ln 204103, Col 0)
function Sj4(q) {
    let K = Rj4.createServer();
    return K.setRulesetValidator(async (_) => {
        try {
            let {
                destAddress: z,
                destPort: Y
            } = _;
            if (!ls6(z)) return x7(`Rejecting malformed SOCKS host: ${JSON.stringify(z)}`, {
                level: "error"
            }), !1;
            if (x7(`Connection request to ${z}:${Y}`), !await q.filter(Y, z)) return x7(`Connection blocked to ${z}:${Y}`, {
                level: "error"
            }), !1;
            return x7(`Connection allowed to ${z}:${Y}`), !0
        } catch (z) {
            return x7(`Error validating connection: ${z}`, {
                level: "error"
            }), !1
        }
    }), K.setConnectionHandler((_, z) => {
        let {
            destAddress: Y,
            destPort: A
        } = _, O = !1, w;
        _.socket.once("close", () => {
            O = !0, w?.destroy()
        }), _.socket.on("error", () => w?.destroy());
        let $ = q.parentProxy && !Qs6(q.parentProxy, Y) ? ds6(q.parentProxy, {
            isHttps: !0
        }) : void 0;
        ($ ? zL8($, Y, A) : YL8(Y, A)).then((H) => {
            if (w = H, H.on("error", () => _.socket.destroy()), O) {
                H.destroy();
                return
            }
            z("REQUEST_GRANTED"), H.pipe(_.socket), _.socket.pipe(H), H.on("close", () => _.socket.destroy())
        }).catch((H) => {
            if (x7(`SOCKS connect to ${Y}:${A} failed: ${H.message}`, {
                    level: "error"
                }), !O) try {
                z("HOST_UNREACHABLE")
            } catch {}
        })
    }), {
        server: K,
        getPort() {
            try {
                let _ = K?.server;
                if (_ && typeof _?.address === "function") {
                    let z = _.address();
                    if (z && typeof z === "object" && "port" in z) return z.port
                }
            } catch (_) {
                x7(`Error getting port: ${_}`, {
                    level: "error"
                })
            }
            return
        },
        listen(_, z) {
            return new Promise((Y, A) => {
                let O = K?.server;
                O?.once("error", A);
                let w = () => {
                    O?.removeListener("error", A);
                    let $ = this.getPort();
                    if ($) x7(`SOCKS proxy listening on ${z}:${$}`), Y($);
                    else A(Error("Failed to get SOCKS proxy server port"))
                };
                K.listen(_, z, w)
            })
        },
        async close() {
            return new Promise((_, z) => {
                K.close((Y) => {
                    if (Y) {
                        let A = Y.message?.toLowerCase() || "";
                        if (!(A.includes("not running") || A.includes("already closed") || A.includes("not listening"))) {
                            z(Y);
                            return
                        }
                    }
                    _()
                })
            })
        },
        unref() {
            try {
                let _ = K?.server;
                if (_ && typeof _?.unref === "function") _.unref()
            } catch (_) {
                x7(`Error calling unref: ${_}`, {
                    level: "error"
                })
            }
        }
    }
}
// @from(Ln 204202, Col 4)
Rj4
// @from(Ln 204203, Col 4)
Cj4 = L(() => {
    AL8();
    Rj4 = K6(hj4(), 1)
})
// @from(Ln 204211, Col 0)
function ws(q) {
    if (typeof globalThis.Bun < "u") return globalThis.Bun.which(q);
    let K = cc_("which", [q], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 1000
    });
    if (K.status === 0 && K.stdout) return K.stdout.trim();
    return null
}
// @from(Ln 204221, Col 4)
ns6 = () => {}
// @from(Ln 204224, Col 0)
function gB1() {
    if (process.platform !== "linux") return;
    try {
        let q = bj4.readFileSync("/proc/version", {
                encoding: "utf8"
            }),
            K = q.match(/WSL(\d+)/i);
        if (K && K[1]) return K[1];
        if (q.toLowerCase().includes("microsoft")) return "1";
        return
    } catch {
        return
    }
}
// @from(Ln 204239, Col 0)
function nv() {
    switch (process.platform) {
        case "darwin":
            return "macos";
        case "linux":
            return "linux";
        case "win32":
            return "windows";
        default:
            return "unknown"
    }
}
// @from(Ln 204251, Col 4)
wL8 = () => {}
// @from(Ln 204252, Col 4)
xj4 = p((jjw, Ij4) => {
    Ij4.exports = function(K) {
        return K.map(function(_) {
            if (_ === "") return "''";
            if (_ && typeof _ === "object") return _.op.replace(/(.)/g, "\\$1");
            if (/["\s\\]/.test(_) && !/'/.test(_)) return "'" + _.replace(/(['])/g, "\\$1") + "'";
            if (/["'\s]/.test(_)) return '"' + _.replace(/(["\\$`!])/g, "\\$1") + '"';
            return String(_).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2")
        }).join(" ")
    }
})
// @from(Ln 204263, Col 4)
Uj4 = p((Hjw, gj4) => {
    var Fj4 = "(?:" + ["\\|\\|", "\\&\\&", ";;", "\\|\\&", "\\<\\(", "\\<\\<\\<", ">>", ">\\&", "<\\&", "[&;()|<>]"].join("|") + ")",
        uj4 = new RegExp("^" + Fj4 + "$"),
        mj4 = "|&;()<> \\t",
        lc_ = '"((\\\\"|[^"])*?)"',
        nc_ = "'((\\\\'|[^'])*?)'",
        ic_ = /^#$/,
        Bj4 = "'",
        pj4 = '"',
        UB1 = "$",
        Yj6 = "",
        rc_ = 4294967296;
    for ($L8 = 0; $L8 < 4; $L8++) Yj6 += (rc_ * Math.random()).toString(16);
    var $L8, oc_ = new RegExp("^" + Yj6);

    function ac_(q, K) {
        var _ = K.lastIndex,
            z = [],
            Y;
        while (Y = K.exec(q))
            if (z.push(Y), K.lastIndex === Y.index) K.lastIndex += 1;
        return K.lastIndex = _, z
    }

    function sc_(q, K, _) {
        var z = typeof q === "function" ? q(_) : q[_];
        if (typeof z > "u" && _ != "") z = "";
        else if (typeof z > "u") z = "$";
        if (typeof z === "object") return K + Yj6 + JSON.stringify(z) + Yj6;
        return K + z
    }

    function tc_(q, K, _) {
        if (!_) _ = {};
        var z = _.escape || "\\",
            Y = "(\\" + z + `['"` + mj4 + `]|[^\\s'"` + mj4 + "])+",
            A = new RegExp(["(" + Fj4 + ")", "(" + Y + "|" + lc_ + "|" + nc_ + ")+"].join("|"), "g"),
            O = ac_(q, A);
        if (O.length === 0) return [];
        if (!K) K = {};
        var w = !1;
        return O.map(function($) {
            var j = $[0];
            if (!j || w) return;
            if (uj4.test(j)) return {
                op: j
            };
            var H = !1,
                J = !1,
                X = "",
                M = !1,
                P;

            function W() {
                P += 1;
                var G, f, v = j.charAt(P);
                if (v === "{") {
                    if (P += 1, j.charAt(P) === "}") throw Error("Bad substitution: " + j.slice(P - 2, P + 1));
                    if (G = j.indexOf("}", P), G < 0) throw Error("Bad substitution: " + j.slice(P));
                    f = j.slice(P, G), P = G
                } else if (/[*@#?$!_-]/.test(v)) f = v, P += 1;
                else {
                    var V = j.slice(P);
                    if (G = V.match(/[^\w\d_]/), !G) f = V, P = j.length;
                    else f = V.slice(0, G.index), P += G.index - 1
                }
                return sc_(K, "", f)
            }
            for (P = 0; P < j.length; P++) {
                var D = j.charAt(P);
                if (M = M || !H && (D === "*" || D === "?"), J) X += D, J = !1;
                else if (H)
                    if (D === H) H = !1;
                    else if (H == Bj4) X += D;
                else if (D === z)
                    if (P += 1, D = j.charAt(P), D === pj4 || D === z || D === UB1) X += D;
                    else X += z + D;
                else if (D === UB1) X += W();
                else X += D;
                else if (D === pj4 || D === Bj4) H = D;
                else if (uj4.test(D)) return {
                    op: j
                };
                else if (ic_.test(D)) {
                    w = !0;
                    var Z = {
                        comment: q.slice($.index + P + 1)
                    };
                    if (X.length) return [X, Z];
                    return [Z]
                } else if (D === z) J = !0;
                else if (D === UB1) X += W();
                else X += D
            }
            if (M) return {
                op: "glob",
                pattern: X
            };
            return X
        }).reduce(function($, j) {
            return typeof j > "u" ? $ : $.concat(j)
        }, [])
    }
    gj4.exports = function(K, _, z) {
        var Y = tc_(K, _, z);
        if (typeof _ !== "function") return Y;
        return Y.reduce(function(A, O) {
            if (typeof O === "object") return A.concat(O);
            var w = O.split(RegExp("(" + Yj6 + ".*?" + Yj6 + ")", "g"));
            if (w.length === 1) return A.concat(w[0]);
            return A.concat(w.filter(Boolean).map(function($) {
                if (oc_.test($)) return JSON.parse($.split(Yj6)[1]);
                return $
            }))
        }, [])
    }
})
// @from(Ln 204380, Col 4)
QB1 = p((ec_) => {
    ec_.quote = xj4();
    ec_.parse = Uj4()
})
// @from(Ln 204390, Col 0)
async function dj4(q, K, _, z = {
    command: "rg"
}) {
    let {
        command: Y,
        args: A = [],
        argv0: O
    } = z, w = _l_(Y, [...A, ...q, K], {
        argv0: O,
        signal: _,
        timeout: 1e4,
        windowsHide: !0
    }), [$, j, H] = await Promise.all([Qj4(w.stdout), Qj4(w.stderr), new Promise((J, X) => {
        w.on("close", J), w.on("error", X)
    })]);
    if (H === 0) return $.trim().split(`
`).filter(Boolean);
    if (H === 1) return [];
    throw Error(`ripgrep failed with exit code ${H}: ${j}`)
}
// @from(Ln 204410, Col 4)
cj4 = L(() => {
    ns6()
})
// @from(Ln 204419, Col 0)
function HL8() {
    return [...zl_.filter((q) => q !== ".git"), ".claude/commands", ".claude/agents"]
}
// @from(Ln 204423, Col 0)
function cB1(q) {
    return q.toLowerCase()
}
// @from(Ln 204427, Col 0)
function yf(q) {
    return q.includes("*") || q.includes("?") || q.includes("[") || q.includes("]")
}
// @from(Ln 204431, Col 0)
function $s(q) {
    return q.replace(/\/\*\*$/, "") || "/"
}
// @from(Ln 204435, Col 0)
function jL8(q, K) {
    let _ = Pk.normalize(q),
        z = Pk.normalize(K);
    if (z === _) return !1;
    if (_.startsWith("/tmp/") && z === "/private" + _) return !1;
    if (_.startsWith("/var/") && z === "/private" + _) return !1;
    if (_.startsWith("/private/tmp/") && z === _) return !1;
    if (_.startsWith("/private/var/") && z === _) return !1;
    if (z === "/") return !0;
    if (z.split("/").filter(Boolean).length <= 1) return !0;
    if (_.startsWith(z + "/")) return !0;
    let A = _;
    if (_.startsWith("/tmp/")) A = "/private" + _;
    else if (_.startsWith("/var/")) A = "/private" + _;
    if (A !== _ && A.startsWith(z + "/")) return !0;
    let O = z.startsWith(_ + "/"),
        w = A !== _ && z.startsWith(A + "/");
    if (z !== _ && !(A !== _ && z === A) && !O && !w) return !0;
    return !1
}
// @from(Ln 204456, Col 0)
function Wk(q) {
    let K = process.cwd(),
        _ = q;
    if (q === "~") _ = dB1();
    else if (q.startsWith("~/")) _ = dB1() + q.slice(1);
    else if (q.startsWith("./") || q.startsWith("../")) _ = Pk.resolve(K, q);
    else if (!Pk.isAbsolute(q)) _ = Pk.resolve(K, q);
    if (yf(_)) {
        let z = _.split(/[*?[\]]/)[0];
        if (z && z !== "/") {
            let Y = z.endsWith("/") ? z.slice(0, -1) : Pk.dirname(z);
            try {
                let A = Aj6.realpathSync(Y);
                if (!jL8(Y, A)) {
                    let O = _.slice(Y.length);
                    return A + O
                }
            } catch {}
        }
        return _
    }
    try {
        let z = Aj6.realpathSync(_);
        if (jL8(_, z));
        else _ = z
    } catch {}
    return _
}
// @from(Ln 204485, Col 0)
function rs6() {
    let q = dB1();
    return ["/dev/stdout", "/dev/stderr", "/dev/null", "/dev/tty", "/dev/dtracehelper", "/dev/autofs_nowait", "/tmp/claude", "/private/tmp/claude", Pk.join(q, ".npm/_logs"), Pk.join(q, ".claude/debug")]
}
// @from(Ln 204490, Col 0)
function JL8(q, K) {
    let z = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR||"/tmp/claude"}`];
    if (!q && !K) return z;
    let Y = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
    if (z.push(`NO_PROXY=${Y}`), z.push(`no_proxy=${Y}`), q) z.push(`HTTP_PROXY=http://localhost:${q}`), z.push(`HTTPS_PROXY=http://localhost:${q}`), z.push(`http_proxy=http://localhost:${q}`), z.push(`https_proxy=http://localhost:${q}`);
    if (K) {
        z.push(`ALL_PROXY=socks5h://localhost:${K}`), z.push(`all_proxy=socks5h://localhost:${K}`);
        let A = nv();
        if (A === "macos") z.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${K} %h %p'`);
        else if (A === "linux" && q) z.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='socat - PROXY:localhost:%h:%p,proxyport=${q}'`);
        if (z.push(`FTP_PROXY=socks5h://localhost:${K}`), z.push(`ftp_proxy=socks5h://localhost:${K}`), z.push(`RSYNC_PROXY=localhost:${K}`), z.push(`DOCKER_HTTP_PROXY=http://localhost:${q||K}`), z.push(`DOCKER_HTTPS_PROXY=http://localhost:${q||K}`), q) z.push("CLOUDSDK_PROXY_TYPE=https"), z.push("CLOUDSDK_PROXY_ADDRESS=localhost"), z.push(`CLOUDSDK_PROXY_PORT=${q}`);
        z.push(`GRPC_PROXY=socks5h://localhost:${K}`), z.push(`grpc_proxy=socks5h://localhost:${K}`)
    }
    return z
}
// @from(Ln 204506, Col 0)
function XL8(q) {
    let K = q.slice(0, 100);
    return Buffer.from(K).toString("base64")
}
// @from(Ln 204511, Col 0)
function lj4(q) {
    return Buffer.from(q, "base64").toString("utf8")
}
// @from(Ln 204515, Col 0)
function s46(q) {
    return "^" + q.replace(/[.^$+{}()|\\]/g, "\\$&").replace(/\[([^\]]*?)$/g, "\\[$1").replace(/\*\*\//g, "__GLOBSTAR_SLASH__").replace(/\*\*/g, "__GLOBSTAR__").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]").replace(/__GLOBSTAR_SLASH__/g, "(.*/)?").replace(/__GLOBSTAR__/g, ".*") + "$"
}
// @from(Ln 204519, Col 0)
function os6(q) {
    let K = Wk(q),
        _ = K.split(/[*?[\]]/)[0];
    if (!_ || _ === "/") return x7(`[Sandbox] Glob pattern too broad, skipping: ${q}`), [];
    let z = _.endsWith("/") ? _.slice(0, -1) : Pk.dirname(_);
    if (!Aj6.existsSync(z)) return x7(`[Sandbox] Base directory for glob does not exist: ${z}`), [];
    let Y = new RegExp(s46(K)),
        A = [];
    try {
        let O = Aj6.readdirSync(z, {
            recursive: !0,
            withFileTypes: !0
        });
        for (let w of O) {
            let $ = w.parentPath ?? w.path ?? z,
                j = Pk.join($, w.name);
            if (Y.test(j)) A.push(j)
        }
    } catch (O) {
        x7(`[Sandbox] Error expanding glob pattern ${q}: ${O}`)
    }
    return A
}
// @from(Ln 204542, Col 4)
is6
// @from(Ln 204542, Col 9)
zl_
// @from(Ln 204543, Col 4)
pE6 = L(() => {
    wL8();
    is6 = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], zl_ = [".git", ".vscode", ".idea"]
})
// @from(Ln 204562, Col 0)
function $l_() {
    if (nB1) return nB1;
    let q = [];
    try {
        let _ = Ol_("npm root -g", {
            encoding: "utf8",
            timeout: 5000,
            stdio: ["pipe", "pipe", "ignore"]
        }).trim();
        if (_) q.push(Xp(_, "@anthropic-ai", "sandbox-runtime"))
    } catch {}
    let K = wl_();
    return q.push(Xp("/usr", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), Xp("/usr", "local", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), Xp("/opt", "homebrew", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), Xp(K, ".npm", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), Xp(K, ".npm-global", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime")), nB1 = q, q
}
// @from(Ln 204577, Col 0)
function nj4() {
    let q = process.arch;
    switch (q) {
        case "x64":
        case "x86_64":
            return "x64";
        case "arm64":
        case "aarch64":
            return "arm64";
        case "ia32":
        case "x86":
            return x7("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", {
                level: "error"
            }), null;
        default:
            return x7(`[SeccompFilter] Unsupported architecture: ${q}. Only x64 and arm64 are supported.`), null
    }
}
// @from(Ln 204596, Col 0)
function jl_(q) {
    let K = nj4();
    if (!K) return [];
    let _ = Yl_(Al_(import.meta.url)),
        z = Xp("vendor", "seccomp", K, q);
    return [Xp(_, z), Xp(_, "..", "..", z), Xp(_, "..", z)]
}
// @from(Ln 204604, Col 0)
function iB1(q) {
    let K = q ?? "";
    if (lB1.has(K)) return lB1.get(K);
    let _ = Hl_(q);
    return lB1.set(K, _), _
}
// @from(Ln 204611, Col 0)
function Hl_(q) {
    if (q) {
        if (ML8.existsSync(q)) return x7(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${q}`), q;
        x7(`[SeccompFilter] Explicit path provided but file not found: ${q}`)
    }
    let K = nj4();
    if (!K) return x7(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
    x7(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${K}`);
    for (let _ of jl_("apply-seccomp"))
        if (ML8.existsSync(_)) return x7(`[SeccompFilter] Found apply-seccomp binary: ${_} (${K})`), _;
    for (let _ of $l_()) {
        let z = Xp(_, "vendor", "seccomp", K, "apply-seccomp");
        if (ML8.existsSync(z)) return x7(`[SeccompFilter] Found apply-seccomp binary in global install: ${z} (${K})`), z
    }
    return x7(`[SeccompFilter] apply-seccomp binary not found in any expected location (${K})`), null
}
// @from(Ln 204627, Col 4)
lB1
// @from(Ln 204627, Col 9)
nB1 = null
// @from(Ln 204628, Col 4)
ij4 = L(() => {
    lB1 = new Map
})
// @from(Ln 204645, Col 0)
function Xl_(q, K) {
    let _ = q.split(IP.sep),
        z = "";
    for (let Y of _) {
        if (!Y) continue;
        let A = z + IP.sep + Y;
        try {
            if (rO.lstatSync(A).isSymbolicLink()) {
                if (K.some(($) => A.startsWith($ + "/") || A === $)) return A
            }
        } catch {
            break
        }
        z = A
    }
    return null
}
// @from(Ln 204663, Col 0)
function Ml_(q) {
    let K = q.split(IP.sep),
        _ = "";
    for (let z of K) {
        if (!z) continue;
        let Y = _ + IP.sep + z;
        try {
            let A = rO.statSync(Y);
            if (A.isFile() || A.isSymbolicLink()) return !0
        } catch {
            break
        }
        _ = Y
    }
    return !1
}
// @from(Ln 204680, Col 0)
function Pl_(q) {
    let K = q.split(IP.sep),
        _ = "";
    for (let z of K) {
        if (!z) continue;
        let Y = _ + IP.sep + z;
        if (!rO.existsSync(Y)) return Y;
        _ = Y
    }
    return q
}
// @from(Ln 204691, Col 0)
async function Wl_(q = {
    command: "rg"
}, K = oB1, _ = !1, z) {
    let Y = process.cwd(),
        A = new AbortController,
        O = z ?? A.signal,
        w = HL8(),
        $ = [...is6.map((M) => IP.resolve(Y, M)), ...w.map((M) => IP.resolve(Y, M))],
        j = IP.resolve(Y, ".git"),
        H = !1;
    try {
        H = rO.statSync(j).isDirectory()
    } catch {}
    if (H) {
        if ($.push(IP.resolve(Y, ".git/hooks")), !_) $.push(IP.resolve(Y, ".git/config"))
    }
    let J = [];
    for (let M of is6) J.push("--iglob", M);
    for (let M of w) J.push("--iglob", `**/${M}/**`);
    if (J.push("--iglob", "**/.git/hooks/**"), !_) J.push("--iglob", "**/.git/config");
    let X = [];
    try {
        X = await dj4(["--files", "--hidden", "--max-depth", String(K), ...J, "-g", "!**/node_modules/**"], Y, O, q)
    } catch (M) {
        x7(`[Sandbox] ripgrep scan failed: ${M}`)
    }
    for (let M of X) {
        let P = IP.resolve(Y, M),
            W = !1;
        for (let D of [...w, ".git"]) {
            let Z = cB1(D),
                G = P.split(IP.sep),
                f = G.findIndex((v) => cB1(v) === Z);
            if (f !== -1) {
                if (D === ".git") {
                    let v = G.slice(0, f + 1).join(IP.sep);
                    if (M.includes(".git/hooks")) $.push(IP.join(v, "hooks"));
                    else if (M.includes(".git/config")) $.push(IP.join(v, "config"))
                } else $.push(G.slice(0, f + 1).join(IP.sep));
                W = !0;
                break
            }
        }
        if (!W) $.push(P)
    }
    return [...new Set($)]
}
// @from(Ln 204739, Col 0)
function sj4() {
    if (aj4) return;
    process.on("exit", () => {
        WL8({
            force: !0
        })
    }), aj4 = !0
}
// @from(Ln 204748, Col 0)
function WL8(q) {
    if (!q?.force) {
        if (t46 > 0) t46--;
        if (t46 > 0) {
            x7(`[Sandbox Linux] Deferring mount point cleanup — ${t46} sandbox(es) still active`);
            return
        }
    } else t46 = 0;
    for (let K of PL8) try {
        let _ = rO.statSync(K);
        if (_.isFile() && _.size === 0) rO.unlinkSync(K), x7(`[Sandbox Linux] Cleaned up bwrap mount point (file): ${K}`);
        else if (_.isDirectory()) {
            if (rO.readdirSync(K).length === 0) rO.rmdirSync(K), x7(`[Sandbox Linux] Cleaned up bwrap mount point (dir): ${K}`)
        }
    } catch {}
    PL8.clear()
}
// @from(Ln 204766, Col 0)
function tj4(q) {
    let K = [],
        _ = [];
    if (ws("bwrap") === null) K.push("bubblewrap (bwrap) not installed");
    if (ws("socat") === null) K.push("socat not installed");
    if (!q?.argv0 && iB1(q?.applyPath) === null) _.push("seccomp not available - unix socket access not restricted");
    return {
        warnings: _,
        errors: K
    }
}
// @from(Ln 204777, Col 0)
async function ej4(q, K) {
    let _ = Jl_(8).toString("hex"),
        z = oj4(rB1(), `claude-http-${_}.sock`),
        Y = oj4(rB1(), `claude-socks-${_}.sock`),
        A = [`UNIX-LISTEN:${z},fork,reuseaddr`, `TCP:localhost:${q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    x7(`Starting HTTP bridge: socat ${A.join(" ")}`);
    let O = rj4("socat", A, {
        stdio: "ignore"
    });
    if (!O.pid) throw Error("Failed to start HTTP bridge process");
    O.on("error", (H) => {
        x7(`HTTP bridge process error: ${H}`, {
            level: "error"
        })
    }), O.on("exit", (H, J) => {
        x7(`HTTP bridge process exited with code ${H}, signal ${J}`, {
            level: H === 0 ? "info" : "error"
        })
    });
    let w = [`UNIX-LISTEN:${Y},fork,reuseaddr`, `TCP:localhost:${K},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    x7(`Starting SOCKS bridge: socat ${w.join(" ")}`);
    let $ = rj4("socat", w, {
        stdio: "ignore"
    });
    if (!$.pid) {
        if (O.pid) try {
            process.kill(O.pid, "SIGTERM")
        } catch {}
        throw Error("Failed to start SOCKS bridge process")
    }
    $.on("error", (H) => {
        x7(`SOCKS bridge process error: ${H}`, {
            level: "error"
        })
    }), $.on("exit", (H, J) => {
        x7(`SOCKS bridge process exited with code ${H}, signal ${J}`, {
            level: H === 0 ? "info" : "error"
        })
    });
    let j = 5;
    for (let H = 0; H < j; H++) {
        if (!O.pid || O.killed || !$.pid || $.killed) throw Error("Linux bridge process died unexpectedly");
        try {
            if (rO.existsSync(z) && rO.existsSync(Y)) {
                x7(`Linux bridges ready after ${H+1} attempts`);
                break
            }
        } catch (J) {
            x7(`Error checking sockets (attempt ${H+1}): ${J}`, {
                level: "error"
            })
        }
        if (H === j - 1) {
            if (O.pid) try {
                process.kill(O.pid, "SIGTERM")
            } catch {}
            if ($.pid) try {
                process.kill($.pid, "SIGTERM")
            } catch {}
            throw Error(`Failed to create bridge sockets after ${j} attempts`)
        }
        await new Promise((J) => setTimeout(J, H * 100))
    }
    return {
        httpSocketPath: z,
        socksSocketPath: Y,
        httpBridgeProcess: O,
        socksBridgeProcess: $,
        httpProxyPort: q,
        socksProxyPort: K
    }
}
// @from(Ln 204850, Col 0)
function Dl_(q, K) {
    if (K) {
        if (!q) throw Error("seccompConfig.argv0 requires seccompConfig.applyPath");
        return `ARGV0=${Qd.default.quote([K])} ${Qd.default.quote([q])} `
    }
    let _ = iB1(q);
    return _ ? `${Qd.default.quote([_])} ` : void 0
}
// @from(Ln 204859, Col 0)
function Zl_(q, K, _, z, Y) {
    let A = Y || "bash",
        O = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${q} >/dev/null 2>&1 &`, `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${K} >/dev/null 2>&1 &`, 'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
    if (z) {
        let w = z + Qd.default.quote([A, "-c", _]),
            $ = [...O, w].join(`
`);
        return `${A} -c ${Qd.default.quote([$])}`
    } else {
        let w = [...O, `eval ${Qd.default.quote([_])}`].join(`
`);
        return `${A} -c ${Qd.default.quote([w])}`
    }
}
// @from(Ln 204873, Col 0)
async function fl_(q, K, _ = {
    command: "rg"
}, z = oB1, Y = !1, A) {
    let O = [],
        w = [],
        $ = [];
    if (K) {
        O.push("--ro-bind", "/", "/");
        for (let D of K.allowOnly || []) {
            let Z = Wk(D);
            if (x7(`[Sandbox Linux] Processing write path: ${D} -> ${Z}`), Z.startsWith("/dev/")) {
                x7(`[Sandbox Linux] Skipping /dev path: ${Z}`);
                continue
            }
            if (!rO.existsSync(Z)) {
                x7(`[Sandbox Linux] Skipping non-existent write path: ${Z}`);
                continue
            }
            try {
                let G = rO.realpathSync(Z),
                    f = Z.replace(/\/+$/, "");
                if (G !== f && jL8(Z, G)) {
                    x7(`[Sandbox Linux] Skipping symlink write path pointing outside expected location: ${D} -> ${G}`);
                    continue
                }
            } catch {
                x7(`[Sandbox Linux] Skipping write path that could not be resolved: ${Z}`);
                continue
            }
            O.push("--bind", Z, Z), w.push(Z)
        }
        let P = [...K.denyWithinAllow || [], ...await Wl_(_, z, Y, A)],
            W = new Set;
        for (let D of P) {
            let Z = Wk(D);
            if (W.has(Z)) continue;
            if (W.add(Z), Z.startsWith("/dev/")) continue;
            let G = Xl_(Z, w);
            if (G) {
                $.push("--ro-bind", "/dev/null", G), x7(`[Sandbox Linux] Mounted /dev/null at symlink ${G} to prevent symlink replacement attack`);
                continue
            }
            if (!rO.existsSync(Z)) {
                if (Ml_(Z)) {
                    x7(`[Sandbox Linux] Skipping deny path with file ancestor (cannot create paths under a file): ${Z}`);
                    continue
                }
                let v = IP.dirname(Z);
                while (v !== "/" && !rO.existsSync(v)) v = IP.dirname(v);
                if (w.some((k) => v.startsWith(k + "/") || v === k || Z.startsWith(k + "/"))) {
                    let k = Pl_(Z);
                    if (k !== Z) {
                        let N = rO.mkdtempSync(IP.join(rB1(), "claude-empty-"));
                        $.push("--ro-bind", N, k), PL8.add(k), sj4(), x7(`[Sandbox Linux] Mounted empty dir at ${k} to block creation of ${Z}`)
                    } else $.push("--ro-bind", "/dev/null", k), PL8.add(k), sj4(), x7(`[Sandbox Linux] Mounted /dev/null at ${k} to block creation of ${Z}`)
                } else x7(`[Sandbox Linux] Skipping non-existent deny path not within allowed paths: ${Z}`);
                continue
            }
            if (w.some((v) => Z.startsWith(v + "/") || Z === v)) $.push("--ro-bind", Z, Z);
            else x7(`[Sandbox Linux] Skipping deny path not within allowed paths: ${Z}`)
        }
    } else O.push("--bind", "/", "/");
    let j = [],
        H = (q?.allowWithinDeny || []).map((P) => Wk(P)),
        J = new Set,
        X = new Set(["proc", "dev", "sys"]);
    for (let P of q?.denyOnly || [])
        if (Wk(P) === "/") {
            for (let W of rO.readdirSync("/"))
                if (!X.has(W)) j.push("/" + W)
        } else j.push(P);
    if (rO.existsSync("/etc/ssh/ssh_config.d")) j.push("/etc/ssh/ssh_config.d");
    let M = j.map((P) => Wk(P)).sort((P, W) => P.split("/").length - W.split("/").length);
    for (let P of M) {
        if (!rO.existsSync(P)) {
            x7(`[Sandbox Linux] Skipping non-existent read deny path: ${P}`);
            continue
        }
        let W = P === "/" ? "/" : P + "/";
        if (rO.statSync(P).isDirectory()) {
            O.push("--tmpfs", P);
            for (let Z of w)
                if (Z.startsWith(W) || Z === P) O.push("--bind", Z, Z), x7(`[Sandbox Linux] Re-bound write path wiped by denyRead tmpfs: ${Z}`);
            for (let Z of H)
                if (Z.startsWith(W) || Z === P) {
                    if (!rO.existsSync(Z)) {
                        x7(`[Sandbox Linux] Skipping non-existent read allow path: ${Z}`);
                        continue
                    }
                    if (w.some((G) => (G.startsWith(W) || G === P) && (Z === G || Z.startsWith(G + "/")))) continue;
                    O.push("--ro-bind", Z, Z), x7(`[Sandbox Linux] Re-allowed read access within denied region: ${Z}`)
                }
        } else {
            if (H.includes(P)) {
                x7(`[Sandbox Linux] Skipping read deny for re-allowed path: ${P}`);
                continue
            }
            O.push("--ro-bind", "/dev/null", P), J.add(P)
        }
    }
    for (let P = 0; P < $.length; P += 3) {
        let W = $[P + 2];
        if (J.has(W)) continue;
        O.push($[P], $[P + 1], W)
    }
    return O
}
// @from(Ln 204980, Col 0)
async function qH4(q) {
    let {
        command: K,
        needsNetworkRestriction: _,
        httpSocketPath: z,
        socksSocketPath: Y,
        httpProxyPort: A,
        socksProxyPort: O,
        readConfig: w,
        writeConfig: $,
        enableWeakerNestedSandbox: j,
        allowAllUnixSockets: H,
        binShell: J,
        ripgrepConfig: X = {
            command: "rg"
        },
        mandatoryDenySearchDepth: M = oB1,
        allowGitConfig: P = !1,
        seccompConfig: W,
        abortSignal: D
    } = q, Z = w && w.denyOnly.length > 0, G = $ !== void 0;
    if (!_ && !Z && !G) return K;
    t46++;
    let f = ["--new-session", "--die-with-parent"],
        v;
    try {
        if (!H)
            if (v = Dl_(W?.applyPath, W?.argv0), !v) x7("[Sandbox Linux] apply-seccomp binary not available - unix socket blocking disabled. Install @anthropic-ai/sandbox-runtime globally for full protection.", {
                level: "warn"
            });
            else x7("[Sandbox Linux] Applying seccomp filter for Unix socket blocking");
        else x7("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
        if (_) {
            if (f.push("--unshare-net"), z && Y) {
                if (!rO.existsSync(z)) throw Error(`Linux HTTP bridge socket does not exist: ${z}. The bridge process may have died. Try reinitializing the sandbox.`);
                if (!rO.existsSync(Y)) throw Error(`Linux SOCKS bridge socket does not exist: ${Y}. The bridge process may have died. Try reinitializing the sandbox.`);
                f.push("--bind", z, z), f.push("--bind", Y, Y);
                let C = JL8(3128, 1080);
                if (f.push(...C.flatMap((x) => {
                        let B = x.indexOf("="),
                            m = x.slice(0, B),
                            S = x.slice(B + 1);
                        return ["--setenv", m, S]
                    })), A !== void 0) f.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(A));
                if (O !== void 0) f.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(O))
            }
        }
        let V = await fl_(w, $, X, M, P, D);
        if (f.push(...V), f.push("--dev", "/dev"), f.push("--unshare-pid"), !j) f.push("--proc", "/proc");
        else f.push("--unshare-user", "--bind", "/proc", "/proc");
        let k = J || "bash",
            N = ws(k);
        if (!N) throw Error(`Shell '${k}' not found in PATH`);
        if (f.push("--", N, "-c"), _ && z && Y) {
            let C = Zl_(z, Y, K, v, N);
            f.push(C)
        } else if (v) {
            let C = v + Qd.default.quote([N, "-c", K]);
            f.push(C)
        } else f.push(K);
        let R = Qd.default.quote(["bwrap", ...f]),
            h = [];
        if (_) h.push("network");
        if (Z || G) h.push("filesystem");
        if (v) h.push("seccomp(unix-block)");
        return x7(`[Sandbox Linux] Wrapped command with bwrap (${h.join(", ")} restrictions)`), R
    } catch (V) {
        if (t46 > 0) t46--;
        throw V
    }
}
// @from(Ln 205051, Col 4)
Qd
// @from(Ln 205051, Col 8)
oB1 = 3
// @from(Ln 205052, Col 4)
PL8
// @from(Ln 205052, Col 9)
t46 = 0
// @from(Ln 205053, Col 4)
aj4 = !1
// @from(Ln 205054, Col 4)
KH4 = L(() => {
    ns6();
    cj4();
    pE6();
    ij4();
    Qd = K6(QB1(), 1);
    PL8 = new Set
})
// @from(Ln 205067, Col 0)
function vl_(q = !1) {
    let K = process.cwd(),
        _ = [];
    for (let z of is6) _.push(js.resolve(K, z)), _.push(`**/${z}`);
    for (let z of HL8()) _.push(js.resolve(K, z)), _.push(`**/${z}/**`);
    if (_.push(js.resolve(K, ".git/hooks")), _.push("**/.git/hooks/**"), !q) _.push(js.resolve(K, ".git/config")), _.push("**/.git/config");
    return [...new Set(_)]
}
// @from(Ln 205076, Col 0)
function Tl_(q) {
    return `CMD64_${XL8(q)}_END_${YH4}`
}
// @from(Ln 205080, Col 0)
function _H4(q) {
    let K = [],
        _ = js.dirname(q);
    while (_ !== "/" && _ !== ".") {
        K.push(_);
        let z = js.dirname(_);
        if (z === _) break;
        _ = z
    }
    return K
}
// @from(Ln 205092, Col 0)
function AH4(q, K) {
    let _ = [];
    for (let z of q) {
        let Y = Wk(z);
        if (yf(Y)) {
            let A = s46(Y);
            _.push("(deny file-write-unlink", `  (regex ${lW(A)})`, `  (with message "${K}"))`);
            let O = Y.split(/[*?[\]]/)[0];
            if (O && O !== "/") {
                let w = O.endsWith("/") ? O.slice(0, -1) : js.dirname(O);
                _.push("(deny file-write-unlink", `  (literal ${lW(w)})`, `  (with message "${K}"))`);
                for (let $ of _H4(w)) _.push("(deny file-write-unlink", `  (literal ${lW($)})`, `  (with message "${K}"))`)
            }
        } else {
            _.push("(deny file-write-unlink", `  (subpath ${lW(Y)})`, `  (with message "${K}"))`);
            for (let A of _H4(Y)) _.push("(deny file-write-unlink", `  (literal ${lW(A)})`, `  (with message "${K}"))`)
        }
    }
    return _
}
// @from(Ln 205113, Col 0)
function Vl_(q, K, _) {
    if (!q) return ["(allow file-read*)"];
    let z = [],
        Y = !1;
    z.push("(allow file-read*)");
    for (let A of q.denyOnly || []) {
        let O = Wk(A);
        if (O === "/") Y = !0;
        if (yf(O)) {
            let w = s46(O);
            z.push("(deny file-read*", `  (regex ${lW(w)})`, `  (with message "${K}"))`)
        } else z.push("(deny file-read*", `  (subpath ${lW(O)})`, `  (with message "${K}"))`)
    }
    if (Y) z.push('(allow file-read* (literal "/"))');
    for (let A of q.allowWithinDeny || []) {
        let O = Wk(A);
        if (yf(O)) {
            let w = s46(O);
            z.push("(allow file-read*", `  (regex ${lW(w)})`, `  (with message "${K}"))`)
        } else z.push("(allow file-read*", `  (subpath ${lW(O)})`, `  (with message "${K}"))`)
    }
    if (q.denyOnly.length > 0) z.push("(allow file-read-metadata", "  (vnode-type DIRECTORY))");
    if (z.push(...AH4(q.denyOnly || [], K)), _ && _.length > 0)
        for (let A of _) {
            let O = Wk(A);
            if (yf(O)) {
                let w = s46(O);
                z.push("(allow file-write-unlink", `  (regex ${lW(w)})`, `  (with message "${K}"))`)
            } else z.push("(allow file-write-unlink", `  (subpath ${lW(O)})`, `  (with message "${K}"))`)
        }
    return z
}
// @from(Ln 205146, Col 0)
function kl_(q, K, _ = !1) {
    if (!q) return ["(allow file-write*)"];
    let z = [];
    for (let A of q.allowOnly || []) {
        let O = Wk(A);
        if (yf(O)) {
            let w = s46(O);
            z.push("(allow file-write*", `  (regex ${lW(w)})`, `  (with message "${K}"))`)
        } else z.push("(allow file-write*", `  (subpath ${lW(O)})`, `  (with message "${K}"))`)
    }
    let Y = [...q.denyWithinAllow || [], ...vl_(_)];
    for (let A of Y) {
        let O = Wk(A);
        if (yf(O)) {
            let w = s46(O);
            z.push("(deny file-write*", `  (regex ${lW(w)})`, `  (with message "${K}"))`)
        } else z.push("(deny file-write*", `  (subpath ${lW(O)})`, `  (with message "${K}"))`)
    }
    return z.push(...AH4(Y, K)), z
}
// @from(Ln 205167, Col 0)
function Nl_({
    readConfig: q,
    writeConfig: K,
    httpProxyPort: _,
    socksProxyPort: z,
    needsNetworkRestriction: Y,
    allowUnixSockets: A,
    allowAllUnixSockets: O,
    allowLocalBinding: w,
    allowMachLookup: $,
    allowPty: j,
    allowGitConfig: H = !1,
    enableWeakerNetworkIsolation: J = !1,
    logTag: X
}) {
    let M = ["(version 1)", `(deny default (with message "${X}"))`, "", `; LogTag: ${X}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", "; Mach IPC - specific services only (no wildcard)", "(allow mach-lookup", '  (global-name "com.apple.audio.systemsoundserver")', '  (global-name "com.apple.distributed_notifications@Uv3")', '  (global-name "com.apple.FontObjectsServer")', '  (global-name "com.apple.fonts")', '  (global-name "com.apple.logd")', '  (global-name "com.apple.lsd.mapdb")', '  (global-name "com.apple.PowerManagement.control")', '  (global-name "com.apple.system.logger")', '  (global-name "com.apple.system.notification_center")', '  (global-name "com.apple.system.opendirectoryd.libinfo")', '  (global-name "com.apple.system.opendirectoryd.membership")', '  (global-name "com.apple.bsd.dirhelper")', '  (global-name "com.apple.securityd.xpc")', '  (global-name "com.apple.coreservices.launchservicesd")', ")", "", ...J ? ["; trustd.agent - needed for Go TLS certificate verification (weaker network isolation)", '(allow mach-lookup (global-name "com.apple.trustd.agent"))'] : [], ...$ && $.length > 0 ? ["; User-specified XPC/Mach services", ...$.map((W) => W.endsWith("*") ? `(allow mach-lookup (global-name-prefix ${lW(W.slice(0,-1))}))` : `(allow mach-lookup (global-name ${lW(W)}))`)] : [], "", "; POSIX IPC - shared memory", "(allow ipc-posix-shm)", "", "; POSIX IPC - semaphores for Python multiprocessing", "(allow ipc-posix-sem)", "", "; IOKit - specific operations only", "(allow iokit-open", '  (iokit-registry-entry-class "IOSurfaceRootUserClient")', '  (iokit-registry-entry-class "RootDomainUserClient")', '  (iokit-user-client-class "IOSurfaceSendRight")', ")", "", "; IOKit properties", "(allow iokit-get-properties)", "", "; Specific safe system-sockets, doesn't allow network access", "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))", "", "; sysctl - specific sysctls only", "(allow sysctl-read", '  (sysctl-name "hw.activecpu")', '  (sysctl-name "hw.busfrequency_compat")', '  (sysctl-name "hw.byteorder")', '  (sysctl-name "hw.cacheconfig")', '  (sysctl-name "hw.cachelinesize_compat")', '  (sysctl-name "hw.cpufamily")', '  (sysctl-name "hw.cpufrequency")', '  (sysctl-name "hw.cpufrequency_compat")', '  (sysctl-name "hw.cputype")', '  (sysctl-name "hw.l1dcachesize_compat")', '  (sysctl-name "hw.l1icachesize_compat")', '  (sysctl-name "hw.l2cachesize_compat")', '  (sysctl-name "hw.l3cachesize_compat")', '  (sysctl-name "hw.logicalcpu")', '  (sysctl-name "hw.logicalcpu_max")', '  (sysctl-name "hw.machine")', '  (sysctl-name "hw.memsize")', '  (sysctl-name "hw.ncpu")', '  (sysctl-name "hw.nperflevels")', '  (sysctl-name "hw.packages")', '  (sysctl-name "hw.pagesize_compat")', '  (sysctl-name "hw.pagesize")', '  (sysctl-name "hw.physicalcpu")', '  (sysctl-name "hw.physicalcpu_max")', '  (sysctl-name "hw.tbfrequency_compat")', '  (sysctl-name "hw.vectorunit")', '  (sysctl-name "kern.argmax")', '  (sysctl-name "kern.bootargs")', '  (sysctl-name "kern.hostname")', '  (sysctl-name "kern.maxfiles")', '  (sysctl-name "kern.maxfilesperproc")', '  (sysctl-name "kern.maxproc")', '  (sysctl-name "kern.ngroups")', '  (sysctl-name "kern.osproductversion")', '  (sysctl-name "kern.osrelease")', '  (sysctl-name "kern.ostype")', '  (sysctl-name "kern.osvariant_status")', '  (sysctl-name "kern.osversion")', '  (sysctl-name "kern.secure_kernel")', '  (sysctl-name "kern.tcsm_available")', '  (sysctl-name "kern.tcsm_enable")', '  (sysctl-name "kern.usrstack64")', '  (sysctl-name "kern.version")', '  (sysctl-name "kern.willshutdown")', '  (sysctl-name "machdep.cpu.brand_string")', '  (sysctl-name "machdep.ptrauth_enabled")', '  (sysctl-name "security.mac.lockdown_mode_state")', '  (sysctl-name "sysctl.proc_cputype")', '  (sysctl-name "vm.loadavg")', '  (sysctl-name-prefix "hw.optional.arm")', '  (sysctl-name-prefix "hw.optional.arm.")', '  (sysctl-name-prefix "hw.optional.armv8_")', '  (sysctl-name-prefix "hw.perflevel")', '  (sysctl-name-prefix "kern.proc.all")', '  (sysctl-name-prefix "kern.proc.pgrp.")', '  (sysctl-name-prefix "kern.proc.pid.")', '  (sysctl-name-prefix "machdep.cpu.")', '  (sysctl-name-prefix "net.routetable.")', ")", "", "; V8 thread calculations", "(allow sysctl-write", '  (sysctl-name "kern.tcsm_enable")', ")", "", "; Distributed notifications", "(allow distributed-notification-post)", "", "; Specific mach-lookup permissions for security operations", '(allow mach-lookup (global-name "com.apple.SecurityServer"))', "", "; File I/O on device files", '(allow file-ioctl (literal "/dev/null"))', '(allow file-ioctl (literal "/dev/zero"))', '(allow file-ioctl (literal "/dev/random"))', '(allow file-ioctl (literal "/dev/urandom"))', '(allow file-ioctl (literal "/dev/dtracehelper"))', '(allow file-ioctl (literal "/dev/tty"))', "", "(allow file-ioctl file-read-data file-write-data", "  (require-all", '    (literal "/dev/null")', "    (vnode-type CHARACTER-DEVICE)", "  )", ")", ""];
    if (M.push("; Network"), !Y) M.push("(allow network*)");
    else {
        if (w) M.push('(allow network-bind (local ip "*:*"))'), M.push('(allow network-inbound (local ip "*:*"))'), M.push('(allow network-outbound (local ip "*:*"))');
        if (O) M.push("(allow system-socket (socket-domain AF_UNIX))"), M.push('(allow network-bind (local unix-socket (path-regex #"^/")))'), M.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
        else if (A && A.length > 0) {
            M.push("(allow system-socket (socket-domain AF_UNIX))");
            for (let W of A) {
                let D = Wk(W);
                M.push(`(allow network-bind (local unix-socket (subpath ${lW(D)})))`), M.push(`(allow network-outbound (remote unix-socket (subpath ${lW(D)})))`)
            }
        }
        if (_ !== void 0) M.push(`(allow network-bind (local ip "localhost:${_}"))`), M.push(`(allow network-inbound (local ip "localhost:${_}"))`), M.push(`(allow network-outbound (remote ip "localhost:${_}"))`);
        if (z !== void 0) M.push(`(allow network-bind (local ip "localhost:${z}"))`), M.push(`(allow network-inbound (local ip "localhost:${z}"))`), M.push(`(allow network-outbound (remote ip "localhost:${z}"))`)
    }
    M.push("");
    let P = K?.allowOnly;
    if (M.push("; File read"), M.push(...Vl_(q, X, P)), M.push(""), M.push("; File write"), M.push(...kl_(K, X, H)), j) M.push(""), M.push("; Pseudo-terminal (pty) support"), M.push("(allow pseudo-tty)"), M.push("(allow file-ioctl"), M.push('  (literal "/dev/ptmx")'), M.push('  (regex #"^/dev/ttys")'), M.push(")"), M.push("(allow file-read* file-write*"), M.push('  (literal "/dev/ptmx")'), M.push('  (regex #"^/dev/ttys")'), M.push(")");
    return M.join(`
`)
}
// @from(Ln 205204, Col 0)
function lW(q) {
    return JSON.stringify(q)
}
// @from(Ln 205208, Col 0)
function OH4(q) {
    let {
        command: K,
        needsNetworkRestriction: _,
        httpProxyPort: z,
        socksProxyPort: Y,
        allowUnixSockets: A,
        allowAllUnixSockets: O,
        allowLocalBinding: w,
        allowMachLookup: $,
        readConfig: j,
        writeConfig: H,
        allowPty: J,
        allowGitConfig: X = !1,
        enableWeakerNetworkIsolation: M = !1,
        binShell: P
    } = q, W = j && j.denyOnly.length > 0;
    if (!_ && !W && H === void 0) return K;
    let Z = Tl_(K),
        G = Nl_({
            readConfig: j,
            writeConfig: H,
            httpProxyPort: z,
            socksProxyPort: Y,
            needsNetworkRestriction: _,
            allowUnixSockets: A,
            allowAllUnixSockets: O,
            allowLocalBinding: w,
            allowMachLookup: $,
            allowPty: J,
            allowGitConfig: X,
            enableWeakerNetworkIsolation: M,
            logTag: Z
        }),
        f = JL8(z, Y),
        v = P || "bash",
        V = ws(v);
    if (!V) throw Error(`Shell '${v}' not found in PATH`);
    let k = zH4.default.quote(["env", ...f, "sandbox-exec", "-p", G, V, "-c", K]);
    return x7(`[Sandbox macOS] Applied restrictions - network: ${!!(z||Y)}, read: ${j?"allowAllExcept"in j?"allowAllExcept":"denyAllExcept":"none"}, write: ${H?"allowAllExcept"in H?"allowAllExcept":"denyAllExcept":"none"}`), k
}
// @from(Ln 205250, Col 0)
function wH4(q, K) {
    let _ = /CMD64_(.+?)_END/,
        z = /Sandbox:\s+(.+)$/,
        Y = K?.["*"] || [],
        A = K ? Object.entries(K).filter(([w]) => w !== "*") : [],
        O = Gl_("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${YH4}")`, "--style", "compact"]);
    return O.stdout?.on("data", (w) => {
        let $ = w.toString().split(`
`),
            j = $.find((W) => W.includes("Sandbox:") && W.includes("deny")),
            H = $.find((W) => W.startsWith("CMD64_"));
        if (!j) return;
        let J = j.match(z);
        if (!J?.[1]) return;
        let X = J[1],
            M, P;
        if (H) {
            if (P = H.match(_)?.[1], P) try {
                M = lj4(P)
            } catch {}
        }
        if (X.includes("mDNSResponder") || X.includes("mach-lookup com.apple.diagnosticd") || X.includes("mach-lookup com.apple.analyticsd")) return;
        if (K && M) {
            if (Y.length > 0) {
                if (Y.some((D) => X.includes(D))) return
            }
            for (let [W, D] of A)
                if (M.includes(W)) {
                    if (D.some((G) => X.includes(G))) return
                }
        }
        q({
            line: X,
            command: M,
            encodedCommand: P,
            timestamp: new Date
        })
    }), O.stderr?.on("data", (w) => {
        x7(`[Sandbox Monitor] Log stream stderr: ${w.toString()}`)
    }), O.on("error", (w) => {
        x7(`[Sandbox Monitor] Failed to start log stream: ${w.message}`)
    }), O.on("exit", (w) => {
        x7(`[Sandbox Monitor] Log stream exited with code: ${w}`)
    }), () => {
        x7("[Sandbox Monitor] Stopping log monitor"), O.kill("SIGTERM")
    }
}
// @from(Ln 205297, Col 4)
zH4
// @from(Ln 205297, Col 9)
YH4
// @from(Ln 205298, Col 4)
$H4 = L(() => {
    ns6();
    pE6();
    zH4 = K6(QB1(), 1);
    YH4 = `_${Math.random().toString(36).slice(2,11)}_SBX`
})
// @from(Ln 205304, Col 0)
class FE6 {
    constructor() {
        this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
    }
    addViolation(q) {
        if (this.violations.push(q), this.totalCount++, this.violations.length > this.maxSize) this.violations = this.violations.slice(-this.maxSize);
        this.notifyListeners()
    }
    getViolations(q) {
        if (q === void 0) return [...this.violations];
        return this.violations.slice(-q)
    }
    getCount() {
        return this.violations.length
    }
    getTotalCount() {
        return this.totalCount
    }
    getViolationsForCommand(q) {
        let K = XL8(q);
        return this.violations.filter((_) => _.encodedCommand === K)
    }
    clear() {
        this.violations = [], this.notifyListeners()
    }
    subscribe(q) {
        return this.listeners.add(q), q(this.getViolations()), () => {
            this.listeners.delete(q)
        }
    }
    notifyListeners() {
        let q = this.getViolations();
        this.listeners.forEach((K) => K(q))
    }
}
// @from(Ln 205339, Col 4)
aB1 = L(() => {
    pE6()
})
// @from(Ln 205350, Col 0)
function yl_() {
    if (jH4) return;
    let q = () => qp1().catch((K) => {
        x7(`Cleanup failed in registerCleanup ${K}`, {
            level: "error"
        })
    });
    process.once("exit", q), process.once("SIGINT", q), process.once("SIGTERM", q), jH4 = !0
}
// @from(Ln 205360, Col 0)
function eB1(q, K) {
    let _ = q.toLowerCase();
    if (K.startsWith("*.")) {
        if (El_(Jp(_))) return !1;
        let z = K.substring(2).toLowerCase();
        return _.endsWith("." + z)
    }
    return _ === K.toLowerCase()
}
// @from(Ln 205369, Col 0)
async function XH4(q, K, _) {
    if (!q9) return x7("No config available, denying network request"), !1;
    if (!ls6(K)) return x7(`Denying malformed host: ${JSON.stringify(K)}:${q}`, {
        level: "error"
    }), !1;
    let z = fj4(K) ?? K;
    for (let Y of q9.network.deniedDomains)
        if (eB1(z, Y)) return x7(`Denied by config rule: ${K}:${q}`), !1;
    for (let Y of q9.network.allowedDomains)
        if (eB1(z, Y)) return x7(`Allowed by config rule: ${K}:${q}`), !0;
    if (!_) return x7(`No matching config rule, denying: ${K}:${q}`), !1;
    x7(`No matching config rule, asking user: ${K}:${q}`);
    try {
        if (await _({
                host: K,
                port: q
            })) return x7(`User allowed: ${K}:${q}`), !0;
        else return x7(`User denied: ${K}:${q}`), !1
    } catch (Y) {
        return x7(`Error in permission callback: ${Y}`, {
            level: "error"
        }), !1
    }
}
// @from(Ln 205394, Col 0)
function Ll_(q) {
    if (!q9?.network.mitmProxy) return;
    let {
        socketPath: K,
        domains: _
    } = q9.network.mitmProxy;
    for (let z of _)
        if (eB1(q, z)) return x7(`Host ${q} matches MITM pattern ${z}`), K;
    return
}
// @from(Ln 205404, Col 0)
async function hl_(q) {
    return gE6 = vj4({
        filter: (K, _) => XH4(K, _, q),
        getMitmSocketPath: Ll_,
        parentProxy: qK6
    }), new Promise((K, _) => {
        if (!gE6) {
            _(Error("HTTP proxy server undefined before listen"));
            return
        }
        let z = gE6;
        z.once("error", _), z.once("listening", () => {
            let Y = z.address();
            if (Y && typeof Y === "object") z.unref(), x7(`HTTP proxy listening on localhost:${Y.port}`), K(Y.port);
            else _(Error("Failed to get proxy server address"))
        }), z.listen(0, "127.0.0.1")
    })
}
// @from(Ln 205422, Col 0)
async function Rl_(q) {
    return Oj6 = Sj4({
        filter: (K, _) => XH4(K, _, q),
        parentProxy: qK6
    }), new Promise((K, _) => {
        if (!Oj6) {
            _(Error("SOCKS proxy server undefined before listen"));
            return
        }
        Oj6.listen(0, "127.0.0.1").then((z) => {
            Oj6?.unref(), K(z)
        }).catch(_)
    })
}
// @from(Ln 205436, Col 0)
async function Sl_(q, K, _ = !1) {
    if (e46) {
        await e46;
        return
    }
    if (q9 = q, qK6 = IB1(q.network.parentProxy), qK6) x7(`Parent proxy configured: http=${mB1(qK6.httpUrl)} https=${mB1(qK6.httpsUrl)}`);
    let z = PH4();
    if (z.errors.length > 0) throw Error(`Sandbox dependencies not available: ${z.errors.join(", ")}`);
    if (_ && nv() === "macos") DL8 = wH4(ZL8.addViolation.bind(ZL8), q9.ignoreViolations), x7("Started macOS sandbox log monitor");
    yl_(), e46 = (async () => {
        try {
            let Y;
            if (q9.network.httpProxyPort !== void 0) Y = q9.network.httpProxyPort, x7(`Using external HTTP proxy on port ${Y}`);
            else Y = await hl_(K);
            let A;
            if (q9.network.socksProxyPort !== void 0) A = q9.network.socksProxyPort, x7(`Using external SOCKS proxy on port ${A}`);
            else A = await Rl_(K);
            let O;
            if (nv() === "linux") O = await ej4(Y, A);
            let w = {
                httpProxyPort: Y,
                socksProxyPort: A,
                linuxBridge: O
            };
            return mI = w, x7("Network infrastructure initialized"), w
        } catch (Y) {
            throw e46 = void 0, mI = void 0, qp1().catch((A) => {
                x7(`Cleanup failed in initializationPromise ${A}`, {
                    level: "error"
                })
            }), Y
        }
    })(), await e46
}
// @from(Ln 205471, Col 0)
function MH4() {
    let q = nv();
    if (q === "linux") return gB1() !== "1";
    return q === "macos"
}
// @from(Ln 205477, Col 0)
function Cl_() {
    return q9 !== void 0
}